# forms components

## Overview

The forms category covers the Fluent UI React v9 components that capture user input: single-line and multi-line text entry (Input, Textarea, SearchBox), selection controls (Checkbox, Radio with RadioGroup, Switch, Select, Dropdown, Combobox, and Listbox with Option and OptionGroup), numeric and scoring controls (Slider, SpinButton, Rating with RatingItem and the read-only RatingDisplay), multi-value tag entry (TagPicker with TagPickerControl, TagPickerGroup, TagPickerInput, TagPickerButton, TagPickerList, TagPickerOption and TagPickerOptionGroup), colour entry (ColorPicker, ColorArea, ColorSlider, AlphaSlider and the swatch family of ColorSwatch, ImageSwatch, EmptySwatch, SwatchPicker and SwatchPickerRow), and the labelling and help scaffolding shared by all of them (Field, Label, InfoLabel, InfoButton). These components are meant to be composed rather than wrapped in a single form element: Field is the usual composition root that attaches exactly one visible label, an optional hint and a validation message to one control, while each control is a themeable primitive whose state can be controlled through value, checked, selectedValue or color, or left uncontrolled through the matching default props. They deliberately share a common size and appearance vocabulary so a form reads consistently when those choices are made once per surface instead of being restyled component by component.

## When to Use

Reach for this category whenever a person must enter, choose, adjust or confirm data as part of a task: sign-in and profile forms, settings panels, filters, edit dialogs, review and scoring flows, and colour or tag editors. Pick the control from the shape of the answer rather than from visual preference. A single boolean answer is Checkbox or Switch; one choice among a few options that should stay visible is RadioGroup with Radio; one choice from a long static list is Select; one choice that needs search, custom item rendering, a placeholder or clearing is Dropdown or Combobox; free text is Input or Textarea, with SearchBox for query-style entry; a number typed precisely is SpinButton, a number explored or roughly set is Slider, and a score is Rating; many values gathered with autocomplete are TagPicker; colour is the ColorPicker, ColorArea, ColorSlider, AlphaSlider and SwatchPicker family. Use the display-oriented members of the same family (RatingDisplay, ColorSwatch inside a SwatchPicker, a filled ProgressBar-style readout) when the same data is shown rather than edited, so view and edit modes look alike. If a screen only presents data with no way to change it, prefer data-display components over disabled form controls.

## Best Practices

### Do's

- Wrap every control in Field, or in Label, InfoLabel or InfoButton when Field is not a fit, and let that wrapper own the label text, the hint and the validation message so all three stay programmatically tied to the control instead of being nearby free text.
- Use Field's size and orientation together with each control's size, appearance and shape props to set the density of a surface once, and keep that choice consistent across the whole form rather than overriding individual controls.
- Drive validation through Field's validationState with a real message, and mark required answers with the required prop on Field, Label and RadioGroup rather than adding asterisks or coloured label text yourself.
- Choose one state model per control and stay with it: pass value, checked or selectedValue when the form reacts to every change, or defaultValue, defaultChecked and defaultSelectedValue when it does not, but never both on the same control.
- Give options, tags and swatches stable, human-readable values (Option value, TagPickerOption value, ColorSwatch or ImageSwatch value, SwatchPicker selectedValue) because those strings identify the selection in your state and are what assistive technology announces.
- Reach for Checkbox with the mixed checked value for parent and child or partially selected groups instead of simulating a third state with extra controls or custom markup.
- Use InfoLabel when a control needs a short inline explanation and InfoButton for standalone contextual help, and keep Field's hint or validation message for the longer text so the label line stays short.
- Compose the tag entry experience from TagPicker's own parts — TagPickerControl with TagPickerGroup, TagPickerInput, TagPickerButton, TagPickerList, TagPickerOption and TagPickerOptionGroup — so keyboard behaviour, popup handling and the onOptionSelect and onOpenChange contract stay intact.

### Don'ts

- Don't rely on placeholder text as the label; placeholders disappear as soon as people type and are not a dependable accessible name. Use Field or Label for the name and keep placeholder for a format example.
- Don't mix controlled and uncontrolled props on one control, or pass value, checked, selectedValue or color without the matching change handler, because the control will look editable but stop responding.
- Don't hand-roll labels, hints or error text beside a control with plain elements; Field, Label, InfoLabel and InfoButton already supply the required marker, the associations and the correct styling.
- Don't communicate validation, selection or status with colour alone, and don't use a validationState to carry instructions that are not validation — put those in the hint.
- Don't default to Dropdown, Combobox or Listbox when a RadioGroup or a Select would do; the richer controls carry more keyboard rules and more code for the same answer.
- Don't use Switch for choices that should only take effect when the form is submitted; Switch reads as an immediately applied setting, so use Checkbox for pending choices.
- Don't use Rating and RatingDisplay interchangeably: Rating collects a score and RatingDisplay reports one.
- Don't rebuild colour or tag editing out of generic Inputs and Sliders; ColorPicker, ColorArea, ColorSlider, AlphaSlider, SwatchPicker and TagPicker already model channels, selection and removal semantics.

## Anti-Patterns

### Labels, hints and errors held together only by layout

❌ Placing a bare text element next to an Input, Textarea, Dropdown or SpinButton looks correct but leaves the control without an accessible name, drops the required marker, and leaves validation text unassociated so it is never announced when the error appears.

✅ Make Field the composition root for each control, or use Label, InfoLabel and InfoButton where Field is not appropriate, so the label, hint and validation message are bound to the control and the validationState is what changes when the answer becomes invalid.

