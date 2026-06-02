/**
 * Unit tests for stories extractor, defaults extractor, and utility extractor.
 *
 * Uses mock-fluentui fixture directory with realistic .stories.tsx and
 * use*.ts hook files.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { join, resolve } from 'node:path';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';

import {
  extractStories,
  extractStoriesFromFile,
} from '../../../scripts/scraper/extractors/stories-extractor.js';
import { extractDefaults } from '../../../scripts/scraper/extractors/defaults-extractor.js';
import { extractUtilityExports } from '../../../scripts/scraper/extractors/utility-extractor.js';

// ============================================================================
// Constants
// ============================================================================

const MOCK_DIR = resolve(__dirname, '../fixtures/mock-fluentui');
const BUTTON_STORIES_DIR = join(
  MOCK_DIR,
  'packages/react-components/react-button/stories/src/Button',
);
const DIALOG_STORIES_DIR = join(
  MOCK_DIR,
  'packages/react-components/react-dialog/stories/src/Dialog',
);
const INPUT_STORIES_DIR = join(
  MOCK_DIR,
  'packages/react-components/react-input/stories/src/Input',
);
const BUTTON_HOOK = join(
  MOCK_DIR,
  'packages/react-components/react-button/library/src/useButton.ts',
);
const INPUT_HOOK = join(
  MOCK_DIR,
  'packages/react-components/react-input/library/src/useInput.ts',
);
const DIALOG_HOOK = join(
  MOCK_DIR,
  'packages/react-components/react-dialog/library/src/useDialog.ts',
);

const TEMP_DIR = resolve(__dirname, '../fixtures/.tmp-stories-test');

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
// Stories Extractor — Directory scanning
// ============================================================================

describe('extractStories — Button directory', () => {
  it('should find stories from all .stories.tsx files in the directory', () => {
    const stories = extractStories(BUTTON_STORIES_DIR);

    // Should find Default and Appearance stories from 2 files
    expect(stories.length).toBeGreaterThanOrEqual(2);

    const names = stories.map((s) => s.name);
    expect(names).toContain('Default');
    expect(names).toContain('Appearance');
  });

  it('should extract import statements', () => {
    const stories = extractStories(BUTTON_STORIES_DIR);
    const defaultStory = stories.find((s) => s.name === 'Default');

    expect(defaultStory).toBeDefined();
    expect(defaultStory!.imports.length).toBeGreaterThan(0);
    expect(defaultStory!.imports.some((i) => i.includes('react'))).toBe(true);
  });

  it('should extract JSDoc descriptions', () => {
    const stories = extractStories(BUTTON_STORIES_DIR);
    const defaultStory = stories.find((s) => s.name === 'Default');

    expect(defaultStory).toBeDefined();
    expect(defaultStory!.description.length).toBeGreaterThan(0);
  });

  it('should extract render code', () => {
    const stories = extractStories(BUTTON_STORIES_DIR);
    const defaultStory = stories.find((s) => s.name === 'Default');

    expect(defaultStory).toBeDefined();
    expect(defaultStory!.renderCode).toBeTruthy();
    expect(defaultStory!.renderCode.length).toBeGreaterThan(0);
  });

  it('should include full code with imports', () => {
    const stories = extractStories(BUTTON_STORIES_DIR);
    const defaultStory = stories.find((s) => s.name === 'Default');

    expect(defaultStory).toBeDefined();
    expect(defaultStory!.code).toContain('import');
    expect(defaultStory!.code).toContain('export const Default');
  });
});

describe('extractStories — Dialog directory', () => {
  it('should find stories from Dialog directory', () => {
    const stories = extractStories(DIALOG_STORIES_DIR);

    expect(stories.length).toBeGreaterThanOrEqual(1);
    expect(stories.some((s) => s.name === 'Default')).toBe(true);
  });
});

describe('extractStories — Input directory', () => {
  it('should find stories from Input directory', () => {
    const stories = extractStories(INPUT_STORIES_DIR);

    expect(stories.length).toBeGreaterThanOrEqual(1);
    expect(stories.some((s) => s.name === 'Default')).toBe(true);
  });
});

// ============================================================================
// Stories Extractor — Single file
// ============================================================================

describe('extractStoriesFromFile', () => {
  it('should extract stories from a single file', () => {
    const filePath = join(BUTTON_STORIES_DIR, 'ButtonDefault.stories.tsx');
    const stories = extractStoriesFromFile(filePath);

    expect(stories.length).toBe(1);
    expect(stories[0]!.name).toBe('Default');
  });

  it('should return empty array for non-existent file', () => {
    const stories = extractStoriesFromFile('/non/existent/file.stories.tsx');
    expect(stories).toEqual([]);
  });

  it('should skip meta/default exports', () => {
    const testFile = join(TEMP_DIR, 'WithMeta.stories.tsx');
    writeFileSync(
      testFile,
      `import * as React from 'react';

export const meta = { title: 'Test' };

/**
 * A test story.
 */
