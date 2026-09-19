# Styling with Griffel

> **Category**: foundation

# Styling with Griffel

Griffel is the CSS-in-JS engine that powers every Fluent UI v9 component. `Button`, `Card`, `Input`, `Dialog` — all of them are styled with it — and it is also the recommended way to style your own components so they participate in the same theming, RTL, and specificity rules as the library.

Griffel is **atomic CSS-in-JS**:

- You author plain TypeScript style objects.
- Griffel splits every declaration into its own reusable class, so `color: tokens.colorNeutralForeground1` becomes one class shared by the whole application.
- All rules are inserted into a single stylesheet with a **deterministic order**, so conflict resolution never depends on the order of the `class` attribute.

## The API at a glance

| API | Import | What it does |
| --- | --- | --- |
| `makeStyles` | `@griffel/react` | Declares a set of named style rules; returns a hook that returns an object of class names |
| `makeResetStyles` | `@griffel/react` | Declares a single rule; returns a function that returns one class name |
| `mergeClasses` | `@griffel/react` | Merges class names, removes duplicates and resolves conflicts using Griffel's insertion order |
| `shorthands` | `@griffel/react` | Typed helpers for shorthands such as `border`, `padding`, `margin`, `inset` |
| `tokens` | `@fluentui/react-components` | Fluent design tokens; every token resolves to a CSS custom property with a fallback |
| `createDOMRenderer`, `RendererProvider`, `renderToStyleElements` | `@griffel/react` | Custom renderers and server-side rendering support |
| `makeStaticStyles` | `@griffel/react` | Global, non-atomic CSS such as `@font-face` and document resets |

## makeStyles: declaring styles

`makeStyles` accepts an object whose keys are rule names and whose values are CSS-in-JS objects. It returns a **hook**; that hook returns the same keys mapped to generated class name strings.

Four rules to live by:

1. Call `makeStyles` at **module scope**, never inside a component. Style objects must be created once.
2. Call the returned hook at the **top level** of your component — it is a real React hook and must not be called conditionally or in loops.
3. Use the returned class names on `className`, or on a slot object when a component exposes slots (for example `Input` exposes `root`, `input`, `contentBefore`, `contentAfter`).
4. Pass explicit units (`'12px'`, `'1.5rem'`) or design tokens for lengths. Use bare numbers only for genuinely unitless properties such as `opacity`, `flexGrow`, or `zIndex`.

### Nested selectors, at-rules and keyframes

Inside a style rule you can nest keys that are pseudos, at-rules, or selectors starting with `&`:

- Pseudos: `':hover'`, `':active'`, `':focus-visible'`, `':disabled'`, `'::placeholder'`, `'::before'`.
- Descendant/child selectors: `'& .icon'`, `'& > span'`, `'&[disabled]'`.
- At-rules: `'@media (min-width: 720px)'`, `'@media (prefers-reduced-motion: reduce)'`, `'@media (forced-colors: active)'`, `'@supports (display: grid)'`.
- Keyframes: `animationName: { from: { opacity: 0 }, to: { opacity: 1 } }` — Griffel hoists the keyframes and generates the `@keyframes` rule for you.

A key that does not start with `&`, `:` or `@` is not a valid nested selector; write `'& .icon'`, not `'.icon'`.

### Deterministic ordering: why longhands always win

Because each declaration becomes its own class, two classes can target the same property. Griffel records an insertion index for every generated class:

- `mergeClasses` uses those indexes so the **last conflicting class wins** — the CSS-in-JS equivalent of cascade order.
- Griffel applies a built-in property priority so longhands always beat shorthands. `margin` can never silently override `marginInlineStart`, regardless of the order you listed properties in, and you never need `!important`.

Practical consequence: you do **not** need to worry about which class the browser receives last in the `class` attribute; the stylesheet order is what matters and Griffel manages it.

## mergeClasses: composing and overriding

`mergeClasses` is the only supported way to combine class names produced by Griffel. It:

1. Drops falsy values, so `condition && styles.x` is safe.
2. Removes duplicates.
3. Resolves conflicts so the last class in the argument list wins.

Use it whenever you combine your own classes with a class coming from a component, and always let a consumer-provided `className` come **last** so callers can override anything.

