# Styling with Griffel

> **Category**: foundation

Griffel is the CSS-in-JS engine that renders the styles of every component in Fluent UI React v9. `Button`, `Card`, `Input`, `Dialog`, and the rest of the library are authored with the same public APIs your own code uses: `makeStyles`, `mergeClasses`, `makeResetStyles`, `makeStaticStyles`, and `shorthands`. Once you understand those five functions plus `tokens` and `FluentProvider`, you can style anything in v9 in a way that composes correctly with the library instead of fighting it.

## Why Griffel (and what it changes for you)

- **Atomic CSS.** Every declaration (`color: red`) becomes its own single-property class. Two components that share a declaration share a class, so the total CSS payload tends to shrink as an app grows instead of growing linearly per component.
- **Deterministic merging.** `mergeClasses` de-duplicates and orders class names, so you rarely need specificity tricks or `!important`.
- **Static styles.** Style objects are compiled into class names; nothing is interpolated per render. Styles are cacheable and can be extracted at build time.
- **SSR out of the box.** Class name hashes are deterministic between server and client, and `@griffel/react` rehydrates server-rendered styles without a flash of unstyled content.
- **Design tokens as CSS variables.** `tokens.*` compiles to `var(--colorNeutralForeground1)` and friends, resolved from the nearest `FluentProvider`, which makes theme switching and provider nesting trivial.
- **RTL aware.** Direction-sensitive styles are authored with logical properties and flip when a provider sets `dir="rtl"`.

## Setup and imports

`@griffel/react` is already a dependency of the Fluent UI packages. Add it explicitly to your `package.json` so you can import from it directly and so version mismatches surface at install time:

```bash
npm install @griffel/react
```

Every helper used in this guide is also re-exported from `@fluentui/react-components`:

```tsx
import {
  makeStyles,
  mergeClasses,
  makeResetStyles,
  makeStaticStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
```

The identical functions are available from `@griffel/react`, and `tokens` from `@fluentui/react-theme`. Pick one convention per codebase. Keep exactly one copy of the Griffel runtime in your dependency tree: class-name hashing, the renderer, and style ordering assume a single instance per document.

## The core API surface

### makeStyles

`makeStyles(stylesObject)` returns a **hook**. It is the primary authoring API.

- Call `makeStyles` at **module scope**, never inside a component or a loop.
- Call the returned hook inside a component, **unconditionally** (it is a hook).
- The keys of the object are arbitrary names; each becomes a class name (`styles.root`, `styles.icon`, `styles.compact`).
- Property names are camelCase CSS. Always include units (`'16px'`) unless the property is genuinely unitless.
- Values must be static. Never interpolate props, state, or other runtime values into a style object.

```tsx
const useStyles = makeStyles({
  root: { display: 'flex', gap: '8px' },
  icon: { color: tokens.colorBrandForeground1 },
});

// inside the component
const styles = useStyles();
```

### mergeClasses

`mergeClasses(...classNames)` is Griffel's replacement for `classnames` or template-string concatenation. It removes duplicates and produces an order in which **later arguments take precedence** over earlier ones for the same CSS property.

Rules of thumb:

- Base styles first, variant styles after: `mergeClasses(styles.base, isCompact ? styles.compact : undefined)`.
- Consumer-supplied `className` goes **last**, so callers can override. This is exactly what Fluent UI components do internally when they merge your `className` into their own state.
- Never build class strings with `` `${a} ${b}` ``: duplicate atomic classes may resolve in the wrong order, producing styles that appear to be ignored.

### makeResetStyles

`makeResetStyles(styleObject)` returns a hook that produces **one non-atomic class name** for the whole block. Use it when:

- a style block has many declarations and you want to avoid emitting dozens of atomic classes for a single element,
- you are migrating a large chunk of existing CSS,
- you want one class that behaves as a unit.

