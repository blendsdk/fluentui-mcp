/**
 * Implementation tests for the skill renderers and generator internals.
 *
 * Spec tests pin the externally required behavior; these tests cover the
 * mechanics the spec tests do not reach directly: Markdown escaping, code-fence
 * selection, story ranking, empty-section omission, manifest determinism,
 * `--check` drift reporting, and the promise that every internal link resolves.
 *
 * @module tests/skill/render.impl
 */

import { describe, it, expect } from 'vitest';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';

import {
  EMPTY_CELL,
  appendMarker,
  bulletList,
  escapeTableCell,
  fencedCode,
  inlineCode,
  joinSections,
  table,
} from '../../../scripts/skill/render/sections.js';
import {
  renderPropGuidance,
  renderPropsTable,
  renderSlotsTable,
} from '../../../scripts/skill/render/props.js';
import {
  MAX_COMPONENT_STORIES,
  renderExamplesSection,
  selectStories,
} from '../../../scripts/skill/render/stories.js';
import {
  GENERATED_MARKER,
  buildSkillFiles,
  isSafeSkillId,
  type SkillRenderContext,
} from '../../../scripts/skill/mapping.js';
import { buildManifest, hashContent } from '../../../scripts/skill/manifest.js';
import { generateSkill } from '../../../scripts/skill/generate.js';
import type { FluentUISchema } from '../../../src/types/schema.js';
import {
  createCategoryGuidanceEntry,
  createComponentEntry,
  createFluentUISchema,
  createGuideEntry,
  createPropEntry,
  createRecipeEntry,
  createSlotEntry,
  createStoryEntry,
} from '../fixtures/helpers.js';

// ============================================================================
// Markdown primitives
// ============================================================================

/** Render context used by the mapping tests. */
const TEST_CONTEXT: SkillRenderContext = {
  skillVersion: '1.0.0',
  generatorVersion: '1.1.0',
  schemaHash: '0123456789abcdef',
};

describe('Markdown primitives', () => {
  it('joins sections with blank lines and drops blanks', () => {
    expect(joinSections(['a', '', undefined, false, 'b'])).toBe('a\n\nb');
    expect(joinSections([])).toBe('');
  });

  it('escapes pipes and collapses newlines in table cells', () => {
    expect(escapeTableCell("'a' | 'b'")).toBe("'a' \\| 'b'");
    expect(escapeTableCell('line one\nline two')).toBe('line one line two');
  });

  it('renders inline code and falls back to the empty placeholder', () => {
    expect(inlineCode('appearance')).toBe('`appearance`');
    expect(inlineCode('a | b')).toBe('`a \\| b`');
    expect(inlineCode('  ')).toBe(EMPTY_CELL);
    expect(inlineCode(undefined)).toBe(EMPTY_CELL);
  });

  it('renders a table with a divider row', () => {
    const rendered = table(['A', 'B'], [['1', '2']]);
    expect(rendered).toBe('| A | B |\n| --- | --- |\n| 1 | 2 |');
  });

  it('renders an empty bullet list as an empty string', () => {
    expect(bulletList(['x', '', 'y'])).toBe('- x\n- y');
    expect(bulletList([])).toBe('');
  });

  it('uses a fence longer than any backtick run in the code', () => {
    expect(fencedCode('const x = 1;', 'ts')).toBe('```ts\nconst x = 1;\n```');

    const withFence = fencedCode('```\ninner\n```', 'md');
    expect(withFence.startsWith('````md')).toBe(true);
    expect(withFence.endsWith('````')).toBe(true);

    expect(fencedCode('   ', 'tsx')).toBe('');
    expect(fencedCode('a\r\nb', 'tsx')).toBe('```tsx\na\nb\n```');
  });

  it('appends the marker as the final content', () => {
    const marked = appendMarker('# Title\n\nBody\n\n', GENERATED_MARKER);
    expect(marked.trimEnd().endsWith(GENERATED_MARKER)).toBe(true);
    expect(marked.endsWith('\n')).toBe(true);
  });
});

// ============================================================================
// Props and slots
// ============================================================================

