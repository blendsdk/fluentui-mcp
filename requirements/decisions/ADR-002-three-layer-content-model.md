# ADR-002: Three-layer content model

> **Status**: Accepted
> **Date**: 2026-09-19
> **Authorising decision**: AR-9, AR-10

## Context

An earlier content model let the language model write everything, including component APIs and code
examples. That produced fluent prose but unreliable facts: props that do not exist, imports from
the wrong package, and code that does not compile. The reliability of an API name must not depend on
an LLM.

## Decision

Split content into three layers with separate owners:

- **Layer A — deterministic API and stories.** `ts-morph` extracts props, slots, imports, and
  Storybook examples from FluentUI's own source. These facts are never authored by the LLM.
- **Layer B — LLM prose only.** The LLM writes descriptions, best practices, accessibility notes,
  anti-patterns, and prop guidance. It may describe APIs but not invent them.
- **Layer C — validated recipes.** Task walkthroughs combine A and B and are checked by the example
  gate against the real package.

## Alternatives considered

- **LLM-rich content (status quo).** Rejected: it is the source of the invented-API problem.
- **Deterministic content only.** Rejected: extracted APIs alone do not explain when or why to use
  a component.
- **Reuse the legacy documentation corpus.** Rejected: it predates v9 structure and is not keyed to
  the component schema.

## Consequences

- APIs are grounded in the package; the LLM cannot fabricate a prop into a component page.
- The generator can render Layer A deterministically from the enhanced schema.
- Prose quality is still an LLM concern and is reviewed through the incremental enhancement flow.
- Every recipe must pass the example gate before it ships.
