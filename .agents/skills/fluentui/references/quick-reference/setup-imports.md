# Setup & Imports Cheatsheet

> **Category**: quick-reference

## 1. Install

| Manager | Command |
| --- | --- |
| npm | `npm install @fluentui/react-components` |
| yarn | `yarn add @fluentui/react-components` |
| pnpm | `pnpm add @fluentui/react-components` |

- **One package** ships every component, slot type, and TS type listed below — no per-component packages.
- Peers: `react` + `react-dom` (16.8+). Components are client-side → add `"use client"` at the top of the file in a Next.js App Router project.
- Every component is a **named export** of `@fluentui/react-components`. There is no default export.

## 2. Canonical import

```tsx
import { FluentProvider, Button, Input, Dialog, DialogSurface } from '@fluentui/react-components';
```

| Pattern | Notes |
| --- | --- |
| `import { X } from '@fluentui/react-components'` | Components **and** sub-components (Dialog*, Menu*, Table*, Card*, Nav*, …) |
| `import type { ButtonSize } from '@fluentui/react-components'` | Prop value types come from the same entry point. No separate `@types` package. |
| Deep / internal paths | Not public API — never import them. |
| Tree-shaking | ESM build; import only what you render. |

## 3. Required root: `FluentProvider`

Wrap the app once; theme, direction, portal styling, and portal document all flow from it.

```tsx
import * as React from 'react';
import { FluentProvider, Toaster } from '@fluentui/react-components';

export const App = () => (
  <FluentProvider dir="ltr" applyStylesToPortals>
    <Toaster />
    {/* app tree */}
  </FluentProvider>
);
```

| `FluentProvider` prop | Type | Purpose |
| --- | --- | --- |
| `theme` | `Partial<Theme>` | Scoped theme tokens (root or a nested subtree) |
| `dir` | `"ltr"` / `"rtl"` | Layout + style direction (RTL) |
| `targetDocument` | `Document` | Portal target document (iframe / child window) |
| `applyStylesToPortals` | `boolean` | Copies provider styles into portal containers |
| `overrides_unstable` | `OverridesContextValue` | Context override escape hatch |
| `customStyleHooks_unstable` | `Partial<{ useXStyles_unstable: (state) => void }>` | Per-component style override hooks |
| slot `root` | `div` | Rendered root element |

Provider rules:
- One provider at the app root is **required**; extra nested providers scope `theme` / `dir` to a subtree.
- `Toaster` must live **inside** the provider tree.
- `AriaLiveAnnouncer` wraps live-region announcements.

## 4. Inventory by category (all one import)

