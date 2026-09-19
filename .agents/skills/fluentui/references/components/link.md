# Link

> **Package**: `@fluentui/react-link` v9.8.2
> **Import**: `import { Link } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

Link is Fluent UI React v9's typographic navigation primitive: a single-slot component whose root renders as an anchor, a button, or any element supplied through polymorphism. When an href is provided the root becomes an anchor with native browser link behavior (URL preview, open-in-new-tab, context menu, link lists in screen readers). When no href is provided the root becomes a button, so the same visual treatment can drive in-page actions without pretending to be navigation. Its root can also be rendered as a span, in which case role="button" is applied automatically; span-rendered links behave as true inline elements and wrap across lines, unlike button-rendered links which are inline-block and do not wrap. Four dedicated props shape its presentation and state: appearance (default or subtle), disabled, disabledFocusable, and inline (for links embedded inside running text). Because it has no internal state, no icon slots, and no loading behavior, Link is the lightest interactive component in the library and is intended for text-level navigation and lightweight actions rather than for primary calls to action.

**When to use**: Use Link whenever the user is navigating to another page, a different route, a download, or an external destination — anywhere the semantic meaning is "go somewhere else," and especially inside paragraphs, list items, table cells, or other flowing text. Use the inline variant when the link sits inside a sentence, because it participates in text flow and is visually distinguished as part of the copy. Use appearance="subtle" when the link is secondary and should recede next to a stronger primary link or a busy surrounding surface. Use Link without an href when you want an action that is styled like a link but must not be a URL (the component then renders a button with correct button semantics). Prefer Button or CompoundButton for primary actions, form submissions, or anything that needs an icon slot, a loading state, shape/size variants, or a heavy visual weight, and prefer Menu, Tab, or Nav for structural navigation controls. If the whole surface should be clickable, use the surface's own interactive component instead of stretching a Link across it.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"default" \| "subtle" \| undefined` | `'default'` | No | A link can appear either with its default style or subtle. If not specified, the link appears with its default styling. |
| `disabled` | `boolean \| undefined` | `false` | No | Whether the link is disabled. |
| `disabledFocusable` | `boolean \| undefined` | `false` | No | When set, allows the link to be focusable even when it has been disabled. This is used in scenarios where it is important to keep a consistent tab order for screen reader and keyboard users. |
| `inline` | `boolean \| undefined` | `false` | No | If true, changes styling when the link is being used alongside other text content. |

### Prop Guidance

- **appearance**: Controls overall prominence. Leave it at the default "default" for primary, navigational links that should use brand color, and switch to "subtle" when the link is secondary, repeated many times, or sits in a visually busy region where brand color would compete with other emphasis. The value should reflect hierarchy, not decoration — do not alternate values arbitrarily across sibling links. `subtle`
- **disabled**: Marks the link as unavailable: the destination is no longer reachable and the click behavior is suppressed, and the link is removed from the tab sequence. Use it sparingly, and only when the surrounding context already explains why the destination cannot be reached; otherwise prefer letting users attempt the navigation and showing an error. `disabled`
- **disabledFocusable**: Only meaningful together with disabled. It keeps a disabled link in the tab sequence so keyboard and screen reader users encounter it in the expected order instead of having the sequence shift around it. Use it in toolbars, grids, and any layout where element positions must stay predictable. `disabledFocusable`
- **inline**: Set it whenever the link lives inside a sentence, list item, or paragraph of running text. It adjusts the styling so the link reads as part of the copy rather than as a standalone element, which is also what keeps the link distinguishable from plain text for users who cannot perceive color differences. `inline`
- **href**: The presence or absence of href decides the semantics of the whole component. Provide it for real destinations so the root renders as an anchor with native link behavior and the element is announced as a link. Omit it for in-page actions so the root renders as a button and is announced as a button. This means href is both a data prop and an accessibility switch. `https://www.bing.com`
- **as**: Changes the element the root renders. Rendering as an anchor keeps link semantics with href; rendering as a span produces an inline element that gets role="button" and wraps correctly across lines for very long content, which is useful when a button-rendered link would not wrap because it is inline-block. Keep this value stable for a given instance, because switching element types remounts the node. `span`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | Root of the component that renders as either an <a> or a <button> tag. |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Link } from '@fluentui/react-components';
import type { LinkProps } from '@fluentui/react-components';

