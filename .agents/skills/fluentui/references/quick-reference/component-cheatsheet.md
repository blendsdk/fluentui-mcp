# Component Quick Reference

> **Category**: quick-reference

## 1. Packages & imports

| Package | Components |
| --- | --- |
| `@fluentui/react-components` | Accordion, Aria, Avatar, Badge, Breadcrumb, Button, Card, Carousel, Checkbox, ColorPicker, Combobox, Dialog, Divider, Drawer, Field, Image, Infolabel, Input, Label, Link, List, Menu, MessageBar, Motion, Nav, Overflow, Persona, Popover, Portal, Positioning, Progress, Provider, Radio, Rating, Search, Select, Skeleton, Slider, Spinbutton, Spinner, SwatchPicker, Switch, Table, Tabs, Tabster, TagPicker, Tags, TeachingPopover, Text, Textarea, Toast, Toolbar, Tooltip, Tree, Utilities |
| `@fluentui/react-calendar-compat` | CalendarCompat |
| `@fluentui/react-datepicker-compat` | DatepickerCompat |
| `@fluentui/react-timepicker-compat` | TimepickerCompat |
| `@fluentui/react-context-selector` | ContextSelector |
| `@fluentui/react-menu-grid-preview` | MenuGridPreview |
| `@fluentui/react-headless-components-preview` | HeadlessComponentsPreview |
| `@fluentui/react-motion-components-preview` | MotionComponentsPreview |

```tsx
import { Button, Input, Field, Text } from '@fluentui/react-components';
import { DatepickerCompat } from '@fluentui/react-datepicker-compat';
import { TimepickerCompat } from '@fluentui/react-timepicker-compat';
```

## 2. Shared prop vocabulary

| Pattern | Props | Components |
| --- | --- | --- |
| Visual variant | `appearance` | Button, Input, Textarea, Select, Spinbutton, Badge, Card, Divider, Link, Spinner, Skeleton, Popover, Tooltip, Tabs, Tree |
| Visual scale | `size` | Button, Badge, Avatar, Persona, Input, Textarea, Select, Field, Label, Spinner, Switch, Slider, Spinbutton, Rating, Tabs, Tree, Card, Breadcrumb, SwatchPicker, Toolbar, Infolabel |
| Corner style | `shape` | Button, Badge, Skeleton, Checkbox, ColorPicker, Image, MessageBar, Progress, SwatchPicker |
| Controlled value | `value` + `onChange` | Input, Textarea, Select, Slider, Spinbutton, Rating, Radio |
| Checked value | `checked` / `defaultChecked` + `onChange` | Checkbox (`boolean \| "mixed"`), Switch |
| Open state | `open` / `defaultOpen` + `onOpenChange` | Dialog, Popover, Menu, DatepickerCompat |
| Selection state | `selected` / `defaultSelected`, `selectedValue` / `defaultSelectedValue` + `onSelectionChange` | Card, List, Nav, SwatchPicker, Tree |
| Disabled | `disabled`, `disabledFocusable` | Button, Link, Switch, Slider, Radio, Label |
| Slot shorthand | `icon`, `label`, `contentBefore`, `contentAfter`, `content`, `root` | see per-component slot tables below |

### `appearance` values are component-specific

| Component | `appearance` |
| --- | --- |
| Button | `secondary`, `primary`, `outline`, `subtle`, `transparent` |
| Input | `outline`, `underline`, `filled-darker`, `filled-lighter`, `filled-darker-shadow`, `filled-lighter-shadow` |
| Textarea | `outline`, `filled-darker`, `filled-lighter`, `filled-darker-shadow`, `filled-lighter-shadow` |
| Select | `outline`, `underline`, `filled-darker`, `filled-lighter` |
| Spinbutton | `outline`, `underline`, `filled-darker`, `filled-lighter` |
| Badge | `filled`, `ghost`, `outline`, `tint` |
| Card | `filled`, `filled-alternative`, `outline`, `subtle` |
| Divider | `brand`, `default`, `strong`, `subtle` |
| Spinner | `primary`, `inverted` |
| Popover | `brand`, `inverted` |
| Tooltip | `normal`, `inverted` |
| Link | `default`, `subtle` |
| Tabs | `transparent`, `subtle`, `subtle-circular`, `filled-circular` |
| Tree | `subtle`, `subtle-alpha`, `transparent` |
| Skeleton | `opaque`, `translucent` |

