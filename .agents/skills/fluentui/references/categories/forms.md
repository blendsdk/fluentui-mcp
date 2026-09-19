# forms components

## Overview

Forms is the category of Fluent components that capture, constrain, and validate user input. It covers text entry with Input and Textarea; choice with Select, Combobox, Checkbox, Radio, Switch, TagPicker, SwatchPicker, and ColorPicker; numeric and scale input with Slider, Spinbutton, and Rating; date and time selection with DatepickerCompat, TimepickerCompat, and CalendarCompat; and query entry with Search. These controls are supported by Field, Label, and Infolabel, which supply the visible label, required marker, hint, and validation message that every input needs in order to be understandable and operable.

## When to Use

Reach for forms components whenever a person must supply or edit data that the product will store, filter by, or submit: settings and preference panels, filters, onboarding and wizard steps, profile editors, dialogs and drawers that gate a confirm action, and inline editing surfaces. Choose the control by the shape of the answer rather than by visual preference. A short structured value is an Input with an appropriate type; a long free-form value is a Textarea; a few mutually exclusive options that should stay visible are a Radio group; a longer but still fixed exclusive list is a Select; an exclusive list that must be filtered, or that accepts custom values, is a Combobox; independent options are Checkboxes; a setting that takes effect immediately is a Switch; multiple tokenized values are a TagPicker; an approximate number in a range is a Slider; an exact number is a Spinbutton; a small ordered scale is a Rating; a date or time is a DatepickerCompat or TimepickerCompat, with CalendarCompat when an inline calendar grid is required; a color from a preset palette is a SwatchPicker and an arbitrary color is a ColorPicker; a query is a Search. Wrap each control in a Field, and reserve Label for labels you place yourself and Infolabel for labels that need extra explanation. When content is read-only, use display components such as Text or Table instead of disabling form controls.

## Best Practices

### Do's

- Wrap every form control in a Field so the control, its label, hint, and validation message share one accessible and visual structure, and set Field's orientation, size, required, and validationState deliberately rather than styling those concerns ad hoc.
- Match the control to the answer's shape: Input with a suitable type for short text, Textarea for long text, Radio for a few exclusive options that should remain visible, Select for a compact exclusive list, Combobox when the list must be filtered or accept freeform entry, Checkbox for independent options, Switch for an immediate on/off setting, Slider for a range, Spinbutton for a precise number, Rating for a small scale, DatepickerCompat and TimepickerCompat for dates and times, SwatchPicker and ColorPicker for colors, and TagPicker for multiple tokens.
- Keep controlled and uncontrolled usage consistent across the form: supply value or checked together with onChange when the form owns the state, or defaultValue, defaultChecked, selectedValue, or defaultSelectedValue for initial state, but never both on the same control.
- Constrain numeric input with min, max, and step on Slider and Spinbutton, and add precision on Spinbutton so users cannot submit values the form cannot accept; use displayValue when the visible number is formatted differently from the stored value.
- Route errors, warnings, and successes through Field's validationState together with the validationMessage slot and, when appropriate, the validationMessageIcon slot, and keep the message text actionable instead of restating the control's name.
- Configure pickers with the props that tie them to real dates, times, and locales: DatepickerCompat's minDate, maxDate, firstDayOfWeek, showWeekNumbers, showGoToToday, formatDate, parseDateFromString, and strings; TimepickerCompat's startHour, endHour, increment, dateAnchor, formatDateToTimeString, and parseTimeStringToDate; and CalendarCompat's strings and navigationIcons.
- Keep Field, Label, and the control aligned in size and state by using Field's size and orientation, Label's size, weight, required, and disabled, and the control's own size and appearance props consistently within a form.
- Use Infolabel's info and popover props when a label needs supporting context, and reserve the label text itself for the field name so the control keeps a short, stable accessible name.
- Open pickers and combo lists through their own open and onOpenChange semantics, and return focus to the input when they close so keyboard users are never stranded.

### Don'ts

- Don't ship a bare Input, Textarea, Select, or Combobox without a Field or Label; placeholder text is not a label, disappears as soon as typing begins, and cannot carry the required state.
- Don't use Checkbox for mutually exclusive choices, Radio for an independent on/off option, or Switch for a value that must be validated and submitted; those controls announce different semantics and users will misread what will be saved.
- Don't use Select for long or searchable lists, don't use Combobox with freeform when a plain Input would be clearer, and don't use TagPicker for a single value.
- Don't use a Slider when users must enter an exact number, and don't use a Spinbutton for a wide approximate range; the drag and typing interactions lead to very different accuracy.
- Don't set value and defaultValue, or checked and defaultChecked, on the same control, and don't switch a control between controlled and uncontrolled modes while the form is mounted.
- Don't encode validation state in color alone; always pair Field's validationState with a validation message and any needed validationMessageIcon text so the error is not silent to assistive tech or color-blind users.
- Don't use disabled Input, Select, Switch, or Spinbutton to present read-only values; read-only data belongs in display components such as Text or Table, and when an inactive control must stay reachable use disabledFocusable where the API offers it, such as Switch.
- Don't perform string surgery on dates and times or parse picker values in application code; use DatepickerCompat's formatDate and parseDateFromString, TimepickerCompat's formatDateToTimeString and parseTimeStringToDate, and CalendarCompat's strings and navigationIcons instead, and don't leave those props unspecified.
- Don't put query or search behavior on a generic Input when Search exists, and don't use Search for data entry that is not a query.

