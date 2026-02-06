# Slider

> **Package**: `@fluentui/react-slider`
> **Import**: `import { Slider } from '@fluentui/react-components'`
> **Category**: Forms

## Overview

Slider allows users to select a value from a range by dragging a thumb along a track. It supports single value selection with optional marks, steps, and custom styling.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Slider } from '@fluentui/react-components';

export const BasicSlider: React.FC = () => (
  <Slider defaultValue={50} />
);
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Controlled value |
| `defaultValue` | `number` | `0` | Default value (uncontrolled) |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `disabled` | `boolean` | `false` | Disabled state |
| `size` | `'small' \| 'medium'` | `'medium'` | Size of the slider |
| `vertical` | `boolean` | `false` | Vertical orientation |
| `onChange` | `(ev, data) => void` | - | Change handler |

### Slots

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<div>` | Root wrapper element |
| `input` | `<input>` | Hidden range input |
| `rail` | `<div>` | Background track |
| `thumb` | `<div>` | Draggable thumb element |

---

## Controlled vs Uncontrolled

### Uncontrolled

```typescript
import * as React from 'react';
import { Slider } from '@fluentui/react-components';

export const UncontrolledSlider: React.FC = () => (
  <Slider defaultValue={30} min={0} max={100} />
);
```

### Controlled

```typescript
import * as React from 'react';
import { Slider, makeStyles, tokens, Text } from '@fluentui/react-components';
import type { SliderOnChangeData } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const ControlledSlider: React.FC = () => {
  const styles = useStyles();
  const [value, setValue] = React.useState(50);

  const handleChange = React.useCallback(
    (_ev: React.ChangeEvent<HTMLInputElement>, data: SliderOnChangeData) => {
      setValue(data.value);
    },
    []
  );

  return (
    <div className={styles.container}>
      <Slider value={value} onChange={handleChange} />
      <Text>Value: {value}</Text>
    </div>
  );
};
```

---

## Size Variants

```typescript
import * as React from 'react';
import { Slider, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    maxWidth: '400px',
  },
});

export const SliderSizes: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Small">
        <Slider size="small" defaultValue={50} />
      </Field>

      <Field label="Medium (default)">
        <Slider size="medium" defaultValue={50} />
      </Field>
    </div>
  );
};
```

---

## Min, Max, and Step

```typescript
import * as React from 'react';
import { Slider, Field, makeStyles, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    maxWidth: '400px',
  },
  valueDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: tokens.spacingVerticalXS,
  },
});

export const SliderRange: React.FC = () => {
  const styles = useStyles();
  const [temperature, setTemperature] = React.useState(20);
  const [volume, setVolume] = React.useState(50);

  return (
    <div className={styles.form}>
      {/* Temperature: 0-40 with step of 0.5 */}
      <Field label="Temperature (°C)">
        <Slider
          min={0}
          max={40}
          step={0.5}
          value={temperature}
          onChange={(_, data) => setTemperature(data.value)}
        />
        <div className={styles.valueDisplay}>
          <Text size={200}>0°C</Text>
          <Text weight="semibold">{temperature}°C</Text>
          <Text size={200}>40°C</Text>
        </div>
      </Field>

      {/* Volume: 0-100 with step of 10 */}
      <Field label="Volume">
        <Slider
          min={0}
          max={100}
          step={10}
          value={volume}
          onChange={(_, data) => setVolume(data.value)}
        />
        <div className={styles.valueDisplay}>
          <Text size={200}>0%</Text>
          <Text weight="semibold">{volume}%</Text>
          <Text size={200}>100%</Text>
        </div>
      </Field>
    </div>
  );
};
```

---

## Vertical Orientation

```typescript
import * as React from 'react';
import { Slider, Field, makeStyles, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalXL,
    height: '200px',
  },
  sliderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalS,
  },
});

export const VerticalSlider: React.FC = () => {
  const styles = useStyles();
  const [value1, setValue1] = React.useState(50);
  const [value2, setValue2] = React.useState(75);

  return (
    <div className={styles.container}>
      <div className={styles.sliderContainer}>
        <Slider
          vertical
          value={value1}
          onChange={(_, data) => setValue1(data.value)}
        />
        <Text size={200}>Channel 1: {value1}%</Text>
      </div>

      <div className={styles.sliderContainer}>
        <Slider
          vertical
          value={value2}
          onChange={(_, data) => setValue2(data.value)}
        />
        <Text size={200}>Channel 2: {value2}%</Text>
      </div>
    </div>
  );
};
```

---

## Disabled State

```typescript
import * as React from 'react';
import { Slider, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    maxWidth: '400px',
  },
});

export const DisabledSlider: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Disabled (empty)">
        <Slider disabled defaultValue={0} />
      </Field>

      <Field label="Disabled (with value)">
        <Slider disabled defaultValue={60} />
      </Field>
    </div>
  );
};
```

---

## With Field Component

```typescript
import * as React from 'react';
import { Slider, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    maxWidth: '400px',
  },
});

