# Application Navigation

> **Group**: navigation

## Goal

Build a complete Fluent UI React v9 application navigation shell: a navigation rail (NavDrawer) with app branding, flat destinations, expandable categories and sub-items, a small-screen overlay variant triggered by a Hamburger, account actions in a footer Menu, breadcrumbs that mirror the current location, and a menu-bar navigation variant — all driven by one source of truth for the selected value.

## When to Use

Use this recipe when an application needs a persistent, hierarchical way to move between many destinations: a left rail with grouped sections and expandable categories, a mobile/overlay drawer for narrow viewports, app-level landing items (AppItem/AppItemStatic), a location trail (Breadcrumb), and optional command-style menu bars (Menu). It is the right fit for product shells, admin consoles, and document-centric tools where selection must stay in sync with routing state.

## When Not to Use

Avoid this recipe for simple marketing pages with three or four flat links (use Link or Breadcrumb alone), for switching views inside a single page or panel (use TabList + Tab, or Toolbar for command groups), for arbitrarily deep user-generated hierarchies (use Tree / FlatTree with TreeItem or TreeItemPersonalityLayout), and for a purely transient command palette or context actions (use Menu or a Dialog with a search field).

Compose Fluent UI React v9 navigation components into an app shell: a persistent navigation rail with expandable categories, an overlay drawer for small screens, app branding, account actions in the rail footer, and breadcrumbs that mirror the current location.

## Outcome

- A **navigation rail** (`NavDrawer` + `NavDrawerBody`) that shows app branding, flat destinations, grouped sections, and expandable categories with sub items.
- **One source of truth** for "where am I": `selectedValue` / `openCategories` state that also drives the page heading and the breadcrumb.
- A **small-screen variant** that opens the same navigation as an overlay from a `Hamburger` trigger and closes itself after a selection.
- **Account actions** (`Menu`) pinned to `NavDrawerFooter`.
- A **menu-bar variant** for command-style, document-centric apps.

## Pattern chooser

| Pattern | Building blocks | Use when |
| --- | --- | --- |
| Persistent rail | `NavDrawer type="inline"` + `NavDrawerHeader` / `NavDrawerBody` / `NavDrawerFooter` | Desktop-first apps with 5–20 destinations |
| Overlay drawer | `NavDrawer type="overlay"` + `Hamburger` + `Tooltip` | The same information architecture on narrow viewports |
| Menu bar | `Menu` + `MenuTrigger` + `MenuPopover` + `MenuList` + `MenuItem` (+ nested `Menu` for submenus) | Command-style, document-centric apps (File / View / …) |
| Location trail | `Breadcrumb` + `BreadcrumbItem` + `BreadcrumbButton` + `BreadcrumbDivider` | Hierarchical pages that need a "where am I" trail |

## 1. Wrap the application once in FluentProvider

`NavDrawer`, `Menu`, `Tooltip` and `Breadcrumb` all read design tokens from context. If your app already renders a provider at the root, skip this step; otherwise wrap the shell once:

```tsx
<FluentProvider>
  <AppShell />
</FluentProvider>
```

## 2. Model destinations as `value`s

Every navigable element in the rail carries a `value`. That value is the key used by:

- `selectedValue` to highlight the current destination,
- `onNavItemSelect` / `onNavCategoryItemToggle` to report what the user picked,
- `openCategories` to remember which categories are expanded.

Keep the model in one place so JSX and state never disagree:

```tsx
type Destination = { value: string; label: string; href: string };

type NavEntry =
  | { kind: "item"; value: string; label: string; href: string }
  | { kind: "category"; value: string; label: string; subItems: Destination[] };
```

You can hand-author the JSX (as the examples do) or loop over `NavEntry[]`, emitting `NavItem` for `kind: "item"` and `NavCategory` → `NavCategoryItem` → `NavSubItemGroup` → `NavSubItem` for `kind: "category"`. Values must be unique across the whole rail.

## 3. Choose controlled or uncontrolled selection

`defaultSelectedValue` and `defaultOpenCategories` make the rail self-managing — perfect for prototypes. As soon as selection must drive a router, a page heading or a breadcrumb, lift the state:

```tsx
const [selectedValue, setSelectedValue] = React.useState("home");
const [openCategories, setOpenCategories] = React.useState<string[]>(["reports"]);

<NavDrawer
  open
  type="inline"
  selectedValue={selectedValue}
  openCategories={openCategories}
  onNavItemSelect={(_event, data) => setSelectedValue(String(data.value))}
  onNavCategoryItemToggle={(_event, data) => {
    const value = String(data.value);
    setOpenCategories((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }}
>
```

