# Settings Form

> **Group**: forms

## Goal

Build a complete, accessible settings/preferences form: a typed draft state object, Field-wrapped controls with hints and validation, grouped sections, dirty-state aware Save/Reset actions, success feedback via MessageBar, and an unsaved-changes guard implemented with Dialog (plus an optional Accordion layout for long preference lists).

## When to Use

Use this recipe when users edit several related values and commit them together with an explicit Save step: application preferences, account/profile settings, workspace or tenant configuration, notification preferences, editor/appearance settings, or an admin panel section. It is also the right choice when the form must protect users from losing unsaved edits (navigation away, cancel, close) and when you need grouped, labelled, validated Fluent UI v9 controls without a heavyweight form library.

## When Not to Use

Do not use this plumbing for single-value, instant-apply controls (a lone Switch or Input inside a Popover or Menu that saves immediately) - there is no draft state, no dirty tracking, and no Save button needed. Do not hand-roll validation and change tracking for very large, schema-driven, or dynamically generated forms; instead pair the same Field-based controls with a dedicated form library and use Field's render-prop children to bind control props. If the settings are collected as part of a multi-step onboarding flow, use a stepped layout (TabList of steps or a Dialog/Drawer wizard) instead of one long scrolling form. If the user edits one record among many in a table, prefer an inline editing surface or a Drawer/Dialog editor over a full-page settings form.

## Outcome

A settings surface that users can edit incrementally and commit with confidence:

- one typed state object for all settings, plus a `savedValues` snapshot used for dirty tracking and reset,
- every control wrapped in `Field` so label, hint, and validation message are programmatically associated,
- topic groups using `fieldset`/`legend` (with `Text` for typography) or `Accordion` when the list is long,
- a Save/Reset action row that stays disabled until something actually changed,
- success feedback via `MessageBar intent="success"`, rendered only after a successful save,
- a controlled `Dialog` that guards unsaved edits before they are thrown away.

## Anatomy

1. **State model** - a single `interface` that describes every setting, plus a `savedValues` copy.
2. **Sections** - a `fieldset` with a `legend` per topic (Profile, Language and region, Appearance and behavior). The `legend` gives screen readers a group name; `Text` supplies the visual typography.
3. **Controls** - each control is wrapped in `Field`. `Field` renders a `Label`, computes a stable `id`, and clones its single child control to add that `id`, the `aria-describedby` for hint/validation text, and `aria-invalid` when `validationState` is `error` or `warning`.
4. **Actions** - a primary `Button` with `type="submit"` that triggers the `<form onSubmit>`, and a secondary `Button` with `type="button"` that restores `savedValues`.
5. **Feedback** - `MessageBar` + `MessageBarBody` + `MessageBarTitle`, only mounted after a successful save.
6. **Guard** - a controlled `Dialog` (`open` + `onOpenChange`) with `DialogSurface` / `DialogBody` / `DialogTitle` / `DialogContent` / `DialogActions`.

## Step 1 - Model the settings as one typed object

Define the shape once and export the defaults so tests, stories, and reset logic share the same source of truth. Union-typed fields (`'daily' | 'weekly' | 'never'`) keep the form honest about what the rest of the app will receive.

```ts
export interface SettingsValues {
  displayName: string;
  email: string;
  emailDigest: 'daily' | 'weekly' | 'never';
  editorFontSize: number;
}

export const DEFAULT_SETTINGS: SettingsValues = { /* ... */ };
```

Keep a second piece of state, `savedValues`, that only changes on submit. Every write goes through one `update(patch: Partial<SettingsValues>)` helper, which makes it impossible for a field to be forgotten in the dirty check.

## Step 2 - Wrap every control in Field

`Field` is the single mechanism that answers "what is this control, why is it here, and what is wrong with it":

- `label` (required for association) - pass a string or a slot object,
- `required` - renders the required indicator and forwards `required` to the control,
- `hint` - helper text a user reads *before* an error occurs (character counters, units, examples),
- `validationState="error" | "warning" | "success" | "none"` and `validationMessage` - the inline message,
- `orientation="vertical" | "horizontal"` and `size` - layout and density.

Use `Field` for label-less controls: `Input`, `Textarea`, `Select`, `SpinButton`, `Slider`, and `RadioGroup`. For controls that render their own label (`Checkbox`, `Switch`, and individual `Radio`s), use the control's own `label` prop unless the group needs a name - a group of radios is labelled with `Field`, each `Radio` keeps its own label.

