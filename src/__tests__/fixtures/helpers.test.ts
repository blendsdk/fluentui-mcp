/**
 * Tests for fixture helper functions.
 *
 * Verifies that all factory functions produce valid schema objects
 * with correct defaults and that overrides work properly.
 *
 * @module tests/fixtures/helpers
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  createSourceInfo,
  createSchemaStats,
  createPropEntry,
  createSlotEntry,
  createStoryEntry,
  createKeyboardEntry,
  createPatternExample,
  createParameterEntry,
  createGuideCodeExample,
  createComponentEnhanced,
  createUtilityExport,
  createUtilityEnhanced,
  createUtilityEntry,
  createGuideEntry,
  createPatternEntryExample,
  createPatternEntry,
  createComponentEntry,
  createFluentUISchema,
  createMinimalTestSchema,
  createEnhancedTestSchema,
} from './helpers.js';

// ============================================================================
// Atomic factory tests
// ============================================================================

describe('createSourceInfo', () => {
  it('should create a valid SourceInfo with defaults', () => {
    const source = createSourceInfo();
    expect(source.repo).toContain('github.com');
    expect(source.ref).toBe('main');
    expect(source.commit).toBeTruthy();
    expect(source.scrapedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('should allow overriding fields', () => {
    const source = createSourceInfo({ ref: 'v9.0.0', commit: 'custom-hash' });
    expect(source.ref).toBe('v9.0.0');
    expect(source.commit).toBe('custom-hash');
    // Non-overridden fields keep defaults
    expect(source.repo).toContain('github.com');
  });
});

describe('createSchemaStats', () => {
  it('should create stats with zero defaults', () => {
    const stats = createSchemaStats();
    expect(stats.totalComponents).toBe(0);
    expect(stats.totalUtilities).toBe(0);
    expect(stats.totalContrib).toBe(0);
    expect(stats.totalPreview).toBe(0);
    expect(stats.totalStories).toBe(0);
    expect(stats.totalProps).toBe(0);
    expect(stats.categoryCounts).toEqual({});
  });

  it('should allow overriding individual counts', () => {
    const stats = createSchemaStats({ totalComponents: 42, totalStories: 100 });
    expect(stats.totalComponents).toBe(42);
    expect(stats.totalStories).toBe(100);
    expect(stats.totalUtilities).toBe(0); // non-overridden
  });
});

describe('createPropEntry', () => {
  it('should create a prop with the given name', () => {
    const prop = createPropEntry('disabled');
    expect(prop.name).toBe('disabled');
    expect(prop.type).toBe('string');
    expect(prop.required).toBe(false);
    expect(prop.deprecated).toBe(false);
    expect(prop.inherited).toBe(false);
    expect(prop.description).toContain('disabled');
  });

  it('should use default name when none provided', () => {
    const prop = createPropEntry();
    expect(prop.name).toBe('appearance');
  });

  it('should allow overriding type and required', () => {
    const prop = createPropEntry('size', { type: "'small' | 'large'", required: true });
    expect(prop.name).toBe('size');
    expect(prop.type).toBe("'small' | 'large'");
    expect(prop.required).toBe(true);
  });
});

describe('createSlotEntry', () => {
  it('should create a root slot as required by default', () => {
    const slot = createSlotEntry('root');
    expect(slot.name).toBe('root');
    expect(slot.required).toBe(true);
    expect(slot.elementType).toBe('div');
  });

  it('should create a non-root slot as not required', () => {
    const slot = createSlotEntry('icon');
    expect(slot.name).toBe('icon');
    expect(slot.required).toBe(false);
  });

  it('should allow overriding elementType', () => {
    const slot = createSlotEntry('root', { elementType: 'button' });
    expect(slot.elementType).toBe('button');
  });
});

describe('createStoryEntry', () => {
  it('should create a story with the given name', () => {
    const story = createStoryEntry('Appearance');
    expect(story.name).toBe('Appearance');
    expect(story.description).toContain('Appearance');
    expect(story.code).toContain('Appearance');
    expect(story.imports).toHaveLength(1);
  });

  it('should default to "Default" name', () => {
    const story = createStoryEntry();
    expect(story.name).toBe('Default');
  });
});

describe('createKeyboardEntry', () => {
  it('should create with defaults', () => {
    const entry = createKeyboardEntry();
    expect(entry.key).toBe('Enter');
    expect(entry.action).toContain('Activates');
  });

  it('should accept custom key and action', () => {
    const entry = createKeyboardEntry('Escape', 'Closes the dialog');
    expect(entry.key).toBe('Escape');
    expect(entry.action).toBe('Closes the dialog');
  });
});

describe('createPatternExample', () => {
  it('should create a basic pattern example', () => {
    const example = createPatternExample();
    expect(example.name).toBe('Basic Usage');
    expect(example.code).toBeTruthy();
  });

  it('should allow overriding fields', () => {
    const example = createPatternExample({ name: 'Custom', code: '<Custom />' });
    expect(example.name).toBe('Custom');
    expect(example.code).toBe('<Custom />');
  });
});

describe('createParameterEntry', () => {
  it('should create with default name "options"', () => {
    const param = createParameterEntry();
    expect(param.name).toBe('options');
    expect(param.required).toBe(true);
  });

  it('should accept a custom name', () => {
    const param = createParameterEntry('config');
    expect(param.name).toBe('config');
    expect(param.description).toContain('config');
  });
});

describe('createGuideCodeExample', () => {
  it('should create with defaults', () => {
    const example = createGuideCodeExample();
    expect(example.title).toBe('Example');
    expect(example.language).toBe('tsx');
    expect(example.code).toBeTruthy();
  });
});

// ============================================================================
// Composite factory tests
// ============================================================================

describe('createComponentEnhanced', () => {
  it('should create a full enhanced object', () => {
    const enhanced = createComponentEnhanced();
    expect(enhanced.description).toBeTruthy();
    expect(enhanced.whenToUse).toBeTruthy();
    expect(enhanced.bestPractices.dos.length).toBeGreaterThan(0);
    expect(enhanced.bestPractices.donts.length).toBeGreaterThan(0);
    expect(enhanced.accessibility.keyboardSupport.length).toBeGreaterThan(0);
    expect(enhanced.accessibility.ariaAttributes.length).toBeGreaterThan(0);
    expect(enhanced.commonPatterns.length).toBeGreaterThan(0);
    expect(enhanced.sourceHash).toBeTruthy();
    expect(enhanced.enhancedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('should allow overriding description', () => {
    const enhanced = createComponentEnhanced({ description: 'Custom desc' });
    expect(enhanced.description).toBe('Custom desc');
  });
});

describe('createUtilityExport', () => {
  it('should create a hook export by default', () => {
    const exp = createUtilityExport();
    expect(exp.name).toBe('useUtility');
    expect(exp.kind).toBe('hook');
  });

  it('should accept custom name and kind', () => {
    const exp = createUtilityExport('createStyles', 'function');
    expect(exp.name).toBe('createStyles');
    expect(exp.kind).toBe('function');
  });
});

describe('createUtilityEntry', () => {
  it('should create with defaults', () => {
    const utility = createUtilityEntry();
    expect(utility.name).toBe('Positioning');
    expect(utility.id).toBe('positioning');
    expect(utility.packageName).toContain('positioning');
    expect(utility.stability).toBe('stable');
    expect(utility.exports).toEqual([]);
  });

  it('should derive id from name', () => {
    const utility = createUtilityEntry('Motion Utilities');
    expect(utility.id).toBe('motion-utilities');
  });
});

describe('createGuideEntry', () => {
  it('should create with defaults', () => {
    const guide = createGuideEntry();
    expect(guide.id).toBe('getting-started');
    expect(guide.title).toContain('getting-started');
    expect(guide.content).toContain('getting-started');
    expect(guide.codeExamples).toHaveLength(1);
  });

  it('should accept a custom id', () => {
    const guide = createGuideEntry('theming');
    expect(guide.id).toBe('theming');
    expect(guide.sourceHash).toContain('theming');
  });
});

describe('createPatternEntryExample', () => {
  it('should create with default components', () => {
    const example = createPatternEntryExample();
    expect(example.name).toBe('Basic Example');
    expect(example.components).toContain('Input');
    expect(example.components).toContain('Button');
  });
});

describe('createPatternEntry', () => {
  it('should create with defaults', () => {
    const pattern = createPatternEntry();
    expect(pattern.id).toBe('basic-form');
    expect(pattern.group).toBe('forms');
    expect(pattern.examples).toHaveLength(1);
    expect(pattern.referencedComponents).toContain('Input');
  });

  it('should accept a custom id', () => {
    const pattern = createPatternEntry('sidebar-nav');
    expect(pattern.id).toBe('sidebar-nav');
  });
});

// ============================================================================
// Top-level schema factory tests
// ============================================================================

describe('createComponentEntry', () => {
  it('should create a Button component by default', () => {
    const component = createComponentEntry();
    expect(component.name).toBe('Button');
    expect(component.id).toBe('button');
    expect(component.category).toBe('buttons');
    expect(component.stability).toBe('stable');
    expect(component.deprecated).toBe(false);
    expect(component.props.length).toBeGreaterThan(0);
    expect(component.slots.length).toBeGreaterThan(0);
    expect(component.stories.length).toBeGreaterThan(0);
    expect(component.enhanced).toBeUndefined();
  });

  it('should derive id from PascalCase name', () => {
    const component = createComponentEntry('CompoundButton');
    expect(component.id).toBe('compound-button');
    expect(component.importStatement).toContain('CompoundButton');
  });

  it('should allow overriding category', () => {
    const component = createComponentEntry('Input', { category: 'forms' });
    expect(component.category).toBe('forms');
  });
});

describe('createFluentUISchema', () => {
  it('should create an empty schema with defaults', () => {
    const schema = createFluentUISchema();
    expect(schema.schemaVersion).toBe('1.0');
    expect(schema.version).toBe('v9');
    expect(schema.components).toEqual([]);
    expect(schema.utilities).toEqual([]);
    expect(schema.foundation).toEqual([]);
    expect(schema.patterns).toEqual([]);
    expect(schema.enterprise).toEqual([]);
    expect(schema.quickReference).toEqual([]);
    expect(schema.stats.totalComponents).toBe(0);
  });

  it('should allow adding components via overrides', () => {
    const schema = createFluentUISchema({
      components: [createComponentEntry()],
    });
    expect(schema.components).toHaveLength(1);
    expect(schema.components[0].name).toBe('Button');
  });
});

// ============================================================================
// Pre-built schema tests
// ============================================================================

describe('createMinimalTestSchema', () => {
  it('should have 3 components', () => {
    const schema = createMinimalTestSchema();
    expect(schema.components).toHaveLength(3);
  });

  it('should have Button, Input, and Dialog', () => {
    const schema = createMinimalTestSchema();
    const names = schema.components.map(c => c.name);
    expect(names).toContain('Button');
    expect(names).toContain('Input');
    expect(names).toContain('Dialog');
  });

  it('should cover 3 categories', () => {
    const schema = createMinimalTestSchema();
    const categories = new Set(schema.components.map(c => c.category));
    expect(categories.size).toBe(3);
    expect(categories).toContain('buttons');
    expect(categories).toContain('forms');
    expect(categories).toContain('feedback');
  });

  it('should not have enhanced data (raw scraper output)', () => {
    const schema = createMinimalTestSchema();
    for (const component of schema.components) {
      expect(component.enhanced).toBeUndefined();
    }
  });

  it('should have accurate stats', () => {
    const schema = createMinimalTestSchema();
    expect(schema.stats.totalComponents).toBe(3);
    expect(schema.stats.totalProps).toBe(
      schema.components.reduce((sum, c) => sum + c.props.length, 0),
    );
    expect(schema.stats.totalStories).toBe(
      schema.components.reduce((sum, c) => sum + c.stories.length, 0),
    );
  });

  it('should have no utilities, guides, patterns, or enterprise', () => {
    const schema = createMinimalTestSchema();
    expect(schema.utilities).toHaveLength(0);
    expect(schema.foundation).toHaveLength(0);
    expect(schema.patterns).toHaveLength(0);
    expect(schema.enterprise).toHaveLength(0);
    expect(schema.quickReference).toHaveLength(0);
  });
});

describe('createEnhancedTestSchema', () => {
  it('should have 3 components with enhanced data', () => {
    const schema = createEnhancedTestSchema();
    expect(schema.components).toHaveLength(3);
    for (const component of schema.components) {
      expect(component.enhanced).toBeDefined();
      expect(component.enhanced!.description).toBeTruthy();
      expect(component.enhanced!.whenToUse).toBeTruthy();
      expect(component.enhanced!.sourceHash).toBeTruthy();
    }
  });

  it('should have a utility package', () => {
    const schema = createEnhancedTestSchema();
    expect(schema.utilities).toHaveLength(1);
    expect(schema.utilities[0].name).toBe('Positioning');
    expect(schema.utilities[0].enhanced).toBeDefined();
  });

  it('should have a foundation guide', () => {
    const schema = createEnhancedTestSchema();
    expect(schema.foundation).toHaveLength(1);
    expect(schema.foundation[0].id).toBe('getting-started');
  });

  it('should have a pattern', () => {
    const schema = createEnhancedTestSchema();
    expect(schema.patterns).toHaveLength(1);
    expect(schema.patterns[0].id).toBe('login-form');
    expect(schema.patterns[0].examples.length).toBeGreaterThan(0);
  });

  it('should have an enterprise guide', () => {
    const schema = createEnhancedTestSchema();
    expect(schema.enterprise).toHaveLength(1);
    expect(schema.enterprise[0].id).toBe('app-shell');
  });

  it('should have a quick reference guide', () => {
    const schema = createEnhancedTestSchema();
    expect(schema.quickReference).toHaveLength(1);
    expect(schema.quickReference[0].id).toBe('component-cheatsheet');
  });

  it('should have a contrib source', () => {
    const schema = createEnhancedTestSchema();
    expect(schema.sources.contrib).toBeDefined();
    expect(schema.sources.contrib!.repo).toContain('contrib');
  });
});

// ============================================================================
// JSON fixture file tests — verify files are valid JSON and match types
// ============================================================================

describe('JSON fixture files', () => {
  const fixturesDir = join(__dirname);

  it('should load and parse test-schema-minimal.json', () => {
    const raw = readFileSync(join(fixturesDir, 'test-schema-minimal.json'), 'utf-8');
    const schema = JSON.parse(raw);
    expect(schema.schemaVersion).toBe('1.0');
    expect(schema.version).toBe('v9');
    expect(schema.components).toHaveLength(3);
    expect(schema.stats.totalComponents).toBe(3);
  });

  it('should load and parse test-schema-enhanced.json', () => {
    const raw = readFileSync(join(fixturesDir, 'test-schema-enhanced.json'), 'utf-8');
    const schema = JSON.parse(raw);
    expect(schema.schemaVersion).toBe('1.0');
    expect(schema.components).toHaveLength(3);
    // All components should have enhanced data
    for (const c of schema.components) {
      expect(c.enhanced).toBeDefined();
      expect(c.enhanced.description).toBeTruthy();
    }
    expect(schema.utilities).toHaveLength(1);
    expect(schema.foundation).toHaveLength(1);
    expect(schema.patterns).toHaveLength(1);
    expect(schema.enterprise).toHaveLength(1);
    expect(schema.quickReference).toHaveLength(1);
  });

  it('should load and parse test-schema-invalid.json', () => {
    const raw = readFileSync(join(fixturesDir, 'test-schema-invalid.json'), 'utf-8');
    const invalidCases = JSON.parse(raw);
    // Verify the file contains expected invalid test cases
    expect(invalidCases.missing_schema_version).toBeDefined();
    expect(invalidCases.wrong_schema_version).toBeDefined();
    expect(invalidCases.missing_version).toBeDefined();
    expect(invalidCases.missing_sources).toBeDefined();
    expect(invalidCases.missing_components_array).toBeDefined();
    expect(invalidCases.component_missing_name).toBeDefined();
    expect(invalidCases.invalid_stability).toBeDefined();
    expect(invalidCases.stats_mismatch).toBeDefined();
    expect(invalidCases.empty_object).toBeDefined();
    expect(invalidCases.not_an_object).toBeDefined();
    expect(invalidCases.null_value).toBeDefined();
    expect(invalidCases.components_not_array).toBeDefined();
    expect(invalidCases.duplicate_component_ids).toBeDefined();
    // Each case should have description and data
    expect(invalidCases.missing_schema_version.description).toBeTruthy();
    expect(invalidCases.missing_schema_version.data).toBeDefined();
  });
});

// ============================================================================
// Mock FluentUI directory structure tests
// ============================================================================

describe('Mock FluentUI directory structure', () => {
  const mockDir = join(__dirname, 'mock-fluentui');

  it('should have Button package.json', () => {
    const raw = readFileSync(join(mockDir, 'packages/react-components/react-button/package.json'), 'utf-8');
    const pkg = JSON.parse(raw);
    expect(pkg.name).toBe('@fluentui/react-button');
    expect(pkg.version).toBe('9.9.1');
  });

  it('should have Input package.json', () => {
    const raw = readFileSync(join(mockDir, 'packages/react-components/react-input/package.json'), 'utf-8');
    const pkg = JSON.parse(raw);
    expect(pkg.name).toBe('@fluentui/react-input');
  });

  it('should have Dialog package.json', () => {
    const raw = readFileSync(join(mockDir, 'packages/react-components/react-dialog/package.json'), 'utf-8');
    const pkg = JSON.parse(raw);
    expect(pkg.name).toBe('@fluentui/react-dialog');
  });

  it('should have Button.types.ts with ButtonProps', () => {
    const content = readFileSync(
      join(mockDir, 'packages/react-components/react-button/library/src/Button.types.ts'),
      'utf-8',
    );
    expect(content).toContain('ButtonProps');
    expect(content).toContain('appearance');
    expect(content).toContain('ButtonSlots');
  });

  it('should have useButton.ts with defaults', () => {
    const content = readFileSync(
      join(mockDir, 'packages/react-components/react-button/library/src/useButton.ts'),
      'utf-8',
    );
    expect(content).toContain("appearance = 'secondary'");
    expect(content).toContain("size = 'medium'");
  });

  it('should have Button stories', () => {
    const content = readFileSync(
      join(mockDir, 'packages/react-components/react-button/stories/src/Button/ButtonDefault.stories.tsx'),
      'utf-8',
    );
    expect(content).toContain('export const Default');
    expect(content).toContain('<Button>');
  });

  it('should have stable exports index', () => {
    const content = readFileSync(
      join(mockDir, 'packages/react-components/react-components/library/src/index.ts'),
      'utf-8',
    );
    expect(content).toContain('Button');
    expect(content).toContain('Input');
    expect(content).toContain('Dialog');
  });

  it('should have unstable exports index', () => {
    const content = readFileSync(
      join(mockDir, 'packages/react-components/react-components/library/src/unstable/index.ts'),
      'utf-8',
    );
    // Should be empty (no preview exports in the mock)
    expect(content).toContain('No preview exports');
  });
});