Never pass a `default*` prop and its controlled counterpart at the same time.

## 4. Build categories and sub items

```tsx
<NavCategory value="reports">
  <NavCategoryItem icon={<ReportsIcon />}>Reports</NavCategoryItem>
  <NavSubItemGroup>
    <NavSubItem value="reports-usage" href="/reports/usage">Usage</NavSubItem>
    <NavSubItem value="reports-billing" href="/reports/billing">Billing</NavSubItem>
  </NavSubItemGroup>
</NavCategory>
```

Notes:

- `NavCategoryItem` reads its identity from the enclosing `NavCategory`; the value that `onNavCategoryItemToggle` reports is the **category's** `value`.
- Sub items must live inside a `NavSubItemGroup` inside the category; they inherit the category context and disappear when it collapses.
- Add `multiple` to the drawer when several categories may be expanded at the same time; omit it for an accordion-style rail.

## 5. Branding, sections and dividers

Use `AppItem` for the application root (it renders an anchor when `href` is provided) and `AppItemStatic` when the brand area must not be a link (for example when a Hamburger sits next to it). Group long rails with `NavSectionHeader` and separate logical blocks with `NavDivider`:

```tsx
<AppItem href="/" icon={<LogoIcon />}>Contoso Ops</AppItem>
<NavItem value="home" href="/home" icon={<HomeIcon />}>Home</NavItem>
<NavSectionHeader>Analytics</NavSectionHeader>
{/* categories ... */}
<NavDivider />
<NavItem value="settings" href="/settings" icon={<SettingsIcon />}>Settings</NavItem>
```

## 6. Put account actions in the footer

`NavDrawerFooter` is a real footer region — the natural home for the signed-in user and global actions. A `Menu` keeps the rail compact while exposing account settings and sign out:

```tsx
<NavDrawerFooter>
  <Menu>
    <MenuTrigger disableButtonEnhancement>
      <Button
        appearance="subtle"
        icon={<Avatar name="Ada Lovelace" size={24} />}
        style={{ width: "100%", justifyContent: "flex-start" }}
      >
        Ada Lovelace
      </Button>
    </MenuTrigger>
    <MenuPopover>
      <MenuList>
        <MenuItem>Account settings</MenuItem>
        <MenuDivider />
        <MenuItem>Sign out</MenuItem>
      </MenuList>
    </MenuPopover>
  </Menu>
</NavDrawerFooter>
```

## 7. Responsive overlay navigation

On narrow viewports the same rail becomes an overlay that is opened by a `Hamburger` and closes itself as soon as the user picks a destination. Because `open` is controlled, the `onNavItemSelect` handler is the single place that both records the selection and dismisses the drawer:

```tsx
const [isNavOpen, setIsNavOpen] = React.useState(false);

<Tooltip content="Open navigation" relationship="label">
  <Hamburger onClick={() => setIsNavOpen(true)} />
</Tooltip>

<NavDrawer
  type="overlay"
  open={isNavOpen}
  selectedValue={selectedValue}
  onNavItemSelect={(_event, data) => {
    setSelectedValue(String(data.value));
    setIsNavOpen(false);
  }}
>
  ...
</NavDrawer>
```

Always pair the overlay with a visible close affordance in `NavDrawerHeader` so users are never trapped with a controlled `open`.

## 8. Mirror the location with Breadcrumb

Breadcrumbs complete the picture for pages deep in a hierarchy. Render them next to the content, label the region, and mark the last crumb with `current` (it is then exposed as the current page and should not be a link):

```tsx
<Breadcrumb aria-label="Breadcrumb">
  <BreadcrumbItem>
    <BreadcrumbButton>Home</BreadcrumbButton>
  </BreadcrumbItem>
  <BreadcrumbDivider />
  <BreadcrumbItem>
    <BreadcrumbButton current>{currentPage}</BreadcrumbButton>
  </BreadcrumbItem>
</Breadcrumb>
```

Drive `currentPage` from the same `selectedValue` used by the rail so the two can never drift apart. Use `focusMode="tab"` on `Breadcrumb` when the trail is long and you want Tab (instead of arrow keys) to move between crumbs.

## 9. Menu-bar variant

For command-style apps, a `Menu` bar with nested `Menu` for submenus replaces the rail. Nest the child `Menu` **inside** `MenuList` and give the parent `MenuItem` `hasSubmenu`:

```tsx
<Menu>
  <MenuTrigger disableButtonEnhancement>
    <Button appearance="subtle">File</Button>
  </MenuTrigger>
  <MenuPopover>
    <MenuList>
      <MenuItem onClick={() => setPage("Untitled document")}>New document</MenuItem>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuItem hasSubmenu>Open recent</MenuItem>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem onClick={() => setPage("quarterly-report.docx")}>quarterly-report.docx</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <MenuDivider />
      <MenuItem>Sign out</MenuItem>
    </MenuList>
  </MenuPopover>
</Menu>
```

## Layout notes

- Put the rail and the content area in a flex row and give the content `flex: 1; minWidth: 0` so wide tables and long titles can shrink instead of pushing the rail off screen.
- The inline drawer draws its own surface and border; keep page padding on the content element, not on the drawer.
- Icons render at 20px inside nav items; use a single small icon component per destination and mark decorative graphics `aria-hidden` / `focusable="false"`.
- Keep the rail footer to one or two rows — anything more belongs in a page-level settings surface.

## Accessibility checkpoints

- Label every navigation landmark; `Breadcrumb` accepts `aria-label`, and the rail needs a recognizable title (the visible text in `NavDrawerHeader` serves this purpose).
- Selection state and the `current` breadcrumb must match the rendered route so assistive technology announces the page the user is actually on.

## Examples

### App shell with an inline navigation drawer

Desktop-first shell: a persistent NavDrawer rail with app branding (AppItem), flat destinations, a section header, two expandable categories with sub items, a divider, an account Menu in the footer, and a Breadcrumb that mirrors the controlled selectedValue.

```tsx
import * as React from "react";
import {
  AppItem,
  Avatar,
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Button,
  FluentProvider,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
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
  Text,
} from "@fluentui/react-components";

/* Decorative inline icons keep this example dependency-free.
   Replace them with @fluentui/react-icons in a real app. */
const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
} as const;

const LogoIcon = () => (
  <svg {...iconProps}>
    <rect x="2.5" y="2.5" width="15" height="15" rx="4" />
  </svg>
);

const HomeIcon = () => (
  <svg {...iconProps}>
    <path d="M3 9 10 3l7 6v8H3V9Z" />
  </svg>
);

const TeamIcon = () => (
  <svg {...iconProps}>
    <circle cx="8" cy="7" r="3" />
    <path d="M2.5 17c0-2.5 2.5-4 5.5-4s5.5 1.5 5.5 4" />
  </svg>
);

const ReportsIcon = () => (
  <svg {...iconProps}>
    <path d="M4 17V9M10 17V4M16 17v-5" />
  </svg>
);

const InboxIcon = () => (
  <svg {...iconProps}>
    <path d="M3 4h14v12H3V4Z" />
    <path d="M3 11h4l1 2h4l1-2h4" />
  </svg>
);

const SettingsIcon = () => (
  <svg {...iconProps}>
    <circle cx="10" cy="10" r="3" />
    <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.9 4.9l1.4 1.4M13.7 13.7l1.4 1.4M15.1 4.9l-1.4 1.4M6.3 13.7l-1.4 1.4" />
  </svg>
);

const pages: Record<string, string> = {
  home: "Home",
  team: "Team",
  "reports-usage": "Usage",
  "reports-billing": "Billing",
  "inbox-unread": "Unread",
  "inbox-archived": "Archived",
  settings: "Settings",
};

export const AppShell: React.FC = () => {
  const [selectedValue, setSelectedValue] = React.useState("home");
  const [openCategories, setOpenCategories] = React.useState<string[]>(["reports"]);

  const currentPage = pages[selectedValue] ?? "Home";

  return (
    <FluentProvider>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <NavDrawer
          open
          type="inline"
          separator
          selectedValue={selectedValue}
          openCategories={openCategories}
          onNavItemSelect={(_event, data) => setSelectedValue(String(data.value))}
          onNavCategoryItemToggle={(_event, data) => {
            const value = String(data.value);
            setOpenCategories((current) =>
              current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value],
            );
          }}
        >
          <NavDrawerHeader>
            <Text weight="semibold">Contoso Ops</Text>
          </NavDrawerHeader>

          <NavDrawerBody>
            <AppItem href="/" icon={<LogoIcon />}>
              Contoso Ops
            </AppItem>

            <NavItem value="home" href="/home" icon={<HomeIcon />}>
              Home
            </NavItem>
            <NavItem value="team" href="/team" icon={<TeamIcon />}>
              Team
            </NavItem>

            <NavSectionHeader>Analytics</NavSectionHeader>

            <NavCategory value="reports">
              <NavCategoryItem icon={<ReportsIcon />}>Reports</NavCategoryItem>
              <NavSubItemGroup>
                <NavSubItem value="reports-usage" href="/reports/usage">
                  Usage
                </NavSubItem>
                <NavSubItem value="reports-billing" href="/reports/billing">
                  Billing
                </NavSubItem>
              </NavSubItemGroup>
            </NavCategory>

            <NavCategory value="inbox">
              <NavCategoryItem icon={<InboxIcon />}>Inbox</NavCategoryItem>
              <NavSubItemGroup>
                <NavSubItem value="inbox-unread" href="/inbox/unread">
                  Unread
                </NavSubItem>
                <NavSubItem value="inbox-archived" href="/inbox/archived">
                  Archived
                </NavSubItem>
              </NavSubItemGroup>
            </NavCategory>

            <NavDivider />

            <NavItem value="settings" href="/settings" icon={<SettingsIcon />}>
              Settings
            </NavItem>
          </NavDrawerBody>

          <NavDrawerFooter>
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <Button
                  appearance="subtle"
                  icon={<Avatar name="Ada Lovelace" size={24} />}
                  style={{ width: "100%", justifyContent: "flex-start" }}
                >
                  Ada Lovelace
                </Button>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem>Account settings</MenuItem>
                  <MenuItem>Preferences</MenuItem>
                  <MenuDivider />
                  <MenuItem>Sign out</MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </NavDrawerFooter>
        </NavDrawer>

        <main style={{ flex: 1, minWidth: 0, padding: 24 }}>
          <Breadcrumb aria-label="Breadcrumb">
            <BreadcrumbItem>
              <BreadcrumbButton>Home</BreadcrumbButton>
            </BreadcrumbItem>
            <BreadcrumbDivider />
            <BreadcrumbItem>
              <BreadcrumbButton current>{currentPage}</BreadcrumbButton>
            </BreadcrumbItem>
          </Breadcrumb>

          <h1 style={{ margin: "16px 0 8px", fontSize: 28 }}>{currentPage}</h1>
          <Text block>
            Selecting an entry in the rail updates <code>selectedValue</code>, which drives both
            the highlighted navigation entry and the breadcrumb on this page.
          </Text>
        </main>
      </div>
    </FluentProvider>
  );
};
```

