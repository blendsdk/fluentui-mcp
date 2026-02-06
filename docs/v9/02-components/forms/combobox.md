# Combobox

> **Package**: `@fluentui/react-combobox`
> **Import**: `import { Combobox, Option } from '@fluentui/react-components'`
> **Category**: Forms

## Overview

Combobox is a searchable dropdown that allows users to filter and select from a list of options. It combines the functionality of a text input with a dropdown list, supporting single or multi-select scenarios.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Combobox, Option } from '@fluentui/react-components';

export const BasicCombobox: React.FC = () => (
  <Combobox placeholder="Select a fruit">
    <Option value="apple">Apple</Option>
    <Option value="banana">Banana</Option>
    <Option value="orange">Orange</Option>
    <Option value="grape">Grape</Option>
  </Combobox>
);
```

---

## Props Reference

### Combobox Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appearance` | `'outline' \| 'underline' \| 'filled-darker' \| 'filled-lighter'` | `'outline'` | Visual style |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the combobox |
| `disabled` | `boolean` | `false` | Disabled state |
| `multiselect` | `boolean` | `false` | Allow multiple selections |
| `freeform` | `boolean` | `false` | Allow custom values not in options |
| `placeholder` | `string` | - | Placeholder text |
| `value` | `string` | - | Controlled input value |
| `selectedOptions` | `string[]` | - | Controlled selected options |
| `defaultValue` | `string` | - | Default input value |
| `defaultSelectedOptions` | `string[]` | - | Default selected options |
| `onOptionSelect` | `(ev, data) => void` | - | Selection change handler |
| `onChange` | `(ev, data) => void` | - | Input value change handler |

### Option Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | Value of the option |
| `text` | `string` | children | Text content for filtering |
| `disabled` | `boolean` | `false` | Disabled state |

### Slots

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<div>` | Root wrapper element |
| `input` | `<input>` | Text input element |
| `expandIcon` | `<span>` | Dropdown icon |
| `clearIcon` | `<span>` | Clear button icon |
| `listbox` | `<div>` | Dropdown list container |

---

## Controlled vs Uncontrolled

### Uncontrolled

```typescript
import * as React from 'react';
import { Combobox, Option } from '@fluentui/react-components';

export const UncontrolledCombobox: React.FC = () => (
  <Combobox defaultSelectedOptions={['apple']} placeholder="Select a fruit">
    <Option value="apple">Apple</Option>
    <Option value="banana">Banana</Option>
    <Option value="orange">Orange</Option>
  </Combobox>
);
```

### Controlled

```typescript
import * as React from 'react';
import { Combobox, Option, makeStyles, tokens, Text } from '@fluentui/react-components';
import type { ComboboxProps } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '300px',
  },
});

export const ControlledCombobox: React.FC = () => {
  const styles = useStyles();
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

  const handleOptionSelect: ComboboxProps['onOptionSelect'] = (_, data) => {
    setSelectedOptions(data.selectedOptions);
  };

  return (
    <div className={styles.container}>
      <Combobox
        selectedOptions={selectedOptions}
        onOptionSelect={handleOptionSelect}
        placeholder="Select a color"
      >
        <Option value="red">Red</Option>
        <Option value="green">Green</Option>
        <Option value="blue">Blue</Option>
      </Combobox>
      <Text>Selected: {selectedOptions.join(', ') || 'None'}</Text>
    </div>
  );
};
```

---

## Appearance Variants

```typescript
import * as React from 'react';
import { Combobox, Option, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '300px',
  },
});

export const ComboboxAppearances: React.FC = () => {
  const styles = useStyles();

  const options = (
    <>
      <Option value="1">Option 1</Option>
      <Option value="2">Option 2</Option>
      <Option value="3">Option 3</Option>
    </>
  );

  return (
    <div className={styles.form}>
      <Field label="Outline (default)">
        <Combobox appearance="outline" placeholder="Select...">
          {options}
        </Combobox>
      </Field>

      <Field label="Underline">
        <Combobox appearance="underline" placeholder="Select...">
          {options}
        </Combobox>
      </Field>

      <Field label="Filled Darker">
        <Combobox appearance="filled-darker" placeholder="Select...">
          {options}
        </Combobox>
      </Field>

      <Field label="Filled Lighter">
        <Combobox appearance="filled-lighter" placeholder="Select...">
          {options}
        </Combobox>
      </Field>
    </div>
  );
};
```

---

## Size Variants

```typescript
import * as React from 'react';
import { Combobox, Option, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '300px',
  },
});