Trade-off: because the class is not atomic, you cannot override individual declarations of a reset class by merging another reset class; conflicting properties are resolved by the ordering `mergeClasses` produces. Prefer atomic styles when consumers need to tweak single properties.

### makeStaticStyles

`makeStaticStyles(styleObject)` produces **global, non-atomic** styles for element selectors, `:root`, `@font-face`, or utility classes. It returns a hook whose return value you can ignore; call it once in your app root.

```tsx
const useGlobalStyles = makeStaticStyles({
  body: { margin: 0, backgroundColor: tokens.colorNeutralBackground2 },
});

// in your root component
useGlobalStyles();
```

### shorthands

`shorthands` are helper functions that expand CSS shorthand properties into longhands and return an object, so they must be **spread** into the style object:

```tsx
const useStyles = makeStyles({
  root: {
    ...shorthands.padding('8px', '16px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.borderInlineStart('3px', 'solid', tokens.colorBrandStroke1),
    ...shorthands.marginInlineStart('auto'),
    ...shorthands.overflow('hidden'),
    ...shorthands.gap(tokens.spacingHorizontalS),
  },
});
```

Common helpers include `border`, `borderTop`/`borderBottom`/`borderLeft`/`borderRight`, the logical `borderInlineStart`/`borderInlineEnd`, `borderRadius`, `padding`, `paddingInline`, `margin`, `marginInlineStart`, `marginInlineEnd`, `gap`, `flex`, `overflow`, `outline`, `inset`, `transition`, and `textDecoration`. Using `shorthands` keeps intent explicit and pairs naturally with `tokens` for every value.

## Style object syntax you can rely on

Inside `makeStyles` / `makeResetStyles` / `makeStaticStyles` you can write:

- **Pseudo-classes and pseudo-elements** as keys: `':hover'`, `':focus-visible'`, `':disabled'`, `'::placeholder'`.
- **Nesting**: `'& > *'`, `'& .fui-Button'`, `'&:not(:last-child)'`.
- **At-rules**: `'@media (min-width: 768px)'`, `'@media (prefers-reduced-motion: reduce)'`, `'@media (forced-colors: active)'`, `'@supports (display: grid)'`. Values inside an at-rule are ordinary style objects and may nest further selectors.
- **Keyframes** declared inline on `animationName`:

```tsx
const useStyles = makeStyles({
  spinner: {
    animationName: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
    animationDuration: tokens.durationSlow,
    animationIterationCount: 'infinite',
  },
});
```

- **CSS custom properties**: read them with `var(--name, fallback)`; set them with the element's `style` attribute (see “Dynamic values”).

## Design tokens and theming

### tokens

`tokens` is a flat object of design token names. Each token compiles to a CSS variable that the nearest `FluentProvider` defines, which is what makes theming work without recompiling styles.

| Group | Representative tokens |
| --- | --- |
| Color (alias / semantic) | `colorNeutralBackground1`, `colorNeutralBackground2`, `colorNeutralForeground1`, `colorNeutralForeground3`, `colorNeutralStroke1`, `colorNeutralStroke2`, `colorBrandBackground`, `colorBrandBackgroundHover`, `colorBrandForeground1`, `colorBrandForeground2`, `colorBrandStroke1`, `colorStrokeFocus2`, `colorSubtleBackgroundHover` |
| Color (global palette) | `colorPaletteRedBackground3`, `colorPaletteRedForeground1`, `colorPaletteGreenForeground1`, `colorPaletteYellowBackground2` |
| Typography | `fontFamilyBase`, `fontFamilyMonospace`, `fontSizeBase200`, `fontSizeBase300`, `lineHeightBase300`, `fontWeightSemibold`, `fontSizeHero700`, `lineHeightHero700` |
| Spacing | `spacingHorizontalXXS` … `spacingHorizontalXXXL`, `spacingVerticalXS` … `spacingVerticalXXL` |
| Shape and stroke | `borderRadiusSmall`, `borderRadiusMedium`, `borderRadiusLarge`, `borderRadiusXLarge`, `borderRadiusCircular`, `strokeWidthThin`, `strokeWidthThick` |
| Elevation | `shadow2`, `shadow4`, `shadow8`, `shadow16`, `shadow28`, `shadow64` |
| Motion | `durationNormal`, `durationSlow`, `curveEasyEase` |

