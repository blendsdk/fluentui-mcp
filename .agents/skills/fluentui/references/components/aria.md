# Aria

> **Package**: `@fluentui/react-aria` v9.17.12
> **Import**: `import { Aria } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

Aria is the accessibility utility surface in Fluent UI React v9 that lets an application push dynamic updates to assistive technology through ARIA live regions. It is composed of the AriaLiveAnnouncer component, which renders and keeps alive a visually hidden live region, together with the useAnnounce and useTypingAnnounce hooks that write messages into that region. The Aria component itself takes a single children prop and defines the subtree whose updates should be announceable, so any widget, results list, or status text rendered inside it can report changes without moving focus. Because assistive technology only observes a live region that already exists in the DOM, the utility is designed to stay mounted for the lifetime of the surrounding region rather than being created on demand. Typing-driven updates are handled separately by useTypingAnnounce, which debounces and batches rapid input so that character counters, filter result counts, and validation messages are spoken once instead of on every keystroke. It is a non-visual utility: it produces no styled surface of its own and instead augments components such as Field, Input, Button, and Combobox with programmatic status messages.

**When to use**: Use Aria when a change in the interface must be communicated to screen reader users without moving focus and without an obvious visual or focus-based cue: filtering a list and reporting how many results remain, warning that a character limit has been reached, confirming that a background action completed, or reporting inline validation errors as the user types. Reach for useAnnounce for discrete, one-off messages triggered by an action (a button press, a completed save, a removed item) and for useTypingAnnounce when the message is produced by continuous typing and would otherwise flood the screen reader queue. Do not use it as a substitute for proper labels, accessible names, or visible error text, and do not use it for content that is already announced naturally, such as a focused element's own accessible name, a Dialog that takes focus, or a MessageBar that is already in the reading order. If the information must be reliably received by every user, keep it visible and persistently in the DOM, and treat announcements as an enhancement on top of that.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React_2.ReactNode` | — | No | — |

### Prop Guidance

- **children**: The only prop on the Aria component. Pass the subtree whose dynamic updates need to be announceable, which in practice means the AriaLiveAnnouncer region and everything inside it that emits messages: the tracked Field and Input, the Button that fires a one-off announcement, the results list whose count is reported, or the contentEditable element whose character count is tracked. Keep the subtree stable, because the announcer must remain mounted for as long as messages may be produced. `A Field wrapping an Input plus the filtered results list`
- **batchId**: An option accepted by the announce functions produced by useAnnounce and useTypingAnnounce. Pass a stable identifier generated with useId when the same logical message can be produced more than once, so a newer message overrides the previous one for that identifier rather than waiting behind it in the screen reader queue. Use one batchId per logical message stream, not per keystroke. `charLimit`
- **inputRef**: Returned by useTypingAnnounce and attached to the element whose typing should be observed, such as an Input or a contentEditable span. The hook uses this ref to track the element whose changes drive typing announcements, so a single hook instance should be bound to the element it describes. `Attach to the Input inside a Field`

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { AriaLiveAnnouncer, Button, Field, Input, makeStyles, tokens, useAnnounce } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  return (
    <AriaLiveAnnouncer>
      <p>
        This example shows how to use the <code>useAnnounce()</code> hook connected with `AriaLiveAnnouncer` component.
        To check results, open the screen reader and click the button below.
      </p>

      <AnnouncePlayground />
    </AriaLiveAnnouncer>
  );
};
```

### Default

```tsx
import * as React from 'react';
import { AriaLiveAnnouncer, Field, Input, useId, useTypingAnnounce } from '@fluentui/react-components';
import type { InputProps, JSXElement } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  const [overLimit, setOverLimit] = React.useState(false);
  const announceId = useId('charLimit');

  const { typingAnnounce, inputRef } = useTypingAnnounce<HTMLInputElement>();

  const onChange: InputProps['onChange'] = (_, data) => {
    setOverLimit(data.value.length > 20);

    if (data.value.length > 20) {
      typingAnnounce('You have reached the maximum character limit', { batchId: announceId });
    }
  };

  return (
    <AriaLiveAnnouncer>
      <Field label="A field with a maxlength of 20" validationState={overLimit ? 'error' : undefined}>
        <Input onChange={onChange} ref={inputRef} />
      </Field>
    </AriaLiveAnnouncer>
  );
};
```

### ContentEditable

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { AriaLiveAnnouncer, Field, makeStyles, tokens, useId, useTypingAnnounce } from '@fluentui/react-components';

export const ContentEditable = (): JSXElement => {
  const [count, setCount] = React.useState(0);
  const styles = useStyles();

  const announceId = useId('charCount');

  const { typingAnnounce, inputRef } = useTypingAnnounce();

  const onInput = (ev: React.FormEvent<HTMLSpanElement>) => {
    const charCount = (ev.target as HTMLSpanElement).textContent?.length ?? 0;
    setCount(charCount);

    const message = charCountMessage(charCount);
    if (message) {
      // pass typingAnnounce a batchId to ensure new charCount updates override old ones
      typingAnnounce(message, { batchId: announceId });
    }
  };

  return (
    <AriaLiveAnnouncer>
      <Field label="A contenteditable div with a maxlength of 100" hint={`${count}/100`}>
        {fieldProps => (
          <span contentEditable ref={inputRef} onInput={onInput} className={styles.contentEditable} {...fieldProps} />
        )}
      </Field>
    </AriaLiveAnnouncer>
  );
};

ContentEditable.parameters = {
  docs: {
    description: {
      story: `Updates on remaining characters will begin being announced once you are within 10 characters of the max length.`,
    },
  },
};
```

