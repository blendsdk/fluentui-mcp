# Accessibility Guide

> **Category**: foundation

Fluent UI React v9 (`@fluentui/react-components`) ships components that already implement WAI-ARIA authoring patterns: roles, states, keyboard interaction, and focus management live inside the components. This guide explains what the library gives you for free, what you still own as an app author, and exactly which v9 props expose accessibility behavior.

**The golden rule: compose, don't patch.** If a Fluent component already renders a `<button>`, a `<table>`, or a `role="dialog"` surface, do not add your own `role`, `tabIndex`, or state ARIA on top of it. Duplicating or overriding those attributes is the most common way to break an otherwise accessible v9 app.

---

## 1. Start at the root: `FluentProvider`

`FluentProvider` is the accessibility root of a v9 application. It supplies:

- **Direction** through `dir` (`"ltr" | "rtl"`).
- **Theme tokens** (contrast-checked colors, focus indicators, typography) through `theme`.
- **Portal styling context** through `applyStylesToPortals`: overlay components (Dialog, Popover, Menu, Tooltip, Drawer) render through `Portal` into `document.body`, and the provider keeps those portaled subtrees styled and mirrored correctly.
- **`targetDocument`** for apps hosted in an iframe or a secondary browser window.

Render exactly one provider around your application shell. If you must render into an unusual mount node with `Portal`'s `mountNode` prop, wrap that subtree in a nested `FluentProvider` (or rely on `applyStylesToPortals`) so theme, direction, and tokens still apply.

### Direction, mirroring, and localization

Setting `dir="rtl"` on `FluentProvider` flips the layout of every Fluent component. To stay direction-safe:

- Never hand-roll `left`/`right` offsets in custom CSS; use logical properties and Fluent spacing tokens.
- Prefer direction-aware values such as `Text`'s `align="start" | "end"` over `left`/`right`.
- Do not rebuild label strings by concatenation for announcements; supply full, translated sentences (word order differs by language).

### Portals and reading order

Portaled content lives at the end of the DOM, so visual order and DOM order diverge while an overlay is open. Keep the *closed* document's reading order logical, because that is what assistive technology (AT) traverses by default. When a modal surface opens, contain focus (`Dialog` with `inertTrapFocus`, or `Popover` with `trapFocus`/`inertTrapFocus`) so background content is no longer reachable.

---

## 2. Accessible names: every control needs one

A control without an accessible name is announced as an unlabeled widget. In v9 you have three idiomatic options:

1. **Visible text content** — best for users of all abilities. `Button`, `ToggleButton`, `Tab`, `MenuItem`, `TreeItemLayout`, and `NavItem` all derive their name from children.
2. **`Field` and `Label`** — `Field` wraps a single form control and exposes `label`, `hint`, `required`, `validationState`, and `validationMessage`. The label text becomes the control's accessible name, and the hint/validation message become its description. `Label` (`required`, `disabled`, `size`, `weight`) is the standalone building block when a controlled layout owns the wrapping. `InfoLabel` places an informational popover next to a label and keeps the help text reachable by keyboard instead of hiding it in a `title` attribute.
3. **`aria-label` / `aria-labelledby` passed through slot props** — reserved for icon-only controls. Every Fluent component forwards unknown props to its root slot, so `<Button icon={...} aria-label="Delete row" />` is valid and necessary.

### Tooltip relationships are required

`Tooltip`'s `relationship` prop is **required** and has three modes that map directly to ARIA semantics:

| `relationship` | Behavior | When to use |
| --- | --- | --- |
| `"label"` | The tooltip text becomes the trigger's accessible name. | Icon-only buttons, toolbar buttons, avatar-style triggers. |
| `"description"` | The tooltip text becomes the trigger's accessible *description*. | Extra context on top of an existing name (shortcuts, caveats). |
| `"inaccessible"` | Visually shown but not associated with the trigger. | Purely decorative or already-duplicated text. |

Rules of thumb:

- A tooltip must never be the only place essential information appears — it is unavailable on touch and easy to miss.
- Do not use a tooltip to compensate for a missing `Field` label on a form control; use `Field`/`Label`.
- Keep tooltip content short; long prose belongs in `PopoverSurface` or `InfoLabel`.

---

## 3. Forms: labeling, validation, and error recovery

`Field` is the single most valuable accessibility component for forms. Its `validationState` (`"error" | "warning" | "success" | "none"`) pairs with `validationMessage` and produces both a visible message and a programmatic description for AT.

Key practices:

- **Always label.** `label` on `Field` (or an explicit `aria-label`) for `Input`, `Textarea`, `Select`, `Dropdown`, `Combobox`, `SearchBox`, `SpinButton`, `Slider`, and `Rating`. Never rely on placeholder text as a label — it disappears on input and often fails contrast.
- **Mark optional vs required consistently.** Use `Field`'s `required` (and `Label`'s `required`) rather than a decorative asterisk in the text.
- **Group related controls.** `RadioGroup` renders a labeled group; for checkbox clusters, wrap them in a plain `<fieldset>`/`<legend>` and pass `RadioGroup`'s `required`/`disabled` where they apply.
- **Describe mixed states.** `Checkbox` accepts `checked="mixed"`. Screen readers announce the mixed state, but users still need a visible explanation such as a `Text` or `MessageBar` describing which children are selected.
- **Announce errors.** After a failed submit, either move focus to the first invalid field, or announce a summary with `MessageBar` (`intent="error"`, `politeness="assertive"`). Do not do both for the same message.
- **Choose the right control.** Use `Checkbox` when the change is applied on submit, and `Switch` when the change takes effect immediately. `Switch` also supports `disabledFocusable` for controls that must remain reachable while inert.
- **Give numeric controls context.** `SpinButton` (`min`, `max`, `step`, `stepPage`, `precision`), `Slider` (`min`, `max`, `step`), `ColorSlider`, and `ColorArea` expose value semantics; the visible label and unit must come from you.
- **`Rating`**: pass `name` so the value participates in form submission, `max`/`step` for the scale, and `itemLabel` to name each option (for example `"3 out of 5"`). Half-star values from `step={0.5}` deserve explicit text.
- **`TagPicker` / `TagGroup` / `InteractionTag`**: dismissible chips need names. `TagGroup`'s `onDismiss` handler fires from a dismiss button — make sure the tag text itself describes the item ("Contoso"), not just an icon.

