# Custom Components

> **Module**: 03-patterns/composition
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02
> **Prerequisites**: [Recomposition](02-recomposition.md), [Component Architecture](../../01-foundation/05-component-architecture.md)

## Overview

When slot customization and recomposition aren't enough, you can build entirely new components that follow FluentUI v9's hooks architecture. This ensures your custom components feel native, support theming, and can themselves be recomposed by others.

This guide walks through the full process: type definitions, state hook, styles hook, render function, and assembly.

---

## Component Structure

Every FluentUI v9 component follows this file layout:

```
components/
└── StatusCard/
    ├── StatusCard.types.ts       # Type definitions (props, state, slots)
    ├── useStatusCard.ts          # State hook (props → state)
    ├── useStatusCardStyles.ts    # Styles hook (Griffel makeStyles)
    ├── renderStatusCard.tsx      # Render function (state → JSX)
    ├── StatusCard.tsx            # Assembly (forwardRef + combine hooks)
    └── index.ts                  # Public exports
```

---

## Step 1: Type Definitions

Define props, slots, and state types. Use `ComponentProps` and `ComponentState` from `@fluentui/react-utilities` for FluentUI compatibility:

```tsx
// StatusCard.types.ts
import type { ComponentProps, ComponentState, Slot } from '@fluentui/react-utilities';

/**
 * Slot definitions for StatusCard.
 * Each slot maps to a named sub-element that consumers can customize.
 */
export type StatusCardSlots = {
  /** Root element of the card. */
  root: Slot<'div'>;
  /** Icon displayed at the start of the card. */
  icon?: Slot<'span'>;
  /** Primary heading text. */
  heading: Slot<'h3'>;
  /** Secondary description text. */
  description?: Slot<'p'>;
  /** Status indicator badge. */
  statusBadge?: Slot<'span'>;
};

/**
 * Props accepted by the StatusCard component.
 * Extends slot definitions with custom behavior props.
 */
export type StatusCardProps = ComponentProps<StatusCardSlots> & {
  /** Status level controlling the card's visual treatment. */
  status?: 'success' | 'warning' | 'error' | 'info';
  /** Whether the card is interactive (clickable). */
  interactive?: boolean;
};

/**
 * Internal state of StatusCard, computed from props.
 * This is passed through the styles hook and render function.
 */
export type StatusCardState = ComponentState<StatusCardSlots> & {
  /** Resolved status for styling. Defaults to 'info'. */
  status: 'success' | 'warning' | 'error' | 'info';
  /** Whether the card is interactive. */
  interactive: boolean;
};
```

### Key Points

- **`Slot<'div'>`** defines a slot that renders as a `<div>` by default
- **Optional slots** use `?` — they render only when the consumer provides content
- **`ComponentProps`** merges slot props with standard HTML attributes
- **`ComponentState`** ensures all required slots have resolved values

---

## Step 2: State Hook

The state hook transforms props into a resolved state object. Use `getIntrinsicElementProps` and `slot` from `@fluentui/react-utilities`:

```tsx
// useStatusCard.ts
import * as React from 'react';
import { getIntrinsicElementProps, slot } from '@fluentui/react-utilities';
import type { StatusCardProps, StatusCardState } from './StatusCard.types';

/**
 * Transforms StatusCard props into internal state.
 *
 * - Resolves slot definitions to concrete elements
 * - Sets default values for optional props
 * - Computes derived state (e.g., ARIA attributes)
 *
 * @param props - User-provided props
 * @param ref - Forwarded ref for the root element
 * @returns Resolved state object for styles + render hooks
 */
export const useStatusCard = (
  props: StatusCardProps,
  ref: React.Ref<HTMLDivElement>,
): StatusCardState => {
  const { status = 'info', interactive = false, ...rest } = props;

  const state: StatusCardState = {
    status,
    interactive,
    components: {
      root: 'div',
      icon: 'span',
      heading: 'h3',
      description: 'p',
      statusBadge: 'span',
    },

    // Root slot: merge intrinsic HTML props with role/tabIndex
    root: slot.always(
      getIntrinsicElementProps('div', {
        ref,
        role: interactive ? 'button' : 'region',
        tabIndex: interactive ? 0 : undefined,
        ...rest,
      }),
      { elementType: 'div' },
    ),

    // Optional slots: resolve only if consumer provided content
    icon: slot.optional(props.icon, { elementType: 'span' }),
    heading: slot.always(props.heading, { elementType: 'h3' }),
    description: slot.optional(props.description, { elementType: 'p' }),
    statusBadge: slot.optional(props.statusBadge, { elementType: 'span' }),
  };

  return state;
};
```

