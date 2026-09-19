# Toast

> **Package**: `@fluentui/react-toast` v9.8.0
> **Import**: `import { Toast } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

Toast is Fluent UI React's transient, non-blocking notification surface. A toast is never rendered where it is declared: you describe the content declaratively and push it into a Toaster host using the dispatchToast function returned by useToastController. The Toast component itself is the visual container for one notification and is composed with ToastTitle (which exposes action and media slots), ToastBody (with an optional subtitle), ToastFooter for secondary actions, and ToastTrigger, which wraps any button or link so that activating it dismisses the toast — the standard pattern for Undo or Dismiss affordances. Every dispatch accepts options such as intent (success, info, warning, error), timeout in milliseconds, a caller-supplied toastId, position, pauseOnHover, pauseOnWindowBlur, and an onStatusChange lifecycle callback, while the same controller exposes dismissToast, dismissAllToasts, updateToast, pauseToast and playToast for imperative control. The Toast root also accepts an appearance prop, documented in examples with the value inverted for dark or high-contrast surfaces. Defaults for position, timeout, limit, offset, pause behavior and keyboard shortcuts live on the Toaster, so an application normally configures its notification behavior once and dispatches simple toast content thereafter.

**When to use**: Use Toast for brief, non-blocking feedback about the outcome of an action the user just took or about a background event: a save succeeded, an email was sent, a file finished downloading, or an operation failed but the app remains usable. Toasts are ideal when the message should not interrupt the user's flow, when the user may want a short-lived Undo affordance, and when the feedback is about the application as a whole rather than a specific field. Prefer MessageBar when the message must persist in the page layout or must be dismissed deliberately, Dialog when the user must make a decision before continuing, and Field validation messaging when the feedback belongs to a specific input. If you need the notification to appear inline within a page region rather than floating over the viewport, render a Toaster with the inline prop inside a positioned ancestor instead of switching components.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `any` | — | No | — |

### Prop Guidance

- **appearance**: Controls the visual treatment of the toast surface. The documented alternative to the default surface is the inverted appearance, which suits dark or high-contrast contexts and can be combined with any intent. `inverted`
- **intent**: Dispatch option that selects the semantic meaning of the toast; it drives the default icon, color, and the urgency of screen reader narration. Choose exactly one of success, info, warning, or error to match the outcome being reported. `success`
- **timeout**: Dispatch option expressed in milliseconds that controls how long the toast remains before auto-dismissing. Use a small value for confirmations and a negative value when the toast must be dismissed manually, such as progress or decision prompts. `-1`
- **toastId**: A caller-supplied identity for the toast. It is required whenever the toast must be dismissed, updated, paused, or played imperatively, and it is what onStatusChange lets you correlate lifecycle events with. `my-toast-id`
- **onStatusChange**: Dispatch option invoked as the toast moves through queued, visible, dismissed, and unmounted. Use it to drive UI state such as disabling a Make toast button until the previous toast has fully unmounted. `status === 'unmounted'`
- **position**: Places the toast at bottom, bottom-start, bottom-end, top, top-start, or top-end. It can be set per dispatch or as a Toaster default, but an application should settle on a single position rather than scattering toasts around the viewport. `bottom-end`
- **pauseOnHover**: Pauses the dismiss countdown while the pointer is inside the toast. Set it per dispatch or as a Toaster default so users always have time to read and interact. `true`
- **pauseOnWindowBlur**: Pauses the dismiss countdown when the user moves focus to another window, preventing toasts from disappearing while the user is away. Best configured as a Toaster default. `true`
- **politeness**: Overrides the urgency of the aria-live narration produced by the intent without changing the intent's visual styling. Use it when an intent's default urgency does not match how important the message is in your flow. `override narration urgency, keep intent colors`
- **limit**: Toaster prop defining the maximum number of simultaneously rendered toasts. Additional toasts are queued and rendered as earlier ones are dismissed, which protects the viewport from bursts. `3`
- **offset**: Toaster prop that applies a static horizontal and vertical offset to every toast in the toaster, relative to the viewport. It cannot be set per toast because toasts in one position must share alignment. `horizontal 20, vertical 16`
- **inline**: Toaster prop that renders toasts in DOM order, positioned relative to the closest positioned ancestor instead of floating over the viewport. Render the Toaster inside an element with relative positioning. `true`
- **toasterId**: Identifies which Toaster a controller drives. Generate one with useId, pass it to the Toaster, and pass the same value to useToastController; multiple ids should only be used in the rare, not-recommended multi-toaster case. `useId('toaster')`
- **shortcuts**: Toaster prop that binds a keyboard shortcut to focus the most recent visible toast; focusing pauses every toast in that toaster. Document the shortcut so keyboard users can discover it. `CTRL+M focuses the newest toast`
- **content**: Used with updateToast to replace the rendered content of an existing toast that was dispatched with a toastId. Almost every option of the toast can be changed this way. `a new Toast element with different ToastTitle text`
- **ToastTitle action**: Slot for the title's trailing affordance, typically a link or button wrapped in ToastTrigger so that activating it dismisses the toast (Undo, Dismiss). `an Undo link wrapped in ToastTrigger`
- **ToastTitle media**: Slot in front of the title that shows the intent icon by default; override it to present a Spinner for progress or a small Avatar for person-related notifications. `a tiny Spinner or a 16px Avatar`
- **ToastBody subtitle**: Adds a secondary line of context beneath the body content; keep it short so the toast stays scannable. `Subtitle`
- **ToastTrigger**: Wraps a button or link so that clicking it dismisses the owning toast. This is the recommended dismissal mechanism for actions inside a toast. `a Dismiss link inside ToastTrigger`

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

- Render a single Toaster near the root of the application, give it a stable toasterId, and reuse that same id with useToastController so dispatch and rendering stay connected.
- Choose an intent (success, info, warning, or error) for every dispatched toast so the correct default icon and color are applied automatically.
- Provide a toastId when you dispatch a toast that you may later need to dismiss, update, pause, or play imperatively.
- Wrap any in-toast action that should close the toast (Undo, Dismiss, Retry-then-close) with ToastTrigger instead of calling dismissToast from a click handler.
- Configure shared defaults — position, timeout, limit, offset, pauseOnHover, pauseOnWindowBlur, and keyboard shortcuts — on the Toaster so individual dispatches stay simple and consistent.
- Set a timeout that matches the reading effort: short values for simple confirmations, and a negative timeout (for example -1) for toasts that contain progress or require an explicit decision.
- Use the limit prop to cap how many toasts are visible at once so that bursts of events queue instead of flooding the viewport.
- Encapsulate progress bars, spinners, and their state inside their own component inside the toast so that ticking progress does not re-render the whole toast subtree.
- Use updateToast with an existing toastId to change an already-visible notification instead of dispatching a duplicate.
- Use the offset prop on the Toaster, not per toast, when toasts would otherwise collide with app chrome such as a fixed header or cookie banner.

### Don'ts

- Don't use toasts for critical errors or decisions that require action — the message can be missed or auto-dismissed; use MessageBar or Dialog instead.
- Don't call dismissToast from an action inside the toast; wrap that action with ToastTrigger so dismissal is handled by the toast itself.
- Don't pause a toast with pauseToast unless the application is guaranteed to call playToast later — a paused toast can only be dismissed once the app plays it again.
- Don't deploy multiple Toasters or multiple simultaneous positions in one application; the documentation explicitly marks this as not recommended because it disorients users.
- Don't dispatch a new toast to report a status change of an existing one; use updateToast with the original toastId.
- Don't set per-toast offsets — offset only exists on the Toaster because all toasts in a given position should be aligned identically.
- Don't rely on the default timeout for long or important content; pick an explicit timeout or disable auto-dismiss and let the user act.
- Don't render an inline Toaster without a positioned ancestor — inline toasts are positioned relative to the closest positioned ancestor, so place the Toaster inside an element with relative positioning.

## Anti-Patterns

### Using toasts for blocking or critical messages

❌ Toasts auto-dismiss, cannot demand attention, and can be missed if the user is looking elsewhere, so important errors or decisions may go unnoticed.

✅ Use MessageBar for persistent in-page messaging or Dialog when the user must acknowledge or choose before continuing, and reserve Toast for transient confirmations and status updates.

### Dismissing from inside the toast with the imperative API

❌ Calling dismissToast from an action inside the toast couples content to controller plumbing, requires a toastId, and duplicates behavior the component already provides.

✅ Wrap the action element with ToastTrigger so a click on the wrapped button or link dismisses the toast, and keep dismissToast for dismissals triggered from outside the toast.

### Pausing a toast without a guaranteed resume

❌ A toast paused through pauseToast can only be dismissed once the application plays it again, so a forgotten resume leaves the toast stuck on screen indefinitely.

✅ Only use pauseToast in flows where the application deterministically calls playToast later, or rely on pauseOnHover and pauseOnWindowBlur, which resume automatically.

### Dispatching a new toast to change an existing message

❌ Re-dispatching for each status change stacks duplicate notifications, confuses the queue and the limit, and produces repeated screen reader announcements.

✅ Give the toast a toastId at dispatch time and call updateToast with new content and options to mutate the visible toast in place.

### Driving animated progress from the toast's parent

❌ Updating progress state in the component that dispatched the toast re-renders the toast subtree on every tick, wasting work and risking jank.

✅ Encapsulate the progress bar and its data source in a dedicated component rendered inside ToastBody, and let it call dismissToast through a callback when it finishes.

## Accessibility

**Requirements**: Toasts render inside a live region managed by the Toaster, so they must be announced without moving focus. Because toasts auto-dismiss, they are subject to timing requirements: provide pauseOnHover and pauseOnWindowBlur, honor the focus shortcut so users can reach and stop a disappearing message, and use a negative timeout for content that must be read or acted upon. Every actionable element inside a toast (action links, footer links, ToastTrigger-wrapped buttons) must be reachable and operable by keyboard with a visible focus indicator, and text must meet contrast requirements in both the default and inverted appearances. The intent of a toast drives the urgency of its screen reader narration; the politeness option can be used to override that urgency without changing the intent's visual styling.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the toast's actionable elements, such as the action slot in ToastTitle and the links in ToastFooter. |
| `Shift+Tab` | Moves focus backwards out of the toast's actionable elements and returns to the page. |
| `Enter` | Activates a focused action; when that action is wrapped in ToastTrigger, activating it also dismisses the toast. |
| `Space` | Activates a focused button or ToastTrigger-wrapped control, dismissing the toast when the control is a dismiss affordance. |
| `Configurable focus shortcut (CTRL+M in the documented example)` | Defined through the shortcuts option on the Toaster; focuses the most recent visible toast and pauses every toast belonging to that toaster so none of them time out while the user reads. |

**ARIA**: aria-live — the urgency of announcement is derived from the toast intent and can be overridden with the politeness option, role — the toast is rendered inside the live region produced by the Toaster rather than in the document flow, aria-labelledby / aria-labelledby-style labeling of status regions — used in the documented lifecycle example so assistive technology can associate a log region with its visible label

**Screen Reader**: When a toast becomes visible the Toaster's live region announces its content according to the urgency implied by its intent (success, info, warning, error); this urgency can be overridden with the politeness option while keeping the intent's styles. Focus is not stolen from the user's current context, so screen reader users hear the announcement but keep their place. Because the focus shortcut moves real DOM focus into the newest toast and pauses all toasts owned by that toaster, users can read, navigate, and dismiss a toast at their own pace using standard Tab and activation keys. Interactive elements inside the toast are announced as normal links and buttons, and when wrapped in ToastTrigger they dismiss the toast as part of their activation.

## Styling

Style toast internals with Griffel tokens so they follow the theme automatically: give the toast surface tokens.colorNeutralBackground1 with tokens.colorNeutralForeground1 text, and switch to inverted colors for the inverted appearance using tokens.colorNeutralBackgroundInverted and tokens.colorNeutralForegroundInverted. Use tokens.colorNeutralStroke1 for a subtle border, tokens.shadow16 (or the pair tokens.colorNeutralShadowAmbient and tokens.colorNeutralShadowKey) for the floating elevation, tokens.borderRadiusXLarge or tokens.borderRadiusMedium for the corner radius, and tokens.spacingVerticalM plus tokens.spacingHorizontalM for the internal padding of ToastTitle, ToastBody, and ToastFooter. Intent surfaces read from palette tokens such as tokens.colorPaletteGreenForeground1, tokens.colorPaletteRedForeground1, tokens.colorPaletteYellowForeground1 and tokens.colorBrandForeground1. Type should use tokens.fontSizeBase300 with tokens.fontWeightSemibold for ToastTitle. Keep in mind that stacking, position, offset, and the width of the toast container are controlled by the Toaster rather than the Toast, so customization of placement belongs in the Toaster configuration and any wrapper element used with the inline prop.

## Performance

Toasts are imperatively dispatched and internally mapped to React, so they are not part of the normal render tree and should not be re-created on every render. The limit prop queues excess toasts rather than mounting them, which keeps DOM size bounded during bursts. Long-running content such as download progress should be encapsulated in its own component inside ToastBody so ticking state does not re-render the toast's title, footer, or the component that dispatched it. Prefer updateToast over dispatching replacement toasts to avoid mounting and animating new nodes, and use a negative timeout for progress toasts so they do not disappear mid-operation. Because pauseOnHover, pauseOnWindowBlur, and the focus shortcut attach listeners through the Toaster, configuring those defaults once on the Toaster is cheaper and more consistent than setting them per dispatch.

## Theming & Tokens

Toast consumes Fluent theme tokens through its slots, so it adapts automatically to light, dark, and high-contrast themes supplied by the provider. The default surface uses tokens.colorNeutralBackground1 with tokens.colorNeutralForeground1 text, while the inverted appearance switches to tokens.colorNeutralBackgroundInverted and tokens.colorNeutralForegroundInverted. Each intent maps to palette and brand tokens — for example tokens.colorPaletteGreenForeground1 for success, tokens.colorPaletteRedForeground1 for error, tokens.colorPaletteYellowForeground1 for warning, and tokens.colorBrandForeground1 for informational accents — and these colors are applied to the default icon in ToastTitle. Elevation comes from tokens.shadow16 or the tokens.colorNeutralShadowAmbient and tokens.colorNeutralShadowKey pair, corners from tokens.borderRadiusXLarge, spacing from tokens.spacingVerticalM and tokens.spacingHorizontalM, and typography from tokens.fontSizeBase300 and tokens.fontWeightSemibold. Overriding intent urgency through the politeness option changes announcement behavior only, leaving these theme-driven visuals intact.

## Edge Cases

- A negative timeout means the toast is never auto-dismissed and must be closed by the user or by an imperative API call.
- Without a caller-supplied toastId you cannot dismiss, update, pause, or play that specific toast later — only dismissAllToasts can affect it.
- A toast paused imperatively stays on screen until the application calls playToast; hover and window-blur pauses resume automatically.
- When the number of dispatched toasts exceeds the Toaster limit, the extras enter the queued lifecycle stage and render only after a visible toast is dismissed.
- Toasts dispatched with a position can differ from the Toaster default, but mixing positions in one application is explicitly discouraged as disorienting.
- Offset cannot be set per toast; it is configured once on the Toaster so all toasts sharing a position stay aligned.
- Inline toasts render in DOM order relative to the closest positioned ancestor, so they appear in the wrong place when the Toaster is not inside a relatively positioned element.
- Multiple Toasters are technically supported through distinct toasterId values, but the documentation flags that pattern as not recommended.
- The lifecycle emits queued, visible, dismissed, and unmounted; code that re-enables a trigger should wait for unmounted rather than dismissed, since a dismissed toast is still mounted.

## See Also

- - [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
