# Execution Plan: FluentUI Agent Skill

> **Document**: 99-execution-plan.md
> **Parent**: [Index](00-index.md)
> **Last Updated**: 2026-09-19 15:17
> **Progress**: 36/103 tasks (35%)
> **CodeOps Artifact Schema**: 1

## Overview

Implements RD-01 … RD-08: the three-layer content pipeline, deterministic skill generator,
integrity gates, installer and packaging, MCP/docs/techdocs retirement, non-functional hardening,
and documentation/evaluation. Every phase follows spec tests → red → implement → green → impl tests
→ verify.

**🚨 Update this document after EACH completed task!**

---

## Implementation Phases

| Phase | Title | Tasks |
| ----- | ----- | ----- |
| 1 | Scraper coverage (RD-01) | 9 |
| 2 | LLM enhancement (RD-02) | 17 |
| 3 | Skill generator (RD-03) | 12 |
| 4 | Integrity gates (RD-04) | 11 |
| 5 | Installer & packaging (RD-05) | 11 |
| 6 | Retirement & cleanup (RD-06) | 8 |
| 7 | Non-functional hardening (RD-07) | 5 |
| 8 | Docs, decisions & evaluation (RD-08) | 8 |

**Total: 81 tasks across 8 phases**

> **⚠️ EXECUTION RULE — APPLIES TO EVERY AGENT EXECUTING THIS PLAN:**
>
> The task checkboxes in the phase sections below are the **single source of truth** for progress.
> Every task line appears exactly once in this document. The executing agent MUST:
>
> 1. **On implementation:** mark the task `[~]` with a timestamp —
>    `- [~] 1.1.1 Task description ⏳ (implemented: YYYY-MM-DD HH:MM)`
> 2. **On verify pass:** promote it to `[x]` —
>    `- [x] 1.1.1 Task description ✅ (completed: YYYY-MM-DD HH:MM)`
> 3. **Update the Progress header** (`> **Progress**: X/103 tasks (Z%)`; the engine counts the 81
>    numbered tasks plus the 22 Deliverable checks) and the Last Updated stamp
>    after EVERY task — never batch updates. Only `[x]` counts as complete.
> 4. **Resume** by scanning the phase sections top-to-bottom: the first `[~]` task is resumed first,
>    else the first `[ ]` task.
> 5. **On blocker:** mark the task `[!]` and append `Blocked: <short reason>` on the same line.
>
> Timestamps come from `date '+%Y-%m-%d %H:%M'` — never invented.

---

## Phase 1: Scraper coverage (RD-01)

> **Phase baseline tree**: a6b1a796d31f11d74291e989af7065d39038d85f
> **Scope**: strict · **Expected modification set**: `scripts/scraper/**`, `src/__tests__/fixtures/mock-fluentui/**`, `src/__tests__/scraper/**`

**Reference**: [03-01 §Scraper](03-01-content-pipeline.md) · AR-02, AR-20, AR-21

### Step 1.1: Specification Tests (before implementation)

- [x] 1.1.1 [spec-author] Write scraper spec tests (ST-1..ST-4) — `src/__tests__/scraper/coverage.spec.test.ts` ✅ (completed: 2026-09-19 11:52)
- [x] 1.1.2 Run scraper spec tests; verify they FAIL (red phase) ✅ (completed: 2026-09-19 11:52)

### Step 1.2: Implementation

- [x] 1.2.1 Fix component discovery and classification to cover the Button family and exact names — `scripts/scraper/adapters/v9-adapter.ts` ✅ (completed: 2026-09-19 11:57)
- [x] 1.2.2 Pin the source to the latest stable release tag and record `sources.fluentui.{ref,commit}` — `scripts/scraper/git-ref.ts`, `scripts/scraper/pipeline.ts` ✅ (completed: 2026-09-19 11:57)
- [x] 1.2.3 Emit the coverage report with explicit exclusion reasons — `scripts/scraper/coverage.ts` ✅ (completed: 2026-09-19 11:57)
- [x] 1.2.4 Extend the mock FluentUI fixture with the Button family and abbreviated-name packages — `src/__tests__/fixtures/mock-fluentui/**` ✅ (completed: 2026-09-19 11:57)
- [x] 1.2.5 Run scraper spec tests; verify they PASS (green phase) ✅ (completed: 2026-09-19 11:57)

