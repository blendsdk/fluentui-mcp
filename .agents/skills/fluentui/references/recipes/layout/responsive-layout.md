# Responsive Layout

> **Group**: layout

## Goal

Build responsive FluentUI React v9 layouts that reflow across phone, tablet, and desktop widths by combining Griffel `makeStyles` media queries with breakpoint-driven component props (Card, Divider, Field) and a `matchMedia` hook for structural changes such as a navigation rail that collapses into a disclosure panel.

## When to Use

Use this recipe when a single component tree must adapt to viewport width: dashboards, list/detail app shells, settings forms, and card galleries. It is the right choice when content can reflow with CSS and only a few behaviours (rail vs. disclosure, stacked vs. side-by-side fields) need to change.

## When Not to Use

Do not use it for tabular data that must stay tabular at every width (keep the table and give its wrapper `overflow-x: auto`), and do not use viewport media queries when the component lives in a resizable pane or an iframe rather than the page viewport — measure the container instead. If the requirement is 'drop individual toolbar items as space shrinks' rather than 'reflow the layout', you need an item-overflow pattern instead of media queries.

FluentUI React v9 ships no `Grid` or `Stack` in core. Responsive layouts are assembled from two things: **Griffel styles** (`makeStyles` + `tokens`, including `@media` blocks) and **component props** that flip orientation, size, or density at a breakpoint. This recipe composes three patterns most app shells need: a card grid that reflows, an app shell whose navigation rail collapses behind a toggle, and a form whose fields switch from stacked to label-beside-control.

## The three levers of responsiveness

| Lever | Use it when | Tools |
| --- | --- | --- |
| **Fluid CSS** | Same DOM, different sizes | `makeStyles` + CSS grid/flex, `minmax(0, 1fr)`, `minWidth: 0` |
| **Breakpoint props** | Same DOM, different arrangement | `Card orientation`, `Divider vertical`, `Field orientation`, `Tabs vertical`, `Nav density`, `size` props |
| **Breakpoint structure** | Different behaviour or a different component | a `matchMedia` hook + conditional rendering (rail vs. disclosure) |

Always try lever 1, then lever 2. Reach for lever 3 only when behaviour genuinely differs — every conditional render is a place where focus and typed input can be lost.

## Step 1 — Pick breakpoints and keep them in one place

Use a small, device-agnostic set. Content, not devices, drives the values.

```ts
// breakpoints.ts
export const BREAKPOINTS = {
  sm: 640, // large phone / small tablet
  md: 900, // tablet landscape
  lg: 1200, // desktop
} as const;

/** Media query strings for the JS side (window.matchMedia). */
export const MEDIA = {
  smUp: `(min-width: ${BREAKPOINTS.sm}px)`,
  mdUp: `(min-width: ${BREAKPOINTS.md}px)`,
  lgUp: `(min-width: ${BREAKPOINTS.lg}px)`,
} as const;
```

Inside `makeStyles`, write the media query string **literally** in the style object:

```ts
const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: tokens.spacingHorizontalM,
    '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
    '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
  },
});
```

Go **mobile-first**: the base rule is the narrow layout and each `@media (min-width: ...)` block adds the wider one. Mixing `max-width` and `min-width` overrides for the same property inside one rule makes you depend on class emission order, which is fragile.

## Step 2 — Let CSS do the work

Rules of thumb that keep Fluent layouts from overflowing:

- Grid tracks: `minmax(0, 1fr)` instead of `1fr`, or long words and nested tables blow the column out.
- Flex/grid children that contain text, `Table`, or a `Card` grid: add `minWidth: 0`.
- `Text truncate` only truncates when a parent can shrink — give the wrapper `minWidth: 0`.
- Buttons that should fill the width on a phone: `width: '100%'` in the base rule, `width: 'auto'` inside the media query.
- Never reorder content with CSS `order` or `flex-direction: column-reverse`; visual order and DOM/tab order diverge. Put the primary action last in the DOM and use `justifyContent` to place it.
- Use spacing tokens (`tokens.spacingHorizontalL`) rather than literals so the layout follows the active theme (including compact density).

## Step 3 — Sync JS with CSS using a matchMedia hook

