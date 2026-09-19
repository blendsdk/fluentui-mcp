# Ambiguity Register: FluentUI Agent Skill Plan

> **Status**: ✅ GATE PASSED — all 9 items resolved (PR-8 and PR-9 resolved at runtime)
> **Last Updated**: 2026-09-19 15:20
> **CodeOps Artifact Schema**: 1

Plan-local decisions. Behavioral and scope decisions already resolved in the requirements register
(`requirements/00-ambiguity-register.md`, AR-1…AR-22) are not repeated here; only plan-local items
are recorded.

| # | Category | Ambiguity / Gap | Options Presented | Decision | Status |
|---|----------|-----------------|-------------------|----------|--------|
| PR-1 | Non-functional | Which command fills every Verify line | `yarn build && yarn test` / `yarn test` / add typecheck | `yarn build && yarn test` | ✅ Resolved — User |
| PR-2 | Scope | How much the plan covers | All 8 RDs / MVP only | All 8 RDs in one plan | ✅ Resolved — User |
| PR-3 | Scope | Publish boundary | Package-ready manual / include publish workflow / local only | Package-ready; `npm publish` stays manual | ✅ Resolved — User |
| PR-4 | UX & presentation | Create the repo roadmap? | Create / skip | Create `plans/00-roadmap.md` seeded with RD-01…RD-08 | ✅ Resolved — User |
| PR-5 | Technical | Where the skill's Markdown render logic lives after `src/formatters` is deleted | Relocate needed renderers to `scripts/skill/render/` / duplicate in generator / discard and rewrite | Relocate the reusable renderers; no duplication | ✅ Resolved — Author (zero semantic impact; RD-06 authorizes relocation) |
| PR-6 | Technical | How the pinned FluentUI release tag is selected | Query latest stable tag at run time / hardcode a tag now / always master | Resolve the latest stable release tag at scrape time; record it in the schema; `--fluentui-ref` overrides | ✅ Resolved — Author (implements AR-20) |
| PR-7 | Naming | Node engine floor | Keep `>=18` / `>=20` / `>=22` | `>=20`, matching RD-07 and global `fetch` assumptions | ✅ Resolved — Author (matches approved RD-07) |
| PR-8 (runtime) | Technical | Phase 2 replaces root `patterns[]`/`enterprise[]` with `recipes[]` and drops code-bearing fields, but their current consumers (`src/schema/**`, `src/search/**`, `src/formatters/**`, `src/tools/**`, MCP tests/fixtures) are not deleted until Phase 6, and `yarn build` (`tsconfig.build.json` includes all `src/**`) typechecks them. How to keep every phase green? | A) Hybrid supersession / B) Full replacement now / C) Front-load MCP removal | **Delete the dead MCP runtime + MCP tests now** (pre-executes the MCP subset of RD-06 deletion; user confirmed nobody uses the MCP). Phase 2 then replaces the schema cleanly with no throwaway work. Remaining RD-06 items — `docs/**`, `techdocs/**`, `package.json`, CI workflows, README — stay in Phase 6. | ✅ Resolved — User |
| PR-9 (runtime) | Technical | 03-02 lists a wall-clock `generatedAt` in the manifest, but RD-03 AC1 requires every generated file (including the manifest) to be byte-identical across runs, and Phase 4's `--check` drift gate compares regenerated output against the committed tree — a run timestamp would make both impossible. | A) Wall-clock `generatedAt` excluded from comparison / B) Omit `generatedAt` / C) Derive `generatedAt` from the input schema | **Derive `generatedAt` from the input schema's `generatedAt`** — the whole tree, manifest included, is then reproducible from the same input, satisfying RD-03 AC1 and making `--check` deterministic. | ✅ Resolved — Author (traces to RD-03 AC1; only reading consistent with determinism) |

## Resolution Notes

**PR-1 … PR-4:** Confirmed by the user on 2026-09-19 before plan authoring.

**PR-5 … PR-7:** Implementation choices with no behavioral or scope impact; each traces to an
already user-approved requirement (RD-06, AR-20, RD-07 respectively). No user decision was
substituted for a behavioral choice.

No plan document may implement a decision outside the resolved RD set or this register.
