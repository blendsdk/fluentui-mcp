# CalendarCompat

> **Package**: `@fluentui/react-calendar-compat` v0.4.2
> **Import**: `import { CalendarCompat } from '@fluentui/react-calendar-compat';`
> **Category**: forms
> **Stability**: unstable

## Overview

CalendarCompat is the v9-styled, API-compatible Calendar exported from '@fluentui/react-calendar-compat' (also imported as Calendar in the package's Storybook examples). It renders a fully controlled date-picking surface composed of a month header, an optional year picker, an optional month picker, and a day grid, and it supports single-day, day-range, work-week, week, month, and year selection modes through the dateRangeType prop. Because the component is fully controlled, the consumer owns selectedDate, navigatedDate/selectedYear, and the visible month, while the calendar reports interaction through onSelectDate, onNavigateDate, onSelectYear, and onHeaderSelect. Localization is supplied through the required strings prop, navigation affordances through the required navigationIcons prop, and day-level behavior through the calendarDayProps shown in the package's stories (customDayCellRef, daysToSelectInDayView). The same package also re-exports helpers used by the examples, including DateRangeType, DayOfWeek, addDays, addMonths, addYears, and getDateRangeArray, so range math and boundary arithmetic stay consistent with the calendar's own selection logic.

**When to use**: Use CalendarCompat when you need an inline, always-visible date surface rather than a text input with a flyout: dashboards, scheduling panels, booking flows, report date-range filters, resource planners, or any layout where the user must see the grid (including adjacent-month days and week numbers) at all times. Choose it when you need range-oriented selection modes that the newer date primitives do not express directly, such as DateRangeType.WorkWeek with a custom workWeekDays set, contiguous or non-contiguous work weeks, multiday day view lengths, month-only selection, or a week-number column. Choose it when you are migrating an existing v8 '@fluentui/react' Calendar experience and want the same prop names, including legacy spellings such as overlayedWithButton, while keeping v9 styling and Griffel theming. Prefer DatepickerCompat instead when the calendar should live behind a text field and popup, and prefer the headless date hooks when you need to own the markup entirely.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `allFocusable` | `boolean` | — | No | — |
| `animateBackwards` | `boolean` | — | No | — |
| `animateBackwards` | `boolean` | — | No | — |
| `animationDirection` | `AnimationDirection` | — | No | — |
| `animationDirection` | `AnimationDirection` | — | No | — |
| `animationDirection` | `AnimationDirection` | — | No | — |
| `animationDirection` | `AnimationDirection` | — | No | — |
| `className` | `string` | — | No | — |
| `className` | `string` | — | No | — |
| `className` | `string` | — | No | — |
| `className` | `string` | — | No | — |
| `className` | `string` | — | No | — |
| `componentRef` | `React_2.RefObject<ICalendarMonth \| null>` | — | No | — |
| `componentRef` | `React_2.RefObject<ICalendarYear \| null>` | — | No | — |
| `dateRangeType` | `DateRangeType` | — | No | — |
| `dateTimeFormatter` | `DateFormatting` | — | No | — |
| `hasHeaderClickCallback` | `boolean` | — | No | — |
| `highlightCurrent` | `boolean` | — | No | — |
| `highlightCurrentMonth` | `boolean` | — | No | — |
| `highlightCurrentYear` | `boolean` | — | No | — |
| `highlightSelected` | `boolean` | — | No | — |
| `highlightSelectedMonth` | `boolean` | — | No | — |
| `highlightSelectedYear` | `boolean` | — | No | — |
| `isDayPickerVisible` | `boolean` | — | No | — |
| `isMonthPickerVisible` | `boolean` | — | No | — |
| `lightenDaysOutsideNavigatedMonth` | `boolean` | — | No | — |
| `maxDate` | `Date` | — | No | — |
| `maxYear` | `number` | — | No | — |
| `minDate` | `Date` | — | No | — |
| `minYear` | `number` | — | No | — |
| `monthPickerOnly` | `boolean` | — | No | — |
| `navigatedDate` | `Date` | — | Yes | — |
| `navigatedYear` | `number` | — | No | — |
| `navigationIcons` | `CalendarNavigationIcons` | — | Yes | — |
| `navigationIcons` | `CalendarNavigationIcons` | — | Yes | — |
| `onHeaderSelect` | `() => void` | — | No | — |
| `onHeaderSelect` | `(focus: boolean) => void` | — | No | — |
| `onNavigateDate` | `(date: Date, focusOnNavigatedDay: boolean) => void` | — | Yes | — |
| `onNavigateDate` | `(year: number) => void` | — | No | — |
| `onRenderTitle` | `(props: CalendarYearHeaderProps) => React_2.ReactNode` | — | No | — |
| `onRenderYear` | `(year: number) => React_2.ReactNode` | — | No | — |
| `onSelectDate` | `(date: Date, selectedDateRangeArray?: Date[]) => void` | — | No | — |
| `onSelectYear` | `(year: number) => void` | — | No | — |
| `overlaidWithButton` | `boolean` | — | No | — |
| `overlayedWithButton` | `boolean` | — | No | — |
| `selectedDate` | `Date` | — | Yes | — |
| `selectedYear` | `number` | — | No | — |
| `showGoToToday` | `boolean` | — | No | — |
| `showMonthPickerAsOverlay` | `boolean` | — | No | — |
| `showWeekNumbers` | `boolean` | — | No | — |
| `showWeekNumbers` | `boolean` | — | No | — |
| `strings` | `CalendarStrings` | — | Yes | — |
| `strings` | `CalendarYearStrings` | — | No | — |
| `today` | `Date` | — | No | — |
| `yearPickerHidden` | `boolean` | — | No | — |

### Prop Guidance

- **dateRangeType**: Selects the granularity of selection: single day, a contiguous Day range, WorkWeek, Week, or Month, or a plain month/year pick. It drives both the highlighted range returned in onSelectDate and which cells are interactive. `DateRangeType.WorkWeek`
- **highlightSelectedMonth**: Emphasizes the month (and year) that contains the current selection inside the month picker. Turn it on whenever the month picker is visible so users can locate themselves quickly. `true`
- **highlightCurrentMonth**: Marks the real current month in the picker independently of the selection. Use it together with highlightSelectedMonth so today and the selection are distinguishable. `true`
- **highlightCurrent / highlightSelected**: Lower-level counterparts used by the month and year surfaces to mark the current and selected entries. Provide them when you compose those sub-surfaces directly instead of relying on the calendar-level flags. `true`
- **showGoToToday**: Renders a shortcut that jumps the view back to the current date. Keep it enabled for planning and filtering surfaces where users roam far from today, and turn it off for tightly bounded pickers such as the date-boundaries example. `false`
- **showWeekNumbers**: Adds a week-number column to the day grid for teams that plan by ISO week. Enable it only when the audience actually references week numbers, since it widens the grid. `true`
- **minDate / maxDate**: Defines the inclusive selectable window. Dates outside the window render as disabled and cannot be focused or selected, and navigation is clamped where the bounds allow it. `addMonths(today, -1) and addYears(today, 1)`
- **lightenDaysOutsideNavigatedMonth**: Dims the trailing and leading days that belong to adjacent months. Keep it on for the default look; turn it off when every visible cell must carry equal visual weight. `true`
- **allFocusable**: Makes every rendered day, month, and year cell individually tabbable instead of using a single roving tab stop. Enable it only for assistive-technology-first or testing scenarios, because it adds many tab stops. `false`
- **isDayPickerVisible**: Hides the day grid so the surface becomes a month and year picker. Use it for reporting or billing periods that are chosen at month granularity. `false`
- **isMonthPickerVisible / monthPickerOnly**: Controls whether the month list is shown and whether it is the only selectable surface. Combine them when the user should pick a period rather than a specific day. `true`
- **showMonthPickerAsOverlay / overlaidWithButton / overlayedWithButton**: Renders the month picker floating over the day grid, which is the recommended pattern in narrow containers. The overlaidWithButton and legacy overlayedWithButton spellings both exist for header-button presentation; prefer the correctly spelled prop in new code. `true`
- **yearPickerHidden**: Removes the year list from the header. Set it when the selectable year range is fixed or when the header already communicates the year. `true`
- **animateBackwards / animationDirection**: Controls the direction of the month-transition animation when navigating. Keep transitions short and skip them under reduced-motion preferences, since animation is decorative rather than functional. `false and an AnimationDirection value such as horizontal`
- **dateTimeFormatter**: Supplies the date-formatting implementation used to build header and cell labels, letting you align the calendar with your app's locale and formatting rules. `a DateFormatting implementation matching your locale`
- **today**: Overrides the notion of "today" used for highlighting and the Go to today action. Provide it in tests or when rendering historical snapshots so the highlight is deterministic. `a fixed Date`
- **onSelectDate**: The primary interaction callback, invoked with the newly selected date and, in range modes, the resolved array of dates in that range. Always write the received date back into your selected state so the highlight follows the user's click. `(date, selectedDateRangeArray) => setSelectedDate(date)`
- **onNavigateDate**: Fires when the visible month or year changes, receiving the target date and whether focus should land on the navigated day. Use it to keep your controlled navigation state, and outside previous/next buttons, in sync. `(date, focusOnNavigatedDay) => setNavigatedDate(date)`
- **onHeaderSelect**: Invoked when the user activates the header to open the month or year picker; the year variant receives a focus flag. Pair it with hasHeaderClickCallback so the header renders as interactive. `(focus) => setYearPickerOpen(true)`
- **hasHeaderClickCallback**: Tells the header that a click handler exists so it styles and behaves as a control. Set it whenever you pass onHeaderSelect, and leave it off when the header is purely informational. `true`
- **strings**: Provides every localized label and accessible name, including month names, day names, the Go to today text, and header text. It is required on the month and year surfaces, so supply a complete CalendarStrings or CalendarYearStrings object for production use. `a complete localized CalendarStrings object`
- **navigationIcons**: Supplies the previous/next icons used by the header. It is required, so pass an explicit CalendarNavigationIcons value when you compose sub-surfaces directly or want your own icon set. `an object with previous and next icon elements`
- **navigatedDate / navigatedYear / selectedYear**: The controlled view state for the header and pickers: which date or year the user is currently looking at and, for the year picker, which year is selected. Keep these in your own state and update them from onNavigateDate and onSelectYear. `navigatedDate set to the first of the visible month`
- **onSelectYear / onNavigateDate (year form)**: The year-picker equivalents of date selection and navigation. Use them when the year list is driven separately from the day grid so the visible year and selection remain controlled. `(year) => setSelectedYear(year)`
- **onRenderYear / onRenderTitle**: Render-prop hooks for customizing the year cell content and the year-picker title. They receive the year (or CalendarYearHeaderProps for the title), so they are the sanctioned extension point instead of DOM manipulation. `(year) => year + " fiscal" for onRenderYear`
- **minYear / maxYear / highlightCurrentYear / highlightSelectedYear**: Clamp the year list and mark the current and selected years inside it, mirroring minDate/maxDate and the month-level highlight flags. `minYear 2020 and maxYear 2030`
- **componentRef**: Exposes the imperative instance of the month or year surface (ICalendarMonth or ICalendarYear). Use it only for programmatic focus or scroll restoration, not for state that should be controlled through props. `a ref object typed to the month or year instance`
- **calendarDayProps**: Passes day-level customizations down to the grid, notably customDayCellRef for per-cell tuning and daysToSelectInDayView for multiday day-view selections (which may be negative to highlight days before the selected date). `{ daysToSelectInDayView: 4 } as shown in the multiday day view example`
- **className**: Applies a class to the calendar root for layout, width, or spacing adjustments from the surrounding page. Compose it with Griffel makeStyles rather than global selectors. `a makeStyles class setting maxWidth`

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Calendar } from '@fluentui/react-calendar-compat';
import type { CalendarProps } from '@fluentui/react-calendar-compat';

