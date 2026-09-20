# SkeletonItem

> **Package**: `@fluentui/react-skeleton` v9.7.3
> **Import**: `import { SkeletonItem } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

SkeletonItem is the primitive placeholder shape in the Fluent UI React v9 loading-state toolkit. It renders a single, non-interactive block that stands in for content that has not finished loading yet, so the page can reserve space and communicate progress without spinners or layout jumps. A SkeletonItem has no intrinsic size or content — its geometry comes entirely from the styles or layout applied to its root slot, or from a parent Skeleton container that arranges multiple items into a composed placeholder. Two visual dimensions can be tuned directly on the component: the animation, which controls how the shimmer moves (wave by default, or pulse), and the appearance, which decides whether the shape reads as a solid neutral block (opaque, the default) or as a semi-transparent block that lets an underlying surface such as an image or branded background show through (translucent). Because SkeletonItem is purely decorative, it is typically rendered repeatedly to mimic the shape, count, and rhythm of the real content that is about to replace it.

**When to use**: Use SkeletonItem when you know the shape and rough dimensions of the incoming content and want a shimmering placeholder that preserves layout while data loads. It is the right choice for lists, cards, tables, detail panes, and any region whose structure is known ahead of time, especially when the load takes long enough for an empty area to feel broken. Prefer SkeletonItem over a Spinner when the pending content has a stable, predictable silhouette, because the placeholder reduces perceived wait time and prevents cumulative layout shift. Prefer a Spinner or ProgressBar instead when the shape of the result is unknown, when progress percentage is meaningful, or when only a small inline region is loading. Avoid SkeletonItem for content that resolves in a few milliseconds, since the flash of a placeholder is more distracting than a brief blank state.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `animation` | `"wave" \| "pulse" \| undefined` | `wave` | No | Sets the animation of the SkeletonItem |
| `appearance` | `"opaque" \| "translucent" \| undefined` | `opaque` | No | Sets the appearance of the SkeletonItem |

### Prop Guidance

- **animation**: Controls how the placeholder shimmer behaves. Leave it at the wave default for typical page and card loading because the traveling highlight reads clearly as 'loading' without being urgent. Switch to pulse for dense or long placeholder regions, for lists with many items, or when the continuous wave motion would be distracting or too expensive to paint. Keep a single animation value for all placeholders inside one loading region. `wave`
- **appearance**: Controls whether the placeholder block is visually solid or see-through. Use the opaque default on standard page surfaces where the placeholder should clearly read as a neutral block filling reserved space. Use translucent when the placeholder sits on top of imagery, colored cards, or brand backgrounds, so the surface underneath remains visible and the placeholder reads as a veil rather than a hole. Do not mix both appearances in one placeholder group, since the visual weight will look uneven. `translucent`
- **root**: The root slot is the single element SkeletonItem renders, and it is where sizing and shape live. Apply width, height, border radius, margins, and aria-hidden through the slot's className, style, or slot props. Because the element renders no children and has no intrinsic dimensions, always give it a size either directly or via the parent layout such as a grid or flex container. `width 100%, height 16px, borderRadiusSmall`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Give every SkeletonItem an explicit size through the root slot's styling or through the surrounding layout, because the element has no intrinsic width or height.
- Match the placeholder's count and dimensions to the real content it replaces — one item per expected row, card, or line — so the swap to real content does not shift the layout.
- Keep animation and appearance consistent across all placeholder items in the same loading region; mixing wave and pulse animations in one list looks like a rendering bug.
- Use animation set to pulse for long-lived or very large placeholder regions where a traveling wave would be visually noisy or expensive to animate.
- Choose appearance set to translucent when the placeholder is layered over an image, a colored card, or a brand surface, so the underlying color still reads through.
- Keep the placeholder group short-lived: resolve the loading state as soon as data arrives and unmount the SkeletonItems in the same render pass that mounts the real content.
- Hide the placeholder from assistive technology by marking the placeholder region as decorative and announcing the loading state separately.

### Don'ts

- Do not use SkeletonItem as a decorative divider, spacer, or shimmering accent — it exists only to represent pending content.
- Do not leave skeleton placeholders visible after data has loaded or as a permanent empty state; swap them for real content or an explicit empty message.
- Do not rely on a SkeletonItem to convey the loading status to screen readers by itself; it has no accessible text and no live-region semantics.
- Do not hardcode raw hex colors or custom keyframes on the root slot, because that breaks the placeholder in dark, high-contrast, and brand themes.
- Do not nest SkeletonItem inside another SkeletonItem or wrap it in elements that add their own background, which produces double-layered shimmer artifacts.
- Do not build a placeholder that is a different shape, size, or spacing than the final content, since the reveal will visibly jump.
- Do not mix skeleton placeholders and real content for the same data set in one region at the same time, which makes it ambiguous what is still loading.

## Anti-Patterns

### Unsized placeholder that collapses

❌ SkeletonItem renders an empty element with no intrinsic width or height, so omitting styling makes it invisible or zero-height and gives the user no loading feedback at all.

✅ Always set explicit dimensions on the root slot, or place the SkeletonItem inside a parent such as Skeleton or a sized grid or flex cell that supplies the geometry.

### Placeholder shape drift

❌ When the skeleton's count, height, and spacing differ from the real content, the moment data arrives the layout jumps, which defeats the main reason for using a skeleton in the first place.

✅ Derive placeholder count and dimensions from the same data or layout constants that drive the real list, card, or table rows, and keep the spacing identical between the two states.

### Placeholder as a permanent empty state

❌ Leaving SkeletonItems on screen after loading finishes, or using them to fill a region that has no data, implies work is still in progress and hides the fact that the result is empty or failed.

✅ Unmount the placeholders as soon as the request resolves and render the real content, an explicit empty message, or an error state instead.

### Skeleton as the only loading announcement

❌ The placeholder contains no text or role, so a screen reader user receives no indication that data is being fetched and may believe the page is simply blank.

✅ Mark the placeholder region as hidden from assistive technology and announce loading separately through a live region, clearing the announcement when the real content renders.

### Animation mismatch across one region

❌ Mixing wave and pulse, or opaque and translucent appearance, across items in the same group makes the loading region look broken and draws attention to the placeholder rather than the content.

✅ Set animation and appearance once at the group level and let each item inherit a consistent look, only diverging where a deliberate visual distinction is required.

## Accessibility

**Requirements**: SkeletonItem is decorative and non-interactive, so it must never be the only signal that content is loading. Mark individual placeholder shapes as hidden from assistive technology (for example by marking the root slot as aria-hidden) so screen reader users are not read a sequence of meaningless empty elements. Announce the loading state on the surrounding region using an appropriate live-region mechanism, and remove that announcement when the real content arrives. Placeholders must also meet minimum visual contrast against their background so that low-vision users can perceive that content is pending rather than missing; avoid extremely faint translucent placeholders over busy imagery. Respect reduced-motion preferences — a continuously animating wave across a large region can be a vestibular trigger, so be prepared to reduce or remove the animation for users who request less motion.

**ARIA**: aria-hidden, aria-busy, aria-live, aria-label

**Screen Reader**: SkeletonItem itself exposes no text, no role, and no focusable content, so screen readers produce no meaningful output for it once the placeholder is marked as hidden. Screen reader users therefore learn about loading exclusively from the surrounding region: a container marked busy is reported as a busy region, and a polite live region announces a short loading message such as 'Loading content'. When loading finishes, the real content replaces the placeholders and should be announced or focused appropriately, and the busy state should be cleared so subsequent navigation reads the finished content normally. Because the placeholder is non-focusable, it never appears in the tab order and never interrupts keyboard users mid-task.

## Styling

SkeletonItem's root slot carries all visual styling, so shape customization happens through the className and style applied to that slot. Use tokens.borderRadiusSmall for text-line placeholders, tokens.borderRadiusMedium or tokens.borderRadiusLarge for cards and images, and tokens.borderRadiusCircular for avatar-shaped placeholders. The shimmer gradient is built from the neutral stencil colors, so retinting it means overriding tokens.colorNeutralStencil1 and tokens.colorNeutralStencil2 rather than replacing the animation. The opaque appearance reads as a solid neutral block derived from neutral background tokens such as tokens.colorNeutralBackground3, while the translucent appearance is intended to sit over images and brand surfaces where the underlying color must remain visible. Timing is driven by theme duration and curve tokens — the wave animation is intentionally slow, in the range of tokens.durationUltraSlow with an ease such as tokens.curveEasyEase, and the pulse animation is tighter around tokens.durationSlower. Set explicit width and height on the root slot or let the parent flex or grid layout size the item; without either, the placeholder collapses. Avoid animating layout properties such as width or margin on the root slot, since that competes with the built-in background-position or opacity animation and causes jank.

## Performance

Each SkeletonItem is a lightweight element, but the wave animation continuously repaints a moving gradient, so a screen filled with hundreds of animated placeholders can cost meaningful frame time on low-end hardware. Prefer a bounded set of representative placeholders — typically the number of rows or cards visible in the viewport, not the full data set — and consider pulse for very large groups. Keep the root slot's styling cheap: avoid animating layout properties, avoid filters and box shadows on the placeholder, and avoid re-mounting items on every state change, since remounting restarts the animation and produces a visible flicker. Because the placeholder is purely presentational, it is a good candidate for being skipped by memoization logic and for rendering before any data-fetching hooks resolve. Also avoid rendering placeholders for extremely fast responses; gating them behind a short delay prevents an animation restart for a load that finishes almost immediately.

## Theming & Tokens

SkeletonItem takes all of its color and motion from the Fluent theme, so it recolors automatically in dark, high-contrast, and brand variants supplied by FluentProvider. The shimmer gradient is composed from tokens.colorNeutralStencil1 and tokens.colorNeutralStencil2, which is the correct place to retint the animation — do not replace the keyframes or inject raw color values. The opaque appearance draws on neutral surface tokens such as tokens.colorNeutralBackground3 for the resting block, while the translucent appearance uses alpha-based neutral backgrounds so imagery underneath remains visible. Shape uses the shared radius scale — tokens.borderRadiusSmall, tokens.borderRadiusMedium, tokens.borderRadiusLarge, and tokens.borderRadiusCircular — and motion uses tokens.durationSlower and tokens.durationUltraSlow with curves such as tokens.curveEasyEase and tokens.curveLinear. High-contrast themes rely on these stencil tokens to keep the placeholder distinguishable, so overriding them with hardcoded colors removes that guarantee.

## Migration Notes

In v8, a single Skeleton component accepted both the animation choice and sizing props such as width and height plus inline style, producing one placeholder block. In v9 the responsibility is split: Skeleton is the container that composes and arranges placeholder shapes, while SkeletonItem is the individual shape. SkeletonItem exposes only animation and appearance plus the root slot, so any width, height, margin, or offset that used to be a prop now comes from the root slot's styling or from the surrounding layout. The v8 animation values wave and pulse map directly onto the v9 animation values of the same names, and wave remains the default in both.

## Edge Cases

- SkeletonItem has no width, height, or size props: without styling on the root slot or sizing from a parent layout, the placeholder renders with no visible dimensions.
- The translucent appearance only makes sense over a non-neutral surface; on a plain background it can become so faint that users cannot tell anything is loading.
- Because the component is decorative and non-focusable, wrapping it in focusable elements or placing it inside the tab order creates confusing keyboard stops with no actionable content.
- Rendering placeholders inside a container whose background is also animated or blurred can cause visual smearing and reduce the perceived contrast of the shimmer.
- In high-contrast themes the animated gradient may be flattened, so the loading state must still be understandable from shape and layout alone rather than from motion.
- If the placeholder group is re-created on each render (for example because of unstable keys), the wave animation restarts and the region appears to flicker.
- Placeholders rendered for very fast responses appear and disappear before the user can register them, which reads as a glitch rather than as helpful feedback.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
