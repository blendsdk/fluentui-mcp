# ProgressBar

> **Package**: `@fluentui/react-progress` v9.5.2
> **Import**: `import { ProgressBar } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

ProgressBar is a non-interactive feedback component that communicates how much of a task or operation has completed. It renders a horizontal track (the root slot) with a filled bar, where the bar's fill is proportional to the value prop relative to max. When value is omitted (undefined), the component renders an indeterminate state in which the bar is animated with the indeterminateMotion slot to signal that work is in progress but the duration is unknown. ProgressBar supports four status colors (brand, success, warning, error), two thicknesses (medium and large) and two shapes (rounded and square), making it adaptable to dense inline layouts as well as prominent page-level or card-level progress reporting. It is almost always paired with visible text describing the operation — commonly a Field label or validationMessage — so the state is understandable without relying on the bar alone.

**When to use**: Use ProgressBar whenever an operation takes long enough that users need feedback about (a) that it is running and (b) optionally how far along it is — file uploads and downloads, data imports, indexing, multi-step background jobs, or long-running queries. Choose the determinate form (provide value, and max when your total is not 1) when you can actually compute completion, and the indeterminate form (omit value) only when the duration or remaining work is genuinely unknown. Prefer ProgressBar over Spinner when progress is measurable or when the task is long enough that users benefit from a persistent, glanceable indicator, and prefer Spinner for short, inline, or blocking waits where a thin bar would be visually noisy. Use Skeleton instead when you are representing placeholder content rather than completing work, and use MessageBar or Field validation messages when you need to report failures rather than progress. ProgressBar is also a good fit inside Cards, Dialogs, Drawers, or page headers where a status label plus a bar gives users a clear, continuous read of activity.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `color` | `"brand" \| "success" \| "warning" \| "error" \| undefined` | `brand` | No | The status of the ProgressBar bar. Changes the color of the bar. |
| `max` | `number \| undefined` | `1` | No | The maximum value, which indicates the task is complete. The ProgressBar bar will be full when `value` equals `max`. |
| `shape` | `"rounded" \| "square" \| undefined` | `rounded` | No | The shape of the bar and track. |
| `thickness` | `"medium" \| "large" \| undefined` | `medium` | No | The thickness of the ProgressBar bar |
| `value` | `number \| undefined` | — | No | A decimal number between `0` and `1` (or between `0` and `max` if given), which specifies how much of the task has been completed.  If `undefined` (default), the ProgressBar will display an **indeterminate** state. |

### Prop Guidance

- **value**: The heart of the component. Supply a number to render a determinate bar; the fill is computed as value divided by max. Omit it entirely to render the indeterminate, animated state used when the duration is unknown. Keep the number inside the 0 to max range and avoid floating-point noise by rounding before passing it. `0.5`
- **max**: Defines what 'complete' means when your unit is not a fraction. Leave it at its default of 1 for percentage-style values, or set it to your domain total (number of files, records, steps) so the bar fills exactly when value reaches max. max must be greater than zero. `42`
- **color**: Communicates status through the bar color: brand is the default for ordinary in-progress work, success for completed or healthy operations, warning for results that need attention, and error for failures. Always reinforce the color with text so the meaning is not color-dependent. `error`
- **shape**: Controls the corner treatment of both the track and the bar. Keep the default rounded shape for standard Fluent surfaces; switch to square for flush, edge-to-edge bars or layouts where sharp geometry matches the surrounding elements. `square`
- **thickness**: Controls the visual weight of the bar. Use the default medium for dense UI such as lists, cards, and toolbars, and large when the bar is a focal point, for example in a page header, an empty state, or a dialog reporting a long-running operation. `large`
- **indeterminateMotion**: The motion slot that animates the bar in the indeterminate state. Leave it untouched for the default sweep animation, override it with a custom motion component when your product uses a different motion language, or pass null to disable the animation entirely, for example to honor a reduced-motion preference. `null to disable the animation`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `bar` | — | Yes | The filled portion of the ProgressBar bar. Animated in the indeterminate state, when no value is provided. |
| `indeterminateMotion` | — | No | Motion slot for the indeterminate animation. Pass `null` to disable the animation. |
| `root` | — | Yes | The track behind the ProgressBar bar |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement, ProgressBarProps } from '@fluentui/react-components';
import { Field, ProgressBar } from '@fluentui/react-components';

export const Default = (props: Partial<ProgressBarProps>): JSXElement => {
  return (
    <Field validationMessage="Default ProgressBar" validationState="none">
      <ProgressBar {...props} value={0.5} />
    </Field>
  );
};
```

