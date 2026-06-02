# Grounding Data Layer: Remove Cap, Enrich Summaries, Targeted Injection

> **Document**: 04-grounding-data.md
> **Parent**: [Index](00-index.md)

## Overview

Feed the model **everything**. Remove `KEY_PROPS_LIMIT`, enrich
`ComponentSummary` with full props (and their types), all slots, imports,
`relatedComponents`, and `additionalExports`, and give guide prompts the full
data for the components each guide actually targets (smart-maximal). Resolves
AR-3, AR-4, AR-6, AR-7.

## Architecture

### Current Architecture

- `shared.ts` caps props at 6 names; `ComponentSummary` holds only
  `name/category/importStatement/keyProps`.
- `component-enhance.ts` serializes stories with `renderCode` only.
- Guide prompts inject `serializeComponentSummaries(allSummaries)` (trimmed).

### Proposed Changes

1. **Delete `KEY_PROPS_LIMIT`** and the `.slice()`.
2. **Enrich `ComponentSummary`** (`types.ts`) to carry full prop/slot data.
3. **Rewrite `serializeComponentSummaries`** to emit full, structured grounding.
4. **Component prompt**: serialize all stories with full `code`, plus
   `relatedComponents` and `additionalExports`.
5. **Guide prompts**: add a `targetComponents` concept so each guide spec can
   declare the components it focuses on; inject their *complete* data
   (`serializeComponentForPrompt`-style) in addition to the full inventory.

## Implementation Details

### Enriched `ComponentSummary` (types.ts)

```ts
export interface ComponentSummary {
  name: string;
  category: string;
  importStatement: string;
  /** Every prop with name + type + required flag (no cap). */
  props: { name: string; type: string; required: boolean }[];
  /** Every slot with name + elementType. */
  slots: { name: string; elementType: string }[];
  /** Related component names. */
  relatedComponents: string[];
  /** Additional package exports (hooks, types). */
  additionalExports: string[];
}
```

> **Note:** `keyProps` is removed. All consumers (guide prompts, tests) update to
> `props`. This is a breaking shape change handled in the same phase.

### Rewritten `shared.ts`

```ts
export function toComponentSummary(c: ComponentEntry): ComponentSummary {
  return {
    name: c.name,
    category: c.category,
    importStatement: c.importStatement,
    props: c.props.map((p) => ({ name: p.name, type: p.type, required: p.required })),
    slots: c.slots.map((s) => ({ name: s.name, elementType: s.elementType })),
    relatedComponents: c.relatedComponents,
    additionalExports: c.additionalExports,
  };
}

export function serializeComponentSummaries(summaries: ComponentSummary[]): string {
  return summaries.map(serializeOneSummary).join('\n\n');
}
```

`serializeOneSummary` emits, per component, the import statement, the full prop
table (`name: type (required)`), the slot list, related components, and
additional exports — no truncation.

### Component prompt grounding (component-enhance.ts)

`serializeComponentForPrompt` updates to include, for every story:

```ts
stories: component.stories.map((s) => ({
  name: s.name,
  description: s.description,
  imports: s.imports,
  code: s.code,        // full code (imports + styles + render) — AR-4
  renderCode: s.renderCode,
})),
relatedComponents: component.relatedComponents,   // AR-7
additionalExports: component.additionalExports,   // AR-7
```

(Props and slots are already fully serialized — confirm no caps remain.)

### Targeted guide grounding

Add an optional `targetComponentIds: string[]` to `GuideSpec` (config.ts) for
guides that focus on specific components (e.g. `login-form` → Input, Button,
Field). The guide message builders inject:

- the full inventory via `serializeComponentSummaries` (now uncapped), AND
- the complete `serializeComponentForPrompt` data for each targeted component.

`GuideGenerationContext` gains `targetComponents: ComponentEntry[]`, populated by
the orchestrator from `spec.targetComponentIds`.

### Input-budget guard (PF-008 — "smart-maximal", not "blindly maximal")

Injecting the **full uncapped inventory** plus **complete targeted-component data**
risks overflowing the model's *input* context window — the same data-loss failure
mode we kill on the output side, only silent. To make smart-maximal genuinely
smart, the guide/pattern message builders estimate the prompt's input size and
degrade gracefully:

```ts
// scripts/enhancer/prompts/shared.ts
/** Rough token estimate (~4 chars/token) — good enough for budgeting. */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/** Safe input budget reserved for grounding (leaves room for instructions + output). */
export const GROUNDING_INPUT_BUDGET_TOKENS = 60_000; // tune per model context
```

Builder strategy:
1. Always serialize **targeted** components at **full fidelity** (they are what the
   guide actually composes — never degrade these).
2. Serialize the **non-targeted** inventory at full fidelity *if* the combined
   estimate fits `GROUNDING_INPUT_BUDGET_TOKENS`.
3. If it would exceed the budget, fall back to a **compact** inventory line for the
   non-targeted components (`name + importStatement + prop names only`), preserving
   breadth without blowing the window.
4. In verbose mode, log whether the full or compact inventory was used.

This guarantees the components a guide depends on are always complete, while the
periphery compresses only when necessary — quality where it counts, no silent
input truncation.


## Integration Points

- `enhancer.ts` `buildComponentSummaries(rawSchema.components)` unchanged call,
  new richer output.
- `generateGuides`/`generatePatterns` resolve `targetComponents` from the raw
  component list and pass them into the message builders.

## Code Examples

### Example targeted spec

```ts
{ id: 'login-form', title: 'Login Form Pattern', group: 'forms',
  targetComponentIds: ['input', 'button', 'field', 'checkbox'] }
```

## Error Handling

| Error Case | Handling Strategy | AR Ref |
| ---------- | ----------------- | ------ |
| A `targetComponentId` not found in inventory | Skip it, log a verbose warning (do not fail the guide) | AR #3 |
| Component has zero props/slots/stories | Serialize empty sections cleanly | AR #6 |
| Inventory exceeds input budget | Targeted components stay full; non-targeted inventory degrades to compact lines (PF-008) | AR #3 / PF-008 |

## Testing Requirements

- `toComponentSummary` returns ALL props (no cap) with types, all slots, related,
  additional exports.
- `serializeComponentSummaries` includes every prop name+type and slot.
- `serializeComponentForPrompt` includes full story `code` and compositions.
- Guide context resolves `targetComponents` from ids; unknown ids skipped.
- Input-budget guard (PF-008): when the estimated inventory fits the budget, the
  full inventory is emitted; when it exceeds the budget, targeted components remain
  full-fidelity while non-targeted ones degrade to compact lines.
- Update existing `prompts.test.ts` expectations for the new shapes.

