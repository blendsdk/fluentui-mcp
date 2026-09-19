# Styling Tokens Reference

> **Category**: quick-reference

## 1. Mental model

```
BrandVariants → createLightTheme/createDarkTheme → Theme → <FluentProvider theme={...}> → tokens.* → var(--token)
```

- `tokens` is a flat map: `tokens.colorBrandBackground === 'var(--colorBrandBackground)'`.
- A `Theme` is just the **values** of those CSS custom properties, applied by `FluentProvider` via a theme class on a wrapper element.
- Switching themes = one class swap → CSS rules are never regenerated, components never re-render for styling.
- Write `var(--colorBrandBackground)` in plain CSS or inline `style` — it resolves anywhere inside the `FluentProvider` subtree.
- Never hard-code hex/px: always go through `tokens.*`.

## 2. Core APIs (all exported from `@fluentui/react-components`)

| API | Kind | Purpose |
|---|---|---|
| `tokens` | object | `tokenName → 'var(--tokenName)'` |
| `webLightTheme`, `webDarkTheme` | `Theme` | default Fluent 2 light / dark |
| `teamsLightTheme`, `teamsDarkTheme`, `teamsHighContrastTheme` | `Theme` | Microsoft Teams themes |
| `createLightTheme(brand)` / `createDarkTheme(brand)` | fn | build a `Theme` from `BrandVariants` |
| `createHighContrastTheme()` | fn | high-contrast theme |
| `themeToTokensObject(theme)` | fn | turn a `Theme` into a `Tokens` object |
| `makeStyles({...})` | fn | atomic Griffel class factory → returns a hook |
| `makeResetStyles(...)` / `makeStaticStyles(...)` | fn | non-atomic base class / global CSS |
| `mergeClasses(...)` | fn | merge + dedupe class names |
| `shorthands` | object | `border`, `borderColor`, `borderRadius`, `borderStyle`, `borderWidth`, `padding`, `paddingBlock`, `paddingInline`, `margin`, `gap`, `inset`, `outline`, `overflow`, `transition`, `textDecorationLine`, `flex`, `grid` |
| `BrandVariants`, `Theme`, `PartialTheme` | types | — |

## 3. `FluentProvider` props that control tokens

| Prop | Type | Default | Notes |
|---|---|---|---|
| `theme` | `PartialTheme` | `webLightTheme` | values merged over the base theme |
| `applyStylesToPortals` | boolean | `true` | injects the theme class into portal-rendered content |
| `targetDocument` | `Document` | owning document | portals + SSR |
| `dir` | `'ltr' \| 'rtl'` | inherited | text direction |
| `customStyleHooks_unstable` | `FluentProviderCustomStyleHooks` | — | per-component style override, tree-wide |
| `overrides_unstable` | `OverridesContextValue_unstable` | — | global token override, e.g. `{ tokens: { colorBrandBackground: '#b4009e' } }` |

A **nested** `FluentProvider` re-themes only its subtree. To tweak one token, spread a partial theme (`{ ...webLightTheme, colorBrandBackground: '#b4009e' }`) instead of building a whole new theme.

## 4. Token reference

### 4.1 Color — semantic families