### `size` scales are component-specific

| Scale | Components |
| --- | --- |
| `small` \| `medium` \| `large` | Button, Input, Textarea, Select, Field, Label, Breadcrumb, Tabs, Card, Toolbar, Infolabel |
| `small` \| `medium` | Switch, Slider, Spinbutton, Tree |
| `medium` \| `large` | Checkbox |
| `extra-small` \| `small` \| `medium` \| `large` | SwatchPicker |
| `extra-small` … `extra-large` \| `huge` | Avatar, Persona |
| `small` \| `medium` \| `large` \| `extra-large` | Rating |
| `tiny`, `extra-small`, `small`, `medium`, `large`, `extra-large` | Badge |
| `extra-tiny`, `tiny`, `extra-small`, `small`, `medium`, `large`, `extra-large`, `huge` | Spinner |
| `100` … `1000` (numeric) | Text |
| number (`AvatarSize`, `SkeletonItemSize`) | Avatar, Skeleton |

## 3. Buttons

| Component | Props | Slots |
| --- | --- | --- |
| Button | `appearance`, `size` (ButtonSize), `shape` (`rounded`/`circular`/`square`), `iconPosition` (`before`/`after`), `disabled`, `disabledFocusable` | root, icon |

## 4. Forms

| Component | Props | Slots |
| --- | --- | --- |
| Checkbox | `checked` (`boolean \| "mixed"`), `defaultChecked`, `labelPosition` (`before`/`after`), `shape` (`square`/`circular`), `size` (`medium`/`large`), `onChange` | root, label, input, indicator |
| ColorPicker | `color` (HsvColor), `onColorChange`, `shape` (`rounded`/`square`) | root |
| Combobox | `freeform`, `children` | root, expandIcon, clearIcon, input, listbox |
| DatepickerCompat | `value`, `onSelectDate`, `open`/`defaultOpen`/`onOpenChange`, `allowTextInput`, `formatDate`, `parseDateFromString`, `minDate`, `maxDate`, `today`, `initialPickerDate`, `firstDayOfWeek`, `firstWeekOfYear`, `showWeekNumbers`, `showGoToToday`, `highlightCurrentMonth`, `highlightSelectedMonth`, `isMonthPickerVisible`, `showMonthPickerAsOverlay`, `required`, `disabled`, `underlined`, `borderless`, `inlinePopup`, `openOnClick`, `disableAutoFocus`, `placeholder`, `strings`, `dateTimeFormatter`, `positioning`, `onValidationResult`, `showCloseButton`, `allFocusable` | — |
| Field | `orientation` (`vertical`/`horizontal`), `validationState` (`error`/`warning`/`success`/`none`), `required`, `size`, `children` | root, label, validationMessage, validationMessageIcon, hint |
| Infolabel | `size` (`small`/`medium`/`large`), `inline`, `info`, `popover` | — |
| Input | `size`, `appearance`, `value`, `defaultValue`, `onChange`, `type` (`text`/`number`/`email`/`password`/`search`/`tel`/`url`/`date`/`datetime-local`/`month`/`time`/`week`) | root, input, contentBefore, contentAfter |
| Label | `disabled`, `required`, `size`, `weight` (`regular`/`semibold`) | root, required |
| Radio | `value`, `labelPosition` (`after`/`below`), `disabled`, `onChange` | root, label, input, indicator |
| Rating | `value`, `defaultValue`, `max`, `step` (`0.5`/`1`), `color` (`brand`/`marigold`/`neutral`), `size`, `name`, `iconFilled`, `iconOutline`, `itemLabel`, `onChange` | root |
| Search | `onChange(event, InputOnChangeData)` | — |
| Select | `appearance`, `size`, `onChange` | root, select, icon |
| Slider | `value`, `defaultValue`, `min`, `max`, `step`, `vertical`, `disabled`, `size`, `onChange` | root, rail, thumb, input |
| Spinbutton | `value`, `defaultValue`, `displayValue`, `min`, `max`, `step`, `stepPage`, `precision`, `appearance`, `size`, `onChange` | — |
| SwatchPicker | `selectedValue`, `defaultSelectedValue`, `onSelectionChange`, `layout` (`row`/`grid`), `focusMode` (`arrow`/`tab`), `size`, `shape`, `spacing` | root |
| Switch | `checked`, `defaultChecked`, `labelPosition` (`above`/`after`/`before`), `disabledFocusable`, `size`, `onChange` | root, indicator, input, label |
| TagPicker | `children` (required), `inline`, `noPopover`, `onOpenChange`, `onOptionSelect` | — |
| Textarea | `value`, `defaultValue`, `appearance`, `resize` (`none`/`horizontal`/`vertical`/`both`), `size`, `onChange` | root, textarea |
| TimepickerCompat | `selectedTime`, `defaultSelectedTime`, `onTimeChange`, `startHour`, `endHour`, `increment`, `dateAnchor`, `formatDateToTimeString`, `parseTimeStringToDate` | — |
| CalendarCompat | **required:** `navigatedDate`, `selectedDate`, `navigationIcons`, `strings`, `onNavigateDate`; optional: `dateRangeType`, `showWeekNumbers`, `minDate`, `maxDate`, `today`, `highlightCurrentMonth`, `highlightSelectedMonth`, `lightenDaysOutsideNavigatedMonth`, `yearPickerHidden`, `onSelectDate`, `onHeaderSelect`, `dateTimeFormatter`, `allFocusable` | — |