## Best Practices

### Do's

- Mount a single AriaLiveAnnouncer around the region whose updates need to be announced, and keep it mounted for the whole lifetime of that region so the live region exists before any message is inserted.
- Use useAnnounce for discrete events (a filter returning no matches, an item being saved) and useTypingAnnounce for messages generated by typing, attaching the returned inputRef to the element whose input should be tracked.
- Pass a stable batchId derived from useId when the same logical message updates repeatedly, so the newest message replaces the stale one instead of queuing behind it.
- Keep announced strings short, specific, and self-contained, for example a count of matching results or an explicit maximum-character-limit warning, rather than repeating the user's own typed text.
- Threshold or debounce threshold-sensitive messages: in the character-count example, remaining-character announcements begin only once the user is within 10 characters of the maximum length.
- Pair announcements with Field, Input, and validationState so the announced message is reinforced by a visible label, hint, and error styling that all users can perceive.
- Announce the outcome of a user action after the visual state has changed, so the spoken message matches what is on screen when it is heard.

### Don'ts

- Do not render your own aria-live container next to AriaLiveAnnouncer or nest announcers; two live regions reporting the same change cause the message to be spoken twice.
- Do not hide the announcer with display: none, visibility: hidden, or aria-hidden, because content removed from the accessibility tree in those ways is never announced.
- Do not call an announcement function on every keystroke for information that changes with each character, such as echoing the query or re-announcing the entire result list; this floods and delays the assistive technology queue.
- Do not create or remount the announcer on demand to fire a single message; a region that appears in the same commit as its text may swallow the announcement.
- Do not use announcements as the only way to convey required information such as errors, limits, or counts; announcements can be interrupted, and users without a screen reader receive nothing.
- Do not place interactive controls inside the announced content in a way that causes them to be re-created on each update, because re-created elements lose focus and force the user to navigate again.
- Do not put sensitive or extremely verbose content (full document text, raw payloads, entire record descriptions) into a live region.

## Anti-Patterns

### Conditionally rendering the live region

❌ The announcer is mounted at the same time as the text it should speak, which is the classic live-region failure: assistive technology is not yet observing the node when the text is inserted, so the message is never read.

