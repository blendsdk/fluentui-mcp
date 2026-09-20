# Accessibility Basics

> **Group**: accessibility

## Goal

Compose Fluent UI React v9 components into fully accessible UI: labelled form controls with validation, correctly named icon-only buttons and tooltips, a focus-trapping confirmation dialog, keyboard-navigable navigation widgets, and live regions that announce state changes to screen readers.

## When to Use

Use this recipe as the baseline for every feature you build with Fluent UI React v9 — whenever you render form fields, icon-only buttons, overlays (Dialog/Drawer/Popover/Menu), composite widgets (TabList, Breadcrumb, Toolbar, Tree), or asynchronous status messages, and you need the result to be operable by keyboard and understandable by assistive technology.

## When Not to Use

Do not use this as a substitute for component-level documentation when you need a highly specialized pattern: rich data grids with custom cell editors (use DataGrid + TableCellLayout guidance), virtualized trees (use FlatTree/Tree guidance), or fully custom ARIA widgets that Fluent does not ship. For purely visual/demo pages with no interactive controls, the field-and-live-region parts of this recipe are unnecessary. If you only need a single control, read that component's own accessibility notes instead of applying the whole shell.

Fluent UI v9 does a large part of the accessibility work for you. This recipe shows what is already handled, what you must add yourself, and three complete compositions you can copy: an accessible settings form, an accessible destructive action (icon-only button + tooltip + confirmation dialog), and an accessible workspace shell (breadcrumb, tabs, live region).

## What the components already give you

| Area | What Fluent handles |
| --- | --- |
| Semantics | `Button` renders a real `<button>`, `NavItem` renders `<a>` when `href` is set, `Tab` renders `role="tab"`, `Checkbox`/`Radio`/`Switch` render a real input plus a `<label>` |
| Composite keyboard model | `TabList`, `Toolbar`, `Menu`, `Tree`, and `Breadcrumb` (`focusMode="arrow"`) use roving tabindex, so the group is a single Tab stop and arrow keys move inside it |
| Overlay focus | `Dialog`, `Drawer`, `Popover` and `Menu` move focus into the surface, trap it there, close on Escape and restore focus to the trigger |
| Field wiring | `Field` renders the label, links hint and validation message through `aria-describedby`, and marks the control invalid when `validationState="error"` |
| Theming | `FluentProvider` supplies color tokens for both light and dark themes, which keeps contrast inside the design system |

Everything below is the part only you can do.

## Step 1 - Render inside a provider

Wrap your application once with `FluentProvider`. Portals (`Dialog`, `Menu`, `Tooltip`, `Popover`) render into `document.body`; if they are outside the provider they lose theme tokens, and RTL mirroring from `dir="rtl"` will not apply to them.

```tsx
<FluentProvider dir={direction}>
  <AriaLiveAnnouncer>
    <App />
  </AriaLiveAnnouncer>
</FluentProvider>
```

`AriaLiveAnnouncer` renders the visually hidden polite and assertive live regions and shares them through context so components that announce updates reuse one pair of regions instead of stacking a new one for every component. Render it once, inside the provider.

## Step 2 - Give every control an accessible name

### Use `Field` for controls that have no label of their own

`Input`, `Select`, `Textarea`, `Slider` and `SpinButton` have no label slot, so wrap them in `Field`. `Field` associates the label with the control by id, appends the hint and validation message to `aria-describedby`, and passes the invalid state down. The message is then read when the control receives focus - it is not automatically announced live, which is why the form below also renders a `MessageBar` with `politeness="assertive"` on submit.

```tsx
<Field
  label="Email address"
  required
  hint="Used only for account recovery."
  validationState={error ? 'error' : 'none'}
  validationMessage={error}
>
  <Input type="email" value={email} onChange={(_, data) => setEmail(data.value)} />
</Field>
```

`Field` also labels a *group*: wrapping a `RadioGroup` in a `Field` with a `label` gives the group an accessible name.

### Checkbox, Radio and Switch label themselves

These three render their own `<label>` element, so pass the visible text to the `label` slot and do **not** wrap them in a `Field` - that would produce two labels for one control.

