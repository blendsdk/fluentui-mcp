/**
 * Test fixture helpers for creating schema test data.
 *
 * These factory functions produce valid instances of schema types with
 * sensible defaults. Override any field by passing a partial object.
 * Used across scraper, enhancer, and MCP server tests.
 *
 * @module tests/fixtures/helpers
 */

import type {
  FluentUISchema,
  SourceInfo,
  SchemaStats,
  ComponentEntry,
  PropEntry,
  SlotEntry,
  StoryEntry,
  ComponentEnhanced,
  KeyboardEntry,
  PatternExample,
  UtilityEntry,
  UtilityEnhanced,
  UtilityExport,
  ParameterEntry,
  GuideEntry,
  GuideCodeExample,
  PatternEntry,
  PatternEntryExample,
  StabilityLevel,
  UtilityExportKind,
} from '../../types/index.js';

// ============================================================================
// Atomic type factories
// ============================================================================

/**
 * Create a test SourceInfo with sensible defaults.
 * Represents git repository metadata captured during scraping.
 */
export function createSourceInfo(overrides?: Partial<SourceInfo>): SourceInfo {
  return {
    repo: 'https://github.com/microsoft/fluentui',
    ref: 'main',
    commit: 'abc123def456789',
    scrapedAt: '2025-06-01T10:00:00Z',
    ...overrides,
  };
}

/**
 * Create a test SchemaStats with sensible defaults.
 * Pass computed values to override the zero defaults.
 */
export function createSchemaStats(overrides?: Partial<SchemaStats>): SchemaStats {
  return {
    totalComponents: 0,
    totalUtilities: 0,
    totalContrib: 0,
    totalPreview: 0,
    totalStories: 0,
    totalProps: 0,
    categoryCounts: {},
    ...overrides,
  };
}

/**
 * Create a test PropEntry with sensible defaults.
 *
 * @param name - Prop name (default: 'appearance')
 * @param overrides - Override any fields
 */
export function createPropEntry(
  name?: string,
  overrides?: Partial<PropEntry>,
): PropEntry {
  return {
    name: name ?? 'appearance',
    type: 'string',
    required: false,
    description: `The ${name ?? 'appearance'} prop`,
    deprecated: false,
    inherited: false,
    source: 'ComponentProps',
    ...overrides,
  };
}

/**
 * Create a test SlotEntry with sensible defaults.
 *
 * @param name - Slot name (default: 'root')
 * @param overrides - Override any fields
 */
export function createSlotEntry(
  name?: string,
  overrides?: Partial<SlotEntry>,
): SlotEntry {
  return {
    name: name ?? 'root',
    elementType: 'div',
    required: name === 'root' || overrides?.required === true,
    description: `The ${name ?? 'root'} slot`,
    ...overrides,
  };
}

/**
 * Create a test StoryEntry with sensible defaults.
 *
 * @param name - Story name (default: 'Default')
 * @param overrides - Override any fields
 */
export function createStoryEntry(
  name?: string,
  overrides?: Partial<StoryEntry>,
): StoryEntry {
  const storyName = name ?? 'Default';
  return {
    name: storyName,
    description: `${storyName} story example`,
    code: `export const ${storyName} = () => <Component />`,
    renderCode: '<Component />',
    sourceFile: 'Component.stories.tsx',
    imports: ["import { Component } from '@fluentui/react-components'"],
    ...overrides,
  };
}

/**
 * Create a test KeyboardEntry for accessibility documentation.
 */
export function createKeyboardEntry(
  key?: string,
  action?: string,
): KeyboardEntry {
  return {
    key: key ?? 'Enter',
    action: action ?? 'Activates the component',
  };
}

/**
 * Create a test PatternExample for common usage patterns.
 */
export function createPatternExample(
  overrides?: Partial<PatternExample>,
): PatternExample {
  return {
    name: 'Basic Usage',
    description: 'A basic usage example',
    code: '<Component>Hello</Component>',
    ...overrides,
  };
}

/**
 * Create a test ParameterEntry for utility function/hook parameters.
 */
export function createParameterEntry(
  name?: string,
  overrides?: Partial<ParameterEntry>,
): ParameterEntry {
  return {
    name: name ?? 'options',
    type: 'object',
    required: true,
    description: `The ${name ?? 'options'} parameter`,
    ...overrides,
  };
}

