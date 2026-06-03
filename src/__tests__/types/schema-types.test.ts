/**
 * Tests for schema type definitions and exports.
 *
 * These tests verify that:
 * 1. All schema types are properly exported from the types module
 * 2. Runtime constants (KNOWN_COMPONENT_CATEGORIES) have correct values
 * 3. Type guards and type narrowing work correctly
 * 4. Schema objects conform to their interfaces
 *
 * @module tests/types/schema-types
 */

import { describe, it, expect } from 'vitest';
import {
  KNOWN_COMPONENT_CATEGORIES,
  type FluentUISchema,
  type SourceInfo,
  type SchemaStats,
  type ComponentEntry,
  type SchemaComponentCategory,
  type StabilityLevel,
  type KnownComponentCategory,
  type PropEntry,
  type SlotEntry,
  type StoryEntry,
  type ComponentEnhanced,
  type KeyboardEntry,
  type PatternExample,
  type UtilityEntry,
  type UtilityEnhanced,
  type UtilityExport,
  type UtilityExportKind,
  type ParameterEntry,
  type GuideEntry,
  type GuideCodeExample,
  type PatternEntry,
  type PatternEntryExample,
} from '../../types/index.js';

// ============================================================================
// KNOWN_COMPONENT_CATEGORIES constant
// ============================================================================

describe('KNOWN_COMPONENT_CATEGORIES', () => {
  it('should be a readonly array', () => {
    expect(Array.isArray(KNOWN_COMPONENT_CATEGORIES)).toBe(true);
  });

  it('should contain all expected categories', () => {
    const expected = [
      'buttons',
      'forms',
      'navigation',
      'data-display',
      'feedback',
      'overlays',
      'layout',
      'utilities',
      'contrib',
    ];
    expect([...KNOWN_COMPONENT_CATEGORIES]).toEqual(expected);
  });

  it('should contain 9 categories', () => {
    expect(KNOWN_COMPONENT_CATEGORIES).toHaveLength(9);
  });

  it('should include "buttons" as a known category', () => {
    expect(KNOWN_COMPONENT_CATEGORIES).toContain('buttons');
  });

  it('should include "contrib" as a known category', () => {
    expect(KNOWN_COMPONENT_CATEGORIES).toContain('contrib');
  });
});

// ============================================================================
// Type conformance tests — verify objects match interfaces at runtime
// ============================================================================

describe('SourceInfo type conformance', () => {
  it('should accept a valid SourceInfo object', () => {
    const source: SourceInfo = {
      repo: 'https://github.com/microsoft/fluentui',
      ref: 'main',
      commit: 'abc123def456',
      scrapedAt: '2025-01-15T10:30:00Z',
    };
    expect(source.repo).toBe('https://github.com/microsoft/fluentui');
    expect(source.ref).toBe('main');
    expect(source.commit).toBe('abc123def456');
    expect(source.scrapedAt).toBe('2025-01-15T10:30:00Z');
  });
});

describe('SchemaStats type conformance', () => {
  it('should accept a valid SchemaStats object', () => {
    const stats: SchemaStats = {
      totalComponents: 85,
      totalUtilities: 12,
      totalContrib: 5,
      totalPreview: 8,
      totalStories: 450,
      totalProps: 1200,
      categoryCounts: { buttons: 5, forms: 15, navigation: 6 },
    };
    expect(stats.totalComponents).toBe(85);
    expect(stats.categoryCounts['buttons']).toBe(5);
  });
});

describe('PropEntry type conformance', () => {
  it('should accept a valid required PropEntry', () => {
    const prop: PropEntry = {
      name: 'appearance',
      type: "'primary' | 'secondary' | 'outline'",
      required: false,
      description: 'Controls the visual appearance of the button',
      deprecated: false,
      inherited: false,
      source: 'ButtonProps',
    };
    expect(prop.name).toBe('appearance');
    expect(prop.required).toBe(false);
    expect(prop.defaultValue).toBeUndefined();
  });

  it('should accept a PropEntry with optional fields', () => {
    const prop: PropEntry = {
      name: 'size',
      type: "'small' | 'medium' | 'large'",
      required: false,
      defaultValue: "'medium'",
      description: 'Controls the size of the button',
      deprecated: true,
      deprecationMessage: 'Use the "scale" prop instead',
      inherited: false,
      source: 'ButtonProps',
    };
    expect(prop.defaultValue).toBe("'medium'");
    expect(prop.deprecated).toBe(true);
    expect(prop.deprecationMessage).toBe('Use the "scale" prop instead');
  });
});