Show validation only when the user can act on it. A common rule: compute the error, but keep the control in `validationState="none"` until the field is dirty or the form has been submitted once. Never hide an error in a tooltip - it must be visible text.

## Step 3 - Group related controls

Two grouping mechanisms cover almost every settings page:

- **Always-visible groups** - `fieldset` + `legend` (the `Section` helper in Example 1) separated by `Divider`. Everything is scannable and Cmd/Ctrl+F-able.
- **Collapsible groups** - `Accordion` with `multiple collapsible` so several panels can be open at once (Example 3). Use `defaultOpenItems` for uncontrolled state, or `openItems` + `onToggle` to persist which sections are open.

Sections should be ordered by how often they change: identity and profile first, then behavior, then advanced/rare settings last.

## Step 4 - Track dirty state and validate

Derive `isDirty` from the field-by-field comparison of `values` against `savedValues` rather than a boolean you toggle in every handler; a toggle is guaranteed to drift once you add a field. Use the same derived value for three things: enabling Save, showing the "You have unsaved changes" status text, and deciding whether cancel/close needs a confirmation.

Validation follows the same shape - derive the message from `values`, don't store it:

```tsx
const emailError =
  values.email.trim().length > 0 && !EMAIL_PATTERN.test(values.email.trim())
    ? 'Enter an email address in the format name@example.com.'
    : undefined;
```

Guard the submit handler with the same condition and disable the primary button when the form is invalid or unchanged, so an invalid value can never reach your persistence layer.

## Step 5 - Save, reset, and confirm

On submit: `event.preventDefault()`, bail out if there is a blocking validation error, copy `values` into `savedValues`, then surface the success `MessageBar`. On reset: copy `savedValues` back into `values` and clear the message. Because both directions go through the same state, Reset is a true "undo all edits" and dirty state returns to false automatically.

Mount the success `MessageBar` conditionally (`showSavedMessage && ...`) and clear that flag on the next edit. Rendering it permanently or on every keystroke causes repeated, noisy live-region announcements.

## Step 6 - Guard unsaved changes with Dialog

Wrap the form in a fragment and render a controlled `Dialog` next to it:

- keep `open` in state (`discardDialogOpen`),
- always pass `onOpenChange={(event, data) => setDiscardDialogOpen(data.open)}` so Escape, backdrop clicks, and the built-in close affordance keep working,
- put a `DialogTrigger` with `action="close"` and `disableButtonEnhancement` around the "Keep editing" button,
- the destructive "Discard changes" button calls a handler that restores `savedValues` and closes the dialog.

Reuse the dialog for any exit path (Cancel, route change, dirty close) by opening it instead of navigating away. `Dialog` also supports `modalType="alert"` when a decision must be acknowledged before anything else can happen.

## Step 7 - Optional: collapsible sections with Accordion

For preference dialogs and pages with many rarely changed settings, swap the `fieldset` sections for `Accordion`:

```tsx
<Accordion multiple collapsible defaultOpenItems={['profile']}>
  <AccordionItem value="profile">
    <AccordionHeader>Profile</AccordionHeader>
    <AccordionPanel>{/* Fields live here */}</AccordionPanel>
  </AccordionItem>
</Accordion>
```

`AccordionItem` requires a unique `value`; `AccordionPanel` must be a direct child of its `AccordionItem`. Use `AccordionHeader size` to match the density of the surrounding page, and keep the panels that contain validation errors open if you validate on submit.

## Choosing the right control

| Setting shape | Component | Notes |
| --- | --- | --- |
| Short free text, email, URL | `Input` | Set `type` to enable mobile keyboards and autofill |
| Long free text | `Textarea` | `resize="vertical"` keeps the layout stable |
| One of many (5+) options | `Select` | Native `<option>` children keep it lightweight |
| One of a few (2-5) options | `RadioGroup` + `Radio` | All options stay visible; wrap in `Field` for the group name |
| Boolean, applies immediately | `Checkbox` / `Switch` | Both render their own `label`; `Switch` reads as on/off state, `Checkbox` as an opt-in |
| Bounded number | `Slider` (exploration) or `SpinButton` (precise entry) | Show units in the `Field` hint |

## Accessibility checklist

