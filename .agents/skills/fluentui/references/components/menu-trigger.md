# MenuTrigger

> **Package**: `@fluentui/react-menu` v9.25.0
> **Import**: `import { MenuTrigger } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

MenuTrigger is a non-visual behavior component that turns a single child element into an accessible menu trigger. It clones its child and injects the ARIA wiring, focus management, and keyboard handling needed to open and close a Menu: unless disabled, the child is enhanced into a compliant ARIA button with role='button', a tab stop, and pointer/keyboard handlers, and it receives aria-haspopup set to 'menu', aria-expanded reflecting the open state, and aria-controls pointing at the menu popover. MenuTrigger itself renders no DOM of its own — it is always used together with Menu (which owns the open state) and MenuPopover/MenuList (which render the surface and items). It appears in three common shapes: a standalone trigger such as MenuButton or Button, a split trigger composed with SplitButton, and a nested submenu trigger where a MenuItem contains a MenuTrigger that opens a second-level Menu. Two props tune its behavior: disableButtonEnhancement opts out of the internal ARIA button injection when the child already provides its own button semantics and keyboard handling, and focusFirst is a callback used for submenu triggers that focuses the first focusable element in the popover when an arrow key is pressed while that submenu trigger is already open.

**When to use**: Use MenuTrigger whenever you need a menu to open from a control: a toolbar or card action, a 'more actions' overflow, a SplitButton's secondary action, an account or settings switch, or a nested submenu inside an existing menu. Prefer it over attaching raw click handlers to a Button because it gives you the ARIA relationship between trigger and menu, focus transfer into the MenuList, and Escape-to-close-with-focus-return without hand-written code. Use MenuTrigger with Menu when the revealed surface is a list of menu items or menuitem-style commands; use PopoverTrigger when the revealed surface is arbitrary free-form content, DialogTrigger for modal tasks, and Tooltip for non-interactive hints. For a trigger that already looks like a menu affordance, MenuButton is the shortest path because it is designed to be the MenuTrigger child; for a split control, keep the primary action on the SplitButton and let the MenuTrigger cover only the chevron/hamburger portion.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disableButtonEnhancement` | `boolean \| undefined` | `false` | No | Disables internal trigger mechanism that ensures a child provided will be a compliant ARIA button. |
| `focusFirst` | `(() => void) \| undefined` | — | No | Optional callback to focus the first focusable element in the menu popover when an arrow key is pressed on an open submenu trigger. If omitted, the keyboard handler is a no-op. |

### Prop Guidance

- **disableButtonEnhancement**: Set this to true only when the child is already a fully compliant button — a native button element that has its own role, tab stop, and keyboard activation — or when you intentionally take over semantics. It disables the internal mechanism that guarantees the child behaves as a compliant ARIA button, so with it enabled no role, tabIndex, or key handling is injected. Leave it at its default of false for MenuButton, ToolbarButton, and any component where you rely on MenuTrigger to provide button semantics. `false`
- **focusFirst**: A callback used by submenu triggers. When the trigger is already inside an open menu and the user presses an arrow key, this callback should focus the first focusable element inside the menu popover. Provide it when composing nested menus so arrow-key navigation moves cleanly from the parent item into the child popover; if it is omitted the keyboard handler is a no-op and focus simply will not transfer, which makes the submenu unusable by keyboard. Keep the function reference stable with useCallback so the cloned trigger is not re-created with a new prop on each render. `focusFirst={() => menuListRef.current?.focus()}`

## Best Practices

### Do's

- Wrap exactly one interactive child — a Button, MenuButton, ToolbarButton, or SplitButton — as the direct child of MenuTrigger so the cloned element can receive focus and the injected ARIA attributes.
- Give icon-only triggers a meaningful accessible name on the child (aria-label) that describes the menu, such as 'More actions' or 'Account settings', because MenuTrigger does not add a label of its own.
- Keep Menu as the parent that owns open and onOpenChange, and drive programmatic opening and closing through Menu rather than by reaching into the trigger.
- Use MenuPopover with MenuList for the revealed surface so items are focusable menuitems and arrow-key navigation inside the menu works as expected.
- Set disableButtonEnhancement only when the child is a genuine native or custom button that already exposes button semantics, a tab stop, and its own Enter/Space/arrow key handling.
- Supply focusFirst when the trigger lives inside an already-open menu (a submenu trigger) so that pressing an arrow key on that open trigger moves focus into the first focusable element of the popover.
- Memoize the focusFirst callback so its identity is stable across renders and the cloned trigger does not receive a new prop on every parent render.
- For submenus, compose MenuItem wrapping MenuTrigger wrapping Menu wrapping MenuPopover so the parent menu item communicates both the nesting and the expandable state.

### Don'ts

