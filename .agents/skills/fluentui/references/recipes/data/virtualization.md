# Virtualization

> **Group**: data

## Goal

Render very large data sets (thousands to hundreds of thousands of rows, cards, or feed entries) with FluentUI React v9 components by mounting only the rows inside the scroll viewport, while preserving keyboard navigation, screen-reader semantics, and cheap loading/append flows.

## When to Use

Use this recipe when a list, feed, or grid of rich FluentUI content is large enough that rendering every row would create thousands of DOM nodes and make scrolling, filtering, or appending janky. It fits long contact directories, activity/chat feeds, log viewers, asset galleries, and responsive card grids, especially when the list lives inside a fixed-height region (Dialog, Drawer, Tab, split pane) and must still be fully keyboard and screen-reader accessible.

## When Not to Use

Avoid it for small lists (fewer than roughly 100-200 simple rows): the windowing hook, spacer, and offset bookkeeping cost more than they save, so render normally or paginate. Avoid it when row heights are unknowable or unbounded (infinitely expanding rows) - use pagination or disclosure instead. Avoid hand-rolling offsets for data grids that need column resizing, sorting, and selection semantics; build those on FluentUI's data grid primitives plus a dedicated virtualizer. Avoid windowing rows that host Portal-rendered popups (Menu, Popover, Tooltip) whose content is positioned outside the scroll container. Finally, avoid it on pages that must print or be crawled in full without a fallback that renders all rows.

# Virtualization with FluentUI React v9

FluentUI v9 ships rich, style-heavy components (`Card`, `Avatar`, `Badge`, `Text`) and no general-purpose windowing primitive in `@fluentui/react-components`. Virtualization is therefore a **rendering strategy you apply around** those components: the data set stays large, the DOM stays tiny.

## Outcome

- A fixed-height scroll container.
- A spacer whose height equals `itemCount * rowHeight`, so the scrollbar tells the truth.
- Only the rows intersecting the viewport (plus overscan) are mounted as `Card` / `Avatar` / `Text` / `Badge`.
- Keyboard navigation that survives rows unmounting, because focus stays on the container and `aria-activedescendant` points at the active row.
- Variants for responsive card grids and for variable-height rows.

## Anatomy

```tsx
<div ref={scrollRef} style={{ height: 420, overflowY: 'auto' }}>        {/* scroller  */}
  <div style={{ position: 'relative', height: totalHeight }}>          {/* spacer    */}
    <div style={{ position: 'absolute', top: offsetTop }}>…Card…</div>  {/* window    */}
  </div>
</div>
```

Three numbers drive everything: `scrollTop`, `viewportHeight`, and `itemHeight` (or measured heights).

## Step 1 - Measure the container, not the window

`window.innerHeight` is wrong the moment the list lives inside a `Dialog`, `Drawer`, a `Tab` panel, or a split pane. Observe the scroller itself:

```tsx
const observer = new ResizeObserver(() => setViewportHeight(node.clientHeight));
observer.observe(node);
```

Read `node.scrollTop` / `node.clientHeight` once on mount so the first paint is already correct.

## Step 2 - Coalesce scroll events

A raw `scroll` listener fires far more often than the display refreshes. Schedule at most one state update per animation frame and keep the listener passive:

```tsx
const onScroll = () => {
  if (frameRef.current !== null) return;
  frameRef.current = requestAnimationFrame(() => {
    frameRef.current = null;
    setScrollTop(node.scrollTop);
  });
};
node.addEventListener('scroll', onScroll, { passive: true });
```

Keep `scrollTop` local to the list component. Putting it in a context or a shared store re-renders everything on every frame.

## Step 3 - Window math

```tsx
const firstVisible = Math.floor(scrollTop / itemHeight);
const visibleCount = Math.max(1, Math.ceil(viewportHeight / itemHeight));
const startIndex = Math.max(0, firstVisible - overscan);
const endIndex = Math.min(itemCount, firstVisible + visibleCount + overscan);
```

`overscan` of 4-10 rows absorbs flick scrolling and smooth `scrollTo` animations. Zero overscan produces visible blank gaps; hundreds of overscanned rows means you are paying for rows nobody sees.

## Step 4 - Reset the window when the data changes

Filtering, sorting, or reloading changes `itemCount`. If you never reset `scrollTop`, the viewport can sit past the end of the shorter data set and the list looks empty:

```tsx
React.useEffect(() => {
  setActiveIndex(0);
  scrollRef.current?.scrollTo({ top: 0 });
}, [query]);
```

Also clamp any stored active index to `contacts.length - 1` before rendering, because the index can point past the new result set for one frame.

## Step 5 - Keyboard and focus

Rows unmount, so **never** park keyboard focus on a row. Put focus on the scroller (`tabIndex={0}`) and describe the active row with `aria-activedescendant`:

```tsx
<div
  ref={scrollRef}
  tabIndex={0}
  role='listbox'
  aria-label='People'
  aria-activedescendant={activeIndex >= 0 ? `${baseId}-${activeIndex}` : undefined}
  onKeyDown={onKeyDown}
>
```

