# SwatchPicker

> **Component**: `SwatchPicker`, `ColorSwatch`, `ImageSwatch`, `EmptySwatch`, `SwatchPickerRow`
> **Package**: `@fluentui/react-components` (from `@fluentui/react-swatch-picker`)

## Overview

SwatchPicker provides a selection interface for choosing from predefined colors, images, or patterns. It's commonly used for theme selection, product color variants, or any scenario where users choose from a fixed set of options.

## Import

```typescript
import {
  SwatchPicker,
  ColorSwatch,
  ImageSwatch,
  EmptySwatch,
  SwatchPickerRow,
  renderSwatchPickerGrid,
  swatchPickerClassNames,
  colorSwatchClassNames,
  imageSwatchClassNames,
  emptySwatchClassNames,
  swatchPickerRowClassNames,
} from '@fluentui/react-components';
```

## Components

| Component | Description |
|-----------|-------------|
| `SwatchPicker` | Container component managing selection state |
| `ColorSwatch` | Individual color swatch button |
| `ImageSwatch` | Image-based swatch (textures, patterns) |
| `EmptySwatch` | Empty/placeholder swatch (e.g., "no color") |
| `SwatchPickerRow` | Row container for grid layouts |
| `renderSwatchPickerGrid` | Utility to render swatches in a grid |

---

## Basic Usage

### Simple Color Swatches

```tsx
import { useState } from 'react';
import {
  SwatchPicker,
  ColorSwatch,
  makeStyles,
} from '@fluentui/react-components';
import type { SwatchPickerOnSelectEventHandler } from '@fluentui/react-components';

const useStyles = makeStyles({
  preview: {
    width: '100px',
    height: '100px',
    marginTop: '20px',
    border: '1px solid #ccc',
  },
});

function BasicSwatchPicker() {
  const styles = useStyles();
  const [selectedValue, setSelectedValue] = useState('green');
  const [selectedColor, setSelectedColor] = useState('#00B053');

  const handleSelect: SwatchPickerOnSelectEventHandler = (_, data) => {
    setSelectedValue(data.selectedValue);
    setSelectedColor(data.selectedSwatch);
  };

  return (
    <>
      <SwatchPicker
        aria-label="Color selection"
        selectedValue={selectedValue}
        onSelectionChange={handleSelect}
      >
        <ColorSwatch color="#FF1921" value="red" aria-label="Red" />
        <ColorSwatch color="#FF7A00" value="orange" aria-label="Orange" />
        <ColorSwatch color="#90D057" value="light-green" aria-label="Light green" />
        <ColorSwatch color="#00B053" value="green" aria-label="Green" />
        <ColorSwatch color="#00AFED" value="light-blue" aria-label="Light blue" />
        <ColorSwatch color="#006EBD" value="blue" aria-label="Blue" />
        <ColorSwatch color="#712F9E" value="purple" aria-label="Purple" />
      </SwatchPicker>

      <div
        className={styles.preview}
        style={{ backgroundColor: selectedColor }}
      />
    </>
  );
}
```

---

## SwatchPicker Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedValue` | `string` | - | Currently selected swatch value (controlled) |
| `defaultSelectedValue` | `string` | - | Default selection (uncontrolled) |
| `onSelectionChange` | `(event, data) => void` | - | Callback when selection changes |
| `layout` | `'row' \| 'grid'` | `'row'` | Layout mode |
| `size` | `'extra-small' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Swatch size |
| `shape` | `'rounded' \| 'square' \| 'circular'` | `'square'` | Swatch shape |
| `spacing` | `'small' \| 'medium'` | `'medium'` | Spacing between swatches |

### Selection Change Data

```typescript
type SwatchPickerOnSelectionChangeData = {
  selectedValue: string;  // The value prop of the selected swatch
  selectedSwatch: string; // The color/src of the selected swatch
};
```

---

## ColorSwatch Component

### ColorSwatch Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | **required** | The color (CSS color value) |
| `value` | `string` | **required** | Unique identifier for this swatch |
| `disabled` | `boolean` | `false` | Disable the swatch |
| `size` | `'extra-small' \| 'small' \| 'medium' \| 'large'` | inherited | Override size |
| `shape` | `'rounded' \| 'square' \| 'circular'` | inherited | Override shape |
| `borderColor` | `string` | - | Border color for low-contrast colors |

### Disabled Swatches

```tsx
<SwatchPicker aria-label="Color picker">
  <ColorSwatch color="#FF1921" value="red" aria-label="Red" />
  <ColorSwatch color="#00B053" value="green" aria-label="Green" />
  <ColorSwatch 
    color="#011F5E" 
    value="dark-blue" 
    aria-label="Dark blue (unavailable)" 
    disabled 
  />
