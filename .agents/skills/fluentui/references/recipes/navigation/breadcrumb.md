# Breadcrumb

> **Group**: navigation

## Goal

Build an accessible, responsive breadcrumb trail with Fluent UI React v9 that shows the user's position in a hierarchy and lets them jump back to any ancestor, covering sizing, focus management, current-page semantics, router integration, and a collapse-to-ellipsis strategy for long trails.

## When to Use

Use a breadcrumb when the user is deep inside a hierarchy (typically 3+ levels) and needs both orientation ('where am I?') and a one-click path to ancestor pages: e-commerce category > product pages, file/folder browsers, settings sub-pages, report/detail views, or any drill-down UI rendered above a page title. It is also the right control when the same page must be reachable from multiple parents and you want to show which path the user took.

## When Not to Use

Avoid breadcrumbs when the hierarchy is one level deep (a page title plus Back is enough), when the destinations are flat siblings of equal weight (use Tabs or a vertical Nav), when the user must switch between many parallel areas (use Nav or Menu), or when the trail is meant to be the primary navigation of the app. Do not use breadcrumbs for linear processes/steps (use a wizard/stepper) and do not rely on them as a substitute for working browser history in SPAs where URLs change without navigation.

## What this recipe builds

A Fluent UI v9 breadcrumb trail composed from `Breadcrumb`, `BreadcrumbItem`, `BreadcrumbButton`, and `BreadcrumbDivider`, covering four production concerns:

1. A correct, semantic trail with interactive ancestors and a non-interactive current page.
2. Long trails that collapse into an ellipsis control instead of overflowing the header.
3. Configuration of `size` and `focusMode` for different chrome densities.
4. Router integration (callback navigation and real anchors).

## Anatomy and DOM semantics

```tsx
<Breadcrumb aria-label="Breadcrumb" size="medium" focusMode="tab">
  <BreadcrumbItem>{/* <li> */}
    <BreadcrumbButton>{/* Button */}</BreadcrumbButton>
  </BreadcrumbItem>
  <BreadcrumbDivider />        {/* decorative <li role="separator" aria-hidden="true" /> */}
  <BreadcrumbItem>
    <span aria-current="page">Current page</span>
  </BreadcrumbItem>
</Breadcrumb>
```

- `Breadcrumb` renders a `<nav>` landmark wrapping an ordered list.
- `BreadcrumbItem` is the list item (`<li>`) that holds exactly one crumb: a `BreadcrumbButton`, a `Link`/anchor, or plain text.
- `BreadcrumbDivider` is a **separate list item**, not a child of the crumb. It is decorative by default, so a trail with `N` crumbs has `2N - 1` direct children.
- `BreadcrumbButton` is a `Button` styled for breadcrumbs, so it accepts Button props such as `icon`, `iconPosition`, `appearance`, and `size`.

## Sizing

`size` accepts `"small" | "medium" | "large"` and controls the type/height rhythm of the whole trail. Use `small` inside dense page headers or side panels, `medium` in body content, and `large` only for prominent hero areas. If you inject custom controls into the trail (like the ellipsis `Button` in the collapse example), match their `size` to the breadcrumb `size`, otherwise the row looks uneven.

## Focus mode

- `focusMode="tab"` makes every crumb an individual tab stop. More discoverable, but noisy when the trail is long.
- `focusMode="arrow"` makes the whole trail a single tab stop; Left/Right arrows move focus between crumbs (roving tabindex managed by Tabster). This is the better default for global chrome and dense headers.

Only choose `arrow` when every visible crumb is focusable. A trail that mixes focusable buttons with plain text ancestors in `arrow` mode gives keyboard users arrows that land on nothing meaningful.

## Marking the current page

Render the final crumb as non-interactive text carrying `aria-current="page"`:

```tsx
<BreadcrumbItem>
  <span aria-current="page">Widget 42</span>
</BreadcrumbItem>
```

Making the current page a link or button produces a redundant navigation target: keyboard users tab onto a link that reloads the page they are on, and screen reader users hear it announced as a destination equal to the others.

## Long trails

A breadcrumb list grows horizontally and does **not** truncate itself, so a deep path either wraps into ugly multi-line rows or pushes your header layout. Collapse the middle when the trail exceeds a threshold: keep the first crumb (usually Home), replace the middle with a `Button` labelled with an ellipsis, and always keep the last 1-2 crumbs visible so the user's immediate context is intact. The ellipsis must be a real button with an accessible name (`aria-label`) that actually reveals the hidden crumbs — never a hover-only popover or a purely decorative "...".

