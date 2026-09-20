# Dashboard Shell

> **Group**: layout

## Goal

Build a complete dashboard shell in Fluent UI v9: a persistent NavDrawer sidebar with collapsible sections, a utility top bar (breadcrumb, search, toolbar, account menu), and a scrollable content region that renders a page header, status MessageBar and a Card-based KPI/activity grid.

## When to Use

Use this recipe when you are building the outer frame of an application or admin surface: multiple top-level destinations, one screen that hosts many panels/cards, and a header that must stay visible while the content scrolls. It also fits when the navigation has to collapse to an icon rail on wide screens and become a floating overlay on narrow ones.

## When Not to Use

Do not use a full shell for single-purpose pages (a sign-in screen, a wizard, a marketing page) - they have no persistent navigation and should just use a centered layout with Card/Field/Dialog. If your navigation is only two or three inline views inside one page, use TabList instead of NavDrawer. If you need a modal task flow rather than a destination change, use Dialog or a Drawer, not the shell's navigation state.

A dashboard shell is the frame that every screen in your product lives inside: persistent navigation on one side, a utility header on the other, and a scrollable content region in the middle. This recipe assembles that frame from Fluent UI v9 navigation, toolbar, messaging and surface primitives, and wires up sidebar collapse plus section routing.

## Anatomy

    +---------------+------------------------------------------+
    | NavDrawer     | top bar: breadcrumb - search - tools     |
    |   header      +------------------------------------------+
    |   body        | content (scrolls)                        |
    |   footer      |   page header, MessageBar, Card grid     |
    +---------------+------------------------------------------+

Three structural rules keep the frame stable:

1. The frame is a CSS grid: `gridTemplateColumns: 'auto minmax(0, 1fr)'`. Use `minmax(0, 1fr)` rather than `1fr` so wide content (tables, long breadcrumb trails) shrinks instead of blowing out the column.
2. The main column is a flex column: a fixed header on top and the content below it.
3. The content region owns the scroll: `flexGrow: 1`, `minHeight: 0` and `overflowY: 'auto'`. Without `minHeight: 0` a flex child refuses to shrink and the whole page scrolls instead.

## 1. Sidebar: NavDrawer and the nav primitives

`NavDrawer` is both the sidebar container and the owner of navigation state.

| Concern | API |
| --- | --- |
| Current destination | `defaultSelectedValue`, or `selectedValue` + `onNavItemSelect` when controlled |
| Expanded categories | `defaultOpenCategories` / `openCategories` + `onNavCategoryItemToggle` |
| Several categories open at once | `multiple` |
| In-layout rail vs. floating panel | `type='inline'` vs. `type='overlay'` |
| Regions | `NavDrawerHeader`, `NavDrawerBody`, `NavDrawerFooter` |

Nesting inside the body:

```tsx
<NavDrawerBody>
  <NavItem value='overview' icon={<GridIcon />}>Overview</NavItem>
  <NavCategory value='reports'>
    <NavCategoryItem icon={<TrendIcon />}>Reports</NavCategoryItem>
    <NavSubItemGroup>
      <NavSubItem value='reports-traffic'>Traffic</NavSubItem>
      <NavSubItem value='reports-revenue'>Revenue</NavSubItem>
    </NavSubItemGroup>
  </NavCategory>
  <NavDivider />
  <NavSectionHeader>Workspace</NavSectionHeader>
  <NavItem value='environments' icon={<LayersIcon />}>Environments</NavItem>
</NavDrawerBody>
```

- `NavCategory` takes the category `value`; `NavCategoryItem` renders the clickable, expandable row; `NavSubItemGroup` holds the child rows.
- `NavDivider` separates groups, `NavSectionHeader` labels them.
- Put daily destinations in `NavDrawerBody` and account-level destinations (Settings, Help) in `NavDrawerFooter`, so they are separated from the work surface but always reachable.
- Every `value` in the nav must be unique across items, categories and sub-items: it is the selection key.

## 2. Top bar: breadcrumb, search, tools, account

Keep the header a single flex row so it never wraps unpredictably:

