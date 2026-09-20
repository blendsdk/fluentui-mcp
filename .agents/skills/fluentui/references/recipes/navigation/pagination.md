# Pagination

> **Group**: navigation

## Goal

Build a controlled, accessible pagination control for Fluent UI React v9 by composing Button, Tooltip, Text, Field/Select/SpinButton and Menu primitives, then wire it to a paged data list (page-size selector, jump-to-page, windowed page numbers and an overflow menu for large page counts).

## When to Use

Use this recipe when a data set is split into discrete pages and users must be able to reach a specific page, see how much data exists and control the page size: data tables, search results, admin/audit lists, galleries, inboxes. Also use it when the current page must be reflected in the URL, restored from state, or share between components.

## When Not to Use

Avoid pagination for: short lists that fit one screen or one scroll container (just render them, or add a 'Load more' Button); switching between peer views of the same object (use TabList); walking through a fixed, ordered wizard flow (use Back/Next Buttons with a step indicator); one-item-at-a-time media browsing (use Carousel); showing location in a hierarchy (use Breadcrumb). Infinite scroll is an alternative for feeds, but it breaks deep linking and is harder for keyboard and screen reader users.

Fluent UI React v9 has no `Pagination` component, so the reliable approach is to compose one from primitives and keep it **controlled**: the parent owns the page index, and the bar is a pure function of `page`, `pageCount` and `onPageChange`.

## 1. The contract

```ts
export interface PaginationBarProps {
  page: number;                        // 1-based index of the current page
  pageCount: number;                   // total number of pages
  onPageChange: (page: number) => void;
  siblingCount?: number;               // extra page buttons on each side
  disabled?: boolean;                  // e.g. while the next page loads
}
```

Decisions this recipe bakes in:

* **Pages are 1-based in the public API**; only the array-slicing math is 0-based.
* **The parent owns the page** (component state, URL search param, store). The bar never keeps a private copy, so a filter change cannot desync it.
* **`pageCount` is derived**, never stored: `Math.max(1, Math.ceil(totalItems / pageSize))`.
* **Clamp on read**: `const currentPage = Math.min(Math.max(page, 1), pageCount)`. If the result set shrinks, the UI renders the last real page instead of an empty one.

## 2. Anatomy

```
<nav aria-label='Pagination'>                  <- one landmark per paginated region
  <Tooltip relationship='label'>
    <Button icon={<ChevronLeftIcon />}>Previous</Button>
  </Tooltip>
  <div>                                        <- windowed page buttons
    <Button appearance='subtle'>3</Button>
    <Button appearance='primary' aria-current='page'>4</Button>
    <Button appearance='subtle'>5</Button>
    <Text aria-hidden='true'>...</Text>        <- or a Menu trigger, see example 3
  </div>
  <Tooltip relationship='label'>
    <Button icon={<ChevronRightIcon />} iconPosition='after'>Next</Button>
  </Tooltip>
</nav>
```

* `appearance='primary'` marks the current page **visually**, `aria-current='page'` marks it **programmatically**. You need both - color alone is invisible to assistive technology.
* `Tooltip relationship='label'` names icon-only buttons, but always pass an explicit `aria-label` as well: tooltips are hover-only and are not reliably announced.
* Put the range summary (`Showing 21-40 of 128`) in an `aria-live='polite'` region so a page change is announced without moving focus.

## 3. The windowing algorithm

Never render one Button per page. `getPageItems(page, pageCount, siblingCount)`:

1. anchors page `1` and page `pageCount`,
2. keeps `current +/- siblingCount` in the middle,
3. emits an `'ellipsis'` marker for each skipped range,
4. returns every page when the set is small (`pageCount <= siblingCount * 2 + 5`).

With `pageCount = 12`, `page = 6`, `siblingCount = 1` you get `1 ... 5 6 7 ... 12`.

## 4. Wiring it to data

```ts
const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
const currentPage = Math.min(Math.max(page, 1), pageCount);
const firstIndex = (currentPage - 1) * pageSize;
const visibleItems = items.slice(firstIndex, firstIndex + pageSize);
```

