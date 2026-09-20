# InlineDrawer

> **Package**: `@fluentui/react-drawer` v9.13.0
> **Import**: `import { InlineDrawer } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

InlineDrawer is the in-flow, non-modal member of the Fluent UI React v9 Drawer family. Instead of floating above the page inside a portal with a backdrop, it renders as a participating element in the document layout - typically a flex child sitting beside the main content - so navigation rails, filter panels, and detail sidebars can stay visible and interactive while the user keeps working. It exposes two slots: root, the outer element that carries sizing, background, and the optional separator line, and surfaceMotion, the animated surface wrapper that drives the drawer's enter and exit motion. Its single public prop, separator, is a boolean that defaults to false and, when enabled, draws a divider line along the drawer's edge so the rail stays visually distinct from the content next to it. InlineDrawer is meant to be composed with DrawerHeader, DrawerHeaderNavigation, DrawerHeaderTitle, DrawerBody, and DrawerFooter to build a complete panel with a labelled header, a single scrollable body, and pinned footer actions, and it is imported from @fluentui/react-components.

**When to use**: Use InlineDrawer when the panel belongs to the page layout and should remain present rather than interrupt the user: persistent side navigation, a docked filter or settings rail, a master-detail side panel, or a contextual inspector that users move between while reading the main content. Choose it whenever keeping the surrounding content visible and clickable matters more than focusing attention on the panel. Switch to OverlayDrawer when the panel must cover the page with a backdrop on narrow viewports or when the user must finish with the panel before continuing, and use Dialog instead for short, blocking confirmations or focused forms. InlineDrawer is also the right choice when the surrounding layout is responsible for the drawer's width and position, since it has no built-in backdrop, focus trap, or dismiss-on-Escape behavior to fight with.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `separator` | `boolean \| undefined` | `false` | No | Whether the drawer has a separator line. |

### Prop Guidance

- **separator**: Boolean, defaults to false. Enables a divider line along the drawer's edge so the rail is visually separated from adjacent page content. Turn it on whenever the drawer surface and the surrounding background use the same or a similar color, which is the common case for a docked navigation rail; leave it off when the drawer already sits against a contrasting region, is inset with its own radius and elevation, or when a surrounding divider or border already provides the boundary. Avoid pairing it with your own border rules on the same edge, since the two lines will stack. `true`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |
| `surfaceMotion` | — | No | — |

## Best Practices

### Do's

- Reserve InlineDrawer for persistent, non-blocking chrome such as a navigation rail, filter panel, or detail sidebar that should stay visible while the user reads and edits the main content.
- Compose the surface with DrawerHeader (usually DrawerHeaderNavigation plus DrawerHeaderTitle), DrawerBody, and DrawerFooter so the panel has a labelled heading, one scrollable region, and pinned actions.
- Turn the separator prop on when the drawer and the page content share the same background color, so the boundary of the rail remains perceptible to all users.
- Place the drawer adjacent to the content it belongs to in the DOM so keyboard tab order and screen reader reading order match the visual arrangement.
- Give the drawer a stable width and height through the root slot or its flex container so sibling content does not reflow when the drawer's contents render or load.
- Let a single element - normally DrawerBody - own scrolling, and keep the rest of the drawer surface non-scrolling to avoid nested scrollbars.
- Label the drawer as a landmark: wrap it in a nav, complementary, or region element and point aria-labelledby at the heading rendered by DrawerHeaderTitle, or supply an aria-label.

### Don'ts

- Do not use InlineDrawer for blocking, modal tasks such as destructive confirmations or required forms; it renders no backdrop and traps no focus, so use Dialog or OverlayDrawer instead.
- Do not expect pressing Escape or clicking outside to dismiss an InlineDrawer - nothing in the component implements dismiss behavior for a non-modal surface.
- Do not hide the drawer with opacity, transform, or zero width while leaving its controls mounted and focusable, because keyboard users will tab into invisible content.
- Do not hand-roll border rules for the drawer edge when the separator prop expresses the same intent with theme tokens and forced-colors behavior.
- Do not nest a second full-height scroll container inside DrawerBody, as competing scroll regions make wheel, trackpad, and keyboard scrolling unpredictable.
- Do not render heavy, always-mounted content inside a drawer that is rarely visible; remove or conditionally render what the user cannot currently see.
- Do not rely on the drawer appearing or disappearing as feedback - it is not a live region, so announce important state changes with Toast or AriaLiveAnnouncer.

## Anti-Patterns

### Treating an inline drawer like a modal

❌ Teams put confirmations, required forms, or blocking workflows inside InlineDrawer and then expect a backdrop, focus trapping, and Escape-to-close. None of that exists for a non-modal, in-flow surface, so users can tab straight out of the panel and screen readers never announce it as a dialog.

✅ Move genuinely blocking content to Dialog, or switch to OverlayDrawer, which supplies the overlay and modal semantics. Keep InlineDrawer for panels that coexist with the page.

### Collapsing the drawer visually but leaving it tabbable

❌ Setting width to zero or animating opacity or transform hides the drawer on screen while all of its buttons and links stay mounted and focusable, so keyboard users tab through controls they cannot see and screen reader users encounter a panel that appears to be absent.

✅ Unmount the drawer content, apply display none, or use the hidden attribute when the panel is collapsed, and only keep the drawer mounted with full focusability when it is genuinely available on screen.

### Hand-rolling the divider instead of using separator

❌ Custom border classes on the root slot duplicate or override the separator line, produce doubled or misaligned edges, and hard-code colors and widths that break in dark themes and forced-colors mode.

✅ Use the separator prop for the boundary and, if it needs restyling, override it with theme tokens such as tokens.colorNeutralStroke1 and tokens.strokeWidthThin rather than literal color values.

### Replacing the surfaceMotion slot with an inline component definition

❌ Passing a newly created component function to the surfaceMotion slot on every render changes the element type between renders, forcing React to unmount and remount the entire drawer subtree, which loses scroll position and internal state and replays the animation.

✅ Define a custom motion component once outside of render, or leave the default motion in place and adjust timing with animation-related theme tokens instead.

### Letting the drawer and its body both scroll

❌ A drawer root with overflow and a DrawerBody with its own overflow create nested scroll containers, so wheel gestures and Page Down/Page Up jump between two regions unpredictably and the panel header can scroll away.

✅ Keep the root and header non-scrolling, and let DrawerBody be the single scrolling region for the panel.

## Accessibility

**Requirements**: InlineDrawer is non-modal and renders in normal document flow, so WCAG 2.1 requirements fall on the content you place inside it rather than on the component: every control must be reachable and operable by keyboard in an order that matches the visual layout, the panel should be exposed as a landmark with an accessible name (a nav, complementary, or region wrapper labelled with aria-label or aria-labelledby that references the DrawerHeaderTitle heading), and it must never be marked up with role dialog or aria-modal. When the drawer is visually collapsed or hidden, its interactive children must be removed from the tab order (unmount them, apply display none, or use the hidden attribute) so focus cannot land on invisible elements. Non-text contrast matters for the separator line, which should keep at least 3:1 contrast against adjacent surfaces, and all text inside must meet 4.5:1 contrast; the default tokens used by the separator and by text inside the drawer satisfy this, but custom background overrides can break it.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and through the drawer's focusable children in DOM order; InlineDrawer itself does not manage, wrap, or trap focus. |
| `Shift+Tab` | Moves focus backwards through the drawer content and onward out to the preceding page content, again without any focus containment by the drawer. |
| `Enter` | Activates a focused button, link, or navigation item inside the drawer; this is handled by the child component, not by InlineDrawer. |
| `Space` | Activates a focused button or toggle inside the drawer; also handled entirely by the child component. |
| `Escape` | Not handled by InlineDrawer - because it is non-modal there is no built-in dismiss behavior, so the app must decide and implement whether Escape hides the panel. |
| `Arrow keys` | Not handled by the drawer itself; composite children such as Nav or Tree implement their own arrow-key navigation within the panel. |

**ARIA**: aria-label, aria-labelledby, aria-expanded, aria-controls, aria-hidden, role (navigation, complementary, or region on the element wrapping the drawer)

**Screen Reader**: Because InlineDrawer renders in flow and is not a dialog, screen readers read its contents as ordinary page content in document order: the heading from DrawerHeaderTitle becomes part of the page's heading outline and navigation links are read like any other links. Nothing is announced automatically when the drawer appears or disappears, since there is no live region, no focus move, and no aria-modal dialog semantics; if the panel's state changes meaningfully, announce it explicitly. A landmark wrapper with an accessible name lets users jump to the panel directly, and hidden-but-mounted drawer content remains reachable by virtual cursor, which is why visually collapsing the drawer without unmounting or hiding it is a real defect rather than a cosmetic one.

## Styling

The root slot is the element to style for layout: set width, height, display, and background there through className, since Fluent merges your class after the base classes and it typically wins. Common customizations are a background of tokens.colorNeutralBackground1 or tokens.colorNeutralBackground2 to separate the rail from the page, padding using tokens.spacingHorizontalM and tokens.spacingVerticalM, and a rounded inset look with tokens.borderRadiusMedium or tokens.borderRadiusLarge. For the boundary line, prefer the separator prop rather than writing your own border; if you must restyle it, mirror the token approach with tokens.colorNeutralStroke1 and tokens.strokeWidthThin so it stays theme-aware and survives forced-colors mode. Use tokens.shadow4 if the drawer should read as floating above the content rather than flush with it, and tokens.colorStrokeFocus2 for any custom focus treatment. The surfaceMotion slot accepts a replacement motion component, letting you change the enter and exit animation; if you do replace it, keep the component identity stable across renders and forward the provided slot props so className merging and refs still work. Motion timing should use theme motion tokens such as tokens.durationNormal, tokens.durationSlow, tokens.curveEasyEase, or tokens.curveDecelerateMid so the drawer animates in step with the rest of the design system.

## Performance

InlineDrawer does not use a Portal, so its subtree lives in the layout tree exactly where it is declared and is always part of the React render tree while mounted; heavy content that users rarely see should be conditionally rendered rather than merely hidden. Because the drawer is a layout sibling of the main content, animating its width or height forces the browser to recalculate the layout of the whole row on every frame, so keep the motion short and token-driven (tokens.durationNormal range) or prefer transform and opacity based motion for smoother frames. Keep slot component identities stable, especially for surfaceMotion, because a component function that changes identity between renders remounts the entire drawer subtree. ResizeObserver-driven children such as Overflow or overflowing Nav containers will re-measure repeatedly while the drawer's size is animating, so let the animation settle before triggering layout-sensitive updates, and memoize large navigation trees so unrelated parent renders do not re-render the panel.

## Theming & Tokens

InlineDrawer itself paints very little: its only built-in themed visual is the separator, which is drawn with tokens.colorNeutralStroke1 at tokens.strokeWidthThin, so it automatically adapts when FluentProvider swaps in a dark, high-contrast, or branded theme. Everything else - surface background, text color, spacing, and typography - comes from the child components (DrawerHeader and DrawerHeaderTitle contribute heading typography such as tokens.fontSizeBase400, tokens.fontWeightSemibold, and tokens.colorNeutralForeground1; DrawerBody contributes padding and text colors such as tokens.colorNeutralForeground2) plus any classNames you add on the root slot. Apply theme tokens rather than literal colors when you customize, for example tokens.colorNeutralBackground1 or tokens.colorNeutralBackground2 for the rail, tokens.colorNeutralBackground2Hover for interactive rows, tokens.colorNeutralForeground1Hover for hovered labels, and tokens.shadow4 for elevation; these all resolve through the theme provided by FluentProvider, so custom themes built on the Fluent theme API change every drawer surface consistently and directional layouts are handled by the provider rather than by per-component overrides.

## Migration Notes

Fluent UI React v8 did not ship a Drawer in @fluentui/react, so most teams either used Panel or hand-built sidebars with absolute positioning. Panel rendered non-blocking with type custom maps closely to InlineDrawer, while Panel configurations that dimmed the page, trapped focus, or blocked interaction map to OverlayDrawer; teams coming from an older Drawer with inline or push behavior (for example the Northstar Drawer) should map that variant to InlineDrawer and the overlay variant to OverlayDrawer. The separator prop replaces the ad-hoc border CSS those implementations usually carried, and because InlineDrawer is explicitly non-modal you should delete any manual focus-trap or scroll-lock code that was paired with the old sidebar, or move that behavior to OverlayDrawer or Dialog if it was actually required. Layout that previously relied on fixed positioning and z-index must be re-expressed with normal flex sizing, since InlineDrawer participates in the page layout instead of escaping it.

## Edge Cases

- Only the separator prop draws chrome: with separator left at its default of false a drawer whose background matches the page is visually indistinguishable from surrounding content, and if you also add your own border on the same edge the two lines can render as a doubled divider.
- The drawer has no built-in open, close, or dismiss logic - the parent owns whether it is shown - so hiding it visually without unmounting or properly hiding it leaves its controls in the tab order for keyboard and screen reader users.
- Because InlineDrawer is in flow, it needs a height to work with: inside a flex row where ancestors do not establish a definite height, the drawer stretches to the tallest sibling, and inside an ancestor with overflow hidden the panel's scrolling body can be clipped or produce an unexpected outer scrollbar.
- Replacing the surfaceMotion slot requires the replacement to accept and forward the slot props (including className and ref); otherwise class merging, refs, and motion props are dropped and the drawer loses its animation or its styling.
- In forced-colors or high-contrast mode background colors are stripped, so the separator's stroke color should be explicitly preserved through theme handling if the boundary must remain visible.
- A drawer placed after the main content in the DOM makes keyboard and screen reader users traverse the entire page before reaching the navigation, so ordering the drawer before the content region is usually necessary even though it renders on the right or left visually.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
