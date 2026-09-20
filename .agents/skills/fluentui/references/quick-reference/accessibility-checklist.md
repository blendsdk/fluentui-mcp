# Accessibility Checklist

> **Category**: quick-reference

> Every row maps an a11y requirement to a **real v9 API**. All components import from `@fluentui/react-components`.
> Union values are written with `/` (e.g. `'polite' / 'assertive'`) to keep tables readable.

## 1. Provider, direction, portals

| Requirement | API | Notes |
|---|---|---|
| RTL / LTR layout | `FluentProvider dir='rtl'` | v9 flips spacing, positioning and anchors automatically. Verify both directions. |
| Contrast & focus colors | `FluentProvider theme` | Use theme tokens; never hardcode hex over a themed surface. |
| Portals losing theme/dir | `FluentProvider applyStylesToPortals` | Keep enabled (default) so Dialog/Popover/Menu/Tooltip stay themed + announced correctly. |
| Portals inside iframes / shadow DOM | `FluentProvider targetDocument` + `Portal mountNode` | Required for focus and event listeners to work at all. |
| Style overrides without breaking a11y | `FluentProvider customStyleHooks_unstable` | Override visuals only — never strip `:focus-visible` outlines. |
| Arbitrary DOM placement | `Portal mountNode`, `Portal children` | Anything rendered through a Portal must still be inside a `FluentProvider`. |

```tsx
<FluentProvider theme={theme} dir={dir} targetDocument={doc}>
  <App />
</FluentProvider>
```

## 2. Label, describe, validate

| Need | API |
|---|---|
| Label + hint + error for any control | `Field` — `label`, `hint`, `validationMessage`, `validationState` ('error' / 'warning' / 'success' / 'none'), `required`, `orientation`, `size`; slots `label`, `validationMessage`, `validationMessageIcon`, `hint` |
| Access to the generated ids | `Field` render-prop child: `children={(props: FieldControlProps) => ...}` |
| Standalone label | `Label` — `required` (boolean or node), `disabled`, `weight`, `size` |
| Extra explanation for a label | `InfoLabel` (`info` prop + `label` / `infoButton` slots), `InfoButton` (`inline`, `size`, `popover`) |
| Grouped radios | `RadioGroup` — `name`, `value` / `defaultValue`, `onChange`, `layout`, `disabled`, `required` |
| Label placement | `Checkbox labelPosition` ('after'), `Radio labelPosition` ('after' / 'below'), `Switch labelPosition` ('above' / 'after' / 'before') |
| Icon-only / ambiguous controls | `Tooltip relationship='label'` (required prop), or `aria-label` on `Button` / `Link` / `CarouselButton` |
| Naming people | `Avatar name`, `Persona name` (+ `presenceOnly` when only status matters) |
| Long text alternatives | `Text` (`block`, `truncate`, `wrap`) — truncation is visual; keep the full string reachable |

```tsx
<Field
  label='Work email'
  required
  validationState={hasError ? 'error' : 'none'}
  validationMessage={hasError ? 'Enter a valid email address.' : undefined}
  hint='Used only for account notices.'
>
  <Input type='email' value={email} onChange={(_, d) => setEmail(d.value)} />
</Field>
```

Rules:
- Never render `Input`, `Textarea`, `Select`, `SpinButton`, `Combobox`, `Dropdown`, `Slider`, `SearchBox` without a programmatic name.
- `validationState='error'` without `validationMessage` announces nothing to screen readers.
- `Checkbox checked='mixed'` is indeterminate — label it (e.g. "Select all").

## 3. Keyboard operability

Every widget ships its own key handling — set the mode prop; don't re-implement arrow keys.