### Step 1.3: Implementation Tests & Hardening

- [x] 1.3.1 Write scraper impl tests (classification edges, id normalization) — `src/__tests__/scraper/coverage.impl.test.ts` ✅ (completed: 2026-09-19 11:58)
- [x] 1.3.2 Full verify (PR-1) ✅ (completed: 2026-09-19 11:58)

**Deliverables**:
- [x] Raw schema has complete v9 component coverage ✅ (completed: 2026-09-19 11:58)
- [x] Coverage report test passes ✅ (completed: 2026-09-19 11:58)
- [x] All verification passing ✅ (completed: 2026-09-19 11:58)

**Verify**: `yarn build && yarn test`

---

## Phase 2: LLM enhancement (RD-02)

**Reference**: [03-01 §DeepSeek](03-01-content-pipeline.md) · AR-08, AR-09, AR-10, AR-17, AR-18

> **Phase baseline tree**: e4e7e684e7f708a48b60404d8b553395c789c0b5
> **Scope**: strict · **Expected modification set**: `scripts/enhancer/**`, `src/types/schema.ts`, `src/schema/schema-validator.ts`, `src/__tests__/enhancer/**`, `data/v9/fluentui-schema-enhanced.json`

### Step 2.1: Specification Tests (before implementation)

> ✅ **PR-8 resolved** (2026-09-19): the dead MCP runtime and MCP tests were deleted before this
> phase, and the reusable renderers were relocated to `scripts/skill/render/` (honoring PR-5).
> Phase 2 therefore replaces the schema with no MCP-compatibility work. See
> `00-ambiguity-register.md` PR-8.

- [x] 2.1.1 [spec-author] Write enhancement spec tests (ST-5..ST-11) — `src/__tests__/enhancer/deepseek.spec.test.ts` ✅ (completed: 2026-09-19 12:45)
- [x] 2.1.2 Run enhancement spec tests; verify they FAIL (red phase) ✅ (completed: 2026-09-19 12:45)

### Step 2.2: Implementation — provider and cost gate

- [x] 2.2.1 Add DeepSeek config and limits — `scripts/enhancer/types.ts`, `scripts/enhancer/config.ts` ✅ (completed: 2026-09-19 12:51)
- [x] 2.2.2 Implement the DeepSeek provider with fail-fast and truncation detection — `scripts/enhancer/llm/deepseek.ts`, `scripts/enhancer/llm/provider.ts` ✅ (completed: 2026-09-19 12:51)
- [x] 2.2.3 Port the cost estimator and confirmation gate — `scripts/enhancer/cost-estimator.ts`, `scripts/enhancer/cli.ts` ✅ (completed: 2026-09-19 12:53)

### Step 2.3: Implementation — content model

- [x] 2.3.1 Evolve schema types (drop code fields; add `categoryGuidance`, `recipes`) — `src/types/schema.ts` ✅ (completed: 2026-09-19 12:54)
- [x] 2.3.2 Rewrite the component prompt to prose-only — `scripts/enhancer/prompts/component-enhance.ts` ✅ (completed: 2026-09-19 13:04)
- [x] 2.3.3 Add the category-guidance prompt — `scripts/enhancer/prompts/category-guidance.ts` ✅ (completed: 2026-09-19 13:04)
- [x] 2.3.4 Replace the pattern prompt with the recipe prompt — `scripts/enhancer/prompts/recipe.ts` ✅ (completed: 2026-09-19 13:04)
- [x] 2.3.5 Configure 8 category guides and 19 recipes — `scripts/enhancer/config.ts` ✅ (completed: 2026-09-19 13:04)
- [x] 2.3.6 Map the new sections through the orchestrator and validator — `scripts/enhancer/enhancer.ts`, `scripts/enhancer/merge.ts`, `src/schema/schema-validator.ts` ✅ (completed: 2026-09-19 13:04)

