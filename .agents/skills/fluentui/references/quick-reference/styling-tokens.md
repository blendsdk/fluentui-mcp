# Styling Tokens Reference

> **Category**: quick-reference

## 1. Import surface

```tsx
import {
  // tokens + styling
  tokens, makeStyles, makeResetStyles, makeStaticStyles, mergeClasses, shorthands,
  // theming
  FluentProvider, webLightTheme, webDarkTheme, teamsLightTheme, teamsDarkTheme,
  teamsHighContrastTheme, createLightTheme, createDarkTheme, themeToTokensObject,
} from '@fluentui/react-components';
import type { Theme, BrandVariants } from '@fluentui/react-components';
```

| API | What it does |
| --- | --- |
| `tokens.<name>` | The design token. At runtime it is the string `'var(--<name>)'`. |
| `makeStyles()` | Returns a `useStyles()` hook; emits atomic CSS classes from a style object. |
| `makeResetStyles()` | Returns a `useStyles()` hook emitting **one** reset-level class (ideal for component roots / overriding library defaults). |
| `makeStaticStyles()` | Global, non-atomic styles (selectors like `body`, `@font-face`). |
| `mergeClasses(...)` | Merges class names; last argument wins. Use instead of template strings. |
| `ax(...)` | Joins conditional class strings (`ax('a', cond && 'b')`). |
| `shorthands.*` | CSS shorthand helpers that expand to longhands (`border`, `padding`, `gap`, …). |
| `FluentProvider` | Injects theme CSS variables, `dir`, and propagates styles into portals. |
| `themeToTokensObject(theme)` | Converts any `Theme` into a flat `tokens`-shaped object (non-React code, SSR, canvas). |

## 2. Mental model

| Fact | Detail |
| --- | --- |
| Tokens are CSS variables | `tokens.colorNeutralForeground1 === 'var(--colorNeutralForeground1)'` |
| Provider injects the values | The nearest `FluentProvider` writes `--colorNeutralForeground1: …` onto its root element |
| Theme swap is free | Changing the `theme` prop only swaps CSS variable values — no React re-render, no class regeneration |
| Portals stay themed | `applyStylesToPortals` (default `true`) copies the theme variables to portal mount nodes |
| Scoping is built in | A nested `FluentProvider` themes only its subtree (e.g. a dark panel inside a light app) |
| Naming grammar | `color{Family}{Role}{Variant}{State}`, e.g. `colorBrandForegroundLinkHover` |

## 3. Color tokens

### 3.1 Neutral — text, surfaces, borders

| Token | Role |
| --- | --- |
| `colorNeutralForeground1` | Primary text / icons |
| `colorNeutralForeground2`, `…3`, `…4` | Secondary → quaternary text |
| `colorNeutralForegroundDisabled` | Disabled text |
| `colorNeutralForegroundOnBrand` | Text on brand-colored fills |
| `colorNeutralForegroundInverted`, `…Inverted2`, `…InvertedLink` | Text/icons/links on inverted (dark) surfaces |
| `colorNeutralForeground2Link` (+`Hover`,`Pressed`,`Selected`) | Links in secondary text |
| `colorNeutralBackground1` … `colorNeutralBackground6` | Surface layers (1 = base, higher = raised/alternate panels) |
| `colorNeutralBackground1Hover` / `…Pressed` / `…Selected` | Interaction states (also available on 2–5) |
| `colorNeutralBackgroundDisabled` | Disabled surface |
| `colorNeutralBackgroundInverted` | Inverted surface |
| `colorNeutralBackgroundAlpha`, `colorNeutralBackgroundAlpha2` | Translucent surfaces (overlays, acrylic) |
| `colorNeutralStroke1`, `…2`, `…3` | Borders (1 = strongest default) |
| `colorNeutralStroke1Hover` / `…Pressed` / `…Selected` (also 2, 3) | Border interaction states |
| `colorNeutralStrokeAccessible` | High-contrast-safe stroke (underlines, active indicators) |
| `colorNeutralStrokeDisabled` | Disabled border |
| `colorNeutralShadowAmbient`, `…AmbientLighter`, `…Key`, `…KeyDarker` | Shadow base colors |