| Family | Tokens | Suffixes |
|---|---|---|
| Neutral foreground | `colorNeutralForeground1`..`4` | *(base)*, `Hover`, `Pressed`, `Selected`, `Disabled`; also `colorNeutralForegroundStatic`, `colorNeutralForegroundInverted`, `colorNeutralForegroundOnBrand` |
| Neutral background | `colorNeutralBackground1`..`6` | *(base)*, `Hover`, `Pressed`, `Selected`, `Disabled`; also `colorNeutralBackgroundStatic`, `colorNeutralBackgroundInverted`, `colorNeutralBackgroundAlpha` |
| Neutral stroke | `colorNeutralStroke1`..`3` | *(base)*, `Hover`, `Pressed`, `Selected`, `Disabled`; also `colorNeutralStrokeAccessible`, `colorNeutralStrokeAlpha` |
| Focus stroke | `colorStrokeFocus1`, `colorStrokeFocus2` | — |
| Brand foreground | `colorBrandForeground1`, `colorBrandForeground2` | `Hover`, `Pressed`, `Selected`, `Disabled`; also `colorBrandForegroundLink`(`Hover`/`Pressed`), `colorBrandForegroundOnBrand`(`Hover`/`Pressed`/`Disabled`) |
| Brand background | `colorBrandBackground`, `colorBrandBackground2`..`6` | `Hover`, `Pressed`, `Selected`, `Disabled`, `Static`, `Inverted` |
| Brand stroke | `colorBrandStroke1`, `colorBrandStroke2` | `Hover`, `Pressed`, `Selected`, `Disabled`, `Contrast` |
| Compound (checked/selected controls) | `colorCompoundBrandBackground`, `colorCompoundBrandForeground1`, `colorCompoundBrandStroke` | `Hover`, `Pressed` |
| Overlay scrim | `colorBackgroundOverlay` | — |
| Shadow colors | `colorNeutralShadowAmbient`, `colorNeutralShadowKey`, `colorBrandShadowAmbient`, `colorBrandShadowKey` | — |

> Not every suffix exists on every family — check the token table for the exact name before using.

### 4.2 Color — palette & status

| Pattern | Families / intents | Example |
|---|---|---|
| `colorPalette{Family}Background{1\|2\|3}` | Red, Green, DarkOrange, Yellow, Berry, LightBlue, Marigold, Navy, Lavender, Gold, Plum, Beige, Mink, Pink, Pumpkin, Peach, Magenta, Grape, Lime, Teal, … | `colorPaletteRedBackground2` |
| `colorPalette{Family}Foreground{1\|2\|3}` | same | `colorPaletteGreenForeground1` |
| `colorPalette{Family}Border{1\|2}` | same | `colorPaletteYellowBorder1` |
| `colorStatus{Intent}Background{1\|2\|3}` | Success, Warning, Danger, Info | `colorStatusDangerBackground1` |
| `colorStatus{Intent}Foreground{1\|2\|3}` | same | `colorStatusWarningForeground1` |
| `colorStatus{Intent}Border{1\|2}` | same | `colorStatusSuccessBorder1` |

Semantic tokens for UI chrome; palette + status tokens for badges, charts, illustrations and callouts.

### 4.3 A few concrete `webLightTheme` values

| Token | `webLightTheme` |
|---|---|
| `colorNeutralBackground1` | `#ffffff` |
| `colorNeutralForeground1` | `#242424` |
| `colorNeutralStroke1` | `#d1d1d1` |
| `colorNeutralBackgroundDisabled` | `#f0f0f0` |
| `colorNeutralForegroundDisabled` | `#bdbdbd` |
| `colorBrandBackground` | `#0f6cbd` |
| `colorCompoundBrandBackground` | `#0f6cbd` |
| `colorNeutralForegroundOnBrand` | `#ffffff` |
| `colorStrokeFocus2` | `#000000` |

Dark, Teams and high-contrast themes reuse the **same token names** with different values — never branch your CSS on the active theme.

### 4.4 Typography

| Token | Value |
|---|---|
| `fontFamilyBase` | `'Segoe UI', 'Segoe UI Web (West European)', -apple-system, …` |
| `fontFamilyMonospace`, `fontFamilyNumeric` | monospace / tabular stacks |
| `fontSizeBase100` → `fontSizeBase1000` | 10 / 12 / 14 / 16 / 20 / 24 / 28 / 32 / 40 / 68 px |
| `lineHeightBase100` → `lineHeightBase1000` | 14 / 16 / 20 / 22 / 28 / 32 / 36 / 40 / 52 / 92 px |
| `fontSizeHero700`..`fontSizeHero1000`, `lineHeightHero700`..`lineHeightHero1000` | hero / display sizes |
| `fontWeightRegular` / `fontWeightMedium` / `fontWeightSemibold` / `fontWeightBold` | 400 / 500 / 600 / 700 |

Paired scale rule: body = `fontSizeBase300` + `lineHeightBase300`; captions = `fontSizeBase200`; subtitles = `fontSizeBase400` + `fontWeightSemibold`.

