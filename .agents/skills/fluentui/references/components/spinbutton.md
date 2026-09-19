# Spinbutton

> **Package**: `@fluentui/react-spinbutton` v9.6.3
> **Import**: `import { Spinbutton } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Spinbutton is a form control that lets users enter and adjust a number, either by typing into a text input or by using the increment and decrement buttons rendered adjacent to the input. It is exported from '@fluentui/react-components' and supports both uncontrolled usage through defaultValue and fully controlled usage through value combined with onChange. The onChange callback receives a data object (SpinButtonOnChangeData) that carries two distinct pieces of information: data.value, the parsed numeric value produced by stepping, and data.displayValue, the raw string the user typed, which is why handlers commonly branch on value first and fall back to parsing displayValue. Spinbutton offers four visual appearances (outline, underline, filled-darker, filled-lighter), two sizes (small and medium), configurable stepping through step and stepPage, value bounding through min and max, decimal handling through precision, and formatted text through the displayValue prop, which lets you show currency or locale-formatted strings while still storing a number. The control also supports disabled and readOnly states, where readOnly keeps the component focusable and readable by assistive technologies while blocking input, unlike disabled which blocks all interaction. Note that documentation stories import the component and its types as SpinButton, SpinButtonProps, SpinButtonChangeEvent, and SpinButtonOnChangeData.

**When to use**: Use Spinbutton whenever a user needs to pick or fine-tune a numeric value with discrete, predictable increments — quantities, percentages, pixel sizes, page numbers, timeouts, or monetary amounts. It is preferable to a plain Input when the value is numeric and users benefit from arrow-key or button-driven adjustment, and preferable to a Slider when exact values matter more than quick relative positioning, or when the valid range is very large or unbounded. Choose it over a Select when the value space is effectively continuous or too large to enumerate. For formatted values such as currency, use Spinbutton with the displayValue prop rather than a plain text input so you retain numeric semantics, stepping, and bounds. Prefer readOnly Spinbutton over disabled when the number must remain focusable, selectable, and announced to assistive technology.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `'outline' \| 'underline' \| 'filled-darker' \| 'filled-lighter'` | — | No | — |
| `defaultValue` | `number \| null` | — | No | — |
| `displayValue` | `string` | — | No | — |
| `displayValue` | `string` | — | No | — |
| `max` | `number` | — | No | — |
| `min` | `number` | — | No | — |
| `onChange` | `(event: SpinButtonChangeEvent, data: SpinButtonOnChangeData) => void` | — | No | — |
| `precision` | `number` | — | No | — |
| `size` | `'small' \| 'medium'` | — | No | — |
| `step` | `number` | — | No | — |
| `stepPage` | `number` | — | No | — |
| `value` | `number \| null` | — | No | — |
| `value` | `number \| null` | — | No | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, tokens, useId, Label, SpinButton } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  const layoutStyles = useLayoutStyles();
  const id = useId();

  return (
    <div className={layoutStyles.base}>
      <Label htmlFor={id}>Default SpinButton</Label>
      <SpinButton defaultValue={10} min={0} max={20} id={id} />
    </div>
  );
};
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, mergeClasses, tokens, useId, Label, SpinButton } from '@fluentui/react-components';

export const Appearance = (): JSXElement => {
  const styles = useStyles();

  const outlineId = useId('outline-id');
  const underlineId = useId('underline-id');
  const filledLighterId = useId('filledLighter-id');
  const filledDarkerId = useId('filledDarker-id');

  return (
    <div className={styles.base}>
      <div className={styles.field}>
        <Label htmlFor={outlineId}>Outline (default)</Label>
        <SpinButton id={outlineId} />
      </div>

      <div className={styles.field}>
        <Label htmlFor={underlineId}>Underline</Label>
        <SpinButton appearance="underline" id={underlineId} />
      </div>

      <div className={mergeClasses(styles.field, styles.filledLighter)}>
        <Label htmlFor={filledLighterId}>Filled Lighter</Label>
        <SpinButton appearance="filled-lighter" id={filledLighterId} />
      </div>

      <div className={mergeClasses(styles.field, styles.filledDarker)}>
        <Label htmlFor={filledDarkerId}>Filled Darker</Label>
        <SpinButton appearance="filled-darker" id={filledDarkerId} />
      </div>
    </div>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story:
        `SpinButton can have different appearances.\n` +
        `The colors adjacent to the input should have a sufficient contrast. Particularly, the color of input with
      filled darker and lighter styles needs to provide greater than 3 to 1 contrast ratio against the immediate
      surrounding color to pass accessibility requirements.`,
    },
  },
};
```

### Bounds

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, tokens, useId, Label, SpinButton } from '@fluentui/react-components';

export const Bounds = (): JSXElement => {
  const layoutStyles = useLayoutStyles();
  const id = useId();

  return (
    <div className={layoutStyles.base}>
      <Label htmlFor={id}>Bounded SpinButton</Label>
      <SpinButton defaultValue={10} min={0} max={20} id={id} />
      <p>min: 0, max: 20</p>
    </div>
  );
};

Bounds.parameters = {
  docs: {
    description: {
      story: `SpinButton can be bounded with the \`min\` and \`max\` props.
      Using the spin buttons or hotkeys will clamp values in the range of [min, max].
      Users may type a value outside the range into the text input and it will not be clamped
      by the control. Pressing the "home" key will set the value to \`min\` and pressing the "end"
      key will set the value to \`max\` when the props are set.`,
    },
  },
};
```

## Best Practices

### Do's

- Always associate a visible Label with the control using htmlFor and an id generated by useId, as shown in every Spinbutton story, so the input has an accessible name.
- Choose uncontrolled with defaultValue for simple cases, and switch to controlled with value plus onChange only when the value must drive other parts of your UI.
- Wrap your onChange handler in React.useCallback when it updates state, as the Controlled story does, to keep the handler identity stable.
- Set both min and max so the spin buttons and hotkeys clamp the value into a known range and so the Home and End keys have defined targets.
- Handle data.value and data.displayValue separately in onChange: apply value directly, and parse displayValue with parseFloat or a custom parser when the user types.
- Use the displayValue prop together with a formatter and parser pair when presenting formatted text such as currency, keeping the underlying model numeric.
- Set stepPage to a larger value than step when you want Page Up and Page Down to move in bulk while the arrows move in fine increments.
- Use readOnly instead of disabled when the number should stay focusable, copyable, and readable by assistive technologies.
- Generate unique ids with useId rather than hard-coding them, especially when several Spinbuttons render in the same form.

### Don'ts

- Do not pass value without an onChange handler — the display will not update as the user interacts with the spin buttons.
- Do not assume that text typed into the input is clamped to min and max; only the spin buttons and hotkeys clamp, so validate typed input yourself if bounds are strict.
- Do not use displayValue without branching on data.displayValue in onChange, or typed edits will be lost because the formatted string never round-trips back into your state.
- Do not use disabled when the intent is merely to prevent editing; disabled removes focusability and readability, whereas readOnly preserves them.
- Do not place filled-lighter or filled-darker appearances on backgrounds with insufficient contrast; the surrounding color must meet the 3 to 1 contrast ratio described in the Appearance story.
- Do not rely on Home and End clamping unless you actually set min and max, since those keys only jump to the configured bounds.
- Do not set step to zero or a negative number, or the arrow buttons and hotkeys will produce no usable movement.
- Do not silently swallow NaN when parsing displayValue; the DisplayValue story shows surfacing an explicit special state such as a null value instead.
- Do not confuse precision with display formatting — precision governs decimal rounding of the numeric value, while displayValue governs what text the user sees.

## Accessibility

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
