# MenuDivider

> **Package**: `@fluentui/react-menu` v9.25.0
> **Import**: `import { MenuDivider } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

MenuDivider is a presentational separator that visually splits a menu into distinct groups of commands. It is designed to be placed inside a Menu's MenuPopover / MenuList, between sets of MenuItem, MenuItemCheckbox, MenuItemRadio, MenuItemLink, or MenuSplitGroup children, so that related actions read as a single cluster. MenuDivider renders a single root slot (a div) and carries no text, no label, and no interactive behavior of its own: it is purely a visual grouping cue. Because it is not a menu item, it never receives focus, is skipped by the menu's keyboard navigation, and does not participate in checked/selection state, submenu opening, or item activation. Use it when a menu contains two or more conceptual groups of commands and a labeled group is unnecessary; when a group needs a visible heading, pair MenuGroup with MenuGroupHeader instead, and when you need a general layout separator outside of menus, use the standalone Divider component.

**When to use**: Use MenuDivider inside a Menu (as a child of the MenuPopover's menu list) whenever a list of commands contains two or more logical clusters of actions and you want the boundary between them to be obvious at a glance — for example, separating read-only actions from destructive ones, or separating per-item commands from menu-wide commands at the bottom. Prefer MenuDivider over making the menu longer or deeper: it clarifies structure without adding nesting or another hover/expansion step. Choose MenuGroup with MenuGroupHeader when the groups need an accessible, visible name that screen reader users can hear, since MenuDivider conveys grouping visually only. Choose the standalone Divider when separating content on a page, in a Card, or in any non-menu surface, and choose ToolbarDivider when separating controls inside a Toolbar rather than a Menu. Avoid MenuDivider in contexts where the surrounding container is not a menu list, since its inline insets and border treatment assume menu item metrics.

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

- **root**: The only slot MenuDivider exposes. It is the rendered div that carries the separator's class and styling; use it to override the element attributes or the className when you need a different thickness, color, or inset. There is no other slot to style — everything visual about the divider lives on this element. `root slot with a custom className`
- **checkedItems**: Not a MenuDivider prop — this belongs to checkbox or radio menu item types and describes which values are currently selected within a named group. It has no meaning on a divider, which never holds selection state. `['option-a']`
- **name**: Not a MenuDivider prop. On selectable menu items, name identifies the group that a value belongs to when reporting checked-value changes. A divider has no group and never emits a checked-value change. `colors`
- **value**: Not a MenuDivider prop. It identifies a single selectable menu item within its named group so that selection changes can be reported. Dividers are not selectable and must never be given a value. `red`
- **disabled**: Not a MenuDivider prop — it belongs to actionable menu items. Since a divider is never interactive, there is no disabled state to express; if you need to visually mute a whole group, disable each item in the group instead. `true`
- **disabledFocusable**: Not a MenuDivider prop. On menu items it keeps the element in the focus order while marking it disabled. A divider is never focusable, so this concept does not apply. `true`
- **href**: Not a MenuDivider prop — it belongs to link-style menu items and drives navigation. Dividers render no anchor and should never be used as navigation targets. `https://example.com`
- **hasSubmenu**: Not a MenuDivider prop. It affects how the containing Menu treats an item as a submenu trigger and how opening and closing are timed. Dividers have no submenu and are ignored by submenu logic. `true`
- **persistOnClick**: Not a MenuDivider prop. On menu items it keeps the menu open after activation; a divider is never activated, so this setting has no effect when applied to one. `true`
- **switchIndicator**: Not a MenuDivider prop. It customizes the check or switch affordance drawn for selectable or toggling items. Dividers show no indicator and would not render it meaningfully. `span slot`
- **checkedValues**: Not a MenuDivider prop. This controlled map of group names to selected values lives on the Menu that owns the selectable items; dividers simply sit between those items and do not participate in the map. `record of group name to value array`
- **defaultCheckedValues**: Not a MenuDivider prop. It supplies uncontrolled initial selections for the owning Menu. Inserting a divider does not change which values are selected. `record of group name to value array`
- **hasCheckmarks**: Not a MenuDivider prop; it lives on the Menu and reserves the checkmark gutter for selectable items. This matters for divider styling only insofar as the divider's default inset aligns with that gutter — if you disable checkmarks and icons, re-check the inset alignment. `true`
- **hasIcons**: Not a MenuDivider prop; it lives on the Menu and reserves the icon gutter. Because MenuDivider is inset to line up with the icon column, changing this setting on the Menu is a common reason a divider looks misaligned. `true`
- **onCheckedValueChange**: Not a MenuDivider prop. It is the callback the owning Menu fires when a selectable item changes; a divider never triggers this callback. `event handler on the Menu`
- **children**: Not a MenuDivider prop in the item sense. The children pair shown in this API set belongs to the Menu composition (trigger plus popover); MenuDivider itself renders an empty element and should not be given content children such as text. `trigger plus popover`
- **hoverDelay**: Not a MenuDivider prop. It controls how long hover must last before the menu or a submenu opens; dividers play no role in hover timing. `500`
- **inline**: Not a MenuDivider prop. Inline menus render in place instead of in a popover; the divider styling is the same either way, so no changes are needed when switching between inline and popover menus. `true`
- **open**: Not a MenuDivider prop. It is the controlled open state of the surrounding Menu; dividers are unaffected by open or closed state beyond being visible while the menu is open. `true`
- **defaultOpen**: Not a MenuDivider prop. It sets the uncontrolled initial open state of the Menu that hosts the dividers. `true`
- **onOpenChange**: Not a MenuDivider prop. It reports why the owning Menu opened or closed; dividers do not emit open-change events. `event handler on the Menu`
- **openOnContext**: Not a MenuDivider prop. It lets the Menu open from a context-menu gesture; dividers render identically in context menus and popover menus. `true`
- **openOnHover**: Not a MenuDivider prop; it configures hover-to-open behavior on the owning Menu. Dividers add no hover target of their own, so hover behavior is unchanged by inserting them. `true`
- **persistOnItemClick**: Not a MenuDivider prop. It keeps the menu open when an item is clicked; since a divider cannot be clicked to activate anything, it is unaffected. `true`
- **positioning**: Not a MenuDivider prop; it controls where the popover surface is placed relative to the trigger. Because the divider is inset relative to the popover, changing positioning does not require divider changes. `positioning settings object`
- **closeOnScroll**: Not a MenuDivider prop. It dismisses the menu when the page scrolls; divider rendering is unaffected, though long menus with many dividers are more likely to scroll and hit this behavior. `true`
- **focusFirst**: Not a MenuDivider prop. It is an imperative handle used by the menu to move focus to its first item; dividers are skipped by this movement because they are not focusable. `focus callback`
- **disableButtonEnhancement**: Not a MenuDivider prop. It belongs to triggers that internally render a Button, and only affects how that trigger element is composed — it has nothing to do with dividers. `true`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Place MenuDivider directly between the last item of one command group and the first item of the next, so the separator reads as the boundary rather than as decoration.
- Keep groups roughly balanced — a divider is most useful when each side contains two or more related commands.
- Put the most destructive or least frequently used command (for example Delete or Remove) in its own trailing group, separated by a MenuDivider.
- Use MenuGroup plus MenuGroupHeader instead of MenuDivider when the groups need a name that assistive technologies can announce.
- Verify that the menu remains scannable without the divider: the ordering and wording of MenuItem labels should still communicate grouping on their own.
- Style a divider through the root slot's className when you need a different weight, color, or inset, rather than wrapping it in extra elements.
- Test the menu with a screen reader and by keyboard only after inserting dividers, to confirm arrow-key navigation still moves cleanly from the last item of one group to the first item of the next.

