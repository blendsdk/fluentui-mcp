# MenuItem

> **Package**: `@fluentui/react-menu` v9.25.0
> **Import**: `import { MenuItem } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

MenuItem is the actionable row component used inside MenuList to build menus, context menus, and dropdown surfaces. It renders a single choice or command with an optional leading icon, an optional checkmark column for alignment with selectable rows, optional secondary content shown opposite the primary label (typically a keyboard shortcut), and an optional subText descriptor that turns the row into a two-line layout. MenuItem can act as a submenu trigger through hasSubmenu, and it can keep the parent menu open after a click through persistOnClick, which is useful for multi-step or multi-select flows. Styling and alignment are coordinated by the surrounding MenuList, which reserves icon and checkmark columns so rows line up consistently, while the surrounding Menu, MenuTrigger, and MenuPopover handle opening, positioning, dismissal, and roving focus.

**When to use**: Use MenuItem whenever you need a single command, option, or navigational entry inside a Menu. Reach for MenuItem as the default row for commands that execute an action and dismiss the menu. Choose the specialized variants when the semantics differ: MenuItemLink for items that navigate to a URL, MenuItemCheckbox for independent toggles, MenuItemRadio for mutually exclusive choices within a MenuGroup, and MenuItemSwitch for an inline on/off setting. Use MenuButton, SplitButton, or a plain Button instead when the action should be permanently visible on the page rather than hidden behind a menu trigger, and use ToolbarButton or ToolbarRadioButton when the controls belong to a toolbar with persistent visibility.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean \| undefined` | — | No | — |
| `disabledFocusable` | `boolean \| undefined` | — | No | **Deprecated** |
| `hasSubmenu` | `boolean \| undefined` | `false` | No | If the menu item is a trigger for a submenu |
| `persistOnClick` | `boolean \| undefined` | `false` | No | Clicking on the menu item will not dismiss an open menu |

### Prop Guidance

- **hasSubmenu**: Set to true only when the item contains a nested Menu as children. It toggles the submenu indicator rendering and makes the item behave as a submenu trigger for ArrowRight, ArrowLeft, and assistive technology announcements. Leaving it false on an item that contains a nested Menu, or true on an item that does not, breaks both the visual affordance and the keyboard contract. `true`
- **persistOnClick**: Use when the item's action should not dismiss the currently open menu, such as copying an entry, toggling a page-level filter, or performing repeated actions. Defaults to false, which means a click runs the action and closes the menu. Set it deliberately, because users generally expect menus to close after a selection. `true`
- **disabled**: Use to mark an item as non-interactive. Disabled items are announced as unavailable and are skipped by arrow-key navigation, so never place information that users must read only in a disabled item. Style the row with the disabled foreground token for legibility. `true`
- **disabledFocusable**: Deprecated. It previously allowed a visually disabled item to remain focusable so users could still discover it. Avoid it in new code; instead use disabled and make sure required context is available elsewhere in the menu. `true`
- **icon (slot)**: Place a single leading icon here to reinforce the item's meaning. Keep size and variant consistent within a MenuList and pair it with MenuList's icon or checkmark alignment settings so leading columns do not shift between rows. `Delete20Regular`
- **checkmark (slot)**: This is an alignment helper that reserves the leading checkmark column so plain items line up with selectable items. Do not use it to express selection on a plain MenuItem; use MenuItemCheckbox, MenuItemRadio, or MenuItemSwitch so the checked state is programmatically exposed. `Checkmark16Regular`
- **submenuIndicator (slot)**: Customizes the trailing glyph shown when hasSubmenu is true. Most menus should keep the default chevron for consistency; only override it when your design system has a strong reason and the replacement still reads as a submenu affordance. `ChevronRight16Regular`
- **content (slot)**: Holds the primary label and is where component children are placed. Prefer passing children rather than assigning the content slot directly, and keep the text short so it stays scannable in dense menus. `Save as`
- **secondaryContent (slot)**: Renders opposite the primary content on the trailing edge and is the right place for keyboard shortcut hints such as a modifier key combination. If the action is also wired to that shortcut, expose it with aria-keyshortcuts on the root for assistive technology. `Ctrl + S`
- **subText (slot)**: Adds a secondary descriptor line beneath the main label, creating a multiline layout that increases the item's height. Use it sparingly for the few items that need disambiguation, and keep the wording independent of the primary label so it does not get duplicated in the accessible name. `Overwrite the existing file`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `checkmark` | — | No | A helper slot for alignment when a menu item is used with selectable menuitems Avoid using this slot as a replacement for MenuItemCheckbox and MenuItemRadio components |
| `content` | — | No | Component children are placed in this slot Avoid using the `children` property in this slot in favour of Component children whenever possible |
| `icon` | — | No | Icon slot rendered before children content |
| `root` | — | Yes | — |
| `secondaryContent` | — | No | Secondary content rendered opposite the primary content (e.g Shortcut text) |
| `subText` | — | No | Additional descriptor to main content that creates a multiline layout |
| `submenuIndicator` | — | No | Icon slot that shows the indicator for a submenu |