Rules:

1. **Prefer alias tokens**, which change with the theme, over global palette tokens. Use palette tokens only when you need a specific hue.
2. Never hard-code a hex value for anything that should follow the theme; it will not adapt when the theme or provider changes.
3. Pair tokens deliberately (`colorNeutralForeground1` on `colorNeutralBackground1`) to inherit tested contrast ratios.

### FluentProvider

`FluentProvider` is the single source of theme state: it renders the CSS variables, the `dir` attribute, and the base typography for its subtree.

- `theme` accepts a `Partial<Theme>`, so a nested provider can override only the tokens it cares about while everything else is inherited.
- `dir` accepts `'ltr' | 'rtl'` and drives direction-aware styles.
- `applyStylesToPortals` (default enabled) re-applies the provider class, including its CSS variables, to portal mount nodes. That is why popovers, menus, dialogs, and tooltips rendered through portals still receive the correct theme.
- `targetDocument` lets a provider own a different document (for example an iframe or a popup window).

### Custom brand themes

A `BrandVariants` ramp has exactly 16 stops, keyed `10` through `160`. Feed it to `createLightTheme` / `createDarkTheme` to produce a full `Theme`, then fine-tune individual tokens by spreading the result.

## Overriding component styles: use the ladder

Reach for the least invasive technique that solves the problem:

1. **Component props first.** `appearance`, `size`, `shape`, `color`, `iconPosition`, and friends are theme-aware and contractual across releases. If a prop covers the need, use it.
2. **`className` + `makeStyles`.** Pass your class to the component's `className`; the component merges it into its own styles. Merge variants with `mergeClasses` rather than string concatenation.
3. **Slots.** Most v9 components expose their internal parts as props. A slot is far more robust than a descendant selector:
   - `Button`: `icon={{ className: styles.icon }}`
   - `Card`: `floatingAction`, `checkbox`
   - `CardHeader`: `image`, `header`, `description`, `action`
   - `CardPreview`: `logo`
   - `CardFooter`: `action`
4. **Descendant selectors against the stable `fui-*` class.** Every v9 component renders a class such as `fui-Button` or `fui-Card` for exactly this purpose. Use it from nested selectors (`'& .fui-Button'`) or `makeStaticStyles` when you must style everything on a page.
5. **`customStyleHooks_unstable` on `FluentProvider`.** An experimental escape hatch: a map keyed by a component's internal style hook (`useButtonStyles_unstable`, `useCardStyles_unstable`, …) whose value is a hook that receives the component state so you can merge classes into any slot. Use it only when nothing above works, and expect the API surface to change.

Because Griffel emits one class per declaration, weight-based overrides (`!important`, selector stacking) are both unnecessary and fragile. Order is what matters, and `mergeClasses` is what controls order.

## Dynamic values: CSS custom properties

Style objects are static, so **props cannot be interpolated into `makeStyles`**. The supported pattern is to write a `var()` reference in the style and set the variable at runtime through the `style` attribute (or an ancestor).

## RTL and logical properties

- Set direction once on the provider: `<FluentProvider dir="rtl">`.
- Author direction-sensitive styles with **logical properties**: `marginInlineStart`, `marginInlineEnd`, `paddingInline`, `insetInlineStart`, `borderInlineStart`, and the matching `shorthands` helpers.
- Physical properties (`marginLeft`, `paddingRight`, `left`, `right`) do **not** flip. They are the most common source of broken RTL layouts.
- Spacing tokens are symmetric, so `shorthands.gap`, `shorthands.padding`, and friends are safe in both directions.
- Test both directions by rendering the same component under two providers.

