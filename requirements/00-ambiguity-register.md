# Ambiguity Register: FluentUI Agent Skill

> **Status**: ✅ GATE PASSED — all 22 items resolved
> **Last Updated**: 2026-09-19 11:50

This register is the audit trail for the FluentUI Agent Skill requirements. Every resolved row
records the authority for a decision. Requirements may not be authored until every row is
`✅ Resolved` or explicitly `⏸ Deferred` in the named form.

## Resolved

| # | Category | Ambiguity / Gap | Options Presented | User Decision | Status |
|---|----------|-----------------|-------------------|---------------|--------|
| 1 | Scope | Deliver as MCP or skill | Keep MCP / Build skill / Dual | Build an Agent Skill, retire MCP | ✅ Resolved — User |
| 2 | Naming | Skill name and version scope | `fluentui` / `fluentui-v9` | `fluentui`, React v9 only | ✅ Resolved — User |
| 3 | Scope | Fate of MCP runtime | Delete / Keep both | Delete all MCP code and `@modelcontextprotocol/sdk` | ✅ Resolved — User |
| 4 | Data & state | Skill content source | Legacy `docs/` / schema pipeline / both | Schema pipeline only; retire `docs/` | ✅ Resolved — User |
| 5 | Technical | How skill markdown is produced | Deterministic generator from JSON / enhancer writes markdown | Enhanced JSON → deterministic generator | ✅ Resolved — User |
| 6 | Technical | Reference granularity | Per-component/topic / per-category | Per-component and per-topic files | ✅ Resolved — User |
| 7 | Integration | Distribution | npm + installer / committed repo only / both | npm package + `skill install` CLI | ✅ Resolved — User |
| 8 | Technical | LLM provider | Existing OpenAI/Anthropic / blendsdk DeepSeek mechanism | blendsdk v5 mechanism, DeepSeek `deepseek-flash`, `reasoning_effort=max`, fail-fast | ✅ Resolved — User |
| 9 | Technical | Content model | Original LLM-rich per-component incl. code / three-layer | Three-layer: deterministic API+stories, LLM prose only, validated recipes | ✅ Resolved — User |
| 10 | Technical | Reuse vs regenerate enhanced JSON | Reuse existing / regenerate fresh | Regenerate fresh with prose-only prompts | ✅ Resolved — User |
| 11 | UX & presentation | Skill completeness | Full offline corpus / lean read-installed-package | Full offline corpus | ✅ Resolved — User |
| 12 | Technical | Work isolation | On master / separate branch | Separate branch `feat/fluentui-skill` | ✅ Resolved — User |
| 13 | Naming | Package and CLI name | `fluentui-skill`+`fluentui` / keep `fluentui-mcp` / `@blendsdk/fluentui-skill` | npm package `fluentui-skill`, bin `fluentui` | ✅ Resolved — User |
| 14 | Data & state | Ship `data/` in npm? | Do not ship / ship both | Do not ship `data/`; ship prebuilt `skills/fluentui/` only | ✅ Resolved — User |
| 15 | Scope | Legacy `docs/` corpus | Delete / keep unreferenced | Delete; history preserves it at `5f68d21` | ✅ Resolved — User |
| 16 | Scope | `techdocs/` VitePress site | Keep and rewrite / delete | Delete `techdocs/` and its deploy workflow | ✅ Resolved — User |
| 17 | Feature gaps | Recipe set (Layer C) | ~18 proposed / ~10 core / user list | Adopt the ~18 proposed task recipes | ✅ Resolved — User |
| 18 | Feature gaps | Category guidance organization | Per schema category (8) / per recipe / merged | One guidance document per schema category (8 total) | ✅ Resolved — User |
| 19 | Technical | Example-validation strictness | Gate API errors + repair types / gate all types | Gate API errors (missing package/symbol/member); repair type-only errors | ✅ Resolved — User |
| 20 | Technical | FluentUI source ref | Latest stable tag / chosen version / master | Pin to the latest stable release tag; record the commit in the schema | ✅ Resolved — User |
| 21 | Feature gaps | Scraper component gaps | Fix now / defer / enhancer-only | Fix scraper discovery and classification before generating the skill | ✅ Resolved — User |
| 22 | UX & presentation | Architecture docs home after `techdocs/` deletion | `requirements/decisions/` + README / lightweight `docs/architecture/` / `plans/` | ADR-style documents under `requirements/decisions/`; developer section in `README.md` | ✅ Resolved — User |

## Resolution Notes

**AR-1 … AR-12:** Established during the design discussion; full rationale in
`requirements/_draft/discovery-notes.md`.

**AR-13 … AR-21:** Decisions confirmed by the user on 2026-09-19. AR-16 (delete `techdocs/`)
differed from the recommendation and directly created AR-22.

**AR-22:** User chose Option A — architecture decisions live under `requirements/decisions/` and
the developer overview moves into `README.md`.

Gate passed on 2026-09-19; the RD set may be authored.
