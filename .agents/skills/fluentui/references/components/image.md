# Image

> **Package**: `@fluentui/react-image` v9.4.2
> **Import**: `import { Image } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

Image is a data-display component that renders a single image while applying Fluent design styling on top of the native image element. It exposes a focused set of visual props — block, bordered, fit, shadow, and shape — that cover the most common media presentation needs: full-bleed layout images, bordered thumbnails, object-fit behavior inside fixed containers, elevated hero imagery, and square, rounded, or circular cropping. The component renders a single mandatory root slot, which is the image element itself, so all standard native image attributes such as src, alt, width, and height are forwarded straight to the DOM alongside any data-* or aria-* attributes and a custom className. Because the root is a real image element, load failures fall back to the native browser broken-image behavior rather than to a custom placeholder, and there is no built-in loading state, fade-in, or error callback. Image is intentionally unopinionated about sizing: it does not wrap itself in a container, so the parent layout (a Card, a grid cell, a flex row, or an explicit width and height on the image) is what ultimately constrains the rendered result.

**When to use**: Use Image whenever you need to display content imagery — photographs, illustrations, product shots, hero banners, thumbnails, or decorative artwork — and want it to pick up Fluent border, radius, shadow, and fit conventions without writing custom CSS. It is the right choice for layout-driven media inside Card and CardPreview, inside list rows, or as a hero element at the top of a page or dialog. Choose a different component when the meaning of the visual is more specific than a generic image: use Avatar, AvatarGroup, or Persona when the image represents a person and needs presence, size, or name context; use ImageSwatch or SwatchPicker when the image is a selectable color or pattern option; use EmptySwatch or ColorSwatch when a solid color tile is enough; and use dedicated icon assets rather than Image for small glyphs and symbols, since icons scale crisply and inherit text color. Image is also unnecessary when you simply need a background texture behind content — a plain styled container is lighter than an image element in that case.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `block` | `boolean \| undefined` | `false` | No | An image can take up the width of its container. |
| `bordered` | `boolean \| undefined` | `false` | No | An image can appear with a rectangular border. |
| `fit` | `"none" \| "center" \| "contain" \| "cover" \| "default" \| undefined` | `'default'` | No | An image can set how it should be resized to fit its container. |
| `shadow` | `boolean \| undefined` | `false` | No | An image can appear elevated with shadow. |
| `shape` | `"square" \| "circular" \| "rounded" \| undefined` | `'square'` | No | An image can appear square, circular, or rounded. |

### Prop Guidance

- **block**: Set block to true when the image should stretch to the full width of its parent, such as a banner or an image inside a Card or a grid cell. Combine it with a constraint on the parent rather than a width on the image itself, and remember it does not set a height — the height follows the image aspect ratio unless you size the container. `block`
- **bordered**: Enable bordered to draw a rectangular outline around the image with the theme's neutral stroke. Use it when the image could blend into a similarly colored background or when an album or gallery of images needs consistent edge definition. The border follows the radius chosen by shape, so bordered plus circular produces a circular outline. `bordered`
- **fit**: Controls how the image is resized relative to its container. Use none to keep the intrinsic size, center to center it at its intrinsic size inside a larger box, contain to scale the whole image down while preserving its aspect ratio, and cover to fill the container and crop the overflow. The prop only produces a visible difference when the container has a size that differs from the image's intrinsic size, so always give the parent or the image explicit dimensions. `cover`
- **shadow**: Adds elevation so the image reads as floating above the surface. Reserve it for featured media, hero images, or a single highlighted thumbnail; applying it to every image in a dense gallery flattens the visual hierarchy and can look noisy. `true`
- **shape**: Chooses the silhouette of the image: square for uncropped rectangular media, rounded for a softer corner treatment that matches many Fluent surfaces, and circular for portraits and avatar-like crops. Circular works best with a square source image, since the corners of a non-square image will be clipped. `circular`
- **alt**: Native image attribute forwarded to the root. Provide a concise description of the image's content or purpose for informative images, or an empty string for decorative images so assistive technology ignores them. It is optional at the type level but effectively required for accessibility. `Allan's avatar`
- **src**: Native image attribute forwarded to the root, holding the path or URL of the asset to display. If it fails to resolve, the browser renders its default broken-image fallback with the alt text, because Image adds no custom error handling. `/assets/images/avatars/AllanMunger.jpg`
- **width and height**: Native image attributes forwarded to the root and the most reliable way to reserve layout space. Set both to keep the aspect ratio predictable, prevent content shift while the asset downloads, and give fit a container to work against when the image is also set to block or wrapped in a sized parent. `width 200, height 200`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Image } from '@fluentui/react-components';
import type { ImageProps } from '@fluentui/react-components';
import type { ArgTypes, Parameters } from '@storybook/react-webpack5';

