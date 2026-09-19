# Component Architecture

> **Category**: foundation

# Component Architecture

Fluent UI v9 does not ship one bespoke widget per concept. It ships a small set of architectural ideas — **slots**, **appearance props**, **owned state**, **provider context**, **portals**, and **motion** — and every component in the library is assembled from them. Once you internalize those ideas, learning a new component is mostly a matter of reading its slot table and its `default*` / `on*Change` pairs.

This guide describes the architecture that is visible in the public API surface of the v9 components: how components are structured, how state is owned and shared, how content gets rendered into layers, and how you should build your own components so they behave like first-party ones.

## 1. The layer cake: where a component sits tells you what it owns

Components fall into four layers. The layer a component lives in predicts how much it owns (state, DOM placement, focus) and how much you are expected to own.

**Layer 0 — primitives and utilities.** These render almost nothing on their own, but every composite is built on them:

- `Aria` — screen-reader announcement plumbing.
- `Portal` — renders children into a different DOM node (`mountNode`).
- `Positioning` — anchored-surface placement shared by `Tooltip`, `Menu`, `Popover` and `TeachingPopover`.
- `Tabster` — focus management and keyboard-navigation infrastructure (arrow-key traversal, focus traps, grouppers).
- `ContextSelector` — context subscriptions where only the consumers that opt in re-render.
- `Utilities` — shared helpers.

**Layer 1 — context and theming.** `Provider` supplies the theme, writing direction (`dir`), the document used for portals and events (`targetDocument`), style injection into portals (`applyStylesToPortals`), provider-wide per-slot style overrides (`customStyleHooks_unstable`) and the unstable `overrides_unstable` escape hatch.

**Layer 2 — building blocks.** Single-purpose, mostly presentational components: `Button`, `Input`, `Textarea`, `Field`, `Label`, `Select`, `Combobox`, `Checkbox`, `Switch`, `Radio`, `Slider`, `Rating`, `Spinbutton`, `ColorPicker`, `Search`, `Infolabel`, `Badge`, `Avatar`, `Persona`, `Image`, `Skeleton`, `Text`, `Divider`, `Card`, `Link`, `MessageBar`, `Spinner`, `Progress`.

**Layer 3 — composites and overlays.** Components that own a state machine, register children, and/or render into a portal: `Dialog`, `Menu`, `Popover`, `Drawer`, `TeachingPopover`, `Tooltip`, `Toast`, `Accordion`, `Tabs`, `Tree`, `List`, `Nav`, `Breadcrumb`, `TagPicker`, `SwatchPicker`, `Table`, `Carousel`, `Overflow`, `Toolbar`, and the compat date/time family (`DatepickerCompat`, `TimepickerCompat`, `CalendarCompat`).

Rule of thumb: the higher the layer, the more the component owns, and the less you should reach into it. Your job at layer 3 is to supply a model (selected values, open items, sort state) and content; the component supplies interaction, focus, layering and ARIA.

## 2. Slots: the public skeleton of every component

Every component publishes a `slots` table. A slot is a named position inside the component with a fixed role and a fixed position in the render tree. `root` is always the outermost element; every other entry is a named interior position.

The `undefined` value in a slot table is not a missing value — it means the entry is a *slot descriptor*. The component decides whether that position renders, what element it uses, and in which order.

### Slot order is fixed by the component

You cannot reorder slots by rearranging JSX. The component owns the order. Compare the slot tables of a few common components:

- `Input`: `root` → `contentBefore` → `input` → `contentAfter`.
- `Field`: `root` → `label` → children → `validationMessageIcon` → `validationMessage` → `hint`.
- `Checkbox` / `Switch`: `root` → `input` → `indicator` → `label`.
- `Slider`: `root` → `rail` → `thumb` → `input`.
- `Avatar`: `root` → `image` → `initials` → `icon` → `badge`.
- `Persona`: `root` → `avatar` → `presence` → `primaryText` → `secondaryText` → `tertiaryText` → `quaternaryText`.
- `MessageBar`: `root` → `icon` → content → `bottomReflowSpacer`.
- `Card`: `root` → `floatingAction` → `checkbox`.
- `Select`: `root` → `select` → `icon`; `Combobox`: `root` → `input` → `expandIcon` → `clearIcon` → `listbox`.
- `Spinner`: `root` → `spinner` → `spinnerTail` → `label`.
- `Label`: `root` → `required`.
- `Divider`: `wrapper` → `root`.

