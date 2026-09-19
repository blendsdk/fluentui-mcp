# Slider

> **Package**: `@fluentui/react-slider` v9.6.3
> **Import**: `import { Slider } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Slider is a form input that lets users select a single numeric value by dragging a thumb along a rail or by using the keyboard. It renders a root element containing a rail (the visual track showing the selectable min-to-max range), a draggable thumb, and a hidden native range input that carries the form semantics. The value is bounded by min and max, can be constrained to discrete increments with step, and can be laid out horizontally or vertically. Slider supports both uncontrolled usage through defaultValue and fully controlled usage through value plus onChange, and it ships in small and medium sizes.

**When to use**: Use Slider when the precise numeric value matters less than the relative position within a range and when adjusting should feel immediate and continuous — volume, brightness, zoom level, opacity, or a weight in a range. It is a good fit for settings panels and media controls where users explore values interactively. Prefer Spinbutton or Input when users must enter an exact number, when the range has no meaningful intermediate values, or when the value must be typed precisely. Prefer Select or Radio when there are only a handful of discrete named options, Switch for binary on/off states, and Rating when the scale is a subjective star-style judgement. Because Slider always needs a visible label to be understandable, it is best used in a labeled form row rather than as a standalone floating control.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `defaultValue` | `number \| undefined` | — | No | The starting value for an uncontrolled Slider. Mutually exclusive with `value` prop. |
| `disabled` | `boolean \| undefined` | ``false` (renders enabled)` | No | Whether to render the Slider as disabled. |
| `max` | `number \| undefined` | `100` | No | The max value of the Slider. |
| `min` | `number \| undefined` | `0` | No | The min value of the Slider. |
| `onChange` | `((ev: React.ChangeEvent<HTMLInputElement>, data: SliderOnChangeData) => void) \| undefined` | — | No | Triggers a callback when the value has been changed. This will be called on every individual step. |
| `size` | `"small" \| "medium" \| undefined` | `'medium'` | No | The size of the Slider. |
| `step` | `number \| undefined` | `1` | No | The number of steps that the Slider's `value` will increment upon change. When provided, the Slider will snap to the closest available value. This must be a positive value. |
| `value` | `number \| undefined` | — | No | The current value of the controlled Slider. Mutually exclusive with `defaultValue` prop. |
| `vertical` | `boolean \| undefined` | ``false`` | No | Render the Slider in a vertical orientation, smallest value on the bottom. |

### Prop Guidance

- **defaultValue**: Use for an uncontrolled Slider where the component owns the value and you only need the initial position. Mutually exclusive with value. Ideal for simple settings that are read on submit rather than tracked in React state. `20`
- **value**: Use when the parent owns the state and needs to react to every change, such as synchronizing the slider with a numeric readout or another control. Must be paired with onChange, and must not be combined with defaultValue. `160`
- **onChange**: Fires on every individual step of a drag or key press and receives the change event plus a data object whose value is the new number. Use it to update controlled state or to reflect the value elsewhere, and keep the handler light because it runs very frequently during dragging. `(ev, data) => setSliderValue(data.value)`
- **min**: Sets the lowest selectable value and therefore the left edge of a horizontal rail or the bottom edge of a vertical rail. Defaults to 0. Set it to the true lower bound of the domain so the rail's position carries meaning. `20`
- **max**: Sets the highest selectable value and therefore the right edge of a horizontal rail or the top edge of a vertical rail. Defaults to 100. Always keep it larger than min, and verify that the span is divisible by step so the maximum is actually reachable. `200`
- **step**: Controls the increment between selectable values; the slider snaps to the closest available value on drag and moves by this amount on each arrow press. Must be a positive number. Choose a step that divides the range evenly to avoid unreachable endpoints. `3`
- **size**: Selects the visual scale of the rail and thumb. medium is the default and should be used in standard forms and touch-friendly layouts; small is for dense surfaces such as filter panels where vertical space is at a premium. `small`
- **vertical**: Renders the slider along the block axis with the smallest value at the bottom and the largest at the top. Use it when the layout is column-oriented or when pairing the slider with a vertically aligned visual, and remember to give the container a defined height. `true`
- **disabled**: Renders the slider as unavailable: it does not respond to clicks, dragging, or keyboard input, and no change events fire. Use it while a dependent choice is unresolved, and pair it with visible text explaining what must happen first. `true`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `input` | — | Yes | The hidden input for the Slider. This is the PRIMARY slot: all native properties specified directly on `<Slider>` will be applied to this slot, except `className` and `style`, which remain on the root slot. |
| `rail` | — | Yes | The Slider's base. It is used to visibly display the min and max selectable values. |
| `root` | — | Yes | The root of the Slider. The root slot receives the `className` and `style` specified directly on the `<Slider>`. All other native props will be applied to the primary slot, `input`. |
| `thumb` | — | Yes | The draggable icon used to select a given value from the Slider. This is the element containing `role = 'slider'`. |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { useId, Label, Slider } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  const id = useId();
  return (
    <>
      <Label htmlFor={id}>Basic Example</Label>
      <Slider defaultValue={20} id={id} />
    </>
  );
};

Default.parameters = {
  docs: {
    description: {
      story: 'A default slider',
    },
  },
};
```

