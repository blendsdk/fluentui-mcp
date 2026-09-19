# Dashboard Shell

> **Group**: layout

## Goal

Build a responsive, themeable dashboard shell in Fluent UI React v9: a full-width app bar, a collapsible side navigation built with Nav, a single scrolling content canvas with a breadcrumb + Toolbar page header and a fluid Card grid, plus Dialog/Drawer surfaces and loading, empty, and error states for every widget.

## When to Use

Use this recipe for internal tools, admin consoles, and analytics products where users move between several persistent destinations, need global search/alerts/account actions in a header, and consume a scrollable canvas of cards, tables, and detail panes. It is also the right base when the same shell must adapt from a persistent desktop sidebar to an overlay navigation pane on narrow screens, and when every widget has to render loading, empty, error, and ready states.

## When Not to Use

Do not reach for a shell when the app has a single view with no cross-navigation: render a Card or Field layout directly on the page instead. Do not use it for marketing or content pages where a simple header plus content column is enough. If the page is essentially one big data grid, start from the Table recipe and add only a minimal header. If the task is a settings form, use Dialog + Field rather than a shell. Finally, if your product needs full app chrome with routing, auth guards, and theming bootstrapped for you, start from the Fluent UI app template and drop these regions into it.

A dashboard shell is the persistent frame that stays on screen while the user moves between views. It has four stable regions and one scroll container:

- **App bar** (`<header>`, full width): brand, global search, alerts, account menu.
- **Side navigation** (`<aside>`): primary destinations rendered with `Nav`; hidden below the nav breakpoint and opened as an overlay instead.
- **Content canvas** (`<main>`): the only scroll container. Holds the page header (breadcrumb + title + `Toolbar`) and the widget grid.
- **Transient surfaces**: `Dialog` for blocking edits and destructive confirmations, `Drawer` for side detail panes, `MessageBar` for inline status.

Wrap the whole thing in your app's `FluentProvider` (theme + `dir`) so `tokens` resolve and the shell mirrors correctly in RTL.

## 1. Root layout: one grid, one scroll container

```tsx
const useStyles = makeStyles({
  shell: {
    display: 'grid',
    gridTemplateColumns: '264px 1fr',
    gridTemplateRows: 'auto 1fr',
    gridTemplateAreas: '"header header" "nav main"',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
      gridTemplateAreas: '"header" "main"',
    },
  },
  header: { gridArea: 'header', backgroundColor: tokens.colorNeutralBackground1 },
  nav: {
    gridArea: 'nav',
    overflowY: 'auto',
    '@media (max-width: 900px)': { display: 'none' },
  },
  main: { gridArea: 'main', overflowY: 'auto', minHeight: 0 },
});
```

Key points:

- `gridTemplateRows: 'auto 1fr'` gives the app bar its intrinsic height and lets the canvas take the rest.
- `overflowY: 'auto'` **plus** `minHeight: 0` on the canvas. Grid items default to `min-height: auto`, so without this the row grows with content and the entire document scrolls instead of the canvas - the classic broken-app-shell bug.
- Every color, gap, and radius comes from `tokens`, so the shell follows the active theme for free.
- Define `makeStyles` at module scope, never inside the render function.

## 2. App bar

A flex row: brand block, search field, a flexible spacer, then trailing actions.

```tsx
<header className={styles.header}>
  <Avatar name='Contoso' shape='square' size={32} color='brand' />
  <Text weight='semibold'>Contoso Analytics</Text>
  <div className={styles.search}>
    <Input appearance='filled-darker' placeholder='Search dashboards' />
  </div>
  <div className={styles.spacer} />
  <Tooltip content='3 unread alerts' relationship='description'>
    <Button appearance='subtle'>
      Alerts
      <Badge appearance='filled' color='danger' size='small'>3</Badge>
    </Button>
  </Tooltip>
  <Menu>
    <MenuTrigger disableButtonEnhancement>
      <Button appearance='transparent' aria-label='Account and settings'>
        <Avatar name='Adele Vance' size={28} />
      </Button>
    </MenuTrigger>
    <MenuPopover>
      <MenuList>
        <MenuItem>Profile</MenuItem>
        <MenuDivider />
        <MenuItem>Sign out</MenuItem>
      </MenuList>
    </MenuPopover>
  </Menu>
</header>
```

