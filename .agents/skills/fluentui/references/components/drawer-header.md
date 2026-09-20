# DrawerHeader

> **Package**: `@fluentui/react-drawer` v9.13.0
> **Import**: `import { DrawerHeader } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

DrawerHeader is the top region of a Drawer, used to introduce the drawer's purpose and to host the primary controls that belong at the top of the panel. It renders as a simple structural container (root) whose default layout supplies the padding and spacing that visually match either an inline drawer or an overlay drawer, and it exposes two dedicated slots: heading, which renders the drawer's title element (an h2 by default, with the ability to render other heading levels or a plain div), and action, which holds trailing controls such as a close button, overflow menu, or toolbar. Because it is a layout shell rather than a behavior component, DrawerHeader does not manage focus or open state on its own; it inherits the visual context (inline versus overlay) and the separator treatment from the Drawer configuration it is used within. It is typically composed together with DrawerHeaderNavigation for back buttons and contextual navigation, or with a heading-only arrangement for simple task drawers, and it always sits above DrawerBody inside either InlineDrawer or OverlayDrawer.

**When to use**: Use DrawerHeader whenever a Drawer needs a title, a close affordance, or top-aligned navigation, since it is the designated region for that content and applies the correct spacing, heading level, and alignment automatically. Reach for it instead of hand-rolling a header div inside DrawerBody whenever you want the separator line, the correct heading semantics for screen readers, and consistent padding with DrawerBody and DrawerFooter. Prefer DrawerHeader with a heading and an action for simple, single-purpose drawers; use DrawerHeaderNavigation inside the header when you need back navigation or tab-like navigation affordances. Avoid using DrawerHeader for page-level headers, toolbars, or card headers — those belong to Toolbar, CardHeader, or application chrome — because DrawerHeader's styling is tuned to the drawer surface and its type and separator behavior only makes sense within a Drawer.

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

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | The root of the DrawerHeader. |

## Best Practices

### Do's

- Give every drawer a DrawerHeader with a concise heading so the drawer has an accessible name and users can immediately tell what the panel is for.
- Put the close button or the most important global control in the action slot of DrawerHeader so it stays pinned at the top while DrawerBody scrolls.
- Let the heading slot render its default h2 in most cases; only override the element type when the surrounding page outline requires a different heading level.
- Match the header's presentation to the drawer type by rendering DrawerHeader the same way in overlay and inline drawers so layout does not jump between variants.
- Enable the separator on the header when the drawer body scrolls and content would otherwise visually collide with the heading.
- Use DrawerHeaderNavigation inside the header for back buttons and secondary navigation rather than placing raw buttons in the action slot.
- Keep header content to at most two lines of text plus icon buttons so the drawer body retains the majority of the vertical space.

### Don'ts

- Don't place long descriptive paragraphs or form fields in the header; move them into DrawerBody where they can scroll.
- Don't render more than one prominent action in the header — competing calls to action should live in DrawerFooter.
- Don't skip the heading slot and rely on visually styling text, because the header's heading element is what gives assistive technology a navigable landmark inside the drawer.
- Don't use DrawerHeader outside of a Drawer or in place of a page header, CardHeader, or Toolbar, since its spacing and separator treatment assume a drawer surface.
- Don't hard-code pixel padding or margins on the header's root to fix alignment; the spacing already matches DrawerBody and DrawerFooter and should be adjusted through tokens instead.
- Don't wrap the header's action controls in additional generic button styles that override the drawer's focus indicator, as that breaks keyboard visibility.

## Accessibility

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
