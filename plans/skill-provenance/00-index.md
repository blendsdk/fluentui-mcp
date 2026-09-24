# Skill Provenance Disclosure Implementation Plan

> **Feature**: Make the generated `fluentui` Agent Skill self-describing — surface the FluentUI source/version provenance and add an explicit "not covered by this skill version" fallback
> **Status**: Planning Complete
> **Created**: 2026-09-24
> **Implements**: — (standalone plan; amends RD-01 and RD-03)
> **CodeOps Artifact Schema**: 1

## Overview

The generated `fluentui` Agent Skill bundles a fixed snapshot of FluentUI React v9. A consuming
agent cannot currently tell which FluentUI version, source commit, or skill release that snapshot
reflects, and nothing instructs the agent to disclose or respect that boundary. This feature makes
the snapshot self-describing.

The deterministic generator writes a `## Source & versions` section into `references/index.md`.
The scraper records the umbrella `@fluentui/react-components` package name and version in
`sources.fluentui`. The hand-written `SKILL.md` gains a hard rule that tells the agent to cite the
covered version, list the reference files it used, and refuse APIs the snapshot does not cover.

The feature stays inside the existing deterministic, offline gate machinery: the provenance is
rendered from data already in the schema plus the skill `package.json` version, and the drift gate
already compares the generated tree byte for byte.

## Minimum-Sufficient Baseline

**Original goal:** Disclose the skill's source/version provenance and make the agent state that an
uncovered API is not covered instead of guessing.

**Smallest viable design:** Render the provenance into the existing generated `references/index.md`
from the schema and `package.json`; capture the umbrella version in the existing scraper source
record; add one hard rule and fix one frontmatter value in the existing hand-written `SKILL.md`.

**Excluded machinery:** No separate provenance file, no runtime answer-time provenance injection,
no per-file consulted-entries registry, and no stable-tag corpus re-scrape (all deferred or
rejected — see AR-1, AR-3, AR-4).

**Approved complexity:** `None` beyond amending RD-03/RD-01 and adding one regeneration step to the
release flow (AR-8, AR-11).

## Document Index

| #   | Document                                                | Description                                      |
| --- | ------------------------------------------------------- | ------------------------------------------------ |
| AR  | [Ambiguity Register](00-ambiguity-register.md)          | Zero-Ambiguity Gate decisions (audit trail)      |
| 00  | [Index](00-index.md)                                    | This document — overview and navigation          |
| 01  | [Requirements](01-requirements.md)                      | Feature requirements and scope                   |
| 02  | [Current State](02-current-state.md)                    | Analysis of the current implementation           |
| 03  | [Provenance Capture](03-01-provenance-capture.md)       | Schema types and scraper umbrella-version capture |
| 03  | [Provenance Render](03-02-provenance-render.md)         | Generator, index section, skill version          |
| 03  | [Skill Guidance](03-03-skill-guidance.md)               | `SKILL.md` hard rule and compatibility fix       |
| 03  | [Release Integration](03-04-release-integration.md)     | Release regeneration and RD amendments           |
| 07  | [Testing Strategy](07-testing-strategy.md)              | Test cases and verification                      |
| 99  | [Execution Plan](99-execution-plan.md)                  | Phases, sessions, and task checklist             |

## Quick Reference

### Usage Examples

The generated provenance section (illustrative shape; values come from the schema and
`package.json`):

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

### Key Decisions

| Decision | Outcome |
| --- | --- |
| Provenance surface | Generated `references/index.md` section plus a `SKILL.md` rule (AR-1) |
| Timestamp | `generatedAt` stays manifest-only; references carry none (AR-4) |
| Umbrella version | Captured at scrape; same-commit refresh now, stable tag later (AR-3) |
| Skill version sync | Read from `package.json`; release regenerates (AR-8) |
| Scope | Standalone plan; amends RD-03, notes RD-01 (AR-6, AR-11) |

## Related Files

| File | Role |
| --- | --- |
| `src/types/schema.ts` | `SourceInfo` gains optional umbrella package fields |
| `scripts/scraper/config.ts`, `discover.ts`, `pipeline.ts` | Read the umbrella package and record it |
| `scripts/skill/generate.ts` | Supplies skill version and schema hash to the renderer |
| `scripts/skill/mapping.ts`, `render/sections.ts` | Render the provenance section |
| `.agents/skills/fluentui/SKILL.md` | Hard rule and compatibility fix |
| `scripts/release.mjs` | Regenerate and stage the skill on release |
| `requirements/RD-03-skill-generator.md`, `requirements/RD-01-content-model.md` | Amended requirements |
