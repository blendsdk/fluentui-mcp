# Accessibility Guide

> **Category**: foundation

Fluent UI v9 ships accessibility as a default, not an add-on. Every interactive component implements the matching WAI-ARIA Authoring Practices pattern: correct roles and states, full keyboard interaction, focus management, and support for right-to-left layouts and high-contrast (forced-colors) modes. What is left to you is small but essential: give every control an accessible name, compose components without fighting their built-in behavior, announce what changes on screen, and verify the result with a keyboard and a screen reader.

## What the library gives you out of the box

- **Roles and ARIA state.** Controls render the roles, `aria-*` states and disabled / checked / selected semantics that assistive technology expects.
- **Keyboard interaction per pattern.** `Accordion`, `Menu`, `Tabs`, `Tree`, `Table`, `Toolbar`, `Carousel`, `Slider`, `Rating`, `SpinButton`, `Breadcrumb` and friends implement arrow-key, Home/End, Escape, Enter and Space behavior for you.
- **Focus management.** Overlays such as `Dialog`, `Popover`, `Menu`, `Drawer` and `TeachingPopover` move focus into the surface, keep it there while open, and return it to the trigger when closed. The `inertTrapFocus` prop uses the native `inert` attribute instead of manual tab interception. Under the hood this is powered by the `Tabster` utility.
- **Visible focus.** Components render their focus indicator from design tokens in light, dark and forced-colors themes. Never remove it.
- **Direction and theming.** `FluentProvider` (`dir`, `theme`, `targetDocument`, `applyStylesToPortals`) applies direction and theme tokens to the entire tree, including portaled content.
- **Motion primitives.** `Motion` and `MotionComponentsPreview` let you shape animation around user preferences.

## What you own

1. An accessible name for every control.
2. Correct composition - do not add roles or ARIA that conflict with a Fluent component's own behavior.
3. Announcements for asynchronous changes.
4. Verification: keyboard-only, screen reader, 200% zoom, high contrast, reduced motion.

## Component to pattern quick map

| Component | Behavior you should rely on | Where the accessible name comes from |
| --- | --- | --- |
| `Button` | native button, Space/Enter activation | visible text, `aria-label`, or a `Tooltip` with `relationship='label'` |
| `Link` | native link, Enter activation | link text |
| `Checkbox`, `Switch`, `Radio` | native inputs, Space toggles | the `label` prop, `Label`, or `Field` |
| `Input`, `Textarea`, `Select`, `Search` | native form controls | `Field`, `Label` or `aria-label` |
| `Slider`, `SpinButton`, `Rating` | range / value widgets, arrow keys | `Field`, `aria-label`, `Rating.itemLabel` |
| `Accordion` | disclosure pattern | header text |
| `Tabs` | tablist / tab / tabpanel with roving tabindex | tab text |
| `Menu` | menu / menuitem, arrow keys, Escape | item text |
| `Dialog`, `Drawer` | modal surface, focus trap, Escape | dialog title |
| `Tooltip` | label or description | decided by the required `relationship` prop |
| `MessageBar` | live region | message text |

## 1. Names, labels and descriptions

### Prefer `Field` for form controls

`Field` is the accessibility-aware wrapper for form controls. It generates ids and wires them together so the control is labelled by its label, described by its hint, and announced together with its validation message:

```tsx
<Field
  label='Email address'
  required
  hint='We only use this address for account notifications.'
  validationState={hasError ? 'error' : 'none'}
  validationMessage={hasError ? 'Enter an address in the format name@example.com.' : undefined}
>
  <Input type='email' />
</Field>
```

`Field` props: `label`, `hint`, `validationState` (`'error' | 'warning' | 'success' | 'none'`), `validationMessage`, `required`, `orientation` (`'vertical' | 'horizontal'`), `size`. Slots: `root`, `label`, `validationMessage`, `validationMessageIcon`, `hint`.

Rules that follow from that API:

- Always set `validationState` and `validationMessage` together - the icon alone is not a message and must not be the only signal.
- Use `required` on `Field` so both the control and its message communicate the required state.
- Keep hints short; they are read as part of the field description every time the control receives focus.

### `Label` for simple cases

