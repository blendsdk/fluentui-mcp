# ADR-005: Example validation as the trust guarantee

> **Status**: Accepted
> **Date**: 2026-09-19
> **Authorising decision**: AR-19, AR-21

## Context

The value of the skill rests on its examples. If an example imports a package that does not exist,
names a component that is not exported, or passes a prop the component does not accept, an agent
will copy the mistake. Prose review cannot catch this reliably at scale.

## Decision

Validate every TypeScript example against the real installed package, in tiers:

- **Tier 1a — package.** The imported package must resolve.
- **Tier 1b — exports.** Every named import must be a real export of that package.
- **Tier 2 — types.** A throwaway project is compiled with the TypeScript compiler; diagnostics are
  reported but do not by themselves fail the run.
- **Component mentions hard-fail** when they are not exports of `@fluentui/react-components`.
- **Prop guidance is reported, not failing**, because prop labels are descriptive and are repaired
  over time.

Validation never executes example code; it parses and type-checks it.

## Alternatives considered

- **No validation.** Rejected: leaves the core value unguarded.
- **Gate on all type errors.** Rejected: type-only noise blocks generation for issues that do not
  affect API correctness.
- **Trust the LLM.** Rejected: it is exactly how invented props reached the content.

## Consequences

- A broken import or fabricated component fails generation, so it cannot ship.
- Example compilation is part of the pipeline and runs in the test suite.
- Real subcomponents pass (they are checked against package exports), while package concepts that
  are not components fail.
- Prop-guidance warnings are tracked and repaired rather than blocking.
- Related plan decisions: PR-11 (resolution source), PR-12 (component hard-fail, prop report-only),
  PR-13 (repair broken symbols).
