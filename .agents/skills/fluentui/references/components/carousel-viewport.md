# CarouselViewport

> **Package**: `@fluentui/react-carousel` v9.9.8
> **Import**: `import { CarouselViewport } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

CarouselViewport is the visible window of a Carousel: a required, presentational container that clips and sizes the carousel's sliding track so that only the current group of CarouselCard items is visible and interactable. It renders a single div through its required root slot, holds the CarouselSlider that positions the cards, and defines the hit area for drag and swipe gestures when draggable is enabled. Because the viewport is the element that gets measured, it effectively determines how many cards fit per page, how auto-sizing behaves, and how the previous/next controls clamp at the ends of the track. It is a context consumer rather than a standalone widget: values such as appearance, layout, align, circular, groupSize, motion, autoplayInterval, activeIndex, defaultActiveIndex and the announcement function flow into it from the enclosing Carousel, and the viewport reflects those settings in what it shows and how it moves. Every Carousel needs at least one viewport for cards to appear at all; without it there is nothing to page through.

**When to use**: Use CarouselViewport whenever you build a Carousel - it is a required structural subcomponent, not an optional decoration. Reach for it when you need a paged, swipeable gallery of heterogeneous content (promotional cards, image slides, product tiles, onboarding steps) where each item is a CarouselCard with its own rich layout, because the viewport plus the rest of the carousel family gives you grouping, drag paging, autoplay and index announcements out of the box. Do not use it as a general-purpose overflow container or horizontal scroller outside a Carousel, and do not use it when a single static image (Image) or a simple list of homogeneous rows (List, Listbox, DataGrid) would communicate the content better. If you only need to peek at adjacent items in a plain scroll region, a styled div or List with horizontal overflow is lighter and less constrained than a full carousel.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `activeIndex` | `number` | — | No | — |
| `align` | `'center' \| 'start' \| 'end'` | — | No | — |
| `announcement` | `CarouselAnnouncerFunction` | — | No | — |
| `appearance` | `CarouselAppearance` | — | No | — |
| `autoSize` | `boolean` | — | No | — |
| `autoplayInterval` | `number` | — | No | — |
| `cardFocus` | `boolean` | — | No | — |
| `children` | `NavButtonRenderFunction` | — | Yes | — |
| `circular` | `boolean` | — | No | — |
| `defaultActiveIndex` | `number` | — | No | — |
| `draggable` | `boolean` | — | No | — |
| `groupSize` | `number \| 'auto'` | — | No | — |
| `image` | `NonNullable<Slot<'img'>>` | — | Yes | — |
| `layout` | `'inline' \| 'inline-wide' \| 'overlay' \| 'overlay-wide' \| 'overlay-expanded'` | — | No | — |
| `motion` | `CarouselMotion` | — | No | — |
| `navType` | `'prev' \| 'next'` | — | No | — |
| `onActiveIndexChange` | `EventHandler<CarouselIndexChangeData>` | — | No | — |
| `onCheckedChange` | `EventHandler<CarouselAutoplayChangeData>` | — | No | — |
| `root` | `NonNullable<Slot<ARIAButtonSlotProps>>` | — | Yes | — |
| `root` | `NonNullable<Slot<ARIAButtonSlotProps>>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `whitespace` | `boolean` | — | No | — |

### Prop Guidance

