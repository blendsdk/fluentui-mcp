# CarouselNavButton

> **Package**: `@fluentui/react-carousel` v9.9.8
> **Import**: `import { CarouselNavButton } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

CarouselNavButton is the ARIA-compliant navigation button used inside a Carousel to jump directly to a specific page or slide. Each button represents one page of the carousel and is rendered through the root slot, which is typed as an ARIA button slot so that disabled and pressed/selected semantics are handled consistently for assistive technology. The component is typically placed inside CarouselNav (or CarouselNavContainer) and repeated once per carousel page, and it can also be rendered as an image thumbnail variant through the image slot and the NavButtonRenderFunction children callback. Beyond its own navType, autoSize, layout and onCheckedChange inputs, it also consumes values that the surrounding Carousel and nav container provide through context — including the carousel appearance, the active page index and its change handler, group sizing and alignment, motion and autoplay settings, and the active indicator state surfaced through onCheckedChange. The result is a compact, theme-aware control set that lets users jump anywhere in a carousel rather than stepping one page at a time with the previous and next buttons.

**When to use**: Use CarouselNavButton when users need direct, random-access navigation between carousel pages — for example an image gallery where a specific slide is known by position, or a multi-card carousel with a small, fixed number of pages. It is the right choice when the number of pages is small enough that one control per page stays readable and each button can carry a meaningful label. Prefer the plain previous/next controls (the navType prev and next buttons) when the page count is large or unbounded, since rendering dozens of dots creates visual noise and a long tab stop sequence. Consider CarouselNavImageButton-style rendering via the image slot when thumbnails communicate content better than position numbers. Avoid CarouselNavButton when the content is really a set of sibling views rather than paginated slides — TabList, Card selection, or a plain set of Buttons may express that intent more clearly.

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

- **root**: Required slot for the underlying ARIA button element. Use it when you need to attach refs, custom attributes, event handlers, or additional class names to the button, but keep the ARIA button semantics provided by the slot intact so disabled and selected states continue to be announced. `root={{ className: styles.navDot }}`
- **navType**: Marks a navigation button as the sequential previous or next control rather than a page-jump button. Set it to prev or next only on the stepping controls; leave it undefined for the numbered or dotted page selectors so they keep their page-selection semantics. `next`
- **autoSize**: When true, the button sizes itself from its content and available space instead of a fixed footprint — useful for image thumbnails and for nav strips inside narrow containers such as a card footer. Enable it when the number of pages is variable or the carousel width is fluid. `true`
- **layout**: Selects where and how the nav is presented relative to the carousel viewport. Use inline or inline-wide when the nav occupies normal document flow, and overlay, overlay-wide, or overlay-expanded when the nav is superimposed on the slides; the overlay layouts imply a backdrop treatment and higher contrast requirements. `overlay`
- **onCheckedChange**: Callback fired when the checked (selected page) state changes, receiving the change data. Use it to observe page selection, trigger analytics, or synchronize external state; it complements rather than replaces the carousel-level active index handler. `{ (data) => trackPageView(data) }`
- **image**: Required slot for the thumbnail image when the nav button is rendered as an image button instead of a dot. Render the same visual as the corresponding slide, and give the button an explicit accessible name because the image itself should be treated as decorative. `image={{ src: slide.thumbnailUrl, alt: '' }}`
- **children**: Required render function (NavButtonRenderFunction) that receives the nav button render state and returns the button's content. Use it to substitute a numeral, a thumbnail, or a custom indicator inside the same ARIA button wrapper, keeping the surrounding slot and semantics unchanged. `(state) => state.index + 1`
- **appearance**: Carousel-level appearance inherited from the surrounding Carousel context. It selects the visual treatment of the nav strip — brand-leaning versus neutral — so set it on the Carousel, not on individual nav buttons, to keep the whole carousel consistent. `brand`
- **activeIndex**: Controlled active page index supplied by the Carousel context. Use it together with onActiveIndexChange when the page state lives outside the carousel; the corresponding nav button renders as current automatically. `2`
- **defaultActiveIndex**: Uncontrolled initial page index provided by the Carousel context. Set it when you want the carousel to start on a specific page without managing state yourself. `0`
- **onActiveIndexChange**: Carousel-level change handler invoked when the active page changes, including changes triggered by a nav button. Use it to keep external state, routing, or announcements in sync with nav-driven page changes. `{ (_e, data) => setIndex(data.index) }`
- **align**: Aligns the nav within its container — center, start, or end. Set it on the nav container to position the button strip; use start or end when the nav shares a row with other controls such as the previous and next buttons. `center`
- **groupSize**: Controls how many items the carousel advances per step, either a fixed number or 'auto'. It affects the relationship between nav button count and visible slides, so choose a value that keeps one button sensibly mapped to one meaningful destination. `auto`
- **circular**: Enables wrap-around navigation so moving past the last page returns to the first. When circular is enabled, nav buttons remain the clearest way to jump to an arbitrary page from anywhere in the loop. `true`
- **draggable**: Allows pointer dragging of the carousel viewport as an alternative to pressing nav buttons. Keep the nav buttons present even when dragging is enabled, because dragging is not available to keyboard or assistive technology users. `true`
- **whitespace**: Adds spacing around carousel items so partial neighboring slides are visible. It changes how many slides are perceivable at once, which is worth accounting for when deciding how many nav buttons to render. `true`
- **motion**: Carousel-level motion configuration for transitions between pages. Choose a reduced or instant motion option when the surrounding experience must minimize animation, since nav button presses trigger the same transition as other navigation. `instant`
- **announcement**: Announcer function used to describe page changes to screen readers. Provide a custom implementation when the default page announcement is not descriptive enough for your content, since nav button activation is one of the main sources of page changes. `(index, total) => `Slide ${index + 1} of ${total}``
- **autoplayInterval**: Interval in milliseconds between automatic page advances. Be cautious when autoplay is enabled alongside a dense nav strip, because automatic movement can conflict with a user who is deliberately choosing a page via a nav button. `5000`
- **cardFocus**: Controls whether focus is placed on the carousel card when the page changes. Enable it when each page is an interactive card that should receive focus after a nav button moves the carousel, but disable it when focus should stay on the nav strip. `true`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | ARIA compliant nav buttons used to jump to pages |

## Best Practices

### Do's

- Give every CarouselNavButton a distinct accessible name, either through aria-label or visible content, so screen reader users hear which page each button selects rather than a string of identical 'button' announcements.
- Render exactly one CarouselNavButton per carousel page and keep that count in sync with the number of slides so the active indicator never points at a page that does not exist.
- Set navType to prev or next only for the sequential previous/next controls, and leave it unset for the page-jump buttons that make up the main nav strip.
- Use the onCheckedChange handler to react to page selection and to keep any external state, URL fragment, or analytics in sync with the carousel's active page.
- Enable autoSize when the nav strip sits in a constrained container such as a narrow card footer, so buttons shrink rather than forcing the carousel container wider.
- Choose a layout that matches where the nav sits: inline layouts for nav rendered in the normal flow below the viewport, and overlay layouts when the nav floats over the slides.
- Keep the default focus indicator intact so keyboard users can always see which navigation button currently has focus.

### Don'ts

- Do not use CarouselNavButton as a generic action button or a toggle for unrelated UI state — it exists to select a carousel page.
- Do not put the page-jump buttons outside the Carousel or CarouselNav container, because the active page index, appearance, and selected state come from that surrounding context.
- Do not render an image slot and text children in a way that produces two competing labels for the same button without an explicit aria-label clarifying the intent.
- Do not rely on color or the active indicator alone to communicate the current page — the active state must also be exposed through the button's ARIA semantics.
- Do not render one nav button per page when the carousel is virtualized or has a very large page count; fall back to previous/next navigation instead.
- Do not disable nav buttons to signal that a page is not yet available unless the corresponding slide genuinely cannot be shown; a disabled button in a nav strip is easy to miss.
- Do not remove the button's focus outline via styling overrides, since the nav strip is one of the primary keyboard entry points to the carousel.

## Anti-Patterns

### Unlabeled page dots

❌ Rendering a row of CarouselNavButtons with only visual dots and no accessible name produces a sequence of identical 'button' announcements, so screen reader users cannot tell which page each control selects.

✅ Provide a distinct accessible name per button through aria-label or through the children render function, for example including the page number and total, so each control is unambiguous when announced.

### Using nav buttons as general-purpose actions

❌ Repurposing CarouselNavButton for play/pause, share, or other unrelated actions overloads the nav strip and breaks the expectation that these controls select pages, while also confusing the selected-page state.

✅ Keep the nav strip limited to page selection and place other actions in their own controls, such as a distinct Button or ToggleButton next to the carousel, so each control has a single clear purpose.

### Nav buttons rendered outside carousel context

❌ Placing CarouselNavButton outside the Carousel or its nav container means the appearance, active index, layout, and selected state that come from context are unavailable, producing buttons that never reflect the current page or the carousel's theme.

✅ Always render the nav buttons inside the carousel's nav container so context flows down, and drive page state at the Carousel level with activeIndex and onActiveIndexChange rather than trying to manage it on the buttons.

### Active page conveyed by color alone

❌ If the current page is indicated only by a subtle fill change, users with low vision or color vision deficiencies cannot determine which page is displayed, and the state is not programmatically determinable.

✅ Combine color with an additional cue such as size, an outline, or a shape change, verify the non-text contrast of both states, and ensure the ARIA button semantics expose which page is currently selected.

### One nav button per slide in a very large carousel

❌ Rendering a nav button for each of dozens or hundreds of pages creates an extremely long tab sequence, a crowded visual strip, and unnecessary DOM nodes for pages the user will never navigate to directly.

✅ Fall back to sequential previous and next navigation for large or virtualized carousels, or cap the number of rendered page controls while keeping the total page count available to assistive technology.

## Accessibility

**Requirements**: Each CarouselNavButton must satisfy WCAG 2.1 AA: it needs a programmatic name (WCAG 4.1.2), a visible and non-color-only indication of the currently selected page (WCAG 1.4.1 and 1.4.11), and a visible focus indicator at a contrast ratio of at least 3:1 against adjacent colors (WCAG 1.4.11 and 2.4.11). Inactive and active button states must both meet 3:1 non-text contrast against the carousel background, and any hit target should be at least 24 by 24 CSS pixels with adequate spacing between adjacent nav buttons (WCAG 2.5.8). Because the nav buttons select pages, the current page must also be programmatically determinable, so a screen reader user can tell which page is displayed without relying on the visual fill or scale of the active indicator. Any motion the carousel uses to move between pages should respect reduced-motion preferences, and autoplay (configured on the Carousel rather than on the button) must be pausable.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the nav strip, and then through each CarouselNavButton in DOM order; the current page's button is usually the natural starting point. |
| `Shift+Tab` | Moves focus backwards out of or through the nav strip, returning to the preceding carousel control. |
| `Enter` | Activates the focused nav button and navigates the carousel to that button's page. |
| `Space` | Activates the focused nav button identically to Enter, navigating to the corresponding page. |

**ARIA**: aria-label, aria-disabled, aria-hidden, role

**Screen Reader**: The root slot is typed as an ARIA button slot, so a CarouselNavButton is announced as a button with its accessible name and its disabled or selected state, rather than as a plain clickable div. Screen reader users hear one announcement per page control, and activating one announces the newly displayed page through the carousel's announcer function. Because checkable button semantics are used internally to express which page is current, the currently displayed page's button is reported as selected or pressed in addition to being visually distinguished. Purely decorative imagery rendered through the image slot must be hidden from the accessibility tree so that the thumbnail does not create a second, conflicting name; the button's own aria-label remains the single source of truth for its name. When a nav button is unavailable, aria-disabled keeps it discoverable and focusable so users understand why it cannot be activated, instead of removing it from the tab sequence.

## Styling

Style CarouselNavButton through the root slot and let the surrounding layout drive most of the appearance rather than overriding each button. For the resting state use tokens.colorNeutralBackground1 with tokens.colorNeutralForeground1 for the glyph and tokens.colorNeutralStroke1 for any ring; hover with tokens.colorNeutralBackground1Hover and pressed with tokens.colorNeutralBackground1Pressed. Express the active page with a stronger fill such as tokens.colorBrandBackgroundSelected (or tokens.colorNeutralBackground1Selected for the neutral appearance) plus a slightly larger scale, and keep both states above 3:1 contrast. Use tokens.borderRadiusCircular for round page dots and tokens.borderRadiusMedium when the buttons are square tiles. Sizing works well with tokens.spacingHorizontalXS through tokens.spacingHorizontalMNudge for the gap between buttons and tokens.spacingVerticalXS for vertical rhythm inside an inline nav strip. Overlay layouts generally need a backdrop — tokens.colorNeutralBackgroundInverted or a translucent neutral with tokens.shadow8 — so the buttons stay legible on top of arbitrary slide imagery, and tokens.colorNeutralForegroundInverted for their content. Never remove the focus indicator: keep the outline based on tokens.colorStrokeFocus2 with tokens.strokeWidthThick, and adjust the offset for rounded buttons so the ring is not clipped. The autoSize input pairs naturally with a max-width on the nav container so buttons compress instead of wrapping.

## Performance

CarouselNavButton is deliberately lightweight, but it is rendered once per carousel page, so cost scales directly with page count. Keep the children render function and the root slot stable across renders — inline object literals for root or image force the slot to be reprocessed on every render of the carousel. Avoid recomputing per-button styling or creating new class name objects inside the render function; memoize styles once at the nav container level and share them. When the number of pages is large or pages are virtualized, reduce the number of rendered nav buttons rather than optimizing each one, since the tab stop count and DOM size are the dominant costs. Movement between pages re-renders the carousel and updates the selected state on the previously and newly active buttons, so keep carousel page content memoized to prevent expensive slide subtrees from re-rendering on every nav button press.

## Theming & Tokens

CarouselNavButton has no independent theme; it inherits from the surrounding Carousel through its appearance and layout context and from FluentProvider for everything else. In the neutral appearance, inactive buttons resolve to tokens.colorNeutralBackground1 with tokens.colorNeutralForeground1 and borders from tokens.colorNeutralStroke1, while the active page uses tokens.colorNeutralBackground1Selected or tokens.colorNeutralForeground1 with emphasis. In the brand appearance, the active indicator resolves to tokens.colorBrandBackgroundSelected or tokens.colorBrandBackground with tokens.colorNeutralForegroundOnBrand content, and interactive states use tokens.colorBrandBackgroundHover and tokens.colorBrandBackgroundPressed. Overlay layouts typically paint their backdrop with tokens.colorNeutralBackgroundInverted or a neutral alpha and rely on tokens.colorNeutralForegroundInverted for glyphs, plus tokens.shadow8 to separate the buttons from busy imagery. Shape and spacing follow the shared theme scale — tokens.borderRadiusCircular, tokens.borderRadiusMedium, tokens.spacingHorizontalXS, tokens.spacingHorizontalMNudge, tokens.spacingVerticalXS — and focus rings come from tokens.colorStrokeFocus2 with tokens.strokeWidthThick, so restyling the provider theme automatically restyles the entire nav strip.

## Edge Cases

- The component data exposes both a root slot typed as an ARIA button slot and an image slot plus a children render function; rendering an image thumbnail without an explicit accessible name leaves the button relying on the image, which should be treated as decorative, and it may end up unnamed.
- navType is intended for the sequential previous and next controls, so setting it on page-jump buttons can make a page selector behave like a stepper and confuse the selected-page semantics of the rest of the strip.
- The nav button count must stay in sync with the carousel page count — when pages are filtered, virtualized, or loaded asynchronously, an out-of-range active index leaves no button marked as current.
- autoSize changes the footprint of each button, so mixing auto-sized image buttons with fixed-size dot buttons in the same strip produces inconsistent alignment and spacing unless the layout is set deliberately.
- Overlay layouts place the buttons on top of arbitrary slide content, where contrast depends on the imagery behind them; a translucent backdrop or inverted foreground may be required to keep the indicators legible.
- When autoplay is active, a user selecting a page with a nav button can be immediately overridden by the next automatic advance unless autoplay is paused on interaction.
- Many carousel-level props such as appearance, layout, activeIndex, and autoplayInterval are provided by context rather than passed to an individual button; attempting to set them per button will not change the other buttons in the strip.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
