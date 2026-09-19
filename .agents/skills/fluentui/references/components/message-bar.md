# MessageBar

> **Package**: `@fluentui/react-message-bar` v9.7.1
> **Import**: `import { MessageBar } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

MessageBar is a feedback component that displays a persistent, page- or component-level message to the user, such as an informational notice, a success confirmation, a warning, or an error. It renders as a horizontal bar whose content is composed from subcomponents: MessageBarBody holds the message text, MessageBarTitle supplies a short descriptive heading, and MessageBarActions holds the response actions, including an optional container action (typically a dismiss button placed in the bar's corner). The intent prop picks a preset design and the matching live-region announcement, politeness lets an app override how urgently the message is announced to assistive technology, and shape switches between rounded corners for in-component placement and square corners for full-width page banners. MessageBar reflows automatically when body content wraps to a second line, and multiple bars can be placed inside MessageBarGroup to gain enter and exit animations as messages are added to and removed from a list.

**When to use**: Use MessageBar when a message must stay visible until the user reads, acts on, or dismisses it — for example a service degradation notice, a form-level validation summary, a permission or license warning, or a success confirmation for an operation the user just completed. Use MessageBar with shape square for page- or app-level banners that span a layout region, and shape rounded for messages scoped to an individual component or card. Prefer Toast for transient, self-dismissing feedback, Dialog for messages that must block interaction, and Field validation text for per-input errors. When several MessageBars are created and destroyed at runtime — such as a queue of notifications — place them inside MessageBarGroup so exit animations run automatically when a bar is unmounted.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `intent` | `MessageBarIntent \| undefined` | `info` | No | Default designs announcement presets |
| `politeness` | `"assertive" \| "polite" \| undefined` | — | No | — |
| `shape` | `"square" \| "rounded" \| undefined` | `rounded` | No | Use squal for page level messages and rounded for component level messages |

### Prop Guidance

- **intent**: Selects the preset design and the default live-region announcement for the bar. Match it to the meaning of the message rather than to a preferred color, and let it drive both visuals and announcement urgency. Defaults to info. `success`
- **politeness**: Overrides the politeness of the live-region announcement independently of the visual intent. Use polite for the majority of messages and reserve assertive for critical, time-sensitive information that should interrupt the screen reader. `assertive`
- **shape**: Controls the corner treatment to signal message scope: rounded (the default) for component-level messages placed inside a surface, square for page- or app-level banners that span a layout region. `square`
- **layout**: Opts out of automatic reflow by pinning the bar to a singleline or multiline arrangement. Use it when the application already owns responsive behavior for the region; otherwise leave it unset and let the bar reflow when the body wraps. `multiline`
- **containerAction**: Prop of MessageBarActions that renders a control in the bar's action container, conventionally a transparent Button with a DismissRegular icon. Always supply an aria-label because the button has no visible text. `dismiss button with aria-label`
- **animate**: Prop of MessageBarGroup that controls which transitions play for child bars: both for enter and exit, or exit-only. Prefer exit-only for bars that exist on initial render and reserve enter animations for bars mounted later in the app lifecycle. `exit-only`
- **icon**: Optional root slot for the leading indicator icon. Leave it to the preset design unless you have a specific need; any icon you inject should stay decorative and not repeat the message text. `leading severity icon`
- **bottomReflowSpacer**: Optional slot rendered only in multiline layout to guarantee correct bottom spacing when no actions are rendered. Needing it is a signal that the bar has no actions, which is not recommended for accessibility — prefer adding real actions instead. `multiline spacing element`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `bottomReflowSpacer` | — | No | Rendered when the component is in multiline layout to guarantee correct spacing even if no actions are rendered. When actions are rendered, the default actions grid area will render over this element  NOTE: If you are using this slot, this probably means that you are using the MessageBar without actions, this is not recommended from an accesibility point of view |
| `icon` | — | No | — |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';

export const Default = (): JSXElement => (
  <MessageBar>
    <MessageBarBody>
      <MessageBarTitle>Descriptive title</MessageBarTitle>
      Message providing information to the user with actionable insights. <Link>Link</Link>
    </MessageBarBody>
    <MessageBarActions
      containerAction={<Button aria-label="dismiss" appearance="transparent" icon={<DismissRegular />} />}
    >
      <Button>Action</Button>
      <Button>Action</Button>
    </MessageBarActions>
  </MessageBar>
);
```