`Label` (`required`, `disabled`, `size`, `weight`) renders a real `<label>` element. Its `required` value renders the visual asterisk indicator only - make sure the control itself also exposes the required state, for example through `Field required` or the native `required` attribute on `Input`. Set `disabled` on the label when its control is disabled so the pair stays visually consistent.

### Placeholder text is never a label

A placeholder disappears as soon as the user types, is not reliably announced, and cannot describe formatting requirements. Keep using `Field`/`Label` for the name and `hint` for the requirement.

### `Tooltip` and the required `relationship` prop

`Tooltip` exposes a **required** `relationship` prop that decides how the tooltip content is exposed to assistive technology:

- `relationship='label'` - the tooltip content becomes the control's accessible **name**. Use this for icon-only buttons that have no visible text.
- `relationship='description'` - the content supplements an existing name and is exposed as a description (for example, explaining why an action is unavailable).
- `relationship='inaccessible'` - the content duplicates visible text and should not be re-announced.

`Tooltip` also accepts `showDelay`, `hideDelay`, `appearance`, `withArrow`, `positioning`, `visible` and `onVisibleChange`. A tooltip is a convenience; essential instructions belong in visible (or hint) text.

### Icon slots are decorative

`Button.icon`, `Badge.icon` and `Avatar.icon` are presentational slots. Never place the only meaning of a control inside an icon - the accessible name must come from text, `aria-label`, or a `Tooltip` label relationship.

### Identity and media

- `Avatar.name` generates the initials **and** the accessible name; `active`, `activeAppearance` and `color` are visual, so surface presence or status in text as well.
- `Persona` uses `name` plus its primary / secondary / tertiary text slots.
- `Image` (`fit`, `shape`, `shadow`, `bordered`, `block`) is a visual element: informative images need a text alternative (set the standard `alt` attribute so it lands on the underlying image element), and purely decorative images should be hidden from assistive technology.
- `InfoLabel` pairs visible text with an info button and popover; the button's accessible name is supplied through the `info` prop.

## 2. Keyboard interaction and focus management

### Let composite widgets own the tab stop

Composite widgets in Fluent UI v9 use a roving tabindex: the whole widget is a single Tab stop and arrow keys move focus inside. Do not add your own `tabIndex` to items. The props that control this behavior are:

- `Tabs` - `selectTabOnFocus` (selection follows focus), `vertical`, `disabled`, `defaultSelectedValue` / `selectedValue`, `size`.
- `Breadcrumb` - `focusMode='arrow' | 'tab'`.
- `Card` - `focusMode='off' | 'no-tab' | 'tab-exit' | 'tab-only'`, plus `disabled`, `selected` / `defaultSelected`, `onSelectionChange`, `shouldRestrictTriggerAction`.
- `SwatchPicker` - `focusMode='arrow' | 'tab'`, `layout='row' | 'grid'`.
- `Toolbar` - `vertical`, `size`, `checkedValues` / `defaultCheckedValues`; arrow keys move between items.
- `Accordion` - `navigation='linear' | 'circular'`, `collapsible`, `multiple`, `openItems` / `defaultOpenItems`.
- `Tree` - `navigationMode`, `selectionMode`, `checkedItems`, `openItems` / `defaultOpenItems`.
- `List` - `navigationMode`, `selectionMode`, `selectedItems` / `defaultSelectedItems`, `onSelectionChange`.
- `Table` - `focusMode` (how data-grid cells receive focus), `selectionMode`, `sortable` / `sortDirection` / `onSortChange`.

### Overlay focus management

- `Dialog` - `inertTrapFocus` (recommended modern trap), `modalType`, `unmountOnClose`, controlled `open` with `onOpenChange`. Keeping `open` controlled makes focus return deterministic.
- `Popover` - `trapFocus`, `legacyTrapFocus`, `inertTrapFocus`, `unstable_disableAutoFocus`, `openOnHover`, `mouseLeaveDelay`, `closeOnScroll`, `closeOnIframeFocus`, `inline`, `withArrow`, `size`, `appearance`, `positioning`.
- `Menu` - `openOnContext`, `openOnHover`, `hoverDelay`, `closeOnScroll`, `persistOnItemClick`, `inline`, `positioning`. A context menu must never be the only way to reach an action; add a visible trigger (for example a `Button`) that opens the same menu.
- `Drawer` - `type='inline' | 'overlay'`. `inline` keeps the panel in the normal flow; `overlay` floats above the page and needs the same modal focus treatment as a dialog.