Handle ArrowUp/ArrowDown, Home/End, PageUp/PageDown, and Enter/Space, and after every move call `scrollToIndex(nextIndex, 'nearest')` so the active row is guaranteed to be mounted before you rely on its id. Rows expose `aria-setsize` and `aria-posinset` so assistive technology announces '4,812 of 10,000' even though 40 rows exist in the DOM.

## Step 6 - Grids: virtualize rows, never cells

For a responsive gallery, compute the column count from the measured container width and window over *rows*:

```tsx
const columns = Math.max(1, Math.floor((width - gap) / (minCardWidth + gap)));
const rowCount = Math.ceil(items.length / columns);
```

Each mounted row is a CSS grid (`gridTemplateColumns: repeat(columns, minmax(0, 1fr))`) with a fixed height, so the fixed-height window math still applies. Changing the window width changes only the column count and the row count - the windowing hook does not change at all.

## Step 7 - Variable row heights

Keep an array of measured heights, measure each mounted row in a stable ref callback, and recompute prefix offsets when a measurement changes by more than a fraction of a pixel:

```tsx
offsets[0] = 0;
for (let i = 0; i < itemCount; i += 1) {
  offsets[i + 1] = offsets[i] + (heights[i] ?? estimateHeight);
}
```

Find the first visible row with a binary search over `offsets`, sum to `offsets[itemCount]` for the spacer height, and cache the per-index ref callbacks in a `Map` so React does not treat them as new functions on every render. Clear the cache and the heights whenever the container width changes, because wrapped text reflows.

## Step 8 - Loading, appending, and empty states

- Appending 600 rows changes only `itemCount`; the render cost is one re-render plus the newly visible rows. This is the cheapest 'load more' you can build.
- Show `Skeleton` placeholders only for the rows you are genuinely fetching. Render them after the spacer so they read as 'more content below'.
- Set `aria-busy` on the scroll region while loading and use a single `Spinner` in the toolbar rather than one per row.
- Announce meaningful events (filter applied, item selected) with `MessageBar` and `politeness='polite'`; never announce on scroll.

## FluentUI-specific notes

- Keep the row visual cheap: `Card` + `Avatar` + `Text` + `Badge`. Do not mount `Menu`, `Popover`, or `Tooltip` per row - each adds a Portal and a positioning engine.
- If rows need a menu, render one shared `Menu` and position it against the active row index instead of one per row.
- Keep popup/focus state keyed by data id, not by row element, since the element can unmount at any time.
- Use design tokens (`var(--colorNeutralStroke1)`, `var(--borderRadiusMedium)`, `var(--colorNeutralForeground3)`) for container chrome so dark and high-contrast themes keep working.
- `Combobox` / `Select` option lists are not windowed by this recipe: filter or page the data before it reaches them.

## Checklist

1. Scroller has an explicit height and `overflow-y: auto`.
2. Spacer height is `itemCount * rowHeight` (or the measured total).
3. `scrollTop` and `viewportHeight` come from the container, updated at most once per frame.
4. Every virtual row is absolutely positioned at its computed `top` and has the exact height the math assumes.
5. `scrollTop` resets when the data set or filter changes; active index is clamped.
6. Keyboard focus stays on the container; `aria-activedescendant`, `aria-setsize`, and `aria-posinset` are set.
7. Listeners, observers, and pending animation frames are cleaned up on unmount.

## Examples

### VirtualizedPeopleDirectory (fixed-height rows, keyboard, search)

A single-select directory of 10,000 contacts where only ~30 rows exist in the DOM. Includes the reusable windowing hook, rAF-coalesced scroll tracking, ResizeObserver-based viewport measurement, aria-activedescendant keyboard navigation, aria-setsize/aria-posinset on unmounted-agnostic options, filter-reset handling, and first/last jump buttons.

