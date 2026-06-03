# Getting Started

> **Last Updated**: 2026-06-04

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | ≥18 (≥20.12 for the pipeline) | The pipeline scripts use `--env-file-if-exists`, which needs Node ≥20.12 |
| Yarn | 1.22.x (classic) | Package manager for this repo |
| Git | any recent | Required for the scraper's `--clone` mode |

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/blendsdk/fluentui-mcp.git
cd fluentui-mcp
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Build

```bash
yarn build
```

### 4. Run the tests (verify)

```bash
yarn build && yarn test
```

### 5. Run the server

```bash
# Serve the bundled v9 schema
yarn start:v9

# or the default (v9)
yarn start
```

The server speaks MCP over stdio. Startup diagnostics are printed to **stderr**;
stdout is reserved for the MCP protocol.

## Using the Server with an MCP Client

Point your MCP client (e.g. Claude Desktop, Cline) at the built binary:

```json
{
  "command": "fluentui-mcp",
  "args": ["v9"]
}
```

For local development you can run it directly via `node dist/index.js v9` after
building.

## Project Structure

```
data/v9/        Bundled schemas (raw + enhanced) — served at runtime
docs/v9/        FluentUI source documentation content (NOT this techdocs site)
techdocs/       This VitePress technical-architecture site
scripts/        Offline pipeline: scraper/ (ts-morph) + enhancer/ (LLM)
src/            Runtime: schema/, search/, formatters/, tools/, server.ts, index.ts
src/__tests__/  Vitest suites mirroring the source areas
.github/        CI/CD workflows
plans/          Planning artifacts (point-in-time; superseded by techdocs)
```

> ⚠️ **Do not confuse `docs/v9/` with `techdocs/`.** `docs/v9/` is FluentUI
> content payload; `techdocs/` is this developer-facing architecture site.

## Next Steps

- Read the [System Overview](/architecture/system-overview) to understand the
  pipeline-vs-runtime split.
- See the [API Design](/architecture/api-design) for the 12 MCP tools.
- Review the [Architecture Decisions](/decisions/) for the "why".
- See the [Development Workflow](/guides/development) for the schema pipeline.
