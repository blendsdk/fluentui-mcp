# TagPickerInput

> **Package**: `@fluentui/react-tag-picker` v9.8.8
> **Import**: `import { TagPickerInput } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

TagPickerInput is the free-form text entry element of the TagPicker composition. It renders the textbox into which a user types the query that will be turned into a tag, and it is designed to live inside TagPickerControl (usually alongside TagPickerGroup and TagPickerButton) rather than to be used standalone. Because TagPickerInput renders a native text input with essentially no visual chrome of its own, the surrounding TagPickerControl supplies the border, background, and focus styling while the input itself contributes only the editable region. Its API surface in this release is intentionally minimal: a value for the current query text and a disabled flag, with all remaining behavior (keyboard interaction, focus management, option filtering) driven by the parent TagPicker and its list of TagPickerOption children.

**When to use**: Use TagPickerInput whenever you need users to type new values into a TagPicker — for example a recipient picker in a message composer, a tag editor on a document, or a filter builder where users can add their own values in addition to selecting from a predefined set. It is the correct element for the typing half of the interaction; TagPickerButton covers the case where the user only browses and picks from existing options with no typing. If you need plain text entry without the notion of committed tags, use Input or Textarea instead. TagPickerInput is not a replacement for a labeled form field: pair it with Field and Label (or an accessible name) when the tag list needs a visible, programmatic label.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean \| undefined` | — | No | — |
| `value` | `string \| undefined` | — | No | — |

### Prop Guidance

- **value**: Holds the in-progress query text typed by the user. Treat it as controlled state owned by the TagPicker: update it as the user types, and clear it the moment a tag is committed so the next query starts fresh. It is not the list of selected tags — those are rendered as committed tags inside TagPickerGroup — so never derive the picker's selection from this value. `meeting`
- **disabled**: Disables the text entry so the user cannot type a query. Set it together with the disabled state of the other TagPicker parts (TagPickerButton, TagPickerList) so the whole picker reads as one inert control; a disabled input inside an otherwise active control container is confusing. Remember that a disabled input is not focusable, so it cannot be explained to keyboard or screen reader users — use it for true unavailability, not for validation. `true`
- **root**: The single required slot, which resolves to the underlying input element. You rarely target it directly, but it is the node that receives the component's className and any native input attributes you forward, so it is where aria-label, aria-describedby, and autocomplete-style hints belong. Style the surrounding TagPickerControl rather than the root when you need borders or background. `input`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Always render TagPickerInput inside TagPickerControl so it inherits the container's border, background, and focus indicator, and place TagPickerGroup before it so committed tags appear to the left of the caret.
- Keep the input's value controlled by the TagPicker state and clear it immediately after a tag is committed, so the user starts the next query from an empty field.
- Give the input an accessible name with an aria-label or by associating it with a Label/Field, since the tag list itself does not describe what the user is typing.
- Validate typed input before converting it into a tag — trim whitespace, reject empties, and de-duplicate against tags already present in TagPickerGroup.
- Pair the input with TagPickerList and TagPickerOption so keyboard users can arrow through suggestions while typing, and make it clear that Enter commits the highlighted option or raw text.
- Reserve room for the input inside the control (a sensible min-width) so a long row of tags does not squeeze the caret out of reach.
- Use the disabled prop only for the whole-picker disabled case, and keep the state consistent with the rest of the TagPicker so the control does not look half-interactive.

### Don'ts

- Don't render TagPickerInput by itself outside TagPickerControl — it has no border or background of its own and will look like an unstyled native input next to other Fluent controls.
- Don't maintain a second, independent copy of the query text in your own state alongside the picker's state; duplicated sources of truth cause the field to show stale text after a tag is added.
- Don't rely on the input's value to represent the selected tags — the value is the in-progress query, while the actual selections live as tags inside TagPickerGroup.
- Don't intercept every keystroke to force a selection; users must be able to type freely, including spaces and characters that are not yet valid options.
- Don't use disabled as a substitute for validation feedback — a disabled field cannot be focused or explained, so users cannot discover why they cannot type.
- Don't let Enter submit an enclosing form while the picker's option list is open, or the user will lose their query and submit an incomplete payload.
- Don't assume Backspace always deletes a tag; it only removes the previous tag when the query text is empty, so code that clears state on every Backspace will desynchronize the input.

## Anti-Patterns

### Standalone input without the TagPicker shell

