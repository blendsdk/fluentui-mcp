/**
 * Specification tests for the hand-written `SKILL.md` guidance.
 *
 * Derived from the provenance requirement: the skill must instruct the reader
 * to disclose the covered version, to list the reference files it consulted,
 * and to say "not covered by this skill version" for anything absent. The
 * frontmatter compatibility must state the real React peer range.
 *
 * These tests are authored before the guidance exists and must never be edited
 * to match the wording. A failing test means the skill does not meet the
 * requirement.
 *
 * @module tests/skill/skill-guidance.spec
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Absolute path of the committed, hand-written skill file. */
const SKILL_MD_PATH = join(
  process.cwd(),
  '.agents',
  'skills',
  'fluentui',
  'SKILL.md',
);

/** Read the committed skill file. */
function readSkill(): string {
  return readFileSync(SKILL_MD_PATH, 'utf-8');
}

describe('provenance disclosure rule', () => {
  it('points the reader at the provenance section in references/index.md', () => {
    expect(readSkill()).toMatch(/`## Source & versions` in `references\/index\.md`/);
  });

  it('requires the agent to say when something is not covered', () => {
    expect(readSkill()).toContain('not covered by this skill version');
  });

  it('requires the agent to cite the covered version', () => {
    const markdown = readSkill();
    expect(markdown).toMatch(/covered\s+(?:Fluent\s+UI\s+)?version/i);
  });

  it('requires the agent to list the reference files it used', () => {
    const markdown = readSkill();
    expect(markdown).toMatch(/reference files?\s+(?:you|it)\s+used/i);
  });
});

describe('React compatibility', () => {
  it('states the real React peer range', () => {
    expect(readSkill()).toContain('>=16.14.0 <20.0.0');
  });
});
