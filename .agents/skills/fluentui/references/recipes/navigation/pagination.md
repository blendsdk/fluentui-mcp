# Pagination

> **Group**: navigation

## Goal

Build an accessible, composable pagination control (numbered pages with ellipses, previous/next, page-size selector, and a compact page picker) out of Fluent UI React v9 primitives: Button, Text, Field, and Select.

## When to Use

Use this recipe whenever a dataset is split into pages and the user must know their position plus move between pages: data tables, search result lists, galleries, server-paged APIs where the client only owns page/pageSize/totalItems. Also use it when you need a compact, mobile-friendly page switcher or a table footer with a rows-per-page control.

## When Not to Use

Do not use numbered pagination for infinite feeds or short lists that fit on one screen — use 'Load more' with a Button, or a scroll container. If the user is stepping through a wizard or a set of views (not a data window), use Tabs or a Breadcrumb for hierarchy instead. If pages are real, linkable URLs and SEO matters, render Link (or an anchor) for each page instead of a Button-driven client state.

# Pagination with Fluent UI React v9

Fluent UI React v9 does not ship a `Pagination` component. You compose it from primitives you already have:

- `Button` for every page affordance (previous, next, page numbers, first/last),
- `Text` for the ellipsis glyph and the "showing X–Y of Z" / "Page 3 of 12" summary,
- `Field` + `Select` for the rows-per-page control and for a compact page picker,
- a plain `<nav>` + `<ul>`/`<li>` for landmark and list semantics.

The recipe has three parts: (1) a pure page model, (2) a hook that owns controlled/uncontrolled page state, and (3) presentational components that render the model with Fluent primitives.

## 1. Define the state you own

Keep the state minimal and derive everything else:

| Value | Owner | Notes |
| --- | --- | --- |
| `page` | component (controlled) or `Pagination` (uncontrolled) | 1-based, always clamped to `[1, pageCount]` |
| `pageSize` | the owning table/list | user-selectable |
| `totalItems` | server or parent | `pageCount = Math.ceil(totalItems / pageSize)` |
| `pageCount` | derived | never store it in state |

Server-side paging uses exactly the same model — you just fetch `page`/`pageSize` instead of slicing an in-memory array.

## 2. Compute which buttons to render (the ellipsis algorithm)

Naive pagination renders one button per page. That breaks down past ~10 pages. Instead, always show `boundaryCount` pages at each end, `siblingCount` pages around the current page, and collapse the gaps into a non-interactive ellipsis:

```
page 1 of 20  =>  [1 2 3 4 5 … 20]
page 5 of 20  =>  [1 … 4 5 6 … 20]
page 20 of 20 =>  [1 … 16 17 18 19 20]
```

The helper in the example returns `number | 'start-ellipsis' | 'end-ellipsis'`, so the renderer only needs one `typeof item === 'number'` branch. Keep the helper pure and free of React so you can unit-test it.

## 3. Render with Fluent primitives inside a `<nav>`

```tsx
<nav aria-label="Items pagination">
  <ul>
    <li><Button appearance="subtle" disabled={!canGoPrevious}>Previous</Button></li>
    {/* one <li> per item: Button for numbers, Text for ellipsis */}
    <li><Button appearance="subtle">Next</Button></li>
  </ul>
  <Text aria-live="polite">Page 5 of 20</Text>
</nav>
```

Rules that keep this correct and accessible:

- The current page gets `appearance="primary"` **and** `aria-current="page"` — never color alone.
- Ellipses are `<Text aria-hidden="true">…</Text>`, never a `Button` (a focusable control that does nothing is a keyboard trap of sorts).
- `Previous`/`Next` at a boundary are `disabled` (or `disabledFocusable` if you want focus to stay put instead of jumping to `<body>`).
- Do not wrap the whole control in one giant `Tooltip`; the visible number plus accessible name is enough.

## 4. Controlled vs. uncontrolled

Accept both shapes, exactly like Fluent inputs do:

```tsx
<Pagination count={20} />                                  // uncontrolled, page starts at 1
<Pagination count={20} defaultPage={3} />                   // uncontrolled, page starts at 3
<Pagination count={20} page={page} onPageChange={...} />    // controlled
```

The hook checks `page !== undefined` to decide whether to call `setState`. When controlled, **always** supply `onPageChange`, otherwise the buttons render but do nothing.

## 5. Page-size changes are the classic blank-page bug

When `pageSize` grows, `pageCount` shrinks, and a stale `page` can point past the end. Two defenses:

1. Clamp on render: `const currentPage = clamp(page, 1, pageCount)`.
2. Reset to page 1 inside the page-size handler — this is also what users expect.

