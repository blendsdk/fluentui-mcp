/**
 * Implementation tests for the scraper provenance-capture helpers.
 *
 * These cover the internals behind the umbrella-package capture: the
 * `readPackageJson` layout tolerance and failure handling, and
 * `readUmbrellaPackage`'s found and absent paths. The end-to-end expectation
 * lives in the specification test; these tests pin the edge cases.
 *
 * @module tests/scraper/provenance-capture.impl
 */

import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { readPackageJson } from '../../../scripts/scraper/discover.js';
import { readUmbrellaPackage } from '../../../scripts/scraper/pipeline.js';
import { getVersionConfig } from '../../../scripts/scraper/config.js';
import type { VersionConfig } from '../../../scripts/scraper/types.js';

/** Temporary directories created by a test, removed after each test. */
const tempDirs: string[] = [];

/** Create a temporary directory tracked for cleanup. */
function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'fluentui-prov-impl-'));
  tempDirs.push(dir);
  return dir;
}

/** Write a package.json with the given contents into a directory. */
function writePackageJson(dir: string, contents: string): void {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'package.json'), contents, 'utf-8');
}

afterEach(() => {
  while (tempDirs.length > 0) {
    rmSync(tempDirs.pop() as string, { recursive: true, force: true });
  }
});

describe('readPackageJson', () => {
  it('reads a package.json at the directory root', () => {
    const dir = makeTempDir();
    writePackageJson(dir, JSON.stringify({ name: '@x/root', version: '1.2.3' }));

    expect(readPackageJson(dir)).toEqual({ name: '@x/root', version: '1.2.3' });
  });

  it('falls back to a library/package.json when the root has none', () => {
    const dir = makeTempDir();
    writePackageJson(
      join(dir, 'library'),
      JSON.stringify({ name: '@x/library', version: '4.5.6' }),
    );

    expect(readPackageJson(dir)).toEqual({
      name: '@x/library',
      version: '4.5.6',
    });
  });

  it('returns null for malformed JSON', () => {
    const dir = makeTempDir();
    writePackageJson(dir, '{ not json');

    expect(readPackageJson(dir)).toBeNull();
  });

  it('returns null when name or version is not a string', () => {
    const dir = makeTempDir();
    writePackageJson(dir, JSON.stringify({ name: '@x/missing-version' }));

    expect(readPackageJson(dir)).toBeNull();
  });

  it('returns null when no package.json exists', () => {
    const dir = makeTempDir();

    expect(readPackageJson(dir)).toBeNull();
  });
});

describe('readUmbrellaPackage', () => {
  it('returns the umbrella package name and version when present', () => {
    const source = makeTempDir();
    const config = getVersionConfig('v9');
    const umbrellaDir = join(
      source,
      config.paths.umbrellaPackageDir as string,
    );
    writePackageJson(
      umbrellaDir,
      JSON.stringify({
        name: '@fluentui/react-components',
        version: '9.48.0',
      }),
    );

    expect(readUmbrellaPackage(source, config)).toEqual({
      packageName: '@fluentui/react-components',
      packageVersion: '9.48.0',
    });
  });

  it('returns undefined when the umbrella package is absent', () => {
    const source = makeTempDir();

    expect(readUmbrellaPackage(source, getVersionConfig('v9'))).toBeUndefined();
  });

  it('returns undefined when the config names no umbrella directory', () => {
    const source = makeTempDir();
    const base = getVersionConfig('v9');
    const config: VersionConfig = {
      ...base,
      paths: { ...base.paths, umbrellaPackageDir: undefined },
    };

    expect(readUmbrellaPackage(source, config)).toBeUndefined();
  });
});