| Widget | Keyboard-related API |
|---|---|
| `Accordion` | `navigation` ('linear' / 'circular'), `collapsible`, `multiple`, `openItems` / `defaultOpenItems`, `onToggle` |
| `AccordionHeader` | `size`, `inline`, `expandIconPosition`; `button` / `expandIcon` / `icon` slots hold the real focus target |
| `AccordionItem` / `AccordionPanel` | `value`, `disabled` |
| `Breadcrumb` | `focusMode` ('arrow' = roving tabindex / 'tab'), `size`; `BreadcrumbButton current` marks the active crumb; `BreadcrumbItem`, `BreadcrumbDivider` |
| `TabList` | `vertical`, `selectTabOnFocus`, `selectedValue` / `defaultSelectedValue`, `onTabSelect`, `disabled`, `appearance`, `reserveSelectedTabSpace`; `Tab value`, `Tab disabled` |
| `Tree` / `FlatTree` | `navigationMode` ('tree' / 'treegrid'), `selectionMode`, `checkedItems`, `openItems`, `defaultOpenItems`, `appearance`, `size` |
| `FlatTreeItem` | **required** `aria-level`, `aria-setsize`, `aria-posinset` (+ `value`) |
| `TreeItem` / `TreeItemLayout` | `itemType`, `value`, `open`, `onOpenChange`, `parentValue`; `selector` slot takes `Checkbox` or `Radio`; `actions`, `iconBefore`, `iconAfter`, `aside`, `expandIcon`, `main` |
| `Toolbar` | `vertical`, `size`, `checkedValues` / `defaultCheckedValues`, `onCheckedValueChange`; `ToolbarRadioButton` and `ToolbarToggleButton` require `name` + `value`; `ToolbarRadioGroup`, `ToolbarGroup`, `ToolbarDivider`, `ToolbarButton` |
| `Menu` | `openOnContext`, `openOnHover` + `hoverDelay`, `closeOnScroll`, `persistOnItemClick`, `inline`, `onOpenChange`; `MenuTrigger focusFirst`; `MenuList checkedValues` / `hasCheckmarks` / `hasIcons` |
| `MenuItem` family | `disabled`, `disabledFocusable`, `hasSubmenu`, `persistOnClick`; `MenuItemCheckbox` / `MenuItemRadio` / `MenuItemSwitch` need `name` + `value`; `MenuItemLink href` |
| `DataGrid` | `selectionMode`, `onSelectionChange`, `onSortChange`, `columnSizingOptions`, `resizableColumnsOptions`; `DataGridCell` / `DataGridHeaderCell` `focusMode`; `DataGridSelectionCell type` ('checkbox' / 'radio') |
| `Table` | `TableHeaderCell sortable` + `sortDirection`; `TableSelectionCell type` / `checked` / `subtle` / `hidden` / `invisible`; `TableCellActions visible` |
| `Card` | `focusMode` ('off' / 'no-tab' / 'tab-exit' / 'tab-only'), `disabled`, `selected`, `onSelectionChange`, `shouldRestrictTriggerAction` |
| `Carousel` | `draggable`, `circular`, `groupSize`, `align`, `whitespace`, `CarouselButton navType` ('prev' / 'next'), `CarouselNavButton`, `CarouselAutoplayButton onCheckedChange` |
| `Slider` / `SpinButton` | `min`, `max`, `step`, `precision`, `vertical`, `value` / `defaultValue` / `displayValue`, `disabled` |
| `Rating` | `step` (0.5 / 1), `max`, `itemLabel={(r) => string}`, `name`, `onChange`; `RatingItem value`; `RatingDisplay` for read-only |
| `Combobox` / `Dropdown` / `Listbox` | `Combobox freeform`, `Dropdown clearable` / `placeholder` / `size`, `Listbox disableAutoFocus`, `TagPickerList disableAutoFocus` |
| `SwatchPicker` | `focusMode` ('arrow' / 'tab'), `layout` ('row' / 'grid'), `selectedValue` / `defaultSelectedValue`, `onSelectionChange`, `size`, `shape`, `spacing`; `SwatchPickerRow`, `ColorSwatch`, `ImageSwatch`, `EmptySwatch` |
| `List` / `ListItem` | `navigationMode`, `selectionMode`, `selectedItems`, `onSelectionChange`; `ListItem value`, `onAction`, `disabledSelection` |
| `Nav` family | `NavDrawer tabbable`, `Nav selectedValue` / `density` / `multiple`, `NavItem`, `NavSubItem`, `NavSubItemGroup`, `NavCategory`, `NavCategoryItem`, `NavSectionHeader`, `NavDivider`, `Hamburger`, `SplitNavItem` (`actionButton` / `toggleButton` / `menuButton` + matching `*Tooltip` slots) |
| `Drawer` family | `Drawer type` ('inline' / 'overlay'), `OverlayDrawer defaultOpen`, `InlineDrawer separator`, `DrawerHeader` / `DrawerHeaderTitle` / `DrawerHeaderNavigation` / `DrawerBody` / `DrawerFooter` |