Both appear in the table-footer example.

## 6. Table footer variant (rows per page + range summary)

A pagination footer typically shows three things in one row: a `Field`-wrapped `Select` for rows per page, a `Text` summary such as `11–20 of 137`, and prev/next buttons with "Page 2 of 14". Use `justifyContent: 'space-between'` with `flexWrap: 'wrap'` so it degrades gracefully on narrow screens. Put the range summary in an `aria-live="polite"` region so keyboard and screen-reader users hear the update when the page changes.

## 7. Compact variant for small page counts / small screens

On mobile, or when `pageCount` is small, replace the number strip with a `Select` that lists pages ("3 of 12") flanked by first/previous/next/last icon buttons. Cap the number of `<option>`s — `Select` does not virtualize, so an unbounded list of hundreds of options is slow and unusable. If you need to jump within thousands of pages, switch to the numbered variant with an ellipsis or add a dedicated search/tag control instead.

## 8. Styling

Use `makeStyles` + `tokens` from `@fluentui/react-components`. Pagination needs very little: a flex row with `gap: tokens.spacingHorizontalXS`, a reset list (`margin: 0; padding: 0; listStyleType: 'none'`), and `colorNeutralForeground3` for the ellipsis and summary text. Middle-size `Button` is 32px tall, which satisfies the minimum target size; do not shrink below `size="small"` (24px) unless you also increase hit area.

## Accessibility checklist

- One `<nav aria-label="…">` landmark; give each landmark a unique label when a page has several.
- Semantic list (`<ul>`/`<li>`) so assistive tech announces "list of 7 items".
- `aria-current="page"` on the active page button.
- Accessible names on icon-only buttons (`aria-label="Previous page"`).
- Announce changes with a polite live region ("Page 3 of 12" / "11–20 of 137").
- Full keyboard support comes for free from `Button`; never use `<div onClick>` or `<span role="link">`.

## Examples

### Numbered pagination with ellipses (hook + component + demo)

A complete, self-contained file: a pure getPaginationItems helper, a usePagination hook with controlled/uncontrolled support, and a Pagination component that renders page buttons plus a live 'Page X of Y' status, driven by a 137-item demo list.

