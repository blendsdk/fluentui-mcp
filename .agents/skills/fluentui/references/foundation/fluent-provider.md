# FluentProvider Setup

> **Category**: foundation

## What the provider is

Every Fluent UI v9 render tree starts with a provider. In `@fluentui/react-components` it is exported as `Provider`:

```tsx
import { Provider } from '@fluentui/react-components';
```

It is a context root rather than a visual component. It renders a wrapper element and, for everything below it:

1. **Publishes the theme as CSS custom properties** — `--colorBrandBackground`, `--colorNeutralBackground1`, `--colorNeutralForeground1`, `--fontFamilyBase`, `--fontSizeBase300`, `--spacingHorizontalM`, `--borderRadiusMedium` and hundreds more. Fluent UI components consume these variables instead of hard-coded colors, which is why a component rendered outside a provider can end up with transparent backgrounds and missing borders.
2. **Sets writing direction** through `dir`, so text direction and logical spacing resolve correctly for LTR and RTL locales.
3. **Creates a styled portal mount node** so content rendered in a portal — `Tooltip`, `Popover`, `Menu`, `Dialog`, `Drawer`, `TeachingPopover`, `TagPicker` — is a DOM sibling of your app but still inherits the active theme.
4. **Publishes provider-level contexts** used for style and override customisation (`customStyleHooks_unstable`, `overrides_unstable`).

## Minimal setup

Render one provider at the top of the React tree, above every Fluent UI component:

```tsx
// src/main.tsx
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, webLightTheme } from '@fluentui/react-components';
import { App } from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Could not find the #root element to mount the app into.');
}

createRoot(container).render(
  <React.StrictMode>
    <Provider theme={webLightTheme}>
      <App />
    </Provider>
  </React.StrictMode>,
);
```

If the application has more than one React root — a micro-frontend widget, a second root mounted for an off-screen preview, a host element for a separate dialog surface — give each root its own provider.

## Provider props at a glance

| Prop | Type | Notes |
| --- | --- | --- |
| `theme` | `PartialTheme` | Token values for the subtree. Merged over the theme inherited from the closest ancestor provider. |
| `dir` | `'ltr'` or `'rtl'` | Writing direction for the subtree. |
| `targetDocument` | `Document` | The document the provider belongs to; used when creating portal mount nodes and applying styles. |
| `applyStylesToPortals` | `boolean` | Applies the provider's theme class and styles to the portal mount nodes it owns. |
| `customStyleHooks_unstable` | `FluentProviderCustomStyleHooks` | Per-component style hooks that run for every matching component inside the provider. |
| `overrides_unstable` | `OverridesContextValue_unstable` | Override context read by components inside the provider. |

## theme

`theme` accepts a `PartialTheme`. A partial theme is merged on top of the theme inherited from the nearest ancestor provider; at the root the base is the default light theme. Two practical consequences:

- Passing a **complete** theme (`webLightTheme`, `webDarkTheme`, or a theme built with `createLightTheme`) replaces every token it defines.
- Passing a **partial** theme — an object holding only the tokens you want to change — overrides just those tokens and inherits everything else, including every non-color token such as typography, spacing and radii.

Partial themes are ideal for small in-place changes. Complete themes come from the library, or from `createLightTheme` and `createDarkTheme` fed with a brand ramp.

Themes should be module-level constants or memoised values. The provider reacts to the identity of the object you pass, so building a theme inside render makes it rewrite token variables across the whole subtree on every pass.

## dir

`dir` takes `'ltr'` or `'rtl'`. Set it once at the provider instead of adding direction attributes to individual components: the provider element carries the attribute and both your CSS and Fluent UI's logical properties react to it.

## targetDocument

When a subtree is rendered into a document other than the ambient one — an iframe, a popup window, a detached preview surface — pass that `Document` as `targetDocument`. The provider then creates its portal mount node and applies its styles inside that document instead of the main one.

## applyStylesToPortals

This is on by default. It controls whether the provider's theme class and style sheet are applied to the portal mount nodes the provider owns. Leave it on unless you deliberately want portaled content styled by a different provider — for example when you render a `Portal` with a `mountNode` that already sits inside another provider.

## customStyleHooks_unstable and overrides_unstable

Both props are escape hatches marked `_unstable`, which means their shape can change in a minor release.

- `customStyleHooks_unstable` registers per-component style hooks (keyed by names such as `useButtonStyles_unstable`) that run for every instance of that component inside the provider. It is the place to bend Fluent UI styling globally when tokens are not enough.
- `overrides_unstable` supplies context values that components inside the provider read while resolving their defaults, such as default sub-components, icons and generated content.