describe('SlotEntry type conformance', () => {
  it('should accept a valid SlotEntry', () => {
    const slot: SlotEntry = {
      name: 'root',
      elementType: 'button',
      required: true,
      description: 'The root element of the button',
    };
    expect(slot.name).toBe('root');
    expect(slot.required).toBe(true);
    expect(slot.alternativeTypes).toBeUndefined();
  });

  it('should accept a SlotEntry with alternative types', () => {
    const slot: SlotEntry = {
      name: 'root',
      elementType: 'button',
      alternativeTypes: ['a', 'div'],
      required: true,
      description: 'The root element',
    };
    expect(slot.alternativeTypes).toEqual(['a', 'div']);
  });
});

describe('StoryEntry type conformance', () => {
  it('should accept a valid StoryEntry', () => {
    const story: StoryEntry = {
      name: 'Default',
      description: 'Default button example',
      code: 'export const Default = () => <Button>Click me</Button>;',
      renderCode: '<Button>Click me</Button>',
      sourceFile: 'packages/react-button/stories/Button.stories.tsx',
      imports: ["import { Button } from '@fluentui/react-components'"],
    };
    expect(story.name).toBe('Default');
    expect(story.imports).toHaveLength(1);
  });
});

describe('ComponentEnhanced type conformance', () => {
  it('should accept a valid ComponentEnhanced object', () => {
    const enhanced: ComponentEnhanced = {
      description: 'A button triggers an action or event when activated.',
      whenToUse: 'Use Button for form submissions, dialog actions, and navigation triggers.',
      bestPractices: {
        dos: ['Use clear, concise labels', 'Provide visual feedback'],
        donts: ['Don\'t use buttons for navigation', 'Don\'t disable without explanation'],
      },
      accessibility: {
        requirements: 'Must have accessible label, keyboard operable',
        keyboardSupport: [
          { key: 'Enter', action: 'Activates the button' },
          { key: 'Space', action: 'Activates the button' },
        ],
        ariaAttributes: ['aria-label', 'aria-pressed'],
        screenReaderBehavior: 'Announces as "button" role with label',
      },
      commonPatterns: [
        {
          name: 'Primary action',
          description: 'Use for the main action in a dialog or form',
          code: '<Button appearance="primary">Submit</Button>',
        },
      ],
      stylingTips: 'Use tokens.colorBrandBackground for custom styling.',
      sourceHash: 'abc123',
      enhancedAt: '2025-01-15T10:30:00Z',
    };
    expect(enhanced.bestPractices.dos).toHaveLength(2);
    expect(enhanced.accessibility.keyboardSupport).toHaveLength(2);
    expect(enhanced.commonPatterns).toHaveLength(1);
    expect(enhanced.migrationNotes).toBeUndefined();
  });

  it('should accept ComponentEnhanced with migration notes', () => {
    const enhanced: ComponentEnhanced = {
      description: 'A button component',
      whenToUse: 'For actions',
      bestPractices: { dos: [], donts: [] },
      accessibility: {
        requirements: '',
        keyboardSupport: [],
        ariaAttributes: [],
        screenReaderBehavior: '',
      },
      commonPatterns: [],
      stylingTips: '',
      migrationNotes: 'Renamed from PrimaryButton to Button with appearance="primary"',
      sourceHash: 'def456',
      enhancedAt: '2025-01-15T10:30:00Z',
    };
    expect(enhanced.migrationNotes).toContain('PrimaryButton');
  });
});

describe('KeyboardEntry type conformance', () => {
  it('should accept a valid KeyboardEntry', () => {
    const entry: KeyboardEntry = {
      key: 'Enter',
      action: 'Activates the button',
    };
    expect(entry.key).toBe('Enter');
    expect(entry.action).toBe('Activates the button');
  });
});

