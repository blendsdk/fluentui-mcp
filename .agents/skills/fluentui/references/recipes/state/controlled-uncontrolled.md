# Controlled vs Uncontrolled

> **Group**: state

## Goal

Implement Fluent UI v9 component state correctly by choosing between controlled (value/checked/open) and uncontrolled (defaultValue/defaultChecked/defaultOpen) APIs, wiring the matching change callbacks, and resetting state with the right technique for each mode.

## When to Use

Use this recipe whenever you wire up any stateful Fluent UI v9 component (Input, Textarea, Checkbox, Switch, Slider, Rating, RadioGroup, Accordion, TabList, Dialog, Popover, and peers) and must decide whether your component or the Fluent component owns the state. It is also the fix when a control looks 'frozen' (value prop without an update handler), when a defaultValue change is ignored after mount, or when you need programmatic control such as Expand all / Collapse all, wizard steps, or cross-field validation.

## When Not to Use

Do not use it when the state is purely internal and nobody else needs it - leaving an Accordion, TabList or Popover uncontrolled avoids extra re-renders. Do not use it as a substitute for a form-state library when you need schema validation, dirty tracking, or submit-lifecycle handling (use a form library on top of the Fluent controls instead). Do not use it to sync a prop into local state with useEffect - prefer deriving during render or lifting state up.

Fluent UI v9 (`@fluentui/react-components`) reuses the DOM convention: **the state prop you pass decides who owns the state**.

- **Controlled** - you pass `value` / `checked` / `open` / `openItems` / `selectedValue`. The component renders exactly what you give it and never writes internal state. If you do not apply the change in the callback, the control appears frozen.
- **Uncontrolled** - you pass the `default*` twin (`defaultValue`, `defaultChecked`, `defaultOpen`, `defaultOpenItems`, `defaultSelectedValue`). That value seeds internal state once at mount; later prop changes are ignored and the component owns the state from then on.
- **Neither** - the component is uncontrolled with its own default (empty string, `false`, `[]`, closed, no selection).

## The prop pairs you will meet

| Meaning | Controlled prop | Uncontrolled prop | Components |
| --- | --- | --- | --- |
| Text / numeric value | `value` | `defaultValue` | `Input`, `Textarea`, `Slider`, `SpinButton`, `Rating`, `RadioGroup`, `Dropdown` |
| Toggle state | `checked` | `defaultChecked` | `Checkbox`, `Switch`, `ToggleButton` |
| Open state | `open` | `defaultOpen` | `Dialog`, `Popover`, `Menu`, `Dropdown` |
| Expanded items | `openItems` | `defaultOpenItems` | `Accordion`, `Tree` |
| Single selection | `selectedValue` | `defaultSelectedValue` | `TabList`, `SwatchPicker`, `Nav` |
| Expanded nav categories | `openCategories` | `defaultOpenCategories` | `Nav` |
| Multi selection | `selectedItems` / `selectedValues` | `defaultSelectedItems` / `defaultSelectedValues` | `List` / `TagGroup` |
| Card selection | `selected` | `defaultSelected` | `Card` |
| Carousel position | `activeIndex` | `defaultActiveIndex` | `Carousel` |
| Grouped toggles | `checkedValues` | `defaultCheckedValues` | `Toolbar` |

Rule of thumb: **one owner per instance**. Pick `value` *or* `defaultValue` and stay there for the lifetime of that component instance.

## Read the change payload, not the DOM event

Every change callback has the shape `(event, data) => void`. Read state from `data`; the event is a React synthetic event and the component may wrap or reuse the internal input.

| Component | Callback | What to read |
| --- | --- | --- |
| `Input`, `Textarea` | `onChange` | `data.value` (string) |
| `Checkbox` | `onChange` | `data.checked` (`boolean \| 'mixed'`) |
| `Switch` | `onChange` | `data.checked` (boolean) |
| `Slider` | `onChange` | `data.value` (number) |
| `SpinButton` | `onChange` | `data.value` (`number \| null`) |
| `Rating` | `onChange` | `data.value` (number) |
| `RadioGroup` | `onChange` | `data.value` (string) |
| `Accordion` | `onToggle` | `data.value`, `data.openItems` |
| `TabList` | `onTabSelect` | `data.value` (the `Tab` `value`) |
| `Dialog`, `Popover`, `Menu` | `onOpenChange` | `data.open` (boolean) |
| `Toolbar` | `onCheckedValueChange` | `data.name`, `data.checkedValues` |

