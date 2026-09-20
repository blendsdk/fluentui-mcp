# Option

> **Package**: `@fluentui/react-combobox` v9.17.2
> **Import**: `import { Option } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Option represents a single selectable choice inside a listbox-based control. It renders a root element with role="option" plus a checkIcon slot that is displayed for the currently selected option. The component is intentionally thin: it owns only the option-level state that makes sense for one row of a list — whether the choice is disabled and what value identifies it — while selection, focus, and open/close behavior are controlled by the owning control such as Listbox, Combobox, Dropdown, or the option list of a TagPicker. Because value falls back to the option's text when it is not supplied, an Option can be authored with nothing more than a label, yet it also accepts an explicit string value so that localized or dynamic labels do not affect the data layer. The checkIcon slot is always part of the render, and its visibility tracks selection, so theming and slot overrides must keep it intact to preserve the selected-state affordance.

**When to use**: Use Option whenever you need a selectable choice inside a listbox-driven experience: the popup list of a Combobox or Dropdown, a standalone Listbox, an OptionGroup inside one of those, or the suggestion list of a TagPicker. Reach for Option when the user must pick from a defined set of values that is rendered as a list and navigated with the arrow keys. Do not use it as a general-purpose row: if the content is static, use ListItem; if it triggers navigation, use Link, NavItem, or a MenuItem variant; if it opens a menu, use MenuItem. The distinguishing signal is that Option participates in a single selected value (or set of values) governed by a parent listbox, so its semantics, keyboard model, and selected-state rendering only make sense in that context.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean \| undefined` | — | No | Sets an option to the `disabled` state. Disabled options cannot be selected, but are still keyboard navigable |
| `value` | `string \| undefined` | — | No | Defines a unique identifier for the option. Use this to control selectedOptions, or to get the option value in the onOptionSelect callback. Defaults to `text` if not provided. |

### Prop Guidance

- **disabled**: Marks the choice as present but not selectable. Disabled options are still reachable with the arrow keys and are announced as disabled, so use this for temporarily unavailable values rather than removing them from the list, and give the user a visible explanation of why the value cannot be chosen. `disabled`
- **value**: A unique string identifier for the option, used to read and write selectedOptions and to identify the choice in the onOptionSelect callback. Set it explicitly whenever the label is localized, generated, or could duplicate another option; if omitted, the option's text is used, which is convenient for simple static lists but fragile for anything dynamic. `value="ca-central-1"`
- **root (slot)**: The option container, which carries role="option" and receives the hover, pressed, selected, and disabled visual states. Apply custom classes here to control row sizing, spacing, and background, and never change the role, because the parent listbox depends on it. `root`
- **checkIcon (slot)**: The selection indicator rendered for selected options. Keep it in the render tree whenever you customize slots or styles, and theme it through tokens so it stays legible in every theme; replacing it is fine, deleting it removes the only visual confirmation of the current selection. `checkIcon`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `checkIcon` | — | Yes | The check icon that is visible for selected options |
| `root` | — | Yes | The root option slot, with role="option" |

## Best Practices

### Do's

- Render Option only inside a component that provides the listbox role — Listbox, Combobox, Dropdown, or a TagPicker option list — so the role="option" element has a valid ARIA parent.
- Always set an explicit, unique value when the visible label is localized, templated, or user-generated, so selectedOptions and the onOptionSelect callback stay stable across locales and data changes.
- Use disabled for choices that exist in the set but cannot currently be picked, and explain why elsewhere in the UI (for example, a hint or an InfoLabel next to the field).
- Keep option labels short and text-first, since the label drives typeahead matching and is the fallback identity when value is omitted.
- Preserve the checkIcon slot when customizing slots or styles, because it is the only built-in indicator that an option is currently selected.
- Curate or filter the option list so users can scan it quickly; combine with an input in a Combobox when the set of values is long.
- Group logically related options with OptionGroup inside the owning control rather than inventing visual separators out of Option rows.

### Don'ts

- Don't drop Option into a plain content list, a navigation rail, or a menu — the role="option" semantics will be announced without a listbox and will confuse screen reader users.
- Don't nest focusable content such as buttons, links, or inputs inside an Option, since the parent listbox owns focus and the nested target breaks the arrow-key model.
- Don't omit value when two options can legitimately share the same label text; the text fallback will make them indistinguishable in selectedOptions.
- Don't hand-style an option to look selected (brand background, check mark glyph) unless the parent control actually reports it as selected — the visual state must match the accessibility state.
- Don't overload a single option with multi-line descriptions or rich layouts; keep the row scannable and move secondary detail to a tooltip or a detail panel.
- Don't rely on disabled alone to communicate required fields or validation errors; disabled options are still reachable by keyboard and read out, so they need explanatory context.
- Don't remove or hide the checkIcon slot globally in a way that makes the selected option visually indistinguishable from the rest.

