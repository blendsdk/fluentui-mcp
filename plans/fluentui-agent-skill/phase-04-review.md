# Phase 4 Review — Content-integrity gates (RD-04)

> **Document**: phase-04-review.md
> **Parent**: [99-execution-plan.md](99-execution-plan.md)
> **Phase baseline**: `5fc3264`
> **Diff reviewed**: `5fc3264..e6662aa`
> **Spec**: [03-03-integrity-gates.md](03-03-integrity-gates.md)
> **Requirement**: [RD-04](../../requirements/RD-04-content-integrity.md)

## Method

One independent review of the Phase 4 diff under strict scope. The reviewer read the
requirement and rulings, inspected every gate module and test, ran the gate commands, probed the
tier-2 compiler behaviour, and scanned the repaired corpus against the installed package exports.

## Findings

| ID | Severity | Location | Finding |
|----|----------|----------|---------|
| F1 | 🔴 critical | `check-drift.ts`, `check-freshness.ts`, `secrets.ts`; `package.json` | The three CLIs export `runCheck`/`runFreshness`/`runSecrets` but never invoke them (no direct-invocation guard). `yarn skill:check`, `skill:freshness`, and `skill:secrets` exit 0 silently, so CI's drift step is a false pass and RD-04 AC3/AC4 are inert. |
| F2 | 🔴 critical | `validate-examples.ts` `typeCheckWithTsc` | All blocks compile in one `tsc` program; the CLI suppresses semantic diagnostics when any syntactic error exists, so a malformed snippet hides every type error. The committed corpus has 20 malformed blocks, so tier 2 reports 0 type errors (AC2 unmet). |
| F3 | 🟠 major | `common-patterns` guide (enhanced schema) | The repaired "Collections" example removed `Tabs` from the import but still renders `<Tabs>`, leaving an undefined component. |
| F4 | 🟠 major | component pages and quick references | The enhanced schema's component inventory contains names that are not exports (`Provider`, `Search`, `Progress`, `Spinbutton`, `Infolabel`, `Aria`, `Tags`, `Tabs`, `Motion`, `Positioning`, `Tabster`, `Utilities`), so those pages instruct imports that do not exist. Root cause is Phase 1's scraper output: the raw schema also lacks real components such as `CompoundButton`, `ProgressBar`, `SearchBox`, and `DataGrid`. No gate scans `importStatement`, so CI cannot catch this. |
| F5 | 🟡 minor | `gates.spec.test.ts` | The body-limit oracle imports `SKILL_BODY_MAX_LINES` from the implementation instead of the literal 500. |
| F6 | 🟡 minor | gate CLIs | `join(cwd, arg)` mangles absolute `--schema`/`--skill-dir` paths; `generate.ts` uses `resolve`. |
| F7 | 🟡 minor | `gates.spec.test.ts` | No test invokes the three CLIs (why F1 shipped); the real `SKILL.md` is not run through `validateSkillFormat`, and `references/index.md` is never asserted. |
| F8 | 🟡 minor | `validate-examples.ts` | `runValidate` silently skips the API-reference check when a schema path is missing. |
| F9 | 🟡 minor | `check-api-references.ts` | The raw-schema oracle accepts names like `Provider`, so PR-13-class names in structured fields cannot hard-fail. Documented limitation of PR-10/PR-12. |
| F10 | 🟡 minor | test comments; register | Test comments cite ST IDs (repo standard forbids ephemeral plan IDs in code); the register still shows PR-13 as pending. |
| F11 | 🟡 minor | `secrets.ts`, `check-freshness.ts`, `validate-examples.ts` | `SECRET_PATTERNS` exported but internal; freshness hashes twice; API findings use `line: 0`. |

## Verification results

| Command | Result |
|---------|--------|
| `yarn build` | pass |
| `yarn test` | 30 files / 665 tests pass |
| `scripts/skill/validate-examples.ts` | exit 0 (but tier 2 blind, F2) |
| `scripts/skill/check-drift.ts` / `check-freshness.ts` / `secrets.ts` | no-op (F1) |
| Security (no exec, args array, fixed cache) | pass |

## Verdict

**FAIL** — two critical and two major findings. The finding gate paused execution for the user's
ruling.

## Rulings and fixes

| ID | Ruling | Fix |
|----|--------|-----|
| F1 | Fix | `check-drift.ts`, `check-freshness.ts`, and `secrets.ts` now run their CLI when invoked directly; CLI entry points are covered by tests. |
| F2 | Fix | `typeCheckWithTsc` now compiles through the ts-morph/TypeScript compiler API and reports syntactic and semantic diagnostics together; the command line's semantic suppression no longer hides type errors. |
| F3 | Fix | The `common-patterns` Collections example now imports and renders `TabList`; the tree was regenerated. |
| F4 | Track as a separate defect (PR-14) | Recorded in the ambiguity register; the component-inventory correction is a Phase 1/2 follow-up with its own review. |
| F5 | Fix | The body-limit spec oracle uses the literal 500 instead of the implementation constant. |
| F6 | Fix | Gate CLIs use `resolve(cwd, path)`, so absolute arguments work. |
| F7 | Fix | Tests invoke `runCheck`, `runFreshness`, and `runSecrets`; the real `SKILL.md` is run through `validateSkillFormat` and `references/index.md` is asserted. |
| F8 | Fix | `runValidate` throws when a schema path is missing instead of skipping the API-reference check. |
| F9 | Accept as documented limitation | The raw-schema oracle matches PR-10/PR-12. |
| F10 | Fix | Plan IDs removed from test comments; the register records PR-13 and PR-14. |
| F11 | Fix | Freshness hashes the schema once. |

Full verify after the fixes: `yarn build && yarn test && yarn skill:check && yarn skill:validate`
all pass (670 tests).

## Re-review (fix diff `e6662aa..30302c0`)

One focused re-review. Verdict: **PASS WITH MINOR FINDINGS — no critical or major finding
remains.** It confirmed F1–F3 and F5–F8/F10 fixed, F2 genuinely reports semantic diagnostics in
the presence of a syntax error, and no unsafe casts or plan IDs in the code. Four minor
follow-ups were raised and applied:

| ID | Fix |
|----|-----|
| N1 | The F2 guard now passes a malformed block and a type-error block together and asserts the type error is reported. It uses a lightweight pure-TypeScript case so the suite is not starved by a full FluentUI compile. |
| N2 | Removed the unused test imports (`createGuideEntry`, `ExampleFinding`). |
| N3 | `flattenDiagnostic` now recurses through every linked diagnostic, not just the first. |
| N4 | `runValidate` checks schema existence before running the expensive example compile. |

## Outcome

Phase 4 is complete and its acceptance criteria are met. F4 (the component inventory) is tracked
as PR-14 for a Phase 1/2 correction.