### Actions

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';

export const Actions = (): JSXElement => (
  <MessageBar>
    <MessageBarBody>
      <MessageBarTitle>Descriptive title</MessageBarTitle>
      Message providing information to the user with actionable insights. <Link>Link</Link>
    </MessageBarBody>
    <MessageBarActions
      containerAction={<Button appearance="transparent" aria-label="Dismiss" icon={<DismissRegular />} />}
    >
      <Button>Action</Button>
      <Button>Action</Button>
    </MessageBarActions>
  </MessageBar>
);

Actions.parameters = {
  docs: {
    description: {
      story: ['The `MessageBar` can have different actions.'].join('\n'),
    },
  },
};
```

### Animation

```tsx
import * as React from 'react';
import type { JSXElement, MessageBarGroupProps, MessageBarIntent } from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';

export const Animation = (): JSXElement => {
  const styles = useStyles();
  const counterRef = React.useRef(0);

  const [animate, setAnimate] = React.useState<MessageBarGroupProps['animate']>('both');
  const [messages, setMessages] = React.useState<ExampleMessage[]>([]);

  const addMessage = () => {
    const intent = intents[Math.floor(Math.random() * intents.length)];
    const newMessage = { intent, id: counterRef.current++ };

    setMessages(s => [newMessage, ...s]);
  };
  const clearMessages = () => setMessages([]);
  const dismissMessage = (messageId: number) => setMessages(s => s.filter(entry => entry.id !== messageId));

  return (
    <div>
      <div className={styles.controlsContainer}>
        <Field className={styles.field} label="Select animation type:" orientation="horizontal">
          <RadioGroup
            layout="horizontal"
            onChange={(_, { value }) => setAnimate(value as MessageBarGroupProps['animate'])}
            value={animate}
          >
            <Radio label="both" value="both" />
            <Radio label="exit-only" value="exit-only" />
          </RadioGroup>
        </Field>

        <div className={styles.buttonGroup}>
          <Button appearance="primary" onClick={addMessage}>
            Add message
          </Button>
          <Button onClick={clearMessages}>Clear</Button>
        </div>
      </div>

      <MessageBarGroup animate={animate} className={styles.messageBarGroup}>
        {messages.map(({ intent, id }) => (
          <MessageBar key={`${intent}-${id}`} intent={intent}>
            <MessageBarBody>
              <MessageBarTitle>Descriptive title</MessageBarTitle>
              Message providing information to the user with actionable insights. <Link>Link</Link>
            </MessageBarBody>
            <MessageBarActions
              containerAction={
                <Button
                  onClick={() => dismissMessage(id)}
                  aria-label="dismiss"
                  appearance="transparent"
                  icon={<DismissRegular />}
                />
              }
            />
          </MessageBar>
        ))}
      </MessageBarGroup>
    </div>
  );
};