- Every control has a visible label: `Field label` for label-less controls, `label` prop for `Checkbox`/`Switch`/`Radio`.
- Related controls sit in a named group (`fieldset`/`legend`) or an `AccordionHeader`, never as an unlabelled visual block.
- Hints and errors are text, adjacent to the control, and referenced by `Field` - never tooltip-only, never color-only.
- The primary action is a real submit button (`type="submit"` inside a `<form>`), so Enter in any text field saves.
- Disabled Save always has a visible explanation nearby (validation message or the "No unsaved changes" status).
- Success/error banners are `MessageBar` (polite by default); reserve `politeness="assertive"` for failures that block the user.
- The discard dialog is modal, labelled by `DialogTitle`, closable with Escape, and focus returns to the trigger on close.
- Tab order follows visual order top-to-bottom; do not reorder with CSS `order` in a form.

## Examples

### Full settings form with sections, validation and dirty tracking

A typed settings object, three grouped sections (Profile, Language and region, Appearance and behavior), Field-wrapped Input/Textarea/Select/RadioGroup/Slider/SpinButton, a Checkbox with its own label, email validation, reset, an enabled-only-when-dirty Save button, and a success MessageBar that appears only after a real save.

```tsx
import * as React from 'react';
import {
  Button,
  Checkbox,
  Divider,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Radio,
  RadioGroup,
  Select,
  Slider,
  SpinButton,
  Text,
  Textarea,
} from '@fluentui/react-components';

export interface SettingsValues {
  displayName: string;
  email: string;
  bio: string;
  language: string;
  timeZone: string;
  emailDigest: 'daily' | 'weekly' | 'never';
  editorFontSize: number;
  autosaveInterval: number;
  reduceMotion: boolean;
}

export const DEFAULT_SETTINGS: SettingsValues = {
  displayName: 'Ada Lovelace',
  email: 'ada@example.com',
  bio: '',
  language: 'en-US',
  timeZone: 'utc',
  emailDigest: 'weekly',
  editorFontSize: 14,
  autosaveInterval: 5,
  reduceMotion: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Section: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({
  title,
  description,
  children,
}) => (
  <fieldset
    style={{
      border: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}
  >
    <legend style={{ padding: 0 }}>
      <Text size={500} weight="semibold">
        {title}
      </Text>
    </legend>
    {description ? (
      <Text size={200} block>
        {description}
      </Text>
    ) : null}
    {children}
  </fieldset>
);

export interface SettingsFormProps {
  initialValues?: SettingsValues;
  onSave?: (values: SettingsValues) => void;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialValues = DEFAULT_SETTINGS, onSave }) => {
  const [values, setValues] = React.useState<SettingsValues>(initialValues);
  const [savedValues, setSavedValues] = React.useState<SettingsValues>(initialValues);
  const [showSavedMessage, setShowSavedMessage] = React.useState(false);

  const update = (patch: Partial<SettingsValues>) => {
    setValues(prev => ({ ...prev, ...patch }));
    setShowSavedMessage(false);
  };

  const isDirty = React.useMemo(
    () => (Object.keys(values) as (keyof SettingsValues)[]).some(key => values[key] !== savedValues[key]),
    [values, savedValues],
  );

  const emailError =
    values.email.trim().length > 0 && !EMAIL_PATTERN.test(values.email.trim())
      ? 'Enter an email address in the format name@example.com.'
      : undefined;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (emailError) {
      return;
    }
    setSavedValues(values);
    setShowSavedMessage(true);
    onSave?.(values);
  };

  const handleReset = () => {
    setValues(savedValues);
    setShowSavedMessage(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '640px' }}
    >
      {showSavedMessage ? (
        <MessageBar intent="success">
          <MessageBarBody>
            <MessageBarTitle>Settings saved</MessageBarTitle>
            Your preferences have been updated.
          </MessageBarBody>
        </MessageBar>
      ) : null}

      <Section title="Profile" description="How you appear to other people in this workspace.">
        <Field label="Display name" required hint="Shown on your profile and in comments.">
          <Input value={values.displayName} onChange={(ev, data) => update({ displayName: data.value })} />
        </Field>

        <Field
          label="Email address"
          required
          validationState={emailError ? 'error' : 'none'}
          validationMessage={emailError}
        >
          <Input type="email" value={values.email} onChange={(ev, data) => update({ email: data.value })} />
        </Field>

        <Field label="Bio" hint={`${values.bio.length} characters used`}>
          <Textarea value={values.bio} resize="vertical" onChange={(ev, data) => update({ bio: data.value })} />
        </Field>
      </Section>

      <Divider />

      <Section title="Language and region">
        <Field label="Interface language">
          <Select value={values.language} onChange={(ev, data) => update({ language: data.value })}>
            <option value="en-US">English (United States)</option>
            <option value="en-GB">English (United Kingdom)</option>
            <option value="fr-FR">French (France)</option>
            <option value="ja-JP">Japanese (Japan)</option>
          </Select>
        </Field>

        <Field label="Time zone">
          <Select value={values.timeZone} onChange={(ev, data) => update({ timeZone: data.value })}>
            <option value="utc">UTC</option>
            <option value="america-los_angeles">Pacific Time (UTC-08:00)</option>
            <option value="europe-berlin">Central European Time (UTC+01:00)</option>
            <option value="asia-tokyo">Japan Standard Time (UTC+09:00)</option>
          </Select>
        </Field>

        <Field label="Email digest">
          <RadioGroup
            value={values.emailDigest}
            layout="horizontal"
            onChange={(ev, data) => update({ emailDigest: data.value as SettingsValues['emailDigest'] })}
          >
            <Radio value="daily" label="Daily" />
            <Radio value="weekly" label="Weekly" />
            <Radio value="never" label="Never" />
          </RadioGroup>
        </Field>
      </Section>

      <Divider />

      <Section title="Appearance and behavior">
        <Field label="Editor font size" hint={`${values.editorFontSize} pixels`}>
          <Slider
            min={10}
            max={24}
            step={1}
            value={values.editorFontSize}
            onChange={(ev, data) => update({ editorFontSize: data.value })}
          />
        </Field>

        <Field label="Autosave interval in minutes" hint="Use 0 to turn autosave off.">
          <SpinButton
            min={0}
            max={60}
            step={1}
            value={values.autosaveInterval}
            onChange={(ev, data) => update({ autosaveInterval: data.value ?? 0 })}
          />
        </Field>

        <Checkbox
          label="Reduce motion"
          checked={values.reduceMotion}
          onChange={(ev, data) => update({ reduceMotion: data.checked === true })}
        />
      </Section>

      <Divider />

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Button appearance="primary" type="submit" disabled={!isDirty || Boolean(emailError)}>
          Save changes
        </Button>
        <Button appearance="secondary" type="button" onClick={handleReset} disabled={!isDirty}>
          Reset
        </Button>
        <Text size={200}>{isDirty ? 'You have unsaved changes.' : 'No unsaved changes.'}</Text>
      </div>
    </form>
  );
};
```

