# Testing Strategy: Skill Provenance Disclosure

> **Document**: 07-testing-strategy.md
> **Parent**: [Index](00-index.md)

## Testing Overview

### Coverage Goals

| Code type | Target |
| --------- | ------ |
| Core logic (scraper capture, range formatting, render) | 90% |
| Generator and release integration | 80% |
| Markdown rendering glue | 80% |

Targets match the project default; no adjustment requested.

- Test names state behavior: `should [expected behavior] when [condition]`.
- Integration tests cover the generate → drift path and the release → regenerate path.
- End-to-end browser tests are `N/A`: this feature is a CLI/content pipeline with no UI. The
  existing example and drift gates cover the skill output.

## 🚨 Specification Test Cases (MANDATORY — NON-NEGOTIABLE)

> Derived exclusively from `01-requirements.md`, the `03-XX` component specs, and the Ambiguity
> Register. These define expected behavior before any implementation exists. Do not modify them to
> match the implementation.

| # | Input / Scenario | Expected Output / Behavior | Source |
| --- | ---------------- | -------------------------- | ------ |
| ST-1 | Generate from a schema whose `sources.fluentui` has `ref`, `commit`, `packageName`, `packageVersion`, whose components carry `packageVersion` values, and a context with `skillVersion` | `references/index.md` contains a `## Source & versions` section listing the ref, short commit, umbrella name + version, package range + count, skill version, generator version, and short schema hash | 01 R2 / AR-1, AR-2 |
| ST-2 | Components with versions `9.2.0` and `9.10.0` | Component package range is `9.2.0–9.10.0` (numeric order, not lexicographic) | 01 R2 / AR-5 |
| ST-3 | Schema with no `packageName`/`packageVersion` on `sources.fluentui` | The umbrella row is absent; generation succeeds | 01 R2, R9 / AR-3 |
| ST-4 | Any generated `references/**` file | Contains no ISO-8601 timestamp | 01 R3 / AR-4 / RD-03 |
| ST-5 | Generate with `package.json` version `X` | The emitted skill version equals `X` | 01 R4 / AR-8 |
| ST-6 | Scrape a checkout whose umbrella package.json is `{ name, version }` | `sources.fluentui.packageName` and `sources.fluentui.packageVersion` match that package | 01 R1 / AR-3 |
| ST-7 | Read `.agents/skills/fluentui/SKILL.md` | Contains a hard rule that names `references/index.md`, instructs citing the covered version, listing consulted references, and states "not covered by this skill version" for unknown APIs | 01 R5 / AR-1, AR-7 |
| ST-8 | Read `.agents/skills/fluentui/SKILL.md` | The `compatibility` value contains the real React peer range `>=16.14.0 <20.0.0` | 01 R6 / AR-7 |
| ST-9 | Generate twice from the same schema and context | `references/index.md` is byte-identical between runs | 01 R2 / RD-03 AC1 |
| ST-10 | Generate into a temporary skill directory using a temporary `package.json` whose version differs from the committed one | `references/index.md` records that version and a drift check of the temporary tree passes; the repository working tree is untouched | 01 R7 / AR-8 / PF-001 |
| ST-11 | Schema missing `sources.fluentui` | Generation throws before writing any file and the committed tree is unchanged | RD-03 |

> **Authoring rule:** Derive expectations from the specs above, never from the implementation. When
> a spec test turns a case into code, quote the behavior in plain language, never the `ST-` id.

## Test Categories

### Specification Tests

| Test File | ST Cases Covered | Component |
| --------- | ---------------- | --------- |
| `src/__tests__/scraper/provenance-capture.spec.test.ts` | ST-6 | Provenance capture |
| `src/__tests__/skill/provenance-render.spec.test.ts` | ST-1, ST-2, ST-3, ST-4, ST-5, ST-9, ST-11 | Provenance render |
| `src/__tests__/skill/skill-guidance.spec.test.ts` | ST-7, ST-8 | Skill guidance |
| `src/__tests__/integration/provenance-release.spec.test.ts` | ST-10 | Release integration |

### Implementation Tests

| Test File | Description | Priority |
| --------- | ----------- | -------- |
| `src/__tests__/scraper/provenance-capture.impl.test.ts` | `readPackageJson` layouts and malformed input; `readUmbrellaPackage` found/absent; pipeline field wiring | High |
| `src/__tests__/skill/provenance-render.impl.test.ts` | `formatPackageVersionRange` (single, equal min/max, malformed, unsorted); section omits empty rows; escaping of `|` and backticks | High |
| `scripts/release.spec.test.mjs` | `releaseStagePaths()` includes `.agents/skills/fluentui`; dry-run performs no regeneration | Medium |

### Integration Tests

| Test | Components | Description |
| ---- | ---------- | ----------- |
| Generate then drift | Provenance render + drift gate | `--check` passes on the freshly generated tree |
| Release regenerate | Release integration + generator | Simulated bump then regenerate updates the recorded skill version |

### End-to-End Tests

| Scenario | Steps | Expected Result |
| -------- | ----- | --------------- |
| `N/A` | No UI is produced; the CLI pipeline is covered by integration tests | — |

## Test Data

### Fixtures Needed

- Update `src/__tests__/fixtures/mock-fluentui` to include an umbrella
  `packages/react-components/react-components/package.json`. Re-run the existing scraper and
  pipeline tests afterwards and adjust any discovery/inventory expectations the new file affects.
- Reuse `src/__tests__/fixtures/test-schema-enhanced.json`; extend it with `sources.fluentui`
  umbrella fields and varied component `packageVersion` values for range tests.
- A schema variant without umbrella fields for ST-3.

### Mock Requirements

Prefer real objects. No external service is involved; no mocks are expected. The generator,
validator, and gates run for real against fixtures.

## Verification Checklist

- [ ] All specification test cases (ST-*) defined with concrete input/output pairs
- [ ] Every ST case traces to a requirement, spec doc, or AR entry
- [ ] Specification tests written BEFORE implementation
- [ ] Specification tests verified to FAIL before implementation (red phase)
- [ ] All specification tests pass after implementation (green phase)
- [ ] Implementation tests written for edge cases and internals
- [ ] All unit / integration tests pass
- [ ] No regressions in existing tests
- [ ] Test coverage meets goals
- [ ] `npm run verify` passes in full
