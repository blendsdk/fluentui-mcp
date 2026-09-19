# Common Patterns Cheatsheet

> **Category**: quick-reference

Everything imports from `@fluentui/react-components` unless noted (compat/preview packages in §11).

## 1. Universal state pattern: `default*` ↔ controlled

`default*` = uncontrolled (component owns state). Bare prop + `on*` callback = controlled (you own state). **Never pass both.**

| Component | Uncontrolled | Controlled | Callback | New value in `data` |
| --- | --- | --- | --- | --- |
| Accordion | `defaultOpenItems` | `openItems` | `onToggle` | `data.openItems` |
| Card | `defaultSelected` | `selected` | `onSelectionChange` | `data.selected` |
| Carousel | `defaultActiveIndex` | `activeIndex` | `onActiveIndexChange` | `any` — validate yourself |
| Checkbox | `defaultChecked` | `checked` (`boolean \| 'mixed'`) | `onChange` | `data.checked` |
| DatepickerCompat | `defaultOpen` | `open`, `value` | `onOpenChange`, `onSelectDate` | `data.open` / `date` |
| Dialog | `defaultOpen` | `open` | `onOpenChange` | `data.open` |
| Input | `defaultValue` | `value` | `onChange` | `data.value` |
| List | `defaultSelectedItems` | `selectedItems` | `onSelectionChange` | `data.selectedItems` |
| Menu | `defaultOpen` | `open` | `onOpenChange` | `data.open` |
| Nav | `defaultSelectedValue`, `defaultSelectedCategoryValue`, `defaultOpenCategories` | `selectedValue`, `selectedCategoryValue`, `openCategories` | `onNavItemSelect`, `onNavCategoryItemToggle` | — |
| Popover | `defaultOpen` | `open` | `onOpenChange` | `data.open` |
| Radio | — | `value` | `onChange` | `data.value` |
| Rating | `defaultValue` | `value` | `onChange` | `data.value` |
| Select | — (uncontrolled only) | — | `onChange` | `data.value` |
| Slider | `defaultValue` | `value` | `onChange` | `data.value` |
| SpinButton | `defaultValue` | `value` / `displayValue` | `onChange` | `data.value` / `data.displayValue` |
| SwatchPicker | `defaultSelectedValue` | `selectedValue` | `onSelectionChange` | `data.selectedValue` |
| Switch | `defaultChecked` | `checked` | `onChange` | `data.checked` |
| Tabs | `defaultSelectedValue` | `selectedValue` | `onTabSelect` | `data.value` |
| Textarea | `defaultValue` | `value` | `onChange` | `data.value` |
| TimepickerCompat | `defaultSelectedTime` | `selectedTime` | `onTimeChange` | `data.selectedTime` |
| Toolbar | `defaultCheckedValues` | `checkedValues` | `onCheckedValueChange` | `data.name` + `data.checkedItems` |
| Tree | `defaultOpenItems` | `openItems`, `checkedItems` | — | — |

**Handler shape:** every v9 callback is `(event, data) => void`. Read the new value from `data` — never `event.target.value`.

## 2. Field = label + control + validation + hint

| Field prop | Values |
| --- | --- |
| `label` | Rendered via the `label` slot |
| `orientation` | `'vertical' \| 'horizontal'` |
| `validationState` | `'error' \| 'warning' \| 'success' \| 'none'` |
| `validationMessage` | String/ReactNode shown under the control (`validationMessageIcon` slot) |
| `hint` | Helper text (`hint` slot) |
| `required` | Adds the required marker |
| `size` | `'small' \| 'medium' \| 'large'` |
| slots | `root`, `label`, `validationMessage`, `validationMessageIcon`, `hint` |

- Put the input **as a child of `Field`** — do not add a second `Label`.
- Standalone `Label`: `disabled`, `required`, `size`, `weight` (`'regular' \| 'semibold'`).
- `validationState` alone shows nothing: always supply `validationMessage`.

## 3. Overlay patterns