### Color

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Field, ProgressBar, makeStyles } from '@fluentui/react-components';

export const Color = (): JSXElement => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <Field validationMessage="Error ProgressBar">
        <ProgressBar value={0.75} color="error" />
      </Field>

      <Field validationMessage="Warning ProgressBar" validationState="warning">
        <ProgressBar value={0.95} color="warning" />
      </Field>

      <Field validationMessage="Success ProgressBar" validationState="success">
        <ProgressBar value={1} color="success" />
      </Field>
    </div>
  );
};

Color.parameters = {
  docs: {
    name: 'Validation State',
    description: {
      story:
        'The `color` prop can be used to indicate a `"brand"` state (default), `"error"` state (red), `"warning"` state (orange), ' +
        'or `"success"` state (green).',
    },
  },
};
```

### Indeterminate

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Field, ProgressBar } from '@fluentui/react-components';

export const Indeterminate = (): JSXElement => {
  return (
    <Field validationMessage="Indeterminate ProgressBar" validationState="none">
      <ProgressBar />
    </Field>
  );
};

Indeterminate.parameters = {
  docs: {
    description: {
      story: `ProgressBar is indeterminate when 'value' is undefined.
      Indeterminate ProgressBar is best used to show that an operation is being executed.`,
    },
  },
};
```

## Best Practices

### Do's

- Provide a decimal value between 0 and 1 (or between 0 and max when max is set) whenever completion can be measured, so the bar reflects real progress instead of a decorative animation.
- Set max whenever your domain count is not a fraction — for example max of 42 files downloaded — and keep value within the inclusive 0 to max range so the bar fills exactly once the task completes.
- Pair every ProgressBar with visible text that names the operation and, ideally, the numbers involved; a Field validationMessage such as a file-count sentence is a natural place for that copy.
- Choose color deliberately: brand for neutral, ongoing work, success when a task finishes cleanly, warning when the result needs attention, and error when the operation failed.
- Use thickness="large" in spacious, hero-like contexts such as page headers or empty states, and keep the default medium thickness inside dense surfaces such as table rows, cards, or toolbars.
- Keep shape consistent across a single surface — the default rounded shape matches Fluent corner radii, while square reads better for flush, edge-to-edge bars that span a container's full width.
- Give the bar an accessible name with aria-label or aria-labelledby when no adjacent element already names the operation, so screen reader users know what is progressing.
- Disable or replace the indeterminate animation (by passing null to or overriding the indeterminateMotion slot) only when your product's motion language requires it or when the user has asked for reduced motion.

### Don'ts

- Don't render an indeterminate ProgressBar for work whose completion you can compute; an animated bar with no value tells users the duration is unknown, which is misleading when it is not.
- Don't use ProgressBar to display metrics that are not progress, such as a rating out of five, a quality score, or a static capacity gauge — those should use Rating, RatingDisplay, or plain data visualization instead.
- Don't rely on color alone to communicate success, warning, or error; always combine the color prop with text such as a Field validationMessage so color-blind users and screen reader users get the same information.
- Don't pass negative values, values greater than max, or a max of 0 — the computed fill becomes meaningless or undefined and the bar may appear empty, full, or broken.
- Don't drive value from a very fast timer or from every render of an unrelated parent; update it at a human-readable cadence so the bar does not thrash and the surrounding UI does not re-render needlessly.
- Don't use thickness or shape to encode state or severity — they are purely visual choices, and mixing them to indicate status creates an inconsistent, hard-to-learn interface.
- Don't leave a determinate bar unlabeled or unaccompanied by copy; a bare filled rectangle gives users no idea whether it represents an upload, an import, or a save operation.
- Don't stack multiple indeterminate ProgressBars for independent concurrent tasks in the same region; consolidate into a single summary bar with text, or surface each task with its own labeled row.