## Performance and build tooling

- Keep `makeStyles` calls at module scope so each style object is compiled once and shared by every instance of the component.
- Atomic classes are shared across components, so sprinkling a few `makeStyles` calls is cheaper than adding a CSS file per feature.
- Use `makeResetStyles` for large blocks (a full surface with dozens of declarations) to avoid class bloat, and atomic styles for anything consumers may want to tweak.
- Never derive style values from props at runtime. If a value varies, it belongs in a CSS variable.
- Build tooling: `@griffel/babel-preset` and `@griffel/webpack-loader` pre-evaluate style objects at build time and can extract them into static CSS files. Fluent UI itself is built with these transforms, so apps behave correctly either way, but extraction removes most styling work from the runtime bundle.
- SSR: `createDOMRenderer`, `RendererProvider`, and `rehydrateRendererCache` from `@griffel/react` let a server render the generated styles and the client adopt them without re-generating.

## Debugging styles

- Class names are hashes (for example `f1bg9a2p`), so read the component's props and your own `mergeClasses` order rather than the DOM class list to understand which rule won.
- The `fui-<ComponentName>` class on each component gives you a readable anchor for DevTools and selectors.
- When a declaration seems to be ignored, check for another atomic class setting the same property later in the order — usually caused by string-concatenated class names.

## Accessibility

See the dedicated notes below; the short version is: keep focus indicators, respect `prefers-reduced-motion` and `forced-colors`, and use tokens rather than hard-coded colors so contrast is inherited from a tested theme.

## Cheat sheet

| Goal | API |
| --- | --- |
| Author component styles | `makeStyles` |
| Combine class names safely | `mergeClasses` |
| One non-atomic class for a big block | `makeResetStyles` |
| Global styles, `@font-face`, utilities | `makeStaticStyles` |
| `border`/`padding`/`margin`/`gap` expansion | `shorthands.*` (spread) |
| Theme-aware values | `tokens.*` |
| Provide theme and direction | `FluentProvider` (`theme`, `dir`, `applyStylesToPortals`) |
| Custom brand | `BrandVariants` + `createLightTheme` / `createDarkTheme` |
| Deep per-component override | `customStyleHooks_unstable` (experimental) |

## Key Takeaways

- Fluent UI React v9 styles are authored with the public Griffel APIs: define styles at module scope with makeStyles, call the returned hook inside a component, and keep every style object static.
- Always express colors, type, spacing, shape, and motion with tokens (for example colorNeutralForeground1, fontSizeBase300, spacingHorizontalM, borderRadiusMedium, shadow4) so styles follow the theme supplied by the nearest FluentProvider.
- Use mergeClasses instead of string concatenation. It de-duplicates class names and orders them so later arguments win - put variants after the base and consumer-supplied className last.
- The override ladder is props, then className, then slots (icon, floatingAction, checkbox, CardHeader action/image/header/description, CardFooter action), then fui-* descendant selectors, and only as a last resort customStyleHooks_unstable.
- Runtime values cannot be interpolated into styles; read a CSS custom property in makeStyles and set the variable inline with the style attribute instead.
- Direction-sensitive styling uses logical properties (marginInlineStart, paddingInline, borderInlineStart) plus FluentProvider's dir prop; physical left/right properties will not flip.
- Use makeResetStyles for large non-atomic style blocks and makeStaticStyles for global styles, but prefer atomic makeStyles whenever property-level overriding must remain possible.

## Examples

### Getting started: makeStyles with design tokens

The canonical pattern — styles defined once at module scope with makeStyles, values taken from tokens, and the returned hook called inside a component rendered under FluentProvider.