/**
 * Create a test GuideCodeExample for guide documentation.
 */
export function createGuideCodeExample(
  overrides?: Partial<GuideCodeExample>,
): GuideCodeExample {
  return {
    title: 'Example',
    description: 'An example code snippet',
    code: 'const x = 1;',
    language: 'tsx',
    ...overrides,
  };
}

// ============================================================================
// Composite type factories
// ============================================================================

/**
 * Create a test ComponentEnhanced with full LLM-enriched content.
 * Includes accessibility, best practices, and patterns.
 */
export function createComponentEnhanced(
  overrides?: Partial<ComponentEnhanced>,
): ComponentEnhanced {
  return {
    description: 'A versatile UI component for user interaction.',
    whenToUse: 'Use this component when you need interactive UI elements.',
    bestPractices: {
      dos: ['Use clear labels', 'Provide visual feedback on interaction'],
      donts: ['Don\'t nest interactive elements', 'Don\'t remove focus indicators'],
    },
    accessibility: {
      requirements: 'Must be keyboard-operable and have an accessible name.',
      keyboardSupport: [
        createKeyboardEntry('Enter', 'Activates the component'),
        createKeyboardEntry('Space', 'Activates the component'),
      ],
      ariaAttributes: ['aria-label', 'aria-disabled'],
      screenReaderBehavior: 'Announces the component role and label.',
    },
    commonPatterns: [createPatternExample()],
    stylingTips: 'Use design tokens for consistent theming.',
    sourceHash: 'test-hash-enhanced',
    enhancedAt: '2025-06-01T12:00:00Z',
    ...overrides,
  };
}

/**
 * Create a test UtilityExport entry.
 *
 * @param name - Export name (default: 'useUtility')
 * @param kind - Export kind (default: 'hook')
 * @param overrides - Override any fields
 */
export function createUtilityExport(
  name?: string,
  kind?: UtilityExportKind,
  overrides?: Partial<UtilityExport>,
): UtilityExport {
  return {
    name: name ?? 'useUtility',
    kind: kind ?? 'hook',
    description: `The ${name ?? 'useUtility'} export`,
    ...overrides,
  };
}

/**
 * Create a test UtilityEnhanced with LLM-enriched content.
 */
export function createUtilityEnhanced(
  overrides?: Partial<UtilityEnhanced>,
): UtilityEnhanced {
  return {
    description: 'A utility package providing helpful functions and hooks.',
    whenToUse: 'Use when you need shared logic across components.',
    commonPatterns: [createPatternExample()],
    sourceHash: 'utility-hash-enhanced',
    enhancedAt: '2025-06-01T12:00:00Z',
    ...overrides,
  };
}

/**
 * Create a test UtilityEntry (a non-component package).
 *
 * @param name - Package display name (default: 'Positioning')
 * @param overrides - Override any fields
 */
export function createUtilityEntry(
  name?: string,
  overrides?: Partial<UtilityEntry>,
): UtilityEntry {
  const displayName = name ?? 'Positioning';
  const id = displayName.toLowerCase().replace(/\s+/g, '-');
  return {
    name: displayName,
    id,
    packageName: `@fluentui/react-${id}`,
    packageVersion: '9.0.0',
    importPath: `@fluentui/react-${id}`,
    stability: 'stable' as StabilityLevel,
    exports: [],
    ...overrides,
  };
}

/**
 * Create a test GuideEntry (foundation, enterprise, or quick reference).
 *
 * @param id - Guide ID (default: 'getting-started')
 * @param overrides - Override any fields
 */
export function createGuideEntry(
  id?: string,
  overrides?: Partial<GuideEntry>,
): GuideEntry {
  const guideId = id ?? 'getting-started';
  return {
    id: guideId,
    title: `Guide: ${guideId}`,
    category: 'foundation',
    content: `# ${guideId}\n\nGuide content for ${guideId}.`,
    codeExamples: [createGuideCodeExample()],
    referencedComponents: [],
    sourceHash: `guide-hash-${guideId}`,
    enhancedAt: '2025-06-01T12:00:00Z',
    ...overrides,
  };
}

/**
 * Create a test PatternEntryExample (a working example within a pattern).
 */
