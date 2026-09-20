# buttons components

## Overview

The buttons category covers the five controls used to trigger an action: Button (the default single-action control), CompoundButton (an action carrying a short explanatory second line), ToggleButton (an action holding a persistent on/off state), MenuButton (a trigger that reveals a menu of commands), and SplitButton (a dominant action paired with a menu of related alternatives). They are deliberately aligned: each accepts appearance, size, shape, iconPosition, disabled, and disabledFocusable, so any button can be swapped for another in the same surface without breaking visual rhythm or density. Choosing correctly is mostly a question of intent — does the click change state, open a menu, toggle a setting, or stand in for a link — and of emphasis, which is expressed through appearance rather than through color or custom styling.

## When to Use

Reach for Button whenever a single, immediate action is the whole story, and pick its appearance to express hierarchy: primary for the one most important action on a surface, secondary as the everyday default, and outline, subtle, or transparent as emphasis drops for dense regions such as toolbars, card headers, and dialogs. Move to CompoundButton when the action label alone is ambiguous and a short supporting sentence will help the user commit — keep the verb in the primary content and the explanation in the secondary content. Use ToggleButton for a persistent on/off state that belongs to the application rather than a form (filters, pins, mute), and use MenuButton when the click should not perform an action at all but open a set of commands, since the menu itself holds the real MenuItems. Choose SplitButton only when one action is used most of the time and a small set of closely related alternatives exists; the primary action region runs the default and the menu region shows the rest. Because all five share size, shape, and iconPosition, you can change the control type as requirements evolve without re-tuning the layout, and when buttons live inside a persistent command bar, use the Toolbar family (Toolbar, ToolbarButton, ToolbarToggleButton, ToolbarRadioButton) so they inherit shared size, vertical orientation, and group-level checked values.

## Best Practices

### Do's

- Choose appearance by hierarchy rather than taste: primary for the single most important action on the surface, secondary as the default, and outline, subtle, or transparent as the button recedes into toolbars, card actions, and dialog footers.
- Keep appearance, size, shape, and iconPosition consistent for every button in the same surface so a row of actions reads as a set; swapping a plain Button for a ToggleButton, MenuButton, or SplitButton keeps that parity because the props are shared.
- Use disabledFocusable instead of disabled when the user must still be able to reach the control with the keyboard to discover it; reserve disabled for cases where the control should be fully out of the interaction flow.
- Reach for CompoundButton when a short second line of explanation materially improves the decision, putting the action verb in the primary content and the supporting sentence in the secondary content.
- Use ToggleButton, with checked or defaultChecked, for a durable on/off state outside a form, and set isAccessible when the state should be announced as a toggle rather than a plain button.
- Use MenuButton when the trigger should reveal choices instead of acting, and put the real commands in MenuItem, MenuItemCheckbox, MenuItemRadio, and MenuItemLink so keyboard and dismissal behavior come from the menu system.
- Use SplitButton when one action dominates and a few related alternatives exist, letting the primary action region run the default and the menu region expose the alternatives with its own clearly separated label.
- Give icon-only buttons, especially circular and square shapes, an accessible name and a Tooltip, because the icon slot contributes no text to the button's name.
- Place grouped buttons inside Toolbar with ToolbarButton, ToolbarToggleButton, and ToolbarRadioButton so checked values and grouping are managed for you instead of by hand.

### Don'ts

- Don't place more than one primary button on the same surface; competing primary emphasis makes the most likely action impossible to find.
- Don't use a Button to navigate to a URL; use Link for navigation, MenuItemLink for link items inside a menu, and the navigation components for structural navigation, and keep buttons for actions that change application state.
- Don't use ToggleButton to capture form data or to represent a set of mutually exclusive choices; its checked state is not submitted like a form control, and independent toggles will not coordinate with each other.
- Don't disable a button as the only explanation for why an action is unavailable; users cannot focus a disabled button to learn why, so surface the reason in adjacent text, a Field validationState of error, or a MessageBar.
- Don't cram long sentences or interactive content into a button label, and don't place links or other controls inside CompoundButton's secondary content; keep labels to a visible verb and short object.
- Don't hand-roll icon buttons by passing raw glyphs through the icon slot without sizing through the component, and don't rely on iconPosition or shape alone to communicate meaning.
- Don't add your own tab stops or roving focus to a row of buttons; use Toolbar and its button variants so arrow-key navigation and grouping stay correct.
- Don't wrap a plain Button in an extra clickable container to fake a split or menu affordance; use SplitButton or MenuButton, which already expose the two regions and the menu semantics.