## Best Practices

### Do's

- Render MenuItem inside a MenuList, which itself lives inside a Menu and MenuPopover, so the item receives the correct menuitem role and roving-focus behavior from context.
- Keep the primary label in the content slot short and action-oriented, for example "Rename" or "Move to folder", so it scans quickly in a dense list.
- Use the icon slot for a single leading icon that reinforces the item's meaning, and keep icon size consistent across every row (20px regular is the Fluent default) so MenuList's reserved icon column does not wobble.
- Put keyboard shortcut hints in secondaryContent rather than appending them to the label text, so the shortcut renders aligned on the trailing edge of the row.
- Use subText only when a one-line description genuinely helps users decide, since it converts the row into a multiline layout and increases the height of that item.
- Set hasSubmenu only on items that actually contain a nested Menu through children, so the submenu indicator and the announced submenu state match real behavior.
- Use MenuItemCheckbox, MenuItemRadio, or MenuItemSwitch for selectable entries instead of manually toggling the checkmark slot, because those components add the correct checked semantics and state styling.
- Group related commands with MenuGroup and MenuGroupHeader and separate logical clusters with MenuDivider to keep long menus scannable.
- Set persistOnClick when an action should not dismiss the open menu, such as copying an item, applying a quick filter, or building up a multi-selection.
- Give every item in a given MenuList either an icon or none, or rely on MenuList's hasIcons and hasCheckmarks settings, so the leading columns stay aligned.

### Don'ts

- Don't render MenuItem outside of a Menu/MenuList/MenuPopover composition; it relies on menu context for its role, focus management, and dismissal behavior.
- Don't use the checkmark slot as a substitute for MenuItemCheckbox or MenuItemRadio; a static checkmark glyph does not expose selection state to assistive technology.
- Don't stuff form controls, paragraphs of text, or complex layouts into the content slot; menu rows are for short, scannable labels.
- Don't set hasSubmenu without a nested Menu in the item's children; screen readers will announce a submenu that keyboard users can never open.
- Don't build submenus more than two levels deep, because deep nesting becomes hard to navigate with arrow keys and easy to lose track of visually.
- Don't rely on disabled alone to communicate critical information; fully disabled items are skipped by arrow-key navigation, so keyboard users may never reach the explanation.
- Don't use MenuItem for primary, always-visible page actions; use Button, ToolbarButton, or SplitButton so the action is discoverable without opening a menu.
- Don't pass children directly into the content slot; prefer normal component children so the slot composition stays predictable.
- Don't use the deprecated disabledFocusable prop in new code; express disabled state with disabled and design the workflow so no essential item needs to be disabled.

## Anti-Patterns

### Faking selection with the checkmark slot

❌ Rendering a checkmark glyph into the checkmark slot on a plain MenuItem makes the row look selected, but no checked state reaches assistive technology, so screen reader users cannot tell which options are active.

✅ Use MenuItemCheckbox for independent toggles, MenuItemRadio inside a MenuGroup for mutually exclusive choices, or MenuItemSwitch for inline on/off settings. Those components apply the correct checked semantics and state styling automatically.

### Declaring hasSubmenu without a real submenu

❌ Setting hasSubmenu on an item that has no nested Menu renders a submenu indicator and announces a submenu, but ArrowRight does nothing and the user hits a dead end.

✅ Only set hasSubmenu when the item's children include a nested Menu with its own MenuList and MenuPopover, and verify that the submenu can be opened by both mouse and keyboard.

### Overloading a menu row with rich content

❌ Placing form fields, long paragraphs, or complex layouts into the content slot breaks the predictable row height and rhythm of the menu, and makes keyboard navigation disorienting.

✅ Keep MenuItem rows to a short label plus an optional icon, shortcut, or one-line description. Move richer configuration into a Dialog or Drawer opened from the item.

### Relying on disabled items to carry information

❌ Disabled items are skipped by arrow-key navigation and announced as unavailable, so any explanatory text placed only inside a disabled row is effectively hidden from keyboard users.

