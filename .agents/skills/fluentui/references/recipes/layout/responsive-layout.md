# Responsive Layout

> **Group**: layout

## Goal

Build a Fluent UI React v9 layout that adapts between phone, tablet, and desktop widths: an app shell whose navigation is a persistent InlineDrawer on wide viewports and a modal OverlayDrawer on narrow ones, card grids that change column count, size and orientation, master/detail views whose tab rail flips between vertical and horizontal, and dialogs that become full-screen sheets on small screens.

## When to Use

Use this recipe for app shells, dashboards, list/detail views, and settings surfaces where the *interaction model* — not just spacing — changes between sizes: a sidebar becoming off-canvas, a rail becoming a tab strip, a dialog becoming a full-screen sheet, cards re-orienting from vertical to horizontal. Use it whenever you need a small, shared set of breakpoints, a matchMedia-based hook, and guidance on which Fluent v9 props already do the adapting for you (Card orientation/size, TabList vertical, Divider vertical, Toolbar vertical, DialogActions fluid, Drawer type).

## When Not to Use

Do not reach for JavaScript breakpoints when a pure CSS change (columns, gaps, padding, wrapping) is enough — write a media or container query instead. Do not use it to collapse a long toolbar into an overflow menu; use Menu + MenuTrigger for that affordance. Do not use it to resize or hide data-table columns; use DataGrid with columnSizingOptions and resizableColumnsOptions. And do not use it to delete content on small screens — if the information matters, reflow it rather than hiding it.

## Outcome

A single component tree that reflows from a 320 px phone to a 1920 px desktop:

- Navigation is a persistent `InlineDrawer` on wide viewports and a modal `OverlayDrawer` on narrow ones, toggled from a `Toolbar` button.
- Card collections change column count, `Card size`, and `Card orientation` without any measurement code.
- Master/detail views flip a single `TabList vertical` prop and match the `Divider` axis to the parent direction.
- Dialogs become full-screen sheets with full-width stacked actions on touch-sized viewports.

## Mental model: three layers, cheapest first

1. **Fluid CSS (no JavaScript).** Let the container do the work: `display: grid` with `repeat(auto-fill, minmax(300px, 1fr))`, `flex-wrap: wrap`, `min-width: 0` on flexible children, `clamp()` for type. Most "responsive" behaviour needs no component change at all.
2. **Props that adapt.** Many Fluent v9 components already expose a layout prop — flip it at a breakpoint instead of swapping components:
   - `Card` `orientation` (`horizontal` | `vertical`) and `size` (`small` | `medium` | `large`)
   - `TabList` `vertical` — a side rail on desktop, a horizontal strip on mobile
   - `Divider` `vertical` — matches whichever axis the parent uses
   - `Toolbar` / `ToolbarGroup` `vertical`, `ToolbarButton` `appearance`
   - `DialogActions` `fluid` — full-width stacked buttons on touch-sized viewports
   - `Drawer` `type`, plus `InlineDrawer` / `OverlayDrawer` with `open` + `onOpenChange`
   - `FluentProvider` `dir` — flip layout direction for RTL locales
3. **Component swap.** Only when the *interaction model* changes (a persistent sidebar becomes modal, a detail pane becomes a dialog) do you render a different component. Keep any state that must survive the swap in a parent.

## Breakpoints

Define one scale and use it everywhere so JavaScript and CSS never drift:

| Name | Range | Typical change |
| --- | --- | --- |
| compact | <= 599px | one column, full-screen dialogs, horizontal tabs, small cards |
| medium | 600-1023px | two columns, vertical cards, inline drawer |
| wide | >= 1024px | three or more columns, horizontal cards, vertical rail |

Fluent's design guidance uses 320 / 480 / 640 / 1024 / 1366 / 1920. Two or three breakpoints per feature is plenty; resist adding more. Prefer `em`-based queries (`(max-width: 48em)`) when you want the layout to also respond to user font-size increases.

## The breakpoint hook

`useMediaQuery` subscribes to `matchMedia` once — no resize listeners, no layout thrash, no reading `window.innerWidth` during render. The lazy initializer uses the real browser value on the first client render (avoiding a flash of the wrong layout) and falls back to `false` on the server:

```tsx
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState<boolean>(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}
```

Call it once per breakpoint at the top of the component and derive everything else from those booleans. Hooks must run in a stable order — never branch on a hook:

```tsx
const isNarrow = useMediaQuery('(max-width: 767px)');
const isWide = useMediaQuery('(min-width: 1024px)');
```

