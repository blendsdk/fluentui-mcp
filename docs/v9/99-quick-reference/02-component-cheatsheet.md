# Quick Reference: Component Cheatsheet

> **Parent**: [Quick Reference Index](00-quick-ref-index.md)

## "What component should I use?"

| Need | Component | Key Props |
|------|-----------|-----------|
| **User action** | `Button` | `appearance`, `icon`, `size`, `disabled` |
| **Action + description** | `CompoundButton` | `secondaryContent` |
| **Button opens menu** | `MenuButton` | + Menu components |
| **Button with split action** | `SplitButton` | + Menu components |
| **Toggle on/off** | `ToggleButton` | `checked`, `icon` |
| **Text input** | `Input` | `value`, `onChange`, `type`, `contentBefore/After` |
| **Multi-line text** | `Textarea` | `value`, `onChange`, `resize` |
| **Search** | `SearchBox` | `value`, `onChange`, `dismiss` |
| **Native dropdown** | `Select` | `value`, `onChange` |
| **Searchable dropdown** | `Combobox` | `value`, `onOptionSelect`, `multiselect` |
| **Tag multi-select** | `TagPicker` | `onOptionSelect`, `selectedOptions` |
| **Check on/off** | `Checkbox` | `checked`, `onChange` |
| **Select one of many** | `RadioGroup` + `Radio` | `value`, `onChange` |
| **Boolean toggle** | `Switch` | `checked`, `onChange` |
| **Range value** | `Slider` | `value`, `onChange`, `min`, `max` |
| **Numeric +/-** | `SpinButton` | `value`, `onChange`, `min`, `max`, `step` |
| **Form field wrapper** | `Field` | `label`, `validationMessage`, `required` |
| **Star rating** | `Rating` | `value`, `onChange`, `max` |
| **Label + info tooltip** | `InfoLabel` | `info` (popover content) |
| **Date picker** | `DatePicker` | `value`, `onSelectDate` |
| **Time picker** | `TimePicker` | `value`, `onTimeChange` |
| **Calendar** | `Calendar` | `value`, `onSelectDate` |
| **Color selection** | `ColorPicker` | `color`, `onColorChange` |
| **Color swatches** | `SwatchPicker` | `value`, `onSelectionChange` |

---

## Navigation Components

| Need | Component | Key Props |
|------|-----------|-----------|
| **Dropdown menu** | `Menu` + `MenuTrigger` + `MenuPopover` + `MenuList` + `MenuItem` | `open`, `onOpenChange` |
| **Tab switching** | `TabList` + `Tab` | `selectedValue`, `onTabSelect` |
| **Page breadcrumb** | `Breadcrumb` + `BreadcrumbItem` + `BreadcrumbButton` | `current` on active item |
| **Sidebar nav** | `Nav` + `NavItem` + `NavCategory` | `selectedValue`, `onNavItemSelect` |
| **Sidebar drawer** | `NavDrawer` + `NavDrawerBody` + `NavDrawerHeader` | `open`, `type` |
| **Hyperlink** | `Link` | `href`, `as` (for router) |

---

## Data Display Components

| Need | Component | Key Props |
|------|-----------|-----------|
| **User photo** | `Avatar` | `name`, `image`, `size`, `badge` |
| **Status indicator** | `Badge` | `appearance`, `color`, `size` |
| **Styled text** | `Text` | `size`, `weight`, `align`, `block` |
| **Image** | `Image` | `src`, `alt`, `fit`, `shape` |
| **Person card** | `Persona` | `name`, `secondaryText`, `avatar` |
| **Loading skeleton** | `Skeleton` + `SkeletonItem` | `animation` |
| **Simple data table** | `Table` + `TableHeader` + `TableRow` + `TableCell` | — |
| **Interactive data grid** | `DataGrid` + `DataGridHeader` + `DataGridRow` + `DataGridCell` | `items`, `columns`, `sortable`, `selectionMode` |
| **Chip/tag** | `Tag` | `appearance`, `dismissible` |
| **Hierarchical data** | `Tree` + `TreeItem` + `TreeItemLayout` | `openItems`, `onOpenChange` |
| **Vertical list** | `List` + `ListItem` | — |