### Responsive overlay navigation for narrow screens

Mobile pattern: a compact app bar with a Hamburger (labelled via Tooltip) opens an overlay NavDrawer that closes automatically after a selection, plus an explicit close button and a static AppItemStatic brand header.

```tsx
import * as React from "react";
import {
  AppItemStatic,
  Avatar,
  Button,
  FluentProvider,
  Hamburger,
  NavDivider,
  NavDrawer,
  NavDrawerBody,
  NavDrawerFooter,
  NavDrawerHeader,
  NavItem,
  Text,
  Tooltip,
} from "@fluentui/react-components";

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
} as const;

const LogoIcon = () => (
  <svg {...iconProps}>
    <rect x="2.5" y="2.5" width="15" height="15" rx="4" />
  </svg>
);

const DismissIcon = () => (
  <svg {...iconProps}>
    <path d="M5 5l10 10M15 5 5 15" />
  </svg>
);

const InboxIcon = () => (
  <svg {...iconProps}>
    <path d="M3 4h14v12H3V4Z" />
    <path d="M3 11h4l1 2h4l1-2h4" />
  </svg>
);

const DraftsIcon = () => (
  <svg {...iconProps}>
    <path d="M4 3h8l4 4v10H4V3Z" />
    <path d="M12 3v4h4" />
  </svg>
);

const SentIcon = () => (
  <svg {...iconProps}>
    <path d="M2.5 10 17.5 3l-4 14-3.5-5.5L2.5 10Z" />
  </svg>
);

const ArchiveIcon = () => (
  <svg {...iconProps}>
    <path d="M3 4h14v4H3V4Z" />
    <path d="M4.5 8v8h11V8" />
    <path d="M8 11h4" />
  </svg>
);

const folderPages: Record<string, string> = {
  inbox: "Inbox",
  drafts: "Drafts",
  sent: "Sent items",
  archive: "Archive",
};

export const NarrowScreenNavigation: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("inbox");

  const closeNavigation = React.useCallback(() => setIsNavOpen(false), []);
  const currentFolder = folderPages[selectedValue] ?? "Inbox";

  return (
    <FluentProvider>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 16px",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Tooltip content="Open navigation" relationship="label">
          <Hamburger onClick={() => setIsNavOpen(true)} />
        </Tooltip>

        <Text weight="semibold">Contoso Mail</Text>

        <div style={{ marginInlineStart: "auto" }}>
          <Tooltip content="Account" relationship="label">
            <Button
              appearance="transparent"
              shape="circular"
              icon={<Avatar name="Ada Lovelace" size={28} />}
            />
          </Tooltip>
        </div>
      </header>

      <NavDrawer
        type="overlay"
        open={isNavOpen}
        selectedValue={selectedValue}
        onNavItemSelect={(_event, data) => {
          setSelectedValue(String(data.value));
          closeNavigation();
        }}
      >
        <NavDrawerHeader
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <AppItemStatic icon={<LogoIcon />}>Contoso Mail</AppItemStatic>
          <Tooltip content="Close navigation" relationship="label">
            <Button appearance="subtle" icon={<DismissIcon />} onClick={closeNavigation} />
          </Tooltip>
        </NavDrawerHeader>

        <NavDrawerBody>
          <NavItem value="inbox" icon={<InboxIcon />}>
            Inbox
          </NavItem>
          <NavItem value="drafts" icon={<DraftsIcon />}>
            Drafts
          </NavItem>
          <NavItem value="sent" icon={<SentIcon />}>
            Sent items
          </NavItem>
          <NavDivider />
          <NavItem value="archive" icon={<ArchiveIcon />}>
            Archive
          </NavItem>
        </NavDrawerBody>

        <NavDrawerFooter>
          <Text size={200}>Signed in as ada@contoso.com</Text>
        </NavDrawerFooter>
      </NavDrawer>

      <main style={{ padding: 24 }}>
        <h1 style={{ margin: "0 0 8px", fontSize: 24 }}>{currentFolder}</h1>
        <Text block>
          The drawer closes automatically after a selection because the controlled <code>open</code>{" "}
          state is updated inside the <code>onNavItemSelect</code> handler.
        </Text>
      </main>
    </FluentProvider>
  );
};
```

