# Provider

> **Package**: `@fluentui/react-provider` v9.22.17
> **Import**: `import { Provider } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

Provider (rendered in the documented examples as FluentProvider) is the root context and theming component for Fluent UI React v9: it is the element that turns design tokens into actual CSS values and makes them available to every Fluent component rendered beneath it. It applies a theme object — a full theme such as web light, Teams light, or Teams dark, or a PartialTheme containing only a few overridden tokens — as CSS custom properties on a wrapper element, and exposes that scope through React context so children resolve color, typography, spacing, shadow, and motion tokens from the nearest provider. Because providers nest, a subtree can be re-themed by declaring only the tokens that differ, exactly as the Nested story does with three brand tokens inside a web light theme. Beyond theming, Provider owns several pieces of environment plumbing: the dir prop switches a subtree between left-to-right and right-to-left rendering, the targetDocument prop binds the provider (and the portals rendered inside it) to a specific Document instance such as an iframe, and applyStylesToPortals decides whether provider styles reach components that render through the Portal component. Two explicitly unstable escape hatches, customStyleHooks_unstable and overrides_unstable, allow style-hook and override customization for advanced scenarios, and the theme prop accepts a partial theme so token overrides cascade from the nearest ancestor. Provider renders no visible control of its own; its wrapper element is a plain container that you style with makeStyles and className when you need layout, backgrounds, or spacing for the themed region.

**When to use**: Render Provider once near the root of every Fluent UI React v9 application, above any component that consumes design tokens, so that buttons, text, inputs, dialogs, and every other Fluent surface resolve a coherent set of colors, type ramp, and spacing values. Nest an additional provider only when a specific region genuinely needs a different environment: a different theme (for example a dark panel inside a light page), a partial theme that overrides a few brand tokens, the opposite text direction via dir, or a different Document when rendering into an iframe via targetDocument. Choose Provider instead of styling components individually because tokens are read from context rather than passed as props, so a single provider changes the entire subtree without touching component code. If your application already has a provider from a host shell, do not add a redundant one — nest only to change something. Provider is also the mechanism you reach for when portaled content (dialogs, popovers, tooltips, menus) needs to share the surrounding theme, which is where applyStylesToPortals matters.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `applyStylesToPortals` | `boolean` | — | No | — |
| `customStyleHooks_unstable` | `FluentProviderCustomStyleHooks` | — | No | — |
| `dir` | `'ltr' \| 'rtl'` | — | No | — |
| `overrides_unstable` | `OverridesContextValue_unstable` | — | No | — |
| `targetDocument` | `Document` | — | No | — |
| `theme` | `PartialTheme` | — | No | — |

### Prop Guidance

- **theme**: Supplies the token values applied to the subtree. Pass a full theme for an application root and a PartialTheme when nesting to override just a handful of tokens; unspecified tokens continue to resolve from the nearest ancestor provider. Theme identity matters, so hoist or memoize the object instead of recreating it each render. `webLightTheme at the root; an object containing only colorBrandStroke1, colorBrandBackground2, and colorBrandForeground2 in a nested provider`
- **dir**: Sets text direction for the subtree. Default to left-to-right and set rtl on the provider that owns right-to-left content; pair it with a matching language declaration so screen readers pronounce the content correctly. Only the two literal values left-to-right and right-to-left are accepted. `rtl`
- **targetDocument**: Binds the provider to a specific Document instance. Use it when the themed subtree is rendered inside an iframe or another document, and pass the same Document to the portal renderer so portaled content lands in the styled document instead of the top-level one. Without it, a provider does not cross an iframe boundary. `the Document instance obtained for the iframe`
- **applyStylesToPortals**: Controls whether the provider's styles are applied to components that render through the Portal component. Enable it when dialogs, popovers, tooltips, or menus look unstyled or fall back to default tokens because their DOM lives outside the provider's wrapper. `true`
- **customStyleHooks_unstable**: An unstable escape hatch for replacing style hooks on Fluent components within this provider's scope. Use only for targeted, temporary overrides during migration or for one-off design requirements, and expect the hook names and shapes to change between releases. `a map of style hooks supplied for specific components`
- **overrides_unstable**: An unstable escape hatch that supplies override values, including the defaults used by Fluent components, within this provider's scope. Treat it as a migration aid rather than product API, since the structure of the override context is not part of the stable contract. `override values supplied through the overrides context`

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  const styles = useStyles();
  return (
    <>
      <div>
        <FluentProvider className={styles.provider} theme={webLightTheme}>
          <div className={styles.text}>Web Light Theme</div>
          <Button className={styles.button}>Web Light Theme</Button>
        </FluentProvider>
      </div>
      <div>
        <FluentProvider className={styles.provider} theme={teamsLightTheme}>
          <div className={styles.text}>Teams Light Theme</div>
          <Button className={styles.button}>Teams Light Theme</Button>
        </FluentProvider>
      </div>
      <div>
        <FluentProvider className={styles.provider} theme={teamsDarkTheme}>
          <div className={styles.text}>Teams Dark Theme</div>
          <Button className={styles.button}>Teams Dark Theme</Button>
        </FluentProvider>
      </div>
    </>
  );
};
```

