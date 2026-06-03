# Configuration Reference

> **Last Updated**: 2026-06-04

## Runtime Environment Variables

These affect the **running MCP server**.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `FLUENTUI_VERSION` | No | `v9` | Version to serve; selects `data/<version>/`. CLI positional arg (`fluentui-mcp v9`) takes priority. |
| `FLUENTUI_SCHEMA_PATH` | No | bundled | Explicit path to an enhanced schema file. Overrides the bundled-location resolution. |

**Schema path resolution order** (`src/schema/schema-loader.ts`):

1. Explicit path passed to `loadSchema` (relative resolved against CWD).
2. `FLUENTUI_SCHEMA_PATH` env var.
3. Bundled `data/<version>/fluentui-schema-enhanced.json`.

## Pipeline Environment Variables (Offline)

These affect the **enhancer** only (see `.env.example`). Copy `.env.example` to
`.env`; it is auto-loaded by `yarn scrape` / `yarn enhance` via
`node --env-file-if-exists=.env` (requires Node ≥20.12).

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `LLM_PROVIDER` | Yes (to enhance) | — | `openai` or `anthropic` |
| `OPENAI_API_KEY` | If provider=openai | — | API key for OpenAI |
| `ANTHROPIC_API_KEY` | If provider=anthropic | — | API key for Anthropic |
| `LLM_MODEL` | No | provider default | Override model (e.g. `gpt-4o`, `claude-3-5-sonnet-latest`) |
| `LLM_CONCURRENCY` | No | `3` | Concurrent LLM requests during enhancement |
| `LLM_MAX_RETRIES` | No | `3` | Max retry attempts per request on transient failures |

> Model request shaping is family-aware (see
> [ADR-003](/decisions/ADR-003-llm-provider-model-family)): newer OpenAI
> families (GPT-5.x, o-series) use `max_completion_tokens` and omit
> `temperature`; older families use `max_tokens` with a custom `temperature`.

## Scraper CLI Flags

`yarn scrape` (`scripts/scraper/cli.ts`):

| Flag | Description |
|------|-------------|
| `--version <v>` | **Required.** Version config to use (e.g. `v9`) |
| `--source <path>` | Local FluentUI checkout (mutually exclusive with `--clone`) |
| `--clone` | Shallow-clone the FluentUI repo (mutually exclusive with `--source`) |
| `--ref <ref>` | Git ref for the main repo when cloning |
| `--contrib <path>` | Local fluentui-contrib checkout |
| `--contrib-ref <ref>` | Git ref for the contrib repo (triggers contrib clone) |
| `--reuse` | Reuse a previously cloned cache |
| `--output <path>` | Override output path (default `data/<version>/fluentui-schema.json`) |
| `--verbose` | Verbose logging |

## Enhancer CLI Flags

`yarn enhance` (`scripts/enhancer/cli.ts`):

| Flag | Description |
|------|-------------|
| `--version <v>` | Version to enhance (e.g. `v9`) |
| `--full` | Re-enhance everything, ignoring the diff |
| `--verbose` | Verbose logging |

The enhancer validates the output on write and exits non-zero on any validation
error.

## CI/CD Secrets

| Secret | Used by | Purpose |
|--------|---------|---------|
| `NPM_TOKEN` | `publish.yml` | Publish to npm |
| `LLM_PROVIDER` | `update-docs.yml` | Select enhancer provider |
| `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` | `update-docs.yml` | Provider key |
| `LLM_MODEL` | `update-docs.yml` | Optional model override |

> Never commit real keys. The runtime never needs any of these — they are
> build/CI-time only.
