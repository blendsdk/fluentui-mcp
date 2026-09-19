# Data Table

> **Group**: data

## Goal

Build a typed, data-driven Fluent UI v9 data table with sortable column headers, row selection, filtering, rich cells, per-row actions, and empty/loading/pagination states, by composing the Table family with form controls and feedback components.

## When to Use

Use this recipe when you render a homogeneous set of records as rows/columns and need at least one interactive behavior: sorting, row selection, per-row actions, filtering, pagination, or empty/loading states. It is the right level of abstraction for admin surfaces, project/asset lists, team rosters, deployment histories and similar 'one array of objects + a few columns' screens where you own the data pipeline (filter -> sort -> page) and want plain DOM rows with full control over cell content.

## When Not to Use

Avoid hand-composing Table when you need column resizing/reordering, virtualized rendering of tens of thousands of rows, or a fully declarative column model with column renderers - use the richer DataGrid component from the same package (or a virtualization library) instead. Also skip it for layout-only grids (use CSS Grid or Card), for two-column master/detail views, and for tiny key/value summaries where a List or definition list reads better.

## Overview

Fluent UI's `Table` family is a set of composable primitives, not a batteries-included grid. You own the data pipeline; the table owns rendering plus the sort/selection plumbing. This recipe wires both halves together.

**You will build:** a table with a search box, a status filter, sortable columns, multi-row selection with a live count, rich cells (badges and avatars), row actions, empty and loading states, and client-side pagination.

The pattern is always three layers:

1. **Data** - one array of records, each with a stable `id`.
2. **Derived rows** - a `useMemo` that filters, then sorts, then (optionally) slices for the current page.
3. **Presentation** - `Table` + header/body/row/cell components that render the derived rows.

All interactive state (query, status filter, sort, page) lives in your component; the table reports back only through `onSortChange` and `onSelectionChange`.

## Anatomy: which component does what

| Component | Role |
| --- | --- |
| `Table` | Root. Owns the sort (`sortable`, `onSortChange`) and selection (`selectionMode`, `onSelectionChange`) plumbing and renders the table element. Give it an `aria-label`. |
| `TableHeader` / `TableRow` / `TableHeaderCell` | Header pieces. `TableHeaderCell` renders a `th`; add `sortable` and `sortDirection` to turn it into a sort control with an indicator. |
| `TableBody` / `TableRow` / `TableCell` | Body pieces - one `TableRow` per record, with a stable React `key`. |
| `TableCellLayout` | Lays out the contents of a cell; `truncate` clips long values with an ellipsis. |
| `TableSelectionCell` | The selection cell: `type="checkbox"` for multiselect, `type="radio"` for single select, `hidden` to omit it from the header row. |

## Step 1 - Model the data

Give every record a stable string id (it is both the React `key` and the value reported back by selection), and put the sortable columns in a typed comparator map so sorting logic never leaks into JSX:

```ts
type SortColumn = 'name' | 'owner' | 'status' | 'updated';
type SortDirection = 'ascending' | 'descending';

const comparators: Record<SortColumn, (a: Project, b: Project) => number> = {
  name: (a, b) => a.name.localeCompare(b.name),
  owner: (a, b) => a.owner.localeCompare(b.owner),
  status: (a, b) => a.status.localeCompare(b.status),
  updated: (a, b) => a.updated.localeCompare(b.updated),
};
```

## Step 2 - Derive the visible rows in one useMemo

```tsx
const rows = React.useMemo(() => {
  const filtered = projects.filter(/* query + status predicates */);
  if (!sort) return filtered;
  const sorted = [...filtered].sort(comparators[sort.column]);
  return sort.direction === 'descending' ? sorted.reverse() : sorted;
}, [query, status, sort]);
```

Order matters: **filter -> sort -> slice**. Always copy before sorting (`[...filtered].sort(...)`); never mutate the source array. Keeping the work in `useMemo` also keeps the array identity stable so rows only re-render when they must.

## Step 3 - Sorting

Mark the table as `sortable` and keep the reported sort state yourself:

```tsx
<Table sortable onSortChange={(_ev, sortState) => setSort({ column: sortState.sortColumn as SortColumn, direction: sortState.sortDirection })}>
```

Then feed the direction back into each sortable header so the indicator always matches the data you render:

