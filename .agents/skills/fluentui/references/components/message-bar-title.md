# MessageBarTitle

> **Package**: `@fluentui/react-message-bar` v9.7.1
> **Import**: `import { MessageBarTitle } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

MessageBarTitle is the heading element of the MessageBar composition. It renders the short, scannable label that summarizes why a message bar is being shown — for example a validation error, a warning about an unsaved change, or a confirmation that an action completed — and sits as the first child inside MessageBarBody, directly above the descriptive text. The component renders a single root slot that carries the title text, so styling, class names, and the underlying element type flow through that slot. Its foreground color and emphasis are driven by the surrounding MessageBar's intent, meaning the same title text automatically picks up danger, warning, success, or informational styling depending on which MessageBar it lives in. MessageBarTitle holds no interactive behavior of its own: keyboard focus, the live-region announcement, and any action buttons belong to the parent MessageBar, MessageBarBody, and MessageBarActions.

**When to use**: Use MessageBarTitle whenever a MessageBar needs a one-line headline that lets users understand the message before reading the supporting sentence — for example in a form validation summary, a service-degradation banner, a save-confirmation toast-like bar, or a permissions warning. It is the right choice when the bar contains more than a single sentence and the first few words should be visually differentiated from the rest of the copy. Do not use it as a standalone text component for general typography needs; for non-feedback headings use Text with an appropriate weight, and for ordinary body copy use Text or the body portion of the message bar. If your message is exactly one short sentence with nothing else, a MessageBarBody with plain text may be sufficient and adding a title would be redundant. For transient confirmations that must not steal page layout, prefer the Toast family instead of a persistent MessageBar.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `animate` | `'exit-only' \| 'both'` | — | No | — |
| `children` | `React_2.ReactElement[] \| React_2.ReactElement` | — | Yes | — |
| `containerAction` | `Slot<'div'>` | — | No | — |
| `inline` | `boolean` | — | No | — |
| `intent` | `MessageBarIntent` | — | No | — |
| `politeness` | `'assertive' \| 'polite'` | — | No | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'span'>` | — | Yes | — |
| `shape` | `'square' \| 'rounded'` | — | No | — |

### Prop Guidance

