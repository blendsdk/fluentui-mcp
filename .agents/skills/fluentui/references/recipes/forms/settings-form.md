# Settings Form

> **Group**: forms

## Goal

Build an accessible settings/preferences form that edits one typed settings object with Fluent UI v9 fields, tracks saved-vs-draft state, validates inline, persists through an injected save callback, and reports load/save status to assistive technology.

## When to Use

Use this recipe for account, workspace, profile, or notification settings panes: a bounded set of typed values that are loaded once, edited as a group, and saved wholesale to a backend. It fits both the explicit 'Save changes / Discard changes' pattern and the instant-apply preference pattern, and it scales from a handful of fields to several sections on one scrollable pane.

## When Not to Use

Do not use it for create flows or multi-step wizards where every field is new data and there is nothing to compare against. Do not use it for search or filter bars where values apply instantly and are never persisted, or for a single inline edit in a list (edit the row instead of opening a whole pane). If a setting is destructive and needs confirmation, add a confirmation dialog rather than relying on the form's save button alone.

A settings screen is a long, low-frequency, high-consequence form. Users expect their previous values to still be there, need to know whether a change was saved, and must be able to undo an accidental edit. This recipe composes Fluent UI React v9 primitives into exactly that shape:

- `Card`, `Text`, and `Divider` for the pane and its sections
- `Field` + `Input` / `Select` / `Textarea` for labeled values
- `Switch` and `Checkbox` for toggles, with their own labels
- `Button` and `Badge` for the action bar and the unsaved-changes signal
- `MessageBar` and `Spinner` for the save/load lifecycle

## 1. Model the screen as one typed object, in two copies

```ts
export type AccountSettings = {
  displayName: string;
  email: string;
  language: string;
  timeZone: string;
  bio: string;
  productUpdates: boolean;
  weeklyDigest: boolean;
};

const [saved, setSaved] = React.useState<AccountSettings>(initialSettings); // last persisted
const [draft, setDraft] = React.useState<AccountSettings>(initialSettings); // on screen
const isDirty = (Object.keys(draft) as Array<keyof AccountSettings>).some(
  (key) => draft[key] !== saved[key],
);
```

Two copies pay for themselves immediately: "Discard changes" is `setDraft(saved)`, "Save" can be disabled unless `isDirty`, and the submit handler only needs `draft`.

Always patch with a new object - never mutate:

```ts
const update = (patch: Partial<AccountSettings>) => setDraft((prev) => ({ ...prev, ...patch }));
```

## 2. Let Field own the label, hint, and error wiring

`Field` is the load-bearing component of this recipe. It associates a real label with its child control, routes `hint` and `validationMessage` through `aria-describedby`, adds `aria-invalid` when `validationState="error"`, and renders the required indicator:

```tsx
<Field
  label="Email"
  required
  hint="Used for account recovery."
  validationState={emailError ? 'error' : 'none'}
  validationMessage={emailError}
>
  <Input type="email" value={draft.email} onChange={(_, data) => update({ email: data.value })} />
</Field>
```

Use `Field` for controls that do **not** have a visible label of their own: `Input`, `Select`, `Textarea`. `Switch` and `Checkbox` render their label from their children, so give them descriptive child text instead of wrapping them in `Field` - a wrapped toggle ends up with two competing labels.

Set `orientation="horizontal"` on a `Field` when you want the label beside the control for compact panes, and `validationState="warning"` for non-blocking advice.

## 3. Derive validation, then gate when it is shown

Compute error strings from `draft` on every render; never store them in state:

```ts
const displayNameError =
  draft.displayName.trim() === '' ? 'Enter the name your teammates will see.' : undefined;
const emailError =
  draft.email.trim() === ''
    ? 'Enter the email address we should use for account recovery.'
    : draft.email.includes('@')
      ? undefined
      : 'Email addresses must contain an "@" character.';
```

Then hide messages until the user has acted on the field or tried to submit:

```ts
const [touched, setTouched] = React.useState<Partial<Record<keyof AccountSettings, boolean>>>({});
const [hasSubmitted, setHasSubmitted] = React.useState(false);

const visibleError = (key: 'displayName' | 'email') => {
  const message = key === 'displayName' ? displayNameError : emailError;
  return message && (touched[key] || hasSubmitted) ? message : undefined;
};
```