Keyboard checklist:
- [ ] Tab reaches every interactive element in DOM order.
- [ ] Arrow keys move inside composite widgets (tabs, toolbars, trees, breadcrumbs, carousels, grids, swatch pickers).
- [ ] Enter / Space activate; Escape closes Dialog, Popover, Menu, Drawer.
- [ ] Focus returns to the trigger after an overlay closes.
- [ ] No focus trap except inside a modal `Dialog` or overlay `Drawer`.

## 4. Focus management & overlays

| Overlay | Focus APIs |
|---|---|
| `Dialog` | `modalType`, `open` / `defaultOpen`, `onOpenChange`, `inertTrapFocus`, `unmountOnClose`; `DialogSurface`; `DialogTrigger action` ('primary' / 'secondary' / 'cancel') + `disableButtonEnhancement`; `DialogTitle`, `DialogBody`, `DialogContent`, `DialogActions` (`position`, `fluid`) |
| `Popover` | `trapFocus`, `inertTrapFocus`, `legacyTrapFocus`, `unstable_disableAutoFocus`, `openOnHover`, `openOnContext`, `mouseLeaveDelay`, `closeOnScroll`, `closeOnIframeFocus`, `positioning`, `withArrow`, `appearance`, `onOpenChange`; `PopoverTrigger disableButtonEnhancement`, `PopoverSurface root` |
| `Menu` | `onOpenChange`, `openOnHover` + `hoverDelay`, `openOnContext`, `closeOnScroll`, `MenuTrigger focusFirst` / `disableButtonEnhancement` |
| `Drawer` | `Drawer type`, `OverlayDrawer defaultOpen`, `InlineDrawer separator`; header/body/footer parts provide landmark structure |
| `Toast` | `ToastBody visible`, `announce`, `intent`, `tryRestoreFocus`, `subtitle`, `inline`; `ToastTitle media` / `action`; `Toaster announce` / `inline`; `ToastTrigger`; `Toast appearance` |
| `Card` | `focusMode` — 'off' removes the tab stop, 'tab-only' makes the whole card one stop; `floatingAction` / `checkbox` slots |

Notes:
- `Dialog` is modal by default and takes its accessible name from `DialogTitle` — always include one.
- `Popover` is **not** modal by default: add `trapFocus` (or `inertTrapFocus`), or use `Dialog` for genuine modals.
- `openOnHover` / `openOnContext` alone is not keyboard accessible — always keep a focusable `*Trigger`.
- `Portal mountNode`-based overlays need the same `FluentProvider` context (see §1).

## 5. Announce dynamic content