Rules of thumb: give every icon-only `Button` an `aria-label`, wrap it in a `Tooltip` with `relationship='description'` (or `relationship='label'` when the tooltip is the only label), and always pair badge color with text or a number. `disableButtonEnhancement` on `MenuTrigger` stops the trigger button from gaining a chevron it does not need.

## 3. Side navigation

```tsx
<Nav
  selectedValue={selectedNav}
  onNavItemSelect={(_, data) => setSelectedNav(data.value)}
  defaultOpenCategories={['reports']}
>
  <NavItem value='overview'>Overview</NavItem>
  <NavCategory value='reports'>
    <NavCategoryItem>Reports</NavCategoryItem>
    <NavSubItemGroup>
      <NavSubItem value='reports-daily'>Daily</NavSubItem>
      <NavSubItem value='reports-monthly'>Monthly</NavSubItem>
    </NavSubItemGroup>
  </NavCategory>
</Nav>
```

- Drive `selectedValue` from the router so deep links and back/forward stay in sync.
- Keep category expansion uncontrolled with `defaultOpenCategories` unless you persist expansion in user preferences.
- Below your nav breakpoint, render the exact same `Nav` inside `NavDrawer` or `Drawer type='overlay'`. Hide the inline pane with CSS `display: none` rather than unmounting it, so only one navigation landmark and one set of tab stops is ever exposed.

## 4. Page header: breadcrumb, title, actions

```tsx
<Breadcrumb>
  <BreadcrumbItem><BreadcrumbButton>Workspace</BreadcrumbButton></BreadcrumbItem>
  <BreadcrumbDivider />
  <BreadcrumbItem><BreadcrumbButton current>Overview</BreadcrumbButton></BreadcrumbItem>
</Breadcrumb>
<Text size={800} weight='semibold'>Overview</Text>
<Toolbar>
  <ToolbarButton onClick={refresh}>Refresh</ToolbarButton>
  <ToolbarDivider />
  <ToolbarButton>Export</ToolbarButton>
  <ToolbarButton appearance='primary'>New report</ToolbarButton>
</Toolbar>
```

`current` on the last `BreadcrumbButton` emits `aria-current='page'`. Render the page title inside an `h1` in your app and use `Text size={800} weight='semibold'` for its visual weight, so the document outline stays correct. Put the primary action last (right-most in LTR) and keep secondary actions `subtle` or `secondary`.

## 5. Content canvas

```tsx
cardGrid: {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: tokens.spacingHorizontalM,
}
```

`auto-fit` + `minmax` gives a fluid metric grid with no media queries. Each KPI is a `Card` whose `CardHeader` uses the `header`, `description`, and `action` slots; the metric value and the trend `Badge` live in the card body. Long-form panels use `Card appearance='outline'` with a `CardHeader` (whose `action` is a see-all `Button`), a `Divider`, then rows of content or skeleton rows.

## 6. Editing and confirming: Dialog vs Drawer

Use `Dialog` for short, blocking work that should interrupt the user (edit form, destructive confirmation) and `Drawer` for context-preserving detail panes.

```tsx
<Dialog open={editing !== null} onOpenChange={(_, data) => { if (!data.open) closeEditor(); }}>
  <DialogSurface>
    <DialogBody>
      <DialogTitle>Edit report</DialogTitle>
      <DialogContent className={styles.dialogContent}>{/* Field + Input + Select + Textarea */}</DialogContent>
      <DialogActions>
        <DialogTrigger disableButtonEnhancement>
          <Button appearance='secondary'>Cancel</Button>
        </DialogTrigger>
        <Button appearance='primary' disabled={!nameIsValid} onClick={save}>Save</Button>
      </DialogActions>
    </DialogBody>
  </DialogSurface>
</Dialog>
```

```tsx
<Drawer type='overlay' position='end' open={isOpen} onOpenChange={(_, { open }) => setIsOpen(open)}>
  <DrawerOverlay />
  <DrawerHeader>
    <DrawerHeaderTitle
      action={<Button appearance='subtle' aria-label='Close details' onClick={() => setIsOpen(false)}>Close</Button>}
    >
      Report details
    </DrawerHeaderTitle>
  </DrawerHeader>
  <DrawerBody>{/* the same form component the dialog renders */}</DrawerBody>
</Drawer>
```

