# Execution Plan: Skill Provenance Disclosure

> **Document**: 99-execution-plan.md
> **Parent**: [Index](00-index.md)
> **Last Updated**: 2026-09-24 22:17
> **Progress**: 33/42 tasks (79%)
> **CodeOps Artifact Schema**: 1

## Overview

Render a `## Source & versions` provenance section into `references/index.md`, capture the
umbrella package version in the scraper, add the coverage rule to `SKILL.md`, and make the release
flow regenerate the skill. All work stays inside the existing deterministic, offline gates.

**🚨 Update this document after EACH completed task!**

---

## Implementation Phases

| Phase | Title | Tasks |
| ----- | ----- | ----- |
| 1 | Schema and scraper provenance capture | 8 |
| 2 | Generator provenance render | 6 |
| 3 | SKILL.md guidance and compatibility | 3 |
| 4 | Same-commit corpus refresh and regenerate | 4 |
| 5 | Release integration and RD amendments | 4 |

**Total: 25 tasks across 5 phases** (no fabricated hour estimates — scope is bounded by the
task-size criteria in the make-plan quality checklist)

> **⚠️ EXECUTION RULE — APPLIES TO EVERY AGENT EXECUTING THIS PLAN:**
>
> The task checkboxes in the phase sections below are the **single source of truth** for progress.
> Every task line appears exactly once in this document. The executing agent MUST:
>
> 1. **On implementation:** mark the task `[~]` with a timestamp.
> 2. **On verify pass:** promote it to `[x]` with a timestamp.
> 3. **Update the Progress header and Last Updated stamp after EVERY task** — never batch.
> 4. **Resume** by scanning top-to-bottom: the first `[~]` task, else the first `[ ]` task.
> 5. **On blocker:** mark the task `[!]` and append `Blocked: <short reason>`.
>
> Timestamps come from `date '+%Y-%m-%d %H:%M'` — never invented.

---

## Phase 1: Schema and Scraper Provenance Capture

**Reference**: [03-01 Provenance Capture](03-01-provenance-capture.md) · AR-3, AR-11
**Objective**: Record the umbrella package name and version in `sources.fluentui`.

- [x] 1.1.1 [spec-author] Write specification tests for ST-6 — `src/__tests__/scraper/provenance-capture.spec.test.ts` ✅ (completed: 2026-09-24 22:04)
- [x] 1.1.2 Red verify: confirm ST-6 fails for the right reason ✅ (completed: 2026-09-24 22:04)
- [x] 1.1.3 Add optional `packageName`/`packageVersion` to `SourceInfo` — `src/types/schema.ts` ✅ (completed: 2026-09-24 22:06)
- [x] 1.1.4 Add optional `umbrellaPackageDir` to `VersionPaths` and set it for v9 — `scripts/scraper/types.ts`, `scripts/scraper/config.ts` ✅ (completed: 2026-09-24 22:06)
- [x] 1.1.5 Export `readPackageJson`, add `readUmbrellaPackage`, and wire it into the source record — `scripts/scraper/discover.ts`, `scripts/scraper/pipeline.ts` ✅ (completed: 2026-09-24 22:06)
- [x] 1.1.6 Green verify: ST-6 passes ✅ (completed: 2026-09-24 22:06)
- [x] 1.1.7 [impl] Impl tests and the umbrella fixture package.json — `src/__tests__/scraper/provenance-capture.impl.test.ts`, `src/__tests__/fixtures/mock-fluentui` ✅ (completed: 2026-09-24 22:06)
- [x] 1.1.8 Full verify ✅ (completed: 2026-09-24 22:06)

**Deliverables**:
- [x] `sources.fluentui` records the umbrella package for v9; absent fields handled gracefully
- [x] All verification passing

**Verify**: `npm run verify`

---

## Phase 2: Generator Provenance Render

**Reference**: [03-02 Provenance Render](03-02-provenance-render.md) · ST-1..ST-5, ST-9, ST-11 · AR-1, AR-2, AR-4, AR-5, AR-8
**Objective**: Render the provenance section deterministically and supply skill version and schema hash.

- [x] 2.1.1 [spec-author] Write specification tests for ST-1, ST-2, ST-3, ST-4, ST-5, ST-9, ST-11 — `src/__tests__/skill/provenance-render.spec.test.ts` ✅ (completed: 2026-09-24 22:08)
- [x] 2.1.2 Red verify: confirm the specification tests fail for the right reason ✅ (completed: 2026-09-24 22:08)
- [x] 2.2.1 Add `SkillRenderContext`, `renderProvenance`, and `formatPackageVersionRange` — `scripts/skill/mapping.ts` ✅ (completed: 2026-09-24 22:10)
- [x] 2.2.2 Require the context in `buildSkillFiles` and update every call site and fixture ✅ (completed: 2026-09-24 22:10)
- [x] 2.2.3 Add the `packageJsonPath` option, read the skill version, compute the schema hash, pass the context, and bump `GENERATOR_VERSION` to `1.1.0` — `scripts/skill/generate.ts`, `scripts/skill/manifest.ts` ✅ (completed: 2026-09-24 22:10)
- [x] 2.2.4 Green verify: all Phase 2 specification tests pass ✅ (completed: 2026-09-24 22:10)
- [x] 2.2.5 [impl] Impl tests for range formatting, empty-row omission, and escaping — `src/__tests__/skill/provenance-render.impl.test.ts` ✅ (completed: 2026-09-24 22:10)
- [x] 2.2.6 Full verify ✅ (completed: 2026-09-24 22:10)

