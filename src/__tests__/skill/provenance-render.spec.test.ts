/**
 * Specification tests for the provenance section in the generated skill.
 *
 * Derived from the provenance requirement: `references/index.md` must carry a
 * `## Source & versions` section that names the covered FluentUI version,
 * source ref and commit, the umbrella package version when present, the
 * component package version range, and the skill, generator, and schema
 * identifiers. The section must stay timestamp-free and reproducible.
 *
 * These tests are written before the implementation and must never be edited
 * to match it. A failing test means the implementation is wrong.
 *
 * @module tests/skill/provenance-render.spec
 */

import { describe, it, expect } from 'vitest';
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { generateSkill } from '../../../scripts/skill/generate.js';
import type { FluentUISchema } from '../../../src/types/schema.js';
import {
  createComponentEntry,
  createFluentUISchema,
  createSourceInfo,
} from '../fixtures/helpers.js';

// ============================================================================
// Fixtures & helpers
// ============================================================================

/** The full commit recorded in the sample source. */
const SAMPLE_COMMIT = 'fdf755ce26d41c57452b79fb23fc4a590630a1b5';

/** The short form the section is expected to show. */
const SAMPLE_SHORT_COMMIT = SAMPLE_COMMIT.slice(0, 7);

/** Minimal hand-written `SKILL.md` seeded into every temporary skill root. */
const SKILL_MD = [
  '---',
  'name: fluentui',
  'description: Test skill used by the provenance specification tests.',
  'license: MIT',
  '---',
  '',
  '# FluentUI',
  '',
  'See `references/index.md`.',
  '',
].join('\n');

/** Create a temporary directory that is removed by the caller. */
function makeTempDir(): string {
  return mkdtempSync(join(tmpdir(), 'fluentui-provenance-'));
}

/** Seed a temporary skill root with the hand-written `SKILL.md`. */
function seedSkillDir(skillDir: string): void {
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(join(skillDir, 'SKILL.md'), SKILL_MD, 'utf-8');
}

/** Write a package.json with the given version and return its path. */
function writePackageJson(dir: string, version: string): string {
  const path = join(dir, 'package.json');
  writeFileSync(
    path,
    JSON.stringify({ name: 'fluentui-skill', version }, null, 2),
    'utf-8',
  );
  return path;
}

/** Write a schema object to a JSON file and return its path. */
function writeSchemaFile(dir: string, schema: unknown): string {
  const path = join(dir, 'schema.json');
  writeFileSync(path, JSON.stringify(schema, null, 2), 'utf-8');
  return path;
}

/** Read the generated reference index for a skill root. */
function readIndex(skillDir: string): string {
  return readFileSync(join(skillDir, 'references', 'index.md'), 'utf-8');
}

/**
 * A schema whose source records the umbrella package and whose components
 * carry the versions used by the range assertion.
 */
function buildProvenanceSchema(
  componentVersions: string[] = ['9.2.0', '9.10.0'],
): FluentUISchema {
  return createFluentUISchema({
    sources: {
      fluentui: createSourceInfo({
        ref: '@fluentui/react-components_v9.48.0',
        commit: SAMPLE_COMMIT,
        packageName: '@fluentui/react-components',
        packageVersion: '9.48.0',
      }),
    },
    components: componentVersions.map((version, index) =>
      createComponentEntry(`Widget${index}`, { packageVersion: version }),
    ),
  });
}

