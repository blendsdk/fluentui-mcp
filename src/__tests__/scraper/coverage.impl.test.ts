/**
 * Implementation tests for the FluentUI scraper coverage changes.
 *
 * These cover edge cases and internals of tag selection, path-safe source
 * resolution, component-name discovery, and coverage reporting. They are
 * written after the implementation and may reference its details.
 */

import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { V9Adapter } from '../../../scripts/scraper/adapters/v9-adapter.js';
import { buildCoverageReport } from '../../../scripts/scraper/coverage.js';
import {
  isExcludedPackage,
  readExportsIndexByPackage,
} from '../../../scripts/scraper/discover.js';
import {
  parseLsRemoteTags,
  resolveLatestStableTag,
  resolveTagAtHead,
} from '../../../scripts/scraper/git-ref.js';
import { getVersionConfig } from '../../../scripts/scraper/config.js';
import { resolveSourcePath } from '../../../scripts/scraper/paths.js';
import type { DiscoveredPackage } from '../../../scripts/scraper/types.js';
import type { ComponentEntry } from '../../types/schema.js';

const MOCK_ROOT = resolve(__dirname, '../fixtures/mock-fluentui');
const REACT_COMPONENTS_ROOT = join(
  MOCK_ROOT,
  'packages',
  'react-components',
);

const BUTTON_PKG: DiscoveredPackage = {
  dirName: 'react-button',
  path: join(REACT_COMPONENTS_ROOT, 'react-button'),
  packageName: '@fluentui/react-button',
  packageVersion: '9.9.1',
  type: 'component',
  isStableExport: true,
  isPreviewExport: false,
  source: 'fluentui',
};

function componentEntry(overrides: Partial<ComponentEntry>): ComponentEntry {
  return {
    name: 'Button',
    id: 'button',
    packageName: '@fluentui/react-button',
    packageVersion: '9.0.0',
    importPath: '@fluentui/react-components',
    importStatement: "import { Button } from '@fluentui/react-components';",
    category: 'buttons',
    stability: 'stable',
    deprecated: false,
    props: [],
    slots: [],
    stories: [],
    relatedComponents: [],
    additionalExports: [],
    ...overrides,
  };
}

describe('resolveLatestStableTag', () => {
  it('returns null when no stable tag matches', () => {
    expect(resolveLatestStableTag([])).toBeNull();
    expect(resolveLatestStableTag(['v9.0.0', 'main'])).toBeNull();
  });

  it('compares versions numerically, not lexically', () => {
    expect(
      resolveLatestStableTag([
        '@fluentui/react-components_v9.9.0',
        '@fluentui/react-components_v9.48.0',
      ]),
    ).toBe('@fluentui/react-components_v9.48.0');
  });

  it('trims surrounding whitespace', () => {
    expect(
      resolveLatestStableTag(['  @fluentui/react-components_v9.1.0  ']),
    ).toBe('@fluentui/react-components_v9.1.0');
  });

  it('ignores preview/unstable tag shapes', () => {
    expect(
      resolveLatestStableTag([
        '@fluentui/react-components_v9.0.0-beta.1',
        '@fluentui/react-components_v9.2.0',
      ]),
    ).toBe('@fluentui/react-components_v9.2.0');
  });
});

describe('resolveSourcePath', () => {
  it('returns an absolute path unchanged', () => {
    expect(resolveSourcePath('/opt/fluentui', '/work/repo')).toBe(
      resolve('/opt/fluentui'),
    );
  });

  it('resolves a nested relative path inside the root', () => {
    expect(resolveSourcePath('packages/ui', '/work/repo')).toBe(
      resolve('/work/repo/packages/ui'),
    );
  });

  it('allows a relative path that normalizes back inside the root', () => {
    expect(resolveSourcePath('a/../b', '/work/repo')).toBe(
      resolve('/work/repo/b'),
    );
  });

  it('rejects a sibling directory sharing the root prefix', () => {
    // `/work/repo-evil` must not be treated as inside `/work/repo`.
    expect(() => resolveSourcePath('../repo-evil', '/work/repo')).toThrow();
  });
});