Have `update()` mark the keys in the patch as touched. On submit, set `hasSubmitted`, return early when an error blocks the save, and move focus to the first invalid control so the message is announced together with the field:

```tsx
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setHasSubmitted(true);
  if (displayNameError || emailError) {
    (displayNameError ? displayNameRef : emailRef).current?.focus();
    return;
  }
  // ...save
};
```

`Input` forwards its `ref` to the underlying `<input>` element, so `React.useRef<HTMLInputElement>(null)` is all the plumbing you need. Add `noValidate` to the `<form>` so the browser's own bubbles do not pre-empt Fluent's messages.

## 4. Shape the pane: Card, headings, Divider, a field grid

- One `Card appearance="filled-alternative"` per pane, with a max width from `style`.
- A single `<form>` inside it with `display: flex; flexDirection: column; gap: 16` - DOM order is tab order, so keep the markup order equal to the visual order.
- Each group is a `<section aria-labelledby="...">` whose heading is an `<h3 id="...">` wrapping `Text size={400} weight="semibold"`. Screen-reader users can then jump between groups.
- Separate groups with `<Divider />`.
- Lay fields out with CSS grid instead of per-field widths:

```ts
const gridStyle: React.CSSProperties = {
  display: 'grid',
  gap: 16,
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
};
```

Give multi-line or wide fields `style={{ gridColumn: '1 / -1' }}`. For 6-12 settings, keep everything on one scrollable page instead of hiding fields behind collapsible sections: the dirty state, the action bar, and the save error all stay in one place.

## 5. Make the save lifecycle explicit

```ts
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
```

- Disable the primary button while `!isDirty || isBusy` and swap its label to "Saving" - this is what prevents duplicate submits. Use `disabledFocusable` instead of `disabled` if you want the button to stay in the tab order.
- Put `aria-busy={isBusy}` on the `<form>` and, for longer writes, render a small `Spinner` in the action row.
- Announce outcomes by *mounting* a `MessageBar`: `intent="success" politeness="polite"` for saved, `intent="error" politeness="assertive"` for failed. Clear the message on the next edit.
- Assign `setSaved(draft)` only after the promise resolves; that flips `isDirty` back to false and enables "Discard changes".
- On failure, keep the draft untouched, tell the user nothing was lost, and leave the button enabled for a retry.

## 6. Instant-apply variant (no Save button)

Preference panes often apply each change immediately. Same structure, minus the dirty tracking:

```tsx
<Switch
  checked={settings.productUpdates}
  onChange={(_, data) => apply({ productUpdates: data.checked })}
>
  Product updates and announcements
</Switch>
```

Two rules keep instant-apply honest:

1. **Numeric inputs need their own text state.** `value={rowsText}` holds exactly what the user typed; parse it, validate it, and only commit to the settings object when the parse is in range. Never store `NaN`, and never reformat the text while the user is typing.
2. **Roll back on failure.** Apply optimistically, and if the write rejects, restore the previous value and surface a `MessageBar`; otherwise the UI lies about what the server stored.

Add a `Restore defaults` button (`appearance="secondary"`, `disabled` when nothing changed) so an exploratory click is cheap to undo.

## 7. Load existing values before rendering controls

```ts
type PanelState = 'loading' | 'ready' | 'error';
```

- `loading` -> `<Spinner label="Loading workspace settings" />` inside the `Card`.
- `error` -> an error `MessageBar` plus a `Button` that retries the load.
- `ready` -> render the form with the real server values.

Do not render the form with placeholder defaults and swap them later: the dirty check compares against the placeholder, and a fast click on Save can overwrite server state. Memoize the loader with `React.useCallback` and depend on it from `useEffect` - an inline arrow prop re-runs the effect on every render and refetches forever.

## 8. Review checklist

- Enter submits from any field (a real `<form onSubmit>` plus `type="submit"` on the primary button).
- Tab order matches the visual order; no positive `tabIndex`.
- Every control has exactly one label: `Field` for `Input` / `Select` / `Textarea`, children for `Switch` / `Checkbox`.
- Inline error text is spoken when its field is focused (`aria-describedby` from `Field`).
- Save and Discard are disabled when nothing changed and while a save is in flight.
- Success and failure are announced, and the draft survives a failure.

## Examples

### AccountSettingsForm

