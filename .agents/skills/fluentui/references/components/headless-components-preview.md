# HeadlessComponentsPreview

> **Package**: `@fluentui/react-headless-components-preview` v0.1.0
> **Import**: `import { HeadlessComponentsPreview } from '@fluentui/react-headless-components-preview';`
> **Category**: utilities
> **Stability**: unstable

## Overview

HeadlessComponentsPreview is the preview entry point for the headless (unstyled) layer of Fluent UI React v9 — a behavior-first library that gathers primitives such as Accordion, Avatar, Badge, Breadcrumb, Button, Card, Checkbox, Combobox, Dialog, Divider, Drawer, Dropdown, Field, Image, InfoLabel, Input, Label, Link, Menu, MessageBar, Nav, Persona, Popover, ProgressBar, RadioGroup, Rating, RatingDisplay, SearchBox, Select, Skeleton, Slider, SpinButton, Spinner, Switch, TabList, Tag, InteractionTag, TagGroup, TeachingPopover, Textarea, Toast, ToggleButton, Toolbar and Tooltip. Each primitive supplies semantics, keyboard interaction, focus management, ARIA wiring and positioning logic, but ships no visual design of its own. The package is consumed through per-component subpaths — for example the popover, positioning, toast, menu, combobox or tag-group subpath — so an application can pull in exactly the primitive it needs and leave the rest out of the bundle. Every part of every primitive is reachable for styling: the root accepts a plain className while internal parts are exposed as slot objects (input, indicator, label, listbox, button, icon, media, checkmark, rail, thumb, spinnerTail, textarea, expandIcon, clearIcon, clearButton, checkIcon, dismissIcon and many more), which is why the reference stories all pair a component with a component-scoped CSS module. Shared behaviour that several primitives depend on — anchor positioning, arrow rendering, fallback placement chains — lives in the positioning module and is exposed through a single positioning prop.

**When to use**: Use this package when you want Fluent UI React's battle-tested interaction behaviour, accessibility semantics and positioning engine, but not its visual design: for example when building a bespoke product design system, when styling with CSS modules, Tailwind, CSS-in-JS of another flavour, or when matching a brand that has nothing in common with the Fluent look. It is also the right choice when you are composing widgets that Fluent's styled layer does not cover exactly the way you need, because the headless parts compose freely (a MenuItem can be a plain item, a link or a checkbox, a Tag can host a Popover trigger, a Toast body can host arbitrary content such as a progress bar) and nothing is hidden behind fixed class names. Choose the styled Fluent UI React v9 components instead when you want a consistent Microsoft-adjacent look and feel out of the box and do not intend to author your own CSS for every state (rest, hover, pressed, focused, disabled, selected, invalid). Because the headless primitives are still a preview surface, treat the API as evolving and validate against the subpath imports you actually use.

## Props Reference

_No documented props._

### Prop Guidance