/** Generate the skill for a schema and return the reference index text. */
function generateAndReadIndex(
  schema: FluentUISchema,
  options: { skillVersion?: string; skillDir?: string } = {},
): string {
  const root = makeTempDir();
  try {
    const schemaPath = writeSchemaFile(root, schema);
    const skillDir = options.skillDir ?? join(root, 'skill');
    seedSkillDir(skillDir);
    const packageJsonPath = writePackageJson(
      root,
      options.skillVersion ?? '9.9.9',
    );

    generateSkill({ schemaPath, skillDir, packageJsonPath });

    return readIndex(skillDir);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// The section lists the full provenance tuple
// ============================================================================

describe('provenance section contents', () => {
  it('renders the source ref, commit, umbrella version, range, and identifiers', () => {
    const index = generateAndReadIndex(buildProvenanceSchema(), {
      skillVersion: '3.2.1',
    });

    expect(index).toContain('## Source & versions');
    expect(index).toContain('@fluentui/react-components_v9.48.0');
    expect(index).toContain(SAMPLE_SHORT_COMMIT);
    expect(index).toContain('@fluentui/react-components');
    expect(index).toContain('9.48.0');
    expect(index).toContain('9.2.0');
    expect(index).toContain('9.10.0');
    expect(index).toContain('3.2.1');
    expect(index).toMatch(/Generator\s*\|\s*`?\d+\.\d+\.\d+/);
    expect(index).toMatch(/Schema hash\s*\|\s*`[0-9a-f]{8,64}`/);
  });
});

// ============================================================================
// Numeric ordering of the component range
// ============================================================================

describe('component package range', () => {
  it('orders two-digit minor versions numerically', () => {
    const index = generateAndReadIndex(buildProvenanceSchema(['9.2.0', '9.10.0']));

    expect(index).toContain('9.2.0–9.10.0');
    expect(index).toContain('2 packages');
  });
});

// ============================================================================
// Absent umbrella data omits the row without failing
// ============================================================================

describe('absent umbrella data', () => {
  it('omits the umbrella row and still generates', () => {
    const schema = createFluentUISchema({
      sources: {
        fluentui: createSourceInfo({
          ref: 'master',
          commit: SAMPLE_COMMIT,
        }),
      },
      components: [createComponentEntry('Button', { packageVersion: '9.1.0' })],
    });

    const index = generateAndReadIndex(schema);

    expect(index).toContain('## Source & versions');
    expect(index).not.toContain('Umbrella package');
  });
});

// ============================================================================
// No timestamp leaks into a generated reference
// ============================================================================

describe('timestamp freedom', () => {
  it('writes no ISO-8601 timestamp into any reference file', () => {
    const root = makeTempDir();
    try {
      const schemaPath = writeSchemaFile(root, buildProvenanceSchema());
      const skillDir = join(root, 'skill');
      seedSkillDir(skillDir);
      const packageJsonPath = writePackageJson(root, '9.9.9');

      generateSkill({ schemaPath, skillDir, packageJsonPath });

      const referencesDir = join(skillDir, 'references');
      const stack = [referencesDir];
      const iso = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      while (stack.length > 0) {
        const dir = stack.pop() as string;
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
          const full = join(dir, entry.name);
          if (entry.isDirectory()) {
            stack.push(full);
          } else if (entry.name.endsWith('.md')) {
            expect(readFileSync(full, 'utf-8')).not.toMatch(iso);
          }
        }
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

// ============================================================================
// The skill version comes from package.json
// ============================================================================

describe('skill version parity', () => {
  it('emits the package.json version as the skill version', () => {
    const index = generateAndReadIndex(buildProvenanceSchema(), {
      skillVersion: '7.7.7',
    });

    expect(index).toContain('7.7.7');
  });
});

// ============================================================================
// Deterministic output
// ============================================================================

describe('deterministic render', () => {
  it('produces a byte-identical index on a second run', () => {
    const root = makeTempDir();
    try {
      const schemaPath = writeSchemaFile(root, buildProvenanceSchema());
      const packageJsonPath = writePackageJson(root, '9.9.9');
      const first = join(root, 'first');
      const second = join(root, 'second');
      seedSkillDir(first);
      seedSkillDir(second);

      generateSkill({ schemaPath, skillDir: first, packageJsonPath });
      generateSkill({ schemaPath, skillDir: second, packageJsonPath });

      expect(readIndex(second)).toBe(readIndex(first));
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

// ============================================================================
// A schema without sources fails closed
// ============================================================================

describe('missing sources', () => {
  it('throws before writing and leaves the tree unchanged', () => {
    const root = makeTempDir();
    try {
      const schema = buildProvenanceSchema();
      delete (schema as Partial<FluentUISchema>).sources;
      const schemaPath = writeSchemaFile(root, schema);
      const skillDir = join(root, 'skill');
      seedSkillDir(skillDir);
      const packageJsonPath = writePackageJson(root, '9.9.9');

      const before = readFileSync(join(skillDir, 'SKILL.md'), 'utf-8');
      expect(() =>
        generateSkill({ schemaPath, skillDir, packageJsonPath }),
      ).toThrow();
      expect(existsSync(join(skillDir, 'references'))).toBe(false);
      expect(readFileSync(join(skillDir, 'SKILL.md'), 'utf-8')).toBe(before);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
