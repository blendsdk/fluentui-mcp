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
import { generateSkill } from '../../../scripts/skill/generate.js';
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

/** Build a component carrying only the fields the range formatter reads. */
function versionedComponent(version: string): ComponentEntry {
  return createComponentEntry('Widget', { packageVersion: version });
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
    expect(formatPackageVersionRange([versionedComponent('9.1.0')])).toBe(
      '1 package, 9.1.0',
    );
  });

  it('collapses identical minimum and maximum', () => {
    expect(
      formatPackageVersionRange([
        versionedComponent('9.5.0'),
        versionedComponent('9.5.0'),
      ]),
    ).toBe('2 packages, 9.5.0');
  });

  it('ignores malformed versions', () => {
    expect(
      formatPackageVersionRange([
        versionedComponent('9.1.0'),
        versionedComponent('v9'),
        versionedComponent('1.0'),
      ]),
    ).toBe('1 package, 9.1.0');
  });

  it('sorts numerically, not lexicographically', () => {
    expect(
      formatPackageVersionRange([
        versionedComponent('9.10.0'),
        versionedComponent('9.2.0'),
      ]),
    ).toBe('2 packages, 9.2.0–9.10.0');
  });

  it('returns undefined when no component has a valid version', () => {
    expect(formatPackageVersionRange([versionedComponent('next')])).toBeUndefined();
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