When the route changes, reset the expanded state (see the `useEffect` on the route key in the collapse example), otherwise a trail stays permanently expanded after the user expands it once.

## Router integration

The two practical shapes are:

1. **Callback navigation** (client-side router): `<BreadcrumbButton onClick={() => navigate(crumb.path)}>`. Simple and works with any router.
2. **Real anchors**: render `Link href="..."` inside `BreadcrumbItem` when your router produces real, shareable URLs. Anchors preserve middle-click, Ctrl+click, 'open in new tab', and crawlability — prefer this whenever the route maps to a URL you would paste into a browser.

In both cases the data source should be the same list of `{ path, label }` segments you already derive from the router; never hardcode the trail inside the page component.

## RTL and theming

Breadcrumb spacing and the default divider direction are logical, so wrap the app (or the subtree) in `<FluentProvider dir="rtl">` and the trail mirrors correctly without component-level changes.

## Accessibility checklist

- `aria-label` on the `Breadcrumb` (and unique labels when a page has multiple `nav` landmarks).
- `aria-current="page"` on the last, non-interactive crumb.
- Decorative dividers only — no meaningful text inside them.
- Overflow control with an explicit accessible name and a matching `Tooltip` (`relationship="label"`).
- Interactive items are full buttons/anchors inside `BreadcrumbItem`, so Enter/Space and Tab/Arrow behave as users expect.

## Examples

### Basic breadcrumb with icon and current page

A semantic 4-level trail rendered from data: a home icon on the first crumb, interactive BreadcrumbButtons for ancestors, decorative dividers, and a non-interactive current page marked with aria-current.

```tsx
import * as React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbButton, BreadcrumbDivider } from '@fluentui/react-components';

type Crumb = {
  /** Route path; also used as a stable React key. */
  path: string;
  label: string;
};

const CRUMBS: Crumb[] = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'Products' },
  { path: '/products/widgets', label: 'Widgets' },
  { path: '/products/widgets/widget-42', label: 'Widget 42' },
];

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M10 2.5 3 8.6V17h4.5v-4.5h5V17H17V8.6L10 2.5Z" />
  </svg>
);

export const BasicBreadcrumb = ({
  onNavigate,
}: {
  onNavigate?: (path: string) => void;
}) => {
  const currentIndex = CRUMBS.length - 1;

  return (
    // focusMode="tab" makes every crumb a tab stop; use "arrow" for a single
    // tab stop with Left/Right arrow traversal in dense page chrome.
    <Breadcrumb aria-label="Breadcrumb" size="medium" focusMode="tab">
      {CRUMBS.map((crumb, index) => {
        const isCurrent = index === currentIndex;

        return (
          <React.Fragment key={crumb.path}>
            <BreadcrumbItem>
              {isCurrent ? (
                // The current page is plain text: it is not a link and must not be focusable.
                <span aria-current="page" style={{ paddingInline: 8 }}>
                  {crumb.label}
                </span>
              ) : (
                <BreadcrumbButton
                  icon={index === 0 ? <HomeIcon /> : undefined}
                  onClick={() => onNavigate?.(crumb.path)}
                >
                  {crumb.label}
                </BreadcrumbButton>
              )}
            </BreadcrumbItem>
            {!isCurrent && <BreadcrumbDivider />}
          </React.Fragment>
        );
      })}
    </Breadcrumb>
  );
};
```

### Collapsible breadcrumb for long trails

A route-driven trail that collapses its middle crumbs into an accessible ellipsis button when the path exceeds a threshold, reveals them on activation, and resets when the route changes.