```tsx
import * as React from 'react';
import {
  Button,
  FluentProvider,
  makeStyles,
  Text,
  tokens,
  webLightTheme,
} from '@fluentui/react-components';

// Styles are defined once, at module scope, outside of any component.
const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '24px',
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusXLarge,
    boxShadow: tokens.shadow4,
  },
  title: {
    margin: 0,
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeHero700,
    lineHeight: tokens.lineHeightHero700,
    fontWeight: tokens.fontWeightSemibold,
  },
  caption: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

export const App: React.FC = () => {
  // makeStyles() returns a hook: call it once per render, never conditionally.
  const styles = useStyles();

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.root}>
        <h1 className={styles.title}>Styled with Griffel</h1>
        <Text className={styles.caption} size={200}>
          Atomic CSS, design tokens, no runtime style strings.
        </Text>
        <Button appearance="primary">Get started</Button>
      </div>
    </FluentProvider>
  );
};
```

### mergeClasses, pseudo-classes, at-rules and nested selectors

Combines base and variant styles with mergeClasses, exercises pseudo-classes, media queries, reduced-motion handling, and a descendant selector against a Fluent UI component's stable fui-* class.

```tsx
import * as React from 'react';
import {
  Button,
  Card,
  makeStyles,
  mergeClasses,
  Text,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    position: 'relative',
    maxWidth: '360px',
    padding: '20px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    transitionProperty: 'box-shadow, transform, padding',
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,

    // Nested pseudo-classes
    ':hover': {
      boxShadow: tokens.shadow8,
      transform: 'translateY(-2px)',
    },
    ':focus-within': {
      outline: `2px solid ${tokens.colorStrokeFocus2}`,
      outlineOffset: '2px',
    },

    // Nested at-rules
    '@media (min-width: 768px)': {
      padding: '28px',
    },

    // Opt out of motion for users who ask for it
    '@media (prefers-reduced-motion: reduce)': {
      transitionDuration: '0.01ms',
      transform: 'none',
    },

    // Descendant selector against a Fluent UI component's stable class name
    '& .fui-Button': {
      width: '100%',
    },
  },

  compact: {
    padding: '10px',
  },

  highlighted: {
    border: `1px solid ${tokens.colorBrandStroke1}`,
  },
});

export interface PanelProps {
  compact?: boolean;
  highlighted?: boolean;
}

export const Panel: React.FC<PanelProps> = ({ compact, highlighted }) => {
  const styles = useStyles();

  // mergeClasses de-duplicates and orders class names:
  // base first, variants after, consumer overrides last.
  const className = mergeClasses(
    styles.card,
    compact ? styles.compact : undefined,
    highlighted ? styles.highlighted : undefined,
  );

  return (
    <Card className={className}>
      <Text weight="semibold">Panel</Text>
      <Button appearance="primary">Continue</Button>
    </Card>
  );
};
```

### shorthands, makeResetStyles and makeStaticStyles

Shows shorthand expansion with the spread pattern, a single non-atomic class for a large surface block, and global styles applied once from the app root.

```tsx
import * as React from 'react';
import {
  makeResetStyles,
  makeStaticStyles,
  shorthands,
  Text,
  tokens,
} from '@fluentui/react-components';

/**
 * Global (non-atomic) styles. Call the returned hook once, in your app root.
 */
const useGlobalStyles = makeStaticStyles({
  body: {
    margin: 0,
    backgroundColor: tokens.colorNeutralBackground2,
    fontFamily: tokens.fontFamilyBase,
  },
  '.visually-hidden': {
    position: 'absolute',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  },
});

/**
 * A single, non-atomic class for an element with a large style block.
 * shorthands.* return objects, so they must be spread into the style object.
 */
const useSurfaceClassName = makeResetStyles({
  ...shorthands.margin(0),
  ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXL),
  ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  ...shorthands.borderRadius(tokens.borderRadiusXLarge),
  ...shorthands.overflow('hidden'),
  ...shorthands.gap(tokens.spacingVerticalS),
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: tokens.colorNeutralBackground1,
  boxShadow: tokens.shadow2,
});

const useTextStyles = makeStyles({
  muted: {
    ...shorthands.margin(0),
    color: tokens.colorNeutralForeground3,
  },
});

export const Surface: React.FC<React.PropsWithChildren> = ({ children }) => {
  useGlobalStyles(); // applies the global stylesheet for this call site
  const surfaceClassName = useSurfaceClassName();
  const styles = useTextStyles();

  return (
    <div className={surfaceClassName}>
      <Text className={styles.muted} size={200}>
        {children}
      </Text>
    </div>
  );
};
```