Because the order is fixed, the API gives you *placement props* instead of reordering. You choose between `contentBefore` / `contentAfter` on `Input`, `iconPosition: 'before' | 'after'` on `Button` and `Badge`, `labelPosition` on `Checkbox`, `Switch`, `Radio` and `Input`-adjacent controls, `textPosition` / `textAlignment` on `Persona`, and `alignContent` / `inset` / `vertical` on `Divider`. If a control does not offer a placement prop, the position is genuinely not yours to control.

### Filling a slot

A slot prop accepts content — an element, a string, a fragment. Omitting it leaves the component default (or means the slot is not rendered at all). Passing `null` suppresses a slot the component would otherwise render. Passing an element replaces the default content of that slot without changing its position in the tree.

This is the single most important architectural idea in v9: **you configure the component's anatomy through named props rather than by nesting your own DOM and hoping the styles line up.**

### Composite state: components that publish their internals

Some slot tables expose architectural machinery rather than visual regions:

- `Dialog`, `Menu` and `Popover` expose a `surfaceMotion` slot — the animated surface is a first-class, replaceable part of the component.
- `Tree` exposes `collapseMotion`.
- `Card` exposes `floatingAction` and `checkbox` so that badges, menus and selection affordances sit in the component's own layout rather than being absolutely positioned by you.
- `Prompt (`MessageBar`) exposes `bottomReflowSpacer`, a layout-reservation element used so that pushing other content is handled by the component.

## 3. Appearance is an API, not a stylesheet

Each component exposes its visual axes as typed props. This is deliberate: appearance props are resolved through design tokens, so they follow the active theme, respect `dir`, and stay correct in high-contrast and density modes.

Representative axes drawn from the components in this guide:

- `appearance`: `Button`, `Badge`, `Card`, `Link`, `MessageBar`, `Spinner`, `Textarea`, `Select`, `Tree`, `Table`.
- `size`: `Button`, `Badge`, `Card`, `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Slider`, `Rating`, `Spinner`, `Persona`, `Avatar`, `Toolbar`, `Tree`, `Breadcrumb`.
- `shape`: `Button`, `Badge`, `Checkbox`, `Card`-adjacent checkboxes, `MessageBar`, `Spinner`/`Progress` (`shape: 'rounded' | 'square'`), `Image`, `Skeleton`, `SwatchPicker`.
- `color`: `Badge`, `Avatar`, `Progress`, `Rating`.
- Layout: `orientation` (`Card`, `Field`), `vertical` (`Divider`, `Slider`, `Toolbar`), `inline` (`Link`, `Popover`, `Menu`, `TagPicker`), `block` / `truncate` / `wrap` / `align` (`Text`), `inset` / `alignContent` (`Divider`).

When appearance props are not enough, the escape hatches are ordered by blast radius:

1. `className` / inline style on the instance — smallest radius.
2. `customStyleHooks_unstable` on `Provider` — keyed by component name, then by slot name; applies to every instance inside that provider and keeps your overrides in one place.
3. `overrides_unstable` on `Provider` — unstable, for provider-wide re-mapping of internals.

Prefer (1) for genuine one-offs and (2) whenever the same tweak would otherwise be repeated. Avoid reaching into internal DOM with a selector: the slot table is the contract, the internal DOM is not.

## 4. State ownership: uncontrolled seeds vs controlled values

Every stateful component follows one convention.

- **Uncontrolled:** you pass a `default*` prop once. The component owns the state from then on. Changing the `default*` prop later has no effect.
- **Controlled:** you pass the state prop plus its change handler. The component renders exactly what you give it and reports intent through the handler.

Representative pairs from the inventory:

| Component | Controlled | Uncontrolled seed | Change handler |
| --- | --- | --- | --- |
| `Dialog` | `open` | `defaultOpen` | `onOpenChange` |
| `Menu` | `open` | `defaultOpen` | `onOpenChange` |
| `Popover` | `open` | `defaultOpen` | `onOpenChange` |
| `Accordion` | `openItems` | `defaultOpenItems` | `onToggle` |
| `Tree` | `openItems` | `defaultOpenItems` | (see `selectionMode`, `checkedItems`) |
| `Card` | `selected` | `defaultSelected` | `onSelectionChange` |
| `Carousel` | `activeIndex` | `defaultActiveIndex` | `onActiveIndexChange` |
| `Input` / `Textarea` | `value` | `defaultValue` | `onChange` |
| `Checkbox` | `checked` | `defaultChecked` | `onChange` |
| `Switch` | `checked` | `defaultChecked` | `onChange` |
| `Slider` | `value` | `defaultValue` | `onChange` |
| `Rating` | `value` | `defaultValue` | `onChange` |
| `List` | `selectedItems` | `defaultSelectedItems` | `onSelectionChange` |
| `SwatchPicker` | `selectedValue` | `defaultSelectedValue` | `onSelectionChange` |
| `Nav` | `selectedValue` | `defaultSelectedValue` | `onNavItemSelect` |

Never pass both members of a pair for the same piece of state. `checked` plus `defaultChecked` is contradictory: the default is only a seed, but the controlled value wins — leaving readers unsure who owns the truth.

### Handler naming and signatures

Handler names are derived from the state they affect: `onChange`, `onOpenChange`, `onSelectionChange`, `onActiveIndexChange`, `onToggle`, `onSortChange`, `onCheckedValueChange`, `onOptionSelect`, `onTimeChange`, `onSelectDate`, `onNavItemSelect`, `onRegister` / `onUnregister`. The convention is `on<Thing>Change` for value updates and `on<Thing>Select` for selection intent.

Handlers receive the DOM event first and a typed data object second (for example `(ev, data) => data.value` for `Input`, `data.checked` for `Checkbox` and `Switch`, `data.selected` for `Card`). Always read from the data object rather than digging into the event target.

### Registration callbacks: parents own, children report

The most advanced pattern in the library is *registration*. `Tabs` receives `onRegister`, `onUnregister`, `onSelect` and holds `registeredTabs`, `selectedValue`, `previousSelectedValue`, `selectTabOnFocus` and `reserveSelectedTabSpace`. `Table` requires a `tableState` object and exposes `onSortChange`, `onSelectionChange`, `columnSizingOptions`, `autoFitColumns`, `containerWidthOffset` and per-column `columnId` / `width`. `Overflow` requires an `id` and reports `onOverflowChange` with an `OverflowState`.

The architectural lesson: **the parent owns the model; children register metadata; the composite computes layout-dependent behavior (focus order, column sizing, overflow) from that registry.** When you build your own composite, follow the same split — never let children own shared state.

## 5. Composition patterns

There are five ways to compose with v9 components. Pick deliberately.

1. **Configure (slot filling).** Pass content into named slots: `icon`, `contentBefore`, `contentAfter`, `floatingAction`, `label`, `hint`, `validationMessage`. This is the cheapest and most theme-safe option, and it is right most of the time.
2. **Compose (children).** Pass arbitrary children into the root slot for content-driven components: `Card`, `MessageBar`, `Dialog` (`children` is required), `Menu` (`children` is required), `TagPicker` (`children` is required).
3. **Render functions.** Several components accept a function so you can control rendering without forking the component: `TeachingPopover` (nav buttons and page-count render functions), `Rating.itemLabel` (accessible label per rating value), `Carousel.announcement` (custom screen-reader text), `Table.onSortChange` (receive sort state and re-render yourself), `TagPicker.onOptionSelect`.
4. **Wrap.** Build your own component that composes Fluent parts and exposes its own props, including forwarding `className` and refs to the root. This is how product-level design systems are built on top of v9.
5. **Go headless.** For preview surfaces — `HeadlessComponentsPreview`, `MotionComponentsPreview`, `MenuGridPreview` — the structure and behavior are provided with more of the styling left to you.

Prefer (1) and (2) until they genuinely cannot express your design. Wrapping before configuring produces thick adapters that quietly reimplement Fluent behavior.

## 6. Context and theming

`Provider` is the architectural seam between the library and your app:

- `theme` — a partial theme merged over the ambient one.
- `dir` — `'ltr' | 'rtl'`; every component's slots and logical styles flip accordingly.
- `targetDocument` — the document used for portals, events and style injection (iframes, SSR hydration).
- `applyStylesToPortals` — injects the provider's styles into portal containers, so `Tooltip`, `Menu`, `Dialog` and `Popover` surfaces rendered outside your app's DOM root stay themed.
- `customStyleHooks_unstable` / `overrides_unstable` — provider-wide style hooks.

Supporting context machinery lives one layer down: `ContextSelector` makes context subscriptions selective so a theme or registry change does not re-render every consumer, and `Tabster` carries the focus/navigation state that composites rely on. In most applications you never touch them directly — but knowing they exist explains why v9 components cooperate on focus and why provider-wide changes stay cheap.

In some packages and examples this provider is written as `FluentProvider`; it is the same component.

## 7. Layering: portals, positioning and modality

Anything that floats — menus, tooltips, popovers, teaching surfaces, dialogs, drawers — is layered above the app rather than nested in it. Four props control that layering:

- **Placement:** `Portal.mountNode` decides where the DOM goes, and `Positioning` (used through each overlay's `positioning` prop on `Tooltip`, `Menu`, `Popover` and `DatepickerCompat`) decides where the surface lands relative to its anchor.
- **Inline vs. portalled:** `Popover.inline`, `Menu.inline` and `TagPicker.inline` render the surface inside the trigger's subtree when you need it to participate in the surrounding layout (sticky headers, custom scroll containers). `Drawer.type` chooses between `'inline'` and `'overlay'` with the same intent.
- **Modality and focus:** `Dialog.modalType`, `Dialog.inertTrapFocus`, `Dialog.unmountOnClose`, `Popover.trapFocus`, `Popover.legacyTrapFocus`, `Popover.inertTrapFocus` and `Popover.unstable_disableAutoFocus` express how the layer interacts with focus. `Menu.persistOnItemClick` keeps the surface open after a selection; `Menu.closeOnScroll`, `Popover.closeOnScroll` and `Popover.closeOnIframeFocus` define dismissal behavior.
- **Trigger semantics:** `Menu.openOnContext`, `Menu.openOnHover`, `Menu.hoverDelay`, `Popover.openOnHover`, `Popover.openOnContext`, `Popover.mouseLeaveDelay`, `Tooltip.showDelay`, `Tooltip.hideDelay`, `Tooltip.visible` and `Tooltip.onVisibleChange` describe *why* a layer opens, not just whether it is open.

At the primitive level, `Portal` and `Positioning` are the pieces you assemble if you must build a custom layer yourself — but reaching for `Dialog`, `Popover` or `Menu` first means modality, focus containment, Escape handling and screen-reader wiring come for free.

## 8. Focus, navigation and selection modes

Keyboard behavior is configured through explicit mode props rather than left to the DOM:

- `focusMode: 'arrow' | 'tab'` — `Breadcrumb`, `SwatchPicker`: whether composite items are reached by arrow keys or by Tab.
- `Card.focusMode: 'off' | 'no-tab' | 'tab-exit' | 'tab-only'` — whether a card participates in tab order and whether Tab inside it exits.
- `Card.shouldRestrictTriggerAction` — veto hook for whether an event is allowed to trigger the card's action.
- `navigationMode` — `Tree`, `List`: how focus moves through items.
- `selectionMode` — `Tree`, `List`, `Table`: single, multiple, or none; `Tree.checkedItems` even supports mixed (indeterminate) checkbox state.
- `disabledFocusable` — `Button`, `Link`, `Switch`: renders a control that is *not actionable* but *is still focusable and announced*, which is the correct choice inside toolbars and menus where removing focus would break arrow-key traversal.

These props exist because the same visual component has different keyboard contracts in different contexts; the mode is architecture, not decoration.

## 9. Motion

Motion is part of the component architecture rather than an add-on animation layer.

- Composites own their surface transitions through `surfaceMotion` slots (`Dialog`, `Menu`, `Popover`) and `collapseMotion` (`Tree`).
- `Motion` is the standalone primitive: it takes `children`, `appear`, `replayKey`, `imperativeRef`, and reports lifecycle through `onMotionStart`, `onMotionFinish` and `onMotionCancel` — so application code can chain state changes to an animation instead of guessing at timings.
- `MotionComponentsPreview` adds staggering: `itemDelay`, `itemDuration`, `delayMode`, `hideMode`, `reversed`, `visible` and `onMotionFinish`.
- `Carousel` shows motion as a first-class behavior surface: `motion`, `draggable`, `whitespace`, `align`, `groupSize`, `circular`, `autoplayInterval` and `announcement` (the accessible narration of slide changes).
- `Toast.appearance` and `Spinner.delay` show that even ambient feedback is expressed declaratively instead of with hand-written timers.

## 10. Designing your own component the Fluent way

When you wrap or extend v9, mirror the architecture so your component feels native:

1. **Accept a single props object** and let callers pass `className`, `style` and refs to your root element.
2. **Name your slots after their role** (`header`, `floatingAction`, `icon`) and accept them as props — do not require callers to compose internal layout themselves.
3. **Support both controlled and uncontrolled usage** if you own state: `defaultX` to seed, `x` + `onXChange` to control.
4. **Report changes through typed data objects** (`(ev, data) => void`), not by mutating props.
5. **Add appearance axes instead of booleans** when the axis can grow: `size: 'small' | 'medium' | 'large'` beats `isSmall` and `isLarge`.
6. **Delegate accessibility to primitives.** Use `Field` for form wiring, `Tooltip.relationship` for label/description semantics, `Portal`/`Positioning` for layering, and `Aria` for announcements rather than re-implementing them.
7. **Never fork internals.** If the component does not expose a slot, the correct move is a new component composed from Fluent parts, not a CSS override against internal class names.

## 11. Choosing the right tool

| Need | Reach for |
| --- | --- |
| Show content above the flow, positioned to a trigger, dismissed on Escape | `Popover` (`inline` for layout-bound, default for portalled) |
| Modal task with focus containment | `Dialog` (`modalType`, `inertTrapFocus`, `unmountOnClose`) |
| Commands on click/hover/right-click with item semantics | `Menu` (`openOnHover`, `openOnContext`, `persistOnItemClick`) |
| Short text on hover/focus | `Tooltip` (`relationship` is required, so decide up front: `label`, `description` or `inaccessible`) |
| Onboarding sequence with steps | `TeachingPopover` |
| Persistent inline panel | `Drawer` with `type: 'inline'` |
| Selection with keyboard modes | `List`, `Tree`, `Table`, `SwatchPicker`, `Card` |
| Layout that must react to available width | `Overflow` with `id` / `groupId` and `onOverflowChange` |
| Global visual tuning | `Provider.customStyleHooks_unstable` |

## 12. Review checklist

- Every surface that floats is inside a `Provider`, and `applyStylesToPortals` is set when the portal target is outside the app root.
- No component receives both a `default*` prop and its controlled counterpart.
- Every controlled component has a handler that actually updates the state it reports.
- Slot content is passed through named slot props rather than by re-parenting DOM.
- Keyboard objects: `focusMode`, `navigationMode`, `selectionMode` and `disabledFocusable` were chosen intentionally.
- Appearance was tuned with appearance props first, `className` second, `customStyleHooks_unstable` when the same tweak repeats.
- Layered components declare their trigger semantics (`openOnHover`, `openOnContext`, delays) instead of open-coded listeners.

## Key Takeaways

- Slots are the contract: every component publishes named positions (root plus interior slots) and owns their order. You fill slots with props such as contentBefore, contentAfter, icon, label and floatingAction - you never reorder them from JSX.
- Appearance is an API. Use appearance/size/shape/color/orientation/vertical/inline props first, className for local one-offs, and Provider.customStyleHooks_unstable when the same visual tweak would otherwise be repeated across instances.
- State follows one convention everywhere: a default* prop seeds uncontrolled state, while a value prop plus an on*Change handler makes you the single source of truth. Never pass both halves of a pair for the same state.
- Composites own their model and children register into it (Tabs' onRegister/registeredTabs, Table's required tableState, Overflow's onOverflowChange). Parent owns state, children report metadata, the composite computes layout-dependent behavior.
- Layering is explicit: Portal.mountNode, inline on Popover/Menu/TagPicker, positioning for placement, and focus/modality props (Dialog.modalType, Dialog.inertTrapFocus, Popover.trapFocus, Popover.legacyTrapFocus) describe how a floating surface behaves rather than where it happens to render.
- Keyboard behavior is configured through mode props - focusMode, navigationMode, selectionMode, disabledFocusable - chosen per context, not left to DOM defaults.
- When you build your own component, mirror the architecture: single props object, className/ref forwarding, controlled and uncontrolled support, typed data-object handlers, role-named slots, and delegation to Field, Tooltip, Portal, Positioning and Aria for accessibility.
- Reach for the highest layer that solves the problem (Dialog/Popover/Menu before hand-rolled overlays), and drop to primitives (Portal, Positioning, Tabster, Aria) only when no higher-layer component expresses the behavior.

## Examples

### Slot composition: Field, Input and Badge

Shows how content is placed through named slots (contentBefore, contentAfter, icon, label, hint) rather than nested DOM. Note that rendering order is owned by the component and driven by props such as iconPosition.

```tsx
import * as React from 'react';
import {
  Badge,
  Button,
  Field,
  Input,
  Provider,
  Text,
} from '@fluentui/react-components';

