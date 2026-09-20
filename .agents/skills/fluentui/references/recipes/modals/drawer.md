# Drawer

> **Group**: modals

## Goal

Build an accessible edge-anchored Drawer panel in Fluent UI v9 — either a modal overlay drawer or a non-modal inline drawer — with a titled header (and optional header navigation), a scrollable body, and a pinned footer of actions, including a navigation drawer built from NavDrawer.

## When to Use

Use this recipe when you need a panel that slides in from the edge of the screen: a modal overlay drawer for focused, interruptive tasks (compose a message, edit a record, review order details, filter a list), or a non-modal inline drawer for persistent side content such as filters or app navigation. Also use it when you want the Drawer/NavDrawer compound anatomy (header + title + header navigation + body + footer) instead of a centered dialog.

## When Not to Use

Don't use a Drawer for a short blocking confirmation or a form that should be centered and small — use Dialog with DialogSurface/DialogTitle/DialogBody/DialogActions instead. Don't use it for a transient list of commands anchored to a trigger (use Menu/MenuPopover), a lightweight callout anchored to an element (use Popover/TeachingPopover), an inline expand/collapse disclosure (use Accordion), or full-screen task completion flows where a dedicated page is better. Prefer an inline drawer over an overlay drawer whenever the content should stay usable while the panel is open.

A **Drawer** is an edge-anchored panel that slides in over or beside your page content. In Fluent UI v9, the same header/body/footer anatomy is shared by three components:

- **`Drawer`** — a thin wrapper that renders `InlineDrawer` when `type="inline"` and `OverlayDrawer` when `type="overlay"`.
- **`InlineDrawer`** — the panel participates in the page layout (it sits *next to* your content), does not trap focus, and can be dismissed with Escape when you control `open`. Use it for persistent filters or navigation.
- **`OverlayDrawer`** — the panel is rendered above the page with a backdrop, traps focus, closes on Escape and on light dismiss, and is announced as a modal dialog. Use it for focused, interruptive tasks.

All three accept the same compound children: `DrawerHeader` (containing `DrawerHeaderTitle` and optionally `DrawerHeaderNavigation`), `DrawerBody`, and `DrawerFooter`.

## Anatomy

```tsx
<Drawer type="overlay" open={open} onOpenChange={handleOpenChange}>
  <DrawerHeader>
    { /* exactly one title; `action` holds the close button */ }
    <DrawerHeaderTitle action={<Button appearance="subtle" onClick={close}>Close</Button>}>
      New message
    </DrawerHeaderTitle>
    { /* optional secondary navigation: TabList, Breadcrumb, ... */ }
    <DrawerHeaderNavigation>{/* ... */}</DrawerHeaderNavigation>
  </DrawerHeader>

  { /* the scrollable region */ }
  <DrawerBody>{/* content */}</DrawerBody>

  { /* pinned to the bottom of the panel */ }
  <DrawerFooter>{/* Buttons */}</DrawerFooter>
</Drawer>
```

- `DrawerHeaderTitle` renders the `heading` slot and an optional `action` slot. Render **exactly one per header**. The heading is what gives the drawer its accessible name.
- `DrawerHeaderNavigation` is the strip under the title for tab-style or breadcrumb navigation.
- `DrawerBody` is the padding + scrolling region — put all long content here.
- `DrawerFooter` stays visible at the bottom of the panel — put your primary and secondary actions here.

## Step 1 — Own the open state

```tsx
const [open, setOpen] = React.useState(false);

<Drawer type="overlay" open={open} onOpenChange={(_event, data) => setOpen(data.open)}>
```

`onOpenChange` fires for every dismissal the component handles for you: Escape, light dismiss (clicking the backdrop of an overlay drawer) and your own close button when it is wired to the same state. Always write back `data.open` rather than flipping your own boolean, otherwise your state and the drawer's internal state drift apart after a light dismiss. If the drawer should simply start open and be dismissed only by the user, use `defaultOpen` on `OverlayDrawer` and skip the state entirely.

## Step 2 — Header: title plus actions

`DrawerHeaderTitle` is the anchor of the whole composition: it provides the heading that names the drawer. Put a single close affordance in its `action` slot — a `Button appearance="subtle"` is the conventional choice. If you only need a close affordance and no extra chrome, the built-in Escape key and backdrop click of an overlay drawer already close it; the button is for discoverability and touch users.

## Step 3 — Body and footer

Everything that can grow goes into `DrawerBody`; only the concluding actions go into `DrawerFooter` (usually one `Button appearance="primary"` plus a secondary or subtle `Button`). Because `DrawerBody` is the scroll container, keep the number of direct children small — group related fields in a `<div>` when you need a consistent gap.

## Step 4 — Inline drawers need a layout parent

An inline drawer is a sibling of your content, so the parent has to be a flex row:

```tsx
<div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
  <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>{/* page content */}</div>
  <Drawer type="inline" separator open={open} onOpenChange={handleOpenChange} style={{ width: 320 }}>
    ...
  </Drawer>
</div>
```

Give the drawer an explicit width (`style={{ width: 320 }}`) and add the `separator` prop so the panel gets an edge line against the page. Put `minHeight: 0` on flex ancestors that must scroll, and make sure no ancestor uses `overflow: hidden` in a way that clips the panel.

## Step 5 — Navigation drawers

`NavDrawer` combines `Nav` and a drawer: it provides the nav context, exposes the drawer's `open`/`onOpenChange`, and accepts nav props such as `selectedValue`, `onNavItemSelect` and `defaultOpenCategories`. Its compound children are `NavDrawerHeader` (usually holding a `Hamburger` toggle), `NavDrawerBody`, and `NavDrawerFooter`.

Inside `NavDrawerBody` use `NavSectionHeader` for group labels, `NavItem` for flat destinations, `NavDivider` for separation, and `NavCategory` + `NavCategoryItem` + `NavSubItemGroup` + `NavSubItem` for expandable groups. Every item takes a `value`; `onNavItemSelect` reports `data.value` so you can drive your route or content state from one string.

## Step 6 — Header navigation with tabs

When one drawer holds several related views, put a `TabList` inside `DrawerHeaderNavigation` and swap the `DrawerBody` content from the selected tab value (`data.value` from `onTabSelect`). Keep the drawer's own heading in `DrawerHeaderTitle` so the drawer still has a single accessible name; the tabs name the sections inside it.

## Sizing and scrolling

- Inline drawer: explicit width, flex parent, `separator`.
- Overlay drawer: width is set the same way (`style={{ width: 360 }}`); the surface is height-constrained to the viewport, and `DrawerBody` scrolls.
- Long labels: `Text truncate` inside the body/header keeps rows tidy.
- Keep the drawer mounted: toggling `open` preserves scroll position and form state, whereas re-mounting the tree resets both.

## Examples

### Overlay drawer: compose a message

A controlled `<Drawer type="overlay">` used as a modal side panel for a focused task. The header has a title plus a close button in the `action` slot, the body holds Field-wrapped form controls that keep their state while the drawer is open, and the footer holds the primary and secondary actions. Open and close state is driven entirely by `open`/`onOpenChange`.

```tsx
import * as React from 'react';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Field,
  Input,
  Textarea,
} from '@fluentui/react-components';

export const ComposeMessageDrawer: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');

  const close = () => setOpen(false);
  const send = () => {
    // ...send `subject` and `message`
    close();
  };

  return (
    <>
      <Button appearance="primary" onClick={() => setOpen(true)}>
        Compose message
      </Button>

      {/* The drawer stays mounted; `open` controls visibility. */}
      <Drawer
        type="overlay"
        open={open}
        onOpenChange={(_event, data) => setOpen(data.open)}
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button appearance="subtle" onClick={close}>
                Close
              </Button>
            }
          >
            New message
          </DrawerHeaderTitle>
        </DrawerHeader>

        <DrawerBody>
          <Field label="Subject" required>
            <Input
              placeholder="Weekly status"
              value={subject}
              onChange={(_event, data) => setSubject(data.value)}
            />
          </Field>

          <Field label="Message">
            <Textarea
              resize="vertical"
              value={message}
              onChange={(_event, data) => setMessage(data.value)}
            />
          </Field>
        </DrawerBody>

        <DrawerFooter>
          <Button appearance="primary" onClick={send}>
            Send
          </Button>
          <Button onClick={close}>Discard</Button>
        </DrawerFooter>
      </Drawer>
    </>
  );
};
```

### Inline drawer: persistent filter panel

A non-modal `<Drawer type="inline" separator>` living inside a flex row next to the results list. The page stays interactive, filters update it live, and the panel uses an explicit width plus `separator` for the edge line. Escape also closes it because `open`/`onOpenChange` are controlled.

