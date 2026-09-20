# Virtualization

> **Group**: data

## Goal

Render very large data collections (thousands to hundreds of thousands of rows) in a Fluent UI v9 React app without mounting a DOM node per item, by wiring the Fluent virtualizer (useStaticVirtualizerMeasure + VirtualizerScrollView) around ordinary Fluent UI row content such as Card, Avatar, Text and Badge.

## When to Use

Use this recipe when a scrollable collection is large enough that mounting every item hurts scroll performance, memory or initial render time (roughly 1,000+ rows): activity feeds, inboxes, log viewers, contact pickers, product grids. It is also the right choice when rows have a uniform height and you want real Fluent UI components inside each row instead of a hand-rolled grid.

## When Not to Use

Avoid virtualization for small lists (a few hundred rows or less) that fit in one or two viewports: it adds complexity and it breaks browser Ctrl+F / find-in-page, printing and full-document screen-reader traversal, because offscreen rows are not in the DOM. For tabular data that needs sorting, selection and column resizing, prefer DataGrid with paging over a hand-built virtualized table. For shrinking toolbars use Overflow/OverflowItem; for paging through a small set of slides use Carousel. If row heights vary a lot and cannot be normalized, use the dynamic measuring variant (useDynamicVirtualizerMeasure + VirtualizerScrollViewDynamic) or a non-virtualized list with pagination.

Keep the DOM small while scrolling through tens of thousands of rows, and still use normal Fluent UI components for each row.

`@fluentui/react-components` ships a virtualizer: a measure hook plus a scroll-view component. You own the scrolling element and the row markup; the virtualizer owns *how many* rows exist at any moment and *where* they are positioned.

## How the pieces fit together

| Piece | Responsibility |
| --- | --- |
| `useStaticVirtualizerMeasure({ defaultItemSize })` | Measures the scroll container and returns `virtualizerLength` (how many rows may be mounted at once), `bufferItems` / `bufferSize` (extra rows kept above and below the visible window), plus the `scrollRef` and `containerSizeRef` you must wire up. |
| `VirtualizerScrollView` | Renders an element sized `numItems * itemSize` and mounts only the window plus buffer, repositioning rows as the user scrolls. |
| Your scroll container | A `div` with a **bounded height** and `overflow-y: auto`. `scrollRef` is attached here and passed to the virtualizer as `scrollViewRef`. |

`virtualizerLength`, `bufferItems` and `bufferSize` are pure plumbing. Never compute them by hand — pass through exactly what the hook returns, and keep `itemSize` in sync with the row height you actually render.

## Step-by-step

1. **Pick a row height.** Define a single constant (`const ROW_HEIGHT = 56`) and pass it to `useStaticVirtualizerMeasure({ defaultItemSize: ROW_HEIGHT })`. This is the contract between your markup and the virtualizer's scroll math.
2. **Give the scroll container a definite height.** `height: '480px'`, or in a flex layout `flex: 1 1 auto` *plus* `min-height: 0`. An auto-height container measures as 0 and the list renders nothing (or a single row).
3. **Attach `scrollRef`** to that container and pass the same ref as `scrollViewRef` on the virtualizer. `scrollRef` must point at the element that actually scrolls — the one with `overflow-y: auto`.
4. **Render `VirtualizerScrollView` inside the container** with `numItems`, `itemSize`, `virtualizerLength`, `bufferItems`, `bufferSize`, `scrollViewRef` and `containerSizeRef`. Its children are a render function: `(index: number) => React.ReactNode`.
5. **Render each row exactly `itemSize` tall.** Use `boxSizing: 'border-box'`, `height: itemSize`, and put spacing in `padding` — never `margin`. Keep text on one line (`<Text truncate>` or `whiteSpace: 'nowrap'`).
6. **Drive the collection with `numItems`.** The virtualizer is fully controlled by this prop: append to your state array (infinite scroll / "Load more") and the newly added rows become scrollable immediately. Changing `itemSize` at runtime re-measures too.

```tsx
const { virtualizerLength, bufferItems, bufferSize, scrollRef, containerSizeRef } =
  useStaticVirtualizerMeasure({ defaultItemSize: ROW_HEIGHT });

<div ref={scrollRef} style={{ height: 480, overflowY: 'auto' }}>
  <VirtualizerScrollView
    numItems={items.length}
    itemSize={ROW_HEIGHT}
    virtualizerLength={virtualizerLength}
    bufferItems={bufferItems}
    bufferSize={bufferSize}
    scrollViewRef={scrollRef}
    containerSizeRef={containerSizeRef}
  >
    {(index: number) => renderRow(items[index], index)}
  </VirtualizerScrollView>
</div>
```