export const SlotCompositionExample = () => {
  const [email, setEmail] = React.useState('');

  return (
    <Provider>
      {/* Field's slots render in a fixed order: label, children,
          validationMessageIcon, validationMessage, hint. */}
      <Field
        label='Work email'
        hint='Teammates use this address to mention you.'
        orientation='vertical'
        size='medium'
        validationState='none'
        required
      >
        <Input
          type='email'
          value={email}
          placeholder='name@contoso.com'
          contentBefore={<Text size={300}>@</Text>}
          contentAfter={
            <Button
              appearance='subtle'
              size='small'
              disabled={email.length === 0}
              onClick={() => setEmail('')}
            >
              Clear
            </Button>
          }
          onChange={(ev, data) => setEmail(data.value)}
        />
      </Field>

      {/* Badge renders icon, then root content - iconPosition decides the order. */}
      <Badge
        appearance='tint'
        color='success'
        shape='rounded'
        size='medium'
        icon={<span aria-hidden='true'>&#10003;</span>}
        iconPosition='before'
      >
        Verified
      </Badge>
    </Provider>
  );
};
```

### Controlled vs uncontrolled state

Contrasts the default-seed pattern with the controlled pattern across Switch, Checkbox, Slider and Rating, and shows a small controlled wrapper that translates the data-object handler into a domain-level callback.

```tsx
import * as React from 'react';
import {
  Checkbox,
  Provider,
  Rating,
  Slider,
  Switch,
  Text,
} from '@fluentui/react-components';

/** Uncontrolled: the control owns its state from first render. */
export const UncontrolledExample = () => (
  <Provider>
    <Switch defaultChecked label='Product updates' />
    <Checkbox defaultChecked label='Weekly digest' size='medium' shape='square' />
    <Rating
      defaultValue={3}
      max={5}
      step={1}
      itemLabel={(rating) => `${rating} of 5`}
    />
  </Provider>
);

/** Controlled: the parent is the single source of truth. */
export const ControlledExample = () => {
  const [volume, setVolume] = React.useState(40);
  const [notify, setNotify] = React.useState(true);
  const [state, setState] = React.useState<boolean | 'mixed'>('mixed');

  return (
    <Provider>
      <Text block>{`Volume ${volume}% / notifications ${
        notify ? 'on' : 'off'
      }`}</Text>

      <Slider
        min={0}
        max={100}
        step={5}
        value={volume}
        onChange={(ev, data) => setVolume(data.value)}
      />

      <Switch
        checked={notify}
        onChange={(ev, data) => setNotify(data.checked)}
        label='Desktop notifications'
      />

      <Checkbox
        checked={state}
        onChange={(ev, data) =>
          setState(data.checked === 'mixed' ? true : data.checked)
        }
        label='Select all messages'
      />
    </Provider>
  );
};

/** Wrapping a Fluent control keeps Fluent's data-object handler internal. */
type SummaryToggleProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
};

