# ADR-003: Deterministic generator from the enhanced schema

> **Status**: Accepted
> **Date**: 2026-09-19
> **Authorising decision**: AR-5, AR-11

## Context

The skill ships as a committed tree of Markdown files. Maintainers need to review content changes as
diffs and to prove that a tree matches its source. If generation were non-deterministic, or if an
LLM wrote Markdown directly, every regeneration would produce an unreviewable diff and a drift check
would be impossible.

## Decision

Render the entire skill deterministically from the enhanced schema:

- A single generator turns the enhanced JSON into the Markdown tree and the manifest.
- Every generated file, the manifest included, is byte-identical when generated from the same
  schema.
- The manifest records `schemaHash`, `generatorVersion`, `generatedAt`, and a SHA-256 hash per file.
- `generatedAt` is carried over from the schema rather than read from the wall clock, so the tree is
  reproducible.
- A drift gate regenerates the tree and compares it with the committed copy.

## Alternatives considered

- **Let the LLM write Markdown.** Rejected: non-deterministic, unreviewable, and impossible to gate.
- **Hand-write the Markdown.** Rejected: 100+ files, drift from the schema, and no consistency.
- **Render at read time.** Rejected: the skill must be readable offline with no code execution.

## Consequences

- Regeneration produces an empty or explainable diff, and CI can fail on drift.
- Any content change is reviewable as a Markdown diff.
- The generator is now load-bearing; a rendering bug affects the whole tree, so it is covered by
  specification tests.
- The manifest doubles as a tamper check for the published tree.
