# Common Patterns Cheatsheet

> **Category**: quick-reference

**One import for everything:** `import { Button, Field, Input } from '@fluentui/react-components';`
**Every callback is `(event, data)`** — read new state from `data`, never from `event.target`.

## The 6 patterns you reuse everywhere

| # | Pattern | Canonical shape |
|---|---------|-----------------|
| 1 | **Provider at the root** | `<FluentProvider theme={…} dir="ltr">` |
| 2 | **Compound components** | `Parent > Trigger/Item/Surface > Content` (Dialog, Menu, Card, Table, Tree, Nav, Toast…) |
| 3 | **Controlled XOR uncontrolled** | `value` + `onChange` **or** `defaultValue` — never both |
| 4 | **Field wraps any control** | `<Field label hint validationMessage>{control}</Field>` |
| 5 | **Overlays portal out of the tree** | Trigger + Surface; theme follows with `applyStylesToPortals` |
| 6 | **Slots for sub-parts** | `icon`, `contentBefore`, `header`, `action`, `root` |

---

## 1. Provider & theming

| `FluentProvider` prop | Use |
|---|---|
| `theme` | Light/dark/partial theme object (e.g. `webLightTheme`, `webDarkTheme`) |
| `dir` | `'ltr' \| 'rtl'` — flips every logical style |
| `targetDocument` | Render into another `Document` (iframes, popups) |
| `applyStylesToPortals` | Portalled Dialog/Menu/Popover/Tooltip/Toaster inherit theme + dir (default `true`) |
| `overrides_unstable` | Nested-provider overrides |
| `customStyleHooks_unstable` | Per-component style hooks (`useButtonStyles_unstable`, `useDialogSurfaceStyles_unstable`, …) |

Related utilities: `Portal` (manual portal, `mountNode`), `AriaLiveAnnouncer` (screen-reader messages).

---

## 2. Controlled vs uncontrolled — the universal triads

### 2a. Open / visibility state

| Component | Controlled | Uncontrolled | Callback |
|---|---|---|---|
| `Dialog`, `Drawer`, `Popover`, `Menu`, `Dropdown`, `TagPicker`, `TreeItem` | `open` | `defaultOpen` | `onOpenChange` |
| `Accordion` | `openItems` | `defaultOpenItems` | `onToggle` (data: `openItems`) |
| `Tree` | `openItems` | `defaultOpenItems` | `TreeItem` `onOpenChange` |
| `Nav` | `openCategories` | `defaultOpenCategories` | `onNavCategoryItemToggle` |
| `Carousel` | `activeIndex` | `defaultActiveIndex` | `onActiveIndexChange` |
| `Tooltip` | `visible` | — | `onVisibleChange` |

### 2b. Value / selection state

| Component | Controlled | Uncontrolled | Callback | `data` field |
|---|---|---|---|---|
| `Input`, `Textarea`, `Select`, `SearchBox` | `value` | `defaultValue` | `onChange` | `data.value` |
| `Dropdown`, `Combobox` | `value` | `defaultValue` | `onOpenChange` | `data.open` |
| `Checkbox`, `Switch` | `checked` | `defaultChecked` | `onChange` | `data.checked` |
| `RadioGroup`, `Radio` | `value` | `defaultValue` | `onChange` | `data.value` |
| `Slider`, `SpinButton` | `value` | `defaultValue` | `onChange` | `data.value` / `data.displayValue` |
| `Rating` | `value` | `defaultValue` | `onChange` | `data.value` |
| `TabList` | `selectedValue` | `defaultSelectedValue` | `onTabSelect` | `data.value` |
| `List` | `selectedItems` | `defaultSelectedItems` | `onSelectionChange` | `data.selectedItems` |
| `Card` | `selected` | `defaultSelected` | `onSelectionChange` | `data.selected` |
| `Nav` | `selectedValue` | `defaultSelectedValue` | `onNavItemSelect` | `data.value` |
| `TagGroup` | `selectedValues` | `defaultSelectedValues` | `onTagSelect` | `data.value` |
| `SwatchPicker` | `selectedValue` | `defaultSelectedValue` | `onSelectionChange` | `data.value` |
| `MenuList`, `Toolbar` | `checkedValues` | `defaultCheckedValues` | `onCheckedValueChange` | `data.name` + `data.checkedItems` |
| `ColorPicker` | `color` | — | `onColorChange` | `data.color` |
| `ColorArea`, `ColorSlider` | `color` | `defaultColor` | `onChange` | `data.color` |

---

## 3. Slots & shorthand props