✅ Communicate the reason for unavailability outside the row, for example with a preceding informational item or a Dialog, and only disable the item itself as a visual affordance.

### Using MenuItem for navigation to a URL

❌ A plain MenuItem that performs navigation loses link semantics, so users cannot open the target in a new tab, copy the link, or see link affordances from assistive technology.

✅ Use MenuItemLink for entries that navigate to a URL, keeping the same slot structure for icon, content, secondaryContent, and subText.

### Building deep submenu chains

❌ Nested submenus beyond one or two levels force users through ArrowRight and ArrowLeft repeatedly, hide options from view, and are hard to reach on touch devices.

✅ Flatten the structure with MenuGroup and MenuGroupHeader sections, move secondary commands into a dedicated page or dialog, or keep the hierarchy to at most one submenu level.

## Accessibility

**Requirements**: MenuItem must be used within a Menu/MenuList composition so it is exposed with the menuitem role inside a menu container. Ensure keyboard operability for every command (WCAG 2.1.1), a clearly visible focus indicator on the focused row (WCAG 2.4.7), and sufficient text contrast for the label, subText, and secondaryContent against the item background (WCAG 1.4.3). Never use color alone to convey disabled or selected state (WCAG 1.4.1) — the checkmark column, the disabled token color, and the programmatic disabled state together carry that meaning. Interactive targets should meet the minimum target size for pointer users, and shortcut hints displayed in secondaryContent should correspond to real, working shortcut keys.

| Key | Action |
| --- | --- |
| `Enter` | Activates the focused menu item, running its action and dismissing the menu unless persistOnClick is set. |
| `Space` | Activates the focused menu item in the same way as Enter. |
| `ArrowDown` | Moves focus to the next focusable menu item, skipping disabled items. |
| `ArrowUp` | Moves focus to the previous focusable menu item, skipping disabled items. |
| `ArrowRight` | Opens the submenu when the focused item has hasSubmenu set and contains a nested Menu. |
| `ArrowLeft` | Closes the current submenu and returns focus to the parent item when inside a submenu. |
| `Home` | Moves focus to the first focusable item in the menu. |
| `End` | Moves focus to the last focusable item in the menu. |
| `Escape` | Closes the open menu and returns focus to the trigger. |
| `Tab` | Closes the menu and moves focus out of the menu composite to the next focusable element on the page. |
| `Printable character keys` | Perform typeahead so focus jumps to the next item whose label starts with the typed characters, which is why trailing shortcut text belongs in secondaryContent instead of the main label. |

**ARIA**: role="menuitem" applied to the root by the menu item's own behavior, with role="menu" provided by the surrounding MenuList, aria-disabled to expose the disabled state when disabled is set, aria-haspopup and aria-expanded on items that act as submenu triggers via hasSubmenu, aria-checked or aria-selected exposed by MenuItemCheckbox and MenuItemRadio for selectable items, aria-label or aria-labelledby on the root slot when the visible label alone is not descriptive, aria-keyshortcuts on the root slot when a shortcut hint is shown in secondaryContent

**Screen Reader**: A MenuItem is announced as a menu item with its content used as the accessible name, and the surrounding menu announces the set and position of items. When hasSubmenu is set, assistive technology announces that a submenu is available and reports the expanded state while the submenu is open. Disabled items are announced as unavailable or dimmed and are removed from the arrow-key navigation order, so users navigating by keyboard will not land on them. Selectable variants such as MenuItemCheckbox and MenuItemRadio announce their checked state, whereas the checkmark slot on a plain MenuItem is purely visual and conveys nothing to assistive technology. Because secondaryContent and subText are rendered as part of the row, some screen readers include that text in the accessible name; keep labels self-sufficient and avoid duplicating the same wording in both the label and the subText.

## Styling

Style MenuItem through the className prop on the root slot using Griffel makeStyles and Fluent design tokens rather than hard-coded colors. Row padding and label typography default to tokens.spacingHorizontalSNudge-style values, tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.fontWeightRegular, and tokens.lineHeightBase300, so adjust density by overriding spacing tokens rather than raw pixel values. Hover and focus backgrounds typically map to tokens.colorNeutralBackground2Hover or tokens.colorNeutralBackground1Hover, and the label color transitions from tokens.colorNeutralForeground2 to tokens.colorNeutralForeground2BrandHover or tokens.colorNeutralForeground2BrandSelected when hovered or selected. Corner rounding comes from tokens.borderRadiusMedium, so keep custom overrides aligned with that radius to match the MenuPopover surface. Use tokens.colorNeutralForegroundDisabled for disabled labels and icons, and avoid layering opacity on top of that token because it reduces contrast further. When a menu mixes icon rows with plain rows, set hasIcons or hasCheckmarks on the enclosing MenuList so the reserved leading columns are consistent; use the same approach with the checkmark slot for selectable rows. Long labels should be handled with explicit overflow styling in the content slot, and icons should stay a single consistent size so the icon, checkmark, and submenuIndicator columns remain vertically centered.

