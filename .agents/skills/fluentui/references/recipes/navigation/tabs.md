# Tabs

> **Group**: navigation

## Goal

Build an accessible, fully keyboard-operable tabbed interface with FluentUI React v9 — a tab strip (Tabs / TabList / Tab) plus one associated panel per tab — covering both uncontrolled and controlled selection, appearance and size variants, vertical side-tab layouts, and programmatic tab changes such as wizard steps.

## When to Use

Use this recipe when a surface has a small set of peer views (roughly 2–7) that share the same context and the user switches between them without leaving the page: settings sections, detail panes (Overview / Activity / Members), filter switches, or sequential wizard steps inside one flow. Also use it when you need selection state owned by React (controlled tabs) so panels, URLs, or buttons can read and change the active view.

## When Not to Use

Don't use tabs for site-level or hierarchical navigation, breadcrumb trails, or moving between routes — use Nav, Breadcrumb, or Link instead. Don't use tabs as an action menu (use Menu), as a list of selectable data rows (use List or a Table with selection), or for very long, dynamic collections of items (use Select, Combobox, or a vertical Nav). Don't use tabs to hide mandatory or critical content that every user must see. If a flow is strictly linear and must be validated step-by-step, prefer a Dialog or a dedicated step flow rather than tabs the user can jump around in.

## What you are building

A tab strip with a complete keyboard model (roving `tabindex`, arrow keys, Home/End), the correct `tab` / `tablist` / `tabpanel` relationships, and one panel per tab that is associated with its controlling tab.

## Anatomy

| Component | Renders | Responsibility |
| --- | --- | --- |
| `Tabs` | layout wrapper (`div`) | Optional. Provides the selection value through context so a `TabList` and its sibling panels share one source of truth. |
| `TabList` | `div[role="tablist"]` | Owns selection and keyboard navigation. Creates its own internal state when it is not wrapped in `Tabs`. |
| `Tab` | `button[role="tab"]` | A single tab. `value` is required and must be unique within the list. |

Minimum viable tab bar — a `TabList` on its own manages selection internally:

```tsx
import { Tab, TabList } from '@fluentui/react-components';

<TabList defaultSelectedValue="overview" onTabSelect={(_, data) => console.log(data.value)}>
  <Tab value="overview">Overview</Tab>
  <Tab value="activity">Activity</Tab>
</TabList>;
```

## Pattern A — standalone `TabList` (no panels)

When the tab bar only *drives* something that lives outside of it (a filter for a list rendered by the parent, a query parameter, a toolbar), use `TabList` alone and read `data.value` inside `onTabSelect`. This is the simplest and least error-prone setup: one component owns the state, nothing else needs to read it.

Appearance, size, orientation, and behavior props (`appearance`, `size`, `vertical`, `reserveSelectedTabSpace`, `selectTabOnFocus`, `disabled`) all live on the tab list in this pattern.

## Pattern B — `Tabs` + `TabList` + panels

When panel content is a sibling of the tab strip, wrap both in `Tabs`. `Tabs` renders a flex layout container and provides the tab context to everything inside it (with `vertical`, the tab list and panels lay out side by side for a settings-style side navigation).

Keep the selected value in React state and pass it to the wrapper:

```tsx
const [selectedValue, setSelectedValue] = React.useState<TabValue>('overview');

<Tabs selectedValue={selectedValue} onTabSelect={(_, data) => setSelectedValue(data.value)}>
  <TabList>{/* <Tab value="overview" …/> */}</TabList>
  <div role="tabpanel" aria-labelledby={`tab-${selectedValue}`} tabIndex={0}>
    {/* panel body */}
  </div>
</Tabs>;
```

## Selection model: uncontrolled vs controlled

* **Uncontrolled** — pass `defaultSelectedValue` and let the tab list own the state. Use it when nothing outside the tabs needs to know what is selected.
* **Controlled** — pass `selectedValue` plus `onTabSelect`. Required whenever a panel, a URL, or a button ("Next") must read or change the selection.
* Pass selection props to **one** component only. Setting `selectedValue`/`onTabSelect` on both `Tabs` and the inner `TabList` creates two sources of truth (Fluent logs a development warning because of this). If you wrap in `Tabs`, put the selection props on `Tabs`.
* `TabValue` is `string | number`. Values must be unique and stable — never use the array index as the value when the list can be reordered or filtered.

## Wiring panels

Fluent does not render panels for you; you supply them and wire the relationships yourself:

