# ColorArea

> **Package**: `@fluentui/react-color-picker` v9.2.17
> **Import**: `import { ColorArea } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

ColorArea is a two-dimensional color selection control that lets users pick a specific point within a color plane. It renders a gradient surface derived from the current hue, where one axis varies saturation and the other axis varies value (brightness), plus a draggable thumb that marks the currently selected coordinate. The component works with HSV color objects rather than hex strings or RGB triples, so it is normally paired with sibling color controls such as a hue slider and a color picker to build a complete color-selection experience. It can operate in a controlled mode through the color prop or in an uncontrolled mode through defaultColor, and it reports every intermediate selection through onChange so callers can preview color changes live. Because it is committed to a single hue plane at a time, ColorArea is the saturation/value surface of a color picker rather than a stand-alone color chooser.

**When to use**: Use ColorArea when a user needs to pick a precise saturation and brightness for an already-determined hue, which is the familiar interaction found in image editors, theme builders, chart editors, and design-token tools. Reach for it when precise two-dimensional adjustment matters more than preset palettes; if the goal is choosing from a curated, finite set of brand colors, prefer SwatchPicker or ColorSwatch instead. If the user only needs a single continuous dimension, such as hue or alpha, use ColorSlider or AlphaSlider rather than ColorArea. ColorArea should be composed with a hue control and, when transparency is relevant, an alpha control, since it deliberately does not change hue itself.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `color` | `HsvColor \| undefined` | — | No | The current color of the ColorArea. |
| `defaultColor` | `HsvColor \| undefined` | — | No | The starting value for an uncontrolled ColorArea. |
| `onChange` | `EventHandler<ColorAreaOnColorChangeData> \| undefined` | — | No | Triggers a callback when the value has been changed. This will be called on every individual step. |

### Prop Guidance

- **color**: The controlled value of the selection, expressed as an HSV color. Pass it whenever the ColorArea shares state with other controls such as a hue slider, alpha slider, or preview swatch, and update it from onChange so the parent remains the single source of truth. Its channels are hue, saturation, and value, so convert from hex or RGB before passing it in. `An HSV value such as hue 210, saturation 75, value 90, held in parent state and updated on every change.`
- **defaultColor**: The initial value for an uncontrolled ColorArea. Use it when the component can own its own selection and nothing else in the page needs to read or reset it, for example in a small self-contained demo or an embedded editor. It is only read on the first render, so changing it later will not move the selection. `An HSV value such as hue 0, saturation 100, value 100 to start at pure red.`
- **onChange**: The callback that receives the updated selection along with event data. It is invoked on every individual step — each pointer move during a drag and each arrow key press — so use it for cheap, synchronous updates such as setting state or updating a preview, and defer anything expensive. This prop is also the only way to observe changes from an uncontrolled ColorArea. `Read the new HSV color from the change data and store it in state, then debounce any heavy downstream work separately.`
- **root**: The required slot for the gradient surface element. Use its className and style to control dimensions, border radius, and outline, and use it as the anchor when positioning ColorArea inside a picker layout. `Apply a square size with a medium border radius and a neutral stroke outline.`
- **thumb**: The required slot for the draggable handle that marks the current coordinate on the plane. Its position is managed by the component from the current color, so customize only its appearance — size, fill, ring color, and shadow — to keep the selection readable against every part of the gradient. `A circular handle with a light fill, a neutral stroke, and a shadow so it stays visible over dark and light regions.`
- **inputX**: The required slot for the horizontal-axis input element. It supplies the keyboard and screen reader affordance for the saturation axis, so give it an accessible name that identifies the axis, and avoid removing it from the tab order since that would make the plane keyboard-inoperable. `Provide a label such as 'Saturation' in the locale's language.`
- **inputY**: The required slot for the vertical-axis input element. Like inputX it is the accessible handle for one dimension of the plane — here the value/brightness axis — so label it distinctly and keep it focusable. `Provide a label such as 'Brightness' in the locale's language.`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `inputX` | — | Yes | — |
| `inputY` | — | Yes | — |
| `root` | — | Yes | — |
| `thumb` | — | Yes | — |

## Best Practices

### Do's

