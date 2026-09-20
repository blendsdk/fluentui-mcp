# ToastTitle

> **Package**: `@fluentui/react-toast` v9.8.0
> **Import**: `import { ToastTitle } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

ToastTitle is the heading element that renders inside a Toast notification. It provides the short, scannable headline for a transient system message and lays out its content through a required root slot plus optional media, subtitle, and action slots. The root slot holds the title text itself, media typically hosts a leading icon or status glyph, subtitle carries a secondary line of supporting copy beneath the title, and action hosts a single trailing control such as a dismiss button, an undo link, or a single call to action. ToastTitle does not manage its own lifecycle: it receives visible, intent, announce, tryRestoreFocus, and appearance from the surrounding Toast and Toaster, which own the timing, animation, live-region announcement, and focus restoration for the notification. Styling is driven by Griffel tokens so the title inherits the correct typography and foreground colors for the current theme and for the intent of the toast it belongs to.

**When to use**: Use ToastTitle whenever you surface a non-blocking, time-sensitive notification through a Toaster: confirmations of completed actions, background failures, connection state changes, or offers of a reversible action such as Undo. It is the correct component for the headline of a toast, paired with ToastBody for explanatory copy and ToastFooter for actions, links, and metadata. Do not use ToastTitle for inline, persistent page-level messaging that should remain in the layout flow — MessageBar is the right choice there because it is anchored to page content and stays until dismissed. Do not use it for content that requires an explicit user decision before proceeding; that is Dialog or Drawer territory. Do not use it for a passive status readout that updates continuously (a progress indicator or a live counter), because toasts are announced once and then time out. ToastTitle is also not a substitute for a heading in page content; it is scoped to a single toast surface and is announced as part of that toast rather than contributing to the document outline.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `action` | `Slot<'div'>` | — | No | — |
| `announce` | `ToastAnnounce` | — | Yes | — |
| `announce` | `ToastAnnounce` | — | No | — |
| `appearance` | `BackgroundAppearanceContextValue` | — | No | — |
| `disableButtonEnhancement` | `boolean` | — | No | — |
| `inline` | `boolean` | — | No | — |
| `intent` | `ToastIntent \| undefined` | — | Yes | — |
| `media` | `Slot<'div'>` | — | No | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `NonNullable<Slot<'div'>>` | — | Yes | — |
| `subtitle` | `Slot<'div'>` | — | No | — |
| `tryRestoreFocus` | `() => void` | — | Yes | — |
| `visible` | `boolean` | — | Yes | — |

### Prop Guidance

- **root**: Required slot that renders the title element and holds the headline text. Pass the human-readable title as children and use its className to adjust typography. Keep the content to one short phrase; move anything longer into the subtitle slot or ToastBody. `File uploaded successfully`
- **subtitle**: Optional slot rendered beneath the title for a single line of supporting copy, such as a filename, a timestamp, or a short reason. It is announced after the title as part of the same atomic live region, so keep it brief and do not duplicate the title text. `report-q4.pdf • 2.4 MB`
- **media**: Optional leading slot for an icon or status glyph that reinforces the intent of the toast. Mark purely decorative graphics as hidden from assistive technology so the headline is not read twice. `A checkmark icon for a success toast`
- **action**: Optional trailing slot for one control, such as a dismiss button or an Undo link. Prefer a single action per toast; if you need several, use the ToastFooter and its button group instead of crowding the title. `A single Undo button`
- **visible**: Supplied by the parent Toast to drive enter and exit animation state. Do not set or toggle it directly from the title; let the Toaster manage mounting and unmounting so the live region is not updated while the toast is mid-transition. `true while the toast is on screen`
- **announce**: Inherited from the parent Toast and determines whether the title is announced politely after the current utterance or assertively as an interruption. Leave it polite for success and informational toasts and reserve assertive for errors that require immediate attention. `polite`
- **intent**: Inherited from the parent Toast and drives the color treatment and icon associated with the notification. Set it on the Toast instead of recoloring the title so the whole surface, including the title, stays coherent. `success`
- **tryRestoreFocus**: Inherited from the parent Toast. Returns focus to the element that triggered the notification after the toast is dismissed, which matters most when the action slot contained a focused control that is being removed from the DOM. `Returns focus to the Save button after the toast closes`
- **inline**: Renders the title in the normal layout flow rather than in a positioned layer. Use it only when the surrounding Toast is also rendered inline, such as inside an embedded or app-rail notification area; mixing inline and layered toasts produces inconsistent spacing and stacking. `true for an inline notification strip`
- **appearance**: Provides the background appearance context the title uses to pick appropriate foreground colors. Prefer letting it flow from the enclosing surface or FluentProvider so the title stays legible on branded, neutral, or inverted backgrounds. `Inherited from the surrounding toast surface`
- **disableButtonEnhancement**: Inherited from the surrounding toast context and disables the automatic upgrade of plain buttons into Fluent-styled buttons. Turn it off only when you are deliberately rendering non-enhanced controls inside the notification. `false`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `action` | — | No | — |
| `media` | — | No | — |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Keep the root slot content to a single short line — a headline, not a sentence — so it can be read at a glance and announced quickly by assistive technology.
- Render ToastTitle inside a Toast that is mounted and managed by a Toaster so that intent, timing, announcement politeness, and focus restoration are handled for you.
- Use the action slot for a single trailing control, such as a dismiss button or one Undo link, and let it sit outside the title text rather than embedded inside it.
- Use the subtitle slot for a second line of supporting detail instead of appending extra clauses to the title text.
- Use the media slot for a decorative or intent-relevant icon, and keep it small so it does not compete with the headline.
- Always give the root slot real text so the live region has something meaningful to announce; a toast that contains only an icon or only an action is effectively silent.
- Set intent on the Toast rather than recoloring the title, so the icon, the surface treatment, and the announcement behavior stay consistent.
- Reserve assertive announcements for genuinely urgent failures and let confirmations announce politely.

### Don'ts

- Don't put paragraphs, lists, or multi-sentence explanations in the title; move that content to ToastBody.
- Don't nest buttons, links, or other focusable elements inside the title text itself — the action slot exists for that purpose.
- Don't render ToastTitle standalone outside a Toast and Toaster, since the visible, intent, announce, tryRestoreFocus, and appearance values it depends on come from the parent notification.
- Don't hard-code foreground colors on the root or subtitle that fight the intent palette, because they will break contrast in dark, high-contrast, or branded themes.
- Don't communicate intent through color alone — pair a colored title with an icon in the media slot or with explicit wording.
- Don't toggle the visible flag yourself; the Toaster owns the enter and exit lifecycle and the corresponding animations.
- Don't queue several simultaneous toasts with identical titles, because screen reader users cannot distinguish the repeated announcements.
- Don't use ToastTitle as a page heading or section heading; it has no meaning outside the toast it belongs to.

## Anti-Patterns

### Interactive content embedded in the title text

❌ Placing a link or button inside the root slot mixes focusable controls into the live region's announced text, produces unpredictable tab order, and can cause the action to be read mid-sentence rather than as a distinct control.

✅ Keep the root slot as plain text and move every focusable control into the action slot or, when more than one control is needed, into the ToastFooter.

### Rendering ToastTitle outside a Toast and Toaster

❌ ToastTitle relies on the parent notification for visible, intent, announce, tryRestoreFocus, and appearance. Rendered on its own it loses its live-region semantics, its timing, and its focus restoration, and the user may never perceive the message at all.

✅ Always mount ToastTitle as a child of a Toast that is registered with a Toaster, so announcement, dismissal timing, and focus behavior are handled by the notification system.

### Overriding intent colors directly on the title

❌ Hand-setting foreground colors on the root or subtitle fights the intent-driven palette and typically fails contrast in dark, high-contrast, or branded themes, while the toast icon still reflects the original intent.

✅ Choose the intent on the Toast and use semantic state foreground tokens for any additional emphasis, verifying contrast in every theme the app supports.

### Long-form copy in the headline

❌ Multi-sentence titles are hard to scan, wrap to several lines that push the trailing action out of alignment, and slow down live-region announcements so the toast may be removed before it has been fully read.

✅ Reduce the root slot to a short headline and move detail into the subtitle slot or ToastBody, keeping the toast readable within its timeout.

### Title-only toasts for every event

❌ Firing a toast for every background event, with identical titles and no body or action, floods the live region with indistinguishable announcements and trains users to ignore notifications.

✅ Reserve toasts for events that are important, time-sensitive, or reversible, and give each one a distinct title plus, where relevant, an action such as Undo.

## Accessibility

**Requirements**: ToastTitle participates in a status message, so WCAG 4.1.3 (Status Messages) applies: the title text must be programmatically determinable without moving focus. Because it is the primary text of the notification, it must meet WCAG 1.4.3 contrast minimums (4.5:1 for normal-size text, 3:1 for large text) against the toast background, and intent must not be conveyed by color alone (WCAG 1.4.1) — pair the title with an icon in the media slot or with explicit wording. Any interactive control placed in the action slot must be reachable and operable by keyboard (WCAG 2.1.1) with a visible focus indicator (WCAG 2.4.7). Toasts that auto-dismiss must still satisfy WCAG 2.2.1 (Timing Adjustable): give users a way to dismiss or act, keep the timeout generous, and pause the timer while the toast is hovered or focused so keyboard users are not rushed. The content inside the title must remain zoomable and reflowable (WCAG 1.4.4, 1.4.10) when text scales up to 200 percent, which is why the title should stay short. Decorative icons placed in the media slot should be hidden from assistive technology so the title text is not double-announced.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus from the page into the toast and onto any focusable control placed in the action slot, such as a dismiss button or an Undo link. |
| `Shift+Tab` | Moves focus backward out of the toast, typically returning to the element that triggered the notification. |
| `Enter` | Activates a button or link placed in the action slot while it has focus. |
| `Space` | Activates a focused button placed in the action slot, matching native button behavior. |
| `Escape` | Dismisses the toast when the toast is configured to be dismissible, which also causes focus to be restored through tryRestoreFocus. |

**ARIA**: aria-live, role="status", role="alert", aria-atomic, aria-labelledby, aria-describedby, aria-label, aria-hidden

**Screen Reader**: The title is exposed as the accessible name of the toast: the toast container is associated with the ToastTitle root through aria-labelledby, while ToastBody content is associated through aria-describedby, so screen readers announce the headline first and then the supporting detail. The whole toast lives in a live region whose politeness is derived from the announce value, so a polite title waits for the screen reader to finish its current utterance before it is read, while an assertive title interrupts immediately. Because the region is atomic, the entire title (and its subtitle, if present) is re-announced as a single unit rather than word by word. Content in the media slot is decorative and should be hidden from the accessibility tree, and content in the action slot is announced only when the user navigates to it, not as part of the headline. When the toast auto-dismisses, some screen reader users may miss it entirely, so timeouts should be long enough to read the title and subtitle and the toast should stay in the tree long enough for the announcement to complete.

## Styling

Style ToastTitle through the className of its slots rather than by wrapping it in extra divs, and define styles once at module scope with makeStyles so a new style object is not generated on every render. The root slot accepts tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.fontWeightSemibold, tokens.lineHeightBase300, and tokens.colorNeutralForeground1 for the default headline treatment; the subtitle slot reads better at tokens.fontSizeBase200 or tokens.fontSizeBase300 with tokens.colorNeutralForeground2 so it recedes behind the title. Use tokens.spacingHorizontalS and tokens.spacingHorizontalXS for the gap between the media slot, the title text, and the action slot, and tokens.spacingVerticalXXS for the gap between the title and the subtitle line. When you need an intent-tinted headline without overriding the toast surface, prefer the state foreground tokens such as tokens.colorPaletteRedForeground1, tokens.colorPaletteGreenForeground1, or tokens.colorBrandForeground1, and verify contrast against the toast background in both light and dark themes. Keep the root layout as a row with the media, text, and action areas intact: overriding the display or flex properties on the root slot is the most common cause of misaligned trailing actions when a title wraps to two lines.

## Performance

ToastTitle is a small, presentational component and is cheap to render, but each mounted toast adds a subtree to the document, so the cost is dominated by how many toasts are alive at once rather than by the title itself. Define makeStyles results at module scope and reuse them across toasts instead of creating style objects inside the render path, and memoize handler functions passed to action slot controls so that a Toaster re-render does not invalidate every visible toast. Because the Toaster maintains the queue and the live region, avoid re-rendering it on high-frequency state such as scroll position, timers, or form keystrokes; drive it only from discrete events that actually enqueue or dismiss a toast. Keep the media slot's content to an icon component rather than an image that must load, so the title's layout does not shift after the toast appears.

## Theming & Tokens

ToastTitle draws its default typography and foreground colors from the active FluentProvider theme, using tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.fontWeightSemibold, tokens.lineHeightBase300, and tokens.colorNeutralForeground1 for the headline, with tokens.colorNeutralForeground2 available for the subtitle. The intent of the enclosing Toast supplies the colored treatment, so success, warning, error, and informational toasts resolve through the theme's palette tokens such as tokens.colorPaletteGreenForeground1, tokens.colorPaletteYellowForeground1, and tokens.colorPaletteRedForeground1 rather than hard-coded values. The appearance value it receives from the surrounding surface lets it switch to appropriate inverted or branded foreground tokens when the toast sits on a non-neutral background. Spacing between the media, text, and action areas comes from tokens.spacingHorizontal and tokens.spacingVertical scales, and high-contrast and forced-colors modes remap these foreground tokens to system colors, which is another reason to avoid literal color values.

## Edge Cases

- A toast whose title contains no text at all — for example only an icon in the media slot and a dismiss button in the action slot — produces an effectively empty live-region announcement, so always provide real headline text in the root slot.
- Titles that wrap to two or more lines can push the trailing action slot out of vertical alignment with the media and text, especially if the root layout properties are overridden; test with the longest realistic title and with 200 percent text zoom.
- Rapidly enqueuing several toasts with the same title creates repeated, indistinguishable announcements; vary the title text or coalesce the events into a single toast.
- The subtitle is not used as the accessible name of the toast, so critical information must not live only in the subtitle; the name association points at the root slot content.
- When inline is used without the surrounding toast also being inline, the title is placed in the normal flow while the toast surface is layered, producing inconsistent positioning and spacing.
- A title that is still animating out should not be re-used for a new message, because the live region text changes while the region is visually transitioning, which screen readers may skip or read twice.
- If the toast auto-dismisses on a short timer, users reading a longer title or subtitle may lose the message before finishing; keep timeouts generous and pause them on hover and focus.

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
