/**
 * End-to-end tests for the full schema-driven FluentUI MCP server pipeline.
 *
 * Tests the complete workflow: load schema → build store + search index →
 * run tools. Verifies that a fresh server startup produces a working system
 * where all 12 tools can be invoked successfully against the enhanced test
 * schema (Button/buttons, Input/forms, Dialog/feedback).
 *
 * @module __tests__/e2e/full-pipeline
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { join } from 'path';
import { SchemaStore } from '../../schema/schema-store.js';
import { buildSearchIndex } from '../../search/search-index.js';
import type { SearchEngine } from '../../search/search-engine.js';
import type { ServerState } from '../../tools/reindex.js';
import { createEnhancedTestSchema } from '../fixtures/helpers.js';

// Import all 12 tools
import { queryComponent } from '../../tools/query-component.js';
import { searchDocs } from '../../tools/search-docs.js';
import { listByCategory } from '../../tools/list-by-category.js';
import { getFoundation } from '../../tools/get-foundation.js';
import { getPattern } from '../../tools/get-pattern.js';
import { getEnterprise } from '../../tools/get-enterprise.js';
import { suggestComponents } from '../../tools/suggest-components.js';
import { getImplementationGuide } from '../../tools/get-implementation-guide.js';
import { getComponentExamples } from '../../tools/get-component-examples.js';
import { getPropsReference } from '../../tools/get-props-reference.js';
import { listAllDocs } from '../../tools/list-all-docs.js';
import { reindex } from '../../tools/reindex.js';

/** Absolute path to the on-disk enhanced test schema fixture. */
const ENHANCED_SCHEMA_PATH = join(
  process.cwd(),
  'src',
  '__tests__',
  'fixtures',
  'test-schema-enhanced.json',
);

let store: SchemaStore;
let searchEngine: SearchEngine;

beforeAll(() => {
  // Fresh build — simulates server startup from schema.
  store = new SchemaStore(createEnhancedTestSchema());
  searchEngine = buildSearchIndex(store);

  expect(store.getAllComponents().length).toBe(3);
});

// ============================================================================
// E2E: All 12 tools return non-empty, non-error responses
// ============================================================================

describe('E2E: full pipeline — all tools work after fresh build', () => {
  it('1. query_component returns full documentation', () => {
    const result = queryComponent(store, { componentName: 'Dialog' });
    expect(result).toContain('# Dialog');
    expect(result).toContain('**Package**');
  });

  it('2. search_docs returns ranked results', () => {
    const result = searchDocs(searchEngine, { query: 'button action interactive' });
    expect(result).toContain('Search Results');
    expect(result).toContain('relevant');
  });

  it('3. list_by_category lists components', () => {
    const result = listByCategory(store, { category: 'forms' });
    expect(result).toContain('Forms Components');
    expect(result).toContain('Input');
  });

  it('4. get_foundation returns topic documentation', () => {
    const result = getFoundation(store, { topic: 'getting-started' });
    expect(result).toContain('Getting Started');
    expect(result).toContain('foundation');
  });

  it('5. get_pattern returns pattern docs', () => {
    const result = getPattern(store, { patternCategory: 'forms' });
    expect(result.toLowerCase()).toContain('form');
  });

  it('6. get_enterprise returns enterprise docs', () => {
    const result = getEnterprise(store, { topic: 'app-shell' });
    expect(result.toLowerCase()).toContain('shell');
  });

  it('7. suggest_components returns suggestions', () => {
    const result = suggestComponents(store, searchEngine, {
      uiDescription: 'a form with an input field',
    });
    expect(result).toContain('Suggested Components');
    expect(result.toLowerCase()).toContain('input');
  });

  it('8. get_implementation_guide returns a guide', () => {
    const result = getImplementationGuide(store, searchEngine, {
      goal: 'build a dialog with input fields and buttons',
    });
    expect(result.length).toBeGreaterThan(200);
    expect(result.toLowerCase()).toContain('dialog');
  });

  it('9. get_component_examples returns code examples', () => {
    const result = getComponentExamples(store, { componentName: 'Input' });
    expect(result).toContain('Input');
    expect(result.length).toBeGreaterThan(50);
  });

  it('10. get_props_reference returns props table', () => {
    const result = getPropsReference(store, { componentName: 'Input' });
    expect(result).toContain('Input');
    expect(result.toLowerCase()).toContain('prop');
  });

  it('11. list_all_docs returns document inventory', () => {
    const result = listAllDocs(store);
    expect(result).toContain('Documentation Index');
    expect(result).toContain('Button');
    expect(result).toContain('Dialog');
  });

  it('12. reindex rebuilds from the schema file', async () => {
    const state: ServerState = {
      store,
      searchEngine,
      schemaPath: ENHANCED_SCHEMA_PATH,
    };
    const result = await reindex(state);
    expect(result).toContain('Reindex Complete');

    const query = queryComponent(state.store, { componentName: 'Button' });
    expect(query).toContain('# Button');
  });
});

// ============================================================================
// E2E: Complex multi-tool workflow
// ============================================================================

describe('E2E: multi-tool workflow', () => {
  it('should support a realistic developer workflow', () => {
    // Step 1: Developer asks for suggestions.
    const suggestions = suggestComponents(store, searchEngine, {
      uiDescription: 'login form with email, password, and remember me',
    });
    expect(suggestions).toContain('Suggested Components');

    // Step 2: Developer looks up a specific component from suggestions.
    const inputDocs = queryComponent(store, { componentName: 'Input' });
    expect(inputDocs).toContain('# Input');

    // Step 3: Developer gets the props reference.
    const props = getPropsReference(store, { componentName: 'Input' });
    expect(props.toLowerCase()).toContain('prop');

    // Step 4: Developer looks at form patterns.
    const patterns = getPattern(store, { patternCategory: 'forms', patternName: 'login' });
    expect(patterns.toLowerCase()).toContain('login');

    // Step 5: Developer gets an implementation guide.
    const guide = getImplementationGuide(store, searchEngine, {
      goal: 'login form with input fields and a submit button',
    });
    expect(guide.length).toBeGreaterThan(200);
  });
});
