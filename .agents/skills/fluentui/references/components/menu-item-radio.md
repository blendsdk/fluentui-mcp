# MenuItemRadio

> **Package**: `@fluentui/react-menu` v9.25.0
> **Import**: `import { MenuItemRadio } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

MenuItemRadio is the single-select item of a Fluent UI React v9 menu. It renders as a menu row whose leading indicator is a radio-style glyph, and it participates in a mutually exclusive group defined by a shared name and by the checked values tracked on the surrounding MenuList. Each MenuItemRadio carries a unique value, and the group's currently selected value(s) are supplied through the MenuList checked values so the item can render itself as checked or unchecked. Selection is reported back through the MenuList checked-value change callback, which lets the owning component store the selection in React state, in a form, or in any other source of truth. Because it lives inside menu semantics, it is keyboard navigable with the arrow keys, supports disabled and disabledFocusable states, can expose a submenu, and by default keeps the menu open after a selection so users can compare or adjust options before dismissing the menu. MenuItemRadio is intended for choosing one option out of several within a menu surface; standalone radio selection outside of a menu should use RadioGroup and Radio instead.

**When to use**: Use MenuItemRadio when a menu (a MenuList inside a MenuPopover) must express a single-choice selection among mutually exclusive options, such as choosing a sort order, a density setting, a view mode, or a currently active filter. Use MenuItemCheckbox instead when the user may select more than one option from the same group, and use plain MenuItem when the rows trigger commands rather than representing state. Use MenuItemLink when the row navigates to another page, since radio items describe selection rather than navigation. If the options are the primary content of a page or form rather than an item in a menu, use RadioGroup with Radio, which gives a persistent, always-visible list and better affordance for larger option sets. MenuItemRadio is also the right choice for context-menu style surfaces where a persisted single choice must be visible and changeable without leaving the current view.

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

- **value**: Required identifier for this option within its radio group. The value is what gets written into the parent checked values when the item is selected, so it must be unique among the items sharing the same name and stable across renders. `compact`
- **name**: Required group name that ties sibling MenuItemRadio items together as one mutually exclusive set. Give every item in the same group the identical name; items with different names behave as separate groups and can be checked simultaneously. `density`
- **checkedItems**: The array of currently selected values for the radio group. The item compares its own value against this list to decide whether it renders as checked, so this collection must stay in sync with the parent checked values after every selection change. `["compact"]`
- **persistOnClick**: Controls whether the menu stays open after this item is selected. Radio items keep the menu open by default so users can compare options; set it to false when choosing an option should immediately dismiss the surrounding menu. `false`
- **disabled**: Marks the option as unavailable and removes it from keyboard traversal entirely. Use it when the option is irrelevant in the current context and users do not need to reach it. `true`
- **disabledFocusable**: Marks the option as unavailable but keeps it reachable with the arrow keys so a tooltip or adjacent explanation can tell users why it cannot be chosen. Prefer this over disabled when the reason for unavailability matters. `true`
- **hasSubmenu**: Indicates that this radio item opens a nested menu, which adds the submenu affordance and lets arrow keys enter the child menu. Keep the radio row and the submenu conceptually linked, since a radio selection that also reveals options is unusual. `true`
- **hasCheckmarks**: Configured on the parent MenuList, not on the item. It reserves a fixed indicator column on every row so labels stay aligned whether or not a given item displays a radio indicator. `true`
- **hasIcons**: Configured on the parent MenuList. It reserves a leading icon column and keeps icons vertically centered against the radio indicator and label. `true`
- **checkedValues**: Configured on the parent MenuList as a record that maps group names to arrays of selected values. Use it to make the radio group fully controlled, driving the visual checked state from your own state store. `{ density: ["compact"] }`
- **defaultCheckedValues**: Configured on the parent MenuList to set the initially selected values for an uncontrolled radio group. Use it when selection can live entirely inside the menu and does not need to be read elsewhere. `{ density: ["comfortable"] }`
- **onCheckedValueChange**: Configured on the parent MenuList and fired when a radio item is selected, delivering the group name and the updated value list. This is where you persist the new single selection into application state. `handleCheckedValueChange`
- **root**: The underlying element slot for the item row. Use it to attach a custom className, ref, or data attributes when you need to target the row, rather than wrapping the item in extra markup that would break menu keyboard behavior. `className="densityRow"`
- **hoverDelay**: Configured on Menu, not on the item, and controls how long the pointer must rest on a trigger before a hover-opened menu appears. Relevant only for menus that use hover or context opening. `500`
- **openOnHover**: Configured on Menu. Enables hover-triggered opening for the whole menu surface that contains these radio items, which suits dense selection menus such as view switchers. `true`
- **openOnContext**: Configured on Menu. Enables right-click opening so the radio group can be used inside a context menu over a canvas, list, or grid. `true`
- **positioning**: Configured on Menu and describes where the popover is placed relative to the trigger. Use it to keep a long list of radio options inside the viewport, for example by allowing the surface to flip above the trigger. `below`
- **inline**: Configured on Menu. Renders the menu surface inline in the document flow instead of in a portal, which is useful inside scrollable or transformed containers where portaled popovers would be clipped. `true`
- **closeOnScroll**: Configured on Menu. Dismisses the menu when the page scrolls, which prevents a selection list from detaching from its trigger on long pages. `true`
- **persistOnItemClick**: Configured on Menu and applies to the whole menu surface; it keeps the menu open after any item is clicked. Prefer the per-item persistOnClick on MenuItemRadio when only radio selections should keep the menu open. `true`
- **focusFirst**: Provided by MenuTrigger context and used to move focus into the first menu item programmatically, for example after opening the menu from a keyboard shortcut. `focusFirst`
- **disableButtonEnhancement**: Configured on MenuTrigger so the trigger renders as a plain element instead of receiving button behavior. Use it when the trigger is already a Button or another interactive component that supplies its own semantics. `true`

## Best Practices

### Do's

- Assign the same name to every MenuItemRadio that belongs to one mutually exclusive group, and make each item's value unique within that group.
- Store the current selection in the parent MenuList's checked values and update it in the checked-value change callback so the radio indicator always reflects the real state.
- Keep the immediate parent of MenuItemRadio items as MenuList, because MenuList is what supplies the menu role, arrow-key navigation, and the checked-value context that radio items read.
- Set hasCheckmarks on the parent MenuList when the menu mixes radio items with plain items, so all labels align in the same column whether or not an item shows an indicator.
- Set hasIcons on the parent MenuList when items have leading icons so that the icons and the radio indicator occupy predictable slots instead of shifting the label.
- Confirm the default persist-on-click behavior against your use case: radio items keep the menu open after selection, which is helpful when users compare options, but can be set to false when the menu should dismiss immediately.
- Use disabledFocusable rather than disabled when the option must remain reachable by keyboard, for example when a tooltip or explanation is attached to a temporarily unavailable choice.
- Keep labels short, in sentence case, and descriptive of the state the option represents (for example "Compact" or "Comfortable") rather than of the action that will occur.

### Don'ts

- Do not place MenuItemRadio directly under Menu without a MenuList in between; the item depends on MenuList for its menu role, roving focus, and checked-value context.
- Do not mix MenuItemRadio and MenuItemCheckbox in the same group, because that combines single-select and multi-select semantics and confuses both keyboard and assistive-technology users.
- Do not give each item a different name, which breaks grouping and can allow several items to appear checked at the same time.
- Do not use MenuItemRadio for actions or navigation, because radio semantics announce a selection state that does not exist for a command or a link.
- Do not render your own checkmark or bullet glyph inside the item's children; the radio indicator is provided by the component and duplicating it produces doubled or misaligned visuals.
- Do not pass href to a radio item; link behavior belongs to MenuItemLink and a radio row is not a link.
- Do not rely on the item to maintain selection privately, since selection state that is never written back to the parent checked values will desynchronize from the rest of the application.
- Do not assume menu-level behavior such as positioning, open state, hover delays, or inline rendering belongs on the item; those are configured on Menu and MenuTrigger.

## Anti-Patterns

### Private selection state that never reaches the group

❌ Toggling local state on the item, or ignoring the parent checked values, leaves the radio indicator out of sync with the rest of the application and can show two options as checked at once.

✅ Treat the group's checked values as the source of truth: read them for rendering and write the new single-value array from the checked-value change callback so every item re-renders consistently.

### Unique name per item

❌ Giving each radio item its own name dissolves the mutual exclusivity of the group, so several options can appear selected and assistive technology cannot describe them as one set.

✅ Use one shared name for all items in the group and vary only the value, which is what the radio group semantics depend on.

### Using radio items for commands or links

❌ MenuItemRadio announces a persistent selection state, so using it for an action or a navigation target tells screen reader users something false about what happened after activation.

✅ Use MenuItem for commands and MenuItemLink for navigation, and reserve MenuItemRadio for options that represent a lasting single selection.

### Hand-rolling the indicator with a checkmark child

❌ Adding a custom check icon inside the item content duplicates the built-in radio indicator, breaks the indicator column alignment, and defeats the checked-state announcement provided by the menuitemradio role.

✅ Let MenuItemRadio render its own indicator and control visible alignment through hasCheckmarks on the parent MenuList instead of injecting glyphs.

### Menu-level behavior attached to the item

❌ Props such as open state, positioning, hover delay, or inline rendering belong to Menu and MenuTrigger; setting them on the item has no effect and hides the real configuration point from the next maintainer.

✅ Configure open, positioning, hover, and dismissal behavior on Menu and MenuTrigger, and keep MenuItemRadio limited to value, name, and its own behavior flags.

## Accessibility

**Requirements**: MenuItemRadio must be rendered inside a MenuList so that it receives the menu role and roving tabindex behavior, and the MenuList itself must be reachable through a MenuTrigger that owns focus management. Every radio item needs an accessible name, which is normally supplied by its text content; when the content is only an icon or a visual swatch, provide a text label for assistive technology. The checked state is communicated through the item's checked property, mapped to aria-checked on the underlying menuitemradio element, so selection must be accurate for screen reader users to understand the group. Disabled items must remain distinguishable from enabled ones through the disabled property rather than through styling alone, and any selection change must be reflected in the parent checked values so that aria-checked is correct after the interaction. Menus should be dismissible with Escape, and focus must return to the trigger when the menu closes. All interactive states must meet WCAG contrast requirements, and the radio indicator plus text must not rely on color as the only means of conveying the checked state.

| Key | Action |
| --- | --- |
| `Enter` | Selects the focused radio item, applying its value to the group and firing the checked-value change callback. |
| `Space` | Selects the focused radio item, identical to Enter for menu radio items. |
| `ArrowDown` | Moves focus to the next item in the menu, wrapping to the first item when the last item is focused. |
| `ArrowUp` | Moves focus to the previous item in the menu, wrapping to the last item when the first item is focused. |
| `ArrowRight` | Opens the submenu when the focused item has a submenu; otherwise it is a no-op in a vertical menu. |
| `ArrowLeft` | Closes the current submenu and returns focus to its parent item. |
| `Home` | Moves focus to the first item in the menu. |
| `End` | Moves focus to the last item in the menu. |
| `Escape` | Closes the menu or the current submenu and returns focus to the trigger or parent item. |
| `Tab` | Closes the menu and moves focus to the next focusable element outside it; Shift plus Tab moves to the previous focusable element. |
| `Printable characters` | Typeahead moves focus to the first item whose label begins with the typed characters. |

**ARIA**: role of menuitemradio on the item root, aria-checked reflecting the item's checked state within the group, aria-disabled for disabled and disabledFocusable items, aria-haspopup on items that open a submenu, aria-expanded for the submenu state of the focused item, aria-labelledby pointing at the item's label content, role of menu on the enclosing MenuList, with menubar semantics when the menu is used in a menu bar

**Screen Reader**: Assistive technology announces MenuItemRadio as a radio menu item, speaking the item label followed by its checked or not-checked state, so users can tell which option in the group is currently selected. Position information within the menu is also announced during arrow-key navigation, and submenu items additionally report that a submenu is available and whether it is expanded. Disabled items are announced as unavailable, and disabledFocusable items remain in the arrow-key traversal while still being announced as unavailable, which lets users discover the option and its explanation. Selection changes are reported as they occur, and because the menu role forms a composite widget, screen readers expect arrow-key navigation rather than Tab to move between the radio items.

## Styling

Menu item rows are themed almost entirely through Griffel tokens, so prefer token overrides in the className you pass to the item or to the parent MenuList rather than hard-coded colors. The resting background comes from tokens.colorNeutralBackground1, hover state uses tokens.colorNeutralBackground1Hover, pressed state uses tokens.colorNeutralBackground1Pressed, and the persisted selected row uses tokens.colorNeutralBackground1Selected. Label text uses tokens.colorNeutralForeground1, secondary or descriptive text uses tokens.colorNeutralForeground2, and unavailable items use tokens.colorNeutralForegroundDisabled. Row geometry typically uses tokens.borderRadiusMedium for the rounded corners, tokens.spacingHorizontalS and tokens.spacingVerticalSNudge for inner padding, and tokens.spacingHorizontalMNudge for the gap between the radio indicator and the label. Typography follows tokens.fontSizeBase300, tokens.lineHeightBase300, and tokens.fontWeightRegular, with tokens.fontWeightSemibold reserved for emphasized labels. When you customize a row, target the root slot with a className rather than re-implementing the indicator, and remember that the indicator column only reserves width when the parent MenuList sets hasCheckmarks, so alignment fixes belong on MenuList rather than on the individual item.

## Performance

A menu mounts its popover surface when it opens, so the cost of many radio items is paid on open rather than at page load; keep the number of options reasonable and avoid heavy custom content inside each item. Selection re-renders the item whose checked state changed, so derive labels and handlers outside the render path and avoid creating new inline class objects or callbacks for every item on each render. Because radio items persist on click by default, the menu stays mounted across repeated selections, which avoids repeated open and close work but also means any expensive content inside the menu remains alive until the menu is dismissed. Submenus attached to a radio item add an additional surface that is mounted when entered, so keep nested radio groups shallow and cheap to construct. Prefer stable string values and simple text labels over freshly created objects for item content, and avoid forcing layout-affecting style recalculations by toggling hasCheckmarks or hasIcons while the menu is open.

## Theming & Tokens

MenuItemRadio inherits all of its visual values from the enclosing FluentProvider theme and expresses them as Griffel tokens, so switching between light, dark, and brand themes requires no changes to the item itself. The row background rests on tokens.colorNeutralBackground1 and moves through tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed, with the persisted selected row using tokens.colorNeutralBackground1Selected. Label text is drawn from tokens.colorNeutralForeground1, secondary text from tokens.colorNeutralForeground2, and unavailable items from tokens.colorNeutralForegroundDisabled, which the high-contrast theme maps to system colors so disabled rows stay legible without relying on reduced opacity alone. Geometry and rhythm come from tokens.borderRadiusMedium, tokens.spacingHorizontalS, tokens.spacingVerticalSNudge, and tokens.spacingHorizontalMNudge, while text sizing follows tokens.fontSizeBase300, tokens.lineHeightBase300, and tokens.fontWeightRegular. Because the parent MenuList controls the reserved indicator and icon columns, theming consistency across a mixed menu depends on setting hasCheckmarks and hasIcons at the list level rather than overriding spacing per item.

## Migration Notes

In v9 the responsibilities that used to sit on a single menu item component are split across three layers: Menu owns open state, positioning, hover delays, inline rendering, and close-on-scroll behavior; MenuList owns the checked values, the default checked values, the checked-value change callback, and the hasCheckmarks and hasIcons alignment flags; and MenuItemRadio itself only declares a value, a group name, and its behavior flags such as persistOnClick, disabled, disabledFocusable, and hasSubmenu. If you are porting from Fluent UI React v8 or from earlier v9 previews, move any per-item checkmark or icon alignment flags up to MenuList, stop supplying custom checkmark children, and drive selection through the parent checked values plus the checked-value change callback instead of private item state. Styling has also moved from style prop objects to Griffel classes, so custom looks should be expressed as a className on the root slot using design tokens rather than inline style objects. The root slot replaces the older pattern of attaching styles to an internal wrapper, and menu-level behaviors that some previews exposed on the item, such as submenu positioning or hover delay, now belong to Menu and MenuTrigger.

## Edge Cases

- Radio items keep the menu open after selection by default, so code that expects the menu to close on choice must explicitly set persistOnClick to false on the item.
- The item's checked appearance is driven by the group's checked values rather than by its own internal state, so a value that is never written back to the parent list will render as unchecked even after being activated.
- MenuItemRadio does not accept href; navigational menu rows must use MenuItemLink, and mixing link and radio rows in one menu requires care so users understand which rows select and which navigate.
- Without hasCheckmarks on the parent MenuList the indicator column is not reserved, so labels can shift horizontally between menus that do and do not show radio indicators.
- disabledFocusable keeps an unavailable option in arrow-key traversal; if the reason for unavailability is not surfaced nearby, keyboard users will land on a row that appears broken.
- A radio item that also declares hasSubmenu combines a selection state with a nested surface, which can confuse users about whether activating the row selects the value or merely opens the child menu.
- Group identity is scoped to the MenuList that renders the items, so reusing the same name in two different menus is safe, while rendering two MenuLists with the same group name into one visible surface is not.
- Menu behavior props such as open, positioning, inline, hoverDelay, openOnHover, openOnContext, and closeOnScroll live on Menu and MenuTrigger, not on the item, so passing them to MenuItemRadio silently does nothing.
- The switchIndicator slot present in the broader menu item API belongs to switch-style rows such as MenuItemSwitch; radio items communicate their state through the radio indicator and the group's checked values.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