### Half-controlled state

❌ Passing value, checked or selectedValue without the matching change handler, or combining value with defaultValue on the same control, produces inputs that render but will not update, and the bug usually only shows up in one field of an otherwise working form.

✅ Decide per control whether it is controlled or uncontrolled. Controlled means value, checked, selectedValue or color plus the corresponding onChange, onColorChange, onSelectionChange or onOptionSelect handler; uncontrolled means the default props. Keep the whole form consistent with that decision.

### Colour-only or unattached validation

❌ Red borders and helper text that is not part of the control's description satisfy visual reviewers but leave screen reader users and keyboard users without any indication of what went wrong on a Slider, Checkbox, Rating or TagPicker field.

✅ Route all validation through Field's validationState with an explicit message, and describe the problem in the message text rather than relying on the error colour. Use validationState only for validation, and the hint for instructions.

### Choosing the heaviest selection control by default

❌ Dropdowns and Comboboxes for two or three options, or a Listbox for a short fixed list, add popup management, typeahead and focus rules to a decision that a RadioGroup or Select would handle, and they behave differently from the rest of the form.

✅ Match the control to the answer: RadioGroup with Radio for a few options that should stay visible, Select for a long static list, Checkbox for multiple independent choices, and Dropdown or Combobox only when the list needs search, custom rendering, a placeholder, clearing or freeform entry.

### Switch used as a checkbox

❌ Switch implies an immediate state change that is applied on toggle, so using it for consent or for values that are only committed when the form is submitted misleads people about when the change takes effect, and it hides the submit step.

✅ Use Switch for settings that apply immediately, and Checkbox for choices that are collected and submitted. When an immediate-looking control must still be reachable while disabled, remember Switch's disabledFocusable rather than disabling it outright.

### Hand-built colour and tag editors

❌ Wiring sliders, text inputs and chips together to approximate a colour picker or a tag input loses channel semantics, arrow-key support, removal behaviour and selection state, and it drifts visually from the rest of the product.

✅ Use ColorPicker with ColorArea, ColorSlider and AlphaSlider for continuous colour editing, the ColorSwatch, ImageSwatch, EmptySwatch and SwatchPicker family for presets, and TagPicker with its control, group, input, list and option parts for multi-value entry, so state, keyboard behaviour and announcements come from the design system.

## Accessibility

Every component in this category is expected to sit inside Field, Label or InfoLabel, or to be the child of a Field render function, so the visible label becomes the accessible name and the hint and validation message are announced together with the control; the required prop on Field, Label and RadioGroup expresses requiredness without extra markup. Keyboard behaviour is built in and should not be re-implemented: Space toggles Checkbox and Switch, arrow keys move within a RadioGroup, a Slider, a SpinButton, a Rating, a ColorSlider and a ColorArea, and within Listbox, OptionGroup, SwatchPicker and the popup lists of Select, Dropdown, Combobox and TagPickerList, where focusMode chooses between arrow and tab movement; Enter or Space activates options, swatches and rating items; Escape closes open popups; and TagPickerInput lets people remove the last tag from the keyboard. Never let colour or placeholder text carry meaning on its own: validation must be real text surfaced through Field's validationState, and options, tags, swatches and rating items need human-readable values or an itemLabel so the announced name is not a hex code or a bare number. Keep hit targets and the visible focus indicator intact, make help surfaces such as InfoButton and InfoLabel reachable from the keyboard rather than on hover alone, and remember that disabling removes a control from the tab order and from assistive technology, so disable only when a control is genuinely unavailable.

## Components in this category

- [AlphaSlider](../components/alpha-slider.md)
- [Checkbox](../components/checkbox.md)
- [ColorArea](../components/color-area.md)
- [ColorPicker](../components/color-picker.md)
- [ColorSlider](../components/color-slider.md)
- [ColorSwatch](../components/color-swatch.md)
- [Combobox](../components/combobox.md)
- [Dropdown](../components/dropdown.md)
- [EmptySwatch](../components/empty-swatch.md)
- [Field](../components/field.md)
- [ImageSwatch](../components/image-swatch.md)
- [InfoButton](../components/info-button.md)
- [InfoLabel](../components/info-label.md)
- [Input](../components/input.md)
- [Label](../components/label.md)
- [Listbox](../components/listbox.md)
- [Option](../components/option.md)
- [OptionGroup](../components/option-group.md)
- [Radio](../components/radio.md)
- [RadioGroup](../components/radio-group.md)
- [Rating](../components/rating.md)
- [RatingDisplay](../components/rating-display.md)
- [RatingItem](../components/rating-item.md)
- [SearchBox](../components/search-box.md)
- [Select](../components/select.md)
- [Slider](../components/slider.md)
- [SpinButton](../components/spin-button.md)
- [SwatchPicker](../components/swatch-picker.md)
- [SwatchPickerRow](../components/swatch-picker-row.md)
- [Switch](../components/switch.md)
- [TagPicker](../components/tag-picker.md)
- [TagPickerButton](../components/tag-picker-button.md)
- [TagPickerControl](../components/tag-picker-control.md)
- [TagPickerGroup](../components/tag-picker-group.md)
- [TagPickerInput](../components/tag-picker-input.md)
- [TagPickerList](../components/tag-picker-list.md)
- [TagPickerOption](../components/tag-picker-option.md)
- [TagPickerOptionGroup](../components/tag-picker-option-group.md)
- [Textarea](../components/textarea.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