### Change-handler data payloads

| Handler | `data` fields |
| --- | --- |
| `onChange` — Input, Textarea, Select, Search | `data.value: string` |
| `onChange` — Checkbox | `data.checked: boolean \| "mixed"` |
| `onChange` — Switch | `data.checked: boolean` |
| `onChange` — Radio | `data.value: string` |
| `onChange` — Slider, Rating | `data.value: number` |
| `onChange` — Spinbutton | `data.value: number \| null`, `data.displayValue` |
| `onOpenChange` — Dialog, Popover, Menu | `data.open: boolean` |
| `onSelectionChange` — Card | `data.selected: boolean` |
| `onSelectDate` — DatepickerCompat | `(date: Date \| null \| undefined)` |
| `onTimeChange` — TimepickerCompat | `(event, data: TimeSelectionData)` |

## 5. Data display

| Component | Props | Slots |
| --- | --- | --- |
| Avatar | `name`, `size`, `shape`, `color` (`neutral`/`brand`/`colorful`/AvatarNamedColor), `idForColor`, `active` (`active`/`inactive`/`unset`), `activeAppearance` (`ring`/`shadow`/`ring-shadow`) | root, image, initials, icon, badge |
| Badge | `appearance`, `color` (`brand`/`danger`/`important`/`informative`/`severe`/`subtle`/`success`/`warning`), `size`, `shape` (`circular`/`rounded`/`square`), `iconPosition` | root, icon |
| Image | `fit` (`none`/`center`/`contain`/`cover`/`default`), `block`, `bordered`, `shadow`, `shape` (`square`/`circular`/`rounded`) | root |
| List | `navigationMode`, `selectionMode`, `selectedItems`, `defaultSelectedItems`, `onSelectionChange` | root |
| Persona | `name`, `size`, `textPosition` (`after`/`before`/`below`), `textAlignment` (`center`/`start`), `presenceOnly` | root, avatar, presence, primaryText, secondaryText, tertiaryText, quaternaryText |
| Skeleton | `animation` (`wave`/`pulse`), `appearance`, `width`, `size`, `shape` (`circle`/`square`/`rectangle`) | root |
| Table | table: `focusMode`, `onSortChange`, `onSelectionChange`, `selectionMode`, `columnSizingOptions`; column: `columnId` + `width` (required), `containerWidthOffset`, `autoFitColumns`, `tableState`; header cell: `sortable`, `truncate`; cell: `truncate`, `sortDirection`, `sortable`, `appearance` (`primary`); row: `appearance` (`brand`/`neutral`/`none`), `subtle`, `hidden`, `invisible`; checkbox/radio cell: `type` (`checkbox`/`radio`), `checked` | root |
| Tags | `root` (required), `value` (required), `hasSecondaryAction` | — |
| Text | `size` (100–1000), `weight` (`regular`/`medium`/`semibold`/`bold`), `font` (`base`/`monospace`/`numeric`), `align` (`start`/`center`/`end`/`justify`), `block`, `italic`, `strikethrough`, `underline`, `truncate`, `wrap` | root |
| Tree | `navigationMode`, `appearance`, `size`, `openItems`, `defaultOpenItems`, `selectionMode`, `checkedItems` | root, collapseMotion |

