/**
 * Tests for the guide and pattern markdown formatters.
 *
 * @module tests/formatters/guide-formatter
 */

import { describe, it, expect } from 'vitest';
import {
  formatGuide,
  formatGuideSummary,
} from '../../formatters/guide-formatter.js';
import {
  formatPattern,
  formatPatternSummary,
} from '../../formatters/pattern-formatter.js';
import {
  createGuideEntry,
  createGuideCodeExample,
  createPatternEntry,
  createPatternEntryExample,
} from '../fixtures/helpers.js';

describe('formatGuide', () => {
  it('renders the title and category header', () => {
    const guide = createGuideEntry('theming', {
      title: 'Theming Guide',
      category: 'foundation',
    });
    const output = formatGuide(guide);
    expect(output).toContain('# Theming Guide');
    expect(output).toContain('> **Category**: foundation');
  });

  it('includes the authored content body', () => {
    const guide = createGuideEntry('theming', {
      content: '# Theming\n\nThis is the body content.',
    });
    const output = formatGuide(guide);
    expect(output).toContain('This is the body content.');
  });

  it('appends structured code examples under an Examples heading', () => {
    const guide = createGuideEntry('setup', {
      codeExamples: [
        createGuideCodeExample({
          title: 'Install',
          code: 'npm i @fluentui/react-components',
          language: 'bash',
        }),
      ],
    });
    const output = formatGuide(guide);
    expect(output).toContain('## Examples');
    expect(output).toContain('### Install');
    expect(output).toContain('```bash');
    expect(output).toContain('npm i @fluentui/react-components');
  });

  it('omits examples when includeExamples is false', () => {
    const guide = createGuideEntry('setup', {
      codeExamples: [createGuideCodeExample({ title: 'Install' })],
    });
    const output = formatGuide(guide, false);
    expect(output).not.toContain('## Examples');
  });

  it('lists referenced components when present', () => {
    const guide = createGuideEntry('setup', {
      referencedComponents: ['FluentProvider', 'Button'],
    });
    const output = formatGuide(guide);
    expect(output).toContain('**Referenced components**: FluentProvider, Button');
  });

  it('omits the referenced footer when there are none', () => {
    const guide = createGuideEntry('setup', { referencedComponents: [] });
    const output = formatGuide(guide);
    expect(output).not.toContain('**Referenced components**');
  });
});

describe('formatGuideSummary', () => {
  it('renders a one-line summary with title and id', () => {
    const guide = createGuideEntry('theming', { title: 'Theming Guide' });
    const output = formatGuideSummary(guide);
    expect(output).toContain('**Theming Guide**');
    expect(output).toContain('`theming`');
  });
});

describe('formatPattern', () => {
  it('renders the title and group header', () => {
    const pattern = createPatternEntry('login-form', {
      title: 'Login Form',
      group: 'forms',
    });
    const output = formatPattern(pattern);
    expect(output).toContain('# Login Form');
    expect(output).toContain('> **Group**: forms');
  });

  it('includes the authored content body', () => {
    const pattern = createPatternEntry('login-form', {
      content: '# Login\n\nA login form pattern.',
    });
    const output = formatPattern(pattern);
    expect(output).toContain('A login form pattern.');
  });

  it('renders examples with their used components', () => {
    const pattern = createPatternEntry('login-form', {
      examples: [
        createPatternEntryExample({
          name: 'Basic Login',
          code: '<Form />',
          components: ['Input', 'Button'],
        }),
      ],
    });
    const output = formatPattern(pattern);
    expect(output).toContain('## Examples');
    expect(output).toContain('### Basic Login');
    expect(output).toContain('**Uses**: Input, Button');
    expect(output).toContain('```tsx');
  });

  it('lists referenced components', () => {
    const pattern = createPatternEntry('login-form', {
      referencedComponents: ['Card', 'Field', 'Input', 'Button'],
    });
    const output = formatPattern(pattern);
    expect(output).toContain('**Referenced components**: Card, Field, Input, Button');
  });
});

describe('formatPatternSummary', () => {
  it('renders a one-line summary with title, id, and group', () => {
    const pattern = createPatternEntry('login-form', {
      title: 'Login Form',
      group: 'forms',
    });
    const output = formatPatternSummary(pattern);
    expect(output).toContain('**Login Form**');
    expect(output).toContain('`login-form`');
    expect(output).toContain('group: forms');
  });
});
