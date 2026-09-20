# Skeleton

> **Package**: `@fluentui/react-skeleton` v9.7.3
> **Import**: `import { Skeleton } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

Skeleton is a data-display component that renders placeholder wireframes in place of content that has not finished loading yet. Rather than painting the whole placeholder itself, Skeleton is a container: its required root slot (a div by default) holds the individual placeholder blocks — SkeletonItem elements — and can also hold the real data that Skeleton is standing in for. Skeleton-level props such as size and shape act as defaults that are inherited by the SkeletonItems inside it, and any individual item can override those defaults with its own size and shape. The animation prop controls the motion used to convey activity (a sweeping wave, which is the default, or a soft pulse), while the appearance prop switches between an opaque fill and a translucent fill intended for inverted or MaterialOS-styled surfaces. Because the root also accepts the eventual content, Skeleton is typically kept mounted around a region and its children are swapped between placeholder blocks and real data once the fetch resolves, which keeps layout stable.

**When to use**: Use Skeleton when a region of the UI has a known final geometry and the wait for its data is long enough that an empty area would feel broken — for example cards, list rows, table shells, profile headers, media tiles, or chat messages. Because placeholder blocks are composed explicitly, Skeleton is the right choice when you want the loading state to preview the shape of the eventual content and thus avoid layout shift. Prefer Spinner when you cannot predict the final layout, when the wait is very short or indeterminate in an inline control, or when the loading state belongs to a single small element such as a button. Prefer ProgressBar when progress is measurable, and prefer a plain empty state or MessageBar when the operation has failed or returned nothing. Skeleton is also a poor fit for content that might never resolve — always pair it with a timeout, error, or empty-state path.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `animation` | `"wave" \| "pulse" \| undefined` | — | No | The animation type for the Skeleton |
| `appearance` | `"opaque" \| "translucent" \| undefined` | — | No | Sets the appearance of the Skeleton. |
| `shape` | `"circle" \| "square" \| "rectangle" \| undefined` | — | No | Sets the shape of the SkeletonItems inside the Skeleton. This value can be overridden by the individual SkeletonItem's `shape` prop. |
| `size` | `SkeletonItemSize \| undefined` | — | No | Sets the size of the SkeletonItems inside the Skeleton in pixels. Size is restricted to a limited set of values recommended for most uses (see SkeletonItemSize). This value can be overridden by the individual SkeletonItem's `size` prop. |
| `width` | `string \| number \| undefined` | — | No | Sets the width value of the skeleton wrapper. **Deprecated** |

### Prop Guidance

- **animation**: Selects the motion used to signal that work is in progress. The default is wave, a highlight that sweeps across the placeholder surface; pulse is an alternative that fades the block in and out. Keep wave for a small number of large placeholders and switch to pulse in dense layouts, repeated list rows, or motion-sensitive contexts. `pulse`
- **appearance**: Controls the visual weight of the placeholder. Opaque is the default and is right for standard light or dark surfaces; translucent produces a lighter, semi-transparent fill that sits better on inverted or MaterialOS-styled backgrounds. Verify contrast against the surface before adopting translucent in a normal theme. `translucent`
- **width**: Deprecated. It previously set the width of the skeleton wrapper. Set width on the root through a class name or style instead, alongside height and gap values, so the placeholder matches the dimensions of the loaded content and no longer depends on a deprecated prop. `deprecated — use root CSS sizing`
- **size**: Sets the size, in pixels, of the SkeletonItems inside the Skeleton and is restricted to the recommended SkeletonItemSize values rather than arbitrary numbers. Treat it as the default row height for the placeholder and override it on an individual SkeletonItem only when that block needs a different dimension, such as a larger avatar. `20`
- **shape**: Sets the shape of the SkeletonItems inside the Skeleton: circle for avatars and icons, square for compact tiles and thumbnails, and rectangle for text lines, bars, and media blocks. It provides the default for all children and can be overridden per SkeletonItem — a single avatar circle among rectangular text lines is the canonical use. `rectangle`
- **children**: The root slot contains both the SkeletonItem blocks that compose the placeholder and, when loading finishes, the real content the Skeleton was standing in for. Compose children to mirror the final structure — a row of an avatar circle followed by text rectangles — and swap them for the loaded data rather than unmounting the Skeleton container. `one circle item plus several rectangle items in a row`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | The root slot of the `Skeleton` is the container that will contain the slots that make up a `Skeleton` and any data that the `Skeleton` will load. The default html element is a `div`. |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Skeleton, SkeletonItem } from '@fluentui/react-components';
import type { SkeletonProps } from '@fluentui/react-components';

export const Default = (props: Partial<SkeletonProps>): JSXElement => (
  <Skeleton {...props} aria-label="Loading Content">
    <SkeletonItem />
  </Skeleton>
);
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Field, Skeleton, SkeletonItem, makeStyles, tokens } from '@fluentui/react-components';
import type { SkeletonProps } from '@fluentui/react-components';

export const Appearance = (props: Partial<SkeletonProps>): JSXElement => {
  const styles = useStyles();
  return (
    <div className={styles.invertedWrapper}>
      <Field validationMessage="Opaque Appearance" validationState="none">
        <Skeleton {...props} aria-label="Loading Content">
          <SkeletonItem />
        </Skeleton>
      </Field>
      <Field validationMessage="Translucent Appearance" validationState="none">
        <Skeleton {...props} appearance="translucent" aria-label="Loading Content">
          <SkeletonItem />
        </Skeleton>
      </Field>
    </div>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story: `You can specify the appearance of the Skeleton.
      This is useful for instances where you want to render a Skeleton with a MaterialOS theme`,
    },
  },
};
```