export const Default = (props: ImageProps): JSXElement => {
  return (
    <Image
      {...props}
      alt="Allan's avatar"
      src="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/AllanMunger.jpg"
    />
  );
};

Default.argTypes = {
  alt: {
    control: 'text',
    defaultValue: 'Image placeholder',
    description: `description of the image, which isn't mandatory but is incredibly useful for accessibility`,
  },
  src: {
    control: 'text',
    defaultValue: 'https://fabricweb.azureedge.net/fabric-website/placeholders/300x300.png',
    description: 'path to the image you want to display',
  },
  as: { table: { disable: true } },
} as ArgTypes;
Default.parameters = {
  controls: {
    disable: false,
  },
} as Parameters;
```

### Block

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Image } from '@fluentui/react-components';

export const Block = (): JSXElement => (
  <>
    <Image block src="https://fabricweb.azureedge.net/fabric-website/placeholders/900x50.png" alt="Image placeholder" />
    <Image
      block
      src="https://fabricweb.azureedge.net/fabric-website/placeholders/100x100.png"
      alt="Image placeholder"
    />
  </>
);
Block.parameters = {
  docs: {
    description: {
      story: 'An Image can be maximized in order to fill its parent container.',
    },
  },
};
```

### Bordered

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Image } from '@fluentui/react-components';