### Settings form that guards unsaved changes with Dialog

A compact workspace settings form whose Cancel action opens a controlled Dialog when the draft differs from the saved snapshot. Demonstrates open/onOpenChange wiring, a DialogTrigger with action="close", focus-safe dialog structure (DialogSurface > DialogBody > DialogTitle/DialogContent/DialogActions) and a discarding handler that restores saved values.

```tsx
import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Select,
  Switch,
  Text,
} from '@fluentui/react-components';

export interface WorkspaceSettingsValues {
  workspaceName: string;
  visibility: 'private' | 'organization';
  usageData: boolean;
}

const INITIAL_VALUES: WorkspaceSettingsValues = {
  workspaceName: 'Contoso Design',
  visibility: 'private',
  usageData: true,
};

export const WorkspaceSettingsForm: React.FC = () => {
  const [values, setValues] = React.useState<WorkspaceSettingsValues>(INITIAL_VALUES);
  const [savedValues, setSavedValues] = React.useState<WorkspaceSettingsValues>(INITIAL_VALUES);
  const [discardDialogOpen, setDiscardDialogOpen] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  const isDirty =
    values.workspaceName !== savedValues.workspaceName ||
    values.visibility !== savedValues.visibility ||
    values.usageData !== savedValues.usageData;

  const nameError = values.workspaceName.trim().length === 0 ? 'A workspace name is required.' : undefined;

  const update = (patch: Partial<WorkspaceSettingsValues>) => {
    setValues(prev => ({ ...prev, ...patch }));
    setSavedAt(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (nameError) {
      return;
    }
    setSavedValues(values);
    setSavedAt(new Date().toLocaleTimeString());
  };

  const handleCancel = () => {
    if (isDirty) {
      setDiscardDialogOpen(true);
      return;
    }
    setValues(savedValues);
  };

  const handleDiscard = () => {
    setValues(savedValues);
    setSavedAt(null);
    setDiscardDialogOpen(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '560px' }}
      >
        {savedAt ? (
          <MessageBar intent="success">
            <MessageBarBody>
              <MessageBarTitle>Workspace updated</MessageBarTitle>
              Changes were applied at {savedAt}.
            </MessageBarBody>
          </MessageBar>
        ) : null}

        <Field
          label="Workspace name"
          required
          validationState={nameError ? 'error' : 'none'}
          validationMessage={nameError}
        >
          <Input value={values.workspaceName} onChange={(ev, data) => update({ workspaceName: data.value })} />
        </Field>

        <Field label="Visibility" hint="Private workspaces are visible only to invited members.">
          <Select
            value={values.visibility}
            onChange={(ev, data) =>
              update({ visibility: data.value as WorkspaceSettingsValues['visibility'] })
            }
          >
            <option value="private">Private - only invited members</option>
            <option value="organization">Organization - everyone in the tenant</option>
          </Select>
        </Field>

        <Switch
          label="Share anonymous usage data"
          checked={values.usageData}
          onChange={(ev, data) => update({ usageData: data.checked })}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button appearance="primary" type="submit" disabled={!isDirty || Boolean(nameError)}>
            Save changes
          </Button>
          <Button appearance="secondary" type="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Text size={200}>{isDirty ? 'Unsaved changes' : 'Up to date'}</Text>
        </div>
      </form>

      <Dialog open={discardDialogOpen} onOpenChange={(event, data) => setDiscardDialogOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Discard unsaved changes?</DialogTitle>
            <DialogContent>
              Your edits to this workspace have not been saved. If you leave now they will be lost.
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement action="close">
                <Button appearance="secondary">Keep editing</Button>
              </DialogTrigger>
              <Button appearance="primary" onClick={handleDiscard}>
                Discard changes
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
};
```