describe('props and slots rendering', () => {
  it('renders a props table with an empty-state notice', () => {
    const empty = createComponentEntry('Empty', { props: [] });
    expect(renderPropsTable(empty)).toBe('_No documented props._');
  });

  it('sorts props, escapes types, and annotates deprecations', () => {
    const component = createComponentEntry('Button', {
      props: [
        createPropEntry('size', { type: "'small' | 'large'" }),
        createPropEntry('appearance', {
          type: "'primary' | 'secondary'",
          required: true,
        }),
        createPropEntry('legacy', {
          deprecated: true,
          deprecationMessage: 'Use appearance.',
        }),
      ],
    });
    const rendered = renderPropsTable(component);

    expect(rendered).toContain('\\|');
    expect(rendered.indexOf('| `appearance`')).toBeLessThan(
      rendered.indexOf('| `size`'),
    );
    expect(rendered).toContain('**Deprecated:**');
  });

  it('renders a slots table with alternative element types', () => {
    const component = createComponentEntry('Link', {
      slots: [
        createSlotEntry('root', {
          elementType: 'a',
          alternativeTypes: ['button'],
          required: true,
        }),
      ],
    });
    const rendered = renderSlotsTable(component);
    expect(rendered).toContain('`a \\| button`');
  });

  it('omits the slots table when there are no slots', () => {
    const component = createComponentEntry('Icon', { slots: [] });
    expect(renderSlotsTable(component)).toBe('');
  });

  it('omits prop guidance when there is none', () => {
    const component = createComponentEntry('Button');
    expect(renderPropGuidance(component)).toBe('');
  });
});

// ============================================================================
// Story selection
// ============================================================================

describe('story selection', () => {
  it('prefers the default story, then appearance, then source order', () => {
    const stories = [
      createStoryEntry('Size'),
      createStoryEntry('Appearance'),
      createStoryEntry('Default'),
      createStoryEntry('WithIcon'),
    ];
    const selected = selectStories(stories, MAX_COMPONENT_STORIES);
    expect(selected.map((story) => story.name)).toEqual([
      'Default',
      'Appearance',
      'Size',
    ]);
  });

  it('skips stories without code and honours the cap', () => {
    const stories = [
      createStoryEntry('Default'),
      createStoryEntry('Blank', { code: '', renderCode: '' }),
      createStoryEntry('One'),
      createStoryEntry('Two'),
      createStoryEntry('Three'),
    ];
    const selected = selectStories(stories, 2);
    expect(selected.map((story) => story.name)).toEqual(['Default', 'One']);
  });

  it('omits the Examples section when no story has code', () => {
    const component = createComponentEntry('Empty', {
      stories: [createStoryEntry('Blank', { code: '', renderCode: '' })],
    });
    expect(renderExamplesSection(component)).toBe('');
  });
});

// ============================================================================
// Mapping internals
// ============================================================================

describe('mapping safety and ordering', () => {
  it('rejects an unknown recipe group', () => {
    const schema = createFluentUISchema({
      recipes: [createRecipeEntry('login-form', { group: 'bogus' })],
    });
    expect(() => buildSkillFiles(schema, TEST_CONTEXT)).toThrow(/Unknown recipe group "bogus"/);
  });

  it('rejects an unsafe component id before building files', () => {
    const schema = createFluentUISchema({
      components: [createComponentEntry('Button', { id: '../evil' })],
    });
    expect(() => buildSkillFiles(schema, TEST_CONTEXT)).toThrow(/Unsafe component id/);
  });

  it('orders recipe files by group order then id', () => {
    const schema = createFluentUISchema({
      recipes: [
        createRecipeEntry('data-table', { group: 'data' }),
        createRecipeEntry('login-form', { group: 'forms' }),
        createRecipeEntry('settings-form', { group: 'forms' }),
      ],
    });
    const paths = buildSkillFiles(schema, TEST_CONTEXT)
      .map((file) => file.path)
      .filter((path) => path.startsWith('references/recipes/'));
    expect(paths).toEqual([
      'references/recipes/forms/login-form.md',
      'references/recipes/forms/settings-form.md',
      'references/recipes/data/data-table.md',
    ]);
  });

  it('treats only lowercase kebab-case ids as safe', () => {
    expect(isSafeSkillId('compound-button')).toBe(true);
    expect(isSafeSkillId('CompoundButton')).toBe(false);
    expect(isSafeSkillId('a_b')).toBe(false);
    expect(isSafeSkillId('a/b')).toBe(false);
  });
});

// ============================================================================
// Manifest
// ============================================================================

describe('manifest', () => {
  it('hashes content deterministically', () => {
    expect(hashContent('abc')).toBe(hashContent('abc'));
    expect(hashContent('abc')).not.toBe(hashContent('abd'));
  });

  it('derives generatedAt from the schema, not the clock', () => {
    const schema = createFluentUISchema({
      generatedAt: '2020-01-02T03:04:05Z',
      components: [createComponentEntry('Button')],
    });
    const manifest = buildManifest(schema, buildSkillFiles(schema, TEST_CONTEXT));
    expect(manifest.generatedAt).toBe('2020-01-02T03:04:05Z');
    expect(manifest.files['references/components/button.md']).toMatch(/^[0-9a-f]{64}$/);
  });
});

