# Toast

> **Package**: `@fluentui/react-toast` v9.8.0
> **Import**: `import { Toast } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

Toast is a feedback component that presents a short, transient, non-blocking message about an operation the app just performed, such as confirming that an email was sent, warning that a session is about to expire, or reporting that a download has started. In Fluent UI React v9 the Toast element is not revealed wherever you happen to write it in the tree: you compose the toast out of Toast, ToastTitle, ToastBody, and ToastFooter, then hand it to the dispatchToast function returned by useToastController, and a Toaster (matched by the same toasterId) renders it in the viewport. Toast itself accepts a single styling prop, appearance, whose inverted value places the surface on a dark background, and a required root slot. Intent is supplied as a dispatch option (success, info, warning, or error) and drives the default icon and color of the title; the media and action slots of ToastTitle and the subtitle slot of ToastBody let you substitute spinners, avatars, undo links, or secondary text. The surrounding Toast system supports queuing, a maximum concurrent limit, pausing on hover or on window blur, configurable timeout (including a negative timeout that never auto-dismisses), configurable position and viewport offset, imperative update, dismissal, pause and play, a focus shortcut, and an inline rendering mode in which toasts appear in DOM order relative to a positioned ancestor.

**When to use**: Use Toast for transient, non-blocking feedback that should not interrupt the user's current task: confirming that a save, send, copy, or delete succeeded; reporting a recoverable failure with a retry or undo affordance; or tracking background work such as a long-running upload or export. Toast is the right choice when the message is self-explanatory, does not require a decision before the user continues, and can safely disappear on its own or be dismissed with a link. Prefer MessageBar when the message must persist inline next to the content it describes (validation summary, degraded service banner) and the user needs to keep reading it. Prefer Dialog when the user must acknowledge or resolve something before continuing. Prefer an inline Toaster when the notification belongs to a specific region of the page rather than the viewport, and use a Toaster at the app root when the message is global. Reach for SpinButton-style progress content inside a toast only for work the user does not have to wait on; if the result is required to proceed, keep the user on a page-level progress experience instead.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `BackgroundAppearanceContextValue` | — | No | — |

### Prop Guidance

- **appearance**: The only styling prop on Toast itself. Leave it unset for the default themed surface; set it to inverted when the toast sits over light or photographic content and needs a dark surface with matching inverted text. Inverted toasts still respect intent icons and status colors, so intent and appearance can be combined freely. `inverted`
- **root slot / children**: The required root slot holds the toast's content and is where you place ToastTitle, ToastBody, and ToastFooter. Keep the structure shallow: a title is expected, a body is optional supporting text or progress, and a footer holds secondary links. Everything inside the root is what is announced by the live region. `ToastTitle, ToastBody, ToastFooter`
- **intent (dispatch option)**: Set on the Toaster as a default or per dispatch to select success, info, warning, or error. Intent chooses the default title icon and its color and determines the urgency of the screen reader narration, so it must match the real severity of the message. Use the politeness option when you need different live region urgency without changing the visual intent. `success`
- **timeout (dispatch option)**: Milliseconds before the toast is automatically dismissed. Shorter values suit trivial confirmations; longer values suit messages with links or progress. A negative value disables auto-dismissal entirely, which is appropriate for toasts that must be dismissed by an action or by the completion of a task. `-1`
- **toastId (dispatch option)**: A caller-supplied identity for a dispatched toast. Provide one whenever you intend to dismiss, update, pause, or play that specific toast later, since the imperative APIs address toasts by id. Omitting it makes the toast anonymous and only dismissable as part of a bulk dismiss. `a stable id from useId`
- **onStatusChange (dispatch option)**: Callback fired as the toast moves through its lifecycle stages of queued, visible, dismissed, and unmounted. Use it to keep host state in sync, to re-enable the trigger button after unmount, and to drive follow-up work once a toast is fully gone. `status === 'unmounted'`
- **position (Toaster default or dispatch option)**: Places the toast at top, bottom, top-start, top-end, bottom-start, or bottom-end. Choose one position for the whole application and configure it on the Toaster; set it per dispatch only in demos or genuinely exceptional cases, because mixing positions disorients users. `top-end`
- **limit (Toaster prop)**: Caps how many toasts render at once. Toasts beyond the limit are queued and shown as earlier ones are dismissed, so a burst of notifications will not flood the screen or the accessibility tree. `3`
- **toasterId (Toaster prop)**: Identifies which Toaster a dispatched toast belongs to, created with useId and shared with useToastController. Use a single Toaster and a single id in normal applications; additional ids exist for the uncommon multi-toaster case, which is not recommended. `a stable id from useId`
- **inline (Toaster prop)**: Renders toasts in DOM order positioned against the nearest positioned ancestor rather than the viewport. Use it when notifications belong to a specific panel or region; remember to place the Toaster inside an element with relative positioning. `true`
- **offset (Toaster prop)**: A static horizontal and vertical offset from the viewport edge, applied at the Toaster level because offsets are shared by every toast in a given position. Adjust it to clear fixed headers, footers, or floating action buttons. `horizontal 20, vertical 16`
- **pauseOnHover (dispatch option or Toaster default)**: Pauses the dismiss timeout while the pointer is inside the toast, giving users time to read or click an action. Set it as a Toaster default so every toast behaves the same way and only override it for very short-lived messages. `true`
- **pauseOnWindowBlur (dispatch option or Toaster default)**: Pauses the dismiss timeout when the user moves to another window, which prevents important notifications from expiring while the app is not in view. `true`
- **shortcuts (Toaster prop)**: Defines keyboard shortcuts handled by the Toaster, including a focus shortcut that moves focus to the most recent visible toast. Once a toast has focus, all toasts belonging to that toaster are paused so their timeouts do not expire while the user reads. `a focus shortcut such as Ctrl+M`
- **action and media slots on ToastTitle**: The action slot hosts the toast-level affordance such as an Undo link or a ToastTrigger-wrapped dismiss control; the media slot replaces the default intent icon with custom content such as a Spinner or an Avatar. `a Spinner in the media slot`
- **subtitle on ToastBody**: Adds a secondary line of context beneath the body content when the title alone is too terse but a second toast would be excessive. `a short clarifying phrase`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  const toasterId = useId('toaster');
  const { dispatchToast } = useToastController(toasterId);
  const notify = () =>
    dispatchToast(
      <Toast>
        <ToastTitle action={<Link>Undo</Link>}>Email sent</ToastTitle>
        <ToastBody subtitle="Subtitle">This is a toast body</ToastBody>
        <ToastFooter>
          <Link>Action</Link>
          <Link>Action</Link>
        </ToastFooter>
      </Toast>,
      { intent: 'success' },
    );

  return (
    <>
      <Toaster toasterId={toasterId} />
      <Button onClick={notify}>Make toast</Button>
    </>
  );
};
```

### InvertedAppearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';

export const InvertedAppearance = (): JSXElement => {
  const toasterId = useId('toaster');
  const { dispatchToast } = useToastController(toasterId);
  const notify = () =>
    dispatchToast(
      <Toast appearance="inverted">
        <ToastTitle action={<Link>Undo</Link>}>Email sent</ToastTitle>
        <ToastBody subtitle="Subtitle">This is a toast body</ToastBody>
        <ToastFooter>
          <Link>Action</Link>
          <Link>Action</Link>
        </ToastFooter>
      </Toast>,
      { intent: 'success' },
    );

  return (
    <>
      <Toaster toasterId={toasterId} />
      <Button onClick={notify}>Make toast</Button>
    </>
  );
};
```

### CustomTimeout

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';

export const CustomTimeout = (): JSXElement => {
  const [timeout, setDismissTimeout] = React.useState(1000);
  const toasterId = useId('toaster');
  const { dispatchToast } = useToastController(toasterId);
  const notify = () =>
    dispatchToast(
      <Toast>
        <ToastTitle
          action={
            <ToastTrigger>
              <Link>Dismiss</Link>
            </ToastTrigger>
          }
        >
          {timeout >= 0 ? `Custom timeout ${timeout}ms` : `Dismiss manually`}
        </ToastTitle>
      </Toast>,
      { timeout, intent: 'info' },
    );

  return (
    <>
      <Field label="Timeout" hint="Timeout is in milliseconds">
        <SpinButton
          value={timeout}
          onChange={(e, data) => {
            if (data.value) {
              setDismissTimeout(data.value);
            } else if (data.displayValue !== undefined) {
              const newValue = parseFloat(data.displayValue);
              if (!Number.isNaN(newValue)) {
                setDismissTimeout(newValue);
              }
            }
          }}
        />
      </Field>
      <br />
      <Toaster toasterId={toasterId} />
      <Button onClick={notify}>Make toast</Button>
    </>
  );
};

CustomTimeout.parameters = {
  docs: {
    description: {
      story: [
        'The timeout of toasts can be customized in milliseconds. Using a negative timeout value results in the toast',
        'never being auto-dismissed.',
      ].join('\n'),
    },
  },
};
```

