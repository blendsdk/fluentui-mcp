/**
 * Unit tests for all scraper extractors:
 * - Props extractor (ts-morph based)
 * - Slots extractor (ts-morph based)
 * - API extractor fallback (regex based)
 *
 * Uses the mock-fluentui fixture directory with realistic .types.ts files.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { join, resolve } from 'node:path';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';

import { extractProps } from '../../../scripts/scraper/extractors/props-extractor.js';
import { extractSlots } from '../../../scripts/scraper/extractors/slots-extractor.js';
import {
  extractPropsFromApiMd,
  extractSlotsFromApiMd,
} from '../../../scripts/scraper/extractors/api-extractor-fallback.js';

// ============================================================================
// Constants
// ============================================================================

const MOCK_DIR = resolve(__dirname, '../fixtures/mock-fluentui');
const BUTTON_TYPES = join(
  MOCK_DIR,
  'packages/react-components/react-button/library/src/Button.types.ts',
);
const INPUT_TYPES = join(
  MOCK_DIR,
  'packages/react-components/react-input/library/src/Input.types.ts',
);
const DIALOG_TYPES = join(
  MOCK_DIR,
  'packages/react-components/react-dialog/library/src/Dialog.types.ts',
);
const BUTTON_API_MD = join(
  MOCK_DIR,
  'packages/react-components/react-button/library/etc/react-button.api.md',
);

const TEMP_DIR = resolve(__dirname, '../fixtures/.tmp-extractors-test');

// ============================================================================
// Setup & Teardown
// ============================================================================

beforeAll(() => {
  if (!existsSync(TEMP_DIR)) {
    mkdirSync(TEMP_DIR, { recursive: true });
  }
});

afterAll(() => {
  if (existsSync(TEMP_DIR)) {
    rmSync(TEMP_DIR, { recursive: true, force: true });
  }
});

// ============================================================================
// Props Extractor (ts-morph)
// ============================================================================

describe('extractProps — Button', () => {
  it('should extract all props from ButtonProps', () => {
    const props = extractProps(BUTTON_TYPES);

    expect(props.length).toBeGreaterThanOrEqual(5);

    const propNames = props.map((p) => p.name);
    expect(propNames).toContain('appearance');
    expect(propNames).toContain('size');
    expect(propNames).toContain('disabled');
    expect(propNames).toContain('disabledFocusable');
    expect(propNames).toContain('iconPosition');
    expect(propNames).toContain('shape');
  });

  it('should extract type information', () => {
    const props = extractProps(BUTTON_TYPES);
    const appearance = props.find((p) => p.name === 'appearance');

    expect(appearance).toBeDefined();
    expect(appearance!.type).toContain('primary');
    expect(appearance!.type).toContain('secondary');
  });

  it('should extract JSDoc descriptions', () => {
    const props = extractProps(BUTTON_TYPES);
    const appearance = props.find((p) => p.name === 'appearance');

    expect(appearance).toBeDefined();
    expect(appearance!.description).toBeTruthy();
    expect(appearance!.description.length).toBeGreaterThan(10);
  });

  it('should extract @default values from JSDoc', () => {
    const props = extractProps(BUTTON_TYPES);
    const appearance = props.find((p) => p.name === 'appearance');

    expect(appearance).toBeDefined();
    expect(appearance!.defaultValue).toBe("'secondary'");
  });

  it('should mark optional props as not required', () => {
    const props = extractProps(BUTTON_TYPES);

    // All ButtonProps are optional (have ?)
    for (const prop of props) {
      expect(prop.required).toBe(false);
    }
  });
});

describe('extractProps — Input', () => {
  it('should extract props from InputProps', () => {
    const props = extractProps(INPUT_TYPES);

    expect(props.length).toBeGreaterThanOrEqual(1);
    const propNames = props.map((p) => p.name);
    // Input should have at least size, appearance, type props
    expect(propNames.length).toBeGreaterThan(0);
  });
});

describe('extractProps — Dialog', () => {
  it('should extract props from DialogProps', () => {
    const props = extractProps(DIALOG_TYPES);

    expect(props.length).toBeGreaterThanOrEqual(1);
  });
});

describe('extractProps — edge cases', () => {
  it('should return empty array for non-existent file', () => {
    const props = extractProps('/non/existent/file.ts');
    expect(props).toEqual([]);
  });

  it('should return empty array for file with no Props types', () => {
    const testFile = join(TEMP_DIR, 'no-props.ts');
    writeFileSync(testFile, 'export const x = 1;\n');

    const props = extractProps(testFile);
    expect(props).toEqual([]);
  });

  it('should handle empty type literal', () => {
    const testFile = join(TEMP_DIR, 'empty-props.ts');
    writeFileSync(testFile, 'export type EmptyProps = {};\n');

    const props = extractProps(testFile);
    expect(props).toEqual([]);
  });

  it('should detect @deprecated props', () => {
    const testFile = join(TEMP_DIR, 'deprecated-props.ts');
    writeFileSync(
      testFile,
      `export type TestProps = {
  /** @deprecated Use newProp instead */
  oldProp?: string;
  newProp?: string;
};
`,
    );

    const props = extractProps(testFile);
    const oldProp = props.find((p) => p.name === 'oldProp');
    const newProp = props.find((p) => p.name === 'newProp');

    expect(oldProp).toBeDefined();
    expect(oldProp!.deprecated).toBe(true);
    expect(newProp).toBeDefined();
    expect(newProp!.deprecated).toBeUndefined();
  });

  it('should handle required props (no question mark)', () => {
    const testFile = join(TEMP_DIR, 'required-props.ts');
    writeFileSync(
      testFile,
      `export type RequiredProps = {
  /** A required prop */
  name: string;
  /** An optional prop */
  label?: string;
};
`,
    );

    const props = extractProps(testFile);
    const name = props.find((p) => p.name === 'name');
    const label = props.find((p) => p.name === 'label');

    expect(name!.required).toBe(true);
    expect(label!.required).toBe(false);
  });
});

// ============================================================================
// Slots Extractor (ts-morph)
// ============================================================================

describe('extractSlots — Button', () => {
  it('should extract all slots from ButtonSlots', () => {
    const slots = extractSlots(BUTTON_TYPES);

    expect(slots.length).toBe(2);

    const slotNames = slots.map((s) => s.name);
    expect(slotNames).toContain('root');
    expect(slotNames).toContain('icon');
  });

  it('should extract element types from Slot<> generic', () => {
    const slots = extractSlots(BUTTON_TYPES);
    const root = slots.find((s) => s.name === 'root');
    const icon = slots.find((s) => s.name === 'icon');

    expect(root!.type).toBe('button');
    expect(icon!.type).toBe('span');
  });

  it('should detect required slots (NonNullable)', () => {
    const slots = extractSlots(BUTTON_TYPES);
    const root = slots.find((s) => s.name === 'root');
    const icon = slots.find((s) => s.name === 'icon');

    expect(root!.required).toBe(true);
    expect(icon!.required).toBe(false);
  });
});

describe('extractSlots — Input', () => {
  it('should extract slots from InputSlots', () => {
    const slots = extractSlots(INPUT_TYPES);

    expect(slots.length).toBeGreaterThanOrEqual(1);

    const root = slots.find((s) => s.name === 'root');
    expect(root).toBeDefined();
    expect(root!.required).toBe(true);
  });
});

describe('extractSlots — edge cases', () => {
  it('should return empty array for non-existent file', () => {
    const slots = extractSlots('/non/existent/file.ts');
    expect(slots).toEqual([]);
  });

  it('should return empty array for file with no Slots types', () => {
    const testFile = join(TEMP_DIR, 'no-slots.ts');
    writeFileSync(testFile, 'export const x = 1;\n');

    const slots = extractSlots(testFile);
    expect(slots).toEqual([]);
  });

  it('should handle component references in Slot<>', () => {
    const testFile = join(TEMP_DIR, 'component-slot.ts');
    writeFileSync(
      testFile,
      `type Slot<T> = T;
