# Accessibility Checklist

> **Category**: quick-reference

**Verify order for every component:** Name → Role → State → Keyboard → Focus → Announce.

**Import note:** everything below comes from `@fluentui/react-components`, except `CalendarCompat` (`@fluentui/react-calendar-compat`), `DatepickerCompat` (`@fluentui/react-datepicker-compat`) and `TimepickerCompat` (`@fluentui/react-timepicker-compat`).

**Escape hatch:** components that expose a `root` slot forward native attributes (`id`, `aria-label`, `aria-labelledby`, `aria-describedby`, `role`, `tabIndex`) to the DOM element. Use them when no Fluent prop exists.

---

## 1. Name every control

| Component | A11y-relevant API | Rule |
|---|---|---|
| `Field` | `label`, `hint`, `required`, `validationState` (`error` / `warning` / `success` / `none`), `orientation`, `size`, slots `label` / `validationMessage` / `validationMessageIcon` / `hint` | Preferred wrapper for **every** form control — associates label + hint + error with the control |
| `Label` | `required`, `disabled`, `weight`, `size`, slot `required` | Standalone labelling only; prefer `Field` around controls |
| `Aria` | `children` | Renders screen-reader-only text; give the wrapper an `id` and point `aria-labelledby` / `aria-describedby` at it |
| `Tooltip` | `relationship` (**required**: `label` / `description` / `inaccessible`), `visible`, `showDelay`, `hideDelay`, `withArrow`, `appearance`, `positioning`, `onVisibleChange`, `content` slot | `label` = the only name of an icon-only control · `description` = extra detail · `inaccessible` = text is already in the control and would double-announce |
| `Rating` | `itemLabel: (rating) => string`, `max`, `step`, `value`, `name`, `size`, `color` | Name each star, e.g. `3 of 5 stars` |
| `Infolabel` | `info`, `inline`, `size`, `popover` | The info trigger must be keyboard reachable and named |
| `Avatar` | `name` (supplies the accessible label), `active`, `activeAppearance`, `color`, `idForColor`, `shape`, `size`, slots `image` / `initials` / `icon` / `badge` | Never rely on color/initials alone — set `name` |
| `Persona` | `name`, `presenceOnly`, `textPosition`, `textAlignment`, `size`, slots `avatar` / `presence` / `primaryText` … | `presenceOnly` drops all text: supply an accessible name and describe presence in text |
| `Image` | `block`, `bordered`, `fit`, `shadow`, `shape` | Meaningful image → text alternative; decorative image → keep it out of the accessibility tree |
| `Text` | `truncate`, `block`, `wrap`, `font`, `align`, `size`, `weight`, `italic`, `underline`, `strikethrough` | If `truncate` visually cuts the string, expose the full string in a `Tooltip` |
| `Badge` | `appearance`, `color`, `iconPosition`, `shape`, `size`, `icon` slot | Status must be readable as text, not only as color/shape |
| `Input` | `type` (`email`, `tel`, `url`, `number`, `password`, `search`, `date`, `datetime-local`, `month`, `time`, `week`), `size`, `appearance`, `value`, `defaultValue`, `onChange`, slots `contentBefore` / `contentAfter` | `type` drives semantics + mobile keyboard; slotted icons need names |
| `Textarea` | `appearance`, `resize`, `size`, `value`, `defaultValue`, `onChange` | Same labelling rules as `Input` |
| `Search` | `onChange` | Give it a visible label and announce result counts |
| `Spinbutton` | `value`, `displayValue`, `min`, `max`, `step`, `stepPage`, `precision`, `size`, `appearance` | `displayValue` lets you format the read-out (e.g. `12 px`) |
| `Select` | `appearance`, `size`, `onChange` | Keep a visible label; native select needs no custom key handling |
| `Combobox` | `freeform`, slots `expandIcon` / `clearIcon` / `input` / `listbox` / `root` | Custom expand/clear icons must carry names; clearable must be keyboard operable |
| `TagPicker` | `noPopover`, `onOpenChange`, `onOptionSelect`, `inline` | Combobox pattern: announce the number of selected tags |
| `Tags` | `root` (button), `value` (required), `hasSecondaryAction` | Avoid nesting interactive elements; the tag is already a button |
| `Slider` | `min`, `max`, `step`, `value`, `defaultValue`, `disabled`, `vertical` | Label via `Field`; the current value must be human-readable |
| `Checkbox` | `checked` (`boolean` / `mixed`), `defaultChecked`, `shape`, `size`, `labelPosition`, `onChange` | `mixed` = indeterminate; the label must state what partial selection means |
| `Switch` | `checked`, `defaultChecked`, `labelPosition`, `size`, `disabledFocusable` | The label is part of the control name — keep it short and specific |
| `Radio` | `value`, `labelPosition`, `disabled`, `onChange` | The group needs its own label (`Field` / `Label`) |
| `ColorPicker` | `color`, `onColorChange`, `shape` | Never the only signal — pair with a text name/value |
| `SwatchPicker` | `selectedValue`, `defaultSelectedValue`, `onSelectionChange`, `focusMode` (`arrow` / `tab`), `layout`, `shape`, `size`, `spacing` | Use `focusMode="arrow"` for one tab stop per set |
| `CalendarCompat` | `selectedDate`, `navigatedDate`, `onSelectDate`, `onNavigateDate`, `minDate`, `maxDate`, `strings`, `navigationIcons`, `allFocusable`, `showWeekNumbers`, `showGoToToday` | Announce the selected date in text; keep navigation icons named |
| `DatepickerCompat` | `value`, `onSelectDate`, `allowTextInput`, `required`, `disabled`, `minDate`, `maxDate`, `formatDate`, `parseDateFromString`, `onValidationResult`, `showCloseButton`, `inlinePopup`, `positioning` | Provide `allowTextInput` so date entry is not pointer-only; surface `onValidationResult` messages |
| `TimepickerCompat` | `selectedTime`, `defaultSelectedTime`, `onTimeChange`, `startHour`, `endHour`, `increment`, `dateAnchor`, `formatDateToTimeString`, `parseTimeStringToDate` | Announce the chosen time as text, keep hour range inclusive |

