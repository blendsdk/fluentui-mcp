# ColorPicker

> **Package**: `@fluentui/react-color-picker` v9.2.17
> **Import**: `import { ColorPicker } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

ColorPicker is a composition container in @fluentui/react-components that turns a set of color input sub-components — ColorArea, ColorSlider, and AlphaSlider, supplied as children — into a single coordinated HSB color editing surface. The component itself holds no internal color state: it receives the current value through the color prop as an HsvColor and reports every user edit back through onColorChange, so the application stays the single source of truth for the selected color. Because the visible picker is assembled entirely from its children, the same ColorPicker can render as a bare hue slider, a full saturation/brightness area with hue and alpha sliders, a swatch-plus-slider combination, or a preview-driven popup hosted inside a Popover surface that only commits on confirmation. The shape prop propagates a corner radius treatment to the sub-components (rounded by default, square for dense or grid-aligned layouts), and the root slot is the only required slot, so a ColorPicker with no children renders an empty container. Typical supporting pieces in real usages include Label, Input, SpinButton, Button, and SwatchPicker for hex/RGB/alpha entry, reset actions, and reusable palettes.

**When to use**: Use ColorPicker when users need to choose an arbitrary value from the full color space rather than pick from a predefined set of brand colors, because only the free-form picker exposes saturation, brightness, hue, and alpha as continuously adjustable channels. Reach for SwatchPicker or ColorSwatch when a curated, bounded palette is sufficient and you want the fastest possible selection with guaranteed on-brand results. Choose an inline ColorPicker (rendered directly in a settings panel, theme editor, or form) when color selection is a primary task on the page; choose a Popover-hosted ColorPicker when the trigger should stay compact and the user should be able to preview a color and either confirm or cancel it. Because this component is a low-level building block with no built-in text entry or preview, pair it with Input or SpinButton fields when users must be able to type an exact hex, RGB, or alpha value, and with ColorSwatch or a color preview element when they need to see the resolved color. Avoid it as a replacement for a themed color-token picker in product settings where only design-system tokens are valid choices.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `color` | `HsvColor \| undefined` | — | No | Selected color. |
| `onColorChange` | `EventHandler<ColorPickerOnChangeData> \| undefined` | — | No | Callback for when the user changes the color. |
| `shape` | `"rounded" \| "square" \| undefined` | — | No | ColorPicker shape |

### Prop Guidance

- **color**: The single source of truth for the picker. Pass a controlled HsvColor value (hue, saturation, value, and optional alpha) from your own state, because the component never stores or derives color internally. Two pickers sharing the same value will track each other automatically, and omitting the prop leaves the children without a defined position until you supply one. `{ h: 210, s: 0.6, v: 0.9, a: 1 }`
- **onColorChange**: The only channel for user edits. It fires with a ColorPickerOnChangeData payload whenever a child input changes, and it fires continuously during a drag in ColorArea or a slider, so keep the handler cheap: update state, normalize alpha, and defer persistence. Always read the color from the event data rather than from the color prop, since the prop may not have re-rendered yet when the callback runs. `data.color`
- **shape**: Controls the corner radius treatment propagated to the ColorArea, ColorSlider, and AlphaSlider children rather than to the root wrapper. Use the default rounded to match standard Fluent controls, and square for dense surfaces, grid-aligned panels, or when the picker sits inside an already-squared container. Set it once on ColorPicker instead of styling children individually so all channels stay visually consistent. `square`
- **children**: The picker has no visual parts of its own, so the children you pass define everything the user sees and touches. Typical compositions place a ColorArea for saturation and brightness, a ColorSlider for hue, and an AlphaSlider for transparency, optionally with a preview element and Labels. Render at least one interactive child, and keep the same set of children mounted between renders so focus is not lost mid-interaction. `ColorArea, ColorSlider, AlphaSlider`

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

- Keep the component fully controlled: always pass the current HsvColor through the color prop and update it inside the onColorChange handler, since ColorPicker keeps no internal color state of its own.
- Normalize the alpha channel before storing the value, for example by coalescing data.color.a to 1 when it is undefined, so downstream hex/RGB string conversion never produces an invalid color.
- Always render at least one color input as a child (ColorArea, ColorSlider, or AlphaSlider); a ColorPicker with no children produces an empty root element that gives users nothing to interact with.
- Give every child input a distinct accessible name — saturation and brightness for the two ColorArea axes, hue for ColorSlider, alpha for AlphaSlider — because the gradient background carries no information for assistive technology.
- Pair the picker with a visible color preview and, where space allows, a textual representation such as hex or RGB so the chosen value is not communicated by color alone.
- Use the shape prop once on the ColorPicker rather than styling individual children, so the ColorArea, ColorSlider, and AlphaSlider all share the same corner radius treatment as the surrounding UI.
- When embedding the picker in a Popover, keep a separate preview color in state and only copy it into the committed color when the user confirms; use the Popover trapFocus behavior so keyboard users stay inside the surface.
- Provide a reset control (a Button that restores the default HsvColor) in editor-style usages, since an HSB picker makes it easy to drift far from the original color.

### Don'ts

- Don't mutate the object passed to color in place; onColorChange already delivers a new color payload, so build a new state value instead of assigning into the existing one.
- Don't assume onColorChange always reports an alpha value — the HsvColor alpha may be undefined, and storing it verbatim breaks alpha sliders and RGB string output.
- Don't rely on the picker alone to communicate the selected color; users with color vision deficiencies or monochrome displays cannot read the result from a gradient.
- Don't put expensive work — network calls, persistence, or repeated tinycolor conversions and re-mapping — directly in onColorChange, because it fires continuously while the user drags inside ColorArea or a slider.
- Don't nest multiple ColorPicker instances that share one piece of color state without a single owner; competing states produce jumpy thumbs and inconsistent previews.
- Don't strip the aria-label from child inputs to save space; an unnamed slider or 2D control is unusable with a screen reader.
- Don't attempt to fix layout clipping by resizing the picker itself; when it lives in a scrolling or overflow-hidden container, host it in a Popover surface instead.
- Don't treat ColorPicker as a text field — it has no built-in hex or RGB entry, so expecting typed input without pairing it with Input or SpinButton leads to broken flows.

## Anti-Patterns

### Uncontrolled color state

❌ Treating color and onColorChange as optional and letting the picker appear to work without updating state leaves the thumbs and gradients frozen after the first interaction, because ColorPicker never owns the selected value.

✅ Hold the HsvColor in component state, pass it through the color prop on every render, and write the new payload back inside onColorChange.

### Leaking an undefined alpha channel

❌ Storing the incoming color object verbatim lets an undefined alpha reach the AlphaSlider and any hex or RGB string conversion, which produces transparent or malformed output and a slider stuck at zero.

✅ Coalesce the alpha before storing, using a fallback of 1 when data.color.a is undefined, and re-derive hex and RGB from the normalized value.

### Unlabeled gradient inputs

❌ A ColorArea or ColorSlider rendered without aria-label and aria-valuetext is announced as an unnamed slider with a bare numeric value, so screen reader users cannot tell which channel they are changing.

✅ Label each channel (Saturation, Brightness, Hue, Alpha), add aria-roledescription on the two-dimensional area, and supply aria-valuetext that speaks the value in meaningful units, optionally with a color name.

### Expensive work inside onColorChange

❌ Because the callback fires on every pointer move while dragging, doing network persistence, large list re-mapping, or repeated color conversions inside it causes dropped frames and a sluggish drag.

✅ Keep the handler to a minimal state update, derive hex/RGB values with memoization, and debounce or commit persistence work on pointer release or on an explicit confirm action.

### Committing live inside a popover

❌ Writing every onColorChange straight into the committed application color makes a cancel action meaningless, since the surrounding UI has already changed by the time the user dismisses the popup.

✅ Maintain a separate preview color for the popover-hosted picker and copy it into the committed color only when the user confirms; restore or discard on cancel and Escape.

### Color as the only signal of the selection

❌ Relying on the gradient and a colored chip to convey the chosen value excludes users with color vision deficiencies and anyone using a monochrome or high-contrast display.

✅ Show the selection in text form as well, such as a hex value, an RGB triple, or a channel readout, and keep that text synchronized with the color state.

## Accessibility

**Requirements**: The composed picker must satisfy WCAG 2.1 Level AA: content must be operable from the keyboard alone (2.1.1), every focusable channel must have a visible focus indicator (2.4.7), each input must expose a name, role, and value (4.1.2), and color must never be the only visual means of conveying the selected value (1.4.1). Because the picker is built from custom slider-like inputs rather than native range elements, the accessible name and the spoken value must be provided explicitly on each child (ColorArea, ColorSlider, AlphaSlider) through aria-label and aria-valuetext; the 2D ColorArea needs aria-roledescription to explain that it is a two-dimensional control. Text fields used alongside the picker for hex or RGB entry should mark invalid input with aria-invalid so the error is announced rather than only colored.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the ColorPicker's root and then through each child input and any adjacent controls in document order. |
| `Shift+Tab` | Moves focus backwards out of the picker or to the previous child input. |
| `ArrowLeft` | Decreases the focused channel value in ColorArea, ColorSlider, or AlphaSlider (for a vertical slider, moves along the vertical axis). |
| `ArrowRight` | Increases the focused channel value in ColorArea, ColorSlider, or AlphaSlider. |
| `ArrowUp` | Increases the focused channel value; on the ColorArea value (brightness) axis this raises brightness. |
| `ArrowDown` | Decreases the focused channel value; on the ColorArea value (brightness) axis this lowers brightness. |
| `Home` | Jumps the focused channel to its minimum (for example alpha 0 or saturation 0). |
| `End` | Jumps the focused channel to its maximum (for example alpha 1 or saturation 1). |
| `Page Up` | Increases the focused channel in larger increments for coarse adjustments. |
| `Page Down` | Decreases the focused channel in larger increments for coarse adjustments. |
| `Enter or Space` | Activates adjacent buttons in the same flow, such as the confirm, cancel, or reset Button placed next to the picker. |
| `Escape` | Closes the hosting Popover when the picker is presented as a popup, dismissing without committing the preview color. |

**ARIA**: aria-label on each child input (ColorArea inputX and inputY, ColorSlider, AlphaSlider) to give the channel an accessible name such as Saturation, Brightness, Hue, or Alpha, aria-valuetext on child inputs and on text fields to speak a human-readable value such as a hue in degrees, a percentage, or a color name instead of a raw number, aria-roledescription set to a value such as 2D slider on the ColorArea axes to explain the two-dimensional interaction model, aria-invalid on hex or RGB text inputs that accompany the picker when the typed value cannot be parsed

**Screen Reader**: Screen readers do not announce the ColorPicker container itself as an interactive widget; it is a grouping element whose children are the real controls. Each child input is exposed as a slider with its own accessible name, current value, and minimum/maximum, so a user hears something like Saturation, 2D slider, 100 percent, adjustable. Because the gradient itself is purely visual, the spoken experience depends entirely on the labels and aria-valuetext you provide, which is why a value such as Saturation 80, Brightness 40, blue is far more useful than a bare number. When the picker is hosted in a Popover, focus is trapped inside the surface and returns to the trigger on close, and any adjacent confirm, cancel, or reset buttons are announced as ordinary buttons with their own labels.

## Styling

ColorPicker intentionally ships almost no visual surface of its own — styling work usually targets the root container and the children. Use makeStyles with tokens.spacingHorizontalS, tokens.spacingHorizontalM, tokens.spacingVerticalS, and tokens.spacingVerticalM to lay out the ColorArea, the stacked ColorSlider and AlphaSlider group, and the color preview side by side, and give the preview element a fixed size with a border from tokens.colorNeutralStroke1 or tokens.colorNeutralStroke2 so very light or fully transparent colors remain visible. The shape prop is the sanctioned way to control corner radius: the default rounded applies radius tokens such as tokens.borderRadiusMedium to the sub-components, while square flattens them to tokens.borderRadiusNone for dense, grid-aligned surfaces. When embedding the picker in a PopoverSurface, keep the surface on tokens.colorNeutralBackground1 with tokens.shadow4 and separate the confirm/cancel row with tokens.spacingVerticalS. Focus visibility comes from the sub-components' own focus styling (tokens.colorStrokeFocus2); avoid overriding it. If you need a larger hit area for touch, increase the wrapper padding with spacing tokens rather than scaling the child inputs, and use className on the root to constrain the overall picker width instead of setting widths on each child.

## Performance

ColorPicker itself is a thin state-passing container, so its cost is dominated by its children and by the frequency of onColorChange. That callback fires continuously while the user drags within ColorArea or a slider, which means every state update you make in it re-renders the picker and everything around it. Isolate the color state in the smallest possible component, derive display strings (hex, RGB, color names) with memoized conversions rather than recomputing them on each render, and avoid placing the picker inside a large list or table row that re-renders expensively. Prefer keeping the picker mounted across open/close cycles when it lives in a Popover surface if you observe remount cost, and prefer it hosted in a portal-based Popover rather than inline inside scroll containers so the browser does not repaint clipped gradients during scroll. No measurement or ResizeObserver cost is incurred by the ColorPicker root, but each alpha and hue slider paints a gradient, so avoid rendering many pickers simultaneously on one screen.

## Theming & Tokens

ColorPicker does not paint its own surfaces, so theming flows to it through FluentProvider and through the child color inputs, which read tokens such as tokens.colorNeutralBackground1 for their track and thumb surfaces, tokens.colorNeutralStroke1 and tokens.colorNeutralStroke2 for borders and the alpha checkerboard edges, and tokens.colorStrokeFocus2 for the visible focus indicator. Corner radius comes from tokens.borderRadiusMedium (and related radius tokens) when shape is rounded, and collapses to tokens.borderRadiusNone when shape is square, so a fully de-rounded theme still honors square. Spacing around the composed controls typically uses tokens.spacingHorizontalS, tokens.spacingHorizontalM, tokens.spacingVerticalS, and tokens.spacingVerticalM, and any PopoverSurface hosting the picker uses tokens.colorNeutralBackground1 with tokens.shadow4. Text rendered beside the picker, such as Labels and value readouts, should use tokens.colorNeutralForeground1 and tokens.colorNeutralForeground3 so it adapts to high-contrast themes.

## Migration Notes

ColorPicker in v9 is a compositional, fully controlled container rather than a self-contained picker: it renders only the children you give it (ColorArea, ColorSlider, AlphaSlider) and coordinates them through the color and onColorChange pair. If you are porting code from an older monolithic color picker API, expect to supply the layout, the text-entry fields, the preview swatch, and any confirm/cancel flow yourself, and expect to normalize the alpha channel on every change because HsvColor alpha may arrive undefined. The component is not deprecated and has no deprecated props; shape replaces per-child radius styling, and there is no built-in popover behavior — compose Popover with a trigger and a surface when you need the popup presentation.

## Edge Cases

- The alpha channel of an HsvColor received from onColorChange can be undefined, so any code that interpolates it into an alpha slider value or an RGB string must coalesce it to 1 first.
- A ColorPicker rendered with no children produces an empty root element; the required root slot gives you a container but no controls, so at least one interactive child must always be composed.
- Shape affects only the border radius of the child inputs, not the layout or the wrapper, so a square picker still needs explicit spacing and width styling from the host layout.
- Hue is a cyclic channel: values wrap at the ends of the hue range, so code that compares stored hue values for equality can report a change even though the visible color is identical.
- Custom swatches added to a companion SwatchPicker must use stable, unique value strings as keys, because duplicate or index-based values cause focus to jump to the wrong swatch after the palette is rebuilt.
- Inside an overflow-hidden or scrollable container, inline-rendered gradient sliders can be clipped or repainted during scroll; hosting the picker in a Popover surface avoids the clipping entirely.
- HsvColor is not directly printable, so any user-facing text readout requires conversion through a color utility; keep that conversion memoized because it runs alongside high-frequency change events.
- When two ColorPicker instances are bound to the same color state, both re-render on every drag event; if the second one is expensive, decouple it or present it only on demand.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