A complete account settings pane: typed draft/saved state, dirty tracking, inline validation with focus management on failed submit, Switch toggles with their own labels, a save lifecycle with Badge, MessageBar, and Save/Discard actions.

```tsx
import * as React from 'react';
import { Badge, Button, Card, Divider, Field, Input, MessageBar, Select, Switch, Text, Textarea } from '@fluentui/react-components';

export type AccountSettings = {
  displayName: string;
  email: string;
  language: string;
  timeZone: string;
  bio: string;
  productUpdates: boolean;
  weeklyDigest: boolean;
};

export const DEFAULT_ACCOUNT_SETTINGS: AccountSettings = {
  displayName: '',
  email: '',
  language: 'en-US',
  timeZone: 'utc',
  bio: '',
  productUpdates: true,
  weeklyDigest: false,
};

export type AccountSettingsFormProps = {
  /** The settings currently persisted on the server. */
  initialSettings?: AccountSettings;
  /** Persist the draft. Reject the promise to surface an inline error. */
  onSave?: (settings: AccountSettings) => Promise<void>;
};

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type SettingsKey = keyof AccountSettings;

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  minWidth: 320,
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gap: 16,
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
};

const togglesStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 };

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
};

const headingStyle: React.CSSProperties = { margin: 0 };

export const AccountSettingsForm: React.FC<AccountSettingsFormProps> = ({
  initialSettings = DEFAULT_ACCOUNT_SETTINGS,
  onSave,
}) => {
  const [saved, setSaved] = React.useState<AccountSettings>(initialSettings);
  const [draft, setDraft] = React.useState<AccountSettings>(initialSettings);
  const [touched, setTouched] = React.useState<Partial<Record<SettingsKey, boolean>>>({});
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [status, setStatus] = React.useState<SaveStatus>('idle');

  const displayNameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);

  const update = (patch: Partial<AccountSettings>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
    setTouched((prev) => {
      const next = { ...prev };
      (Object.keys(patch) as SettingsKey[]).forEach((key) => {
        next[key] = true;
      });
      return next;
    });
    setStatus('idle');
  };

  const isDirty = (Object.keys(draft) as SettingsKey[]).some((key) => draft[key] !== saved[key]);

  const displayNameError =
    draft.displayName.trim() === '' ? 'Enter the name your teammates will see.' : undefined;
  const emailError =
    draft.email.trim() === ''
      ? 'Enter the email address we should use for account recovery.'
      : draft.email.includes('@')
        ? undefined
        : 'Email addresses must contain an "@" character.';

  const visibleError = (key: 'displayName' | 'email'): string | undefined => {
    const message = key === 'displayName' ? displayNameError : emailError;
    return message && (touched[key] || hasSubmitted) ? message : undefined;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    if (displayNameError || emailError) {
      if (displayNameError) {
        displayNameRef.current?.focus();
      } else {
        emailRef.current?.focus();
      }
      return;
    }

    setStatus('saving');
    try {
      await onSave?.(draft);
      setSaved(draft);
      setTouched({});
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  };

  const handleDiscard = () => {
    setDraft(saved);
    setTouched({});
    setStatus('idle');
  };

  const isBusy = status === 'saving';

  return (
    <Card appearance="filled-alternative" style={{ maxWidth: 720 }}>
      <form
        noValidate
        aria-label="Account settings"
        aria-busy={isBusy}
        onSubmit={handleSubmit}
        style={formStyle}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Text size={500} weight="semibold" block>
            Account settings
          </Text>
          <Text size={200} block>
            Changes are saved to your Contoso account and apply the next time you sign in.
          </Text>
        </div>

        {status === 'saved' && (
          <MessageBar intent="success" politeness="polite">
            Your settings were saved.
          </MessageBar>
        )}
        {status === 'error' && (
          <MessageBar intent="error" politeness="assertive">
            We could not save your settings. Nothing was lost - please try again.
          </MessageBar>
        )}

        <Divider />

        <section
          aria-labelledby="account-profile-heading"
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <h3 id="account-profile-heading" style={headingStyle}>
            <Text size={400} weight="semibold">
              Profile
            </Text>
          </h3>

          <div style={gridStyle}>
            <Field
              label="Display name"
              required
              validationState={visibleError('displayName') ? 'error' : 'none'}
              validationMessage={visibleError('displayName')}
            >
              <Input
                ref={displayNameRef}
                value={draft.displayName}
                onChange={(_, data) => update({ displayName: data.value })}
              />
            </Field>

            <Field
              label="Email"
              required
              validationState={visibleError('email') ? 'error' : 'none'}
              validationMessage={visibleError('email')}
            >
              <Input
                ref={emailRef}
                type="email"
                value={draft.email}
                onChange={(_, data) => update({ email: data.value })}
              />
            </Field>

            <Field label="Language">
              <Select value={draft.language} onChange={(_, data) => update({ language: data.value })}>
                <option value="en-US">English (United States)</option>
                <option value="en-GB">English (United Kingdom)</option>
                <option value="de-DE">Deutsch</option>
                <option value="ja-JP">Japanese</option>
              </Select>
            </Field>

            <Field label="Time zone">
              <Select value={draft.timeZone} onChange={(_, data) => update({ timeZone: data.value })}>
                <option value="utc">UTC</option>
                <option value="utc-8">UTC-08:00 (Pacific)</option>
                <option value="utc+1">UTC+01:00 (Central European)</option>
                <option value="utc+9">UTC+09:00 (Japan)</option>
              </Select>
            </Field>

            <Field label="Bio" hint="Shown on your profile card." style={{ gridColumn: '1 / -1' }}>
              <Textarea
                resize="vertical"
                value={draft.bio}
                onChange={(_, data) => update({ bio: data.value.slice(0, 280) })}
              />
            </Field>
          </div>
        </section>

        <Divider />

        <section
          aria-labelledby="account-notifications-heading"
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <h3 id="account-notifications-heading" style={headingStyle}>
            <Text size={400} weight="semibold">
              Notifications
            </Text>
          </h3>

          <div style={togglesStyle}>
            <Switch
              checked={draft.productUpdates}
              onChange={(_, data) => update({ productUpdates: data.checked })}
            >
              Product updates and announcements
            </Switch>
            <Switch
              checked={draft.weeklyDigest}
              onChange={(_, data) => update({ weeklyDigest: data.checked })}
            >
              Weekly activity digest
            </Switch>
          </div>
        </section>

        <Divider />

        <div style={actionsStyle}>
          <Button type="submit" appearance="primary" disabled={!isDirty || isBusy}>
            {isBusy ? 'Saving' : 'Save changes'}
          </Button>
          <Button
            type="button"
            appearance="secondary"
            disabled={!isDirty || isBusy}
            onClick={handleDiscard}
          >
            Discard changes
          </Button>
          {isDirty && !isBusy && (
            <Badge appearance="tint" color="warning">
              Unsaved changes
            </Badge>
          )}
        </div>
      </form>
    </Card>
  );
};
```