## Composing Fluent components inside a virtual row

Rows are ordinary React nodes, so anything from the library works — as long as the row's outer element owns the fixed height:

- **People rows:** `<Avatar name={c.name} size={32} />` plus two `<Text>` lines (`weight="semibold"` + `size={200}`) inside a `min-width: 0` flex column so `truncate` works.
- **Status:** `<Badge appearance="tint" color={...} />` for a compact trailing indicator.
- **Cards in a grid:** virtualize *rows of tiles*, not tiles. Chunk the data (`products.slice(rowIndex * COLUMNS, ...)`) and set `numItems={Math.ceil(products.length / COLUMNS)}`. A CSS grid row with `gridTemplateColumns: repeat(3, minmax(0, 1fr))` keeps every virtual item the same height.
- **Sticky headers, dividers and toolbars:** render them *outside* the scroll container. `position: sticky` does not work inside virtualized rows because rows are absolutely positioned by the virtualizer.

## Keyboard scrolling and jumping to a row

Because `scrollRef.current` is the real scrolling element, you can compute a scroll position directly: `container.scrollTop = index * itemSize`. This is the reliable way to "jump to" a row — `element.scrollIntoView()` is useless for a row that is not currently mounted.

## Infinite scroll

Attach a scroll listener to the container (or an `IntersectionObserver` on a sentinel rendered as the last row) and append a page to your array. Growing `numItems` keeps the current scroll offset and mounts the new rows on demand; there is no need to reset the virtualizer.

## Variable heights and horizontal lists

If rows genuinely differ in height, swap `useStaticVirtualizerMeasure` for `useDynamicVirtualizerMeasure` and `VirtualizerScrollView` for `VirtualizerScrollViewDynamic`; the dynamic variant measures rendered rows and repositions the ones below. For horizontal strips, measure with a horizontal direction in the measure hook and let the same `VirtualizerScrollView` handle the axis. Both variants keep identical `numItems` / `virtualizerLength` / `bufferItems` / `bufferSize` / `scrollViewRef` / `containerSizeRef` plumbing.

## Examples

### Virtualized contact list (uniform rows)

10,000 contacts rendered with Avatar, Text and Badge inside fixed-height virtualized rows, with proper list semantics and a keyboard-focusable scroll region.

```tsx
import * as React from 'react';
import {
  Avatar,
  Badge,
  FluentProvider,
  Text,
} from '@fluentui/react-components';
import {
  VirtualizerScrollView,
  useStaticVirtualizerMeasure,
} from '@fluentui/react-components/unstable';

type ContactStatus = 'active' | 'away' | 'offline';

interface Contact {
  id: string;
  name: string;
  email: string;
  status: ContactStatus;
}

/** Every virtual row must render exactly this tall. */
const ROW_HEIGHT = 56;

const STATUS_COLOR: Record<ContactStatus, 'success' | 'warning' | 'subtle'> = {
  active: 'success',
  away: 'warning',
  offline: 'subtle',
};

function createContacts(count: number): Contact[] {
  const statuses: ContactStatus[] = ['active', 'away', 'offline'];
  return Array.from({ length: count }, (_, index) => ({
    id: `contact-${index}`,
    name: `Contact ${index + 1}`,
    email: `contact${index + 1}@contoso.com`,
    status: statuses[index % statuses.length],
  }));
}

export const VirtualizedContactList: React.FC = () => {
  const contacts = React.useMemo(() => createContacts(10000), []);

  const { virtualizerLength, bufferItems, bufferSize, scrollRef, containerSizeRef } =
    useStaticVirtualizerMeasure({ defaultItemSize: ROW_HEIGHT });

  return (
    <FluentProvider>
      {/* The scroll container: bounded height + overflow. scrollRef lives here. */}
      <div
        ref={scrollRef}
        tabIndex={0}
        role="group"
        aria-label="Contacts"
        style={{
          height: '480px',
          overflowY: 'auto',
          border: '1px solid #d1d1d1',
          borderRadius: '4px',
          backgroundColor: '#ffffff',
        }}
      >
        <VirtualizerScrollView
          numItems={contacts.length}
          itemSize={ROW_HEIGHT}
          virtualizerLength={virtualizerLength}
          bufferItems={bufferItems}
          bufferSize={bufferSize}
          scrollViewRef={scrollRef}
          containerSizeRef={containerSizeRef}
          role="list"
        >
          {(index: number) => {
            const contact = contacts[index];
            return (
              <div
                key={contact.id}
                role="listitem"
                aria-setsize={contacts.length}
                aria-posinset={index + 1}
                style={{
                  boxSizing: 'border-box',
                  height: ROW_HEIGHT,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '0 12px',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <Avatar name={contact.name} size={32} />
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                  <Text weight="semibold" truncate>
                    {contact.name}
                  </Text>
                  <Text size={200} truncate>
                    {contact.email}
                  </Text>
                </div>
                <Badge appearance="tint" color={STATUS_COLOR[contact.status]}>
                  {contact.status}
                </Badge>
              </div>
            );
          }}
        </VirtualizerScrollView>
      </div>
    </FluentProvider>
  );
};
```