### Controlled

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { useId, Button, Label, Slider } from '@fluentui/react-components';
import type { SliderProps } from '@fluentui/react-components';

export const Controlled = (): JSXElement => {
  const id = useId();
  const [sliderValue, setSliderValue] = React.useState(160);
  const onSliderChange: SliderProps['onChange'] = (_, data) => setSliderValue(data.value);
  const resetSlider = () => setSliderValue(0);
  return (
    <>
      <Label htmlFor={id}>Control Slider [ Current Value: {sliderValue} ]</Label>
      <Slider
        aria-valuetext={`Value is ${sliderValue}`}
        value={sliderValue}
        min={20}
        max={200}
        onChange={onSliderChange}
        id={id}
      />
      <Button onClick={resetSlider}>Reset</Button>
    </>
  );
};

Controlled.parameters = {
  docs: {
    description: {
      story: `A slider can be a controlled input where the slider value is stored in state
      and updated with \`onChange\`. This is also useful for setting custom aria-valuetext`,
    },
  },
};
```

### Disabled

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { useId, Label, Slider } from '@fluentui/react-components';

export const Disabled = (): JSXElement => {
  const id = useId();
  return (
    <>
      <Label htmlFor={id}>Disabled Example</Label>
      <Slider defaultValue={30} disabled id={id} />
    </>
  );
};

Disabled.parameters = {
  docs: {
    description: {
      story: 'A disabled slider will not change or fire events on click or keyboard press.',
    },
  },
};
```

## Best Practices

### Do's

- Pair the Slider with a visible Label whose htmlFor matches the id passed to the Slider; the id is applied to the primary input slot, so the label correctly names the control.
- Use defaultValue for uncontrolled sliders and value only when the parent component owns the state — never both at once.
- Set min and max to the real domain of the value so the rail communicates meaningful endpoints rather than an arbitrary 0–100 scale.
- Choose a step that divides the span of the range evenly so every intended value is reachable by dragging and by keyboard.
- Provide aria-valuetext when the raw number needs units or formatting (for example a currency or percentage reading) so assistive technology announces something meaningful.
- Use vertical when the slider sits beside a chart, in a compact toolbar, or in a column layout where vertical space is plentiful and horizontal space is tight.
- Keep the default medium size for most form rows and switch to small only in genuinely dense interfaces such as filter sidebars or table headers.
- Read the new number from the onChange data argument rather than from the event target, and clamp or round it yourself when persisting controlled state.

### Don'ts

- Don't pass value and defaultValue together — they are mutually exclusive and the component will warn, since it cannot be both controlled and uncontrolled.
- Don't pass a step of zero or a negative step; step must be a positive number for the rail to snap to discrete values.
- Don't set a max that is smaller than min — the range becomes empty and the thumb position is undefined.
- Don't use Slider alone when users need to hit an exact figure; complement it with a Spinbutton or Input for precise entry.
- Don't perform expensive work (network calls, heavy derived state, array sorting) inside onChange, because it fires on every individual step while the user drags.
- Don't assume className and style behave like other native props — they are the only two that stay on the root slot while everything else lands on the hidden input.
- Don't rely on placeholder-style hints or surrounding context to explain what the slider controls; every Slider needs a persistent, associated label.
- Don't use disabled as a way to communicate that a value is out of scope without also explaining why in nearby text — a greyed rail is silent to users who cannot see it.

