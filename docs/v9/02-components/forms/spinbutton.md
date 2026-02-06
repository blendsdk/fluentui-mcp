# SpinButton

> **Package**: `@fluentui/react-spinbutton`
> **Import**: `import { SpinButton } from '@fluentui/react-components'`
> **Category**: Forms

## Overview

SpinButton is a numeric input with increment and decrement buttons. It allows users to enter a precise numeric value or adjust it using the buttons or keyboard.

---

## Basic Usage

```typescript
import * as React from 'react';
import { SpinButton } from '@fluentui/react-components';

export const BasicSpinButton: React.FC = () => (
  <SpinButton defaultValue={0} />
);
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number \| null` | - | Controlled value |
| `defaultValue` | `number` | - | Default value (uncontrolled) |
| `min` | `number` | - | Minimum allowed value |
| `max` | `number` | - | Maximum allowed value |
| `step` | `number` | `1` | Step increment |
| `stepPage` | `number` | `1` | Page step (for Page Up/Down) |
| `disabled` | `boolean` | `false` | Disabled state |
| `appearance` | `'outline' \| 'underline' \| 'filled-darker' \| 'filled-lighter'` | `'outline'` | Visual style |
| `size` | `'small' \| 'medium'` | `'medium'` | Size of the component |
| `displayValue` | `string` | - | Display value (for formatting) |
| `precision` | `number` | - | Decimal precision |
| `onChange` | `(ev, data) => void` | - | Change handler |

### Slots

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<span>` | Root wrapper element |
| `input` | `<input>` | Text input element |
| `incrementButton` | `<button>` | Increment (+) button |
| `decrementButton` | `<button>` | Decrement (-) button |

---

## Controlled vs Uncontrolled

### Uncontrolled

```typescript
import * as React from 'react';
import { SpinButton } from '@fluentui/react-components';

export const UncontrolledSpinButton: React.FC = () => (
  <SpinButton defaultValue={5} min={0} max={10} />
);
```

### Controlled

```typescript
import * as React from 'react';
import { SpinButton, makeStyles, tokens, Text } from '@fluentui/react-components';
import type { SpinButtonOnChangeData, SpinButtonChangeEvent } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '200px',
  },
});

export const ControlledSpinButton: React.FC = () => {
  const styles = useStyles();
  const [value, setValue] = React.useState<number | null>(10);

  const handleChange = React.useCallback(
    (_ev: SpinButtonChangeEvent, data: SpinButtonOnChangeData) => {
      setValue(data.value ?? null);
    },
    []
  );

  return (
    <div className={styles.container}>
      <SpinButton value={value} onChange={handleChange} />
      <Text>Value: {value ?? 'null'}</Text>
    </div>
  );
};
```

---

## Appearance Variants

```typescript
import * as React from 'react';
import { SpinButton, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '200px',
  },
});

export const SpinButtonAppearances: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Outline (default)">
        <SpinButton appearance="outline" defaultValue={0} />
      </Field>

      <Field label="Underline">
        <SpinButton appearance="underline" defaultValue={0} />
      </Field>

      <Field label="Filled Darker">
        <SpinButton appearance="filled-darker" defaultValue={0} />
      </Field>

      <Field label="Filled Lighter">
        <SpinButton appearance="filled-lighter" defaultValue={0} />
      </Field>
    </div>
  );
};
```

---

## Size Variants

```typescript
import * as React from 'react';
import { SpinButton, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '200px',
  },
});

export const SpinButtonSizes: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Small" size="small">
        <SpinButton size="small" defaultValue={0} />
      </Field>

      <Field label="Medium" size="medium">
        <SpinButton size="medium" defaultValue={0} />
      </Field>
    </div>
  );
};
```

---

## Min, Max, and Step

```typescript
import * as React from 'react';
import { SpinButton, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '200px',
  },
});

