# Schema Expansion: New Enhanced Fields

> **Document**: 05-schema-expansion.md
> **Parent**: [Index](00-index.md)

## Overview

Extend the enhanced schema types with new **optional** rich fields so the
enhancer can capture far more structured guidance than competitors. All fields
are optional to preserve backward compatibility with existing enhanced schemas.
Resolves AR-2.

## Architecture

### Current Architecture

`ComponentEnhanced` (in `src/types/schema.ts`) has: `description`, `whenToUse`,
`bestPractices{dos,donts}`, `accessibility{...}`, `commonPatterns[]`,
`stylingTips`, `migrationNotes?`. `UtilityEnhanced` has `description`,
`whenToUse`, `commonPatterns[]`. Guides/patterns have `content`,
`codeExamples`/`examples`, `referencedComponents`.

### Proposed Changes — new optional fields

All additions are optional (`?`) and additive.

## Implementation Details

### `ComponentEnhanced` additions (src/types/schema.ts)

```ts
export interface ComponentEnhanced {
  // ...existing fields unchanged...

  /** Per-prop usage guidance keyed by prop name. */
  propGuidance?: PropGuidance[];

  /** Anti-patterns: things people commonly get wrong, with the correct fix. */
  antiPatterns?: AntiPattern[];

  /** Performance considerations (memoization, re-render costs, virtualization). */
  performanceNotes?: string;

  /** Theming & design-token guidance (which tokens to use, dark mode, RTL). */
  themingNotes?: string;

  /** Slot-composition examples demonstrating slot overrides/children. */
  compositionExamples?: PatternExample[];

  /** Related-pattern links (pattern/guide ids this component participates in). */
  relatedPatterns?: string[];

  /** Edge cases & gotchas (controlled/uncontrolled, async, empty states). */
  edgeCases?: string[];
}

export interface PropGuidance {
  /** Prop name (must exist in the component's props). */
  prop: string;
  /** When/why to set this prop and recommended values. */
  guidance: string;
  /** Example values or a short snippet. */
  example?: string;
}

export interface AntiPattern {
  /** Short title of the mistake. */
  title: string;
  /** What people do wrong. */
  problem: string;
  /** The correct approach. */
  solution: string;
  /** Optional corrected code snippet. */
  code?: string;
}
```

### `UtilityEnhanced` additions

```ts
export interface UtilityEnhanced {
  // ...existing fields unchanged...

  /** Per-export usage guidance. */
  exportGuidance?: ExportGuidance[];

  /** Performance considerations. */
  performanceNotes?: string;

  /** Edge cases & gotchas. */
  edgeCases?: string[];
}

export interface ExportGuidance {
  /** Export name (must exist in the utility's exports). */
  export: string;
  /** When/why to use this export. */
  guidance: string;
  example?: string;
}
```

### Guide/Pattern additions

```ts
export interface GuideEntry {
  // ...existing...
  /** Key takeaways / TL;DR bullets. */
  keyTakeaways?: string[];
  /** Common pitfalls for this topic. */
  pitfalls?: string[];
  /** Accessibility callouts relevant to the guide. */
  accessibilityNotes?: string;
}

export interface PatternEntry {
  // ...existing...
  /** When to use / when not to use this pattern. */
  whenToUse?: string;
  whenNotToUse?: string;
  /** Accessibility callouts for the composed pattern. */
  accessibilityNotes?: string;
  /** Pitfalls specific to this pattern. */
  pitfalls?: string[];
}
```

### Raw response interfaces (enhancer.ts)

Extend `RawComponentEnhancement`, `RawUtilityEnhancement`, `RawGuide`,
`RawPattern` with the matching optional fields, and extend the `mapXxx`
functions to copy them through (defaulting to `undefined`/`[]`).

## Integration Points

- `enhancer.ts` mapping functions copy new fields.
- `schema-validator.ts` validates new fields (Phase 4 / `06`).
- Formatters/tools render new fields (Phase 7 / `08`).

## Error Handling

| Error Case | Handling Strategy | AR Ref |
| ---------- | ----------------- | ------ |
| LLM omits a new field | Field stays `undefined`; formatters skip it | AR #2 |
| `propGuidance.prop` references a non-existent prop | Validator emits a **warning** (not error); kept in output | AR #2 |
| Old enhanced schema lacks new fields | Loads fine (fields optional) | AR #2 |

## Testing Requirements

- Type-level: new fields compile and are optional.
- `mapComponentEnhanced`/`mapUtilityEnhanced`/`mapGuideEntry`/`mapPatternEntry`
  copy new fields when present and default cleanly when absent.
- Back-compat: an enhanced schema without new fields validates with 0 errors.
- Validator: `propGuidance` referencing an unknown prop yields a warning.
