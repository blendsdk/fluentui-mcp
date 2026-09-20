/**
 * Implementation tests for the skill installer.
 *
 * These cover the mechanics behind the requirement-level behavior: atomic
 * replacement, backup recovery, leftover cleanup, symlink installs, refusal to
 * overwrite unrelated content, and argument parsing. They reach into the
 * module's internals, while `install-skill.spec.test.ts` remains the immutable
 * oracle for the required behavior.
 *
 * @module tests/skill/install-skill.impl
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  BACKUP_PREFIX,
  MARKER_FILE,
  SKILL_DIR_NAME,
  TEMP_PREFIX,
  detectClients,
  installSkill,
  main,
  parseArgs,
  readMarker,
  resolveTargets,
  uninstallSkill,
  type InstallerOptions,
} from '../../skill/install-skill.js';

// ============================================================================
// Fixtures & helpers
// ============================================================================

const createdDirs: string[] = [];

/** Create a throwaway directory removed after the current test. */
function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'fluentui-impl-'));
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

afterEach(() => {
  for (const dir of createdDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
  vi.restoreAllMocks();
});

// ============================================================================
// Atomic install
// ============================================================================

describe('installSkill atomic replacement', () => {
  it('replaces an existing install and updates the marker', () => {
    const source = makeSourceSkill();
    const target = makeTempDir();

    installSkill({ sourceDir: source, targetDir: target, version: '1.0.0' });
    writeFileSync(join(target, SKILL_DIR_NAME, 'stale.txt'), 'old');
    writeFileSync(join(source, 'fresh.txt'), 'new');

    installSkill({ sourceDir: source, targetDir: target, version: '2.0.0' });

    expect(existsSync(join(target, SKILL_DIR_NAME, 'stale.txt'))).toBe(false);
    expect(existsSync(join(target, SKILL_DIR_NAME, 'fresh.txt'))).toBe(true);
    expect(readMarker(join(target, SKILL_DIR_NAME))?.version).toBe('2.0.0');
  });

  it('leaves the previous install intact when the copy fails', () => {
    const source = makeSourceSkill();
    const target = makeTempDir();
    installSkill({ sourceDir: source, targetDir: target, version: '1.0.0' });

    vi.spyOn(fs, 'cpSync').mockImplementationOnce(() => {
      throw new Error('simulated copy failure');
    });

    expect(() =>
      installSkill({ sourceDir: source, targetDir: target, version: '2.0.0' }),
    ).toThrow('simulated copy failure');
    expect(readMarker(join(target, SKILL_DIR_NAME))?.version).toBe('1.0.0');
  });

  it('restores the backup when the final rename fails', () => {
    const source = makeSourceSkill();
    const target = makeTempDir();
    installSkill({ sourceDir: source, targetDir: target, version: '1.0.0' });

    const realRename = fs.renameSync.bind(fs);
    let renameCalls = 0;
    vi.spyOn(fs, 'renameSync').mockImplementation((from, to) => {
      renameCalls += 1;
      if (renameCalls === 2) {
        throw new Error('simulated rename failure');
      }
      realRename(from, to);
    });

    expect(() =>
      installSkill({ sourceDir: source, targetDir: target, version: '2.0.0' }),
    ).toThrow('simulated rename failure');
    expect(readMarker(join(target, SKILL_DIR_NAME))?.version).toBe('1.0.0');
    expect(existsSync(join(target, `${TEMP_PREFIX}${process.pid}`))).toBe(false);
  });

  it('removes leftover temp and backup directories before installing', () => {
    const source = makeSourceSkill();
    const target = makeTempDir();
    const temp = join(target, `${TEMP_PREFIX}1`);
    const backup = join(target, `${BACKUP_PREFIX}1`);
    mkdirSync(temp, { recursive: true });
    mkdirSync(backup, { recursive: true });

    installSkill({ sourceDir: source, targetDir: target, version: '1.0.0' });

    expect(existsSync(temp)).toBe(false);
    expect(existsSync(backup)).toBe(false);
    expect(existsSync(join(target, SKILL_DIR_NAME, 'SKILL.md'))).toBe(true);
  });

  it('does not delete user entries that share the leftover prefix', () => {
    const source = makeSourceSkill();
    const target = makeTempDir();
    const userTmp = join(target, `${TEMP_PREFIX}notes`);
    const userBackup = join(target, `${BACKUP_PREFIX}notes`);
    mkdirSync(userTmp, { recursive: true });
    mkdirSync(userBackup, { recursive: true });

    installSkill({ sourceDir: source, targetDir: target, version: '1.0.0' });

    expect(existsSync(userTmp)).toBe(true);
    expect(existsSync(userBackup)).toBe(true);
  });

  it('refuses a directory with an invalid marker and unrelated content', () => {
    const source = makeSourceSkill();
    const target = makeTempDir();
    const dest = join(target, SKILL_DIR_NAME);
    mkdirSync(dest, { recursive: true });
    writeFileSync(join(dest, MARKER_FILE), '{}');
    writeFileSync(join(dest, 'user-data.txt'), 'keep');

    expect(() => installSkill({ sourceDir: source, targetDir: target, version: '1.0.0' })).toThrow(
      /refusing to replace unrelated directory/,
    );
    expect(existsSync(join(dest, 'user-data.txt'))).toBe(true);
  });

  it('refuses to replace a directory that is not this skill', () => {
    const source = makeSourceSkill();
    const target = makeTempDir();
    mkdirSync(join(target, SKILL_DIR_NAME), { recursive: true });
    writeFileSync(join(target, SKILL_DIR_NAME, 'unrelated.txt'), 'keep me');

    expect(() => installSkill({ sourceDir: source, targetDir: target, version: '1.0.0' })).toThrow(
      /refusing to replace unrelated directory/,
    );
    expect(existsSync(join(target, SKILL_DIR_NAME, 'unrelated.txt'))).toBe(true);
  });

  it('rejects a source that is not a skill directory', () => {
    const emptySource = makeTempDir();
    const target = makeTempDir();

    expect(() =>
      installSkill({ sourceDir: emptySource, targetDir: target, version: '1.0.0' }),
    ).toThrow(/missing SKILL\.md/);
  });
});

// ============================================================================
// Dry run and symlink mode
// ============================================================================

describe('installSkill modes', () => {
  it('writes nothing in dry-run mode', () => {
    const source = makeSourceSkill();
    const target = makeTempDir();

    const result = installSkill({
      sourceDir: source,
      targetDir: target,
      version: '1.0.0',
      dryRun: true,
    });

    expect(result.dryRun).toBe(true);
    expect(existsSync(join(target, SKILL_DIR_NAME))).toBe(false);
    expect(readdirSafe(target)).toEqual([]);
  });

  it.runIf(process.platform !== 'win32')('links to the source instead of copying', () => {
    const source = makeSourceSkill();
    const target = makeTempDir();

    const result = installSkill({
      sourceDir: source,
      targetDir: target,
      version: '1.0.0',
      link: true,
    });

    expect(result.linked).toBe(true);
    expect(fs.lstatSync(join(target, SKILL_DIR_NAME)).isSymbolicLink()).toBe(true);

    uninstallSkill({ targetDir: target });

    expect(existsSync(join(target, SKILL_DIR_NAME))).toBe(false);
    expect(existsSync(join(source, 'SKILL.md'))).toBe(true);
  });
});

// ============================================================================
// Marker, detection, parsing
// ============================================================================

describe('readMarker', () => {
  it('returns undefined for a missing or invalid marker', () => {
    const target = makeTempDir();
    const dest = join(target, SKILL_DIR_NAME);
    mkdirSync(dest, { recursive: true });

    expect(readMarker(dest)).toBeUndefined();

    writeFileSync(join(dest, MARKER_FILE), '{ not json');
    expect(readMarker(dest)).toBeUndefined();

    writeFileSync(join(dest, MARKER_FILE), JSON.stringify({ version: 3 }));
    expect(readMarker(dest)).toBeUndefined();
  });
});

describe('detectClients and resolveTargets', () => {
  it('detects a client when its parent directory exists', () => {
    const home = makeTempDir();
    const cwd = makeTempDir();
    const claudeParent = join(home, '.claude');

    const detected = detectClients({
      home,
      cwd,
      exists: (path) => path === claudeParent,
    });

    expect(detected.map((client) => client.id)).toEqual(['claude']);
  });

  it('prefers explicit targets, then project, then global directories', () => {
    const detected = [
      { id: 'claude', globalDir: '/g/claude', projectDir: '/p/claude' },
    ];
    const explicit: InstallerOptions = {
      targets: ['/custom'],
      project: false,
      link: false,
      dryRun: false,
      all: false,
    };
    const project: InstallerOptions = { ...explicit, targets: [], project: true };
    const global: InstallerOptions = { ...explicit, targets: [], project: false };

    expect(resolveTargets(explicit, detected)).toEqual(['/custom']);
    expect(resolveTargets(project, detected)).toEqual(['/p/claude']);
    expect(resolveTargets(global, detected)).toEqual(['/g/claude']);
  });
});

describe('parseArgs', () => {
  it('parses the sub-command and flags', () => {
    const parsed = parseArgs(['uninstall', '--target', 'a', '--target', 'b', '--dry-run']);

    expect(parsed.command).toBe('uninstall');
    expect(parsed.options.targets).toEqual(['a', 'b']);
    expect(parsed.options.dryRun).toBe(true);
  });

  it('defaults to install and reports invalid arguments', () => {
    expect(parseArgs([]).command).toBe('install');
    expect(parseArgs(['--bogus']).error).toContain('unknown argument');
    expect(parseArgs(['--target']).error).toContain('requires a directory');
    expect(parseArgs(['-h']).command).toBe('help');
  });
});

describe('main', () => {
  it('returns an argument error code without touching the filesystem', async () => {
    const code = await main(['install', '--nope'], { home: makeTempDir(), cwd: makeTempDir() });

    expect(code).toBe(2);
  });

  it('strips control characters from a tampered marker version', async () => {
    const source = makeSourceSkill();
    const target = makeTempDir();
    installSkill({ sourceDir: source, targetDir: target, version: '1.0.0' });

    const markerPath = join(target, SKILL_DIR_NAME, MARKER_FILE);
    const marker: { version: string } = JSON.parse(readFileSync(markerPath, 'utf-8'));
    marker.version = '1.0.0\u001b[31m\u0007\u202e';
    writeFileSync(markerPath, JSON.stringify(marker));

    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const code = await main(['status', '--target', target], {
      home: makeTempDir(),
      cwd: makeTempDir(),
      version: '1.0.0',
      isTTY: false,
    });
    const output = log.mock.calls.flat().join(' ');
    log.mockRestore();

    expect(code).toBe(0);
    expect(output).toContain('1.0.0');
    expect(output).not.toMatch(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e]/);
  });
});

/**
 * Reads a directory's entries, treating a missing directory as empty.
 *
 * @param dir - Directory to read.
 * @returns Entry names.
 */
function readdirSafe(dir: string): string[] {
  return existsSync(dir) ? fs.readdirSync(dir) : [];
}
