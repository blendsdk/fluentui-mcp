# DialogContent

> **Package**: `@fluentui/react-dialog` v9.18.1
> **Import**: `import { DialogContent } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

DialogContent is the body region of a Fluent UI React v9 dialog. It renders one presentational element through its root slot and is designed to sit inside a DialogSurface, between the dialog title and the dialog actions, holding the descriptive copy, form fields, lists, or media that the dialog exists to present. Because it participates directly in the surface's own layout, DialogContent is the natural place to build a scrollable middle row: bound its height and let it scroll while the title stays pinned at the top and the buttons stay pinned at the bottom. Beyond body content it can also own the action region, either through its action slot or through the two-element children tuple, which is the compact formulation of the dialog where one component renders both content and buttons. The component itself is inert: it contributes no dialog role, no focus trap, and no dismissal behavior. Those behaviors belong to the enclosing Dialog and DialogSurface, whose state and configuration props (open, defaultOpen, onOpenChange, modalType, inertTrapFocus, unmountOnClose, backdrop, backdropMotion) are surfaced alongside it and are configured on the enclosing parts rather than on the content region.

**When to use**: Use DialogContent for the body of a dialog whenever you need a content region that can also carry the dialog's action row through its action slot or a two-element children tuple. Reach for it for confirmation copy, short forms, settings panels, and any content the user must acknowledge or complete before returning to the page. When you compose a dialog with a separate DialogActions element and want a dedicated, purely presentational body wrapper, DialogBody is the narrower alternative; when the content is really a warning or status message rather than task content, MessageBar inside the dialog body communicates that more precisely. Avoid DialogContent for inline, non-blocking messages on the page itself (use MessageBar or Toast), and avoid it for content that must remain interactive while the rest of the page is usable, unless you deliberately configure the enclosing dialog as non-modal through modalType.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `action` | `Slot<'div'>` | — | No | — |
| `action` | `DialogTriggerAction` | — | No | — |
| `appearance` | `'dimmed' \| 'transparent'` | — | No | — |
| `backdrop` | `Slot<DialogBackdropSlotProps>` | — | No | — |
| `backdropMotion` | `Slot<PresenceMotionSlotProps<FadeParams>>` | — | Yes | — |
| `children` | `[JSXElement, JSXElement] \| JSXElement` | — | Yes | — |
| `defaultOpen` | `boolean` | — | No | — |
| `disableButtonEnhancement` | `boolean` | — | No | — |
| `fluid` | `boolean` | — | No | — |
| `inertTrapFocus` | `boolean` | — | No | — |
| `modalType` | `DialogModalType` | — | No | — |
| `onOpenChange` | `DialogOpenChangeEventHandler` | — | No | — |
| `open` | `boolean` | — | No | — |
| `position` | `DialogActionsPosition` | — | No | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'h2', 'h1' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'div'>` | — | Yes | — |
| `unmountOnClose` | `boolean` | — | No | — |

### Prop Guidance

