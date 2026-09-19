# ColorPicker

> **Package**: `@fluentui/react-color-picker` v9.2.17
> **Import**: `import { ColorPicker } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

ColorPicker is a composite form control that lets a user choose a color, including its alpha channel, from an interactive visual surface. Rather than rendering a fixed palette or a single canvas on its own, it acts as the container and state hub for a family of color sub-components: ColorArea provides the two-dimensional saturation/brightness gradient, ColorSlider adjusts a single hue, saturation, or value channel, and AlphaSlider adjusts opacity, with SwatchPicker and its ColorSwatch children available for presenting saved or presets alongside the freeform controls. The picker is controlled: you pass the current selection through the color prop as an HsvColor and receive every user-driven change through onColorChange, whose callback data carries an updated HsvColor (including an optional alpha). Because all children read from the same selection context, composing ColorArea, ColorSlider, and AlphaSlider inside a single ColorPicker keeps every sub-control synchronized on one value. The component exposes a minimal prop surface — color, onColorChange, and shape — and a required root slot, leaving layout, preview swatches, and hex/RGB text fields to the consumer, as demonstrated in the documentation stories that pair the picker with Input, SpinButton, Label, Button, and Popover.

**When to use**: Use ColorPicker when a user needs to author or fine-tune an arbitrary color: theme and brand customization screens, design or diagram tooling, annotation and highlight settings, chart series colors, or any personalization surface where the exact hue, saturation, brightness, and opacity matter. Pair it with ColorArea, ColorSlider, and AlphaSlider when you need full freedom of selection, and add SwatchPicker when you want to combine freeform selection with a short list of saved or preset colors. Prefer a simpler alternative when the choice is bounded: use a single Select, Radio group, or SwatchPicker on its own if the user picks from a small fixed list of colors, and use a plain Input with hex validation if the audience is technical and typing the value is faster than dragging. When picker real estate is limited, or when the choice should be confirmed before it takes effect, host the picker inside a Popover triggered by a Button and commit the value with an explicit confirmation action. Avoid ColorPicker for purely decorative color usage where no user choice occurs.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `color` | `HsvColor \| undefined` | — | No | Selected color. |
| `onColorChange` | `any` | — | No | Callback for when the user changes the color. |
| `shape` | `"rounded" \| "square" \| undefined` | — | No | ColorPicker shape |

### Prop Guidance

- **color**: The current selection, expressed as an HsvColor rather than a string. Pass the exact object you want displayed; the picker is controlled, so a change to this prop is what moves the thumbs. Keep the object complete by supplying hue, saturation, and value, and include alpha when opacity is being edited, defaulting missing alpha to 1 on the way in. `An HsvColor state value such as hue 210, saturation 1, value 1, alpha 1`
- **onColorChange**: The single change notification for the whole picker. It receives an event and a data object containing the updated HsvColor, and it fires continuously while a thumb is dragged or when an arrow key adjusts a channel. Use it to write the new color back into state, spreading the reported color and defaulting alpha when it is undefined, and keep the handler light because it runs on every incremental change. `Update state with the reported color and fall back to an alpha of 1 when alpha is not reported`
- **shape**: Controls the corner rounding of the picker's sub-components, with rounded as the default and square available for interfaces built from square-cornered controls. Set it once on the parent and let the children inherit it, rather than styling each child separately. `square`
- **root (slot)**: The root element that wraps the picker's children and carries the shared color context. Attach layout classes and an accessible name to it, and remember that it renders no controls by itself — content comes entirely from the ColorArea, ColorSlider, AlphaSlider, and any preview or text-field elements you place inside. `A container that stacks a ColorArea, a hue slider, and an alpha slider`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { tinycolor } from '@ctrl/tinycolor';

export const Default = (): JSXElement => {
  const hexId = useId('hex-input');
  const alphaId = useId('alpha-input');

  const styles = useStyles();
  const [color, setColor] = React.useState(DEFAULT_COLOR_HSV);
  const [hex, setHex] = React.useState(tinycolor(color).toHexString());
  const [rgb, setRgb] = React.useState(tinycolor(color).toRgb());
  const [alpha, setAlpha] = React.useState(color.a);
  const [namedColor, setNamedColor] = React.useState('');

  const handleChange: ColorPickerProps['onColorChange'] = (_, data) => {
    setColor({ ...data.color, a: data.color.a ?? 1 });
    setHex(tinycolor(data.color).toHexString());
    setRgb(tinycolor(data.color).toRgb());
    setAlpha(data.color.a ?? 1);
    const _namedColor = tinycolor(`hsl(${data.color.h},100%,50%)`).toName();
    if (_namedColor) {
      setNamedColor(_namedColor);
    }
  };

  const onRgbChange: InputRgbFieldProps['onChange'] = (_, data) => {
    const newColor = tinycolor({ ...rgb, [data.name]: data.value });
    if (newColor.isValid) {
      setColor(newColor.toHsv());
      setHex(newColor.toHex());
      setRgb(newColor.toRgb());
    }
  };

  const onAlphaChange = React.useCallback(
    (_ev: SpinButtonChangeEvent, data: SpinButtonOnChangeData) => {
      const value = data.value ?? parseFloat(data.displayValue ?? '');

      if (Number.isNaN(value) || value < 0 || value > 1) {
        return;
      }

      const newColor = tinycolor({ ...color, a: value });

      if (newColor.isValid) {
        setColor(newColor.toHsv());
        setHex(newColor.toHex());
        setRgb(newColor.toRgb());
        setAlpha(newColor.a);
      }
    },
    [setAlpha, setRgb, setHex, setColor, color],
  );

  const colorAriaAttributes = {
    'aria-roledescription': '2D slider',
    'aria-valuetext': `Saturation ${color.s * 100}, Brightness: ${color.v * 100}, ${namedColor}`,
  };

  return (
    <div className={styles.example}>
      <ColorPicker color={color} onColorChange={handleChange}>
        <ColorArea
          inputX={{ 'aria-label': 'Saturation', ...colorAriaAttributes }}
          inputY={{ 'aria-label': 'Brightness', ...colorAriaAttributes }}
        />
        <ColorSlider aria-label="Hue" aria-valuetext={`${color.h}°, ${namedColor}`} />
        <AlphaSlider aria-label="Alpha" aria-valuetext={`${color.a * 100}%`} />
      </ColorPicker>
      <div className={styles.inputFields}>
        <InputHexField
          id={hexId}
          value={hex}
          onChange={e => {
            const value = e.target.value;
            const newColor = tinycolor(value);
            if (newColor.isValid) {
              setColor(newColor.toHsv());
              setRgb(newColor.toRgb());
              setAlpha(newColor.a);
            }
            setHex(oldValue => (HEX_COLOR_REGEX.test(value) ? value : oldValue));
          }}
        />
        <InputRgbField label="Red" value={rgb.r} name="r" onChange={onRgbChange} />
        <InputRgbField label="Green" value={rgb.g} name="g" onChange={onRgbChange} />
        <InputRgbField label="Blue" value={rgb.b} name="b" onChange={onRgbChange} />
        <InputAlphaField id={alphaId} value={alpha} onChange={onAlphaChange} />
      </div>
      <div className={styles.previewColor} style={{ backgroundColor: tinycolor(color).toRgbString() }} />
    </div>
  );
};

const InputHexField = ({
  label = 'Hex',
  id,
  value,
  onChange,
}: {
  label?: string;
  id: string;
  value: string;
  onChange: InputProps['onChange'];
}) => {
  const styles = useStyles();
  return (
    <div className={styles.colorFieldWrapper}>
      <Label htmlFor={id}>{label}</Label>
      <Input className={styles.input} value={value} id={id} onChange={onChange} onBlur={handleOnBlur} />
    </div>
  );
};

interface InputRgbFieldProps {
  value: number;
  label: string;
  name: RgbKey;
  onChange?: (event: SpinButtonChangeEvent, data: SpinButtonOnChangeData & { name: string }) => void;
}

const InputRgbField = ({ value, onChange, label, name }: InputRgbFieldProps) => {
  const id = useId(`${label.toLowerCase()}-input`);
  const styles = useStyles();

  const handleChange = React.useCallback(
    (event: SpinButtonChangeEvent, data: SpinButtonOnChangeData) => {
      const val = data.value ?? parseFloat(data.displayValue ?? '');

      if (val === null || Number.isNaN(val) || !NUMBER_REGEX.test(val.toString())) {
        return;
      }

      if (onChange) {
        onChange(event, { ...data, value: val, name });
      }
    },
    [name, onChange],
  );

  return (
    <div className={styles.colorFieldWrapper}>
      <Label htmlFor={id}>{label}</Label>
      <SpinButton
        className={styles.spinButton}
        min={0}
        max={255}
        value={value}
        id={id}
        onChange={handleChange}
        name={name}
      />
    </div>
  );
};

const InputAlphaField = ({
  label = 'Alpha',
  value,
  onChange,
  id,
}: {
  value: number;
  label?: string;
  onChange?: SpinButtonProps['onChange'];
  id: string;
}) => {
  const styles = useStyles();

  return (
    <div className={styles.colorFieldWrapper}>
      <Label htmlFor={id}>{label}</Label>
      <SpinButton min={0} max={1} className={styles.spinButton} value={value} step={0.01} onChange={onChange} id={id} />
    </div>
  );
};

const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  const value = tinycolor(e.target.value);
  if (!value.isValid) {
    e.target.setAttribute('aria-invalid', 'true');
  } else {
    e.target.removeAttribute('aria-invalid');
  }
};
```