```tsx
// VirtualizedPeopleDirectory.tsx
import * as React from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Field,
  Input,
  MessageBar,
  Text,
} from '@fluentui/react-components';

/* ------------------------------------------------------------------ */
/* 1. The windowing hook: the DOM only ever holds the visible rows.    */
/* ------------------------------------------------------------------ */

export interface VirtualItem {
  index: number;
  offsetTop: number;
}

export interface UseVirtualWindowOptions {
  /** Rows in the data set, not rows in the DOM. */
  itemCount: number;
  /** Fixed row height in pixels - every virtual row must be exactly this tall. */
  itemHeight: number;
  /** The element that owns the scrollbar. */
  scrollRef: React.RefObject<HTMLDivElement | null>;
  /** Rows rendered above and below the viewport. */
  overscan?: number;
}

export interface VirtualWindow {
  virtualItems: VirtualItem[];
  totalHeight: number;
  scrollToIndex: (index: number, align?: 'start' | 'center' | 'nearest') => void;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useVirtualWindow({
  itemCount,
  itemHeight,
  scrollRef,
  overscan = 6,
}: UseVirtualWindowOptions): VirtualWindow {
  const [scrollTop, setScrollTop] = React.useState(0);
  const [viewportHeight, setViewportHeight] = React.useState(0);
  const frameRef = React.useRef<number | null>(null);

  // Measure the container (not the window) and coalesce scroll events.
  React.useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const onScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        setScrollTop(node.scrollTop);
      });
    };

    setScrollTop(node.scrollTop);
    setViewportHeight(node.clientHeight);
    node.addEventListener('scroll', onScroll, { passive: true });

    const observer = new ResizeObserver(() => setViewportHeight(node.clientHeight));
    observer.observe(node);

    return () => {
      node.removeEventListener('scroll', onScroll);
      observer.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [scrollRef]);

  const totalHeight = itemCount * itemHeight;
  const firstVisible = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.max(1, Math.ceil(viewportHeight / itemHeight));
  const startIndex = Math.max(0, firstVisible - overscan);
  const endIndex = Math.min(itemCount, firstVisible + visibleCount + overscan);

  const virtualItems = React.useMemo(() => {
    const items: VirtualItem[] = [];
    for (let index = startIndex; index < endIndex; index += 1) {
      items.push({ index, offsetTop: index * itemHeight });
    }
    return items;
  }, [startIndex, endIndex, itemHeight]);

  const scrollToIndex = React.useCallback<VirtualWindow['scrollToIndex']>(
    (index, align = 'nearest') => {
      const node = scrollRef.current;
      if (!node) return;
      const itemTop = index * itemHeight;
      const itemBottom = itemTop + itemHeight;
      const viewTop = node.scrollTop;
      const viewBottom = viewTop + node.clientHeight;

      let next = viewTop;
      if (align === 'start') next = itemTop;
      else if (align === 'center') next = itemTop - (node.clientHeight - itemHeight) / 2;
      else if (itemTop < viewTop) next = itemTop;
      else if (itemBottom > viewBottom) next = itemBottom - node.clientHeight;

      node.scrollTo({
        top: Math.max(0, Math.min(next, totalHeight - node.clientHeight)),
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    },
    [itemHeight, scrollRef, totalHeight],
  );

  return { virtualItems, totalHeight, scrollToIndex };
}

/* ------------------------------------------------------------------ */
/* 2. Data model                                                       */
/* ------------------------------------------------------------------ */

export interface Contact {
  id: string;
  name: string;
  role: string;
  team: string;
  status: 'available' | 'busy' | 'offline';
}

const FIRST_NAMES = ['Ada', 'Grace', 'Alan', 'Katherine', 'Linus', 'Margaret', 'Barbara', 'Ken'];
const LAST_NAMES = ['Lovelace', 'Hopper', 'Turing', 'Johnson', 'Torvalds', 'Hamilton', 'Liskov', 'Thompson'];
const TEAMS = ['Platform', 'Design systems', 'Data', 'Growth', 'Mobile', 'Security'];
const ROLES = ['Engineer', 'Designer', 'Program manager', 'Data scientist'];

function buildContacts(count: number): Contact[] {
  const contacts: Contact[] = [];
  for (let index = 0; index < count; index += 1) {
    const first = FIRST_NAMES[index % FIRST_NAMES.length];
    const last = LAST_NAMES[Math.floor(index / FIRST_NAMES.length) % LAST_NAMES.length];
    contacts.push({
      id: `contact-${index}`,
      name: `${first} ${last}`,
      role: ROLES[index % ROLES.length],
      team: TEAMS[index % TEAMS.length],
      status: index % 7 === 0 ? 'offline' : index % 4 === 0 ? 'busy' : 'available',
    });
  }
  return contacts;
}

const statusColor = (status: Contact['status']): 'success' | 'danger' | 'subtle' =>
  status === 'available' ? 'success' : status === 'busy' ? 'danger' : 'subtle';

const ROW_HEIGHT = 64;
const VIEWPORT_HEIGHT = 420;
const TOTAL_CONTACTS = 10000;

/* ------------------------------------------------------------------ */
/* 3. The virtualized list                                             */
/* ------------------------------------------------------------------ */

export const VirtualizedPeopleDirectory: React.FC = () => {
  const [allContacts] = React.useState(() => buildContacts(TOTAL_CONTACTS));
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const optionBaseId = React.useId();

  const contacts = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length === 0) return allContacts;
    return allContacts.filter(
      contact =>
        contact.name.toLowerCase().includes(needle) ||
        contact.role.toLowerCase().includes(needle) ||
        contact.team.toLowerCase().includes(needle),
    );
  }, [allContacts, query]);

  const { virtualItems, totalHeight, scrollToIndex } = useVirtualWindow({
    itemCount: contacts.length,
    itemHeight: ROW_HEIGHT,
    overscan: 8,
    scrollRef,
  });

  // A new result set invalidates the old scroll offset; without this the
  // viewport can sit past the end of the list and render nothing.
  React.useEffect(() => {
    setActiveIndex(0);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [query]);

  const activeIndexSafe = Math.min(activeIndex, Math.max(0, contacts.length - 1));
  const selected = contacts.find(contact => contact.id === selectedId);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (contacts.length === 0) return;
    let nextIndex = activeIndexSafe;
    switch (event.key) {
      case 'ArrowDown':
        nextIndex = Math.min(activeIndexSafe + 1, contacts.length - 1);
        break;
      case 'ArrowUp':
        nextIndex = Math.max(activeIndexSafe - 1, 0);
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = contacts.length - 1;
        break;
      case 'PageDown':
        nextIndex = Math.min(activeIndexSafe + 10, contacts.length - 1);
        break;
      case 'PageUp':
        nextIndex = Math.max(activeIndexSafe - 10, 0);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        setSelectedId(contacts[activeIndexSafe].id);
        return;
      default:
        return;
    }
    event.preventDefault();
    setActiveIndex(nextIndex);
    scrollToIndex(nextIndex, 'nearest');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 720 }}>
      <Field
        label='Search people'
        hint={`${contacts.length.toLocaleString()} of ${TOTAL_CONTACTS.toLocaleString()} people match`}
      >
        <Input type='search' value={query} onChange={(_event, data) => setQuery(data.value)} />
      </Field>

      {contacts.length === 0 ? (
        <MessageBar intent='warning' politeness='polite'>
          No people match “{query}”.
        </MessageBar>
      ) : (
        <div
          ref={scrollRef}
          tabIndex={0}
          role='listbox'
          aria-label='People'
          aria-activedescendant={contacts.length > 0 ? `${optionBaseId}-${activeIndexSafe}` : undefined}
          onKeyDown={onKeyDown}
          style={{
            position: 'relative',
            height: VIEWPORT_HEIGHT,
            overflowY: 'auto',
            contain: 'strict',
            border: '1px solid var(--colorNeutralStroke1)',
            borderRadius: 'var(--borderRadiusMedium)',
          }}
        >
          {/* The spacer gives the scrollbar the real data-set height. */}
          <div style={{ position: 'relative', height: totalHeight }}>
            {virtualItems.map(({ index, offsetTop }) => {
              const contact = contacts[index];
              const isActive = index === activeIndexSafe;
              const isSelected = contact.id === selectedId;
              return (
                <div
                  key={contact.id}
                  id={`${optionBaseId}-${index}`}
                  role='option'
                  aria-selected={isSelected}
                  aria-setsize={contacts.length}
                  aria-posinset={index + 1}
                  onMouseDown={() => {
                    setActiveIndex(index);
                    setSelectedId(contact.id);
                  }}
                  style={{
                    position: 'absolute',
                    top: offsetTop,
                    left: 0,
                    right: 0,
                    height: ROW_HEIGHT,
                    padding: 6,
                    boxSizing: 'border-box',
                  }}
                >
                  <Card
                    appearance={isSelected ? 'filled-alternative' : 'subtle'}
                    orientation='horizontal'
                    size='small'
                    focusMode='off'
                    style={{
                      height: '100%',
                      boxSizing: 'border-box',
                      alignItems: 'center',
                      gap: 12,
                      paddingInline: 12,
                      outline: isActive ? '2px solid var(--colorStrokeFocus2)' : 'none',
                      outlineOffset: -2,
                    }}
                  >
                    <Avatar name={contact.name} idForColor={contact.id} color='colorful' size={40} />
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                      <Text weight='semibold' truncate>
                        {contact.name}
                      </Text>
                      <Text size={200} truncate style={{ color: 'var(--colorNeutralForeground3)' }}>
                        {contact.role} · {contact.team}
                      </Text>
                    </div>
                    <Badge appearance='tint' color={statusColor(contact.status)} size='small'>
                      {contact.status}
                    </Badge>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Button appearance='secondary' onClick={() => scrollToIndex(0, 'start')}>
          First
        </Button>
        <Button
          appearance='secondary'
          disabled={contacts.length === 0}
          onClick={() => scrollToIndex(contacts.length - 1, 'start')}
        >
          Last
        </Button>
        <Divider vertical style={{ height: 24 }} />
        <Text size={200} font='numeric'>
          {virtualItems.length} rows in the DOM · {contacts.length.toLocaleString()} in the data set
        </Text>
      </div>

      {selected ? (
        <MessageBar intent='success' politeness='polite'>
          Selected {selected.name} ({selected.team})
        </MessageBar>
      ) : null}
    </div>
  );
};
```

