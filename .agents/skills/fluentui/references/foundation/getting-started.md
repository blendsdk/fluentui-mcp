# Getting Started with FluentUI

> **Category**: foundation

FluentUI v9 is Microsoft's React component library and design system, distributed as the single package `@fluentui/react-components`. This guide takes you from an empty project to a working, themed, accessible screen using only the public v9 API surface: the components, their props, their slots, and the supporting components such as `FluentProvider`.

## 1. What you are working with

| Concern | What v9 gives you |
| --- | --- |
| Distribution | One package, `@fluentui/react-components`, that exports every component |
| Styling | Component styles are generated and injected at runtime; you do not import a CSS bundle |
| Composition | Every component is built from slots (a `root` plus named sub-elements) |
| State | Stateful components expose a controlled API and an uncontrolled API, never both at once |
| Accessibility | ARIA roles, keyboard behaviour and focus management are implemented for you; labelling your content is your job |

### The component families

Knowing the families is the fastest way to find the right component:

- **Buttons** - `Button`, `CompoundButton`, `MenuButton`, `SplitButton`, `ToggleButton`.
- **Forms** - `Field`, `Label`, `InfoLabel`, `InfoButton`, `Input`, `Textarea`, `Select`, `Dropdown`, `Combobox`, `Option`, `OptionGroup`, `Listbox`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Slider`, `SpinButton`, `SearchBox`, `Rating`, `RatingDisplay`, `ColorPicker`, `ColorArea`, `ColorSlider`, `AlphaSlider`, `ColorSwatch`, `SwatchPicker`, `TagPicker`.
- **Data display** - `Text`, `Card`, `Avatar`, `Badge`, `CounterBadge`, `PresenceBadge`, `Image`, `List`, `Persona`, `Skeleton`, `Table`, `DataGrid`, `Tree`, `FlatTree`, `Tag`, `InteractionTag`.
- **Feedback** - `Dialog`, `MessageBar`, `ProgressBar`, `Spinner`, `Toast`, `Toaster`.
- **Layout** - `Card` primitives (`CardHeader`, `CardPreview`, `CardFooter`) and `Divider`.
- **Navigation** - `Breadcrumb`, `Link`, `Menu`, `Nav`, `TabList`, `Toolbar`.
- **Overlays** - `Drawer` (`OverlayDrawer`, `InlineDrawer`), `Popover`, `TeachingPopover`.
- **Utilities** - `FluentProvider`, `Portal`, `Accordion`, `Carousel`, `OverflowItem`, `AriaLiveAnnouncer`.

## 2. Install

```bash
npm install @fluentui/react-components
```

React and React DOM are peer dependencies (React 16.8 or newer; React 17 and 18 are the best-tested versions). Nothing else is required: there is no stylesheet to import and no build plugin to configure. Styles are generated at runtime, and with a modern bundler the ESM build lets unused components drop out of the output.

## 3. Wrap the application once with FluentProvider

The single mandatory integration step is `FluentProvider`. It supplies the theme, text direction, and portal configuration that every FluentUI component below it consumes. Place it once, as high as practical (typically around your root `<App />`).

Key `FluentProvider` props:

- `theme` - a `Partial<Theme>`; you only provide the values you want to change and the rest fall back to the default light theme. Define it once at module scope so the reference stays stable.
- `dir` - `'ltr'` or `'rtl'` for the subtree.
- `targetDocument` - the `Document` that portals should render into, for iframes or embedded hosts.
- `applyStylesToPortals` - applies the provider styling to portal roots so overlays (menus, popovers, dialogs, tooltips, toasts) keep the look and theme of their provider.
- `overrides_unstable` and `customStyleHooks_unstable` - escape hatches for advanced style and behaviour overrides.

Overlay components render into a portal attached to the document body by default, which means they are outside of your provider's DOM subtree. `applyStylesToPortals` is what keeps them visually consistent.

## 4. Render your first components

Once the provider is in place, everything is ordinary React. Three ideas cover most of the API:

1. **`appearance` expresses emphasis** on buttons and surfaces: `primary` is the strongest, `secondary` is the default, then `outline`, `subtle`, and `transparent` get progressively quieter. Most screens should have a small number of `primary` actions.
2. **`size` and `shape` are consistent vocabulary** across the library (`small` / `medium` / `large`, `rounded` / `circular` / `square`), so a form built from `Input`, `Select` and `Button` stays visually aligned.
3. **`disabled` versus `disabledFocusable`.** Use `disabled` when a control must be completely inert; use `disabledFocusable` when the control should still be reachable by keyboard and screen reader users (for example, while saving), which is also what makes tooltips work on a disabled-looking control.

## 5. The composition model: slots, shorthand props, and `as`

Every component is assembled from slots. A slot can be filled in three ways:

- **A React element** - replaces the slot content: `<Button icon={<Spinner size='extra-tiny' />}>Save</Button>`.
- **Plain content** - strings and numbers become the slot's children: `<Badge>New</Badge>`.
- **A shorthand object** - `{ children, as, className, style, ...nativeProps }`: pass the props of the underlying element without writing JSX.

Optional slots can be omitted by passing `null` or leaving them `undefined`, which is how you suppress parts of a composition. Required slots (for example the `root` of many components) always render.

Some components are flat (`Button` has `root` and `icon`; `Input` has `root`, `input`, `contentBefore`, `contentAfter`); others use nested subcomponents instead: `Card` with `CardHeader` / `CardPreview` / `CardFooter`, `Dialog` with `DialogSurface` / `DialogTitle` / `DialogBody` / `DialogContent` / `DialogActions`, `DataGrid` with `DataGridBody` / `DataGridRow` / `DataGridCell`. The per-component slot list is the authoritative anatomy reference.

Root slots also carry the `as` prop, so a component can render a different element when the semantics demand it, for example rendering a button as a link. When you change the element, supply the attributes that element requires (`href`, `type`, and so on).

## 6. Controlled or uncontrolled: pick one per component

Almost every stateful component ships a pair of props:

| Uncontrolled | Controlled | Change callback |
| --- | --- | --- |
| `defaultOpen` | `open` | `onOpenChange` |
| `defaultChecked` | `checked` | `onChange` |
| `defaultValue` | `value` | `onChange` / `onOptionSelect` |
| `defaultSelectedValue` | `selectedValue` | `onTabSelect` / `onNavItemSelect` / `onSelectionChange` |
| `defaultSelected` | `selected` | `onSelectionChange` |
| `defaultOpenItems` | `openItems` | `onToggle` |
| `defaultActiveIndex` | `activeIndex` | `onActiveIndexChange` |

Rules of thumb: use the uncontrolled form for state nobody else needs to read; use the controlled form when the state lives in a store, a route, or a parent component. Never mix them on the same component, and always implement the change callback when you control the value - otherwise the UI will appear frozen.

Every change callback receives two arguments: the DOM event, and a typed data object that carries the meaningful value (`data.value`, `data.checked`, `data.open`). Prefer the data object over reading the event target.

## 7. Forms: Field is the centre of gravity

A FluentUI form is built from form controls plus `Field`. `Field` owns the label, the required indicator, the hint and the validation message, and it wires them to the control inside it so assistive technology reads them together.

- `label` supplies the visible label; `required` adds the indicator and marks the control required.
- `hint` renders persistent helper text; `validationMessage` renders the message and uses the `validationState` (`'error'`, `'warning'`, `'success'`, `'none'`) to style it.
- `orientation` switches between stacked (`vertical`) and side-by-side (`horizontal`) layouts, and `size` mirrors the control sizes.
- `Field` children may also be a render function that receives the control props, which is how you wire a non-FluentUI control into the same label/description plumbing.

Group related controls with `RadioGroup` (with `Radio` children, `layout='horizontal' | 'vertical' | 'horizontal-stacked'`), a single `Checkbox`/`Switch` per boolean, `Select` with `Option` children for short lists, and `Dropdown`/`Combobox` with `Option` (and `OptionGroup`) for longer lists. Use `MessageBar` to report the result of a submit.

## 8. Overlays, portals and feedback

- `Dialog` is modal by default; `modalType` distinguishes modal, non-modal and alert behaviour, `inertTrapFocus` keeps focus inside the surface, and `unmountOnClose` decides whether the content is destroyed when closed. Compose with `DialogTrigger` (inside `DialogActions` for the cancel path), `DialogSurface`, `DialogBody`, `DialogTitle`, `DialogContent`, `DialogActions`.
- `Menu` provides dropdowns and command menus: `MenuTrigger`, `MenuPopover`, `MenuList`, `MenuItem`, `MenuItemLink`, `MenuItemCheckbox`, `MenuItemRadio`, `MenuItemSwitch`, `MenuGroup`, `MenuGroupHeader`, `MenuDivider`, `MenuSplitGroup`.
- `Popover` is the low-level anchored surface (`PopoverTrigger` + `PopoverSurface`), while `Tooltip` is for short supplementary text and requires a `relationship` (`'label'`, `'description'`, `'inaccessible'`).
- `Drawer`, `OverlayDrawer` and `InlineDrawer` (with `DrawerHeader`, `DrawerHeaderTitle`, `DrawerHeaderNavigation`, `DrawerBody`, `DrawerFooter`) provide panel layouts.
- Feedback: `ProgressBar`, `Spinner`, `Skeleton` / `SkeletonItem` for loading, `MessageBar` / `MessageBarGroup` for inline status, `Toaster` / `Toast` for transient notifications, and `AriaLiveAnnouncer` for programmatic announcements.

Because overlays render in portals, remember the provider rules from section 3: apply styles to portals, or point `targetDocument` at the right document.

## 9. Data display and navigation at scale

- Tables: `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableHeaderCell`, `TableSelectionCell`, `TableCellLayout`, `TableCellActions`, `TableResizeHandle` for static markup; `DataGrid` and its subcomponents (`DataGridHeader`, `DataGridHeaderCell`, `DataGridBody`, `DataGridRow`, `DataGridCell`, `DataGridSelectionCell`) add sorting, selection, column sizing and virtualization-friendly rendering driven by `sortable` / `sortDirection`, `selectionMode` and `columnSizingOptions`.
- Trees: `Tree` with `TreeItem`, `TreeItemLayout`, `TreeItemPersonaLayout`, plus the flattened `FlatTree` / `FlatTreeItem` for virtualized trees.
- Identity and status: `Avatar`, `AvatarGroup`, `AvatarGroupItem`, `AvatarGroupPopover`, `Persona`, `Badge`, `CounterBadge`, `PresenceBadge`, `Tag`, `InteractionTag`, `TagGroup`.
- Navigation: `TabList` with `Tab` (`selectedValue` / `defaultSelectedValue` and `onTabSelect`), `Breadcrumb` with `BreadcrumbItem`, `BreadcrumbButton`, `BreadcrumbDivider`, `Link`, and the `Nav` family (`Nav`, `NavItem`, `NavSubItem`, `NavCategory`, `NavCategoryItem`, `NavSubItemGroup`, `NavSectionHeader`, `NavDivider`, `SplitNavItem`, `NavDrawer` and its header/body/footer, `Hamburger`, `AppItem`) with `density`, `selectedValue` and `openCategories` for application shells.

## 10. Theming, direction and styling rules

- Provide `theme` on the provider for global theming and define the object outside of render so its identity is stable. Nested providers inherit and can override theme, direction and portal behaviour for a subtree - that is how you build an RTL region or an embedded widget.
- Set `dir='rtl'` on a provider (or the root provider) for right-to-left locales; components lay themselves out accordingly.
- Style individual components with the `className` and `style` props, which flow to the root slot, or with slot-level shorthands for inner parts (`icon`, `action`, `header`, `media`, and so on).
- Never target the generated class names FluentUI produces, and avoid global CSS that redefines component internals; it will break on upgrade. For deep customisation, use the provider's override hooks instead.
- Portalled surfaces (menus, popovers, dialogs, tooltips) are attached to the document body; use `applyStylesToPortals` so they inherit provider styling.

## 11. TypeScript tips

- Import props types from the same package as the component, or derive them: `React.ComponentProps<typeof Button>`.
- Slot props are typed as slot values, so they accept an element, a shorthand object, or the shorthand content type of that slot.
- Change callbacks are overloaded with a typed data argument - annotate your handlers to get completion for `data.value`, `data.checked`, `data.open`, and similar fields.
- Component state hooks are rarely needed for regular application work; treat them as internal and start with props and composition.

## 12. Accessibility checklist

- Give every control an accessible name: a `Field` label for form controls, or `aria-label` for icon-only buttons.
- Use `Tooltip` with an explicit `relationship`; never rely on a tooltip as the only label for a control.
- Prefer `disabledFocusable` over `disabled` when users should still discover the control and its explanation.
- Let overlays manage focus, and choose `Dialog` intent deliberately (`modalType`, `inertTrapFocus`).
- Announce results with `MessageBar` (which supports `politeness`) or `AriaLiveAnnouncer` rather than rendering silent text.
- Keyboard behaviour is built in - verify it: arrow keys in `TabList`, `Menu`, `Tree`, `DataGrid` and `Breadcrumb` (`focusMode`), Escape to dismiss overlays, and Tab order that matches reading order.
- Do not encode meaning in colour alone; pair status colours (`Badge`, `MessageBar`, `ProgressBar`) with text or icons.

## 13. Troubleshooting

- **Nothing looks styled.** FluentProvider is missing, or there are two React copies / two versions of the library in the bundle, which breaks the context.
- **Menus and popovers ignore my theme.** Set `applyStylesToPortals` on the provider, or use `targetDocument` when rendering into another document.
- **A controlled dialog never closes.** You passed `open` without `onOpenChange`, so the state never updates.
- **A trigger fires twice or nests buttons.** When the child is already a `Button`, pass `disableButtonEnhancement` to `DialogTrigger`, `MenuTrigger` or `PopoverTrigger`.
- **The label is not associated with my input.** `Field` wiring applies to FluentUI controls; for a custom control use the render-function children form and spread the provided control props.
- **Tabs or menus do not respond.** You switched to a controlled API but did not handle `onTabSelect` / `onOpenChange`.

## 14. Suggested learning path

1. Get `FluentProvider` plus `Button`, `Text`, `Divider` and `Badge` on screen.
2. Build one real form with `Field`, `Input`, `Select`, `Checkbox`, `Switch`, `RadioGroup` and `MessageBar`.
3. Add one `Dialog` and one `Menu` to learn overlays and portals.
4. Compose `Card` layouts with `Avatar` and `Badge`, then add `TabList` for page structure.
5. Only then reach for `Table` / `DataGrid`, `Tree` and the `Nav` family, which have the largest prop surfaces.

## Key Takeaways

- Wrap your application exactly once in FluentProvider; it supplies theme, text direction and portal configuration to every FluentUI component below it, including overlays that render into portals.
- Import everything from the single package `@fluentui/react-components`. No CSS file import is required - component styles are generated and injected at runtime.
- Components are assembled from slots (a root plus named sub-elements). Fill a slot with a React element, plain content, or a shorthand object, and use the `as` prop on root slots when the rendered element must change.
- Every stateful component offers a controlled and an uncontrolled API. Use `default*` props for self-managed state, or the value prop plus the matching change callback (`onOpenChange`, `onChange`, `onTabSelect`, `onSelectionChange`, `onActiveIndexChange`) when state lives outside the component.
- Field is the centre of form accessibility: it owns label, required indicator, hint and validation message, and wires them to the control inside it via `validationState` and `validationMessage`.
- Prefer `disabledFocusable` over `disabled` when a control should stay keyboard reachable and explain itself (loading states, tooltips on disabled controls).
- When the child of DialogTrigger, MenuTrigger or PopoverTrigger is already a Button, pass `disableButtonEnhancement` to avoid nested buttons and double toggles.
- Style with `className` and `style` on components (and slot shorthands for inner parts), never against generated class names; use the provider's `theme`, `dir`, `targetDocument`, `applyStylesToPortals` and its override hooks for global concerns.
- Learn the library by family - buttons, forms, data display, feedback, layout, navigation, overlays, utilities - and start with `Button`, `Text`, `Field`, `Input` and `Dialog` before the large `DataGrid`, `Tree` and `Nav` surfaces.

## Examples

### Application bootstrap with FluentProvider

The minimum integration: mount React, wrap the tree in a single FluentProvider, and render your app. Everything FluentUI renders below this point inherits theme, direction and portal configuration.

```tsx
// src/main.tsx
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { FluentProvider } from '@fluentui/react-components';
import { App } from './App';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Could not find the #root element in index.html');
}

