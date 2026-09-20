# FluentProvider Setup

> **Category**: foundation

## What `FluentProvider` does

`FluentProvider` is the root component of every Fluent UI v9 application. It is exported from the main package:

```tsx
import { FluentProvider } from '@fluentui/react-components';
```

It has four responsibilities:

1. **Publishes the theme.** Components in v9 never hard-code colors, spacing, type ramp, shadows or radii. They resolve those values from CSS custom properties such as `--colorNeutralBackground1`, `--colorBrandBackground` and `--fontSizeBase300`. `FluentProvider` converts a theme object into a style element containing those custom properties, inserts it into the target document, and marks its subtree with a generated theme class (for example `fui-FluentProvider1`) that ties that subtree to the theme.
2. **Provides context.** Descendants read the theme, the text direction (`dir`), the target document, custom style hooks and component overrides from React context. Context is the channel components use for non-CSS decisions – most importantly *which document a portal should render into*.
3. **Keeps portaled content themed.** Dialogs, popovers, menus, tooltips and overlay drawers render through portals into `document.body`, outside the provider's DOM subtree. The `applyStylesToPortals` prop (default `true`) makes sure those surfaces still resolve the provider's theme variables.
4. **Opens escape hatches.** `customStyleHooks_unstable` and `overrides_unstable` allow design systems and component packages built on top of Fluent UI to adjust the last mile without forking components.

If a component renders with transparent backgrounds, wrong colors or collapsed spacing, its CSS custom properties are unresolved – the first thing to verify is whether a `FluentProvider` exists somewhere above it.

## Prerequisites and imports

```bash
npm install @fluentui/react-components
```

```tsx
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
```

## Basic setup: one provider at the root

Mount the provider once, as high in the React tree as possible – typically in your entry file wrapping your application component:

```tsx
<FluentProvider theme={webLightTheme}>
  <App />
</FluentProvider>
```

Placement rules:

- **Wrap the whole app once.** Every Fluent component in the tree is expected to sit under a provider.
- **`theme` is optional.** When omitted, the provider uses `webLightTheme`.
- **The provider renders a `<div>` root.** You can pass `className`, `style` and other `<div>` attributes to it, but do not use it *as* your layout container – render your own layout element inside it.
- **Add nested providers only when a subtree needs different theming or direction** (a dark sidebar, a preview pane, an embedded widget).

## Props reference

| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| `theme` | `Partial<Theme>` | `webLightTheme` | Theme object. Partial themes are merged with the theme inherited from the closest parent provider, so you only declare tokens you want to change. |
| `dir` | `'ltr'` or `'rtl'` | Inherited from the parent provider, otherwise `ltr` | Text direction for the subtree. Propagated through context so components mirror correctly, and written to the root element. |
| `targetDocument` | `Document` | Inherited from the parent provider, otherwise the global `document` | Document used for style injection, portals and focus management. Needed for iframes and popup windows. |
| `applyStylesToPortals` | `boolean` | `true` | Makes the provider's styling available to portal mount nodes so dialogs, menus, popovers, tooltips and overlay drawers stay themed. |
| `customStyleHooks_unstable` | `Partial<{ useXxxStyles_unstable: (state) => void }>` | `undefined` | Escape hatch that lets you mutate the component state during style resolution for any Fluent component. |
| `overrides_unstable` | `OverridesContextValue` | `undefined` | Used by component packages built on top of Fluent UI to change global component defaults. Not intended for app code. |
| *(root slot)* | `<div>` | – | Standard div attributes (`className`, `style`, `id`, `data-*`, event handlers) are forwarded to the provider's root element. |

## Theming

### Built-in themes and factories

`@fluentui/react-components` ships ready-made themes and theme factories:

- `webLightTheme` – the default, a neutral light theme.
- `webDarkTheme` – the matching dark theme.
- `webHighContrastTheme` – an explicit high-contrast theme.
- `teamsLightTheme`, `teamsDarkTheme`, `teamsHighContrastTheme` – themes aligned with Microsoft Teams visuals.
- `createLightTheme`, `createDarkTheme` – factories that turn a brand ramp into a full theme.

```tsx
<FluentProvider theme={webDarkTheme}>{children}</FluentProvider>
```

### Partial themes