### 3.2 Brand, compound, subtle, transparent

| Token | Role |
| --- | --- |
| `colorBrandBackground` (+`Hover`,`Pressed`,`Selected`) | Solid brand fill |
| `colorBrandBackground2` (+`Hover`,`Pressed`) | Low-emphasis brand fill |
| `colorBrandBackground3`, `colorBrandBackgroundStatic` | Strong brand surfaces / non-inverting brand |
| `colorBrandBackgroundInverted` (+ states) | Brand fill on inverted surfaces |
| `colorBrandForeground1`, `…2` | Brand text and icons |
| `colorBrandForegroundLink` (+`Hover`,`Pressed`,`Selected`) | Brand links |
| `colorBrandStroke1`, `…2` (+`2Hover`,`2Pressed`,`2Contrast`) | Brand borders |
| `colorCompoundBrandBackground` (+`Hover`,`Pressed`) | Fill for control-over-brand (Checkbox, Slider, Switch thumbs) |
| `colorCompoundBrandForeground1` (+`Hover`,`Pressed`) | Foreground for compound-brand controls |
| `colorCompoundBrandStroke` (+`Hover`,`Pressed`) | Stroke for compound-brand controls |
| `colorSubtleBackground` (+`Hover`,`Pressed`,`Selected`) | Hover/active fills on flat surfaces |
| `colorTransparentBackground` (+ states) | Fully transparent fills |
| `colorTransparentStroke` (+ states) | Fully transparent strokes |
| `colorBrandShadowAmbient`, `colorBrandShadowKey` | Brand-tinted shadows |

### 3.3 Status and raw palette

| Family | Pattern |
| --- | --- |
| Status | `colorStatus{Success\|Warning\|Danger}{Background1\|Background2\|Background3\|Border1\|Border2\|BorderActive\|Foreground1\|Foreground2\|Foreground3}` |
| Palette | `colorPalette{Red\|Green\|Blue\|Yellow\|Marigold\|Berry\|Plum\|Navy\|Teal\|…}{Background1..3\|Foreground1..3\|Border1\|Border2\|BorderActive}` |

Prefer **status** tokens for feedback UI (Badge, MessageBar, ProgressBar) and **palette** tokens only for data viz / custom brand accents.

### 3.4 Semantic recipes

| I need… | Use |
| --- | --- |
| Page background | `colorNeutralBackground1` |
| Card / popover surface | `colorNeutralBackground1` or `colorNeutralBackground2` |
| Hovered row / subtle button | `colorSubtleBackgroundHover` / `colorNeutralBackground1Hover` |
| Body text | `colorNeutralForeground1` |
| Helper / caption text | `colorNeutralForeground2` or `…3` |
| Disabled text | `colorNeutralForegroundDisabled` |
| Default border | `colorNeutralStroke1` |
| Primary button fill | `colorBrandBackground` + `colorNeutralForegroundOnBrand` |
| Error text | `colorStatusDangerForeground1` |
| Danger banner | `colorStatusDangerBackground1` + `colorStatusDangerBorder1` |

## 4. Typography tokens

| Scale | Font size token (px) | Line height token (px) |
| --- | --- | --- |
| 100 | `fontSizeBase100` (10) | `lineHeightBase100` (14) |
| 200 | `fontSizeBase200` (12) | `lineHeightBase200` (16) |
| 300 | `fontSizeBase300` (14) | `lineHeightBase300` (20) |
| 400 | `fontSizeBase400` (16) | `lineHeightBase400` (22) |
| 500 | `fontSizeBase500` (20) | `lineHeightBase500` (28) |
| 600 | `fontSizeBase600` (24) | `lineHeightBase600` (32) |
| 700 | `fontSizeBase700` (28) | `lineHeightBase700` (36) |
| 800 | `fontSizeBase800` (32) | `lineHeightBase800` (40) |
| 900 | `fontSizeBase900` (40) | `lineHeightBase900` (52) |
| 1000 | `fontSizeBase1000` (68) | `lineHeightBase1000` (92) |
| Hero 700–1000 | `fontSizeHero700`…`fontSizeHero1000` (28/32/40/68) | `lineHeightHero700`…`lineHeightHero1000` (36/40/52/92) |