- **className**: The root styling hook on every primitive. Because nothing is styled by default, pass the class that establishes layout, colour, border, spacing and typography for the component's outer element; also use it for state variants such as a solid badge, a small button, an indeterminate progress bar or an inline drawer. `the class that paints the control surface`
- **input, textarea, select and fullValueInput**: Slot objects for the native form control inside Input, Textarea, Select, Checkbox, Switch and Rating. Style the actual element here (border, background, padding, focus outline, resize behaviour) rather than trying to reach it from the root; the Textarea story shows that resize can be disabled by targeting this slot. `the class that styles the native field`
- **indicator**: Slot for the visual control of Checkbox, Switch and Radio (the box, toggle track or circle). This is where the checked, unchecked, disabled and focus-visible appearance lives, since the real input is visually hidden and only carries semantics. `the class that draws the toggle track`
- **label**: Slot for the visible label of Checkbox, Switch, Radio, Field and Label. It accepts children plus a className, and on Field it can be a render function that receives label props so a richer label such as InfoLabel can be substituted for the plain one. `the class that styles label typography`
- **listbox**: Slot for the popup collection of Combobox and Dropdown. Use it for the surface, max height, scrolling and item spacing when the list grows long. `the class that styles the scrolling surface`
- **button**: Slot for the button element inside AccordionHeader and for the trigger button inside Dropdown. It is the correct place to style accordion header padding or the dropdown trigger chrome without touching the surrounding wrapper. `the class that styles the trigger chrome`
- **expandIcon, clearIcon, clearButton, checkIcon, checkmark, switchIndicator and dismissIcon**: Icon slots across Accordion, Combobox, Dropdown, Menu check items, Menu switch items and dismissible Tag. Size, colour and rotation belong here; keep the icon itself decorative with aria-hidden and put an accessible name on the interactive wrapper where one is required, as the tag dismiss icon does. `the class that sizes the chevron`
- **media, primaryText and secondaryText**: Content slots for Tag, InteractionTag, Persona and ToastTitle. Use media for a non-text lead such as initials, an avatar or an intent glyph, and the text slots when the label needs to be split into a strong primary line and a muted secondary line. `the class for the initials chip`
- **contentBefore and contentAfter**: Affix slots on Input and SearchBox for leading and trailing content — a search glyph, an inline action button or a voice-input control. They are the supported way to build chat-style inputs and search fields without wrapping the field in extra markup. `the class for the leading search icon`
- **bar, rail, thumb and spinnerTail**: Part slots for ProgressBar, Slider and Spinner. The progress bar exposes the filled bar element, the slider exposes the track and the draggable thumb alongside the hidden range input, and the spinner exposes its tail element so you can swap in a different spinner glyph or recolour the animation. `the class that fills the bar`
- **incrementButton and decrementButton**: Slots for the two stepper buttons of SpinButton. Supply their classes and, typically, their children (up and down chevrons) along with min and max to constrain the value range. `the class for the up chevron button`
- **positioning**: The shared positioning configuration used by Popover, Tooltip, TeachingPopover and the Combobox and Dropdown popups. Set position (above, below, before, after), align (start, center, end), offset as a number for the main axis or an object with mainAxis and crossAxis, coverTarget to overlay the anchor, matchTargetSize to equal the anchor's width, target to anchor to a foreign element, and fallbackPositions to replace the default flip chain. `below-start with an 8 pixel offset`
- **open, defaultOpen and onOpenChange**: The controlled and uncontrolled surface state for Dialog, Drawer, Menu, Popover, Combobox, Dropdown, NavDrawer and TeachingPopover. Pass open together with onOpenChange when the parent owns the state, and note that onOpenChange fires for every dismissal gesture including Escape, backdrop click and trigger click. `true`
- **withArrow**: Draws the pointer arrow on Popover, Tooltip and TeachingPopover surfaces. Arrow orientation follows the actual placement, and arrow padding near start- or end-aligned corners can be tuned from CSS rather than from a prop. `true`
- **relationship**: Decides how a Tooltip relates to its trigger. Use the description relationship for triggers that already have a visible label but need supplementary context, and the label relationship for icon-only controls that have no visible text at all. `description`
- **visible**: Fully controlled visibility for Tooltip, used when the tooltip is toggled by external state such as a settings preview rather than by hover or focus. `false`
- **intent**: Semantic tone for MessageBar and for dispatched Toast entries: success, info, warning and error. On MessageBar the intent also determines the live announcement; on Toast it is forwarded through context so children such as ToastTitle can render a matching glyph. `warning`
- **politeness**: Overrides the live-region politeness of a MessageBar when the preset intent's default announcement urgency is not right for the message. `polite`
- **disabled and disabledFocusable**: disabled removes a control from interaction and from the tab order (Button, Checkbox, Switch, Label, Combobox, Dropdown, Tag, InteractionTag, TagGroup, Toolbar items); disabledFocusable keeps a Button reachable by keyboard so its state can be discovered. On TagGroup and Card, disabled propagates down through context, so set it once at the group level. `disabledFocusable`
- **selected, defaultChecked and onSelectionChange**: Selection state for Card and for tag-like controls. A Card with a checkbox slot and an onSelectionChange handler toggles when the checkbox is used; when disabled is also set the card reports aria-disabled and selection toggling is short-circuited. Checkbox and Switch use defaultChecked for an uncontrolled initial value. `true`
- **value, defaultValue, selectedOptions, onOptionSelect and clearable**: The selection and display contract for Combobox and Dropdown. In controlled mode keep the displayed value synchronized with the selected options yourself, because the two are separate props; clearable adds the clear affordance, which needs its own clearIcon or clearButton slot. `Dog`
- **multiselect**: Allows more than one option to be chosen in Combobox and Dropdown. Selected options are shown as a comma-separated list inside the input or trigger, so size the control for multi-value text. `true`
- **freeform**: Lets a Combobox user type any value, not just one drawn from the list. The typed value is preserved even when it does not match an option, so validate the result yourself if the value must come from the collection. `true`
- **unmountOnClose**: Controls whether Dialog and Drawer keep their content mounted while closed. Setting it to false preserves state inside the surface — draft text in a textarea, for example — because the native dialog element manages visibility with show and close instead of removing the DOM. `false`
- **modalType**: Chooses the Dialog mode. The default modal dims the background and traps focus, non-modal leaves the page interactive with no focus trap, and alert raises the surface to role of alertdialog with higher announcement urgency and no backdrop dismissal. `alert`
- **type**: Selects the Drawer presentation: the default overlay drawer sits above the page, while an inline drawer participates in layout so the main content stays available beside it. `inline`
- **vertical**: Switches orientation on Divider and Toolbar. A vertical divider needs a container with a definite height to draw against, and a vertical toolbar stacks its buttons and dividers. `true`
- **hasCheckmarks and checkmark**: Reserves the leading indicator gutter on a MenuList and supplies the indicator content for MenuItemCheckbox, MenuItemRadio, MenuItemSwitch and plain menu selections. Every item in a list with checkmarks needs the slot so the text baselines stay aligned. `true`
- **name and value on menu items**: Group checkbox, radio and switch menu items into a named set so the Menu can report and control checked values together; combine with defaultCheckedValues for an uncontrolled initial selection and persistOnItemClick when the menu should stay open across toggles. `sortBy with the value name`
- **secondaryContent**: Trailing region of a MenuItem, used for keyboard shortcut hints, counts or other right-aligned meta. Pair it with a layout class that spreads the item so the content lands at the far edge. `a shortcut hint`
- **icon**: Lead element on Tag, InteractionTagPrimary, Persona and ToastTitle, and the glyph slot on ToolbarButton and ToolbarToggleButton. Keep it decorative with aria-hidden when the control already has a visible or accessible name. `a calendar glyph`
- **hasSecondaryAction**: Tells an InteractionTagPrimary that a sibling InteractionTagSecondary exists, so the primary renders as a focusable action paired with a separate dismiss affordance rather than as a single combined control. `true`
- **dismissible**: Adds the dismiss affordance to a Tag and routes dismissal through the surrounding TagGroup. The consumer is responsible for the visual and focus consequences of removal, including where focus should land afterwards. `true`
- **onDismiss, onTagSelect, onNavItemSelect and onNavCategoryItemToggle**: Collection callbacks for TagGroup and Nav. onDismiss receives the removed tag's value, onTagSelect drives multi-select tag groups, and the Nav callbacks report the selected value or the toggled category so open categories and selection can be controlled. `a handler that removes the dismissed tag`
- **selectedValue, defaultSelectedValue, openCategories, defaultOpenCategories and selectedCategoryValue**: Controlled and uncontrolled navigation state for Nav and NavDrawer. Use the default variants for simple static navigation and the controlled variants when the application must drive selection from outside, including from a random-navigation control. `overview`
- **max, value, onChange, selectedIcon and unselectedIcon**: The Rating contract: max sets how many items exist, value is the current score, onChange reports the chosen value, and each RatingItem supplies the filled and empty glyphs. RatingDisplay uses value and max for read-only output and adds compact, valueText and countText for dense layouts and review counts. `3 out of 5`
- **min and max**: Bounds for Slider and SpinButton. Keep the slider's min and max consistent with the value you display next to it so the visual and the text never disagree. `0 minimum and 100 maximum`
- **validationState, validationMessage, validationMessageIcon and hint**: Field presentation for validation: the state chooses success, warning or error semantics, the message carries the explanatory text, the icon accompanies it, and the hint slot provides persistent help text underneath the label. `error`
- **info, infoButton and required**: The InfoLabel contract: info is the popover content shown on demand, infoButton is the trigger glyph, and required renders an indicator that can be a plain asterisk or custom text and markup. Both are slots, so each part is styleable. `a required asterisk`
- **announcement and defaultValue**: TeachingPopoverCarousel options: defaultValue picks the first card to show, and announcement produces the spoken text for each slide so screen reader users know where they are in the tour. `Slide 1 of 3`
- **previous and next with navType and altText**: TeachingPopoverCarouselFooter slots for the back and forward actions. The hook supplies navType of prev or next, and you provide the visible children, the alt text used for the accessible name and the classes for styling. `a Done forward action`
- **timeout, toastId, position, pauseOnHover, pauseOnWindowBlur and onStatusChange**: Options for the toast controller and for individual dispatched toasts. timeout controls auto dismissal and a negative value disables it, toastId is required for update, dismiss, pause and play operations, position chooses the page corner, the pause options suspend the timer while the pointer is over the toast or the window loses focus, and onStatusChange reports each lifecycle transition from queued to unmounted. `a ten second timeout with pause on hover`
- **toasterId**: Pairs a Toaster with its toast controller so a page can host more than one independent toast stream. Multiple toasters are supported but explicitly not recommended for most applications, and mixing several positions in one application is discouraged because it disorients users. `an application-unique toaster identifier`
- **inline and current**: Inline positions a Link within surrounding text flow rather than as a standalone block, and current marks the active BreadcrumbButton so the last crumb reflects the current page. `true`
- **min, max, defaultValue and step-like bounds on SpinButton**: Wrap a SpinButton with an explicit label, give it min and max so the stepper cannot run past the valid range, and supply incrementButton and decrementButton slots for the chevrons. `1 with a maximum of 99`
- **label and labelPosition**: Spinner display options: label adds visible text next to the animation, and labelPosition moves that text below the spinner for stacked or narrow layouts. `below`
- **openOnHover, openOnContext, openOnHover on Menu and Popover**: Change what opens the surface. openOnHover opens a menu or popover on pointer hover and closes it when the pointer leaves both trigger and surface, while openOnContext opens on right click for context-menu patterns. `true`
- **aria-label on dismiss actions and icon-only triggers**: The headless primitives render no visible text for icon-only controls, so an explicit accessible name is mandatory on tag dismiss affordances, interaction-tag secondary actions, icon buttons and any trigger whose only content is a glyph. `remove`