export const Default = (props: CalendarProps): JSXElement => <Calendar {...props} />;
```

### CalendarContiguousWorkWeekDays

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Calendar, DateRangeType, DayOfWeek } from '@fluentui/react-calendar-compat';

export const CalendarContiguousWorkWeekDays = (): JSXElement => {
  const [selectedDateRange, setSelectedDateRange] = React.useState<Date[]>();
  const [selectedDate, setSelectedDate] = React.useState<Date>();

  const onSelectDate = React.useCallback((date: Date, selectedDateRangeArray?: Date[] | undefined): void => {
    setSelectedDate(date);
    setSelectedDateRange(selectedDateRangeArray);
  }, []);

  let dateRangeString = 'Not set';
  if (selectedDateRange) {
    const rangeStart = selectedDateRange[0];
    const rangeEnd = selectedDateRange[selectedDateRange.length - 1];
    dateRangeString = rangeStart.toDateString() + '-' + rangeEnd.toDateString();
  }

  return (
    <>
      <div>Selected date: {selectedDate?.toDateString() || 'Not set'}</div>
      <div>Selected range: {dateRangeString}</div>
      <Calendar
        dateRangeType={DateRangeType.WorkWeek}
        highlightSelectedMonth
        showGoToToday
        workWeekDays={workWeekDays}
        onSelectDate={onSelectDate}
        value={selectedDate}
      />
    </>
  );
};

CalendarContiguousWorkWeekDays.parameters = {
  docs: {
    description: {
      story: 'A Calendar Compat can be modified to allow selecting a contiguous (5 day) work week.',
    },
  },
};
```

