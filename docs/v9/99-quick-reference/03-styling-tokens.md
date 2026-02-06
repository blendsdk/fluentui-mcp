# Quick Reference: Styling & Tokens

> **Parent**: [Quick Reference Index](00-quick-ref-index.md)

## makeStyles Basics

```typescript
import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    padding: tokens.spacingHorizontalL,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  active: {
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
});

const MyComponent: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const styles = useStyles();

  return (
    <div className={mergeClasses(styles.root, isActive && styles.active)}>
      Content
    </div>
  );
};
```

> **Key rule**: `makeStyles` must be called at **module scope** (outside components), not inside components.

---

## Token Categories

### Spacing Tokens

| Token | Value | Use |
|-------|-------|-----|
| `tokens.spacingHorizontalNone` | `0` | No spacing |
| `tokens.spacingHorizontalXXS` | `2px` | Tiny inline gap |
| `tokens.spacingHorizontalXS` | `4px` | Small inline gap |
| `tokens.spacingHorizontalSNudge` | `6px` | Nudge spacing |
| `tokens.spacingHorizontalS` | `8px` | Small spacing |
| `tokens.spacingHorizontalMNudge` | `10px` | Medium nudge |
| `tokens.spacingHorizontalM` | `12px` | Medium spacing |
| `tokens.spacingHorizontalL` | `16px` | **Default** spacing |
| `tokens.spacingHorizontalXL` | `20px` | Large spacing |
| `tokens.spacingHorizontalXXL` | `24px` | Extra large |
| `tokens.spacingHorizontalXXXL` | `32px` | Maximum |

> **Vertical tokens** mirror horizontal: `tokens.spacingVerticalS`, `tokens.spacingVerticalM`, etc.

### Color Tokens

```typescript
// Background colors
tokens.colorNeutralBackground1     // Primary background (white/dark)
tokens.colorNeutralBackground2     // Secondary background
tokens.colorNeutralBackground3     // Tertiary background
tokens.colorBrandBackground        // Brand-colored background
tokens.colorSubtleBackground       // Subtle/transparent background

// Foreground (text) colors
tokens.colorNeutralForeground1     // Primary text
tokens.colorNeutralForeground2     // Secondary text
tokens.colorNeutralForeground3     // Tertiary/placeholder text
tokens.colorNeutralForegroundOnBrand // Text on brand background
tokens.colorBrandForeground1       // Brand-colored text

// Status colors
tokens.colorPaletteRedForeground1    // Error/danger text
tokens.colorPaletteRedBackground1    // Error background
tokens.colorPaletteGreenForeground1  // Success text
tokens.colorPaletteGreenBackground1  // Success background
tokens.colorPaletteYellowForeground1 // Warning text
tokens.colorPaletteYellowBackground1 // Warning background

// Border colors
tokens.colorNeutralStroke1        // Default border
tokens.colorNeutralStroke2        // Secondary border
tokens.colorBrandStroke1          // Brand-colored border
tokens.colorTransparentStroke     // No visible border
```

### Typography Tokens

```typescript
// Font sizes
tokens.fontSizeBase100  // 10px
tokens.fontSizeBase200  // 12px — Caption
tokens.fontSizeBase300  // 14px — Body (default)
tokens.fontSizeBase400  // 16px — Body large
tokens.fontSizeBase500  // 20px — Subtitle
tokens.fontSizeBase600  // 24px — Title

// Font weights
tokens.fontWeightRegular   // 400
tokens.fontWeightMedium    // 500
tokens.fontWeightSemibold  // 600
tokens.fontWeightBold      // 700

// Line heights
tokens.lineHeightBase100  // 14px
tokens.lineHeightBase200  // 16px
tokens.lineHeightBase300  // 20px (default)
tokens.lineHeightBase400  // 22px

// Font family
tokens.fontFamilyBase       // 'Segoe UI', system fonts
tokens.fontFamilyMonospace  // 'Consolas', monospace
tokens.fontFamilyNumeric    // Numeric-optimized font
```

### Border Radius Tokens

```typescript
tokens.borderRadiusNone      // 0
tokens.borderRadiusSmall     // 2px
tokens.borderRadiusMedium    // 4px (default)
tokens.borderRadiusLarge     // 6px
tokens.borderRadiusXLarge    // 8px
tokens.borderRadiusCircular  // 10000px (full circle)
```

### Shadow Tokens

```typescript
tokens.shadow2   // Subtle elevation (cards)
tokens.shadow4   // Light elevation (popovers)
tokens.shadow8   // Medium elevation (dropdowns)
tokens.shadow16  // Strong elevation (dialogs)
tokens.shadow28  // Heavy elevation (floating panels)
tokens.shadow64  // Maximum elevation
```

---

## Common Style Patterns

### Flexbox Layout

```typescript
const useStyles = makeStyles({
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
```

### Responsive Design

```typescript
const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: tokens.spacingHorizontalL,
    padding: tokens.spacingHorizontalL,

    '@media (min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },
});
```

### Hover/Focus States

```typescript
const useStyles = makeStyles({
  interactive: {
    cursor: 'pointer',
    transition: 'background-color 0.15s',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    ':active': {
      backgroundColor: tokens.colorNeutralBackground1Pressed,
    },
    ':focus-visible': {
      outlineColor: tokens.colorBrandStroke1,
      outlineWidth: '2px',
      outlineStyle: 'solid',
    },
  },
});
```

### Truncated Text

```typescript
const useStyles = makeStyles({
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  lineClamp: {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
});
```

### Card Elevation

```typescript
const useStyles = makeStyles({
  card: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow4,
    padding: tokens.spacingHorizontalL,
    ':hover': {
      boxShadow: tokens.shadow8,
    },
  },
});
```

---

## Shorthands Helper

```typescript
import { shorthands } from '@fluentui/react-components';

const useStyles = makeStyles({
  example: {
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
    ...shorthands.margin(tokens.spacingVerticalS),
    ...shorthands.gap(tokens.spacingHorizontalM),
  },
});
```

---

## mergeClasses (Conditional Styles)

```typescript
import { makeStyles, mergeClasses } from '@fluentui/react-components';

const useStyles = makeStyles({
  base: { padding: tokens.spacingHorizontalM },
  primary: { backgroundColor: tokens.colorBrandBackground },
  disabled: { opacity: 0.5, pointerEvents: 'none' },
});

// Apply conditionally
const className = mergeClasses(
  styles.base,
  isPrimary && styles.primary,
  isDisabled && styles.disabled,
);
```

---

## See Also

- [Griffel Deep Dive](../01-foundation/04-styling-griffel.md)
- [Theming Guide](../01-foundation/03-theming.md)
- [Setup & Imports](01-setup-imports.md)