### ProfileSettingsForm

The instant-apply variant: no Save button, changes apply on every interaction, a live Persona preview, a numeric input that keeps its raw text state and only commits valid parses, an inline validation error, and a Restore defaults button.

```tsx
import * as React from 'react';
import { Badge, Button, Card, Checkbox, Divider, Field, Input, Persona, Select, Text } from '@fluentui/react-components';

export type ProfileSettings = {
  displayName: string;
  jobTitle: string;
  theme: 'light' | 'dark' | 'system';
  density: 'comfortable' | 'compact' | 'spacious';
  rowsPerPage: number;
  showEmail: boolean;
};

export const DEFAULT_PROFILE_SETTINGS: ProfileSettings = {
  displayName: 'Aisha Rahman',
  jobTitle: 'Product designer',
  theme: 'system',
  density: 'comfortable',
  rowsPerPage: 20,
  showEmail: true,
};

const ROWS_MIN = 5;
const ROWS_MAX = 50;

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  minWidth: 320,
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gap: 16,
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
};

const previewStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' };

/**
 * Instant-apply settings: every change is written as soon as it happens, so there is
 * no draft/saved pair and no Save button. Pass a persisting callback here in real apps.
 */
export const ProfileSettingsForm: React.FC = () => {
  const [settings, setSettings] = React.useState<ProfileSettings>(DEFAULT_PROFILE_SETTINGS);
  // The number input is a free-form string while the user types, so its text lives
  // outside the settings object and is committed only when it parses in range.
  const [rowsText, setRowsText] = React.useState<string>(String(DEFAULT_PROFILE_SETTINGS.rowsPerPage));

  const apply = (patch: Partial<ProfileSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  const displayNameError =
    settings.displayName.trim() === '' ? 'Display name is required.' : undefined;

  const parsedRows = Number.parseInt(rowsText, 10);
  const rowsError = Number.isNaN(parsedRows)
    ? 'Enter a number of rows.'
    : parsedRows < ROWS_MIN || parsedRows > ROWS_MAX
      ? `Choose between ${ROWS_MIN} and ${ROWS_MAX} rows.`
      : undefined;

  const isDefault = (Object.keys(settings) as Array<keyof ProfileSettings>).every(
    (key) => settings[key] === DEFAULT_PROFILE_SETTINGS[key],
  );

  const restoreDefaults = () => {
    setSettings(DEFAULT_PROFILE_SETTINGS);
    setRowsText(String(DEFAULT_PROFILE_SETTINGS.rowsPerPage));
  };

  return (
    <Card
      appearance="filled-alternative"
      style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Text size={500} weight="semibold" block>
          Profile and appearance
        </Text>
        <Text size={200} block>
          Every change is applied immediately - this pane has no save button.
        </Text>
      </div>

      <Card appearance="outline" style={previewStyle}>
        <Persona
          name={settings.displayName || 'Your name'}
          secondaryText={settings.jobTitle || 'Job title'}
          size="large"
        />
        <Badge appearance="tint" color="informative">
          {settings.theme}
        </Badge>
        <Text size={200}>{`${settings.rowsPerPage} rows per page`}</Text>
      </Card>

      <Divider />

      <div style={gridStyle}>
        <Field
          label="Display name"
          required
          validationState={displayNameError ? 'error' : 'none'}
          validationMessage={displayNameError}
        >
          <Input
            value={settings.displayName}
            onChange={(_, data) => apply({ displayName: data.value })}
          />
        </Field>

        <Field label="Job title">
          <Input value={settings.jobTitle} onChange={(_, data) => apply({ jobTitle: data.value })} />
        </Field>

        <Field label="Theme">
          <Select
            value={settings.theme}
            onChange={(_, data) => apply({ theme: data.value as ProfileSettings['theme'] })}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">Match system</option>
          </Select>
        </Field>

        <Field label="Density">
          <Select
            value={settings.density}
            onChange={(_, data) => apply({ density: data.value as ProfileSettings['density'] })}
          >
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
            <option value="spacious">Spacious</option>
          </Select>
        </Field>

        <Field
          label="Rows per page"
          validationState={rowsError ? 'error' : 'none'}
          validationMessage={rowsError}
          hint={rowsError ? undefined : `Between ${ROWS_MIN} and ${ROWS_MAX}.`}
        >
          <Input
            type="number"
            value={rowsText}
            onChange={(_, data) => {
              setRowsText(data.value);
              const next = Number.parseInt(data.value, 10);
              if (!Number.isNaN(next) && next >= ROWS_MIN && next <= ROWS_MAX) {
                apply({ rowsPerPage: next });
              }
            }}
          />
        </Field>
      </div>

      <Checkbox
        checked={settings.showEmail}
        onChange={(_, data) => apply({ showEmail: data.checked === true })}
      >
        Show my email address on my profile
      </Checkbox>

      <Divider />

      <div style={{ display: 'flex', gap: 8 }}>
        <Button appearance="secondary" disabled={isDefault} onClick={restoreDefaults}>
          Restore defaults
        </Button>
      </div>
    </Card>
  );
};
```