- **root**: The required root slot renders the element that wraps everything in the content region. Target it with className or the slot's own props to apply padding, max height, overflow, and grid placement; keep the default div element unless you have a specific reason to change the tag, because the surface's layout assumes a block-level row. `className from makeStyles`
- **children**: Accepts either a single element, which becomes the dialog body, or a tuple of exactly two elements, in which case the second element is treated as the dialog's action region. Prefer the single-element form when the buttons live in a sibling DialogActions, and the tuple form only when you deliberately want DialogContent to own both regions. `one element for body only, two elements for body plus actions`
- **action**: Optional slot for the dialog's action region rendered inside DialogContent. Use it when the buttons should be part of the same component as the content, and never combine it with the two-element children tuple or with a sibling DialogActions element. `a group of buttons`
- **position**: Aligns the action region horizontally at the start, center, or end of the content. Set it only when DialogContent renders the actions; when the buttons live in a separate DialogActions, configure the alignment there. End alignment is the convention for dialogs with a confirming action. `end`
- **fluid**: Stretches the action region to the full width of the dialog instead of sizing it to the buttons, which suits stacked, full-width buttons on narrow or touch-first layouts and equal-width button pairs. Leave it off for standard desktop dialogs where short buttons read better. `true`
- **appearance**: Selects the visual treatment of the dialog region: dimmed for the default modal look that separates the dialog from the page, transparent when the dialog must sit over custom or busy backdrop content. This is purely visual; it does not change dismissal or focus behavior. `dimmed`
- **modalType**: Declares the interaction model on the enclosing dialog: modal for standard blocking tasks, alert for dialogs that demand an immediate decision and are announced urgently, non-modal for dialogs the user can ignore. Decide this before styling, because it drives focus trapping, dismissal, and announcement behavior. `modal`
- **open**: Controlled visibility of the enclosing dialog. Use it when application state decides whether the dialog is shown, and pair it with onOpenChange so Escape, backdrop clicks, and trigger clicks all flow back into that state. Do not combine it with defaultOpen. `true`
- **defaultOpen**: Uncontrolled initial visibility for the enclosing dialog when the dialog manages its own open state after the first render. Useful for simple, self-contained confirmations and demos; switch to open plus onOpenChange as soon as other parts of the app need to know the dialog's state. `true`
- **onOpenChange**: Callback fired when the dialog requests a state change, carrying the requested open value and the reason for it. Handle it to synchronize controlled state and to reject dismissals (for example ignoring Escape or backdrop clicks on a dialog requiring an explicit decision). `update the controlling state from the reported value`
- **inertTrapFocus**: Makes the focus trap inert instead of actively cycling focus, which is useful when embedded content such as an iframe or a third-party widget needs to manage its own focus. Leave it off for ordinary modal dialogs so focus cannot escape to the page behind. `false`
- **unmountOnClose**: Controls whether the dialog's children are removed from the DOM on close. Enable it for content that should start fresh each time (forms, wizards, media) and for heavy subtrees you want released; leave it off to preserve state and avoid remount cost between openings. `true`
- **backdrop**: Slot for the element rendered behind the dialog surface. Use it when you need to attach a click handler, custom styling, or a different backdrop element, or when you want a modal dialog that cannot be dismissed by clicking outside. Configure it on the enclosing Dialog. `custom backdrop element with a click handler`
- **backdropMotion**: Slot that defines the presence animation of the backdrop, expressed as fade parameters. Tune the duration and easing here for a lighter or snappier open and close, and keep transitions short so they respect reduced-motion expectations. `fade parameters for the backdrop transition`
- **disableButtonEnhancement**: Belongs to the trigger that opens the dialog. Set it when the trigger's child is already a button, so the trigger does not wrap the child in a second button element and produce nested interactive elements; leave it off when the child is plain text or another non-button element. `true`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Place DialogContent inside a DialogSurface that is rendered by a Dialog, so the content inherits the surface's grid rows, focus trap, dismissal behavior, and dialog semantics.
- Render a DialogTitle inside the same surface and let the surface provide the accessible name for the dialog; treat DialogContent as the description and task area only.
- Make DialogContent the single scrolling region by giving it a bounded height plus vertical overflow, so the title and the primary action never scroll out of view.
- Give every control inside the content a visible label association (Field and Label) and keep the tab order inside the content logical from top to bottom.
- Reset transient state by using unmountOnClose when the content holds a form, a wizard step, or media that should start fresh on every open.
- Choose one action surface for the dialog: the action slot on DialogContent, the two-element children tuple, or a sibling DialogActions element, and keep it consistent within the product.
- Constrain content length; if the dialog needs several screens of information, split it into steps or move secondary detail to a page the dialog links to.

### Don'ts

- Don't put role dialog, aria-modal, or an accessible name on DialogContent; those belong to the surface, which owns the modal semantics and the reference to the title.
- Don't let the whole DialogSurface scroll; that pushes the title and the action buttons off screen and hides the way out of the dialog.
- Don't supply the action slot and a two-element children tuple, or an inline action region plus a sibling DialogActions, because the dialog will render two competing button rows.
- Don't treat the appearance value as a status signal; dimmed versus transparent is decorative and is invisible to assistive technology.
- Don't hard-code colors, paddings, or corner radii in the content; use theme tokens so the dialog follows light, dark, high-contrast, and density settings.
- Don't expect position or fluid to lay out the content itself; those props align and stretch the action region, so use the root slot's className for content layout.
- Don't nest a full page layout, another dialog trigger, or a second scroll container inside the content; nested scrolling in a modal is difficult to operate with a keyboard.

## Anti-Patterns

### Naming the dialog from inside the content

❌ A dialog is announced by its accessible name, which the surface derives from DialogTitle. When the only heading is a plain element inside the content region, the dialog is announced without a name and users cannot tell which task they landed in.

✅ Render DialogTitle inside the same DialogSurface and let the surface reference it, reserving DialogContent for descriptive text, fields, and other task content.

### Letting the whole surface scroll

❌ If the surface grows with the content and scrolls as one block, the title and the action buttons scroll out of view. Users lose the context of what they are confirming and can no longer see how to accept or dismiss the dialog.