### AlphaSliderDefault

```tsx
import * as React from 'react';
import type { JSXElement, AlphaSliderProps } from '@fluentui/react-components';
import { tinycolor } from '@ctrl/tinycolor';
import { Button, makeStyles, AlphaSlider } from '@fluentui/react-components';

export const AlphaSliderDefault = (props: Partial<AlphaSliderProps>): JSXElement => {
  const styles = useStyles();

  const [color, setColor] = React.useState(COLOR);
  const [transparancyColor, setTransparancyColor] = React.useState(COLOR);
  const [value, setValue] = React.useState(COLOR.a * 100);
  const onSliderChange: AlphaSliderProps['onChange'] = (_, data) => {
    const alpha = data.color.a ?? 1;
    setColor({ ...data.color, a: alpha });
    setValue(alpha * 100);
  };
  const onTransparancySliderChange: AlphaSliderProps['onChange'] = (_, data) =>
    setTransparancyColor({ ...data.color, a: data.color.a ?? 1 });
  const resetSlider = () => setColor(COLOR);
  const resetTransparencySlider = () => setTransparancyColor(COLOR);

  return (
    <div className={styles.example}>
      <AlphaSlider color={color} onChange={onSliderChange} aria-valuetext={`${value}%`} aria-label="Alpha" {...props} />
      <AlphaSlider
        color={color}
        onChange={onSliderChange}
        aria-valuetext={`${value}%`}
        aria-label="Vertical alpha"
        vertical
        {...props}
      />
      <div className={styles.previewColor} style={{ backgroundColor: tinycolor(color).toRgbString() }} />
      <Button onClick={resetSlider}>Reset</Button>
      <h3>Transparency</h3>
      <AlphaSlider
        color={transparancyColor}
        onChange={onTransparancySliderChange}
        aria-valuetext={`${value}%`}
        aria-label="Alpha"
        transparency
        {...props}
      />
      <AlphaSlider
        color={transparancyColor}
        onChange={onTransparancySliderChange}
        aria-valuetext={`${value}%`}
        aria-label="Vertical alpha"
        transparency
        vertical
        {...props}
      />
      <div className={styles.previewColor} style={{ backgroundColor: tinycolor(transparancyColor).toRgbString() }} />
      <Button onClick={resetTransparencySlider}>Reset</Button>
    </div>
  );
};

AlphaSliderDefault.parameters = {
  docs: {
    description: {
      story: 'The `AlphaSlider` allows users to change the alpha channel of a color value.',
    },
  },
};
```