## 6. Navigation

| Component | Props | Slots |
| --- | --- | --- |
| Breadcrumb | `focusMode` (`arrow`/`tab`), `size` | root, list |
| Link | `appearance` (`default`/`subtle`), `disabled`, `disabledFocusable`, `inline` | root |
| Menu | `children` (required), `open`, `defaultOpen`, `onOpenChange`, `openOnHover`, `openOnContext`, `hoverDelay`, `persistOnItemClick`, `closeOnScroll`, `inline`, `positioning` | surfaceMotion |
| Nav | `selectedValue`, `defaultSelectedValue`, `selectedCategoryValue`, `defaultSelectedCategoryValue`, `openCategories`, `defaultOpenCategories`, `multiple`, `density`, `onNavItemSelect`, `onNavCategoryItemToggle` | root |
| Tabs | tab list: `appearance`, `size` (`small`/`medium`/`large`), `vertical`, `selectedValue`, `defaultSelectedValue`, `onTabSelect`, `reserveSelectedTabSpace`, `disabled`, `selectTabOnFocus`, `onRegister`, `onUnregister`, `previousSelectedValue`, `registeredTabs`; tab: `value` (required), `disabled` | — |

## 7. Feedback

| Component | Props | Slots |
| --- | --- | --- |
| Dialog | `children` (required), `open`, `defaultOpen`, `onOpenChange`, `modalType` (DialogModalType), `inertTrapFocus`, `unmountOnClose` | surfaceMotion |
| MessageBar | `intent` (MessageBarIntent), `politeness` (`assertive`/`polite`), `shape` (`square`/`rounded`) | root, icon, bottomReflowSpacer |
| Progress | `value`, `max`, `shape` (`rounded`/`square`), `thickness` (`medium`/`large`), `color` (`brand`/`success`/`warning`/`error`) | — |
| Spinner | `size`, `appearance`, `labelPosition` (`above`/`below`/`before`/`after`), `delay` | root, spinner, spinnerTail, label |
| Toast | `appearance` | root |
| Tooltip | `relationship` (**required**: `label`/`description`/`inaccessible`), `appearance`, `withArrow`, `showDelay`, `hideDelay`, `visible`, `onVisibleChange`, `positioning`, `ref` | content |

## 8. Overlays

