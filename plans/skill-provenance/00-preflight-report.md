# Preflight Report: Skill Provenance Disclosure

> **Status**: ✅ PASSED WITH NOTES — Iteration 1: 11 findings (0 critical, 3 major, 5 minor,
> 3 observation). Iteration 2: all 3 major and 5 minor resolved; 3 observations accepted.
> **Iteration**: 2 (re-scan after fixes)
> **Artifact**: Implementation plan at `plans/skill-provenance/`
> **Codebase Grounded**: 18 source/config/test files examined, 14 references verified
> **Last Updated**: 2026-09-24 21:32
>
> **⚠️ SAME-SESSION REVIEW:** This artifact was created in the current session. Same-agent bias
> risk is elevated. Consider a new session for maximum review independence.
>
> **Audit target:** all documents in `plans/skill-provenance/`.
> **Context documents (not audited):** `requirements/RD-01`, `requirements/RD-03`,
> `scripts/skill/**`, `scripts/scraper/**`, `scripts/release.mjs`, `src/types/schema.ts`,
> `src/schema/schema-validator.ts`, `.agents/skills/fluentui/SKILL.md`.
> **Modification set:** the plan documents only (no fixes applied).
> **Domain lenses:** `references/domains/selection.md` and the `_shared/*` files are not present on
> this machine; applied a light Security lens and the standard 13 dimensions. Flag for human review.

### Codebase Context Summary

**Tech Stack:** Node.js ≥20, TypeScript (ESM, `.js` specifiers), Vitest, `tsx`; FluentUI React v9
scraped with `ts-morph`; npm.

**Architecture:** Four-stage pipeline — scraper → enhancer (LLM) → deterministic generator →
verifier gates. `SKILL.md` is hand-written; only `references/**` and
`.fluentui-skill-manifest.json` are generated and drift-checked. `scripts/` are executed via
`tsx`, not declaration-emitted by `tsconfig.build.json`.

**Key Files Examined:** `scripts/skill/{generate,mapping,manifest,format,check-drift}.ts`,
`scripts/scraper/{pipeline,discover,config,types,cli,git-ref}.ts`,
`scripts/enhancer/enhancer.ts`, `scripts/release.mjs`, `scripts/release.spec.test.mjs`,
`src/types/schema.ts`, `src/schema/schema-validator.ts`, `src/__tests__/skill/render.impl.test.ts`,
`src/__tests__/scraper/**`, `src/__tests__/integration/**`, `.agents/skills/fluentui/SKILL.md`,
`package.json`, `tsconfig*.json`, `.github/workflows/{ci,release}.yml`.

**Reference Verification:** 14 references mapped — 13 verified, 1 unverifiable (`_shared/*`
domain/lens docs absent).

### Summary by Dimension

| # | Dimension | Findings | Highest Severity |
|---|-----------|----------|-----------------|
| 1 | Ambiguities | 0 | — |
| 2 | Implicit Assumptions | 0 | — |
| 3 | Logical Contradictions | 1 | 🟡 |
| 4 | Completeness Gaps | 1 | 🟡 |
| 5 | Dependency Issues | 0 | — |
| 6 | Feasibility Concerns | 1 | 🟠 |
| 7 | Testability | 2 | 🟠 |
| 8 | Security Blind Spots | 0 | — |
| 9 | Edge Cases | 0 | — |
| 10 | Scope Creep Indicators | 0 | — |
| 11 | Ordering & Sequencing | 0 | — |
| 12 | Consistency | 1 | 🟡 |
| 13 | Codebase Alignment | 4 | 🟠 |

### Summary by Severity

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 0 | — |
| MAJOR | 3 | pending |
| MINOR | 5 | pending |
| OBSERVATION | 3 | pending |

---

### PF-001: ST-10 test mutates the repository `package.json` and working tree 🟠 MAJOR