Do not use template strings, `clsx`, `classnames`, or manual `join(' ')`. Those helpers know nothing about atomic class precedence, so overrides become unpredictable.

## makeResetStyles: single-class base styles

`makeResetStyles` produces exactly **one class** for the whole rule (all declarations go into a single rule, not atomically split). It is intended for resets and base layers — the styles that must not be fought over by other atomic classes, such as `box-sizing`, inherited `font`, `margin` removal, `cursor`, and long-lived pseudo-state styling.

It returns a function that returns a class name string, and it is usually called during render like a hook: `const rootClassName = useRootClassName();`. Because it is a single class it also composes cleanly as the first argument of `mergeClasses`.

Rule of thumb: use `makeResetStyles` for the base layer of a component or app shell, and `makeStyles` for everything you want to be atomic, overridable and reusable.

## shorthands: typed CSS shorthands

`shorthands` provides typed helpers that expand into individual longhands, which is what keeps atomic conflict resolution working correctly.

| Shorthand | Example |
| --- | --- |
| `border` | `...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1)` |
| `borderColor` | `...shorthands.borderColor(tokens.colorBrandStroke1)` |
| `borderRadius` | `...shorthands.borderRadius(tokens.borderRadiusLarge)` |
| `borderWidth` / `borderStyle` | `...shorthands.borderWidth(tokens.strokeWidthThin)` |
| `padding` | `...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM)` |
| `margin` | `...shorthands.margin('0', 'auto')` |
| `inset` | `...shorthands.inset('0')` |
| `overflow` | `...shorthands.overflow('hidden')` |
| `textDecoration` | `...shorthands.textDecoration('underline')` |
| `transition` | `...shorthands.transition('background-color', tokens.durationNormal)` |

Other available shorthands include `borderTop`, `borderRight`, `borderBottom`, `borderLeft`, `marginBlock`, `marginInline`, `paddingBlock`, `paddingInline`, `flex`, and `gridArea`. Because properties are always spread into your style object, always write `...shorthands.padding(...)` inside the rule.

## Design tokens: the theming backbone

Import tokens from `@fluentui/react-components` and use them instead of literal values:

- Every token compiles to a CSS custom property with a fallback, e.g. `var(--colorNeutralBackground1, #ffffff)`. This means the theme is resolved at **runtime by CSS variables**, not by JavaScript re-rendering. Changing the theme re-skins static CSS instantly.
- Token families: colors (`colorNeutral*`, `colorBrand*`, `colorPalette*`, `colorStatus*`, `colorStrokeFocus*`), spacing (`spacingHorizontal*`, `spacingVertical*`), radii (`borderRadius*`), strokes (`strokeWidth*`), typography (`fontFamily*`, `fontSizeBase*`, `lineHeightBase*`, `fontWeight*`), elevation (`shadow*`), and motion (`duration*`, `curve*`).
- Tokens are contrast-tuned and high-contrast aware, so they are also the accessibility-safe choice.

## RTL and direction-aware layout

Fluent UI flips direction with the `dir` prop on `Provider`. For your own CSS to follow, author with **logical properties**:

- `marginInlineStart` / `marginInlineEnd` instead of `marginLeft` / `marginRight`.
- `insetInlineStart` instead of `left`.
- `textAlign: 'start'` instead of `'left'`.
- `marginInline: 'auto'` for centering.

Avoid `float`, absolute `left`/`right`, and background-position tricks that assume left-to-right reading order.

## Theming and overriding component styles

There are three levels of customization, in order of preference:

1. **Token level (global):** pass a *partial* theme object to `Provider theme={...}`. Any token you set becomes the new value for the whole subtree — every component and every one of your `tokens.*` references picks it up, including portaled surfaces when `applyStylesToPortals` is enabled.
2. **Component level:** every Fluent UI component accepts `className`. Merge your class with the component's own class using `mergeClasses` and keep the consumer class last.
3. **Deep/internals level:** `customStyleHooks_unstable` on `Provider` lets you append a class to a component's internal state (for example its `root`) for every instance in the app. It is powerful and app-wide; treat it as an escape hatch and prefer levels 1 and 2.

Portals deserve a special mention: `Popover`, `Menu`, `Dialog`, `Tooltip` and friends render their surfaces outside your DOM subtree. The `applyStylesToPortals` prop on `Provider` is what keeps theme and direction variables applied to those portals — leave it enabled unless you have a very specific reason not to.

