#!/usr/bin/env node

/**
 * FluentUI MCP Server — Main entry point.
 *
 * This is the executable entry point for the MCP server. It:
 * 1. Resolves server configuration from CLI args / env vars / defaults
 * 2. Builds the in-memory document index from markdown files
 * 3. Registers all 12 MCP tools with the server
 * 4. Connects via stdio transport for MCP protocol communication
 *
 * Usage:
 *   fluentui-mcp v9          # Serve bundled v9 docs
 *   fluentui-mcp             # Default: v9 docs
 *   FLUENTUI_DOCS_PATH=/custom/path fluentui-mcp  # Custom docs path
 *
 * MCP config example:
 *   { "command": "fluentui-mcp", "args": ["v9"] }
 *
 * @module index
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { resolveConfig } from './config.js';
import { buildIndex } from './indexer/index-builder.js';
import type { DocumentStore } from './indexer/document-store.js';
import type { SearchEngine } from './indexer/search-engine.js';

// Tool imports — 6 core tools
import { queryComponent } from './tools/query-component.js';
import { searchDocs } from './tools/search-docs.js';
import { listByCategory } from './tools/list-by-category.js';
import { getFoundation } from './tools/get-foundation.js';
import { getPattern } from './tools/get-pattern.js';
import { getEnterprise } from './tools/get-enterprise.js';

// Tool imports — 4 intelligence tools
import { getComponentExamples } from './tools/get-component-examples.js';
import { getPropsReference } from './tools/get-props-reference.js';
import { suggestComponents } from './tools/suggest-components.js';
import { getImplementationGuide } from './tools/get-implementation-guide.js';

// Tool imports — 2 utility tools
import { listAllDocs } from './tools/list-all-docs.js';
import { reindex } from './tools/reindex.js';

// Type imports for tool argument casting
import type {
  QueryComponentArgs,
  SearchDocsArgs,
  ListByCategoryArgs,
  GetFoundationArgs,
  GetPatternArgs,
  GetEnterpriseArgs,
  GetComponentExamplesArgs,
  GetPropsReferenceArgs,
  SuggestComponentsArgs,
  GetImplementationGuideArgs,
} from './types/index.js';

// ============================================================================
// Tool Definitions
// ============================================================================

/**
 * All 12 MCP tool definitions.
 *
 * Each tool has a name, description (shown to the LLM), and an input schema
 * describing its parameters using JSON Schema format.
 */
