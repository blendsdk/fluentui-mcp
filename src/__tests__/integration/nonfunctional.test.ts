/**
 * Non-functional verification of the generated skill.
 *
 * These tests exercise the skill as a consumer would receive it: the committed
 * tree is installed into a throwaway skills directory and inspected. They prove
 * that the installed skill is a static corpus of Markdown and one manifest. It
 * contains no scripts, no dependency manifest, and no executable files, and
 * every relative link resolves inside the tree. Reading it needs no network, no
 * package install, and no interpreter.
 *
 * @module tests/integration/nonfunctional
 */

import { describe, it, expect, afterAll } from 'vitest';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';

import { installSkill } from '../../skill/install-skill.js';

/** The hand-written and generated skill tree committed to the repository. */
const SOURCE_DIR = join(process.cwd(), '.agents', 'skills', 'fluentui');

/** Scratch workspace removed after the suite. */
const WORK_DIR = mkdtempSync(join(tmpdir(), 'fluentui-skill-nonfunctional-'));

/** Skills directory the installer copies into. */
const TARGET_DIR = join(WORK_DIR, 'skills');

/** Recursively list every file under a directory. */
function walk(root: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const full = join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  return files;
}

afterAll(() => {
  rmSync(WORK_DIR, { recursive: true, force: true });
});

describe('offline use', () => {
  /** The installed `<target>/fluentui` directory, set by the install test. */
  let installedDir = '';

  it('installs a static tree with no scripts, dependencies, or executables', () => {
    const result = installSkill({
      sourceDir: SOURCE_DIR,
      targetDir: TARGET_DIR,
      version: '9.9.9-test',
    });

    expect(result.installed).toBe(true);
    installedDir = result.dest;

    const files = walk(installedDir);
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      // Markdown and the single manifest are the whole corpus. A script or a
      // dependency manifest would mean the skill needs more than a reader.
      expect(file.endsWith('.md') || file.endsWith('.json')).toBe(true);
      expect(file.endsWith('package.json')).toBe(false);
      // Data files only: nothing in the skill is meant to be executed.
      expect(statSync(file).mode & 0o111).toBe(0);
    }

    expect(files.some((file) => file.includes('node_modules'))).toBe(false);
    expect(existsSync(join(installedDir, 'SKILL.md'))).toBe(true);
  });

  it('resolves every relative link inside the installed tree', () => {
    expect(installedDir).not.toBe('');
    const missing: string[] = [];

    for (const file of walk(installedDir).filter((path) => path.endsWith('.md'))) {
      const content = readFileSync(file, 'utf-8');
      for (const match of content.matchAll(/\]\(([^)\s]+)\)/g)) {
        const link = match[1];
        // External URLs are allowed to need the network; a leftover fragment or
        // query with no path is not a file reference either.
        if (/^(https?:|mailto:)/.test(link)) {
          continue;
        }
        const [pathPart] = link.split(/[?#]/);
        if (pathPart === '') {
          continue;
        }
        const target = resolve(dirname(file), decodeURIComponent(pathPart));
        if (!existsSync(target)) {
          missing.push(`${relative(installedDir, file)} -> ${link}`);
        }
      }
    }

    expect(missing).toEqual([]);
  });
});
