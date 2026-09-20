# FluentUI Agent Skill — Requirements Documents

> **Project**: FluentUI Agent Skill — replace the FluentUI MCP server with an Agent Skill that
> teaches a coding agent to build React applications with FluentUI React v9.
> **Status**: Draft
> **Created**: 2026-09-19
> **Architecture**: TypeScript content pipeline (ts-morph scraper → DeepSeek-flash-max enhancer →
> deterministic Markdown generator) producing a distributable Agent Skill installed by an npm CLI.
> **CodeOps Skills Version**: 3.20.0

---

## Overview

The repository `fluentui-mcp` currently ships an MCP server that serves FluentUI v9 documentation
from a bundled JSON schema over stdio. This feature replaces that runtime with an **Agent Skill**
named `fluentui`: a plain-Markdown knowledge package a coding agent reads on demand, with no
server to install or configure.

The knowledge is produced by a three-layer model. **Layer A** is deterministic: component props,
slots, defaults, JSDoc, and real Storybook examples extracted from FluentUI source and pinned to a
release tag. **Layer B** is LLM-authored prose only — when-to-use, accessibility, anti-patterns —
aggregated per category, grounded in the scraped data, and generated with the blendsdk v5 DeepSeek
`deepseek-flash` mechanism at `reasoning_effort=max` with fail-fast behavior. **Layer C** is the
skill's routing surface: `SKILL.md`, category guidance, roughly eighteen validated task recipes,
foundation guides, a quick reference, and project templates.

A deterministic generator turns the enhanced schema into the skill's Markdown tree, so the output
is diffable, regenerable, and gate-able. The skill's core trust guarantee is that every code
example type-checks against the real `@fluentui/react-components` package and every component or
prop named in prose exists in the scraped schema.

## Domain Glossary

| Term | Definition |
|------|-----------|
| Agent Skill | A Markdown knowledge package (`SKILL.md` plus `references/`) discovered by coding agents; no runtime process. |
| Layer A | Deterministic API and example content generated from the raw schema; examples are Storybook stories. |
| Layer B | LLM-authored prose guidance (no code), grounded in scraped data. |
| Layer C | The skill's routing surface: `SKILL.md`, category guidance, recipes, foundation, quick reference, templates. |
| Raw schema | `fluentui-schema.json` — scraper output: components, utilities, props, slots, stories. |
| Enhanced schema | `fluentui-schema-enhanced.json` — raw schema plus Layer B prose and Layer C recipes/guides. |
| Category guidance | One prose document per schema category (8 total) describing how and when to use that family. |
| Recipe | A validated task-level composition guide (for example, a login form or a data table). |
| Gate | A CI-checked quality check (drift, freshness, format, secrets, coverage, example validation). |
| Manifest | `.fluentui-skill-manifest.json` — hashes proving the committed skill matches its source schema. |
| Assemble | Build step copying `.agents/skills/fluentui/` into the packaged `skills/fluentui/`. |

## Document Index

| # | Document | Description | Depends On |
|---|----------|-------------|------------|
| **AR** | [Ambiguity Register](00-ambiguity-register.md) | Zero-Ambiguity Gate decisions (audit trail) | — |
| **RD-01** | [Content Model & Scraper Coverage](RD-01-content-model.md) | Layer A: deterministic API + story examples; fix scraper coverage; pinned source ref | — |
| **RD-02** | [LLM Enhancement](RD-02-llm-enhancement.md) | Layer B: DeepSeek-flash-max provider, cost gate, prose-only prompts, category guidance, recipes | RD-01 |
| **RD-03** | [Deterministic Skill Generator](RD-03-skill-generator.md) | Layer C: enhanced JSON → skill Markdown tree, `SKILL.md`, manifest | RD-01, RD-02 |
| **RD-04** | [Content Integrity Gates](RD-04-content-integrity.md) | Example validation, API-reference check, drift, freshness, format, secrets, coverage | RD-03 |
| **RD-05** | [Installer & Packaging](RD-05-installer-packaging.md) | `fluentui skill install` CLI, npm packaging, assemble step | RD-03 |
| **RD-06** | [MCP Retirement & Cleanup](RD-06-mcp-retirement.md) | Remove MCP runtime; delete `docs/` and `techdocs/`; migrate tests | RD-03, RD-05 |
| **RD-07** | [Non-Functional Requirements](RD-07-non-functional.md) | Determinism, offline use, performance, security, compatibility, accessibility | RD-01 … RD-06 |
| **RD-08** | [Documentation, Decisions & Evaluation](RD-08-docs-evaluation.md) | README, `requirements/decisions/` ADRs, skill-vs-MCP evaluation | RD-03, RD-06 |

