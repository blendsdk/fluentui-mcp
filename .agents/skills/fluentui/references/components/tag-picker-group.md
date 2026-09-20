# TagPickerGroup

> **Package**: `@fluentui/react-tag-picker` v9.8.8
> **Import**: `import { TagPickerGroup } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

TagPickerGroup is the layout container that hosts the tags currently selected inside a TagPicker. It renders a lightweight inline element (a span by default) that places its children in a wrapping, horizontally scrolling-free row directly next to the TagPickerInput, and it reads the surrounding tag picker context so that tag sizing, appearance, disabled state, and selection awareness stay consistent with the rest of the field. The group does not own selection state, filtering, or popover behavior; those live on TagPicker (value, onOptionSelect, onOpenChange, noPopover, disableAutoFocus), TagPickerControl (field chrome, combobox semantics), and TagPickerInput (text entry and filtering). In practice you render one InteractionTag (typically with an InteractionTagPrimary and an InteractionTagSecondary removal action) per selected value inside TagPickerGroup, mapping over the same array you pass as the TagPicker value so the rendered tags and the picker's state never drift apart. Because it is purely structural, all of the visual affordances a user recognizes as the field — border, background, focus ring, sizing, and text cursor placement — come from TagPickerControl, not from this component.

**When to use**: Use TagPickerGroup whenever you build a multi-select tag input with the Fluent tag picker composition, that is, a TagPicker root wrapping a TagPickerControl that contains a TagPickerGroup plus a TagPickerInput. It is the correct place to render the selected tags so they appear inline with the text input and inherit the field's disabled, size, and appearance treatment. Choose a different component when the tags are not part of an editable field: use TagGroup (with Tag or InteractionTag children) for read-only or display-only collections of tags, use Combobox or Dropdown when users pick from a list but the selections should not be rendered as tags, and use TagPickerGroup only as a direct child of TagPickerControl — never standalone, since it depends on tag picker context to render correctly.

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

- **children**: Required. Render the currently selected tags here, typically one InteractionTag per selected option, each containing an InteractionTagPrimary and an optional InteractionTagSecondary removal action, keyed by the option's value. When nothing is selected, pass no children rather than hiding placeholders inside the group; the input owns empty-state text. `one InteractionTag per selected option, each keyed by its option value`
- **disabled**: Inherited from the surrounding TagPicker rather than set per group. When true, the control presents the disabled visual treatment and tag children should be rendered non-interactive; do not flip this locally because the group and the control must agree. `true when the entire picker is disabled`
- **style**: Use only for layout-level inline overrides on the group container, such as gap, flex-wrap, or a minimum width. Field chrome such as borders and backgrounds should stay on TagPickerControl to avoid duplicated rendering. `an inline style object adjusting gap and flex-wrap`
- **secondaryAction**: An optional slot typed as a span for supplementary content rendered alongside the group's tags. Add it only for a genuine affordance, and make sure it does not compete visually or in tab order with the individual tag removal actions; leave it unset for the common case. `unset by default; a single inline affordance when needed`
- **hasSelectedOptions**: A read-only value supplied by tag picker context that tells you whether at least one tag is currently selected. Consume it to decide whether to render supplementary group content or messaging; it is not user input and should not be set directly. `true when one or more tags are selected`
- **value**: The picker's selected value (or in-flight input value) flows down from the TagPicker rather than being configured on the group. Keep the children you render aligned with this value so the tags and the reported selection never diverge. `the option value string reported by the TagPicker`
- **onOptionSelect**: The selection and removal handler. Selecting an option in the popover and dismissing a tag through its secondary action both route here, so this is where you add or remove entries from your state array. `update the selected values array on select or dismiss`
- **onOpenChange**: Notifies you when the options popover opens or closes. Useful for lazy-loading options, resetting a filter, or analytics; it does not affect the tags rendered inside the group. `load the option list when open becomes true`
- **noPopover**: Suppresses the built-in options popover so you can present choices in your own surface such as a Drawer or Dialog. When enabled, you take over focus management and option announcement, and the group continues to display the selected tags. `true when rendering options in a custom surface`
- **disableAutoFocus**: Prevents focus from being moved automatically when the options surface opens. Use it when focus must remain in the input or when the alternative surface handles its own focus trap. `true when focus should stay in the input`
- **inline**: Controls whether the picker lays out inline with surrounding content rather than as a block-level field. Choose inline when the tag picker sits in a toolbar or a sentence-like flow and the field should size to its contents. `true for a content-sized, inline field`

## Best Practices

### Do's

- Always render TagPickerGroup inside TagPickerControl, which itself is inside TagPicker, so the group can read size, appearance, disabled, and value from context.
- Derive the children from the same array that the TagPicker reports through onOptionSelect, so removing a tag and updating the picker value happen as one coherent state change.
- Give each tag a stable key based on its option value so React reconciles tag children instead of remounting them while the user types in the input.
- Use InteractionTag with InteractionTagPrimary for the tag label and InteractionTagSecondary for the removal affordance, and give the secondary action a descriptive accessible name.
- Let TagPickerControl own the field chrome; use TagPickerGroup only for flex layout concerns such as gap, rowGap, wrapping, and minimum width.
- Provide an accessible name for the whole picker through a Field plus Label pair or an aria-label / aria-labelledby on the control, so the tags are announced in a meaningful context.
- Rely on the disabled state flowing down from TagPicker so tags render non-interactive when the whole picker is disabled, rather than disabling tags individually in an ad hoc way.

### Don'ts

- Do not render TagPickerGroup outside of TagPickerControl or TagPicker expecting it to work; it depends on tag picker context and will fail without it.
- Do not add combobox, listbox, or option roles to the group or make it focusable with a tabIndex; it is a passive container and extra semantics confuse screen reader users.
- Do not apply border, background, border radius, or focus outline styles to the group — the control already draws them, and duplicating them produces double borders and mismatched focus rings.
- Do not place unrelated interactive elements such as buttons, links, or nested inputs directly inside the group; keep the contents to tags (and the input in the sibling slot).
- Do not let the rendered tags and the picker's value fall out of sync by removing a child without updating the corresponding value entry.
- Do not set a fixed height or overflow hidden on the group, because wrapped tags will be clipped when the field grows to multiple rows.
- Do not treat the group as the source of truth for placeholder text; when no tags are selected the input handles the empty-state messaging.

## Anti-Patterns

### Rendering the group without the picker composition

❌ TagPickerGroup is designed to be a child of TagPickerControl inside TagPicker; rendering it on its own means tag picker context is missing, so the tags get the wrong size, appearance, and disabled treatment, and the expected interaction wiring is absent.

✅ Always compose TagPicker, then TagPickerControl, then TagPickerGroup plus TagPickerInput, and treat the group purely as the slot for selected tags.

### Duplicating field chrome on the group

❌ Adding a border, background, border radius, or focus outline to the group creates a second visual box inside the control's box, producing double borders and a focus ring that does not match the input's focus state.

✅ Keep the group's styles to flex layout only and let TagPickerControl render all field chrome using the theme's stroke, background, and focus tokens.

### Tags rendered from a separate list than the picker value

❌ If the children are built from a locally maintained array while the picker's value is updated elsewhere, tags can appear for values that are no longer selected or disappear while still selected, which desynchronizes what users see, what the form submits, and what assistive technology announces.

✅ Derive the tag children directly from the picker's value array and update that single source of truth in onOptionSelect, including the dismiss path.

### Making the container focusable

❌ Giving the group a tabIndex adds an extra tab stop that has no role or action, which is confusing for keyboard and screen reader users who land on an element that does nothing.

✅ Leave the group non-focusable; keyboard interaction belongs on the TagPickerInput and on the tag buttons and their dismiss actions.

### Clipping wrapped tags with fixed dimensions

❌ Setting a fixed height, a single-line overflow, or nowrap on the group hides tags as soon as the selection grows past one row, making selected values invisible and unreachable by keyboard.

✅ Allow wrapping, avoid fixed heights, and let the control grow vertically; if the field must stay compact, cap the number of rendered tags in application state rather than hiding them with CSS.

## Accessibility

**Requirements**: TagPickerGroup renders a non-interactive container and adds no ARIA semantics of its own, so conformance depends on the composition around it: the TagPickerControl must expose combobox semantics with an accessible name, the TagPickerInput must provide the text-entry role and value, and every InteractionTagSecondary removal action must have a programmatic name (WCAG 2.1 AA, 4.1.2 Name, Role, Value). Focus visibility must be preserved on the input and on each tag action (2.4.7 Focus Visible), text and interactive elements must meet 4.5:1 contrast, which the default theme tokens satisfy unless you override colors, and the field must reflow without clipping when tags wrap at narrow widths or with 200 percent zoom (1.4.4 Resize Text, 1.4.10 Reflow). Because removing a tag changes the field's content, consider announcing the change with the AriaLiveAnnouncer or the announcement hooks so users who cannot see the tag disappear are informed (4.1.3 Status Messages).

| Key | Action |
| --- | --- |
| `Tab` | Moves focus from the TagPickerInput into the tag buttons rendered inside the group and then out of the picker to the next focusable element. |
| `Shift+Tab` | Moves focus backwards out of the tags and back into the TagPickerInput. |
| `Enter` | Activates the focused tag's primary action, or activates the focused dismiss button to remove that tag. |
| `Space` | Same as Enter for the focused tag button or its dismiss button, since both are rendered as native buttons. |
| `Backspace` | Handled by TagPickerInput: when the input is empty, removes the most recently selected tag from the group. |
| `ArrowDown` | Handled by the control and input: opens the options popover and moves through the option list that fills the picker's value. |
| `ArrowUp` | Handled by the options list: moves focus to the previous option in the popover while it is open. |
| `Escape` | Closes the options popover if it is open and returns focus to the input or control. |

**ARIA**: aria-label, or aria-labelledby pointing at a Label component, on the TagPickerControl to name the whole field, aria-haspopup and aria-expanded on the control that exposes the options popover, aria-activedescendant on the TagPickerInput while an option in the popover is highlighted, aria-disabled, propagated from the disabled flag on TagPicker through context to the control and input, role="option" with aria-selected on entries inside the popover's listbox, aria-label (or aria-labelledby) on each InteractionTagSecondary removal action, so the dismiss button is not announced as an unlabeled button

**Screen Reader**: The group itself is announced as part of the field rather than as a landmark or list: users hear the combobox name, its current value, and then the individual tags they tab into. Each tag is exposed as a button with its own name, and its secondary action is exposed as a separate, nested button, so a tag reads approximately as the option name followed by its remove action; without an explicit name on the secondary action, users hear only "button" and cannot tell which tag would be removed. Removals performed through the keyboard do not automatically produce an announcement of the resulting selection, so pair the tag picker with the AriaLiveAnnouncer (or announce hooks) to report that a tag was added or removed when the picker is used in a form where the change matters.

## Styling

Style the group through the className or style prop and a Griffel makeStyles call, and keep the customization limited to layout: display flex, flexWrap wrap, alignItems center, columnGap tokens.spacingHorizontalXS, rowGap tokens.spacingVerticalXS, flexGrow 1, flexShrink 1, and minWidth 0 so the input never collapses when several tags are present. Padding inside the field is generally governed by TagPickerControl, but if you do need tighter spacing use tokens.spacingHorizontalSNudge and tokens.spacingVerticalSNudge, and reserve tokens.spacingHorizontalXXS for very dense, size-small pickers. Never add border or background declarations to the group — those belong to the control, which already uses tokens.colorNeutralStroke1, tokens.colorNeutralStroke1Hover, tokens.colorNeutralStroke1Pressed, tokens.colorStrokeFocus2 for the focus ring, tokens.colorNeutralBackground1, tokens.colorNeutralBackgroundDisabled, tokens.colorNeutralStrokeDisabled and tokens.colorNeutralForegroundDisabled for the disabled treatment, plus tokens.borderRadiusMedium. Because the group sits in a flex row with the input, adding flexGrow or a truncating min-width on the group is the usual fix for tags pushing the caret out of view, and alignItems flex-start is preferable to stretch when tags wrap across multiple lines inside a resizable textarea-like field.

## Performance

TagPickerGroup is a stateless flex container, so the cost of using it comes almost entirely from the number of tag children it renders. Keep the selected list reasonable and avoid patterns that remount the whole tag list on every keystroke: memoize the tag elements so typing in the TagPickerInput does not recreate each InteractionTag, give every tag a stable key derived from its option value, and avoid inline style objects that are recreated on each render for the group itself. When the selection can be large, cap the rendered tags in application state (for example by folding extras into a counter tag) instead of rendering hundreds of nodes that must all lay out and wrap on every change, and prefer disabling whole groups of tags through the picker's disabled state rather than toggling props on every child individually.

## Theming & Tokens

TagPickerGroup consumes the size, appearance, and disabled values that flow from TagPicker through context and applies them with theme tokens rather than hard-coded values, so it follows whatever theme is set on the nearest FluentProvider (webLightTheme, webDarkTheme, and their high-contrast counterparts). Typography inside the field comes from tokens.fontFamilyBase with tokens.fontSizeBase200 or tokens.fontSizeBase300 and tokens.lineHeightBase300 depending on the picker's size; the visual field around the group is drawn by TagPickerControl using tokens.colorNeutralBackground1, tokens.colorNeutralStroke1, hover tokens.colorNeutralStroke1Hover, pressed tokens.colorNeutralStroke1Pressed, the keyboard focus ring in tokens.colorStrokeFocus2, and tokens.borderRadiusMedium. The disabled treatment uses tokens.colorNeutralBackgroundDisabled, tokens.colorNeutralStrokeDisabled, and tokens.colorNeutralForegroundDisabled, while secondary text and counters typically use tokens.colorNeutralForeground2. The only values the group contributes natively are spacing decisions such as tokens.spacingHorizontalXS and tokens.spacingVerticalXS gaps and small paddings like tokens.spacingHorizontalSNudge, and animation, where present, uses tokens.durationNormal with tokens.curveEasyEase — overriding any of these with literal colors or pixel values will break the component's automatic adaptation to dark, high-contrast, and brand themes.

## Migration Notes

Previous generations of Fluent put the tag list, the input, and the suggestion handling inside a single TagPicker component with props for selected items and suggestion callbacks. In v9 that monolith is split into cooperating parts: TagPicker owns value, onOptionSelect, onOpenChange, noPopover, and disableAutoFocus; TagPickerControl owns the field chrome and combobox semantics; TagPickerGroup owns only the selected-tag layout; and TagPickerInput owns typing and filtering. Migrating therefore means rendering one InteractionTag per selected value inside TagPickerGroup, keeping that list derived from the picker's value array, moving suggestion rendering into the popover's option list (or supplying your own surface when noPopover is set), and moving any "remove all" or counter affordances out of the tag list itself. Because the group no longer manages selection, any logic that previously lived in the picker's remove callbacks must be attached to the picker's option-select handling instead.

## Edge Cases

- TagPickerGroup depends on tag picker context; rendering it outside TagPickerControl inside TagPicker is an unsupported composition and does not produce a functioning field.
- The children prop is marked required, but a legitimate empty selection means passing no tag children at all — supply an empty value rather than omitting placeholder markup, because placeholder text belongs on the TagPickerInput, not inside the group.
- Because the group sits in a flex row with the input, a long tag list can push the caret out of view unless the group is allowed to shrink and wrap; check the multi-row layout at narrow widths.
- Programmatic removal of a tag (for example a clear-all action elsewhere in the form) must also update the picker's value, or the group will keep rendering a tag that the picker no longer considers selected.
- Setting noPopover means no built-in option surface exists; the group still displays tags, but you become responsible for presenting choices and for moving focus and announcing the option list.
- disableAutoFocus changes where focus lands when the options surface opens, which can leave screen reader users unaware that an option list appeared unless you announce the change yourself.
- The disabled state is inherited from the picker; disabling individual tags inside the group while the picker itself is enabled creates an inconsistent state where some tags are removable and others are not.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