---

## 4. Keyboard interaction cheat sheet

The table below lists the behavior the components provide and what you must add on top of it.

| Components | Keyboard behavior you get | What you still own |
| --- | --- | --- |
| `Button`, `ToggleButton`, `CompoundButton`, `SplitButton`, `MenuButton` | Enter/Space activation, visible focus, `disabled` removes the control from the tab order | Accessible names; icon-only buttons need a name (`Tooltip relationship="label"` is the Fluent idiom). Use `disabledFocusable` when a control must stay discoverable in the tab order. |
| `Link` | Enter activates; `inline` for links inside sentences | Descriptive link text; never "click here". `disabledFocusable` keeps an inert link in the tab order. |
| `Menu`, `MenuTrigger`, `MenuPopover`, `MenuList`, `MenuItem`, `MenuItemCheckbox`, `MenuItemRadio`, `MenuItemLink`, `MenuDivider`, `MenuGroup` | Arrow keys, Home/End, typeahead, Escape closes and restores focus to the trigger | Menus are for actions only — put form fields in `Popover`/`Dialog`. Provide `name`/`value` for checkbox and radio items. |
| `Dialog`, `DialogSurface`, `DialogTitle`, `DialogBody`, `DialogContent`, `DialogActions`, `DialogTrigger` | Focus moves into the surface, Tab is contained (or background is made inert with `inertTrapFocus`), Escape closes, focus returns to the trigger | An accessible name via `DialogTitle`, plus a description region when the action is destructive. |
| `Drawer`, `InlineDrawer`, `OverlayDrawer`, `DrawerHeaderTitle` | `OverlayDrawer` behaves as a modal surface; `InlineDrawer` participates in layout | A heading (`DrawerHeaderTitle`) and a keyboard-reachable close control. |
| `Popover`, `PopoverTrigger`, `PopoverSurface`, `TeachingPopover` | Non-modal by default; `trapFocus` / `inertTrapFocus` / `legacyTrapFocus` for modal-like content | A real, focusable trigger; avoid putting essential content only inside a hover popover. |
| `Tooltip` | Opens on hover **and** focus | `relationship` (required) chosen deliberately. |
| `TabList`, `Tab` | Arrow-key navigation, `vertical` for vertical strips, `selectTabOnFocus` to select on focus | Distinct panel content per tab; visible selection indicator. |
| `Accordion`, `AccordionItem`, `AccordionHeader`, `AccordionPanel` | `AccordionHeader` renders a real button with expanded state; `navigation="linear" | "circular"` adds arrow-key movement between headers | A unique `value` per `AccordionItem`; panel content that is not itself a heading. |
| `Tree`, `TreeItem`, `TreeItemLayout`, `FlatTree`, `FlatTreeItem` | Up/Down to move, Right/Left to expand/collapse, Home/End; `navigationMode="tree"` vs `"treegrid"` | `FlatTreeItem` requires you to compute `aria-level`, `aria-setsize`, and `aria-posinset`. Label every `selector` checkbox. |
| `Table`, `TableHeader`, `TableHeaderCell`, `TableRow`, `TableBody`, `TableCell`, `TableCellLayout`, `TableCellActions`, `TableSelectionCell` | `sortable` + `sortDirection` render a sort button and expose sort state | Persist sort state in React and announce changes; keep hover-only actions visible on focus. |
| `DataGrid`, `DataGridHeaderCell`, `DataGridCell` | Grid semantics, per-cell `focusMode`, `onSortChange`, `onSelectionChange`, `onColumnResize` (also fires for keyboard resizing) | Labels for selection cells; announcements when row counts change. |
| `Slider`, `SpinButton`, `ColorSlider`, `ColorArea` | Arrow keys, Home/End, `stepPage` on `SpinButton`, `vertical` variants use Up/Down | Visible labels and formatted values. |
| `Rating`, `RatingItem` | Radio-group-style keyboard model | `name`, `max`, `step`, and `itemLabel`. |
| `Carousel`, `CarouselCard`, `CarouselViewport`, `CarouselSlider`, `CarouselNav`, `CarouselNavButton`, `CarouselNavContainer`, `CarouselButton`, `CarouselAutoplayButton` | All controls are real buttons; `CarouselNav` renders a navigable index | `announcement` to describe slide changes, a visible autoplay toggle when `autoplayInterval` is set, and a non-drag way to navigate when `draggable` is enabled. |
| `SwatchPicker`, `ColorSwatch`, `ImageSwatch` | `focusMode="arrow"` (roving focus) or `"tab"` | An accessible name per swatch ("Brand blue"), never a hex value alone. |
| `Breadcrumb`, `BreadcrumbItem`, `BreadcrumbButton`, `BreadcrumbDivider` | `focusMode="arrow" | "tab"` moves between crumbs | Mark the last crumb with `current` and label the surrounding `<nav>`. |
| `Card`, `CardHeader`, `CardFooter`, `CardPreview` | `focusMode` (`"off"`, `"no-tab"`, `"tab-exit"`, `"tab-only"`) decides whether the card is a tab stop; `selected`/`onSelectionChange` drive selection | If the card is selectable, keep `selected` controlled and use `shouldRestrictTriggerAction` to stop card selection when the user activates an inner control. |
| `Toolbar`, `ToolbarButton`, `ToolbarToggleButton`, `ToolbarRadioButton`, `ToolbarRadioGroup`, `ToolbarGroup`, `ToolbarDivider` | Roving tab index, arrow keys, `vertical` orientation | Names on every toolbar button; `vertical` must match the visual layout. |
| `List`, `ListItem` | `navigationMode`, `selectionMode`, `selectedItems` | Row content that is understandable out of context. |