## Choosing a mode

**Uncontrolled is the right default for:**
- Values you only need at submit time (a plain form).
- High-frequency updates (typing in an `Input`, dragging a `Slider`) where parent re-renders are wasted work.
- Purely local UI state: which `Accordion` panel is open, which `Tab` is selected, whether a `Popover` is visible.

**Controlled is required when:**
- Another part of the UI must react to the value (live preview, character count, dependent fields).
- The value changes programmatically (Expand all, wizard next/back, server-driven defaults).
- You need validation, undo, or persistence.

## Resetting state

- **Controlled:** set the state back to the initial object/primitive. The rendered value follows instantly.
- **Uncontrolled:** the only reliable reset is to **remount** the subtree by changing its React `key`. Changing `defaultValue` after mount does nothing.

```tsx
// Controlled reset
<Button onClick={() => setName('')}>Reset</Button>

// Uncontrolled reset - remount with a new key
const [formKey, setFormKey] = React.useState(0);
<div key={formKey}>{/* uncontrolled controls */}</div>
<Button onClick={() => setFormKey(k => k + 1)}>Reset</Button>
```

Remounting destroys the DOM, so focus and any in-progress IME composition are lost - move focus back to the first field if you use this in a dialog or wizard.

## Mixing both modes in one tree

Mixing is normal and encouraged: a controlled `Accordion` (so the page can expand/collapse everything) can contain an uncontrolled `TabList` per panel (nobody outside cares which tab is selected). Keep the boundary explicit - the outer component owns only what it must render against.

## Supporting both modes in your own components

The Fluent-wide convention for a component that accepts either mode is:

1. Accept `value?: T` and `defaultValue?: T` plus `onChange?: (next: T) => void`.
2. Treat `value !== undefined` as 'controlled'.
3. Always call `onChange`, but only write internal state when uncontrolled.

Never copy a controlled prop into state:

```tsx
// BAD: two sources of truth, and the copy goes stale
const [value, setValue] = React.useState(props.value);
React.useEffect(() => setValue(props.value), [props.value]);
```

Derive during render (`const value = isControlled ? props.value : internal`) or lift the state up instead.

## TypeScript notes

- Keep state types as wide as the payload: `Checkbox` can report `'mixed'`, so `checked={data.checked === true}` for a boolean state, or store `boolean | 'mixed'`.
- `Tab` accepts `value: unknown` and `TabList.onTabSelect` reports `data.value: unknown` - type your state as `unknown` or narrow it deliberately, and never assume it is a string.
- `Accordion.onToggle` reports `data.openItems` typed against the accordion's value type; normalize it (`[...data.openItems]`) before storing so you own a fresh array.
- `SpinButton` reports `number | null` - decide up front what `null` means (usually 'empty') before putting it in a numeric state.

## Examples

### Uncontrolled form seeded with default* props and reset by key

Shows the uncontrolled API: Input/Textarea/Slider/Rating are seeded with defaultValue, Checkbox/Switch with defaultChecked. The component never re-renders while the user edits, and the only way to reset the controls is to remount them with a new key.

```tsx
import * as React from 'react';
import {
  Button,
  Checkbox,
  Field,
  Input,
  Rating,
  Slider,
  Switch,
  Text,
  Textarea,
} from '@fluentui/react-components';

/**
 * Every control below is UNCONTROLLED: it is seeded once with defaultValue /
 * defaultChecked and then owns its own state. Typing, dragging and toggling
 * never re-render this component.
 */
export const UncontrolledForm = () => {
  // Bumping this key remounts the subtree and restores the initial values,
  // which is the only reliable way to 'reset' uncontrolled state.
  const [formKey, setFormKey] = React.useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
      <Text size={400} weight='semibold' block>
        Uncontrolled form
      </Text>

      <div key={formKey} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label='Display name' hint='defaultValue seeds the Input once, at mount'>
          <Input defaultValue='Ada Lovelace' />
        </Field>

        <Field label='Bio'>
          <Textarea defaultValue='Wrote the first published algorithm.' resize='vertical' />
        </Field>

        <Checkbox defaultChecked label='Email me product news' />
        <Switch defaultChecked label='Desktop notifications' />

        <Field label='Volume'>
          <Slider defaultValue={40} min={0} max={100} />
        </Field>

        <Field label='Quality'>
          <Rating defaultValue={4} max={5} />
        </Field>
      </div>

      <Button appearance='primary' onClick={() => setFormKey((k) => k + 1)}>
        Reset to defaults
      </Button>
    </div>
  );
};
```

