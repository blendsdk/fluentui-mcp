# ADR-001: Schema as the Single Source of Truth

> **Date**: 2026-06-04
> **Status**: Accepted
> **Source**: plans/schema-driven-pipeline

## Context

The server needs to answer rich questions about FluentUI v9 components, props,
patterns, and guides. An earlier approach indexed loose markdown documentation
directly. That coupled the runtime to a sprawling document tree, made the data
hard to validate, and blurred the line between "content the server serves" and
"docs about the project."

We needed a single, well-typed, validatable representation that every tool and
formatter could rely on.

## Options Considered

### Option A: Index markdown docs at runtime

- **Pros**: No build step; edit docs directly.
- **Cons**: Unstructured; no schema validation; runtime scanning cost; brittle
  parsing; hard to enrich consistently.

### Option B: A typed JSON schema as the single source of truth

- **Pros**: Strongly typed (`src/types/schema.ts`); validatable; one read model
  (`SchemaStore`); clean separation of pipeline vs runtime; easy to enrich
  additively.
- **Cons**: Requires a build-time pipeline to produce the schema.

## Decision

**Chosen option**: Option B — a typed JSON schema is the single source of truth.

The schema is produced offline (scraper → enhancer) and consumed at runtime by
the loader, store, search index, formatters, and tools.

## Rationale

A typed schema gives us validation, a single read model, and a clean contract.
It also enables the additive-enrichment rule: enrichment fields are optional and
formatters render a section only when present, so un-enhanced schemas still
work. The runtime never parses markdown trees or touches the network.

## Consequences

### Positive

- One validatable artifact drives all tools and formatters.
- Clear separation between offline pipeline and runtime.
- Additive enrichment preserves back-compatibility.

### Negative

- A build-time pipeline must exist and be maintained.

### Risks

- Schema-shape changes ripple across store/formatters/tools — mitigated by the
  Vitest suite and the lenient validator surfacing findings early.