> **Note:** many components expose a `focusMode` prop (`Card`, `Breadcrumb`, `SwatchPicker`, `DataGridCell`, `DataGridHeaderCell`). It controls whether the component itself participates in the tab order or whether focus moves to its interactive children — it never replaces the need for a name or a visible focus indicator.

---

## 5. Focus management

### `disabled` vs `disabledFocusable`

`Button`, `Link`, `ToggleButton`, `SplitButton`, and `MenuItem` all accept both. `disabled` removes the element from the tab order; `disabledFocusable` keeps it focusable but inert. Prefer `disabledFocusable` when the user needs to *discover* that an action exists (toolbars, dialog actions, inline commands) and `disabled` when presence in the tab order would be noise.

### Do not add tab stops by hand

If a card, list row, or tree row should be focusable, use the component's own model (`Card focusMode`, `List navigationMode`, `Tree navigationMode`/`selectionMode`) rather than adding `tabIndex={0}` to a `<div>`. Hand-rolled tab stops lack the key handling that makes them operable.

### Overlay focus lifecycle

1. **Opening** — focus must move into the surface, or the surface must be made inert-aware.
   - `Dialog` with `inertTrapFocus` marks background content inert for both pointer and AT users in supporting browsers.
   - `Popover` offers `trapFocus`, `inertTrapFocus`/`legacyTrapFocus` (older-browser path), and `unstable_disableAutoFocus` when you want to manage focus yourself.
2. **While open** — Tab cycles within the surface; Escape closes the topmost surface; background scrolling and clicks are blocked for modal surfaces.
3. **Closing** — focus must return to the element that opened the surface. Keep the trigger mounted: `Dialog`'s `unmountOnClose` should stay off unless you deliberately restore focus yourself.

`MenuTrigger` and `MenuPopover` expose an imperative `focusFirst` handle if you need to move focus into a menu programmatically (for example after a context-menu open).

`TeachingPopover` adds a step-based pattern: `initialStepText` and `finalStepText` describe the first and last navigation buttons, and the surface must remain dismissible so users are never trapped in the tour.

---

## 6. Live regions, status, and asynchronous feedback

Some changes never move focus, so they must be announced in a live region:

- **`MessageBar`** — `politeness="polite"` (default queue) or `"assertive"` (interrupts). Combine with `intent` so the severity is both visual and semantic. `MessageBarTitle`, `MessageBarBody`, and `MessageBarActions` structure the message; `MessageBarGroup` with `animate` stacks multiple messages and should respect reduced-motion settings.
- **`Toast` / `Toaster`** — non-blocking, transient feedback composed from `ToastTitle`, `ToastBody`, and `ToastFooter`. `Toaster` accepts an `announce` prop so you can tailor what is read out, which matters because toast text and announcement text often differ. Never let a toast be the only record of an important result.
- **`AriaLiveAnnouncer`** — the utility Fluent exposes for programmatic announcements that have no corresponding visible UI (sort changes, background-save confirmations, drag-and-drop results).
- **`ProgressBar`** — use `value`/`max` for determinate progress; pair it with text for indeterminate work so users know what is happening.
- **`Spinner`** — set `label` with `labelPosition` (`"above" | "below" | "before" | "after"`) so the wait state has visible, associated text. Use it for short waits and `ProgressBar` for measurable ones.

**One event, one announcement.** If you move focus to a message, do not also announce it — screen reader users will hear it twice.

---

## 7. Data-heavy surfaces: tables, grids, trees, navigation

- **Sorting.** `TableHeaderCell` accepts `sortable` and `sortDirection`. Keep sort state in React and announce changes with a polite live region, because sorting does not move focus. For `DataGrid`, handle `onSortChange` and reflect the new `SortState`.
- **Selection.** `DataGrid`'s `selectionMode` and `TableSelectionCell` (`type="checkbox" | "radio"`, `checked`, `subtle`, `hidden`, `invisible`) render selection affordances. Give selection cells a name-per-row ("Select row 3 — Ana Ruiz") and explain `checked="mixed"` in surrounding content.
- **Resizable columns.** `DataGrid`'s `onColumnResize` receives mouse, touch, **and keyboard** events (`KeyboardEvent | TouchEvent | MouseEvent | undefined`), so column resizing is operable from the keyboard; make sure the resize handle is reachable and that the resulting width change is announced or visually obvious.
- **Row actions.** `TableCellActions` supports `visible`; hover-only row actions are invisible to keyboard users unless they also appear when focus enters the row.
- **Trees.** `Tree`/`TreeItem` with `navigationMode="tree"` is the simplest model. Switch to `"treegrid"` when rows carry selectors — `TreeItemLayout`'s `selector` slot accepts a `Checkbox` or `Radio` and each one needs its own name. `FlatTree` is the virtualized variant and requires you to compute `aria-level`, `aria-setsize`, and `aria-posinset` on every `FlatTreeItem`; if you cannot compute them correctly, use `Tree` instead.
- **Navigation.** `Nav`, `NavItem`, `NavCategory`, `NavCategoryItem`, `NavSubItem`, `NavSectionHeader` implement the disclosure-navigation pattern; render them inside a labeled landmark. `NavDrawer`, `NavDrawerHeader`, `NavDrawerBody`, `NavDrawerFooter`, and `Hamburger` add responsive behavior — keep `tabbable` accurate on `NavDrawer` so hidden navigation is not reachable. `OverflowItem`/`OverflowDivider` move items into an overflow menu; verify the overflowed items remain reachable.
- **Card surfaces.** A selectable `Card` should have a name from its own heading (via `aria-labelledby` pointing at the header text) and should not swallow clicks on inner `Button`/`Link` elements — use `shouldRestrictTriggerAction` for that.

---

## 8. Color, images, and non-text content