### Menu-bar navigation with nested submenus and breadcrumbs

Command-style, document-centric navigation: a top Menu bar built from Menu, MenuTrigger, MenuPopover, MenuList and MenuItem, including a nested Menu exposed through a MenuItem with hasSubmenu, plus a Breadcrumb that shows the active page.

```tsx
import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Button,
  FluentProvider,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Text,
} from "@fluentui/react-components";

export const MenuBarNavigation: React.FC = () => {
  const [page, setPage] = React.useState("Dashboard");

  return (
    <FluentProvider>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "8px 16px",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Text weight="semibold" style={{ marginRight: 16 }}>
          Contoso Studio
        </Text>

        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button appearance="subtle">File</Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem onClick={() => setPage("Untitled document")}>New document</MenuItem>
              <Menu>
                <MenuTrigger disableButtonEnhancement>
                  <MenuItem hasSubmenu>Open recent</MenuItem>
                </MenuTrigger>
                <MenuPopover>
                  <MenuList>
                    <MenuItem onClick={() => setPage("quarterly-report.docx")}>
                      quarterly-report.docx
                    </MenuItem>
                    <MenuItem onClick={() => setPage("roadmap.pptx")}>roadmap.pptx</MenuItem>
                  </MenuList>
                </MenuPopover>
              </Menu>
              <MenuDivider />
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>

        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button appearance="subtle">View</Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem onClick={() => setPage("Dashboard")}>Dashboard</MenuItem>
              <MenuItem onClick={() => setPage("Reports")}>Reports</MenuItem>
              <MenuItem onClick={() => setPage("Settings")}>Settings</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </header>

      <div style={{ padding: "12px 16px" }}>
        <Breadcrumb aria-label="Breadcrumb">
          <BreadcrumbItem>
            <BreadcrumbButton>Home</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton current>{page}</BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      <main style={{ padding: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>{page}</h1>
      </main>
    </FluentProvider>
  );
};
```

## Pitfalls