Use JS only for decisions CSS cannot express: which markup to render, whether a panel starts open, whether a rail exists at all.

```tsx
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState<boolean>(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
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

- The lazy initializer keeps server rendering safe (`typeof window === 'undefined'`).
- `mql.addEventListener('change', ...)` avoids resize-event churn and fires only when the query flips.
- The `query` string must be the **same** string used by the CSS media query, or CSS and behaviour will disagree for a range of widths.

## Step 4 — Flip component props at a breakpoint

Several Fluent components already model “stacked vs. side-by-side”:

- `Field orientation` — `'vertical' | 'horizontal'`.
- `Card orientation` — `'vertical' | 'horizontal'` (good for media + text cards).
- `Divider vertical` — a vertical rule; its parent must give it height.
- `Tabs vertical`, `Nav density`, `Toolbar vertical`, `Persona textPosition`, and the various `size` props follow the same idea.

Drive them from the hook and **annotate the variable** — a bare ternary widens to `string` and will not type-check against the prop:

```tsx
const isWide = useMediaQuery('(min-width: 720px)');
const orientation: 'horizontal' | 'vertical' = isWide ? 'horizontal' : 'vertical';

<Field label="Workspace name" orientation={orientation}>
  <Input />
</Field>;
```

## Step 5 — Compose

The examples below are the three building blocks:

1. `ResponsiveProjectGrid` — CSS only. A card grid that reflows 1 → 2 → 3 columns and toolbar actions that stretch to full width on phones.
2. `ResponsiveAppShell` — behaviour switch. A sticky navigation rail at `min-width: 900px`, and a `Menu` button with `aria-expanded`/`aria-controls` that reveals the same nav below that width. A `matchMedia` hook and the CSS media queries share one breakpoint string.
3. `ResponsiveSettingsForm` — prop switch. `Field orientation` flips at 720px and the form actions stack full-width on phones, with `Divider` rows separating sections.

## Checking your work

1. Resize from 320px to 1600px and watch for horizontal scrollbars — any overflow means a track or child is missing `minmax(0, 1fr)` / `minWidth: 0`.
2. Zoom to 200% at 1280px. WCAG 1.4.10 (Reflow) requires content to be usable at the equivalent of 320 CSS px without two-dimensional scrolling.
3. Tab through each breakpoint: the nav toggle, every rail item, and both form actions must be reachable in DOM order.
4. Cross the breakpoint while focus is inside a control and while an input has a value — nothing should lose focus or state.

## Examples

### ResponsiveProjectGrid

A card gallery that reflows from one to two to three columns and a toolbar whose actions go full-width on phones. Pure CSS responsiveness with Griffel media queries, tokens, Card, Badge, Avatar, Button, and Text.

```tsx
import * as React from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

type ProjectStatus = 'On track' | 'At risk' | 'Blocked';

interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: ProjectStatus;
}

const PROJECTS: Project[] = [
  {
    id: 'northwind',
    name: 'Northwind migration',
    description: 'Move the reporting pipeline to the new cluster without downtime.',
    owner: 'Ada Lovelace',
    status: 'On track',
  },
  {
    id: 'billing',
    name: 'Billing revamp',
    description: 'Rebuild invoices, credits and refunds end to end.',
    owner: 'Grace Hopper',
    status: 'At risk',
  },
  {
    id: 'search',
    name: 'Search relevance',
    description: 'Tune ranking signals for the product catalog.',
    owner: 'Alan Turing',
    status: 'Blocked',
  },
];

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalL,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: tokens.spacingHorizontalL,
    boxSizing: 'border-box',
  },
  // Stacked on phones, split on the left/right from 640px up.
  toolbar: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
    columnGap: tokens.spacingHorizontalM,
    '@media (min-width: 640px)': {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
  heading: {
    margin: 0,
    fontSize: tokens.fontSizeBase600,
    lineHeight: tokens.lineHeightBase600,
    fontWeight: tokens.fontWeightSemibold,
  },
  toolbarActions: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: tokens.spacingHorizontalS,
    rowGap: tokens.spacingVerticalS,
  },
  toolbarButton: {
    flexGrow: 1,
    '@media (min-width: 640px)': { flexGrow: 0 },
  },
  // 1 column -> 2 columns -> 3 columns. minmax(0, 1fr) keeps long words from
  // stretching the track wider than its share of the container.
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: tokens.spacingHorizontalM,
    '@media (min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
    height: '100%',
    boxSizing: 'border-box',
  },
  cardFooter: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: tokens.spacingHorizontalS,
    rowGap: tokens.spacingVerticalS,
    marginTop: 'auto',
  },
  owner: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
    minWidth: 0,
  },
});