### VirtualizedGallery (responsive grid + incremental loading)

A 2,400-card gallery that virtualizes grid rows instead of cells. The column count is derived from a ResizeObserver on the scroller, so the same row-window hook works at any width. Appending 600 rows costs one re-render; Skeleton placeholders and a Spinner cover the fetch.

```tsx
// VirtualizedGallery.tsx
import * as React from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Skeleton,
  Spinner,
  Text,
} from '@fluentui/react-components';

type ProjectStatus = 'on track' | 'at risk' | 'blocked';

interface Project {
  id: string;
  name: string;
  owner: string;
  status: ProjectStatus;
  updated: string;
}

const OWNERS = [
  'Ada Lovelace',
  'Grace Hopper',
  'Alan Turing',
  'Katherine Johnson',
  'Barbara Liskov',
  'Ken Thompson',
];
const AREAS = ['Checkout', 'Search', 'Billing', 'Onboarding', 'Notifications', 'Reporting', 'Identity', 'Editor'];
const STATUSES: ProjectStatus[] = ['on track', 'at risk', 'blocked'];

function buildProjects(count: number, offset = 0): Project[] {
  const projects: Project[] = [];
  for (let index = 0; index < count; index += 1) {
    const ordinal = offset + index;
    projects.push({
      id: `project-${ordinal}`,
      name: `${AREAS[ordinal % AREAS.length]} revamp ${Math.floor(ordinal / AREAS.length) + 1}`,
      owner: OWNERS[ordinal % OWNERS.length],
      status: STATUSES[ordinal % 9 === 0 ? 2 : ordinal % 4 === 0 ? 1 : 0],
      updated: `${1 + (ordinal % 27)} days ago`,
    });
  }
  return projects;
}

const statusColor = (status: ProjectStatus): 'success' | 'warning' | 'danger' =>
  status === 'on track' ? 'success' : status === 'at risk' ? 'warning' : 'danger';

/** Window a set of fixed-height grid rows. */
function useVirtualRows({
  rowCount,
  rowHeight,
  scrollRef,
  overscan = 3,
}: {
  rowCount: number;
  rowHeight: number;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const [viewportHeight, setViewportHeight] = React.useState(0);
  const frameRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const onScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        setScrollTop(node.scrollTop);
      });
    };

    setScrollTop(node.scrollTop);
    setViewportHeight(node.clientHeight);
    node.addEventListener('scroll', onScroll, { passive: true });

    const observer = new ResizeObserver(() => setViewportHeight(node.clientHeight));
    observer.observe(node);

    return () => {
      node.removeEventListener('scroll', onScroll);
      observer.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [scrollRef]);

  const totalHeight = rowCount * rowHeight;
  const firstVisibleRow = Math.floor(scrollTop / rowHeight);
  const visibleRows = Math.max(1, Math.ceil(viewportHeight / rowHeight));
  const startRow = Math.max(0, firstVisibleRow - overscan);
  const endRow = Math.min(rowCount, firstVisibleRow + visibleRows + overscan);

  const rows = React.useMemo(() => {
    const next: number[] = [];
    for (let row = startRow; row < endRow; row += 1) next.push(row);
    return next;
  }, [startRow, endRow]);

  return { rows, totalHeight, renderedRows: rows.length };
}

const MIN_CARD_WIDTH = 220;
const CARD_HEIGHT = 168;
const GAP = 12;
const ROW_HEIGHT = CARD_HEIGHT + GAP;

export const VirtualizedGallery: React.FC = () => {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [projects, setProjects] = React.useState<Project[]>(() => buildProjects(2400));
  const [columns, setColumns] = React.useState(3);
  const [isLoading, setIsLoading] = React.useState(false);

  // The column count follows the container, so the same row window works at
  // any width.
  React.useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const measure = () => {
      const next = Math.max(1, Math.floor((node.clientWidth - GAP) / (MIN_CARD_WIDTH + GAP)));
      setColumns(previous => (previous === next ? previous : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const rowCount = Math.ceil(projects.length / columns);
  const { rows, totalHeight, renderedRows } = useVirtualRows({
    rowCount,
    rowHeight: ROW_HEIGHT,
    scrollRef,
  });

  const loadMore = () => {
    setIsLoading(true);
    window.setTimeout(() => {
      setProjects(previous => [...previous, ...buildProjects(600, previous.length)]);
      setIsLoading(false);
    }, 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Text weight='semibold' size={400}>
          Projects
        </Text>
        <Badge appearance='tint' color='informative' size='small'>
          {projects.length.toLocaleString()}
        </Badge>
        {isLoading ? (
          <Spinner size='extra-small' label='Loading more projects' labelPosition='after' />
        ) : null}
      </div>

      <div
        ref={scrollRef}
        role='region'
        aria-label='Projects'
        aria-busy={isLoading}
        tabIndex={0}
        style={{
          position: 'relative',
          height: 520,
          overflowY: 'auto',
          contain: 'strict',
          border: '1px solid var(--colorNeutralStroke1)',
          borderRadius: 'var(--borderRadiusMedium)',
        }}
      >
        <div style={{ position: 'relative', height: totalHeight }}>
          {rows.map(row => {
            const rowProjects = projects.slice(row * columns, row * columns + columns);
            return (
              <div
                key={row}
                style={{
                  position: 'absolute',
                  top: row * ROW_HEIGHT,
                  left: 0,
                  right: 0,
                  height: ROW_HEIGHT,
                  boxSizing: 'border-box',
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  gap: GAP,
                  paddingInline: GAP,
                  paddingTop: GAP,
                }}
              >
                {rowProjects.map(project => (
                  <Card
                    key={project.id}
                    appearance='outline'
                    size='small'
                    focusMode='off'
                    style={{
                      height: CARD_HEIGHT,
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <Avatar name={project.owner} idForColor={project.id} color='colorful' size={32} />
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <Text size={200} truncate>
                          {project.owner}
                        </Text>
                        <Text size={100} truncate style={{ color: 'var(--colorNeutralForeground3)' }}>
                          Updated {project.updated}
                        </Text>
                      </div>
                    </div>
                    <Text weight='semibold' truncate>
                      {project.name}
                    </Text>
                    <Badge appearance='tint' color={statusColor(project.status)} size='small'>
                      {project.status}
                    </Badge>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>

        {/* Placeholders live after the spacer, so they read as 'more below'. */}
        {isLoading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap: GAP,
              padding: GAP,
            }}
          >
            {Array.from({ length: columns }, (_value, index) => (
              <Skeleton
                key={index}
                shape='rectangle'
                animation='wave'
                style={{ height: CARD_HEIGHT, width: '100%' }}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Button appearance='primary' onClick={loadMore} disabled={isLoading}>
          Load 600 more
        </Button>
        <Divider vertical style={{ height: 24 }} />
        <Text size={200} font='numeric'>
          {renderedRows} of {rowCount.toLocaleString()} grid rows mounted
        </Text>
      </div>
    </div>
  );
};
```

