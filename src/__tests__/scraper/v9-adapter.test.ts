/**
 * Tests for the V9 scraper adapter.
 *
 * Validates that the V9 adapter correctly finds files, derives names,
 * classifies packages, and extracts component/utility data from the
 * mock FluentUI fixture directory.
 *
 * @module tests/scraper/v9-adapter
 */

import { describe, it, expect } from 'vitest';
import { resolve, join } from 'node:path';

import { V9Adapter } from '../../../scripts/scraper/adapters/v9-adapter.js';
import {
  deriveComponentName,
  deriveUtilityName,
  toKebabCaseId,
  getImportPath,
  mergeDefaults,
  findSrcDir,
  findFileRecursive,
  findFilesRecursive,
  findApiMdFile,
} from '../../../scripts/scraper/adapters/v9-adapter.js';
import type { DiscoveredPackage } from '../../../scripts/scraper/types.js';
import type { PropEntry } from '../../types/schema.js';

// ============================================================================
// Test Fixtures
// ============================================================================

/** Root of the mock FluentUI monorepo fixture */
const MOCK_ROOT = resolve(
  __dirname,
  '../fixtures/mock-fluentui/packages/react-components',
);

/** Mock DiscoveredPackage for the Button component */
const BUTTON_PKG: DiscoveredPackage = {
  dirName: 'react-button',
  path: join(MOCK_ROOT, 'react-button'),
  packageName: '@fluentui/react-button',
  packageVersion: '9.9.1',
  type: 'component',
  isStableExport: true,
  isPreviewExport: false,
  source: 'fluentui',
};

/** Mock DiscoveredPackage for the Dialog component */
const DIALOG_PKG: DiscoveredPackage = {
  dirName: 'react-dialog',
  path: join(MOCK_ROOT, 'react-dialog'),
  packageName: '@fluentui/react-dialog',
  packageVersion: '9.11.0',
  type: 'component',
  isStableExport: true,
  isPreviewExport: false,
  source: 'fluentui',
};

/** Mock DiscoveredPackage for the Input component */
const INPUT_PKG: DiscoveredPackage = {
  dirName: 'react-input',
  path: join(MOCK_ROOT, 'react-input'),
  packageName: '@fluentui/react-input',
  packageVersion: '9.5.2',
  type: 'component',
  isStableExport: true,
  isPreviewExport: false,
  source: 'fluentui',
};

// ============================================================================
// Name Derivation Tests
// ============================================================================

describe('deriveComponentName', () => {
  it('should convert simple package name to PascalCase', () => {
    expect(deriveComponentName('react-button')).toBe('Button');
  });

  it('should convert multi-word package name to PascalCase', () => {
    expect(deriveComponentName('react-compound-button')).toBe('CompoundButton');
  });

  it('should handle three-word package names', () => {
    expect(deriveComponentName('react-message-bar')).toBe('MessageBar');
  });

  it('should handle package names without react- prefix gracefully', () => {
    // Edge case: contrib packages might not have react- prefix
    expect(deriveComponentName('data-grid')).toBe('DataGrid');
  });
});

describe('deriveUtilityName', () => {
  it('should derive utility name the same as component name', () => {
    expect(deriveUtilityName('react-positioning')).toBe('Positioning');
  });

  it('should handle multi-word utility names', () => {
    expect(deriveUtilityName('react-shared-contexts')).toBe('SharedContexts');
  });
});

describe('toKebabCaseId', () => {
  it('should convert simple PascalCase to kebab-case', () => {
    expect(toKebabCaseId('Button')).toBe('button');
  });

  it('should convert multi-word PascalCase to kebab-case', () => {
    expect(toKebabCaseId('CompoundButton')).toBe('compound-button');
  });

  it('should handle three-word PascalCase', () => {
    expect(toKebabCaseId('MessageBarBody')).toBe('message-bar-body');
  });
});

// ============================================================================
// Import Path Tests
// ============================================================================

describe('getImportPath', () => {
  it('should return umbrella package for stable components', () => {
    expect(getImportPath(BUTTON_PKG, 'stable')).toBe(
      '@fluentui/react-components',
    );
  });

  it('should return unstable sub-path for preview components', () => {
    expect(getImportPath(BUTTON_PKG, 'preview')).toBe(
      '@fluentui/react-components/unstable',
    );
  });

  it('should return package name for unstable components', () => {
    expect(getImportPath(BUTTON_PKG, 'unstable')).toBe(
      '@fluentui/react-button',
    );
  });

  it('should return package name for contrib components', () => {
    const contribPkg: DiscoveredPackage = {
      ...BUTTON_PKG,
      packageName: '@fluentui-contrib/react-data-grid',
      source: 'contrib',
    };
    expect(getImportPath(contribPkg, 'contrib')).toBe(
      '@fluentui-contrib/react-data-grid',
    );
  });
});

// ============================================================================
// Merge Defaults Tests
// ============================================================================