## Examples

### Default

```tsx
import * as React from 'react';
import { ChevronRightRegular } from '@fluentui/react-icons';
import styles from './accordion.module.css';

export const Default = (): React.ReactNode => (
  <Accordion className={`${styles.accordion} ${styles.demo}`}>
    {items.map(item => (
      <AccordionItem className={styles.item} key={item.value} value={item.value}>
        <AccordionHeader
          className={styles.header}
          button={{ className: styles.headerBtn }}
          expandIcon={<ChevronRightRegular className={styles.expandIcon} aria-hidden />}
        >
          <span className={styles.label}>{item.header}</span>
        </AccordionHeader>
        <AccordionPanel className={styles.panel}>{item.panel}</AccordionPanel>
      </AccordionItem>
    ))}
  </Accordion>
);
```

### Default

```tsx
import * as React from 'react';
import { Avatar } from '@fluentui/react-headless-components-preview/avatar';
import styles from './avatar.module.css';

export const Default = (): React.ReactNode => (
  <div className={styles.demo}>
    <div className={styles.demoRow}>
      <Avatar name="Alice Johnson" className={`${styles.avatar} ${styles.size32}`} />
      <Avatar name="Bilal Ahmad" className={`${styles.avatar} ${styles.size40} ${styles.tone1}`} />
      <Avatar name="Carlos Diaz" className={`${styles.avatar} ${styles.size56} ${styles.tone2}`} />
      <Avatar name="Dina Rivera" className={`${styles.avatar} ${styles.size72} ${styles.tone4}`} />
    </div>

    <Avatar
      className={`${styles.avatar} ${styles.size56}`}
      name="Katri Athokas"
      initials={{ className: styles.initials }}
      image={{
        className: styles.image,
        src: 'https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/KatriAthokas.jpg',
      }}
    />

    <div className={styles.stack}>
      {['Alice', 'Bilal', 'Carlos', 'Dina'].map((name, i) => (
        <Avatar
          key={name}
          name={name}
          className={`${styles.avatar} ${styles.size40} ${styles[`tone${(i % 4) + 1}` as 'tone1']}`}
        />
      ))}
    </div>

    <div className={styles.row}>
      <Avatar name="Eve Park" className={`${styles.avatar} ${styles.size40} ${styles.tone3}`} />
      <div className={styles.meta}>
        <span className={styles.metaName}>Eve Park</span>
        <span className={styles.metaSub}>Product designer · Online</span>
      </div>
    </div>
  </div>
);
```

