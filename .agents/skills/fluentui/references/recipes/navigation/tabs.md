# Tabs

> **Group**: navigation

## Goal

Build an accessible, theme-aware tabbed interface in Fluent UI React v9 using TabList and Tab, including controlled and uncontrolled selection, vertical tab strips, icon and badge composition inside tabs, and correctly wired role="tabpanel" content panels.

## When to Use

Use this recipe when users switch between a small, fixed set of peer views inside the same page context — settings sections, detail panes, mailbox filters, dashboard views — and you want the built-in ARIA tablist semantics, roving tabindex, arrow-key navigation and Enter/Space activation for free. It is also the right choice when the tab strip should be visually integrated with Fluent controls (icons, CounterBadge, size/appearance alignment with Field, Input, Switch, Button) and when selection state must be driven by your own component state or router.

## When Not to Use

Do not use TabList for primary site or route navigation (Tab renders a button and holds no URL state — use Nav/NavItem with href, Breadcrumb or Link instead). Do not use it for sequential wizard steps (use a Dialog flow or a stepper pattern), for showing two views at once (use a side-by-side layout with Card), or for collapsible page sections (use Accordion). Avoid tabs when the number of sections is large or dynamic, because TabList has no built-in overflow menu — switch to a vertical NavDrawer, a Menu, or a Dropdown driven view switcher when the list can overflow or the sections become deeply nested.

## What this recipe builds

A tabbed interface that switches between a small, fixed set of peer views in the same page context. `TabList` supplies the ARIA `tablist` semantics, roving tabindex and arrow-key navigation; `Tab` is the selectable item; you supply the `tabpanel` content matched to the selected value.

## Minimal composition

```tsx
import * as React from 'react';
import { Tab, TabList } from '@fluentui/react-components';

export const MinimalTabs = () => (
  <TabList defaultSelectedValue="inbox" aria-label="Mailbox views">
    <Tab value="inbox">Inbox</Tab>
    <Tab value="drafts">Drafts</Tab>
    <Tab value="sent">Sent</Tab>
  </TabList>
);
```

Rules of thumb:

- `value` is required on every `Tab` and must be unique inside the list; `TabList` tracks selection by value.
- Add `aria-label` (or point `aria-labelledby` at a heading) when the tab strip has no visible label.
- Do not re-implement keyboard handling. `TabList` already provides roving tabindex, Left/Right arrows, Home/End and Enter/Space activation; adding `tabIndex` to individual `Tab`s breaks it.

## Selection: uncontrolled vs controlled

Uncontrolled — let `TabList` own the state and observe changes:

```tsx
<TabList defaultSelectedValue="inbox" onTabSelect={(_, data) => track(data.value)}>
```

Controlled — own the state and feed it back:

```tsx
const [selectedValue, setSelectedValue] = React.useState<MailboxTab>('inbox');

<TabList
  selectedValue={selectedValue}
  onTabSelect={(_, data) => setSelectedValue(data.value as MailboxTab)}
>
```

`data.value` is typed `unknown` because `Tab.value` is `unknown`; cast it to your string-literal union so comparisons and `switch` statements stay type-safe. Pass either `selectedValue` or `defaultSelectedValue`, never both — the default is ignored while a controlled value is present.

## Tab anatomy and slots

`Tab` exposes three slots: `root` (the focusable button), `icon` (rendered before the label) and `content` (children). Slot content stays inside the tab, so badges and icons live naturally next to the label:

```tsx
<Tab value="focused" icon={<InboxIcon />}>
  Focused
  <CounterBadge count={4} color="brand" />
</Tab>
```

Keep icons decorative: mark them `aria-hidden="true"` and `focusable="false"` so screen readers do not announce redundant names, and give the badge text an accessible equivalent when the count matters.

## Sizing, appearance and orientation

- `vertical` — stack the tabs; arrow keys become Up/Down. Set it whenever tabs are visually stacked so the keyboard model matches the layout.
- `size="small" | "medium" | "large"` — align with other Fluent controls on the same surface.
- `appearance` — `transparent` (default underline), `subtle`, `subtle-circular` (sidebar style), `filled-circular` (segmented-control style).
- `disabled` on `TabList` disables the whole strip; `disabled` on `Tab` removes a single tab from the keyboard sequence.
- `reserveSelectedTabSpace` — reserve room for the selected indicator so labels do not shift when selection changes.
- `selectTabOnFocus` — automatic activation (selection follows focus per WAI-ARIA). Leave it off for expensive panels so users can browse with arrows and commit with Enter/Space.

