# ColorPicker

> **Component**: `ColorPicker`, `ColorArea`, `ColorSlider`, `AlphaSlider`
> **Package**: `@fluentui/react-components` (from `@fluentui/react-color-picker`)

## Overview

ColorPicker provides components for selecting colors using various controls: a 2D color area for saturation/brightness, sliders for hue and alpha channels. These components work together to provide a complete color selection experience.

## Import

```typescript
import {
  ColorPicker,
  ColorArea,
  ColorSlider,
  AlphaSlider,
  colorPickerClassNames,
  colorAreaClassNames,
  colorSliderClassNames,
  alphaSliderClassNames,
} from '@fluentui/react-components';
```

## Components

| Component | Description |
|-----------|-------------|
| `ColorPicker` | Container component that manages color state and provides context |
| `ColorArea` | 2D area for selecting saturation (x-axis) and brightness/value (y-axis) |
| `ColorSlider` | Slider for hue, saturation, or value channels |
| `AlphaSlider` | Slider specifically for alpha (transparency) channel |

---

## Color Format (HSV)

FluentUI ColorPicker uses HSV (Hue, Saturation, Value) color model:

```typescript
type HsvColor = {
  h: number;  // Hue: 0-360 degrees
  s: number;  // Saturation: 0-1
  v: number;  // Value/Brightness: 0-1
  a?: number; // Alpha: 0-1 (optional)
};
```

### Color Conversion

Use a library like `@ctrl/tinycolor` for color conversions:

```tsx
import { tinycolor } from '@ctrl/tinycolor';

// HSV to HEX
const hex = tinycolor({ h: 200, s: 0.8, v: 0.9 }).toHexString(); // "#2eb8e6"

// HSV to RGB
const rgb = tinycolor({ h: 200, s: 0.8, v: 0.9 }).toRgb(); // { r: 46, g: 184, b: 230 }

// HEX to HSV
const hsv = tinycolor('#2eb8e6').toHsv(); // { h: 200, s: 0.8, v: 0.9 }
```

---

## Basic Usage

### Complete ColorPicker

```tsx
import { useState } from 'react';
import { tinycolor } from '@ctrl/tinycolor';
import {
  ColorPicker,
  ColorArea,
  ColorSlider,
  AlphaSlider,
  makeStyles,
} from '@fluentui/react-components';
import type { ColorPickerProps } from '@fluentui/react-components';

const useStyles = makeStyles({
  picker: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '300px',
  },
  preview: {
    width: '50px',
    height: '50px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
});

function BasicColorPicker() {
  const styles = useStyles();
  const [color, setColor] = useState({ h: 200, s: 0.8, v: 0.9, a: 1 });

  const handleChange: ColorPickerProps['onColorChange'] = (_, data) => {
    setColor({ ...data.color, a: data.color.a ?? 1 });
  };

  return (
    <div className={styles.picker}>
      <ColorPicker color={color} onColorChange={handleChange}>
        <ColorArea />
        <ColorSlider />
        <AlphaSlider />
      </ColorPicker>
      
      <div 
        className={styles.preview} 
        style={{ backgroundColor: tinycolor(color).toRgbString() }} 
      />
      <span>HEX: {tinycolor(color).toHexString()}</span>
    </div>
  );
}
```

---

## ColorPicker Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `HsvColor` | - | Current color value |
| `onColorChange` | `(event, data) => void` | - | Callback when color changes |
| `shape` | `'rounded' \| 'square'` | `'rounded'` | Shape of the picker controls |

---

## ColorArea Component

ColorArea is a 2D control for selecting saturation (x-axis) and brightness/value (y-axis). The hue is determined by the color prop.

### ColorArea Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `HsvColor` | - | Current color (controlled) |
| `defaultColor` | `HsvColor` | - | Default color (uncontrolled) |
| `onChange` | `(event, data) => void` | - | Callback when color changes |
| `shape` | `'rounded' \| 'square'` | `'rounded'` | Shape of the area |

### Standalone ColorArea

```tsx
import { useState } from 'react';
import { ColorArea } from '@fluentui/react-components';
import type { ColorAreaOnColorChangeData } from '@fluentui/react-components';

function StandaloneColorArea() {
  const [color, setColor] = useState({ h: 200, s: 0.5, v: 0.8 });

  const handleChange = (_: unknown, data: ColorAreaOnColorChangeData) => {
    setColor(data.color);
  };

  return (
    <ColorArea
      color={color}
      onChange={handleChange}
      inputX={{ 'aria-label': 'Saturation' }}
      inputY={{ 'aria-label': 'Brightness' }}
    />
  );
}
```

---

## ColorSlider Component

ColorSlider controls a single color channel (hue, saturation, or value).

### ColorSlider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `HsvColor` | - | Current color (controlled) |
| `defaultColor` | `HsvColor` | - | Default color (uncontrolled) |
| `onChange` | `(event, data) => void` | - | Callback when color changes |
| `channel` | `'hue' \| 'saturation' \| 'value'` | `'hue'` | Color channel to control |
| `vertical` | `boolean` | `false` | Render slider vertically |
| `shape` | `'rounded' \| 'square'` | `'rounded'` | Shape of the slider |