### WorkspaceSettingsPanel

A load/save lifecycle wrapper: Spinner while fetching, an error MessageBar with a retry Button on load failure, then the form with a memoized loader effect, disabled Save/Discard during writes, aria-busy on the form, and success/failure MessageBars.

```tsx
import * as React from 'react';
import { Button, Card, Checkbox, Divider, Field, Input, MessageBar, Select, Spinner, Text } from '@fluentui/react-components';

export type WorkspaceSettings = {
  workspaceName: string;
  defaultVisibility: 'private' | 'team' | 'public';
  allowGuestInvites: boolean;
};

export type WorkspaceSettingsPanelProps = {
  /** Memoize this callback (React.useCallback) - a new identity re-runs the load effect. */
  load: () => Promise<WorkspaceSettings>;
  save: (settings: WorkspaceSettings) => Promise<void>;
};

type PanelState = 'loading' | 'ready' | 'error';

const cardStyle: React.CSSProperties = { maxWidth: 560 };

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  minWidth: 320,
};

const actionsStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' };

const stateStyle: React.CSSProperties = {
  ...cardStyle,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  alignItems: 'start',
};

export const WorkspaceSettingsPanel: React.FC<WorkspaceSettingsPanelProps> = ({ load, save }) => {
  const [state, setState] = React.useState<PanelState>('loading');
  const [loadError, setLoadError] = React.useState<string | undefined>();
  const [saved, setSaved] = React.useState<WorkspaceSettings | undefined>();
  const [draft, setDraft] = React.useState<WorkspaceSettings | undefined>();
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState<string | undefined>();
  const [saveError, setSaveError] = React.useState<string | undefined>();

  const loadSettings = React.useCallback(async () => {
    setState('loading');
    setLoadError(undefined);
    try {
      const settings = await load();
      setSaved(settings);
      setDraft(settings);
      setState('ready');
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'We could not load these settings.');
      setState('error');
    }
  }, [load]);

  React.useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  if (state === 'loading') {
    return (
      <Card appearance="filled-alternative" style={cardStyle}>
        <Spinner label="Loading workspace settings" labelPosition="after" />
      </Card>
    );
  }

  if (state === 'error' || !draft || !saved) {
    return (
      <Card appearance="filled-alternative" style={stateStyle}>
        <MessageBar intent="error" politeness="assertive">
          {loadError ?? 'We could not load these settings.'}
        </MessageBar>
        <Button appearance="primary" onClick={() => void loadSettings()}>
          Try again
        </Button>
      </Card>
    );
  }

  const update = (patch: Partial<WorkspaceSettings>) => {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
    setSaveMessage(undefined);
    setSaveError(undefined);
  };

  const nameError = draft.workspaceName.trim() === '' ? 'Enter a workspace name.' : undefined;

  const isDirty =
    draft.workspaceName !== saved.workspaceName ||
    draft.defaultVisibility !== saved.defaultVisibility ||
    draft.allowGuestInvites !== saved.allowGuestInvites;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (nameError) {
      return;
    }

    setIsSaving(true);
    setSaveMessage(undefined);
    setSaveError(undefined);
    try {
      await save(draft);
      setSaved(draft);
      setSaveMessage('Workspace settings saved.');
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'We could not save your changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setDraft(saved);
    setSaveMessage(undefined);
    setSaveError(undefined);
  };

  return (
    <Card appearance="filled-alternative" style={cardStyle}>
      <form
        noValidate
        aria-label="Workspace settings"
        aria-busy={isSaving}
        onSubmit={handleSubmit}
        style={formStyle}
      >
        <Text size={500} weight="semibold" block>
          Workspace settings
        </Text>

        {saveMessage && (
          <MessageBar intent="success" politeness="polite">
            {saveMessage}
          </MessageBar>
        )}
        {saveError && (
          <MessageBar intent="error" politeness="assertive">
            {saveError}
          </MessageBar>
        )}

        <Field
          label="Workspace name"
          required
          validationState={nameError ? 'error' : 'none'}
          validationMessage={nameError}
        >
          <Input
            value={draft.workspaceName}
            onChange={(_, data) => update({ workspaceName: data.value })}
          />
        </Field>

        <Field label="Default page visibility" hint="Applies to pages created from now on.">
          <Select
            value={draft.defaultVisibility}
            onChange={(_, data) =>
              update({ defaultVisibility: data.value as WorkspaceSettings['defaultVisibility'] })
            }
          >
            <option value="private">Private to the workspace</option>
            <option value="team">Everyone in the workspace</option>
            <option value="public">Anyone with the link</option>
          </Select>
        </Field>

        <Checkbox
          checked={draft.allowGuestInvites}
          onChange={(_, data) => update({ allowGuestInvites: data.checked === true })}
        >
          Let members invite guests
        </Checkbox>

        <Divider />

        <div style={actionsStyle}>
          <Button type="submit" appearance="primary" disabled={!isDirty || isSaving}>
            {isSaving ? 'Saving' : 'Save'}
          </Button>
          <Button
            type="button"
            appearance="secondary"
            disabled={!isDirty || isSaving}
            onClick={handleDiscard}
          >
            Discard
          </Button>
          {isSaving && <Spinner size="tiny" label="Saving" labelPosition="after" />}
        </div>
      </form>
    </Card>
  );
};
```

