# Spinner

> **Package**: `@fluentui/react-spinner` v9.8.3
> **Import**: `import { Spinner } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

Spinner is a feedback component that indicates an indeterminate, ongoing operation whose duration cannot be predicted. It renders a rotating ring built from a static track plus a rotating tail segment, with an optional text label positioned above, below, before, or after the ring. The component is purely presentational: it does not perform work, report progress percentage, or manage the loading state of the surrounding UI. It ships in two appearances (primary for standard surfaces and inverted for dark or brand-colored surfaces) and eight sizes ranging from extra-tiny to huge, so a single component can serve inline button-level loading as well as full-page loading overlays. The ring and the label are exposed as slots (spinner, spinnerTail, label) on top of the root slot, which means layout and theming can be customized through Griffel styles while the animation is preserved.

**When to use**: Use Spinner when a task is in progress and there is no measurable completion percentage to show. Reach for the determinate Progress component instead when a percentage or known step count is available, because determinate feedback is more informative and less anxiety-inducing than a looping animation. Use Skeleton when you are loading content whose final layout is already known, since a skeleton placeholder prevents layout shift and communicates shape. Use Spinner for short-to-medium operations such as submitting a form, saving, refreshing a list, or loading a detail pane, and place it as close as possible to the region that is loading so the relationship is obvious. For page-level blocking operations, render a large Spinner centered in the affected region rather than leaving the user with a blank screen; for inline operations inside a button or field, use a small or extra-small spinner with no label or with the label hidden visually but present for assistive technology.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"primary" \| "inverted" \| undefined` | `'primary'` | No | The appearance of the Spinner. |
| `delay` | `number \| undefined` | `0` | No | Time in milliseconds after component mount before spinner is visible. |
| `labelPosition` | `"above" \| "below" \| "before" \| "after" \| undefined` | `'after'` | No | Where the label is positioned relative to the Spinner |
| `size` | `"extra-tiny" \| "tiny" \| "extra-small" \| "small" \| "medium" \| "large" \| "extra-large" \| "huge" \| undefined` | `'medium'` | No | The size of the spinner. |

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `label` | — | No | An optional label for the Spinner. |
| `root` | — | Yes | The root of the Spinner. The root slot receives the `className` and `style` specified directly on the `<Spinner>`. |
| `spinner` | — | No | The animated spinning ring. |
| `spinnerTail` | — | Yes | The part of the spinner that rotates. |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Spinner } from '@fluentui/react-components';
import type { SpinnerProps } from '@fluentui/react-components';

export const Default = (props: Partial<SpinnerProps>): JSXElement => <Spinner {...props} />;
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, Spinner, tokens } from '@fluentui/react-components';

export const Appearance = (): JSXElement => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Spinner appearance="primary" label="Primary Spinner" />

      <div className={styles.invertedWrapper}>
        <Spinner appearance="inverted" label="Inverted Spinner" />
      </div>
    </div>
  );
};
```

### Labels

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, Spinner } from '@fluentui/react-components';

export const Labels = (): JSXElement => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <Spinner labelPosition="before" label="Label Position Before..." />

      <Spinner labelPosition="after" label="Label Position After..." />

      <Spinner labelPosition="above" label="Label Position Above..." />

      <Spinner labelPosition="below" label="Label Position Below..." />
    </div>
  );
};
```

## Best Practices

### Do's

- Always provide meaningful label text through the label slot or label prop so the loading state has a human-readable description, even when the label is visually hidden.
- Mark the region that is loading with aria-busy on its container and let the Spinner itself remain a non-interactive decoration, so assistive technology understands which subtree is pending.
- Set a small delay (for example a few hundred milliseconds) on spinners triggered by fast operations so quick requests do not produce a distracting flash of loading UI.
- Match size to context: extra-tiny and tiny inside buttons or dense table cells, small and medium for cards and panels, large and above for page or region-level loading.
- Use appearance inverted only when the spinner sits on a dark, brand-colored, or otherwise inverted surface where the primary appearance would lose contrast.
- Remove or unmount the Spinner as soon as the operation completes and render the loaded result in the same slot so the user receives an unambiguous completion signal.
- Reserve space for the spinner or let it render in a fixed-height container so surrounding content does not jump when loading starts and ends.

### Don'ts

- Do not rely on the spinner alone to convey an error or completion; pair it with a MessageBar or other status feedback so failures are not silently hidden behind a disappearing spinner.
- Do not treat the Spinner as an interactive element: never attach click handlers, tooltips with actions, or focus behavior to it, since it has no enabled, pressed, or focusable states.
- Do not place an inverted spinner on a light background, or a primary spinner on a dark brand background, as the ring contrast becomes insufficient.
- Do not render a spinner per row or per cell in a large table or list; a single spinner for the collection is far cheaper to animate and less visually noisy.
- Do not override the spinner or spinnerTail slots with static elements that drop the rotation, because the rotating tail is what communicates ongoing activity.
- Do not use huge or extra-large spinners in inline or dense layouts where they will push surrounding content out of alignment.
- Do not show a spinner for operations that complete essentially instantly, and do not leave a spinner running while the underlying request has already failed.
- Do not use the Spinner when a determinate Progress indicator or a Skeleton placeholder would communicate the state more precisely.

## Accessibility

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