createRoot(container).render(
  <React.StrictMode>
    {/*
      One FluentProvider for the whole app.
      - no theme prop  -> the default light theme is used
      - dir            -> 'ltr' | 'rtl' for the subtree
      - applyStylesToPortals -> keeps portal content (menus, dialogs, tooltips) on-theme
    */}
    <FluentProvider applyStylesToPortals>
      <App />
    </FluentProvider>
  </React.StrictMode>,
);
```

### Application shell CSS

FluentUI v9 needs no stylesheet import. This small global file only prepares the host page so the provider can fill the viewport, and documents the rule about not targeting generated class names.

```css
/* src/index.css */

/* FluentUI v9 component styles are generated and injected at runtime.
   There is no FluentUI CSS bundle to import - this file only sets up the shell. */

html,
body,
#root {
  height: 100%;
  margin: 0;
}

#root {
  display: flex;
  flex-direction: column;
}

/* Never style against FluentUI's generated class names (for example .f1abc2de).
   Use the className and style props of the components instead, or the
   provider's customStyleHooks_unstable / overrides_unstable escape hatches. */
```

### First screen: Button, Text, Badge, Divider, Field

Demonstrates appearance and size vocabulary, the Button icon slot with a loading Spinner, disabledFocusable versus disabled, Input slot props (contentAfter) and the `as` prop on a root slot.

```tsx
// src/App.tsx
import * as React from 'react';
import {
  Badge,
  Button,
  Divider,
  Field,
  Input,
  Spinner,
  Text,
} from '@fluentui/react-components';