export const ComboboxSizes: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Small" size="small">
        <Combobox size="small" placeholder="Select...">
          <Option>Option 1</Option>
          <Option>Option 2</Option>
        </Combobox>
      </Field>

      <Field label="Medium" size="medium">
        <Combobox size="medium" placeholder="Select...">
          <Option>Option 1</Option>
          <Option>Option 2</Option>
        </Combobox>
      </Field>

      <Field label="Large" size="large">
        <Combobox size="large" placeholder="Select...">
          <Option>Option 1</Option>
          <Option>Option 2</Option>
        </Combobox>
      </Field>
    </div>
  );
};
```

---

## Multiselect

```typescript
import * as React from 'react';
import { Combobox, Option, Field, makeStyles, tokens, Text } from '@fluentui/react-components';
import type { ComboboxProps } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '300px',
  },
});

export const MultiselectCombobox: React.FC = () => {
  const styles = useStyles();
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

  const handleOptionSelect: ComboboxProps['onOptionSelect'] = (_, data) => {
    setSelectedOptions(data.selectedOptions);
  };

  return (
    <div className={styles.container}>
      <Field label="Select skills">
        <Combobox
          multiselect
          selectedOptions={selectedOptions}
          onOptionSelect={handleOptionSelect}
          placeholder="Choose skills..."
        >
          <Option value="javascript">JavaScript</Option>
          <Option value="typescript">TypeScript</Option>
          <Option value="react">React</Option>
          <Option value="angular">Angular</Option>
          <Option value="vue">Vue</Option>
          <Option value="node">Node.js</Option>
        </Combobox>
      </Field>
      <Text size={200}>Selected: {selectedOptions.join(', ') || 'None'}</Text>
    </div>
  );
};
```

---

## Freeform (Custom Values)

```typescript
import * as React from 'react';
import { Combobox, Option, Field, makeStyles, tokens } from '@fluentui/react-components';
import type { ComboboxProps } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '300px',
  },
});

export const FreeformCombobox: React.FC = () => {
  const styles = useStyles();
  const [options, setOptions] = React.useState(['Red', 'Green', 'Blue']);
  const [value, setValue] = React.useState('');

  const handleOptionSelect: ComboboxProps['onOptionSelect'] = (_, data) => {
    if (data.optionValue && !options.includes(data.optionValue)) {
      setOptions(prev => [...prev, data.optionValue!]);
    }
    setValue(data.optionText ?? '');
  };

  return (
    <div className={styles.container}>
      <Field label="Color (type to add custom)" hint="You can type a custom color">
        <Combobox
          freeform
          value={value}
          onOptionSelect={handleOptionSelect}
          onChange={(_, data) => setValue(data.value)}
          placeholder="Select or type..."
        >
          {options.map(option => (
            <Option key={option} value={option}>{option}</Option>
          ))}
        </Combobox>
      </Field>
    </div>
  );
};
```

---

## With Filtering

```typescript
import * as React from 'react';
import { Combobox, Option, Field, makeStyles, tokens } from '@fluentui/react-components';
import type { ComboboxProps } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    maxWidth: '300px',
  },
});

const allCountries = [
  'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada',
  'China', 'Denmark', 'Finland', 'France', 'Germany', 'India',
  'Italy', 'Japan', 'Mexico', 'Netherlands', 'Norway', 'Poland',
  'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'United States',
];

export const FilteringCombobox: React.FC = () => {
  const styles = useStyles();
  const [query, setQuery] = React.useState('');

  const filteredOptions = React.useMemo(() => {
    if (!query) return allCountries;
    return allCountries.filter(country =>
      country.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const handleChange: ComboboxProps['onChange'] = (_, data) => {
    setQuery(data.value);
  };

  return (
    <div className={styles.container}>
      <Field label="Country">
        <Combobox
          value={query}
          onChange={handleChange}
          onOptionSelect={(_, data) => setQuery(data.optionText ?? '')}
          placeholder="Type to search..."
        >
          {filteredOptions.map(country => (
            <Option key={country} value={country}>{country}</Option>
          ))}
          {filteredOptions.length === 0 && (
            <Option disabled value="">No results found</Option>
          )}
        </Combobox>
      </Field>
    </div>
  );
};
```

---

## Option Groups

```typescript
import * as React from 'react';
import { Combobox, Option, OptionGroup, Field } from '@fluentui/react-components';

export const GroupedCombobox: React.FC = () => (
  <Field label="Select a city" style={{ maxWidth: '300px' }}>
    <Combobox placeholder="Choose a city...">
      <OptionGroup label="North America">
        <Option value="nyc">New York</Option>
        <Option value="la">Los Angeles</Option>
        <Option value="toronto">Toronto</Option>
        <Option value="vancouver">Vancouver</Option>
      </OptionGroup>
      <OptionGroup label="Europe">
        <Option value="london">London</Option>
        <Option value="paris">Paris</Option>
        <Option value="berlin">Berlin</Option>
        <Option value="amsterdam">Amsterdam</Option>
      </OptionGroup>
      <OptionGroup label="Asia">
        <Option value="tokyo">Tokyo</Option>
        <Option value="singapore">Singapore</Option>
        <Option value="seoul">Seoul</Option>
      </OptionGroup>
    </Combobox>
  </Field>
);
```

---

## Disabled States

```typescript
import * as React from 'react';
import { Combobox, Option, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '300px',
  },
});

export const DisabledCombobox: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Disabled Combobox">
        <Combobox disabled placeholder="Select...">
          <Option>Option 1</Option>
          <Option>Option 2</Option>
        </Combobox>
      </Field>

      <Field label="Disabled Options">
        <Combobox placeholder="Select...">
          <Option value="available1">Available</Option>
          <Option value="unavailable" disabled>Unavailable</Option>
          <Option value="available2">Also Available</Option>
        </Combobox>
      </Field>
    </div>
  );
};
```

---

## With Field Component

```typescript
import * as React from 'react';
import { Combobox, Option, Field, makeStyles, tokens } from '@fluentui/react-components';
import type { ComboboxProps } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '300px',
  },
});