### Collapsible settings sections with Accordion

Preference-heavy settings rendered as an Accordion with multiple collapsible panels. Each AccordionItem has a unique value and contains one AccordionPanel; panels hold the same Field/Input/Checkbox/RadioGroup/Switch/Select controls used in the plain form, plus the save action in the last panel.

```tsx
import * as React from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Button,
  Checkbox,
  Field,
  Input,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Text,
} from '@fluentui/react-components';

interface NotificationSettings {
  productAnnouncements: boolean;
  commentMentions: boolean;
  channel: 'email' | 'in-app' | 'both';
  quietHours: boolean;
}

const panelContentStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  paddingBottom: '16px',
  maxWidth: '560px',
};

export const AccordionSettingsForm: React.FC = () => {
  const [displayName, setDisplayName] = React.useState('Ada Lovelace');
  const [email, setEmail] = React.useState('ada@example.com');
  const [timeZone, setTimeZone] = React.useState('utc');
  const [notifications, setNotifications] = React.useState<NotificationSettings>({
    productAnnouncements: true,
    commentMentions: true,
    channel: 'in-app',
    quietHours: false,
  });

  const updateNotifications = (patch: Partial<NotificationSettings>) =>
    setNotifications(prev => ({ ...prev, ...patch }));

  return (
    <Accordion multiple collapsible defaultOpenItems={['profile']} style={{ maxWidth: '640px' }}>
      <AccordionItem value="profile">
        <AccordionHeader>Profile</AccordionHeader>
        <AccordionPanel>
          <div style={panelContentStyles}>
            <Field label="Display name" required hint="Shown on your profile and in comments.">
              <Input value={displayName} onChange={(ev, data) => setDisplayName(data.value)} />
            </Field>
            <Field label="Email address">
              <Input type="email" value={email} onChange={(ev, data) => setEmail(data.value)} />
            </Field>
          </div>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="notifications">
        <AccordionHeader>Notifications</AccordionHeader>
        <AccordionPanel>
          <div style={panelContentStyles}>
            <Checkbox
              label="Product announcements"
              checked={notifications.productAnnouncements}
              onChange={(ev, data) => updateNotifications({ productAnnouncements: data.checked === true })}
            />
            <Checkbox
              label="Mentions and replies"
              checked={notifications.commentMentions}
              onChange={(ev, data) => updateNotifications({ commentMentions: data.checked === true })}
            />
            <Field label="Delivery channel">
              <RadioGroup
                value={notifications.channel}
                onChange={(ev, data) =>
                  updateNotifications({ channel: data.value as NotificationSettings['channel'] })
                }
              >
                <Radio value="email" label="Email only" />
                <Radio value="in-app" label="In-app only" />
                <Radio value="both" label="Email and in-app" />
              </RadioGroup>
            </Field>
            <Switch
              label="Enable quiet hours (22:00 to 07:00)"
              checked={notifications.quietHours}
              onChange={(ev, data) => updateNotifications({ quietHours: data.checked })}
            />
          </div>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="region">
        <AccordionHeader>Region</AccordionHeader>
        <AccordionPanel>
          <div style={panelContentStyles}>
            <Field label="Time zone" hint="Used for digests and quiet hours.">
              <Select value={timeZone} onChange={(ev, data) => setTimeZone(data.value)}>
                <option value="utc">UTC</option>
                <option value="america-los_angeles">Pacific Time (UTC-08:00)</option>
                <option value="europe-berlin">Central European Time (UTC+01:00)</option>
              </Select>
            </Field>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Button appearance="primary" type="button">
                Save preferences
              </Button>
              <Text size={200}>Section values are saved together.</Text>
            </div>
          </div>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
```

