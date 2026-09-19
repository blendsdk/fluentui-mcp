# Getting Started with FluentUI

> **Category**: foundation

FluentUI v9 is Microsoft's React component library for building accessible, themeable, production-grade experiences. Almost everything you need ships from a single entry point — `@fluentui/react-components` — and every component follows the same handful of conventions: a root `FluentProvider`, a slots-based composition model, state props such as `appearance`/`size`/`shape` instead of ad-hoc styling, and `(event, data)` change callbacks.

This guide takes you from a blank project to a working, accessible screen, and then walks the whole component catalog so you know which building block to reach for.

## 1. What FluentUI v9 gives you

- **One import path.** `import { Button, Input, Field } from '@fluentui/react-components';`
- **Token-driven theming.** Colors, typography, radii, shadows and spacing are design tokens applied by a root `FluentProvider`.
- **Slots.** Every component exposes named parts (`icon`, `contentBefore`, `label`, `validationMessage`…) that can be filled with a primitive, JSX, or a props object.
- **State-driven API.** Props such as `appearance`, `size`, `shape`, `orientation`, `appearance` and `focusMode` replace the imperative `styles`/`theme` plumbing of older libraries.
- **Accessibility built in.** Roles, ARIA wiring, focus management, roving tab stops and keyboard interaction are handled by the components.
- **TypeScript first.** Props, slot types and change-data payloads are fully typed.

## 2. Install

```bash
npm install @fluentui/react-components
```

A few capabilities live in dedicated packages that follow exactly the same conventions:

| Capability | Package | Component |
| --- | --- | --- |
| Date picker | `@fluentui/react-datepicker-compat` | `DatepickerCompat` |
| Time picker | `@fluentui/react-timepicker-compat` | `TimepickerCompat` |
| Month / calendar grid | `@fluentui/react-calendar-compat` | `CalendarCompat` |
| Rich menu grid layout | `@fluentui/react-menu-grid-preview` | `MenuGridPreview` |
| Unstyled building blocks | `@fluentui/react-headless-components-preview` | `HeadlessComponentsPreview` |
| Presence / stagger motion | `@fluentui/react-motion-components-preview` | `MotionComponentsPreview` |
| Context-based selectors | `@fluentui/react-context-selector` | `ContextSelector` |

"compat" packages deliberately mirror the v8 API shape (useful when migrating); "preview" packages are unstable and can change between minor releases.

## 3. Wrap your app in `FluentProvider`

`FluentProvider` is the root of every FluentUI app. It applies the theme, the text direction, and the handling of styles inside portals.

Key props:

| Prop | Purpose |
| --- | --- |
| `theme` | A `PartialTheme` object (light/dark/brand themes) that overrides design tokens for the subtree. |
| `dir` | `'ltr'` or `'rtl'`. Set this for right-to-left locales. |
| `targetDocument` | The `Document` that portaled content is rendered into (iframes, popups, shadow roots). |
| `applyStylesToPortals` | Ensures tokens/styles are applied to content rendered through portals. |
| `customStyleHooks_unstable` / `overrides_unstable` | Escape hatches for style overrides and token overrides. |

Render one `FluentProvider` near the top of the tree, above **every** FluentUI component — including components that will later be rendered inside overlays. If your app is embedded in an iframe or a different document, pass `targetDocument` and `applyStylesToPortals` so portaled surfaces still receive theme tokens.

## 4. Importing and rendering components

```tsx
import { Button, Input, Field } from '@fluentui/react-components';
```

Always import from the package root. The library is tree-shakeable, so importing a few components does not pull in the rest. Cross-package components (`DatepickerCompat`, `TimepickerCompat`, `CalendarCompat`, `MenuGridPreview`, `MotionComponentsPreview`, `HeadlessComponentsPreview`, `ContextSelector`) are imported from their own packages, as shown above.

## 5. Slots: the composition primitive

A **slot** is a named part of a component. You fill it either as a shorthand prop or by passing a React element; the component supplies the correct element, class names and ARIA attributes.

Common slots across the library:

- `Button` → `root`, `icon`
- `Badge` → `root`, `icon`
- `Input` → `root`, `input`, `contentBefore`, `contentAfter`
- `Field` → `root`, `label`, `validationMessage`, `validationMessageIcon`, `hint`
- `Persona` → `root`, `avatar`, `presence`, `primaryText`, `secondaryText`, `tertiaryText`, `quaternaryText`
- `Tooltip` → `content`
- `Card` → `root`, `floatingAction`, `checkbox`
- `Label` → `root`, `required`
- `Spinner` → `root`, `spinner`, `spinnerTail`, `label`

Practical rule: **prefer slots over hand-rolled markup.** `<Button icon={<Spinner size="tiny" />}>` looks right in every theme and size, whereas a hand-built `<span>` wrapper will not.

## 6. Props that shape appearance