```tsx
<TableHeaderCell sortable sortDirection={sortDirectionFor('name')}>Name</TableHeaderCell>
```

`sortDirectionFor` is a two-line helper: return `sort.direction` when `sort.column` matches, otherwise `undefined`. Columns that are not sortable simply omit the `sortable` prop.

## Step 4 - Selection

Set `selectionMode` on `Table` (`"multiselect"` or `"single"`) and render a `TableSelectionCell` in each body row. For multiselect, add one to the header row as well (select-all). For single selection, use `type="radio"` and mark the header cell `hidden`:

```tsx
<Table selectionMode="multiselect" onSelectionChange={(_ev, data) => setSelectedItems(new Set<string | number>(data.selectedItems))}>
```

The table owns the selection state; the callback is a notification carrying `data.selectedItems` (a `Set` of row ids). Mirror it into your own state to drive a selection count, bulk-action buttons, or a disabled state. Clicking anywhere in a selectable row toggles it, so any control inside the row must call `event.stopPropagation()`.

## Step 5 - Rich cells

Keep cells one idea deep and let layout primitives do the work:

- Text cells: `TableCellLayout truncate` around a plain string.
- Status cells: a `Badge` with `appearance="tint"` and a semantic `color` (`success`, `warning`, `subtle`, ...).
- People cells: `Avatar name={...} size={28}` next to a two-line `Text` stack (`weight="semibold"` for the name, `size={200}` for the secondary line). Wrap the stack in `TableCellLayout` and use `display: flex` on an inner `div` to keep the avatar inline.
- Action cells: `Button appearance="subtle"` - real, focusable buttons rather than clickable rows.

## Step 6 - Empty and loading states

Keep the header visible and render a single full-width row inside `TableBody`:

```tsx
<TableRow>
  <TableCell colSpan={5}>
    <TableCellLayout>No projects match the current filters.</TableCellLayout>
  </TableCell>
</TableRow>
```

When filters caused the emptiness, add a "Clear filters" `Button` in the same cell. While data loads, swap the row for a `Spinner` plus a sentence ("Loading deployments...") so the state is not conveyed by motion alone.

## Step 7 - Pagination

Sort and filter first, then slice: `const pageRows = rows.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)`. Put the range summary and Previous/Next `Button`s *outside* the table, and clamp the current page (`Math.min(page, pageCount - 1)`) so filtering can never leave you on a page that no longer exists.

## Recap

`Table` + `TableHeader`/`TableBody` + `TableRow`/`TableCell`/`TableCellLayout` + `TableSelectionCell` is enough for a production-quality list view when you pair it with `Input`/`Select` for filters, `Badge`/`Avatar`/`Text` for cell content, `Button` for actions, and `Spinner` for async states. See the examples for the complete, copy-pasteable versions.

## Examples

### Sortable, filterable, selectable project table

The full recipe: typed records, a search box and status filter, sortable headers driven by Table's sort props, multiselect rows with a live selection count, badge cells, and an empty state with a 'Clear filters' recovery action.