1. A toggle `Button` (and the `Hamburger` inside `NavDrawerHeader`) controls the sidebar.
2. `Breadcrumb` > `BreadcrumbItem` > `BreadcrumbButton` shows location; mark the last item with `current`. Give the breadcrumb an `aria-label` and let it take the leftover width (`flexGrow: 1`, `minWidth: 0`).
3. `SearchBox` for global search, with a fixed width so long labels do not push the tools off screen.
4. `Toolbar` with `ToolbarGroup`, `ToolbarDivider` and `ToolbarButton` for icon-only utilities; `size='small'` keeps a dense header.
5. A `Menu` on a transparent `Button` whose `icon` slot holds an `Avatar`, for profile actions.

## 3. Content region

- Page header: an `h1` wrapping `Text size={800} weight='semibold'`, plus secondary and primary `Button`s pushed right with a growing spacer.
- `MessageBar` for tenant-wide status. `MessageBarBody` + `MessageBarTitle` carry the copy; `MessageBarActions` carries the response button and the dismiss button in its `containerAction` slot.
- KPI tiles: `Card appearance='filled-alternative'` with `CardHeader` (header / description / action slots), the headline value, a `ProgressBar`, and a `CardFooter` action.
- Panels: `Card appearance='outline'` for denser content such as an activity feed.

## 4. Wiring selection to content

Keep the shell dumb and let the parent own routing:

```tsx
const [selectedNav, setSelectedNav] = React.useState('overview');

<NavDrawer
  defaultSelectedValue='overview'
  onNavItemSelect={(_, data) => setSelectedNav(data.value as string)}
  defaultOpenCategories={['reports']}
  multiple
/>
```

`data.value` is the `value` you gave the `NavItem` or `NavSubItem`. In a real app, translate that value into a route in the same handler and let your router render the view inside the content region.

## 5. Responsive strategy

Render one drawer and change its `type`:

- Wide viewport: `type='inline'` and `open={true}`. The rail is part of the grid and collapses to an icon rail when closed.
- Narrow viewport: `type='overlay'`. The drawer floats above the content with a backdrop, so render it as a sibling of the header and content - not as a grid column - otherwise it claims a track in the grid.

Drive both from a single `isNavOpen` boolean so the toolbar toggle and the in-drawer `Hamburger` stay in sync, and close the overlay drawer from `onNavItemSelect` after a destination is chosen.

## Checklist

- Frame: grid `auto minmax(0, 1fr)`, `height: 100vh`.
- Main column: flex column with `minWidth: 0`.
- Content region: `flexGrow: 1`, `minHeight: 0`, `overflowY: 'auto'`.
- Nav: unique values, `defaultOpenCategories` for the section users start in.
- Header: breadcrumb grows, search is fixed width, account `Menu` is last.

## Examples

### Persistent inline dashboard shell

A full-width shell with an inline (collapsible) NavDrawer on the left, a breadcrumb/search/toolbar/account top bar, and a content region with a page header, status MessageBar, KPI cards and an activity panel.

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
  CardFooter,
  CardHeader,
  FluentProvider,
  Hamburger,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarTitle,
  NavCategory,
  NavCategoryItem,
  NavDivider,
  NavDrawer,
  NavDrawerBody,
  NavDrawerFooter,
  NavDrawerHeader,
  NavItem,
  NavSectionHeader,
  NavSubItem,
  NavSubItemGroup,
  ProgressBar,
  SearchBox,
  Text,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarGroup,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

/* --------------------------------------------------------------------------
 * Icons: small inline SVGs so the example is self-contained.
 * Swap them for your own icon components.
 * ------------------------------------------------------------------------ */

const createIcon = (path: string): React.FC => {
  const Icon: React.FC = () => (
    <svg viewBox='0 0 20 20' width='20' height='20' aria-hidden='true' focusable='false'>
      <path d={path} fill='currentColor' />
    </svg>
  );
  return Icon;
};