❌ TagPickerInput renders with no border, background, or focus indicator of its own, so placing it directly on the page produces a visually broken field that does not match adjacent Fluent controls and loses the tag context entirely.

✅ Always nest it inside TagPickerControl, with TagPickerGroup holding the committed tags and TagPickerButton opening the suggestion list, so the container supplies the Fluent chrome and the input supplies only the editable region.

### Mirroring the query text in external state

❌ Keeping a separate copy of the typed query in your own component state while the picker also tracks it leads to stale text after a tag is committed, duplicated re-renders on every keystroke, and bugs where the field shows a value the picker has already consumed.

✅ Let the picker own the query through the value prop, update it on change, and reset it to empty as part of committing a tag so there is exactly one source of truth.

### Treating value as the selected tags

❌ Reading the selected tags out of the input's value works only until the user clears the field or removes a tag with Backspace, at which point the form data silently diverges from what is on screen.

✅ Track selections as explicit state that drives the TagPickerGroup children, and use the input's value purely as transient query text for filtering and tag creation.

### Suppressing keyboard tag removal

❌ Intercepting Backspace or preventing the empty-input case breaks the expected picker interaction, where pressing Backspace with no text removes the previous tag; users then cannot correct their selections without reaching for the mouse.

✅ Allow the standard empty-value Backspace behavior and, if some tags must not be removable, mark those tags as non-dismissible in your own rendering rather than blocking the key globally.

### Using disabled for validation

❌ Disabling the input to signal that the current entry is invalid removes it from the tab order and hides the reason from assistive technology, so users cannot focus it, fix it, or find out what went wrong.

✅ Keep the input enabled, expose the error through the surrounding Field's validation message and an aria-invalid / aria-describedby pairing, and only use disabled when the whole picker is genuinely unavailable.

## Accessibility

**Requirements**: TagPickerInput must satisfy WCAG 2.1: it needs a programmatic accessible name (SC 4.1.2 and 1.3.1) via aria-label, aria-labelledby, or an associated Label/Field, because an empty-looking textbox inside a tag strip conveys no purpose on its own. All typing, option navigation, tag creation, and tag removal must be reachable without a pointer (SC 2.1.1), and the focus indicator supplied by TagPickerControl must remain visible — do not style the focus underline away (SC 2.4.7). Any placeholder or hint text must meet contrast minimums against tokens.colorNeutralBackground1 (SC 1.4.3). When the input is disabled, the disabled state must be conveyed programmatically and the control must remain readable (SC 4.1.2). If input validation is used, the error must be identified in text and announced, not signalled by color alone (SC 3.3.1).

| Key | Action |
| --- | --- |
| `Printable characters` | Types the query text and, when a suggestion list is open, filters the available TagPickerOption entries. |
| `Enter` | Commits the highlighted option, or the raw typed text, into a new tag and should clear the input for the next entry. |
| `Backspace` | Deletes a character while text is present; when the input value is empty, it removes the previously committed tag from TagPickerGroup. |
| `Delete` | Deletes the character after the caret; with an empty value it may remove the tag following the caret in the tag strip. |
| `ArrowDown` | Moves focus into the suggestion list and advances the highlighted TagPickerOption. |
| `ArrowUp` | Returns focus to the input and moves the highlight back through the suggestion list. |
| `Escape` | Dismisses the open suggestion list without committing a tag, leaving the typed query in the input. |
| `Tab` | Moves focus out of the picker to the next focusable element, typically TagPickerButton; focus does not stay trapped in the input. |
| `Shift+Tab` | Moves focus backwards to the previous control in the form or to the preceding tag. |
| `Space` | Inserts a literal space in the query text rather than toggling a selection, so multi-word tags remain typeable; Enter is the commit key. |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-disabled, aria-invalid, aria-expanded, aria-controls, aria-activedescendant, aria-autocomplete, role

**Screen Reader**: TagPickerInput is exposed as a text input (a textbox, and in the combobox pattern a combobox bound to the popup through aria-controls and aria-activedescendant). Screen readers announce its accessible name, the current value of the query, and the disabled state when the disabled prop is set. Because the typed text is an in-progress query rather than a value, changes should not be announced as form data; announcements of what has actually been selected come from the tags rendered in TagPickerGroup, and option highlights inside TagPickerList are announced through the active-descendant relationship. Tag removals performed with Backspace on an empty input should be perceived as a change in the surrounding tag group, so keep the group's labeling accurate so the removal is understandable.

## Styling

