# DatepickerCompat

> **Package**: `@fluentui/react-datepicker-compat` v0.6.32
> **Import**: `import { DatepickerCompat } from '@fluentui/react-datepicker-compat';`
> **Category**: forms
> **Stability**: unstable

## Overview

DatepickerCompat is the Fluent UI React v9 compatibility date picker, published from @fluentui/react-datepicker-compat and used in examples as DatePicker. It combines a single-line text input with a popup calendar so users can either type a date or pick one from a month grid, a month picker, or a week-oriented selection surface. The component supports date boundaries through minDate and maxDate, validation feedback through onValidationResult, full localization through strings, and customizable display/parsing through formatDate and parseDateFromString. Because it is a compat package, it keeps the richer v8-era feature set (month picker overlays, week numbers, work-week ranges, go-to-today, underlined and borderless variants) while being consumable from a v9 app alongside Field, Label, Button, and the rest of @fluentui/react-components. Its popup layer is configurable through open/defaultOpen/onOpenChange for controlled and uncontrolled usage, and through inlinePopup and positioning for layout-sensitive scenarios.

**When to use**: Use DatepickerCompat when a user must enter or choose a single calendar date and you need the compat feature set: month picker overlays, week numbers, configurable first day of week and first week of year, work-week or week range selection, custom date formatting and parsing, and built-in validation of out-of-bounds or malformed input. Prefer this component over a plain Input whenever the value has date semantics, because the popup calendar removes ambiguity and enforces boundaries. Reach for the standalone CalendarCompat (or a permanently visible calendar) when the date surface should always be on screen, for example on a scheduling dashboard, and reach for TimepickerCompat (often paired with this picker) when you also need a time-of-day selection. Use the compat package rather than a hypothetical v9-native picker when you are migrating an existing v8 experience and want to preserve its exact strings, error messages, and picker behavior. For a range of dates rather than a single date, configure the picker's calendar range type or use a dedicated range surface instead of stringing two pickers together.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `allFocusable` | `boolean` | — | No | — |
| `allowTextInput` | `boolean` | — | No | — |
| `borderless` | `boolean` | — | No | — |
| `dateTimeFormatter` | `DateFormatting` | — | No | — |
| `defaultOpen` | `boolean` | — | No | — |
| `disableAutoFocus` | `boolean` | — | No | — |
| `disabled` | `boolean` | — | No | — |
| `firstDayOfWeek` | `DayOfWeek` | — | No | — |
| `firstWeekOfYear` | `FirstWeekOfYear` | — | No | — |
| `formatDate` | `(date?: Date) => string` | — | No | — |
| `highlightCurrentMonth` | `boolean` | — | No | — |
| `highlightSelectedMonth` | `boolean` | — | No | — |
| `initialPickerDate` | `Date` | — | No | — |
| `inlinePopup` | `boolean` | — | No | — |
| `isMonthPickerVisible` | `boolean` | — | No | — |
| `maxDate` | `Date` | — | No | — |
| `minDate` | `Date` | — | No | — |
| `onOpenChange` | `(open: boolean) => void` | — | No | — |
| `onSelectDate` | `(date: Date \| null \| undefined) => void` | — | No | — |
| `onValidationResult` | `(data: DatePickerValidationResultData) => void` | — | No | — |
| `open` | `boolean` | — | No | — |
| `openOnClick` | `boolean` | — | No | — |
| `parseDateFromString` | `(dateStr: string) => Date \| null` | — | No | — |
| `placeholder` | `string` | — | No | — |
| `positioning` | `PositioningProps` | — | No | — |
| `required` | `boolean` | — | No | — |
| `showCloseButton` | `boolean` | — | No | — |
| `showGoToToday` | `boolean` | — | No | — |
| `showMonthPickerAsOverlay` | `boolean` | — | No | — |
| `showWeekNumbers` | `boolean` | — | No | — |
| `strings` | `CalendarStrings` | — | No | — |
| `today` | `Date` | — | No | — |
| `underlined` | `boolean` | — | No | — |
| `value` | `Date \| null` | — | No | — |

### Prop Guidance