Every component exposes a **`root` slot** (change element via the root slot's `as`, e.g. `Slot<'div', 'li'>`); named slots are set either by **prop shorthand** or by **JSX children**.

| Component | Slots |
|---|---|
| `Button` / `MenuButton` / `SplitButton` | `root`, `icon` (`menuButton`, `primaryActionButton` for split) |
| `Input` | `root`, `input`, `contentBefore`, `contentAfter` |
| `Textarea` | `root`, `textarea` |
| `Select` | `root`, `select`, `icon` |
| `Field` | `root`, `label`, `validationMessage`, `validationMessageIcon`, `hint` |
| `InfoLabel` | `root`, `label`, `infoButton` |
| `CardHeader` | `root`, `image`, `header`, `description`, `action` |
| `CardPreview` | `root`, `logo` |
| `CardFooter` | `root`, `action` |
| `DialogTitle` | `root`, `action` |
| `DialogSurface` | `root`, `backdrop`, `backdropMotion` |
| `Tag` | `root`, `media`, `icon`, `primaryText`, `secondaryText`, `dismissIcon` |
| `TreeItemLayout` | `root`, `main`, `iconBefore`, `iconAfter`, `expandIcon`, `aside`, `actions`, `selector` |
| `AvatarGroupPopover` | `root`, `triggerButton`, `content`, `popoverSurface`, `tooltip` |
| `TableCellLayout` | `root`, `media`, `main`, `description`, `content` |
| `DrawerHeaderTitle` | `root`, `heading`, `action` |

```tsx
<Input contentBefore={<Text>$</Text>} contentAfter={<Button appearance="subtle">Go</Button>} />
<CardHeader header={<Text weight="semibold">Title</Text>} action={<Button icon="…" />} />
```

---

## 4. Forms: `Field` + control (the standard pattern)

| `Field` prop | Values |
|---|---|
| `orientation` | `vertical` (default) \| `horizontal` |
| `validationState` | `none` \| `error` \| `warning` \| `success` |
| `required` | `boolean` (adds indicator) |
| `size` | `small` \| `medium` \| `large` |
| `children` | `ReactNode` **or** `(FieldControlProps) => ReactNode` (render-function gets generated `id`, `name`, `required`, `aria-describedby`) |

**Field is presentation-only** — it never owns the value; the control does. Group radios with `RadioGroup` (`layout`: `vertical` \| `horizontal` \| `horizontal-stacked`).

---

## 5. Overlay matrix

| Overlay | Trigger | Surface / structure | Control | Portal | Notable props |
|---|---|---|---|---|---|
| **Dialog** | `DialogTrigger` (or your own button) | `DialogSurface` → `DialogBody` → `DialogTitle` + `DialogContent` + `DialogActions` | `open`/`defaultOpen`/`onOpenChange` | ✅ | `modalType`, `unmountOnClose`, `inertTrapFocus`, `DialogActions position="start"\|"center"\|"end"`, `Trigger action="open"\|"close"` |
| **Drawer** | your own `Button` | `OverlayDrawer` (backdrop + portal) / `InlineDrawer` (in-flow) → `DrawerHeader` (`DrawerHeaderTitle`, `DrawerHeaderNavigation`), `DrawerBody`, `DrawerFooter` | `open`/`defaultOpen`/`onOpenChange` | Overlay only | `separator`, `type="inline" \| "overlay"` |
| **Menu** | `MenuTrigger` (+ `disableButtonEnhancement`) | `MenuPopover` → `MenuList` | `open`/`defaultOpen`/`onOpenChange` | ✅ | `openOnHover`, `openOnContext`, `hoverDelay`, `persistOnItemClick`, `closeOnScroll`, `positioning`, `inline` |
| **Popover** | `PopoverTrigger` | `PopoverSurface` | `open`/`defaultOpen`/`onOpenChange` | ✅ | `openOnHover`, `mouseLeaveDelay`, `withArrow`, `positioning`, `trapFocus`/`inertTrapFocus`, `closeOnScroll`, `size`, `appearance` |
| **Tooltip** | wraps its child (no trigger component) | — | `visible` / `onVisibleChange` | ✅ | **`relationship` is required** (`label` \| `description` \| `inaccessible`), `withArrow`, `showDelay`, `hideDelay` |
| **Toast** | `ToastTrigger` (inside a `Toast` slot) | `Toaster` → `Toast` → `ToastTitle` / `ToastBody` / `ToastFooter` | conditional render | ✅ | `announce`, `politeness`, `intent`, `inline` |

**Trigger defaults:** `DialogTrigger` auto-detects context — `action="open"` outside the surface, `close` inside. `PopoverTrigger`/`MenuTrigger` render their child as the trigger and forward refs.

---

## 6. Compound component map

| Family | Composition |
|---|---|
| **Accordion** | `Accordion` → `AccordionItem value` → `AccordionHeader` + `AccordionPanel` |
| **Card** | `Card` → `CardHeader` / `CardPreview` / `CardFooter` |
| **Dialog** | see §5 |
| **Drawer** | see §5 |
| **Menu** | `MenuTrigger` + `MenuPopover` → `MenuList` → `MenuItem`, `MenuItemCheckbox`, `MenuItemRadio`, `MenuItemLink`, `MenuItemSwitch`, `MenuDivider`, `MenuGroup` + `MenuGroupHeader`, `MenuSplitGroup` |
| **Nav** | `Nav` → `NavItem`, `NavCategory` → `NavCategoryItem` + `NavSubItemGroup` → `NavSubItem`; also `NavSectionHeader`, `NavDivider`, `SplitNavItem`; drawer form: `NavDrawer` → `NavDrawerHeader`/`NavDrawerBody`/`NavDrawerFooter`; app-level: `AppItem`, `AppItemStatic`, `Hamburger` |
| **Popover** | `Popover` + `PopoverTrigger` + `PopoverSurface` |
| **Table** | `Table` → `TableHeader` → `TableRow` → `TableHeaderCell` (`sortable`, `sortDirection`); `TableBody` → `TableRow` → `TableCell` → `TableCellLayout`, `TableCellActions`; plus `TableSelectionCell`, `TableResizeHandle` |
| **DataGrid** | data-driven `Table`: `DataGrid` + `DataGridHeader`/`DataGridHeaderCell` + `DataGridBody`/`DataGridRow`/`DataGridCell`/`DataGridSelectionCell` with render-function children `{({ item }) => …}` |
| **Tree** | `Tree` → `TreeItem itemType` → `TreeItemLayout` (or `TreeItemPersonaLayout`) + nested `Tree`; virtualized: `FlatTree` + `FlatTreeItem` |
| **Tag / TagPicker** | `Tag`, `InteractionTag` → `InteractionTagPrimary` + `InteractionTagSecondary`, `TagGroup`; `TagPicker` → `TagPickerControl` → `TagPickerGroup` + `TagPickerInput` / `TagPickerButton`, `TagPickerList` → `TagPickerOption` / `TagPickerOptionGroup` |
| **Toolbar** | `Toolbar` → `ToolbarGroup`, `ToolbarDivider`, `ToolbarButton`, `ToolbarToggleButton`, `ToolbarRadioButton` (+ `ToolbarRadioGroup`) |
| **MessageBar** | `MessageBar` → `MessageBarBody` (`MessageBarTitle`, actions slot) + `MessageBarActions`; stacking: `MessageBarGroup` |
| **Avatar group** | `AvatarGroup` → `AvatarGroupItem` + `AvatarGroupPopover` (overflow) |
| **SwatchPicker** | `SwatchPicker` → `SwatchPickerRow` + `ColorSwatch` / `ImageSwatch` / `EmptySwatch` |
| **Color** | `ColorPicker`, `ColorArea`, `ColorSlider`, `AlphaSlider`, `ColorSwatch` |
| **Carousel** | `Carousel` → `CarouselViewport` → `CarouselSlider` → `CarouselCard`; nav: `CarouselNavContainer` (`next`/`prev`/`autoplay` slots) → `CarouselNav` (`index => <CarouselNavButton />`) + `CarouselButton navType` + `CarouselAutoplayButton` |
| **TeachingPopover** | `TeachingPopoverTrigger` + `TeachingPopoverSurface` → `TeachingPopoverHeader`/`Title`/`Body`/`Footer` (+ `TeachingPopoverCarousel*`) |

---

## 7. Collections & selection

| Concept | Values | Where |
|---|---|---|
| `selectionMode` | `none` \| `single` \| `multiselect` | `List`, `Tree`, `FlatTree`, `DataGrid`, `Table` |
| `focusMode` | `off` \| `no-tab` \| `tab-exit` \| `tab-only` (Card) · `arrow` \| `tab` (Breadcrumb, SwatchPicker) | navigation inside a composite |
| `navigationMode` | `tree` \| `treegrid` (Tree/FlatTree) · list navigation mode on `List` | keyboard model |
| Menu/Toolbar checkable state | `checkedValues: Record<string, string[]>` + `name`/`value` on each item | `MenuList`, `Toolbar` |
| `List` | `selectionMode` + `selectedItems`/`onSelectionChange` + `ListItem value` (`disabledSelection`) | listbox-style pickers |

---

## 8. Data display quick reference

| Component | Key props |
|---|---|
| `Table` / `DataGrid` | `sortable` + `sortDirection` on `TableHeaderCell`; selection via `TableSelectionCell` (`type="checkbox" \| "radio"`, `checked` accepts `'mixed'`); DataGrid adds `onSortChange`, `onSelectionChange`, `selectionMode`, `columnSizingOptions`, `onColumnResize`, `containerWidthOffset`, `resizableColumnsOptions` |
| `Tree` / `FlatTree` | `appearance`, `size`, `openItems`/`defaultOpenItems`, `selectionMode`, `checkedItems`; `FlatTreeItem` needs `value` + `aria-level`/`aria-setsize`/`aria-posinset` |
| `Persona` | `name`, `size`, `textPosition`, `textAlignment`, `presenceOnly` |
| `Avatar` / `AvatarGroup` | `name`, `size`, `shape`, `color`, `active`, `activeAppearance`, `idForColor`; group `layout`: `spread` \| `stack` \| `pie` |
| `Badge` / `CounterBadge` / `PresenceBadge` | Badge `appearance`/`color`/`shape`/`size`/`iconPosition`; CounterBadge `count`, `overflowCount`, `dot`, `showZero`; PresenceBadge `status`, `outOfOffice` |
| `Text` | `size` (100–1000), `weight`, `font`, `truncate`, `block`, `italic`, `underline`, `strikethrough`, `align`, `wrap` |
| `Image` | `fit`, `shape`, `bordered`, `block`, `shadow` |
| `Divider` | `vertical`, `appearance`, `inset`, `alignContent` |
| `Skeleton` / `SkeletonItem` | `animation` (`wave` \| `pulse`), `appearance`, `width`, `size`, `shape` |

---

## 9. Feedback & loading

| Component | Pattern |
|---|---|
| `Spinner` | `size`, `appearance`, `labelPosition`, `delay` (avoid flicker on fast loads) |
| `ProgressBar` | controlled `value` + `max`, `color`, `shape`, `thickness`; omit `value` for indeterminate |
| `MessageBar` | `intent` (info/error/…), `politeness` (`polite` \| `assertive`), `shape`; `MessageBarBody` + `MessageBarTitle` + `MessageBarActions`; stack with `MessageBarGroup` (`animate="exit-only" \| "both"`) |
| `Toast` | `Toaster` at the app root + a `Toast` per message; slot in `ToastTrigger` for undo/action buttons |
| `AriaLiveAnnouncer` | announce dynamic text changes to screen readers |

---

## 10. Prop vocabulary (same name → same meaning everywhere)

| Prop | Values | Seen on |
|---|---|---|
| `appearance` | `filled` \| `filled-alternative` \| `outline` \| `subtle` (Card/Tag/Tree) · `filled` \| `ghost` \| `outline` \| `tint` (Badge) · `secondary` \| `primary` \| `outline` \| `subtle` \| `transparent` (Button) · `outline` \| `underline` \| `filled-darker` \| `filled-lighter` (Input/Select/Dropdown) | surfaces & emphasis |
| `size` | `small` \| `medium` \| `large` (most) · `extra-small`→`extra-large` (Badge, Avatar, Spinner, Tag) | density |
| `shape` | `rounded` \| `circular` \| `square` | Button, Badge, Avatar, Tag, SwatchPicker |
| `color` | `brand` \| `danger` \| `important` \| `informative` \| `severe` \| `subtle` \| `success` \| `warning` (Badge) · `brand` \| `marigold` \| `neutral` (Rating) | semantics |
| `disabled` vs `disabledFocusable` | `disabled` removes from tab order; `disabledFocusable` stays focusable (keeps a `Tooltip` reachable) | Button, MenuItem, Link |
| `positioning` | `PositioningShorthand` e.g. `"below-start"`, `"above-end"` | Popover, Menu, Tooltip, Dropdown |
| `position` | `start` \| `center` \| `end` | DialogActions, Breadcrumb, CardHeader |

---

## 11. Accessibility one-liners

- `Tooltip` requires `relationship`: use `label` when the tooltip *is* the label (icon-only buttons), `description` otherwise.
- Icon-only buttons need `aria-label`; `DialogSurface` traps focus — keep `DialogTitle` for the accessible name.
- `Table`/`Tree`/`Nav`/`List` accept `aria-label`; rows use `aria-selected` for selection state.
- RTL comes free from `FluentProvider dir="rtl"`; use `targetDocument` for portals in iframes.

---

## 12. Top mistakes at a glance

| ❌ Don't | ✅ Do |
|---|---|
| Pass `value` **and** `defaultValue` | Pick one; controlled means you own updates in `onChange` |
| Read `event.target.value` | Use `data.value` / `data.checked` / `data.selectedItems` |
| Forget `onOpenChange` on controlled overlays | `open={x} onOpenChange={(_, d) => setOpen(d.open)}` |
| Use `disabled` on a button that must show a tooltip | `disabledFocusable` |
| Put `PopoverSurface`/`MenuPopover` outside their parent | Triggers + surfaces are context-linked siblings |
| Wrap an input in a `Field` and also render your own `Label` | Let `Field` render label/hint/validation |

## Key Takeaways

- Wrap the app once in FluentProvider (theme, dir, targetDocument, applyStylesToPortals) — portalled overlays inherit styling from it.
- Every stateful component follows the same triad: value + onChange (controlled) OR defaultValue (uncontrolled); open state is open/defaultOpen/onOpenChange.
- All callbacks are (event, data) — read data.value, data.checked, data.open, data.selectedItems, data.checkedItems instead of touching the DOM event.
- Complex UI is always compound: Dialog (Trigger/Surface/Body/Title/Content/Actions), Menu (Trigger/Popover/List/Items), Card (Header/Preview/Footer), Table, Tree, Nav, Toast (Toaster/Toast/Title/Body/Footer/Trigger).
- Field is presentation-only and wraps any control to supply label, hint and validationState/validationMessage — it never owns the input value.
- Named slots (icon, contentBefore, contentAfter, header, description, action, media, primaryText…) can be passed as shorthand props, and every component has an overridable root slot.
- Selection is normalized across families: selectionMode 'none' | 'single' | 'multiselect' for List/Tree/DataGrid/Table, checkedValues: Record<string, string[]> for Menu/Toolbar checkable items.
- Tooltip.relationship ('label' | 'description' | 'inaccessible') is required and determines the accessible name vs description of the trigger.

## Examples

### App shell: FluentProvider, theme and dir

Wrap the whole app once; every component below inherits theme, direction, and portal styling.

```tsx
import * as React from 'react';
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';

export const App = () => {
  const [dark, setDark] = React.useState(false);

  return (
    <FluentProvider
      theme={dark ? webDarkTheme : webLightTheme}
      dir="ltr"
      applyStylesToPortals
    >
      <Shell onToggleTheme={() => setDark(d => !d)} />
    </FluentProvider>
  );
};
```

### Form pattern: Field + controlled / uncontrolled controls

Field owns label, hint and validation; the input owns the value. The render-function child gets generated a11y ids.

```tsx
import * as React from 'react';
import { Button, Field, Input, Select } from '@fluentui/react-components';

export const ProfileForm = () => {
  const [name, setName] = React.useState('');
  const invalid = name.length > 0 && name.length < 3;

  return (
    <form onSubmit={e => e.preventDefault()}>
      {/* controlled */}
      <Field
        label="Name"
        required
        hint="At least 3 characters"
        validationState={invalid ? 'error' : 'none'}
        validationMessage={invalid ? 'Name is too short' : undefined}
      >
        <Input value={name} onChange={(_, data) => setName(data.value)} />
      </Field>

      {/* render-function child: FieldControlProps wires id / aria-describedby */}
      <Field label="Email" orientation="horizontal">
        {fieldProps => <Input {...fieldProps} type="email" />}
      </Field>

      {/* uncontrolled */}
      <Field label="Role" required>
        <Select defaultValue="dev">
          <option value="dev">Developer</option>
          <option value="pm">Product manager</option>
        </Select>
      </Field>

      <Button type="submit" appearance="primary">Save</Button>
    </form>
  );
};
```

### Dialog: controlled open state + trigger actions

DialogBody groups DialogTitle / DialogContent / DialogActions. DialogTrigger auto-selects open/close by context.

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
} from '@fluentui/react-components';