## 2. Keyboard & focus

| Component | Prop | Values | Meaning |
|---|---|---|---|
| `Tabs` | `selectTabOnFocus` | boolean | Arrows move focus **and** selection (recommended for panels) |
| `Tabs` | `vertical` | boolean | Up/Down arrows instead of Left/Right |
| `Tabs` | `disabled` | boolean | Disabled tab is not selectable — never the only way to reach required content |
| `Tree` | `navigationMode` | `TreeNavigationMode` | Arrow-key roving tab index vs. plain tabbing |
| `List` | `navigationMode` | `ListNavigationMode` | Same choice for list-like widgets |
| `Breadcrumb` | `focusMode` | `arrow` / `tab` | `arrow` = one tab stop, arrows move between links |
| `Card` | `focusMode` | `off` / `no-tab` / `tab-exit` / `tab-only` | Interactive card that must stay tabbable → `tab-exit`; `tab-only` keeps focus on the card itself |
| `Accordion` | `navigation` | `linear` / `circular` | Which header receives focus on open/collapse; `collapsible`, `multiple`, `openItems`, `onToggle` control which panels can be opened |
| `Toolbar` | `vertical` | boolean | Arrow direction for the toolbar |
| `Toolbar` | `checkedValues`, `onCheckedValueChange` | — | Toggle buttons must expose a pressed state and be keyboard operable |
| `Menu` | `openOnContext`, `openOnHover` | boolean | Always offer a keyboard equivalent (never hover-only) |
| `Menu` | `persistOnItemClick`, `closeOnScroll`, `hoverDelay`, `inline`, `positioning` | — | Escape must close; focus returns to the trigger |
| `Nav` | `selectedValue`, `multiple`, `defaultOpenCategories`, `onNavCategoryItemToggle`, `density` | — | Mark the current page programmatically, not with color alone |
| `SwatchPicker` / `Breadcrumb` | `focusMode` | `arrow` / `tab` | See above |
| `Table` | `focusMode` | `DataGridCellFocusMode` | Grid/cell navigation |
| `Table` | `selectionMode`, `onSelectionChange`, `columnSizingOptions`, `columnId`, `width`, `containerWidthOffset`, `autoFitColumns`, `tableState` | — | Selection must be keyboard-operable and announced |
| `Table` cells | `sortable`, `sortDirection` | boolean / `SortDirection` | Drives the sort affordance + announcement |
| `Table` selection cells | `type` (`checkbox` / `radio`), `checked`, `subtle`, `hidden`, `invisible`, `appearance` | — | Hidden ≠ removed from AT — check `invisible`/`hidden` usage |
| `Carousel` | `draggable`, `circular`, `groupSize`, `align`, `whitespace` | — | Dragging must never be the only way to change slides |
| `Button` / `Link` / `Switch` | `disabledFocusable` | boolean | Keeps an unavailable control in the tab order and announces it as disabled |
| `MenuGridPreview` | `visuallyHidden`, `root`, `icon`, `content`, `subText`, `firstSubAction`, `secondSubAction`, `circular` | — | Use `visuallyHidden` for screen-reader-only row text |