- **root**: Required single div slot representing the viewport outer container. It is the element that defines the visible and interactable area, so sizing, radius, overflow and background belong here; className, style and pass-through ARIA props are spread onto it. `root with a className for height and overflow hidden`
- **children**: The viewport's content is normally a CarouselSlider whose children are CarouselCard items. The render-function variant listed in the aggregated carousel types belongs to the nav components in the same package, which accept a NavButtonRenderFunction child to generate their buttons; the viewport does not use it. `CarouselSlider containing CarouselCard items`
- **autoSize**: When true the viewport tracks the size of the visible cards instead of reserving a fixed box, which is useful when card heights differ. Leave it off when you want a stable frame height across pages so the surrounding layout does not shift. `true`
- **layout**: Selects how the carousel arranges its controls relative to the viewport, from inline placements to overlay variants that sit on top of the viewport. Pick an overlay option when the design calls for controls floating over the cards, and remember the viewport needs insets or padding so cards are not hidden behind those controls. `overlay`
- **appearance**: A CarouselAppearance value that flavors the carousel's controls. It is supplied by the enclosing Carousel and flows into the viewport context, so set it on the Carousel rather than trying to theme the viewport element directly. `the value set on the enclosing Carousel`
- **align**: Controls how the visible group is aligned horizontally within the viewport when it does not fill the track, for example on a last page with fewer cards than groupSize. Use center for balanced galleries and start for content that should read left to right against the frame edge. `center`
- **activeIndex**: The controlled active card index. Pass it together with onActiveIndexChange to own paging state yourself, which is required if other UI must reflect or drive the current slide. `0`
- **defaultActiveIndex**: The uncontrolled starting index used when you do not pass activeIndex. Use it to deep-link into a carousel at a specific card without managing state. `0`
- **onActiveIndexChange**: Callback receiving CarouselIndexChangeData whenever the visible group changes through nav, drag or autoplay. Use it to sync external state such as a slide counter or analytics, and combine it with activeIndex for a fully controlled carousel. `handler that stores the newly reported index`
- **circular**: When true, paging wraps from the last group back to the first and vice versa. When false, the carousel clamps at both ends and the corresponding nav buttons become disabled, so users get a clear sense of start and finish. `true`
- **draggable**: Enables pointer and touch dragging directly on the viewport surface to move between groups. Turn it on for mobile and trackpad style experiences, and confirm it does not intercept vertical scrolling in long pages. `true`
- **groupSize**: Sets how many cards are shown and moved as one page, either as a fixed number or as auto to fit as many whole cards as the viewport allows. Fixed counts need uniform card widths, while auto is the safer choice for responsive layouts. `auto`
- **whitespace**: Toggles the whitespace the viewport reserves at the start and end of the track when the visible group does not exactly fill it. Enable it together with align to keep a partially visible neighboring card visually separated from the frame edge. `true`
- **motion**: A CarouselMotion value, provided by the enclosing Carousel, that determines how the track transitions between groups and how reduced-motion preferences are honored. Configure it once on the Carousel instead of per viewport. `inherited from the parent Carousel`
- **announcement**: A CarouselAnnouncerFunction supplied by the Carousel that builds the live-region message announced when the active index changes. Override it at the Carousel level to provide localized or more descriptive slide position text. `inherited from the parent Carousel`
- **autoplayInterval**: Number of milliseconds between automatic advances when autoplay is running. Keep intervals long enough to read a card, and always pair autoplay with a CarouselAutoplayButton so users can stop it. `5000`
- **cardFocus**: Keeps keyboard focus on the active card while the visible group changes, instead of letting focus fall away as cards move. Enable it when cards contain interactive content that users navigate with the keyboard. `true`
- **navType**: A previous or next direction marker used by the carousel's nav button components to express which way they page. It belongs to CarouselButton and CarouselNavButton, not to the viewport. `next`
- **onCheckedChange**: Change handler for the carousel's playback controls, receiving CarouselAutoplayChangeData. This belongs to the autoplay button component, not to the viewport. `handler for the autoplay button state`
- **image**: An img slot used by the image-based nav button variant. It belongs to CarouselNavImageButton and is unrelated to the viewport, whose images live inside the cards. `image slot on the image nav button`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | The viewport outer container, defining the size of the carousels visible and interactable area |

## Best Practices

### Do's

- Render CarouselViewport as a direct child of Carousel, give it CarouselSlider as its child, and place every CarouselCard inside that slider so paging math and motion apply to the whole track.
- Give the viewport a deterministic size - a fixed height, a min-height, or an aspect ratio - so grouping and previous/next clamping stay stable as cards change.
- Forward a className or style to the root slot to apply overflow: hidden and a border radius, so cards with rounded corners are clipped cleanly at the viewport edges.
- Enable draggable when the experience is touch or pointer driven, and verify that the drag gesture does not fight vertical page scrolling.
- Let carousel-level settings (appearance, layout, align, circular, groupSize, motion, autoplayInterval) live on the enclosing Carousel and be consumed by the viewport, rather than trying to re-declare them per viewport.
- Set autoSize to true when card heights differ and you want the viewport to hug the currently visible card instead of reserving the tallest card's height.
- Keep navigation and playback controls (CarouselNav, CarouselNavContainer, CarouselNavButton, CarouselAutoplayButton, CarouselButton) outside the viewport, or rely on the overlay layouts so the carousel positions them.
- Keep all cards the same width so a numeric groupSize divides the track evenly and the last page does not end on a partially rendered card.

### Don'ts

- Do not render CarouselViewport outside of a Carousel - it depends on carousel context for the active index, grouping, motion and announcements.
- Do not nest a CarouselViewport inside another CarouselViewport or place a full Carousel inside a card without deliberate gesture handling; competing swipe targets make both carousels hard to control.
- Do not apply transforms, translations or scroll-snap styling to the viewport root - the slider owns track positioning and your transform will desync the visible cards from the active index.
- Do not put pagination dots or nav buttons inside the viewport, since they translate away with the cards and leave the user without a stable control.
- Do not assume the viewport is focusable or that it has button semantics; it renders a plain div, so keyboard users reach carousel content through the nav buttons and through focusable elements inside cards.
- Do not switch the viewport root to overflow-x auto or scroll for paging; native scrolling bypasses the carousel's index bookkeeping and announcements.
- Do not hard-code a height that is smaller than your tallest card, because content will be clipped with no indication that more exists.