```tsx
import * as React from 'react';
import {
  Badge,
  Button,
  Input,
  Select,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell,
  Text,
} from '@fluentui/react-components';

type ProjectStatus = 'active' | 'paused' | 'archived';

interface Project {
  id: string;
  name: string;
  owner: string;
  status: ProjectStatus;
  updated: string;
}

const projects: Project[] = [
  { id: 'p-1', name: 'Fluent UI v9 rollout', owner: 'Katri Athokas', status: 'active', updated: '2024-06-03' },
  { id: 'p-2', name: 'Design token audit', owner: 'Ben Adams', status: 'active', updated: '2024-05-21' },
  { id: 'p-3', name: 'Accessibility sweep', owner: 'Carole Poland', status: 'paused', updated: '2024-04-02' },
  { id: 'p-4', name: 'Legacy theme migration', owner: 'Katri Athokas', status: 'archived', updated: '2024-01-19' },
  { id: 'p-5', name: 'Documentation rewrite', owner: 'Diego Siciliani', status: 'active', updated: '2024-06-11' },
];

type SortColumn = 'name' | 'owner' | 'status' | 'updated';
type SortDirection = 'ascending' | 'descending';

const comparators: Record<SortColumn, (a: Project, b: Project) => number> = {
  name: (a, b) => a.name.localeCompare(b.name),
  owner: (a, b) => a.owner.localeCompare(b.owner),
  status: (a, b) => a.status.localeCompare(b.status),
  updated: (a, b) => a.updated.localeCompare(b.updated),
};

const statusColor: Record<ProjectStatus, 'success' | 'warning' | 'subtle'> = {
  active: 'success',
  paused: 'warning',
  archived: 'subtle',
};

export const ProjectsTable = () => {
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState<'all' | ProjectStatus>('all');
  const [sort, setSort] = React.useState<{ column: SortColumn; direction: SortDirection } | null>(null);
  const [selectedItems, setSelectedItems] = React.useState<Set<string | number>>(new Set<string | number>());

  const rows = React.useMemo(() => {
    const needle = query.trim().toLowerCase();

    const filtered = projects.filter(
      (project) =>
        (status === 'all' || project.status === status) &&
        (needle === '' ||
          project.name.toLowerCase().includes(needle) ||
          project.owner.toLowerCase().includes(needle)),
    );

    if (!sort) {
      return filtered;
    }

    const sorted = [...filtered].sort(comparators[sort.column]);
    return sort.direction === 'descending' ? sorted.reverse() : sorted;
  }, [query, status, sort]);

  const sortDirectionFor = (column: SortColumn): SortDirection | undefined =>
    sort?.column === column ? sort.direction : undefined;

  const clearFilters = () => {
    setQuery('');
    setStatus('all');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <Input
          aria-label="Filter projects"
          placeholder="Filter by name or owner"
          value={query}
          onChange={(_ev, data) => setQuery(data.value)}
        />
        <Select
          aria-label="Filter by status"
          onChange={(_ev, data) => setStatus(data.value as 'all' | ProjectStatus)}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="archived">Archived</option>
        </Select>
        <Text size={200}>{selectedItems.size} selected</Text>
      </div>

      <Table
        aria-label="Projects"
        sortable
        selectionMode="multiselect"
        onSortChange={(_ev, sortState) =>
          setSort({ column: sortState.sortColumn as SortColumn, direction: sortState.sortDirection })
        }
        onSelectionChange={(_ev, data) => setSelectedItems(new Set<string | number>(data.selectedItems))}
      >
        <TableHeader>
          <TableRow>
            <TableSelectionCell type="checkbox" />
            <TableHeaderCell sortable sortDirection={sortDirectionFor('name')}>
              Name
            </TableHeaderCell>
            <TableHeaderCell sortable sortDirection={sortDirectionFor('owner')}>
              Owner
            </TableHeaderCell>
            <TableHeaderCell sortable sortDirection={sortDirectionFor('status')}>
              Status
            </TableHeaderCell>
            <TableHeaderCell sortable sortDirection={sortDirectionFor('updated')}>
              Last updated
            </TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <TableCellLayout>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <Text>No projects match the current filters.</Text>
                    <Button appearance="secondary" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  </div>
                </TableCellLayout>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((project) => (
              <TableRow key={project.id}>
                <TableSelectionCell type="checkbox" />
                <TableCell>
                  <TableCellLayout truncate>{project.name}</TableCellLayout>
                </TableCell>
                <TableCell>
                  <TableCellLayout truncate>{project.owner}</TableCellLayout>
                </TableCell>
                <TableCell>
                  <TableCellLayout>
                    <Badge appearance="tint" color={statusColor[project.status]}>
                      {project.status}
                    </Badge>
                  </TableCellLayout>
                </TableCell>
                <TableCell>
                  <TableCellLayout truncate>
                    {new Date(project.updated).toLocaleDateString()}
                  </TableCellLayout>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
```

### Compact table with rich cells, row actions, and pagination

A read-only table with avatar + two-line person cells, badge presence indicators, a truncated email exposed via Tooltip, a subtle per-row action button, and client-side pagination with a range summary.