* **Reset or re-clamp the page** when the *query* changes (search text, filters, sort) or when the page size changes, because the old index points at different rows.
* **Keep the page** when only the underlying data is refreshed (poll, refetch).
* **Deep links**: persist `?page=3&size=25`; treat a missing, non-numeric or out-of-range value as page 1 (the clamp in step 4 handles the range for you).

## 5. Large page counts: overflow Menu

Replace the static ellipsis with a `Menu` whose `MenuList` lists the skipped pages, so a user who knows the target page can jump directly (example 3). Cap the number of `MenuItem`s (about 20) and fall back to a jump control beyond that, otherwise the menu becomes a scrollable wall of text.

## 6. Page size and jump-to-page

Wrap `Select` (page size) and `SpinButton` (jump) in `Field` so they inherit the label, `id` and validation wiring:

```tsx
<Field label='Items per page' orientation='horizontal' size='small'>
  <Select size='small' value={String(pageSize)} onChange={...}>
    <option value={5}>5</option>
  </Select>
</Field>

<Field label='Go to page' orientation='horizontal' size='small'>
  <SpinButton size='small' min={1} max={pageCount} value={currentPage} onChange={...} />
</Field>
```

Changing the page size must reset to page 1. The `SpinButton` is controlled and its `onChange` must guard `typeof data.value !== 'number'`, because the input can be cleared or contain junk.

## 7. Compact / responsive variant

Below roughly 600 px, hide the numbered buttons and render `Previous | Page 3 of 12 | Next`, where the middle is a `Select`, an overflow `Menu`, or a `SpinButton`. Keep Previous/Next and the live summary - those are the load-bearing parts of the control.

## 8. Behavior details worth getting right

* **Do not lose focus.** Use `disabledFocusable` instead of `disabled` for Previous/Next: a `disabled` button leaves the tab order, and a keyboard user who reaches the last page has focus thrown back to `document.body`.
* **Keep the focused node mounted.** Key page buttons by page number, not by array index, so React reuses the same DOM node when the window shifts.
* **Scroll, but do not steal focus.** Call `listRef.current?.scrollIntoView({ block: 'nearest' })` in an effect on page change instead of focusing the list container.
* **Announce the change** via the `aria-live='polite'` summary. Do not announce on every keystroke of a jump control.
* **Guard against double fetches**: set the bar's `disabled` flag while a page request is in flight.

## 9. Accessibility summary

* One `<nav aria-label='Pagination'>` per region; with two paginated areas, label them differently (`Results pagination`, `Activity pagination`).
* Current page = `aria-current='page'` + `appearance='primary'`.
* Icon-only controls need `aria-label` (`Previous page`, `Next page`, `Show pages 7 through 19`).
* Every control is a real `Button`/`Select`/`SpinButton`, so Tab, Enter, Space and native select behavior work with no custom key handling. Do not add roving tabindex unless you also implement the full arrow-key model.

## Examples

### PaginationBar (core control)

A reusable, controlled pagination bar: windowed page numbers, Previous/Next buttons, current page marked with aria-current, and a live page summary.

