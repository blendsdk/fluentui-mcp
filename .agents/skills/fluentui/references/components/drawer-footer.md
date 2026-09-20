# DrawerFooter

> **Package**: `@fluentui/react-drawer` v9.13.0
> **Import**: `import { DrawerFooter } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

DrawerFooter is the dedicated footer region of a Drawer (used together with Drawer, InlineDrawer, OverlayDrawer, DrawerBody and DrawerHeader). It is a layout container whose single required slot, root, renders as a footer element by default but can also be rendered as a div, nav, or header, which lets the same component serve both as an action bar and as a secondary landmark inside the drawer. Because the drawer surface is composed of independent subcomponents, DrawerFooter is what keeps primary and dismissive actions visually anchored to the bottom edge of the drawer while scrolling content lives in DrawerBody above it. In the drawer family the footer is typically the last child, immediately after DrawerBody, and it participates in the drawer's inline vs overlay presentation and its optional separator treatment.

**When to use**: Use DrawerFooter whenever a drawer requires persistent actions at its bottom edge — for example Save and Cancel buttons in an edit panel, a submit action in a settings form, or close/next controls in a task flow. It is the right choice when the actions must remain visible while the drawer body scrolls, and when you want consistent spacing, alignment, and separator styling without hand-rolling a flex container. Prefer DrawerHeader for the title, description, and top-level navigation, DrawerBody for the scrollable content, and DrawerFooter only for the trailing action area. If your panel has no actions at all, omit DrawerFooter entirely rather than rendering an empty container. If the task is short and modal by nature, a Dialog with DialogActions may be a better fit than a Drawer, since drawers are intended for side-panel workflows and navigation that coexist with page content.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `action` | `Slot<'div'>` | — | No | — |
| `defaultOpen` | `boolean` | — | No | — |
| `heading` | `Slot<'h2', 'h1' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'div'>` | — | No | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'footer'>` | — | Yes | — |
| `root` | `Slot<'nav'>` | — | Yes | — |
| `root` | `Slot<'header'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `separator` | `boolean` | — | No | — |
| `type` | `'inline' \| 'overlay'` | — | No | — |

### Prop Guidance

- **root**: The required slot that renders the footer container. It defaults to a footer element and accepts as to switch to div, nav, or header when the footer needs different landmark semantics. Use footer for an action bar, nav when the footer holds secondary navigation, header only in unusual composed layouts, and div when a neutral wrapper without landmark semantics is required. Styling and className props should be applied through this slot. `footer`
- **heading**: An optional heading slot for the footer region, rendered as a heading element by default and allowing h1 through h6 or div via as. Use it sparingly — only when the footer needs its own visible label, such as grouping actions under a short section title — and pick a heading level that does not break the drawer's heading hierarchy, or use div when the label is presentational only. `h2`
- **action**: An optional slot rendered as a div, intended to hold a leading or secondary action cluster opposite the main buttons, such as a help link or a status indicator. Keep it free of competing primary calls to action so the footer retains a single dominant action. `div`
- **type**: Controls whether the drawer is presented inline alongside page content or as an overlay above it; the value is 'inline' or 'overlay'. Set it on the drawer so the footer's spacing, width, and separator rendering match the surrounding surface, and keep it consistent between the header, body, and footer within one drawer. `overlay`
- **separator**: Boolean that toggles a visible divider between the footer and the content above it. Enable it when DrawerBody scrolls, so users can see where the scrollable region ends; disable it when the drawer is short and the content does not scroll, to keep the surface visually quiet. `true`
- **defaultOpen**: Boolean that sets the initial open state of the drawer when it is uncontrolled. Use it for drawers that should be visible on first render, such as a persistent inline navigation panel, and switch to a controlled open state when application logic must drive visibility. `true`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Place DrawerFooter as the last child of Drawer, InlineDrawer, or OverlayDrawer, directly after DrawerBody, so the action bar is anchored to the bottom edge.
- Keep the footer focused on a small number of actions — ideally one primary action plus one dismissive action — so the drawer's exit path is unambiguous.
- Put the primary action last in reading order (right-aligned in left-to-right layouts) so it follows the natural tab sequence into the strongest action.
- Use the root slot's as option to render a footer element for an action bar, or a nav element when the footer contains a small set of secondary navigation links.
- Label the footer region with aria-label when it renders as footer or nav so assistive technology users can distinguish it from the header landmark.
- Let Drawer or InlineDrawer control the separator property so the footer's divider treatment stays consistent with the header and body.
- Provide an explicit close or cancel path in the footer for overlay drawers so users can always dismiss the panel without relying on Escape alone.

### Don'ts

- Don't put scrollable content such as long forms or lists inside DrawerFooter; the footer is a fixed action strip and long content there will crowd the viewport.
- Don't render two competing primary buttons in the footer; users cannot tell which action commits the task.
- Don't wrap DrawerFooter in your own fixed-position container — the drawer already manages the surface's positioning and z-index.
- Don't set type or separator on the footer expecting it to change the drawer's presentation independently; those settings belong to the drawer itself and must stay in sync.
- Don't use DrawerFooter for a navigation menu that belongs in DrawerHeader; header navigation and footer actions have different landmark semantics.
- Don't place DrawerFooter outside of a Drawer subtree, since it loses the drawer's context, spacing, and open/closed behavior.
- Don't rely on color alone to distinguish the primary footer action; combine appearance with position and a clear text label.

## Anti-Patterns

### Scrollable content in the footer

❌ Putting forms, lists, or long descriptive text inside DrawerFooter makes the fixed-height action strip grow, which crowds DrawerBody and can push actions off-screen on short viewports.

✅ Keep only short labels and controls in the footer and move all longer content into DrawerBody, which is designed to scroll independently beneath the footer.

### Multiple competing primary actions

❌ Two or more primary-appearance buttons in the footer make the commit action ambiguous and force users to read every label to find the intended path.

✅ Render exactly one primary action and express secondary choices with secondary or subtle appearance, or move additional choices into a Menu triggered from the footer.

### Rebuilding drawer chrome inside the footer

❌ Adding custom fixed positioning, borders, or z-index inside the footer duplicates the drawer's own layout management and produces double dividers and misaligned edges when the drawer type changes between inline and overlay.

✅ Let the drawer own positioning, background, and the separator prop, and limit footer styling to spacing, alignment, and color tokens on the root slot.

### Footer used as the only exit path without a keyboard equivalent

❌ If the sole way to close the drawer is a mouse-only element in the footer, keyboard and screen reader users can become stuck in an open overlay drawer.

✅ Always place a real focusable Button or Menu control in the footer and make sure Escape closes the drawer, returning focus to the element that opened it.

## Accessibility

**Requirements**: DrawerFooter must preserve a logical focus and reading order inside the drawer. Every action placed in the footer must be a real focusable control (Button, CompoundButton, Menu with MenuTrigger, Link) with an accessible name — never a clickable div. The footer must not trap focus itself; Escape must still close the drawer, and focus must return to the trigger when the drawer closes. Action targets should meet the WCAG 2.1 minimum target size of 24 by 24 CSS pixels, and text inside the footer must maintain at least 4.5:1 contrast against the footer background in both light and dark themes.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus forward through the interactive controls placed inside the footer. |
| `Shift+Tab` | Moves focus backward through the footer controls and back into the drawer body. |
| `Enter` | Activates the focused button or link in the footer. |
| `Space` | Activates the focused button in the footer, matching native button behavior. |
| `Escape` | Closes the containing drawer when it is dismissible, returning focus to the element that opened it. |
| `ArrowLeft / ArrowRight` | Moves between items when the footer contains a menu or other composite widget that supports arrow navigation. |
| `Home / End` | Moves to the first or last item when the footer hosts a composite list-like widget. |

**ARIA**: aria-label — names the footer region when it renders as a footer, nav, or header landmark and no visible label exists., aria-labelledby — points at the drawer title or a visible footer label when one exists., aria-describedby — associates the action area with supporting instructions or context text in DrawerBody., aria-hidden — applied only to purely decorative dividers or icons inside the footer, never to interactive controls., aria-disabled — communicates a temporarily unavailable footer action without removing it from the tab order when the reason is discoverable elsewhere.

**Screen Reader**: Screen readers announce the footer as a landmark (contentinfo when rendered as a footer element, navigation when rendered as nav) so users can jump directly to it. Controls inside are announced with their role, name, and state, and because the drawer is typically rendered in a dialog or modal context, the reading order follows the drawer's title, body, and footer. When the drawer opens, focus should be moved into the drawer content — usually the first focusable element or the footer's primary action — and the surrounding page content is hidden from the accessibility tree while an overlay drawer is open.

## Styling

DrawerFooter is a flex layout container, so most customization happens with Griffel tokens applied through className or the root slot's className. Use tokens.spacingVerticalL and tokens.spacingHorizontalL for comfortable padding around the action row, tokens.spacingHorizontalS or tokens.spacingHorizontalM for the gap between sibling buttons, and tokens.borderRadiusMedium when you need to inset a grouped surface. For the top divider that visually separates the footer from DrawerBody, use tokens.colorNeutralStroke1 or tokens.colorNeutralStroke2. Footer backgrounds that read as part of the drawer surface should use tokens.colorNeutralBackground1, while a slightly recessed action bar can use tokens.colorNeutralBackground2 or tokens.colorSubtleBackground. Icons and text inside footer buttons should inherit tokens.colorNeutralForeground1 for the default state and tokens.colorNeutralForegroundOnBrand when placed on a brand-colored primary action. Because the footer is a plain container, referencing tokens directly rather than hard-coded pixel or hex values keeps it correct in high-contrast and dark themes.

## Performance

DrawerFooter is a lightweight layout container with a single root slot, so rendering cost is dominated by the controls you place inside it. Keep the children list stable and avoid creating new inline objects or inline style objects on every render, since the drawer surface re-renders whenever its open state changes and inline styles defeat style memoization. Prefer passing static strings for appearance and size props rather than computed values, and avoid heavy content such as tables or images in the footer because the footer sits outside the scrollable region and will force the whole drawer to measure and reflow. If the footer actions depend on form state, isolate that state in a small child component so typing in DrawerBody does not re-render the entire drawer subtree.

## Theming & Tokens

DrawerFooter inherits all of its visual values from FluentProvider's theme, so it automatically responds to brand ramps and dark or high-contrast themes. Use tokens.colorNeutralBackground1 or tokens.colorSubtleBackground for the footer surface, tokens.colorNeutralStroke1 and tokens.colorNeutralStroke2 for the separator line above it, and tokens.shadow4 or tokens.shadow8 if you deliberately layer the footer above scrolling content. Spacing should come from tokens.spacingVerticalL, tokens.spacingVerticalM, and tokens.spacingHorizontalL rather than raw pixel values, and typography inside the footer heading should use tokens.fontSizeBase300, tokens.fontWeightSemibold, and tokens.colorNeutralForeground1. Brand-colored primary actions inside the footer pick up tokens.colorBrandBackground, tokens.colorBrandForeground1, and tokens.colorNeutralForegroundOnBrand automatically through Button's appearance prop.

## Migration Notes

When moving from hand-rolled drawer footers that used a plain div with custom flex styles, replace the wrapper with DrawerFooter and keep only the action controls as children so the drawer can apply its own spacing, separator, and inline versus overlay behavior. The root slot accepts an as option, so an existing footer element, nav element, header element, or div can be preserved without restructuring markup. Drawer-level settings such as whether the drawer renders inline or as an overlay, whether a separator is shown, and whether it starts open were previously managed by custom state in the surrounding layout and should now be expressed through the drawer's own props rather than re-implemented in the footer.

## Edge Cases

- DrawerFooter is a composition subcomponent and is not useful on its own — it must be rendered inside a Drawer, InlineDrawer, or OverlayDrawer subtree to inherit the drawer's layout and open state.
- Rendering the root slot as nav or header changes the landmark that assistive technology announces, so an action bar should stay a footer and only genuinely navigational footers should switch to nav.
- When separator is disabled on a short drawer, the footer can visually merge with DrawerBody; add spacing tokens or a subtle background change if the boundary still needs to be perceivable.
- The heading slot defaults to a heading element, so using it inside a drawer whose title is already an h2 can create duplicate or skipped heading levels unless the level is adjusted or the label is demoted to a div.
- In overlay mode the footer sits above the page content, so focusable page elements behind it remain in the DOM; the drawer must manage focus and hide background content from the accessibility tree to prevent focus from escaping the panel.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