### Controlled form with lifted state and a controlled Dialog

Shows the controlled API end to end: one state object drives Input, Textarea, RadioGroup, Checkbox, Switch and Slider through value/checked, each callback writes the payload field back into state, validation is derived during render, and a controlled Dialog's open state is owned by the parent so it can also be closed programmatically.

```tsx
import * as React from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Radio,
  RadioGroup,
  Slider,
  Switch,
  Text,
  Textarea,
} from '@fluentui/react-components';

type FormState = {
  email: string;
  notes: string;
  plan: string;
  newsletter: boolean;
  alerts: boolean;
  seats: number;
};

const INITIAL_FORM: FormState = {
  email: '',
  notes: '',
  plan: 'team',
  newsletter: false,
  alerts: true,
  seats: 3,
};

export const ControlledForm = () => {
  // Single source of truth for the whole form.
  const [form, setForm] = React.useState<FormState>(INITIAL_FORM);
  // Controlled Dialog: the parent owns 'open', so the Confirm button can close it.
  const [reviewOpen, setReviewOpen] = React.useState(false);

  // Functional update keeps the handler free of stale closures.
  const update = (patch: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const emailValid = /^[^@\s]+@[^@\s]+$/.test(form.email);
  const showEmailError = form.email.length > 0 && !emailValid;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
      <Text size={400} weight='semibold' block>
        Controlled form
      </Text>

      <Field
        label='Work email'
        required
        validationState={showEmailError ? 'error' : 'none'}
        validationMessage={showEmailError ? 'Enter a valid email address' : undefined}
      >
        <Input
          type='email'
          value={form.email}
          onChange={(_, data) => update({ email: data.value })}
        />
      </Field>

      <Field label='Notes'>
        <Textarea
          resize='vertical'
          value={form.notes}
          onChange={(_, data) => update({ notes: data.value })}
        />
      </Field>

      <Field label='Plan'>
        <RadioGroup
          value={form.plan}
          onChange={(_, data) => update({ plan: data.value })}
        >
          <Radio value='personal' label='Personal' />
          <Radio value='team' label='Team' />
          <Radio value='enterprise' label='Enterprise' />
        </RadioGroup>
      </Field>

      {/* Checkbox is tri-state capable, so coerce 'mixed' to a boolean for this form. */}
      <Checkbox
        label='Email me product news'
        checked={form.newsletter}
        onChange={(_, data) => update({ newsletter: data.checked === true })}
      />

      <Switch
        label='Desktop notifications'
        checked={form.alerts}
        onChange={(_, data) => update({ alerts: data.checked })}
      />

      <Field label={`Seats: ${form.seats}`}>
        <Slider
          min={1}
          max={25}
          value={form.seats}
          onChange={(_, data) => update({ seats: data.value })}
        />
      </Field>

      <div style={{ display: 'flex', gap: 8 }}>
        <Button appearance='secondary' onClick={() => setForm(INITIAL_FORM)}>
          Reset
        </Button>

        <Dialog open={reviewOpen} onOpenChange={(_, data) => setReviewOpen(data.open)}>
          <DialogTrigger disableButtonEnhancement>
            <Button appearance='primary' disabled={!emailValid}>
              Review and submit
            </Button>
          </DialogTrigger>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>Review your request</DialogTitle>
              <DialogContent>
                <Text block>Email: {form.email}</Text>
                <Text block>Plan: {form.plan}</Text>
                <Text block>Seats: {form.seats}</Text>
              </DialogContent>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement action='close'>
                  <Button appearance='secondary'>Cancel</Button>
                </DialogTrigger>
                <Button appearance='primary' onClick={() => setReviewOpen(false)}>
                  Confirm
                </Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      </div>
    </div>
  );
};
```

### Mixed tree: controlled Accordion and Popover, uncontrolled TabList

A settings panel where the parent controls which accordion sections are open (so Expand all / Collapse all is possible) and controls a Popover so it can be dismissed from inside, while each AccordionPanel keeps an uncontrolled TabList that owns its own selection.