Keep the form body in a small dedicated component so the same markup can be mounted in either surface. Validate with `Field` (`required`, `validationState`, `validationMessage`) and disable the save `Button` while the form is invalid. Destructive actions get their own dialog with an explicit verb on the button ('Delete', not 'OK').

## 7. Every widget has four states

A dashboard is a data-fetching surface, so design the states up front instead of bolting them on:

1. **Loading** - `Skeleton` + `SkeletonItem` shaped like the real content (circle for avatars, 16px bars for text, matching widths), with an `aria-label` on the `Skeleton`.
2. **Ready** - the real content, revealed by swapping the branch.
3. **Empty** - a short explanation plus one primary `Button` ('Create a job'), never just an empty grid.
4. **Error** - `MessageBar intent='error'` with a `MessageBarTitle`, an explanation, and a `MessageBarActions` retry `Button`.

Use `MessageBar politeness='polite'` for success confirmations such as 'Saved' or 'Deleted' so screen readers hear the result without stealing focus.

## 8. Responsive behavior

Two breakpoints are usually enough: around `900px` collapse the side navigation (hide the inline pane, open an overlay pane instead), and around `600px` drop the global search field to an icon button and allow toolbar groups to wrap. Never fix the height of a card - let text wrap with `Text` sizes and use `Text truncate` for long single-line labels. Test with `dir='rtl'`: because spacing and color come from `shorthands` and `tokens`, the shell mirrors without extra CSS.

## 9. Checklist

- `FluentProvider` (theme + `dir`) wraps the app root.
- Exactly one `header`, one `main`, and one visible `nav` landmark.
- Skip link to the canvas; visible on focus.
- One `h1` per view; breadcrumb last crumb is `current`.
- Icon-only buttons labelled; tooltips declare `relationship`.
- Scroll lives on the canvas (`overflowY: auto` + `minHeight: 0`).
- Every widget handles loading, empty, error, and ready.
- Destructive actions confirmed in their own dialog.
- Colors and spacing come from tokens only.

## Examples

### DashboardShell

Complete shell: app bar with search, alerts and account menu, a Nav sidebar with expandable categories, a breadcrumb + Toolbar page header, a fluid KPI Card grid, and a recent-activity panel that swaps Skeleton rows for real rows.