## Anti-Patterns

### Mixing controlled and uncontrolled values

❌ Passing both value and defaultValue puts the Slider in an ambiguous state: React state and the component's internal state both try to own the same value, producing warnings and a thumb that jumps or refuses to move.

✅ Pick one model. Use defaultValue alone when nothing outside the component cares about the value; use value plus onChange exclusively when the parent owns the state. Never supply both.

### Unlabeled sliders

❌ A bare rail gives assistive technology an unnamed slider widget and gives sighted users no clue what the number represents. The thumb exposes a slider role, so an accessible name is mandatory, not optional.

✅ Always render a visible Label associated through htmlFor and the id passed to the Slider, or supply aria-label or aria-labelledby when a visible label genuinely cannot be shown.

### Heavy work inside onChange

❌ onChange fires on every individual step, which can be dozens of times per second during a drag. Doing network requests, expensive derivations, or broad state updates there causes jank and can flood downstream systems.

✅ Keep the handler to a cheap state update of the numeric value. Debounce or defer any expensive side effect, and derive expensive output from the committed value rather than from each intermediate step.

### Using a slider for exact numeric entry

❌ Dragging a rail cannot reliably land on a specific figure such as 1,247.33, and users on assistive technology must press an arrow key many times to traverse a wide range.

✅ Combine the Slider with an Input or Spinbutton that shows and accepts the exact value, keeping both bound to the same state, or drop the slider entirely if precision is the primary need.

### Expecting className to style the input

❌ All native props except className and style are forwarded to the hidden input slot, so people often assume a class placed on the Slider targets the interactive element, and their overrides silently miss the rail or thumb.

✅ Style through the root and its descendant parts with makeStyles and Griffel selectors, and recolor behavior with theme tokens such as tokens.colorCompoundBrandBackground rather than trying to reach the input directly.

## Accessibility

**Requirements**: Every Slider must have an accessible name. The simplest route is a visible Label wired through htmlFor to the id you give the Slider, since the id is forwarded to the primary input slot. If no visible label is possible, supply aria-label or aria-labelledby on the Slider. The thumb exposes role of slider, so the range must be internally consistent: min must be less than max and step must be positive. When the numeric value is not self-explanatory, supply aria-valuetext so the announced value includes units or a human-readable form. Ensure the surrounding layout gives the slider enough target size — the medium size should be preferred in touch contexts, and small should be avoided where pointer accuracy is limited. Contrast of the rail, the filled portion, and the thumb must remain sufficient in all themes, including high contrast mode.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the Slider so it can be adjusted with the keyboard; the focused slider exposes its current value to assistive technology. |
| `ArrowRight` | Increases the value by one step when the slider is horizontal. |
| `ArrowLeft` | Decreases the value by one step when the slider is horizontal. |
| `ArrowUp` | Increases the value by one step; this is the primary increment key for a vertical slider, where larger values sit toward the top. |
| `ArrowDown` | Decreases the value by one step; this is the primary decrement key for a vertical slider. |
| `Home` | Jumps the value to the minimum of the range. |
| `End` | Jumps the value to the maximum of the range. |
| `PageUp` | Increases the value by a larger interval than a single step, approximating a coarse jump across the range. |
| `PageDown` | Decreases the value by a larger interval than a single step, approximating a coarse jump across the range. |

**ARIA**: aria-valuetext, aria-label, aria-labelledby, aria-valuenow, aria-valuemin, aria-valuemax, aria-disabled

**Screen Reader**: Assistive technology treats the thumb as a slider widget: it announces the accessible name from the associated label or aria-label, the current value, and the min and max bounds. When aria-valuetext is provided, that string is announced instead of the bare number, which is how you add units or phrasing. Keyboard adjustments are announced as value changes on each arrow press, Home and End announce the range endpoints, and disabled sliders are skipped or announced as unavailable. Because the native input is visually hidden while the thumb carries the slider role, all naming and value semantics must be attached through the Slider itself rather than to the rail or thumb markup you might style.

## Styling