## 3. Overlays, focus traps & focus return

| Component | Prop | Values | Rule |
|---|---|---|---|
| `Dialog` | `modalType` | `modal` / `non-modal` / `alert` | `alert` for blocking/confirm flows |
| `Dialog` | `inertTrapFocus` | boolean | Preferred trap: background becomes inert, focus cannot escape |
| `Dialog` | `open`, `defaultOpen`, `onOpenChange`, `unmountOnClose` | — | Escape/close must return focus to the trigger — keep the trigger mounted |
| `Popover` | `trapFocus`, `inertTrapFocus`, `legacyTrapFocus` | boolean | Pick **one** trap strategy; modal surfaces trap, non-modal surfaces must not |
| `Popover` | `unstable_disableAutoFocus` | boolean | `true` for non-modal popovers that should not steal focus |
| `Popover` | `openOnHover`, `openOnContext`, `mouseLeaveDelay`, `closeOnIframeFocus`, `closeOnScroll`, `withArrow`, `size`, `positioning`, `onOpenChange` | — | Prevent stuck overlays; hover triggers need keyboard equivalents |
| `Drawer` | `type` | `inline` / `overlay` | `overlay` must trap focus and return it to the invoking control |
| `Portal` | `mountNode` | element or `{ element, className }` | Keep DOM order logical so tab/reading order matches the visual order |
| `Tabster` | — | — | Focus-trap/-restore primitives used by overlays; do not build your own trap |
| `Positioning` | — | — | Used by `Tooltip` / `Popover` / `Menu` — keep surfaces inside the viewport |
| `Overflow` | `id`, `groupId`, `onOverflowChange`, `children` | — | Items that collapse must remain reachable via the overflow menu |

## 4. Announce state changes

| Component | Prop | Values | Rule |
|---|---|---|---|
| `MessageBar` | `politeness` | `polite` / `assertive` | `assertive` only for errors that block the user; `polite` for everything else |
| `MessageBar` | `intent`, `shape`, `icon` slot, `bottomReflowSpacer` | — | Intent is visual — the text must carry the meaning |
| `Toast` | `appearance` | — | Render into a live region; never move focus to a toast |
| `Carousel` | `announcement` | `CarouselAnnouncerFunction` | Supply announcement text for slide changes |
| `Carousel` | `autoplayInterval`, `activeIndex`, `onActiveIndexChange` | — | Auto-playing motion needs a pause/stop control |
| `Spinner` | `labelPosition` (`above` / `below` / `before` / `after`), `delay`, `appearance`, `size`, `label` slot | — | Always pair with visible text; `delay` avoids flashing |
| `Progress` | `value`, `max`, `shape`, `thickness`, `color` | — | Determinate where possible; color is not the only state signal |
| `Skeleton` | `animation`, `appearance`, `width`, `size`, `shape` | — | Presentational — announce loading via `Spinner` or `MessageBar`, not `Skeleton` |
| `TeachingPopover` | `altText` (**required**), `value`, `mediaLength`, `footerLayout`, `dismissButton`, `icon` slot | — | Every media asset needs a text alternative; carousel steps need `navType`, `initialStepText`, `finalStepText` |
| `Rating` | `itemLabel` | `(rating) => string` | Announces the chosen value |

