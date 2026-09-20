# Data Table

> **Group**: data

## Goal

Build a production-ready data table with Fluent UI v9: typed column definitions, client-side sorting and filtering, multi-row selection with bulk actions, rich cells (avatar, tinted Badge, PresenceBadge), per-row action menus, and a details Dialog — plus a lighter static Table variant for read-only data.

## When to Use

Use this recipe when users must read and act on tabular data: sortable columns, row selection with bulk actions, per-row menus, rich cell content (avatars, badges, statuses), and keyboard navigation across a grid of rows and columns. Also use the Table variant when you only need a semantic, read-only table.

## When Not to Use

Avoid DataGrid when the data is a flat, simple list (use List + ListItem), a set of equal-weight cards (use Card), or hierarchical (use Tree / FlatTree). For a handful of key/value pairs, Field and Text are lighter. For tens of thousands of rows, paginate or virtualize the data before handing it to the grid, and for spreadsheet-style inline editing embed form controls in cells only if you accept the extra focus management.

## Outcome

A data table that renders typed rows and columns, sorts and filters on the client, supports multi-row selection with a bulk action, renders rich cells (avatar + text, tinted `Badge`, `PresenceBadge`), exposes a per-row action menu, and opens a details `Dialog` — plus a lighter `Table` variant for read-only data.

## Mental model: `DataGrid` is a composition, not a config blob

Five structural pieces, always in the same order:

1. `DataGrid` — owns table state: `items`, `columns`, row identity (`getRowId`) and the selection/sorting options.
2. `DataGridHeader` → `DataGridRow` → `DataGridHeaderCell` — the header row.
3. `DataGridBody` → `DataGridRow` → `DataGridCell` — the body rows.
4. `DataGridBody` and `DataGridRow` take **render functions** as children, so you decide what each cell renders.
5. Columns are data, not JSX: build them with `createTableColumn<T>({ columnId, compare, renderHeaderCell, renderCell })` and type the array as `TableColumnDefinition<T>[]`.

The minimum viable grid:

```tsx
<DataGrid items={items} columns={columns} getRowId={(item) => item.id}>
  <DataGridHeader>
    <DataGridRow>
      {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
    </DataGridRow>
  </DataGridHeader>
  <DataGridBody<Item>>
    {({ item, rowId }) => (
      <DataGridRow<Item> key={rowId}>
        {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
      </DataGridRow>
    )}
  </DataGridBody>
</DataGrid>
```

## 1. Define columns once, typed

`columnId` is the identity used by sorting and column sizing, `compare` powers sorting, and the two render functions return the header label and the cell content.

```tsx
const columns: TableColumnDefinition<TeamMember>[] = [
  createTableColumn<TeamMember>({
    columnId: 'name',
    compare: (a, b) => a.name.localeCompare(b.name),
    renderHeaderCell: () => 'Name',
    renderCell: (member) => (
      <TableCellLayout media={<Avatar name={member.name} />}>{member.name}</TableCellLayout>
    ),
  }),
  // ...one entry per column
];
```

Use `TableCellLayout` for text-heavy cells: `media` (avatar, icon, presence badge), `description` (secondary line such as an email or timestamp), `appearance="primary"` for emphasis, and `truncate` for long values.

## 2. Wire up selection

Set `selectionMode` (`"single"` or `"multiselect"`), read the new selection in `onSelectionChange` (`data.selectedItems` is a `Set` of row ids), and render the selection cell through the `selectionCell` slot on **both** the header row and each body row:

```tsx
<DataGrid
  items={items}
  columns={columns}
  getRowId={(item) => item.id}
  selectionMode="multiselect"
  onSelectionChange={(_event, data) => setSelectedRows(data.selectedItems)}
>
  <DataGridHeader>
    <DataGridRow selectionCell={<DataGridSelectionCell type="checkbox" />}>
      {/* header cells */}
    </DataGridRow>
  </DataGridHeader>
  <DataGridBody<Item>>
    {({ item, rowId }) => (
      <DataGridRow<Item> key={rowId} selectionCell={<DataGridSelectionCell type="checkbox" />}>
        {/* body cells */}
      </DataGridRow>
    )}
  </DataGridBody>
</DataGrid>
```

Use `selectionMode="single"` with `<DataGridSelectionCell type="radio" />` when a row is a single choice. Drive bulk actions from the selection count and keep the bulk button disabled while nothing is selected.

## 3. Sorting: show the direction *and* reorder the data

Sorting has two halves and both are required:

