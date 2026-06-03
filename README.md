# FluentUI MCP Server

[![npm version](https://badge.fury.io/js/fluentui-mcp.svg)](https://www.npmjs.com/package/fluentui-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

> **Model Context Protocol (MCP) server** providing AI assistants with intelligent, context-efficient access to
> Microsoft FluentUI documentation.

Build production-grade React UIs with FluentUI — powered by AI that actually knows the component library.

---

## What is this?

This is an MCP server that gives AI assistants (Claude, Cline, Cursor, etc.) deep knowledge of the
[Microsoft FluentUI](https://react.fluentui.dev/) component library. Instead of the AI guessing at component APIs or
hallucinating props, it queries **real documentation** through specialized tools.

### The Problem

AI assistants often:

-   ❌ Hallucinate FluentUI component props that don't exist
-   ❌ Use outdated v8 patterns when you need v9
-   ❌ Load entire documentation sets, wasting context window
-   ❌ Miss best practices, accessibility requirements, and patterns

### The Solution

This MCP server provides **12 specialized tools** that give AI assistants:

-   ✅ Accurate, up-to-date component documentation
-   ✅ Smart search across 100+ documentation pages
-   ✅ Props references, code examples, and patterns on demand
-   ✅ Component suggestions based on UI descriptions
-   ✅ Implementation guides combining docs + patterns + examples
-   ✅ ~90% context window reduction vs loading all docs

---

## Quick Start

### Install

```bash
npm install -g fluentui-mcp
```

### Configure Cline (VS Code)

Add to your Cline MCP settings:

```json
{
    "mcpServers": {
        "fluentui-docs": {
            "command": "fluentui-mcp"
        }
    }
}
```

**Settings file location:**

-   macOS:
    `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
-   Windows: `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`

### Configure Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
    "mcpServers": {
        "fluentui-docs": {
            "command": "fluentui-mcp"
        }
    }
}
```

### That's it! 🎉

Restart your AI assistant and you'll have access to all FluentUI documentation tools.

---

## Multi-Version Support

The server supports multiple FluentUI versions. Pass the version as an argument:

```json
{
    "mcpServers": {
        "fluentui-v9": {
            "command": "fluentui-mcp",
            "args": ["v9"]
        }
    }
}
```

You can even run multiple versions simultaneously:

```json
{
    "mcpServers": {
        "fluentui-v9": {
            "command": "fluentui-mcp",
            "args": ["v9"]
        },
        "fluentui-v10": {
            "command": "fluentui-mcp",
            "args": ["v10"]
        }
    }
}
```

### Custom Schema Path

Point to your own enhanced schema file:

```json
{
    "mcpServers": {
        "fluentui-docs": {
            "command": "fluentui-mcp",
            "env": {
                "FLUENTUI_SCHEMA_PATH": "/path/to/your/fluentui-schema-enhanced.json"
            }
        }
    }
}
```


---

## Available Tools (12)

### Core Documentation Tools

| Tool                   | Description                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| **`query_component`**  | Get complete documentation for a specific component. Supports fuzzy name matching.          |
| **`search_docs`**      | Search across ALL documentation (components, patterns, enterprise). Returns ranked results. |
| **`list_by_category`** | List all components in a category (buttons, forms, navigation, etc.).                       |
| **`get_foundation`**   | Get setup, theming, styling, and architecture documentation.                                |
| **`get_pattern`**      | Get UI pattern documentation (forms, layout, navigation, modals, state management).         |
| **`get_enterprise`**   | Get enterprise-grade patterns (dashboards, admin UIs, data-heavy apps, accessibility).      |

### Intelligence Tools

| Tool                           | Description                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------- |
| **`suggest_components`**       | Given a UI description, suggests which FluentUI components to use and why.             |
| **`get_implementation_guide`** | Combines relevant docs + patterns + examples into a step-by-step implementation guide. |
| **`get_component_examples`**   | Extracts only code examples from a component's docs (minimal context usage).           |
| **`get_props_reference`**      | Extracts only the props table from a component's docs (quick lookup).                  |

### Utility Tools

| Tool                | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| **`list_all_docs`** | Lists all available documentation with descriptions.             |
| **`reindex`**       | Re-scans the documentation folder and rebuilds the search index. |

---

## How It Works

The server is powered by a **schema-driven pipeline**. Instead of parsing
markdown at runtime, a single pre-built JSON schema bundles all FluentUI
documentation. That schema is generated offline by a two-stage pipeline:

```
┌─────────────┐   ┌──────────────┐   ┌─────────────────────────┐
│   Scraper   │ → │   Enhancer   │ → │  fluentui-schema-       │
│ (ts-morph)  │   │  (LLM-based) │   │  enhanced.json (bundled)│
└─────────────┘   └──────────────┘   └─────────────────────────┘
   Extracts          Adds AI            Single source of truth
   props/slots/      descriptions,      shipped with the package
   stories from      best practices,
   FluentUI source   a11y, patterns
```

At runtime the MCP server simply loads and serves that schema:

```
┌──────────────────────────────────────────────────┐
│               MCP Server (stdio)                 │
│    Receives tool calls from AI assistants        │
├──────────────────────────────────────────────────┤
│            12 Specialized Tools                  │
│   query │ search │ suggest │ guide │ ...         │
├──────────────────────────────────────────────────┤
│              Formatters Layer                    │
│  component │ guide │ pattern │ props │ list │ …  │
├──────────────────────────────────────────────────┤
│          In-Memory Schema Store + Search         │
│   ┌────────────┐ ┌────────────┐ ┌──────────┐     │
│   │   Schema   │ │ Categories │ │  Search  │     │
│   │   Store    │ │   Index    │ │  Index   │     │
│   └────────────┘ └────────────┘ └──────────┘     │
├──────────────────────────────────────────────────┤
│      Schema Loader │ Validator │ Search Engine    │
├──────────────────────────────────────────────────┤
│      Bundled Schema (fluentui-schema-enhanced)   │
│   Components │ Utilities │ Guides │ Patterns      │
└──────────────────────────────────────────────────┘
```

### Loading Strategy

1. **Startup**: Server loads the bundled enhanced schema JSON (< 1 second)
2. **Validate**: Schema is validated; any structural issues are reported to stderr
3. **Index**: Builds an in-memory search index with TF-IDF scoring
4. **Serve**: All tool calls served from memory (instant, no disk I/O)
5. **Reindex**: The `reindex` tool can rebuild the index on demand

### Schema Coverage (FluentUI v9)

| Section        | Content                                                              | Count |
| -------------- | -------------------------------------------------------------------- | ----- |
| **Components** | Props, slots, stories, AI descriptions, best practices, a11y, prop guidance, anti-patterns, composition examples, performance/theming notes, edge cases | 62    |
| **Utilities**  | Hooks and helper exports with parameter references + performance notes | 4     |
| **Guides**     | Foundation, enterprise, and quick-reference guides (with key takeaways, pitfalls, a11y notes) | 16    |
| **Patterns**   | Form, layout, navigation, modal, and state-management patterns (with when-to-use / when-not-to-use, pitfalls) | 15    |



---

## Usage Examples

### AI Workflow: Building a Login Form

```
User: "Create a login form with email and password"

AI uses tools:
1. suggest_components({ uiDescription: "login form with email and password" })
   → Suggests: Input, Field, Button, Card

2. get_implementation_guide({ goal: "login form" })
   → Returns combined docs + form patterns + code examples

3. AI implements the form with accurate props and patterns
```

### AI Workflow: Building a Data Table

```
User: "Create a sortable data table with selection"

AI uses tools:
1. search_docs({ query: "table sorting selection" })
   → Finds: Table, DataGrid, sorting patterns

2. query_component({ componentName: "DataGrid" })
   → Full DataGrid documentation

3. get_component_examples({ componentName: "DataGrid" })
   → Just the code examples for reference

4. AI implements with correct DataGrid API
```

---

## Development

### Setup

```bash
git clone https://github.com/blendsdk/fluentui-mcp.git
cd fluentui-mcp
yarn install
```

### Build

```bash
yarn build          # Compile TypeScript
yarn watch          # Watch mode
```

### Test

```bash
yarn test           # Run tests
yarn test:watch     # Watch mode
yarn test:coverage  # Coverage report
```

### Project Structure

```
fluentui-mcp/
├── src/                        # MCP server (runtime)
│   ├── index.ts                # stdio transport entry point
│   ├── server.ts               # Tool definitions, state, dispatch
│   ├── config.ts               # Configuration resolver
│   ├── types/                  # Schema + shared TypeScript types
│   ├── schema/
│   │   ├── schema-loader.ts    # Resolves & loads the bundled schema
│   │   ├── schema-store.ts     # In-memory schema store + indexes
│   │   └── schema-validator.ts # Structural schema validation
│   ├── search/
│   │   ├── search-engine.ts    # TF-IDF search engine
│   │   └── search-index.ts     # In-memory search index
│   ├── formatters/             # Render schema entries → markdown
│   └── tools/                  # 12 MCP tool implementations
├── scripts/                    # Offline schema pipeline (build-time)
│   ├── scraper/                # ts-morph extraction from FluentUI source
│   └── enhancer/               # LLM enrichment + guide/pattern generation
├── data/
│   └── v9/
│       ├── fluentui-schema.json          # Raw scraped schema
│       └── fluentui-schema-enhanced.json # Enhanced schema (shipped)
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## Configuration

| Source                         | Priority                     | Example                                |
| ------------------------------ | ---------------------------- | -------------------------------------- |
| CLI argument                   | Medium (version)             | `fluentui-mcp v9`                      |
| `FLUENTUI_VERSION` env var     | Medium                       | `FLUENTUI_VERSION=v9`                  |
| `FLUENTUI_SCHEMA_PATH` env var | Highest (overrides version)  | `FLUENTUI_SCHEMA_PATH=/my/schema.json` |
| Default                        | Lowest                       | Bundled v9 enhanced schema             |

---

## Regenerating the Schema

The bundled schema is generated offline by the scraper + enhancer pipeline.
Enrichment requires an LLM provider — set `LLM_PROVIDER` (`openai` or
`anthropic`) and the matching API key in a local `.env` file (see
`.env.example`).

```bash
# 1. Scrape props/slots/stories from FluentUI source (clones the repo)
yarn scrape --version v9 --clone

# 2. Enhance with AI descriptions, best practices, a11y, and guides
yarn enhance --version v9 --full

# Or run the whole pipeline (scrape → enhance → build → test) in one step:
yarn pipeline:full
```

The enhancer is incremental: it hashes each source entry and only re-runs the
LLM for entries that changed. Use `--dry-run` to preview a diff without making
any LLM calls.

---

## Troubleshooting

### Server Not Loading

1. Verify installation: `which fluentui-mcp`
2. Test manually: `fluentui-mcp` (should output to stderr: "FluentUI MCP Server running on stdio")
3. Check MCP settings JSON syntax
4. Restart VS Code / AI assistant

### Tool Errors

1. **"Schema not found"**: Check the version exists under `data/` or set `FLUENTUI_SCHEMA_PATH`
2. **"Component not found"**: Try `search_docs` with broader terms
3. **Search returning no results**: Try `reindex` to rebuild the search index

### Performance

-   First query: < 100ms (served from memory after startup load)
-   Search queries: < 50ms (pre-built TF-IDF index)
-   Startup: < 1 second to load and index the bundled schema


---

## Contributing

Contributions welcome! Especially:

-   Documentation for new FluentUI versions
-   Additional tools and intelligence features
-   Search engine improvements
-   Bug reports and fixes

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## See Also

-   [FluentUI React Components](https://react.fluentui.dev/) — Official documentation
-   [Model Context Protocol](https://modelcontextprotocol.io/) — MCP specification
-   [Cline](https://github.com/saoudrizwan/claude-dev) — VS Code AI assistant