| Component | Pattern props | Notes |
| --- | --- | --- |
| Tooltip | `relationship` **(required: `'label' \| 'description' \| 'inaccessible'`)**, `content`, `appearance` (`normal`/`inverted`), `withArrow`, `showDelay`, `hideDelay`, `visible`, `onVisibleChange`, `positioning` | `relationship='label'` for icon-only triggers; `'description'` for extra detail |
| Popover | `open`/`defaultOpen`/`onOpenChange`, `openOnHover`, `openOnContext`, `mouseLeaveDelay`, `withArrow`, `inline`, `appearance`, `size`, `trapFocus`, `legacyTrapFocus`, `inertTrapFocus`, `unstable_disableAutoFocus`, `closeOnScroll`, `closeOnIframeFocus`, `positioning` | `inline` renders in place (skips the portal); prefer `inertTrapFocus` |
| Menu | `open`/`defaultOpen`/`onOpenChange`, `openOnHover`, `openOnContext`, `hoverDelay`, `persistOnItemClick`, `inline`, `closeOnScroll`, `positioning` | `persistOnItemClick` keeps the menu open (multi-select) |
| Dialog | `open`/`defaultOpen`/`onOpenChange`, `modalType`, `inertTrapFocus`, `unmountOnClose` | `unmountOnClose` resets inner state (e.g. forms) |
| Drawer | `type` (`'inline' \| 'overlay'`) | Pair with your own open/close state |
| TeachingPopover | coaching steps: `footerLayout`, page-count / nav-button render props, `mediaLength` | Onboarding/tour pattern |

## 4. Selection & collection state

| Component | State props | Notes |
| --- | --- | --- |
| Card | `selected`, `defaultSelected`, `onSelectionChange`, `focusMode` (`'off' \| 'no-tab' \| 'tab-exit' \| 'tab-only'`), `disabled`, `shouldRestrictTriggerAction`, `appearance`, `orientation`, `size` | slots `root`, `floatingAction`, `checkbox` |
| List | `selectionMode`, `selectedItems`, `defaultSelectedItems`, `onSelectionChange`, `navigationMode` | — |
| SwatchPicker | `selectedValue`, `defaultSelectedValue`, `onSelectionChange`, `layout` (`row`/`grid`), `focusMode` (`arrow`/`tab`), `size`, `shape`, `spacing` | — |
| Tree | `openItems`, `defaultOpenItems`, `selectionMode`, `checkedItems`, `navigationMode`, `appearance` (`subtle`/`subtle-alpha`/`transparent`), `size` | — |
| Tabs | `selectedValue`, `defaultSelectedValue`, `onTabSelect`, `selectTabOnFocus`, `reserveSelectedTabSpace`, `appearance` (`transparent`/`subtle`/`subtle-circular`/`filled-circular`), `size`, `vertical`, `disabled` | `reserveSelectedTabSpace` prevents layout shift |
| Toolbar | `checkedValues`, `defaultCheckedValues`, `onCheckedValueChange`, `vertical`, `size` | values keyed by group name |
| Table | `selectionMode`, `onSelectionChange`, `focusMode`, `sortable`/`sortDirection`/`onSortChange`, `columnSizingOptions`, `autoFitColumns`, `containerWidthOffset`, `visible`, `truncate`, `subtle` | — |
| Nav | selected value + open categories (see §1), `density`, `multiple` | — |

## 5. Theming, direction, portals

| Component | Props | Notes |
| --- | --- | --- |
| FluentProvider | `theme` (PartialTheme), `dir` (`'ltr' \| 'rtl'`), `targetDocument`, `applyStylesToPortals`, `customStyleHooks_unstable`, `overrides_unstable` | Root of the app. Portals need `applyStylesToPortals` (or a mount node inside the FluentProvider) to inherit theme + direction |
| Portal | `children`, `mountNode` (`HTMLElement \| { element?, className? } \| null`) | Renders outside the DOM tree while keeping React context |
| Positioning / Tabster / Utilities / ContextSelector / Aria | No props documented except `Aria.children` | `Aria` = a11y-only wrapper for custom slot rendering |

## 6. Forms & data entry