## Anti-Patterns

### Option used as a generic list row

❌ Rendering Option outside a listbox — in a content list, a sidebar, or a menu — produces an element announced as a selectable option with no listbox, no selected state, and no arrow-key navigation, which confuses screen reader users and breaks the interaction contract.

✅ Use ListItem for static content, MenuItem for actions and menu-style commands, and Link or NavItem for navigation. Reserve Option for lists where a parent control manages a selected value.

### Missing or duplicated values

❌ Since value defaults to the option's text, two options whose labels match — a common case with localized strings or generated names — become indistinguishable to selectedOptions and the onOptionSelect callback, so the wrong row can appear selected.

✅ Assign an explicit, unique value to every option, typically a stable identifier or code rather than display text, and keep the human-readable label as the option content.

### Interactive controls embedded in an option

❌ Buttons, links, or inputs nested inside an Option compete with the listbox's virtual focus and active-descendant model, so arrow keys and screen readers land on elements that are not part of the announced option set.

✅ Keep the option body to text and non-interactive decoration, and move actions to a separate surface — a toolbar adjacent to the list, a detail panel, or a dedicated component designed for interactive content.

### Simulated selected state

❌ Styling a row with a brand background or a fake check mark without the parent reporting it as selected creates a mismatch between what sighted users see and what assistive technology announces, which is a 4.1.2 violation.

✅ Drive visual selection exclusively from the parent's selection state, keeping the checkIcon slot rendered, and only use tokens to restyle how selected, hover, and disabled states look.

### Using disabled as a substitute for validation messaging

❌ Greying out an option with the disabled prop communicates nothing about why the value is unavailable, and because disabled options remain keyboard navigable users still stop on them repeatedly with no explanation.

✅ Pair disabled options with context such as a hint, InfoLabel tooltip, or inline message that states the reason, and consider omitting values that can never be selected instead of listing them as disabled.

## Accessibility

**Requirements**: Option must always sit inside an element with the listbox role, because its root exposes role="option"; an orphaned option violates WCAG 2.1 success criterion 4.1.2 (Name, Role, Value). Every option needs an accessible name, which normally comes from its text content, and the parent must expose the selected state (selected/not selected) and the disabled state programmatically — the disabled prop supplies that state, so do not simulate it with styling alone. The listbox keyboard interaction requirements of 2.1.1 (Keyboard) apply: the whole set must be reachable and selectable without a mouse, including options that are disabled, which remain keyboard navigable per the component contract. Selected and hovered states must meet 1.4.3 / 1.4.11 contrast minimums against the option background, and the active option must show a visible focus indicator (2.4.7). Do not use color alone to distinguish the selected option from the others if the check icon is hidden by custom styling.

| Key | Action |
| --- | --- |
| `ArrowDown` | Moves focus/active-descendant to the next option in the list, including disabled options, which stay navigable but cannot be chosen. |
| `ArrowUp` | Moves focus/active-descendant to the previous option in the list. |
| `Home` | Moves to the first option in the list. |
| `End` | Moves to the last option in the list. |
| `Enter` | Selects the currently active option (no effect when that option is disabled) and typically commits or closes the owning control. |
| `Space` | Selects the currently active option in the listbox interaction model; ignored for disabled options. |
| `Escape` | Closes the popup of a Combobox or Dropdown without changing the current selection. |
| `Tab` | Moves focus out of the option list to the next focusable element, leaving the list without a change in selection. |
| `Printable character keys` | Type-ahead: the owning control moves the active option to the next option whose label starts with the typed character, so keep labels text-first. |

**ARIA**: role="option" (set on the root slot), aria-selected (reflects selection state managed by the owning listbox), aria-disabled (reflects the disabled prop; the option remains keyboard navigable), aria-activedescendant on the owning input or listbox, pointing at the element id of the active option, aria-labelledby / aria-label on the owning listbox to describe the set of options