1. Give every `Tab` a stable `id` (e.g. `id="tab-overview"`). `id` is forwarded to the tab's `<button>`.
2. Give the panel `role="tabpanel"`, an `id`, and `aria-labelledby={the selected tab's id}`.
3. Add `tabIndex={0}` **only** when the panel contains no focusable children — otherwise the panel becomes a redundant tab stop.
4. Prefer keeping panels mounted and toggling visibility when a panel holds user input or scroll position; unmount heavy panels and re-create them on selection.

## Appearance, size, orientation

* `appearance`: `transparent` (default underline-style), `subtle`, `subtle-circular`, `filled-circular` (segmented-control look).
* `size`: `small`, `medium`, `large`. Use `small` inside cards and toolbars.
* `vertical`: switches the tab list to a column and, inside `Tabs`, puts panels beside the list.
* `reserveSelectedTabSpace` (default `true`): keeps space for the selected indicator so labels don't shift as selection changes. Only disable it if you control the layout yourself.
* `disabled` on `Tab` removes a single tab; `disabled` on the list disables the whole set.

## Keyboard and focus

The tab list already implements the ARIA Authoring Practices model: only the selected tab is in the page tab order, and Left/Right (or Up/Down when `vertical`) move between tabs, with Home/End jumping to the first/last tab. `selectTabOnFocus` chooses between manual activation (arrow keys move focus, Enter/Space select) and automatic activation (selection follows focus) — set it explicitly to match the model you want. Do **not** add your own arrow-key handlers or an `onClick` that changes selection; that fights the built-in behavior and desynchronizes the roving tabindex.

## Advanced callbacks

`onRegister`, `onUnregister`, `onSelect`, and `registeredTabs` exist on the `Tabs` wrapper for headless/advanced scenarios where you want to render your own list markup. When you use `TabList`, it wires all of these for you — leave them alone.

## Putting it together

1. Pick the pattern: standalone `TabList` for a filter-style strip, `Tabs` + `TabList` + panels for real tabbed content.
2. Decide uncontrolled vs controlled. Choose controlled as soon as anything outside the tabs depends on the selection.
3. Give every tab a unique `value` and an `id`; give every panel `role="tabpanel"`, `aria-labelledby`, and a matching `id`.
4. Pick `appearance`/`size`/`vertical` for the context (segmented control in a card, underline tabs in a page header, vertical list in settings).
5. Verify with the keyboard only: Tab into the list, arrow through the tabs, Enter/Space to activate, and confirm the panel updates and is announced.

## Examples

### Controlled tabs with associated panels

A three-tab detail view where selection lives in React state, each Tab has an id, and the single panel is re-associated with the selected tab through aria-labelledby.

```tsx
import * as React from 'react';
import {
  Button,
  Tab,
  TabList,
  Tabs,
  Text,
  type SelectTabData,
  type SelectTabEvent,
  type TabValue,
} from '@fluentui/react-components';

type PanelId = 'overview' | 'activity' | 'members';

const panels: Record<PanelId, { title: string; body: string; action: string }> = {
  overview: {
    title: 'Overview',
    body: 'Release 4 is on track for Friday. Two API blockers remain.',
    action: 'Open board',
  },
  activity: {
    title: 'Activity',
    body: 'Mona Kane merged 6 pull requests and closed 3 issues this week.',
    action: 'See all activity',
  },
  members: {
    title: 'Members',
    body: '12 people have access to this project, 3 of them as owners.',
    action: 'Manage access',
  },
};

export const ProjectTabs = () => {
  const [selectedValue, setSelectedValue] = React.useState<TabValue>('overview');

  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  const activePanel = panels[selectedValue as PanelId];

  return (
    <Tabs selectedValue={selectedValue} onTabSelect={onTabSelect}>
      <TabList>
        <Tab value="overview" id="tab-overview">
          Overview
        </Tab>
        <Tab value="activity" id="tab-activity">
          Activity
        </Tab>
        <Tab value="members" id="tab-members">
          Members
        </Tab>
      </TabList>

      {/* Exactly one panel is rendered and it points at the currently selected tab. */}
      <div
        role="tabpanel"
        id={`panel-${String(selectedValue)}`}
        aria-labelledby={`tab-${String(selectedValue)}`}
        tabIndex={0}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          paddingTop: '16px',
          maxWidth: '480px',
        }}
      >
        <Text size={500} weight="semibold">
          {activePanel.title}
        </Text>
        <Text>{activePanel.body}</Text>
        <div>
          <Button appearance="primary">{activePanel.action}</Button>
        </div>
      </div>
    </Tabs>
  );
};
```

### Standalone tab lists: appearances, sizes, activation model

