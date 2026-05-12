# Schema-Driven Pipeline — Implementation Plan

> **Feature**: Automated FluentUI documentation pipeline with schema-driven MCP server
> **Status**: Planning Complete
> **Created**: 2026-05-11

## Overview

This plan transforms the FluentUI MCP server from a static markdown-based documentation server into a **schema-driven, automatically updatable** system. The new architecture uses a multi-stage pipeline (Scrape → Enhance → Serve) that extracts component data directly from the FluentUI source code, enriches it with LLM-generated descriptions and guides, and serves it through a schema-driven MCP server.

The key improvements are:
- **100% accurate props/slots/types** extracted directly from TypeScript source
- **Real Storybook examples** from Microsoft's own test suite
- **Automated updates** via CI/CD pipeline
- **Multi-version support** (v8, v9, future v10) via configuration
- **Full coverage**: components + utilities + contrib + preview packages
- **Structured queries** that markdown-based search can't support

## Document Index

| # | Document | Description |
|---|----------|-------------|
| 00 | [Index](00-index.md) | This document — overview and navigation |
| 01 | [Requirements](01-requirements.md) | Feature requirements and scope |
| 02 | [Current State](02-current-state.md) | Analysis of current implementation |
| 03 | [Schema Design](03-schema-design.md) | The enhanced JSON schema format |
| 04 | [Scraper](04-scraper.md) | Stage 1: FluentUI source code scraper |
| 05 | [Enhancer](05-enhancer.md) | Stage 2: LLM enrichment pipeline |
| 06 | [MCP Server Refactor](06-mcp-server-refactor.md) | Stage 3: Schema-driven MCP server |
| 07 | [CI/CD & Automation](07-cicd-automation.md) | GitHub Actions workflows |
| 08 | [Testing Strategy](08-testing-strategy.md) | Test cases and verification |
| 99 | [Execution Plan](99-execution-plan.md) | Phases, sessions, and task checklist |

## Quick Reference

### Pipeline Commands

```bash
# Full pipeline
yarn pipeline:full --version v9 --source /path/to/fluentui

# Individual stages
yarn scrape --version v9 --source /path/to/fluentui
yarn enhance --version v9
yarn build && yarn test

# CI trigger (manual dispatch)
gh workflow run update-docs.yml -f version=v9
```

### Key Decisions

| Decision | Outcome |
|----------|---------|
| Data store format | JSON schema (not markdown) |
| Type extraction | ts-morph `getTypeNode()?.getText()` (syntactic, no `yarn install`) + `.api.md` fallback |
| Version support | Per-version adapter pattern; V9 implemented, V8 deferred to future phase |
| LLM enhancement | Diff-based — only new/changed components |
| Version bundling | Default version bundled, others on-demand |
| MCP migration | Incremental — keep working throughout |
| Project structure | Scripts directory with `tsconfig.build.json` for build separation |
| Package scope | Components + utilities + contrib + preview |
| Story extraction | Full stories with imports, styles, context; 10KB size limit |
| `enhanced` field | Optional on ComponentEntry/UtilityEntry — graceful degradation |
| ComponentCategory | String type with `KNOWN_COMPONENT_CATEGORIES` const for validation |
| Version bump | 1.2.0 (backward-compatible MCP API, internal refactor) |
| Node.js minimum | >=20.0.0 (Node 18 is EOL) |

## Related Files

### Existing (to be refactored)
- `src/index.ts` — MCP server entry point
- `src/indexer/` — Current markdown-based indexer (to be replaced)
- `src/tools/` — Current 12 MCP tools (to be migrated)
- `docs/v9/` — Current markdown docs (to become optional output)

### New (to be created)
- `scripts/scraper/` — FluentUI source code scraper
- `scripts/enhancer/` — LLM enrichment pipeline
- `data/` — Generated schema files (bundled in npm)
- `.github/workflows/update-docs.yml` — Automated update workflow
- `.github/workflows/ci.yml` — PR build & test workflow