## 5. Direction, layering, motion

| Component | Prop | Rule |
|---|---|---|
| `Provider` | `dir` (`ltr` / `rtl`), `targetDocument`, `applyStylesToPortals`, `theme`, `overrides_unstable`, `customStyleHooks_unstable` | Verify the whole app under `dir="rtl"` — arrows, chevrons and side drawers mirror |
| `Portal` | `mountNode` | Portalled surfaces must still appear in a sensible DOM order |
| `Motion` | `children`, `appear`, `replayKey`, `direction`, `visible`, `unmountOnExit`, `onMotionStart`, `onMotionFinish`, `onMotionCancel`, `imperativeRef` | Keep entrances short; never gate information behind an animation the user disabled |
| `MotionComponentsPreview` | `children`, `visible`, `delayMode`, `hideMode`, `itemDelay`, `itemDuration`, `reversed`, `onMotionFinish` | Respect the user's reduced-motion preference for staggered lists |
| `Divider` | `vertical`, `appearance`, `alignContent`, `inset` | Purely visual — group content with headings, not dividers |
| `Avatar` / `Badge` / `ColorPicker` / `SwatchPicker` / `MessageBar` | `color`, `appearance`, `intent` | Never the only carrier of meaning |

## 6. Pattern → component map

| WAI-ARIA pattern | Fluent components | Key a11y props |
|---|---|---|
| Disclosure / accordion | `Accordion` | `collapsible`, `multiple`, `navigation`, `openItems` |
| Tabs | `Tabs` | `selectedValue`, `onTabSelect`, `selectTabOnFocus`, `vertical` |
| Menu button / context menu | `Menu` | `open`, `onOpenChange`, `openOnContext`, `openOnHover`, `positioning` |
| Modal / alert dialog | `Dialog` | `modalType`, `inertTrapFocus`, `onOpenChange` |
| Non-modal popover | `Popover` | `trapFocus`, `unstable_disableAutoFocus`, `onOpenChange` |
| Tooltip | `Tooltip` | `relationship` (required), `showDelay`, `hideDelay` |
| Combobox / listbox | `Combobox`, `TagPicker`, `Select`, `Search` | `freeform`, `onOptionSelect`, `onChange` |
| Tree view | `Tree` | `navigationMode`, `selectionMode`, `openItems`, `defaultOpenItems` |
| Grid | `Table` | `focusMode`, `selectionMode`, `onSortChange`, cell `sortable` / `sortDirection` |
| Breadcrumb | `Breadcrumb` | `focusMode`, `size` |
| Carousel | `Carousel` | `announcement`, `autoplayInterval`, `draggable` |
| Live region / status | `MessageBar`, `Toast`, `Spinner`, `Progress` | `politeness`, `intent`, `labelPosition` |
| Field + control | `Field` + `Input` / `Textarea` / `Select` / `Combobox` / `Spinbutton` / `Slider` / `Radio` / `Checkbox` / `Switch` / `DatepickerCompat` / `TimepickerCompat` | `label`, `required`, `validationState`, `validationMessage` |
| Navigation | `Nav`, `Breadcrumb`, `Link` | `selectedValue`, `onNavItemSelect`, `inline` |
| Screen-reader-only text | `Aria`, `MenuGridPreview` (`visuallyHidden`), `Infolabel` | `children` |
| Layout / grouping | `Card`, `Divider`, `Drawer`, `Portal`, `Overflow`, `Toolbar`, `List` | `focusMode`, `type`, `mountNode`, `navigationMode` |

## 7. Pre-ship checklist

