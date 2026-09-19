# Accessibility Basics

> **Group**: accessibility

## Goal

Compose Fluent UI v9 components so every control in a view has an accessible name, an accurate state, a discoverable keyboard path, and announces dynamic results — using the accessibility the components already build in instead of hand-written ARIA.

## When to Use

Use this recipe whenever you are assembling any interactive surface (settings forms, action rows, async panels) and need to know which Fluent UI primitive carries which accessibility responsibility: Field for naming/validation, Tooltip's relationship prop for icon-only controls, MessageBar politeness for announcements, disabledFocusable for focus retention.

## When Not to Use

Do not use this as a replacement for a full design-system audit, nor when you need rich composite widgets whose internals are handled by their own sub-components (for example dialogs or menus with their own focus traps). If you are building a screen-reader-only live region rather than a visible status bar, reach for the `Aria` utility component instead of MessageBar. If your problem is visual density or theming rather than semantics, this recipe adds nothing.

Accessibility in Fluent UI v9 is mostly composition, not ARIA. The components already render the right roles, states and keyboard behavior; your job is to make sure every control ends up with a **name**, an accurate **state**, a sensible place in the **tab order**, and that dynamic results are **announced** rather than silently appearing.

This recipe builds a settings form, a row of actions, and an async publish panel, and shows which Fluent UI primitive carries the accessibility work in each.

## The four questions every widget must answer

| Question | Where the answer comes from |
| --- | --- |
| What is this? (name) | `Field`'s `label`, visible `Button` text, or `Tooltip relationship="label"` |
| What does it do? (role) | The component itself — `Input`, `Button`, `Checkbox`, `Switch`, `Spinner`, `Progress` and `MessageBar` render correct semantics. Do not rebuild them out of `<div>`s |
| What state is it in? | `Field validationState`, `checked`, `disabledFocusable`, `Progress value` |
| Anything else to know? (description) | `Field`'s `hint` and `validationMessage`, `Tooltip relationship="description"`, `MessageBar` |

## Step 1 — Label and validate through Field

`Field` owns the plumbing: it renders the label, associates it with the control it wraps, and keeps the `hint` and `validationMessage` text attached to that control instead of floating loose in the DOM. You never hand-write matching `id`/`htmlFor` pairs.

```tsx
<Field
  label="Email address"
  required
  hint="Used for sign-in and receipts only."
  validationState={emailError ? 'error' : 'none'}
  validationMessage={emailError}
>
  <Input type="email" value={email} onChange={(ev, data) => setEmail(data.value)} />
</Field>
```

Rules that keep this correct:

- Put the label text in `Field`'s `label` **only**. Do not also pass an `aria-label` to the control or repeat it in a sibling `<span>`.
- `validationState="error"` (or `"warning"`) without a `validationMessage` tells assistive technology the field is invalid but not why. Always supply the message.
- Write messages that say what to do (`Enter an address in the format name@example.com.`), not just that something failed.

## Step 2 — For Checkbox and Switch, the label belongs to the Field

`Checkbox` and `Switch` derive their accessible name from adjacent text. When you wrap them in `Field`, give `Field` the `label` and leave the control itself label-free so the name is announced exactly once.

```tsx
<Field label="Send me a weekly digest">
  <Checkbox checked={weeklyDigest} onChange={(ev, data) => setWeeklyDigest(data.checked)} />
</Field>

<Field label="Allow product announcements">
  <Switch checked={productNews} onChange={(ev, data) => setProductNews(data.checked)} />
</Field>
```

## Step 3 — Name icon-only buttons with `Tooltip relationship="label"`

`Tooltip`'s `relationship` prop is required, and it is the difference between a helpful tooltip and a broken control:

| `relationship` | Effect | Use when |
| --- | --- | --- |
| `"label"` | The tooltip text becomes the trigger's accessible name | The trigger has no visible text (icon-only `Button`) |
| `"description"` | The text is read as additional description after the name | The trigger already has a visible label |
| `"inaccessible"` | The content is hidden from assistive technology | The text would only repeat something already announced |

```tsx
<Tooltip content="Delete report" relationship="label">
  <Button appearance="subtle" shape="circular" icon={<TrashIcon />} />
</Tooltip>
```