- **Header affordance** — mark the grid `sortable` and give each header cell `sortable` plus the current `sortDirection` for its own `columnId`; the header cell renders the sort glyph from that prop.
- **Row order** — the grid renders exactly the array you pass as `items`, so keep the sort state in React and pass the sorted array.

```tsx
const [sortState, setSortState] = React.useState<{ columnId: string | number | undefined; direction: 'ascending' | 'descending' }>({
  columnId: 'name',
  direction: 'ascending',
});

const sortedItems = React.useMemo(() => {
  const compare = columns.find((column) => column.columnId === sortState.columnId)?.compare;
  if (!compare) {
    return filteredItems;
  }
  const sorted = [...filteredItems].sort(compare); // copy: never sort the source array in place
  return sortState.direction === 'ascending' ? sorted : sorted.reverse();
}, [filteredItems, sortState]);
```

```tsx
{({ renderHeaderCell, columnId }) => (
  <DataGridHeaderCell
    sortable
    sortDirection={sortState.columnId === columnId ? sortState.direction : undefined}
    onClick={() => toggleSort(columnId)}
  >
    {renderHeaderCell()}
  </DataGridHeaderCell>
)}
```

If your grid reports sort changes through `onSortChange`, copy that payload back into your state so the header glyph and the rendered order can never disagree.

## 4. Filtering and the empty state

Filter before the data reaches the grid. Keep the search `Input` outside the table and label it:

```tsx
const filteredItems = React.useMemo(() => {
  const term = query.trim().toLowerCase();
  if (!term) {
    return teamMembers;
  }
  return teamMembers.filter((member) =>
    [member.name, member.email, member.team].some((value) => value.toLowerCase().includes(term)),
  );
}, [query]);
```

When the filtered list is empty, render a `MessageBar` instead of the grid — a grid that shows only its header looks broken.

## 5. Rich cells

Rich cells are just JSX: put an `Avatar` in `TableCellLayout.media`, a secondary line in `description`, and use `Badge` / `PresenceBadge` for status. Keep the status text next to the color so the meaning never depends on hue alone.

```tsx
renderCell: (member) => (
  <TableCellLayout description={member.lastActive}>
    <PresenceBadge status={member.presence} />
  </TableCellLayout>
)
```

## 6. Row actions and details

Give actions their own column. A `Menu` on a `Button` keeps rows compact; label the trigger with the row identity so screen readers do not hear identical buttons:

```tsx
renderCell: (project) => (
  <Menu>
    <MenuTrigger disableButtonEnhancement>
      <Button appearance="subtle" aria-label={`More actions for ${project.name}`}>Actions</Button>
    </MenuTrigger>
    <MenuPopover>
      <MenuList>
        <MenuItem onClick={() => setDetails(project)}>View details</MenuItem>
        <MenuItem>Duplicate</MenuItem>
      </MenuList>
    </MenuPopover>
  </Menu>
)
```

Mark cells that contain controls with `focusMode="group"` (`<DataGridCell focusMode="group">`) so the cell is one focus target. For details, keep a `Project | null` piece of state and drive a controlled `Dialog` (`open={details !== null}` plus `onOpenChange`); the dialog traps focus and restores it to the trigger when it closes.

## 7. Static tables: use `Table` instead

If the table is read-only — no selection, no sorting, no grid keyboard navigation — compose `Table` + `TableHeader` / `TableBody` / `TableRow` / `TableCell` / `TableHeaderCell` directly and skip the render-function API. `TableCellLayout`, `Avatar`, `Badge` and `TableCellActions` (row actions revealed on hover/focus) work the same way.

## Putting it together

The examples below are complete: a sortable, filterable, selectable team directory; a project portfolio with row menus and a details dialog; and a static flight board built with `Table`.

## Examples

### Sortable, filterable and selectable team directory (DataGrid)

A full client-side data table: typed columns created with createTableColumn, rich cells (Avatar, Badge, PresenceBadge), a filter Input, an empty state with MessageBar, multi-row selection with a bulk action, and sortable header cells that reorder the items passed to the grid.

