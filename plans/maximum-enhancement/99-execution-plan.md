# Execution Plan: Maximum Enhancement

> **Document**: 99-execution-plan.md
> **Parent**: [Index](00-index.md)
> **Last Updated**: 2026-06-02 15:23 (preflight fixes folded in — see 00-preflight-report.md)
> **Progress**: 0/32 tasks (0%)
> **CodeOps Version**: (codeops-mcp unavailable this session)


## Overview

Implement the maximum-richness enhancer overhaul: never-truncate output
capacity, full grounding data, expanded schema, rewritten prompts, validator,
formatters/tools, and a live verification run. Each feature phase follows
spec-test-first ordering.

**🚨 Update this document after EACH completed task!**

---

## Implementation Phases

| Phase | Title | Sessions | Est. Time |
| ----- | ----- | -------- | --------- |
| 1 | LLM Output Capacity (maxTokens + continuation/repair) | 1 | 90 min |
| 2 | Grounding Data Layer (remove cap, enrich, targeted) | 1 | 90 min |
| 3 | Schema Expansion (new types + raw mapping) | 1 | 60 min |
| 4 | Schema Validator updates | 1 | 45 min |
| 5 | Prompt Rewrites (all six) | 1-2 | 90 min |
| 6 | Orchestrator wiring (maxTokens + new fields + targeted) | 1 | 60 min |
| 7 | Formatters & Tools | 1 | 75 min |
| 8 | Tests pass + regressions | 1 | 45 min |
| 9 | Verify + live `--full` run | 1 | 45 min |

**Total: ~9 sessions, ~9-10 hours**

---

## Phase 1: LLM Output Capacity

**Reference**: `03-llm-capacity.md`
**Objective**: Thread `maxTokens`, raise ceilings, add continuation/repair so output is never truncated.

| # | Task | File |
|---|------|------|
| 1.1.1 | Write spec tests ST-1..ST-10, ST-9b/9c, ST-6b/6c | `src/__tests__/enhancer/capacity.spec.test.ts` |
| 1.1.2 | Verify spec tests FAIL (red) | — |
| 1.1.3 | Add `findJsonEnd`/`isLikelyComplete`/`repairJson` | `scripts/enhancer/parse.ts` |
| 1.1.4 | Add optional `maxTokens` to config + env resolution (NaN-guarded) | `scripts/enhancer/config.ts` |
| 1.1.5a | Add model-aware ceiling lookup (`MODEL_OUTPUT_CEILINGS`, `resolveMaxTokens`) | `scripts/enhancer/llm/ceilings.ts` |
| 1.1.5b | Wire `resolveMaxTokens` into both providers (clamp; send `max_tokens` always) | `scripts/enhancer/llm/openai.ts`, `llm/anthropic.ts` |
| 1.1.6 | Add `chatComplete` escalation ladder (provider-aware continuation → re-request → repair + `repairsUsed`) | `scripts/enhancer/llm/complete.ts` |
| 1.1.7 | Verify spec tests PASS (green) | — |
| 1.1.8 | Write impl tests | `src/__tests__/enhancer/capacity.impl.test.ts` |
| 1.1.9 | Full verification | `yarn build && yarn test` |


**Verify**: `clear && sleep 3 && yarn build && yarn test`

---

## Phase 2: Grounding Data Layer

**Reference**: `04-grounding-data.md`
**Objective**: Remove `KEY_PROPS_LIMIT`, enrich `ComponentSummary`, full stories, targeted guide data.

| # | Task | File |
|---|------|------|
| 2.1.1 | Write spec tests ST-11..ST-17 | `src/__tests__/enhancer/grounding.spec.test.ts` |
| 2.1.2 | Verify spec tests FAIL (red) | — |
| 2.1.3 | Remove cap; enrich `ComponentSummary`; rewrite serializers | `scripts/enhancer/prompts/shared.ts`, `scripts/enhancer/types.ts` |
| 2.1.4 | Full story `code` + compositions in component serialization | `scripts/enhancer/prompts/component-enhance.ts` |
| 2.1.5 | Add `targetComponentIds`/`targetComponents` plumbing | `scripts/enhancer/config.ts`, `scripts/enhancer/types.ts` |
| 2.1.6 | Verify spec tests PASS (green) | — |
| 2.1.7 | Full verification | `yarn build && yarn test` |

