# Application Navigation

> **Group**: navigation

## Goal

Build a complete application navigation shell composed of FluentUI v9 pieces: a primary Nav rail with nested categories and controlled selection, a header with brand, search Input, icon buttons with Tooltips and an account Menu triggered by an Avatar, a Breadcrumb trail for the current route, secondary TabList navigation, and a Drawer-based version of the rail for narrow viewports.

## When to Use

Use this recipe when you are building the persistent chrome of an application — a dashboard, admin console, portal, or docs site — where users repeatedly move between top-level destinations, nested sections, and peer views of the current page, and you need that navigation to stay consistent across routes and viewport sizes.

## When Not to Use

Do not use a full Nav rail for marketing pages, landing pages, or short single-page flows; a header with Link and Button is enough there. Do not use Nav for a linear step sequence (use a progress/stepper pattern instead) or for a table of contents inside one article (use Tree or inline anchors). If the user only switches between peer views of the same object and the hierarchy never changes, TabList alone is the right answer — adding a Nav rail duplicates navigation and creates two competing landmarks.

## What this recipe builds

An application shell with four cooperating navigation surfaces:

- **Primary navigation** — a vertical `Nav` rail with `NavItem` leaves, `NavCategory` groups, and `NavSubItem` children.
- **Header** — brand text, a search `Input`, icon-only `Button`s wrapped in `Tooltip`, and an account `Menu` triggered by an `Avatar`.
- **Breadcrumb** — `Breadcrumb` with `BreadcrumbItem`, `BreadcrumbButton`, and `BreadcrumbDivider` describing where the current route sits in the hierarchy.
- **Secondary navigation** — a `TabList` of `Tab`s for peer views of the current page.

On narrow viewports the rail moves into a `Drawer` that overlays the content.

## Layout skeleton

Use CSS grid for the shell and let the rail scroll independently of the page:

```css
grid-template-columns: 260px 1fr;
overflow: hidden;
```

The `Nav` occupies the first column; `<main id="main-content">` occupies the second and owns its own scroll container. Style everything with `makeStyles` and `tokens` so the shell follows the active theme (light, dark, high contrast).

## 1. Primary navigation with `Nav`

`Nav` is a **controlled list**. Give it `selectedValue` and update that value from `onNavItemSelect` using the selected item's `data.value`.

- Leaves are `NavItem value="..."` (optionally with `icon`).
- Nesting is expressed with `NavCategory value="..."` (the collapsible parent), `NavCategoryItem` (its clickable header, with `icon` and children), and `NavSubItemGroup` / `NavSubItem value="..."` for the children.
- Leave categories uncontrolled with `defaultOpenCategories={["work"]}`, or control them with `openCategories` + `onNavCategoryItemToggle` when you need to persist open state (example 1 does this).
- `multiple` keeps more than one category open at a time.
- `density` (`small` | `medium` | `large`) changes row height — use `small` in a dense desktop rail and `medium` in a touch drawer.
- `NavSectionHeader` and `NavDivider` group the list without adding non-interactive noise to the tab order.

Keep selection in **one** place, ideally derived from the router location, so the rail, breadcrumb, and tabs can never disagree.

## 2. Header: brand, search, actions, account

The header is a single flex row: brand `Text`, an `Input` (`type="search"`, `contentBefore` for the magnifier), then icon-only `Button`s and the account `Menu`.

- Icon-only buttons **must** have an accessible name. The cleanest way is `Tooltip` with `relationship="label"`, which labels the button through the tooltip content — do not also add `aria-label`, or assistive technology reads both.
- The account trigger is a `MenuTrigger` (`disableButtonEnhancement` when the child is already a `Button`) whose child `Button` renders an `Avatar` in its `icon` slot and carries an `aria-label` describing the account.
- Inside, use `MenuPopover` > `MenuList` > `MenuItem`, with `MenuDivider` to separate destructive actions such as sign out.
- Put a skip `Link` at the very start of the header so keyboard users can jump past the navigation to `#main-content`.

## 3. Breadcrumbs

`Breadcrumb` renders a navigation landmark, so it needs its own `aria-label` (for example "Breadcrumb") and a `size` that matches your header typography. Mark the final crumb with `current` on `BreadcrumbButton` so it becomes `aria-current="page"` — screen reader users rely on that to know where they are. `focusMode="arrow"` lets users walk the trail with the arrow keys instead of tabbing through every crumb.

If the trail can be longer than the available width, collapse middle segments into a `Menu` triggered from a `BreadcrumbButton` that reads "..." and keep first/last crumbs visible.

## 4. Secondary navigation with `TabList`

