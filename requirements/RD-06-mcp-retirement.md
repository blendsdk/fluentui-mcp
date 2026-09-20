# RD-06: MCP Retirement & Cleanup

> **Document**: RD-06-mcp-retirement.md
> **Status**: Draft
> **Created**: 2026-09-19
> **Project**: FluentUI Agent Skill
> **Depends On**: RD-03, RD-05
> **CodeOps Skills Version**: 3.20.0

---

## Feature Overview

This requirement removes everything the skill replaces: the MCP server runtime, its tool layer, its
dependency, the legacy `docs/` corpus, and the `techdocs/` VitePress site. Removing them eliminates
two dead or drifting knowledge sources and the maintenance cost of a runtime that no longer has a
consumer.

The pipeline (scraper, enhancer, generator) and the schema data are retained; only the delivery
runtime and superseded documentation are deleted.

## Functional Requirements

### Must Have

- [ ] The MCP runtime is deleted: `src/index.ts`, `src/server.ts`, `src/config.ts`,
      `src/schema/**`, `src/search/**`, `src/formatters/**`, `src/tools/**`, and `src/types/index.ts`.
- [ ] The `@modelcontextprotocol/sdk` dependency is removed from `package.json`.
- [ ] MCP-specific tests are deleted; formatter logic that the skill generator still needs is
      relocated (not deleted) into the generator and covered by new tests.
- [ ] The legacy `docs/` corpus (141 files) is deleted; git history retains it.
- [ ] The `techdocs/` VitePress site and `.github/workflows/deploy-techdocs.yml` are deleted.
- [ ] `README.md` no longer documents MCP installation or tool usage.
- [ ] `package.json` scripts for MCP (`start`, `start:v9`) are removed; new scripts
      (`skill:generate`, `skill:check`, `skill:freshness`, `skill:validate`) are added.
- [ ] `tsconfig.build.json` and `.gitignore` are updated for the surviving source set.
- [ ] CI builds and tests the surviving code with no reference to MCP.

### Should Have

- [ ] `vitest.config.ts` includes tests under both `src/__tests__/**` and `scripts/**/tests/**`.
- [ ] The update workflow (`update-docs.yml` → `update-skill.yml`) runs scrape → enhance →
      generate → gates → pull request.
- [ ] Branch/trigger names no longer assume MCP.

### Won't Have (Out of Scope)

- Keeping MCP behind a flag or a deprecated package alias — AR-03.
- Retaining `docs/` in an archive folder inside the repo — AR-15.
- A migration shim for MCP users.

## Technical Requirements

### Surviving source set

| Path | Purpose |
|------|---------|
| `scripts/scraper/**` | Layer A extraction |
| `scripts/enhancer/**` | Layer B enhancement |
| `scripts/skill/**` | Generator, gates, installer sources |
| `src/types/schema.ts` | Shared schema types |
| `src/skill/install-skill.ts` | Published installer (compiled to `dist/`) |
| `src/bin.ts` | `fluentui` CLI dispatcher |
| `data/` | Local schema artifacts (not published) |

### CI workflows

| Workflow | Change |
|----------|--------|
| `ci.yml` | Build + test + drift + example validation |
| `update-skill.yml` | Replaces `update-docs.yml`; regenerates the skill and opens a PR |
| `deploy-techdocs.yml` | Deleted |
| `publish.yml` | Verifies `skills/fluentui/SKILL.md` and the bin; runs gates before publish |

### Dependency cleanup

`ts-morph`, `tsx`, and `vitest` remain. The MCP SDK is removed. Any transitive dev dependency that
existed only for the VitePress site (for example `vitepress`, `vitepress-plugin-mermaid`, `mermaid`)
is removed.

## Integration Points

### With RD-03 / RD-05

Cleanup happens only after the skill generates, installs, and passes its gates, so there is always a
working replacement.

### With RD-08

Deleting `techdocs/` (AR-16) moves architecture decisions to `requirements/decisions/` and the
developer overview into `README.md`.

## Scope Decisions

| Decision | Options Considered | Chosen | Rationale | AR Ref |
|----------|-------------------|--------|-----------|--------|
| MCP runtime | Delete / keep both / keep deprecated | Delete entirely | No consumer after the skill lands | AR-03 |
| Legacy docs | Delete / keep unreferenced / archive in-repo | Delete; history preserves | Dead, stale, ungrounded | AR-15 |
| Techdocs | Keep+rewrite / delete | Delete site and deploy workflow | Fewer artifacts; ADRs move in-repo | AR-16 |
| Formatter code | Delete / relocate | Relocate what the generator needs | Avoid losing tested rendering logic | AR-05 |

## Security Considerations

> **🚨 Mandatory.** Cleanup deletes files and dependencies.

- **Data sensitivity**: none.
- **Input validation**: deletion targets are fixed repository paths, never user-supplied.
- **Authentication & authorization**: N/A.
- **Injection risks**: no shell interpolation in cleanup scripts.
- **Encryption needs**: none.
- **Rate limiting**: N/A.
- **Infrastructure**: removing the deploy workflow also removes its Pages credentials usage.

## Acceptance Criteria

1. [ ] `grep -r "@modelcontextprotocol" .` outside `node_modules` returns no matches.
2. [ ] The repository contains no `src/index.ts`, `src/server.ts`, or `src/tools/` directory.
3. [ ] `docs/` and `techdocs/` directories do not exist; `deploy-techdocs.yml` is gone.
4. [ ] `yarn build && yarn test` succeeds with the surviving source set.
5. [ ] `package.json` has `bin.fluentui`, no MCP dependency, and the four `skill:*` scripts.
6. [ ] No tracked file references `docs/v9` or `techdocs/`.
7. [ ] Security requirements verified: no workflow references removed Pages or MCP secrets.