In all cases Escape closes the surface and focus returns to the element that opened it - verify this by keyboard only, without a mouse.

### Tab order and DOM order

`Portal` (`children`, `mountNode`) moves DOM nodes, not React tree position. Content appended to the end of `<body>` is read last, which is correct for a modal dialog, but keep `mountNode` predictable and never rely on positive `tabIndex` values to fix order.

### `disabled` versus `disabledFocusable`

- `disabled` removes the control from the tab order and from the accessibility tree, so users may never learn the action exists.
- `disabledFocusable` keeps the control focusable and announced, but not activatable.

Both props exist on `Button`, `Link` and `Switch`. Prefer `disabledFocusable` when the user needs to understand *why* an action is unavailable, and pair it with an explanation (a `Tooltip` with `relationship='description'`, or a `MessageBar`).

## 3. Announcing changes with live regions

### `MessageBar`

`MessageBar` is the built-in live region: `intent` selects the semantic tone, `politeness` is `'polite' | 'assertive'`, and `shape` is `'square' | 'rounded'`.

- `politeness='polite'` for success and informational messages - announce when the user pauses.
- `politeness='assertive'` for errors that must interrupt, paired with an error `intent`.
- Never rely on color alone: the same `MessageBar` carries an icon and text.

### Live-region timing

Assistive technology announces a live region most reliably when the region already exists in the DOM and only its content changes. Where possible, keep an announcement container rendered in your shell and change its content rather than mounting a brand-new region at the same moment as its message.

### The `Aria` utility

`Aria` is an escape hatch for ARIA-only rendering: it accepts `children` and lets you express ARIA-related content (such as visually hidden announcement text) without adding visible layout.

### `Carousel` announcements

`Carousel` exposes an `announcement` prop (`CarouselAnnouncerFunction`) so you can control what a screen reader hears when the active slide changes. Related props: `defaultActiveIndex` / `activeIndex` / `onActiveIndexChange`, `autoplayInterval`, `draggable`, `circular`, `groupSize`, `motion`, `whitespace`, `align`, `appearance`. Auto-advancing content must be pausable (WCAG 2.2.2) - when you set `autoplayInterval`, provide a visible pause `Button` as well, and remember that drag interactions always need a keyboard equivalent.

### Loading and status

- `Spinner` (`label`, `labelPosition`, `delay`, `size`, `appearance`) - `delay` avoids a flash for quick operations.
- `ProgressBar` (`value`, `max`, `shape`, `thickness`, `color`).
- `Skeleton` (`animation`, `appearance`, `shape`, `size`, `width`).

Announce the completion of long operations through a `MessageBar` or another live region rather than only removing the spinner.

## 4. Motion, animation and reduced motion

- `Motion` - `children`, `appear`, `visible`, `unmountOnExit`, `replayKey`, `direction`, `onMotionStart`, `onMotionFinish`, `onMotionCancel`, `imperativeRef`.
- `MotionComponentsPreview` - `visible`, `itemDelay`, `itemDuration`, `delayMode`, `hideMode`, `reversed`, `onMotionFinish` for staggered content.
- Provide a reduced-motion path in your own code by checking `window.matchMedia('(prefers-reduced-motion: reduce)')` and rendering the final state immediately (skip the animated wrapper or start from `visible`).
- Keep essential interactions free of timing pressure, and never flash content more than three times per second (WCAG 2.3.1).
- `Skeleton.animation` can be left unset when motion should be minimized.

## 5. Direction, theming and localization

Wrap the application in `FluentProvider` and set `dir` to `'ltr' | 'rtl'`. `applyStylesToPortals` ensures that surfaces rendered through `Portal` receive the same styles and attributes, and `targetDocument` supports rendering into another document (iframes, popouts). `theme` accepts a `PartialTheme` so brand ramps can be adjusted - always re-verify contrast after changing them. Layout mirroring comes from logical CSS direction; icons that imply direction (arrows, back/forward) may need to be mirrored explicitly.

## 6. Color, contrast and high contrast