## Pitfalls

- Putting more than one control inside a single Field. Field clones one child to inject id/aria-describedby/aria-invalid, so extra children break the association - use a fieldset with a legend (or an AccordionHeader) for groups.
- Wrapping Checkbox, Switch or Radio in a Field that also has a label, producing duplicated or ambiguous accessible names. Use the control's own label prop for these, and reserve Field for label-less controls such as Input, Textarea, Select, SpinButton, Slider and RadioGroup.
- Storing validation messages in state instead of deriving them from the draft values, which lets the message drift out of sync with the input and can block submission of a valid form.
- Toggling a boolean isDirty flag inside each change handler. Always compare the draft object field by field against a savedValues snapshot so that adding a field cannot silently break dirty tracking, Reset, or the unsaved-changes guard.
- Mounting the success MessageBar permanently or on every keystroke, which re-announces the same message to screen readers repeatedly. Render it only after a successful save and clear it on the next edit.
- Controlling a Dialog with open but omitting onOpenChange, so Escape, backdrop clicks and the internal close affordance stop working. Always mirror the dialog state with onOpenChange={(event, data) => setOpen(data.open)}.
- Rendering an AccordionPanel outside its AccordionItem, or creating an AccordionItem without a unique value. AccordionItem.value is required and pairs the header with its panel; duplicates make panels open each other.
- Trusting the string value from RadioGroup or Select change data when the state field is a union type. Narrow or convert the value before storing it, otherwise an unexpected string can be saved into typed state and later fail at the API boundary.
- Disabling the Save button without saying why. Pair disabled actions with a visible reason: the Field validation message for invalid values, or a status Text such as 'No unsaved changes' when there is nothing to submit.
- Using placeholders as the only description of a control. Placeholders disappear on input and are not guaranteed to be announced; put the persistent guidance in the Field label and hint instead.

## Accessibility

Field is the accessibility backbone of this recipe: it renders a real Label, computes a stable id for its single child control, and forwards id, aria-describedby (hint plus validation message) and aria-invalid when validationState is 'error' or 'warning'. Because Field clones exactly one child, a Field must wrap one control only - wrap groups of controls in a fieldset with a legend (the Section helper) or in an AccordionHeader/AccordionPanel pair so the group has a programmatic name. Controls that render their own label (Checkbox, Switch, and each Radio) should use their own label prop; RadioGroup gets its group name from Field while individual Radios keep their labels. Keep validation messages as visible adjacent text (never tooltip-only) and only render them once the value is being edited or the form is submitted, so a pristine form does not announce errors. The success MessageBar is mounted only after a successful save and cleared on the next edit, avoiding repeated live-region announcements; MessageBar politeness defaults to polite, which is correct for success/warning, while blocking failures may use an assertive error intent. The Save/Reset buttons communicate state through the disabled attribute plus accompanying status text ('You have unsaved changes'), not color alone, and the primary action is a genuine type="submit" button inside a form so Enter in any text input saves. The discard confirmation is a modal Dialog: it traps focus, is labelled by DialogTitle, is dismissible with Escape or backdrop click through onOpenChange, and returns focus to the triggering button on close; the 'Keep editing' trigger uses action="close". Keep the DOM order equal to the visual order, ensure every interactive control has a visible focus indicator from the theme, and never rely on placeholders as labels.

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
- [Divider](../../components/divider.md)
- [Field](../../components/field.md)
- [Input](../../components/input.md)
- [MessageBar](../../components/message-bar.md)
- [MessageBarBody](../../components/message-bar-body.md)
- [MessageBarTitle](../../components/message-bar-title.md)
- [Radio](../../components/radio.md)
- [RadioGroup](../../components/radio-group.md)
- [Select](../../components/select.md)
- [Slider](../../components/slider.md)
- [SpinButton](../../components/spin-button.md)
- [Switch](../../components/switch.md)
- [Text](../../components/text.md)
- [Textarea](../../components/textarea.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