✅ Keep the content region as the only scrollable row by bounding its height and setting vertical overflow, so the title stays pinned above and the actions stay pinned below.

### Duplicating the action region

❌ Combining the action slot, the two-element children tuple, or an inline action row with a sibling DialogActions renders two sets of buttons in unpredictable order, which confuses keyboard users and duplicates the primary action.

✅ Pick exactly one way to render actions per dialog, and keep that choice consistent across the product so button order and alignment never surprise users.

### Using appearance as a status signal

❌ Dimmed versus transparent only changes the visual backdrop. Treating transparency as a warning or severity cue conveys nothing to screen reader users and breaks in high-contrast themes.

✅ Convey urgency through modalType and through explicit copy or a MessageBar inside the content, and use appearance only to control how the dialog separates from the page behind it.

### Expecting layout props to style the content

❌ position and fluid act on the dialog's action region, not on the content. Applying them while trying to align text or fields produces no visible change and leads to inline style overrides.

✅ Style the content itself through the root slot's className with makeStyles, and reserve position and fluid for the button row.

### Stacking nested scroll containers inside a modal

❌ A second scrollable element inside an already scrollable dialog body traps the wheel and page keys, and keyboard users can end up in a region they cannot escape predictably.

✅ Keep a single scroll owner per dialog, flatten long lists into the content's own scroll region, or move large data sets to a dedicated page the dialog links to.

## Accessibility

**Requirements**: DialogContent is non-interactive, so its accessibility contract is inherited: the enclosing DialogSurface must expose role dialog (or alertdialog for an alert modalType) with aria-modal true, and it must be named through DialogTitle. If the content carries the descriptive sentence for the dialog, wire it up with aria-describedby on the surface so the description is announced after the name. All controls inside must be reachable by keyboard, have programmatic labels, and meet WCAG AA contrast (4.5:1 for body text, 3:1 for large text and UI boundaries). Focus must move into the dialog when it opens and return to the invoking trigger when it closes, background content must be hidden from the accessibility tree while a modal dialog is open, and any motion used on the backdrop or surface should respect the user's reduced-motion preference. Interactive targets should meet the 24 by 24 CSS pixel minimum size, with 44 by 44 recommended for touch.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the next focusable control inside the dialog content, staying within the modal dialog's focus trap. |
| `Shift+Tab` | Moves focus to the previous focusable control, wrapping within the dialog rather than escaping to the page behind it. |
| `Escape` | Requests dismissal of the modal dialog by default, reported through onOpenChange so the controlling state can be updated. |
| `Enter` | Activates the focused element, and submits the form when the content hosts a form with a default submit control. |
| `Space` | Activates the focused button, checkbox, switch, or other control inside the content region. |
| `Arrow Up / Arrow Down` | Moves within composite widgets such as radio groups or listboxes in the content, and scrolls the content region when it is made focusable. |
| `Page Up / Page Down` | Scrolls the content region by a viewport when the scrollable body itself has focus. |
| `Home / End` | Jumps to the start or end of the scrollable content region when that region is focused. |

**ARIA**: role="dialog" or role="alertdialog" on the DialogSurface root, not on DialogContent, aria-modal="true" on the surface while the dialog is modal, aria-labelledby pointing from the surface to DialogTitle, aria-describedby pointing from the surface to the element that holds the dialog's descriptive sentence, aria-label as a fallback name when no visible DialogTitle is rendered, aria-hidden or inert on background page content while a modal dialog is open, aria-disabled and the disabled attribute on controls inside the content rather than styling alone

**Screen Reader**: When the dialog opens, the surface is announced as a dialog with its accessible name taken from the title, followed by the description text that the surface references, which is often the first paragraph of DialogContent. Focus is then placed on the first focusable element or on the surface itself, so the user can begin reading the content in DOM order. While a modal dialog is open, the rest of the application is removed from the accessibility tree, so navigation commands stay inside the dialog until it closes. With an alert modal type the dialog is announced immediately, which suits destructive confirmations. Text inside DialogContent is read as ordinary document flow, so headings created with the title component and lists and paragraphs inside the content give the region the structure that makes it navigable by heading and list shortcuts.

## Styling