```tsx
import * as React from 'react';
import { Button, Text, Tooltip } from '@fluentui/react-components';

/* ------------------------------------------------------------------- */
/* Inline SVG icons: no extra dependency, and they inherit currentColor */
/* ------------------------------------------------------------------- */

const ChevronLeftIcon = () => (
  <svg width='16' height='16' viewBox='0 0 16 16' aria-hidden='true' focusable='false'>
    <path
      d='M10.5 2.5 5.5 8l5 5.5'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width='16' height='16' viewBox='0 0 16 16' aria-hidden='true' focusable='false'>
    <path
      d='M5.5 2.5 10.5 8l-5 5.5'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

/* ------------------------------ windowing --------------------------- */

export type PageItem = number | 'ellipsis';

/**
 * Page numbers to render: page 1 and the last page are always anchored,
 * the current page keeps `siblingCount` neighbours, and skipped ranges
 * collapse into an 'ellipsis' marker.
 */
export function getPageItems(page: number, pageCount: number, siblingCount = 1): PageItem[] {
  if (pageCount <= 0) {
    return [];
  }

  // first + last + current + siblingCount on each side + 2 ellipses
  const maxSlots = siblingCount * 2 + 5;
  if (pageCount <= maxSlots) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const left = Math.max(page - siblingCount, 2);
  const right = Math.min(page + siblingCount, pageCount - 1);

  const items: PageItem[] = [1];
  if (left > 2) {
    items.push('ellipsis');
  }
  for (let p = left; p <= right; p += 1) {
    items.push(p);
  }
  if (right < pageCount - 1) {
    items.push('ellipsis');
  }
  items.push(pageCount);

  return items;
}

/* ------------------------------ component --------------------------- */

export interface PaginationBarProps {
  /** 1-based index of the selected page. */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  /** Called with the 1-based index of the requested page. */
  onPageChange: (page: number) => void;
  /** Extra page buttons rendered on each side of the current page. */
  siblingCount?: number;
  /** Disables every control, e.g. while the next page is loading. */
  disabled?: boolean;
  /** Accessible name of the nav landmark. */
  ariaLabel?: string;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  disabled = false,
  ariaLabel = 'Pagination',
}) => {
  const items = React.useMemo(
    () => getPageItems(page, pageCount, siblingCount),
    [page, pageCount, siblingCount],
  );

  const goTo = React.useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 1), pageCount);
      if (clamped !== page) {
        onPageChange(clamped);
      }
    },
    [onPageChange, page, pageCount],
  );

  if (pageCount <= 1) {
    return null;
  }

  return (
    <nav aria-label={ariaLabel} style={navStyle}>
      <Tooltip content='Previous page' relationship='label'>
        <Button
          appearance='subtle'
          icon={<ChevronLeftIcon />}
          disabledFocusable={disabled || page <= 1}
          onClick={() => goTo(page - 1)}
        >
          Previous
        </Button>
      </Tooltip>

      <div style={pagesStyle}>
        {items.map((item, index) =>
          item === 'ellipsis' ? (
            <Text key={`ellipsis-${index}`} aria-hidden='true' style={ellipsisStyle}>
              …
            </Text>
          ) : (
            <Button
              key={item}
              appearance={item === page ? 'primary' : 'subtle'}
              aria-label={`Page ${item}`}
              aria-current={item === page ? 'page' : undefined}
              disabled={disabled}
              onClick={() => goTo(item)}
              style={pageButtonStyle}
            >
              {item}
            </Button>
          ),
        )}
      </div>

      <Tooltip content='Next page' relationship='label'>
        <Button
          appearance='subtle'
          icon={<ChevronRightIcon />}
          iconPosition='after'
          disabledFocusable={disabled || page >= pageCount}
          onClick={() => goTo(page + 1)}
        >
          Next
        </Button>
      </Tooltip>
    </nav>
  );
};

/* -------------------------------- styles ---------------------------- */

const navStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
};

const pagesStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

const pageButtonStyle: React.CSSProperties = {
  minWidth: '32px',
};

const ellipsisStyle: React.CSSProperties = {
  display: 'inline-flex',
  justifyContent: 'center',
  minWidth: '32px',
};

/* --------------------------------- demo ----------------------------- */

export default function PaginationBarExample() {
  const pageCount = 12;
  const [page, setPage] = React.useState(4);

  return (
    <div style={{ display: 'grid', gap: '8px' }}>
      <Text aria-live='polite' weight='semibold'>
        Page {page} of {pageCount}
      </Text>
      <PaginationBar page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  );
}
```

### PaginatedList with page size and jump-to-page

A generic, clamped list pager: page-size Select and jump-to-page SpinButton inside Field, a live range summary, Previous/Next buttons, and scroll-into-view on page change.

