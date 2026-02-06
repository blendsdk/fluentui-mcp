# Checkbox

> **Package**: `@fluentui/react-checkbox`
> **Import**: `import { Checkbox } from '@fluentui/react-components'`
> **Category**: Forms

## Overview

Checkbox allows users to select one or more items from a set, or to turn an option on/off. It supports checked, unchecked, and mixed (indeterminate) states.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Checkbox } from '@fluentui/react-components';

export const BasicCheckbox: React.FC = () => (
  <Checkbox label="Accept terms and conditions" />
);
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `'mixed' \| boolean` | - | Controlled checked state |
| `defaultChecked` | `'mixed' \| boolean` | `false` | Default checked state |
| `disabled` | `boolean` | `false` | Disabled state |
| `label` | `Slot<typeof Label>` | - | Label for the checkbox |
| `labelPosition` | `'before' \| 'after'` | `'after'` | Position of label relative to checkbox |
| `required` | `boolean` | `false` | Marks as required |
| `shape` | `'square' \| 'circular'` | `'square'` | Shape of the checkbox |
| `size` | `'medium' \| 'large'` | `'medium'` | Size of the checkbox |
| `onChange` | `(ev, data) => void` | - | Change handler |

### Slots

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<span>` | Root wrapper element |
| `input` | `<input>` | Hidden checkbox input |
| `indicator` | `<div>` | Visual checkbox indicator |
| `label` | `<Label>` | Checkbox label |

---

## Controlled vs Uncontrolled

### Uncontrolled

```typescript
import * as React from 'react';
import { Checkbox } from '@fluentui/react-components';

export const UncontrolledCheckbox: React.FC = () => (
  <Checkbox 
    defaultChecked 
    label="Remember me" 
  />
);
```

### Controlled

```typescript
import * as React from 'react';
import { Checkbox, makeStyles, tokens, Text } from '@fluentui/react-components';
import type { CheckboxOnChangeData } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

export const ControlledCheckbox: React.FC = () => {
  const styles = useStyles();
  const [checked, setChecked] = React.useState(false);

  const handleChange = React.useCallback(
    (_ev: React.ChangeEvent<HTMLInputElement>, data: CheckboxOnChangeData) => {
      setChecked(data.checked as boolean);
    },
    []
  );

  return (
    <div className={styles.container}>
      <Checkbox
        checked={checked}
        onChange={handleChange}
        label="Subscribe to newsletter"
      />
      <Text>Checked: {checked ? 'Yes' : 'No'}</Text>
    </div>
  );
};
```

---

## Mixed (Indeterminate) State

```typescript
import * as React from 'react';
import { Checkbox, makeStyles, tokens } from '@fluentui/react-components';
import type { CheckboxOnChangeData } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalL,
  },
  parent: {
    fontWeight: tokens.fontWeightSemibold,
  },
});

export const MixedCheckbox: React.FC = () => {
  const styles = useStyles();
  const [items, setItems] = React.useState([false, true, false]);

  const allChecked = items.every(Boolean);
  const noneChecked = items.every(item => !item);
  const parentChecked = allChecked ? true : noneChecked ? false : 'mixed';

  const handleParentChange = React.useCallback(
    (_ev: React.ChangeEvent<HTMLInputElement>, data: CheckboxOnChangeData) => {
      const newValue = data.checked === 'mixed' ? false : data.checked;
      setItems([newValue, newValue, newValue]);
    },
    []
  );

  const handleChildChange = (index: number) => (
    _ev: React.ChangeEvent<HTMLInputElement>,
    data: CheckboxOnChangeData
  ) => {
    const newItems = [...items];
    newItems[index] = data.checked as boolean;
    setItems(newItems);
  };

  return (
    <div>
      <Checkbox
        checked={parentChecked}
        onChange={handleParentChange}
        label="Select all"
        className={styles.parent}
      />
      <div className={styles.container}>
        <Checkbox
          checked={items[0]}
          onChange={handleChildChange(0)}
          label="Option 1"
        />
        <Checkbox
          checked={items[1]}
          onChange={handleChildChange(1)}
          label="Option 2"
        />
        <Checkbox
          checked={items[2]}
          onChange={handleChildChange(2)}
          label="Option 3"
        />
      </div>
    </div>
  );
};
```

---

## Size Variants

```typescript
import * as React from 'react';
import { Checkbox, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

export const CheckboxSizes: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Checkbox size="medium" label="Medium checkbox (default)" />
      <Checkbox size="large" label="Large checkbox" />
    </div>
  );
};
```

---

## Shape Variants

```typescript
import * as React from 'react';
import { Checkbox, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

export const CheckboxShapes: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Checkbox shape="square" label="Square checkbox (default)" />
      <Checkbox shape="circular" label="Circular checkbox" />
    </div>
  );
};
```

---

## Label Position

```typescript
import * as React from 'react';
import { Checkbox, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

export const LabelPositions: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Checkbox label="Label after (default)" labelPosition="after" />
      <Checkbox label="Label before" labelPosition="before" />
    </div>
  );
};
```

---

## Disabled State

```typescript
import * as React from 'react';
import { Checkbox, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

export const DisabledCheckboxes: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Checkbox disabled label="Disabled unchecked" />
      <Checkbox disabled defaultChecked label="Disabled checked" />
      <Checkbox disabled checked="mixed" label="Disabled mixed" />
    </div>
  );
};
```

---

## Required Checkbox

```typescript
import * as React from 'react';
import { Checkbox, Button, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const RequiredCheckbox: React.FC = () => {
  const styles = useStyles();
  const [agreed, setAgreed] = React.useState(false);

  return (
    <form className={styles.form}>
      <Checkbox
        required
        checked={agreed}
        onChange={(_, data) => setAgreed(data.checked as boolean)}
        label="I agree to the terms and conditions *"
      />
      <Button appearance="primary" disabled={!agreed}>
        Submit
      </Button>
    </form>
  );
};
```

---

## Checkbox Group

```typescript
import * as React from 'react';
import { Checkbox, makeStyles, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  label: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalXS,
  },
});

