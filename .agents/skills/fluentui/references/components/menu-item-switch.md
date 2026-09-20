# MenuItemSwitch

> **Package**: `@fluentui/react-menu` v9.25.0
> **Import**: `import { MenuItemSwitch } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

MenuItemSwitch is a checkable menu item that renders a Switch-style toggle as its trailing indicator, letting users turn individual settings on and off from inside a Menu. It is one member of the menu item family (alongside MenuItem, MenuItemCheckbox, MenuItemLink and MenuItemRadio) and is designed to live inside a MenuList, where several MenuItemSwitch items that share the same name form a checked-value group. Instead of managing state itself, each item declares a name (the group it belongs to) and a value (its identity inside that group), and the surrounding menu reports the resulting group state through checkedValues or defaultCheckedValues plus onCheckedValueChange. Visually it reuses the standard menu item row (root slot, hover and focus styling, icon/checkmark layout driven by hasCheckmarks and hasIcons) and appends the switchIndicator slot, a span that hosts the switch graphic. The result is a compact, accessible multi-select surface for settings menus, view option menus and similar 'toggle several things at once' scenarios.

**When to use**: Use MenuItemSwitch when the user is choosing any number of independent, on/off style settings from a menu — for example a 'View options' menu with toggles for gridlines, labels and rulers — and you want the affordance of a switch rather than a checkmark. Prefer MenuItemCheckbox when the choice reads as a list of selected items rather than a settings toggle, MenuItemRadio when the choices are mutually exclusive and the user must pick exactly one, and a plain MenuItem when the row performs an action or navigates rather than holding state. Because the whole row toggles the value, MenuItemSwitch is also the right choice when you want a large, uniform click/tap target rather than a small standalone Switch control outside of a menu.

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

- **name**: Identifies the checked-value group this switch belongs to. All switches that should be toggled and reported together must share one name, and unrelated toggles must use a different one, because the menu keys its checked values by name. `viewOptions`
- **value**: The unique identity of this switch inside its name group; this is the string that appears in the group's checked values when the switch is on. Keep values stable across renders and unique within the group. `gridlines`
- **checkedItems**: The list of values currently checked within the item's group, surfaced on the item so it knows whether it should render as checked. Treat it as the authoritative reflection of group state and change it through the menu's checked-values API rather than mutating it directly.
- **switchIndicator**: Slot for the trailing switch graphic. Use it to restyle, resize or reposition the indicator, and keep whatever you place there non-interactive and non-focusable so the menu row remains the single toggle target.
- **root**: Slot for the underlying div that carries the menu item's styling and behavior. Use it to pass className, style, data attributes or an aria-label when the visible label is not descriptive enough on its own.
- **children**: The item's label, and therefore its accessible name. Provide a short, setting-oriented phrase; content is rendered in the row next to the switch indicator, so avoid long sentences.
- **disabled**: Renders the row as unavailable and removes it from activation; use it when the setting is visible but cannot be changed in the current context. It also takes the row out of keyboard reach.
- **disabledFocusable**: Keeps the row focusable and announced while blocking activation. Prefer it over disabled when users should still be able to discover and read the option, for example when a dependent setting must be enabled first.
- **persistOnClick**: Prevents the surrounding menu from closing when this item is activated. Set it on switch items in settings-style menus so users can flip several toggles in one visit.
- **hasSubmenu**: Marks the item as the parent of a nested menu, adding submenu affordances and expanding/collapsing semantics. Only set it when the item genuinely opens child items; a switch that opens a submenu is a confusing combination.
- **href**: Turns the row into a link target. Avoid pairing it with switch semantics — a toggle is not a destination — and reserve it for navigation-style items.
- **checkedValues**: Controlled checked-value state for the whole menu, keyed by item name. Pass it together with onCheckedValueChange when another part of your UI must read or drive the toggles. `{ viewOptions: ['gridlines'] }`
- **defaultCheckedValues**: Initial checked-value state for an uncontrolled menu. Use it to seed which switches start on, and switch to checkedValues when you need to own the state.
- **onCheckedValueChange**: Callback fired with the event and the change data (including the item name and the new value list) whenever a switch in the menu is toggled. This is the hook for persisting user preferences.
- **hasCheckmarks**: Reserves a checkmark column for the menu's items. Because switch items already carry a trailing indicator, enable this only when the menu also contains checkable items that need the column, so rows stay aligned.
- **hasIcons**: Reserves an icon column for the menu's items. Enable it when sibling items have leading icons so switch rows line up with the rest of the menu rather than shifting.
- **open / defaultOpen / onOpenChange**: These control the visibility of the surrounding Menu, not of an individual switch row; configure them on the menu itself when you need programmatic opening or change tracking.
- **openOnHover / hoverDelay / openOnContext / inline / positioning / closeOnScroll**: Interaction and placement options that belong to the menu and its trigger/popover rather than to a switch item. Set them on the Menu, MenuTrigger or MenuPopover that hosts the switch items.
- **persistOnItemClick / focusFirst / disableButtonEnhancement**: Menu- and trigger-level behaviors (keeping the menu open after any item click, focusing the first item on open, and opting out of automatic trigger enhancement). Apply them to the menu or its trigger, not to the switch item.

## Best Practices

### Do's

- Give every MenuItemSwitch a value that is unique inside its name group and use a different name for each logically separate set of switches so the checked-values bookkeeping stays unambiguous.
- Keep the group state in the menu (checkedValues with onCheckedValueChange, or defaultCheckedValues for an uncontrolled setup) rather than toggling the value yourself in an onClick handler.
- Set persistOnClick on items in a menu whose purpose is tuning several settings, so the menu stays open while the user flips more than one switch.
- Keep the children of the item short and descriptive — the label is what screen readers announce for the toggle, so 'Show gridlines' communicates far more than 'Gridlines: on'.
- Style the visual toggle through the switchIndicator slot className so that your overrides stay scoped to this item and do not affect unrelated Switch components elsewhere in the app.
- Use disabled when the setting must be visible but unreachable, and disabledFocusable when the row should remain reachable by keyboard so the user can still discover that the option exists.
- Group switches under a MenuGroup with a MenuGroupHeader when a menu contains more than a handful of toggles, so the user can parse the sets at a glance.

### Don'ts

- Don't put an interactive Switch or any other focusable control inside the switchIndicator slot or the item's children — only one thing in the row should own the toggle behavior, otherwise keyboard and screen reader users hit a confusing nested control.
- Don't reuse the same name across unrelated items; a shared name means a shared checked-value group and the items will appear to control each other.
- Don't use MenuItemSwitch for mutually exclusive choices — that is what MenuItemRadio and a radio-style name group are for, and switch semantics imply 'any combination is valid'.
- Don't attach your own click handler that mutates the checked list while also relying on the group API; the value will be toggled twice or drift out of sync with what the user sees.
- Don't rely on the switch graphic alone to convey state in a custom-styled menu; keep the row's own checked styling visible so state is not signalled by color or position alone.
- Don't cram long sentences into a menu item label expecting it to wrap gracefully — menu rows are single-line oriented, and long text collides with the trailing switch indicator.
- Don't assume a switch item should close the menu on activation by default; toggling several settings and being dismissed after each one is a frustrating pattern unless that is genuinely intended.

## Anti-Patterns

### Manually toggling state alongside the group API

❌ Adding an onClick handler that flips the item's value yourself while the menu also collects checked values means the value is toggled twice or immediately desynchronized from what the item renders, so the switch appears stuck or flickers.

✅ Let the item declare name and value and let the menu own the state through checkedValues or defaultCheckedValues plus onCheckedValueChange; use the callback only to observe and persist changes.

### Nesting an interactive Switch or button in the row

❌ Placing a real, focusable Switch into the switchIndicator slot or into the children creates a nested interactive control. Keyboard users tab into an element that competes with the menu item, and screen readers may announce the state twice or announce an unusable control.

✅ Keep the indicator purely presentational. If the visual needs to change, restyle the switchIndicator slot instead of rendering your own control, and let the menu item itself remain the single activation target.

### Reusing one name for unrelated switches

❌ Items that share a name share a checked-value group, so toggling one item changes which values are reported for the others, producing switches that appear to move together or that never show the state you expect.

✅ Assign one name per logical setting group (for example one for view options and another for notifications) and keep each value unique within its group.

### Using switches for exclusive choices

❌ Switch affordances communicate 'any combination is allowed'. Modelling a pick-one-of-three choice with three MenuItemSwitch items misleads users about whether turning one on turns another off.

✅ Use MenuItemRadio with a shared name for mutually exclusive choices, and reserve MenuItemSwitch for independent, non-exclusive settings.

### Closing the menu after every toggle

❌ In a settings menu, the default close-on-activate behavior forces users to reopen the menu for each toggle, turning a two-second task into a repeated open/choose cycle.

✅ Set persistOnClick on the switch items (and keep the trigger stable) when the menu exists to tune multiple settings, and reserve close-on-activate for menus where a single choice completes the task.

## Accessibility

**Requirements**: MenuItemSwitch participates in the menu's roving-tabindex focus model, so visible focus indication on the row is required (WCAG 2.4.7 Focus Visible) and the row's checked and disabled states must be exposed programmatically (WCAG 4.1.2 Name, Role, Value). The visible text of the item supplies the accessible name, so a meaningfully labelled toggle is mandatory; the switch graphic itself must not introduce a second, separately focusable control. Text and indicator graphics must meet WCAG 1.4.3 / 1.4.11 contrast in default, hover, selected, disabled and focus states, and the state of the toggle must not be communicated by color alone. Rows must remain reachable through the menu's keyboard model once the menu is open, and disabled items must still be perceivable.

| Key | Action |
| --- | --- |
| `Enter` | Toggles the item's value in its checked-value group (unless disabled or disabledFocusable is set). |
| `Space` | Toggles the item's value in its checked-value group, matching the Enter behavior. |
| `ArrowDown` | Moves focus to the next menu item in the MenuList, wrapping to the first item when the end is reached. |
| `ArrowUp` | Moves focus to the previous menu item in the MenuList, wrapping to the last item when the start is reached. |
| `Home` | Moves focus to the first item in the menu. |
| `End` | Moves focus to the last item in the menu. |
| `ArrowRight` | Opens the submenu when the item has hasSubmenu set; otherwise focus behavior follows the surrounding menu. |
| `ArrowLeft` | Closes a submenu opened from this item and returns focus to the parent menu item. |
| `Escape` | Closes the surrounding menu (and any open submenu) and returns focus to the trigger. |
| `Tab` | Closes the menu and moves focus out of it rather than stepping between menu items. |
| `Printable characters` | Type-ahead: moves focus to the next item whose label starts with the typed characters. |

**ARIA**: role (checkable menu item semantics applied to the row), aria-checked (reflecting whether the item's value is present in the group's checked items), aria-disabled (applied when disabled or disabledFocusable is set), aria-haspopup and aria-expanded (applied when hasSubmenu is set and a submenu is open), aria-label or aria-labelledby via the root slot when the visible label alone is not descriptive enough

**Screen Reader**: Screen readers announce the menu item together with its checked state, for example as a checked or unchecked checkable menu item named by the item's text content, so users hear both what the setting is and whether it is currently on. The trailing switch graphic is a presentational indicator of that same state and is not announced as an independent switch control, which avoids the user hearing the state twice or landing on a nested widget with its own focus stop. When disabled or disabledFocusable is set, the row is announced as dimmed/unavailable; a disabledFocusable item can still receive focus so the user can discover the option, but activating it does nothing. Inside a MenuList the item is announced as part of a set of menu items, so arrow-key navigation and the menu's own position information are conveyed alongside the item itself.

## Styling

Menu item rows are styled through the root slot, so target the item with className on root when you need to adjust padding, minimum height or typography — for example changing font size with tokens.fontSizeBase300 and tokens.lineHeightBase300, or tightening the surrounding space with tokens.spacingVerticalXS. Hover and press states come from menu item tokens such as tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed and tokens.colorNeutralBackground1Selected with tokens.colorNeutralForeground1 and tokens.colorNeutralForeground2 for text; if you re-skin those, keep the disabled look intact with tokens.colorNeutralForegroundDisabled. The toggle itself is rendered in the switchIndicator slot, so apply your custom sizing, spacing or color there — a small horizontal gap from the label is typical using tokens.spacingHorizontalS or tokens.spacingHorizontalM, and token-driven corner rounding is available through tokens.borderRadiusMedium. The switch graphic's on/off colors normally resolve to tokens.colorCompoundBrandBackground for the on state and tokens.colorNeutralStrokeAccessible for the off track, and disabled indicators use tokens.colorNeutralBackgroundDisabled and tokens.colorNeutralForegroundDisabled. Animate any of your own state transitions with tokens.durationNormal and tokens.curveEasyEase so the indicator feels consistent with the rest of Fluent. Icon and checkmark columns are controlled by the menu's hasIcons and hasCheckmarks settings, so if you add leading icons to switch items, confirm alignment across all sibling items rather than styling this one item in isolation.

## Performance

Each switch item registers with the surrounding menu's checked-value context, so the item re-renders whenever the group's checked values change. Keep the checkedValues object referentially stable across renders — recreating it on every parent render with an inline literal causes every switch in the menu to re-render on every keystroke elsewhere in the app. Hoist onCheckedValueChange into a stable callback so items do not receive a new handler identity each render, and avoid heavy work (network calls, layout measurement) directly inside that callback; persist first and let the menu update synchronously. MenuItemSwitch adds one nested indicator element per row, so a menu with dozens of switches is heavier than a menu of plain items — for very long lists, prefer paging or splitting items into submenus over one enormous list, because MenuList does not virtualize items for you.

## Theming & Tokens

The row inherits its surface, text and hover colors from the theme's menu item tokens, primarily tokens.colorNeutralBackground1 with tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed and tokens.colorNeutralBackground1Selected, paired with tokens.colorNeutralForeground1, tokens.colorNeutralForeground2 and tokens.colorNeutralForeground2BrandHover for text and icons. Disabled and disabledFocusable rows resolve to tokens.colorNeutralForegroundDisabled and tokens.colorNeutralBackgroundDisabled, so verifying those tokens in high-contrast and dark themes is the quickest way to check the disabled story. The trailing toggle indicator is drawn with switch-oriented tokens such as tokens.colorCompoundBrandBackground (on track), tokens.colorNeutralStrokeAccessible (off track border) and brand-adjacent foreground tokens for the thumb, so brand overrides that alter brand hues flow through both the row's selected state and the indicator. Spacing and shape come from tokens.spacingHorizontalS, tokens.spacingHorizontalM, tokens.spacingVerticalXS, tokens.borderRadiusMedium and tokens.fontSizeBase300 / tokens.lineHeightBase300, while tokens.durationNormal and tokens.curveEasyEase drive the transition timing if you animate indicator changes. Because these are shared theme tokens, prefer overriding them under a scoped FluentProvider or via the item's slot classNames rather than hard-coding colors, so light, dark and high-contrast themes all stay legible.

## Migration Notes

In Fluent UI React v8 there was no dedicated switch-style menu item; teams composed a MenuItem with a Switch in its trailing content and wired checked plus onClick by hand, or used a custom render function for the item. In v9, MenuItemSwitch handles that composition for you: you declare name and value on the item and the surrounding Menu manages the collection through checkedValues or defaultCheckedValues with onCheckedValueChange, so the manual checked/onClick bookkeeping is unnecessary. If you are porting an existing menu, move the toggle state into the menu's checked-values API rather than keeping it in local component state, replace the embedded Switch with the switchIndicator slot (which is already non-interactive), and re-evaluate the disabled behavior — disabledFocusable is now the way to keep a row keyboard-reachable while blocking activation. Styling overrides that previously targeted the embedded Switch should be re-pointed at the switchIndicator slot so they stay scoped to this item.

## Edge Cases

- A switch whose name does not match any key used by the surrounding menu's checked values will render unchecked and toggling it may appear to do nothing — verify that the item's name lines up with the group key the menu reports in onCheckedValueChange.
- Duplicated value strings inside the same name group collapse into one checked entry, so two visually separate switches can never be distinguished by the group state.
- Mixing controlled and uncontrolled state (passing checkedValues without onCheckedValueChange, or vice versa) results in a toggle that visually changes but is never persisted, or one that never moves at all.
- disabledFocusable keeps the row focusable but activation is a no-op; if you rely on onCheckedValueChange to record a fallback value, that callback will not fire for such rows.
- hasSubmenu combined with switch semantics gives the row two roles at once (a submenu opener and a toggle); users generally expect one behavior per row, so pick a plain MenuItem-with-submenu or a switch item instead.
- Adding a leading icon without the menu's hasIcons setting causes switch rows to shift relative to their siblings, because the icon column is not reserved for every item.
- Because the item label is the accessible name, an icon-only or empty label leaves the toggle unnamed for screen reader users; supply a descriptive label or an aria-label through the root slot.
- Setting persistOnClick still allows Escape and outside clicks to dismiss the menu, so long toggle sessions end naturally without leaving the menu permanently open.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
