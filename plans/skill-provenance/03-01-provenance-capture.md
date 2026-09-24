# Provenance Capture: Skill Provenance Disclosure

> **Document**: 03-01-provenance-capture.md
> **Parent**: [Index](00-index.md)

## Overview

This component records which FluentUI package version the scraped snapshot came from. It adds two
optional fields to the schema's source record and teaches the scraper to read the umbrella
`@fluentui/react-components` `package.json` during a run. No behavior changes: the fields are
additive and absent when the umbrella package cannot be read.

## Architecture

### Current Architecture

`sources.fluentui` is assembled in `scripts/scraper/pipeline.ts` from the configured repo, the
resolved ref, the resolved commit, and the scrape time. Each discovered component already records
its own `packageName`/`packageVersion`, read by `readPackageJson` in
`scripts/scraper/discover.ts` (currently module-private).

### Proposed Changes

1. `SourceInfo` gains optional `packageName` and `packageVersion` fields.
2. `VersionPaths` gains an optional `umbrellaPackageDir`; the v9 config sets it to
   `packages/react-components/react-components`.
3. `readPackageJson` is exported and reused by the pipeline to read the umbrella package.
4. The pipeline sets the two fields on `sources.fluentui` when the umbrella read succeeds.

## Implementation Details

### New Types/Interfaces

```ts
// src/types/schema.ts — SourceInfo additions
export interface SourceInfo {
  /** Git repository URL */
  repo: string;

  /** Git ref used (branch, tag, or commit) */
  ref: string;

  /** Full commit hash at time of scrape */
  commit: string;

  /** ISO 8601 timestamp of the scrape */
  scrapedAt: string;

  /**
   * npm package name of the umbrella suite package, when one was found at the
   * scraped ref (for example `@fluentui/react-components`).
   */
  packageName?: string;

  /**
   * Version of the umbrella suite package at the scraped ref. This is the
   * single version most users recognize, as opposed to the per-component
   * `packageVersion` values.
   */
  packageVersion?: string;
}
```

```ts
// scripts/scraper/types.ts — VersionPaths addition
export interface VersionPaths {
  // ...existing fields...

  /**
   * Directory of the umbrella suite package, relative to the checkout root.
   * Omitted for versions without an umbrella package.
   */
  umbrellaPackageDir?: string;
}
```

### New Functions/Methods

`scripts/scraper/discover.ts`:

```ts
/**
 * Read and parse a package.json, preferring the package root and falling back
 * to a `library/package.json` subdirectory.
 *
 * @param dirPath - Directory that contains the package.json
 * @returns The parsed name and version, or null when unreadable
 */
export function readPackageJson(dirPath: string): PackageJsonInfo | null;
```

The currently private `PackageJsonInfo` interface is exported alongside it, so the exported function
does not expose an unexported return type.

`scripts/scraper/pipeline.ts` (internal helper):

```ts
/**
 * Read the umbrella suite package's name and version from a checkout.
 *
 * @param sourcePath - Absolute path to the FluentUI checkout
 * @param config - Version configuration naming the umbrella package directory
 * @returns The package name and version, or undefined when not found
 */
function readUmbrellaPackage(
  sourcePath: string,
  config: VersionConfig,
): { packageName: string; packageVersion: string } | undefined;
```

### Integration Points

In `scrape`, when building `sources.fluentui`:

```ts
const umbrella = readUmbrellaPackage(sourcePath, config);
const sources = {
  fluentui: {
    repo: config.fluentui.repo,
    ref: fluentuiRef,
    commit: options.commit ?? resolveCommit(sourcePath),
    scrapedAt: new Date().toISOString(),
    ...(umbrella ?? {}),
  },
};
```

The `scrapedAt` value remains a scrape-time value in the schema (not a generated file), so it does
not affect RD-03's generated-file determinism.

## Code Examples

### Example: umbrella read from a checkout

```ts
const config = getVersionConfig('v9');
const dir = join(sourcePath, config.paths.umbrellaPackageDir ?? '');
const info = config.paths.umbrellaPackageDir ? readPackageJson(dir) : null;
// info → { name: '@fluentui/react-components', version: '9.74.1' }
```

## Error Handling

| Error Case | Handling Strategy | AR Ref |
| ---------- | ----------------- | ------ |
| Umbrella directory absent | Omit `packageName`/`packageVersion`; continue | AR-3 |
| Umbrella `package.json` malformed or missing fields | `readPackageJson` returns null; omit fields | AR-3 |
| `umbrellaPackageDir` not configured (for example v8) | Skip the read; omit fields | AR-3 |

> **Traceability:** Each strategy references the Ambiguity Register entry that resolved it. See
> `00-ambiguity-register.md`.

## Testing Requirements

- Unit tests for `readPackageJson` (root layout, `library/` layout, malformed JSON).
- Unit test for `readUmbrellaPackage` returning values and returning `undefined`.
- Pipeline test asserting `sources.fluentui.packageName/packageVersion` are set for v9 and absent
  when the umbrella package is missing.
- Fixture update: add an umbrella `package.json` to the mock FluentUI tree, then re-run the existing
  scraper and pipeline tests and adjust any discovery/inventory expectations the new file affects.
