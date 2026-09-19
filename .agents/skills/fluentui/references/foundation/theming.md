# Theming System

> **Category**: foundation

## 1. The mental model: tokens → theme → CSS variables → components

Fluent UI v9 theming is built from four layers. Understanding them once makes every other theming task obvious.

| Layer | What it is | Where you meet it |
| --- | --- | --- |
| **Design tokens** | Semantic design decisions with stable names: `colorBrandBackground`, `fontSizeBase300`, `spacingHorizontalM`, `borderRadiusLarge`, `shadow4`, `durationNormal`. | the `tokens` object, CSS variables |
| **Theme object** | A plain JavaScript object that gives every token a literal value: `theme.colorBrandBackground === '#0f6cbd'`. | `webLightTheme`, `createLightTheme(brand)` |
| **CSS custom properties** | The provider writes each token as a CSS variable (`--colorBrandBackground: #0f6cbd`) onto its root element. | `var(--colorBrandBackground)` in your CSS |
| **Components** | Every v9 component styles itself with `var(--token)` references, so it simply picks up whatever variables are in scope. | `Button`, `Badge`, `Dialog`, `Menu`, … |

Consequences worth internalising:

- **Re-theming is a data change, not a component change.** You never restyle components to change a brand colour; you hand a new theme object to the provider.
- **Themes are scoped by the DOM.** Because they are CSS custom properties, nesting a `FluentProvider` redefines variables for that subtree only and leaves the rest of the app untouched.
- **Themes are partial-friendly.** A theme that defines three tokens inherits every other token from the nearest ancestor provider through normal CSS cascade.
- **No re-render is required to switch themes.** Style rules already contain `var(...)` references; the browser repaints with the new values.

### 1.1 `tokens` versus a theme object

```tsx
import { tokens, webLightTheme } from '@fluentui/react-components';

tokens.colorBrandBackground;        // 'var(--colorBrandBackground)'
webLightTheme.colorBrandBackground; // '#0f6cbd'
```

- `tokens.*` always returns a **CSS `var()` reference**. Use it inside style declarations: it stays live across theme changes and costs nothing at runtime.
- A **theme object** (`webLightTheme`, or the result of `createLightTheme(...)`) contains **literal values**. You need it when you must reason about concrete colours in JavaScript (contrast checks, canvas, generating CSS for another document) or when you are defining a new theme.

Rule of thumb: **use `tokens` in styles; use theme objects when defining or computing a theme.**

## 2. What is inside a theme

### 2.1 Token groups

| Token group | Example token | Grouped path on a theme object | Notes |
| --- | --- | --- | --- |
| Color | `colorBrandBackground`, `colorNeutralForeground1` | flat on the theme: `theme.colorBrandBackground` | The largest group: neutral, brand, palette, status, focus and shadow colours |
| Font family | — (no flat token) | `theme.fontFamilies.base / monospace / numeric` | Only exposed through the theme object |
| Font size | `fontSizeBase300`, `fontSizeHero700` | `theme.fontSizes.base300` | Ramps: `base100`–`base600`, `hero700`–`hero1000` |
| Font weight | `fontWeightSemibold` | `theme.fontWeights.semibold` | `regular`, `medium`, `semibold`, `bold` |
| Line height | `lineHeightBase300` | `theme.lineHeights.base300` | Pairs 1:1 with font sizes |
| Spacing | `spacingHorizontalM`, `spacingVerticalS` | `theme.spacing.horizontal.m` | Steps: `none`, `xxs`, `xs`, `s`, `m`, `l`, `xl`, `xxl`, `xxxl` |
| Border radius | `borderRadiusMedium`, `borderRadiusCircular` | `theme.borderRadius.medium` | `none`, `small`, `medium`, `large`, `xLarge`, `circular` |
| Stroke width | `strokeWidthThin`, `strokeWidthThicker` | `theme.strokeWidths.thin` | `thin`, `thick`, `thicker` |
| Shadow | `shadow2` … `shadow64` (+ `-Brand` variants) | `theme.shadows.shadow4` | Elevation ramp for popups and overlays |
| Motion | `durationNormal`, `curveEasyEase` | `theme.durations.normal`, `theme.curves.easyEase` | Durations `ultraFast`→`ultraSlow`, plus easing curves |
| Typography | `theme.typography.body1`, `theme.typography.caption1` | composite style objects | Bundles family + size + weight + line height |

