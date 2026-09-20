# DialogSurface

> **Package**: `@fluentui/react-dialog` v9.18.1
> **Import**: `import { DialogSurface } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

DialogSurface is the styled container that renders the visible box of a Fluent UI dialog. It is the element that receives role="dialog" (or role="alertdialog"), carries aria-modal for modal dialogs, traps focus while open, and hosts the dialog's content such as DialogTitle, DialogBody and DialogActions. It consumes the dialog state supplied by a parent Dialog and DialogTrigger, so props like open, defaultOpen, onOpenChange, modalType and unmountOnClose can be read from the surface itself. A sibling backdrop is rendered by the backdrop slot (a dimmed or transparent overlay) and a backdropMotion slot is available for animating that overlay. Because the surface is normally mounted through Portal, it escapes ancestor overflow clipping and stacking contexts, and it participates in modal layering, focus management and Escape-to-dismiss behavior.

**When to use**: Use DialogSurface whenever you compose a Dialog and need a windowed, blocking or semi-blocking interaction that demands the user's attention: confirmations, destructive-action warnings, short forms, and focused tasks that should interrupt the current flow. It is the correct choice when the content is a task the user must complete or dismiss before returning to the page. Prefer lighter alternatives when interruption is not warranted: use Popover or TeachingPopover for anchored, non-blocking contextual content, Drawer or InlineDrawer for side panels and navigation surfaces, MessageBar for inline status or alerts that live in the page flow, and Toast for transient notifications that need no decision. Choose modalType "alert" only for high-consequence interruptions that require an explicit acknowledgement.

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

- **modalType**: Selects the dialog's modality and therefore its ARIA role and focus behavior. Use "modal" for standard task dialogs, "alert" for destructive or irreversible confirmations that require an explicit response, and "non-modal" only when the user must keep interacting with the page behind the dialog. `alert`
- **open**: Controlled visibility of the surface. Provide it together with onOpenChange when the parent owns the state, and never mix it with defaultOpen. `true`
- **defaultOpen**: Uncontrolled initial visibility for simple cases where the surface manages its own state. Use it only when no external code needs to read or set the open state. `false`
- **onOpenChange**: Callback invoked when the dialog requests a state change, such as from Escape or a trigger. Use it to keep controlled state in sync and to run cleanup or validation before actually closing. `(event, data) => setOpen(data.open)`
- **unmountOnClose**: Controls whether the dialog's children are removed from the DOM when it closes. Keep the default unmounting behavior for most dialogs; set it to false only when you must preserve internal state such as form input or scroll position between openings. `false`
- **inertTrapFocus**: Applies inert to the rest of the document instead of relying purely on a JavaScript focus trap. Prefer it for modal dialogs when you need stronger guarantees that background content cannot be reached, and avoid combining it with non-modal behavior. `true`
- **appearance**: Controls the backdrop visibility. Use "dimmed" for a normal modal presentation and "transparent" for nested dialogs or contexts where a second dimmed layer would be visually wrong. `dimmed`
- **backdrop**: Slot for the dimmed background. Replace or restyle it to change the overlay, but keep it non-interactive and give the replacement element aria-hidden="true" so assistive technology ignores it. `{ className: styles.customBackdrop }`
- **backdropMotion**: Motion slot that animates the backdrop as it appears and disappears. Use it to align the overlay's fade with the surface's entrance so the two do not desynchronize. `{ visible: isOpen }`
- **root**: The required root slot for the surface element. Extend it with className or style for layout tweaks, but avoid changing its element semantics since the dialog role and focus behavior depend on it. `{ className: styles.surface }`
- **children**: The dialog's content, typically DialogTitle, DialogBody and DialogActions. Pass a single element for simple dialogs or a small ordered set of elements when the title, body and actions need to be individually positioned. `DialogTitle, DialogBody, DialogActions`
- **fluid**: Lets the dialog's content span the full available width rather than being sized by its content. Use it for form-heavy or data-heavy dialogs; leave it off for short confirmation dialogs. `true`
- **position**: Determines where the dialog's action region is aligned within the layout. Use "end" for the conventional trailing action row and "start" when the design calls for leading actions. `end`
- **action**: Defines what a trigger inside the dialog does when activated: open, close, or toggle. Set it on nested triggers such as a cancel button so they close the surface while the primary trigger still opens it. `close`
- **disableButtonEnhancement**: Prevents the trigger from injecting button semantics and tab focus into its child. Use it when the child is already a real button, or when you need to opt out of the enhancement for a custom control. `true`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `backdrop` | — | No | Dimmed background of dialog. The default backdrop is rendered as a `<div>` with styling. This slot expects a `<div>` element which will replace the default backdrop. The backdrop should have `aria-hidden="true"`.  Accepts an `appearance` prop to control backdrop visibility: - `'dimmed'`: Always shows a dimmed backdrop, regardless of nesting. - `'transparent'`: Always shows a transparent backdrop. |
| `backdropMotion` | — | Yes | For more information refer to the [Motion docs page](https://react.fluentui.dev/?path=/docs/motion-motion-slot--docs). |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Always render DialogSurface inside Portal so the dialog is not clipped by an ancestor with overflow or transformed by an ancestor stacking context.
- Include a DialogTitle inside the surface so the dialog has a programmatic accessible name, and let the surface wire it up rather than passing a loose aria-label.
- Keep the surface's content focused: a DialogTitle, a DialogBody with the essential copy or fields, and DialogActions with the primary and secondary actions.
- Use modalType deliberately: "modal" for most task dialogs, "alert" for destructive or irreversible confirmations that must be acknowledged before anything else happens.
- Choose appearance "transparent" for the inner surface when dialogs are nested, so only one dimmed layer is visible at a time.
- Control open state from the parent Dialog through open and onOpenChange instead of keeping local open state inside the surface, so the trigger and the surface never disagree.
- Set unmountOnClose to false only when you intentionally want to preserve internal state (for example, a partially filled form or a scroll position) across close and reopen.
- Provide at least one clearly focusable dismissal affordance inside the surface, such as a DialogTrigger in DialogActions, so keyboard users always have an exit.
- Use inertTrapFocus when you want the rest of the page to become inert instead of relying solely on a JavaScript focus trap, which is more robust for assistive technology.

### Don'ts

- Do not render DialogSurface outside a Dialog and DialogTrigger context; it depends on that context for open state, modal type and close handling.
- Do not place interactive content in the backdrop or remove its aria-hidden="true"; the backdrop is decorative, not a control surface.
- Do not treat backdrop clicks as a reliable dismissal path in your documentation or tests; dismissal should be guaranteed by an Escape handler and an in-surface action.
- Do not nest DialogTitle inside DialogBody or duplicate titles, since that produces conflicting names for the dialog landmark.
- Do not hard-code pixel widths, heights or a fixed max-width on the surface; let the content size the surface and use fluid for full-width layouts.
- Do not build a bespoke overlay div behind the dialog when the backdrop slot already renders one — duplicate overlays create double dimming and stacking bugs.
- Do not leave content mounted outside the surface while the dialog is modal; background content must remain non-interactive and non-perceivable for modal dialogs.
- Do not forget to handle Escape and focus restoration — a modal surface that cannot be dismissed from the keyboard is an accessibility failure.
- Do not assume unmountOnClose false is free: staying mounted keeps effects, timers and subscriptions alive for as long as the parent renders.

## Anti-Patterns

### Dialog with no accessible name

❌ A surface without a DialogTitle (or an equivalent label) is announced by screen readers simply as "dialog", so users cannot tell what they are being asked to confirm or complete.

✅ Always include a DialogTitle as the first child of the surface so the dialog gets an accessible name, and only fall back to an explicit aria-label when a visible title is genuinely impossible.

### Hand-rolled overlay behind the dialog

❌ Adding a custom full-screen overlay element in addition to the built-in backdrop produces two stacked dimming layers, inconsistent stacking order, and an overlay that assistive technology may try to read.

✅ Style or replace the backdrop slot instead, and use the appearance value "transparent" on inner surfaces when dialogs are nested so only one dimmed layer exists.

### Focus escapes the modal surface

❌ Rendering the surface outside Portal, or mixing modal content with page-level tabbable elements, lets keyboard focus move behind the dialog, leaving users interacting with content they cannot see or perceive.

✅ Render DialogSurface inside Portal, keep the modal type accurate, and use inertTrapFocus when you need the rest of the page to be inert while the dialog is open.

### Using the dialog as a page section

❌ Loading long-form, scrolling page content into a surface makes the dialog an alternative page layout, breaks the expectation that dialogs are interruptive, and creates focus-trap fatigue.

✅ Keep dialogs short and task-focused. Move large content to a Drawer, a dedicated route, or an inline section with MessageBar-style feedback, and constrain the dialog body to what the decision actually requires.

### State living in the wrong place

❌ Keeping open state locally inside the surface while a trigger also manages it leads to desynchronized visibility, missed onOpenChange callbacks, and dialogs that reopen unexpectedly after route or prop changes.

✅ Own open state in the parent component and drive the surface with open and onOpenChange, or use defaultOpen alone for genuinely uncontrolled, self-contained dialogs.

### Forgetting to handle unmounted versus persisted content

❌ Setting unmountOnClose to false for convenience keeps forms, timers and subscriptions alive long after the dialog closes, silently consuming resources and preserving stale values.

✅ Leave unmounting at the default in most cases, and only disable it when state preservation is an explicit requirement — in which case reset that state on close anyway.

## Accessibility

**Requirements**: The surface must expose role="dialog" or, for alert dialogs, role="alertdialog", plus aria-modal set to true while a modal dialog is open. It must have an accessible name supplied by a DialogTitle (typically an h2) so assistive technology announces something meaningful rather than just "dialog". Focus must move into the surface when it opens and return to the invoking element when it closes, and focus must remain inside the surface for modal and alert modal types. Escape must always request a close. The dimmed backdrop must be hidden from assistive technology with aria-hidden="true". Text and controls inside the surface must meet contrast requirements (4.5:1 for body text, 3:1 for large text and UI boundaries) against the surface background in every theme, including dark and high-contrast themes, and the surface must remain distinguishable from the backdrop. Keep the dialog usable at 200% zoom, avoid content that requires horizontal scrolling, and respect reduced-motion preferences for the backdrop and surface motion slots.

| Key | Action |
| --- | --- |
| `Escape` | Requests a close of the dialog, typically by raising onOpenChange; the surface stays open if the change is rejected. |
| `Tab` | Moves focus to the next focusable element inside the surface, wrapping back to the first element after the last one for modal and alert dialogs. |
| `Shift+Tab` | Moves focus to the previous focusable element inside the surface, wrapping around to the last element for modal and alert dialogs. |
| `Enter` | Activates the focused element inside the surface, including buttons and dialog triggers, which open or close the dialog. |
| `Space` | Activates the focused button, toggle or trigger inside the surface, matching standard button behavior. |

**ARIA**: role (dialog or alertdialog, derived from modalType), aria-modal (true for modal and alert modal types), aria-labelledby (points at the DialogTitle element), aria-describedby (points at descriptive copy, usually inside DialogBody or DialogContent), aria-label (only when no visible title exists), aria-hidden="true" on the backdrop slot, aria-haspopup="dialog" and aria-expanded on the trigger element, applied by DialogTrigger, aria-disabled and standard disabled semantics on any non-button trigger whose enhancement is controlled by disableButtonEnhancement

**Screen Reader**: When the surface opens, screen readers announce the dialog role and its accessible name, and for alert dialogs the announcement is more assertive so it interrupts the current reading context. For modal and alert modal types, the virtual cursor and reading order are confined to the surface: background content is not reachable while the dialog is open. The backdrop is silent because it is aria-hidden. Focus is placed on the first meaningful control in the dialog, and when the dialog closes focus returns to the element that opened it, so the reading position does not jump to the top of the page. Non-modal dialogs leave the rest of the page readable, so they must not carry an aria-modal value that would hide the background from assistive technology.

## Styling

Style the surface through the className and style props on the root slot, and target the overlay through the backdrop slot's own className rather than adding a wrapper element. Use Griffel makeStyles with theme tokens for consistency: set the surface background with tokens.colorNeutralBackground1, text with tokens.colorNeutralForeground1, borders with tokens.colorNeutralStroke1, and elevation with tokens.shadow64 for modal dialogs (prefer tokens.shadow16 or lower for lighter, non-modal surfaces). Rounding should come from tokens.borderRadiusXLarge for full-size dialogs and tokens.borderRadiusMedium for compact ones, and internal rhythm from tokens.spacingVerticalXXL and tokens.spacingHorizontalXXL at the surface edge, dropping to tokens.spacingVerticalL and tokens.spacingHorizontalL on small viewports. Prefer the fluid prop over width overrides when the dialog should span the available width, and cap growth by constraining the width of inner content rather than the surface itself. Animate the overlay via backdropMotion instead of hand-rolled opacity keyframes, and make sure any custom animation respects reduced-motion settings.

## Performance

The surface's biggest cost is mounting a Portal subtree and its backdrop, so keep dialog content lightweight and avoid rendering heavy data grids or media inside the surface unless necessary. When open state changes rapidly, prefer controlled state in the parent so only one component re-renders, and memoize expensive children so they do not re-render on every backdrop or motion tick. unmountOnClose true costs a teardown and remount on each open, but it prevents long-lived effects, timers and subscriptions from lingering; unmountOnClose false avoids that churn at the cost of permanently retained DOM and state, which matters when dialogs are many or nested. Motion on the backdrop and surface runs on every open and close, so keep the animation durations short and avoid animating properties that trigger layout. If a dialog is opened from a list, avoid creating a new surface element per row; render a single surface that reads the selected item's data.

## Theming & Tokens

The surface draws its background from tokens.colorNeutralBackground1, its primary text from tokens.colorNeutralForeground1, and its separators from tokens.colorNeutralStroke1, so it automatically adapts when FluentProvider switches between light, dark and high-contrast themes. Elevation is expressed through shadow tokens such as tokens.shadow64 for modal surfaces and tokens.shadow16 for lighter, non-modal presentations, and corner rounding comes from tokens.borderRadiusXLarge (or tokens.borderRadiusMedium for compact dialogs). Spacing inside the surface should use tokens.spacingVerticalXXL and tokens.spacingHorizontalXXL at the outer edge with tokens.spacingVerticalL and tokens.spacingHorizontalL for inner grouping. Title typography typically uses tokens.fontSizeBase500 with tokens.fontWeightSemibold. The backdrop's dimming is also theme-driven, so if you restyle it, keep the overlay color derived from theme tokens rather than a hard-coded rgba value so contrast holds in every theme. Because the surface is often rendered in a Portal, it still inherits the nearest FluentProvider theme, but custom CSS variables applied on an ancestor outside the portal will not reach it.

## Migration Notes

In Fluent UI v9 the dialog is composed rather than monolithic. Where v8 shipped a single Dialog component with a type prop and a fixed footer, v9 splits the concern into DialogSurface for the container, DialogBody for the scrollable content region and DialogActions for the action row, with DialogTitle providing the accessible name. Blocking behavior is now expressed with modalType ("modal", "non-modal", "alert") instead of the older isBlocking style flags on modal properties, and the dimmed overlay is a first-class backdrop slot with an appearance of "dimmed" or "transparent" instead of an implicit modal overlay. Triggering is handled by DialogTrigger wrapping a real Button instead of injected close/open callbacks. The surface is expected to live inside Portal, so review any v8 code that manually appended the dialog to a DOM node, and prefer open, defaultOpen and onOpenChange for controlled and uncontrolled state.

## Edge Cases

- Rendering DialogSurface without Portal leaves it in the normal flow, where an ancestor with overflow hidden or a transform can clip it or change its stacking order relative to the backdrop.
- Nested dialogs stack their backdrops by default, producing a progressively darker overlay; set appearance to "transparent" on the inner surface to keep a single visible dimming layer.
- With unmountOnClose set to false, children remain mounted while hidden, so form values, timers and subscriptions persist and are not reset when the dialog is reopened.
- If a dialog contains no focusable element, focus has nowhere meaningful to land, so ensure at least one actionable control such as a close trigger exists inside the surface.
- Very long content is constrained by the surface height and scrolls inside the dialog body; confirm that the title and actions remain reachable, and reduce surface padding on small viewports.
- Assigning a non-modal type to a surface that still carries modal ARIA semantics hides background content from assistive technology while leaving it visually and pointer-interactive.
- Using disableButtonEnhancement on a trigger that is not already a real button removes the keyboard affordances the component would otherwise inject, so the trigger becomes unreachable by keyboard.

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