export const App: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    window.setTimeout(() => setIsSaving(false), 1200);
  };

  return (
    <div style={{ display: 'grid', gap: 16, padding: 24, maxWidth: 720 }}>
      <Text block size={600} weight='semibold'>
        FluentUI v9 is running
      </Text>

      <Text block>
        Every control on this page comes from the single package{' '}
        <code>@fluentui/react-components</code>.
      </Text>

      <Field
        label='Search components'
        hint='Try Button, Dialog or DataGrid.'
        size='medium'
      >
        <Input
          value={query}
          placeholder='Search...'
          onChange={(event, data) => setQuery(data.value)}
          contentAfter={
            query.length > 0 ? (
              <Badge appearance='tint' color='informative' size='small'>
                {query.length} chars
              </Badge>
            ) : null
          }
        />
      </Field>

      <Divider />

      <div style={{ display: 'flex', gap: 8 }}>
        <Button
          appearance='primary'
          disabledFocusable={isSaving}
          icon={isSaving ? <Spinner size='extra-tiny' appearance='inverted' /> : undefined}
          onClick={handleSave}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>

        <Button appearance='secondary'>Cancel</Button>

        {/* Root slots accept `as`, so the same Button can render an anchor. */}
        <Button appearance='subtle' as='a' href='https://react.fluentui.dev'>
          Documentation
        </Button>
      </div>
    </div>
  );
};
```

### A complete settings form with Field, controls and MessageBar

Shows Field wiring for label, hint, required and validation, a controlled RadioGroup, a controlled Select with Option children, Checkbox and Switch, custom submit validation, and a success MessageBar.

```tsx
// src/AccountSettingsForm.tsx
import * as React from 'react';
import {
  Button,
  Checkbox,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Option,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Text,
} from '@fluentui/react-components';