✅ Keep AriaLiveAnnouncer mounted for the lifetime of the region and change only the text inside it, ideally by calling the announce function from an event handler rather than rendering the message conditionally.

### Announcing every keystroke

❌ Calling the announce function on each input event, for example to echo the typed query or report a full result list, produces a stream of messages that queues, lags behind the user, and makes the interface unusable with a screen reader.

✅ Use useTypingAnnounce so rapid updates are batched, gate messages behind a meaningful threshold such as a character limit or a result-count change, and announce only state that the user needs to know.

### Stacking or duplicating live regions

❌ Adding a hand-written aria-live element alongside AriaLiveAnnouncer, or nesting announcers for different subtrees, causes the same status to be announced two or more times, which is confusing and erodes trust in the interface.

✅ Use one announcer per logical region and remove any custom live-region markup that overlaps with it; separate concerns through distinct batchIds rather than through separate regions.

### Unbatched repeated messages

❌ Emitting an updated message without a batchId means screen readers receive each version in turn, so the user hears stale information, such as every intermediate result count while filtering.

✅ Pass a stable batchId from useId so the newest message replaces the preceding one for that stream, and let the user hear only the current state.

### Announcements as the only feedback channel

❌ Relying on spoken status alone, for example without a visible hint or validationState on the Field, means users without a screen reader get no feedback at all and users who missed the utterance cannot recover the information.

✅ Always render the visible equivalent alongside the announcement, using hint text, validationState, and a results list or counter that stays on screen.

## Accessibility

**Requirements**: Aria exists to satisfy WCAG 2.1 success criterion 4.1.3 Status Messages, which requires status messages to be programmatically determinable through role or live region properties so they can be announced without receiving focus. Updates must not steal focus or change the user's position in the page (3.2.2 On Input), and the visible equivalent of any announced information must remain perceivable for users who do not use assistive technology. The announcer region must stay in the accessibility tree at all times, and any input participating in the pattern must already have a programmatic label and description through Field. Use only the politeness level appropriate to the message: routine updates are polite, and assertive behavior should be reserved for genuinely time-sensitive warnings.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the child content of the region, for example into the Input being tracked; the live region itself is never focusable and must not appear in the tab order. |
| `Enter` | Activates a child Button whose handler calls the announce function, triggering a one-off status announcement. |
| `Space` | Activates a child Button, producing the same announcement behavior as Enter. |
| `Character keys` | Typing into a tracked Input or contentEditable element fires its input handler, which is where useTypingAnnounce and character-limit messages are emitted. |
| `Backspace and Delete` | Reduces the tracked content length, which should update any counter and can clear or replace a previously announced limit warning. |

**ARIA**: aria-live, aria-atomic, aria-relevant, role="status", aria-labelledby, aria-describedby, aria-hidden (must never be applied to the announcer region)

**Screen Reader**: The announcer renders a persistently mounted, visually hidden live region; assistive technology monitors that node and speaks text inserted into it even though focus never moves. Politeness determines whether the message waits for a natural pause (polite) or interrupts the current utterance (assertive), and atomic behavior causes the whole region to be re-read when part of it changes. Users never navigate to the region through the tab order or the virtual cursor's normal flow, and the announcement has no visual counterpart unless the application also renders visible status text. Exact timing, ordering, and repetition handling differ across screen readers and browser combinations, so identical repeated strings may be silently suppressed, and messages issued before the region is mounted may never be read.

## Styling

