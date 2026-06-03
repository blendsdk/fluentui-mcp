# ADR-004: TF-IDF In-Memory Search

> **Date**: 2026-06-04
> **Status**: Accepted
> **Source**: plans/schema-driven-pipeline

## Context

Several tools need relevance ranking: `search_docs` (full-text search),
`suggest_components` (rank components for a described UI), and
`get_implementation_guide` (assemble relevant pieces for a goal). The server is
a single local process that must start fast and stay dependency-light, and the
corpus is the bounded set of entries in the bundled schema.

## Options Considered

### Option A: External search engine (e.g. a vector DB / service)

- **Pros**: Powerful semantic search.
- **Cons**: Heavy; network/service dependency; defeats the offline, local,
  zero-key runtime goal; overkill for a bounded corpus.

### Option B: Embeddings computed at runtime

- **Pros**: Semantic relevance.
- **Cons**: Needs a model/API at runtime (keys, cost, latency); non-deterministic.

### Option C: TF-IDF index built in memory at startup

- **Pros**: Zero extra dependencies; deterministic; instant for a bounded
  corpus; trivially rebuildable on `reindex`.
- **Cons**: Lexical, not semantic — relies on shared vocabulary.

## Decision

**Chosen option**: Option C — build a TF-IDF index in memory from the
`SchemaStore` at startup (`src/search/search-index.ts`), queried by
`search-engine.ts`.

## Rationale

TF-IDF matches the constraints exactly: the corpus is small and bounded, the
runtime must be deterministic and offline, and we want no additional
dependencies. The index rebuilds cheaply, so `reindex` can swap in a fresh
schema without restarting. Lexical limitations are acceptable for documentation
lookup where the agent's query and the docs share vocabulary.

## Consequences

### Positive

- No runtime dependencies, no keys, deterministic results.
- Fast startup and cheap `reindex`.

### Negative

- Purely lexical; no semantic/synonym matching.

### Risks

- Vocabulary mismatch could hurt recall — acceptable for now; a future ADR could
  revisit embeddings if needed.
