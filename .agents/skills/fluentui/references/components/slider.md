# Slider

> **Package**: `@fluentui/react-slider` v9.6.3
> **Import**: `import { Slider } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Slider is a form input that lets a person select a single numeric value from a continuous or stepped range by dragging a thumb along a rail, clicking anywhere on the rail, or using the keyboard. It renders as a compound component with four slots: a root wrapper, a rail that visually communicates the minimum and maximum bounds, a draggable thumb that carries the slider role semantics, and a hidden native input that is the primary slot — meaning every native HTML attribute placed on the Slider (such as id, name, form, aria-label, onFocus, or data attributes) is forwarded to that input, while className and style stay on the root. The component supports both controlled usage through value plus onChange and uncontrolled usage through defaultValue, along with min, max, step, size, disabled, and vertical orientation. It is intended for approximate, relative adjustments (volume, brightness, zoom, price range, opacity) rather than precise numeric entry.

**When to use**: Use Slider when the exact number matters less than the relative position within a range and you want the adjustment to feel direct and continuous — for example volume, brightness, opacity, zoom level, playback position, or a budget/price filter. Use it when an immediate visual preview of the effect is valuable, since dragging gives live feedback before the person commits. Prefer SpinButton or Input when the user must enter or read an exact value with precision (quantities, IDs, currency amounts, coordinates), because typing is faster and less error-prone than dragging for exact numbers. Prefer Rating or RatingDisplay for discrete opinion scales, RadioGroup or Select for a small set of named, non-numeric choices, and Switch or Checkbox when the choice is binary. Slider is most valuable when paired with a Label and, ideally, a live readout of the current value.

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

- **value**: Use for a controlled Slider where the value lives in state, a store, or a form library. Mutually exclusive with defaultValue, and it must be updated in onChange or the control will appear frozen and revert visually. Pair it with aria-valuetext when the displayed value needs wording or units. `value with onChange updating state`
- **defaultValue**: Use for an uncontrolled Slider whose value only needs to be read on submit or is otherwise not driven by parent state. This avoids re-rendering the parent on every step and is the simplest option for settings panels. Must fall within min and max and, when step is set, snap to the nearest legal step. `defaultValue set to 20 on a 0-100 range`
- **onChange**: Fires on every individual step — during dragging and on each arrow-key press — and receives the event plus a data object containing the new value. Keep the handler cheap and store the value in state when the Slider is controlled. Do not perform expensive side effects such as network calls here. `onChange that reads the new value from the second argument`
- **min**: Sets the lowest selectable value. Keep it consistent with the meaning of the data — 0 for percentages, negative values only when negatives are legitimate. Must be less than max. Pair visible bounds with aria-hidden Labels when showing numbers next to the rail. `min set to 10`
- **max**: Sets the highest selectable value. Together with min it defines the range that the rail represents and that aria-valuemin/aria-valuemax announce, so choose round, meaningful endpoints. Must be greater than min. `max set to 50`
- **step**: Controls the increment size and the snapping granularity. Must be a positive number; use larger steps (for example 5 or 10) when fine precision is not useful, and keep step a divisor of the min-to-max span so the endpoints are reachable. When step is provided the value snaps to the closest available step. `step set to 3 on a 0-12 range`
- **size**: Chooses between medium, the default, and small for denser surfaces such as toolbars, side panels, and compact property grids. Size changes only visual scale, not behavior or range. `size set to small`
- **disabled**: Renders the Slider non-interactive; it will not change or fire events on click or keyboard press. Use it for temporarily unavailable settings, and communicate why the setting is unavailable in nearby text rather than relying on the dimmed appearance alone. `disabled with a defaultValue of 30`
- **vertical**: Renders the Slider bottom-to-top with the smallest value at the bottom, which suits volume faders, mixers, and dashboards. Reserve vertical orientation for cases where the surrounding layout is vertical, and make sure the containing element gives it a defined height, since a vertical Slider in an auto-height container has nothing to stretch into. `vertical on a 0-10 range`

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

- Always give the Slider an accessible name: render a Label with htmlFor pointing at the same id passed to the Slider, or supply aria-label / aria-labelledby directly, since the id lands on the primary input slot.
- Choose min, max, and step so that the default and every reachable value are meaningful — for example step of 5 on a 0-100 percentage scale rather than step of 1 when precision is irrelevant.
- Provide a human-readable readout of the current value next to the slider (or in the label itself) so users, including those who cannot see the thumb position, know what they selected.
- Use aria-valuetext when the raw number is not self-explanatory — the Controlled example sets aria-valuetext to a phrase describing the value so screen readers announce units or context instead of a bare integer.
- Add context around min and max in custom layouts by rendering the numeric bounds as separate Labels marked aria-hidden, as the MinMax example does, so the bounds are visible without being announced twice.
- Pick size to match the density of the surrounding UI — medium for standard forms and small for toolbars, side panels, or compact settings lists.
- Prefer defaultValue for sliders whose value only matters at submit time; this keeps the component uncontrolled and avoids re-rendering the parent on every step.
- Keep onChange handlers lightweight; move expensive work such as network requests or heavy recomputation to a commit action (a Button, or a debounced effect) rather than doing it on each step.

### Don'ts

- Do not pass both value and defaultValue — they are mutually exclusive; value makes the Slider controlled and defaultValue only applies to the uncontrolled case.
- Do not set value without updating it in onChange, because the Slider will be pinned to the stale value and the thumb will snap back as soon as the user releases or moves it.
- Do not leave the Slider without a label and rely on nearby visual text; associate a Label through htmlFor and id, or add aria-label, otherwise assistive technology announces an unnamed slider.
- Do not use a Slider for entering exact numbers such as quantities, account values, or coordinates; use SpinButton or Input instead.
- Do not set step to zero or a negative number — the step must be a positive value, otherwise the component cannot snap correctly.
- Do not set min greater than max, or a defaultValue outside the min/max range, because the value will be clamped or snapped to the nearest legal value and will not match what you passed in.
- Do not use disabled as the only way to communicate that a setting is unavailable; explain the reason in nearby text so the state is understandable.
- Do not over-style the thumb and rail with hard-coded colors, because it breaks theming, high-contrast, and disabled appearance; use Fluent design tokens instead.

## Anti-Patterns

### Mixing controlled and uncontrolled usage

❌ Passing both value and defaultValue creates ambiguity about the source of truth; the two props are mutually exclusive, and the control may appear to ignore updates or snap unexpectedly when the controlled value is stale.

✅ Choose one model. Use value together with onChange state for controlled scenarios, or defaultValue alone for uncontrolled scenarios, and never pass both on the same element.

### Controlled slider without a state update

❌ When value is provided but onChange does not write the new value back to state, the thumb can be dragged but visually returns to the old value on release. The Slider appears broken even though the component is behaving correctly.

✅ Always update the bound state from the value carried in the onChange data object, as the Controlled example does, or switch to defaultValue and drop the value prop entirely.

### Unlabeled slider relying on visual proximity

❌ A Slider with no associated Label, aria-label, or aria-labelledby is announced as an unnamed slider, so screen reader and voice-control users cannot tell what is being adjusted. Nearby visual text does not create an accessible name.

✅ Render a Label with htmlFor matching the id passed to the Slider, or set aria-label / aria-labelledby on the component. Remember the id is forwarded to the primary input slot, which is what the Label must point at.

### Using a Slider for exact numeric entry

❌ Dragging a slider is imprecise: users cannot reliably land on a specific value inside a wide range, which leads to overshoot and repeated correction, particularly for values like quantities or account numbers.

✅ Use SpinButton or Input when an exact value is required, and keep Slider for approximate, relative adjustments where close enough is genuinely close enough.

### Expensive work on every step

❌ The onChange callback fires on every individual step while dragging, so triggering a request, parsing a large dataset, or rebuilding a heavy tree inside it will fire dozens of times per drag and stall the UI.

✅ Keep onChange to cheap state updates, and defer heavy work to an explicit commit action such as a Button, an effect that reacts to a settled value, or debouncing outside the Slider.

### Rendering a value with no units or context

❌ A raw integer on its own is ambiguous — the number 20 could mean 20 percent, 20 seconds, or 20 pixels — and screen readers announce only the bare number, leaving users unable to interpret the setting.

✅ Show units next to the value in the visible UI and set aria-valuetext with a descriptive phrase, as the Controlled example does when it announces that the value is a specific number.

## Accessibility

**Requirements**: The Slider must have an accessible name (via Label + htmlFor and a matching id, or aria-label / aria-labelledby), and it exposes its value range through aria-valuemin, aria-valuemax, and aria-valuenow on the slider-role thumb. Supply aria-valuetext when the numeric value needs units or phrasing to be understood. Because all native props are forwarded to the hidden input slot, standard form semantics (id, name, form, required-adjacent validation, autocomplete) attach there, and the id must match the Label's htmlFor for the name to be announced. Color contrast of the rail fill, thumb, and focus indicator must meet WCAG 1.4.11 non-text contrast (3:1) in all themes, and no meaning may be conveyed by color alone — pair the slider with a textual value. Targets must remain large enough to drag comfortably (WCAG 2.5.8 minimum target size), and the vertical orientation must also expose aria-orientation so assistive technology announces correct arrow-key expectations.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the Slider's input; the thumb visually indicates focus. |
| `Right Arrow` | Increases the value by one step (moves the thumb toward max). |
| `Up Arrow` | Increases the value by one step; for a vertical Slider this moves the thumb upward toward max. |
| `Left Arrow` | Decreases the value by one step (moves the thumb toward min). |
| `Down Arrow` | Decreases the value by one step; for a vertical Slider this moves the thumb downward toward min. |
| `Home` | Jumps the value to min. |
| `End` | Jumps the value to max. |
| `Page Up` | Increases the value by a larger increment than a single step. |
| `Page Down` | Decreases the value by a larger increment than a single step. |

**ARIA**: aria-label, aria-labelledby, aria-valuenow, aria-valuemin, aria-valuemax, aria-valuetext, aria-orientation, aria-disabled, aria-hidden (used on decorative min/max Labels in custom layouts)

**Screen Reader**: Screen readers encounter the element carrying role set to slider and announce its accessible name, the current value, and the bounds, for example a name followed by the current value within the min-to-max range. When aria-valuetext is present it is announced in place of the raw number, which is how the Controlled example communicates a verbose phrasing of the value. Each keyboard arrow press or drag emits a value-change announcement, so value changes are spoken continuously while the user holds an arrow key. A disabled Slider is announced as dimmed and does not respond to click or keyboard events. Numeric bounds rendered purely as decoration should be hidden with aria-hidden so they are not read as duplicate labels.

## Styling

Style the Slider with makeStyles from @fluentui/react-components so classes are atomic and theme-aware. The rail's filled portion is driven by brand tokens such as tokens.colorCompoundBrandBackground, with tokens.colorCompoundBrandBackgroundHover and tokens.colorCompoundBrandBackgroundPressed for pointer interaction states, and the unfilled portion reads as tokens.colorNeutralBackground1 with tokens.colorNeutralStroke1 or tokens.colorNeutralStrokeAccessible for the boundary. The thumb uses a neutral surface fill (tokens.colorNeutralBackground1) with tokens.colorNeutralStrokeAccessible as its border, and tokens.borderRadiusCircular to keep it circular at any size. Disabled styling should draw from tokens.colorNeutralBackgroundDisabled, tokens.colorNeutralStrokeDisabled, and tokens.colorNeutralForegroundDisabled rather than hard-coded greys. Use tokens.spacingHorizontalS / tokens.spacingVerticalM to space a Slider away from its Label and readout, tokens.strokeWidthThick and tokens.strokeWidthThin for rail thickness, and tokens.durationNormal with tokens.curveEasyEase for transitions on the thumb and fill. When building custom slider-and-readout rows, wrap the pieces in your own flex container and give the value text a fixed width or tabular numerals so the layout does not jump as the number changes width. Avoid inline style objects that change per render, since they defeat Griffel class reuse.

## Performance

Slider uses a hidden native input as its primary slot, so value handling and keyboard stepping ride on native browser behavior and stay cheap. The main cost is re-rendering: a controlled Slider updates state on every individual step, which re-renders the Slider and its parent on every arrow press or drag movement. For settings that only need to be read at submit time, use defaultValue so the parent does not re-render during interaction. Keep onChange handlers free of expensive work such as data fetching, large array transformations, or layout measurement, since they run once per step. Prefer makeStyles for styling so Griffel can share atomic classes across Slider instances instead of emitting per-instance inline styles, and avoid recreating inline style or class objects on each render. Styling complexity is modest — root, rail, thumb, and input — so avoid deeply nested custom wrappers that force layout recalculation on every value change, especially in vertical layouts where the rail height participates in layout.

## Theming & Tokens

Slider draws its appearance entirely from Fluent design tokens resolved through the nearest FluentProvider, so it adapts automatically to light, dark, and high-contrast themes as well as brand variants. The active fill of the rail is built from tokens.colorCompoundBrandBackground with tokens.colorCompoundBrandBackgroundHover and tokens.colorCompoundBrandBackgroundPressed for pointer states, and the inactive rail uses tokens.colorNeutralBackground1 against tokens.colorNeutralStroke1 or tokens.colorNeutralStrokeAccessible borders. The thumb fill is tokens.colorNeutralBackground1 with tokens.colorNeutralStrokeAccessible as its outline, shaped with tokens.borderRadiusCircular. Disabled Sliders resolve to tokens.colorNeutralBackgroundDisabled, tokens.colorNeutralStrokeDisabled, and tokens.colorNeutralForegroundDisabled. Focus indication uses the standard focus token family so it stays visible in forced-colors mode, and rail thickness derives from tokens.strokeWidthThick / tokens.strokeWidthThin while transitions use tokens.durationNormal and tokens.curveEasyEase. Any custom styling should reference these same tokens rather than literal color values so the Slider keeps matching the active theme.

## Migration Notes

Coming from Fluent UI React v8, the callback shape changed: v9 calls onChange with the event first and a data object second, so the numeric value is read from the data object rather than as a second argument. v9 also adds defaultValue, which makes uncontrolled usage possible without re-rendering a parent on every step, and adds a size option of small or medium. v8-only conveniences such as an inline value readout, origin-from-zero behavior, and explicit snap-to-step handling are not part of the v9 prop surface; reproduce a readout by rendering your own Label or Text next to the Slider, and rely on step for snapping. Accessibility props in v8 that accepted an aria label shorthand are replaced in v9 by standard DOM attributes, which are forwarded to the primary input slot.

## Edge Cases

- Because className and style stay on the root slot while every other native prop is forwarded to the primary input slot, attributes intended for the interactive element — such as id, name, form, and aria-label — behave differently from styling props. Passing an id is required for a Label with htmlFor to correctly name the Slider.
- Vertical orientation places the smallest value at the bottom. In a container without an explicit height, a vertical Slider has no defined extent to render into, so always give the wrapper a height; remember that Up Arrow increases and Down Arrow decreases the value in this orientation.
- When step is provided, the value snaps to the closest available step, so defaultValue or value values that do not align to the grid will be adjusted on mount and the rendered position may differ from what was passed.
- Passing both value and defaultValue is not supported; the props are mutually exclusive, and relying on either one winning produces inconsistent behavior between renders.
- A disabled Slider will not change or fire events on click or keyboard press, and onChange never runs, so any UI that depends on that callback to stay in sync will appear frozen rather than merely dimmed.
- When displaying min and max numbers beside the rail in a custom layout, those Labels should be marked aria-hidden, as the MinMax example does, so the same numbers are not announced on top of the slider's own value and range information.
- onChange fires on every individual step, meaning a single drag can produce a long series of calls; code that assumes one call per interaction, such as validation that shows an error immediately, can flash messages while the user is still dragging.
- Setting min greater than max, or step to zero or a negative number, produces an unusable range; validate these values when they are computed from data rather than hard-coded.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
