# FluentUI Agent Skill Implementation Plan

> **Feature**: Replace the FluentUI MCP server with an Agent Skill teaching FluentUI React v9.
> **Status**: Planning Complete
> **Created**: 2026-09-19
> **Implements**: RD-01, RD-02, RD-03, RD-04, RD-05, RD-06, RD-07, RD-08
> **CodeOps Artifact Schema**: 1

## Overview

This plan turns `fluentui-mcp` into the `fluentui` Agent Skill. The knowledge pipeline is kept and
rebalanced into three layers (deterministic API + Storybook examples, LLM prose, routing), a
deterministic generator emits the skill's Markdown tree, integrity gates prove every example
compiles and every prose reference exists, and an npm CLI installs the skill into coding agents.
The MCP runtime, the legacy `docs/` corpus, and the `techdocs/` site are then removed.

The plan is executed in eight phases matching RD-01 … RD-08, each following the mandatory
specification-first ordering (spec tests → red → implement → green → impl tests → verify).

## Minimum-Sufficient Baseline

**Original goal:** Give a coding agent accurate, offline, task-routed knowledge for building
FluentUI React v9 apps, without installing an MCP server.

**Smallest viable design:** Keep the existing scraper and enhancer, switch the LLM provider to the
proven blendsdk DeepSeek mechanism, narrow LLM output to prose, and add a deterministic generator
that renders the already-scraped data into a skill tree. Reuse the existing formatter logic by
relocating it, and reuse the blendsdk installer pattern rather than inventing one.

**Excluded machinery:** A VitePress site (deleted, AR-16); shipping `data/` in the package
(AR-14); a second/fallback LLM provider (AR-08); a graph or readiness service (not needed).

**Approved complexity:** None beyond the approved RDs. All material surfaces (new provider,
generator, gates, installer, retirements) are owned by an approved RD.

## Document Index

| #   | Document | Description |
| --- | -------- | ----------- |
| AR  | [Ambiguity Register](00-ambiguity-register.md) | Plan-local gate decisions (audit trail) |
| 00  | [Index](00-index.md) | This document — overview and navigation |
| 01  | [Requirements](01-requirements.md) | Delta view over RD-01 … RD-08 |
| 02  | [Current State](02-current-state.md) | Analysis of the existing repository |
| 03-01 | [Content Pipeline](03-01-content-pipeline.md) | RD-01 + RD-02 technical specification |
| 03-02 | [Skill Generator](03-02-skill-generator.md) | RD-03 technical specification |
| 03-03 | [Integrity Gates](03-03-integrity-gates.md) | RD-04 technical specification |
| 03-04 | [Installer & Packaging](03-04-installer-packaging.md) | RD-05 technical specification |
| 03-05 | [Retirement & Cleanup](03-05-retirement-cleanup.md) | RD-06 technical specification |
| 03-06 | [Docs, Decisions & Evaluation](03-06-docs-decisions-eval.md) | RD-08 technical specification |
| 07  | [Testing Strategy](07-testing-strategy.md) | Spec test cases and verification |
| 99  | [Execution Plan](99-execution-plan.md) | Phases, sessions, and task checklist |

## Quick Reference

### Target layout

```
.agents/skills/fluentui/          # committed skill
  SKILL.md                        # hand-written
  assets/templates/*.md           # hand-written
  references/                     # generated
skills/fluentui/                  # assembled for npm
scripts/skill/                    # generator, gates, installer source
requirements/decisions/           # ADRs
```

### Key Decisions

| Decision | Outcome | AR / PR |
| -------- | ------- | ------- |
| Runtime | Retire MCP; ship an Agent Skill | AR-01, AR-03 |
| Content source | Schema pipeline only | AR-04 |
| Examples | Scraped Storybook stories | AR-09 |
| LLM | DeepSeek-flash-max, prose only, fail-fast | AR-08, AR-09 |
| Skill output | Deterministic generator from enhanced JSON | AR-05 |
| Package | `fluentui-skill`, bin `fluentui`, no `data/` | AR-13, AR-14 |
| Verify | `yarn build && yarn test` | PR-1 |

## Related Files

**Created:** `scripts/skill/**`, `src/skill/install-skill.ts`, `src/bin.ts`,
`.agents/skills/fluentui/**`, `plans/**`, `requirements/decisions/**`, `plans/00-roadmap.md`.

**Modified:** `scripts/enhancer/**`, `src/types/schema.ts`, `package.json`, `tsconfig.build.json`,
`vitest.config.ts`, `.github/workflows/**`, `README.md`, `AGENTS.md`, `.gitignore`.

**Deleted:** `src/index.ts`, `src/server.ts`, `src/config.ts`, the MCP runtime parts of
`src/schema/**` (already removed under PR-8), `src/search/**`, `src/formatters/**`, `src/tools/**`,
`src/types/index.ts`, `docs/**`, `techdocs/**`, `deploy-techdocs.yml`.

**Retained:** `src/schema/schema-validator.ts` — shared schema validation used by the enhancer,
generator, and gates (PR-15).
