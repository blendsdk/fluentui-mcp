# Component Quick Reference

> **Category**: quick-reference

**Every component ships from one barrel import:**
`import { Button, Input, Dialog, Menu, Tree } from '@fluentui/react-components';` (install: `npm install @fluentui/react-components`)

## 1. Root and infrastructure

| Component | Purpose | Key props |
| --- | --- | --- |
| FluentProvider | Required app root — theme, direction, portal target, style overrides | theme: Partial<Theme>; dir: 'ltr' or 'rtl'; targetDocument: Document; applyStylesToPortals: boolean; overrides_unstable; customStyleHooks_unstable |
| Portal | Render children into another DOM node | children; mountNode: HTMLElement, or { element?, className? }, or null |
| AriaLiveAnnouncer | Live region for assistive tech | children: React.ReactNode |

## 2. Shared prop vocabularies (names repeat, values do not)

| Prop | Components | Values |
| --- | --- | --- |
| appearance | Button, CompoundButton, MenuButton, SplitButton, ToggleButton, ToolbarButton, ToolbarGroup, ToolbarRadioGroup, ToolbarToggleButton | secondary, primary, outline, subtle, transparent |
| appearance | Badge | filled, ghost, outline, tint |
| appearance | CounterBadge | filled, ghost |
| appearance | Input, SpinButton, Select | outline, underline, filled-darker, filled-lighter |
| appearance | Textarea | outline, filled-darker, filled-lighter, filled-darker-shadow, filled-lighter-shadow |
| appearance | Card | filled, filled-alternative, outline, subtle |
| appearance | Divider | brand, default, strong, subtle |
| appearance | TabList | transparent, subtle, subtle-circular, filled-circular |
| appearance | Tree, FlatTree, TreeItemLayout | subtle, subtle-alpha, transparent |
| appearance | Link | default, subtle |
| appearance | Spinner | primary, inverted |
| appearance | Tooltip | normal, inverted |
| appearance | Popover, PopoverSurface | brand, inverted |
| appearance | TableRow | brand, neutral, none |
| appearance | TableCellLayout | primary |
| size | Button, CompoundButton, MenuButton, SplitButton | ButtonSize |
| size | Badge | tiny, extra-small, small, medium, large, extra-large |
| size | Avatar, AvatarGroup, AvatarGroupItem | AvatarSize |
| size | Persona | extra-small, small, medium, large, extra-large, huge |
| size | Spinner | extra-tiny, tiny, extra-small, small, medium, large, extra-large, huge |
| size | Text | 100 to 1000 in steps of 100 |
| size | Input, Textarea, Select, Field, Dropdown, Tree, FlatTree, Toolbar, SwatchPicker, InfoButton | small, medium, large |
| size | Switch, Slider, SpinButton | small, medium |
| size | Checkbox | medium, large |
| shape | Button family | rounded, circular, square |
| shape | Badge | circular, rounded, square |
| shape | CounterBadge | circular, rounded |
| shape | Checkbox | square, circular |
| shape | Image | square, circular, rounded |
| shape | ColorPicker | rounded, square |
| shape | SwatchPicker | rounded, square, circular |
| shape | MessageBar | square, rounded |
| shape | Avatar | AvatarShape |
| labelPosition | Checkbox | before, after |
| labelPosition | Radio | after, below |
| labelPosition | Switch | above, after, before |
| labelPosition | Spinner | above, below, before, after |
| iconPosition | Button family, Badge | before, after |

**Controlled / uncontrolled pairs**

| Controlled | Uncontrolled | Handler |
| --- | --- | --- |
| open | defaultOpen | onOpenChange |
| value / defaultValue | defaultValue | onChange |
| selectedValue | defaultSelectedValue | onTabSelect, onNavItemSelect |
| selectedValues | defaultSelectedValues | onSelectionChange |
| checked | defaultChecked | onChange |
| selected | defaultSelected | onSelectionChange |
| activeIndex | defaultActiveIndex | onActiveIndexChange |

## 3. Component catalog

### Buttons
| Component | Key props | Slots |
| --- | --- | --- |
| Button | appearance, size, shape, iconPosition, disabled, disabledFocusable | root, icon |
| CompoundButton | Button props + secondaryContent | contentContainer (required) |
| MenuButton | Button props; used as a Menu trigger | – |
| SplitButton | Button props + menuButton and primaryActionButton slots | root, menuButton, primaryActionButton |
| ToggleButton | defaultChecked, checked, isAccessible | – |

### Forms — text input and pickers
| Component | Key props | Slots |
| --- | --- | --- |
| Input | size, appearance, type (text, number, email, password, search, tel, url, date, datetime-local, month, time, week), value, defaultValue, onChange(ev, data) | root, input, contentBefore, contentAfter |
| Textarea | size, appearance, resize (none, horizontal, vertical, both), value, defaultValue, onChange | root, textarea |
| Select | size, appearance, onChange | root, select, icon |
| SearchBox | onChange(event, data) | – |
| SpinButton | value, defaultValue, displayValue, min, max, step, stepPage, precision, appearance, size, onChange | root, input, incrementButton, decrementButton |
| Combobox | freeform, children | root, expandIcon, clearIcon, input, listbox |
| Dropdown | appearance, size, value, defaultValue, open, defaultOpen, placeholder, clearable, inlinePopup, positioning, freeform, disableAutoFocus, onOpenChange | root, button, expandIcon, clearButton, listbox |
| Option | value, disabled | root, checkIcon |
| OptionGroup | groups options inside Dropdown / Combobox | root, label |
| Listbox | disableAutoFocus | root |