- **Never color alone.** `Badge`, `CounterBadge`, `PresenceBadge`, `Tag`, `InteractionTag`, and `Avatar` use `color`/`appearance` to express state. Add a text label or accessible name alongside; a red badge alone conveys nothing to a screen reader.
- **Presence.** `PresenceBadge`'s `status` (and `outOfOffice`) is visual; repeat it in text (for example `Persona`'s secondary text) when it carries meaning.
- **Avatars.** `Avatar` derives initials and labels from `name`; supply `name` instead of shipping an unlabeled image. Use `Persona` when you need name plus secondary text.
- **Images.** Give `Image` meaningful `alt` text, or `alt=""` when it is decorative.
- **Skeletons.** `Skeleton`/`SkeletonItem` are decorative. Announce loading with text, or mark the container with `aria-busy` while content loads.
- **Dividers.** `Divider` (`vertical`, `inset`, `appearance`) is decorative; it does not create a group or a section for AT. Use real landmarks and headings.
- **Truncation.** `Text`'s `truncate` and `TableCellLayout`'s `truncate` hide content visually. Keep the meaningful part visible or expose the full text another way.

---

## 9. Motion, timing, and zoom

- Respect the user's reduced-motion preference globally (see the CSS example below) and per component: `Carousel`'s `motion`, `MessageBarGroup`'s `animate`, and the `collapseMotion`/`surfaceMotion`/`backdropMotion` slots on `AccordionPanel`, `Dialog`, `Drawer`, and `NavSubItemGroup`.
- If you set `Carousel`'s `autoplayInterval`, always render `CarouselAutoplayButton` so users can pause it, and keep `CarouselNav`/`CarouselButton` usable for manual navigation.
- Avoid timeouts that remove information a user has not finished reading. If a control must time out, warn before it happens and allow extension.
- Reflow matters: text must remain readable at 400% zoom and with text-spacing overrides. Avoid fixed heights on text containers and layouts that require horizontal scrolling for vertical content.

---

## 10. Testing accessibility

**Automated (fast, shallow):**

- Query by role and name in tests (`getByRole('button', { name: /save/i })`). If a query fails, your control likely has no accessible name — the test catches a real bug.
- Run an automated audit (axe-core via jest-axe or a browser extension) on every page and in every overlay state. Expect it to catch roughly a third of issues.

**Manual (slow, essential):**

1. **Keyboard-only pass** — unplug the mouse. Tab through the flow: is focus always visible? Does every interactive element get focus? Can you escape every overlay with Escape? Where does focus land after closing?
2. **Screen reader pass** — at minimum one desktop pair (NVDA + Firefox/Chrome, or JAWS + Chrome) and one mobile pair (VoiceOver + Safari). Check landmarks, headings, form labels, error announcements, and dynamic updates.
3. **Zoom and reflow** — 200% and 400% browser zoom plus increased text size; verify nothing overlaps, clips, or disappears.
4. **Forced colors** — verify focus indicators and icons in Windows high-contrast mode; Fluent tokens map to system colors, but custom CSS may not.
5. **RTL smoke test** — flip `dir` on `FluentProvider` and confirm layout mirroring and icon direction.
6. **Touch** — confirm that anything tooltip-only has another path to discovery.

---

## 11. Accessibility-relevant props quick reference

| Component | Prop | Purpose |
| --- | --- | --- |
| `FluentProvider` | `dir`, `theme`, `applyStylesToPortals`, `targetDocument` | Direction, tokens, portal styling |
| `Button`, `Link`, `MenuItem`, `ToggleButton` | `disabled`, `disabledFocusable` | Remove from tab order vs. stay focusable but inert |
| `Tooltip` | `relationship` (required), `showDelay`, `hideDelay`, `onVisibleChange` | Label vs. description vs. decorative tooltip |
| `Field` | `label`, `hint`, `required`, `validationState`, `validationMessage`, `orientation`, `size` | Accessible name, description, and error state |
| `Label` | `required`, `disabled`, `weight`, `size` | Standalone labeling |
| `InfoLabel` | `info` | Label plus keyboard-reachable help |
| `Dialog` | `modalType`, `inertTrapFocus`, `unmountOnClose`, `onOpenChange` | Modal semantics and focus containment |
| `DialogTrigger` | `action`, `disableButtonEnhancement` | Control over the trigger's DOM element and event |
| `Popover` | `trapFocus`, `inertTrapFocus`, `legacyTrapFocus`, `unstable_disableAutoFocus`, `openOnHover`, `openOnContext` | Focus handling for non-modal and modal popups |
| `Card` | `focusMode`, `selected`, `defaultSelected`, `onSelectionChange`, `shouldRestrictTriggerAction` | Tab-stop model and selection semantics |
| `Breadcrumb`, `SwatchPicker` | `focusMode` | Arrow-key roving focus vs. plain tabbing |
| `TabList` | `vertical`, `selectTabOnFocus`, `size` | Tab keyboard model |
| `Accordion` | `navigation` (`"linear"` / `"circular"`) | Arrow-key navigation between headers |
| `Tree`, `FlatTree` | `navigationMode`, `selectionMode`, `openItems`, `checkedItems` | Tree vs. treegrid semantics and selection |
| `TableHeaderCell` | `sortable`, `sortDirection`, `button`, `sortIcon` | Sortable header with a real button |
| `DataGrid` | `selectionMode`, `onSelectionChange`, `onSortChange`, `onColumnResize`, `columnSizingOptions`, `resizableColumnsOptions` | Grid selection, sorting, and keyboard resizing |
| `MessageBar` | `intent`, `politeness`, `shape` | Live-region severity and urgency |
| `MessageBarGroup` | `animate` | Stacked message animation (respect reduced motion) |
| `Toaster` | `announce`, `inline` | Toast announcement text |
| `Carousel` | `announcement`, `autoplayInterval`, `draggable`, `circular`, `activeIndex`, `onActiveIndexChange` | Slide announcements and autoplay control |
| `Rating` | `name`, `value`, `max`, `step`, `itemLabel` | Form value and per-option names |
| `Spinner` | `label`, `labelPosition`, `size` | Named wait state |
| `ProgressBar` | `value`, `max`, `color` | Determinate progress |
| `Checkbox` | `checked` (`boolean | "mixed"`), `labelPosition`, `size`, `shape` | Tri-state semantics |
| `RadioGroup` | `required`, `disabled`, `layout`, `value`, `onChange` | Group semantics |
| `Switch` | `checked`, `labelPosition`, `disabledFocusable` | Immediate-effect toggle |
| `NavDrawer` | `tabbable` | Keep hidden navigation unreachable |
| `Toolbar`, `ToolbarGroup` | `vertical`, `size`, `checkedValues`, `onCheckedValueChange` | Orientation and group state |