## Server-side rendering

Griffel renders styles into a renderer instance. For SSR, create a renderer without a document on the server, wrap your tree in `RendererProvider`, and emit the collected rules as `<style>` elements with `renderToStyleElements(renderer)`. On the client, the renderer is created with the real `document` so that hydration can reuse the same renderer instance.

## Build-time compilation (AOT)

Fluent UI v9 ships with its own styles compiled **ahead of time** with Griffel (`@griffel/babel-preset` / `@griffel/webpack-loader`), which is why the library itself adds essentially no runtime style cost. You can opt your application into the same pipeline: the loader extracts `makeStyles` calls at build time into static CSS and leaves only a tiny runtime lookup. Application code does not otherwise change — the same `makeStyles` / `mergeClasses` API applies whether you compile at build time or at runtime.

## A practical checklist

- Styles at module scope, hooks at the top of components.
- `mergeClasses` for every composition, consumer `className` last.
- `tokens` for every color, spacing, radius and font value.
- Logical properties for anything directional.
- `makeResetStyles` for base layers, `makeStyles` for everything else.
- `:focus-visible` rings driven by `tokens.colorStrokeFocus2` and `tokens.strokeWidthThick`.
- `@media (forced-colors: active)` and `@media (prefers-reduced-motion: reduce)` handled explicitly.

## Key Takeaways

- Declare styles at module scope with makeStyles and call the generated hook at the top level of a component - the style object is created once and reused for every render.
- Always compose class names with mergeClasses, never with template strings or clsx/classnames; mergeClasses dedupes and resolves atomic conflicts so the last conflicting class wins.
- Use makeResetStyles for single-class base layers and style resets, and makeStyles for everything that should be split into reusable atomic classes.
- Never hard-code colors, spacing, radii or fonts: use tokens, which compile to CSS custom properties, so changing Provider's theme (or dir) instantly re-themes all your CSS without re-rendering styles.
- Author with logical properties (marginInlineStart, insetInlineStart, textAlign: 'start') so Provider's dir='rtl' mirrors your layout correctly.
- Griffel's deterministic insertion order means longhands always beat shorthands and the last merged class wins - there is no need for !important or specificity hacks.
- When you extend a component, put the consumer-provided className last in the mergeClasses call so callers can always override your defaults.
- Fluent UI's own packages are compiled with Griffel ahead of time; you can adopt the same build-time compilation for your app with the Griffel Babel preset or webpack loader and pay no runtime cost for styles.

## Examples

### makeStyles + tokens + shorthands in a real component

Declares atomic styles at module scope, calls the generated hook inside the component, consumes design tokens for every value, and merges an optional variant with mergeClasses.

```tsx
// NotificationCard.tsx
import * as React from 'react';
import { makeStyles, mergeClasses, shorthands } from '@griffel/react';
import { Badge, Button, Card, Text, tokens } from '@fluentui/react-components';

// 1. makeStyles is declared at module scope so the style object is created once.
const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: tokens.spacingHorizontalS,
  },
  title: {
    color: tokens.colorNeutralForeground1,
  },
  body: {
    color: tokens.colorNeutralForeground2,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    columnGap: tokens.spacingHorizontalXS,
  },
  compact: {
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
  },
});

export type NotificationCardProps = {
  title: string;
  description: string;
  compact?: boolean;
  onDismiss?: () => void;
};

export const NotificationCard: React.FC<NotificationCardProps> = props => {
  // 2. The generated hook is called at the top level of the component.
  const styles = useStyles();

  return (
    // 3. Classes are composed with mergeClasses, never with string concatenation.
    <Card className={mergeClasses(styles.root, props.compact && styles.compact)}>
      <div className={styles.header}>
        <Text size={300} weight='semibold' className={styles.title}>
          {props.title}
        </Text>
        <Badge appearance='tint' color='informative' size='small'>
          New
        </Badge>
      </div>
      <Text size={200} className={styles.body}>
        {props.description}
      </Text>
      <div className={styles.actions}>
        <Button appearance='subtle' size='small' onClick={props.onDismiss}>
          Dismiss
        </Button>
        <Button appearance='primary' size='small'>
          Open
        </Button>
      </div>
    </Card>
  );
};
```