### Hue Slider (Default)

```tsx
import { useState } from 'react';
import { ColorSlider } from '@fluentui/react-components';

function HueSlider() {
  const [color, setColor] = useState({ h: 200, s: 1, v: 1 });

  return (
    <ColorSlider
      color={color}
      onChange={(_, data) => setColor(data.color)}
      aria-label="Hue"
    />
  );
}
```

### Different Channels

```tsx
import { useState } from 'react';
import { ColorSlider, makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  sliders: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '200px',
  },
});

function ChannelSliders() {
  const styles = useStyles();
  const [color, setColor] = useState({ h: 200, s: 0.8, v: 0.9 });

  return (
    <div className={styles.sliders}>
      <label>Hue</label>
      <ColorSlider
        channel="hue"
        color={color}
        onChange={(_, data) => setColor(data.color)}
        aria-label="Hue"
      />
      
      <label>Saturation</label>
      <ColorSlider
        channel="saturation"
        color={color}
        onChange={(_, data) => setColor(data.color)}
        aria-label="Saturation"
      />
      
      <label>Value/Brightness</label>
      <ColorSlider
        channel="value"
        color={color}
        onChange={(_, data) => setColor(data.color)}
        aria-label="Brightness"
      />
    </div>
  );
}
```

---

## AlphaSlider Component

AlphaSlider controls the alpha (transparency) channel.

### AlphaSlider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `HsvColor` | - | Current color (controlled) |
| `defaultColor` | `HsvColor` | - | Default color (uncontrolled) |
| `onChange` | `(event, data) => void` | - | Callback when color changes |
| `transparency` | `boolean` | `false` | Show as transparency (inverse of opacity) |
| `vertical` | `boolean` | `false` | Render slider vertically |
| `shape` | `'rounded' \| 'square'` | `'rounded'` | Shape of the slider |

### Basic Alpha Slider

```tsx
import { useState } from 'react';
import { AlphaSlider } from '@fluentui/react-components';

function BasicAlphaSlider() {
  const [color, setColor] = useState({ h: 200, s: 0.8, v: 0.9, a: 0.5 });

  return (
    <AlphaSlider
      color={color}
      onChange={(_, data) => setColor(data.color)}
      aria-label="Alpha"
    />
  );
}
```

### Transparency Mode

```tsx
import { AlphaSlider } from '@fluentui/react-components';

function TransparencySlider() {
  // In transparency mode, 30% transparency = 70% opacity
  return (
    <AlphaSlider
      transparency
      aria-label="Transparency"
    />
  );
}
```

---

## Complete Example with Input Fields

```tsx
import { useState, useCallback } from 'react';
import { tinycolor } from '@ctrl/tinycolor';
import {
  ColorPicker,
  ColorArea,
  ColorSlider,
  AlphaSlider,
  Input,
  Label,
  SpinButton,
  makeStyles,
  useId,
} from '@fluentui/react-components';
import type { ColorPickerProps } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '300px',
  },
  inputs: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-end',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  preview: {
    width: '50px',
    height: '50px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
});

function ColorPickerWithInputs() {
  const styles = useStyles();
  const hexId = useId('hex-input');
  
  const [color, setColor] = useState({ h: 109, s: 1, v: 0.9, a: 1 });
  const [hex, setHex] = useState(tinycolor(color).toHexString());
  const [rgb, setRgb] = useState(tinycolor(color).toRgb());

  const handleColorChange: ColorPickerProps['onColorChange'] = (_, data) => {
    setColor({ ...data.color, a: data.color.a ?? 1 });
    setHex(tinycolor(data.color).toHexString());
    setRgb(tinycolor(data.color).toRgb());
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHex(value);
    const newColor = tinycolor(value);
    if (newColor.isValid) {
      setColor(newColor.toHsv());
      setRgb(newColor.toRgb());
    }
  };

  return (
    <div className={styles.container}>
      <ColorPicker color={color} onColorChange={handleColorChange}>
        <ColorArea
          inputX={{ 'aria-label': 'Saturation' }}
          inputY={{ 'aria-label': 'Brightness' }}
        />
        <ColorSlider aria-label="Hue" />
        <AlphaSlider aria-label="Alpha" />
      </ColorPicker>
      
      <div className={styles.inputs}>
        <div className={styles.field}>
          <Label htmlFor={hexId}>Hex</Label>
          <Input
            id={hexId}
            value={hex}
            onChange={handleHexChange}
            style={{ width: '100px' }}
          />
        </div>
        
        <div className={styles.field}>
          <Label>R</Label>
          <SpinButton
            min={0}
            max={255}
            value={rgb.r}
            style={{ minWidth: '60px' }}
          />
        </div>
        
        <div className={styles.field}>
          <Label>G</Label>
          <SpinButton
            min={0}
            max={255}
            value={rgb.g}
            style={{ minWidth: '60px' }}
          />
        </div>
        
        <div className={styles.field}>
          <Label>B</Label>
          <SpinButton
            min={0}
            max={255}
            value={rgb.b}
            style={{ minWidth: '60px' }}
          />
        </div>
      </div>
      
      <div 
        className={styles.preview}
        style={{ backgroundColor: tinycolor(color).toRgbString() }}
      />
    </div>
  );
}
```