| Category | Named exports |
| --- | --- |
| **buttons** | `Button`, `CompoundButton`, `MenuButton`, `SplitButton`, `ToggleButton` |
| **forms** | `Input`, `Textarea`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Slider`, `SpinButton`, `SearchBox`, `Select`, `Combobox`, `Dropdown`, `Listbox`, `Option`, `OptionGroup`, `Field`, `Label`, `Rating`, `RatingDisplay`, `RatingItem`, `ColorArea`, `ColorPicker`, `ColorSlider`, `ColorSwatch`, `AlphaSlider`, `EmptySwatch`, `ImageSwatch`, `SwatchPicker`, `SwatchPickerRow`, `InfoButton`, `InfoLabel`, `TagPicker`, `TagPickerControl`, `TagPickerGroup`, `TagPickerInput`, `TagPickerButton`, `TagPickerList`, `TagPickerOption`, `TagPickerOptionGroup` |
| **data-display** | `Avatar`, `AvatarGroup`, `AvatarGroupItem`, `AvatarGroupPopover`, `Badge`, `CounterBadge`, `PresenceBadge`, `Persona`, `Image`, `Text`, `List`, `ListItem`, `Skeleton`, `SkeletonItem`, `Tag`, `TagGroup`, `InteractionTag`, `InteractionTagPrimary`, `InteractionTagSecondary` |
| **data-display / Table** | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHeaderCell`, `TableCell`, `TableCellLayout`, `TableCellActions`, `TableSelectionCell`, `TableResizeHandle` |
| **data-display / DataGrid** | `DataGrid`, `DataGridHeader`, `DataGridBody`, `DataGridRow`, `DataGridHeaderCell`, `DataGridCell`, `DataGridSelectionCell` |
| **data-display / Tree** | `Tree`, `TreeItem`, `TreeItemLayout`, `TreeItemPersonaLayout`, `FlatTree`, `FlatTreeItem` |
| **feedback** | `Dialog`, `DialogTrigger`, `DialogSurface`, `DialogTitle`, `DialogBody`, `DialogContent`, `DialogActions`, `MessageBar`, `MessageBarBody`, `MessageBarTitle`, `MessageBarActions`, `MessageBarGroup`, `ProgressBar`, `Spinner`, `Tooltip`, `Toaster`, `Toast`, `ToastTitle`, `ToastBody`, `ToastFooter`, `ToastTrigger` |
| **layout** | `Card`, `CardHeader`, `CardPreview`, `CardFooter`, `Divider` |
| **navigation** | `Link`, `Breadcrumb`, `BreadcrumbItem`, `BreadcrumbButton`, `BreadcrumbDivider`, `Menu`, `MenuTrigger`, `MenuPopover`, `MenuList`, `MenuItem`, `MenuItemLink`, `MenuItemCheckbox`, `MenuItemRadio`, `MenuItemSwitch`, `MenuDivider`, `MenuGroup`, `MenuGroupHeader`, `MenuSplitGroup`, `Nav`, `NavItem`, `NavSubItem`, `NavSubItemGroup`, `NavCategory`, `NavCategoryItem`, `NavDivider`, `NavSectionHeader`, `SplitNavItem`, `NavDrawer`, `NavDrawerHeader`, `NavDrawerBody`, `NavDrawerFooter`, `AppItem`, `AppItemStatic`, `Hamburger`, `Tab`, `TabList` |
| **overlays** | `Popover`, `PopoverTrigger`, `PopoverSurface`, `Drawer`, `InlineDrawer`, `OverlayDrawer`, `DrawerHeader`, `DrawerHeaderTitle`, `DrawerHeaderNavigation`, `DrawerBody`, `DrawerFooter`, `TeachingPopover`, `TeachingPopoverTrigger`, `TeachingPopoverSurface`, `TeachingPopoverHeader`, `TeachingPopoverTitle`, `TeachingPopoverBody`, `TeachingPopoverFooter`, `TeachingPopoverCarousel`, `TeachingPopoverCarouselCard`, `TeachingPopoverCarouselNav`, `TeachingPopoverCarouselNavButton`, `TeachingPopoverCarouselFooter`, `TeachingPopoverCarouselPageCount` |
| **utilities** | `FluentProvider`, `Portal`, `AriaLiveAnnouncer`, `Accordion`, `AccordionItem`, `AccordionHeader`, `AccordionPanel`, `OverflowItem`, `OverflowDivider`, `Toolbar`, `ToolbarButton`, `ToolbarToggleButton`, `ToolbarRadioButton`, `ToolbarRadioGroup`, `ToolbarGroup`, `ToolbarDivider`, `Carousel`, `CarouselCard`, `CarouselSlider`, `CarouselViewport`, `CarouselButton`, `CarouselNav`, `CarouselNavButton`, `CarouselNavContainer`, `CarouselNavImageButton`, `CarouselAutoplayButton` |

## 5. Families — import all parts together

