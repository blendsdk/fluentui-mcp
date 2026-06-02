/**
 * Integration tests for the server core: schema → tools → MCP dispatch.
 *
 * Exercises the reusable server pieces from `src/server.ts` end-to-end:
 *
 * - {@link createServerState} loads the on-disk enhanced schema fixture and
 *   builds a working store + search index.
 * - {@link TOOL_DEFINITIONS} exposes all 12 tools with valid JSON-Schema.
 * - {@link dispatchToolCall} routes every tool name to its implementation,
 *   matching the MCP `CallTool` request shape, and `reindex` swaps live state.
 *
 * @module __tests__/integration/server-pipeline
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { join } from 'path';
import {
  TOOL_DEFINITIONS,
  createServerState,
  dispatchToolCall,
} from '../../server.js';
import type { ServerState } from '../../server.js';

/** Absolute path to the on-disk enhanced test schema fixture. */
const ENHANCED_SCHEMA_PATH = join(
  process.cwd(),
  'src',
  '__tests__',
  'fixtures',
  'test-schema-enhanced.json',
);

let state: ServerState;
let validationErrorCount: number;

beforeAll(() => {
  const created = createServerState(ENHANCED_SCHEMA_PATH);
  state = created.state;
  validationErrorCount = created.validationErrorCount;
});

// ============================================================================
// createServerState
// ============================================================================

describe('createServerState', () => {
  it('loads the schema and builds a populated store', () => {
    expect(state.store.getAllComponents().length).toBe(3);
    expect(state.schemaPath).toBe(ENHANCED_SCHEMA_PATH);
  });

  it('builds a working search index', () => {
    expect(state.searchEngine.vocabularySize).toBeGreaterThan(0);
  });

  it('reports no validation errors for the valid fixture', () => {
    expect(validationErrorCount).toBe(0);
  });
});

// ============================================================================
// TOOL_DEFINITIONS
// ============================================================================

describe('TOOL_DEFINITIONS', () => {
  it('defines exactly the 12 expected tools', () => {
    expect(TOOL_DEFINITIONS.length).toBe(12);
    const names = TOOL_DEFINITIONS.map((t) => t.name);
    expect(names).toEqual([
      'query_component',
      'search_docs',
      'list_by_category',
      'get_foundation',
      'get_pattern',
      'get_enterprise',
      'get_component_examples',
      'get_props_reference',
      'suggest_components',
      'get_implementation_guide',
      'list_all_docs',
      'reindex',
    ]);
  });

  it('gives every tool a description and an object input schema', () => {
    for (const tool of TOOL_DEFINITIONS) {
      expect(tool.description.length).toBeGreaterThan(10);
      expect(tool.inputSchema.type).toBe('object');
      expect(tool.inputSchema.properties).toBeDefined();
    }
  });
});

// ============================================================================
// dispatchToolCall — every tool routes correctly
// ============================================================================

describe('dispatchToolCall', () => {
  it('routes query_component', async () => {
    const result = await dispatchToolCall('query_component', { componentName: 'Button' }, state);
    expect(result).toContain('# Button');
  });

  it('routes search_docs', async () => {
    const result = await dispatchToolCall('search_docs', { query: 'button' }, state);
    expect(result).toContain('Search Results');
  });

  it('routes list_by_category', async () => {
    const result = await dispatchToolCall('list_by_category', { category: 'buttons' }, state);
    expect(result).toContain('Button');
  });

  it('routes get_foundation', async () => {
    const result = await dispatchToolCall('get_foundation', { topic: 'getting-started' }, state);
    expect(result).toContain('Getting Started');
  });

  it('routes get_pattern', async () => {
    const result = await dispatchToolCall('get_pattern', { patternCategory: 'forms' }, state);
    expect(result.toLowerCase()).toContain('form');
  });

  it('routes get_enterprise', async () => {
    const result = await dispatchToolCall('get_enterprise', { topic: 'app-shell' }, state);
    expect(result.toLowerCase()).toContain('shell');
  });

  it('routes get_component_examples', async () => {
    const result = await dispatchToolCall('get_component_examples', { componentName: 'Input' }, state);
    expect(result).toContain('Input');
  });

  it('routes get_props_reference', async () => {
    const result = await dispatchToolCall('get_props_reference', { componentName: 'Input' }, state);
    expect(result.toLowerCase()).toContain('prop');
  });

  it('routes suggest_components', async () => {
    const result = await dispatchToolCall(
      'suggest_components',
      { uiDescription: 'a form with an input field' },
      state,
    );
    expect(result).toContain('Suggested Components');
  });

  it('routes get_implementation_guide', async () => {
    const result = await dispatchToolCall(
      'get_implementation_guide',
      { goal: 'build a dialog with input fields' },
      state,
    );
    expect(result.length).toBeGreaterThan(200);
  });

  it('routes list_all_docs', async () => {
    const result = await dispatchToolCall('list_all_docs', {}, state);
    expect(result).toContain('Documentation Index');
  });

  it('routes reindex and swaps live state', async () => {
    const result = await dispatchToolCall('reindex', {}, state);
    expect(result).toContain('Reindex Complete');

    // State is still usable after reindex.
    const query = await dispatchToolCall('query_component', { componentName: 'Dialog' }, state);
    expect(query).toContain('# Dialog');
  });

  it('throws on an unknown tool name', async () => {
    await expect(
      dispatchToolCall('does_not_exist', {}, state),
    ).rejects.toThrow('Unknown tool');
  });
});

// ============================================================================
// MCP CallTool request shape compatibility
// ============================================================================

describe('MCP request-shape compatibility', () => {
  it('handles an MCP-style CallTool payload (name + arguments)', async () => {
    // Mirrors how the CallToolRequest handler invokes the dispatcher.
    const request = {
      params: {
        name: 'query_component',
        arguments: { componentName: 'Button' },
      },
    };
    const result = await dispatchToolCall(
      request.params.name,
      request.params.arguments ?? {},
      state,
    );
    expect(result).toContain('# Button');
  });

  it('tolerates a missing arguments object', async () => {
    const result = await dispatchToolCall('list_all_docs', {}, state);
    expect(result.length).toBeGreaterThan(0);
  });
});