### 2.2 Color token families

- **Neutral** – `colorNeutralForeground1…4`, `colorNeutralBackground1…6`, `colorNeutralStroke1…3`, plus interactive variants (`…Hover`, `…Pressed`, `…Selected`, `…Disabled`, `…Brand`).
- **Brand** – `colorBrandBackground`, `colorBrandBackground2`, `colorBrandForeground1/2`, `colorBrandForegroundLink`, `colorBrandStroke1/2`, `colorCompoundBrandBackground` (used by checked Checkbox/Switch surfaces).
- **Palette** – raw hue families for data visualization and status accents: `colorPaletteRed*`, `colorPaletteGreen*`, `colorPaletteYellow*`, and so on, each with `Background/Border/Foreground` roles.
- **Status** – `colorStatusSuccess*`, `colorStatusWarning*`, `colorStatusDanger*`, `colorStatusInfo*` with `Background/Foreground/Border` roles plus index variants.
- **Focus and shadow** – `colorStrokeFocus1/2` (the visible focus ring) and `colorNeutralShadowAmbient` / `colorNeutralShadowKey` (the colors that build elevation shadows).

The naming pattern is `<subject><role><variant><index>` (for example `colorBrandBackgroundHover`). Learn the pattern once and you can guess most token names correctly.

## 3. Applying a theme with `FluentProvider`

The provider is exported as `FluentProvider` from `@fluentui/react-components` (package-level docs and older examples refer to it as `FluentProvider`). It renders a root element, generates a CSS class containing the theme's custom properties, injects the class definition as a style tag, and applies the class to its root element. Every descendant inherits the variables.

FluentProvider props that matter for theming:

| Prop | Type | Theming purpose |
| --- | --- | --- |
| `theme` | `PartialTheme` | The theme for this subtree. Any token you omit cascades from the parent provider. At the app root, omitting the prop gives you the default web light theme. |
| `dir` | `'ltr' \| 'rtl'` | Writing direction for the subtree. Not a token — it mirrors layout, logical CSS properties and component behaviour such as arrow-key navigation. |
| `targetDocument` | `Document` | The document into which the provider's generated theme styles are injected. Required when you render into an iframe or another document through `Portal`. |
| `applyStylesToPortals` | `boolean` (default `true`) | Applies the provider's classes to portal containers so overlay content (Dialog, Popover, Menu, Tooltip) stays themed. |
| `customStyleHooks_unstable` | `FluentProviderCustomStyleHooks` | An unstable escape hatch keyed by component style hooks (`use*Styles_unstable`), letting you inject extra classes/overrides at the component level. Not a token API. |
| `overrides_unstable` | `OverridesContextValue_unstable` | Miscellaneous provider-level behaviour overrides (for example default input appearance). Not a theming surface — prefer `theme`. |

Notes:

- A theme object produced by `createLightTheme` / `createDarkTheme` is a `Theme`, which is assignable to the `PartialTheme` prop, so shipped and custom themes both drop straight in.
- Nested providers are the supported way to do **scoped theming** (per section, per surface, per embedded app).
- The provider is also how you theme content that escapes the React tree: portals via `applyStylesToPortals`, other documents via `targetDocument`.

## 4. Shipped themes and brand ramps

All of the following are imported from `@fluentui/react-components`:

| Export | What it is | Typical use |
| --- | --- | --- |
| `webLightTheme` | Fluent 2 web light palette | Default theme for most apps |
| `webDarkTheme` | Fluent 2 web dark palette | Dark mode / theme toggles |
| `teamsLightTheme` | Teams light palette | Apps that must match Microsoft Teams |
| `teamsDarkTheme` | Teams dark palette | Teams dark mode |
| `teamsHighContrastTheme` | System-colour, high-contrast palette | Users who request high contrast |
| `brandWeb` | `BrandVariants` ramp behind the web themes | Starting point for a custom brand |
| `brandTeams` | `BrandVariants` ramp behind the Teams themes | Starting point for a Teams-aligned brand |
| `createLightTheme` / `createDarkTheme` / `createTeamsDarkTheme` | Theme factories taking a `BrandVariants` ramp | Producing a light + dark pair for your brand |
| `createHighContrastTheme` | Builds a system-colour theme | Programmatic high-contrast support |

