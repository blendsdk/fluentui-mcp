/**
 * Tests for the component markdown formatters (full page, summary, examples)
 * and, by composition, the story formatter.
 *
 * @module tests/formatters/component-formatter
 */

import { describe, it, expect } from 'vitest';
import {
  formatFull,
  formatSummary,
  formatExamples,
} from '../../formatters/component-formatter.js';
import {
  formatStories,
  formatSingleStory,
} from '../../formatters/story-formatter.js';
import {
  createComponentEntry,
  createComponentEnhanced,
  createStoryEntry,
  createEnhancedTestSchema,
} from '../fixtures/helpers.js';

/** The enhanced Button from the shared fixture schema. */
function enhancedButton() {
  return createEnhancedTestSchema().components[0];
}

describe('formatFull', () => {
  it('renders the header with package, import, category, and stability', () => {
    const output = formatFull(enhancedButton());
    expect(output).toContain('# Button');
    expect(output).toContain('> **Package**: `@fluentui/react-button`');
    expect(output).toContain('> **Import**:');
    expect(output).toContain('> **Category**: buttons');
    expect(output).toContain('> **Stability**: stable');
  });

  it('includes an Overview section from the enhanced description', () => {
    const output = formatFull(enhancedButton());
    expect(output).toContain('## Overview');
    expect(output).toContain('Button triggers an action');
    expect(output).toContain('**When to use**:');
  });

  it('includes a Props Reference section with a table', () => {
    const output = formatFull(enhancedButton());
    expect(output).toContain('## Props Reference');
    expect(output).toContain('| Prop | Type | Default | Required | Description |');
  });

  it('includes a Slots subsection when slots exist', () => {
    const output = formatFull(enhancedButton());
    expect(output).toContain('### Slots');
    expect(output).toContain('| Slot | Element | Required | Description |');
  });

  it('includes an Examples section from stories', () => {
    const output = formatFull(enhancedButton());
    expect(output).toContain('## Examples');
    expect(output).toContain('```tsx');
  });

  it('includes Best Practices with dos and donts', () => {
    const output = formatFull(enhancedButton());
    expect(output).toContain('## Best Practices');
    expect(output).toContain("### ✅ Do's");
    expect(output).toContain("### ❌ Don'ts");
  });

  it('includes an Accessibility section with a keyboard table', () => {
    const output = formatFull(enhancedButton());
    expect(output).toContain('## Accessibility');
    expect(output).toContain('| Key | Action |');
    expect(output).toContain('`Enter`');
    expect(output).toContain('**ARIA**:');
    expect(output).toContain('**Screen Reader**:');
  });

  it('includes a Styling section from enhanced tips', () => {
    const output = formatFull(enhancedButton());
    expect(output).toContain('## Styling');
  });

  it('includes a See Also section listing related components', () => {
    const output = formatFull(enhancedButton());
    expect(output).toContain('## See Also');
    expect(output).toContain('- CompoundButton');
  });

  it('omits enhanced-only sections for an un-enhanced component', () => {
    const component = createComponentEntry('Plain', { enhanced: undefined });
    const output = formatFull(component);
    expect(output).toContain('## Overview');
    expect(output).toContain('## Props Reference');
    expect(output).not.toContain('## Best Practices');
    expect(output).not.toContain('## Accessibility');
    expect(output).not.toContain('## Styling');
  });

  it('renders a deprecation warning for deprecated components', () => {
    const component = createComponentEntry('OldThing', {
      deprecated: true,
      deprecationMessage: 'Use NewThing instead.',
    });
    const output = formatFull(component);
    expect(output).toContain('⚠️ **Deprecated**');
    expect(output).toContain('Use NewThing instead.');
  });

  it('omits the Examples section when there are no stories', () => {
    const component = createComponentEntry('NoStories', { stories: [] });
    const output = formatFull(component);
    expect(output).not.toContain('## Examples');
  });
});

describe('formatSummary', () => {
  it('produces a one-line summary with name and category', () => {
    const output = formatSummary(enhancedButton());
    expect(output).toContain('**Button**');
    expect(output).toContain('(buttons)');
  });

  it('uses the first sentence of the enhanced description', () => {
    const component = createComponentEntry('Button', {
      enhanced: createComponentEnhanced({
        description: 'First sentence here. Second sentence ignored.',
      }),
    });
    const output = formatSummary(component);
    expect(output).toContain('First sentence here.');
    expect(output).not.toContain('Second sentence ignored.');
  });

  it('falls back to the package name when not enhanced', () => {
    const component = createComponentEntry('Plain', {
      packageName: '@fluentui/react-plain',
      enhanced: undefined,
    });
    const output = formatSummary(component);
    expect(output).toContain('@fluentui/react-plain');
  });
});

describe('formatExamples', () => {
  it('renders an examples heading and story code blocks', () => {
    const output = formatExamples(enhancedButton());
    expect(output).toContain('# Button Examples');
    expect(output).toContain('```tsx');
  });

  it('includes enhanced common patterns', () => {
    const output = formatExamples(enhancedButton());
    expect(output).toContain('## Primary Action');
    expect(output).toContain('## With Icon');
  });

  it('renders an empty-state notice when there are no examples', () => {
    const component = createComponentEntry('Empty', {
      stories: [],
      enhanced: undefined,
    });
    const output = formatExamples(component);
    expect(output).toContain('_No examples available._');
  });
});

describe('formatStories / formatSingleStory', () => {
  it('renders a single story with heading, description, and code block', () => {
    const story = createStoryEntry('Default', {
      description: 'A default example.',
      code: 'export const Default = () => <Button />;',
    });
    const output = formatSingleStory(story);
    expect(output).toContain('### Default');
    expect(output).toContain('A default example.');
    expect(output).toContain('```tsx');
    expect(output).toContain('export const Default');
  });

  it('respects a custom heading level', () => {
    const story = createStoryEntry('Default');
    const output = formatSingleStory(story, 2);
    expect(output.startsWith('## Default')).toBe(true);
  });

  it('falls back to renderCode when full code is missing', () => {
    const story = createStoryEntry('Default', {
      code: '',
      renderCode: '<Button />',
    });
    const output = formatSingleStory(story);
    expect(output).toContain('<Button />');
  });

  it('returns an empty string for a story with no code', () => {
    const story = createStoryEntry('Empty', { code: '', renderCode: '' });
    expect(formatSingleStory(story)).toBe('');
  });

  it('joins multiple stories with blank lines', () => {
    const component = createComponentEntry('Button', {
      stories: [
        createStoryEntry('Default', { code: 'a' }),
        createStoryEntry('Variant', { code: 'b' }),
      ],
    });
    const output = formatStories(component);
    expect(output).toContain('### Default');
    expect(output).toContain('### Variant');
  });

  it('returns an empty string when there are no stories', () => {
    const component = createComponentEntry('Button', { stories: [] });
    expect(formatStories(component)).toBe('');
  });
});