### Composing and overriding classes with mergeClasses

Shows conditional classes, the last-one-wins rule, and how to let a consumer-supplied className always take precedence. Also includes the anti-pattern to avoid.

```tsx
// FilterPill.tsx
import * as React from 'react';
import { makeStyles, mergeClasses, shorthands } from '@griffel/react';
import { Button, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground2,
    transitionProperty: 'background-color, color',
    transitionDuration: tokens.durationFaster,
    transitionTimingFunction: tokens.curveEasyEase,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      color: tokens.colorNeutralForeground1,
    },
  },
  selected: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    ...shorthands.borderColor(tokens.colorTransparentStroke),
    ':hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
});

type FilterPillProps = React.ComponentProps<typeof Button> & {
  selected?: boolean;
};

export const FilterPill: React.FC<FilterPillProps> = ({ selected = false, className, ...rest }) => {
  const styles = useStyles();

  return (
    <Button
      appearance='outline'
      {...rest}
      aria-pressed={selected}
      className={mergeClasses(
        styles.root,
        // Falsy values are dropped, so `false` is a valid argument.
        selected && styles.selected,
        // The consumer className comes last, so it wins any conflict.
        className,
      )}
    />
  );
};

// ANTI-PATTERN - do not do this:
// className={`${styles.root} ${selected ? styles.selected : ''} ${className ?? ''}`}
// Template strings and `clsx`/`classnames` do not understand atomic class precedence,
// so the winning declaration becomes unpredictable.
```

### makeResetStyles with pseudos, media queries and keyframes

Builds a single-class base layer for a clickable tile, including hover, keyboard focus ring, responsive media queries, reduced motion, forced colors and Griffel keyframes, then composes it with an atomic makeStyles rule.

```tsx
// Tile.tsx
import * as React from 'react';
import { makeResetStyles, makeStyles, mergeClasses, shorthands } from '@griffel/react';
import { Text, tokens } from '@fluentui/react-components';

// A single class (not a set of atomic classes) - the base layer of the component.
const useTileBaseClassName = makeResetStyles({
  boxSizing: 'border-box',
  display: 'grid',
  placeItems: 'center',
  minHeight: '96px',
  ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
  ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
  ...shorthands.borderRadius(tokens.borderRadiusXLarge),
  backgroundColor: tokens.colorNeutralBackground1,
  color: tokens.colorNeutralForeground1,
  fontFamily: tokens.fontFamilyBase,
  cursor: 'pointer',
  transitionProperty: 'background-color, border-color, box-shadow, transform',
  transitionDuration: tokens.durationNormal,
  transitionTimingFunction: tokens.curveEasyEase,
  ':hover': {
    backgroundColor: tokens.colorNeutralBackground1Hover,
    ...shorthands.borderColor(tokens.colorNeutralStroke1Hover),
  },
  ':active': {
    transform: 'scale(0.99)',
  },
  ':focus-visible': {
    outlineStyle: 'solid',
    outlineWidth: tokens.strokeWidthThick,
    outlineColor: tokens.colorStrokeFocus2,
    outlineOffset: '2px',
  },
  '@media (min-width: 640px)': {
    minHeight: '120px',
  },
  '@media (prefers-reduced-motion: reduce)': {
    transitionDuration: '0.01ms',
    animationDuration: '0.01ms',
  },
  '@media (forced-colors: active)': {
    outlineStyle: 'solid',
    outlineColor: 'CanvasText',
  },
  ...shorthands.overflow('hidden'),
  // Griffel hoists keyframes and generates the @keyframes rule.
  animationName: {
    from: { opacity: 0, transform: 'translateY(4px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  animationDuration: tokens.durationSlow,
  animationTimingFunction: tokens.curveEasyEase,
  animationFillMode: 'both',
});

// Atomic styles used for the inner content, merged on top of the reset class.
const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: tokens.spacingVerticalXS,
    textAlign: 'center',
  },
  caption: {
    color: tokens.colorNeutralForeground3,
  },
});

export type TileProps = {
  label: string;
  caption?: string;
  className?: string;
};

export const Tile: React.FC<TileProps> = props => {
  const tileBaseClassName = useTileBaseClassName();
  const styles = useStyles();

  return (
    <div className={mergeClasses(tileBaseClassName, styles.content, props.className)}>
      <Text size={400} weight='semibold'>
        {props.label}
      </Text>
      {props.caption ? (
        <Text size={200} className={styles.caption}>
          {props.caption}
        </Text>
      ) : null}
    </div>
  );
};
```