describe('mergeDefaults', () => {
  const baseProps: PropEntry[] = [
    {
      name: 'appearance',
      type: 'string',
      required: false,
      description: 'The appearance',
      deprecated: false,
      inherited: false,
      source: 'ButtonProps',
    },
    {
      name: 'size',
      type: 'string',
      required: false,
      description: 'The size',
      deprecated: false,
      inherited: false,
      source: 'ButtonProps',
    },
  ];

  it('should merge default values into matching props', () => {
    const defaults = { appearance: 'secondary', size: 'medium' };
    const result = mergeDefaults(baseProps, defaults);

    expect(result[0]?.defaultValue).toBe('secondary');
    expect(result[1]?.defaultValue).toBe('medium');
  });

  it('should not overwrite existing defaultValue from types', () => {
    const propsWithDefaults: PropEntry[] = [
      { ...baseProps[0]!, defaultValue: 'primary' },
      baseProps[1]!,
    ];
    const defaults = { appearance: 'secondary', size: 'medium' };
    const result = mergeDefaults(propsWithDefaults, defaults);

    // Existing value preserved
    expect(result[0]?.defaultValue).toBe('primary');
    // New value set
    expect(result[1]?.defaultValue).toBe('medium');
  });

  it('should return original props when defaults map is empty', () => {
    const result = mergeDefaults(baseProps, {});
    // Should be the same reference (no copy needed)
    expect(result).toBe(baseProps);
  });

  it('should handle defaults for non-existent props gracefully', () => {
    const defaults = { nonExistent: 'value' };
    const result = mergeDefaults(baseProps, defaults);
    // Props unchanged since no matching prop name
    expect(result[0]?.defaultValue).toBeUndefined();
    expect(result[1]?.defaultValue).toBeUndefined();
  });
});

// ============================================================================
// File System Helper Tests
// ============================================================================

describe('findSrcDir', () => {
  it('should find library/src/ for v9 packages', () => {
    const result = findSrcDir(BUTTON_PKG.path);
    expect(result).not.toBeNull();
    expect(result).toContain(join('library', 'src'));
  });

  it('should return null for non-existent package path', () => {
    const result = findSrcDir('/non/existent/path');
    expect(result).toBeNull();
  });
});

describe('findFileRecursive', () => {
  it('should find a file by exact name in the directory tree', () => {
    const srcDir = findSrcDir(BUTTON_PKG.path)!;
    const result = findFileRecursive(srcDir, 'Button.types.ts');
    expect(result).not.toBeNull();
    expect(result).toContain('Button.types.ts');
  });

  it('should return null when file does not exist', () => {
    const srcDir = findSrcDir(BUTTON_PKG.path)!;
    const result = findFileRecursive(srcDir, 'NonExistent.types.ts');
    expect(result).toBeNull();
  });

  it('should return null for non-existent directory', () => {
    const result = findFileRecursive('/non/existent', 'Button.types.ts');
    expect(result).toBeNull();
  });
});

describe('findFilesRecursive', () => {
  it('should find all story files in a directory', () => {
    const storiesDir = join(BUTTON_PKG.path, 'stories', 'src', 'Button');
    const result = findFilesRecursive(storiesDir, '.stories.tsx');
    expect(result.length).toBeGreaterThanOrEqual(2);
    // Results should be sorted alphabetically
    for (let i = 1; i < result.length; i++) {
      expect(result[i]! >= result[i - 1]!).toBe(true);
    }
  });

  it('should return empty array for non-existent directory', () => {
    const result = findFilesRecursive('/non/existent', '.stories.tsx');
    expect(result).toEqual([]);
  });
});

describe('findApiMdFile', () => {
  it('should find the .api.md file for Button package', () => {
    const result = findApiMdFile(BUTTON_PKG);
    expect(result).not.toBeNull();
    expect(result).toContain('react-button.api.md');
  });

  it('should return null when etc/ directory does not exist', () => {
    // Input package has no etc/ directory in mock
    const result = findApiMdFile(INPUT_PKG);
    expect(result).toBeNull();
  });
});

// ============================================================================
// V9Adapter File Finding Tests
// ============================================================================

