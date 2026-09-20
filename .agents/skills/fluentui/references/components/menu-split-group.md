# MenuSplitGroup

> **Package**: `@fluentui/react-menu` v9.25.0
> **Import**: `import { MenuSplitGroup } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

MenuSplitGroup is a layout primitive for menus that turns a single row into a "split item": one half performs a primary action and the other half exposes a nested submenu. It renders as a single root div that lays its two children out horizontally and stretches them to equal height, so the left half (typically a MenuItem or MenuItemLink) behaves like a normal item while the right half (typically a MenuTrigger wrapping a MenuPopover) opens the submenu chevron. Because it is purely structural, MenuSplitGroup carries no open/close state of its own; the surrounding Menu, MenuTrigger, MenuItem, and MenuList components supply all behavior, checked-value notification, keyboard handling, and accessible semantics. It is most commonly used inside a MenuPopover to give users both a fast path (execute the default action) and a discovery path (open a flyout of related actions) from the same row, mirroring the SplitButton pattern inside navigation menus.

**When to use**: Use MenuSplitGroup when a menu entry has a dominant default action plus a family of secondary or related actions that belong behind a flyout, and you want both reachable from one row without duplicating entries. It is the menu-row equivalent of SplitButton: choose it when the primary action is the common case and the extra options are occasionally needed. Prefer a plain MenuItem when there is only one action, a MenuItem with a nested MenuPopover when there is no meaningful default action, and a Toolbar with a ToolbarButton plus Menu when the split affordance lives in a toolbar rather than inside an open menu. Avoid MenuSplitGroup in flat, single-level menus where a submenu adds a level of nesting the user never needs.

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

### Prop Guidance

- **children**: Required and expects exactly two elements: a primary action child (MenuItem or MenuItemLink) and a submenu trigger child (typically MenuTrigger wrapping a MenuPopover). Passing one child or more than two breaks the equal-width split layout. `two children: primary action, submenu trigger`
- **root**: The single root slot rendered as a div. Use it to add a className or inline style for width, gap, or data attributes; the group itself takes no other layout props. `Slot<'div'> with className or style`
- **name**: When the primary half is a MenuItemCheckbox, MenuItemRadio, or MenuItemSwitch, name identifies the selection group that the item belongs to inside checkedValues. `theme`
- **value**: Identifies this item's option within its name group for checkbox, radio, and switch menu items, and is reported through onCheckedValueChange. `dark`
- **checkedItems**: The array of currently selected values for one named group, used when reading selection state for the split row's check-style children. `['dark', 'highContrast']`
- **checkedValues**: Controlled map of group name to selected values on the containing Menu/MenuList. Provide it, with onCheckedValueChange, when selection must live in your own state. `{ theme: ['dark'] }`
- **defaultCheckedValues**: Uncontrolled initial selection map for the menu. Use it when you do not need to own selection state but want the split row to start checked. `{ theme: ['light'] }`
- **onCheckedValueChange**: Callback fired when a checkable item in the menu changes; receives the event and a data object with the group name and current values, which is where you persist selection made from the split row. `(e, data) => setChecked(data)`
- **hasCheckmarks**: Reserves a checkmark column on the containing MenuList so checkable split rows align with unselected siblings and do not shift when the state toggles. `true`
- **hasIcons**: Reserves an icon column on the containing MenuList so split rows with leading icons line up with icon-less rows elsewhere in the menu. `true`
- **hasSubmenu**: Marks an item as owning a submenu so the chevron indicator and ArrowRight behavior are applied to the trigger half of the split row. `true`
- **persistOnClick**: Set on the item halve to keep the enclosing menu open when that half is clicked, useful when the primary action should not dismiss navigation menus. `true`
- **persistOnItemClick**: Menu-level switch that keeps the entire menu open for any item click; use it for menus that act as pinned pickers rather than action menus. `true`
- **disabled**: Disables the primary action half. The element is removed from interaction, so pair it with a clear visual treatment and consider disabledFocusable when the item should still be discoverable. `true`
- **disabledFocusable**: Renders the half as aria-disabled while keeping it focusable, letting keyboard and screen reader users hear the item and still reach the neighboring submenu trigger. `true`
- **href**: When the primary half is a MenuItemLink, href renders it as an anchor so the primary action navigates while the second half still opens the submenu. `/settings/profile`
- **switchIndicator**: Slot for the toggle indicator inside a MenuItemSwitch, letting you replace or restyle the switch affordance on a split row. `Slot<'span'> content`
- **hoverDelay**: Milliseconds the pointer must rest on the trigger half before an openOnHover submenu opens; a small delay prevents the split row from opening submenus during diagonal pointer travel. `300`
- **inline**: Renders the menu inline in the DOM instead of through a portal. Choose it when the menu must inherit scroll containers or styles from an ancestor, and accept the clipping risk. `false`
- **open**: Controlled open state of the submenu's Menu. Pair it with onOpenChange and only set it on the Menu that owns the submenu trigger. `true`
- **defaultOpen**: Uncontrolled initial open state for the submenu; use it for demo or always-visible submenu presentations rather than for interaction-driven menus. `false`
- **onOpenChange**: Notifies you when the submenu opens or closes, including the reason. Use it to log, to coordinate with parent menu state, or to gate opening behind a permission check. `(e, data) => setOpen(data.open)`
- **openOnContext**: Allows the menu or submenu to open on right-click; on a split row this means the context gesture applies to the whole row, so verify it does not conflict with the primary action. `false`
- **openOnHover**: Opens the submenu when the trigger half is hovered, the classic split-menu behavior on pointer devices. Combine with hoverDelay to avoid accidental opens. `true`
- **positioning**: Controls where the submenu flyout is placed relative to the trigger half, such as above-end or below-end, plus alignment and offset options from the positioning shorthand. `above-end`
- **closeOnScroll**: Closes the submenu when the page or an ancestor scrolls, preventing a detached flyout from floating away from its split row. `true`
- **focusFirst**: Programmatic hook on the menu list to move focus to the first item; call it after opening a submenu when you need a deterministic focus landing point. `focusFirst()`
- **disableButtonEnhancement**: Disables MenuTrigger's automatic enhancement of the child button. Leave it off for split rows so the trigger half is keyboard-operable and exposes aria-haspopup automatically. `false`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Provide exactly two direct children: the first is the primary action content (a MenuItem or MenuItemLink) and the second is the submenu trigger, normally a MenuTrigger that wraps a MenuPopover.
- Give the submenu trigger its own accessible name, for example a label such as "More options" describing the target of the submenu, so the chevron half is not announced as an unnamed button.
- Keep the primary half's label short and verb-like so the row reads cleanly at menu width, and let the submenu carry the longer descriptive items.
- Use hasIcons and hasCheckmarks on the MenuList when sibling items mix icons or selection indicators, so the split row aligns with the rest of the menu column.
- Use disabledFocusable instead of disabled on the primary half when you still want keyboard and screen reader users to discover the item and reach the submenu half.
- Test the composition with openOnHover and an explicit hoverDelay if the menu is a navigation menu for pointer-heavy users, so the split halves do not flicker between primary and submenu targets.
- Wrap the whole structure in a Menu/MenuTrigger pair and mount it inside a Portal-backed MenuPopover so the submenu is not clipped by ancestor overflow.

### Don'ts

- Do not pass a single child or three or more children; the two-column layout assumes one primary half and one trigger half, and extra children break the visual split.
- Do not put interactive controls (buttons, inputs, links that navigate on click) directly as the raw children without menu semantics, because the row will not participate in menu arrow-key navigation or role="menuitem" announcements.
- Do not use MenuSplitGroup as a replacement for SplitButton outside of menus; the root is a plain div with menu-item semantics supplied by its MenuItem children.
- Do not apply positioning or open state on MenuSplitGroup itself; the open, defaultOpen, and positioning props belong to the surrounding Menu and its MenuTrigger.
- Do not disable the submenu trigger half while leaving the primary half enabled without a visible explanation, since users will assume no submenu exists.
- Do not rely on hover alone to expose the chevron half; always keep the submenu reachable with ArrowRight/Enter from the primary half.
- Do not stack a MenuSplitGroup inside another MenuSplitGroup without a clear need; deeply nested splits make the keyboard path ambiguous and the focus ring hard to follow.

## Anti-Patterns

### Unnamed chevron half

❌ The submenu trigger half is often rendered as an icon-only MenuTrigger, so screen readers announce an item with aria-haspopup but no discernible name and users cannot tell what the submenu contains.

✅ Give the trigger half a programmatic name such as "More options" or "More <label> actions" using aria-label or visually hidden text, and keep the visible label of the primary half distinct from it.

### Using MenuSplitGroup as a standalone control

❌ Rendering MenuSplitGroup outside a Menu, or with plain divs as children, produces a two-column layout with no role="menu" ancestry, no arrow-key navigation, and no aria-haspopup wiring.

✅ Always compose it inside MenuTrigger/MenuPopover/MenuList and use MenuItem, MenuItemLink, MenuItemCheckbox, MenuItemRadio, or MenuItemSwitch as the children so menu semantics and keyboard handling are supplied for you.

### Disabling the primary half with plain disabled

❌ Using disabled on the primary action removes it from the focus order entirely, so keyboard users can no longer hear the row or step across to the submenu chevron, effectively hiding the secondary actions.

✅ Prefer disabledFocusable so the half reports aria-disabled but remains focusable, and pair it with tokens.colorNeutralForegroundDisabled for a clear visual disabled state.

### Opening state managed on the wrong component

❌ Placing open, defaultOpen, positioning, or onOpenChange on MenuSplitGroup itself has no effect because the group owns no popup state, leading to menus that appear stuck open or never open.

✅ Attach open/defaultOpen/onOpenChange to the submenu's Menu and positioning to its MenuPopover; leave MenuSplitGroup to layout only.

### Accidental hover submenus in dense menus

❌ Enabling openOnHover without a hoverDelay on a tall menu makes submenus fire while the pointer merely travels across the split row, interrupting the user's path to a different item.

✅ Set a hoverDelay and keep keyboard opening via ArrowRight and Enter as the primary, deterministic path into the submenu.

## Accessibility

**Requirements**: MenuSplitGroup must be composed inside a Menu so that its children receive role="menu" semantics from the containing MenuList and role="menuitem" from the MenuItem halves. The primary half must be reachable and operable by keyboard, and the submenu half must expose aria-haspopup="menu" plus aria-expanded reflecting whether the flyout is open. Disabled primary actions should use aria-disabled (via disabledFocusable) rather than removing the element from the tab order when the submenu must remain discoverable. Any icon-only chevron half needs a programmatic name because it has no visible text. Color alone must not convey the disabled or selected state — pair tokens like tokens.colorNeutralForegroundDisabled with aria-disabled, and selection state with aria-checked on MenuItemCheckbox/MenuItemRadio children.

| Key | Action |
| --- | --- |
| `Enter` | Invokes the focused half: activates the primary action or opens the submenu when the trigger half has focus. |
| `Space` | Activates the focused MenuItem half, matching Enter behavior for the primary action. |
| `ArrowDown` | Moves focus to the next item in the containing menu, including into and out of the split row. |
| `ArrowUp` | Moves focus to the previous item in the containing menu. |
| `ArrowRight` | Opens the submenu of the split row when the submenu trigger half is focused, and moves focus into the first submenu item. |
| `ArrowLeft` | Closes the submenu and returns focus to the trigger half of the split row. |
| `Escape` | Closes the open submenu and returns focus to the submenu trigger half; a second press closes the parent menu. |
| `Home` | Moves focus to the first item of the containing menu. |
| `End` | Moves focus to the last item of the containing menu. |
| `Tab` | Moves focus out of the menu, closing the submenu and the parent menu. |

**ARIA**: role="menu", role="menuitem", aria-haspopup="menu", aria-expanded, aria-disabled, aria-checked, aria-label

**Screen Reader**: Screen readers announce the primary half as a menu item with its visible label and any disabled state, then announce the submenu trigger half as a separate menu item with aria-haspopup="menu" and its current expanded or collapsed state. Because the two halves are distinct focus stops inside one visual row, users hear two consecutive items rather than a single split control; grouping context comes from the surrounding menu. Opening the submenu moves the virtual cursor into the popover, and Escape restores it to the trigger half. When selection is involved, MenuItemCheckbox and MenuItemRadio children report aria-checked within their named group so users can tell which value is currently active.

## Styling

MenuItem halves inside MenuSplitGroup are styled through the MenuItem children rather than the group root, because the root only provides flex layout and height stretching. Target the primary half with tokens.colorNeutralBackground2Hover for hover and tokens.colorNeutralBackground2Pressed for pressed feedback, and keep the submenu trigger half visually identical so the row reads as one surface until the pointer lands. Use tokens.colorNeutralForeground1 for the primary label and tokens.colorNeutralForeground2 for secondary or descriptive text in the submenu side, with tokens.colorNeutralForegroundDisabled plus tokens.colorNeutralBackgroundDisabled for disabled halves. Focus rings come from tokens.colorStrokeFocus2 with tokens.strokeWidthThin; use the MenuItem focus outline rather than adding your own, so the ring follows the row's border radius (tokens.borderRadiusMedium). Vertical rhythm should use tokens.spacingVerticalXS and tokens.spacingHorizontalS for padding, and the chevron indicator should inherit tokens.fontSizeBase200/tokens.lineHeightBase200 sizing with tokens.colorNeutralForeground3 so it stays subordinate to the label. If you need a hairline between the two halves, use tokens.colorNeutralStroke2 at tokens.strokeWidthThin; avoid heavy dividers that split the row into two visual items.

## Performance

MenuSplitGroup itself is a single flex div with no state, effects, or listeners, so its own render cost is negligible; cost comes from the MenuPopover subtree it hosts. Menu popovers mount their content lazily on open, but once a user has opened a submenu the content may stay mounted, so keep submenu item counts reasonable and avoid heavy work in item render props. Because the split row renders two MenuItem subtrees in one row, memoize any custom render of the primary label and keep icon components stable to avoid re-rendering both halves when parent menu state changes. If many split rows exist in one long menu, prefer rendering them from a data array with stable keys; inline mode bypasses the portal and keeps the menu in the ancestor tree, which can cause additional layout and paint work in scroll containers.

## Theming & Tokens

MenuSplitGroup inherits everything from FluentProvider's theme through CSS variables, so it adapts to brand and high-contrast themes automatically. The root provides layout only; the visual surface comes from the MenuItem halves using tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground2Hover, and tokens.colorNeutralBackground2Pressed for pointer states, tokens.colorNeutralForeground1 for labels, tokens.colorNeutralForeground2 for secondary text, and tokens.colorNeutralForegroundDisabled with tokens.colorNeutralBackgroundDisabled for disabled halves. Selection styling on checkable children uses tokens.colorBrandForeground1 for checkmarks and tokens.colorNeutralForeground1 for the checked label. Focus indicators rely on tokens.colorStrokeFocus2 while the shared border radius uses tokens.borderRadiusMedium, spacing follows tokens.spacingHorizontalS and tokens.spacingVerticalXS, and text sizing follows tokens.fontSizeBase300 with tokens.lineHeightBase300. Overriding these tokens on your own wrapper class changes both halves at once and keeps the split row consistent across themes.

## Migration Notes

MenuSplitGroup is a v9-only composition primitive and has no direct v8 equivalent; previously this pattern was hand-rolled with custom CSS inside ContextualMenu items or by placing a separate split menu component next to the item. When porting from v8, replace the custom two-column markup with MenuSplitGroup and move behavior to the v9 Menu/MenuTrigger/MenuPopover/MenuList stack, remembering that open and positioning now live on Menu and MenuTrigger rather than on the item itself, and that disabled plus disabledFocusable map to the v9 aria-disabled conventions.

## Edge Cases

- MenuSplitGroup renders exactly two children; a single child or three or more children breaks the equal-width split and should be refactored into the two-child shape.
- In right-to-left layouts the root mirrors horizontally, so verify that the primary action still appears at the leading edge and that the chevron half stays at the trailing edge for pointer users.
- A disabled primary half combined with an enabled submenu trigger yields a row where one arrow-key step lands on a non-actionable item and the next opens a flyout; use disabledFocusable and clear labels so the distinction is audible.
- Nesting a MenuSplitGroup inside the submenu of another MenuSplitGroup creates two levels of horizontally split rows and makes Escape/ArrowLeft semantics hard to follow; limit nesting depth.
- If the submenu is rendered inline, an ancestor with overflow hidden or a scroll container can clip the flyout, unlike the default portal rendering.
- Selection props such as checkedValues and defaultCheckedValues apply to the containing Menu/MenuList, not to the group, so wiring them on the group's own child alone will not update sibling rows.
- Because the two halves are separate focus stops, a custom focus style applied to the group root will not follow focus; style focus on the MenuItem children instead.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