### ColorAndSwatchPicker

```tsx
import * as React from 'react';
import type { JSXElement, ColorPickerProps } from '@fluentui/react-components';
import { tinycolor } from '@ctrl/tinycolor';
import type { SwatchPickerOnSelectEventHandler } from '@fluentui/react-components';

export const ColorAndSwatchPicker = (): JSXElement => {
  const styles = useStyles();
  const [color, setColor] = React.useState(DEFAULT_COLOR_HSV);
  const [selectedValue, setSelectedValue] = React.useState(DEFAULT_SELECTED_VALUE);
  const [selectedColor, setSelectedColor] = React.useState(DEFAULT_SELECTED_COLOR);

  const colorFocusTargetRef = React.useRef<HTMLButtonElement>(null);
  const [colorFocusTarget, setColorFocusTarget] = React.useState<string | null>(null);

  const [items, setItems] = React.useState<Array<{ color: string; value: string; 'aria-label': string }>>([]);
  const emptyItems = new Array(ITEMS_LIMIT - items.length).fill(null);

  const handleChange: ColorPickerProps['onColorChange'] = (_, data) => {
    setColor({ ...data.color, a: data.color.a ?? 1 });
  };

  const handleSelect: SwatchPickerOnSelectEventHandler = (_, data) => {
    setSelectedValue(data.selectedValue);
    setSelectedColor(data.selectedSwatch);
  };

  const handleAddColor = () => {
    const newColor = tinycolor(color).toRgbString();
    const newValue = `custom-${newColor} [${items.length - ITEMS_LIMIT}]`;

    setItems([...items, { color: newColor, value: newValue, 'aria-label': newColor }]);
    setColorFocusTarget(newValue);
  };

  const resetColors = () => {
    setItems([]);
    setColorFocusTarget(null);
    setSelectedValue(DEFAULT_SELECTED_VALUE);
    setSelectedColor(DEFAULT_SELECTED_COLOR);
    setColor(DEFAULT_COLOR_HSV);
  };

  React.useEffect(() => {
    if (colorFocusTarget) {
      colorFocusTargetRef.current?.focus();
    }
  }, [colorFocusTarget]);

  return (
    <div className={styles.example}>
      <ColorPicker color={color} onColorChange={handleChange}>
        <ColorArea inputX={{ 'aria-label': 'Saturation' }} inputY={{ 'aria-label': 'Brightness' }} />
        <div className={styles.row}>
          <div className={styles.sliders}>
            <ColorSlider aria-label="Hue" />
            <AlphaSlider aria-label="Alpha" />
          </div>
          <div className={styles.previewColor} style={{ backgroundColor: tinycolor(color).toRgbString() }} />
        </div>
      </ColorPicker>
      <SwatchPicker
        aria-label="SwatchPicker with empty swatches"
        selectedValue={selectedValue}
        onSelectionChange={handleSelect}
        shape="rounded"
      >
        {items.map(item => (
          <ColorSwatch key={item.value} ref={item.value === colorFocusTarget ? colorFocusTargetRef : null} {...item} />
        ))}
        {emptyItems.map((_, index) => (
          <EmptySwatch disabled key={index} aria-label="empty swatch" />
        ))}
      </SwatchPicker>
      <Label>Selected color</Label>
      <div className={styles.previewColor} style={{ backgroundColor: selectedColor }} />
      <Button
        id="add-new-color"
        className={styles.button}
        appearance="primary"
        disabled={items.length >= ITEMS_LIMIT}
        onClick={handleAddColor}
      >
        Add new color
      </Button>
      <Button id="reset-example" className={styles.button} onClick={resetColors}>
        Reset example
      </Button>
    </div>
  );
};
```