Animation.parameters = {
  docs: {
    description: {
      story: [
        'Enter animations are also handled within the `MessageBarGroup`. However avoid entry animations for MessageBar',
        'components on page load. However, MessageBar components that are mounted during the lifecycle of an',
        'app can use enter animations.',
        '',
        '> ⚠️ Animation will only function if the only children of `MessageBarGroup` are `MessageBar` components.',
        'Do not wrap `MessageBar` with other components. This is a known limitation we are actively working on.',
      ].join('\n'),
    },
  },
};
```

## Best Practices

### Do's

- Always give the bar at least one response path: a MessageBarActions region with actions and/or a containerAction dismiss button, since a MessageBar with no actions is discouraged from an accessibility standpoint.
- Use MessageBarTitle to give every bar a short descriptive heading so users can identify the message at a glance before reading the body text.
- Pick the intent that matches the meaning of the message (info for neutral information, success for completed operations, warning for issues that still allow progress, error for failures), because intent drives both the visual preset and the default screen reader announcement.
- Place dynamically added and dismissed MessageBars inside MessageBarGroup so exit animations trigger automatically on unmount, and key each bar by a stable identifier.
- Provide an accessible name on every icon-only button, for example aria-label on the transparent Button used as the containerAction dismiss control.
- Use shape rounded for component-level messages and shape square for page/app-level banners so the bar visually communicates its scope.
- Let the bar reflow automatically, or opt out with the layout prop when the surrounding application already has its own responsive mechanism for the region.
- Override politeness only when the app genuinely needs a different announcement urgency than the one the chosen intent provides.

### Don'ts

- Don't use MessageBar for short-lived, self-dismissing confirmations — Toast is the right component for feedback that should disappear on its own.
- Don't wrap MessageBar inside another element when it is a child of MessageBarGroup; animation only functions when the direct children of the group are MessageBar components.
- Don't use entry animations for MessageBars that are present on page load — reserve enter animations for bars mounted during the lifecycle of the app after the user has interacted.
- Don't render an icon-only containerAction or action button without an aria-label; icon-only buttons have no visible text for assistive technology to read.
- Don't force politeness to assertive for routine or low-priority messages, since assertive announcements interrupt whatever the screen reader is currently reading.
- Don't stack many MessageBars directly in the page without a MessageBarGroup and a dismissal path, because users can end up with an ever-growing, unmanageable wall of notices.
- Don't use shape square for an inline, component-scoped message or shape rounded for a full-width page banner; the shapes carry opposite spatial meanings.
- Don't rely on the bottomReflowSpacer slot as a substitute for real actions — it exists only to keep spacing correct in multiline layouts without actions.

## Anti-Patterns

### MessageBar used as a transient toast

❌ MessageBar is persistent by design and stays in the layout until the user dismisses it or the app removes it, so using it for short confirmations leaves stale notices stacked on the page.

✅ Use Toast for feedback that should disappear on its own, and reserve MessageBar for messages that require reading, an action, or an explicit dismissal.

### Action-less message bar

❌ Rendering MessageBar without MessageBarActions or a containerAction gives the user no way to respond, and the presence of the bottomReflowSpacer slot in a bar is an explicit signal that the bar has no actions, which the component authors call out as not recommended for accessibility.

✅ Add at least one action — a dismiss containerAction, a link in the body, or a real action button — so the message always offers a next step.

### Wrapping MessageBar inside another element in a MessageBarGroup

❌ Enter and exit animations only function when the direct children of MessageBarGroup are MessageBar components; wrapping a bar in a div or other component silently breaks the animation.

✅ Render MessageBar as the immediate child of MessageBarGroup and move any layout styling onto the MessageBar className instead of an intermediate wrapper.

### Enter animations on page load

❌ Animating bars that are present on initial render draws attention to messages the user has not caused and can be disorienting, and the guidance explicitly says to avoid entry animations for MessageBars on page load.

✅ Use exit-only animation for bars rendered on load and reserve both-direction animation for bars mounted during the app lifecycle in response to user interaction.

### Unlabeled icon-only dismiss control

❌ The conventional containerAction is a transparent button containing only a DismissRegular icon, which has no accessible name for screen reader users to hear.

✅ Always pass an aria-label such as "dismiss" (or a localized equivalent) to the icon-only button.

## Accessibility

**Requirements**: MessageBar is announced through a live region, so its content must make sense when read out of context: include a MessageBarTitle and concise body text. Because the component exposes a live region, avoid placing interactive-only affordances inside it without an accessible name — the icon-only transparent Button used as containerAction must carry an aria-label such as "dismiss". Ensure color is never the only signal of severity by pairing intent with the title text. Interactive elements inside MessageBarActions must be reachable and operable by keyboard and must meet contrast requirements against the intent background, which the preset intents handle when you do not override colors.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus from the page into the first focusable element inside the bar, such as a Link in the body, an action button, or the containerAction dismiss button. |
| `Shift+Tab` | Moves focus back out of the bar to the previous focusable element in document order. |
| `Enter` | Activates the focused action or dismiss button, triggering its click behavior (for example dismissing the message). |
| `Space` | Activates the focused action or dismiss button, matching the standard Button activation behavior. |

**ARIA**: aria-live (polite or assertive, derived from the intent preset or overridden with the politeness prop), aria-label (required on icon-only buttons such as the containerAction dismiss control), aria-hidden considerations for the leading icon slot, which is decorative and should not duplicate the message text

**Screen Reader**: MessageBar content is placed inside a live region, so text rendered by MessageBarBody and MessageBarTitle is announced to screen readers when the bar appears rather than only when focus lands on it. The politeness prop controls whether that announcement is polite (queued after the current utterance, the safer default for informational messages) or assertive (interrupts the current utterance immediately) — the chosen intent supplies a sensible default, and overriding it changes only the announcement behavior, not the visual design. Focusable items inside the bar are not part of the live announcement; users reach them with Tab and activate them with Enter or Space, and icon-only controls are read using their aria-label.

## Styling

Style MessageBar through its subcomponents rather than the root when possible: apply className to MessageBar for container-level tweaks and to MessageBarBody or MessageBarActions for layout changes inside the bar. The intent presets already bind the right theme tokens, so avoid hardcoding colors — if you must adjust them, use tokens such as tokens.colorNeutralBackground1 and tokens.colorNeutralForeground1 for the info look, tokens.colorPaletteGreenBackground1 / tokens.colorPaletteGreenForeground1 for success, tokens.colorPaletteYellowBackground1 / tokens.colorPaletteYellowForeground1 for warning, and tokens.colorPaletteRedBackground1 / tokens.colorPaletteRedForeground1 for error. Corner treatment follows shape, and you can override the radius with tokens.borderRadiusMedium for rounded bars or tokens.borderRadiusNone to flatten corners. Use tokens.spacingHorizontalL, tokens.spacingHorizontalMNudge, and tokens.spacingVerticalS for padding and gaps between the icon, body, and actions, tokens.borderRadiusCircular for icon sizing, tokens.colorNeutralStroke1 if you add a border, and tokens.fontWeightSemibold for MessageBarTitle emphasis.

## Performance

MessageBar measures its content to decide when to reflow from singleline to multiline, so very wide or frequently re-rendered bars add layout work; pinning the layout prop with singleline or multiline skips that automatic reflow when the app already controls responsiveness. When rendering lists of bars, keep them inside a single MessageBarGroup and give each MessageBar a stable key so that mounting and unmounting animates correctly instead of re-creating DOM nodes. Avoid mounting many live-region bars at once, since each one triggers an announcement and can flood the accessibility queue.

## Theming & Tokens

MessageBar is fully token-driven. Each intent preset binds background and foreground tokens such as tokens.colorNeutralBackground1 with tokens.colorNeutralForeground1 for info, tokens.colorPaletteGreenBackground1 with tokens.colorPaletteGreenForeground1 for success, tokens.colorPaletteYellowBackground1 with tokens.colorPaletteYellowForeground1 for warning, and tokens.colorPaletteRedBackground1 with tokens.colorPaletteRedForeground1 for error. Corner geometry follows shape and resolves to values like tokens.borderRadiusMedium (rounded) or flat corners (square), spacing uses tokens.spacingHorizontalL, tokens.spacingHorizontalMNudge, and tokens.spacingVerticalS, separators and outlines can use tokens.colorNeutralStroke1, and MessageBarTitle text uses tokens.fontWeightSemibold with tokens.fontSizeBase300. Switching the surrounding Provider theme or a custom theme therefore restyles every bar without any per-bar overrides.

## Migration Notes

MessageBar in v9 is a composition-based component rather than a single flat API: instead of passing message text and action props, you compose MessageBar with MessageBarBody, MessageBarTitle, and MessageBarActions children, and you wrap collections of bars in MessageBarGroup. Intent presets now determine both the design and the aria-live announcement, which can then be overridden with the politeness prop, and layout reflow from singleline to multiline is handled automatically unless you opt out with the layout prop.

## Edge Cases

- Animation only works when the only children of MessageBarGroup are MessageBar components — wrapping a bar in another element silently disables enter and exit transitions.
- The bottomReflowSpacer slot is rendered only in multiline layout, and needing it usually means the bar has no actions, which the component authors flag as not recommended from an accessibility point of view.
- Overriding politeness with assertive changes only the announcement behavior, not the visual intent, so a visually calm info bar can still interrupt the screen reader if politeness is set to assertive.
- Automatic reflow is based on body content wrapping to a second line; if the application already has its own responsive mechanism, opt out with layout set to singleline or multiline to avoid the bar fighting the container.
- Bars mounted on first render should not use enter animations; only bars added later during the app lifecycle benefit visually from the both animation setting.

## See Also

- - [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