- [ ] Every input has a programmatic name (`Field` label, `Label`, `Aria`, or `aria-label` on the `root` slot).
- [ ] Errors use `Field validationState="error"` + `validationMessage`; blocking errors also raise a `MessageBar` with `politeness="assertive"`.
- [ ] Icon-only controls are named — `Tooltip relationship="label"` or `Aria`; tooltips that repeat visible text use `relationship="inaccessible"`.
- [ ] Unavailable controls use `disabledFocusable` when they should stay discoverable in the tab order.
- [ ] Overlays: `Dialog` uses `inertTrapFocus`; `Popover` uses exactly one trap strategy; Escape closes; focus returns to the trigger; `Portal mountNode` keeps DOM order sane.
- [ ] Widget-level keyboard behaviour verified: `Tabs selectTabOnFocus`, `Tree`/`List navigationMode`, `Breadcrumb`/`SwatchPicker focusMode`, `Card focusMode`, `Accordion navigation`, `Table focusMode`.
- [ ] No pointer-only interactions: `Carousel draggable` has button equivalents; `Menu openOnHover`/`openOnContext` have keyboard equivalents.
- [ ] State changes are announced (`MessageBar politeness`, `Carousel announcement`, `Rating itemLabel`) and focus never jumps unexpectedly.
- [ ] Color is never the only cue (`Badge`, `Avatar`, `MessageBar`, `ColorPicker`, `SwatchPicker`, `Persona` presence).
- [ ] Truncated `Text` exposes the full string via a `Tooltip`; loading uses `Spinner`/`Progress`, not `Skeleton` alone.
- [ ] `Provider dir="rtl"` verified end to end; motion respects reduced-motion (`Motion`, `MotionComponentsPreview`, `Carousel autoplayInterval`).
- [ ] `Table` sorting/selection is keyboard operable; `CalendarCompat` / `DatepickerCompat` / `TimepickerCompat` values are readable as text.

## Key Takeaways

- Tooltip's relationship prop is required and dictates accessibility semantics: 'label' names an icon-only control, 'description' adds detail to an already-named control, 'inaccessible' hides a purely visual hint so the name is not announced twice.
- Field is the single source of truth for form labels, hints and validation — label + invalid/required state are wired to the nested control automatically via label, hint, required, validationState and validationMessage.
- disabledFocusable (Button, Link, Switch) keeps an unavailable control in the tab order and announced as disabled; disabled removes it entirely — choose based on whether the user needs to discover it.
- Every overlay needs a deliberate focus strategy: Dialog inertTrapFocus for modals, exactly one of Popover trapFocus / inertTrapFocus / legacyTrapFocus for popovers, unstable_disableAutoFocus for non-modal surfaces, and focus returned to the trigger on close.
- Keyboard behaviour is opt-in per widget: Tabs selectTabOnFocus, Tree/List navigationMode, Breadcrumb/SwatchPicker focusMode (arrow vs tab), Card focusMode (off/no-tab/tab-exit/tab-only), Accordion navigation, Table focusMode.
- Communicate state through text, not just color or icon: MessageBar politeness + intent, Carousel announcement, Rating itemLabel, Persona presence text, and Badge/Avatar/ColorPicker color paired with labels.
- Verify Provider dir='rtl' and keep portalled content (Portal mountNode) in a logical DOM order so tab and reading order match the visual layout.
- Motion and autoplay must be user-controllable: Carousel autoplayInterval needs a pause control, and Motion / MotionComponentsPreview animations should respect reduced-motion preferences.

## Examples

### Label + validate a form control with Field

Field wires the visible label, hint and error message to the nested control — the single most important a11y pattern in Fluent v9 forms.

```tsx
import { Field, Input } from '@fluentui/react-components';

export const EmailField = () => (
  <Field
    label="Email address"
    required
    orientation="vertical"
    hint="Only used for receipts."
    validationState="error"
    validationMessage="Enter an address in the form name@example.com."
  >
    <Input type="email" appearance="outline" size="medium" />
  </Field>
);
```

### disabledFocusable instead of disabled

disabledFocusable keeps an unavailable control in the tab order so keyboard and screen-reader users can still discover it.

