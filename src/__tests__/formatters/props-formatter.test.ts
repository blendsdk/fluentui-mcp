/**
 * Tests for the props/slots markdown formatters.
 *
 * @module tests/formatters/props-formatter
 */

import { describe, it, expect } from 'vitest';
import {
  formatPropsTable,
  formatSlotsTable,
} from '../../formatters/props-formatter.js';
import {
  createComponentEntry,
  createPropEntry,
  createSlotEntry,
} from '../fixtures/helpers.js';

describe('formatPropsTable', () => {
  it('renders a markdown table with the expected header and divider', () => {
    const component = createComponentEntry('Button');
    const output = formatPropsTable(component);

    expect(output).toContain('| Prop | Type | Default | Required | Description |');
    expect(output).toContain('|------|------|---------|----------|-------------|');
  });

  it('renders one row per prop', () => {
    const component = createComponentEntry('Button', {
      props: [
        createPropEntry('appearance'),
        createPropEntry('size'),
        createPropEntry('disabled'),
      ],
    });
    const output = formatPropsTable(component);
    const rows = output.split('\n').filter((l) => l.startsWith('| `'));
    expect(rows).toHaveLength(3);
  });

  it('sorts props alphabetically by name', () => {
    const component = createComponentEntry('Button', {
      props: [
        createPropEntry('size'),
        createPropEntry('appearance'),
        createPropEntry('disabled'),
      ],
    });
    const output = formatPropsTable(component);
    const appearanceIdx = output.indexOf('`appearance`');
    const disabledIdx = output.indexOf('`disabled`');
    const sizeIdx = output.indexOf('`size`');
    expect(appearanceIdx).toBeLessThan(disabledIdx);
    expect(disabledIdx).toBeLessThan(sizeIdx);
  });

  it('escapes pipe characters in union types', () => {
    const component = createComponentEntry('Button', {
      props: [
        createPropEntry('appearance', { type: "'primary' | 'secondary'" }),
      ],
    });
    const output = formatPropsTable(component);
    expect(output).toContain("'primary' \\| 'secondary'");
  });

  it('renders an em dash for missing default values', () => {
    const component = createComponentEntry('Button', {
      props: [createPropEntry('disabled', { type: 'boolean' })],
    });
    const output = formatPropsTable(component);
    // The default cell should be the em dash placeholder.
    expect(output).toMatch(/\| `boolean` \| — \| No \|/);
  });

  it('renders the default value when present', () => {
    const component = createComponentEntry('Button', {
      props: [
        createPropEntry('size', { type: 'string', defaultValue: "'medium'" }),
      ],
    });
    const output = formatPropsTable(component);
    expect(output).toContain("`'medium'`");
  });

  it('marks required props as "Yes"', () => {
    const component = createComponentEntry('Button', {
      props: [createPropEntry('value', { required: true })],
    });
    const output = formatPropsTable(component);
    expect(output).toMatch(/\| Yes \|/);
  });

  it('annotates deprecated props in the description', () => {
    const component = createComponentEntry('Button', {
      props: [
        createPropEntry('legacyProp', {
          deprecated: true,
          deprecationMessage: 'Use newProp instead.',
        }),
      ],
    });
    const output = formatPropsTable(component);
    expect(output).toContain('**Deprecated:** Use newProp instead.');
  });

  it('returns an empty-state notice when there are no props', () => {
    const component = createComponentEntry('Button', { props: [] });
    expect(formatPropsTable(component)).toBe('_No documented props._');
  });

  it('collapses newlines in descriptions to keep cells on one row', () => {
    const component = createComponentEntry('Button', {
      props: [
        createPropEntry('appearance', {
          description: 'Line one.\nLine two.',
        }),
      ],
    });
    const output = formatPropsTable(component);
    expect(output).toContain('Line one. Line two.');
    // The data row must remain a single line.
    const dataRows = output.split('\n').filter((l) => l.startsWith('| `'));
    expect(dataRows).toHaveLength(1);
  });
});

describe('formatSlotsTable', () => {
  it('renders a markdown table with the expected header', () => {
    const component = createComponentEntry('Button', {
      slots: [createSlotEntry('root', { elementType: 'button' })],
    });
    const output = formatSlotsTable(component);
    expect(output).toContain('| Slot | Element | Required | Description |');
  });

  it('combines the element type with alternative types', () => {
    const component = createComponentEntry('Button', {
      slots: [
        createSlotEntry('root', {
          elementType: 'button',
          alternativeTypes: ['a'],
        }),
      ],
    });
    const output = formatSlotsTable(component);
    expect(output).toContain('button \\| a');
  });

  it('marks required slots as "Yes" and optional as "No"', () => {
    const component = createComponentEntry('Button', {
      slots: [
        createSlotEntry('root', { elementType: 'button', required: true }),
        createSlotEntry('icon', { elementType: 'span', required: false }),
      ],
    });
    const output = formatSlotsTable(component);
    const rootRow = output.split('\n').find((l) => l.includes('`root`'));
    const iconRow = output.split('\n').find((l) => l.includes('`icon`'));
    expect(rootRow).toContain('| Yes |');
    expect(iconRow).toContain('| No |');
  });

  it('returns an empty string when there are no slots', () => {
    const component = createComponentEntry('Button', { slots: [] });
    expect(formatSlotsTable(component)).toBe('');
  });
});