### ApplyStylesToPortals

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import * as ReactDOM from 'react-dom';

export const ApplyStylesToPortals = (): JSXElement => (
  // FrameRenderer is redundant this example, it's used only to render portals inside an iframe
  // to make them visible in Storybook
  <FrameRenderer>
    {(externalDocument, renderer) => (
      <RendererProvider renderer={renderer} targetDocument={externalDocument}>
        <ApplyStylesToPortalsExample targetDocument={externalDocument} />
      </RendererProvider>
    )}
  </FrameRenderer>
);

ApplyStylesToPortals.parameters = {
  docs: {
    description: {
      story: [
        '`applyStylesToPortals` controls if styles from FluentProvider should be applied to components that use ',
        'Portal component.',
      ].join(''),
    },
  },
};
```

### Dir

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, tokens, FluentProvider } from '@fluentui/react-components';

export const Dir = (): JSXElement => {
  const styles = useStyles();
  return (
    <>
      <div className={styles.example}>
        <FluentProvider>
          <div className={styles.text}>Text left to right</div>
        </FluentProvider>
        <FluentProvider dir="rtl" lang="ar">
          <div className={styles.text}>نص من اليمين إلى اليسار</div>
        </FluentProvider>
      </div>
    </>
  );
};

Dir.parameters = {
  docs: {
    description: {
      story: 'A Fluent provider can render text left-to-right (LTR) or right-to-left (RTL).',
    },
  },
};
```

## Best Practices

### Do's

- Render a single Provider at the application root, above every Fluent component that reads design tokens, so the whole tree shares one coherent theme.
- Pass one of the shipped theme objects (web light, Teams light, Teams dark, and their dark or high-contrast counterparts) as the theme prop when you want a complete, supported palette.
- When nesting, pass only the tokens you actually intend to change — a PartialTheme is layered over the inherited theme, so the three-token override shown in the Nested story is the intended pattern.
- Hoist theme objects to module scope (or memoize them) so their identity is stable between renders and style recomputation is minimized.
- Set dir explicitly on the provider that wraps right-to-left content, and pair it with a language declaration as the Dir example does, so both text direction and pronunciation are correct.
- Set applyStylesToPortals when your application relies on Portal-based components and you want the provider's styles to reach the portaled output.
- Pass the Document instance to targetDocument when the subtree lives inside an iframe, as demonstrated in the Frame story, which pairs it with a RendererProvider for the same document.
- Give the provider a className produced by makeStyles when the themed region needs its own background, border, padding, or grid placement.
- Keep the provider import coming from the same component package as the components you render, so provider and consumers are always version-matched.

### Don'ts

- Don't wrap every individual component or each item in a list with its own provider; each nesting level adds another CSS variable scope and another context boundary for no benefit.
- Don't construct a brand-new theme object inline on every render — a changing identity forces style recomputation across the subtree.
- Don't paint colors, fonts, or spacing directly onto children with hardcoded values that duplicate a token, because a nested theme change will not affect them.
- Don't build product APIs on overrides_unstable or customStyleHooks_unstable; they are named unstable because their shape can change without a major release.
- Don't assume a provider crosses an iframe boundary — content rendered into a different Document needs targetDocument applied to the provider in that document.
- Don't nest a provider with an empty or unchanged theme simply to group markup; use a plain container element instead.
- Don't omit dir in an RTL locale and hope an ancestor attribute is picked up everywhere — set it on the provider that owns the RTL content.
- Don't rely on portaled surfaces inheriting your theme automatically if you have disabled or never enabled applyStylesToPortals.

## Anti-Patterns

### Provider sprawl

❌ Wrapping individual components, list items, or repeated rows in their own provider multiplies context boundaries and CSS variable scopes, increases style recomputation, and makes it unclear which theme actually wins.

