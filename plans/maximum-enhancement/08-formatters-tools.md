# Formatters & Tools: Surface the New Fields

> **Document**: 08-formatters-tools.md
> **Parent**: [Index](00-index.md)

## Overview

The richest schema is worthless if MCP tools don't expose it. This phase updates
the formatters and tool handlers so the new enhanced fields (propGuidance,
antiPatterns, performanceNotes, themingNotes, compositionExamples,
relatedPatterns, edgeCases, plus guide/pattern additions) appear in tool output.
Resolves AR-2 at the consumption layer.

## Architecture

### Current Architecture

- `src/formatters/component-formatter.ts` renders a component (description,
  best practices, accessibility, patterns, styling) to markdown for tools like
  `query_component`.
- `src/formatters/props-formatter.ts` renders the props reference.
- `src/formatters/guide-formatter.ts` / `pattern-formatter.ts` render guides/patterns.
- Tool handlers in `src/tools/*` call the formatters.

### Proposed Changes

Add rendering for the new fields, each section **conditionally** rendered only
when the field is present (back-compat with old schemas).

## Implementation Details

### component-formatter.ts

Append sections after the existing ones, in this order:
1. **Prop Guidance** — table or list of `{prop, guidance, example?}`.
2. **Composition Examples** — like commonPatterns, for slot composition.
3. **Anti-Patterns** — ❌ problem / ✅ solution (+ code).
4. **Performance** — `performanceNotes`.
5. **Theming & Tokens** — `themingNotes`.
6. **Edge Cases** — bullet list.
7. **Related Patterns** — links/ids.

```ts
function renderAntiPatterns(items?: AntiPattern[]): string {
  if (!items?.length) return '';
  return [
    '## Anti-Patterns',
    ...items.map((a) =>
      `### ${a.title}\n\n❌ ${a.problem}\n\n✅ ${a.solution}` +
      (a.code ? `\n\n\`\`\`tsx\n${a.code}\n\`\`\`` : ''),
    ),
  ].join('\n\n');
}
```

### props-formatter.ts

When a prop has matching `propGuidance`, append the guidance under that prop's row.

### guide-formatter.ts / pattern-formatter.ts

Render `keyTakeaways`, `pitfalls`, `accessibilityNotes` (guides) and
`whenToUse`/`whenNotToUse`/`accessibilityNotes`/`pitfalls` (patterns) when present.

### Tools

- `query-component.ts`, `get-props-reference.ts`, `get-component-examples.ts`:
  no signature change — they call the updated formatters, so new sections flow
  through automatically. Verify each passes the full enhanced entry.
- `get-pattern.ts`, `get-foundation.ts`, `get-enterprise.ts`: same.

## Integration Points

- Formatters receive the full `ComponentEntry`/`GuideEntry`/`PatternEntry` (they
  already do); only rendering logic changes.

## Error Handling

| Error Case | Handling Strategy | AR Ref |
| ---------- | ----------------- | ------ |
| New field undefined | Section omitted entirely (no empty headers) | AR #2 |
| `propGuidance.prop` not in props | Render guidance as a standalone note | AR #2 |
| Empty arrays | Treated same as undefined (omit) | AR #2 |

## Testing Requirements

- Component formatter renders each new section when present (ST-27).
- Component formatter omits sections when absent, no errors (ST-28).
- Props/guide/pattern formatters surface their new fields.
- Tool-level tests assert new content appears end-to-end (ST-29).
- Existing formatter tests updated for any output ordering changes.
