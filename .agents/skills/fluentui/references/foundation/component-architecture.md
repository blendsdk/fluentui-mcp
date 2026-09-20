# Component Architecture

> **Category**: foundation

Fluent UI React v9 was rebuilt around one strict component model. `Button`, `Input`, `Dialog`, `NavItem`, `AccordionPanel` and `TeachingPopoverCarouselNavButton` are all assembled from the same four layers, use the same naming conventions, and expose the same kinds of extension points. Once you internalize the model you can predict an API you have never seen: knowing `Button` tells you most of what you need to know about `Card`, `TreeItemLayout` or `SwatchPicker`.

## 1. The four layers of every v9 component

- **Public component and props.** The named export you import from `@fluentui/react-components`, plus its documented props and slots.
- **State layer.** An internal state hook normalizes props into a plain state object: it resolves controlled vs uncontrolled values, merges event handlers, computes ARIA attributes, and decides which slots exist for this render.
- **Style layer.** A style hook maps that state onto atomic class names. You rarely call these yourself, but their names are public through `FluentProvider`'s `customStyleHooks_unstable` map: `useButtonStyles_unstable`, `useCardStyles_unstable`, `useFieldStyles_unstable`, `useDialogSurfaceStyles_unstable`, `useTreeItemLayoutStyles_unstable`, `useNavItemStyles_unstable`, and so on for nearly every part in the library.
- **Render layer.** Slots are resolved into React elements: default element + default props + caller props.

The design consequence matters more than the vocabulary: **props flow into state, and state flows into slots and class names.** So the supported ways to change a component are, in order of preference: props → slots → style hooks. Targeting generated class names in CSS is never one of them.

## 2. Slots: the unit of composition

A slot is a named, replaceable part of a component. Each slot owns:

- a **default element** (`Button.root` renders a `button`, `CardHeader.image` can render a `div` or an `img`, ...),
- **default props** contributed by the component (class names, ARIA attributes, handlers),
- a **name** that documents its role.

Slot names *are* the architecture. `Input` exposes `root, input, contentBefore, contentAfter`. `Field` exposes `root, label, validationMessage, validationMessageIcon, hint`. `MenuItem` exposes `root, icon, checkmark, submenuIndicator, content, secondaryContent, subText`. `TreeItemLayout` exposes `root, main, iconBefore, iconAfter, expandIcon, aside, actions, selector`. `CardHeader` exposes `root, image, header, description, action`. `Avatar` exposes `root, image, initials, icon, badge`. If you need to change "just the icon" or "just the badge", there is almost always a slot for it — and using it is always better than wrapping the whole component.

### The four shorthand forms

1. **React element** — `icon={<MyGlyph />}` renders the element inside the slot.
2. **Text or number** — the value becomes the slot element's children.
3. **Props object** — `icon={{ children: <MyGlyph />, className: 'myIcon' }}` is merged on top of the slot's default props, which is how you reach `className`, `style`, `id`, or extra handlers on exactly one part.
4. **`null` / `false`** — renders nothing, only where the slot is optional.

### Changing the rendered element with `as`

Most slots are constrained to a small set of elements rather than being a free-for-all. `AvatarGroupItem.root` is `Slot<'div', 'li'>` (a list item when the group is a real list), `CardHeader.image` is `Slot<'div', 'img'>`, `DrawerHeader.heading` is `Slot<'h2', 'h1' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'>`, `DialogTitle.root` is `Slot<'h2', 'h1' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'>`. Pass `as` to pick one of those elements while keeping the component's styling and behaviour: `<Text as="h2">`, `<Button as="a" href="...">`, `<DialogTitle as="h3">`.

### Required (NonNullable) slots

Some slots cannot be removed because they carry non-negotiable semantics. `NavCategoryItem.root`, `MenuButton.root`, `AvatarGroupItem.avatar`, `DrawerHeader.heading` and `TeachingPopoverHeader.root` are typed as `NonNullable<Slot<...>>`. Treat those as part of the accessibility contract: configure them, change their element with `as`, but do not try to delete them.

## 3. Compound families are state machines

Most non-trivial UI in v9 is a *family* of components that share state through React context. The leaf parts are not standalone widgets; they are declared inside their parent and read what they need from it.

