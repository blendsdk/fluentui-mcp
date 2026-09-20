# CarouselNavContainer

> **Package**: `@fluentui/react-carousel` v9.9.8
> **Import**: `import { CarouselNavContainer } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

CarouselNavContainer is the layout wrapper that positions the navigation controls of a Fluent UI Carousel relative to the carousel viewport. It exposes dedicated slots for the previous button (prev), the next button (next), and the autoplay toggle (autoplay), each with an optional companion tooltip slot (prevTooltip, nextTooltip, autoplayTooltip), so you can drop CarouselButton, CarouselAutoplayButton, or custom button elements into a single, consistently arranged control strip. The single layout prop selects one of five preset arrangements: 'inline' (the default) places controls in normal flow beneath the viewport, 'inline-wide' pushes the previous/next buttons to the far left and right, 'overlay' floats the controls over the bottom of the viewport, 'overlay-wide' does the same but pushes prev and autoplay/next to the far sides, and 'overlay-expanded' floats the prev/next buttons on the vertical center of each side. It is a presentational grouping element: it holds no carousel state of its own, so it re-renders only as a consequence of the carousel state or slot content you pass to it.

**When to use**: Use CarouselNavContainer when you want the carousel's built-in navigation affordances (previous, next, and optionally autoplay) placed for you, instead of composing and positioning those buttons yourself. Choose one of the inline layouts when the navigation should occupy its own space in the page layout and never obscure slide content — this is the safest choice for cards, mixed content, and dense pages. Choose an overlay layout when the carousel is a hero or edge-to-edge media experience and you want slides to bleed to the full viewport width, with controls floating on top; use 'overlay-wide' when autoplay must sit next to the far-edge next button, and 'overlay-expanded' when you want large, vertically centered prev/next affordances flanking the media. Reach for CarouselNav plus CarouselNavButton or CarouselNavImageButton instead when you need thumbnail-style or fully custom navigation, and do not combine that custom navigation with CarouselNavContainer in the same carousel, because users would then see two competing sets of controls.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `layout` | `"inline" \| "inline-wide" \| "overlay" \| "overlay-wide" \| "overlay-expanded" \| undefined` | — | No | Default: 'inline' Defines the nav container layout:  'inline' - Default controls inline with carousel view   inline-wide - Similar to inline but places nav buttons on far left/right  'overlay' - Controls overlaid on bottom of carousel viewport,  'overlay-wide' - Controls overlaid on bottom of carousel viewport with prev+autoplay/next buttons on far side  'overlay-expanded' - Controls overlaid on bottom of carousel viewport, with prev/next buttons on sides vertically centered |

### Prop Guidance

- **layout**: Selects where and how the navigation controls are positioned relative to the carousel viewport. Defaults to 'inline'. Use 'inline' for the most conservative, content-safe arrangement, 'inline-wide' when the prev/next buttons should be pushed to the far left and right edges while still occupying layout space, 'overlay' for controls floating at the bottom of the viewport, 'overlay-wide' when prev and the autoplay/next group should sit at the far sides of that overlay, and 'overlay-expanded' when prev/next should be vertically centered on the left and right sides of the media. Because the prop only affects positioning and not semantics, changing it never alters the announced order of the controls. `inline`
- **prev**: Slot for the previous-slide control. Pass a single button element (typically a CarouselButton with a backward chevron) so the control participates in carousel navigation and inherits Fluent button behavior; leave it undefined only if you intentionally want no backward affordance. `a CarouselButton that navigates to the previous slide`
- **next**: Slot for the next-slide control. Pass a single button element (typically a CarouselButton with a forward chevron). Provide it whenever more than one slide exists so users can advance through the set. `a CarouselButton that navigates to the next slide`
- **autoplay**: Slot for the autoplay toggle. Pass a CarouselAutoplayButton so users can pause and resume automatic slide advancement; its visual position varies by layout, and it sits between prev and next in most arrangements. Omit it when the carousel does not auto-advance. `a CarouselAutoplayButton that toggles automatic advancement`
- **prevTooltip**: Slot for the tooltip that describes the previous control. Supply a tooltip element whose text matches the action (for example, a 'Previous slide' label) so the icon-only control is self-describing on hover and focus; the text is supplemental, so the button itself still needs an accessible name. `a tooltip reading Previous slide`
- **nextTooltip**: Slot for the tooltip that describes the next control. Keep the wording short and action-oriented, and consistent with the previous control's tooltip wording so the pair reads as a set. `a tooltip reading Next slide`
- **autoplayTooltip**: Slot for the tooltip that describes the autoplay toggle. Because this control switches state, phrase the tooltip around the action the user can take, and keep it aligned with the toggle's accessible name. `a tooltip reading Stop automatic slide show`
- **root**: The container element that wraps all navigation slots and carries the layout styling. Treat it as the single positioning context for the controls: apply spacing, background, and scrim styling to the root rather than to each button, and avoid injecting extra non-navigation children into it. `the wrapper element that holds the nav controls`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `autoplay` | — | No | — |
| `autoplayTooltip` | — | No | — |
| `next` | — | No | — |
| `nextTooltip` | — | No | — |
| `prev` | — | No | — |
| `prevTooltip` | — | No | — |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Pick the layout value that matches your visual intent rather than overriding positions with custom styles: 'inline' for content-heavy carousels, 'overlay'/'overlay-wide' for full-bleed imagery, 'overlay-expanded' for large media where prev/next are the primary interaction.
- Pass real button elements into the prev, next, and autoplay slots (for example a CarouselButton for prev/next and a CarouselAutoplayButton for autoplay) so the controls inherit carousel behavior, disabled-at-the-ends logic, and Fluent button semantics.
- Supply the matching tooltip slots — prevTooltip, nextTooltip, autoplayTooltip — so icon-only controls are self-describing on hover and on focus.
- Make sure every control still has a discernible accessible name independent of its tooltip, since tooltip content is supplementary and may not be announced in every assistive technology configuration.
- Verify that the focus order and reading order of prev, autoplay, and next match their visual order in the chosen layout; wide and overlay layouts move buttons far apart visually, which makes mismatched order confusing.
- Give overlay controls a legible surface, such as a button background derived from theme tokens like tokens.colorBackgroundOverlay or tokens.colorNeutralBackground1, when they sit on top of photography or video.
- Disable or hide prev/next while the carousel is still loading slides or when there is only a single slide, so controls are never presented as actionable when they cannot do anything.

### Don'ts

- Don't add a separate CarouselNav or a second set of prev/next buttons alongside CarouselNavContainer in the same carousel; duplicated navigation is confusing for keyboard and screen reader users.
- Don't place unrelated content — captions, counters, links, or feature text — inside the prev, next, or autoplay slots; those slots are reserved for navigation controls, and extra content breaks the intended layout.
- Don't choose an overlay layout for short, dense, or text-heavy slides where the floating controls will cover the slide content; use an inline layout instead.
- Don't rely on hover to reveal or enable overlay controls; hover-only affordances fail WCAG keyboard and touch requirements, so controls must be reachable and visible by keyboard focus as well.
- Don't hack around a layout by absolutely positioning the container's children with hardcoded offsets or pixel values; switch to the layout value that already produces the arrangement you want.
- Don't use 'overlay-expanded' in a very short or very narrow carousel, where vertically centered side buttons can collide with each other or with the slide content.
- Don't provide a tooltip slot without its corresponding control slot, since there would be no trigger for that tooltip to attach to.

## Anti-Patterns

### Double navigation

❌ Rendering CarouselNavContainer alongside a separate CarouselNav or an extra pair of custom prev/next buttons gives the carousel two competing control sets. Keyboard users tab through duplicated controls, and screen reader users hear the same action announced twice with no way to tell them apart.

✅ Choose exactly one navigation strategy per carousel: either the container with prev/next/autoplay slots, or a custom CarouselNav with your own buttons. If you need thumbnails or non-arrow navigation, build it with CarouselNav and leave CarouselNavContainer out.

### Overlay controls on busy media

❌ Overlay and overlay-wide layouts float controls directly over slide imagery. Icons placed on a light photo or a detailed video frame can drop well below the 4.5:1 (or 3:1 for non-text) contrast threshold, making the controls hard to see and failing WCAG 1.4.3 and 1.4.11.

✅ Back the controls with a token-driven surface such as tokens.colorBackgroundOverlay or tokens.colorNeutralBackgroundAlpha, or use tokens.shadow4 to separate them from the media. If contrast still cannot be guaranteed across all slides, switch to an inline layout where the controls sit outside the media.

### Pixel-hacking around a layout

❌ Forcing positions with absolute offsets, hardcoded pixels, or negative margins to approximate an arrangement the component already offers produces fragile styling that breaks in RTL locales and at different container widths, and it fights the component's internal layout logic.

✅ Switch to the layout value that already matches the intended arrangement — 'inline-wide' or 'overlay-wide' for edge-aligned buttons, 'overlay-expanded' for vertically centered side buttons — and use only token-based spacing for fine tuning.

### Sparse slots with overlay layouts

❌ Using a wide or overlay layout while leaving one or more slots empty lets the container reserve space for controls that were never provided, leaving awkward gaps and misaligned or stranded controls.

✅ Provide every control the chosen layout expects, or drop back to a simpler layout such as 'inline' when only a single control (for example, just prev/next without autoplay) is needed.

### Tooltips as the only label

❌ Treating the prevTooltip, nextTooltip, and autoplayTooltip content as sufficient accessibility labeling leaves icon-only buttons effectively unnamed for assistive technology, since tooltip text is supplementary and hover-dependent.

✅ Give each control an explicit accessible name that mirrors the tooltip text, and keep the tooltip as an additional, visual affordance rather than the sole source of meaning.

## Accessibility

**Requirements**: CarouselNavContainer must satisfy the standard interactive-control requirements of WCAG 2.1 AA: every control it hosts needs an accessible name (WCAG 4.1.2), must be operable by keyboard alone (2.1.1), must show a clearly visible focus indicator (2.4.7), and must maintain sufficient contrast (1.4.3 for icons/text, 1.4.11 for non-text control boundaries). This is especially important for overlay layouts, where controls sit directly on top of imagery and can lose contrast; add an opaque or scrim-backed surface using theme tokens. Overlaid and wide layouts must keep pointer and touch targets large enough (aim for at least 24 by 24 CSS pixels, ideally larger) and must not change the logical reading order of the controls. Autoplay controls should never be the only way to stop motion for users who need it, and any auto-advancing behavior should be pausable via a clearly named control in the autoplay slot.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the container and then to each focusable control in slot order (typically prev, autoplay, next), so all navigation affordances are reachable without a pointer. |
| `Shift+Tab` | Moves focus backward out of the container or to the previous control, allowing users to reverse through the same slot order. |
| `Enter` | Activates the currently focused control — advancing or rewinding the carousel, or toggling autoplay — matching the behavior of a click on that button. |
| `Space` | Activates the currently focused control, identical to Enter, as expected of the button elements placed in the prev, next, and autoplay slots. |

**ARIA**: aria-label, aria-disabled, aria-hidden

**Screen Reader**: The container itself is a presentational grouping element and is not announced as a distinct widget; screen readers encounter the prev, next, and autoplay controls it contains, in the order they are rendered, and announce each using its accessible name ('Previous slide', 'Next slide', 'Stop automatic slide show', and so on). Overlay and wide layouts change only the visual placement of these controls, never their place in the reading order, so assistive technology users perceive a single, linear set of controls regardless of which layout value is used. Buttons supplied in the slots expose their disabled state through aria-disabled when they are inactive at the start or end of the slide set, letting screen readers report the control as unavailable. Tooltip content supplied through the tooltip slots is supplemental and is typically surfaced on hover or focus rather than read as part of the button's name, which is why an explicit accessible name on each button remains necessary; icon-only buttons without a name are announced as unlabeled buttons.

## Styling

Style the container with Griffel (makeStyles plus mergeClasses) and theme tokens rather than literal values. Use tokens.spacingHorizontalM and tokens.spacingVerticalM (or the smaller tokens.spacingHorizontalS / tokens.spacingVerticalS) to tune the gap between prev, autoplay, and next, and tokens.borderRadiusMedium for any surface you add around them. For inline layouts the container sits in normal flow, so spacing above the control row is usually expressed with padding using the same spacing tokens. For overlay layouts, a translucent scrim or pill background based on tokens.colorBackgroundOverlay or tokens.colorNeutralBackgroundAlpha noticeably improves legibility over media, and you can layer tokens.shadow4 or tokens.shadow8 for lift; pair that with tokens.colorNeutralForeground1 for icon color so contrast survives both light and dark themes. When you need to target the individual slot elements, use the slot class names exposed by the component's styling rather than descendant selectors, and prefer logical properties (paddingInlineStart, marginInlineEnd) so that 'inline-wide' and 'overlay-wide' mirror correctly in right-to-left locales. Focus styling should keep the theme default (a two-tone ring driven by tokens.colorStrokeFocus2 and tokens.colorStrokeFocus1) instead of a custom outline that could fail contrast.

## Performance

CarouselNavContainer is an effectively static wrapper: it owns no carousel index or timer state, so it does not re-render as slides change unless its parent re-renders or its slot content changes. The main performance hazard is slot identity — constructing the prev, next, autoplay, or tooltip elements inline on every parent render creates new element identities, which can cause React to unmount and remount the buttons, dropping focus and restarting any internal animations. Keep those elements stable (for example, hoist them or memoize them) when the surrounding carousel re-renders frequently, such as during autoplay advance. Avoid swapping the layout value during an active transition or while autoplay is running, since that triggers a full re-layout of the container and its buttons. Overlay layouts use positioned children over the viewport, so keep slot content lightweight and avoid nesting expensive or frequently animated content inside overlay controls.

## Theming & Tokens

The container contributes minimal color of its own; its appearance is driven by the Fluent theme applied through FluentProvider. Any surface you add for overlay legibility should come from tokens such as tokens.colorBackgroundOverlay, tokens.colorNeutralBackgroundAlpha, or tokens.colorNeutralBackground1, with icon and text color from tokens.colorNeutralForeground1 (or tokens.colorNeutralForegroundOnBrand when placed on a brand surface). Spacing scales with tokens.spacingHorizontalXS through tokens.spacingHorizontalL and tokens.spacingVerticalXS through tokens.spacingVerticalL, so increasing density-related spacing in your app shifts the control row accordingly. Elevation for floating controls uses the shadow ramp — tokens.shadow2, tokens.shadow4, tokens.shadow8 — while focus rings remain theme-driven via tokens.colorStrokeFocus1 and tokens.colorStrokeFocus2. Because the button components placed in the slots read the same theme, customizing theme colors propagates automatically to prev, next, and autoplay without per-button overrides, and the wide layouts mirror in RTL through logical spacing properties.

## Migration Notes

CarouselNavContainer is a v9-only component and has no direct v8 counterpart; the v8 Carousel's built-in navigation arrows were configured with numeric and boolean props on a single component, whereas v9 separates positioning (this container and its layout prop) from the individual controls (CarouselButton, CarouselAutoplayButton) that you place into the prev, next, and autoplay slots. Teams migrating from v8 should expect to compose the control row explicitly, choose one of the five named layout values in place of v8's arrow-position and arrow-overlay options, and provide tooltip slots for hover labels that v8 handled internally. There is no deprecated API in this component, so no shim or alias import is required.

## Edge Cases

- The layout prop only positions whatever you put in the slots; if a slot is left empty, the container still lays out around that position, which can leave visible gaps or pull the remaining controls out of alignment in wide and overlay layouts.
- 'overlay-expanded' centers prev/next vertically on the sides of the viewport, so in a short carousel the buttons can overlap slide content or each other; verify the arrangement at your smallest supported height.
- Supplying a tooltip slot without its matching control slot leaves a tooltip with no trigger to attach to, and supplying a control without a tooltip means the icon-only button loses its hover and focus explanation.
- Overlay layouts rely on the carousel viewport being the positioning context; if the carousel is nested inside a transformed or clipped ancestor, floating controls can be cut off or positioned unexpectedly.
- Before slides have loaded, or when only one slide exists, prev and next controls can appear active while doing nothing; disable or omit them for those states so the controls never misrepresent what is possible.
- Changing the layout value while a control has focus can move that control across the viewport and reorder its visual position relative to its neighbors; apply layout changes outside of interaction where possible.
- Right-to-left locales mirror the 'inline-wide' and 'overlay-wide' arrangements automatically, so custom styles that assume a left-side previous button will look wrong unless they use logical properties.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