### 4.5 Spacing / radius / stroke / shadow / motion

| Category | Tokens | Values |
|---|---|---|
| Spacing | `spacingHorizontal{None,XXS,XS,SNudge,S,MNudge,M,L,XL,XXL,XXXL}` and the same for `spacingVertical*` | 0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32 px |
| Radius | `borderRadiusNone`, `borderRadiusSmall`, `borderRadiusMedium`, `borderRadiusLarge`, `borderRadiusXLarge`, `borderRadiusCircular` | 0, 2, 4, 6, 8, 10000 px |
| Stroke | `strokeWidthThin`, `strokeWidthThick`, `strokeWidthThicker`, `strokeWidthThickest` | 1, 2, 3, 4 px |
| Shadow | `shadow2`, `shadow4`, `shadow8`, `shadow16`, `shadow28`, `shadow64` (+ `…Brand` variants) | elevation presets |
| Duration | `durationUltraFast`, `durationFaster`, `durationFast`, `durationNormal`, `durationSlow`, `durationSlower`, `durationUltraSlow` | 50, 100, 150, 200, 300, 400, 500 ms |
| Curve | `curveAccelerateMax/Mid/Min`, `curveDecelerateMax/Mid/Min`, `curveEasyEaseMax`, `curveEasyEase`, `curveLinear` | cubic-bezier presets |

Horizontal and vertical spacing are **separate scales** — `spacingVerticalM` for row gaps, `spacingHorizontalM` for column gaps.

## 5. Which token for what

| Need | Token |
|---|---|
| Page / surface background | `colorNeutralBackground1` |
| Card on a surface | `colorNeutralBackground1` + `shadow4` (or `colorNeutralBackground2`) |
| Body text | `colorNeutralForeground1` |
| Secondary text | `colorNeutralForeground2` |
| Disabled text / background | `colorNeutralForegroundDisabled` / `colorNeutralBackgroundDisabled` |
| Border / divider | `colorNeutralStroke1` (subtler: `colorNeutralStroke2`) |
| Accessible border (input outline, ~3:1) | `colorNeutralStrokeAccessible` |
| Primary action fill | `colorBrandBackground` + `colorBrandBackgroundHover` / `colorBrandBackgroundPressed` |
| Text on a brand fill | `colorNeutralForegroundOnBrand` |
| Link | `colorBrandForegroundLink` (+ `Hover` / `Pressed`) |
| Checked / selected control | `colorCompoundBrandBackground` / `colorCompoundBrandStroke` |
| Focus ring | `colorStrokeFocus2` + `strokeWidthThick` |
| Danger / warning / success messaging | `colorStatusDanger*` / `colorStatusWarning*` / `colorStatusSuccess*` |
| Modal scrim | `colorBackgroundOverlay` |

## 6. Patterns

- `makeStyles` (atomic, hashed classes) is the default. Use `makeResetStyles` for base classes where specificity/override order matters, and `makeStaticStyles` for global selectors.
- Pseudo-classes and at-rules are nested objects inside the style object: `':hover': {...}`, `':focus-visible': {...}`, `'@media (forced-colors: active)': {...}`.
- Compose component styles with the `className` prop: `className={mergeClasses(styles.base, active && styles.active)}`.
- Prefer `FluentProvider`-level controls before reaching for `customStyleHooks_unstable` / `overrides_unstable` (both `_unstable`).

## 7. Plain-CSS / non-Griffel surfaces

Any descendant of `FluentProvider` can read tokens as CSS custom properties:

```css
.my-chart-tooltip {
  background-color: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  border: var(--strokeWidthThin) solid var(--colorNeutralStroke1);
  border-radius: var(--borderRadiusMedium);
  padding: var(--spacingVerticalS) var(--spacingHorizontalM);
  box-shadow: var(--shadow8);
  font: var(--fontWeightRegular) var(--fontSizeBase200) / var(--lineHeightBase200) var(--fontFamilyBase);
}
```

The CSS variable name is always `--` + the token name.

## 8. Quick decision list