Style DialogContent through its root slot className, using makeStyles and mergeClasses so your classes combine with the component's atomic classes instead of replacing them. The most common adjustment is padding: the surface usually supplies tokens.spacingVerticalXXL and tokens.spacingHorizontalXXL around the content area, and you can tighten that for dense dialogs with tokens.spacingVerticalL and tokens.spacingHorizontalL. Body text should use tokens.colorNeutralForeground1 with tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300, while supporting copy uses tokens.colorNeutralForeground2. To create the scrollable middle row, set a max height (for example a percentage of the viewport) and vertical overflow on the root slot, and separate it from the action area with a top border in tokens.colorNeutralStroke2 or a background in tokens.colorNeutralBackground1. Links inside the content should use tokens.colorBrandForegroundLink, and inline validation messages read well in tokens.colorPaletteRedForeground1. Add responsive tweaks with Griffel media queries for narrow viewports, switching multi-column content inside the dialog to a single column, and rely on tokens.spacingVerticalXL and tokens.spacingVerticalM for consistent rhythm between paragraphs, fields, and lists.

## Performance

DialogContent's own rendering cost is negligible: it is a stateless, slot-rendered wrapper whose only work is class merging and forwarding props. The real cost lives in its children, which re-render whenever the component that owns the open state re-renders, so keep dialog state close to the dialog and memoize expensive subtrees such as data grids, charts, or editors. Because the dialog is rendered through a Portal, its styles are created with makeStyles at module scope rather than during render, which avoids generating new atomic classes on every pass. Setting unmountOnClose releases heavy children when the dialog closes and resets their state, at the price of remounting on the next open plus the cost of the presence animation; leaving it off preserves state and avoids that remount cost but keeps hidden DOM in the tree. Surface and backdrop motion run only on open and close, so keep their durations short to avoid dropped frames on low-end hardware, and avoid mounting many dialogs at once since each one adds DOM, a focus trap, and backdrop layers.

## Theming & Tokens

DialogContent reads everything from the nearest FluentProvider, so colors, typography, and density follow the active theme automatically. The surrounding surface typically paints the dialog with tokens.colorNeutralBackground1 and rounds it with tokens.borderRadiusXLarge, while content text uses tokens.colorNeutralForeground1 and secondary copy uses tokens.colorNeutralForeground2; body typography comes from tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300. Spacing is theme-driven: the default surface and content padding uses tokens.spacingVerticalXXL and tokens.spacingHorizontalXXL, with tokens.spacingVerticalL, tokens.spacingVerticalM, and tokens.spacingHorizontalL for internal rhythm, and separation between the scrollable content and the actions is usually a border in tokens.colorNeutralStroke2. Elevated treatment of the surface uses tokens.shadow64, the dimmed backdrop uses tokens.colorBackgroundOverlay, and the transparent treatment resolves to tokens.colorTransparentBackground. Interactive text inside the content should use tokens.colorBrandForegroundLink, hover states on rows use tokens.colorNeutralBackground1Hover, and validation messaging reads best with tokens.colorPaletteRedForeground1. In high-contrast themes these tokens resolve to system colors, so never bypass them with literal color values.

## Migration Notes

For teams moving from the older dialog API, DialogContent corresponds to the content region of the previous dialog body: the action slot and the two-element children tuple are the in-content way of rendering the dialog's buttons, which the newer single-purpose composition splits into a separate DialogActions element and a DialogBody content wrapper. When migrating, move headings out of the content region into DialogTitle, move the button row into DialogActions (or keep it via the action slot if you prefer one component), and configure open state, modalType, unmountOnClose, and backdrop on the enclosing Dialog instead of on the content itself. Visual differences are handled by theme tokens, so replace any hard-coded padding, radii, and colors carried over from earlier versions with the corresponding tokens values.

## Edge Cases

- DialogContent is designed to be rendered inside a DialogSurface within a Dialog; rendering it standalone removes the surface's layout rows, focus trap, and dialog semantics, so it should always be composed as part of the dialog family.
- A dialog surface is centered in the viewport, so content taller than the available height can be clipped. Always bound the content region's height and let it scroll rather than relying on the page to scroll.
- When children is a two-element tuple, the second element is treated as the action region; passing two sibling sections of body content reorders them into the action area unexpectedly.
- With unmountOnClose left at its default, state inside the content survives closing, so a form can reopen with stale values and validation messages still visible.
- Because dialogs render through a Portal, CSS scoped to an ancestor element on the page does not reach the dialog; theme context still flows through React, but ancestor-based selectors do not.
- The position prop uses logical start and end values, so an end-aligned action row appears on the left in right-to-left locales; verify both directions when you also set fluid.
- Opening more than one dialog at a time leaves the topmost dialog owning the focus trap and dimming; ensure each stacked dialog is dismissible so users are not stranded in the deepest layer.
- The transparent appearance leaves the page visible behind the dialog, which can reduce text contrast over busy content; verify contrast when you use it instead of the default dimmed treatment.

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