export const SpinButtonBounds: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      {/* Range 0-10 */}
      <Field label="Quantity (0-10)">
        <SpinButton min={0} max={10} defaultValue={1} />
      </Field>

      {/* Step of 5 */}
      <Field label="Percentage (step 5)">
        <SpinButton min={0} max={100} step={5} defaultValue={50} />
      </Field>

      {/* Decimal step */}
      <Field label="Price (step 0.01)">
        <SpinButton min={0} step={0.01} precision={2} defaultValue={9.99} />
      </Field>

      {/* Negative allowed */}
      <Field label="Temperature (-50 to 50)">
        <SpinButton min={-50} max={50} defaultValue={0} />
      </Field>
    </div>
  );
};
```

---

## Custom Display Value

```typescript
import * as React from 'react';
import { SpinButton, Field, makeStyles, tokens } from '@fluentui/react-components';
import type { SpinButtonOnChangeData, SpinButtonChangeEvent } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '200px',
  },
});

export const FormattedSpinButton: React.FC = () => {
  const styles = useStyles();
  const [price, setPrice] = React.useState(10);
  const [percent, setPercent] = React.useState(50);

  return (
    <div className={styles.form}>
      {/* Currency format */}
      <Field label="Price">
        <SpinButton
          value={price}
          onChange={(_: SpinButtonChangeEvent, data: SpinButtonOnChangeData) => 
            setPrice(data.value ?? 0)
          }
          min={0}
          step={0.5}
          displayValue={`$${price.toFixed(2)}`}
        />
      </Field>

      {/* Percentage format */}
      <Field label="Opacity">
        <SpinButton
          value={percent}
          onChange={(_: SpinButtonChangeEvent, data: SpinButtonOnChangeData) => 
            setPercent(data.value ?? 0)
          }
          min={0}
          max={100}
          step={5}
          displayValue={`${percent}%`}
        />
      </Field>
    </div>
  );
};
```

---

## Disabled State

```typescript
import * as React from 'react';
import { SpinButton, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '200px',
  },
});

export const DisabledSpinButton: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Disabled (empty)">
        <SpinButton disabled />
      </Field>

      <Field label="Disabled (with value)">
        <SpinButton disabled defaultValue={42} />
      </Field>
    </div>
  );
};
```

---

## With Field Component

```typescript
import * as React from 'react';
import { SpinButton, Field, makeStyles, tokens } from '@fluentui/react-components';
import type { SpinButtonOnChangeData, SpinButtonChangeEvent } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '200px',
  },
});

export const SpinButtonWithField: React.FC = () => {
  const styles = useStyles();
  const [quantity, setQuantity] = React.useState(1);
  const hasError = quantity < 1 || quantity > 99;

  return (
    <div className={styles.form}>
      <Field
        label="Quantity"
        required
        validationState={hasError ? 'error' : 'none'}
        validationMessage={hasError ? 'Quantity must be between 1 and 99' : undefined}
      >
        <SpinButton
          value={quantity}
          onChange={(_: SpinButtonChangeEvent, data: SpinButtonOnChangeData) => 
            setQuantity(data.value ?? 1)
          }
          min={1}
          max={99}
        />
      </Field>

      <Field label="Priority" hint="1 = highest priority">
        <SpinButton min={1} max={10} defaultValue={5} />
      </Field>
    </div>
  );
};
```

---

## Common Use Cases

### Quantity Selector

```typescript
import * as React from 'react';
import {
  SpinButton,
  Field,
  Card,
  CardHeader,
  Text,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import type { SpinButtonOnChangeData, SpinButtonChangeEvent } from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    maxWidth: '300px',
    padding: tokens.spacingHorizontalM,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    marginTop: tokens.spacingVerticalM,
  },
  total: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