- Text contrast 4.5:1 (3:1 for large text) and 3:1 for UI components and graphical objects (WCAG 1.4.3 and 1.4.11).
- `Badge` (`appearance`, `color`) and `MessageBar` (`intent`) carry semantic color - always add text so meaning survives without color.
- `Field.validationState` renders an icon and a message, never color alone.
- `Avatar.active` / `Avatar.color` are decorative signals; expose presence in text.
- Test Windows High Contrast / forced-colors mode: Fluent tokens map to system colors, but custom styles and images may not.

## 7. Form controls in detail

- Text entry: `Input` (`type`, `size`, `appearance`), `Textarea` (`resize`, `size`, `appearance`), `Search`.
- Choice: `Checkbox` (`checked='mixed'` for partial selection, `labelPosition`), `Radio` (`labelPosition='after' | 'below'`), `Switch` (`labelPosition`, `disabledFocusable`).
- Value widgets: `Slider` (`min`, `max`, `step`, `vertical`, `disabled`), `SpinButton` (`min`, `max`, `step`, `stepPage`, `precision`, `displayValue`), `Rating` (`max`, `step`, `itemLabel`, `name`).
- Pickers: `Select`, `Combobox` (`freeform`), `TagPicker`, `ColorPicker`, `SwatchPicker`.
- Dates and times: `DatepickerCompat` (`allowTextInput`, `openOnClick`, `inlinePopup`, `positioning`, `onValidationResult`, `formatDate`, `parseDateFromString`, `minDate`, `maxDate`, `disableAutoFocus`, `showWeekNumbers`, `firstDayOfWeek`) and `TimepickerCompat` (`startHour`, `endHour`, `increment`, `formatDateToTimeString`, `parseTimeStringToDate`). Keep `allowTextInput` enabled so keyboard-only users can type instead of navigating a grid, and surface format errors through `onValidationResult` plus a `MessageBar` or `Field` message.
- Groups: a set of related checkboxes or radios is announced as a group only when it has a name - wrap it in `Field` and give the container an accessible name.
- `Rating` accepts `step={0.5}` but fractional values are hard for screen reader users; prefer whole steps and use `itemLabel` to give each value a meaningful name.

## 8. Structured content

- `Table`: `focusMode`, `selectionMode`, `sortable`, `sortDirection`, `onSortChange`, `columnSizingOptions`, `onSelectionChange`. Sorting must be programmatically exposed, not only visually.
- `Tree`: `navigationMode`, `selectionMode`, `checkedItems`, `openItems`.
- `List`: `navigationMode`, `selectionMode`, `selectedItems`, `onSelectionChange`.
- `Tags`: `hasSecondaryAction` renders a dismiss action - it must be reachable by keyboard and correctly named.
- `Accordion`: `navigation`, `collapsible`, `multiple`, `openItems`.
- `Divider`: purely presentational - never the only separator between semantically distinct regions.

## 9. Overlays and teaching surfaces

Beyond the focus rules above, `TeachingPopover` supplies onboarding primitives: `dismissButton`, `footerLayout`, `altText` (required for media), `initialStepText`, `finalStepText` and `mediaLength`. Always provide a dismiss path, make sure the media's `altText` is meaningful, and never trap a user in a tour without a way out.

## 10. Verification checklist

1. **Keyboard only.** Complete every task with Tab, Shift+Tab, arrows, Enter, Space and Escape. Focus must never be lost and must return to the trigger after overlays close.
2. **Screen reader.** Narrator, VoiceOver or NVDA. Check names, roles, states, group context and dynamic announcements.
3. **Zoom and reflow.** 200% zoom, 320px width, and increased text spacing without loss of content or function.
4. **High contrast / forced colors.**
5. **Reduced motion.** Toggle the OS setting and confirm essential content is still reachable.
6. **Contrast of custom themes.** Recheck any `FluentProvider theme` overrides.
7. **Automated checks** (axe, Accessibility Insights) as a floor, never the whole story.

## Key Takeaways