```tsx
import * as React from 'react';
import {
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Button,
  Card,
  CardHeader,
  Divider,
  Input,
  Link,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  MessageBar,
  MessageBarBody,
  Nav,
  NavCategory,
  NavCategoryItem,
  NavItem,
  NavSubItem,
  NavSubItemGroup,
  Skeleton,
  SkeletonItem,
  Text,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Tooltip,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';

type Trend = 'success' | 'danger' | 'informative';

type Stat = {
  label: string;
  value: string;
  delta: string;
  trend: Trend;
};

const stats: Stat[] = [
  { label: 'Active users', value: '12,480', delta: '+4.2%', trend: 'success' },
  { label: 'Reports run', value: '1,024', delta: '+9.8%', trend: 'success' },
  { label: 'Failed jobs', value: '7', delta: '+3', trend: 'danger' },
  { label: 'Average run time', value: '42s', delta: '-1.5s', trend: 'informative' },
];

type ActivityItem = {
  id: string;
  name: string;
  owner: string;
  when: string;
  status: string;
  trend: Trend;
};

const activity: ActivityItem[] = [
  { id: 'run-1', name: 'Quarterly revenue', owner: 'Adele Vance', when: '2 minutes ago', status: 'Succeeded', trend: 'success' },
  { id: 'run-2', name: 'Churn cohort', owner: 'Alex Wilber', when: '14 minutes ago', status: 'Running', trend: 'informative' },
  { id: 'run-3', name: 'Daily pipeline', owner: 'Megan Bowen', when: '1 hour ago', status: 'Failed', trend: 'danger' },
];

const useStyles = makeStyles({
  shell: {
    display: 'grid',
    gridTemplateColumns: '264px 1fr',
    gridTemplateRows: 'auto 1fr',
    gridTemplateAreas: '"header header" "nav main"',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
      gridTemplateAreas: '"header" "main"',
    },
  },
  header: {
    gridArea: 'header',
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalL),
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
    whiteSpace: 'nowrap',
  },
  search: {
    flexGrow: 1,
    maxWidth: '360px',
    '@media (max-width: 600px)': { display: 'none' },
  },
  spacer: { flexGrow: 1 },
  nav: {
    gridArea: 'nav',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    overflowY: 'auto',
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalS),
    '@media (max-width: 900px)': { display: 'none' },
  },
  main: {
    gridArea: 'main',
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalL,
    overflowY: 'auto',
    // Grid items default to min-height auto; without this the page scrolls as a whole.
    minHeight: 0,
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
  },
  pageHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    rowGap: tokens.spacingVerticalS,
    columnGap: tokens.spacingHorizontalM,
  },
  titleBlock: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXXS,
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: tokens.spacingHorizontalM,
  },
  statValue: {
    display: 'flex',
    alignItems: 'baseline',
    columnGap: tokens.spacingHorizontalS,
  },
  activityList: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
  },
  activityRow: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
  },
  activityText: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  skeletonRow: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
    ...shorthands.padding(tokens.spacingVerticalXS, 0),
  },
});

export const DashboardShell = () => {
  const styles = useStyles();
  const [selectedNav, setSelectedNav] = React.useState('overview');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsLoading(false), 1500);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Avatar name='Contoso' shape='square' size={32} color='brand' />
          <Text weight='semibold'>Contoso Analytics</Text>
        </div>
        <div className={styles.search}>
          <Input appearance='filled-darker' placeholder='Search dashboards' />
        </div>
        <div className={styles.spacer} />
        <Tooltip content='3 unread alerts' relationship='description'>
          <Button appearance='subtle'>
            Alerts
            <Badge appearance='filled' color='danger' size='small'>3</Badge>
          </Button>
        </Tooltip>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button appearance='transparent' aria-label='Account and settings'>
              <Avatar name='Adele Vance' size={28} />
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem>adelev@contoso.com</MenuItem>
              <MenuDivider />
              <MenuItem>Profile</MenuItem>
              <MenuItem>Preferences</MenuItem>
              <MenuDivider />
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </header>

      <aside className={styles.nav}>
        <Nav
          selectedValue={selectedNav}
          onNavItemSelect={(_, data) => setSelectedNav(data.value)}
          defaultOpenCategories={['reports']}
        >
          <NavItem value='overview'>Overview</NavItem>
          <NavItem value='activity'>Activity</NavItem>
          <NavCategory value='reports'>
            <NavCategoryItem>Reports</NavCategoryItem>
            <NavSubItemGroup>
              <NavSubItem value='reports-daily'>Daily</NavSubItem>
              <NavSubItem value='reports-monthly'>Monthly</NavSubItem>
            </NavSubItemGroup>
          </NavCategory>
          <NavCategory value='settings'>
            <NavCategoryItem>Settings</NavCategoryItem>
            <NavSubItemGroup>
              <NavSubItem value='settings-team'>Team</NavSubItem>
              <NavSubItem value='settings-billing'>Billing</NavSubItem>
            </NavSubItemGroup>
          </NavCategory>
        </Nav>
      </aside>

      <main className={styles.main}>
        <MessageBar intent='warning'>
          <MessageBarBody>
            Your trial ends in 5 days. <Link inline>Upgrade your plan</Link> to keep scheduled reports running.
          </MessageBarBody>
        </MessageBar>

        <div className={styles.pageHeader}>
          <div className={styles.titleBlock}>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbButton>Workspace</BreadcrumbButton>
              </BreadcrumbItem>
              <BreadcrumbDivider />
              <BreadcrumbItem>
                <BreadcrumbButton current>Overview</BreadcrumbButton>
              </BreadcrumbItem>
            </Breadcrumb>
            <Text size={800} weight='semibold'>Overview</Text>
            <Text size={200}>Updated a few seconds ago</Text>
          </div>
          <Toolbar>
            <ToolbarButton onClick={() => setIsLoading(true)}>Refresh</ToolbarButton>
            <ToolbarDivider />
            <ToolbarButton>Export</ToolbarButton>
            <ToolbarButton appearance='primary'>New report</ToolbarButton>
          </Toolbar>
        </div>

        <section className={styles.cardGrid} aria-label='Key metrics'>
          {stats.map(stat => (
            <Card key={stat.label} appearance='filled-alternative'>
              <CardHeader
                header={<Text weight='semibold'>{stat.label}</Text>}
                description={<Text size={200}>Last 7 days</Text>}
              />
              <div className={styles.statValue}>
                <Text size={700} weight='semibold'>{stat.value}</Text>
                <Badge appearance='tint' color={stat.trend}>{stat.delta}</Badge>
              </div>
            </Card>
          ))}
        </section>

        <Card appearance='outline'>
          <CardHeader
            header={<Text weight='semibold'>Recent activity</Text>}
            description={<Text size={200}>Latest runs across all workspaces</Text>}
            action={<Button appearance='subtle'>View all</Button>}
          />
          <Divider />
          {isLoading ? (
            <Skeleton aria-label='Loading recent activity'>
              {[0, 1, 2, 3].map(index => (
                <div key={index} className={styles.skeletonRow}>
                  <SkeletonItem shape='circle' size={32} />
                  <SkeletonItem size={16} width='40%' />
                  <div className={styles.spacer} />
                  <SkeletonItem size={16} width='80px' />
                </div>
              ))}
            </Skeleton>
          ) : (
            <ul className={styles.activityList}>
              {activity.map(item => (
                <li key={item.id} className={styles.activityRow}>
                  <Avatar name={item.owner} size={32} color='colorful' />
                  <span className={styles.activityText}>
                    <Text weight='semibold'>{item.name}</Text>
                    <Text size={200}>{item.owner} - {item.when}</Text>
                  </span>
                  <Badge appearance='tint' color={item.trend}>{item.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </main>
    </div>
  );
};

export default DashboardShell;
```