- **value**: The controlled selected date. Pass null (not undefined) to express 'cleared', because undefined means the picker is uncontrolled; the controlled story relies on this distinction. `new Date(2024, 4, 20)`
- **onSelectDate**: Called with the chosen or typed date, or with null when the selection is cleared. Use it together with value to keep selection in application state. `date => setSelectedDate(date)`
- **open**: Controlled popup visibility. Pair it with onOpenChange or the popup can never be dismissed by the user. `true`
- **defaultOpen**: Uncontrolled initial popup visibility for scenarios where the calendar should already be expanded when the user arrives. `true`
- **onOpenChange**: Notifies you when the popup opens or closes, useful for triggering validation, analytics, or focus restoration when the user dismisses the calendar. `isOpen => setIsOpen(isOpen)`
- **openOnClick**: Opens the calendar when the input is clicked instead of requiring the calendar affordance or the Enter key; helpful for mouse-first flows. `true`
- **inlinePopup**: Renders the calendar in normal flow next to the input rather than in a portal layer, which prevents clipping inside dialogs, drawers, or overflow-hidden containers. `true`
- **positioning**: PositioningProps forwarded to the popup for placement, alignment, offset, and collision handling when the default below-input placement does not fit. `{ position: 'below', align: 'start' }`
- **disableAutoFocus**: Stops focus from moving into the calendar when it opens, for surfaces that own focus management themselves. `true`
- **allowTextInput**: Lets the user type a date instead of only picking one. Per the text input story, clicking opens the picker and clicking again dismisses it to allow typing, while tabbing in allows text entry with Enter opening the picker. Always pair it with onValidationResult. `true`
- **formatDate**: Formats the selected date into the string shown in the input. Keep the format consistent with the placeholder and with parseDateFromString so users can round-trip what they read. `date => date?.toLocaleDateString() ?? ''`
- **parseDateFromString**: Converts typed text back into a Date. Because formats can be ambiguous, the control avoids re-parsing the displayed strings of dates chosen through the UI when text input is enabled, as the custom formatting story explains. `str => myParser(str)`
- **dateTimeFormatter**: A DateFormatting object for date and time formatting used by the picker, an alternative to supplying formatDate for broader formatting control. `customFormatter`
- **placeholder**: Hint text inside the empty input. It must not replace a Field label, and it should be localized whenever strings is localized. `Select a date...`
- **disabled**: Renders the picker non-interactive and removed from the focus order, as shown in the disabled story; use it for read-only historical data rather than for temporarily invalid states. `true`
- **required**: Marks the picker as required; combined with a required Field, validation fires when the picker loses focus, per the required story. `true`
- **underlined**: Switches the input to an underline-only visual treatment for inline or form-like compositions where a full boxed control would be too heavy. `true`
- **borderless**: Removes the input border and background so the picker blends into a custom container such as a data grid cell or a toolbar. `true`
- **minDate**: Earliest selectable date. Out-of-bounds dates cannot be picked or entered, and violations are surfaced through onValidationResult. `new Date(2024, 0, 1)`
- **maxDate**: Latest selectable date. Pair it with minDate so the calendar clearly communicates the legal window. `new Date(2024, 11, 31)`
- **initialPickerDate**: The date the calendar opens to when no value is selected; use it to start the grid near the user's likely answer instead of always today. `new Date(2024, 5, 15)`
- **today**: Overrides which date the picker treats as today, which keeps snapshots, tests, and server-rendered output deterministic. `new Date(2024, 4, 20)`
- **firstDayOfWeek**: Sets the first column of the calendar grid using DayOfWeek, as demonstrated by the first day of the week story. Match the regional convention of your audience. `DayOfWeek.Monday`
- **firstWeekOfYear**: Determines how week numbers are calculated when week numbers are shown, for example whether the first week must contain January 1 or the first Thursday. `FirstWeekOfYear.FirstFourDayWeek`
- **showWeekNumbers**: Adds a week-number column to the left of the calendar grid, useful for planning and reporting workflows. `true`
- **showGoToToday**: Displays the affordance that jumps the calendar back to the current month or date, valuable when users navigate far from today. `true`
- **highlightCurrentMonth**: Emphasizes the current month inside the month picker so users can orient themselves at a glance. `true`
- **highlightSelectedMonth**: Emphasizes the month that contains the selected date in the month picker, keeping picker state and selection visually linked. `true`
- **isMonthPickerVisible**: Shows the month picker so users can jump several months at once instead of stepping through the day grid. `true`
- **showMonthPickerAsOverlay**: Renders the month picker as an overlay on top of the day grid rather than replacing it, which keeps the current month visible while browsing, as in the week numbers story. `true`
- **showCloseButton**: Adds an explicit close control inside the calendar for pointer users; keep it available when the popup is controlled with open. `true`
- **allFocusable**: Controls whether every day cell participates in focus navigation rather than only the selected/current day, affecting how many Tab stops the grid contains. `true`
- **strings**: CalendarStrings used to localize month names, day names, and the calendar's own labels. Base your object on defaultDatePickerStrings so newly added strings stay translated. `{ ...defaultDatePickerStrings, ...localizedStrings }`
- **onValidationResult**: Receives DatePickerValidationResultData when the entered or picked date is invalid (for example required-but-empty or out of bounds). Feed its error field to Field validationMessage, optionally mapping it through defaultDatePickerErrorStrings. `data => setError(data.error)`

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { Field, makeStyles } from '@fluentui/react-components';
import type { DatePickerProps } from '@fluentui/react-datepicker-compat';