export const Default = (props: LinkProps & { as?: 'a' }): JSXElement => (
  <Link href="https://www.bing.com" {...props}>
    This is a link
  </Link>
);
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Link } from '@fluentui/react-components';

export const Appearance = (): JSXElement => (
  <Link appearance="subtle" href="https://www.bing.com">
    Subtle link
  </Link>
);
```

### AsButton

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Link } from '@fluentui/react-components';

export const AsButton = (): JSXElement => <Link>Render as a button</Link>;

AsButton.parameters = {
  docs: {
    description: {
      story: ['When the `href` property is not provided, the component is rendered as an html `<button>`'].join('\n'),
    },
  },
};
```

## Best Practices

### Do's

- Write link text that is meaningful out of context, because screen reader users frequently navigate by pulling up a list of all links on a page — "View pricing details" is helpful, "click here" is not.
- Provide href for genuine navigation so the anchor keeps native behaviors: middle-click, open in new tab, copy link address, and inclusion in browser link lists and search engine crawling.
- Omit href deliberately when the element performs an in-page action, so the root renders as a button and the correct button semantics are exposed instead of a fake link.
- Set inline when the link is placed inside a sentence, so the styling and underline treatment match surrounding text and the link can wrap naturally with the copy.
- Pair disabled with disabledFocusable when the surrounding layout depends on a stable tab order, such as a toolbar or a data grid row, so keyboard users do not lose their place.
- Use appearance="subtle" for secondary or repeated links (breadcrumb-like trails, captions, dense table cells) to reduce visual noise while keeping the link recognizable.
- Set rel="noreferrer noopener" whenever you combine an external target with a new browsing context, and announce the new-window behavior in the link text or accessible name.
- Keep the as value stable for a given Link instance across renders, since changing the rendered element type causes React to unmount and remount the node, dropping focus.

### Don'ts

- Do not use Link with an href for actions that are not navigation (submitting, toggling, deleting) — a URL in the address bar that performs an action confuses users and breaks browser affordances such as refresh and back.
- Do not rely on color alone to identify a link inside body copy; without the inline treatment users with low vision or color deficiency may not perceive it as interactive.
- Do not override the link color with hardcoded hex values — theme switches, high-contrast mode, and brand overrides will all break, and the disabled and hover states will drift out of sync.
- Do not nest other interactive elements (buttons, checkboxes, another link) inside a Link, since nested interactive content is invalid and produces ambiguous focus and announcement behavior.
- Do not set disabledFocusable without also setting disabled; on its own it changes nothing meaningful and suggests intent that the component does not implement.
- Do not silently disable navigation without an explanation — provide adjacent helper text or a Tooltip explaining why the destination is unavailable, since a disabled link gives users no path forward.
- Do not use a Link as a layout wrapper around headings, images, or block content; it is a text-level element and stretching it with display changes distorts the inline model.
- Do not use a span-rendered link as a substitute for keyboard-inaccessible click handlers on static text unless you keep the click handler that makes it actionable.

## Anti-Patterns

### Link used as a button

❌ A Link with an href that runs an in-page action (toggling, submitting, deleting) shows a URL in the status bar and address bar that does not represent a real destination, breaks back/refresh expectations, and is announced as a link when it behaves as a button.

✅ Omit href so the root renders as a button with correct semantics, or switch to Button entirely if the action deserves a stronger visual weight or needs icon, size, or loading variants.

### Click handler attached to static text instead of a Link

❌ Handlers attached to plain text produce an element that is not focusable, has no role, and offers no keyboard or screen reader affordance — the interaction is invisible to anyone not using a mouse.

✅ Render a Link (using as="span" when you need inline wrapping) and let the component supply the role, focus behavior, and keyboard activation, or use a Button when the action is not navigation-shaped.

### Hardcoded color and decoration overrides

❌ Replacing the link color with a literal value or stripping the underline from inline links bypasses theme tokens, so the link stops responding to brand themes and high-contrast settings, and it may fail contrast or become indistinguishable from surrounding text.

✅ Use appearance and the inline prop for the intended look, and if an override is unavoidable use theme tokens such as tokens.colorBrandForegroundLink, tokens.colorNeutralForegroundDisabled, and tokens.textDecorationLineUnderline rather than raw values.

