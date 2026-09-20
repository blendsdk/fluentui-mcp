# DrawerHeaderNavigation

> **Package**: `@fluentui/react-drawer` v9.13.0
> **Import**: `import { DrawerHeaderNavigation } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

DrawerHeaderNavigation is a layout and semantics primitive used inside the header of a Drawer to group the navigational controls that belong to the drawer's header region. It renders a single required root slot as a semantic nav element, which gives assistive technology a navigation landmark for the commands placed inside it (for example an overflow Menu, a back or close Button, a Tooltip-wrapped icon button, or a Link). The component holds no state and exposes no interactive behavior of its own: it is purely a container that supplies the correct element type, landmark semantics, and flex layout so that the controls passed as children line up consistently in both inline and overlay drawers. It is one of three cooperating header components in v9, alongside DrawerHeader (the header region that positions content) and DrawerHeaderTitle (the heading plus action area), and it is normally composed inside DrawerHeader at the top of the drawer.

**When to use**: Use DrawerHeaderNavigation when a drawer header must expose navigation-level affordances: an overflow menu of secondary actions, a back button, a settings or help action, or links to sibling views. It is the right choice whenever the controls are conceptually navigation (moving between views or application areas) rather than a page-level primary action, because the rendered nav element creates a landmark that screen reader users can jump to. Prefer a plain wrapper (or no wrapper at all) when the controls are simple presentational buttons with no navigational meaning. Use DrawerHeaderNavigation in the drawer header rather than inside DrawerBody; the body is for content and its own scrollers, and duplicating a navigation landmark there creates confusing structure. When the drawer contains a heading, pair DrawerHeaderTitle with DrawerHeaderNavigation inside DrawerHeader so the title and the navigation controls share one header row.

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
| `root` | — | Yes | — |

## Best Practices

### Do's

- Give the nav landmark an accessible name (for example via aria-label on the root slot) whenever the page contains more than one navigation landmark, so screen reader users can tell the drawer navigation apart from the global app navigation.
- Place DrawerHeaderNavigation inside DrawerHeader, next to DrawerHeaderTitle, so the header region owns the layout and the navigation controls visually align with the heading.
- Keep children to a small number of compact controls: an overflow Menu for secondary actions, one or two icon Buttons, and optionally a Link when a textual affordance is needed.
- Use the Menu-related components (Menu, MenuTrigger, MenuPopover, MenuList, MenuItem) for overflow actions so focus management and Escape handling come from the menu implementation instead of being hand-rolled.
- Wrap icon-only Buttons in Tooltip and still supply an aria-label on the Button itself, since the tooltip content alone is not a reliable accessible name.
- Use aria-current on a Link or Button that represents the currently active view so the active state is conveyed to assistive technology, not just through color.
- Order children deliberately: put primary navigation first (for example a back control) and destructive or dismiss controls last, matching the visual reading order to the semantic order.

### Don'ts

- Do not render interactive controls in DrawerHeaderNavigation without an individual accessible name; the landmark label describes the region, not the buttons inside it.
- Do not put page content, descriptive text, or long-form copy in DrawerHeaderNavigation; it is a control strip, not a content area.
- Do not nest DrawerHeaderNavigation inside DrawerBody or other landmarks to fake header styling; nesting nav landmarks inside each other produces ambiguous structure.
- Do not use it as a generic layout flexbox for non-navigational elements such as avatars, badges, or progress indicators that have no navigational role.
- Do not rely on color alone to indicate the selected or current item inside the navigation; pair visual styling with aria-current or a selected state.
- Do not hard-code pixel gaps and margins on the root when overriding styles; use the spacing tokens the rest of the drawer header uses so the header stays visually consistent.
- Do not assume DrawerHeaderNavigation accepts a heading; headings belong to DrawerHeaderTitle, and adding an h1-h6 inside this nav creates an unexpected heading level in the document outline.

## Accessibility

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