| Family | Members that must be composed |
| --- | --- |
| Accordion | `Accordion`, `AccordionItem`, `AccordionHeader`, `AccordionPanel` |
| Menu | `Menu`, `MenuTrigger`, `MenuPopover`, `MenuList`, `MenuItem`, `MenuItemLink`, `MenuItemCheckbox`, `MenuItemRadio`, `MenuItemSwitch`, `MenuDivider`, `MenuGroup`, `MenuGroupHeader`, `MenuSplitGroup` |
| Dialog | `Dialog`, `DialogTrigger`, `DialogSurface`, `DialogTitle`, `DialogBody`, `DialogContent`, `DialogActions` |
| Drawer | `Drawer`, `InlineDrawer`, `OverlayDrawer`, `DrawerHeader`, `DrawerHeaderTitle`, `DrawerHeaderNavigation`, `DrawerBody`, `DrawerFooter` |
| Popover | `Popover`, `PopoverTrigger`, `PopoverSurface` |
| TeachingPopover | `TeachingPopover`, `TeachingPopoverTrigger`, `TeachingPopoverSurface`, `TeachingPopoverHeader`, `TeachingPopoverTitle`, `TeachingPopoverBody`, `TeachingPopoverFooter`, `TeachingPopoverCarousel`, `TeachingPopoverCarouselCard`, `TeachingPopoverCarouselNav`, `TeachingPopoverCarouselNavButton`, `TeachingPopoverCarouselFooter`, `TeachingPopoverCarouselPageCount` |
| Card | `Card`, `CardHeader`, `CardPreview`, `CardFooter` |
| Toast | `Toaster`, `Toast`, `ToastTitle`, `ToastBody`, `ToastFooter`, `ToastTrigger` |
| MessageBar | `MessageBar`, `MessageBarBody`, `MessageBarTitle`, `MessageBarActions`, `MessageBarGroup` |
| TagPicker | `TagPicker`, `TagPickerControl`, `TagPickerGroup`, `TagPickerInput`, `TagPickerButton`, `TagPickerList`, `TagPickerOption`, `TagPickerOptionGroup` |
| Swatch picker | `SwatchPicker`, `SwatchPickerRow`, `ColorSwatch`, `ImageSwatch`, `EmptySwatch`, `AlphaSlider` |
| Avatar | `Avatar`, `AvatarGroup`, `AvatarGroupItem`, `AvatarGroupPopover` |
| Tags / badges | `Tag`, `TagGroup`, `InteractionTag`, `InteractionTagPrimary`, `InteractionTagSecondary`, `Badge`, `CounterBadge`, `PresenceBadge` |
| Tree | `Tree`, `TreeItem`, `TreeItemLayout`, `TreeItemPersonaLayout`, `FlatTree`, `FlatTreeItem` |
| Carousel | `Carousel`, `CarouselCard`, `CarouselSlider`, `CarouselViewport`, `CarouselButton`, `CarouselNav`, `CarouselNavButton`, `CarouselNavContainer`, `CarouselNavImageButton`, `CarouselAutoplayButton` |
| Toolbar | `Toolbar`, `ToolbarButton`, `ToolbarToggleButton`, `ToolbarRadioButton`, `ToolbarRadioGroup`, `ToolbarGroup`, `ToolbarDivider` |
| Nav | `Nav`, `NavItem`, `NavSubItem`, `NavSubItemGroup`, `NavCategory`, `NavCategoryItem`, `NavDivider`, `NavSectionHeader`, `SplitNavItem`, `NavDrawer`, `NavDrawerHeader`, `NavDrawerBody`, `NavDrawerFooter`, `AppItem`, `AppItemStatic`, `Hamburger` |
| Overflow | `OverflowItem`, `OverflowDivider` |

## 6. Portals & documents checklist

Components that render outside your React DOM tree: `PopoverSurface`, `MenuPopover`, `DialogSurface`, `Tooltip`, `TeachingPopoverSurface`, `OverlayDrawer`, and toasts hosted by `Toaster`.

| Need | Setup |
| --- | --- |
| Portal content keeps theme tokens | `<FluentProvider applyStylesToPortals>` |
| Overlays inside an iframe / child window | `<FluentProvider targetDocument={iframeDoc}>` |
| Render arbitrary content elsewhere | `<Portal mountNode={node}>…</Portal>` (`mountNode`: `HTMLElement` / `{ element, className }` / `null`) |
| Toast host | `<Toaster />` inside the provider tree |
| Screen-reader announcements | `<AriaLiveAnnouncer>{message}</AriaLiveAnnouncer>` |
| RTL page or RTL island | `<FluentProvider dir="rtl">` (or nest a provider for a subtree) |

## 7. Slots — why sub-components exist

| Component | Slots you can target |
| --- | --- |
| `Input` | `root`, `input`, `contentBefore`, `contentAfter` |
| `Field` | `root`, `label`, `validationMessage`, `validationMessageIcon`, `hint` |
| `CardHeader` | `root`, `image`, `header`, `description`, `action` |
| `AccordionHeader` | `root`, `button`, `expandIcon`, `icon` |
| `TableHeaderCell` | `root`, `sortIcon`, `button`, `aside` |
| `Tag` | `root`, `media`, `icon`, `primaryText`, `secondaryText`, `dismissIcon` |