FluentUI exposes a small, consistent vocabulary instead of free-form styling props. The most common axes are `appearance`, `size`, `shape`, `color` and `orientation`, and their allowed values differ per component:

| Axis | Components and values |
| --- | --- |
| `appearance` | `Button`: `secondary` \| `primary` \| `outline` \| `subtle` \| `transparent` · `Input`/`Textarea`: `outline` \| `underline` \| `filled-darker` \| `filled-lighter` (+ `-shadow` variants on `Input`/`Textarea`) · `Select`: `outline` \| `underline` \| `filled-darker` \| `filled-lighter` · `Badge`: `filled` \| `ghost` \| `outline` \| `tint` · `Card`: `filled` \| `filled-alternative` \| `outline` \| `subtle` · `Divider`: `brand` \| `default` \| `strong` \| `subtle` · `Spinner`: `primary` \| `inverted` · `Link`: `default` \| `subtle` |
| `size` | `Button`: `ButtonSize` · `Badge`: `tiny` → `extra-large` · `Avatar`: `AvatarSize` · `Persona`: `extra-small` → `huge` · `Text`: `100` → `1000` · `Slider`/`Switch`/`SpinButton`: `small` \| `medium` · `Input`/`Select`/`Textarea`/`Field`: `small` \| `medium` \| `large` · `Breadcrumb`/`Toolbar`: `small` \| `medium` \| `large` |
| `shape` | `Button`: `rounded` \| `circular` \| `square` · `Badge`: `circular` \| `rounded` \| `square` · `Image`: `square` \| `circular` \| `rounded` · `Checkbox`: `square` \| `circular` · `ProgressBar`: `rounded` \| `square` |
| `color` | `Badge`: `brand`, `danger`, `important`, `informative`, `severe`, `subtle`, `success`, `warning` · `Avatar`: `neutral`, `brand`, `colorful`, or a named color · `Rating`: `brand` \| `marigold` \| `neutral` · `ProgressBar`: `brand` \| `success` \| `warning` \| `error` |

If a component does not list a value, it does not support it — for example `Select` has no `filled-darker-shadow` appearance, and `Slider` has no `large` size.

## 7. Controlled vs. uncontrolled state

Nearly every stateful component offers a pair of props:

| Uncontrolled (default) | Controlled | Change callback |
| --- | --- | --- |
| `defaultValue` | `value` | `onChange` (`Input`, `Textarea`, `Select`) |
| `defaultChecked` | `checked` | `onChange` (`Checkbox`, `Switch`) |
| `defaultOpen` | `open` | `onOpenChange` (`Dialog`, `Popover`, `Menu`, `DatepickerCompat`) |
| `defaultSelected` | `selected` | `onSelectionChange` (`Card`) |
| `defaultSelectedValue` | `selectedValue` | `onSelectionChange`/`onNavItemSelect` (`SwatchPicker`, `Nav`) |
| `defaultOpenItems` | `openItems` | `onToggle` (`Accordion`, `Tree`) |
| `defaultSelectedItems` | `selectedItems` | `onSelectionChange` (`List`) |
| `defaultActiveIndex` | `activeIndex` | `onActiveIndexChange` (`Carousel`) |
| `defaultSelectedTime` | `selectedTime` | `onTimeChange` (`TimepickerCompat`) |
| `defaultOpenCategories` | `openCategories` | `onNavCategoryItemToggle` (`Nav`) |
| `defaultCheckedValues` | `checkedValues` | `onCheckedValueChange` (`Toolbar`) |

Two rules make this painless:

1. **Never mix** an uncontrolled default with a controlled value (`value` plus `defaultValue` on the same component).
2. **Read from `data`, not from the DOM event.** Callbacks are typed `(event, data)` and `data` carries the new value: `InputOnChangeData.value`, `CheckboxOnChangeData.checked`, `SwitchOnChangeData.checked`, `SliderOnChangeData.value`, `SelectOnChangeData.value`, `TextareaOnChangeData.value`, `RadioOnChangeData.value`, `CardOnSelectData` for `Card.onSelectionChange`, `OnOpenChangeData` for `Popover.onOpenChange`, `MenuOpenChangeData` for `Menu.onOpenChange`, `OnVisibleChangeData` for `Tooltip.onVisibleChange`.

## 8. Forms: let `Field` do the wiring

`Field` is the glue for every form control. It owns the `label`, `hint`, `validationMessage` and `validationMessageIcon` slots, plus `validationState` (`error` \| `warning` \| `success` \| `none`), `required`, `orientation` (`vertical` \| `horizontal`) and `size`.

```tsx
<Field label="Email" required validationState="error" validationMessage="Enter a valid address">
  <Input type="email" />
</Field>
```

