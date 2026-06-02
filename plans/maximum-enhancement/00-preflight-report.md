# Preflight Report: maximum-enhancement

> **Status**: ✅ PASSED WITH NOTES — 8 findings resolved (0 🔴, 2 🟠, 4 🟡, 2 🔵)
> **Iteration**: 1
> **Artifact**: Implementation plan at `plans/maximum-enhancement/` (11 docs)
> **Codebase Grounded**: ✅ 11 source files examined, all references verified
> **Last Updated**: 2026-06-02

> ⚠️ **SAME-AGENT REVIEW:** This plan was authored by the same model in a prior
> session. Same-agent bias risk is elevated; review focused adversarially on the
> LLM continuation logic and provider-API assumptions, where such bias hides.

## Codebase Context Summary

- **Tech Stack:** TypeScript ESM, Node ≥18, Vitest. Enhancer pipeline in
  `scripts/enhancer/`; runtime schema/formatters/tools in `src/`.
- **Architecture:** Scraper → Enhancer (LLM) → Enhanced JSON → MCP server.
  `runEnhancement` orchestrates four LLM batches (component, utility, guide,
  pattern) via `provider.chat`.
- **Key Files Examined:** `scripts/enhancer/enhancer.ts`, `config.ts`,
  `parse.ts`, `types.ts`, `prompts/shared.ts`, `prompts/component-enhance.ts`,
  `llm/provider.ts`, `llm/openai.ts`, `llm/anthropic.ts`, `llm/batch.ts`,
  `src/types/schema.ts`, `src/schema/schema-validator.ts`,
  `src/formatters/component-formatter.ts`, `props-formatter.ts`.

**Reference verification:** All plan references mapped to code and **verified**:
`KEY_PROPS_LIMIT = 6` (shared.ts:15), `DEFAULT_MAX_TOKENS = 4096`
(anthropic.ts:39), orchestrator passes only `{temperature, responseFormat}` (no
maxTokens), `LLMChatOptions.maxTokens` already exists (types.ts:335), OpenAI
sends `max_tokens` only when provided (openai.ts:87-88), `PatternExample` /
`ComponentEntry` / `mapXxx` all exist. **No phantom references.**

## Summary by Severity

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 CRITICAL | 0 | — |
| 🟠 MAJOR | 2 | ✅ resolved (fixes applied) |
| 🟡 MINOR | 4 | ✅ resolved (fixes applied) |
| 🔵 OBSERVATION | 2 | ✅ noted (test-authoring guidance) |

---

## Findings

### PF-001: OpenAI `json_object` mode breaks the continuation/stitch algorithm 🟠 MAJOR

**Dimension:** Feasibility / Codebase Alignment
**Location:** `03-llm-capacity.md` §Continuation wrapper (algorithm step 3); call wiring line 123.
**Codebase Evidence:** `scripts/enhancer/llm/openai.ts:91-93` sets
`response_format: { type: 'json_object' }` whenever `responseFormat === 'json'`.
**The Problem:** The plan passes `responseFormat: 'json'` on *every* turn. In
OpenAI JSON mode each completion must be a standalone valid JSON object, so a
"continue where you left off" turn emits a **new** `{...}` rather than the raw
remaining tokens. Naive concatenation yields `{…partial{…}` → unparseable. AR-5
makes `gpt-4o` the default, so this hits the primary path.

**🎯 Resolution:** **Option A+B (provider-aware continuation).** First turn uses
JSON mode; continuation turns disable `json_object` and continue via
assistant-prefill (Anthropic native; OpenAI text-mode). Added `continuationStrategy`
concept + ST case asserting continuation turns do not set `json_object`.

**User Decision:** ✅ Resolved — User pushed for best-possible; accepted A+B.

---

### PF-002: `DEFAULT_OPENAI_MAX_TOKENS = 16384` unsafe for non-gpt-4o models 🟠 MAJOR

**Dimension:** Edge Cases / Feasibility
**Location:** `03-llm-capacity.md` §Provider ceilings.
**The Problem:** 16384 is valid for `gpt-4o`, but `LLM_MODEL=gpt-4-turbo`
(4096 output cap) or `gpt-3.5` would return HTTP 400 (`max_tokens too large`).
AR-5 says "honor `.env`," so an alternate model is supported and would break.

**🎯 Resolution:** **Model-aware ceiling lookup** (`MODEL_OUTPUT_CEILINGS`) with a
safe fallback; `LLM_MAX_TOKENS` overrides are clamped to the model ceiling so a
request can never exceed the model's limit. Resolves PF-002 and PF-005 together.