`theme` is typed `Partial<Theme>`, which means you can pass just a handful of tokens and inherit everything else from the parent provider:

```tsx
import type { Theme } from '@fluentui/react-components';

const accentOverride: Partial<Theme> = {
  colorBrandBackground: '#6b2fbf',
  colorBrandBackgroundHover: '#5a27a3',
  colorBrandForeground1: '#5a27a3',
};
```

This is the most convenient way to apply a small brand adjustment to a subtree, because you do not have to re-declare the entire token set.

### Custom brand themes

A brand ramp is a `BrandVariants` object with 16 colors keyed `10` through `160`. Feed it to `createLightTheme` or `createDarkTheme` to get a complete, internally consistent theme in which every brand token (backgrounds, foregrounds, borders, focus, subtle states) is derived from your ramp:

```tsx
import { createDarkTheme, createLightTheme } from '@fluentui/react-components';
import type { BrandVariants } from '@fluentui/react-components';

const brandRamp: BrandVariants = { 10: '#061724', /* ... */ 160: '#ffffff' };
const appLightTheme = createLightTheme(brandRamp);
const appDarkTheme = createDarkTheme(brandRamp);
```

### Theme identity and performance

The provider regenerates its style element whenever the `theme` object identity changes. Therefore:

- Create themes **at module scope** (`const lightTheme = createLightTheme(brandRamp);`), not inside a component body.
- When the theme depends on state, wrap it in `React.useMemo` so the same theme reference is reused across renders.
- Avoid inline object literals such as `theme={{ colorBrandBackground: '#f0f' }}` in JSX.

### How nested scoping works

A nested `FluentProvider` with `theme` set declares the theme's custom properties again for its own subtree. Because the inner provider's style element is inserted after the outer one, its declarations win for that subtree, while everything outside the inner provider keeps the outer theme. This makes scoping safe: no global stylesheet is patched, and the outer theme resumes as soon as the inner provider's subtree ends.

Common scoped-theming scenarios:

- A dark navigation rail inside a light application shell.
- Theming a light and a dark preview of the same component side by side.
- Applying a customer brand to one embedded area of a host application.
- Theming a third-party widget or micro-frontend without touching the host theme.

## Direction: `dir` and RTL

Set `dir` on the provider and let it flow through context:

```tsx
<FluentProvider theme={webLightTheme} dir="rtl">
  {children}
</FluentProvider>
```

The provider writes the attribute to its root element and propagates the direction to every component below it, so layout mirroring, icon direction and keyboard behaviour are consistent. For full-fidelity RTL, also set `dir` on the document element (`<html dir="rtl">`) so browser-provided UI such as scrollbars follows suit.

## Portals: `applyStylesToPortals`

Many components render their most visible surface through a portal on `document.body`:

- `DialogSurface` (from `Dialog`)
- `PopoverSurface` (from `Popover`)
- `MenuPopover` (from `Menu`)
- Tooltip content (from `Tooltip`)
- `OverlayDrawer`
- Anything you render yourself with `Portal`

Because those nodes leave the provider's DOM subtree, `applyStylesToPortals` defaults to `true` and keeps them themed. Leave it at the default in almost every case.

Set `applyStylesToPortals={false}` only when you want to control portal styling yourself – for example, when different portals must show different themes. In that case you are responsible for wrapping the portaled content in its own `FluentProvider`:

```tsx
<FluentProvider theme={webLightTheme} applyStylesToPortals={false}>
  <Portal mountNode={document.body}>
    <FluentProvider theme={webLightTheme}>{/* themed portal content */}</FluentProvider>
  </Portal>
</FluentProvider>
```

## `targetDocument`: iframes and other documents

`targetDocument` tells the provider which `Document` it belongs to. It is used for style injection, portal rendering and focus management. Reach for it when the Fluent tree is rendered inside:

- an `<iframe>` (embedded editors, previews, low-code canvases),
- a popup `window` opened with `window.open`,
- any environment where the global `document` is not the document your UI is mounted in.

The value must be the document that actually contains the app's mount node, otherwise dialogs and menus will render and trap focus in the wrong tree.

## `customStyleHooks_unstable`

`customStyleHooks_unstable` is a map keyed by Fluent's internal style hook names (`useButtonStyles_unstable`, `useInputStyles_unstable`, `useTooltipStyles_unstable`, and so on). Each hook is called with the component's state while its styles are resolved, so you can mutate slot styles as a final step.