### VirtualizedActivityFeed (measured, variable row heights)

A 5,000-entry activity feed where every row is a different height. Heights are measured with getBoundingClientRect from cached ref callbacks, prefix offsets are recomputed only when a measurement changes by more than a fractional pixel, and a binary search finds the first visible row. Measurements are discarded when the container width changes so reflowed text stays accurate.

```tsx
// VirtualizedActivityFeed.tsx
import * as React from 'react';
import { Avatar, Badge, Button, Card, Divider, Text } from '@fluentui/react-components';

interface Activity {
  id: string;
  author: string;
  kind: 'comment' | 'review' | 'deploy';
  message: string;
}

const AUTHORS = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson', 'Barbara Liskov'];

const SENTENCES = [
  'Looks good to me.',
  'Can we split this into two pull requests so the review stays small?',
  'Deployed to the staging ring and watched the dashboards for ten minutes; error rate and p95 latency both stayed flat, so I am comfortable promoting this to the canary ring next.',
  'Nice catch - I missed that branch entirely.',
  'I left a few comments about naming, nothing blocking.',
  'The migration ran for eleven minutes on a four-million-row table, which is slower than we budgeted, so I moved it to the weekend window.',
  'Reverted for now; I will reopen once the flaky test is fixed.',
];

function buildActivities(count: number): Activity[] {
  const activities: Activity[] = [];
  for (let index = 0; index < count; index += 1) {
    const sentenceCount = 1 + (index % 3);
    const message = Array.from(
      { length: sentenceCount },
      (_value, offset) => SENTENCES[(index + offset) % SENTENCES.length],
    ).join(' ');
    activities.push({
      id: `activity-${index}`,
      author: AUTHORS[index % AUTHORS.length],
      kind: index % 5 === 0 ? 'deploy' : index % 3 === 0 ? 'review' : 'comment',
      message,
    });
  }
  return activities;
}

const GAP = 8;
const ESTIMATED_ROW_HEIGHT = 88;

/** Binary search for the last row whose top offset is <= target. */
function findRowAt(offsets: number[], target: number): number {
  let low = 0;
  let high = offsets.length - 1;
  while (low < high) {
    const mid = (low + high + 1) >> 1;
    if (offsets[mid] <= target) low = mid;
    else high = mid - 1;
  }
  return Math.min(low, offsets.length - 2);
}

interface UseVariableVirtualWindowOptions {
  itemCount: number;
  /** Height used for rows that have not been measured yet. */
  estimateHeight: number;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  overscan?: number;
}

interface VariableVirtualWindow {
  virtualItems: { index: number; offsetTop: number }[];
  totalHeight: number;
  measureRow: (index: number) => (node: HTMLDivElement | null) => void;
}

export function useVariableVirtualWindow({
  itemCount,
  estimateHeight,
  scrollRef,
  overscan = 4,
}: UseVariableVirtualWindowOptions): VariableVirtualWindow {
  const [scrollTop, setScrollTop] = React.useState(0);
  const [viewportHeight, setViewportHeight] = React.useState(0);
  const [measureVersion, bumpMeasureVersion] = React.useReducer((version: number) => version + 1, 0);

  const heightsRef = React.useRef<number[]>([]);
  const callbacksRef = React.useRef(new Map<number, (node: HTMLDivElement | null) => void>());
  const scrollFrameRef = React.useRef<number | null>(null);
  const measureFrameRef = React.useRef<number | null>(null);
  const estimateRef = React.useRef(estimateHeight);
  estimateRef.current = estimateHeight;

  React.useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const onScroll = () => {
      if (scrollFrameRef.current !== null) return;
      scrollFrameRef.current = requestAnimationFrame(() => {
        scrollFrameRef.current = null;
        setScrollTop(node.scrollTop);
      });
    };

    setScrollTop(node.scrollTop);
    setViewportHeight(node.clientHeight);
    node.addEventListener('scroll', onScroll, { passive: true });

    const observer = new ResizeObserver(() => setViewportHeight(node.clientHeight));
    observer.observe(node);

    return () => {
      node.removeEventListener('scroll', onScroll);
      observer.disconnect();
      if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
      if (measureFrameRef.current !== null) cancelAnimationFrame(measureFrameRef.current);
    };
  }, [scrollRef]);

  // Wrapped text reflows on resize, so measured heights are no longer valid.
  React.useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    let width = node.clientWidth;
    const observer = new ResizeObserver(() => {
      if (node.clientWidth === width) return;
      width = node.clientWidth;
      heightsRef.current = [];
      callbacksRef.current.clear();
      bumpMeasureVersion();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [scrollRef]);

  // Prefix sums: top of row i is offsets[i], total height is offsets[itemCount].
  const offsets = React.useMemo(() => {
    const next = new Array<number>(itemCount + 1);
    next[0] = 0;
    for (let index = 0; index < itemCount; index += 1) {
      next[index + 1] = next[index] + (heightsRef.current[index] ?? estimateHeight);
    }
    return next;
    // measureVersion is the signal that heightsRef changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemCount, estimateHeight, measureVersion]);

  const startIndex = Math.max(0, findRowAt(offsets, scrollTop) - overscan);
  const endIndex = Math.min(itemCount, findRowAt(offsets, scrollTop + viewportHeight) + overscan + 1);

  const virtualItems = React.useMemo(() => {
    const items: { index: number; offsetTop: number }[] = [];
    for (let index = startIndex; index < endIndex; index += 1) {
      items.push({ index, offsetTop: offsets[index] });
    }
    return items;
  }, [startIndex, endIndex, offsets]);

  // Cache one callback per index so React does not detach/reattach refs on
  // every render.
  const measureRow = React.useCallback((index: number) => {
    const cache = callbacksRef.current;
    const cached = cache.get(index);
    if (cached) return cached;

    const callback = (node: HTMLDivElement | null) => {
      if (!node) return;
      const measured = node.getBoundingClientRect().height;
      const previous = heightsRef.current[index] ?? estimateRef.current;
      if (Math.abs(measured - previous) < 0.5) return;
      heightsRef.current[index] = measured;
      if (measureFrameRef.current !== null) return;
      measureFrameRef.current = requestAnimationFrame(() => {
        measureFrameRef.current = null;
        bumpMeasureVersion();
      });
    };

    cache.set(index, callback);
    return callback;
  }, []);

  return { virtualItems, totalHeight: offsets[itemCount] ?? 0, measureRow };
}

const kindColor = (kind: Activity['kind']): 'brand' | 'informative' | 'important' =>
  kind === 'deploy' ? 'important' : kind === 'review' ? 'informative' : 'brand';

export const VirtualizedActivityFeed: React.FC = () => {
  const [activities] = React.useState(() => buildActivities(5000));
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const { virtualItems, totalHeight, measureRow } = useVariableVirtualWindow({
    itemCount: activities.length,
    estimateHeight: ESTIMATED_ROW_HEIGHT,
    scrollRef,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Text weight='semibold' size={400}>
          Activity
        </Text>
        <Badge appearance='tint' color='informative' size='small'>
          {activities.length.toLocaleString()}
        </Badge>
      </div>

      <div
        ref={scrollRef}
        role='region'
        aria-label='Activity feed'
        tabIndex={0}
        style={{
          position: 'relative',
          height: 480,
          overflowY: 'auto',
          contain: 'strict',
          border: '1px solid var(--colorNeutralStroke1)',
          borderRadius: 'var(--borderRadiusMedium)',
        }}
      >
        <div role='list' style={{ position: 'relative', height: totalHeight }}>
          {virtualItems.map(({ index, offsetTop }) => {
            const activity = activities[index];
            return (
              <div
                key={activity.id}
                ref={measureRow(index)}
                role='listitem'
                aria-posinset={index + 1}
                aria-setsize={activities.length}
                style={{
                  position: 'absolute',
                  top: offsetTop,
                  left: 0,
                  right: 0,
                  paddingBottom: GAP,
                  paddingInline: GAP,
                  boxSizing: 'border-box',
                }}
              >
                <Card
                  appearance='subtle'
                  size='small'
                  focusMode='off'
                  orientation='horizontal'
                  style={{ alignItems: 'flex-start', gap: 12, padding: 12, boxSizing: 'border-box' }}
                >
                  <Avatar name={activity.author} idForColor={activity.id} color='colorful' size={32} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Text weight='semibold' size={200}>
                        {activity.author}
                      </Text>
                      <Badge appearance='ghost' color={kindColor(activity.kind)} size='small'>
                        {activity.kind}
                      </Badge>
                    </div>
                    <Text size={300} wrap>
                      {activity.message}
                    </Text>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Button
          appearance='secondary'
          onClick={() => {
            const node = scrollRef.current;
            if (node) node.scrollTo({ top: node.scrollHeight });
          }}
        >
          Jump to latest
        </Button>
        <Divider vertical style={{ height: 24 }} />
        <Text size={200}>
          {virtualItems.length} of {activities.length.toLocaleString()} entries mounted · heights are
          measured, not assumed
        </Text>
      </div>
    </div>
  );
};
```

