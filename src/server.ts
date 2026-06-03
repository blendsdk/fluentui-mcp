/**
 * FluentUI MCP Server — reusable server core.
 *
 * Houses the pieces of the server that are independent of the stdio
 * transport and process lifecycle so they can be unit/integration tested:
 *
 * - {@link TOOL_DEFINITIONS}: the JSON-Schema tool manifest sent to clients.
 * - {@link createServerState}: load a schema and build the store + search index.
 * - {@link dispatchToolCall}: route a tool call to its implementation.
 *
 * The executable entry point ({@link module:index}) imports these and wires
 * them to a {@link Server} over stdio.
 *
 * @module server
 */

import { loadSchema } from './schema/schema-loader.js';
import { SchemaStore } from './schema/schema-store.js';
import { buildSearchIndex } from './search/search-index.js';

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
import type { ServerState } from './tools/reindex.js';

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

export type { ServerState };

// ============================================================================
// Tool Definitions
// ============================================================================

/**
 * All 12 MCP tool definitions.
 *
 * Each tool has a name, description (shown to the LLM), and an input schema
 * describing its parameters using JSON Schema format.
 */
export const TOOL_DEFINITIONS = [
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
      'Rebuild the documentation index by reloading the schema from disk. ' +
      'Use this if the schema file has been regenerated.',
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
// Server State
// ============================================================================

/**
 * Load the schema from disk and build a fresh {@link ServerState}.
 *
 * Resolves and loads the schema, constructs a {@link SchemaStore}, and builds
 * the search index. Validation findings are returned alongside the state so the
 * caller can decide whether/how to report them.
 *
 * @param schemaPath - Optional explicit schema path (overrides resolution).
 * @returns The server state plus the number of validation findings.
 */
export function createServerState(schemaPath?: string): {
  state: ServerState;
  validationErrorCount: number;
} {
  const { schema, validationErrors, resolvedPath } = loadSchema(
    schemaPath ? { path: schemaPath } : {},
  );

  const store = new SchemaStore(schema);
  const searchEngine = buildSearchIndex(store);

  return {
    state: { store, searchEngine, schemaPath: resolvedPath },
    validationErrorCount: validationErrors.length,
  };
}

// ============================================================================
// Tool Dispatcher
// ============================================================================

/**
 * Dispatch a tool call to the appropriate handler function.
 *
 * Routes the incoming MCP tool call to the correct tool implementation based on
 * the tool name. Reads the live store/engine from the shared {@link ServerState}
 * so that a `reindex` call (which swaps them) is immediately visible.
 *
 * @param toolName - The name of the tool being called
 * @param args - The tool arguments (varies per tool)
 * @param state - The shared, mutable server state (store + search engine)
 * @returns The tool result text
 * @throws Error if the tool name is unknown
 */
export async function dispatchToolCall(
  toolName: string,
  args: Record<string, unknown>,
  state: ServerState,
): Promise<string> {
  const { store, searchEngine } = state;

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
      return reindex(state);

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