```tsx
<Checkbox label="Email me a weekly digest" checked={digest} onChange={(_, data) => setDigest(data.checked === true)} />
<Switch label="Require two-factor authentication" checked={twoFactor} onChange={(_, data) => setTwoFactor(data.checked)} />
```

### Never use a placeholder as the name

A placeholder is not an accessible name and it disappears as soon as the user types. Always provide `Field label` (or the control's `label` slot) in addition to any placeholder.

### Name icon-only buttons

When a `Button` has no visible text, it has no accessible name. Give it one with `aria-label` (or by making the visible tooltip text the label, see Step 3):

```tsx
<Button icon={<DeleteIcon />} aria-label="Delete report" appearance="subtle" onClick={confirm} />
```

Make sure the icon itself is decorative: render it with `aria-hidden="true"` and `focusable="false"` so the SVG does not become a separate object in the accessibility tree.

## Step 3 - Pick the right Tooltip relationship

`Tooltip` requires a `relationship` prop, and the value decides what the tooltip does to the accessibility tree:

- `relationship="label"` - the tooltip text becomes the accessible name of the trigger. Use it only when the trigger has no visible text.
- `relationship="description"` - the tooltip text becomes the description. Use it when the trigger already has a name and the tooltip adds context.
- `relationship="inaccessible"` - the content is hidden from assistive technology entirely. Use it for purely visual hints.

```tsx
{/* icon-only trigger: tooltip is the name */}
<Tooltip content="Delete report" relationship="label">
  <Button icon={<DeleteIcon />} aria-label="Delete report" appearance="subtle" />
</Tooltip>

{/* trigger already has a name: tooltip is the description */}
<Tooltip content="Archiving unlocks after the report is published" relationship="description">
  <Button appearance="secondary" disabledFocusable>
    Archive
  </Button>
</Tooltip>
```

Keep the tooltip string identical to any `aria-label` you also set, so the announced name does not change between rendered and non-rendered states.

## Step 4 - Announce changes with live regions

Anything that changes without a page navigation - save confirmations, validation summaries, background job results - must be announced. Use `MessageBar` and set `politeness` explicitly: `"polite"` for status, `"assertive"` for errors that need to interrupt.

```tsx
<MessageBar intent="error" politeness="assertive">
  <MessageBarBody>
    <MessageBarTitle>Two fields need attention</MessageBarTitle>
    Fix the highlighted fields, then save again.
  </MessageBarBody>
</MessageBar>
```

The live region only announces *changes* to a region that is already in the DOM. If a message may be replaced repeatedly (a queue of notifications), keep the region mounted and swap its contents rather than unmounting/remounting the whole bar, or render a `MessageBarGroup`.

## Step 5 - Keep focus reachable and visible

- Prefer `disabledFocusable` over `disabled`. A truly `disabled` button is removed from the tab order, so keyboard users can never learn why it is unavailable, and tooltips on it can never be opened. `disabledFocusable` renders the same look but stays focusable and blocks activation.
- `Dialog` traps focus while open and restores it to the trigger on close. Do not re-implement this with manual `autoFocus`. Give the surface a title through `DialogTitle` so it is announced, and describe the consequence in `DialogContent` - do not rely on the button text alone.
- Never remove focus outlines with global CSS. If the default ring is not visible against your background, restyle it; do not delete it.
- Composite widgets already implement roving tabindex. `Card` is the exception: choose `focusMode` deliberately and, when a selectable card contains its own `Button` or `Link`, use `shouldRestrictTriggerAction` so clicking the inner control does not also toggle card selection.

## Step 6 - Structure with landmarks, headings and reading order

- One `<h1>` per view, then `<h2>`/`<h3>` for sections. Style them with `Text` (`size`, `weight`, `block`) instead of jumping sizes for visual effect.
- Use `Breadcrumb` and mark the current page with `BreadcrumbButton current`, which exposes it as the current page instead of just a differently colored link.
- `TabList` owns the tab strip (roles, roving tabindex, `aria-selected`); the panel below it is your markup, and it should follow the strip in DOM order.
- Put the page into a `<main>` landmark and give repeated `<nav>` regions an `aria-label` so screen reader users can jump between them.

## Step 7 - Verify keyboard and screen reader behaviour

1. Unplug the mouse. Can you reach every control with Tab/Shift+Tab? Do composite widgets respond to arrows? Does Escape close every overlay?
2. Tab to each control and confirm its announced name and description match the visible text.
3. Trigger validation and confirm the error is announced and the invalid field is described.
4. Open and close a dialog and check that focus returns to the control that opened it.
5. Turn on a screen reader (Narrator, VoiceOver, NVDA) and repeat the flow; check the reading order matches the visual order.
6. Zoom to 200% and re-check that nothing is clipped and text reflows.

## Examples

### Accessible settings form

A validated settings form where Field supplies labels, hints and described validation for Input/Select/Textarea/RadioGroup, Checkbox and Switch label themselves, errors and saves are announced through MessageBar live regions, and disabled-looking actions stay focusable.

```tsx
import * as React from 'react';
import {
  Button,
  Checkbox,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Text,
  Textarea,
} from '@fluentui/react-components';

type AccountSettings = {
  displayName: string;
  email: string;
  role: string;
  bio: string;
  theme: string;
  digest: boolean;
  twoFactor: boolean;
};

type FieldErrors = Partial<Record<'displayName' | 'email', string>>;

const initialSettings: AccountSettings = {
  displayName: '',
  email: '',
  role: 'engineer',
  bio: '',
  theme: 'system',
  digest: true,
  twoFactor: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AccessibleSettingsForm: React.FC = () => {
  const [settings, setSettings] = React.useState<AccountSettings>(initialSettings);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [status, setStatus] = React.useState<string | undefined>(undefined);

  const update = <K extends keyof AccountSettings>(key: K, value: AccountSettings[K]) => {
    setSettings(previous => ({ ...previous, [key]: value }));
  };

  const validate = (candidate: AccountSettings): FieldErrors => {
    const nextErrors: FieldErrors = {};
    if (candidate.displayName.trim().length === 0) {
      nextErrors.displayName = 'Enter a display name so teammates can recognize you.';
    }
    if (!EMAIL_PATTERN.test(candidate.email)) {
      nextErrors.email = 'Enter an email address in the format name@example.com.';
    }
    return nextErrors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(settings);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus(undefined);
      return;
    }
    setStatus(`Settings saved for ${settings.displayName}.`);
  };

  const errorCount = Object.keys(errors).length;

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'grid', gap: 16, maxWidth: 480 }}>
      <h2>
        <Text size={600} weight="semibold">
          Account settings
        </Text>
      </h2>

      {/* Summary of errors is announced immediately, assertively. */}
      {errorCount > 0 && (
        <MessageBar intent="error" politeness="assertive">
          <MessageBarBody>
            <MessageBarTitle>
              {errorCount === 1 ? 'One field needs attention' : `${errorCount} fields need attention`}
            </MessageBarTitle>
            Fix the highlighted fields, then save again.
          </MessageBarBody>
        </MessageBar>
      )}

      {/* Success is polite: it never interrupts the user mid-sentence. */}
      {status && (
        <MessageBar intent="success" politeness="polite">
          <MessageBarBody>
            <MessageBarTitle>Saved</MessageBarTitle>
            {status}
          </MessageBarBody>
        </MessageBar>
      )}

      {/* Field links label, hint and validation message to the Input. */}
      <Field
        label="Display name"
        required
        hint="Shown next to your comments and mentions."
        validationState={errors.displayName ? 'error' : 'none'}
        validationMessage={errors.displayName}
      >
        <Input
          value={settings.displayName}
          onChange={(_, data) => update('displayName', data.value)}
        />
      </Field>

      <Field
        label="Email address"
        required
        hint="Used only for account recovery."
        validationState={errors.email ? 'error' : 'none'}
        validationMessage={errors.email}
      >
        <Input
          type="email"
          value={settings.email}
          onChange={(_, data) => update('email', data.value)}
        />
      </Field>

      <Field label="Role" hint="Controls which dashboards you can open.">
        <Select value={settings.role} onChange={(_, data) => update('role', data.value)}>
          <option value="engineer">Engineer</option>
          <option value="designer">Designer</option>
          <option value="manager">Manager</option>
        </Select>
      </Field>

      <Field label="Bio" hint="Plain text only, 280 characters maximum.">
        <Textarea
          value={settings.bio}
          resize="vertical"
          onChange={(_, data) => update('bio', data.value)}
        />
      </Field>

      {/* A Field around RadioGroup names the whole group, not one radio. */}
      <Field label="Appearance">
        <RadioGroup
          layout="horizontal"
          value={settings.theme}
          onChange={(_, data) => update('theme', data.value)}
        >
          <Radio value="system" label="Match system" />
          <Radio value="light" label="Light" />
          <Radio value="dark" label="Dark" />
        </RadioGroup>
      </Field>

      {/* Checkbox and Switch carry their own label slot - no Field wrapper. */}
      <Checkbox
        label="Email me a weekly digest"
        checked={settings.digest}
        onChange={(_, data) => update('digest', data.checked === true)}
      />

      <Switch
        label="Require two-factor authentication"
        checked={settings.twoFactor}
        onChange={(_, data) => update('twoFactor', data.checked)}
      />

      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="submit" appearance="primary">
          Save settings
        </Button>
        <Button
          type="button"
          appearance="secondary"
          onClick={() => {
            setSettings(initialSettings);
            setErrors({});
            setStatus(undefined);
          }}
        >
          Reset
        </Button>
      </div>
    </form>
  );
};
```

### Accessible destructive action with tooltips and dialog

An icon-only delete button named with aria-label and labelled by Tooltip relationship="label", a second tooltip used as a description on a focusable-but-disabled action, and a confirmation Dialog whose title labels the surface and whose focus trap and focus restore come for free.

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
  FluentProvider,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Text,
  Tooltip,
} from '@fluentui/react-components';