```tsx
import * as React from 'react';
import { Button, Text, makeStyles, tokens } from '@fluentui/react-components';

/* -------------------------------------------------------------------------- */
/* 1. Pure helpers - the page model (framework agnostic, easy to unit test)   */
/* -------------------------------------------------------------------------- */

export type PaginationItem = number | 'start-ellipsis' | 'end-ellipsis';

const range = (start: number, end: number): number[] =>
  Array.from({ length: Math.max(end - start + 1, 0) }, (_, index) => start + index);

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

/**
 * Returns the sequence of page numbers and ellipses to render.
 * Example for page 5 of 20: [1, 'start-ellipsis', 4, 5, 6, 'end-ellipsis', 20]
 */
export const getPaginationItems = (
  page: number,
  count: number,
  siblingCount = 1,
  boundaryCount = 1,
): PaginationItem[] => {
  if (count <= 0) {
    return [];
  }

  // Everything fits without collapsing anything.
  const totalSlots = boundaryCount * 2 + siblingCount * 2 + 3;
  if (count <= totalSlots) {
    return range(1, count);
  }

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    count - boundaryCount - 1,
  );

  const items: PaginationItem[] = [
    ...range(1, boundaryCount),
    siblingsStart > boundaryCount + 2 ? 'start-ellipsis' : boundaryCount + 1,
    ...range(siblingsStart, siblingsEnd),
    siblingsEnd < count - boundaryCount - 1 ? 'end-ellipsis' : count - boundaryCount,
    ...range(count - boundaryCount + 1, count),
  ];

  return items;
};

/* -------------------------------------------------------------------------- */
/* 2. Hook - controlled / uncontrolled page state                             */
/* -------------------------------------------------------------------------- */

export interface UsePaginationOptions {
  /** Total number of pages. */
  count: number;
  /** Controlled current page (1-based). */
  page?: number;
  /** Initial page when uncontrolled. Defaults to 1. */
  defaultPage?: number;
  siblingCount?: number;
  boundaryCount?: number;
  onPageChange?: (event: React.MouseEvent<HTMLButtonElement>, page: number) => void;
}

export interface UsePaginationResult {
  page: number;
  pageCount: number;
  items: PaginationItem[];
  canGoPrevious: boolean;
  canGoNext: boolean;
  goTo: (event: React.MouseEvent<HTMLButtonElement>, nextPage: number) => void;
}

export const usePagination = ({
  count,
  page,
  defaultPage = 1,
  siblingCount = 1,
  boundaryCount = 1,
  onPageChange,
}: UsePaginationOptions): UsePaginationResult => {
  const pageCount = Math.max(Math.floor(count), 0);
  const isControlled = page !== undefined;
  const [uncontrolledPage, setUncontrolledPage] = React.useState(defaultPage);

  const rawPage = isControlled ? (page as number) : uncontrolledPage;
  const currentPage = pageCount === 0 ? 0 : clamp(Math.round(rawPage), 1, pageCount);

  const goTo = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, nextPage: number) => {
      if (pageCount === 0) {
        return;
      }
      const target = clamp(Math.round(nextPage), 1, pageCount);
      if (target === currentPage) {
        return;
      }
      if (!isControlled) {
        setUncontrolledPage(target);
      }
      onPageChange?.(event, target);
    },
    [currentPage, isControlled, onPageChange, pageCount],
  );

  const items = React.useMemo(
    () => getPaginationItems(currentPage || 1, pageCount, siblingCount, boundaryCount),
    [boundaryCount, currentPage, pageCount, siblingCount],
  );

  return {
    page: currentPage,
    pageCount,
    items,
    canGoPrevious: currentPage > 1,
    canGoNext: pageCount > 0 && currentPage < pageCount,
    goTo,
  };
};

/* -------------------------------------------------------------------------- */
/* 3. Presentation - Button/Text inside a <nav><ul>                           */
/* -------------------------------------------------------------------------- */

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: tokens.spacingHorizontalM,
    rowGap: tokens.spacingVerticalS,
  },
  list: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  item: {
    display: 'flex',
  },
  ellipsis: {
    color: tokens.colorNeutralForeground3,
    paddingInline: tokens.spacingHorizontalXS,
    userSelect: 'none',
  },
  status: {
    color: tokens.colorNeutralForeground3,
  },
  demoList: {
    display: 'grid',
    rowGap: tokens.spacingVerticalXS,
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
});

export interface PaginationProps {
  count: number;
  page?: number;
  defaultPage?: number;
  siblingCount?: number;
  boundaryCount?: number;
  onPageChange?: (event: React.MouseEvent<HTMLButtonElement>, page: number) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  ariaLabel?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  count,
  page,
  defaultPage = 1,
  siblingCount = 1,
  boundaryCount = 1,
  onPageChange,
  disabled = false,
  size = 'medium',
  ariaLabel = 'Pagination',
}) => {
  const styles = useStyles();
  const { page: currentPage, pageCount, items, canGoPrevious, canGoNext, goTo } = usePagination({
    count,
    page,
    defaultPage,
    siblingCount,
    boundaryCount,
    onPageChange,
  });

  if (pageCount === 0) {
    return null;
  }

  return (
    <nav aria-label={ariaLabel} className={styles.root}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <Button
            appearance="subtle"
            size={size}
            icon={<span aria-hidden="true">&lsaquo;</span>}
            disabled={disabled || !canGoPrevious}
            onClick={(event) => goTo(event, currentPage - 1)}
          >
            Previous
          </Button>
        </li>

        {items.map((item) =>
          typeof item === 'number' ? (
            <li key={item} className={styles.item}>
              <Button
                appearance={item === currentPage ? 'primary' : 'subtle'}
                size={size}
                disabled={disabled}
                aria-label={`Page ${item}`}
                aria-current={item === currentPage ? 'page' : undefined}
                onClick={(event) => goTo(event, item)}
              >
                {item}
              </Button>
            </li>
          ) : (
            <li key={item} className={styles.item}>
              <Text aria-hidden="true" size={400} className={styles.ellipsis}>
                &hellip;
              </Text>
            </li>
          ),
        )}

        <li className={styles.item}>
          <Button
            appearance="subtle"
            size={size}
            icon={<span aria-hidden="true">&rsaquo;</span>}
            iconPosition="after"
            disabled={disabled || !canGoNext}
            onClick={(event) => goTo(event, currentPage + 1)}
          >
            Next
          </Button>
        </li>
      </ul>

      <Text aria-live="polite" size={200} className={styles.status}>
        Page {currentPage} of {pageCount}
      </Text>
    </nav>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. Demo - controlled usage over a 137 item list                            */
/* -------------------------------------------------------------------------- */

const ALL_ITEMS = Array.from({ length: 137 }, (_, index) => `Item ${index + 1}`);
const PAGE_SIZE = 10;

export const PaginationDemo: React.FC = () => {
  const styles = useStyles();
  const [page, setPage] = React.useState(1);

  const pageCount = Math.ceil(ALL_ITEMS.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const visibleItems = ALL_ITEMS.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <ul className={styles.demoList}>
        {visibleItems.map((item) => (
          <li key={item}>
            <Text>{item}</Text>
          </li>
        ))}
      </ul>

      <Pagination
        count={pageCount}
        page={page}
        onPageChange={(_event, nextPage) => setPage(nextPage)}
        ariaLabel="Items pagination"
      />
    </div>
  );
};
```