| Component | Key props |
| --- | --- |
| Input | `value`/`defaultValue`, `onChange`, `size`, `appearance` (`outline`/`underline`/`filled-darker`/`filled-lighter`/`filled-darker-shadow`/`filled-lighter-shadow`), `type` (`number`/`text`/`email`/`password`/`search`/`tel`/`url`/`date`/`datetime-local`/`month`/`time`/`week`), slots `contentBefore`/`contentAfter` |
| Textarea | `value`/`defaultValue`, `onChange`, `resize` (`none`/`horizontal`/`vertical`/`both`), `appearance`, `size` |
| Select | `onChange`, `appearance`, `size` |
| Combobox | `freeform`, `children`, slots `expandIcon`/`clearIcon`/`input`/`listbox` |
| Search | `onChange` (`SearchBoxChangeEvent`, `InputOnChangeData`) |
| Checkbox | `checked`/`defaultChecked` (`'mixed'`), `onChange`, `labelPosition` (`before`/`after`), `shape` (`square`/`circular`), `size` (`medium`/`large`) |
| Radio | `value`, `onChange`, `labelPosition` (`after`/`below`), `disabled` |
| Switch | `checked`/`defaultChecked`, `onChange`, `labelPosition` (`above`/`after`/`before`), `size`, `disabledFocusable` |
| Slider | `value`/`defaultValue`, `onChange`, `min`/`max`/`step`, `vertical`, `size`, `disabled` |
| SpinButton | `value`/`defaultValue`/`displayValue`, `onChange`, `min`/`max`, `step`/`stepPage`, `precision`, `appearance`, `size` |
| Rating | `value`/`defaultValue`, `onChange`, `max`, `step` (0.5/1), `size`, `color`, `itemLabel`, `name`, `iconFilled`/`iconOutline` |
| ColorPicker | `color` (HsvColor), `onColorChange`, `shape` (`rounded`/`square`) |
| TagPicker | `noPopover`, `inline`, `onOptionSelect`, `onOpenChange` |
| InfoLabel | `size`, `inline`, `info`, `popover` |
| DatepickerCompat | `value`, `onSelectDate`, `open`/`defaultOpen`/`onOpenChange`, `allowTextInput`, `formatDate`/`parseDateFromString`, `onValidationResult`, `minDate`/`maxDate`, `firstDayOfWeek`, `firstWeekOfYear`, `showWeekNumbers`, `showGoToToday`, `inlinePopup`, `positioning`, `required`, `borderless`, `underlined`, `placeholder`, `today`, `initialPickerDate`, `isMonthPickerVisible`, `showMonthPickerAsOverlay`, `disableAutoFocus`, `openOnClick`, `showCloseButton`, `strings`, `dateTimeFormatter`, `allFocusable`, `highlightCurrentMonth`, `highlightSelectedMonth` |
| TimepickerCompat | `selectedTime`/`defaultSelectedTime`, `onTimeChange`, `startHour`/`endHour`, `increment`, `dateAnchor`, `formatDateToTimeString`, `parseTimeStringToDate` |
| CalendarCompat | Fully controlled: `navigatedDate`, `selectedDate`, `navigationIcons`, `strings` **(all required)** + `onNavigateDate` (required); plus `onSelectDate`, `dateRangeType`, `minDate`/`maxDate`, `showWeekNumbers`, `lightenDaysOutsideNavigatedMonth`, year-picker props |

## 7. Feedback, loading & progress

| Component | Props |
| --- | --- |
| Spinner | `size` (extra-tiny → huge), `appearance` (`primary`/`inverted`), `labelPosition` (`above`/`below`/`before`/`after`), `delay` (avoids flash on fast loads); slots `root`/`spinner`/`spinnerTail`/`label` |
| Skeleton | `animation` (`wave`/`pulse`), `appearance` (`opaque`/`translucent`), `shape` (`circle`/`square`/`rectangle`), `size`, `width` |
| ProgressBar | `value`, `max`, `thickness` (`medium`/`large`), `color` (`brand`/`success`/`warning`/`error`), `shape` (`rounded`/`square`) |
| MessageBar | `intent`, `politeness` (`assertive`/`polite`), `shape` (`square`/`rounded`); slots `root`/`icon`/`bottomReflowSpacer` |
| Toast | `appearance` |

## 8. Layout, responsiveness & density