Prefer tokens. Reach for these two only when tokens cannot express the change, and expect to revisit the code when you upgrade.

## Built-in themes and custom brands

Complete themes ship with the package: `webLightTheme`, `webDarkTheme`, `teamsLightTheme`, `teamsDarkTheme` and `teamsHighContrastTheme`.

For a custom brand, build a brand ramp — a record of sixteen shades of one color, keyed `10` through `160` — and pass it to `createLightTheme` and `createDarkTheme`. Both return complete `Theme` objects that can be handed straight to the provider's `theme` prop.

## Nested providers and theme islands

Providers nest. A nested provider inherits from its closest ancestor and overrides only what its own `theme` and `dir` specify, so a dark island inside a light application is a two-line change:

- A nested provider with a complete theme paints that region with the new palette.
- A nested provider with a partial theme changes only the tokens listed and inherits the rest.

Nesting is also how you scope direction, so a locale switcher can wrap just the localisable region.

## Consuming theme tokens from your own CSS

Because the theme is delivered as CSS custom properties, your own stylesheets participate in the theme without any JavaScript. Read the same variables Fluent UI's own styles consume, and provide fallbacks where a rule might render outside a provider.

## Portals, documents and overlays

Overlay components render their surface through a portal, outside the DOM position of their trigger. The provider is what keeps that content themed: it owns a mount node for portals and applies its theme class and styles to it. Two props matter here:

- `applyStylesToPortals` — keep it on (the default) for normal apps.
- `targetDocument` — set it when the whole subtree lives in another document.

`Portal` itself accepts a `mountNode`, which may be an element or an object with `element` and `className`. Use it when portaled content needs a specific container instead of the provider's default mount node.

## Composition rules of thumb

- One provider per React root, placed above every Fluent UI component in that root.
- The provider renders a wrapper element, so it participates in layout. Put it where the application shell would otherwise go.
- Nested providers never reset anything you did not ask for: they inherit the ancestor theme and merge your values on top.
- Keep providers above portals in the tree so the portal mount node can pick up the theme.
- Set `dir` at the provider rather than on individual components, so portaled content and logical CSS stay consistent.

## Troubleshooting

**Components look unstyled, transparent, or have no borders.** They are rendering outside a provider. Wrap the root of the tree and verify that no subtree is rendered into a container that has no provider above it.

**The app looks right but tooltips, menus and dialogs do not.** Portaled content is not picking up the theme. Check that `applyStylesToPortals` is not disabled and that a custom `Portal` `mountNode` sits inside a provider.

**Theme switching is slow or janky.** A new theme object is being created on every render — for example by calling `createLightTheme` inside a component body, or by spreading a theme inline. Hoist theme creation to module scope or memoise it, then switch between two stable objects.

**Content inside an iframe is unstyled.** Pass the iframe's `Document` to `targetDocument` on the provider that wraps that content.

**Only part of the UI flips for RTL.** `dir` was set on a descendant rather than at the provider, or portaled DOM is being laid out by a different ancestor. Set `dir` on the provider that owns the content, or on the document element, and let the provider inherit it.

**An `_unstable` prop broke after an upgrade.** `customStyleHooks_unstable` and `overrides_unstable` are explicitly unstable; pin the library version, read the changelog before upgrading, or move the customisation into theme tokens.

## Related building blocks

`Portal` for moving content into another DOM container, the portaled surfaces (`Tooltip`, `Popover`, `Menu`, `Dialog`, `Drawer`, `TeachingPopover`, `TagPicker`, `Toast`), and simple components such as `Text`, `Card` and `Button` for smoke-testing a new theme.

## Key Takeaways

- A single Provider at the root of each React tree is mandatory: it turns the theme into CSS custom properties, sets writing direction, and keeps portaled overlays themed. Components rendered outside it lose their token values.
- theme takes a PartialTheme. A partial theme is merged on top of the theme inherited from the closest ancestor provider, so nested providers are cheap, scoped overrides rather than full resets.
- Create themes once at module scope (webLightTheme, webDarkTheme, createLightTheme(brandRamp)) and switch between stable object references. Building a theme during render rewrites tokens across the entire subtree on every pass.
- Portaled content (Tooltip, Popover, Menu, Dialog, Drawer, TeachingPopover, TagPicker) is only themed because the provider applies styles to its portal mount nodes — keep applyStylesToPortals on, and set targetDocument when the subtree lives in another document such as an iframe.
- customStyleHooks_unstable and overrides_unstable are unstable escape hatches. Exhaust token-based theming first and expect to revisit any code that uses them when upgrading.

