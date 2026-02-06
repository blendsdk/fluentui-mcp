# Radio

> **Package**: `@fluentui/react-radio`
> **Import**: `import { Radio, RadioGroup } from '@fluentui/react-components'`
> **Category**: Forms

## Overview

Radio and RadioGroup allow users to select exactly one option from a set of mutually exclusive choices. Use RadioGroup to contain Radio items that share the same name.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Radio, RadioGroup, Label } from '@fluentui/react-components';

export const BasicRadio: React.FC = () => (
  <div>
    <Label id="radio-group-label">Favorite color</Label>
    <RadioGroup aria-labelledby="radio-group-label">
      <Radio value="red" label="Red" />
      <Radio value="green" label="Green" />
      <Radio value="blue" label="Blue" />
    </RadioGroup>
  </div>
);
```

---

## RadioGroup Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled selected value |
| `defaultValue` | `string` | - | Default selected value (uncontrolled) |
| `disabled` | `boolean` | `false` | Disables all radios in the group |
| `layout` | `'horizontal' \| 'vertical' \| 'horizontal-stacked'` | `'vertical'` | Layout direction |
| `name` | `string` | auto-generated | Name attribute for all radios |
| `required` | `boolean` | `false` | Marks the group as required |
| `onChange` | `(ev, data) => void` | - | Change handler |

## Radio Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | Value of the radio |
| `label` | `Slot<typeof Label>` | - | Label for the radio |
| `labelPosition` | `'before' \| 'after'` | `'after'` | Position of label |
| `disabled` | `boolean` | `false` | Disabled state |

### Slots

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<span>` | Root wrapper element |
| `input` | `<input>` | Hidden radio input |
| `indicator` | `<div>` | Visual radio indicator |
| `label` | `<Label>` | Radio label |

---

## Controlled vs Uncontrolled

### Uncontrolled

```typescript
import * as React from 'react';
import { Radio, RadioGroup, Label } from '@fluentui/react-components';

export const UncontrolledRadio: React.FC = () => (
  <div>
    <Label id="size-label">Size</Label>
    <RadioGroup defaultValue="medium" aria-labelledby="size-label">
      <Radio value="small" label="Small" />
      <Radio value="medium" label="Medium" />
      <Radio value="large" label="Large" />
    </RadioGroup>
  </div>
);
```

### Controlled

```typescript
import * as React from 'react';
import { Radio, RadioGroup, Label, Text, makeStyles, tokens } from '@fluentui/react-components';
import type { RadioGroupOnChangeData } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

export const ControlledRadio: React.FC = () => {
  const styles = useStyles();
  const [value, setValue] = React.useState('medium');

  const handleChange = React.useCallback(
    (_ev: React.FormEvent<HTMLDivElement>, data: RadioGroupOnChangeData) => {
      setValue(data.value);
    },
    []
  );

  return (
    <div className={styles.container}>
      <Label id="size-label">Size</Label>
      <RadioGroup value={value} onChange={handleChange} aria-labelledby="size-label">
        <Radio value="small" label="Small" />
        <Radio value="medium" label="Medium" />
        <Radio value="large" label="Large" />
      </RadioGroup>
      <Text>Selected: {value}</Text>
    </div>
  );
};
```

---

## Layout Options

### Vertical (Default)

```typescript
import * as React from 'react';
import { Radio, RadioGroup, Label } from '@fluentui/react-components';

export const VerticalLayout: React.FC = () => (
  <div>
    <Label id="vertical-label">Options</Label>
    <RadioGroup layout="vertical" aria-labelledby="vertical-label">
      <Radio value="a" label="Option A" />
      <Radio value="b" label="Option B" />
      <Radio value="c" label="Option C" />
    </RadioGroup>
  </div>
);
```

### Horizontal

```typescript
import * as React from 'react';
import { Radio, RadioGroup, Label } from '@fluentui/react-components';

export const HorizontalLayout: React.FC = () => (
  <div>
    <Label id="horizontal-label">Options</Label>
    <RadioGroup layout="horizontal" aria-labelledby="horizontal-label">
      <Radio value="a" label="Option A" />
      <Radio value="b" label="Option B" />
      <Radio value="c" label="Option C" />
    </RadioGroup>
  </div>
);
```

### Horizontal Stacked

