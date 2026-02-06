# Theming in FluentUI v9

> **Package**: `@fluentui/react-theme`
> **Import**: `import { tokens, webLightTheme, createLightTheme } from '@fluentui/react-components'`
> **Category**: Foundation

## Overview

FluentUI v9 uses **design tokens** - a set of standardized values for colors, typography, spacing, and other design properties. Tokens are implemented as CSS custom properties, enabling:

- **Consistent design** across all components
- **Theme switching** without component re-renders
- **Custom branding** while maintaining design integrity
- **Automatic dark mode** support

---

## Design Tokens Overview

### What Are Tokens?

Tokens are CSS custom properties that map to design values:

```typescript
import { tokens } from '@fluentui/react-components';

// tokens.colorBrandBackground → 'var(--colorBrandBackground)'
// The actual value is set by the theme
```

### Using Tokens in Styles

```typescript
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    padding: tokens.spacingHorizontalM,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow4,
  },
});
```

---

## Built-in Themes

```typescript
import {
  // Web themes
  webLightTheme,
  webDarkTheme,
  
  // Teams themes
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  
  // Theme creators
  createLightTheme,
  createDarkTheme,
  createHighContrastTheme,
} from '@fluentui/react-components';
```

| Theme | Use Case |
|-------|----------|
| `webLightTheme` | Default light theme for web applications |
| `webDarkTheme` | Dark mode for web applications |
| `teamsLightTheme` | Microsoft Teams light theme |
| `teamsDarkTheme` | Microsoft Teams dark theme |
| `teamsHighContrastTheme` | High contrast for accessibility |

---

## Token Categories

### Color Tokens

#### Brand Colors

Primary brand colors for interactive elements:

```typescript
tokens.colorBrandBackground       // Primary button background
tokens.colorBrandBackgroundHover  // Primary button hover
tokens.colorBrandBackgroundPressed // Primary button pressed
tokens.colorBrandForeground1      // Brand-colored text
tokens.colorBrandForeground2      // Secondary brand text
```

#### Neutral Colors

Backgrounds and text for general UI:

```typescript
// Backgrounds (1 = lightest/primary, higher = darker)
tokens.colorNeutralBackground1    // Main content background
tokens.colorNeutralBackground2    // Secondary background
tokens.colorNeutralBackground3    // Tertiary background
tokens.colorNeutralBackground4    // Emphasis background
tokens.colorNeutralBackground5    // Strong emphasis
tokens.colorNeutralBackground6    // Strongest emphasis

// Foregrounds (text colors)
tokens.colorNeutralForeground1    // Primary text
tokens.colorNeutralForeground2    // Secondary text
tokens.colorNeutralForeground3    // Tertiary text
tokens.colorNeutralForeground4    // Disabled text appearance
tokens.colorNeutralForegroundDisabled // Actually disabled
```

#### Status Colors

Semantic colors for states:

```typescript
// Success
tokens.colorStatusSuccessBackground1  // Success subtle background
tokens.colorStatusSuccessBackground3  // Success strong background
tokens.colorStatusSuccessForeground1  // Success text

// Warning
tokens.colorStatusWarningBackground1  // Warning subtle background
tokens.colorStatusWarningBackground3  // Warning strong background
tokens.colorStatusWarningForeground1  // Warning text

// Danger/Error
tokens.colorStatusDangerBackground1   // Error subtle background
tokens.colorStatusDangerBackground3   // Error strong background
tokens.colorStatusDangerForeground1   // Error text
```

#### Stroke (Border) Colors

```typescript
tokens.colorNeutralStroke1         // Primary borders
tokens.colorNeutralStroke2         // Secondary borders
tokens.colorNeutralStroke3         // Subtle borders
tokens.colorNeutralStrokeAccessible // Accessible contrast borders
tokens.colorBrandStroke1           // Brand-colored borders
tokens.colorCompoundBrandStroke    // Interactive brand borders
```

### Spacing Tokens

#### Horizontal Spacing

```typescript
tokens.spacingHorizontalNone   // 0
tokens.spacingHorizontalXXS    // 2px
tokens.spacingHorizontalXS     // 4px
tokens.spacingHorizontalSNudge // 6px
tokens.spacingHorizontalS      // 8px
tokens.spacingHorizontalMNudge // 10px
tokens.spacingHorizontalM      // 12px
tokens.spacingHorizontalL      // 16px
tokens.spacingHorizontalXL     // 20px
tokens.spacingHorizontalXXL    // 24px
tokens.spacingHorizontalXXXL   // 32px
```

#### Vertical Spacing

