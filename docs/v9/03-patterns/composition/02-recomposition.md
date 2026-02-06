# Recomposition Patterns

> **Module**: 03-patterns/composition
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02
> **Prerequisites**: [Slot Customization](01-slot-customization.md), [Component Architecture](../../01-foundation/05-component-architecture.md)

## Overview

Recomposition is FluentUI v9's advanced customization pattern. It lets you intercept any phase of a component's lifecycle — state, styles, or rendering — to create new variants without forking the library. This is how FluentUI itself creates component variants (e.g., `ToolbarButton` recomposes `Button`).

---

## When to Use Recomposition

| Need | Pattern | Example |
|------|---------|---------|
| Lock a prop value | Wrapper component | `PrimaryButton` always has `appearance="primary"` |
| Add custom styles | className or wrapper | `GlowButton` adds a box-shadow |
| Change default behavior | Hook recomposition | `AutoFocusInput` focuses on mount |
| Override rendering | Render recomposition | `IconOnlyButton` changes JSX layout |
| Full custom component | All three hooks | Company-specific components |

**Rule of thumb:** Use the simplest pattern that works. Don't recompose if a wrapper or slot customization solves the problem.

---

## Pattern 1: Wrapper Components (Simplest)

Lock props or add defaults without touching internal hooks:

```tsx
import * as React from 'react';
import { Button, makeStyles, mergeClasses } from '@fluentui/react-components';
import type { ButtonProps } from '@fluentui/react-components';

// Lock appearance to "primary"
export const PrimaryButton: React.FC<Omit<ButtonProps, 'appearance'>> = (props) => (
  <Button {...props} appearance="primary" />
);

// Add custom styles while preserving user className
const useStyles = makeStyles({
  danger: {
    backgroundColor: '#d32f2f',
    color: 'white',
    ':hover': {
      backgroundColor: '#b71c1c',
    },
  },
});

export const DangerButton: React.FC<ButtonProps> = ({ className, ...props }) => {
  const styles = useStyles();
  return (
    <Button
      {...props}
      className={mergeClasses(styles.danger, className)}
    />
  );
};
```

**Limitation:** Wrappers can't change internal state logic or rendering structure.

---

## Pattern 2: Hook Recomposition (State Override)

Override the state hook to change default behavior:

```tsx
import * as React from 'react';
import {
  useButton_unstable,
  useButtonStyles_unstable,
  renderButton_unstable,
} from '@fluentui/react-components';
import type { ButtonProps, ButtonState } from '@fluentui/react-components';
import type { ForwardRefComponent } from '@fluentui/react-utilities';

/**
 * IconButton — A button that only renders an icon without text.
 * Forces icon-only layout and defaults to "subtle" appearance.
 */
export const IconButton: ForwardRefComponent<
  Omit<ButtonProps, 'appearance'> & { 'aria-label': string }
> = React.forwardRef((props, ref) => {
  // 1. Call the original state hook with overridden defaults
  const state = useButton_unstable(
    {
      ...props,
      appearance: 'subtle',
      // Icon-only buttons need no children text
      children: undefined,
    },
    ref,
  );

  // 2. Apply original styles (no changes needed)
  useButtonStyles_unstable(state);

  // 3. Render with original render function
  return renderButton_unstable(state);
});

IconButton.displayName = 'IconButton';

// Usage:
// <IconButton icon={<DeleteRegular />} aria-label="Delete item" />
```

### Intercepting State for Custom Behavior

```tsx
import * as React from 'react';
import {
  useInput_unstable,
  useInputStyles_unstable,
  renderInput_unstable,
} from '@fluentui/react-components';
import type { InputProps } from '@fluentui/react-components';
import type { ForwardRefComponent } from '@fluentui/react-utilities';

/**
 * AutoFocusInput — An Input that automatically focuses on mount.
 */
export const AutoFocusInput: ForwardRefComponent<InputProps> = React.forwardRef(
  (props, ref) => {
    const innerRef = React.useRef<HTMLInputElement>(null);

    // Merge refs so both the inner ref and forwarded ref work
    const mergedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        (innerRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }
      },
      [ref],
    );

    React.useEffect(() => {
      innerRef.current?.focus();
    }, []);

    const state = useInput_unstable(props, mergedRef);
    useInputStyles_unstable(state);
    return renderInput_unstable(state);
  },
);

AutoFocusInput.displayName = 'AutoFocusInput';
```