</SwatchPicker>
```

### Border Color for Light Colors

```tsx
<SwatchPicker aria-label="Light colors">
  {/* Light colors need border for visibility */}
  <ColorSwatch 
    color="#FFFFFF" 
    value="white" 
    aria-label="White"
    borderColor="#ccc"
  />
  <ColorSwatch 
    color="#FFFACD" 
    value="lemon" 
    aria-label="Lemon chiffon"
    borderColor="#ddd"
  />
</SwatchPicker>
```

---

## ImageSwatch Component

ImageSwatch displays images like textures, patterns, or product thumbnails.

### ImageSwatch Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | **required** | Image URL |
| `value` | `string` | **required** | Unique identifier |
| `disabled` | `boolean` | `false` | Disable the swatch |
| `size` | Size | inherited | Override size |
| `shape` | Shape | inherited | Override shape |

### Pattern Selection

```tsx
import { SwatchPicker, ImageSwatch } from '@fluentui/react-components';

function PatternPicker() {
  return (
    <SwatchPicker aria-label="Pattern selection">
      <ImageSwatch 
        src="/patterns/stripes.png" 
        value="stripes" 
        aria-label="Stripes pattern" 
      />
      <ImageSwatch 
        src="/patterns/dots.png" 
        value="dots" 
        aria-label="Dots pattern" 
      />
      <ImageSwatch 
        src="/patterns/checkers.png" 
        value="checkers" 
        aria-label="Checkers pattern" 
      />
      <ImageSwatch 
        src="/patterns/wood.jpg" 
        value="wood" 
        aria-label="Wood texture" 
      />
    </SwatchPicker>
  );
}
```

---

## EmptySwatch Component

EmptySwatch represents "no selection" or "clear color" option.

### EmptySwatch Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **required** | Unique identifier |
| `disabled` | `boolean` | `false` | Disable the swatch |
| `size` | Size | inherited | Override size |
| `shape` | Shape | inherited | Override shape |

### Color Picker with "None" Option

```tsx
import { useState } from 'react';
import { 
  SwatchPicker, 
  ColorSwatch, 
  EmptySwatch 
} from '@fluentui/react-components';

function ColorPickerWithNone() {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  return (
    <SwatchPicker
      aria-label="Color with none option"
      selectedValue={selectedValue ?? ''}
      onSelectionChange={(_, data) => setSelectedValue(data.selectedValue)}
    >
      <EmptySwatch value="none" aria-label="No color" />
      <ColorSwatch color="#FF1921" value="red" aria-label="Red" />
      <ColorSwatch color="#00B053" value="green" aria-label="Green" />
      <ColorSwatch color="#006EBD" value="blue" aria-label="Blue" />
    </SwatchPicker>
  );
}
```

---

## Layout Modes

### Row Layout (Default)

```tsx
<SwatchPicker layout="row" aria-label="Row layout">
  <ColorSwatch color="#FF1921" value="red" aria-label="Red" />
  <ColorSwatch color="#00B053" value="green" aria-label="Green" />
  <ColorSwatch color="#006EBD" value="blue" aria-label="Blue" />
</SwatchPicker>
```

### Grid Layout with Manual Rows

```tsx
import { 
  SwatchPicker, 
  SwatchPickerRow, 
  ColorSwatch 
} from '@fluentui/react-components';

