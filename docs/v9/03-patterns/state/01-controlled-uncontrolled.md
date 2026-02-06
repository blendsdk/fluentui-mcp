# Controlled & Uncontrolled Components

> **Module**: 03-patterns/state
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02

## Overview

FluentUI v9 components support both **controlled** (you own the state) and **uncontrolled** (component owns the state) modes. Understanding when to use each mode is fundamental to building forms and interactive UIs.

---

## Controlled Components

In controlled mode, you provide the current value via `value` and update it via `onChange`. The component never manages its own state — your code is the single source of truth.

### Text Input

```tsx
import * as React from 'react';
import { Input, Field } from '@fluentui/react-components';

function ControlledInput() {
  const [name, setName] = React.useState('');

  return (
    <Field label="Name">
      <Input
        value={name}
        onChange={(e, data) => setName(data.value)}
      />
    </Field>
  );
}
```

### Textarea

```tsx
import * as React from 'react';
import { Textarea, Field } from '@fluentui/react-components';

function ControlledTextarea() {
  const [bio, setBio] = React.useState('');

  return (
    <Field label="Bio" hint={`${bio.length}/500 characters`}>
      <Textarea
        value={bio}
        onChange={(e, data) => setBio(data.value)}
        maxLength={500}
      />
    </Field>
  );
}
```

### Checkbox

```tsx
import * as React from 'react';
import { Checkbox } from '@fluentui/react-components';

function ControlledCheckbox() {
  const [agreed, setAgreed] = React.useState(false);

  return (
    <Checkbox
      checked={agreed}
      onChange={(e, data) => setAgreed(data.checked as boolean)}
      label="I agree to the terms"
    />
  );
}
```

### Select

```tsx
import * as React from 'react';
import { Select, Field } from '@fluentui/react-components';

function ControlledSelect() {
  const [country, setCountry] = React.useState('us');

  return (
    <Field label="Country">
      <Select
        value={country}
        onChange={(e, data) => setCountry(data.value)}
      >
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
        <option value="de">Germany</option>
      </Select>
    </Field>
  );
}
```

### Switch

```tsx
import * as React from 'react';
import { Switch } from '@fluentui/react-components';

function ControlledSwitch() {
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <Switch
      checked={darkMode}
      onChange={(e, data) => setDarkMode(data.checked)}
      label="Dark mode"
    />
  );
}
```

### Slider

```tsx
import * as React from 'react';
import { Slider, Field, Label } from '@fluentui/react-components';

function ControlledSlider() {
  const [volume, setVolume] = React.useState(50);

  return (
    <Field label={`Volume: ${volume}%`}>
      <Slider
        value={volume}
        onChange={(e, data) => setVolume(data.value)}
        min={0}
        max={100}
      />
    </Field>
  );
}
```

### RadioGroup

```tsx
import * as React from 'react';
import { RadioGroup, Radio, Field } from '@fluentui/react-components';

function ControlledRadioGroup() {
  const [size, setSize] = React.useState('medium');

  return (
    <Field label="Size">
      <RadioGroup
        value={size}
        onChange={(e, data) => setSize(data.value)}
      >
        <Radio value="small" label="Small" />
        <Radio value="medium" label="Medium" />
        <Radio value="large" label="Large" />
      </RadioGroup>
    </Field>
  );
}
```

### Combobox

```tsx
import * as React from 'react';
import {
  Combobox,
  Option,
  Field,
} from '@fluentui/react-components';

function ControlledCombobox() {
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState('');

  return (
    <Field label="Fruit">
      <Combobox
        value={inputValue}
        selectedOptions={selectedOptions}
        onOptionSelect={(e, data) => {
          setSelectedOptions(data.selectedOptions);
          setInputValue(data.optionText ?? '');
        }}
        onChange={(e) => setInputValue(e.target.value)}
      >
        <Option>Apple</Option>
        <Option>Banana</Option>
        <Option>Cherry</Option>
      </Combobox>
    </Field>
  );
}
```

> **Note:** Combobox has two separate controls: `value` for the text input display and `selectedOptions` for the selected items. Both must be controlled together.