Four uncontrolled TabList variants covering every appearance and size, a disabled tab, and explicit manual activation with selectTabOnFocus.

```tsx
import * as React from 'react';
import {
  Tab,
  TabList,
  type SelectTabData,
  type SelectTabEvent,
} from '@fluentui/react-components';

const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
  // The list owns its own selection; this handler is only for side effects.
  console.log(`Selected tab: ${data.value}`);
};

export const TabListVariants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <TabList defaultSelectedValue="files" appearance="transparent" size="small" onTabSelect={onTabSelect}>
      <Tab value="files">Files</Tab>
      <Tab value="shared">Shared</Tab>
      <Tab value="deleted" disabled>
        Deleted
      </Tab>
    </TabList>

    <TabList defaultSelectedValue="files" appearance="subtle" size="medium">
      <Tab value="files">Files</Tab>
      <Tab value="shared">Shared</Tab>
      <Tab value="deleted" disabled>
        Deleted
      </Tab>
    </TabList>

    {/* Segmented-control look; space for the selected indicator is not reserved. */}
    <TabList
      defaultSelectedValue="files"
      appearance="subtle-circular"
      reserveSelectedTabSpace={false}
    >
      <Tab value="files">Files</Tab>
      <Tab value="shared">Shared</Tab>
      <Tab value="deleted" disabled>
        Deleted
      </Tab>
    </TabList>

    <TabList defaultSelectedValue="files" appearance="filled-circular" size="large">
      <Tab value="files">Files</Tab>
      <Tab value="shared">Shared</Tab>
      <Tab value="deleted" disabled>
        Deleted
      </Tab>
    </TabList>

    {/* Manual activation: arrow keys move focus, Enter or Space selects the tab. */}
    <TabList defaultSelectedValue="files" vertical selectTabOnFocus={false}>
      <Tab value="files">Files</Tab>
      <Tab value="shared">Shared</Tab>
      <Tab value="deleted" disabled>
        Deleted
      </Tab>
    </TabList>
  </div>
);
```

### Vertical side-tab settings with data-driven tabs

Tabs rendered from an array inside a vertical Tabs wrapper, with a panel that swaps content per section and composes Badge and Text.

```tsx
import * as React from 'react';
import {
  Badge,
  Tab,
  TabList,
  Tabs,
  Text,
  type SelectTabData,
  type SelectTabEvent,
  type TabValue,
} from '@fluentui/react-components';

const sections = [
  { value: 'profile', label: 'Profile' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'billing', label: 'Billing' },
] as const;

export const AccountSettingsTabs = () => {
  const [selectedValue, setSelectedValue] = React.useState<TabValue>('profile');

  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  const currentLabel = sections.find(section => section.value === selectedValue)?.label;

  return (
    <Tabs vertical selectedValue={selectedValue} onTabSelect={onTabSelect}>
      <TabList>
        {sections.map(section => (
          <Tab key={section.value} value={section.value} id={`tab-${section.value}`}>
            {section.label}
          </Tab>
        ))}
      </TabList>

      <div
        role="tabpanel"
        aria-labelledby={`tab-${String(selectedValue)}`}
        tabIndex={0}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          paddingLeft: '24px',
          maxWidth: '420px',
        }}
      >
        {selectedValue === 'billing' ? (
          <>
            <Text size={400} weight="semibold">
              Billing
            </Text>
            <Badge appearance="tint" color="warning" shape="rounded">
              Payment past due
            </Badge>
            <Text>Update your card to keep this workspace active.</Text>
          </>
        ) : (
          <Text size={400} weight="semibold">
            {currentLabel} settings
          </Text>
        )}
      </div>
    </Tabs>
  );
};
```

### Wizard steps driven by tab selection

Controlled tabs used as wizard steps: Back/Next buttons change selectedValue programmatically, and each panel renders its own Field and Input.

