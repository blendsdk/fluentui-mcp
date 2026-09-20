# feedback components

## Overview

Feedback components tell the user what just happened, what is happening right now, and what needs their attention before they continue. In this category the Dialog family (Dialog, DialogSurface, DialogContent, DialogTitle, DialogBody, DialogActions and DialogTrigger) provides composable surfaces for content and decisions that temporarily take over the interface; MessageBar with MessageBarGroup, MessageBarTitle, MessageBarBody and MessageBarActions delivers persistent inline status at page, form or section level; Toast with Toaster, ToastTitle, ToastBody, ToastFooter and ToastTrigger delivers lightweight transient notices about completed work; ProgressBar and Spinner communicate measurable and unmeasured waiting; and Tooltip supplies a short label or description for an existing control. All of these share one visual language of intent, appearance and presence motion, so the decision is less about which component looks right and more about how long the message must live, how urgent it is, and whether the user has to act on it.

## When to Use

Reach for Dialog when the user must acknowledge, confirm or complete something before continuing, and choose the modalType that matches how blocking that interaction should be. Reach for MessageBar when the message belongs to a page, form or section and should stay visible until the underlying condition changes; its intent and politeness give the message both a semantic color and a decision about whether it interrupts a screen reader. Reach for Toast together with a mounted Toaster when an operation finishes in the background and the user only needs a brief confirmation or an optional follow-up action. Reach for ProgressBar when progress can be expressed as a value against a max, and for Spinner when the wait is short and the amount of work is unknown. Reach for Tooltip only to add a short label or a short description to a control that is already present and interactive; it is never the only carrier of information the user needs.

## Best Practices

### Do's

- Compose each pattern from its intended parts: DialogSurface with DialogTitle, DialogBody and DialogActions; MessageBar with MessageBarTitle, MessageBarBody and MessageBarActions; Toast with ToastTitle, ToastBody and ToastFooter rendered inside a mounted Toaster.
- Let DialogTrigger, ToastTrigger and the Tooltip content slot own the relationship between a trigger and the surface it opens, so focus handling, ARIA wiring and positioning stay consistent.
- Choose Dialog modalType deliberately: use the blocking modal form for destructive or irreversible decisions, and keep non-modal dialogs for content the user can safely ignore.
- Set MessageBar intent to match meaning rather than decoration, and use politeness to decide whether a message interrupts an active announcement or waits its turn.
- Render stacked or animated messages through MessageBarGroup, and use its animate option to choose whether items animate out only or both in and out.
- Use ProgressBar value and max to show measurable work, or omit value to render an indeterminate bar, and pick color, thickness and shape to match the surrounding surface.
- Give Spinner a meaningful visible label, position it with labelPosition, and use delay so fast operations do not flash a spinner on screen.
- Set Tooltip relationship to label when the tooltip provides the accessible name for an icon-only control, and to description when it explains an already named control; tune showDelay and hideDelay so the tooltip feels deliberate rather than twitchy.
- Use DialogActions position and fluid to align or stretch the action row, and keep destructive choices visually distinct from the primary action.
- Give MessageBarActions a containerAction when the message needs a single container-level action, and keep other actions inside the actions area rather than the body.
- Always provide a visible way to dismiss or resolve Dialog and MessageBar content, and decide per toast whether its title and body should be announced.

### Don'ts

- Do not use Toast for information that requires a decision, blocks progress or must remain on screen; transient notices are easy to miss and offer no place to think.
- Do not stack multiple modal dialogs or open a dialog from inside another dialog, because nested blocking surfaces break focus expectations and leave users unsure which layer they are in.
- Do not attach Tooltip to elements that cannot receive hover or keyboard focus, and do not hide essential instructions inside it when they belong in visible text.
- Do not force Tooltip visible or otherwise drive its visibility manually when the built-in hover and focus behavior already covers the interaction.
- Do not wrap a single message in MessageBarGroup; render one MessageBar directly so the layout does not reserve group behavior for one item.
- Do not show a Spinner for long measurable work where ProgressBar would tell the user how much is left, and do not use ProgressBar for waits with no known duration.
- Do not communicate state through ProgressBar color or Spinner motion alone; pair either with text that names the operation.
- Do not mix controlled and uncontrolled state, such as passing open alongside defaultOpen on Dialog, because the visible state and your application state will drift apart.