| Token | Value / role |
| --- | --- |
| `fontFamilyBase` | `'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif` |
| `fontFamilyMonospace` | `Consolas, 'Courier New', Courier, monospace` |
| `fontFamilyNumeric` | `Bahnschrift, 'Segoe UI', …` |
| `fontWeightRegular` / `Medium` / `Semibold` / `Bold` | 400 / 500 / 600 / 700 |

**Rule:** always pair `fontSizeBaseN` with `lineHeightBaseN` (same N). The `Text` component `size` prop uses the same 100–1000 scale.

## 5. Spacing tokens

Every suffix exists in both axes: `spacingHorizontal{Suffix}` and `spacingVertical{Suffix}`.

| Suffix | Value | Example token |
| --- | --- | --- |
| `None` | 0 | `spacingVerticalNone` |
| `XXS` | 2px | `spacingHorizontalXXS` |
| `XS` | 4px | `spacingVerticalXS` |
| `SNudge` | 6px | `spacingHorizontalSNudge` |
| `S` | 8px | `spacingVerticalS` |
| `M` | 12px | `spacingHorizontalM` |
| `L` | 16px | `spacingVerticalL` |
| `XL` | 20px | `spacingHorizontalXL` |
| `XXL` | 24px | `spacingVerticalXXL` |
| `XXXL` | 32px | `spacingHorizontalXXXL` |

## 6. Radius, stroke, shadow

| Category | Tokens |
| --- | --- |
| Border radius | `borderRadiusNone` (0), `borderRadiusSmall` (2px), `borderRadiusMedium` (4px), `borderRadiusLarge` (6px), `borderRadiusXLarge` (8px), `borderRadiusCircular` (10000px) |
| Stroke width | `strokeWidthNone` (0), `strokeWidthThin` (1px), `strokeWidthThick` (2px), `strokeWidthThicker` (3px), `strokeWidthThickest` (4px) |
| Shadow | `shadow2`, `shadow4`, `shadow8`, `shadow16`, `shadow28`, `shadow64` |
| Brand shadow | `shadow2Brand`, `shadow4Brand`, `shadow8Brand`, `shadow16Brand`, `shadow28Brand`, `shadow64Brand` |

## 7. Motion tokens

| Duration token | Value |
| --- | --- |
| `durationUltraFast` | 50ms |
| `durationFaster` | 100ms |
| `durationFast` | 150ms |
| `durationNormal` | 200ms |
| `durationSlow` | 300ms |
| `durationSlower` | 400ms |
| `durationUltraSlow` | 500ms |

| Curve token | Use for |
| --- | --- |
| `curveAccelerateMax` / `…Mid` / `…Min` | Elements **leaving** (exit animations) |
| `curveDecelerateMax` / `…Mid` / `…Min` | Elements **entering** (enter animations) |
| `curveEasyEaseMax`, `curveEasyEase` | Two-way transitions, hover/press states |
| `curveLinear` | Constant motion (progress, spinners) |

## 8. Theming

```tsx
<FluentProvider theme={isDark ? webDarkTheme : webLightTheme}>…</FluentProvider>
```

| Export | Use |
| --- | --- |
| `webLightTheme` (default) / `webDarkTheme` | Standard web apps |
| `teamsLightTheme` / `teamsDarkTheme` / `teamsHighContrastTheme` | Teams-flavored themes |
| `createLightTheme(brand)` / `createDarkTheme(brand)` | Custom light/dark themes from a brand ramp |
| `createHighContrastTheme(brand?)` | High-contrast theme |
| `themeToTokensObject(theme)` | Flat tokens object from any `Theme`, for non-React code |
| `Theme` type | `tokens`-shaped object (the type of a full theme) |

Nested providers create **scoped** themes — the inner provider only overrides CSS variables for its subtree.

## 9. `shorthands`