## Anti-Patterns

### Indeterminate by default

❌ Leaving value undefined because it is easier than wiring up real progress makes every operation look like it has an unknown duration. Users cannot tell whether the task is nearly finished or stalled, and the animation becomes background noise.

✅ Compute and pass value whenever the underlying task reports progress, and reserve the indeterminate form for requests or jobs where no meaningful completion estimate exists.

### Color as the only status signal

❌ Switching to color="error" or color="success" without accompanying text means users with color vision deficiencies, and screen reader users, receive no status information at all from the bar.

✅ Pair the color prop with descriptive copy, such as a Field validationMessage stating that the operation failed or completed, so the status is conveyed in words as well as color.

### Using ProgressBar as a generic meter

❌ Repurposing a progress bar to show a score, a rating, or a static capacity number misuses the progress affordance — users assume the value will advance toward completion, which it never does.

✅ Choose a component that matches the data: Rating or RatingDisplay for scores, Text plus a chart or gauge for static measurements, and ProgressBar only for work that actually progresses over time.

### High-frequency value churn

❌ Updating value on every animation frame or for every byte transferred forces the surrounding tree to re-render constantly, which can make the very operation the bar describes feel slower and can cause visible jitter.

✅ Throttle or batch progress updates to a human-readable cadence, and use max with a coarse unit (files, records, steps) when a fine-grained ratio is not necessary.

### Unlabeled progress

❌ A bare bar with no accessible name gives screen reader users a value with no idea what is being measured, and sighted users in multi-operation screens may not know which task it belongs to either.

✅ Give the ProgressBar an aria-label or aria-labelledby reference, and render visible text near it that names the operation, for example a Field label plus a validation message with the current count.

### Suppressing the indeterminate animation by default

❌ Disabling the indeterminate motion for all users removes the only cue that work is still happening, making an unresponsive-looking bar indistinguishable from a stuck one.

✅ Keep the default animation for general audiences and only pass null to the indeterminateMotion slot in contexts where animation must be avoided, such as when the user prefers reduced motion or the bar sits in an area that must stay visually still.

## Accessibility

**Requirements**: ProgressBar is exposed to assistive technology as a progress indicator, so it must carry an accessible name describing the operation it tracks (aria-label, aria-labelledby, or clearly associated visible text). Because status colors are used, satisfy WCAG 1.4.1 by never encoding meaning in color alone — combine the color prop with a text message. Ensure the filled bar maintains at least 3:1 non-text contrast against the track and surrounding background per WCAG 1.4.11, which the default theme tokens provide; verify this again if you override colors. If the value updates asynchronously, the change in progress is a status update under WCAG 4.1.3 — consider announcing milestone updates (for example with AriaLiveAnnouncer) rather than announcing every frame. Finally, when a user has expressed a preference for reduced motion, the continuously animated indeterminate state should be avoided by disabling the animation.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus past the ProgressBar; the component is not focusable and does not participate in the tab order, so it receives no keyboard input of its own. |

**ARIA**: role=progressbar, aria-valuemin, aria-valuemax, aria-valuenow, aria-valuetext, aria-label, aria-labelledby

**Screen Reader**: The root element is announced as a progress bar. In the determinate state assistive technology reports the current value derived from value and max, so users hear how far along the operation is; in the indeterminate state no meaningful value is reported and the accessible name becomes the primary information, which is why labeling is essential. Because the component is not focusable, users do not tab to it — they encounter it while reading the surrounding content, so the label and any adjacent descriptive text must supply the full context. Rapid value changes do not automatically trigger announcements; if you need audible milestones you must surface them yourself through a live region.

## Styling