```tsx
import * as React from 'react';
import {
  Button,
  Field,
  Select,
  SpinButton,
  Text,
  Tooltip,
} from '@fluentui/react-components';

const ChevronLeftIcon = () => (
  <svg width='16' height='16' viewBox='0 0 16 16' aria-hidden='true' focusable='false'>
    <path
      d='M10.5 2.5 5.5 8l5 5.5'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width='16' height='16' viewBox='0 0 16 16' aria-hidden='true' focusable='false'>
    <path
      d='M5.5 2.5 10.5 8l-5 5.5'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const listStyle: React.CSSProperties = {
  display: 'grid',
  gap: '4px',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  minHeight: '120px',
};

const listItemStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  alignItems: 'baseline',
};

const barStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const controlsStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  alignItems: 'center',
};

const pageControlsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

const counterStyle: React.CSSProperties = {
  minWidth: '56px',
  textAlign: 'center',
};

export interface PaginatedListProps<T> {
  items: readonly T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  initialPageSize?: number;
  pageSizeOptions?: readonly number[];
  /** Accessible name of the paginated region. */
  label?: string;
}

export function PaginatedList<T>({
  items,
  renderItem,
  initialPageSize = 5,
  pageSizeOptions = [5, 10, 25],
  label = 'Results',
}: PaginatedListProps<T>) {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));

  // Never point at a page that no longer exists: clamp on read.
  const currentPage = Math.min(Math.max(page, 1), pageCount);

  const firstIndex = (currentPage - 1) * pageSize;
  const visibleItems = items.slice(firstIndex, firstIndex + pageSize);
  const lastIndex = firstIndex + visibleItems.length;

  const listRef = React.useRef<HTMLUListElement>(null);
  const isFirstRender = React.useRef(true);

  // Bring the results back into view after a page change, without stealing focus.
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    listRef.current?.scrollIntoView({ block: 'nearest' });
  }, [currentPage, pageSize]);

  return (
    <section aria-label={label} style={{ display: 'grid', gap: '12px' }}>
      {items.length === 0 ? (
        <Text>No results yet.</Text>
      ) : (
        <ul ref={listRef} style={listStyle}>
          {visibleItems.map((item, index) => (
            <li key={firstIndex + index} style={listItemStyle}>
              {renderItem(item, firstIndex + index)}
            </li>
          ))}
        </ul>
      )}

      <div style={barStyle}>
        <Text aria-live='polite' size={200}>
          Showing {items.length === 0 ? 0 : firstIndex + 1}–{lastIndex} of {items.length}
        </Text>

        <div style={controlsStyle}>
          <Field label='Items per page' orientation='horizontal' size='small'>
            <Select
              size='small'
              value={String(pageSize)}
              onChange={(_event, data) => {
                setPageSize(Number(data.value));
                // The old index now refers to different rows.
                setPage(1);
              }}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </Field>

          <Field label='Go to page' orientation='horizontal' size='small'>
            <SpinButton
              size='small'
              min={1}
              max={pageCount}
              value={currentPage}
              onChange={(_event, data) => {
                // The input can be cleared, so guard the type.
                if (typeof data.value !== 'number') {
                  return;
                }
                setPage(Math.min(Math.max(data.value, 1), pageCount));
              }}
            />
          </Field>

          <div style={pageControlsStyle}>
            <Tooltip content='Previous page' relationship='label'>
              <Button
                appearance='subtle'
                icon={<ChevronLeftIcon />}
                disabledFocusable={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
              >
                Previous
              </Button>
            </Tooltip>

            <Text aria-hidden='true' weight='semibold' style={counterStyle}>
              {currentPage} / {pageCount}
            </Text>

            <Tooltip content='Next page' relationship='label'>
              <Button
                appearance='subtle'
                icon={<ChevronRightIcon />}
                iconPosition='after'
                disabledFocusable={currentPage >= pageCount}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- demo ----------------------------- */

interface Person {
  id: string;
  name: string;
  role: string;
}

const people: Person[] = [
  { id: '1', name: 'Ada Lovelace', role: 'Engineer' },
  { id: '2', name: 'Grace Hopper', role: 'Engineer' },
  { id: '3', name: 'Katherine Johnson', role: 'Analyst' },
  { id: '4', name: 'Margaret Hamilton', role: 'Engineer' },
  { id: '5', name: 'Barbara Liskov', role: 'Architect' },
  { id: '6', name: 'Radia Perlman', role: 'Architect' },
  { id: '7', name: 'Shafi Goldwasser', role: 'Researcher' },
  { id: '8', name: 'Frances Allen', role: 'Researcher' },
  { id: '9', name: 'Jean Bartik', role: 'Engineer' },
  { id: '10', name: 'Evelyn Boyd Granville', role: 'Analyst' },
  { id: '11', name: 'Mary Lee Woods', role: 'Engineer' },
  { id: '12', name: 'Karen Sparck Jones', role: 'Researcher' },
];

export default function PaginatedListExample() {
  return (
    <PaginatedList
      items={people}
      renderItem={(person) => (
        <>
          <Text weight='semibold'>{person.name}</Text>
          <Text size={200}>{person.role}</Text>
        </>
      )}
    />
  );
}
```