When several peer views belong to the current page (Overview / Activity / Members / Settings), use `TabList` + `Tab` rather than another `Nav`. `TabList` implements roving tabindex and arrow-key navigation for you; you supply `selectedValue` and `onTabSelect`. Pair each `Tab` with a panel element that has `role="tabpanel"` so the relationship is announced.

## 5. Responsive: move the rail into a `Drawer`

Below your breakpoint, render the same `Nav` inside a `Drawer` with `type="overlay"`, controlled by `open` / `onOpenChange`, and a trigger button in the header. Add a close `Button` inside the drawer, and close the drawer when a destination is picked (call your selection handler and `setOpen(false)` in the same callback).

For a viewport-aware shell, track the breakpoint yourself (`window.matchMedia` in a `useEffect`) and switch the drawer `type` between `overlay` for small screens and `inline` for large ones, instead of rendering two copies of the navigation. Never mount the same landmark twice — duplicate nav landmarks confuse screen reader users and duplicate ids break `aria-controls`.

## 6. Wiring to a router

Represent every destination as a stable string id ("work-assigned", "releases-current") that maps to a route. Derive `selectedValue` from `location.pathname` when possible; if you keep local state, keep it in one component and pass it down. For real navigations pass `href` on `NavItem`/`BreadcrumbButton`; for client-side routers attach an `onClick` that routes programmatically and, for `href` anchors, prevents the default full-page reload.

## Examples

### AppSidebarNav — primary navigation with nested categories

A controlled Nav rail with flat items, a section header, two collapsible categories with sub-items (open state controlled through onNavCategoryItemToggle), dividers, small density, and a content pane that reflects the selected value.

```tsx
import * as React from "react";
import {
  Nav,
  NavCategory,
  NavCategoryItem,
  NavDivider,
  NavItem,
  NavSectionHeader,
  NavSubItem,
  NavSubItemGroup,
  Text,
  makeStyles,
  tokens,
} from "@fluentui/react-components";

/* --- Decorative inline icons (swap for @fluentui/react-icons in your app) --- */
const DashboardIcon = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
    <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" fill="currentColor" />
    <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" fill="currentColor" />
    <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" fill="currentColor" />
    <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" fill="currentColor" />
  </svg>
);

const ActivityIcon = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
    <path d="M2.5 10.5h4l2-6 3 11 2-5h4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FolderIcon = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
    <path
      d="M2.5 5.5a2 2 0 0 1 2-2h2.3c.42 0 .82.18 1.1.5l.94.94h6.16a2 2 0 0 1 2 2v7.56a2 2 0 0 1-2 2H4.5a2 2 0 0 1-2-2z"
      fill="currentColor"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
    <circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="2.25" fill="currentColor" />
  </svg>
);

const useStyles = makeStyles({
  root: {
    display: "flex",
    height: "520px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    overflow: "hidden",
  },
  nav: {
    width: "260px",
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  page: {
    flexGrow: 1,
    padding: tokens.spacingHorizontalXL,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  heading: {
    margin: 0,
  },
});

/** Route ids used both by the nav and by your router. */
const pageTitles: Record<string, string> = {
  dashboard: "Dashboard",
  activity: "Activity",
  "work-assigned": "Work items · Assigned to me",
  "work-recent": "Work items · Recently updated",
  "work-backlog": "Work items · Backlog",
  "releases-current": "Releases · Current",
  "releases-archive": "Releases · Archive",
  settings: "Settings",
};

export const AppSidebarNav = () => {
  const styles = useStyles();
  const [selectedValue, setSelectedValue] = React.useState<string>("dashboard");
  const [openCategories, setOpenCategories] = React.useState<string[]>(["work"]);

  return (
    <div className={styles.root}>
      <Nav
        className={styles.nav}
        aria-label="Main navigation"
        selectedValue={selectedValue}
        onNavItemSelect={(_ev, data) => setSelectedValue(data.value)}
        openCategories={openCategories}
        onNavCategoryItemToggle={(_ev, data) =>
          setOpenCategories((current) =>
            current.includes(data.value)
              ? current.filter((value) => value !== data.value)
              : [...current, data.value],
          )
        }
        multiple
        density="small"
      >
        <NavItem value="dashboard" icon={<DashboardIcon />}>
          Dashboard
        </NavItem>
        <NavItem value="activity" icon={<ActivityIcon />}>
          Activity
        </NavItem>

        <NavDivider />

        <NavSectionHeader>Work</NavSectionHeader>
        <NavCategory value="work">
          <NavCategoryItem icon={<FolderIcon />}>Work items</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="work-assigned">Assigned to me</NavSubItem>
            <NavSubItem value="work-recent">Recently updated</NavSubItem>
            <NavSubItem value="work-backlog">Backlog</NavSubItem>
          </NavSubItemGroup>
        </NavCategory>
        <NavCategory value="releases">
          <NavCategoryItem icon={<FolderIcon />}>Releases</NavCategoryItem>
          <NavSubItemGroup>
            <NavSubItem value="releases-current">Current</NavSubItem>
            <NavSubItem value="releases-archive">Archive</NavSubItem>
          </NavSubItemGroup>
        </NavCategory>

        <NavDivider />

        <NavItem value="settings" icon={<SettingsIcon />}>
          Settings
        </NavItem>
      </Nav>

      <main id="main-content" className={styles.page}>
        <h1 className={styles.heading}>
          <Text size={600} weight="semibold">
            {pageTitles[selectedValue] ?? selectedValue}
          </Text>
        </h1>
      </main>
    </div>
  );
};
```