```tsx
import * as React from 'react';
import {
  Avatar,
  Badge,
  Button,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  DataGridSelectionCell,
  Input,
  MessageBar,
  MessageBarBody,
  PresenceBadge,
  TableCellLayout,
  Text,
  createTableColumn,
  type TableColumnDefinition,
} from '@fluentui/react-components';

type Presence = 'available' | 'away' | 'busy' | 'offline';
type Access = 'Owner' | 'Contributor' | 'Viewer';

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  presence: Presence;
  access: Access;
  lastActive: string;
};

const teamMembers: TeamMember[] = [
  {
    id: 'ada',
    name: 'Ada Lovelace',
    email: 'ada@contoso.com',
    role: 'Principal Engineer',
    team: 'Platform',
    presence: 'available',
    access: 'Owner',
    lastActive: '2 minutes ago',
  },
  {
    id: 'grace',
    name: 'Grace Hopper',
    email: 'grace@contoso.com',
    role: 'Staff Engineer',
    team: 'Compilers',
    presence: 'busy',
    access: 'Contributor',
    lastActive: '1 hour ago',
  },
  {
    id: 'margaret',
    name: 'Margaret Hamilton',
    email: 'margaret@contoso.com',
    role: 'Engineering Manager',
    team: 'Flight Software',
    presence: 'available',
    access: 'Owner',
    lastActive: '5 minutes ago',
  },
  {
    id: 'linus',
    name: 'Linus Torvalds',
    email: 'linus@contoso.com',
    role: 'Engineer',
    team: 'Kernel',
    presence: 'away',
    access: 'Contributor',
    lastActive: 'Yesterday',
  },
  {
    id: 'alan',
    name: 'Alan Turing',
    email: 'alan@contoso.com',
    role: 'Researcher',
    team: 'Algorithms',
    presence: 'offline',
    access: 'Viewer',
    lastActive: '3 days ago',
  },
];

const accessColor: Record<Access, 'brand' | 'informative' | 'subtle'> = {
  Owner: 'brand',
  Contributor: 'informative',
  Viewer: 'subtle',
};

const columns: TableColumnDefinition<TeamMember>[] = [
  createTableColumn<TeamMember>({
    columnId: 'name',
    compare: (a, b) => a.name.localeCompare(b.name),
    renderHeaderCell: () => 'Name',
    renderCell: (member) => (
      <TableCellLayout media={<Avatar name={member.name} size={32} />}>{member.name}</TableCellLayout>
    ),
  }),
  createTableColumn<TeamMember>({
    columnId: 'role',
    compare: (a, b) => a.role.localeCompare(b.role),
    renderHeaderCell: () => 'Role',
    renderCell: (member) => <TableCellLayout description={member.email}>{member.role}</TableCellLayout>,
  }),
  createTableColumn<TeamMember>({
    columnId: 'team',
    compare: (a, b) => a.team.localeCompare(b.team),
    renderHeaderCell: () => 'Team',
    renderCell: (member) => member.team,
  }),
  createTableColumn<TeamMember>({
    columnId: 'access',
    compare: (a, b) => a.access.localeCompare(b.access),
    renderHeaderCell: () => 'Access',
    renderCell: (member) => (
      <Badge appearance="tint" color={accessColor[member.access]}>
        {member.access}
      </Badge>
    ),
  }),
  createTableColumn<TeamMember>({
    columnId: 'presence',
    compare: (a, b) => a.presence.localeCompare(b.presence),
    renderHeaderCell: () => 'Status',
    renderCell: (member) => (
      <TableCellLayout description={member.lastActive}>
        <PresenceBadge status={member.presence} />
      </TableCellLayout>
    ),
  }),
];

type SortDirection = 'ascending' | 'descending';

type SortState = {
  columnId: string | number | undefined;
  direction: SortDirection;
};

export const TeamDirectory = () => {
  const [query, setQuery] = React.useState('');
  const [selectedRows, setSelectedRows] = React.useState<Set<string | number>>(new Set());
  const [sortState, setSortState] = React.useState<SortState>({ columnId: 'name', direction: 'ascending' });

  const filteredItems = React.useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return teamMembers;
    }
    return teamMembers.filter((member) =>
      [member.name, member.email, member.role, member.team].some((value) => value.toLowerCase().includes(term)),
    );
  }, [query]);

  const items = React.useMemo(() => {
    const column = columns.find((candidate) => candidate.columnId === sortState.columnId);
    const compare = column?.compare;
    if (!compare) {
      return filteredItems;
    }
    const sorted = [...filteredItems].sort(compare);
    return sortState.direction === 'ascending' ? sorted : sorted.reverse();
  }, [filteredItems, sortState]);

  const toggleSort = (columnId: string | number) => {
    setSortState((previous) => ({
      columnId,
      direction: previous.columnId === columnId && previous.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <Input
          aria-label="Filter team members"
          placeholder="Filter by name, email, role or team"
          value={query}
          onChange={(_event, data) => setQuery(data.value)}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Text>{selectedRows.size} selected</Text>
          <Button
            appearance="primary"
            disabled={selectedRows.size === 0}
            onClick={() => {
              // Run your bulk action here; read the row ids from `selectedRows`.
            }}
          >
            Assign to project
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <MessageBar intent="info">
          <MessageBarBody>No team members match "{query}".</MessageBarBody>
        </MessageBar>
      ) : (
        <DataGrid
          items={items}
          columns={columns}
          sortable
          getRowId={(member) => member.id}
          selectionMode="multiselect"
          onSelectionChange={(_event, data) => setSelectedRows(data.selectedItems)}
          onSortChange={(_event, nextSortState) =>
            setSortState({
              columnId: nextSortState.sortColumn,
              direction: nextSortState.sortDirection ?? 'ascending',
            })
          }
        >
          <DataGridHeader>
            <DataGridRow selectionCell={<DataGridSelectionCell type="checkbox" />}>
              {({ renderHeaderCell, columnId }) => (
                <DataGridHeaderCell
                  sortable
                  sortDirection={sortState.columnId === columnId ? sortState.direction : undefined}
                  onClick={() => toggleSort(columnId)}
                >
                  {renderHeaderCell()}
                </DataGridHeaderCell>
              )}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody<TeamMember>>
            {({ item, rowId }) => (
              <DataGridRow<TeamMember> key={rowId} selectionCell={<DataGridSelectionCell type="checkbox" />}>
                {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )}
    </div>
  );
};
```

