# Release Integration: Skill Provenance Disclosure

> **Document**: 03-04-release-integration.md
> **Parent**: [Index](00-index.md)

## Overview

The provenance section records the skill's own published version. The version is written to
`package.json` by `scripts/release.mjs` during a release, so the release flow must regenerate the
skill after the bump and stage the regenerated tree with the release commit. This component wires
that step in and amends the owning requirements.

## Architecture

### Current Architecture

`scripts/release.mjs` (commands `version`, `publish`, `release`):

1. `assertCleanTree()` refuses to run on a dirty working tree.
2. `applyVersion(version)` runs `npm version ... --no-git-tag-version --ignore-scripts`, writing
   `package.json` and `package-lock.json`.
3. `updateChangelog(version, commits)` writes `CHANGELOG.md`.
4. `commitAndTag(version, ...)` runs `git add package.json package-lock.json CHANGELOG.md`, then
   commits and tags.

Only `.agents/skills/fluentui/**` is committed; the assembled `/skills/` tree is gitignored. The
CI and release workflows run `npm run verify`, which includes the drift gate `skill:check`.

### Proposed Changes

1. After `applyVersion` and before `commitAndTag`, regenerate the skill so the provenance section
   records the new version.
2. Include `.agents/skills/fluentui` in the `git add` set of `commitAndTag`.
3. Skip both steps in `--dry-run` and `--no-git-commit` modes, mirroring the existing write guards.
4. Amend RD-03 and RD-01 to record the new behavior and field.

## Implementation Details

### New Functions/Methods

```js
// scripts/release.mjs (internal)

/**
 * Regenerate the committed skill tree so it records the new skill version.
 *
 * Runs the deterministic generator, which is offline and has no LLM call. The
 * regenerated tree is picked up by the release commit.
 *
 * @throws When the generator exits non-zero
 */
function regenerateSkill() {
  run("node", ["--import", "tsx", "scripts/skill/generate.ts"])
}
```

```js
// scripts/release.mjs (exported)

/**
 * The paths staged by the release commit.
 *
 * Exported as a pure value so the staging set can be unit-tested without
 * invoking git, matching the existing pure-function spec-test style.
 *
 * @returns The `git add` argument list
 */
export function releaseStagePaths() {
  return ["package.json", "package-lock.json", "CHANGELOG.md", ".agents/skills/fluentui"]
}
```

### Integration Points

In the `version`/`release` flow, call `regenerateSkill()` immediately after `applyVersion(version)`
and before `updateChangelog`/`commitAndTag`, guarded the same way as other writes
(`if (!options.dryRun && !options.noGitCommit)`). Extend the staging line to use
`releaseStagePaths()`:

```js
run("git", ["add", ...releaseStagePaths()])
```

`assertCleanTree()` runs first, so the only tree changes at commit time are the version bump, the
changelog, and the regenerated skill.

### Requirement Amendments

**RD-03 (`requirements/RD-03-skill-generator.md`):**

- Must Have: add that `references/index.md` includes a `## Source & versions` provenance section
  with no timestamp.
- Determinism contract: clarify that generated reference files carry no timestamp, while the
  manifest records the input schema's `generatedAt`.
- Acceptance Criteria: add that the provenance section lists the source ref and commit, the
  umbrella version when present, the component package version range, and the skill, generator, and
  schema identifiers, and that generation remains byte-identical for identical input.

**RD-01 (`requirements/RD-01-content-model.md`):**

- Note that `sources.fluentui` also records the umbrella suite package's `packageName` and
  `packageVersion` when one is present.

## Error Handling

| Error Case | Handling Strategy | AR Ref |
| ---------- | ----------------- | ------ |
| Generator fails during release | `run` throws; the release aborts before commit/tag/publish | AR-8 |
| Dry run | Do not regenerate; do not stage | AR-8 |
| `--no-git-commit` | Regeneration may run, but nothing is committed | AR-8 |

> **Traceability:** Each strategy references the Ambiguity Register entry that resolved it. See
> `00-ambiguity-register.md`.

## Testing Requirements

- Spec test: after a simulated version bump, regeneration updates the skill version in
  `references/index.md`, and `npm run verify` (or at minimum the drift gate) passes. The test uses
  a temporary `package.json` and skill directory (see PF-003) so it never mutates the repository.
- Unit test: `releaseStagePaths()` contains `.agents/skills/fluentui` (pure, no git invocation).
- Confirm `--dry-run` performs no regeneration and no staging.