export const QuantitySelector: React.FC = () => {
  const styles = useStyles();
  const [quantity, setQuantity] = React.useState(1);
  const pricePerItem = 29.99;
  const total = quantity * pricePerItem;

  return (
    <Card className={styles.card}>
      <CardHeader header={<Text weight="semibold">Product Name</Text>} />
      <div className={styles.content}>
        <Text>${pricePerItem.toFixed(2)} each</Text>
        
        <Field label="Quantity">
          <SpinButton
            value={quantity}
            onChange={(_: SpinButtonChangeEvent, data: SpinButtonOnChangeData) => 
              setQuantity(data.value ?? 1)
            }
            min={1}
            max={10}
          />
        </Field>

        <div className={styles.total}>
          <Text weight="semibold">Total:</Text>
          <Text weight="semibold">${total.toFixed(2)}</Text>
        </div>

        <Button appearance="primary">Add to Cart</Button>
      </div>
    </Card>
  );
};
```

### Settings Form

```typescript
import * as React from 'react';
import {
  SpinButton,
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '300px',
  },
});

export const SettingsForm: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Auto-save interval (minutes)" hint="0 to disable">
        <SpinButton min={0} max={60} step={5} defaultValue={5} />
      </Field>

      <Field label="Max recent files">
        <SpinButton min={1} max={50} defaultValue={10} />
      </Field>

      <Field label="Font size (px)">
        <SpinButton min={8} max={72} defaultValue={14} />
      </Field>

      <Field label="Tab width (spaces)">
        <SpinButton min={1} max={8} defaultValue={4} />
      </Field>
    </div>
  );
};
```

---

## Accessibility

### Keyboard Support

| Key | Action |
|-----|--------|
| `Tab` | Move focus to/from SpinButton |
| `Arrow Up` | Increment value by step |
| `Arrow Down` | Decrement value by step |
| `Page Up` | Increment by stepPage |
| `Page Down` | Decrement by stepPage |
| `Home` | Set to minimum value (if defined) |
| `End` | Set to maximum value (if defined) |
| `Enter` | Commit typed value |
| `Escape` | Revert to last committed value |

### ARIA Attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `role` | `spinbutton` | Identifies as spinbutton |
| `aria-valuemin` | number | Minimum value |
| `aria-valuemax` | number | Maximum value |
| `aria-valuenow` | number | Current value |

### Best Practices

```typescript
// ✅ Always use with Field for labels
<Field label="Quantity">
  <SpinButton />
</Field>

// ✅ Set sensible min/max
<SpinButton min={0} max={100} />

// ✅ Use aria-label if no visible label
<SpinButton aria-label="Number of items" />
```

---

## Styling Customization

```typescript
import * as React from 'react';
import {
  SpinButton,
  makeStyles,
  tokens,
  spinButtonClassNames,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  customSpinButton: {
    [`& .${spinButtonClassNames.input}`]: {
      fontFamily: tokens.fontFamilyMonospace,
    },
    [`& .${spinButtonClassNames.incrementButton}`]: {
      color: tokens.colorPaletteGreenForeground1,
    },
    [`& .${spinButtonClassNames.decrementButton}`]: {
      color: tokens.colorPaletteRedForeground1,
    },
  },
});

export const CustomStyledSpinButton: React.FC = () => {
  const styles = useStyles();

  return (
    <SpinButton className={styles.customSpinButton} defaultValue={0} />
  );
};
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Use Field for proper labeling
<Field label="Quantity">
  <SpinButton />
</Field>

// ✅ Set appropriate min/max bounds
<SpinButton min={1} max={100} />

// ✅ Use precision for decimal values
<SpinButton step={0.01} precision={2} />

// ✅ Use displayValue for custom formatting
<SpinButton
  value={price}
  displayValue={`$${price.toFixed(2)}`}
/>
```

### ❌ Don'ts

```typescript
// ❌ Don't use without labels
<SpinButton defaultValue={0} />

// ❌ Don't allow unreasonable ranges
<SpinButton min={-Infinity} max={Infinity} />

// ❌ Don't use for non-numeric input (use Input instead)
<SpinButton /> // For text input, use Input
```

---

## See Also

- [Slider](slider.md) - Range slider component
- [Input](input.md) - Text input component
- [Field](field.md) - Form field wrapper
- [Component Index](../00-component-index.md) - All components