- Use `Field` for `Input`, `Textarea`, `Select`, `SpinButton`, `Search`, `Slider`, `Radio`, `DatepickerCompat` and `TimepickerCompat`.
- `Checkbox` and `Switch` render their own label, so a `Field`-level `label` is usually redundant for them — use `Field` only when you need a hint or validation message.
- When you need full control, pair `Label` (`htmlFor`, `required`, `weight`, `size`) with a control that carries a matching `id`.
- `InfoLabel` attaches an info button with a popover (`info`, `popover`, `inline`, `size`) when a short hint is not enough.

Remaining form controls: `Radio` (`labelPosition`: `after` \| `below`), `Switch` (`labelPosition`: `above` \| `after` \| `before`, `disabledFocusable`), `Slider` (`min`, `max`, `step`, `vertical`), `SpinButton` (`value`/`displayValue`, `min`, `max`, `step`, `stepPage`, `precision`), `Rating` (`max`, `step`: `0.5` \| `1`, `itemLabel`, `iconFilled`/`iconOutline`), `ColorPicker` (`color: HsvColor`, `onColorChange`), `SwatchPicker` (`layout`: `row` \| `grid`, `focusMode`, `spacing`) and `Combobox` (`freeform`). `TagPicker` composes an input with a popover for multi-value entry (`noPopover`, `inline`, `onOpenChange`, `onOptionSelect`).

## 9. Displaying data

- `Avatar` — `name` (drives initials), `color`, `shape`, `size`, `active` + `activeAppearance` for presence.
- `Persona` — combines an avatar, presence dot and up to four lines of text; `textPosition` (`after` \| `before` \| `below`), `textAlignment`, `presenceOnly`.
- `Badge` — status pills; `iconPosition` (`before` \| `after`).
- `Text` — typography primitive with `size` (100–1000), `weight`, `italic`, `underline`, `strikethrough`, `truncate`, `wrap`, `block`, `align`, `font`.
- `Divider` — `vertical`, `inset`, `alignContent`.
- `Image` — `fit`, `block`, `bordered`, `shadow`, `shape`.
- `Card` — a surface with `appearance`, `orientation`, `size`, `focusMode` and optional selection via `selected`/`defaultSelected` + `onSelectionChange`.
- `Skeleton` — loading placeholders (`animation`: `wave` \| `pulse`, `appearance`: `opaque` \| `translucent`, `shape`: `circle` \| `square` \| `rectangle`, `width`, `size`).
- `List`, `Table`, `Tree` — structured collections with `navigationMode`/`selectionMode` (and `selectedItems`/`defaultSelectedItems` for `List`).
- `Tags` — compact secondary actions (`value`, `hasSecondaryAction`).

## 10. Feedback and status

- `Spinner` — `size` from `extra-tiny` to `huge`, `appearance` (`primary` \| `inverted`), `labelPosition` (`above` \| `below` \| `before` \| `after`) and `delay` (milliseconds before it appears — worth setting for fast operations to avoid flicker).
- `ProgressBar` — `value`, `max`, `shape`, `thickness` (`medium` \| `large`) and `color` (`brand` \| `success` \| `warning` \| `error`).
- `Toast` — transient confirmations; `appearance` controls the visual weight.
- `MessageBar` — persistent inline messaging with `intent`, `politeness` (`polite` \| `assertive`) and `shape`.

## 11. Overlays, portals and layering

- `Tooltip` — `content` (slot) plus the **required** `relationship` prop: `'label'` when the tooltip *is* the accessible name (icon-only buttons), `'description'` when it adds detail, `'inaccessible'` when it is purely decorative and must not be announced. Also `showDelay`, `hideDelay`, `visible`, `withArrow`, `appearance`.
- `Popover` — the generic anchored surface: `open`/`defaultOpen`/`onOpenChange`, `openOnHover`, `openOnContext`, `mouseLeaveDelay`, `closeOnScroll`, `closeOnIframeFocus`, `inline`, `size`, `withArrow`, `positioning`, and the focus props `trapFocus`, `legacyTrapFocus`, `inertTrapFocus`, `unstable_disableAutoFocus`.
- `Menu` — `openOnHover`, `openOnContext`, `hoverDelay`, `inline`, `persistOnItemClick`, `closeOnScroll`, `positioning`, `open`/`defaultOpen`/`onOpenChange`.
- `Dialog` — `open`/`defaultOpen`/`onOpenChange`, `modalType`, `inertTrapFocus`, `unmountOnClose`.
- `Drawer` — `type`: `'inline'` (pushes content) or `'overlay'`.
- `TeachingPopover` — guided, multi-step coach marks; combine the carousel parts (`navType`, `value`, `mediaLength`) with the footer layout props (`footerLayout`, `layout`).
- `Portal` — render anywhere in the DOM: `mountNode` accepts an `HTMLElement`, `{ element, className }`, or `null`.
- `Positioning` — the low-level primitive that anchors surfaces; most components expose a `positioning` prop instead of requiring direct use.

Because portals escape the React subtree, theme tokens and direction must reach them. Render the `FluentProvider` above the overlay, and set `applyStylesToPortals` (plus `targetDocument` for cross-document rendering).