describe('V9Adapter component discovery', () => {
  const adapter = new V9Adapter();

  it('discovers the whole Button family from types files', () => {
    expect(adapter.discoverComponentNames(BUTTON_PKG)).toEqual([
      'Button',
      'CompoundButton',
      'MenuButton',
      'SplitButton',
      'ToggleButton',
    ]);
  });

  it(
    'extracts each discovered component with a kebab-case id',
    () => {
      const components = adapter.extractComponents(BUTTON_PKG);
      const ids = components.map((entry) => entry.id);

      expect(components.map((entry) => entry.name)).toEqual([
        'Button',
        'CompoundButton',
        'MenuButton',
        'SplitButton',
        'ToggleButton',
      ]);
      expect(ids).toEqual([
        'button',
        'compound-button',
        'menu-button',
        'split-button',
        'toggle-button',
      ]);
    },
    30_000,
  );

  it('falls back to the derived package name when no types file exists', () => {
    const emptyPkg: DiscoveredPackage = {
      ...BUTTON_PKG,
      dirName: 'react-mystery',
      path: join(REACT_COMPONENTS_ROOT, 'react-dialog', 'library', 'etc'),
    };

    expect(adapter.discoverComponentNames(emptyPkg)).toEqual(['Mystery']);
  });
});

describe('buildCoverageReport', () => {
  it('records scraped components and excludes non-component packages', () => {
    const components = [
      componentEntry({ name: 'Button', packageName: '@fluentui/react-button' }),
    ];
    const packages: DiscoveredPackage[] = [
      {
        ...BUTTON_PKG,
        dirName: 'react-utilities',
        packageName: '@fluentui/react-utilities',
        type: 'utility',
      },
      {
        ...BUTTON_PKG,
        dirName: 'react-conformance-griffel',
        packageName: '@fluentui/react-conformance-griffel',
        type: 'internal',
      },
      BUTTON_PKG,
    ];

    const report = buildCoverageReport(components, packages, [
      'react-conformance-griffel',
    ]);

    expect(report.scraped).toEqual([
      { name: 'Button', id: 'button', packageName: '@fluentui/react-button' },
    ]);

    const reasons = new Map(
      report.excluded.map((entry) => [entry.dirName, entry.reason]),
    );
    expect(reasons.get('react-utilities')).toMatch(/utility/);
    expect(reasons.get('react-conformance-griffel')).toBe(
      'excluded by configuration',
    );
    // react-button produced a component, so it is not listed as excluded.
    expect(reasons.has('react-button')).toBe(false);
  });

  it('reports a component package that yielded no components', () => {
    const emptyPkg: DiscoveredPackage = {
      ...BUTTON_PKG,
      dirName: 'react-empty',
      packageName: '@fluentui/react-empty',
    };

    const report = buildCoverageReport([], [emptyPkg], []);

    expect(report.scraped).toEqual([]);
    expect(report.excluded).toEqual([
      {
        dirName: 'react-empty',
        packageName: '@fluentui/react-empty',
        reason: 'component package with no extracted components',
      },
    ]);
  });

  it('reports the umbrella package as an umbrella re-export package', () => {
    const umbrella: DiscoveredPackage = {
      ...BUTTON_PKG,
      dirName: 'react-components',
      packageName: '@fluentui/react-components',
    };

    const report = buildCoverageReport([], [umbrella], []);

    expect(report.excluded[0]?.reason).toBe('umbrella re-export package');
  });
});