### Overflow menu pagination for large page counts

When there are dozens of pages, the skipped ranges become Menu triggers that list the hidden pages, so users can jump straight to any page instead of clicking one at a time.

```tsx
import * as React from 'react';
import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Text,
  Tooltip,
} from '@fluentui/react-components';

const ChevronLeftIcon = () => (
  <svg width='16' height='16' viewBox='0 0 16 16' aria-hidden='true' focusable='false'>
    <path
      d='M10.5 2.5 5.5 8l5 5.5'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width='16' height='16' viewBox='0 0 16 16' aria-hidden='true' focusable='false'>
    <path
      d='M5.5 2.5 10.5 8l-5 5.5'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

type PaginationItem =
  | { type: 'page'; page: number }
  | { type: 'gap'; key: string; pages: number[] };

/**
 * Anchors page 1 and the last page, keeps `windowSize` pages around the
 * current page, and reports skipped ranges so they can be rendered behind
 * an overflow Menu.
 */
export function buildPaginationItems(
  currentPage: number,
  pageCount: number,
  windowSize = 5,
): PaginationItem[] {
  if (pageCount <= windowSize + 2) {
    return Array.from(
      { length: pageCount },
      (_, index): PaginationItem => ({ type: 'page', page: index + 1 }),
    );
  }

  const half = Math.floor(windowSize / 2);
  let start = currentPage - half;
  let end = currentPage + half;

  if (start < 2) {
    start = 2;
    end = start + windowSize - 1;
  }
  if (end > pageCount - 1) {
    end = pageCount - 1;
    start = end - windowSize + 1;
  }

  const items: PaginationItem[] = [{ type: 'page', page: 1 }];

  if (start > 2) {
    const pages: number[] = [];
    for (let p = 2; p < start; p += 1) {
      pages.push(p);
    }
    items.push({ type: 'gap', key: 'gap-start', pages });
  }

  for (let p = start; p <= end; p += 1) {
    items.push({ type: 'page', page: p });
  }

  if (end < pageCount - 1) {
    const pages: number[] = [];
    for (let p = end + 1; p < pageCount; p += 1) {
      pages.push(p);
    }
    items.push({ type: 'gap', key: 'gap-end', pages });
  }

  items.push({ type: 'page', page: pageCount });

  return items;
}

const navStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
};

const pagesStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

const pageButtonStyle: React.CSSProperties = {
  minWidth: '32px',
};

export interface OverflowPaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export const OverflowPagination: React.FC<OverflowPaginationProps> = ({
  page,
  pageCount,
  onPageChange,
}) => {
  const items = React.useMemo(
    () => buildPaginationItems(page, pageCount),
    [page, pageCount],
  );

  return (
    <nav aria-label='Pagination' style={navStyle}>
      <Tooltip content='Previous page' relationship='label'>
        <Button
          appearance='subtle'
          icon={<ChevronLeftIcon />}
          disabledFocusable={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
      </Tooltip>

      <div style={pagesStyle}>
        {items.map((item) =>
          item.type === 'page' ? (
            <Button
              key={`page-${item.page}`}
              appearance={item.page === page ? 'primary' : 'subtle'}
              aria-label={`Page ${item.page}`}
              aria-current={item.page === page ? 'page' : undefined}
              onClick={() => onPageChange(item.page)}
              style={pageButtonStyle}
            >
              {item.page}
            </Button>
          ) : (
            <Menu key={item.key}>
              <MenuTrigger disableButtonEnhancement>
                <Button
                  appearance='subtle'
                  aria-label={`Show pages ${item.pages[0]} through ${
                    item.pages[item.pages.length - 1]
                  }`}
                  style={pageButtonStyle}
                >
                  …
                </Button>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  {item.pages.map((gapPage) => (
                    <MenuItem key={gapPage} onClick={() => onPageChange(gapPage)}>
                      Page {gapPage}
                    </MenuItem>
                  ))}
                </MenuList>
              </MenuPopover>
            </Menu>
          ),
        )}
      </div>

      <Tooltip content='Next page' relationship='label'>
        <Button
          appearance='subtle'
          icon={<ChevronRightIcon />}
          iconPosition='after'
          disabledFocusable={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </Tooltip>
    </nav>
  );
};

/* --------------------------------- demo ----------------------------- */

export default function OverflowPaginationExample() {
  const pageCount = 24;
  const [page, setPage] = React.useState(9);

  return (
    <div style={{ display: 'grid', gap: '8px' }}>
      <Text aria-live='polite' weight='semibold'>
        Page {page} of {pageCount}
      </Text>
      <OverflowPagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  );
}
```

