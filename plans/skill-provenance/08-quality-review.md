# Quality Review: Skill Provenance Disclosure

> **Status**: 🔄 Fixes applied — re-review pending
> **Reviewed**: 2026-09-24
> **Profile**: strict CodeOps defaults (no `codeops/codeops.json`); base lenses correctness + maintainability + standards; no security/perf add-ons (local deterministic pipeline; no web/auth/money/concurrency surface)
> **Scope mode**: strict
> **Reviewer role**: independent phase reviewer (`correctness-reviewer`), one dispatch per executed phase

## Dispatch headers

```
[codeops-dispatch agent=phase-reviewer feature=skill-provenance phase=1]
[codeops-dispatch agent=phase-reviewer feature=skill-provenance phase=2]
[codeops-dispatch agent=phase-reviewer feature=skill-provenance phase=3]
[codeops-dispatch agent=phase-reviewer feature=skill-provenance phase=4]
[codeops-dispatch agent=phase-reviewer feature=skill-provenance phase=5]
```

## Verdicts

| Phase | Diff range | Verdict |
| ----- | ---------- | ------- |
| 1 — schema and scraper capture | `914c95d..8935f09` | PASS — no findings |
| 2 — generator provenance render | `8935f09..0ebdaf7` | BLOCKED — 1 major, 1 minor |
| 3 — SKILL.md guidance | `0ebdaf7..852b8f4` | PASS WITH MINOR — 1 minor |
| 4 — corpus refresh and regenerate | `852b8f4..b8767a6` | PASS — no findings |
| 5 — release integration | `b8767a6..fc26b50` | PASS WITH MINOR — 3 minor |

## Findings and rulings

| ID | Sev | Location | Issue | Ruling |
| -- | --- | -------- | ----- | ------ |
| RV-101 | 🟠 MAJOR | `scripts/skill/mapping.ts` (`formatPackageVersionRange`) | Counted component entries (198) but labelled them "packages"; the corpus has only 51 distinct packages. | User ruled: dedupe by `packageName` before counting → `51 packages, 9.2.17–9.25.0` |
| RV-102 | 🟡 MINOR | `scripts/skill/generate.ts` (`readSkillVersion`) | Fail-closed paths were untested. | Fixed: added missing/malformed/no-version tests |
| RV-201 | 🟡 MINOR | `src/__tests__/skill/skill-guidance.spec.test.ts` | The `references/index.md` assertion was tautological (the literal pre-existed). | Fixed: assert the rule's exact provenance pointer |
| RV-501 | 🟡 MINOR | `scripts/release.mjs` | `regenerateSkill` skipped under `--no-git-commit` while other writes ran, leaving the tree stale. | Fixed: always regenerate in the non-dry-run branch |
| RV-502 | 🟡 MINOR | `scripts/skill/check-drift.ts` | `runCheck` did not resolve/forward `package.json` against its `cwd`. | Fixed: resolve and forward `packageJsonPath` |
| RV-503 | 🟡 MINOR | `scripts/release.mjs`, `.github/workflows/release.yml` | Release docs/usage/workflow header omitted the regeneration step. | Fixed: documented the step in all three |

Corrected reviewer claim: RV-101's aside that the range impl test encoded wrong semantics was itself
incorrect — the helper produced two distinct packages. A dedicated same-package dedupe test was
added instead.

## Fixes applied

- `scripts/skill/mapping.ts` — per-package dedupe in `formatPackageVersionRange`; JSDoc updated.
- `.agents/skills/fluentui/references/index.md`, `.fluentui-skill-manifest.json` — regenerated.
- `scripts/release.mjs`, `scripts/skill/check-drift.ts`, `.github/workflows/release.yml` — RV-501/502/503.
- `src/__tests__/skill/provenance-render.impl.test.ts` — dedupe plus `readSkillVersion` cases.
- `src/__tests__/skill/skill-guidance.spec.test.ts` — RV-201.

## Verification

`npm run verify` — PASS (762 Vitest + 18 release tests; drift/validate/freshness/secrets gates).

## Re-review

Scoped to the fix diff (`e80c311..HEAD`), single pass per the budget cap. _Pending._