### Default

```tsx
import * as React from 'react';
import { Badge } from '@fluentui/react-headless-components-preview/badge';
import styles from './badge.module.css';

export const Default = (): React.ReactNode => (
  <div className={styles.demo}>
    <Badge className={styles.badge}>Default</Badge>
    <Badge className={`${styles.badge} ${styles.solid}`}>Solid</Badge>
    <Badge className={`${styles.badge} ${styles.success}`}>
      <span className={styles.dot} />
      Success
    </Badge>
    <Badge className={`${styles.badge} ${styles.warning}`}>
      <span className={styles.dot} />
      Warning
    </Badge>
    <Badge className={`${styles.badge} ${styles.danger}`}>
      <span className={styles.dot} />
      Error
    </Badge>
    <Badge className={`${styles.badge} ${styles.info}`}>
      <span className={styles.dot} />
      Info
    </Badge>
    <Badge className={`${styles.badge} ${styles.counter}`}>9</Badge>
  </div>
);
```

## Best Practices

### Do's

- Style every rendered part through the component's slot props, not just the root className — pass classes for input, indicator, label, listbox, button, icon and the other slots the story uses so the composed DOM is fully controlled.
- Give controlled widgets a single source of truth: when selection is controlled, keep the displayed value in sync with the selected options, as the Combobox and Dropdown documentation explicitly requires.
- Give every icon-only trigger an accessible name — icon buttons, tag dismiss affordances and interaction-tag secondary actions all rely on aria-label because there is no visible text.
- Mark decorative icons with aria-hidden so screen readers do not announce the glyph alongside the label text.
- Prefer the built-in placement behaviour over manual offsets: set position and align on the positioning prop, and use fallbackPositions when a placement might overflow rather than pinning the surface to a fixed coordinate.
- Memoize the object you pass to the positioning prop and use a callback ref for positioning.target so positioning work is not repeated on unrelated renders.
- Express intent through the primitives that model it — intent on MessageBar and Toast, politeness on MessageBar, validationState on Field, selected on Tag — instead of hand-rolling live regions or invalid styling hooks.
- Wire focus management yourself where the headless layer deliberately omits it, such as restoring focus to the first remaining tag (or to a reset control) after a TagGroup dismiss, and moving focus to newly revealed focusable content inside an open Popover.
- Forward refs when wrapping a custom trigger component, so the composite widgets that need the trigger's DOM node and aria attributes can attach them.