The standalone `@fluentui/tokens` package ships the same token types, the shipped themes and helper utilities such as `themeToTokensObject` (converts a theme into an object of `var()` references for styling libraries that do not understand Fluent themes) and `createShadowTokens` (re-derives the shadow ramp from a shadow colour).

## 5. Creating a custom theme

### 5.1 Brand ramps

A `BrandVariants` ramp is a 16-stop object keyed **10 → 160**. Stop 10 is the darkest colour and 160 the lightest; the numeric keys are ordered and each step should keep the same hue while moving monotonically in lightness.

How the stops are consumed (typical light-theme mapping):

- **10–60** — dark brand shades used for pressed states, brand text on light backgrounds, and dark brand surfaces.
- **70–90** — the primary brand colour: solid brand backgrounds and the main brand foreground.
- **100–160** — light tints used for subtle brand backgrounds, hover tints and brand strokes.

In the dark theme the roles invert: the light stops provide the solid brand surfaces and the dark stops provide the subtle backgrounds, which is why you should always generate **both** themes from the same ramp instead of hand-picking colors per mode.

Use the Fluent 2 theme designer (linked from the Fluent UI React docs) to generate a compliant ramp rather than eyeballing sixteen hex values — it also reports the contrast ratios of the resulting brand tokens.

### 5.2 Theme factories

```tsx
createLightTheme(brand);          // Theme — light palette for the ramp
createDarkTheme(brand);           // Theme — matched dark palette
createTeamsDarkTheme(brand);      // Theme — Teams-flavoured dark palette
createHighContrastTheme();        // Theme — system colours, no brand input
```

### 5.3 Deriving a variant from a base theme

Because a theme is plain data, you can derive variants by spreading. Always spread the *group* you are modifying, never replace it:

```tsx
const compact = {
  ...webLightTheme,
  borderRadius: { ...webLightTheme.borderRadius, medium: '2px' },
};
```

Replacing `borderRadius` outright (`{ borderRadius: { medium: '2px' } }`) drops every other radius token and silently breaks pills, circles and large surfaces.

## 6. Consuming tokens in your own styles

You have four practical options, in order of preference:

1. **`tokens` inside Fluent's styling engine** — `makeStyles`, `mergeClasses` and `tokens` are all re-exported from `@fluentui/react-components`, so component styles stay in one system.
2. **Raw CSS custom properties** — `var(--colorBrandBackground)`. The variable name is exactly the token name with a `--` prefix, so plain `.css` files, CSS modules or any other styling solution can participate in theming.
3. **Literal values from a theme object** — `webLightTheme.colorBrandBackground` when you genuinely need a concrete value (contrast math, canvas rendering, generating a stylesheet for a third-party widget).
4. **Composite typography styles** — `theme.typography.body1` and friends when you want the full font family + size + weight + line height combination in one value.

Avoid hard-coded hex values in your own styles. They are the single most common cause of "dark mode broke my component".

## 7. Scoping themes

Because theming is CSS-variable based, scoping is just nesting:

```tsx
<FluentProvider theme={webLightTheme}>      {/* app default */}
  <Button appearance="primary">Global primary</Button>
  <FluentProvider theme={{ colorBrandBackground: tokens.colorPaletteRedBackground3 }}>
    <Button appearance="primary">Danger-zone primary</Button>
  </FluentProvider>
</FluentProvider>
```

The inner provider redefines only the tokens you list; everything else — neutrals, typography, spacing, shadows — cascades from the outer provider. This is the recommended way to build section-level accents, embedded sub-apps, or a preview pane that renders a different theme next to the host UI.

Guidance: use **one provider per theme boundary**, not one per component. Each provider adds a wrapper element, a CSS class and a style tag.

## 8. Portals, iframes and other documents

- **Portals.** `Dialog`, `Popover`, `Menu` and `Tooltip` render their surfaces into a portal, which by default lives outside the provider's DOM subtree. `applyStylesToPortals` (default `true`) applies the provider's theme class to the portal container so the surface stays themed. Only turn it off if the portal target is already covered by the same class.
- **Iframes / separate documents.** When you render themed content into another document — typically through `Portal mountNode` — pass that document to `targetDocument`. The provider then injects its generated theme styles into that document; without it, the CSS class exists only in the host document and the iframe content renders unstyled.
- **Shadow DOM.** Content rendered inside a shadow root does not inherit custom properties from outside the boundary. Mount the provider *inside* the shadow root so the variables are defined where they are consumed.