type FormErrors = {
  email?: string;
};

export const AccountSettingsForm: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [plan, setPlan] = React.useState('team');
  const [digest, setDigest] = React.useState('daily');
  const [marketing, setMarketing] = React.useState(false);
  const [beta, setBeta] = React.useState(true);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [saved, setSaved] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(false);

    const nextErrors: FormErrors = {};
    if (email.trim().length === 0) {
      nextErrors.email = 'An email address is required.';
    } else if (!email.includes('@')) {
      nextErrors.email = 'Enter an address in the format name@example.com.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // Persist the settings here.
    setSaved(true);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16, maxWidth: 520 }}>
      <Text block size={500} weight='semibold'>
        Account settings
      </Text>

      <Field
        label='Email address'
        required
        validationState={errors.email ? 'error' : 'none'}
        validationMessage={errors.email}
        hint='We use this address for security notifications only.'
      >
        <Input
          type='email'
          value={email}
          placeholder='name@example.com'
          onChange={(event, data) => setEmail(data.value)}
        />
      </Field>

      <Field label='Plan'>
        <RadioGroup
          value={plan}
          layout='horizontal'
          onChange={(event, data) => setPlan(data.value)}
        >
          <Radio value='personal' label='Personal' />
          <Radio value='team' label='Team' />
          <Radio value='enterprise' label='Enterprise' />
        </RadioGroup>
      </Field>

      <Field label='Email digest'>
        <Select value={digest} onChange={(event, data) => setDigest(data.value)}>
          <Option value='daily'>Daily</Option>
          <Option value='weekly'>Weekly</Option>
          <Option value='never' disabled>
            Never
          </Option>
        </Select>
      </Field>

      <Checkbox
        checked={marketing}
        label='Send me product announcements'
        onChange={(event, data) => setMarketing(data.checked === true)}
      />

      <Switch
        checked={beta}
        label='Join the beta channel'
        onChange={(event, data) => setBeta(data.checked)}
      />

      <div style={{ display: 'flex', gap: 8 }}>
        <Button type='submit' appearance='primary'>
          Save changes
        </Button>
        <Button type='reset' appearance='secondary'>
          Reset
        </Button>
      </div>

      {saved && (
        <MessageBar intent='success'>
          <MessageBarBody>
            <MessageBarTitle>Changes saved</MessageBarTitle>
            <div>Your account settings were updated.</div>
          </MessageBarBody>
        </MessageBar>
      )}
    </form>
  );
};
```

### A controlled Dialog with a form inside

Full Dialog composition: DialogTrigger with disableButtonEnhancement, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, controlled open state via onOpenChange, and a submit button that is disabled until the form is valid.

```tsx
// src/CreateProjectDialog.tsx
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
  Input,
  Text,
  Textarea,
} from '@fluentui/react-components';