```typescript
import * as React from 'react';
import { Radio, RadioGroup, Label } from '@fluentui/react-components';

export const HorizontalStackedLayout: React.FC = () => (
  <div>
    <Label id="stacked-label">Options</Label>
    <RadioGroup layout="horizontal-stacked" aria-labelledby="stacked-label">
      <Radio value="a" label="Option A" />
      <Radio value="b" label="Option B" />
      <Radio value="c" label="Option C" />
    </RadioGroup>
  </div>
);
```

---

## With Field Component

```typescript
import * as React from 'react';
import { Field, Radio, RadioGroup, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const RadioWithField: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Select your plan" required>
        <RadioGroup defaultValue="standard">
          <Radio value="basic" label="Basic - $9/month" />
          <Radio value="standard" label="Standard - $19/month" />
          <Radio value="premium" label="Premium - $29/month" />
        </RadioGroup>
      </Field>
    </div>
  );
};
```

---

## Disabled State

### Entire Group Disabled

```typescript
import * as React from 'react';
import { Radio, RadioGroup, Label } from '@fluentui/react-components';

export const DisabledGroup: React.FC = () => (
  <div>
    <Label id="disabled-group-label">Disabled Group</Label>
    <RadioGroup disabled defaultValue="a" aria-labelledby="disabled-group-label">
      <Radio value="a" label="Option A" />
      <Radio value="b" label="Option B" />
      <Radio value="c" label="Option C" />
    </RadioGroup>
  </div>
);
```

### Individual Radio Disabled

```typescript
import * as React from 'react';
import { Radio, RadioGroup, Label } from '@fluentui/react-components';

export const IndividualDisabled: React.FC = () => (
  <div>
    <Label id="partial-disabled-label">Partial Disabled</Label>
    <RadioGroup aria-labelledby="partial-disabled-label">
      <Radio value="a" label="Available" />
      <Radio value="b" label="Unavailable" disabled />
      <Radio value="c" label="Available" />
    </RadioGroup>
  </div>
);
```

---

## Required RadioGroup

```typescript
import * as React from 'react';
import {
  Field,
  Radio,
  RadioGroup,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import type { RadioGroupOnChangeData } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const RequiredRadioGroup: React.FC = () => {
  const styles = useStyles();
  const [value, setValue] = React.useState('');

  const handleChange = (_ev: React.FormEvent<HTMLDivElement>, data: RadioGroupOnChangeData) => {
    setValue(data.value);
  };

  return (
    <form className={styles.form}>
      <Field label="Shipping method" required>
        <RadioGroup value={value} onChange={handleChange} required>
          <Radio value="standard" label="Standard (5-7 days)" />
          <Radio value="express" label="Express (2-3 days)" />
          <Radio value="overnight" label="Overnight" />
        </RadioGroup>
      </Field>
      <Button appearance="primary" disabled={!value} type="submit">
        Continue
      </Button>
    </form>
  );
};
```

---

## Label Position

```typescript
import * as React from 'react';
import { Radio, RadioGroup, Label, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
});

export const LabelPositions: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div>
        <Label id="after-label">Label After (default)</Label>
        <RadioGroup aria-labelledby="after-label">
          <Radio value="a" label="Option A" labelPosition="after" />
          <Radio value="b" label="Option B" labelPosition="after" />
        </RadioGroup>
      </div>

      <div>
        <Label id="before-label">Label Before</Label>
        <RadioGroup aria-labelledby="before-label">
          <Radio value="a" label="Option A" labelPosition="before" />
          <Radio value="b" label="Option B" labelPosition="before" />
        </RadioGroup>
      </div>
    </div>
  );
};
```

---

## Common Use Cases

### Payment Method Selection

```typescript
import * as React from 'react';
import {
  Radio,
  RadioGroup,
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  CreditCardRegular,
  WalletRegular,
  BuildingBankRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  radioItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
});

export const PaymentMethodRadio: React.FC = () => {
  const styles = useStyles();

  return (
    <Field label="Payment Method">
      <RadioGroup defaultValue="card">
        <Radio
          value="card"
          label={
            <span className={styles.radioItem}>
              <CreditCardRegular />
              Credit/Debit Card
            </span>
          }
        />
        <Radio
          value="paypal"
          label={
            <span className={styles.radioItem}>
              <WalletRegular />
              PayPal
            </span>
          }
        />
        <Radio
          value="bank"
          label={
            <span className={styles.radioItem}>
              <BuildingBankRegular />
              Bank Transfer
            </span>
          }
        />
      </RadioGroup>
    </Field>
  );
};
```