## 9. Direction (RTL)

`dir` lives on the provider, not in the theme, because direction is a layout concern rather than a colour/type decision:

```tsx
<FluentProvider theme={webLightTheme} dir="rtl">…</FluentProvider>
```

Components use logical CSS properties, so padding, borders and icon placement mirror automatically. Direction-sensitive icons (chevrons, arrows) should be mirrored in your own assets, and the same `dir` value should be used for every nested provider that renders portals.

## 10. Performance rules of thumb

- **Create themes outside render.** Module scope or `React.useMemo`. A new theme object identity makes the provider generate a new CSS class and style tag.
- **Prefer `tokens` in static styles.** Style objects built once with `var()` references need no updates when the theme changes.
- **Don't nest a provider for every component.** Each boundary costs a DOM element, a class and a style tag.
- **Ship one theme per mode.** Generate light and dark from the same ramp once, then toggle between two stable objects instead of rebuilding themes on every render.

## 11. Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Overlay (Dialog/Popover/Menu/Tooltip) looks unthemed | `applyStylesToPortals` disabled, or the portal target lives outside the provider and outside a themed document | Leave `applyStylesToPortals` at its default, or move the provider so the portal target is inside it |
| Content inside an iframe renders unstyled | The theme styles were never injected into that document | Pass `targetDocument` to `FluentProvider` |
| Dark mode leaves light-coloured patches | Hard-coded hex/rgb values in your own styles or third-party CSS | Replace them with `tokens.*` or `var(--*)` |
| Only the solid brand colour changed; hover/pressed/stroke still look wrong | A partial theme overrode one token instead of the whole brand ramp | Provide the full ramp to `createLightTheme`/`createDarkTheme` |
| All radius values collapsed to one value | A theme group was replaced instead of spread (`borderRadius: { medium: '2px' }`) | Spread the base group: `{ ...base.borderRadius, medium: '2px' }` |
| `tokens.colorBrandBackground` logs `var(--colorBrandBackground)` instead of a hex value | `tokens` holds `var()` references by design | Read the value from a theme object (`webLightTheme.colorBrandBackground`) when you need a literal |
| Style tags accumulate / theme flickers | Themes constructed inline in render | Hoist to module scope or memoize |

## 12. Accessibility

- Every shipped theme meets Fluent's contrast targets; **custom ramps are your responsibility**. Validate text-on-brand combinations in both light and dark themes (4.5:1 for body text, 3:1 for large text and for UI component boundaries, states and focus indicators).
- Never communicate state by colour alone. Pair colour tokens with icons or text (for example a `Badge` or `MessageBar` that carries both a colour and a label).
- Focus visibility relies on `colorStrokeFocus1` / `colorStrokeFocus2`. If you override strokes, keep the focus ring at least 2px and clearly distinct from the surrounding surface.
- Provide and test a high-contrast path (`teamsHighContrastTheme`, or your own `createHighContrastTheme()` result) and verify the UI under forced-colours mode.
- Re-check direction: with `dir="rtl"` confirm that mirrored layout does not hide or clip content, and that any directional iconography matches.

## 13. Quick reference

1. Wrap the app: `<FluentProvider theme={webLightTheme}>`.
2. Brand it: build a 16-stop `BrandVariants` ramp, then `createLightTheme(ramp)` + `createDarkTheme(ramp)` once at module scope.
3. Style your own UI with `tokens.*` (or `var(--tokenName)` in plain CSS) — never with raw colours.
4. Scope overrides by nesting a `FluentProvider` with a partial theme.
5. Keep portals themed (`applyStylesToPortals`) and other documents themed (`targetDocument`).
6. Verify contrast and high contrast for every custom ramp you ship.

## Key Takeaways

- A v9 theme is plain data: an object mapping token names to literal values. Provider turns it into CSS custom properties on its root element, and every component reads those variables, so changing a theme requires no component changes and no re-render logic.
- Use tokens (var() references) in your own styles instead of hard-coded colours, so your UI automatically follows light, dark, high-contrast and brand themes. Read literal values from theme objects only when you need concrete colours in JavaScript.
- Custom brands are a 16-stop BrandVariants ramp (10 darkest to 160 lightest) fed to createLightTheme and createDarkTheme; always generate both modes from the same ramp instead of overriding single tokens.
- Themes are DOM-scoped: nesting a Provider applies a partial override for that subtree while everything else cascades from the ancestor provider, which is the recommended pattern for section accents and embedded sub-apps.
- Portals and other documents need explicit theming through the provider: applyStylesToPortals keeps Dialog/Popover/Menu/Tooltip content themed, and targetDocument injects the theme styles into iframes or any other document.
- Build themes once at module scope or memoize them. A new theme object identity makes Provider generate a new CSS class and style tag.

