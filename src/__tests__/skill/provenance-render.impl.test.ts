/**
 * Implementation tests for the provenance render internals.
 *
 * These cover the range formatter's edge cases and the rendered section's
 * omission and escaping rules. The end-to-end expectations live in the
 * specification test.
 *
 * @module tests/skill/provenance-render.impl
 */

import { describe, it, expect } from 'vitest';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { formatPackageVersionRange } from '../../../scripts/skill/mapping.js';
import {
  generateSkill,
  readSkillVersion,
} from '../../../scripts/skill/generate.js';
import type {
  ComponentEntry,
  FluentUISchema,
} from '../../../src/types/schema.js';
import {
  createComponentEntry,
  createFluentUISchema,
  createSourceInfo,
} from '../fixtures/helpers.js';

const SKILL_MD = [
  '---',
  'name: fluentui',
  'description: Test skill used by the provenance implementation tests.',
  'license: MIT',
  '---',
  '',
  '# FluentUI',
  '',
  'See `references/index.md`.',
  '',
].join('\n');

/** Build a component carrying the package name and version the formatter reads. */
function versionedComponent(name: string, version: string): ComponentEntry {
  return createComponentEntry(name, { packageVersion: version });
}

/** Generate a schema into a temp root and return the reference index text. */
function renderIndexFor(schema: FluentUISchema): string {
  const root = mkdtempSync(join(tmpdir(), 'fluentui-prov-impl-'));
  try {
    const schemaPath = join(root, 'schema.json');
    writeFileSync(schemaPath, JSON.stringify(schema, null, 2), 'utf-8');

    const skillDir = join(root, 'skill');
    mkdirSync(skillDir, { recursive: true });
    writeFileSync(join(skillDir, 'SKILL.md'), SKILL_MD, 'utf-8');

    const packageJsonPath = join(root, 'package.json');
    writeFileSync(
      packageJsonPath,
      JSON.stringify({ name: 'fluentui-skill', version: '9.9.9' }),
      'utf-8',
    );

    generateSkill({ schemaPath, skillDir, packageJsonPath });
    return readFileSync(join(skillDir, 'references', 'index.md'), 'utf-8');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

describe('formatPackageVersionRange', () => {
  it('renders a single version without a range', () => {
    expect(
      formatPackageVersionRange([versionedComponent('Alpha', '9.1.0')]),
    ).toBe('1 package, 9.1.0');
  });

  it('collapses identical minimum and maximum', () => {
    expect(
      formatPackageVersionRange([
        versionedComponent('Alpha', '9.5.0'),
        versionedComponent('Beta', '9.5.0'),
      ]),
    ).toBe('2 packages, 9.5.0');
  });

  it('counts a package once even when several components share it', () => {
    const shared = { packageName: '@fluentui/react-button', packageVersion: '9.1.0' };
    expect(
      formatPackageVersionRange([
        createComponentEntry('Button', shared),
        createComponentEntry('CompoundButton', shared),
      ]),
    ).toBe('1 package, 9.1.0');
  });

  it('ignores malformed versions', () => {
    expect(
      formatPackageVersionRange([
        versionedComponent('Alpha', '9.1.0'),
        versionedComponent('Beta', 'v9'),
        versionedComponent('Gamma', '1.0'),
      ]),
    ).toBe('1 package, 9.1.0');
  });

  it('sorts numerically, not lexicographically', () => {
    expect(
      formatPackageVersionRange([
        versionedComponent('Alpha', '9.10.0'),
        versionedComponent('Beta', '9.2.0'),
      ]),
    ).toBe('2 packages, 9.2.0–9.10.0');
  });

  it('returns undefined when no component has a valid version', () => {
    expect(
      formatPackageVersionRange([versionedComponent('Alpha', 'next')]),
    ).toBeUndefined();
    expect(formatPackageVersionRange([])).toBeUndefined();
  });
});

describe('provenance section omission', () => {
  it('omits the component-package row when no component has a version', () => {
    const index = renderIndexFor(
      createFluentUISchema({
        sources: { fluentui: createSourceInfo() },
        components: [createComponentEntry('Button', { packageVersion: '' })],
      }),
    );

    expect(index).toContain('## Source & versions');
    expect(index).not.toContain('Component packages');
  });
});

describe('provenance section escaping', () => {
  it('escapes pipes so the table row cannot be split', () => {
    const index = renderIndexFor(
      createFluentUISchema({
        sources: {
          fluentui: createSourceInfo({
            ref: 'release|v9',
            packageName: '@fluentui/react-components',
            packageVersion: '9.0.0|x',
          }),
        },
        components: [createComponentEntry('Button', { packageVersion: '9.0.0' })],
      }),
    );

    expect(index).toContain('`release\\|v9`');
    expect(index).toContain('9.0.0\\|x');
  });
});

describe('readSkillVersion', () => {
  /** Run a callback with a temporary directory that is removed afterwards. */
  function withTempDir(run: (dir: string) => void): void {
    const dir = mkdtempSync(join(tmpdir(), 'fluentui-skill-version-'));
    try {
      run(dir);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }

  it('returns the version field', () => {
    withTempDir((dir) => {
      const path = join(dir, 'package.json');
      writeFileSync(path, JSON.stringify({ name: 'x', version: '4.5.6' }));

      expect(readSkillVersion(path)).toBe('4.5.6');
    });
  });

  it('throws when the file is missing', () => {
    withTempDir((dir) => {
      expect(() => readSkillVersion(join(dir, 'absent.json'))).toThrow(
        /package\.json not found/,
      );
    });
  });

  it('throws when the file is not valid JSON', () => {
    withTempDir((dir) => {
      const path = join(dir, 'package.json');
      writeFileSync(path, '{ not json');

      expect(() => readSkillVersion(path)).toThrow(/not valid JSON/);
    });
  });

  it('throws when version is absent or not a string', () => {
    withTempDir((dir) => {
      const path = join(dir, 'package.json');
      writeFileSync(path, JSON.stringify({ name: 'x' }));
      expect(() => readSkillVersion(path)).toThrow(/no string version/);

      writeFileSync(path, JSON.stringify({ name: 'x', version: 1 }));
      expect(() => readSkillVersion(path)).toThrow(/no string version/);
    });
  });
});