### CalendarCustomDayCellRef

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Calendar } from '@fluentui/react-calendar-compat';
import type { CalendarDayGridStyles } from '@fluentui/react-calendar-compat';

export const CalendarCustomDayCellRef = (): JSXElement => {
  const [selectedDate, setSelectedDate] = React.useState<Date>();

  const onSelectDate = React.useCallback((date: Date): void => {
    setSelectedDate(date);
  }, []);

  const customDayCellRef = React.useCallback((element: HTMLElement, date: Date, classNames: CalendarDayGridStyles) => {
    if (element) {
      element.title = 'custom title from customDayCellRef: ' + date.toString();
      if (date.getDay() === 0 || date.getDay() === 6) {
        // We need to split the className since we use makeStyles and griffel provides a string of space
        // separated classnames
        classNames.dayOutsideBounds && element.classList.add(...classNames.dayOutsideBounds.split(' '));
        (element.children[0] as HTMLButtonElement).disabled = true;
      }
    }
  }, []);

  return (
    <>
      <div>Selected date: {selectedDate?.toDateString() || 'Not set'}</div>
      <Calendar
        highlightSelectedMonth
        showGoToToday
        calendarDayProps={{ customDayCellRef }}
        onSelectDate={onSelectDate}
        value={selectedDate}
      />
    </>
  );
};

