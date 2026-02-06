# Date & Time Pickers

> **Components**: `Calendar`, `DatePicker`, `TimePicker`
> **Packages**: `@fluentui/react-calendar-compat`, `@fluentui/react-datepicker-compat`, `@fluentui/react-timepicker-compat`

## Overview

FluentUI v9 provides date and time selection components through "compat" packages that offer API compatibility with previous versions while using v9 styling.

- **Calendar**: Standalone calendar for date selection/display
- **DatePicker**: Input field with calendar popup for date selection
- **TimePicker**: Combobox-style time selection

## Import

```typescript
// Calendar
import {
  Calendar,
  calendarClassNames,
  defaultCalendarStrings,
  DayOfWeek,
  DateRangeType,
  FirstWeekOfYear,
  MonthOfYear,
} from '@fluentui/react-calendar-compat';

// DatePicker
import {
  DatePicker,
  datePickerClassNames,
  defaultDatePickerStrings,
} from '@fluentui/react-datepicker-compat';

// TimePicker
import {
  TimePicker,
  timePickerClassNames,
  formatDateToTimeString,
} from '@fluentui/react-timepicker-compat';
```

---

## Calendar Component

Calendar is a standalone component for displaying and selecting dates.

### Basic Calendar

```tsx
import { useState } from 'react';
import { Calendar } from '@fluentui/react-calendar-compat';

function BasicCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <Calendar
      value={selectedDate}
      onSelectDate={(date) => date && setSelectedDate(date)}
    />
  );
}
```

### Calendar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date` | - | Selected date |
| `onSelectDate` | `(date: Date, dateRange?: Date[]) => void` | - | Selection callback |
| `today` | `Date` | `new Date()` | Today's date reference |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `restrictedDates` | `Date[]` | - | Dates that cannot be selected |
| `dateRangeType` | `DateRangeType` | `Day` | Selection type (Day, Week, Month, WorkWeek) |
| `firstDayOfWeek` | `DayOfWeek` | `Sunday` | First day of week |
| `firstWeekOfYear` | `FirstWeekOfYear` | `FirstDay` | Week numbering scheme |
| `showMonthPickerAsOverlay` | `boolean` | `false` | Month picker as overlay |
| `isMonthPickerVisible` | `boolean` | `true` | Show month picker |
| `isDayPickerVisible` | `boolean` | `true` | Show day picker |
| `showGoToToday` | `boolean` | - | Show "Go to today" link |
| `showWeekNumbers` | `boolean` | `false` | Show week numbers |
| `showSixWeeksByDefault` | `boolean` | `false` | Always show 6 weeks |
| `highlightCurrentMonth` | `boolean` | `false` | Highlight current month |
| `highlightSelectedMonth` | `boolean` | `false` | Highlight selected month |
| `strings` | `CalendarStrings` | `defaultCalendarStrings` | Localized strings |

### Date Range Selection

```tsx
import { useState } from 'react';
import { Calendar, DateRangeType } from '@fluentui/react-calendar-compat';

function WeekRangeCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <Calendar
      dateRangeType={DateRangeType.Week}
      value={selectedDate}
      onSelectDate={(date, dateRange) => {
        if (date) {
          setSelectedDate(date);
          console.log('Selected range:', dateRange);
        }
      }}
    />
  );
}
```

### Min/Max Date Constraints

```tsx
import { Calendar } from '@fluentui/react-calendar-compat';

function ConstrainedCalendar() {
  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return (
    <Calendar
      minDate={minDate}
      maxDate={maxDate}
      showGoToToday={false}
    />
  );
}
```

---

## DatePicker Component

DatePicker combines an input field with a Calendar popup.

### Basic DatePicker

```tsx
import { useState } from 'react';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { Field } from '@fluentui/react-components';

function BasicDatePicker() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <Field label="Select a date">
      <DatePicker
        value={selectedDate}
        onSelectDate={(date) => setSelectedDate(date ?? null)}
        placeholder="Select a date..."
      />
    </Field>
  );
}
```