### Forms — selection controls
| Component | Key props | Slots |
| --- | --- | --- |
| Checkbox | checked (boolean or 'mixed'), defaultChecked, labelPosition, shape, size, onChange | root, label, input, indicator |
| Radio | value, labelPosition, disabled, onChange | root, label, input, indicator |
| RadioGroup | name, value, defaultValue, onChange, layout (vertical, horizontal, horizontal-stacked), disabled, required | root |
| Switch | checked, defaultChecked, disabledFocusable, labelPosition, size, onChange | root, indicator, input, label |
| Slider | value, defaultValue, min, max, step, size, vertical, disabled, onChange | root, rail, thumb, input |
| Field | children (node or render function of FieldControlProps), orientation (vertical, horizontal), validationState (error, warning, success, none), required, size | root, label, validationMessage, validationMessageIcon, hint |
| Label | disabled, required (boolean or node), size, weight (regular, semibold) | root, required |
| InfoLabel | info (node or PopoverSurface props) | root, label, infoButton |
| InfoButton | size, inline, popover | root, popover, info |
| Rating | color (brand, marigold, neutral), value, defaultValue, max, step (0.5 or 1), size, itemLabel, iconFilled, iconOutline, name, onChange | root |
| RatingDisplay | color, value, count, max, size, compact, icon | root, valueText, countText |
| RatingItem | value | root, selectedIcon, unselectedIcon, halfValueInput, fullValueInput |

### Forms — color and swatches
| Component | Key props | Slots |
| --- | --- | --- |
| ColorPicker | color: HsvColor, onColorChange, shape | root |
| ColorArea | color, defaultColor: HsvColor, onChange | root, thumb, inputX, inputY |
| ColorSlider | channel: ColorChannel, color, defaultColor, vertical, onChange | root, rail, thumb, input |
| AlphaSlider | transparency | – |
| ColorSwatch | color (required), value (required), borderColor, disabled | root, icon, disabledIcon |
| EmptySwatch | color (required), value (required), borderColor, disabled | root |
| ImageSwatch | src (required), value (required) | root |
| SwatchPicker | selectedValue, defaultSelectedValue, onSelectionChange, layout (row, grid), focusMode (arrow, tab), size, shape, spacing (small, medium), disabled | root |
| SwatchPickerRow | rowId (required), items (required), renderSwatch, columnCount | root |

### Forms — tag picker
| Component | Notes |
| --- | --- |
| TagPicker | onOptionSelect, onOpenChange, noPopover, inline |
| TagPickerControl | Wraps the picker UI; style, disabled |
| TagPickerGroup | Holds selected Tag children |
| TagPickerInput | value, disabled |
| TagPickerList | disableAutoFocus (the suggestion popup) |
| TagPickerOption | value (required) |
| TagPickerOptionGroup | Visual grouping inside TagPickerList |
| TagPickerButton | disabled (dropdown trigger) |

### Data display
| Component | Key props | Slots |
| --- | --- | --- |
| Avatar | name, size, shape, color (neutral, brand, colorful, named), idForColor, active (active, inactive, unset), activeAppearance (ring, shadow, ring-shadow) | root, image, initials, icon, badge |
| AvatarGroup | layout (spread, stack, pie), size | root |
| AvatarGroupItem | name, shape, size, isOverflow | root, avatar, overflowLabel |
| AvatarGroupPopover | indicator (count, icon), count, children (required) | triggerButton, content, popoverSurface, tooltip |
| Badge | appearance, color (brand, danger, important, informative, severe, subtle, success, warning), iconPosition, shape, size | root, icon |
| CounterBadge | appearance, color (brand, danger, important, informative), count, overflowCount, dot, showZero, shape | – |
| PresenceBadge | status: PresenceBadgeStatus, outOfOffice | – |
| Image | block, bordered, fit (none, center, contain, cover, default), shadow, shape | root |
| Persona | name, size, textPosition (after, before, below), textAlignment (center, start), presenceOnly | root, avatar, presence, primaryText, secondaryText, tertiaryText, quaternaryText |
| Text | size (100-1000), weight (regular, medium, semibold, bold), font (base, monospace, numeric), align, block, italic, underline, strikethrough, truncate, wrap | root |
| Skeleton | animation (wave, pulse), appearance (opaque, translucent), width, size, shape (circle, square, rectangle) | root |
| SkeletonItem | animation, appearance | root |
| List | navigationMode, selectionMode, selectedItems, defaultSelectedItems, onSelectionChange | root |
| ListItem | value, onAction, disabledSelection | root, checkmark |
| Table | Plain table primitive | root |
| TableHeader / TableBody | Section wrappers | root |
| TableRow | appearance (brand, neutral, none) | root |
| TableCell | Plain cell | root |
| TableHeaderCell | sortable, sortDirection | root, sortIcon, button, aside |
| TableSelectionCell | type (checkbox, radio), checked (boolean or 'mixed'), subtle, hidden, invisible | – |
| TableCellLayout | appearance (primary), truncate | root, media, main, description, content |
| TableCellActions | visible | root |
| TableResizeHandle | Resize affordance for resizable columns | root |
| DataGrid | onSortChange, onSelectionChange, selectionMode, columnSizingOptions, onColumnResize, containerWidthOffset, resizableColumnsOptions | – |
| DataGridHeader / DataGridBody / DataGridRow / DataGridCell / DataGridHeaderCell / DataGridSelectionCell | Render-function children for header rows and body rows/cells | – |
| Tree | navigationMode (tree, treegrid), appearance, size, openItems, defaultOpenItems, selectionMode, checkedItems | root, collapseMotion |
| TreeItem | itemType (required), value, open, onOpenChange, parentValue | root |
| TreeItemLayout | iconBefore, iconAfter, expandIcon, aside, actions, selector slots | root, main, iconBefore, iconAfter, expandIcon, aside, actions, selector |
| TreeItemPersonaLayout | Persona-style layout variant of TreeItemLayout | media, main, description |
| FlatTree | navigationMode, appearance, size, openItems, selectionMode, checkedItems | – |
| FlatTreeItem | value (required), aria-level (required), aria-setsize (required), aria-posinset (required) | – |
| Tag | appearance, disabled, dismissible, selected, shape, size, value | root, media, icon, primaryText, secondaryText, dismissIcon |
| TagGroup | onDismiss, onTagSelect, selectedValues, defaultSelectedValues, disabled, size, appearance, dismissible | root |
| InteractionTag | appearance, disabled, selected, shape, size, value | root |
| InteractionTagPrimary | hasSecondaryAction | root, media, icon, primaryText, secondaryText |
| InteractionTagSecondary | hasSecondaryAction | root |

