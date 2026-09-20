# ToolbarToggleButton

> **Package**: `@fluentui/react-toolbar` v9.8.1
> **Import**: `import { ToolbarToggleButton } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

ToolbarToggleButton is a specialized button for use inside a Toolbar that maintains a pressed/unpressed state rather than firing a one-shot action. It is the button primitive that lets a toolbar behave like a set of formatting or view-mode switches, for example bold/italic toggles in a rich text editor or grid/list view switchers. Unlike a plain ToggleButton, it participates in the Toolbar's selection model: it must declare a name (the group it belongs to) and a value (its identity within that group), and it reports its state through aria-pressed. Selection can be single-select (only one value per name is active, similar to a radio group) or multi-select (multiple values per name can be active simultaneously, similar to a checkbox group) depending on how the parent toolbar is configured. It shares the appearance system of other toolbar buttons with three variants — primary, subtle (the default), and transparent — so it can be styled as a prominent action, a quiet inline control, or a fully chrome-less item.

**When to use**: Use ToolbarToggleButton when a control inside a Toolbar needs to express a persistent on/off state, such as bold, italic, alignment, or a view-mode switch. Use the related ToolbarRadioButton when the choices within a group must be mutually exclusive and the control reads more naturally as a radio (for example, text alignment where one option must always be active), and ToolbarButton when the control performs an immediate action with no retained state (for example, Save or Undo). Outside of a Toolbar, prefer the standalone ToggleButton or a Checkbox/Switch in a form context, because ToolbarToggleButton's name/value contract is designed around toolbar-level selection management.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"primary" \| "subtle" \| "transparent" \| undefined` | `'subtle'` | No | — |
| `name` | `string` | — | Yes | — |
| `value` | `string` | — | Yes | — |

## Best Practices

### Do's

- Always supply both name and value, since these two required props are what the surrounding Toolbar uses to track which toggle buttons are selected.
- Group semantically related toggles under the same name so the toolbar can treat them as one logical selection group.
- Keep the default subtle appearance for dense icon toolbars, and reserve primary for the single most important toggle in the toolbar.
- Give icon-only toggle buttons an accessible name so screen reader users know what the control does.
- Use a multi-select group name for independent formatting attributes (bold, italic, underline) and a distinct single-select group name for mutually exclusive choices (left, center, right alignment).
- Keep each value stable and unique within its name so selection state survives re-renders and reordering of toolbar items.
- Accompany ambiguous icon toggles with a Tooltip so sighted users can discover the meaning of the icon without hovering guesswork.

### Don'ts

- Don't use ToolbarToggleButton for actions that have no persistent state; use ToolbarButton for those to avoid confusing aria-pressed semantics.
- Don't reuse the same value twice inside a single name group, as both controls will appear selected and behavior becomes ambiguous.
- Don't use transparent appearance when the toggle sits on a neutral surface where the hover and pressed states would become hard to perceive.
- Don't omit the name prop even for a lone toggle, because the toolbar's selection tracking depends on it.
- Don't place ToolbarToggleButton outside of a Toolbar and manage its selected state manually; use ToggleButton instead, which does not require the name/value contract.
- Don't rely on color change alone to communicate the pressed state; the selected visual treatment plus aria-pressed must both be present.
- Don't hide the button with conditional rendering to express disabled state, since that removes it from keyboard order and screen reader navigation; use the disabled treatment instead.

## Accessibility

**Requirements**: The component must satisfy WCAG 2.1 AA: 4.1.2 Name, Role, Value requires that the pressed state be programmatically exposed; 2.4.7 Focus Visible requires a visible focus indicator for every toggle; 1.4.11 Non-text Contrast requires the selected and focus treatments to reach at least 3:1 against adjacent colors; 1.3.1 Info and Relationships requires related toggles to be grouped logically within the toolbar; and 2.5.8 Target Size (minimum) requires a large enough hit area, which the toolbar's default button sizing provides. Icon-only toggles must carry an accessible name, and any Tooltip used for discovery must not be the only source of the name.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into or out of the toolbar, landing on the toolbar's single tab stop rather than every individual toggle. |
| `ArrowLeft / ArrowRight` | For a horizontal toolbar, moves focus to the previous or next toolbar item; the Toolbar parent manages this roving focus. |
| `ArrowUp / ArrowDown` | For a vertical toolbar, moves focus to the previous or next toolbar item. |
| `Home` | Moves focus to the first item in the toolbar. |
| `End` | Moves focus to the last item in the toolbar. |
| `Enter` | Toggles the pressed state of the focused ToolbarToggleButton. |
| `Space` | Toggles the pressed state of the focused ToolbarToggleButton. |
| `Escape` | Closes any transient UI opened by a toolbar item, such as a menu or tooltip, without changing selection. |

**ARIA**: aria-pressed, aria-label, aria-labelledby, aria-disabled, aria-describedby

**Screen Reader**: Screen readers announce the toggle as a button with its accessible name followed by the pressed state (for example, 'Bold, toggle button, pressed' or 'Bold, toggle button, not pressed'), because the component renders a native button element with aria-pressed reflecting the current selection. When the user activates the toggle, the state change is announced again so the user knows the selection was applied. In a single-select group, activating one value also updates the state of the sibling toggles in the same name group, and users navigating with arrow keys will hear each sibling's updated state. Because a Toolbar is a single tab stop, users must rely on arrow-key navigation to reach individual toggles, so each toggle's accessible name must be unambiguous when read in sequence.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