## Pitfalls

- Mutating the draft object in place (for example `draft.email = value`) keeps the same object identity, so the `isDirty` comparison and React re-render both miss the change. Always patch with a new object via `setDraft((prev) => ({ ...prev, ...patch }))`.
- Wrapping Switch or Checkbox in Field creates two competing labels. Those controls render their label from their children, so use Field only for controls without a visible label of their own (Input, Select, Textarea).
- Storing validation messages in state and syncing them with an effect produces stale or flickering errors. Derive error strings from the draft on every render and only gate their visibility behind touched/submitted flags.
- Parsing a numeric input straight into the settings object on every keystroke stores NaN or partial values while the user types (and fights the caret if you reformat the text). Keep the raw string in its own state, validate it, and commit to the settings object only when the parse is in range.
- Omitting `noValidate` on the <form> lets the browser's native validation bubbles pre-empt Fluent's Field messages, so users see two different error presentations for the same field.
- Setting the 'saved' copy before the save promise resolves makes the form claim success on failure and disables Discard against the wrong baseline. Assign `setSaved(draft)` only after the await succeeds, and leave the draft untouched on failure.
- Passing an inline arrow as the loader to an effect dependency re-runs the fetch on every render. Memoize loaders and persisters with React.useCallback (or module-level functions) before wiring them into useEffect.
- Forgetting to clear a success MessageBar on the next edit leaves a stale 'saved' confirmation on screen while the form is dirty again; reset the status inside the patch helper.
- Shallow `isDirty` checks break as soon as a setting is an object or array (a new reference with identical contents reads as dirty). Flatten the settings shape, or compare serialized values for nested fields.
- Using `disabled` as the only signal that a save is in flight removes the button from the tab order and from screen-reader reach. Pair it with a Spinner that carries a label and aria-busy on the form.