### Table footer pagination with rows-per-page selector

A drop-in footer for a Table/DataGrid: a Field-wrapped Select for page size, a live range summary ('11-20 of 137'), and prev/next buttons. Clamps the page on render and resets to page 1 when the page size changes.

```tsx
import * as React from 'react';
import { Button, Field, Select, Text, makeStyles, tokens } from '@fluentui/react-components';
import type { SelectOnChangeData } from '@fluentui/react-components';

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    columnGap: tokens.spacingHorizontalL,
    rowGap: tokens.spacingVerticalS,
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  summary: {
    color: tokens.colorNeutralForeground2,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  rows: {
    display: 'grid',
    rowGap: tokens.spacingVerticalXS,
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
});

export interface TablePaginationProps {
  totalItems: number;
  page: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  disabled?: boolean;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  totalItems,
  page,
  pageSize,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  disabled = false,
}) => {
  const styles = useStyles();

  const pageCount = Math.max(Math.ceil(totalItems / pageSize), 1);
  // Defensive clamp: a pageSize change can leave `page` past the end.
  const currentPage = clamp(page, 1, pageCount);
  const firstRow = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastRow = Math.min(currentPage * pageSize, totalItems);

  const handlePageSizeChange = React.useCallback(
    (_event: React.ChangeEvent<HTMLSelectElement>, data: SelectOnChangeData) => {
      onPageSizeChange(Number(data.value));
      onPageChange(1);
    },
    [onPageChange, onPageSizeChange],
  );

  return (
    <div className={styles.root}>
      <Field label="Rows per page" orientation="horizontal" size="small">
        <Select size="small" value={String(pageSize)} onChange={handlePageSizeChange} disabled={disabled}>
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </Field>

      <Text size={200} className={styles.summary} aria-live="polite">
        {firstRow}&ndash;{lastRow} of {totalItems}
      </Text>

      <div className={styles.controls}>
        <Button
          appearance="subtle"
          size="small"
          icon={<span aria-hidden="true">&lsaquo;</span>}
          aria-label="Previous page"
          disabled={disabled || currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        />
        <Text size={200} className={styles.summary}>
          Page {currentPage} of {pageCount}
        </Text>
        <Button
          appearance="subtle"
          size="small"
          icon={<span aria-hidden="true">&rsaquo;</span>}
          aria-label="Next page"
          disabled={disabled || currentPage >= pageCount}
          onClick={() => onPageChange(currentPage + 1)}
        />
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Demo - render the footer under a paged list                                */
/* -------------------------------------------------------------------------- */

export const TablePaginationDemo: React.FC = () => {
  const styles = useStyles();
  const totalItems = 137;
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const startIndex = (page - 1) * pageSize;
  const rowsOnPage = Math.max(Math.min(pageSize, totalItems - startIndex), 0);
  const rows = Array.from({ length: rowsOnPage }, (_, index) => `Row ${startIndex + index + 1}`);

  return (
    <div>
      <ul className={styles.rows}>
        {rows.map((row) => (
          <li key={row}>
            <Text block>{row}</Text>
          </li>
        ))}
      </ul>

      <TablePagination
        totalItems={totalItems}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};
```

### Compact pagination (first / prev / page picker / next / last)

A narrow-width or small-page-count variant: circular icon Buttons for first/previous/next/last around a Select listing the pages, wired through a Field label. Options are capped because Select does not virtualize.