## Best Practices

### Do's

- Compose every toast from ToastTitle for the headline, ToastBody for supporting copy and progress, and ToastFooter for secondary links, so the default intent styling and semantics apply correctly.
- Always render a Toaster (with a stable toasterId created through useId) in addition to dispatching the toast; a dispatched toast has nowhere to appear without a matching Toaster.
- Pass a toastId whenever you dispatch a toast you may later update, dismiss, or pause, because those imperative APIs address toasts by id.
- Configure position, limit, offset, and default options once on the Toaster so every toast in the app behaves consistently, and override them per dispatch only when a specific message needs it.
- Wrap the dismiss or primary action link inside the ToastTitle action slot with ToastTrigger so clicking it closes the toast as part of the same interaction.
- Use a negative timeout for any toast the user must read or act on, and dismiss it programmatically when the underlying operation finishes.
- Choose the intent that matches the meaning of the message (success, info, warning, error) and keep the default styles; use the politeness option only when you need different screen reader urgency.
- Prefer updateToast over dispatching a second toast when a visible message's content, intent, or timeout changes, so the user sees one notification evolve rather than two stacked.
- Enable pauseOnHover and pauseOnWindowBlur on toasts whose text is long or whose actions are easy to miss, so the message does not vanish under the pointer.
- Encapsulate progress bars as their own component with their own state so they can tick independently and call back to dismiss the toast when finished.

### Don'ts

- Do not render a Toast where the event happens and assume it will show up; toasts are dispatched imperatively through the toast controller to a Toaster.
- Do not use more than one toast position in an application, because shifting locations are disorienting and users learn to look in one place.
- Do not run multiple Toasters in an app unless there is a hard requirement; the MultipleToasters pattern is explicitly called out as not recommended.
- Do not call dismissToast from an action inside the toast; wrap the button or link in ToastTrigger so dismissal is handled by the toast itself.
- Do not dispatch toasts without a toastId and then attempt to dismiss, pause, or update them selectively.
- Do not use a toast for critical errors, confirmations that gate progress, or anything the user must acknowledge before continuing; use Dialog for blocking decisions.
- Do not leave toasts with a negative timeout permanently on screen without an obvious dismiss path.
- Do not pause a toast imperatively unless the app is guaranteed to play it again, since a paused toast cannot be dismissed until it is played.
- Do not repeat the same message in a Toast and a MessageBar at the same time; pick the channel that matches the message's lifespan.
- Do not stuff a full dialog's worth of content into a toast; keep it to a title, a line or two of body, and at most a few footer links.

## Anti-Patterns

### Rendering Toast inline instead of dispatching it

❌ Toast is an imperative component; placing a Toast element directly in JSX does not produce a notification, so the message silently never appears and the Toaster is left unused.

✅ Render a Toaster near the app root with a stable toasterId, obtain the controller through useToastController for that id, and call the controller's dispatch function with the composed Toast content and options.

### Using more than one toast position or toaster

❌ Notifications that jump between corners, or arrive from several independent Toasters, are disorienting and force users to scan the whole viewport; the multi-toaster example is explicitly documented as not recommended.

✅ Pick a single position (for example top-end or bottom-end) and configure it once on one Toaster. When a queued burst is the concern, raise the limit rather than adding a second toaster.

### Dismissing an action-driven toast imperatively

❌ Calling the controller's dismiss function from a click handler inside the toast duplicates dismissal logic, can race with the toast's own lifecycle, and requires the toast to have been dispatched with an id.

✅ Wrap the button or link inside the ToastTitle action slot with ToastTrigger so activation of that element dismisses the toast declaratively as part of the click. Reserve the imperative dismiss API for dismissals driven by app state outside the toast.

### Dispatching anonymous toasts you later need to control

❌ Without a toastId you cannot dismiss, update, pause, or play a specific toast, so an update becomes a second stacked toast and a stale message can never be closed programmatically.

✅ Generate an id with useId and pass it as a dispatch option for any toast that may need to be updated, dismissed, or paused, then address that id through the controller's APIs.

### Pausing a toast with no plan to resume it

❌ A toast that has been paused imperatively can only be dismissed once the app plays it again, so users are left with a permanent, un-actionable notification.