| Shorthand | Expands to |
| --- | --- |
| `shorthands.border(width, style, color)` | `borderWidth` + `borderStyle` + `borderColor` |
| `shorthands.borderTop` / `Right` / `Bottom` / `Left(...)` | per-side border longhands |
| `shorthands.borderRadius(...)` | 4 corner radii |
| `shorthands.padding(...)` / `shorthands.margin(...)` | 4 side longhands |
| `shorthands.paddingBlock` / `paddingInline` / `marginBlock` / `marginInline` | 2-side axis longhands |
| `shorthands.gap(...)`, `shorthands.inset(...)`, `shorthands.overflow(...)` | axis longhands |
| `shorthands.outline(...)`, `shorthands.textDecoration(...)`, `shorthands.transition(...)`, `shorthands.flex(...)`, `shorthands.gridArea` / `gridColumn` / `gridRow` / `gridTemplate(...)` | corresponding longhands |

**Why it matters:** shorthands expand to longhands, so `mergeClasses` overrides resolve predictably instead of fighting over CSS shorthand/longhand order.

## 10. Token math

Token values are `var()` strings, so no JS arithmetic — use CSS `calc()`:

```ts
padding: `calc(${tokens.spacingVerticalM} * 2)`,   // ✅
// parseInt(tokens.spacingVerticalM)               // ❌ NaN
```

## Key Takeaways

- `tokens.*` from `@fluentui/react-components` is the only supported styling contract — every value resolves to a CSS custom property injected by the nearest `FluentProvider`.
- Take `tokens`, `makeStyles`, `makeResetStyles`, `makeStaticStyles`, `mergeClasses`, and `shorthands` all from `@fluentui/react-components`; combine classes with `mergeClasses` so later classes win.
- Theme switching (`webLightTheme` ↔ `webDarkTheme`, custom `createLightTheme(createDarkTheme(brand))`, or a nested provider) swaps CSS variables only — no re-render and no class regeneration.
- Typography scale numbers must match: pair `fontSizeBaseN` with `lineHeightBaseN` (100–1000, plus `Hero700`–`Hero1000`). The `Text` `size` prop uses the same scale.
- Spacing exists on both axes (`spacingHorizontal*` / `spacingVertical*`), radius is `borderRadiusSmall|Medium|Large|XLarge|Circular`, and motion pairs `duration*` with `curve*` (Accelerate = exit, Decelerate = enter, EasyEase = both).
- Use `themeToTokensObject(theme)` when you need tokens outside React (canvas, DOM, SSR) and keep `applyStylesToPortals` enabled so portals keep the theme.

## Examples

### Token-driven styles with makeStyles

Card-like surface built entirely from color, spacing, radius, shadow, typography and motion tokens; mergeClasses composes the compact variant.

```tsx
import {
  tokens, makeStyles, mergeClasses, shorthands,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    boxShadow: tokens.shadow4,
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    fontWeight: tokens.fontWeightSemibold,
    transition: `background-color ${tokens.durationFast} ${tokens.curveEasyEase}`,
    ':hover': { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  compact: {
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
  },
});

export const Surface = ({ compact }: { compact?: boolean }) => {
  const styles = useStyles();
  return <div className={mergeClasses(styles.root, compact && styles.compact)}>Content</div>;
};
```

### App theme via FluentProvider

Theme switching by swapping the theme prop; only CSS variables change, so no re-render of the styled subtree.

```tsx
import {
  FluentProvider, webLightTheme, webDarkTheme, Card, Text, Button,
} from '@fluentui/react-components';

export const App = ({ isDark }: { isDark: boolean }) => (
  <FluentProvider theme={isDark ? webDarkTheme : webLightTheme}>
    <Card appearance='outline' size='medium'>
      <Text size={400} weight='semibold'>Themed card</Text>
      <Button appearance='primary'>Confirm</Button>
    </Card>
  </FluentProvider>
);
```

### Custom brand theme

Build a light/dark theme from a BrandVariants ramp (keys 10-160) and hand it to FluentProvider.

```tsx
import {
  FluentProvider, createLightTheme, createDarkTheme,
  type BrandVariants, type Theme,
} from '@fluentui/react-components';

const brand: BrandVariants = {
  10: '#020305', 20: '#111723', 30: '#1c2333', 40: '#242b40',
  50: '#2d3449', 60: '#363e54', 70: '#40485f', 80: '#0f6cbd',
  90: '#4d566f', 100: '#5a6380', 110: '#646e8b', 120: '#6f7996',
  130: '#7a85a2', 140: '#8b96b2', 150: '#9da7c0', 160: '#afb8ce',
};

const myLightTheme: Theme = createLightTheme(brand);
const myDarkTheme: Theme = createDarkTheme(brand);

export const BrandedApp = () => (
  <FluentProvider theme={myLightTheme}>{/* app */}</FluentProvider>
);
```