1. Need a color/size? → find the `tokens.*` name; never type a hex or px.
2. Need a new brand? → `BrandVariants` + `createLightTheme`/`createDarkTheme` + `<FluentProvider theme>`.
3. Need one token different? → `overrides_unstable={{ tokens: {...} }}` or a partial theme spread.
4. Need a component styled differently everywhere? → `customStyleHooks_unstable`.
5. Need it in a portal? → `applyStylesToPortals` (default `true`) / `targetDocument`.
6. Need it in CSS? → `var(--tokenName)`.

## Key Takeaways

- `tokens.x` is literally the string `'var(--x)'` — the same style class works unchanged in web light/dark, Teams and high-contrast themes; only the Provider-applied variable values change.
- A theme is created from a full 16-key `BrandVariants` object (keys 10..160, step 10) via `createLightTheme(brand)` / `createDarkTheme(brand)`, then applied with `<Provider theme={...}>`; nested Providers re-theme only their subtree.
- `makeStyles` + `mergeClasses` + `shorthands` is the canonical v9 styling pipeline: build atomic classes from tokens at module scope, then pass them to components through `className`.
- Use semantic tokens (`colorBrand*`, `colorNeutral*`, `colorCompoundBrand*`, `colorStatus*`) for UI chrome; reserve `colorPalette*` for accents, badges and data visualization.
- Portal-rendered content (Portal, Menu, Popover, Dialog, Tooltip) is outside the Provider DOM node — `applyStylesToPortals` (default `true`) plus `targetDocument` keeps the theme variables available there.
- Escape hatches in order of preference: a partial theme spread, `overrides_unstable={{ tokens: {...} }}` for global token overrides, then `customStyleHooks_unstable` for per-component style changes (both `_unstable`).
- Token scales are fixed sets: spacing (`spacingHorizontal|Vertical` × None→XXXL), radius (`borderRadius` None→XLarge/Circular), stroke (`strokeWidthThin→Thickest`), shadows (`shadow2→shadow64`), durations and curves — compose from the scale instead of inventing values.

## Examples

### Brand theme → Provider

Build light/dark themes from a 16-step BrandVariants palette and apply them at the app root.

```tsx
import { FluentProvider, Button, createLightTheme, createDarkTheme, type BrandVariants, type Theme } from '@fluentui/react-components';

// BrandVariants requires ALL keys 10..160 in steps of 10
const brand: BrandVariants = {
  10: '#020305', 20: '#111723', 30: '#16263d', 40: '#193253',
  50: '#1b3f6a', 60: '#1b4c82', 70: '#18599b', 80: '#1267b4',
  90: '#3174c2', 100: '#4f82c8', 110: '#6790cb', 120: '#7d9ed0',
  130: '#92acd5', 140: '#a7bada', 150: '#bbc8df', 160: '#cfd6e4',
};

const lightTheme: Theme = createLightTheme(brand);
const darkTheme: Theme = createDarkTheme(brand);

export const App = ({ isDark }: { isDark: boolean }) => (
  <FluentProvider theme={isDark ? darkTheme : lightTheme}>
    <Button appearance="primary">Primary uses colorBrandBackground</Button>
  </FluentProvider>
);
```

### makeStyles with tokens + shorthands

The canonical Fluent v9 styled component: tokens for every value, shorthands for CSS shorthands, nested pseudo-classes for states.

```tsx
import { makeStyles, tokens, shorthands } from '@fluentui/react-components';

export const useSurfaceStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
    ...shorthands.border(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    fontWeight: tokens.fontWeightRegular,
    boxShadow: tokens.shadow4,
    transitionProperty: 'background-color, box-shadow',
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      ...shorthands.borderColor(tokens.colorNeutralStroke1Hover),
      boxShadow: tokens.shadow8,
    },
    ':focus-visible': {
      ...shorthands.outline(tokens.strokeWidthThick, 'solid', tokens.colorStrokeFocus2),
      outlineOffset: `calc(-1 * ${tokens.strokeWidthThick})`,
    },
    '@media (forced-colors: active)': {
      ...shorthands.borderColor('CanvasText'),
    },
  },
});
```

### mergeClasses for conditional tokens