function ManualGridLayout() {
  return (
    <SwatchPicker layout="grid" aria-label="Color grid">
      <SwatchPickerRow>
        <ColorSwatch color="#FF1921" value="red" aria-label="Red" />
        <ColorSwatch color="#FF7A00" value="orange" aria-label="Orange" />
        <ColorSwatch color="#FFFF00" value="yellow" aria-label="Yellow" />
      </SwatchPickerRow>
      <SwatchPickerRow>
        <ColorSwatch color="#00B053" value="green" aria-label="Green" />
        <ColorSwatch color="#00AFED" value="light-blue" aria-label="Light blue" />
        <ColorSwatch color="#006EBD" value="blue" aria-label="Blue" />
      </SwatchPickerRow>
      <SwatchPickerRow>
        <ColorSwatch color="#712F9E" value="purple" aria-label="Purple" />
        <ColorSwatch color="#FF0099" value="pink" aria-label="Pink" />
        <ColorSwatch color="#000000" value="black" aria-label="Black" />
      </SwatchPickerRow>
    </SwatchPicker>
  );
}
```

### Grid Layout with Utility Function

```tsx
import { 
  SwatchPicker, 
  renderSwatchPickerGrid 
} from '@fluentui/react-components';

const colors = [
  { color: '#FF1921', value: 'red', 'aria-label': 'Red' },
  { color: '#FF7A00', value: 'orange', 'aria-label': 'Orange' },
  { color: '#FFFF00', value: 'yellow', 'aria-label': 'Yellow' },
  { color: '#00B053', value: 'green', 'aria-label': 'Green' },
  { color: '#00AFED', value: 'light-blue', 'aria-label': 'Light blue' },
  { color: '#006EBD', value: 'blue', 'aria-label': 'Blue' },
  { color: '#712F9E', value: 'purple', 'aria-label': 'Purple' },
  { color: '#FF0099', value: 'pink', 'aria-label': 'Pink' },
  { color: '#000000', value: 'black', 'aria-label': 'Black' },
];

function AutoGridLayout() {
  return (
    <SwatchPicker layout="grid" aria-label="Color grid">
      {renderSwatchPickerGrid({
        items: colors,
        columnCount: 3,
      })}
    </SwatchPicker>
  );
}
```

---

## Size Variants

```tsx
import { SwatchPicker, ColorSwatch } from '@fluentui/react-components';