### Disabling links without a path forward

❌ A disabled link silently removes the interaction and, without disabledFocusable, also disappears from the tab sequence, so users have no way to learn why the destination is unavailable and their focus order shifts unexpectedly.

✅ Explain the restriction with adjacent helper text or a Tooltip, and pair disabled with disabledFocusable in composite layouts so the element keeps its place in the tab order.

### Non-descriptive link text

❌ Generic text such as "here" or "read more" gives no destination information when a screen reader user browses a list of links, and it forces speech-input users to guess what to say.

✅ Write self-contained link text that names the destination, or keep short visible text and supply a descriptive aria-label; make sure the accessible name still contains the visible text so voice control keeps working.

## Accessibility

**Requirements**: Target WCAG 2.1 Level AA. Comply with 1.4.1 Use of Color: when a link appears inside body text it must be distinguishable by more than color, which is why the inline treatment adds a non-color affordance. Comply with 1.4.3 Contrast (Minimum): link text defaults to token-driven brand and neutral foregrounds that meet 4.5:1 against their intended surfaces, but check any custom color override, particularly for appearance="subtle" on tinted backgrounds. Comply with 2.1.1 Keyboard and 2.4.3 Focus Order: every enabled Link must be reachable and activatable from the keyboard, and disabledFocusable exists specifically to preserve tab order in composite widgets. Comply with 2.4.4 Link Purpose (In Context): link text or an accessible name must describe the destination. Comply with 2.4.7 Focus Visible: the component renders a theme-driven focus outline using focus stroke tokens; do not remove or clip it. Comply with 4.1.2 Name, Role, Value: the root exposes link semantics with href, button semantics without href, and role="button" when rendered as a span, and communicates its disabled state to assistive technology.

| Key | Action |
| --- | --- |
| `Enter` | Activates the link: navigates to the destination when the root is rendered as an anchor with href, or invokes the click handler when the root is rendered as a button or a span. |
| `Space` | Activates button-rendered and span-rendered links; has no effect on anchor-rendered links, matching native browser behavior. |
| `Tab` | Moves focus to the next focusable element. Disabled links are skipped unless disabledFocusable is set, in which case the link remains in the tab sequence while staying non-activatable. |
| `Shift + Tab` | Moves focus to the previous focusable element, respecting the same disabled and disabledFocusable tab-order rules. |
| `Context Menu (or Shift + F10)` | On anchor-rendered links, opens the browser context menu for the link destination, an affordance that disappears when the root is rendered as a button or span. |

**ARIA**: role, aria-disabled, aria-label, tabindex (managed internally for disabled and disabledFocusable states)

**Screen Reader**: Anchor-rendered links are announced with the link role followed by their accessible name, are enumerated in the screen reader's link list, and can be navigated by link navigation commands; the accessible name comes from the link text or from aria-label when the visible text is not descriptive. Button-rendered links (no href) and span-rendered links (role="button") are announced as buttons instead, so users hear an action rather than a destination — this is the primary reason to choose one rendering over the other. When disabled is set, the interactive affordance is removed and the disabled state is conveyed to assistive technology, and the element is taken out of the tab sequence; when disabledFocusable is also set, it stays focusable so it can still be announced with its disabled state without breaking a composite widget's tab order. Regardless of rendering, keep any aria-label in sync with the visible text so speech-input users can activate the link by what they see.

## Styling

Style Link through className plus Griffel (makeStyles, mergeClasses, and makeResetStyles) rather than targeting internal classes. Text color should come from the theme: the default appearance resolves to tokens.colorBrandForegroundLink with tokens.colorBrandForegroundLinkHover, tokens.colorBrandForegroundLinkPressed, and tokens.colorBrandForegroundLinkSelected for interaction states, while appearance="subtle" resolves to the secondary neutral foreground family (tokens.colorNeutralForeground2 and its Hover, Pressed, and Selected variants) so it recedes into dense layouts. Disabled text should use tokens.colorNeutralForegroundDisabled so it stays legible but visibly inert. The focus indicator is drawn as an outline using tokens.colorStrokeFocus2 together with a stroke-width token (such as tokens.strokeWidthThick) and a rounded radius token such as tokens.borderRadiusMedium — if you reposition or clip the link, keep that outline visible. Typography follows tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.fontWeightRegular; only change them for a deliberate reason, since the link should match surrounding copy. For links inside paragraphs, the inline prop applies an underline treatment built from tokens.textDecorationLineUnderline; if you must suppress it, restore a non-color cue on hover and focus so the link remains distinguishable from plain text. When a span-rendered link needs to wrap inside a constrained container, use a resettable class from makeResetStyles for the wrapper (as demonstrated in the AsSpan story) so your layout reset does not fight the component's own atomic classes.