CalendarCustomDayCellRef.parameters = {
  docs: {
    description: {
      story: 'A Calendar Compat can be modified to allow selecting a non contiguous (7 day) week.',
    },
  },
};
```

## Best Practices

### Do's

- Keep the calendar fully controlled: hold selectedDate (and the navigated month) in state and write the new value in onSelectDate, exactly as the Default, CalendarWeekNumbers, and CalendarSixWeeks examples do.
- Use the optional second argument of onSelectDate (selectedDateRangeArray) when dateRangeType is set to a range mode, so consumers always have the resolved start and end of a WorkWeek, Week, Month, or Day range.
- Constrain selectable days with minDate and maxDate, and block individual days with restrictedDates, rather than disabling day buttons imperatively (see the CalendarDateBoundaries story).
- Use the date helpers shipped with the package (addDays, addMonths, addYears, getDateRangeArray) when building previous/next buttons or boundary math, so range logic matches what the calendar itself computes, as demonstrated by the CalendarWeekSelection and CalendarMonthSelection stories.
- Set highlightSelectedMonth and highlightCurrentMonth when the month or year picker is visible so users can orient themselves in the picker without reading every cell.
- Hide parts of the surface you do not need: isDayPickerVisible false for month-only flows, yearPickerHidden when the year list is noise, and showMonthPickerAsOverlay when horizontal space is tight.
- Memoize callbacks passed to the calendar (onSelectDate, onNavigateDate, onRenderYear, onRenderTitle, and the object literals supplied through calendarDayProps) with useCallback or a stable module-level object, as every story example does.
- Wrap the calendar in a FluentProvider so day, month, and year cells receive the correct theme tokens, and provide strings and navigationIcons explicitly when you host CalendarMonth or CalendarYear sub-surfaces directly.

### Don'ts

- Do not expect the calendar to manage its own state: it will not update the highlighted day unless you feed the new selectedDate back through the value/selectedDate flow in onSelectDate.
- Do not reach into the DOM to disable days, as tempting as element.children[0] is in a customDayCellRef: use minDate, maxDate, and restrictedDates for availability and reserve the custom cell ref for presentation concerns such as tooltips.
- Do not mix showMonthPickerAsOverlay with a layout that also expects the month picker inline; the overlay intentionally floats above the day grid and is meant for width-constrained containers.
- Do not omit strings when you host the month or year sub-components: strings is required there and drives every accessible name and header label, so an empty or partial strings object produces unlabeled controls.
- Do not pass a new inline object for calendarDayProps, navigationIcons, or strings on every render, since new identities defeat memoization and force the whole grid subtree to re-render.
- Do not rely on animationDirection or animateBackwards for anything other than navigation flourish; the calendar is fully usable without animation and users with reduced-motion preferences should not have movement forced on them.
- Do not apply global CSS overrides against internal day-cell classes; use the className prop, Griffel makeStyles with real theme tokens, or the class name set exposed to customDayCellRef.
- Do not create separate ad hoc state for selected date, selected range, and visible month that can drift out of sync; onSelectDate already returns both the anchor date and the resolved range array.

## Anti-Patterns

### Treating the calendar as a self-managed input

❌ The calendar is fully controlled: clicking a day reports the new value through onSelectDate but does not change the highlighted day by itself. Consumers who ignore the callback see a calendar that appears frozen or that keeps snapping back to the previous selection.

✅ Hold selectedDate and the navigated month in state and write the value from onSelectDate back into the props, exactly as the Default, CalendarWeekNumbers, and CalendarSixWeeks examples do.

### Disabling days by poking at the DOM

❌ Reaching into the rendered cell (for example setting element.children[0].disabled inside customDayCellRef) bypasses the calendar's own availability model, breaks arrow-key navigation consistency, and can leave stale disabled state after a month transition.

✅ Express availability declaratively with minDate, maxDate, and restrictedDates, and reserve customDayCellRef for presentation such as titles or additional classes.

### Using the calendar where a popup is expected

❌ Dropping CalendarCompat into a form as if it were a text field consumes a large block of layout, provides no typed date entry, and usually duplicates the label and validation behavior of a real field.

✅ Use DatepickerCompat or a text input with a popup when the date is one field among many, and reserve the inline calendar for surfaces where the grid itself is the primary task.

### Ignoring the range array in range modes

❌ With dateRangeType set to WorkWeek, Week, Month, or Day, the anchor date alone does not describe the selection. Consumers who only store the first callback argument highlight the wrong span when re-rendering.

✅ Store the selectedDateRangeArray that onSelectDate supplies as the second argument, and rebuild previous/next navigation with getDateRangeArray and addDays so the range stays contiguous.

### Passing freshly created objects on every render

❌ Inline literals for calendarDayProps, navigationIcons, or strings create new identities on each render, forcing the whole day grid, month picker, and year list to re-render on unrelated parent updates and defeating memoization.

✅ Lift those objects to module scope or memoize them, and wrap onSelectDate, onNavigateDate, onRenderYear, and onRenderTitle in useCallback.

### Overriding internal class names with global CSS

❌ Hand-written selectors against day-cell internals break as soon as the compat styles change and cannot participate in token-based theming, so the calendar drifts out of sync with the rest of the app.

✅ Use the className prop plus makeStyles with real theme tokens, or the CalendarDayGridStyles class names handed to customDayCellRef, remembering to split the space-separated Griffel class string before applying it.

## Accessibility

**Requirements**: The calendar is a composite widget and must satisfy WCAG 2.1 AA: 1.3.1 for structural meaning (the day grid is a grid and its cells are programmatically associated), 2.1.1 for full keyboard operability, 2.4.3 and 2.4.7 for visible focus on the currently focused day, month, or year cell, 4.1.2 for correct name, role, and state on every interactive cell, and 1.4.3 and 1.4.11 for contrast on selected, current, hovered, and out-of-bounds day states. Ensure day-cell hit areas remain comfortably above the minimum target size, since grid cells are dense by nature. Provide meaningful strings (month names, day names, Go to today, header text) because those strings are the source of every accessible name; if you override navigationIcons, keep the custom icons non-textual decorative content that inherits the surrounding button labels. Respect reduced-motion preferences before enabling animated month transitions via animationDirection or animateBackwards, and verify the layout in both left-to-right and right-to-left writing directions.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the calendar; with the default roving-tabindex behavior only one day cell is in the tab order, and with allFocusable every rendered day, month, and year cell can receive focus. |
| `Shift+Tab` | Moves focus backwards out of the calendar to the previous focusable element, such as the trigger or a surrounding control. |
| `ArrowLeft / ArrowRight` | Moves focus one day backwards or forwards within the day grid, crossing into the previous or next week and, where allowed by minDate and maxDate, changing the navigated month. |
| `ArrowUp / ArrowDown` | Moves focus one week backwards or forwards in the day grid. |
| `Home` | Moves focus to the first day of the currently focused week according to firstDayOfWeek. |
| `End` | Moves focus to the last day of the currently focused week. |
| `Ctrl+Home / Ctrl+End` | Moves focus to the first or last day of the currently displayed month. |
| `PageUp / PageDown` | Navigates the day grid backwards or forwards to the previous or next month while keeping day focus, driving onNavigateDate. |
| `Enter` | Selects the focused day, month, or year cell and invokes onSelectDate, onSelectYear, or the month header handler as appropriate. |
| `Space` | Activates the focused cell identically to Enter on the day grid's buttons and header controls. |
| `Escape` | Dismisses the month picker when it is rendered as an overlay over the day grid, returning focus to the header that opened it. |

**ARIA**: aria-label, aria-labelledby, aria-selected, aria-disabled, aria-current="date", aria-expanded, aria-live, aria-hidden

**Screen Reader**: A screen reader encounters the calendar as a named grid: the month and year header is announced first (its text comes from strings and can be customized for the year picker with onRenderTitle), then each week row and day cell. Because day cells are implemented as buttons inside grid cells, the reader announces the full date, whether it is selected via aria-selected, whether it is the current date via aria-current="date", and whether it is unavailable via aria-disabled. Month and year cells in the pickers are announced the same way, with highlightCurrentMonth and highlightSelectedMonth supplying the visual counterpart to those states. When navigation occurs, the newly displayed month header is announced and focus remains on the equivalent day, so the user keeps context after ArrowLeft, ArrowRight, PageUp, or PageDown. With allFocusable enabled, every day is individually tabbable rather than a roving single tab stop, which changes how many announcements a Tab press produces. Icons supplied through navigationIcons are decorative and should not add duplicate labels to the previous/next buttons.

## Styling

Customize the root with the className prop and compose additional Griffel classes with makeStyles from '@fluentui/react-components'. The most useful real tokens for a v9-consistent look are tokens.colorNeutralBackground1 for the surface, tokens.colorNeutralForeground1 for day and header text, tokens.colorNeutralForeground2 for week numbers and secondary labels, tokens.colorNeutralForegroundDisabled and tokens.colorNeutralBackgroundDisabled for days blocked by minDate, maxDate, or restrictedDates, and tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed for day hover and press states. Selection styling maps naturally to tokens.colorBrandBackground with tokens.colorBrandForeground1 (or tokens.colorNeutralBackground1Selected with tokens.colorNeutralForeground1Selected for a neutral treatment), while the dimmed adjacent-month days controlled by lightenDaysOutsideNavigatedMonth read best with tokens.colorNeutralForeground3 or tokens.colorNeutralForeground4. Separators and the overlay month panel should use tokens.colorNeutralStroke1 and tokens.colorNeutralBackground1 with a shadow from tokens.shadow8 to sit above the day grid, and typography should stay on tokens.fontFamilyBase with tokens.fontSizeBase200 for week numbers and tokens.fontSizeBase300 / tokens.fontWeightSemibold for the month header. Spacing inside dense cells is best tuned with tokens.spacingHorizontalXS and tokens.spacingVerticalXS, with tokens.borderRadiusCircular for day cells and tokens.borderRadiusMedium for picker cells. For per-cell tweaks, the customDayCellRef callback demonstrated in the CustomDayCellRef story receives the cell element, its Date, and a CalendarDayGridStyles class-name object; remember that makeStyles returns space-separated class strings, so split them before applying, and prefer toggling one of the supplied style keys over hand-written CSS.

## Performance

The calendar renders the full visible month of day cells, plus a month list and a year list when those pickers are shown, so each render can touch dozens of interactive elements. Keep onSelectDate, onNavigateDate, onSelectYear, and the render props onRenderYear and onRenderTitle stable with useCallback or module-level functions, and avoid creating new object literals for calendarDayProps, navigationIcons, and strings on every render, since new identities invalidate memoization across the entire grid subtree. Date-driven computations such as getDateRangeArray or addDays are cheap but should not run inside the day render path; compute boundaries and restricted date lists once per selection change, as the date-boundaries example does. Navigation animations triggered through animationDirection or animateBackwards add layout and paint cost; keep them brief and skip them when the user prefers reduced motion. Large selection ranges (month view, multiday day view, work-week spans) cause more cells to carry selection styling, which is a styling cost rather than a structural one, but very wide ranges across many months still translate into additional re-renders through onNavigateDate.

## Theming & Tokens

CalendarCompat consumes the ambient FluentProvider theme, so wrapping it in a Provider with a custom brand ramp immediately restyles the selected day, the highlighted month and year, and any header buttons. Selection surfaces should track tokens.colorBrandBackground with tokens.colorBrandForeground1, hover and press states use tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed, and neutral selection treatments use tokens.colorNeutralBackground1Selected with tokens.colorNeutralForeground1Selected. Text uses tokens.colorNeutralForeground1 through tokens.colorNeutralForeground4 (the lighter steps suit week numbers and the adjacent-month days governed by lightenDaysOutsideNavigatedMonth), while unavailable days from minDate, maxDate, or restrictedDates read from tokens.colorNeutralForegroundDisabled and tokens.colorNeutralBackgroundDisabled. The month overlay and any popup-like surface should sit on tokens.colorNeutralBackground1 with tokens.colorNeutralStroke1 borders and elevation from tokens.shadow8 or tokens.shadow16, and typography stays on tokens.fontFamilyBase with tokens.fontSizeBase200, tokens.fontSizeBase300, tokens.fontSizeBase400, and tokens.fontWeightSemibold for the header hierarchy. Spacing and shape tokens such as tokens.spacingHorizontalXS, tokens.spacingVerticalXS, tokens.borderRadiusMedium, and tokens.borderRadiusCircular keep day, month, and year cells consistent with the rest of the v9 library, and applying them through makeStyles ensures they react to theme switching, including high-contrast themes.

## Migration Notes

CalendarCompat exists to smooth the move from the v8 '@fluentui/react' Calendar to v9: the component and its sub-surfaces (CalendarMonth, CalendarYear) keep the legacy prop names and controlled-data contract, including the historical spelling overlayedWithButton alongside the corrected overlaidWithButton, so old call sites continue to compile while styling moves to Griffel. Styles are now produced by makeStyles, which means class names are space-separated strings rather than mergeStyleSets objects; if you previously inspected or appended style-set class names, split the string before adding it to an element, exactly as the custom day cell ref example notes. i18n that v8 may have defaulted internally must now be passed explicitly where the API marks it required, notably strings and navigationIcons on the month and year surfaces, and y/ear-picker strings via CalendarYearStrings. Because the package also exports the same helpers used by the v8 API (DateRangeType, DayOfWeek, addDays, addMonths, addYears, getDateRangeArray), range math can often be ported unchanged. Wrap the component in a FluentProvider so the v9 theme reaches the day, month, and year cells, and prefer the v9 makeStyles plus tokens approach over any remaining legacy styling overrides.

## Edge Cases

- When minDate or maxDate falls mid-month, the surrounding cells still render but become unselectable, and previous/next navigation stops at the bound; verify that arrow-key traversal does not leave focus on an unreachable day.
- selectedDate may be undefined or lie outside the minDate/maxDate window; several examples initialize it as undefined and display "Not set", so treat an empty selection as a first-class state rather than assuming a value exists.
- The prop list contains both overlaidWithButton and the legacy misspelling overlayedWithButton, and several props such as animationDirection and className repeat across the month, day-grid, and year interfaces; pick the correctly spelled prop in new code and be aware that the same name can target different sub-surfaces.
- daysToSelectInDayView accepts negative numbers to highlight days before the selected date, as the multiday day view example shows; mixing positive and negative values across two calendars bound to the same selection state can produce overlapping highlights.
- isDayPickerVisible set to false turns the surface into a month and year picker, which changes the meaning of dateRangeType and removes day-level callbacks from the interaction path.
- showMonthPickerAsOverlay places the month picker above the day grid inside a constrained container; confirm that the overlay is not clipped by an ancestor with overflow hidden and that Escape restores focus to the header.
- strings and navigationIcons are required for the month and year surfaces; supplying partial values yields unlabeled navigation buttons or empty header text, which is especially visible to screen reader users.
- An uncontrolled view state drifts if navigatedDate, navigatedYear, or selectedYear are not updated from onNavigateDate and onSelectYear, leaving the header showing a different month or year than the highlighted cell.
- Highlighting today relies on the today prop defaulting to the real current date; passing a fixed value in tests changes both the highlight and what "Go to today" navigates to.

## See Also

- - [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