- Fluent UI v9 components already implement the WAI-ARIA pattern, keyboard model and focus management for their widget type - your main job is naming controls, composing correctly, and announcing changes.
- Always label inputs through Field (label, hint, validationState, validationMessage) or Label; placeholder text is never an accessible name.
- An icon-only Button relies on an accessible name you supply: use Tooltip with relationship='label', or pass aria-label directly. The icon slot is decorative.
- Let composite widgets own their keyboard behavior and roving tabindex (Tabs selectTabOnFocus, Breadcrumb/SwatchPicker/Card focusMode, Accordion navigation, Tree/List navigationMode). Do not inject roles or tabIndex into them.
- Prefer disabledFocusable over disabled when users need to discover and understand an unavailable action; it stays focusable and announced.
- Announce dynamic content: MessageBar politician='polite' for success and 'assertive' for errors, Carousel announcement for slide changes, and a live region for completed long-running operations.
- Respect user settings: Provider dir for RTL, a reduced-motion path for Motion and Carousel, and re-verify contrast whenever Provider theme overrides are applied.

## Examples

### Labeled form field with validation

Field wires the label, hint and validation message to the control through generated ids, so the input is named and described without manual aria attributes. validationState plus validationMessage keeps the error out of color-only territory.

```tsx
import * as React from 'react';
import { Button, Field, Input } from '@fluentui/react-components';

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const SignUpForm = () => {
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const showError = submitted && !isValidEmail(email);

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <Field
        label='Email address'
        required
        hint='We only use this address for account notifications.'
        validationState={showError ? 'error' : 'none'}
        validationMessage={
          showError ? 'Enter an address in the format name@example.com.' : undefined
        }
      >
        <Input
          type='email'
          value={email}
          onChange={(_, data) => setEmail(data.value)}
        />
      </Field>

      <Button type='submit' appearance='primary'>
        Create account
      </Button>
    </form>
  );
};
```

### Icon-only buttons with an accessible name

The icon slot is decorative, so an icon-only Button must be named. relationship='label' turns the tooltip content into the accessible name; when no tooltip is present, pass aria-label directly.

```tsx
import * as React from 'react';
import { Button, Tooltip } from '@fluentui/react-components';

const DeleteGlyph = () => (
  <svg viewBox='0 0 20 20' width='20' height='20' aria-hidden='true' focusable='false'>
    <path
      d='M7 2h6l1 2h4v2H2V4h4l1-2zM4 8h12l-1 9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1L4 8z'
      fill='currentColor'
    />
  </svg>
);

export const ItemActions = () => (
  <div role='toolbar' aria-label='Item actions'>
    {/* relationship='label' makes the tooltip content the accessible name,
        so a separate aria-label would be redundant. */}
    <Tooltip content='Delete item' relationship='label'>
      <Button appearance='subtle' icon={<DeleteGlyph />} />
    </Tooltip>

    {/* Without a tooltip, name the control explicitly. */}
    <Button appearance='subtle' aria-label='Duplicate item' icon={<DeleteGlyph />} />
  </div>
);
```

### Announcing status changes with MessageBar

MessageBar is a live region. Success and informational messages use politeness='polite'; errors use politeness='assertive' so they interrupt. disabledFocusable keeps the Save button focusable while the request is in flight.

```tsx
import * as React from 'react';
import { Button, MessageBar } from '@fluentui/react-components';

type Status = { intent: 'success' | 'error'; text: string } | null;

const save = () =>
  new Promise<void>((resolve, reject) => {
    window.setTimeout(
      () => (Math.random() > 0.5 ? resolve() : reject(new Error('offline'))),
      600,
    );
  });

export const SavePanel = () => {
  const [status, setStatus] = React.useState<Status>(null);
  const [saving, setSaving] = React.useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      await save();
      setStatus({ intent: 'success', text: 'Your changes were saved.' });
    } catch {
      setStatus({ intent: 'error', text: 'We could not save your changes. Try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Button appearance='primary' onClick={onSave} disabledFocusable={saving}>
        {saving ? 'Saving…' : 'Save'}
      </Button>

      {status && (
        <MessageBar
          intent={status.intent}
          politeness={status.intent === 'error' ? 'assertive' : 'polite'}
        >
          {status.text}
        </MessageBar>
      )}
    </div>
  );
};
```

### disabledFocusable versus disabled

disabledFocusable keeps a temporarily unavailable control in the tab order so keyboard and screen reader users can discover it and hear why it is unavailable. disabled removes it from the tab order and the accessibility tree entirely.