Compose a base class with a state class and hand it to a component via className.

```tsx
import { Button, makeStyles, mergeClasses, tokens, shorthands } from '@fluentui/react-components';

const useStyles = makeStyles({
  base: {
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalM),
  },
  active: {
    backgroundColor: tokens.colorCompoundBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
});

export const Pill = ({ active, children }: { active: boolean; children: string }) => {
  const styles = useStyles();
  return (
    <Button
      appearance="subtle"
      className={mergeClasses(styles.base, active && styles.active)}
    >
      {children}
    </Button>
  );
};
```

### Provider escape hatches + portals

Global token override, tree-wide component style override, and theme inheritance into Portal content.

```tsx
import { FluentProvider, Portal, Button, webLightTheme, tokens } from '@fluentui/react-components';

// Partial theme: same token names, one value changed
const appTheme = { ...webLightTheme, colorBrandBackground: '#b4009e' };

export const App = () => (
  <FluentProvider
    theme={appTheme}
    // default true: injects the theme class into portal content (Portal, Menu, Popover, Dialog, Tooltip...)
    applyStylesToPortals
    targetDocument={document}
    // Escape hatch: same override for every instance in the tree
    customStyleHooks_unstable={{
      useButtonStyles_unstable: (state) => {
        state.root.style.fontWeight = tokens.fontWeightSemibold;
      },
    }}
    // Alternative global token override: overrides_unstable={{ tokens: { colorBrandBackground: '#b4009e' } }}
  >
    <Portal>
      <Button appearance="primary">Inherits the theme class</Button>
    </Portal>
  </FluentProvider>
);
```

### Tokens in plain CSS

Token names map 1:1 to CSS custom properties, so any non-Griffel surface inside Provider works.

```css
/* CSS variable name = '--' + token name */
.my-chart-tooltip {
  background-color: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  border: var(--strokeWidthThin) solid var(--colorNeutralStroke1);
  border-radius: var(--borderRadiusMedium);
  padding: var(--spacingVerticalS) var(--spacingHorizontalM);
  box-shadow: var(--shadow8);
  font: var(--fontWeightRegular) var(--fontSizeBase200) / var(--lineHeightBase200)
    var(--fontFamilyBase);
}

.my-chart-tooltip:hover {
  background-color: var(--colorNeutralBackground1Hover);
}

.my-chart-tooltip:focus-visible {
  outline: var(--strokeWidthThick) solid var(--colorStrokeFocus2);
}
```

## Pitfalls

- Hard-coding hex colors, px values or box-shadows instead of `tokens.*` breaks dark, Teams and high-contrast themes instantly — every color, size, radius, shadow and duration should come from `tokens`.
- `tokens.colorX` is a `var(--colorX)` string, not a literal value: you cannot parse, compare or compute with it in JS. Read computed styles or resolve the theme when you need a real color (e.g. for canvas/chart libraries).
- Calling `makeStyles` inside a component body recreates the style classes and violates hook rules — always define style hooks at module scope and call the returned hook inside the component.
- `mergeClasses(a, b)` does not guarantee precedence by argument order: when two atomic classes set the same property, the one defined later in the `makeStyles` object wins. Put override rules after base rules in the same style object.
- Forgetting portal theming: content rendered by `Portal` (and Popover/Menu/Dialog/Tooltip surfaces) sits outside the Provider element, so without `applyStylesToPortals` / a nested `Provider` / correct `targetDocument` the CSS variables are missing and the content renders unstyled (also a common SSR/hydration mismatch).
- `BrandVariants` must be a complete record — all 16 keys from 10 to 160 in steps of 10 — or the type fails; missing keys silently produce broken brand ramps.
- Wrapping a subtree in a nested `Provider` with a brand-new theme resets every token. Pass a partial theme (`{ ...webLightTheme, colorBrandBackground: '#b4009e' }`) to change only what you need.
- Using `colorPalette*` or `colorStatus*` tokens for general chrome (borders, backgrounds, body text) yields inconsistent semantics across themes — use the semantic neutral/brand tokens instead, and never patch with `!important`.

**Referenced components**: Provider, Portal, Button

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