### Feedback
| Component | Key props | Slots |
| --- | --- | --- |
| Dialog | modalType, open, defaultOpen, onOpenChange, children, inertTrapFocus, unmountOnClose | surfaceMotion |
| DialogTrigger | action: DialogTriggerAction, disableButtonEnhancement | – |
| DialogSurface | The modal surface | backdrop, root, backdropMotion |
| DialogBody | Content wrapper inside DialogSurface | root |
| DialogContent | Scrollable content area | root |
| DialogTitle | Title text | root, action |
| DialogActions | position: DialogActionsPosition, fluid | root |
| MessageBar | intent, politeness (assertive, polite), shape | root, icon, bottomReflowSpacer |
| MessageBarBody | Body text | root |
| MessageBarTitle | Bold title line | root |
| MessageBarActions | containerAction slot for buttons | root, containerAction |
| MessageBarGroup | children (required), animate (exit-only, both) | root |
| ProgressBar | value, max, shape, thickness (medium, large), color (brand, success, warning, error) | root, bar, indeterminateMotion |
| Spinner | size, appearance, labelPosition, delay | root, spinner, spinnerTail, label |
| Toaster | announce: Announce, inline | root |
| Toast | appearance: BackgroundAppearanceContextValue | root |
| ToastTitle | Title line | root, media, action |
| ToastBody | Body text | root, subtitle |
| ToastFooter | Footer actions area | root |
| ToastTrigger | disableButtonEnhancement | – |

### Layout
| Component | Key props | Slots |
| --- | --- | --- |
| Card | appearance, orientation (horizontal, vertical), size, focusMode (off, no-tab, tab-exit, tab-only), selected, defaultSelected, onSelectionChange, disabled, shouldRestrictTriggerAction | root, floatingAction, checkbox |
| CardHeader | shouldRestrictTriggerAction | root, image, header, description, action |
| CardPreview | Renders media / logo area | root, logo |
| CardFooter | Footer action row | root, action |
| Divider | alignContent (start, center, end), appearance, inset, vertical | root, wrapper |

### Navigation
| Component | Key props | Slots |
| --- | --- | --- |
| Breadcrumb | focusMode (arrow, tab), size | root, list |
| BreadcrumbItem | current, root: Slot<'li'> | root |
| BreadcrumbButton | current | – |
| BreadcrumbDivider | Renders the divider glyph | root |
| Link | appearance, disabled, disabledFocusable, inline | root |
| Menu | children (required), open, defaultOpen, onOpenChange, openOnContext, openOnHover, hoverDelay, persistOnItemClick, positioning, closeOnScroll, inline | surfaceMotion |
| MenuTrigger | disableButtonEnhancement, focusFirst | – |
| MenuPopover | Popover container for MenuList | root |
| MenuList | checkedValues, defaultCheckedValues, onCheckedValueChange, hasCheckmarks, hasIcons | root |
| MenuItem | disabled, disabledFocusable, hasSubmenu, persistOnClick | root, icon, checkmark, submenuIndicator, content, secondaryContent, subText |
| MenuItemCheckbox | name (required), value (required) | – |
| MenuItemRadio | name (required), value (required) | – |
| MenuItemSwitch | name (required), value (required) | switchIndicator |
| MenuItemLink | href (required) | – |
| MenuGroup / MenuGroupHeader / MenuDivider / MenuSplitGroup | Structure and dividers inside MenuList | root |
| TabList | appearance, size, vertical, selectedValue, defaultSelectedValue, onTabSelect, selectTabOnFocus, reserveSelectedTabSpace, disabled | root |
| Tab | value (required), disabled | root, icon, content |
| Nav | selectedValue, defaultSelectedValue, selectedCategoryValue, defaultSelectedCategoryValue, openCategories, defaultOpenCategories, onNavItemSelect, onNavCategoryItemToggle, multiple, density | root |
| NavItem / NavSubItem | value (required), href | root, icon |
| NavCategory | value (required), children | – |
| NavCategoryItem | Category header row | root, icon, expandIcon |
| NavSubItemGroup | Holds NavSubItem children | root, collapseMotion |
| NavDivider / NavSectionHeader | Separators and headings | root |
| NavDrawer | tabbable + all Nav props | – |
| NavDrawerHeader / NavDrawerBody / NavDrawerFooter | Drawer-shaped Nav sections | – |
| AppItem | href | root, icon |
| AppItemStatic | Non-interactive app title | root, icon |
| Hamburger | Menu toggle button for nav drawers | – |
| SplitNavItem | actionButton, toggleButton, menuButton plus tooltip slots | root, navItem, actionButton, toggleButton, menuButton, actionButtonTooltip, toggleButtonTooltip, menuButtonTooltip |

### Overlays
| Component | Key props | Slots |
| --- | --- | --- |
| Drawer | type (inline, overlay) | – |
| InlineDrawer | separator | root, surfaceMotion |
| OverlayDrawer | defaultOpen | root, backdropMotion, surfaceMotion |
| DrawerHeader | Header row container | root |
| DrawerHeaderTitle | heading, action | root, heading, action |
| DrawerHeaderNavigation | Navigation row inside the header | root |
| DrawerBody | Scrollable content area | root |
| DrawerFooter | Footer action area | root |
| Popover | appearance, children (required), open, defaultOpen, onOpenChange, openOnHover, openOnContext, mouseLeaveDelay, inline, withArrow, positioning, size, closeOnScroll, closeOnIframeFocus, trapFocus, legacyTrapFocus, inertTrapFocus, unstable_disableAutoFocus | surfaceMotion |
| PopoverTrigger | disableButtonEnhancement | – |
| PopoverSurface | The floating surface | root |
| TeachingPopover | One-time education popover (carousel-based) | – |
| TeachingPopoverHeader | dismissButton, icon | root, dismissButton, icon |
| TeachingPopoverTitle | Title line | root, dismissButton |
| TeachingPopoverBody | mediaLength (short, medium, tall) | root, media |
| TeachingPopoverFooter | footerLayout (horizontal, vertical) | root, primary, secondary |
| TeachingPopoverCarousel | value (required) | root |
| TeachingPopoverCarouselCard | value (required) | root |
| TeachingPopoverCarouselNav | children render function | root |
| TeachingPopoverCarouselNavButton | Step nav dot / arrow | root |
| TeachingPopoverCarouselFooter | layout, initialStepText, finalStepText | root, previous, next |
| TeachingPopoverCarouselPageCount | children render function | root |
| TeachingPopoverSurface / TeachingPopoverTrigger | Surface and trigger parts | – |
| Tooltip | relationship (required: label, description, inaccessible), content, visible, onVisibleChange, appearance, positioning, showDelay, hideDelay, withArrow | content |

