# Breadcrumb

> **Group**: navigation

## Goal

Build an accessible, keyboard-navigable breadcrumb trail with Fluent UI React v9: a data-driven crumb list that marks the current page, respects Breadcrumb size and focusMode, supports custom dividers, and collapses long paths into an overflow Menu.

## When to Use

Use this recipe when the user needs to see where they are inside a hierarchy (site section, folder/file path, nested resource, drill-down detail page) and jump back to any ancestor level. It is the right choice when you want the built-in Fluent breadcrumb semantics: a `nav` landmark containing an ordered list, roving-focus keyboard behavior, a `current` crumb that is not actionable, and token-based styling.

## When Not to Use

Do not use a breadcrumb for primary application navigation (use Nav/NavDrawer, TabList, or a Menu-based nav), for ordered multi-step flows where users must complete steps in sequence (use a stepper/wizard pattern), or as a 'back to previous page' history affordance (use a back Button). Avoid it when the hierarchy is only one level deep or when a page title plus back button communicates location more clearly. If you only need a single inline navigation link, use Link instead.

A breadcrumb answers two questions: *where am I?* and *how do I get back up?* In v9 a breadcrumb is composed from four components - never from hand-written `<nav>`/`<ol>` markup, which would lose the roving focus and list semantics.

| Part | Component | Renders |
| --- | --- | --- |
| Landmark + list | `Breadcrumb` | `root` slot (`nav`) + `list` slot (`ol`) |
| Segment | `BreadcrumbItem` | `root` slot (`li`) |
| Crumb | `BreadcrumbButton` | the interactive crumb |
| Separator | `BreadcrumbDivider` | `root` slot (`li`), a chevron by default |

## 1. Structure: dividers are siblings, not children

```tsx
<Breadcrumb aria-label='Breadcrumb'>
  <BreadcrumbItem>
    <BreadcrumbButton>Home</BreadcrumbButton>
  </BreadcrumbItem>
  <BreadcrumbDivider />
  <BreadcrumbItem>
    <BreadcrumbButton>Projects</BreadcrumbButton>
  </BreadcrumbItem>
  <BreadcrumbDivider />
  <BreadcrumbItem>
    <BreadcrumbButton current>Contoso</BreadcrumbButton>
  </BreadcrumbItem>
</Breadcrumb>
```

* `BreadcrumbItem` and `BreadcrumbDivider` are the only valid children of `Breadcrumb`.
* There is no divider before the first crumb or after the last crumb.
* The last crumb is rendered with `current` and is not a navigation target.

## 2. Set size and focus behavior once, on the root

* `size` - `'small' | 'medium' | 'large'`. Set it on `Breadcrumb` so items and dividers stay consistent; do not set it per crumb.
* `focusMode` - `'arrow'` (roving tabindex: the whole trail is one tab stop and the arrow keys move between crumbs) or `'tab'` (every crumb is its own tab stop). Keep `'arrow'` unless you have a specific reason; `'tab'` gets noisy on long paths.

```tsx
<Breadcrumb aria-label='File path' size='small' focusMode='arrow'>
  {/* BreadcrumbItem / BreadcrumbDivider children */}
</Breadcrumb>
```

## 3. Render the trail from data

Model a crumb once (`{ id, label, href }`) and map it. Three rules keep data-driven breadcrumbs correct:

1. Key each `React.Fragment` with a stable crumb id - never the array index, because the path changes on every navigation.
2. Compute the current crumb from its position: `index === crumbs.length - 1`.
3. Do the routing inside the crumb's `onClick` (`onClick={() => router.push(crumb.href)}`) so the same component works with React Router, Next, or a simple state machine. See `BreadcrumbFromData`.

## 4. Collapse long paths into a Menu

When the path has more segments than fit, keep the first crumb, hide the middle segments behind an overflow `Menu`, and keep the last two crumbs visible. Wrap a `BreadcrumbButton` in `MenuTrigger` so the trigger keeps breadcrumb styling. Give the overflow crumb an `aria-label`, because a lone `'…'` is not a useful accessible name. See `BreadcrumbWithOverflowMenu`.

## 5. Custom dividers

`BreadcrumbDivider` renders a chevron by default; pass children to use your own separator (a slash, an arrow, an icon). Keep the replacement non-interactive and non-focusable.

```tsx
<BreadcrumbDivider>
  <Text aria-hidden size={200}>/</Text>
</BreadcrumbDivider>
```

## 6. Tooltips for long labels

Long segment names should be truncated visually, not cut in the string. Wrap the crumb in a `Tooltip` with `relationship='description'` and repeat the full label in `content` - the crumb keeps its full accessible name while the bar stays compact. See `BreadcrumbSizesAndDividers`.

## 7. Styling hooks