```typescript
tokens.spacingVerticalNone     // 0
tokens.spacingVerticalXXS      // 2px
tokens.spacingVerticalXS       // 4px
tokens.spacingVerticalSNudge   // 6px
tokens.spacingVerticalS        // 8px
tokens.spacingVerticalMNudge   // 10px
tokens.spacingVerticalM        // 12px
tokens.spacingVerticalL        // 16px
tokens.spacingVerticalXL       // 20px
tokens.spacingVerticalXXL      // 24px
tokens.spacingVerticalXXXL     // 32px
```

### Typography Tokens

#### Font Sizes

```typescript
tokens.fontSizeBase100  // 10px - Caption2
tokens.fontSizeBase200  // 12px - Caption1
tokens.fontSizeBase300  // 14px - Body1 (default)
tokens.fontSizeBase400  // 16px - Body2/Subtitle2
tokens.fontSizeBase500  // 20px - Subtitle1
tokens.fontSizeBase600  // 24px - Title3
tokens.fontSizeHero700  // 28px - Title2
tokens.fontSizeHero800  // 32px - Title1
tokens.fontSizeHero900  // 40px - LargeTitle
tokens.fontSizeHero1000 // 68px - Display
```

#### Font Weights

```typescript
tokens.fontWeightRegular   // 400
tokens.fontWeightMedium    // 500
tokens.fontWeightSemibold  // 600
tokens.fontWeightBold      // 700
```

#### Line Heights

```typescript
tokens.lineHeightBase100   // 14px
tokens.lineHeightBase200   // 16px
tokens.lineHeightBase300   // 20px
tokens.lineHeightBase400   // 22px
tokens.lineHeightBase500   // 28px
tokens.lineHeightBase600   // 32px
tokens.lineHeightHero700   // 36px
tokens.lineHeightHero800   // 40px
tokens.lineHeightHero900   // 52px
tokens.lineHeightHero1000  // 92px
```

#### Font Families

```typescript
tokens.fontFamilyBase      // 'Segoe UI', system fonts
tokens.fontFamilyMonospace // 'Consolas', monospace fonts
tokens.fontFamilyNumeric   // Font with tabular numerics
```

### Border Radius Tokens

```typescript
tokens.borderRadiusNone      // 0
tokens.borderRadiusSmall     // 2px
tokens.borderRadiusMedium    // 4px
tokens.borderRadiusLarge     // 6px
tokens.borderRadiusXLarge    // 8px
tokens.borderRadius2XLarge   // 12px
tokens.borderRadius3XLarge   // 16px
tokens.borderRadiusCircular  // 10000px (pill shape)
```

### Shadow Tokens

```typescript
tokens.shadow2   // Subtle elevation (cards)
tokens.shadow4   // Low elevation
tokens.shadow8   // Medium elevation
tokens.shadow16  // High elevation
tokens.shadow28  // Higher elevation
tokens.shadow64  // Highest elevation

// Brand shadows
tokens.shadow2Brand
tokens.shadow4Brand
tokens.shadow8Brand
tokens.shadow16Brand
tokens.shadow28Brand
tokens.shadow64Brand
```

### Animation Tokens

#### Duration

```typescript
tokens.durationUltraFast  // 50ms
tokens.durationFaster     // 100ms
tokens.durationFast       // 150ms
tokens.durationNormal     // 200ms
tokens.durationGentle     // 250ms
tokens.durationSlow       // 300ms
tokens.durationSlower     // 400ms
tokens.durationUltraSlow  // 500ms
```

#### Easing Curves

```typescript
tokens.curveAccelerateMax   // Fast start, slow end
tokens.curveAccelerateMid
tokens.curveAccelerateMin
tokens.curveDecelerateMax   // Slow start, fast end
tokens.curveDecelerateMid
tokens.curveDecelerateMin
tokens.curveEasyEaseMax     // Balanced
tokens.curveEasyEase
tokens.curveLinear          // Constant speed
```

### Stroke Width Tokens

```typescript
tokens.strokeWidthThin     // 1px
tokens.strokeWidthThick    // 2px
tokens.strokeWidthThicker  // 3px
tokens.strokeWidthThickest // 4px
```

### Z-Index Tokens

```typescript
tokens.zIndexBackground  // 0 - Background surfaces
tokens.zIndexContent     // 1 - Content like cards
tokens.zIndexOverlay     // 1000 - Backdrops
tokens.zIndexPopup       // 2000 - Modals, drawers
tokens.zIndexMessages    // 3000 - Toasts, snackbars
tokens.zIndexFloating    // 4000 - Dropdowns
tokens.zIndexPriority    // 5000 - Tooltips
tokens.zIndexDebug       // 6000 - Debug overlays
```

---

## Typography Styles

Pre-composed typography styles:

```typescript
import { typographyStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  title: typographyStyles.title1,     // 28px semibold
  subtitle: typographyStyles.subtitle1, // 20px semibold
  body: typographyStyles.body1,       // 14px regular
  caption: typographyStyles.caption1, // 12px regular
});
```

Available typography styles:

| Style | Size | Weight | Use Case |
|-------|------|--------|----------|
| `display` | 68px | Semibold | Hero text |
| `largeTitle` | 40px | Semibold | Large headings |
| `title1` | 28px | Semibold | Page titles |
| `title2` | 24px | Semibold | Section titles |
| `title3` | 20px | Semibold | Sub-sections |
| `subtitle1` | 20px | Semibold | Subtitles |
| `subtitle2` | 16px | Semibold | Small subtitles |
| `subtitle2Stronger` | 16px | Bold | Emphasized subtitles |
| `body1` | 14px | Regular | Body text (default) |
| `body1Strong` | 14px | Semibold | Emphasized body |
| `body1Stronger` | 14px | Bold | Strong emphasis |
| `body2` | 12px | Regular | Secondary text |
| `caption1` | 12px | Regular | Captions |
| `caption1Strong` | 12px | Semibold | Strong captions |
| `caption1Stronger` | 12px | Bold | Bold captions |
| `caption2` | 10px | Regular | Small captions |
| `caption2Strong` | 10px | Semibold | Strong small captions |

---

## Custom Themes

### Creating a Brand Theme

```typescript
import {
  createLightTheme,
  createDarkTheme,
  type BrandVariants,
} from '@fluentui/react-components';

// Define your brand color palette (10 shades)
const myBrand: BrandVariants = {
  10: '#020305',
  20: '#111723',
  30: '#16263D',
  40: '#193253',
  50: '#1B3F6A',
  60: '#1B4C82',
  70: '#18599B',
  80: '#1267B4',  // Primary brand color
  90: '#3174C2',
  100: '#4F82C8',
  110: '#6790CF',
  120: '#7D9ED5',
  130: '#92ACDC',
  140: '#A6BBE2',
  150: '#BAC9E9',
  160: '#CDD8EF',
};

// Create light and dark themes
export const myLightTheme = createLightTheme(myBrand);
export const myDarkTheme = createDarkTheme(myBrand);
```

### Extending an Existing Theme

```typescript
import { webLightTheme, type Theme } from '@fluentui/react-components';

// Override specific tokens
export const customTheme: Theme = {
  ...webLightTheme,
  colorBrandBackground: '#0078D4',
  colorBrandBackgroundHover: '#106EBE',
  colorBrandBackgroundPressed: '#005A9E',
  borderRadiusMedium: '8px',
};
```

### Partial Theme Override

```typescript
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

// Only override specific tokens
const partialTheme = {
  colorBrandBackground: '#8B5CF6',
  colorBrandBackgroundHover: '#7C3AED',
};

export const App = () => (
  <FluentProvider theme={{ ...webLightTheme, ...partialTheme }}>
    <App />
  </FluentProvider>
);
```

---

## Theme Usage Examples

### Complete Styled Component

```typescript
import * as React from 'react';
import { makeStyles, tokens, Text, Button } from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow4,
    padding: tokens.spacingHorizontalL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  title: {
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
  description: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
  },
  footer: {
    borderTop: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    paddingTop: tokens.spacingVerticalM,
    marginTop: tokens.spacingVerticalS,
  },
});

export const ThemedCard: React.FC<{
  title: string;
  description: string;
}> = ({ title, description }) => {
  const styles = useStyles();

  return (
    <div className={styles.card}>
      <Text className={styles.title}>{title}</Text>
      <Text className={styles.description}>{description}</Text>
      <div className={styles.footer}>
        <Button appearance="primary">Learn More</Button>
      </div>
    </div>
  );
};
```

### Responsive Design with Tokens

```typescript
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingHorizontalM,
    
    '@media (min-width: 640px)': {
      padding: tokens.spacingHorizontalL,
    },
    
    '@media (min-width: 1024px)': {
      padding: tokens.spacingHorizontalXL,
    },
  },
});
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Use tokens for all design values
backgroundColor: tokens.colorNeutralBackground1,
padding: tokens.spacingHorizontalM,
borderRadius: tokens.borderRadiusMedium,

// ✅ Use semantic tokens
color: tokens.colorNeutralForeground1,      // Text
color: tokens.colorStatusDangerForeground1, // Error text

// ✅ Use typography styles
...typographyStyles.body1,
```

### ❌ Don'ts

```typescript
// ❌ Don't hardcode colors
backgroundColor: '#ffffff',
color: '#333333',

// ❌ Don't hardcode spacing
padding: '16px',
margin: '8px',

// ❌ Don't mix token and hardcoded values
padding: `${tokens.spacingHorizontalM} 16px`, // Bad
```

---

## See Also

- [Getting Started](01-getting-started.md) - Initial setup
- [FluentProvider](02-fluent-provider.md) - Theme application
- [Styling with Griffel](04-styling-griffel.md) - Using tokens in styles
- [Overview](../00-overview.md) - Training program overview