### Virtualized 3-column card grid with incremental loading

Chunks a product array into grid rows, virtualizes the rows (numItems counts rows, not tiles), composes Card/CardPreview/CardHeader per tile, and appends pages of data by growing numItems.

```tsx
import * as React from 'react';
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardPreview,
  FluentProvider,
  Image,
  Text,
} from '@fluentui/react-components';
import {
  VirtualizerScrollView,
  useStaticVirtualizerMeasure,
} from '@fluentui/react-components/unstable';

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  imageUrl: string;
}

const COLUMNS = 3;
const TILE_HEIGHT = 220;
const GRID_GAP = 16;
/** One virtual item === one grid row: the tiles plus the gap below them. */
const ROW_HEIGHT = TILE_HEIGHT + GRID_GAP;
const PAGE_SIZE = 300;

const CATEGORIES = ['Furniture', 'Lighting', 'Textiles', 'Decor'];

function createProducts(start: number, count: number): Product[] {
  return Array.from({ length: count }, (_, offset) => {
    const index = start + offset;
    return {
      id: `product-${index}`,
      name: `Product ${index + 1}`,
      category: CATEGORIES[index % CATEGORIES.length],
      price: `$${((index % 90) + 10).toFixed(2)}`,
      imageUrl: `https://picsum.photos/seed/product-${index}/320/160`,
    };
  });
}

