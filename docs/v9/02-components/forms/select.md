# Select

> **Package**: `@fluentui/react-select`
> **Import**: `import { Select } from '@fluentui/react-components'`
> **Category**: Forms

## Overview

Select provides a native HTML select dropdown for choosing from a list of options. For a more customizable dropdown with search, use Combobox.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Select } from '@fluentui/react-components';

export const BasicSelect: React.FC = () => (
  <Select>
    <option value="">Select an option...</option>
    <option value="apple">Apple</option>
    <option value="banana">Banana</option>
    <option value="orange">Orange</option>
  </Select>
);
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appearance` | `'outline' \| 'underline' \| 'filled-darker' \| 'filled-lighter'` | `'outline'` | Visual style |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the select |
| `disabled` | `boolean` | `false` | Disabled state |
| `value` | `string` | - | Controlled selected value |
| `defaultValue` | `string` | - | Default selected value |
| `onChange` | `(ev, data) => void` | - | Change handler |

### Slots

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<span>` | Root wrapper element |
| `select` | `<select>` | Native select element |
| `icon` | `<span>` | Dropdown icon |

---

## Controlled vs Uncontrolled

### Uncontrolled

```typescript
import * as React from 'react';
import { Select } from '@fluentui/react-components';

export const UncontrolledSelect: React.FC = () => (
  <Select defaultValue="medium">
    <option value="small">Small</option>
    <option value="medium">Medium</option>
    <option value="large">Large</option>
  </Select>
);
```

### Controlled

```typescript
import * as React from 'react';
import { Select, makeStyles, tokens, Text } from '@fluentui/react-components';
import type { SelectOnChangeData } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '300px',
  },
});

export const ControlledSelect: React.FC = () => {
  const styles = useStyles();
  const [value, setValue] = React.useState('');

  const handleChange = React.useCallback(
    (_ev: React.ChangeEvent<HTMLSelectElement>, data: SelectOnChangeData) => {
      setValue(data.value);
    },
    []
  );

  return (
    <div className={styles.container}>
      <Select value={value} onChange={handleChange}>
        <option value="">Choose a color...</option>
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
      </Select>
      <Text>Selected: {value || 'None'}</Text>
    </div>
  );
};
```

---

## Appearance Variants

```typescript
import * as React from 'react';
import { Select, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '300px',
  },
});

export const SelectAppearances: React.FC = () => {
  const styles = useStyles();

  const options = (
    <>
      <option value="">Select...</option>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </>
  );

  return (
    <div className={styles.form}>
      <Field label="Outline (default)">
        <Select appearance="outline">{options}</Select>
      </Field>

      <Field label="Underline">
        <Select appearance="underline">{options}</Select>
      </Field>

      <Field label="Filled Darker">
        <Select appearance="filled-darker">{options}</Select>
      </Field>

      <Field label="Filled Lighter">
        <Select appearance="filled-lighter">{options}</Select>
      </Field>
    </div>
  );
};
```

---

## Size Variants

```typescript
import * as React from 'react';
import { Select, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '300px',
  },
});

export const SelectSizes: React.FC = () => {
  const styles = useStyles();

  const options = (
    <>
      <option value="">Select...</option>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </>
  );

  return (
    <div className={styles.form}>
      <Field label="Small" size="small">
        <Select size="small">{options}</Select>
      </Field>

      <Field label="Medium" size="medium">
        <Select size="medium">{options}</Select>
      </Field>

      <Field label="Large" size="large">
        <Select size="large">{options}</Select>
      </Field>
    </div>
  );
};
```

---

## With Field Component

```typescript
import * as React from 'react';
import { Select, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const SelectWithField: React.FC = () => {
  const styles = useStyles();
  const [value, setValue] = React.useState('');
  const hasError = false; // Add your validation logic

  return (
    <div className={styles.form}>
      <Field label="Country" required>
        <Select
          value={value}
          onChange={(_, data) => setValue(data.value)}
        >
          <option value="">Select a country...</option>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
          <option value="ca">Canada</option>
          <option value="au">Australia</option>
        </Select>
      </Field>

      <Field
        label="State"
        validationState={hasError ? 'error' : 'none'}
        validationMessage={hasError ? 'Please select a state' : undefined}
      >
        <Select>
          <option value="">Select a state...</option>
          <option value="ca">California</option>
          <option value="ny">New York</option>
          <option value="tx">Texas</option>
        </Select>
      </Field>

      <Field label="Timezone" hint="Based on your location">
        <Select defaultValue="pst">
          <option value="pst">Pacific Time (PT)</option>
          <option value="mst">Mountain Time (MT)</option>
          <option value="cst">Central Time (CT)</option>
          <option value="est">Eastern Time (ET)</option>
        </Select>
      </Field>
    </div>
  );
};
```