### DatePicker Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| null` | - | Selected date (controlled) |
| `onSelectDate` | `(date: Date \| null \| undefined) => void` | - | Selection callback |
| `placeholder` | `string` | - | Input placeholder text |
| `disabled` | `boolean` | `false` | Disable the picker |
| `required` | `boolean` | `false` | Required field |
| `allowTextInput` | `boolean` | `false` | Allow typing date |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Default open state |
| `onOpenChange` | `(open: boolean) => void` | - | Open state callback |
| `openOnClick` | `boolean` | `true` | Open on input click |
| `formatDate` | `(date?: Date) => string` | - | Custom date formatter |
| `parseDateFromString` | `(dateStr: string) => Date \| null` | - | Custom date parser |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `initialPickerDate` | `Date` | - | Initial picker date |
| `isMonthPickerVisible` | `boolean` | `true` | Show month picker |
| `showMonthPickerAsOverlay` | `boolean` | `false` | Month picker overlay |
| `showGoToToday` | `boolean` | - | Show "Go to today" |
| `showWeekNumbers` | `boolean` | `false` | Show week numbers |
| `firstDayOfWeek` | `DayOfWeek` | `Sunday` | First day of week |
| `strings` | `CalendarStrings` | `defaultDatePickerStrings` | Localized strings |
| `borderless` | `boolean` | `false` | Remove border |
| `underlined` | `boolean` | `false` | Underline style |
| `onValidationResult` | `(data) => void` | - | Validation callback |

### DatePicker with Text Input

```tsx
import { useState } from 'react';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { Field } from '@fluentui/react-components';

function TextInputDatePicker() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const formatDate = (date?: Date): string => {
    return date ? date.toLocaleDateString('en-US') : '';
  };

  const parseDateFromString = (dateStr: string): Date | null => {
    const parsed = new Date(Date.parse(dateStr));
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  return (
    <Field label="Date (type or select)">
      <DatePicker
        allowTextInput
        value={selectedDate}
        onSelectDate={(date) => setSelectedDate(date ?? null)}
        formatDate={formatDate}
        parseDateFromString={parseDateFromString}
        placeholder="MM/DD/YYYY"
      />
    </Field>
  );
}
```

### DatePicker with Validation

```tsx
import { useState } from 'react';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import type { DatePickerValidationResultData } from '@fluentui/react-datepicker-compat';
import { Field } from '@fluentui/react-components';

function ValidatedDatePicker() {
  const [error, setError] = useState<string | null>(null);

  const handleValidation = (data: DatePickerValidationResultData) => {
    switch (data.error) {
      case 'invalid-input':
        setError('Please enter a valid date');
        break;
      case 'out-of-bounds':
        setError('Date is outside allowed range');
        break;
      case 'required-input':
        setError('Date is required');
        break;
      default:
        setError(null);
    }
  };

  return (
    <Field
      label="Date"
      required
      validationMessage={error}
      validationState={error ? 'error' : 'none'}
    >
      <DatePicker
        required
        allowTextInput
        onValidationResult={handleValidation}
        minDate={new Date()}
        placeholder="Select a future date"
      />
    </Field>
  );
}
```

---

## TimePicker Component

TimePicker provides time selection through a combobox-style interface.

### Basic TimePicker

```tsx
import { useState } from 'react';
import { TimePicker } from '@fluentui/react-timepicker-compat';
import type { TimeSelectionData } from '@fluentui/react-timepicker-compat';
import { Field } from '@fluentui/react-components';

function BasicTimePicker() {
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const handleTimeChange = (_: unknown, data: TimeSelectionData) => {
    setSelectedTime(data.selectedTime);
  };

  return (
    <Field label="Select time">
      <TimePicker
        selectedTime={selectedTime}
        onTimeChange={handleTimeChange}
        placeholder="Select a time..."
      />
    </Field>
  );
}
```

### TimePicker Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedTime` | `Date \| null` | - | Selected time (controlled) |
| `defaultSelectedTime` | `Date` | - | Default time (uncontrolled) |
| `onTimeChange` | `(event, data) => void` | - | Selection callback |
| `placeholder` | `string` | - | Input placeholder |
| `startHour` | `Hour` (0-24) | `0` | Start hour for options |
| `endHour` | `Hour` (0-24) | `24` | End hour for options |
| `increment` | `number` | `30` | Minutes between options |
| `dateAnchor` | `Date` | `new Date()` | Base date for options |
| `hourCycle` | `'h11' \| 'h12' \| 'h23' \| 'h24'` | - | Hour format |
| `showSeconds` | `boolean` | `false` | Show seconds |
| `freeform` | `boolean` | `false` | Allow custom input |
| `formatDateToTimeString` | `(date: Date) => string` | - | Custom formatter |
| `parseTimeStringToDate` | `(time: string) => TimeStringValidationResult` | - | Custom parser |
| `appearance` | Appearance | - | Visual appearance |
| `size` | Size | - | Component size |
| `clearable` | `boolean` | - | Show clear button |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | - | Default open state |
| `onOpenChange` | `(event, data) => void` | - | Open state callback |
| `inlinePopup` | `boolean` | - | Render inline |
| `positioning` | `PositioningProps` | - | Popup positioning |

### TimePicker with Custom Range