### Step 2.4: Green phase

- [x] 2.4.1 Run enhancement spec tests; verify they PASS (green phase) ✅ (completed: 2026-09-19 13:04)

### Step 2.5: Implementation Tests & Hardening

- [x] 2.5.1 Write enhancement impl tests (retry, token accounting, config parsing) — `src/__tests__/enhancer/deepseek.impl.test.ts` ✅ (completed: 2026-09-19 13:04)
- [x] 2.5.2 Run `yarn enhance --version v9 --dry-run --verbose` and inspect the cost report (no paid calls) ✅ (completed: 2026-09-19 13:04)
- [x] 2.5.3 Full verify (PR-1) ✅ (completed: 2026-09-19 13:04)

### Step 2.6: Regeneration (authorized paid run)

- [x] 2.6.1 Regenerate the enhanced schema with `yarn enhance --version v9 --full` after explicit authorization ✅ (completed: 2026-09-19 14:03)
- [x] 2.6.2 Confirm zero dropped entries and 8 categories + 19 recipes in the output ✅ (completed: 2026-09-19 14:03)

**Deliverables**:
- [x] DeepSeek provider with fail-fast and cost gate ✅ (completed: 2026-09-19 13:04)
- [x] Prose-only enhanced schema with categories and recipes ✅ (completed: 2026-09-19 14:03)
- [x] All verification passing ✅ (completed: 2026-09-19 13:04)

**Verify**: `yarn build && yarn test`

---

## Phase 3: Skill generator (RD-03)

**Reference**: [03-02](03-02-skill-generator.md) · AR-05, AR-06, AR-11

> **Phase baseline tree**: 89d7149bf2b1a0685088d8717d7e01e245e6b59d
> **Scope**: strict · **Expected modification set**: `scripts/skill/**`, `src/__tests__/skill/**`, `.agents/skills/fluentui/**`

### Step 3.1: Specification Tests (before implementation)

- [x] 3.1.1 [spec-author] Write generator spec tests (ST-12..ST-18) — `src/__tests__/skill/generate.spec.test.ts`, plus format test `src/__tests__/skill/skill-format.spec.test.ts` ✅ (completed: 2026-09-19 15:17)
- [x] 3.1.2 Run generator spec tests; verify they FAIL (red phase) ✅ (completed: 2026-09-19 15:17)

### Step 3.2: Implementation

- [x] 3.2.1 Relocate reusable formatter logic to pure renderers — `scripts/skill/render/props.ts`, `stories.ts`, `sections.ts` (PR-5) ✅ (completed: 2026-09-19 15:18)
- [x] 3.2.2 Implement the source→destination mapping with path-safety checks — `scripts/skill/mapping.ts` ✅ (completed: 2026-09-19 15:20)
- [ ] 3.2.3 Implement the deterministic generator and `--check` mode — `scripts/skill/generate.ts`
- [ ] 3.2.4 Implement the manifest — `scripts/skill/manifest.ts`
- [ ] 3.2.5 Hand-write `SKILL.md` — `.agents/skills/fluentui/SKILL.md`
- [ ] 3.2.6 Hand-write the project templates — `.agents/skills/fluentui/assets/templates/*.md`

### Step 3.3: Green phase

- [ ] 3.3.1 Run generator spec tests; verify they PASS (green phase)

### Step 3.4: Implementation Tests & Hardening

- [ ] 3.4.1 Write generator impl tests (escaping, story selection, empty sections) — `src/__tests__/skill/render.impl.test.ts`
- [ ] 3.4.2 Generate the committed skill tree and review a sample of files
- [ ] 3.4.3 Full verify (PR-1)

**Deliverables**:
- [ ] Deterministic generator producing the full skill tree
- [ ] Hand-written `SKILL.md` and templates
- [ ] All verification passing

**Verify**: `yarn build && yarn test`

---

## Phase 4: Integrity gates (RD-04)

**Reference**: [03-03](03-03-integrity-gates.md) · AR-19

### Step 4.1: Specification Tests (before implementation)