export const CreateProjectDialog: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const close = () => setOpen(false);

  const handleCreate = () => {
    // Create the project here, then close.
    setName('');
    setDescription('');
    close();
  };

  return (
    <Dialog open={open} onOpenChange={(event, data) => setOpen(data.open)}>
      {/* The child is already a Button, so opt out of button enhancement. */}
      <DialogTrigger disableButtonEnhancement>
        <Button appearance='primary'>New project</Button>
      </DialogTrigger>

      <DialogSurface>
        <DialogBody>
          <DialogTitle>New project</DialogTitle>

          <DialogContent>
            <Field label='Project name' required hint='Shown in the workspace switcher.'>
              <Input
                value={name}
                placeholder='Contoso migration'
                onChange={(event, data) => setName(data.value)}
              />
            </Field>

            <Field label='Description'>
              <Textarea
                value={description}
                rows={3}
                resize='vertical'
                onChange={(event, data) => setDescription(data.value)}
              />
            </Field>

            <Text block size={200}>
              Projects are private until you invite teammates.
            </Text>
          </DialogContent>

          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance='secondary' onClick={close}>
                Cancel
              </Button>
            </DialogTrigger>
            <Button
              appearance='primary'
              disabled={name.trim().length === 0}
              onClick={handleCreate}
            >
              Create project
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
```

### Card composition with Avatar, Badge, Image and a Menu

Shows the Card subcomponent model (Card + CardHeader + CardPreview + CardFooter), slot props (image, header, description, action), the CardFooter action slot, and a Menu attached to a transparent icon-only Button with an accessible name.

```tsx
// src/ProjectCard.tsx
import * as React from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
  Image,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Text,
} from '@fluentui/react-components';

