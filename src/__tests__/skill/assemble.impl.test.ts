/**
 * Implementation tests for the packaged-skill assemble step.
 *
 * These pin the mechanics: the source and destination are always derived from
 * the project root, the destination is fully replaced, and a missing source
 * fails loudly. The step accepts no destination override, so it can only ever
 * touch `<cwd>/skills/fluentui`.
 *
 * @module tests/skill/assemble.impl
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { DEST_DIR, SOURCE_DIR, assembleSkill, runAssemble } from '../../../scripts/skill/assemble.js';

// ============================================================================
// Fixtures & helpers
// ============================================================================

const createdDirs: string[] = [];

/** Create a throwaway project root removed after the current test. */
function makeProject(): string {
  const dir = mkdtempSync(join(tmpdir(), 'fluentui-assemble-'));
  createdDirs.push(dir);
  return dir;
}

/** Write a minimal committed skill tree under a project root. */
function writeSource(projectRoot: string): void {
  const source = join(projectRoot, SOURCE_DIR);
  mkdirSync(join(source, 'references'), { recursive: true });
  writeFileSync(join(source, 'SKILL.md'), '# FluentUI\n');
  writeFileSync(join(source, 'references', 'index.md'), '# Index\n');
}

afterEach(() => {
  for (const dir of createdDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
  vi.restoreAllMocks();
});

// ============================================================================
// assembleSkill
// ============================================================================

describe('assembleSkill', () => {
  it('copies the committed tree into the packaged location', () => {
    const projectRoot = makeProject();
    writeSource(projectRoot);

    const result = assembleSkill(projectRoot);

    expect(result.destDir).toBe(join(projectRoot, DEST_DIR));
    expect(result.files).toBe(2);
    expect(existsSync(join(projectRoot, DEST_DIR, 'SKILL.md'))).toBe(true);
    expect(existsSync(join(projectRoot, DEST_DIR, 'references', 'index.md'))).toBe(true);
  });

  it('replaces a stale packaged tree', () => {
    const projectRoot = makeProject();
    writeSource(projectRoot);
    const stale = join(projectRoot, DEST_DIR, 'stale.txt');
    mkdirSync(join(projectRoot, DEST_DIR), { recursive: true });
    writeFileSync(stale, 'old');

    assembleSkill(projectRoot);

    expect(existsSync(stale)).toBe(false);
  });

  it('throws when the committed source is missing', () => {
    const projectRoot = makeProject();

    expect(() => assembleSkill(projectRoot)).toThrow(/missing SKILL\.md/);
  });
});

// ============================================================================
// runAssemble
// ============================================================================

describe('runAssemble', () => {
  it('returns 0 on success and 1 on a missing source', () => {
    const projectRoot = makeProject();
    writeSource(projectRoot);

    const log = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    expect(runAssemble(projectRoot)).toBe(0);
    log.mockRestore();

    const emptyProject = makeProject();
    const error = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    expect(runAssemble(emptyProject)).toBe(1);
    error.mockRestore();
  });
});