```tsx
import { TimePicker } from '@fluentui/react-timepicker-compat';
import { Field } from '@fluentui/react-components';

function BusinessHoursTimePicker() {
  return (
    <Field label="Business hours only">
      <TimePicker
        startHour={9}
        endHour={17}
        increment={15}
        placeholder="9:00 AM - 5:00 PM"
      />
    </Field>
  );
}
```

### TimePicker with 24-Hour Format

```tsx
import { TimePicker } from '@fluentui/react-timepicker-compat';
import { Field } from '@fluentui/react-components';

function TwentyFourHourTimePicker() {
  return (
    <Field label="24-hour format">
      <TimePicker
        hourCycle="h23"
        increment={30}
      />
    </Field>
  );
}
```

### Freeform TimePicker

```tsx
import { useState } from 'react';
import { TimePicker } from '@fluentui/react-timepicker-compat';
import type { TimeSelectionData } from '@fluentui/react-timepicker-compat';
import { Field } from '@fluentui/react-components';

function FreeformTimePicker() {
  const [error, setError] = useState<string | null>(null);

  const handleTimeChange = (_: unknown, data: TimeSelectionData) => {
    if (data.errorType === 'invalid-input') {
      setError('Please enter a valid time');
    } else {
      setError(null);
    }
  };

  return (
    <Field
      label="Type or select time"
      validationMessage={error}
      validationState={error ? 'error' : 'none'}
    >
      <TimePicker
        freeform
        onTimeChange={handleTimeChange}
        placeholder="Type a time..."
      />
    </Field>
  );
}
```

---

## Combined Date & Time Selection

```tsx
import { useState } from 'react';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { TimePicker } from '@fluentui/react-timepicker-compat';
import type { TimeSelectionData } from '@fluentui/react-timepicker-compat';
import { Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    alignItems: 'flex-start',
  },
  field: {
    flex: 1,
  },
});

function DateTimePicker() {
  const styles = useStyles();
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);

  const getCombinedDateTime = (): Date | null => {
    if (!date || !time) return null;
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds()
    );
  };

  return (
    <div>
      <div className={styles.container}>
        <Field label="Date" className={styles.field}>
          <DatePicker
            value={date}
            onSelectDate={(d) => setDate(d ?? null)}
            placeholder="Select date..."
          />
        </Field>
        <Field label="Time" className={styles.field}>
          <TimePicker
            selectedTime={time}
            onTimeChange={(_, data) => setTime(data.selectedTime)}
            placeholder="Select time..."
          />
        </Field>
      </div>
      {getCombinedDateTime() && (
        <p>Selected: {getCombinedDateTime()?.toLocaleString()}</p>
      )}
    </div>
  );
}
```

---

## Localization

### Calendar Strings

```tsx
import { Calendar, CalendarStrings } from '@fluentui/react-calendar-compat';

const frenchStrings: CalendarStrings = {
  months: [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ],
  shortMonths: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
  days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  shortDays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  goToToday: "Aller à aujourd'hui",
  prevMonthAriaLabel: 'Mois précédent',
  nextMonthAriaLabel: 'Mois suivant',
  prevYearAriaLabel: 'Année précédente',
  nextYearAriaLabel: 'Année suivante',
  closeButtonAriaLabel: 'Fermer',
  monthPickerHeaderAriaLabel: '{0}, sélectionner pour changer année',
  yearPickerHeaderAriaLabel: '{0}, sélectionner pour changer mois',
};

function FrenchCalendar() {
  return <Calendar strings={frenchStrings} />;
}
```

---

## Accessibility

### Keyboard Navigation

**Calendar:**
| Key | Action |
|-----|--------|
| `Arrow keys` | Navigate dates |
| `Page Up/Down` | Previous/next month |
| `Home/End` | First/last day of week |
| `Enter` | Select date |
| `Escape` | Close picker |

**DatePicker/TimePicker:**
| Key | Action |
|-----|--------|
| `Enter` | Open dropdown / select option |
| `Arrow Down` | Open dropdown / next option |
| `Arrow Up` | Previous option |
| `Escape` | Close dropdown |
| `Tab` | Move focus |

---

## Best Practices

### Do's ✅

- Use Field component for form integration
- Provide clear placeholder text
- Set appropriate min/max constraints
- Use localized strings for international users
- Validate user input with `onValidationResult`
- Consider time zones for time-sensitive apps

### Don'ts ❌

- Don't use Calendar alone when DatePicker is more appropriate
- Don't allow text input without proper parsing/validation
- Don't forget to handle null/undefined values
- Don't use overly restrictive date ranges without explanation

---

## Related Components

- [Field](./field.md) - Form field wrapper
- [Input](./input.md) - Text input component
- [Combobox](./combobox.md) - Base for TimePicker