# MessageBarGroup

> **Package**: `@fluentui/react-message-bar` v9.7.1
> **Import**: `import { MessageBarGroup } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

MessageBarGroup is a layout and motion container that renders a vertical stack of MessageBar components and coordinates their entrance and exit animations as messages are added to or removed from the page. It exists because message bars are frequently emitted in sets — several validation errors after a form submit, a warning plus an informational note, a batch of system statuses — and a bare list of MessageBar elements has no shared spacing, no grouping semantics, and no coherent story for what happens visually when one of them is dismissed. MessageBarGroup supplies that shared container through its root slot and observes its children over time so that a bar which disappears from the children array is animated out rather than vanishing instantly. The component takes only two public props: the required children, which should be MessageBar elements, and an optional animate setting that controls whether only exits are animated (the default, 'exit-only') or whether both entry and exit are animated ('both'). It is a pure presentation container — it does not create toasts, does not manage timers, does not add ARIA landmarks, and does not own the lifecycle of the messages it displays.

**When to use**: Use MessageBarGroup whenever more than one MessageBar can be visible in the same region at the same time, such as an inline validation summary above a form, a set of environment or quota notices at the top of a page, or a notifications panel where entries appear and disappear in response to user actions. Use it when the removal of a message should be visually explained rather than abrupt — the default 'exit-only' animation makes a dismissed bar collapse smoothly while leaving the insertion of new bars instantaneous so surrounding content does not jump. Do not use MessageBarGroup for transient, timed notifications that should float above the page; Toast and Toaster are the correct primitives for that. Do not use it as a substitute for Dialog when the message requires a blocking decision, and do not use it as a general-purpose vertical stack for cards or arbitrary content — its spacing and animation contract is built around MessageBar children.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `animate` | `"exit-only" \| "both" \| undefined` | `'exit-only'` | No | — |
| `children` | `React.ReactElement<unknown, string \| React.JSXElementConstructor<any>> \| React.ReactElement<unknown, string \| React.JSXElementConstructor<any>>[]` | — | Yes | — |

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Group two or more MessageBars in a MessageBarGroup so they share consistent spacing and share one exit-animation timeline.
- Give every child MessageBar a stable, unique React key so the group can reliably tell which bar was removed and which merely re-rendered.
- Leave animate at its default 'exit-only' when the group sits inline with other content, so inserting a new bar does not shift the page while reading.
- Opt into animate set to 'both' only in a dedicated region such as a notification panel where entrance motion is expected and nothing below the group is being read.
- Order children by severity, with error bars first and informational bars last, because the group renders children in the exact order they are provided.
- Consolidate repeated messages into one MessageBar with an action (for example 'show all') instead of stacking many near-identical bars.
- Move focus deliberately before removing a MessageBar whose action button or link currently holds focus, since the bar remains in the DOM only for the duration of the exit animation.
- Pair the group with AriaLiveAnnouncer (or the live-region semantics of your own content) when bars are added in response to background events, so the change is announced and not only seen.

### Don'ts

- Do not treat MessageBarGroup as a toast host; transient, self-expiring notifications belong to Toast and Toaster.
- Do not pass arbitrary children such as Card, Button, or plain div elements into the group — the layout and animation behavior is designed for MessageBar elements.
- Do not use the array index as the React key, because removing an item then makes the group animate the wrong bar and can preserve stale content in the wrong position.
- Do not rely on the group for screen reader announcements; adding a bar does not automatically notify assistive technology.
- Do not let the children array grow unbounded — a page that renders every historical message pollutes both the visual surface and the reading order.
- Do not set a fixed pixel height, overflow hidden, or aggressive negative margins on the group or its children, since that clips or fights the collapse animation of an exiting bar.
- Do not nest a MessageBarGroup inside another MessageBarGroup, and do not assume the group's root exposes landmark or list semantics — it does not add any.
- Do not remove a message bar synchronously in the same interaction that focuses an element inside it without redirecting focus first.

## Accessibility

## Theming & Tokens

MessageBarGroup itself is a neutral container, so its themeable surface is spacing and motion: the column gap should be expressed with spacing tokens such as tokens.spacingVerticalXS, tokens.spacingVerticalS, tokens.spacingVerticalMNudge, and tokens.spacingVerticalM, and outer padding with tokens.spacingHorizontalL or tokens.spacingVerticalL. The enter/exit motion is built from the theme's motion tokens, so the animation inherits tokens.durationFast, tokens.durationNormal, tokens.durationSlow, and easing tokens such as tokens.curveEasyEase and tokens.curveDecelerateMid; overriding those in a custom theme (or swapping in a reduced-motion theme) is how you tune or effectively shorten the motion, since no prop disables it. Presentation of the children comes from MessageBar's own theming: intent variants resolve to tokens.colorStatusDangerBackground1 and tokens.colorStatusDangerBorder1 for errors, tokens.colorStatusWarningBackground1 and tokens.colorStatusWarningBorder1 for warnings, tokens.colorStatusSuccessBackground1 and tokens.colorStatusSuccessBorder1 for success, and tokens.colorNeutralBackground3 for neutral informational bars, with text on tokens.colorNeutralForeground1 and tokens.colorNeutralForeground2. All of these switch automatically with FluentProvider's theme, including dark and high-contrast themes, so avoid hard-coded colors inside the group and never rely on the group root itself for background or border styling.

## Edge Cases

- Passing animate as undefined does not turn motion off — it resolves to the documented default of 'exit-only'. The only way to remove animation is to override motion duration tokens in the theme.
- Removal is visually asynchronous: after a bar leaves the children array it remains in the DOM during its exit animation, and the group's height only settles when that animation finishes, so any code that measures the group immediately after a state change will see stale dimensions.
- Changing a child's key is indistinguishable from removing one bar and adding another, so keys must be derived from the message identity, not from position or render count.
- The group contributes no ARIA role, name, or live-region behavior; all semantics and announcements must come from the child MessageBars, from a surrounding region you label yourself, or from AriaLiveAnnouncer.
- Wrapping the group in a container with overflow hidden or a fixed height can clip the exit animation and leave the root looking taller or shorter than its visible contents during the transition.
- A single MessageBar child renders and animates correctly, but the component earns its keep with two or more; if your UI can only ever show one message, a plain MessageBar is simpler.
- Multiple MessageBarGroups on the same page each coordinate their own children independently, so cross-group ordering and shared 'dismiss all' behavior must be implemented by the consuming application.

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