- **root**: The required root slot renders the title text element. Use it to attach className, style, or an alternative element type when the default tag does not fit your markup, and to forward refs and data attributes. Keep the replacement element inline-level and non-focusable so the title stays presentational inside the message bar. `className: 'myTitleStyles'`
- **children**: The title text itself. Pass a short string or a single inline Text element; multiple siblings or block-level children break the headline-then-body reading order and can disturb the message bar's live-region announcement. `We couldn't save your changes`
- **intent**: Determines the semantic tone of the bar and therefore the color treatment applied to the title. Configure it on the surrounding MessageBar so the title, icon, background, and body all agree; do not try to reproduce intent styling on the title element alone. `error`
- **shape**: Controls the bar's corner treatment, either square or rounded. Set it on the message bar that hosts the title so the radius matches the container; the title itself inherits no independent shape. `rounded`
- **politeness**: Selects whether the announcement is assertive, interrupting the user, or polite, waiting for a pause. Choose polite for confirmations and assertive only for conditions that require immediate attention, and set it on the bar rather than on the title. `polite`
- **animate**: Governs whether message bar entries animate on exit only or on both entry and exit, which matters when titles appear and disappear as a group of bars changes. Apply it at the group level so titles inside the group animate together rather than independently. `exit-only`
- **inline**: Switches the bar into an inline presentation suited to flowing within surrounding content instead of occupying its own row. Titles used in inline bars should be especially short, since inline layouts leave less horizontal room and the text will wrap sooner. `true`
- **containerAction**: Provides a container-level action such as a dismiss or overflow control for the bar. Such controls are interactive and therefore must live in the bar's action area, never inside the title, so keyboard and screen reader users encounter them in a predictable position. `dismiss button`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Keep the title to a handful of words — a phrase, not a sentence — so it scans as a headline above the supporting copy in MessageBarBody.
- Place MessageBarTitle as the first child of MessageBarBody so the reading order is title first, explanation second, actions last.
- Write titles that state the outcome or the problem directly, such as a save failure or a session-expiry warning, rather than vague labels like Notice or Info.
- Let the parent MessageBar's intent drive the title color instead of hard-coding a status color, so the heading stays consistent with the bar's icon and background.
- Use a single MessageBarTitle per MessageBarBody; if you are tempted to add a second, the content probably belongs in the body text or in a separate message bar.
- Rely on the message bar's own live region for announcement and keep the title purely presentational and non-interactive.

### Don'ts

- Don't put paragraphs, lists, or multi-sentence explanations in MessageBarTitle — move that content into the body area of the message bar.
- Don't add interactive elements such as links or buttons inside the title; actions belong in the message bar's action area.
- Don't set hard-coded colors or font sizes on the title to make it stand out; the surrounding MessageBar already gives it the correct emphasis for its intent.
- Don't use MessageBarTitle outside of a message bar as a general-purpose heading substitute for Text or a semantic heading element.
- Don't use the title as the only content of a message bar when the user needs context or a way to resolve the condition — pair it with body text and, when relevant, actions.
- Don't add margins or padding to the title to create vertical rhythm; spacing comes from the message bar and body layout.

## Anti-Patterns

### Using the title as the whole message

❌ A message bar whose only content is a MessageBarTitle gives the user a headline with no explanation and no path to resolution, which is especially confusing for errors where the user needs to know what failed and what to do next.

✅ Always pair MessageBarTitle with body content in MessageBarBody, and add actions in the bar's action area when the user can fix or dismiss the condition.

### Overloading the title with detail

❌ Long sentences, lists, or inline links inside the title turn the headline into body copy, break the visual hierarchy, and make live-region announcements rambling for screen reader users.

✅ Keep the title to a short phrase and move supporting detail, links, and enumerations into MessageBarBody or the bar's actions.

### Hard-coding status colors on the title

❌ Manually coloring the title red or yellow duplicates what the bar's intent already does, drifts out of sync when the intent or theme changes, and can fail contrast requirements in dark or high-contrast themes.

✅ Let the surrounding MessageBar's intent determine the title's appearance, and only use tokens such as colorStatusDangerForeground1 when an explicit, theme-aware override is genuinely required.

### Multiple competing titles in one bar

❌ Two MessageBarTitle elements inside a single body create two visual anchors, so users cannot tell which is the summary, and assistive technology announces redundant headings.

✅ Use one title per bar. If you have two distinct messages, render two message bars, or demote the second line to body text.

### Making the title interactive or focusable

❌ Buttons or links inside a live region are announced at unpredictable times and create tab stops inside content the user did not expect to be interactive, which is disorienting for keyboard and screen reader users.

✅ Keep the title static text; place all interactive controls in the bar's action area, which is designed for that purpose.

## Accessibility

**Requirements**: MessageBarTitle must never be the sole carrier of meaning: the title and the surrounding MessageBarBody together should communicate the condition in text, so users who cannot perceive the bar's status color or icon still understand the message. Contrast must meet WCAG 1.4.3 (4.5:1) for the title text against the message bar background; because the title inherits its foreground from the bar's intent, verify any custom theme still produces sufficient contrast for danger, warning, success, and informational intents. The title must not contain focusable content, since focusable elements inside a live region are announced unpredictably and can trap focus. Keep title text short so it is not truncated at 200% zoom or in narrow containers.

**ARIA**: aria-live, aria-atomic, role="alert", role="status", aria-label, aria-labelledby, aria-describedby, aria-hidden

**Screen Reader**: MessageBarTitle is not focusable and produces no keyboard interaction; screen readers read it as ordinary text in document order. The announcement behavior comes from the containing MessageBar's live region, which is assertive or polite depending on the politeness value set on the bar — an assertive bar is treated like role alert and interrupts the user, while a polite bar is treated like role status and waits for a pause. Because the whole bar is typically announced atomically, keep the title concise so the combined title-plus-body announcement stays intelligible. If a title is used only to visually summarize content that is already conveyed elsewhere, it can be hidden from assistive technology so the message is not announced twice, and conversely a bar can be associated with its title using aria-labelledby when the title is the best accessible name for the region.

## Styling

MessageBarTitle is styled through the root slot, so pass a className or inline style to it, or wrap it with Griffel's makeStyles and mergeClasses to compose styles conditionally. The most common customizations are font weight and size for the headline — tokens.fontWeightSemibold with tokens.fontSizeBase300 and tokens.lineHeightBase300 keeps the title distinctly heavier than the body text, which normally uses tokens.fontWeightRegular and tokens.fontSizeBase200. If you must set color explicitly, prefer intent-aware tokens such as tokens.colorStatusDangerForeground1, tokens.colorStatusWarningForeground1, tokens.colorStatusSuccessForeground1, and tokens.colorNeutralForeground1, plus tokens.colorBrandForeground1 for branded emphasis. Spacing between the title and the body text is best handled by the body/bar layout using tokens.spacingVerticalXS or tokens.spacingVerticalS rather than by adding margins to the title itself. Avoid fixed widths and truncation on the title; allow it to wrap using overflow-wrap and normal white-space so long localized strings stay readable. When the bar sits on a colored or branded surface, re-check that the inherited foreground still meets contrast, and remember that textDecoration and fontFamily come from the surrounding FluentProvider typography.

## Performance

MessageBarTitle is an extremely light component — it renders one text element with a resolved slot and no internal state, effects, or event handlers, so it adds negligible render cost. The real cost in a message bar scenario comes from mounting and unmounting message bars, particularly when many bars animate in and out as a group; keep title content stable across renders and avoid recreating style objects or slot overrides on every render so memoized parents can skip work. Because the title participates in the bar's live region, changing its text frequently causes repeated screen reader announcements, which is both an accessibility and a churn concern: update the title only when the condition genuinely changes rather than on every keystroke or polling tick. In long lists of bars, prefer rendering only the messages that are currently relevant.

## Theming & Tokens

MessageBarTitle derives its appearance from the surrounding theme and from the MessageBar's intent. In the default neutral case it resolves to tokens.colorNeutralForeground1, and intent variants resolve to the corresponding status foregrounds such as tokens.colorStatusDangerForeground1, tokens.colorStatusWarningForeground1, and tokens.colorStatusSuccessForeground1, with the branded case using tokens.colorBrandForeground1. Typography comes from the theme's font family plus tokens.fontSizeBase300, tokens.lineHeightBase300, and tokens.fontWeightSemibold for the heading emphasis that distinguishes it from body text using tokens.fontSizeBase200 and tokens.fontWeightRegular. Vertical rhythm between the title and the body text is normally produced with tokens.spacingVerticalXS or tokens.spacingVerticalS, and the bar's own background and border resolve from tokens.colorNeutralBackground3, tokens.colorStatusDangerBackground1, and related status background tokens. All of these values come from the FluentProvider theme, so a custom or high-contrast theme automatically restyles the title; verify custom brand palettes still yield 4.5:1 contrast for the title text.

## Migration Notes

In v9 the message bar is a composition rather than a single component: MessageBarTitle is a dedicated child that supplies the headline, paired with MessageBarBody for the supporting text and a separate actions area for buttons. Older versions expressed the same idea as plain text inside the bar with a type value on the bar itself, so consumers migrating should move any headline text out of the body copy into MessageBarTitle and move status selection to the bar's intent rather than styling the text directly. Any custom styling that targeted the old text element should be redirected at the root slot of MessageBarTitle so it participates in the new slot and theming model.

## Edge Cases

- MessageBarTitle placed outside MessageBarBody loses the bar's intended spacing and emphasis relationship with the body text; keep it as the first child of the body for correct hierarchy.
- A title with no body text leaves the message bar looking like a plain label and gives users no detail; add supporting copy or an action whenever the condition needs explanation.
- Very long titles wrap to multiple lines and, in inline or narrow layouts, can push actions out of view; keep titles short and let the layout wrap rather than truncating with ellipsis.
- In grouped message bars where entries animate, titles inside exiting bars are unmounted along with their bar, so avoid storing state keyed to the title text if bars are added and removed rapidly.
- Because the bar announces as a live region, changing a title from a polite confirmation to an assertive error within the same mounted bar can cause confusing double announcements; unmount and remount the bar for a true status change.
- If the title is used purely as a visual duplicate of text already present elsewhere, hide it from assistive technology so the message is not announced twice.

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