`Breadcrumb` exposes a `root` slot (the `nav`) and a `list` slot (the `ol`), and every part accepts the standard `className`/`style` props, so you can restyle with your preferred approach (for example `makeStyles` and `tokens` from `@fluentui/react-components`). Prefer styling the root/list once over styling each crumb, so gaps and truncation stay consistent.

## 8. Verify before shipping

1. Tab into the trail: exactly one tab stop with `focusMode='arrow'`, then arrow keys move between crumbs; Enter/Space activates a crumb.
2. The current crumb is announced as the current page and does nothing when activated.
3. `Breadcrumb` has an `aria-label` describing the trail ('Breadcrumb', 'File path', ...).
4. The trail is an ordered list and every crumb sits inside a list item.
5. If a Menu lives inside the trail, keyboard users can open it and arrow through its items.

## Examples

### BreadcrumbFromData

A typed, data-driven breadcrumb trail that renders crumbs from an array, marks the last crumb with `current`, truncates the path when the user navigates, and shows where a router call goes.

```tsx
import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
} from '@fluentui/react-components';

/** One segment of the path shown in the breadcrumb. */
export interface Crumb {
  /** Stable id - used as the React key. */
  id: string;
  /** Text shown to the user. */
  label: string;
  /** Route the crumb points at. */
  href: string;
}

export const workspaceCrumbs: Crumb[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'projects', label: 'Projects', href: '/projects' },
  { id: 'contoso', label: 'Contoso', href: '/projects/contoso' },
  { id: 'files', label: 'Files', href: '/projects/contoso/files' },
  { id: 'report', label: 'Q3-report.docx', href: '/projects/contoso/files/q3-report' },
];

export const BreadcrumbFromData: React.FC = () => {
  const [crumbs, setCrumbs] = React.useState<Crumb[]>(workspaceCrumbs);

  // Swap the body of this function for your router call,
  // e.g. navigate(crumb.href) or router.push(crumb.href).
  const navigate = (crumb: Crumb) => {
    const index = crumbs.findIndex(item => item.id === crumb.id);
    setCrumbs(crumbs.slice(0, index + 1));
  };

  return (
    <Breadcrumb aria-label='Page path' size='medium' focusMode='arrow'>
      {crumbs.map((crumb, index) => {
        const isCurrent = index === crumbs.length - 1;

        return (
          <React.Fragment key={crumb.id}>
            <BreadcrumbItem>
              <BreadcrumbButton
                current={isCurrent}
                onClick={isCurrent ? undefined : () => navigate(crumb)}
              >
                {crumb.label}
              </BreadcrumbButton>
            </BreadcrumbItem>
            {!isCurrent ? <BreadcrumbDivider /> : null}
          </React.Fragment>
        );
      })}
    </Breadcrumb>
  );
};
```

### BreadcrumbWithOverflowMenu

A long file path that keeps the first crumb, puts the middle segments behind an overflow Menu triggered by an ellipsis BreadcrumbButton, and keeps the last two crumbs visible.

```tsx
import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';

interface Crumb {
  id: string;
  label: string;
}

const FILE_PATH: Crumb[] = [
  { id: 'root', label: 'All files' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'design', label: 'Design' },
  { id: 'specs', label: 'Specs' },
  { id: 'fluent', label: 'Fluent' },
  { id: 'v9', label: 'v9' },
  { id: 'breadcrumb', label: 'Breadcrumb spec.pdf' },
];

export const BreadcrumbWithOverflowMenu: React.FC = () => {
  const [currentId, setCurrentId] = React.useState(FILE_PATH[FILE_PATH.length - 1].id);

  const first = FILE_PATH[0];
  const collapsed = FILE_PATH.slice(1, -2);
  const tail = FILE_PATH.slice(-2);

  return (
    <Breadcrumb aria-label='File path' size='small' focusMode='arrow'>
      <BreadcrumbItem>
        <BreadcrumbButton
          current={first.id === currentId}
          onClick={() => setCurrentId(first.id)}
        >
          {first.label}
        </BreadcrumbButton>
      </BreadcrumbItem>
      <BreadcrumbDivider />

      {collapsed.length > 0 ? (
        <>
          <BreadcrumbItem>
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <BreadcrumbButton aria-label={`Show ${collapsed.length} hidden path segments`}>
                  {'…'}
                </BreadcrumbButton>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  {collapsed.map(crumb => (
                    <MenuItem key={crumb.id} onClick={() => setCurrentId(crumb.id)}>
                      {crumb.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </MenuPopover>
            </Menu>
          </BreadcrumbItem>
          <BreadcrumbDivider />
        </>
      ) : null}

      {tail.map((crumb, index) => {
        const isLast = index === tail.length - 1;

        return (
          <React.Fragment key={crumb.id}>
            <BreadcrumbItem>
              <BreadcrumbButton
                current={crumb.id === currentId}
                onClick={() => setCurrentId(crumb.id)}
              >
                {crumb.label}
              </BreadcrumbButton>
            </BreadcrumbItem>
            {!isLast ? <BreadcrumbDivider /> : null}
          </React.Fragment>
        );
      })}
    </Breadcrumb>
  );
};
```