describe('PatternExample type conformance', () => {
  it('should accept a valid PatternExample', () => {
    const example: PatternExample = {
      name: 'Primary Button',
      description: 'A primary action button',
      code: '<Button appearance="primary">Submit</Button>',
    };
    expect(example.name).toBe('Primary Button');
  });
});

// ============================================================================
// Utility type conformance tests
// ============================================================================

describe('UtilityExport type conformance', () => {
  it('should accept a function export', () => {
    const exp: UtilityExport = {
      name: 'createArrowStyles',
      kind: 'function',
      description: 'Creates CSS styles for positioning arrows',
    };
    expect(exp.kind).toBe('function');
    expect(exp.parameters).toBeUndefined();
  });

  it('should accept a hook export with parameters', () => {
    const exp: UtilityExport = {
      name: 'usePositioning',
      kind: 'hook',
      description: 'Hook for positioning floating elements',
      parameters: [
        {
          name: 'options',
          type: 'PositioningOptions',
          required: true,
          description: 'Positioning configuration',
        },
      ],
      returnType: 'PositioningState',
    };
    expect(exp.kind).toBe('hook');
    expect(exp.parameters).toHaveLength(1);
    expect(exp.returnType).toBe('PositioningState');
  });
});

describe('UtilityEntry type conformance', () => {
  it('should accept a valid UtilityEntry without enhanced data', () => {
    const utility: UtilityEntry = {
      name: 'Positioning',
      id: 'positioning',
      packageName: '@fluentui/react-positioning',
      packageVersion: '9.15.1',
      importPath: '@fluentui/react-positioning',
      stability: 'stable',
      exports: [],
    };
    expect(utility.name).toBe('Positioning');
    expect(utility.enhanced).toBeUndefined();
  });

  it('should accept a UtilityEntry with enhanced data', () => {
    const utility: UtilityEntry = {
      name: 'Positioning',
      id: 'positioning',
      packageName: '@fluentui/react-positioning',
      packageVersion: '9.15.1',
      importPath: '@fluentui/react-positioning',
      stability: 'stable',
      exports: [],
      enhanced: {
        description: 'Provides positioning utilities for floating elements',
        whenToUse: 'When building dropdowns, tooltips, or popovers',
        commonPatterns: [],
        sourceHash: 'hash123',
        enhancedAt: '2025-01-15T10:30:00Z',
      },
    };
    expect(utility.enhanced).toBeDefined();
    expect(utility.enhanced!.description).toContain('positioning');
  });
});

describe('ParameterEntry type conformance', () => {
  it('should accept a valid ParameterEntry', () => {
    const param: ParameterEntry = {
      name: 'options',
      type: 'PositioningOptions',
      required: true,
      description: 'Configuration for positioning behavior',
    };
    expect(param.name).toBe('options');
    expect(param.required).toBe(true);
  });
});

// ============================================================================
// Guide & Pattern type conformance tests
// ============================================================================

describe('GuideEntry type conformance', () => {
  it('should accept a valid GuideEntry', () => {
    const guide: GuideEntry = {
      id: 'getting-started',
      title: 'Getting Started with FluentUI v9',
      category: 'foundation',
      content: '# Getting Started\n\nInstall FluentUI...',
      codeExamples: [
        {
          title: 'Installation',
          description: 'Install the main package',
          code: 'npm install @fluentui/react-components',
          language: 'bash',
        },
      ],
      referencedComponents: ['FluentProvider', 'Button'],
      sourceHash: 'guide-hash-123',
      enhancedAt: '2025-01-15T10:30:00Z',
    };
    expect(guide.id).toBe('getting-started');
    expect(guide.codeExamples).toHaveLength(1);
    expect(guide.referencedComponents).toContain('Button');
  });
});

describe('GuideCodeExample type conformance', () => {
  it('should accept a valid GuideCodeExample', () => {
    const example: GuideCodeExample = {
      title: 'Basic Setup',
      description: 'How to set up FluentProvider',
      code: '<FluentProvider theme={webLightTheme}>...</FluentProvider>',
      language: 'tsx',
    };
    expect(example.language).toBe('tsx');
  });
});

