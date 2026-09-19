# Skeleton

> **Package**: `@fluentui/react-skeleton` v9.7.3
> **Import**: `import { Skeleton } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

Skeleton is a data-display component that renders an animated placeholder in the shape of content that has not loaded yet. The component is intentionally split in two: Skeleton is the root container (a div by default) that holds the wireframe, and SkeletonItem elements are the individual placeholder blocks placed inside it. Because Skeleton owns the layout container, it can propagate shared presentation down to its items: the size prop sets the pixel height of the SkeletonItems inside it, and the shape prop sets their default geometry, while each individual SkeletonItem may still override those values with its own size and shape. It supports two motion styles through the animation prop (wave, the default, or pulse) and two surface treatments through the appearance prop (opaque or translucent, the latter intended for colored, image, or Material-style backgrounds). Skeleton is purely presentational and non-interactive: it never receives focus, has no click or key handlers, and exists to reserve space and communicate 'content coming' until the real data replaces it.

**When to use**: Use Skeleton when the eventual layout of the incoming content is known and structured, such as a card, list, table, profile header, or feed. In those cases a wireframe of blocks preserves the geometry of the final content and prevents the page from jumping when data arrives, which feels calmer than an abrupt blank region. Choose Skeleton for first-load placeholders on structured regions and for refreshes where the existing layout must stay stable. Prefer Spinner or Progress instead when the final layout is unknown, when the wait is very long or unbounded, when the operation is blocking (a full-page load or a modal gate), or when the region is so small that a single shimmer bar conveys nothing useful. Do not use Skeleton as an empty state, as decoration, or as a permanent placeholder: it is a transient loading signal that should be removed the moment content is available or an error is shown.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `animation` | `"wave" \| "pulse" \| undefined` | — | No | The animation type for the Skeleton |
| `appearance` | `"opaque" \| "translucent" \| undefined` | — | No | Sets the appearance of the Skeleton. |
| `shape` | `"circle" \| "square" \| "rectangle" \| undefined` | — | No | Sets the shape of the SkeletonItems inside the Skeleton. This value can be overridden by the individual SkeletonItem's `shape` prop. |
| `size` | `SkeletonItemSize \| undefined` | — | No | Sets the size of the SkeletonItems inside the Skeleton in pixels. Size is restricted to a limited set of values recommended for most uses (see SkeletonItemSize). This value can be overridden by the individual SkeletonItem's `size` prop. |
| `width` | `string \| number \| undefined` | — | No | Sets the width value of the skeleton wrapper. **Deprecated** |

### Prop Guidance

- **animation**: Selects the motion style of the placeholder. wave, the default, sweeps a highlight across each block and reads as an active, short-lived load; pulse fades the blocks in and out and is the better choice for long waits, large wireframes, or pages where many Skeletons animate simultaneously. Keep one animation value per view so the page feels coherent. `pulse`
- **appearance**: Controls the surface treatment of the placeholders. opaque, the default, paints solid neutral stencil tones and belongs on ordinary page backgrounds. translucent renders semi-transparent stencils so whatever sits behind the Skeleton shows through, which is what you want over images, colored bands, or Material-style themes. Do not mix the two appearances in one region. `translucent`
- **size**: Sets the pixel height of the SkeletonItems inside the root and is restricted to a small set of recommended values, which keeps placeholders on a consistent scale across a product. Values are overridable per item, so use this to establish the dominant line height of the wireframe (for example a 20-pixel body-text rhythm) and raise or lower individual items only where the real content differs. `20`
- **shape**: Sets the default geometry of the SkeletonItems inside the root. Use circle for avatars, icons, and other round elements, rectangle for text lines, image blocks, and bars that should fill available width, and square for tiles and thumbnails. Individual items may override the inherited shape, which is how a row that is mostly text lines still renders a round avatar. `circle`
- **width**: Deprecated. It sets the width of the skeleton wrapper, but wrapper dimensions should be expressed with className, makeStyles, and layout tokens instead so that Skeleton participates in the same layout system as the real content. Do not introduce new usages; remove existing ones when you touch the surrounding code. `240`

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

- Build the Skeleton wireframe to mirror the real content: match the number of rows, the relative widths of text lines, and the sizes of avatars and media blocks so the transition to loaded content causes no layout shift.
- Set size and shape once on the Skeleton root and let them cascade to the SkeletonItems, then override only the individual items that genuinely differ from the majority (for example a circular avatar at a larger size inside a row of text lines).
- Give the Skeleton root a meaningful aria-label describing what is loading, exactly as the documented examples do with 'Loading Content', so assistive technology announces the region rather than silence.
- Use the default wave animation for short, localized loads and animation set to pulse for large wireframes, long-running loads, or pages with several Skeletons animating at once, since pulse is visually calmer and cheaper to paint.
- Use appearance set to translucent when the Skeleton is layered over an image, a colored band, or a Material-style theme, and keep the default opaque appearance on standard neutral page surfaces.
- Render the Skeleton in the same render pass in which the request starts, and size the root with className or makeStyles rather than the deprecated width prop, so the placeholder occupies its final dimensions immediately.
- Keep wave or pulse consistent across a page: if several regions are loading at once, drive them all with the same animation value so the page does not look like two different designs.

### Don'ts

- Do not use the deprecated width prop. Style the root through className with makeStyles and tokens instead, so width is expressed with the same rules as the rest of your layout.
- Do not place interactive children, links, buttons, or form fields inside a Skeleton or make SkeletonItems focusable; the placeholder is not a functioning UI and creating focusable dead ends traps keyboard users.
- Do not attach an aria-label to every SkeletonItem. Repeating the same label dozens of times makes screen readers announce an identical phrase over and over; label the root once, or mark decorative items with aria-hidden.
- Do not leave a Skeleton on screen after the request resolves, on an error path, or as an indefinite placeholder. Swap it for content, an error message, or an empty state as soon as the outcome is known.
- Do not use Skeleton for a single short line of text or for a wait shorter than a fraction of a second, where the flash of placeholder is more distracting than an empty region.
- Do not mix wave and pulse within the same view, and do not stack several different appearances (opaque and translucent) in one region; the shimmer should read as one consistent surface.
- Do not assume Skeleton enforces alignment inside the wireframe. Multiple SkeletonItems inside your own divs stack according to your styles, so an unstyled wireframe can look ragged; supply the row and column layout yourself.

## Anti-Patterns

### Wireframe that does not match the loaded content

❌ A generic stack of bars that ignores the real structure (a square where an avatar appears, three lines where the card renders five) forces an obvious reflow when data arrives, so the loading state feels like a jump rather than a transition and the page appears to flicker.

✅ Model the placeholder on the actual component: same row count, similar relative widths, matching avatar sizes and image aspect ratios. Use the Skeleton root's size and shape to set the dominant values and override only the items that differ, as shown in the row-based wireframe examples.

### Labelling every placeholder block

❌ Putting an aria-label, title, or other announcement on each SkeletonItem produces a stream of identical labels that a screen reader user must listen to or navigate past, and it can make decorative placeholders sound like real controls.

✅ Label the Skeleton root once with text such as 'Loading Content', or hide the whole wireframe with aria-hidden when the loading state is already announced elsewhere, and leave individual SkeletonItems unlabelled.

### Skeleton as a permanent or failure state

❌ Leaving the placeholder mounted after a request resolves, times out, or fails keeps the page in a fake perpetual loading state, hides the real outcome from the user, and in the failure case offers no path forward.

✅ Treat Skeleton as strictly transient. Swap it for the real content on success, for an error message with a recovery action on failure, and for an empty state when the result set is legitimately empty.

### Sizing the wrapper with the deprecated width prop

❌ The width prop is deprecated, and combining it with class-based sizing causes two competing sources of truth for the same wrapper, which is confusing when the layout is later refactored or when the Skeleton is swapped for real content.

✅ Remove width usages and set dimensions on the root with className and makeStyles, ideally reusing the same layout styles that the loaded content will use so the two are guaranteed to align.

### Interactive or focusable content inside a Skeleton

❌ Buttons, links, or inputs placed inside a wireframe, or tabIndex applied to placeholder blocks, create focus stops that lead to non-functional UI, which is disorienting for keyboard and screen reader users and violates the contract that the region is not yet usable.

✅ Keep Skeleton purely presentational. Render the real interactive controls only after loading completes, and make sure the placeholder itself is never focusable.

## Accessibility

**Requirements**: Skeleton must never be focusable or part of the tab order, since it represents content that does not yet exist. When the Skeleton stands in for a region whose load state should be conveyed, give the root a descriptive aria-label (the documented examples use 'Loading Content') and set aria-busy on the surrounding container that actually owns the data; remove the attribute once loading finishes. When a Skeleton is purely decorative because a nearby Spinner, Progress, or live region already announces the loading state, hide it from assistive technology with aria-hidden instead of labelling it, so the same status is not reported twice. Ensure the shimmer remains perceptible against its page background in every theme and in forced-colors mode, and treat vestibular comfort seriously: Skeleton animates continuously, so for users who prefer reduced motion, test the result and, where necessary, suppress the background-position animation in a reduced-motion media query.

| Key | Action |
| --- | --- |
| `Tab` | No effect. Skeleton is not focusable and is skipped entirely in the tab order; focus stays on the control or region that triggered the load. |
| `Shift + Tab` | No effect. The component is never a tab stop, so reverse navigation passes over it as well. |
| `Enter` | No effect. Skeleton has no activation behavior and exposes no click handler. |
| `Space` | No effect. The component cannot be activated or toggled from the keyboard. |
| `Escape` | No effect. Any dismissal of the surrounding loading experience must be implemented by the containing dialog, drawer, or page. |
| `Arrow keys` | No effect. Skeleton contains no internal navigation or roving focus. |

**ARIA**: aria-label, aria-hidden, aria-busy, aria-live

**Screen Reader**: Skeleton itself has no built-in role or live-region semantics, so what a screen reader announces depends entirely on the attributes you add. If the root carries a label such as 'Loading Content', that text is read when the user navigates to the region, giving an audible cue that content is pending. Individual SkeletonItems are generic elements and produce no meaningful output; marking them aria-hidden removes any noise they could generate from labels or nesting. Because the placeholder is replaced by real content rather than updated in place, the most reliable pattern is to keep the announcement on the parent container (aria-busy while loading, aria-live polite on a status element that is updated when loading completes) and to keep the Skeleton either clearly labelled or fully hidden.

## Styling

Skeleton is styled with Griffel through makeStyles and the tokens object, so the DOM you target is the root container rather than the individual placeholders. Use className on the Skeleton root to control the overall width, max-width, and grid or flex arrangement of the wireframe, and add rowGap with a spacing token such as tokens.spacingVerticalS to tune the vertical rhythm between SkeletonItems; horizontal spacing between items in a row is handled by the row styles you write, for example columnGap with tokens.spacingHorizontalMNudge. Avoid the deprecated width prop and express dimensions through styles instead. Individual SkeletonItem blocks can be sized precisely with their own size prop, which is the supported way to render a large circular avatar next to narrow text lines. Because the shimmer is painted as a moving background gradient, you cannot restyle it with a plain backgroundColor on the item without a higher-specificity override; prefer overriding the backgroundImage on the item's class if you need a brand-tinted shimmer, and verify your override in both light and dark themes.

## Performance

Skeleton contains no JavaScript animation: the shimmer is produced by CSS on the SkeletonItem blocks, so the cost is rendering and painting rather than scripting. The default wave animation moves a background gradient, which repaints each item on every frame and is therefore heavier than the pulse animation's single fade; for large wireframes, long-lived loads, or pages with several Skeletons, choose pulse to cut paint work. Each SkeletonItem is its own element, so a wireframe with dozens of blocks multiplies DOM nodes and gradient paints; keep the placeholder to a representative handful of rows instead of a full facsimile of a very long list. Keep the Skeleton mounted for the duration of the request instead of toggling it on and off, since unmounting restarts the animation and can produce visible flicker, and let the parent own the conditional render that swaps the placeholder for content.

## Theming & Tokens

Skeleton draws its colors from theme-aware Griffel tokens, so it adapts automatically across webLightTheme, webDarkTheme, and the Teams themes without any prop changes. The opaque appearance paints a moving gradient built from tokens.colorNeutralStencil1 and tokens.colorNeutralStencil2, which are neutral stencil tones that deliberately sit apart from tokens.colorNeutralBackground1 in both light and dark themes. The translucent appearance uses the alpha variants tokens.colorNeutralStencil1Alpha and tokens.colorNeutralStencil2Alpha so the surface behind the placeholder remains visible, making it the right choice over images and non-neutral backgrounds. Shapes map to radius tokens, with circle relying on tokens.borderRadiusCircular and rectangle and square using medium and small radii tokens for their corners, so corner rounding follows the theme's geometry. Animation timing comes from the theme's duration tokens, so a theme that adjusts motion timing also adjusts the shimmer. If you override the shimmer colors, do it by replacing the background gradient on your own class and verify contrast against the surface in every theme you support.

## Migration Notes

Skeleton in Fluent UI React v9 replaces the placeholder patterns of earlier Fluent generations, which relied on Shimmer and shimmer element groups rather than a Skeleton container with SkeletonItem children. The conceptual shift is composition: instead of describing a shimmer pattern to be generated for you, you now lay out explicit SkeletonItem blocks inside a Skeleton root and match the real content's geometry yourself. Within v9, the width prop is deprecated and should be replaced by styling the root with className and Griffel tokens; if you are carrying forward older markup that passes width, migrate those usages rather than mixing the prop with class-based sizing, since both target the same wrapper. The animation and appearance props carry over the same intent as earlier shimmer settings, with wave as the default motion, and the translucent appearance is the option to reach for when you are not on a standard opaque neutral surface.

## Edge Cases

- An individual SkeletonItem's size and shape always win over the values inherited from the Skeleton root, and the component will not warn about the mismatch, so a wireframe can silently mix scales if overrides are applied inconsistently.
- Circle and square shapes are constrained to the item's size value, while rectangle stretches to the width available in its container; a rectangle inside a flex row without an explicit width can collapse or stretch unexpectedly.
- The translucent appearance can become nearly invisible over a busy or light image because the stencil tones are semi-transparent; add a scrim or fall back to the opaque appearance when the background is not predictable.
- The deprecated width prop and class-based sizing both target the same wrapper, so providing both can produce surprising layout results during migration.
- Skeleton renders a plain div, so inside a constrained grid or flex parent the wireframe can be squeezed to zero height if the SkeletonItems have no size and the parent has no explicit dimensions.
- The animation runs continuously for as long as the component is mounted; there is no built-in stop condition, so an unmounted-only-on-success pattern will leave the shimmer running forever on the error path.
- Complex wireframes built from your own divs, as in the multi-row examples, depend entirely on your layout styles for alignment; Skeleton itself does not arrange items into rows or columns.
- Because the placeholder is replaced rather than updated in place, assistive technology may not re-announce the region when content loads unless the parent container manages focus or a live region.

## See Also

- - [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