## 8. Types referenced in prop signatures (same import path)

| Type | Seen on |
| --- | --- |
| `ButtonSize` | `Button`, `CompoundButton`, `MenuButton`, `SplitButton` |
| `AvatarSize`, `AvatarShape`, `AvatarNamedColor` | `Avatar`, `AvatarGroup*` |
| `TagAppearance`, `TagShape`, `TagSize` | `Tag`, `TagGroup`, `InteractionTag` |
| `DialogModalType`, `DialogActionsPosition`, `DialogTriggerAction`, `DialogOpenChangeEventHandler` | `Dialog*` |
| `PopoverSize`, `PositioningShorthand` | `Popover`, `PopoverSurface`, `Tooltip`, `Dropdown` |
| `SortDirection`, `SortState`, `DataGridCellFocusMode`, `TableColumnId` | `Table*`, `DataGrid*` |
| `SelectionMode`, `TreeItemValue`, `TreeItemType`, `TreeNavigationMode`, `ListNavigationMode` | `Tree*`, `FlatTree*`, `List`, `DataGrid` |
| `NavDensity`, `NavItemValue`, `NavItemProps` | `Nav*`, `AppItem*` |
| `ToastIntent`, `ToastAnnounce`, `Announce` | `Toast*`, `Toaster` |
| `MessageBarIntent` | `MessageBar*` |
| `HsvColor`, `ColorChannel` | `ColorArea`, `ColorSlider`, `ColorPicker` |
| `CarouselAppearance`, `CarouselMotion`, `CarouselAnnouncerFunction` | `Carousel*` |
| `AccordionHeaderSize`, `AccordionHeaderExpandIconPosition` | `AccordionHeader`, `AccordionPanel` |
| `SkeletonItemSize`, `PresenceBadgeStatus` | `Skeleton*`, `PresenceBadge` |
| Change-data types | `InputOnChangeData`, `CheckboxOnChangeData`, `RadioOnChangeData`, `RadioGroupOnChangeData`, `SelectOnChangeData`, `SliderOnChangeData`, `SpinButtonOnChangeData`, `SwitchOnChangeData`, `TextareaOnChangeData`, `SearchBoxChangeEvent`, `CardOnSelectData`, `CardOnSelectionChangeEvent`, `MenuCheckedValueChangeData`, `OnSelectionChangeData`, `TagSelectData`, `SwatchPickerOnSelectionChangeData` |

## 9. 30-second checklist

1. `npm install @fluentui/react-components`.
2. `import { … } from '@fluentui/react-components'` only.
3. `<FluentProvider>` at the root (`theme`, `dir`, `targetDocument`, `applyStylesToPortals`).
4. `<Toaster />` + `<AriaLiveAnnouncer>` inside the provider when you need them.
5. Compose full families (Menu*, Dialog*, Card*, Table*, Tree*, TagPicker*, TeachingPopover*, Carousel*, Toolbar*, Nav*).
6. Import types from the same entry point.

## Key Takeaways

- Install exactly one package — `@fluentui/react-components` — and import every component and type from that single entry point with named imports.
- `FluentProvider` is mandatory at the app root; it is the only place to set `theme`, `dir`, `targetDocument`, `applyStylesToPortals`, and style overrides.
- Components are composed as families (Dialog*, Menu*, Card*, Table*, Tree*, TagPicker*, TeachingPopover*, Carousel*, Toolbar*, Nav*, Toast*) — import and render all parts of the family you use.
- Overlays (PopoverSurface, MenuPopover, DialogSurface, Tooltip, TeachingPopoverSurface, OverlayDrawer, Toaster) render through portals: use `applyStylesToPortals` and, outside the main document, `targetDocument`.
- All prop value types (`ButtonSize`, `AvatarSize`, `DialogModalType`, `SortState`, change-data types, …) are exported from the same path — no separate types package.
- `Toaster` and `AriaLiveAnnouncer` are the app-level hosts for toast and screen-reader announcements and must sit inside the provider tree.