describe('PatternEntry type conformance', () => {
  it('should accept a valid PatternEntry', () => {
    const pattern: PatternEntry = {
      id: 'login-form',
      title: 'Login Form Pattern',
      group: 'forms',
      content: '# Login Form\n\nA standard login form pattern...',
      examples: [
        {
          name: 'Basic Login',
          description: 'Simple email/password login form',
          code: '<form>...</form>',
          components: ['Input', 'Button', 'Field', 'Label'],
        },
      ],
      referencedComponents: ['Input', 'Button', 'Field', 'Label'],
      sourceHash: 'pattern-hash-456',
      enhancedAt: '2025-01-15T10:30:00Z',
    };
    expect(pattern.group).toBe('forms');
    expect(pattern.examples).toHaveLength(1);
    expect(pattern.examples[0].components).toContain('Input');
  });
});

describe('PatternEntryExample type conformance', () => {
  it('should accept a valid PatternEntryExample', () => {
    const example: PatternEntryExample = {
      name: 'Sidebar Navigation',
      description: 'A responsive sidebar navigation pattern',
      code: '<Nav>...</Nav>',
      components: ['Nav', 'NavItem', 'NavCategory'],
    };
    expect(example.components).toHaveLength(3);
  });
});

// ============================================================================
// StabilityLevel and UtilityExportKind type tests
// ============================================================================

describe('StabilityLevel type conformance', () => {
  it('should accept all valid stability levels', () => {
    const levels: StabilityLevel[] = ['stable', 'preview', 'unstable', 'contrib'];
    expect(levels).toHaveLength(4);
    expect(levels).toContain('stable');
    expect(levels).toContain('preview');
    expect(levels).toContain('unstable');
    expect(levels).toContain('contrib');
  });
});

describe('UtilityExportKind type conformance', () => {
  it('should accept all valid export kinds', () => {
    const kinds: UtilityExportKind[] = ['function', 'hook', 'type', 'interface', 'constant', 'class'];
    expect(kinds).toHaveLength(6);
    expect(kinds).toContain('hook');
    expect(kinds).toContain('function');
  });
});

// ============================================================================
// ComponentEntry — full conformance test
// ============================================================================

describe('ComponentEntry type conformance', () => {
  it('should accept a minimal ComponentEntry (raw scraper output, no enhanced)', () => {
    const component: ComponentEntry = {
      name: 'Button',
      id: 'button',
      packageName: '@fluentui/react-button',
      packageVersion: '9.9.1',
      importPath: '@fluentui/react-components',
      importStatement: "import { Button } from '@fluentui/react-components'",
      category: 'buttons',
      stability: 'stable',
      deprecated: false,
      props: [],
      slots: [],
      stories: [],
      relatedComponents: ['CompoundButton', 'ToggleButton'],
      additionalExports: ['buttonClassNames', 'useButtonStyles_unstable'],
    };
    expect(component.name).toBe('Button');
    expect(component.enhanced).toBeUndefined();
    expect(component.deprecationMessage).toBeUndefined();
  });

  it('should accept a full ComponentEntry with enhanced data', () => {
    const component: ComponentEntry = {
      name: 'Button',
      id: 'button',
      packageName: '@fluentui/react-button',
      packageVersion: '9.9.1',
      importPath: '@fluentui/react-components',
      importStatement: "import { Button } from '@fluentui/react-components'",
      category: 'buttons',
      stability: 'stable',
      deprecated: false,
      props: [
        {
          name: 'appearance',
          type: "'primary' | 'secondary'",
          required: false,
          description: 'Visual appearance',
          deprecated: false,
          inherited: false,
          source: 'ButtonProps',
        },
      ],
      slots: [
        {
          name: 'root',
          elementType: 'button',
          required: true,
          description: 'Root element',
        },
      ],
      stories: [
        {
          name: 'Default',
          description: 'Default button',
          code: 'export const Default = () => <Button>Click</Button>',
          renderCode: '<Button>Click</Button>',
          sourceFile: 'Button.stories.tsx',
          imports: ["import { Button } from '@fluentui/react-components'"],
        },
      ],
      enhanced: {
        description: 'A versatile button component',
        whenToUse: 'For triggering actions',
        bestPractices: { dos: ['Use labels'], donts: ['Avoid nesting'] },
        accessibility: {
          requirements: 'Keyboard operable',
          keyboardSupport: [{ key: 'Enter', action: 'Activate' }],
          ariaAttributes: ['aria-label'],
          screenReaderBehavior: 'Announces as button',
        },
        commonPatterns: [],
        stylingTips: 'Use design tokens',
        sourceHash: 'hash',
        enhancedAt: '2025-01-15T10:30:00Z',
      },
      relatedComponents: ['CompoundButton'],
      additionalExports: [],
    };
    expect(component.enhanced).toBeDefined();
    expect(component.props).toHaveLength(1);
    expect(component.slots).toHaveLength(1);
    expect(component.stories).toHaveLength(1);
  });
});

