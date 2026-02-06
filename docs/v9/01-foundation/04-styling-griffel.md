# Styling with Griffel

> **Package**: `@griffel/react`
> **Import**: `import { makeStyles, mergeClasses, shorthands } from '@fluentui/react-components'`
> **Category**: Foundation

## Overview

FluentUI v9 uses **Griffel**, a CSS-in-JS library with build-time CSS extraction. Key features:

- **Build-time optimization** - CSS is extracted at build time for performance
- **Atomic CSS** - Generates atomic class names for deduplication
- **Type-safe** - Full TypeScript support
- **Token integration** - Seamless use of design tokens
- **Zero runtime overhead** - No runtime CSS generation in production

---

## Core APIs

### makeStyles

Creates style definitions that return class names:

```typescript
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground1,
    padding: tokens.spacingHorizontalM,
  },
  title: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  description: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
  },
});
```

### Using Styles in Components

```typescript
import * as React from 'react';
import { makeStyles, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingHorizontalL,
    backgroundColor: tokens.colorNeutralBackground1,
  },
});

export const MyComponent: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Text>Hello World</Text>
    </div>
  );
};
```

---

## mergeClasses

**REQUIRED** for combining multiple class names:

```typescript
import * as React from 'react';
import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  base: {
    padding: tokens.spacingHorizontalM,
    borderRadius: tokens.borderRadiusMedium,
  },
  primary: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  large: {
    padding: tokens.spacingHorizontalL,
    fontSize: tokens.fontSizeBase400,
  },
});

interface BoxProps {
  isPrimary?: boolean;
  isLarge?: boolean;
  className?: string;
}

export const Box: React.FC<BoxProps> = ({ isPrimary, isLarge, className }) => {
  const styles = useStyles();

  return (
    <div
      className={mergeClasses(
        styles.base,
        isPrimary && styles.primary,
        isLarge && styles.large,
        className // Allow external className override
      )}
    />
  );
};
```

**⚠️ IMPORTANT**: Always use `mergeClasses()` to combine class names. Do NOT concatenate strings:

```typescript
// ❌ WRONG - Will not work correctly
className={`${styles.base} ${styles.primary}`}

// ✅ CORRECT
className={mergeClasses(styles.base, styles.primary)}
```

---

## Conditional Styles

### Boolean Conditions

```typescript
const useStyles = makeStyles({
  button: {
    padding: tokens.spacingHorizontalM,
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  selected: {
    backgroundColor: tokens.colorBrandBackground,
  },
});

const Button: React.FC<{ disabled?: boolean; selected?: boolean }> = ({
  disabled,
  selected,
}) => {
  const styles = useStyles();

  return (
    <button
      className={mergeClasses(
        styles.button,
        disabled && styles.disabled,
        selected && styles.selected
      )}
    />
  );
};
```

### Multiple Variants

```typescript
const useStyles = makeStyles({
  base: {
    padding: tokens.spacingHorizontalM,
  },
  // Size variants
  small: { fontSize: tokens.fontSizeBase200 },
  medium: { fontSize: tokens.fontSizeBase300 },
  large: { fontSize: tokens.fontSizeBase400 },
  // Appearance variants
  primary: { backgroundColor: tokens.colorBrandBackground },
  secondary: { backgroundColor: tokens.colorNeutralBackground3 },
  outline: { border: `1px solid ${tokens.colorNeutralStroke1}` },
});

type Size = 'small' | 'medium' | 'large';
type Appearance = 'primary' | 'secondary' | 'outline';

interface Props {
  size?: Size;
  appearance?: Appearance;
}

const Component: React.FC<Props> = ({ size = 'medium', appearance = 'secondary' }) => {
  const styles = useStyles();

  return (
    <div className={mergeClasses(styles.base, styles[size], styles[appearance])} />
  );
};
```

---

## Pseudo-selectors

### Hover, Focus, Active

```typescript
const useStyles = makeStyles({
  button: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    transition: `background-color ${tokens.durationFast}`,

    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    ':active': {
      backgroundColor: tokens.colorNeutralBackground1Pressed,
    },
    ':focus': {
      outline: `2px solid ${tokens.colorStrokeFocus2}`,
      outlineOffset: '2px',
    },
    ':focus-visible': {
      outline: `2px solid ${tokens.colorStrokeFocus2}`,
    },
  },
});
```