const GridIcon = createIcon('M3 3h6v6H3zM11 3h6v6h-6zM3 11h6v6H3zM11 11h6v6h-6z');
const ActivityIcon = createIcon('M3 11h3v6H3zM8.5 7h3v10h-3zM14 4h3v13h-3z');
const TrendIcon = createIcon('M10 2l6 6h-4v10H8V8H4z');
const LayersIcon = createIcon('M10 2l8 4-8 4-8-4 8-4zm6.6 6.2L18 9l-8 4-8-4 1.4-.8L10 11l6.6-2.8z');
const PeopleIcon = createIcon(
  'M7 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 1.5c-3.3 0-6 1.6-6 3.5V17h12v-3c0-1.9-2.7-3.5-6-3.5z',
);
const SlidersIcon = createIcon('M2 5h10v2H2zM14 5h4v2h-4zM2 13h4v2H2zM8 13h10v2H8zM11 3h2v6h-2zM5 11h2v6H5z');
const HelpIcon = createIcon(
  'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 3.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM11 15H9V9h2z',
);
const MenuIcon = createIcon('M2 4h16v2H2zM2 9h16v2H2zM2 14h16v2H2z');
const DismissIcon = createIcon(
  'M4.3 5.7 5.7 4.3 10 8.6l4.3-4.3 1.4 1.4L11.4 10l4.3 4.3-1.4 1.4L10 11.4l-4.3 4.3-1.4-1.4L8.6 10z',
);

/* --------------------------------------------------------------------------
 * Data
 * ------------------------------------------------------------------------ */

const navLabels: Record<string, string> = {
  overview: 'Overview',
  activity: 'Activity',
  'reports-traffic': 'Traffic',
  'reports-revenue': 'Revenue',
  'reports-retention': 'Retention',
  environments: 'Environments',
  members: 'Members',
  settings: 'Settings',
  help: 'Help & support',
};

type Kpi = {
  title: string;
  subtitle: string;
  value: string;
  delta: string;
  badgeColor: 'success' | 'warning' | 'informative';
  progress: number;
};

const kpis: Kpi[] = [
  {
    title: 'Monthly active users',
    subtitle: 'Last 30 days',
    value: '48,120',
    delta: '+12.4%',
    badgeColor: 'success',
    progress: 0.78,
  },
  {
    title: 'Error budget remaining',
    subtitle: 'Production - 30 day window',
    value: '61%',
    delta: '-8.1%',
    badgeColor: 'warning',
    progress: 0.61,
  },
  {
    title: 'Average response time',
    subtitle: 'p95 across all regions',
    value: '212ms',
    delta: 'stable',
    badgeColor: 'informative',
    progress: 0.42,
  },
];

type ActivityItem = {
  id: string;
  actor: string;
  action: string;
  status: string;
  badgeColor: 'success' | 'warning' | 'danger';
};

const activity: ActivityItem[] = [
  {
    id: 'a1',
    actor: 'Priya N.',
    action: 'Promoted build 4.18.2 to production',
    status: 'Succeeded',
    badgeColor: 'success',
  },
  {
    id: 'a2',
    actor: 'Marcus L.',
    action: 'Rotated the staging API credentials',
    status: 'Succeeded',
    badgeColor: 'success',
  },
  {
    id: 'a3',
    actor: 'Scheduler',
    action: 'Nightly sync exceeded its 15 minute budget',
    status: 'Degraded',
    badgeColor: 'warning',
  },
  {
    id: 'a4',
    actor: 'Deploy bot',
    action: 'Rollback triggered for release 4.18.1',
    status: 'Failed',
    badgeColor: 'danger',
  },
];

/* --------------------------------------------------------------------------
 * Styles
 * ------------------------------------------------------------------------ */