---

## 12. Pre-ship checklist

- [ ] Every interactive element has an accessible name (text, `Field`/`Label`, or `aria-label`).
- [ ] Icon-only buttons use `Tooltip relationship="label"`.
- [ ] App is wrapped in a single `FluentProvider`; `dir` is correct for the locale.
- [ ] All pointer paths have keyboard equivalents (menus, carousels, table sorting, column resize, drag-only interactions).
- [ ] Overlays move focus in, contain it, close on Escape, and return focus to the trigger.
- [ ] `disabledFocusable` is used where an inert control must remain discoverable.
- [ ] Errors and async results are announced (`Field` validation, `MessageBar politeness`, `Toaster announce`, `AriaLiveAnnouncer`).
- [ ] No state is conveyed by color alone; custom colors pass contrast checks.
- [ ] Reduced-motion and forced-colors modes verified.
- [ ] Keyboard-only and screen reader passes completed on the primary flow.

## Key Takeaways

- v9 components already implement WAI-ARIA patterns, keyboard interaction, and focus behavior. Compose them and give them names instead of adding your own roles or tab stops — duplicated ARIA is the most common way to break an accessible v9 app.
- Every interactive control needs an accessible name. Use visible text, Field/Label for form controls, and Tooltip with relationship="label" for icon-only buttons. Tooltip's relationship prop is required and must be chosen deliberately (label vs. description vs. inaccessible).
- Focus is the primary navigation mechanism for keyboard and screen reader users: use disabledFocusable where an inert control must stay discoverable, focusMode (Card, Breadcrumb, SwatchPicker, DataGrid cells) instead of hand-rolled tab stops, and inertTrapFocus/trapFocus for modal surfaces with focus returning to the trigger on close.
- Changes that do not move focus must be announced: Field validationState/validationMessage, MessageBar politeness, Toaster announce, AriaLiveAnnouncer, and ProgressBar/Spinner labels. Announce one event once — never move focus and announce the same message.
- Every pointer path needs a keyboard path: table sorting and column resizing, carousel navigation and autoplay pause, tree expansion, menu actions, and drag interactions.
- Wrap the app in a single FluentProvider to set dir, theme tokens, and portal styling (applyStylesToPortals), and keep your own landmarks and headings coherent around the components.
- Never convey state with color alone (Badge, CounterBadge, PresenceBadge, Tag, Avatar), and pair visual-only affordances with text or accessible names.
- Automated tools catch only part of the problem — finish with a keyboard-only pass, a screen reader pass, zoom/reflow, forced-colors, and an RTL smoke test.

## Examples

### Application shell: FluentProvider, direction, and a skip link

A minimal accessible shell. FluentProvider supplies theme tokens and text direction for the whole app, a Link provides a keyboard skip link to the main region, and the main region is programmatically focusable so the skip link actually moves focus.

```tsx
import * as React from 'react';
import { Button, FluentProvider, Link, Text } from '@fluentui/react-components';

export const AppShell = () => {
  const [dir, setDir] = React.useState<'ltr' | 'rtl'>('ltr');

  return (
    <FluentProvider dir={dir}>
      {/* A skip link is the first focusable element on the page. */}
      <Link href="#main-content" inline>
        Skip to main content
      </Link>

      <Button onClick={() => setDir(dir === 'ltr' ? 'rtl' : 'ltr')}>
        Direction: {dir.toUpperCase()}
      </Button>

      {/* tabIndex={-1} lets the skip link move focus here without adding a tab stop. */}
      <main id="main-content" tabIndex={-1}>
        <h1>Dashboard</h1>
        <Text block>
          Main content lives in a real landmark so screen reader users can jump straight to it.
        </Text>
      </main>
    </FluentProvider>
  );
};
```

### Accessible form with Field, RadioGroup, Checkbox, and Switch

Shows how Field ties a visible label, a hint, and a validation message to a control, how RadioGroup and Checkbox get their names, and how Switch differs from Checkbox (immediate effect vs. applied on submit).

