# Controlled vs Uncontrolled

> **Group**: state

## Goal

Decide, implement, and switch between controlled and uncontrolled state in Fluent UI React v9 components, including resetting uncontrolled fields, reading their values at submit time, mixing a controlled shell with uncontrolled leaves, and migrating a field from one mode to the other without breaking it.

## When to Use

Use this recipe when you are building forms, settings panels, wizards, or overlay/collection state (Dialog open, Accordion open items, Tabs selection) and need to know whether React or the DOM should own the value: when to pass `value`/`checked`/`open`/`openItems` versus `defaultValue`/`defaultChecked`/`defaultOpen`/`defaultOpenItems`, how to read uncontrolled values, how to reset either kind, and how to safely combine both in one component.

## When Not to Use

Do not use this recipe as a general guide to validation rules, form layout, or schema handling — that belongs to form/Field recipes. If you are integrating a form library (react-hook-form, Formik, TanStack Form), follow that library's controller pattern instead of hand-writing `value` + `onChange`, since the library already implements the controlled/uncontrolled decision for you. If your state is global/cross-tree, use a store or context rather than threading controlled props through many layers.

Every interactive Fluent UI React v9 component is **controllable**. It ships two ways to own its
state:

- **Uncontrolled** – you pass the `default*` prop (or nothing) and the component keeps the value
  internally (in the DOM for form fields, in React state for overlays and collections).
- **Controlled** – you pass the plain prop (`value`, `checked`, `open`, `openItems`, ...) and the
  component renders exactly what you give it. It stops holding state of its own and reports every
  user interaction through the matching change handler.

A component decides by looking at the plain prop: when it is `undefined`, internal state is used
and the `default*` prop seeds it; when the prop has any other value, your value is rendered
verbatim and the `default*` prop is ignored.

## The prop pairs

| Component | Controlled prop | Uncontrolled prop | Change handler |
| --- | --- | --- | --- |
| `Input` | `value` | `defaultValue` | `onChange` -> `data.value` |
| `Textarea` | `value` | `defaultValue` | `onChange` -> `data.value` |
| `Checkbox` | `checked` | `defaultChecked` | `onChange` -> `data.checked` (`boolean \| 'mixed'`) |
| `Switch` | `checked` | `defaultChecked` | `onChange` -> `data.checked` |
| `Slider` | `value` | `defaultValue` | `onChange` -> `data.value` |
| `Dialog`, `Menu`, `Popover` | `open` | `defaultOpen` | `onOpenChange` |
| `Accordion` | `openItems` | `defaultOpenItems` | `onToggle` |
| `Tree` | `openItems` | `defaultOpenItems` | – |
| `Tabs` | `selectedValue` | `defaultSelectedValue` | `onTabSelect` |
| `Nav` | `selectedValue` | `defaultSelectedValue` | `onNavItemSelect` |
| `List` | `selectedItems` | `defaultSelectedItems` | `onSelectionChange` |
| `Card` | `selected` | `defaultSelected` | `onSelectionChange` |
| `Carousel` | `activeIndex` | `defaultActiveIndex` | `onActiveIndexChange` |
| `SwatchPicker` | `selectedValue` | `defaultSelectedValue` | `onSelectionChange` |

**Rule of thumb:** pass the controlled prop *only* when you also handle the change. A controlled
prop without its handler is a frozen component: `value` without `onChange` makes a text field
read-only, and `checked` without `onChange` produces a switch that looks interactive but never
moves.

## Choosing a mode

Stay **uncontrolled** when:

- The value is only needed at submit time (a classic form).
- You want zero re-renders while the user types — large forms stay fast because typing only touches
  the DOM node.
- You want native behavior for free: autofill, `<form>` reset, `FormData`, browser validation.
- The component is a leaf you never have to read programmatically.

Go **controlled** when:

- The value drives other UI: enabling/disabling the submit `Button`, live counters, dependent
  fields, previews.
- You must set the value from outside the component: async load, "apply preset", cascading a
  choice from another field, undo.
