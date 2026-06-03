# ADR-002: Ship a Bundled Enhanced JSON; Enrich Offline

> **Date**: 2026-06-04
> **Status**: Accepted
> **Source**: plans/schema-driven-pipeline, plans/maximum-enhancement

## Context

The enhanced schema is produced by calling an LLM over every component and
generating guides/patterns. This is expensive, slow, non-deterministic, and
requires API keys. The MCP server, by contrast, must start instantly, run
offline, and behave deterministically inside an end user's editor.

We had to decide where enrichment happens and how the result reaches the
runtime.

## Options Considered

### Option A: Enrich on demand at runtime

- **Pros**: Always "fresh"; no committed artifact.
- **Cons**: Requires API keys at runtime; slow; non-deterministic; network
  dependency; cost per user; defeats the point of a fast local tool.

### Option B: Enrich offline, commit and ship the bundled JSON

- **Pros**: Runtime is instant, deterministic, offline, key-free; the artifact
  is reviewable in PRs; published in the npm package (`files: ["data/"]`).
- **Cons**: The bundle is large (multi-MB) and must be regenerated when FluentUI
  changes.

## Decision

**Chosen option**: Option B — enrichment runs offline; the resulting
`data/<version>/fluentui-schema-enhanced.json` is committed and shipped.

The enhancer validates the schema on every write and exits non-zero on any
validation error, so a broken bundle never gets committed.

## Rationale

A local developer tool must be fast and dependency-light. Baking enrichment into
a committed artifact gives deterministic behavior, keeps the only runtime
dependency the MCP SDK, and makes every data change reviewable. Regeneration is
handled by the `update-docs` workflow, which opens a PR with the new schema.

## Consequences

### Positive

- Instant, offline, deterministic runtime with no API keys.
- Schema changes are reviewable diffs.
- Published cleanly via the `files` allow-list.

### Negative

- The committed JSON is large and re-generation has an LLM cost.

### Risks

- Bundle can drift from upstream FluentUI — mitigated by the manually-triggered
  `update-docs` workflow and diff-based incremental enhancement.