---

## ColorPicker in Popup

```tsx
import { useState } from 'react';
import { tinycolor } from '@ctrl/tinycolor';
import {
  ColorPicker,
  ColorArea,
  ColorSlider,
  AlphaSlider,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  Button,
  makeStyles,
} from '@fluentui/react-components';
import type { ColorPickerProps } from '@fluentui/react-components';

const useStyles = makeStyles({
  colorButton: {
    width: '40px',
    height: '40px',
    padding: '0',
    minWidth: 'unset',
  },
  picker: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
});

function PopupColorPicker() {
  const styles = useStyles();
  const [color, setColor] = useState({ h: 200, s: 0.8, v: 0.9, a: 1 });
  const [isOpen, setIsOpen] = useState(false);

  const handleChange: ColorPickerProps['onColorChange'] = (_, data) => {
    setColor({ ...data.color, a: data.color.a ?? 1 });
  };

  return (
    <Popover open={isOpen} onOpenChange={(_, data) => setIsOpen(data.open)}>
      <PopoverTrigger>
        <Button
          className={styles.colorButton}
          style={{ backgroundColor: tinycolor(color).toRgbString() }}
          aria-label="Pick a color"
        />
      </PopoverTrigger>
      <PopoverSurface>
        <div className={styles.picker}>
          <ColorPicker color={color} onColorChange={handleChange}>
            <ColorArea />
            <ColorSlider />
            <AlphaSlider />
          </ColorPicker>
          <Button onClick={() => setIsOpen(false)}>Done</Button>
        </div>
      </PopoverSurface>
    </Popover>
  );
}
```

---

## Accessibility

### Keyboard Navigation

**ColorArea:**
| Key | Action |
|-----|--------|
| `Arrow keys` | Move the thumb in 1% increments |
| `Page Up/Down` | Move the thumb in 10% increments |
| `Home/End` | Move to minimum/maximum value |

**ColorSlider/AlphaSlider:**
| Key | Action |
|-----|--------|
| `Arrow Left/Up` | Decrease value |
| `Arrow Right/Down` | Increase value |
| `Home` | Set to minimum |
| `End` | Set to maximum |

### ARIA Labels

Always provide descriptive aria-labels:

```tsx
<ColorPicker color={color} onColorChange={handleChange}>
  <ColorArea
    inputX={{ 'aria-label': 'Saturation' }}
    inputY={{ 'aria-label': 'Brightness' }}
  />
  <ColorSlider aria-label="Hue slider" aria-valuetext={`${color.h}°`} />
  <AlphaSlider aria-label="Alpha slider" aria-valuetext={`${(color.a ?? 1) * 100}%`} />
</ColorPicker>
```

---

## Styling

### Class Names

```typescript
import {
  colorPickerClassNames,
  colorAreaClassNames,
  colorSliderClassNames,
  alphaSliderClassNames,
} from '@fluentui/react-components';

// ColorPicker
colorPickerClassNames.root

// ColorArea
colorAreaClassNames.root
colorAreaClassNames.thumb
colorAreaClassNames.inputX
colorAreaClassNames.inputY

// ColorSlider
colorSliderClassNames.root
colorSliderClassNames.rail
colorSliderClassNames.thumb
colorSliderClassNames.input

// AlphaSlider
alphaSliderClassNames.root
alphaSliderClassNames.rail
alphaSliderClassNames.thumb
alphaSliderClassNames.input
```

### Custom Styling

```tsx
import { 
  ColorPicker, 
  ColorArea, 
  ColorSlider,
  makeStyles 
} from '@fluentui/react-components';

const useStyles = makeStyles({
  squarePicker: {
    // Make all controls square
  },
  customArea: {
    width: '200px',
    height: '200px',
  },
});

function StyledPicker() {
  const styles = useStyles();
  
  return (
    <ColorPicker shape="square">
      <ColorArea className={styles.customArea} />
      <ColorSlider />
    </ColorPicker>
  );
}
```

---

## Best Practices

### Do's ✅

- Provide clear aria-labels for all color controls
- Include aria-valuetext with human-readable values (e.g., "200 degrees")
- Use a color conversion library for format conversions
- Provide text input fields for precise color entry
- Show a color preview so users can see their selection
- Consider providing preset color swatches alongside the picker

### Don'ts ❌

- Don't use ColorPicker without accessibility labels
- Don't assume users know HSV values - show HEX/RGB too
- Don't forget to handle the alpha channel if transparency is supported
- Don't make the ColorArea too small for precise selection

---

## Related Components

- [SwatchPicker](./swatch-picker.md) - For selecting from predefined colors
- [Slider](./slider.md) - For single value selection
- [Popover](../overlay/popover.md) - For popup color picker