## Dependency Graph

```
RD-01 (Content model & scraper coverage)
  │
  ├── RD-02 (LLM enhancement)
  │     │
  │     └── RD-03 (Deterministic skill generator)
  │           ├── RD-04 (Content integrity gates)
  │           ├── RD-05 (Installer & packaging)
  │           └── RD-06 (MCP retirement & cleanup) ── also needs RD-05
  │
  └── RD-07 (Non-functional requirements)  [cross-cutting: RD-01 … RD-06]
          └── RD-08 (Documentation, decisions & evaluation)
```

## Suggested Implementation Order

| Phase | Documents | Description |
|-------|-----------|-------------|
| **A: MVP** | RD-01 → RD-05 | Content model, LLM enhancement, generator, gates, and installable skill |
| **B: Cleanup & hardening** | RD-06 → RD-07 | Remove MCP and dead docs; meet non-functional targets |
| **C: Documentation** | RD-08 | README, ADRs, and evaluation evidence |

## Key Architecture Decisions

| Decision | Choice | Rationale | AR Ref |
|----------|--------|-----------|--------|
| Delivery mechanism | Agent Skill, not MCP | No install/config/process; agent reads Markdown on demand | AR-1 |
| Content source | Schema pipeline only | `docs/` was LLM-generated, ungrounded, and stale | AR-4 |
| Example authority | Storybook stories (deterministic) | LLM-authored code caused the original accuracy problem | AR-9 |
| LLM scope | Prose only, aggregated per category | Cheaper, smaller hallucination surface, less to validate | AR-9, AR-18 |
| Skill generation | Deterministic JSON → Markdown | Diffable, regenerable, gate-able | AR-5 |
| LLM provider | DeepSeek `deepseek-flash`, reasoning `max`, fail-fast | Same proven mechanism as blendsdk v5 | AR-8 |
| Release | npm package `fluentui-skill`, bin `fluentui` | Honest name; `fluentui skill install` | AR-13 |
| Fallback none | DeepSeek failure aborts the run | Wrong docs are worse than a failed run | AR-8 |

## How to Use These Documents

1. Pick a requirements document (start with RD-01).
2. Run the `make-plan` skill against it to produce an implementation plan.
3. Run the `exec-plan` skill to implement iteratively.
4. Verify with the project's build and test commands before each commit.

## Commonly Forgotten Requirements — Final Check

| # | Concern | Addressed? | In Which RD |
|---|---------|------------|-------------|
| 8 | Accessibility (WCAG) | Yes — skill content requirements | RD-01, RD-02, RD-07 |
| 22 | Graceful degradation / offline behavior | Yes — full offline corpus | RD-07 |
| 25 | Configuration management | Yes — env vars for the pipeline | RD-02 |
| 26 | Input validation & sanitization | Yes — installer path validation, schema validation | RD-05, RD-07 |
| 27 | Injection prevention | Yes — no shell interpolation; path traversal guards | RD-04, RD-05, RD-07 |
| 28 | Authentication & authorization | N/A — no server, no accounts | — |
| 29 | Rate limiting | N/A — offline pipeline; LLM retry/backoff documented | — |
| 30 | Secrets management | Yes — `DEEPSEEK_API_KEY` via gitignored `.env`; secret scan gate | RD-02, RD-04, RD-07 |
| 31 | Data encryption | N/A — no stored user data; TLS to LLM endpoint | RD-07 |
| 32 | Infrastructure hardening | N/A — npm library, no containers | — |
| 33 | Security testing | Yes — secret scan, path traversal, no-execution guarantee | RD-04, RD-07 |

Items 1–7, 9–21, 23–24 are not applicable to a documentation/skill-generation library: there is no
server, database, user account, email, or user-generated content. Content correctness is covered by
the integrity gates in RD-04.