Guidelines:

- Treat the prop as **unstable**: the name says it, and the keys track internal hook names that may change between minor releases.
- Define the object **outside render** (or memoize it) so it is not recreated on every render.
- Prefer it for last-mile tweaks. For real theming, change design tokens through `theme` instead.
- Do not use it to build an entire design system without a pinning strategy.

## `overrides_unstable`

`overrides_unstable` is aimed at libraries that wrap Fluent UI (for example a product design system that wants every `Input` to default to a different appearance). It is not part of the stable public API and app code should normally leave it untouched.

## Common composition patterns

- **App shell:** one provider at the top with your brand theme; every route, page and component lives below it.
- **Theme toggle:** keep a boolean in state and swap between two module-scope theme constants, memoized with `React.useMemo`.
- **Themed sub-area:** nest a provider with a full theme (dark island) or a partial theme (accent override) around the subtree.
- **Multiple products in one page:** give each product root its own provider so their themes cannot leak into each other.
- **Portal-heavy UI:** keep dialogs, menus and popovers under the provider whose theme they should show, or re-provide the theme inside the portal when you opt out of `applyStylesToPortals`.

## Debugging checklist

1. Is there a `FluentProvider` above the component? Missing provider is by far the most common cause of unstyled UI.
2. Inspect the DOM: an ancestor should carry a generated theme class, and the document head should contain a style element full of `--color*` custom properties.
3. Theme not applied to a dialog or menu? Check `applyStylesToPortals` and whether another provider with a different theme also styles portal mount nodes.
4. Rendering into an iframe or popup? Verify `targetDocument` points at that document.
5. Theme changes lagging or style churn? Check that the theme object is created once and its identity is stable.
6. RTL looking half-mirrored? Set `dir` on both the provider and the `<html>` element.

## Accessibility checklist

- `FluentProvider` is where text direction is declared, and direction affects reading order for assistive technology. Keep `dir` in sync with the content language.
- The provider does **not** set `lang`. Set `<html lang>` (and `lang` on mixed-language content) yourself.
- Theme choice is a contrast decision. Built-in themes meet Fluent's contrast targets; custom brand ramps and partial token overrides are not validated for you.
- Components support operating-system high-contrast settings through the design tokens. Avoid hard-coding colors that fight forced-colors mode, and test with a high-contrast theme.
- In embedded documents, a wrong `targetDocument` can place modal focus traps in a document the user is not interacting with.
- The provider's root `<div>` adds no ARIA roles or landmarks. Keep your own heading and landmark structure intact.

## Key Takeaways

- FluentProvider is the mandatory root for Fluent UI v9 apps: it publishes the theme as CSS custom properties and provides the context (direction, target document) that components rely on. Without it, components render unresolved tokens and look broken.
- theme accepts a Partial<Theme> and defaults to webLightTheme. Nested providers merge their theme over the inherited one, so a nested provider can restyle just its own subtree with a handful of overridden tokens.
- Portaled surfaces - Dialog, Popover, Menu, Tooltip and OverlayDrawer - stay themed out of the box because applyStylesToPortals defaults to true. Only set it to false if you re-provide the theme inside the portal yourself.
- Create themes at module scope (createLightTheme/createDarkTheme) or memoize them; a new theme object identity on each render regenerates the provider's style element.
- Set dir on the provider for RTL and mirror it on the html element, so both component context and native browser UI point the same way.
- Use targetDocument whenever the Fluent tree lives in a document other than the global document (iframe, popup window) so style injection, portals and focus traps target the right tree.
- customStyleHooks_unstable and overrides_unstable are escape hatches for last-mile styling and wrapper libraries; they are unstable by contract and should not be the backbone of a design system.

## Examples

### Minimal app root setup

Mount a single FluentProvider around the application with the default web light theme, then use ordinary Fluent components underneath it.

