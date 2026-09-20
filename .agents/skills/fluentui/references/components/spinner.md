# Spinner

> **Package**: `@fluentui/react-spinner` v9.8.3
> **Import**: `import { Spinner } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

Spinner is a feedback component that communicates an indeterminate, ongoing operation to users who must wait for content or a process to complete. It renders an animated ring built from a rotating tail (the spinnerTail slot) inside a stationary ring (the spinner slot), optionally accompanied by a text label and an accessible name. Because Spinner signals indeterminate progress rather than measurable progress, it keeps animating until it is unmounted, making mount/unmount the primary way to start and stop the loading state. The component supports two appearances (primary for light surfaces and inverted for dark or brand-colored surfaces), eight named sizes ranging from extra-tiny to huge, four label positions (above, below, before, after), and a delay in milliseconds that postpones visibility after mount so that very fast operations do not produce a distracting flash. Its root, spinner, spinnerTail, and label slots can be targeted individually through class names and style overrides, and any className or style passed directly to Spinner lands on the root slot. Spinner is non-interactive and non-focusable: it is a visual and assistive-technology status indicator rather than a control.

**When to use**: Use Spinner when the duration of a task is unknown or unbounded and users cannot proceed until it finishes: initial page or panel data fetch, submitting a form, saving a document, opening a heavy dialog, or waiting on a network call whose timing you cannot predict. Use it inline and close to the content that is loading whenever possible, so the indicator reads as belonging to that region rather than to the entire application. Choose ProgressBar instead when the percentage of completion is known or can be estimated, because a determinate bar is more informative than an endlessly rotating ring. Choose Skeleton (or SkeletonItem) instead when you know the shape of the content that is coming, since placeholder shapes reduce perceived layout shift and preserve spatial memory better than a spinner. Choose Badge or CounterBadge for counts and status annotations, MessageBar for errors and warnings, and plain Text for non-blocking status messages. Reserve a large or huge Spinner for a whole-region or whole-surface block, and use tiny or extra-tiny sizes for inline contexts such as a table cell or next to a button caption.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"primary" \| "inverted" \| undefined` | `'primary'` | No | The appearance of the Spinner. |
| `delay` | `number \| undefined` | `0` | No | Time in milliseconds after component mount before spinner is visible. |
| `labelPosition` | `"above" \| "below" \| "before" \| "after" \| undefined` | `'after'` | No | Where the label is positioned relative to the Spinner |
| `size` | `"extra-tiny" \| "tiny" \| "extra-small" \| "small" \| "medium" \| "large" \| "extra-large" \| "huge" \| undefined` | `'medium'` | No | The size of the spinner. |

### Prop Guidance

- **appearance**: Controls the color treatment of the ring so it remains legible on the surface behind it. Use primary on light, neutral surfaces and inverted on dark or brand-colored surfaces such as a colored header or hero band. The default is primary, which follows the brand stroke color. `inverted`
- **delay**: Time in milliseconds after mount before the spinner becomes visible, defaulting to 0 (immediate). Set a short delay for operations that often finish quickly so the indicator does not flash; leave it at 0 for long-running or clearly blocking operations where immediate feedback is expected. `300`
- **label**: Optional text rendered through the label slot and used to describe what is loading. Always provide it when the spinner is not otherwise named, and keep it short and specific. When no label is supplied, no label element is rendered and labelPosition has no visible effect. `Loading messages`
- **labelPosition**: Places the label relative to the ring: before or after for horizontal arrangements and above or below for vertical arrangements. The default is after. Use before when the spinner sits at the end of a row, and above or below when the spinner is centered in a tall container where horizontal space is limited. `below`
- **size**: Sets the diameter and the associated label typography, defaulting to medium. Use extra-tiny, tiny, or extra-small for inline contexts such as table cells, list rows, or alongside a button caption; small and medium for cards, form sections, and small panels; large, extra-large, and huge for larger regions or whole-surface loading states. `small`
- **className and style**: Applied to the root slot only, so they are best for outer spacing, alignment, and layout. To change ring color, thickness, or label typography, target the spinner, spinnerTail, and label slots instead. The spinnerTail slot must keep its rotation for the loading affordance to read correctly. `marginInlineEnd`

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

- Always supply a label (or otherwise give the spinner an accessible name) so that the loading state is understandable without seeing the animation.
- Set the delay prop to a small value such as 300 milliseconds when the operation is frequently fast, so a quick response does not flash a spinner on and off.
- Match the spinner size to the element it replaces: extra-tiny or tiny for inline text and table cells, small or medium for cards and form sections, large through huge for full regions or surfaces.
- Use the inverted appearance on dark and brand-colored surfaces so the ring and its label keep sufficient contrast against the background.
- Place the spinner inside or immediately adjacent to the region that is loading so the relationship between the indicator and the pending content is obvious.
- Combine the spinner with an aria-live region (or an AriaLiveAnnouncer) when the completion of the operation also needs to be announced, so users are told both that work started and that it ended.
- Prefer layout-stable wrappers for the spinner so that showing and hiding it does not shift surrounding content.
- Keep the label concise and task-oriented, describing what is happening, such as loading messages, saving, or checking for updates.