```tsx
import * as React from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Button,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Tab,
  TabList,
  Text,
} from '@fluentui/react-components';

const SECTIONS = [
  { value: 'profile', header: 'Profile', summary: 'Name, avatar and contact details.' },
  { value: 'usage', header: 'Usage', summary: 'Requests, storage and seats.' },
  { value: 'billing', header: 'Billing', summary: 'Invoices and payment method.' },
] as const;

export const MixedStatePanel = () => {
  // CONTROLLED: the parent owns which sections are open.
  const [openItems, setOpenItems] = React.useState<string[]>(['profile']);
  // CONTROLLED: the parent owns popover visibility so it can close on demand.
  const [helpOpen, setHelpOpen] = React.useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Text size={400} weight='semibold'>
          Settings
        </Text>

        <Popover open={helpOpen} onOpenChange={(_, data) => setHelpOpen(data.open)} withArrow>
          <PopoverTrigger disableButtonEnhancement>
            <Button size='small' appearance='subtle'>
              What is this?
            </Button>
          </PopoverTrigger>
          <PopoverSurface>
            <Text block>Expand a section to see its details.</Text>
            <Button size='small' appearance='primary' onClick={() => setHelpOpen(false)}>
              Got it
            </Button>
          </PopoverSurface>
        </Popover>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <Button size='small' onClick={() => setOpenItems(SECTIONS.map((s) => s.value))}>
          Expand all
        </Button>
        <Button size='small' onClick={() => setOpenItems([])}>
          Collapse all
        </Button>
      </div>

      <Accordion
        multiple
        collapsible
        openItems={openItems}
        onToggle={(_, data) => setOpenItems([...data.openItems] as string[])}
      >
        {SECTIONS.map((section) => (
          <AccordionItem key={section.value} value={section.value}>
            <AccordionHeader>{section.header}</AccordionHeader>
            <AccordionPanel>
              <Text block>{section.summary}</Text>
              {/* UNCONTROLLED: each TabList owns its own selection. */}
              <TabList defaultSelectedValue='summary'>
                <Tab value='summary'>Summary</Tab>
                <Tab value='details'>Details</Tab>
              </TabList>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
```

### Dual-API component with a useControllableState hook

A small reusable hook plus a Disclosure component that accepts either open + onOpenChange (controlled) or defaultOpen (uncontrolled), following the same convention every Fluent component uses. The demo shows the same component used in both modes.

```tsx
import * as React from 'react';
import { Button, Checkbox, Switch, Text } from '@fluentui/react-components';

/** Mirrors the Fluent convention: `value` controls, `defaultValue` seeds, `onChange` always fires. */
function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
) {
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState<T>(defaultValue);
  const current = isControlled ? (value as T) : uncontrolled;

  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) {
        setUncontrolled(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [current, setValue] as const;
}

type DisclosureProps = {
  title: string;
  children: React.ReactNode;
  /** Controlled: pass this together with onOpenChange. */
  open?: boolean;
  /** Uncontrolled: the initial value, ignored after mount. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const Disclosure: React.FC<DisclosureProps> = ({
  title,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useControllableState(open, defaultOpen, onOpenChange);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Switch checked={isOpen} onChange={(_, data) => setIsOpen(data.checked)} label={title} />
      {isOpen && <Text block>{children}</Text>}
    </div>
  );
};

export const OptionalControlledExample = () => {
  const [parentControlled, setParentControlled] = React.useState(false);
  const [parentOpen, setParentOpen] = React.useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420 }}>
      <Checkbox
        checked={parentControlled}
        onChange={(_, data) => setParentControlled(data.checked === true)}
        label='Let the parent own the state'
      />

      <Button disabled={!parentControlled} onClick={() => setParentOpen((o) => !o)}>
        Toggle from the parent (only works when controlled)
      </Button>

      {parentControlled ? (
        <Disclosure title='Details' open={parentOpen} onOpenChange={setParentOpen}>
          The parent owns this state, so the external button works.
        </Disclosure>
      ) : (
        <Disclosure title='Details' defaultOpen>
          This instance owns its own state; the external button is ignored.
        </Disclosure>
      )}
    </div>
  );
};
```

## Pitfalls

