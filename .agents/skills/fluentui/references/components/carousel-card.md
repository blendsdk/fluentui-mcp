# CarouselCard

> **Package**: `@fluentui/react-carousel` v9.9.8
> **Import**: `import { CarouselCard } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

CarouselCard is the per-slide content container used inside a Fluent UI Carousel. It renders a single root element that wraps whatever you want to show on one slide — an Image, a Card with CardHeader/CardPreview, Text, buttons, or any other composition — and lets the surrounding Carousel machinery (Carousel, CarouselViewport, CarouselSlider, CarouselNav) handle positioning, dragging, snapping, and navigation. The component is intentionally thin: its only prop, autoSize, tells the card to size itself responsively against its content instead of relying on a slide size imposed from the outside. Because the carousel renders every card into the slider track, CarouselCard is the natural place to put the visual unit of a slide, while navigation and playback controls stay on CarouselButton, CarouselAutoplayButton, and CarouselNav.

**When to use**: Use CarouselCard whenever you author the content of an individual slide inside a Carousel — it is the expected child of the carousel slider and keeps each slide a self-contained, consistently wrapped unit. Reach for it for image galleries, promotional banners, onboarding tours, testimonial rotators, and card rails where each item occupies one slide. Set autoSize when the slides contain variable-length text or differently sized content and you want the card to grow with its content rather than clip or stretch. Do not use CarouselCard as a generic surface outside a carousel: if you merely need a bordered container for content on a page, use Card; if you need a one-off layout wrapper, style a plain element with Griffin classes instead. For multi-step tours anchored to a trigger, TeachingPopoverCarousel is a better fit than building a Carousel with CarouselCard by hand.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `autoSize` | `boolean \| undefined` | — | No | Sets the card styling to be responsive based on content. |

### Prop Guidance

- **autoSize**: Boolean that makes the card size itself responsively against its content instead of accepting whatever height the surrounding layout produces. Leave it unset for uniform, design-specified slide dimensions such as a fixed-aspect image rail; turn it on when slides contain variable-length text, optional metadata rows, or tiles that differ in height, so the tallest content is not clipped. Because it changes how the track measures cards, choose one strategy for the whole Carousel rather than mixing sized and auto-sized cards, which produces a visibly ragged slide row. `true`
- **root**: The single required slot that renders the card's outer element. It accepts className and standard element attributes, so this is where you place layout classes, data attributes, and any event handlers for the slide. Treat the root as a container only: do not force a role, position, or transform on it, because the carousel's slider owns track positioning and will conflict with manual layout. `className with theme spacing and surface tokens`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Wrap each logical slide in exactly one CarouselCard so that slide boundaries match the carousel's snap points and the card root element stays aligned with the slider track.
- Use the autoSize prop on slides whose content length varies, such as captions of different lengths or product tiles with optional badges, so the card grows to fit instead of clipping text.
- Keep slides visually uniform — a consistent aspect ratio, comparable text length, and similar media dimensions — so the carousel track does not jump between slides.
- Compose the inside of a CarouselCard from existing Fluent components such as Image, Card, CardHeader, CardPreview, Text, and Button so spacing, typography, and focus styling come from the theme.
- Give every interactive element inside a card an accessible name, either through visible text or aria-label, since several cards are mounted simultaneously and screen reader users move through them in DOM order.
- Provide a stable, unique key for each card when you map over a data array of slides, so that content is not remounted or re-measured on every carousel index change.
- Limit each card to one primary call to action; secondary actions should be visually subordinate so keyboard users can move predictably from slide to slide.

### Don'ts

- Do not render CarouselCard outside of a Carousel context — the parent components supply the viewport, the slider track, and the navigation state the card depends on for correct layout.
- Do not apply your own absolute positioning, negative margins, or transform rules to the card root; the slider transforms the track and conflicting transforms produce jittery drag and snap behavior.
- Do not nest another Carousel inside a CarouselCard; nested drag regions confuse pointer and keyboard interaction and create competing navigation controls.
- Do not use autoSize as a fix for cards that are stuffed with content that should have been trimmed — very tall cards with autoSize make every other slide appear misaligned.
- Do not make the entire card a single click target that swallows focusable children; users then cannot reach links or buttons that are nested inside the card.
- Do not render hundreds of cards eagerly in one carousel, especially when each card holds a full-resolution image or a heavy embed; all cards in the track are mounted at once.
- Do not hard-code pixel widths or heights inside a card that fight the fluid width the carousel assigns to each slide.

## Anti-Patterns

### Using CarouselCard as a general-purpose container

❌ CarouselCard is a slide wrapper whose layout expectations come from the carousel viewport and slider track. Rendering it standalone on a page yields a container with unexpected sizing behavior and no navigation context.

✅ Use Card (optionally with CardHeader, CardPreview, and CardFooter) for standalone content surfaces, and reserve CarouselCard for content that lives inside a Carousel.

### Mixing autoSize cards with fixed-size cards in one carousel

❌ The track then contains slides with incompatible measurement strategies, producing uneven heights, visible jumps while dragging, and inconsistent alignment of navigation dots or arrows.

✅ Decide per carousel: either give every card the same constrained dimensions and leave autoSize unset, or enable autoSize on all cards and keep content volumes comparable.

### Overriding the card root's position or transform

❌ The slider translates the track to move between slides. Custom transforms, absolute offsets, or negative margins on the card root fight that translation and cause stutter, misaligned snap points, and content that appears cut off.

✅ Style only the inner content of the card — padding, background, border, and typography — and let the carousel manage all positioning and motion for the track.

### Making the whole card a single link or button

❌ A card that is one giant click target prevents nested interactive elements from receiving focus and produces an enormous, ambiguously named control for screen reader users.

✅ Keep the card as a container and place a real Button or Link inside it, sized to its text, with a label that describes the destination or action.

### Stuffing every slide's full content into the DOM eagerly

❌ All cards are mounted at once, so heavy media, data tables, or live embeds inside cards slow the initial render and consume memory even on slides the user never sees.

✅ Keep slide payloads light, defer or lazy-load expensive media inside cards, and reduce the number of slides by paginating or grouping data rather than appending hundreds of cards.

## Accessibility

**Requirements**: Slide content must satisfy WCAG 1.4.3 for text contrast and 1.4.11 for non-text contrast against the themed card background, which normally means relying on theme foreground and background token pairs rather than custom colors. Any auto-advancing rotation controlled by CarouselAutoplayButton must respect WCAG 2.2.2 by offering a pause/stop mechanism, and the overall carousel should carry an accessible name on the Carousel element so that the region is identifiable. Interactive controls inside a card must meet WCAG 2.4.7 for visible focus and 2.5.5 for target size, and text inside a card must remain readable at 200% zoom (WCAG 1.4.4) — a common failure point when cards are given fixed heights.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the next focusable element in the visible cards; the card itself is not a tab stop, so focus lands on links, buttons, or other interactive children you place inside it. |
| `Shift+Tab` | Moves focus backwards to the previous focusable element, which may be in the previous card or in a navigation control such as CarouselNav. |
| `Enter` | Activates a link or button rendered inside the card when that element has focus. |
| `Space` | Activates a button rendered inside the card when that element has focus; on a scrollable parent it may instead scroll, so avoid making the card itself scrollable. |
| `ArrowLeft` | Handled by the Carousel/controller layer when focus is inside the carousel region, moving to the previous slide rather than scrolling the card content. |
| `ArrowRight` | Handled by the Carousel/controller layer when focus is inside the carousel region, moving to the next slide. |
| `Home` | Handled by the carousel region to jump to the first slide when the carousel's navigation supports it. |
| `End` | Handled by the carousel region to jump to the last slide when the carousel's navigation supports it. |

**ARIA**: aria-label — put this on interactive elements inside the card when they have no visible text, and on the Carousel container to name the whole region., aria-labelledby — use when a visible heading inside the card or a CarouselTitle-like element already names the region, so assistive technology reads the visible text., aria-hidden — applied by the carousel machinery to slides that are outside the visible area; do not set it manually on card content or you may hide focusable children that are still reachable by Tab., aria-roledescription — used by the carousel container to describe slides as slides; the card inherits this context rather than declaring it, so do not override it., aria-disabled — the correct choice for controls inside a card that are temporarily unavailable but still need to remain discoverable, rather than removing them from the DOM., role — the card root is a layout container; any grouping role you need for a composite slide should be added by the carousel container or by a Card component inside it, not by patching the card root.

**Screen Reader**: Because every card in the track is mounted, screen reader users encounter slide content in DOM order even when a card is partially or fully outside the visible viewport. The carousel container supplies the slide semantics and position announcements, so each card should read as an ordinary content group: a heading, supporting text, and clearly labeled actions. Keep card content self-describing — avoid phrases like "click here" or "learn more" with no context, since users navigating card by card will hear the same generic label repeatedly. When the carousel advances automatically or the user activates a nav button, the change of visible content is a visual-only update unless you surface it through a live region such as AriaLiveAnnouncer, so do not assume the new slide is announced.

## Styling

CarouselCard is a thin layout wrapper, so most visual styling happens on the content you compose inside it. Use className on the card root for tweaks such as tokens.spacingHorizontalL and tokens.spacingVerticalL for internal padding, tokens.colorNeutralBackground1 for a surface that adapts to light and dark themes, tokens.colorNeutralStroke1 with tokens.borderRadiusLarge for a subtle outlined slide, and tokens.shadow4 for an elevated promotional slide. Text inside a card should use tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.colorNeutralForeground1, and tokens.colorNeutralForeground2 for secondary copy rather than raw colors. Focus styles on interactive children come from the theme and resolve to tokens.colorStrokeFocus2, so avoid overriding outline with custom values. When you need motion, use tokens.durationNormal and tokens.curveEasyEase so card transitions feel consistent with the rest of Fluent. Prefer logical spacing tokens (spacingHorizontal*) over physical padding so the card mirrors correctly under right-to-left direction.

## Performance

Every CarouselCard you render is mounted in the slider track, so the cost of a carousel scales with the total number of cards, not with the number of visible slides. Keep card content lean, lazy-load images and videos inside cards, and avoid expensive work in render functions that run for each card. Enabling autoSize introduces content measurement work for the card, so combine it with stable content and memoized children rather than with content that changes size on every render, such as animated collapsibles or async-loaded images without reserved dimensions. Reserving intrinsic sizes for images prevents repeated relayout of the whole track. If a card's inner content depends on carousel index or selection state, derive that value from the parent once and pass it down as a prop instead of letting each card subscribe independently.

## Theming & Tokens

CarouselCard itself paints very little and inherits theme values through FluentProvider; the visible surface usually comes from content you compose inside it or from classes you apply to the root. Typical root styling uses tokens.colorNeutralBackground1 or tokens.colorNeutralBackground2 for the slide surface, tokens.colorNeutralStroke1 for borders, tokens.borderRadiusLarge and tokens.shadow4 for elevation, and tokens.spacingHorizontalL plus tokens.spacingVerticalL for padding. Card text composed with Text should resolve to tokens.colorNeutralForeground1, tokens.colorNeutralForeground2, and tokens.fontFamilyBase, which automatically switch between Fluent's light and dark themes and respond to brand ramps created with createLightTheme or createDarkTheme. Focus rings on interactive children inside cards use tokens.colorStrokeFocus2. The autoSize prop only affects layout measurement and has no theming impact.

## Migration Notes

CarouselCard has no equivalent in Fluent UI React v8; the Carousel family was introduced with the v9 suite and exposes a modern slot-based API, so there is no legacy prop mapping to preserve. Teams migrating from a third-party carousel library should map their per-slide template element onto CarouselCard and hand navigation, autoplay, and index state to CarouselNav, CarouselButton, and CarouselAutoplayButton instead of reimplementing them inside each card. If you previously relied on a fixed slide size from the third-party library, either keep that size on the content and leave autoSize unset, or adopt autoSize and let the card respond to its content.

## Edge Cases

- A CarouselCard with no children collapses to zero height, so slides can appear blank when content is conditionally rendered away; always keep a minHeight or guaranteed content in each slide.
- autoSize makes each card respond to its own content, so one unusually long caption can make a single slide much taller than its neighbors and misalign the whole row of visible slides.
- Cards narrower than their content overflow rather than scroll, because the card is not a scroll container; constrain long text with truncation or wrap it explicitly instead of expecting horizontal scrolling.
- Rendering cards under a right-to-left FluentProvider mirrors spacing automatically only when logical tokens such as spacingHorizontalL are used; physical left/right values produce asymmetric layouts.
- Slides partially clipped by the viewport still contain focusable elements, so a long list of cards can create a tab order that moves focus into content the user cannot see; keeping one interactive element per card limits the impact.
- Because the card root is a plain container, wrapping it in an element that sets overflow hidden can cut off focus outlines on nested controls at the card edge.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