Style the component by targeting the root slot with className, which is the track behind the bar; width is driven by the container rather than the component, so set a width or max-width on the ProgressBar or its wrapper. The shape prop maps to corner radii — the rounded default aligns with tokens.borderRadiusMedium, while square removes the radius, so if you customize corners use radius tokens rather than hard-coded pixel values. The thickness prop swaps between the medium and large bar heights; treat it as the sizing switch and avoid overriding height manually, since the track and fill are sized together. Colors come from the color prop, and any manual override should reuse the same semantic tokens so light, dark, and high-contrast themes stay coherent: brand maps to the brand background token family, success to the green palette background family, warning to the orange palette background family, and error to the red palette background family, while the track uses a neutral background token. When laying out several bars, use tokens.spacingVerticalM spacing between them and keep them left-aligned and full-width within their column so partial fills read as progress rather than as decoration. If you need to animate or restyle the indeterminate fill, customize the bar and indeterminateMotion slots instead of fighting the default keyframes with global CSS.

## Performance

ProgressBar is cheap to render: the root track and the bar are simple elements, so the main cost is re-rendering the component's parent tree when value changes. Update value at a throttled cadence rather than on every tick of a high-frequency source, and hoist the progress state so that only the subtree containing the bar re-renders. The indeterminate state is driven by the indeterminateMotion slot, which runs a motion component rather than a JavaScript timer, so it does not consume main-thread work beyond compositing; passing null to that slot removes that animation entirely, which is useful for reduced-motion support and for screens that need to stay perfectly still. When rendering many bars at once, such as one per row in a list, prefer a single summary bar with counts unless per-item progress is genuinely actionable, since each animated indeterminate bar adds continuous visual and compositing work.

## Theming & Tokens

ProgressBar consumes theme tokens from the nearest FluentProvider, so it automatically follows light, dark, and high-contrast themes. The default brand color is drawn from the brand background token family, which means a custom brand ramp defined with the theme creation helpers changes the bar's color without any component-level styling. The success, warning, and error colors map to the instance's green, orange, and red palette background tokens, while the track behind the bar uses a neutral background token, so the contrast between fill and track is guaranteed by the theme rather than by hard-coded values. Corner radii come from radius tokens for the default rounded shape, and spacing around stacked bars should use spacing tokens to stay consistent with the rest of the themed layout. If you override colors yourself, do so with tokens from the same semantic families (brand, palette status, neutral background) instead of literal color values, otherwise dark and high-contrast themes will visibly break.

## Migration Notes

In the previous Fluent UI generation the equivalent component was a ProgressIndicator driven by a percentComplete number, with an arbitrary numeric bar height and no color or shape options. Migrating to ProgressBar means converting percentage-based values to the fractional model: value is a decimal between 0 and 1 unless you also pass max, so a former 50 percent becomes value 0.5, or value 50 with max 100. Indeterminacy is no longer expressed with a separate boolean flag — simply omit the value prop and the bar animates. Arbitrary bar heights are replaced by the constrained thickness options of medium and large, and new shape and color props let you match corner treatment and status coloring declaratively. The animation used in the indeterminate state is now a dedicated motion slot, so any custom loading animation from an older implementation should be reimplemented through that slot rather than through injected CSS keyframes.

## Edge Cases

- Omitting value produces the indeterminate state; if you intended a determinate bar at zero, pass value of 0 explicitly, because undefined and 0 render very differently.
- The default max is 1, so passing a whole number such as 5 without setting max produces a fully clamped bar rather than the half-full result you might expect from a 0-to-10 scale.
- Passing null to the indeterminateMotion slot removes the animation, which is the right move for reduced-motion preferences but leaves no visual cue that work is happening — compensate with text such as 'Loading, please wait'.
- Because value is rescaled by max, values outside the 0 to max range or a max of 0 lead to a meaningless fill; clamp or validate your data before passing it in.
- ProgressBar is not a form control, so wrapping it in a Field label does not automatically give it an accessible name; Field's label and validationMessage provide visible context, so add aria-label or aria-labelledby when the surrounding text is not sufficient.
- Rapidly changing validationMessage text next to a quickly updating bar is not announced automatically; use a live region such as AriaLiveAnnouncer for milestone messages rather than relying on continuous value changes.
- The indeterminate animation runs continuously, so placing several of them in a compact region creates competing motion; consolidate to one bar or make the extra bars determinate where possible.
- Custom slot content for the bar or indeterminateMotion changes the visual contract of the component, so retest contrast and size against the track if you replace either slot.

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