### `slot.always` vs `slot.optional`

| Function | Behavior | Use For |
|----------|----------|---------|
| `slot.always()` | Always renders, even without content | Root, required slots |
| `slot.optional()` | Renders only when content is provided | Icons, descriptions, badges |

---

## Step 3: Styles Hook

Use Griffel `makeStyles` with design tokens. Apply styles to slots via `className`:

```tsx
// useStatusCardStyles.ts
import { makeStyles, mergeClasses, tokens, shorthands } from '@fluentui/react-components';
import type { StatusCardState } from './StatusCard.types';
import type { SlotClassNames } from '@fluentui/react-utilities';

/** Static class names for CSS targeting. Pattern: fui-StatusCard__{slot} */
export const statusCardClassNames: SlotClassNames<StatusCardState> = {
  root: 'fui-StatusCard',
  icon: 'fui-StatusCard__icon',
  heading: 'fui-StatusCard__heading',
  description: 'fui-StatusCard__description',
  statusBadge: 'fui-StatusCard__statusBadge',
};

const useRootStyles = makeStyles({
  base: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalM,
    borderRadius: tokens.borderRadiusMedium,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  interactive: {
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    ':active': {
      backgroundColor: tokens.colorNeutralBackground1Pressed,
    },
  },
});

const useStatusStyles = makeStyles({
  success: { borderLeftColor: tokens.colorPaletteGreenBorder2, borderLeftWidth: '3px' },
  warning: { borderLeftColor: tokens.colorPaletteYellowBorder2, borderLeftWidth: '3px' },
  error: { borderLeftColor: tokens.colorPaletteRedBorder2, borderLeftWidth: '3px' },
  info: { borderLeftColor: tokens.colorPaletteBlueBorder2, borderLeftWidth: '3px' },
});

const useHeadingStyles = makeStyles({
  base: {
    margin: '0',
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase300,
  },
});

const useDescriptionStyles = makeStyles({
  base: {
    margin: '0',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    lineHeight: tokens.lineHeightBase200,
  },
});

/**
 * Applies Griffel styles to each slot in the StatusCard state.
 */
export const useStatusCardStyles = (state: StatusCardState): StatusCardState => {
  const rootStyles = useRootStyles();
  const statusStyles = useStatusStyles();
  const headingStyles = useHeadingStyles();
  const descriptionStyles = useDescriptionStyles();

  // Root: base + status variant + interactive + user className
  state.root.className = mergeClasses(
    statusCardClassNames.root,
    rootStyles.base,
    statusStyles[state.status],
    state.interactive && rootStyles.interactive,
    state.root.className, // User className always last
  );

  // Heading slot
  if (state.heading) {
    state.heading.className = mergeClasses(
      statusCardClassNames.heading,
      headingStyles.base,
      state.heading.className,
    );
  }

  // Description slot
  if (state.description) {
    state.description.className = mergeClasses(
      statusCardClassNames.description,
      descriptionStyles.base,
      state.description.className,
    );
  }

  return state;
};
```

### Design Token Usage

Always use tokens from `@fluentui/react-components` instead of hardcoded colors:

| Need | Token | Hardcoded (❌) |
|------|-------|----------------|
| Background | `tokens.colorNeutralBackground1` | `#ffffff` |
| Text color | `tokens.colorNeutralForeground1` | `#242424` |
| Spacing | `tokens.spacingHorizontalM` | `12px` |
| Font size | `tokens.fontSizeBase300` | `14px` |
| Border radius | `tokens.borderRadiusMedium` | `4px` |

---

## Step 4: Render Function

The render function maps resolved state to JSX. Use `assertSlots` for type-safe slot rendering:

```tsx
// renderStatusCard.tsx
import * as React from 'react';
import { assertSlots } from '@fluentui/react-utilities';
import type { StatusCardState, StatusCardSlots } from './StatusCard.types';

/**
 * Renders StatusCard JSX from resolved state.
 * Uses assertSlots to get type-safe slot components.
 */
export const renderStatusCard = (state: StatusCardState) => {
  assertSlots<StatusCardSlots>(state);

  return (
    <state.root>
      {state.icon && <state.icon />}
      <div>
        <state.heading />
        {state.description && <state.description />}
      </div>
      {state.statusBadge && <state.statusBadge />}
    </state.root>
  );
};
```

### How `assertSlots` Works

`assertSlots` validates and transforms slot state so that each slot can be used as a JSX component:
- `<state.root>` renders the root `<div>` with all merged props/className
- `<state.icon />` renders the icon `<span>` (only when truthy)
- Slot props (className, aria-*, event handlers) are applied automatically