## Recipe 1 - Adaptive app shell (inline drawer <-> overlay drawer)

Steps:

1. Subscribe to the navigation breakpoint once (`max-width: 767px`).
2. Build the drawer contents in a single variable so both variants render identical markup — same `DrawerHeader`, `DrawerHeaderTitle`, `DrawerBody` and navigation links.
3. Render `InlineDrawer` (with `separator`) when wide and `OverlayDrawer` when narrow. The overlay variant is controlled with `open` + `onOpenChange` so the toolbar toggle can open it.
4. Put the toggle inside a `Toolbar`/`ToolbarGroup`; give it `aria-label` and `aria-expanded`, and only render it in the narrow branch.
5. Close the overlay whenever the viewport crosses back to wide (an effect keyed on `isNarrow`) and return focus to the toggle when it is dismissed.

Why a swap rather than a style change: the sidebar is *persistent* on desktop and *modal* on mobile. That is an interaction change, and `OverlayDrawer` gives you the backdrop, focus containment and dismiss behaviour for free.

## Recipe 2 - A card grid that re-orients

Steps:

1. Let CSS count the columns: `gridTemplateColumns: repeat(auto-fill, minmax(300px, 1fr))`. On compact screens swap `300px` for `100%` so you always get a single column.
2. Only two booleans are needed: `isCompact` (single column + `Card size="small"`) and `isWide` (`Card orientation="horizontal"`).
3. When the card turns horizontal, wrap `CardHeader` and `CardFooter` in a column next to `CardPreview` so the row reads preview -> text -> actions.
4. Add `minWidth: 0` to that flex column and use `Text truncate` for the title/description; otherwise long strings push the card wider than its grid track.
5. Use `Image` with `fit="cover"` and a per-breakpoint inline size so the preview never distorts.

## Recipe 3 - Master/detail with a vertical rail

Steps:

1. One prop flips the whole navigation pattern: `TabList vertical={!isNarrow}` — a side rail on desktop, a scrollable strip on mobile.
2. Match the divider to the parent axis: `Divider vertical={!isNarrow}`.
3. The detail pane lives in the same tree in both layouts; only `flexDirection` changes, so selection state and scroll position survive.
4. Wrap the action row with `flexWrap: 'wrap'` so buttons stack instead of overflowing on narrow screens.
5. Read the selected value from `TabList onTabSelect` (`data.value`) and render from the same array in both layouts.

## Recipe 4 - Dialog that becomes a full-screen sheet

Steps:

1. Control `Dialog` with `open` + `onOpenChange` so both the trigger and the action buttons can dismiss it.
2. Change `DialogSurface` geometry at the compact breakpoint: `width: 100vw`, `height: 100vh`, `margin: 0`, `borderRadius: 0` on mobile; a `maxWidth` on desktop.
3. Switch the form body to a single-column grid (`gridTemplateColumns: isNarrow ? '1fr' : '1fr 1fr'`) using `Field` + `Input` + `Select`.
4. Pass `fluid={isNarrow}` to `DialogActions` so the buttons stretch to full width and stack on touch screens.
5. Keep a visible close affordance in `DialogTitle` via `DialogTrigger action="close"`; `Dialog` still traps focus and closes on Esc.

## Keeping state alive across a breakpoint

- Lift shared state (open flags, selection, filters) above the branch so it survives the swap.
- Reset transient UI when leaving its breakpoint — e.g. close the overlay drawer in an effect keyed on `isNarrow`.
- Do not render both variants and hide one with `display: none`: you get duplicate ids, two tab stops, and double side effects. Swap the tree instead.
- If you must keep DOM alive (for example a video element), hide the inactive variant with proper `hidden`/`inert` semantics, not just visually.

## Performance notes

- `matchMedia` fires only when a query flips — no debounce needed. If you add a `resize` listener for measurement, throttle it with `requestAnimationFrame`.
- Avoid measuring the DOM in effects to decide layout; express it in CSS (`repeat(auto-fit, minmax(...))`, `flex-wrap`).
- Keep both branches structurally similar so switching does not remount large subtrees.

## Checklist

- [ ] Breakpoints defined once and shared by JavaScript and CSS.
- [ ] No conditional hooks; hook order is stable across renders.
- [ ] Every layout exposes a keyboard path to all actions; the drawer toggle is a real button with `aria-expanded`.
- [ ] Transient overlays close when the breakpoint changes.
- [ ] Flexible columns use `minWidth: 0` and `Text truncate`.
- [ ] Layout survives 320 px width and 200% zoom.

