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

### Custom Documentation Path

Point to your own documentation folder:

```json
{
    "mcpServers": {
        "fluentui-docs": {
            "command": "fluentui-mcp",
            "env": {
                "FLUENTUI_DOCS_PATH": "/path/to/your/docs"
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

### Architecture

```
┌──────────────────────────────────────────────────┐
│               MCP Server (stdio)                 │
│    Receives tool calls from AI assistants        │
├──────────────────────────────────────────────────┤
│            12 Specialized Tools                  │
│   query │ search │ suggest │ guide │ ...         │
├──────────────────────────────────────────────────┤
│         In-Memory Document Store                 │
│   ┌───────────┐ ┌────────────┐ ┌──────────┐      │
│   │ Documents │ │ Categories │ │  Search  │      │
│   │   Map     │ │   Index    │ │  Index   │      │
│   └───────────┘ └────────────┘ └──────────┘      │
├──────────────────────────────────────────────────┤
│   Scanner │ Metadata Extractor │ Search Engine   │
├──────────────────────────────────────────────────┤
│         Bundled Documentation (Markdown)         │
│  Foundation │ Components │ Patterns │ Enterprise │
└──────────────────────────────────────────────────┘
```

### Indexing Strategy

1. **Startup**: Server scans the docs folder recursively (< 1 second)
2. **Index**: Builds in-memory search index with TF-IDF scoring
3. **Serve**: All tool calls served from memory (instant, no disk I/O)
4. **Reindex**: The `reindex` tool can refresh the index on demand

### Documentation Coverage

| Module         | Content                                                              | Files |
| -------------- | -------------------------------------------------------------------- | ----- |
| **Foundation** | Setup, theming, styling, architecture, accessibility                 | 7     |
| **Components** | 47+ component docs with props, examples, best practices              | 50+   |
| **Patterns**   | Form patterns, layout patterns, navigation, modals, state management | 30+   |
| **Enterprise** | App shells, dashboards, admin UIs, data-heavy apps, WCAG compliance  | 15+   |

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
├── src/
│   ├── index.ts                # MCP server entry point
│   ├── config.ts               # Configuration resolver
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── indexer/
│   │   ├── scanner.ts          # Recursive docs directory scanner
│   │   ├── metadata-extractor.ts # Markdown metadata extraction
│   │   ├── document-store.ts   # In-memory document store
│   │   ├── search-engine.ts    # TF-IDF search engine
│   │   └── index-builder.ts    # Orchestrates indexing at startup
│   ├── tools/
│   │   ├── query-component.ts
│   │   ├── search-docs.ts
│   │   ├── list-by-category.ts
│   │   ├── get-foundation.ts
│   │   ├── get-pattern.ts
│   │   ├── get-enterprise.ts
│   │   ├── suggest-components.ts
│   │   ├── get-implementation-guide.ts
│   │   ├── get-component-examples.ts
│   │   ├── get-props-reference.ts
│   │   ├── list-all-docs.ts
│   │   └── reindex.ts
│   └── __tests__/
│       ├── indexer/
│       ├── tools/
│       └── e2e/
├── docs/
│   └── v9/                     # Bundled FluentUI v9 documentation
│       ├── 00-overview.md
│       ├── 01-foundation/
│       ├── 02-components/
│       ├── 03-patterns/
│       └── 04-enterprise/
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## Configuration

| Source                       | Priority                    | Example                       |
| ---------------------------- | --------------------------- | ----------------------------- |
| CLI argument                 | Highest                     | `fluentui-mcp v9`             |
| `FLUENTUI_VERSION` env var   | Medium                      | `FLUENTUI_VERSION=v9`         |
| `FLUENTUI_DOCS_PATH` env var | Highest (overrides version) | `FLUENTUI_DOCS_PATH=/my/docs` |
| Default                      | Lowest                      | Bundled v9 docs               |

---

## Adding Documentation for New Versions

To add documentation for a new FluentUI version:

1. Create a new folder: `docs/v10/` (or whatever version)
2. Follow the same folder structure as `docs/v9/`:
    ```
    docs/v10/
    ├── 00-overview.md
    ├── 01-foundation/
    ├── 02-components/
    ├── 03-patterns/
    └── 04-enterprise/
    ```
3. The server automatically discovers and indexes all markdown files
4. Use `fluentui-mcp v10` to serve the new version

---

## Troubleshooting

### Server Not Loading

1. Verify installation: `which fluentui-mcp`
2. Test manually: `fluentui-mcp` (should output to stderr: "FluentUI MCP Server running on stdio")
3. Check MCP settings JSON syntax
4. Restart VS Code / AI assistant

### Tool Errors

1. **"Documentation path not found"**: Check version exists in `docs/` folder
2. **"Component not found"**: Try `search_docs` with broader terms
3. **Search returning no results**: Try `reindex` to rebuild the search index

### Performance

-   First query: < 100ms (served from memory after startup indexing)
-   Search queries: < 50ms (pre-built TF-IDF index)
-   Startup indexing: < 1 second for ~100 markdown files

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
