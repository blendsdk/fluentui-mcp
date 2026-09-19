/**
 * Specification tests for the skill installer and the published package.
 *
 * Authored BEFORE the installer exists. They pin the required behavior of the
 * `fluentui skill install|status|uninstall` commands and the packaging
 * contract. The oracle comes from the requirement, never from the
 * implementation: a failing spec test means the implementation is wrong.
 *
 * The installer writes outside the repository, into a user's skill
 * directories. Every test therefore works inside a throwaway temp directory
 * and injects the home/project/source inputs, so no real client directory is
 * ever touched.
 *
 * @module tests/skill/install-skill.spec
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import {
  MARKER_FILE,
  SKILL_DIR_NAME,
  main,
  type InstallerIo,
} from '../../skill/install-skill.js';

// ============================================================================
// Fixtures & helpers
// ============================================================================

/** Every temp directory created by a test, removed after the test finishes. */
const createdDirs: string[] = [];

/** Create a throwaway directory removed after the current test. */
function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'fluentui-install-'));
  createdDirs.push(dir);
  return dir;
}

/** Create a minimal skill source tree that can be installed. */
function makeSourceSkill(): string {
  const dir = makeTempDir();
  mkdirSync(join(dir, 'references'), { recursive: true });
  writeFileSync(
    join(dir, 'SKILL.md'),
    ['---', 'name: fluentui', 'description: Test skill.', '---', '', '# FluentUI', ''].join('\n'),
  );
  writeFileSync(join(dir, 'references', 'index.md'), '# Index\n');
  return dir;
}

/** Build the injectable environment shared by the CLI calls in this file. */
function makeIo(sourceDir: string): InstallerIo {
  return {
    home: makeTempDir(),
    cwd: makeTempDir(),
    version: '1.2.3',
    isTTY: false,
    sourceDir,
  };
}

