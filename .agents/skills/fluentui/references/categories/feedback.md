# feedback components

## Overview

The feedback category groups the Fluent UI React v9 components that tell users what is happening: Dialog, MessageBar, Progress, Spinner, Toast, and Tooltip. Together they span the full range of attention — blocking decisions the user must resolve (Dialog), page- or section-scoped status and results that should persist (MessageBar), measurable activity (Progress), short indeterminate waits (Spinner), brief confirmations that pass on their own (Toast), and supplementary inline explanation (Tooltip). Choosing among them is mostly a question of how much attention the message deserves, how long it must stay visible, and whether the user has to act before continuing. Getting that mapping right matters more than any individual prop, because these surfaces compete for the same scarce resource: the user's focus.

## When to Use

Reach for Dialog when the user must make a decision or complete a step before they can continue, and the rest of the interface should be suspended while they do it. Reach for MessageBar when the status belongs to a page, form, or section and must remain visible after the triggering moment has passed — validation summaries, permission or connectivity warnings, results of a save. Reach for Progress when the work has a known, meaningful extent that you can express with value and max, and for Spinner when the wait is short and its duration is unknown; prefer Spinner with a delay over showing a spinner instantly. Reach for Toast for lightweight, non-blocking confirmation of an action the user just took, where the message is self-contained and losing it is not harmful. Reach for Tooltip only for supplemental information — a short definition, a keyboard hint, an expanded name — that the user can proceed without. If the message requires action, cannot be missed, or must survive a re-render or a page change, choose Dialog or MessageBar rather than Toast or Tooltip.

## Best Practices

### Do's

- Choose the surface by the attention the message deserves: Dialog when the user must resolve something first, MessageBar when the status belongs to a region and must persist, Toast for a passing confirmation, Tooltip when the extra text is helpful but optional.
- Always set Tooltip's required relationship prop to match the content precisely — 'label' when the tooltip supplies the trigger's name, 'description' when it explains a control that is already named, and 'inaccessible' when the content merely echoes visible text and should not be announced.
- Keep Progress truthful by supplying both value and max together and updating them as the work advances; let the bar's color reflect meaning (success, warning, error, brand) rather than decoration, and use shape and thickness to match the surrounding layout's visual weight.
- Use Spinner's delay so the indicator appears only after a wait long enough to be worth showing, and pair any non-trivial spinner with label content and a labelPosition that fits the surrounding layout.
- Pick MessageBar politeness deliberately: keep the default polite behavior for status and results, and reserve assertive for messages the user genuinely cannot wait to hear.
- Use Dialog's unmountOnClose and inertTrapFocus to control whether the surface stays mounted and how focus is contained, so a modal flow behaves consistently across repeat openings.
- Set Toast's appearance to match the tone of the confirmation, and make each toast's message self-contained since it appears detached from the control that produced it.
- Keep the number of simultaneous feedback surfaces low: allow one modal Dialog at a time, and avoid restating the same event in both a Toast and a MessageBar.

### Don'ts

- Don't use Tooltip for information the user needs in order to finish the task — its content only appears on hover or focus, cannot be selected or interacted with, and is a poor home for anything essential.
- Don't open a Dialog for non-blocking announcements or for content that does not require a decision; modal interruptions should be rare enough that users still read them.
- Don't substitute Spinner for Progress when the work has a measurable extent, and don't invent a Progress value when the duration is genuinely unknown.
- Don't let a Toast be the only signal for a failure the user must act on, and don't rely on it for anything that needs to survive navigating away or refreshing.
- Don't stack modal Dialogs, and don't open a new Dialog while a previous overlay is still closing and holding focus.
- Don't set MessageBar politeness to assertive across the board, or every status update will interrupt whatever the user is reading or typing.
- Don't put both a Spinner and a Progress indicator on screen for the same task, and don't place one inside the other.
- Don't rely on MessageBar intent or Progress color alone to carry meaning; text and the icon slot should make the message understandable without color.

## Anti-Patterns

### Using a transient surface for a durable problem

❌ A failure that requires the user to fix something is delivered as a Toast that disappears on its own, so a user who looked away, was reading with a screen reader, or arrived after a navigation never learns what went wrong.

✅ Route consequential outcomes to MessageBar so they persist in the page region they belong to, and reserve Toast for confirmations whose loss is harmless. If the user must decide or correct something, use Dialog so the flow cannot continue until the issue is resolved.

### Using Tooltip as the only label

❌ An icon-only control whose only explanation lives in a Tooltip is effectively unlabeled for anyone who is not hovering with a pointer; the tooltip's content is not a reliable substitute for the control's own accessible name, and the required relationship prop is often left at a value that misrepresents the content.

✅ Give the trigger its own accessible name first, then keep the Tooltip as a supplement and set relationship to describe what the tooltip actually contributes — 'label' only when it truly supplies the name, 'description' when it adds context, 'inaccessible' when it adds nothing.

### Competing progress indicators for one task

❌ Showing a Spinner and a Progress bar together, or swapping between them mid-operation, splits the user's attention between two answers to the same question and makes the interface look unstable.

✅ Decide up front whether the task is indeterminate or measurable and commit to one indicator. Use Spinner with an appropriate delay for unknown-duration waits and Progress with value and max when you can estimate completion, and never nest one inside the other.

### Treating every message as an interruption

❌ Combining a modal Dialog, an assertive MessageBar, and a Toast for a single routine event makes common actions feel like incidents, and users quickly learn to dismiss everything without reading it.

✅ Match each event to exactly one surface at the intensity it deserves: silent for expected outcomes, Toast for ordinary confirmations, MessageBar for persistent status, and Dialog plus assertive announcements only for events that genuinely require the user to stop and respond.

### Fabricating determinate progress

❌ A Progress bar is driven by a guessed or hard-coded value, or its value and max drift out of sync, so the bar stalls, jumps backward, or reports a completion percentage that contradicts what the user sees — eroding trust in every progress indicator in the product.

✅ Only use Progress when value and max reflect real, advancing work. When the extent is unknown, switch to Spinner with a delay instead of animating a bar that carries no information.

## Accessibility

Every component in this category exists to communicate something, so the shared accessibility requirement is that the message reaches users who are not looking at the screen at the right moment. Tooltip carries the strongest contract: its relationship prop is required, and the value you pass determines whether assistive technology treats the content as the trigger's label, as a supplementary description, or as not worth announcing at all — set it accurately rather than defaulting it, and never make Tooltip the sole source of a control's accessible name. MessageBar's politeness prop governs how the message is announced: polite waits its turn, assertive interrupts, so reserve assertive for urgent, actionable information. Spinner and Progress must expose their state in text — give spinners a label, and keep value and max consistent so completion is reported correctly. Dialog owns focus while open, so nothing behind it should remain tabbable or interactive, and focus should return to the element that opened it. Toast is the weakest surface for assistive technology because it is transient and may be missed entirely; its text must be meaningful in isolation, and any message with consequences needs a persistent companion. Across the whole category, never encode severity in color alone, and make sure the same information is available to keyboard and screen reader users as to pointer users.

## Components in this category

- [Dialog](../components/dialog.md)
- [MessageBar](../components/message-bar.md)
- [Progress](../components/progress.md)
- [Spinner](../components/spinner.md)
- [Toast](../components/toast.md)
- [Tooltip](../components/tooltip.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