```tsx
// main.tsx
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Button,
  Checkbox,
  Field,
  FluentProvider,
  Input,
  Switch,
  Text,
  webLightTheme,
} from '@fluentui/react-components';

const SettingsPage = () => (
  <div style={{ padding: 16, display: 'grid', gap: 16, maxWidth: 420 }}>
    <Text size={500} weight="semibold">
      Account settings
    </Text>
    <Field label="Display name" required>
      <Input defaultValue="Ada Lovelace" />
    </Field>
    <Checkbox label="Send me product updates" defaultChecked />
    <Switch label="Compact mode" />
    <Button appearance="primary">Save</Button>
  </div>
);

const App = () => (
  <FluentProvider theme={webLightTheme}>
    <SettingsPage />
  </FluentProvider>
);

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<App />);
}
```

### Light and dark theme switching

Swap between two module-scope theme constants, initialised from the user's colour-scheme preference, while keeping the theme object identity stable with useMemo.

```tsx
import * as React from 'react';
import {
  Button,
  FluentProvider,
  Text,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components';

const prefersDark = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

export const ThemeToggle = () => {
  const [isDark, setIsDark] = React.useState(prefersDark);

  // Memoize so the provider's style element is not regenerated on every render.
  const theme = React.useMemo(() => (isDark ? webDarkTheme : webLightTheme), [isDark]);

  return (
    <FluentProvider theme={theme}>
      <div style={{ padding: 16, display: 'grid', gap: 12 }}>
        <Text size={500} weight="semibold">
          {isDark ? 'Dark theme' : 'Light theme'}
        </Text>
        <Button appearance="primary" onClick={() => setIsDark(value => !value)}>
          Toggle theme
        </Button>
      </div>
    </FluentProvider>
  );
};
```

### Scoped theming with nested providers and a partial theme

Shows a dark island created with a full theme and an accent override created with a Partial<Theme> that merges with the inherited light theme.

```tsx
import * as React from 'react';
import {
  Button,
  FluentProvider,
  Text,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components';
import type { Theme } from '@fluentui/react-components';

// A partial theme only declares what it overrides; everything else is
// inherited from the closest parent FluentProvider.
const accentOverride: Partial<Theme> = {
  colorBrandBackground: '#6b2fbf',
  colorBrandBackgroundHover: '#5a27a3',
  colorBrandForeground1: '#5a27a3',
};

export const ScopedTheming = () => (
  <FluentProvider theme={webLightTheme}>
    <div style={{ padding: 16 }}>
      <Button appearance="primary">Primary - default brand</Button>
    </div>

    {/* Full theme scoped to this subtree only. */}
    <FluentProvider theme={webDarkTheme}>
      <div style={{ padding: 16, display: 'grid', gap: 8 }}>
        <Text weight="semibold">Dark island</Text>
        <Button appearance="primary">Primary - dark theme</Button>
      </div>
    </FluentProvider>

    {/* Partial theme: inherited tokens plus the overridden brand accent. */}
    <FluentProvider theme={accentOverride}>
      <div style={{ padding: 16 }}>
        <Button appearance="primary">Primary - rebranded accent</Button>
      </div>
    </FluentProvider>
  </FluentProvider>
);
```

### Right-to-left layout with the dir prop

Toggles the provider direction at runtime, which mirrors layout and keyboard behaviour for every component in the subtree through context.

```tsx
import * as React from 'react';
import {
  Button,
  Field,
  FluentProvider,
  Input,
  Tab,
  TabList,
  webLightTheme,
} from '@fluentui/react-components';

export const DirectionExample = () => {
  const [dir, setDir] = React.useState<'ltr' | 'rtl'>('ltr');

  return (
    <FluentProvider theme={webLightTheme} dir={dir}>
      <div style={{ padding: 16, display: 'grid', gap: 12 }}>
        <TabList defaultSelectedValue="overview">
          <Tab value="overview">Overview</Tab>
          <Tab value="activity">Activity</Tab>
        </TabList>
        <Field label="Search" orientation="horizontal">
          <Input defaultValue="Fluent UI" />
        </Field>
        <Button
          appearance="primary"
          onClick={() => setDir(current => (current === 'ltr' ? 'rtl' : 'ltr'))}
        >
          Switch to {dir === 'ltr' ? 'RTL' : 'LTR'}
        </Button>
      </div>
    </FluentProvider>
  );
};
```

### Portaled surfaces are themed by default

A Dialog renders its surface into a portal on document.body; applyStylesToPortals defaults to true so the surface still resolves the provider's theme variables.

