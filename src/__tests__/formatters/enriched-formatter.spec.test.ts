/**
 * Spec tests for Phase 7 — surfacing the new enriched schema fields in the
 * markdown formatters (ST-27..ST-31).
 *
 * These assert that the new optional ComponentEnhanced/UtilityEnhanced fields
 * (propGuidance, antiPatterns, performanceNotes, themingNotes,
 * compositionExamples, relatedPatterns, edgeCases) and the guide/pattern
 * additions (keyTakeaways, pitfalls, accessibilityNotes,
 * whenToUse/whenNotToUse) render conditionally — present when populated, and
 * fully omitted (no empty headers, no errors) when absent.
 *
 * @module tests/formatters/enriched-formatter.spec
 */

import { describe, it, expect } from 'vitest';
import { formatFull } from '../../formatters/component-formatter.js';
import { formatPropsTable } from '../../formatters/props-formatter.js';
import { formatGuide } from '../../formatters/guide-formatter.js';
import { formatPattern } from '../../formatters/pattern-formatter.js';
import {
  createComponentEntry,
  createComponentEnhanced,
  createGuideEntry,
  createPatternEntry,
} from '../fixtures/helpers.js';

/** A component enhanced with the full set of new enrichment fields. */
function fullyEnrichedComponent() {
  return createComponentEntry('Button', {
    enhanced: createComponentEnhanced({
      propGuidance: [
        {
          prop: 'appearance',
          guidance: 'Use primary for the main call to action.',
          example: '<Button appearance="primary">Save</Button>',
        },
      ],
      antiPatterns: [
        {
          title: 'Buttons for navigation',
          problem: 'Using a Button to navigate between pages.',
          solution: 'Use a Link styled as a button instead.',
          code: '<Link as="button">Go</Link>',
        },
      ],
      performanceNotes: 'Memoize onClick handlers to avoid re-renders.',
      themingNotes: 'Customise with tokens.colorBrandBackground.',
      compositionExamples: [
        {
          name: 'With icon slot',
          description: 'Override the icon slot.',
          code: '<Button icon={<AddRegular />}>Add</Button>',
        },
      ],
      relatedPatterns: ['login-form', 'toolbar'],
      edgeCases: [
        'Disabled buttons do not fire onClick.',
        'Icon-only buttons need an aria-label.',
      ],
    }),
  });
}

describe('ST-27: component formatter renders each new section when present', () => {
  it('renders prop guidance, composition, anti-patterns, performance, theming, edge cases, related patterns', () => {
    const output = formatFull(fullyEnrichedComponent());

    // Prop Guidance
    expect(output).toContain('## Prop Guidance');
    expect(output).toContain('appearance');
    expect(output).toContain('Use primary for the main call to action.');

    // Composition Examples
    expect(output).toContain('## Composition Examples');
    expect(output).toContain('With icon slot');

    // Anti-Patterns
    expect(output).toContain('## Anti-Patterns');
    expect(output).toContain('Buttons for navigation');
    expect(output).toContain('❌');
    expect(output).toContain('✅');
    expect(output).toContain('Use a Link styled as a button instead.');

    // Performance
    expect(output).toContain('## Performance');
    expect(output).toContain('Memoize onClick handlers');

    // Theming & Tokens
    expect(output).toContain('## Theming');
    expect(output).toContain('tokens.colorBrandBackground');

    // Edge Cases
    expect(output).toContain('## Edge Cases');
    expect(output).toContain('Icon-only buttons need an aria-label.');

    // Related Patterns
    expect(output).toContain('## Related Patterns');
    expect(output).toContain('login-form');
  });
});

