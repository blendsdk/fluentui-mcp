# AriaLiveAnnouncer

> **Package**: `@fluentui/react-aria` v9.17.12
> **Import**: `import { AriaLiveAnnouncer } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

AriaLiveAnnouncer is a utility component that establishes an ARIA live region and supplies the React context required by the useAnnounce hook, so that any component rendered beneath it can push short status messages to screen readers without moving focus. It is imported from @fluentui/react-components and accepts a single optional children prop, which is normally the subtree (often the whole application shell) whose descendants need to announce things. Unlike visible notification components such as MessageBar, Toast, or Dialog, AriaLiveAnnouncer produces no visible output of its own; its only job is to guarantee that a dedicated, screen-reader-visible channel exists for asynchronous updates such as form submissions, list changes, clipboard confirmations, or progressive results. Because it works as a provider, one instance is typically mounted per page or application root, and every nested consumer calls the announce function returned by useAnnounce to send text into that one shared channel. This centralizes announcement ownership in a single DOM location instead of scattering hand-rolled live regions throughout a codebase.

**When to use**: Reach for AriaLiveAnnouncer when a visual change happens that a screen reader user would otherwise never learn about because focus does not move and nothing is re-read: content saved, an item removed from a list, a search returning a result count, a background export finishing, or a value copied to the clipboard. Mount it once near the top of the tree, inside FluentProvider and above routed content, and drive it from the announce function returned by useAnnounce. Do not use it for information that is critical, blocking, or requires a decision, because a live region cannot be acknowledged or focused; those cases belong in Dialog or MessageBar, where focus management and a dismissible surface do the work. Do not use it as a substitute for good visible feedback either: users of Toast, MessageBar, and inline status text still need a redundant visual path. Finally, do not use it for content that should simply be present and readable in the normal document flow; that content belongs in the page itself, not in an announcement.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | No | — |

### Prop Guidance

- **children**: The only prop, and it defines the scope of the announcer. Everything rendered inside children can call useAnnounce and reach this live region, so pass the largest subtree that practically belongs to the same announcement policy, usually the application shell inside FluentProvider and above routed content. If you instead pass only a single small component, announcements made anywhere else in the app have no provider to resolve to. You do not need to pass anything at all if the announcer is only used as a standalone host, but in that case nothing beneath it will be able to announce. `The application shell rendered inside FluentProvider, so every nested screen can announce through one shared live region.`

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

## Best Practices

### Do's

- Render exactly one AriaLiveAnnouncer high in the tree, inside FluentProvider and outside routed or conditionally mounted content, so the live region stays stable while pages change beneath it.
- Pass the subtree that contains your announcing components as children; any descendant that calls useAnnounce only reaches this live region if it is rendered inside the provider.
- Keep each announcement to one short, self-contained sentence that makes sense with no visual context, such as a count plus a noun and a verb describing the outcome.
- Pair every announcement with an equivalent visible signal using MessageBar, Toast, or inline status text, because announcements are invisible, easily missed, and can be muted by the user.
- Announce after the operation has completed and describe the result, matching the wording to the visible state the user is looking at.
- Localize announcement strings the same way as the rest of the interface so the screen reader pronounces them in the correct language and voice.
- Batch several related updates into a single announcement rather than firing one message per state change.

### Don'ts

- Do not mount an AriaLiveAnnouncer in every feature, route, or component; multiple live regions in one document produce duplicated or interleaved announcements that users cannot untangle.
- Do not call useAnnounce from a component rendered outside the AriaLiveAnnouncer subtree; the context and its live region will not be available to that component.
- Do not announce on every keystroke, hover, scroll, or pointer move; a stream of messages overwhelms screen reader speech and hides the important ones.
- Do not repeat the exact same sentence back to back, because consecutive identical live region content is frequently suppressed by screen readers.
- Do not push long paragraphs, lists, tables, or multi-sentence content into the announcer; those belong in the page or in a focus-managed surface such as Dialog.
- Do not use announcements where moving focus is the correct behavior, such as opening a dialog, menu, or error that the user must act on.
- Do not hide the announcer or any of its ancestors with display none, visibility hidden, or aria-hidden, since that removes the live region from the accessibility tree.
- Do not treat the announcement as the sole channel for information that affects a task; visual users need the same information on screen.

## Anti-Patterns

### One announcer per feature

❌ Mounting AriaLiveAnnouncer inside each page, panel, or component creates several live regions in the same document. Screen readers then interleave, duplicate, or drop messages, and announcement ordering becomes unpredictable because each region competes for speech.

✅ Render a single AriaLiveAnnouncer near the application root, inside FluentProvider and outside routed content, and let every feature resolve to that one region through useAnnounce.

### Announcing everything

❌ Calling announce on every keystroke, validation, hover, or intermediate state produces a torrent of speech that buries the messages that matter and can make the interface effectively unusable for screen reader users.

✅ Announce only meaningful, completed, user-relevant outcomes, keep one announcement per interaction where possible, and batch related updates into a single sentence.

### Live region as the only notification

❌ Relying on an announcement for information that is critical, actionable, or long-lived means sighted users never see it, screen reader users who missed or muted the message cannot recover it, and there is no way to review the message later.

✅ Always pair announcements with persistent visible feedback through MessageBar, Toast, or inline status text, and use Dialog with focus management when the user must acknowledge or act on the information.

### Repeating identical strings

❌ Writing the same sentence into the live region twice in a row often produces no speech at all, because screen readers detect that the region content did not change and skip the update. The result is a silent failure that looks correct in the DOM.

✅ Vary the wording between consecutive announcements, include the changing value in the message, or sequence announcements so that no two identical strings are pushed back to back.

### Announcer used instead of focus management

❌ Opening a dialog, menu, error summary, or any widget that receives focus and announcing its existence instead of moving focus leaves the user stranded with no way to interact with the new surface, and the announcement is spoken over content that does not match it.

✅ Move focus into newly revealed interactive surfaces using their own focus management, and reserve announcements for updates that occur while focus stays where it is.

## Accessibility

**Requirements**: AriaLiveAnnouncer exists to satisfy WCAG 4.1.3 Status Messages (Level AA): status information produced without a change of focus must be programmatically determinable so assistive technology can present it. It also supports WCAG 4.1.2 Name, Role, Value by giving announcements an explicit live region role, WCAG 1.3.1 Info and Relationships by keeping the status text in a defined region rather than loose DOM text, and WCAG 2.2.2 Pause, Stop, Hide when the interface produces frequent automatic updates, since unrestrained announcements are effectively uncontrolled motion of speech. Because announcements are non-visual, the component should always be used with a visible equivalent that satisfies WCAG 1.1.1 for users who do not run a screen reader.

| Key | Action |
| --- | --- |
| `None` | AriaLiveAnnouncer renders no focusable elements and handles no key events of its own; all keyboard interaction comes from the controls that trigger announcements, such as buttons and inputs, and from the useAnnounce call those controls make. |

**ARIA**: aria-live on the region that AriaLiveAnnouncer owns, which is what causes new text to be spoken without focus movement, aria-atomic, so the whole message is read rather than only the changed fragment, aria-relevant, which limits what kinds of mutations trigger a re-announcement, role of the live region, which conveys status or alert semantics to assistive technology, aria-hidden on ancestors must be avoided, because it removes the live region from the accessibility tree and silences every announcement

**Screen Reader**: When a consumer calls the announce function from useAnnounce, the message text is written into the live region that AriaLiveAnnouncer controls. Screen readers detect that mutation and speak the text at the next natural pause (or immediately, depending on how the region is configured), without moving focus, without changing the virtual cursor position, and without interrupting whatever the user is currently reading in most cases. The message is only ever spoken; it is not rendered as visible content and it is not reachable by keyboard navigation. Users who have muted their screen reader, who are running in a high-verbosity or low-verbosity mode, or who rely on braille alone may not perceive the announcement, and identical consecutive strings are commonly ignored by speech synthesizers, so any message that genuinely matters must also exist visually.

## Styling

AriaLiveAnnouncer adds no visual chrome of its own, so there is nothing component-specific to style; its live region is not part of the visible layout. Anything you render as children is ordinary DOM and is styled normally, which means the common customization path is to use makeStyles together with Griffel tokens on your own wrapper or status elements, for example tokens.fontFamilyBase and tokens.fontSizeBase300 for typography, tokens.colorNeutralForeground1 for body text, and tokens.colorNeutralForeground2 or tokens.colorNeutralForeground3 for secondary status lines. If you place the announcer in a layout region that is collapsed (for example a hidden panel or an off-canvas drawer), make sure the collapse uses visibility-based or size-based techniques rather than display none, since removing the subtree from rendering also removes the live region from the accessibility tree. Never apply aria-hidden to a wrapper around the announcer for the same reason, and prefer letting the announcer sit at the root of the layout where it is unaffected by per-page styling.

## Performance

AriaLiveAnnouncer is extremely cheap to render: it adds context and a small non-visual region, so its own cost is negligible. The performance-relevant decisions are about placement and frequency. Mounting it once at the root keeps the region stable across route transitions, whereas remounting it per page tears down and recreates the live region and can drop or duplicate pending announcements. A large children subtree is fine because children are normal React content, but you should not wrap the entire app purely to enable announcements if a narrower, stable region is sufficient and survives navigation. On the announcement side, every message causes a screen reader interruption and a speech synthesis pass, so the real budget is speech, not CPU; batching several state changes into one message and debouncing high-frequency producers such as live search results keeps the experience usable.

## Theming & Tokens

AriaLiveAnnouncer has no component-specific theme tokens because it renders nothing visible; it responds to the surrounding FluentProvider only insofar as the children you pass inherit the active theme. Any visible markup rendered as children follows standard tokens such as tokens.colorNeutralForeground1 for primary text, tokens.colorNeutralForeground2 and tokens.colorNeutralForeground3 for secondary status text, tokens.colorNeutralBackground1 for surfaces, and tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300 for typography. In dark, high-contrast, or custom brand themes, those visible status elements update automatically while announcements themselves are unaffected, since speech is driven by the live region text and not by color or contrast. Announcement content is never themed, so if you want your messages to match branded language, do that through localized message strings rather than through styling.

## Migration Notes

Earlier Fluent UI generations handled announcements declaratively, typically by wrapping rendering content in a dedicated announcer element whose message appeared as a property or as static text content. AriaLiveAnnouncer inverts that pattern: the component itself renders the live region and publishes context, and the message is pushed imperatively through the announce function returned by useAnnounce from whatever component detects the state change. When porting, remove per-feature live regions and the props that fed them, hoist a single AriaLiveAnnouncer to the application root, and replace each former declarative message with one useAnnounce call at the point where the operation actually completes. Also re-check any CSS that hid the old announcer, because hiding an ancestor with display none or aria-hidden now silently disables the shared region for the entire subtree.

## Edge Cases

- Announcements issued before the announcer is committed to the DOM are lost, because a live region must already exist before its content changes. Trigger announcements from effects or event handlers that run after mount, not during the initial render pass.
- Consecutive identical messages are commonly ignored by screen readers even though the DOM updated, which can make a working implementation look broken during testing.
- Unmounting or remounting the announcer, for example by placing it inside a route or a conditionally rendered shell, discards the established live region and can drop in-flight announcements or cause duplicates during the swap.
- Any ancestor hidden with display none, visibility hidden, or aria-hidden removes the live region from the accessibility tree, and announcements fail silently with no console warning.
- During server-side rendering the live region does not function until hydration completes, so announcements fired from initial render logic are not spoken.
- Very rapid successive announcements can be truncated or replaced by the screen reader before the previous one finishes speaking, so message length and frequency must be considered together.
- Announcements are invisible to sighted users and to automated DOM tests that only inspect visual output, so plan a separate visible status surface and explicit accessibility testing with a real screen reader.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
