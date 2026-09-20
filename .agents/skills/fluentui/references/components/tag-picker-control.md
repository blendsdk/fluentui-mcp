# TagPickerControl

> **Package**: `@fluentui/react-tag-picker` v9.8.8
> **Import**: `import { TagPickerControl } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

TagPickerControl is the composing container at the center of the v9 TagPicker family. It renders the visible control surface of a tag picker: the region that holds the currently selected tags, the free-form text input used to type or filter, and an optional secondary action. Inside it you typically place a TagPickerGroup holding selected tags, a TagPickerInput for text entry, and a TagPickerButton supplied through the secondaryAction slot to open the popover list of TagPickerOption entries rendered in a TagPickerList. The control itself is a thin layout and state-styling layer, so most of its visual behavior (border, radius, padding, focus stroke, disabled appearance, and the amount of horizontal space reserved for the input) comes from its own props such as disabled, hasSelectedOptions, inline, and style, combined with configuration inherited from the surrounding TagPicker and the active theme. It also determines the amount of empty space left inside the control, which is why hasSelectedOptions is a required part of its contract rather than an optional convenience.

**When to use**: Use TagPickerControl whenever you build a tag picker where users select multiple values from a list of options and/or type their own tags. It is the required visual shell of the TagPicker compound component, so if you are rendering TagPicker, TagPickerGroup, TagPickerInput, TagPickerButton, TagPickerList, or TagPickerOption, the control belongs between the picker and those children. Choose it for multi-select filtering fields, label editors, recipient pickers, and any input that mixes free text with a curated option set. Prefer Combobox or Dropdown when only a single value can be chosen and no free-form text is needed, TagGroup or InteractionTag when the tags are read-only or removable but never typed, and TagPickerOptionGroup inside the popover when the option list needs headings. Switch to noPopover when the field is purely free-form and there is no option list to show.

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

- **children**: The composed contents of the control surface: normally a TagPickerGroup holding the selected tags followed by a TagPickerInput. Order matters for both tab sequence and reading order, so always place the group before the input. `TagPickerGroup with selected tags, then TagPickerInput`
- **secondaryAction**: A required slot for the trailing action rendered at the end of the control, conventionally a TagPickerButton that opens the popover option list. Because it is required, always supply an element here; omitting it removes the visible affordance for expanding the picker. `TagPickerButton`
- **aside**: A required slot in the control's slot contract that renders alongside the main content. Treat it as structural: use it for the fixed-position region the control expects rather than dropping extra markup into children. `aside slot region`
- **disabled**: Disables the whole control surface. Use it to freeze selection and text entry at once; when the control is disabled, make sure the element placed in secondaryAction is disabled too, otherwise users can still open the option list. `true`
- **style**: Griffel-compatible style object applied to the control root. Use it for scoped layout adjustments such as width, minWidth, or margin, and express colors and spacing through design tokens so hover, focus, and disabled states stay coherent. `minWidth 320px using a spacing token`
- **hasSelectedOptions**: Required boolean describing whether the control currently holds any selected tags. The control uses it to decide how much room to reserve for tags versus the input, so keep it in sync with your actual selection to avoid collapsed or oversized layouts. `true`
- **inline**: Renders the control as an inline-level element that sizes to its content instead of filling the available width. Use it when the picker sits inside a sentence, a compact toolbar, or any flex row where a full-width field would look wrong. `true`
- **noPopover**: Suppresses the popover option list so the picker behaves as a pure free-form tag input. Enable it only when there is no TagPickerList to show, since a trigger placed in secondaryAction will then have nothing to open. `true`
- **disableAutoFocus**: Prevents the picker from moving focus automatically when it opens. Use it in flows where the surrounding context owns focus management and auto-focusing the input would be disruptive. `true`
- **value**: The string value associated with the picker's editable text. Supply it when you need the text to be controlled; when the value is not supplied, typing is left to the input and you should read the committed text from the selection callbacks instead. `react`
- **onOpenChange**: Callback raised when the option list visibility changes, carrying the change data. Use it for side effects such as analytics or lazy-loading the option set, and not to override the list visibility that the picker already manages. `log when the list opens`
- **onOptionSelect**: Callback raised when an option is selected or deselected, carrying the selection data. Use it as the single source of truth for your own selection state so the tags rendered inside the control stay consistent with the option list. `update the selected tags collection`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `aside` | — | Yes | — |

## Best Practices

### Do's

- Render TagPickerControl as a direct child of TagPicker so it inherits the picker's configuration (size, disabled behavior, open state, and the onOpenChange and onOptionSelect callbacks) instead of trying to re-implement it.
- Compose children in both visual and logical order: the TagPickerGroup with selected tags first, then the TagPickerInput, so tab order and screen reader reading order match what users see.
- Provide the secondaryAction slot with a TagPickerButton so pointer users have an explicit affordance for opening the option list, since keyboard users can also use the down arrow.
- Keep hasSelectedOptions synchronized with your actual selection state; the control uses it to decide how much horizontal space to reserve and how the inner layout distributes between tags and the input.
- Rely on the control's own disabled prop (or the disabled state flowing from the surrounding picker) rather than visually greying out individual children, so the border, text, and secondary action all reflect the same state.
- Use the style prop with Griffel design tokens for one-off width, border, or spacing adjustments instead of hard-coding colors and pixel values that break in dark or high-contrast themes.
- Set inline when the control should flow with surrounding text or sit in a compact toolbar and shrink to its content rather than stretching to fill the container.
- Give the embedded input an accessible name, either through a Label or Field wrapper or by associating a visible label, because the control's border itself carries no accessible text.

### Don'ts

- Do not render TagPickerControl outside of TagPicker; without the surrounding picker it has no popover, no option context, and no shared state for the group and input.
- Do not place arbitrary markup or extra interactive widgets inside children; the control is designed to host the tag group and the text input, and other content breaks its padding and focus calculations.
- Do not use the secondaryAction slot for decorative icons, counters, or labels; it is meant for the control that opens the option list, and replacing it removes the affordance users expect.
- Do not override the border, background, or focus ring with fixed colors or force-overrides; use theme tokens through the style prop so hover, focus, and disabled states stay consistent.
- Do not try to drive the open state manually from onOpenChange or onOptionSelect; treat those callbacks as notifications and let the picker own the list visibility.
- Do not toggle noPopover or inline on the fly while the list is open, because changing the composition mid-interaction leaves focus and layout in an inconsistent state.
- Do not render selected tags outside the control's group while also rendering them inside it; duplicated tags confuse assistive technology and produce mismatched spacing.

## Anti-Patterns

### Rendering the control without its TagPicker parent

❌ TagPickerControl relies on the surrounding picker for open state, option data, and shared callbacks. Rendered standalone it draws a border with nothing to open and no shared state, so the group, input, and list fall out of sync.

✅ Always nest the control inside TagPicker and place TagPickerGroup, TagPickerInput, the secondaryAction trigger, and the TagPickerList within that hierarchy.

### Restyling the children instead of the control

❌ Adding borders, radii, or padding to TagPickerInput or to the group fights the control's own padding and focus-ring math, producing double borders, clipped focus strokes, and layouts that break when tags wrap.

✅ Make layout changes through the control itself, using its style prop with tokens such as tokens.borderRadiusMedium and spacing tokens, and leave the children to their own defaults.

### Using the secondaryAction slot for decoration

❌ The slot is the control's trailing action region. Filling it with a counter, badge, or static icon removes the only visible way to open the option list, leaving pointer users unable to expand the picker.

✅ Keep a TagPickerButton in secondaryAction and render auxiliary information elsewhere, such as in the surrounding Field, a hint, or the option list itself.

### Assuming free-form text means no options

❌ Teams enable noPopover to avoid building an option list but still keep a trigger in secondaryAction, resulting in a button that appears to do nothing when clicked.

✅ Decide up front between a free-form-only field with noPopover and a trigger that has no list, and an option-driven picker where the trigger opens a populated TagPickerList.

### Letting selection state drift out of the control

❌ When onOptionSelect is ignored and tags are tracked in a separate list, hasSelectedOptions stops matching reality; the control then reserves tag space that is not used, or wraps unexpectedly when tags are present but undeclared.

✅ Drive the tags rendered inside the group and the hasSelectedOptions flag from the same state that onOptionSelect updates.

## Accessibility

**Requirements**: The control is the visual shell for a combobox-style widget, so it must satisfy WCAG 2.1 AA for non-text contrast (1.4.11) on its rest, hover, focus, and disabled borders; focus visible (2.4.7) on the control surface and on the secondary action; labels or instructions (3.3.2) so the embedded input has a programmatic name; target size (2.5.8) for the secondary action; and name, role, value (4.1.2) for the combobox and its option list. Because the control is a styled container, it must not swallow keyboard focus or remove the focus ring. Never communicate disabled or invalid state through color alone; pair it with the disabled prop semantics and the corresponding ARIA state on the input.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the control, typically landing on the text input or moving on to the secondary action button. |
| `Shift+Tab` | Moves focus backwards out of the control to the previous focusable element. |
| `Enter` | Commits the typed text as a new tag or activates the currently highlighted option in the list. |
| `Space` | Activates the focused secondary action button, or selects the highlighted option in the list. |
| `ArrowDown` | Opens the option list when closed and moves the highlighted option downward when open. |
| `ArrowUp` | Moves the highlighted option upward in the open list. |
| `ArrowLeft` | Moves the caret within the input text, and at the start of the text moves focus to a preceding tag. |
| `ArrowRight` | Moves the caret within the input text, and at the end of the text moves focus to a following tag. |
| `Backspace` | In an empty input, removes the previously selected tag. |
| `Delete` | Removes the currently focused tag, or clears the input text when nothing is selected for removal. |
| `Escape` | Closes the open option list without changing the selection. |
| `Home` | Moves the caret to the beginning of the input text. |
| `End` | Moves the caret to the end of the input text. |

**ARIA**: role, aria-expanded, aria-controls, aria-activedescendant, aria-autocomplete, aria-haspopup, aria-labelledby, aria-label, aria-describedby, aria-invalid, aria-disabled, aria-multiselectable

**Screen Reader**: Screen readers announce the inner text field as a combobox with the accessible name supplied through the label, Field, or aria-labelledby association, along with the current text content and the expanded or collapsed state of the option list. When the list opens, focus stays on the input while aria-activedescendant points at the highlighted option, so the reader announces each option as it is arrowed through; the list itself is exposed as a listbox that reports multiple selection. Tags inside the group are exposed as individual selected entries and are announced when focus moves to them for removal, so removal via Backspace or Delete is spoken as a change to the selection. Disabled state is announced through aria-disabled on the control rather than being conveyed only by the grey border, and invalid state, when applied, is surfaced through aria-invalid. Tag additions and removals are not automatically announced by the control itself; if your flow depends on that feedback, surface it through your own live region messaging.

## Styling

Nearly all of the control's surface styling is token-driven, so start by adjusting tokens rather than raw values. The rest border is drawn from tokens.colorNeutralStroke1 with the default tokens.strokeWidthThin width and tokens.borderRadiusMedium corner radius; hover states use tokens.colorNeutralStroke1Hover and pressed states tokens.colorNeutralStroke1Pressed, while focus typically layers tokens.colorStrokeFocus2 or the brand focus stroke tokens.colorCompoundBrandStroke and tokens.colorBrandStroke1 for the accent ring. Background is tokens.colorNeutralBackground1, with tokens.colorNeutralBackground1Hover for interaction feedback and tokens.colorNeutralBackgroundDisabled plus tokens.colorNeutralForegroundDisabled and tokens.colorNeutralStrokeDisabled for the disabled look. Inner padding is composed from spacing tokens such as tokens.spacingHorizontalSNudge, tokens.spacingHorizontalXS, tokens.spacingVerticalXXS, and the gaps between tags come from tokens.spacingHorizontalXS, so tuning those tokens keeps the control balanced against Tag and InteractionTag. Typography inside inherits tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300, and size variants scale those values. When you pass a style object, prefer overriding width, minWidth, maxWidth, or margin, because overriding border color, radius, or padding directly can desynchronize the control from its children.

## Performance

The control is a lightweight wrapper, so its own render cost is negligible and performance work belongs to what you place inside it. Avoid creating new style objects, new child elements, or new callback closures on every render, because they defeat memoization of the control and force the group and input to re-render on each keystroke. Keep the typed text state local to the input rather than promoting every keystroke into the parent component that owns the selection. Large tag collections are the main layout cost: every tag participates in wrapping and padding calculations, and there is no virtualization for the group, so cap the number of selected tags or move overflow into a summarizing affordance. Each selection commit re-renders the control and its group, which is expected, but rebuilding the entire option list on every keystroke is not; keep the option data stable.

## Theming & Tokens

The control is fully token-driven and responds to FluentProvider theme changes with no extra work. The neutral ramp supplies its borders and background through tokens.colorNeutralStroke1, tokens.colorNeutralStroke1Hover, tokens.colorNeutralStroke1Pressed, tokens.colorNeutralBackground1, tokens.colorNeutralBackground1Hover, and the disabled variants tokens.colorNeutralStrokeDisabled, tokens.colorNeutralBackgroundDisabled, and tokens.colorNeutralForegroundDisabled. Focus and accent treatment come from tokens.colorStrokeFocus2 and the brand ramp, notably tokens.colorBrandStroke1, tokens.colorCompoundBrandStroke, and tokens.colorCompoundBrandStrokeHover, which is what makes the control pick up a custom brand color. Typography and geometry follow tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.lineHeightBase300, tokens.borderRadiusMedium, tokens.strokeWidthThin, and spacing tokens such as tokens.spacingHorizontalSNudge and tokens.spacingVerticalXXS. Size variants inherited from the surrounding picker remap these values, and the control mirrors its padding automatically in RTL layouts.

## Migration Notes

The v9 TagPicker is a compound component rather than the single class-based v8 picker, and TagPickerControl is the piece that replaces the old monolithic input-plus-suggestions surface. Instead of configuring one component with suggestion resolution callbacks and input property bags, v9 splits responsibilities: the control owns the visual shell, TagPickerGroup renders the selected tags, TagPickerInput owns text entry, TagPickerButton in the secondaryAction slot opens the list, and TagPickerList with TagPickerOption replaces the old suggestion rendering. Styling moves from theme palette strings and merge-styles to Griffel with design tokens, and open/close as well as option selection are reported through the onOpenChange and onOptionSelect callbacks on the surrounding picker rather than through render-prop callbacks. Free-form-only fields that previously relied on suppressed suggestion rendering are now expressed with the noPopover prop.

## Edge Cases

- Rendering the control with no children produces an empty bordered surface with nothing to focus, so keep at least a TagPickerGroup or a TagPickerInput inside.
- A disabled control with an enabled secondary action still allows the option list to be opened; keep the disabled state of the control and the trigger in sync.
- Switching noPopover or inline after mount changes the control's composition mid-interaction and can leave focus or the open list in an inconsistent state; treat both as static configuration.
- Hundreds of selected tags cause the control to wrap and grow tall, pushing surrounding layout; constrain maxWidth or limit selection before that point.
- In inline mode inside a flex container, the control can collapse to a very small width if the container has no intrinsic sizing, so give it a minWidth or let it size to content.
- If hasSelectedOptions is false while tags are actually rendered, the control under-reserves space and the input overlaps or crowds the tags.
- In RTL layouts padding and tag order mirror automatically, but custom margins supplied through the style prop do not, so verify any hand-written spacing.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