✅ Only use the imperative pause when the app has a clear resume point, and prefer pauseOnHover or pauseOnWindowBlur for user-driven pausing. Always pair a pause with the matching play call and reset paused state when the toast unmounts.

### Rebuilding progress-heavy toast content on every tick

❌ Re-dispatching or re-rendering a toast around a frequently updating progress bar forces the entire toast subtree, including its live region content, to update constantly and can cause repeated announcements and janky animation.

✅ Encapsulate the progress bar together with its own state in a component placed in the ToastBody, let it tick independently, and have it call a dismissal callback when the underlying task completes. Dispatch that toast with a negative timeout so it survives until the task finishes.

### Using toasts for blocking or critical information

❌ Toasts are transient, do not take focus, and can be missed or auto-dismissed, so critical errors, destructive confirmations, and information the user must act on will be lost or ignored.

✅ Use Dialog for anything requiring acknowledgement or a decision, and MessageBar for persistent inline status. Keep toasts for confirmations, lightweight warnings, undo affordances, and background progress.

## Accessibility

**Requirements**: Toasts are announced through a live region, and the urgency of that announcement is derived from the intent, so the chosen intent must match the severity of the message. A politeness dispatch option is available when you want to override the urgency of the aria-live narration while retaining the default intent styling. Because toasts are transient and never take focus by default, every interactive element inside them (links, buttons, and anything wrapped in ToastTrigger) must be reachable and operable by keyboard and must carry discernible text. Provide a way to reach toasts without a pointer: the Toaster accepts a shortcuts option whose focus callback lets you define a keyboard shortcut (for example Ctrl+M) that focuses the most recent visible toast, and focusing a toast pauses every toast belonging to that toaster so their timeouts do not expire while the user reads. Honor pauseOnHover and pauseOnWindowBlur to satisfy users who need more time, and never rely on color alone to convey intent — the default intent icon accompanies the color.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and through the interactive elements rendered inside a focused toast, such as links and buttons. |
| `Enter` | Activates the focused link or button; if that element is wrapped in ToastTrigger, the toast is dismissed as part of the activation. |
| `Space` | Activates the focused button; links and buttons wrapped in ToastTrigger dismiss the toast when activated. |
| `Configurable focus shortcut (Toaster shortcuts.focus, for example Ctrl+M)` | Moves focus to the most recent visible toast; while a toast is focused, all toasts belonging to that toaster are paused and will not time out. |

**ARIA**: aria-live urgency for narration, derived from the dispatch intent and overridable through the politeness option, role and live region semantics supplied by the rendered toast surface and managed by the Toaster, aria-labelledby / accessible names on any Link or Button placed in the ToastTitle action slot, ToastBody, or ToastFooter

**Screen Reader**: The toast content is surfaced through a live region, so screen reader users hear the title, body, and any subtitle without moving focus. The urgency of that announcement follows the dispatched intent, which is why intent must reflect real severity; the politeness option changes only the urgency of narration and not the visual styling. Interactive elements in the action slot, body, and footer are announced in reading order and remain reachable by keyboard after the announcement. Because toasts do not steal focus, a keyboard user only learns about a toast when the live region announces it or when they invoke the configured focus shortcut, which then moves focus onto the toast and pauses dismissal timers.

## Styling

Toast surfaces are driven by theme tokens rather than hard-coded colors, so the same styling works in light, dark, and high contrast themes. The default surface uses tokens.colorNeutralBackground1 with tokens.colorNeutralForeground1 text and secondary copy in tokens.colorNeutralForeground2; the inverted appearance maps the surface to tokens.colorNeutralBackgroundInverted with token-driven inverted foregrounds, which is useful over light or busy content. Surface depth comes from shadow tokens such as tokens.shadow8, tokens.shadow16, and tokens.shadow64, with rounded corners from tokens.borderRadiusXLarge and inner padding from tokens.spacingHorizontalM and tokens.spacingVerticalM. Intent colors are applied through status tokens such as tokens.colorStatusSuccessForeground1, tokens.colorStatusWarningForeground1, and tokens.colorStatusDangerForeground1 together with their background counterparts, so overriding intent colors should be done by retheming those tokens rather than by targeting internal slots. Spacing between the title, body, and footer comes from vertical spacing tokens, and link colors inside a toast follow the standard link token rather than a toast-specific one. Because Toast exposes only the appearance prop and the root slot for styling hooks, per-toast visual changes should generally be made by passing a className to the Toast element via the root slot or by overriding theme tokens through FluentProvider.

