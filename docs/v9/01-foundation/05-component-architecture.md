# Component Architecture

> **Category**: Foundation
> **Prerequisites**: [Getting Started](01-getting-started.md), [Styling with Griffel](04-styling-griffel.md)

## Overview

FluentUI v9 components follow a **hooks composition model** that separates concerns into distinct phases:

1. **State Hook** (`useComponent_unstable`) - Props to state transformation
2. **Styles Hook** (`useComponentStyles_unstable`) - Apply Griffel styles
3. **Render Function** (`renderComponent_unstable`) - JSX output

This architecture enables:
- **Recomposition** - Override any phase
- **Customization** - Extend without forking
- **Testing** - Test each phase independently
- **Performance** - Skip unnecessary phases

---

## The Composition Pattern

### Standard Component Structure

```typescript
// Button.tsx
'use client';

import * as React from 'react';
import { renderButton_unstable } from './renderButton';
import { useButton_unstable } from './useButton';
import { useButtonStyles_unstable } from './useButtonStyles.styles';
import type { ButtonProps } from './Button.types';
import type { ForwardRefComponent } from '@fluentui/react-utilities';

export const Button: ForwardRefComponent<ButtonProps> = React.forwardRef(
  (props, ref) => {
    // 1. Transform props to state
    const state = useButton_unstable(props, ref);

    // 2. Apply styles to state
    useButtonStyles_unstable(state);

    // 3. Render the component
    return renderButton_unstable(state);
  }
);

Button.displayName = 'Button';
```

---

## Phase 1: State Hook (`useComponent_unstable`)

### Purpose

- Merge user props with defaults
- Set up event handlers
- Configure slots
- Compute derived state

### Pattern

```typescript
export const useButton_unstable = (
  props: ButtonProps,
  ref: React.Ref<HTMLButtonElement>
): ButtonState => {
  const {
    appearance = 'secondary',
    disabled = false,
    size = 'medium',
    icon,
    ...rest
  } = props;

  // Configure root slot
  const root = slot.always(
    {
      ...rest,
      ref,
      disabled,
    },
    { elementType: 'button' }
  );

  // Configure icon slot (optional)
  const iconSlot = slot.optional(icon, { elementType: 'span' });

  return {
    appearance,
    disabled,
    size,
    components: {
      root: 'button',
      icon: 'span',
    },
    root,
    icon: iconSlot,
  };
};
```

### State Object Structure

The state object contains:

```typescript
interface ButtonState extends ComponentState<ButtonSlots> {
  // Resolved props
  appearance: 'secondary' | 'primary' | 'outline' | 'subtle' | 'transparent';
  disabled: boolean;
  size: 'small' | 'medium' | 'large';
  
  // Slot configurations
  components: SlotComponentType<ButtonSlots>;
  root: Slot<'button'>;
  icon?: Slot<'span'>;
}
```

---

## Phase 2: Styles Hook (`useComponentStyles_unstable`)

### Purpose

- Apply CSS classes based on state
- Handle variant styling
- Manage conditional styles

### Pattern

```typescript
export const useButtonStyles_unstable = (state: ButtonState): ButtonState => {
  'use no memo';
  
  const styles = useStyles();

  state.root.className = mergeClasses(
    buttonClassNames.root,
    styles.root,
    
    // Appearance variants
    state.appearance === 'primary' && styles.primary,
    state.appearance === 'outline' && styles.outline,
    
    // Size variants
    state.size === 'small' && styles.small,
    state.size === 'large' && styles.large,
    
    // State-based styles
    state.disabled && styles.disabled,
    
    // User override (always last)
    state.root.className
  );

  if (state.icon) {
    state.icon.className = mergeClasses(
      buttonClassNames.icon,
      styles.icon,
      state.icon.className
    );
  }

  return state;
};
```

### Class Names Export

```typescript
// buttonClassNames.ts
export const buttonClassNames: SlotClassNames<ButtonSlots> = {
  root: 'fui-Button',
  icon: 'fui-Button__icon',
};
```

---

