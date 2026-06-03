# Requirements: Maximum Enhancement

> **Document**: 01-requirements.md
> **Parent**: [Index](00-index.md)

## Feature Overview

Overhaul the enhancer pipeline so it generates the richest possible FluentUI v9
documentation. Remove every artificial limit (output token caps, the 6-prop
grounding cap, trimmed stories), inject the complete component/utility data into
prompts, expand the schema with new structured guidance fields, and surface all
of it through the MCP tools. The output must never be truncated or silently
dropped.

## Functional Requirements

### Must Have

- [ ] **No output truncation** — every component, utility, guide, and pattern is
  fully generated; large responses are completed via continuation, never dropped.
- [ ] **`maxTokens` threaded** from config → orchestrator → both providers, with a
  high default ceiling per model and `.env`/CLI override.
- [ ] **`KEY_PROPS_LIMIT` removed** — component summaries carry the full prop set,
  each with its TypeScript type.
- [ ] **All slots, `relatedComponents`, and `additionalExports`** included in
  component grounding.
- [ ] **All stories with full `code`** (imports + styles + render) injected into
  component prompts.
- [ ] **Guides receive smart-maximal grounding** — the full uncapped inventory
  plus the complete data for the components each guide targets.
- [ ] **Schema expanded** with new optional enhanced fields (see
  `05-schema-expansion.md`), preserving backward compatibility.
- [ ] **All six prompts rewritten** with explicit high content quotas, full-story
  anchoring, a grounding self-check, and requests for the new schema fields.
- [ ] **Validator updated** to validate the new fields.
- [ ] **Formatters & tools updated** to surface the new fields.
- [ ] **Default model `gpt-4o`**, `.env` (`LLM_PROVIDER`/`LLM_MODEL`) honored.

### Should Have

- [ ] Verbose logging of continuation events (how many continuation rounds per entry).
- [ ] A real `--full` enhancement run to validate richness, schema validity, and bundle size.

### Won't Have (Out of Scope)

- Changes to the scraper stage (`scripts/scraper/*`) — it already extracts full
  props/slots/stories.
- Changes to the search subsystem ranking algorithm.
- New MCP tools (we enrich existing tool output, not add tools).
- Multi-version support changes (still v9-focused).

## Technical Requirements

### Performance

- Enhancement runtime may increase substantially (larger prompts/outputs,
  continuation rounds). Acceptable — cost and time are not constraints (AR-1, AR-5).
- The MCP server must still load the (larger) enhanced schema into memory at
  startup without error.

### Compatibility

- New schema fields are **optional** (`?`) so older enhanced schemas still load
  and validate. Formatters must gracefully omit absent fields.
- Existing tests must continue to pass (updated where shapes change).

### Security

- No new user-input surface (the enhancer is a build-time CLI). LLM responses are
  parsed defensively (existing `parseJsonResponse` + new repair logic). No secrets
  are logged; API keys continue to come from `.env`.

## Scope Decisions

| Decision            | Options Considered | Chosen | Rationale | AR Ref |
| ------------------- | ------------------ | ------ | --------- | ------ |
| Truncation handling | raise-only / raise+continuation | raise+continuation | Never drop content | AR #1 |
| Schema              | content-only / expand | expand | Differentiator vs competitors | AR #2 |
| Guide grounding     | smart-maximal / blind-all | smart-maximal | Avoid context-overflow data loss | AR #3 |
| Story content       | renderCode / full code | full code | User emphasized stories | AR #4 |
| Default model       | keep / upgrade | gpt-4o + .env | User directive | AR #5 |
| Prop cap            | keep / remove | remove | User directive | AR #6 |
| Compositions        | partial / all | all | User directive | AR #7 |

> **Traceability:** Every scope decision references the Ambiguity Register entry
> that resolved it. See `00-ambiguity-register.md`.

## Acceptance Criteria

1. [ ] `yarn build` succeeds (src-only typecheck clean).
2. [ ] `yarn test` passes — all existing + new spec/impl tests green.
3. [ ] `maxTokens` is configurable and defaulted to a high per-model ceiling.
4. [ ] A response that exceeds the cap is completed via continuation and parses to valid JSON.
5. [ ] `KEY_PROPS_LIMIT` no longer exists in the codebase.
6. [ ] Component prompt payload includes all props (with types), all slots, all
   stories (full code), `relatedComponents`, and `additionalExports`.
7. [ ] New schema fields are present in the enhanced output and validate with 0 errors.
8. [ ] MCP tool output surfaces the new fields.
9. [ ] A live `gpt-4o --full` run produces a valid enhanced schema (0 validation errors).