export interface Project {
  name: string;
  ownerName: string;
  summary: string;
  coverUrl: string;
  status: 'active' | 'paused';
}

export interface ProjectCardProps {
  project: Project;
  onOpen: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpen }) => (
  <Card appearance='outline' size='medium' style={{ maxWidth: 320 }}>
    <CardPreview>
      <Image
        block
        fit='cover'
        src={project.coverUrl}
        alt={'Cover image for ' + project.name}
        style={{ height: 96 }}
      />
    </CardPreview>

    <CardHeader
      image={<Avatar name={project.ownerName} color='colorful' />}
      header={
        <Text block truncate weight='semibold'>
          {project.name}
        </Text>
      }
      description={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge
            size='small'
            appearance='tint'
            color={project.status === 'active' ? 'success' : 'warning'}
          >
            {project.status}
          </Badge>
          <Text block size={200} truncate>
            {project.summary}
          </Text>
        </div>
      }
      action={
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button
              appearance='transparent'
              aria-label={'More actions for ' + project.name}
            >
              ...
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem onClick={onOpen}>Open</MenuItem>
              <MenuItem>Duplicate</MenuItem>
              <MenuDivider />
              <MenuItem disabled={project.status === 'active'}>Archive</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      }
    />

    <CardFooter action={<Button appearance='primary' onClick={onOpen}>Open project</Button>} />
  </Card>
);
```

### Workspace toolbar, Menu and controlled TabList

Combines Toolbar with ToolbarGroup and ToolbarDivider, Tooltip with an explicit relationship, a Menu dropdown inside the toolbar, and a controlled TabList using selectedValue plus onTabSelect.

```tsx
// src/WorkspaceTabs.tsx
import * as React from 'react';
import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Tab,
  TabList,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarGroup,
  Tooltip,
} from '@fluentui/react-components';