```tsx
import * as React from 'react';
import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Slider,
  Switch,
  Text,
} from '@fluentui/react-components';

type Result = { id: string; title: string; price: number; inStock: boolean };

const results: Result[] = [
  { id: '1', title: 'Contoso widget', price: 120, inStock: true },
  { id: '2', title: 'Fabrikam gadget', price: 260, inStock: false },
  { id: '3', title: 'Northwind gizmo', price: 90, inStock: true },
];

export const FilterPanelDrawer: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const [inStockOnly, setInStockOnly] = React.useState(false);
  const [maxPrice, setMaxPrice] = React.useState(300);

  const visibleResults = results.filter(
    result => (!inStockOnly || result.inStock) && result.price <= maxPrice,
  );

  return (
    <div style={{ display: 'flex', height: '420px', minHeight: 0 }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        <Button onClick={() => setOpen(!open)}>
          {open ? 'Hide filters' : 'Show filters'}
        </Button>

        <ul>
          {visibleResults.map(result => (
            <li key={result.id}>
              {result.title} — {result.price} USD
            </li>
          ))}
        </ul>
      </div>

      <Drawer
        type="inline"
        separator
        open={open}
        onOpenChange={(_event, data) => setOpen(data.open)}
        style={{ width: '320px' }}
      >
        <DrawerHeader>
          <DrawerHeaderTitle>Filters</DrawerHeaderTitle>
        </DrawerHeader>

        <DrawerBody>
          <Switch
            label="In stock only"
            checked={inStockOnly}
            onChange={(_event, data) => setInStockOnly(data.checked)}
          />

          <Divider />

          <Text weight="semibold">Maximum price ({maxPrice} USD)</Text>
          <Slider
            min={0}
            max={500}
            step={10}
            value={maxPrice}
            onChange={(_event, data) => setMaxPrice(data.value)}
          />
        </DrawerBody>

        <DrawerFooter>
          <Button appearance="primary" onClick={() => setOpen(false)}>
            Apply
          </Button>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DrawerFooter>
      </Drawer>
    </div>
  );
};
```

### Navigation drawer with a Hamburger toggle

An inline `NavDrawer` used as app navigation. A `Hamburger` in `NavDrawerHeader` toggles the panel, `NavDrawerBody` mixes section headers, flat `NavItem`s, a `NavDivider`, and an expandable `NavCategory` with a `NavSubItemGroup`. Selection is lifted into `selectedValue`/`onNavItemSelect` and rendered in the page body.

```tsx
import * as React from 'react';
import {
  Button,
  Hamburger,
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
} from '@fluentui/react-components';

export const MailNavDrawer: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const [selectedValue, setSelectedValue] = React.useState('inbox');

  return (
    <div style={{ display: 'flex', height: '480px', minHeight: 0 }}>
      <NavDrawer
        open={open}
        onOpenChange={(_event, data) => setOpen(data.open)}
        selectedValue={selectedValue}
        onNavItemSelect={(_event, data) => setSelectedValue(data.value)}
        defaultOpenCategories={['workspaces']}
        style={{ width: '260px' }}
      >
        <NavDrawerHeader>
          <Hamburger aria-label="Toggle navigation" onClick={() => setOpen(!open)} />
        </NavDrawerHeader>

        <NavDrawerBody>
          <NavSectionHeader>Mailbox</NavSectionHeader>
          <NavItem value="inbox">Inbox</NavItem>
          <NavItem value="drafts">Drafts</NavItem>
          <NavItem value="sent">Sent</NavItem>

          <NavDivider />

          <NavCategory value="workspaces">
            <NavCategoryItem value="workspaces">Workspaces</NavCategoryItem>
            <NavSubItemGroup>
              <NavSubItem value="engineering">Engineering</NavSubItem>
              <NavSubItem value="design">Design</NavSubItem>
            </NavSubItemGroup>
          </NavCategory>
        </NavDrawerBody>

        <NavDrawerFooter>
          <Button appearance="subtle">Sign out</Button>
        </NavDrawerFooter>
      </NavDrawer>

      <main style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        <Text size={500} weight="semibold">
          {selectedValue}
        </Text>
      </main>
    </div>
  );
};
```

### OverlayDrawer with header navigation tabs

Uses `OverlayDrawer` directly (equivalent to `<Drawer type="overlay">`) to build a record-details panel. `DrawerHeaderNavigation` hosts a `TabList`; the selected tab value swaps the `DrawerBody` content, and each panel is wired with `role="tabpanel"` plus `aria-labelledby` pointing at the tab's `id`.

```tsx
import * as React from 'react';
import {
  Badge,
  Button,
  Divider,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderNavigation,
  DrawerHeaderTitle,
  OverlayDrawer,
  Tab,
  TabList,
  Text,
} from '@fluentui/react-components';

export const OrderDetailsDrawer: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const [tab, setTab] = React.useState<string>('details');

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open order details</Button>

      <OverlayDrawer open={open} onOpenChange={(_event, data) => setOpen(data.open)}>
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button appearance="subtle" onClick={() => setOpen(false)}>
                Close
              </Button>
            }
          >
            Order #10432
          </DrawerHeaderTitle>

          <DrawerHeaderNavigation>
            <TabList
              selectedValue={tab}
              onTabSelect={(_event, data) => setTab(String(data.value))}
            >
              <Tab id="tab-details" value="details">
                Details
              </Tab>
              <Tab id="tab-activity" value="activity">
                Activity
              </Tab>
            </TabList>
          </DrawerHeaderNavigation>
        </DrawerHeader>

        <DrawerBody>
          {tab === 'details' ? (
            <div role="tabpanel" aria-labelledby="tab-details">
              <Text weight="semibold">Status</Text>
              <div>
                <Badge appearance="tint" color="success">
                  Fulfilled
                </Badge>
              </div>
              <Divider />
              <Text>
                Two items shipped from the Rotterdam warehouse on March 4 and were delivered on
                March 6.
              </Text>
            </div>
          ) : (
            <div role="tabpanel" aria-labelledby="tab-activity">
              <Text>Order created — March 2</Text>
              <Divider />
              <Text>Payment captured — March 2</Text>
              <Divider />
              <Text>Shipped — March 4</Text>
            </div>
          )}
        </DrawerBody>

        <DrawerFooter>
          <Button appearance="primary" onClick={() => setOpen(false)}>
            Done
          </Button>
        </DrawerFooter>
      </OverlayDrawer>
    </>
  );
};
```