```tsx
import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  FluentProvider,
  Text,
  webLightTheme,
} from '@fluentui/react-components';

export const PortalTheming = () => (
  // applyStylesToPortals defaults to true - no extra work needed for portals.
  <FluentProvider theme={webLightTheme}>
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Button appearance="primary">Open dialog</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Portaled surface</DialogTitle>
          <DialogContent>
            <Text>
              This surface lives outside the provider's DOM subtree but is still themed.
            </Text>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="primary">Close</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  </FluentProvider>
);
```

### Opting out of portal styling and re-providing the theme

With applyStylesToPortals set to false, portal mount nodes are not styled by the provider, so the portaled content wraps itself in its own FluentProvider.

```tsx
import * as React from 'react';
import {
  FluentProvider,
  Portal,
  Text,
  webLightTheme,
} from '@fluentui/react-components';

export const PortalThemingOptOut = () => (
  <FluentProvider theme={webLightTheme} applyStylesToPortals={false}>
    <Portal mountNode={document.body}>
      {/* The portal mount node is not styled by the outer provider, so the
          theme is re-provided inside the portal content. */}
      <FluentProvider theme={webLightTheme}>
        <div style={{ position: 'fixed', right: 16, bottom: 16, padding: 12 }}>
          <Text weight="semibold">Themed portal content</Text>
        </div>
      </FluentProvider>
    </Portal>
  </FluentProvider>
);
```

### Custom brand theme from a brand ramp

Builds light and dark themes from a BrandVariants ramp with createLightTheme and createDarkTheme, creating them once at module scope for a stable theme identity.

```tsx
import * as React from 'react';
import {
  Button,
  FluentProvider,
  createDarkTheme,
  createLightTheme,
} from '@fluentui/react-components';
import type { BrandVariants } from '@fluentui/react-components';

// A brand ramp is 16 colors keyed 10 through 160. Every brand token in the
// resulting theme is derived from these values.
const brandRamp: BrandVariants = {
  10: '#061724',
  20: '#082338',
  30: '#0a2e4a',
  40: '#0c3b5e',
  50: '#0e4875',
  60: '#10568e',
  70: '#1265a8',
  80: '#1375c3',
  90: '#1386df',
  100: '#3b9bf1',
  110: '#63adf4',
  120: '#88bff7',
  130: '#abd0fa',
  140: '#cce1fc',
  150: '#eaf3fe',
  160: '#ffffff',
};

// Create the themes once, at module scope. Re-creating them on every render
// would regenerate the provider's style element on every render.
const appLightTheme = createLightTheme(brandRamp);
const appDarkTheme = createDarkTheme(brandRamp);

export const BrandedApp = () => {
  const [isDark, setIsDark] = React.useState(false);

  return (
    <FluentProvider theme={isDark ? appDarkTheme : appLightTheme}>
      <div style={{ padding: 16 }}>
        <Button appearance="primary" onClick={() => setIsDark(value => !value)}>
          Toggle branded theme
        </Button>
      </div>
    </FluentProvider>
  );
};
```

### Rendering into an iframe with targetDocument

Mounts a second React root inside an iframe document and points targetDocument at that document so style injection, portals and focus traps stay inside the frame.

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  Button,
  FluentProvider,
  Input,
  Text,
  webLightTheme,
} from '@fluentui/react-components';

/**
 * Renders a second React root inside an iframe.
 * targetDocument tells FluentProvider which document to inject its style
 * element into and which document portals and focus traps should target.
 */
export const IframeHost = () => {
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

  React.useEffect(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc || !doc.body) {
      return;
    }

    const mountNode = doc.createElement('div');
    doc.body.appendChild(mountNode);

    const root = ReactDOM.createRoot(mountNode);
    root.render(
      <FluentProvider theme={webLightTheme} targetDocument={doc}>
        <div style={{ padding: 16, display: 'grid', gap: 12 }}>
          <Text weight="semibold">Inside the iframe</Text>
          <Input defaultValue="Fluent UI in another document" />
          <Button appearance="primary">Action</Button>
        </div>
      </FluentProvider>,
    );

    return () => {
      root.unmount();
      mountNode.remove();
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title="Fluent UI preview"
      style={{ width: '100%', height: 240, border: '1px solid #d1d1d1' }}
    />
  );
};
```

### Last-mile styling with customStyleHooks_unstable

Mutates component state during style resolution for Button and Input via customStyleHooks_unstable, defined once outside render because the value must be stable.

```tsx
import * as React from 'react';
import {
  Button,
  FluentProvider,
  Input,
  webLightTheme,
} from '@fluentui/react-components';