---

## Pattern 3: Style Recomposition (Custom Styles Hook)

Replace or extend the styles hook to apply different visual treatments:

```tsx
import * as React from 'react';
import {
  useButton_unstable,
  renderButton_unstable,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import type { ButtonProps, ButtonState } from '@fluentui/react-components';
import type { ForwardRefComponent } from '@fluentui/react-utilities';

const useGlassStyles = makeStyles({
  root: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(12px)',
    border: `1px solid rgba(255, 255, 255, 0.2)`,
    color: tokens.colorNeutralForeground1,
    borderRadius: tokens.borderRadiusMedium,
    ':hover': {
      background: 'rgba(255, 255, 255, 0.25)',
    },
    ':active': {
      background: 'rgba(255, 255, 255, 0.1)',
    },
  },
});

/**
 * Custom styles hook that replaces the default Button styles
 * with a glassmorphism effect.
 */
const useGlassButtonStyles = (state: ButtonState): ButtonState => {
  const styles = useGlassStyles();

  // Apply custom styles to the root slot
  state.root.className = mergeClasses(
    'fui-GlassButton',
    styles.root,
    state.root.className, // User className always last
  );

  return state;
};

/**
 * GlassButton — A button with glassmorphism styling.
 */
export const GlassButton: ForwardRefComponent<ButtonProps> = React.forwardRef(
  (props, ref) => {
    const state = useButton_unstable(props, ref);

    // Use custom styles hook instead of default
    useGlassButtonStyles(state);

    return renderButton_unstable(state);
  },
);

GlassButton.displayName = 'GlassButton';
```

### Extending Default Styles (Additive)

When you want to **add** styles on top of the defaults rather than replace them:

```tsx
import {
  useButton_unstable,
  useButtonStyles_unstable,
  renderButton_unstable,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import type { ButtonProps, ButtonState } from '@fluentui/react-components';

const useAdditionalStyles = makeStyles({
  pulsing: {
    animationName: {
      from: { boxShadow: `0 0 0 0 ${tokens.colorBrandBackground}` },
      to: { boxShadow: `0 0 0 8px transparent` },
    },
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
  },
});

export const PulsingButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const state = useButton_unstable(props, ref);

    // Apply default styles FIRST
    useButtonStyles_unstable(state);

    // Then add additional styles on top
    const additionalStyles = useAdditionalStyles();
    state.root.className = mergeClasses(
      state.root.className,
      additionalStyles.pulsing,
    );

    return renderButton_unstable(state);
  },
);
```

---

## Pattern 4: Render Recomposition (Custom JSX)

Replace the render function to change the component's JSX structure:

```tsx
import * as React from 'react';
import {
  useButton_unstable,
  useButtonStyles_unstable,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import type { ButtonProps } from '@fluentui/react-components';
import type { ForwardRefComponent } from '@fluentui/react-utilities';

const useBadgeStyles = makeStyles({
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    minWidth: '18px',
    height: '18px',
    borderRadius: '9px',
    backgroundColor: tokens.colorPaletteRedBackground3,
    color: 'white',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
  },
  wrapper: {
    position: 'relative',
    display: 'inline-flex',
  },
});

interface NotificationButtonProps extends ButtonProps {
  /** Number to show in the badge. Hidden when 0 or undefined. */
  count?: number;
}

/**
 * NotificationButton — A button with a notification badge overlay.
 * Custom render function adds a badge element outside the standard Button structure.
 */
export const NotificationButton: ForwardRefComponent<NotificationButtonProps> =
  React.forwardRef(({ count, ...props }, ref) => {
    const state = useButton_unstable(props, ref);
    useButtonStyles_unstable(state);

    const badgeStyles = useBadgeStyles();

    // Custom render: wrap the standard button output with a badge
    return (
      <span className={badgeStyles.wrapper}>
        {/* Render the standard button using its state */}
        <button {...state.root}>
          {state.icon && <state.icon />}
          {state.root.children}
        </button>
        {count && count > 0 ? (
          <span className={badgeStyles.badge} aria-label={`${count} notifications`}>
            {count > 99 ? '99+' : count}
          </span>
        ) : null}
      </span>
    );
  });

NotificationButton.displayName = 'NotificationButton';
```

