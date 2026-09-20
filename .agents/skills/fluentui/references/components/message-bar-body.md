# MessageBarBody

> **Package**: `@fluentui/react-message-bar` v9.7.1
> **Import**: `import { MessageBarBody } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

MessageBarBody is the content container inside a MessageBar. It renders a flex div that holds the primary text of a system-level message — status updates, warnings, errors, success confirmations, or informational notes — and is designed to sit alongside MessageBarTitle (the optional bold heading) and MessageBarActions (the button row) inside the bar. Because it is a plain text surface rather than an interactive widget, its job is to present readable copy that inherits the visual styling of the surrounding bar's intent, and optionally to host inline elements such as Link or secondary Button components. It exposes a root slot, an optional containerAction slot for action content that should live within the body region, and an inline flag that switches the layout between a stacked block and a flow-with-surrounding-content presentation. MessageBarBody is normally used together with MessageBar, MessageBarTitle, MessageBarActions, and MessageBarGroup, and it participates in the entry and exit animations coordinated by MessageBarGroup when animate is set to exit-only or both.

**When to use**: Use MessageBarBody whenever a MessageBar needs descriptive content — it is the required content block that carries the actual message text. Put a short heading in MessageBarTitle and the explanatory sentence, error detail, or supporting copy in MessageBarBody. Choose MessageBarBody instead of a plain Text component when the copy is part of a system-level status message that must be visually tied to an intent such as error, warning, success, or info, because the body inherits the bar's intent coloring and spacing without any extra styling. Choose it instead of Toast when the message should persist in the page layout rather than appear as a transient overlay. When the message is only one short phrase and needs no supporting detail, a MessageBar with a single MessageBarBody is sufficient; add MessageBarTitle only when the copy benefits from a distinct heading. Use the inline flag when the body must flow with adjacent content rather than occupy its own block, and use the containerAction slot when an action belongs logically inside the body region instead of the bar-level MessageBarActions area.

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

- **root**: The root slot renders the div that wraps the message text. Use it only to adjust layout-oriented styles such as padding, gap, or overflow-wrap; leave color and background to the parent MessageBar so intent styling stays intact. Because it is a required slot it is always rendered, so there is no need to guard against a missing node. `root={{ className: styles.bodySpacing }}`
- **containerAction**: Optional slot for action content that should be grouped with the body text rather than placed in the bar-level MessageBarActions area — for example an inline control that toggles the visibility of additional detail. Use it sparingly; primary and secondary button rows still belong in MessageBarActions. Any icon-only control placed here must carry an accessible label. `containerAction={<InfoButton aria-label="More details" />}`
- **inline**: Switches the body between its default block presentation and an inline presentation that flows with the surrounding content. Set it when the MessageBar is embedded in a tight layout such as a form row or a table cell where a full-width block would disrupt the rhythm. Leave it unset for standard banners and page-level messages. `inline`
- **children**: The message copy. Accepts a single element or an array of elements, which lets you compose plain text, a Link, or other inline content inside the same sentence. Keep the content to one or two sentences and avoid nesting MessageBarTitle or MessageBarActions inside the body. `<Text>Your changes were saved.</Text>`
- **intent**: Determines the semantic severity of the message and, through the parent bar, the body's color treatment. Choose error for failures requiring action, warning for potential problems, success for confirmations, and info for neutral status. Because color alone is not sufficient, pair the intent with text that states the condition. `warning`
- **politeness**: Controls how urgently the body text is announced by assistive technology: polite queues the announcement until the user is idle, assertive interrupts immediately. Use polite for informational, success, and most warning messages, and reserve assertive for urgent errors that require immediate attention. `polite`
- **shape**: Selects between square and rounded corners for the message surface. Rounded suits standalone banners within page content, while square reads better for full-bleed or edge-aligned messages. Keep the value consistent across all bars of the same type in a view. `rounded`
- **animate**: Controls the enter and exit motion coordinated by MessageBarGroup. exit-only animates a bar out when it is removed, and both animates it in and out. Use exit-only when bars appear immediately as the result of a user action so the entry does not feel delayed, and both for queues of transient messages. `exit-only`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Always render MessageBarBody as a descendant of MessageBar so it inherits the bar's intent coloring, spacing, and live-region semantics.
- Keep body copy short, specific, and actionable — state what happened and, when relevant, what the user can do next.
- Pair MessageBarTitle with MessageBarBody when the message needs a scannable heading; use the title for the summary and the body for the explanation.
- Use the intent-driven styling of the surrounding MessageBar rather than hard-coding colors on the body, so the message stays consistent across light, dark, and high-contrast themes.
- Place supplementary inline elements such as Link inside MessageBarBody only when they read as part of the sentence; otherwise move them into MessageBarActions.
- Use the containerAction slot when an action must live inside the body region, for example an inline dismiss or expand control that belongs with the text.
- Set inline when the body needs to flow with neighboring content in a compact layout instead of occupying a full-width block.

### Don'ts

- Do not add your own background, border, or box-shadow to MessageBarBody — the MessageBar supplies the surface color and stroke for its intent.
- Do not use MessageBarBody as a general-purpose text container outside of a MessageBar or MessageBarGroup context.
- Do not place a nested MessageBar inside MessageBarBody to express a second status; split the messages into separate bars or items in a MessageBarGroup.
- Do not crowd the body with a full row of buttons — reserve primary and secondary actions for MessageBarActions.
- Do not communicate severity with color alone; the body text itself must state the condition so it remains understandable without the intent color.
- Do not manually set or override aria-live or role on the body's root, because announcement behavior is governed by the parent bar's politeness setting.
- Do not duplicate the same sentence in both MessageBarTitle and MessageBarBody; each block should carry distinct information.

## Anti-Patterns

### Using MessageBarBody as a generic text container

❌ Rendering MessageBarBody outside a MessageBar produces an unstyled block with no intent color, no live-region announcement, and no spacing contract, which leads to inconsistent typography across the app.

✅ Wrap the body in a MessageBar (or place it inside a MessageBarGroup as a bar item) so it inherits intent styling and announcement behavior; for plain text outside a status context, use the Text component instead.

### Stuffing the body with every action

❌ Placing multiple buttons, links, and menus inside MessageBarBody mixes prose and controls and makes the message hard to scan, while also expanding the live-region announcement to include control labels.

✅ Keep only sentence-level inline links in the body and move primary and secondary actions into MessageBarActions; use the containerAction slot only for a single action that is logically part of the message.

### Hard-coding intent colors on the body

❌ Overriding the body's text or background color with literal values breaks the guaranteed contrast of the intent tokens and produces unreadable text in dark and high-contrast themes.

✅ Let the parent MessageBar's intent drive the colors and, when an override is unavoidable, use the matching palette tokens such as tokens.colorPaletteRedForeground1 on tokens.colorNeutralBackground1 and verify the result in every theme.

### Relying on the intent color to convey severity

❌ Users who cannot perceive the red, green, or yellow surface have no way to tell an error from a success message, and screen reader users may not hear any severity information at all.

✅ Write the condition explicitly in the body copy, for example stating that the save failed or succeeded, and keep the intent color as a reinforcement rather than the sole signal.

### Clipping long message text

❌ Fixed heights, truncation, or nowrap settings on the body can silently hide error details, which is especially harmful for validation messages that users must read to recover.

✅ Allow the body to wrap naturally, set overflow-wrap for unbroken strings such as URLs or codes, and avoid fixed heights so the message remains fully visible at larger text sizes.

## Accessibility

**Requirements**: MessageBarBody renders plain text, so it must meet WCAG 2.2 AA contrast minimums (4.5:1 for normal text, 3:1 for large text) against the MessageBar surface for every intent; the Fluent intent tokens are authored to satisfy this, so custom color overrides are the main risk. Message must not rely on color alone (WCAG 1.4.1) — the text itself should name the condition. Body copy must remain legible when text is zoomed to 200% (WCAG 1.4.4) and must not be clipped when users apply larger font sizes, so avoid fixed heights and text-overflow clipping on the root. Announcement of the body text is provided by the parent MessageBar's live region, driven by its politeness value; assertive is appropriate only for urgent errors, while polite suits informational and success messages. Interactive elements placed inside the body must expose accessible names and visible focus indicators.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and out of any focusable elements placed inside MessageBarBody, such as Link or Button; the body's own root div is not focusable. |
| `Enter` | Activates a focused inline Link or Button rendered inside the body. |
| `Space` | Activates a focused inline Button rendered inside the body. |
| `Shift+Tab` | Moves focus backwards to the previous focusable element before the body's interactive content. |

**ARIA**: aria-live (set on the surrounding MessageBar and driven by its politeness value of polite or assertive), role="status" or role="alert" semantics contributed by the parent MessageBar for the corresponding politeness setting, aria-atomic on the live region so the whole message is announced together, aria-label on any icon-only control placed in the containerAction slot, aria-hidden on purely decorative icons inside the body so they are skipped by screen readers

**Screen Reader**: MessageBarBody itself is not a landmark or widget, so screen readers simply read its text content in document order after any MessageBarTitle. When the message is inserted or updated, the parent MessageBar's live region announces the body text according to politeness: polite queues the announcement until the user is idle, while assertive interrupts current speech for urgent errors. Because the body participates in an atomic live region, the full sentence is read rather than fragments. Inline links and buttons inside the body appear in the tab order and are announced with their role and accessible name; decorative icons inside the body are ignored when marked aria-hidden.

## Styling

MessageBarBody is styled almost entirely by the tokens the parent MessageBar applies, so most customization should be limited to spacing and typography on the root slot. Apply tokens.spacingVerticalXS or tokens.spacingVerticalS for vertical rhythm between a title and the body, and tokens.spacingHorizontalS or tokens.spacingHorizontalM for padding and gaps around the containerAction slot. Body text typography should follow tokens.fontSizeBase300 with tokens.lineHeightBase300, and tokens.fontWeightRegular for supporting copy; use tokens.fontWeightSemibold only inside MessageBarTitle, not the body. If you must override color, prefer intent-aware tokens such as tokens.colorNeutralForeground1 for info messages, tokens.colorPaletteRedForeground1 for errors, tokens.colorPaletteGreenForeground1 for success, and tokens.colorPaletteYellowForeground1 for warnings, and always verify against the matching surface token (for example tokens.colorNeutralBackground1) in dark and high-contrast themes. Long unbroken strings such as URLs or error codes need overflow-wrap set on the root so the body wraps instead of overflowing the bar. Define styles with makeStyles at module scope rather than inline style objects so Griffel can reuse the atomic classes.

## Performance

MessageBarBody is a lightweight wrapper with no internal state, effects, or event handlers of its own, so rendering cost is dominated by the parent MessageBar's intent styling and any interactive content placed inside it. Styles should be created once with makeStyles at module scope; recreating style objects or passing new inline style objects on each render defeats Griffel's atomic class caching and forces unnecessary class computation. When several messages are rendered together inside a MessageBarGroup with animate set, each exiting bar keeps an animated wrapper alive until its transition completes, so large queues of transient messages increase layout work — batch or cap the number of simultaneously visible bars. Avoid rebuilding the children array on every render if it contains memoized inline elements, and keep heavy custom components out of the body when only short text is needed.

## Theming & Tokens

MessageBarBody does not define its own palette; it consumes the tokens applied by the surrounding MessageBar and FluentProvider, so switching between light, dark, and high-contrast themes automatically re-resolves every value. Foreground color follows intent-aware tokens such as tokens.colorNeutralForeground1, tokens.colorPaletteRedForeground1, tokens.colorPaletteGreenForeground1, and tokens.colorPaletteYellowForeground1, while the surface behind it comes from tokens.colorNeutralBackground1 and related background tokens, with the outline drawn from tokens.colorNeutralStroke1 in high-contrast themes. Corner rounding for the shape prop is expressed through tokens.borderRadiusMedium for rounded and tokens.borderRadiusNone for square, and spacing uses tokens.spacingVerticalXS, tokens.spacingVerticalS, tokens.spacingHorizontalS, and tokens.spacingHorizontalM. Typography responds to tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.lineHeightBase300, and tokens.fontWeightRegular. Brand-level custom themes that remap these tokens flow straight through to the body text without any component-level overrides.

## Migration Notes

In v9 the monolithic v8 MessageBar was split into composable parts: MessageBar, MessageBarBody, MessageBarTitle, MessageBarActions, and MessageBarGroup. MessageBarBody is the new dedicated slot for the message copy that v8 rendered directly as children of MessageBar, so markup that previously placed text directly inside MessageBar should now wrap that text in MessageBarBody. Layout and announcement concerns such as inline, shape, intent, politeness, and animate belong to the bar and its group rather than to the body alone, and standalone MessageBarBody markup outside a MessageBar will render but will not receive intent styling or live-region behavior.

## Edge Cases

- Rendered outside a MessageBar, MessageBarBody produces a plain div with none of the intent colors and no live-region announcement, so it is silently inaccessible as a status message.
- The inline flag changes the body's layout behavior; mixing it with a full message that also uses MessageBarTitle and MessageBarActions can produce cramped or overlapping layouts, so preview inline usage in the target container.
- Very long unbroken strings such as URLs, file paths, or error codes will overflow the bar unless overflow-wrap is set on the root slot.
- Because announcement is controlled by the parent bar's politeness value, changing text inside the body of an already-rendered bar may not be re-announced if the live region is atomic and the bar is not re-inserted.
- When a bar is removed inside a MessageBarGroup with animate set, the body remains mounted during the exit transition, so any interactive content inside it should not perform work on unmount-sensitive state.
- Decorative icons placed inside the body are read aloud by screen readers unless they are marked aria-hidden, which can make the message harder to follow.

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