- [ ] 4.1.1 [spec-author] Write gate spec tests (ST-19..ST-26) — `src/__tests__/skill/gates.spec.test.ts`
- [ ] 4.1.2 Run gate spec tests; verify they FAIL (red phase)

### Step 4.2: Implementation

- [ ] 4.2.1 Implement example extraction and tier 1a/1b/2 validation — `scripts/skill/validate-examples.ts`
- [ ] 4.2.2 Implement the API-reference check over generated prose — `scripts/skill/check-api-references.ts`
- [ ] 4.2.3 Implement the drift and coverage gate — `scripts/skill/check-drift.ts`
- [ ] 4.2.4 Implement the freshness gate — `scripts/skill/check-freshness.ts`
- [ ] 4.2.5 Implement the secrets scan — `scripts/skill/secrets.ts`

### Step 4.3: Green phase

- [ ] 4.3.1 Run gate spec tests; verify they PASS (green phase)

### Step 4.4: Implementation Tests & Hardening

- [ ] 4.4.1 Write gate impl tests (report shape, throwaway project, extraction rules) — `src/__tests__/skill/gates.impl.test.ts`
- [ ] 4.4.2 Wire gates into `ci.yml` and add the four `skill:*` scripts — `.github/workflows/ci.yml`, `package.json`
- [ ] 4.4.3 Full verify (PR-1)

**Deliverables**:
- [ ] All seven gates implemented and passing on the committed skill
- [ ] CI runs drift and example validation
- [ ] All verification passing

**Verify**: `yarn build && yarn test && yarn skill:check && yarn skill:validate`

---

## Phase 5: Installer & packaging (RD-05)

**Reference**: [03-04](03-04-installer-packaging.md) · AR-07, AR-13, AR-14

### Step 5.1: Specification Tests (before implementation)

- [ ] 5.1.1 [spec-author] Write installer spec tests (ST-27..ST-33) — `src/__tests__/skill/install-skill.spec.test.ts`
- [ ] 5.1.2 Run installer spec tests; verify they FAIL (red phase)

### Step 5.2: Implementation

- [ ] 5.2.1 Implement client detection and target resolution — `src/skill/install-skill.ts`
- [ ] 5.2.2 Implement atomic install, marker, status, and uninstall — `src/skill/install-skill.ts`
- [ ] 5.2.3 Implement the `fluentui` bin dispatcher — `src/bin.ts`
- [ ] 5.2.4 Implement the assemble step — `scripts/skill/assemble.ts`
- [ ] 5.2.5 Update package name, bin, files, scripts, and drop `data/` — `package.json`

### Step 5.3: Green phase

- [ ] 5.3.1 Run installer spec tests; verify they PASS (green phase)

### Step 5.4: Implementation Tests & Hardening

- [ ] 5.4.1 Write installer impl tests (atomic replace, symlink, leftover cleanup) — `src/__tests__/skill/install-skill.impl.test.ts`
- [ ] 5.4.2 Verify `npm pack --dry-run` contents
- [ ] 5.4.3 Full verify (PR-1)

**Deliverables**:
- [ ] Working `fluentui skill install|status|uninstall`
- [ ] Packable `fluentui-skill` package with no `data/`
- [ ] All verification passing

**Verify**: `yarn build && yarn test`

---

## Phase 6: Retirement & cleanup (RD-06)

**Reference**: [03-05](03-05-retirement-cleanup.md) · AR-03, AR-15, AR-16

### Step 6.1: Specification Tests (before implementation)

- [ ] 6.1.1 [spec-author] Write repo-hygiene spec tests (ST-34, ST-35) — `src/__tests__/repo/repo-hygiene.spec.test.ts`
- [ ] 6.1.2 Run hygiene spec tests; verify they FAIL (red phase)

### Step 6.2: Implementation