## Best Practices

### Do's

- Keep the selection in your own React state and feed it back through the color prop on every change reported by onColorChange, because the picker will not move its thumbs unless the parent supplies a new HsvColor.
- Normalize alpha defensively when receiving an update, falling back to a value of 1 when the reported alpha is undefined, so the stored color always has a complete set of channels.
- Compose the picker's children deliberately — typically a ColorArea for saturation and brightness, a ColorSlider for hue, and an AlphaSlider for opacity — so every sub-control operates against the same shared selection.
- Give every sub-control an accessible name, such as Saturation and Brightness for the two axes of the color area, and Hue and Alpha for the sliders, since these controls have no visible text labels of their own.
- Supply aria-valuetext on the sliders and color area axes with a human-readable description of the value, for example the hue in degrees followed by the nearest named color, because raw numeric channel values are hard to interpret when announced.
- Choose the shape value that matches the surrounding surface, using the default rounded appearance inside rounded cards and dialogs and square when the picker sits next to square-cornered inputs or toolbars.
- When embedding the picker in a Popover, drive the popover's open state yourself and stage edits in a temporary color so that a confirmation action commits the value and a cancel action discards it.
- Validate color text entry before accepting it — check that a hex string matches the expected pattern and that the parsed color is valid — and surface rejection through aria-invalid rather than silently overwriting the field.
- Provide a visual preview element next to the controls and pair it with a text representation of the current color so the selection is verifiable without relying on color perception alone.