## 12. Navigation and collections

- `Breadcrumb` — `focusMode` (`arrow` \| `tab`) and `size`.
- `Nav` — sidebar navigation with `density`, `selectedValue`/`defaultSelectedValue`, `openCategories`/`defaultOpenCategories`, `multiple`, and `onNavItemSelect`.
- `Link` — `appearance`, `inline`, `disabled`, `disabledFocusable`.
- `Tabs` — `size`, `vertical`, `appearance` (`transparent` \| `subtle` \| `subtle-circular` \| `filled-circular`), `defaultSelectedValue`, `onTabSelect`, `selectTabOnFocus`, `reserveSelectedTabSpace`.
- `Accordion` — `collapsible`, `multiple`, `navigation` (`linear` \| `circular`), `openItems`/`defaultOpenItems`, `onToggle`.
- `Tree` — `navigationMode`, `appearance`, `size`, `selectionMode`, `openItems`/`defaultOpenItems`, `checkedItems`.
- `Carousel` — `align`, `circular`, `draggable`, `groupSize`, `whitespace`, `motion`, `autoplayInterval`, `announcement`, `activeIndex`/`defaultActiveIndex`.
- `Toolbar` — `size`, `vertical`, `checkedValues`/`defaultCheckedValues`, `onCheckedValueChange`.
- `Overflow` — collapses items that do not fit; requires an `id`, takes an `onOverflowChange` callback and an optional `groupId`.

## 13. Dates and times

- `DatepickerCompat` — an input plus a calendar popup. Control it with `value`/`onSelectDate`, or let it be uncontrolled; also `minDate`, `maxDate`, `formatDate`, `parseDateFromString`, `allowTextInput`, `open`/`defaultOpen`/`onOpenChange`, `inlinePopup`, `showWeekNumbers`, `showGoToToday`, `highlightCurrentMonth`, `firstDayOfWeek`, `positioning`.
- `TimepickerCompat` — `selectedTime`/`defaultSelectedTime`, `onTimeChange`, `increment`, `startHour`, `endHour`, `dateAnchor`, `formatDateToTimeString`, `parseTimeStringToDate`.
- `CalendarCompat` — the full month/year grid with a much larger, more imperative surface (`navigatedDate`, `selectedDate`, `navigationIcons`, `strings`, `onNavigateDate`, `onSelectDate`, `dateRangeType`, `showWeekNumbers`, `yearPickerHidden`, and more). It is the lowest-level option and expects you to supply navigation icons and localized strings.

## 14. Utilities

- `Motion` — wrapper primitives for enter/exit (`children`, `appear`, `visible`, `direction`, `unmountOnExit`, `imperativeRef`, `onMotionStart`/`onMotionFinish`/`onMotionCancel`, `replayKey`).
- `MotionComponentsPreview` — staggered container animations (`itemDelay`, `itemDuration`, `delayMode`, `hideMode`, `reversed`).
- `Portal` — DOM placement.
- `Positioning` — anchor positioning.
- `ContextSelector` — context selectors that avoid re-rendering consumers when unrelated context values change.
- `Tabster` — focus order, groupper and modalizer primitives that power the library's keyboard behavior.
- `Aria` — renders accessible label markup for components that need both a visual label and an announcement.
- `Utilities` / `HeadlessComponentsPreview` — shared internals and unstyled entry points.
- `MenuGridPreview` — an opt-in grid layout for rich menus with sub-actions and sub-text.

## 15. Accessibility checklist

1. **Give every icon-only action a name.** Use `Tooltip` with `relationship="label"`, or an explicit `aria-label` on the control.
2. **Always set `Tooltip.relationship`.** It is required and drives whether the tooltip is a label, a description, or ignored by assistive tech.
3. **Use `Field` for control labels and validation** so the label, hint and error text are programmatically associated with the input.
4. **Prefer `disabledFocusable` over `disabled`** on interactive elements that must stay reachable by keyboard (for example, a `Button` that should still show a tooltip).
5. **Keep portals inside a `FluentProvider`** and set `applyStylesToPortals`/`targetDocument` — otherwise portaled surfaces lose theme tokens and can break contrast.
6. **Set `dir`** on the `FluentProvider` for RTL locales instead of mirroring styles by hand.
7. **Announce dynamic status.** `MessageBar` exposes `politeness` (`polite`/`assertive`) and `Carousel` accepts an `announcement` function — use them rather than relying on visual changes alone.
8. **Verify focus trapping.** `Dialog` (`inertTrapFocus`, `modalType`), `Popover` (`trapFocus`, `inertTrapFocus`, `unstable_disableAutoFocus`) and `Drawer` (`type`) control whether focus is contained while a surface is open.

## 16. TypeScript tips