- Pair ColorArea with a separate hue control so users can reach the full HSV color space; ColorArea alone only covers saturation and value for one hue.
- Drive the component with the color prop in controlled mode when the rest of the color picker (hue slider, alpha slider, preview swatch) must stay perfectly in sync.
- Use defaultColor for simple, self-contained cases where the ColorArea owns its own selection state and no other component needs to read it.
- Respond to onChange for live previews and commit the final value on change end, since onChange fires for every individual step of a drag or key press.
- Provide a descriptive accessible name through the inputX and inputY slots so screen reader users know which axis each hidden input controls.
- Keep the surrounding layout generous enough that the surface remains a comfortable drag target, and align sibling hue and alpha controls to the same visual height.
- Normalize incoming colors to HSV before passing them to color, since the component's value contract is an HsvColor with h, s, and v channels.

### Don'ts

- Don't place ColorArea inside a scrollable container that captures drag gestures on touch devices, because pointer drags on the surface will fight with page scrolling.
- Don't hold the selected color only in component-local state when other parts of the picker (hue, alpha, text input, preview) also need it — lift it into the parent.
- Don't perform expensive work such as network requests or large list re-renders directly inside onChange, because it fires at a high rate during dragging.
- Don't use ColorArea as the only color input in a form; users who know the exact hex or RGB value need a typed input in addition to the visual surface.
- Don't override or hide the thumb slot, since removing the thumb eliminates the only visual indication of the current selection.
- Don't assume the color prop is always defined — a brand-new or reset picker may legitimately have no selection, so handle the undefined case in your rendering logic.
- Don't set fixed pixel dimensions that distort the surface's aspect ratio unless the design explicitly calls for a non-square area, since a stretched plane makes saturation and value changes feel inconsistent.

## Anti-Patterns

### Using ColorArea as the entire color picker

❌ The plane only varies saturation and value for a single hue, so users can never reach a different hue from it, leaving most of the color space unreachable.

✅ Compose ColorArea with a hue control and, when transparency matters, an alpha control, and mirror the selected color between them through a single shared HSV value.

### Recomputing or persisting on every onChange step

❌ onChange fires once per individual step, which during a drag can be dozens of calls per second; expensive work there causes dropped frames and laggy thumb tracking.

✅ Keep the onChange handler limited to a cheap state update, and move persistence, network calls, or heavy derived computation into a debounced effect or a change-end commit.

### Hiding or stripping the axis inputs

❌ The inputX and inputY slots are the only keyboard-operable and screen-reader-announced parts of the control, so hiding them or removing them from the tab order makes color selection impossible without a pointer.

✅ Keep both inputs mounted and focusable, and instead style them or position them visually as needed; give each one a clear accessible name.

### Ignoring an undefined color

❌ Both color and defaultColor are optional, so an unset picker can render without a selection; code that assumes a defined HSV object will throw or show a stale thumb position.

✅ Handle the undefined case explicitly — for example by seeding defaultColor with a sensible starting HSV value or by rendering a neutral placeholder state until a selection exists.

## Accessibility

**Requirements**: ColorArea must satisfy WCAG 2.1 success criteria for keyboard operability (2.1.1), non-text contrast for meaningful UI parts such as the thumb outline against the gradient (1.4.11), and use of color (1.4.1) — never let color alone communicate the selection, since the thumb position and the accompanying value readout must also convey it. The component exposes two focusable inputs via the inputX and inputY slots, and each must carry an accessible name; supply one through the slot props (for example a localized string describing the saturation axis and the value axis). Any surrounding labels, hints, or error text should be associated with the picker using a Label or Field so assistive technology announces them together.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the first of the two axis inputs rendered by the inputX and inputY slots. |
| `Shift+Tab` | Moves focus back out of the ColorArea to the previous focusable element. |
| `ArrowLeft` | Decreases the horizontal (saturation) axis value by one step. |
| `ArrowRight` | Increases the horizontal (saturation) axis value by one step. |
| `ArrowDown` | Decreases the vertical (value/brightness) axis value by one step. |
| `ArrowUp` | Increases the vertical (value/brightness) axis value by one step. |
| `Home` | Jumps the focused axis to its minimum (fully desaturated or fully dark). |
| `End` | Jumps the focused axis to its maximum (fully saturated or fully bright). |
| `PageUp` | Moves the focused axis upward in larger increments for coarse adjustment. |
| `PageDown` | Moves the focused axis downward in larger increments for coarse adjustment. |