- Do not pass more than one element child (or wrap content in fragments expecting both to be triggers) — MenuTrigger enhances a single child, so extra children are simply not part of the trigger.
- Do not set disableButtonEnhancement on a child that is not already focusable and keyboard operable; doing so removes the internal role, tabIndex, and key handlers and leaves the menu unreachable by keyboard.
- Do not wrap plain display content such as Text, Label, or an Image in MenuTrigger and rely on enhancement to make it accessible; use a real button as the child instead.
- Do not use MenuTrigger to open PopoverSurface, DialogSurface, or Tooltip content; each of those surfaces has its own trigger component with the correct ARIA relationship.
- Do not attach your own onClick that assumes the menu is already open at the time it fires, or that tries to toggle state locally; menu state belongs to Menu's open and onOpenChange.
- Do not render MenuTrigger outside of a Menu — without the parent context there is no menu to open and no open state for aria-expanded to reflect.
- Do not rely on hover to reveal menu contents; menus are click- and keyboard-activated and hovering a trigger should not open the menu.
- Do not nest two MenuTriggers directly on top of one another; each level of nesting needs its own Menu (and, for a submenu, a MenuItem) in between.

## Anti-Patterns

### Discovering links with insufficient grounding

❌ Wrapping plain content such as Text, Label, or an Image in MenuTrigger and assuming the internal enhancement makes it an accessible button. The enhancement does add a role and tab stop to an arbitrary child, but the result has no accessible name and no visual affordance, so screen reader and sighted users alike cannot tell that a menu exists there.

✅ Always use an interactive child the user can recognize — Button, MenuButton, ToolbarButton, or SplitButton — and give icon-only variants an aria-label that names the menu they open.

### Opting out of enhancement without replacing it

❌ Setting disableButtonEnhancement to true on the trigger while still passing a non-button child. The internal role, tab stop, and Enter/Space/arrow handling disappear, leaving a trigger that cannot be focused or opened by keyboard, which breaks WCAG keyboard operability and hides the menu entirely from assistive technology.

✅ Keep disableButtonEnhancement at its default false, or only set it to true when the child is a genuine button that already handles focus and keyboard activation itself.

### Multiple or fragmented trigger children

❌ Passing a fragment, an array of children, or an extra decorative element alongside the intended trigger. MenuTrigger enhances a single child element, so anything else is silently ignored, producing a trigger that looks right in some cases and fails to open in others.

✅ Provide exactly one element child as the trigger. If you need an icon plus a label, put both inside that one button child rather than adding siblings to MenuTrigger.

### Triggering the wrong surface

❌ Using MenuTrigger to reveal a PopoverSurface, DialogSurface, or Tooltip, or using PopoverTrigger to reveal a MenuList. The ARIA relationship (aria-haspopup of 'menu' versus 'dialog', the focus model, and the item semantics) no longer matches the content, so screen readers announce the wrong interaction model.

✅ Match the trigger to the surface: MenuTrigger with Menu and MenuPopover for command lists, PopoverTrigger with PopoverSurface for free-form content, DialogTrigger with DialogSurface for modal tasks.

### Managing open state on the trigger

❌ Adding local state or click handlers on the trigger child to toggle the menu, or firing side effects from a click handler that assumes the menu is already open. MenuTrigger defers open state to the Menu context, so duplicated state desynchronizes aria-expanded from what is actually rendered.

✅ Let Menu own the state and control it declaratively with Menu's open and onOpenChange. React to opens and closes there instead of in the trigger's own click handler.

## Accessibility

**Requirements**: The trigger must satisfy WCAG 2.1 criteria for keyboard operability and name/role/value: it has to be reachable in the tab order, expose a button role with an accessible name, and advertise that it opens a menu. When the internal enhancement is active MenuTrigger supplies part of this (role='button', tabIndex, aria-haspopup='menu', aria-expanded, aria-controls), but the accessible name is the consumer's responsibility — icon-only triggers must carry aria-label or aria-labelledby on the child. Opening the menu must move focus into the popover and closing it must return focus to the trigger so focus order stays predictable. If disableButtonEnhancement is set, the consumer takes on all of these obligations, including making the child focusable and providing its own keyboard activation.

| Key | Action |
| --- | --- |
| `Enter` | Activates the enhanced trigger and opens the menu associated with it. |
| `Space` | Activates the enhanced trigger and opens the menu, mirroring native button behavior. |
| `ArrowDown` | Opens the menu and places focus on the first focusable item; when the trigger is a submenu trigger inside an already-open menu, this is where the focusFirst callback is used to focus the first focusable element in the popover. |
| `ArrowUp` | Opens the menu and places focus on the last item in the list. |
| `ArrowRight or ArrowLeft` | In a nested menu composition, moves focus into or out of the submenu opened by the trigger, following the direction of the nesting. |
| `Escape` | Closes the open menu and returns focus to the MenuTrigger so the user does not lose their place. |
| `Tab` | Closes the menu and moves focus to the next or previous focusable element in the surrounding page or toolbar. |
| `Home and End` | Once focus is inside the list, jump to the first or last menu item; the trigger itself only handles the entry keys above. |

**ARIA**: aria-haspopup="menu", aria-expanded, aria-controls, role="button" (injected when disableButtonEnhancement is false), aria-label or aria-labelledby on the child for icon-only triggers, aria-disabled on a disabled trigger child

