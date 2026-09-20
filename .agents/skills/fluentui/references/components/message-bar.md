# MessageBar

> **Package**: `@fluentui/react-message-bar` v9.7.1
> **Import**: `import { MessageBar } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

MessageBar is a feedback component that displays a persistent, inline message related to the state of the surrounding page, section, or task — for example a validation failure, a successful save, a warning about destructive behavior, or a general informational note. It is composed of a root MessageBar element plus the companion parts MessageBarBody (the message content area), MessageBarTitle (an optional bold headline), and MessageBarActions (the action/dismiss area). Each MessageBar renders an icon slot (a decorative intent icon), an intent-driven color treatment, and an ARIA live region so that the message is announced to assistive technology when it appears. Three props shape the default appearance and behavior: intent (info by default, with presets that also determine the live announcement), politeness (override the live region behavior with assertive or polite), and shape (rounded by default for component-level messages, square for page/app-level messages). Multiple MessageBars can be stacked inside a MessageBarGroup, which supplies enter and exit animations for dynamically added and dismissed messages.

**When to use**: Use MessageBar for contextual, in-place feedback that should stay visible while the user reads or acts on it: failed form submissions, permission or quota warnings, persistent status of a saved artifact, or guidance about a destructive action. It is a good fit when the message belongs to a specific region of the page rather than to the whole application, and when you want to offer inline recovery actions such as Retry, Undo, or a hyperlink to more detail. Prefer Toast when the feedback is transient and not tied to a location the user is currently looking at, and prefer a Dialog when the user must acknowledge or resolve the issue before continuing. For validation errors attached to a specific form control, use Field (with its validation message) and reserve MessageBar for the section- or form-level summary. When you render several messages that appear and disappear as a result of user actions, wrap them in MessageBarGroup so dismissal animates instead of popping out of the layout.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `intent` | `MessageBarIntent \| undefined` | `info` | No | Default designs announcement presets |
| `politeness` | `"assertive" \| "polite" \| undefined` | — | No | — |
| `shape` | `"square" \| "rounded" \| undefined` | `rounded` | No | Use squal for page level messages and rounded for component level messages |

### Prop Guidance

- **intent**: Selects the visual preset (icon, background, border, and foreground colors) and the default ARIA live announcement for the message. Defaults to info. Choose the intent that matches the semantic meaning rather than the color you like: error for failures, warning for risks, success for confirmations, info for neutral guidance. `error`
- **politeness**: Overrides the live region behavior of the intent preset with either assertive or polite. Leave it unset to inherit the intent's preset announcement; use assertive sparingly for urgent, time-sensitive incidents that must interrupt, and polite for messages that can wait for a pause in speech. `polite`
- **shape**: Controls the corner treatment. Defaults to rounded, which is intended for message bars embedded at the component level; use square for page- or app-level banners where the message is flush with the layout edges. `square`
- **layout**: Opts out of the automatic reflow behavior by pinning the message bar to singleline or multiline. Use it only when your application already has its own responsive mechanism; otherwise let the component reflow when the body wraps to a second line. `multiline`

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

- Match the intent prop to the meaning of the message: use error for blocking failures, warning for risky or degraded states, success for completed operations, and info (the default) for neutral guidance.
- Always give the user a way forward — include a MessageBarActions region with at least one MessageBar action, or a dismiss control via the containerAction slot, so the message is actionable rather than purely decorative.
- Provide a short, descriptive heading with MessageBarTitle and keep the supporting sentence in MessageBarBody to one or two lines of actionable text.
- Give every icon-only control you place in MessageBarActions (including the containerAction dismiss button) an accessible name such as an aria-label of "dismiss".
- Use shape="rounded" (the default) for message bars embedded in a component or card, and shape="square" for page- or app-level banners that span the viewport edge.
- Render dynamically appearing and disappearing messages inside a MessageBarGroup so the enter and exit animations are handled automatically.
- Rely on the preset intent values for the live-region announcement, and only pass politeness when the default announcement behavior of the intent is not appropriate for your scenario.

### Don'ts

- Do not render a MessageBar with no actions at all — the component itself notes that using it without actions is not recommended from an accessibility point of view; add an action, a link, or a dismiss button.
- Do not arbitrarily override politeness with assertive on every message; excessive assertive announcements interrupt screen reader users and should be reserved for genuinely urgent, time-sensitive information.
- Do not wrap a MessageBar in another element when it is a child of MessageBarGroup — animation only functions when MessageBar components are the only children, and wrapping them is a known limitation.
- Do not use enter animations for MessageBar components that are present on initial page load; reserve enter animations for messages mounted during the lifecycle of the app.
- Do not use shape="square" for a message bar nested inside a component or card, or shape="rounded" for a full-width page banner; the shape choice communicates the message's scope.
- Do not put long, scrolling walls of text or rich multi-paragraph content in MessageBarBody — it is designed for a concise title plus a short supporting line.
- Do not rely on color alone to convey severity; always include text (and the descriptive title) so the meaning survives for users who cannot perceive the intent colors.

## Anti-Patterns

### Rendering a message with no actions

❌ A MessageBar that offers neither an action nor a dismiss control leaves the user with information they cannot act on or clear, and the component's own slot documentation flags this as not recommended from an accessibility point of view. The bottomReflowSpacer slot exists specifically to keep multiline spacing correct when no actions are rendered, which is a signal that this configuration should be rare.

✅ Add a MessageBarActions region with at least one relevant action, a Link to more detail, or a dismiss containerAction button so the message is always resolvable.

### Wrapping MessageBar children inside MessageBarGroup

❌ MessageBarGroup animations only function when MessageBar components are its only children. Wrapping each MessageBar in an extra div or another component silently disables the enter and exit animations — a documented known limitation.

✅ Pass MessageBar elements directly as children of MessageBarGroup and apply any per-message styling through the MessageBar className or a stable key instead of an extra wrapper element.

### Animating messages that exist on first paint

❌ Enter animations on components present at page load are distracting and can delay the reading of important status information that was already part of the page.

✅ Reserve enter animations for MessageBar components mounted during the lifecycle of the app (for example in response to an action). Wrap them in MessageBarGroup and let the default exit animation handle dismissal.

### Overriding politeness to assertive on every message

❌ Assertive announcements interrupt whatever a screen reader is currently speaking. Using it broadly means routine success or info messages cut off other content, which is a WCAG-relevant usability failure.

✅ Keep the intent's preset announcement for most messages and only set politeness to assertive for genuinely urgent incidents that require immediate attention.

### Using the wrong shape for the message scope

❌ Rounded corners on a full-width page banner or square corners on a message nested inside a card breaks the visual language that tells users whether the message applies to the page or to a local component.

✅ Use the default rounded shape for component-level messages and shape set to square for page- or app-level messages that span the layout.

## Accessibility

**Requirements**: MessageBar renders as an ARIA live region, so incidents that appear after user interaction are announced automatically; the preset intent values determine the design and the default live announcement. Messages must meet WCAG 1.4.3 contrast requirements, which the intent tokens are designed to satisfy — if you override colors, verify contrast between the message text and the intent background. Every interactive control placed inside MessageBarActions must be keyboard reachable and have an accessible name; icon-only buttons need an aria-label. The component documentation explicitly warns that rendering a MessageBar without actions is not recommended from an accessibility point of view, because a message the user cannot act on or dismiss leaves them stuck. Avoid content that updates frequently in a live region, as repeated announcements become disruptive.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and through the interactive children rendered in MessageBarActions (actions and the containerAction dismiss button); MessageBar itself does not trap or handle focus. |
| `Shift+Tab` | Moves focus backward out of the MessageBarActions region to the preceding focusable element on the page. |
| `Enter` | Activates a focused action Button, dismiss containerAction button, or Link inside the message bar. |
| `Space` | Activates a focused action Button or dismiss containerAction button inside the message bar. |

**ARIA**: aria-live (derived from the politeness prop: assertive or polite; preset by intent when politeness is not provided), aria-label on icon-only controls such as the containerAction dismiss button, aria-labelledby for associating the message region with its MessageBarTitle text

**Screen Reader**: Because the root is a live region, a MessageBar that appears as the result of an interaction is announced without moving focus. The intent presets choose an appropriate politeness level for the announcement, and the politeness prop lets you switch between assertive (interrupts current speech) and polite (queued until the user is idle). The decorative intent icon is not conveyed as meaningful content. When focus moves into MessageBarActions, the visual message is not re-announced; a screen reader user navigating the page encounters the message text in document order and then the action buttons with their accessible names.

## Styling

MessageBar is styled with Griffel, so use makeStyles and mergeClasses with a className on any part. The root is a CSS grid with dedicated areas for the icon, body, and actions; the icon slot accepts your own glyph if the default intent icon is insufficient. The shape prop switches the corner treatment between tokens.borderRadiusMedium (rounded) and tokens.borderRadiusNone (square), so override the border radius only if you need a bespoke value. Internal padding and the gap between the icon, body, and actions come from tokens such as tokens.spacingHorizontalMNudge, tokens.spacingVerticalMNudge, tokens.spacingHorizontalS, tokens.spacingVerticalS, tokens.spacingHorizontalXS, and tokens.spacingVerticalXS; if you restyle the container, keep these token-based gaps so reflow stays consistent. Type sizes come from tokens.fontSizeBase300 and tokens.lineHeightBase300, and the intent background, border, and foreground are the intent color tokens (for example tokens.colorInfoBackground1, tokens.colorInfoBorder1, tokens.colorInfoForeground1). Because the layout reflows automatically when body content wraps to a second line, avoid hard-coding widths or absolute positioning inside the message; put width constraints on the wrapper instead, as the Reflow story does with a resizable container. When customizing MessageBarActions, remember the containerAction element is rendered on its own edge of the actions grid, so styling it as a transparent Button keeps it visually separate from the primary actions.

## Performance

MessageBar is a lightweight, stateless grid-based component with no internal timers, so rendering cost is dominated by the content you place inside it. The main performance consideration is volume: each MessageBar is an independent live region, and stacking many of them (especially inside a MessageBarGroup) mounts and unmounts nodes as messages arrive and are dismissed. Keep the number of simultaneously visible bars small, give each one a stable key when rendering a list of messages so React does not remount them on every update (which would re-trigger animations and re-announce the live region), and avoid heavy or expensive child content in MessageBarBody. Reflow is handled by the component's layout rather than by JavaScript measurement of your content, so you do not need to debounce resize handling yourself. When messages are dismissed, MessageBarGroup keeps the exiting node in the DOM for the duration of the exit animation, so plan for a short-lived overlap rather than an immediate removal.

## Theming & Tokens

MessageBar consumes Fluent theme tokens, so all intents adapt automatically to light, dark, and high-contrast themes. Each intent maps to a background, border, and foreground triple: tokens.colorInfoBackground1, tokens.colorInfoBorder1, and tokens.colorInfoForeground1 for info; the corresponding success, warning, and error token families for the other intents. Body text inherits the neutral foreground tokens (tokens.colorNeutralForeground1 and its secondary variants) for intents that use a neutral surface. Corner geometry comes from tokens.borderRadiusMedium for the rounded shape and tokens.borderRadiusNone for the square shape. Internal rhythm uses tokens.spacingHorizontalMNudge, tokens.spacingVerticalMNudge, tokens.spacingHorizontalS, tokens.spacingVerticalS, tokens.spacingHorizontalXS, and tokens.spacingVerticalXS, and typography uses tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.lineHeightBase300, and tokens.fontWeightSemibold for MessageBarTitle. Because the colors are intent tokens instead of hard-coded values, redefining a theme on a FluentProvider restyles every MessageBar beneath it without per-component overrides.

## Migration Notes

The v9 component is composition-based rather than prop-driven. The v8 messageBarType prop is replaced by intent (info, success, warning, error), the v8 isMultiline prop is replaced by automatic reflow with the layout prop available to opt into singleline or multiline explicitly, and v8's truncated/overflow handling and onDismiss/dismiss-button props are replaced by composing content and controls yourself: put content in MessageBarBody and MessageBarTitle, and put buttons and a dismiss containerAction into MessageBarActions. Styling no longer uses the v8 styles prop or MessageBar scss styling; use Griffel class names with theme tokens. To get the v8-style dismissal animation, render the message inside a MessageBarGroup rather than animating it manually.

## Edge Cases

- MessageBar reflows automatically once the body content wraps to a second line, which moves the actions into a different grid area; if your application has its own responsive strategy, pin the layout prop to singleline or multiline to opt out.
- The bottomReflowSpacer slot only renders in multiline layout and guarantees correct bottom spacing when no actions are present — the actions grid area overlays it when actions are rendered, and relying on it implies you are shipping a message with no actions, which is discouraged.
- MessageBarGroup animations require MessageBar components to be the group's only children; interpolating any other component between the group and the bars disables the animation without an error.
- Dismissal inside a MessageBarGroup is driven by unmounting the message from your own state; the exit animation runs while the node is being removed, so filtering the array is enough — no manual animation bookkeeping is needed.
- The politeness prop overrides the announcement chosen by the intent preset, so setting it to assertive on a success message changes how intrusive the announcement is without changing its appearance — the two concerns are independent.
- Very long body content can wrap to many lines and push the action area to a new row; keep the body concise or truncate it upstream, since MessageBar has no built-in truncation or overflow menu.
- Because the message is a live region, re-rendering a visible MessageBar with new text announces that text again; change the message only when there is genuinely new information for the user.

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