### Row action menus and a details dialog (DataGrid)

A project portfolio grid whose action column renders a Menu per row and whose 'View details' item opens a controlled Dialog inside a DialogSurface. Shows focusMode="group" for cells that contain controls and per-row aria-labels for the menu trigger.

```tsx
import * as React from 'react';
import {
  Avatar,
  Badge,
  Button,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Divider,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  TableCellLayout,
  Text,
  createTableColumn,
  type TableColumnDefinition,
} from '@fluentui/react-components';

type ProjectStatus = 'On track' | 'At risk' | 'Blocked';

type Project = {
  id: string;
  name: string;
  owner: string;
  ownerEmail: string;
  status: ProjectStatus;
  dueDate: string;
  budget: string;
};

const projects: Project[] = [
  {
    id: 'atlas',
    name: 'Atlas Replatform',
    owner: 'Priya Nair',
    ownerEmail: 'priya@contoso.com',
    status: 'On track',
    dueDate: 'Mar 14',
    budget: '$420k',
  },
  {
    id: 'beacon',
    name: 'Beacon Mobile App',
    owner: 'Marcus Reid',
    ownerEmail: 'marcus@contoso.com',
    status: 'At risk',
    dueDate: 'Apr 02',
    budget: '$265k',
  },
  {
    id: 'cascade',
    name: 'Cascade Data Migration',
    owner: 'Dana Whitfield',
    ownerEmail: 'dana@contoso.com',
    status: 'Blocked',
    dueDate: 'Mar 28',
    budget: '$180k',
  },
];

const statusColor: Record<ProjectStatus, 'success' | 'warning' | 'danger'> = {
  'On track': 'success',
  'At risk': 'warning',
  Blocked: 'danger',
};

export const ProjectPortfolio = () => {
  const [details, setDetails] = React.useState<Project | null>(null);

  const columns: TableColumnDefinition<Project>[] = [
    createTableColumn<Project>({
      columnId: 'name',
      compare: (a, b) => a.name.localeCompare(b.name),
      renderHeaderCell: () => 'Project',
      renderCell: (project) => (
        <TableCellLayout media={<Avatar name={project.owner} />} description={project.owner}>
          {project.name}
        </TableCellLayout>
      ),
    }),
    createTableColumn<Project>({
      columnId: 'status',
      compare: (a, b) => a.status.localeCompare(b.status),
      renderHeaderCell: () => 'Status',
      renderCell: (project) => (
        <Badge appearance="tint" color={statusColor[project.status]}>
          {project.status}
        </Badge>
      ),
    }),
    createTableColumn<Project>({
      columnId: 'dueDate',
      compare: (a, b) => a.dueDate.localeCompare(b.dueDate),
      renderHeaderCell: () => 'Due date',
      renderCell: (project) => project.dueDate,
    }),
    createTableColumn<Project>({
      columnId: 'budget',
      renderHeaderCell: () => 'Budget',
      renderCell: (project) => project.budget,
    }),
    createTableColumn<Project>({
      columnId: 'actions',
      renderHeaderCell: () => 'Actions',
      renderCell: (project) => (
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button appearance="subtle" aria-label={`More actions for ${project.name}`}>
              Actions
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem onClick={() => setDetails(project)}>View details</MenuItem>
              <MenuItem>Duplicate</MenuItem>
              <MenuItem>Archive</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      ),
    }),
  ];

  return (
    <>
      <DataGrid items={projects} columns={columns} getRowId={(project) => project.id}>
        <DataGridHeader>
          <DataGridRow>
            {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<Project>>
          {({ item, rowId }) => (
            <DataGridRow<Project> key={rowId}>
              {({ renderCell }) => <DataGridCell focusMode="group">{renderCell(item)}</DataGridCell>}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>

      <Dialog
        open={details !== null}
        onOpenChange={(_event, data) => {
          if (!data.open) {
            setDetails(null);
          }
        }}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{details?.name ?? 'Project details'}</DialogTitle>
            <DialogContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Text weight="semibold">{details?.status}</Text>
                <Text>
                  Owner: {details?.owner} ({details?.ownerEmail})
                </Text>
                <Divider />
                <Text>
                  Due {details?.dueDate} · Budget {details?.budget}
                </Text>
              </div>
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Close</Button>
              </DialogTrigger>
              <Button appearance="primary" onClick={() => setDetails(null)}>
                Open workspace
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
};
```

