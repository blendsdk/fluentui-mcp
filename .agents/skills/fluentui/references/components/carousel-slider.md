# CarouselSlider

> **Package**: `@fluentui/react-carousel` v9.9.8
> **Import**: `import { CarouselSlider } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

CarouselSlider is the layout utility of the Fluent UI v9 Carousel family. It renders the root viewport/window of the carousel — the region that actually hosts the slides — and is responsible for positioning and scrolling through the CarouselCards placed inside it. Because it owns the visible window, it is where the overflow container, scroll-snap behavior and slide spacing live, while the visible chrome (navigation buttons, nav dots, autoplay controls) typically lives in sibling components inside the Carousel. The component exposes a single prop, cardFocus, which turns the slider into a keyboard focus group so that users can move left and right between cards with the arrow keys. When cardFocus is enabled, the flag is also propagated to descendant CarouselCards through React context so each card receives the appropriate focus attributes, producing the roving-focus behavior expected of a single composite widget rather than a long list of independent tab stops. CarouselSlider by itself renders no controls and has no visual identity of its own; it is a structural, primarily CSS-driven container that you place inside Carousel and, when overlaying navigation on top of the slides, inside CarouselViewport.

**When to use**: Use CarouselSlider whenever you build a carousel, because it is the element that renders the window in which slides are displayed; CarouselCards should be rendered as its children. Reach for it when you need a horizontally scrollable set of cards whose navigation is handled by the surrounding Carousel components (CarouselNavContainer, CarouselNav, CarouselNavButton, CarouselButton, CarouselAutoplayButton) and whose scroll position is driven by native scrolling plus scroll snap. Enable cardFocus when the content of each card is not independently focusable but you still want keyboard and screen reader users to be able to reach and step through every card — for example an image-only or marketing-card carousel. Leave cardFocus disabled when every card already contains exactly one focusable control (a single button, link, or form field), because the inner controls already provide the natural tab stops and an extra focus group would create redundant stops. If you need only static, non-navigable imagery, a plain Image or ImageSwatch layout is simpler than a full carousel.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `cardFocus` | `boolean \| undefined` | `false` | No | cardFocus sets the carousel slider as a focus group, enabling left/right navigation of elements.  This will also be passed into CarouselCards via context and set the appropriate focus attributes  Defaults: false |

### Prop Guidance

- **cardFocus**: Enables the slider as a keyboard focus group so users can navigate left and right between the CarouselCards with the arrow keys. The flag is also passed down to CarouselCards through context, which sets the appropriate focus attributes on each card. Use it when cards are not independently focusable and you want a single, roving tab stop for the whole set of slides; leave it false (the default) when each card already contains its own focusable control, so that inner controls remain the natural tab stops and users are not forced through duplicate focus stops. `true`
- **root (slot)**: The root slot renders the viewport/window element that holds the slides. Target it with className from makeStyles to control overflow, scroll snapping, gap between slides, padding, border, and background, and to attach token-based focus ring styles. Because it is the scroll container, its sizing should be fluid (percentage or flex based) rather than fixed pixels. `className`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | The root viewport/window of the carousel |

## Best Practices

### Do's

- Place CarouselSlider inside a Carousel so the slider participates in carousel context (active index, navigation state, and the propagation of cardFocus to CarouselCards).
- Use CarouselSlider as the single scroll container for the slides and keep every CarouselCard as a direct child so scroll snapping and index tracking stay predictable.
- Turn on cardFocus when card content is not otherwise reachable by keyboard, so users can move left and right between cards with the arrow keys instead of tabbing through an unbounded number of stops.
- Give the carousel an accessible name — for example by labelling the Carousel or the slider region with aria-label or aria-labelledby — when there is more than one carousel on the page.
- Style the slider root with Griffel tokens (tokens.spacingHorizontalM for gaps, tokens.spacingVerticalL for padding) so spacing stays consistent with the rest of the Fluent UI v9 surface and adapts to density and RTL.
- Verify the carousel end to end with a keyboard only and with a screen reader, confirming that focus enters the slider, moves between cards when cardFocus is set, and exits to the next page element without being trapped.
- Keep navigation controls in CarouselNavContainer or CarouselButton elements that are siblings of the slider (or children of CarouselViewport) so they stay in place while slides scroll.

### Don'ts

- Don't render more than one CarouselSlider inside a single Carousel — the carousel tracks one set of slides and multiple scroll windows desynchronize navigation, index, and announcements.
- Don't enable cardFocus when every card already contains one tabbable control, since users then have to tab twice per card (once for the card focus group stop, once for the inner control).
- Don't place navigation buttons, pagination dots, or autoplay controls inside the slider root; they scroll away with the slides instead of remaining pinned to the carousel.
- Don't set fixed pixel widths or heights, or overflow: hidden, on ancestor elements of the slider, because that clips the scroll window and breaks momentum scrolling and scroll snapping.
- Don't assign tabIndex manually to CarouselCards in an attempt to create keyboard navigation; the focus group established by cardFocus manages focus attributes and manual values conflict with it.
- Don't toggle cardFocus dynamically on every render or during scrolling; it is a layout-level configuration flag that should be decided once per carousel.
- Don't rely on cardFocus to make non-interactive text actionable — if a card represents an action, keep a real Button, Link, or Card-composed control inside it.

## Anti-Patterns

### Navigation controls inside the scroll window

❌ Placing carousel navigation buttons, dots, or autoplay controls inside the CarouselSlider root makes them part of the scrolling content, so they drift out of view as slides move and can be scrolled out of reach entirely.

✅ Render navigation as siblings of the slider — for example in CarouselNavContainer with CarouselButton and CarouselNav items, or in a CarouselViewport overlay — so they remain pinned while the slider scrolls.

### cardFocus enabled alongside focusable card content

❌ Each card becomes both a focus-group stop and the container of its own tabbable control, so keyboard users must press Tab twice per card and screen reader users hear redundant stops, which makes long carousels exhausting to traverse.

✅ Enable cardFocus only when cards have no independent tab stop. If each card contains exactly one interactive control, leave cardFocus at its default of false and let the inner controls provide the tab stops.

### Multiple sliders in one carousel

❌ Rendering more than one CarouselSlider inside the same Carousel creates two scroll containers competing for the same active index, so navigation buttons, scroll position, and cardFocus propagation no longer agree about which slide is visible.

✅ Use exactly one CarouselSlider per Carousel and render every slide as a CarouselCard child of that single slider; split content into multiple carousels only when they are logically separate and each has its own controls.

### Clipping or sizing the slider from ancestors

❌ Applying overflow: hidden, fixed heights, or fixed widths on elements around the slider clips the scroll window and breaks momentum scrolling and scroll snapping, so slides get cut off or the user cannot scroll past a certain point.

✅ Keep the scroll window fluid, allow the container to grow with its content or use flex/percentage sizing, and put any intentional clipping directly on the slider root where it can be reasoned about.

### Manual tabIndex on cards

❌ Hand-setting tabIndex values on CarouselCards fights the focus-group management that cardFocus performs through context, producing inconsistent or unreachable focus states that change with unrelated re-renders.

✅ Never set tabIndex on cards directly. Choose cardFocus once for the carousel and let the component manage focus attributes for all of its cards.

## Accessibility

## Styling

CarouselSlider is styled almost entirely through CSS, so apply a makeStyles class to the root slot and let the browser do the scrolling work rather than animating with script. Put the overflow and scroll behavior on the root: overflow-x auto with a scroll-snap-type on the slider, and matching scroll-snap-align plus a scroll margin on each CarouselCard. Use logical, token-based spacing — tokens.spacingHorizontalM or tokens.spacingHorizontalL for the gap between slides, tokens.spacingVerticalL for vertical breathing room — so the layout flips correctly in right-to-left locales. Give the region the surrounding surface color with tokens.colorNeutralBackground1 and separate it from the page with tokens.colorNeutralStroke2 on the border or tokens.shadow2/tokens.shadow4 on the cards. Focus indicators on focused cards should use tokens.colorStrokeFocus2 with tokens.strokeWidthThick rather than a hand-picked outline color, so the focus ring remains visible in high-contrast themes. If you animate scroll position or scroll-behavior, align durations with tokens.durationNormal and tokens.curveEasyEase. Hiding scrollbars for a cleaner look is possible, but ensure the navigation controls still make all slides discoverable, and avoid hard-coded pixel widths — use percentage or flex-based sizing so the window adapts to its container and to different densities.

## Performance

CarouselSlider itself is a thin container, so most cost comes from what you render inside it: keep the number of CarouselCards reasonable, keep each card's subtree light, and avoid expensive work in card render bodies because a change to the shared carousel context can re-render every card. The cardFocus flag is delivered through context, so changing it at runtime re-renders all descendants — set it once per carousel rather than toggling it during scrolling or on every state change. Prefer native CSS scrolling with scroll snap over scripted scroll animations, avoid inline style objects that create new identities each render, and avoid measuring or forcing layout synchronously during scroll events. If you must handle scroll or navigation events, use passive listeners and throttle or debounce the work so the compositor can keep scrolling smooth on lower-end devices.

## Theming & Tokens

CarouselSlider has almost no intrinsic visual styling, which means it inherits its surface from the FluentProvider theme rather than defining colors itself: the surrounding surface typically reads through tokens.colorNeutralBackground1 or tokens.colorNeutralBackground2, and the cards inside carry elevation with tokens.shadow2 or tokens.shadow4 and separation with tokens.colorNeutralStroke2. Spacing between and around slides should be expressed with tokens.spacingHorizontalM, tokens.spacingHorizontalL, tokens.spacingVerticalM, and tokens.spacingVerticalL so the carousel respects density and directionality, and corner treatment should use tokens.borderRadiusMedium or tokens.borderRadiusLarge. Focus rings on focused cards should be drawn from tokens.colorStrokeFocus2 with tokens.strokeWidthThick so they remain visible in high-contrast and dark themes, and any transitions on scroll position or card states should reference tokens.durationNormal and tokens.curveEasyEase. Because these are theme tokens rather than literal values, the slider adapts automatically when the brand, high-contrast, or dark theme is swapped at the FluentProvider level, including right-to-left layout via logical spacing values.

## Migration Notes

The Carousel component family, including CarouselSlider, is part of the Fluent UI v9 component set and has no direct counterpart in Fluent UI v8, so adoption is a new integration rather than a prop-for-prop migration. When moving an existing custom carousel to v9, the main structural changes are: split the single custom scroll container into Carousel plus CarouselSlider (window and layout), CarouselCard (each slide), and dedicated navigation components; replace manual key handlers with the cardFocus focus-group behavior; and replace hard-coded spacing, colors, and durations with Griffel tokens from the active FluentProvider theme.

## Edge Cases

- Running CarouselSlider outside a Carousel (or outside the appropriate carousel context provider) leaves the slider without cardFocus propagation and carousel state, so cards will not receive focus attributes and navigation controls will not control the slides.
- When cardFocus is false, CarouselCards are not added to the tab order; if a card has no focusable content of its own, keyboard users cannot reach it at all, so choose the flag deliberately for content-only slides.
- RTL locales can invert the perceived meaning of ArrowLeft and ArrowRight and of the scroll direction — test arrow-key navigation and scroll snap behavior in a right-to-left FluentProvider before shipping.
- Nested scroll containers inside a card (for example a horizontally scrolling list within a slide) can trap or confuse scrolling gestures on touch devices, so prefer non-scrolling content inside cards or make the inner scroller clearly bounded.
- Toggling cardFocus at runtime re-renders all cards because the value travels through carousel context, which can drop the user's current focus position; keep the value stable for the lifetime of the carousel.
- Auto-advancing carousels (`CarouselAutoplayButton`) must not move focus or interrupt a user who is reading, and motion should be pausable; pair autoplay with the explicit pause control rather than relying on hover alone.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