### Disabled State

```typescript
const useStyles = makeStyles({
  input: {
    backgroundColor: tokens.colorNeutralBackground1,

    ':disabled': {
      backgroundColor: tokens.colorNeutralBackgroundDisabled,
      color: tokens.colorNeutralForegroundDisabled,
      cursor: 'not-allowed',
    },
  },
});
```

### First/Last Child

```typescript
const useStyles = makeStyles({
  listItem: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,

    ':last-child': {
      borderBottom: 'none',
    },
    ':first-child': {
      borderTopLeftRadius: tokens.borderRadiusMedium,
      borderTopRightRadius: tokens.borderRadiusMedium,
    },
  },
});
```

---

## Media Queries

### Responsive Breakpoints

```typescript
const useStyles = makeStyles({
  container: {
    padding: tokens.spacingHorizontalS,
    flexDirection: 'column',

    // Tablet
    '@media (min-width: 640px)': {
      padding: tokens.spacingHorizontalM,
      flexDirection: 'row',
    },

    // Desktop
    '@media (min-width: 1024px)': {
      padding: tokens.spacingHorizontalL,
      maxWidth: '1200px',
    },

    // Large Desktop
    '@media (min-width: 1280px)': {
      padding: tokens.spacingHorizontalXL,
    },
  },
});
```

### Prefers Reduced Motion

```typescript
const useStyles = makeStyles({
  animated: {
    transition: `transform ${tokens.durationNormal} ${tokens.curveEasyEase}`,

    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});
```

### Dark Mode via Media Query

```typescript
const useStyles = makeStyles({
  container: {
    backgroundColor: tokens.colorNeutralBackground1,

    // Note: Usually handled by FluentProvider theme switching
    // Only use this for specific overrides
    '@media (prefers-color-scheme: dark)': {
      // Custom dark mode overrides if needed
    },
  },
});
```

---

## Nested Selectors

### Child Selectors

```typescript
const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,

    // Direct children
    '> div': {
      flex: 1,
    },

    // All descendants
    '& span': {
      color: tokens.colorNeutralForeground2,
    },
  },
});
```

### Attribute Selectors

```typescript
const useStyles = makeStyles({
  input: {
    padding: tokens.spacingHorizontalM,

    '&[type="password"]': {
      fontFamily: tokens.fontFamilyMonospace,
    },

    '&[aria-invalid="true"]': {
      borderColor: tokens.colorStatusDangerBorder1,
    },
  },
});
```

---

## shorthands

Helper functions for common CSS shorthand properties:

```typescript
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    // Border shorthand
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),

    // Border radius
    ...shorthands.borderRadius(tokens.borderRadiusMedium),

    // Padding (all sides)
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),

    // Margin
    ...shorthands.margin(tokens.spacingVerticalS),

    // Gap (flex/grid)
    ...shorthands.gap(tokens.spacingHorizontalM),

    // Overflow
    ...shorthands.overflow('hidden'),

    // Outline
    ...shorthands.outline('2px', 'solid', tokens.colorStrokeFocus2),
  },
});
```

### Available Shorthands

| Shorthand | CSS Properties |
|-----------|----------------|
| `border` | borderWidth, borderStyle, borderColor |
| `borderBottom` | borderBottomWidth, borderBottomStyle, borderBottomColor |
| `borderTop` | borderTopWidth, borderTopStyle, borderTopColor |
| `borderLeft` | borderLeftWidth, borderLeftStyle, borderLeftColor |
| `borderRight` | borderRightWidth, borderRightStyle, borderRightColor |
| `borderRadius` | borderTopLeftRadius, etc. |
| `borderColor` | All border colors |
| `borderWidth` | All border widths |
| `borderStyle` | All border styles |
| `padding` | All padding sides |
| `margin` | All margin sides |
| `gap` | rowGap, columnGap |
| `overflow` | overflowX, overflowY |
| `outline` | outlineWidth, outlineStyle, outlineColor |
| `inset` | top, right, bottom, left |
| `flex` | flexGrow, flexShrink, flexBasis |

---

## makeResetStyles

For base styles that should reset to specific values:

```typescript
import { makeResetStyles, tokens } from '@fluentui/react-components';

const useBaseStyles = makeResetStyles({
  // All properties are set, not merged
  display: 'flex',
  alignItems: 'center',
  padding: 0,
  margin: 0,
  border: 'none',
  background: 'transparent',
  font: 'inherit',
  cursor: 'pointer',
});

// Use in component
const Button: React.FC = () => {
  const baseStyles = useBaseStyles();
  
  return <button className={baseStyles}>Click</button>;
};
```

**When to use `makeResetStyles`:**

- Creating base component styles that need to override browser defaults
- Resetting styles before applying custom styling
- Single class output (not composable like `makeStyles`)

---

## makeStaticStyles

For global CSS that doesn't use tokens:

```typescript
import { makeStaticStyles } from '@fluentui/react-components';

const useStaticStyles = makeStaticStyles({
  // Global styles
  body: {
    margin: 0,
    padding: 0,
  },
  
  // CSS Reset
  '*': {
    boxSizing: 'border-box',
  },
  
  // Font imports
  '@font-face': {
    fontFamily: 'Segoe UI',
    src: "url('/fonts/segoe-ui.woff2') format('woff2')",
  },
});

// Call in App component
const App: React.FC = () => {
  useStaticStyles();
  return <div>...</div>;
};
```

---

## CSS Variables in Styles

### Using Custom CSS Variables

```typescript
const useStyles = makeStyles({
  container: {
    // Define CSS variable
    '--custom-spacing': tokens.spacingHorizontalM,
    
    // Use CSS variable
    padding: 'var(--custom-spacing)',
  },
  
  child: {
    // Inherit from parent
    marginTop: 'var(--custom-spacing)',
  },
});
```

---

## Animation

### Keyframe Animations

```typescript
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  spinner: {
    animationName: {
      from: {
        transform: 'rotate(0deg)',
      },
      to: {
        transform: 'rotate(360deg)',
      },
    },
    animationDuration: tokens.durationSlower,
    animationIterationCount: 'infinite',
    animationTimingFunction: tokens.curveLinear,
  },
  
  fadeIn: {
    animationName: {
      from: {
        opacity: 0,
        transform: 'translateY(-10px)',
      },
      to: {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
    animationDuration: tokens.durationNormal,
    animationTimingFunction: tokens.curveDecelerateMid,
    animationFillMode: 'forwards',
  },
});
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Define styles outside components
const useStyles = makeStyles({
  root: { ... },
});

// ✅ Use tokens for all values
padding: tokens.spacingHorizontalM,
color: tokens.colorNeutralForeground1,

// ✅ Always use mergeClasses
className={mergeClasses(styles.base, styles.variant)}

// ✅ Support className prop for customization
interface Props { className?: string }
className={mergeClasses(styles.root, className)}
```

### ❌ Don'ts

```typescript
// ❌ Don't define styles inside components
const MyComponent = () => {
  const useStyles = makeStyles({...}); // BAD - recreated each render
};

// ❌ Don't hardcode values
padding: '16px', // BAD
color: '#333',   // BAD

// ❌ Don't concatenate class strings
className={`${styles.a} ${styles.b}`} // BAD

// ❌ Don't use inline styles
style={{ padding: '16px' }} // BAD
```

---

## TypeScript Types

```typescript
import type { GriffelStyle } from '@fluentui/react-components';

// Type for style objects
const cardStyles: GriffelStyle = {
  padding: tokens.spacingHorizontalM,
  backgroundColor: tokens.colorNeutralBackground1,
};

// Type for style function parameters
const createButtonStyles = (size: 'small' | 'large'): GriffelStyle => ({
  padding: size === 'small' 
    ? tokens.spacingHorizontalS 
    : tokens.spacingHorizontalL,
});
```

---

## Performance Tips

1. **Define styles at module level** - Outside component functions
2. **Use atomic classes** - Let Griffel deduplicate automatically
3. **Avoid dynamic style generation** - Use conditional classes instead
4. **Use makeResetStyles sparingly** - Only for true resets

---

## See Also

- [Theming](03-theming.md) - Design tokens
- [Component Architecture](05-component-architecture.md) - Styling in components
- [Getting Started](01-getting-started.md) - Initial setup
- [Overview](../00-overview.md) - Training program overview