```tsx
import * as React from 'react';
import {
  Avatar,
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  Tooltip,
} from '@fluentui/react-components';

type Presence = 'online' | 'away' | 'offline';

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  presence: Presence;
  joined: string;
}

const members: Member[] = [
  { id: 'm-1', name: 'Katri Athokas', email: 'katri.athokas@contoso.com', role: 'Design engineer', presence: 'online', joined: '2022-02-14' },
  { id: 'm-2', name: 'Ben Adams', email: 'ben.adams@contoso.com', role: 'Frontend engineer', presence: 'away', joined: '2021-09-01' },
  { id: 'm-3', name: 'Carole Poland', email: 'carole.poland@contoso.com', role: 'Program manager', presence: 'offline', joined: '2020-11-23' },
  { id: 'm-4', name: 'Diego Siciliani', email: 'diego.siciliani@contoso.com', role: 'Accessibility lead', presence: 'online', joined: '2023-03-30' },
  { id: 'm-5', name: 'Isaiah Langer', email: 'isaiah.langer@contoso.com', role: 'Product designer', presence: 'online', joined: '2019-07-08' },
  { id: 'm-6', name: 'Jane Doe', email: 'jane.doe@contoso.com', role: 'Data scientist', presence: 'away', joined: '2024-01-05' },
];

const PAGE_SIZE = 4;

const presenceColor: Record<Presence, 'success' | 'warning' | 'subtle'> = {
  online: 'success',
  away: 'warning',
  offline: 'subtle',
};

export const TeamRoster = () => {
  const [page, setPage] = React.useState(0);
  const [lastViewed, setLastViewed] = React.useState<string | null>(null);

  const pageCount = Math.max(1, Math.ceil(members.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const firstIndex = currentPage * PAGE_SIZE;
  const pageMembers = members.slice(firstIndex, firstIndex + PAGE_SIZE);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Table aria-label="Team roster">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Member</TableHeaderCell>
            <TableHeaderCell>Role</TableHeaderCell>
            <TableHeaderCell>Presence</TableHeaderCell>
            <TableHeaderCell>Joined</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <TableCellLayout truncate>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name={member.name} size={28} />
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <Text weight="semibold" truncate>
                        {member.name}
                      </Text>
                      <Tooltip content={member.email} relationship="description">
                        <Text size={200} truncate>
                          {member.email}
                        </Text>
                      </Tooltip>
                    </div>
                  </div>
                </TableCellLayout>
              </TableCell>
              <TableCell>
                <TableCellLayout truncate>{member.role}</TableCellLayout>
              </TableCell>
              <TableCell>
                <TableCellLayout>
                  <Badge appearance="tint" color={presenceColor[member.presence]}>
                    {member.presence}
                  </Badge>
                </TableCellLayout>
              </TableCell>
              <TableCell>
                <TableCellLayout truncate>
                  {new Date(member.joined).toLocaleDateString()}
                </TableCellLayout>
              </TableCell>
              <TableCell>
                <TableCellLayout>
                  <Button appearance="subtle" onClick={() => setLastViewed(member.name)}>
                    View
                  </Button>
                </TableCellLayout>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <Text size={200}>
          Showing {firstIndex + 1}-{Math.min(firstIndex + PAGE_SIZE, members.length)} of {members.length}
        </Text>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button appearance="secondary" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>
            Previous
          </Button>
          <Button
            appearance="secondary"
            disabled={currentPage >= pageCount - 1}
            onClick={() => setPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {lastViewed ? <Text size={200}>Last viewed: {lastViewed}</Text> : null}
    </div>
  );
};
```

### Loading and empty states inside the table body

Async data with a Spinner row while loading and an explanatory full-width row when there is nothing to show, keeping the header and column widths stable throughout.

```tsx
import * as React from 'react';
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
} from '@fluentui/react-components';

interface Deployment {
  id: string;
  environment: string;
  version: string;
  status: string;
}

const loadDeployments = (): Promise<Deployment[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'd-1', environment: 'Production', version: '9.46.0', status: 'Succeeded' },
        { id: 'd-2', environment: 'Staging', version: '9.47.0-rc.1', status: 'Running' },
        { id: 'd-3', environment: 'Canary', version: '9.47.0-rc.1', status: 'Queued' },
      ]);
    }, 1200);
  });

export const DeploymentsTable = () => {
  const [deployments, setDeployments] = React.useState<Deployment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    loadDeployments().then((result) => {
      if (!cancelled) {
        setDeployments(result);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Table aria-label="Deployments">
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Environment</TableHeaderCell>
          <TableHeaderCell>Version</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={3}>
              <TableCellLayout>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Spinner size="tiny" />
                  <Text>Loading deployments...</Text>
                </div>
              </TableCellLayout>
            </TableCell>
          </TableRow>
        ) : deployments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3}>
              <TableCellLayout>
                <Text>No deployments yet. Push to the main branch to trigger one.</Text>
              </TableCellLayout>
            </TableCell>
          </TableRow>
        ) : (
          deployments.map((deployment) => (
            <TableRow key={deployment.id}>
              <TableCell>
                <TableCellLayout truncate>{deployment.environment}</TableCellLayout>
              </TableCell>
              <TableCell>
                <TableCellLayout truncate>{deployment.version}</TableCellLayout>
              </TableCell>
              <TableCell>
                <TableCellLayout truncate>{deployment.status}</TableCellLayout>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
```