### Scoped (nested) theme

A dark-themed section inside a light app: the nested provider only overrides CSS variables for its subtree.

```tsx
import { FluentProvider, webDarkTheme, Card, Text } from '@fluentui/react-components';

export const DimmedPanel = () => (
  <FluentProvider theme={webDarkTheme} style={{ borderRadius: '6px' }}>
    <Card appearance='filled-alternative'>
      <Text size={300}>This panel uses dark tokens only.</Text>
    </Card>
  </FluentProvider>
);
```

### Typography tokens

Hero + body typography pairs using matching fontSize/lineHeight scale numbers; matches the Text component size scale.

```tsx
import { tokens, makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  hero: {
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeHero700,
    lineHeight: tokens.lineHeightHero700,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  body: {
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground2,
  },
  code: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
  },
});
```

### Motion tokens and calc() math

Duration/curve tokens in a transition, plus CSS calc() since token values are var() strings and cannot be used in JS math.

```tsx
import { tokens, makeStyles, shorthands } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    ...shorthands.padding(`calc(${tokens.spacingVerticalM} * 2)`),
    ...shorthands.gap(tokens.spacingHorizontalS),
    opacity: 0,
    transitionProperty: 'opacity, transform',
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveDecelerateMid,
    ':hover': { opacity: 1 },
    ':active': {
      transitionDuration: tokens.durationUltraFast,
      transitionTimingFunction: tokens.curveAccelerateMid,
    },
  },
});
```

### Tokens outside React / in portals

themeToTokensObject converts a Theme into a flat tokens object for non-React code, and applyStylesToPortals keeps portal content themed.

```tsx
import {
  FluentProvider, webDarkTheme, themeToTokensObject,
} from '@fluentui/react-components';

// 1. Plain-DOM code (charts, canvas, iframes) can read theme values directly.
const dark = themeToTokensObject(webDarkTheme);
const el = document.getElementById('chart-tooltip');
if (el) {
  el.style.backgroundColor = dark.colorNeutralBackground1;
  el.style.color = dark.colorNeutralForeground1;
  el.style.borderRadius = dark.borderRadiusMedium;
}

// 2. Portal content stays themed by default.
export const App = () => (
  <FluentProvider theme={webDarkTheme} applyStylesToPortals={true}>
    {/* menus, dialogs, popovers inherit the theme */}
  </FluentProvider>
);
```

## Pitfalls

- Hardcoding hex/px instead of tokens: breaks `webLightTheme`/`webDarkTheme` switching, Teams themes, and high-contrast themes. Always use `tokens.*`.
- Doing JS math on tokens — they are `var(--…)` strings, so `parseInt(tokens.spacingVerticalM)` is `NaN`. Use CSS: `calc(${tokens.spacingVerticalM} * 2)`.
- Styling without a `FluentProvider` ancestor: the CSS variables are never defined, so colors resolve to nothing and components look unstyled. Wrap the app root (or the preview/iframe) in a provider.
- Composing class names with template strings or `? :` concatenation instead of `mergeClasses` — you lose Griffel's deterministic ordering, so conditional overrides stop working.
- Using a raw CSS shorthand (`padding: '10px'`) alongside a longhand override class: use `shorthands.padding(...)` / `shorthands.margin(...)`, which expand to longhands and merge predictably.
- Reaching for `colorPalette*` tokens in component UI: use semantic tokens (`colorNeutral*`, `colorBrand*`, `colorCompoundBrand*`, `colorStatus*`) so themes and high contrast stay correct; reserve palette tokens for data visualization.
- Expecting `makeStaticStyles` to be scoped — it emits global CSS; keep it for `body`/`@font-face`-level rules and use `makeStyles`/`makeResetStyles` for component styles.

**Referenced components**: FluentProvider, Card, Text, Button

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