## Pitfalls

- Off-by-one between the 1-based `page` and 0-based slicing. Always compute `const firstIndex = (page - 1) * pageSize` and keep the public API 1-based; mixing the two duplicates or skips a row set.
- Not clamping the page when `pageCount` shrinks (search, filter, larger page size). Derive `const currentPage = Math.min(Math.max(page, 1), pageCount)` before slicing, otherwise the list renders empty while the bar highlights a page that no longer exists.
- Using `disabled` instead of `disabledFocusable` for Previous/Next. A disabled button leaves the tab order, and a keyboard user who just reached the last page loses focus to the document body.
- Rendering one Button per page for a large data set (thousands of pages). Window the pages with `getPageItems`/`buildPaginationItems` and put skipped ranges behind a Menu or a jump-to-page control.
- Indicating the current page with color alone (`appearance='primary'`) and forgetting `aria-current='page'`, which leaves screen reader users unable to tell which page is selected.
- Keying page buttons by array index. When the window shifts, React reuses the wrong DOM node and focus can land on a different page; key page buttons by page number and give each ellipsis node a stable string key.
- Forgetting to reset the page to 1 when the page size, search term or filter changes, so the user lands on an out-of-range page or a seemingly random slice of the data.
- Making the ellipsis a dead, non-interactive element on large page counts - users who know the page they want must walk there one click at a time. Make it a Menu trigger (example 3) or pair the bar with a jump-to-page SpinButton.
- Building the bar with nested Tooltip + Button + custom clickable spans instead of real Buttons, which loses keyboard activation and the native pressed/focus semantics.

## Accessibility

Wrap the controls in a `<nav aria-label='Pagination'>` landmark, and give each paginated region a distinct label when a page has more than one (for example 'Results pagination' and 'Activity pagination'); unlabeled duplicate nav landmarks are indistinguishable in a screen reader landmark list. Mark the current page with `aria-current='page'` on the page Button in addition to `appearance='primary'` - the visual style alone is invisible to assistive technology. Every control needs an accessible name: page buttons need visible text or `aria-label={'Page ' + n}`, and icon-only Previous/Next buttons need an explicit `aria-label` plus `Tooltip relationship='label'` for sighted mouse users (tooltips are hover-only and are not reliably announced, so never rely on them as the only name). Prefer `disabledFocusable` over `disabled` for Previous/Next so the button stays focusable and keyboard focus is not dropped to `document.body` when the user reaches the first or last page. Announce page changes by putting the range summary ('Showing 21-40 of 128') in an `aria-live='polite'` region and hide any duplicate counter text with `aria-hidden='true'`, so the change is not announced twice. Because everything is built from native Button, Select and SpinButton, Tab/Enter/Space/arrow behavior comes for free - do not replace them with divs, and do not add roving tabindex unless you also implement the full arrow-key model. In RTL layouts mirror the chevron SVGs (for example with a scaleX(-1) transform) and swap the order of Previous/Next so the direction matches reading order. Ensure the selected page button keeps sufficient contrast: it uses the brand background with the theme's inverted foreground, and the subtle appearance must still meet 3:1 against the surrounding surface.

## Components used

- [Button](../../components/button.md)
- [Field](../../components/field.md)
- [Menu](../../components/menu.md)
- [MenuItem](../../components/menu-item.md)
- [MenuList](../../components/menu-list.md)
- [MenuPopover](../../components/menu-popover.md)
- [MenuTrigger](../../components/menu-trigger.md)
- [Select](../../components/select.md)
- [SpinButton](../../components/spin-button.md)
- [Text](../../components/text.md)
- [Tooltip](../../components/tooltip.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