## Examples

### Minimal app root with Provider

Mounts a single provider above the whole application so every Fluent UI component inherits theme tokens, direction and portal styling.

```tsx
// src/main.tsx
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, webLightTheme } from '@fluentui/react-components';
import { App } from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Could not find the #root element to mount the app into.');
}

createRoot(container).render(
  <React.StrictMode>
    <Provider theme={webLightTheme}>
      <App />
    </Provider>
  </React.StrictMode>,
);
```

### Switching between light and dark themes

Swaps two module-level theme objects at runtime. Because the theme references are stable, switching is a cheap prop change rather than a rebuild of the token map.

```tsx
import * as React from 'react';
import {
  Provider,
  Switch,
  Text,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components';

export const App = () => {
  const [isDark, setIsDark] = React.useState(false);

  // Both themes are module-level constants, so switching is just a prop change.
  const theme = isDark ? webDarkTheme : webLightTheme;

  return (
    <Provider theme={theme}>
      <Switch
        label="Dark theme"
        checked={isDark}
        onChange={(_event, data) => setIsDark(data.checked)}
      />
      <Text block size={400}>
        This text and the switch above read their colors from the active theme.
      </Text>
    </Provider>
  );
};
```

### Custom brand theme from a BrandVariants ramp

Builds light and dark themes from a single sixteen-step brand ramp, created once at module scope and handed to the provider.

```tsx
import * as React from 'react';
import {
  Button,
  Card,
  Provider,
  Text,
  createDarkTheme,
  createLightTheme,
} from '@fluentui/react-components';
import type { BrandVariants } from '@fluentui/react-components';

// A brand ramp is sixteen shades of the same color, keyed 10 through 160.
const brandRamp: BrandVariants = {
  10: '#020305',
  20: '#111723',
  30: '#16263D',
  40: '#193253',
  50: '#1B3F6A',
  60: '#1B4C82',
  70: '#18599B',
  80: '#1267B4',
  90: '#3174C2',
  100: '#4F82C8',
  110: '#6790CE',
  120: '#7B9ED3',
  130: '#8CADD7',
  140: '#9CBCDC',
  150: '#ACCAE0',
  160: '#BBC9E5',
};

// Build both themes once, at module scope: they are plain token objects.
const appLightTheme = createLightTheme(brandRamp);
const appDarkTheme = createDarkTheme(brandRamp);

export const App = () => {
  const [isDark, setIsDark] = React.useState(false);
  const theme = isDark ? appDarkTheme : appLightTheme;

  return (
    <Provider theme={theme}>
      <Card>
        <Text block weight="semibold">
          Contoso dashboard
        </Text>
        <Text block>
          Both themes were generated from the same brand ramp.
        </Text>
        <Button appearance="primary" onClick={() => setIsDark(value => !value)}>
          Switch to {isDark ? 'light' : 'dark'} theme
        </Button>
      </Card>
    </Provider>
  );
};
```

### Nested providers for scoped theme islands

Uses a second provider to paint a region with a different theme while the surrounding application keeps the outer theme.

```tsx
import * as React from 'react';
import {
  Card,
  Provider,
  Text,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components';

export const App = () => (
  <Provider theme={webLightTheme} dir="ltr">
    <Text block size={400} weight="semibold">
      Light application shell
    </Text>

    {/* A nested provider creates a theme island: everything inside is dark. */}
    <Provider theme={webDarkTheme}>
      <Card appearance="filled-alternative">
        <Text block weight="semibold">
          Dark preview
        </Text>
        <Text block>
          Tokens inside this subtree resolve to the dark theme values; the outer
          shell is unaffected.
        </Text>
      </Card>
    </Provider>
  </Provider>
);
```

### RTL application with a portaled Tooltip

Sets direction once at the provider so the whole subtree — including portaled overlay content — follows the locale, and keeps portal styling enabled.

```tsx
import * as React from 'react';
import {
  Button,
  Provider,
  Tooltip,
  webLightTheme,
} from '@fluentui/react-components';

export type AppProps = {
  direction: 'ltr' | 'rtl';
};

export const App = ({ direction }: AppProps) => (
  // One place decides the writing direction for the whole subtree.
  <Provider theme={webLightTheme} dir={direction} applyStylesToPortals>
    <Tooltip content="Save the current document" relationship="label">
      <Button appearance="primary">Save</Button>
    </Tooltip>
  </Provider>
);
```

### Rendering into an iframe with targetDocument