### Don'ts

- Don't render ColorPicker as a standalone element with no children; without ColorArea, ColorSlider, or AlphaSlider inside it there is nothing for the user to manipulate and no visual output.
- Don't treat the picker as uncontrolled and skip onColorChange; the displayed color is driven entirely by the color prop, so ignoring the callback freezes the UI on the initial value.
- Don't mutate the HsvColor object you pass in; always build a new object from the values reported by the callback so React can detect the change and re-render the sub-controls.
- Don't omit aria-label on the color area's two axes or on the individual sliders, because screen reader users will otherwise hear unlabeled sliders with no indication of which channel they are adjusting.
- Don't run expensive or asynchronous work directly inside onColorChange, since the callback fires continuously while a thumb is dragged.
- Don't drop the alpha channel when the design does not need transparency; if opacity is irrelevant, omit the AlphaSlider entirely rather than showing a control that has no effect on the final value.
- Don't use ColorPicker where a small fixed set of colors would do; a SwatchPicker or Select communicates a bounded choice far more efficiently and reduces the risk of off-brand values.
- Don't apply the square or rounded shape to the parent expecting it to restyle the root alone; the shape governs the rounding of the picker's sub-components through their shared styling context.
- Don't expose an editable hex or RGB field without a validation and error state, or users will be able to enter values that cannot be parsed into a color.
- Don't hide the only affordance for a color behind a popover that traps focus without an explicit confirmation path, or keyboard users can end up in a dead end.

## Anti-Patterns

### Standalone picker with no controls

❌ Rendering ColorPicker without any sub-components produces an empty region: there is no surface to drag, no slider to nudge, and nothing that can emit a color, so the user is left with an inert container.

✅ Always compose at least one interactive child, such as a ColorArea plus a ColorSlider, and add an AlphaSlider only when transparency is part of the design.

### Fire-and-forget state updates

❌ Ignoring the change callback or writing the incoming color into a local variable rather than state breaks the controlled contract: the thumbs snap back to the last value supplied through the color prop, and the picker appears frozen.

✅ Store the color in React state, update it from the change callback on every invocation, and pass that same state value back through the color prop.

### Undefined alpha leaking into stored colors

❌ The reported color may omit the alpha channel, so copying it straight into state can leave an incomplete color that renders incorrectly or produces unexpected results when it is converted to other formats.

✅ Spread the reported color and normalize alpha to 1 when it is undefined before saving it, as the documentation examples do.

### Unlabeled sliders and axes

❌ The color area exposes two sliders and the sliders expose one each; without names, screen reader users hear generic sliders with no idea which channel they are changing.

✅ Put an aria-label on the horizontal and vertical color area inputs, such as Saturation and Brightness, and on each slider, such as Hue and Alpha, then enrich the experience with aria-valuetext that describes the value in human terms.

### Heavy work in the change handler