/* Decorative icon: hidden from assistive technology, named by the button. */
const DeleteIcon: React.FC = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 3.5a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1Zm0 9.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" />
  </svg>
);

export const AccessibleDestructiveAction: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<string | undefined>(undefined);

  const handleDelete = () => {
    setOpen(false);
    setStatus('Q3 report was deleted. Undo is available for 30 days.');
  };

  return (
    <FluentProvider>
      <div style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Icon-only trigger: the tooltip text becomes the accessible name. */}
          <Tooltip content="Delete report" relationship="label">
            <Button
              icon={<DeleteIcon />}
              appearance="subtle"
              aria-label="Delete report"
              onClick={() => setOpen(true)}
            />
          </Tooltip>

          {/* disabledFocusable keeps the control in the tab order and tooltip-able. */}
          <Tooltip content="Archiving unlocks after the report is published" relationship="description">
            <Button appearance="secondary" disabledFocusable>
              Archive
            </Button>
          </Tooltip>
        </div>

        {status && (
          <MessageBar intent="success" politeness="polite">
            <MessageBarBody>
              <MessageBarTitle>Report deleted</MessageBarTitle>
              {status}
            </MessageBarBody>
          </MessageBar>
        )}

        {/* DialogTitle labels the surface; Escape closes; focus returns to the trigger. */}
        <Dialog open={open} onOpenChange={(_, data) => setOpen(data.open)}>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>Delete this report?</DialogTitle>
              <DialogContent>
                <Text>
                  Deleting <strong>Q3 report</strong> removes it for everyone in the workspace.
                  This action cannot be undone.
                </Text>
              </DialogContent>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement action="secondary">
                  <Button appearance="secondary">Cancel</Button>
                </DialogTrigger>
                <DialogTrigger disableButtonEnhancement action="primary">
                  <Button appearance="primary" onClick={handleDelete}>
                    Delete report
                  </Button>
                </DialogTrigger>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      </div>
    </FluentProvider>
  );
};
```

### Accessible workspace shell with landmarks, tabs and a live region

A page shell that renders FluentProvider and AriaLiveAnnouncer once, uses Breadcrumb with a current page, TabList for keyboard-navigable views, an Avatar whose name is also present as text, a text-plus-color Badge, and a politely announced MessageBar with a dismiss action.

```tsx
import * as React from 'react';
import {
  AriaLiveAnnouncer,
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Button,
  Card,
  CardHeader,
  FluentProvider,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarTitle,
  Tab,
  TabList,
  Text,
} from '@fluentui/react-components';