// The hooks receive the component state as `unknown`; cast to the slot shape
// you want to touch. Slot styles are merged into the rendered element.
type SlotState = { root: { style: React.CSSProperties } };

// Define the object outside of render (or memoize it) so it is not recreated
// on every render.
// NOTE: this API is explicitly unstable - hook names track internal style
// hooks and may change between minor releases.
const customStyleHooks = {
  useButtonStyles_unstable: (state: unknown) => {
    const buttonState = state as SlotState;
    buttonState.root.style.borderRadius = '0px';
    buttonState.root.style.textTransform = 'uppercase';
  },
  useInputStyles_unstable: (state: unknown) => {
    const inputState = state as SlotState;
    inputState.root.style.borderColor = '#6b2fbf';
  },
};

export const CustomStyleHooksExample = () => (
  <FluentProvider theme={webLightTheme} customStyleHooks_unstable={customStyleHooks}>
    <div style={{ padding: 16, display: 'grid', gap: 12, maxWidth: 360 }}>
      <Input defaultValue="Restyled input" />
      <Button appearance="primary">Restyled button</Button>
    </div>
  </FluentProvider>
);
```

## Pitfalls

- Rendering Fluent components with no FluentProvider in the tree. The markup renders, but every CSS custom property is undefined, producing transparent or collapsed visuals. Always wrap the app once at the root.
- Recreating the theme on every render, for example theme={createLightTheme(brand)} inline or a fresh object literal in JSX. This churns the injected style element - hoist the theme to module scope or memoize it.
- Setting applyStylesToPortals={false} without re-providing the theme inside the portal, which leaves dialogs, menus and tooltips without theme tokens.
- Assuming a nested provider also restyles portals. Portal content is not inside the inner provider's DOM subtree; keep portal-heavy UI within the provider whose theme it should show, or wrap the portaled content in its own provider.
- Pointing targetDocument at the wrong document (for example, leaving it as the outer document while the app is mounted in an iframe). Portals then mount in the wrong tree and modal focus traps move focus where the user is not looking.
- Treating customStyleHooks_unstable as a public, stable extension point. Hook names mirror internal style hooks and the state shape is untyped (unknown) by design; a minor upgrade can break them.
- Building a design system only from customStyleHooks_unstable or overrides_unstable instead of overriding design tokens through theme, which is the supported and forward-compatible customisation path.
- Forgetting the html-level direction attribute: the provider handles component context, but native UI such as scrollbars and browser-provided affordances follow the document's dir attribute.
- Assuming the provider handles language metadata. FluentProvider sets direction, not lang - screen readers still need lang on the html element (and on mixed-language content).

## Accessibility

FluentProvider is an accessibility-relevant component even though it renders no interactive UI of its own. It is the place where text direction is declared: the dir prop is written to the provider root and propagated through context, and direction affects reading order and layout mirroring for assistive technology, so keep it in sync with the actual content language. The provider does not set lang, so set <html lang> yourself (plus lang attributes on mixed-language content) or screen readers will guess the pronunciation. Because the provider owns the theme, it also effectively owns contrast: the built-in themes (webLightTheme, webDarkTheme, the Teams themes) are tuned to meet Fluent contrast targets, while custom brand ramps from createLightTheme/createDarkTheme and partial token overrides are not validated - verify at least 4.5:1 for text and 3:1 for UI boundaries. Components respond to operating-system high-contrast settings through design tokens, so avoid hard-coded colors that fight forced-colors mode and test with a high-contrast theme. When the app renders inside an iframe or popup window, passing the correct targetDocument matters for keyboard users: modal components trap focus inside the document the user is actually interacting with, and a wrong targetDocument can send focus into an invisible tree. Finally, the provider's root <div> adds no landmark or ARIA semantics, so page structure (headings, landmarks, skip links) must still come from your own markup.

**Referenced components**: FluentProvider, Button, Checkbox, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Field, Input, Menu, MenuPopover, OverlayDrawer, Popover, PopoverSurface, Portal, Switch, Tab, TabList, Text, Tooltip

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