| Need | API |
|---|---|
| Programmatic announcement | `AriaLiveAnnouncer` (renders its children in a live region) |
| Status / error banners | `MessageBar intent`, `politeness` ('polite' / 'assertive'), `shape`; `MessageBarBody`, `MessageBarTitle`, `MessageBarActions containerAction` / `inline`, `MessageBarGroup animate` ('exit-only' / 'both') |
| Toasts | `Toaster announce` / `inline`; `ToastBody announce`, `visible`, `intent`, `tryRestoreFocus`; `ToastTitle media` / `action`; `Toast appearance` |
| Loading | `Spinner labelPosition` ('above' / 'below' / 'before' / 'after'), `size`, `delay`, `appearance`; `Skeleton` / `SkeletonItem animation`, `appearance`, `shape`, `width` |
| Progress | `ProgressBar value`, `max`, `shape`, `thickness`, `color` (omit `value` for indeterminate) |
| Carousel slide changes | `Carousel announcement` (announcer function) + `activeIndex` / `defaultActiveIndex` / `onActiveIndexChange` |
| Counts / presence | `CounterBadge count`, `overflowCount`, `showZero`, `dot`; `Badge iconPosition`; `PresenceBadge status`, `outOfOffice` |
| Selection feedback | `TagGroup onDismiss` / `selectedValues` / `onTagSelect`; `InteractionTag selected`; `SwatchPicker onSelectionChange`; `Rating onChange` |

```tsx
<>
  <MessageBar intent='error' politeness='assertive'>
    <MessageBarBody>
      <MessageBarTitle>Upload failed</MessageBarTitle>
      The file exceeds the 25 MB limit.
    </MessageBarBody>
  </MessageBar>

  {/* Use for text-only updates no component already announces */}
  <AriaLiveAnnouncer>{statusText}</AriaLiveAnnouncer>
</>
```

Reserve `politeness='assertive'` / `announce='assertive'` for blockers; everything else stays polite.

## 6. Disabled, required, loading states

| Intent | Do | Don't |
|---|---|---|
| Unavailable but still discoverable | `disabledFocusable` on `Button`, `CompoundButton`, `MenuButton`, `SplitButton`, `Link`, `MenuItem` | `disabled` — it removes the control from the tab order and hides the reason |
| Accessible toggle semantics | `ToggleButton isAccessible` (also on toggle-capable `CompoundButton` / `MenuButton` / `SplitButton`) | Silently dropping the checked state from the a11y tree |
| Required input | `Field required`, `Label required`, `RadioGroup required` | Visual asterisk only |
| Invalid input | `Field validationState='error'` + `validationMessage` (+ `validationMessageIcon`) | Red border only |
| Disabled label styling | `Label disabled` | Low-contrast custom CSS |
| Loading region | `Spinner` / `ProgressBar` / `Skeleton` placed next to the content it replaces | Unexplained layout shift |

## 7. Semantics, structure, landmarks

| Need | API |
|---|---|
| Sortable table headers | `TableHeaderCell sortable` + `sortDirection`, slots `sortIcon`, `button`, `aside` |
| Row selection | `TableSelectionCell type`, `checked`, `subtle`, `hidden`, `invisible`; `DataGridSelectionCell` equivalents |
| Rich cell content | `TableCellLayout media` / `main` / `description`, `truncate`, `appearance='primary'` |
| Row hover actions | `TableCellActions visible` |
| Tree / treegrid semantics | `Tree navigationMode='treegrid'` + `TreeItemLayout selector` (`Checkbox` or `Radio`), `actions`, `iconBefore`, `iconAfter`, `aside` |
| Person rows in trees | `TreeItemPersonaLayout media` / `main` / `description` |
| Reusable list semantics | `List navigationMode`, `selectionMode`; `ListItem value`, `onAction`, `disabledSelection` |
| Removable chips | `Tag dismissible`, `dismissIcon` slot; `TagGroup onDismiss`, `dismissible`, `size` |
| Selectable chips | `InteractionTag selected`, `disabled`, `value`; `InteractionTagPrimary hasSecondaryAction`; `InteractionTagSecondary` |
| Listbox options | `Option disabled`, `Option value`; `OptionGroup label`; `Combobox`, `Dropdown inlinePopup` |
| Tabs | `Tab value`, `disabled`, `icon`, `content`; `TabList appearance`, `reserveSelectedTabSpace` |
| Disclosure sections | `AccordionHeader` `button` / `expandIcon` / `icon` slots; `AccordionPanel` |
| Nav headings | `NavSectionHeader`, `AppItem` / `AppItemStatic` |
| Dividers | `Divider vertical`, `inset`, `appearance`, `alignContent` — decorative only, never the sole separator of meaning |
| Tag pickers | `TagPicker noPopover` / `inline`, `TagPickerControl`, `TagPickerGroup disabled`, `TagPickerInput value` / `disabled`, `TagPickerOption value`, `TagPickerOptionGroup`, `TagPickerButton disabled` |