export const WorkspaceTabs: React.FC = () => {
  const [selected, setSelected] = React.useState<string>('overview');

  return (
    <div style={{ display: 'grid', gap: 12, padding: 16 }}>
      <Toolbar aria-label='Workspace commands'>
        <ToolbarGroup>
          <Tooltip content='Create a new item' relationship='label'>
            <ToolbarButton appearance='primary'>New</ToolbarButton>
          </Tooltip>
          <Tooltip content='Save the current view' relationship='description'>
            <ToolbarButton>Save</ToolbarButton>
          </Tooltip>
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <ToolbarButton>Export</ToolbarButton>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem>Export as CSV</MenuItem>
                <MenuItem>Export as JSON</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </ToolbarGroup>
      </Toolbar>

      <TabList
        appearance='subtle'
        selectedValue={selected}
        onTabSelect={(event, data) => setSelected(data.value as string)}
      >
        <Tab value='overview'>Overview</Tab>
        <Tab value='activity'>Activity</Tab>
        <Tab value='settings' disabled>
          Settings
        </Tab>
      </TabList>

      {/* In a real app, connect this panel to the selected tab with id / aria-controls. */}
      <div style={{ padding: 16, borderTop: '1px solid #e0e0e0' }}>
        Showing the <strong>{selected}</strong> panel.
      </div>
    </div>
  );
};
```

### Nested FluentProvider for an RTL region with a portalled Popover

Demonstrates that providers nest: dir switches the subtree to right-to-left, and applyStylesToPortals keeps the Popover (which renders outside the DOM subtree) styled by this provider rather than the root one.

```tsx
// src/EmbeddedWidget.tsx
import * as React from 'react';
import {
  Button,
  FluentProvider,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Text,
} from '@fluentui/react-components';