### Read-only flight board (static Table)

The same rich-cell styling without grid interactivity: Table, TableHeader, TableRow, TableHeaderCell, TableBody, TableCell, TableCellLayout and hover-revealed TableCellActions — the right choice when there is no sorting, selection or grid keyboard navigation to support.

```tsx
import {
  Avatar,
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableCellActions,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@fluentui/react-components';

type FlightStatus = 'On time' | 'Boarding' | 'Delayed';

type Flight = {
  id: string;
  number: string;
  airline: string;
  route: string;
  departure: string;
  gate: string;
  status: FlightStatus;
};

const flights: Flight[] = [
  {
    id: 'ba118',
    number: 'BA 118',
    airline: 'British Airways',
    route: 'LHR → JFK',
    departure: '09:40',
    gate: 'A12',
    status: 'Boarding',
  },
  {
    id: 'af1680',
    number: 'AF 1680',
    airline: 'Air France',
    route: 'CDG → BER',
    departure: '11:05',
    gate: 'C3',
    status: 'On time',
  },
  {
    id: 'lh441',
    number: 'LH 441',
    airline: 'Lufthansa',
    route: 'FRA → ORD',
    departure: '12:25',
    gate: 'B7',
    status: 'Delayed',
  },
];

const statusColor: Record<FlightStatus, 'informative' | 'success' | 'warning'> = {
  'On time': 'success',
  Boarding: 'informative',
  Delayed: 'warning',
};

export const FlightBoard = () => (
  <Table aria-label="Flights departing today">
    <TableHeader>
      <TableRow>
        <TableHeaderCell>Flight</TableHeaderCell>
        <TableHeaderCell>Route</TableHeaderCell>
        <TableHeaderCell>Departure</TableHeaderCell>
        <TableHeaderCell>Gate</TableHeaderCell>
        <TableHeaderCell>Status</TableHeaderCell>
        <TableHeaderCell>Actions</TableHeaderCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      {flights.map((flight) => (
        <TableRow key={flight.id}>
          <TableCell>
            <TableCellLayout media={<Avatar name={flight.airline} shape="square" />} description={flight.airline}>
              {flight.number}
            </TableCellLayout>
          </TableCell>
          <TableCell>{flight.route}</TableCell>
          <TableCell>{flight.departure}</TableCell>
          <TableCell>{flight.gate}</TableCell>
          <TableCell>
            <Badge appearance="tint" color={statusColor[flight.status]}>
              {flight.status}
            </Badge>
          </TableCell>
          <TableCell>
            <TableCellActions>
              <Button appearance="subtle" size="small" aria-label={`Check in for flight ${flight.number}`}>
                Check in
              </Button>
            </TableCellActions>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
```

## Pitfalls