---

## Step 5: Assembly (ForwardRef Component)

Combine all hooks into the final exported component:

```tsx
// StatusCard.tsx
import * as React from 'react';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import type { StatusCardProps } from './StatusCard.types';
import { useStatusCard } from './useStatusCard';
import { useStatusCardStyles } from './useStatusCardStyles';
import { renderStatusCard } from './renderStatusCard';

/**
 * StatusCard — Displays a status message with icon, heading, and description.
 *
 * Follows FluentUI v9 hooks architecture:
 * 1. useStatusCard (state) → 2. useStatusCardStyles (styles) → 3. renderStatusCard (JSX)
 *
 * @example
 * ```tsx
 * <StatusCard
 *   status="success"
 *   icon={<CheckmarkCircleRegular />}
 *   heading="Deployment complete"
 *   description="All services are running."
 * />
 * ```
 */
export const StatusCard: ForwardRefComponent<StatusCardProps> = React.forwardRef(
  (props, ref) => {
    const state = useStatusCard(props, ref);
    useStatusCardStyles(state);
    return renderStatusCard(state);
  },
);

StatusCard.displayName = 'StatusCard';
```

---

## Step 6: Public Exports

Export everything consumers and recomposers need:

```tsx
// index.ts
export { StatusCard } from './StatusCard';
export type { StatusCardProps, StatusCardState, StatusCardSlots } from './StatusCard.types';

// Export hooks for recomposition by downstream consumers
export { useStatusCard } from './useStatusCard';
export { useStatusCardStyles, statusCardClassNames } from './useStatusCardStyles';
export { renderStatusCard } from './renderStatusCard';
```

---

## Usage Examples

### Basic Usage

```tsx
import { StatusCard } from './components/StatusCard';
import { CheckmarkCircleRegular, WarningRegular } from '@fluentui/react-icons';

function StatusPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <StatusCard
        status="success"
        icon={<CheckmarkCircleRegular />}
        heading="Build succeeded"
        description="Pipeline completed in 2m 34s."
      />
      <StatusCard
        status="warning"
        icon={<WarningRegular />}
        heading="High memory usage"
        description="Server is using 87% of available memory."
        interactive
        onClick={() => console.log('Navigate to details')}
      />
    </div>
  );
}
```

### Slot Customization

```tsx
// Override heading with custom element type
<StatusCard
  status="error"
  heading={{ children: 'Critical Error', as: 'h2' }}
  description={{
    children: (
      <>
        Database connection failed. <a href="/status">View status page</a>
      </>
    ),
  }}
/>
```

### Recomposing Your Custom Component

Because we exported hooks, others can recompose `StatusCard`:

```tsx
import * as React from 'react';
import { useStatusCard, useStatusCardStyles, renderStatusCard } from './components/StatusCard';
import type { StatusCardProps } from './components/StatusCard';
import type { ForwardRefComponent } from '@fluentui/react-utilities';

/**
 * AlertCard — A non-dismissible StatusCard that always shows status="error".
 */
export const AlertCard: ForwardRefComponent<Omit<StatusCardProps, 'status'>> =
  React.forwardRef((props, ref) => {
    const state = useStatusCard({ ...props, status: 'error' }, ref);
    useStatusCardStyles(state);
    return renderStatusCard(state);
  });

AlertCard.displayName = 'AlertCard';
```

---

## Best Practices

### ✅ Do

- **Export all hooks** — enables downstream recomposition
- **Use `slot.always` for required slots, `slot.optional` for optional** — prevents null rendering issues
- **Use design tokens exclusively** — ensures theme compatibility
- **Set `displayName`** — helps debugging in React DevTools
- **Provide `SlotClassNames`** — allows CSS targeting with `fui-ComponentName__slot` pattern
- **Place user `className` last** in `mergeClasses` — lets consumers override styles

### ❌ Don't

- **Don't use `private` in class-based components** — use `protected` (per project rules)
- **Don't hardcode colors or sizes** — always use tokens
- **Don't skip `forwardRef`** — library consumers expect ref forwarding
- **Don't mutate the state object after hooks** — treat it as immutable between phases

---

## Related Documentation

- [Recomposition Patterns](02-recomposition.md) — Simpler variant creation
- [Design System Extension](04-design-system-extension.md) — Scaling to a company design system
- [Testing Patterns](05-testing-patterns.md) — Testing custom components
- [Component Architecture](../../01-foundation/05-component-architecture.md) — FluentUI hooks model deep dive
- [Styling with Griffel](../../01-foundation/04-styling-griffel.md) — Griffel makeStyles reference