### AppHeaderWithAccountMenu — brand, search, actions, breadcrumb

A top header that composes Text (brand), a search Input with a contentBefore icon, icon-only Buttons labelled by Tooltip with relationship="label", an account Menu whose trigger is an Avatar, and a Breadcrumb bar underneath the header.

```tsx
import * as React from "react";
import {
  Avatar,
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Button,
  Input,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Text,
  Tooltip,
  makeStyles,
  tokens,
} from "@fluentui/react-components";

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
    <circle cx="8.5" cy="8.5" r="4.75" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12.2 12.2 17 17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
    <path
      d="M10 2.5a1 1 0 0 1 1 1v.6a5 5 0 0 1 4 4.9v3.1l1.2 1.7a.8.8 0 0 1-.65 1.2H4.45a.8.8 0 0 1-.65-1.2L5 12.1V9a5 5 0 0 1 4-4.9v-.6a1 1 0 0 1 1-1Z"
      fill="currentColor"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
    <circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="2.25" fill="currentColor" />
  </svg>
);

const useStyles = makeStyles({
  shell: {
    display: "flex",
    flexDirection: "column",
    minHeight: "340px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    columnGap: tokens.spacingHorizontalM,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  brand: {
    color: tokens.colorBrandForeground1,
  },
  search: {
    flexGrow: 1,
    maxWidth: "420px",
    marginLeft: "auto",
  },
  breadcrumbBar: {
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  content: {
    flexGrow: 1,
    padding: tokens.spacingHorizontalXL,
    backgroundColor: tokens.colorNeutralBackground1,
  },
});

export const AppHeaderWithAccountMenu = () => {
  const styles = useStyles();
  const [query, setQuery] = React.useState("");

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Text className={styles.brand} size={400} weight="semibold">
          Contoso Ops
        </Text>

        <Input
          className={styles.search}
          type="search"
          aria-label="Search projects, people, and work items"
          placeholder="Search projects, people, and work items"
          contentBefore={<SearchIcon />}
          onChange={(_ev, data) => setQuery(data.value)}
        />

        <Tooltip content="Notifications" relationship="label">
          <Button appearance="subtle" icon={<BellIcon />} />
        </Tooltip>

        <Tooltip content="Settings" relationship="label">
          <Button appearance="subtle" icon={<SettingsIcon />} />
        </Tooltip>

        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button
              appearance="subtle"
              aria-label="Account: Adele Vance"
              icon={<Avatar name="Adele Vance" badge={{ status: "available" }} size={28} />}
            />
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem>View profile</MenuItem>
              <MenuItem>Preferences</MenuItem>
              <MenuDivider />
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </header>

      <div className={styles.breadcrumbBar}>
        <Breadcrumb aria-label="Breadcrumb" size="small" focusMode="arrow">
          <BreadcrumbItem>
            <BreadcrumbButton>Home</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton>Contoso Ops</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton current>Dashboard</BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      <main id="main-content" className={styles.content}>
        <Text size={300}>
          {query
            ? `Filtering the current view for "${query}".`
            : "Type in the header search box to filter the current view."}
        </Text>
      </main>
    </div>
  );
};
```

### ResponsiveNavDrawer — the same Nav inside a Drawer

A narrow-viewport pattern: a hamburger Button opens a Drawer (type="overlay") that hosts the primary Nav, a Persona header, a close button, and footer Links. Selecting a destination closes the drawer.

