# State Management Patterns

> **Module**: 03-patterns/state
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02

## Overview

State management patterns for integrating FluentUI v9 components with local state, global stores, and server-side data. FluentUI v9 components support both controlled and uncontrolled modes, making them compatible with any state management approach.

This module covers the full spectrum from simple local state to complex enterprise patterns.

## Documentation Index

| File | Description |
|------|-------------|
| [01-controlled-uncontrolled.md](01-controlled-uncontrolled.md) | Controlled vs uncontrolled component patterns |
| [02-form-state.md](02-form-state.md) | Managing state across multi-field forms |
| [03-context-patterns.md](03-context-patterns.md) | React Context for shared UI state (theme, auth, layout) |
| [04-external-stores.md](04-external-stores.md) | Redux, Zustand, and Jotai integration |
| [05-server-state.md](05-server-state.md) | React Query, SWR, and data fetching patterns |
| [06-complex-state.md](06-complex-state.md) | Undo/redo, pagination, filter/sort management |

## Quick Reference

### Controlled Input

```tsx
import { Input } from '@fluentui/react-components';

const [value, setValue] = React.useState('');

<Input
  value={value}
  onChange={(e, data) => setValue(data.value)}
/>
```

### Uncontrolled Input

```tsx
import { Input } from '@fluentui/react-components';

const inputRef = React.useRef<HTMLInputElement>(null);

<Input
  defaultValue="initial"
  ref={inputRef}
/>
```

### FluentUI `onChange` Signature

FluentUI v9 components follow a consistent `onChange` pattern:

```tsx
// All FluentUI v9 onChange handlers receive:
// 1. The React synthetic event
// 2. A data object with the new value
onChange?: (event: React.SyntheticEvent, data: { value: T }) => void;

// Examples:
// Input:    (e, data) => data.value is string
// Checkbox: (e, data) => data.checked is boolean | 'mixed'
// Select:   (e, data) => data.value is string
// Slider:   (e, data) => data.value is number
// Switch:   (e, data) => data.checked is boolean
```

This two-argument pattern differs from standard HTML inputs (which only pass the event). Always destructure the `data` parameter for the value.

## When to Use Each Pattern

| Need | Pattern | File |
|------|---------|------|
| Single input value | Controlled component | [01](01-controlled-uncontrolled.md) |
| Form with many fields | Form state hook or library | [02](02-form-state.md) |
| Theme/locale shared across app | React Context | [03](03-context-patterns.md) |
| Complex app-wide state | Redux or Zustand | [04](04-external-stores.md) |
| Data from API/server | React Query or SWR | [05](05-server-state.md) |
| Undo/redo, filters, pagination | Complex state patterns | [06](06-complex-state.md) |

## Key Concept: FluentUI's Two-Argument onChange

The most important difference between FluentUI v9 and standard HTML is the `onChange` signature:

```tsx
// ❌ Standard HTML pattern (won't work with FluentUI)
<input onChange={(e) => setValue(e.target.value)} />

// ✅ FluentUI v9 pattern (always use the data parameter)
<Input onChange={(e, data) => setValue(data.value)} />
```

This applies to all FluentUI form components: Input, Textarea, Select, Combobox, Checkbox, Radio, Switch, Slider, SpinButton, etc.

## Related Documentation

- [Form Patterns](../forms/00-forms-index.md) — Complete form implementation patterns
- [Data Fetching Patterns](../data/04-data-fetching.md) — Loading and caching data
- [FluentProvider](../../01-foundation/02-fluent-provider.md) — Provider and context setup