- Change handlers are typed for you: write `onChange={(_ev, data) => setValue(data.value)}` and the `ev`/`data` types are inferred from the component props.
- Slot props accept either a primitive or an object: `contentBefore={<>$</>}` or `contentBefore={{ children: '$' }}` both type-check.
- Prefer narrowing unions (`ButtonSize`, `AvatarSize`, `PopoverSize`, `DialogModalType`, `MessageBarIntent`, `NavDensity`, `TabValue`, `SelectionItemId`, `DataGridCellFocusMode`, `SkeletonItemSize`) over importing raw string literals.
- Complex labels are typed as `any`/`ReactNode` in places (for example `Checkbox.children`), so it is on you to keep them semantic — a `<span>` with an aria-label is not a substitute for a real `<label>`.

## 17. Suggested path from here

1. Add the root `FluentProvider` and a couple of `Button`s.
2. Build your form with `Field` + `Input`/`Select`/`Checkbox`.
3. Add `Tooltip` and `Dialog` for help and confirmation flows, verifying focus and portal theming.
4. Layer in `Avatar`/`Persona`/`Badge` for identity and status, and `Spinner`/`ProgressBar` for long-running work.
5. Audit keyboard order, screen-reader names and RTL rendering before shipping.

## Key Takeaways

- Render a single Provider near the root of the application. It supplies theme tokens, text direction (`dir`) and portal style handling (`applyStylesToPortals`, `targetDocument`) to every FluentUI component, including content rendered through portals.
- Import from the package root (`@fluentui/react-components`); only the compat/preview capabilities (`DatepickerCompat`, `TimepickerCompat`, `CalendarCompat`, `MenuGridPreview`, `MotionComponentsPreview`, `HeadlessComponentsPreview`, `ContextSelector`) come from their own packages.
- Compose through slots rather than raw markup: `icon` on Button and Badge, `contentBefore`/`contentAfter` on Input, `label`/`hint`/`validationMessage` on Field, `content` on Tooltip, and the text and presence slots on Persona.
- Every stateful component offers an uncontrolled/controlled pair — `defaultValue`/`value`, `defaultChecked`/`checked`, `defaultOpen`/`open`, `defaultSelected`/`selected`, `selectedValue`/`defaultSelectedValue`, `openItems`/`defaultOpenItems`, `activeIndex`/`defaultActiveIndex`, `selectedTime`/`defaultSelectedTime`, `checkedValues`/`defaultCheckedValues`. Pick one pair and stay in it.
- Change handlers are always `(event, data)`. Read the new value from `data` (for example `data.value`, `data.checked`, `data.selected`, `data.open`) instead of reaching into the DOM event.
- Express visual variation with the documented prop vocabulary (`appearance`, `size`, `shape`, `color`, `orientation`, `focusMode`) — the allowed values differ per component, so check the component before assuming a value exists.
- Wrap form controls in Field to get labels, hints and validation wired to the control for free, and use `disabledFocusable` instead of `disabled` when an element must remain keyboard reachable.

## Examples

### App shell: Provider, Button, Avatar, Badge, Text and Divider

The minimum viable FluentUI screen. Provider wraps everything and receives the text direction plus applyStylesToPortals so content rendered in overlays keeps its tokens. Note how appearance/size/color props — not CSS — drive the look.

```tsx
import * as React from 'react';
import { Avatar, Badge, Button, Divider, FluentProvider, Text } from '@fluentui/react-components';

export const AppHeader: React.FC = () => (
  <FluentProvider dir="ltr" applyStylesToPortals>
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 16,
      }}
    >
      <Avatar
        name="Ada Lovelace"
        color="brand"
        active="active"
        activeAppearance="ring"
      />
      <Text size={500} weight="semibold">
        FluentUI Playground
      </Text>
      <Badge appearance="tint" color="success" size="small">
        Connected
      </Badge>
      <Divider vertical />
      <Button appearance="primary" onClick={() => console.log('sign in')}>
        Sign in
      </Button>
      <Button appearance="subtle">Docs</Button>
    </header>
  </FluentProvider>
);

export default AppHeader;
```

### Controlled form with Field, Input, Select and Textarea

Shows the Field + control pattern, validation state, and reading new values from the second onChange argument (data.value) instead of the DOM event.