- Mixing controlled and uncontrolled selection: passing `defaultSelectedValue` together with `selectedValue` (or `defaultOpenCategories` with `openCategories`) makes the default silently ignored. Use the `default*` props only for prototypes, and switch entirely to controlled props when selection must drive routing, the page heading, or the breadcrumb.
- Missing or duplicated `value`s: `value` is the key that links a `NavItem`/`NavSubItem` to `selectedValue`, to the `onNavItemSelect` payload and to the open-category bookkeeping. Duplicate or missing values cause the wrong row to highlight or categories that refuse to collapse — keep the list of destinations in one typed array and derive both the JSX and the state from it.
- Passing your own `value` to `NavCategoryItem`, or using `NavSubItem` outside a `NavSubItemGroup`: the category item inherits its identity from the enclosing `NavCategory` (whose `value` is what the toggle handler reports), and sub items only render inside a `NavSubItemGroup` within that category.
- Rendering a second interactive element inside a nav entry: `NavItem`, `NavSubItem` and `AppItem` already render a button/anchor when `href` is set. Do not nest another `Button` or `Link` inside them for navigation; put actions in the footer, in a `Menu`, or in the page content instead.
- Leaving the overlay drawer open after navigation: on narrow screens, close the drawer from `onNavItemSelect` (and provide an explicit close button in `NavDrawerHeader`). With a fully controlled `open` state there is no automatic dismissal, so users can end up staring at a drawer over the page they just opened.
- Full-page reloads for client-side routes: `href` renders a plain anchor. Wire the value through your router (intercept the click, or render your router's link element inside the nav item) so the `selectedValue` state and the URL stay in sync without a document reload.
- Icon-only triggers without accessible names: `Hamburger` and icon-only `Button`s in the drawer header are unlabelled by default. Wrap them in `<Tooltip relationship="label">` or add `aria-label`, and mark decorative SVGs with `aria-hidden="false"`-free semantics (`aria-hidden="true"` / `focusable="false"`).
- Hard-coding text labels separate from `value`s: keeping a second `Record<value, label>` map that drifts from the JSX is a common source of mismatched breadcrumbs and headings. Derive labels from the same destination model that produces the nav items.

## Accessibility

Navigation landmarks: `NavDrawer` renders a navigation landmark and the breadcrumb is a second one, so make each region recognisable — give the breadcrumb an accessible name (`<Breadcrumb aria-label="Breadcrumb">`) and keep a visible title in `NavDrawerHeader` so the rail region is identifiable. Never nest a `Nav` inside a `NavDrawer`; add breadcrumbs, menus and toolbars as siblings instead. Selection vs. route: the state that highlights a `NavItem` / `NavSubItem` (`selectedValue`) and the crumb marked `current` must be derived from the same value, otherwise assistive technology announces a location that is not the page actually shown. The `current` crumb is exposed as the current page, so never make it a link. Icon-only controls: `Hamburger` and the drawer close button have no visible text, so label them with `<Tooltip content="…" relationship="label">` (or `aria-label`) so they announce a name. Decorative graphics: mark inline SVG icons `aria-hidden="true"` and `focusable="false"` so they are skipped by screen readers and cannot receive focus in older browsers. Keyboard behaviour: `Hamburger`, close and footer triggers are real buttons and therefore tabbable; the nav entries render anchors when `href` is provided, so Enter follows the link. Focus management on small screens: when the overlay drawer closes after a selection, move focus to the page heading (a focusable heading or a skip target) so keyboard and screen-reader users are not dropped back at the top of the document. Announcement of state: rely on the components' built-in ARIA reporting for expanded categories and the selected entry rather than adding your own `aria-selected`.

## Components used

- [AppItem](../../components/app-item.md)
- [AppItemStatic](../../components/app-item-static.md)
- [Avatar](../../components/avatar.md)
- [Breadcrumb](../../components/breadcrumb.md)
- [BreadcrumbButton](../../components/breadcrumb-button.md)
- [BreadcrumbDivider](../../components/breadcrumb-divider.md)
- [BreadcrumbItem](../../components/breadcrumb-item.md)
- [Button](../../components/button.md)
- [FluentProvider](../../components/fluent-provider.md)
- [Hamburger](../../components/hamburger.md)
- [Menu](../../components/menu.md)
- [MenuDivider](../../components/menu-divider.md)
- [MenuItem](../../components/menu-item.md)
- [MenuList](../../components/menu-list.md)
- [MenuPopover](../../components/menu-popover.md)
- [MenuTrigger](../../components/menu-trigger.md)
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
- [Text](../../components/text.md)
- [Tooltip](../../components/tooltip.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