// ============================================================================
// FluentUISchema — root schema conformance
// ============================================================================

describe('FluentUISchema type conformance', () => {
  it('should accept a valid minimal FluentUISchema', () => {
    const schema: FluentUISchema = {
      schemaVersion: '1.0',
      version: 'v9',
      generatedAt: '2025-01-15T10:30:00Z',
      sources: {
        fluentui: {
          repo: 'https://github.com/microsoft/fluentui',
          ref: 'main',
          commit: 'abc123',
          scrapedAt: '2025-01-15T10:30:00Z',
        },
      },
      components: [],
      utilities: [],
      foundation: [],
      patterns: [],
      enterprise: [],
      quickReference: [],
      stats: {
        totalComponents: 0,
        totalUtilities: 0,
        totalContrib: 0,
        totalPreview: 0,
        totalStories: 0,
        totalProps: 0,
        categoryCounts: {},
      },
    };
    expect(schema.schemaVersion).toBe('1.0');
    expect(schema.version).toBe('v9');
    expect(schema.components).toHaveLength(0);
  });

  it('should accept a FluentUISchema with optional contrib source', () => {
    const schema: FluentUISchema = {
      schemaVersion: '1.0',
      version: 'v9',
      generatedAt: '2025-01-15T10:30:00Z',
      sources: {
        fluentui: {
          repo: 'https://github.com/microsoft/fluentui',
          ref: 'main',
          commit: 'abc123',
          scrapedAt: '2025-01-15T10:30:00Z',
        },
        contrib: {
          repo: 'https://github.com/microsoft/fluentui-contrib',
          ref: 'main',
          commit: 'def456',
          scrapedAt: '2025-01-15T10:30:00Z',
        },
      },
      components: [],
      utilities: [],
      foundation: [],
      patterns: [],
      enterprise: [],
      quickReference: [],
      stats: {
        totalComponents: 0,
        totalUtilities: 0,
        totalContrib: 0,
        totalPreview: 0,
        totalStories: 0,
        totalProps: 0,
        categoryCounts: {},
      },
    };
    expect(schema.sources.contrib).toBeDefined();
    expect(schema.sources.contrib!.repo).toContain('contrib');
  });
});

// ============================================================================
// SchemaComponentCategory — extensibility test
// ============================================================================

describe('SchemaComponentCategory extensibility', () => {
  it('should accept known categories', () => {
    const category: SchemaComponentCategory = 'buttons';
    expect(category).toBe('buttons');
  });

  it('should accept unknown categories (extensible string type)', () => {
    // SchemaComponentCategory is a plain string, so unknown categories are allowed
    // at the type level. Validation happens at runtime via KNOWN_COMPONENT_CATEGORIES.
    const unknownCategory: SchemaComponentCategory = 'custom-widgets';
    expect(unknownCategory).toBe('custom-widgets');
  });

  it('should allow checking if a category is known', () => {
    const category = 'buttons';
    const isKnown = (KNOWN_COMPONENT_CATEGORIES as readonly string[]).includes(category);
    expect(isKnown).toBe(true);

    const unknownCategory = 'custom-widgets';
    const isUnknown = (KNOWN_COMPONENT_CATEGORIES as readonly string[]).includes(unknownCategory);
    expect(isUnknown).toBe(false);
  });
});
