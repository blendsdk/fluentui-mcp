# Phase 8 Review: Docs, decisions & evaluation (RD-08)

> **Phase diff**: `f5bb855908aa17a8f474778df72f45929d6246f8` → `980fd08`
> **Reviewers**: correctness reviewer + security auditor (parallel, strict scope)
> **Verdicts**: correctness **FAIL** (one major) · security **PASS WITH MINOR FINDINGS**
> **Status**: ✅ Closed — major fixed, re-review PASS

Phase 8 adds the skill-first README, five ADRs, project `AGENTS.md`, the one-time skill-vs-MCP
evaluation report, and the repository-hygiene spec tests for the docs. No production code changed.

## Findings — correctness

| ID | Severity | Location | Finding | Evidence |
|----|----------|----------|---------|----------|
| F1 | 🟠 major | `README.md:131,147`, `AGENTS.md:22` | The freshness gate was described as "the schema is newer than the FluentUI source". The gate never reads the source date; it compares the manifest's `schemaHash` with the current enhanced schema. The claim is false and appeared in two deliverables. | `scripts/skill/check-freshness.ts:74-83`; `requirements/RD-04-content-integrity.md:40`. |
| F2 | 🟡 minor | `repo-hygiene.spec.test.ts:180` | The ADR test only checked that an `AR-\d+` token was present; it accepted a citation of a non-existent entry. | Test matched `/\bAR-\d+\b/` without a register lookup. |
| F3 | 🟡 minor | `evaluation-report.md:21,88` | "Both arms derive from the same underlying schema" overstated provenance; the two enhanced schemas differ structurally, and only the raw FluentUI source revision is shared. | `git show 5eeab6a:data/v9/fluentui-schema-enhanced.json` differs from the current schema in `patterns`/`enterprise` vs `recipes`. |

## Findings — security

| ID | Severity | Location | Finding | Evidence |
|----|----------|----------|---------|----------|
| VA-8-01 | 🟡 minor | `README.md:46` | The documented `npx -y fluentui-skill skill install` names an npm package that is not yet published, so a third party could register it before release. The command is required by the plan, so this is a publish prerequisite. | `npm view fluentui-skill` returns not found. |

The auditor confirmed: no secret or provider response body in any new document; the new spec tests
introduce no traversal, symlink, unbounded-read, or ReDoS issue; the evaluation provenance hashes
match; no new dependency or network call.

## Ruling and fixes

The user ruled **"Fix F1 + cheap hardening"**:

- **F1 (required):** reworded the freshness gate in `README.md` (workflow comment and gates table)
  and `AGENTS.md` to "the committed tree matches the current enhanced schema (manifest hash)".
- **F3 (cheap):** corrected the evaluation report to say both arms share the raw FluentUI source
  revision while the enhanced schema layers differ (`patterns`/`enterprise` vs `recipes`).
- **F2 (cheap):** strengthened the ADR test to read the ambiguity register, collect its entry
  numbers, and require every cited entry to exist.
- **VA-8-01 (accepted note):** no document change; the package must be published under the exact
  name `fluentui-skill` before the README is advertised publicly.

All fixes are documentation or test-only; no production behavior changed.

## Verification and re-review

- `npx vitest run src/__tests__/repo/repo-hygiene.spec.test.ts` → 9 passing.
- `yarn skill:freshness` → "Skill is fresh."
- `yarn build && yarn test` → 35 files / 713 tests passing.
- One re-review scoped to the fix diff → **PASS**. The freshness wording now matches
  `check-freshness.ts`; the evaluation provenance is accurate; the strengthened ADR test passes on
  the real ADRs and fails on a planted `AR-999`. No new critical or major finding.
