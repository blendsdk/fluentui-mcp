# ToastTrigger

> **Package**: `@fluentui/react-toast` v9.8.0
> **Import**: `import { ToastTrigger } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

ToastTrigger is a behavioral wrapper in the Fluent UI React v9 feedback family that designates a single child element as the control which raises a toast notification. It renders no visual surface of its own; instead it augments the child it receives through an internal trigger mechanism so that the child behaves as a compliant ARIA button, and it wires activation of that child to the Toast it belongs to. In practice you place ToastTrigger inside a Toast (which itself lives inside a Toaster), and you place the notification's copy in sibling pieces such as ToastTitle, ToastBody, and ToastFooter. Because the trigger contributes behavior rather than markup, the look of the control comes entirely from the child, and the look of the notification comes from the Toast components. The single public prop, disableButtonEnhancement, lets you opt out of the internal ARIA button mechanism when the child is already a fully conformant button.

**When to use**: Use ToastTrigger when a toast should be raised by a specific, user-initiated control rather than fired imperatively from application code. It is the right choice for lightweight, non-blocking confirmations of an action the user just performed, such as saving, copying, sending, or undoing. Reach for ToastTrigger when the trigger already exists as a Button, CompoundButton, Link, MenuItem, or InfoButton and you simply want that existing control to surface a notification. Prefer Dialog when the user must acknowledge or decide something before continuing, MessageBar when the information must remain visible inline on the page, and ProgressBar or Spinner when the user needs to track ongoing work. Toasts are transient by design, so they should complement persistent feedback rather than replace it.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disableButtonEnhancement` | `boolean \| undefined` | `false` | No | Disables internal trigger mechanism that ensures a child provided will be a compliant ARIA button. |

### Prop Guidance

- **disableButtonEnhancement**: Controls the internal trigger mechanism that ensures the provided child is a compliant ARIA button. It defaults to false, which means the child receives button semantics and keyboard activation automatically; this is what you want for non-button children or for elements you do not fully control. Set it to true only when the child is already a conformant button with its own role, focusability, and Enter and Space handling — for example a Fluent UI Button or a native button element — to avoid layering duplicate semantics. Never set it to true on a plain div or span, because that removes the only mechanism that makes the trigger reachable by keyboard. `true`

## Best Practices

### Do's

- Place ToastTrigger inside a Toast, and place that Toast inside a Toaster, so the notification has a rendering host and a place in the toast queue.
- Wrap exactly one interactive child — typically Button, CompoundButton, MenuItem, Link, or InfoButton — so the trigger inherits a meaningful accessible name and visible hover and focus states.
- Label the trigger after the action the user performs, such as Save draft or Send invite, rather than after the notification itself.
- Keep the default enhancement in place for children that are not already conformant buttons, so Enter and Space activation and the button role are supplied automatically.
- Pair the trigger with concise sibling content using ToastTitle and ToastBody, and use ToastFooter when the toast should offer a follow-up action.
- Tie activation to an explicit user action so the toast appears in direct response to something the user did, keeping the notification predictable and easy to correlate.

### Don'ts

- Do not wrap a non-focusable element such as a div or span while also setting disableButtonEnhancement to true — nothing remains to make it keyboard reachable or operable.
- Do not pass several children to one ToastTrigger; the mechanism targets the child provided, and extra children create ambiguous or unreachable focus targets.
- Do not use ToastTrigger for information the user must read at length or must acknowledge; toasts are transient and can be missed.
- Do not nest one interactive control inside another (for example a button inside a link) just to attach a toast, since nested interactive elements confuse keyboard and screen reader navigation.
- Do not rely on a toast as the only feedback for an error or a destructive outcome; pair it with persistent inline messaging.
- Do not attach a toast to hover, focus, or every keystroke, which produces noisy, unexpected notifications and can hide important ones.

## Anti-Patterns

### Non-interactive child with the enhancement turned off

❌ Wrapping a div or span in ToastTrigger and then setting disableButtonEnhancement to true strips the ARIA button semantics and keyboard activation, leaving a trigger that screen reader and keyboard users cannot reach or operate at all.

✅ Leave disableButtonEnhancement at its default of false so the child is exposed and operable as a button, or replace the child with a real interactive control such as Button or Link.

### Toast used as the only confirmation channel

❌ Toasts are transient and can be dismissed or missed, so using ToastTrigger as the sole feedback for an error, a destructive result, or information the user must act on creates a timing and comprehension problem.

✅ Use Dialog when the user must confirm or acknowledge, and MessageBar for information that must stay visible on the page; reserve ToastTrigger for non-blocking confirmation of an action the user just completed.

### Trigger label that describes the notification

❌ Labels such as Show toast or Display notification describe the mechanism rather than the user's goal, which makes the control confusing when users browse by button name with a screen reader.

✅ Name the trigger after the action it performs, for example Save draft or Copy link, and let the toast copy convey the outcome.

### Nested interactive elements inside the trigger

❌ Putting a second focusable control inside the child handed to ToastTrigger produces nested interactive elements, duplicate tab stops, and conflicting activation behavior.

✅ Pass exactly one interactive child to ToastTrigger and move any secondary action into the toast's own footer area instead of nesting it in the trigger.

## Accessibility

