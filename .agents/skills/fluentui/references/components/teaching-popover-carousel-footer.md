# TeachingPopoverCarouselFooter

> **Package**: `@fluentui/react-teaching-popover` v9.7.0
> **Import**: `import { TeachingPopoverCarouselFooter } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

TeachingPopoverCarouselFooter is the action row that sits at the bottom of a TeachingPopoverCarousel and drives the multi-step teaching flow by rendering a previous/next button pair wired to the carousel's internal step state. It is designed to be placed inside the carousel surface — typically as the final child of TeachingPopoverCarousel, beneath the TeachingPopoverCarouselCard pages — so that the user can move forward through coachmark-style content and step back if needed. The footer is state-aware: the required initialStepText prop supplies the label for the next button on all but the last page, while the required finalStepText prop supplies the label that replaces it when the user reaches the final step (commonly a completion verb such as "Got it"). Its root slot wraps the buttons and is laid out according to the layout prop, which defaults to a balanced centered arrangement and can alternatively right-align the actions. The previous slot is optional, allowing single-direction flows to omit a back button, while the next slot is required because it is the primary advancement affordance. Because both initialStepText and finalStepText are required, the component always knows what its forward action should read at any point in the sequence.

**When to use**: Use TeachingPopoverCarouselFooter whenever you build a multi-step onboarding, feature tour, or coachmark experience with TeachingPopoverCarousel and need standard forward/back navigation without wiring carousel state yourself. It is the right choice when the flow has a clear linear sequence where users advance one page at a time and the forward action should change wording on the last page (for example from "Next" to "Got it"). Prefer it over hand-rolled Button rows inside the popover because the footer already reads the carousel step state, handles the final-step label swap, and keeps spacing and alignment consistent with the rest of the TeachingPopover family. Choose the plain TeachingPopoverFooter instead when the popover is not a carousel — for example a single-page teaching moment with one or two static actions — because the carousel footer's navigation semantics and required step labels add no value outside a carousel. Also avoid it when the flow needs non-linear branching, which the previous/next model does not express.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `finalStepText` | `string` | — | Yes | The text to be displayed on the final step of carousel |
| `initialStepText` | `string` | — | Yes | The text to be displayed on the initial step of carousel |
| `layout` | `TeachingPopoverCarouselFooterLayout \| undefined` | `'centered'` | No | Controls whether buttons will be centered (balanced) or right aligned Defaults to 'centered'. |

### Prop Guidance

- **layout**: Controls whether the previous and next buttons are centered as a balanced pair or aligned to the trailing edge. It defaults to the centered arrangement, so only set it when you want the right-aligned alignment, and prefer this prop over custom justify-content overrides. `centered`
- **initialStepText**: Required. The label shown on the forward button for every page except the last. Keep it short, action-oriented, and localized — for example a simple instruction to continue. `Next`
- **finalStepText**: Required. The label that replaces initialStepText once the user reaches the final carousel page, used to communicate completion. Make it clearly different in meaning from the initial label so the transition is obvious. `Got it`
- **root**: The slot wrapping the carousel action row. Use it to attach a className for layout tweaks or to add data attributes for testing, but avoid inserting additional visual containers that would break the centered alignment.
- **previous**: Optional slot for the back button. Omit it or set it to null for single-direction flows; keep it for multi-step flows so users can revisit earlier pages, and pass aria-label when you render icon-only content.
- **next**: Required slot for the forward button and the primary way users advance the carousel. Customize its appearance through className or slot styling, but keep the carousel's advancement behavior intact rather than substituting an unrelated control.

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `next` | — | Yes | The next button slot. |
| `previous` | — | No | The previous button slot. |
| `root` | — | Yes | The element wrapping carousel pages and navigation. |

## Best Practices

### Do's

- Provide both initialStepText and finalStepText on every instance, since they are required and drive the label swap on the last page of the carousel.
- Localize initialStepText and finalStepText through your application's string resources so the forward action reads naturally in every supported language.
- Keep the two labels short (one to three words) so the footer stays compact and the button widths do not jump dramatically when the label changes.
- Rely on the layout prop to control alignment rather than overriding positioning in styles; leave it at its default centered arrangement for symmetric coachmarks and use the right-aligned option when the footer should hug the trailing edge.
- Pair the footer with TeachingPopoverCarouselNav or TeachingPopoverCarouselPageCount so users can see where they are in the sequence; the footer itself only shows actions.
- Render the footer as the last child of the TeachingPopoverCarousel so it stays anchored below the carousel pages and inside the popover surface.
- Leave the previous slot in place for flows of more than two steps so users can review content they already passed.

### Don'ts

- Don't render the footer outside a TeachingPopoverCarousel; without carousel context the previous and next buttons have no step state to advance.
- Don't reuse the same generic string for both initialStepText and finalStepText, because the whole point of the component is to signal completion on the final page.
- Don't stuff long paragraphs, form fields, or multiple competing calls to action into the footer; it is a navigation row, and heavy content breaks the centered layout.
- Don't use the previous slot for non-navigation actions such as "Skip", "Remind me later", or "Close" — those are dismissive actions and belong in a footer or header area, not on the back button.
- Don't replace the next slot with a plain Button that lacks the carousel's advancement behavior, or users will be stranded on the current page.
- Don't duplicate navigation by adding a second independent set of forward/back controls that also mutate carousel state, which creates ambiguous focus order and double advancement.
- Don't remove the previous slot in a long flow; users then have no way to revisit earlier pages.

## Anti-Patterns

### Rendering the footer outside a carousel

❌ The footer's previous and next actions are wired to TeachingPopoverCarousel step state. Dropping it into a plain TeachingPopover or anywhere outside the carousel leaves the buttons with nothing to advance, so clicking them does nothing or throws on missing context.

✅ Always place TeachingPopoverCarouselFooter inside TeachingPopoverCarousel, after the carousel card pages, and use the non-carousel TeachingPopoverFooter when the popover has no steps.

### Identical or missing step labels

❌ Because initialStepText and finalStepText are required and drive the final-page label swap, leaving them generic, duplicated, or untranslated means the forward action never signals that the flow has ended, and localization breaks.

✅ Author two distinct, localized strings — a continue-style label for intermediate pages and a completion-style label for the last page — and keep them short enough that the button width stays stable.

### Hijacking the previous slot for dismissal

❌ Placing Skip, Later, or Close on the previous slot mixes navigation semantics with dismissal, so screen reader users hear a back button that unexpectedly closes the flow and focus order becomes misleading.

✅ Keep the previous slot for backward navigation only, and expose dismissive actions through the popover's trigger, header, or a dedicated action area instead.

### Stuffing rich content into the action row

❌ Long copy, images, or several competing buttons in the footer break the centered balanced arrangement, push the actions off-screen in small viewports, and dilute the primary forward action.

✅ Keep the footer to a previous/next pair, move explanatory content into the carousel card pages, and use the carousel nav or page count for progress indication.

### Reimplementing the next button without carousel wiring

❌ Replacing the next slot with a button that only closes the popover or that maintains a separate step counter causes double advancement or a dead end, since the carousel's own index no longer tracks the flow.

✅ Style the provided next slot rather than replacing its behavior, and let the carousel own step transitions so the label swap on the final page stays correct.

## Accessibility

**Requirements**: The footer must satisfy WCAG 2.1 AA: every action must be keyboard operable (2.1.1), focus order must follow the visual order of previous then next (2.4.3), each button must expose an accessible name derived from its text content (4.1.2), and text and focus indicators must meet contrast minimums against the popover surface (1.4.3, 1.4.11). Because the footer lives inside a popover, focus must remain trapped within the popover while it is open and must return to the trigger once it closes. Pointer targets for the buttons should meet the 24 by 24 CSS pixel minimum target size (2.5.8).

| Key | Action |
| --- | --- |
| `Tab` | Moves focus from the popover content into the previous button and then the next button, in visual order. |
| `Shift+Tab` | Moves focus backward from the next button to the previous button and back out of the footer. |
| `Enter` | Activates the focused button — advancing to the next carousel page or returning to the prior page. |
| `Space` | Activates the focused button, matching Enter for button semantics. |
| `Escape` | Closes the parent TeachingPopover rather than activating the footer buttons, since Escape handling belongs to the popover surface. |

**ARIA**: aria-label — supply it when a button in the previous or next slot renders icon-only content or otherwise has no visible text., aria-disabled — reflects a disabled previous or next action without removing it from the tab order when you want the control to remain discoverable., aria-live — an optional polite region (for example around the page count region) helps announce step progress when the page changes without moving focus.

**Screen Reader**: The footer is exposed as a wrapping container holding two buttons, and screen readers announce each button by the accessible name taken from its visible text — the initialStepText value while the flow is in progress and the finalStepText value once the last page is reached. Activating next changes the carousel page and the accessible name of the forward button; because a label change on the currently focused element is not reliably announced, pairing the footer with TeachingPopoverCarouselNav or TeachingPopoverCarouselPageCount gives assistive technology a stable, live-updating indication of progress. If the previous slot is removed, it simply disappears from the accessibility tree, so no empty or unlabeled control is exposed.

## Styling

Customize through the slot props: apply className or style to root, previous, and next so you target the wrapper, the back button, and the forward button respectively, rather than wrapping the footer in extra markup that would disturb the centered layout. The root is laid out with flexbox and the layout prop decides the justification, so adjust alignment with the prop first and only then with overrides. For a branded forward action, style the next slot with tokens.colorBrandBackground for the fill and tokens.colorBrandForeground1 for the label, with tokens.colorBrandBackgroundHover for the hover state; for a quieter back action use tokens.colorNeutralBackground1 with tokens.colorNeutralForeground1 or tokens.colorNeutralForeground2. Spacing between the two actions should use tokens.spacingHorizontalS or tokens.spacingHorizontalM, and the gap between the last carousel page and the footer should use tokens.spacingVerticalM or tokens.spacingVerticalL. Rounded corners come from tokens.borderRadiusMedium, and focus rings should keep tokens.colorStrokeFocus2 visible against the popover background. Type styling should stay on tokens.fontFamilyBase and tokens.fontSizeBase300 so labels match the rest of the popover. When labels change length between the initial and final step, reserve horizontal space or keep both strings similar in length so the row does not visibly shift mid-flow.

## Performance

The footer is a lightweight wrapper around two buttons, but it re-renders whenever the carousel's current step changes because the forward button's label depends on whether the last page is active. Keep the work in that render path minimal: avoid constructing new inline objects for the previous and next slot props on every render, hoist class names produced by your Griffel styles, and stabilize any custom click handlers rather than creating new function identities each render. Because the footer is inside a popover surface that also hosts the carousel pages, heavy children in the footer would force layout work on every step change, so keep its subtree shallow.

## Theming & Tokens

The footer inherits the Fluent theme from the surrounding FluentProvider and expresses that theme entirely through design tokens. Surface and text colors come from tokens.colorNeutralBackground1 and tokens.colorNeutralForeground1, with tokens.colorNeutralForeground2 suited to secondary or hint text; the primary forward action is typically rendered with tokens.colorBrandBackground, tokens.colorBrandBackgroundHover, and tokens.colorBrandForeground1, while a quieter back action uses the neutral background and stroke tokens. Focus visibility relies on tokens.colorStrokeFocus2. Spacing between and around the buttons uses tokens.spacingHorizontalS or tokens.spacingHorizontalM and tokens.spacingVerticalM, corner rounding uses tokens.borderRadiusMedium, and typography uses tokens.fontFamilyBase with tokens.fontSizeBase300. Because these are token references, the footer automatically adapts to light, dark, and high-contrast themes without component-level overrides.

## Migration Notes

TeachingPopoverCarouselFooter has no direct counterpart in Fluent UI React v8 or earlier; it belongs to the v9 TeachingPopover family, which replaces loosely assembled TeachingBubble plus custom button rows. When migrating a multi-step tour built from TeachingBubble or a Dialog with manual "Next"/"Back" buttons, move the action row into this footer inside a TeachingPopoverCarousel and provide the two required labels as initialStepText and finalStepText, letting the carousel own step state instead of tracking an index in application code.

## Edge Cases

- A single-page carousel still requires both initialStepText and finalStepText even though initialStepText may never be visible, so always supply both to avoid a runtime error or a missing label.
- Removing the previous slot (or setting it to null) is valid for one-way flows, but doing so in a multi-step flow removes the only way for users to review earlier pages.
- The forward button's label changes between initialStepText and finalStepText as the user reaches the last page, which can shift button widths and the centered layout; keep the two strings similar in length or reserve space for the longer one.
- Long translations can wrap or overflow the action row on narrow popovers, so verify layouts with pseudo-localized or expanded strings before shipping.
- The footer is not sticky; if a carousel page is taller than the available viewport, the actions can be pushed below the visible area until the user scrolls the popover content.
- Programmatically driving the carousel to the last page changes the forward label immediately, so any external logic that depends on the button text (for example analytics or selectors) should key off carousel state rather than the rendered string.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
