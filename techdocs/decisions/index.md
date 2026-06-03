# Architecture Decision Records

This log tracks the significant architecture and design decisions made for
`fluentui-mcp`. Each decision is documented with its context, the options
considered, and the rationale.

## Decision Log

| # | Date | Decision | Status |
|---|------|----------|--------|
| [ADR-001](./ADR-001-schema-as-source-of-truth) | 2026-06-04 | Schema as the single source of truth | ✅ Accepted |
| [ADR-002](./ADR-002-bundled-enhanced-json) | 2026-06-04 | Ship a bundled enhanced JSON; enrich offline | ✅ Accepted |
| [ADR-003](./ADR-003-llm-provider-model-family) | 2026-06-04 | LLM provider model-family request shaping | ✅ Accepted |
| [ADR-004](./ADR-004-tfidf-in-memory-search) | 2026-06-04 | TF-IDF in-memory search | ✅ Accepted |

## How to Read ADRs

Each ADR follows a standard format:

- **Context** — What situation or problem triggered this decision?
- **Decision** — What was decided?
- **Rationale** — Why was this chosen over alternatives?
- **Consequences** — What are the trade-offs and implications?

## When to Create an ADR

Create a new ADR when:

- Choosing a technology, framework, or library;
- Deciding on an architecture pattern or style;
- Choosing between multiple valid approaches;
- Making a decision that would be hard to reverse;
- Making a decision that future developers will question.