**Screen Reader**: A screen reader announces an Option as an option within a listbox, reading its label followed by its position in the set (for example, "3 of 12"), its selected state when it is the active choice, and its disabled state when the disabled prop is set. Because focus in a listbox is virtual — the container keeps DOM focus and points at the active option with aria-activedescendant — the announcement updates as the user arrows through options rather than as DOM focus moves. Selecting an option updates the announced selected state of the previously and newly chosen options, and in a multi-select list the reader reports each option's individual selected state.

## Styling

Style Option through its slots — override the root slot for the row background/typography and the checkIcon slot for the selection indicator — rather than wrapping it in extra elements that would sit between the listbox and the option element. Griffel tokens map cleanly onto the four interactive states: use tokens.colorNeutralBackground1Hover for hover, tokens.colorNeutralBackground1Pressed for the pressed/active row, tokens.colorNeutralBackground1Selected (or tokens.colorBrandBackground2) for the selected row, and tokens.colorNeutralForegroundDisabled for disabled labels. Text should default to tokens.colorNeutralForeground1 with tokens.colorNeutralForeground1Hover on hover, and the check icon reads best at tokens.colorBrandForeground1 or by inheriting currentColor so it follows the row's state. Keep the row height predictable with tokens.spacingVerticalS and tokens.spacingHorizontalS padding, use tokens.borderRadiusMedium on the root to match the surrounding popup, and rely on tokens.colorStrokeFocus2 for the focus outline so it stays visible in both light and dark themes. Ensure any custom selected styling still passes contrast against the row background, and verify that your overrides survive high-contrast mode where system colors replace the theme palette.

## Performance

Each Option is a real mounted element with a root and a check icon, so the cost of a picker scales linearly with the number of options; keep the option subtree minimal and avoid heavy custom content, extra wrappers, or per-render style recomputation inside large lists. Define styles once at module scope rather than building them inside the render path, and keep the option set stable so option elements are not remounted on every keystroke when the list is filtered. Prefer filtering or narrowing the data that feeds the listbox over rendering hundreds of rows, and memoize any expensive label formatting so it is not repeated for every option on each render. Because selection and focus state live in the parent, an option re-renders when its own selected or disabled state changes, so keep row content cheap to diff.

## Theming & Tokens

Option consumes the FluentProvider theme rather than defining its own colors. Hover and pressed backgrounds come from tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed, selected rows typically use tokens.colorNeutralBackground1Selected or tokens.colorBrandBackground2, and resting text uses tokens.colorNeutralForeground1 with tokens.colorNeutralForeground1Hover on hover. Unavailable choices should use tokens.colorNeutralForegroundDisabled so they read as inactive but keep enough contrast to remain legible, and the checkIcon slot is best themed with tokens.colorBrandForeground1 or currentColor so it tracks the row state automatically. Shape and rhythm follow the theme through tokens.borderRadiusMedium, tokens.spacingVerticalS, and tokens.spacingHorizontalS, while focus visibility relies on tokens.colorStrokeFocus2. Because everything is token-driven, options automatically adapt to light, dark, and high-contrast themes, but any hard-coded color in a slot override will not — use tokens for every state you customize.

## Migration Notes

In v9 the option is a standalone, reusable component rather than being welded to one specific picker, so the same Option works inside Listbox, Combobox, Dropdown, and TagPicker lists. Selection is no longer owned by the option: it is driven entirely by the parent through the controlled selection state and the onOptionSelect callback, which means the option-level API surface is small and limited to value, disabled, and the root and checkIcon slots. When porting code that relied on a picker-specific option wrapper, remove any option-level logic that tracked selection, and move that state to the owning control; also confirm that every ported option has a unique value, since the text fallback can now collide when two options share a label.

## Edge Cases

- value is typed as a string only, so numeric identifiers, booleans, or object references must be serialized to strings if you need them to round-trip through selectedOptions and the onOptionSelect callback.
- When value is omitted, the option's text becomes its identity; two options that render the same text — even temporarily, such as both showing "Loading" — collapse into the same identity and select together.
- Disabled options remain keyboard navigable and are announced, so a list dominated by disabled entries forces users to arrow through rows they cannot choose; consider removing values that will never be selectable.
- Option produces role="option" on its root, so it must never be rendered outside a listbox-role container; an orphaned option cannot be selected and will be announced without context.
- The checkIcon slot is required by the component contract, so a slot override that stops rendering it removes the visual confirmation of selection and can leave the selected row looking identical to its neighbors.
- Options that hide or change their label dynamically (for example, after a locale switch) will shift type-ahead behavior and, if value was omitted, silently change the stored selection identity.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