describe('ST-28: component formatter omits new sections when absent', () => {
  it('renders no empty headers and does not throw for a plain enhanced component', () => {
    // createComponentEnhanced provides none of the new optional fields.
    const component = createComponentEntry('Plain', {
      enhanced: createComponentEnhanced(),
    });
    const output = formatFull(component);

    expect(output).not.toContain('## Prop Guidance');
    expect(output).not.toContain('## Composition Examples');
    expect(output).not.toContain('## Anti-Patterns');
    expect(output).not.toContain('## Performance');
    expect(output).not.toContain('## Theming');
    expect(output).not.toContain('## Edge Cases');
    expect(output).not.toContain('## Related Patterns');
  });

  it('omits new sections entirely for an un-enhanced component', () => {
    const component = createComponentEntry('Bare', { enhanced: undefined });
    const output = formatFull(component);
    expect(output).not.toContain('## Prop Guidance');
    expect(output).not.toContain('## Anti-Patterns');
    expect(output).not.toContain('## Edge Cases');
  });
});

describe('ST-29: props formatter surfaces matching prop guidance', () => {
  it('appends guidance under the matching prop', () => {
    const component = createComponentEntry('Button', {
      props: [
        {
          name: 'appearance',
          type: "'primary' | 'secondary'",
          required: false,
          description: 'Visual style.',
          deprecated: false,
          inherited: false,
          source: 'ButtonProps',
        },
      ],
      enhanced: createComponentEnhanced({
        propGuidance: [
          {
            prop: 'appearance',
            guidance: 'Pick primary for the dominant action.',
          },
        ],
      }),
    });

    const output = formatPropsTable(component);
    expect(output).toContain('appearance');
    expect(output).toContain('Pick primary for the dominant action.');
  });

  it('omits guidance notes when there is no propGuidance', () => {
    const component = createComponentEntry('Button');
    const output = formatPropsTable(component);
    expect(output).not.toContain('Pick primary for the dominant action.');
  });
});

describe('ST-30: guide formatter renders key takeaways, pitfalls, accessibility', () => {
  it('renders the new guide fields when present', () => {
    const guide = createGuideEntry('theming', {
      keyTakeaways: ['Use design tokens.', 'Prefer themes over hard-coded colours.'],
      pitfalls: ['Hard-coding hex colours breaks dark mode.'],
      accessibilityNotes: 'Ensure contrast ratios meet WCAG AA.',
    });
    const output = formatGuide(guide);
    expect(output).toContain('## Key Takeaways');
    expect(output).toContain('Use design tokens.');
    expect(output).toContain('## Pitfalls');
    expect(output).toContain('Hard-coding hex colours breaks dark mode.');
    expect(output).toContain('## Accessibility');
    expect(output).toContain('WCAG AA');
  });

  it('omits the new guide sections when absent', () => {
    const guide = createGuideEntry('theming');
    const output = formatGuide(guide);
    expect(output).not.toContain('## Key Takeaways');
    expect(output).not.toContain('## Pitfalls');
  });
});

describe('ST-31: pattern formatter renders whenToUse, whenNotToUse, pitfalls, accessibility', () => {
  it('renders the new pattern fields when present', () => {
    const pattern = createPatternEntry('login-form', {
      whenToUse: 'Use for authenticating returning users.',
      whenNotToUse: 'Avoid for single sign-on only flows.',
      accessibilityNotes: 'Associate every input with a label.',
      pitfalls: ['Do not disable the submit button while typing.'],
    });
    const output = formatPattern(pattern);
    expect(output).toContain('## When to Use');
    expect(output).toContain('authenticating returning users');
    expect(output).toContain('## When Not to Use');
    expect(output).toContain('single sign-on');
    expect(output).toContain('## Accessibility');
    expect(output).toContain('Associate every input with a label.');
    expect(output).toContain('## Pitfalls');
    expect(output).toContain('Do not disable the submit button while typing.');
  });

  it('omits the new pattern sections when absent', () => {
    const pattern = createPatternEntry('login-form');
    const output = formatPattern(pattern);
    expect(output).not.toContain('## When to Use');
    expect(output).not.toContain('## When Not to Use');
    expect(output).not.toContain('## Pitfalls');
  });
});