### Custom brand theme with BrandVariants and FluentProvider

Builds a 16-stop brand ramp, derives light and dark themes from it, fine-tunes individual tokens by spreading the generated theme, and consumes the tokens from makeStyles.

```tsx
import * as React from 'react';
import {
  BrandVariants,
  Button,
  createDarkTheme,
  createLightTheme,
  FluentProvider,
  makeStyles,
  Text,
  Theme,
  tokens,
} from '@fluentui/react-components';

// A brand ramp has exactly 16 stops, keyed 10 through 160.
const brandRamp: BrandVariants = {
  10: '#020305',
  20: '#111723',
  30: '#16263d',
  40: '#193253',
  50: '#1b3f6a',
  60: '#1b4c82',
  70: '#18599b',
  80: '#1267b4',
  90: '#3174bf',
  100: '#4a81ca',
  110: '#618fd4',
  120: '#779dde',
  130: '#8cabe7',
  140: '#a0baf0',
  150: '#b5c8f8',
  160: '#c9d7ff',
};

const brandLight: Theme = createLightTheme(brandRamp);

// `theme` accepts a Partial<Theme>, so a theme can be composed from a base
// theme plus individual token overrides.
const brandDark: Theme = {
  ...createDarkTheme(brandRamp),
  colorBrandForeground1: brandRamp[110],
  colorBrandForeground2: brandRamp[120],
};

const useStyles = makeStyles({
  surface: {
    padding: '24px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '320px',
  },
  brandText: {
    color: tokens.colorBrandForeground1,
    ':hover': {
      color: tokens.colorBrandForeground2,
    },
  },
});

const Demo: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.surface}>
      <Text className={styles.brandText} weight="semibold">
        Branded surface
      </Text>
      <Button appearance="primary">Primary action</Button>
      <Button appearance="outline">Secondary action</Button>
    </div>
  );
};

export const App: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <FluentProvider theme={dark ? brandDark : brandLight}>
    <Demo />
  </FluentProvider>
);
```

### Overriding component parts with slots and mergeClasses

Targets internal slots (Button icon, CardHeader image/header/description/action, CardPreview, CardFooter action) instead of relying on descendant selectors, and merges a variant on top of the component's own className.

```tsx
import * as React from 'react';
import {
  Avatar,
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
  Divider,
  makeStyles,
  mergeClasses,
  shorthands,
  Text,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    maxWidth: '360px',
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    ...shorthands.gap(tokens.spacingVerticalS),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
  },
  // Variant merged on top of the base class - later argument wins.
  compact: {
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
  },
  // Slot-level style applied to the Button's icon slot.
  icon: {
    color: tokens.colorBrandForeground1,
  },
  preview: {
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.overflow('hidden'),
  },
  footerAction: {
    marginInlineStart: 'auto',
  },
});

export const ProjectCard: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const styles = useStyles();

  return (
    <Card className={mergeClasses(styles.card, compact ? styles.compact : undefined)}>
      <CardHeader
        image={<Avatar name="Ana Rivera" color="colorful" />}
        header={<Text weight="semibold">Fluent UI React v9</Text>}
        description={<Text size={200}>Styling with Griffel</Text>}
        action={
          <Button
            appearance="subtle"
            icon={{ className: styles.icon }}
            iconPosition="before"
          >
            Edit
          </Button>
        }
      />
      <CardPreview className={styles.preview}>
        <img src="/preview.png" alt="Preview of the component documentation" />
      </CardPreview>
      <Divider />
      <CardFooter
        action={
          <Button className={styles.footerAction} appearance="primary">
            Open
          </Button>
        }
      >
        <Text size={200}>Updated 2 hours ago</Text>
      </CardFooter>
    </Card>
  );
};
```