❌ The change callback fires on every pointer movement during a drag, so conversions, formatting, logging, or network calls performed inline cause dropped frames and a sluggish picker.

✅ Keep the handler to a minimal state update, derive display values like hex or RGB outside the drag path or memoize them, and defer any expensive work until the interaction settles.

### Using a picker for a fixed palette

❌ Presenting a full color canvas when the design only permits a handful of approved colors invites off-brand selections and adds unnecessary interaction cost.

✅ Use a SwatchPicker of preset colors for bounded choices, and reserve the full picker for cases where any color is legitimately allowed.

## Accessibility

**Requirements**: The picker is a group of slider-like widgets rather than a single input, so each interactive child must carry its own accessible name and its own value semantics. Every color area axis and every slider must be reachable by keyboard and must expose a label, a current numeric value, and — where a number is not self-explanatory — a descriptive text value. Color must never be the sole carrier of meaning: pair the interactive surface with a text representation of the selected color and mark invalid text input with aria-invalid. Target the WCAG 2.1 AA expectations for name, role, and value on custom widgets, keyboard operability, focus visibility, and non-text contrast; the focus ring drawn on the picker's sub-components must remain perceptible against both light and dark surfaces and against the arbitrary colors the user selects. If the picker is opened from a trigger, the hosting surface must return focus to the trigger on close.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the picker and forward through each sub-control, such as the two color area axes, the hue slider, the alpha slider, and any header or footer buttons. |
| `Shift+Tab` | Moves focus backward out of the picker and through the preceding sub-controls. |
| `ArrowLeft / ArrowRight` | Adjusts the focused slider or the horizontal axis of the color area, changing one channel of the color and firing the change callback. |
| `ArrowUp / ArrowDown` | Adjusts the focused slider or the vertical axis of the color area, changing one channel of the color and firing the change callback. |
| `Home` | Jumps the focused slider or color area axis to its minimum value. |
| `End` | Jumps the focused slider or color area axis to its maximum value. |
| `PageUp / PageDown` | Moves the focused slider in larger increments for coarse adjustments of hue, saturation, brightness, or alpha. |
| `Enter / Space` | Activates buttons and color swatches, such as confirming or cancelling a picker shown in a popover, or selecting a saved swatch. |
| `Escape` | Dismisses a popover or dialog that contains the picker, returning focus to the element that opened it. |

**ARIA**: aria-label, aria-valuetext, aria-roledescription, aria-invalid, aria-label on the picker container or a sibling Label associated with it

**Screen Reader**: The ColorPicker root is a container, not an interactive widget, so nothing is announced when focus passes over it unless you give it an accessible name. As the user tabs, each sub-control is announced by its role — the color area's two thumbs announce as sliders with a two-dimensional slider role description, and the hue and alpha controls announce as sliders — followed by the label you supplied, its current position, and, when provided, the aria-valuetext description such as a hue in degrees plus the closest named color. Because color changes are visual, the announcement relies entirely on the values you supply through aria-label and aria-valuetext; a chosen color should therefore also be rendered as text or paired with a Label so it can be reviewed on demand. Hex text entry that fails validation is announced as invalid through aria-invalid, and disabled swatches are skipped by focus traversal.

## Styling

Style the picker and its sub-components with makeStyles and Griffel tokens rather than ad-hoc colors so the chrome tracks the theme. Use tokens.colorNeutralStroke1 for the outlines of the color area and sliders, tokens.colorStrokeFocus2 for focus indicators on custom-wrapped children, and tokens.colorNeutralBackground1 for the surrounding container so the picker sits cleanly on neutral surfaces. Corner rounding comes from the shape prop, which corresponds to theme radii such as tokens.borderRadiusMedium for the rounded default and a square radius when shape is square; if you need to fine-tune it, override the child component's border radius through a class rather than fighting the prop. Spacing between stacked sub-controls and their preview swatch is handled well with tokens.spacingVerticalS and tokens.spacingVerticalM, and horizontal gap between a slider column and a preview reads nicely with tokens.spacingHorizontalL. Preview swatches are typically plain elements whose backgroundColor is set from the selected color, so give them their own fixed size and a neutral border such as tokens.colorNeutralStroke1 plus tokens.borderRadiusMedium to keep the preview readable against any page background. Label the picker's sub-cases with Text or Label using tokens.colorNeutralForeground1, and rely on tokens.shadow4-level elevation on the hosting popover surface so the picker separates from the page.