### Don'ts

- Do not expect any default appearance: these primitives render unstyled DOM, so a button with no className looks like a raw browser button in every theme, light, dark and high contrast alike.
- Do not pass positioning props the headless positioning hook does not consume — autoSize, flipBoundary, overflowBoundary, overflowBoundaryPadding, useTransform, shiftToCoverTarget, arrowPadding, onPositioningEnd and disableUpdateOnResize are intentionally omitted from the supported set, so they will silently do nothing.
- Do not put a raw element inside PopoverTrigger or TeachingPopoverTrigger without ensuring it can receive a ref and spread the aria attributes the trigger applies.
- Do not assume a disabled Label will be legible — the documentation warns that the disabled state does not meet the required accessibility contrast ratio, so use it sparingly and make the inert relationship obvious.
- Do not rely on the headless TagGroup to restore focus after a dismissal, or on a nested Dialog to close its parent — the inner dialog closes only itself.
- Do not expose an alert dialog (modalType set to alert) with the expectation that clicking the backdrop dismisses it; only the action buttons can close it.
- Do not mix toast positions in one application, and do not stand up multiple Toasters unless you genuinely need separate toast streams; the multiple-toaster story calls this use case not recommended.
- Do not spread a freshly created positioning object on every render of a frequently updating tree, or positioning will recompute more often than necessary.

## Anti-Patterns

### Styling only the root and leaving the internals unstyled

❌ Headless primitives render every part as a real DOM node, so passing a single className styles the wrapper at best and leaves the input, indicator, icon, listbox or thumb looking like raw browser defaults — the composition looks broken in every theme.

✅ Style each part through its slot object. Pass classes for input, indicator, label, listbox, button, icon, media, rail, thumb, spinnerTail, expandIcon, clearIcon, clearButton, checkIcon, checkmark, dismissIcon, bar and the rest, and drive state-specific looks from the data attributes the primitives expose, such as data-selected, data-disabled and data-placement.

### Editing a controlled Combobox or Dropdown value without updating the selection

❌ The displayed value and the selected options are separate props. Setting one and not the other leaves the field showing text that no longer matches the highlighted option, so the user sees a stale or contradictory selection.

✅ Keep both in the same handler: when the selection changes, update the selected options and the displayed value together, as the reference implementation does in its option-select callback. If you only need the picker to manage itself, use the uncontrolled path and skip the controlled props entirely.

### Passing positioning options the headless hook does not consume

❌ The headless positioning layer destructures a deliberately narrow subset of the positioning contract. Options such as autoSize, flipBoundary, overflowBoundary, overflowBoundaryPadding, useTransform, shiftToCoverTarget, arrowPadding, onPositioningEnd and disableUpdateOnResize are excluded, so passing them produces no error and no effect — surfaces overflow or resize unexpectedly and the bug is hard to trace.