- Missing or unstable row identity: always pass getRowId and set key={rowId} on DataGridRow. Without a unique id, selection and sorting attach to the wrong row and React logs key warnings.
- Half-wired selection: selectionCell={<DataGridSelectionCell type="checkbox" />} must be on the header DataGridRow (select-all) AND on every body DataGridRow. Putting it inside renderCell, or omitting it from the header, leaves the selection column partially wired.
- Showing the sort glyph without reordering: header cells only render the affordance when marked sortable, and a sort direction that does not match the items array is a lie. The grid renders exactly the array you pass, so sort a copy and pass the sorted result (mirror onSortChange back into that state).
- Sorting in place: items.sort(compare) mutates the array you were given and reverse() mutates too. Spread first (`[...items].sort(compare)`) and reverse the copy, otherwise unrelated state or props change behind your back.
- Memoized columns closing over stale values: if the column array lives in React.useMemo, list every value its renderCell functions read (selection, sort state, callbacks, translated labels) or cells will render old data — or define the columns inside the component, as the portfolio example does.
- Skipping the item generic: type the render functions with the row type (`<DataGridBody<Item>>` and `<DataGridRow<Item>>`) so renderCell(item) is typed; without it, item is untyped and cell bugs surface at runtime.
- No empty state: with zero items the grid still renders its header, which looks broken. Branch before the grid and show a MessageBar (or a single empty row).
- Controls without focus grooming: cells that contain buttons or menus should set focusMode="group" on DataGridCell so the cell is a single focus target, and every trigger needs an aria-label that names the row — otherwise keyboard and screen reader users must tab through every control of every row.

## Accessibility

Give every table an accessible name: aria-label on DataGrid / Table, or an aria-labelledby pointing at a visible heading.

Selection: the grid renders the checkbox (or radio) affordance and exposes select-all on the header row. Keep the selection cell as the first cell of every row so row and column counts stay predictable, and treat data.selectedItems as read-only — replace the whole Set instead of mutating it.

Sorting: expose the state through the header cell (sortable plus sortDirection) so the announced sort state matches reality and the sort control stays keyboard operable. Do not hand-roll an icon-only click target for sorting.

Rows with controls: use focusMode="group" on DataGridCell so keyboard users land on the cell instead of tabbing through every control in every row, and label generic or icon-only triggers with the row identity (aria-label={`More actions for ${project.name}`}) — repeated unlabeled "Actions" buttons are noise for screen reader users.

Announce state changes: render a MessageBar when a bulk action completes or a filter matches nothing, and reserve politeness="assertive" for errors.

Never encode status with color alone — the Badge and PresenceBadge cells in this recipe always carry a text label ("On track", "Blocked", "Viewer"), and the Avatar is paired with a visible name.

The details Dialog moves focus into the surface and returns it to the trigger when it closes; keep the trigger mounted while the dialog is open and avoid opening it from inside a keyboard trap.

## Components used

- [Avatar](../../components/avatar.md)
- [Badge](../../components/badge.md)
- [Button](../../components/button.md)
- [DataGrid](../../components/data-grid.md)
- [DataGridBody](../../components/data-grid-body.md)
- [DataGridCell](../../components/data-grid-cell.md)
- [DataGridHeader](../../components/data-grid-header.md)
- [DataGridHeaderCell](../../components/data-grid-header-cell.md)
- [DataGridRow](../../components/data-grid-row.md)
- [DataGridSelectionCell](../../components/data-grid-selection-cell.md)
- [Dialog](../../components/dialog.md)
- [DialogActions](../../components/dialog-actions.md)
- [DialogBody](../../components/dialog-body.md)
- [DialogContent](../../components/dialog-content.md)
- [DialogSurface](../../components/dialog-surface.md)
- [DialogTitle](../../components/dialog-title.md)
- [DialogTrigger](../../components/dialog-trigger.md)
- [Divider](../../components/divider.md)
- [Input](../../components/input.md)
- [Menu](../../components/menu.md)
- [MenuItem](../../components/menu-item.md)
- [MenuList](../../components/menu-list.md)
- [MenuPopover](../../components/menu-popover.md)
- [MenuTrigger](../../components/menu-trigger.md)
- [MessageBar](../../components/message-bar.md)
- [MessageBarBody](../../components/message-bar-body.md)
- [PresenceBadge](../../components/presence-badge.md)
- [Table](../../components/table.md)
- [TableBody](../../components/table-body.md)
- [TableCell](../../components/table-cell.md)
- [TableCellActions](../../components/table-cell-actions.md)
- [TableCellLayout](../../components/table-cell-layout.md)
- [TableHeader](../../components/table-header.md)
- [TableHeaderCell](../../components/table-header-cell.md)
- [TableRow](../../components/table-row.md)
- [Text](../../components/text.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