| Component | Cheat props |
| --- | --- |
| Card | `appearance` (`filled`/`filled-alternative`/`outline`/`subtle`), `orientation`, `size` |
| Divider | `alignContent` (`start`/`center`/`end`), `appearance` (`brand`/`default`/`strong`/`subtle`), `inset`, `vertical` |
| Image | `block`, `bordered`, `fit` (`none`/`center`/`contain`/`cover`/`default`), `shadow`, `shape` (`square`/`circular`/`rounded`) |
| Overflow | `id` **(required)**, `groupId`, `children` (ReactElement), `onOverflowChange` → `OverflowState` |
| Carousel | `activeIndex`/`defaultActiveIndex`, `onActiveIndexChange`, `groupSize` (number or `'auto'`), `align` (`start`/`center`/`end`), `draggable`, `whitespace`, `circular`, `appearance`, `motion`, `autoplayInterval`, `announcement` |
| Text | `size` 100–1000, `weight`, `font`, `align`, `block`, `truncate`, `wrap`, `italic`, `underline`, `strikethrough` |
| Breadcrumb | `size`, `focusMode` (`arrow`/`tab`); slots `root`/`list` |
| Avatar | `name`, `size`, `shape`, `color` (`neutral`/`brand`/`colorful`/named), `active`, `activeAppearance` (`ring`/`shadow`/`ring-shadow`), `idForColor` |
| Persona | `name`, `size`, `textPosition` (`after`/`before`/`below`), `textAlignment`, `presenceOnly`; slots up to `quaternaryText` |
| Badge | `appearance`, `color`, `size`, `shape`, `iconPosition` |
| Accordion | `collapsible`, `multiple`, `navigation` (`linear`/`circular`) |
| Image/Link/Text | `Link`: `appearance`, `inline`, `disabled`, `disabledFocusable` |

## 9. Accessibility & motion

- `Tooltip.relationship` is **required** — model the a11y relationship, not just visuals.
- `Dialog` / `Popover`: `inertTrapFocus` for modern focus trapping; `Popover` also has `legacyTrapFocus` and `trapFocus`.
- `MessageBar.politeness` (`'polite'` vs `'assertive'`) controls screen-reader urgency.
- `Aria` (`children`) wraps custom markup so Fluent slots stay a11y-correct.
- `Motion`: `children` (required), `appear`, `visible`, `direction` (remote/presence variants), `unmountOnExit`, `replayKey`, `imperativeRef`, `onMotionStart` / `onMotionFinish` / `onMotionCancel`.
- `MotionComponentsPreview` (`visible`, `itemDelay`/`itemDuration`, `delayMode`, `hideMode`, `reversed`, `onMotionFinish`) for staggered lists.
- `MenuGridPreview`: `visuallyHidden`, `root`, `icon`/`content`/`subText`/`firstSubAction`/`secondSubAction` slots, `circular`.

## 10. Slots map — customize with a prop named after the slot

| Component | Slots |
| --- | --- |
| Accordion, Nav, Table, Rating, Text, Tags | `root` |
| Button | `root`, `icon` |
| Badge | `root`, `icon` |
| Avatar | `root`, `image`, `initials`, `icon`, `badge` |
| Breadcrumb | `root`, `list` |
| Card | `root`, `floatingAction`, `checkbox` |
| Checkbox / Radio | `root`, `label`, `input`, `indicator` |
| Combobox | `root`, `expandIcon`, `clearIcon`, `input`, `listbox` |
| Divider | `root`, `wrapper` |
| Field | `root`, `label`, `validationMessage`, `validationMessageIcon`, `hint` |
| Input | `root`, `input`, `contentBefore`, `contentAfter` |
| Textarea | `root`, `textarea` |
| Select | `root`, `select`, `icon` |
| Slider | `root`, `rail`, `thumb`, `input` |
| Spinner | `root`, `spinner`, `spinnerTail`, `label` |
| Switch | `root`, `indicator`, `input`, `label` |
| MessageBar | `root`, `icon`, `bottomReflowSpacer` |
| Dialog / Menu / Popover | `surfaceMotion` |
| Tooltip | `content` |
| Tree | `root`, `collapseMotion` |
| Persona | `root`, `avatar`, `presence`, `primaryText`, `secondaryText`, `tertiaryText`, `quaternaryText` |

## 11. Import map

| Package | Exports |
| --- | --- |
| `@fluentui/react-components` | Everything in this sheet not listed below |
| `@fluentui/react-calendar-compat` | `CalendarCompat` |
| `@fluentui/react-datepicker-compat` | `DatepickerCompat` |
| `@fluentui/react-timepicker-compat` | `TimepickerCompat` |
| `@fluentui/react-context-selector` | `ContextSelector` |
| `@fluentui/react-headless-components-preview` | `HeadlessComponentsPreview` |
| `@fluentui/react-menu-grid-preview` | `MenuGridPreview` |
| `@fluentui/react-motion-components-preview` | `MotionComponentsPreview` |