---

## Option Groups

```typescript
import * as React from 'react';
import { Select, Field } from '@fluentui/react-components';

export const SelectWithOptgroups: React.FC = () => (
  <Field label="Select a car">
    <Select>
      <option value="">Choose a car...</option>
      <optgroup label="Swedish Cars">
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
      </optgroup>
      <optgroup label="German Cars">
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
        <option value="bmw">BMW</option>
      </optgroup>
      <optgroup label="Japanese Cars">
        <option value="toyota">Toyota</option>
        <option value="honda">Honda</option>
        <option value="nissan">Nissan</option>
      </optgroup>
    </Select>
  </Field>
);
```

---

## Disabled State

```typescript
import * as React from 'react';
import { Select, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '300px',
  },
});

export const DisabledSelect: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Disabled Select">
        <Select disabled>
          <option value="">Select...</option>
          <option value="1">Option 1</option>
        </Select>
      </Field>

      <Field label="Disabled with Value">
        <Select disabled defaultValue="selected">
          <option value="selected">Selected Option</option>
        </Select>
      </Field>

      <Field label="Disabled Option">
        <Select>
          <option value="">Select...</option>
          <option value="1">Available</option>
          <option value="2" disabled>Unavailable</option>
          <option value="3">Available</option>
        </Select>
      </Field>
    </div>
  );
};
```

---

## Dynamic Options

```typescript
import * as React from 'react';
import { Select, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '300px',
  },
});

const countries: Record<string, string[]> = {
  us: ['California', 'New York', 'Texas'],
  uk: ['England', 'Scotland', 'Wales'],
  ca: ['Ontario', 'Quebec', 'British Columbia'],
};

export const DynamicOptionsSelect: React.FC = () => {
  const styles = useStyles();
  const [country, setCountry] = React.useState('');
  const [region, setRegion] = React.useState('');

  const regions = country ? countries[country] || [] : [];

  return (
    <div className={styles.form}>
      <Field label="Country">
        <Select
          value={country}
          onChange={(_, data) => {
            setCountry(data.value);
            setRegion('');
          }}
        >
          <option value="">Select country...</option>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
          <option value="ca">Canada</option>
        </Select>
      </Field>

      <Field label="Region">
        <Select
          value={region}
          onChange={(_, data) => setRegion(data.value)}
          disabled={!country}
        >
          <option value="">Select region...</option>
          {regions.map(r => (
            <option key={r} value={r.toLowerCase()}>{r}</option>
          ))}
        </Select>
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
| `Tab` | Move focus to/from select |
| `Space` / `Enter` | Open dropdown (browser-dependent) |
| `Arrow Up/Down` | Navigate options |
| `Home` / `End` | Jump to first/last option |
| `Escape` | Close dropdown |

### Best Practices

```typescript
// ✅ Always use with Field for labels
<Field label="Country">
  <Select>...</Select>
</Field>

// ✅ Provide a placeholder option
<Select>
  <option value="">Select an option...</option>
  ...
</Select>

// ✅ Use disabled for unavailable options
<option disabled>Currently unavailable</option>
```

---

## Select vs Combobox

| Use Select When | Use Combobox When |
|-----------------|-------------------|
| Simple list (< 20 options) | Large list of options |
| No search needed | Need to search/filter |
| Native HTML is sufficient | Need custom option rendering |
| Better mobile experience | Desktop-focused UI |

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Use Field for proper labeling
<Field label="Country" required>
  <Select>...</Select>
</Field>

// ✅ Include a placeholder/empty option
<Select>
  <option value="">Select...</option>
</Select>

// ✅ Use optgroup for categorization
<Select>
  <optgroup label="Fruits">
    <option>Apple</option>
  </optgroup>
</Select>
```

### ❌ Don'ts

```typescript
// ❌ Don't use without a label
<Select>...</Select>

// ❌ Don't use for very long lists (use Combobox)
<Select>
  {/* 100+ options */}
</Select>

// ❌ Don't disable without explanation
<Select disabled>...</Select>
```

---

## See Also

- [Combobox](combobox.md) - Searchable dropdown
- [Field](field.md) - Form field wrapper
- [Radio](radio.md) - For few mutually exclusive options
- [Component Index](../00-component-index.md) - All components