# MenuGroup

> **Package**: `@fluentui/react-menu` v9.25.0
> **Import**: `import { MenuGroup } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

MenuGroup is a non-interactive container that clusters related items inside a Menu, giving them a single semantic grouping (a div root exposed as the root slot and rendered with role group). It paints no chrome of its own: its job is to establish structure so that screen reader users hear "group" boundaries and so that long menus can be visually organized into sections. In practice it is paired with MenuGroupHeader, which supplies the visible (and, when labelled, announced) section title, while MenuItem, MenuItemCheckbox, MenuItemRadio, MenuItemLink, or MenuItemSwitch supply the actual interactive rows. MenuGroup itself introduces no state, no context provider, and no keyboard handling; the arrow-key, Home/End, Escape, and typeahead behaviour of the surrounding MenuList operates across groups as though the group wrapper were not there. The prop surface it participates in covers group identity and selection bookkeeping (name, checkedItems, value, checkedValues, defaultCheckedValues, onCheckedValueChange), item-level behaviour inherited by the children it wraps (disabled, disabledFocusable, href, hasSubmenu, persistOnClick, switchIndicator), and the open/positioning behaviour of the owning menu or trigger (open, defaultOpen, onOpenChange, openOnHover, openOnContext, hoverDelay, inline, positioning, closeOnScroll, persistOnItemClick, focusFirst, disableButtonEnhancement).

**When to use**: Use MenuGroup when a menu is long enough that items need to be organized into labelled sections, when menu items fall into distinct functional categories (for example view actions versus destructive actions versus navigation links), or when assistive technology users would benefit from hearing discrete group boundaries while arrowing through a list. It is the right choice when you also want a visible section heading, because MenuGroupHeader is styled to sit at the top of a group inside a MenuPopover. Prefer a plain MenuDivider without a group when a menu has only a few items and the separation is purely cosmetic, since an unlabelled or single-item group adds announcement noise for screen reader users. Prefer MenuGroup over manually inserting decorative headings as disabled MenuItems, which pollutes the menu's focus order. For top-level application navigation, use Nav, NavItem, or NavCategory instead of a menu; for command surfaces with many sections inside a toolbar, use Toolbar, ToolbarGroup, and ToolbarDivider. When selection is the goal, put MenuItemCheckbox or MenuItemRadio instances inside the group so the checkedValues, defaultCheckedValues, and onCheckedValueChange props have something to report against.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `checkedItems` | `string[]` | — | Yes | — |
| `checkedValues` | `Record<string, string[]>` | — | No | — |
| `children` | `[JSXElement, JSXElement] \| JSXElement` | — | Yes | — |
| `closeOnScroll` | `boolean` | — | No | — |
| `defaultCheckedValues` | `Record<string, string[]>` | — | No | — |
| `defaultOpen` | `boolean` | — | No | — |
| `disableButtonEnhancement` | `boolean` | — | No | — |
| `disabled` | `boolean` | — | No | — |
| `disabledFocusable` | `boolean` | — | No | — |
| `focusFirst` | `() => void` | — | No | — |
| `hasCheckmarks` | `boolean` | — | No | — |
| `hasIcons` | `boolean` | — | No | — |
| `hasSubmenu` | `boolean` | — | No | — |
| `hoverDelay` | `number` | — | No | — |
| `href` | `string` | — | Yes | — |
| `inline` | `boolean` | — | No | — |
| `name` | `string` | — | Yes | — |
| `name` | `string` | — | Yes | — |
| `onCheckedValueChange` | `(e: MenuCheckedValueChangeEvent, data: MenuCheckedValueChangeData) => void` | — | No | — |
| `onOpenChange` | `(e: MenuOpenEvent, data: MenuOpenChangeData) => void` | — | No | — |
| `open` | `boolean` | — | No | — |
| `openOnContext` | `boolean` | — | No | — |
| `openOnHover` | `boolean` | — | No | — |
| `persistOnClick` | `boolean` | — | No | — |
| `persistOnItemClick` | `boolean` | — | No | — |
| `positioning` | `PositioningShorthand` | — | No | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `switchIndicator` | `Slot<'span'>` | — | No | — |
| `value` | `string` | — | Yes | — |

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Give every MenuGroup a visible MenuGroupHeader child or, when a visible heading is undesirable, pass an accessible label such as aria-label or aria-labelledby through the root slot so the group is announced with a name.
- Keep each group to a small, coherent set of related items — typically three to eight — so the group reads as a section rather than a second menu level.
- Put the most frequently used group first and reserve the last group for destructive or irreversible actions so the position is predictable.
- Use MenuGroupHeader for headings rather than disabled or non-focusable MenuItem rows, keeping the focus order limited to real commands.
- Set hasCheckmarks or hasIcons on the owning menu list when any group contains checkbox, radio, or icon-bearing items so that all groups reserve the same leading space and text aligns across sections.
- Use the name and value props consistently across the items of a group when the group participates in checkbox or radio selection, and read or write the aggregate through checkedValues, defaultCheckedValues, and onCheckedValueChange.
- Order and label groups the same way each time a given menu is opened, so muscle memory and screen reader expectations hold between visits.
- Use focusFirst (or the equivalent imperative handle) when a menu is opened programmatically and focus must land on the first item of a specific group.

### Don'ts

- Do not use MenuGroup purely to add vertical spacing; use MenuDivider between sections when there is no need for a semantic or visible grouping.
- Do not leave a group unlabelled and therefore announced only as an anonymous group by screen readers.
- Do not wrap arbitrary interactive content — plain buttons, inputs, or non-menu elements — inside a MenuGroup, because the surrounding menu expects menuitem roles for arrow-key navigation.
- Do not nest a MenuGroup directly inside another MenuGroup; flatten the structure and use separate sibling groups with distinct headers instead.
- Do not repeat the same MenuGroupHeader text for multiple groups in one menu; duplicate labels make it impossible to tell sections apart when navigating by group.
- Do not build a group whose items are all disabled, which produces a heading that leads nowhere and forces extra arrow-key presses.
- Do not apply padding, margins, or backgrounds directly to the MenuGroup root expecting it to inset its children; delegate spacing to MenuGroupHeader and to the items themselves.
- Do not rely on MenuGroup for keyboard behaviour; it provides none, and the surrounding MenuList must own focus movement, Escape handling, and typeahead.

## Accessibility

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