| Component | Props | Slots |
| --- | --- | --- |
| Drawer | `type` (`inline`/`overlay`) | — |
| Popover | `children` (required), `open`, `defaultOpen`, `onOpenChange`, `appearance`, `withArrow`, `size`, `trapFocus`, `inertTrapFocus`, `legacyTrapFocus`, `unstable_disableAutoFocus`, `openOnHover`, `openOnContext`, `mouseLeaveDelay`, `closeOnScroll`, `closeOnIframeFocus`, `inline`, `positioning` | surfaceMotion |
| TeachingPopover | `footerLayout` (`horizontal`/`vertical`), `mediaLength` (`short`/`medium`/`tall`); carousel/step parts: `value` (required), `navType` (required: `next`/`prev`), `handleButtonClick` (required), `initialStepText`/`finalStepText` (required), `altText` (required), `dismissButton` slot, `icon` slot | — |

## 9. Layout

| Component | Props | Slots |
| --- | --- | --- |
| Card | `appearance`, `orientation` (`horizontal`/`vertical`), `size`, `selected`, `defaultSelected`, `onSelectionChange`, `focusMode` (`off`/`no-tab`/`tab-exit`/`tab-only`), `disabled`, `shouldRestrictTriggerAction` | root, floatingAction, checkbox |
| Divider | `alignContent` (`start`/`center`/`end`), `appearance`, `inset`, `vertical` | root, wrapper |

## 10. Utilities

| Component | Props | Slots |
| --- | --- | --- |
| Accordion | `defaultOpenItems`, `openItems`, `collapsible`, `multiple`, `navigation` (`linear`/`circular`), `onToggle` | root |
| Aria | `children` | — |
| Carousel | `defaultActiveIndex`, `activeIndex`, `onActiveIndexChange`, `align` (`center`/`start`/`end`), `appearance` (CarouselAppearance), `circular`, `groupSize` (number \| `"auto"`), `draggable`, `whitespace`, `motion` (CarouselMotion), `announcement`, `autoplayInterval` | root |
| ContextSelector | — | — |
| HeadlessComponentsPreview | — | — |
| MenuGridPreview | `visuallyHidden`; row/cell slots: `root` (required), `icon`, `content`, `subText`, `firstSubAction`, `secondSubAction`, `circular` | — |
| Motion | `children` (required), `imperativeRef`, `onMotionStart`, `onMotionFinish`, `onMotionCancel`, `replayKey`, `appear`; presence: `visible`, `unmountOnExit`, `direction` (required, PresenceDirection) | — |
| MotionComponentsPreview | `children` (required), `visible`, `reversed`, `delayMode`, `hideMode`, `itemDelay`, `itemDuration`, `onMotionFinish` | — |
| Overflow | `id` (required), `groupId`, `children` (required), `onOverflowChange` | — |
| Portal | `children`, `mountNode` (HTMLElement \| `{ element?, className? }` \| null) | — |
| Positioning | — | — |
| Provider | `theme` (PartialTheme), `dir` (`ltr`/`rtl`), `targetDocument`, `applyStylesToPortals`, `customStyleHooks_unstable`, `overrides_unstable` | — |
| Tabster | — | — |
| Utilities | — | — |

## 11. Rules of thumb

- Every controlled component has an uncontrolled twin: `value`/`defaultValue`, `open`/`defaultOpen`, `checked`/`defaultChecked`, `selected`/`defaultSelected`, `selectedValue`/`defaultSelectedValue`, `openItems`/`defaultOpenItems`.
- All handlers follow `(event, data)` where `data` carries the new value — read `data.value`, `data.checked`, `data.open`, `data.selected`.
- Slot props accept either **shorthand** (`label="Name"`, `content="Tip"`) or a JSX element via the named slot (`icon`, `contentBefore`, `contentAfter`, `content`, `hint`, `validationMessage`, `floatingAction`, `checkbox`, `badge`, `presence`).
- Compound families (Dialog, Popover, Menu, Tabs, Tree, Table, Breadcrumb, Accordion, Nav, Drawer, Tooltip) are composed from the parts exported by the same package as their root component.

## Key Takeaways