The Aria announcer produces no visible surface, so resist the temptation to style or reposition it: it must stay visually hidden using the built-in technique (clipping and zero-size positioning) rather than display: none or visibility: hidden, both of which remove it from the accessibility tree. All meaningful styling belongs to the surrounding content rendered inside the region. Build those styles with makeStyles and Griffel tokens, for example tokens.colorNeutralForeground1 for primary text, tokens.colorNeutralForeground3 for the hint text that accompanies a Field, tokens.colorPaletteRedForeground1 and tokens.colorPaletteRedBorder2 for the error state that accompanies a validationState of error, tokens.spacingVerticalM and tokens.spacingHorizontalS for layout rhythm, tokens.fontFamilyBase with tokens.fontSizeBase300 and tokens.lineHeightBase300 for readable body text, and tokens.colorNeutralBackground1 with tokens.borderRadiusMedium for result list containers. Keep visual order and DOM order identical so the announced message matches the visual flow, and never collapse, truncate, or visually hide content that the announcement is describing.

## Performance

The announcement functions are deliberately decoupled from React state: the story examples compute a message and pass it straight to the announce function from an event handler, avoiding an extra render per update. That matters because each announcement mutates the DOM inside the live region, and screen readers process those mutations serially, so excessive updates cause an audible backlog. useTypingAnnounce exists precisely to reduce that load by batching typing-induced messages, and the batchId option prevents an ever-growing queue of superseded strings. Keep the region count low, since every mounted announcer is an additional observed node. Also watch the work done inside the input handler itself: the filtering example runs a case-insensitive scan per keystroke, so large data sets should be memoized or pre-indexed rather than filtered from scratch on every character.

## Theming & Tokens

Aria itself renders no themed surface, so theme tokens do not change how announcements behave; they apply to the content rendered inside the region. Text that the announcement describes should use tokens.colorNeutralForeground1 for primary text and tokens.colorNeutralForeground3 for the hint that accompanies a Field, with tokens.colorPaletteRedForeground1 and tokens.colorPaletteRedBorder2 reserved for the error state tied to validationState. Layout and typography come from tokens.spacingVerticalM, tokens.spacingVerticalS, tokens.spacingHorizontalS, tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300, while containers such as a results list use tokens.colorNeutralBackground1 with tokens.borderRadiusMedium. Because the announcer region is visually hidden, brand ramp overrides and high-contrast system colors have no effect on it — they affect only the visible widgets such as Button, Input, and Field that participate in the pattern, so verify contrast on those rather than on the announcer.

## Migration Notes

Aria is a v9 utility with no exact one-to-one predecessor. Where earlier Fluent UI React code either hand-rolled an aria-live div or used the older Announced-style component to surface a status string, the v9 pattern is to mount AriaLiveAnnouncer once around the region and drive messages through the useAnnounce and useTypingAnnounce hooks, which own creation, batching, and cleanup of the live region. The behavioral differences to plan for are that the region is expected to be long-lived rather than rendered per message, that repeated messages of the same kind are collapsed through a batchId instead of being queued, and that typed input updates go through useTypingAnnounce so that intermediate keystrokes are not announced individually.

## Edge Cases

- A live region can only announce text inserted after it is mounted and observed; a message emitted in the same commit that creates the announcer is frequently dropped, so the announcer should be mounted early and kept alive.
- Announcements are best-effort: users may have screen reader output disabled, may be using a browser or assistive technology combination that handles politeness differently, or may simply not hear an interrupted utterance, so every announced message needs a visible counterpart.
- Repeating an identical string in a live region may be silently ignored by some screen readers; vary the wording, include the changing value, or re-set the region so the user hears the update.
- Any ancestor of the announcer hidden with display: none, visibility: hidden, or aria-hidden suppresses all announcements from that region, including announcements that appear to succeed in the DOM.
- contentEditable elements do not enforce a maximum length natively, so any character-limit messaging must be computed manually from the element's text content inside the input handler, as the character-count example does.
- Rapid consecutive messages without a shared batchId queue up and can be read after the state they describe has already changed; a shared batchId collapses them to the latest value.
- The useTypingAnnounce hook returns a ref that must be attached to the element being tracked; forgetting to apply it means typing events never reach the hook and no typing announcements are produced.
- A single announcer shared across unrelated features can interleave messages from different flows, so scope each announcer to a region and separate message streams with distinct batchIds.

## See Also

- - [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