export function createPatternEntryExample(
  overrides?: Partial<PatternEntryExample>,
): PatternEntryExample {
  return {
    name: 'Basic Example',
    description: 'A basic working example of the pattern',
    code: '<Form>\n  <Input />\n  <Button>Submit</Button>\n</Form>',
    components: ['Input', 'Button'],
    ...overrides,
  };
}

/**
 * Create a test PatternEntry (a usage pattern grouping multiple components).
 *
 * @param id - Pattern ID (default: 'basic-form')
 * @param overrides - Override any fields
 */
export function createPatternEntry(
  id?: string,
  overrides?: Partial<PatternEntry>,
): PatternEntry {
  const patternId = id ?? 'basic-form';
  return {
    id: patternId,
    title: `Pattern: ${patternId}`,
    group: 'forms',
    content: `# ${patternId}\n\nPattern content for ${patternId}.`,
    examples: [createPatternEntryExample()],
    referencedComponents: ['Input', 'Button'],
    sourceHash: `pattern-hash-${patternId}`,
    enhancedAt: '2025-06-01T12:00:00Z',
    ...overrides,
  };
}

// ============================================================================
// Top-level schema factories
// ============================================================================

/**
 * Create a test ComponentEntry with realistic default data.
 * By default creates a "Button" component in the "buttons" category.
 *
 * @param name - Component display name (default: 'Button')
 * @param overrides - Override any fields
 */
export function createComponentEntry(
  name?: string,
  overrides?: Partial<ComponentEntry>,
): ComponentEntry {
  const componentName = name ?? 'Button';
  const id = componentName
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
  const packageSuffix = id.replace(/-/g, '-');
  return {
    name: componentName,
    id,
    packageName: `@fluentui/react-${packageSuffix}`,
    packageVersion: '9.0.0',
    importPath: '@fluentui/react-components',
    importStatement: `import { ${componentName} } from '@fluentui/react-components'`,
    category: 'buttons',
    stability: 'stable' as StabilityLevel,
    deprecated: false,
    props: [
      createPropEntry('appearance', {
        type: "'primary' | 'secondary' | 'outline'",
        source: `${componentName}Props`,
      }),
    ],
    slots: [
      createSlotEntry('root', { elementType: 'button', required: true }),
    ],
    stories: [
      createStoryEntry('Default', {
        code: `export const Default = () => <${componentName}>Click me</${componentName}>`,
        renderCode: `<${componentName}>Click me</${componentName}>`,
        sourceFile: `${componentName}.stories.tsx`,
        imports: [`import { ${componentName} } from '@fluentui/react-components'`],
      }),
    ],
    relatedComponents: [],
    additionalExports: [],
    ...overrides,
  };
}

/**
 * Create a complete minimal FluentUISchema with sensible defaults.
 * Contains no components/utilities/guides by default — add via overrides.
 *
 * @param overrides - Override any top-level fields
 */
export function createFluentUISchema(
  overrides?: Partial<FluentUISchema>,
): FluentUISchema {
  return {
    schemaVersion: '1.0',
    version: 'v9',
    generatedAt: '2025-06-01T10:00:00Z',
    sources: {
      fluentui: createSourceInfo(),
    },
    components: [],
    utilities: [],
    foundation: [],
    patterns: [],
    enterprise: [],
    quickReference: [],
    stats: createSchemaStats(),
    ...overrides,
  };
}

// ============================================================================
// Pre-built test schemas
// ============================================================================

/**
 * Create a minimal test schema with 3 representative components:
 * Button (buttons), Input (forms), Dialog (feedback).
 *
 * This is a raw scraper output — no enhanced data.
 * Used for tests that need a realistic but small schema.
 */
