# Provenance Render: Skill Provenance Disclosure

> **Document**: 03-02-provenance-render.md
> **Parent**: [Index](00-index.md)

## Overview

This component renders the `## Source & versions` section into `references/index.md`. It also
supplies the renderer with the skill's own published version, the generator version, and the schema
hash. All inputs are either schema data or `package.json`, so the output stays deterministic and
gains drift coverage automatically.

## Architecture

### Current Architecture

`buildSkillFiles(schema)` renders every generated file in memory (`scripts/skill/mapping.ts`).
`renderIndexFile(schema, orderedRecipes, components)` produces `references/index.md` from the
schema's guides, categories, components, and recipes. The generator (`scripts/skill/generate.ts`)
calls it, builds the manifest, and diffs against disk in `--check` mode.

`GENERATOR_VERSION` lives in `scripts/skill/manifest.ts` and the manifest already records
`schemaHash`, `generatorVersion`, and `generatedAt`.

### Proposed Changes

1. Introduce a `SkillRenderContext` carrying `skillVersion`, `generatorVersion`, and `schemaHash`.
2. Make `buildSkillFiles(schema, context)` require the context.
3. Add a `renderProvenance` helper and integrate it into `renderIndexFile`.
4. In `generate.ts`, read the skill version from `package.json`, compute `hashSchema(schema)`, and
   pass the context. Bump `GENERATOR_VERSION` to `1.1.0` because the output format changed.

## Implementation Details

### New Types/Interfaces

```ts
// scripts/skill/mapping.ts
export interface SkillRenderContext {
  /** Published version of the fluentui-skill package (from package.json). */
  skillVersion: string;

  /** Version of the generator that produced the tree. */
  generatorVersion: string;

  /** SHA-256 of the input schema, as recorded in the manifest. */
  schemaHash: string;
}
```

### New Functions/Methods

```ts
// scripts/skill/mapping.ts

/**
 * Render the "Source & versions" provenance section.
 *
 * The section lists the FluentUI source ref and commit, the umbrella package
 * version when present, the component package version range, and the skill,
 * generator, and schema identifiers. It deliberately excludes any timestamp so
 * generated references stay reproducible.
 *
 * The schema is validated before rendering, so `sources.fluentui` is always
 * present; there is no missing-source branch.
 *
 * @param schema - The enhanced schema
 * @param context - Skill version, generator version, and schema hash
 * @returns A Markdown section
 */
function renderProvenance(
  schema: FluentUISchema,
  context: SkillRenderContext,
): string;

/**
 * Format the component package versions as a compact range and count.
 *
 * Versions that are not plain `x.y.z` are ignored. Comparison is numeric by
 * major, then minor, then patch, so `9.10.0` is correctly greater than `9.2.0`.
 *
 * @param components - Component entries carrying `packageVersion`
 * @returns For example `38 packages, 9.2.17–9.17.12`, or undefined when none
 */
function formatPackageVersionRange(
  components: readonly ComponentEntry[],
): string | undefined;
```

```ts
// scripts/skill/generate.ts (internal)

/**
 * Read the published skill version from package.json.
 *
 * @param packageJsonPath - Absolute path to the repository package.json
 * @returns The `version` field
 * @throws When the file is missing, malformed, or lacks a string version
 */
function readSkillVersion(packageJsonPath: string): string;
```

### Integration Points

`GenerateSkillOptions` gains an optional `packageJsonPath` (default `package.json`) that
`runGenerate` resolves against `cwd` and passes to `generateSkill`. Keeping it an explicit option
lets tests point the generator at a fixture `package.json` instead of reading the repository file
from the process working directory.

`renderIndexFile` calls `renderProvenance` immediately after the title and intro, before the
task-to-recipe table. `generate.ts` composes the context:

```ts
const context: SkillRenderContext = {
  skillVersion: readSkillVersion(packageJsonPath),
  generatorVersion: GENERATOR_VERSION,
  schemaHash: hashSchema(schema),
};
const referenceFiles = buildSkillFiles(schema, context);
```

### Section Shape

```markdown
## Source & versions

| Item | Value |
| --- | --- |
| Fluent UI version | v9 |
| Fluent UI source | `@fluentui/react-components_v9.74.1` @ `fdf755c` |
| Umbrella package | `@fluentui/react-components` 9.74.1 |
| Component packages | 38 packages, 9.2.17–9.17.12 |
| Skill version | 1.3.1 |
| Generator | 1.1.0 |
| Schema hash | `e93f15e9189f` |
```

Rows whose data is absent (for example no umbrella package) are omitted. The section is rendered
with the existing `table` helper and escaped with `escapeTableCell`/`inlineCode`.

## Error Handling

| Error Case | Handling Strategy | AR Ref |
| ---------- | ----------------- | ------ |
| `package.json` missing or has no string version | Throw before writing any file, matching the generator's existing fail-fast contract | AR-8 |
| Schema has no `sources.fluentui` | Existing schema validation rejects it before rendering | AR-2 |
| No component carries a version | Omit the "Component packages" row | AR-5 |
| No umbrella fields recorded | Omit the "Umbrella package" row | AR-3 |

> **Traceability:** Each strategy references the Ambiguity Register entry that resolved it. See
> `00-ambiguity-register.md`.

## Testing Requirements

- Spec tests for the section contents, the numeric range, absent-data omission, timestamp
  freedom, skill-version parity, and determinism.
- Impl tests for `formatPackageVersionRange` (single version, equal min/max, malformed values,
  unsorted input).
- Update every `buildSkillFiles` call site and fixture in the skill tests.
