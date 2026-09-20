# Integrity Gates: FluentUI Agent Skill

> **Document**: 03-03-integrity-gates.md
> **Parent**: [Index](00-index.md)
> **Implements**: RD-04

## Overview

This specification defines the automated checks that certify the skill: example validation, API
reference checking, drift, freshness, format, secrets, and coverage. Example validation is the
trust guarantee — every rendered code block must reference real packages and symbols.

## Architecture

### Proposed Changes

- Add `scripts/skill/validate-examples.ts`, `check-drift.ts`, `check-freshness.ts`, `secrets.ts`,
  and a coverage check inside `check-drift.ts`.
- Add tests for each gate and wire them into CI and the publish path.

## Implementation Details

### Example validation (three tiers)

| Tier | Check | Fails gate? |
| ---- | ----- | ----------- |
| 1a | `@fluentui/react-components` / `@fluentui/react-icons` imports resolve in the installed package | Yes |
| 1b | every named import exists in the package exports | Yes |
| 2 | `tsc --noEmit` against a throwaway project | No (report only) |

- Extraction: fenced `tsx`/`ts` blocks from `references/**` and `SKILL.md`.
- Fence info ending in `fragment`, and API signature listings, are import-checked only.
- The validator writes blocks into the ignored cache and runs `tsc` with an argument array — never a
  shell, never execution.
- Report rows: `{ file, line, tier, message }`.

### API-reference check

Scan generated prose for component names and prop names; each must exist in the raw schema. Unknown
names fail the gate.

### Drift gate

Run `generate --check` into a temp dir; compare files bearing the generated marker. Hand-written
files are ignored. Any missing/added/changed generated file fails.

### Freshness gate

Hash the current enhanced schema and compare to the manifest `schemaHash`. Mismatch fails with a
regenerate instruction. Runs in the publish path, available locally.

### Format gate

Spec test asserting `SKILL.md` name equals its directory, description within the format limit, body
≤ 500 lines, and `references/index.md` exists.

### Secrets gate

Scan generated and hand-written skill files for key-like patterns (`sk-`, `API_KEY=`, `-----BEGIN`).

### Coverage gate

Every schema component/category/recipe/foundation/quick-reference entry has a reference file; every
relative link resolves within the tree.

## Integration Points

- Reuses the generator mapping and `--check` (03-02).
- Feedback loop for recipe examples from 03-01.
- Wired into CI and publish (03-04, 03-05).

## Error Handling

| Error Case | Handling Strategy | AR Ref |
| ---------- | ----------------- | ------ |
| Unknown symbol | Fail; report tier 1b + name | AR-19 |
| Type-only error | Report; do not fail | AR-19 |
| Drift | Fail naming files | AR-05 |
| Stale schema | Fail with regenerate instruction | AR-20 |
| Planted secret | Fail | AR-08 |

## Testing Requirements

- Spec tests with a deliberately broken import and a type-only error.
- Drift test: one-byte edit fails; hand-written edit does not.
- Freshness test: schema change without regeneration fails.
- Secrets test: a planted fake key fails.
- Coverage test: removed reference or broken link fails.