### Animation

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Field, Skeleton, SkeletonItem, makeStyles, tokens } from '@fluentui/react-components';
import type { SkeletonProps } from '@fluentui/react-components';

export const Animation = (props: Partial<SkeletonProps>): JSXElement => {
  const styles = useStyles();
  return (
    <div className={styles.invertedWrapper}>
      <Field validationMessage="Wave animation" validationState="none">
        <Skeleton {...props} aria-label="Loading Content">
          <SkeletonItem />
        </Skeleton>
      </Field>
      <Field validationMessage="Pulse animation" validationState="none">
        <Skeleton {...props} animation="pulse" aria-label="Loading Content">
          <SkeletonItem />
        </Skeleton>
      </Field>
    </div>
  );
};

Animation.parameters = {
  docs: {
    description: {
      story: `You can specify the animation style of the Skeleton.
      The default is 'wave' with the alternative being 'pulse'`,
    },
  },
};
```

## Best Practices

### Do's

- Compose the placeholder out of SkeletonItem children whose shapes and sizes mirror the real content (a circular item for an avatar, rectangles for text lines) so the transition to loaded data is visually seamless.
- Set shared defaults once on Skeleton with the size and shape props, and only override size or shape on the individual SkeletonItem that genuinely differs, such as a 24-pixel circular avatar beside rectangular text lines.
- Give the Skeleton root the same overall dimensions and internal spacing that the loaded content will occupy — apply width, height, and gap values through the root's class name or style — so nothing reflows when the data arrives.
- Always provide an accessible name on the Skeleton, as every documented example does with aria-label="Loading Content", and make it describe the specific region rather than using a generic string for the entire page.
- Keep the Skeleton mounted as the container for both states and swap its children, so the layout skeleton is the same element tree the loaded content uses.
- Choose animation="pulse" for dense or repeated placeholders and keep the default wave animation for a small number of large blocks, where the sweep reads as intentional motion rather than noise.
- Use appearance="translucent" when the placeholder sits on a dark, inverted, or MaterialOS-styled surface where an opaque fill would look too heavy.
- Prefer CSS sizing on the root (via class name or style) over the deprecated width prop so your implementation survives the prop's removal.

### Don'ts

- Don't use the deprecated width prop — set the width on the root with CSS instead so the layout is controlled consistently with height and spacing.
- Don't try to express arbitrary pixel heights through the Skeleton-level size prop; that prop is restricted to the recommended SkeletonItemSize values, so use a numeric size on the individual SkeletonItem or CSS when you need an unusual dimension.
- Don't leave a Skeleton on screen forever when a request stalls or fails; resolve to an error or empty state instead of letting the placeholder imply progress indefinitely.
- Don't use Skeleton to represent a short inline operation such as a button submit or a single value refresh, where a Spinner is the clearer and less disruptive signal.
- Don't let the placeholder geometry drift from the real content — a Skeleton whose rows are a different height, count, or corner radius than the loaded data causes the very layout shift it was meant to prevent.
- Don't wrap an entire page in one large animated Skeleton when only one panel is loading; scope the placeholder to the region that is actually pending.
- Don't stack wave animations on hundreds of placeholder items at once, and don't animate placeholder blocks that the user is unlikely to ever see.
- Don't ship a Skeleton without an accessible name; an unlabeled generic container gives assistive technology users no indication that content is pending.

## Anti-Patterns

### Placeholder geometry that does not match the loaded content

❌ A Skeleton built from arbitrary rectangles and gaps occupies different dimensions than the content that replaces it, so the page jumps when the data resolves — exactly the shift the placeholder was meant to prevent.

✅ Derive the placeholder from the real layout: same row count, same heights, same corner radius, same gaps. Set the Skeleton-level size and shape to the dominant values and override only the items that genuinely differ, then confirm that swapping in the loaded content produces no reflow.

### Using the deprecated width prop for sizing

❌ width is deprecated, so relying on it for the placeholder's dimensions locks the loading state to an API that will be removed and splits sizing logic between a prop and CSS.

✅ Size the root with a class name or style instead, expressing width, height, and spacing together so the placeholder and the loaded content share one layout definition.

### Placeholder used as a permanent loading indicator

❌ When a request hangs or fails, an animated Skeleton keeps implying that content is on its way. Users wait indefinitely, and screen reader users receive no accessible-name change to tell them anything went wrong.

✅ Always pair the Skeleton with a resolution path: swap to the loaded content on success, and swap to an error, empty, or retry state when the request fails or times out. Let the accessible name and the surrounding region reflect the new state.

### Skeleton instead of Spinner for small inline waits

❌ Rendering a wireframe for a single value, a button submit, or a very fast refresh adds visual noise and flashes content in and out faster than users can read it, while hiding the fact that a specific control is busy.

✅ Reserve Skeleton for regions with known, substantial layout. For short or inline operations use Spinner, and for measurable work use ProgressBar, keeping Skeleton for the cases where previewing the final shape is genuinely useful.

### Unlabeled placeholder container

❌ A Skeleton without an accessible name is announced as a generic container, so assistive technology users hear nothing about the pending content while sighted users see an obvious loading state.

✅ Attach aria-label to the Skeleton describing the region that is loading, as every documented example does, and consider hiding the non-semantic SkeletonItem children with aria-hidden so only the meaningful label is exposed.

## Accessibility

**Requirements**: Skeleton is a visual loading affordance, so it must not be the only thing that communicates state. Give the Skeleton root an accessible name with aria-label describing the pending content, keep the placeholder fill visually distinguishable from the surrounding surface (translucent appearance reduces contrast and should be verified against its background), and ensure the real content announced after loading is reachable and focusable in the normal order. Where the loading state is significant to the flow, surface it in the surrounding region as well (for example with a status message or an aria-live region on the container) rather than relying solely on the placeholder graphics. Respect reduced-motion preferences, and prefer the gentler pulse animation for motion-sensitive or high-density contexts.

| Key | Action |
| --- | --- |
| `Tab` | Skeleton is not focusable and does not participate in the tab order, so Tab moves focus straight past the placeholder to the next interactive element. |
| `Enter / Space` | No effect. Skeleton and its SkeletonItem children expose no interactive behavior; any control that should act on the pending region must be authored as a real interactive component. |

**ARIA**: aria-label, aria-hidden

**Screen Reader**: The root div exposes whatever accessible name you supply through aria-label; without one it is announced as an unnamed generic container that gives no hint that content is pending. The SkeletonItem children are non-semantic placeholder blocks and contribute nothing meaningful to the accessibility tree, so they can be hidden from assistive technology with aria-hidden when the surrounding Skeleton already carries the label. Because the placeholder is not focusable, screen reader and keyboard users move directly to surrounding content; if the loading state matters to the task, announce it from the containing region or status element rather than expecting the Skeleton itself to be reported.

## Styling

Style the Skeleton root with makeStyles and Griffel tokens rather than inline values: the root is a plain div, so it accepts layout properties such as display, grid or flex gaps, width, height, and margin. Use tokens.spacingHorizontalM, tokens.spacingVerticalS, and related spacing tokens for the gaps between placeholder rows, and tokens.colorNeutralBackground3 or tokens.colorNeutralBackground4 for the placeholder fill so it tracks the theme. Corner rounding is controlled with tokens.borderRadiusSmall, tokens.borderRadiusMedium, and tokens.borderRadiusCircular — the circular token is what makes a shape="circle" item read as an avatar. The translucent appearance leans on alpha and opacity tokens such as tokens.colorNeutralBackgroundAlpha and tokens.opacityDisabled, so check that the result still separates from the surface underneath. If you override motion on the SkeletonItem root, use tokens.durationSlow with tokens.curveEasyEase to keep the timing in step with Fluent motion, and remember that the root also hosts the loaded content, so keep root styles layout-only (size, grid, gap) and leave color and typography to the real components.

## Performance

Skeleton itself is lightweight — it is a container div plus SkeletonItem blocks — and the wave and pulse effects are declarative animations rather than script-driven updates, so cost is dominated by how many placeholder items you render. Each animated SkeletonItem is a separate element; a few dozen are negligible, but filling a very large grid or an entire dashboard with individually animated items keeps the compositor busy and can make the loading state itself feel slow. In dense views, prefer animation="pulse" over the sweeping wave, or leave the placeholder unanimated for off-screen regions. Because the Skeleton root is designed to stay mounted and host the loaded content, avoid tearing down and recreating the container on every fetch; reusing the same node keeps the layout tree stable and lets the placeholder blocks be replaced in a single render pass.

## Theming & Tokens

Skeleton consumes theme values from the nearest FluentProvider, so it adapts automatically to light and dark themes. The placeholder fill is derived from neutral surface tokens such as tokens.colorNeutralBackground3 and tokens.colorNeutralBackground4, which is why the default opaque appearance stays legible in both themes. The translucent appearance draws on alpha and opacity tokens such as tokens.colorNeutralBackgroundAlpha and tokens.opacityDisabled, making it appropriate over inverted or MaterialOS-style surfaces where an opaque fill would read too heavily — but it also lowers the contrast against the background, so re-check it in a standard theme. Shape rounding maps onto tokens.borderRadiusSmall, tokens.borderRadiusMedium, and tokens.borderRadiusCircular, which is what gives a shape="circle" item its avatar look. Motion is expressed with Fluent duration and curve tokens, so overrides that use tokens.durationSlow and tokens.curveEasyEase stay consistent with the rest of the system.

## Migration Notes

Migrating to v9 changes Skeleton from a component that painted its own placeholder shapes into a compound container: Skeleton provides the root container and the shared defaults, while every visible block is expressed as a SkeletonItem child. The width prop is deprecated — move sizing to the root's CSS (class name or style) so width, height, and spacing are handled the same way. The size prop at the Skeleton level is now constrained to the recommended SkeletonItemSize values and acts as a default that individual SkeletonItems can override with their own numeric size. The appearance prop (opaque, the default, or translucent) and the animation prop (wave, the default, or pulse) are the supported levers for matching inverted or MaterialOS-style surfaces and for choosing between sweeping and pulsing motion.

## Edge Cases

- The width prop is deprecated. It may still accept a value, but sizing should be moved to the root's CSS so the placeholder does not depend on a soon-to-be-removed API.
- The Skeleton-level size prop is limited to the recommended SkeletonItemSize values, so unusual row heights must be expressed either as a numeric size on the individual SkeletonItem or through CSS on the root.
- Per-item size and shape always win over the Skeleton-level defaults, which is the intended way to mix a circular avatar with rectangular text lines — but it also means an overlooked override silently breaks the uniform look of a row.
- The root slot is documented as the container for both the placeholder blocks and the data the Skeleton will load. That means root styles apply to the loaded state too, so keep them to layout properties and avoid painting colors or typography there.
- The translucent appearance can be nearly invisible on a light background; test it against the actual surface before using it outside inverted or MaterialOS-style themes.
- Skeleton never removes itself. Deciding when to stop showing the placeholder, and what to show instead on empty or error results, is the consuming application's responsibility.
- Every documented example supplies aria-label on the Skeleton; omitting it leaves an unnamed container that conveys nothing about pending content to assistive technology.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