```tsx
import { Button, Link, Switch } from '@fluentui/react-components';

export const InertButDiscoverable = () => (
  <>
    <Button disabledFocusable appearance="primary">Submit</Button>
    <Link disabledFocusable inline href="#details">View details</Link>
    <Switch disabledFocusable label="Send me email updates" labelPosition="after" />
  </>
);
```

### Dialog with inert focus trap and focus return

modalType='alert' marks a blocking decision; inertTrapFocus keeps the background unreachable; onOpenChange lets you restore focus to the trigger when the controlled Dialog closes.

```tsx
import { Button, Dialog } from '@fluentui/react-components';

export const DeleteDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) => (
  <Dialog
    modalType="alert"
    inertTrapFocus
    open={open}
    onOpenChange={(_event, data) => setOpen(data.open)}
  >
    {/* title + body + actions */}
    <Button appearance="primary">Delete</Button>
    <Button onClick={() => setOpen(false)}>Cancel</Button>
  </Dialog>
);
```

### Non-modal Popover that does not steal focus

Non-modal helper surfaces must not trap focus; unstable_disableAutoFocus keeps the user where they were.

```tsx
import { Button, Popover } from '@fluentui/react-components';

export const InlineHint = () => (
  <Popover
    openOnHover
    trapFocus={false}
    unstable_disableAutoFocus
    withArrow
    mouseLeaveDelay={500}
    size="small"
  >
    <Button appearance="subtle">What is this?</Button>
  </Popover>
);
```

### Tooltip relationship: label vs description vs inaccessible

relationship is required. Choose it deliberately so icon-only controls get a name and already-labelled controls are not double-announced.

```tsx
import { Button, Tooltip } from '@fluentui/react-components';

export const TooltipRelationships = () => (
  <>
    {/* Tooltip supplies the accessible name for an icon-only control */}
    <Tooltip content="Delete row" relationship="label">
      <Button appearance="subtle" shape="circular">×</Button>
    </Tooltip>

    {/* Supplementary detail for an already-named control */}
    <Tooltip content="Saves a draft you can publish later" relationship="description">
      <Button appearance="primary">Save</Button>
    </Tooltip>

    {/* Purely visual hint — hidden from assistive tech to avoid duplication */}
    <Tooltip content="Save" relationship="inaccessible">
      <Button appearance="primary">Save</Button>
    </Tooltip>
  </>
);
```

### Live-region status with MessageBar

politeness controls how urgently the message is announced; intent is only the visual treatment.

```tsx
import { Link, MessageBar, Text } from '@fluentui/react-components';

export const SaveError = () => (
  <MessageBar intent="error" politeness="assertive" shape="rounded">
    <Text weight="semibold">We could not save your changes.</Text>
    <Text>Check your connection, then try again.</Text>
    <Link inline appearance="subtle">Retry now</Link>
  </MessageBar>
);
```

### Screen-reader-only text with Aria

Aria renders visually hidden text you can point aria-describedby / aria-labelledby at.

```tsx
import { Aria, Button } from '@fluentui/react-components';

export const SaveButton = () => (
  <>
    <span id="save-hint">
      <Aria>Saves a local draft. Publishing is a separate step.</Aria>
    </span>
    <Button appearance="primary" aria-describedby="save-hint">
      Save
    </Button>
  </>
);
```

### RTL and portal-safe Provider setup

Verify the entire app under dir='rtl'; applyStylesToPortals keeps themed styles correct for portalled surfaces.

```tsx
import { Provider } from '@fluentui/react-components';

export const App = () => (
  <Provider dir="rtl" targetDocument={document} applyStylesToPortals>
    {/* app tree */}
  </Provider>
);
```

### Interactive Card with a sane focus mode

tab-exit keeps an interactive card reachable while letting focus leave the card cleanly; selection changes are forwarded so state can be announced.

