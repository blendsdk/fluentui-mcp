# DrawerBody

> **Package**: `@fluentui/react-drawer` v9.13.0
> **Import**: `import { DrawerBody } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

DrawerBody is the scrollable content region of a Drawer. It is one of the three structural regions that make up a drawer — alongside the drawer header and footer — and it exists to host the primary content of the panel, such as navigation links, forms, settings, or detail views. The component renders a single required root slot, a div, which receives the drawer's content padding and acts as the overflow container when the content is taller than the available drawer height. DrawerBody is designed to be used inside the drawer family (Drawer, InlineDrawer, and OverlayDrawer) so that it inherits layout context such as whether the drawer is inline (in-flow with the page) or overlay (floating above the page), whether a separator is drawn between regions, and the drawer's open/closed state. Because the drawer family shares a common API surface, some props visible on the family (heading, action, type, separator, defaultOpen) are consumed by the surrounding drawer surface, while DrawerBody itself contributes the content region and the root slot that can be styled or replaced.

**When to use**: Use DrawerBody whenever you need a drawer panel to contain more than a title — that is, any drawer that holds navigation links, settings forms, filter controls, or detail content. It is the correct place for the bulk of a drawer's content, and it should always be paired with a header region so users understand what the panel is. Choose an inline drawer body when the panel should push or occupy layout space next to the main content, and an overlay drawer body when the panel should float above the page and be dismissed by the user. Do not use DrawerBody as a general-purpose layout container outside of a drawer, and do not use it as a substitute for a page-level content region, a DialogBody, or a Card; those components carry their own padding, focus, and landmark semantics. If the content is short and never scrolls, DrawerBody still works, but you may not need the drawer pattern at all — a Card or an inline panel may communicate the relationship to the underlying page more clearly.

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

- **root**: The single required slot on DrawerBody. It is a div that receives the drawer's content padding and hosts everything you render inside the panel. Style it with className to change padding, add flex layout, or enable overflow scrolling, or replace the element entirely when you need different semantics for the content region. `custom className applied to the body root to add flexGrow and overflowY`
- **heading**: Slot for the drawer's heading element (h1 through h6, or div). It belongs to the drawer's header region and supplies the accessible name for the panel; do not repeat a heading element inside the body for the same purpose, since duplicate headings confuse screen reader navigation. `h2`
- **action**: Slot for a container of action controls in the drawer. Actions such as close, edit, or dismiss belong in the header or footer region so they stay visible, not duplicated inside the scrollable body. `div containing the close button`
- **type**: Controls whether the drawer participates in page layout (inline) or floats above the page as an overlay. Set it on the surrounding Drawer so the body renders in the right context; an inline drawer keeps a persistent column beside content, while an overlay drawer places the body above a scrim and traps focus. `inline or overlay`
- **separator**: Boolean that draws a divider between drawer regions so the header, body, and footer read as distinct zones. Enable it when the drawer has both a header and a footer and the regions would otherwise blend together; it is a drawer-level setting that affects the body's boundaries rather than its interior. `true when the drawer has both a header and a footer`
- **defaultOpen**: Boolean controlling the initial open state when the drawer is used uncontrolled. Use it for a drawer that opens by default without a controlled open prop; once you need to programmatically open or close the drawer, switch to the controlled open prop and manage state yourself rather than mixing both. `true for a drawer that starts expanded`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Use DrawerBody as the single content region inside a drawer, with exactly one body per drawer so that content padding and scrolling behave predictably.
- Place DrawerBody between the drawer header and the drawer footer so the visual order matches the reading order for assistive technology.
- Style the root slot through className — for example to add a flex column layout, adjust padding with tokens.spacingVerticalL and tokens.spacingHorizontalL, or set overflowY to auto for long content.
- Keep the content inside the body focusable and reachable by keyboard; when the body is a custom scroll container, make sure a focusable element inside it can receive focus so keyboard scrolling works.
- Group related content inside the body with Field, Label, Divider, and section headings so long panels remain scannable.
- Handle overflow deliberately: give the body a minHeight of zero inside a flex column so the scroll region can shrink instead of forcing the drawer to grow.
- Configure open state, type, and separator on the surrounding Drawer rather than on the body, and let the body inherit that context.

### Don'ts

- Do not put the drawer title, close button, or other header affordances inside DrawerBody — use the drawer header region instead so the panel stays properly labelled.
- Do not place primary actions such as Save or Apply only in the scrollable body, where they can scroll out of view; pin them in the drawer footer.
- Do not render a nested Drawer or another overlay inside the body; overlays should be rendered at the application root to avoid stacking and focus traps conflicts.
- Do not hardcode fixed widths on the body to control the drawer's size; width belongs to the drawer surface, and the body should fill the space it is given.
- Do not disable scrolling on the body and then hide the remaining content; either let it scroll or restructure the content.
- Do not assume the body is always mounted and visible; an overlay drawer may keep its content mounted while hidden, so avoid side effects that depend on visibility.
- Do not rely on setting type, separator, or defaultOpen on the body itself to change drawer behavior — those are drawer-level concerns.

## Anti-Patterns

### Putting header and footer content in the body

❌ Titles, close buttons, and Save/Apply actions placed inside the scrollable body scroll out of view and lose the region structure that assistive technology relies on, so the panel becomes unlabelled or its primary action becomes unreachable.

✅ Render the title in the drawer's header region, primary actions in the drawer's footer region, and use DrawerBody only for the content in between.

### Building your own open/close and type behavior on the body

❌ Props such as type, separator, and defaultOpen are consumed by the surrounding drawer, so setting them on the body changes nothing and produces a drawer that looks correct in code review but behaves incorrectly at runtime.

✅ Configure open state, inline versus overlay behavior, and separators on the Drawer component, and let DrawerBody inherit that context.

### Manual overflow scrolling without keyboard access

❌ Applying a fixed height with overflow hidden, or a scroll container that no one can focus, hides content from keyboard-only users and can trap content that cannot be reached at all, violating WCAG reflow and keyboard requirements.

✅ Let the body scroll with overflowY auto and a minHeight of zero in flex layouts, and ensure at least one focusable element inside the body (or the container itself with a tabIndex of 0) so keyboard scrolling works.

### Nested drawers and stacked overlays inside the body

❌ Opening another Drawer from within a drawer body creates competing focus traps, ambiguous Escape handling, and z-index and scrim conflicts that are difficult to debug.

✅ Render drawers at the application root and, when a second level of detail is needed, use navigation within the same drawer body, a Menu or Popover anchored inside it, or a Dialog with a single clearly owned focus scope.

### Padding the body twice or not at all

❌ Wrapping content in extra padded containers on top of the body's default padding inflates whitespace, while stripping padding for full-bleed content and forgetting to restore it makes text and links touch the drawer edges, which harms readability and focus visibility.

✅ Reset the body's padding only when you genuinely need full-bleed content such as images or tables, and reapply consistent spacing with tokens.spacingVerticalL and tokens.spacingHorizontalL on the inner sections.

## Accessibility

**Requirements**: DrawerBody is a plain content container and does not add landmarks or names on its own, so the drawer as a whole must be labelled and the body must remain operable without a mouse. Ensure the surrounding drawer provides an accessible name through its heading region, and provide an aria-label or aria-labelledby when the visible heading is not sufficient. Body content must satisfy WCAG 2.1 AA contrast (4.5:1 for text, 3:1 for large text and meaningful non-text UI), all interactive elements inside must be reachable and operable by keyboard with a visible focus indicator, and any scrollable region must be keyboard-scrollable. Because overlay drawers hide the rest of the page, content behind them must not be focusable while the drawer is open, and focus must return to the trigger when the drawer closes. If the body contains navigation, expose it as a landmark (a nav element or an equivalent role) and label it so screen reader users can jump to it. Respect text reflow: body content should wrap rather than force horizontal scrolling at 320 CSS pixels.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and forward through the focusable elements inside the drawer body; in a modal overlay drawer, focus is trapped inside the drawer until it is closed. |
| `Shift+Tab` | Moves focus backward through the focusable elements inside the body, cycling within the drawer for modal overlay drawers. |
| `Escape` | Closes the surrounding overlay drawer when it is dismissible; the body itself does not handle this key. |
| `Page Down` | Scrolls the body content down by a page when the scrollable region or an element within it has focus. |
| `Page Up` | Scrolls the body content up by a page when the scrollable region or an element within it has focus. |
| `Arrow Down` | Scrolls the body vertically when focus is on the scroll container, and moves within composite widgets such as lists or menus placed inside it. |
| `Arrow Up` | Scrolls the body vertically when focus is on the scroll container, and moves within composite widgets such as lists or menus placed inside it. |
| `Home` | Moves to the beginning of the body content when the scroll container is focused, or to the first item of a composite widget inside the body. |
| `End` | Moves to the end of the body content when the scroll container is focused, or to the last item of a composite widget inside the body. |
| `Enter` | Activates buttons, links, and other controls hosted inside the body. |
| `Space` | Activates buttons and toggles inside the body, and scrolls the body downward when the scroll container itself has focus. |

**ARIA**: aria-label on the scrollable body region when the scroll area needs its own accessible name, aria-labelledby linking body content to the drawer's heading element, aria-modal and role dialog on the surrounding modal overlay drawer surface, aria-hidden applied to background page content while a modal overlay drawer is open, tabIndex="0" on the body or an inner region when it must be an independently keyboard-scrollable area, aria-describedby referencing supplementary instructions rendered inside the body

**Screen Reader**: Screen readers announce DrawerBody only as an unlabelled generic container by default; the meaningful announcement comes from the surrounding drawer surface, which is exposed as a dialog with the drawer's heading as its accessible name for modal overlay drawers. When a user opens an overlay drawer, focus moves into the drawer and the virtual cursor is confined to its content, so the body's content is read in DOM order — header content first, then the body, then the footer. A scroll region inside the body is only announced as scrollable when it is focusable; adding tabIndex of 0 and an accessible name lets screen reader users move focus to the region and use scroll commands. Controls rendered inside the body (Link, Button, Checkbox, Field-wrapped inputs) keep their normal announcements, and any content placed in the footer remains discoverable after the body content because it follows the body in reading order.

## Styling

DrawerBody's root is a div, so almost all customization is done through className on that slot. The body already provides the drawer's content padding (typically using tokens.spacingVerticalL and tokens.spacingHorizontalXXL in the default drawer styles); reset or extend it with your own padding values rather than nesting extra wrappers. For a body that fills a flex column layout, apply flexGrow of 1 and minHeight of 0 so the region can shrink and scroll instead of stretching the drawer; set overflowY to auto to enable scrolling. Use tokens.spacingVerticalS, tokens.spacingVerticalM, and tokens.spacingVerticalL to space stacked form rows, and tokens.spacingHorizontalM between inline elements. Section separators can use tokens.colorNeutralStroke2 for a subtle 1px border or the Divider component. Scrollbar-adjacent spacing and sticky footers inside the body pair well with tokens.shadow4 or tokens.shadow8 for depth. Focus rings should use tokens.colorStrokeFocus2 with a tokens.borderRadiusMedium radius so custom scroll containers keep a visible focus indicator. For full-bleed content such as images or tables, remove the default padding and reapply it to individual child sections.

## Performance

DrawerBody renders a single div wrapper, so its own cost is negligible; the cost comes from the content you place inside it. Content is mounted as part of the drawer subtree, and an overlay drawer may keep that subtree mounted while hidden, so avoid expensive work — data fetching, large tables, heavy charts — directly in the body when the drawer is opened and closed frequently. For long lists or grids inside the body, prefer virtualization (for example a DataGrid or a virtualized list) over rendering hundreds of rows, and memoize row components so drawer state changes do not re-render every item. Avoid creating new inline style objects or Griffel classes on every render for the root slot; define styles once with makeStyles and merge them with mergeClasses. Keep the body subtree shallow: deeply nested wrappers add layout work and complicate scrolling. If the drawer body only needs to exist while open, conditionally render it rather than hiding it with CSS.

## Theming & Tokens

DrawerBody is theme-aware through the FluentProvider: its text inherits tokens.colorNeutralForeground1 on a tokens.colorNeutralBackground1 surface, which automatically resolves to the correct light, dark, or high-contrast values. Any borders or dividers you add inside the body should use tokens.colorNeutralStroke1 or the subtler tokens.colorNeutralStroke2, and focus indicators should use tokens.colorStrokeFocus2 rather than hardcoded colors. Spacing is expressed in the theme's spacing ramp — tokens.spacingVerticalXXS through tokens.spacingVerticalXXL and tokens.spacingHorizontalXXS through tokens.spacingHorizontalXXL — so padding scales consistently with the rest of the design system. Typography inside the body should use tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300 for body text and tokens.fontSizeBase500 with tokens.fontWeightSemibold for section headings. Because the body is a plain container, it does not apply an appearance or color variant of its own; if you need a tinted region, use tokens.colorNeutralBackground2 or tokens.colorSubtleBackground to stay within the theme's neutral ramp.

## Migration Notes

For teams migrating from Fluent UI React v8, the v9 Drawer family replaces the v8 Panel component. In v8, Panel held its content as children with separate props such as isFooterAtBottom, isBlocking, and isLightDismiss; in v9 the structure is split into explicit header, body, and footer components, so panel content must be moved into DrawerBody and titles into the drawer header. v9 also separates inline and overlay behavior through InlineDrawer and OverlayDrawer plus the type value on the drawer rather than through flags like isBlocking and isLightDismiss, and styling moves from SCSS/mergeStyleSets to Griffel classes applied to the body's root slot.

## Edge Cases

- The body only scrolls when its content exceeds the space the drawer gives it; in a flex column layout you must set a minHeight of zero or the body will stretch the drawer instead of scrolling.
- Overlay drawers typically keep their content mounted while hidden, so timers, subscriptions, or focus calls inside the body may still run when the drawer is closed.
- An empty or non-focusable body leaves focus on the drawer surface itself when an overlay drawer opens, which can make the drawer feel unresponsive to keyboard users until they press Tab.
- type, separator, defaultOpen, heading, and action are drawer-level concerns shared across the family; setting them on the body does not change drawer behavior.
- Mixing a controlled open prop with defaultOpen gives confusing behavior because the controlled value wins after the first render — pick one model.
- Full-bleed content inside the body requires resetting the default padding, and forgetting to reapply spacing to inner sections causes text to touch the drawer edges and focus rings to be clipped.
- Sticky footers or sticky section headers inside the body require explicit positioning and a background from the theme, otherwise content scrolls visibly underneath them and contrast drops.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