```tsx
import * as React from "react";
import {
  Button,
  Divider,
  Drawer,
  Link,
  Nav,
  NavCategory,
  NavCategoryItem,
  NavItem,
  NavSectionHeader,
  NavSubItem,
  NavSubItemGroup,
  Persona,
  Text,
  Tooltip,
  makeStyles,
  tokens,
} from "@fluentui/react-components";

const MenuIcon = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
    <path d="M3 5.5h14M3 10h14M3 14.5h14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const DismissIcon = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
    <path d="M5 5l10 10M15 5 5 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const HomeIcon = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
    <path d="M10 2.5 3 8.5V17h5v-4h4v4h5V8.5z" fill="currentColor" />
  </svg>
);

const FolderIcon = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
    <path
      d="M2.5 5.5a2 2 0 0 1 2-2h2.3c.42 0 .82.18 1.1.5l.94.94h6.16a2 2 0 0 1 2 2v7.56a2 2 0 0 1-2 2H4.5a2 2 0 0 1-2-2z"
      fill="currentColor"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
    <circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="2.25" fill="currentColor" />
  </svg>
);

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    rowGap: tokens.spacingVerticalM,
    minHeight: "320px",
    padding: tokens.spacingHorizontalL,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
  drawerSurface: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "300px",
    backgroundColor: tokens.colorNeutralBackground1,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalM,
  },
  nav: {
    flexGrow: 1,
    overflowY: "auto",
    padding: tokens.spacingVerticalXS,
  },
  drawerFooter: {
    display: "flex",
    flexDirection: "column",
    rowGap: tokens.spacingVerticalXS,
    padding: tokens.spacingVerticalM,
  },
  content: {
    flexGrow: 1,
    padding: tokens.spacingHorizontalXL,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
  },
});

export const ResponsiveNavDrawer = () => {
  const styles = useStyles();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("home");

  return (
    <div className={styles.root}>
      <Tooltip content="Open navigation" relationship="label">
        <Button appearance="subtle" icon={<MenuIcon />} onClick={() => setIsOpen(true)} />
      </Tooltip>

      <Drawer
        type="overlay"
        separator
        open={isOpen}
        onOpenChange={(_ev, data) => setIsOpen(data.open)}
      >
        <div className={styles.drawerSurface}>
          <div className={styles.drawerHeader}>
            <Persona name="Adele Vance" secondaryText="Engineering" />
            <Tooltip content="Close navigation" relationship="label">
              <Button appearance="subtle" icon={<DismissIcon />} onClick={() => setIsOpen(false)} />
            </Tooltip>
          </div>

          <Divider />

          <Nav
            className={styles.nav}
            aria-label="Main navigation"
            selectedValue={selectedValue}
            onNavItemSelect={(_ev, data) => {
              setSelectedValue(data.value);
              setIsOpen(false);
            }}
            defaultOpenCategories={["projects"]}
            density="medium"
          >
            <NavItem value="home" icon={<HomeIcon />}>
              Home
            </NavItem>

            <NavSectionHeader>Workspace</NavSectionHeader>
            <NavCategory value="projects">
              <NavCategoryItem icon={<FolderIcon />}>Projects</NavCategoryItem>
              <NavSubItemGroup>
                <NavSubItem value="projects-active">Active</NavSubItem>
                <NavSubItem value="projects-archived">Archived</NavSubItem>
              </NavSubItemGroup>
            </NavCategory>

            <NavItem value="settings" icon={<SettingsIcon />}>
              Settings
            </NavItem>
          </Nav>

          <Divider />

          <div className={styles.drawerFooter}>
            <Link href="https://example.com/docs">Documentation</Link>
            <Link href="https://example.com/support">Contact support</Link>
          </div>
        </div>
      </Drawer>

      <main id="main-content" className={styles.content}>
        <Text size={400} weight="semibold">
          Current route: {selectedValue}
        </Text>
      </main>
    </div>
  );
};
```

### SectionTabsNavigation — secondary navigation with TabList

A controlled TabList for peer views of the current page, with a matching tabpanel region and a disabled destination rendered declaratively.

```tsx
import * as React from "react";
import {
  Tab,
  TabList,
  Text,
  makeStyles,
  tokens,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    rowGap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalL,
  },
  panel: {
    padding: tokens.spacingHorizontalL,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
  },
});

const sections: Record<string, string> = {
  overview: "Overview — health, recent activity, and open work items for this project.",
  activity: "Activity — a chronological feed of changes made to this project.",
  members: "Members — everyone with access, grouped by role.",
  settings: "Settings are available to project owners only.",
};

export const SectionTabsNavigation = () => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = React.useState<string>("overview");

  return (
    <div className={styles.root}>
      <TabList
        selectedValue={selectedTab}
        onTabSelect={(_ev, data) => setSelectedTab(data.value as string)}
        appearance="subtle"
        size="medium"
      >
        <Tab value="overview">Overview</Tab>
        <Tab value="activity">Activity</Tab>
        <Tab value="members">Members</Tab>
        <Tab value="settings" disabled>
          Settings
        </Tab>
      </TabList>

      <div
        role="tabpanel"
        aria-label={sections[selectedTab]}
        className={styles.panel}
      >
        <Text size={300}>{sections[selectedTab]}</Text>
      </div>
    </div>
  );
};
```