```tsx
import * as React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbButton, BreadcrumbDivider, Button, Tooltip } from '@fluentui/react-components';

export type Crumb = { path: string; label: string };

type Entry =
  | { kind: 'crumb'; crumb: Crumb; isCurrent: boolean }
  | { kind: 'overflow'; hiddenCount: number };

/** Collapse the middle only when the trail is long enough to wrap. */
const COLLAPSE_THRESHOLD = 5;
/** How many trailing crumbs always stay visible. */
const TAIL_COUNT = 2;

export const CollapsibleBreadcrumb = ({
  crumbs,
  onNavigate,
}: {
  crumbs: Crumb[];
  onNavigate?: (path: string) => void;
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const isCollapsed = !expanded && crumbs.length > COLLAPSE_THRESHOLD;

  // Reset the overflow state whenever the route changes.
  const routeKey = crumbs.map((crumb) => crumb.path).join(' > ');
  React.useEffect(() => setExpanded(false), [routeKey]);

  const entries = React.useMemo<Entry[]>(() => {
    if (!isCollapsed) {
      return crumbs.map((crumb, index) => ({
        kind: 'crumb' as const,
        crumb,
        isCurrent: index === crumbs.length - 1,
      }));
    }

    const tail = crumbs.slice(crumbs.length - TAIL_COUNT);

    return [
      { kind: 'crumb' as const, crumb: crumbs[0], isCurrent: false },
      { kind: 'overflow' as const, hiddenCount: crumbs.length - 1 - TAIL_COUNT },
      ...tail.map((crumb, index) => ({
        kind: 'crumb' as const,
        crumb,
        isCurrent: index === tail.length - 1,
      })),
    ];
  }, [crumbs, isCollapsed]);

  return (
    <Breadcrumb aria-label="Breadcrumb" size="medium" focusMode="tab">
      {entries.map((entry, index) => (
        <React.Fragment key={entry.kind === 'crumb' ? entry.crumb.path : 'overflow'}>
          <BreadcrumbItem>
            {entry.kind === 'overflow' ? (
              <Tooltip
                content={`Show ${entry.hiddenCount} hidden item${
                  entry.hiddenCount === 1 ? '' : 's'
                }`}
                relationship="label"
              >
                <Button
                  appearance="subtle"
                  size="small"
                  shape="circular"
                  aria-label={`Show ${entry.hiddenCount} hidden breadcrumb items`}
                  onClick={() => setExpanded(true)}
                >
                  …
                </Button>
              </Tooltip>
            ) : entry.isCurrent ? (
              <span aria-current="page" style={{ paddingInline: 8 }}>
                {entry.crumb.label}
              </span>
            ) : (
              <BreadcrumbButton onClick={() => onNavigate?.(entry.crumb.path)}>
                {entry.crumb.label}
              </BreadcrumbButton>
            )}
          </BreadcrumbItem>
          {index < entries.length - 1 && <BreadcrumbDivider />}
        </React.Fragment>
      ))}
    </Breadcrumb>
  );
};
```

### Size and focus mode playground

An interactive demo wiring Field + Select to the breadcrumb's size and focusMode props so you can compare small/medium/large density and tab vs. arrow keyboard traversal on the same trail.

```tsx
import * as React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbButton, BreadcrumbDivider, Field, Select } from '@fluentui/react-components';

type BreadcrumbSize = 'small' | 'medium' | 'large';
type BreadcrumbFocusMode = 'tab' | 'arrow';

const CRUMBS = ['Home', 'Products', 'Widgets', 'Widget 42'];

export const BreadcrumbPlayground = () => {
  const [size, setSize] = React.useState<BreadcrumbSize>('medium');
  const [focusMode, setFocusMode] = React.useState<BreadcrumbFocusMode>('tab');

  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 720 }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end' }}>
        <Field label="Size" orientation="horizontal">
          <Select
            value={size}
            onChange={(_ev, data) => setSize(data.value as BreadcrumbSize)}
          >
            <option value="small">small</option>
            <option value="medium">medium</option>
            <option value="large">large</option>
          </Select>
        </Field>

        <Field label="Focus mode" orientation="horizontal">
          <Select
            value={focusMode}
            onChange={(_ev, data) => setFocusMode(data.value as BreadcrumbFocusMode)}
          >
            <option value="tab">tab - every crumb is tabbable</option>
            <option value="arrow">arrow - one tab stop, arrow keys move</option>
          </Select>
        </Field>
      </div>

      <Breadcrumb aria-label="Breadcrumb" size={size} focusMode={focusMode}>
        {CRUMBS.map((label, index) => {
          const isCurrent = index === CRUMBS.length - 1;

          return (
            <React.Fragment key={label}>
              <BreadcrumbItem>
                {isCurrent ? (
                  <span aria-current="page" style={{ paddingInline: 8 }}>
                    {label}
                  </span>
                ) : (
                  <BreadcrumbButton onClick={() => console.log('navigate to', label)}>
                    {label}
                  </BreadcrumbButton>
                )}
              </BreadcrumbItem>
              {!isCurrent && <BreadcrumbDivider />}
            </React.Fragment>
          );
        })}
      </Breadcrumb>
    </div>
  );
};
```

### Breadcrumb in a page header with real anchors

A compact, small-sized trail used above a page title: ancestor crumbs are real Link anchors (shareable URLs, middle-click friendly) and the truncated current-page label exposes its full text via Tooltip.

