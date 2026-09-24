/**
 * Specification test for the release provenance integration.
 *
 * Derived from the provenance requirement: bumping the package version and
 * regenerating the skill must update the version recorded in
 * `references/index.md`, and a drift check of that freshly generated tree must
 * pass. The test works entirely in a temporary directory so it never mutates
 * the repository.
 *
 * @module tests/integration/provenance-release.spec
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

import { generateSkill } from '../../../scripts/skill/generate.js';
import { checkDrift } from '../../../scripts/skill/check-drift.js';
import {
  createComponentEntry,
  createFluentUISchema,
} from '../fixtures/helpers.js';

/** Minimal hand-written `SKILL.md` seeded into the temporary skill root. */
const SKILL_MD = [
  '---',
  'name: fluentui',
  'description: Test skill used by the release integration specification test.',
  'license: MIT',
  '---',
  '',
  '# FluentUI',
  '',
  'See `references/index.md`.',
  '',
].join('\n');

/** A version that differs from the committed package version. */
const TEMP_VERSION = '9.9.9';

describe('release regeneration', () => {
  it('records the temporary version and leaves a drift-free tree', () => {
    const root = mkdtempSync(join(tmpdir(), 'fluentui-release-'));
    try {
      const schemaPath = join(root, 'schema.json');
      writeFileSync(
        schemaPath,
        JSON.stringify(
          createFluentUISchema({
            components: [
              createComponentEntry('Button', { packageVersion: '9.0.0' }),
            ],
          }),
          null,
          2,
        ),
        'utf-8',
      );

      const skillDir = join(root, 'skill');
      mkdirSync(skillDir, { recursive: true });
      writeFileSync(join(skillDir, 'SKILL.md'), SKILL_MD, 'utf-8');

      const packageJsonPath = join(root, 'package.json');
      writeFileSync(
        packageJsonPath,
        JSON.stringify({ name: 'fluentui-skill', version: TEMP_VERSION }),
        'utf-8',
      );

      generateSkill({ schemaPath, skillDir, packageJsonPath });

      const index = readFileSync(
        join(skillDir, 'references', 'index.md'),
        'utf-8',
      );
      expect(index).toContain(TEMP_VERSION);

      const report = checkDrift({ schemaPath, skillDir, packageJsonPath });
      expect(report.differences).toEqual([]);

      // The repository's committed tree must be untouched by the temp run.
      const committedIndex = readFileSync(
        join(process.cwd(), '.agents', 'skills', 'fluentui', 'references', 'index.md'),
        'utf-8',
      );
      expect(committedIndex).not.toContain(TEMP_VERSION);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
