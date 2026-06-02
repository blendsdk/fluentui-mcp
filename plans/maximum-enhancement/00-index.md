# Maximum Enhancement Implementation Plan

> **Feature**: Maximum-richness documentation enrichment for the FluentUI v9 enhancer pipeline
> **Status**: Planning Complete
> **Created**: 2026-06-02
> **CodeOps Version**: (codeops-mcp unavailable this session — version stamp pending)

## Overview

The `maximum-enhancement` feature overhauls the **enhancer** stage of the
schema-driven pipeline (Scraper → Enhancer → Enhanced JSON → MCP Server) so it
produces the richest, most complete FluentUI v9 documentation possible. The
goal is explicitly competitive: two other products generate the same kind of
output, and this work makes ours strictly better by removing every artificial
limit and adding new structured content.

Three forces drive the design. First, **remove all truncation** — the current
enhancer caps LLM output at 4096 tokens and silently drops any component whose
JSON does not fit; we raise output ceilings and add continuation/JSON-repair so
nothing is ever lost. Second, **feed the model everything** — the `KEY_PROPS_LIMIT`
6-prop cap is deleted, full props/types/slots/stories/imports/compositions are
injected, and guides receive complete targeted-component data. Third, **expand
the schema** — new enhanced fields (per-prop usage notes, anti-patterns,
performance notes, theming/token guidance, richer multi-example sets,
related-pattern links) give downstream MCP tools far more to surface.

All decisions were locked through the Zero-Ambiguity Gate (see
`00-ambiguity-register.md`). Cost is explicitly irrelevant; the default model is
`gpt-4o` with `.env` overrides honored.

## Document Index

| #   | Document                                            | Description                                  |
| --- | --------------------------------------------------- | -------------------------------------------- |
| AR  | [Ambiguity Register](00-ambiguity-register.md)      | Zero-Ambiguity Gate decisions (audit trail)  |
| 00  | [Index](00-index.md)                                | This document — overview and navigation      |
| 01  | [Requirements](01-requirements.md)                  | Feature requirements and scope               |
| 02  | [Current State](02-current-state.md)                | Analysis of the current enhancer pipeline    |
| 03  | [LLM Capacity](03-llm-capacity.md)                  | maxTokens threading + continuation/repair    |
| 04  | [Grounding Data](04-grounding-data.md)              | Remove cap, enrich summaries, targeted inject|
| 05  | [Schema Expansion](05-schema-expansion.md)          | New enhanced schema fields and types         |
| 06  | [Prompt Rewrites](06-prompt-rewrites.md)            | All 6 prompts rewritten for maximum richness |
| 07  | [Testing Strategy](07-testing-strategy.md)          | Spec-first test cases and verification       |
| 08  | [Formatters & Tools](08-formatters-tools.md)        | Surface new fields in MCP tool output        |
| 99  | [Execution Plan](99-execution-plan.md)              | Phases, sessions, and task checklist         |

## Quick Reference

### Goal in one line

> Generate the most complete, most useful FluentUI v9 docs of any tool — no
> truncation, all props, all stories, all compositions, plus new structured
> guidance fields.

### Key Decisions

| Decision           | Outcome                                                      |
| ------------------ | ----------------------------------------------------------- |
| Truncation         | Raise output ceiling + auto-continuation/JSON-repair        |
| Schema             | Expanded with new optional rich fields (back-compat)        |
| Grounding          | Smart-maximal — full data, structured to avoid context loss |
| Stories            | Full story `code`, all stories                              |
| Model              | `gpt-4o` default, `.env` honored                            |
| `KEY_PROPS_LIMIT`  | Removed — all props always                                  |
| Compositions       | All slots + related + additional exports                    |

## Related Files

**Enhancer (primary):**
- `scripts/enhancer/config.ts`, `types.ts`, `enhancer.ts`, `parse.ts`
- `scripts/enhancer/llm/openai.ts`, `llm/anthropic.ts`, `llm/provider.ts`
- `scripts/enhancer/prompts/*` (all six prompts + `shared.ts`)

**Schema & server:**
- `src/types/schema.ts`
- `src/schema/schema-validator.ts`
- `src/formatters/*`
- `src/tools/*`

**Tests:**
- `src/__tests__/enhancer/*`, `src/__tests__/schema/*`,
  `src/__tests__/formatters/*`, `src/__tests__/tools/*`
