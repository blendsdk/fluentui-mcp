# Ambiguity Register: FluentUI Agent Skill Plan

> **Status**: ✅ GATE PASSED — all 7 items resolved
> **Last Updated**: 2026-09-19 11:46
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

## Resolution Notes

**PR-1 … PR-4:** Confirmed by the user on 2026-09-19 before plan authoring.

**PR-5 … PR-7:** Implementation choices with no behavioral or scope impact; each traces to an
already user-approved requirement (RD-06, AR-20, RD-07 respectively). No user decision was
substituted for a behavioral choice.

No plan document may implement a decision outside the resolved RD set or this register.