**Verify**: `clear && sleep 3 && yarn build && yarn test`

---

## Phase 3: Schema Expansion

**Reference**: `05-schema-expansion.md`
**Objective**: Add new optional enhanced fields + raw mapping.

| # | Task | File |
|---|------|------|
| 3.1.1 | Write spec tests ST-18..ST-19 (mapping) | `src/__tests__/schema/schema-expansion.spec.test.ts` |
| 3.1.2 | Verify FAIL (red) | — |
| 3.1.3 | Add new types/fields | `src/types/schema.ts` |
| 3.1.4 | Extend Raw interfaces + `mapXxx` | `scripts/enhancer/enhancer.ts` |
| 3.1.5 | Verify mapping spec tests PASS (green) | — |
| 3.1.6 | Full verification | `yarn build && yarn test` |

**Verify**: `clear && sleep 3 && yarn build && yarn test`

---

## Phase 4: Schema Validator

**Reference**: `05-schema-expansion.md`
**Objective**: Validate new fields; back-compat + warnings.

| # | Task | File |
|---|------|------|
| 4.1.1 | Write spec tests ST-20..ST-22 | `src/__tests__/schema/schema-expansion.spec.test.ts` |
| 4.1.2 | Verify FAIL (red) | — |
| 4.1.3 | Validate new fields (warnings for bad prop refs) | `src/schema/schema-validator.ts` |
| 4.1.4 | Verify PASS (green) | — |
| 4.1.5 | Full verification | `yarn build && yarn test` |

**Verify**: `clear && sleep 3 && yarn build && yarn test`

---

## Phase 5: Prompt Rewrites

**Reference**: `06-prompt-rewrites.md`
**Objective**: Rewrite all six prompts with quotas, self-check, new fields.

| # | Task | File |
|---|------|------|
| 5.1.1 | Write spec tests ST-23..ST-26 | `src/__tests__/enhancer/prompts-max.spec.test.ts` |
| 5.1.2 | Verify FAIL (red) | — |
| 5.1.3 | Rewrite component + utility prompts | `prompts/component-enhance.ts`, `prompts/utility-enhance.ts` |
| 5.1.4 | Rewrite foundation + pattern prompts | `prompts/foundation-guide.ts`, `prompts/pattern-guide.ts` |
| 5.1.5 | Rewrite enterprise + quick-ref prompts | `prompts/enterprise-guide.ts`, `prompts/quick-reference.ts` |
| 5.1.6 | Verify PASS (green) + update `prompts.test.ts` | `src/__tests__/enhancer/prompts.test.ts` |
| 5.1.7 | Full verification | `yarn build && yarn test` |

**Verify**: `clear && sleep 3 && yarn build && yarn test`

---

## Phase 6: Orchestrator Wiring

**Reference**: `03`, `04`, `05`
**Objective**: Pass `maxTokens` via `chatComplete`; resolve targeted components; map new fields end-to-end.

| # | Task | File |
|---|------|------|
| 6.1.1 | Replace `provider.chat` with `chatComplete` (maxTokens) in all batches | `scripts/enhancer/enhancer.ts` |
| 6.1.2 | Resolve `targetComponents` for guides/patterns | `scripts/enhancer/enhancer.ts` |
| 6.1.3 | Update enhancer integration test (mock truncation + new fields) | `src/__tests__/enhancer/enhancer.test.ts` |
| 6.1.4 | Full verification | `yarn build && yarn test` |

**Verify**: `clear && sleep 3 && yarn build && yarn test`

---

## Phase 7: Formatters & Tools

**Reference**: `08-formatters-tools.md`
**Objective**: Surface new fields in tool output.