export const CheckboxGroup: React.FC = () => {
  const styles = useStyles();
  const [selected, setSelected] = React.useState<string[]>([]);

  const handleChange = (value: string) => (
    _ev: React.ChangeEvent<HTMLInputElement>,
    data: { checked: boolean | 'mixed' }
  ) => {
    if (data.checked) {
      setSelected([...selected, value]);
    } else {
      setSelected(selected.filter(v => v !== value));
    }
  };

  return (
    <fieldset className={styles.group} style={{ border: 'none', padding: 0 }}>
      <legend className={styles.label}>Select your interests</legend>
      <Checkbox
        label="Technology"
        checked={selected.includes('tech')}
        onChange={handleChange('tech')}
      />
      <Checkbox
        label="Sports"
        checked={selected.includes('sports')}
        onChange={handleChange('sports')}
      />
      <Checkbox
        label="Music"
        checked={selected.includes('music')}
        onChange={handleChange('music')}
      />
      <Checkbox
        label="Travel"
        checked={selected.includes('travel')}
        onChange={handleChange('travel')}
      />
      <Text size={200}>Selected: {selected.join(', ') || 'None'}</Text>
    </fieldset>
  );
};
```

---

## Accessibility

### Keyboard Support

| Key | Action |
|-----|--------|
| `Space` | Toggle checked state |
| `Tab` | Move to next focusable element |

### ARIA Attributes

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `aria-checked` | `true/false/mixed` | Reflects checked state |
| `aria-disabled` | `true` | When disabled |
| `aria-required` | `true` | When required |

### Best Practices

```typescript
// ✅ Always provide a label
<Checkbox label="Enable notifications" />

// ✅ For checkbox without visible label, use aria-label
<Checkbox aria-label="Select row" />

// ✅ Group related checkboxes in fieldset
<fieldset>
  <legend>Notification preferences</legend>
  <Checkbox label="Email" />
  <Checkbox label="SMS" />
</fieldset>
```

---

## Styling Customization

```typescript
import * as React from 'react';
import {
  Checkbox,
  makeStyles,
  tokens,
  checkboxClassNames,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  customCheckbox: {
    [`& .${checkboxClassNames.indicator}`]: {
      borderRadius: tokens.borderRadiusSmall,
    },
    [`& .${checkboxClassNames.label}`]: {
      fontWeight: tokens.fontWeightMedium,
    },
  },
});

export const CustomStyledCheckbox: React.FC = () => {
  const styles = useStyles();

  return (
    <Checkbox
      className={styles.customCheckbox}
      label="Custom styled checkbox"
    />
  );
};
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Use clear, descriptive labels
<Checkbox label="Receive weekly newsletter" />

// ✅ Use mixed state for parent-child relationships
<Checkbox checked={allSelected ? true : noneSelected ? false : 'mixed'} />

// ✅ Group related checkboxes
<fieldset>
  <legend>Select options</legend>
  <Checkbox label="Option A" />
  <Checkbox label="Option B" />
</fieldset>

// ✅ Use required for mandatory acceptance
<Checkbox required label="I agree to terms *" />
```

### ❌ Don'ts

```typescript
// ❌ Don't use checkbox for mutually exclusive options (use Radio)
<Checkbox label="Male" />
<Checkbox label="Female" />

// ❌ Don't use without a label
<Checkbox /> // Missing label

// ❌ Don't use for on/off settings (use Switch)
<Checkbox label="Dark mode" />
```

---

## See Also

- [Radio](radio.md) - For mutually exclusive selections
- [Switch](switch.md) - For on/off toggle settings
- [Field](field.md) - Form field wrapper
- [Component Index](../00-component-index.md) - All components