## Examples

### Adaptive app shell: inline drawer on desktop, overlay drawer on mobile

A full app shell that swaps a persistent InlineDrawer for a modal OverlayDrawer below 768px, exposes the toggle through a Toolbar with aria-expanded, closes the overlay when the viewport grows back, and returns focus to the toggle.

```tsx
import * as React from 'react';
import {
  Avatar,
  Button,
  Divider,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  FluentProvider,
  InlineDrawer,
  OverlayDrawer,
  Text,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarGroup,
  webLightTheme,
} from '@fluentui/react-components';

/**
 * Subscribes to a CSS media query with a single listener and no resize polling.
 * The browser value is used for the first client render to avoid a layout flash;
 * on the server it falls back to `false`.
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState<boolean>(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(mql.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

const SECTIONS = ['Overview', 'Analytics', 'Reports', 'Settings'];

const PrimaryNav: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => (
  <nav aria-label="Primary" style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 8 }}>
    {SECTIONS.map((section) => (
      <Button
        key={section}
        appearance="subtle"
        onClick={onNavigate}
        style={{ justifyContent: 'flex-start' }}
      >
        {section}
      </Button>
    ))}
  </nav>
);

export const AdaptiveAppShell: React.FC = () => {
  const isNarrow = useMediaQuery('(max-width: 767px)');
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const navToggleRef = React.useRef<HTMLButtonElement>(null);

  // Crossing back to the wide layout must never leave the modal drawer open.
  React.useEffect(() => {
    if (!isNarrow) {
      setIsNavOpen(false);
    }
  }, [isNarrow]);

  const closeNav = () => {
    setIsNavOpen(false);
    navToggleRef.current?.focus();
  };

  // One content tree for both layouts keeps the two variants in sync.
  const drawerContent = (
    <>
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            isNarrow ? (
              <Button appearance="subtle" aria-label="Close navigation" onClick={closeNav}>
                Close
              </Button>
            ) : undefined
          }
        >
          Contoso
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody>
        <PrimaryNav onNavigate={isNarrow ? closeNav : undefined} />
      </DrawerBody>
    </>
  );

  return (
    <FluentProvider theme={webLightTheme}>
      <div style={{ display: 'flex', flexDirection: isNarrow ? 'column' : 'row', minHeight: '100vh' }}>
        {isNarrow ? (
          <OverlayDrawer
            open={isNavOpen}
            onOpenChange={(_event, data) => setIsNavOpen(data.open)}
            aria-label="Primary navigation"
          >
            {drawerContent}
          </OverlayDrawer>
        ) : (
          <InlineDrawer separator style={{ width: 240, flexShrink: 0 }}>
            {drawerContent}
          </InlineDrawer>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>
          <Toolbar aria-label="Page actions">
            <ToolbarGroup>
              {isNarrow && (
                <ToolbarButton
                  ref={navToggleRef}
                  aria-label="Open navigation"
                  aria-expanded={isNavOpen}
                  onClick={() => setIsNavOpen(true)}
                >
                  Menu
                </ToolbarButton>
              )}
              <ToolbarDivider />
              <ToolbarButton appearance="primary">New report</ToolbarButton>
            </ToolbarGroup>
            <ToolbarGroup style={{ marginInlineStart: 'auto' }}>
              <Avatar name="Ada Lovelace" size={28} />
            </ToolbarGroup>
          </Toolbar>
          <Divider />
          <main style={{ padding: 16, flexGrow: 1 }}>
            <Text size={600} weight="semibold" block>
              Overview
            </Text>
            <Text block style={{ marginTop: 8 }}>
              Resize the viewport below 768px: the persistent sidebar becomes an off-canvas drawer and a menu
              toggle appears in the toolbar.
            </Text>
          </main>
        </div>
      </div>
    </FluentProvider>
  );
};
```

### Responsive card grid with re-orienting cards

An auto-filling CSS grid of Cards that switch between small/medium size, between vertical and horizontal orientation, and that truncate text safely inside flexible grid tracks.