export const Default = (props: Partial<DatePickerProps>): JSXElement => {
  const styles = useStyles();

  return (
    <Field label="Select a date">
      <DatePicker className={styles.control} placeholder="Select a date..." {...props} />
    </Field>
  );
};
```

### Controlled

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { addDays } from '@fluentui/react-calendar-compat';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { AriaLiveAnnouncer, Button, Field, makeStyles, useAnnounce } from '@fluentui/react-components';

export const Controlled = (): JSXElement => {
  const styles = useStyles();
  const { announce } = useAnnounce();

  const [selectedDate, setSelectedDate] = React.useState<Date | null | undefined>(null);

  const goPrevious = React.useCallback(() => {
    setSelectedDate(prevSelectedDate => {
      const newDate = prevSelectedDate ? addDays(prevSelectedDate, -1) : new Date();
      announce(newDate.toDateString());
      return newDate;
    });
  }, [announce]);

  const goNext = React.useCallback(() => {
    setSelectedDate(prevSelectedDate => {
      const newDate = prevSelectedDate ? addDays(prevSelectedDate, 1) : new Date();
      announce(newDate.toDateString());
      return newDate;
    });
  }, [announce]);

  return (
    <AriaLiveAnnouncer>
      <div className={styles.root}>
        <Field label="Select a date">
          <DatePicker
            value={selectedDate}
            onSelectDate={setSelectedDate}
            placeholder="Select a date..."
            className={styles.control}
          />
        </Field>
        <div>
          <Button className={styles.button} onClick={goPrevious}>
            Previous
          </Button>
          <Button className={styles.button} onClick={goNext}>
            Next
          </Button>
        </div>
      </div>
    </AriaLiveAnnouncer>
  );
};

Controlled.parameters = {
  docs: {
    description: {
      story:
        'A DatePicker can be controlled by manually keeping track of the state and updating it. When controlled,' +
        ' the value prop should use null instead of undefined to clear the value of the DatePicker.',
    },
  },
};
```

### CustomDateFormatting

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Button, Field, makeStyles } from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';

export const CustomDateFormatting = (): JSXElement => {
  const styles = useStyles();

  const [value, setValue] = React.useState<Date | null | undefined>(null);
  const datePickerRef = React.useRef<HTMLInputElement>(null);

  const onClick = React.useCallback((): void => {
    setValue(null);
    datePickerRef.current?.focus();
  }, []);

  const onParseDateFromString = React.useCallback(
    (newValue: string): Date => {
      const previousValue = value || new Date();
      const newValueParts = (newValue || '').trim().split('/');
      const day =
        newValueParts.length > 0 ? Math.max(1, Math.min(31, parseInt(newValueParts[0], 10))) : previousValue.getDate();
      const month =
        newValueParts.length > 1
          ? Math.max(1, Math.min(12, parseInt(newValueParts[1], 10))) - 1
          : previousValue.getMonth();
      let year = newValueParts.length > 2 ? parseInt(newValueParts[2], 10) : previousValue.getFullYear();
      if (year < 100) {
        year += previousValue.getFullYear() - (previousValue.getFullYear() % 100);
      }
      return new Date(year, month, day);
    },
    [value],
  );

  return (
    <div className={styles.root}>
      <Field label="Select a date. Input format is day slash month slash year.">
        <DatePicker
          ref={datePickerRef}
          allowTextInput
          value={value}
          onSelectDate={setValue as (date?: Date | null) => void}
          formatDate={onFormatDate}
          parseDateFromString={onParseDateFromString}
          placeholder="Select a date..."
          className={styles.control}
        />
      </Field>
      <div>
        <Button onClick={onClick} className={styles.clearButton}>
          Clear
        </Button>
        <div>Selected date: {(value || '').toString()}</div>
      </div>
    </div>
  );
};