## Pitfalls

- Rendering the whole data set and calling it virtualized. The point is a bounded DOM: mount only the rows between startIndex and endIndex plus overscan. Verify by counting rendered row elements, not by counting data length.
- Setting state on every scroll event. Raw scroll handlers fire far faster than the display refreshes; coalesce to one state update per animation frame with requestAnimationFrame, use { passive: true }, and keep the scroll offset out of any context or store that re-renders the wider app.
- Putting tabbable controls or focusable Cards inside virtual rows. When the row unmounts the browser drops focus to <body>. Keep focus on the scroll container and use aria-activedescendant, or move focus deliberately before a row leaves the window.
- Never resetting scrollTop when the data set changes. After filtering 10,000 rows down to 12, the old offset leaves the viewport past the end of the content and the list looks empty - reset to 0 and clamp the active index on every filter/sort/data change.
- Measuring window.innerHeight instead of the scroll container. Inside a Dialog, Drawer, Tab panel, or split pane the container is a fraction of the viewport, so the window math is wrong and you either render everything or nothing.
- Letting the spacer height drift from the data. The spacer must be itemCount * rowHeight (or the measured total); deriving it from the currently rendered rows makes the scrollbar shrink as you scroll and causes scroll thrash.
- Positioning rows with transform: translateY() while a position: sticky element lives inside the same wrapper. A transform creates a containing block and breaks sticky - use position: absolute with a computed top offset for rows.
- Comparing measured heights exactly. Sub-pixel differences between renders cause update loops; store a measurement only when it differs by more than about 0.5px and batch the resulting state update in a requestAnimationFrame.
- Setting overscan to 0 or 1. Flick scrolling and smooth scrollToIndex animations leave visible blank gaps; 4-10 extra rows is cheap insurance against empty frames.
- Leaving listeners and observers attached. When the list lives inside a Dialog or Drawer, remove the scroll listener, disconnect the ResizeObserver, and cancel pending animation frames in the effect cleanup, otherwise detached nodes keep receiving events.

