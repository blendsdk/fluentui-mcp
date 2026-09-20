# MenuItemCheckbox

> **Package**: `@fluentui/react-menu` v9.25.0
> **Import**: `import { MenuItemCheckbox } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

MenuItemCheckbox is a menu item that carries an independent, toggleable checked state, rendered as a menuitemcheckbox inside a menu. It is part of the Menu family: it is placed inside a MenuList, which itself sits inside a Menu, so that focus management, roving navigation, and selection state are coordinated by the menu rather than by the item itself. Each MenuItemCheckbox is identified by a required name (the group it belongs to) and a required value (the specific entry within that group), and its checked appearance is derived from the checked values tracked by the menu. Because several checkboxes can be checked at once, this component expresses multi-select semantics, in contrast to MenuItemRadio (single-select) and plain MenuItem (an action that does not carry a state). It supports an icon slot, a checkmark indicator, submenu indicators when hasSubmenu is set, disabled and disabledFocusable states, and persistOnClick to keep the menu open after a selection so users can toggle several items in one pass. The underlying root is a div slot, not a native input, so the checked state is exposed through ARIA rather than through form submission.

**When to use**: Use MenuItemCheckbox when a menu needs to toggle one or more independent options that are not mutually exclusive, such as enabling multiple view layers, filters, or formatting attributes. Choose MenuItemRadio instead when exactly one option in the group may be active, and MenuItemSwitch when the setting reads more naturally as an on/off switch with a switch indicator. Use a plain MenuItem for commands that simply fire an action and do not hold state, and MenuItemLink when the item navigates rather than selects. MenuItemCheckbox is appropriate when grouping is meaningful and the menu stays open across multiple toggles (via persistOnClick or the menu's persistOnItemClick); if the interaction is really a form with a persistent selection list, a Checkbox or a Listbox outside a menu is usually clearer.

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

- **name**: Required. Identifies the checkbox group that the item belongs to. Items that share a name are reported together in onCheckedValueChange and stored under the same key in checkedValues or defaultCheckedValues. Use one name per logical group so that separate groups do not interfere with each other. `view`
- **value**: Required. The specific option within the group that this item represents. It is the string that appears in the checked values array for the matching name, so it must be unique within the group and stable across renders. `gridlines`
- **checkedItems**: Required string array holding the currently checked values for the item's group. It represents the item's selected entries and is used to determine the rendered checked state, so it should be kept in sync with the menu-level checked values rather than mutated independently.
- **disabled**: Prevents the item from being selected and removes it from the keyboard navigation sequence while keeping it visible for context. Use when an option is genuinely unavailable rather than merely inconvenient to reach. `true`
- **disabledFocusable**: Keeps the item focusable and discoverable while blocking selection and activation, which is preferable to disabled when screen reader and keyboard users need to learn that the option exists but is not available. `true`
- **persistOnClick**: Keeps the menu open after the checkbox is toggled, which is essential for multi-select flows where users pick several options in a single pass. Leave it off for one-shot menus that should dismiss on selection. `true`
- **hasSubmenu**: Indicates that the item opens a nested menu and adds the corresponding indicator and aria-haspopup cue. Only set it when the item truly owns a submenu; a checkbox that also opens a submenu is easy to misuse and should be reserved for genuinely hierarchical options. `true`
- **root**: The underlying slot rendered as a div, exposed so you can attach className, style, and data attributes. Use root with Griffel classes for customization instead of wrapping the item in extra elements that would break menu roles.
- **children**: The item's content, typically the visible text label plus an optional icon. Text content is what supplies the accessible name, so avoid icon-only items without an aria-label. `Show gridlines`
- **href**: Supplies a navigation target for link-style items in the menu family. MenuItemCheckbox itself is a stateful toggle, so navigation should be delegated to MenuItemLink rather than added here.
- **switchIndicator**: The trailing span slot used by the switch-style item to render an on/off indicator. It belongs to MenuItemSwitch; a checkbox item relies on the checkmark indicator rather than a switch indicator.
- **checkedValues**: A record of group name to array of checked values that makes selection controlled at the menu level. Provide it together with onCheckedValueChange when the application needs to read or persist the selection.
- **defaultCheckedValues**: The initial selection used when the menu should manage its own state. Use it for uncontrolled menus where the initial checked options are known but subsequent changes are handled internally and surfaced through onCheckedValueChange. `{ view: ['gridlines'] }`
- **onCheckedValueChange**: Callback fired when an item's checked state changes, receiving the event and data describing the group name and the new checked values. This is the correct place to update application state instead of using per-item click handlers.
- **hasCheckmarks**: Reserves a leading column in the list so checkmark indicators align across all items. Set it on the ancestor list when any item in the group can be checked, and keep it consistent as items change.
- **hasIcons**: Reserves a leading column for icons on every item in the list, keeping labels aligned. When both checkmarks and icons are present the columns are stacked, so verify alignment at the list level.
- **hoverDelay**: Controls how long a pointer must hover before a hover-opened menu or submenu appears. Increase it to avoid accidental opening when the pointer passes over the menu, and decrease it for more responsive exploration. `500`
- **inline**: Renders the menu inline in the document flow rather than in a popup. Use it for embedded menus such as command bars, but confirm that focus behavior still suits the surrounding layout. `true`
- **open**: Controls whether the menu containing the item is open, making open state controlled. Pair it with onOpenChange and keep it off for menus that open on trigger interaction.
- **defaultOpen**: Sets the initial open state for an uncontrolled menu, useful when a checkbox menu should start expanded in a demo or embedded surface. `true`
- **onOpenChange**: Notifies the application when the menu opens or closes, including the reason. Use it to sync external state or to log interaction, not to toggle individual checkbox values.
- **openOnContext**: Allows the menu to open from a right-click or context-menu gesture. It changes the expected interaction model, so use it only for context-driven surfaces.
- **openOnHover**: Opens the menu when the pointer hovers the trigger. This is helpful for menu bars but can be surprising for a checkbox menu holding persistent selections. `true`
- **persistOnItemClick**: A menu-level equivalent of persistOnClick that keeps the surface open after any item is selected. Prefer it when every item in a multi-select menu should keep the menu open, and use the item-level persistOnClick for exceptions.
- **positioning**: Adjusts how the popup is positioned relative to its trigger, including alignment and collision handling. Configure it at the menu level when the default placement clips or overlaps important content.
- **closeOnScroll**: Closes the menu when the page scrolls. Leaving it enabled prevents a menu holding checkbox selections from drifting away from its trigger. `true`
- **focusFirst**: Imperatively moves focus to the first item in the menu. Use it from the trigger's own key handling when you need to replicate the standard down-arrow-to-open behavior in a custom composition.
- **disableButtonEnhancement**: Stops the trigger element from being enhanced into a button in custom trigger compositions. Only use it when you are providing your own fully accessible trigger. `true`

## Best Practices

### Do's

- Provide both name (the checkbox group) and value (the individual option), because the checked state is keyed off those two identifiers.
- Let the parent menu own the state: pass checkedValues for controlled selection or defaultCheckedValues for uncontrolled selection, and react to onCheckedValueChange instead of maintaining your own boolean state per item.
- Set persistOnClick (or the menu-level persistOnItemClick) when users are expected to toggle several checkboxes in one visit to the menu, so the menu does not close after the first click.
- Render MenuItemCheckbox only inside a MenuList within a Menu so that focus, arrow-key navigation, and aria-checked are managed for you.
- Use distinct names for logically separate groups of checkboxes, and reuse the same name for items that should be reported together through onCheckedValueChange.
- Give every item a visible text label via children, and set hasCheckmarks on the ancestor list when the checkmark column should align across all items.
- Prefer disabledFocusable over disabled when the option must remain reachable by keyboard and discoverable by screen readers while still being unselectable.

### Don'ts

- Do not use MenuItemCheckbox to express a mutually exclusive choice; that is the role of MenuItemRadio, and mixing the two semantics in one group confuses assistive technology.
- Do not toggle selection by writing an onClick handler that flips local state; use onCheckedValueChange so the menu's checked values stay the single source of truth.
- Do not rely on MenuItemCheckbox as a form control: it renders as a div, has no native input, and submits no value with a form.
- Do not attach href to a MenuItemCheckbox; navigation belongs to MenuItemLink, and a checked menuitemcheckbox that also navigates is ambiguous to users.
- Do not attempt to force a checked state that contradicts the menu's checkedValues, since the rendered checkmark is derived from the menu rather than from the item.
- Do not use a switchIndicator on a checkbox item; that affordance belongs to MenuItemSwitch and implies a different interaction.
- Do not nest a submenu under a checkbox item unless the submenu is genuinely needed, since hasSubmenu changes the announced role cues and the expected keyboard behavior.

## Anti-Patterns

### Using a checkbox item for an exclusive choice

❌ A menuitemcheckbox announces an independent on/off state, so users expect to be able to check several options. When the application actually allows only one, the removal of the previous selection feels like a bug and the announced role is wrong.

✅ Use MenuItemRadio for mutually exclusive selections, which conveys the correct menuitemradio semantics and shows the single active option, and reserve MenuItemCheckbox for independent, multi-select toggles.

### Tracking checked state with local component state

❌ Storing a boolean per item and flipping it in an onClick handler duplicates the menu's selection model. The rendered checkmark, the announced aria-checked value, and the application state can drift apart, and the next render may reset the visual state.

✅ Drive selection from the menu using checkedValues for controlled menus or defaultCheckedValues for uncontrolled menus, and update application state in onCheckedValueChange using the provided group name and values.

### Closing the menu after every toggle in a multi-select flow

❌ A menu that closes on each selection forces users to reopen it and re-navigate for every option, which is slow and disorienting when several checkboxes need to be set.

✅ Set persistOnClick on the item, or persistOnItemClick on the menu, so the surface stays open while the user toggles multiple checkboxes, and let the explicit dismissal keys close it.

### Treating the item as a form control

❌ Because the root is a div with a menuitemcheckbox role, it has no native input, no submitted value, and no participation in form validation. Code that reads form data will never see these selections.

✅ Use Checkbox or another form control when the selection must be submitted with a form, and use MenuItemCheckbox only for menu-scoped choices whose values are captured through onCheckedValueChange.

### Reusing one name across unrelated groups

❌ The name determines which values are grouped together, so unrelated options sharing a name are reported as one combined selection and may appear checked when the user selected something else with the same value.

✅ Assign a distinct, meaningful name to each logical group and keep values unique within a group; verify that the keys in handled checked values match those names.

## Accessibility

**Requirements**: MenuItemCheckbox must meet WCAG 2.1 AA: keyboard operability (2.1.1), visible focus (2.4.7), a programmatically determinable name, role and state (4.1.2), and sufficient contrast for the label, icon, and checkmark indicator (1.4.3 and 1.4.11). Each item needs an accessible name, taken from its visible text children or supplied with aria-label when the visible content is an icon only. The checked state must always be exposed (aria-checked true or false), never inferred solely from color or from the presence of a glyph. Because the item root is a div with a menuitemcheckbox role rather than a native control, none of the semantics are free — they depend on the item being rendered inside a Menu so the correct roles, state, and focus behavior are applied.

| Key | Action |
| --- | --- |
| `Enter` | Activates the focused checkbox item, toggling its checked state and firing onCheckedValueChange; the menu closes unless persistOnClick or persistOnItemClick keeps it open. |
| `Space` | Toggles the checked state of the focused item, behaving the same as Enter for a menuitemcheckbox. |
| `ArrowDown` | Moves focus to the next item in the menu, wrapping according to the menu's navigation behavior. |
| `ArrowUp` | Moves focus to the previous item in the menu. |
| `ArrowRight` | Opens a submenu when the focused item has hasSubmenu set; otherwise it moves focus out of the menu in a horizontal composition. |
| `ArrowLeft` | Closes an open submenu and returns focus to its parent item. |
| `Home` | Moves focus to the first item in the menu list. |
| `End` | Moves focus to the last item in the menu list. |
| `Escape` | Closes the menu and returns focus to the element that opened it. |
| `Tab` | Dismisses the menu and moves focus to the next focusable element outside of it. |
| `Character keys` | Type-ahead moves focus to the next item whose label starts with the typed characters. |

**ARIA**: role="menuitemcheckbox" on the item root, aria-checked to expose the true or false selection state of the item, aria-disabled when the item is disabled or disabledFocusable, aria-label or aria-labelledby to name items whose visible content is not plain text, aria-haspopup and aria-expanded when the item owns a submenu

**Screen Reader**: A screen reader announces the item's accessible name followed by its role and state, for example the label plus "menu item checkbox" and "checked" or "not checked". When the user toggles the item, the state change is announced again without moving focus, and the menu's container is announced as a menu so users understand the arrow-key navigation model. Disabled items are announced as dimmed or unavailable and are skipped by normal arrow navigation unless they are disabledFocusable, in which case they remain focusable but do not activate. Because checked state is conveyed through aria-checked rather than a visual glyph alone, the selection is available to users who cannot see the checkmark indicator.

## Styling

Style MenuItemCheckbox through the className prop and Griffel, targeting the root slot; avoid inline style objects because they defeat Griffel's atomic class reuse. The default item uses tokens.colorNeutralForeground1 for the label, tokens.colorNeutralForegroundDisabled for disabled items, and tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed, and tokens.colorNeutralBackground1Selected for pointer and selection feedback. The checkmark indicator animates in and typically uses tokens.colorCompoundBrandForeground1 with tokens.durationNormal and tokens.curveEasyEase; brand-tinted labels during selection commonly use tokens.colorNeutralForeground2BrandSelected. Item padding is composed from tokens.spacingHorizontalS, tokens.spacingHorizontalSNudge, and tokens.spacingVerticalSNudge with tokens.borderRadiusMedium for the rounded highlight, and text uses tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300. Because the checkmark occupies a fixed leading column, changing hasCheckmarks or hasIcons on the ancestor list shifts text alignment for every item, so apply such layout changes at the list level rather than per item.

## Performance

MenuItemCheckbox is a small presentation component that holds no internal selection state, so its cost is dominated by how the menu's checked values are produced. Avoid creating a new checkedValues object on every render of the menu, because that forces all sibling items to re-evaluate their checked appearance; memoize it with useMemo and wrap onCheckedValueChange in useCallback. Because every item in a checkbox menu is a candidate for re-render when selection changes, keep the per-item prop set small, hoist any icon elements to module scope rather than recreating them inline, and prefer Griffel classes over inline style objects so that class merging stays cheap. Large menus benefit more from reducing the number of sibling items than from micro-optimizing a single item, since focus navigation and re-render both scale with the item count. A checkbox menu that stays open through many toggles (persistOnClick) re-renders on each change, so keep the callback body free of expensive synchronous work and defer heavy updates outside the interaction.

## Theming & Tokens

MenuItemCheckbox inherits everything from the surrounding FluentProvider theme and from the menu's own styles, so its label, hover, pressed, selected, and disabled colors all come from theme tokens rather than hard-coded values. The label uses tokens.colorNeutralForeground1, disabled content uses tokens.colorNeutralForegroundDisabled and tokens.colorNeutralForeground2Disabled, and the interactive highlight uses tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed, and tokens.colorNeutralBackground1Selected. The checkmark indicator is drawn with tokens.colorCompoundBrandForeground1 and can shift to tokens.colorNeutralForeground2BrandSelected for brand-tinted labels, while the checkmark reveal uses tokens.durationNormal with tokens.curveEasyEase. Geometry and typography come from tokens.spacingHorizontalS, tokens.spacingHorizontalSNudge, tokens.spacingVerticalSNudge, tokens.borderRadiusMedium, tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300. The popup surface that hosts the item typically uses tokens.colorNeutralBackground1 with tokens.colorNeutralStroke1 and tokens.shadow16 or tokens.shadow64, so switching between light and dark themes updates the whole menu, including checkbox items, without any component-level changes.

## Migration Notes

MenuItemCheckbox is a v9 component with no direct one-to-one counterpart in v8, where checked menu items were expressed through the contextual menu's item model and a checked flag, and the item was not a distinct role-bearing component. In v9 the behavior is split into purpose-built items: MenuItemCheckbox for independent toggles, MenuItemRadio for exclusive selection, MenuItemSwitch for on/off settings, and MenuItemLink for navigation. Selection is no longer tracked per item; the menu owns checkedValues, defaultCheckedValues, and onCheckedValueChange, and each item is addressed through its required name and value. Consumers migrating from v8 will also notice that the root is a div carrying role and state rather than a button or input element, so state must be read from the menu's checked values instead of from the DOM.

## Edge Cases

- MenuItemCheckbox coordinates its state through the surrounding menu, so rendering it outside a Menu or MenuList leaves it without coordinated focus management and without any checked values to read.
- Both name and value are required identifiers; omitting value or duplicating values inside a group makes individual options indistinguishable in the reported checked values.
- Because the root is a div with role menuitemcheckbox rather than a native input, the checked state exists only in ARIA and in the menu's data, never in form submission.
- A checkbox menu closes by default after activation, so multi-select interactions must opt in with persistOnClick or the menu-level persistOnItemClick or the user will have to reopen the menu for each toggle.
- Combining hasCheckmarks with hasIcons changes the leading column layout for every sibling item, so alignment problems usually need to be fixed on the ancestor list rather than on the individual checkbox item.
- disabled removes the item from keyboard navigation while disabledFocusable keeps it reachable; choosing the wrong one either hides an unavailable option from keyboard users or creates a focus stop that cannot be activated.
- Pairing href with a checkbox item mixes navigation and selection semantics; MenuItemLink exists for items whose purpose is to navigate.
- Using switchIndicator on a checkbox item introduces the visual language of an on/off switch while the announced role remains menuitemcheckbox, so the affordance and the semantics disagree.
- Menu-level behaviors such as hoverDelay, openOnHover, openOnContext, positioning, and closeOnScroll affect the surface hosting the item rather than the item itself, so they should be adjusted at the menu level to avoid inconsistent behavior across sibling items.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
