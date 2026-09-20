/**
 * Source-path resolution and containment checks for the FluentUI scraper.
 *
 * The scraper reads from a user-supplied checkout path. To prevent a
 * malicious or mistaken `--source` value from reading files outside the
 * intended root, every external path is resolved and checked against an
 * allowed root before it is used.
 *
 * @module scraper/paths
 */

import { isAbsolute, resolve, sep } from 'node:path';

/**
 * Resolve a user-supplied source path and ensure it stays inside an allowed
 * root directory.
 *
 * An absolute path is taken as an explicit operator choice and returned as-is.
 * A relative path is resolved against `allowedRoot`, and if the result is the
 * root itself or a descendant of it, the absolute path is returned. A relative
 * path that escapes the root (for example via `..`) is rejected so a traversal
 * value cannot read outside the intended directory.
 *
 * @param source - User-supplied path (absolute, or relative to `allowedRoot`)
 * @param allowedRoot - Directory a relative path must stay within
 * @returns Absolute path to the source directory
 * @throws Error when a relative path escapes `allowedRoot`
 *
 * @example
 * resolveSourcePath('.', '/work/repo')            // → '/work/repo'
 * resolveSourcePath('packages/ui', '/work/repo')  // → '/work/repo/packages/ui'
 * resolveSourcePath('../etc', '/work/repo')       // → throws (path escapes)
 * resolveSourcePath('/opt/fluentui', '/work/repo') // → '/opt/fluentui'
 */
export function resolveSourcePath(source: string, allowedRoot: string): string {
  if (isAbsolute(source)) {
    return resolve(source);
  }

  const root = resolve(allowedRoot);
  const target = resolve(root, source);

  // Accept the root itself, or any path nested beneath it. Appending the
  // platform separator prevents `/work/repo-evil` from matching `/work/repo`.
  const rootPrefix = root.endsWith(sep) ? root : root + sep;

  if (target !== root && !target.startsWith(rootPrefix)) {
    throw new Error(
      `Source path escapes the allowed root: '${source}' resolves to ` +
        `'${target}', which is outside '${root}'`,
    );
  }

  return target;
}