const TOOL_DEFINITIONS = [
  // --- Core Tools (6) ---
  {
    name: 'query_component',
    description:
      'Get complete documentation for a specific FluentUI v9 component. ' +
      'Supports partial name matching (e.g., "button" will find "Button"). ' +
      'Returns full component documentation including props, examples, and usage patterns.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        componentName: {
          type: 'string',
          description: 'Name of the component (e.g., "Button", "Input", "Dialog")',
        },
      },
      required: ['componentName'],
    },
  },
  {
    name: 'search_docs',
    description:
      'Search across all FluentUI v9 documentation using full-text search. ' +
      'Returns ranked results with relevance scores and excerpts. ' +
      'Optionally filter by module (foundation, components, patterns, enterprise).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Search query (e.g., "form validation", "responsive layout")',
        },
        module: {
          type: 'string',
          enum: ['foundation', 'components', 'patterns', 'enterprise'],
          description: 'Optional: limit search to a specific documentation module',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default: 10, max: 50)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'list_by_category',
    description:
      'List all FluentUI v9 components in a specific category. ' +
      'Valid categories: buttons, forms, navigation, data-display, feedback, overlays, layout, utilities.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        category: {
          type: 'string',
          enum: ['buttons', 'forms', 'navigation', 'data-display', 'feedback', 'overlays', 'layout', 'utilities'],
          description: 'Component category (e.g., "buttons", "forms", "navigation")',
        },
      },
      required: ['category'],
    },
  },
  {
    name: 'get_foundation',
    description:
      'Get FluentUI v9 foundation documentation on core topics. ' +
      'Topics include: getting-started, fluent-provider, theming, styling-griffel, ' +
      'component-architecture, accessibility. Omit topic parameter to get the overview.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        topic: {
          type: 'string',
          enum: [
            'getting-started', 'fluent-provider', 'theming',
            'styling-griffel', 'component-architecture', 'accessibility',
          ],
          description: 'Foundation topic (optional). Omit for overview.',
        },
      },
    },
  },
  {
    name: 'get_pattern',
    description:
      'Get FluentUI v9 UI pattern documentation. Covers composition, data handling, ' +
      'forms, layout, modals, navigation, and state management patterns. ' +
      'Specify a category to list patterns, or also specify a pattern name for details.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        patternCategory: {
          type: 'string',
          enum: ['composition', 'data', 'forms', 'layout', 'modals', 'navigation', 'state'],
          description: 'Pattern category (e.g., "forms", "layout", "navigation")',
        },
        patternName: {
          type: 'string',
          description: 'Optional: specific pattern within the category (e.g., "validation", "responsive-design")',
        },
      },
      required: ['patternCategory'],
    },
  },
  {
    name: 'get_enterprise',
    description:
      'Get FluentUI v9 enterprise pattern documentation. Covers app-shell, dashboard, ' +
      'admin panels, data management, and accessibility compliance patterns.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        topic: {
          type: 'string',
          description:
            'Enterprise topic (e.g., "app-shell", "dashboard", "admin", "data", "accessibility")',
        },
      },
      required: ['topic'],
    },
  },

  // --- Intelligence Tools (4) ---
  {
    name: 'get_component_examples',
    description:
      'Extract all code examples from a FluentUI v9 component\'s documentation. ' +
      'Returns labeled, ready-to-use code snippets organized by section.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        componentName: {
          type: 'string',
          description: 'Component name to extract examples from (e.g., "Button", "Dialog")',
        },
      },
      required: ['componentName'],
    },
  },
  {
    name: 'get_props_reference',
    description:
      'Extract the props/slots reference table from a FluentUI v9 component\'s documentation. ' +
      'Returns structured prop definitions with types, defaults, and descriptions.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        componentName: {
          type: 'string',
          description: 'Component name to extract props from (e.g., "Button", "Input")',
        },
      },
      required: ['componentName'],
    },
  },
  {
    name: 'suggest_components',
    description:
      'Suggest FluentUI v9 components for a described UI scenario. ' +
      'Describe what you want to build and get ranked component suggestions with relevance scores.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        uiDescription: {
          type: 'string',
          description: 'Description of the UI you want to build (e.g., "a user profile card with avatar and actions")',
        },
      },
      required: ['uiDescription'],
    },
  },
  {
    name: 'get_implementation_guide',
    description:
      'Generate a step-by-step implementation guide for a FluentUI v9 UI goal. ' +
      'Includes component suggestions, imports, patterns, styling tips, and accessibility checklist.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        goal: {
          type: 'string',
          description: 'Description of the UI goal (e.g., "build a settings page with form validation")',
        },
      },
      required: ['goal'],
    },
  },

  // --- Utility Tools (2) ---
  {
    name: 'list_all_docs',
    description:
      'List all indexed FluentUI v9 documentation entries, grouped by module and category. ' +
      'Useful for discovering what documentation is available.',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'reindex',
    description:
      'Rebuild the documentation index by re-scanning the docs directory. ' +
      'Use this if documentation files have been added or modified.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        force: {
          type: 'boolean',
          description: 'Force reindex even if no changes detected (default: true)',
        },
      },
    },
  },
];

// ============================================================================
// Tool Dispatcher
// ============================================================================