- `@fluentui/react-components` covers almost everything in one import; only CalendarCompat, DatepickerCompat, TimepickerCompat, ContextSelector, MenuGridPreview, HeadlessComponentsPreview and MotionComponentsPreview live in their own packages.
- Every component exposes the same three families of props: a visual variant (`appearance`), a scale (`size`), and a corner style (`shape`) — but the accepted VALUES differ per component, so check the per-component table before reusing a value.
- Every controlled prop has an uncontrolled twin: `value`/`defaultValue`, `open`/`defaultOpen`, `checked`/`defaultChecked`, `selected`/`defaultSelected`, `selectedValue`/`defaultSelectedValue`, `openItems`/`defaultOpenItems`.
- All change handlers are `(event, data)` — read the new value from `data` (`data.value`, `data.checked`, `data.open`, `data.selected`) instead of from the DOM event.
- Slot props (root, icon, label, input, indicator, contentBefore, contentAfter, content, hint, validationMessage, floatingAction, checkbox, badge, presence, …) accept shorthand strings or JSX elements.
- `Field` is the standard wrapper for form controls: it supplies `label`, `hint`, `validationMessage`, `validationState` and `required` so individual inputs stay unopinionated.
- `disabledFocusable` keeps a control out of interaction but inside the tab order — use it for discoverable-but-unavailable actions; `disabled` removes it from tab order entirely.

## Examples

### Button appearances, sizes and shapes

All five appearances plus size, shape, iconPosition, disabled vs disabledFocusable.

```tsx
import { Button } from '@fluentui/react-components';

// appearance: secondary (default) | primary | outline | subtle | transparent
<Button appearance="primary">Primary</Button>
<Button appearance="secondary">Secondary</Button>
<Button appearance="outline">Outline</Button>
<Button appearance="subtle">Subtle</Button>
<Button appearance="transparent">Transparent</Button>

// size + shape (rounded | circular | square) + iconPosition (before | after)
<Button
  appearance="primary"
  size="large"
  shape="circular"
  iconPosition="after"
  icon={<span aria-hidden="true">→</span>}
>
  Next
</Button>

// disabled removes it from the tab order; disabledFocusable stays tabbable but inert
<Button disabled>Disabled</Button>
<Button disabledFocusable>Disabled but focusable</Button>
```

### Field + Input + Textarea (+ Label)

Wiring Field validation/hint around controlled Input and Textarea using (ev, data) payloads.

```tsx
import * as React from 'react';
import { Field, Input, Label, Textarea } from '@fluentui/react-components';

export const ProfileForm = () => {
  const [name, setName] = React.useState('');
  const [bio, setBio] = React.useState('');

  return (
    <>
      <Field
        label="Name"
        orientation="vertical"
        size="medium"
        required
        hint="First and last name"
        validationState={name ? 'none' : 'error'}
        validationMessage={name ? undefined : 'Name is required'}
      >
        <Input
          appearance="outline"
          size="medium"
          value={name}
          placeholder="Jane Doe"
          onChange={(ev, data) => setName(data.value)}
        />
      </Field>

      <Field label="Bio" validationState="none">
        <Textarea
          appearance="filled-lighter"
          resize="vertical"
          size="medium"
          value={bio}
          onChange={(ev, data) => setBio(data.value)}
        />
      </Field>

      <Label size="small" weight="semibold" required>
        Required field
      </Label>
    </>
  );
};
```

### Selection & input controls

Checkbox (tri-state), Radio, Switch, Slider, Rating and Spinbutton with their onChange data shapes.