✅ Keep one provider at the application root and nest a second only where the theme, direction, or target document genuinely changes, such as a dark panel inside a light page.

### Recreating the theme on every render

❌ Building a theme object inline inside render creates a new identity on each pass, which invalidates the provider's style computation and forces descendants that consume tokens to update unnecessarily.

✅ Define theme objects at module scope, or memoize them when they must be computed, so the identity stays stable across renders.

### Assuming portals inherit provider styles

❌ Components that render through the Portal component place their DOM outside the provider's wrapper; if applyStylesToPortals is not enabled (or the portal renders into a different document), those surfaces can miss the theme entirely.

✅ Enable applyStylesToPortals for the provider, and when the portal lives in another document, pass that same Document to targetDocument on both the provider and the portal renderer.

### Hardcoding colors instead of tokens

❌ Literal hex values or CSS variable names copied from a theme bypass the token layer, so a nested provider with an overridden partial theme leaves those surfaces visually stale and out of sync with Fluent components.

✅ Reference tokens such as tokens.colorNeutralBackground1, tokens.colorBrandBackground, or tokens.colorBrandStroke1 in makeStyles so any provider-driven theme change propagates automatically.

### Depending on unstable escape hatches

❌ customStyleHooks_unstable and overrides_unstable are named unstable for a reason: their shapes are not guaranteed across releases, so product code built on them will break on upgrade and can silently change component behavior for every descendant.

✅ Use them only as short-lived migration or one-off aids, isolate them, and prefer className plus makeStyles with tokens for lasting customization.

## Accessibility

**Requirements**: Provider is a context and token wrapper, not a control, so it adds no role, no landmark, and no focus behavior of its own — the accessibility burden it carries is environmental. Because it is the component that decides which theme tokens are active, it is directly responsible for WCAG 1.4.3 Contrast (Minimum) and 1.4.11 Non-text Contrast in the subtree: the theme you apply must produce sufficient contrast between foreground and background tokens for every state (rest, hover, pressed, disabled, focus). The dir prop is required for correct bidirectional support, since it determines the visual and logical order that assistive technology and CSS layout follow, and should be paired with an appropriate language declaration on the same element so screen readers use the right pronunciation rules (WCAG 3.1.1 Language of Page). The provider wrapper must never introduce a focus trap or remove focusability; keyboard users must be able to tab straight through it (WCAG 2.1.1 Keyboard). Focus indicators inside the subtree come from the theme's stroke and focus tokens, so a heavily customized PartialTheme must preserve visible focus (WCAG 2.4.7 Focus Visible).

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the provider's subtree and onward through its focusable descendants; the provider wrapper itself is not focusable and does not intercept the key. |
| `Shift+Tab` | Moves focus backwards through the subtree in reverse DOM order; the provider does not alter focus order, which follows DOM order and the direction set by the dir prop. |

**ARIA**: dir, lang, No role or aria-* attributes are added by the provider itself; ARIA semantics belong to the Fluent components rendered inside it

**Screen Reader**: Screen readers do not announce the provider wrapper because it exposes no role, name, or landmark — it is transparent to the accessibility tree. What the provider changes is the environment those readers operate in: the direction attribute it sets makes screen readers apply the correct reading order and cursor movement for right-to-left content, and a language declaration on the same element makes them select the correct pronunciation rules. Contrast, focus visibility, and control states that a screen reader reports all originate from the theme tokens the provider makes active, so switching or overriding a theme is effectively an accessibility-affecting change even though nothing is announced. Content moved into a portal keeps its own semantics, but it inherits the provider's tokens only when the portal renders into a document the provider styles.

## Styling

Style the provider's wrapper element through className generated by makeStyles, the same way the stories style the themed region, and use tokens.* values rather than literal values so the styling follows the active theme. For a themed surface, tokens.colorNeutralBackground1, tokens.colorNeutralBackground2, tokens.colorNeutralForeground1, and tokens.colorNeutralStroke1 give you background, raised background, text, and border colors that automatically swap when a nested provider changes theme. Brand-driven accents should use tokens.colorBrandBackground, tokens.colorBrandForeground1, tokens.colorBrandStroke1, tokens.colorBrandBackground2, and tokens.colorBrandForeground2 — the exact tokens the Nested story overrides — so your custom surface and Fluent components stay in sync. Layout and typography on the wrapper come from tokens.spacingHorizontalL, tokens.spacingVerticalM, tokens.borderRadiusMedium, tokens.shadow4, and tokens.fontFamilyBase, which is how the wrapper picks up the type ramp declared by the theme. Because the theme is emitted as CSS custom properties on the wrapper element, nested providers naturally cascade — you can also read the same values inside your own style rules without duplicating a palette. If you need to restyle portaled output (dialogs, popovers, tooltips, menus that render through Portal), rely on applyStylesToPortals rather than reaching into the portal container with global selectors.