| # | Task | File |
|---|------|------|
| 7.1.1 | Write spec tests ST-27..ST-31 (incl. guide/pattern formatters) | `src/__tests__/formatters/enriched-formatter.spec.test.ts` |
| 7.1.2 | Verify FAIL (red) | — |
| 7.1.3 | Render new fields in component/props formatters | `src/formatters/component-formatter.ts`, `props-formatter.ts` |
| 7.1.4 | Render new fields in guide/pattern formatters (ST-30/31) | `src/formatters/guide-formatter.ts`, `pattern-formatter.ts` |
| 7.1.5 | Verify tools pass full entries | `src/tools/*` |
| 7.1.6 | Verify PASS (green) + update existing formatter tests | `src/__tests__/formatters/*` |

| 7.1.7 | Full verification | `yarn build && yarn test` |

**Verify**: `clear && sleep 3 && yarn build && yarn test`

---

## Phase 8: Tests Pass + Regressions

**Reference**: `07-testing-strategy.md`
**Objective**: Whole suite green; no regressions.

| # | Task | File |
|---|------|------|
| 8.1.1 | Run full suite, fix any regressions | — |
| 8.1.2 | Confirm `KEY_PROPS_LIMIT` gone (ST-17) | repo-wide search |
| 8.1.3 | Full verification | `yarn build && yarn test` |

**Verify**: `clear && sleep 3 && yarn build && yarn test`

---

## Phase 9: Verify + Live `--full` Run

**Reference**: `01-requirements.md` acceptance criteria
**Objective**: Real enhancement run with gpt-4o; validate richness/validity/size.

| # | Task | File |
|---|------|------|
| 9.1.1 | Run `yarn enhance --version v9 --full --verbose` (gpt-4o, .env) | `data/v9/fluentui-schema-enhanced.json` |
| 9.1.2 | Validate output: 0 errors; new fields populated; note bundle size | — |
| 9.1.3 | Spot-check 2-3 components/guides for richness | — |
| 9.1.4 | Final full verification | `yarn build && yarn test` |

**Verify**: `clear && sleep 3 && yarn build && yarn test`

---

## 🚨 Master Progress Checklist (All Phases) — MANDATORY

> **⚠️ EXECUTION RULE — APPLIES TO EVERY AGENT EXECUTING THIS PLAN:**
>
> This checklist is the **single source of truth** for tracking progress.
> 1. After completing each task: mark it `[x]` with a timestamp.
> 2. After each phase: confirm all its tasks are `[x]`.
> 3. Update the Progress header after every update.
> 4. If missing/incomplete, reconstruct from the phase tables above.
> 5. Never batch updates — update immediately after each task.

### Phase 1: LLM Output Capacity
- [ ] 1.1.1 Write spec tests ST-1..ST-10, ST-9b/9c, ST-6b/6c
- [ ] 1.1.2 Verify spec tests FAIL (red)
- [ ] 1.1.3 Add parse.ts JSON-completeness/repair helpers
- [ ] 1.1.4 Add optional maxTokens to config + env resolution (NaN-guarded)
- [ ] 1.1.5a Add model-aware ceiling lookup (ceilings.ts)
- [ ] 1.1.5b Wire resolveMaxTokens into both providers (clamp; send max_tokens always)
- [ ] 1.1.6 Add chatComplete escalation ladder (continuation → re-request → repair + repairsUsed)
- [ ] 1.1.7 Verify spec tests PASS (green)
- [ ] 1.1.8 Write impl tests
- [ ] 1.1.9 Full verification

### Phase 2: Grounding Data Layer
- [ ] 2.1.1 Write spec tests ST-11..ST-17, ST-17b/17c
- [ ] 2.1.2 Verify spec tests FAIL (red)
- [ ] 2.1.3 Remove cap; enrich ComponentSummary; rewrite serializers
- [ ] 2.1.4 Full story code + compositions in component serialization
- [ ] 2.1.5 Add targetComponentIds/targetComponents plumbing
- [ ] 2.1.5b Add input-budget guard (estimateTokens + degrade non-targeted inventory)
- [ ] 2.1.6 Verify spec tests PASS (green)
- [ ] 2.1.7 Full verification