const SummaryToggle = ({ checked, onCheckedChange, label }: SummaryToggleProps) => (
  <Switch
    checked={checked}
    size='medium'
    label={label}
    onChange={(ev, data) => onCheckedChange(data.checked)}
  />
);

export const SummaryToggleUsage = () => {
  const [on, setOn] = React.useState(false);
  return <SummaryToggle checked={on} onCheckedChange={setOn} label='Daily summary' />;
};
```

### Building a reusable composite from Fluent parts

A product-level component that composes Card (root, floatingAction and selection slots) with Label, Text, Divider and Badge, exposes its own props, and keeps the Fluent state convention (selected + onSelectionChange) intact.

```tsx
import * as React from 'react';
import {
  Badge,
  Card,
  Divider,
  Label,
  Provider,
  Text,
} from '@fluentui/react-components';

type PlanCardProps = {
  name: string;
  price: string;
  summary: string;
  selected: boolean;
  onSelectedChange: (selected: boolean) => void;
  /** Optional content for Card's floatingAction slot. */
  ribbon?: React.ReactNode;
};

const PlanCard = ({
  name,
  price,
  summary,
  selected,
  onSelectedChange,
  ribbon,
}: PlanCardProps) => (
  <Card
    appearance='filled-alternative'
    orientation='vertical'
    size='medium'
    focusMode='tab-only'
    selected={selected}
    onSelectionChange={(event, data) => onSelectedChange(data.selected)}
    floatingAction={
      ribbon ?? (
        <Badge appearance='tint' color='brand' shape='circular' size='small'>
          {price}
        </Badge>
      )
    }
  >
    <Label weight='semibold' size='medium'>
      {name}
    </Label>
    <Text size={200} block>
      {summary}
    </Text>
    <Divider inset appearance='subtle' />
    <Text size={100}>{`Billed monthly - ${price}`}</Text>
  </Card>
);