## Phase 3: Render Function (`renderComponent_unstable`)

### Purpose

- Generate JSX from state
- Render slots
- Handle children

### Pattern

```typescript
export const renderButton_unstable = (state: ButtonState) => {
  assertSlots<ButtonSlots>(state);

  return (
    <state.root>
      {state.icon && <state.icon />}
      {state.root.children}
    </state.root>
  );
};
```

### Using assertSlots

The `assertSlots` helper ensures TypeScript knows which slots are available:

```typescript
import { assertSlots } from '@fluentui/react-utilities';

export const renderDialog_unstable = (state: DialogState) => {
  assertSlots<DialogSlots>(state);

  return (
    <state.root>
      {state.backdrop && <state.backdrop />}
      <state.content>
        {state.content.children}
      </state.content>
    </state.root>
  );
};
```

---

## Slots Architecture

### What Are Slots?

Slots are customizable sub-elements within a component. They allow users to:

- Override the element type
- Add custom props
- Replace content entirely

### Slot Definition

```typescript
// Button.types.ts
import type { Slot, ComponentProps, ComponentState } from '@fluentui/react-utilities';

export type ButtonSlots = {
  root: Slot<'button', 'a'>;  // Can be button or anchor
  icon?: Slot<'span'>;         // Optional icon slot
};

export type ButtonProps = ComponentProps<ButtonSlots> & {
  appearance?: 'secondary' | 'primary' | 'outline' | 'subtle' | 'transparent';
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
};

export type ButtonState = ComponentState<ButtonSlots> & 
  Required<Pick<ButtonProps, 'appearance' | 'disabled' | 'size'>>;
```

### Using the `slot` Helper

```typescript
import { slot } from '@fluentui/react-utilities';

// Always present slot
const root = slot.always(props, { elementType: 'button' });

// Optional slot
const icon = slot.optional(props.icon, { elementType: 'span' });

// Shorthand resolution
const icon = slot.optional(props.icon, {
  elementType: 'span',
  defaultProps: { 'aria-hidden': true },
});
```

### Customizing Slots

Users can customize slots via props:

```typescript
// Override icon element type
<Button icon={{ as: 'i', className: 'custom-icon' }} />

// Render custom icon content
<Button icon={<CalendarIcon />} />

// Add props to root
<Button root={{ 'data-testid': 'my-button' }} />
```

---

## ForwardRef Pattern

### Why forwardRef?

Components use `forwardRef` to:
- Allow parent access to DOM elements
- Enable imperative handles
- Support ref forwarding to slots

### Pattern

```typescript
import * as React from 'react';
import type { ForwardRefComponent } from '@fluentui/react-utilities';

export const Button: ForwardRefComponent<ButtonProps> = React.forwardRef(
  (props, ref) => {
    const state = useButton_unstable(props, ref);
    useButtonStyles_unstable(state);
    return renderButton_unstable(state);
  }
);
```

### Using Refs

```typescript
import * as React from 'react';
import { Button } from '@fluentui/react-components';

const MyComponent = () => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    buttonRef.current?.focus();
  };

  return (
    <>
      <Button ref={buttonRef}>Click me</Button>
      <Button onClick={handleClick}>Focus above button</Button>
    </>
  );
};
```

---

## Props Patterns

### Controlled vs Uncontrolled

FluentUI v9 supports both patterns:

```typescript
// Uncontrolled (component manages state)
<Input defaultValue="initial value" />

// Controlled (parent manages state)
const [value, setValue] = React.useState('');
<Input value={value} onChange={(e, data) => setValue(data.value)} />
```

### Event Handler Signature

All event handlers follow this pattern:

```typescript
onChange?: (
  event: React.ChangeEvent<HTMLInputElement>,
  data: { value: string }
) => void;
```

**Key points:**
- First parameter is the native event
- Second parameter (`data`) contains component-specific info
- `data` always includes the relevant state change

### Common Props

