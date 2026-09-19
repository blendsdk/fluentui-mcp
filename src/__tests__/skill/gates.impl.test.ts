/**
 * Implementation tests for the content-integrity gates.
 *
 * These exercise the internals the specification tests do not pin: fence
 * extraction rules, frontmatter edge cases, secret pattern line numbers, the
 * API-reference oracle, and the real throwaway-project type check.
 *
 * @module tests/skill/gates.impl
 */

import { describe, it, expect, vi } from 'vitest';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { generateSkill } from '../../../scripts/skill/generate.js';
import {
  extractExamples,
  typeCheckWithTsc,
} from '../../../scripts/skill/validate-examples.js';
import { runCheck } from '../../../scripts/skill/check-drift.js';
import { runFreshness } from '../../../scripts/skill/check-freshness.js';
import { runSecrets } from '../../../scripts/skill/secrets.js';
import {
  parseFrontmatter,
  validateSkillFormat,
  SKILL_DESCRIPTION_MAX_LENGTH,
} from '../../../scripts/skill/format.js';
import { scanSecrets } from '../../../scripts/skill/secrets.js';
import { checkApiReferences } from '../../../scripts/skill/check-api-references.js';
import {
  createCategoryGuidanceEntry,
  createComponentEntry,
  createFluentUISchema,
  createGuideEntry,
  createRecipeEntry,
  createComponentEnhanced,
} from '../fixtures/helpers.js';

/** Create a temporary directory removed by the caller. */
function makeTempDir(): string {
  return mkdtempSync(join(tmpdir(), 'fluentui-impl-'));
}

/** Write a file, creating parent directories as needed. */
function writeTreeFile(root: string, rel: string, content: string): void {
  const full = join(root, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, 'utf-8');
}