### Dynamic values via CSS custom properties

Keeps styles static while allowing runtime values: the class references var(--fill-width) and the component sets the variable inline through the style attribute.

```tsx
import * as React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    width: '240px',
  },
  meter: {
    position: 'relative',
    flexGrow: 1,
    height: '10px',
    backgroundColor: tokens.colorNeutralBackground4,
    borderRadius: tokens.borderRadiusCircular,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    // Only the CSS variable changes at runtime - the class never does.
    width: 'var(--fill-width, 0%)',
    backgroundColor: 'var(--fill-color, transparent)',
    transitionProperty: 'width',
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
  },
});

interface MeterProps {
  value: number;
  label: string;
  color?: string;
}

export const Meter: React.FC<MeterProps> = ({ value, label, color }) => {
  const styles = useStyles();
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={styles.root}>
      <div
        className={styles.meter}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
      >
        <div
          className={styles.fill}
          style={
            {
              '--fill-width': `${clamped}%`,
              '--fill-color': color ?? tokens.colorBrandBackground,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
};
```

### RTL-ready styles with logical properties and dir

The same component rendered under ltr and rtl providers, using logical properties (borderInlineStart, paddingInline, marginInlineEnd) so the accent edge flips automatically.

```tsx
import * as React from 'react';
import {
  FluentProvider,
  makeStyles,
  shorthands,
  Text,
  tokens,
  webLightTheme,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  row: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalS),
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    backgroundColor: tokens.colorNeutralBackground1,
  },
  accent: {
    // Logical properties flip with the provider direction.
    // Physical properties (marginLeft, paddingRight, left, right) do not.
    ...shorthands.borderInlineStart('3px', 'solid', tokens.colorBrandStroke1),
    ...shorthands.paddingInline(tokens.spacingHorizontalS),
    ...shorthands.marginInlineEnd(tokens.spacingHorizontalXS),
  },
  text: {
    color: tokens.colorNeutralForeground1,
  },
});

const Notice: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.row}>
      <div className={styles.accent}>
        <Text className={styles.text} weight="semibold">
          Direction aware
        </Text>
      </div>
    </div>
  );
};

export const App: React.FC = () => (
  <>
    <FluentProvider theme={webLightTheme} dir="ltr">
      <Notice />
    </FluentProvider>
    <FluentProvider theme={webLightTheme} dir="rtl">
      <Notice />
    </FluentProvider>
  </>
);
```

### Deep overrides with customStyleHooks_unstable

Experimental escape hatch: FluentProvider accepts a map keyed by a component's internal style hook so you can merge extra classes into the component state for every instance in the subtree.

```tsx
import * as React from 'react';
import {
  Button,
  FluentProvider,
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
  webLightTheme,
} from '@fluentui/react-components';

const useDenseButtonStyles = makeStyles({
  dense: {
    ...shorthands.padding('0', tokens.spacingHorizontalS),
    ...shorthands.gap(tokens.spacingHorizontalXXS),
    minHeight: '24px',
    fontSize: tokens.fontSizeBase200,
  },
});

/**
 * EXPERIMENTAL: `customStyleHooks_unstable` lets you participate in a
 * component's own style computation. The key is the component's internal style
 * hook name (for example `useButtonStyles_unstable`); the value is a hook that
 * receives the component state so you can merge classes into any of its slots.
 *
 * The state shape is intentionally typed loosely here because the API is
 * unstable and may change between minor releases.
 */
const customStyleHooks = {
  useButtonStyles_unstable: (state: any) => {
    const styles = useDenseButtonStyles();

    if (state.root) {
      state.root.className = mergeClasses(state.root.className, styles.dense);
    }
  },
};

export const App: React.FC = () => (
  <FluentProvider theme={webLightTheme} customStyleHooks_unstable={customStyleHooks}>
    <Button appearance="primary">Dense everywhere</Button>
  </FluentProvider>
);
```