### Responsive layout with logical properties (RTL-safe)

Uses media queries, CSS grid and logical properties (marginInline, textAlign: start) so the layout mirrors correctly when Provider dir is set to rtl.

```tsx
// DetailsPanel.tsx
import * as React from 'react';
import { makeStyles, shorthands, tokens } from '@griffel/react';
import { Field, Input, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    rowGap: tokens.spacingVerticalL,
    maxWidth: '720px',
    // Logical property: centered on the inline axis in both LTR and RTL.
    marginInline: 'auto',
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    boxShadow: tokens.shadow4,
    '@media (min-width: 720px)': {
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
      columnGap: tokens.spacingHorizontalXXL,
      rowGap: tokens.spacingVerticalM,
    },
    '@media (forced-colors: active)': {
      ...shorthands.borderColor('CanvasText'),
    },
  },
  hint: {
    // `start` follows the writing direction of the document.
    textAlign: 'start',
    color: tokens.colorNeutralForeground3,
    gridColumn: '1 / -1',
    '@media (min-width: 720px)': {
      paddingInlineStart: tokens.spacingHorizontalXS,
    },
  },
  input: {
    width: '100%',
  },
});

export const DetailsPanel: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Field label='First name' orientation='vertical'>
        <Input className={styles.input} />
      </Field>
      <Field label='Last name' orientation='vertical'>
        <Input className={styles.input} />
      </Field>
      <Text size={200} className={styles.hint}>
        Names are visible to everyone in your team.
      </Text>
    </div>
  );
};
```

### Token-level theming with Provider

Overrides only the tokens that differ (a partial theme), keeps portals in sync with applyStylesToPortals, and shows that every tokens.* reference in your own Griffel styles follows the theme automatically.

```tsx
// App.tsx
import * as React from 'react';
import { makeStyles, shorthands } from '@griffel/react';
import {
  Button,
  Card,
  Field,
  Input,
  Provider,
  Text,
  tokens,
} from '@fluentui/react-components';

// A *partial* theme: only the tokens that differ from the default Fluent UI theme.
// Everything else is inherited, and every value becomes a CSS custom property.
const brandTheme = {
  fontFamilyBase: '"Contoso Sans", "Segoe UI", sans-serif',
  borderRadiusMedium: '2px',
  borderRadiusLarge: '4px',
  colorBrandBackground: '#7a1fa2',
  colorBrandBackgroundHover: '#5c1680',
  colorBrandBackgroundPressed: '#3d0e56',
  colorBrandForeground1: '#7a1fa2',
  colorBrandForeground2: '#5c1680',
};

const useStyles = makeStyles({
  page: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
    // Resolves to var(--fontFamilyBase, ...) - the provider override applies here too.
    fontFamily: tokens.fontFamilyBase,
    ...shorthands.padding(tokens.spacingVerticalXXL, tokens.spacingHorizontalXXL),
  },
  card: {
    rowGap: tokens.spacingVerticalS,
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    boxShadow: tokens.shadow4,
  },
  action: {
    ...shorthands.margin(tokens.spacingVerticalS, '0', '0')
  },
});

export const App: React.FC = () => {
  const styles = useStyles();

  return (
    // `theme` and `dir` are propagated to the whole subtree through CSS variables.
    // `applyStylesToPortals` keeps Popover, Menu, Dialog and Tooltip surfaces in sync.
    <Provider theme={brandTheme} dir='ltr' applyStylesToPortals>
      <div className={styles.page}>
        <Card className={styles.card}>
          <Text size={500} weight='semibold'>
            Brand preview
          </Text>
          <Field label='Team name' required>
            <Input appearance='outline' size='medium' />
          </Field>
          <Button appearance='primary' className={styles.action}>
            Save
          </Button>
        </Card>
      </div>
    </Provider>
  );
};
```

### Server-side rendering with a Griffel renderer

Creates a document-less renderer on the server, wraps the tree in RendererProvider, and extracts the collected atomic rules as style elements for the HTML response.

