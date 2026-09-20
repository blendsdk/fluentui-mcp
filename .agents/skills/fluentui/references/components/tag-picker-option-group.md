# TagPickerOptionGroup

> **Package**: `@fluentui/react-tag-picker` v9.8.8
> **Import**: `import { TagPickerOptionGroup } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

TagPickerOptionGroup is the compound grouping container used inside a TagPickerList to cluster related TagPickerOption entries under a single shared heading. It gives long, category-rich option sets a visual and semantic structure — for example grouping people by team, tags by department, or values by type — so users can scan the list faster and screen readers can announce which category the currently focused option belongs to. The group participates fully in the TagPicker selection model: options rendered inside it report their selected state, contribute to the picker's selected-value list, and can be collectively removed from selection by setting the group's disabled state. Because it is a structural subcomponent rather than a standalone control, TagPickerOptionGroup renders no interactive element of its own; it exists to wrap, label, and optionally enable or disable the TagPickerOption children it receives.

**When to use**: Use TagPickerOptionGroup when a TagPicker's option list is long enough that users would otherwise have to scan a flat, undifferentiated set of TagPickerOption entries, and when those options naturally fall into named categories. It is the right choice when the grouping itself carries meaning — the category name helps users decide which option to pick, and the ability to disable a whole category (for example, tags the current user is not permitted to apply) is useful. It is also appropriate when you want to keep selection state visually organized, since selected counts and selection feedback are scoped per group through the group's selection-awareness behavior. Do not use it for short lists of three or four homogeneous options, where a plain flat list of TagPickerOption children directly inside TagPickerList is clearer and lighter; do not use it as a general-purpose layout container for arbitrary markup, and do not use it outside of a TagPickerList, because it does not own its own popover, focus management, or keyboard handling.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `[JSXElement, JSXElement \| undefined \| false] \| JSXElement` | — | Yes | — |
| `disableAutoFocus` | `boolean` | — | No | — |
| `disabled` | `boolean` | — | No | — |
| `disabled` | `boolean` | — | No | — |
| `hasSelectedOptions` | `boolean` | — | Yes | — |
| `inline` | `boolean` | — | No | — |
| `noPopover` | `boolean` | — | No | — |
| `onOpenChange` | `EventHandler<TagPickerOnOpenChangeData>` | — | No | — |
| `onOptionSelect` | `EventHandler<TagPickerOnOptionSelectData>` | — | No | — |
| `secondaryAction` | `Slot<'span'>` | — | Yes | — |
| `style` | `TagPickerControlCSSProperties` | — | No | — |
| `value` | `string` | — | No | — |
| `value` | `string` | — | Yes | — |

### Prop Guidance

- **children**: Required. The group's content should be the TagPickerOption elements that share the group's heading; keep the set homogeneous and free of arbitrary markup so the surrounding listbox semantics stay intact. `TagPickerOption entries for the people on a single team`
- **value**: Required in grouped option contexts and used as the stable identity for the option or group entry when selections are reported. Keep values unique across the whole picker, not just within the group, so that selection, filtering, and re-rendering always match the intended option. `engineering-team`
- **disabled**: Set to true to make an entire category non-interactive, for example options the current user cannot apply. Prefer this over disabling each child option so the unavailable state is announced once for the group and arrow-key navigation skips straight past it. `true`
- **hasSelectedOptions**: Indicates whether the group currently contains selected options; use it to drive selected-group styling or messaging instead of recomputing selection state from your own data, which can drift out of sync with the picker. `true`
- **secondaryAction**: A span slot for a secondary element attached to the option row, typically a removal affordance shown next to the option's primary content. Reserve it for actions that operate on a single option, and make sure the span carries an accessible name. `a span wrapping a small remove icon`
- **inline**: Renders the related picker control inline rather than as a block element. Use it when the picker sits inside a toolbar or another horizontal layout; it changes layout only and does not affect how the group's options are grouped or selected. `false`
- **noPopover**: Suppresses the popover so the option list is presented without a floating surface. Use it only when the options are already visible in the surrounding layout, and keep the listbox semantics and keyboard handling intact. `false`
- **disableAutoFocus**: Prevents automatic focus transfer when the picker popover opens. Useful when the surrounding page manages focus deliberately, but leaving it off is preferable so keyboard users land on the first enabled option immediately. `true`
- **onOpenChange**: Callback invoked when the picker popover opens or closes, receiving a data object describing the new open state and the event. Use it for analytics, lazy-loading group data, or syncing external open state; do not use it to mutate selection. `(event, data) => setOpen(data.open)`
- **onOptionSelect**: Callback invoked when an option inside the picker is selected or deselected, receiving the event and a data object with the option value and selection details. This is the correct place to update your selected-value array, including options from any group. `(event, data) => setSelected(data.selectedOptions)`
- **style**: Inline style object typed against the picker control CSS properties. Prefer Griffel classes and tokens for theming, and use this only for one-off, dynamic values that cannot be expressed as a class. `a style object setting a max height for a scrollable group`

## Best Practices

### Do's

- Ensure every TagPickerOption inside a single TagPickerOptionGroup belongs to the same conceptual category, so the group heading accurately describes all of its children.
- Give each group a unique, meaningful heading text; users rely on it to predict what the contained options represent before reading them.
- Use the group-level disabled prop to remove an entire category from selection at once, instead of walking through each child TagPickerOption and disabling it individually.
- Keep only TagPickerOption (or, where supported, nested option groups) as direct children of the group so that the listbox semantics remain predictable for assistive technology.
- Size groups so each one holds a handful of options; many small groups are easier to scan than one enormous group, and empty or single-item groups add noise without adding meaning.
- Stabilize your option data (memoized arrays, stable identifiers) when the option list is rebuilt frequently, so that groups and their options are reconciled rather than remounted.
- Combine grouping with search filtering in the TagPicker so that the visible groups narrow down along with the options, keeping group headings consistent with what is displayed.
- Keep each TagPickerOption's own text or Persona content descriptive even when the surrounding group already provides context, because options can be reached directly by type-ahead and by screen-reader navigation.

### Don'ts

- Don't render TagPickerOptionGroup outside of a TagPickerList — it has no standalone popover, trigger, or focus management and will not behave as an interactive control on its own.
- Don't place non-option content such as arbitrary markup, dividers, or unrelated interactive elements directly inside the group, as this breaks the expected child semantics of the surrounding listbox.
- Don't use the group purely as a visual separator or spacer; if a heading carries no meaning for users, a flat list is the better structure.
- Don't disable a group and still expect its previously selected values to be removable, since users cannot focus or interact with the disabled options to toggle them off.
- Don't duplicate the same group heading multiple times in one list, as repeated identical announcements make it hard for screen-reader users to tell which group they are in.
- Don't rely on grouping to enforce business rules such as maximum selections or mutually exclusive values; enforce those in the selection handler instead.
- Don't nest deeply — avoid layering multiple levels of grouping inside the picker's popover, which makes keyboard traversal long and the announcement hierarchy confusing.
- Don't assume the group's inline or style props restyle the child options; per-option appearance must be handled on the TagPickerOption itself.

## Anti-Patterns

### Rendering groups outside the picker's option list

❌ TagPickerOptionGroup has no trigger, popover, or focus management of its own, so placing it outside a TagPickerList produces options that cannot be opened, navigated, or selected.

✅ Always render TagPickerOptionGroup as a child of the TagPickerList inside the TagPicker popover, and let the picker own open state, focus, and selection.

### Disabling options one by one instead of the group

❌ Individually disabling every child option produces repetitive screen-reader announcements and makes arrow-key navigation stop on each unusable option, which is slow and confusing.

✅ Set the disabled prop on the group so the category is announced once as unavailable and keyboard navigation skips the whole set.

### Using groups as decorative separators

❌ When a group heading carries no real meaning, it adds noise to the accessibility tree and forces users to traverse extra announcements without gaining context.

✅ Only introduce a group when the heading genuinely classifies the options inside it; otherwise render a flat list of TagPickerOption children directly in the TagPickerList.

### Mixing grouped and ungrouped options at the same level

❌ Interleaving loose TagPickerOption children with TagPickerOptionGroup children in one list creates an inconsistent announcement pattern, so users cannot tell whether an option belongs to a category or stands alone.

✅ Choose one structure per list: either a flat list of options or a list whose options all live inside groups, and keep that structure stable while filtering.

### Rebuilding the option tree inline on every render

❌ Creating new group and option children on each render causes remounts, which resets focus in the popover and can interrupt a multi-selection session, especially when filtering as the user types.

✅ Derive groups and options from stable, memoized data with unique values and ids so React reconciles existing nodes instead of recreating them.

## Accessibility

**Requirements**: TagPickerOptionGroup must preserve the listbox accessibility pattern of the containing TagPicker: the popover list exposes a listbox role with option children, and the group must expose a labelled grouping role so that its heading is announced in context. Each group needs an accessible name; a group with an empty or whitespace-only heading is announced only as an unnamed group, which is a WCAG 1.3.1 (Info and Relationships) and 4.1.2 (Name, Role, Value) failure. Disabled groups must convey their unavailable state programmatically, not through color alone, so that users who cannot perceive the muted styling still understand the group cannot be used. Text and icon contrast must meet WCAG 2.1 AA (4.5:1 for body text, 3:1 for large text and meaningful icons/UI borders), and focus indication on the contained options must remain visible (2.4.7) when the group is rendered inside a scrollable popover.

| Key | Action |
| --- | --- |
| `Enter` | Selects or deselects the focused TagPickerOption within the group and keeps the popover open for further selections. |
| `Space` | Toggles the focused TagPickerOption's selection state, matching the Enter behavior for multi-select picking. |
| `ArrowDown` | Moves focus to the next option, crossing from the end of one group into the first enabled option of the following group. |
| `ArrowUp` | Moves focus to the previous option, crossing from the start of a group back to the last enabled option of the preceding group. |
| `Home` | Moves focus to the first enabled option in the list, which may be in the first group or the first group that is not disabled. |
| `End` | Moves focus to the last enabled option in the list, skipping any trailing disabled groups. |
| `Escape` | Closes the TagPicker popover and returns focus to the picker input or trigger so the user can continue editing the selected tags. |
| `Tab` | Moves focus out of the option list and into the next focusable element of the picker popover, such as secondary actions rendered in the tag slots. |
| `Character keys` | Perform type-ahead matching against option text within and across groups, moving focus to the first matching enabled option. |

**ARIA**: role="group" on the grouping container, aria-label (or an equivalent labelling reference) carrying the group's heading text, aria-disabled on the group and/or its options when the group is disabled, aria-selected on each TagPickerOption to expose current selection state, aria-multiselectable on the surrounding listbox when the picker allows multiple selections, aria-activedescendant on the listbox container tracking the currently focused option inside a group, aria-haspopup and aria-expanded on the TagPicker trigger that opens the popover containing the groups

**Screen Reader**: When the option list opens, a screen reader announces the listbox and its multiselect state, then as focus moves into the first option the group heading is announced before the option text, for example the group name followed by the option label and its selected state. Moving between options inside the same group does not repeat the group name, but crossing a group boundary announces the new group heading, which lets users build a mental model of the categories. Disabled groups are announced as unavailable and their options are skipped by arrow-key navigation, so users hear that a category is present but not actionable. Selection changes are reported through the option's selected state, and the picker's own selected tags are announced as they are added or removed from the input area.

## Styling

Style the group with Griffel's makeStyles and merge classes through the style prop, which accepts the picker control CSS properties and is applied after the component's own classes. Typical customizations: increase separation between categories with padding using tokens.spacingVerticalS and tokens.spacingVerticalM, reserve tokens.spacingHorizontalM for inner option padding so option rows align with the picker's selected tags, and render the group heading with tokens.fontSizeBase200, tokens.fontWeightSemibold, and tokens.colorNeutralForeground3 so it reads as a subordinate label rather than as selectable content. For a selected-group treatment, switch the group background to tokens.colorNeutralBackground2 or tokens.colorBrandBackground2 and the heading color to tokens.colorBrandForeground1; for a disabled group, use tokens.colorNeutralForegroundDisabled on the heading and rely on the component's disabled styling for the child options instead of overriding it. Keep rounded corners consistent with the popover with tokens.borderRadiusMedium, and if groups are scrollable inside the popover, add tokens.spacingVerticalXS as bottom padding so the final option is not clipped by the popover edge. Avoid hard-coded pixel values, theme-dependent hex colors, and negative margins that could break alignment with the TagPickerControl surface.

## Performance

Grouping adds an extra DOM node and semantic layer per category without changing how many TagPickerOption nodes exist, so the cost is proportional to the number of groups rather than to a fixed overhead — keep group counts modest and avoid a group per single option. Disabled groups still mount their options in the DOM, so very large disabled categories still cost render time; consider filtering them out of the data entirely when they are never actionable. During type-ahead or search filtering, rebuild the grouped structure from a memoized source rather than mapping over freshly created arrays and objects on every keystroke, and avoid inline object literals for the style prop, since new references defeat memoization on the group and its children. When a group set grows beyond a few dozen options, cap the popover's scroll area and rely on the listbox's own traversal rather than rendering adjacent, unreachable content.

## Theming & Tokens

TagPickerOptionGroup inherits the FluentProvider theme and resolves all of its visual states through design tokens. Disabled groups and their options use tokens.colorNeutralForegroundDisabled for text and icons; the default group heading text typically maps to tokens.colorNeutralForeground3 or tokens.colorNeutralForeground2; selected-group emphasis uses tokens.colorBrandForeground1 and tokens.colorBrandBackground2 while the surrounding popover and option rows use tokens.colorNeutralBackground1 with tokens.colorNeutralStroke1 for borders. Option hover and focus states resolve through tokens.colorNeutralBackground1Hover and the shared focus stroke tokens, which the component keeps consistent with the rest of the picker. Typical spacing comes from tokens.spacingVerticalXS, tokens.spacingVerticalS, tokens.spacingHorizontalM, and corner rounding from tokens.borderRadiusMedium, while text sizing comes from tokens.fontSizeBase200 and tokens.fontSizeBase300 and heading emphasis from tokens.fontWeightSemibold. Overriding these tokens through the provider or a wrapper theme is the supported way to restyle groups across an application; hard-coded colors will not respond to dark, high-contrast, or brand themes.

## Migration Notes

In Fluent UI v8 the tag picker's suggestion list grouped content implicitly through the suggestion header text supplied to the picker's suggestion props, and there was no dedicated grouping subcomponent. In v9 grouping is expressed structurally: option lists are composed from TagPickerList and TagPickerOption children, and TagPickerOptionGroup wraps the options that share a heading so the grouping is present in the accessibility tree rather than only in the rendered text. When migrating, replace any single suggestion-header string with one TagPickerOptionGroup per category, move the per-category options into the corresponding group as children, and route selection through the picker's option-select handler instead of the v8 suggestion callbacks. Because v9 exposes selection callbacks such as onOptionSelect and open-state callbacks such as onOpenChange at the picker level, remove any component-specific selection wiring you had in v8 and let the group's options report selection upward.

## Edge Cases

- A group whose options are all already selected remains focusable and announced; selection feedback must be conveyed by the option's selected state rather than by removing the group from the list.
- Disabling a group that already contains selected tags makes those tags unreachable from the option list, so users cannot deselect them there and may need an alternate removal path in the picker's tag area.
- An empty group, or one whose only option is filtered out by search, can be left rendered with a heading and no visible options; derive groups from the filtered result set so empty categories disappear.
- Two groups with identical heading text produce indistinguishable announcements for screen-reader users; make headings unique within a picker.
- Keyboard navigation across a group boundary skips disabled groups entirely, so a design that relies on users reading a disabled category should surface that information outside the option list as well.
- Values must be unique across all groups in a picker, not just within one group, otherwise selecting an option in one group can appear to toggle an option in another.
- When the picker popover is rendered through a portal, styling that targets the popover's DOM ancestry will not reach the groups; scope such styling to the group's own class instead.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
