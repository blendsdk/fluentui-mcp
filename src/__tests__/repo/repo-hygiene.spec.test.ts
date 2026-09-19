/**
 * Repository hygiene specification tests.
 *
 * These tests are the oracle for the retirement requirements: after the MCP
 * server, the legacy `docs/` corpus, and the `techdocs/` site are removed, no
 * tracked file may still point at them. They scan the tracked working tree
 * (not git history) and ignore the planning and requirements folders, which
 * intentionally keep describing the retired system.
 *
 * `git ls-files` is used instead of a filesystem walk so that ignored build
 * output (`dist/`, `skills/`, `.cache/`) and installed packages never enter the
 * scan. Files deleted from the working tree are simply skipped, so the tests
 * can run before the deletion is committed.
 *
 * @module tests/repo/repo-hygiene
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// ============================================================================
// Scan scope
// ============================================================================

const TEST_FILE = fileURLToPath(import.meta.url);
const REPO_ROOT = resolve(dirname(TEST_FILE), '../../..');
const RELATIVE_TEST_FILE = 'src/__tests__/repo/repo-hygiene.spec.test.ts';

// Folders whose contents may legitimately name the retired system. They
// document the migration rather than shipping it.
const IGNORED_PREFIXES = ['plans/', 'requirements/'];

/** Lists the tracked files that fall inside the hygiene scan scope. */
function scanTargets(): string[] {
  const output = execFileSync('git', ['ls-files', '-z'], {
    cwd: REPO_ROOT,
    encoding: 'utf-8',
    maxBuffer: 64 * 1024 * 1024,
  });

  return output
    .split('\0')
    .filter((path) => path.length > 0)
    .filter((path) => path !== RELATIVE_TEST_FILE)
    .filter((path) => !IGNORED_PREFIXES.some((prefix) => path.startsWith(prefix)));
}

/** Returns the tracked files whose text contains `needle`. */
function referencingFiles(needle: string): string[] {
  const matches: string[] = [];

  for (const path of scanTargets()) {
    let text: string;
    try {
      text = readFileSync(join(REPO_ROOT, path), 'utf-8');
    } catch {
      // A tracked file missing from the working tree is an uncommitted deletion.
      continue;
    }
    if (text.includes(needle)) {
      matches.push(path);
    }
  }

  return matches;
}

// ============================================================================
// Grep gate (ST-34)
// ============================================================================

describe('repository hygiene', () => {
  it('has no MCP SDK references', () => {
    expect(referencingFiles('@modelcontextprotocol')).toEqual([]);
  });

  it('has no legacy docs corpus references', () => {
    expect(referencingFiles('docs/v9')).toEqual([]);
  });

  it('has no techdocs site references', () => {
    expect(referencingFiles('techdocs/')).toEqual([]);
  });
});

// ============================================================================
// Removed paths (ST-34, RD-06 acceptance criteria 2 and 3)
// ============================================================================

describe('removed paths', () => {
  it('has no MCP runtime entry points', () => {
    for (const path of ['src/index.ts', 'src/server.ts', 'src/config.ts', 'src/tools', 'src/search', 'src/formatters']) {
      expect(existsSync(join(REPO_ROOT, path))).toBe(false);
    }
  });

  it('has no retired documentation sites', () => {
    for (const path of ['docs', 'techdocs', '.github/workflows/deploy-techdocs.yml']) {
      expect(existsSync(join(REPO_ROOT, path))).toBe(false);
    }
  });
});
