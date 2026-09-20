# TeachingPopoverCarouselCard

> **Package**: `@fluentui/react-teaching-popover` v9.7.0
> **Import**: `import { TeachingPopoverCarouselCard } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

TeachingPopoverCarouselCard is one page (slide) inside a TeachingPopoverCarousel. It is a thin, layout-only wrapper that groups the content shown for a single step of a multi-step teaching or onboarding flow and associates that content with a required value string. The TeachingPopoverCarousel uses the value as the identity of the card so it can determine which page is currently displayed and keep the carousel's navigation controls in sync with the visible content. Each card renders a single required root slot, which is the element that wraps the card's content (headline, supporting text, imagery, or other child elements). The component itself contributes no behavior, no focus management, and no built-in visual chrome beyond the container element; the surrounding TeachingPopover, TeachingPopoverSurface, TeachingPopoverCarousel, TeachingPopoverCarouselNav, TeachingPopoverCarouselNavButton, TeachingPopoverCarouselPageCount, and TeachingPopoverCarouselFooter components own the popover behavior, styling, page tracking, and navigation.

**When to use**: Use TeachingPopoverCarouselCard when you are building a sequential, multi-step teaching experience inside a TeachingPopover and you need to split the flow into discrete pages that can be navigated forward and backward. It is the correct building block when each step has its own self-contained content that should be shown in isolation, for example a product tour that introduces one feature per page, a first-run walkthrough, or an in-popover tutorial with a fixed set of steps. Do not use it for single-message popovers: if the TeachingPopover only needs one body of content, render that content directly inside TeachingPopoverBody and skip the carousel entirely. Do not use TeachingPopoverCarouselCard as a general-purpose layout container in other overlays, and do not use it to build carousels outside of TeachingPopoverCarousel, because the card is only meaningful in combination with the carousel's page model and its navigation controls.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | Yes | — |

### Prop Guidance

- **value**: Required. The unique identifier for this card within the TeachingPopoverCarousel. It must be a non-empty, stable string that no other card in the same carousel uses, because the carousel uses it to decide which page is currently active and to reconcile the displayed card with the navigation indicators. Prefer short, semantic, non-localized identifiers over display text so the value survives copy changes and translation, and never derive it from an index that can shift when steps are reordered. `value="step-1"`
- **root (slot)**: The root slot is the element that wraps the card's content and is the single place to apply layout, spacing, and typographic styling for the step. Render one consistent content structure inside it on every card (for example heading, body copy, and optional visual) so the popover surface keeps a stable size as the user navigates. Do not attach interactive navigation to the root element itself; page movement belongs to the carousel's navigation and footer components. `root renders as the card container element`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | The element wrapping the buttons. |

## Best Practices

### Do's

- Give every card a unique, stable, non-empty value string so the TeachingPopoverCarousel and its navigation controls can identify which page is active.
- Render TeachingPopoverCarouselCard as a direct child of TeachingPopoverCarousel so that it participates in the carousel's page model and layout.
- Keep each card focused on exactly one teaching step: a short heading, one or two sentences of supporting copy, and at most one primary action.
- Keep the value in sync with the matching entry in the carousel navigation and the page count so the step indicator and the visible card agree.
- Use the root slot as the single container for the card's content so layout, spacing, and alignment are applied consistently across every step.
- Give every card the same internal structure (heading, body, optional visual) so the popover does not visibly jump between steps.
- Keep the number of cards small, typically two to six steps, so a learner can complete the flow without abandoning it.
- Keep cards inside a TeachingPopoverBody so they inherit consistent typography and spacing from the teaching popover's content area.

### Don'ts

- Do not reuse the same value on two cards in the same carousel; duplicate identifiers make the active page ambiguous and break the link between the card and its navigation entry.
- Do not render TeachingPopoverCarouselCard outside of a TeachingPopoverCarousel, where the value has no consumer and the card renders as an unstyled, orphaned container.
- Do not build your own back/next controls inside the card; page movement belongs to the carousel navigation and footer components so every page presents consistent controls.
- Do not omit the value prop or pass an empty string, since it is required and is the only way the card is addressed by the carousel.
- Do not derive the value from localized or display text such as a translated step title, because the value must stay stable across locales and copy changes.
- Do not pour long-form, scrollable content into a card; the popover surface is sized by its content, so oversized cards force scrolling and hide the navigation.
- Do not rely on the value to produce DOM ids, CSS selectors, or accessible names; treat it as an opaque identity string.
- Do not stack many heavy visual assets inside a single card, because every card remains part of the carousel and inflates the popover's rendering and layout cost.

## Anti-Patterns

### Duplicate or reused value strings

❌ Two cards sharing a value make the carousel's active-page lookup ambiguous, so navigation indicators can highlight the wrong step and the visible card may not match the selected value.

✅ Treat value as a primary key: generate unique, human-readable identifiers such as step-1, step-2, and step-3, and assert uniqueness when steps are generated from data.

### Card rendered outside a carousel

❌ TeachingPopoverCarouselCard has no meaning on its own; without a TeachingPopoverCarousel the value has no consumer and the card renders as an unstyled, orphaned block inside the popover.

✅ Always nest cards inside TeachingPopoverCarousel within a TeachingPopover. For a single-step message, drop the carousel and place the content directly in TeachingPopoverBody instead.

### Custom navigation inside the card

❌ Hand-rolled back and next buttons inside the root slot duplicate the carousel's controls, produce inconsistent button placement and naming across steps, and can desynchronize with the navigation indicators.

✅ Let TeachingPopoverCarouselNav, TeachingPopoverCarouselNavButton, and TeachingPopoverCarouselFooter own navigation, and keep card content limited to the step's message and any single in-step action.

### Unbounded content inside a card

❌ Long paragraphs, scrollable lists, or large embedded widgets force the popover surface to grow or scroll, which pushes the navigation controls out of view and defeats the step-by-step teaching model.

✅ Split overflow content across additional cards, trim copy to a heading plus a couple of sentences, and size any imagery with a fixed aspect ratio so the surface stays stable between steps.

### Using value as an accessible name or DOM identifier

❌ The value prop is not exposed to assistive technology and is intended as an opaque identity string, so using it for ids, selectors, or labels produces fragile markup and unlabeled steps for screen reader users.

✅ Render a real heading inside the card and associate it with aria-labelledby when a programmatic name is needed, keeping value purely for carousel bookkeeping.

## Accessibility

**Requirements**: TeachingPopoverCarouselCard contributes no ARIA semantics of its own, so accessibility must be authored around it. WCAG 2.1 AA applies: give each card a programmatically determinable heading so the step is identifiable when a screen reader user lands on it, keep text contrast at or above 4.5:1 for body copy and 3:1 for large text, ensure any images inside the card have meaningful alternative text (or are decorative and hidden), and make sure the only interactive elements inside a card are real, focusable controls with visible focus indicators meeting the 3:1 non-text contrast requirement. Because page changes are triggered by the carousel's navigation, the navigation controls must be reachable by keyboard and programmatically named, and the page-count indicator should communicate progress in text rather than by color or position alone. Verify that content in inactive cards is either not focusable or is hidden from assistive technology, so keyboard and screen reader users are not dropped into a step that is not visible.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the card, landing on any focusable element rendered inside it; the card's root element is not itself focusable. |
| `Shift+Tab` | Moves focus backward out of the card to the preceding focusable control, typically the previous page's or the carousel's navigation. |
| `Enter` | Activates a link or button placed inside the card; the card itself defines no Enter behavior. |
| `Space` | Activates a button placed inside the card; the card itself defines no Space behavior. |
| `ArrowLeft / ArrowRight` | Not handled by TeachingPopoverCarouselCard. Page-to-page movement is performed through the carousel's navigation controls, which are separate components. |
| `Escape` | Not handled by the card; dismissing the teaching popover is the responsibility of the surrounding TeachingPopover and its trigger/surface. |

**ARIA**: aria-label (used on interactive controls placed inside the card, such as icon-only buttons or linked images), aria-labelledby (used to associate a card's content with a heading element rendered inside it), aria-describedby (used to tie supplementary copy inside the card to its primary control), aria-hidden (used to remove decorative imagery inside the card, or inactive card content, from the accessibility tree), aria-current (used on carousel navigation indicators to mark the step that corresponds to the displayed card), aria-live (used on the page-count or step indicator so progress announcements reach screen reader users without moving focus)

**Screen Reader**: Screen readers treat TeachingPopoverCarouselCard as an ordinary container: it has no role, no name, and no announced state, and the value prop is never spoken because it exists only to identify the card to the carousel logic. Content inside the card is read in document order as part of the teaching popover, so the order of headings, text, and controls inside the root slot determines the reading experience. Because the value is not exposed, never rely on it as an accessible name; instead expose a heading inside the card and, if the card needs a label of its own, associate one with aria-labelledby. When the displayed card changes, screen reader users receive no automatic announcement from the card itself, so progress and step changes need to be conveyed through the carousel's navigation controls or a live region on the step indicator.

## Styling

TeachingPopoverCarouselCard is intentionally minimal, so most visual customization happens by styling the root slot, which is the element wrapping the card's content. Apply padding with spacing tokens such as tokens.spacingVerticalL, tokens.spacingHorizontalXXL, or tokens.spacingVerticalXXL, and separate sibling elements inside the card with tokens.spacingVerticalM or a gap based on tokens.spacingHorizontalMNudge. Set body copy to tokens.colorNeutralForeground1 with tokens.fontSizeBase300 and tokens.lineHeightBase400, and use tokens.colorNeutralForeground2 for secondary or supporting sentences. Headings read best at tokens.fontSizeBase500 or tokens.fontSizeHero700 with tokens.fontWeightSemibold. Round any imagery inside the card with tokens.borderRadiusMedium or tokens.borderRadiusLarge and keep a consistent aspect ratio so cards do not change shape between steps. Give the root slot a min-height (for example a value based on tokens.spacingVerticalXXXL and a few text lines) so the popover surface does not resize as users move between cards of slightly different content length. Avoid setting widths per card, since differing widths make the popover surface jump during navigation, and apply all values through Griffel so the styles participate in the theme, RTL, and high-contrast handling that tokens already provide.

## Performance

The card is a light wrapper, so its own render cost is negligible; the cost comes from the content placed inside it and from the fact that a carousel of cards means multiple card subtrees exist within one popover. Keep each card's content small and inexpensive, avoid mounting heavy charts, autoplaying media, or large images inside a card, and prefer a single shared visual treatment over per-card bespoke layouts. Because cards are siblings in the same popover, changing the active value should ideally re-render only the layout around them rather than every card's content, so keep card content memo-friendly and avoid recreating large child trees inline on every render. Layout cost matters too: inconsistent card heights make the popover surface re-measure and resize on each navigation, so pin a consistent min-height on the root slot and reserve space for imagery.

## Theming & Tokens

TeachingPopoverCarouselCard does not paint its own colors; it inherits the surrounding TeachingPopoverSurface, which resolves against the nearest FluentProvider theme. Text inside the card should use tokens.colorNeutralForeground1 for primary copy and tokens.colorNeutralForeground2 for secondary copy, and any emphasis should use tokens.colorBrandForeground1 or tokens.colorBrandForegroundLink rather than hard-coded colors. Backgrounds, if you add them to the root slot, should come from tokens.colorNeutralBackground1 or tokens.colorNeutralBackground2 so dark and high-contrast themes invert correctly. Borders and dividers use tokens.colorNeutralStroke1 and tokens.colorNeutralStroke2, corner rounding uses tokens.borderRadiusLarge or tokens.borderRadiusXLarge, and spacing uses the tokens.spacingVertical* and tokens.spacingHorizontal* scales. Typography should reference tokens.fontFamilyBase, tokens.fontSizeBase300 through tokens.fontSizeBase500, tokens.fontWeightSemibold, and tokens.lineHeightBase300/400. Because everything flows through Griffel and theme tokens, the card automatically adapts to brand themes, compact density, RTL mirroring, and Windows high-contrast mode.

## Migration Notes

TeachingPopoverCarouselCard has no direct equivalent in Fluent UI React v8; multi-step in-popover teaching flows were previously assembled by hand from Popover plus custom slides. When porting such a flow, replace the hand-rolled slide wrapper with TeachingPopoverCarouselCard, move step ordering into the required value prop, and hand navigation and progress over to TeachingPopoverCarouselNav, TeachingPopoverCarouselNavButton, and TeachingPopoverCarouselPageCount. Note that the v9 component does not accept a step index; the value string is the only identifier, so any index-based logic in older code must be converted to value-based lookup.

## Edge Cases

- A carousel with a single card has nothing to navigate to; hide the navigation controls and the page-count indicator rather than presenting disabled controls.
- Values that contain whitespace, punctuation, or non-ASCII characters are treated as opaque strings and must match exactly wherever the step is referenced; trim generated values before passing them.
- Cards with noticeably different content lengths cause the popover surface to resize on every page change; pin a min-height on the root slot to keep navigation controls from shifting under the pointer.
- If the currently active card is removed while the popover is open, the carousel can be left pointing at a value that no longer exists; update the selected value at the same time you remove the card.
- Cards are typically all mounted inside the carousel, so content in inactive cards may still be reachable by tab order or assistive technology; confirm the carousel implementation hides or disables inactive card content.
- The required value is easy to forget when cards are generated from a data array; validate uniqueness and presence of the field before rendering the steps.
- Wrapping a card in an extra container element outside of TeachingPopoverCarousel breaks the relationship between the card and the carousel, so keep the card a direct child of the carousel.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