## Examples

### Apply a shipped theme at the app root

Wraps an app in Provider with webLightTheme. Every Fluent component inside reads its colours, typography, spacing, radius and shadows from the theme applied by the nearest provider — swapping the theme swaps the rendering with no component changes.

```tsx
import * as React from 'react';
import { FluentProvider, Button, Badge, Text, webLightTheme } from '@fluentui/react-components';

export default function App() {
  return (
    // Everything inside Provider picks up the theme of the nearest Provider.
    <FluentProvider theme={webLightTheme}>
      <div style={{ display: 'grid', rowGap: 12, padding: 24 }}>
        <Text size={500} weight="semibold">
          Themed with Provider
        </Text>
        <Text>
          Replace webLightTheme with webDarkTheme (or your own theme) and this
          UI re-colours itself - no component code changes.
        </Text>
        <div style={{ display: 'flex', alignItems: 'center', columnGap: 8 }}>
          <Button appearance="primary">Save</Button>
          <Button appearance="secondary">Cancel</Button>
          <Badge appearance="filled" color="brand">
            New
          </Badge>
        </div>
      </div>
    </FluentProvider>
  );
}
```

### Custom brand ramp with matching light and dark themes

Defines a 16-stop BrandVariants ramp (10 = darkest, 160 = lightest, one consistent hue) and generates a light and a dark theme from it. Both themes are created once at module scope so the Provider does not regenerate its CSS class on every render. A Switch toggles between the two themes.

```tsx
import * as React from 'react';
import { FluentProvider, Button, Switch, createLightTheme, createDarkTheme, type BrandVariants } from '@fluentui/react-components';

// A brand ramp is 16 stops: 10 is the darkest, 160 the lightest.
// Keep a single hue and move monotonically in lightness.
const contosoBrand: BrandVariants = {
  10: '#0a0410',
  20: '#1a0b2e',
  30: '#280f45',
  40: '#34125b',
  50: '#3f1472',
  60: '#4b1788',
  70: '#5a1fa3',
  80: '#6b2dbd',
  90: '#8043cf',
  100: '#9659df',
  110: '#a973ea',
  120: '#bf91f2',
  130: '#d3b2f7',
  140: '#e3cefa',
  150: '#f1e6fc',
  160: '#f9f4fe',
};

// Build the themes once, at module scope. A new theme object identity forces
// Provider to generate a new CSS class and style tag.
const contosoLightTheme = createLightTheme(contosoBrand);
const contosoDarkTheme = createDarkTheme(contosoBrand);

export default function App() {
  const [isDark, setIsDark] = React.useState(false);

  return (
    <FluentProvider theme={isDark ? contosoDarkTheme : contosoLightTheme}>
      <div style={{ display: 'grid', rowGap: 12, padding: 24 }}>
        <Switch
          checked={isDark}
          onChange={(_, data) => setIsDark(data.checked)}
          label={isDark ? 'Dark theme' : 'Light theme'}
        />
        <Button appearance="primary">Branded primary action</Button>
        <Button appearance="outline">Branded outline action</Button>
      </div>
    </FluentProvider>
  );
}
```

### Scoped brand override with a nested Provider

Shows a partial theme: the inner Provider redefines only a few brand tokens, while neutrals, typography, spacing, radius and shadows cascade from the outer webLightTheme. This is the supported way to build section-level accents without forking the whole theme.

```tsx
import * as React from 'react';
import { FluentProvider, Button, MessageBar, tokens, webLightTheme } from '@fluentui/react-components';

// A partial theme only redefines the tokens it lists. `tokens.*` yields
// var() references, so these overrides follow whatever theme is active.
const dangerZoneTheme = {
  colorBrandBackground: tokens.colorPaletteRedBackground3,
  colorBrandForeground1: tokens.colorPaletteRedForeground1,
  colorBrandStroke1: tokens.colorPaletteRedBackground3,
};

export default function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <div style={{ display: 'grid', rowGap: 12, padding: 24 }}>
        <Button appearance="primary">Global primary</Button>

        <FluentProvider theme={dangerZoneTheme}>
          <div style={{ display: 'grid', rowGap: 12 }}>
            <MessageBar intent="warning">
              This section uses a scoped brand override; everything else still
              comes from webLightTheme.
            </MessageBar>
            <Button appearance="primary">Scoped primary</Button>
          </div>
        </FluentProvider>
      </div>
    </FluentProvider>
  );
}
```