// ============================================================================
// Generator: check mode and link integrity
// ============================================================================

/** Build a small but link-rich schema for generator tests. */
function buildLinkSchema(): FluentUISchema {
  return createFluentUISchema({
    components: [
      createComponentEntry('Button', {
        enhanced: undefined,
      }),
      createComponentEntry('Input', {
        category: 'forms',
        relatedComponents: ['Button'],
      }),
    ],
    foundation: [createGuideEntry('getting-started')],
    categoryGuidance: [
      createCategoryGuidanceEntry('buttons', { componentIds: ['button'] }),
      createCategoryGuidanceEntry('forms', { componentIds: ['input'] }),
    ],
    recipes: [
      createRecipeEntry('login-form', {
        group: 'forms',
        referencedComponents: ['Input', 'Button'],
      }),
    ],
    quickReference: [createGuideEntry('setup-imports')],
  });
}

/** Seed a skill root with the hand-written files the generator preserves. */
function seedSkillDir(skillDir: string): void {
  mkdirSync(join(skillDir, 'assets', 'templates'), { recursive: true });
  writeFileSync(
    join(skillDir, 'SKILL.md'),
    '---\nname: fluentui\ndescription: test\nlicense: MIT\n---\n\n# FluentUI\n',
    'utf-8',
  );
}

/**
 * Remove fenced code blocks from a document.
 *
 * Example code can contain link-shaped text (for example a Storybook URL in a
 * description string), so links are checked only in prose.
 */
function stripCodeFences(markdown: string): string {
  let inFence = false;
  const kept: string[] = [];
  for (const line of markdown.split('\n')) {
    if (/^\s*`{3,}/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence) {
      kept.push(line);
    }
  }
  return kept.join('\n');
}

/** List every file under a root as POSIX-style relative paths. */
function listFiles(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else {
        out.push(relative(root, full).split(sep).join('/'));
      }
    }
  };
  walk(root);
  return out.sort();
}

describe('generator check mode', () => {
  it('reports no drift immediately after generation', () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-check-'));
    try {
      const schemaPath = join(root, 'schema.json');
      writeFileSync(schemaPath, JSON.stringify(buildLinkSchema()), 'utf-8');
      const skillDir = join(root, 'skill');
      seedSkillDir(skillDir);

      generateSkill({ schemaPath, skillDir });
      const result = generateSkill({ schemaPath, skillDir, check: true });
      expect(result.differences).toEqual([]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('reports a changed file and a stale generated file without writing', () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-drift-'));
    try {
      const schemaPath = join(root, 'schema.json');
      writeFileSync(schemaPath, JSON.stringify(buildLinkSchema()), 'utf-8');
      const skillDir = join(root, 'skill');
      seedSkillDir(skillDir);

      generateSkill({ schemaPath, skillDir });

      const changed = join(skillDir, 'references', 'components', 'button.md');
      writeFileSync(changed, 'tampered', 'utf-8');
      const stale = join(skillDir, 'references', 'components', 'stale.md');
      writeFileSync(stale, 'stale', 'utf-8');

      const result = generateSkill({ schemaPath, skillDir, check: true });
      expect(result.differences).toContain('references/components/button.md');
      expect(result.differences).toContain('references/components/stale.md');
      // Check mode must not repair anything.
      expect(readFileSync(changed, 'utf-8')).toBe('tampered');
      expect(existsSync(stale)).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe('generated link integrity', () => {
  it('resolves every relative reference link inside the tree', () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-links-'));
    try {
      const schemaPath = join(root, 'schema.json');
      writeFileSync(schemaPath, JSON.stringify(buildLinkSchema()), 'utf-8');
      const skillDir = join(root, 'skill');
      seedSkillDir(skillDir);
      generateSkill({ schemaPath, skillDir });

      const files = listFiles(skillDir).filter((path) =>
        path.startsWith('references/'),
      );
      expect(files.length).toBeGreaterThan(0);

      const broken: string[] = [];
      for (const rel of files) {
        // Story code can embed Markdown links (for example a Storybook
        // description string), so ignore anything inside a code fence.
        const content = stripCodeFences(
          readFileSync(join(skillDir, rel), 'utf-8'),
        );
        for (const match of content.matchAll(/\]\(([^)]+)\)/g)) {
          const target = match[1].split('#')[0];
          if (target === '' || /^[a-z]+:/i.test(target)) {
            continue;
          }
          const resolved = resolve(join(skillDir, dirname(rel)), target);
          if (!resolved.startsWith(resolve(skillDir)) || !existsSync(resolved)) {
            broken.push(`${rel} -> ${target}`);
          }
        }
      }
      expect(broken).toEqual([]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
