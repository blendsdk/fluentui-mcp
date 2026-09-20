# Phase 5 Review — Installer & packaging (RD-05)

> **Phase baseline tree**: 74bc9d9599e95d82c7b0b4d2ac01bfa4fa31c2bc
> **Review diff**: `74bc9d95` → `d55bae3`
> **Scope**: strict · **Expected modification set**: `src/skill/**`, `src/bin.ts`, `scripts/skill/**`, `src/__tests__/skill/**`, `package.json`, `.gitignore`

## Reviewers

Two independent reviews ran in parallel:

- Correctness reviewer (`phase-reviewer`).
- Security auditor (filesystem writes outside the repository).

## Findings

| ID | Severity | Location | Finding |
|----|----------|----------|---------|
| SEC-01 | 🟠 MAJOR | `scripts/skill/assemble.ts:79,85` | The assemble CLI accepted an unconstrained `--dest`; `assembleSkill` resolved it and ran a recursive delete before use, so any path could be deleted. Reproduced against an unrelated temp directory. Repo-only build script, not shipped. |
| SEC-02 | 🟡 MINOR | `src/skill/install-skill.ts:344` | `cleanLeftovers` deleted any entry whose name started with `.fluentui-skill.tmp-`/`.bak-`, including user directories such as `.fluentui-skill.tmp-notes`. |
| SEC-03 | 🟡 MINOR | `src/skill/install-skill.ts:362` | `assertReplaceable` treated a directory as ours when the marker merely existed, even with invalid JSON. |
| SEC-04 | 🟡 MINOR | `src/skill/install-skill.ts:648` | The installed `version` was printed without sanitizing control characters, allowing terminal escape injection from a crafted marker. |
| F1 | 🟡 MINOR | `src/skill/install-skill.ts:694` | Exported `isMainModule()` was never used; the bin has its own entry guard. |
| F2 | 🟡 MINOR | `src/__tests__/skill/install-skill.spec.test.ts:74` | The packaging spec asserted `package.json` fields instead of the required `npm pack` result, so it could pass while pack excluded `skills/`. |
| F3 | 🟡 MINOR | spec test | Requirement identifiers appear in test comments and names, matching the existing spec-test convention. |
| F4 | 🟡 MINOR | installer | `--all`/`--project` are covered only indirectly; `--link` only by an implementation test. |
| F5 | 🟡 MINOR | `tsconfig.build.json` | `yarn build` compiles `src/**` only; `scripts/skill/assemble.ts` is not type-checked by the designated verify. |
| F6 | 🟡 MINOR | `package.json:26` | `prepack` runs the full suite, and the pre-existing flaky scraper tests can intermittently time out and block publish. |
| F7 | 🟡 MINOR | installer | The "Should Have" post-install hint naming the client directories is loose. |

Security verdict was FAIL on SEC-01; correctness verdict was PASS WITH MINOR FINDINGS.

## Rulings

| ID | Ruling |
|----|--------|
| SEC-01 | Fix: remove the `--dest`/`--source` flags and constrain `assembleSkill` to `<cwd>/skills/fluentui`. |
| SEC-02 | Fix: only delete leftovers matching the exact `.fluentui-skill.(tmp\|bak)-\d+` pattern. |
| SEC-03 | Fix: treat a destination as replaceable only when it has a valid marker or a `SKILL.md`. |
| SEC-04 | Fix: strip control characters from the version before printing it. |
| F1 | Fix: delete the unused export. |
| F2 | Fix: run a real `npm pack` against an isolated package fixture and assert the file list. |
| F6 | Fix: raise the vitest test timeout so the pre-existing heavy tests stop flaking under parallel load. |
| F3, F4, F5, F7 | Keep in strict scope; recorded as non-blocking notes. |

## Re-review (fix diff `d55bae3..1e4c78f`)

One focused re-review. Verdict: **PASS WITH MINOR FINDINGS — no critical or major finding
remains.** It confirmed every targeted fix with a live reproduction, including an attempt to
defeat the constrained assemble destination by passing hostile CLI arguments and `..` paths; the
attempt failed. It reported three minor follow-ups, two of which were applied:

| ID | Fix |
|----|-----|
| NEW-1 | Added regression tests for the cleanup-pattern, invalid-marker refusal, and control-character sanitizing fixes. |
| NEW-2 | Extended the sanitizer to strip Unicode display-formatting characters (bidirectional overrides) as well as control characters. |
| NEW-3 | Informational only: the packaging test shells out to `npm`, which needs `npm.cmd` on Windows. Matches the existing pattern; no change. |

## Outcome

Phase 5 is complete and its acceptance criteria are met: the installer works, the package is
packable with no `data/`, and the full verify chain passes.
