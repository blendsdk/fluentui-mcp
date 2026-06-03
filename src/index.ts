#!/usr/bin/env node

/**
 * FluentUI MCP Server — Main entry point.
 *
 * This is the executable entry point for the MCP server. It:
 * 1. Resolves server configuration from CLI args / env vars / defaults
 * 2. Loads the enhanced JSON schema and builds the in-memory store + search index
 * 3. Registers all 12 MCP tools with the server
 * 4. Connects via stdio transport for MCP protocol communication
 *
 * The reusable server core (tool definitions, state factory, dispatcher) lives
 * in {@link module:server}; this module only handles process/transport wiring.
 *
 * Usage:
 *   fluentui-mcp v9          # Serve bundled v9 schema
 *   fluentui-mcp             # Default: v9 schema
 *   FLUENTUI_SCHEMA_PATH=/custom/path fluentui-mcp  # Custom schema path
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
import {
  TOOL_DEFINITIONS,
  createServerState,
  dispatchToolCall,
} from './server.js';

// ============================================================================
// Server Bootstrap
// ============================================================================

/**
 * Main server startup function.
 *
 * Orchestrates the full server lifecycle:
 * 1. Resolve config from CLI/env/defaults
 * 2. Load the schema and build the store + search index
 * 3. Create the MCP server with tool capabilities
 * 4. Register tool list and tool call handlers
 * 5. Connect via stdio transport
 */
async function main(): Promise<void> {
  // Step 1: Resolve configuration
  const config = resolveConfig();

  // Log startup info to stderr (stdout is reserved for MCP protocol)
  console.error(`[fluentui-mcp] Starting server: ${config.serverName} v${config.serverVersion}`);
  console.error(`[fluentui-mcp] Schema path: ${config.schemaPath}`);

  // Step 2: Load the schema and build the in-memory store + search index
  console.error('[fluentui-mcp] Loading schema...');
  const { state, validationErrorCount } = createServerState(config.schemaPath);
  if (validationErrorCount > 0) {
    console.error(`[fluentui-mcp] Schema validation findings: ${validationErrorCount}`);
  }

  const stats = state.store.getStats();
  console.error(
    `[fluentui-mcp] Loaded ${stats.totalComponents} components, ` +
    `${stats.totalUtilities} utilities`
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
      const result = await dispatchToolCall(name, toolArgs ?? {}, state);

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