- Passing a controlled prop without applying the change: `<Input value={name} />` with no state update makes the Input appear read-only (and React warns for controlled-to-uncontrolled switches). Always ship the controlled prop together with its callback, or drop to `defaultValue`.
- Passing `undefined` to a controlled prop: `value={maybeUndefined}` makes React treat the input as uncontrolled and warns when it flips. Use a sentinel such as `value={name ?? ''}` and keep the prop defined for the lifetime of the instance.
- Expecting `defaultValue` / `defaultChecked` / `defaultOpen` changes to take effect: they only seed state at mount. To reset uncontrolled state, remount the subtree with a new `key`; to change it later, move to the controlled prop.
- Mutating state arrays instead of replacing them: `openItems.push(value)` (or writing to the array returned by `data.openItems`) produces the same reference and no re-render. Always create a new array, e.g. `setOpenItems([...data.openItems])`.
- Assuming `data.checked` is a boolean on Checkbox: it is `boolean | 'mixed'`, so storing it directly in a `boolean` state fails to compile or misrepresents the indeterminate state. Coerce deliberately with `data.checked === true` or widen the state type.
- Treating `TabList.onTabSelect` values as strings: `Tab.value` is `unknown` by design, so `data.value` is `unknown`. Type the state as `unknown` or narrow it explicitly instead of casting blindly.
- Controlling a Dialog/Popover/Menu without `onOpenChange`: Escape, backdrop click and close triggers stop working and the surface can only be closed by your code. Controlled surfaces must always propagate `data.open` back into state.
- Mirroring props into state with `useEffect` (`useState(props.value)` plus a sync effect): this creates two sources of truth and a render-lag. Derive the value during render, or lift the state into the parent instead.
- Over-controlling high-frequency inputs: keeping a Slider or Input in a top-level state object re-renders the whole tree on every keystroke or drag tick. Keep the state local to the smallest component that needs it, or leave the control uncontrolled.

## Accessibility

Both modes render identical, equally accessible DOM - the difference is only where the state lives, so accessibility work is about keeping the rendered state truthful:

- Always pair the control with a programmatic label: use Field for Input/Textarea/Slider/Rating or the label slot of Checkbox/Switch/Radio. A controlled control with no label is still unlabeled.
- Keep change handlers synchronous. If you debounce or defer a controlled update, the rendered value (and therefore the value screen readers announce) can disagree with what the user typed or selected.
- A controlled Dialog, Popover or Menu MUST implement onOpenChange. Without it Escape, backdrop clicks and close triggers cannot dismiss the surface, which traps keyboard users. The same applies to a controlled Accordion/TabList whose parent never applies data.openItems / data.value.
- Do not remove focusability to 'lock' a value. Use disabled or disabledFocusable on Button, or simply omit the change handler and let the component stay uncontrolled; hiding interactivity breaks focus order.
- Preserve the tri-state signal: Checkbox reports data.checked as boolean | 'mixed'. Collapsing 'mixed' into false/true for a boolean state is fine for a simple form, but if the indeterminate state is meaningful to the user, store boolean | 'mixed' so assistive technology keeps announcing 'partially checked'.
- Remount-based resets (key changes) destroy the DOM: focus is lost and an in-progress IME composition is discarded. After a reset, move focus back to the first field, and never remount while a controlled Dialog is open.
- Keep controlled numeric values within min/max (Slider, SpinButton, Rating) so the thumb's ARIA value stays valid; clamping belongs in your update handler, not in the render output.

## Components used

- [Accordion](../../components/accordion.md)
- [AccordionHeader](../../components/accordion-header.md)
- [AccordionItem](../../components/accordion-item.md)
- [AccordionPanel](../../components/accordion-panel.md)
- [Button](../../components/button.md)
- [Checkbox](../../components/checkbox.md)
- [Dialog](../../components/dialog.md)
- [DialogActions](../../components/dialog-actions.md)
- [DialogBody](../../components/dialog-body.md)
- [DialogContent](../../components/dialog-content.md)
- [DialogSurface](../../components/dialog-surface.md)
- [DialogTitle](../../components/dialog-title.md)
- [DialogTrigger](../../components/dialog-trigger.md)
- [Field](../../components/field.md)
- [Input](../../components/input.md)
- [Popover](../../components/popover.md)
- [PopoverSurface](../../components/popover-surface.md)
- [PopoverTrigger](../../components/popover-trigger.md)
- [Radio](../../components/radio.md)
- [RadioGroup](../../components/radio-group.md)
- [Rating](../../components/rating.md)
- [Slider](../../components/slider.md)
- [Switch](../../components/switch.md)
- [Tab](../../components/tab.md)
- [TabList](../../components/tab-list.md)
- [Text](../../components/text.md)
- [Textarea](../../components/textarea.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