/**
 * Dispatch a tool call to the appropriate handler function.
 *
 * Routes the incoming MCP tool call to the correct tool implementation
 * based on the tool name. All tools return a text content response.
 *
 * @param toolName - The name of the tool being called
 * @param args - The tool arguments (varies per tool)
 * @param store - The document store
 * @param searchEngine - The search engine
 * @param docsPath - The docs directory path (needed for reindex)
 * @returns The tool result text
 * @throws Error if the tool name is unknown
 */
async function dispatchToolCall(
  toolName: string,
  args: Record<string, unknown>,
  store: DocumentStore,
  searchEngine: SearchEngine,
  docsPath: string
): Promise<string> {
  switch (toolName) {
    // Core tools
    case 'query_component':
      return queryComponent(store, args as unknown as QueryComponentArgs);

    case 'search_docs':
      return searchDocs(searchEngine, args as unknown as SearchDocsArgs);

    case 'list_by_category':
      return listByCategory(store, args as unknown as ListByCategoryArgs);

    case 'get_foundation':
      return getFoundation(store, args as unknown as GetFoundationArgs);

    case 'get_pattern':
      return getPattern(store, args as unknown as GetPatternArgs);

    case 'get_enterprise':
      return getEnterprise(store, args as unknown as GetEnterpriseArgs);

    // Intelligence tools
    case 'get_component_examples':
      return getComponentExamples(store, args as unknown as GetComponentExamplesArgs);

    case 'get_props_reference':
      return getPropsReference(store, args as unknown as GetPropsReferenceArgs);

    case 'suggest_components':
      return suggestComponents(store, searchEngine, args as unknown as SuggestComponentsArgs);

    case 'get_implementation_guide':
      return getImplementationGuide(store, searchEngine, args as unknown as GetImplementationGuideArgs);

    // Utility tools
    case 'list_all_docs':
      return listAllDocs(store);

    case 'reindex':
      return reindex(store, searchEngine, docsPath);

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}

// ============================================================================
// Server Bootstrap
// ============================================================================

/**
 * Main server startup function.
 *
 * Orchestrates the full server lifecycle:
 * 1. Resolve config from CLI/env/defaults
 * 2. Build the document index
 * 3. Create the MCP server with tool capabilities
 * 4. Register tool list and tool call handlers
 * 5. Connect via stdio transport
 */
async function main(): Promise<void> {
  // Step 1: Resolve configuration
  const config = resolveConfig();

  // Log startup info to stderr (stdout is reserved for MCP protocol)
  console.error(`[fluentui-mcp] Starting server: ${config.serverName} v${config.serverVersion}`);
  console.error(`[fluentui-mcp] Docs path: ${config.docsPath}`);

  // Step 2: Build the document index
  console.error('[fluentui-mcp] Building document index...');
  const { store, searchEngine, stats } = await buildIndex(config.docsPath);
  console.error(
    `[fluentui-mcp] Indexed ${stats.indexedFiles} docs in ${stats.durationMs}ms ` +
    `(${stats.failedFiles} failed)`
  );

  // Step 3: Create the MCP server
  const server = new Server(
    {
      name: config.serverName,
      version: config.serverVersion,
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Step 4: Register the ListTools handler — returns all tool definitions
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOL_DEFINITIONS };
  });

  // Step 5: Register the CallTool handler — dispatches to tool implementations
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: toolArgs } = request.params;

    try {
      const result = await dispatchToolCall(
        name,
        toolArgs ?? {},
        store,
        searchEngine,
        config.docsPath
      );

      return {
        content: [{ type: 'text' as const, text: result }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[fluentui-mcp] Tool error (${name}): ${message}`);

      return {
        content: [{ type: 'text' as const, text: `**Error:** ${message}` }],
        isError: true,
      };
    }
  });

  // Step 6: Connect via stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('[fluentui-mcp] Server connected via stdio. Ready for requests.');
}

// Run the server
main().catch((error) => {
  console.error('[fluentui-mcp] Fatal error:', error);
  process.exit(1);
});