### Phase 3: Schema Expansion
- [ ] 3.1.1 Write mapping spec tests ST-18..ST-19

- [ ] 3.1.2 Verify FAIL (red)
- [ ] 3.1.3 Add new types/fields
- [ ] 3.1.4 Extend Raw interfaces + mapXxx
- [ ] 3.1.5 Verify mapping spec tests PASS (green)
- [ ] 3.1.6 Full verification

### Phase 4: Schema Validator
- [ ] 4.1.1 Write spec tests ST-20..ST-22
- [ ] 4.1.2 Verify FAIL (red)
- [ ] 4.1.3 Validate new fields (warnings for bad prop refs)
- [ ] 4.1.4 Verify PASS (green)
- [ ] 4.1.5 Full verification

### Phase 5: Prompt Rewrites
- [ ] 5.1.1 Write spec tests ST-23..ST-26
- [ ] 5.1.2 Verify FAIL (red)
- [ ] 5.1.3 Rewrite component + utility prompts
- [ ] 5.1.4 Rewrite foundation + pattern prompts
- [ ] 5.1.5 Rewrite enterprise + quick-ref prompts
- [ ] 5.1.6 Verify PASS (green) + update prompts.test.ts
- [ ] 5.1.7 Full verification

### Phase 6: Orchestrator Wiring
- [ ] 6.1.1 Replace provider.chat with chatComplete (maxTokens)
- [ ] 6.1.2 Resolve targetComponents for guides/patterns
- [ ] 6.1.3 Update enhancer integration test
- [ ] 6.1.4 Full verification

### Phase 7: Formatters & Tools
- [ ] 7.1.1 Write spec tests ST-27..ST-31 (incl. guide/pattern formatters)
- [ ] 7.1.2 Verify FAIL (red)
- [ ] 7.1.3 Render new fields in component/props formatters
- [ ] 7.1.4 Render new fields in guide/pattern formatters (ST-30/31)
- [ ] 7.1.5 Verify tools pass full entries

- [ ] 7.1.6 Verify PASS (green) + update existing formatter tests
- [ ] 7.1.7 Full verification

### Phase 8: Tests Pass + Regressions
- [ ] 8.1.1 Run full suite, fix regressions
- [ ] 8.1.2 Confirm KEY_PROPS_LIMIT gone (ST-17)
- [ ] 8.1.3 Full verification

### Phase 9: Verify + Live Run
- [ ] 9.1.1 Run yarn enhance --full (gpt-4o)
- [ ] 9.1.2 Validate output: 0 errors; new fields; size
- [ ] 9.1.3 Spot-check richness
- [ ] 9.1.4 Final full verification

---

## Session Protocol

### Starting a Session
1. If `scripts/agent.sh` exists: `clear && sleep 3 && scripts/agent.sh start`
2. "Implement Phase X per `plans/maximum-enhancement/99-execution-plan.md`"

### Ending a Session
1. Run verify command
2. Handle commit per active commit mode
3. If `scripts/agent.sh` exists: `clear && sleep 3 && scripts/agent.sh finished`
4. `/compact`

---

## Dependencies

```
Phase 1 (capacity)
    ↓
Phase 2 (grounding) ── Phase 3 (schema) ── Phase 4 (validator)
    ↓                        ↓
Phase 5 (prompts) ←──────────┘
    ↓
Phase 6 (orchestrator wiring)
    ↓
Phase 7 (formatters/tools)
    ↓
Phase 8 (regressions) → Phase 9 (live run)
```

---

## Success Criteria

**Feature is complete when:**

1. ✅ All phases completed
2. ✅ All verification passing (`yarn build && yarn test`)
3. ✅ No warnings/errors
4. ✅ No dead code — `KEY_PROPS_LIMIT` removed; no unused params/functions
5. ✅ Security: no new input surface; defensive JSON parsing/repair
6. ✅ Documentation updated (README schema-coverage if fields change output)
7. ✅ Live `--full` run yields a valid enhanced schema (0 validation errors)
8. ✅ **Post-completion:** Ask user to re-analyze project and update `.clinerules/project.md`