### Utilities
| Component | Key props | Slots |
| --- | --- | --- |
| Accordion | defaultOpenItems, openItems, collapsible, multiple, navigation (linear, circular), onToggle | root |
| AccordionItem | value (required), disabled | root |
| AccordionHeader | size, inline, expandIconPosition | root, button, expandIcon, icon |
| AccordionPanel | Renders only while its AccordionItem is open | root, collapseMotion |
| Carousel | activeIndex, defaultActiveIndex, onActiveIndexChange, align (center, start, end), appearance, circular, groupSize (number or 'auto'), draggable, whitespace, motion, announcement, autoplayInterval | root |
| CarouselCard | autoSize | root |
| CarouselButton | navType (prev, next) | – |
| CarouselAutoplayButton | onCheckedChange | – |
| CarouselNav | children render function (required) | root |
| CarouselNavContainer | layout (inline, inline-wide, overlay, overlay-wide, overlay-expanded) | root, next, nextTooltip, prev, prevTooltip, autoplay, autoplayTooltip |
| CarouselNavButton | Nav dot | root |
| CarouselNavImageButton | Image-backed nav button | root, image |
| CarouselSlider | cardFocus | root |
| CarouselViewport | Clips the slider | root |
| Toolbar | size, vertical, checkedValues, defaultCheckedValues, onCheckedValueChange | root |
| ToolbarButton | appearance, vertical | – |
| ToolbarDivider | vertical | – |
| ToolbarGroup | appearance, vertical, size | root |
| ToolbarRadioGroup | appearance, vertical | root |
| ToolbarRadioButton | appearance, name (required), value (required) | – |
| ToolbarToggleButton | appearance, name (required), value (required) | – |
| OverflowItem | id (required), groupId | – |
| OverflowDivider | groupId (required) | – |

## 4. Composition skeletons (nesting order matters)

```tsx
// Dialog — Dialog > DialogTrigger + DialogSurface > DialogBody > Title / Content / Actions
<Dialog open={open} onOpenChange={(e, data) => setOpen(data.open)}>
  <DialogTrigger disableButtonEnhancement><Button>Open</Button></DialogTrigger>
  <DialogSurface>
    <DialogBody>
      <DialogTitle action={<Button appearance='subtle'>Close</Button>}>Title</DialogTitle>
      <DialogContent>Body copy</DialogContent>
      <DialogActions fluid><Button appearance='primary'>OK</Button></DialogActions>
    </DialogBody>
  </DialogSurface>
</Dialog>
```

```tsx
// Menu — Menu > MenuTrigger + MenuPopover > MenuList > MenuItem/MenuItemCheckbox/MenuItemRadio
<Menu openOnHover={false}>
  <MenuTrigger disableButtonEnhancement><Button>Edit</Button></MenuTrigger>
  <MenuPopover>
    <MenuList hasCheckmarks hasIcons>
      <MenuItem>Undo</MenuItem>
      <MenuDivider />
      <MenuItemCheckbox name='view' value='grid'>Grid</MenuItemCheckbox>
      <MenuItemRadio name='density' value='compact'>Compact</MenuItemRadio>
    </MenuList>
  </MenuPopover>
</Menu>
```

```tsx
// Field — exactly one control child; use the render-function form to forward FieldControlProps
<Field label='Name' required validationState='error' validationMessage='Required' hint='Legal name'>
  <Input />
</Field>
```

```tsx
// Table — Table > TableHeader/TableBody > TableRow > TableCell / TableHeaderCell / TableSelectionCell
<Table>
  <TableHeader>
    <TableRow>
      <TableSelectionCell type='checkbox' checked='mixed' />
      <TableHeaderCell sortable sortDirection='ascending'>Name</TableHeaderCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableSelectionCell type='checkbox' checked={false} />
      <TableCell><TableCellLayout media={<Avatar name='Jane' size={24} />}>Jane</TableCellLayout></TableCell>
    </TableRow>
  </TableBody>
</Table>
```

```tsx
// Tree — Tree > TreeItem(itemType) > TreeItemLayout + nested Tree
<Tree defaultOpenItems={['src']} selectionMode='multiselect' size='medium' appearance='subtle'>
  <TreeItem itemType='branch' value='src'>
    <TreeItemLayout>src</TreeItemLayout>
    <Tree><TreeItem itemType='leaf' value='index'><TreeItemLayout>index.tsx</TreeItemLayout></TreeItem></Tree>
  </TreeItem>
</Tree>
```

```tsx
// Toaster / Toast — Toaster holds portal, Toast provides context to Title/Body/Footer
<Toaster>
  <Toast>
    <ToastTitle action={<ToastTrigger><Button appearance='transparent'>Undo</Button></ToastTrigger>}>Saved</ToastTitle>
    <ToastBody>Synced to the cloud</ToastBody>
    <ToastFooter><Link inline>Details</Link></ToastFooter>
  </Toast>
</Toaster>
```

## 5. Quick gotchas

- Tooltip requires the `relationship` prop; the child must be focusable.
- FlatTreeItem requires aria-level, aria-setsize and aria-posinset.
- TreeItem requires `itemType`; AccordionItem requires `value`; every NavItem/NavSubItem requires `value` matching Nav selection props.
- MenuItemCheckbox / MenuItemRadio / MenuItemSwitch require both `name` and `value`; read them through MenuList `checkedValues` / `onCheckedValueChange`.
- Field expects a single control child; pass a render function to spread FieldControlProps onto custom controls.
- disabledFocusable keeps a control in the tab order (needed for tooltips); disabled removes it.
- Toaster must render inside FluentProvider (or set FluentProvider targetDocument).