✅ Use only the supported options: position, align, offset, coverTarget, matchTargetSize, target and fallbackPositions. Achieve boundary behaviour through fallbackPositions chains, constrain the container so the surface has somewhere to flip, and set surface sizing from CSS.

### Expecting the headless layer to restore focus after a dismissal

❌ When a Tag or InteractionTag is dismissed from a TagGroup, the focused element is removed from the DOM and focus falls back to the document body. Keyboard users lose their place and have to tab from the top of the page again.

✅ Own focus restoration explicitly. Keep a ref to the first remaining tag — or to a reset control — and move focus there after the dismissed item unmounts, exactly as the reference dismiss examples do with their refs and reset affordance.

### Wrapping a custom trigger without forwarding the ref

❌ Popover, Tooltip, TeachingPopover and the menu family need the trigger's DOM node to anchor the surface and to apply the trigger's aria attributes. A component that swallows props or does not forward its ref breaks both positioning and the accessible relationship.

✅ Use native elements or components that already support refs and prop forwarding as trigger children. When you must use your own component, forward the ref and spread the incoming props onto the rendered element so the trigger can attach the anchor and the aria wiring.

### Leaning on an alert dialog to behave like a normal modal

❌ An alert dialog sets role of alertdialog on its surface, which raises announcement urgency and intentionally prevents backdrop dismissal. Treating it as an ordinary modal leaves users clicking the backdrop with nothing happening and no obvious way out.

✅ Reserve the alert modal type for critical decisions that require an explicit choice, and always provide clear Cancel and Confirm actions inside the actions region. Use the default modal type for informational dialogs where backdrop dismissal is acceptable.

### Scattering toast positions and toasters across an application

❌ Different areas of the product dispatching toasts in different corners, or several independent toasters competing for attention, makes notifications hard to find and forces users to scan the whole viewport.

✅ Pick one position and one toaster for the whole application, configure it in the Toaster, and reserve additional toasters for genuinely separate surfaces such as separate windows or embedded hosts.

## Accessibility

**Requirements**: The primitives provide structure and behaviour but not colour, so WCAG 2.1 AA contrast is entirely your responsibility: 4.5:1 for text and 3:1 for non-text UI elements and focus indicators, in light, dark and high-contrast modes. Build a clearly visible focus style for every focusable part, because focus appearance is not supplied. Keep the native elements the primitives render — button, input, textarea, select, a, dialog, nav — rather than swapping in generic containers, so that form participation, implicit roles and native keyboard handling survive. Provide a name for every control: aria-label on icon-only buttons and dismiss actions, the label slot on Checkbox, Switch, Radio, Field and Label, and an aria-label on landmark-level components such as Breadcrumb and the Nav family. The disabled Label state is documented as not meeting the required contrast ratio, so use it sparingly and only where the loss of interaction is unambiguous. Disabled Card content sets aria-disabled on the root and short-circuits selection toggling, which keeps the card reachable while signalling that selection is locked; preserve that distinction rather than removing the card from the tab order.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus between controls; composite widgets such as Menu, Toolbar, TabList, Nav and the Combobox listbox keep a single tab stop and move focus internally. |
| `Enter` | Activates buttons, toggle buttons, menu items, breadcrumb buttons and links. |
| `Space` | Toggles Checkbox, Switch and ToggleButton states and activates buttons. |
| `Escape` | Closes the open surface: Dialog, Popover, TeachingPopover, Menu, Combobox or Dropdown listbox. With nested dialogs only the innermost dialog closes. |
| `ArrowDown and ArrowUp` | Opens and moves through Combobox, Dropdown and Menu items, Toolbar groups and Nav items. |
| `ArrowLeft and ArrowRight` | Moves between Toolbar items, TabList tabs and rating items in horizontal arrangements. |
| `Home and End` | Jumps to the first or last item inside Menu, TabList and listbox-style collections. |

**ARIA**: aria-label, aria-describedby, aria-disabled, aria-hidden, aria-expanded, aria-pressed, aria-selected, aria-current, aria-live via the politeness prop on MessageBar, role of alertdialog when a Dialog uses the alert modal type, role of listbox, list and listitem on tag and option collections, role of log and group on composite containers such as the toast status log and toolbar groups