export function createMinimalTestSchema(): FluentUISchema {
  const buttonComponent = createComponentEntry('Button', {
    category: 'buttons',
    packageName: '@fluentui/react-button',
    props: [
      createPropEntry('appearance', {
        type: "'primary' | 'secondary' | 'outline' | 'subtle' | 'transparent'",
        description: 'A button can have its content and borders styled for greater emphasis or to be subtle.',
        source: 'ButtonProps',
      }),
      createPropEntry('size', {
        type: "'small' | 'medium' | 'large'",
        defaultValue: "'medium'",
        description: 'A button supports different sizes.',
        source: 'ButtonProps',
      }),
      createPropEntry('disabled', {
        type: 'boolean',
        description: 'Whether the button is disabled.',
        source: 'ButtonProps',
      }),
      createPropEntry('icon', {
        type: 'Slot<"span">',
        description: 'Icon that renders before the content.',
        source: 'ButtonProps',
      }),
    ],
    slots: [
      createSlotEntry('root', { elementType: 'button', required: true, description: 'The root element of the button.' }),
      createSlotEntry('icon', { elementType: 'span', required: false, description: 'The icon slot.' }),
    ],
    stories: [
      createStoryEntry('Default', {
        description: 'A default Button.',
        code: "export const Default = () => <Button>Default</Button>;",
        renderCode: '<Button>Default</Button>',
        sourceFile: 'packages/react-button/stories/src/Button/ButtonDefault.stories.tsx',
        imports: ["import { Button } from '@fluentui/react-components'"],
      }),
      createStoryEntry('Appearance', {
        description: 'A button can have different appearances.',
        code: "export const Appearance = () => (\n  <>\n    <Button appearance=\"primary\">Primary</Button>\n    <Button appearance=\"secondary\">Secondary</Button>\n  </>\n);",
        renderCode: '<>\n  <Button appearance="primary">Primary</Button>\n  <Button appearance="secondary">Secondary</Button>\n</>',
        sourceFile: 'packages/react-button/stories/src/Button/ButtonAppearance.stories.tsx',
        imports: ["import { Button } from '@fluentui/react-components'"],
      }),
    ],
    relatedComponents: ['CompoundButton', 'ToggleButton', 'SplitButton', 'MenuButton'],
    additionalExports: ['buttonClassNames', 'useButtonStyles_unstable'],
  });

  const inputComponent = createComponentEntry('Input', {
    category: 'forms',
    packageName: '@fluentui/react-input',
    props: [
      createPropEntry('value', {
        type: 'string',
        description: 'The controlled value of the input.',
        source: 'InputProps',
      }),
      createPropEntry('defaultValue', {
        type: 'string',
        description: 'The default value for an uncontrolled input.',
        source: 'InputProps',
      }),
      createPropEntry('type', {
        type: "'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url'",
        defaultValue: "'text'",
        description: 'The type of the input element.',
        source: 'InputProps',
      }),
      createPropEntry('appearance', {
        type: "'outline' | 'underline' | 'filled-darker' | 'filled-lighter'",
        defaultValue: "'outline'",
        description: 'Controls the colors and borders of the input.',
        source: 'InputProps',
      }),
      createPropEntry('disabled', {
        type: 'boolean',
        description: 'Whether the input is disabled.',
        source: 'InputProps',
      }),
    ],
    slots: [
      createSlotEntry('root', { elementType: 'span', required: true, description: 'The root wrapper element.' }),
      createSlotEntry('input', { elementType: 'input', required: true, description: 'The actual input element.' }),
      createSlotEntry('contentBefore', { elementType: 'span', required: false, description: 'Content rendered before the input.' }),
      createSlotEntry('contentAfter', { elementType: 'span', required: false, description: 'Content rendered after the input.' }),
    ],
    stories: [
      createStoryEntry('Default', {
        description: 'A default Input.',
        code: "export const Default = () => <Input />;",
        renderCode: '<Input />',
        sourceFile: 'packages/react-input/stories/src/Input/InputDefault.stories.tsx',
        imports: ["import { Input } from '@fluentui/react-components'"],
      }),
    ],
    relatedComponents: ['Textarea', 'SearchBox', 'SpinButton'],
    additionalExports: ['inputClassNames', 'useInputStyles_unstable'],
  });

  const dialogComponent = createComponentEntry('Dialog', {
    category: 'feedback',
    packageName: '@fluentui/react-dialog',
    props: [
      createPropEntry('open', {
        type: 'boolean',
        description: 'Controls the open/closed state of the dialog.',
        source: 'DialogProps',
      }),
      createPropEntry('modalType', {
        type: "'modal' | 'non-modal' | 'alert'",
        defaultValue: "'modal'",
        description: 'The type of modal behavior.',
        source: 'DialogProps',
      }),
      createPropEntry('onOpenChange', {
        type: '(event: DialogOpenChangeEvent, data: DialogOpenChangeData) => void',
        description: 'Callback when the open state changes.',
        source: 'DialogProps',
      }),
    ],
    slots: [
      createSlotEntry('root', { elementType: 'div', required: true, description: 'The root dialog container.' }),
    ],
    stories: [
      createStoryEntry('Default', {
        description: 'A default Dialog.',
        code: "export const Default = () => (\n  <Dialog>\n    <DialogTrigger><Button>Open</Button></DialogTrigger>\n    <DialogSurface>\n      <DialogBody>\n        <DialogTitle>Title</DialogTitle>\n        <DialogContent>Content</DialogContent>\n        <DialogActions><Button>Close</Button></DialogActions>\n      </DialogBody>\n    </DialogSurface>\n  </Dialog>\n);",
        renderCode: '<Dialog>...</Dialog>',
        sourceFile: 'packages/react-dialog/stories/src/Dialog/DialogDefault.stories.tsx',
        imports: [
          "import { Dialog, DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions } from '@fluentui/react-components'",
          "import { Button } from '@fluentui/react-components'",
        ],
      }),
    ],
    relatedComponents: ['DialogTrigger', 'DialogSurface', 'DialogBody', 'DialogTitle', 'DialogContent', 'DialogActions'],
    additionalExports: ['dialogClassNames', 'useDialogStyles_unstable'],
  });

  const components = [buttonComponent, inputComponent, dialogComponent];

  // Compute realistic stats from the components
  const totalProps = components.reduce((sum, c) => sum + c.props.length, 0);
  const totalStories = components.reduce((sum, c) => sum + c.stories.length, 0);
  const categoryCounts: Record<string, number> = {};
  for (const c of components) {
    categoryCounts[c.category] = (categoryCounts[c.category] ?? 0) + 1;
  }

  return createFluentUISchema({
    components,
    stats: createSchemaStats({
      totalComponents: components.length,
      totalProps,
      totalStories,
      categoryCounts,
    }),
  });
}

