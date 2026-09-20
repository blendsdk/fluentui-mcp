/**
 * Specification tests for the content-integrity gates.
 *
 * Authored BEFORE the gate implementations exist. They pin the required
 * behavior of the example validator, the API-reference check, the drift and
 * coverage gate, the freshness gate, the format gate, and the secrets gate.
 * The oracle comes from the requirement, never from the implementation: a
 * failing spec test means the implementation is wrong.
 *
 * Two decisions shape the expectations:
 * - Component mentions must resolve against the raw schema or the installed
 *   package; unresolved component names fail. Prop labels that do not resolve
 *   are reported but do not fail, because they come from prose, not the
 *   deterministic API tables.
 * - Package resolution and type checking are injected, so these tests never
 *   need a network install or run the compiler.
 *
 * @module tests/skill/gates.spec
 */

import { describe, it, expect } from 'vitest';
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
  validateExamples,
  type ExampleBlock,
  type PackageExportResolver,
  type TypeChecker,
} from '../../../scripts/skill/validate-examples.js';
import { checkApiReferences } from '../../../scripts/skill/check-api-references.js';
import { checkDrift } from '../../../scripts/skill/check-drift.js';
import { checkFreshness } from '../../../scripts/skill/check-freshness.js';
import { scanSecrets } from '../../../scripts/skill/secrets.js';
import {
  parseFrontmatter,
  validateSkillFormat,
} from '../../../scripts/skill/format.js';
import type { FluentUISchema } from '../../../src/types/schema.js';
import {
  createCategoryGuidanceEntry,
  createComponentEnhanced,
  createComponentEntry,
  createFluentUISchema,
  createGuideEntry,
  createRecipeEntry,
} from '../fixtures/helpers.js';

// ============================================================================
// Fixtures & helpers
// ============================================================================

/** A minimal, valid hand-written `SKILL.md` for a temporary skill root. */
function skillMarkdown(name = 'fluentui'): string {
  return [
    '---',
    `name: ${name}`,
    'description: Test skill used by the integrity-gate specification tests.',
    'license: MIT',
    '---',
    '',
    '# FluentUI',
    '',
    'See `references/index.md`.',
    '',
  ].join('\n');
}

/** Create a temporary directory removed by the caller. */
function makeTempDir(): string {
  return mkdtempSync(join(tmpdir(), 'fluentui-gates-'));
}

/** Write a schema object to a JSON file and return its path. */
function writeSchemaFile(dir: string, schema: unknown): string {
  const path = join(dir, 'schema.json');
  writeFileSync(path, JSON.stringify(schema, null, 2), 'utf-8');
  return path;
}

/** Write a file, creating parent directories as needed. */
function writeTreeFile(root: string, rel: string, content: string): void {
  const full = join(root, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, 'utf-8');
}

/**
 * Build a compact but complete schema: one component, one category, one
 * foundation guide, one quick reference, and one recipe.
 */
function buildSchema(overrides: Partial<FluentUISchema> = {}): FluentUISchema {
  const button = createComponentEntry('Button', {
    id: 'button',
    category: 'buttons',
    packageName: '@fluentui/react-button',
    props: [
      {
        name: 'appearance',
        type: "'primary' | 'secondary'",
        required: false,
        description: 'Controls the visual emphasis.',
        deprecated: false,
        inherited: false,
        source: 'ButtonProps',
      },
    ],
  });
  return createFluentUISchema({
    components: [button],
    categoryGuidance: [createCategoryGuidanceEntry('buttons')],
    foundation: [createGuideEntry('getting-started')],
    quickReference: [createGuideEntry('setup-imports')],
    recipes: [createRecipeEntry('login-form', { group: 'forms' })],
    ...overrides,
  });
}

/** A resolver that pretends only the button-family names are exported. */
const BUTTON_ONLY_EXPORTS: PackageExportResolver = (specifier) =>
  specifier === '@fluentui/react-components'
    ? new Set(['Button', 'Input'])
    : undefined;

/** A type checker stub that reports nothing (tier 2 is report-only). */
const NO_TYPE_ERRORS: TypeChecker = () => [];

// ============================================================================
// Example validation
// ============================================================================