## Performance

Link is a stateless function component: it holds no internal state, subscribes to no context beyond the theme, and therefore never triggers re-renders on its own. Its styling is generated as atomic Griffel classes that are cached across the app, so repeated Links with the same appearance and inline combination share the same style rules. Avoid passing freshly created inline style objects or objects spread into className on every render, since those defeat class reuse and cause attribute churn on the DOM node. Avoid changing the as value or the href/anchor-versus-button decision between renders for the same position in the tree, because the element type change forces React to unmount and remount the node, which discards focus and any native state. For very large lists of links, keep the click handlers stable (for example, via data attributes and a single delegated handler) so React does not see new function props on every row.

## Theming & Tokens

Link is entirely token-driven. The default appearance uses the link foreground family — tokens.colorBrandForegroundLink, tokens.colorBrandForegroundLinkHover, tokens.colorBrandForegroundLinkPressed, and tokens.colorBrandForegroundLinkSelected — which is derived from the brand ramp, so switching the theme's brand or switching to a dark theme restyles links automatically. The subtle appearance uses the secondary neutral foreground family (tokens.colorNeutralForeground2 with its Hover, Pressed, and Selected companions), and the disabled state uses tokens.colorNeutralForegroundDisabled. Focus indication comes from the focus stroke tokens (tokens.colorStrokeFocus2) combined with a stroke-width and a radius token, so high-contrast themes and focus-visibility settings are honored. Typography is inherited from tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.fontWeightRegular, and inline decoration uses tokens.textDecorationLineUnderline. When a link must sit on a dark or brand-colored surface and you need to override its color, use the inverted link token family (tokens.colorNeutralForegroundInvertedLink and its Hover, Pressed, and Selected variants) so contrast stays intact across themes.

## Migration Notes

Compared with the previous generation of Fluent Link, the v9 component drops the styling escape hatches (style-object, theme, and token-override props) and the component-ref pattern in favor of className with Griffel, React ref forwarding, and theme tokens. Appearance is now an explicit prop with "default" and "subtle" values instead of being achieved by style overrides, and the disabled state is expressed through disabled plus the additional disabledFocusable flag for keeping a consistent tab order. The root is still polymorphic, but rendering as a span now automatically applies role="button", and omitting href still switches the root to a button. Because the old default underline treatment changed, audit body-copy links during migration and add inline where the link sits inside a sentence so it remains distinguishable from surrounding text.

## Edge Cases

- Omitting href switches the root from an anchor to a button, which is a semantic change, not just a visual one: the element is announced as a button, cannot be opened in a new tab, and is not included in link lists.
- Setting disabled suppresses activation and removes the link from the tab sequence; if a focus-order-sensitive layout depends on that element being reachable, add disabledFocusable, otherwise focus will appear to skip a step.
- A span-rendered link receives role="button" automatically, but it still needs an actionable handler to be meaningful — a span-rendered link with no handler is focusable-looking markup that does nothing.
- Button-rendered links are inline-block and therefore do not wrap correctly across lines for very long content, whereas span-rendered links behave as inline elements and wrap; choose as="span" deliberately when long labels must wrap inside flowing text.
- Changing the as value between renders causes React to unmount and remount the element, which loses focus and any transient DOM state — keep the rendering decision stable.
- A disabled anchor no longer carries a navigable destination, so code that reads the href later (analytics, tests, tooltips) will not find one; capture the destination from your own data instead.
- appearance="subtle" reduces contrast by design; check the specific text and background combination when placing subtle links on tinted or brand-colored surfaces, and consider an inverted foreground token when overriding.
- Combining inline with disabled produces a disabled-looking inline link that still flows with the paragraph; keep the surrounding copy understandable on its own, because the link text alone no longer implies availability.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
