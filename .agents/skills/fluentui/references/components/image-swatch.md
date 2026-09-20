# ImageSwatch

> **Package**: `@fluentui/react-swatch-picker` v9.5.3
> **Import**: `import { ImageSwatch } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

ImageSwatch is an image-based swatch subcomponent of the SwatchPicker family in Fluent UI React v9. Where ColorSwatch renders a flat color fill and EmptySwatch renders a neutral placeholder, ImageSwatch renders a picture — a theme preview, a wallpaper, a texture, a product finish, or any other visual choice that cannot be expressed as a single color. It exposes only two props: a required src (the image source) and a required value (the unique identifier that the surrounding SwatchPicker uses to track which swatch is currently selected). The component renders a single required root slot, which is the interactive box that hosts the image and carries the selection, hover, focus, and press styling. Because ImageSwatch is designed to live inside a SwatchPicker, the picker — not the swatch itself — owns selection state, keyboard navigation, and roving focus; ImageSwatch supplies the visual content and the identity value for one choice in that set.

**When to use**: Use ImageSwatch when the set of choices a user is picking from is best communicated visually as imagery rather than as a solid color: theme thumbnails, photo filters, desktop or app backgrounds, material and finish previews, avatar or cover-image selection, and any picker where a picture communicates the option far faster than a label would. Prefer ColorSwatch when the selection is a literal color the user might read back as a hex or theme token, and prefer EmptySwatch when you need a neutral 'none' or 'transparent' option alongside other swatches. ImageSwatch should be used inside a SwatchPicker (typically inside a SwatchPickerRow for wrapping layouts) rather than on its own — the picker provides the group semantics, selection handling, and arrow-key navigation that make a grid of swatches usable. If the user is choosing a single image as a form value with a label and validation rather than browsing a visual set, a different form control paired with Image is usually a better fit than a swatch.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `src` | `string` | — | Yes | Swatch color |
| `value` | `string` | — | Yes | Swatch value |

### Prop Guidance

- **src**: Required. The image source rendered inside the swatch. Point it at a small, pre-cropped asset whose aspect ratio matches the rendered swatch box; supply a stable, cacheable URL and avoid full-resolution art. This prop is purely presentational — it never participates in selection logic, so a broken or changed src does not change which swatch is considered selected. `/assets/themes/ocean-thumb.png`
- **value**: Required. The unique identifier for this swatch within its SwatchPicker. The parent picker compares its selected value against this string, so it must be unique across the group and stable across renders. Use a human-meaningful key such as a theme id or slug rather than a file path. `ocean`
- **root**: The single required slot that renders the interactive swatch box containing the image. Customize size, radius, border, and hover or selected treatment on this slot with className and makeStyles, and let the picker apply its own selected and focus styling on top.

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Always supply a unique value for every ImageSwatch in a set; the parent SwatchPicker tracks the selected item by that value rather than by src.
- Point src at images that are already cropped to the swatch aspect ratio so the preview reads as a clean sample rather than a squeezed thumbnail.
- Keep all images in one SwatchPicker at the same dimensions and crop so the row or grid looks even and selection targets stay identical in size.
- Provide a descriptive accessible label for each swatch through the surrounding SwatchPicker labeling so screen reader users hear the option name, not a file path.
- Use relative or content-hashed image URLs that are stable across sessions so that selection values and imagery stay in sync after a reload.
- Serve images that are close to the rendered swatch size (typically small) so that a picker with dozens of options still loads quickly.
- Pair ImageSwatch with ColorSwatch or EmptySwatch only when the choices are genuinely of different kinds, and keep that mix intentional and labeled.

### Don'ts

- Do not use ImageSwatch as a standalone clickable element outside a SwatchPicker; it has no own selection or navigation behavior.
- Do not reuse the same value across multiple swatches in one picker, or selection will appear to jump or fail to update.
- Do not rely on src to identify the selection; src is presentation only and the value prop is what the picker compares against.
- Do not fill a swatch with full-resolution hero imagery; oversized assets slow down rendering and are downscaled to a tiny box anyway.
- Do not put visible text or long labels inside the swatch itself; keep the swatch purely visual and let the picker or an adjacent label carry the wording.
- Do not use animated GIFs or videos as swatch content, since continuous motion in a selection grid is distracting and cannot be paused by the user.
- Do not depend on color or imagery alone to convey which swatch is selected in high-contrast scenarios — the picker's own selected treatment must remain visible.

## Anti-Patterns

### Rendering swatches outside a SwatchPicker

❌ ImageSwatch carries no selection state, no group semantics, and no arrow-key navigation of its own. Used standalone it looks interactive but behaves as an inert or inaccessible element, and screen readers get an image with no group context.

✅ Always nest ImageSwatch inside a SwatchPicker, usually wrapped in a SwatchPickerRow for multi-row layouts, and let the picker own selection and focus management.

### Duplicating or omitting the value prop

❌ Selection is tracked by value, not by src. Duplicate values make two swatches appear selected together or make the wrong swatch highlight; an empty or generated value makes the selection impossible to persist or restore.

✅ Assign each ImageSwatch a distinct, stable, human-readable value such as a theme slug, and reuse that same value when reading or restoring the current selection.

### Feeding full-resolution or mismatched-aspect images

❌ Large source images are downscaled into a tiny box but still cost bandwidth and decode time, and images with different aspect ratios than the swatch box get letterboxed or cropped unpredictably, making the picker look ragged and the selection targets uneven.

✅ Pre-size and pre-crop assets to the swatch dimensions, serve appropriately compressed formats, and apply a consistent object-fit rule so every swatch renders at identical size.

### Conveying the choice only through the picture

❌ A screen reader user, or anyone in high-contrast mode where images may be suppressed, cannot tell what an unlabeled image swatch represents or which one is selected.

✅ Give every swatch a meaningful accessible name through the picker's labeling, keep the picker's programmatic selected state accurate, and verify the selected treatment stays visible under forced-colors.

### Mixing swatch types without a stated reason

❌ Mixing ImageSwatch, ColorSwatch, and EmptySwatch in one picker can be confusing when the different visual languages are not explained, and it complicates the layout if the swatches have different intrinsic sizes.

✅ Choose one swatch type per picker unless the mix is meaningful (for example a 'None' option as EmptySwatch plus imagery), and normalize sizes across the different types so the grid stays even.

## Accessibility

**Requirements**: ImageSwatch participates in the selection semantics owned by the surrounding SwatchPicker, so it must be exposed as one option within a group rather than as a bare image. Each swatch needs an accessible name that describes the choice (for example 'Ocean' or 'Wallpaper: mountains') — never the raw image file name — and its selected state must be programmatically exposed. The image inside the swatch must have meaningful alternative text when it conveys information, or be treated as decorative when the swatch's own accessible name already describes the choice. Because selection in Fluent UI swatches is typically indicated by a border and a check indicator, ensure the selected treatment meets non-text contrast requirements (3:1 against adjacent colors) in both light and dark themes and remains distinguishable in Windows High Contrast mode. The swatch target must be large enough to hit comfortably — at least 24x24 CSS pixels, ideally 32x32 or larger — and must never be the only way to perceive a state change.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the swatch group, landing on the currently selected swatch (or the first one if nothing is selected), and moves focus out of the group to the next focusable element. |
| `ArrowRight` | Moves focus to the next swatch in the row (horizontally laid out pickers), wrapping or stopping at the end depending on the picker's configuration. |
| `ArrowLeft` | Moves focus to the previous swatch in the row. |
| `ArrowDown` | Moves focus to the swatch in the next row of a grid-layout picker. |
| `ArrowUp` | Moves focus to the swatch in the previous row of a grid-layout picker. |
| `Home` | Moves focus to the first swatch in the group. |
| `End` | Moves focus to the last swatch in the group. |
| `Enter` | Selects the focused swatch and commits its value to the parent picker. |
| `Space` | Selects the focused swatch, behaving identically to Enter. |

**ARIA**: role (each swatch is exposed as a radio-style option within the picker's group), aria-checked (reflects whether this swatch's value is the currently selected one), aria-label (accessible name for the swatch, such as 'Ocean theme'), aria-labelledby (used when the swatch name comes from a visible label element), alt on the underlying image (meaningful text when the image conveys the choice, empty when the swatch's name already covers it)

**Screen Reader**: A screen reader announces the picker as a group of options and, as focus moves with the arrow keys, reads each swatch's accessible name together with its state, for example 'Ocean theme, selected' or 'Sunset theme, not selected'. Selection is confirmed audibly through the checked state rather than through imagery, which is why the accessible name must carry the meaning of the picture. The underlying image is either announced with its alternative text or skipped entirely when decorative, so the same content is never read twice. Image load failures do not change what is announced, because the swatch's name and value come from attributes rather than from the rendered pixels.

## Styling

Style ImageSwatch through the root slot using makeStyles and mergeClasses rather than overriding internal elements directly, so your styles compose with the picker's selected and focus treatments. Typical customizations are the swatch box size (fixed width and height or an aspect-ratio rule), the border radius, and the ring that indicates selection. Reach for real Griffel tokens so the swatch adapts to theme and contrast settings: tokens.borderRadiusMedium or tokens.borderRadiusCircular for the corner shape, tokens.strokeWidthThin for the default and hover outline (tokens.colorNeutralStroke1, tokens.colorNeutralStroke1Hover), tokens.colorBrandStroke1 for the selected outline, tokens.colorStrokeFocus2 with tokens.strokeWidthThick for the focus indicator, and tokens.colorNeutralBackground1 for the surface behind a partially transparent image. For spacing between swatches, use tokens.spacingHorizontalXS / tokens.spacingHorizontalS or tokens.spacingVerticalS depending on the picker's layout direction, and give the image itself an object-fit rule (cover) inside the root so pictures of differing aspect ratios still fill the box cleanly. Note that tokens.colorTransparentStroke is useful when you want a swatch to sit flush inside a container without a visible boundary until hover.

## Performance

Each ImageSwatch triggers one image request, so a picker with dozens of image swatches can dominate first paint on a page. Keep swatch assets small (thumbnails in the low tens of kilobytes), serve them from the same origin or CDN path so they share connections, and prefer modern compressed formats. Decoding hundreds of tiny images is comparatively cheap, but layout thrash is not: fix the swatch dimensions in CSS so the picker does not reflow as images arrive. If the option set is very large, render the picker on demand (inside a Popover or Drawer) rather than mounting all swatches up front, and avoid recreating inline style objects per swatch in the render path — use makeStyles with Griffel so styles are computed once and merged cheaply.

## Theming & Tokens

ImageSwatch inherits its chrome from the nearest FluentProvider theme. The swatch's default outline typically resolves to tokens.colorNeutralStroke1 with tokens.colorNeutralStroke1Hover on hover, the selected ring to tokens.colorBrandStroke1, and the focus indicator to tokens.colorStrokeFocus2 paired with tokens.strokeWidthThick. Corner shape comes from tokens.borderRadiusMedium (or tokens.borderRadiusCircular for round swatches), while surrounding surface and padding come from tokens.colorNeutralBackground1 and the tokens.spacingHorizontal / tokens.spacingVertical ramp. The picture itself is not recolored by the theme, so any imagery that is nearly the same value as the page background should be given an explicit border token so it remains visible; in high-contrast themes the token-driven border and focus ring are what keep the swatch legible when images are suppressed.

## Migration Notes

ImageSwatch is a v9-only component; there is no direct v8 equivalent with the same API, and it is imported as a named export from @fluentui/react-components. Teams migrating from older swatch or color-picker patterns should move selection state to the parent SwatchPicker and treat src and value as the only per-swatch inputs, rather than wiring per-swatch click handlers and selected flags themselves.

## Edge Cases

- A missing or unreachable src leaves an empty-looking but still selectable swatch; provide a fallback background token on the root so the option remains perceivable.
- Selection state is keyed off value, so changing src (for example after a theme switch) without keeping value stable will still preserve selection correctly — but changing value silently clears it.
- Swatches with transparent or partially transparent PNGs can blend into the surrounding surface; back the swatch with tokens.colorNeutralBackground1 to keep the boundary visible.
- Vertically laid out pickers interpret the arrow keys differently from horizontally laid out ones, so verify navigation behavior whenever you change the picker's layout.
- In forced-colors or Windows High Contrast mode, background imagery may be removed entirely, leaving only the token-driven border — confirm the selected swatch is still distinguishable.
- Mixing ImageSwatch with differently sized ColorSwatch or EmptySwatch in the same picker forces the tallest element to define the row height; normalize dimensions explicitly.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