---

## Uncontrolled Components

In uncontrolled mode, the component manages its own internal state. You provide an initial value via `defaultValue` and read the current value via a `ref` or event handlers.

### When to Use Uncontrolled

- Simple forms where you only need values on submit
- Performance-sensitive forms (avoids re-renders on every keystroke)
- Third-party form library integration that manages its own refs

### Text Input

```tsx
import * as React from 'react';
import { Input, Field, Button } from '@fluentui/react-components';

function UncontrolledInput() {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const value = inputRef.current?.value;
    console.log('Submitted:', value);
  };

  return (
    <div>
      <Field label="Name">
        <Input defaultValue="" ref={inputRef} />
      </Field>
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
```

### Checkbox

```tsx
import * as React from 'react';
import { Checkbox } from '@fluentui/react-components';

function UncontrolledCheckbox() {
  return (
    <Checkbox
      defaultChecked={false}
      onChange={(e, data) => {
        // React to changes without controlling state
        console.log('Checked:', data.checked);
      }}
      label="Receive notifications"
    />
  );
}
```

### Tabs

```tsx
import * as React from 'react';
import { TabList, Tab } from '@fluentui/react-components';

function UncontrolledTabs() {
  return (
    <TabList
      defaultSelectedValue="overview"
      onTabSelect={(e, data) => {
        console.log('Tab changed to:', data.value);
      }}
    >
      <Tab value="overview">Overview</Tab>
      <Tab value="details">Details</Tab>
      <Tab value="history">History</Tab>
    </TabList>
  );
}
```

---

## Hybrid Pattern: Uncontrolled with Event Tracking

Sometimes you want uncontrolled behavior (no re-renders) but still need to track the value:

```tsx
import * as React from 'react';
import { Input, Field } from '@fluentui/react-components';

function HybridInput() {
  // Track value without causing re-renders
  const valueRef = React.useRef('');

  return (
    <Field label="Search">
      <Input
        defaultValue=""
        onChange={(e, data) => {
          // Update ref without re-render
          valueRef.current = data.value;
        }}
      />
    </Field>
  );
}
```

---

## Controlled vs Uncontrolled Decision Guide

| Factor | Controlled | Uncontrolled |
|--------|-----------|-------------|
| **Re-renders** | On every change | Only on submit |
| **Validation** | Real-time possible | On submit only |
| **Value access** | Always available in state | Via ref or events |
| **Computed UI** | Easy (character count, etc.) | Harder |
| **Form libraries** | React Hook Form, Formik | Native form data |
| **Complexity** | More boilerplate | Less boilerplate |
| **Debugging** | Easier (state visible) | Harder (ref-based) |

### Rule of Thumb

- **Use controlled** when you need real-time validation, computed UI (character counts, conditional rendering), or your form library requires it
- **Use uncontrolled** for simple forms, performance-critical scenarios, or when you only need values at submit time

---

## Common Mistakes

### ❌ Using `e.target.value` Instead of `data.value`

```tsx
// ❌ Wrong — FluentUI doesn't always use native input events
<Input onChange={(e) => setValue(e.target.value)} />

// ✅ Correct — Always use the data parameter
<Input onChange={(e, data) => setValue(data.value)} />
```

### ❌ Mixing Controlled and Uncontrolled

```tsx
// ❌ Wrong — Don't provide both value and defaultValue
<Input value={name} defaultValue="initial" />

// ✅ Correct — Choose one mode
<Input value={name} onChange={(e, data) => setName(data.value)} />
// OR
<Input defaultValue="initial" />
```

### ❌ Forgetting to Update State in Controlled Mode

```tsx
// ❌ Wrong — Input will appear frozen (value never changes)
<Input value={name} />

// ✅ Correct — Always provide onChange with controlled value
<Input value={name} onChange={(e, data) => setName(data.value)} />
```

---

## Related Documentation

- [Form State](02-form-state.md) — Managing multi-field form state
- [Form Patterns](../forms/00-forms-index.md) — Complete form implementation examples
- [Form Libraries Integration](../forms/03-form-libraries.md) — React Hook Form and Formik