```tsx
import * as React from 'react';
import { Button, Checkbox, Field, Input, Select, Switch, Textarea } from '@fluentui/react-components';

type Plan = 'starter' | 'pro' | 'enterprise';

export const SignupForm: React.FC = () => {
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [plan, setPlan] = React.useState<Plan>('pro');
  const [notes, setNotes] = React.useState('');
  const [accepted, setAccepted] = React.useState(false);
  const [newsletter, setNewsletter] = React.useState(true);
  const [submitted, setSubmitted] = React.useState(false);

  const emailInvalid = submitted && !email.includes('@');

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setSubmitted(true);
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 16, maxWidth: 480 }}>
      <Field
        label="Full name"
        required
        hint="Use the name you would like us to greet you with."
      >
        <Input
          value={fullName}
          placeholder="Ada Lovelace"
          onChange={(_ev, data) => setFullName(data.value)}
        />
      </Field>

      <Field
        label="Email"
        required
        validationState={emailInvalid ? 'error' : 'none'}
        validationMessage={emailInvalid ? 'Enter a valid email address.' : undefined}
      >
        <Input
          type="email"
          appearance="outline"
          value={email}
          onChange={(_ev, data) => setEmail(data.value)}
        />
      </Field>

      <Field label="Plan" required>
        <Select
          value={plan}
          onChange={(_ev, data) => setPlan(data.value as Plan)}
        >
          <option value="starter">Starter</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </Select>
      </Field>

      <Field label="Anything we should know?">
        <Textarea
          value={notes}
          resize="vertical"
          placeholder="Optional"
          onChange={(_ev, data) => setNotes(data.value)}
        />
      </Field>

      <Checkbox
        checked={accepted}
        label="I accept the terms and conditions"
        onChange={(_ev, data) => setAccepted(Boolean(data.checked))}
      />

      <Switch
        checked={newsletter}
        label="Send me product updates"
        onChange={(_ev, data) => setNewsletter(data.checked)}
      />

      <Button type="submit" appearance="primary" disabled={!accepted}>
        Create account
      </Button>
    </form>
  );
};

export default SignupForm;
```

### Data display: Card, Persona, Avatar, Badge, Image, Divider and Text

A selectable profile card. Card reports selection through onSelectionChange (data carries the new state), while Persona, Badge and Text handle identity and typography without custom CSS.

```tsx
import * as React from 'react';
import { Avatar, Badge, Button, Card, Divider, Image, Persona, Text } from '@fluentui/react-components';

export const ProfileCard: React.FC = () => {
  const [selected, setSelected] = React.useState(false);

  return (
    <Card
      appearance="outline"
      orientation="vertical"
      size="medium"
      selected={selected}
      onSelectionChange={(_ev, data) => setSelected(data.selected)}
      style={{ maxWidth: 360 }}
    >
      <Image
        block
        shape="rounded"
        fit="cover"
        shadow
        src="https://example.com/cover.png"
        alt="Team cover artwork"
      />

      <Persona
        name="Ada Lovelace"
        size="large"
        textPosition="after"
        avatar={{ color: 'colorful', name: 'Ada Lovelace' }}
      />

      <Divider />

      <Text block size={300} weight="regular">
        Building design systems and analytical engines since 1843.
      </Text>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Badge appearance="filled" color="brand" shape="rounded">
          Staff
        </Badge>
        <Badge
          appearance="outline"
          color="informative"
          icon={<Avatar name="Remote" size={16} />}
          iconPosition="before"
        >
          Remote
        </Badge>
      </div>

      <Button appearance="secondary">Follow</Button>
    </Card>
  );
};

export default ProfileCard;
```

### Settings panel with Radio, Slider, Switch, Spinbutton and Rating

Demonstrates the full range of stateful form controls: manual Radio grouping with a shared name, Slider value changes, Spinbutton nullable values, controlled Switch, and an uncontrolled Rating.

```tsx
import * as React from 'react';
import { Divider, Field, Radio, Rating, Slider, SpinButton, Switch, Text } from '@fluentui/react-components';

type Density = 'comfortable' | 'compact';

export const SettingsPanel: React.FC = () => {
  const [density, setDensity] = React.useState<Density>('comfortable');
  const [zoom, setZoom] = React.useState(100);
  const [fontSize, setFontSize] = React.useState<number | null>(14);
  const [reduceMotion, setReduceMotion] = React.useState(false);

  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 420 }}>
      <Text weight="semibold" size={400}>
        Appearance
      </Text>

      <Field label="Density">
        <div style={{ display: 'flex', gap: 16 }}>
          <Radio
            name="density"
            value="comfortable"
            label="Comfortable"
            checked={density === 'comfortable'}
            onChange={(_ev, data) => setDensity(data.value as Density)}
          />
          <Radio
            name="density"
            value="compact"
            label="Compact"
            checked={density === 'compact'}
            onChange={(_ev, data) => setDensity(data.value as Density)}
          />
        </div>
      </Field>

      <Field label={`Interface scale - ${zoom}%`}>
        <Slider
          min={50}
          max={200}
          step={10}
          value={zoom}
          onChange={(_ev, data) => setZoom(data.value)}
        />
      </Field>

      <Field label="Base font size" hint="Measured in pixels.">
        <SpinButton
          appearance="outline"
          size="medium"
          min={8}
          max={32}
          step={1}
          value={fontSize}
          onChange={(_ev, data) => setFontSize(data.value ?? null)}
        />
      </Field>

      <Switch
        checked={reduceMotion}
        label="Reduce motion"
        onChange={(_ev, data) => setReduceMotion(data.checked)}
      />

      <Divider />

      <Field label="How would you rate this guide?">
        <Rating defaultValue={5} max={5} step={1} size="medium" color="brand" />
      </Field>
    </div>
  );
};

export default SettingsPanel;
```