```tsx
import * as React from 'react';
import {
  Button,
  Checkbox,
  Field,
  Input,
  Radio,
  RadioGroup,
  Select,
  Switch,
} from '@fluentui/react-components';

interface FormState {
  email: string;
  digest: string;
  timezone: string;
  marketing: boolean;
  compact: boolean;
}

export const NotificationSettingsForm = () => {
  const [form, setForm] = React.useState<FormState>({
    email: '',
    digest: 'daily',
    timezone: 'utc',
    marketing: false,
    compact: false,
  });
  const [submitted, setSubmitted] = React.useState(false);

  const emailError = submitted && !form.email.includes('@') ? 'Enter a valid email address.' : undefined;

  return (
    <form
      aria-label="Notification settings"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        // In a real form, move focus to the first invalid control here,
        // or announce a summary with MessageBar instead of doing both.
      }}
    >
      {/* Field owns the accessible name, hint, and validation message. */}
      <Field
        label="Email address"
        required
        hint="Used for account recovery and notifications."
        validationState={emailError ? 'error' : 'none'}
        validationMessage={emailError}
      >
        <Input
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(_, data) => setForm((prev) => ({ ...prev, email: data.value }))}
        />
      </Field>

      {/* RadioGroup is a labeled group; each Radio carries its own visible label. */}
      <Field label="Email digest" required>
        <RadioGroup
          value={form.digest}
          layout="horizontal"
          onChange={(_, data) => setForm((prev) => ({ ...prev, digest: data.value }))}
        >
          <Radio value="daily" label="Daily" />
          <Radio value="weekly" label="Weekly" />
          <Radio value="never" label="Never" />
        </RadioGroup>
      </Field>

      <Field label="Timezone">
        <Select
          value={form.timezone}
          onChange={(_, data) => setForm((prev) => ({ ...prev, timezone: data.value }))}
        >
          <option value="utc">UTC</option>
          <option value="pst">Pacific Time</option>
          <option value="cet">Central European Time</option>
        </Select>
      </Field>

      {/* Checkbox: applied when the form is submitted. */}
      <Checkbox
        label="Send me occasional product news (you can unsubscribe at any time)"
        checked={form.marketing}
        onChange={(_, data) => setForm((prev) => ({ ...prev, marketing: data.checked === true }))}
      />

      {/* Switch: takes effect immediately, so it is not part of the submitted payload. */}
      <Switch
        label="Use compact density"
        checked={form.compact}
        onChange={(_, data) => setForm((prev) => ({ ...prev, compact: data.checked }))}
      />

      <Button type="submit" appearance="primary">
        Save settings
      </Button>
    </form>
  );
};
```

### Rating with per-option labels and a form value

Rating needs an accessible name for the group, a name so it participates in form submission, and itemLabel so each option is announced meaningfully instead of as a bare number.

```tsx
import * as React from 'react';
import { Rating, Text } from '@fluentui/react-components';

export const SatisfactionSurvey = () => {
  const [value, setValue] = React.useState(0);

  return (
    <div>
      {/* A visible prompt is better than relying only on aria-label. */}
      <Text id="satisfaction-prompt" block weight="semibold">
        How satisfied are you with the new dashboard?
      </Text>

      <Rating
        aria-labelledby="satisfaction-prompt"
        name="satisfaction"
        value={value}
        max={5}
        step={1}
        onChange={(_, data) => setValue(data.value)}
        itemLabel={(rating) => `${rating} out of 5`}
      />

      <Text block size={200}>
        {value === 0 ? 'No rating selected yet.' : `You selected ${value} out of 5.`}
      </Text>
    </div>
  );
};
```

### Tooltip relationships and InfoLabel

Tooltip's relationship prop is required and decides whether the tooltip names the trigger, describes it, or is purely visual. InfoLabel keeps longer help text reachable by keyboard instead of hiding it in a title attribute.

```tsx
import * as React from 'react';
import { Button, InfoLabel, Tooltip } from '@fluentui/react-components';

export const TooltipPatterns = () => (
  <>
    {/* relationship="label": the tooltip text IS the accessible name. */}
    <Tooltip content="Delete selected items" relationship="label">
      <Button appearance="subtle" icon={<span aria-hidden="true">x</span>} />
    </Tooltip>

    {/* relationship="description": the button keeps its own name, the tooltip adds context. */}
    <Tooltip content="Copies the current filter set to the clipboard" relationship="description">
      <Button>Copy filters</Button>
    </Tooltip>

    {/* relationship="inaccessible": visible only; do not put unique information here. */}
    <Tooltip content="Just a hint" relationship="inaccessible">
      <Button appearance="outline">Hover me</Button>
    </Tooltip>

    {/* InfoLabel keeps help text available to keyboard and screen reader users. */}
    <div>
      <InfoLabel info="Trial accounts keep audit logs for 30 days.">
        Audit log retention
      </InfoLabel>
    </div>
  </>
);
```

### Modal Dialog with inert background and focus return

A destructive confirmation dialog: DialogTitle names the surface, a described DialogContent region explains the consequence, inertTrapFocus makes the rest of the page inert, and the trigger keeps focus restoration working.

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

export const DeleteProjectDialog = ({ onConfirm }: { onConfirm: () => void }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(_, data) => setOpen(data.open)}
      modalType="modal"
      inertTrapFocus
    >
      {/* disableButtonEnhancement keeps the Button as the trigger element. */}
      <DialogTrigger disableButtonEnhancement>
        <Button appearance="primary">Delete project</Button>
      </DialogTrigger>

      <DialogSurface aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-body">
        <DialogBody>
          <DialogTitle id="delete-dialog-title">Delete this project?</DialogTitle>
          <DialogContent id="delete-dialog-body">
            This permanently removes the project, its files, and its history. This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cancel</Button>
            </DialogTrigger>
            <DialogTrigger disableButtonEnhancement>
              <Button
                appearance="primary"
                onClick={() => {
                  onConfirm();
                }}
              >
                Delete project
              </Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
```

### Sortable table headers plus a live announcement

TableHeaderCell's sortable/sortDirection props render a real sort button and expose sort state. Because sorting does not move focus, the new state is announced in a polite live region instead.

```tsx
import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@fluentui/react-components';

type SortDirection = 'ascending' | 'descending';
type ColumnId = 'name' | 'role';

interface Member {
  name: string;
  role: string;
}

const members: Member[] = [
  { name: 'Ana Ruiz', role: 'Designer' },
  { name: 'Ben Okafor', role: 'Engineer' },
  { name: 'Chen Wu', role: 'Engineer' },
];