export const VirtualizedProductGrid: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>(() => createProducts(0, PAGE_SIZE));

  const { virtualizerLength, bufferItems, bufferSize, scrollRef, containerSizeRef } =
    useStaticVirtualizerMeasure({ defaultItemSize: ROW_HEIGHT });

  // numItems counts ROWS. Growing the product array is all the virtualizer needs.
  const rowCount = Math.ceil(products.length / COLUMNS);

  const loadMore = () =>
    setProducts(previous => [...previous, ...createProducts(previous.length, PAGE_SIZE)]);

  return (
    <FluentProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text weight="semibold">
            {products.length} products / {rowCount} virtual rows
          </Text>
          <Button appearance="primary" onClick={loadMore}>
            Load {PAGE_SIZE} more
          </Button>
        </div>

        <div
          ref={scrollRef}
          tabIndex={0}
          role="group"
          aria-label="Products"
          style={{
            height: '560px',
            overflowY: 'auto',
            padding: '0 12px',
            border: '1px solid #d1d1d1',
            borderRadius: '4px',
          }}
        >
          <VirtualizerScrollView
            numItems={rowCount}
            itemSize={ROW_HEIGHT}
            virtualizerLength={virtualizerLength}
            bufferItems={bufferItems}
            bufferSize={bufferSize}
            scrollViewRef={scrollRef}
            containerSizeRef={containerSizeRef}
            role="list"
          >
            {(rowIndex: number) => {
              const firstIndex = rowIndex * COLUMNS;
              const row = products.slice(firstIndex, firstIndex + COLUMNS);
              return (
                <div
                  key={rowIndex}
                  role="listitem"
                  aria-setsize={rowCount}
                  aria-posinset={rowIndex + 1}
                  style={{
                    boxSizing: 'border-box',
                    height: ROW_HEIGHT,
                    paddingBottom: GRID_GAP,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`,
                    gap: GRID_GAP,
                  }}
                >
                  {row.map(product => (
                    <Card
                      key={product.id}
                      appearance="outline"
                      size="small"
                      style={{ height: '100%', overflow: 'hidden' }}
                    >
                      <CardPreview>
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fit="cover"
                          block
                          style={{ height: '120px', width: '100%' }}
                        />
                      </CardPreview>
                      <CardHeader
                        header={
                          <Text weight="semibold" truncate>
                            {product.name}
                          </Text>
                        }
                        description={<Text size={200}>{product.price}</Text>}
                        action={
                          <Badge appearance="tint" color="brand">
                            {product.category}
                          </Badge>
                        }
                      />
                    </Card>
                  ))}
                </div>
              );
            }}
          </VirtualizerScrollView>
        </div>
      </div>
    </FluentProvider>
  );
};
```

### Jump to a row in a 50,000-row log viewer

Shows how to combine Field/Input/Button controls with the virtualizer scroll ref to programmatically jump to any index by setting scrollTop, which is the only reliable way to reach an unmounted row.

```tsx
import * as React from 'react';
import {
  Button,
  Divider,
  Field,
  FluentProvider,
  Input,
  Text,
} from '@fluentui/react-components';
import {
  VirtualizerScrollView,
  useStaticVirtualizerMeasure,
} from '@fluentui/react-components/unstable';

const ROW_HEIGHT = 40;
const ITEM_COUNT = 50000;

function formatRow(index: number): string {
  const day = String((index % 28) + 1).padStart(2, '0');
  const level = index % 5 === 0 ? 'warn' : 'info';
  return `[2024-05-${day}] event #${index} - level=${level} - virtualization keeps this list cheap`;
}

export const VirtualizedJumpList: React.FC = () => {
  const { virtualizerLength, bufferItems, bufferSize, scrollRef, containerSizeRef } =
    useStaticVirtualizerMeasure({ defaultItemSize: ROW_HEIGHT });

  const [target, setTarget] = React.useState<string>('25000');

  // Offscreen rows are not mounted, so scrollIntoView() cannot work.
  // With uniform rows the scroll offset is simply index * ROW_HEIGHT.
  const scrollToIndex = React.useCallback(
    (index: number) => {
      const container = scrollRef.current;
      if (!container) {
        return;
      }
      const clamped = Math.min(Math.max(index, 0), ITEM_COUNT - 1);
      container.scrollTop = clamped * ROW_HEIGHT;
    },
    [scrollRef],
  );

  const handleJump = () => {
    const index = Number.parseInt(target, 10);
    scrollToIndex(Number.isNaN(index) ? 0 : index);
  };

  return (
    <FluentProvider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '720px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
          <Field label="Jump to row" hint={`0 - ${ITEM_COUNT - 1}`}>
            <div style={{ width: '160px' }}>
              <Input
                type="number"
                value={target}
                onChange={(ev, data) => setTarget(data.value)}
              />
            </div>
          </Field>
          <Button appearance="primary" onClick={handleJump}>
            Scroll to row
          </Button>
          <Button appearance="secondary" onClick={() => scrollToIndex(0)}>
            Back to top
          </Button>
        </div>

        <Divider />

        <div
          ref={scrollRef}
          tabIndex={0}
          role="group"
          aria-label="Event log"
          style={{
            height: '360px',
            overflowY: 'auto',
            border: '1px solid #d1d1d1',
            borderRadius: '4px',
            backgroundColor: '#ffffff',
          }}
        >
          <VirtualizerScrollView
            numItems={ITEM_COUNT}
            itemSize={ROW_HEIGHT}
            virtualizerLength={virtualizerLength}
            bufferItems={bufferItems}
            bufferSize={bufferSize}
            scrollViewRef={scrollRef}
            containerSizeRef={containerSizeRef}
            role="list"
          >
            {(index: number) => (
              <div
                key={index}
                role="listitem"
                aria-setsize={ITEM_COUNT}
                aria-posinset={index + 1}
                style={{
                  boxSizing: 'border-box',
                  height: ROW_HEIGHT,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  borderBottom: '1px solid #f5f5f5',
                }}
              >
                <Text font="monospace" size={300} truncate>
                  {formatRow(index)}
                </Text>
              </div>
            )}
          </VirtualizerScrollView>
        </div>
      </div>
    </FluentProvider>
  );
};
```

## Pitfalls

- Scroll container without a bounded height. If the wrapper is `height: auto` — or a flex child without `min-height: 0` — the measured container size is 0 and the virtualizer renders zero or one item. Always give the scrolling element a definite height (`height: 480px`) or `flex: 1 1 auto; min-height: 0` combined with `overflow-y: auto`.
- Rendered row height does not equal `itemSize`. Vertical margins, `box-sizing: content-box`, wrapping text, or a border added outside the height make rows taller than the virtualizer thinks, producing jumps, blank gaps and a scrollbar that does not match the content. Use `boxSizing: 'border-box'`, `height: itemSize`, spacing in `padding` (never `margin`), and `<Text truncate>` / `whiteSpace: 'nowrap'` for single-line content.
- `scrollRef` attached to the wrong element. The ref from `useStaticVirtualizerMeasure` must be on the element that actually scrolls (`overflow-y: auto`) and the same ref must be passed as `scrollViewRef`. Putting it on an outer page wrapper, or on the `VirtualizerScrollView` itself while an ancestor scrolls, means the window never updates and rows beyond the first screen never render.
- Using the array index as the React key while supporting insert, remove or sort. Rows get recycled and keep stale content/DOM state; key rows by the item's stable id (`key={contact.id}`) so reconciliation matches data, not position.
- Expecting `element.scrollIntoView()` or `querySelector` to reach an offscreen row. Unmounted rows have no DOM node; compute the offset instead (`container.scrollTop = index * itemSize`) or advance the data window.
- Holding component state inside virtualized rows (open Menu, Popover, Tooltip, uncontrolled Input, expanded detail). The row is unmounted when scrolled out of the window plus buffer, losing that state. Lift row-level state into the parent keyed by item id, and prefer lightweight inline content over per-row overlays.
- Virtualizing inside another virtualizer, or nesting an extra `overflow: auto` wrapper in the row. Nested scrollers break measurement and produce two competing scroll positions; keep exactly one scrolling element per virtualized list and never place a virtualized list inside a virtual row.
- Leaving `itemSize` stale after a design change. If the row height changes (density switch, theme, responsive tweak) you must update the constant passed to `useStaticVirtualizerMeasure` and to `itemSize`; otherwise positions drift. If heights genuinely vary per row, switch to the dynamic measuring variant instead of faking it with a max height.

## Accessibility

Virtualization removes offscreen items from the DOM, so assistive technology only sees the rendered window. Compensate explicitly:

- Tell AT the true collection size. Put `role="list"` on the virtualizer root (HTML props are forwarded to the element that is the direct parent of your rows) and give every row `role="listitem"` plus `aria-setsize={totalItems}` and `aria-posinset={index + 1}`. For a table/grid role use `aria-rowcount` / `aria-rowindex` instead. The list examples above pair `aria-setsize` with `aria-posinset` so a screen reader announces "row 250 of 50,000" even though only ~15 rows exist.
- Make the scroll region keyboard reachable. A scrollable `div` must be focusable; add `tabIndex={0}` to the scrolling element so keyboard-only users can scroll with arrow keys/Page Down, and give the region an accessible name (`role="group"` plus `aria-label`, or a labelled landmark) so it is announced when focused.
- Preserve focus. Rows are unmounted when they leave the rendered window plus buffer, so any element that can hold DOM focus (Button, Link, Input) inside a row will lose focus once scrolled far away. Prefer keeping per-row interaction out of the virtualized row (use a persistent toolbar operating on the active item), or drive interaction from a single focusable container using a roving active index so the focused index always stays inside the rendered window.
- Do not put sticky group headers inside virtual rows; `position: sticky` does not survive absolute positioning. Render column/section headers outside the scroller and keep them visible, and announce group changes in text.
- Announce loading, not scrolling. When appending pages (infinite scroll or "Load more"), change the button/label text (`Loaded 300 of 10,000`) rather than relying on scroll position, so non-visual users know more content exists.
- Respect reduced motion and animation expectations: virtualization is instant repositioning, so avoid entrance animations per row that could look like content jumping when the buffer re-renders.

## Components used

- [Avatar](../../components/avatar.md)
- [Badge](../../components/badge.md)
- [Button](../../components/button.md)
- [Card](../../components/card.md)
- [CardHeader](../../components/card-header.md)
- [CardPreview](../../components/card-preview.md)
- [Divider](../../components/divider.md)
- [Field](../../components/field.md)
- [FluentProvider](../../components/fluent-provider.md)
- [Image](../../components/image.md)
- [Input](../../components/input.md)
- [Text](../../components/text.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
