# ToastFooter

> **Package**: `@fluentui/react-toast` v9.8.0
> **Import**: `import { ToastFooter } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

ToastFooter is the action/auxiliary region of a Fluent UI v9 toast notification. It renders a single required root slot typed as a div and is intended to hold the controls a user can act on while the toast is on screen — typically one or two Buttons or Links such as a dismiss action, an undo action, or a "View details" affordance. Because it is a plain layout container, ToastFooter contributes no styling semantics of its own beyond the toast's surface styling; it composes with ToastTitle and ToastBody inside ToastSurface (mounted by Toaster/Toast) so that the message reads first and the actions sit in a stable, predictable position at the bottom of the toast. The component's data surface also exposes context-driven props that originate from the surrounding toast — root, subtitle, media, action, appearance, inline, visible, intent, announce, tryRestoreFocus, and disableButtonEnhancement — which describe how the footer participates in the toast's background appearance, visibility, intent colorization, live-region announcement, and focus-restoration behavior.

**When to use**: Use ToastFooter whenever a toast needs user-actionable content rather than purely informational text. Typical cases: a toast that reports an error and offers a "Retry" button, a toast confirming a destructive operation and offering "Undo", or a toast summarizing a background task with a "View" link to the result. Place ToastFooter inside a toast after ToastBody so the message is read first and the actions appear last. Do not use ToastFooter for the toast's headline or descriptive copy — that belongs to ToastTitle and ToastBody — and do not use it as a general-purpose layout container outside of a toast. If the notification needs a persistent, multi-line, richly structured layout with its own header/footer hierarchy, a MessageBar or a Dialog is usually a better fit; ToastFooter is optimized for short-lived, at-a-glance notifications with a small number of actions.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `action` | `Slot<'div'>` | — | No | — |
| `announce` | `ToastAnnounce` | — | Yes | — |
| `announce` | `ToastAnnounce` | — | No | — |
| `appearance` | `BackgroundAppearanceContextValue` | — | No | — |
| `disableButtonEnhancement` | `boolean` | — | No | — |
| `inline` | `boolean` | — | No | — |
| `intent` | `ToastIntent \| undefined` | — | Yes | — |
| `media` | `Slot<'div'>` | — | No | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `NonNullable<Slot<'div'>>` | — | Yes | — |
| `subtitle` | `Slot<'div'>` | — | No | — |
| `tryRestoreFocus` | `() => void` | — | Yes | — |
| `visible` | `boolean` | — | Yes | — |

### Prop Guidance

- **root**: The required root slot and the only structural slot on this component. It renders a div that contains the footer's actions and auxiliary content. Use it to attach className, style, or ref when you need to control layout or measure the footer; the component merges your className with its own base class. `A horizontally laid-out div containing an Undo button and a Dismiss link.`
- **subtitle**: Optional secondary text region surfaced through the toast context. Use it for a short clarifying line associated with the footer content, such as the target of an action, kept to a single line so it does not compete with ToastBody. `Undo will restore the previous version.`
- **media**: Optional media region surfaced through the toast context. Reserve it for a small leading visual that supports the footer's actions, and keep it decorative or give it an accessible name if it conveys meaning. `A small icon aligned with the footer actions.`
- **action**: Container region for the footer's actionable content. Keep the number of actions small and let this region own the flex layout so the actions align consistently across every toast in the app. `A region holding the primary Retry button.`
- **appearance**: Background appearance value supplied by the surrounding toast context. It tells the footer which foreground colors are legible on the current surface; read it (rather than hard-coding colors) when you render custom text or icons in the footer. `brand`
- **inline**: Switches the toast presentation between floating and inline placement. Inline toasts sit in the document flow, so the footer should avoid absolute positioning and rely on normal layout spacing. `true`
- **visible**: Controls whether the toast, and therefore the footer, is currently rendered. Footer actions are not reachable while it is false, so never gate a required workflow step behind it. `true`
- **intent**: Semantic intent for the toast (informational, success, warning, error, or equivalent). It drives the toast's color treatment and should guide which actions belong in the footer — recovery actions for errors, confirmation actions for success. `success`
- **announce**: Controls how the toast content is announced to assistive technology. Choose a more assertive announcement only for high-priority notifications; the footer's actions are then discovered in normal reading order rather than being announced separately. `polite`
- **tryRestoreFocus**: Callback that restores focus to the element the user was on before the toast took focus. Call it when a footer action dismisses the toast so keyboard users are returned to their place in the page instead of being dropped at the top of the document. `Invoke after the dismiss action resolves.`
- **disableButtonEnhancement**: Turns off automatic enhancement of buttons rendered inside the toast, including the footer's actions. Enable it only when you need full manual control over an action's markup or when the enhancement conflicts with custom content. `true`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Limit the footer to one or two actions so the toast remains scannable and the actions stay reachable on narrow viewports.
- Order actions by importance for the toast's intent — the primary/expected action first, secondary actions after it.
- Give every action inside the footer a clear, verb-first label such as "Undo", "Retry", or "View details" rather than generic text like "OK".
- Match the footer content to the toast's intent so that a success toast offers confirmation-style actions and an error toast offers recovery-style actions.
- Let the root slot handle layout (row orientation, spacing between actions) instead of adding wrapper divs inside the footer.
- When a footer action dismisses the toast, ensure the dismiss is explicit so the user understands the notification will disappear.
- Keep footer actions idempotent where possible, since a toast can be dismissed by timeout or by another toast taking its place while the user is deciding.

### Don'ts

- Don't put the toast's primary message, title, or long explanatory text in ToastFooter — use ToastTitle and ToastBody for that content.
- Don't cram three or more actions, menus, or form fields into the footer; the toast becomes a dialog and should be built as one instead.
- Don't rely on the footer being on screen indefinitely — toasts are transient, so never put a required step of a workflow there.
- Don't style the footer with hard-coded colors that assume a light surface; he toasts can render on brand or inverted backgrounds via the appearance context.
- Don't nest interactive elements inside one another or wrap buttons in clickable containers, which produces ambiguous focus and activation behavior.
- Don't use the footer to display status/live content that changes over time; announcements are handled by the toast's announce behavior, not by the footer.
- Don't assume focus is inside the toast — footer actions must be reachable by normal tab order unless the toast explicitly manages focus.

## Anti-Patterns

### Footer as a dialog

❌ Stuffing multiple buttons, a menu, or input controls into the footer turns a transient notification into an interactive surface that the user cannot reliably complete before the toast times out.

✅ Keep the footer to one or two decisive actions. If the task needs more input, dismiss the toast and open a Dialog or Popover from the message instead.

### Message copy in the footer

❌ Placing the explanation of what happened inside ToastFooter duplicates or displaces ToastBody, producing an unbalanced toast where the action appears before the reason for it.

✅ Put the headline in ToastTitle and the explanation in ToastBody, and reserve the footer strictly for actions and their short supporting line.

### Hard-coded footer colors

❌ Assuming a neutral surface and hard-coding foreground colors makes footer text and icons unreadable when the toast renders on a brand or inverted background.

✅ Read the appearance value from the toast context and select the matching foreground tokens (for example tokens.colorNeutralForegroundInverted on brand surfaces) instead of fixed colors.

### Unlabeled icon-only actions

❌ A footer action rendered as an icon without a visible label has no accessible name, so screen reader users hear only "button" and cannot tell what it does.

✅ Give every icon-only action in the footer an aria-label that describes the outcome, such as "Dismiss notification", and hide purely decorative icons from the accessibility tree.

### Focus left inside a dismissed footer

❌ When a footer action closes the toast without restoring focus, keyboard users lose their position in the page and must tab from the start of the document again.

✅ Invoke the focus-restoration callback when a footer action dismisses the toast so focus returns to the element the user was interacting with.

## Accessibility

**Requirements**: ToastFooter itself is a non-interactive div, so the accessibility burden sits on the actions it contains and on the toast region that hosts it. WCAG 2.1.1 (Keyboard) and 2.1.2 (No Keyboard Trap) require every footer action to be operable and escapable by keyboard alone; 2.4.7 (Focus Visible) requires a visible focus indicator on those actions; 1.4.3/1.4.11 (Contrast) require the footer's text and actions to meet contrast minimums against the toast surface, which is why the toast's background appearance value must be respected when the footer renders on an inverted or brand surface; 2.2.1 (Timing Adjustable) matters because toasts auto-dismiss, so any action placed in the footer should remain actionable for a reasonable duration or the toast should persist until dismissed; 4.1.2 (Name, Role, Value) requires each action to expose an accessible name; and 4.1.3 (Status Messages) is satisfied by the toast's live-region announcement rather than by the footer.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and between the interactive actions rendered inside the footer's root slot. |
| `Shift+Tab` | Moves focus backwards out of the footer back into the toast body or the previously focused element on the page. |
| `Enter` | Activates the focused action inside the footer, such as an Undo or Retry button. |
| `Space` | Activates the focused button action inside the footer, matching standard button activation. |
| `Escape` | Dismisses the toast in the standard toast interaction model, which removes the footer and its actions from the DOM. |
| `F6` | Cycles keyboard focus to the toast region so its footer actions can be reached without hunting through the tab order. |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-live, aria-atomic, aria-hidden, role

**Screen Reader**: The footer is announced as part of the enclosing toast region rather than as a separate landmark. The toast's live region (polite or assertive depending on the announce setting) causes screen readers to read the toast title and body, and the footer actions are then reachable as normal buttons and links in the reading order. Because the footer is just a div with no role of its own, screen readers will not announce it as a group; grouping and labeling come from the toast surface. Icon-only actions inside the footer must carry an accessible name, and any purely decorative content in the footer (icons or spacing elements) should be hidden from the accessibility tree so it is not announced.

## Styling

ToastFooter is styled almost entirely through its root slot. The most common customization is layout: apply display: flex, align-items: center, and a gap built from tokens.spacingHorizontalM or tokens.spacingHorizontalS to line the actions up in a row, plus padding using tokens.spacingVerticalS and tokens.spacingHorizontalM so the footer breathes against the toast surface edge. Secondary text inside the footer should use tokens.colorNeutralForeground2 against the default toast surface so it de-emphasizes relative to ToastTitle, while tokens.colorNeutralForeground1 stays reserved for primary action labels. Use tokens.fontSizeBase200 and its matching lineHeightBase200 for compact helper text. When the toast renders on a branded or inverted background, switch foregrounds to tokens.colorNeutralForegroundInverted or the appropriate on-brand contrast token instead of leaving neutral foregrounds in place. Border separation above the footer, if needed, should use tokens.colorNeutralStroke2 with the footer's own padding rather than a hard-coded 1px line, and rounded interaction affordances inside the footer should use tokens.borderRadiusMedium to match the rest of the Fluent control set. Avoid fixed pixel widths so the footer reflows on small viewports, and prefer gap over margins so action spacing collapses predictably when the footer wraps.

## Performance

ToastFooter is a lightweight div wrapper, so its own render cost is negligible; the cost that matters is what you place inside it. Because footers are mounted and unmounted as the visible state of a toast changes, avoid creating heavy subtrees — data grids, charts, or large lists — as footer actions, and prefer plain Button and Link actions. Action callbacks should be stable references so the footer subtree does not re-render on every toast update, and expensive work triggered by a footer action should run after the action resolves rather than during render. When an app renders many toasts at once through a toaster, keep footer content identical in shape across toasts so the reconciler can reuse component instances, and avoid animating layout properties of the root slot since layout animations on a transient element rarely complete before dismissal.

## Theming & Tokens

ToastFooter inherits its theme entirely from the enclosing FluentProvider and from the toast's own surface treatment. Text and icons inside the footer should be built from foreground tokens such as tokens.colorNeutralForeground1 for primary labels and tokens.colorNeutralForeground2 for secondary text, spacing from tokens.spacingVerticalS, tokens.spacingVerticalM, tokens.spacingHorizontalS, and tokens.spacingHorizontalM, and typography from tokens.fontSizeBase200 with tokens.lineHeightBase200 for compact supporting text. When the toast's intent is a status intent, the corresponding token families (for example tokens.colorPaletteGreenForeground1, tokens.colorPaletteYellowForeground1, and tokens.colorPaletteRedForeground1) supply the accent colors, and the footer should consume those same tokens rather than introducing independent colors. If the toast's background appearance is brand or inverted, switch to the matching inverted foreground and stroke tokens so footer content maintains contrast, and keep focus outlines on the default focus token family so they remain visible on every surface.

## Edge Cases

- Long action labels inside the footer can force the toast wider than intended; truncate or shorten labels rather than letting the footer drive the toast's width.
- When two toasts with footers are stacked, only one toast's actions are typically interactive at a time, so footer actions must tolerate being dismissed before the user reaches them.
- Inline toasts place the footer in document flow, where surrounding flex or grid containers can stretch or compress it — verify the footer's layout in context rather than in isolation.
- The footer is a plain div with no role, so a footer containing no interactive content is invisible to assistive technology; never place the only copy of a message there.
- If the toast dismisses while a footer action's async work is still running, the callback may resolve after unmount — guard against updating state from a footer action after the toast is gone.
- Custom rendering that bypasses button enhancement must still supply consistent sizing, focus styling, and accessible names for every action in the footer.

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