### DashboardRecordsWithEditAndDeleteDialogs

The content canvas of a shell: a Card grid of records where each card opens a controlled Dialog edit form (Field + Input + Select + Textarea + Switch) and a separate confirmation Dialog for deletion, with MessageBar feedback and an empty state.

```tsx
import * as React from 'react';
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Divider,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Select,
  Switch,
  Text,
  Textarea,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';

type ReportStatus = 'Active' | 'Paused' | 'Draft';

type ReportRecord = {
  id: string;
  name: string;
  owner: string;
  status: ReportStatus;
  notes: string;
};

const statusColor: Record<ReportStatus, 'success' | 'warning' | 'informative'> = {
  Active: 'success',
  Paused: 'warning',
  Draft: 'informative',
};

const initialRecords: ReportRecord[] = [
  { id: '1', name: 'Quarterly revenue', owner: 'Adele Vance', status: 'Active', notes: 'Scheduled every Monday at 06:00.' },
  { id: '2', name: 'Churn cohort', owner: 'Alex Wilber', status: 'Paused', notes: 'Paused while the warehouse migration is in flight.' },
  { id: '3', name: 'Onboarding funnel', owner: 'Megan Bowen', status: 'Draft', notes: 'Needs a shared definition of activated.' },
];

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalL,
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: tokens.spacingHorizontalM,
  },
  card: { rowGap: tokens.spacingVerticalS },
  cardActions: { display: 'flex', columnGap: tokens.spacingHorizontalS },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
});

export const DashboardRecords = () => {
  const styles = useStyles();
  const [records, setRecords] = React.useState<ReportRecord[]>(initialRecords);
  const [editing, setEditing] = React.useState<ReportRecord | null>(null);
  const [draft, setDraft] = React.useState<ReportRecord | null>(null);
  const [deleting, setDeleting] = React.useState<ReportRecord | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const openEditor = (record: ReportRecord) => {
    setMessage(null);
    setDraft({ ...record });
    setEditing(record);
  };

  const closeEditor = () => {
    setEditing(null);
    setDraft(null);
  };

  const nameIsValid = (draft?.name.trim().length ?? 0) > 0;

  const save = () => {
    if (!draft || !nameIsValid) {
      return;
    }
    const trimmed: ReportRecord = { ...draft, name: draft.name.trim() };
    setRecords(previous => previous.map(record => (record.id === trimmed.id ? trimmed : record)));
    setMessage(`Saved ${trimmed.name}.`);
    closeEditor();
  };

  const confirmDelete = () => {
    if (!deleting) {
      return;
    }
    setRecords(previous => previous.filter(record => record.id !== deleting.id));
    setMessage(`Deleted ${deleting.name}.`);
    setDeleting(null);
  };

  return (
    <div className={styles.root}>
      {message && (
        <MessageBar intent='success' politeness='polite'>
          <MessageBarBody>{message}</MessageBarBody>
        </MessageBar>
      )}

      {records.length === 0 ? (
        <Card appearance='filled-alternative'>
          <Text weight='semibold'>No reports yet</Text>
          <Text size={200}>Reports you create will show up here.</Text>
        </Card>
      ) : (
        <div className={styles.grid}>
          {records.map(record => (
            <Card key={record.id} appearance='outline' className={styles.card}>
              <CardHeader
                header={<Text weight='semibold'>{record.name}</Text>}
                description={<Text size={200}>Owner: {record.owner}</Text>}
                action={
                  <Badge appearance='tint' color={statusColor[record.status]}>
                    {record.status}
                  </Badge>
                }
              />
              <Text size={200}>{record.notes}</Text>
              <Divider />
              <div className={styles.cardActions}>
                <Button appearance='secondary' onClick={() => openEditor(record)}>
                  Edit
                </Button>
                <Button
                  appearance='subtle'
                  onClick={() => {
                    setMessage(null);
                    setDeleting(record);
                  }}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={editing !== null}
        onOpenChange={(_, data) => {
          if (!data.open) {
            closeEditor();
          }
        }}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Edit report</DialogTitle>
            <DialogContent className={styles.dialogContent}>
              <Field
                label='Name'
                required
                validationState={nameIsValid ? 'none' : 'error'}
                validationMessage={nameIsValid ? undefined : 'Enter a name for this report.'}
              >
                <Input
                  value={draft?.name ?? ''}
                  onChange={(_, data) =>
                    setDraft(current => (current ? { ...current, name: data.value } : current))
                  }
                />
              </Field>
              <Field label='Status'>
                <Select
                  value={draft?.status ?? 'Draft'}
                  onChange={(_, data) =>
                    setDraft(current =>
                      current ? { ...current, status: data.value as ReportStatus } : current,
                    )
                  }
                >
                  <option value='Active'>Active</option>
                  <option value='Paused'>Paused</option>
                  <option value='Draft'>Draft</option>
                </Select>
              </Field>
              <Field label='Notes' hint='Visible to everyone in the workspace.'>
                <Textarea
                  value={draft?.notes ?? ''}
                  resize='vertical'
                  onChange={(_, data) =>
                    setDraft(current => (current ? { ...current, notes: data.value } : current))
                  }
                />
              </Field>
              <Switch label='Notify the owner when this report changes' defaultChecked />
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance='secondary'>Cancel</Button>
              </DialogTrigger>
              <Button appearance='primary' disabled={!nameIsValid} onClick={save}>
                Save
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <Dialog
        open={deleting !== null}
        onOpenChange={(_, data) => {
          if (!data.open) {
            setDeleting(null);
          }
        }}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Delete report?</DialogTitle>
            <DialogContent>
              <Text>
                {deleting?.name} will be removed for everyone in the workspace. This action cannot be undone.
              </Text>
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance='secondary'>Cancel</Button>
              </DialogTrigger>
              <Button appearance='primary' onClick={confirmDelete}>
                Delete
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};

export default DashboardRecords;
```