### BreadcrumbSizesAndDividers

All three breadcrumb sizes rendered side by side, a Tooltip wrapping a long crumb label, and a custom slash divider supplied as BreadcrumbDivider children.

```tsx
import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  Text,
  Tooltip,
} from '@fluentui/react-components';

const SIZES = ['small', 'medium', 'large'] as const;

export const BreadcrumbSizesAndDividers: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    {SIZES.map(size => (
      <Breadcrumb
        key={size}
        aria-label={`Breadcrumb (${size})`}
        size={size}
        focusMode='arrow'
      >
        <BreadcrumbItem>
          <BreadcrumbButton>Home</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />

        <BreadcrumbItem>
          <Tooltip
            relationship='description'
            content='Quarterly financial report for the Contoso business unit'
          >
            <BreadcrumbButton>Quarterly financial report for the Contoso…</BreadcrumbButton>
          </Tooltip>
        </BreadcrumbItem>

        <BreadcrumbDivider>
          <Text aria-hidden size={200}>
            /
          </Text>
        </BreadcrumbDivider>

        <BreadcrumbItem>
          <BreadcrumbButton current>Overview</BreadcrumbButton>
        </BreadcrumbItem>
      </Breadcrumb>
    ))}
  </div>
);
```

## Pitfalls

- Putting `BreadcrumbDivider` inside `BreadcrumbItem`. The divider is a sibling list item that sits between two `BreadcrumbItem`s; nesting it breaks the list structure and the built-in spacing.
- Leaving `current` off the last crumb or making it a link. Assistive technology then announces the current page as just another destination. Always set `current` on the final `BreadcrumbButton` and make it non-interactive.
- Forgetting `aria-label` on `Breadcrumb`. It renders a `nav` landmark; when more than one navigation landmark exists on a page, each needs a unique accessible name.
- Reaching for `focusMode='tab'` on long paths, which turns every crumb into a tab stop. Keep the default `'arrow'` roving focus and collapse the middle segments into a Menu instead.
- Rendering every segment of a deep path regardless of width. Keep the first crumb, hide the middle behind an overflow Menu, keep the last one or two crumbs, and truncate long labels visually (optionally with a Tooltip).
- Keying mapped crumbs with the array index. The path changes on navigation, so React reuses the wrong crumb; key each `React.Fragment` with a stable crumb id.
- Setting `size` (or spacer styling) on individual crumbs instead of the `Breadcrumb` root. Set it once on the root so items and dividers stay consistent.
- Hand-rolling `<nav><ol><li>` markup instead of the Breadcrumb components, which loses roving keyboard focus, correct list semantics, and token-based styling.

## Accessibility

`Breadcrumb` renders a `nav` landmark, so give it an `aria-label` ('Breadcrumb', 'Page path', 'File path'). When the page has more than one navigation landmark, each must have a unique accessible name so users can tell them apart. The crumbs are rendered as an ordered list (`ol`/`li`), which conveys hierarchy and sequence to assistive technology - keep `BreadcrumbItem` and `BreadcrumbDivider` as the only direct children so that list structure stays intact. Mark exactly one crumb with `current` on `BreadcrumbButton`; that crumb represents the current page and should not be a navigation target. The default `focusMode='arrow'` implements the roving-tabindex pattern recommended by the WAI-ARIA Authoring Practices for breadcrumbs: the whole trail is a single tab stop, and the arrow keys move focus between crumbs; use `focusMode='tab'` only when something else in your layout requires every crumb to be individually tabbable. Dividers are decorative: never put interactive or focusable content inside `BreadcrumbDivider` (if you replace the chevron with custom children, keep them non-focusable and hide purely decorative glyphs). A `Menu` trigger inside the trail must stay operable from the keyboard - opening it with Enter/Space and arrowing through `MenuItem`s - and an ellipsis-only trigger needs an `aria-label` that describes what it reveals. Truncate long segment labels visually (or wrap them in a `Tooltip` with `relationship='description'`) instead of cutting the string, so the accessible name stays complete. Finally, do not indicate the current crumb by color alone; the `current` prop also changes the visual weight of the crumb.

## Components used

- [Breadcrumb](../../components/breadcrumb.md)
- [BreadcrumbItem](../../components/breadcrumb-item.md)
- [BreadcrumbButton](../../components/breadcrumb-button.md)
- [BreadcrumbDivider](../../components/breadcrumb-divider.md)
- [Menu](../../components/menu.md)
- [MenuTrigger](../../components/menu-trigger.md)
- [MenuPopover](../../components/menu-popover.md)
- [MenuList](../../components/menu-list.md)
- [MenuItem](../../components/menu-item.md)
- [Text](../../components/text.md)
- [Tooltip](../../components/tooltip.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