export const SortableMembersTable = () => {
  const [sort, setSort] = React.useState<{ columnId: ColumnId; direction: SortDirection }>({
    columnId: 'name',
    direction: 'ascending',
  });
  const [announcement, setAnnouncement] = React.useState('');

  const toggleSort = (columnId: ColumnId) => {
    const direction: SortDirection =
      sort.columnId === columnId && sort.direction === 'ascending' ? 'descending' : 'ascending';
    setSort({ columnId, direction });
    // Sorting does not move focus, so announce the new state for screen readers.
    setAnnouncement(`Table sorted by ${columnId}, ${direction}`);
  };

  const rows = React.useMemo(() => {
    const sorted = [...members].sort((a, b) => a[sort.columnId].localeCompare(b[sort.columnId]));
    return sort.direction === 'ascending' ? sorted : sorted.reverse();
  }, [sort]);

  return (
    <>
      <Table aria-label="Team members">
        <TableHeader>
          <TableRow>
            <TableHeaderCell
              sortable
              sortDirection={sort.columnId === 'name' ? sort.direction : undefined}
              button={{ onClick: () => toggleSort('name') }}
            >
              Name
            </TableHeaderCell>
            <TableHeaderCell
              sortable
              sortDirection={sort.columnId === 'role' ? sort.direction : undefined}
              button={{ onClick: () => toggleSort('role') }}
            >
              Role
            </TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((member) => (
            <TableRow key={member.name}>
              <TableCell>
                <TableCellLayout>{member.name}</TableCellLayout>
              </TableCell>
              <TableCell>
                <TableCellLayout>{member.role}</TableCellLayout>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Visually hidden live region; see the .sr-only CSS example. */}
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>
    </>
  );
};
```

### Selectable Card with a controlled focusMode

Card's focusMode decides whether the card itself is a tab stop or focus lives on its inner controls. The card is named by its own heading and inner actions keep their own accessible names.

```tsx
import * as React from 'react';
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Text,
} from '@fluentui/react-components';

interface Scenario {
  id: string;
  title: string;
  description: string;
}

export const SelectableScenarioCard = ({
  scenario,
  onRun,
}: {
  scenario: Scenario;
  onRun: (id: string) => void;
}) => {
  const [selected, setSelected] = React.useState(false);
  const titleId = `${scenario.id}-title`;

  return (
    <Card
      appearance="outline"
      // tab-exit keeps the card in the tab order while allowing Tab to move on.
      focusMode="tab-exit"
      selected={selected}
      onSelectionChange={(_, data) => setSelected(data.selected)}
      aria-labelledby={titleId}
    >
      <CardHeader
        header={
          <div id={titleId}>
            <Text weight="semibold">{scenario.title}</Text>
          </div>
        }
        description={<div>{scenario.description}</div>}
      />
      <CardFooter>
        <Button appearance="primary" onClick={() => onRun(scenario.id)}>
          Run scenario
        </Button>
      </CardFooter>
    </Card>
  );
};
```

### Tree with treegrid semantics and labeled selectors

TreeItemLayout's selector slot renders a Checkbox or Radio per row. In treegrid mode every selector needs its own accessible name, and each TreeItem needs a unique value.

```tsx
import * as React from 'react';
import {
  Checkbox,
  Tree,
  TreeItem,
  TreeItemLayout,
} from '@fluentui/react-components';