## Pitfalls

- Calling makeStyles inside a component body or a loop. It is a compile-time factory: keep it at module scope so the style object is compiled once and call the returned hook during render.
- Interpolating props or state into style values (for example `width: `${size}px`` or `color: props.color`). Griffel styles are static - use a CSS custom property and a var() reference instead.
- Building class name strings with template literals or classnames. Duplicate atomic classes can resolve in the wrong order; use mergeClasses so later arguments take precedence deterministically.
- Reaching for !important or deeply stacked selectors to beat component styles. Atomic classes have flat specificity, so the fix is ordering through mergeClasses or targeting the correct slot, not more specificity.
- Styling a component's internals with brittle descendant selectors. Prefer the exposed slot props (for example Button's icon, Card's floatingAction and checkbox, CardHeader's action) or the stable fui-* class before resorting to structural selectors.
- Using physical properties such as marginLeft, paddingRight, or left. They break in RTL; use marginInlineStart, paddingInline, insetInlineStart, and the logical shorthands instead.
- Expecting a class from makeResetStyles to be partially overridable. It is one non-atomic class, so conflicting declarations resolve by ordering rather than by property-level merging, unlike atomic makeStyles output.
- Assuming tokens are global constants. They are CSS variables scoped to the nearest FluentProvider, so hard-coded values will not change with the theme, and portal content depends on the provider reapplying its styles (applyStylesToPortals).
- Treating customStyleHooks_unstable as a supported, stable API. It is an experimental escape hatch keyed by internal style hooks and can change between minor releases.

## Accessibility

Styling decisions directly affect accessibility in Fluent UI v9, and the token system is designed to keep the defaults safe.

- **Focus visibility.** Never remove focus styling. If you restyle focus, keep a visible indicator such as `':focus-visible': { outline: '2px solid ' + tokens.colorStrokeFocus2, outlineOffset: '2px' }`. Avoid replacing outline with box-shadow only: outlines survive Windows High Contrast (forced-colors) mode, shadows do not. Use `:focus-within` on containers when a child receives focus.
- **Contrast.** Build colors from token pairs that ship with tested contrast (colorNeutralForeground1 on colorNeutralBackground1, colorBrandForeground1 on colorNeutralBackground1). If you introduce custom colors or a custom BrandVariants ramp, verify at least 4.5:1 for body text and 3:1 for large text, icons, and focus indicators - in light, dark, and high-contrast themes.
- **Forced colors / high contrast.** Custom backgrounds and borders may be replaced by the operating system palette. Don't encode essential meaning (such as selected or error state) only in a background color; pair it with text, an icon, or a border so the state survives forced-colors mode. Check custom styles under a `'@media (forced-colors: active)'` block if you need explicit fallbacks.
- **Reduced motion.** Any animation or transition you author should be neutralized for users who prefer reduced motion, for example `'@media (prefers-reduced-motion: reduce)': { transitionDuration: '0.01ms', animationDuration: '0.01ms' }`.
- **Target size.** Use spacing tokens (spacingHorizontalS/M, spacingVerticalS/M) rather than arbitrary pixel values when sizing interactive areas, and keep pointer targets at least 24x24 CSS pixels (larger for touch) by adjusting padding rather than shrinking the hit area.
- **Direction.** RTL layouts must remain navigable and visually ordered; logical properties combined with FluentProvider's `dir` preserve both reading order and visual alignment without changing the DOM.
- **Don't restyle away semantics.** Components rely on their internal classes to express disabled, selected, expanded, and invalid states; override colors and spacing, but leave the properties that communicate state and are exposed through ARIA intact.

**Referenced components**: FluentProvider, Button, Card, CardHeader, CardPreview, CardFooter, Text, Avatar, Divider

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