## Performance

Every sub-control inside the picker is driven by the same color value, so a single change callback re-renders the color area, the sliders, and any preview or text fields in one commit. Two things matter most. First, the callback fires at pointer-move frequency during a drag; keep the handler to one state update and avoid synchronous conversions or side effects. Second, avoid splitting the color across many independent pieces of state derived in the same handler — the reference examples update hex, RGB, alpha, and the HSV color together, which multiplies renders; grouping derived values behind a single state object or memoizing them reduces that cost. Memoize change handlers so child components do not re-create callbacks each render, and consider hosting the picker inside a Popover so the gradient canvases are mounted only while the user is actively choosing a color. Also prefer keeping the picker mounted and stable across parent re-renders; remounting resets internal focus and drag state.

## Theming & Tokens

The picker's chrome is fully theme-aware while the selected color itself is data, not a theme token. Sub-component outlines and separators resolve to tokens.colorNeutralStroke1, focus rings to tokens.colorStrokeFocus2, and the surrounding surface to tokens.colorNeutralBackground1, so the control reads correctly in both light and dark themes. Corner rounding is expressed through theme radii — the rounded default aligns with tokens.borderRadiusMedium and its child radii, while the square setting removes that rounding — so changing shape alone keeps the picker consistent with the active theme. Text labels around the picker should use tokens.colorNeutralForeground1 and secondary descriptions tokens.colorNeutralForeground2, and spacing should come from tokens.spacingHorizontalM, tokens.spacingVerticalS, and their siblings. Any custom preview swatch you build should use tokens.colorNeutralStroke1 as its border and the container's neutral background token behind it, since the swatch fill is a literal color value supplied by the user and will not respond to theme changes.

## Migration Notes

The v9 ColorPicker is deliberately minimal and compositional: it exposes only color, onColorChange, and shape, and it is expected to wrap child controls such as ColorArea, ColorSlider, and AlphaSlider that read from the same color context. This differs from older picker experiences that bundled previews, channel sliders, and text fields into a single monolithic prop surface. When moving to v9, plan for (1) a controlled data flow, where you own an HsvColor in state and update it from the change callback, (2) explicit child composition, since previously implicit sliders and previews are now assembled from the exported sub-components, and (3) building any hex or RGB text entry yourself with Input, SpinButton, and Label, validating user input before applying it to the shared color value. Because the shape prop propagates to the sub-components, adopt it once on the parent instead of styling each child individually.

## Edge Cases

- The color reported by the change callback may have an undefined alpha channel; normalize it to 1 before storing so downstream conversions and previews behave predictably.
- Hue is cyclical and unstable at the extremes: saturation or brightness of zero makes hue meaningless, and a hue of 360 and a hue of 0 describe the same color, so avoid depending on an exact hue value for equality checks.
- The shape prop affects the children rather than producing a visual difference on an empty root, so a picker with no sub-components appears to ignore shape entirely.
- A fully transparent selection (alpha of 0) produces a preview that appears empty; make sure the preview area has a neutral background and border so the user can tell that a color is still selected.
- Free-text hex or RGB entry can produce unparseable values; validate both the string shape and the parsed result, keep the last valid value, and mark the field invalid with aria-invalid instead of accepting or silently discarding the entry.
- Because the picker is controlled, any parent re-render that passes a stale or reconstructed color object will visually snap the thumb positions; derive the color from a single source of truth.
- When the picker lives inside a popover, the staged color and the committed color diverge until confirmation — keep them in separate state so cancelling genuinely reverts the selection, and ensure focus returns to the trigger.
- Vertical sliders change the interaction axis but keep the same underlying channel semantics, so arrow-key expectations and aria-valuetext should still describe the channel rather than the orientation.

## See Also

- - [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