## Key Takeaways

- Every stateful component follows the same two-mode API: default* prop = uncontrolled, bare prop + on* callback = controlled. Never pass both at once.
- v9 callbacks are (event, data) => void — read the new value from `data` (e.g. data.value, data.checked, data.open, data.openItems), not from the DOM event.
- Field is the single wrapper for label + validationMessage + validationMessageIcon + hint; do not nest a separate Label inside it, and always pair validationState with a message.
- Slots are customized with a prop named after the slot (icon, contentBefore, contentAfter, floatingAction, checkbox, surfaceMotion…); the root slot uses className directly.
- Wrap the app in Provider (theme, dir, applyStylesToPortals); portals and overlays only inherit theme/RTL when applyStylesToPortals is enabled or the mount node sits inside the provider.
- Tooltip requires `relationship` ('label' | 'description' | 'inaccessible') — it is an accessibility contract, not decoration.
- Collections (Accordion, Tabs, Tree, List, Toolbar, Nav) hand you complete state arrays/objects from the handler; replace state wholesale instead of manually pushing/popping.
- CalendarCompat is fully controlled (navigatedDate, selectedDate, navigationIcons, strings, onNavigateDate all required) — prefer DatepickerCompat for the batteries-included experience.
- Compat and preview components live in separate packages (@fluentui/react-calendar-compat, react-datepicker-compat, react-timepicker-compat, react-context-selector, react-headless-components-preview, react-menu-grid-preview, react-motion-components-preview).

## Examples

### Controlled vs uncontrolled values

The core pattern: swap a default* prop for a value prop + onChange and read the new value from `data`.

```tsx
import * as React from 'react';
import { Checkbox, Input, Slider, Switch, Textarea } from '@fluentui/react-components';

export const SettingsForm = () => {
  const [name, setName] = React.useState('');
  const [enabled, setEnabled] = React.useState(false);
  const [terms, setTerms] = React.useState<boolean | 'mixed'>(false);
  const [volume, setVolume] = React.useState(50);
  const [notes, setNotes] = React.useState('');

  return (
    <>
      {/* controlled: value + onChange, new value in data.value */}
      <Input value={name} onChange={(_, data) => setName(data.value)} placeholder="Name" />

      {/* uncontrolled: only the default* prop */}
      <Input defaultValue="Untouched initial value" appearance="outline" size="medium" />

      <Switch checked={enabled} onChange={(_, data) => setEnabled(data.checked)} label="Enable sync" />
      <Checkbox checked={terms} onChange={(_, data) => setTerms(data.checked)} label="Accept terms" />
      <Slider value={volume} min={0} max={100} onChange={(_, data) => setVolume(data.value)} />
      <Textarea value={notes} onChange={(_, data) => setNotes(data.value)} resize="vertical" />
    </>
  );
};
```

### Field wrapper: label + validation + hint

One Field wraps the label, control, validation message and hint — no extra Label component.

```tsx
import * as React from 'react';
import { Field, Input, Select } from '@fluentui/react-components';

export const AccountFields = () => {
  const [email, setEmail] = React.useState('');
  const invalid = email.length > 0 && !email.includes('@');

  return (
    <>
      <Field
        label="Email"
        required
        orientation="vertical"
        size="medium"
        validationState={invalid ? 'error' : 'none'}
        validationMessage={invalid ? 'Enter a valid email address.' : undefined}
        hint="Used for release notifications only."
      >
        <Input type="email" value={email} onChange={(_, data) => setEmail(data.value)} />
      </Field>

      <Field
        label="Role"
        orientation="horizontal"
        validationState="success"
        validationMessage="Looks good."
      >
        <Select onChange={(_, data) => console.log(data.value)}>
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </Select>
      </Field>
    </>
  );
};
```

### Overlays: Dialog (controlled), Popover (hover), Menu (context), Tooltip (required relationship)

Overlay state is plain React state; Tooltip always needs a `relationship` value.

