# ColorSlider

> **Package**: `@fluentui/react-color-picker` v9.2.17
> **Import**: `import { ColorSlider } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

ColorSlider is a form control from Fluent UI React v9 that lets a user adjust exactly one channel of a color. Unlike the general-purpose Slider, which works with arbitrary numeric values, ColorSlider is bound to a color: it takes an HsvColor through the color prop (controlled) or defaultColor (uncontrolled), renders a rail whose gradient visually represents the range of the selected channel, and reports changes through onChange. The channel prop selects which channel is being edited and defaults to hue, and the vertical prop flips the control so the smallest value sits at the bottom. Internally the component is composed of four slots — root, rail, thumb, and input — where the input slot is the focusable range element that handles keyboard interaction and form participation, while rail and thumb provide the visual gradient and handle. Because ColorSlider only edits one channel at a time, it is normally combined with other color components (such as a two-dimensional ColorArea or additional ColorSliders) to build a complete color picking surface.

**When to use**: Use ColorSlider when you are building a color-picking experience and you want precise, single-channel control — for example a hue strip next to a saturation/value area, or a dedicated saturation slider beside a value slider. It is the right choice whenever the user must see and manipulate the continuous range of one channel rather than pick from a fixed set of colors. Choose it over SwatchPicker or ColorSwatch when the user needs any color in the gamut, not a curated palette. Choose it over the generic Slider when the value being edited is semantically a color channel, because ColorSlider supplies the channel-aware gradient rail and understands HsvColor. Reach for AlphaSlider instead when the single channel you need is the alpha channel. Do not use ColorSlider alone as a complete color picker: a single channel constrains only one dimension of the color space, so users cannot reach the full gamut without at least one other control. For plain numeric input that has nothing to do with color, use Slider, SpinButton, or Input.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `channel` | `ColorChannel \| undefined` | ``hue`` | No | Color channel of the Slider. |
| `color` | `HsvColor \| undefined` | — | No | Color of the ColorPicker |
| `defaultColor` | `HsvColor \| undefined` | — | No | The starting color for an uncontrolled ColorSlider. |
| `onChange` | `EventHandler<SliderOnChangeData> \| undefined` | — | No | Triggers a callback when the value has been changed. This will be called on every individual step. |
| `vertical` | `boolean \| undefined` | ``false`` | No | Render the Slider in a vertical orientation, smallest value on the bottom. |

### Prop Guidance

- **channel**: Selects which channel of the HSV color the slider edits; it defaults to hue, which is the most intuitive single-channel control when the rest of the picker drives saturation and value. Change it when you need the same slider look for a different dimension, and always keep your onChange handling aware of which channel is active so the numeric value is written into the correct field of your HsvColor. If the channel you need is alpha, prefer AlphaSlider. `hue`
- **color**: Use this for controlled usage: pass the current HsvColor and update it from onChange. Because the component reads the object to compute both the rail gradient and the thumb position, feed it a fresh object on every change instead of mutating the existing one, and never combine it with defaultColor. `{ h: 210, s: 0.8, v: 0.9 }`
- **defaultColor**: Use this for uncontrolled usage when the slider is the only consumer of the value and you just need a sensible starting point. Once mounted, the component owns the value; if some other control in the same picker also edits the color, switch to the controlled color prop so all controls share a single source of truth. `{ h: 30, s: 1, v: 1 }`
- **onChange**: Fires on every individual step of the interaction, including each step of a drag, with SliderOnChangeData. Treat it as a high-frequency callback: fold the reported channel value into a new HsvColor and update state, but defer expensive work such as persistence, undo checkpoints, or analytics to a coarser boundary. `onChange: (event, data) => setColor(nextColorForChannel(channel, data.value))`
- **vertical**: Set to true to render the slider vertically with the smallest value at the bottom — useful in tall, narrow layouts or when stacking several channel sliders beside a ColorArea. When vertical, ensure the root has enough block-size to give the rail a usable drag length, and remember that ArrowUp/ArrowDown become the primary increment keys. `vertical`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `input` | — | Yes | — |
| `rail` | — | Yes | — |
| `root` | — | Yes | — |
| `thumb` | — | Yes | — |

## Best Practices

### Do's

- Give the control an accessible name — either pass aria-label/aria-labelledby through the input slot's props, or associate it with a Label using the same id (Field compositions work well here).
- Drive the slider in controlled mode by passing an HsvColor to color and updating it in onChange, so the slider, any sibling ColorArea, and any swatch stay perfectly in sync.
- Convert the change data from onChange back into a new HsvColor object (respecting the channel prop) before you store it, so the color prop always describes the current state.
- Compose multiple ColorSliders — or a ColorSlider plus a ColorArea — when the user must be able to reach the whole color space; one channel alone is not a picker.
- Set vertical to true and reserve sufficient block-size when layout space is tall and narrow, such as in a side panel or a vertical color-editing stack.
- Verify the chosen channel actually has a visible effect on your users' output — a saturation slider is meaningless as a sole control if the eventual swatch is always fully saturated.

### Don'ts

- Don't pass both color and defaultColor at the same time, and don't switch a given instance from uncontrolled to controlled over its lifetime; React will warn and the displayed value can desync from your state.
- Don't override the rail background with a fixed color, token, or hardcoded gradient; the component generates the gradient for the active channel and a static background destroys the relationship between thumb position and the color it produces.
- Don't mutate the HsvColor object you receive or hold in state — always create a new object, otherwise React sees the same reference and the slider will not re-render.
- Don't perform expensive or side-effectful work (network calls, undo-history pushes, analytics per step) directly inside onChange; it fires on every individual step of a drag.
- Don't use ColorSlider for non-color numeric values or for the alpha channel when AlphaSlider already covers that case.
- Don't rely on visual position alone to convey which channel is being edited; label the slider with its channel (for example "Hue" or "Saturation") and, where helpful, provide descriptive value text through the input slot.

## Anti-Patterns

### Mixing controlled and uncontrolled color props

❌ Passing both color and defaultColor, or starting with defaultColor and later supplying color, produces a React controlled/uncontrolled warning and can leave the rendered thumb position out of sync with the value your application believes is selected.

✅ Pick one model per instance. For a shared picker surface, use color plus onChange and keep the HsvColor in your own state; for a throwaway control, use defaultColor alone and read the value from onChange.

### Treating one slider as a whole color picker

❌ A single ColorSlider only moves one dimension of the color space, so users cannot reach colors outside that slice and may assume the control is broken when the resulting color barely changes (for example, changing hue while saturation is zero).

✅ Compose the control into a complete surface: pair a hue ColorSlider with a ColorArea for saturation and value, add additional ColorSliders for other channels, or use AlphaSlider for transparency, and label each control with its channel.

### Overriding the generated rail gradient

❌ The rail background is computed from the current color and the selected channel so that the thumb's horizontal or vertical position always maps to the color it produces. Replacing it with a static token color or hardcoded gradient leaves a control whose visuals lie about the selected value and stop responding to channel changes.

✅ Style everything around the gradient — rail border, thumb fill, shadow, focus ring, sizing — with tokens, and let the component own the gradient itself.

### Mutating the HsvColor instead of replacing it

❌ HsvColor is an object, so mutating the instance held in state preserves its identity; React sees no change and the slider does not re-render, producing a thumb that appears stuck.

✅ Always produce a new object for the color prop, for example by spreading the previous color and overwriting only the field for the active channel.

### Heavy work inside onChange

❌ onChange is called on every individual step, so a drag can produce dozens or hundreds of invocations; network requests, history snapshots, or expensive derived computations inside it cause dropped frames and rate-limit problems.

✅ Keep onChange limited to cheap state updates, and debounce or batch the expensive follow-up work on a separate effect.

## Accessibility

**Requirements**: ColorSlider's input slot renders a focusable range control, so the standard requirements for a slider apply: it must have a programmatically determinable accessible name (WCAG 4.1.2 Name, Role, Value), its current value must be exposed, and color must never be the only means of conveying information (WCAG 1.4.1). Because the rail is a gradient, users who cannot perceive color still need the numeric value read out and a visible text label for the channel. Focus indication must remain visible (WCAG 2.4.7) and the touch target must be large enough for pointer input (WCAG 2.5.8). If the surrounding picker relies on the slider's color feedback to confirm selection, provide an additional textual or numeric readout.

| Key | Action |
| --- | --- |
| `ArrowRight` | Increases the channel value by one step on a horizontal slider (reversed in right-to-left reading order). |
| `ArrowLeft` | Decreases the channel value by one step on a horizontal slider (reversed in right-to-left reading order). |
| `ArrowUp` | Increases the channel value by one step; this is the primary increment key when vertical is true. |
| `ArrowDown` | Decreases the channel value by one step; this is the primary decrement key when vertical is true. |
| `Home` | Moves the thumb to the minimum value of the channel (for example, the lowest hue). |
| `End` | Moves the thumb to the maximum value of the channel (for example, the highest hue). |
| `PageUp` | Moves the thumb up by a larger increment than a single arrow-key step. |
| `PageDown` | Moves the thumb down by a larger increment than a single arrow-key step. |
| `Tab` | Moves focus onto the range input inside the input slot, and Shift+Tab moves focus away to the next focusable control. |

**ARIA**: aria-label, aria-labelledby, aria-valuetext, role="slider" (implicit on the range input in the input slot), aria-valuemin, aria-valuemax, and aria-valuenow (exposed by the underlying range input)

**Screen Reader**: Because the interactive part of ColorSlider is a native range input in the input slot, screen readers announce it as a slider with its current numeric value and its minimum and maximum, and they re-announce the value as the user moves the thumb with the arrow, Home, End, PageUp, and PageDown keys. The accessible name comes from aria-label, aria-labelledby, or an associated Label — without one, the control is announced only as an unnamed slider and the user has no way to know which channel (hue, saturation, value, or alpha) they are changing. The gradient on the rail and the decoration on the thumb are purely presentational and are not announced, so instructions or units (such as degrees of hue) should be expressed through visible label text or aria-valuetext.

## Styling

ColorSlider exposes the root, rail, thumb, and input slots, so the safest way to restyle it is through slot props combined with makeStyles and Griffel tokens rather than by overriding the generated gradient. Use tokens.colorNeutralStroke1 or tokens.colorNeutralStrokeAccessible on the rail for its border and tokens.borderRadiusCircular for its rounded ends; give the thumb tokens.colorNeutralBackground1 for its fill, tokens.colorNeutralStroke1 for its outline, tokens.borderRadiusCircular for its shape, and tokens.colorNeutralShadowAmbient plus tokens.colorNeutralShadowKey for the shadow so it stays readable against the gradient. Size the thumb and rail with tokens such as spacingHorizontalXS/spacingVerticalXS for padding, and use strokeWidthThin, strokeWidthThick, and strokeWidthThicker for borders and focus rings. Preserve focus visibility by targeting :focus-visible on the input slot with tokens.colorStrokeFocus2 and a thick stroke, and add a transition using tokens.durationNormal and tokens.curveEasyEase for a polished thumb motion. When vertical is true, remember that the rail grows along the block axis, so constraints you apply to height and width on the root need to be swapped accordingly. Do not hardcode the rail's background — the component computes it from the current color and channel.

## Performance

ColorSlider recomputes its rail gradient and thumb placement from the HsvColor on every render, and onChange fires for each step of a drag, so both the render path and the callback path need to stay cheap. Keep the color object stable unless it actually changed — creating a fresh object literal inline in the parent's render, or pushing a new one on every unrelated render, forces the slider (and any sibling ColorArea sharing the color) to re-render unnecessarily; store colors in state or memoize them. Avoid recreating slot objects or inline style props on every render; define classes once with makeStyles so Griffel class names stay memoized, and only reach for inline styles when a value genuinely depends on runtime data. Inside onChange, do nothing heavier than setting state — defer persistence, undo checkpoints, or analytics, since a single drag can emit many events. If several ColorSliders and a ColorArea all read the same color, lifting the color into a single parent state keeps them consistent but means each step re-renders all of them; that is normally acceptable, but isolate the picker from the rest of a large page so the re-render stays local.

## Theming & Tokens

ColorSlider consumes Fluent theme tokens for all of its chrome: the rail border and thumb outline come from neutral stroke tokens such as tokens.colorNeutralStroke1 and tokens.colorNeutralStrokeAccessible, the thumb fill from tokens.colorNeutralBackground1, the thumb shadow from tokens.colorNeutralShadowAmbient and tokens.colorNeutralShadowKey, and the focus indicator from tokens.colorStrokeFocus2 with tokens.strokeWidthThick. Shape and spacing come from tokens.borderRadiusCircular, tokens.borderRadiusMedium, tokens.spacingHorizontalS, and tokens.spacingVerticalS, while motion uses tokens.durationNormal with tokens.curveEasyEase. Critically, the gradient inside the rail is derived from the HsvColor you supply rather than from the theme, so switching between light, dark, or a custom brand theme restyles the control's frame and focus treatment but does not change the color range the user is editing — you control that entirely through the color or defaultColor prop. In forced-colors and high-contrast modes, gradient backgrounds are flattened by the browser, so verify that the thumb and rail border remain distinguishable and that the channel is still identified by a visible label.

## Migration Notes

ColorSlider is a v9 component with no direct one-to-one equivalent in v8, where channel sliders lived inside the monolithic ColorPicker and colors were expressed as RGB-with-alpha objects. In v9 the control is standalone and composable: it operates on HsvColor, takes a channel prop to decide which channel it edits, and is meant to be combined with other color components (ColorArea, additional ColorSliders, or AlphaSlider) rather than a single all-in-one picker. Styling and part customization also moved from v8 class names to the v9 slot model with root, rail, thumb, and input, plus Griffel makeStyles and useColorSliderStyles_unstable/useColorSlider_unstable-style composition. A single ColorSlider instance is therefore not a drop-in replacement for a full v8 ColorPicker — plan for composition.

## Edge Cases

- Changing the channel prop at runtime changes what the slider edits but the controlled color value does not automatically follow; make sure your onChange handler and gradient expectations are updated for the new channel, otherwise the thumb can appear to jump.
- When the channel is hue but the current color has zero saturation or zero value, moving the slider changes the hue without visibly changing a swatch rendered from that color — an effect users often interpret as a bug. Pair hue editing with visible saturation and value controls.
- The color prop expects an HsvColor object; supplying a color in another color space or a stale object reference results in a thumb position and gradient that no longer match what the user last did.
- If neither color nor defaultColor is provided, the slider starts from its internal initial color, so the first interaction may report a value that surprises an application expecting its own default.
- Setting vertical changes the axis of both the layout and the primary keyboard keys: ArrowUp/ArrowDown become the natural increment/decrement keys, and a container that only constrains width will collapse the rail's drag length.
- Under forced-colors/high-contrast mode the rail gradient may be suppressed by the browser, leaving the channel identifiable only by its border and label — always provide that label.
- Because onChange fires on every step, consumers that treat each event as a discrete user decision (for example, pushing undo entries) will create far more entries than the user perceives.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