### Don'ts

- Do not render a Spinner with no label or other accessible name; an unlabeled animated ring conveys nothing to screen reader users.
- Do not use Spinner for determinate work where a percentage is known; use ProgressBar so users can gauge remaining time.
- Do not block the entire application with a full-screen Spinner when only one region is loading.
- Do not stack multiple spinners to indicate magnitude or progress; one indicator per busy region is enough, and multiples compete for attention.
- Do not use Spinner in place of Skeleton when the incoming content has a predictable shape, because placeholder structure preserves layout and reduces perceived wait.
- Do not style or animate the spinnerTail slot yourself; it is the part of the ring that already rotates, and overriding its transform or animation breaks the loading affordance.
- Do not use the inverted appearance on light surfaces or the primary appearance on dark surfaces, since the ring will lose contrast against the background.
- Do not leave a Spinner mounted after the operation completes, and do not use it as a decorative or permanent element.

## Anti-Patterns

### Unlabeled spinner

❌ A Spinner rendered without a label has no accessible name and communicates nothing to screen reader users; sighted users also lose the context of what is actually loading.

✅ Always pass a concise label describing the pending operation, or otherwise give the spinner region an accessible name and mark the surrounding container as busy.

### Spinner for determinate progress

❌ An endlessly rotating ring implies unknown duration, so using it for a process with measurable completion hides useful information and makes the wait feel longer than it is.

✅ Use ProgressBar when a completion percentage or ratio is known or can be estimated, and reserve Spinner for genuinely indeterminate work.

### Full-surface blocking spinner for a small region

❌ Covering an entire page or application with a Spinner when only one card, list, or panel is loading blocks unrelated content and misrepresents the scope of the wait.

✅ Scope the spinner to the region that is actually loading, and use the delay prop plus a stable wrapper so the small indicator appears without shifting layout.

### Multiple stacked spinners

❌ Rendering several spinners together, or nesting one inside another, creates visual noise and suggests progress where none is measurable, while adding unnecessary animation work.

✅ Show a single spinner per busy region, scaling the size up for larger surfaces instead of adding more instances.

### Custom animation on the rotating part

❌ Restyling or re-animating the spinnerTail slot, or replacing the rotation with a custom keyframe, breaks the expected loading affordance and can cause the ring to render incorrectly.

✅ Limit customization to colors, thickness, spacing, and typography using Griffel tokens, and leave the built-in rotation of the spinnerTail intact.

## Accessibility

**Requirements**: Spinner is purely a status indicator and exposes no interactive controls, so it does not need to be focusable and should not be added to the tab order. It must have an accessible name: pass a label or apply an accessible name to the spinner region so assistive technologies can describe the pending state. The spinner itself should not be the only signal of a loading state for screen reader users; the region that is busy should be marked as such (for example with aria-busy) and completion should be announced through a live region. Any text used as the label must meet WCAG contrast requirements against its background: in the default (primary) appearance, label text on light surfaces and, in the inverted appearance, label text on dark or brand-colored surfaces. Because the animation is continuous, respect user motion preferences by not adding further motion on top of the built-in rotation where reduced-motion preferences apply. When the spinner indicates that a region is temporarily unavailable, ensure that keyboard focus is never trapped inside content that has been replaced by the loading state.

**ARIA**: aria-label (or an equivalent accessible name, typically derived from the label text, on the spinner or the busy region), aria-busy on the container whose content is loading, aria-live and aria-atomic on the region that announces loading start or completion, aria-describedby when additional explanatory text should be announced alongside the spinner

**Screen Reader**: Spinner is not focusable and never appears in the tab order, so screen readers do not land on the animation itself. With a label present, the spinner's accessible name is read as descriptive text when the user explores the busy region; without a label, the element conveys no meaningful information. Because the rotation is a visual affordance, screen reader users perceive loading only through the accessible name, through an aria-busy container, and through live-region announcements, which is why pairing the spinner with a labeled busy region is essential. When the spinner is removed on completion, the live region or updated content should announce that loading finished so users are not left waiting for an announcement that never arrives.

## Styling

