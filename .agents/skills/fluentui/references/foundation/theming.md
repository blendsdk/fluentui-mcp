# Theming System

> **Category**: foundation

## Why theming works differently in v9

Fluent UI React v9 has **no monolithic stylesheet** to override. Instead, every visual value a component uses is a **design token**, and tokens are resolved to **CSS custom properties** that live on a single wrapper element. That means:

- Changing a theme is swapping one JavaScript object, not shipping a second CSS bundle.
- Theme changes cascade instantly to every Fluent component and to your own CSS, because CSS variables inherit.
- You can nest themes, scope a theme to a subtree, and re-theme at runtime with no component re-implementation.

```
Design tokens (tokens.colorNeutralBackground1)
        ↓
Theme object  ({ colorNeutralBackground1: '#ffffff', ... })
        ↓
CSS custom properties injected by <FluentProvider theme={...}>
        ↓
Component styles  ->  background-color: var(--colorNeutralBackground1)
```

## 1. Core imports

Everything below is exported from the single package `@fluentui/react-components`:

```ts
import {
  // The one component that applies a theme
  FluentProvider,
  Portal,

  // Token + styling authoring APIs
  tokens,
  makeStyles,
  mergeClasses,
  shorthands,

  // Theme objects and theme factories
  webLightTheme,
  webDarkTheme,
  teamsLightTheme,
  teamsDarkTheme,
  createLightTheme,
  createDarkTheme,
  createHighContrastTheme,
  themeToTokensObject,
} from '@fluentui/react-components';

import type { Theme, BrandVariants, PartialTheme } from '@fluentui/react-components';
```

## 2. Anatomy of a theme object

A `Theme` is a **flat object with camelCase keys**, one per token. Keys map 1:1 to CSS variable names (`colorNeutralBackground1` → `var(--colorNeutralBackground1)`).

| Token group | Representative tokens | Controls |
| --- | --- | --- |
| Color – neutral | `colorNeutralBackground1`…`6`, `colorNeutralForeground1`…`6`, `colorNeutralStroke1`…`3` | Surfaces, text, borders. The number is a depth/emphasis step (1 = closest to the canvas) |
| Color – brand | `colorBrandBackground`, `colorBrandBackgroundHover`, `colorBrandBackgroundPressed`, `colorBrandForeground1`, `colorBrandStroke1` | Primary actions and brand accents |
| Color – palette | `colorPaletteRedBackground3`, `colorPaletteRedForeground1`, `colorPaletteGreenBackground3`, … | Status/semantic colors used by Badge, MessageBar, ProgressBar |
| Color – compound | `colorCompoundBrandBackground`, `colorCompoundBrandForeground1`, `colorCompoundBrandStroke` | Controls that fill with brand color (Checkbox, Switch, Slider, Rating) |
| Color – utility | `colorStrokeFocus1`, `colorStrokeFocus2`, `colorSubtleBackground`, `colorSubtleBackgroundHover`, `colorTransparentBackground`, `colorNeutralForegroundOnBrand` | Focus rings, hover-only surfaces, text drawn on top of brand fills |
| Typography | `fontFamilyBase`, `fontFamilyMonospace`, `fontFamilyNumeric`, `fontSizeBase100`…`1000`, `fontWeightRegular/Medium/Semibold/Bold`, `lineHeightBase100`…`1000` | Type scale (100 ≈ 10px caption, 300 ≈ 14px body, 900 ≈ 68px display) |
| Spacing | `spacingHorizontalNone|XXS|XS|SNudge|S|M|L|XL|XXL|XXXL`, same for `spacingVertical*` | Padding, margins, gaps |
| Stroke | `strokeWidthThin`, `strokeWidthThick`, `strokeWidthThicker`, `strokeWidthThickest` | Border widths |
| Shape | `borderRadiusNone|Small|Medium|Large|XLarge|Circular` | Corner radii |
| Elevation | `shadow2`, `shadow4`, `shadow8`, `shadow16`, `shadow28`, `shadow64` (+ brand/floating variants) | `box-shadow` |
| Motion | `durationUltraFast|Faster|Fast|Normal|Slow|Slower|UltraSlow`, `curveAccelerateMax|…Mid|…Min`, `curveDecelerateMax|…Mid|…Min`, `curveEasyEase`, `curveLinear` | Transitions and animations |