**Screen Reader**: Screen reader output is driven by the primitives' ARIA wiring plus whatever names you supply. A Tooltip with the description relationship attaches the tooltip text as a description on the trigger (aria-describedby), while the label relationship names the trigger (aria-label) so an icon-only button is announced even when the tooltip is not visible. MessageBar applies preset intents that determine the live-region announcement, and the politeness prop lets you tune how assertive that announcement is. A Dialog created with the alert modal type sets role of alertdialog on the surface, so assistive technology announces it with higher urgency than a normal dialog and does not treat a backdrop click as a dismissal. A Tag that is selected reports its state through aria-pressed, or aria-selected when the surrounding TagGroup exposes a listbox role, while a disabled Tag and a disabled InteractionTag expose a disabled data attribute that matches the visual treatment. Decorative icons are announced as nothing when marked aria-hidden, which is why every icon slot in the reference stories is marked that way.

## Styling

Because nothing ships styled, every visual decision is a CSS decision you own. The recommended pattern from the reference stories is a CSS module per component, with one class for the root (passed as className) and one class per slot object (input, indicator, label, listbox, button, icon, media, checkmark, rail, thumb, spinnerTail, textarea, select, bar, expandIcon, clearIcon, clearButton, checkIcon, dismissIcon, dismissButton, info, infoButton, required, contentBefore, contentAfter, primaryText, secondaryText, header, description, action, image, validationMessage, validationMessageIcon, hint, previous, next and so on). State is exposed through data attributes rather than style props: data-selected on a selected Tag, data-disabled on a disabled Tag or InteractionTag, and data-placement on any positioned surface, which lets you rotate arrows or shift padding per actual placement. The arrow is CSS-owned — the surface reads a custom property for its arrow padding, defaulting to 12px, and an inline style can override it for start- or end-aligned surfaces. If you want a Fluent-consistent result without adopting the styled components, map the design tokens into your own custom properties: tokens.colorNeutralBackground1 for surfaces, tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed for interactive states, tokens.colorNeutralStroke1 and tokens.colorNeutralStroke2 for borders, tokens.colorNeutralForeground1 and tokens.colorNeutralForeground2 for primary and secondary text, tokens.colorNeutralForeground3 for hints, tokens.colorBrandBackground and tokens.colorBrandForeground1 for primary actions, tokens.colorPaletteRedForeground1 for error, tokens.colorPaletteGreenForeground1 for success and tokens.colorPaletteYellowForeground1 for warning, tokens.borderRadiusMedium and tokens.borderRadiusCircular for shape, tokens.spacingHorizontalS, tokens.spacingHorizontalM and tokens.spacingVerticalM for rhythm, tokens.fontFamilyBase, tokens.fontSizeBase200, tokens.fontSizeBase300, tokens.fontWeightSemibold and tokens.lineHeightBase300 for type, tokens.shadow4 and tokens.shadow16 for elevated surfaces such as popovers and drawers, tokens.strokeWidthThin for hairlines, tokens.colorStrokeFocus2 for the focus ring, and tokens.durationNormal with tokens.curveEasyEase for transitions.

## Performance

Positioning is the most performance-sensitive part of this package: the positioning prop drives anchor measurement and placement recalculation, so build the object once (for example with React.useMemo) and keep its identity stable across renders that do not change placement. Anchoring to an element held in React state forces an extra render when the target mounts; a callback ref is cheaper when the anchor is stable. Keystroke-driven widgets such as Combobox and Dropdown re-render on every input change, so keep their option lists memoized and avoid inline object literals for the slot props of each option, since each option receives several slot objects (checkIcon among them). Long menu, nav or listbox collections benefit from virtualizing or trimming the rendered set, because every item is a real DOM node with a roving tab index. Dialog and Drawer keep the native dialog element mounted when unmountOnClose is false, which trades memory and preserved state against the cost of remounting rich content each time — sensible for short forms, wasteful for heavy panels. Toasts are cheap while visible but their timers, pause-on-hover handlers and window focus listeners persist for the life of the toast, so prefer a timeout and avoid stacking dozens of simultaneous toasts. Skeleton placeholders are deliberately trivial to render, so prefer them over expensive real content that is about to be replaced.

## Theming & Tokens

