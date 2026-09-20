# Requirements: FluentUI Agent Skill

> **Document**: 01-requirements.md
> **Parent**: [Index](00-index.md)
> **Source**: The owning requirements are the RD set in `../../requirements/`:
> [RD-01](../../requirements/RD-01-content-model.md), [RD-02](../../requirements/RD-02-llm-enhancement.md),
> [RD-03](../../requirements/RD-03-skill-generator.md), [RD-04](../../requirements/RD-04-content-integrity.md),
> [RD-05](../../requirements/RD-05-installer-packaging.md), [RD-06](../../requirements/RD-06-mcp-retirement.md),
> [RD-07](../../requirements/RD-07-non-functional.md), [RD-08](../../requirements/RD-08-docs-evaluation.md)

This document is a delta view. It does not restate requirement behavior or acceptance criteria; the
RD set owns those. Read the RD before executing the matching phase.

## Scope of this plan (delta view)

### In this plan

- RD-01 — complete scraper coverage, pinned source ref, deterministic Layer A (AR-02, AR-20, AR-21).
- RD-02 — DeepSeek-flash-max provider, cost gate, prose-only enhancement, 8 category guides,
  19 recipes (AR-08, AR-09, AR-10, AR-17, AR-18).
- RD-03 — deterministic enhanced-JSON → skill-tree generator, `SKILL.md`, manifest (AR-05, AR-06, AR-11).
- RD-04 — example validation, API-reference, drift, freshness, format, secrets, coverage gates (AR-19).
- RD-05 — `fluentui-skill` package, `fluentui skill install|status|uninstall`, assemble (AR-07, AR-13, AR-14).
- RD-06 — delete MCP runtime, `docs/`, `techdocs/`; migrate tests (AR-03, AR-15, AR-16).
- RD-07 — determinism, offline use, performance, security, compatibility (cross-cutting).
- RD-08 — README, `requirements/decisions/` ADRs, skill-vs-MCP evaluation (AR-22).

### Deferred / out of this plan

- Publishing to npm — the plan makes the package verifiably packable; `npm publish` stays manual (PR-3).
- Any larger support surface — none approved; deferred machinery is excluded per the RDs.

## Plan-local decisions

| Decision | Chosen | AR / PR Ref |
| -------- | ------ | ----------- |
| Verify command | `yarn build && yarn test` | PR-1 |
| Plan coverage | All 8 RDs, phase by phase | PR-2 |
| Render logic home | Relocate to `scripts/skill/render/` | PR-5 |
| Source tag selection | Latest stable tag at scrape time, recorded | PR-6 |
| Node engine floor | `>=20` | PR-7 |

## Acceptance Criteria

Plan-local only; each RD owns its own criteria.

1. [ ] All eight phases complete and verified with `yarn build && yarn test`.
2. [ ] The skill generates deterministically and installs into a temp target via the CLI.
3. [ ] Example validation and API-reference gates pass on the committed skill.
4. [ ] No MCP, `docs/`, or `techdocs/` references remain.
5. [ ] README, ADRs, and the evaluation report exist.