### Naming conventions worth memorizing

- **State suffixes** are appended to the base token: `colorNeutralBackground1Hover`, `colorBrandBackgroundPressed`, `colorNeutralStroke1Selected`, `colorBrandForegroundLinkDisabled`.
- **`On` prefix** means “foreground drawn on that background”: `colorNeutralForegroundOnBrand`, `colorPaletteRedForeground1`.
- **Numeric ramps** (`1`…`6`, `100`…`1000`, brand stops `10`…`160`) encode depth, emphasis and type size — never use them to mean something else.

## 3. Built-in themes

| Theme | Look |
| --- | --- |
| `webLightTheme` | Default light theme (the provider's fallback) |
| `webDarkTheme` | Default dark theme |
| `teamsLightTheme` / `teamsDarkTheme` | Microsoft Teams densities and colors |

Built-in themes are frozen, module-level objects: import them, never mutate them. Treat them as read-only reference values.

## 4. Branding: `BrandVariants` + theme factories

A brand ramp is **16 stops**, keys `10` (darkest) → `160` (lightest). Stop `80` is the seed the generator treats as your primary brand color. From one ramp you can generate consistent light and dark themes:

```ts
const brandRamp: BrandVariants = { 10: '#020305', /* … */ 80: '#1267b4', /* … */ 160: '#cdd8ef' };
const light = createLightTheme(brandRamp);
const dark = createDarkTheme(brandRamp);
```

`createDarkTheme` flips the neutral ramp, so a single brand ramp yields coherent light **and** dark surfaces. `createHighContrastTheme()` produces a theme that pairs with Windows high-contrast / forced-colors modes.

Generated themes are complete, but the generator cannot know every nuance (for example, brand text on dark surfaces needs a lighter stop than brand fill). Patch individual tokens on the generated object after creation:

```ts
dark.colorBrandForeground1 = brandRamp[110];
dark.colorBrandForegroundLink = brandRamp[120];
```

## 5. Applying a theme: `FluentProvider`

`FluentProvider` is the **only** component that puts a theme into scope. It renders a wrapper element (the `root` slot) that carries the generated theme class containing all CSS custom properties.

| Prop | Type | What it does |
| --- | --- | --- |
| `theme` | `Partial<Theme>` | Theme for the subtree. Renders the CSS custom properties on the provider element |
| `dir` | `'ltr' \| 'rtl'` | Text/layout direction used by the subtree and its portals |
| `targetDocument` | `Document` | Document used for portals and injected styles — required for iframes, popouts, shadow DOM |
| `applyStylesToPortals` | `boolean` | Applies the theme's style element to portal hosts so Portaled content keeps the theme (defaults to `true`) |
| `customStyleHooks_unstable` | `Partial<{ useButtonStyles_unstable, useCardStyles_unstable, useDialogSurfaceStyles_unstable, … }>` | Theme-wide override of any component's style hook, keyed by hook name |
| `overrides_unstable` | `OverridesContextValue` | Escape hatch for opt-in unstable behavior overrides (for example the default appearance applied to `Input`-family components) |

Because `theme` is typed `Partial<Theme>` you can pass overrides. **At the root of the app, pass a complete theme** — the provider falls back to `webLightTheme` only when `theme` is `undefined`; it does not deep-merge your partial object, so any token you omit would resolve to nothing. The reliable pattern is to spread a base theme:

```ts
const myTheme: Theme = { ...webLightTheme, colorNeutralBackground1: '#fafafa' };
```

In a **nested** provider a partial object is fine, because unspecified variables simply inherit from the nearest ancestor scope:

```tsx
<FluentProvider theme={webDarkTheme}>
  <FluentProvider theme={{ colorNeutralBackground1: '#1b1a19' }}>
    {/* everything except background1 comes from the dark theme above */}
  </FluentProvider>
</FluentProvider>
```

## 6. Scoping, nesting and portals

- **Nesting is scoping.** A nested `FluentProvider` with a `theme` starts a new theme scope for its entire subtree — nothing leaks outwards or inwards.
- **Nesting without `theme`** simply inherits the ancestor's variables (no new style element is generated).
- **Portals keep the scope automatically** for Fluent's own overlays (Popover, Menu, Tooltip, Dialog, Drawer, Toast), because they read the provider context and re-apply the theme class where they render. `applyStylesToPortals` controls whether the theme class is also applied to portal hosts.
- **Explicit `Portal` usage** with `mountNode` renders into a node you choose. If that node is inside a themed element, plain CSS variables still apply; if it is outside, wrap the Portaled content in its own `FluentProvider` or point the provider's `targetDocument` at the right document.
- **iframes / popouts** need `targetDocument` so Fluent injects styles and theme variables into the correct document.

## 7. Consuming tokens in your own styles

Tokens are strings that evaluate to CSS variables, so you can use them anywhere a CSS value is accepted.

- **Griffel (recommended)** — `makeStyles` + `tokens`: styles are compiled at build time into atomic classes and stay reactive to theme swaps.
- **Plain CSS** — read the same variables directly: `var(--colorNeutralBackground1)`, `var(--borderRadiusMedium)`, `var(--spacingHorizontalM)`.
- **Inline styles** — `style={{ color: tokens.colorNeutralForeground1 }}` also works, but loses Griffel's atomic deduplication.

Use `mergeClasses` (never string concatenation or template literals) to combine class names, so conflicting atomic classes resolve predictably — later arguments win.

## 8. Per-component overrides

1. **Local** — pass a Griffel class through the component's `className`, composing with `mergeClasses`.
2. **Theme-wide, per component** — `customStyleHooks_unstable` on `FluentProvider`. Each entry is a style hook that receives the component's internal state and can append classes to any slot, e.g. `useButtonStyles_unstable`, `useCardStyles_unstable`, `useDialogSurfaceStyles_unstable`, `useMenuItemStyles_unstable`. Because they are hooks, they run during render and must be called unconditionally.
3. **Unstable behavior** — `overrides_unstable` for opt-in behavioral defaults that are not purely visual.

## 9. Runtime theme switching

- Compute the active theme with `React.useMemo` (or a module-level constant) so the object identity is stable; a new object identity on every render re-generates and re-applies the theme class.
- Follow the system with `window.matchMedia('(prefers-color-scheme: dark)')`, and re-evaluate on `change`.
- Handle `(forced-colors: active)` and switch to `createHighContrastTheme()` when it matches.
- Persist the user's explicit choice (for example in `localStorage`) and treat `'system'` as a third mode.
- Use the provider's `dir` prop, not CSS hacks, when the direction changes.

## 10. SSR, performance and bundle size

- Theme objects are plain data — safe to serialize and use on the server. Keep custom themes in their own module and import them everywhere they are needed.
- Griffel has a **zero-runtime cost**: `makeStyles` returns class names; only `mergeClasses` runs at render time. Theme switching only re-writes the `--*` variables.
- Prefer the provided `webLightTheme` / `webDarkTheme` with token overrides over generating many brand themes at runtime.
- When rendering on the server with `@griffel/react`'s SSR helpers, style elements are extracted once — but always render the same provider/theme pair on the client to avoid hydration mismatches.

## 11. Accessibility implications of theming

Custom themes are the fastest way to break accessibility. Always verify:

- **Contrast**: body text ≥ 4.5:1, large text and interactive boundaries ≥ 3:1 against the surface they sit on — in *every* theme you ship, including the nested scopes.
- **Never encode meaning in color alone**; pair status colors (`colorPalette*`) with text or icons.
- **Focus visibility**: `colorStrokeFocus1` / `colorStrokeFocus2` must stay clearly visible against both the surface and the focused control.
- **High contrast / forced colors**: provide a `createHighContrastTheme()` path and honor `forced-colors: active`; do not rely on `box-shadow` for the only visual boundary.
- **Respect `prefers-reduced-motion`** in addition to the theme's `duration*` / `curve*` tokens.
- **RTL**: set `dir` on `FluentProvider` so logical properties and overlays flip correctly.

## Key Takeaways

- A theme is a flat object of design-token values; FluentProvider turns it into CSS custom properties on a wrapper element, so changing the theme object re-themes everything in the subtree at once.
- `<FluentProvider theme={...}>` is the only way to put a theme in scope. Nesting providers creates independent scopes, and Fluent's portals (Popover, Menu, Tooltip, Dialog, Drawer, Toast) inherit the nearest scope automatically.
- At the root, always pass a COMPLETE theme by spreading a base theme (`{ ...webLightTheme, ...overrides }`) - the provider does not deep-merge partial themes; only nested providers can safely use partial overrides because the missing variables inherit.
- Generate branded light/dark pairs from a single 16-stop `BrandVariants` ramp with `createLightTheme` / `createDarkTheme`, then hand-tune tokens such as `colorBrandForeground1` that a generator cannot infer.
- Consume tokens (`tokens.colorNeutralBackground1`, `tokens.spacingHorizontalM`, `tokens.borderRadiusMedium`) instead of hard-coded hex/px values; they resolve to CSS variables like `var(--colorNeutralBackground1)` that work in Griffel styles, plain CSS and inline styles.
- Use `customStyleHooks_unstable` on FluentProvider (for example `useButtonStyles_unstable`) when a visual override must apply to every instance of a component rather than a single `className`.
- Keep themes as module-level constants or `useMemo` values so their identity is stable; treat built-in themes as frozen and never mutate a shared theme object.
- Set `dir` for RTL and `targetDocument` plus `applyStylesToPortals` when rendering into iframes or custom portal hosts - theming correctness depends on where the variables live.

## Examples

### Swapping built-in themes with FluentProvider

The minimum theming setup: choose a complete theme object, pass it to FluentProvider, and style your own markup with the same design tokens so everything re-themes together.

```tsx
import * as React from 'react';
import {
  Button,
  Card,
  CardHeader,
  FluentProvider,
  Text,
  makeStyles,
  tokens,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  page: {
    minHeight: '100vh',
    boxSizing: 'border-box',
    padding: tokens.spacingVerticalXXL,
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
  },
  card: {
    maxWidth: '420px',
    rowGap: tokens.spacingVerticalM,
  },
});

export const App = () => {
  const styles = useStyles();
  const [isDark, setIsDark] = React.useState(false);

  // Switching the theme object only rewrites CSS custom properties on the
  // FluentProvider element - no component needs to know about it.
  const theme = isDark ? webDarkTheme : webLightTheme;

  return (
    <FluentProvider theme={theme}>
      <div className={styles.page}>
        <Card className={styles.card}>
          <CardHeader
            header={<Text weight="semibold">Themed surface</Text>}
            description={
              <Text size={200}>
                Colors, spacing and radii all come from design tokens.
              </Text>
            }
          />
          <Button appearance="primary" onClick={() => setIsDark(previous => !previous)}>
            {isDark ? 'Use light theme' : 'Use dark theme'}
          </Button>
        </Card>
      </div>
    </FluentProvider>
  );
};

export default App;
```

### Generating light and dark themes from a brand ramp

Defines a 16-stop BrandVariants ramp and uses createLightTheme / createDarkTheme to produce two complete, brand-consistent themes, then patches the brand foreground tokens the generator cannot infer.

```tsx
import * as React from 'react';
import {
  Button,
  FluentProvider,
  createDarkTheme,
  createLightTheme,
  type BrandVariants,
  type Theme,
} from '@fluentui/react-components';

/**
 * A brand ramp has 16 stops: 10 (darkest) through 160 (lightest).
 * Stop 80 is the seed used as the primary brand color for `colorBrandBackground`.
 */
const brandRamp: BrandVariants = {
  10: '#020305',
  20: '#111723',
  30: '#16263d',
  40: '#193253',
  50: '#1b3f6a',
  60: '#1b4c82',
  70: '#18599b',
  80: '#1267b4',
  90: '#3174c2',
  100: '#4f82c8',
  110: '#6790cf',
  120: '#7d9ed5',
  130: '#92acdc',
  140: '#a6bae2',
  150: '#bac9e9',
  160: '#cdd8ef',
};

/** Complete themes generated from the ramp. */
export const brandLightTheme: Theme = { ...createLightTheme(brandRamp) };
export const brandDarkTheme: Theme = { ...createDarkTheme(brandRamp) };

// Fine-tune tokens the generator cannot reason about. Brand text on a dark
// surface needs a lighter stop than the brand fill, for example.
brandDarkTheme.colorBrandForeground1 = brandRamp[110];
brandDarkTheme.colorBrandForeground2 = brandRamp[120];
brandDarkTheme.colorBrandForegroundLink = brandRamp[120];

brandLightTheme.colorBrandForeground1 = brandRamp[70];

/** High-contrast themes follow the same shape. */
// import { createHighContrastTheme } from '@fluentui/react-components';
// export const brandHighContrastTheme: Theme = createHighContrastTheme(brandRamp);

export const BrandedApp = ({ isDark }: { isDark: boolean }) => (
  <FluentProvider theme={isDark ? brandDarkTheme : brandLightTheme}>
    <Button appearance="primary">Branded primary action</Button>
  </FluentProvider>
);
```

### Composing a complete custom theme from a base theme

Shows the safe way to override individual tokens: spread a complete base theme so no token is left undefined, and keep the result in a module-level constant for a stable identity.

```tsx
import { webLightTheme, type Theme, type PartialTheme } from '@fluentui/react-components';

/**
 * Always spread a complete base theme. FluentProvider does not deep-merge a
 * partial theme - the object you pass is rendered as-is into CSS variables, so
 * a root-level partial theme would leave the omitted variables unset.
 */
export const contosoLightTheme: Theme = {
  ...webLightTheme,

  // Brand
  colorBrandBackground: '#0f6cbd',
  colorBrandBackgroundHover: '#115ea3',
  colorBrandBackgroundPressed: '#0c3b5e',
  colorBrandForeground1: '#0f6cbd',
  colorBrandStroke1: '#0f6cbd',

  // Neutrals
  colorNeutralBackground1: '#ffffff',
  colorNeutralBackground2: '#fafafa',
  colorNeutralBackground3: '#f5f5f5',
  colorNeutralForeground1: '#242424',
  colorNeutralForeground2: '#424242',
  colorNeutralStroke1: '#d1d1d1',

  // Type scale
  fontFamilyBase: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  fontSizeBase300: '14px',
  lineHeightBase300: '20px',

  // Shape and density
  borderRadiusMedium: '6px',
  borderRadiusLarge: '10px',
  spacingHorizontalM: '12px',
  spacingVerticalM: '12px',

  // Elevation and focus
  shadow4: '0 2px 4px rgba(0, 0, 0, 0.14), 0 0 2px rgba(0, 0, 0, 0.12)',
  colorStrokeFocus2: '#0f6cbd',
};

/** Safe to pass from a *nested* provider: missing tokens inherit from the parent scope. */
export const contosoSidebarOverride: PartialTheme = {
  colorNeutralBackground1: '#1b1a19',
  colorNeutralForeground1: '#ffffff',
};
```

### Styling your own components with tokens, makeStyles and mergeClasses

Demonstrates module-level makeStyles using token values for color, typography, spacing, shape and elevation, plus conditional class composition with mergeClasses so overrides win predictably.

```tsx
import * as React from 'react';
import {
  Button,
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalS),
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    boxShadow: tokens.shadow4,
    // Tokens are CSS variables, so every value above follows the active theme.
  },
  cardAccent: {
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.border('1px', 'solid', tokens.colorBrandStroke1),
  },
  title: {
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase400,
  },
  muted: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

type TokenCardProps = {
  accent?: boolean;
  title: string;
  children?: React.ReactNode;
};

export const TokenCard = ({ accent, title, children }: TokenCardProps) => {
  const styles = useStyles();

  return (
    <div className={mergeClasses(styles.card, accent && styles.cardAccent)}>
      <span className={styles.title}>{title}</span>
      <span className={styles.muted}>{children}</span>
      <Button appearance="secondary" size="small">
        Themed action
      </Button>
    </div>
  );
};
```

### Runtime theme resolution: system preference, forced colors and persistence

A reusable hook that resolves light / dark / system mode, listens for prefers-color-scheme and forced-colors changes, persists the user's explicit choice, and memoizes the resulting theme object.

```tsx
import * as React from 'react';
import {
  Button,
  FluentProvider,
  createHighContrastTheme,
  webDarkTheme,
  webLightTheme,
  type Theme,
} from '@fluentui/react-components';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'app-theme-mode';

const readStoredMode = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'system';
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
};

export const useAppTheme = () => {
  const [mode, setMode] = React.useState<ThemeMode>(readStoredMode);
  const [prefersDark, setPrefersDark] = React.useState(false);
  const [forcedColors, setForcedColors] = React.useState(false);

  React.useEffect(() => {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const contrastQuery = window.matchMedia('(forced-colors: active)');

    setPrefersDark(darkQuery.matches);
    setForcedColors(contrastQuery.matches);

    const onDarkChange = (event: MediaQueryListEvent) => setPrefersDark(event.matches);
    const onContrastChange = (event: MediaQueryListEvent) => setForcedColors(event.matches);

    darkQuery.addEventListener('change', onDarkChange);
    contrastQuery.addEventListener('change', onContrastChange);

    return () => {
      darkQuery.removeEventListener('change', onDarkChange);
      contrastQuery.removeEventListener('change', onContrastChange);
    };
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  // Memoize so the theme object identity is stable across renders.
  const theme = React.useMemo<Theme>(() => {
    if (forcedColors) {
      return createHighContrastTheme();
    }
    const isDark = mode === 'dark' || (mode === 'system' && prefersDark);
    return isDark ? webDarkTheme : webLightTheme;
  }, [forcedColors, mode, prefersDark]);

  return { mode, setMode, theme };
};

export const App = () => {
  const { mode, setMode, theme } = useAppTheme();

  return (
    <FluentProvider theme={theme}>
      <Button
        appearance="primary"
        onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
      >
        Toggle theme (current: {mode})
      </Button>
    </FluentProvider>
  );
};
```

### Scoped themes: nested FluentProviders, portals and explicit Portal mounts

Shows how a nested provider creates an independent theme scope, how Fluent overlays keep that scope through their own portals, and how to portal explicitly with the Portal mountNode prop.

```tsx
import * as React from 'react';
import {
  Button,
  FluentProvider,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Portal,
  makeStyles,
  tokens,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  shell: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: tokens.spacingHorizontalL,
    padding: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow2,
  },
});

export const Shell = () => {
  const styles = useStyles();
  const [mountNode, setMountNode] = React.useState<HTMLDivElement | null>(null);

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.shell}>
        <div className={styles.panel}>
          <Popover>
            <PopoverTrigger disableButtonEnhancement>
              <Button>Light popover</Button>
            </PopoverTrigger>
            <PopoverSurface>
              Portaled content keeps the light theme automatically.
            </PopoverSurface>
          </Popover>
        </div>

        {/* A nested provider starts a brand new theme scope for its subtree. */}
        <FluentProvider theme={webDarkTheme}>
          <div className={styles.panel}>
            <Popover>
              <PopoverTrigger disableButtonEnhancement>
                <Button appearance="primary">Dark popover</Button>
              </PopoverTrigger>
              <PopoverSurface>
                The overlay renders in a portal but stays inside the dark scope.
              </PopoverSurface>
            </Popover>

            {/* Explicit portals can target an arbitrary node in the document. */}
            <div ref={setMountNode} />
            <Portal mountNode={mountNode}>
              <div className={styles.panel}>Rendered inside the dark scope.</div>
            </Portal>
          </div>
        </FluentProvider>
      </div>
    </FluentProvider>
  );
};
```

### Theme-wide component styling with customStyleHooks_unstable

Overrides how every Button in the subtree is styled by appending Griffel classes from a style hook supplied to FluentProvider, instead of touching each Button instance.

```tsx
import * as React from 'react';
import {
  Button,
  FluentProvider,
  makeStyles,
  mergeClasses,
  tokens,
  webLightTheme,
} from '@fluentui/react-components';

const useButtonOverrides = makeStyles({
  root: {
    backgroundColor: tokens.colorPaletteRedBackground3,
    color: tokens.colorNeutralForegroundOnBrand,
    ':hover': {
      backgroundColor: tokens.colorPaletteRedForeground1,
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
});

/**
 * The hook receives the component's internal state (the same object the
 * component's own style hooks receive). It must be a hook - call it
 * unconditionally during render, exactly like a component style hook.
 */
const useCustomButtonStyles = (state: { root: { className: string } }) => {
  const styles = useButtonOverrides();
  state.root.className = mergeClasses(state.root.className, styles.root);
};

export const App = () => (
  <FluentProvider
    theme={webLightTheme}
    customStyleHooks_unstable={{
      useButtonStyles_unstable: useCustomButtonStyles,
    }}
  >
    <Button appearance="primary">Every button in this subtree</Button>
  </FluentProvider>
);
```

### Reading theme tokens from plain CSS

Because the theme is emitted as CSS custom properties on the provider element, ordinary stylesheets anywhere in the subtree can consume the exact same tokens - including for markup that Fluent does not own.

```css
/*
  The active theme is applied as CSS custom properties on the FluentProvider
  element, so any descendant selector can read them. No build step required.
*/
.my-surface {
  display: flex;
  flex-direction: column;
  gap: var(--spacingVerticalS);

  background-color: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);

  border: var(--strokeWidthThin) solid var(--colorNeutralStroke1);
  border-radius: var(--borderRadiusMedium);
  box-shadow: var(--shadow4);

  padding: var(--spacingVerticalM) var(--spacingHorizontalL);

  font-family: var(--fontFamilyBase);
  font-size: var(--fontSizeBase300);
  line-height: var(--lineHeightBase300);
  font-weight: var(--fontWeightRegular);

  transition-property: background-color, box-shadow;
  transition-duration: var(--durationNormal);
  transition-timing-function: var(--curveEasyEase);
}

.my-surface:hover {
  background-color: var(--colorNeutralBackground1Hover);
}

.my-surface-brand {
  background-color: var(--colorBrandBackground);
  color: var(--colorNeutralForegroundOnBrand);
}

/*
  Optional: strongly typed access to the same variable names in TypeScript.

  import { themeToTokensObject, webLightTheme } from '@fluentui/react-components';

  const themeTokens = themeToTokensObject(webLightTheme);
  // themeTokens.colorNeutralBackground1 === 'var(--colorNeutralBackground1)'
*/
```

## Pitfalls

- Passing an incomplete theme to a root FluentProvider. The prop is typed `Partial<Theme>`, but FluentProvider only falls back to `webLightTheme` when `theme` is `undefined` - it does not merge. Omitting tokens leaves their CSS variables unset.
- Creating the theme object inline on every render (`theme={{ ...webLightTheme, ...draft }}` or `theme={isDark ? createDarkTheme(ramp) : createLightTheme(ramp)}`). A new identity re-generates and re-applies the theme class; hoist themes to module scope or wrap them in `useMemo`.
- Hard-coding hex or pixel values in `makeStyles` instead of using tokens. Those values silently break in dark mode, high contrast and any customer theme.
- Calling `makeStyles` inside a component body or inside a conditional. Style hooks are hooks: define them once at module scope and call them unconditionally.
- Combining class names with string concatenation or template literals. Griffel emits atomic classes, so two classes can both set the same property; only `mergeClasses` resolves the conflict deterministically (later arguments win).
- Assuming nested providers merge themes. A nested provider's theme fully wins inside its subtree for the tokens it defines; tokens it omits inherit from the ancestor variables, which is behaviour, not automatic merging.
- Mutating imported themes (`webLightTheme.colorBrandBackground = '#...'`). Built-in themes are shared module singletons; clone first (`{ ...webDarkTheme }`) and patch the clone.
- Forgetting the portal/document plumbing: Portaling into a DOM node outside a themed element, or into another document without `targetDocument`, produces unthemed surfaces; Fluent's overlays keep the scope only when the provider context is available.
- Ignoring forced colors and RTL: custom palettes often fail WCAG contrast, and hard-coded physical CSS properties (left/right) instead of `dir` on FluentProvider break mirrored layouts.
- Treating `customStyleHooks_unstable` as stable, or invoking new hooks inside those hooks' callbacks. The prop name signals churn; keep its usage thin and centralised.

## Accessibility

Theming is where accessibility is most easily lost, because a single token edit affects every component at once.

- **Contrast:** verify body text at >= 4.5:1 and large text / interactive boundaries / icons at >= 3:1 in every theme you ship, including nested scopes. Pay special attention to `colorNeutralForeground1/2/3` on `colorNeutralBackground1..3`, `colorNeutralForegroundOnBrand` on `colorBrandBackground`, and the `colorPalette*` status pairs used by Badge, MessageBar and ProgressBar.
- **Never encode meaning in color alone:** status tokens must be accompanied by text or icons; Badge and MessageBar support `intent`-style semantics precisely so color is not the only signal.
- **Focus visibility:** keep `colorStrokeFocus1` / `colorStrokeFocus2` strongly contrasting against both the surface and the focused control; a focus ring that disappears in one theme is a release blocker.
- **High contrast / forced colors:** honor `(forced-colors: active)` with `window.matchMedia` and switch to `createHighContrastTheme()`; do not rely on `box-shadow` or subtle neutral strokes as the only boundary between surfaces, because forced-colors mode discards them.
- **Reduced motion:** theme `duration*` / `curve*` tokens do not override the user's `prefers-reduced-motion` setting - keep custom transitions behind an explicit check.
- **Direction:** set `dir` on `FluentProvider` rather than flipping with CSS transforms; logical spacing tokens and Fluent overlays follow the provider's direction.
- **Theme switching controls:** the control that toggles themes must itself be keyboard operable and labelled; announce the change through visible UI rather than relying on a silent visual swap.
- **Test matrix:** light, dark, high contrast, RTL, and any branded theme - ideally automated with a contrast checker run over rendered screenshots.

**Referenced components**: FluentProvider, Portal, Button, Card, CardHeader, Text, Popover, PopoverTrigger, PopoverSurface, Menu, MenuTrigger, MenuPopover, MenuList, MenuItem, Dialog, DialogSurface, DialogBody, DialogTrigger, Input, Checkbox, Switch, Slider, Rating, Badge, MessageBar, ProgressBar, Tooltip, Drawer, Toast

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