## Pitfalls

- Sorting or filtering the source array in place: `rows.sort(...)` mutates the array you treat as your source of truth. Always copy first - `[...filtered].sort(comparators[column])` - and reverse the copy for descending order.
- Using the array index as the React `key` (or as the row id for selection): as soon as rows are sorted, filtered, or paginated, an index no longer identifies the same record, so selection and reconciliation drift. Use a stable `record.id`.
- Forgetting to feed `sortDirection` back into `TableHeaderCell`: the indicator then disagrees with the order of the data you render, which is worse than showing no indicator. Derive `sortDirection` from the exact state object you used to sort the rows.
- Marking non-sortable columns as `sortable`, or leaving the sort behavior on the table but rendering header text in a plain `TableCell`: sort affordances must be `TableHeaderCell sortable` inside a `sortable` `Table` so the toggle is routed through `onSortChange`.
- Rendering an empty `TableBody` when a filter matches nothing: the user sees a header with no explanation. Render one row whose `TableCell` spans every column (`colSpan`) with a message, plus a recovery `Button` when filters caused the emptiness.
- Placing interactive controls inside a selectable row without `event.stopPropagation()`: the click bubbles to the row and toggles selection as a side effect of pressing the row action.
- Trying to reset selection through props: the `Table` owns selection state and reports changes through `onSelectionChange`. Mirror `data.selectedItems` into your own state for counts and bulk-action UI instead of writing it back; if you need full control, render your own `Checkbox` in a `TableCell` and own the state end to end.
- Letting a single long value dictate column widths: wrap text cells in `TableCellLayout truncate` and expose the full value through a `Tooltip` or `title` rather than letting the table scroll horizontally.
- Sorting or filtering only the current page: sort and filter the full set first, then slice for pagination, otherwise the next page shows rows in an order unrelated to the header indicator. Clamp the page index so a shrinking result set cannot leave you on an out-of-range page.

## Accessibility

Always name the table: pass `aria-label` (or `aria-labelledby`) to `Table`, otherwise assistive technology announces an unnamed table and users cannot tell which list they landed in. Render column headers with `TableHeaderCell` (a real `th`) instead of styling a body cell - screen reader table navigation depends on it. Filter controls need their own accessible names: a `placeholder` is not a label, so pass `aria-label` to `Input` and `Select` (or associate a visible `Label`). Selection is handled by `TableSelectionCell`, which renders the checkbox/radio affordance and keeps the checked state in sync with the table's selection model; if you hand-roll selection with `Checkbox` inside a `TableCell` instead, give each one a unique `aria-label` such as `Select ${row.name}`. Never encode status in color alone - the `Badge` examples always render the status text next to the tint. Truncated values are visually clipped, so expose the full value (a `Tooltip` as in the roster example, or a `title` attribute) and never truncate the only copy of essential information. Loading and empty states are rendered as text inside the body so they are announced in place of the missing rows; pair a `Spinner` with a sentence rather than relying on the animation. Keep row actions as real focusable `Button`s, and when a row is also selectable call `event.stopPropagation()` in the action handler so activating the button does not toggle row selection. Because sortable header cells report their state through `sortDirection`, the current sort is exposed to assistive technology without extra markup. If you add pagination, keep the Previous/Next buttons disabled (not hidden) at the ends so the control set stays predictable for keyboard users.

## Components used

- - [Table](../../components/table.md)
- - [Avatar](../../components/avatar.md)
- - [Badge](../../components/badge.md)
- - [Button](../../components/button.md)
- - [Input](../../components/input.md)
- - [Select](../../components/select.md)
- - [Spinner](../../components/spinner.md)
- - [Text](../../components/text.md)
- - [Tooltip](../../components/tooltip.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