## Anti-Patterns

### Turning the viewport into a native scroller

❌ Adding overflow-x auto, scroll snapping or a manual transform to the viewport root competes with the carousel's own track positioning. The visible cards and the tracked active index drift apart, nav buttons report the wrong state, and index announcements fire for a slide the user is not looking at.

✅ Keep overflow hidden on the viewport root and let CarouselSlider and CarouselCard handle movement. Use the draggable prop for gesture paging and keep all transforms out of your own styles.

### Rendering nav and pagination inside the viewport

❌ CarouselNav, dots and autoplay controls placed inside the viewport translate along with the cards, so they slide off screen or land on top of card content, and the controls users rely on become unreachable at certain indices.

✅ Place navigation as siblings of the viewport (typically inside CarouselNavContainer) or choose an overlay layout so the carousel positions the controls relative to, not inside, the moving track.

### Leaving the viewport unconstrained

❌ A viewport with no height, min-height or aspect ratio collapses to nothing or jumps between pages when card content differs in height, producing visible layout shift and cards clipped without any hint that content is hidden.

✅ Give the root slot a stable box through a fixed height, a min-height or an aspect ratio, or enable autoSize when variable heights are intentional so the frame hugs the visible cards.

### Mixing uneven card widths with a fixed group size

❌ With cards of different widths and a numeric groupSize, the paging math leaves stray partial cards, the last page shows fewer items than expected, and previous/next clamping looks broken at the ends of the track.

✅ Give every card the same width via a shared class, and either accept a numerical groupSize with matched widths or use the auto group size so the carousel derives the count from the measured viewport.

### Reusing the viewport as a generic overflow container

❌ CarouselViewport expects carousel context; rendering it outside a Carousel, or wrapping arbitrary scrollable content in it, leaves the element with no active index, no motion and no announcements, doubling up with whatever scrolling the content already has.

✅ Use a plain div, List or Listbox for ordinary scroll regions and reserve CarouselViewport for content that genuinely pages through cards inside a Carousel.

## Accessibility

**Requirements**: The viewport itself renders an unlabelled div and carries no role, so an accessible name for the region must be supplied on the enclosing Carousel element via aria-label or aria-labelledby. Every image placed inside a card needs meaningful alternative text, and any interactive content inside cards (links, buttons, checkboxes) must remain focusable and operable. Autoplay must satisfy WCAG 2.2.2 Pause, Stop, Hide: provide a CarouselAutoplayButton or equivalent way to stop movement, and never start autoplay on content the user cannot pause. Respect WCAG 2.3.3 Animation from Interactions and prefers-reduced-motion by choosing the appropriate motion setting so sliding does not trigger for users who opt out. The carousel must reflow to a single card wide under WCAG 1.4.10 Reflow, and all paging must be achievable by keyboard per WCAG 2.1.1, which in practice means the nav buttons outside the viewport must be reachable by Tab.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the carousel - first to the nav and autoplay controls that sit outside the viewport, then into focusable elements inside the currently visible card. |
| `Shift+Tab` | Moves focus backward out of the card content and then out of the carousel controls. |
| `Enter` | Activates the focused control that operates the viewport (CarouselNavButton or CarouselAutoplayButton) or the focused interactive element inside a card, such as a Link or Button in the card footer. |
| `Space` | Performs the same activation as Enter for button-like controls inside the carousel, including nav and autoplay buttons. |
| `ArrowLeft and ArrowRight` | Do not scroll or page the viewport by themselves; visible-group changes come from the nav buttons. When cardFocus is enabled, focus stays on the card as the active group changes instead of being dropped to the document. |

**ARIA**: aria-label, aria-labelledby, aria-live, aria-atomic, aria-hidden, aria-disabled, role

**Screen Reader**: Because CarouselViewport renders a plain div with no role, screen readers pass straight through it to the card content it contains; the viewport is not announced as a landmark or as a button. Cards outside the visible group are removed from the accessibility tree, so users only encounter the items they can actually see, and the position of the group is conveyed through live-region text produced by the carousel's announcement function via the AriaLiveAnnouncer rather than by the viewport element itself. Nav and autoplay buttons carry the ordinary button semantics (with aria-disabled when circular is false and an end is reached), and when cardFocus is enabled, focus is retained on the active card across page changes so screen reader users do not lose their place in the reading order.

