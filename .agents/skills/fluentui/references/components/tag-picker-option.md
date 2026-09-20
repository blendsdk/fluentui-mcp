# TagPickerOption

> **Package**: `@fluentui/react-tag-picker` v9.8.8
> **Import**: `import { TagPickerOption } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

TagPickerOption is the selectable choice element of the TagPicker family. It represents a single candidate that a user can add as a tag: it is rendered inside TagPickerList, which is itself placed inside the TagPicker control, and it is matched against typed input so the option list can be filtered as the user types. Each option carries a required, string-typed value that acts as the stable, machine-readable identity of that choice, while the visible label shown to the user is the text rendered inside the option. Because the option participates in the same listbox-style selection model used by Combobox and Listbox options, it can be selected with the mouse, with arrow-key navigation plus Enter, or implicitly when the user commits the currently highlighted option from the picker input. TagPickerOption is a leaf element with no slots or additional exports: it is intentionally minimal so that composition, filtering, and tag creation are driven by the surrounding TagPicker pieces such as TagPickerControl, TagPickerInput, TagPickerButton, TagPickerGroup, and TagPickerList, and so that grouped options can be organized with TagPickerOptionGroup.

**When to use**: Use TagPickerOption whenever you need a filtered, searchable set of predefined choices that the user turns into discrete tags — for example people, labels, categories, or email addresses chosen from a directory. Reach for it when the selection source is bounded and known (a directory, a permission list, a fixed taxonomy), because the option list gives users a discoverable, keyboard-navigable path to every valid value. Do not use TagPickerOption as a general-purpose list row: if you are not building a tag-entry experience, prefer Option inside Combobox, Dropdown, or Listbox, or use List and ListItem for plain content. Likewise, if the user can only pick exactly one value, a Combobox or Dropdown is simpler and avoids the tag metaphor entirely. If users must be able to enter arbitrary, unlisted values, combine the picker's free-form input with TagPickerOption for the known suggestions so both paths remain available.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | Yes | — |

### Prop Guidance

- **value**: Required and string-typed. It is the stable identity of the option, used to determine whether the option is currently selected, to add it as a tag, and to remove it again. Keep it unique within a given picker instance, keep it stable across renders and filtering, and keep it distinct from the human-readable label rendered inside the option. Typical patterns are a directory id, a slug, an email address, or a taxonomy key returned by the data source that populates the option list. Since two options may legitimately share the same visible label (for example two people with the same display name), value is the only reliable way to disambiguate them, so never derive value by trimming or lowercasing the label. `value: "a1b2c3d4" for a person whose visible label is "Alex Wilber"`

## Best Practices

### Do's

- Give every TagPickerOption a unique value string that is stable across renders and unrelated to its display text, so selection survives filtering, re-rendering, and label edits.
- Keep the visible label text short and human-readable, and reserve value for the identity that your application stores in state or submits to a backend.
- Render TagPickerOption only inside the picker's option list container so that highlight, selection, and keyboard navigation are wired to the correct listbox owner.
- Group long option sets with TagPickerOptionGroup and meaningful group headers instead of emitting hundreds of flat options in one scrolling list.
- Pre-filter the option collection in application state before rendering so that the visible list stays small and meaningfully reflects the typed query.
- Use the currently highlighted option as the commit target so that pressing the input's commit key adds exactly the option the user sees highlighted.

### Don'ts

- Do not reuse the same value across two TagPickerOption elements; duplicate values make it impossible to distinguish which choice was added or removed.
- Do not encode metadata, delimiters, or display concerns into value — it is an identifier, not a payload or a label.
- Do not place arbitrary interactive controls (buttons, links, switches) inside the option body; they conflict with row-level selection and confuse keyboard focus.
- Do not keep stale option lists mounted after a tag has been chosen if your design excludes already-selected values; remove or filter those options so users cannot add duplicates.
- Do not rely on value text alone as the user-facing label, since raw identifiers are usually unfriendly to read and to screen reader users.
- Do not swap TagPickerOption in for Option or ListItem in non-picker surfaces; the tag-picker option is bound to the picker's selection contract.

## Anti-Patterns

### Using the label as the value

❌ Setting value to the same string that is displayed means any label edit, localization, or capitalization change silently breaks selection tracking and can produce duplicate-looking selections that cannot be removed reliably.

✅ Keep value as a stable identifier from the data source (id, slug, email) and render the friendly label separately inside the option.

### Duplicate or missing values

❌ Two options with the same value, or options whose value is an empty string, make the selected state ambiguous: the picker cannot tell which row to mark as selected and removal may affect the wrong tag.

✅ Guarantee uniqueness when building the option collection, assert it in development, and never render an option without a non-empty value.

### Interactive controls nested inside the option

❌ Embedding buttons, links, or checkboxes inside the option body creates competing focus targets and click semantics, so pressing Enter or clicking may trigger the inner control instead of adding the tag, and screen readers announce an unclear composite.

✅ Keep the option body to text and lightweight non-interactive decoration. Move secondary actions outside the picker or into a separate surface such as a details popover.

### Treating the option list as a static, unfiltered menu

❌ Rendering the entire domain of possible values regardless of the typed query turns the picker into an unusable long list, which hurts both keyboard navigation effort and rendering cost.

✅ Filter the source collection against the input query before rendering, and use TagPickerOptionGroup to chunk the remaining results into scannable sections.

## Accessibility

**Requirements**: TagPickerOption participates in the tag picker's listbox semantics and therefore inherits the picker's requirement that every option is reachable by keyboard and that the visible label is also the accessible name. Ensure each option's rendered text is descriptive on its own, because assistive technology users hear the option text without the surrounding visual context of the input. Maintain a visible focus indicator on the highlighted option that meets contrast requirements (at least 3:1 against adjacent colors, and 4.5:1 for the option's text). Never disable option rows without a visible and announced reason, since aria-disabled alone does not explain why a choice is unavailable. The listbox must always have exactly one highlighted option while open, and hovering must not create a second highlight that disagrees with keyboard focus.

| Key | Action |
| --- | --- |
| `ArrowDown` | Moves the highlight to the next option in the list and scrolls it into view |
| `ArrowUp` | Moves the highlight to the previous option in the list and scrolls it into view |
| `Home` | Moves the highlight to the first option in the list |
| `End` | Moves the highlight to the last option in the list |
| `Enter` | Selects the highlighted option and adds it as a tag in the picker |
| `Escape` | Dismisses the open option list without selecting the highlighted option |
| `Tab` | Moves focus out of the option list and closes it, leaving the current tag selection intact |
| `Backspace` | When the picker input is empty, removes the previously added tag, returning focus to the input rather than an option |

**ARIA**: role="option" (implicit on each option inside the picker's listbox), aria-selected (reflects whether the option's value is already present as a tag), aria-disabled (marks options that cannot currently be chosen), aria-label or aria-labelledby (provides the accessible name when the option's visible text alone is insufficient), aria-activedescendant (set by the picker input to reference the id of the currently highlighted option), aria-multiselectable (set on the picker's listbox container because a tag picker allows multiple values)

**Screen Reader**: A screen reader announces each TagPickerOption as an option within a multi-select listbox, typically reading its visible label followed by its selected or disabled state. Because focus stays in the picker's text input and the highlighted option is conveyed through aria-activedescendant, moving with the arrow keys produces "option N of M" position announcements and selection announcements without moving DOM focus into the list. When an option is committed, the resulting tag is announced from the picker's tag group, so users hear both the option removal from the list state and the addition of the new tag. Options whose label text is ambiguous when read in isolation should be given an explicit accessible name so that the announcement is unambiguous out of context.

## Styling

TagPickerOption is styled through Griffel classes on the component and can be overridden with the standard className or style props that every Fluent UI React v9 component accepts. Style the option through its state slots by targeting the hover, active, focus-visible, selected, and disabled variants with tokens.colorNeutralBackground2Hover, tokens.colorNeutralBackground2Pressed, tokens.colorNeutralBackground2Selected, and tokens.colorNeutralBackgroundDisabled for the surface, and tokens.colorNeutralForeground1, tokens.colorNeutralForeground2Hover, tokens.colorNeutralForegroundDisabled for the text. Use tokens.colorBrandBackground2Selected and tokens.colorBrandForeground2 for brand-forward selection treatments, tokens.colorStrokeFocus2 for the visible focus outline (usually paired with an outline-offset of tokens.strokeWidthThin), and tokens.colorNeutralStroke1 or tokens.colorNeutralStroke2 for optional dividers between rows. Typography should follow tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.fontWeightRegular (bold the label with tokens.fontWeightSemibold only when it doubles as a group signal), and tokens.lineHeightBase300. Density and rhythm come from tokens.spacingHorizontalM, tokens.spacingHorizontalL, tokens.spacingVerticalS, tokens.spacingVerticalMNudge, and tokens.borderRadiusMedium for the row's rounded highlight, while motion for the highlighted state should use tokens.durationFaster with tokens.curveEasyEase so arrow-key navigation feels responsive rather than animated. Avoid hard-coded hex colors so the option continues to track the active theme, and keep row height predictable so scrolling during keyboard navigation does not jump.

## Performance

Each TagPickerOption is a lightweight row, but the option list is rendered on every keystroke as the user filters, so keep the rendered set small by filtering in application state rather than rendering thousands of rows and hiding them. Avoid recreating option collections with new keys on every keystroke; stable value strings let the list reconcile rows instead of remounting them. Expensive per-option work such as avatar loading or remote image fetches should be deferred or cached, because the rows are re-rendered repeatedly while typing. If the option list is virtualized externally, keep row height constant so the scroll position under the keyboard highlight remains predictable. Because the highlighted option changes rapidly during arrow-key navigation, keep option styling free of costly effects such as large blur shadows so highlight transitions stay smooth.

## Theming & Tokens

TagPickerOption consumes the Fluent UI theme through design tokens and therefore adapts automatically to light, dark, and high-contrast themes applied by FluentProvider. Background and selected states derive from tokens.colorNeutralBackground1, tokens.colorNeutralBackground2Hover, tokens.colorNeutralBackground2Pressed, and tokens.colorNeutralBackground2Selected, with brand-oriented selection expressed through tokens.colorBrandBackground2 and tokens.colorBrandForeground2. Text uses tokens.colorNeutralForeground1 for the primary label and tokens.colorNeutralForeground2 for secondary text, while disabled options fall back to tokens.colorNeutralForegroundDisabled on tokens.colorNeutralBackgroundDisabled. Focus rings use tokens.colorStrokeFocus2, borders and separators use tokens.colorNeutralStroke1, and spacing, radius, and type scale come from tokens.spacingVerticalS, tokens.spacingHorizontalM, tokens.borderRadiusMedium, tokens.fontFamilyBase, and tokens.fontSizeBase300. Overriding these tokens at a provider or component scope is preferred over hard-coded values so that the option keeps correct contrast in high-contrast mode.

## Migration Notes

TagPickerOption is a v9 component that belongs to the composable TagPicker family, in which the picker is assembled from separate TagPicker pieces rather than configured through a single monolithic props object. Teams migrating from v8 picker patterns should note that there is no equivalent single-component picker surface to port: the equivalent behavior is now expressed by placing TagPickerOption elements inside the picker's option list, with the required string value replacing older usage where suggestion identity was inferred from the rendered item. Because value is the only documented prop, any extra per-option behavior that earlier implementations attached to suggestion objects must move into application state keyed by that value string.

## Edge Cases

- Two people or records can share the same visible label; only the value distinguishes them, so the selected state and removal logic must key off value and never off rendered text.
- An option can be selected but still rendered in the list. If your design excludes already-chosen values, filter them out explicitly; otherwise users can attempt to add the same tag twice.
- When the typed query matches nothing, the option list becomes empty and the picker has no highlighted descendant — the input must remain usable and the empty state should be communicated rather than silently showing nothing.
- Options that represent disabled or unavailable choices (for example an out-of-policy approver) need a visible and announced reason; a silently disabled row is indistinguishable from a broken one.
- The option never receives DOM focus itself; focus stays in the picker input and the option is referenced through aria-activedescendant, so custom styling or logic that assumes document.activeElement is the option will not work.
- Very long labels can wrap and change row height, which makes the highlighted row jump during arrow-key navigation and can desynchronize scroll-into-view behavior; truncate or constrain label length.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