describe('example validation', () => {
  it('fails with tier 1b and the symbol name when a named import does not exist', () => {
    const dir = makeTempDir();
    try {
      writeTreeFile(dir, 'SKILL.md', skillMarkdown());
      writeTreeFile(
        dir,
        'references/components/button.md',
        [
          '# Button',
          '',
          '```tsx',
          "import { NotAButton } from '@fluentui/react-components';",
          'export const Demo = () => <NotAButton />;',
          '```',
          '',
        ].join('\n'),
      );

      const report = validateExamples({
        skillDir: dir,
        resolveExports: BUTTON_ONLY_EXPORTS,
        typeCheck: NO_TYPE_ERRORS,
      });

      expect(report.errors).toHaveLength(1);
      expect(report.errors[0].tier).toBe('1b');
      expect(report.errors[0].message).toContain('NotAButton');
      expect(report.errors[0].file).toBe('references/components/button.md');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('ignores comments inside an import clause so it does not report a false positive', () => {
    const dir = makeTempDir();
    try {
      writeTreeFile(dir, 'SKILL.md', skillMarkdown());
      writeTreeFile(
        dir,
        'references/components/button.md',
        [
          '# Button',
          '',
          '```tsx',
          'import {',
          '  // the primary action control',
          '  Button,',
          '  Input, // text entry',
          '} from \'@fluentui/react-components\';',
          '```',
          '',
        ].join('\n'),
      );

      const report = validateExamples({
        skillDir: dir,
        resolveExports: BUTTON_ONLY_EXPORTS,
        typeCheck: NO_TYPE_ERRORS,
      });

      expect(report.errors).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('reports a tier-2 type error without failing the gate', () => {
    const dir = makeTempDir();
    try {
      writeTreeFile(dir, 'SKILL.md', skillMarkdown());
      writeTreeFile(
        dir,
        'references/components/button.md',
        [
          '# Button',
          '',
          '```tsx',
          "import { Button } from '@fluentui/react-components';",
          'export const Demo = () => <Button appearance={42} />;',
          '```',
          '',
        ].join('\n'),
      );

      const typeCheck: TypeChecker = (blocks: readonly ExampleBlock[]) =>
        blocks.map((block) => ({
          file: block.file,
          line: block.line,
          tier: '2',
          message: 'Type error: number is not assignable to a string union.',
        }));
      const report = validateExamples({
        skillDir: dir,
        resolveExports: BUTTON_ONLY_EXPORTS,
        typeCheck,
      });

      expect(report.errors).toHaveLength(0);
      const tier2 = report.warnings.find((finding) => finding.tier === '2');
      expect(tier2).toBeDefined();
      expect(tier2?.file).toBe('references/components/button.md');
      expect(typeof tier2?.line).toBe('number');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

// ============================================================================
// Drift
// ============================================================================

describe('drift gate', () => {
  it('fails naming the exact generated file edited by one byte', () => {
    const dir = makeTempDir();
    try {
      const schemaPath = writeSchemaFile(dir, buildSchema());
      const skillDir = join(dir, 'skill');
      mkdirSync(skillDir, { recursive: true });
      writeFileSync(join(skillDir, 'SKILL.md'), skillMarkdown(), 'utf-8');
      generateSkill({ schemaPath, skillDir });

      const targetRel = 'references/components/button.md';
      const target = join(skillDir, targetRel);
      writeFileSync(target, `${readFileSync(target, 'utf-8')}x`, 'utf-8');

      const report = checkDrift({ schemaPath, skillDir });
      expect(report.differences).toContain(targetRel);

      // Hand-written files are not part of the generated set, so edits to them
      // must not appear as drift.
      writeTreeFile(skillDir, 'SKILL.md', `${skillMarkdown()}\nExtra hand note.\n`);
      const second = checkDrift({ schemaPath, skillDir });
      expect(second.differences).not.toContain('SKILL.md');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

// ============================================================================
// Freshness
// ============================================================================

describe('freshness gate', () => {
  it('fails with a regenerate instruction when the schema changed after generation', () => {
    const dir = makeTempDir();
    try {
      const schema = buildSchema();
      const schemaPath = writeSchemaFile(dir, schema);
      const skillDir = join(dir, 'skill');
      mkdirSync(skillDir, { recursive: true });
      writeFileSync(join(skillDir, 'SKILL.md'), skillMarkdown(), 'utf-8');
      generateSkill({ schemaPath, skillDir });

      const manifestPath = join(skillDir, '.fluentui-skill-manifest.json');
      expect(checkFreshness({ schemaPath, manifestPath }).ok).toBe(true);

      // Change the schema without regenerating.
      schema.generatedAt = '2030-01-01T00:00:00Z';
      writeFileSync(schemaPath, JSON.stringify(schema, null, 2), 'utf-8');

      const result = checkFreshness({ schemaPath, manifestPath });
      expect(result.ok).toBe(false);
      expect(result.expected).not.toBe(result.actual);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

// ============================================================================
// Format
// ============================================================================

describe('format gate', () => {
  it('flags a body longer than the line limit', () => {
    const body = Array.from({ length: 501 }, (_, i) =>
      `line ${i + 1}`,
    ).join('\n');
    const findings = validateSkillFormat({
      markdown: skillMarkdown().replace(
        'See `references/index.md`.',
        body,
      ),
      dirName: 'fluentui',
    });
    expect(findings.some((finding) => finding.field === 'body')).toBe(true);
  });

  it('flags a frontmatter name that differs from the directory', () => {
    const findings = validateSkillFormat({
      markdown: skillMarkdown('not-fluentui'),
      dirName: 'fluentui',
    });
    expect(findings.some((finding) => finding.field === 'name')).toBe(true);
  });

  it('parses the frontmatter name', () => {
    expect(parseFrontmatter(skillMarkdown()).name).toBe('fluentui');
  });
});

// ============================================================================
// Secrets
// ============================================================================

describe('secrets gate', () => {
  it('fails when a reference contains a key-like string', () => {
    const findings = scanSecrets([
      {
        path: 'references/components/button.md',
        content: 'Set API_KEY=sk-abcdefghijklmnopqrstuvwxyz123456 in your shell.',
      },
    ]);
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0].file).toBe('references/components/button.md');
  });

  it('does not flag ordinary documentation', () => {
    const findings = scanSecrets([
      {
        path: 'references/components/button.md',
        content: 'Use `appearance="primary"` for the main action.',
      },
    ]);
    expect(findings).toHaveLength(0);
  });
});

// ============================================================================
// API references and coverage
// ============================================================================

describe('API-reference gate', () => {
  it('fails when a component mention is not in the schema or the package', () => {
    const enhanced = buildSchema();
    const report = checkApiReferences({
      enhancedSchema: enhanced,
      rawSchema: buildSchema(),
      packageExports: BUTTON_ONLY_EXPORTS,
    });
    // Sanity: the valid fixture passes.
    expect(report.errors).toHaveLength(0);

    const broken = buildSchema();
    broken.recipes[0].referencedComponents = ['NotARealComponent'];
    const brokenReport = checkApiReferences({
      enhancedSchema: broken,
      rawSchema: buildSchema(),
      packageExports: BUTTON_ONLY_EXPORTS,
    });
    expect(brokenReport.errors.length).toBeGreaterThan(0);
    expect(
      brokenReport.errors.some((finding) => finding.name === 'NotARealComponent'),
    ).toBe(true);
  });

  it('reports a prop label that does not resolve without failing the gate', () => {
    const enhanced = buildSchema();
    enhanced.components[0].enhanced = createComponentEnhanced({
      propGuidance: [{ prop: 'frobnicate', guidance: 'Never invented.' }],
    });

    const report = checkApiReferences({
      enhancedSchema: enhanced,
      rawSchema: buildSchema(),
      packageExports: BUTTON_ONLY_EXPORTS,
    });

    expect(report.errors).toHaveLength(0);
    expect(
      report.warnings.some((finding) => finding.name === 'frobnicate'),
    ).toBe(true);
  });
});

describe('coverage gate', () => {
  it('fails when a generated reference is missing or a relative link is broken', () => {
    const dir = makeTempDir();
    try {
      const schemaPath = writeSchemaFile(dir, buildSchema());
      const skillDir = join(dir, 'skill');
      mkdirSync(skillDir, { recursive: true });
      writeFileSync(join(skillDir, 'SKILL.md'), skillMarkdown(), 'utf-8');
      generateSkill({ schemaPath, skillDir });

      const componentRel = 'references/components/button.md';
      expect(existsSync(join(skillDir, componentRel))).toBe(true);
      expect(checkDrift({ schemaPath, skillDir }).differences).toHaveLength(0);

      // A deleted generated reference is drift (an entity lost its file).
      rmSync(join(skillDir, componentRel));
      expect(checkDrift({ schemaPath, skillDir }).differences).toContain(
        componentRel,
      );

      // A broken relative link is a coverage failure.
      writeTreeFile(
        skillDir,
        'references/foundation/getting-started.md',
        [
          '---',
          '',
          '# Getting started',
          '',
          'See [missing](../components/does-not-exist.md).',
          '',
          '<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->',
          '',
        ].join('\n'),
      );
      const report = checkDrift({ schemaPath, skillDir });
      expect(
        report.brokenLinks.some((link) =>
          link.target.includes('does-not-exist.md'),
        ),
      ).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