## Accessibility

Field is the accessibility workhorse: it renders a real <label> associated with the child control, wires hint and validationMessage through aria-describedby, adds aria-invalid when validationState is 'error', and marks the label when required, so errors are announced when the field receives focus. Do not hand-roll labels with bare Text next to a control - that loses the association, the described-by wiring, and the required semantics.

Give Switch and Checkbox their own descriptive child text ('Product updates and announcements') rather than wrapping them in Field; the control then exposes its own label plus its checked state, and screen readers get one label, not two competing ones. Never encode state in the label text ('Product updates: on').

Group fields into <section aria-labelledby> elements with real <h3> headings so screen-reader users can navigate a long settings pane by heading. Between sections use Divider for the visual break only - the heading carries the meaning.

Announce asynchronous results by mounting a MessageBar: use politeness='polite' for success confirmations and politeness='assertive' for failures. Because the live region announces on mount, conditional rendering is the trigger - do not keep a hidden MessageBar mounted and only change its text. Clear stale success messages on the next edit.

On a failed submit, move focus to the first invalid control (Input forwards its ref to the underlying <input>), so the message is read together with the field. Do not autofocus the first field on page load: it steals focus and scrolls away from the pane title.

Mark busy work with aria-busy on the <form> and swap the primary button's label to 'Saving'; prefer disabledFocusable over disabled when you want the control to remain reachable by keyboard. Never rely on color alone - Field renders the validation text plus a status icon, and MessageBar renders text plus an icon.

Keep DOM order identical to visual order so tab order is predictable, avoid positive tabIndex, and leave the action row after the last field so Tab reaches Save/Discard naturally. Keep every interactive target at Fluent's default control heights instead of shrinking rows, and ensure validation messages are tied to their control (Field does this) instead of being placed in a distant summary only.

## Components used

- [Badge](../../components/badge.md)
- [Button](../../components/button.md)
- [Card](../../components/card.md)
- [Checkbox](../../components/checkbox.md)
- [Divider](../../components/divider.md)
- [Field](../../components/field.md)
- [Input](../../components/input.md)
- [MessageBar](../../components/message-bar.md)
- [Persona](../../components/persona.md)
- [Select](../../components/select.md)
- [Spinner](../../components/spinner.md)
- [Switch](../../components/switch.md)
- [Text](../../components/text.md)
- [Textarea](../../components/textarea.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