export const ConfirmDialog = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <DialogTrigger disableButtonEnhancement action="open">
        <Button appearance="primary">Delete</Button>
      </DialogTrigger>

      <Dialog
        open={open}
        onOpenChange={(_, data) => setOpen(data.open)}
        modalType="modal"
        unmountOnClose
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Delete this file?</DialogTitle>
            <DialogContent>This action cannot be undone.</DialogContent>
            <DialogActions position="end">
              <DialogTrigger disableButtonEnhancement action="close">
                <Button appearance="secondary">Cancel</Button>
              </DialogTrigger>
              <Button appearance="primary" onClick={() => setOpen(false)}>Delete</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
};
```

### Menu with checkable items (checkedValues)

MenuList stays controlled via checkedValues; each MenuItemCheckbox declares name + value and reports through onCheckedValueChange.

```tsx
import * as React from 'react';
import {
  Button,
  Menu,
  MenuItem,
  MenuItemCheckbox,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@fluentui/react-components';

export const ViewMenu = () => {
  const [checkedValues, setCheckedValues] = React.useState<Record<string, string[]>>({ view: ['grid'] });

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button>View</Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList
          hasCheckmarks
          checkedValues={checkedValues}
          onCheckedValueChange={(_, data) =>
            setCheckedValues(prev => ({ ...prev, [data.name]: data.checkedItems }))
          }
        >
          <MenuItemCheckbox name="view" value="grid">Grid</MenuItemCheckbox>
          <MenuItemCheckbox name="view" value="list">List</MenuItemCheckbox>
          <MenuItem>Reset</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
```

### Popover (hover) + Tooltip (relationship)

Popover for rich content, Tooltip for short text. Tooltip’s relationship prop is required and drives the accessible name/description.

```tsx
import {
  Button,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Text,
  Tooltip,
} from '@fluentui/react-components';

export const HoverDetails = () => (
  <>
    {/* icon-only button: tooltip IS the label */}
    <Tooltip content="Copies the link" relationship="label" withArrow showDelay={200}>
      <Button aria-label="Copy link" />
    </Tooltip>

    <Popover openOnHover mouseLeaveDelay={300} withArrow positioning="below-start">
      <PopoverTrigger disableButtonEnhancement>
        <Button>Details</Button>
      </PopoverTrigger>
      <PopoverSurface>
        <Text>Hover content — keep it non-interactive.</Text>
      </PopoverSurface>
    </Popover>
  </>
);
```

### Toast with an undo action (declarative)

Render Toaster once at app root; a ToastTrigger placed inside a Toast slot auto-wires to that toast’s dismiss action.

```tsx
import * as React from 'react';
import { Button, Toast, ToastBody, ToastTitle, Toaster, ToastTrigger } from '@fluentui/react-components';

export const SaveWithUndo = () => {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <Button appearance="primary" onClick={() => setVisible(true)}>Save</Button>

      <Toaster>
        {visible && (
          <Toast>
            <ToastTitle
              action={
                <ToastTrigger>
                  <Button appearance="transparent">Undo</Button>
                </ToastTrigger>
              }
            >
              Changes saved
            </ToastTitle>
            <ToastBody subtitle="Autosave">Your document was saved just now.</ToastBody>
          </Toast>
        )}
      </Toaster>
    </>
  );
};
```

### Table: sortable header + row selection

Table is the markup-first data pattern: TableHeaderCell handles sorting, TableSelectionCell accepts true | false | 'mixed'.

```tsx
import * as React from 'react';
import {
  Table, TableBody, TableCell, TableCellLayout, TableHeader, TableHeaderCell,
  TableRow, TableSelectionCell,
} from '@fluentui/react-components';

const rows = [{ id: '1', name: 'report.pdf' }, { id: '2', name: 'budget.xlsx' }];

export const FileTable = () => {
  const [sort, setSort] = React.useState<'ascending' | 'descending'>('ascending');
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const allChecked = selected.size === 0 ? false : selected.size === rows.length ? true : 'mixed';

  return (
    <Table aria-label="Files">
      <TableHeader>
        <TableRow>
          <TableSelectionCell
            type="checkbox"
            checked={allChecked}
            onClick={() => setSelected(selected.size ? new Set() : new Set(rows.map(r => r.id)))}
          />
          <TableHeaderCell
            sortable
            sortDirection={sort}
            onClick={() => setSort(s => (s === 'ascending' ? 'descending' : 'ascending'))}
          >
            Name
          </TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row.id} aria-selected={selected.has(row.id)} onClick={() => toggle(row.id)}>
            <TableSelectionCell type="checkbox" checked={selected.has(row.id)} />
            <TableCell>
              <TableCellLayout>{row.name}</TableCellLayout>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

### Selectable Card with restricted triggers

focusMode controls how the card participates in tab order; shouldRestrictTriggerAction keeps inner buttons from toggling selection.

```tsx
import * as React from 'react';
import {
  Button, Card, CardFooter, CardHeader, CardPreview, Text,
} from '@fluentui/react-components';

export const SelectableCard = () => {
  const [selected, setSelected] = React.useState(false);

  return (
    <Card
      appearance="filled-alternative"
      focusMode="tab-exit"
      selected={selected}
      onSelectionChange={(_, data) => setSelected(data.selected)}
      shouldRestrictTriggerAction={event =>
        event.target instanceof HTMLElement && Boolean(event.target.closest('button'))
      }
    >
      <CardHeader
        header={<Text weight="semibold">Quarterly report</Text>}
        description={<Text size={200}>Updated 2 days ago</Text>}
        action={<Button appearance="subtle">Open</Button>}
      />
      <CardPreview />
      <CardFooter action={<Button appearance="primary">Download</Button>}>
        <Text size={200}>PDF · 2.4 MB</Text>
      </CardFooter>
    </Card>
  );
};
```

### Adaptive navigation: Nav inline + NavDrawer in an OverlayDrawer

Share one items fragment between the desktop Nav and the mobile NavDrawer; selection state lives on Nav.

```tsx
import * as React from 'react';
import {
  Button, DrawerBody, DrawerHeader, DrawerHeaderTitle, Nav, NavCategory,
  NavCategoryItem, NavDrawer, NavDrawerBody, NavItem, NavSubItem, NavSubItemGroup,
  OverlayDrawer,
} from '@fluentui/react-components';

const items = (
  <>
    <NavItem value="home">Home</NavItem>
    <NavCategory value="settings">
      <NavCategoryItem>Settings</NavCategoryItem>
      <NavSubItemGroup>
        <NavSubItem value="profile">Profile</NavSubItem>
        <NavSubItem value="billing">Billing</NavSubItem>
      </NavSubItemGroup>
    </NavCategory>
  </>
);

export const AppShellNav = () => {
  const [page, setPage] = React.useState('home');
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* desktop */}
      <Nav
        selectedValue={page}
        onNavItemSelect={(_, data) => setPage(data.value)}
        defaultOpenCategories={['settings']}
      >
        {items}
      </Nav>

      {/* mobile */}
      <OverlayDrawer open={open} onOpenChange={(_, data) => setOpen(data.open)}>
        <DrawerHeader>
          <DrawerHeaderTitle action={<Button appearance="subtle" onClick={() => setOpen(false)}>Close</Button>}>
            Navigation
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          <NavDrawer>
            <NavDrawerBody>{items}</NavDrawerBody>
          </NavDrawer>
        </DrawerBody>
      </OverlayDrawer>
    </>
  );
};
```

### Accordion: multiple + collapsible

Accordion is controlled by openItems/defaultOpenItems; each AccordionItem needs a unique value.

```tsx
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from '@fluentui/react-components';

<Accordion
  multiple
  collapsible
  defaultOpenItems={['shipping']}
  onToggle={(_, data) => console.log(data.openItems)}
>
  <AccordionItem value="shipping">
    <AccordionHeader size="medium" expandIconPosition="end">Shipping</AccordionHeader>
    <AccordionPanel>Free over $50.</AccordionPanel>
  </AccordionItem>
  <AccordionItem value="billing" disabled>
    <AccordionHeader inline>Billing</AccordionHeader>
    <AccordionPanel>Coming soon.</AccordionPanel>
  </AccordionItem>
</Accordion>
```

### Tree: nested items with selection

TreeItem.itemType is required ('branch' | 'leaf'); nested Tree renders children. TreeItemLayout can host a selector checkbox automatically.

```tsx
import { Tree, TreeItem, TreeItemLayout } from '@fluentui/react-components';

<Tree
  aria-label="File tree"
  appearance="subtle"
  defaultOpenItems={['src']}
  selectionMode="multiselect"
>
  <TreeItem itemType="branch" value="src">
    <TreeItemLayout>src</TreeItemLayout>
    <Tree>
      <TreeItem itemType="leaf" value="src/index.ts">
        <TreeItemLayout>index.ts</TreeItemLayout>
      </TreeItem>
      <TreeItem itemType="leaf" value="src/theme.ts">
        <TreeItemLayout>theme.ts</TreeItemLayout>
      </TreeItem>
    </Tree>
  </TreeItem>
</Tree>
```

### TagPicker multi-select (+ dismissible TagGroup)

TagPicker tracks selection through onOptionSelect; TagGroup handles dismissal through onDismiss.

```tsx
import * as React from 'react';
import {
  Tag, TagGroup, TagPicker, TagPickerControl, TagPickerGroup, TagPickerInput,
  TagPickerList, TagPickerOption,
} from '@fluentui/react-components';

const options = ['Design', 'Engineering', 'Marketing'];

export const TeamPicker = () => {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [query, setQuery] = React.useState('');

  return (
    <TagPicker
      onOptionSelect={(_, data) =>
        setSelected(prev => (prev.includes(data.value) ? prev : [...prev, data.value]))
      }
    >
      <TagPickerControl>
        <TagPickerGroup aria-label="Selected teams">
          {selected.map(tag => (
            <Tag key={tag} value={tag}>{tag}</Tag>
          ))}
        </TagPickerGroup>
        <TagPickerInput
          aria-label="Add a team"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
      </TagPickerControl>
      <TagPickerList>
        {options.map(option => (
          <TagPickerOption key={option} value={option}>{option}</TagPickerOption>
        ))}
      </TagPickerList>
    </TagPicker>
  );
};

// Dismissible display-only tags
export const Tags = ({ tags, remove }: { tags: string[]; remove: (v: string) => void }) => (
  <TagGroup dismissible onDismiss={(_, data) => remove(data.value as string)}>
    {tags.map(tag => (
      <Tag key={tag} value={tag} dismissible>{tag}</Tag>
    ))}
  </TagGroup>
);
```

## Pitfalls

- Mixing controlled and uncontrolled APIs (e.g. passing both value and defaultValue) — React will warn and state will desync; pick one model per component.
- Forgetting onOpenChange on a controlled overlay: open={x} without onOpenChange makes a Dialog/Drawer/Menu/Popover impossible to dismiss.
- Reading event.target.value instead of the second callback argument (data.value / data.checked / data.open) — Fluent UI normalizes the change data for you.
- Using disabled on a trigger that must display a Tooltip: disabled elements are not focusable, so hover/focus never fires — use disabledFocusable instead.
- Nesting overlay surfaces in the wrong place — PopoverSurface/MenuPopover/DialogSurface must be a sibling of the trigger in the same parent component so context is shared.
- Reimplementing a label/hint yourself next to a Field (double labels, broken aria-describedby) instead of using Field's label/hint/validationMessage slots.
- Forgetting required enum props such as TreeItem.itemType, AccordionItem.value, NavItem.value, NavCategory.value, Field-less ColorSwatch.value, or DrawerHeaderTitle usage without a heading.
- Assuming MenuItemCheckbox/MenuItemRadio manage their own state — you must own checkedValues and update it in onCheckedValueChange (data.name + data.checkedItems).
- Overriding library styles with raw CSS class names instead of theme/tokens or customStyleHooks_unstable on FluentProvider, which breaks theming and RTL.

**Referenced components**: FluentProvider, Portal, AriaLiveAnnouncer, Button, CompoundButton, MenuButton, SplitButton, ToggleButton, Input, Textarea, Select, Option, Dropdown, Combobox, Listbox, Field, Label, InfoLabel, InfoButton, Checkbox, Radio, RadioGroup, Switch, Slider, SpinButton, SearchBox, Dialog, DialogTrigger, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Drawer, OverlayDrawer, InlineDrawer, DrawerHeader, DrawerHeaderTitle, DrawerHeaderNavigation, DrawerBody, DrawerFooter, Menu, MenuTrigger, MenuPopover, MenuList, MenuItem, MenuItemCheckbox, MenuItemRadio, MenuItemLink, MenuItemSwitch, MenuDivider, MenuGroup, MenuGroupHeader, MenuSplitGroup, Popover, PopoverTrigger, PopoverSurface, Tooltip, Toast, Toaster, ToastTitle, ToastBody, ToastFooter, ToastTrigger, MessageBar, MessageBarBody, MessageBarTitle, MessageBarActions, MessageBarGroup, Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell, TableCellLayout, TableCellActions, TableSelectionCell, TableResizeHandle, DataGrid, DataGridHeader, DataGridHeaderCell, DataGridBody, DataGridRow, DataGridCell, DataGridSelectionCell, Tree, TreeItem, TreeItemLayout, TreeItemPersonaLayout, FlatTree, FlatTreeItem, List, ListItem, TabList, Tab, Avatar, AvatarGroup, AvatarGroupItem, AvatarGroupPopover, Persona, Badge, CounterBadge, PresenceBadge, Tag, TagGroup, InteractionTag, InteractionTagPrimary, InteractionTagSecondary, Card, CardHeader, CardPreview, CardFooter, Accordion, AccordionItem, AccordionHeader, AccordionPanel, Breadcrumb, BreadcrumbItem, BreadcrumbButton, BreadcrumbDivider, Nav, NavItem, NavCategory, NavCategoryItem, NavSubItem, NavSubItemGroup, NavSectionHeader, NavDivider, NavDrawer, NavDrawerHeader, NavDrawerBody, NavDrawerFooter, AppItem, AppItemStatic, SplitNavItem, Hamburger, Divider, Image, Text, Link, Skeleton, SkeletonItem, Spinner, ProgressBar, Toolbar, ToolbarGroup, ToolbarDivider, ToolbarButton, ToolbarToggleButton, ToolbarRadioButton, ToolbarRadioGroup, Carousel, CarouselViewport, CarouselSlider, CarouselCard, CarouselNav, CarouselNavButton, CarouselNavImageButton, CarouselNavContainer, CarouselButton, CarouselAutoplayButton, TagPicker, TagPickerControl, TagPickerGroup, TagPickerInput, TagPickerButton, TagPickerList, TagPickerOption, TagPickerOptionGroup, SwatchPicker, SwatchPickerRow, ColorSwatch, ImageSwatch, EmptySwatch, ColorPicker, ColorArea, ColorSlider, AlphaSlider, Rating, RatingDisplay, RatingItem, TeachingPopover, TeachingPopoverTrigger, TeachingPopoverSurface, TeachingPopoverHeader, TeachingPopoverTitle, TeachingPopoverBody, TeachingPopoverFooter

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