## 8. Color, contrast, motion, i18n

| Item | Guidance / API |
|---|---|
| Never color-only meaning | `Badge color` + `iconPosition`, `CounterBadge`, `PresenceBadge status`, `MessageBar intent` — always pair with text or an icon |
| Contrast | Use `FluentProvider theme` tokens; never hardcode hex over a themed surface |
| Text hierarchy | `Text size`, `weight`, `font`, `block`, `wrap`, `truncate`, `underline`, `strikethrough` (`block` for real spacing, not `<br>`) |
| Motion | `DialogSurface backdropMotion`, `Popover surfaceMotion`, `Carousel motion`, `MessageBarGroup animate`, `NavSubItemGroup collapseMotion`, `AccordionPanel`/`Tree` `collapseMotion`/`surfaceMotion` — keep the defaults so theme motion (reduced-motion) applies |
| RTL / i18n | `FluentProvider dir`; positioning props (`Popover positioning`, `Tooltip positioning`, `Menu positioning`, `Dropdown positioning`) auto-flip |
| Zoom / reflow | Verify at 200–400% zoom; `Carousel whitespace` / `groupSize` / `align`, `TabList reserveSelectedTabSpace`, `TableCellLayout truncate` prevent clipping |
| Images | `Image block`, `bordered`, `fit`, `shape`, `shadow`; `Avatar shape` / `size` / `active` — decorative media should not be the only carrier of meaning |

## 9. Definition of done

- [ ] Every control has a programmatic name (`Field` / `Label`, `aria-label`, or `Tooltip relationship='label'`).
- [ ] Errors use `Field validationState='error'` + `validationMessage`.
- [ ] `disabledFocusable` used instead of `disabled` for buttons, links and menu items.
- [ ] Every overlay (`Dialog`, `Popover`, `Menu`, `Drawer`) has a title and restores focus to its trigger.
- [ ] Hover-opened `Menu` / `Popover` also opens via keyboard.
- [ ] Async updates announced (`AriaLiveAnnouncer`, `MessageBar politeness`, `Toaster announce`).
- [ ] Composite widgets keep built-in arrow keys (`focusMode`, `navigationMode`, `selectTabOnFocus`, `ToolbarRadioGroup`).
- [ ] Trees supply `aria-level` / `aria-setsize` / `aria-posinset` (`FlatTreeItem`).
- [ ] App verified with `dir='ltr'` and `dir='rtl'`, keyboard-only, and with a screen reader.

## Key Takeaways

- Pair every input with Field (or Label) — Field auto-generates ids and links label, hint and validationMessage to the control, and exposes them via the FieldControlProps render prop.
- Use disabledFocusable instead of disabled on Button, CompoundButton, MenuButton, SplitButton, Link and MenuItem so keyboard and screen-reader users can still discover and hear why a control is unavailable.
- Tooltip.relationship is required: use 'label' when the tooltip is the control's only name (icon-only buttons), 'description' for supplementary text, and 'inaccessible' only when it must be hidden from AT.
- Dialogs are modal by default and manage focus; Popover and Menu are not — add trapFocus/inertTrapFocus for modal-like popovers, never rely on openOnHover/openOnContext alone, and always restore focus to the trigger.
- Announce async changes with AriaLiveAnnouncer, MessageBar politeness or Toaster/ToastBody announce; keep politeness='polite' unless the message is a blocker.
- Composite widgets already implement arrow keys — configure them via focusMode (Breadcrumb, SwatchPicker, Card, DataGrid cells), navigationMode (Tree, FlatTree, List), selectTabOnFocus (TabList), or Accordion navigation='linear'/'circular' instead of writing your own handlers.
- FlatTreeItem requires aria-level, aria-setsize and aria-posinset; Tree/FlatTree navigationMode='treegrid' plus TreeItemLayout selector (Checkbox/Radio) gives correct grid semantics.
- Set FluentProvider dir='rtl' for right-to-left layouts — spacing, anchors and positioning all flip, and portalled overlays inherit dir and theme as long as applyStylesToPortals is left enabled.

