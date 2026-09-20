# MenuPopover

> **Package**: `@fluentui/react-menu` v9.25.0
> **Import**: `import { MenuPopover } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

MenuPopover is the floating surface of the Fluent UI React v9 Menu compound component. It renders the overlay element that contains the MenuList and MenuItem content for a menu, positioned relative to the element rendered by MenuTrigger and layered above the rest of the page. Because the v9 menu is a composition of parts rather than a single component with an items array, MenuPopover owns everything about how the menu appears once it is open: the elevated surface treatment, background, border radius, minimum and maximum width, dialog-adjacent dismissal behavior, and placement when there is not enough viewport space. Its single slot, root, is a plain div, so the component accepts className, style, and standard div attributes for customization. It supports nested menus for submenus, inline rendering for menus embedded in normal document flow (for example inside a navigation drawer), hover-triggered and context-menu-triggered opening, hover delay tuning, dismissal on scroll, persistence of the surface after an item is clicked for multi-select workflows, and optional checkmark and icon columns driven by checked values. Mounting is deferred until the menu opens, so the surface costs nothing while the menu is idle.

**When to use**: Use MenuPopover whenever you present a set of commands or actions that belong to a trigger such as a MenuButton, a SplitButton, or a right-click context menu. It is the correct choice when the user needs a compact, dismissible list of actions rather than a persistent panel of controls: pair it with MenuTrigger to render the anchor and with MenuList and MenuItem to render the contents. Choose it for grouped command sets, for submenu hierarchies, for checkbox-style multi-select action lists, and for context menus on data surfaces such as DataGrid rows or list items when openOnContext is enabled. Prefer inline rendering through the inline prop when the menu is embedded in a persistent navigation structure rather than floating over content. Reach for alternatives when the interaction model differs: use Dropdown or Select when the user is picking a form value that must persist as a field, use Popover when the surface holds arbitrary rich content, paragraphs, or form controls rather than menu semantics, use Toolbar or ToolbarGroup when actions should always be visible, and use Drawer or InlineDrawer for larger persistent navigation regions that would be too heavy for a popover.

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

- Always render MenuPopover as a sibling of MenuTrigger inside a Menu, so the trigger owns focus return and open state while the popover owns the overlay layer.
- Set positioning when the default placement would cover important context, such as anchoring a DataGrid row menu below the row instead of over the row's data.
- Use openOnHover together with a sensible hoverDelay so menus inside a toolbar or menu bar open predictably instead of flickering as the pointer sweeps across triggers.
- Use persistOnItemClick together with MenuItemCheckbox or MenuItemRadio when the menu is a multi-select filter, so the user can toggle several options in one visit.
- Enable hasCheckmarks and hasIcons consistently across a menu so every row reserves the same leading space and labels stay aligned when some items have state and others do not.
- Prefer an inline MenuPopover for menus that live inside a NavDrawer or other persistent navigation region, since a floating surface inside a drawer creates confusing stacking and scroll behavior.
- Keep the item count in a single MenuPopover modest and push related groups into MenuGroup, MenuDivider, or a submenu so users can scan the list quickly.

### Don'ts

- Do not place arbitrary rich content such as paragraphs, inputs, or images directly in MenuPopover; menu semantics only describe menuitem, menuitemcheckbox, and menuitemradio descendants.
- Do not use MenuPopover as a form control replacement for Select or Combobox, because a menu choice is not exposed as a persistent field value to assistive technology.
- Do not enable both openOnHover and openOnContext on the same trigger unless the interaction model is genuinely mixed, since hover and right-click activation produce different open reasons and can confuse state handling.
- Do not enable closeOnScroll in full-page applications where the page itself scrolls, because a slight page scroll will dismiss the menu while the user is still reading it.
- Do not nest Menu, MenuTrigger, and MenuPopover more than two levels deep without a clear hierarchy; deep submenu chains are hard to navigate with a pointer and even harder from the keyboard.
- Do not style the surface with hard-coded colors, shadows, or pixel paddings, because the menu will not adapt to dark, high-contrast, or brand-variant themes.
- Do not rely on persistOnItemClick for items that navigate or submit, because the menu would remain open and obscure the result of the action.

## Accessibility

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