export const EmbeddedWidget: React.FC = () => (
  /*
    Nested providers are cheap and supported:
    - dir changes text direction for this subtree only
    - applyStylesToPortals makes overlays that render into a portal
      (popovers, menus, dialogs, tooltips, toasts) pick up this provider
      instead of the document root one
  */
  <FluentProvider dir='rtl' applyStylesToPortals>
    <div style={{ display: 'grid', gap: 12, padding: 16, maxWidth: 360 }}>
      <Text block size={400} weight='semibold'>
        Embedded widget
      </Text>

      <Text block size={200}>
        Direction and styling are scoped to this provider.
      </Text>

      <Popover withArrow positioning='below-start'>
        <PopoverTrigger disableButtonEnhancement>
          <Button appearance='primary'>Show details</Button>
        </PopoverTrigger>
        <PopoverSurface>
          <Text block>
            This surface is rendered in a portal and still inherits the
            provider styles and direction.
          </Text>
        </PopoverSurface>
      </Popover>
    </div>
  </FluentProvider>
);
```

## Pitfalls

- Forgetting FluentProvider (or rendering a component outside it) leaves components unstyled and can break overlay styling. Two copies of React or of the component library in the bundle break the context just as effectively even when the provider is present.
- Mixing v8 imports (`@fluentui/react`) with v9 imports (`@fluentui/react-components`) in the same tree produces duplicated contexts and inconsistent theming. Pick v9 and stay on it.
- Passing `open`, `value`, `checked`, `selectedValue` or `activeIndex` without the matching change handler freezes the component, because the controlled prop can never be updated. Always pair a controlled prop with `onOpenChange`, `onChange`, `onTabSelect`, `onSelectionChange` or `onActiveIndexChange`.
- Wrapping an existing Button in DialogTrigger, MenuTrigger or PopoverTrigger without `disableButtonEnhancement` nests buttons and can toggle twice or break focus.
- Using `disabled` when `disabledFocusable` is what you want: a fully disabled control is removed from the accessibility tree and will not show a tooltip, so users lose the explanation.
- Defining a `theme` object inline in a component body creates a new object identity on every render and forces the provider subtree to re-render. Define the theme once at module scope.
- Assuming a portalled overlay (menu, popover, dialog, tooltip, toast) inherits provider styles automatically. Portals attach to the document body, so set `applyStylesToPortals`, or use `targetDocument` when rendering into an iframe or another document.
- Using Tooltip without a meaningful `relationship`, or as the only label for an icon-only button. `relationship` is required and should match the semantics ('label' when it is the name, 'description' when it is supplementary).
- Styling against generated class names or overriding component internals with global CSS. These class names are not part of the API and change between builds; use `className`/`style`, slot shorthands, or the provider's `customStyleHooks_unstable` and `overrides_unstable` hooks instead.
- Reading values from the raw event when the second callback argument already carries typed data (`data.value`, `data.checked`, `data.open`), which leads to brittle handlers and lost type safety.

## Accessibility

FluentUI v9 components implement ARIA roles, keyboard interaction and focus management for you, but they cannot invent the meaning of your content - naming and semantics remain your responsibility. Give every control an accessible name: use a Field label (which is wired to the inner control together with hint and validation text) for form controls, and `aria-label` for icon-only buttons such as the overflow Menu trigger in a CardHeader. Use Tooltip with an explicit, accurate `relationship` ('label' when the tooltip is the accessible name, 'description' when it adds supplementary information, 'inaccessible' when it duplicates information available elsewhere) and never rely on a tooltip as the sole label for a control, because tooltips only appear on hover or focus and are not reliably announced. Prefer `disabledFocusable` over `disabled` when users should still be able to reach the control and understand why it is unavailable. Let overlays manage focus: Dialog is modal by default with a focus trap (tune it with `modalType` and `inertTrapFocus`), Menus and Popovers move focus and close on Escape, and Drawers keep a logical reading order. Announce dynamic results through live regions rather than silent text: MessageBar supports `politeness` ('polite' or 'assertive'), Toaster/Toast surfaces notifications, and AriaLiveAnnouncer covers arbitrary programmatic announcements. Verify keyboard behaviour rather than assuming it: arrow-key navigation in TabList, Menu, Toolbar, Tree, DataGrid and Breadcrumb (`focusMode` controls arrow versus tab behaviour in Breadcrumb), Escape to dismiss, and a tab order that matches visual order. Do not encode meaning in colour alone - pair Badge, MessageBar and ProgressBar colours with text or icons - and make sure every Image has meaningful `alt` text (or an empty alt when decorative). Finally, set `dir='rtl'` on the appropriate FluentProvider (or at the root) for right-to-left locales so both layout and keyboard semantics stay correct, and keep `size` and `appearance` consistent across a form so visual hierarchy still communicates emphasis to sighted users.

**Referenced components**: FluentProvider, Button, CompoundButton, MenuButton, SplitButton, ToggleButton, Text, Divider, Badge, CounterBadge, PresenceBadge, Avatar, AvatarGroup, AvatarGroupItem, AvatarGroupPopover, Persona, Image, Skeleton, SkeletonItem, Field, Label, InfoLabel, InfoButton, Input, Textarea, Select, Option, OptionGroup, Dropdown, Combobox, Listbox, Checkbox, Radio, RadioGroup, Switch, Slider, SpinButton, SearchBox, Rating, RatingDisplay, Spinner, ProgressBar, MessageBar, MessageBarBody, MessageBarTitle, MessageBarActions, MessageBarGroup, Dialog, DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Popover, PopoverTrigger, PopoverSurface, Menu, MenuTrigger, MenuPopover, MenuList, MenuItem, MenuDivider, MenuGroup, MenuGroupHeader, MenuItemLink, MenuItemCheckbox, MenuItemRadio, MenuItemSwitch, MenuSplitGroup, Tooltip, Toolbar, ToolbarButton, ToolbarDivider, ToolbarGroup, ToolbarToggleButton, ToolbarRadioButton, ToolbarRadioGroup, TabList, Tab, Card, CardHeader, CardPreview, CardFooter, Table, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell, TableSelectionCell, TableCellLayout, TableCellActions, TableResizeHandle, DataGrid, DataGridHeader, DataGridHeaderCell, DataGridBody, DataGridRow, DataGridCell, DataGridSelectionCell, Tree, TreeItem, TreeItemLayout, TreeItemPersonaLayout, FlatTree, FlatTreeItem, List, ListItem, Tag, TagGroup, InteractionTag, TagPicker, Nav, NavItem, NavSubItem, NavCategory, NavCategoryItem, NavSubItemGroup, NavSectionHeader, NavDivider, NavDrawer, NavDrawerHeader, NavDrawerBody, NavDrawerFooter, Hamburger, AppItem, SplitNavItem, Breadcrumb, BreadcrumbItem, BreadcrumbButton, BreadcrumbDivider, Link, Drawer, OverlayDrawer, InlineDrawer, DrawerHeader, DrawerHeaderTitle, DrawerHeaderNavigation, DrawerBody, DrawerFooter, Accordion, AccordionItem, AccordionHeader, AccordionPanel, Carousel, CarouselCard, CarouselNav, CarouselButton, Toast, Toaster, ToastTrigger, ToastTitle, ToastBody, ToastFooter, AriaLiveAnnouncer, Portal, OverflowItem, OverflowDivider

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