export type TestSlots = {
  root: NonNullable<Slot<'div'>>;
  content?: Slot<'span'>;
};
`,
    );

    const slots = extractSlots(testFile);
    expect(slots.length).toBe(2);
    expect(slots.find((s) => s.name === 'root')!.type).toBe('div');
    expect(slots.find((s) => s.name === 'content')!.type).toBe('span');
  });
});

// ============================================================================
// API Extractor Fallback (regex)
// ============================================================================

describe('extractPropsFromApiMd', () => {
  it('should extract props from .api.md file', () => {
    const props = extractPropsFromApiMd(BUTTON_API_MD);

    expect(props.length).toBeGreaterThanOrEqual(4);

    const propNames = props.map((p) => p.name);
    expect(propNames).toContain('appearance');
    expect(propNames).toContain('size');
    expect(propNames).toContain('disabled');
  });

  it('should detect optional vs required props', () => {
    const props = extractPropsFromApiMd(BUTTON_API_MD);
    const appearance = props.find((p) => p.name === 'appearance');

    expect(appearance).toBeDefined();
    expect(appearance!.required).toBe(false);
  });

  it('should extract type strings', () => {
    const props = extractPropsFromApiMd(BUTTON_API_MD);
    const appearance = props.find((p) => p.name === 'appearance');

    expect(appearance!.type).toContain('primary');
  });

  it('should return empty array for non-existent file', () => {
    const props = extractPropsFromApiMd('/non/existent/file.api.md');
    expect(props).toEqual([]);
  });

  it('should handle custom api.md content', () => {
    const testFile = join(TEMP_DIR, 'test.api.md');
    writeFileSync(
      testFile,
      `## API Report

\`\`\`ts
export type CustomProps = {
  value: string;
  onChange?: (value: string) => void;
};
\`\`\`
`,
    );

    const props = extractPropsFromApiMd(testFile);
    expect(props.length).toBe(2);
    expect(props.find((p) => p.name === 'value')!.required).toBe(true);
    expect(props.find((p) => p.name === 'onChange')!.required).toBe(false);
  });
});

describe('extractSlotsFromApiMd', () => {
  it('should extract slots from .api.md file', () => {
    const slots = extractSlotsFromApiMd(BUTTON_API_MD);

    expect(slots.length).toBe(2);

    const root = slots.find((s) => s.name === 'root');
    const icon = slots.find((s) => s.name === 'icon');

    expect(root).toBeDefined();
    expect(root!.type).toBe('button');
    expect(root!.required).toBe(true);

    expect(icon).toBeDefined();
    expect(icon!.type).toBe('span');
    expect(icon!.required).toBe(false);
  });

  it('should return empty array for non-existent file', () => {
    const slots = extractSlotsFromApiMd('/non/existent/file.api.md');
    expect(slots).toEqual([]);
  });

  it('should handle custom slots', () => {
    const testFile = join(TEMP_DIR, 'test-slots.api.md');
    writeFileSync(
      testFile,
      `export type CardSlots = {
  root: NonNullable<Slot<'div'>>;
  header?: Slot<'div'>;
  footer?: Slot<'div'>;
};
`,
    );

    const slots = extractSlotsFromApiMd(testFile);
    expect(slots.length).toBe(3);
    expect(slots.find((s) => s.name === 'root')!.required).toBe(true);
    expect(slots.find((s) => s.name === 'header')!.required).toBe(false);
  });
});