| Prop | Type | Description |
|------|------|-------------|
| `appearance` | varies | Visual style variant |
| `size` | `'small' \| 'medium' \| 'large'` | Component size |
| `disabled` | `boolean` | Disabled state |
| `className` | `string` | Custom CSS class |
| `as` | element type | Polymorphic element |

---

## Component Recomposition

### Why Recompose?

- Create variants with different defaults
- Add custom behavior
- Build compound components

### Example: Custom Button

```typescript
import * as React from 'react';
import {
  useButton_unstable,
  useButtonStyles_unstable,
  renderButton_unstable,
} from '@fluentui/react-components';
import type { ButtonProps } from '@fluentui/react-components';

// Custom button with different defaults
export const PrimaryButton: React.FC<Omit<ButtonProps, 'appearance'>> = (props) => {
  const state = useButton_unstable(
    { ...props, appearance: 'primary' },
    React.useRef(null)
  );
  useButtonStyles_unstable(state);
  return renderButton_unstable(state);
};
```

### Example: Extended Styles

```typescript
import * as React from 'react';
import {
  Button,
  useButtonStyles_unstable,
  makeStyles,
  mergeClasses,
} from '@fluentui/react-components';

const useCustomStyles = makeStyles({
  glow: {
    boxShadow: '0 0 10px rgba(0, 120, 212, 0.5)',
  },
});

export const GlowButton: React.FC<ButtonProps> = (props) => {
  const customStyles = useCustomStyles();
  
  return (
    <Button
      {...props}
      className={mergeClasses(customStyles.glow, props.className)}
    />
  );
};
```

---

## Context Patterns

### Component Context

Some components provide context for child components:

```typescript
// Parent provides context
<Menu>
  <MenuTrigger>
    <Button>Open</Button>
  </MenuTrigger>
  <MenuPopover>
    <MenuList>
      <MenuItem>Item 1</MenuItem>
    </MenuList>
  </MenuPopover>
</Menu>
```

### Using Context in Custom Components

```typescript
import { useMenuContext_unstable } from '@fluentui/react-components';

const CustomMenuItem = () => {
  const { open, setOpen } = useMenuContext_unstable();
  
  return (
    <button onClick={() => setOpen(false)}>
      Close Menu
    </button>
  );
};
```

---

## TypeScript Types

### Essential Types

```typescript
import type {
  ComponentProps,
  ComponentState,
  ForwardRefComponent,
  Slot,
  SlotClassNames,
} from '@fluentui/react-utilities';
```

### Creating Custom Component Types

```typescript
import type { Slot, ComponentProps, ComponentState } from '@fluentui/react-utilities';

// Define slots
export type MyComponentSlots = {
  root: Slot<'div'>;
  header?: Slot<'div'>;
  content: Slot<'div'>;
};

// Define props
export type MyComponentProps = ComponentProps<MyComponentSlots> & {
  variant?: 'default' | 'compact';
};

// Define state
export type MyComponentState = ComponentState<MyComponentSlots> &
  Required<Pick<MyComponentProps, 'variant'>>;
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Use slot helper for slot configuration
const icon = slot.optional(props.icon, { elementType: 'span' });

// ✅ Spread user className last in mergeClasses
className={mergeClasses(styles.root, state.root.className)}

// ✅ Use ForwardRefComponent type
export const Button: ForwardRefComponent<ButtonProps> = React.forwardRef(...)

// ✅ Export hooks for recomposition
export { useButton_unstable, useButtonStyles_unstable, renderButton_unstable };
```

### ❌ Don'ts

```typescript
// ❌ Don't mutate state directly
state.disabled = true; // BAD

// ❌ Don't skip the styles hook
const state = useButton_unstable(props, ref);
// Missing: useButtonStyles_unstable(state);
return renderButton_unstable(state);

// ❌ Don't hardcode class names
className="my-button" // BAD - use mergeClasses
```

---

## See Also

- [Getting Started](01-getting-started.md) - Initial setup
- [Styling with Griffel](04-styling-griffel.md) - CSS-in-JS styling
- [Accessibility](06-accessibility.md) - A11y patterns
- [Overview](../00-overview.md) - Training program overview