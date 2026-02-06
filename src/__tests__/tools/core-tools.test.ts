/**
 * Tests for core tools: query_component, search_docs, list_by_category,
 * get_foundation, get_pattern, get_enterprise.
 *
 * Uses the real docs/v9/ index for integration-level validation.
 *
 * @module __tests__/tools/core-tools
 */

import { describe, it, expect, beforeAll } from 'vitest';
import type { DocumentStore } from '../../indexer/document-store.js';
import type { SearchEngine } from '../../indexer/search-engine.js';
import { getTestIndex } from './tools-setup.js';

import { queryComponent } from '../../tools/query-component.js';
import { searchDocs } from '../../tools/search-docs.js';
import { listByCategory } from '../../tools/list-by-category.js';
import { getFoundation } from '../../tools/get-foundation.js';
import { getPattern } from '../../tools/get-pattern.js';
import { getEnterprise } from '../../tools/get-enterprise.js';

let store: DocumentStore;
let searchEngine: SearchEngine;

beforeAll(async () => {
  const index = await getTestIndex();
  store = index.store;
  searchEngine = index.searchEngine;
});

// ============================================================================
// queryComponent
// ============================================================================

describe('queryComponent', () => {
  it('should return full documentation for a known component', () => {
    const result = queryComponent(store, { componentName: 'Button' });
    expect(result).toContain('# Button');
    expect(result).toContain('**Package:**');
    expect(result).toContain('@fluentui/react-button');
  });

  it('should find components with partial/fuzzy names', () => {
    const result = queryComponent(store, { componentName: 'toggle' });
    expect(result).toContain('ToggleButton');
  });

  it('should be case-insensitive', () => {
    const result = queryComponent(store, { componentName: 'dialog' });
    expect(result).toContain('Dialog');
  });

  it('should return error for empty component name', () => {
    const result = queryComponent(store, { componentName: '' });
    expect(result).toContain('Error');
  });

  it('should return not-found message with suggestions for unknown component', () => {
    const result = queryComponent(store, { componentName: 'xxxxxxxxx' });
    expect(result).toContain('not found');
    expect(result).toContain('Available components');
  });
});

// ============================================================================
// searchDocs
// ============================================================================

describe('searchDocs', () => {
  it('should return ranked results for a valid query', () => {
    const result = searchDocs(searchEngine, { query: 'form validation' });
    expect(result).toContain('Search Results');
    expect(result).toContain('relevant');
  });

  it('should filter results by module when specified', () => {
    const result = searchDocs(searchEngine, { query: 'button', module: 'components' });
    expect(result).toContain('Search Results');
    // Should not contain foundation-only or pattern-only results
    expect(result).toContain('components');
  });

  it('should respect the limit parameter', () => {
    const result = searchDocs(searchEngine, { query: 'component', limit: 2 });
    // Count the "### N." result headers — should be at most 2
    const matches = result.match(/### \d+\./g);
    expect(matches).toBeTruthy();
    expect(matches!.length).toBeLessThanOrEqual(2);
  });

  it('should return error for empty query', () => {
    const result = searchDocs(searchEngine, { query: '' });
    expect(result).toContain('Error');
  });

  it('should return no results for a non-existent module filter', () => {
    // With dynamic module discovery, unrecognized modules aren't hard errors —
    // the search simply returns no results because no docs match that module.
    const result = searchDocs(searchEngine, { query: 'button', module: 'nonexistent' as any });
    expect(result).toContain('No results found');
    expect(result).toContain('list_all_docs');
  });

  it('should return no-results message for unmatched query', () => {
    const result = searchDocs(searchEngine, { query: 'xyznonexistent123' });
    expect(result).toContain('No results');
  });
});

// ============================================================================
// listByCategory
// ============================================================================

describe('listByCategory', () => {
  it('should list components in a valid category', () => {
    const result = listByCategory(store, { category: 'buttons' });
    expect(result).toContain('Buttons Components');
    expect(result).toContain('Button');
  });

  it('should return category overview when no category specified', () => {
    const result = listByCategory(store, { category: '' as any });
    expect(result).toContain('Available Component Categories');
  });

  it('should return error for invalid category', () => {
    const result = listByCategory(store, { category: 'invalid' as any });
    expect(result).toContain('Error');
    expect(result).toContain('Invalid category');
  });

  it('should include metadata indicators for components', () => {
    const result = listByCategory(store, { category: 'buttons' });
    // Button docs have code examples and props tables
    expect(result).toContain('examples');
  });
});

// ============================================================================
// getFoundation
// ============================================================================

describe('getFoundation', () => {
  it('should return overview when no topic specified', () => {
    const result = getFoundation(store, {});
    expect(result).toContain('Foundation Documentation');
    expect(result).toContain('Getting Started');
    expect(result).toContain('Theming');
  });

  it('should return specific topic documentation', () => {
    const result = getFoundation(store, { topic: 'theming' });
    expect(result).toContain('Theming');
    expect(result).toContain('foundation');
  });

  it('should resolve topic aliases', () => {
    const result = getFoundation(store, { topic: 'a11y' });
    expect(result).toContain('Accessibility');
  });

  it('should resolve alternate alias names', () => {
    const result = getFoundation(store, { topic: 'css' });
    expect(result).toContain('Griffel');
  });

  it('should return error for invalid topic', () => {
    const result = getFoundation(store, { topic: 'nonexistenttopic' });
    expect(result).toContain('Error');
    expect(result).toContain('not recognized');
  });
});

// ============================================================================
// getPattern
// ============================================================================

describe('getPattern', () => {
  it('should return pattern overview when given a valid category', () => {
    const result = getPattern(store, { patternCategory: 'forms' });
    // Should contain pattern listings for the forms category
    expect(result.toLowerCase()).toContain('form');
  });

  it('should return specific pattern when name provided', () => {
    const result = getPattern(store, { patternCategory: 'forms', patternName: 'validation' });
    expect(result.toLowerCase()).toContain('validation');
  });

  it('should return error for invalid pattern category', () => {
    const result = getPattern(store, { patternCategory: 'invalidcategory' });
    expect(result).toContain('Error');
  });
});

// ============================================================================
// getEnterprise
// ============================================================================

describe('getEnterprise', () => {
  it('should return enterprise documentation for a valid topic', () => {
    const result = getEnterprise(store, { topic: 'dashboard' });
    expect(result.toLowerCase()).toContain('dashboard');
  });

  it('should return enterprise documentation for admin topic', () => {
    const result = getEnterprise(store, { topic: 'admin' });
    expect(result.toLowerCase()).toContain('admin');
  });

  it('should return error/overview for invalid topic', () => {
    const result = getEnterprise(store, { topic: 'nonexistent' });
    // Should either list available topics or show an error
    expect(result.length).toBeGreaterThan(0);
  });
});