### Don'ts

- Don't use MenuDivider as a layout or spacing element between arbitrary content; it exists to group menu commands, not to create whitespace.
- Don't render two MenuDividers back to back or place one immediately after another with nothing between them, which produces a double line and visual noise.
- Don't start or end a menu with a MenuDivider, since a leading or trailing rule implies a missing group.
- Don't rely on MenuDivider to announce grouping to assistive technology — it carries no label and is not announced as an actionable item.
- Don't pass item-level props to MenuDivider (selection values, submenu flags, disabled state, or similar); it has no item behavior and such props do nothing useful.
- Don't put text or other children inside MenuDivider expecting it to render like a header; use MenuGroupHeader for anything that should be read.
- Don't substitute MenuDivider for a submenu or a MenuGroupHeader just to break up a list that is simply too long — shorten or restructure the menu first.

## Anti-Patterns

### Using MenuDivider as a layout spacer

❌ MenuDivider is a separator with menu-specific insets, not a general-purpose spacing element. Using it to push content apart in a menu, popover, or page yields inconsistent rhythm and a stray rule where the user expected nothing.

✅ Use spacing tokens such as tokens.spacingVerticalS on the surrounding container for layout rhythm, and reserve MenuDivider strictly for marking a boundary between groups of menu commands. Outside menus, use the standalone Divider component.

### Stacking or bookending dividers

❌ A divider as the first or last child of a menu, or two dividers with an empty group between them, implies content that is not there. It reads as a rendering bug and increases visual noise without adding structure.