### DashboardWidgetStates

A reusable dashboard widget that renders all four content states - loading with Skeleton and Spinner, error with MessageBar and a retry action, empty with a primary call to action, and ready with a metric grid - plus a small demo that switches between them.

```tsx
import * as React from 'react';
import {
  Button,
  Card,
  CardHeader,
  Divider,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarTitle,
  Skeleton,
  SkeletonItem,
  Spinner,
  Text,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';

type WidgetState = 'loading' | 'ready' | 'empty' | 'error';

type Metric = {
  label: string;
  value: string;
};

type DashboardWidgetProps = {
  title: string;
  description?: string;
  state: WidgetState;
  metrics?: Metric[];
  onRetry?: () => void;
  onCreate?: () => void;
};

const useStyles = makeStyles({
  page: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
  },
  switcher: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: tokens.spacingHorizontalS,
    rowGap: tokens.spacingVerticalS,
    marginBottom: tokens.spacingVerticalL,
  },
  widget: { rowGap: tokens.spacingVerticalM },
  skeleton: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
  },
  skeletonRow: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalM,
  },
  spacer: { flexGrow: 1 },
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: tokens.spacingHorizontalM,
    margin: 0,
  },
  metric: { display: 'flex', flexDirection: 'column' },
  metricValue: { margin: 0 },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    rowGap: tokens.spacingVerticalS,
    ...shorthands.padding(tokens.spacingVerticalM, 0),
  },
});

export const DashboardWidget = ({
  title,
  description,
  state,
  metrics = [],
  onRetry,
  onCreate,
}: DashboardWidgetProps) => {
  const styles = useStyles();

  return (
    <Card appearance='outline' className={styles.widget}>
      <CardHeader
        header={<Text weight='semibold'>{title}</Text>}
        description={description ? <Text size={200}>{description}</Text> : undefined}
        action={
          state === 'loading' ? (
            <Spinner size='tiny' label='Loading' labelPosition='after' />
          ) : undefined
        }
      />
      <Divider />

      {state === 'loading' && (
        <Skeleton aria-label={`Loading ${title}`} className={styles.skeleton}>
          {[0, 1, 2].map(row => (
            <div key={row} className={styles.skeletonRow}>
              <SkeletonItem size={16} width='30%' />
              <SkeletonItem size={16} width='18%' />
              <div className={styles.spacer} />
            </div>
          ))}
        </Skeleton>
      )}

      {state === 'error' && (
        <MessageBar intent='error'>
          <MessageBarBody>
            <MessageBarTitle>Could not load {title}</MessageBarTitle>
            The reporting service did not respond. Check your connection and try again.
          </MessageBarBody>
          <MessageBarActions>
            <Button appearance='secondary' onClick={onRetry}>
              Retry
            </Button>
          </MessageBarActions>
        </MessageBar>
      )}

      {state === 'empty' && (
        <div className={styles.empty}>
          <Text weight='semibold'>Nothing to show yet</Text>
          <Text size={200}>Metrics appear here as soon as your first job runs.</Text>
          <Button appearance='primary' onClick={onCreate}>
            Create a job
          </Button>
        </div>
      )}

      {state === 'ready' && (
        <dl className={styles.metrics}>
          {metrics.map(metric => (
            <div key={metric.label} className={styles.metric}>
              <dt>
                <Text size={200}>{metric.label}</Text>
              </dt>
              <dd className={styles.metricValue}>
                <Text size={600} weight='semibold'>{metric.value}</Text>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </Card>
  );
};

const metrics: Metric[] = [
  { label: 'Runs today', value: '148' },
  { label: 'Success rate', value: '99.2%' },
  { label: 'Average duration', value: '42s' },
];

const states: WidgetState[] = ['loading', 'ready', 'empty', 'error'];

export const DashboardWidgetStatesDemo = () => {
  const styles = useStyles();
  const [state, setState] = React.useState<WidgetState>('loading');
  const [attempt, setAttempt] = React.useState(0);

  React.useEffect(() => {
    if (state !== 'loading') {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setState(attempt % 2 === 0 ? 'ready' : 'error');
    }, 1500);
    return () => window.clearTimeout(timeoutId);
  }, [state, attempt]);

  const retry = () => {
    setAttempt(current => current + 1);
    setState('loading');
  };

  return (
    <div className={styles.page}>
      <div className={styles.switcher}>
        {states.map(value => (
          <Button
            key={value}
            appearance={value === state ? 'primary' : 'secondary'}
            onClick={() => setState(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <DashboardWidget
        title='Pipeline health'
        description='Last 24 hours'
        state={state}
        metrics={metrics}
        onRetry={retry}
        onCreate={() => setState('ready')}
      />
    </div>
  );
};

export default DashboardWidgetStatesDemo;
```