- You want to validate on every keystroke (derive `Field`'s `validationState` from state).
- The value is part of a larger state object you already own.

## Reading values out of uncontrolled fields

Uncontrolled fields still forward `name`/`value` to their underlying native control, so the fastest
way to read them is a native `<form>` plus `FormData`:

```tsx
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const email = String(data.get('email') ?? '');
};
```

Alternatives: keep a `React.useRef` and read the underlying element on demand, or lift only the
fields you actually need to observe into state (see the hybrid section). Whatever you choose, do
not render derived UI from an uncontrolled value — nothing re-renders when the user types.

## Resetting

**Uncontrolled** has three reset tools, in order of preference:

1. Native reset — `<Button type='reset'>` inside the `<form>` restores the DOM defaults, exactly
   like a plain HTML form.
2. Re-key the control or the whole form — `key={revision}` remounts the subtree so computed
   `defaultValue`s are re-applied. This is the only thing that works when the default is dynamic
   (a loaded record, a selected mode).
3. Imperatively assigning `element.value` — avoid; it bypasses React and can desync the DOM from a
   later controlled render.

**Controlled** reset is simply `setState(initialState)`. Keep a frozen `initialState` constant so
reset never drifts from the first render.

## Hybrid: controlled shell, uncontrolled leaves

A very common and efficient shape is a controlled "shell" value plus uncontrolled leaves:

- Controlled `Switch` decides a mode (basic vs advanced).
- Uncontrolled `Input`s hold the free text, and their `key` includes the mode, so flipping the mode
  remounts them with new defaults while typing stays re-render free.
- A "Discard edits" `Button` bumps a revision counter to force the same remount on demand.

Only the shell value lives in React state; everything else is owned by the DOM until submit.

## Migrating between modes

1. Add `value` **and** `onChange` in the same commit — never one without the other.
2. Initialize state from the same value as the old `defaultValue` so nothing visually changes.
3. Remove `defaultValue`; passing both is legal but confusing (the default is used for the very
   first render only and then silently ignored).
4. Do not let the controlled prop flip between `undefined` and a defined value across renders —
   coalesce to a string/boolean (`value={text ?? ''}`) so the input never changes identity between
   uncontrolled and controlled.
5. Going the other way (controlled -> uncontrolled): move the value into `defaultValue`, delete the
   handler, and re-key the element if you still want programmatic resets.

## Examples

### Fully uncontrolled form with FormData and key-based reset

A profile form where every control owns its own value (Input, Textarea, Slider, Switch, Checkbox use defaultValue/defaultChecked). Values are read once, at submit time, with FormData, and the whole form is reset by bumping a key so the default values are re-applied.

```tsx
import * as React from 'react';
import { Button, Checkbox, Divider, Field, Input, Slider, Switch, Text, Textarea } from '@fluentui/react-components';

/**
 * Uncontrolled form: every control owns its own value, so typing never re-renders React.
 * Values are read exactly once, on submit, through the native FormData API.
 */
export const UncontrolledProfileForm: React.FC = () => {
  // Changing this key remounts the form and re-applies every defaultValue / defaultChecked.
  const [revision, setRevision] = React.useState(0);
  const [submitted, setSubmitted] = React.useState<string[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSubmitted(
      Array.from(data.entries()).map(([name, value]) => `${name}: ${String(value)}`),
    );
  };

  return (
    <form
      key={revision}
      onSubmit={handleSubmit}
      style={{ display: 'grid', gap: 12, maxWidth: 420 }}
    >
      <Field label="Display name" hint="The DOM owns this value - no React state involved.">
        <Input name="displayName" defaultValue="Ada Lovelace" />
      </Field>

      <Field label="Bio">
        <Textarea name="bio" defaultValue="Mathematician and writer." resize="vertical" />
      </Field>

      <Field label="Monthly budget">
        <Slider name="budget" defaultValue={250} min={0} max={1000} step={50} />
      </Field>

      <Field label="Notifications" orientation="horizontal">
        <Switch name="notifications" defaultChecked label="Email me about replies" />
      </Field>

      <Field label="Newsletter" orientation="horizontal">
        <Checkbox name="newsletter" value="weekly" defaultChecked label="Weekly digest" />
      </Field>

      <Divider />

      <div style={{ display: 'flex', gap: 8 }}>
        <Button appearance="primary" type="submit">
          Read values with FormData
        </Button>
        <Button appearance="outline" onClick={() => setRevision((current) => current + 1)}>
          Reset to defaults
        </Button>
      </div>

      {submitted.length > 0 && (
        <div>
          {submitted.map((line, index) => (
            <Text key={`${index}-${line}`} block font="monospace" size={200}>
              {line}
            </Text>
          ))}
        </div>
      )}
    </form>
  );
};
```

### Fully controlled form with derived validation and state-based reset

The same form shape, but a single React state object is the source of truth. Every control receives value/checked plus a handler, the Field validationState is derived from state, the submit Button is enabled by derived state, and reset sets the state back to a frozen initial object.

```tsx
import * as React from 'react';
import { Button, Checkbox, Divider, Field, Input, MessageBar, Slider, Switch, Text, Textarea } from '@fluentui/react-components';

type FormState = {
  email: string;
  bio: string;
  budget: number;
  notifications: boolean;
  acceptedTerms: boolean;
};

const initialState: FormState = {
  email: '',
  bio: '',
  budget: 250,
  notifications: true,
  acceptedTerms: false,
};

const BIO_LIMIT = 120;

/**
 * Controlled form: React owns every value, so the UI can react to typing
 * (validation, counters, enabling the submit button) at the cost of a re-render per keystroke.
 */
export const ControlledProfileForm: React.FC = () => {
  const [form, setForm] = React.useState<FormState>(initialState);
  const [saved, setSaved] = React.useState<FormState | null>(null);

  const emailValid = /^\S+@\S+\.\S+$/.test(form.email);
  const emailInvalid = form.email !== '' && !emailValid;
  const bioTooLong = form.bio.length > BIO_LIMIT;
  const canSubmit = emailValid && !bioTooLong && form.acceptedTerms;

  const reset = () => {
    setForm(initialState);
    setSaved(null);
  };

  return (
    <form
      style={{ display: 'grid', gap: 12, maxWidth: 420 }}
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(form);
      }}
    >
      <Field
        label="Email"
        required
        validationState={emailInvalid ? 'error' : emailValid ? 'success' : 'none'}
        validationMessage={emailInvalid ? 'Enter a valid email address.' : undefined}
      >
        <Input
          type="email"
          value={form.email}
          onChange={(_, data) => setForm((prev) => ({ ...prev, email: data.value }))}
        />
      </Field>

      <Field
        label="Bio"
        hint={`${form.bio.length}/${BIO_LIMIT} characters`}
        validationState={bioTooLong ? 'error' : 'none'}
        validationMessage={
          bioTooLong ? `Shorten the bio to ${BIO_LIMIT} characters or fewer.` : undefined
        }
      >
        <Textarea
          value={form.bio}
          resize="vertical"
          onChange={(_, data) => setForm((prev) => ({ ...prev, bio: data.value }))}
        />
      </Field>

      <Field label="Monthly budget">
        <Slider
          value={form.budget}
          min={0}
          max={1000}
          step={50}
          onChange={(_, data) => setForm((prev) => ({ ...prev, budget: data.value }))}
        />
      </Field>

      <Field label="Notifications" orientation="horizontal">
        <Switch
          checked={form.notifications}
          label="Email me about replies"
          onChange={(_, data) => setForm((prev) => ({ ...prev, notifications: data.checked }))}
        />
      </Field>

      <Checkbox
        checked={form.acceptedTerms}
        label="I accept the terms and conditions"
        onChange={(_, data) =>
          setForm((prev) => ({ ...prev, acceptedTerms: data.checked === true }))
        }
      />

      <Divider />

      <div style={{ display: 'flex', gap: 8 }}>
        <Button appearance="primary" type="submit" disabled={!canSubmit}>
          Save
        </Button>
        <Button appearance="outline" onClick={reset}>
          Reset state to initial values
        </Button>
      </div>

      {saved && (
        <MessageBar intent="success">
          <Text>
            Saved {saved.email} - budget {saved.budget} - notifications{' '}
            {saved.notifications ? 'on' : 'off'}
          </Text>
        </MessageBar>
      )}
    </form>
  );
};
```

### Hybrid panel: controlled Switch, uncontrolled keyed Inputs

A settings panel where only the mode lives in React state (a controlled Switch). The numeric Inputs stay uncontrolled and are re-keyed on mode change or on 'Discard edits' so their defaultValue is re-applied, and the values are still read once on submit with FormData.

```tsx
import * as React from 'react';
import { Badge, Button, Divider, Field, Input, MessageBar, Switch, Text } from '@fluentui/react-components';

type Mode = 'basic' | 'advanced';

const defaultsByMode: Record<Mode, { timeout: string; retries: string }> = {
  basic: { timeout: '5000', retries: '1' },
  advanced: { timeout: '30000', retries: '5' },
};

export const HybridSettingsPanel: React.FC = () => {
  // Controlled shell: React owns the mode and re-renders when it changes.
  const [mode, setMode] = React.useState<Mode>('basic');
  // Uncontrolled leaves: bumping this counter remounts the inputs and re-applies defaults.
  const [revision, setRevision] = React.useState(0);
  const [result, setResult] = React.useState<string>('');

  const defaults = defaultsByMode[mode];
  const fieldKey = (name: string) => `${name}-${mode}-${revision}`;

  return (
    <form
      style={{ display: 'grid', gap: 12, maxWidth: 420 }}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setResult(`mode=${mode} timeout=${data.get('timeout')} retries=${data.get('retries')}`);
      }}
    >
      <Switch
        checked={mode === 'advanced'}
        label="Show advanced settings"
        onChange={(_, data) => setMode(data.checked ? 'advanced' : 'basic')}
      />

      <MessageBar intent={mode === 'advanced' ? 'warning' : 'info'}>
        {mode === 'advanced'
          ? 'Advanced mode applies long timeouts and aggressive retries.'
          : 'Basic mode uses safe defaults for most users.'}
      </MessageBar>

      <Text>
        Active mode:{' '}
        <Badge appearance="tint" color={mode === 'advanced' ? 'warning' : 'success'}>
          {mode}
        </Badge>
      </Text>

      <Field label="Request timeout (ms)" hint={`Default for ${mode} mode: ${defaults.timeout}`}>
        {/* The key includes the mode, so switching modes remounts the input with a new default. */}
        <Input
          key={fieldKey('timeout')}
          name="timeout"
          type="number"
          defaultValue={defaults.timeout}
        />
      </Field>

      <Field label="Retries" hint={`Default for ${mode} mode: ${defaults.retries}`}>
        <Input
          key={fieldKey('retries')}
          name="retries"
          type="number"
          defaultValue={defaults.retries}
        />
      </Field>

      <Divider />

      <div style={{ display: 'flex', gap: 8 }}>
        <Button appearance="primary" type="submit">
          Apply
        </Button>
        <Button appearance="outline" onClick={() => setRevision((current) => current + 1)}>
          Discard edits
        </Button>
      </div>

      {result !== '' && (
        <Text block font="monospace" size={200}>
          {result}
        </Text>
      )}
    </form>
  );
};
```

## Pitfalls

- Passing a controlled prop without its change handler (or the handler without the prop). `value` without `onChange` renders a silently read-only input, and `onChange` without `value`/`defaultValue` produces a field that looks controlled but is not. Ship the pair together.
- Letting the controlled prop flip between `undefined` and a defined value across renders (for example `value={user?.email}` while `user` loads asynchronously). React switches the field from uncontrolled to controlled, warns, and the typed value can be lost. Initialize state (`useState('')`) or coalesce (`value={user?.email ?? ''}`), and never pass `value` and `defaultValue` on the same element.
- Expecting `defaultValue` / `defaultChecked` to update when props change — they are applied on the first render only. When defaults are dynamic (a mode, a loaded record), re-key the control (`key={mode}`) so it remounts. Conversely, do not re-key on every keystroke: each remount drops caret position, selection, scroll, IME composition, and focus.
- Mutating state inside a controlled handler, e.g. `setForm((prev) => { prev.email = data.value; return prev; })`. Returning the same object makes React bail out of the re-render and the input appears frozen. Always return a new object (`{ ...prev, email: data.value }`).
- Trying to reset a controlled form with a native `type='reset'` button or `form.reset()`. The DOM clears, but React re-applies the state on the next render and the values snap back. Reset the state object (`setForm(initialState)`) instead, and reserve native reset for uncontrolled forms.
- Reading an uncontrolled value during render or in an effect that never re-runs. Nothing re-renders while the user types, so derived UI (character counters, enable/disable, previews) stays stale. Read uncontrolled values on submit/interaction, or lift just that one field into state.
- Assuming `Checkbox`'s payload is a boolean. `data.checked` can be `'mixed'`; normalize it with `data.checked === true` before storing it in a `boolean` state field, and remember `Slider`/`Input`/`Textarea` deliver `data.value` (a number for Slider) rather than the raw event target.

## Accessibility

Controlled vs uncontrolled changes who stores the value, not the rendered markup, so ARIA semantics are unchanged — but the behavior around it matters. (1) Always give fields an accessible name through Field (label plus hint/validationMessage) or an explicit label; a controlled input is no more accessible than an uncontrolled one, and a placeholder is never a label. Field also wires validationState/validationMessage into the control's accessible description, so screen reader users hear exactly the error text sighted users see. (2) Keep programmatic changes in the React/DOM render path: when you reset or load a value, re-render it (state or key) instead of assigning element.value directly, otherwise assistive technology may announce a stale value. (3) A key-based remount destroys the focused element, so focus falls back to the document. After a reset, move focus deliberately (to the form or the first field) and announce the reset with a MessageBar using the default politeness='polite'; reserve politeness='assertive' for urgent errors. (4) In hybrid panels, when a controlled Switch hides or disables other fields, keep focus on a control that still exists and communicate the mode change in text — pair Badge color with a text label rather than relying on color alone. (5) Keep submit controls as <Button type='submit'> inside a <form> so Enter submits and native FormData flows keep working; uncontrolled fields also participate in browser autofill, which many users depend on.

## Components used

- [Badge](../../components/badge.md)
- [Button](../../components/button.md)
- [Checkbox](../../components/checkbox.md)
- [Divider](../../components/divider.md)
- [Field](../../components/field.md)
- [Input](../../components/input.md)
- [MessageBar](../../components/message-bar.md)
- [Slider](../../components/slider.md)
- [Switch](../../components/switch.md)
- [Text](../../components/text.md)
- [Textarea](../../components/textarea.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
