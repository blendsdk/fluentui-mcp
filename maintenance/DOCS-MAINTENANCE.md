# Documentation Maintenance Guide

> **Purpose**: How to update, regenerate, and manage the FluentUI schema that powers the MCP server
> **Last Updated**: 2026-06-02

## Overview

The FluentUI MCP server is **schema-driven**. All documentation — component
props, slots, stories, AI-written descriptions, best practices, accessibility
notes, guides, and patterns — lives in a single bundled JSON file:

```
data/<version>/fluentui-schema-enhanced.json
```

At runtime the server loads this schema, validates it, builds an in-memory
search index, and serves all 12 tools from memory. **No markdown is parsed at
runtime.**

The schema is produced offline by a two-stage pipeline:

```
┌─────────────┐   ┌──────────────┐   ┌─────────────────────────┐
│   Scraper   │ → │   Enhancer   │ → │  fluentui-schema-       │
│ (ts-morph)  │   │  (LLM-based) │   │  enhanced.json (bundled)│
└─────────────┘   └──────────────┘   └─────────────────────────┘
```

1. **Scraper** (`scripts/scraper/`) — Uses `ts-morph` to extract props, slots,
   stories, and defaults directly from the FluentUI source code. Produces
   `data/<version>/fluentui-schema.json` (the *raw* schema).
2. **Enhancer** (`scripts/enhancer/`) — Calls an LLM to add descriptions, when-to-use
   guidance, do/don't best practices, accessibility details, common patterns,
   and to generate foundation/enterprise/quick-reference guides plus UI
   patterns. Produces `data/<version>/fluentui-schema-enhanced.json` (the
   *enhanced* schema that ships with the package).

---

## Prerequisites

The enhancer needs an LLM provider. Create a local `.env` file (gitignored)
based on `.env.example`:

```bash
LLM_PROVIDER=openai            # or "anthropic"
OPENAI_API_KEY=sk-...          # or ANTHROPIC_API_KEY=...
# Optional tuning:
# LLM_MODEL=gpt-4o
# LLM_CONCURRENCY=3
# LLM_MAX_RETRIES=5
```

The `yarn scrape` / `yarn enhance` scripts auto-load `.env` via
`node --env-file-if-exists=.env`.

---

## Common Tasks

### Regenerate everything (scrape + enhance + verify)

```bash
yarn pipeline:full
```

This runs: `yarn scrape --version v9 --clone && yarn enhance --version v9 --full && yarn build && yarn test`.

### Re-scrape only (after a FluentUI version bump)

```bash
# Clones/pulls the FluentUI repo and re-extracts the raw schema
yarn scrape --version v9 --clone
```

Output: `data/v9/fluentui-schema.json`.

### Re-enhance only (incremental)

```bash
yarn enhance --version v9
```

The enhancer is **incremental**: it hashes each source entry (`sourceHash`) and
only re-runs the LLM for entries whose source changed. Unchanged entries keep
their existing AI content. This keeps costs and runtime low.

- `--full` — force re-enhance every entry (ignores hashes).
- `--components-only` / `--guides-only` — limit the scope.
- `--dry-run` — print a diff report of what *would* change without making any
  LLM calls (free, fast).
- `--verbose` — log each component/utility/guide/pattern as it is processed.
- `--concurrency N` — number of parallel LLM calls (default 3).
- `--provider` / `--model` — override the `.env` provider/model.

Output: `data/v9/fluentui-schema-enhanced.json`.

### Preview changes without spending tokens

```bash
yarn enhance --version v9 --dry-run
```

---

## Adding a New Version (e.g., v10)

1. Register the version in the scraper config (`scripts/scraper/config.ts`) —
   add the package paths / git ref for the new version.
2. Run the pipeline for the new version:

   ```bash
   yarn scrape --version v10 --clone
   yarn enhance --version v10 --full
   ```

3. The new `data/v10/fluentui-schema-enhanced.json` is produced. Ship it by
   ensuring `data/` is included in the package `files` (it already is).
4. Serve the new version:

   ```bash
   # Method 1: CLI argument
   fluentui-mcp v10

   # Method 2: Environment variable
   FLUENTUI_VERSION=v10 fluentui-mcp

   # Method 3: Custom schema path (file located anywhere)
   FLUENTUI_SCHEMA_PATH=/path/to/v10/fluentui-schema-enhanced.json fluentui-mcp
   ```

---

## Schema Structure Reference

The enhanced schema is a single JSON object. Key sections:

| Section      | Description |
|--------------|-------------|
| `metadata`   | Version, generation timestamp, stats (component/utility/story/prop counts). |
| `components` | Array of components. Raw fields (`name`, `category`, `props`, `slots`, `stories`, `defaults`) plus an `enhanced` object. |
| `utilities`  | Array of hooks/helpers with `exports`, parameters, and an `enhanced` object. |
| `guides`     | Foundation, enterprise, and quick-reference guides. |
| `patterns`   | UI patterns (forms, layout, navigation, modals, state). |

### Component `enhanced` object

```jsonc
{
  "description": "...",
  "whenToUse": "...",
  "bestPractices": { "dos": ["..."], "donts": ["..."] },
  "accessibility": {
    "requirements": ["..."],
    "keyboardSupport": ["..."],
    "ariaAttributes": ["..."],
    "screenReaderBehavior": "..."
  },
  "commonPatterns": [{ "name": "...", "description": "...", "code": "..." }],
  "stylingTips": "...",
  "migrationNotes": "...",
  "sourceHash": "...",   // used for incremental re-enhancement
  "enhancedAt": "ISO timestamp"
}
```

Guides and patterns carry `id`, `title`, `category`/`group`, `content`,
`codeExamples`/`examples`, `referencedComponents`, `sourceHash`, and
`enhancedAt`.

---

## Validation

The server validates the schema on startup. You can also validate implicitly by
running the test suite, which exercises the schema loader and validator. A
schema with structural **errors** will be reported on stderr; **warnings** are
non-fatal.

---

## Verification Checklist

After regenerating or editing the schema:

- [ ] Raw schema produced: `data/<version>/fluentui-schema.json`
- [ ] Enhanced schema produced: `data/<version>/fluentui-schema-enhanced.json`
- [ ] Enhanced schema is NOT gitignored and is committed (it ships with the package)
- [ ] Schema validates with 0 errors (check stderr on server start)
- [ ] Build passes: `yarn clean && yarn build`
- [ ] Tests pass: `yarn test`
- [ ] Spot-check a component via the `query_component` tool or by inspecting the
      JSON (e.g. `jq '.components[] | select(.name=="Button")'`)

---

## CI/CD

Schema regeneration and verification are wired into the CI workflows under
`.github/workflows/`. The pipeline can scrape, enhance, build, and test on a
schedule or on demand. See the workflow files for triggers and secrets
(`LLM_PROVIDER`, `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`).