```tsx
import * as React from 'react';
import {
  Checkbox,
  Radio,
  Rating,
  Slider,
  Spinbutton,
  Switch,
} from '@fluentui/react-components';

export const Settings = () => {
  const [agree, setAgree] = React.useState<boolean | 'mixed'>(false);
  const [plan, setPlan] = React.useState('basic');
  const [on, setOn] = React.useState(false);
  const [volume, setVolume] = React.useState(30);
  const [stars, setStars] = React.useState(3);
  const [qty, setQty] = React.useState<number | null>(1);

  return (
    <>
      <Checkbox
        checked={agree}
        shape="square"
        size="medium"
        onChange={(ev, data) => setAgree(data.checked)}
      >
        I agree to the terms
      </Checkbox>

      <Radio
        value="basic"
        labelPosition="after"
        onChange={(ev, data) => setPlan(data.value)}
      >
        Basic
      </Radio>

      <Switch
        checked={on}
        labelPosition="after"
        size="medium"
        onChange={(ev, data) => setOn(data.checked)}
      >
        Notifications
      </Switch>

      <Slider
        min={0}
        max={100}
        step={5}
        size="medium"
        value={volume}
        onChange={(ev, data) => setVolume(data.value)}
      />

      <Rating
        max={5}
        step={0.5}
        color="marigold"
        size="medium"
        value={stars}
        onChange={(ev, data) => setStars(data.value)}
      />

      <Spinbutton
        appearance="outline"
        size="medium"
        min={0}
        max={99}
        step={1}
        value={qty}
        onChange={(ev, data) => setQty(data.value)}
      />
    </>
  );
};
```

### Card with Avatar, Badge and Text

Card selection state plus data-display slots (avatar, text, badge) composed as children.

```tsx
import * as React from 'react';
import { Avatar, Badge, Card, Text } from '@fluentui/react-components';

export const ProfileCard = () => {
  const [selected, setSelected] = React.useState(false);

  return (
    <Card
      appearance="outline"
      orientation="vertical"
      size="medium"
      focusMode="tab"
      selected={selected}
      onSelectionChange={(ev, data) => setSelected(data.selected)}
    >
      <Avatar
        name="Ada Lovelace"
        size={48}
        shape="circular"
        color="colorful"
        active="active"
        activeAppearance="ring"
      />
      <Text weight="semibold" size={400} block>
        Ada Lovelace
      </Text>
      <Text size={200} font="numeric" truncate>
        Mathematician
      </Text>
      <Badge appearance="tint" color="success" size="small" iconPosition="before">
        Active
      </Badge>
    </Card>
  );
};
```

### Feedback primitives

MessageBar intent, Spinner size/delay/labelPosition, Progress color & thickness, Skeleton shape.

```tsx
import { MessageBar, Progress, Skeleton, Spinner } from '@fluentui/react-components';

<MessageBar intent="success" politeness="polite" shape="rounded">
  Changes saved.
</MessageBar>

<Spinner
  size="small"
  appearance="primary"
  labelPosition="after"
  label="Loading…"
  delay={300}
/>

<Progress value={40} max={100} shape="rounded" thickness="medium" color="brand" />

<Skeleton animation="wave" appearance="translucent" shape="rectangle" width="240px" />
```

### Controlled overlays: Dialog, Popover, Menu, Tooltip

Open-state wiring for the overlay family plus Tooltip's required relationship prop.

```tsx
import * as React from 'react';
import { Button, Dialog, Menu, Popover, Tooltip } from '@fluentui/react-components';

export const Overlays = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  return (
    <>
      <Dialog
        modalType="modal"
        open={dialogOpen}
        onOpenChange={(ev, data) => setDialogOpen(data.open)}
        inertTrapFocus
        unmountOnClose
      >
        {/* compose the dialog content here */}
      </Dialog>

      <Menu
        open={menuOpen}
        onOpenChange={(ev, data) => setMenuOpen(data.open)}
        openOnHover
        hoverDelay={200}
        persistOnItemClick={false}
      >
        {/* compose menu items here */}
      </Menu>

      <Popover
        open={popoverOpen}
        onOpenChange={(ev, data) => setPopoverOpen(data.open)}
        appearance="inverted"
        withArrow
        trapFocus
      >
        <Button appearance="subtle">Details</Button>
      </Popover>

      <Tooltip
        content="Save changes"
        relationship="description"
        withArrow
        showDelay={200}
        hideDelay={300}
      >
        <Button appearance="primary">Save</Button>
      </Tooltip>
    </>
  );
};
```

