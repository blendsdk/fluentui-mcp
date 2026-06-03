/**
 * Tests for intelligence tools: suggest_components, get_implementation_guide,
 * get_component_examples, get_props_reference.
 *
 * Uses the enhanced test schema via the shared schema-driven tools-setup.
 *
 * @module __tests__/tools/intelligence-tools
 */

import { describe, it, expect, beforeAll } from 'vitest';
import type { SchemaStore } from '../../schema/schema-store.js';
import type { SearchEngine } from '../../search/search-engine.js';
import { getTestIndex } from './tools-setup.js';

import { suggestComponents } from '../../tools/suggest-components.js';
import { getImplementationGuide } from '../../tools/get-implementation-guide.js';
import { getComponentExamples } from '../../tools/get-component-examples.js';
import { getPropsReference } from '../../tools/get-props-reference.js';

let store: SchemaStore;
let searchEngine: SearchEngine;

beforeAll(() => {
  const index = getTestIndex();
  store = index.store;
  searchEngine = index.searchEngine;
});

// ============================================================================
// suggestComponents
// ============================================================================

describe('suggestComponents', () => {
  it('should suggest relevant components for a form description', () => {
    const result = suggestComponents(store, searchEngine, {
      uiDescription: 'login form with email input and password field',
    });
    expect(result).toContain('Suggested Components');
    expect(result).toContain('Input');
  });

  it('should suggest dialog for modal-related descriptions', () => {
    const result = suggestComponents(store, searchEngine, {
      uiDescription: 'confirmation dialog with yes/no buttons',
    });
    expect(result).toContain('Dialog');
  });

  it('should return error for empty description', () => {
    const result = suggestComponents(store, searchEngine, {
      uiDescription: '',
    });
    expect(result).toContain('Error');
  });

  it('should return a response for unrelated descriptions', () => {
    const result = suggestComponents(store, searchEngine, {
      uiDescription: 'xyznonexistent feature that does not exist',
    });
    expect(result.length).toBeGreaterThan(0);
  });

  it('should include relevance indicators', () => {
    const result = suggestComponents(store, searchEngine, {
      uiDescription: 'button to submit a form',
    });
    expect(result).toMatch(/[🟢🟡⚪]/);
  });
});

// ============================================================================
// getImplementationGuide
// ============================================================================

describe('getImplementationGuide', () => {
  it('should return a guide for a valid UI goal', () => {
    const result = getImplementationGuide(store, searchEngine, {
      goal: 'build a form with an input and a submit button',
    });
    expect(result.length).toBeGreaterThan(100);
    expect(result.toLowerCase()).toContain('implementation');
  });

  it('should include relevant component references', () => {
    const result = getImplementationGuide(store, searchEngine, {
      goal: 'build a dialog with confirmation buttons',
    });
    expect(result.toLowerCase()).toContain('dialog');
  });

  it('should return error for empty goal', () => {
    const result = getImplementationGuide(store, searchEngine, {
      goal: '',
    });
    expect(result).toContain('Error');
  });
});

// ============================================================================
// getComponentExamples
// ============================================================================

describe('getComponentExamples', () => {
  it('should return code examples for a known component', () => {
    const result = getComponentExamples(store, { componentName: 'Button' });
    expect(result).toContain('Button');
    expect(result.length).toBeGreaterThan(50);
  });

  it('should return not-found for unknown component', () => {
    const result = getComponentExamples(store, { componentName: 'xxxxxxxxx' });
    expect(result).toContain('not found');
  });

  it('should return error for empty component name', () => {
    const result = getComponentExamples(store, { componentName: '' });
    expect(result).toContain('Error');
  });
});

// ============================================================================
// getPropsReference
// ============================================================================

describe('getPropsReference', () => {
  it('should return props reference for a known component', () => {
    const result = getPropsReference(store, { componentName: 'Button' });
    expect(result).toContain('Button');
    expect(result.toLowerCase()).toContain('prop');
  });

  it('should include prop details like types and descriptions', () => {
    const result = getPropsReference(store, { componentName: 'Button' });
    expect(result).toContain('appearance');
    expect(result).toContain('disabled');
  });

  it('should return not-found for unknown component', () => {
    const result = getPropsReference(store, { componentName: 'xxxxxxxxx' });
    expect(result).toContain('not found');
  });

  it('should return error for empty component name', () => {
    const result = getPropsReference(store, { componentName: '' });
    expect(result).toContain('Error');
  });
});