export const Bordered = (): JSXElement => (
  <div>
    <div style={{ display: 'flex', gap: 8 }}>
      <Image
        alt="Allan's avatar"
        src="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/AllanMunger.jpg"
        height={200}
        width={200}
      />
      <Image
        alt="Amanda's avatar"
        shape="rounded"
        src="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/AmandaBrady.jpg"
        height={200}
        width={200}
      />
      <Image
        alt="Erik's avatar"
        shape="circular"
        src="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/ErikNason.jpg"
        height={200}
        width={200}
      />
    </div>
    <div style={{ display: 'flex', gap: 8, marginTop: '15px' }}>
      <Image
        alt="Allan's avatar"
        bordered
        src="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/AllanMunger.jpg"
        height={200}
        width={200}
      />
      <Image
        alt="Amanda's avatar"
        bordered
        shape="rounded"
        src="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/AmandaBrady.jpg"
        height={200}
        width={200}
      />
      <Image
        alt="Erik's avatar"
        bordered
        shape="circular"
        src="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/ErikNason.jpg"
        height={200}
        width={200}
      />
    </div>
  </div>
);
Bordered.parameters = {
  docs: {
    description: {
      story: 'The `bordered` prop will apply a border style to images regardless of its shape.',
    },
  },
};
```

## Best Practices

### Do's

- Always supply a meaningful alt value for informative images that describes the content or purpose, since the alt text is the only information a screen reader user receives.
- Use alt="" (an intentionally empty alt) for purely decorative images so assistive technology skips them instead of announcing unhelpful text.
- Set explicit width and height (or wrap the image in a fixed-size container) so the browser can reserve space before the image loads and avoid layout shift.
- Use the block prop when an image should span the full width of its parent, and let the parent control the outer spacing and max width.
- Choose fit="cover" for fixed-ratio containers such as cards and thumbnails so the image fills the box without distortion, and fit="contain" when the entire image must remain visible.
- Use shape="circular" for square portrait crops and shape="rounded" for softer card and thumbnail corners, matching the surrounding surface's radius.
- Add bordered when the image sits on a surface with similar luminance or when the image is light and its edges would otherwise disappear.
- Apply shadow sparingly — typically for a single featured or hero image — so elevation continues to communicate hierarchy rather than becoming visual noise.
- Reach for Avatar or Persona instead of Image whenever a person's identity needs fallback initials, presence badges, or a name label.

### Don'ts

- Don't omit alt or use placeholder text such as alt="image", the file name, or alt="photo", because screen readers then announce redundant or meaningless content.
- Don't set alt to a full sentence or paragraph of description; keep it short and put longer explanations in adjacent visible or programmatically associated text.
- Don't use Image to render icons, glyphs, or UI symbols — dedicated icon assets stay sharp at small sizes and inherit font color and direction.
- Don't combine block with an explicit pixel width on the same element expecting both to apply; block forces the image to the container width and the constraint will conflict.
- Don't apply shape="circular" to a non-square source image, because the circular crop will clip content near the edges of the frame.
- Don't rely on the default fit value inside a container whose aspect ratio differs from the image; the result is either overflow or unintended cropping.
- Don't use shadow as a substitute for a real edge boundary, since drop shadows are dropped in forced-colors and high-contrast environments.
- Don't nest a large informational image inside a link or button without checking that the link name is still comprehensible and not duplicated by surrounding text.
- Don't render full-resolution photography at thumbnail sizes; serve appropriately sized assets so the browser does not downscale megabytes of pixels.

## Anti-Patterns

### Redundant or placeholder alt text

❌ Values such as alt="image", alt="photo of a person", or the file name cause screen readers to announce words that add no information, and they obscure the fact that a real description is missing.

✅ Write a short description of what the image conveys, such as a person's name and role for a portrait, and use an explicitly empty alt for images that are purely decorative.

### Circular shape on a non-square image

❌ shape="circular" crops the source to a circle, so wide or tall images lose content at the edges, often cutting off faces or important details without any warning.

✅ Provide a square source asset or pre-crop it before rendering, and use shape="rounded" when you want softer corners without losing parts of the frame.

### Fighting fit with inline sizing

❌ Combining the default fit behavior with a fixed pixel width or height on the same element inside an odd-ratio container produces overflow, distortion, or unexpected cropping, and the layout breaks when the container resizes.

✅ Decide which layer owns sizing: give the parent a fixed size or aspect ratio and use fit="cover" or fit="contain" on the image, or omit fit entirely and let the intrinsic dimensions govern.

### Using shadow instead of a real boundary

❌ Elevation is decorative and is dropped in forced-colors and high-contrast environments, so an image whose edge is communicated only by a drop shadow can visually merge into the background for those users.

✅ Use bordered together with shadow when the edge matters, since the token-driven stroke is remapped to system colors while shadows are not.

### Rendering large imagery without reserved space

❌ Images without width and height attributes or a sized container cause the page to reflow when each asset finishes downloading, producing visible content shift and a poor reading experience.

✅ Always set the width and height attributes or place the image in a container with a fixed size or aspect ratio, and serve appropriately sized assets for the rendered dimensions.

### Overriding the root element semantics

❌ Rendering the root slot as a different element through the standard slot override removes the img role and the alt-based accessible name, so the visual stays but the accessible content disappears.

✅ Keep the default root element for images and use a wrapping container such as a Card, Link, or Button when you need different layout or interaction semantics.

## Accessibility

**Requirements**: Image must satisfy WCAG 1.1.1 Non-text Content: every informative image needs a text alternative conveyed through the alt attribute, and every decorative image needs an explicitly empty alt so it is removed from the accessibility tree. Because the root is a real image element, the browser and platform expose it with the implicit img role and derive the accessible name from alt. WCAG 1.4.11 Non-text Contrast applies when the bordered prop is used to communicate an image boundary or state — the applied stroke must reach a 3:1 contrast ratio against the adjacent surface. Images that contain text are discouraged; if text inside an image is unavoidable, the equivalent text must also be available in the page. Forced-colors and high-contrast modes need verification when bordered or shadow are the only visual separation, because box shadows are typically removed by those modes while token-driven borders are remapped to system colors. Never use only color, shape, or fit cropping to convey meaning.

| Key | Action |
| --- | --- |
| `Tab` | Skips over the image entirely: the rendered image element is not focusable by default, so it never becomes a tab stop unless a parent element makes it interactive. |
| `Enter` | Has no effect on Image itself; if the image is wrapped in a Button, Link, or similar interactive parent, that parent handles activation. |
| `Space` | Has no effect on Image itself and continues to perform normal page scrolling; activation semantics come from any wrapping interactive component. |

**ARIA**: alt (the primary accessible name source for the image), role="img" — implicit on the root element and should not be overridden, aria-hidden (pair with an empty alt when you want decorative images fully removed from the accessibility tree), aria-label and aria-labelledby (only valid on interactive parents; do not use them to replace alt on the image itself), title (optional supplementary tooltip text, never a substitute for alt), aria-* and data-* attributes are forwarded to the root element

**Screen Reader**: Screen readers announce the image element with its implicit img role and read the value of the alt attribute as the accessible name, often prefixing the announcement with the word image. When alt is an empty string, the element is treated as decorative and is skipped entirely, and most screen readers will also suppress the surrounding whitespace. When an image fails to load, browsers render the alt text as visible fallback content and screen readers generally continue to announce that alt text, sometimes with an indication that the image is broken. If the image is inside a link, its alt text contributes to the link's accessible name, which can produce a long, duplicated announcement when the same text also appears adjacent to the link. The visual cropping applied by fit and the rounding applied by shape have no effect on what is announced, so alt text must describe the meaningful content even when part of the image is cropped.

## Styling

Style Image through className with Griffel makeStyles, and rely on the built-in props for the four common visual decisions rather than reimplementing them. bordered applies a thin stroke drawn from tokens.colorNeutralStroke1 with tokens.strokeWidthThin and inherits the radius set by shape; shape maps square to no rounding or a minimal tokens.borderRadiusSmall, rounded to tokens.borderRadiusMedium, and circular to tokens.borderRadiusCircular. shadow applies an elevation from the shadow token ramp — tokens.shadow2 or tokens.shadow4 for subtle card-like media and tokens.shadow8 or larger for hero imagery — where the ambient and key layers use tokens.colorNeutralShadowAmbient and tokens.colorNeutralShadowKey. fit translates directly to the CSS object-fit behavior: none for intrinsic sizing, center to center the image at its intrinsic size, contain to letterbox inside the container, and cover to fill and crop. Because fit only matters when the container constrains the image, set the width and height attributes, size the parent, or apply an aspect-ratio in your own class. If you letterbox an image with contain, give the surrounding surface tokens.colorNeutralBackground1 so the exposed area reads as intentional padding. block sets the image to the parent's full width, which is useful inside Cards and grid cells, but you can still cap it by styling the parent with a max width. Overriding generated classes is rarely necessary, but if specificity fights you, prefer wrapping the image in a styled container over using important declarations, and use mergeClasses rather than concatenating className strings when combining your styles with consumer-provided classes.

## Performance

Image is a thin styled wrapper: it renders one element and applies a small set of atomic Griffel classes, so the React overhead per image is minimal. The real costs come from the assets and layout. Provide width and height attributes or a sized container so the browser can reserve space and avoid cumulative layout shift, and note that block plus a percentage width means the rendered size still depends on the intrinsic aspect ratio unless the parent constrains height. Native image attributes such as loading, decoding, srcset, and sizes are forwarded to the root element and are the recommended way to defer offscreen imagery and serve responsive sources. Prefer a single sized asset per rendered size rather than letting the browser downscale large photography, and be mindful that a long list or gallery of images creates one element per item, so lazy loading and virtualization of the surrounding list pay off quickly. Because the component holds no internal state, re-renders are cheap as long as you avoid recreating style objects — Griffel's makeStyles memoizes the generated classes and mergeClasses is the cheap way to combine them.

## Theming & Tokens

Image themes only its chrome, never the pixels of the asset. The bordered stroke is drawn from tokens.colorNeutralStroke1 with tokens.strokeWidthThin, so it automatically lightens or darkens with the FluentProvider theme and is remapped in high-contrast mode. The shape prop resolves to radius tokens: tokens.borderRadiusSmall for the near-square default, tokens.borderRadiusMedium for rounded, and tokens.borderRadiusCircular for fully round images. The shadow prop draws from the elevation ramp — tokens.shadow2 and tokens.shadow4 for low elevation and tokens.shadow8 and above for prominent media — whose ambient and key layers are colored with tokens.colorNeutralShadowAmbient and tokens.colorNeutralShadowKey. Any letterboxed area exposed by fit="contain" is not painted by Image, so surface tokens such as tokens.colorNeutralBackground1 belong on your own container. Because raster assets do not follow theme switching, avoid images that bake in a light background when the surrounding surface can be dark, and prefer transparent assets or assets with self-contained framing for content that must look correct in every theme.

## Migration Notes

Fluent UI v9 Image is a much thinner component than its v8 predecessor. The v8 prop that maximized the frame has been replaced by block, and the v8 enum-driven image fit has been simplified to the fit prop using the string values none, center, contain, cover, and default. The v8 cover style concept no longer exists, because modern layout is handled by fit plus explicit container sizing. The v8 fade-in and start-visible behaviors are gone; there is no built-in opacity animation, loading state, or error source fallback, so teams that relied on a custom error image should implement an explicit fallback (for example an Avatar or a local placeholder rendered conditionally) rather than expecting the component to swap sources. Styles supplied through the v8 styling system must be rewritten as Griffel makeStyles classes and passed through className. Because the root renders a plain image element, native attributes such as width, height, alt, and src are still the supported way to size and describe the image, and this is unchanged conceptually from v8.

## Edge Cases

- There is no built-in error, loading, or placeholder state: when src fails to resolve, the browser's native broken-image rendering appears with the alt text. If a graceful visual fallback is required, render a different component such as Avatar or your own placeholder conditionally in the parent.
- The fit prop is inert when nothing constrains the image. With no parent sizing and no width and height, the image renders at its intrinsic dimensions regardless of which fit value you pass.
- shape="circular" applies a circular crop, so a non-square asset loses its edges; supply square sources for portraits and avatars to avoid clipping important content.
- block sets the width to the parent's width but does not set a height, so tall images inside short containers can overflow unless you also control the container or add fit.
- bordered and shadow can be combined, and the border follows the radius from shape — circular plus bordered yields a circular outline rather than a rectangular frame.
- An empty alt value intentionally hides the image from assistive technology; if the same image is the only label for a wrapping link or button, that control will have no accessible name.
- The component renders only a root image element with no wrapper, so absolutely positioning badges, overlays, or captions requires a positioned parent element that you provide.
- Overriding the root element through the standard slot mechanism changes the semantics away from an image and drops the accessible name supplied by alt, so it should be avoided for real images.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
