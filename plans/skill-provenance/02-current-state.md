# Current State: Skill Provenance Disclosure

> **Document**: 02-current-state.md
> **Parent**: [Index](00-index.md)

## Existing Implementation

### What Exists

The skill pipeline is deterministic and offline at generation time. The scraper produces a raw
schema; the enhancer adds prose; the generator renders the committed skill tree; four gates verify
it.

- **Schema source record.** `FluentUISchema.sources.fluentui` already carries `repo`, `ref`,
  `commit`, and `scrapedAt` (`src/types/schema.ts`). The umbrella `@fluentui/react-components`
  version is **not** recorded, although each component carries its own `packageVersion`.
- **Hand-written entry point.** `SKILL.md` is hand-written and existence-checked, never generated
  (`scripts/skill/generate.ts:203`; `requirements/RD-03-skill-generator.md`). The generator writes
  only `references/**` plus `.fluentui-skill-manifest.json`.
- **Generated index.** `references/index.md` is rendered by `renderIndexFile`
  (`scripts/skill/mapping.ts`).
- **Manifest.** `.fluentui-skill-manifest.json` records `schemaHash`, `generatorVersion`,
  `generatedAt` (derived from the input schema), and per-file hashes
  (`scripts/skill/manifest.ts`).
- **Gates.** `skill:check` (drift, compares generated files including the manifest byte for byte),
  `skill:freshness` (schema hash), `skill:validate` (example imports/type-check), `skill:secrets`.
  The drift comparison covers the manifest (`scripts/skill/generate.ts:152-158`).
- **Release.** `scripts/release.mjs` bumps the version, updates the changelog, then runs
  `git add package.json package-lock.json CHANGELOG.md` and commits
  (`scripts/release.mjs`: `commitAndTag`). Only `.agents/skills/fluentui/**` is committed; the
  assembled `/skills/` tree is gitignored.

### Relevant Files

| File | Purpose | Changes Needed |
| ---- | ------- | -------------- |
| `src/types/schema.ts` | Schema types | Add optional umbrella package fields to `SourceInfo` |
| `scripts/scraper/config.ts` | Version layout | Declare the umbrella package directory |
| `scripts/scraper/discover.ts` | Package discovery | Expose a readable umbrella package.json helper |
| `scripts/scraper/pipeline.ts` | Source record assembly | Record umbrella name/version in `sources.fluentui` |
| `scripts/skill/generate.ts` | Generator entry | Read skill version + schema hash; pass render context |
| `scripts/skill/mapping.ts` | File mapping | Render the provenance section in `index.md` |
| `scripts/skill/render/sections.ts` | Markdown primitives | Reuse existing `table`/`inlineCode`; no new primitive expected |
| `.agents/skills/fluentui/SKILL.md` | Hand-written entry | Add hard rule; fix compatibility |
| `scripts/release.mjs` | Release flow | Regenerate + stage the skill after the bump |
| `requirements/RD-03-skill-generator.md` | Owning requirement | Amend for provenance output |
| `requirements/RD-01-content-model.md` | Scraper requirement | Note the new source field |

### Code Analysis

The generator renders every reference file in memory from the schema, then diffs against disk in
`--check` mode. Because the drift gate already compares content exactly, adding a provenance
section automatically gains drift coverage with no new gate.

The generator currently receives only the schema path and skill directory, so it does not know the
skill's own published version. The renderer signature `buildSkillFiles(schema)` must therefore
receive a small context (skill version, schema hash, generator version) computed in
`generate.ts`.

The schema validator requires `sources.fluentui` to be a plain object but does not reject extra
keys (`src/schema/schema-validator.ts:153-163`), so optional source fields are additive and safe.

## Gaps Identified

### Gap 1: No umbrella version recorded

**Current Behavior:** `sources.fluentui` records the git ref and commit but not the umbrella
`@fluentui/react-components` version. The committed schema records `ref=master` and commit
`fdf755c`; the umbrella package at that commit is version `9.74.1`.

**Required Behavior:** The scraper records the umbrella package name and version in
`sources.fluentui` when present.

**Fix Required:** Read the umbrella `packages/react-components/react-components/package.json`
during the scrape and store its `name` and `version`.

### Gap 2: No provenance in the generated skill

**Current Behavior:** `references/index.md` indexes resources but says nothing about the source or
version snapshot.

**Required Behavior:** A `## Source & versions` section lists the reference/version tuple.

**Fix Required:** Extend `renderIndexFile` and pass a render context from `generate.ts`.

### Gap 3: No coverage instruction

**Current Behavior:** `SKILL.md` hard rules say "check the installed version first" and "never
invent a prop", but nothing tells the agent to cite the covered version or to name an uncovered
API as not covered.

**Required Behavior:** A hard rule that combines citation, consulted references, and the explicit
"not covered" fallback.

**Fix Required:** Edit `SKILL.md` (and correct the React compatibility value).

## Dependencies

### Internal Dependencies

- `hashSchema` and `GENERATOR_VERSION` from `scripts/skill/manifest.ts`.
- `readPackageJson` logic already present in `scripts/scraper/discover.ts`.
- Existing Markdown primitives in `scripts/skill/render/sections.ts`.

### External Dependencies

- None new. No LLM call and no network access are added by this feature.

## Risks and Concerns

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| Release regeneration changes the release workflow | Medium | Medium | Explicit task plus ST-10; regenerate before `commitAndTag` |
| Same-commit enhance unexpectedly calls the LLM | Low | Low | Unchanged components carry forward (`scripts/enhancer/enhancer.ts:309`); confirm zero calls when hashes are unchanged |
| Signature change to `buildSkillFiles` breaks existing tests | High | Low | Update all call sites and test fixtures in the same phase |
| Schema/validator rejected the new fields | Low | Low | Validator is not strict on source keys (`src/schema/schema-validator.ts:153`) |