## Anti-Patterns

### Multiple primary buttons competing on one surface

❌ Primary exists to mark the single most important action. When a dialog, form, or card shows several primary buttons, users can no longer tell which action is the expected one and scan time increases sharply.

✅ Give each surface exactly one primary button and demote the rest to secondary, outline, subtle, or transparent according to their weight. If one action dominates but related alternatives exist, express that with SplitButton instead of adding a second primary.

### Using a button for navigation

❌ A button for a URL breaks expected browser behavior such as opening in a new tab, copying the link address, and correct semantics for assistive technology, and it makes the action region indistinguishable from state-changing commands.

✅ Use Link for URL navigation, MenuItemLink for link entries inside menus, and the navigation components for structural navigation. Keep Button, CompoundButton, ToggleButton, MenuButton, and SplitButton for actions that change application state.

### Forcing selection semantics into ToggleButton

❌ ToggleButton holds a checked state but is not a form control and does not coordinate with other toggles. Building a group of them for mutually exclusive or multi-select choices produces states that never submit, never announce as a set, and drift out of sync.

✅ Use Checkbox or Switch when the value belongs to a form, RadioGroup for mutually exclusive choices, and Toolbar with ToolbarToggleButton or ToolbarRadioButton and its checked value handling when the choices are grouped commands in a bar.

### Disabled buttons as the only explanation for unavailability

❌ A disabled button is removed from the tab order, so keyboard and screen reader users cannot focus it, cannot reach its Tooltip, and cannot learn why the action is unavailable. Focus can also be lost when a control becomes disabled while it was focused.

✅ Prefer disabledFocusable when the control should stay discoverable, and pair it with a visible reason such as Field with validationState set to error, a hint, or a MessageBar. Keep the action enabled and validate on activation when the reason needs to be explained in context.

### SplitButton or MenuButton where a single action would do

❌ A split button with one real option, or a menu button that opens a menu containing a single command, adds a click, implies alternatives that do not exist, and teaches users that carets are meaningless.

✅ Use a plain Button when there is exactly one action. Use MenuButton when every choice lives in the menu, and reserve SplitButton for cases with a genuinely dominant default action plus several related alternatives. Keep appearance, size, and shape identical across the swap so the layout does not shift.

## Accessibility

Every component in this category renders a focusable button, so each one needs an accessible name: use visible label text wherever possible and an aria-label only for icon-only buttons in rounded, circular, or square shapes, since icons and slots contribute no name on their own. Keyboard behavior is expected to match the native button: Enter and Space activate, and MenuButton and SplitButton open their menu with the standard menu keys while the menu itself owns arrow-key traversal and dismissal. SplitButton exposes two separate focusable regions, so give the primary action and the menu trigger distinct names that say what each does rather than relying on the caret alone. ToggleButton carries state, so it must expose checked rather than only a color change; never encode on/off or destructive intent in color alone, and pair state with a stable label so the announcement does not contradict the visible text. Use disabledFocusable when a control must remain discoverable by keyboard users and screen readers, because disabled buttons are removed from the tab order and their Tooltip or explanation can never be reached. Provide Tooltip with an appropriate relationship value when a label is visually hidden, and mirror that text into the accessible name so the description and the name agree. Focus management, grouping, and roving tabindex inside command bars belong to Toolbar and its button variants; do not add tabIndex or key handlers on top of them.

## Components in this category

- [Button](../components/button.md)
- [CompoundButton](../components/compound-button.md)
- [MenuButton](../components/menu-button.md)
- [SplitButton](../components/split-button.md)
- [ToggleButton](../components/toggle-button.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