---

## Real-World Example: ToolbarButton

FluentUI itself uses recomposition extensively. Here's how `ToolbarButton` recomposes `Button`:

```tsx
// Simplified from FluentUI source
import * as React from 'react';
import {
  useButton_unstable,
  useButtonStyles_unstable,
  renderButton_unstable,
} from '@fluentui/react-components';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import type { ToolbarButtonProps } from './ToolbarButton.types';
import { useToolbarContext } from '../ToolbarContext';

export const ToolbarButton: ForwardRefComponent<ToolbarButtonProps> = React.forwardRef(
  (props, ref) => {
    // Read context from parent Toolbar to get size
    const { size } = useToolbarContext();

    // Recompose Button with Toolbar-specific defaults
    const state = useButton_unstable(
      {
        ...props,
        // Default to small size in toolbar context
        size: props.size ?? (size === 'small' ? 'small' : 'medium'),
        // Default to subtle appearance
        appearance: props.appearance ?? 'subtle',
      },
      ref,
    );

    useButtonStyles_unstable(state);
    return renderButton_unstable(state);
  },
);
```

**Key takeaway:** Recomposition lets child components adapt to parent context while reusing all of the base component's logic.

---

## Combining Multiple Recomposition Patterns

For complex variants, combine state, style, and render overrides:

```tsx
import * as React from 'react';
import {
  useButton_unstable,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import type { ButtonProps, ButtonState } from '@fluentui/react-components';
import type { ForwardRefComponent } from '@fluentui/react-utilities';

// Custom styles
const useStyles = makeStyles({
  root: {
    minHeight: '48px',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
  },
  label: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  description: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
});

interface StackedButtonProps extends ButtonProps {
  /** Secondary description text below the label */
  description?: string;
}

/**
 * StackedButton — A button with vertically stacked label and description.
 * Combines state override (layout direction) + custom styles + custom render.
 */
export const StackedButton: ForwardRefComponent<StackedButtonProps> = React.forwardRef(
  ({ description, children, ...props }, ref) => {
    // 1. State: use standard button state
    const state = useButton_unstable(props, ref);

    // 2. Styles: apply custom stacked styles
    const styles = useStyles();
    state.root.className = mergeClasses(
      'fui-StackedButton',
      styles.root,
      state.root.className,
    );

    // 3. Render: custom JSX with description
    return (
      <button {...state.root}>
        {state.icon && <state.icon />}
        <span>
          <span className={styles.label}>{children}</span>
          {description && (
            <span className={styles.description}>{description}</span>
          )}
        </span>
      </button>
    );
  },
);

StackedButton.displayName = 'StackedButton';

// Usage:
// <StackedButton icon={<MailRegular />} description="3 unread messages">
//   Inbox
// </StackedButton>
```

---

## Best Practices

### ✅ Do

```tsx
// ✅ Always use React.forwardRef for recomposed components
export const MyButton = React.forwardRef((props, ref) => { ... });

// ✅ Always set displayName for debugging
MyButton.displayName = 'MyButton';

// ✅ Preserve user className (always last in mergeClasses)
state.root.className = mergeClasses(styles.custom, state.root.className);

// ✅ Export hooks if others may need to recompose your component
export { useMyButton, useMyButtonStyles, renderMyButton };

// ✅ Spread the full state to the root element
<button {...state.root}>
```

### ❌ Don't

```tsx
// ❌ Don't skip the styles hook unless you're replacing it entirely
const state = useButton_unstable(props, ref);
// Missing styles!
return renderButton_unstable(state);

// ❌ Don't mutate state properties directly
state.disabled = true; // Bad — props should be set before the state hook

// ❌ Don't forget to forward the ref
export const MyButton = (props) => { ... }; // No ref forwarding!

// ❌ Don't hardcode className strings (use makeStyles + mergeClasses)
state.root.className = 'my-custom-button'; // Overwrites all existing classes
```

---

## Related Documentation

- [Slot Customization](01-slot-customization.md) — Simpler customization patterns
- [Custom Components](03-custom-components.md) — Building from scratch with FluentUI patterns
- [Component Architecture](../../01-foundation/05-component-architecture.md) — Deep dive into the hooks model
- [Styling with Griffel](../../01-foundation/04-styling-griffel.md) — CSS-in-JS for custom styles