- [ ] 6.2.1 Drop the MCP SDK dependency and the residual `src/types/index.ts` barrel — `package.json`, `src/types/index.ts` (the runtime files were already deleted under PR-8 before Phase 2; renderers were relocated to `scripts/skill/render/`)
- [ ] 6.2.2 Delete legacy `docs/` and `techdocs/` with the Pages workflow — `docs/**`, `techdocs/**`, `.github/workflows/deploy-techdocs.yml`
- [ ] 6.2.3 Update build/test/governance config — `tsconfig.build.json`, `vitest.config.ts`, `.gitignore`, `.github/workflows/ci.yml`, `.github/workflows/publish.yml`
- [ ] 6.2.4 Replace `update-docs.yml` with `update-skill.yml` — `.github/workflows/update-skill.yml`

### Step 6.3: Green phase

- [ ] 6.3.1 Run hygiene spec tests and full suite; verify they PASS (green phase)

### Step 6.4: Implementation Tests & Hardening

- [ ] 6.4.1 Full verify (PR-1)

**Deliverables**:
- [ ] No MCP, `docs/`, or `techdocs/` references
- [ ] Build and tests green on the surviving set
- [ ] All verification passing

**Verify**: `yarn build && yarn test`

---

## Phase 7: Non-functional hardening (RD-07)

**Reference**: [RD-07](../../requirements/RD-07-non-functional.md) · AR-11, AR-20

### Step 7.1: Verification tasks

- [ ] 7.1.1 Verify determinism: two generator runs produce identical hashes
- [ ] 7.1.2 Verify offline use: install into a temp target and load references with no network
- [ ] 7.1.3 Verify performance targets: generation < 5s, example validation < 5 min
- [ ] 7.1.4 Verify security tests: path traversal, secrets scan, no-execution guarantee
- [ ] 7.1.5 Full verify (PR-1)

**Deliverables**:
- [ ] Determinism, offline, performance, and security checks pass
- [ ] All verification passing

**Verify**: `yarn build && yarn test`

---

## Phase 8: Docs, decisions & evaluation (RD-08)

**Reference**: [03-06](03-06-docs-decisions-eval.md) · AR-22, AR-19

### Step 8.1: Specification Tests (before implementation)

- [ ] 8.1.1 [spec-author] Extend repo-hygiene tests for README and ADRs (ST-36, ST-37) — `src/__tests__/repo/repo-hygiene.spec.test.ts`
- [ ] 8.1.2 Run doc spec tests; verify they FAIL (red phase)

### Step 8.2: Implementation

- [ ] 8.2.1 Rewrite `README.md` skill-first — `README.md`
- [ ] 8.2.2 Write ADR-001..ADR-005 — `requirements/decisions/ADR-00X-*.md`
- [ ] 8.2.3 Update `AGENTS.md` commands and scope — `AGENTS.md`
- [ ] 8.2.4 Produce the skill-vs-MCP evaluation report — `requirements/decisions/evaluation-report.md`

### Step 8.3: Green phase

- [ ] 8.3.1 Run doc spec tests; verify they PASS (green phase)

### Step 8.4: Final verification

- [ ] 8.4.1 Full verify (PR-1)

**Deliverables**:
- [ ] Skill-first README, five ADRs, updated AGENTS.md, evaluation report
- [ ] All verification passing

**Verify**: `yarn build && yarn test`

---

## Dependencies

```
Phase 1 (scraper)
    ↓
Phase 2 (enhancement + schema types)
    ↓
Phase 3 (generator)
    ↓
Phase 4 (gates) ──┐
    ↓             │
Phase 5 (installer & packaging)
    ↓
Phase 6 (retirement)
    ↓
Phase 7 (NFR)
    ↓
Phase 8 (docs & evaluation)
```

---

## Success Criteria

**Feature is complete when:**

1. ✅ All phases completed
2. ✅ `yarn build && yarn test` passing, plus `yarn skill:check` and `yarn skill:validate`
3. ✅ No warnings/errors
4. ✅ No dead code — no MCP, `docs/`, or `techdocs/` remnants
5. ✅ Security hardened — path traversal, secrets, no-execution checks
6. ✅ Documentation updated (README, ADRs)
7. ✅ Package verifiably packable; publish manual
8. ✅ Post-completion project re-analysis (handled by the exec-plan skill)