export const PlanPicker = () => {
  const [selectedPlan, setSelectedPlan] = React.useState('pro');

  return (
    <Provider>
      <PlanCard
        name='Standard'
        price='$12'
        summary='Everything a small team needs to get going.'
        selected={selectedPlan === 'standard'}
        onSelectedChange={() => setSelectedPlan('standard')}
      />
      <PlanCard
        name='Pro'
        price='$28'
        summary='Advanced controls and unlimited history.'
        selected={selectedPlan === 'pro'}
        onSelectedChange={() => setSelectedPlan('pro')}
      />
    </Provider>
  );
};
```

### Provider, portals and layering

Shows the provider as the architectural seam (direction, portal style injection) and Portal.mountNode as the layering mechanism, plus Tooltip's required relationship prop and MessageBar's politeness contract.

```tsx
import * as React from 'react';
import {
  Button,
  MessageBar,
  Portal,
  Provider,
  Text,
  Tooltip,
} from '@fluentui/react-components';

export const LayeredAppShell = () => {
  const [mountNode, setMountNode] = React.useState<HTMLElement | null>(null);

  return (
    <Provider dir='ltr' applyStylesToPortals>
      <div
        ref={(node) => {
          setMountNode(node);
        }}
        style={{ position: 'relative', padding: 16 }}
      >
        {/* Tooltip forces a decision about semantics up front. */}
        <Tooltip
          content='Deletes the draft for everyone on the team'
          relationship='description'
          withArrow
          showDelay={200}
          hideDelay={100}
        >
          <Button appearance='primary' shape='rounded'>
            Delete draft
          </Button>
        </Tooltip>

        {/* Portal renders into mountNode when it exists, inline otherwise. */}
        <Portal mountNode={mountNode}>
          <MessageBar intent='warning' politeness='polite' shape='rounded'>
            <Text block>
              This banner is portalled out of the normal flow, yet still inherits
              the provider theme, direction and portal styles.
            </Text>
          </MessageBar>
        </Portal>
      </div>
    </Provider>
  );
};
```

### Global style hooks and the className escape hatch

Demonstrates customStyleHooks_unstable (keyed by component name, then by slot name) for provider-wide tuning, versus className for a genuinely local tweak.

```tsx
import * as React from 'react';
import {
  Badge,
  Button,
  Card,
  Provider,
  Text,
} from '@fluentui/react-components';