### Building component styles from tokens

Uses tokens (re-exported from @fluentui/react-components) together with makeStyles to author custom surfaces that automatically follow the active theme. Every colour, radius, shadow, spacing and typography value is a var() reference resolved by the Provider.

```tsx
import * as React from 'react';
// `tokens` and `makeStyles` are re-exported from @fluentui/react-components.
import { makeStyles, tokens, Button, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  panel: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow4,
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
  },
  highlight: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    borderRadius: tokens.borderRadiusMedium,
    padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalS}`,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase200,
  },
});

export default function TokenDrivenPanel() {
  const styles = useStyles();

  return (
    <div className={styles.panel}>
      <Text size={400} weight="semibold">
        Styles built from tokens follow the active theme
      </Text>
      <span className={styles.highlight}>
        colorBrandForeground1 on colorBrandBackground2
      </span>
      <div>
        <Button appearance="primary" size="small">
          Action
        </Button>
      </div>
    </div>
  );
}
```

### Plain CSS consuming the provider's CSS variables

The Provider writes every token as a CSS custom property named after the token (token name plus a -- prefix) on its root element, so any descendant can consume them from ordinary stylesheets with no build-time coupling to Fluent.

```css
/* app.css
   The custom properties are written by Provider onto its root element, so any
   descendant can consume them. Variable names are token names with a -- prefix. */

.app-panel {
  background-color: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  border: var(--strokeWidthThin) solid var(--colorNeutralStroke1);
  border-radius: var(--borderRadiusLarge);
  box-shadow: var(--shadow4);
  padding: var(--spacingVerticalL) var(--spacingHorizontalL);
}

.app-panel__title {
  font-size: var(--fontSizeBase400);
  font-weight: var(--fontWeightSemibold);
  line-height: var(--lineHeightBase400);
  color: var(--colorBrandForeground1);
}

.app-panel__badge {
  background-color: var(--colorBrandBackground2);
  color: var(--colorBrandForeground2);
  border-radius: var(--borderRadiusCircular);
  padding: var(--spacingVerticalXXS) var(--spacingHorizontalS);
}
```

### Theming content rendered into an iframe

targetDocument injects the provider's generated theme styles into another document, and Portal mounts children into that document. Together they let preview panes, email editors and embedded surfaces render fully themed Fluent content outside the host document.

```tsx
import * as React from 'react';
import { FluentProvider, Portal, Button, webDarkTheme } from '@fluentui/react-components';

export default function IframeThemedPreview() {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [targetDocument, setTargetDocument] = React.useState<Document | null>(null);

  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <iframe
        ref={iframeRef}
        title="Themed preview"
        style={{ width: '100%', height: 200, border: 'none' }}
        onLoad={() => setTargetDocument(iframeRef.current?.contentDocument ?? null)}
      />

      {targetDocument && (
        // targetDocument injects the theme styles into the iframe document;
        // Portal then renders the children into that same document.
        <FluentProvider theme={webDarkTheme} targetDocument={targetDocument}>
          <Portal mountNode={targetDocument.body}>
            <div style={{ padding: 16 }}>
              <Button appearance="primary">Themed inside the iframe</Button>
            </div>
          </Portal>
        </FluentProvider>
      )}
    </div>
  );
}
```

### Memoized theme variant derived from a base theme

Shows the safe way to derive a theme: spread the base theme and spread any token group you modify, then memoize the result. Replacing a group (borderRadius: { medium: '2px' }) would drop every other radius token, and building the theme inline in render would regenerate the provider's CSS on every pass.

```tsx
import * as React from 'react';
import { FluentProvider, Button, Switch, createLightTheme, createDarkTheme, type BrandVariants, type Theme } from '@fluentui/react-components';