## Pitfalls

- Passing `selectedValue` to `Nav` or `TabList` without handling `onNavItemSelect` / `onTabSelect`: the component becomes read-only, clicks appear to do nothing, and the rendered selection stops matching the route. Always control the pair together (or use `defaultSelectedValue` fully uncontrolled).
- Duplicating navigation state — one `useState` for the rail, another for the breadcrumb, another for tabs. Derive all of them from a single route id (or from the router location) so deep links highlight the right item and so `aria-current` never lies.
- Putting an icon-only `Button` in the header without an accessible name, or supplying both a `Tooltip` with `relationship="label"` and an `aria-label`. Do exactly one of the two; the tooltip alone is the recommended pattern because it also gives a visual label.
- Rendering the desktop rail and the mobile drawer navigation at the same time (for example hiding one with CSS). Users get duplicate navigation landmarks and duplicate ids. Switch the single instance between a persistent rail and an overlay drawer based on a breakpoint, or keep the drawer content mounted only on small screens.
- Using `NavCategoryItem` as a link or expecting it to have a `value` — the value belongs to the enclosing `NavCategory`, and the item itself only toggles its `NavSubItemGroup`. Putting a value on the wrong level makes `selectedValue`/`openCategories` never match.
- Using plain `<a href>` for in-app destinations and losing the SPA transition, or the reverse: styling buttons to look like links so users cannot open destinations in a new tab. Use `href` on `NavItem`/`BreadcrumbButton` for real URLs and intercept clicks only when you actually handle routing client-side.
- Forgetting to close the navigation `Drawer` when a destination is picked. The route changes but the overlay stays open with focus trapped inside it, which strands keyboard and screen reader users; call `setOpen(false)` in the same select handler.
- Relying on placeholder text as the only label for the header search `Input`. Placeholders disappear on input and are not reliable labels — provide an `aria-label` or a `Field` label, and keep `type="search"` for the correct semantics.

## Accessibility

Landmarks and labels: `Nav` and `Breadcrumb` both render navigation landmarks, so every instance needs a unique, descriptive `aria-label` ("Main navigation", "Breadcrumb") — especially when a sidebar, a breadcrumb trail, and a tab list are on screen together. Wrap the main content in `<main id="main-content">` and put a "Skip to main content" `Link` as the first focusable element in the header so keyboard users can bypass the rail. Names for icon-only controls: use `Tooltip` with `relationship="label"` (or an explicit `aria-label` on the control) — never both, because the control would then be announced twice. Tooltips are shown on focus as well as hover, so they are keyboard-reachable. Nav semantics: `NavItem`, `NavCategoryItem`, and `NavSubItem` render real buttons or anchors and implement roving focus; keep `NavSectionHeader` and `NavDivider` for grouping only and never make them focusable. Because `Nav` is controlled, always update `selectedValue` in `onNavItemSelect`, otherwise the visual selection and the actual route diverge for assistive technology. Breadcrumbs: mark the last crumb with `current` on `BreadcrumbButton` so it exposes `aria-current="page"`; `focusMode="arrow"` keeps the trail to a single tab stop. Tabs: `TabList` handles arrow-key navigation and roving tabindex; give each panel `role="tabpanel"`, associate it with `aria-labelledby`/`aria-controls` when you control ids, and never put interactive content inside the `Tab` label itself. Drawer: it traps focus while open, closes on Escape, and returns focus to the trigger on close, so always keep a visible close `Button` inside it; when a navigation item is activated, close the drawer in the same callback so focus does not remain in hidden content. Finally, verify contrast for the selected nav item and tab indicator in both light and dark themes — do not rely on color alone to communicate selection; Fluent adds a shape indicator for both.

## Components used

- [Avatar](../../components/avatar.md)
- [Breadcrumb](../../components/breadcrumb.md)
- [Button](../../components/button.md)
- [Divider](../../components/divider.md)
- [Drawer](../../components/drawer.md)
- [Input](../../components/input.md)
- [Link](../../components/link.md)
- [Menu](../../components/menu.md)
- [Nav](../../components/nav.md)
- [Persona](../../components/persona.md)
- [Text](../../components/text.md)
- [Tooltip](../../components/tooltip.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
