# CarouselNavImageButton

> **Package**: `@fluentui/react-carousel` v9.9.8
> **Import**: `import { CarouselNavImageButton } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

CarouselNavImageButton is a navigation primitive for the Fluent UI v9 Carousel family. It renders one thumbnail-style navigation control — an ARIA-compliant button whose only visual content is an image — that lets users jump directly to a specific slide or page of a carousel instead of stepping through it sequentially. The component is designed to live inside a CarouselNav / CarouselNavContainer strip and reads most of its behavior from the surrounding Carousel context: the currently active page (activeIndex or defaultActiveIndex), the visual treatment (appearance), the placement strategy (layout), the alignment (align), how many buttons share the strip (groupSize), whether navigation wraps (circular), how the strip scrolls (draggable, whitespace), how slides animate (motion), and how changes are announced (announcement). Because its root slot is typed as an ARIA button slot, it can be rendered as a real button or as a link-like element with disabled and focus semantics handled for you, while the required image slot supplies the thumbnail used as the button's label. It is the image-based sibling of CarouselNavButton and is most at home in image galleries, product media viewers, and hero rotations where a visual preview is more useful than a number or dot.

**When to use**: Use CarouselNavImageButton when the carousel's slides are primarily visual (photos, product shots, media thumbnails) and showing a miniature preview helps users recognize and jump to the page they want. Prefer it over CarouselNavButton when a numeric or dot indicator would not tell users enough about the destination slide. Reach for CarouselNavButton instead when slides are text-heavy, when thumbnails would be too small to be meaningful, or when you need the simplest, lowest-cost indicator. Use CarouselAutoplayButton alongside it when the carousel auto-advances, since users need a way to pause motion. Use CarouselNav / CarouselNavContainer to position the image buttons, and CarouselNavButton with navType prev or next when you want thumbnail-sized previous/next controls rather than page-jump controls.

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

- **root**: Required slot for the button element. It is typed as an ARIA button slot, so it carries button semantics, disabled handling, and focus behavior; pass a ref, className, or style through it to customize the control. `ARIA button slot with a descriptive aria-label`
- **image**: Required slot for the thumbnail rendered inside the button. Supply a small, compressed preview of the destination slide; the button has no text content, so this slot is what users actually see. `img slot containing the slide thumbnail source and alternative text`
- **children**: Render function for the button's inner content, typed as a nav button render function. Use it when the default image-only content needs extra decoration, such as an overlay caption or an active-state badge. `render function receiving the nav button state and returning the button content`
- **navType**: Marks the button as a previous or next control rather than a direct page jump. Set it when the thumbnail represents the adjacent slide in a stepped navigation pattern; leave it unset for gallery-style page thumbnails. `next`
- **layout**: Controls how the thumbnail strip is laid out relative to the carousel viewport. Match the value used by the surrounding nav container; overlay variants place thumbnails on top of the slide content and typically pair with autoSize. `overlay`
- **align**: Positions the navigation strip along the cross axis of the carousel. Use start or end for corner-anchored thumbnail rails and center for symmetric layouts. `center`
- **appearance**: Inherited appearance from the enclosing carousel that determines the visual emphasis of the thumbnail buttons. Set it on the carousel so every nav element stays visually consistent. `appearance value inherited from the enclosing Carousel`
- **autoSize**: Lets the thumbnail buttons size themselves from their content instead of using the strip's default sizing. Enable it for irregular thumbnail grids or overlay strips where uniform sizing would clip previews. `true`
- **activeIndex**: Controlled active page index. Provide it, together with onActiveIndexChange, when the application owns carousel state; the matching thumbnail is rendered in its selected state. `2`
- **defaultActiveIndex**: Initial active page index for uncontrolled usage. Use it to open the carousel on a specific slide without wiring up controlled state; it is ignored once activeIndex is supplied. `0`
- **onActiveIndexChange**: Callback fired when a thumbnail is activated and the active page changes. Use it to sync external state, analytics, or lazily load the newly active slide. `event handler receiving carousel index change data`
- **onCheckedChange**: Callback that reports the checked or selected change for the nav button. Useful when the navigation state is tracked separately from the carousel index, for example in analytics or custom selection logic. `event handler receiving carousel autoplay change data`
- **groupSize**: Number of pages the carousel advances per step, or auto to derive it from the viewport. Keep it aligned with how many thumbnails are actually reachable so every image button maps to a real page. `auto`
- **circular**: Wraps navigation so activating next on the last page returns to the first, and previous on the first page goes to the last. Enable it for looping galleries, but keep it consistent across every nav control in the carousel. `true`
- **draggable**: Allows the carousel to be panned by pointer or touch. Enable it for touch-first experiences; the thumbnail buttons remain the precise, keyboard-friendly alternative to dragging. `true`
- **whitespace**: Adds spacing between pages so partial neighboring slides peek into the viewport. Use it together with overlay navigation so thumbnails are not obscured by adjacent content. `true`
- **motion**: Selects the animation used when the active page changes. Choose a motion style that respects reduced-motion expectations and matches the carousel's other navigation controls. `motion value inherited from the enclosing Carousel`
- **announcement**: Function that generates the text announced to assistive technology when the page changes. Provide it so activation of a thumbnail gives screen reader users the same orientation that the visible slide gives sighted users. `announcer function returning a page description`
- **autoplayInterval**: Timing for automatic page advancement when the carousel autoplays. When used, always render a CarouselAutoplayButton so users can pause the rotation. `5000`
- **cardFocus**: Controls whether focus is moved into the active carousel card after navigation. Enable it when slides contain interactive content that users should be able to reach immediately after jumping via a thumbnail. `false`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `image` | — | Yes | Required: The image within the button |
| `root` | — | Yes | ARIA compliant nav buttons used to jump to pages |

## Best Practices

### Do's

- Always supply the required image slot with a real thumbnail of the target slide so the button communicates its destination visually.
- Match the layout value on the nav image buttons to the layout used by the enclosing CarouselNavContainer (inline, inline-wide, overlay, overlay-wide, or overlay-expanded) so the thumbnails sit in the correct track.
- Give each button a meaningful accessible label on the root slot rather than relying on the thumbnail, and leave the thumbnail decorative so the destination is announced once, not twice.
- Set navType to prev or next only for thumbnail-styled previous/next controls; leave it unset for ordinary page-jump thumbnails.
- Use autoSize when the thumbnails should size themselves within the strip and a fixed size when you need a uniform grid of previews.
- Control selection together with the other nav elements: when activeIndex is used, pair it with onActiveIndexChange so the highlighted thumbnail stays in sync with the visible slide.
- Choose groupSize thoughtfully when the strip contains many slides, so thumbnail buttons do not become too small to target or read.
- Pair image buttons with an announcement function when the surroundings are visual-first, so screen reader users are told which page they landed on after activation.

### Don'ts

- Do not render CarouselNavImageButton without the required image slot — there is no text fallback, so the button would be visually empty.
- Do not put a full-resolution photograph in the image slot; thumbnails should be small, compressed derivatives.
- Do not use the image button as a general-purpose thumbnail gallery item that navigates away from the carousel; it exists to change the active carousel page.
- Do not mix thumbnails with dots or numbers inside the same strip — pick one indicator style so the navigation reads as a single coherent control group.
- Do not rely on the thumbnail alone as the accessible name; an unlabeled image button is effectively anonymous to assistive technology.
- Do not force a fixed pixel size that fights the layout mode; overlay-expanded and autoSize thumbnails will be clipped or misaligned.
- Do not set both activeIndex and defaultActiveIndex — the controlled value always wins and the default becomes dead configuration.
- Do not autoplay without exposing an autoplay control and a non-trivial autoplayInterval; users must be able to stop the rotation.

## Anti-Patterns

### Unlabeled image-only buttons

❌ Because the image slot is the button's only visible content, omitting an accessible label on the root makes every thumbnail an anonymous button to screen reader users, who hear a list of identical controls.

✅ Put a descriptive aria-label on the root slot naming the destination page, and let the thumbnail be decorative so the name is not announced twice.

### Mixing thumbnails with dots or numbers

❌ A strip that contains image buttons alongside dot or numeric buttons is announced and perceived as two conflicting navigation models, and users cannot predict what activating an item will do.

✅ Pick one navigation style for a given carousel: use CarouselNavImageButton for visual galleries and CarouselNavButton for dot or numeric indicators, but not both in the same strip.

### Full-resolution images as thumbnails

❌ Loading hero-sized images into every thumbnail multiplies network and decode cost by the number of pages and delays the navigation strip, which users need before they can navigate at all.

✅ Generate small, compressed thumbnail derivatives for the image slot and load them lazily, keeping the strip's first paint fast and small.

### Hard-coding sizes against the layout mode

❌ Fixed pixel widths on thumbnails fight overlay and autoSize layouts, causing misaligned strips, clipped previews, and focus rings that render outside the visible area.

✅ Let the layout and autoSize props govern thumbnail sizing, and only constrain the strip's overall footprint on the nav container.

### Autoplay without a pause control

❌ Auto-advancing slides with no stop mechanism violates the pause/stop/hide expectation and makes it nearly impossible for users to activate a specific thumbnail before the page moves on.

✅ Render CarouselAutoplayButton next to the image navigation and use a generous autoplayInterval so users have time to choose a thumbnail.

## Accessibility

**Requirements**: Each nav image button must be perceivable and operable as a control: it needs a programmatic name (via the root slot's aria-label or equivalent accessible label), a visible focus indicator meeting WCAG 2.4.7, and a target size that satisfies WCAG 2.5.8 (at least 24 by 24 CSS pixels) even at the smallest thumbnail size. Non-text contrast (WCAG 1.4.11) must be preserved for any border or accent that communicates the active thumbnail — do not rely on a hue-only change. The thumbnail image itself is non-text content (WCAG 1.1.1) and should either be given a text alternative or be marked decorative when the button root already carries the label. If the carousel auto-advances, WCAG 2.2.2 requires a pause/stop mechanism, which is provided by pairing the navigation with CarouselAutoplayButton. Page changes should be announced so users understand that activating a thumbnail changed the displayed slide.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and out of the navigation strip; each image button is individually focusable in order. |
| `Shift+Tab` | Moves focus backwards to the previous focusable nav image button or out of the strip. |
| `Enter` | Activates the focused thumbnail button and makes the corresponding carousel page active. |
| `Space` | Activates the focused thumbnail button, equivalent to Enter. |
| `Arrow Left / Arrow Right` | Moves between carousel pages when focus is on the carousel content or the navigation, following the carousel's own keyboard handling. |
| `Home / End` | Jump to the first or last page when the carousel's navigation handles them, matching first/last thumbnail behavior. |

**ARIA**: aria-label, aria-disabled, aria-current, aria-selected

**Screen Reader**: Assistive technology perceives each CarouselNavImageButton as a button (with link semantics when the ARIA button slot is rendered as an anchor) whose name comes from the label supplied on the root slot. If the thumbnail carries no alternative text, the label is the only thing announced, so it must describe the destination page rather than the picture. The active thumbnail is exposed to assistive technology through its current or selected state, and page transitions are additionally surfaced through the carousel's announcement function, which reads out the new page context when navigation occurs. Disabled buttons remain in the accessibility tree and are announced as unavailable rather than being silently skipped.

## Styling

Style the thumbnail through the root and image slots rather than reaching into internals. On the root, control the container with tokens.borderRadiusMedium, tokens.spacingHorizontalXS and tokens.spacingVerticalXS for padding, and tokens.colorNeutralStroke1 or tokens.colorNeutralStrokeAccessible for the outline; express the active thumbnail with tokens.colorNeutralBackground1Selected plus tokens.colorStrokeFocus2 (or the brand equivalents tokens.colorBrandBackground and tokens.colorBrandStroke1) so selection is signaled by border and background, not hue alone. Hover and pressed feedback should use tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed, and focus rings should use the standard focus token tokens.colorStrokeFocus2 with the component's built-in focus indicator. The image slot typically wants a fixed aspect ratio, tokens.borderRadiusSmall or tokens.borderRadiusMedium for rounding, and tokens.colorNeutralBackground2 as a placeholder fill behind transparent or still-loading thumbnails. Overlay layouts place the strip over slide content, so apply a scrim with tokens.colorBackgroundOverlay or a translucent neutral background to keep the focus ring and active border visible over arbitrary imagery. Transitions between states should stay short — tokens.durationUltraFast or tokens.durationNormal with tokens.curveEasyEase — so the strip never feels sluggish to keyboard users.

## Performance

Each CarouselNavImageButton renders a thumbnail image, so the strip's cost scales with the number of pages — keep thumbnails small and consider lazy loading images that are off-screen. The component is selection-state driven: when the carousel's active index changes, the selected thumbnail re-renders as it reflects the new state, so avoid recreating inline render functions for the children slot on every parent render as that can defeat memoization. Image buttons that never change their slide content benefit from stable props and a stable render function. If the carousel has many pages, restrict how many thumbnails are mounted at once (for example by using groupSize or windowing the strip) rather than rendering hundreds of images that are never seen.

## Theming & Tokens

CarouselNavImageButton consumes the Fluent theme through Griffel tokens on its root slot: neutral surfaces use tokens.colorNeutralBackground1 with hover and pressed states from tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed, and the selected thumbnail uses tokens.colorNeutralBackground1Selected or its brand counterparts. Borders and outlines come from tokens.colorNeutralStroke1, tokens.colorNeutralStrokeAccessible, and tokens.colorBrandStroke1, while focus is drawn with tokens.colorStrokeFocus2. Shape and rhythm use tokens.borderRadiusSmall and tokens.borderRadiusMedium plus tokens.spacingHorizontalXS and tokens.spacingVerticalXS, and overlay strips may add a scrim using tokens.colorBackgroundOverlay. State transitions use tokens.durationUltraFast or tokens.durationNormal with tokens.curveEasyEase. Because the component is context-driven, changing appearance on the enclosing Carousel re-themes every thumbnail button at once.

## Migration Notes

CarouselNavImageButton is a v9 component with no direct v8 counterpart; v8 had no first-class carousel navigation primitive, so teams typically migrate from hand-built thumbnail rows, Pivot-based galleries, or third-party carousel libraries. When migrating, move the thumbnail markup into the image slot, move the click handler onto the carousel's active-index change callback (onActiveIndexChange) instead of custom state, and let the component's ARIA button slot handle disabled and focus semantics rather than reimplementing them with raw anchors.

## Edge Cases

- The image slot is required and there is no text fallback, so a missing or failed thumbnail leaves a blank, unlabeled-looking button — always provide both the image and a root label.
- The children prop is a render function, not plain content; passing static children instead of a function does not produce the expected button content.
- When both activeIndex and defaultActiveIndex are provided, the controlled value wins and the default is ignored, which can look like the carousel ignores its initial page.
- Layout values must be consistent with the surrounding CarouselNavContainer; an overlay thumbnail strip inside an inline container will be positioned unexpectedly.
- With circular disabled, the thumbnail for the first page is a dead end for stepped navigation, and with circular enabled users can loop endlessly — decide which behavior matches the content.
- autoSize thumbnails combined with a large groupSize can produce a strip wider than the viewport, requiring the strip to scroll or wrap.
- Auto-advancing carousels can move the active page before a keyboard user finishes tabbing to the desired thumbnail, so pairing with a pause control is essential rather than optional.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