/**
 * customStyleHooks_unstable is keyed by component display name, then by slot
 * name. It applies to every instance inside this provider, so repeated tweaks
 * stay consistent with the theme instead of being duplicated per call site.
 */
const customStyleHooks = {
  Badge: {
    root: {
      letterSpacing: '0.04em',
      textTransform: 'uppercase' as const,
    },
  },
  Card: {
    root: {
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    },
  },
};

export const ThemedSurface = () => (
  <Provider customStyleHooks_unstable={customStyleHooks}>
    <Card appearance='outline' focusMode='off' size='large' orientation='vertical'>
      <Badge appearance='ghost' color='informative' size='small' shape='rounded'>
        Beta
      </Badge>
      <Text size={300} weight='semibold'>
        Global overrides, per slot
      </Text>
      {/* className remains the right tool for one-off, local adjustments. */}
      <Button appearance='primary' className='push-to-end' shape='rounded'>
        Continue
      </Button>
    </Card>
  </Provider>
);
```

### Accessibility wiring as composition

Uses Field for label/hint/validation wiring, Tooltip.relationship for accessible naming, MessageBar politeness for live-region behavior, and disabledFocusable to keep a control focusable while non-actionable.

```tsx
import * as React from 'react';
import {
  Button,
  Checkbox,
  Field,
  Input,
  Link,
  MessageBar,
  Provider,
  Select,
  Switch,
  Textarea,
  Tooltip,
} from '@fluentui/react-components';

