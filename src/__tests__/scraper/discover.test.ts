/**
 * Unit tests for the scraper package discovery module.
 *
 * Tests package discovery, exports index parsing, glob matching,
 * package type classification, and edge case handling.
 *
 * Uses the mock-fluentui fixture directory which mimics the real
 * FluentUI monorepo structure with 3 component packages.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { join, resolve } from 'node:path';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';

import {
  discoverPackages,
  discoverContribPackages,
  readExportsIndex,
  findPackageDirectories,
  classifyPackageType,
} from '../../../scripts/scraper/discover.js';
import { getVersionConfig } from '../../../scripts/scraper/config.js';

import type { VersionConfig } from '../../../scripts/scraper/types.js';

// ============================================================================
// Test Constants
// ============================================================================

/** Path to the mock FluentUI directory fixture */
const MOCK_FLUENTUI_DIR = resolve(
  __dirname,
  '../fixtures/mock-fluentui',
);

/** V9 config for testing (used with mock directory) */
const V9_CONFIG = getVersionConfig('v9');

/** Temporary directory for edge-case tests */
const TEMP_DIR = resolve(__dirname, '../fixtures/.tmp-discover-test');

// ============================================================================
// Test Setup & Teardown
// ============================================================================

beforeAll(() => {
  // Create temporary directory for edge-case fixture tests
  if (!existsSync(TEMP_DIR)) {
    mkdirSync(TEMP_DIR, { recursive: true });
  }
});

afterAll(() => {
  // Clean up temporary test directory
  if (existsSync(TEMP_DIR)) {
    rmSync(TEMP_DIR, { recursive: true, force: true });
  }
});

// ============================================================================
// discoverPackages — Main Discovery
// ============================================================================