```tsx
import * as React from 'react';
import { Button, Link, Switch, Tooltip } from '@fluentui/react-components';

export const PublishingControls = () => {
  const [documentSelected, setDocumentSelected] = React.useState(false);
  const [scheduled, setScheduled] = React.useState(false);

  return (
    <>
      {/* Focusable, announced, not activatable - with an explanation attached. */}
      <Tooltip content='Select a document before publishing' relationship='description'>
        <Button appearance='primary' disabledFocusable={!documentSelected}>
          Publish
        </Button>
      </Tooltip>

      {/* Removed from the tab order and from the accessibility tree. */}
      <Button disabled>Archive</Button>

      <Link href='/docs' disabledFocusable>
        Read the documentation
      </Link>

      <Switch
        label='Schedule the publish for later'
        labelPosition='after'
        checked={scheduled}
        disabledFocusable={!documentSelected}
        onChange={(_, data) => setScheduled(data.checked)}
      />

      <Button onClick={() => setDocumentSelected(value => !value)}>
        Toggle document
      </Button>
    </>
  );
};
```

### Named checkbox group with a mixed state

Checkbox supports checked='mixed' for a partial parent state. The group is wrapped in Field for the visible label and hint, and given its own accessible name so assistive technology announces it as a group.

```tsx
import * as React from 'react';
import { Checkbox, Field } from '@fluentui/react-components';

const channels = ['Email', 'SMS', 'Push'];

export const NotificationPreferences = () => {
  const [selected, setSelected] = React.useState<string[]>(['Email']);
  const allSelected = selected.length === channels.length;
  const someSelected = selected.length > 0 && !allSelected;

  return (
    <Field label='Notification channels' hint='Choose at least one channel.'>
      {/* A set of checkboxes is announced as a group only when it has a name. */}
      <div role='group' aria-label='Notification channels'>
        <Checkbox
          label='Select all'
          checked={allSelected ? true : someSelected ? 'mixed' : false}
          onChange={(_, data) => setSelected(data.checked ? [...channels] : [])}
        />

        {channels.map(channel => (
          <Checkbox
            key={channel}
            label={channel}
            checked={selected.includes(channel)}
            onChange={(_, data) =>
              setSelected(previous =>
                data.checked
                  ? [...previous, channel]
                  : previous.filter(item => item !== channel),
              )
            }
          />
        ))}
      </div>
    </Field>
  );
};
```

### Rating with meaningful value labels

itemLabel gives every rating value an accessible name, and whole-number steps are easier to operate than fractional ones. Field supplies the visible label, hint and validation message.

```tsx
import * as React from 'react';
import { Field, Rating } from '@fluentui/react-components';

const labels = ['Very poor', 'Poor', 'Fair', 'Good', 'Excellent'];

export const SatisfactionRating = () => {
  const [value, setValue] = React.useState(0);

  return (
    <Field
      label='How satisfied are you with this release?'
      hint='Use the arrow keys to change the rating, then press Tab to continue.'
      validationState={value === 0 ? 'warning' : 'none'}
      validationMessage={value === 0 ? 'Choose a rating between 1 and 5.' : undefined}
    >
      <Rating
        value={value}
        max={5}
        step={1}
        itemLabel={rating => `${labels[rating - 1] ?? ''} (${rating} of 5)`}
        onChange={(_, data) => setValue(data.value)}
      />
    </Field>
  );
};
```

### Right-to-left support with Provider and Portal

Provider's dir prop applies direction to the whole tree. applyStylesToPortals makes sure content rendered through Portal inherits the same direction, theme and focus behavior instead of falling back to LTR.

```tsx
import * as React from 'react';
import { Button, Portal, FluentProvider } from '@fluentui/react-components';

export const BidirectionalApp = () => {
  const [dir, setDir] = React.useState<'ltr' | 'rtl'>('rtl');

  return (
    <FluentProvider dir={dir} applyStylesToPortals>
      <Button
        appearance='primary'
        onClick={() => setDir(dir === 'rtl' ? 'ltr' : 'rtl')}
      >
        {dir === 'rtl' ? 'Switch to left-to-right' : 'Switch to right-to-left'}
      </Button>

      {/* Portaled content stays inside the Provider tree, so it inherits
          direction, theme and Tabster focus management. */}
      <Portal>
        <div>{dir === 'rtl' ? 'المحتوى بالعربية' : 'Content in English'}</div>
      </Portal>
    </FluentProvider>
  );
};
```