## Performance

Toasts are rendered by the Toaster rather than by the component that triggers them, so a heavy or frequently updating toast content tree affects the toaster's render path rather than the trigger's. Cap the number of simultaneous toasts through the Toaster limit so a burst of events queues instead of mounting unbounded DOM and animation work. For progress-style toasts, isolate the progress bar and its ticking state in its own component inside the ToastBody so only that subtree re-renders each tick, and dismiss the toast from a callback when the work completes; dispatching with a negative timeout avoids a race between the timer and the task. Prefer updateToast for changing an already visible toast rather than dispatching a replacement, which would mount a new animated surface and produce a second live region announcement. Pass onStatusChange to know precisely when a toast reaches the unmounted stage before releasing related state or allowing the next dispatch, and avoid calling the toast controller from render paths or tight loops.

## Theming & Tokens

Toast consumes theme values through Griffel tokens, so it restyles automatically under FluentProvider and in dark and high contrast themes. The default surface uses tokens.colorNeutralBackground1 with tokens.colorNeutralForeground1 for the title and tokens.colorNeutralForeground2 for secondary text and subtitles; the inverted appearance switches the surface to tokens.colorNeutralBackgroundInverted with inverted foreground tokens. Depth comes from shadow tokens such as tokens.shadow8, tokens.shadow16, and tokens.shadow64, corners from tokens.borderRadiusXLarge, and internal rhythm from tokens.spacingHorizontalM and tokens.spacingVerticalM with body text at tokens.fontSizeBase300 and titles at tokens.fontWeightSemibold. Intent styling is expressed through status tokens, including tokens.colorStatusSuccessForeground1 and tokens.colorStatusSuccessBackground1, tokens.colorStatusWarningForeground1 and tokens.colorStatusWarningBackground1, and tokens.colorStatusDangerForeground1 and tokens.colorStatusDangerBackground1, so brand-level intent colors should be changed by overriding those tokens in a custom theme rather than by targeting internal class names. Links inside toasts follow the standard link foreground token, which keeps them legible against both the default and inverted surfaces.

## Migration Notes

Toast is an imperative component rather than a declaratively placed one: instead of mounting a component where the notification originates, you compose the Toast content and dispatch it through the toast controller to a Toaster that owns position, limit, offset, and default options. Content is structured through the dedicated ToastTitle, ToastBody, and ToastFooter parts (plus the media, subtitle, and action slots) instead of arbitrary children, and per-toast behavior such as intent, timeout, position, pause options, and lifecycle callbacks is passed as dispatch options rather than as props on the Toast element. Teams that previously simulated notifications with portaled containers or inline banners should move to a single Toaster at the app root and dispatch toasts from the places where events occur, and should replace any click handler that manually hid a notification with ToastTrigger wrapped around the action element.

## Edge Cases

- A negative timeout means the toast never auto-dismisses, so it must be closed by an action, by a ToastTrigger, or imperatively by the app; forgetting a dismissal path leaves a permanent notification on screen.
- Imperative APIs are id-based: a toast dispatched without a caller-provided toastId cannot be individually dismissed, updated, paused, or played, and can only be removed as part of a bulk dismiss.
- A toast paused through the imperative pause API cannot be dismissed until the app plays it again, and its paused state should be reset when the toast unmounts so the UI does not get stuck showing a pause affordance.
- The Toaster limit queues the excess rather than discarding it, so raising the limit is the way to show more at once; a long queue combined with short timeouts changes the order in which users see messages.
- Toasts dispatched while a toast is focused pause their timers, because focusing a toast pauses every toast belonging to that toaster; dismissing the focused toast resumes the rest.
- The inline Toaster positions toasts relative to the closest positioned ancestor, so an inline toaster placed outside an element with relative positioning will not appear where the surrounding content expects it.
- The toast lifecycle exposes queued, visible, dismissed, and unmounted stages through onStatusChange; dismissed means the toast is visually hidden but still mounted, so any state that must be released on teardown should wait for unmounted.
- An inverted appearance changes only the surface palette while intent, icons, and status colors still follow their tokens; custom media such as spinners and avatars must be checked against the inverted background for contrast.
- Multiple Toasters and multiple positions are technically supported through the toasterId and position props but are explicitly documented as not recommended, so treat both as exceptional configurations.

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