## Key Takeaways

- Every component is imported from the single barrel '@fluentui/react-components'; there are no per-component packages to import in v9 apps.
- Composite components only work in their documented nesting order: Dialog > DialogTrigger + DialogSurface > DialogBody; Menu > MenuTrigger + MenuPopover > MenuList > MenuItem; Field wraps one control; Tree > TreeItem > TreeItemLayout; Toaster > Toast > ToastTitle/Body/Footer.
- Prop names are shared across components but allowed values differ - 'appearance' means secondary/primary/outline/subtle/transparent on Button but filled/ghost/outline/tint on Badge, and sizes run from 'tiny' on Badge to 'huge' on Spinner/Persona.
- FluentProvider must wrap the app once at the root; it supplies theme, dir, portal target (targetDocument) and applyStylesToPortals, and Toaster/Portal output depends on it.
- Every interactive component follows the controlled/uncontrolled pattern: x plus defaultX for state, and onXChange / onChange for updates.
- Slots (root, icon, action, media, header, footer, collapseMotion, etc.) can be overridden with shorthand objects or custom children, which is the supported extension point instead of restyling internals.

## Examples

### Root provider, buttons and badges

FluentProvider at the app root plus the full button family and badge appearance/color vocabulary.

```tsx
import {
  FluentProvider,
  Button,
  CompoundButton,
  ToggleButton,
  Badge,
  CounterBadge,
  Tooltip,
} from '@fluentui/react-components';

export const Shell = () => (
  <FluentProvider dir='ltr' applyStylesToPortals>
    <Button appearance='primary' size='medium' shape='rounded' iconPosition='before'>
      Save
    </Button>
    <Button appearance='outline' disabledFocusable>
      Disabled but focusable
    </Button>
    <Button appearance='subtle' disabled>
      Not focusable
    </Button>
    <CompoundButton appearance='secondary' secondaryContent='Extra detail line'>
      Compound
    </CompoundButton>
    <ToggleButton defaultChecked>Bold</ToggleButton>

    <Tooltip content='Refresh the list' relationship='description' showDelay={300} withArrow>
      <Button appearance='subtle'>Refresh</Button>
    </Tooltip>

    <Badge appearance='tint' color='success' size='small' shape='rounded' iconPosition='before'>
      New
    </Badge>
    <CounterBadge count={120} overflowCount={99} appearance='filled' color='brand' />
  </FluentProvider>
);
```

### Field-driven form with validation

Field wraps a single control and handles label, hint, required and validationState; includes InfoLabel, Checkbox, RadioGroup, Switch and Select.

```tsx
import * as React from 'react';
import {
  Field,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Radio,
  Switch,
  Label,
  InfoLabel,
} from '@fluentui/react-components';

export const ProfileForm = () => {
  const [name, setName] = React.useState('');

  return (
    <form>
      <Field
        label={<InfoLabel info='Shown on your public profile'>Display name</InfoLabel>}
        required
        orientation='vertical'
        size='medium'
        validationState={name ? 'none' : 'error'}
        validationMessage={name ? undefined : 'Name is required'}
      >
        <Input
          appearance='outline'
          value={name}
          onChange={(ev, data) => setName(data.value)}
        />
      </Field>

      <Field label='Bio' hint='Max 200 characters'>
        <Textarea appearance='outline' resize='vertical' />
      </Field>

      <Field label='Region'>
        <Select size='medium'>
          <option value='eu'>Europe</option>
          <option value='us'>Americas</option>
        </Select>
      </Field>

      <Checkbox label='Subscribe to updates' shape='square' size='medium' defaultChecked />

      <RadioGroup defaultValue='weekly' layout='horizontal'>
        <Radio value='daily' label='Daily' />
        <Radio value='weekly' label='Weekly' />
      </RadioGroup>

      <Switch label='Public profile' labelPosition='after' defaultChecked />
      <Label required weight='semibold' size='medium'>Standalone label</Label>
    </form>
  );
};
```

### Controlled Dialog with trigger and actions

Canonical Dialog composition: Dialog > DialogTrigger + DialogSurface > DialogBody > DialogTitle / DialogContent / DialogActions.

```tsx
import * as React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@fluentui/react-components';

export const ConfirmDelete = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog
      modalType='modal'
      inertTrapFocus
      unmountOnClose
      open={open}
      onOpenChange={(event, data) => setOpen(data.open)}
    >
      <DialogTrigger disableButtonEnhancement>
        <Button appearance='primary'>Delete</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle action={<Button appearance='subtle'>Close</Button>}>
            Delete this item?
          </DialogTitle>
          <DialogContent>This action cannot be undone.</DialogContent>
          <DialogActions fluid>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance='secondary'>Cancel</Button>
            </DialogTrigger>
            <Button appearance='primary' onClick={() => setOpen(false)}>
              Delete
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
```

### Menu with checkbox, radio and grouped items

Menu > MenuTrigger + MenuPopover > MenuList with MenuGroup, MenuDivider, MenuItemCheckbox and MenuItemRadio.

```tsx
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuItemCheckbox,
  MenuItemRadio,
  MenuDivider,
  MenuGroup,
  MenuGroupHeader,
  Button,
} from '@fluentui/react-components';

export const EditMenu = () => (
  <Menu hoverDelay={200} persistOnItemClick={false}>
    <MenuTrigger disableButtonEnhancement>
      <Button>Edit</Button>
    </MenuTrigger>
    <MenuPopover>
      <MenuList hasCheckmarks hasIcons>
        <MenuItem>Undo</MenuItem>
        <MenuItem disabled>Redo</MenuItem>
        <MenuDivider />
        <MenuGroup>
          <MenuGroupHeader>View</MenuGroupHeader>
          <MenuItemCheckbox name='view' value='grid'>Grid</MenuItemCheckbox>
          <MenuItemCheckbox name='view' value='list'>List</MenuItemCheckbox>
        </MenuGroup>
        <MenuDivider />
        <MenuItemRadio name='density' value='comfortable'>Comfortable</MenuItemRadio>
        <MenuItemRadio name='density' value='compact'>Compact</MenuItemRadio>
      </MenuList>
    </MenuPopover>
  </Menu>
);
```