```tsx
import * as React from 'react';
import { Button, Dialog, Menu, Popover, Tooltip } from '@fluentui/react-components';

export const OverlayPatterns = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <>
      <Dialog
        open={dialogOpen}
        onOpenChange={(_, data) => setDialogOpen(data.open)}
        modalType="modal"
        inertTrapFocus
        unmountOnClose
      >
        <Button appearance="primary" onClick={() => setDialogOpen(true)}>
          Open dialog
        </Button>
      </Dialog>

      <Popover openOnHover withArrow mouseLeaveDelay={500} appearance="brand" positioning={{ position: 'above' }}>
        <Button appearance="outline">Hover target</Button>
      </Popover>

      <Menu openOnContext closeOnScroll hoverDelay={200} onOpenChange={(_, data) => console.log(data.open)}>
        <Button appearance="subtle">Right-click me</Button>
      </Menu>

      <Tooltip content="Save your work" relationship="description" withArrow showDelay={200} hideDelay={100}>
        <Button appearance="primary">Save</Button>
      </Tooltip>
    </>
  );
};
```

### Provider + Portal: theme, RTL and portal styling

Wrap the app once; keep overlays themed and RTL-aware via applyStylesToPortals or a themed mount node.

```tsx
import * as React from 'react';
import { Button, Portal, FluentProvider } from '@fluentui/react-components';

export const AppShell = ({ children }: { children: React.ReactNode }) => (
  <FluentProvider
    dir="rtl"
    applyStylesToPortals
    targetDocument={document}
    theme={{ fontFamilyBase: "'Segoe UI', sans-serif" }}
  >
    {children}

    {/* Renders outside the DOM tree but keeps React context + theme */}
    <Portal mountNode={{ className: 'app-portal-root' }}>
      <Button appearance="primary">Portal-rendered action</Button>
    </Portal>
  </FluentProvider>
);
```

### Collections: controlled Accordion + TabList, uncontrolled Carousel

Accordion and Tabs take the full state from the handler data; Carousel can run uncontrolled with defaults.

```tsx
import * as React from 'react';
import { Accordion, Carousel, TabList } from '@fluentui/react-components';

export const Collections = ({
  accordionItems,
  tabContent,
  slides,
}: {
  accordionItems: React.ReactNode;
  tabContent: React.ReactNode;
  slides: React.ReactNode;
}) => {
  const [openItems, setOpenItems] = React.useState<(string | number)[]>(['item-1']);
  const [tab, setTab] = React.useState<string | number>('overview');

  return (
    <>
      <Accordion
        multiple
        collapsible
        navigation="circular"
        openItems={openItems}
        onToggle={(_, data) => setOpenItems(data.openItems)}
      >
        {accordionItems}
      </Accordion>

      <TabList
        selectedValue={tab}
        onTabSelect={(_, data) => setTab(data.value)}
        appearance="subtle"
        size="medium"
        reserveSelectedTabSpace
      >
        {tabContent}
      </TabList>

      <Carousel
        defaultActiveIndex={0}
        groupSize="auto"
        align="start"
        circular
        draggable
        whitespace
        autoplayInterval={5000}
      >
        {slides}
      </Carousel>
    </>
  );
};
```

### Selection: Card, List, SwatchPicker

Same selected/defaultSelected + on*Change pattern across selectable surfaces.

```tsx
import * as React from 'react';
import { Card, List, SwatchPicker, Text } from '@fluentui/react-components';

export const Selectable = ({ rows }: { rows: React.ReactNode }) => {
  const [selected, setSelected] = React.useState(false);
  const [items, setItems] = React.useState<(string | number)[]>([]);
  const [swatch, setSwatch] = React.useState<string | undefined>(undefined);

  return (
    <>
      <Card
        appearance="outline"
        orientation="vertical"
        size="medium"
        focusMode="tab-only"
        selected={selected}
        onSelectionChange={(_, data) => setSelected(data.selected)}
        floatingAction={<Text size={200}>New</Text>}
      >
        <Text weight="semibold" truncate>
          Q3 report
        </Text>
      </Card>

      <List
        selectionMode="multiselect"
        selectedItems={items}
        onSelectionChange={(_, data) => setItems(data.selectedItems)}
      >
        {rows}
      </List>

      <SwatchPicker
        layout="grid"
        size="medium"
        shape="circular"
        spacing="small"
        selectedValue={swatch}
        onSelectionChange={(_, data) => setSwatch(data.selectedValue)}
      />
    </>
  );
};
```

