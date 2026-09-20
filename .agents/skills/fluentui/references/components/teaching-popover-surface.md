# TeachingPopoverSurface

> **Package**: `@fluentui/react-teaching-popover` v9.7.0
> **Import**: `import { TeachingPopoverSurface } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

TeachingPopoverSurface is the visual container — the bubble itself — of the TeachingPopover family. It renders the elevated, themed panel that holds the header, body copy, optional media, carousel progress, and the footer actions that walk a person through a short, multi-step educational experience. Because a TeachingPopover can host a carousel of steps, the surface is where per-step content, step navigation controls (previous/next buttons and page counts), and the final call-to-action are composed and painted as one continuous panel. It participates in the popover's open/close lifecycle, focus management, and Escape-to-dismiss behavior, and it is styled entirely through Fluent theme tokens so it adapts to brand, dark, and high-contrast themes. The surface is content-driven: the children you place inside it, plus the render functions and slots it exposes (root, icon, dismissButton, and the navigation/page-count render functions), determine everything a person sees and interacts with on each step.

**When to use**: Use TeachingPopoverSurface when you are introducing a feature, walking a user through a new flow, or surfacing a short sequence of tips that benefits from more room and more structure than a plain Popover or Tooltip allows. It is the right choice when the guidance is multi-step (a tour with previous/next navigation and a final confirmation), when you want the visual weight of a branded or elevated card anchored to a trigger, or when you need a footer of actions such as 'Skip', 'Next', and 'Got it'. Prefer the plain Popover with PopoverSurface for simple, single-idea overlays, Tooltip for one-line hints that need no interaction, and Dialog or Drawer when the task is blocking, requires a form, or needs long scrollable content. TeachingPopoverSurface is for optional, dismissible education — not for critical information the user cannot proceed without, and not as a navigation surface.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `altText` | `React_2.ReactNode` | — | Yes | — |
| `children` | `NavButtonRenderFunction` | — | Yes | — |
| `children` | `TeachingPopoverCarouselPageCountRenderFunction` | — | Yes | — |
| `dismissButton` | `Slot<'button'>` | — | No | — |
| `dismissButton` | `Slot<'button'>` | — | No | — |
| `finalStepText` | `string` | — | Yes | — |
| `footerLayout` | `'horizontal' \| 'vertical'` | — | No | — |
| `footerLayout` | `'horizontal' \| 'vertical'` | — | No | — |
| `handleButtonClick` | `(event: React_2.MouseEvent<HTMLButtonElement & HTMLAnchorElement & HTMLDivElement>) => void` | — | Yes | — |
| `icon` | `Slot<'div'>` | — | No | — |
| `initialStepText` | `string` | — | Yes | — |
| `layout` | `TeachingPopoverCarouselFooterLayout` | — | No | — |
| `mediaLength` | `'short' \| 'medium' \| 'tall'` | — | No | — |
| `navType` | `'next' \| 'prev'` | — | Yes | — |
| `root` | `NonNullable<Slot<ARIAButtonSlotProps<'a'>>>` | — | Yes | — |
| `root` | `NonNullable<Slot<'div'>>` | — | Yes | — |
| `root` | `Slot<'div', 'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'>` | — | Yes | — |
| `root` | `Slot<'h2', 'h1' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'div'>` | — | Yes | — |
| `value` | `string` | — | Yes | — |

### Prop Guidance

- **mediaLength**: Sets the vertical footprint reserved for media within a step ('short', 'medium', or 'tall'). Pick one value for the entire tour and reuse it so the surface does not resize while a person moves between steps; use 'tall' only when imagery is essential to understanding the step. `medium`
- **value**: The text content a navigation control inside the surface renders, such as the visible label of a step or goto control. Keep it short and unambiguous, and make sure the visible label matches whatever accessible name the control receives. `Step 2`
- **navType**: Declares whether a navigation control moves the tour forward ('next') or backward ('prev'). Keep previous before next in DOM order so keyboard tab order matches the visual reading order, and mirror the iconography for right-to-left layouts. `next`
- **altText**: The text alternative for non-decorative media rendered inside the surface, such as an illustration or screenshot that demonstrates the feature. Describe what the visual communicates in the context of the step, not the literal pixels, and keep it brief; omit it for purely decorative imagery. `A screenshot of the new sharing menu with the Share button highlighted`
- **layout**: Controls how the carousel footer controls are arranged inside the surface. Choose the layout that keeps the primary action last in reading order and that matches the direction of travel; re-evaluate it when you localize or widen the surface. `horizontal`
- **initialStepText**: The label for the forward action on the first step. Use it to signal the start of the experience (for example, wording that invites the user to begin) rather than a generic 'Next', so the very first interaction is self-explanatory. `Show me`
- **finalStepText**: The label for the action on the final step. It should communicate completion or acknowledgement and clearly close the tour; never reuse the mid-tour forward label here. `Got it`
- **root**: The slot that owns the underlying DOM element of the surface or of one of its composed regions, and the primary hook for styling and semantics. Use it to merge a className for theming, and note that title and container regions can be retargeted to heading elements where the semantics call for it. `div`
- **children (navigation button render function)**: Accepts a render function that receives the navigation button's state and returns its content, letting you customize labels, icons, or ordering of previous and next controls. Whatever you render must still carry an accessible name, and rendered output should stay cheap because it runs on every render of the surface. `a custom next control showing an arrow plus the finalStepText label`
- **children (page count render function)**: Accepts a render function that receives the current step and total step count and returns the progress indicator content, such as text or dots. Keep the progress indicator non-interactive unless it is implemented as real controls, and make sure changes are announced politely rather than visually only. `Step 2 of 4`
- **footerLayout**: Controls whether footer actions stack horizontally or vertically ('horizontal' or 'vertical'). Use horizontal for one or two short actions, and switch to vertical for three or more actions, long localized labels, or narrow surfaces where horizontal actions would compress or overflow. `vertical`
- **handleButtonClick**: Receives the mouse event raised by action controls inside the surface so you can drive step changes, record engagement, or dismiss the tour. Keep the handler idempotent — a double click must not advance two steps — and do not prevent default on anchor-based controls, or you will break their navigation semantics. `advance to the next step and log that the user engaged with the tour`
- **dismissButton**: The slot for the surface's close affordance. Render one on every step so dismissing the guidance is always a single, obvious interaction, and give it an accessible name when it is icon-only. It should sit visually at the trailing edge of the header and remain reachable by keyboard. `an icon button labeled 'Dismiss'`
- **icon**: An optional decorative slot at the leading edge of the surface header, typically used for product or feature iconography. Hide it from assistive technology when it adds no information, and size and align it with the spacing tokens used by the rest of the header so the title does not shift between steps. `a small feature glyph shown before the title`

## Best Practices

### Do's

- Give every step a concise, scannable title and one idea of body copy so the surface never becomes a wall of text.
- Always provide a visible or accessible dismiss affordance through the dismissButton slot, and give it a clear name such as 'Dismiss' when it is icon-only.
- Keep the surface's height stable across steps by choosing one mediaLength value for the whole tour and reusing it on every step.
- Provide a textual alternative through altText for any media inside the surface that carries meaning; reserve decorative imagery for elements you can omit or hide.
- Use consistent, outcome-oriented copy for the navigation labels: a start-oriented initialStepText for the first step and a completion-oriented finalStepText such as 'Got it' for the last step.
- Place the primary action last in DOM order within the footer so tab order follows the visual reading order, and choose footerLayout to match the number of actions and the available width.
- Keep the interactive surface minimal — typically one primary action plus a dismiss — so focus management stays predictable when the surface opens.
- Let the popover be re-openable or permanently dismissible so people who close it early are not locked out of the guidance.

### Don'ts

- Don't embed long forms, tables, or scrollable regions in the surface; the popover is a short-attention overlay, not a page.
- Don't open another popover, menu, or dialog from inside the surface, which fights the surface's own focus management and dismissal behavior.
- Don't ship an icon-only dismissButton or a purely decorative icon slot without an accessible name or aria-hidden.
- Don't hard-code background, text, or shadow colors on the surface; that breaks brand, dark, and high-contrast themes.
- Don't let the surface resize dramatically between steps by mixing media lengths or by letting copy length vary wildly.
- Don't auto-advance steps or auto-dismiss the surface on a timer while a person is reading, and don't hijack page scrolling to keep the surface visible.
- Don't repeat the exact same copy on every step, and don't use the final step as a second 'Next' — the last action should communicate completion.

## Anti-Patterns

### Wall of text inside a step

❌ TeachingPopoverSurface is a short-attention overlay, so long paragraphs, bullet-heavy copy, or embedded documentation force the surface to grow, overflow the viewport, and get dismissed unread.

✅ Split the content across carousel steps with one idea per step, keep the body copy to a few lines, and move anything longer into a page or Dialog that the tour links to.

### Unnamed dismiss and decorative icon slots

❌ A dismissButton that renders only a glyph, or an icon slot that carries meaning, leaves screen reader users with an unlabeled button or an unexplained graphic inside the surface.

✅ Give the dismiss button an accessible name (for example 'Dismiss'), and mark purely decorative icons with aria-hidden so only meaningful graphics are announced.

### Nested overlays and focus fights

❌ Opening a menu, tooltip, or second popover from inside the surface competes with the surface's focus management and Escape handling, and users can end up trapped or with focus returned to the wrong place.

✅ Keep the surface limited to the tour's own content and one primary action; use menus or dialogs outside the surface, or link to a full page for anything complex.

### Hard-coded surface colors

❌ Fixed background, text, or shadow values look right in the default light theme but fail contrast in dark, high-contrast, or branded themes, and they ignore the tokens the rest of the app uses.

✅ Style the root slot with theme tokens such as tokens.colorNeutralBackground1, tokens.colorNeutralForeground1, and tokens.shadow16, and let the theme control the brand variant.

### Jumping layout between steps

❌ Mixing media lengths or wildly varying copy lengths makes the surface grow and shrink and change anchor position as a person navigates, which is disorienting and can push controls out of reach.

✅ Reserve a consistent footprint with a single mediaLength value across the tour and balance copy so each step is roughly the same size.

## Accessibility

**Requirements**: The surface must be announced with an accessible name, which normally means pairing a title inside the surface with aria-labelledby, or supplying aria-label when no visible title exists; use aria-describedby to associate the body copy with the surface. When the popover blocks interaction with the rest of the page, expose it as a modal dialog with role set accordingly and aria-modal set to true. Every interactive element inside the surface (dismiss, previous, next, goto, and footer actions) needs an accessible name, and its visible label should match that name. Color contrast of the surface background against its text must meet WCAG AA in every theme, which means relying on theme tokens rather than fixed colors. Content inside the surface must remain reachable and readable at 200% zoom and under forced-colors mode, and step transitions must not rely on motion alone to convey progress.

| Key | Action |
| --- | --- |
| `Escape` | Dismisses the teaching popover and returns focus to the element that opened it. |
| `Tab` | Moves focus to the next interactive element inside the surface; focus stays within the popover while it is open. |
| `Shift+Tab` | Moves focus to the previous interactive element inside the surface. |
| `Enter` | Activates the focused control, including link-based navigation buttons, the dismiss button, and footer actions. |
| `Space` | Activates the focused button-style control, such as next, previous, or a footer action. |
| `ArrowLeft` | Moves focus toward the previous navigation control when the surface hosts carousel navigation. |
| `ArrowRight` | Moves focus toward the next navigation control when the surface hosts carousel navigation. |

**ARIA**: aria-labelledby, aria-describedby, aria-label, aria-modal, aria-hidden, aria-live, role

**Screen Reader**: When the surface opens, screen readers announce the popover as a dialog-like container and read its accessible name from the title associated through aria-labelledby (or from aria-label), followed by the description associated through aria-describedby. Focus moves into the surface so its interactive content is reachable immediately, and the user does not have to hunt for the overlay in the virtual buffer. As the person moves between carousel steps, changed content and page-count updates should be announced politely rather than interrupting, and purely decorative icons inside the icon slot should be hidden from the accessibility tree. On Escape or on activation of the dismiss control, the surface is removed from the accessibility tree and focus returns to the trigger.

## Styling

Style the surface through the className you merge onto root and through the theme, not through hard-coded values. A neutral bubble typically uses tokens.colorNeutralBackground1 for the surface, tokens.colorNeutralForeground1 for body copy, tokens.shadow16 for elevation, and tokens.borderRadiusXLarge for the rounded corners; a branded variant leans on tokens.colorBrandBackground2 with tokens.colorNeutralForeground1 (or tokens.colorNeutralForegroundOnBrand when the background is fully saturated). Padding is usually tokens.spacingHorizontalL and tokens.spacingVerticalL, with tokens.spacingVerticalS between stacked elements and tokens.spacingHorizontalM between side-by-side footer actions. If you need a hairline edge in addition to the shadow, use tokens.strokeWidthThin with tokens.colorTransparentStroke. Keep step-to-step layout stable by giving media a fixed footprint and reserving space with the mediaLength prop rather than by hard-coding heights on inner elements. Transitions between steps should use motion tokens such as tokens.durationNormal with tokens.curveEasyEase, and should be suppressed when the user prefers reduced motion. When you customize the icon or dismissButton slots, size them with the same spacing tokens used by the rest of the surface so the header does not drift.

## Performance

The surface's subtree is mounted while the popover is open, so keep it light: avoid heavy images, videos, animated backgrounds, and expensive effects inside it, since they render for each step of the tour and for every opening. The navigation button and page-count render functions (children) execute on every render of the surface, so keep them pure, avoid creating large element trees in them, and avoid inline work such as sorting or formatting that could be memoized outside. Because the surface is usually anchored to a trigger in a long-lived app shell, put the effort of composing step content behind the trigger rather than rendering all steps eagerly. Step transitions that animate opacity or transform are inexpensive; animating layout properties is not, and forced synchronous layout reads inside the surface should be avoided. Finally, honor reduced-motion preferences when animating between steps so the transition cost is skipped entirely for users who opted out.

## Theming & Tokens

Every visual characteristic of the surface flows from the Fluent theme, so a TeachingPopoverSurface automatically adapts when a FluentProvider swaps brands or switches between light, dark, and high-contrast themes. The surface background typically resolves to tokens.colorNeutralBackground1 for the default look and to a brand-family token such as tokens.colorBrandBackground2 for the branded look, with text drawn from tokens.colorNeutralForeground1 (or tokens.colorNeutralForegroundOnBrand on saturated backgrounds). Elevation comes from tokens.shadow16, corners from tokens.borderRadiusXLarge, spacing from tokens.spacingHorizontalL and tokens.spacingVerticalL, and typography from the font and size tokens used by the title and body text such as tokens.fontSizeBase300 and tokens.fontWeightSemibold for the title. Borders, when present, use tokens.strokeWidthThin with tokens.colorTransparentStroke or tokens.colorNeutralStroke1 so they remain visible in high contrast. Motion between steps should use tokens.durationNormal with tokens.curveEasyEase. If you must customize, do it through className on the root slot using these same tokens so the surface keeps contributing correctly to contrast ratios and forced-colors rendering.

## Migration Notes

TeachingPopoverSurface has no direct equivalent in Fluent UI React v8; the closest predecessor was the one-shot TeachingBubble, which rendered a fixed step and exposed far less composition. Moving from that pattern means: (1) replacing a single bubble with a composition of TeachingPopover, TeachingPopoverTrigger, and TeachingPopoverSurface, where the surface is a child rather than the root; (2) replacing v8 style objects and theme callbacks with Griffel-based className merging on the root slot and its sibling slots (icon, dismissButton) plus theme tokens; (3) using the carousel nav and page-count render functions plus initialStepText and finalStepText instead of manually swapping bubble content per step; and (4) letting the popover own positioning, focus management, and Escape handling instead of wiring portal and dismiss logic by hand. Teams that only need a lightweight, single-idea overlay should migrate to the plain Popover with PopoverSurface rather than to this teaching variant.

## Edge Cases

- A surface that renders media but no title and no aria-label is announced as a dialog with no name, so always pair the surface with a title or an explicit label.
- Very long localized labels can overflow a horizontal footer on narrow viewports; switch footerLayout to vertical rather than letting actions clip or wrap unpredictably.
- Surfaces anchored near viewport edges can be flipped or clipped by the positioning layer, which may visually detach the bubble from its trigger or cut off footer actions.
- In right-to-left layouts, navigation affordances and their icons need to mirror, while the DOM order of previous and next controls should still match the intended reading order.
- If a person presses Escape while a step transition animation is still running, the surface can unmount mid-transition; make sure step state updates are idempotent and do not run after dismissal.
- Decorative media with altText that simply repeats the step copy causes duplicate announcements, so either supply meaningful alternative text or omit the media from the accessibility tree.
- Because content inside the surface is reachable only while the popover is open, any state the person provides there (such as a choice in the final step) must be persisted outside the surface before it closes.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