### Feedback: Spinner, Progress and a Tooltip on a disabled button

Shows asynchronous feedback patterns, including the important trick of using disabledFocusable so a button that cannot be activated is still keyboard reachable and can explain itself through a Tooltip with relationship="description".

```tsx
import * as React from 'react';
import { Badge, Button, ProgressBar, Spinner, Text, Tooltip } from '@fluentui/react-components';

export const SaveBar: React.FC = () => {
  const [saving, setSaving] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const startSaving = () => {
    setSaving(true);
    setProgress(0);

    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = current + 25;
        if (next >= 100) {
          window.clearInterval(timer);
          setSaving(false);
          return 100;
        }
        return next;
      });
    }, 400);
  };

  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {saving ? (
          <Spinner size="tiny" label="Saving changes" labelPosition="after" />
        ) : (
          <Badge appearance="tint" color="success">
            All changes saved
          </Badge>
        )}
      </div>

      <ProgressBar
        value={progress}
        max={100}
        shape="rounded"
        thickness="medium"
        color={progress === 100 ? 'success' : 'brand'}
      />

      <Text size={200}>
        {progress}% complete
      </Text>

      <div style={{ display: 'flex', gap: 8 }}>
        <Button appearance="primary" disabled={saving} onClick={startSaving}>
          Save
        </Button>

        <Tooltip
          content="You need the Editor role to publish this document"
          relationship="description"
          showDelay={200}
          withArrow
        >
          <Button appearance="secondary" disabledFocusable>
            Publish
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default SaveBar;
```

### Accessibility: Tooltip relationships, Label + Input, and RTL

A compact accessibility example: relationship="label" for an icon-only action, "inaccessible" for decorative text, an explicit Label/htmlFor pairing, and a right-to-left Provider.

```tsx
import * as React from 'react';
import { Button, Field, Input, Label, FluentProvider, Tooltip } from '@fluentui/react-components';

export const AccessibleToolbar: React.FC = () => {
  const [projectName, setProjectName] = React.useState('');
  const inputId = 'project-name-input';

  return (
    <FluentProvider dir="rtl" applyStylesToPortals>
      <div style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Tooltip content="Delete project" relationship="label">
            <Button appearance="subtle" shape="circular">
              x
            </Button>
          </Tooltip>

          <Tooltip content="Deleting cannot be undone" relationship="inaccessible">
            <Button appearance="subtle">Undo</Button>
          </Tooltip>

          <Tooltip content="Archive keeps the project read-only" relationship="description">
            <Button appearance="outline" disabledFocusable>
              Archive
            </Button>
          </Tooltip>
        </div>

        <Label htmlFor={inputId} required weight="semibold" size="medium">
          Project name
        </Label>
        <Input
          id={inputId}
          value={projectName}
          onChange={(_ev, data) => setProjectName(data.value)}
        />

        <Field
          label="Repository URL"
          hint="Shown in the project overview."
          validationState="warning"
          validationMessage="Repositories are private by default."
        >
          <Input type="url" appearance="underline" />
        </Field>
      </div>
    </FluentProvider>
  );
};

export default AccessibleToolbar;
```

### Cross-package components: DatepickerCompat and TimepickerCompat

Compat packages follow the same conventions as the core library, so they drop straight into a Field. DatepickerCompat takes value/onSelectDate and TimepickerCompat takes selectedTime/onTimeChange.

```tsx
import * as React from 'react';
import { DatepickerCompat } from '@fluentui/react-datepicker-compat';
import { TimepickerCompat } from '@fluentui/react-timepicker-compat';
import { Button, Field, Text } from '@fluentui/react-components';

export const ScheduleMeeting: React.FC = () => {
  const [date, setDate] = React.useState<Date | null>(null);
  const [time, setTime] = React.useState<Date | null>(null);

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 380 }}>
      <Text weight="semibold" size={400}>
        Schedule a meeting
      </Text>

      <Field label="Meeting date" required>
        <DatepickerCompat
          placeholder="Select a date"
          value={date}
          minDate={new Date()}
          onSelectDate={(next) => setDate(next ?? null)}
        />
      </Field>

      <Field label="Start time" required hint="30 minute increments.">
        <TimepickerCompat
          placeholder="Select a time"
          increment={30}
          selectedTime={time}
          onTimeChange={(_ev, data) => setTime(data.selectedTime)}
        />
      </Field>

      <Button
        appearance="primary"
        disabled={!date || !time}
        onClick={() => console.log('scheduled', date, time)}
      >
        Schedule
      </Button>
    </div>
  );
};

export default ScheduleMeeting;
```

## Pitfalls