```tsx
import * as React from 'react';
import {
  Button,
  Field,
  Input,
  Tab,
  TabList,
  Tabs,
  Text,
  type SelectTabData,
  type SelectTabEvent,
  type TabValue,
} from '@fluentui/react-components';

const steps = ['account', 'profile', 'review'] as const;
type Step = (typeof steps)[number];

export const SignupWizard = () => {
  const [step, setStep] = React.useState<TabValue>(steps[0]);
  const stepIndex = steps.indexOf(step as Step);

  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    setStep(data.value);
  };

  const goTo = (index: number) => {
    const next = Math.min(Math.max(index, 0), steps.length - 1);
    setStep(steps[next]);
  };

  return (
    <Tabs selectedValue={step} onTabSelect={onTabSelect}>
      <TabList>
        <Tab value="account" id="tab-account">
          Account
        </Tab>
        <Tab value="profile" id="tab-profile">
          Profile
        </Tab>
        <Tab value="review" id="tab-review">
          Review
        </Tab>
      </TabList>

      <div
        role="tabpanel"
        aria-labelledby={`tab-${String(step)}`}
        tabIndex={0}
        style={{ display: 'grid', gap: '16px', paddingTop: '16px', maxWidth: '360px' }}
      >
        {step === 'account' && (
          <Field label="Work email" required hint="We use this to create your workspace.">
            <Input type="email" placeholder="you@contoso.com" />
          </Field>
        )}
        {step === 'profile' && (
          <Field label="Display name" required>
            <Input placeholder="Mona Kane" />
          </Field>
        )}
        {step === 'review' && (
          <Text>Review your details, then finish to create the workspace.</Text>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            appearance="secondary"
            disabled={stepIndex === 0}
            onClick={() => goTo(stepIndex - 1)}
          >
            Back
          </Button>
          <Button
            appearance="primary"
            disabled={stepIndex === steps.length - 1}
            onClick={() => goTo(stepIndex + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </Tabs>
  );
};
```

## Pitfalls

- Setting selection props on both Tabs and the inner TabList (e.g. selectedValue on Tabs and defaultSelectedValue on TabList). This creates two sources of truth and Fluent logs a development warning — put selection state in exactly one place, on the wrapper when panels are involved.
- Rendering a panel without role="tabpanel" plus aria-labelledby pointing at the selected tab's id. The tabs still work with a mouse, but screen reader users lose the connection between the tab and its content. Give every Tab a stable id and reference it from the panel.
- Hooking onClick on Tab or adding custom arrow-key handlers to change selection. Tab's activation is owned by TabList (including keyboard selection and the roving tabindex); a manual click handler runs on top of that and desynchronizes the selected value from the panel you render. Use onTabSelect instead.
- Reusing or duplicating value props (for example using the array index as the value). Values must be unique and stable within a TabList; duplicates break tab registration and selection, and index-based values break when the list is filtered or reordered.
- Unmounting panels that hold user input. Switching tabs destroys the field state unless you keep the panels mounted and toggle visibility (or lift the state above the tabs). The opposite mistake — keeping every heavy panel mounted — is also costly, so decide per panel.
- Leaving tabIndex={0} on a tabpanel that already contains focusable controls, which adds a redundant, empty tab stop before the panel content. Only make a panel focusable when it has no interactive children.
- Using tabs as the primary navigation for routes or as a menu of actions. Tabs are for peer views in place; navigating away belongs in Nav, Breadcrumb, or Link, and action lists belong in Menu — otherwise the tab semantics (and back-button behavior) mislead users.
- Gating a wizard or form with disabled tabs instead of validation. Disabled tabs are removed from the keyboard flow and hide the reason they are unavailable; keep tabs enabled and validate on the Next button, or show the reason inline.

## Accessibility

Fluent's TabList implements the ARIA Authoring Practices tabs pattern out of the box: the list gets role="tablist", each Tab renders a real button with role="tab" and a roving tabindex so only the selected tab is in the page tab order, and Left/Right (Up/Down when vertical) plus Home/End move between tabs. Choose the activation model deliberately with selectTabOnFocus: manual activation (arrow keys move focus, Enter/Space selects — safest for panels that are expensive to load or that trigger requests) or automatic activation (selection follows focus — fewer keystrokes, but every arrow key press fires your onTabSelect). Each Tab needs a unique, meaningful value and, when you render panels, a stable id; the panel must carry role="tabpanel", an id, and aria-labelledby pointing at the selected tab's id so screen readers announce the relationship. Add tabIndex={0} to the panel only when it has no focusable children; when it does, leave it out so keyboard users are not forced through an extra empty tab stop. Never move focus into the panel automatically on selection — focus should stay on the tab, and the panel change is conveyed by the tab/tabpanel association. Icons-only tabs are not supported by the tab label alone, so always provide a text label (or an accessible name) rather than color or position alone. If you use color or weight to signal the selected tab, pair it with the built-in selected indicator so the state is not conveyed by color alone. When the whole set is disabled or unavailable, use disabled on the list rather than swallowing clicks silently.

## Components used

- [Tabs](../../components/tabs.md)
- [Text](../../components/text.md)
- [Button](../../components/button.md)
- [Badge](../../components/badge.md)
- [Field](../../components/field.md)
- [Input](../../components/input.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
