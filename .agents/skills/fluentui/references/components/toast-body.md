# ToastBody

> **Package**: `@fluentui/react-toast` v9.8.0
> **Import**: `import { ToastBody } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

ToastBody is the content container of a Fluent UI React v9 toast notification. It renders inside a Toast and holds the descriptive text of the notification, with an optional subtitle line rendered through its subtitle slot. The component exposes a required root slot (a div) that wraps all body content and an optional subtitle slot (also a div) for a secondary, lower-emphasis line of text. ToastBody itself contributes no layout chrome, background, or borders — those live on the surrounding Toast surface — so it is intentionally minimal: it exists to give toast copy a stable, themeable, and styleable target that the Toaster and Toast machinery can measure and announce. It participates in the toast lifecycle through context-provided values such as visible, announce, intent, tryRestoreFocus, inline, and appearance, which are supplied by the parent Toast/Toaster rather than authored directly on the body. Because toasts are transient feedback, ToastBody content is expected to be short, plain, and readable at a glance.

**When to use**: Use ToastBody whenever you render a Toast and need to present supporting copy beneath the toast title — for example confirming that a document was saved, describing what an undo action will revert, or explaining why an operation failed. Prefer ToastBody for transient, non-blocking feedback that disappears on its own; if the message must persist until the user acknowledges or acts on it, use MessageBar instead. If the message blocks a workflow or requires a decision, use Dialog rather than a toast. Use the subtitle slot for a short secondary line, and keep body text to a sentence or two — anything longer belongs in a surface the user can revisit, such as a panel or a details page.

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

- **root**: Required. The div that wraps all body content. Use it to attach your own className for typography and spacing, and to pass through DOM attributes such as aria-label when the body needs an explicit accessible name. Keep children as plain text or simple inline content. `className={styles.toastBody} with aria-label for a custom accessible name`
- **subtitle**: Optional. A second div rendered as a lower-emphasis line under the primary text. Use it for a file name, timestamp, error code, or other supporting detail. Omit it entirely when there is nothing to add, rather than passing an empty value, so the extra line and its spacing do not appear. `Report Q3-2024.pdf saved at 10:42 AM`
- **visible**: Controls whether the toast is currently shown. It is supplied by the Toast/Toaster context and should not be authored on ToastBody; drive visibility by dispatching or dismissing the toast instead. `true`
- **announce**: The announcement callback used by the toast to publish its text to the live region. Treat it as read-only context: toasts are announced automatically, and calling it manually produces duplicate screen reader output. `provided by the Toaster context`
- **intent**: Indicates the semantic intent of the toast (for example success, error, warning, or info) and flows down from the Toast. Use it to keep your body copy consistent with the intent, but read it rather than overwriting it from the body. `success`
- **tryRestoreFocus**: A callback invoked when a toast is dismissed so focus returns to a sensible element. It comes from the toast lifecycle; do not call or replace it from the body, and make sure the element that triggered the toast still exists so focus restoration has a valid target. `provided by the Toast context`
- **inline**: Marks the toast as rendered inline inside the page flow rather than in the floating toast region. This is a context value, and inline toasts behave differently with respect to dismissal and focus, so leave it to the Toast rather than setting it on the body. `false`
- **appearance**: The background appearance context value that tells the body which background it is drawn on so it can pick the right foreground colors. It is inherited from the surrounding surface or Toast; match your custom styles to it instead of assuming a light background. `brand or inverted appearance values supplied by context`
- **media**: An optional div slot for media such as an icon or avatar that sits with the toast content. It is positioned by the toast layout rather than by the body, so provide media through the toast-level API and let ToastBody own only the text. `an icon element supplied by the toast layout`
- **action**: An optional div slot for a single action control associated with the toast. Because it is managed by the toast layout and focus order, do not squeeze actions into the body text or set this slot directly on ToastBody. `an undo or dismiss control supplied by the toast layout`
- **disableButtonEnhancement**: Controls whether anchors and buttons inside the toast content are enhanced into Fluent Button components. Keep the default unless you deliberately render raw anchor markup and need to opt out of the styling and behavior upgrade. `false`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |
| `subtitle` | — | No | — |

## Best Practices

### Do's

- Keep body copy to a single short sentence or at most two, since the toast auto-dismisses and users cannot re-read it.
- Use the subtitle slot for the secondary detail (a file name, a timestamp, an error code) and keep the primary body text for the outcome itself.
- Pass your own className to the root slot when you need spacing or typography adjustments instead of wrapping the body in extra divs.
- Let the surrounding Toast and Toaster supply visible, announce, intent, tryRestoreFocus, and inline — author only the content slots on ToastBody.
- Match the body's tone to the intent so screen reader announcements and visual styling agree, for example describing the failure plainly for an error intent toast.
- Provide stable, human-readable text rather than identifiers, because the body is what assistive technology reads out when the toast appears.

### Don'ts

- Don't place long paragraphs, rich layouts, forms, or scrollable content inside ToastBody — it is transient and cannot be revisited.
- Don't add multiple competing calls to action inside the body text; put a single action in the toast's action slot or footer area.
- Don't manually set visible, announce, tryRestoreFocus, or inline on ToastBody; these are driven by the parent Toast and Toaster and overriding them desynchronizes dismissal and focus restoration.
- Don't duplicate the toast title text in the body, since both are announced and read together by the live region.
- Don't render ToastBody outside of a Toast, as it depends on toast context values and will not behave or style correctly in isolation.
- Don't rely on color alone to convey intent; the body copy should state clearly what happened so it is understandable without visual styling.

## Anti-Patterns

### Writing a paragraph in the body

❌ ToastBody is transient and auto-dismisses, so multi-sentence or multi-paragraph copy scrolled or truncated away is unreadable to both sighted users and screen reader users who cannot revisit it.

✅ Summarize the outcome in one short sentence in the body, move secondary detail into the subtitle slot, and link or route the user to a persistent surface such as a panel or details page for the full explanation.

### Adding buttons or links inside the body text

❌ Embedding multiple controls in the body makes them part of the announced text, creates awkward tab order inside a transient element, and competes with the toast's intended single action.

✅ Keep the body as text and expose at most one action through the toast action area, so keyboard and screen reader users have a single, predictable target.

### Overriding toast lifecycle props from the body

❌ Setting visible, announce, inline, or tryRestoreFocus manually or calling the announcement callback directly desynchronizes dismissal timing and produces duplicate or missing screen reader announcements.

✅ Let the Toast and Toaster context own the lifecycle. Control what the user sees by changing the body and subtitle content, and dismiss or dispatch toasts through the Toaster API.

### Rendering dynamic body text while the toast is open

❌ Changing the body text on every re-render (for example a live counter or elapsed timer) causes the live region to re-announce repeatedly, interrupting the user's screen reader.

✅ Freeze the body text for the lifetime of a given toast; if values must update, render them in a non-live part of the UI or issue a new toast only when the message genuinely changes.

### Duplicating intent through color only

❌ Relying on the toast background and icon color to convey success or failure leaves users with color vision deficiency or screen readers without the meaning.

✅ State the outcome in the body text itself and keep the intent-aligned styling as reinforcement rather than the sole carrier of meaning.

## Accessibility

**Requirements**: ToastBody inherits the semantics of the toast container it renders in: the Toaster places toasts in a live region so new content is announced without moving focus. Body copy must meet WCAG contrast minimums (4.5:1 for normal text) against the toast background for every appearance and intent combination, and the text must remain readable when the user has increased the browser font size because the component uses relative type tokens. Ensure any interactive element rendered alongside the body (typically in the toast action area) has a visible focus indicator, an accessible name, and a touch target of at least 24 by 24 CSS pixels, and never trap focus inside the toast. Because the toast is announced automatically, the body text must be meaningful on its own, without relying on visual context the screen reader user cannot perceive.

| Key | Action |
| --- | --- |
| `F6` | Moves focus into the toast region so a keyboard user can reach the most recent toast, which contains this body. |
| `Tab` | Moves focus to the next focusable element inside or after the toast body, such as a link or the toast action button. |
| `Shift+Tab` | Moves focus to the previous focusable element, including back out of the toast body content. |
| `Enter` | Activates a link or button placed within the body content when that element has focus. |
| `Space` | Activates a focused button or control placed within the body content, where the control supports it. |
| `Escape` | Dismisses the toast when a dismiss affordance is present in the toast, returning focus using the focus restoration behavior supplied through tryRestoreFocus. |

**ARIA**: aria-live (managed by the Toaster region that hosts the toast), aria-atomic (set on the toast region so the whole toast is read as a unit), role="status" or role="alert" on the toast region, depending on how urgent the intent is, aria-labelledby / aria-describedby (used by the toast to associate title and body text), aria-hidden on purely decorative elements placed near the body, aria-label or aria-labelledby passed through the root slot when the body needs its own accessible name

**Screen Reader**: When a toast containing ToastBody appears, the Toaster's live region announces the toast automatically without requiring the user to move focus. The title and body text are typically announced together as a single message, followed by any subtitle content, so screen reader users hear the outcome and its supporting detail in one utterance. Because the region is polite by default, the announcement is queued behind the user's current speech rather than interrupting it; more urgent intents may be announced assertively. Interactive elements placed inside or adjacent to the body are not announced as part of the message and must be reached with normal navigation. Re-renders that do not change the text are not re-announced, but changing the body text while the toast is visible can trigger a second announcement.

## Styling

ToastBody is styled with Griffel, so create styles with makeStyles and apply them to the root and subtitle slots through the className property of each slot, combining them with mergeClasses when you also want a shared base style. Control vertical rhythm with tokens.spacingVerticalXS or tokens.spacingVerticalS between the body text and the subtitle line, and horizontal padding with tokens.spacingHorizontalM if the toast padding needs adjusting. Primary body text should use tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.lineHeightBase300, and tokens.fontWeightRegular, while the subtitle reads better in tokens.fontSizeBase200 with tokens.lineHeightBase200 and a lower-emphasis color. Never hard-code colors or pixel values — use tokens.colorNeutralForeground1 for the body on a neutral surface and tokens.colorNeutralForeground2 for the subtitle. Because the component only renders two divs, avoid adding wrapper divs purely for spacing; style the slots directly so the DOM stays shallow and the toast remains easy to measure and animate.

## Performance

ToastBody is a very small render tree — a root div and an optional subtitle div — so its own cost is negligible. The real cost is churn in the toast region: mounting and unmounting toasts triggers portal and layout work, and expensive content placed inside the body (images, charts, deeply nested components, or heavy data formatting) is paid on every toast. Keep the body limited to plain text and pre-compute any formatted values before the toast is dispatched. Avoid binding the body content to rapidly changing state, since each change re-renders the toast and can queue additional live-region announcements, and memoize the callback that creates the toast so an unstable callback reference does not cause repeated re-renders of the surrounding component.

## Theming & Tokens

ToastBody consumes Fluent design tokens rather than fixed values, so it adapts automatically under FluentProvider and to the appearance context it receives. Text defaults derive from tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.lineHeightBase300, and tokens.fontWeightRegular, with tokens.colorNeutralForeground1 for the primary line; the subtitle drops to tokens.fontSizeBase200 with tokens.colorNeutralForeground2. On an inverted toast surface the body text should resolve to tokens.colorNeutralForegroundInverted against tokens.colorNeutralBackgroundInverted, and on a brand background to tokens.colorNeutralForegroundOnBrand against tokens.colorBrandBackground. Intent-driven emphasis should use palette foreground tokens such as tokens.colorPaletteGreenForeground1 for success, tokens.colorPaletteRedForeground1 for error, and tokens.colorPaletteYellowForeground1 for warning, with the matching background tokens on the toast surface. Spacing between the body and subtitle comes from tokens.spacingVerticalXS or tokens.spacingVerticalS, and any animation on the toast itself uses tokens.durationNormal with tokens.curveEasyEase.

## Migration Notes

Version 8 of Fluent UI React had no first-class Toast component, so teams typically built toasts from Callout, MessageBar, or a custom portal with their own aria-live region and styling. Version 9 introduces ToastBody as a slot-based component: you now get a root slot and an explicit subtitle slot instead of hand-rolled text containers, and all appearance, intent, visibility, and announcement behavior comes from the Toast and Toaster context rather than component props. The trade-off is that ToastBody must be rendered inside a Toast — there is no standalone mode — so custom implementations that rendered a styled text block on their own need to be moved under Toast and Toaster. Styling also moves from CSS or SCSS class overrides to Griffel styles with design tokens applied through slot classNames.

## Edge Cases

- An empty or undefined subtitle slot still renders a div, which can leave unexplained vertical space; only pass the subtitle when there is real content.
- Very long unbroken strings such as URLs or file paths do not wrap by default and can overflow the toast surface; add word-breaking styles to the root slot.
- Toasts with an error or other urgent intent may be announced assertively, so identical body text fired in quick succession can interrupt the user repeatedly.
- Inline toasts do not follow the same dismissal and focus-restoration path as floating toasts, so tryRestoreFocus may have no meaningful target when the trigger element has been unmounted.
- Rendering ToastBody outside a Toast leaves the context values such as visible, intent, and announce unavailable, so the component will not behave as expected.
- Dynamic timestamps or counters in the body change the live-region content and trigger re-announcements while the toast is still visible.
- High-contrast and forced-colors modes strip background colors, so body copy must remain legible using system colors alone.

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