## Anti-Patterns

### Using placeholder text as the field label

❌ When the placeholder names the field, the name vanishes as soon as the user types, is often low contrast, and is not reliably announced as the control's label, so users lose track of what they are editing.

✅ Give each control a Field with a label slot, or pair it with a Label, keep the placeholder for a short format example, and move longer guidance into Field's hint slot or Infolabel's info and popover props.

### Bespoke validation on every control

❌ Rendering custom error text, icons, and colors next to individual inputs produces inconsistent messaging that is not associated with the control and drifts as the form grows.

✅ Standardize on Field's validationState, validationMessage, validationMessageIcon, and hint slots, choosing error, warning, success, or none, so the message, icon, and required marker stay consistent across the whole form.

### Semantic mismatch in choice controls

❌ Checkbox used for exclusive options, Radio used for a single independent toggle, or Switch used for a value that needs validation and submission all communicate the wrong model to users and to assistive technology.

✅ Use Radio with a Field for a few exclusive options, Select or Combobox for compact or searchable exclusive lists, Checkbox for independent options, Switch for settings that apply immediately, and TagPicker when several tokenized values are allowed.

### Swapping range and precision controls

❌ A Slider makes exact entry slow and error-prone, while a Spinbutton is poor for wide approximate ranges; choosing by visual weight rather than by the accuracy the answer needs frustrates users.

✅ Use Slider with min, max, and step for approximate values in a range, and Spinbutton with min, max, step, stepPage, and precision when the exact number matters.

### Hand-rolling date and time entry

❌ Building date or time entry from raw inputs and parsing strings in application code duplicates locale, range, and validation logic and typically produces untranslated picker navigation and unreadable values.

✅ Use DatepickerCompat and TimepickerCompat with their formatting, parsing, range, and strings props, and when an inline calendar is required use CalendarCompat with its strings and navigationIcons so navigation is labeled.

### Mixing controlled and uncontrolled input state

❌ Setting value and defaultValue, or checked and defaultChecked, on the same control, or switching modes while the form is mounted, produces stale UI, lost keystrokes, and warnings that are hard to trace.

✅ Decide whether the form or the control owns the state, then use value or checked with onChange for controlled fields, or defaultValue, defaultChecked, selectedValue, and defaultSelectedValue for uncontrolled fields, and keep that choice stable.

### Disabling controls to display read-only data

❌ A disabled Input, Select, Switch, or Spinbutton looks like an editable field that the user cannot reach; disabled controls are skipped by keyboard users and can be missed by assistive technology, so the information is effectively hidden.

✅ Present read-only values with display components such as Text or Table, and when a control must appear inactive but remain reachable, use disabledFocusable where the API provides it, such as Switch.

## Accessibility

Every control in this category must have a programmatic name and a visible label; Field's label slot or a Label provides that, and placeholder text must never be the only identifier. Field's required and Label's required props must be set so the required state is announced rather than only drawn as an asterisk, and Field's validationState plus the validationMessage slot, with the optional validationMessageIcon slot, must carry error, warning, and success text so assistive tech associates the message with the control. Keep label adjacency and reading order intact by using labelPosition on Checkbox, Radio, and Switch and orientation on Field, so the label is read before the control where that is expected. Numeric controls must expose meaningful limits and increments: set min, max, and step, add precision on Spinbutton, and use displayValue when the visible number is formatted. Pickers need their locale plumbing: strings, firstDayOfWeek, showWeekNumbers, formatDate, and parseDateFromString on DatepickerCompat; formatDateToTimeString and parseTimeStringToDate on TimepickerCompat; and strings plus navigationIcons on CalendarCompat so grid navigation and date labels are readable. When a picker opens a popup, manage open and onOpenChange and return focus to the triggering control on close, and use disableAutoFocus for predictable text entry when the picker must not steal focus. For SwatchPicker and ColorPicker, indicate selection with more than hue and supply selectedValue and onSelectionChange so the chosen color is announced. Finally, Provider's dir prop governs reading direction for every field, so verify label placement, Select's icon, and Input's contentBefore and contentAfter slots in right-to-left layouts.

## Components in this category

- [CalendarCompat](../components/calendar-compat.md)
- [Checkbox](../components/checkbox.md)
- [ColorPicker](../components/color-picker.md)
- [Combobox](../components/combobox.md)
- [DatepickerCompat](../components/datepicker-compat.md)
- [Field](../components/field.md)
- [Infolabel](../components/infolabel.md)
- [Input](../components/input.md)
- [Label](../components/label.md)
- [Radio](../components/radio.md)
- [Rating](../components/rating.md)
- [Search](../components/search.md)
- [Select](../components/select.md)
- [Slider](../components/slider.md)
- [Spinbutton](../components/spinbutton.md)
- [SwatchPicker](../components/swatch-picker.md)
- [Switch](../components/switch.md)
- [TagPicker](../components/tag-picker.md)
- [Textarea](../components/textarea.md)
- [TimepickerCompat](../components/timepicker-compat.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