type ViewId = 'overview' | 'activity' | 'settings';

export const AccessibleWorkspaceShell: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState<ViewId>('overview');
  const [status, setStatus] = React.useState<string | undefined>(undefined);

  return (
    <FluentProvider>
      {/* One pair of hidden live regions for the whole app. */}
      <AriaLiveAnnouncer>
        <main style={{ display: 'grid', gap: 16, maxWidth: 640, padding: 16 }}>
          <Breadcrumb aria-label="Breadcrumb">
            <BreadcrumbItem>
              <BreadcrumbButton href="#home">Home</BreadcrumbButton>
            </BreadcrumbItem>
            <BreadcrumbDivider />
            <BreadcrumbItem>
              <BreadcrumbButton href="#workspaces">Workspaces</BreadcrumbButton>
            </BreadcrumbItem>
            <BreadcrumbDivider />
            <BreadcrumbItem>
              {/* current marks the page instead of just coloring the link */}
              <BreadcrumbButton current>Q3 report</BreadcrumbButton>
            </BreadcrumbItem>
          </Breadcrumb>

          <h1>
            <Text size={700} weight="semibold">
              Q3 report
            </Text>
          </h1>

          {/* TabList owns the strip: roles, roving tabindex and arrow keys. */}
          <TabList
            selectedValue={selectedTab}
            onTabSelect={(_, data) => {
              const value = data.value as ViewId;
              setSelectedTab(value);
              setStatus(`${value} view loaded`);
            }}
          >
            <Tab value="overview">Overview</Tab>
            <Tab value="activity">Activity</Tab>
            <Tab value="settings">Settings</Tab>
          </TabList>

          {selectedTab === 'overview' && (
            <Card appearance="outline">
              <CardHeader
                image={<Avatar name="Ada Lovelace" color="colorful" />}
                header={
                  <Text size={400} weight="semibold">
                    Ada Lovelace
                  </Text>
                }
                description={<Text size={200}>Report owner</Text>}
                action={
                  <Badge appearance="filled" color="success" shape="rounded">
                    On track
                  </Badge>
                }
              />
              <Text block size={300}>
                Revenue is 12% above target with two weeks left in the quarter.
              </Text>
            </Card>
          )}

          {selectedTab === 'activity' && (
            <Text block size={300}>
              No activity yet. Invite a teammate to get started.
            </Text>
          )}

          {selectedTab === 'settings' && <Button appearance="primary">Manage report settings</Button>}

          {status && (
            <MessageBar intent="info" politeness="polite">
              <MessageBarBody>
                <MessageBarTitle>View updated</MessageBarTitle>
                {status}
              </MessageBarBody>
              <MessageBarActions
                containerAction={
                  <Button appearance="transparent" onClick={() => setStatus(undefined)}>
                    Dismiss
                  </Button>
                }
              />
            </MessageBar>
          )}
        </main>
      </AriaLiveAnnouncer>
    </FluentProvider>
  );
};
```

## Pitfalls

- Using `disabled` instead of `disabledFocusable`. A disabled button is removed from the tab order, so keyboard users cannot reach it and cannot open its Tooltip. Use `disabledFocusable` for controls that should look unavailable but stay focusable, and explain the reason with `relationship="description"`.
- Using a placeholder as the label. Placeholders are not accessible names and disappear on input. Always pass `label` to `Field` for Input/Select/Textarea/Slider and the `label` slot for Checkbox/Radio/Switch.
- Double-labelling a control. Checkbox, Radio and Switch render their own `<label>`, so wrapping them in a `Field` with a `label` produces two labels for one control. Also avoid an `aria-label` that conflicts with visible text: the announced name should match what the user reads (label-in-name).
- Icon-only buttons with no accessible name. A Button whose only child is an icon announces as an unlabeled button. Add `aria-label`, and mark the SVG `aria-hidden="true" focusable="false"` so it does not become a separate object.
- Choosing the wrong Tooltip relationship. `relationship="description"` on an icon-only trigger leaves it unnamed, while `relationship="label"` on a button that already has visible text can produce a confusing double name. Use `label` only for unnamed triggers, `description` for extra context.
- Relying on the tooltip as the only source of the name. Tooltips are not rendered on touch devices or when the trigger is not hovered/focused, so an icon-only button should carry `aria-label` as the source of truth and the tooltip text should match it exactly.
- Unmounting the live region together with its content. Live regions announce changes to an existing region; conditionally mounting a whole message component can be missed or read out of order. Keep the region mounted and swap its contents, or use `MessageBarGroup` for a queue of messages.
- Using the wrong politeness. Errors that block the user should use `politeness="assertive"`, routine confirmations should use `politeness="polite"` so they do not interrupt. Passing no politeness leaves the behavior implicit and inconsistent across the app.
- Encoding meaning in color alone. Badge and MessageBar `intent`/`color` must always be paired with text, and status must never be conveyed only by a colored dot or border.
- Nesting interactive elements inside a selectable Card or clickable row. Interacting with the inner Button then also toggles selection and creates ambiguous keyboard behavior. Use `focusMode` to control tab stops and `shouldRestrictTriggerAction` to keep inner interactions from triggering the card action.
- Rendering overlays outside FluentProvider. Portals such as Dialog, Menu, Popover and Tooltip mount into document.body; without a provider ancestor they lose theme tokens and RTL direction, which can produce unreadable contrast or incorrectly mirrored content.
- Removing focus outlines globally with CSS resets. The visible focus indicator is required for keyboard operation; restyle it with theme tokens if it is hard to see instead of hiding it.
- Leaving dialog surfaces untitled or undescribed. `DialogTitle` labels the surface for screen readers, and the consequence of the action belongs in `DialogContent` - a bare button label is not enough context for a destructive confirmation.

## Accessibility

What the composed recipe guarantees: every form control has a programmatically associated name (Field label or the control's own label slot), hints and validation messages are linked through aria-describedby and the invalid state is exposed, error and success messages live in live regions with explicit politeness, icon-only buttons have accessible names and decorative SVGs are hidden from the accessibility tree, Tooltip declares whether it acts as a label or a description, dialog focus is trapped and restored by the component, and every composite widget (TabList, Breadcrumb, Menu, Toolbar, Tree) keeps its roving-tabindex keyboard model. What you must still verify manually: a full keyboard-only pass with no mouse, an announced-name check on every control, a screen reader pass (Narrator/VoiceOver/NVDA) to confirm reading order and message announcements, focus restoration after closing each overlay, text reflow at 200% zoom, and contrast in both light and dark themes. Do not remove focus outlines, always keep text visible alongside any color-coded status (Badge intent, MessageBar intent), and never disable an action without a focusable way to discover why it is unavailable.

## Components used

- [AriaLiveAnnouncer](../../components/aria-live-announcer.md)
- [Avatar](../../components/avatar.md)
- [Badge](../../components/badge.md)
- [Breadcrumb](../../components/breadcrumb.md)
- [BreadcrumbButton](../../components/breadcrumb-button.md)
- [BreadcrumbDivider](../../components/breadcrumb-divider.md)
- [BreadcrumbItem](../../components/breadcrumb-item.md)
- [Button](../../components/button.md)
- [Card](../../components/card.md)
- [CardHeader](../../components/card-header.md)
- [Checkbox](../../components/checkbox.md)
- [Dialog](../../components/dialog.md)
- [DialogActions](../../components/dialog-actions.md)
- [DialogBody](../../components/dialog-body.md)
- [DialogContent](../../components/dialog-content.md)
- [DialogSurface](../../components/dialog-surface.md)
- [DialogTitle](../../components/dialog-title.md)
- [DialogTrigger](../../components/dialog-trigger.md)
- [Field](../../components/field.md)
- [FluentProvider](../../components/fluent-provider.md)
- [Input](../../components/input.md)
- [MessageBar](../../components/message-bar.md)
- [MessageBarActions](../../components/message-bar-actions.md)
- [MessageBarBody](../../components/message-bar-body.md)
- [MessageBarTitle](../../components/message-bar-title.md)
- [Radio](../../components/radio.md)
- [RadioGroup](../../components/radio-group.md)
- [Select](../../components/select.md)
- [Switch](../../components/switch.md)
- [Tab](../../components/tab.md)
- [TabList](../../components/tab-list.md)
- [Text](../../components/text.md)
- [Textarea](../../components/textarea.md)
- [Tooltip](../../components/tooltip.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