```tsx
import { Button, Card, Text } from '@fluentui/react-components';

export const ReportCard = ({
  selected,
  onSelectedChange,
}: {
  selected: boolean;
  onSelectedChange: (v: boolean) => void;
}) => (
  <Card
    focusMode="tab-exit"
    orientation="horizontal"
    appearance="filled-alternative"
    selected={selected}
    onSelectionChange={(_e, data) => onSelectedChange(data.selected)}
  >
    <Text weight="semibold">Quarterly report</Text>
    <Button appearance="subtle">Open</Button>
  </Card>
);
```

### Partial selection and named rating values

Checkbox 'mixed' means indeterminate; Rating itemLabel gives every star a spoken name.

```tsx
import { Checkbox, Rating } from '@fluentui/react-components';

export const BulkControls = ({
  checked,
  setChecked,
  rating,
  setRating,
}: {
  checked: boolean | 'mixed';
  setChecked: (v: boolean | 'mixed') => void;
  rating: number;
  setRating: (v: number) => void;
}) => (
  <>
    <Checkbox
      checked={checked}
      onChange={(_ev, data) => setChecked(data.checked)}
      labelPosition="after"
    >
      Select all rows (some rows already selected)
    </Checkbox>

    <Rating
      value={rating}
      max={5}
      step={1}
      itemLabel={(r) => `${r} of 5 stars`}
      onChange={(_ev, data) => setRating(data.value)}
    />
  </>
);
```

### Expose truncated text via Tooltip

Text truncate clips visually; the Tooltip supplies the full string for sighted users while the DOM keeps the complete text.

```tsx
import { Text, Tooltip } from '@fluentui/react-components';

export const TruncatedTitle = ({ title }: { title: string }) => (
  <Tooltip content={title} relationship="description">
    <Text truncate block>{title}</Text>
  </Tooltip>
);
```

## Pitfalls

- Using disabled instead of disabledFocusable on Button, Link or Switch: the control drops out of the tab order and screen-reader users never learn it exists.
- Setting Tooltip relationship incorrectly: relationship='label' on a control that already has visible text double-announces the name, while leaving an icon-only control with only relationship='description' leaves it unnamed.
- Applying trapFocus to a non-modal Popover, or leaving a Drawer with type='overlay' untrapped — either traps the user inside a helper surface or leaves background content reachable while the overlay is open.
- Using Card focusMode='off' or 'no-tab' on a card that contains its own actions, making the interactive card and its controls unreachable by keyboard.
- Announcing everything with MessageBar politeness='assertive' — it interrupts ongoing screen-reader speech; reserve it for errors that block progress and use 'polite' elsewhere.
- Relying on MessageBar intent, Badge color, Avatar color or Persona presence color as the only status signal — none of them are perceivable to users who cannot see color.
- Rendering Skeleton as the only loading indicator: it is presentational, so the loading state is never announced — pair it with Spinner or a MessageBar.
- Skipping Rating itemLabel or Spinbutton displayValue, so assistive tech reads a bare number with no unit or meaning.
- Custom Combobox expandIcon/clearIcon or Badge icon slots without accessible names, leaving unnamed graphics in the tab/reading flow.
- Autoplaying a Carousel with autoplayInterval and no pause control, and making draggable the only way to change slides.
- Truncating essential copy with Text truncate and no Tooltip or full-text alternative, so the visible string is incomplete.
- Portalling surfaces with Portal mountNode into an arbitrary container, which breaks the natural reading and tab order — always check the resulting DOM sequence.

**Referenced components**: Accordion, Aria, Avatar, Badge, Breadcrumb, Button, CalendarCompat, Card, Carousel, Checkbox, ColorPicker, Combobox, DatepickerCompat, Dialog, Divider, Drawer, Field, Image, Infolabel, Input, Label, Link, List, Menu, MenuGridPreview, MessageBar, Motion, MotionComponentsPreview, Nav, Overflow, Persona, Popover, Portal, Positioning, Progress, Provider, Radio, Rating, Search, Select, Skeleton, Slider, Spinbutton, Spinner, SwatchPicker, Switch, Tabster, Table, TagPicker, Tags, Tabs, TeachingPopover, Text, Textarea, TimepickerCompat, Toast, Toolbar, Tooltip, Tree

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