This package does not consume the Fluent theme context for visual values and does not emit Griffel classes — it renders plain DOM, so there is no tokens.* reference anywhere in the rendered output and no FluentProvider is required to make the components work. Theming therefore means authoring your own token layer and referring to it from the CSS you attach to each slot. If you want Fluent values, import the design tokens and use them as the source of truth in your stylesheets: tokens.colorNeutralBackground1 for card, popover and dialog surfaces, tokens.colorNeutralBackground2 for subtle bars such as MessageBar and Skeleton placeholders, tokens.colorNeutralStroke1 for input and divider lines, tokens.colorNeutralForeground1 for body text, tokens.colorNeutralForeground2 for secondary text such as Persona subtitles, tokens.colorNeutralForeground3 and tokens.colorNeutralForegroundDisabled for hints and disabled labels, tokens.colorBrandBackground, tokens.colorBrandBackgroundHover and tokens.colorBrandForeground1 for the primary button, tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed for subtle and outline button states, tokens.colorPaletteRedForeground1 with tokens.colorPaletteRedBackground1 for error validation, tokens.colorPaletteGreenForeground1 for success toasts and progress completion, tokens.colorPaletteYellowForeground1 for warnings, tokens.colorStrokeFocus2 for focus outlines, tokens.borderRadiusMedium, tokens.borderRadiusLarge and tokens.borderRadiusCircular for tag, control and avatar shapes, tokens.spacingHorizontalM, tokens.spacingVerticalM and tokens.spacingVerticalL for interior padding, tokens.fontSizeBase300 and tokens.fontWeightSemibold for titles, tokens.shadow16 for elevated popovers and drawers, and tokens.durationNormal with tokens.curveEasyEase for the open and close transitions you write. Because these tokens are theme-aware, wiring them in gives you light, dark and high-contrast support for free.

## Migration Notes

The headless layer intentionally differs from the styled Fluent UI React v9 components. Imports change from the shared component entry point to per-component subpaths (for example the dialog, drawer, toast, tag-group, positioning or teaching-popover subpath), so a single bundled import of every component disappears in favour of tree-shakeable deep paths. Styling no longer arrives from Griffel classes or theme tokens: every part is unstyled and you supply class names per slot, meaning that appearance-like props and design props have no equivalent here. Some behaviour moves to the consumer as well — a headless TagGroup does not restore focus after a dismissal or selection change, so you wire refs and focus yourself, and a headless Toast has no ToastTrigger equivalent, so you close a toast by consuming the container context or by calling the controller's dismiss API. Dialog and Drawer lean on the native dialog element and its show and close methods, which is why keeping the surface mounted still preserves internal state such as draft text. The positioning API is also narrower than the styled one: props that the headless hook does not destructure (autoSize, flipBoundary, overflowBoundary, overflowBoundaryPadding, useTransform, shiftToCoverTarget, arrowPadding, onPositioningEnd, disableUpdateOnResize) are deliberately excluded from the advertised set.

## Edge Cases

- When no fallbackPositions are given, the default flip chain runs, so a surface requested above a trigger near the top of the viewport ends up below and a surface requested below a trigger near the bottom ends up above, with corner-aligned requests also swapping start and end. Supplying your own fallback chain replaces the defaults entirely rather than extending them, so you must include every placement you want considered.
- The flip and fallback logic walks the chain in order and stops at the first placement that fits; a chain whose earlier entries also overflow silently falls through to the next one, which can make the final placement look unpredictable until you read the actual placement value back from the surface.
- Arrow padding near start- and end-aligned corners is owned by CSS: the surface rule reads a custom property that falls back to 12px, so a wide arrow or a corner-aligned surface may need that value overridden inline on the surface itself.
- When positioning is anchored with the target option instead of a trigger, the surface can render even when no trigger exists at all, which is the supported pattern for programme-driven popovers; the trade-off is that you must supply the anchor element and handle open state yourself.
- A nested Dialog creates its own dialog context and reports itself as nested, so pressing Escape closes only the innermost dialog and leaves the parent open — the reverse behaviour is a common expectation and a common surprise.
- A non-modal dialog neither dims the background nor traps focus, so interactive content behind it remains reachable. That is the point, but it also means users can tab out of the dialog without closing it.
- Keeping a dialog mounted with unmountOnClose set to false preserves all internal state, including form values and uncontrolled input content, and relies on the native dialog element's show and close methods — so anything you expected to reset on close will not reset.
- A negative toast timeout disables auto dismissal entirely, which means the toast will remain until it is explicitly dismissed; pair it with a visible dismiss affordance or an imperative dismiss call when the underlying work completes.
- Multiselect ComboBox and Dropdown render selected values as a comma-separated string in the input or trigger, which can overflow the control when many options are chosen; plan for truncation or a wider control.
- A disabled Label is documented as not meeting the required accessibility contrast ratio, so a disabled form rebuilt on that label will fail a contrast audit even though the semantics are correct.
- Custom trigger components that do not forward refs will not be positioned correctly and will not receive the trigger's aria attributes, which is why the reference material insists on ref forwarding.
- Popover content can change while the surface is open; new focusable content that is revealed without moving focus leaves keyboard users stranded on the previous control.

## See Also

- - [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
