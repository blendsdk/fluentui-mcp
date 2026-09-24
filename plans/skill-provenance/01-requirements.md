# Requirements: Skill Provenance Disclosure

> **Document**: 01-requirements.md
> **Parent**: [Index](00-index.md)

## Feature Overview

The generated `fluentui` Agent Skill bundles a fixed snapshot of FluentUI React v9. Today a
consuming agent cannot tell which FluentUI version, source commit, or skill release a given
reference reflects, and the skill offers no instruction to disclose that boundary. This feature
makes the bundled snapshot self-describing: the generator writes a provenance section into
`references/index.md`, the scraper records the umbrella package version, and `SKILL.md` instructs
the agent to cite the covered version and refuse APIs the snapshot does not cover.

The provenance is rendered deterministically from data that already exists in the enhanced schema
plus the skill's own `package.json` version. This keeps the feature inside the existing offline,
byte-for-byte drift and freshness gates.

## Functional Requirements

### Must Have

- [ ] **R1** The scraper records the umbrella `@fluentui/react-components` package name and version
      in `sources.fluentui` when the umbrella package is present (AR-3).
- [ ] **R2** The generator writes a `## Source & versions` section into `references/index.md`
      listing: FluentUI version, source ref, source commit, umbrella package + version (when
      present), component package version range and count, skill version, generator version, and
      schema hash (AR-1, AR-2, AR-5).
- [ ] **R3** The provenance section contains no timestamp; `generatedAt` remains manifest-only
      (AR-4).
- [ ] **R4** The generator reads the skill version from `package.json` and emits it; regeneration
      stays byte-identical for identical inputs (AR-8).
- [ ] **R5** `SKILL.md` gains a hard rule to cite the covered version, list the consulted reference
      files, and state "not covered by this skill version" for unknown APIs (AR-1, AR-7).
- [ ] **R6** `SKILL.md`'s `compatibility` field matches the real React peer range
      (`>=16.14.0 <20.0.0`) (AR-7).
- [ ] **R7** The release flow regenerates the skill after the version bump so `npm run verify`
      stays green (AR-8).
- [ ] **R8** RD-03 is amended for the provenance output; RD-01 notes the new source field
      (AR-6, AR-11).

### Should Have

- [ ] **R9** The provenance section omits optional lines gracefully when their data is absent,
      without failing generation (AR-3).

### Won't Have (Out of Scope)

- Re-scraping at a new stable release tag — deferred to a separate task (AR-3).
- Runtime answer-time provenance injection — the behavior is instructed in `SKILL.md`, not enforced
  by tooling (AR-1).
- A generator-recorded "consulted entries" registry — this is runtime agent behavior and is
  instructed, not recorded (AR-1).
- A dedicated `references/provenance.md` file or a full per-package version table (AR-1, AR-5).

## Technical Requirements

### Determinism

- `references/**` remains byte-identical for identical input (RD-03). The provenance section is
  derived from the schema and `package.json` only; no wall-clock value enters a generated
  reference file (AR-4).

### Compatibility

- The corrected `compatibility` value must match `@fluentui/react-components`'s declared React
  peer range (`>=16.14.0 <20.0.0` as verified in the installed package) (AR-7).

### Security

- No new external input surface is introduced. Provenance values come from the validated schema and
  the repository `package.json`.
- Rendered values pass through the existing Markdown escaping helpers so no value can inject a
  heading, link, or table break.

## Scope Decisions

| Decision | Options Considered | Chosen | Rationale | AR Ref |
| -------- | ------------------ | ------ | --------- | ------ |
| Provenance surface | index section / dedicated file / both / manifest-only | Generated `index.md` section + `SKILL.md` rule | The agent reads `index.md`; one drift-gated surface; no new file | AR-1 |
| Timestamp handling | manifest-only / amend RD-03 / include anyway | Manifest-only | Preserves RD-03's no-timestamp contract | AR-4 |
| Umbrella version source | record tag at scrape / explicit field / derive from ref | Scraper field + same-commit refresh | Truthful version without corpus or LLM churn | AR-3 |
| Skill version sync | auto + regenerate on release / frontmatter + parity gate / omit | Auto from `package.json` + regenerate | Keeps drift green automatically | AR-8 |
| Plan form | standalone / new RD | Standalone; amend RD-03 | The change extends an implemented RD rather than redefining it | AR-6 |
| Package versions format | compact range / full table / summary + file | Compact range + count | Keeps `index.md` small | AR-5 |

> **Traceability:** Every scope decision references the Ambiguity Register entry that resolved it.
> See `00-ambiguity-register.md`.

## Acceptance Criteria

1. [ ] `references/index.md` contains the provenance section with the fields in the Must Have list
       (ST-1, ST-3, ST-5).
2. [ ] No generated reference file contains a timestamp (ST-4).
3. [ ] Generating twice from the same schema yields byte-identical output (ST-9).
4. [ ] `SKILL.md` contains the coverage rule and the corrected compatibility value (ST-7, ST-8).
5. [ ] `npm run verify` passes after a simulated version bump and regeneration (ST-10).
6. [ ] `npm run verify` passes in full.