/**
 * Create an enhanced test schema with LLM-enriched content.
 * Same 3 components as minimal but with enhanced data, plus a utility,
 * a foundation guide, a pattern, an enterprise guide, and a quick reference.
 */
export function createEnhancedTestSchema(): FluentUISchema {
  // Start from minimal and enhance each component
  const base = createMinimalTestSchema();

  // Enhance Button
  base.components[0].enhanced = createComponentEnhanced({
    description: 'Button triggers an action or event when activated. It is the most common interactive element in any UI.',
    whenToUse: 'Use Button for form submissions, dialog confirmations, toolbar actions, and navigation triggers. Choose from multiple appearances to create visual hierarchy.',
    bestPractices: {
      dos: [
        'Use clear, concise labels that describe the action',
        'Use primary appearance for the main action in a section',
        'Provide visual feedback for loading states',
      ],
      donts: [
        'Don\'t use buttons for navigation — use Link instead',
        'Don\'t disable buttons without explanation — use a Tooltip',
        'Don\'t use more than one primary button in a section',
      ],
    },
    accessibility: {
      requirements: 'Must have an accessible name (label text or aria-label). Must be keyboard operable.',
      keyboardSupport: [
        createKeyboardEntry('Enter', 'Activates the button'),
        createKeyboardEntry('Space', 'Activates the button'),
      ],
      ariaAttributes: ['aria-label', 'aria-pressed', 'aria-disabled', 'aria-expanded'],
      screenReaderBehavior: 'Announces as "button" role with the label text. Disabled state is announced.',
    },
    commonPatterns: [
      createPatternExample({
        name: 'Primary Action',
        description: 'Primary button for main form action',
        code: '<Button appearance="primary">Submit</Button>',
      }),
      createPatternExample({
        name: 'With Icon',
        description: 'Button with a leading icon',
        code: '<Button icon={<AddRegular />}>Add Item</Button>',
      }),
    ],
    stylingTips: 'Use tokens.colorBrandBackground for custom brand buttons. Override with makeStyles() and Griffel.',
    sourceHash: 'button-enhanced-hash',
    enhancedAt: '2025-06-01T12:00:00Z',
  });

  // Enhance Input
  base.components[1].enhanced = createComponentEnhanced({
    description: 'Input provides a single-line text field for user input. It supports various types including text, password, email, and number.',
    whenToUse: 'Use Input for any single-line text data entry. Pair with Field for labels and validation messages.',
    bestPractices: {
      dos: [
        'Always pair with a Field component for proper labeling',
        'Use the appropriate type attribute (email, password, etc.)',
        'Provide placeholder text as a hint, not a replacement for labels',
      ],
      donts: [
        'Don\'t use Input for multi-line text — use Textarea instead',
        'Don\'t rely solely on placeholder text for labeling',
      ],
    },
    accessibility: {
      requirements: 'Must have an associated label via Field or aria-label.',
      keyboardSupport: [
        createKeyboardEntry('Tab', 'Moves focus to the input'),
      ],
      ariaAttributes: ['aria-label', 'aria-required', 'aria-invalid', 'aria-describedby'],
      screenReaderBehavior: 'Announces as text input with its label and current value.',
    },
    commonPatterns: [
      createPatternExample({
        name: 'With Field',
        description: 'Input with proper labeling via Field',
        code: '<Field label="Name">\n  <Input />\n</Field>',
      }),
    ],
    stylingTips: 'Use appearance variants for different visual contexts. The underline appearance works well in dense forms.',
    sourceHash: 'input-enhanced-hash',
    enhancedAt: '2025-06-01T12:00:00Z',
  });

  // Enhance Dialog
  base.components[2].enhanced = createComponentEnhanced({
    description: 'Dialog displays a modal or non-modal overlay that requires user attention or interaction.',
    whenToUse: 'Use Dialog for confirmations, form dialogs, alerts, and any workflow that interrupts the main flow.',
    bestPractices: {
      dos: [
        'Always include a way to dismiss the dialog',
        'Use DialogTitle for a clear heading',
        'Focus the first interactive element on open',
      ],
      donts: [
        'Don\'t nest dialogs — use a single dialog with changing content',
        'Don\'t use non-modal for critical confirmations',
      ],
    },
    accessibility: {
      requirements: 'Must trap focus within the dialog when modal. Must have an accessible title.',
      keyboardSupport: [
        createKeyboardEntry('Escape', 'Closes the dialog (modal and non-modal)'),
        createKeyboardEntry('Tab', 'Moves focus through focusable elements within the dialog'),
      ],
      ariaAttributes: ['aria-modal', 'aria-labelledby', 'aria-describedby'],
      screenReaderBehavior: 'Announces as dialog role with the title. Focus trap ensures screen reader stays within dialog.',
    },
    commonPatterns: [
      createPatternExample({
        name: 'Confirmation Dialog',
        description: 'A simple confirmation dialog with accept/reject actions',
        code: '<Dialog>\n  <DialogSurface>\n    <DialogBody>\n      <DialogTitle>Confirm</DialogTitle>\n      <DialogContent>Are you sure?</DialogContent>\n      <DialogActions>\n        <Button appearance="primary">Yes</Button>\n        <Button>No</Button>\n      </DialogActions>\n    </DialogBody>\n  </DialogSurface>\n</Dialog>',
      }),
    ],
    stylingTips: 'Use DialogSurface for custom width. Leverage CSS grid in DialogBody for complex layouts.',
    sourceHash: 'dialog-enhanced-hash',
    enhancedAt: '2025-06-01T12:00:00Z',
  });

  // Add a utility package
  const positioningUtility = createUtilityEntry('Positioning', {
    packageName: '@fluentui/react-positioning',
    packageVersion: '9.15.1',
    stability: 'stable',
    exports: [
      createUtilityExport('usePositioning', 'hook', {
        description: 'Hook that provides positioning for floating elements.',
        parameters: [
          createParameterEntry('options', {
            type: 'PositioningOptions',
            required: true,
            description: 'Configuration for positioning behavior.',
          }),
        ],
        returnType: 'PositioningState',
      }),
      createUtilityExport('createArrowStyles', 'function', {
        description: 'Creates CSS styles for a positioning arrow element.',
        parameters: [
          createParameterEntry('options', {
            type: 'ArrowStylesOptions',
            required: false,
            description: 'Arrow style configuration.',
          }),
        ],
        returnType: 'GriffelStyle',
      }),
    ],
    enhanced: createUtilityEnhanced({
      description: 'Provides CSS-in-JS utilities for positioning floating UI elements like tooltips, popovers, and dropdowns.',
      whenToUse: 'Use when building custom positioned overlays. Most FluentUI overlay components use this internally.',
    }),
  });

  // Add a foundation guide
  const gettingStartedGuide = createGuideEntry('getting-started', {
    title: 'Getting Started with FluentUI v9',
    category: 'foundation',
    content: '# Getting Started\n\nFluentUI v9 is the latest version of Microsoft\'s React component library.\n\n## Installation\n\n```bash\nnpm install @fluentui/react-components\n```\n\n## Basic Setup\n\nWrap your app with FluentProvider.',
    codeExamples: [
      createGuideCodeExample({
        title: 'Installation',
        description: 'Install the main package',
        code: 'npm install @fluentui/react-components',
        language: 'bash',
      }),
      createGuideCodeExample({
        title: 'Basic App Setup',
        description: 'Wrap your app with FluentProvider',
        code: "import { FluentProvider, webLightTheme } from '@fluentui/react-components';\n\nconst App = () => (\n  <FluentProvider theme={webLightTheme}>\n    <YourApp />\n  </FluentProvider>\n);",
        language: 'tsx',
      }),
    ],
    referencedComponents: ['FluentProvider', 'Button'],
  });

  // Add a pattern
  const loginFormPattern = createPatternEntry('login-form', {
    title: 'Login Form Pattern',
    group: 'forms',
    content: '# Login Form\n\nA standard login form using FluentUI components.\n\nCombines Input, Field, Button, and Card for a clean login experience.',
    examples: [
      createPatternEntryExample({
        name: 'Basic Login',
        description: 'Simple email/password login form',
        code: '<Card>\n  <Field label="Email">\n    <Input type="email" />\n  </Field>\n  <Field label="Password">\n    <Input type="password" />\n  </Field>\n  <Button appearance="primary">Sign In</Button>\n</Card>',
        components: ['Card', 'Field', 'Input', 'Button'],
      }),
    ],
    referencedComponents: ['Card', 'Field', 'Input', 'Button'],
  });

  // Add an enterprise guide
  const appShellGuide = createGuideEntry('app-shell', {
    title: 'Application Shell Pattern',
    category: 'enterprise',
    content: '# Application Shell\n\nThe app shell pattern provides the outer frame of an enterprise application.\n\n## Structure\n\nUses Nav for sidebar, Breadcrumb for wayfinding, and Toolbar for actions.',
    codeExamples: [
      createGuideCodeExample({
        title: 'App Shell Layout',
        description: 'Basic application shell with sidebar navigation',
        code: '<div className={styles.shell}>\n  <Nav />\n  <main>\n    <Breadcrumb />\n    <Toolbar />\n    {children}\n  </main>\n</div>',
        language: 'tsx',
      }),
    ],
    referencedComponents: ['Nav', 'Breadcrumb', 'Toolbar'],
  });

  // Add a quick reference guide
  const quickRefGuide = createGuideEntry('component-cheatsheet', {
    title: 'Component Quick Reference',
    category: 'quick-reference',
    content: '# Component Cheatsheet\n\n## Buttons\n- Button: Standard button\n- CompoundButton: Button with secondary text\n\n## Forms\n- Input: Single-line text\n- Textarea: Multi-line text',
    codeExamples: [],
    referencedComponents: ['Button', 'CompoundButton', 'Input', 'Textarea'],
  });

  // Recompute stats for the enhanced schema
  const totalProps = base.components.reduce((sum, c) => sum + c.props.length, 0);
  const totalStories = base.components.reduce((sum, c) => sum + c.stories.length, 0);
  const categoryCounts: Record<string, number> = {};
  for (const c of base.components) {
    categoryCounts[c.category] = (categoryCounts[c.category] ?? 0) + 1;
  }

  return {
    ...base,
    sources: {
      fluentui: createSourceInfo(),
      contrib: createSourceInfo({
        repo: 'https://github.com/microsoft/fluentui-contrib',
        ref: 'main',
        commit: 'contrib-abc123',
      }),
    },
    utilities: [positioningUtility],
    foundation: [gettingStartedGuide],
    patterns: [loginFormPattern],
    enterprise: [appShellGuide],
    quickReference: [quickRefGuide],
    stats: createSchemaStats({
      totalComponents: base.components.length,
      totalUtilities: 1,
      totalContrib: 0,
      totalPreview: 0,
      totalProps,
      totalStories,
      categoryCounts,
    }),
  };
}