## Examples

### Install the package

Single-package install for FluentUI v9 with any package manager.

```bash
npm install @fluentui/react-components
# or
yarn add @fluentui/react-components
# or
pnpm add @fluentui/react-components
```

### App root: FluentProvider + Toaster

The required root wrapper. All theme, direction, and portal styling flows from here.

```tsx
import * as React from 'react';
import { FluentProvider, Toaster } from '@fluentui/react-components';

export const App = () => (
  <FluentProvider dir="ltr" applyStylesToPortals>
    <Toaster />
    {/* your app tree */}
  </FluentProvider>
);
```

### Typed theme prop for FluentProvider

Derive the provider theme type so your theme constant stays type-safe.

```tsx
import * as React from 'react';
import { FluentProvider } from '@fluentui/react-components';

type AppTheme = NonNullable<React.ComponentProps<typeof FluentProvider>['theme']>;

export const ThemedApp = ({ theme }: { theme: AppTheme }) => (
  <FluentProvider theme={theme} dir="ltr">
    {/* app tree */}
  </FluentProvider>
);
```

### Form imports: Field, Input, Dropdown, Option

Named imports from the single entry point, composed with Field and its label slot.

```tsx
import {
  Checkbox,
  Dropdown,
  Field,
  Input,
  Option,
  Radio,
  RadioGroup,
  SearchBox,
  Slider,
  Switch,
  Textarea,
} from '@fluentui/react-components';

export const ProfileForm = () => (
  <>
    <Field label="Full name" required>
      <Input placeholder="Jane Doe" />
    </Field>

    <Field label="Team">
      <Dropdown placeholder="Pick a team">
        <Option value="design">Design</Option>
        <Option value="eng">Engineering</Option>
      </Dropdown>
    </Field>

    <Switch label="Email notifications" />
    <Checkbox label="Accept terms" />
    <RadioGroup>
      <Radio value="a" label="Option A" />
      <Radio value="b" label="Option B" />
    </RadioGroup>
    <Slider min={0} max={100} />
    <Textarea placeholder="Notes" />
    <SearchBox placeholder="Search" />
  </>
);
```

### Dialog and Menu imports

Feedback + navigation families; note DialogTrigger defaults to close inside DialogActions.

```tsx
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@fluentui/react-components';

export const Actions = () => (
  <>
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Button appearance="primary">Open dialog</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Delete item?</DialogTitle>
          <DialogContent>This action cannot be undone.</DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cancel</Button>
            </DialogTrigger>
            <Button appearance="primary">Delete</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>

    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button>Actions</Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Duplicate</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  </>
);
```

### Portals in an iframe: targetDocument + Portal mountNode

Point portals at another document and keep provider styles applied to portal content.

```tsx
import {
  Button,
  FluentProvider,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Portal,
} from '@fluentui/react-components';

export const IframeApp = ({ iframeDocument }: { iframeDocument: Document }) => (
  <FluentProvider targetDocument={iframeDocument} applyStylesToPortals>
    <Popover>
      <PopoverTrigger disableButtonEnhancement>
        <Button>Open popover</Button>
      </PopoverTrigger>
      <PopoverSurface>Rendered in the iframe document</PopoverSurface>
    </Popover>

    <Portal mountNode={iframeDocument.body}>Standalone portal content</Portal>
  </FluentProvider>
);
```

### RTL subtree with a nested provider

Scope direction (and theme) to a part of the tree by nesting FluentProvider.

```tsx
import * as React from 'react';
import { Button, FluentProvider, Input } from '@fluentui/react-components';

export const RtlIsland = () => (
  <FluentProvider dir="rtl">
    <Button appearance="primary">حفظ</Button>
    <Input placeholder="البريد الإلكتروني" />
  </FluentProvider>
);
```

## Pitfalls

