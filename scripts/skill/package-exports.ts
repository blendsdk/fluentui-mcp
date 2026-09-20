/**
 * Resolve the named exports of an installed package.
 *
 * The example validator and the API-reference check both need to know whether
 * a name really exists in `@fluentui/react-components` or
 * `@fluentui/react-icons`. Reading the package's TypeScript declaration file
 * answers that without executing any code.
 *
 * @module skill/package-exports
 */

import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';

import { Project } from 'ts-morph';

/**
 * Return the export names of a module specifier, or `undefined` when the
 * package is not installed.
 */
export interface PackageExportResolver {
  (specifier: string): ReadonlySet<string> | undefined;
}

/** The subset of `package.json` this module reads. */
interface PackageJson {
  /** Path to the type declarations, when declared. */
  types?: string;

  /** Legacy alias for {@link types}. */
  typings?: string;
}

/**
 * Build a resolver backed by the installed packages.
 *
 * Results are cached per specifier, and the underlying TypeScript project is
 * created once, because reading a large barrel file such as
 * `@fluentui/react-icons` is expensive.
 *
 * @param cwd - Directory from which packages resolve (default: process cwd).
 * @returns A resolver suitable for the gates.
 */
export function createPackageExportResolver(
  cwd: string = process.cwd(),
): PackageExportResolver {
  const requireFrom = createRequire(join(cwd, 'package.json'));
  const cache = new Map<string, ReadonlySet<string> | undefined>();
  const project = new Project({ skipAddingFilesFromTsConfig: true });

  return (specifier: string): ReadonlySet<string> | undefined => {
    if (cache.has(specifier)) {
      return cache.get(specifier);
    }

    let result: ReadonlySet<string> | undefined;
    try {
      const packageJsonPath = requireFrom.resolve(`${specifier}/package.json`);
      const packageJson = requireFrom(packageJsonPath) as PackageJson;
      const typesEntry = packageJson.types ?? packageJson.typings;
      if (typesEntry) {
        const source = project.addSourceFileAtPath(
          resolve(dirname(packageJsonPath), typesEntry),
        );
        result = new Set(source.getExportSymbols().map((symbol) => symbol.getName()));
      }
    } catch {
      // A missing or unreadable package simply means "not resolvable".
      result = undefined;
    }

    cache.set(specifier, result);
    return result;
  };
}