### Text input family: Select, Search, Combobox, TagPicker, Infolabel

Native Select, Search onChange payload, freeform Combobox, inline TagPicker and Infolabel.

```tsx
import * as React from 'react';
import {
  Combobox,
  Infolabel,
  Search,
  Select,
  TagPicker,
} from '@fluentui/react-components';

export const Inputs = () => {
  const [city, setCity] = React.useState('sea');
  const [query, setQuery] = React.useState('');

  return (
    <>
      <Select
        appearance="outline"
        size="medium"
        value={city}
        onChange={(ev, data) => setCity(data.value)}
      >
        <option value="sea">Seattle</option>
        <option value="pdx">Portland</option>
      </Select>

      <Search
        placeholder="Search"
        value={query}
        onChange={(ev, data) => setQuery(data.value)}
      />

      <Combobox freeform>
        {/* option children */}
      </Combobox>

      <TagPicker inline noPopover onOptionSelect={(ev, data) => setQuery(data.optionValue)}>
        {/* option children */}
      </TagPicker>

      <Infolabel size="medium" inline info="Region determines data residency.">
        Region
      </Infolabel>
    </>
  );
};
```

## Pitfalls

- Passing `children` to Input or Select — their `children` type is `undefined`. Bind `value` + `onChange` instead; only Combobox, TagPicker, Menu, Dialog, Popover, Field, Motion, MotionComponentsPreview and Overflow take meaningful children.
- Assuming one shared `size` scale. Checkbox only accepts `medium`/`large`, Switch/Slider/Spinbutton/Tree only `small`/`medium`, Badge starts at `tiny`, Spinner starts at `extra-tiny`, and Text uses numeric sizes 100–1000.
- Assuming one shared `appearance` scale. `filled-darker-shadow`/`filled-lighter-shadow` exist on Input/Textarea but not Select; Select supports `underline` while Textarea does not; Tabs and Tree have their own appearance vocabularies.
- Forgetting Tooltip's required `relationship` prop (`label` | `description` | `inaccessible`) — omitting it breaks the accessible description wiring.
- Mixing controlled and uncontrolled props (e.g. `value` together with `defaultValue`, or `open` together with `defaultOpen`) — pick one mode; when controlled you must handle the corresponding `on*Change`.
- Reading the value from `ev.target` in `onChange` instead of from the handler's second `data` argument — Fluent wraps and normalizes the payload for you.
- Treating Checkbox as boolean-only: `checked` can be `"mixed"`, and `CheckboxOnChangeData.checked` is `boolean | "mixed"`.
- Trying to use the compound families (Dialog, Popover, Menu, Tabs, Tree, Table, Breadcrumb, Accordion, Nav, Drawer) as a single element — they are composed from the trigger/surface/item parts exported alongside the root component and placed in `children`.
- Setting `focusMode` on Card inconsistently with interactivity: `off` disables focus/hover styling, `tab-only`/`tab-exit`/`no-tab` change how the card takes focus and keyboard exit.

**Referenced components**: Accordion, Aria, Avatar, Badge, Breadcrumb, Button, CalendarCompat, Card, Carousel, Checkbox, ColorPicker, Combobox, ContextSelector, DatepickerCompat, Dialog, Divider, Drawer, Field, HeadlessComponentsPreview, Image, Infolabel, Input, Label, Link, List, Menu, MenuGridPreview, MessageBar, Motion, MotionComponentsPreview, Nav, Overflow, Persona, Popover, Portal, Positioning, Progress, Provider, Radio, Rating, Search, Select, Skeleton, Slider, Spinbutton, Spinner, SwatchPicker, Switch, Table, Tabs, Tabster, TagPicker, Tags, TeachingPopover, Text, Textarea, TimepickerCompat, Toast, Toolbar, Tooltip, Tree, Utilities

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