- **Accordion** — `Accordion` owns `openItems`; `AccordionItem` contributes `value`/`disabled`; `AccordionHeader` and `AccordionPanel` consume that context (the panel's `open`/`disabled` state is derived, not authored by you).
- **Card** — `Card` owns selection and focus mode; `CardHeader` (`image`, `header`, `description`, `action`) and `CardFooter` (`action`) are pure layout parts.
- **Dialog** — `Dialog` owns open state and modal type; `DialogSurface`, `DialogTitle`, `DialogBody`, `DialogContent`, `DialogActions` and `DialogTrigger` all read it.
- **Menu** — `Menu` owns open/positioning; `MenuList` owns `checkedValues`, `hasCheckmarks` and `hasIcons` and pushes them to `MenuItemCheckbox`, `MenuItemRadio` and `MenuItemSwitch`.
- **Nav** — `Nav` owns selection and open categories; `NavCategory` provides `value`, `NavCategoryItem` reads it, `NavSubItemGroup` hosts `NavSubItem` leaves. `NavDrawer`, `NavDrawerHeader`, `NavDrawerBody`, `NavDrawerFooter`, `SplitNavItem`, `AppItem`, `AppItemStatic` and `Hamburger` are the drawer-shaped members of the same family.
- **Tree** — `Tree` owns `openItems`/`selectionMode`/`checkedItems`; `TreeItem` takes `itemType`/`value`/`parentValue`; `TreeItemLayout` and `TreeItemPersonaLayout` are the visual skins.
- **Tag** — `TagGroup` owns `selectedValues` and dismissal; `Tag` and `InteractionTag` (with `InteractionTagPrimary`/`InteractionTagSecondary`) are the visuals.
- **Drawer** — `InlineDrawer`, `OverlayDrawer` and `NavDrawer` share `DrawerHeader`/`DrawerBody`/`DrawerFooter`/`DrawerHeaderTitle`/`DrawerHeaderNavigation`.
- **Toast** — `Toaster` renders what `Toast`/`ToastTitle`/`ToastBody`/`ToastFooter`/`ToastTrigger` declare.
- **TeachingPopover / Carousel / DataGrid / Table / SwatchPicker** follow the same pattern.

**Corollary:** do not re-implement state that context already carries, and do not expect a leaf component to work outside its family.

## 4. Triggers and "button enhancement"

`MenuTrigger`, `PopoverTrigger`, `DialogTrigger`, `ToastTrigger` and `TeachingPopoverTrigger` exist so that a single child element can become a fully accessible trigger. By default the trigger *enhances* its child with button semantics — role, tab stop, keyboard activation — so a plain element behaves like a button. Pass `disableButtonEnhancement` when the child already handles those semantics (a Fluent `Button`, or a `Link`), which is the documented pattern for Fluent buttons.

`DialogTrigger` additionally takes an `action` (`open` / `close`), which is how a Cancel button inside `DialogActions` closes the dialog without any wiring from you. Nested interactive content is never placed inside a trigger; if a composite such as `Card` must ignore clicks that came from an inner action, use its dedicated escape hatch (`Card.shouldRestrictTriggerAction`).

## 5. Controlled and uncontrolled state

v9 standardizes the React controlled/uncontrolled convention across the library: a `default*` prop means "manage this yourself, tell me when it changes", and the un-prefixed prop means "I own this state, call this handler when the user asks for a change".

| Component | Uncontrolled | Controlled | Change callback |
| --- | --- | --- | --- |
| `Accordion` | `defaultOpenItems` | `openItems` | `onToggle` |
| `Dialog` / `Menu` / `Popover` / `Drawer` | `defaultOpen` | `open` | `onOpenChange` |
| `Checkbox` / `Switch` / `ToggleButton` | `defaultChecked` | `checked` | `onChange` |
| `Input` / `Textarea` / `Dropdown` / `RadioGroup` | `defaultValue` | `value` | `onChange` |
| `Nav` | `defaultSelectedValue`, `defaultOpenCategories`, `defaultSelectedCategoryValue` | `selectedValue`, `openCategories`, `selectedCategoryValue` | `onNavItemSelect`, `onNavCategoryItemToggle` |
| `TabList` | `defaultSelectedValue` | `selectedValue` | `onTabSelect` |
| `Tree` / `FlatTree` | `defaultOpenItems` | `openItems`, `checkedItems` | `onOpenChange` (per `TreeItem`) |
| `SwatchPicker` / `TagGroup` / `List` | `defaultSelectedValue(s)`, `defaultSelectedItems` | `selectedValue(s)`, `selectedItems` | `onSelectionChange` |
| `Carousel` | `defaultActiveIndex` | `activeIndex` | `onActiveIndexChange` |

Pick exactly one mode per component and stay there. In controlled mode nothing moves until you update state — a controlled `Dialog` with a trigger that has no `action` will not open by itself; you open it from your handler or by setting `open`.

## 6. FluentProvider: the context root

`FluentProvider` is not decoration; it is the architectural root of the app. It supplies:

- `theme` (`Partial<Theme>`) — swap it anywhere in the tree to re-theme a subtree.
- `dir` (`ltr` | `rtl`) — direction, used by layout and by portalled content.
- `targetDocument` — the document used for portal/SSR work.
- `applyStylesToPortals` — keeps class names valid for content rendered outside the provider's DOM subtree.
- `customStyleHooks_unstable` — a map from style-hook name to your own implementation (`useButtonStyles_unstable`, `useCardStyles_unstable`, ...), the supported global styling escape hatch.
- `overrides_unstable` — an additional low-level escape hatch; treat as experimental.

Overlays (`Dialog`, `Menu`, `Popover`, `Tooltip`, `OverlayDrawer`) render through portals, so their DOM lives elsewhere while React context still flows normally. Use `Portal` with `mountNode` (an `HTMLElement`, or `{ element, className }`) when the overlay must live inside a specific container of your app shell, and keep `applyStylesToPortals` on so the portal content still receives provider classes. `AriaLiveAnnouncer` and `Toaster` are the global announcer/notification hosts and belong at the same level as the provider.

## 7. Focus, keyboard and selection architecture

v9 pushes focus behaviour into declarative props so you never hand-roll keyboard handling for a composite widget:

- `focusMode` — `Card` (`off` | `no-tab` | `tab-exit` | `tab-only`), `Breadcrumb` (`arrow` | `tab`), `SwatchPicker` (`arrow` | `tab`), `DataGridCell`/`DataGridHeaderCell` (`DataGridCellFocusMode`).
- `navigationMode` — `Tree`/`FlatTree` (`tree` | `treegrid`) and `List` (`ListNavigationMode`).
- `selectionMode` — `Tree`, `FlatTree`, `List`, `DataGrid`.
- `TabList` — `selectTabOnFocus`, `reserveSelectedTabSpace`, `vertical`.
- `disabledFocusable` — `Button`, `Link`, `MenuItem`, `ToggleButton`/`Switch` families: `aria-disabled` instead of the `disabled` attribute so focus is never lost inside a composite widget.
- `inertTrapFocus` (and `modalType`, `unmountOnClose`) on `Dialog` control how focus is contained and restored.

## 8. Motion is a slot

Enter/exit animation is expressed as *slots*, never as hidden CSS. Examples: `AccordionPanel.collapseMotion`, `NavSubItemGroup.collapseMotion`, `Tree.collapseMotion`, `NavCategoryItem.expandIconMotion`, `DialogSurface.backdropMotion` and `surfaceMotion`, `OverlayDrawer.backdropMotion`/`surfaceMotion`, `Menu.surfaceMotion`, `Popover.surfaceMotion`, `ProgressBar.indeterminateMotion`. Because they are slots they can be replaced with your own presence-aware component (to honour reduced motion) or removed entirely.

## 9. Render-function children

Some families take *functions* as children so the parent keeps ownership of the data while the child only draws. `DataGridBody` takes `RowRenderFunction<TItem>`, `DataGridRow` takes `CellRenderFunction<TItem>`, `CarouselNav` and `TeachingPopoverCarouselNav` take `NavButtonRenderFunction`, `TeachingPopoverCarouselPageCount` takes a page-count render function, and `Field` accepts either a node or `(props: FieldControlProps) => React.ReactNode`. Use the function form whenever the parent must inject ids, ARIA wiring or per-item state into your markup.

## 10. Extending components without forking them

In order of preference:

1. **Props and slots.** Reach for `appearance`, `size`, `shape`, `orientation`, `layout` and slot props first — the design tokens are already wired.
2. **Slot overrides.** Pass an element or a props object to a slot (`image`, `action`, `icon`, `contentBefore`, ...) to restyle or replace one part.
3. **Element swapping.** `as` changes the rendered element for a semantic variant.
4. **Global style hooks.** `FluentProvider.customStyleHooks_unstable` lets you append classes in the component's own style pass, scoped by provider.
5. **Composition.** Wrap the component in your own component and forward `className`, `style`, refs and the rest of the props.

## 11. Checklist for authoring your own v9-style components

- Model variant markup as named slots with semantic names (`media`, `primaryText`, `actions`), and accept element, text and props-object shorthands for them.
- Keep default DOM semantics correct; use required (`NonNullable`) slots for parts that carry accessible meaning.
- Support both controlled and uncontrolled state when state matters, with the `default*` / `*` + callback convention.
- Forward `className`, `style` and ref onto the root element, and spread the rest of the props onto it.
- Own the keyboard model of any composite you build (arrow keys, Home/End, roving tab stop) instead of leaving it to consumers.
- Make motion replaceable and let the consumer opt out.
- Announce important state changes (live regions), and never duplicate accessible names that a `Tooltip`, `Field` or `Label` already provides.

## Key Takeaways

- Every v9 component follows the same four layers: public props → state normalization → style hook → slot-based render. Learn it once and you can predict unfamiliar APIs.
- Slots are the composition contract. Each named part (root, icon, label, contentBefore, addonAfter, action, ...) can take an element, text, a props object, or null, and many slots can change their element with `as`.
- Compound families share state through context; leaf parts (AccordionPanel, DialogTitle, NavSubItem, MenuItemCheckbox) are not standalone and read from their parent.
- State follows one convention everywhere: `default*` = uncontrolled, un-prefixed prop = controlled, plus a change callback (defaultOpen/open/onOpenChange, defaultSelectedValue/selectedValue, defaultChecked/checked, ...).
- FluentProvider is the architectural root: theme, dir, targetDocument, applyStylesToPortals, customStyleHooks_unstable. Portal content keeps React context but needs applyStylesToPortals for its class names.
- Accessibility is built into the architecture: required (NonNullable) slots, trigger button enhancement with disableButtonEnhancement, focusMode/navigationMode/selectionMode, disabledFocusable, inertTrapFocus, motion slots.

## Examples

### Provider shell: theme, direction, portals and the announcer

The architectural root of a v9 app: FluentProvider owns theme/dir/targetDocument/applyStylesToPortals, AriaLiveAnnouncer hosts live regions, Toaster hosts notifications, and Portal controls where overlay DOM lands.

```tsx
import * as React from 'react';
import {
  AriaLiveAnnouncer,
  FluentProvider,
  Portal,
  Toaster,
} from '@fluentui/react-components';

// Derive the theme prop type from the component itself so nothing is invented.
type FluentThemeProp = React.ComponentProps<typeof FluentProvider>['theme'];

export interface AppShellProps {
  theme?: FluentThemeProp;
  dir?: 'ltr' | 'rtl';
  children: React.ReactNode;
}

/**
 * Every cross-cutting concern lives here exactly once:
 * theme, text direction, style propagation into portals, live regions.
 */
export const AppShell: React.FC<AppShellProps> = ({ theme, dir = 'ltr', children }) => (
  <FluentProvider
    theme={theme}
    dir={dir}
    applyStylesToPortals
    targetDocument={typeof document === 'undefined' ? undefined : document}
  >
    <AriaLiveAnnouncer>
      {children}
      <Toaster />
    </AriaLiveAnnouncer>
  </FluentProvider>
);

/**
 * Overlays (Dialog, Menu, Popover, Tooltip) portal out of the React tree.
 * Portal.mountNode decides where they land while React context keeps flowing.
 */
export const PortalHost: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mountNode, setMountNode] = React.useState<HTMLDivElement | null>(null);

  return (
    <div ref={setMountNode} style={{ position: 'relative', zIndex: 1000 }}>
      <Portal mountNode={mountNode}>{children}</Portal>
    </div>
  );
};
```

### Slots in practice: element, props object, `as`, and composite parts

Shows the four slot shorthands, how `as` changes the rendered element of a slot, and how compound components (Card/CardHeader/CardPreview/CardFooter) split their markup into named slots.

```tsx
import * as React from 'react';
import {
  Avatar,
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
  Text,
} from '@fluentui/react-components';

const ChevronIcon: React.FC = () => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
    <path d="M7 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const SlotPlayground: React.FC = () => (
  <>
    {/* 1. Element shorthand: the icon slot receives a React element. */}
    <Button appearance="primary" icon={<ChevronIcon />} iconPosition="after">
      Continue
    </Button>

    {/* 2. `as` swaps the element rendered by the root slot. */}
    <Button as="a" href="https://example.com" appearance="subtle">
      Open documentation
    </Button>

    {/* 3. Props-object shorthand: extra props are merged into that slot only. */}
    <Button icon={{ children: <ChevronIcon />, className: 'myIcon' }} iconPosition="after">
      Continue
    </Button>

    {/* 4. Composite components expose their own named slots. */}
    <Card appearance="outline">
      <CardHeader
        image={<Avatar name="Ada Lovelace" />}
        header={<Text weight="semibold">Ada Lovelace</Text>}
        description={<Text size={200}>Mathematician</Text>}
        action={
          <Button appearance="subtle" aria-label="More options" icon={<ChevronIcon />} />
        }
      />
      <CardPreview>
        <img src="/preview.png" alt="" />
      </CardPreview>
      <CardFooter action={<Button appearance="primary">View profile</Button>} />
    </Card>

    {/* 5. Text keeps its typography while rendering a different element. */}
    <Text as="h2" size={500} weight="semibold">
      Section title
    </Text>
  </>
);
```

### Compound family + trigger enhancement: Menu

Demonstrates context-driven composition (Menu/MenuPopover/MenuList pushing checkedValues and hasCheckmarks to MenuItemCheckbox/MenuItemRadio) and the trigger convention: Fluent Buttons opt out with disableButtonEnhancement.

```tsx
import * as React from 'react';
import {
  Button,
  Menu,
  MenuDivider,
  MenuItem,
  MenuItemCheckbox,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@fluentui/react-components';

export const EditorMenu: React.FC = () => {
  const [checkedValues, setCheckedValues] = React.useState<Record<string, string[]>>({
    wrap: ['on'],
  });

  return (
    <Menu
      onOpenChange={(event, data) => {
        // One place to observe open/close for analytics or focus management.
        // eslint-disable-next-line no-console
        console.log('menu open:', data.open);
      }}
    >
      {/* A Fluent Button already has button semantics, so opt out of enhancement. */}
      <MenuTrigger disableButtonEnhancement>
        <Button appearance="subtle">Editor actions</Button>
      </MenuTrigger>

      <MenuPopover>
        <MenuList
          hasCheckmarks
          hasIcons
          checkedValues={checkedValues}
          onCheckedValueChange={(event, data) => setCheckedValues(data.checkedValues)}
        >
          <MenuItem>New file</MenuItem>
          <MenuItem>Open file</MenuItem>
          <MenuDivider />
          {/* MenuItemCheckbox/Radio read their state from MenuList context. */}
          <MenuItemCheckbox name="wrap" value="on">
            Word wrap
          </MenuItemCheckbox>
          <MenuItemRadio name="theme" value="light">
            Light theme
          </MenuItemRadio>
          <MenuItemRadio name="theme" value="dark">
            Dark theme
          </MenuItemRadio>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
```

### Controlled vs uncontrolled: Accordion and Dialog

One component driven by React state (Accordion with openItems/onToggle) and one left uncontrolled with trigger actions (Dialog with DialogTrigger action=open/close, inertTrapFocus, unmountOnClose).

```tsx
import * as React from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
} from '@fluentui/react-components';

const ConfirmDialog: React.FC = () => (
  /* Uncontrolled: Dialog owns its open state, triggers declare the action. */
  <Dialog inertTrapFocus unmountOnClose>
    <DialogTrigger disableButtonEnhancement>
      <Button appearance="primary">Delete file</Button>
    </DialogTrigger>

    <DialogSurface>
      <DialogBody>
        <DialogTitle>Delete this file?</DialogTitle>
        <DialogContent>This action cannot be undone.</DialogContent>
        <DialogActions>
          <DialogTrigger action="close" disableButtonEnhancement>
            <Button appearance="secondary">Cancel</Button>
          </DialogTrigger>
          <Button appearance="primary">Delete</Button>
        </DialogActions>
      </DialogBody>
    </DialogSurface>
  </Dialog>
);

export const PreferencesPanel: React.FC = () => {
  // Controlled: React state is the single source of truth for open panels.
  const [openItems, setOpenItems] = React.useState<string[]>(['general']);

  return (
    <Accordion
      multiple
      collapsible
      openItems={openItems}
      onToggle={(event, data) => setOpenItems((data.openItems as string[]) ?? [])}
    >
      <AccordionItem value="general">
        <AccordionHeader>General</AccordionHeader>
        {/* The panel's open/disabled state comes from the AccordionItem context. */}
        <AccordionPanel>
          <ConfirmDialog />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="advanced">
        <AccordionHeader>Advanced</AccordionHeader>
        <AccordionPanel>Advanced settings</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
```

### Form architecture: Field owns label, hint and validation

Field supplies the label/hint/validation slots and wires them to the control, InfoLabel adds an explanatory popover for a label, and each control keeps its own controlled value.

```tsx
import * as React from 'react';
import { Field, InfoLabel, Input, Textarea } from '@fluentui/react-components';

export const SignUpForm: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [bio, setBio] = React.useState('');

  const emailInvalid = email.length > 0 && !email.includes('@');

  return (
    <form noValidate>
      <Field
        /* The label slot accepts any node, including InfoLabel. */
        label={<InfoLabel info="We only use it for account recovery.">Email</InfoLabel>}
        required
        hint="Work or personal address"
        validationState={emailInvalid ? 'error' : 'none'}
        validationMessage={emailInvalid ? 'Enter a valid email address' : undefined}
      >
        <Input
          type="email"
          value={email}
          onChange={(event, data) => setEmail(data.value)}
        />
      </Field>

      <Field label="Short bio" orientation="vertical">
        <Textarea
          value={bio}
          resize="vertical"
          onChange={(event, data) => setBio(data.value)}
        />
      </Field>
    </form>
  );
};
```

### Nav family: context-driven selection inside a navigation shell

The Nav family in action: Nav owns selectedValue/openCategories, NavCategory provides categoryValue for NavCategoryItem, and NavSubItemGroup hosts NavSubItem leaves.

```tsx
import * as React from 'react';
import {
  Nav,
  NavCategory,
  NavCategoryItem,
  NavDivider,
  NavItem,
  NavSectionHeader,
  NavSubItem,
  NavSubItemGroup,
} from '@fluentui/react-components';

export const AppNavigation: React.FC = () => {
  const [selectedValue, setSelectedValue] = React.useState<string>('home');
  const [openCategories, setOpenCategories] = React.useState<string[]>(['settings']);

  return (
    <Nav
      multiple
      selectedValue={selectedValue}
      openCategories={openCategories}
      onNavItemSelect={(event, data) => setSelectedValue(data.value as string)}
      onNavCategoryItemToggle={() => {
        /* Category open/close is observed here; the Nav owns the state. */
      }}
    >
      <NavSectionHeader>Workspace</NavSectionHeader>

      <NavItem value="home">Home</NavItem>
      <NavItem value="files" href="/files">
        Files
      </NavItem>

      {/* NavCategory supplies the category value its items report back. */}
      <NavCategory value="settings">
        <NavCategoryItem>Settings</NavCategoryItem>
        <NavSubItemGroup>
          <NavSubItem value="profile">Profile</NavSubItem>
          <NavSubItem value="billing">Billing</NavSubItem>
        </NavSubItemGroup>
      </NavCategory>

      <NavDivider />
    </Nav>
  );
};
```

### Selection, focus modes and single-part overrides

Card selection with focusMode and an onSelectionChange handler, a Table built from TableHeader/TableBody/TableRow/TableCell with TableSelectionCell, TableCellLayout and TableCellActions, and a sortable TableHeaderCell.

```tsx
import * as React from 'react';
import {
  Avatar,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableCellActions,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell,
  Text,
} from '@fluentui/react-components';

export const SelectableCard: React.FC = () => {
  const [selected, setSelected] = React.useState(false);

  return (
    <Card
      appearance="outline"
      /* focusMode decides how the card participates in the tab sequence. */
      focusMode="tab-exit"
      selected={selected}
      onSelectionChange={(event, data) => setSelected(data.selected)}
    >
      <CardHeader header={<Text weight="semibold">Quarterly report</Text>} />
      <CardFooter>
        <Button appearance="subtle">Download</Button>
      </CardFooter>
    </Card>
  );
};

export const FilesTable: React.FC = () => {
  const [allSelected, setAllSelected] = React.useState(false);

  return (
    <Table aria-label="Files">
      <TableHeader>
        <TableRow>
          <TableSelectionCell
            type="checkbox"
            checked={allSelected}
            onClick={() => setAllSelected(value => !value)}
            aria-label="Select all files"
          />
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell sortable sortDirection="ascending">
            Size
          </TableHeaderCell>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow>
          <TableSelectionCell type="checkbox" checked={allSelected} aria-label="Select report.pdf" />
          <TableCell>
            <TableCellLayout media={<Avatar name="Report" />}>report.pdf</TableCellLayout>
            {/* TableCellActions is a single slot-driven part of the cell. */}
            <TableCellActions visible>
              <Button appearance="subtle">Open</Button>
            </TableCellActions>
          </TableCell>
          <TableCell>1.2 MB</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
```

### Global styling escape hatch with customStyleHooks_unstable

Shows how FluentProvider.customStyleHooks_unstable targets a single component's style pass (here useButtonStyles_unstable) so you can append classes globally without touching generated class names or forking the component.

```tsx
import * as React from 'react';
import { Button, FluentProvider } from '@fluentui/react-components';

type FluentThemeProp = React.ComponentProps<typeof FluentProvider>['theme'];
type CustomStyleHooks = React.ComponentProps<typeof FluentProvider>['customStyleHooks_unstable'];

/**
 * A style hook receives the state that was computed for the component
 * (including the class name produced by its own style hook) and may append
 * its own class. `compactButton` lives in your global stylesheet.
 */
const useCompactButtonStyles = (state: unknown) => {
  const buttonState = state as { className?: string };
  buttonState.className = [buttonState.className, 'compactButton'].filter(Boolean).join(' ');
};

export interface BrandedProviderProps {
  theme?: FluentThemeProp;
  children: React.ReactNode;
}

export const BrandedProvider: React.FC<BrandedProviderProps> = ({ theme, children }) => {
  const customStyleHooks_unstable: CustomStyleHooks = {
    useButtonStyles_unstable: useCompactButtonStyles,
  };

  return (
    <FluentProvider
      theme={theme}
      applyStylesToPortals
      customStyleHooks_unstable={customStyleHooks_unstable}
    >
      {children}
    </FluentProvider>
  );
};

export const Demo: React.FC<{ theme?: FluentThemeProp }> = ({ theme }) => (
  <BrandedProvider theme={theme}>
    <Button appearance="primary">Uses the custom button style hook</Button>
  </BrandedProvider>
);
```

## Pitfalls

- Styling against generated `.fui-*` class names. These are Griffel-generated artifacts that change between versions — use props, slots, or FluentProvider.customStyleHooks_unstable instead.
- Passing both `defaultX` and `X` (for example `defaultOpen` and `open`, or `defaultValue` and `value`) to the same component. Pick one mode; mixing them produces stale or frozen UI.
- Forgetting to opt out of trigger enhancement. If the child of MenuTrigger/PopoverTrigger/DialogTrigger/ToastTrigger is already a Fluent Button or a Link, pass `disableButtonEnhancement` so semantics are not applied twice.
- Trying to author state that context already owns — for example setting `open`/`disabled` on AccordionPanel or expecting NavSubItem to know its own selection. Reading from context is the contract.
- Deleting or replacing required slots (`NonNullable<Slot<...>>`) such as NavCategoryItem.root, DrawerHeader.heading or AvatarGroupItem.avatar; these carry the component's semantics. Configure them or change their element with `as`.
- Rendering portals outside the FluentProvider boundary and losing theme/direction/classes — use Portal.mountNode plus applyStylesToPortals instead of hand-managing overlay containers.
- Hand-rolling keyboard navigation inside compound families (Menus, TabList, Tree, Toolbar) and fighting the built-in roving tab stop and arrow-key handling.
- Using `disabled` where focus must be preserved inside a composite widget; `disabledFocusable` exists precisely to keep focus in the widget while marking it aria-disabled.

## Accessibility

Because accessibility is implemented inside the components, most a11y work in v9 consists of choosing the right component, the right slots, and the right props rather than writing ARIA by hand.

- Required slots encode semantics. Button-like parts are non-nullable (`NavCategoryItem.root`, `MenuButton.root`), `AvatarGroupItem.root` can be `div` or `li` (choose `li` inside a real list), and `DialogTitle.root`/`DrawerHeader.heading` can render `h1`–`h6` or `div` — pick the heading level that matches your page outline before falling back to `div`.
- Triggers: enhancement converts a non-button child into something with button role, tab stop and keyboard activation; `disableButtonEnhancement` should be used when the child is already a `Button` or a `Link` so semantics and event handling are not duplicated.
- Focus containment and restoration: `Dialog` exposes `modalType`, `inertTrapFocus` and `unmountOnClose`; `DialogTrigger` with `action="close"` gives every action row a correctly wired dismissal path.
- Live regions: `AriaLiveAnnouncer` hosts app-level announcements, `MessageBar` takes `politeness` (`polite`/`assertive`), `Toaster` takes `announce`, and `Carousel` accepts an `announcement` function so slide changes are spoken.
- Keyboard and focus models are declarative: `focusMode` (`Card`, `Breadcrumb`, `SwatchPicker`, `DataGridCell`), `navigationMode` (`Tree`/`FlatTree` tree vs treegrid), `selectionMode`, `TabList.selectTabOnFocus`, and `disabledFocusable` to keep focus inside composite widgets.
- Labelling: `Field` (with its `label`, `hint`, `validationMessage` slots) and `InfoLabel` keep labels, hints and errors programmatically associated with the control; the `Field` children render function exists to receive those wiring props. Icon-only Buttons and selection cells (for example `TableSelectionCell` checkboxes) still need an `aria-label`.
- Tooltips require an explicit `relationship` (`label`, `description`, or `inaccessible`) — decide whether the tooltip is the accessible name or the description and never duplicate an existing name.
- Motion lives in replaceable slots (`collapseMotion`, `backdropMotion`, `surfaceMotion`, `expandIconMotion`, `indeterminateMotion`), which makes it possible to swap in reduced-motion-aware implementations without touching component internals.

**Referenced components**: FluentProvider, Portal, AriaLiveAnnouncer, Toaster, Button, Card, CardHeader, CardPreview, CardFooter, Avatar, Text, Menu, MenuTrigger, MenuPopover, MenuList, MenuItem, MenuItemCheckbox, MenuItemRadio, MenuDivider, Dialog, DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Accordion, AccordionItem, AccordionHeader, AccordionPanel, Field, Input, Textarea, InfoLabel, Label, Nav, NavItem, NavCategory, NavCategoryItem, NavSubItem, NavSubItemGroup, NavDivider, NavSectionHeader, NavDrawer, NavDrawerHeader, NavDrawerBody, NavDrawerFooter, SplitNavItem, AppItem, AppItemStatic, Hamburger, Table, TableHeader, TableRow, TableHeaderCell, TableBody, TableCell, TableCellLayout, TableCellActions, TableSelectionCell, TabList, Tree, TreeItem, TreeItemLayout, TreeItemPersonaLayout, TagGroup, Tag, InteractionTag, InteractionTagPrimary, InteractionTagSecondary, Drawer, InlineDrawer, OverlayDrawer, DrawerHeader, DrawerBody, DrawerFooter, DrawerHeaderTitle, DrawerHeaderNavigation, Toast, ToastTitle, ToastBody, ToastFooter, ToastTrigger, Popover, PopoverTrigger, PopoverSurface, Tooltip, Toast, ProgressBar, Carousel, CarouselNav, DataGrid, DataGridBody, DataGridRow, DataGridCell, SwatchPicker, OverflowItem, OverflowDivider, Toolbar, ToolbarGroup, TeachingPopover, TeachingPopoverTrigger, TeachingPopoverCarouselNav, TeachingPopoverCarouselPageCount, Badge, MenuButton, Link

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