## Pitfalls

- Letting the whole document scroll instead of the canvas: grid and flex children default to min-height/min-width auto, so you must set minHeight: 0 (and often minWidth: 0) on the scroll container that has overflowY: auto, otherwise the shell grows past 100vh.
- Hard-coding colors, gaps, and radii instead of using tokens from @fluentui/react-components - the shell then ignores dark theme, high-contrast, and brand themes, and RTL mirroring breaks.
- Defining makeStyles inside a component: Griffel must be called at module scope, otherwise you re-create and re-insert styles on every render and lose class-name stability.
- Mixing controlled and uncontrolled Nav props (selectedValue together with defaultSelectedValue, or selecting navigation without onNavItemSelect) - the Nav renders selection from the initial value and never updates, producing a React warning about switching from uncontrolled to controlled.
- Shipping icon-only buttons without accessible names and wrapping them in a Tooltip without relationship - the tooltip stays visual and the button is announced as an unlabeled control. Always set aria-label and relationship='description' (or 'label').
- Rendering both the inline Nav and the overlay Nav at the same time on small screens: you get two navigation landmarks plus duplicated, off-screen tab stops. Hide the inactive pane with display: none rather than relying on z-index or opacity.
- Stale dialog form state: reuse one dialog and forget to reset the draft when it opens (or keep the surface mounted when closed), so the user sees the previous record's values. Create the draft copy in the open handler and drop it on close.
- Making an entire Card a clickable target while also placing Buttons inside it - interaction is ambiguous for pointer, keyboard, and assistive tech. Either keep the Card inert with explicit action Buttons, or make the Card the single interactive element and use focusMode and shouldRestrictTriggerAction to control inner triggers.
- Ignoring loading, empty, and error states: a widget that only renders the happy path leaves the canvas blank on failure. Branch every data region across loading (Skeleton with aria-label), empty (explanation plus one primary action), error (MessageBar with a retry action), and ready.
- Using Divider as a flex child in a horizontal toolbar without vertical (or vice versa) - it renders the wrong orientation and adds a full-height line that breaks the layout.
- Long unbroken values (IDs, URLs, wide tables) blowing out the responsive grid: give the grid track minmax(0, 1fr) semantics via minWidth: 0 on the child and use Text truncate or wrap for single-line labels.