const brand: BrandVariants = {
  10: '#020305',
  20: '#0b1a2a',
  30: '#102a45',
  40: '#143a5f',
  50: '#164a7a',
  60: '#175a96',
  70: '#186bb3',
  80: '#1a7dcf',
  90: '#2f92e0',
  100: '#4ba4ea',
  110: '#6cb6f0',
  120: '#93c8f5',
  130: '#b6d9f8',
  140: '#d3e8fb',
  150: '#eaf4fd',
  160: '#f6fbff',
};

const light = createLightTheme(brand);
const dark = createDarkTheme(brand);

/** Returns a stable theme object for the requested mode and density. */
function useAppTheme(mode: 'light' | 'dark', compact: boolean): Theme {
  const base = mode === 'dark' ? dark : light;

  return React.useMemo(() => {
    if (!compact) {
      return base;
    }

    // Spread the base group - never replace it, or every other radius token
    // disappears from the theme.
    return {
      ...base,
      borderRadius: { ...base.borderRadius, medium: '2px' },
    };
  }, [base, compact]);
}

export default function App() {
  const [isDark, setIsDark] = React.useState(false);
  const [compact, setCompact] = React.useState(false);
  const theme = useAppTheme(isDark ? 'dark' : 'light', compact);

  return (
    <FluentProvider theme={theme}>
      <div style={{ display: 'grid', rowGap: 12, padding: 24 }}>
        <Switch
          checked={isDark}
          onChange={(_, data) => setIsDark(data.checked)}
          label="Dark"
        />
        <Switch
          checked={compact}
          onChange={(_, data) => setCompact(data.checked)}
          label="Compact radius"
        />
        <Button appearance="primary">Themed button</Button>
      </div>
    </FluentProvider>
  );
}
```

## Pitfalls

- Hard-coding hex, rgb or hsl values in your own styles instead of using tokens or var(--tokenName). The result looks fine in the default theme and breaks in dark mode, high contrast and custom brand themes.
- Constructing themes inside render (<Provider theme={createLightTheme(brand)}>). Each pass produces a new object identity, forcing the provider to generate a fresh CSS class and style tag, which causes churn and accumulating styles.
- Replacing a token group instead of spreading it: theme={{ borderRadius: { medium: '2px' } }} drops every other radius token. Always write { ...base.borderRadius, medium: '2px' }.
- Expecting tokens.colorBrandBackground to be a colour string. It is 'var(--colorBrandBackground)'; use a theme object (for example webLightTheme.colorBrandBackground) when you need a literal value.
- Re-branding by overriding only colorBrandBackground in a partial theme, leaving hover, pressed, selected, stroke and foreground tokens on the old brand. Provide a full ramp to createLightTheme/createDarkTheme instead.
- Forgetting that overlays render in portals and that other documents are separate style scopes. Overlays need applyStylesToPortals (default true) and iframe content needs targetDocument on the Provider.
- Using palette or ramp values (for example colorPaletteRedBackground3) as everyday UI colours rather than semantic tokens (colorStatusDangerBackground3, colorBrandBackground). Palette values do not adapt to theme or contrast changes the way semantic tokens do.
- Nesting a Provider per component. Every boundary costs a wrapper element, a CSS class and a style tag; keep one provider per theme boundary.

## Accessibility

Theming directly determines contrast and focus visibility, so treat it as an accessibility surface. Fluent's shipped themes (webLightTheme, webDarkTheme, teamsLightTheme, teamsDarkTheme) are validated for contrast, but any custom brand ramp is your responsibility: verify text-on-brand combinations at 4.5:1 for body text and 3:1 for large text, and ensure UI component boundaries, states and focus indicators keep at least 3:1 against adjacent colours, in both the light and dark themes generated from the ramp. Never encode meaning in colour alone — pair a colour token with an icon or text, for example a Badge or MessageBar whose intent is carried by both colour and label. Focus visibility depends on colorStrokeFocus1 and colorStrokeFocus2; if you override stroke tokens, keep the focus ring clearly distinguishable (Fluent renders a 2px outline) and never remove it. Provide a high-contrast path for users who request it — teamsHighContrastTheme or a theme built from createHighContrastTheme() — and test the UI under forced-colours mode, remembering that system colours override theme colours there. Finally, re-check direction: with dir="rtl" on the Provider, confirm that mirrored layouts do not clip content and that directional icons are flipped consistently.

**Referenced components**: Provider, Button, Switch, Text, Badge, MessageBar, Portal

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