function SwatchSizes() {
  const colors = [
    { color: '#FF1921', value: 'red' },
    { color: '#00B053', value: 'green' },
    { color: '#006EBD', value: 'blue' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h4>Extra Small</h4>
        <SwatchPicker size="extra-small" aria-label="Extra small swatches">
          {colors.map(c => (
            <ColorSwatch key={c.value} {...c} aria-label={c.value} />
          ))}
        </SwatchPicker>
      </div>
      
      <div>
        <h4>Small</h4>
        <SwatchPicker size="small" aria-label="Small swatches">
          {colors.map(c => (
            <ColorSwatch key={c.value} {...c} aria-label={c.value} />
          ))}
        </SwatchPicker>
      </div>
      
      <div>
        <h4>Medium (Default)</h4>
        <SwatchPicker size="medium" aria-label="Medium swatches">
          {colors.map(c => (
            <ColorSwatch key={c.value} {...c} aria-label={c.value} />
          ))}
        </SwatchPicker>
      </div>
      
      <div>
        <h4>Large</h4>
        <SwatchPicker size="large" aria-label="Large swatches">
          {colors.map(c => (
            <ColorSwatch key={c.value} {...c} aria-label={c.value} />
          ))}
        </SwatchPicker>
      </div>
    </div>
  );
}
```

---

## Shape Variants

```tsx
import { SwatchPicker, ColorSwatch } from '@fluentui/react-components';

function SwatchShapes() {
  const colors = [
    { color: '#FF1921', value: 'red', 'aria-label': 'Red' },
    { color: '#00B053', value: 'green', 'aria-label': 'Green' },
    { color: '#006EBD', value: 'blue', 'aria-label': 'Blue' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h4>Square (Default)</h4>
        <SwatchPicker shape="square" aria-label="Square swatches">
          {colors.map(c => <ColorSwatch key={c.value} {...c} />)}
        </SwatchPicker>
      </div>
      
      <div>
        <h4>Rounded</h4>
        <SwatchPicker shape="rounded" aria-label="Rounded swatches">
          {colors.map(c => <ColorSwatch key={c.value} {...c} />)}
        </SwatchPicker>
      </div>
      
      <div>
        <h4>Circular</h4>
        <SwatchPicker shape="circular" aria-label="Circular swatches">
          {colors.map(c => <ColorSwatch key={c.value} {...c} />)}
        </SwatchPicker>
      </div>
    </div>
  );
}
```

---

## Mixed Swatch Types

```tsx
import { 
  SwatchPicker, 
  ColorSwatch, 
  ImageSwatch, 
  EmptySwatch 
} from '@fluentui/react-components';

function MixedSwatches() {
  return (
    <SwatchPicker aria-label="Mixed swatch types">
      <EmptySwatch value="none" aria-label="No fill" />
      <ColorSwatch color="#FF1921" value="red" aria-label="Red" />
      <ColorSwatch color="#00B053" value="green" aria-label="Green" />
      <ImageSwatch 
        src="/patterns/gradient.png" 
        value="gradient" 
        aria-label="Gradient" 
      />
      <ImageSwatch 
        src="/patterns/stripes.png" 
        value="stripes" 
        aria-label="Stripes" 
      />
    </SwatchPicker>
  );
}
```

---

## SwatchPicker in Popup

```tsx
import { useState } from 'react';
import {
  SwatchPicker,
  ColorSwatch,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  Button,
  makeStyles,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  colorButton: {
    width: '32px',
    height: '32px',
    minWidth: 'unset',
    padding: '0',
    borderRadius: '4px',
  },
});

function PopupSwatchPicker() {
  const styles = useStyles();
  const [selectedColor, setSelectedColor] = useState('#FF1921');
  const [isOpen, setIsOpen] = useState(false);

  const colors = [
    { color: '#FF1921', value: 'red', 'aria-label': 'Red' },
    { color: '#FF7A00', value: 'orange', 'aria-label': 'Orange' },
    { color: '#00B053', value: 'green', 'aria-label': 'Green' },
    { color: '#006EBD', value: 'blue', 'aria-label': 'Blue' },
    { color: '#712F9E', value: 'purple', 'aria-label': 'Purple' },
  ];

  return (
    <Popover open={isOpen} onOpenChange={(_, data) => setIsOpen(data.open)}>
      <PopoverTrigger>
        <Button
          className={styles.colorButton}
          style={{ backgroundColor: selectedColor }}
          aria-label="Select color"
        />
      </PopoverTrigger>
      <PopoverSurface>
        <SwatchPicker
          aria-label="Color picker"
          selectedValue={selectedColor}
          onSelectionChange={(_, data) => {
            setSelectedColor(data.selectedSwatch);
            setIsOpen(false);
          }}
        >
          {colors.map(c => <ColorSwatch key={c.value} {...c} />)}
        </SwatchPicker>
      </PopoverSurface>
    </Popover>
  );
}
```

---

## SwatchPicker with Tooltip

```tsx
import {
  SwatchPicker,
  ColorSwatch,
  Tooltip,
} from '@fluentui/react-components';

function SwatchWithTooltip() {
  const colors = [
    { color: '#FF1921', value: 'red', name: 'Crimson Red' },
    { color: '#FF7A00', value: 'orange', name: 'Sunset Orange' },
    { color: '#00B053', value: 'green', name: 'Forest Green' },
    { color: '#006EBD', value: 'blue', name: 'Ocean Blue' },
  ];

  return (
    <SwatchPicker aria-label="Colors with tooltips">
      {colors.map(({ color, value, name }) => (
        <Tooltip key={value} content={name} relationship="label">
          <ColorSwatch color={color} value={value} aria-label={name} />
        </Tooltip>
      ))}
    </SwatchPicker>
  );
}
```

---

## Accessibility

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move focus to/from the swatch picker |
| `Arrow keys` | Navigate between swatches |
| `Enter` / `Space` | Select the focused swatch |
| `Home` | Move to first swatch |
| `End` | Move to last swatch |

### Required ARIA Labels

Always provide aria-labels:

```tsx
<SwatchPicker aria-label="Product color selection">
  <ColorSwatch 
    color="#FF1921" 
    value="red" 
    aria-label="Red color option" 
  />
  {/* ... */}
</SwatchPicker>
```

---

## Styling

### Class Names

```typescript
import {
  swatchPickerClassNames,
  colorSwatchClassNames,
  imageSwatchClassNames,
  emptySwatchClassNames,
  swatchPickerRowClassNames,
} from '@fluentui/react-components';

// SwatchPicker
swatchPickerClassNames.root

// ColorSwatch
colorSwatchClassNames.root
colorSwatchClassNames.icon
colorSwatchClassNames.disabledIcon

// ImageSwatch
imageSwatchClassNames.root

// EmptySwatch
emptySwatchClassNames.root

// SwatchPickerRow
swatchPickerRowClassNames.root
```

### Custom Styling

```tsx
import { 
  SwatchPicker, 
  ColorSwatch, 
  makeStyles,
  tokens 
} from '@fluentui/react-components';

const useStyles = makeStyles({
  picker: {
    padding: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
});

function StyledSwatchPicker() {
  const styles = useStyles();
  
  return (
    <SwatchPicker className={styles.picker} aria-label="Styled picker">
      <ColorSwatch color="#FF1921" value="red" aria-label="Red" />
      <ColorSwatch color="#00B053" value="green" aria-label="Green" />
    </SwatchPicker>
  );
}
```

---

## Best Practices

### Do's ✅

- Always provide aria-labels for accessibility
- Use consistent sizing across the application
- Provide visual feedback for selected state
- Use tooltips for color names when labels aren't visible
- Add border color for light/white swatches
- Group related colors logically in grids

### Don'ts ❌

- Don't use too many swatches (consider categories/groups)
- Don't mix incompatible size/shape combinations
- Don't forget to handle the "no color" case with EmptySwatch
- Don't use images that don't clearly represent the option

---

## Common Patterns

### Product Color Selector

```tsx
import { useState } from 'react';
import {
  SwatchPicker,
  ColorSwatch,
  Body1,
  makeStyles,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
});

const productColors = [
  { color: '#000000', value: 'black', name: 'Midnight Black' },
  { color: '#C0C0C0', value: 'silver', name: 'Silver' },
  { color: '#FFD700', value: 'gold', name: 'Gold' },
  { color: '#E5E4E2', value: 'platinum', name: 'Platinum' },
];

function ProductColorSelector() {
  const styles = useStyles();
  const [selected, setSelected] = useState(productColors[0]);

  return (
    <div className={styles.container}>
      <Body1>Color: {selected.name}</Body1>
      <SwatchPicker
        aria-label="Product color"
        selectedValue={selected.value}
        onSelectionChange={(_, data) => {
          const color = productColors.find(c => c.value === data.selectedValue);
          if (color) setSelected(color);
        }}
        shape="circular"
        size="large"
      >
        {productColors.map(c => (
          <ColorSwatch
            key={c.value}
            color={c.color}
            value={c.value}
            aria-label={c.name}
          />
        ))}
      </SwatchPicker>
    </div>
  );
}
```

---

## Related Components

- [ColorPicker](./color-picker.md) - For custom color selection
- [Popover](../overlay/popover.md) - For popup color pickers
- [Tooltip](../feedback/tooltip.md) - For color name tooltips