## Examples

### Accessible form field with label, hint and error

Field wires the label, hint and validation message ids to the control automatically and announces validation state.

```tsx
import * as React from 'react';
import { Field, Input } from '@fluentui/react-components';

export const EmailField = () => {
  const [email, setEmail] = React.useState('');
  const hasError = email.length > 0 && !email.includes('@');

  return (
    <Field
      label='Work email'
      required
      validationState={hasError ? 'error' : 'none'}
      validationMessage={hasError ? 'Enter a valid email address.' : undefined}
      hint='Used only for account notices.'
    >
      <Input
        type='email'
        value={email}
        onChange={(_, data) => setEmail(data.value)}
      />
    </Field>
  );
};
```

### Modal Dialog with a title and focus-returning trigger

Dialog is modal by default, traps focus, and restores focus to the triggering Button on close. DialogTitle supplies the dialog's accessible name.

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
} from '@fluentui/react-components';

export const ConfirmDelete = ({ onDelete }: { onDelete: () => void }) => (
  <Dialog inertTrapFocus unmountOnClose>
    <DialogTrigger disableButtonEnhancement>
      <Button>Delete file</Button>
    </DialogTrigger>

    <DialogSurface>
      <DialogBody>
        <DialogTitle>Delete file?</DialogTitle>
        <DialogContent>This action cannot be undone.</DialogContent>
        <DialogActions>
          <DialogTrigger disableButtonEnhancement action='cancel'>
            <Button appearance='secondary'>Cancel</Button>
          </DialogTrigger>
          <Button appearance='primary' onClick={onDelete}>
            Delete
          </Button>
        </DialogActions>
      </DialogBody>
    </DialogSurface>
  </Dialog>
);
```

### Announcing async results

MessageBar carries intent + politeness for status banners; AriaLiveAnnouncer covers text-only updates nothing else announces; Toaster/ToastBody announce toast content and try to restore focus.

```tsx
import {
  AriaLiveAnnouncer,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Toast,
  ToastBody,
  ToastTitle,
  Toaster,
} from '@fluentui/react-components';

export const StatusRegion = ({ statusText, toastRef }: { statusText: string; toastRef: React.RefObject<HTMLButtonElement> }) => (
  <>
    <MessageBar intent='error' politeness='assertive'>
      <MessageBarBody>
        <MessageBarTitle>Upload failed</MessageBarTitle>
        The file exceeds the 25 MB limit.
      </MessageBarBody>
    </MessageBar>

    {/* Live region for updates that have no visible component of their own */}
    <AriaLiveAnnouncer>{statusText}</AriaLiveAnnouncer>

    <Toaster>
      <Toast>
        <ToastTitle>Upload complete</ToastTitle>
        <ToastBody
          announce='polite'
          intent='success'
          visible
          tryRestoreFocus={() => toastRef.current?.focus()}
        >
          3 files were uploaded.
        </ToastBody>
      </Toast>
    </Toaster>
  </>
);
```

### Keyboard-operable Toolbar

Toolbar supplies roving focus; ToolbarRadioGroup/ToolbarToggleButton need name + value and are announced as a group. Do not re-implement arrow keys.

```tsx
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarGroup,
  ToolbarRadioButton,
  ToolbarRadioGroup,
  ToolbarToggleButton,
} from '@fluentui/react-components';