## Performance

Menu items are cheap to render but are typically mounted in bulk when a MenuPopover opens, so keep labels, icons, and secondary content simple and avoid expensive computations or effects inside a row. Menus that render hundreds of items should be restructured into grouped sections or a searchable surface, because every row participates in the roving-focus list and in typeahead matching. Pass stable handler references with useCallback rather than inline closures that are recreated on every parent render, and key items by stable identifiers so that toggling menu state does not force remounting of the whole list. Nested submenus only mount when opened, so marking items with hasSubmenu has essentially no cost until the user expands them. Avoid switching persistOnClick dynamically mid-interaction, because it changes dismissal behavior in ways that can cause an extra render and an unexpected close or non-close.

## Theming & Tokens

MenuItem consumes Fluent theme tokens from the nearest FluentProvider, so it adapts automatically across light, dark, and high-contrast themes. Text color defaults to tokens.colorNeutralForeground2 and shifts to tokens.colorNeutralForeground2BrandHover or tokens.colorNeutralForeground2BrandSelected on hover and selected states, while hover and focus backgrounds resolve to neutral background tokens such as tokens.colorNeutralBackground2Hover. Disabled rows use tokens.colorNeutralForegroundDisabled for both label and icon, with transparent backgrounds so the disabled state reads without competing with the surrounding surface. Corner radius comes from tokens.borderRadiusMedium and row padding from spacing tokens such as tokens.spacingHorizontalSNudge and tokens.spacingVerticalSNudge, so density changes should be expressed by overriding those tokens rather than hard-coded values. Typography follows tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.fontWeightRegular, and tokens.lineHeightBase300, and the enclosing MenuPopover supplies the surface color and elevation, so custom row backgrounds should be chosen to keep contrast against that surface. In forced-colors mode, focus and selection rely on system colors, so avoid custom background overrides that suppress them.

## Migration Notes

In Fluent UI v8 the equivalent was the Fabric MenuItem / ContextualMenuItem, which exposed flat props such as primaryText, secondaryText, iconProps, itemProps, subMenuProps, canCheck, and checked. In v9 MenuItem is slot-based: primary text belongs in the content slot (typically as component children), the leading glyph goes in the icon slot, trailing shortcut text goes in secondaryContent, supporting description text goes in subText, and checkmark alignment is handled by the checkmark slot rather than a checked prop. Submenus in v9 are declarative — you place a nested Menu inside MenuItem's children and set hasSubmenu instead of wiring up subMenuProps. Selection is no longer expressed with canCheck/checked; use MenuItemCheckbox, MenuItemRadio, and MenuItemSwitch, and use MenuItemLink for navigational entries. The disabledFocusable prop is deprecated and should not be used in new code. Contextual menus from v8 map onto the Menu, MenuTrigger, and MenuPopover composition rather than a dedicated component.

## Edge Cases

- Setting hasSubmenu without a nested Menu inside the item produces a submenu indicator and an announced submenu that keyboard users can never open with ArrowRight.
- Fully disabled items are removed from arrow-key navigation, so a menu composed mostly of disabled entries can appear to have no focusable content at all.
- The checkmark slot only reserves alignment space; a checkmark rendered there on a plain MenuItem is not announced as selected, which can silently mislead assistive technology users.
- Adding subText turns the row into a multiline layout, increasing that item's height and potentially breaking vertical alignment with adjacent single-line items unless the enclosing MenuList reserves matching icon and checkmark columns.
- Combining persistOnClick with hasSubmenu means the submenu trigger no longer dismisses the parent menu on activation, which can leave several layers open at once and confuse dismissal expectations.
- Long labels in the content slot wrap or overflow and can collide with secondaryContent, so explicit overflow handling is required when menu labels are user-generated.
- Mixing icons of different sizes across items causes the leading column to shift, because the icon and checkmark columns are sized by the enclosing MenuList rather than by individual rows.
- The deprecated disabledFocusable prop kept a disabled-looking row focusable; migrating it to disabled changes the keyboard order, which can break flows that depended on users reaching that row.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
