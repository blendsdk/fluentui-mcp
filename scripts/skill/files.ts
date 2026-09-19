/**
 * Filesystem helpers shared by the integrity gates.
 *
 * The gates all walk the same skill tree and read the same kind of files, so
 * the listing and reading logic lives here once. Paths are always returned as
 * POSIX-style relative paths, which keeps reports stable across platforms.
 *
 * @module skill/files
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/** A file path (relative to some root) paired with its UTF-8 content. */
export interface TextFile {
  /** POSIX-style path relative to the root passed to {@link readTextFiles}. */
  path: string;

  /** The file's UTF-8 content. */
  content: string;
}

/**
 * List every file under a directory, recursively.
 *
 * A missing directory yields an empty list, which lets callers treat "no tree"
 * and "empty tree" the same way.
 *
 * @param root - Directory to walk.
 * @returns Sorted POSIX-style relative paths.
 */
export function listFiles(root: string): string[] {
  if (!existsSync(root)) {
    return [];
  }
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

/**
 * Read one file as UTF-8.
 *
 * @param path - Absolute path to read.
 * @returns The file's content.
 */
export function readTextFile(path: string): string {
  return readFileSync(path, 'utf-8');
}

/**
 * Read every file under a directory into path/content pairs.
 *
 * @param root - Directory to walk.
 * @param filter - Optional predicate on the relative path.
 * @returns The matching files, in listing order.
 */
export function readTextFiles(
  root: string,
  filter?: (relativePath: string) => boolean,
): TextFile[] {
  return listFiles(root)
    .filter((path) => (filter ? filter(path) : true))
    .map((path) => ({
      path,
      content: readFileSync(join(root, path), 'utf-8'),
    }));
}