**Screen Reader**: With enhancement active, a screen reader announces the trigger as a button with its accessible name followed by 'has popup menu, collapsed'. When the menu opens, aria-expanded flips and the reader announces the expanded state and typically reads the number of items in the MenuList as focus moves to the first item. Because aria-controls ties the trigger to the popover, users can jump back to the trigger, and returning focus on Escape or Tab keeps the announcement context coherent. If disableButtonEnhancement is used with a child that lacks its own semantics, assistive technology sees a plain element with no role, no expanded state, and no popup relationship, so the menu may be impossible to discover or open by keyboard.

## Styling

MenuTrigger does not render a wrapper element, so there is nothing to style on the trigger itself — every visual customization happens on the child control or on the MenuPopover surface. Style the child button with Griffel tokens such as tokens.colorNeutralBackground1 for the base, tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed for interaction states, tokens.colorNeutralForeground1 for text, tokens.colorNeutralForeground1Hover when the button is transparent, tokens.borderRadiusMedium for corners, tokens.spacingHorizontalMNudge and tokens.spacingVerticalSNudge for internal padding, and tokens.strokeWidthThin with tokens.colorNeutralStroke1 for outline-style menu buttons. Focus visibility is critical: use tokens.colorStrokeFocus2 for the focus outline and pair it with a tokens.strokeWidthThick border so the ring is visible on both light and dark surfaces. Icon-only triggers should keep a square footprint using tokens.spacingHorizontalM on both axes so the target stays comfortably large. For the revealed surface, style MenuPopover with tokens.colorNeutralBackground1, tokens.shadow16, tokens.borderRadiusMedium, and tokens.spacingVerticalXXS around the MenuList; keep selected or checked MenuItemCheckbox states using tokens.colorNeutralBackground1Selected and tokens.colorBrandForeground1.

## Performance

MenuTrigger is a render-nothing wrapper: it clones the child element and passes extra props rather than emitting an extra DOM node, so there is no additional layout or paint cost. The meaningful cost is re-rendering — because the trigger consumes the Menu context, it re-renders whenever the menu's open state changes, and the cloned child re-renders with it. Keep the child lightweight and avoid creating new inline handler props on every render; in particular, pass a stable, memoized focusFirst callback so the cloned trigger's props do not change identity unnecessarily. In large lists of menu triggers (toolbars, data grids, overflow items), prefer a single shared menu instance driven by an active-item index over mounting a full Menu and MenuTrigger per row, and avoid wrapping heavy subtrees as the trigger child.

## Theming & Tokens

MenuTrigger itself consumes no theme tokens because it renders no DOM; theming is expressed through the child trigger and the popover it opens, all of which read from the surrounding FluentProvider. Inherited tokens such as tokens.colorNeutralForeground1, tokens.colorNeutralBackground1, tokens.colorStrokeFocus2, tokens.borderRadiusMedium, and the tokens.spacingHorizontal* and tokens.spacingVertical* scales flow into a Button or MenuButton child automatically. Branded experiences should use tokens.colorBrandBackground and tokens.colorBrandForeground1 on a primary trigger, and tokens.colorNeutralBackground1Hover with tokens.colorNeutralForeground1Hover for subtle toolbar triggers. High-contrast and dark themes are handled by these token aliases, so avoid hard-coded colors on the child and never override the focus ring — the visible focus indicator should be tokens.colorStrokeFocus2 paired with an adequate stroke width.

## Migration Notes

In Fluent UI React v9 the trigger role moved to a dedicated component: instead of v8's contextual menu and button props that mixed trigger behavior and appearance on one component, MenuTrigger is now a composable wrapper whose only job is to inject trigger behavior into a child you choose. The v9 equivalents of previous customization are the child's own props (appearance, icon, size) plus two trigger props: disableButtonEnhancement replaces the older pattern of opting out of automatic button semantics, and focusFirst covers the submenu case where a trigger inside an open menu needs to move focus into its popover on arrow key press. Because open state is owned by Menu rather than by the trigger, code that previously toggled a menu through trigger-level props should move to Menu's open and onOpenChange.

## Edge Cases

- Only the first valid element child is cloned as the trigger; text nodes, fragments, and additional siblings are ignored, so a fragmented child list can silently produce a non-functional trigger.
- With disableButtonEnhancement enabled, no keyboard handler is injected — if the child is not a real button, the menu cannot be opened by keyboard at all and becomes invisible to assistive technology.
- focusFirst only matters for a trigger that lives inside an already-open menu (a submenu trigger). Outside that scenario, and when the callback is omitted, the arrow-key handler is a no-op and focus will not move into the popover.
- A disabled trigger child cannot open the menu even though it remains in the accessibility tree; ensure the disabled state is intentional and announced through aria-disabled so users understand why nothing happens.
- MenuTrigger has no open or defaultOpen prop of its own — all controlled and uncontrolled open behavior is configured on the enclosing Menu, so attempts to force the menu open from the trigger will not work.
- Because the trigger is a cloned child, props placed on MenuTrigger that belong to the child (appearance, size, icon) are not forwarded; set them directly on the Button, MenuButton, or SplitButton child.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
