# Image

> **Package**: `@fluentui/react-image` v9.4.2
> **Import**: `import { Image } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

Image is the Fluent UI React v9 data-display component for rendering a single picture on the page. It renders a native image element in the root slot and exposes a small, focused set of styling props - block, bordered, fit, shadow, and shape - that cover the layout, framing, and resize needs of most product surfaces. Additional standard image attributes such as src and alt are passed through to the underlying element, and dimensions such as width and height can be supplied directly to reserve layout space. The component is intentionally unstyled beyond its theme-aware tokens: it does not load lazily, does not add captions, and does not provide a lightbox, so it stays composable inside Card, Dialog, Persona-style layouts, or any custom container. When a source fails to load, the component degrades to the browser's native broken-image behavior while still reserving the requested width and height, as demonstrated by the Fallback story.

**When to use**: Use Image whenever you need to display a photographic or illustrative asset with theme-consistent borders, corner rounding, elevation, and object-fit behavior - for example hero banners in a Card, media thumbnails in a list row, or a bordered avatar-style portrait in a profile header. Choose Image over a plain HTML image element when you want the Fluent design language applied automatically (rounded corners, neutral stroke, themed shadow) and consistent resizing semantics through fit. Choose Avatar or Persona instead when the image represents a person and should participate in presence, initials fallback, or name-label rendering, since Image provides no fallback initials or presence badge. Choose an icon or a CSS background-image instead when the graphic is purely decorative chrome rather than content, since decorative backgrounds do not need alt text or layout reservation.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `block` | `boolean \| undefined` | `false` | No | An image can take up the width of its container. |
| `bordered` | `boolean \| undefined` | `false` | No | An image can appear with a rectangular border. |
| `fit` | `"none" \| "center" \| "contain" \| "cover" \| "default" \| undefined` | `'default'` | No | An image can set how it should be resized to fit its container. |
| `shadow` | `boolean \| undefined` | `false` | No | An image can appear elevated with shadow. |
| `shape` | `"square" \| "circular" \| "rounded" \| undefined` | `'square'` | No | An image can appear square, circular, or rounded. |

### Prop Guidance

- **block**: Makes the image stretch to the full width of its parent container by removing the intrinsic sizing constraint. Use it for banners, hero media, and any image that should follow the container's responsive width. Pair it with an explicitly sized parent, and prefer fit to control how the picture fills the resulting box. Defaults to false, meaning the image keeps its natural rendered size. `true`
- **bordered**: Draws a one-pixel themed outline around the image regardless of shape, which keeps the picture visually separated from a same-tone background. Combine it with shape="rounded" or shape="circular" exactly as the Bordered story does. Defaults to false; enable it deliberately rather than everywhere, since a frame on every thumbnail adds visual noise. `true`
- **fit**: Determines how the picture is resized relative to its container. Use "cover" to fill a fixed-ratio container completely (cropping the overflow), "contain" to keep the entire picture visible while preserving aspect ratio, "center" to center the image within its box, and "none" to leave the source at its intrinsic size. Defaults to "default", which applies no explicit resize behavior. `cover`
- **shadow**: Applies box-shadow elevation to the image so it appears to float above the surface beneath it. Use it on media inside Dialog, Popover, or other floating surfaces, and generally avoid combining it with bordered on the same image. Defaults to false. `true`
- **shape**: Controls the corner treatment. Use "square" for content imagery, "rounded" to match cards and inputs, and "circular" for portrait-style media that should echo Avatar. Defaults to "square", so rounding is always an explicit choice. `circular`
- **alt**: Native attribute documented in the Default story: a description of the image that is not strictly mandatory but is incredibly useful for accessibility. Provide descriptive text for informative images and an empty value for decorative ones. When width and height are present, alt text is also what users see if the asset fails to load. `Portrait of Allan Munger`
- **as**: Slot polymorphism for the root element, used to render a different element or a custom image component. It is intentionally hidden from the storybook controls, so change it only when you need to substitute the rendered element and you accept responsibility for forwarding the image attributes yourself. `img`

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

- Always provide a meaningful alt value that describes the content of the picture; the Default story documents alt as a description that is not strictly mandatory but is incredibly useful for accessibility.
- Use alt="" for purely decorative images so assistive technology skips them instead of announcing a file name.
- Supply width and height together (as the Bordered and Shape stories do) so the browser can reserve space before the bytes arrive and avoid layout shift.
- Use block when the image should stretch to the width of its parent container, such as a banner spanning a Card or Dialog body.
- Pick fit="cover" for fixed-ratio containers that must be completely filled, and fit="contain" when the whole picture must remain visible without cropping.
- Apply shape="circular" or shape="rounded" to match surrounding surfaces instead of writing per-instance border-radius overrides.
- Use shadow sparingly and mostly on images that sit above a surface, such as floating media inside a Popover or Dialog.
- Add bordered when the picture sits on a background of similar tone, so the edge of the image stays legible.

### Don'ts

- Do not omit alt on informative images; a missing alt forces screen readers to announce the file path or URL.
- Do not rely on shape="circular" alone for person identity - that is the job of Avatar and Persona, which handle fallbacks and presence.
- Do not use block together with fixed width attributes expecting the width to win; block makes the image take the width of its container and the explicit width is overridden.
- Do not stack bordered, shadow, and a heavy custom border on the same image; the result reads as a double frame and fights the theme's stroke token.
- Do not use fit="none" with a source larger than its container and expect clipping-free output - the image will overflow the box unless the container hides overflow.
- Do not wrap Image in extra layout divs solely to set size; width, height, block, and the styling props already cover standard sizing needs.
- Do not treat Image as a loading or error-state component; there is no built-in spinner, skeleton, or custom fallback content beyond the native broken-image rendering.
- Do not use Image for icons or simple glyphs; icons scale with font size and inherit currentColor, which Image cannot do.

## Anti-Patterns

### Image used as the clickable target

❌ A native image element is not focusable and has no activation semantics, so an image with an onClick handler is invisible to keyboard users and to screen reader users navigating by control.

✅ Wrap the image in a Link or Button (or place it inside a Card with a clear action) and give that control an accessible name, letting the interactive component provide focus, focus ring, and Enter/Space activation.

### Missing or decorative-hostile alt text

❌ Omitting alt causes assistive technology to announce the file path, while giving every decorative flourish a description creates noise that slows down screen reader navigation.

✅ Write a short, purposeful alt for images that convey information, and use an empty alt together with aria-hidden or role="presentation" for purely decorative artwork.

### Fighting block with fixed dimensions

❌ Setting block alongside a fixed width is contradictory: block makes the image take the width of its container, so the explicit width is overridden and the layout can jump once the asset loads.

✅ Decide which behavior you want. If the image should track the container, use block and size the parent; if it should keep a fixed footprint, set width and height and omit block.

### Expecting a loading or error state

❌ Image has no spinner, skeleton, or custom fallback rendering, so treating it as a resilient media component leaves users staring at a blank or broken area when an asset is slow or missing.

✅ Implement loading and fallback states in the surrounding composition - reserve space with width and height, render Skeleton or Spinner while your data resolves, and choose an asset strategy that guarantees a valid source.

### Over-stacking visual treatments

❌ Combining bordered, shadow, a custom border, and an unusual radius produces a frame-inside-a-frame that conflicts with theme strokes and looks off in dark or high-contrast themes.

✅ Pick one framing treatment per image: bordered for edge definition, or shadow for elevation, and use shape for the corner treatment so the values stay theme-driven.

## Accessibility

**Requirements**: Image renders the native image element, so the core requirement is a correct text alternative: supply alt with a concise description for informative pictures and alt="" for decorative ones. Because Image is non-interactive, it must not be the only affordance for an action - if the picture is clickable, wrap it in a Link or Button so focus, focus ring, and keyboard activation are handled, and give that control an accessible name. Maintain sufficient contrast between the bordered stroke and the surrounding surface, and never place essential text inside the image bitmap without an equivalent text alternative. If an image is animated or conveys motion, respect reduced-motion expectations by swapping the source rather than animating the element.

| Key | Action |
| --- | --- |
| `None` | Image renders a native, non-focusable image element and handles no keyboard interaction of its own. |
| `Enter / Space` | Only relevant when the image is nested inside an interactive parent such as a Link or Button; the parent handles activation and the image inherits its focus behavior. |

**ARIA**: alt (native attribute; use a description for informative images and an empty string for decorative ones), aria-hidden="true" (set on the wrapper or image when the picture is purely decorative and alt cannot be empty), role="presentation" or role="none" (only when the image is decorative and should be removed from the accessibility tree), aria-label (rare; use only when the image must be named programmatically and alt is not appropriate), aria-describedby (point at adjacent caption or description text when the image needs a longer explanation than alt allows)

**Screen Reader**: Screen readers expose the image according to its text alternative: with a populated alt they announce it as an image with that name, with an empty alt they skip it entirely, and with no alt they may announce the file name or URL, which is why alt should never be omitted. Because Image has no interactive role, it never receives keyboard focus, and any interaction built around it is announced through the wrapping Link, Button, or other interactive component. When the source fails to load, most screen readers still announce the alt text, which is the primary reason to keep alt accurate even for assets that may 404.

## Styling

Image accepts className and style, so the recommended approach is to create Griffel classes with makeStyles and merge them using mergeClasses instead of overriding internals. Shape is the most common customization: shape="rounded" maps to the theme's medium corner radius token (tokens.borderRadiusMedium), and shape="circular" maps to the fully round token (tokens.borderRadiusCircular); if you need a bespoke radius, set borderRadius with a real token such as tokens.borderRadiusSmall or tokens.borderRadiusXLarge rather than a magic number. The bordered prop draws a neutral outline using tokens.colorNeutralStroke1, so match any custom frame to that token for theme consistency. The shadow prop elevates the picture with an elevation token (tokens.shadow4 is the canonical small-surface elevation, with tokens.shadow2, tokens.shadow8, and tokens.shadow16 available for larger emphasis) plus a transparent stroke via tokens.colorTransparentStroke to keep the silhouette crisp. Object-fit values come from fit, so avoid hand-writing objectFit unless you need a value outside the supported set. To control a custom ratio, prefer setting aspectRatio on a wrapper and letting fit="cover" handle the crop, and use tokens.spacingHorizontalS or tokens.spacingVerticalS for gaps when you place several images side by side as the Shape and Bordered stories do.

## Performance

Image is a thin wrapper over the native image element, so rendering cost is essentially the cost of decoding and painting the asset. Always specify width and height (or a fixed-size/aspect-ratio parent) so the browser can reserve layout space and avoid cumulative layout shift when the asset arrives; the Bordered, Fallback, and Shape stories all pass explicit dimensions for this reason. Because the component adds no loading behavior of its own, lazy loading, responsive source sets, and decoding hints are your responsibility - either pass them through to the element or substitute the root and handle them yourself. Serving appropriately sized files matters more than any prop choice: a large source combined with fit="cover" still downloads the full bitmap and only crops it at paint time. When rendering many images in a list or grid, avoid re-creating wrapper elements on every render and keep the source URLs stable so the browser cache can do its job.

## Theming & Tokens

Image is fully theme-aware and reads its visuals from the Fluent theme tokens exposed through the Provider, so it adapts automatically between light, dark, and high-contrast themes. The bordered treatment draws from the neutral stroke palette (tokens.colorNeutralStroke1) and the shadow treatment combines an elevation token such as tokens.shadow4 or tokens.shadow8 with a transparent stroke (tokens.colorTransparentStroke) so the silhouette stays crisp in every theme. Corner rounding uses the theme's radius scale, principally tokens.borderRadiusMedium for shape="rounded" and tokens.borderRadiusCircular for shape="circular". The component paints no background of its own, so if you need a placeholder fill behind a transparent asset, use an explicit token such as tokens.colorNeutralBackground3 on a wrapper rather than assuming a default. Any branded or high-contrast variant should be expressed by overriding these same tokens in a custom theme instead of hard-coding colors on the image.

## Migration Notes

Moving from the previous major version, the resize behavior that used to be expressed through enum-style image-fit values is now a plain string union on the fit prop, with the default value applying no explicit object-fit. The separate flags that used to express framing and elevation are consolidated into the boolean bordered and shadow props, and the corner treatments are consolidated into the single shape prop with square, rounded, and circular options rather than two mutually exclusive booleans. Styling has moved from a legacy style-object prop to Griffel classes applied through className, so any custom CSS from the old API should be rewritten with makeStyles and mergeClasses. If you previously relied on a component-level fixed-frame behavior, replace it with block plus an explicitly sized parent container.

## Edge Cases

- When a source fails to load, the component falls back to the browser's native broken-image rendering while still honoring width and height and presenting the alt text, as shown in the Fallback story; there is no component-level error slot to customize.
- fit="none" keeps the source at its intrinsic size, so a large bitmap inside a small fixed-size container (for example a 600x200 source in a 150x300 box) will overflow unless the container clips it.
- shape="circular" applied to a non-square source produces an ellipse rather than a circle, because the shape maps to a border radius; pair circular with equal width and height for a true circle.
- block removes intrinsic sizing, so inside a flex row it can stretch or shrink unexpectedly unless the flex item is allowed to shrink and the parent controls the width.
- A missing alt does not throw or warn; the page still renders, but assistive technology may announce the file path, so alt correctness is entirely the caller's responsibility.
- Because there is no built-in loading indicator, images that resolve slowly leave an empty reserved area, which is why explicit dimensions plus an external Skeleton or Spinner are recommended for slow sources.

## See Also

- - [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