afterEach(() => {
  for (const dir of createdDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
  vi.restoreAllMocks();
});

// ============================================================================
// ST-27 — packaging contract
// ============================================================================

describe('ST-27 packaging contract', () => {
  const pkg = JSON.parse(
    readFileSync(new URL('../../../package.json', import.meta.url), 'utf-8'),
  ) as {
    name: string;
    bin: Record<string, string>;
    files: string[];
    engines?: { node?: string };
  };

  it('names the package fluentui-skill and exposes the fluentui bin', () => {
    expect(pkg.name).toBe('fluentui-skill');
    expect(pkg.bin).toEqual({ fluentui: 'dist/bin.js' });
  });

  it('publishes dist, skills, README and LICENSE but not data', () => {
    expect(pkg.files).toEqual(
      expect.arrayContaining(['dist/', 'skills/', 'README.md', 'LICENSE']),
    );
    expect(pkg.files.some((entry) => entry.startsWith('data'))).toBe(false);
  });

  it('requires Node 20 or newer', () => {
    expect(pkg.engines?.node).toBe('>=20');
  });

  it('packs skills and dist while leaving data out', () => {
    const pkgDir = makeTempDir();
    writeFileSync(join(pkgDir, 'package.json'), JSON.stringify(pkg));
    mkdirSync(join(pkgDir, 'dist'), { recursive: true });
    writeFileSync(join(pkgDir, 'dist', 'bin.js'), '#!/usr/bin/env node\n');
    mkdirSync(join(pkgDir, 'skills', 'fluentui'), { recursive: true });
    writeFileSync(join(pkgDir, 'skills', 'fluentui', 'SKILL.md'), '# FluentUI\n');
    mkdirSync(join(pkgDir, 'data'), { recursive: true });
    writeFileSync(join(pkgDir, 'data', 'fluentui-schema.json'), '{}');

    const output = execFileSync('npm', ['pack', '--ignore-scripts', '--dry-run', '--json'], {
      cwd: pkgDir,
      encoding: 'utf-8',
    });
    const packed = JSON.parse(output) as Array<{ files: Array<{ path: string }> }>;
    const paths = packed[0].files.map((file) => file.path);

    expect(paths).toContain('skills/fluentui/SKILL.md');
    expect(paths.some((path) => path.startsWith('dist/'))).toBe(true);
    expect(paths.some((path) => path.startsWith('data/'))).toBe(false);
  });
});

// ============================================================================
// ST-28 — install
// ============================================================================

describe('ST-28 install', () => {
  it('creates the skill and a marker with the package version', async () => {
    const target = makeTempDir();
    const source = makeSourceSkill();
    const io = makeIo(source);

    const code = await main(['install', '--target', target], io);

    expect(code).toBe(0);
    expect(existsSync(join(target, SKILL_DIR_NAME, 'SKILL.md'))).toBe(true);

    const marker = JSON.parse(
      readFileSync(join(target, SKILL_DIR_NAME, MARKER_FILE), 'utf-8'),
    ) as { version: string; source: string; installedAt: string };
    expect(marker.version).toBe('1.2.3');
    expect(marker.source).toBe('fluentui-skill');
    expect(Number.isNaN(Date.parse(marker.installedAt))).toBe(false);
  });
});

// ============================================================================
// ST-29 — status
// ============================================================================

describe('ST-29 status', () => {
  it('reports the installed version and exits non-zero when absent', async () => {
    const target = makeTempDir();
    const io = makeIo(makeSourceSkill());
    await main(['install', '--target', target], io);

    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const installedCode = await main(['status', '--target', target], io);
    const installedOutput = log.mock.calls.flat().join(' ');
    log.mockRestore();

    expect(installedCode).toBe(0);
    expect(installedOutput).toContain('1.2.3');

    const empty = makeTempDir();
    const absentCode = await main(['status', '--target', empty], io);
    expect(absentCode).not.toBe(0);
  });
});

// ============================================================================
// ST-30 — uninstall
// ============================================================================

describe('ST-30 uninstall', () => {
  it('removes only the fluentui directory and leaves siblings intact', async () => {
    const target = makeTempDir();
    const io = makeIo(makeSourceSkill());
    mkdirSync(join(target, 'other-skill'), { recursive: true });
    writeFileSync(join(target, 'other-skill', 'SKILL.md'), '# Other\n');

    await main(['install', '--target', target], io);
    const code = await main(['uninstall', '--target', target], io);

    expect(code).toBe(0);
    expect(existsSync(join(target, SKILL_DIR_NAME))).toBe(false);
    expect(existsSync(join(target, 'other-skill', 'SKILL.md'))).toBe(true);
  });
});

// ============================================================================
// ST-31 — interrupted install recovery
// ============================================================================

describe('ST-31 interrupted install', () => {
  it('cleans a leftover temp directory and re-installs successfully', async () => {
    const target = makeTempDir();
    const io = makeIo(makeSourceSkill());
    const leftover = join(target, '.fluentui-skill.tmp-999');
    mkdirSync(leftover, { recursive: true });
    writeFileSync(join(leftover, 'junk'), 'partial');

    const code = await main(['install', '--target', target], io);

    expect(code).toBe(0);
    expect(existsSync(leftover)).toBe(false);
    expect(existsSync(join(target, SKILL_DIR_NAME, 'SKILL.md'))).toBe(true);
  });
});

// ============================================================================
// ST-32 — dry run
// ============================================================================

describe('ST-32 dry run', () => {
  it('writes nothing and prints the resolved destination', async () => {
    const target = makeTempDir();
    const io = makeIo(makeSourceSkill());
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});

    const code = await main(['install', '--target', target, '--dry-run'], io);
    const output = log.mock.calls.flat().join(' ');
    log.mockRestore();

    expect(code).toBe(0);
    expect(existsSync(join(target, SKILL_DIR_NAME))).toBe(false);
    expect(output).toContain(join(target, SKILL_DIR_NAME));
  });
});

// ============================================================================
// ST-33 — path safety
// ============================================================================

describe('ST-33 path safety', () => {
  it('resolves .. safely and never writes outside the resolved target', async () => {
    const root = makeTempDir();
    const io = makeIo(makeSourceSkill());
    const trickyTarget = join(root, 'nested', '..', 'target');
    const resolvedTarget = resolve(trickyTarget);

    const code = await main(['install', '--target', trickyTarget], io);

    expect(code).toBe(0);
    expect(existsSync(join(resolvedTarget, SKILL_DIR_NAME, 'SKILL.md'))).toBe(true);
    expect(existsSync(join(root, SKILL_DIR_NAME))).toBe(false);
    expect(existsSync(join(root, 'nested'))).toBe(false);
  });
});