className and style are the only props that land on the root slot; every other native property, including id and aria attributes, is forwarded to the hidden input. That means custom styling should be written with makeStyles and Griffel descendant selectors that reach the exported slot classes, for example styling the rail and thumb through the part class names under the Slider root (the rail part, the thumb part, and the input part). Recolor the filled track and thumb with tokens.colorCompoundBrandBackground, tokens.colorCompoundBrandBackgroundHover, and tokens.colorCompoundBrandBackgroundPressed, and the unfilled rail with tokens.colorNeutralStrokeAccessible so the accent follows the brand ramp in both light and dark themes. Use tokens.borderRadiusCircular for a round thumb, tokens.strokeWidthThick for rail thickness, and tokens.durationUltraFast with tokens.curveAccelerateMid for the thumb transition. For vertical sliders, remember the control grows along the block axis, so give the wrapper an explicit block size and use spacing tokens such as tokens.spacingVerticalS to separate the label and the rail. Size differences are already tokenized, so prefer the small and medium size prop over hand-written dimensions.

## Performance

An uncontrolled Slider driven by defaultValue is the cheapest option because adjusting the thumb never re-renders React — the native range input updates the DOM directly. A controlled Slider re-renders on every step of the drag, so keep the surrounding tree small and avoid recreating callbacks or style objects on each render; memoize the handler and any sibling components that do not depend on the value. Because the drag interaction is handled by the underlying native input rather than by pointer-move listeners written in JavaScript, there is no per-frame React work beyond the state update you choose to make. Avoid heavy work in onChange, and if a value feeds an expensive chart or list, derive it from the committed value rather than from each intermediate step.

## Theming & Tokens

Slider is fully token driven. The filled portion of the rail and the thumb use the compound brand tokens — tokens.colorCompoundBrandBackground for the resting state, tokens.colorCompoundBrandBackgroundHover on hover, and tokens.colorCompoundBrandBackgroundPressed while dragging — so redefining the brand ramp automatically re-skins the control. The unfilled rail uses tokens.colorNeutralStrokeAccessible with tokens.colorNeutralStroke1Hover and tokens.colorNeutralStroke1Pressed for interaction feedback, and the surface behind the rail uses tokens.colorNeutralBackground1. Disabled sliders fall back to tokens.colorNeutralBackgroundDisabled, tokens.colorNeutralStrokeDisabled, and tokens.colorNeutralForegroundDisabled. Shape and motion come from tokens.borderRadiusCircular and the duration and curve tokens such as tokens.durationUltraFast and tokens.curveAccelerateMid, so switching to a reduced-motion or high-contrast theme changes the control without any code changes. Because class-level overrides sit on the root while native props sit on the input, theming is best done by overriding these tokens or by styling the exported slot parts rather than by restyling the input element.

## Migration Notes

The v9 Slider is a full rewrite of the v8 component. It is uncontrolled by default through defaultValue and controlled through value, and value and defaultValue are now mutually exclusive. Snapping to discrete increments is the default behavior driven by step, so the older opt-in snapping flag is gone. Value display is no longer part of the component: the v8 props for showing the value, formatting the value, and labeling the slider inline were removed, and you should render your own Label, Text, or formatting alongside the Slider instead. The origin-from-zero option for centering the fill was also removed. The change callback now reports the value in its data argument and fires on every individual step as the user drags, replacing the separate commit-time callback. Component-level styling APIs from v8 are replaced by Griffel makeStyles and theme tokens.

## Edge Cases

- Passing both value and defaultValue is unsupported; the component warns and the two sources of truth fight over the thumb position.
- If step does not divide the span between min and max evenly, the top of the rail is unreachable — for example a range of 0 to 10 with step 3 tops out at 9, so the rail visibly stops short of its end.
- The id, name, and any aria attributes you pass land on the hidden input slot, while className and style stay on the root; this split surprises people who try to query or style the interactive element directly.
- A vertical slider grows along the block axis, so an unconstrained container collapses it to zero height; the wrapper needs an explicit block size for the rail to be visible.
- A disabled slider neither changes nor fires onChange on click or key press, so any dependent UI must handle the frozen value rather than waiting for an event.
- In a controlled setup the component clamps and snaps the displayed value, but your own state is not automatically clamped — if you store an out-of-range number the input will normalize it while your state and the thumb disagree.
- Changing min or max after mount while a controlled value sits outside the new range pushes the thumb to the nearest boundary without invoking onChange, so the parent state can drift from what is displayed.

## See Also

- - [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