### Loading & feedback states

Spinner delay avoids flashing; Skeleton mirrors the final layout; MessageBar politeness controls urgency.

```tsx
import * as React from 'react';
import { MessageBar, ProgressBar, Skeleton, Spinner } from '@fluentui/react-components';

export const LoadingStates = () => (
  <>
    <Spinner size="tiny" appearance="primary" labelPosition="after" label="Loading results…" delay={300} />

    <Skeleton animation="wave" appearance="translucent" shape="rectangle" width="240px" size={16} />
    <Skeleton animation="pulse" appearance="opaque" shape="circle" width={40} />

    <ProgressBar value={40} max={100} thickness="large" color="brand" shape="rounded" />

    <MessageBar shape="rounded" politeness="polite">
      Changes are saved automatically.
    </MessageBar>
  </>
);
```

### Slot props: contentBefore/contentAfter, icon, floatingAction

Every slot listed in §10 is addressable by a prop of the same name; className targets the root.

```tsx
import * as React from 'react';
import { Button, Card, Input, Text } from '@fluentui/react-components';

export const SlotComposition = () => (
  <>
    <Input
      className="my-field"
      appearance="filled-darker"
      size="medium"
      contentBefore={<Text size={200}>@</Text>}
      contentAfter={<Text size={200}>.com</Text>}
    />

    <Button
      appearance="subtle"
      shape="circular"
      icon={<Text aria-hidden>★</Text>}
      iconPosition="after"
    />

    <Card
      appearance="outline"
      orientation="vertical"
      size="small"
      floatingAction={
        <Button appearance="primary" size="small">
          Open
        </Button>
      }
    >
      <Text truncate>Long title that fades out…</Text>
    </Card>
  </>
);
```

## Pitfalls

- Passing both `value` and `defaultValue` (or `open` and `defaultOpen`): the default is ignored once controlled and React logs a controlled/uncontrolled switch warning on the next render.
- Controlled input without onChange — the value never changes and typing appears frozen; add the handler or drop the value prop.
- Reading `event.target.value` instead of `data.value`: TS may even complain since the handler's first arg is typed for the component, not the DOM node.
- Rendering overlays outside a Provider's style scope: without `applyStylesToPortals` (or a mount node inside the provider) portal content loses theme tokens, RTL direction and stacking order.
- Omitting `Tooltip.relationship` — it is a required prop; the component will not behave accessibly without it.
- Expecting Dialog content to reset itself: children stay mounted by default. Add `unmountOnClose` to clear form state between openings.
- Setting `validationState='error'` without `validationMessage` shows nothing visible; supply the message (and optionally validationMessageIcon).
- Recomputing Accordion/Tree open state manually (e.g. toggling from event.target) instead of using `data.openItems` — you can create duplicate or unordered entries.
- Changing `Overflow.id` between renders: the registered child items reset because the id keys the overflow group.
- Treating `Carousel.onActiveIndexChange` as typed: its payload type is `any`, so validate/normalize the index (e.g. `Number(...)`) before storing it.
- Nesting a Label inside Field, or wrapping inputs in both Field and a manual label, produces duplicate labels and broken aria associations.
- Assuming Table's sorting/cell focus props work without the data-grid wrapper props — column sizing and selection are configured through `columnSizingOptions`, `selectionMode` and `focusMode`, not per-cell.

**Referenced components**: Provider, Portal, Aria, Accordion, Avatar, Badge, Breadcrumb, Button, CalendarCompat, Card, Carousel, Checkbox, ColorPicker, Combobox, ContextSelector, DatepickerCompat, Dialog, Divider, Drawer, Field, HeadlessComponentsPreview, Image, Infolabel, Input, Label, Link, List, Menu, MenuGridPreview, MessageBar, Motion, MotionComponentsPreview, Nav, Overflow, Persona, Popover, Positioning, Progress, Radio, Rating, Search, Select, Skeleton, Slider, Spinbutton, Spinner, SwatchPicker, Switch, Tabster, Table, Tabs, TagPicker, Tags, TeachingPopover, Text, Textarea, TimepickerCompat, Toast, Toolbar, Tooltip, Tree, Utilities

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