### Numeric input with an accessible range and error state

Spinbutton exposes min/max/step/precision so keyboard and screen reader users can adjust a bounded value predictably, while Field supplies the name, hint and validation message.

```tsx
import * as React from 'react';
import { Field, SpinButton } from '@fluentui/react-components';

export const SeatCountField = () => {
  const [seats, setSeats] = React.useState<number | null>(1);
  const invalid = seats === null || seats < 1;

  return (
    <Field
      label='Seats'
      required
      hint='Choose between 1 and 25 seats.'
      validationState={invalid ? 'error' : 'none'}
      validationMessage={invalid ? 'Enter a number of seats greater than zero.' : undefined}
    >
      <SpinButton
        value={seats}
        min={1}
        max={25}
        step={1}
        stepPage={5}
        precision={0}
        onChange={(_, data) =>
          setSeats(typeof data.value === 'number' ? data.value : null)
        }
      />
    </Field>
  );
};
```

## Pitfalls

- Icon-only buttons with no accessible name - the Button or Badge icon slot is decorative, so screen reader users hear 'button' with no purpose. Fix with Tooltip relationship='label' or aria-label.
- Using placeholder or title text as the only label. Both vanish or are announced inconsistently; use Field/Label for the name and Field hint for requirements.
- Reaching for disabled by default. disabled removes a control from the tab order and the accessibility tree, so keyboard and screen reader users may never discover it - use disabledFocusable plus an explanation.
- Adding ARIA or keyboard handlers on top of Fluent behavior, such as role='tab' on Tabs content or tabIndex on items inside a roving-tabindex composite. This breaks the built-in focus model.
- Mounting a live region at the same moment as its message. Screen readers announce reliably only when the region already exists in the DOM and its content changes.
- Conveying meaning with color alone - Badge color, MessageBar intent, Avatar.active, or Field validationState without a message.
- Auto-advancing Carousel content without a pause control, or relying on drag (draggable) as the only way to change slides.
- Setting direction through CSS instead of Provider dir, which leaves Portal content rendering left-to-right and can misplace positioned overlays.
- Omitting the required relationship prop on Tooltip, so the content is neither a label nor a description and is effectively lost to assistive technology.
- Testing only with a mouse. Every flow must be completable with a keyboard alone, including closing overlays and returning focus to the trigger.

## Accessibility

Fluent UI v9 is engineered against the WAI-ARIA Authoring Practices: components expose the expected roles, states and properties, implement their pattern's keyboard interaction (arrow keys, Home/End, Escape, Enter/Space), and manage focus through the Tabster-based focus system. Overlays (Dialog, Popover, Menu, Drawer, TeachingPopover) move focus into the surface, keep it there while open and restore it to the trigger on close; inertTrapFocus uses the native inert attribute for the most robust trap. Providers apply dir and theme to the entire tree, including portaled surfaces, which keeps RTL layouts and contrast-covered tokens consistent. Your responsibilities are the parts no library can infer: supply an accessible name for every control (Field, Label, aria-label or Tooltip relationship='label'), keep validation and status messages textual rather than color-only, announce asynchronous changes through MessageBar politeness or a persistent live region, and offer a reduced-motion path for anything you animate with Motion or Carousel. Verify with a keyboard-only pass, at least one screen reader (Narrator, VoiceOver or NVDA), 200% zoom, Windows High Contrast / forced-colors mode, the OS reduced-motion setting, and a contrast check of any Provider theme overrides.

**Referenced components**: Accordion, Aria, Avatar, Badge, Breadcrumb, Button, Card, Carousel, Checkbox, ColorPicker, Combobox, DatepickerCompat, Dialog, Divider, Drawer, Field, Image, Infolabel, Input, Label, Link, List, Menu, MessageBar, Motion, MotionComponentsPreview, Persona, Popover, Portal, Progress, Provider, Radio, Rating, Search, Select, Skeleton, Slider, Spinbutton, Spinner, SwatchPicker, Switch, Table, Tabs, Tags, Tabster, TagPicker, TeachingPopover, Textarea, TimepickerCompat, Toolbar, Tooltip, Tree

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