export const ComboboxWithField: React.FC = () => {
  const styles = useStyles();
  const [selected, setSelected] = React.useState<string[]>([]);
  const hasError = selected.length === 0;

  const handleOptionSelect: ComboboxProps['onOptionSelect'] = (_, data) => {
    setSelected(data.selectedOptions);
  };

  return (
    <div className={styles.form}>
      <Field
        label="Department"
        required
        validationState={hasError ? 'error' : 'success'}
        validationMessage={hasError ? 'Please select a department' : 'Looks good!'}
      >
        <Combobox
          selectedOptions={selected}
          onOptionSelect={handleOptionSelect}
          placeholder="Select department..."
        >
          <Option value="engineering">Engineering</Option>
          <Option value="design">Design</Option>
          <Option value="marketing">Marketing</Option>
          <Option value="sales">Sales</Option>
          <Option value="hr">Human Resources</Option>
        </Combobox>
      </Field>

      <Field label="Team" hint="Optional">
        <Combobox placeholder="Select team...">
          <Option value="frontend">Frontend</Option>
          <Option value="backend">Backend</Option>
          <Option value="mobile">Mobile</Option>
        </Combobox>
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
| `Tab` | Move focus to/from combobox |
| `Enter` | Open listbox / Select highlighted option |
| `Escape` | Close listbox |
| `Arrow Down` | Open listbox / Move to next option |
| `Arrow Up` | Move to previous option |
| `Home` | Move to first option |
| `End` | Move to last option |
| `Type characters` | Filter options |

### ARIA Attributes

| Attribute | Element | Description |
|-----------|---------|-------------|
| `role="combobox"` | input | Identifies as combobox |
| `aria-expanded` | input | Listbox open state |
| `aria-autocomplete` | input | Autocomplete behavior |
| `aria-controls` | input | References listbox |
| `role="listbox"` | dropdown | Identifies option container |
| `role="option"` | Option | Identifies each option |
| `aria-selected` | Option | Selection state |

### Best Practices

```typescript
// ✅ Always use with Field for labels
<Field label="Country">
  <Combobox>...</Combobox>
</Field>

// ✅ Provide clear placeholder
<Combobox placeholder="Search or select...">

// ✅ Use Option text for filtering
<Option value="usa" text="United States of America">
  🇺🇸 USA
</Option>
```

---

## Combobox vs Select

| Use Combobox When | Use Select When |
|-------------------|-----------------|
| Need to search/filter options | Simple list (< 10 options) |
| Large list of options | Native HTML select is sufficient |
| Custom option rendering | Better mobile experience needed |
| Need multiselect | Don't need search functionality |

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Use Field for proper labeling
<Field label="Country">
  <Combobox>...</Combobox>
</Field>

// ✅ Provide meaningful placeholder
<Combobox placeholder="Search countries...">

// ✅ Use option groups for categorization
<OptionGroup label="Popular">
  <Option>Option 1</Option>
</OptionGroup>

// ✅ Handle no results state
{filteredOptions.length === 0 && (
  <Option disabled>No results found</Option>
)}
```

### ❌ Don'ts

```typescript
// ❌ Don't use without a label
<Combobox>...</Combobox>

// ❌ Don't use for very small option lists (use Select)
<Combobox>
  <Option>Yes</Option>
  <Option>No</Option>
</Combobox>

// ❌ Don't forget to handle empty state
{options.map(o => <Option>{o}</Option>)}
// Missing: what if options is empty?
```

---

## See Also

- [Select](select.md) - Native HTML select dropdown
- [Field](field.md) - Form field wrapper
- [Input](input.md) - Text input component
- [Component Index](../00-component-index.md) - All components