Style Spinner with makeStyles and Griffel tokens, targeting the slots you need through slot class names: root for the outer layout box, spinner for the ring track, spinnerTail for the rotating portion, and label for the text. Any className or style passed directly to Spinner is applied to the root slot only, so ring or label customization requires the corresponding slot props. For the ring, common choices are tokens.colorBrandStroke1 for the rotating tail on light surfaces and tokens.colorNeutralStroke1 or tokens.colorNeutralStroke2 for the track; use tokens.strokeWidthThick when you need to adjust ring thickness. Label typography follows the size scale, so tune it with tokens.fontSizeBase200, tokens.fontSizeBase300, or tokens.fontSizeBase400 and the matching tokens.lineHeightBase300 style line-height tokens, and use tokens.colorNeutralForeground1 or tokens.colorNeutralForeground3 for the label on light surfaces. Spacing between the ring and the label is best expressed with tokens.spacingHorizontalS or tokens.spacingVerticalXS depending on whether the label position is before/after or above/below. If you customize the rotation timing, use the motion tokens such as tokens.durationUltraSlow with tokens.curveLinear rather than hard-coded values, so the animation stays consistent with the rest of the design system and with theme-level motion settings. Keep overrides additive: change colors, thickness, and spacing, but avoid replacing the rotation animation on spinnerTail.

## Performance

Spinner is a lightweight, CSS-animation-driven component: the rotation is applied to the spinnerTail slot, so it runs on the compositor without JavaScript per frame. That said, each mounted instance carries its own animation and DOM subtree, so rendering hundreds of spinners at once (for example, one per row in a very large table) costs more than rendering a handful of larger ones. Use the delay prop to avoid a show/hide flash when responses are frequently fast, which also avoids a pointless style recalculation for operations that complete almost immediately. Because the spinner is mounted and unmounted rather than toggled with a hidden state, prefer conditional rendering and keep the surrounding tree stable so that adding and removing the indicator does not invalidate expensive sibling work. Reserve space for the spinner (a fixed-height or fixed-width container) to prevent layout shift when it appears or disappears, and avoid re-mounting the spinner on every parent render by keeping its render path free of unnecessary state changes.

## Theming & Tokens

Spinner color and typography come from theme tokens exposed through FluentProvider, so it adapts automatically to brand and theme changes. The primary appearance draws on brand tokens such as tokens.colorBrandStroke1 for the rotating tail and neutral stroke tokens such as tokens.colorNeutralStroke1 for the track, while the inverted appearance uses inverted neutral tokens such as tokens.colorNeutralForegroundInverted and tokens.colorNeutralBackgroundInverted so the ring stays visible on dark and brand-filled surfaces. Label text uses neutral foreground tokens, typically tokens.colorNeutralForeground1 or tokens.colorNeutralForeground3 for primary and tokens.colorNeutralForegroundInverted for inverted. Size maps to typography tokens, from tokens.fontSizeBase200 at the smallest sizes up through the larger fontSizeBase tokens at huge, so label text scales with the theme's type ramp. Spacing between the ring and the label comes from tokens.spacingHorizontalXS through tokens.spacingHorizontalM and tokens.spacingVerticalXS through tokens.spacingVerticalM, and any custom rotation timing should reference tokens.durationUltraSlow with tokens.curveLinear so motion stays aligned with the theme.

## Migration Notes

In v9 the Spinner size is a named string union (extra-tiny, tiny, extra-small, small, medium, large, extra-large, huge) rather than a numeric size, so older numeric size values must be mapped to the nearest named size, with medium as the default. The appearance prop is limited to primary and inverted, with primary as the default for light surfaces. The delay prop is expressed in milliseconds after mount and defaults to 0, meaning the spinner is visible immediately unless a delay is provided. The label and labelPosition props carry over conceptually, and labelPosition defaults to after. Legacy inline and numeric-size styling approaches do not apply in v9; instead, customize through the root, spinner, spinnerTail, and label slots with makeStyles and Griffel tokens.

## Edge Cases

- The label slot is optional: when no label is provided, no label element renders and labelPosition has no visible effect, which can make a spinner look misaligned if the surrounding layout was designed around a label.
- With the default delay of 0 the spinner is visible immediately on mount, so a fast operation can produce a visible flash; a small delay avoids this but means truly long operations show nothing for that window.
- The inverted appearance is intended for dark or brand-colored backgrounds; on a light surface the ring and label lose contrast, and the primary appearance has the mirror problem on dark surfaces.
- At extra-tiny and tiny sizes the ring is very small, so a label placed before or after may dominate the visual footprint and change the row height; consider relying on adjacent descriptive text in those inline contexts.
- className and style always land on the root slot, so attempts to recolor or resize the ring through the top-level className will not work; the spinner, spinnerTail, and label slots must be targeted instead.
- Because completion is only communicated by unmounting the spinner, an interface that removes the spinner without also announcing the finished state can leave screen reader users unaware that loading ended.
- Spinner is not focusable and does not manage focus, so if the loading state replaces focusable content, focus must be moved or restored by the surrounding application logic.

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