CustomDateFormatting.parameters = {
  docs: {
    description: {
      story:
        'Applications can customize how dates are formatted and parsed. Formatted dates can be ambiguous, so the' +
        ' control will avoid parsing the formatted strings of dates selected using the UI when text input is allowed.' +
        ' In this example, we are formatting and parsing dates as dd/MM/yy.',
    },
  },
};
```

## Best Practices

### Do's

- Always wrap the picker in a Field with a visible label so the input receives a programmatic label and validation wiring, as every example story does.
- Set minDate and maxDate whenever the surrounding workflow has legal date boundaries, so out-of-bounds dates cannot be picked or typed.
- Wire onValidationResult together with Field validationMessage and defaultDatePickerErrorStrings so invalid or out-of-bounds entries produce a readable message.
- Keep the value prop controlled when the application needs to know the selection immediately, and clear it with null rather than undefined as the controlled story documents.
- Provide a stable today value (or a stable formatDate and parseDateFromString pair) when rendering in tests or server-rendered environments to avoid hydration and snapshot drift.
- Supply strings (built from defaultDatePickerStrings) together with a matching placeholder and formatDate when localizing, so the calendar, input text, and error strings all speak the same language.
- Prefer allowTextInput together with a custom parseDateFromString when users are expected to be fast typists, and always pair it with onValidationResult.
- Use disableAutoFocus when the picker opens inside a surface where stealing focus would be disruptive, such as a wizard step that manages focus itself.

### Don'ts

- Do not use the picker as a free-form text field: without allowTextInput the input is a read-only date display, and with allowTextInput you must still supply parsing and validation.
- Do not leave both minDate and maxDate unset when the downstream system rejects certain dates; the picker will happily accept them.
- Do not pass a fresh object or inline function for strings, dateTimeFormatter, or formatDate on every render if you can avoid it; keep these references stable.
- Do not set required on the picker while omitting the label and required indication on the surrounding Field; users need to see why the field is invalid.
- Do not clear a controlled value with undefined; use null so the picker and the calendar agree that nothing is selected.
- Do not assume formatted strings are round-trippable when allowTextInput is enabled, because the control deliberately avoids re-parsing displayed values that came from UI selection when a custom format is ambiguous.
- Do not leave the popup open with open while ignoring onOpenChange; the user will have no way to dismiss it.
- Do not nest the picker inside a container that clips overflow without considering inlinePopup, or the calendar popup can be cut off.

## Anti-Patterns

### Treating the picker as an uncontrolled text field

❌ Applications often read the raw input text instead of tracking value and onSelectDate, which breaks whenever the user picks a date from the calendar or the display format changes.

✅ Track the selection in state through value and onSelectDate, and only enable allowTextInput when you also supply parseDateFromString and onValidationResult so typed text becomes a real Date.

### Clearing a controlled value with undefined

❌ Passing undefined makes the picker fall back to uncontrolled behavior and the cleared state is silently ignored, so the previously selected date can reappear.

✅ Use null to clear a controlled value, exactly as the controlled story documents, and keep the state type as Date or null.

### Ignoring out-of-bounds input

❌ Setting minDate and maxDate blocks out-of-bounds selection in the calendar, but typed input and required-but-empty submissions still need to be reported, and users get no explanation if nothing listens.

✅ Handle onValidationResult and surface the resulting error through Field validationMessage, mapping the error code with defaultDatePickerErrorStrings for a consistent message.

### Fresh strings or format functions on every render

❌ Passing newly created strings, dateTimeFormatter, formatDate, or parseDateFromString objects on each render forces the calendar and input to re-derive labels and formatting, which is wasteful and can cause flicker in the grid.

✅ Hoist locale objects, formatters, and parsers to module scope or memoize them with useCallback and useMemo so their identity is stable across renders.

### Relying on the placeholder as the label

❌ Placeholder text disappears once a value is set, so users lose the field's meaning, and assistive technology never receives a persistent accessible name.

✅ Always render a Field label (or provide aria-label) and treat placeholder as a supplementary hint only, keeping it localized alongside strings.

### Forcing the popup into overflowing containers

❌ In dialogs, drawers, or scroll containers with clipped overflow, a portaled popup calendar can be cut off or positioned off screen.

✅ Use inlinePopup to render the calendar in normal flow, or tune the positioning prop for placement and collision handling in constrained layouts.

## Accessibility

**Requirements**: The input must have an accessible name: use a Field label or an explicit aria-label. When the picker can be empty but the workflow requires a value, mark the Field required so assistive technology announces the requirement, and expose validation state through Field validationMessage so it is announced with the input rather than as a separate unrelated message. Placeholder text is a hint and never a substitute for a label. Ensure color contrast for the popup calendar, the selected day, and disabled dates meets WCAG AA, and ensure the popup can be dismissed without a pointer. The required validation described in the Required story fires when the control loses focus, so keep focus movement predictable so the user receives the message in a sensible order.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the date input from the previous control; per the text input story, tabbing into the field allows text entry by default. |
| `Shift+Tab` | Moves focus out of the input backwards to the previous focusable element, leaving the picker. |
| `Enter` | While the input is focused, opens the date picker popup; when the calendar is open it activates the focused day, month, or the close button. |
| `Space` | Activates the focused button inside the popup, such as the go-to-today or close affordances. |
| `Escape` | Dismisses the popup calendar and returns focus to the input without committing a new date. |
| `Arrow keys` | Move focus between adjacent days inside the calendar grid, and between options when the month picker overlay is shown. |
| `Home / End` | Move focus to the first or last day of the current week row in the calendar grid. |
| `Page Up / Page Down` | Move the calendar grid to the previous or next month while keeping a comparable day focused. |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-required, aria-invalid, aria-live (through AriaLiveAnnouncer and useAnnounce when announcing date changes)

**Screen Reader**: Screen readers encounter a text input with a name supplied by the surrounding Field label (or an explicit aria-label) and a description supplied by helper text and the Field validationMessage, so the error reported by onValidationResult is read alongside the control. Days in the popup calendar are announced with their full date rather than only a number, and the currently selected and today's date are conveyed as state rather than only through color. When the application updates the selection programmatically, as in the controlled story, dates are announced explicitly through the AriaLiveAnnouncer with useAnnounce, which is the recommended way to communicate adjacent-day navigation performed by separate Previous and Next buttons. Because required validation runs on blur, the validation message is announced after the user leaves the field, so avoid moving focus programmatically at the same moment.

## Styling

The picker renders a native text input inside a wrapper, so styling starts from the className you pass and from descendant selectors in makeStyles; there is no slot-based styling surface, so target the element through the class you provide. Common customizations are width (a fixed inline size such as a control width class keeps the calendar popup aligned to the input), removing chrome with borderless or underlined for toolbar and inline-edit contexts, and adjusting the popup surface through positioning. Use Griffel tokens rather than raw values: tokens.colorNeutralBackground1 and tokens.colorNeutralBackground1Hover for the input and popup surface, tokens.colorNeutralStroke1 and tokens.colorNeutralStroke1Hover for the resting and hovered border, tokens.colorNeutralStrokeAccessible for the focus-visible boundary, tokens.colorNeutralForeground1 for typed text, tokens.colorNeutralForeground3 and tokens.colorNeutralForeground4 for the placeholder, tokens.colorNeutralForegroundDisabled with tokens.colorNeutralBackgroundDisabled and tokens.colorNeutralStrokeDisabled for the disabled story, tokens.borderRadiusMedium for the input corner and tokens.borderRadiusLarge for the popup, tokens.spacingHorizontalM and tokens.spacingVerticalS for interior padding, tokens.fontFamilyBase with tokens.fontSizeBase300 and tokens.lineHeightBase300 for the value text, and tokens.shadow8 or tokens.shadow16 for the floating popup layer. Selected days and the today affordance should use brand tokens such as tokens.colorBrandBackground, tokens.colorBrandForeground1, and tokens.colorCompoundBrandStroke so they inherit theme changes, and error styling should come from the Field validationMessage rather than ad hoc red text so it tracks the error theme.

## Performance

The calendar surface is only rendered while the popup is open, so keeping open and defaultOpen closed by default avoids mounting a month grid for every field on a form. Because the component re-derives day labels and formatting from strings, formatDate, dateTimeFormatter, and today, keeping those references stable prevents unnecessary work in the grid; inline arrow functions recreate the label arrays on each render. The picker is a single controlled input plus a popup, so it does not add virtualization concerns even for large forms, but avoid updating a controlled value on every keystroke when allowTextInput is enabled, since that re-renders the whole field on each character. When several pickers appear in a list, do not share a single open state, and consider lazy-opening the calendar only on user interaction rather than defaulting defaultOpen for every row.

## Theming & Tokens

DatepickerCompat consumes Fluent design tokens from the active theme, so switching between light, dark, and high-contrast themes requires no prop changes. The input chrome uses tokens.colorNeutralBackground1 with tokens.colorNeutralStroke1, hover shifts to tokens.colorNeutralStroke1Hover and tokens.colorNeutralBackground1Hover, and the focus-visible boundary uses tokens.colorNeutralStrokeAccessible. Text color comes from tokens.colorNeutralForeground1, the placeholder from tokens.colorNeutralForeground3 and tokens.colorNeutralForeground4, and disabled fields from tokens.colorNeutralForegroundDisabled, tokens.colorNeutralBackgroundDisabled, and tokens.colorNeutralStrokeDisabled, matching the disabled story. The floating calendar popup uses a surface token such as tokens.colorNeutralBackground1 with tokens.shadow8 or tokens.shadow16 and tokens.borderRadiusLarge, while day cells, the selected date, and the today indication use brand tokens including tokens.colorBrandBackground, tokens.colorBrandForeground1, and tokens.colorCompoundBrandStroke. Spacing and typography inside the grid follow tokens.spacingHorizontalS, tokens.spacingVerticalXS, tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300. The required and error presentation flows from Field, so validation colors come from the Field validation tokens rather than being hard-coded.

## Migration Notes

DatepickerCompat preserves the v8 DatePicker behavioral surface but is consumed from @fluentui/react-datepicker-compat and exported in examples as DatePicker, so imports change from the v8 package to the compat package while props such as allowTextInput, isMonthPickerVisible, showMonthPickerAsOverlay, showWeekNumbers, firstWeekOfYear, and showGoToToday keep working. Localization defaults are available as defaultDatePickerStrings and validation defaults as defaultDatePickerErrorStrings, both importable from the compat package, replacing the older pattern of hand-authoring a strings object. Styling moves from styled/IStyleFunction customization to Griffel classes passed through className and makeStyles, with themed values coming from tokens.* instead of theme palette lookups. Popup configuration that used v8 callout customization is expressed through the positioning prop and the inlinePopup flag, and the popup can be controlled with open, defaultOpen, and onOpenChange. Helper date math such as addDays, addMonths, and addYears now comes from @fluentui/react-calendar-compat alongside DayOfWeek, FirstWeekOfYear, and DateRangeType.

## Edge Cases

- For a controlled picker, null and undefined are not interchangeable: undefined means uncontrolled, while null clears the selection, as called out in the controlled story description.
- When allowTextInput is enabled together with a custom formatDate, the control avoids parsing the formatted strings of dates that were selected through the UI, because a custom format such as day slash month slash year is ambiguous; typed text still goes through parseDateFromString.
- Required validation only runs when the picker loses focus, so a form submitted without blurring the field can appear valid until the focus change happens.
- Out-of-bounds values supplied by minDate and maxDate are rejected both for picking and for typing, and the failure is only visible if you handle onValidationResult and render the message through Field.
- The picker binds to JavaScript Date objects in the local time zone, so date-only values can shift by a day if the surrounding application serializes them as UTC.
- Providing the today prop changes both the highlighted today indicator and what the go-to-today affordance targets, which is the supported way to make snapshots and tests deterministic.
- The selection range type used by the picker's calendar (Day, Month, Week, or WorkWeek, as illustrated by the date range story) changes the meaning of a single click in the grid, so confirm that downstream validation matches the configured range.
- There are no slots on this component; visual overrides are applied through className and Griffel descendant selectors, so deep customization may require targeting elements inside the popup.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
