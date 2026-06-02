/**
 * Tests for core tools: query_component, search_docs, list_by_category,
 * get_foundation, get_pattern, get_enterprise.
 *
 * Uses the enhanced test schema (Button/buttons, Input/forms, Dialog/feedback)
 * via the shared schema-driven tools-setup.
 *
 * @module __tests__/tools/core-tools
 */

import { describe, it, expect, beforeAll } from 'vitest';
import type { SchemaStore } from '../../schema/schema-store.js';
import type { SearchEngine } from '../../search/search-engine.js';
import { getTestIndex } from './tools-setup.js';

import { queryComponent } from '../../tools/query-component.js';
import { searchDocs } from '../../tools/search-docs.js';
import { listByCategory } from '../../tools/list-by-category.js';
import { getFoundation } from '../../tools/get-foundation.js';
import { getPattern } from '../../tools/get-pattern.js';
import { getEnterprise } from '../../tools/get-enterprise.js';

let store: SchemaStore;
let searchEngine: SearchEngine;

beforeAll(() => {
  const index = getTestIndex();
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
    expect(result).toContain('**Package**');
    expect(result).toContain('@fluentui/react-button');
  });

  it('should find components with partial/fuzzy names', () => {
    const result = queryComponent(store, { componentName: 'dial' });
    expect(result).toContain('# Dialog');
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
    const result = searchDocs(searchEngine, { query: 'button action' });
    expect(result).toContain('Search Results');
    expect(result).toContain('relevant');
  });

  it('should filter results by module when specified', () => {
    const result = searchDocs(searchEngine, { query: 'button', module: 'components' });
    expect(result).toContain('Search Results');
    expect(result).toContain('components');
  });

  it('should respect the limit parameter', () => {
    const result = searchDocs(searchEngine, { query: 'button input dialog', limit: 2 });
    const matches = result.match(/### \d+\./g);
    expect(matches).toBeTruthy();
    expect(matches!.length).toBeLessThanOrEqual(2);
  });

  it('should return error for empty query', () => {
    const result = searchDocs(searchEngine, { query: '' });
    expect(result).toContain('Error');
  });

  it('should return no results for a non-existent module filter', () => {
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

  it('should include a component summary', () => {
    const result = listByCategory(store, { category: 'forms' });
    expect(result).toContain('Input');
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
  });

  it('should return specific topic documentation', () => {
    const result = getFoundation(store, { topic: 'getting-started' });
    expect(result).toContain('Getting Started');
    expect(result).toContain('foundation');
  });

  it('should resolve topic aliases', () => {
    const result = getFoundation(store, { topic: 'start' });
    expect(result).toContain('Getting Started');
  });

  it('should report when a recognized topic has no guide', () => {
    const result = getFoundation(store, { topic: 'theming' });
    expect(result).toContain('no guide was found');
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
  it('should return pattern listing when given a valid category', () => {
    const result = getPattern(store, { patternCategory: 'forms' });
    expect(result.toLowerCase()).toContain('form');
  });

  it('should return specific pattern when name provided', () => {
    const result = getPattern(store, { patternCategory: 'forms', patternName: 'login' });
    expect(result.toLowerCase()).toContain('login');
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
    const result = getEnterprise(store, { topic: 'app-shell' });
    expect(result.toLowerCase()).toContain('shell');
  });

  it('should resolve enterprise aliases', () => {
    const result = getEnterprise(store, { topic: 'shell' });
    expect(result.toLowerCase()).toContain('shell');
  });

  it('should return error/overview for invalid topic', () => {
    const result = getEnterprise(store, { topic: 'nonexistent' });
    expect(result.length).toBeGreaterThan(0);
  });
});