export const ProjectFileTree = () => (
  <Tree
    aria-label="Project files"
    navigationMode="treegrid"
    selectionMode="multiselect"
    defaultOpenItems={['src']}
  >
    <TreeItem itemType="branch" value="src">
      <TreeItemLayout selector={<Checkbox aria-label="Select the src folder" />}>
        src
      </TreeItemLayout>
      <Tree>
        <TreeItem itemType="leaf" value="src/app.tsx">
          <TreeItemLayout selector={<Checkbox aria-label="Select app.tsx" />}>
            app.tsx
          </TreeItemLayout>
        </TreeItem>
        <TreeItem itemType="leaf" value="src/index.tsx">
          <TreeItemLayout selector={<Checkbox aria-label="Select index.tsx" />}>
            index.tsx
          </TreeItemLayout>
        </TreeItem>
      </Tree>
    </TreeItem>

    <TreeItem itemType="leaf" value="package.json">
      <TreeItemLayout selector={<Checkbox aria-label="Select package.json" />}>
        package.json
      </TreeItemLayout>
    </TreeItem>
  </Tree>
);
```

### Menu with checkbox and radio items

MenuList holds checkedValues and reports changes through onCheckedValueChange. MenuItemCheckbox and MenuItemRadio group items by name, giving the menu proper checkable semantics.

```tsx
import * as React from 'react';
import {
  Button,
  Menu,
  MenuDivider,
  MenuItemCheckbox,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@fluentui/react-components';

export const ViewOptionsMenu = () => {
  const [checkedValues, setCheckedValues] = React.useState<Record<string, string[]>>({
    view: ['grid'],
    columns: ['name'],
  });

  const onCheckedValueChange = (
    _event: unknown,
    data: { name: string; checkedItems: string[] },
  ) => {
    setCheckedValues((previous) => ({ ...previous, [data.name]: data.checkedItems }));
  };

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button>View options</Button>
      </MenuTrigger>

      <MenuPopover>
        <MenuList
          hasCheckmarks
          checkedValues={checkedValues}
          onCheckedValueChange={onCheckedValueChange}
        >
          <MenuItemCheckbox name="view" value="grid">
            Grid layout
          </MenuItemCheckbox>
          <MenuItemCheckbox name="view" value="list">
            List layout
          </MenuItemCheckbox>

          <MenuDivider />

          <MenuItemRadio name="columns" value="name">
            Show name column
          </MenuItemRadio>
          <MenuItemRadio name="columns" value="role">
            Show role column
          </MenuItemRadio>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
```

### Visually hidden utility CSS and reduced-motion defaults

The sr-only class powers the visually hidden live regions used by the examples, and the reduced-motion block is a safe global default that respects the user's motion preference.

```css
/* Keeps content available to assistive technology while removing it from the visual layout.
   Used for the aria-live announcements in the examples. */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Global reduced-motion default. Fluent components also expose per-component
   motion props (Carousel motion, MessageBarGroup animate, collapseMotion /
   surfaceMotion / backdropMotion slots). */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Pitfalls

- Adding ARIA to components that already manage it — role="button" on a Button, tabIndex={0} on a div row, or aria-pressed on a ToggleButton. This overrides the component's internal state and usually makes it less accessible, not more.
- Using disabled instead of disabledFocusable for actions users must be able to discover (toolbar commands, dialog actions, inline controls). disabled removes the element from the tab order, so keyboard users never learn the action exists.
- Leaving icon-only buttons unlabeled. Without an accessible name a screen reader announces only "button"; the Fluent idiom is a Tooltip with relationship="label".
- Using a Tooltip as the only source of essential information, or setting relationship="inaccessible" on content that is not duplicated elsewhere. Tooltips do not exist on touch devices.
- Relying on placeholder text instead of Field/Label. Placeholders disappear on input, are often too low-contrast, and are inconsistently announced.
- Forgetting to restore focus when closing overlays, or unmounting the trigger so focus falls back to <body>. Keep the trigger mounted and let Dialog/Menu/Popover return focus; use inertTrapFocus or trapFocus so background content is not reachable while a modal is open.
- Rendering portaled content (Dialog, Menu, Popover, Tooltip) outside the FluentProvider's portal styling, so the surface loses direction and theme tokens — use applyStylesToPortals or a nested FluentProvider.
- Conveying selection or state only through color: a colored Badge, CounterBadge, PresenceBadge, Tag, or Avatar without text leaves non-visual users with no information.
- Relying on hover-only affordances such as TableCellActions that appear on hover but not on keyboard focus.
- Truncating meaningful text with Text's truncate or TableCellLayout's truncate without any other way to reach the full value.
- Using Checkbox's checked="mixed" tri-state without explaining what the partial selection means, or using Switch for a value that only applies after submitting a form.
- Setting Carousel's autoplayInterval without a visible pause control (CarouselAutoplayButton) and without honoring reduced-motion preferences.
- Building a virtualized tree with FlatTree without computing aria-level, aria-setsize, and aria-posinset for every FlatTreeItem, which breaks tree navigation announcements.

## Accessibility

Fluent UI React v9 is designed around WAI-ARIA authoring patterns, so accessibility work is mostly composition and content rather than adding ARIA. The library's accessibility surface is exposed through a small set of props you should know: FormField labeling (Field with label, hint, required, validationState, validationMessage; Label with required/disabled; InfoLabel for keyboard-reachable help), naming (Tooltip's required relationship prop with "label", "description", and "inaccessible" modes; aria-label passed through slot props for icon-only controls), focus control (disabled vs disabledFocusable on Button/Link/MenuItem/ToggleButton, focusMode on Card/Breadcrumb/SwatchPicker/DataGrid cells, inertTrapFocus on Dialog, trapFocus/inertTrapFocus/legacyTrapFocus/unstable_disableAutoFocus on Popover, navigation/focusMode on Accordion, TabList, Tree and FlatTree), announcements (MessageBar intent/politeness, MessageBarGroup animate, Toaster announce, AriaLiveAnnouncer, ProgressBar, Spinner's label/labelPosition, Carousel's announcement), and data-grid semantics (DataGrid selectionMode/onSelectionChange/onSortChange/onColumnResize — keyboard resize events are reported alongside mouse and touch — plus TableHeaderCell sortable/sortDirection and TableSelectionCell). Because FluentProvider supplies direction (dir), contrast-checked theme tokens, and portal styling (applyStylesToPortals), wrap the entire app in one provider and verify that portaled surfaces stay inside its context. Finally, prove the result manually: keyboard-only traversal with visible focus and working Escape/focus-return, at least one desktop and one mobile screen reader, 400% zoom and reflow, Windows forced-colors mode, reduced-motion, and a right-to-left smoke test.

**Referenced components**: Accordion, AccordionHeader, AccordionItem, AccordionPanel, AriaLiveAnnouncer, Avatar, Badge, Breadcrumb, BreadcrumbButton, BreadcrumbDivider, BreadcrumbItem, Button, Card, CardFooter, CardHeader, CardPreview, Carousel, CarouselAutoplayButton, CarouselButton, CarouselCard, CarouselNav, CarouselNavButton, CarouselNavContainer, CarouselSlider, CarouselViewport, Checkbox, ColorArea, ColorSlider, ColorSwatch, Combobox, CompoundButton, CounterBadge, DataGrid, DataGridCell, DataGridHeaderCell, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Divider, Drawer, DrawerHeaderTitle, Dropdown, Field, FlatTree, FlatTreeItem, FluentProvider, Hamburger, Image, ImageSwatch, InfoLabel, InlineDrawer, Input, InteractionTag, Label, Link, List, ListItem, Listbox, Menu, MenuDivider, MenuGroup, MenuItem, MenuItemCheckbox, MenuItemLink, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, MessageBar, MessageBarActions, MessageBarBody, MessageBarGroup, MessageBarTitle, Nav, NavCategory, NavCategoryItem, NavDrawer, NavDrawerBody, NavDrawerFooter, NavDrawerHeader, NavItem, NavSectionHeader, NavSubItem, NavSubItemGroup, Option, OverflowDivider, OverflowItem, OverlayDrawer, Persona, Popover, PopoverSurface, PopoverTrigger, Portal, PresenceBadge, ProgressBar, Radio, RadioGroup, Rating, RatingItem, Select, Skeleton, SkeletonItem, Slider, SpinButton, Spinner, SplitButton, SwatchPicker, Switch, Tab, Table, TableBody, TableCell, TableCellActions, TableCellLayout, TableHeader, TableHeaderCell, TableRow, TableSelectionCell, TabList, Tag, TagGroup, TagPicker, TeachingPopover, Text, Textarea, Toast, ToastBody, ToastFooter, ToastTitle, Toaster, ToggleButton, Toolbar, ToolbarButton, ToolbarDivider, ToolbarGroup, ToolbarRadioButton, ToolbarRadioGroup, ToolbarToggleButton, Tooltip, Tree, TreeItem, TreeItemLayout

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