The icon itself is decorative: render it with `aria-hidden="true"` (and `focusable="false"` on the SVG) so no unnamed graphic is announced next to the name you just gave the button.

## Step 4 — Announce results with `MessageBar` and `politeness`

Rendering a success or error message is not the same as announcing it. `MessageBar` accepts `politeness`, which controls how urgently the message interrupts the screen reader:

- `politeness="polite"` — waits for a pause in speech. Use it for confirmations such as `Your settings were saved.`
- `politeness="assertive"` — interrupts immediately. Reserve it for errors the user must act on.

```tsx
{status && (
  <MessageBar intent={status.intent} politeness={status.intent === 'error' ? 'assertive' : 'polite'}>
    {status.message}
  </MessageBar>
)}
```

Only render the bar when there is something to say: the announcement fires because the region's content changes, so start from `null` instead of rendering an empty bar on first paint. Pair the `intent` color with text (and the bar's icon) so the meaning never depends on color alone.

## Step 5 — Keep focus on the control the user just used

`disabled` removes a button from the tab order. If the button you just activated becomes `disabled` while a save is in flight, the browser drops focus to `<body>` and a screen-reader user loses their place. Use `disabledFocusable` instead: it looks and behaves disabled but stays focusable and keeps its place in the tab order.

```tsx
<Button appearance="primary" disabledFocusable={isSaving} onClick={save}>
  {isSaving ? 'Saving...' : 'Save changes'}
</Button>
```

Change the button's text while it is busy so the state is visible as well as announced, and put the reason for a permanently unavailable action in nearby text or a tooltip rather than only greying the button out.

## Step 6 — Give spinners and progress a name

`Spinner` takes its label through the `label` slot — use the wording the user would search for, and set `labelPosition` so the text stays visually attached to the spinner:

```tsx
<Spinner size="tiny" label="Publishing your site" labelPosition="after" />
```

`Progress` exposes a value, not a name. Pair it with visible `Text` (and a heading that describes the task) so the number has meaning:

```tsx
<h3 id="publish-heading">Publish site</h3>
<Progress value={percent} max={100} />
<Text block>{`${percent}% complete.`}</Text>
```

## Step 7 — Direction, theming, and hidden text

- Wrap the app in `Provider` with `dir="rtl"` when the document direction is right-to-left. Components flip their layout, icon placement and motion; you still own the reading order of your own text.
- For short text that must be available to assistive technology but not visible on screen, Fluent UI ships the `Aria` utility component (`import { Aria } from '@fluentui/react-components'`), which renders a visually hidden element you give the text to as `children`. Prefer a visible `MessageBar` whenever the user benefits from seeing the message too.
- Never remove focus outlines. The components draw a focus indicator from the theme; overriding it with `outline: none` breaks keyboard navigation.

## Verify before shipping

1. Tab through the view: every stop has a visible focus indicator and announces a name.
2. Trigger the validation path with a screen reader running and confirm the message is spoken together with the field.
3. Zoom the browser to 200% and confirm nothing is clipped or overlapped.
4. Turn on Windows High Contrast / forced colors: icons and status colors must still be distinguishable.
5. Confirm no state is carried by color alone — keep the words in `MessageBar` and `Badge`.

## Examples

### Accessible account settings form

A complete form where Field supplies every label, hint and validation message, Checkbox and Switch take their names from Field, and the submit result is announced through a MessageBar with the right politeness for success versus error.