## Wiring up panels

`TabList` renders only the tab strip; the panels are yours. Make each `Tab` and panel a matched pair:

- give each `Tab` an `id` and, when the panel is always mounted, an `aria-controls`;
- give each panel `role="tabpanel"`, an `id`, `aria-labelledby` pointing at its tab, and `tabIndex={0}` when the panel has no naturally focusable content.

Keep panels mounted and hide inactive ones with `hidden` when they are cheap to render:

```tsx
<Tab value="overview" id="tab-overview" aria-controls="panel-overview">Overview</Tab>

<div
  role="tabpanel"
  id="panel-overview"
  aria-labelledby="tab-overview"
  tabIndex={0}
  hidden={selectedValue !== 'overview'}
>
  ...panel content...
</div>
```

Mount only the active panel when panels are expensive (data grids, charts). In that case keep `aria-labelledby` but drop `aria-controls`, because it must never point at an element that is not in the DOM.

## Common compositions

- **Vertical tabs + settings form** — a `TabList vertical` on the left, a panel on the right composed from `Field`, `Input`, `Switch`, `Checkbox` and `Button`. Fluent controls pick up the `Field` label automatically through field context.
- **Counts and status** — a `CounterBadge` inside the tab content shows unread or pending counts without a second column of metadata.
- **Routing** — derive `selectedValue` from the current route and navigate inside `onTabSelect`; never let the tab strip be the only source of truth. For primary page navigation prefer `Nav`/`NavItem` with `href` or `Link`.

## Accessibility checklist

1. Label every `TabList` (`aria-label` or `aria-labelledby`).
2. Give every `Tab` a unique `value`; give every panel `role="tabpanel"`, `id` and `aria-labelledby`.
3. Panels without focusable children get `tabIndex={0}` so keyboard users can reach the content region.
4. Announce or move focus deliberately when the panel swaps (for example focus the panel heading) rather than relying on the DOM replacement.
5. Do not nest interactive controls inside a `Tab` (other than text and non-interactive badges); put actions in the panel.
6. Disabled tabs are skipped by keyboard navigation — avoid disabling the only route to important content.

## Styling notes

`TabList` and `Tab` read color, typography and focus styling from the theme, so theme the application with `FluentProvider` instead of overriding colors. Use inline `style` objects or your own styling solution for layout only (flex row, gap, panel padding). `reserveSelectedTabSpace` covers the most common layout jitter (indicator/weight changes) for you.

## Examples

### Basic controlled tabs with accessible panels

A fully controlled three-tab interface that keeps all panels mounted, hides inactive ones with `hidden`, and wires `id` / `aria-controls` / `aria-labelledby` so tabs and panels form matched pairs.

```tsx
import * as React from 'react';
import { Tab, TabList, Text } from '@fluentui/react-components';

type PanelId = 'overview' | 'activity' | 'settings';

const panelStyles: React.CSSProperties = {
  paddingTop: '16px',
  outline: 'none',
};

export const BasicTabPanels: React.FC = () => {
  const [selectedValue, setSelectedValue] = React.useState<PanelId>('overview');

  return (
    <div>
      <TabList
        selectedValue={selectedValue}
        reserveSelectedTabSpace
        onTabSelect={(_, data) => setSelectedValue(data.value as PanelId)}
      >
        <Tab value="overview" id="tab-overview" aria-controls="panel-overview">
          Overview
        </Tab>
        <Tab value="activity" id="tab-activity" aria-controls="panel-activity">
          Activity
        </Tab>
        <Tab value="settings" id="tab-settings" aria-controls="panel-settings">
          Settings
        </Tab>
      </TabList>

      <div
        role="tabpanel"
        id="panel-overview"
        aria-labelledby="tab-overview"
        tabIndex={0}
        hidden={selectedValue !== 'overview'}
        style={panelStyles}
      >
        <Text block>
          Overview summarizes workspace health and the most recent deployments.
        </Text>
      </div>

      <div
        role="tabpanel"
        id="panel-activity"
        aria-labelledby="tab-activity"
        tabIndex={0}
        hidden={selectedValue !== 'activity'}
        style={panelStyles}
      >
        <Text block>
          Activity lists who changed what and when, newest first.
        </Text>
      </div>

      <div
        role="tabpanel"
        id="panel-settings"
        aria-labelledby="tab-settings"
        tabIndex={0}
        hidden={selectedValue !== 'settings'}
        style={panelStyles}
      >
        <Text block>
          Settings holds the workspace name, retention rules and integrations.
        </Text>
      </div>
    </div>
  );
};
```