### Survey Rating

```typescript
import * as React from 'react';
import {
  Radio,
  RadioGroup,
  Field,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  labels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: tokens.spacingVerticalXS,
  },
});

export const RatingRadio: React.FC = () => {
  const styles = useStyles();

  return (
    <Field label="How satisfied are you with our service?">
      <RadioGroup layout="horizontal">
        <Radio value="1" label="1" />
        <Radio value="2" label="2" />
        <Radio value="3" label="3" />
        <Radio value="4" label="4" />
        <Radio value="5" label="5" />
      </RadioGroup>
      <div className={styles.labels}>
        <Text size={200}>Not satisfied</Text>
        <Text size={200}>Very satisfied</Text>
      </div>
    </Field>
  );
};
```

---

## Accessibility

### Keyboard Support

| Key | Action |
|-----|--------|
| `Tab` | Move focus to/from the radio group |
| `Arrow Up/Down` | Move selection in vertical layout |
| `Arrow Left/Right` | Move selection in horizontal layout |
| `Space` | Select the focused radio |

### ARIA Attributes

| Element | Attribute | Value |
|---------|-----------|-------|
| RadioGroup | `role` | `radiogroup` |
| Radio | `role` | `radio` |
| Radio | `aria-checked` | `true/false` |
| Radio | `aria-disabled` | `true` when disabled |

### Best Practices

```typescript
// ✅ Always label the RadioGroup
<Label id="group-label">Choose an option</Label>
<RadioGroup aria-labelledby="group-label">
  ...
</RadioGroup>

// ✅ Or use Field for automatic labeling
<Field label="Choose an option">
  <RadioGroup>
    ...
  </RadioGroup>
</Field>

// ✅ Provide descriptive labels for each Radio
<Radio value="premium" label="Premium Plan - $29/month, unlimited features" />
```

---

## Styling Customization

```typescript
import * as React from 'react';
import {
  Radio,
  RadioGroup,
  Label,
  makeStyles,
  tokens,
  radioClassNames,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  customRadio: {
    [`& .${radioClassNames.indicator}`]: {
      borderWidth: '2px',
    },
    [`& .${radioClassNames.label}`]: {
      fontWeight: tokens.fontWeightMedium,
    },
  },
});

export const CustomStyledRadio: React.FC = () => {
  const styles = useStyles();

  return (
    <div>
      <Label id="custom-label">Custom Styled</Label>
      <RadioGroup aria-labelledby="custom-label">
        <Radio className={styles.customRadio} value="a" label="Option A" />
        <Radio className={styles.customRadio} value="b" label="Option B" />
      </RadioGroup>
    </div>
  );
};
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Use for mutually exclusive options
<RadioGroup>
  <Radio value="yes" label="Yes" />
  <Radio value="no" label="No" />
</RadioGroup>

// ✅ Provide a default selection when appropriate
<RadioGroup defaultValue="standard">
  <Radio value="basic" label="Basic" />
  <Radio value="standard" label="Standard" />
</RadioGroup>

// ✅ Keep options to 2-7 items
<RadioGroup>
  <Radio value="s" label="Small" />
  <Radio value="m" label="Medium" />
  <Radio value="l" label="Large" />
</RadioGroup>

// ✅ Use horizontal layout for few, short options
<RadioGroup layout="horizontal">
  <Radio value="yes" label="Yes" />
  <Radio value="no" label="No" />
</RadioGroup>
```

### ❌ Don'ts

```typescript
// ❌ Don't use Radio without RadioGroup
<Radio value="option" label="Orphan radio" />

// ❌ Don't use for multi-select (use Checkbox)
<RadioGroup>
  <Radio label="Select multiple" /> // Wrong component
</RadioGroup>

// ❌ Don't use too many options (use Select/Combobox instead)
<RadioGroup>
  <Radio label="Option 1" />
  {/* ...10+ options... */}
</RadioGroup>
```

---

## See Also

- [Checkbox](checkbox.md) - For multi-select options
- [Select](select.md) - For many options in dropdown
- [Field](field.md) - Form field wrapper
- [Component Index](../00-component-index.md) - All components