### Table with header cells and selection

Plain Table primitives: TableHeaderCell sortable/sortDirection, TableSelectionCell and TableCellLayout with media.

```tsx
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableCellLayout,
  TableSelectionCell,
  Avatar,
} from '@fluentui/react-components';

type Person = { id: string; name: string; role: string };

export const PeopleTable = ({ items }: { items: Person[] }) => (
  <Table aria-label='People'>
    <TableHeader>
      <TableRow>
        <TableSelectionCell type='checkbox' checked='mixed' />
        <TableHeaderCell sortable sortDirection='ascending'>Name</TableHeaderCell>
        <TableHeaderCell sortable sortDirection={undefined}>Role</TableHeaderCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map((item) => (
        <TableRow key={item.id} appearance='neutral'>
          <TableSelectionCell type='checkbox' checked={false} />
          <TableCell>
            <TableCellLayout media={<Avatar name={item.name} size={24} />} truncate>
              {item.name}
            </TableCellLayout>
          </TableCell>
          <TableCell>{item.role}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
```

### Tabs, Toolbar, Tooltip and Popover

Navigation and overlay primitives side by side: TabList/Tab, Toolbar groups, Tooltip with relationship, and a hover Popover.

```tsx
import {
  TabList,
  Tab,
  Toolbar,
  ToolbarButton,
  ToolbarToggleButton,
  ToolbarDivider,
  ToolbarRadioGroup,
  ToolbarRadioButton,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  Button,
} from '@fluentui/react-components';

export const Chrome = () => (
  <>
    <TabList defaultSelectedValue='home' appearance='subtle' size='medium' vertical={false}>
      <Tab value='home'>Home</Tab>
      <Tab value='docs'>Docs</Tab>
      <Tab value='admin' disabled>Admin</Tab>
    </TabList>

    <Toolbar size='small' vertical={false}>
      <ToolbarRadioGroup>
        <ToolbarRadioButton name='view' value='list' appearance='subtle'>List</ToolbarRadioButton>
        <ToolbarRadioButton name='view' value='grid' appearance='subtle'>Grid</ToolbarRadioButton>
      </ToolbarRadioGroup>
      <ToolbarDivider vertical />
      <ToolbarToggleButton name='bold' value='bold' appearance='subtle'>Bold</ToolbarToggleButton>
      <ToolbarButton appearance='subtle'>Refresh</ToolbarButton>
    </Toolbar>

    <Tooltip content='Refresh data' relationship='description' showDelay={300} hideDelay={0} withArrow>
      <Button appearance='subtle'>R</Button>
    </Tooltip>

    <Popover openOnHover withArrow mouseLeaveDelay={300}>
      <PopoverTrigger disableButtonEnhancement>
        <Button appearance='subtle'>Details</Button>
      </PopoverTrigger>
      <PopoverSurface>Hover content</PopoverSurface>
    </Popover>
  </>
);
```

### Overlay Drawer with header, body and footer

OverlayDrawer composition with DrawerHeaderTitle (heading + action slots) and DrawerBody / DrawerFooter.

```tsx
import {
  OverlayDrawer,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerHeaderNavigation,
  DrawerBody,
  DrawerFooter,
  Button,
} from '@fluentui/react-components';

export const SettingsDrawer = () => (
  <OverlayDrawer defaultOpen>
    <DrawerHeader>
      <DrawerHeaderNavigation>
        <Button appearance='subtle'>Home</Button>
      </DrawerHeaderNavigation>
      <DrawerHeaderTitle
        heading='Settings'
        action={<Button appearance='subtle'>Close</Button>}
      />
    </DrawerHeader>
    <DrawerBody>Drawer content goes here.</DrawerBody>
    <DrawerFooter>
      <Button appearance='primary'>Save</Button>
      <Button appearance='secondary'>Cancel</Button>
    </DrawerFooter>
  </OverlayDrawer>
);
```

### Nav in a NavDrawer with categories

NavDrawer > NavDrawerBody > AppItem / NavItem / NavCategory (NavCategoryItem + NavSubItemGroup + NavSubItem) / NavDivider / NavSectionHeader.

```tsx
import {
  NavDrawer,
  NavDrawerBody,
  NavItem,
  NavCategory,
  NavCategoryItem,
  NavSubItemGroup,
  NavSubItem,
  NavSectionHeader,
  NavDivider,
  AppItem,
} from '@fluentui/react-components';

export const AppNav = () => (
  <NavDrawer
    defaultSelectedValue='home'
    defaultOpenCategories={['settings']}
    onNavItemSelect={(event, data) => console.log(data.value)}
  >
    <NavDrawerBody>
      <AppItem>My app</AppItem>
      <NavItem value='home'>Home</NavItem>
      <NavCategory value='settings'>
        <NavCategoryItem>Settings</NavCategoryItem>
        <NavSubItemGroup>
          <NavSubItem value='profile'>Profile</NavSubItem>
          <NavSubItem value='billing'>Billing</NavSubItem>
        </NavSubItemGroup>
      </NavCategory>
      <NavDivider />
      <NavSectionHeader>More</NavSectionHeader>
      <NavItem value='about'>About</NavItem>
    </NavDrawerBody>
  </NavDrawer>
);
```

### Tree with branches and leaves

Tree with defaultOpenItems and selectionMode; TreeItem requires itemType and nests a nested Tree below its TreeItemLayout.

```tsx
import { Tree, TreeItem, TreeItemLayout } from '@fluentui/react-components';

export const FileTree = () => (
  <Tree
    aria-label='Files'
    defaultOpenItems={['src']}
    selectionMode='multiselect'
    size='medium'
    appearance='subtle'
  >
    <TreeItem itemType='branch' value='src'>
      <TreeItemLayout>src</TreeItemLayout>
      <Tree>
        <TreeItem itemType='leaf' value='index'>
          <TreeItemLayout>index.tsx</TreeItemLayout>
        </TreeItem>
        <TreeItem itemType='leaf' value='app'>
          <TreeItemLayout>App.tsx</TreeItemLayout>
        </TreeItem>
      </Tree>
    </TreeItem>
    <TreeItem itemType='leaf' value='readme'>
      <TreeItemLayout>README.md</TreeItemLayout>
    </TreeItem>
  </Tree>
);
```