## Styling

Style the viewport through its root slot - either with a Griffel makeStyles class forwarded as className or with an inline style - and keep the surface minimal so the cards themselves carry the visual identity. Use tokens.borderRadiusLarge or tokens.borderRadiusXLarge plus overflow hidden on the root so card corners are clipped to the viewport frame, tokens.colorNeutralBackground1 or tokens.colorNeutralBackground2 for the viewport backdrop, and tokens.spacingHorizontalM / tokens.spacingHorizontalL for any inset padding between the frame and the first card. Pair tokens.colorNeutralShadowAmbient with tokens.colorNeutralShadowKey for a soft elevation effect, and tokens.colorNeutralStroke1 for a hairline border that separates the viewport from the nav row. Control height responsively with an aspect ratio or a min-height rather than fixed pixels, and keep per-card gap, radius and shadow on the cards or the slider so the viewport stays a pure clipping frame. Focus rings for content inside cards should use tokens.colorStrokeFocus2, and any transition you add around the frame (for example opacity when autoSize changes height) should be timed with tokens.durationNormal and tokens.curveEasyEase.

## Performance

The viewport itself is a single div, so its render cost is negligible; the cost lives in the cards it contains. Motion is driven by transforms on the track, which stay on the compositor and avoid layout for each frame, but an unvirtualized carousel renders every card in the DOM even when it is off screen, so keep card counts modest or keep card content light. Both autoSize and the auto group size require measuring the viewport, and autoSize re-measures as the active group changes, so prefer a stable frame in very long lists. The draggable prop attaches pointer handlers to the viewport surface, so many simultaneous carousels on one page multiply listener and measurement work, and a short autoplayInterval forces frequent state updates that re-render the carousel and its visible cards. Memoize card children and avoid creating new style objects inline on every render so paging does not invalidate the whole card tree, and lazy-load card images so dragging stays smooth with large media.

## Theming & Tokens

The viewport is a presentational surface that reads theme values from the surrounding FluentProvider rather than defining its own palette. Its backdrop normally comes from tokens.colorNeutralBackground1 or tokens.colorNeutralBackground2, its frame from tokens.colorNeutralStroke1, and any elevation from tokens.colorNeutralShadowAmbient and tokens.colorNeutralShadowKey. Corner treatment uses the radius scale (tokens.borderRadiusMedium through tokens.borderRadiusXLarge), spacing between the frame and the cards uses tokens.spacingHorizontalM and tokens.spacingHorizontalL, and focus indication for content inside cards uses tokens.colorStrokeFocus2. Slide transitions consume motion tokens such as tokens.durationNormal, tokens.durationSlow, tokens.curveEasyEase and the accelerate/decelerate curves, which is how the carousel adapts when motion is reduced. The carousel-level appearance setting influences the surrounding controls through brand tokens such as tokens.colorBrandBackground and tokens.colorNeutralForegroundOnBrand, while the viewport itself simply inherits the themed surface and adapts automatically in dark and high-contrast themes.

## Migration Notes

CarouselViewport has no direct counterpart in Fluent UI v8, which shipped no carousel family; teams migrating from custom or third-party sliders should map their scrolling track container to CarouselViewport, their slide wrapper to CarouselSlider plus CarouselCard, and their dots and arrows to CarouselNav and CarouselNavButton. Anything previously handled with manual overflow scrolling, scroll-snap CSS or a transform on a wrapper should be deleted in favor of the viewport and slider, and any custom announcement logic should be replaced by the carousel's announcement function so it flows through AriaLiveAnnouncer.

## Edge Cases

- CarouselViewport requires carousel context; rendering it outside a Carousel yields no active index, no grouping and no announcements, and it will not behave as a carousel on its own.
- With circular disabled, the previous button is disabled on the first group and the next button on the last; if card widths do not divide evenly, that last page can also look partially empty.
- A final group containing fewer cards than groupSize is laid out according to align, so the trailing space appears at the start or end depending on that setting.
- autoSize with dramatically different card heights causes the viewport to resize on every page change, which can look like layout jitter next to surrounding content; a fixed or aspect-ratio frame avoids it.
- Nested carousels - a carousel inside a CarouselCard - compete for the same drag gestures, so the inner viewport needs its own hit area and the outer one should not steal the swipe.
- Autoplay keeps advancing while the carousel is scrolled out of view unless the application pauses it, so pausing on hover, focus or intersection is the consumer's responsibility.
- Setting groupSize larger than the number of cards collapses the carousel to a single page with no forward navigation, which is easy to mistake for a broken control.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
