/**
 * End-to-end tests for the full FluentUI MCP server pipeline.
 *
 * Tests the complete workflow: scan docs → build index → run tools.
 * Verifies that a fresh server startup produces a working system
 * where all 12 tools can be invoked successfully.
 *
 * @module __tests__/e2e/full-pipeline
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { join } from 'path';
import { buildIndex } from '../../indexer/index-builder.js';
import type { DocumentStore } from '../../indexer/document-store.js';
import type { SearchEngine } from '../../indexer/search-engine.js';

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

/** Absolute path to the bundled v9 docs directory */
const DOCS_V9_PATH = join(process.cwd(), 'docs', 'v9');

let store: DocumentStore;
let searchEngine: SearchEngine;

beforeAll(async () => {
  // Fresh index build — simulates server startup
  const result = await buildIndex(DOCS_V9_PATH);
  store = result.store;
  searchEngine = result.searchEngine;

  // Verify the index built successfully
  expect(result.stats.indexedFiles).toBeGreaterThan(100);
  expect(result.stats.failedFiles).toBe(0);
});

// ============================================================================
// E2E: All 12 tools return non-empty, non-error responses
// ============================================================================

describe('E2E: full pipeline — all tools work after fresh index', () => {
  it('1. query_component returns full documentation', () => {
    const result = queryComponent(store, { componentName: 'Dialog' });
    expect(result).toContain('# Dialog');
    expect(result).toContain('**Package:**');
    expect(result).not.toContain('Error');
  });

  it('2. search_docs returns ranked results', () => {
    const result = searchDocs(searchEngine, { query: 'theming tokens design' });
    expect(result).toContain('Search Results');
    expect(result).toContain('relevant');
  });

  it('3. list_by_category lists components', () => {
    const result = listByCategory(store, { category: 'forms' });
    expect(result).toContain('Forms Components');
    expect(result).toContain('Input');
    expect(result).toContain('Checkbox');
  });

  it('4. get_foundation returns topic documentation', () => {
    const result = getFoundation(store, { topic: 'getting-started' });
    expect(result).toContain('Getting Started');
    expect(result).toContain('foundation');
  });

  it('5. get_pattern returns pattern docs', () => {
    const result = getPattern(store, { patternCategory: 'navigation' });
    expect(result.toLowerCase()).toContain('navigation');
  });

  it('6. get_enterprise returns enterprise docs', () => {
    const result = getEnterprise(store, { topic: 'accessibility' });
    expect(result.toLowerCase()).toContain('accessibility');
  });

  it('7. suggest_components returns suggestions', () => {
    const result = suggestComponents(store, searchEngine, {
      uiDescription: 'user profile card with avatar and name',
    });
    expect(result).toContain('Suggested Components');
    expect(result.toLowerCase()).toContain('avatar');
  });

  it('8. get_implementation_guide returns a guide', () => {
    const result = getImplementationGuide(store, searchEngine, {
      goal: 'build a data table with sorting and filtering',
    });
    expect(result.length).toBeGreaterThan(200);
    expect(result.toLowerCase()).toContain('table');
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

  it('12. reindex rebuilds the index', async () => {
    const result = await reindex(store, searchEngine, DOCS_V9_PATH);
    expect(result).toContain('Reindex Complete');
    // Tools should still work after reindex
    const query = queryComponent(store, { componentName: 'Button' });
    expect(query).toContain('# Button');
  });
});

// ============================================================================
// E2E: Complex multi-tool workflow
// ============================================================================

describe('E2E: multi-tool workflow', () => {
  it('should support a realistic developer workflow', () => {
    // Step 1: Developer asks for suggestions
    const suggestions = suggestComponents(store, searchEngine, {
      uiDescription: 'login form with email, password, and remember me',
    });
    expect(suggestions).toContain('Suggested Components');

    // Step 2: Developer looks up a specific component from suggestions
    const inputDocs = queryComponent(store, { componentName: 'Input' });
    expect(inputDocs).toContain('# Input');

    // Step 3: Developer gets the props reference
    const props = getPropsReference(store, { componentName: 'Input' });
    expect(props.toLowerCase()).toContain('prop');

    // Step 4: Developer looks at form patterns
    const patterns = getPattern(store, { patternCategory: 'forms', patternName: 'validation' });
    expect(patterns.toLowerCase()).toContain('validation');

    // Step 5: Developer gets an implementation guide
    const guide = getImplementationGuide(store, searchEngine, {
      goal: 'login form with validation and error handling',
    });
    expect(guide.length).toBeGreaterThan(200);
  });
});