## Accessibility

Landmarks: render exactly one header, one main, and one exposed nav (Nav renders a nav element). When you add an overlay navigation pane for small screens, hide the inline pane with display: none instead of leaving both mounted, otherwise you ship duplicate landmarks and duplicate tab stops. Add a skip link to the content canvas that becomes visible on focus. Headings: render the page title inside a real h1 and style it with Text size={800} weight='semibold' so the document outline matches the visual hierarchy. Breadcrumb: Breadcrumb already provides the navigation landmark; the last BreadcrumbButton gets current, which emits aria-current='page'. Toolbar: Toolbar renders role='toolbar', so its children must be toolbar-style controls; give icon-only Buttons an aria-label and a Tooltip with relationship='description' (use relationship='label' when the tooltip is the only accessible name). Status: never communicate state with Badge color alone - include the text (Succeeded, Running, Failed). Live regions: use MessageBar politeness='polite' for success confirmations such as Saved or Deleted; leave intent='error' MessageBars with their default assertive politeness for real failures so they interrupt. Loading: give Skeleton an aria-label describing what is loading, and keep SkeletonItem shapes matching the real content so the layout does not jump. Dialogs: Dialog traps focus, closes on Escape, and restores focus to the trigger - always give the surface a DialogTitle, keep the first focusable control meaningful, and label destructive buttons with an explicit verb (Delete) rather than OK. Keyboard: Nav supports roving arrow-key navigation and Enter/Space to activate destinations and toggle categories; verify your card action Buttons are reachable in a logical order. Motion and contrast: use tokens (which are theme-aware and meet contrast in both light and dark themes) and prefer skeleton animation only when the user has not requested reduced motion.

## Components used

- [Avatar](../../components/avatar.md)
- [Badge](../../components/badge.md)
- [Breadcrumb](../../components/breadcrumb.md)
- [Button](../../components/button.md)
- [Card](../../components/card.md)
- [Dialog](../../components/dialog.md)
- [Divider](../../components/divider.md)
- [Drawer](../../components/drawer.md)
- [Field](../../components/field.md)
- [Input](../../components/input.md)
- [Link](../../components/link.md)
- [Menu](../../components/menu.md)
- [MessageBar](../../components/message-bar.md)
- [Nav](../../components/nav.md)
- [Select](../../components/select.md)
- [Skeleton](../../components/skeleton.md)
- [Spinner](../../components/spinner.md)
- [Switch](../../components/switch.md)
- [Text](../../components/text.md)
- [Textarea](../../components/textarea.md)
- [Toolbar](../../components/toolbar.md)
- [Tooltip](../../components/tooltip.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