export const FormattingBar = () => (
  <Toolbar
    aria-label='Text formatting'
    size='small'
    defaultCheckedValues={{ align: ['left'], format: [] }}
  >
    <ToolbarGroup role='presentation'>
      <ToolbarButton>Cut</ToolbarButton>
      <ToolbarButton>Copy</ToolbarButton>
      <ToolbarDivider />
      <ToolbarToggleButton name='format' value='italic'>
        Italic
      </ToolbarToggleButton>
      <ToolbarToggleButton name='format' value='underline'>
        Underline
      </ToolbarToggleButton>
    </ToolbarGroup>

    <ToolbarRadioGroup aria-label='Alignment'>
      <ToolbarRadioButton name='align' value='left'>Left</ToolbarRadioButton>
      <ToolbarRadioButton name='align' value='center'>Center</ToolbarRadioButton>
      <ToolbarRadioButton name='align' value='right'>Right</ToolbarRadioButton>
    </ToolbarRadioGroup>
  </Toolbar>
);
```

### Icon-only button with a labelling Tooltip

Tooltip.relationship is required: 'label' when the tooltip names the trigger, 'description' for supplementary text.

```tsx
import { Button, Tooltip } from '@fluentui/react-components';

export const RowActions = ({ disabled }: { disabled: boolean }) => (
  <>
    {/* Tooltip supplies the accessible name for the icon-only button */}
    <Tooltip content='Delete row' relationship='label'>
      <Button icon={<DeleteIcon />} />
    </Tooltip>

    {/* Supplementary information about an already-labelled control */}
    <Tooltip content='Deleting is permanent' relationship='description'>
      <Button>Remove</Button>
    </Tooltip>

    {/* Stay focusable so keyboard/AT users can discover why it is unavailable */}
    <Button disabledFocusable={disabled}>Apply</Button>
  </>
);
```

### Accessible table with a sortable header and selection column

TableHeaderCell exposes sort state to assistive tech; TableSelectionCell renders the accessible checkbox/radio cell and can be visually softened.

```tsx
import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell,
} from '@fluentui/react-components';

export const TeamTable = () => (
  <Table aria-label='Team members'>
    <TableHeader>
      <TableRow>
        <TableSelectionCell type='checkbox' checked='mixed' subtle />
        <TableHeaderCell sortable sortDirection='ascending'>
          Name
        </TableHeaderCell>
        <TableHeaderCell>Role</TableHeaderCell>
      </TableRow>
    </TableHeader>

    <TableBody>
      <TableRow>
        <TableSelectionCell type='checkbox' checked={false} />
        <TableCell>
          <TableCellLayout
            media={<Avatar name='Ada Lovelace' />}
            description='ada@contoso.com'
          >
            Ada Lovelace
          </TableCellLayout>
        </TableCell>
        <TableCell>Engineer</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);
```

### RTL/theme-aware provider with portals

Direction and theme propagate to portalled overlays so Dialog/Popover/Menu/Tooltip flip and stay themed; targetDocument keeps focus and events working inside iframes.

```tsx
import * as React from 'react';
import { FluentProvider, Portal } from '@fluentui/react-components';