export const Default = () => <div>Test</div>;
`,
    );

    const stories = extractStoriesFromFile(testFile);

    expect(stories.length).toBe(1);
    expect(stories[0]!.name).toBe('Default');
    // meta should be skipped
    expect(stories.some((s) => s.name === 'meta')).toBe(false);
  });

  it('should handle multiple exports in one file', () => {
    const testFile = join(TEMP_DIR, 'Multi.stories.tsx');
    writeFileSync(
      testFile,
      `import * as React from 'react';

/**
 * First story.
 */
export const Primary = () => <button>Primary</button>;

/**
 * Second story.
 */
export const Secondary = () => <button>Secondary</button>;
`,
    );

    const stories = extractStoriesFromFile(testFile);

    expect(stories.length).toBe(2);
    expect(stories[0]!.name).toBe('Primary');
    expect(stories[1]!.name).toBe('Secondary');
  });
});

// ============================================================================
// Stories Extractor — Edge cases
// ============================================================================

describe('extractStories — edge cases', () => {
  it('should return empty array for non-existent directory', () => {
    const stories = extractStories('/non/existent/dir');
    expect(stories).toEqual([]);
  });

  it('should return empty array for directory with no story files', () => {
    const emptyDir = join(TEMP_DIR, 'empty-stories');
    mkdirSync(emptyDir, { recursive: true });
    writeFileSync(join(emptyDir, 'readme.md'), '# Nothing here');

    const stories = extractStories(emptyDir);
    expect(stories).toEqual([]);
  });
});

// ============================================================================
// Defaults Extractor
// ============================================================================

describe('extractDefaults — Button hook', () => {
  it('should extract default values from useButton.ts', () => {
    const defaults = extractDefaults(BUTTON_HOOK);

    // The mock useButton.ts should have destructuring defaults
    expect(Object.keys(defaults).length).toBeGreaterThan(0);
  });

  it('should extract appearance default', () => {
    const defaults = extractDefaults(BUTTON_HOOK);

    expect(defaults['appearance']).toBe("'secondary'");
  });

  it('should extract size default', () => {
    const defaults = extractDefaults(BUTTON_HOOK);

    expect(defaults['size']).toBe("'medium'");
  });
});

describe('extractDefaults — Input hook', () => {
  it('should extract defaults from useInput.ts', () => {
    const defaults = extractDefaults(INPUT_HOOK);

    expect(Object.keys(defaults).length).toBeGreaterThan(0);
  });
});

describe('extractDefaults — edge cases', () => {
  it('should return empty map for non-existent file', () => {
    const defaults = extractDefaults('/non/existent/file.ts');
    expect(defaults).toEqual({});
  });

  it('should handle nullish coalescing patterns', () => {
    const testFile = join(TEMP_DIR, 'useNullish.ts');
    writeFileSync(
      testFile,
      `export function useNullish(props: any) {
  const disabled = props.disabled ?? false;
  const label = props.label ?? 'default';
  return { disabled, label };
}
`,
    );

    const defaults = extractDefaults(testFile);
    expect(defaults['disabled']).toBe('false');
    expect(defaults['label']).toBe("'default'");
  });

  it('should handle logical OR patterns', () => {
    const testFile = join(TEMP_DIR, 'useLogicalOr.ts');
    writeFileSync(
      testFile,
      `export function useLogicalOr(props: any) {
  const value = props.color || 'blue';
  return { value };
}
`,
    );

    const defaults = extractDefaults(testFile);
    expect(defaults['color']).toBe("'blue'");
  });

  it('should prefer destructuring over other patterns', () => {
    const testFile = join(TEMP_DIR, 'usePrecedence.ts');
    writeFileSync(
      testFile,
      `export function usePrecedence(props: any) {
  const { mode = 'auto' } = props;
  const backup = props.mode ?? 'manual';
  return { mode };
}
`,
    );

    const defaults = extractDefaults(testFile);
    // Destructuring default should win
    expect(defaults['mode']).toBe("'auto'");
  });

  it('should handle boolean defaults', () => {
    const testFile = join(TEMP_DIR, 'useBooleans.ts');
    writeFileSync(
      testFile,
      `export function useBooleans(props: any) {
  const { visible = true, hidden = false } = props;
  return { visible, hidden };
}
`,
    );

    const defaults = extractDefaults(testFile);
    expect(defaults['visible']).toBe('true');
    expect(defaults['hidden']).toBe('false');
  });

  it('should handle numeric defaults', () => {
    const testFile = join(TEMP_DIR, 'useNumbers.ts');
    writeFileSync(
      testFile,
      `export function useNumbers(props: any) {
  const { count = 0, max = 100 } = props;
  return { count, max };
}
`,
    );

    const defaults = extractDefaults(testFile);
    expect(defaults['count']).toBe('0');
    expect(defaults['max']).toBe('100');
  });
});

// ============================================================================
// Utility Extractor
// ============================================================================

describe('extractUtilityExports', () => {
  it('should extract exports from a utility package', () => {
    // Create a temp utility package
    const utilDir = join(TEMP_DIR, 'react-utils');
    const srcDir = join(utilDir, 'library', 'src');
    mkdirSync(srcDir, { recursive: true });
    writeFileSync(
      join(srcDir, 'index.ts'),
      `export { usePositioning } from './usePositioning';