```tsx
import * as React from 'react';
import {
  Button,
  Checkbox,
  Field,
  Input,
  MessageBar,
  Switch,
  Textarea,
} from '@fluentui/react-components';

type Status = { intent: 'success' | 'error'; message: string } | null;

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const AccountSettingsForm: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [weeklyDigest, setWeeklyDigest] = React.useState<boolean | 'mixed'>(false);
  const [productNews, setProductNews] = React.useState(false);
  const [emailError, setEmailError] = React.useState<string | undefined>(undefined);
  const [status, setStatus] = React.useState<Status>(null);

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!EMAIL_PATTERN.test(email)) {
      // The message is attached to the field by Field itself; we only supply the text.
      setEmailError('Enter an address in the format name@example.com.');
      setStatus({
        intent: 'error',
        message: 'Your settings were not saved. Fix the highlighted field and submit again.',
      });
      return;
    }

    setEmailError(undefined);
    setStatus({ intent: 'success', message: 'Your settings were saved.' });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field
        label="Email address"
        required
        hint="Used for sign-in and receipts only."
        validationState={emailError ? 'error' : 'none'}
        validationMessage={emailError}
      >
        <Input type="email" value={email} onChange={(ev, data) => setEmail(data.value)} />
      </Field>

      <Field label="Short bio" hint="Up to 200 characters.">
        <Textarea value={bio} resize="vertical" onChange={(ev, data) => setBio(data.value)} />
      </Field>

      {/* Checkbox and Switch get their accessible name from the Field label. */}
      <Field label="Send me a weekly digest">
        <Checkbox checked={weeklyDigest} onChange={(ev, data) => setWeeklyDigest(data.checked)} />
      </Field>

      <Field label="Allow product announcements">
        <Switch checked={productNews} onChange={(ev, data) => setProductNews(data.checked)} />
      </Field>

      <div>
        <Button type="submit" appearance="primary">
          Save changes
        </Button>
      </div>

      {/* Rendered conditionally so the live region actually changes when a result arrives. */}
      {status && (
        <MessageBar
          intent={status.intent}
          politeness={status.intent === 'error' ? 'assertive' : 'polite'}
        >
          {status.message}
        </MessageBar>
      )}
    </form>
  );
};
```

### Icon-only actions with Tooltip relationship and focus retention

Demonstrates the difference between Tooltip relationship="label" (icon-only button gets its name from the tooltip, with a decorative aria-hidden icon) and relationship="description" (a labelled button gets extra detail), plus disabledFocusable so focus is not lost while an action runs.

```tsx
import * as React from 'react';
import { Button, MessageBar, Tooltip } from '@fluentui/react-components';

// Decorative icon: hidden from assistive technology. The accessible name of the
// button comes from the Tooltip's relationship="label".
const TrashIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M7 2h6l1 2h3v2H3V4h3l1-2Zm-.9 6h7.8l-.9 9H7l-.9-9Z" />
  </svg>
);

export const ReportRowActions: React.FC = () => {
  const [busy, setBusy] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState<string | undefined>(undefined);

  const runAction = (message: string) => {
    setBusy(true);
    setAnnouncement(undefined);
    window.setTimeout(() => {
      setBusy(false);
      setAnnouncement(message);
    }, 600);
  };

  return (
    <div>
      {/* No visible text: the tooltip IS the accessible name. */}
      <Tooltip content="Delete report" relationship="label">
        <Button
          appearance="subtle"
          shape="circular"
          icon={<TrashIcon />}
          disabledFocusable={busy}
          onClick={() => runAction('Report deleted.')}
        />
      </Tooltip>

      {/* Visible label already names the button, so the tooltip only adds detail. */}
      <Tooltip
        content="Archived reports stay in All reports and can be restored later."
        relationship="description"
      >
        <Button
          appearance="secondary"
          disabledFocusable={busy}
          onClick={() => runAction('Report archived.')}
        >
          Archive
        </Button>
      </Tooltip>

      {announcement && (
        <MessageBar intent="success" politeness="polite">
          {announcement}
        </MessageBar>
      )}
    </div>
  );
};
```

### Async publish panel with named progress and a live result

Shows how to label a Spinner through its label slot, pair Progress with visible Text so the value has meaning, keep the primary button focusable while work is in flight with disabledFocusable, and announce the final result with MessageBar.