**User Decision:** ✅ Resolved — User accepted model-aware ceilings over "document & hope."

---

### PF-003: `repairJson` can silently mask truncation (contradicts "never lose data") 🟡 MINOR

**Dimension:** Edge Cases
**Location:** `03-llm-capacity.md` §Continuation wrapper, algorithm step 5.
**The Problem:** A repaired object parses, passes validation, and ships — but its
tail content is lost, contradicting force #1 ("nothing is ever lost").

**🎯 Resolution:** **Escalation ladder:** (1) continuation/stitch → (2) full
re-request with a bumped ceiling (cost irrelevant) → (3) `repairJson` only as last
resort, with a loud warning **and a `repairsUsed` stat** surfaced in the Phase 9
live run for human review.

**User Decision:** ✅ Resolved — User upgraded from "just log" to escalation ladder.

---

### PF-004: Phase 7 guide/pattern formatter changes have no spec-test coverage 🟡 MINOR

**Dimension:** Testability / Completeness
**Location:** `07-testing-strategy.md` (ST-27..29 cover only the component
formatter and props/query tools); `99-execution-plan.md` task 7.1.4.
**The Problem:** New guide/pattern fields (`keyTakeaways`, `pitfalls`,
`whenToUse`, `accessibilityNotes`) are rendered but untested.

**🎯 Resolution:** Add **ST-30** (guide formatter renders new fields / omits when
absent) and **ST-31** (pattern formatter renders new fields / omits when absent).

**User Decision:** ✅ Resolved — User accepted ST-30/31.

---

### PF-005: Config default `maxTokens: 8192` undercuts the raised OpenAI 16384 ceiling 🟡 MINOR

**Dimension:** Consistency / Goal Alignment
**Location:** `03-llm-capacity.md` §New config field; orchestrator always passes
`config.maxTokens`.
**The Problem:** Because the orchestrator always passes `config.maxTokens` (8192),
the OpenAI `16384` provider default is dead code and real OpenAI requests cap at
8192 — quietly weakening the "maximum" intent.

**🎯 Resolution:** Make config `maxTokens` **optional**; when unset, providers
request their *own model ceiling* (via the PF-002 lookup). "Maximum" becomes the
automatic default; `LLM_MAX_TOKENS` still overrides. Resolved jointly with PF-002.

**User Decision:** ✅ Resolved — folded into the model-aware ceiling design.

---

### PF-008: No input-token budget guard on "smart-maximal" guide grounding 🟡 MINOR

**Dimension:** Edge Cases / Feasibility (added during best-possible re-evaluation)
**Location:** `04-grounding-data.md` §Targeted guide grounding.
**The Problem:** Guide prompts inject the *full uncapped inventory* **plus**
complete `targetComponents` data. With 60+ fully-serialized components, the
prompt **input** could exceed even gpt-4o's context window — silently dropping
the tail of the inventory. The plan guards *output* truncation but not *input*
overflow (the same failure mode, on the other side).

**🎯 Resolution:** Add an input-token estimate and a budget guard. Targeted
components stay at **full fidelity**; if the budget would be exceeded, the
*non-targeted* inventory degrades to a compact line (name + import + prop names).
"Smart-maximal" becomes genuinely smart: complete where it counts, compact at the
periphery.

**User Decision:** ✅ Resolved — User accepted the input-budget guard.

---

### PF-006: ST-21 "exactly 1 warning, 0 errors" is brittle 🔵 OBSERVATION

**Dimension:** Testability
**Codebase Evidence:** `schema-validator.ts:262-334` also warns on unknown
category, duplicate ids, and stats mismatches.
**Note:** The ST-21 fixture must isolate the `propGuidance` case (valid category,
unique id, matching stats) so the warning count doesn't flake. Test-authoring
guidance for Phase 4; no doc change required.

**User Decision:** ✅ Noted.

---

### PF-007: Provider default ceilings are model-specific 🔵 OBSERVATION

**Dimension:** Edge Cases
**Note:** Anthropic `8192` is correct for `claude-3-5-sonnet`, but a different
Claude model would share PF-002's concern. The model-aware lookup (PF-002 fix)
covers Anthropic too; this observation is subsumed by that resolution.

**User Decision:** ✅ Noted — covered by PF-002 fix.

---

## Outcome

All 🟠 MAJOR and 🟡 MINOR findings resolved with fixes applied to the plan docs
(`03-llm-capacity.md`, `04-grounding-data.md`, `07-testing-strategy.md`,
`99-execution-plan.md`). Observations noted as test-authoring guidance. The plan
is **codebase-grounded, internally consistent, and cleared for execution** via
`exec_plan maximum-enhancement`.