export const AppRoot = ({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: React.ComponentProps<typeof FluentProvider>['theme'];
}) => {
  const [dir] = React.useState<'ltr' | 'rtl'>('rtl');

  return (
    <FluentProvider
      dir={dir}
      theme={theme}
      targetDocument={document}
      applyStylesToPortals
    >
      {/* Portalled overlays still inherit theme + direction */}
      <Portal mountNode={document.querySelector('#portal-root') as HTMLElement}>
        {children}
      </Portal>
    </FluentProvider>
  );
};
```

## Pitfalls

- Using disabled removes the control from the tab order and hides its reason from screen readers — prefer disabledFocusable for buttons, links and menu items.
- Forgetting Tooltip.relationship triggers a dev warning and leaves icon-only buttons unnamed; 'label' vs 'description' changes whether the tooltip becomes the accessible name or just a description.
- A Popover or Menu that only opens on hover/context is unreachable by keyboard — always keep a focusable PopoverTrigger/MenuTrigger and pair hover behavior with onOpenChange.
- Rendering a Dialog without DialogTitle leaves the dialog surface without an accessible name.
- Setting validationState='error' without validationMessage announces nothing; the error must be text, not just a red border.
- Encoding status purely in color (Badge/CounterBadge/PresenceBadge/MessageBar color) fails low-vision and color-blind users — add iconPosition icons or text.
- Overriding classNames or customStyleHooks_unstable to remove focus outlines breaks keyboard visibility; override visuals, never :focus-visible.
- Rendering overlays outside FluentProvider (or with applyStylesToPortals disabled) loses theme, direction and context for portalled content — use Portal mountNode plus targetDocument when targeting iframes/shadow DOM.
- Building tables with raw divs instead of Table/DataGrid drops sortable-header semantics (TableHeaderCell sortable/sortDirection) and selection semantics (TableSelectionCell type='checkbox'/'radio').
- Truncating text with Text truncate or TableCellLayout truncate hides content visually but leaves no accessible full value — provide the complete string in an accessible description or title.

**Referenced components**: Accordion, AccordionHeader, AccordionItem, AccordionPanel, AppItem, AppItemStatic, AriaLiveAnnouncer, Avatar, Badge, Breadcrumb, BreadcrumbButton, BreadcrumbDivider, BreadcrumbItem, Button, Card, Carousel, CarouselAutoplayButton, CarouselButton, CarouselNavButton, Checkbox, ColorSwatch, Combobox, CompoundButton, CounterBadge, DataGrid, DataGridCell, DataGridHeaderCell, DataGridSelectionCell, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Divider, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerHeaderNavigation, DrawerHeaderTitle, Dropdown, EmptySwatch, Field, FlatTree, FlatTreeItem, FluentProvider, Hamburger, Image, ImageSwatch, InfoButton, InfoLabel, InlineDrawer, Input, InteractionTag, InteractionTagPrimary, InteractionTagSecondary, Label, Link, List, ListItem, Listbox, Menu, MenuItem, MenuItemCheckbox, MenuItemLink, MenuItemRadio, MenuItemSwitch, MenuList, MenuTrigger, MessageBar, MessageBarActions, MessageBarBody, MessageBarGroup, MessageBarTitle, Nav, NavCategory, NavCategoryItem, NavDivider, NavDrawer, NavItem, NavSectionHeader, NavSubItem, NavSubItemGroup, Option, OptionGroup, OverlayDrawer, Persona, Popover, PopoverSurface, PopoverTrigger, Portal, PresenceBadge, ProgressBar, Radio, RadioGroup, Rating, RatingDisplay, RatingItem, SearchBox, Select, Skeleton, SkeletonItem, Slider, SpinButton, Spinner, SplitButton, SplitNavItem, SwatchPicker, SwatchPickerRow, Switch, Tab, TabList, Table, TableBody, TableCell, TableCellActions, TableCellLayout, TableHeader, TableHeaderCell, TableRow, TableSelectionCell, Tag, TagGroup, TagPicker, TagPickerButton, TagPickerControl, TagPickerGroup, TagPickerInput, TagPickerList, TagPickerOption, TagPickerOptionGroup, Text, Textarea, Toast, ToastBody, ToastTitle, ToastTrigger, Toaster, ToggleButton, Toolbar, ToolbarButton, ToolbarDivider, ToolbarGroup, ToolbarRadioButton, ToolbarRadioGroup, ToolbarToggleButton, Tooltip, Tree, TreeItem, TreeItemLayout, TreeItemPersonaLayout

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