**Dimension:** Testability
**Location:** `07-testing-strategy.md` ST-10; `99-execution-plan.md` §5.1.1
**Codebase Evidence:** `scripts/skill/generate.ts` resolves the schema and skill dir but not a
`package.json` path; the skill tests run under Vitest against the repo working tree
(`src/__tests__/skill/render.impl.test.ts`).
**The Problem:** ST-10 says "bump the version in `package.json`, then regenerate". If implemented
literally, the test edits the committed `package.json` and regenerates the committed tree, which is
destructive and flaky under CI (`npm run verify` runs tests on a clean checkout).

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Point the generator at a temp `package.json` and temp skill dir | Deterministic, no repo mutation, validates the real code path | Requires the `packageJsonPath` option from PF-003 |
| B | Run the release test in a temp git worktree | Realistic end-to-end | Slower, more setup |
| C | Drop ST-10; assert `readSkillVersion` returns the file's version and the section renders it | Simple | Loses the bump→regenerate integration check |

**Recommendation:** Option A — keeps the end-to-end behavior without touching the repo; depends on
resolving PF-003.

**User Decision:** Resolved — user accepted the recommendation (2026-09-24).

---

### PF-002: `commitAndTag` staging test is not feasible as specified 🟠 MAJOR

**Dimension:** Testability
**Location:** `03-04-release-integration.md` §Testing Requirements ("Unit test: `commitAndTag`
stages `.agents/skills/fluentui`")
**Codebase Evidence:** `scripts/release.mjs` — `commitAndTag` is module-private and calls `git` via
`run`; `scripts/release.spec.test.mjs` covers only pure functions (`semverBump`, `parseCommit`,
`mergeChangelog`, `parseCli`).
**The Problem:** There is no seam to assert the staged path set without running real git, so the
specified unit test cannot be written as described.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Extract a pure `releaseStagePaths()` (or a `STAGED_PATHS` export) and unit-test it | Trivial, matches existing pure-function test style | Slightly changes `release.mjs` structure |
| B | Assert via a `--dry-run` capture of intended actions | Exercises more of the flow | Requires a dry-run action log that does not exist yet |
| C | Test only in a throwaway git repo in an integration test | Realistic | Slow, needs git fixtures |

**Recommendation:** Option A — smallest change and consistent with the existing spec-test style.

**User Decision:** Resolved — user accepted the recommendation (2026-09-24).

---

### PF-003: Generator's skill-version source path and option are unspecified 🟠 MAJOR

**Dimension:** Feasibility / Codebase Alignment
**Location:** `03-02-provenance-render.md` §Integration Points; `99-execution-plan.md` §2.2.3
**Codebase Evidence:** `GenerateSkillOptions` is `{ schemaPath, skillDir?, check? }`
(`scripts/skill/generate.ts:57-65`); `runGenerate` resolves paths against `cwd`
(`scripts/skill/generate.ts:290`). Tests call `generateSkill` with temp dirs (gates tests).
**The Problem:** The plan says "read the skill version from `package.json`" but does not add a
`packageJsonPath` option or state the resolution base. In tests that pass a temp `skillDir`,
resolving `package.json` from `cwd` reads the repo file (coupling/instability); if the file is
absent it throws, which the fail-fast contract would turn into a test failure.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Add `packageJsonPath?` (default `package.json`) to `GenerateSkillOptions`, resolved against `cwd`, required for provenance | Test-friendly, explicit, no hidden cwd reads | New option and small signature change |
| B | Always read `resolve(process.cwd(), 'package.json')` | No new option | Not overridable; unstable in tests |
| C | Pass the resolved `skillVersion` string as an option; read the file in `runGenerate` | Pure generator, easy tests | Moves the AR-8 read out of the generator proper |

**Recommendation:** Option A — keeps the read in the generator per AR-8 while giving tests a
fixture path; also unblocks PF-001.

**User Decision:** Resolved — user accepted the recommendation (2026-09-24).

---

### PF-004: ST-1/ST-3 cite "01 Req R2", but requirements are unnumbered 🟡 MINOR

**Dimension:** Consistency / Codebase Alignment (traceability)
**Location:** `07-testing-strategy.md` ST-1, ST-3 (`Source` column)
**Codebase Evidence:** `01-requirements.md` lists Must Haves as bullets with no `R1`/`R2` labels.
**The Problem:** The `Source` references point to a non-existent identifier, breaking the
requirement-to-test traceability the strategy mandates.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Number the Must Haves `R1…R8` and cite them from ST cases | Precise, standard for this repo | Small edit to `01-requirements.md` |
| B | Cite the requirement text instead of an id | No numbering | Looser traceability |

**Recommendation:** Option A.

**User Decision:** Resolved — user accepted the recommendation (2026-09-24).

---

### PF-005: Generator version shown as 1.0.0 in the example but bumped to 1.1.0 elsewhere 🟡 MINOR

**Dimension:** Logical Contradictions
**Location:** `00-index.md` §Usage Examples (`| Generator | 1.0.0 |`) vs
`03-02-provenance-render.md` and `99-execution-plan.md` §2.2.3 (`1.1.0`).
**Codebase Evidence:** `GENERATOR_VERSION = '1.0.0'` (`scripts/skill/manifest.ts:21`); the plan
bumps it to `1.1.0`.
**The Problem:** The illustrative example shows a stale value, which is mildly misleading.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Update the `00-index.md` example to `1.1.0` | Consistent | None |
| B | Leave it; it is only an example | — | Inconsistent |

**Recommendation:** Option A.

**User Decision:** Resolved — user accepted the recommendation (2026-09-24).

---

### PF-006: `renderProvenance` empty-string return is unreachable dead code 🟡 MINOR

**Dimension:** Completeness Gaps
**Location:** `03-02-provenance-render.md` §New Functions ("or an empty string when no source is
present")
**Codebase Evidence:** Schema validation requires `sources.fluentui` to be a plain object
(`src/schema/schema-validator.ts:153-163`), and the generator validates before rendering.
**The Problem:** The documented branch cannot occur, so it is dead code the standards prohibit.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Drop the empty-string behavior; assume a validated source record | No dead code | Loses a defensive guard |
| B | Keep it as a deliberate defensive guard and add a test | Robust if validation changes | Must be tested to justify |

**Recommendation:** Option A — the schema contract guarantees the field.

**User Decision:** Resolved — user accepted the recommendation (2026-09-24).

---

### PF-007: New umbrella fixture may change existing scraper test expectations 🟡 MINOR

**Dimension:** Codebase Alignment (Impact Blindness)
**Location:** `07-testing-strategy.md` §Fixtures Needed; `03-01-provenance-capture.md`
§Testing Requirements
**Codebase Evidence:** `src/__tests__/scraper/**` and `src/__tests__/integration/scraper-pipeline.test.ts`
walk `src/__tests__/fixtures/mock-fluentui`; adding an umbrella `package.json` changes the tree the
scraper sees.
**The Problem:** The plan does not acknowledge that adding the fixture may shift existing
discovery/inventory expectations.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Add the umbrella fixture and re-check/adjust scraper expectations in the same task | Realistic, one tree | May require touching existing specs |
| B | Add a separate isolated fixture tree for provenance tests | No impact on existing tests | Duplication |

**Recommendation:** Option A, with an explicit "re-run scraper tests and adjust expectations" step.

**User Decision:** Resolved — user accepted the recommendation (2026-09-24).

---

### PF-008: Roadmap has no row for a standalone plan 🟡 MINOR

**Dimension:** Codebase Alignment
**Location:** `00-index.md` `> **Implements**: —`; `.github`/roadmap protocol
**Codebase Evidence:** `plans/00-roadmap.md` tracks one row per RD; every row links a plan. This
plan implements no RD.
**The Problem:** Preflight/roadmap sync cannot advance a row that does not exist, so the plan's
progress is untracked.

**Options:**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | Add a roadmap row for this feature (linked as standalone) | Visible progress | Slight protocol extension |
| B | Leave the roadmap untouched | No overhead | Plan invisible in the roadmap |

**Recommendation:** Option A; this matches the earlier flagged item and keeps the roadmap honest.

**User Decision:** Resolved — user accepted the recommendation (2026-09-24).

---

### PF-009: Security — no blind spot found 🔵 OBSERVATION

**Dimension:** Security
**Codebase Evidence:** Provenance values come from the validated schema and `package.json`;
rendering reuses `table`/`escapeTableCell`/`inlineCode` (`scripts/skill/render/sections.ts`), which
escape table-breaking characters. No new external input, shell, or network surface.
**Conclusion:** No action required.

**User Decision:** Resolved — user accepted the recommendation (2026-09-24).

---

### PF-010: Phase 4 enhancement depends on a local `.env` 🔵 OBSERVATION

**Dimension:** Feasibility
**Codebase Evidence:** `package.json` `enhance` script uses `--env-file-if-exists=.env`; a `.env`
exists locally. Phase 4 is a one-time local corpus refresh, not a CI step.
**Conclusion:** Fine locally; note that CI cannot run Phase 4. No action required.

**User Decision:** Resolved — user accepted the recommendation (2026-09-24).

---

### PF-011: `PackageJsonInfo` should be exported with `readPackageJson` 🔵 OBSERVATION

**Dimension:** Codebase Alignment
**Location:** `03-01-provenance-capture.md` §New Functions
**Codebase Evidence:** `scripts/scraper/discover.ts` declares `interface PackageJsonInfo` privately;
`tsconfig.build.json` does not declaration-emit `scripts/`, so this is not a current compile error.
**Conclusion:** Export the interface for cleanliness and to avoid a future declaration-emit break.
Optional.

**User Decision:** Resolved — user accepted the recommendation (2026-09-24).

---

## Iteration 2 — Verification & Regression Check

Fixes applied to the plan documents; re-scanned all 13 dimensions within the unchanged audit target.

| Finding | Resolution | Verification |
| ------- | ---------- | ------------ |
| PF-001 | ST-10 rewritten to use a temporary `package.json` and skill dir; `99` §5.1.1 updated | `07` ST-10 and `99` §5.1.1 now avoid repo mutation |
| PF-002 | Added exported `releaseStagePaths()` in `03-04`; `07` impl table and `99` §5.2.1 updated | Pure staging set is unit-testable |
| PF-003 | Added `packageJsonPath` option in `03-02` §Integration Points; `99` §2.2.3 updated | Generator can read a fixture package.json |
| PF-004 | Must Haves numbered `R1–R9` in `01`; all `07` ST source cells updated | No phantom `R2` reference remains |
| PF-005 | `00-index` example generator value set to `1.1.0` | Matches `03-02` and `99` |
| PF-006 | Removed the unreachable empty-string branch from `renderProvenance` in `03-02` | Validated source assumed |
| PF-007 | `03-01` and `07` now require re-checking existing scraper expectations after the fixture add | Impact acknowledged |
| PF-008 | Added `SP-01` row to `plans/00-roadmap.md` | Plan is tracked |
| PF-009 | Security: no action | — |
| PF-010 | Phase 4 `.env`: no action (local-only) | — |
| PF-011 | `PackageJsonInfo` export added to `03-01` | — |

**Regression check:** the edits are mutually consistent — `01` R-numbers match the `07` ST sources;
the `1.1.0` generator value matches across `00-index`, `03-02`, and `99`; `releaseStagePaths()` is
consistent across `03-04`, `07`, and `99`; the `packageJsonPath` option is consistent across `03-02`
and `99`. No new finding introduced.

**Verdict:** ✅ PREFLIGHT PASSED WITH NOTES — 3 major resolved, 5 minor resolved, 3 observations
accepted. No unresolved critical or major findings.

**Human-review note:** `references/domains/selection.md` and the `_shared/*` lens/complexity
documents were not present on this machine, so domain-lens selection could not be verified and the
recommendation-hardening challenger was not spawned. This is a same-session review; a fresh-session
audit is advisable before execution.