- Forgetting the root Provider. Components render without theme tokens and can fall back to unstyled or low-contrast output; overlays that render through portals are especially affected, which is why `applyStylesToPortals` (and `targetDocument` for cross-document rendering) matter.
- Mixing controlled and uncontrolled props, such as passing both `value` and `defaultValue`, or `checked` without an `onChange`. The control appears frozen or React logs a warning. Use a `defaultX` prop alone, or the `x` prop together with its `onXChange` handler.
- Reaching into the DOM event in change handlers. `Button`-style events are not where the new value lives — `Input.onChange` gives you `(ev, data)` and you must read `data.value`; `Checkbox`/`Switch` use `data.checked`, `Slider` uses `data.value`, `Card.onSelectionChange` uses `data.selected`, and `Tooltip.onVisibleChange` uses `data.visible`.
- Omitting `Tooltip.relationship`. It is a required prop, and choosing the wrong value (`label` vs. `description` vs. `inaccessible`) either duplicates or hides information for screen-reader users.
- Using `disabled` when the user still needs to reach the control. A truly `disabled` element cannot be focused and cannot surface its `Tooltip`; use `disabledFocusable` for that case.
- Assuming every component supports every value in a family. `Select` has no `filled-darker-shadow` appearance, `Slider` has no `large` size, and `Link` has no `primary` appearance — the value lists are per-component.
- Building overlays outside the Provider subtree. Portaled surfaces mount at the document level, so theme tokens, direction and focus behavior must be provided by the Provider that sits above them; otherwise set `targetDocument` and `applyStylesToPortals` deliberately.
- Hand-rolling labels and error text next to a control instead of using `Field` or `Label` with a matching `id`. The visual result looks correct but assistive technology never associates the text with the input.
- Relying on visual changes alone for status. `Spinner` and `Progress` need meaningful text or a `label`/`labelPosition`, `MessageBar` exposes `politeness` for announcements, and `Carousel` provides an `announcement` callback.
- Reaching past the public API for details that belong to a component — for example rendering `Skeleton` placeholders or `Table` rows without the component's own structure. Use the component's slots and props instead of substituting bespoke markup.

## Accessibility

FluentUI v9 components ship with roles, ARIA wiring, focus management and keyboard interaction built in, but several decisions remain yours. (1) Naming: every icon-only action needs an accessible name — either use `Tooltip` with `relationship="label"` or set an explicit aria label on the control. `Tooltip.relationship` is required and must be chosen deliberately: `label` when the tooltip *is* the name, `description` when it supplements an existing name, and `inaccessible` when the content is decorative and must not be announced. (2) Form semantics: use `Field` so the label, `hint` and `validationMessage` slots are programmatically associated with the control, and reflect validity through `validationState` in addition to color. When you need manual control, pair `Label` (with `htmlFor`) and a matching `id` on the control. (3) Focus: keep interactive elements reachable — prefer `Button.disabledFocusable` and `Switch.disabledFocusable` over `disabled` when the element must still be discoverable, and configure trapping on surfaces via `Dialog.modalType`/`inertTrapFocus`, `Popover.trapFocus`/`inertTrapFocus`/`unstable_disableAutoFocus`, and `Drawer.type`. (4) Portals: overlays render outside the normal subtree, so keep them under the root `Provider` and set `applyStylesToPortals` (and `targetDocument` when rendering into another document) so contrast and theming survive. (5) Direction: set `Provider.dir` to `rtl` for right-to-left locales rather than mirroring manually. (6) Announcements: status changes should be conveyed beyond color — `MessageBar` exposes `politeness` (`polite` or `assertive`), `Spinner` accepts a `labelPosition`, `Progress` can be paired with visible text, and `Carousel` accepts an `announcement` function. (7) Keyboard models are already implemented for collections and menus (`Breadcrumb.focusMode`, `Accordion.navigation`, `Tabs.selectTabOnFocus`, `Tree.navigationMode`, `List.navigationMode`, `SwatchPicker.focusMode`, `Table.focusMode`), so preserve those props and verify tab order after customizing. (8) Decorative motion should stay non-essential; use the `Motion` and `MotionComponentsPreview` primitives for presence and stagger effects rather than blocking interactions.

**Referenced components**: Provider, Button, Input, Field, Label, Textarea, Select, Checkbox, Radio, Switch, Slider, Spinbutton, Rating, Combobox, TagPicker, Infolabel, ColorPicker, SwatchPicker, Avatar, Persona, Badge, Text, Divider, Image, Card, Skeleton, Tags, List, Table, Tree, Spinner, Progress, Toast, MessageBar, Tooltip, Popover, Menu, Dialog, Drawer, TeachingPopover, Portal, Positioning, Breadcrumb, Link, Nav, Tabs, Accordion, Carousel, Toolbar, Overflow, Motion, MotionComponentsPreview, ContextSelector, Tabster, Aria, Utilities, HeadlessComponentsPreview, MenuGridPreview, DatepickerCompat, TimepickerCompat, CalendarCompat

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
