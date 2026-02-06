# Composition Patterns

> **Module**: 03-patterns/composition
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02

## Overview

Composition patterns for building custom, reusable components with FluentUI v9. This module covers slot customization, component recomposition, building custom components using FluentUI's hooks architecture, extending the design system, and testing strategies.

FluentUI v9 is built on a **hooks composition model** that separates each component into three phases:
1. **State Hook** (`useComponent_unstable`) — props-to-state transformation
2. **Styles Hook** (`useComponentStyles_unstable`) — apply Griffel styles
3. **Render Function** (`renderComponent_unstable`) — JSX output

This architecture enables deep customization without forking.

## Documentation Index

| File | Description |
|------|-------------|
| [01-slot-customization.md](01-slot-customization.md) | Customizing component slots (content, props, element types) |
| [02-recomposition.md](02-recomposition.md) | Creating component variants via hook recomposition |
| [03-custom-components.md](03-custom-components.md) | Building custom components with FluentUI patterns |
| [04-design-system-extension.md](04-design-system-extension.md) | Extending FluentUI as a company design system |
| [05-testing-patterns.md](05-testing-patterns.md) | Testing custom and composed components |

## Quick Reference

### Slot Customization (Most Common)

```tsx
import { Button } from '@fluentui/react-components';
import { CalendarRegular } from '@fluentui/react-icons';

// Pass icon as shorthand
<Button icon={<CalendarRegular />}>Schedule</Button>

// Override slot props
<Button icon={{ children: <CalendarRegular />, 'aria-hidden': false }}>
  Schedule
</Button>

// Replace entire slot with render function
<Button
  icon={{
    children: (Component, props) => <b {...props}>★</b>,
  }}
>
  Starred
</Button>
```

### Component Recomposition (Advanced)

```tsx
import {
  useButton_unstable,
  useButtonStyles_unstable,
  renderButton_unstable,
} from '@fluentui/react-components';
import type { ButtonProps } from '@fluentui/react-components';
import type { ForwardRefComponent } from '@fluentui/react-utilities';

// Create a PrimaryButton variant with locked appearance
export const PrimaryButton: ForwardRefComponent<Omit<ButtonProps, 'appearance'>> =
  React.forwardRef((props, ref) => {
    const state = useButton_unstable({ ...props, appearance: 'primary' }, ref);
    useButtonStyles_unstable(state);
    return renderButton_unstable(state);
  });
```

### Custom Wrapper (Simplest)

```tsx
import { Button, makeStyles, mergeClasses } from '@fluentui/react-components';
import type { ButtonProps } from '@fluentui/react-components';

const useStyles = makeStyles({
  brand: { fontWeight: 700 },
});

export const BrandButton: React.FC<ButtonProps> = (props) => {
  const styles = useStyles();
  return (
    <Button
      {...props}
      appearance="primary"
      className={mergeClasses(styles.brand, props.className)}
    />
  );
};
```

## When to Use Each Pattern

| Pattern | Complexity | Use When |
|---------|-----------|----------|
| **Slot customization** | Low | Changing content, icons, or props of sub-elements |
| **className override** | Low | Adding custom styles to existing components |
| **Wrapper component** | Low | Locking props/adding defaults to existing components |
| **Hook recomposition** | Medium | Overriding state logic, custom behavior, or styles |
| **Full custom component** | High | Building entirely new components following FluentUI patterns |

## Key Concepts

### Slots

Slots are named sub-elements within a component. For example, `Button` has a `root` slot and an optional `icon` slot. Every slot can be customized by passing:
- **JSX element** — replaces slot content
- **Props object** — merges with default slot props
- **Render function** — replaces the entire slot element

### Hooks Architecture

Every FluentUI v9 component exports its internal hooks:
- `useComponent_unstable(props, ref)` → state object
- `useComponentStyles_unstable(state)` → styled state
- `renderComponent_unstable(state)` → JSX

You can intercept any phase to create variants.

### The `_unstable` Suffix

The `_unstable` suffix on hooks indicates these are **internal APIs** that may change between minor versions. They are stable enough for production use but don't follow strict semver for their signatures. Use them when you need deep customization.

## Best Practices

1. **Prefer simpler patterns** — Use slot customization or wrapper components before reaching for recomposition
2. **Always forward refs** — Use `React.forwardRef` when creating component variants
3. **Preserve className merging** — Always use `mergeClasses()` to combine custom and user classNames
4. **Export hooks** — If building a reusable component, export all three hooks for downstream recomposition
5. **Use design tokens** — Reference `tokens` from `@fluentui/react-components` instead of hardcoded values

## Related Documentation

- [Component Architecture](../../01-foundation/05-component-architecture.md)
- [Styling with Griffel](../../01-foundation/04-styling-griffel.md)
- [FluentProvider & Theming](../../01-foundation/02-fluent-provider.md)