## Accessibility

Windowed rows still have to behave like the whole list:

- **Roles must match behavior.** A selectable list is `role='listbox'` with `role='option'` children carrying `aria-selected`; read-only content is `role='list'` + `role='listitem'`. Do not put decorative chrome such as headers, toolbars, or sticky banners inside a `listbox` - only `option` (or `group`) children are valid - keep that chrome outside the scroller.
- **The accessible count comes from ARIA, not the DOM.** Add `aria-setsize` and `aria-posinset` (and `aria-rowcount` / `aria-rowindex` for grids) so a screen reader announces '4,812 of 10,000' while only ~40 rows exist in the DOM.
- **Keep focus on the container.** `tabIndex={0}` plus `aria-activedescendant` pointing at the active row's stable id (a `React.useId()` prefix plus the index) means focus never unmounts when a row leaves the window. The referenced element must be mounted, so always `scrollToIndex` the active row before relying on its id.
- **Implement the full keyboard contract:** ArrowUp / ArrowDown, Home / End, PageUp / PageDown, Enter / Space to select (and Escape if selection can be cleared). Call `preventDefault()` for the keys you handle so the container does not also scroll.
- **Keep a visible focus indicator** on the active row (an outline, or a `Card` appearance change) because the container - not the row - owns focus.
- **Respect `prefers-reduced-motion`** before passing `behavior: 'smooth'` to `scrollTo`, and never auto-scroll while the user is reading.
- **Do not announce on scroll.** Use `MessageBar` with `politeness='polite'` only for meaningful events such as a filter change or a selection.
- **Text scaling and hit targets.** Fixed row heights can clip text at 200% zoom - size rows for the tallest expected content or use the measured-height variant - and keep interactive rows at least 44px tall for touch.
- **Reading order stays correct** because absolutely positioned rows are emitted in ascending index order; never sort the mounted slice differently from the data.

## Components used

- - [Avatar](../../components/avatar.md)
- - [Badge](../../components/badge.md)
- - [Button](../../components/button.md)
- - [Card](../../components/card.md)
- - [Divider](../../components/divider.md)
- - [Field](../../components/field.md)
- - [Input](../../components/input.md)
- - [MessageBar](../../components/message-bar.md)
- - [Skeleton](../../components/skeleton.md)
- - [Spinner](../../components/spinner.md)
- - [Text](../../components/text.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