const useStyles = makeStyles({
  frame: {
    display: 'grid',
    gridTemplateColumns: 'auto minmax(0, 1fr)',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    minHeight: 0,
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  breadcrumb: {
    flexGrow: 1,
    minWidth: 0,
    marginInlineStart: '8px',
  },
  search: {
    width: '260px',
    maxWidth: '30vw',
  },
  content: {
    display: 'grid',
    alignContent: 'start',
    gap: '16px',
    padding: '20px',
    flexGrow: 1,
    minHeight: 0,
    overflowY: 'auto',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  heading: {
    margin: 0,
    fontSize: 'inherit',
    lineHeight: 'inherit',
  },
  subtle: {
    color: tokens.colorNeutralForeground3,
  },
  spacer: {
    flexGrow: 1,
  },
  kpiGrid: {
    display: 'grid',
    gap: '12px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  activityList: {
    display: 'grid',
    gap: '2px',
    marginTop: '4px',
  },
  activityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 0',
    borderTop: `1px solid ${tokens.colorNeutralStroke3}`,
  },
  activityText: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    flexGrow: 1,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
});

/* --------------------------------------------------------------------------
 * Shell
 * ------------------------------------------------------------------------ */

export const DashboardShell: React.FC = () => {
  const styles = useStyles();
  const [isNavOpen, setIsNavOpen] = React.useState(true);
  const [selectedNav, setSelectedNav] = React.useState('overview');
  const currentSection = navLabels[selectedNav] ?? 'Overview';

  return (
    <FluentProvider>
      <div className={styles.frame}>
        <NavDrawer
          open={isNavOpen}
          type='inline'
          separator
          multiple
          defaultSelectedValue='overview'
          defaultOpenCategories={['reports']}
          onNavItemSelect={(_, data) => setSelectedNav(data.value as string)}
        >
          <NavDrawerHeader>
            <div className={styles.brand}>
              <Hamburger
                aria-label={isNavOpen ? 'Collapse navigation' : 'Expand navigation'}
                onClick={() => setIsNavOpen(value => !value)}
              />
              <Text weight='semibold'>Contoso Cloud</Text>
            </div>
          </NavDrawerHeader>

          <NavDrawerBody>
            <NavItem value='overview' icon={<GridIcon />}>
              Overview
            </NavItem>
            <NavItem value='activity' icon={<ActivityIcon />}>
              Activity
            </NavItem>
            <NavCategory value='reports'>
              <NavCategoryItem icon={<TrendIcon />}>Reports</NavCategoryItem>
              <NavSubItemGroup>
                <NavSubItem value='reports-traffic'>Traffic</NavSubItem>
                <NavSubItem value='reports-revenue'>Revenue</NavSubItem>
                <NavSubItem value='reports-retention'>Retention</NavSubItem>
              </NavSubItemGroup>
            </NavCategory>
            <NavDivider />
            <NavSectionHeader>Workspace</NavSectionHeader>
            <NavItem value='environments' icon={<LayersIcon />}>
              Environments
            </NavItem>
            <NavItem value='members' icon={<PeopleIcon />}>
              Members
            </NavItem>
          </NavDrawerBody>

          <NavDrawerFooter>
            <NavItem value='settings' icon={<SlidersIcon />}>
              Settings
            </NavItem>
            <NavItem value='help' icon={<HelpIcon />}>
              Help &amp; support
            </NavItem>
          </NavDrawerFooter>
        </NavDrawer>

        <div className={styles.main}>
          <header className={styles.topBar}>
            <Button
              appearance='subtle'
              icon={<MenuIcon />}
              aria-label='Toggle navigation'
              onClick={() => setIsNavOpen(value => !value)}
            />
            <Breadcrumb size='medium' aria-label='Breadcrumb' className={styles.breadcrumb}>
              <BreadcrumbItem>
                <BreadcrumbButton>Contoso Cloud</BreadcrumbButton>
              </BreadcrumbItem>
              <BreadcrumbDivider />
              <BreadcrumbItem>
                <BreadcrumbButton current>{currentSection}</BreadcrumbButton>
              </BreadcrumbItem>
            </Breadcrumb>
            <SearchBox
              className={styles.search}
              placeholder='Search dashboards'
              aria-label='Search dashboards'
            />
            <Toolbar size='small' aria-label='Utility actions'>
              <ToolbarGroup>
                <ToolbarButton appearance='subtle' icon={<HelpIcon />} aria-label='Help' />
                <ToolbarDivider />
              </ToolbarGroup>
            </Toolbar>
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <Button
                  appearance='transparent'
                  icon={<Avatar name='Ada Lovelace' size={28} />}
                  aria-label='Account menu'
                />
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem>Profile</MenuItem>
                  <MenuItem>Preferences</MenuItem>
                  <MenuDivider />
                  <MenuItem>Sign out</MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </header>

          <main className={styles.content}>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.heading}>
                  <Text size={800} weight='semibold'>
                    {currentSection}
                  </Text>
                </h1>
                <Text size={200} className={styles.subtle}>
                  Updated 5 minutes ago - Production
                </Text>
              </div>
              <div className={styles.spacer} />
              <Button appearance='secondary'>Export</Button>
              <Button appearance='primary'>New report</Button>
            </div>

            <MessageBar intent='warning'>
              <MessageBarBody>
                <MessageBarTitle>Staging is running an outdated runtime</MessageBarTitle>
                The staging environment has not been updated in 3 days. Update it to avoid drift
                between environments.
              </MessageBarBody>
              <MessageBarActions
                containerAction={
                  <Button appearance='transparent' icon={<DismissIcon />} aria-label='Dismiss' />
                }
              >
                <Button appearance='transparent'>Update now</Button>
              </MessageBarActions>
            </MessageBar>

            <div className={styles.kpiGrid}>
              {kpis.map(kpi => (
                <Card key={kpi.title} appearance='filled-alternative'>
                  <CardHeader
                    header={<Text weight='semibold'>{kpi.title}</Text>}
                    description={<Text size={200}>{kpi.subtitle}</Text>}
                    action={
                      <Badge appearance='tint' color={kpi.badgeColor}>
                        {kpi.delta}
                      </Badge>
                    }
                  />
                  <div className={styles.cardBody}>
                    <Text size={900} weight='semibold'>
                      {kpi.value}
                    </Text>
                    <ProgressBar value={kpi.progress} aria-label={`${kpi.title} progress`} />
                  </div>
                  <CardFooter>
                    <Button appearance='transparent' size='small'>
                      View details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <Card appearance='outline'>
              <CardHeader
                header={<Text weight='semibold'>Recent activity</Text>}
                description={<Text size={200}>Deployments and incidents in this workspace</Text>}
                action={
                  <Button appearance='transparent' size='small'>
                    View all
                  </Button>
                }
              />
              <div className={styles.activityList}>
                {activity.map(item => (
                  <div key={item.id} className={styles.activityRow}>
                    <Avatar name={item.actor} size={32} />
                    <div className={styles.activityText}>
                      <Text weight='medium'>{item.actor}</Text>
                      <Text size={200} className={styles.subtle}>
                        {item.action}
                      </Text>
                    </div>
                    <Badge appearance='tint' color={item.badgeColor}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </main>
        </div>
      </div>
    </FluentProvider>
  );
};

export default DashboardShell;
```

### Responsive shell with an overlay drawer and tabbed content

A narrow-viewport variant where the nav is rendered as an overlay NavDrawer that floats above the layout, the header holds a compact toggle plus the account avatar, and a TabList switches the content region between an overview grid and the report library.

```tsx
import * as React from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardFooter,
  CardHeader,
  FluentProvider,
  Hamburger,
  NavDrawer,
  NavDrawerBody,
  NavDrawerFooter,
  NavDrawerHeader,
  NavItem,
  ProgressBar,
  Tab,
  TabList,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const createIcon = (path: string): React.FC => {
  const Icon: React.FC = () => (
    <svg viewBox='0 0 20 20' width='20' height='20' aria-hidden='true' focusable='false'>
      <path d={path} fill='currentColor' />
    </svg>
  );
  return Icon;
};

const GridIcon = createIcon('M3 3h6v6H3zM11 3h6v6h-6zM3 11h6v6H3zM11 11h6v6h-6z');
const TrendIcon = createIcon('M10 2l6 6h-4v10H8V8H4z');
const PeopleIcon = createIcon(
  'M7 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 1.5c-3.3 0-6 1.6-6 3.5V17h12v-3c0-1.9-2.7-3.5-6-3.5z',
);
const SlidersIcon = createIcon('M2 5h10v2H2zM14 5h4v2h-4zM2 13h4v2H2zM8 13h10v2H8zM11 3h2v6h-2zM5 11h2v6H5z');
const MenuIcon = createIcon('M2 4h16v2H2zM2 9h16v2H2zM2 14h16v2H2z');

type Summary = {
  id: string;
  title: string;
  description: string;
  value: string;
  delta: string;
  deltaColor: 'success' | 'warning';
  progress: number;
};

const summaries: Summary[] = [
  {
    id: 's1',
    title: 'Active sessions',
    description: 'Rolling 5 minute window',
    value: '3,412',
    delta: '+4.2%',
    deltaColor: 'success',
    progress: 0.68,
  },
  {
    id: 's2',
    title: 'Queue depth',
    description: 'Pending background jobs',
    value: '184',
    delta: '+22',
    deltaColor: 'warning',
    progress: 0.35,
  },
  {
    id: 's3',
    title: 'Uptime',
    description: 'Trailing 24 hours',
    value: '99.98%',
    delta: 'stable',
    deltaColor: 'success',
    progress: 0.99,
  },
];

const useStyles = makeStyles({
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  tabs: {
    paddingInline: '12px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  content: {
    display: 'grid',
    alignContent: 'start',
    gap: '12px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    padding: '16px',
    flexGrow: 1,
    minHeight: 0,
    overflowY: 'auto',
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  spacer: {
    flexGrow: 1,
  },
});

export const ResponsiveDashboardShell: React.FC = () => {
  const styles = useStyles();
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const [tab, setTab] = React.useState<'overview' | 'reports'>('overview');

  return (
    <FluentProvider>
      <div className={styles.app}>
        {/* An overlay drawer floats above the shell, so it is a sibling of the
            layout rather than a column inside it. */}
        <NavDrawer
          open={isNavOpen}
          type='overlay'
          onOpenChange={(_, data) => setIsNavOpen(data.open)}
          onNavItemSelect={() => setIsNavOpen(false)}
          defaultSelectedValue='overview'
        >
          <NavDrawerHeader>
            <div className={styles.brand}>
              <Hamburger aria-label='Close navigation' onClick={() => setIsNavOpen(false)} />
              <Text weight='semibold'>Contoso Cloud</Text>
            </div>
          </NavDrawerHeader>

          <NavDrawerBody>
            <NavItem value='overview' icon={<GridIcon />}>
              Overview
            </NavItem>
            <NavItem value='reports' icon={<TrendIcon />}>
              Reports
            </NavItem>
            <NavItem value='members' icon={<PeopleIcon />}>
              Members
            </NavItem>
          </NavDrawerBody>

          <NavDrawerFooter>
            <NavItem value='settings' icon={<SlidersIcon />}>
              Settings
            </NavItem>
          </NavDrawerFooter>
        </NavDrawer>

        <header className={styles.topBar}>
          <Button
            appearance='subtle'
            icon={<MenuIcon />}
            aria-label='Open navigation'
            onClick={() => setIsNavOpen(true)}
          />
          <Text weight='semibold' size={400}>
            Contoso Cloud
          </Text>
          <div className={styles.spacer} />
          <Avatar name='Ada Lovelace' size={28} />
        </header>

        <TabList
          className={styles.tabs}
          appearance='subtle'
          size='medium'
          selectedValue={tab}
          onTabSelect={(_, data) => setTab(data.value as 'overview' | 'reports')}
        >
          <Tab value='overview'>Overview</Tab>
          <Tab value='reports'>Reports</Tab>
        </TabList>

        <main className={styles.content}>
          {tab === 'overview' ? (
            summaries.map(summary => (
              <Card key={summary.id} appearance='filled-alternative'>
                <CardHeader
                  header={<Text weight='semibold'>{summary.title}</Text>}
                  description={<Text size={200}>{summary.description}</Text>}
                  action={
                    <Badge appearance='tint' color={summary.deltaColor}>
                      {summary.delta}
                    </Badge>
                  }
                />
                <div className={styles.cardBody}>
                  <Text size={800} weight='semibold'>
                    {summary.value}
                  </Text>
                  <ProgressBar value={summary.progress} aria-label={`${summary.title} progress`} />
                </div>
                <CardFooter>
                  <Button appearance='primary' size='small'>
                    Open
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card className={styles.fullWidth} appearance='outline'>
              <CardHeader
                header={<Text weight='semibold'>Report library</Text>}
                description={<Text size={200}>Saved reports shared with your workspace</Text>}
              />
              <div className={styles.cardBody}>
                <Text>Traffic by region</Text>
                <Text>Revenue by plan</Text>
                <Text>Retention cohorts</Text>
              </div>
              <CardFooter>
                <Button appearance='secondary' size='small'>
                  Manage reports
                </Button>
              </CardFooter>
            </Card>
          )}
        </main>
      </div>
    </FluentProvider>
  );
};

export default ResponsiveDashboardShell;
```

## Pitfalls

- Using '1fr' instead of 'minmax(0, 1fr)' for the main grid column - wide content (tables, long breadcrumb trails) then forces horizontal overflow. Pair it with minWidth: 0 on the flex column so children are allowed to shrink.
- Forgetting minHeight: 0 and overflowY: 'auto' on the content region - the flex child refuses to shrink, the document scrolls, and the top bar scrolls away with the content.
- Mixing controlled and uncontrolled state on the drawer: passing both selectedValue and defaultSelectedValue (or both openCategories and defaultOpenCategories) makes the component controlled and uncontrolled at the same time, which produces React warnings and a nav that never updates.
- Reusing a value string across two NavItems or NavSubItems - values are the selection keys, so a duplicate highlights the wrong row and makes the selected-value-to-content mapping ambiguous.
- Placing an overlay NavDrawer inside the same grid as the inline shell. Even though it floats visually, as a grid child it still claims a track; render the overlay drawer as a sibling of the header and content instead.
- Wrapping an existing Button in MenuTrigger without disableButtonEnhancement - the trigger then nests a button inside a button, breaking keyboard interaction and styling.
- Using plain NavItem rows for content that actually expands (sub-pages, saved filters) instead of NavCategory + NavCategoryItem + NavSubItemGroup, which leaves users with no expand affordance and no sub-item state.
- Building the frame with margins, floats or absolute positioning instead of the grid + flex-column pattern - the layout breaks the moment the rail collapses to an icon rail or the overlay drawer opens.

## Accessibility

NavDrawer renders a navigation landmark and its items are real buttons or links, so the rail is traversable with Tab and activatable with Enter/Space; if the page contains more than one navigation region, give each an accessible label. The Hamburger and any toolbar toggle are icon-only, so they need an accurate aria-label that describes the action ('Collapse navigation' / 'Expand navigation' / 'Open navigation'). End the breadcrumb trail with a BreadcrumbButton marked current so assistive technology announces the current page, not just the section name. When an Avatar is used inside a Button as a Menu trigger, the accessible name belongs on the Button (aria-label='Account menu'), because the avatar itself is decorative. MessageBar copy must live inside MessageBarBody/MessageBarTitle and the intent controls how it is announced - reserve politeness='assertive' for blocking errors. Never let color be the only signal: Badges pair a color with a word such as 'Degraded', and ProgressBar needs a programmatic name (aria-label or a Field label) plus the numeric value in text. Use exactly one h1 per screen and let the document structure determine heading levels - Text size/weight are visual only. TabList handles arrow-key navigation between tabs, but the panel it controls must be reachable and labelled. Finally, when the overlay drawer opens, focus moves into it and Escape (or a backdrop click) closes it, so keep the trigger and the drawer's open state in sync to avoid stranding focus.

## Components used

- [Avatar](../../components/avatar.md)
- [Badge](../../components/badge.md)
- [Breadcrumb](../../components/breadcrumb.md)
- [BreadcrumbButton](../../components/breadcrumb-button.md)
- [BreadcrumbDivider](../../components/breadcrumb-divider.md)
- [BreadcrumbItem](../../components/breadcrumb-item.md)
- [Button](../../components/button.md)
- [Card](../../components/card.md)
- [CardFooter](../../components/card-footer.md)
- [CardHeader](../../components/card-header.md)
- [FluentProvider](../../components/fluent-provider.md)
- [Hamburger](../../components/hamburger.md)
- [Menu](../../components/menu.md)
- [MenuDivider](../../components/menu-divider.md)
- [MenuItem](../../components/menu-item.md)
- [MenuList](../../components/menu-list.md)
- [MenuPopover](../../components/menu-popover.md)
- [MenuTrigger](../../components/menu-trigger.md)
- [MessageBar](../../components/message-bar.md)
- [MessageBarActions](../../components/message-bar-actions.md)
- [MessageBarBody](../../components/message-bar-body.md)
- [MessageBarTitle](../../components/message-bar-title.md)
- [NavCategory](../../components/nav-category.md)
- [NavCategoryItem](../../components/nav-category-item.md)
- [NavDivider](../../components/nav-divider.md)
- [NavDrawer](../../components/nav-drawer.md)
- [NavDrawerBody](../../components/nav-drawer-body.md)
- [NavDrawerFooter](../../components/nav-drawer-footer.md)
- [NavDrawerHeader](../../components/nav-drawer-header.md)
- [NavItem](../../components/nav-item.md)
- [NavSectionHeader](../../components/nav-section-header.md)
- [NavSubItem](../../components/nav-sub-item.md)
- [NavSubItemGroup](../../components/nav-sub-item-group.md)
- [ProgressBar](../../components/progress-bar.md)
- [SearchBox](../../components/search-box.md)
- [Tab](../../components/tab.md)
- [TabList](../../components/tab-list.md)
- [Text](../../components/text.md)
- [Toolbar](../../components/toolbar.md)
- [ToolbarButton](../../components/toolbar-button.md)
- [ToolbarDivider](../../components/toolbar-divider.md)
- [ToolbarGroup](../../components/toolbar-group.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