- Rendering Fluent components without a `FluentProvider` ancestor: theme tokens and portal styles are missing even though the components render.
- Passing children to components whose `children` prop is `undefined` (`Input`, `Checkbox`): use the `contentBefore` / `contentAfter` / `label` slots instead.
- Forgetting `applyStylesToPortals` and `targetDocument` when the app or portal content lives in an iframe or child window — overlays appear unstyled or in the wrong document.
- Setting `open` / `disabled` / `size` manually on `AccordionPanel`: those values are supplied through `AccordionItem` context.
- Rendering sub-components detached from their context provider (e.g. `MenuItem` outside `MenuList` → `MenuPopover` → `Menu`, or `DialogSurface` outside `Dialog`) — they read context and will not behave correctly.
- Wrapping a custom (non-Fluent) element in `DialogTrigger` / `MenuTrigger` / `PopoverTrigger` without `disableButtonEnhancement`, which breaks the injected button behavior.
- Importing from deep internals instead of `@fluentui/react-components` — internal paths are not public API and can break on any release.

**Referenced components**: Accordion, AccordionHeader, AccordionItem, AccordionPanel, AlphaSlider, AppItem, AppItemStatic, AriaLiveAnnouncer, Avatar, AvatarGroup, AvatarGroupItem, AvatarGroupPopover, Badge, Breadcrumb, BreadcrumbButton, BreadcrumbDivider, BreadcrumbItem, Button, Card, CardFooter, CardHeader, CardPreview, Carousel, CarouselAutoplayButton, CarouselButton, CarouselCard, CarouselNav, CarouselNavButton, CarouselNavContainer, CarouselNavImageButton, CarouselSlider, CarouselViewport, Checkbox, ColorArea, ColorPicker, ColorSlider, ColorSwatch, Combobox, CompoundButton, CounterBadge, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, DataGridSelectionCell, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Divider, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerHeaderNavigation, DrawerHeaderTitle, Dropdown, EmptySwatch, Field, FlatTree, FlatTreeItem, FluentProvider, Hamburger, Image, ImageSwatch, InfoButton, InfoLabel, InlineDrawer, Input, InteractionTag, InteractionTagPrimary, InteractionTagSecondary, Label, Link, List, ListItem, Listbox, Menu, MenuDivider, MenuGroup, MenuGroupHeader, MenuItem, MenuItemCheckbox, MenuItemLink, MenuItemRadio, MenuItemSwitch, MenuList, MenuPopover, MenuSplitGroup, MenuTrigger, MessageBar, MessageBarActions, MessageBarBody, MessageBarGroup, MessageBarTitle, Nav, NavCategory, NavCategoryItem, NavDivider, NavDrawer, NavDrawerBody, NavDrawerFooter, NavDrawerHeader, NavItem, NavSectionHeader, NavSubItem, NavSubItemGroup, Option, OptionGroup, OverflowDivider, OverflowItem, OverlayDrawer, Persona, Popover, PopoverSurface, PopoverTrigger, Portal, PresenceBadge, ProgressBar, Radio, RadioGroup, Rating, RatingDisplay, RatingItem, SearchBox, Select, Skeleton, SkeletonItem, Slider, SpinButton, Spinner, SplitButton, SplitNavItem, SwatchPicker, SwatchPickerRow, Switch, Tab, TabList, Table, TableBody, TableCell, TableCellActions, TableCellLayout, TableHeader, TableHeaderCell, TableResizeHandle, TableRow, TableSelectionCell, Tag, TagGroup, TagPicker, TagPickerButton, TagPickerControl, TagPickerGroup, TagPickerInput, TagPickerList, TagPickerOption, TagPickerOptionGroup, TeachingPopover, TeachingPopoverBody, TeachingPopoverCarousel, TeachingPopoverCarouselCard, TeachingPopoverCarouselFooter, TeachingPopoverCarouselNav, TeachingPopoverCarouselNavButton, TeachingPopoverCarouselPageCount, TeachingPopoverFooter, TeachingPopoverHeader, TeachingPopoverSurface, TeachingPopoverTitle, TeachingPopoverTrigger, Text, Textarea, Toast, ToastBody, ToastFooter, ToastTitle, ToastTrigger, Toaster, ToggleButton, Toolbar, ToolbarButton, ToolbarDivider, ToolbarGroup, ToolbarRadioButton, ToolbarRadioGroup, ToolbarToggleButton, Tooltip, Tree, TreeItem, TreeItemLayout, TreeItemPersonaLayout

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