### Avatar group with overflow popover

AvatarGroup layouts (spread, stack, pie) with AvatarGroupPopover showing Persona entries and PresenceBadge.

```tsx
import {
  AvatarGroup,
  AvatarGroupItem,
  AvatarGroupPopover,
  Persona,
  PresenceBadge,
} from '@fluentui/react-components';

export const Roster = ({ people }: { people: string[] }) => (
  <AvatarGroup layout='stack' size={32}>
    {people.map((name) => (
      <AvatarGroupItem key={name} name={name} />
    ))}
    <AvatarGroupPopover indicator='count' count={people.length}>
      {people.map((name) => (
        <Persona
          key={name}
          name={name}
          avatar={{ color: 'colorful', idForColor: name }}
          presence={<PresenceBadge status='available' />}
        />
      ))}
    </AvatarGroupPopover>
  </AvatarGroup>
);
```

### Accordion plus tags

Accordion with collapsible/multiple and defaultOpenItems, plus TagGroup with dismissible Tag children.

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  Divider,
  Tag,
  TagGroup,
} from '@fluentui/react-components';

export const FaqAndTags = ({ tags, onRemove }: { tags: string[]; onRemove: (value: string) => void }) => (
  <>
    <Accordion multiple collapsible defaultOpenItems={['shipping']} onToggle={(e, data) => console.log(data.openItems)}>
      <AccordionItem value='shipping'>
        <AccordionHeader size='medium' inline expandIconPosition='end'>
          Shipping
        </AccordionHeader>
        <AccordionPanel>Ships in 2-3 business days.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value='returns' disabled>
        <AccordionHeader>Returns</AccordionHeader>
        <AccordionPanel>Unavailable</AccordionPanel>
      </AccordionItem>
    </Accordion>

    <Divider inset alignContent='start' appearance='subtle' />

    <TagGroup
      dismissible
      size='medium'
      appearance='filled'
      onDismiss={(e, data) => onRemove(String(data.value))}
    >
      {tags.map((tag) => (
        <Tag key={tag} value={tag} dismissible>
          {tag}
        </Tag>
      ))}
    </TagGroup>
  </>
);
```

### Cards with selection and composition slots

Card plus CardHeader, CardPreview and CardFooter, using shouldRestrictTriggerAction so interactive children do not toggle selection.

```tsx
import * as React from 'react';
import {
  Card,
  CardHeader,
  CardPreview,
  CardFooter,
  Button,
  Text,
  Avatar,
} from '@fluentui/react-components';

export const SelectableCard = () => {
  const [selected, setSelected] = React.useState(false);

  return (
    <Card
      appearance='filled'
      orientation='vertical'
      size='medium'
      focusMode='tab-only'
      selected={selected}
      onSelectionChange={(event, data) => setSelected(data.selected)}
      shouldRestrictTriggerAction={(event) => event.target !== event.currentTarget}
    >
      <CardHeader
        image={<Avatar name='Jane Doe' size={32} />}
        header={<Text weight='semibold'>Quarterly report</Text>}
        description={<Text size={200}>Updated 2 days ago</Text>}
        action={<Button appearance='subtle'>More</Button>}
      />
      <CardPreview logo={<img src='/logo.svg' alt='' />} />
      <CardFooter action={<Button appearance='primary'>Open</Button>} />
    </Card>
  );
};
```

### Combobox, Dropdown and Option

Freeform Combobox and Dropdown sharing the Option slot; clearable, placeholder and inlinePopup on Dropdown.

```tsx
import {
  Combobox,
  Dropdown,
  Option,
  Field,
} from '@fluentui/react-components';

export const FruitPickers = () => (
  <>
    <Field label='Freeform fruit'>
      <Combobox freeform>
        <Option value='apple'>Apple</Option>
        <Option value='pear' disabled>Pear</Option>
        <Option value='plum'>Plum</Option>
      </Combobox>
    </Field>

    <Field label='Choose one'>
      <Dropdown
        placeholder='Pick a fruit'
        appearance='outline'
        size='medium'
        clearable
        inlinePopup
        onOpenChange={(event, data) => console.log(data.open)}
      >
        <Option value='apple'>Apple</Option>
        <Option value='pear'>Pear</Option>
      </Dropdown>
    </Field>
  </>
);
```

### Toaster with declarative Toasts

Toaster renders the toast region; each Toast supplies context for ToastTitle (action slot), ToastBody and ToastFooter.

```tsx
import {
  Toaster,
  Toast,
  ToastTitle,
  ToastBody,
  ToastFooter,
  ToastTrigger,
  Button,
  Link,
} from '@fluentui/react-components';

export const ToastHost = ({ toasts }: { toasts: { id: string; text: string }[] }) => (
  <Toaster>
    {toasts.map((toast) => (
      <Toast key={toast.id}>
        <ToastTitle action={<ToastTrigger><Button appearance='transparent'>Undo</Button></ToastTrigger>}>
          {toast.text}
        </ToastTitle>
        <ToastBody>Synced to the cloud</ToastBody>
        <ToastFooter>
          <Link inline>View details</Link>
        </ToastFooter>
      </Toast>
    ))}
  </Toaster>
);
```

### Carousel with nav container

Carousel + CarouselViewport + CarouselSlider + CarouselCard, with CarouselNavContainer prev/next/autoplay slots and a CarouselNav render function.

```tsx
import {
  Carousel,
  CarouselViewport,
  CarouselSlider,
  CarouselCard,
  CarouselNav,
  CarouselNavButton,
  CarouselNavContainer,
  CarouselButton,
  CarouselAutoplayButton,
} from '@fluentui/react-components';