```tsx
import * as React from 'react';
import {
  Badge,
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
  FluentProvider,
  Image,
  Text,
  webLightTheme,
} from '@fluentui/react-components';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState<boolean>(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

type Project = {
  id: string;
  name: string;
  description: string;
  cover: string;
  status: 'On track' | 'At risk';
};

/** Inline SVG placeholder so the example has no external dependencies. */
const placeholderCover = (fill: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="${fill}"/></svg>`,
  )}`;

const PROJECTS: Project[] = [
  {
    id: 'northwind',
    name: 'Northwind migration',
    description: 'Move 42 services onto the new platform.',
    cover: placeholderCover('#0f6cbd'),
    status: 'On track',
  },
  {
    id: 'billing',
    name: 'Billing rewrite',
    description: 'Consolidate invoice generation and dunning.',
    cover: placeholderCover('#8764b8'),
    status: 'At risk',
  },
  {
    id: 'design-system',
    name: 'Design system audit',
    description: 'Align every surface with the design system.',
    cover: placeholderCover('#038387'),
    status: 'On track',
  },
];

export const ResponsiveCardGrid: React.FC = () => {
  const isCompact = useMediaQuery('(max-width: 599px)');
  const isWide = useMediaQuery('(min-width: 1024px)');

  return (
    <FluentProvider theme={webLightTheme}>
      <section style={{ padding: 16 }}>
        <Text size={600} weight="semibold" block>
          Projects
        </Text>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${isCompact ? '100%' : '300px'}, 1fr))`,
            gap: 12,
            marginTop: 12,
          }}
        >
          {PROJECTS.map((project) => (
            <Card
              key={project.id}
              appearance="outline"
              size={isCompact ? 'small' : 'medium'}
              orientation={isWide ? 'horizontal' : 'vertical'}
            >
              <CardPreview>
                <Image
                  src={project.cover}
                  alt=""
                  fit="cover"
                  style={
                    isWide
                      ? { width: 160, minHeight: 120, alignSelf: 'stretch' }
                      : { width: '100%', height: 140 }
                  }
                />
              </CardPreview>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  minWidth: 0,
                  flexGrow: 1,
                }}
              >
                <CardHeader
                  header={
                    <Text weight="semibold" truncate>
                      {project.name}
                    </Text>
                  }
                  description={
                    <Text size={200} truncate>
                      {project.description}
                    </Text>
                  }
                  action={
                    <Badge
                      appearance="tint"
                      color={project.status === 'On track' ? 'success' : 'warning'}
                    >
                      {project.status}
                    </Badge>
                  }
                />
                <CardFooter>
                  <Button appearance="primary">Open</Button>
                  <Button appearance="secondary">Share</Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </FluentProvider>
  );
};
```

### Master/detail with a tab rail that flips vertical to horizontal

A mailbox-style layout: TabList vertical on desktop, horizontal on mobile, a Divider that matches the parent axis, and a detail Card whose action row wraps on narrow screens.

```tsx
import * as React from 'react';
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Divider,
  FluentProvider,
  Tab,
  TabList,
  Text,
  webLightTheme,
} from '@fluentui/react-components';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState<boolean>(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

type Message = {
  id: string;
  from: string;
  subject: string;
  body: string;
  unread: boolean;
};

const MESSAGES: Message[] = [
  {
    id: 'm1',
    from: 'Ada Lovelace',
    subject: 'Quarterly plan review',
    body: 'I tightened the milestones for Q3 and removed the two deliverables that depended on the billing rewrite. The revised plan is attached: please review before Thursday.',
    unread: true,
  },
  {
    id: 'm2',
    from: 'Grace Hopper',
    subject: 'Release notes draft',
    body: 'The draft notes are ready for a first pass. I flagged the breaking changes in the migration section so support can prepare the knowledge base article.',
    unread: false,
  },
  {
    id: 'm3',
    from: 'Alan Turing',
    subject: 'Incident postmortem',
    body: 'Root cause was a stale feature flag left enabled in one ring. Action items: add a flag audit to the release checklist and alert on flag age.',
    unread: false,
  },
];

export const ResponsiveMasterDetail: React.FC = () => {
  const isNarrow = useMediaQuery('(max-width: 767px)');
  const [selectedId, setSelectedId] = React.useState<string>(MESSAGES[0].id);
  const selected = MESSAGES.find((message) => message.id === selectedId) ?? MESSAGES[0];

  return (
    <FluentProvider theme={webLightTheme}>
      <div
        style={{
          display: 'flex',
          flexDirection: isNarrow ? 'column' : 'row',
          gap: isNarrow ? 0 : 16,
          padding: 16,
          minHeight: '100vh',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ flexShrink: 0, width: isNarrow ? '100%' : 240 }}>
          <TabList
            vertical={!isNarrow}
            selectedValue={selectedId}
            onTabSelect={(_event, data) => setSelectedId(data.value as string)}
            style={isNarrow ? { overflowX: 'auto' } : undefined}
          >
            {MESSAGES.map((message) => (
              <Tab key={message.id} value={message.id}>
                {message.subject}
              </Tab>
            ))}
          </TabList>
        </div>

        <Divider vertical={!isNarrow} />

        <div style={{ flexGrow: 1, minWidth: 0, paddingBlock: isNarrow ? 16 : 0 }}>
          <Card appearance="subtle">
            <CardHeader
              header={
                <Text size={500} weight="semibold">
                  {selected.subject}
                </Text>
              }
              description={<Text size={200}>{selected.from}</Text>}
              action={
                selected.unread ? (
                  <Badge appearance="filled" color="brand">
                    Unread
                  </Badge>
                ) : undefined
              }
            />
            <Text block style={{ marginTop: 12 }}>
              {selected.body}
            </Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              <Button appearance="primary">Reply</Button>
              <Button appearance="secondary">Archive</Button>
            </div>
          </Card>
        </div>
      </div>
    </FluentProvider>
  );
};
```

### Settings dialog that becomes a full-screen sheet on mobile

A controlled Dialog whose surface fills the viewport below 600px, with a responsive Field/Input/Select grid and fluid (full-width, stacked) DialogActions.

```tsx
import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  FluentProvider,
  Input,
  Select,
  webLightTheme,
} from '@fluentui/react-components';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState<boolean>(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

export const ResponsiveSettingsDialog: React.FC = () => {
  const isNarrow = useMediaQuery('(max-width: 599px)');
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('Contoso workspace');
  const [region, setRegion] = React.useState('westus');

  return (
    <FluentProvider theme={webLightTheme}>
      <Dialog open={open} onOpenChange={(_event, data) => setOpen(data.open)}>
        <DialogTrigger disableButtonEnhancement>
          <Button appearance="primary">Workspace settings</Button>
        </DialogTrigger>

        <DialogSurface
          style={
            isNarrow
              ? {
                  width: '100vw',
                  maxWidth: '100vw',
                  height: '100vh',
                  maxHeight: '100vh',
                  margin: 0,
                  borderRadius: 0,
                }
              : { maxWidth: 520 }
          }
        >
          <DialogBody>
            <DialogTitle
              action={
                <DialogTrigger action="close" disableButtonEnhancement>
                  <Button appearance="subtle" aria-label="Close settings">
                    Close
                  </Button>
                </DialogTrigger>
              }
            >
              Workspace settings
            </DialogTitle>

            <DialogContent>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isNarrow ? '1fr' : '1fr 1fr',
                  gap: 16,
                }}
              >
                <Field label="Workspace name" required>
                  <Input value={name} onChange={(_event, data) => setName(data.value)} />
                </Field>

                <Field label="Region" hint="Determines where your data is stored.">
                  <Select value={region} onChange={(_event, data) => setRegion(data.value)}>
                    <option value="westus">West US</option>
                    <option value="eastus">East US</option>
                    <option value="westeurope">West Europe</option>
                  </Select>
                </Field>
              </div>
            </DialogContent>

            <DialogActions fluid={isNarrow}>
              <DialogTrigger action="close" disableButtonEnhancement>
                <Button appearance="secondary">Cancel</Button>
              </DialogTrigger>
              <Button appearance="primary" onClick={() => setOpen(false)}>
                Save
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </FluentProvider>
  );
};
```

## Pitfalls

- Calling hooks conditionally to "switch layout": `if (isNarrow) { const x = useState(...) }` breaks the rules of hooks. Always call useMediaQuery and every state hook unconditionally at the top, then branch only in the returned JSX.
- Rendering both layouts and hiding one with display:none: this duplicates element ids, doubles the tab stops, and fires effects twice. Swap the component tree instead; if you must keep DOM alive, hide it with hidden/inert semantics.
- Forgetting to close the overlay drawer when the viewport grows: the modal drawer stays mounted behind the newly visible inline drawer and can swallow focus on the next interaction. Add an effect keyed on isNarrow that closes it.
- Reading window.innerWidth during render or in a resize listener without guards: it produces stale values across renders, causes hydration mismatches in SSR frameworks, and triggers layout thrash. Subscribe to matchMedia once per query instead.
- Skipping minWidth: 0 on flex/grid children: a long title or an Image with a natural width pushes the pane wider than its track and breaks the whole shell. Add minWidth: 0 and use Text truncate.
- Changing Card orientation without regrouping children: with orientation="horizontal" every direct child becomes a flex row item, so CardPreview takes a full column and the header sits beside it awkwardly. Wrap CardHeader and CardFooter in a single column div.
- Letting JavaScript and CSS breakpoints drift apart: if the hook uses 767px while your stylesheet uses 768px, one frame renders a hybrid layout. Define the breakpoints once and reference the same values.
- Giving the mobile experience fewer capabilities: hiding the primary action on small screens or burying it behind a scroll that the sticky header covers. Reflow actions (flexWrap: 'wrap', DialogActions fluid) instead of removing them.
- Using pixel-perfect absolute positioning for responsiveness: it breaks at unanticipated widths, in RTL, and under zoom. Prefer grid auto-fill/minmax, flex-wrap, and clamp() for fluid behaviour.
- Not returning focus to the trigger after the overlay drawer closes: keyboard users end up at the top of the document. Store the toggle in a ref and call focus() in the close handler.

## Accessibility

Responsive layouts must expose the same information and the same task completion paths at every width, or the small-screen experience becomes a dead end. Specific requirements for this recipe:

1. Navigation toggle: the button that opens the off-canvas drawer must be a real button with an accessible name (aria-label="Open navigation") and must report state with aria-expanded={isNavOpen}. It must only exist in the narrow layout so screen-reader and keyboard users never encounter two navigation controls.
2. Drawer semantics: OverlayDrawer is modal - it renders a backdrop, traps focus, and closes on Esc, so it must have an accessible name (aria-label on the drawer) and a visible close action in DrawerHeaderTitle. Return focus to the toggle when the drawer closes; without that, focus lands on body and keyboard users lose their place.
3. Reading order equals DOM order: when a row layout stacks into a column, the DOM order (nav, toolbar, main / list, detail) is the reading order. Do not use CSS order or absolute positioning to visually reorder regions, because assistive technology follows the DOM.
4. TabList: switching vertical={!isNarrow} keeps arrow-key navigation intact because TabList implements roving tabindex in both axes. Keep one TabList in the tree across the breakpoint so the selected tab and focus are preserved.
5. Dialogs on mobile: a full-screen DialogSurface is still a modal - keep the DialogTitle with a close DialogTrigger, keep focus trapped by Dialog (do not disable it), and ensure DialogActions buttons are reachable with the virtual keyboard open. Set DialogActions fluid so buttons do not shrink below the ~44px touch target.
6. Text truncation must never hide the only copy: pair Text truncate with a title attribute or expose the full value in the detail pane, not only in the list.
7. Zoom and text resize: verify the layout at 200% browser zoom and at 320px CSS width. Prefer em-based media queries so increased user font size also triggers the compact layout.
8. Motion: overlay drawers and dialogs animate; respect reduced-motion preferences and avoid animating layout properties (width/height) in your own breakpoint styling.

## Components used

- [FluentProvider](../../components/fluent-provider.md)
- [Toolbar](../../components/toolbar.md)
- [ToolbarGroup](../../components/toolbar-group.md)
- [ToolbarButton](../../components/toolbar-button.md)
- [ToolbarDivider](../../components/toolbar-divider.md)
- [Avatar](../../components/avatar.md)
- [Button](../../components/button.md)
- [Divider](../../components/divider.md)
- [DrawerHeader](../../components/drawer-header.md)
- [DrawerHeaderTitle](../../components/drawer-header-title.md)
- [DrawerBody](../../components/drawer-body.md)
- [InlineDrawer](../../components/inline-drawer.md)
- [OverlayDrawer](../../components/overlay-drawer.md)
- [Text](../../components/text.md)
- [Card](../../components/card.md)
- [CardHeader](../../components/card-header.md)
- [CardPreview](../../components/card-preview.md)
- [CardFooter](../../components/card-footer.md)
- [Image](../../components/image.md)
- [Badge](../../components/badge.md)
- [TabList](../../components/tab-list.md)
- [Tab](../../components/tab.md)
- [Dialog](../../components/dialog.md)
- [DialogTrigger](../../components/dialog-trigger.md)
- [DialogSurface](../../components/dialog-surface.md)
- [DialogBody](../../components/dialog-body.md)
- [DialogTitle](../../components/dialog-title.md)
- [DialogContent](../../components/dialog-content.md)
- [DialogActions](../../components/dialog-actions.md)
- [Field](../../components/field.md)
- [Input](../../components/input.md)
- [Select](../../components/select.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