export const AccessibleSettingsForm = () => (
  <Provider dir='ltr'>
    <Field
      label='Workspace name'
      hint='Visible to every member of the workspace.'
      required
      validationState='none'
      orientation='vertical'
    >
      <Input type='text' appearance='outline' size='medium' placeholder='Contoso' />
    </Field>

    <Field
      label='Billing contact'
      validationState='error'
      validationMessage='Enter a valid email address.'
      orientation='vertical'
    >
      <Input type='email' />
    </Field>

    <Field label='Support notes' orientation='vertical'>
      <Textarea resize='vertical' placeholder='Anything we should know?' />
    </Field>

    <Field label='Plan' orientation='horizontal'>
      <Select size='medium' onChange={(ev, data) => console.log(data.value)}>
        <option value='standard'>Standard</option>
        <option value='pro'>Pro</option>
      </Select>
    </Field>

    <Checkbox label='Send release notes' defaultChecked size='medium' shape='square' />

    {/* Focusable but not actionable - correct inside composite widgets. */}
    <Switch label='Two-factor authentication' disabledFocusable />

    <Tooltip content='Opens the billing portal in a new tab' relationship='label'>
      <Link href='https://example.com/billing' inline appearance='subtle'>
        Manage billing
      </Link>
    </Tooltip>

    <MessageBar intent='info' politeness='polite' shape='rounded'>
      Role changes are audited for 90 days.
    </MessageBar>

    <Button appearance='primary' shape='rounded' onClick={() => console.log('saved')}>
      Save changes
    </Button>
  </Provider>
);
```

## Pitfalls

- Trying to reorder slots with JSX. Moving an element earlier or later in children does not move it in the component's render tree; use iconPosition, labelPosition, contentBefore/contentAfter, alignContent or textPosition instead.
- Passing both a controlled prop and its default counterpart (for example checked and defaultChecked, or open and defaultOpen) for the same state - the default only seeds and the controlled value wins, producing contradictory behavior.
- Expecting a default* prop to update the component later. Changing defaultOpen/defaultChecked/defaultValue after mount has no effect; switch to the controlled prop plus its handler.
- Setting open/selected/checked from state but never updating that state in the matching handler, which freezes the component. onOpenChange, onSelectionChange and onToggle must feed state back.
- Rendering floating surfaces without a Provider above them, or without Provider.applyStylesToPortals when the portal target sits outside the app root, which leaves overlays unthemed and direction-unaware.
- Using Card.focusMode='off' (or plain disabled) and then expecting selection, focus and keyboard interaction to work. Use tab-only/no-tab for cards, and disabledFocusable on Button, Link and Switch when the control must stay focusable.
- Styling by reaching into internal DOM with selectors or !important. That bypasses tokens and breaks theming, RTL and high-contrast; use appearance props, then customStyleHooks_unstable at the provider.
- Forking a component's internals because one slot is missing, instead of composing a new component from Fluent parts and passing content through the documented slots.
- Building custom overlays by hand instead of using Dialog, Popover, Menu, Portal and Positioning, losing focus containment, Escape handling, anchor positioning and screen-reader wiring.
- Reading values off the DOM event when handlers supply a typed data object as the second argument (data.value for Input, data.checked for Checkbox/Switch, data.selected for Card, data.value for Select).
- Assuming a composite will manage shared state for you. Tabs, Table and Overflow require the parent to own the model (onRegister, tableState, id plus onOverflowChange); children only report.
- Mixing inline and portalled surfaces inconsistently. Popover.inline, Menu.inline and TagPicker.inline exist for layout-bound surfaces - choosing the wrong one produces clipping or detached positioning inside scroll containers.

## Accessibility

Accessibility in Fluent UI v9 is an architectural layer, not a checklist bolted on afterwards. Field is the wiring point for forms: it renders label, validationMessageIcon, validationMessage and hint in a fixed order and connects them to the control, so always build form rows from Field rather than free-floating Label and Text elements. Tooltip.relationship is required precisely so you must state intent - 'label' when the tooltip is the accessible name, 'description' for supplementary help, 'inaccessible' when it is decorative - because guessing produces duplicated or missing announcements. MessageBar.politeness ('polite' or 'assertive') controls live-region urgency, and MessageBar.intent conveys meaning that must not rely on color alone. Rating.itemLabel lets you replace bare numbers with meaningful text for each value. Focus behavior is declared through focusMode (Breadcrumb, SwatchPicker, Card, Table), navigationMode (Tree, List), selectionMode (Tree, List, Table) and disabledFocusable (Button, Link, Switch) - the last one keeps a control focusable and announced while making it non-actionable, which preserves arrow-key traversal in toolbars and menus. Composite keyboard contracts (aria-activedescendant traversal, roving tabindex, focus traps) come from the Tabster infrastructure underneath Dialog, Menu, Popover, Tabs, Tree and Table, and announcements come from Aria; that is why hand-rolled overlays usually regress accessibility. Tree.checkedItems supports a mixed state so tri-state selection is announced correctly. Finally, Provider.dir drives logical CSS and mirroring, so verifying RTL is part of verifying accessibility, not a separate task.

**Referenced components**: Provider, Button, Field, Input, Textarea, Label, Select, Combobox, Checkbox, Switch, Radio, Slider, Rating, Spinbutton, ColorPicker, Search, Infolabel, Badge, Avatar, Persona, Image, Skeleton, Text, Divider, Card, Link, MessageBar, Spinner, Progress, Portal, Positioning, Aria, Tabster, ContextSelector, Utilities, Tooltip, Dialog, Menu, Popover, Drawer, TeachingPopover, Toast, Accordion, Tabs, Tree, List, Nav, Breadcrumb, TagPicker, SwatchPicker, Table, Carousel, Overflow, Toolbar, Motion, MotionComponentsPreview, MenuGridPreview, HeadlessComponentsPreview, DatepickerCompat, TimepickerCompat, CalendarCompat

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