## Pitfalls

- Conditionally mounting the drawer (`{open && <Drawer … />}`) instead of using the `open` prop. This unmounts the surface, removes the enter/exit motion, discards form and scroll state, and breaks focus restoration. Keep the drawer mounted and let `open` drive visibility.
- Toggling your own boolean in the trigger instead of writing back `data.open` from `onOpenChange`. After a light dismiss or Escape, your state and the drawer's internal state disagree and the next toggle appears to do nothing. Always `setOpen(data.open)`.
- Rendering an inline drawer outside a flex (or relative) layout parent. It will stack above or below the page content, or be clipped by an ancestor with `overflow: hidden`, instead of sliding in beside it. Wrap content and drawer in `display: flex` and give the drawer an explicit width.
- Expecting `separator` to have an effect on an overlay drawer — it is an inline-drawer prop that draws the edge line between the panel and the page. Use it with `type="inline"` (or `InlineDrawer`); overlay drawers get their separation from the backdrop and surface elevation.
- Omitting `DrawerHeaderTitle` (or rendering more than one per header). The heading is the drawer's accessible name; without it an overlay drawer is announced namelessly, and multiple titles produce a confusing heading structure.
- Putting content directly inside `Drawer` and skipping `DrawerBody`/`DrawerFooter`. You lose padding, the scroll container, and the pinned footer, so long content pushes the primary action off screen.
- Using an overlay drawer for permanent navigation. Modal drawers interrupt the flow, dim the page and trap focus; use an inline `NavDrawer` (with `NavItem`/`NavCategory`/`NavSubItemGroup`) for persistent navigation and reserve overlay drawers for focused, interruptive tasks.

## Accessibility

Overlay drawers (`type="overlay"` or `OverlayDrawer`) render a modal surface: they take focus when they open, trap it while open, close on Escape and light dismiss, and return focus to the element that was focused before opening. That is exactly why you control them with `open`/`onOpenChange` instead of mounting them conditionally — focus restoration needs the surface to exist. Always render a `DrawerHeaderTitle`: its `heading` slot (an `h2` by default) is what names the drawer for assistive technology, so a drawer whose body is the only content is announced without a name. Give the button in the `action` slot a text label, or an `aria-label` if you render an icon-only button. Inline drawers are non-modal and do not trap focus, so keyboard users can tab between the panel and the page — keep a visible, keyboard-reachable toggle (a `Button` or `Hamburger`) rather than hiding the panel behind hover or drag. Inside the drawer keep a logical DOM order (header → body → footer) because that is the tab order, start body headings below the title's level (the title is an `h2`), and when you build tabbed sections with `TabList`, wire each panel with `role="tabpanel"` and `aria-labelledby` pointing at the corresponding `Tab` `id`, as shown in the example. Drawer open/close motion comes from the built-in surface motion and respects reduced-motion preferences; don't add your own transitions. Finally, make long content scroll inside `DrawerBody` so the footer actions remain reachable without scrolling the whole page.

## Components used

- [Badge](../../components/badge.md)
- [Button](../../components/button.md)
- [Divider](../../components/divider.md)
- [Drawer](../../components/drawer.md)
- [DrawerBody](../../components/drawer-body.md)
- [DrawerFooter](../../components/drawer-footer.md)
- [DrawerHeader](../../components/drawer-header.md)
- [DrawerHeaderNavigation](../../components/drawer-header-navigation.md)
- [DrawerHeaderTitle](../../components/drawer-header-title.md)
- [Field](../../components/field.md)
- [Hamburger](../../components/hamburger.md)
- [Input](../../components/input.md)
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
- [OverlayDrawer](../../components/overlay-drawer.md)
- [Slider](../../components/slider.md)
- [Switch](../../components/switch.md)
- [Tab](../../components/tab.md)
- [TabList](../../components/tab-list.md)
- [Text](../../components/text.md)
- [Textarea](../../components/textarea.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
