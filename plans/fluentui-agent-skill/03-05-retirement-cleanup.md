# Retirement & Cleanup: FluentUI Agent Skill

> **Document**: 03-05-retirement-cleanup.md
> **Parent**: [Index](00-index.md)
> **Implements**: RD-06

## Overview

This specification removes the MCP runtime, the legacy `docs/` corpus, and the `techdocs/` site
after the skill is generated, installed, and gated. It also migrates tests and CI to the surviving
source set.

## Architecture

### Proposed Changes

- Delete MCP runtime and its dependency.
- Relocate formatter logic needed by the generator (done in 03-02); delete the rest.
- Delete `docs/`, `techdocs/`, and the Pages deploy workflow.
- Update `package.json`, `tsconfig.build.json`, `vitest.config.ts`, `.gitignore`, and CI.
- Rename `update-docs.yml` → `update-skill.yml` and rewrite its stages.

## Implementation Details

### Deleted

| Path | Reason |
| ---- | ------ |
| `src/index.ts`, `src/server.ts`, `src/config.ts` | MCP entry/dispatch (AR-03) |
| `src/schema/**`, `src/search/**`, `src/formatters/**`, `src/tools/**`, `src/types/index.ts` | MCP runtime |
| `@modelcontextprotocol/sdk` dependency | No consumer |
| `docs/**` | Legacy agent-generated corpus (AR-15) |
| `techdocs/**`, `deploy-techdocs.yml` | VitePress site (AR-16) |
| MCP tests | Test deleted code |

### Surviving source set

| Path | Purpose |
| ---- | ------- |
| `scripts/scraper/**`, `scripts/enhancer/**` | Content pipeline |
| `scripts/skill/**` | Generator, gates, installer source, assemble |
| `src/types/schema.ts` | Shared schema types |
| `src/skill/install-skill.ts`, `src/bin.ts` | Published installer + CLI |
| `data/` | Local artifacts, not published |

### CI/CD

| Workflow | Change |
| -------- | ------ |
| `ci.yml` | Build + test + `skill:check` + `skill:validate` |
| `update-skill.yml` | scrape → enhance → generate → gates → PR (replaces `update-docs.yml`) |
| `deploy-techdocs.yml` | deleted |
| `publish.yml` | verify `skills/fluentui/SKILL.md` and bin; run gates (publish manual) |

### Config

- `vitest.config.ts` includes `src/__tests__/**` and `scripts/**/tests/**`.
- `tsconfig.build.json` compiles only the surviving `src/` (`bin.ts`, `skill/**`, `types/schema.ts`).
- `.gitignore` keeps `.cache/`; removes VitePress entries.

## Integration Points

- Requires working generator (03-02) and installer (03-04) first.
- Creates the documentation gap filled by 03-06.

## Error Handling

| Error Case | Handling Strategy | AR Ref |
| ---------- | ----------------- | ------ |
| Hidden MCP/docs references | Grep gates in acceptance criteria | AR-03 |
| Pipeline test imports deleted module | Migrate or delete the test | AR-06 |
| Build still emits MCP entry | Scoped tsconfig + package check | AR-03 |

## Testing Requirements

- Grep tests: no `@modelcontextprotocol`, no `docs/`, no `techdocs/` references outside history.
- Build/test green on the surviving set.
- Packaging test from 03-04 still passes after deletions.
