# Discovery Notes — FluentUI Agent Skill

> **Feature**: Replace the FluentUI MCP server with an Agent Skill that teaches a coding
> agent to build React applications with FluentUI React v9.
> **Status**: Discovery complete — awaiting Zero-Ambiguity Gate confirmation
> **Layout**: flat (`requirements/`)
> **Started**: 2026-09-19

This file preserves the discovery state so the session can resume. It is not a requirement
document. The authoritative decisions live in `requirements/00-ambiguity-register.md`; the
requirements themselves are written only after the gate passes.

---

## 1. Project vision

Turn the existing `fluentui-mcp` repository — today an MCP server that serves a bundled JSON
schema over stdio — into a distributable **Agent Skill** named `fluentui` that gives a coding
agent accurate, offline, task-routed knowledge for building React UIs with FluentUI React v9.

The MCP runtime is retired. The knowledge-generation pipeline (scraper + LLM enhancer) is kept
and rebalanced as the skill's content source. The skill content is produced by a deterministic
generator so it is diffable, regenerable, and gate-able.

## 2. Stakeholders

| # | Role | Description | Key needs |
|---|------|-------------|-----------|
| 1 | Coding-agent user | A developer using an agent (OpenCode, Claude Code, Codex, Cline) to build a FluentUI v9 React app | Correct component APIs, examples that compile, task-level guidance, low setup |
| 2 | Skill maintainer | The repo maintainer who regenerates the skill when FluentUI changes | Cheap, deterministic, verifiable regeneration; drift and freshness signals |
| 3 | LLM pipeline operator | Whoever runs the paid enhancement | Cost visibility, fail-fast behavior, no silent partial output |
| 4 | Repository owner | Owns the npm package and release | Clear packaging, no dead artifacts, honest documentation |

## 3. Domain lenses

Selected from repository evidence per `references/domains/selection.md`:

| Domain | Evidence | Status |
|--------|----------|--------|
| `compiler-and-language` | `ts-morph` AST extraction (`scripts/scraper`), generated markdown, code-example validation | Selected |
| `data-and-migration` | Serialized `fluentui-schema*.json` with `schemaVersion: '1.0'`, manifest hashes, incremental regeneration, mixed-version compatibility of committed skill content | Selected |
| `web-application` | none — no HTTP API, no sessions, no runtime server after MCP retirement | Not selected |
| `distributed-and-concurrent` | only bounded in-process LLM batching; no nodes, queues, replicas | Not selected |
| `financial-system` | none | Not selected |

## 4. Confirmed scope

- Skill name `fluentui`; scope is **FluentUI React v9 only** (v8/v10 out of scope).
- Skill lives at `.agents/skills/fluentui/` and is shipped as `skills/fluentui/` in npm.
- Content source of truth is the schema pipeline; the legacy `docs/` corpus is retired.
- Three-layer content model:
  - **Layer A — API + examples**: deterministic from the raw schema; examples are real
    Storybook stories.
  - **Layer B — guidance**: LLM prose only, grounded, aggregated per category.
  - **Layer C — routing + recipes**: `SKILL.md`, category guidance, ~15 task recipes,
    foundation, quick reference, templates.
- Skill markdown is emitted by a **deterministic generator** from the enhanced JSON.
- LLM provider is the blendsdk v5 mechanism, DeepSeek `deepseek-flash` with
  `reasoning_effort=max`, fail-fast, with a cost estimator and confirmation gate.
- Delivered via npm plus a `fluentui skill install` CLI that targets OpenCode, Claude Code,
  Codex, and the shared `.agents` convention, globally or per project.
- The MCP runtime, its tools, and its dependency are removed.

## 5. Out of scope

- v8, v10, Northstar, and any non-React Fluent packages.
- A hosted service, web API, or runtime network calls.
- Visual component previews or screenshots.
- MCP compatibility or a dual MCP-plus-skill delivery path.
- Hand-maintaining the legacy `docs/` corpus.

## 6. Comparable systems

| System | Relevant lessons |
|--------|------------------|
| blendsdk v5 skill | Deterministic generator, drift/freshness/format gates, example validation, installer, DeepSeek fail-fast provider |
| Official FluentUI docs (react.fluentui.dev) | Authoritative source for updates; not required at agent runtime because the skill is offline |
| Storybook for FluentUI | Real, compiled examples — the canonical example source |
| API Extractor `.api.md` reports | Machine-readable authoritative API surface (possible future source; see open questions) |

## 7. Pipeline shape

```
FluentUI source ──ts-morph──► fluentui-schema.json           (Layer A deterministic)
                                   │
              DeepSeek-flash-max ─►fluentui-schema-enhanced.json (Layer B prose)
                                   │
                deterministic ─────► .agents/skills/fluentui/  (Layer C routing)
                                   │
                assemble ──────────► skills/fluentui/ ──► npm ──► fluentui skill install
```

## 8. Acceptance signal

Every code example in the skill type-checks against the real `@fluentui/react-components`
package, and every component or prop named in prose exists in the raw schema. This is the
skill's core trust guarantee and the reason it beats the retired MCP output.

## 9. Open questions

Recorded with recommendations in `requirements/00-ambiguity-register.md`. None may be answered
by assumption; each needs an explicit user decision or a named deferral before RDs are written.

## 10. Resume pointer

Next step: present the Ambiguity Register to the user, obtain decisions, pass the gate, then
author the RD set. No RD has been written yet.