## Anti-Patterns

### Using toasts as the primary error channel

❌ Toast notices are transient and non-blocking, so an error that requires reading, correcting input or making a decision disappears before the user can act on it.

✅ Keep errors that need a decision in a Dialog, and keep errors tied to a page or form in a MessageBar with the matching intent so they persist until resolved; reserve Toast for confirming that background work finished.

### Rebuilding trigger and surface wiring by hand

❌ Managing visibility and dismissal manually instead of using DialogTrigger, ToastTrigger and the Tooltip content slot discards the focus, ARIA and positioning behavior those parts provide, and produces inconsistent dismissal.

✅ Use the trigger parts and the documented surface composition, and only take over with Dialog open or defaultOpen plus onOpenChange when application logic genuinely must own the state.

### Treating Spinner, ProgressBar and MessageBar as interchangeable

❌ The waiting and progress components make different promises about how much is known and how long the wait will be, so swapping them by habit leaves users unable to judge whether anything is happening or how much remains.

✅ Use Spinner with a visible label for short unmeasured waits, ProgressBar with value and max when progress is measurable, and MessageBar when long-running work needs persistent context and a place for actions.

### Flattening composed parts into one node

❌ Replacing the title, body and action parts with ad hoc text loses consistent typography and spacing, and can strip the accessible name from a dialog or the semantic structure from a message.

✅ Compose the provided parts at their intended level: a DialogTitle inside every dialog surface, and MessageBar title, body and actions as siblings inside the MessageBar rather than nested inside one another.

### Feedback that never ends or never leaves

❌ Toasts that vanish while carrying an action, or message bars that remain on screen after the condition is resolved, both erode trust in the messaging system and train users to ignore it.

✅ Keep toasts with actions or undo affordances alive long enough to be used, and remove or update a MessageBar as soon as the underlying condition clears.

## Accessibility

These components share one accessibility contract. Dialog manages focus for you, keeps focus inside the modal surface while it is open and returns it to the trigger on close, and DialogTitle supplies the accessible name, so render a title even when the design hides it visually; inertTrapFocus changes how focus is constrained for modal dialogs, and unmountOnClose helps reset transient content between openings. MessageBar politeness decides whether a message is announced immediately or queued, so reserve the interrupting value for errors and urgent warnings, and remember that MessageBarGroup animates items whose announcements should still be meaningful in order. Toaster accepts an announce prop so you can supply the announcement mechanism, and ToastTitle and ToastBody each accept an announce flag that controls whether their text is announced at all, so decide per toast whether it is worth interrupting the user, and never move focus into a toast. Tooltip requires the relationship prop precisely because assistive technology must know whether the tooltip is the control's label or its description, and tooltips must be reachable through keyboard focus rather than hover alone. ProgressBar and Spinner need visible text that names the operation, because a moving indicator alone says nothing; when progress updates must be spoken, announce them through a live region such as AriaLiveAnnouncer instead of relying on the bar. Keep the built-in presence motion slots, such as the backdrop motion on DialogSurface and the indeterminate motion on ProgressBar, so the library's reduced-motion behavior stays intact.

## Components in this category

- [Dialog](../components/dialog.md)
- [DialogActions](../components/dialog-actions.md)
- [DialogBody](../components/dialog-body.md)
- [DialogContent](../components/dialog-content.md)
- [DialogSurface](../components/dialog-surface.md)
- [DialogTitle](../components/dialog-title.md)
- [DialogTrigger](../components/dialog-trigger.md)
- [MessageBar](../components/message-bar.md)
- [MessageBarActions](../components/message-bar-actions.md)
- [MessageBarBody](../components/message-bar-body.md)
- [MessageBarGroup](../components/message-bar-group.md)
- [MessageBarTitle](../components/message-bar-title.md)
- [ProgressBar](../components/progress-bar.md)
- [Spinner](../components/spinner.md)
- [Toast](../components/toast.md)
- [ToastBody](../components/toast-body.md)
- [ToastFooter](../components/toast-footer.md)
- [ToastTitle](../components/toast-title.md)
- [ToastTrigger](../components/toast-trigger.md)
- [Toaster](../components/toaster.md)
- [Tooltip](../components/tooltip.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
