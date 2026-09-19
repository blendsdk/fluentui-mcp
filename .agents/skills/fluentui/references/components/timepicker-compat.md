# TimepickerCompat

> **Package**: `@fluentui/react-timepicker-compat` v0.4.35
> **Import**: `import { TimepickerCompat } from '@fluentui/react-timepicker-compat';`
> **Category**: forms
> **Stability**: unstable

## Overview

TimepickerCompat is a form input control from the @fluentui/react-timepicker-compat package that lets users choose or type a time of day. It renders as a text input whose value is a time string, optionally paired with a suggestion dropdown of candidate times that are generated from a configurable hour range. Internally it works with Date objects for selection state, so the component exposes selectedTime and defaultSelectedTime for controlled and uncontrolled usage alongside the typed text value. For freeform entry, it accepts custom formatDateToTimeString and parseTimeStringToDate functions so applications can define exactly how a Date is rendered into text and how user-typed text is interpreted back into a Date. Parsing failures and out-of-range entries are surfaced through the onTimeChange callback's error information, which lets callers drive validation messaging through a surrounding Field. Because time zones, clock formats (12-hour versus 24-hour), and locality conventions vary widely, the component deliberately keeps formatting and parsing pluggable rather than hard-coding a single representation.

**When to use**: Use TimepickerCompat when a form needs a time-of-day value and you want a lightweight text input that can also offer a picklist of valid times. It is the right choice when times must be constrained to a business window (for example scheduling between 10:00 and 20:00), when the picklist should advance in fixed increments such as 15 or 30 minutes, or when users should be able to type a time quickly instead of scrolling a long list. Prefer freeform mode when users must be able to enter any time, including ones outside the generated picklist. Pair it with DatepickerCompat when you need both a calendar date and a time; the TimePicker accepts a dateAnchor so the resulting selection carries the correct calendar day. Avoid it when the value is not really a clock time (use a Select or Combobox of named options instead), when a single free-text string with no parsing expectations is enough (use Input), or when the value is a date rather than a time (use DatepickerCompat alone). It is also a poor fit for durations or elapsed-time entry, since its model is a point in time built from a Date.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `dateAnchor` | `Date` | — | No | — |
| `defaultSelectedTime` | `Date` | — | No | — |
| `endHour` | `Hour` | — | No | — |
| `formatDateToTimeString` | `(date: Date) => string` | — | No | — |
| `increment` | `number` | — | No | — |
| `onTimeChange` | `(event: TimeSelectionEvents, data: TimeSelectionData) => void` | — | No | — |
| `parseTimeStringToDate` | `(time: string \| undefined) => TimeStringValidationResult` | — | No | — |
| `selectedTime` | `Date \| null` | — | No | — |
| `startHour` | `Hour` | — | No | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Field, makeStyles } from '@fluentui/react-components';
import type { TimePickerProps } from '@fluentui/react-timepicker-compat';
import { TimePicker } from '@fluentui/react-timepicker-compat';

export const Default = (props: Partial<TimePickerProps>): JSXElement => {
  const styles = useStyles();
  return (
    <Field label="Coffee time" className={styles.root}>
      <TimePicker {...props} />
    </Field>
  );
};
```

### Clearable

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Field, makeStyles } from '@fluentui/react-components';
import { TimePicker } from '@fluentui/react-timepicker-compat';

export const Clearable = (): JSXElement => {
  const styles = useStyles();

  return (
    <Field label="Coffee time" className={styles.root}>
      <TimePicker clearable />
    </Field>
  );
};

Clearable.parameters = {
  docs: {
    description: {
      story: 'A TimePicker can be clearable and let users remove their selection.',
    },
  },
};
```

### Controlled

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Field, makeStyles } from '@fluentui/react-components';
import type { TimePickerProps } from '@fluentui/react-timepicker-compat';
import { TimePicker, formatDateToTimeString } from '@fluentui/react-timepicker-compat';
import story from './TimePickerControlled.md';

export const Controlled = (): JSXElement => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <DefaultSelection />
      <ControlledSelection />
    </div>
  );
};

Controlled.parameters = {
  docs: {
    description: {
      story,
    },
  },
};
```

## Best Practices

### Do's

- Constrain the picklist to the times that are actually valid in your domain by setting startHour and endHour, and use increment to match the granularity users expect, such as 15 or 30 minutes.
- Wrap the control in Field with a label so the time input has a programmatically associated accessible name, as shown in the Default, Clearable, and FreeformWithErrorHandling stories.
- Choose controlled or uncontrolled deliberately: use defaultSelectedTime for simple uncontrolled forms and selectedTime plus onTimeChange when the value must be lifted into application state or synchronized with another control.
- Turn on freeform when the generated picklist cannot express every legitimate value, and supply formatDateToTimeString and parseTimeStringToDate so the text and the Date model stay in agreement.
- Use onTimeChange's error information to drive Field's validationMessage rather than writing your own error text from scratch, so invalid or empty input is reported consistently with the rest of the form.
- Pass dateAnchor whenever the time is meant to belong to a specific calendar day, and update it when the associated date changes, as the TimePickerWithDatePicker story does.
- Enable clearable only when an empty time is a meaningful state; otherwise leave it off so users cannot accidentally erase a required value.
- Control the input text with value and onInput when you need to echo or reformat what the user types, and keep the text state and the selectedTime state updated from the same onTimeChange callback.

### Don'ts

- Don't render a time input without an adjacent label or accessible name; a bare input gives screen reader users no indication of what value is expected.
- Don't hard-code a 12-hour or 24-hour assumption in your UI copy while relying on the default formatter; if your locale or product requires a specific clock convention, supply an explicit formatDateToTimeString and matching parseTimeStringToDate.
- Don't set startHour and endHour so narrowly that the user's intended time is unreachable and freeform is disabled; either widen the range or allow freeform entry.
- Don't ignore the errorType reported by onTimeChange in freeform mode; silently accepting an unparseable string leaves the control and your form state out of sync.
- Don't mutate the Date instance supplied through selectedTime or dateAnchor; construct a new Date when combining a date with a time, as the TimePickerWithDatePicker story does.
- Don't use TimepickerCompat as a generic dropdown for non-time values; its text parsing and Date model will fight any option set that isn't a clock time.
- Don't rely on the picklist order or default formatting to communicate the accepted format to users; state the expected format in the Field label or an accompanying hint when parsing is strict.

## Accessibility

## See Also

- - [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