### Vertical tabs driving a settings form

A vertical, sidebar-style `TabList` (`size="large"`, `appearance="subtle-circular"`) with icons in the `icon` slot. Only the active panel is mounted, composed from Field, Input, Switch, Checkbox and Button.

```tsx
import * as React from 'react';
import {
  Button,
  Checkbox,
  Field,
  Input,
  Switch,
  Tab,
  TabList,
  Text,
} from '@fluentui/react-components';

type SettingsSection = 'profile' | 'notifications' | 'privacy';

const ProfileIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <circle cx="10" cy="6" r="3.5" fill="currentColor" />
    <path d="M2.5 17c0-3.6 3.4-5.5 7.5-5.5s7.5 1.9 7.5 5.5v1h-15v-1z" fill="currentColor" />
  </svg>
);

const BellIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path
      d="M10 2a5 5 0 0 0-5 5v3.5L3.5 13h13L15 10.5V7a5 5 0 0 0-5-5z"
      fill="currentColor"
    />
    <circle cx="10" cy="16" r="2" fill="currentColor" />
  </svg>
);

const ShieldIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path
      d="M10 2l6 2.5v5C16 13.4 13.6 16.4 10 18c-3.6-1.6-6-4.6-6-8.5v-5L10 2z"
      fill="currentColor"
    />
  </svg>
);

export const VerticalSettingsTabs: React.FC = () => {
  const [selectedValue, setSelectedValue] = React.useState<SettingsSection>('profile');

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
      <TabList
        vertical
        size="large"
        appearance="subtle-circular"
        aria-label="Settings sections"
        selectedValue={selectedValue}
        onTabSelect={(_, data) => setSelectedValue(data.value as SettingsSection)}
      >
        <Tab value="profile" icon={<ProfileIcon />}>
          Profile
        </Tab>
        <Tab value="notifications" icon={<BellIcon />}>
          Notifications
        </Tab>
        <Tab value="privacy" icon={<ShieldIcon />}>
          Privacy
        </Tab>
      </TabList>

      <div style={{ flex: 1, minWidth: 0 }}>
        {selectedValue === 'profile' && (
          <div
            role="tabpanel"
            aria-labelledby="tab-profile"
            style={{ display: 'grid', gap: '16px', maxWidth: '360px' }}
          >
            <Field label="Display name" hint="Shown to other members of the workspace.">
              <Input defaultValue="Ada Lovelace" />
            </Field>
            <Field label="Job title">
              <Input defaultValue="Engineer" />
            </Field>
            <Button appearance="primary">Save profile</Button>
          </div>
        )}

        {selectedValue === 'notifications' && (
          <div
            role="tabpanel"
            aria-labelledby="tab-notifications"
            style={{ display: 'grid', gap: '12px', maxWidth: '360px' }}
          >
            <Switch label="Email notifications" defaultChecked />
            <Switch label="Mobile push" />
            <Checkbox label="Weekly product digest" defaultChecked />
            <Text size={200}>Notification changes are applied immediately.</Text>
          </div>
        )}

        {selectedValue === 'privacy' && (
          <div
            role="tabpanel"
            aria-labelledby="tab-privacy"
            style={{ display: 'grid', gap: '12px', maxWidth: '360px' }}
          >
            <Checkbox label="Allow product analytics" />
            <Checkbox label="Share crash reports" defaultChecked />
            <Button>Download my data</Button>
          </div>
        )}
      </div>
    </div>
  );
};
```

### Data-driven tabs with badges and a disabled tab

Tabs generated from a config array, using an uncontrolled `defaultSelectedValue` plus `onTabSelect` for observation, a `CounterBadge` inside the tab content for unread counts, and a disabled tab that is skipped by keyboard navigation.