export { useArrowNavigation } from './useArrowNavigation';
export type { PositioningOptions } from './types';
export { POSITIONING_CONSTANTS } from './constants';
export { mergeClasses } from './mergeClasses';
`,
    );

    const exports = extractUtilityExports(utilDir);

    expect(exports.length).toBe(5);

    const byName = (name: string) => exports.find((e) => e.name === name);

    expect(byName('usePositioning')!.kind).toBe('hook');
    expect(byName('useArrowNavigation')!.kind).toBe('hook');
    expect(byName('mergeClasses')!.kind).toBe('function');
  });

  it('should classify direct exports correctly', () => {
    const utilDir = join(TEMP_DIR, 'react-direct-exports');
    const srcDir = join(utilDir, 'src');
    mkdirSync(srcDir, { recursive: true });
    writeFileSync(
      join(srcDir, 'index.ts'),
      `export function createContext() {}
export const useTheme = () => {};
export type ThemeOptions = {};
export interface ThemeConfig {}
export const MAX_DEPTH = 10;
`,
    );

    const exports = extractUtilityExports(utilDir);

    const byName = (name: string) => exports.find((e) => e.name === name);

    expect(byName('createContext')!.kind).toBe('function');
    expect(byName('useTheme')!.kind).toBe('hook');
    expect(byName('ThemeOptions')!.kind).toBe('type');
    expect(byName('ThemeConfig')!.kind).toBe('type');
    expect(byName('MAX_DEPTH')!.kind).toBe('constant');
  });

  it('should return empty array for non-existent package', () => {
    const exports = extractUtilityExports('/non/existent/package');
    expect(exports).toEqual([]);
  });

  it('should return empty array for package without index.ts', () => {
    const emptyDir = join(TEMP_DIR, 'no-index');
    mkdirSync(emptyDir, { recursive: true });

    const exports = extractUtilityExports(emptyDir);
    expect(exports).toEqual([]);
  });

  it('should try library/src/ before src/', () => {
    // Create a package with both layouts, different content
    const utilDir = join(TEMP_DIR, 'react-both-layouts');
    const v9Src = join(utilDir, 'library', 'src');
    const directSrc = join(utilDir, 'src');
    mkdirSync(v9Src, { recursive: true });
    mkdirSync(directSrc, { recursive: true });

    writeFileSync(
      join(v9Src, 'index.ts'),
      `export { useV9Hook } from './useV9Hook';`,
    );
    writeFileSync(
      join(directSrc, 'index.ts'),
      `export { useOldHook } from './useOldHook';`,
    );

    const exports = extractUtilityExports(utilDir);

    // Should use library/src/ (v9 layout)
    expect(exports.some((e) => e.name === 'useV9Hook')).toBe(true);
    expect(exports.some((e) => e.name === 'useOldHook')).toBe(false);
  });
});