✅ Only place a MenuDivider between two non-empty groups. If removing a divider leaves the menu confusing, restructure the commands, shorten the list, or promote part of it into a submenu instead of adding rules.

### Relying on the divider to explain grouping

❌ MenuDivider has no accessible name and is skipped by keyboard navigation, so screen reader users hear the item before and after it as consecutive items. If the only cue that "Delete" is a different kind of action is the rule above it, that meaning is lost.

✅ Express meaningful grouping semantically with MenuGroup and MenuGroupHeader, and reinforce it in the wording and order of the items themselves. Treat MenuDivider as a visual enhancement layered on top of grouping the user can already infer.

### Passing item props to a divider

❌ Props such as selection values, submenu flags, disabled state, and item names belong to actionable menu items. Passing them to MenuDivider has no effect and misleads future readers into thinking the divider participates in menu state.

✅ Keep MenuDivider limited to the root slot and its styling. Apply interaction-related props only to MenuItem, MenuItemCheckbox, MenuItemRadio, MenuItemLink, or MenuSplitGroup children.

### Faking a divider with an empty item

❌ Rendering an empty or disabled menu item to create a visual break leaves an extra, focusable (or at least enumerated) element in the menu, which degrades keyboard traversal and screen reader announcements.

✅ Remove the placeholder item and insert MenuDivider between the groups. Because it is not focusable, arrow-key navigation then moves directly from the last item of one group to the first item of the next.

## Accessibility

**Requirements**: MenuDivider is a decorative separator and must not be the only signal of grouping. Grouping that matters to comprehension should also be expressed by order and by MenuGroup / MenuGroupHeader, so that users who cannot perceive the divider still understand the structure. The divider must never be focusable, must never appear in the tab order, and must not break the menu's roving focus or wrap-around behavior. Because it contains no text, it contributes nothing to the accessible name of the menu or its items, and it should not be reachable by the menu's character typeahead. Ensure the surrounding menu retains correct menu semantics and that every sibling item is still reachable by keyboard after dividers are added.

| Key | Action |
| --- | --- |
| `ArrowDown` | Moves focus to the next focusable menu item, skipping over any MenuDivider in between. |
| `ArrowUp` | Moves focus to the previous focusable menu item, skipping over any MenuDivider in between. |
| `Home` | Moves focus to the first focusable menu item in the list, ignoring a leading divider. |
| `End` | Moves focus to the last focusable menu item in the list, ignoring a trailing divider. |
| `Enter` | Activates the currently focused menu item; has no effect on MenuDivider because it can never receive focus. |
| `Space` | Activates the currently focused menu item; has no effect on MenuDivider because it can never receive focus. |
| `Escape` | Closes the menu and returns focus to the trigger, regardless of which item is focused. |
| `Tab / Shift+Tab` | Moves focus out of the menu entirely and dismisses it; MenuDivider is never a tab stop. |
| `ArrowRight` | Opens a submenu when the focused item has one; MenuDivider does not respond. |
| `ArrowLeft` | Closes the current submenu; MenuDivider does not respond. |
| `A–Z / character keys` | Typeahead moves focus to the next item whose label starts with the typed characters; dividers are not matchable targets. |

**ARIA**: role="separator" (applied to the root slot only if you choose to make the divider explicitly semantic; by default it is treated as decorative), aria-hidden (appropriate when the divider is purely visual and the grouping is already conveyed by order and labels), aria-label (not applicable to MenuDivider itself; it belongs on the menu or trigger, not on the separator), aria-disabled (belongs to MenuItem, not to MenuDivider — dividers are never disabled because they are never interactive), aria-haspopup (belongs to the trigger or to items with submenus, never to MenuDivider)

**Screen Reader**: MenuDivider is not focusable and is not exposed as a menu item, so screen readers do not stop on it and it is not counted in the menu's item count. Its inline content is empty, so it contributes no accessible name or description anywhere in the menu. Depending on the platform and whether a separator role is applied to the root, screen readers either ignore it entirely or may announce a brief "separator" between adjacent groups; you should never depend on that announcement to convey meaning. Because it is skipped by arrow-key navigation, users hear the item before the divider and the item after it as consecutive items — the grouping must therefore be understandable from the item labels and their order alone.

## Styling