const badgeColor = (status: ProjectStatus): 'success' | 'warning' | 'danger' => {
  if (status === 'On track') {
    return 'success';
  }
  if (status === 'At risk') {
    return 'warning';
  }
  return 'danger';
};

export const ResponsiveProjectGrid: React.FC = () => {
  const styles = useStyles();

  return (
    <section className={styles.root} aria-labelledby="projects-heading">
      <div className={styles.toolbar}>
        <h2 className={styles.heading} id="projects-heading">
          Projects
        </h2>
        <div className={styles.toolbarActions}>
          <Button className={styles.toolbarButton} appearance="secondary">
            Filter
          </Button>
          <Button className={styles.toolbarButton} appearance="primary">
            New project
          </Button>
        </div>
      </div>

      <div className={styles.grid}>
        {PROJECTS.map((project) => (
          <Card key={project.id} appearance="outline" className={styles.card}>
            <Text weight="semibold" truncate>
              {project.name}
            </Text>
            <Text size={200}>{project.description}</Text>
            <div className={styles.cardFooter}>
              <span className={styles.owner}>
                <Avatar name={project.owner} size={24} />
                <Text size={200} truncate>
                  {project.owner}
                </Text>
              </span>
              <Badge appearance="tint" color={badgeColor(project.status)}>
                {project.status}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
```

### ResponsiveAppShell

An app shell with a sticky navigation rail on desktop that becomes a collapsible nav panel below 900px, driven by a matchMedia hook that shares its breakpoint string with the Griffel media queries.

```tsx
import * as React from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Text,
  Tooltip,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

/**
 * Keep this string in sync with the `@media (min-width: 900px)` blocks below:
 * the CSS lays the shell out and the hook decides which markup to render.
 */
const WIDE_QUERY = '(min-width: 900px)';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState<boolean>(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
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

const NAV_ITEMS = ['Overview', 'Deployments', 'Analytics', 'Settings'] as const;

const STATS = [
  { id: 'deploys', label: 'Deployments today', value: '18' },
  { id: 'failed', label: 'Failed checks', value: '2' },
  { id: 'build', label: 'Average build time', value: '4m 12s' },
];

const useStyles = makeStyles({
  shell: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: tokens.spacingHorizontalM,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  brand: {
    minWidth: 0,
  },
  headerEnd: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalM,
  },
  alerts: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXS,
  },
  // Column on narrow screens (nav above content), row from 900px up.
  body: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    '@media (min-width: 900px)': {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
  },
  rail: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXXS,
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground1,
    '@media (min-width: 900px)': {
      width: '240px',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      borderRight: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    },
  },
  navItem: {
    justifyContent: 'flex-start',
    width: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalL,
    flexGrow: 1,
    minWidth: 0,
    padding: tokens.spacingHorizontalL,
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: tokens.spacingHorizontalM,
    '@media (min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '@media (min-width: 1200px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXXS,
  },
});

export const ResponsiveAppShell: React.FC = () => {
  const styles = useStyles();
  const isWide = useMediaQuery(WIDE_QUERY);
  const [navOpen, setNavOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>(NAV_ITEMS[0]);

  // On wide screens the rail is always there; below the breakpoint it is a disclosure.
  const showNavigation = isWide || navOpen;

  const handleSelect = (item: string) => {
    setSelected(item);
    if (!isWide) {
      setNavOpen(false);
    }
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Text weight="semibold" truncate>
            Contoso Ops
          </Text>
        </div>

        <div className={styles.headerEnd}>
          <span className={styles.alerts}>
            <Badge appearance="tint" color="danger" size="medium">
              3
            </Badge>
            <Text size={200}>alerts</Text>
          </span>

          <Tooltip content="Opens the documentation" relationship="description">
            <Button
              appearance="subtle"
              onClick={() => window.open('https://example.com/docs', '_blank', 'noopener')}
            >
              Help
            </Button>
          </Tooltip>

          <Avatar name="Ada Lovelace" size={28} />

          {!isWide ? (
            <Button
              appearance="subtle"
              aria-expanded={navOpen}
              aria-controls="app-navigation"
              onClick={() => setNavOpen((open) => !open)}
            >
              Menu
            </Button>
          ) : null}
        </div>
      </header>

      <div className={styles.body}>
        {showNavigation ? (
          <nav id="app-navigation" className={styles.rail} aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <Button
                key={item}
                className={styles.navItem}
                appearance={item === selected ? 'secondary' : 'subtle'}
                aria-current={item === selected ? 'page' : undefined}
                onClick={() => handleSelect(item)}
              >
                {item}
              </Button>
            ))}
          </nav>
        ) : null}

        <main className={styles.content}>
          <Text size={600} weight="semibold" block>
            {selected}
          </Text>
          <Divider />

          <div className={styles.stats}>
            {STATS.map((stat) => (
              <Card
                key={stat.id}
                appearance="filled-alternative"
                className={styles.statCard}
              >
                <Text size={200}>{stat.label}</Text>
                <Text size={500} weight="semibold">
                  {stat.value}
                </Text>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
```

### ResponsiveSettingsForm

A settings form in a Card where Field orientation flips from vertical to horizontal at 720px and the action buttons stack full-width on phones, showing prop-driven responsiveness on top of CSS.

```tsx
import * as React from 'react';
import {
  Button,
  Card,
  Divider,
  Field,
  Input,
  Select,
  Switch,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const WIDE_QUERY = '(min-width: 720px)';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState<boolean>(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
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

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: tokens.spacingHorizontalL,
    boxSizing: 'border-box',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalL,
    width: '100%',
    maxWidth: '720px',
    alignSelf: 'flex-start',
    padding: tokens.spacingHorizontalL,
    boxSizing: 'border-box',
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalL,
  },
  // Actions are stacked and full width on phones, right-aligned on one row above 720px.
  actions: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
    '@media (min-width: 720px)': {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      columnGap: tokens.spacingHorizontalS,
    },
  },
  actionButton: {
    width: '100%',
    '@media (min-width: 720px)': { width: 'auto' },
  },
});

export const ResponsiveSettingsForm: React.FC = () => {
  const styles = useStyles();
  const isWide = useMediaQuery(WIDE_QUERY);
  // Annotate the variable: a bare ternary widens to `string` and fails to type-check.
  const orientation: 'horizontal' | 'vertical' = isWide ? 'horizontal' : 'vertical';

  const [name, setName] = React.useState('Contoso Ops');
  const [region, setRegion] = React.useState('westus');
  const [digest, setDigest] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    window.setTimeout(() => setSaving(false), 800);
  };

  return (
    <form className={styles.root} onSubmit={handleSubmit}>
      <Card className={styles.card} appearance="outline">
        <Text size={500} weight="semibold" block>
          Workspace settings
        </Text>
        <Divider />

        <div className={styles.fields}>
          <Field
            label="Workspace name"
            orientation={orientation}
            required
            hint="Shown to everyone in the workspace."
          >
            <Input
              value={name}
              onChange={(_, data) => setName(data.value)}
              placeholder="Contoso Ops"
            />
          </Field>

          <Field
            label="Primary region"
            orientation={orientation}
            hint="Changing the region restarts running jobs."
          >
            <Select value={region} onChange={(_, data) => setRegion(data.value)}>
              <option value="westus">West US</option>
              <option value="eastus">East US</option>
              <option value="westeurope">West Europe</option>
            </Select>
          </Field>

          <Field
            label="Weekly digest"
            orientation={orientation}
            hint="A summary email every Monday."
          >
            {/* Field labels the control, so the Switch does not need its own label. */}
            <Switch checked={digest} onChange={(_, data) => setDigest(data.checked)} />
          </Field>
        </div>

        <Divider />

        <div className={styles.actions}>
          <Button className={styles.actionButton} appearance="secondary" type="reset">
            Reset
          </Button>
          <Button
            className={styles.actionButton}
            appearance="primary"
            type="submit"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </Card>
    </form>
  );
};
```

## Pitfalls

- Building media query strings in makeStyles from a shared constants object using computed keys (`[MEDIA.mdUp]: { ... }`) can widen the style object's type and break type-checking or Griffel's class extraction. Write the media query string literally inside each style rule and share only plain numbers/strings with your matchMedia hook.
- Using `1fr` grid tracks instead of `minmax(0, 1fr)` lets long unbroken content (URLs, code, Table rows) stretch a column past its share and produce horizontal page scrolling.
- Omitting `minWidth: 0` on flex or grid children that contain text, a Card, or a Table. Flex items default to min-width: auto, so they refuse to shrink and overflow instead.
- Driving anything with JS that CSS can do. Reading `window.matchMedia` in a useState initializer without guarding `typeof window === 'undefined'` breaks server rendering, and computing layout in JS causes a flash before hydration. Guard it, and keep the JS query string identical to the CSS media query or the layout and behaviour disagree for a band of widths.
- Unmounting an element when a breakpoint flips (for example, removing the whole nav) can drop focus, reset scroll, or lose form state. Prefer CSS-level hiding with `hidden`/`display:none`, and only conditionally render when the markup genuinely differs — and then keep the toggle and the region adjacent in the DOM.
- Rendering exactly one button per breakpoint (a mobile 'Menu' button and a desktop 'Help' button in separate branches) without a stable `key` or element identity can cause focus loss and duplicate ids. Render one element and change its props/behaviour instead.
- Using `Divider vertical` inside a container that has no height or does not stretch its children: a vertical divider resolves to zero height and disappears. Give the parent an explicit height or `alignItems: 'stretch'`.
- Making a sticky header or rail without offsetting the other sticky element by the header height, so the rail sticks underneath the header. Use a shared height token/variable for both.
- Relying on Button's default size for full-width mobile actions. Buttons size to their content; set `width: '100%'` in the narrow rule and revert to `width: 'auto'` inside the wider media query. The same applies to reordering actions: keep the primary action last in the DOM rather than using CSS `order`.

## Accessibility

Fluent layout components do not add landmarks, so provide them yourself: header/main/nav/section with aria-labelledby on sections that have headings, and aria-label on navigation regions. A control that shows or hides navigation must be a real button (Button) with aria-expanded and aria-controls pointing at the id of the region it toggles, and it should sit immediately before that region in DOM order so keyboard users move from the toggle straight into the nav. Collapsed navigation must be removed from the DOM or hidden with the hidden attribute / display:none — never just visually hidden — so its items are not focusable or exposed to assistive technology. Keep DOM order identical to visual order; do not reorder with CSS order, column-reverse, or absolute positioning, since screen readers and tab order follow the DOM. Text truncate removes content visually but not from the accessibility tree, so make the full value available (a title or aria-label on the container) when truncation is possible. Keep interactive targets at least 40-44px on touch widths; the responsive toolbar stretches buttons on phones, which also satisfies target-size guidance. Field supplies the label association for Input, Select, and Switch — do not add a second visible label to the control inside a Field. Sticky headers and rails can cover the focused element when scrolling; add scroll offset or padding so focus is never hidden, and check that resizing across a breakpoint does not move focus or discard typed input. Test at 200% browser zoom: WCAG 1.4.10 requires usable reflow at the equivalent of a 320 CSS px viewport without two-dimensional scrolling. Media-query-driven layout responds to zoom automatically; JS-driven layout should never be the only thing keeping content usable.

## Components used

- [Avatar](../../components/avatar.md)
- [Badge](../../components/badge.md)
- [Button](../../components/button.md)
- [Card](../../components/card.md)
- [Divider](../../components/divider.md)
- [Field](../../components/field.md)
- [Input](../../components/input.md)
- [Select](../../components/select.md)
- [Switch](../../components/switch.md)
- [Text](../../components/text.md)
- [Tooltip](../../components/tooltip.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