export const Gallery = ({ slides }: { slides: string[] }) => (
  <Carousel align='center' circular groupSize='auto' draggable autoplayInterval={4000}>
    <CarouselViewport>
      <CarouselSlider>
        {slides.map((slide) => (
          <CarouselCard key={slide} autoSize>
            <img src={slide} alt='' />
          </CarouselCard>
        ))}
      </CarouselSlider>
    </CarouselViewport>

    <CarouselNavContainer
      layout='inline'
      prev={<CarouselButton navType='prev' />}
      next={<CarouselButton navType='next' />}
      autoplay={<CarouselAutoplayButton />}
    >
      <CarouselNav>{(index) => <CarouselNavButton aria-label={`Slide ${index + 1}`} />}</CarouselNav>
    </CarouselNavContainer>
  </Carousel>
);
```

## Pitfalls

- Importing from v8/v0 packages or deep paths instead of '@fluentui/react-components' - all listed components and their types ship from the barrel.
- Using 'disabled' when you need a tooltip on the control: disabled removes it from the tab order. Use 'disabledFocusable' to keep it focusable while inactive.
- Forgetting that Tooltip requires the 'relationship' prop ('label', 'description' or 'inaccessible'); omitting it is not valid and changes screen-reader output when wrong.
- Rendering Dialog children without DialogSurface, or Toast parts outside Toast/Toaster - the context (open state, intent, announce, tryRestoreFocus) is provided only by the parent part.
- Passing multiple children to Field or to DialogTrigger/MenuTrigger without 'disableButtonEnhancement' - Field expects a single control (or a render function of FieldControlProps), and triggers clone a single enhanced child.
- Missing required identity props: AccordionItem 'value', TreeItem 'itemType', NavItem/NavSubItem 'value', MenuItemCheckbox/MenuItemRadio/MenuItemSwitch 'name' and 'value', FlatTreeItem aria-level/aria-setsize/aria-posinset.
- Mixing DataGrid parts with Table parts in one tree: DataGrid* (DataGridHeader/Body/Row/Cell) adds sorting, selection and column resizing on top of the plain Table, TableHeader/TableBody/TableRow/TableCell primitives.
- Assuming Avatar colors are random per render - pass 'idForColor' to make 'color' deterministic across renders and consistent between Avatar and Persona.
- Using TableSelectionCell for a checkbox header without 'checked="mixed"' when the selection is partial; the three-state value is how partial selection is expressed.
- Forgetting TagPicker structure: TagPicker > TagPickerControl > TagPickerGroup (with Tag children) + TagPickerButton/Input > TagPickerList > TagPickerOption, otherwise the suggestion list never renders.

**Referenced components**: Accordion, AccordionHeader, AccordionItem, AccordionPanel, AlphaSlider, AppItem, AppItemStatic, AriaLiveAnnouncer, Avatar, AvatarGroup, AvatarGroupItem, AvatarGroupPopover, Badge, Breadcrumb, BreadcrumbButton, BreadcrumbDivider, BreadcrumbItem, Button, Card, CardFooter, CardHeader, CardPreview, Carousel, CarouselAutoplayButton, CarouselButton, CarouselCard, CarouselNav, CarouselNavButton, CarouselNavContainer, CarouselNavImageButton, CarouselSlider, CarouselViewport, Checkbox, ColorArea, ColorPicker, ColorSlider, ColorSwatch, Combobox, CompoundButton, CounterBadge, DataGrid, DataGridBody, DataGridCell, DataGridHeader, DataGridHeaderCell, DataGridRow, DataGridSelectionCell, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Divider, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerHeaderNavigation, DrawerHeaderTitle, Dropdown, EmptySwatch, Field, FlatTree, FlatTreeItem, FluentProvider, Hamburger, Image, ImageSwatch, InfoButton, InfoLabel, InlineDrawer, Input, InteractionTag, InteractionTagPrimary, InteractionTagSecondary, Label, Link, List, ListItem, Listbox, Menu, MenuButton, MenuDivider, MenuGroup, MenuGroupHeader, MenuItem, MenuItemCheckbox, MenuItemLink, MenuItemRadio, MenuItemSwitch, MenuList, MenuPopover, MenuSplitGroup, MenuTrigger, MessageBar, MessageBarActions, MessageBarBody, MessageBarGroup, MessageBarTitle, Nav, NavCategory, NavCategoryItem, NavDivider, NavDrawer, NavDrawerBody, NavDrawerFooter, NavDrawerHeader, NavItem, NavSectionHeader, NavSubItem, NavSubItemGroup, Option, OptionGroup, OverflowDivider, OverflowItem, OverlayDrawer, Persona, Popover, PopoverSurface, PopoverTrigger, Portal, PresenceBadge, ProgressBar, Radio, RadioGroup, Rating, RatingDisplay, RatingItem, SearchBox, Select, Skeleton, SkeletonItem, Slider, SpinButton, Spinner, SplitButton, SplitNavItem, SwatchPicker, SwatchPickerRow, Switch, Tab, TabList, Table, TableBody, TableCell, TableCellActions, TableCellLayout, TableHeader, TableHeaderCell, TableResizeHandle, TableRow, TableSelectionCell, Tag, TagGroup, TagPicker, TagPickerButton, TagPickerControl, TagPickerGroup, TagPickerInput, TagPickerList, TagPickerOption, TagPickerOptionGroup, TeachingPopover, TeachingPopoverBody, TeachingPopoverCarousel, TeachingPopoverCarouselCard, TeachingPopoverCarouselFooter, TeachingPopoverCarouselNav, TeachingPopoverCarouselNavButton, TeachingPopoverCarouselPageCount, TeachingPopoverFooter, TeachingPopoverHeader, TeachingPopoverSurface, TeachingPopoverTitle, TeachingPopoverTrigger, Text, Textarea, Toast, ToastBody, ToastFooter, ToastTitle, ToastTrigger, Toaster, ToggleButton, Toolbar, ToolbarButton, ToolbarDivider, ToolbarGroup, ToolbarRadioButton, ToolbarRadioGroup, ToolbarToggleButton, Tooltip, Tree, TreeItem, TreeItemLayout, TreeItemPersonaLayout

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