describe('discoverPackages', () => {
  it('should discover all component packages in the mock directory', () => {
    const packages = discoverPackages(MOCK_FLUENTUI_DIR, V9_CONFIG);

    // Should find react-button, react-dialog, react-input (sorted alphabetically)
    expect(packages.length).toBe(3);
    expect(packages.map((p) => p.dirName)).toEqual([
      'react-button',
      'react-dialog',
      'react-input',
    ]);
  });

  it('should read package names and versions from package.json', () => {
    const packages = discoverPackages(MOCK_FLUENTUI_DIR, V9_CONFIG);

    const button = packages.find((p) => p.dirName === 'react-button');
    expect(button).toBeDefined();
    expect(button!.packageName).toBe('@fluentui/react-button');
    expect(button!.packageVersion).toBe('9.9.1');

    const input = packages.find((p) => p.dirName === 'react-input');
    expect(input).toBeDefined();
    expect(input!.packageName).toBe('@fluentui/react-input');
    expect(input!.packageVersion).toBe('9.5.0');

    const dialog = packages.find((p) => p.dirName === 'react-dialog');
    expect(dialog).toBeDefined();
    expect(dialog!.packageName).toBe('@fluentui/react-dialog');
    expect(dialog!.packageVersion).toBe('9.11.0');
  });

  it('should classify all mock packages as component type', () => {
    const packages = discoverPackages(MOCK_FLUENTUI_DIR, V9_CONFIG);

    // All mock packages have .tsx files in library/src/ → component
    for (const pkg of packages) {
      expect(pkg.type).toBe('component');
    }
  });

  it('should mark packages as stable based on exports index', () => {
    const packages = discoverPackages(MOCK_FLUENTUI_DIR, V9_CONFIG);

    // All 3 mock packages are in the stable exports index
    const button = packages.find((p) => p.dirName === 'react-button')!;
    expect(button.isStableExport).toBe(true);

    const input = packages.find((p) => p.dirName === 'react-input')!;
    expect(input.isStableExport).toBe(true);

    const dialog = packages.find((p) => p.dirName === 'react-dialog')!;
    expect(dialog.isStableExport).toBe(true);
  });

  it('should mark all packages as fluentui source', () => {
    const packages = discoverPackages(MOCK_FLUENTUI_DIR, V9_CONFIG);

    for (const pkg of packages) {
      expect(pkg.source).toBe('fluentui');
    }
  });

  it('should return sorted results by directory name', () => {
    const packages = discoverPackages(MOCK_FLUENTUI_DIR, V9_CONFIG);

    const names = packages.map((p) => p.dirName);
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  it('should skip the react-components umbrella package', () => {
    const packages = discoverPackages(MOCK_FLUENTUI_DIR, V9_CONFIG);

    // react-components is the umbrella re-export package, not a component
    const umbrella = packages.find((p) => p.dirName === 'react-components');
    expect(umbrella).toBeUndefined();
  });

  it('should skip packages in the skipPackages list', () => {
    // Create a config that skips react-button
    const configWithSkip: VersionConfig = {
      ...V9_CONFIG,
      skipPackages: [...V9_CONFIG.skipPackages, 'react-button'],
    };

    const packages = discoverPackages(MOCK_FLUENTUI_DIR, configWithSkip);

    expect(packages.find((p) => p.dirName === 'react-button')).toBeUndefined();
    expect(packages.length).toBe(2);
  });

  it('should return empty array for non-existent source directory', () => {
    const packages = discoverPackages('/non/existent/path', V9_CONFIG);

    expect(packages).toEqual([]);
  });

  it('should provide full absolute paths for each package', () => {
    const packages = discoverPackages(MOCK_FLUENTUI_DIR, V9_CONFIG);

    for (const pkg of packages) {
      expect(pkg.path).toContain(MOCK_FLUENTUI_DIR);
      expect(pkg.path).toContain(pkg.dirName);
    }
  });
});

// ============================================================================
// discoverPackages — Edge Cases with Temporary Fixtures
// ============================================================================

describe('discoverPackages — edge cases', () => {
  it('should skip packages with missing package.json', () => {
    // Create a temporary mock directory with one package missing package.json
    const tmpMock = join(TEMP_DIR, 'missing-pkgjson');
    const pkgDir = join(tmpMock, 'packages', 'react-components', 'react-missing');
    mkdirSync(pkgDir, { recursive: true });
    // No package.json created

    // Also create the exports index dir (can be empty)
    const indexDir = join(
      tmpMock,
      'packages',
      'react-components',
      'react-components',
      'library',
      'src',
    );
    mkdirSync(indexDir, { recursive: true });
    writeFileSync(join(indexDir, 'index.ts'), '// empty\n');

    const packages = discoverPackages(tmpMock, V9_CONFIG);

    // Should return empty — the only package has no package.json
    expect(packages).toEqual([]);
  });

  it('should skip packages with malformed package.json', () => {
    const tmpMock = join(TEMP_DIR, 'malformed-pkgjson');
    const pkgDir = join(tmpMock, 'packages', 'react-components', 'react-broken');
    mkdirSync(pkgDir, { recursive: true });

    // Write malformed JSON
    writeFileSync(join(pkgDir, 'package.json'), '{ not valid json !!!');

    const indexDir = join(
      tmpMock,
      'packages',
      'react-components',
      'react-components',
      'library',
      'src',
    );
    mkdirSync(indexDir, { recursive: true });
    writeFileSync(join(indexDir, 'index.ts'), '// empty\n');

    const packages = discoverPackages(tmpMock, V9_CONFIG);

    expect(packages).toEqual([]);
  });

  it('should skip packages with package.json missing name or version', () => {
    const tmpMock = join(TEMP_DIR, 'incomplete-pkgjson');
    const pkgDir = join(tmpMock, 'packages', 'react-components', 'react-noname');
    mkdirSync(pkgDir, { recursive: true });

    // package.json without name
    writeFileSync(
      join(pkgDir, 'package.json'),
      JSON.stringify({ version: '1.0.0' }),
    );

    const indexDir = join(
      tmpMock,
      'packages',
      'react-components',
      'react-components',
      'library',
      'src',
    );
    mkdirSync(indexDir, { recursive: true });
    writeFileSync(join(indexDir, 'index.ts'), '// empty\n');

    const packages = discoverPackages(tmpMock, V9_CONFIG);

    expect(packages).toEqual([]);
  });
});

// ============================================================================
// readExportsIndex
// ============================================================================

describe('readExportsIndex', () => {
  it('should parse package names from the stable exports index', () => {
    const stableIndexPath = join(
      MOCK_FLUENTUI_DIR,
      'packages/react-components/react-components/library/src/index.ts',
    );

    const packages = readExportsIndex(stableIndexPath);

    expect(packages.has('@fluentui/react-button')).toBe(true);
    expect(packages.has('@fluentui/react-input')).toBe(true);
    expect(packages.has('@fluentui/react-dialog')).toBe(true);
  });

  it('should parse both value and type exports', () => {
    // Create a test file with both export styles
    const testFile = join(TEMP_DIR, 'test-exports.ts');
    writeFileSync(
      testFile,
      [
        "export { Button } from '@fluentui/react-button';",
        "export type { ButtonProps } from '@fluentui/react-button';",
        "export { Input } from '@fluentui/react-input';",
      ].join('\n'),
    );

    const packages = readExportsIndex(testFile);

    expect(packages.has('@fluentui/react-button')).toBe(true);
    expect(packages.has('@fluentui/react-input')).toBe(true);
    expect(packages.size).toBe(2); // De-duplicated
  });

  it('should skip comment lines', () => {
    const testFile = join(TEMP_DIR, 'test-comments.ts');
    writeFileSync(
      testFile,
      [
        '// This is a comment',
        "/* Block comment from '@fluentui/react-fake' */",
        "export { Button } from '@fluentui/react-button';",
      ].join('\n'),
    );

    const packages = readExportsIndex(testFile);

    expect(packages.has('@fluentui/react-button')).toBe(true);
    expect(packages.has('@fluentui/react-fake')).toBe(false);
    expect(packages.size).toBe(1);
  });

  it('should skip empty lines', () => {
    const testFile = join(TEMP_DIR, 'test-empty-lines.ts');
    writeFileSync(
      testFile,
      [
        '',
        "export { Button } from '@fluentui/react-button';",
        '',
        '',
        "export { Input } from '@fluentui/react-input';",
        '',
      ].join('\n'),
    );

    const packages = readExportsIndex(testFile);

    expect(packages.size).toBe(2);
  });

  it('should return empty set for non-existent file', () => {
    const packages = readExportsIndex('/non/existent/file.ts');

    expect(packages.size).toBe(0);
  });

  it('should handle both single and double quotes', () => {
    const testFile = join(TEMP_DIR, 'test-quotes.ts');
    writeFileSync(
      testFile,
      [
        "export { A } from '@fluentui/react-a';",
        'export { B } from "@fluentui/react-b";',
      ].join('\n'),
    );

    const packages = readExportsIndex(testFile);

    expect(packages.has('@fluentui/react-a')).toBe(true);
    expect(packages.has('@fluentui/react-b')).toBe(true);
  });
});

// ============================================================================
// findPackageDirectories
// ============================================================================

describe('findPackageDirectories', () => {
  it('should find directories matching a wildcard pattern', () => {
    const dirs = findPackageDirectories(
      MOCK_FLUENTUI_DIR,
      'packages/react-components/react-*',
    );

    // Should match react-button, react-components, react-dialog, react-input
    expect(dirs.length).toBeGreaterThanOrEqual(3);

    const dirNames = dirs.map((d) => d.split('/').pop());
    expect(dirNames).toContain('react-button');
    expect(dirNames).toContain('react-dialog');
    expect(dirNames).toContain('react-input');
  });

  it('should return exact directory for literal path (no wildcard)', () => {
    const dirs = findPackageDirectories(
      MOCK_FLUENTUI_DIR,
      'packages/react-components/react-button',
    );

    expect(dirs.length).toBe(1);
    expect(dirs[0]).toContain('react-button');
  });

  it('should return empty array for non-matching pattern', () => {
    const dirs = findPackageDirectories(
      MOCK_FLUENTUI_DIR,
      'packages/react-components/vue-*',
    );

    expect(dirs).toEqual([]);
  });

  it('should return empty array for non-existent base path', () => {
    const dirs = findPackageDirectories(
      '/non/existent/path',
      'packages/react-*',
    );

    expect(dirs).toEqual([]);
  });

  it('should only match directories, not files', () => {
    // Create a temp directory with a file that matches the pattern
    const tmpDir = join(TEMP_DIR, 'files-test');
    const parentDir = join(tmpDir, 'parent');
    mkdirSync(parentDir, { recursive: true });
    writeFileSync(join(parentDir, 'react-file.txt'), 'not a directory');
    mkdirSync(join(parentDir, 'react-dir'), { recursive: true });

    const dirs = findPackageDirectories(tmpDir, 'parent/react-*');

    expect(dirs.length).toBe(1);
    expect(dirs[0]).toContain('react-dir');
  });
});

// ============================================================================
// classifyPackageType
// ============================================================================

describe('classifyPackageType', () => {
  it('should classify package with .tsx files as component', () => {
    // react-button has Button.tsx in library/src/
    const buttonDir = join(
      MOCK_FLUENTUI_DIR,
      'packages/react-components/react-button',
    );

    expect(classifyPackageType(buttonDir)).toBe('component');
  });

  it('should classify package with only .ts files as utility', () => {
    // Create a temp package with only .ts files
    const utilDir = join(TEMP_DIR, 'classify-utility');
    const srcDir = join(utilDir, 'library', 'src');
    mkdirSync(srcDir, { recursive: true });
    writeFileSync(join(srcDir, 'usePositioning.ts'), 'export function usePositioning() {}');

    expect(classifyPackageType(utilDir)).toBe('utility');
  });

  it('should classify package with no source directory as internal', () => {
    // Create a temp package with no library/src/ or src/
    const internalDir = join(TEMP_DIR, 'classify-internal');
    mkdirSync(internalDir, { recursive: true });
    writeFileSync(join(internalDir, 'package.json'), '{}');

    expect(classifyPackageType(internalDir)).toBe('internal');
  });

  it('should check library/src/ first (v9 layout)', () => {
    // Create a package with .tsx in library/src/ and .ts in src/
    const dir = join(TEMP_DIR, 'classify-v9-layout');
    const v9Src = join(dir, 'library', 'src');
    const directSrc = join(dir, 'src');
    mkdirSync(v9Src, { recursive: true });
    mkdirSync(directSrc, { recursive: true });
    writeFileSync(join(v9Src, 'Component.tsx'), 'export const X = () => {};');
    writeFileSync(join(directSrc, 'utils.ts'), 'export function helper() {}');

    // Should use library/src/ and find .tsx → component
    expect(classifyPackageType(dir)).toBe('component');
  });

  it('should fall back to src/ if library/src/ does not exist', () => {
    // Create a package with .tsx in src/ but no library/src/
    const dir = join(TEMP_DIR, 'classify-direct-src');
    const srcDir = join(dir, 'src');
    mkdirSync(srcDir, { recursive: true });
    writeFileSync(join(srcDir, 'Component.tsx'), 'export const Y = () => {};');

    expect(classifyPackageType(dir)).toBe('component');
  });

  it('should find .tsx files in nested directories', () => {
    // Create a package with .tsx in a nested subdirectory
    const dir = join(TEMP_DIR, 'classify-nested');
    const nestedSrc = join(dir, 'library', 'src', 'components', 'Button');
    mkdirSync(nestedSrc, { recursive: true });
    writeFileSync(join(nestedSrc, 'Button.tsx'), 'export const Button = () => {};');

    expect(classifyPackageType(dir)).toBe('component');
  });

  it('should return internal for non-existent directory', () => {
    expect(classifyPackageType('/non/existent/dir')).toBe('internal');
  });
});

// ============================================================================
// discoverContribPackages
// ============================================================================

describe('discoverContribPackages', () => {
  it('should discover packages in a contrib-style directory', () => {
    // Create a mock contrib directory structure
    const contribDir = join(TEMP_DIR, 'mock-contrib');
    const pkgDir = join(contribDir, 'packages', 'react-data-grid');
    const srcDir = join(pkgDir, 'src');
    mkdirSync(srcDir, { recursive: true });
    writeFileSync(
      join(pkgDir, 'package.json'),
      JSON.stringify({
        name: '@fluentui-contrib/react-data-grid',
        version: '0.5.0',
      }),
    );
    writeFileSync(join(srcDir, 'DataGrid.tsx'), 'export const DataGrid = () => {};');

    const packages = discoverContribPackages(contribDir);

    expect(packages.length).toBe(1);
    expect(packages[0]!.dirName).toBe('react-data-grid');
    expect(packages[0]!.packageName).toBe('@fluentui-contrib/react-data-grid');
    expect(packages[0]!.packageVersion).toBe('0.5.0');
    expect(packages[0]!.source).toBe('contrib');
    expect(packages[0]!.type).toBe('component');
    expect(packages[0]!.isStableExport).toBe(false);
    expect(packages[0]!.isPreviewExport).toBe(false);
  });

  it('should discover multiple contrib packages sorted alphabetically', () => {
    const contribDir = join(TEMP_DIR, 'mock-contrib-multi');

    // Create two packages
    for (const name of ['react-chat', 'react-avatar-group']) {
      const pkgDir = join(contribDir, 'packages', name);
      const srcDir = join(pkgDir, 'src');
      mkdirSync(srcDir, { recursive: true });
      writeFileSync(
        join(pkgDir, 'package.json'),
        JSON.stringify({ name: `@fluentui-contrib/${name}`, version: '1.0.0' }),
      );
      writeFileSync(join(srcDir, 'Component.tsx'), 'export const C = () => {};');
    }

    const packages = discoverContribPackages(contribDir);

    expect(packages.length).toBe(2);
    // Should be sorted alphabetically
    expect(packages[0]!.dirName).toBe('react-avatar-group');
    expect(packages[1]!.dirName).toBe('react-chat');
  });

  it('should return empty array for non-existent contrib path', () => {
    const packages = discoverContribPackages('/non/existent/contrib');

    expect(packages).toEqual([]);
  });

  it('should return empty array when packages/ directory is missing', () => {
    // Create a directory without packages/ subdirectory
    const emptyDir = join(TEMP_DIR, 'empty-contrib');
    mkdirSync(emptyDir, { recursive: true });

    const packages = discoverContribPackages(emptyDir);

    expect(packages).toEqual([]);
  });

  it('should skip non-directory entries in packages/', () => {
    const contribDir = join(TEMP_DIR, 'mock-contrib-files');
    const packagesDir = join(contribDir, 'packages');
    mkdirSync(packagesDir, { recursive: true });

    // Create a file (not a directory) in packages/
    writeFileSync(join(packagesDir, 'README.md'), '# Packages');

    const packages = discoverContribPackages(contribDir);

    expect(packages).toEqual([]);
  });
});

// ============================================================================
// getVersionConfig
// ============================================================================

describe('getVersionConfig', () => {
  it('should return v9 config', () => {
    const config = getVersionConfig('v9');

    expect(config.version).toBe('v9');
    expect(config.adapter).toBe('v9');
    expect(config.paths.componentPackages).toBe(
      'packages/react-components/react-*',
    );
  });

  it('should return v8 config', () => {
    const config = getVersionConfig('v8');

    expect(config.version).toBe('v8');
    expect(config.adapter).toBe('v8');
  });

  it('should throw for unsupported version', () => {
    expect(() => getVersionConfig('v7')).toThrow(
      "Unsupported FluentUI version: 'v7'",
    );
  });

  it('should include supported versions in error message', () => {
    expect(() => getVersionConfig('invalid')).toThrow('v9, v8');
  });

  it('should have skip packages configured for v9', () => {
    const config = getVersionConfig('v9');

    expect(config.skipPackages.length).toBeGreaterThan(0);
    expect(config.skipPackages).toContain('react-conformance-griffel');
    expect(config.skipPackages).toContain('deprecated');
  });

  it('should have repo URLs configured', () => {
    const config = getVersionConfig('v9');

    expect(config.fluentui.repo).toContain('github.com');
    expect(config.fluentui.repo).toContain('fluentui');
    expect(config.contrib.repo).toContain('fluentui-contrib');
  });
});
