/**
 * Tests for the list/overview markdown formatters.
 *
 * @module tests/formatters/list-formatter
 */

import { describe, it, expect } from 'vitest';
import {
  formatComponentList,
  formatCategoryOverview,
  formatModuleList,
  formatAllDocs,
} from '../../formatters/list-formatter.js';
import {
  createComponentEntry,
  createUtilityEntry,
  createGuideEntry,
  createPatternEntry,
} from '../fixtures/helpers.js';

describe('formatComponentList', () => {
  it('renders a bullet list of component summaries', () => {
    const components = [
      createComponentEntry('Button'),
      createComponentEntry('Input', { category: 'forms' }),
    ];
    const output = formatComponentList(components);
    expect(output).toContain('- **Button**');
    expect(output).toContain('- **Input**');
  });

  it('sorts components alphabetically', () => {
    const components = [
      createComponentEntry('Zebra'),
      createComponentEntry('Alpha'),
    ];
    const output = formatComponentList(components);
    expect(output.indexOf('Alpha')).toBeLessThan(output.indexOf('Zebra'));
  });

  it('renders an optional title heading', () => {
    const output = formatComponentList([createComponentEntry('Button')], 'Buttons');
    expect(output).toContain('## Buttons');
  });

  it('renders an empty-state notice for no components', () => {
    expect(formatComponentList([])).toContain('_No components found._');
  });
});

describe('formatCategoryOverview', () => {
  it('renders a table from a Map of category counts', () => {
    const map = new Map<string, number>([
      ['buttons', 5],
      ['forms', 12],
    ]);
    const output = formatCategoryOverview(map);
    expect(output).toContain('| Category | Components |');
    expect(output).toContain('| buttons | 5 |');
    expect(output).toContain('| forms | 12 |');
  });

  it('renders a table from a plain record', () => {
    const output = formatCategoryOverview({ feedback: 3 });
    expect(output).toContain('| feedback | 3 |');
  });

  it('sorts categories alphabetically', () => {
    const output = formatCategoryOverview({ forms: 1, buttons: 1 });
    expect(output.indexOf('buttons')).toBeLessThan(output.indexOf('forms'));
  });

  it('renders an empty-state notice for no categories', () => {
    expect(formatCategoryOverview({})).toContain('_No categories found._');
  });
});

describe('formatModuleList', () => {
  it('renders a bullet list of modules', () => {
    const output = formatModuleList(['components', 'utilities']);
    expect(output).toContain('- components');
    expect(output).toContain('- utilities');
  });

  it('renders an empty-state notice for no modules', () => {
    expect(formatModuleList([])).toContain('_No modules available._');
  });
});

describe('formatAllDocs', () => {
  it('renders sections for each non-empty collection', () => {
    const output = formatAllDocs({
      components: [createComponentEntry('Button')],
      utilities: [createUtilityEntry('Positioning')],
      foundation: [createGuideEntry('getting-started', { title: 'Getting Started' })],
      patterns: [createPatternEntry('login-form', { title: 'Login Form' })],
      enterprise: [createGuideEntry('app-shell', { title: 'App Shell' })],
      quickReference: [createGuideEntry('cheatsheet', { title: 'Cheatsheet' })],
    });
    expect(output).toContain('## Components');
    expect(output).toContain('## Utilities');
    expect(output).toContain('## Foundation');
    expect(output).toContain('## Enterprise');
    expect(output).toContain('## Quick Reference');
    expect(output).toContain('## Patterns');
  });

  it('omits empty sections', () => {
    const output = formatAllDocs({
      components: [createComponentEntry('Button')],
      utilities: [],
      foundation: [],
      patterns: [],
      enterprise: [],
      quickReference: [],
    });
    expect(output).toContain('## Components');
    expect(output).not.toContain('## Utilities');
    expect(output).not.toContain('## Patterns');
  });

  it('renders an empty-state notice when everything is empty', () => {
    const output = formatAllDocs({
      components: [],
      utilities: [],
      foundation: [],
      patterns: [],
      enterprise: [],
      quickReference: [],
    });
    expect(output).toContain('_No documentation available._');
  });
});