Points the provider at a different Document so portal mount nodes and styles are created inside an iframe instead of the host page.

```tsx
import * as React from 'react';
import {
  Button,
  Portal,
  Provider,
  Text,
  webLightTheme,
} from '@fluentui/react-components';

export const PreviewFrame = () => {
  const frameRef = React.useRef<HTMLIFrameElement>(null);
  const [frameDocument, setFrameDocument] = React.useState<Document | null>(null);

  const handleLoad = React.useCallback(() => {
    setFrameDocument(frameRef.current?.contentDocument ?? null);
  }, []);

  return (
    <>
      <iframe ref={frameRef} onLoad={handleLoad} title="Theme preview" />

      {frameDocument && (
        // targetDocument makes the provider create portal mount nodes and styles
        // inside the iframe document instead of the parent document.
        <Provider
          theme={webLightTheme}
          targetDocument={frameDocument}
          applyStylesToPortals
        >
          <Portal mountNode={frameDocument.body}>
            <Text block weight="semibold">
              Rendered inside the iframe document
            </Text>
            <Button appearance="primary">Themed button</Button>
          </Portal>
        </Provider>
      )}
    </>
  );
};
```

### Consuming theme tokens from plain CSS

Reads the CSS custom properties the provider writes onto its wrapper element, so hand-written styles participate in the active theme and stay in sync when it changes.

```css
/* src/app.css */
/* The provider writes these variables onto the element it renders, so any
   descendant — including your own markup — can read the active theme. */
.appShell {
  background-color: var(--colorNeutralBackground1);
  color: var(--colorNeutralForeground1);
  font-family: var(--fontFamilyBase);
  font-size: var(--fontSizeBase300);
  line-height: var(--lineHeightBase300);
  border: 1px solid var(--colorNeutralStroke1);
  border-radius: var(--borderRadiusMedium);
  padding: var(--spacingVerticalM) var(--spacingHorizontalL);
}

.appShell__accent {
  color: var(--colorNeutralForegroundOnBrand);
  background-color: var(--colorBrandBackground);
  box-shadow: var(--shadow4);
}

/* Provide a fallback so the rule still reads well outside a provider. */
.appShell__muted {
  color: var(--colorNeutralForeground3, #616161);
}
```

## Pitfalls

- Rendering Fluent UI components outside a provider (or into a DOM container that no provider wraps) produces transparent backgrounds, missing borders and unreadable text. Wrap the whole root, and make sure every React root has its own provider.
- Calling createLightTheme, createDarkTheme or spreading a theme inside a component body creates a new theme object every render, which makes the provider re-apply its variables for the whole tree and causes visible jank when toggling. Hoist or memoise the theme.
- Assuming a nested provider resets everything: a partial theme only overrides the tokens you list and inherits the rest from the ancestor provider, including typography, spacing and non-brand colors.
- Forgetting targetDocument when rendering into an iframe or popup window — portal mount nodes and styles then land in the wrong document and the portaled content is unstyled.
- Setting dir on a single component instead of at the provider, which leaves portaled DOM and logical CSS in a different direction than the rest of the subtree.
- Turning off applyStylesToPortals and then treating unstyled tooltips, menus or dialogs as a component bug; the provider is what carries the theme to those surfaces.
- Depending on the exact shape of customStyleHooks_unstable or overrides_unstable across upgrades — they are explicitly unstable and may change in minor releases.

## Accessibility

The provider itself is presentation and context, but it drives most of what users perceive. Contrast: theme tokens carry the color contrast of every component, so a custom brand ramp built with createLightTheme/createDarkTheme must be validated for text (4.5:1) and for UI boundaries and large text (3:1) in both the light and the dark theme — a brand color that reads well on white often fails as a dark surface. High contrast and forced colors: users who rely on OS high-contrast settings depend on themes that respect those settings (teamsHighContrastTheme, or the system forced-colors path), so read tokens in your own CSS rather than hard-coding colors. Direction: dir set to 'rtl' on the provider establishes the directionality of the whole subtree so assistive technology and the browser agree on reading order and control traversal; set it at the provider rather than per component, and make sure portaled content inherits the same direction. Portals: tooltips, menus and dialogs are moved elsewhere in the DOM, so the provider's portal styling is what keeps them legible — disabling applyStylesToPortals can yield low-contrast, unreadable overlays. Runtime theme changes should not move focus and any transition should respect prefers-reduced-motion; announce a theme change only when the user must act on it, otherwise keep the switch silent so screen reader output is not interrupted.

**Referenced components**: Provider, Portal, Switch, Text, Card, Button, Tooltip

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