describe('extractExamples', () => {
  it('keeps tsx blocks and skips other languages', () => {
    const dir = makeTempDir();
    try {
      writeTreeFile(
        dir,
        'references/foundation/getting-started.md',
        [
          '# Guide',
          '',
          '```bash',
          'npm install @fluentui/react-components',
          '```',
          '',
          '```tsx',
          'const a = 1;',
          '```',
          '',
        ].join('\n'),
      );

      const blocks = extractExamples(dir);
      expect(blocks).toHaveLength(1);
      expect(blocks[0].language).toBe('tsx');
      expect(blocks[0].line).toBe(7);
      expect(blocks[0].fullCheck).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('marks fragment fences and API-section fences as import-check-only', () => {
    const dir = makeTempDir();
    try {
      writeTreeFile(
        dir,
        'references/components/button.md',
        [
          '# Button',
          '',
          '## API',
          '',
          '```tsx',
          'interface ButtonProps { appearance?: string }',
          '```',
          '',
          '## Examples',
          '',
          '```tsx fragment',
          'const fragmentOnly = 1;',
          '```',
          '',
          '```tsx',
          'const full = 1;',
          '```',
          '',
        ].join('\n'),
      );

      const blocks = extractExamples(dir);
      const byFull = blocks.map((block) => block.fullCheck);
      expect(byFull).toEqual([false, false, true]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('treats SKILL.md snippets as import-check-only', () => {
    const dir = makeTempDir();
    try {
      writeTreeFile(
        dir,
        'SKILL.md',
        ['---', 'name: fluentui', '---', '', '```tsx', 'const x = 1;', '```'].join(
          '\n',
        ),
      );
      const blocks = extractExamples(dir);
      expect(blocks).toHaveLength(1);
      expect(blocks[0].fullCheck).toBe(false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('validateSkillFormat', () => {
  it('flags a missing frontmatter block', () => {
    const findings = validateSkillFormat({
      markdown: '# Just a body',
      dirName: 'fluentui',
    });
    expect(findings.some((finding) => finding.field === 'frontmatter')).toBe(
      true,
    );
  });

  it('flags an over-long description', () => {
    const markdown = [
      '---',
      'name: fluentui',
      `description: ${'x'.repeat(SKILL_DESCRIPTION_MAX_LENGTH + 1)}`,
      '---',
      '',
      '# Body',
    ].join('\n');
    const findings = validateSkillFormat({ markdown, dirName: 'fluentui' });
    expect(findings.some((finding) => finding.field === 'description')).toBe(
      true,
    );
  });

  it('ignores nested frontmatter blocks when parsing scalars', () => {
    const markdown = [
      '---',
      'name: fluentui',
      'description: A skill.',
      'metadata:',
      '  author: blendsdk',
      '---',
      '',
      '# Body',
    ].join('\n');
    expect(parseFrontmatter(markdown).name).toBe('fluentui');
    expect(validateSkillFormat({ markdown, dirName: 'fluentui' })).toHaveLength(
      0,
    );
  });
});

describe('scanSecrets', () => {
  it('reports the correct line for each pattern', () => {
    const findings = scanSecrets([
      {
        path: 'references/x.md',
        content: [
          'intro line',
          'token: sk-abcdefghijklmnopqrstuvwxyz012345',
          '',
          '-----BEGIN RSA PRIVATE KEY-----',
        ].join('\n'),
      },
    ]);
    expect(findings.map((finding) => finding.line)).toEqual([2, 4]);
  });
});

describe('checkApiReferences', () => {
  it('fails a category that lists an unknown component id', () => {
    const enhanced = createFluentUISchema({
      components: [createComponentEntry('Button', { id: 'button' })],
      categoryGuidance: [
        createCategoryGuidanceEntry('buttons', { componentIds: ['ghost'] }),
      ],
    });
    const report = checkApiReferences({
      enhancedSchema: enhanced,
      rawSchema: enhanced,
    });
    expect(report.errors.some((finding) => finding.name === 'ghost')).toBe(true);
  });

  it('accepts a relation that the package exports even when the schema omits it', () => {
    const enhanced = createFluentUISchema({
      components: [
        createComponentEntry('Button', {
          id: 'button',
          relatedComponents: ['CompoundButton'],
        }),
      ],
      recipes: [createRecipeEntry('login-form', { referencedComponents: [] })],
      categoryGuidance: [createCategoryGuidanceEntry('buttons')],
    });
    const report = checkApiReferences({
      enhancedSchema: enhanced,
      rawSchema: enhanced,
      packageExports: () => new Set(['CompoundButton']),
    });
    expect(report.errors).toHaveLength(0);
  });

  it('reports an unresolved structured prop label as a warning', () => {
    const enhanced = createFluentUISchema({
      components: [
        createComponentEntry('Button', {
          id: 'button',
          enhanced: createComponentEnhanced({
            propGuidance: [{ prop: 'frobnicate', guidance: 'No.' }],
          }),
        }),
      ],
    });
    const report = checkApiReferences({
      enhancedSchema: enhanced,
      rawSchema: enhanced,
    });
    expect(report.errors).toHaveLength(0);
    expect(report.warnings.some((finding) => finding.name === 'frobnicate')).toBe(
      true,
    );
  });
});

/** A minimal schema that the generator can render. */
function buildSchema() {
  return createFluentUISchema({
    components: [createComponentEntry('Button', { id: 'button' })],
    categoryGuidance: [createCategoryGuidanceEntry('buttons')],
    recipes: [createRecipeEntry('login-form', { referencedComponents: [] })],
  });
}

/** A minimal valid hand-written `SKILL.md`. */
function skillMarkdown(): string {
  return [
    '---',
    'name: fluentui',
    'description: Test skill used by the gate command-line tests.',
    'license: MIT',
    '---',
    '',
    '# FluentUI',
    '',
    'See `references/index.md`.',
    '',
  ].join('\n');
}

describe('gate command-line entry points', () => {
  it('runs the drift CLI and returns non-zero on drift', () => {
    const dir = makeTempDir();
    const sink = vi.spyOn(process.stdout, 'write').mockReturnValue(true);
    const errorSink = vi.spyOn(process.stderr, 'write').mockReturnValue(true);
    try {
      const schemaPath = join(dir, 'schema.json');
      writeFileSync(schemaPath, JSON.stringify(buildSchema()), 'utf-8');
      const skillDir = join(dir, 'skill');
      mkdirSync(skillDir, { recursive: true });
      writeFileSync(join(skillDir, 'SKILL.md'), skillMarkdown(), 'utf-8');
      generateSkill({ schemaPath, skillDir });

      expect(runCheck(['--schema', schemaPath, '--skill-dir', skillDir])).toBe(0);

      const target = join(skillDir, 'references', 'components', 'button.md');
      writeFileSync(target, `${readFileSync(target, 'utf-8')}x`, 'utf-8');
      expect(runCheck(['--schema', schemaPath, '--skill-dir', skillDir])).toBe(1);
    } finally {
      sink.mockRestore();
      errorSink.mockRestore();
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('runs the freshness CLI and returns non-zero when the schema changed', () => {
    const dir = makeTempDir();
    const sink = vi.spyOn(process.stdout, 'write').mockReturnValue(true);
    const errorSink = vi.spyOn(process.stderr, 'write').mockReturnValue(true);
    try {
      const schema = buildSchema();
      const schemaPath = join(dir, 'schema.json');
      writeFileSync(schemaPath, JSON.stringify(schema), 'utf-8');
      const skillDir = join(dir, 'skill');
      mkdirSync(skillDir, { recursive: true });
      writeFileSync(join(skillDir, 'SKILL.md'), skillMarkdown(), 'utf-8');
      generateSkill({ schemaPath, skillDir });
      const manifestPath = join(skillDir, '.fluentui-skill-manifest.json');

      expect(runFreshness(['--schema', schemaPath, '--manifest', manifestPath])).toBe(
        0,
      );

      schema.generatedAt = '2030-01-01T00:00:00Z';
      writeFileSync(schemaPath, JSON.stringify(schema), 'utf-8');
      expect(runFreshness(['--schema', schemaPath, '--manifest', manifestPath])).toBe(
        1,
      );
    } finally {
      sink.mockRestore();
      errorSink.mockRestore();
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('runs the secrets CLI and returns non-zero on a planted key', () => {
    const dir = makeTempDir();
    const sink = vi.spyOn(process.stdout, 'write').mockReturnValue(true);
    const errorSink = vi.spyOn(process.stderr, 'write').mockReturnValue(true);
    try {
      writeTreeFile(dir, 'references/components/button.md', '# Button\n');
      expect(runSecrets(['--skill-dir', dir])).toBe(0);

      writeTreeFile(
        dir,
        'references/components/button.md',
        'key: sk-abcdefghijklmnopqrstuvwxyz012345\n',
      );
      expect(runSecrets(['--skill-dir', dir])).toBe(1);
    } finally {
      sink.mockRestore();
      errorSink.mockRestore();
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('committed skill', () => {
  const skillRoot = join(process.cwd(), '.agents', 'skills', 'fluentui');

  it('passes the format gate', () => {
    const markdown = readFileSync(join(skillRoot, 'SKILL.md'), 'utf-8');
    expect(validateSkillFormat({ markdown, dirName: 'fluentui' })).toHaveLength(0);
  });

  it('ships the references index', () => {
    expect(existsSync(join(skillRoot, 'references', 'index.md'))).toBe(true);
  });
});

describe('typeCheckWithTsc', () => {
  it('returns no findings for an empty block list', () => {
    expect(typeCheckWithTsc([])).toHaveLength(0);
  });

  it(
    'reports a tier-2 finding for a real type error',
    () => {
      const findings = typeCheckWithTsc([
        {
          file: 'references/components/button.md',
          line: 10,
          language: 'tsx',
          code: [
            "import { Button } from '@fluentui/react-components';",
            '',
            'export const Demo = () => <Button appearance={42} />;',
          ].join('\n'),
          fullCheck: true,
        },
      ]);
      expect(findings.length).toBeGreaterThan(0);
      expect(findings[0].tier).toBe('2');
      expect(findings[0].file).toBe('references/components/button.md');
      expect(findings[0].line).toBeGreaterThanOrEqual(10);
    },
    120000,
  );
});