```tsx
import * as React from 'react';
import { Button, MessageBar, Progress, Spinner, Text } from '@fluentui/react-components';

type PublishState = 'idle' | 'publishing' | 'published';

export const PublishPanel: React.FC = () => {
  const [state, setState] = React.useState<PublishState>('idle');
  const [percent, setPercent] = React.useState(0);

  React.useEffect(() => {
    if (state !== 'publishing') {
      return;
    }

    let step = 0;
    const timer = window.setInterval(() => {
      step = Math.min(step + 1, 5);
      setPercent(step * 20);
      if (step === 5) {
        window.clearInterval(timer);
        setState('published');
      }
    }, 400);

    return () => window.clearInterval(timer);
  }, [state]);

  const startPublish = () => {
    setPercent(0);
    setState('publishing');
  };

  return (
    <section aria-labelledby="publish-heading">
      <h3 id="publish-heading">Publish site</h3>

      <Text block>Publishing makes your site visible to everyone at example.com.</Text>

      {/* disabledFocusable keeps the button in the tab order and focusable while the
          request is in flight, so keyboard users are not dropped onto the body. */}
      <Button
        appearance="primary"
        disabledFocusable={state === 'publishing'}
        onClick={startPublish}
      >
        {state === 'publishing' ? 'Publishing...' : 'Publish'}
      </Button>

      {state === 'publishing' && (
        <div>
          {/* Spinner is named through its label slot. */}
          <Spinner size="tiny" label="Publishing your site" labelPosition="after" />

          {/* Progress carries a value, not a name, so the text supplies the meaning. */}
          <Progress value={percent} max={100} />
          <Text block>{`${percent}% complete. We will announce when the site is live.`}</Text>
        </div>
      )}

      {state === 'published' && (
        <MessageBar intent="success" politeness="polite">
          Your site is live at example.com.
        </MessageBar>
      )}
    </section>
  );
};
```

## Pitfalls

- Duplicating the name: putting text in Field's `label` and also passing an aria-label or leaving the wording in a sibling span makes screen readers announce the control twice. Keep the text in exactly one place per control.
- Passing children to a Checkbox or Switch that is already wrapped in a Field with a label, which produces a doubled accessible name. Let Field own the label for those controls.
- Using `disabled` for a control the user just activated. The browser drops focus to the document body and screen-reader users lose their place. Use `disabledFocusable` while a request is in flight and change the button's text to show the busy state.
- Omitting `relationship` on Tooltip (it is a required prop) or using `relationship="description"` on an icon-only Button. The button then has no accessible name at all — use `relationship="label"` for icon-only triggers.
- Announcing routine confirmations with `politeness="assertive"`, which interrupts whatever the screen reader is currently saying. Reserve assertive for errors; use the polite value for happy-path messages.
- Setting `validationState="error"` without a `validationMessage`. Assistive technology learns the field is invalid but never learns why or how to fix it.
- Rendering the status MessageBar on first paint instead of conditionally. An always-present live region does not announce anything when the text arrives later via a layout change; mount it when the message exists.
- Conveying state with color only — for example dropping the text from a MessageBar or Badge and relying on the intent color. Keep the words and the icon, and verify in forced-colors mode.
- Removing focus outlines in application CSS (`outline: none`). The theme's focus indicator is the only keyboard affordance; overriding it makes keyboard navigation unusable.
- Expecting a Progress bar to name itself. Progress exposes a value only — always pair it with visible text (and a heading) so the number has context.

## Accessibility

Field is the single source of truth for a control's name and description: it renders the label, associates it with the wrapped control, and keeps hint and validation message text attached to that control, so you should never add a second name (aria-label or duplicate visible text). Tooltip's required relationship prop defines semantics — use "label" only when the tooltip is the control's sole name (icon-only Button) and "description" when a visible label already names it; hide decorative icons with aria-hidden="true" and focusable="false". MessageBar's politeness maps directly to live-region urgency: polite for confirmations, assertive only for errors the user must act on, and the bar should be conditionally rendered so its content change is what triggers the announcement. disabledFocusable keeps a temporarily unavailable control in the tab order so focus is never dropped to the body while work is in flight, and the button's busy text makes that state visible as well as exposed. Spinner is named through its label slot and its labelPosition ties the text to the spinner; Progress exposes only a value, so a visible Text line and a describing heading give the number meaning. Never convey status through color alone (keep MessageBar/Badge text), never remove focus outlines, and verify by tabbing through the whole view, running a screen reader over the validation and success paths, zooming to 200%, and checking forced-colors mode.

## Components used

- [Button](../../components/button.md)
- [Checkbox](../../components/checkbox.md)
- [Field](../../components/field.md)
- [Input](../../components/input.md)
- [MessageBar](../../components/message-bar.md)
- [Progress](../../components/progress.md)
- [Spinner](../../components/spinner.md)
- [Switch](../../components/switch.md)
- [Text](../../components/text.md)
- [Textarea](../../components/textarea.md)
- [Tooltip](../../components/tooltip.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