MenuDivider is styled by overriding the root slot's className, which is the cleanest way to change its weight, color, or insets. By default Fluent draws the divider as a thin horizontal rule and insets it so it aligns with the text column of menu items — matching where icons and checkmarks sit — rather than spanning the full popover width. To change the line itself, target the border color and width with tokens.colorNeutralStroke2 (the standard subtle separator line) or tokens.colorNeutralStroke1 / tokens.colorNeutralStroke3 for a stronger or fainter rule, and tokens.strokeWidthThin for the line thickness. To adjust rhythm, use the spacing tokens rather than hard-coded pixels: tokens.spacingVerticalXS for the vertical margins above and below, and tokens.spacingHorizontalSNudge or tokens.spacingHorizontalM to control the inset on the leading edge. If your menu has a custom accent, tokens.colorBrandStroke1 or tokens.colorNeutralStrokeAccessible can be used for a higher-contrast rule; in forced-colors and high-contrast modes prefer system-respecting tokens so the divider does not disappear against the popover's tokens.colorNeutralBackground1 surface. Avoid styling the divider with absolute positioning or negative margins to fake alignment — adjust the inset tokens instead, and re-check the alignment whenever menu item padding changes.

## Performance

MenuDivider is one of the cheapest components in the library: it renders a single static element with no event handlers, no state, no refs to track, and no portal. It does not re-render on its own and adds essentially nothing to the cost of opening a menu. The only practical performance considerations are indirect: every divider is an extra DOM node in the popover, so a menu with dozens of rules will have a slightly larger tree; and recreating custom style classes on every render of the parent menu (for example by calling a styling hook with freshly built arguments or inlining style objects) causes unnecessary class recalculation across all menu children, including dividers. Define custom divider styles once at module scope with the merge-styles hook and share the resulting class name, rather than rebuilding it per render.

## Theming & Tokens

MenuDivider inherits its colors, line weight, and spacing from the theme provided by FluentProvider, so it automatically adapts to light, dark, and high-contrast themes. The separator line is drawn with the neutral stroke ramp — tokens.colorNeutralStroke2 for the standard subtle rule, with tokens.colorNeutralStroke1 and tokens.colorNeutralStroke3 available for stronger or fainter contrast on branded or dense surfaces — at a thickness of tokens.strokeWidthThin. Vertical rhythm around the divider uses tokens.spacingVerticalXS, and the inline inset that aligns the rule with the item text column uses horizontal spacing tokens such as tokens.spacingHorizontalSNudge. The surrounding popover surface is painted with tokens.colorNeutralBackground1 and its text with tokens.colorNeutralForeground1 / tokens.colorNeutralForeground2, which is the context the divider must remain visible against. For brand or accent treatments, tokens.colorBrandStroke1 can be used on the root slot. Because the divider is only a border, its theming surface is small: overriding the border color and the margin tokens on the root slot's className is usually the entire customization needed, and doing so keeps the divider consistent with MenuItem metrics because those metrics come from the same token set.

## Migration Notes

In v8 and earlier, separators inside a contextual or overflow menu were produced by declaring a special menu item type (a divider item type on ContextualMenuItem) or by placing a Divider with menu-specific styles inside the callout. In v9 this is modeled as an explicit child component: you render MenuDivider between MenuItem elements, and you never declare a divider as an item — which means it cannot be selected, focused, or activated. Similarly, in older Fluent (v0/Northstar) menus, a divider could be expressed as a prop on a menu item or as a Divider with menu-specific props such as orientation and fitted sizing; in v9 the menu-specific divider is its own component and the generic Divider is used for non-menu layout. When migrating, remove any item-level divider props or flags, replace them with a standalone MenuDivider element in the correct position, and re-verify keyboard traversal because the counting and focus order of items changes when a divider is no longer an item.

## Edge Cases

- MenuDivider is not focusable and is skipped by arrow-key navigation, so it must never be the only element between two items if you expect a visible focus stop there — focus moves straight from the item above to the item below.
- The divider's default inline inset is tuned to align with the menu item icon and checkmark gutter. If the Menu is configured without icons or checkmarks, or if you change MenuItem padding, the rule will look offset until you adjust the inset on the root slot.
- A MenuDivider placed as the first or last child of a menu list produces a rule flush against the popover edge, which looks like a border rather than a group boundary; keep dividers strictly between groups.
- Because the divider contributes no text, a menu whose only structural cue is a rule is ambiguous to screen reader users who hear consecutive items; pair it with MenuGroup and MenuGroupHeader when grouping carries meaning.
- If a group between two dividers becomes empty at runtime — for example because items are conditionally rendered — you end up with two adjacent rules; compute group membership before rendering so dividers are only emitted when both sides have content.
- MenuDivider works inside a menu list whether the menu is rendered in a popover or inline, and whether it was opened by click, keyboard, or context menu; do not add dividers conditionally based on how the menu was opened.
- Passing item-level props such as selection values, submenu flags, or disabled state to MenuDivider is silently ineffective, so always verify separators by inspecting the rendered menu rather than by trusting the props you supplied.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