**Requirements**: The child supplied to ToastTrigger must end up as a compliant ARIA button. When disableButtonEnhancement is left at its default of false, the internal trigger mechanism supplies the button role and the associated keyboard behavior; if you set the prop to true, the child must already provide the role, focusability, and keyboard activation itself. Because toasts are transient, treat them as a supplementary channel and satisfy WCAG timing expectations by also exposing the same information somewhere persistent, so users who need more time are not forced to catch a disappearing notification. Ensure the child has a programmatic name through its own visible text or through aria-label or aria-labelledby, and verify sufficient contrast for both the trigger and the toast content in each theme.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus onto the trigger child, which is exposed as a button by the default enhancement. |
| `Shift+Tab` | Moves focus away from the trigger child back to the previous focusable element in the page order. |
| `Enter` | Activates the trigger child and raises the associated toast. |
| `Space` | Activates the trigger child and raises the associated toast, matching native button behavior. |

**ARIA**: role (button) applied by the internal trigger mechanism when the child is not already a button, aria-disabled when the child renders in a disabled state, aria-label for the child when it has no visible text, aria-labelledby when the child is named by another element, tabindex so the trigger participates in the page tab order

**Screen Reader**: Screen readers encounter the child as a button carrying its accessible name, and activating it with Enter or Space raises the notification. When disableButtonEnhancement is left at its default, that button identity is supplied for the child, so non-button children are still announced and operable as buttons; setting the prop to true passes that responsibility to the child. Because the trigger adds no landmarks, headings, or live-region markup of its own, assistive technology announces the resulting notification when the hosting Toast and Toaster render and update their content. Users navigating by button text therefore hear only the trigger's label, which is why that label should describe the action rather than the toast.

## Styling

ToastTrigger contributes no DOM of its own and no styles, so all visual customization happens on the child or on the toast content it raises. Style the trigger child with makeStyles and reference real tokens such as tokens.colorBrandBackground and tokens.colorBrandForeground1 for a primary-looking trigger, tokens.colorNeutralBackground1, tokens.colorNeutralForeground1, and tokens.colorNeutralStroke1 for a subtle one. Focus visibility on the trigger comes from the child's own focus styling, so keep using tokens.colorStrokeFocus2 rather than suppressing outlines. Interior spacing inside the trigger should use tokens.spacingHorizontalM, tokens.spacingHorizontalS, tokens.spacingVerticalS, and tokens.borderRadiusMedium. For the notification itself, Toast and ToastTitle benefit from tokens.colorNeutralBackground1, tokens.colorNeutralForeground1, tokens.shadow16, tokens.borderRadiusLarge, tokens.spacingHorizontalXXL, and tokens.fontSizeBase300, with tokens.fontWeightSemibold for a title. Keep any per-toast status color driven by palette tokens such as tokens.colorPaletteGreenForeground1 or tokens.colorPaletteRedForeground1 so it swaps correctly between themes.

## Performance

ToastTrigger is a thin, behavior-only wrapper: it does not render a wrapper element or an extra DOM node, so it adds negligible cost to the page tree. The main considerations are the child it enhances and the notification it raises. Because the trigger composes activation behavior onto the child, avoid recreating the child element with new inline handlers on every render inside long lists, since that forces reconciliation of the wrapped subtree. Notifications themselves mount only when a trigger is activated, and the Toaster owns their lifecycle, so an app with many triggers pays for rendered toasts only at activation time rather than at page load. Rapid, repeated activation of the same trigger can enqueue several identical toasts; debounce or disable the trigger while the action is in flight to keep the queue small.

## Theming & Tokens

ToastTrigger consumes no theme tokens directly because it renders no visual output; it inherits everything from the FluentProvider boundary its child sits in. The child therefore picks up whatever tokens its own component uses, such as tokens.colorBrandBackground, tokens.colorBrandForeground1, tokens.colorNeutralForeground1, and tokens.colorStrokeFocus2 for the focus ring. The notification raised by the trigger is themed by the Toast components: tokens.colorNeutralBackground1 for the toast surface, tokens.colorNeutralForeground1 for body text, tokens.shadow16 and tokens.borderRadiusLarge for elevation and shape, and tokens.spacingHorizontalXXL and tokens.spacingVerticalM for interior rhythm. Because all of these are variable tokens, the trigger and its toast follow light, dark, and high-contrast themes automatically without component-level overrides.

## Migration Notes

ToastTrigger is part of the v9 Toast family and has no direct equivalent in the v8 @fluentui/react core package, where toast-like patterns were typically assembled from portals, custom overlays, or third-party notification code. Teams migrating should replace those one-off implementations with the composed v9 model: a Toaster as the host, a Toast per notification, ToastTrigger around the control that raises it, and ToastTitle, ToastBody, and ToastFooter for content. Note that behavior and semantics live on ToastTrigger rather than on the child, so any custom click handling that previously fired a notification should move into the trigger's child element itself, and any custom ARIA button attributes on the child can be removed in favor of the built-in enhancement.

## Edge Cases

- Setting disableButtonEnhancement to true removes the keyboard and role guarantees, so the child must itself be a conformant button; this is the most common source of inaccessible triggers.
- ToastTrigger expects a single child to enhance. Passing fragments or multiple children can leave the intended element without the trigger behavior and can create ambiguous focus targets.
- A ToastTrigger with no Toast and Toaster ancestor has nothing to render and nothing to raise, so the trigger appears to do nothing when activated.
- ToastTrigger exposes no appearance, size, icon, or shape props of its own; those belong to the child control, so attempting to configure the trigger's visual style through the wrapper will not have any effect.
- Escape and toast dismissal are not handled by ToastTrigger; they are properties of the toast surface, so keyboard behavior around dismissing a raised notification must be validated on the Toast rather than on the trigger.
- Because toasts are transient, an activation that happens while another toast is on screen may be perceived as delayed or missed; keep messages distinct and few when trigger-based notifications are used frequently.

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