```tsx
import * as React from 'react';
import { Button, Field, Select, makeStyles, tokens } from '@fluentui/react-components';
import type { SelectOnChangeData } from '@fluentui/react-components';

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

/** Select does not virtualize; keep the option list bounded. */
const MAX_SELECT_OPTIONS = 200;

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
  },
});

export interface CompactPaginationProps {
  page: number;
  count: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const CompactPagination: React.FC<CompactPaginationProps> = ({
  page,
  count,
  onPageChange,
  disabled = false,
}) => {
  const styles = useStyles();

  const pageCount = Math.max(count, 1);
  const currentPage = clamp(page, 1, pageCount);
  const atStart = disabled || currentPage <= 1;
  const atEnd = disabled || currentPage >= pageCount;

  const options = React.useMemo(
    () => Array.from({ length: Math.min(pageCount, MAX_SELECT_OPTIONS) }, (_, index) => index + 1),
    [pageCount],
  );

  const handlePageSelect = React.useCallback(
    (_event: React.ChangeEvent<HTMLSelectElement>, data: SelectOnChangeData) => {
      onPageChange(Number(data.value));
    },
    [onPageChange],
  );

  return (
    <nav aria-label="Pagination" className={styles.root}>
      <Button
        appearance="subtle"
        shape="circular"
        icon={<span aria-hidden="true">&laquo;</span>}
        aria-label="First page"
        disabled={atStart}
        onClick={() => onPageChange(1)}
      />
      <Button
        appearance="subtle"
        shape="circular"
        icon={<span aria-hidden="true">&lsaquo;</span>}
        aria-label="Previous page"
        disabled={atStart}
        onClick={() => onPageChange(currentPage - 1)}
      />

      <Field label="Page" orientation="horizontal" size="small">
        <Select size="small" value={String(currentPage)} onChange={handlePageSelect} disabled={disabled}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option} of {pageCount}
            </option>
          ))}
        </Select>
      </Field>

      <Button
        appearance="subtle"
        shape="circular"
        icon={<span aria-hidden="true">&rsaquo;</span>}
        aria-label="Next page"
        disabled={atEnd}
        onClick={() => onPageChange(currentPage + 1)}
      />
      <Button
        appearance="subtle"
        shape="circular"
        icon={<span aria-hidden="true">&raquo;</span>}
        aria-label="Last page"
        disabled={atEnd}
        onClick={() => onPageChange(pageCount)}
      />
    </nav>
  );
};

/* -------------------------------------------------------------------------- */
/* Demo                                                                       */
/* -------------------------------------------------------------------------- */

export const CompactPaginationDemo: React.FC = () => {
  const [page, setPage] = React.useState(1);

  return <CompactPagination page={page} count={12} onPageChange={setPage} />;
};
```

## Pitfalls

- Computing pageCount with Math.round or a hard-coded number instead of Math.ceil(totalItems / pageSize) - this loses the last partial page and mislabels the summary range.
- Changing pageSize without resetting or clamping `page` - the user lands on a now-empty page. Reset to 1 in the page-size handler and also clamp on render with clamp(page, 1, pageCount).
- Rendering the ellipsis as a disabled Button - a focusable (or disabled-but-rendered) control that does nothing is confusing. Use <Text aria-hidden="true">...</Text> and no list-style.
- Relying only on appearance="primary" to convey the current page - add aria-current="page" so the state is programmatically available.
- Icon-only page/first/last buttons without aria-label - they are announced as unlabeled buttons. Also remember Button renders its `icon` slot element; pass a decorative span or an aria-hidden icon.
- Passing `page` (controlled mode) without `onPageChange` - the component renders but clicks do nothing. Either pass both props or use `defaultPage` only.
- Building the page strip from <div onClick> or <span role="link"> - you lose keyboard activation, focus rings, and disabled semantics. Always use Button (or Link for real URLs).
- Feeding an unbounded list of <option> elements into the compact Select - Select does not virtualize. Cap the option count (e.g. 200) or use the numbered variant with ellipses for very large page counts.
- Forgetting the live region: without an aria-live announcement, keyboard and screen-reader users get no feedback that the page (and therefore the results) changed.
- Recreating the item array on every render without useMemo - harmless for small lists but it re-renders every button whenever any parent state changes; memoize the derived items.

## Accessibility

Wrap the control in a single <nav> landmark with a descriptive aria-label (give each landmark a unique label when a page has more than one). Render the page strip as a semantic <ul>/<li> so assistive technology announces it as a list. Mark the active page with aria-current="page" in addition to appearance="primary" - never rely on color alone. Every icon-only Button needs an accessible name (aria-label="Previous page", "Last page", etc.). Announce page changes with a polite live region, e.g. <Text aria-live="polite">Page 3 of 12</Text> or the "11-20 of 137" range summary. The ellipsis is decorative: render it with Text aria-hidden="true" so it is skipped and never focusable. Buttons give full keyboard support (Tab/Enter/Space) for free; if focus stability matters, use disabledFocusable instead of disabled on the boundary Previous/Next buttons so focus is not dumped on document.body. If the pages are real URLs, render Link elements per page instead of stateful Buttons.

## Components used

- - [Button](../../components/button.md)
- - [Field](../../components/field.md)
- - [Select](../../components/select.md)
- - [Text](../../components/text.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