```tsx
// server.tsx
import * as React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { createDOMRenderer, makeStyles, RendererProvider, renderToStyleElements, shorthands } from '@griffel/react';
import { Button, Provider, Text, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
  },
});

const Page: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Text size={400} weight='semibold'>Server rendered</Text>
      <Button appearance='primary'>Continue</Button>
    </div>
  );
};

export function renderPage(): { html: string; styleTags: string } {
  // No document on the server: the renderer collects the rules in memory.
  const renderer = createDOMRenderer();

  const html = renderToString(
    <RendererProvider renderer={renderer}>
      <Provider applyStylesToPortals>
        <Page />
      </Provider>
    </RendererProvider>,
  );

  // The collected atomic rules are emitted as <style> elements.
  const styleTags = renderToStyleElements(renderer)
    .map(element => renderToStaticMarkup(element))
    .join('');

  return { html, styleTags };
}

// client.tsx - on the client, create the renderer with the real document and reuse it.
// const renderer = createDOMRenderer(document);
// <RendererProvider renderer={renderer}><Provider>...</Provider></RendererProvider>
```

## Pitfalls

- Calling makeStyles inside a component body (or in a loop/map) recreates style objects on every render, which leaks memory and slows rendering - always declare styles at module scope.
- Combining classes with template strings, clsx or classnames instead of mergeClasses: atomic-class precedence is not related to the order in the class attribute, so overrides become unpredictable.
- Writing lengths as bare numbers, e.g. width: 100 or padding: 8 - pass explicit units ('100px', '8px') or tokens; numbers are only safe on unitless properties such as opacity and flexGrow.
- Using left/right/marginLeft/marginRight instead of logical properties, which silently breaks the layout when Provider's dir is 'rtl'.
- Hard-coding hex colors or pixel spacing instead of tokens: this bypasses theming, dark mode and high-contrast adjustments, and it cannot be overridden by Provider theme.
- Writing nested selector keys that do not start with &, : or @ (for example '.icon') - Griffel requires '& .icon' or a pseudo/at-rule key.
- Using ::before / ::after without a content declaration, so the pseudo-element never renders.
- Trying to override a Fluent UI component by wrapping it in a div or by adding a second class that is not merged through the component's own className - the component's styles are applied to its own root and must be overridden there via mergeClasses.
- Forgetting that Popover, Menu, Dialog and Tooltip render into portals: if the theme or direction does not reach them, check applyStylesToPortals on Provider.
- Calling the makeStyles hook conditionally or after an early return, which violates the rules of hooks and produces mismatched class names between renders.
- Reaching for customStyleHooks_unstable as a first resort: it is an app-wide, unstable escape hatch; prefer tokens and className overrides.

## Accessibility

Styling decisions are accessibility decisions. Always restore a clearly visible keyboard focus indicator instead of removing outlines: style ':focus-visible' with outlineStyle: 'solid', outlineWidth: tokens.strokeWidthThick, outlineColor: tokens.colorStrokeFocus2 and a positive outlineOffset, and never ship outline: 'none' without a replacement. Choose token pairs that are designed to pass contrast (for example colorNeutralForeground1 on colorNeutralBackground1, and colorNeutralForegroundOnBrand on colorBrandBackground) rather than mixing arbitrary palette values. Because tokens are high-contrast aware, prefer them over literal colors and add a '@media (forced-colors: active)' branch (using system colors or tokens.colorTransparentStroke for borders) when you style custom borders or backgrounds. Never convey state with color alone - selected/error states should also change a border, an icon, or text, which is easy with tokens such as colorBrandBackground plus a matching border. Respect motion preferences with '@media (prefers-reduced-motion: reduce)' for every transition or keyframe animation. Keep targets large enough by using spacing tokens for padding rather than shrinking hit areas, and prefer minHeight over fixed height with relative font sizes so text stays readable at 200% zoom or with larger text settings. Finally, hiding content with display: 'none' or visibility: 'hidden' removes it from the accessibility tree - use a clip-based visually-hidden pattern when content should remain available to assistive technology, and ensure dir='rtl' layouts keep a correct reading and tab order.

**Referenced components**: Provider, Button, Card, Text, Badge, Input, Field

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
