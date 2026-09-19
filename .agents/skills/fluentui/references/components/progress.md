# Progress

> **Package**: `@fluentui/react-progress` v9.5.2
> **Import**: `import { Progress } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

Progress is the Fluent UI React v9 feedback component that communicates how much of a long-running operation has completed, such as a file download, an upload, an import, or a data sync. The component is surfaced in code as ProgressBar and imported from '@fluentui/react-components'; this documentation page covers the Progress family. It renders a horizontal track with a filled bar whose length is derived from value relative to max, giving users an immediate, at-a-glance sense of remaining work. When value is omitted the bar becomes indeterminate and animates continuously, which is the correct treatment when the total amount of work cannot be measured or predicted. A deliberately small prop surface controls presentation: color selects the default brand accent or a success, warning, or error validation state; shape chooses rounded or square bar corners; and thickness chooses a medium or large bar height. The indeterminate animation itself can be replaced with a custom motion component, so a product can match its own motion language without rebuilding the control. Progress renders no text of its own, so it should always be paired with a Field label and validation message, or with explicit ARIA labeling plus nearby visible copy, to explain what is progressing.

**When to use**: Use Progress when an operation takes long enough that users need feedback about its state and, ideally, how far along it is. Use the determinate form (value plus max) whenever real progress can be measured or counted, for example '12 of 42 files downloaded'. Use the indeterminate form (no value) when work is happening but the total is unknown, such as waiting on a network round trip or a server-side job whose duration is not predictable. Prefer Progress over a Spinner when the work is inline, non-blocking, and worth measuring; prefer Skeleton or Spinner when the real question is 'something is loading' rather than 'how much is left'. Prefer MessageBar or Toast when the important information is the outcome of an operation rather than its progress. Wrap Progress in Field when you want a consistent label, hint, and validation message, since the bar itself supplies neither a label nor a description. Reach for the color prop only when the bar genuinely reflects a success, warning, or error condition, and reach for indeterminateMotion only when the default indeterminate animation does not match your product's motion language.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `color` | `'brand' \| 'success' \| 'warning' \| 'error'` | — | No | — |
| `max` | `number` | — | No | — |
| `shape` | `'rounded' \| 'square'` | — | No | — |
| `thickness` | `'medium' \| 'large'` | — | No | — |
| `value` | `number` | — | No | — |

### Prop Guidance

- **value**: The current amount of progress, interpreted relative to max. Supply a number for determinate progress and omit the prop entirely for the indeterminate animation. Update it as real work completes; values shown in the stories are 0.5, 0.7, 0.75, 0.95, and 1 on the default 0-to-1 scale, and counted values up to max in the Max story. `0.75`
- **max**: The upper bound of the scale that value is measured against. Use it when progress is naturally counted rather than a fraction, such as files, records, or bytes, so the bar reads against the real total. When it is not supplied the bar behaves as a 0-to-1 fraction as shown in the Default and Indeterminate stories. `42`
- **color**: Selects the fill color, which doubles as a validation signal: brand is the default for ordinary in-progress work, success indicates the operation finished well, warning indicates the result needs attention, and error indicates failure. Use it only when the state is real and also convey that state in text, as the Color story does by pairing each bar with a Field validationMessage. `success`
- **shape**: Controls the corner treatment of the bar. rounded is the default and fits most modern surfaces; square is appropriate when the bar sits inside a squared-off container or a table cell where rounded corners would look out of place. Combine it with thickness for the visual weight you need. `rounded`
- **thickness**: Controls the height of the bar. medium is the default for dense layouts and inline indicators; large gives the bar more presence for page-level or empty-state usage. Match it to the surrounding density rather than switching arbitrarily between the two. `large`
- **indeterminateMotion**: Replaces the default indeterminate animation with your own motion component, created with the Motion APIs such as createMotionComponent, as shown in the MotionCustom story. Use it only when the shipped animation conflicts with your product's motion language, and make sure your custom motion also honors reduced-motion preferences. It has no effect on determinate bars that supply a value. `a custom motion component from createMotionComponent`

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

- Always give the bar an accessible name: wrap it in Field with a label and/or validationMessage, or set aria-label or aria-labelledby directly on the ProgressBar.
- Omit value entirely to get the indeterminate animation when the amount of work cannot be measured; do not simulate progress with fake numbers.
- Express measured progress with value and max together, for example max of 42 with value incrementing from 0 to 42 while files download.
- Use the color prop to mirror a real state: success when an operation has genuinely completed, warning when the result needs attention, error when the operation failed.
- Combine the bar with visible text that names the operation and, for determinate usage, the numeric progress, so the information is available to everyone and not only to the bar's geometry.
- Choose thickness and shape deliberately for placement: a larger thickness for a prominent page-level indicator, rounded corners when the surrounding surfaces are rounded.
- Keep updates to value inside the 0-to-max range and throttle them to a readable cadence rather than on every low-level tick.
- Reserve indeterminate usage for operations that are actively running, and switch to a determinate bar or a completion state once measurement is possible.

### Don'ts

- Do not render a bar with no accessible name; a bare bar with no label, aria-label, or aria-labelledby is announced without any indication of what is progressing.
- Do not use the error, warning, or success colors as decoration or as a way to add visual interest; they carry meaning about the state of the operation.
- Do not use determinate progress for unknown-duration work, and do not jump the value straight to completion just to make the bar disappear faster.
- Do not update value at an extremely high frequency or drive it from a per-frame animation loop; it causes unnecessary re-renders without improving comprehension.
- Do not rely on color alone to communicate an error or success state, since that fails users with color vision deficiencies; add text through Field or adjacent copy.
- Do not use Progress for very short operations that finish before the user can perceive them, or for blocking waits where a Spinner communicates 'please wait' more honestly.
- Do not place the bar so far from its descriptive text that the association between the label and the bar is unclear.
- Do not assume a 0 percent bar is indistinguishable from indeterminate; a determinate bar at zero still reads as a measurable, empty state and must be labeled.

## Anti-Patterns

### Unlabeled progress bar

❌ The bar renders no text, so a bar without a Field label, aria-label, or aria-labelledby is announced as an unnamed progress bar and users cannot tell what is progressing or whether it is worth waiting for.

✅ Wrap the bar in Field with a label and, when useful, a validationMessage, or set aria-label or aria-labelledby directly on the ProgressBar. Pair it with visible text that names the operation, as every story on this page does.

### Fake determinate progress

❌ Driving value with a timer that always creeps toward completion makes the bar lie about the state of the operation, and users lose trust when the bar reaches the end while work continues or stalls.

✅ Omit value and let the bar animate indeterminately while the duration is unknown, then switch to a determinate bar with a real value and max once progress can actually be measured.

### Decorative use of validation colors

❌ Applying error, warning, or success colors for visual variety or brand expression overloads a meaningful signal, so red bars no longer reliably mean something went wrong and users cannot interpret the state.

✅ Leave the fill at the default brand color for ordinary work and reserve success, warning, and error for genuine outcomes, always mirroring that meaning in text through Field or adjacent copy so the state is not conveyed by color alone.

### High-frequency value churn

❌ Updating value on every low-level event or animation frame re-renders the bar constantly, wastes work in dense pages, and can make the bar visually noisy without telling the user anything new.

✅ Throttle updates to a readable cadence, derive the value from meaningful checkpoints, and let the motion system handle visual smoothing instead of feeding it a new number on every tick.

### Progress where a Spinner or Skeleton belongs

❌ Using a progress bar for very short or unmeasurable waits, or as a placeholder for content that is still being laid out, communicates a measure that does not exist and draws attention to a wait the user would not otherwise notice.

✅ Use indeterminate progress only for genuinely running operations of noticeable duration, use a Spinner for short blocking waits, and use Skeleton for content placeholders, reserving determinate Progress for work whose completion can be counted.

## Accessibility

**Requirements**: Progress is a status indicator, not a control, and it must meet the usual requirements for non-text content: an accessible name (WCAG 4.1.2), a programmatically determinable value for determinate usage (WCAG 4.1.2), and no reliance on color alone to convey state (WCAG 1.4.1). If a downstream consumer treats the bar as a live status update, the update should also be perceivable as a status message (WCAG 4.1.3). Because the indeterminate animation runs continuously until the operation completes, it should respect reduced-motion preferences so users who opt out of animation are not exposed to perpetual motion (WCAG 2.3.3). Contrast of the fill against the track should remain sufficient in every theme, which is why the built-in brand, success, warning, and error colors are preferable to ad hoc custom colors.

| Key | Action |
| --- | --- |
| `Tab / Shift+Tab` | Focus passes over the progress bar entirely; the element is not focusable and defines no tab stop, so it never interrupts keyboard navigation. |
| `Enter / Space` | No effect. Progress is non-interactive and exposes no activation behavior. |
| `Arrow keys` | No effect. The progress bar is not adjustable by the user; value is controlled by the application only. |
| `Escape` | No effect. Dismissing or cancelling ongoing work is the responsibility of the surrounding UI, such as a button next to the bar, not of Progress itself. |

**ARIA**: role=progressbar (the semantics exposed by the rendered bar), aria-valuemin, aria-valuemax, aria-valuenow (present for determinate usage, absent while indeterminate), aria-valuetext (for a human-readable value such as a percentage or file count), aria-label, aria-labelledby, aria-describedby (used by Field to associate hint and validation text)

**Screen Reader**: Screen readers announce the bar as a progress bar together with its accessible name and, in determinate mode, its current value against the minimum and maximum, typically as a percentage. While indeterminate, no numeric value is exposed, so assistive technology reports progress without a position, which matches the meaning of 'work is happening but the total is unknown'. Because the element is not focusable, users only encounter it through reading order or virtual cursor navigation, so the name must be descriptive enough to stand alone. Value changes are not announced as alerts; if a milestone must be conveyed, expose that text in your own content rather than expecting the bar geometry to communicate it. When a bar is wrapped in Field, the Field label and validation message are associated through the generated id and aria-describedby, so screen reader users receive the same context that sighted users read next to the bar.

## Styling

The component is styled with Griffel, so the supported customization path is a makeStyles class passed through className, exactly as the Shape and Thickness stories pass a container class to control width and spacing. Use your own class to set layout concerns such as width, max-width, and the vertical rhythm between stacked bars (tokens.spacingVerticalS and tokens.spacingHorizontalM work well for that rhythm). The filled bar defaults to tokens.colorBrandBackground, and the color prop swaps it for the palette tokens that back each validation state, so prefer color over hand-painted fills to keep contrast correct. The unfilled track is theme-driven; when the bar sits on a tinted or inverted surface, restyle the track with a neutral token such as tokens.colorNeutralBackground2 or tokens.colorNeutralBackground6 through your own class rather than hard-coded colors. shape maps to corner radii — rounded reads as tokens.borderRadiusCircular-style rounding and square reads as a minimal radius such as tokens.borderRadiusSmall, while thickness controls the bar height, so use a large thickness for page-level prominence and the medium thickness for dense layouts. If you animate your own value transitions, keep durations close to tokens.durationNormal with tokens.curveEasyEase so the bar feels consistent with the rest of Fluent's motion, and if the default indeterminate sweep does not fit your product, replace it with a custom motion component rather than hiding the bar and building your own. Because Field renders the label, hint, and validation text around the bar, let Field handle that typography (tokens.colorNeutralForeground1, tokens.fontSizeBase200) instead of duplicating it in your styles.

## Performance

Progress is a lightweight, purely presentational element, so its cost is dominated by how often its parent re-renders it. Each change to value re-renders the bar, so batch or throttle high-frequency progress events instead of lifting every tick into component state. Avoid remounting the bar unnecessarily, for example by changing its key when a new operation starts, because a remount restarts the indeterminate animation and discards the visual continuity users rely on. The indeterminate animation is delivered by the motion system rather than by your own JavaScript loop, and a custom indeterminateMotion component adds whatever cost that motion component carries, so keep custom animations transform-based and short-lived. When many bars appear together, keep the container layout simple and let the bar keep its intrinsic sizing through a single makeStyles class rather than computing sizes per render. Because the component owns no data fetching, any polling that feeds value should be owned by the caller and should stop when the operation finishes or the view unmounts.

## Theming & Tokens

Progress consumes theme tokens for every visible surface, so it re-colors automatically when the theme is switched through Provider or when a custom theme overrides the tokens. The default fill is tokens.colorBrandBackground; the color prop swaps in the validation palette, with error, warning, and success resolving to the red, orange, and green palette background tokens used across Fluent (the same family that backs tokens.colorPaletteRedBackground3, tokens.colorPaletteDarkOrangeBackground3, and tokens.colorPaletteGreenBackground3). The unfilled track is drawn from neutral background tokens, so it adapts to light, dark, and high-contrast themes without extra work, and any custom track override should also use neutral tokens such as tokens.colorNeutralBackground2 or tokens.colorNeutralBackground6 so it keeps adapting. Corner rounding follows the theme's radius scale (tokens.borderRadiusMedium, tokens.borderRadiusSmall, and circular rounding for fully rounded ends), and animation timing comes from motion tokens such as tokens.durationNormal and tokens.curveEasyEase, which is why a custom indeterminateMotion should read its timing from the same tokens. Field-rendered label, hint, and validation text use tokens.colorNeutralForeground1, tokens.colorNeutralForeground3, and the semantic status foreground tokens, so the surrounding text stays consistent with the bar in every theme.

## Migration Notes

In code the control is exported as ProgressBar and imported from '@fluentui/react-components'; the documentation page is titled Progress, and the examples on this page all use the ProgressBar import, so use ProgressBar in your own code. Compared with the older Fluent UI React v8 ProgressIndicator, the v9 surface is much smaller: the percentComplete prop (0 to 100) is replaced by value relative to max, with the default scale being 0 to 1 as shown in the Default story, and a counted range expressed through max as shown in the Max story. The v8 label and description props no longer exist on the bar itself; compose Field around the bar, or supply aria-label and adjacent text, to describe what is progressing. The v8 styles prop is gone in favor of Griffel makeStyles classes passed through className, so any custom track or fill overrides must be rewritten as Griffel rules that reference theme tokens. The v8 barHeight customization is replaced by the thickness prop with its medium and large options, and corner treatment is now the shape prop. Indeterminate behavior is expressed purely by leaving value undefined rather than by using a separate prop or hidden progress state, and the indeterminate animation is now provided by the motion system, with indeterminateMotion available when a custom animation is required.

## Edge Cases

- Omitting value is what makes the bar indeterminate, as the Indeterminate story shows; passing a number such as 0 instead produces a determinate empty bar, which reads very differently to users and must still be labeled.
- Values are interpreted against max, so the same value of 1 is a complete bar on the default 0-to-1 scale but a barely started bar when max is 42 as in the Max story. Clamp or validate values in your own code, since a value above max or below zero is a caller error, not something the component can interpret for you.
- The Max story resets its counter to zero once it reaches the maximum, which is a deliberate loop; in real usage a bar that silently jumps back to empty after completion looks like a failure, so transition to a success state or remove the bar instead of wrapping.
- Wrapping a bar in Field with a validationMessage but no validationState results in an error-styled message, as the first example in the Color story demonstrates; set validationState explicitly when the message is informational rather than an error.
- Indeterminate bars animate indefinitely, so their motion should be suppressed or softened for users who prefer reduced motion; custom animations provided through indeterminateMotion must handle that preference themselves.
- A determinate bar at exactly the maximum value is visually full but carries no confirmation of success on its own, so pair completion with a success color, a message, or other completion feedback rather than assuming full width equals done.
- The page is titled Progress while the exported component used in every story is ProgressBar, so code should import ProgressBar from '@fluentui/react-components' rather than assuming a Progress export name.

## See Also

- - [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