---

## Feedback Components

| Need | Component | Key Props |
|------|-----------|-----------|
| **Modal dialog** | `Dialog` + `DialogTrigger` + `DialogSurface` + `DialogTitle` + `DialogBody` + `DialogActions` | `open`, `onOpenChange`, `modalType` |
| **Toast notification** | `Toaster` + `useToastController` + `Toast` + `ToastTitle` | `useToastController().dispatchToast(...)` |
| **Inline message** | `MessageBar` + `MessageBarBody` | `intent` (`info`, `warning`, `error`, `success`) |
| **Hover tooltip** | `Tooltip` | `content`, `relationship` (`label` or `description`) |
| **Loading spinner** | `Spinner` | `size`, `label` |
| **Progress bar** | `ProgressBar` | `value`, `max`, `thickness` |

---

## Overlay Components

| Need | Component | Key Props |
|------|-----------|-----------|
| **Floating content** | `Popover` + `PopoverTrigger` + `PopoverSurface` | `open`, `onOpenChange` |
| **Side panel** | `Drawer` + `DrawerHeader` + `DrawerBody` | `open`, `onOpenChange`, `position`, `type` |
| **Onboarding popover** | `TeachingPopover` + `TeachingPopoverTrigger` + `TeachingPopoverSurface` | `open`, `onOpenChange` |

---

## Layout & Utility Components

| Need | Component | Key Props |
|------|-----------|-----------|
| **Content card** | `Card` + `CardHeader` + `CardFooter` + `CardPreview` | `appearance`, `orientation` |
| **Content separator** | `Divider` | `vertical`, `appearance`, `inset` |
| **Collapsible sections** | `Accordion` + `AccordionItem` + `AccordionHeader` + `AccordionPanel` | `openItems`, `onToggle`, `multiple` |
| **Action bar** | `Toolbar` + `ToolbarButton` + `ToolbarDivider` | `size` |
| **Overflow menu** | `Overflow` + `OverflowItem` + `useIsOverflowItemVisible` | `minimumVisible` |
| **Content slider** | `Carousel` + `CarouselCard` + `CarouselButton` + `CarouselNav` | `activeIndex`, `circular` |

---

## Button Appearances Quick Reference

```typescript
<Button appearance="primary">Primary</Button>    // Solid brand color
<Button appearance="secondary">Secondary</Button> // Default, outlined
<Button appearance="subtle">Subtle</Button>        // Minimal, no border
<Button appearance="outline">Outline</Button>      // Border only
<Button appearance="transparent">Transparent</Button> // No visible background
```

---

## Common Component Compositions

### Form Field (Label + Input + Validation)

```typescript
<Field label="Email" required validationMessage="Email is required" validationState="error">
  <Input type="email" />
</Field>
```

### Confirm Dialog

```typescript
<Dialog>
  <DialogTrigger><Button>Delete</Button></DialogTrigger>
  <DialogSurface>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogBody>Are you sure?</DialogBody>
    <DialogActions>
      <DialogTrigger><Button appearance="secondary">Cancel</Button></DialogTrigger>
      <Button appearance="primary" onClick={handleDelete}>Delete</Button>
    </DialogActions>
  </DialogSurface>
</Dialog>
```

### Toast Notification

```typescript
const { dispatchToast } = useToastController('toaster-id');

dispatchToast(
  <Toast>
    <ToastTitle>Saved successfully</ToastTitle>
  </Toast>,
  { intent: 'success', position: 'bottom-end' }
);

// Don't forget: <Toaster toasterId="toaster-id" /> in your app root
```

---

## See Also

- [Component Index](../02-components/00-component-index.md) — Full component documentation
- [Setup & Imports](01-setup-imports.md) — Import patterns
- [Common Patterns](04-common-patterns.md) — UI pattern implementations