describe('export-based component discovery', () => {
  const adapter = new V9Adapter();

  it('restricts discovery to real exports that have a types file', () => {
    const names = adapter.discoverComponentNames(BUTTON_PKG, {
      exportedNames: [
        'Button',
        'CompoundButton',
        'ButtonProps',
        'buttonClassNames',
        'NotARealComponent',
      ],
    });

    expect(names).toEqual(['Button', 'CompoundButton']);
  });

  it(
    'does not attach shared package stories to sibling components',
    () => {
      const components = adapter.extractComponents(BUTTON_PKG);

      const button = components.find((entry) => entry.name === 'Button');
      const compound = components.find(
        (entry) => entry.name === 'CompoundButton',
      );

      expect(button?.stories.length).toBeGreaterThanOrEqual(2);
      expect(compound?.stories).toEqual([]);
    },
    30_000,
  );
});

describe('readExportsIndexByPackage', () => {
  it('groups value exports by package and ignores type-only exports', () => {
    const indexPath = join(
      REACT_COMPONENTS_ROOT,
      'react-components',
      'library',
      'src',
      'index.ts',
    );

    const byPackage = readExportsIndexByPackage(indexPath);
    const buttonExports = byPackage.get('@fluentui/react-button') ?? [];

    expect(buttonExports).toContain('Button');
    expect(buttonExports).toContain('CompoundButton');
    // Type-only exports are not value identifiers.
    expect(buttonExports).not.toContain('ButtonProps');
  });

  it('returns an empty map for a missing index', () => {
    expect(readExportsIndexByPackage('/non/existent/index.ts').size).toBe(0);
  });

  it('parses multi-line export blocks and skips type-only exports', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fluentui-index-'));
    try {
      const indexPath = join(dir, 'index.ts');
      writeFileSync(
        indexPath,
        [
          'export {',
          '  Alpha,',
          '  Beta,',
          '  gammaClassNames,',
          "} from '@fluentui/react-demo';",
          '',
          'export type {',
          '  AlphaProps,',
          "} from '@fluentui/react-demo';",
        ].join('\n'),
      );

      const byPackage = readExportsIndexByPackage(indexPath);
      expect(byPackage.get('@fluentui/react-demo')).toEqual([
        'Alpha',
        'Beta',
        'gammaClassNames',
      ]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('isExcludedPackage', () => {
  it('excludes the umbrella package and skip-listed packages', () => {
    const config = getVersionConfig('v9');

    expect(
      isExcludedPackage(
        { ...BUTTON_PKG, dirName: 'react-components' },
        config,
      ),
    ).toBe(true);
    expect(
      isExcludedPackage(
        { ...BUTTON_PKG, dirName: 'react-conformance-griffel' },
        config,
      ),
    ).toBe(true);
    expect(isExcludedPackage(BUTTON_PKG, config)).toBe(false);
  });
});

describe('parseLsRemoteTags', () => {
  it('parses tag lines and drops peeled annotated-tag entries', () => {
    const output = [
      'a\trefs/tags/@fluentui/react-components_v9.48.1',
      'b\trefs/tags/@fluentui/react-components_v9.48.1^{}',
      'c\trefs/heads/main',
      '',
    ].join('\n');

    expect(parseLsRemoteTags(output)).toEqual([
      '@fluentui/react-components_v9.48.1',
    ]);
  });
});

describe('resolveTagAtHead', () => {
  it('returns null for a directory that is not a git checkout', () => {
    expect(resolveTagAtHead('/non/existent/repo')).toBeNull();
  });

  it('returns the stable tag when HEAD is exactly at a release tag', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fluentui-git-'));
    const git = (args: string[]): void => {
      execFileSync('git', args, {
        cwd: dir,
        stdio: ['ignore', 'ignore', 'ignore'],
      });
    };
    const identity = [
      '-c',
      'user.email=test@example.com',
      '-c',
      'user.name=Test',
    ];

    try {
      git(['init']);
      git([...identity, 'commit', '--allow-empty', '-m', 'init']);
      git(['tag', '@fluentui/react-components_v9.1.0']);

      expect(resolveTagAtHead(dir)).toBe(
        '@fluentui/react-components_v9.1.0',
      );

      // A later commit moves HEAD off the tag, so no tag is reported.
      git([...identity, 'commit', '--allow-empty', '-m', 'next']);
      expect(resolveTagAtHead(dir)).toBeNull();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