## Performance

Provider applies its theme as CSS custom properties on a wrapper element and distributes values through context, so the cost of a provider is proportional to the size of the subtree that consumes it and the number of providers stacked over it. A stable theme identity is the single biggest lever: when the theme object is recreated each render, the provider recomputes its style rules and descendants that subscribe to tokens re-render. Deep provider nesting also produces long cascaded custom-property scopes and more style elements, which slows recalc and makes debugging harder, so nest deliberately rather than structurally. PartialTheme overrides are merged onto the inherited theme, which is cheap when the override object is small, but large ad hoc theme objects containing hundreds of tokens should be hoisted and reused instead of rebuilt. Contents of a provider are not memoized for you: a provider that changes theme re-renders the entire subtree, so keep frequently changing application state out of the provider's position in the tree. Enabling applyStylesToPortals adds style work for portal-hosted components, which is the intended trade-off when portaled surfaces must visually match the host theme.

## Theming & Tokens

Provider is the entry point for Fluent UI React v9 theming. The theme prop is applied as CSS custom properties on the wrapper element, which is why any descendant — and any nested provider — can read values through the tokens.* namespace. Full themes such as web light, Teams light, and Teams dark establish an entire palette, while a PartialTheme overrides only the tokens it names; the Nested example overrides colorBrandStroke1, colorBrandBackground2, and colorBrandForeground2 inside a web light scope, leaving everything else inherited. Prefer semantic tokens over raw palette values so overrides work as intended: tokens.colorNeutralBackground1, tokens.colorNeutralBackground2, tokens.colorNeutralForeground1, tokens.colorNeutralForeground2, tokens.colorNeutralStroke1, tokens.colorNeutralStroke2, tokens.colorBrandBackground, tokens.colorBrandForeground1, tokens.colorBrandStroke1, tokens.colorBrandBackground2, tokens.colorBrandForeground2, plus non-color tokens such as tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.lineHeightBase300, tokens.spacingHorizontalM, tokens.spacingVerticalS, tokens.borderRadiusMedium, tokens.shadow2, and tokens.durationNormal. Changing a token in a nested provider changes only that subtree, and because the values travel as CSS custom properties you can consume them directly in your own makeStyles rules without re-declaring the palette.

## Migration Notes

In Fluent UI React v9, theming is delivered by Provider rather than by the legacy theming utilities of v8: instead of a theme object being passed to every styled component or created with a theme creation helper, you wrap the app in the provider and consume tokens. Style customization that used to be done through styling prop functions is now expressed with makeStyles and tokens; the overrides_unstable and customStyleHooks_unstable props are the supported-but-unstable escape hatches for the cases where style hooks or overrides must be replaced, and they are expected to be used sparingly during migration rather than as a long-term public API. Direction handling also moves into the provider through dir, replacing older patterns of setting direction on individual components.

## Edge Cases

- A provider does not cross an iframe boundary: content rendered into an iframe needs the Document instance supplied to targetDocument on the provider in that document, and typically the same document supplied to the portal renderer as well, as the Frame story demonstrates.
- Styles do not automatically reach components that render through the Portal component; applyStylesToPortals governs whether the provider's styles are applied to that portaled output.
- A nested provider carrying a PartialTheme overrides only the tokens present in the object; every other token still resolves from the nearest ancestor provider, not from a fresh base theme, so a partial override can behave differently depending on where it is nested.
- Nesting a provider without a theme simply re-establishes the inherited environment (useful when only dir or targetDocument needs to change) and adds an extra wrapper element and context layer.
- Components rendered outside any provider may resolve tokens to undefined values and appear unstyled; if a subtree looks broken, verify it is inside a provider before debugging component-level styles.
- Direction is established by the provider that sets dir, so an RTL subtree that omits dir while an ancestor is also left-to-right will inherit the wrong direction; set dir on the provider that owns the RTL content and pair it with a matching language declaration, as the Dir story does.
- Right-to-left content should be verified with real bidirectional text, because layout mirroring and reading order problems only surface with mixed-direction strings.
- The unstable props customStyleHooks_unstable and overrides_unstable propagate to every Fluent component in the subtree, so an override intended for one control can unintentionally affect its descendants.

## See Also

- - [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