```tsx
import * as React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbDivider, Link, Text, Tooltip } from '@fluentui/react-components';

export const PageTitleBreadcrumb = ({ reportName }: { reportName: string }) => (
  // "arrow" mode keeps the header to a single tab stop for keyboard users.
  <Breadcrumb aria-label="Breadcrumb" size="small" focusMode="arrow">
    <BreadcrumbItem>
      <Link href="/" appearance="subtle">
        Home
      </Link>
    </BreadcrumbItem>
    <BreadcrumbDivider />
    <BreadcrumbItem>
      <Link href="/reports" appearance="subtle">
        Reports
      </Link>
    </BreadcrumbItem>
    <BreadcrumbDivider />
    <BreadcrumbItem>
      {/* The current page is text, not a link; Tooltip surfaces the untruncated label. */}
      <Tooltip content={reportName} relationship="description">
        <Text
          aria-current="page"
          truncate
          style={{ maxWidth: 220, display: 'inline-block' }}
        >
          {reportName}
        </Text>
      </Tooltip>
    </BreadcrumbItem>
  </Breadcrumb>
);
```

## Pitfalls

- Wrapping the current page in a BreadcrumbButton or Link. It duplicates a navigation target and makes keyboard users tab onto the page they are already on - render plain text with aria-current="page" instead.
- Forgetting aria-label on Breadcrumb. The component is a <nav> landmark; without a label, screen reader users hear an anonymous navigation region, and multiple unnamed navs are indistinguishable.
- Putting the divider inside BreadcrumbItem, or wrapping crumbs in a <div>. BreadcrumbDivider is its own list item and must be a sibling between items; extra wrappers break the nav > ol > li structure. Remember N crumbs produce 2N-1 children.
- Using focusMode="arrow" while some crumbs are non-focusable text. Arrow navigation then appears broken; make every interactive ancestor a BreadcrumbButton/Link or keep the whole trail in default "tab" mode.
- Rendering an unbounded trail. Breadcrumb does not collapse automatically, so deep paths wrap or overflow the header - implement the ellipsis collapse pattern (or cap the visible depth) before shipping deep hierarchies.
- Making the ellipsis a hover-only or decorative element. It needs to be a focusable Button with an accessible name and it must reveal the hidden crumbs when activated.
- Not resetting the collapse/expand state on navigation, so the trail stays expanded forever after one click - key the reset effect off the current route so a new path starts collapsed.
- Mismatched custom control sizes. If you add a custom ellipsis Button, match its size to the breadcrumb's size prop, otherwise the small button and large crumbs produce a visibly uneven row.
- Hardcoding crumbs in the page component instead of deriving them from the route, which drifts out of sync with the URL and makes long trails and overflow logic impossible to test.

## Accessibility

Landmark: Breadcrumb renders a <nav> landmark, so always pass aria-label (e.g. "Breadcrumb") and make the label unique when the page contains more than one nav landmark (for example a sidebar nav plus the breadcrumb). Current page: the last crumb must carry aria-current="page" and must not be a link or button; a clickable current page creates a redundant navigation target, adds an unnecessary tab stop, and is announced like any other destination. Dividers: BreadcrumbDivider is decorative (role="separator", aria-hidden="true"), so never put meaningful text inside it - meaning belongs in the crumb labels. Structure: keep BreadcrumbItem as a direct child of Breadcrumb; wrapping items in extra <div> wrappers destroys the nav > ol > li list semantics that screen readers rely on to announce "list, 4 items". Overflow: the ellipsis control must be a real button with an accessible name (aria-label describing how many items are hidden) and a Tooltip with relationship="label"; it must actually reveal the hidden crumbs on activation rather than relying on hover, and the revealed state should be conveyed (for example by replacing the ellipsis with the crumbs). Keyboard: focusMode="arrow" gives a roving tabindex so the whole trail is one tab stop with Left/Right arrow traversal - verify that every crumb in that mode is focusable, and prefer focusMode="tab" when the crumb count is small or when discoverability matters more than tab economy. Truncation: visually truncated labels remain fully available to assistive technology, but sighted users need a Tooltip (or title) to read the full name; never truncate the current page down to an unrecognizable fragment on narrow viewports - collapse ancestors instead. Interaction: crumb targets should be standard buttons or anchors so Enter, Space, middle-click, and 'open in new tab' behave as users expect; the trail must remain usable at 200% zoom and on narrow screens by collapsing rather than overflowing.

## Components used

- [Breadcrumb](../../components/breadcrumb.md)
- [Button](../../components/button.md)
- [Field](../../components/field.md)
- [Link](../../components/link.md)
- [Select](../../components/select.md)
- [Text](../../components/text.md)
- [Tooltip](../../components/tooltip.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