describe('V9Adapter', () => {
  const adapter = new V9Adapter();

  describe('findTypesFile', () => {
    it('should find Button.types.ts', () => {
      const result = adapter.findTypesFile(BUTTON_PKG, 'Button');
      expect(result).not.toBeNull();
      expect(result).toContain('Button.types.ts');
    });

    it('should find Dialog.types.ts', () => {
      const result = adapter.findTypesFile(DIALOG_PKG, 'Dialog');
      expect(result).not.toBeNull();
      expect(result).toContain('Dialog.types.ts');
    });

    it('should return null for non-existent component name', () => {
      const result = adapter.findTypesFile(BUTTON_PKG, 'NonExistent');
      expect(result).toBeNull();
    });
  });

  describe('findStoryFiles', () => {
    it('should find Button story files', () => {
      const result = adapter.findStoryFiles(BUTTON_PKG, 'Button');
      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result.every((f) => f.endsWith('.stories.tsx'))).toBe(true);
    });

    it('should find Dialog story files', () => {
      const result = adapter.findStoryFiles(DIALOG_PKG, 'Dialog');
      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('should return empty array for package without stories', () => {
      const noStoriesPkg: DiscoveredPackage = {
        ...BUTTON_PKG,
        path: '/non/existent/package',
      };
      const result = adapter.findStoryFiles(noStoriesPkg, 'Button');
      expect(result).toEqual([]);
    });
  });

  describe('findHookFile', () => {
    it('should find useButton.ts', () => {
      const result = adapter.findHookFile(BUTTON_PKG, 'Button');
      expect(result).not.toBeNull();
      expect(result).toContain('useButton.ts');
    });

    it('should return null for non-existent hook', () => {
      const result = adapter.findHookFile(BUTTON_PKG, 'NonExistent');
      expect(result).toBeNull();
    });
  });

  // ==========================================================================
  // Full Component Extraction Tests
  // ==========================================================================

  describe('extractComponent', () => {
    it('should extract a complete Button ComponentEntry', () => {
      const result = adapter.extractComponent(BUTTON_PKG);

      expect(result).not.toBeNull();
      expect(result!.name).toBe('Button');
      expect(result!.id).toBe('button');
      expect(result!.packageName).toBe('@fluentui/react-button');
      expect(result!.packageVersion).toBe('9.9.1');
      expect(result!.importPath).toBe('@fluentui/react-components');
      expect(result!.importStatement).toBe(
        "import { Button } from '@fluentui/react-components';",
      );
      expect(result!.category).toBe('buttons');
      expect(result!.stability).toBe('stable');
      expect(result!.deprecated).toBe(false);
    });

    it('should extract props from Button types file', () => {
      const result = adapter.extractComponent(BUTTON_PKG);

      expect(result).not.toBeNull();
      expect(result!.props.length).toBeGreaterThan(0);

      // Check for known props from the mock Button.types.ts
      const propNames = result!.props.map((p) => p.name);
      expect(propNames).toContain('appearance');
      expect(propNames).toContain('size');
      expect(propNames).toContain('disabled');
    });

    it('should extract slots from Button types file', () => {
      const result = adapter.extractComponent(BUTTON_PKG);

      expect(result).not.toBeNull();
      expect(result!.slots.length).toBeGreaterThan(0);

      const slotNames = result!.slots.map((s) => s.name);
      expect(slotNames).toContain('root');
      expect(slotNames).toContain('icon');
    });

    it('should extract stories from Button stories', () => {
      const result = adapter.extractComponent(BUTTON_PKG);

      expect(result).not.toBeNull();
      expect(result!.stories.length).toBeGreaterThanOrEqual(2);
    });

    it('should merge default values into props', () => {
      const result = adapter.extractComponent(BUTTON_PKG);

      expect(result).not.toBeNull();
      // The mock useButton.ts has defaults like appearance = 'secondary'
      const appearanceProp = result!.props.find(
        (p) => p.name === 'appearance',
      );
      // Default should come from either JSDoc @default or hook extraction
      expect(appearanceProp?.defaultValue).toBeDefined();
    });

    it('should extract Dialog component', () => {
      const result = adapter.extractComponent(DIALOG_PKG);

      expect(result).not.toBeNull();
      expect(result!.name).toBe('Dialog');
      expect(result!.id).toBe('dialog');
      expect(result!.category).toBe('feedback');
      expect(result!.stability).toBe('stable');
    });

    it('should extract Input component', () => {
      const result = adapter.extractComponent(INPUT_PKG);

      expect(result).not.toBeNull();
      expect(result!.name).toBe('Input');
      expect(result!.id).toBe('input');
      expect(result!.category).toBe('forms');
      expect(result!.stability).toBe('stable');
      expect(result!.props.length).toBeGreaterThan(0);
    });
  });

  // ==========================================================================
  // Utility Extraction Tests
  // ==========================================================================

  describe('extractUtility', () => {
    it('should extract a utility entry from a utility package', () => {
      // Use a mock utility package (Button source has .ts files)
      const utilPkg: DiscoveredPackage = {
        dirName: 'react-utilities',
        path: BUTTON_PKG.path, // Reuse Button path for file system access
        packageName: '@fluentui/react-utilities',
        packageVersion: '9.18.0',
        type: 'utility',
        isStableExport: true,
        isPreviewExport: false,
        source: 'fluentui',
      };

      const result = adapter.extractUtility(utilPkg);
      expect(result).not.toBeNull();
      expect(result!.name).toBe('Utilities');
      expect(result!.id).toBe('utilities');
      expect(result!.packageName).toBe('@fluentui/react-utilities');
      expect(result!.importPath).toBe('@fluentui/react-utilities');
      expect(result!.stability).toBe('stable');
    });
  });
});
