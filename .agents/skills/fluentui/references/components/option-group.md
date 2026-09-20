# OptionGroup

> **Package**: `@fluentui/react-combobox` v9.17.2
> **Import**: `import { OptionGroup } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

OptionGroup is a non-interactive container that clusters related Option children inside a picker such as Combobox or Dropdown, giving the cluster a visible heading through its label slot and a semantic group identity for assistive technology. It renders a required root wrapper (a div element exposed by default as a group) plus an optional label slot rendered as a span placed before the child options, so a long option list can be broken into scannable categories such as regions, teams, or product families. OptionGroup carries no selection state of its own: selection, filtering, and type-ahead all belong to the surrounding Combobox, Dropdown, or Listbox, while the group contributes ordering and naming. Because grouping is purely declarative, groups can be mixed freely with ungrouped options, and each group can be disabled as a whole when none of its members are currently available. The component also surfaces the picker-level configuration props it participates in (appearance, size, positioning, open state, and related behaviors) so a grouped picker can be configured consistently from the group surface.

**When to use**: Use OptionGroup when a picker exposes enough options that scanning a flat list becomes slow and the options naturally fall into named categories of two or more items each. It is the right choice when the category name carries meaning for the user ("West coast", "Shared mailboxes", "Recently used") and should be announced, not merely decorative. Prefer a flat option list when there are fewer than roughly a dozen choices or when every option belongs to one category, since grouping then adds announcement noise without reducing scanning cost. Prefer a plain Divider or OverflowDivider between sections only when the separation is purely visual and no naming or semantics are needed. Prefer a standalone Listbox or DataGrid when the selection surface is a full page rather than a popup, and prefer TagPicker or TagPickerOptionGroup when the user must pick multiple values rendered as tags.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `'filled-darker' \| 'filled-lighter' \| 'outline' \| 'underline'` | — | No | — |
| `button` | `NonNullable<Slot<'button'>>` | — | Yes | — |
| `children` | `React_2.ReactNode` | — | No | — |
| `clearButton` | `Slot<'button'>` | — | No | — |
| `clearable` | `boolean` | — | No | — |
| `defaultOpen` | `boolean` | — | No | — |
| `defaultValue` | `string` | — | No | — |
| `disableAutoFocus` | `boolean` | — | No | — |
| `disableAutoFocus` | `boolean` | — | No | — |
| `disabled` | `boolean` | — | No | — |
| `expandIcon` | `Slot<'span'>` | — | No | — |
| `freeform` | `boolean` | — | No | — |
| `inlinePopup` | `boolean` | — | No | — |
| `label` | `Slot<'span'>` | — | No | — |
| `listbox` | `Slot<typeof Listbox>` | — | No | — |
| `onOpenChange` | `(e: ComboboxBaseOpenEvents, data: ComboboxBaseOpenChangeData) => void` | — | No | — |
| `open` | `boolean` | — | No | — |
| `placeholder` | `string` | — | No | — |
| `positioning` | `PositioningShorthand` | — | No | — |
| `root` | `NonNullable<Slot<'div'>>` | — | Yes | — |
| `root` | `NonNullable<Slot<'div'>>` | — | Yes | — |
| `size` | `'small' \| 'medium' \| 'large'` | — | No | — |
| `value` | `string` | — | No | — |
| `value` | `string` | — | No | — |

### Prop Guidance

- **label**: Renders the visible group heading as a static span before the child options. Use a short noun phrase; when you omit it, you must set aria-label on the OptionGroup so the group still has an accessible name. `label="West coast"`
- **disabled**: Marks the entire group, and therefore all of its options, as unavailable. Use only when every option in the group is genuinely unavailable; otherwise disable or omit individual options so users can still see what exists. `disabled`
- **appearance**: Matches the group and its options to the surrounding picker's visual treatment. Use filled-darker or filled-lighter inside dropdown surfaces, outline for form contexts with visible borders, and underline for a bare form-control look. `filled-lighter`
- **size**: Controls the density of the group heading and option rows so grouped options line up with ungrouped options and with the trigger. Use small in compact toolbars, medium by default, and large in spacious or touch-first layouts. `small`
- **value**: Identifies the group within the surrounding picker when the group needs to be addressed programmatically or matched during filtering. Keep it unique among groups and distinct from the option values in the list. `group-west`
- **defaultValue**: Sets the initially selected option value for an uncontrolled picker that contains the group. Use it only when you do not control selection; otherwise use value together with a change handler. `ca`
- **defaultOpen**: Opens the popup that contains the group on first render for an uncontrolled picker. Useful for demos and tests, rarely appropriate in production where the popup should open on user intent. `true`
- **open**: Controls the popup visibility when the grouped picker is controlled, and must be paired with onOpenChange so the popup can be closed again. `true`
- **onOpenChange**: Notifies you when the popup containing the grouped options opens or closes, providing the originating event and the new open state, so controlled visibility and analytics stay in sync. `onOpenChange={(e, data) => setOpen(data.open)}`
- **clearable**: Adds a clear action to the surrounding picker so a grouped selection can be reset at once. Make sure clearing does not leave a group visually marked as selected. `clearable`
- **freeform**: Allows the picker to accept values that are not present in any group. Pair it with validation, because freeform entries bypass the grouped option list entirely. `freeform`
- **placeholder**: Supplies the hint text shown on the picker's trigger before a selection is made. Keep it descriptive of the overall set of groups rather than of any single group. `Select a region`
- **positioning**: Adjusts where the option popup containing the groups is anchored and how it flips or shifts to stay on screen, which matters when many groups make the popup tall. `positioning={{ position: 'below', align: 'start' }}`
- **inlinePopup**: Renders the grouped options inline in the page flow instead of in a portal-backed popup, which is useful in constrained surfaces where overlays cannot be used. `inlinePopup`
- **disableAutoFocus**: Prevents focus from being moved onto the option list automatically when the popup with the groups opens, which is useful when another element on the surface must keep focus. `disableAutoFocus`
- **root**: The required wrapper slot for the group. Use it to attach a className or to override the rendered element, but preserve the group semantics applied by default. `className={styles.optionGroup}`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `label` | — | No | The option group label, displayed as static text before the child options. If not using label, it's recommended to set `aria-label` directly on the OptionGroup instead. |
| `root` | — | Yes | The root group wrapper |

## Best Practices

### Do's

- Give every group a short, scannable heading through the label slot so users can predict the contents before reading each option.
- When a group heading would be visually redundant, hide the label but still supply aria-label on the OptionGroup instead of leaving the group unnamed.
- Keep option values unique across the entire picker, not just within one group, because selection is tracked on the picker, not on the group.
- Order groups by the user's likely task flow or alphabetically, and keep the ordering stable between renders so keyboard navigation stays predictable.
- Place related options inside the same OptionGroup and keep ungrouped options either consistently before or after all groups.
- Use the disabled prop on a group only when every option inside it is genuinely unavailable, and give the user context elsewhere in the Field about why.
- Pair OptionGroup with a Field and Label on the surrounding picker so the picker itself still has a name, independent of the group headings.

### Don'ts

- Don't wrap a single option in an OptionGroup, since a one-item group reads as a noisy heading rather than a useful category.
- Don't nest an OptionGroup inside another OptionGroup; grouping is flat and nesting produces confusing announcements and broken layout spacing.
- Don't place arbitrary markup, buttons, or non-option content inside an OptionGroup, because the surrounding Listbox expects option children only.
- Don't rely on a visually hidden label as the only naming mechanism if the group can be scrolled out of view without an accessible name.
- Don't use OptionGroup headings as a replacement for the picker's own label or placeholder, which are separate naming mechanisms.
- Don't expect placeholder, clearable, or freeform to change grouping behavior; they configure the surrounding picker and never the group.
- Don't duplicate the same option value in two different groups and assume the picker can distinguish them during selection or filtering.

## Anti-Patterns

### One-option groups

❌ A group containing a single option turns the heading into visual and screen reader noise, and the user gains no scanning benefit because there is nothing to compare within the category.

✅ Leave the lone option ungrouped, or merge it into the nearest related group so every group holds at least two meaningful options.

### Group heading used as the field label

❌ Treating the OptionGroup label as the name of the whole picker leaves the Combobox or Dropdown itself unnamed, so screen reader users hear only the current value with no indication of what is being selected.

✅ Keep a Field and Label on the surrounding picker and use the OptionGroup label purely for the category name inside the list.

### Unnamed groups

❌ Omitting both the label slot and aria-label produces options that are announced with no group context, so users who filter or arrow through a long list cannot tell which category the active option belongs to.

✅ Always provide either a visible label slot or an aria-label on the OptionGroup, even when the heading is visually hidden.

### Disabled group as a hiding mechanism

❌ Setting disabled on a group to represent options that do not apply hides real state from keyboard navigation while still showing the options, so users see choices they can never reach.

✅ Filter out genuinely inapplicable options, or disable individual options so the group heading and the remaining actionable options stay reachable.

### Duplicate option values across groups

❌ Because the picker tracks selection by value, the same value appearing in two groups makes the selected state ambiguous and can match the wrong row during filtering or type-ahead.

✅ Namespace values per group, for example by prefixing the group identifier, and keep group values distinct from option values.

## Accessibility

**Requirements**: The root must expose grouping semantics so that WCAG 1.3.1 (Info and Relationships) is satisfied: consumers should rely on the built-in group role on root rather than applying their own role. Each group needs an accessible name, provided either by the visible label slot or by aria-label when the heading is omitted. Group headings must meet WCAG 1.4.3 contrast of at least 4.5:1 against the popup background, and the disabled group styling must still meet WCAG 1.4.11 non-text contrast. Keyboard access (WCAG 2.1.1), a logical focus order during arrow navigation (WCAG 2.4.3), and programmatic name, role, and value exposure (WCAG 4.1.2) all depend on keeping groups shallow and each group named.

| Key | Action |
| --- | --- |
| `ArrowDown` | Moves focus to the next option, crossing from the last option of one group into the first option of the next group while skipping the group label. |
| `ArrowUp` | Moves focus to the previous option, crossing backwards between groups and skipping group labels. |
| `Home` | Moves focus to the first option in the listbox, which is typically the first option of the first OptionGroup. |
| `End` | Moves focus to the last option in the listbox, which is typically the last option of the last OptionGroup. |
| `Enter` | Selects the currently active option; in single-select mode this also closes the popup. |
| `Space` | Selects the currently active option in the same way as Enter for pickers configured with a combobox button. |
| `Escape` | Closes the popup without changing the current selection and returns focus to the trigger. |
| `Tab` | Moves focus out of the picker entirely; focus never stops on an OptionGroup wrapper or on its label. |
| `Printable character keys` | Runs type-ahead matching against option text across all groups, and groups whose options all fail the match should be treated as empty. |

**ARIA**: aria-label on the OptionGroup root when no visible label slot is rendered, role group on the OptionGroup root, applied by default, id and aria-labelledby wiring between the listbox and the visible group label, aria-disabled on the group when the disabled prop is set, aria-selected on the child options that carry the current selection, aria-activedescendant on the combobox input or listbox reflecting the active option inside a group

**Screen Reader**: When focus moves into the option list, screen readers announce the surrounding Listbox and then, as the user arrows through options, the name of the OptionGroup that contains the active option along with the option text and its position in the set. Group labels are not focusable, so arrow keys pass straight from the last option of one group to the first option of the next while the announced group name changes. A group rendered with the disabled prop is announced as unavailable and its options are skipped by arrow navigation. If neither the label slot nor aria-label is supplied, screen readers announce the options without any group context, which is why an accessible name is required for every group.

## Styling

Style OptionGroup through makeStyles and Griffel tokens rather than inline styles so themed and high-contrast modes stay correct. Give the root vertical breathing room with tokens.spacingVerticalXS or tokens.spacingVerticalS above the group and tokens.spacingVerticalXXS between the label and its options, and indent or pad the group with tokens.spacingHorizontalM so option text stays aligned with ungrouped options. The label slot should typically use tokens.colorNeutralForeground2 with tokens.fontSizeBase200 and tokens.fontWeightSemibold to read as a heading without competing with the option text, keeping options at tokens.colorNeutralForeground1 with tokens.fontSizeBase300. The appearance values map to the picker surface, so filled-darker pairs with tokens.colorNeutralBackground3, filled-lighter with tokens.colorNeutralBackground1, outline with tokens.colorNeutralStroke1 and tokens.borderRadiusMedium, and underline with a tokens.colorNeutralStroke1 border on the trigger. When a group is disabled, switch the label to tokens.colorNeutralForegroundDisabled and drop it to tokens.colorNeutralForeground4 for the dimmed option text. Because root and label are slots, you can pass a custom element or className to either one, for example a sticky label that uses a background from tokens.colorNeutralBackground1 to stay legible while the popup scrolls.

## Performance

OptionGroup itself is a very cheap wrapper: it renders one div, one optional label span, and passes its children through, so the cost of grouping is dominated by the number of Option children rather than by the number of groups. Keep the number of groups modest, since each group adds a non-focusable heading node and an extra accessibility node in the tree. Memoize the option children when the list is generated from data so typing in a filterable picker does not rebuild every group on each keystroke, and avoid creating catalog-info or style objects inline inside a group render. For lists with hundreds of options across many groups, prefer virtualizing the option list rather than relying on more groups to make the list feel shorter, because grouping does not reduce the number of mounted DOM nodes.

## Theming & Tokens

OptionGroup inherits its colors and type scale from the FluentProvider theme. The group label reads well with tokens.colorNeutralForeground2 and tokens.fontSizeBase200, while option text uses tokens.colorNeutralForeground1 at tokens.fontSizeBase300; on a disabled group switch to tokens.colorNeutralForegroundDisabled and tokens.colorNeutralForeground4. Spacing between the label, the group, and the option rows should come from tokens.spacingVerticalXS, tokens.spacingVerticalS, and tokens.spacingHorizontalM so the rhythm matches other form controls. The appearance values resolve to surface tokens such as tokens.colorNeutralBackground1, tokens.colorNeutralBackground3, and tokens.colorNeutralStroke1, and the popup surface behind the groups uses tokens.shadow16 with tokens.borderRadiusMedium. Selected options pull from tokens.colorBrandForeground1 for the check mark and tokens.colorNeutralBackground1Selected for the row highlight, and all of these tokens respond automatically to high-contrast and dark themes.

## Migration Notes

In Fluent UI v8, grouping was expressed on Dropdown and Combobox through renderOptionGroup and renderOptionGroupTitle callbacks that returned custom markup for the group wrapper and heading. In v9 OptionGroup is a first-class component imported from @fluentui/react-components and used directly as a child of the picker's options, with the heading declared through the label slot instead of a render callback. Because the group now owns its semantics, consumer code no longer needs to hand-roll aria-label on the wrapper, and the disabled state of an entire group is expressed with the disabled prop rather than by mapping over the options.

## Edge Cases

- If a filter or type-ahead removes every option in a group, the heading can still render as an orphaned label; decide whether to hide empty groups by checking the filtered child count before rendering.
- Long group headings truncate at narrow popup widths, so either set a max width on the label slot or keep headings to a few words.
- Option values must be unique across all groups, because duplicate values break selection and matching even though each group looks internally consistent.
- An OptionGroup rendered outside a Listbox or Combobox has no selection context and will not participate in arrow navigation, selection, or type-ahead.
- A disabled group remains in the DOM and is announced, but its options are skipped during arrow navigation; users may need an explanation elsewhere on the page.
- Using inlinePopup changes where the grouped list is mounted, which can change stacking order relative to overlays and change which scroll container clips the groups.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
