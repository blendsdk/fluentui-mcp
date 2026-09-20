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
import { existsSync, readFileSync, readdirSync } from 'node:fs';
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
// Grep gate
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
// Removed paths
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

// ============================================================================
// Skill-first README (ST-36)
// ============================================================================

const README_PATH = join(REPO_ROOT, 'README.md');

// Tool names that only existed to serve the retired MCP server. The skill
// replaces them with reference documents, so the README must not advertise
// them.
const RETIRED_MCP_TOKENS = [
  'mcpServers',
  'query_component',
  'search_docs',
  'list_by_category',
  'get_foundation',
  'get_pattern',
  'get_enterprise',
  'suggest_components',
  'get_implementation_guide',
  'get_component_examples',
  'get_props_reference',
  'list_all_docs',
  'reindex',
];

describe('skill-first README', () => {
  it('documents the skill install command and no MCP setup', () => {
    const readme = readFileSync(README_PATH, 'utf-8');

    expect(readme).toContain('npx -y fluentui-skill skill install');
    for (const token of RETIRED_MCP_TOKENS) {
      expect(readme, `README still mentions "${token}"`).not.toContain(token);
    }
    expect(readme).not.toContain('npm install -g fluentui-mcp');
  });

  it('links only to files that exist in the repository', () => {
    const readme = readFileSync(README_PATH, 'utf-8');
    const targets = [...readme.matchAll(/\]\((?!https?:|mailto:|#)([^)]+)\)/g)]
      .map((match) => match[1].split('#')[0])
      .filter((target) => target.length > 0);

    const missing = targets.filter((target) => !existsSync(join(REPO_ROOT, target)));
    expect(missing).toEqual([]);
  });
});

// ============================================================================
// Architecture decision records (ST-37)
// ============================================================================

const DECISIONS_DIR = join(REPO_ROOT, 'requirements', 'decisions');
const REGISTER_PATH = join(REPO_ROOT, 'requirements', '00-ambiguity-register.md');

// The five decisions that authorised the skill-first architecture. Each one
// must exist and cite an ambiguity-register entry that actually exists.
const REQUIRED_ADR_NUMBERS = ['001', '002', '003', '004', '005'];

/** Resolves the file for an ADR number, or fails with a clear message. */
function adrFile(number: string): string {
  const match = readdirSync(DECISIONS_DIR).find((entry) => entry.startsWith(`ADR-${number}-`));
  if (match === undefined) {
    throw new Error(`missing ADR-${number}`);
  }
  return join(DECISIONS_DIR, match);
}

/** Reads the ambiguity register and returns the set of entry numbers. */
function registerEntryNumbers(): Set<number> {
  const text = readFileSync(REGISTER_PATH, 'utf-8');
  const numbers = new Set<number>();
  for (const line of text.split('\n')) {
    const match = /^\|\s*(\d+)\s*\|/.exec(line);
    if (match) {
      numbers.add(Number(match[1]));
    }
  }
  return numbers;
}

describe('architecture decision records', () => {
  it('ships ADR-001 through ADR-005', () => {
    for (const number of REQUIRED_ADR_NUMBERS) {
      expect(existsSync(adrFile(number)), `missing ADR-${number}`).toBe(true);
    }
  });

  it('cites only ambiguity register entries that exist', () => {
    const known = registerEntryNumbers();
    for (const number of REQUIRED_ADR_NUMBERS) {
      const text = readFileSync(adrFile(number), 'utf-8');
      const cited = [...text.matchAll(/\bAR-(\d+)\b/g)].map((match) => Number(match[1]));
      expect(cited.length, `ADR-${number} names no ambiguity register entry`).toBeGreaterThan(0);
      const unknown = cited.filter((entry) => !known.has(entry));
      expect(unknown, `ADR-${number} cites unknown ambiguity register entries`).toEqual([]);
    }
  });
});