export const SliderWithField: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Brightness" hint="Adjust screen brightness">
        <Slider defaultValue={75} />
      </Field>

      <Field label="Contrast">
        <Slider defaultValue={50} />
      </Field>

      <Field label="Volume" required>
        <Slider defaultValue={30} />
      </Field>
    </div>
  );
};
```

---

## Common Use Cases

### Audio Mixer

```typescript
import * as React from 'react';
import {
  Slider,
  Text,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { SpeakerMuteRegular, Speaker2Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  mixer: {
    display: 'flex',
    gap: tokens.spacingHorizontalL,
    padding: tokens.spacingHorizontalL,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
  channel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalS,
    height: '200px',
  },
  value: {
    minWidth: '40px',
    textAlign: 'center',
  },
});

export const AudioMixer: React.FC = () => {
  const styles = useStyles();
  const [channels, setChannels] = React.useState([75, 50, 60, 45]);

  const updateChannel = (index: number, value: number) => {
    setChannels(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  return (
    <div className={styles.mixer}>
      {['Main', 'Vocals', 'Bass', 'Drums'].map((name, i) => (
        <div key={name} className={styles.channel}>
          <Text size={200}>{name}</Text>
          <Slider
            vertical
            min={0}
            max={100}
            value={channels[i]}
            onChange={(_, data) => updateChannel(i, data.value)}
          />
          <Text className={styles.value} size={200}>
            {channels[i]}%
          </Text>
          <Button
            appearance="subtle"
            size="small"
            icon={channels[i] === 0 ? <SpeakerMuteRegular /> : <Speaker2Regular />}
            onClick={() => updateChannel(i, channels[i] === 0 ? 50 : 0)}
          />
        </div>
      ))}
    </div>
  );
};
```

### Settings Panel

```typescript
import * as React from 'react';
import {
  Slider,
  Field,
  Card,
  CardHeader,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    maxWidth: '400px',
    padding: tokens.spacingHorizontalM,
  },
  settings: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    marginTop: tokens.spacingVerticalM,
  },
});

export const SettingsPanel: React.FC = () => {
  const styles = useStyles();
  const [settings, setSettings] = React.useState({
    brightness: 80,
    contrast: 50,
    saturation: 60,
  });

  const updateSetting = (key: keyof typeof settings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className={styles.card}>
      <CardHeader header={<Text weight="semibold">Display Settings</Text>} />
      <div className={styles.settings}>
        <Field label={`Brightness: ${settings.brightness}%`}>
          <Slider
            value={settings.brightness}
            onChange={(_, data) => updateSetting('brightness', data.value)}
          />
        </Field>

        <Field label={`Contrast: ${settings.contrast}%`}>
          <Slider
            value={settings.contrast}
            onChange={(_, data) => updateSetting('contrast', data.value)}
          />
        </Field>

        <Field label={`Saturation: ${settings.saturation}%`}>
          <Slider
            value={settings.saturation}
            onChange={(_, data) => updateSetting('saturation', data.value)}
          />
        </Field>
      </div>
    </Card>
  );
};
```

---

## Accessibility

### Keyboard Support

| Key | Action |
|-----|--------|
| `Tab` | Move focus to/from slider |
| `Arrow Left/Down` | Decrease value by step |
| `Arrow Right/Up` | Increase value by step |
| `Home` | Set to minimum value |
| `End` | Set to maximum value |
| `Page Up` | Increase by large step |
| `Page Down` | Decrease by large step |

### ARIA Attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `role` | `slider` | Identifies as slider |
| `aria-valuemin` | number | Minimum value |
| `aria-valuemax` | number | Maximum value |
| `aria-valuenow` | number | Current value |
| `aria-orientation` | `horizontal/vertical` | Slider orientation |

### Best Practices

```typescript
// ✅ Always use with Field for labels
<Field label="Volume">
  <Slider />
</Field>

// ✅ Provide visible value feedback
<Field label={`Brightness: ${value}%`}>
  <Slider value={value} />
</Field>

// ✅ Use aria-label when no visible label
<Slider aria-label="Volume control" />
```

---

## Styling Customization

```typescript
import * as React from 'react';
import {
  Slider,
  makeStyles,
  tokens,
  sliderClassNames,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  customSlider: {
    [`& .${sliderClassNames.rail}`]: {
      backgroundColor: tokens.colorNeutralBackground6,
    },
    [`& .${sliderClassNames.thumb}`]: {
      backgroundColor: tokens.colorBrandBackground,
      ':hover': {
        backgroundColor: tokens.colorBrandBackgroundHover,
      },
    },
  },
});

export const CustomStyledSlider: React.FC = () => {
  const styles = useStyles();

  return (
    <Slider className={styles.customSlider} defaultValue={50} />
  );
};
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Use Field for proper labeling
<Field label="Volume">
  <Slider />
</Field>

// ✅ Show current value to users
<Field label={`Brightness: ${value}%`}>
  <Slider value={value} />
</Field>

// ✅ Use appropriate step values
<Slider min={0} max={100} step={5} /> // For percentage
<Slider min={0} max={1} step={0.1} /> // For decimals

// ✅ Provide min/max labels
<div>
  <Slider />
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <span>0%</span>
    <span>100%</span>
  </div>
</div>
```

### ❌ Don'ts

```typescript
// ❌ Don't use without labels
<Slider defaultValue={50} />

// ❌ Don't use too fine step values
<Slider step={0.001} /> // Too precise

// ❌ Don't hide current value from users
<Slider value={value} /> // User can't see current value
```

---

## See Also

- [SpinButton](spinbutton.md) - Numeric input with buttons
- [Field](field.md) - Form field wrapper
- [Component Index](../00-component-index.md) - All components