```tsx
import * as React from 'react';
import { CounterBadge, Tab, TabList, Text } from '@fluentui/react-components';

type MailboxTab = {
  value: string;
  label: string;
  unread?: number;
  disabled?: boolean;
};

const mailboxTabs: MailboxTab[] = [
  { value: 'focused', label: 'Focused', unread: 4 },
  { value: 'other', label: 'Other' },
  { value: 'archive', label: 'Archive', disabled: true },
];

export const MailboxTabs: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState<string>('focused');

  return (
    <div>
      <TabList
        defaultSelectedValue="focused"
        reserveSelectedTabSpace
        onTabSelect={(_, data) => setSelectedTab(data.value as string)}
      >
        {mailboxTabs.map((tab) => (
          <Tab key={tab.value} value={tab.value} disabled={tab.disabled}>
            {tab.label}
            {typeof tab.unread === 'number' && tab.unread > 0 ? (
              <CounterBadge
                count={tab.unread}
                color="brand"
                appearance="filled"
                style={{ marginInlineStart: '8px' }}
              />
            ) : null}
          </Tab>
        ))}
      </TabList>

      <Text block style={{ paddingTop: '12px' }}>
        Viewing the {selectedTab} mailbox.
      </Text>
    </div>
  );
};
```

## Pitfalls

- Missing or duplicate `Tab value`. `value` is required on every `Tab` and must be unique inside a `TabList`; duplicates make selection ambiguous (several tabs can look selected) and break the roving tabindex. Avoid array indexes as values — selection drifts when the list is reordered.
- Controlled list with read-only state. Passing `selectedValue` without updating it inside `onTabSelect` freezes the tabs, and passing `defaultSelectedValue` alongside `selectedValue` is silently ignored. Choose controlled or uncontrolled and stay consistent.
- Leaving `data.value` as `unknown`. `Tab.value` is typed `unknown`, so cast it (`data.value as MyTabValue`) before storing it in state; otherwise comparisons and `switch` statements become loosely typed and exhaustive checks disappear.
- Forgetting panel semantics. Without `role="tabpanel"`, a matching `id`/`aria-labelledby`, and `tabIndex={0}` on panels with no focusable content, screen reader users get a tablist that controls nothing and keyboard users cannot reach the panel body.
- Dangling `aria-controls`. If inactive panels are unmounted, an `aria-controls` reference points at an element that no longer exists. Use `aria-controls` only with the always-mounted-plus-`hidden` pattern; with conditional rendering keep just `aria-labelledby`.
- Stacking tabs visually without `vertical`. Arrow keys stay Left/Right, so the keyboard model contradicts the layout. Add `vertical` to `TabList` whenever the tabs are displayed in a column.
- Wrapping `Tab` elements in extra `div`s or fragments for styling. The collection-based keyboard handling expects tabs to be direct children of the list; use the `icon` and `content` slots plus `style`/CSS on the tabs instead.
- Using tabs for page navigation. `Tab` renders a button and keeps no URL state, so browser back/forward and deep links break. Use `Nav`/`NavItem` with `href` or `Link` for primary navigation, or drive your router inside `onTabSelect` and derive `selectedValue` from the route.
- Ignoring layout shift. Selecting a tab can change indicator thickness and font weight; add `reserveSelectedTabSpace` to avoid the tab strip jumping on selection.

## Accessibility

TabList and Tab already provide the ARIA `tablist`/`tab` roles, roving tabindex, `aria-selected`, arrow-key navigation and Enter/Space activation — do not add tabIndex to individual tabs or re-implement arrow handling. Your responsibilities: (1) label the list with `aria-label` or `aria-labelledby` when no visible heading exists; (2) mark each panel with `role="tabpanel"`, an `id`, and `aria-labelledby` pointing at its tab's `id`; add `tabIndex={0}` when the panel contains no focusable elements so keyboard users can reach the content; (3) keep `aria-controls` valid — only use it when the panel is always mounted (the `hidden` approach), never when panels are conditionally unmounted; (4) mark decorative SVG icons inside the `icon` slot with `aria-hidden="true"` and `focusable="false"`, and give badge counts a text equivalent when the number is meaningful; (5) default activation is manual (arrows move focus, Enter/Space selects) — enable `selectTabOnFocus` only for instant panels, and when the panel changes, move focus or announce the change deliberately (for example to the panel heading) instead of relying on the DOM swap; (6) disabled tabs are removed from the keyboard sequence, so avoid disabling the only path to important content — prefer an enabled tab with an empty state; (7) ensure the selected indicator and badge colors keep sufficient contrast by theming through FluentProvider rather than overriding colors; (8) set `FluentProvider dir` for RTL layouts so direction-dependent layout and navigation behave correctly.

## Components used

- [Tab](../../components/tab.md)
- [TabList](../../components/tab-list.md)
- [Text](../../components/text.md)
- [CounterBadge](../../components/counter-badge.md)
- [Field](../../components/field.md)
- [Input](../../components/input.md)
- [Switch](../../components/switch.md)
- [Checkbox](../../components/checkbox.md)
- [Button](../../components/button.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