TagPickerInput is deliberately bare: it renders an unstyled text field whose appearance comes from the surrounding TagPickerControl, so most visual customization should be applied to the control or through its className rather than fought inside the input. For the input itself, the useful adjustments are sizing and text treatment: set a min-width (for example using tokens.spacingHorizontalXXXL as a floor) so the caret stays reachable after many tags, and use tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300 to match Fluent typography. Text color should follow tokens.colorNeutralForeground1, with placeholder text at tokens.colorNeutralForeground4 for sufficient contrast against tokens.colorNeutralBackground1. Disabled text should use tokens.colorNeutralForegroundDisabled while the container keeps tokens.colorNeutralStrokeDisabled. If you restyle the border on TagPickerControl, mirror Fluent's interaction states — tokens.colorNeutralStroke1 at rest, tokens.colorNeutralStroke1Hover on hover, tokens.colorNeutralStroke1Pressed while active, and tokens.colorCompoundBrandStroke for the focus underline — and keep tokens.borderRadiusMedium on the control so the input's hit area aligns with the rounded chrome. Avoid removing the focus underline: it is the only visible focus affordance the composition provides.

## Performance

TagPickerInput is a thin native input, so its own render cost is negligible; the cost sits in the suggestion list it drives. If value is controlled, every keystroke re-renders your filtering logic and the rendered TagPickerOption children, so filter a memoized list rather than rebuilding the option array on each render, and keep option rows keyed and stable so React can reconcile them cheaply. For large datasets, slice the filtered results and virtualize or page the list rather than rendering thousands of options inside TagPickerList. Because the input also participates in focus management with the listbox, avoid artificial debounces long enough to make Enter commit a stale highlight; if you debounce filtering, guard the committed value against the pending query.

## Theming & Tokens

TagPickerInput itself inherits typography and foreground color from the Fluent theme through tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.lineHeightBase300, and tokens.colorNeutralForeground1, with disabled text at tokens.colorNeutralForegroundDisabled. Its visible chrome belongs to TagPickerControl, which draws its rest border with tokens.colorNeutralStroke1, hover with tokens.colorNeutralStroke1Hover, active with tokens.colorNeutralStroke1Pressed, disabled with tokens.colorNeutralStrokeDisabled, and the focus underline with tokens.colorCompoundBrandStroke; the disabled fill comes from tokens.colorNeutralBackgroundDisabled and the enabled fill from tokens.colorNeutralBackground1. Bracket the input against the tag strip using tokens.spacingHorizontalXS or tokens.spacingHorizontalS, and round the shell with tokens.borderRadiusMedium. Because all of these are theme tokens, the input automatically adapts to FluentProvider's light, dark, and high-contrast themes, including the forced-colors focus outline — avoid hard-coded hex colors, which would break high-contrast mode.

## Migration Notes

In Fluent UI v9 the picker is a composition rather than a single monolithic control: the text entry is its own TagPickerInput element that must be placed inside TagPickerControl alongside TagPickerGroup, TagPickerButton, and TagPickerList, instead of being a built-in part of a single Picker component as in v8 and earlier Fabric-era pickers. Style and theme values that used to be passed as inline styles or SCSS overrides are now expressed through Griffel classes and tokens, and the control no longer accepts the older onResolveSuggestions-style callback surface — filtering is done by you and rendered as TagPickerOption children.

## Edge Cases

- Backspace on an empty input removes the previous tag rather than editing text, so clearing the input's value from application code and then deleting tags can produce an unexpected removal if the two are not coordinated.
- Pasting text containing separators (commas, semicolons, or newlines) arrives as one query string; it is not automatically split into multiple tags, so split, trim, and de-duplicate the pasted value before committing tags.
- Composition-based input methods (CJK, and IME-assisted Latin input) fire Enter and Backspace during composition; committing a tag on those keystrokes creates partial or duplicated tags unless the composing state is respected.
- Space inserts a literal space rather than committing, which is correct for multi-word tags but surprises users accustomed to button-based comboboxes where Space selects.
- A long list of committed tags wraps inside TagPickerControl and can shrink the input toward zero width, leaving the caret effectively invisible; give the input an explicit min-width so it remains clickable and focusable.
- Rapidly typing and pressing Enter before an asynchronous suggestion fetch resolves can commit the raw query instead of the intended option, so decide explicitly whether free-form text is allowed and guard the commit path.
- When the input's value is emptied programmatically the suggestion list may remain open with a stale filter, so keep list visibility tied to focus and query state rather than to the value alone.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