**ARIA**: aria-label, aria-valuenow, aria-valuemin, aria-valuemax, aria-valuetext, aria-orientation

**Screen Reader**: Because the visual gradient plane is not directly operable by assistive technology, the component exposes two range-style inputs — one from the inputX slot and one from the inputY slot — that announce themselves with their accessible names and their numeric channel values. Screen reader users hear the axis name plus the current value, and every arrow key, Home, End, PageUp, or PageDown press is announced as an updated value, so the onChange callback firing per step also produces a per-step announcement. The draggable thumb is purely visual and is not a separate focus target, meaning keyboard and screen reader users navigate the same two-axis model as pointer users rather than interacting with the thumb directly.

## Styling

Style the surface through the root slot and the marker through the thumb slot, and lean on Griffel tokens so the control tracks the active theme. For the root, typical customizations are a rounded plane with tokens.borderRadiusMedium, an outline using tokens.colorNeutralStroke1, and focus treatment with tokens.colorStrokeFocus1 or tokens.colorStrokeFocus2 when the inner inputs receive keyboard focus. The gradient itself is generated from the current color, so avoid overriding its background unless you intentionally want a static plane. The thumb reads best with a crisp ring: tokens.colorNeutralBackground1 for the fill, tokens.colorNeutralStroke1 for the border so it stays visible over both light and dark gradient regions, tokens.borderRadiusCircular for a perfectly round handle, and tokens.shadow4 or tokens.shadow8 for lift above the plane. Size the thumb generously enough to keep it usable on touch (aim for a hit target around 24 to 32 pixels) and use tokens.spacingVerticalS and tokens.spacingHorizontalS when aligning ColorArea with adjacent hue and alpha controls in a picker column.

## Performance

ColorArea re-renders while the user drags because selection changes flow out through onChange on every step, and the plane's gradient is derived from the current color, so the surface is effectively redrawn as the value changes. Keep the subtree you control around ColorArea small: avoid passing new object identities for color on unrelated renders, memoize any expensive siblings of the picker, and make sure the parent's onChange handler does not trigger broad re-renders of long lists or grids. For live previews of large documents, apply throttling or transition-based styling rather than throttling the ColorArea itself, since dropping steps makes the thumb feel unresponsive. Also prefer controlled mode only when needed — an uncontrolled ColorArea with defaultColor avoids pushing state updates up through the tree on every pointer move, and you can observe the result through onChange without owning the value.

## Theming & Tokens

ColorArea inherits Fluent theme behavior through its slots rather than through dedicated component tokens. In practice you style the root with tokens.borderRadiusMedium and tokens.colorNeutralStroke1 for its outline, and switch to tokens.colorStrokeFocus2 or tokens.colorStrokeFocus1 when the axis inputs receive focus, so keyboard focus remains visible in both light and dark themes. The thumb is where theming matters most: tokens.colorNeutralBackground1 as its fill paired with tokens.colorNeutralStroke1 as its ring keeps it legible over both ends of the gradient in any theme, while tokens.borderRadiusCircular makes it a circle and tokens.shadow4 or tokens.shadow8 lift it off the plane. Spacing around the control should use tokens.spacingVerticalS, tokens.spacingVerticalM, tokens.spacingHorizontalS, and tokens.spacingHorizontalM so it aligns naturally with sibling sliders and swatches inside a picker. Because the plane's colors come from the selected hue rather than from the theme, verify your custom thumb and border choices against high-contrast themes as well, where token values change but the gradient does not.

## Edge Cases

- Achromatic and greyscale colors have an undefined or meaningless hue channel; when a picker hydrates from a hex value like pure grey, the plane may render from a fallback hue until the user interacts with a hue control.
- Saturation and value channels are percentages, not raw fractions, so values read from or written to external color libraries must be scaled consistently to avoid a selection that always sticks to one corner of the plane.
- onChange fires per step, which means a single pointer drag can produce a long stream of callbacks; any code that treats each callback as a discrete user commitment will over-fire.
- In uncontrolled mode, defaultColor is only read at mount, so resetting a form or switching between presets will not move the thumb unless you switch to the controlled color prop.
- Pointer drags on the surface can conflict with scrolling on touch devices; placing the control inside a scrollable region may make fine-grained selection frustrating.
- Very small rendered sizes shrink the draggable plane and the thumb, making precise selection hard for both pointer and touch users; ensure a comfortable minimum size.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