**Deliverables**:
- [x] `references/index.md` carries the `## Source & versions` section with no timestamp
- [x] All verification passing

**Verify**: `npm run verify`

---

## Phase 3: SKILL.md Guidance and Compatibility

**Reference**: [03-03 Skill Guidance](03-03-skill-guidance.md) · ST-7, ST-8 · AR-1, AR-7
**Objective**: Add the disclosure rule and correct the React compatibility value.

- [x] 3.1.1 [spec-author] Write specification tests for ST-7 and ST-8 — `src/__tests__/skill/skill-guidance.spec.test.ts` ✅ (completed: 2026-09-24 22:13)
- [x] 3.1.2 Red verify: confirm the specification tests fail for the right reason ✅ (completed: 2026-09-24 22:13)
- [x] 3.2.1 Fix `compatibility` and append hard rule 8 — `.agents/skills/fluentui/SKILL.md` ✅ (completed: 2026-09-24 22:14)
- [x] 3.2.2 Green verify: ST-7 and ST-8 pass ✅ (completed: 2026-09-24 22:14)
- [x] 3.2.3 Full verify ✅ (completed: 2026-09-24 22:14)

**Deliverables**:
- [x] `SKILL.md` states the coverage rule and the real peer range
- [x] All verification passing

**Verify**: `npm run verify`

---

## Phase 4: Same-Commit Corpus Refresh and Regenerate

**Reference**: [03-01](03-01-provenance-capture.md), [03-02](03-02-provenance-render.md) · AR-3
**Objective**: Populate the current corpus with the umbrella version and regenerate the committed tree.

- [x] 4.1.1 Scrape from the cached clone at the current commit (no tag change) — `data/v9/fluentui-schema.json` ✅ (completed: 2026-09-24 22:15)
- [x] 4.1.2 Enhance with carry-forward; confirm zero LLM calls (unchanged components) — `data/v9/fluentui-schema-enhanced.json` ✅ (completed: 2026-09-24 22:16)
- [x] 4.1.3 Regenerate the committed skill tree — `.agents/skills/fluentui/` ✅ (completed: 2026-09-24 22:16)
- [x] 4.1.4 Run `npm run gate:skill` and full verify ✅ (completed: 2026-09-24 22:17)

**Deliverables**:
- [x] The committed skill shows `@fluentui/react-components 9.74.1` and the source commit
- [x] All gates pass

**Verify**: `npm run verify`

---

## Phase 5: Release Integration and RD Amendments

**Reference**: [03-04 Release Integration](03-04-release-integration.md) · ST-10 · AR-6, AR-8, AR-11
**Objective**: Regenerate and stage the skill on release, and amend the owning requirements.

- [ ] 5.1.1 [spec-author] Write the specification test for ST-10 using a temporary `package.json` and skill directory — `src/__tests__/integration/provenance-release.spec.test.ts`
- [ ] 5.1.2 Red verify: confirm ST-10 fails for the right reason
- [ ] 5.2.1 Add `regenerateSkill`, export `releaseStagePaths`, guard it for dry-run/no-commit, and use it when staging — `scripts/release.mjs`
- [ ] 5.2.2 Amend RD-03 and add the RD-01 source-field note — `requirements/RD-03-skill-generator.md`, `requirements/RD-01-content-model.md`
- [ ] 5.2.3 Green verify: ST-10 passes
- [ ] 5.2.4 Full verify

**Deliverables**:
- [ ] A version bump plus regeneration keeps the drift gate green
- [ ] RD-03 and RD-01 updated
- [ ] All verification passing

**Verify**: `npm run verify`

---

## Dependencies

```
Phase 1
    ↓
Phase 2 ──→ Phase 3
    ↓         ↓
Phase 4 ←─────┘
    ↓
Phase 5
```

Phase 4 needs Phase 1 (umbrella capture) and Phase 2 (renderer) and Phase 3 (SKILL.md) complete.
Phase 5 needs Phase 4's regenerated tree.

---

## Success Criteria

**Feature is complete when:**

1. ✅ All phases completed
2. ✅ `npm run verify` passing
3. ✅ No warnings/errors
4. ✅ No dead code — no unused parameters, functions, classes, or modules
5. ✅ Security reviewed — no new input surface; provenance values escaped
6. ✅ Documentation updated — RD-03 and RD-01 amended
7. ✅ Generated tree regenerated and drift-clean
8. ✅ Post-completion project re-analysis (handled by the exec-plan skill)
