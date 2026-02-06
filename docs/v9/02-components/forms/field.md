# Field

> **Package**: `@fluentui/react-field`
> **Import**: `import { Field } from '@fluentui/react-components'`
> **Category**: Forms

## Overview

Field is a wrapper component that provides consistent labeling, validation messaging, and hints for form controls. It associates labels with inputs using proper accessibility attributes.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Field, Input } from '@fluentui/react-components';

export const BasicField: React.FC = () => (
  <Field label="Email address">
    <Input type="email" />
  </Field>
);
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `Slot<typeof Label>` | - | Label for the field |
| `validationMessage` | `Slot<'span'>` | - | Message shown for validation |
| `validationMessageIcon` | `Slot<'span'>` | - | Icon shown with validation message |
| `validationState` | `'none' \| 'success' \| 'warning' \| 'error'` | `'none'` | Validation state |
| `hint` | `Slot<'span'>` | - | Hint text below the control |
| `required` | `boolean` | `false` | Shows required indicator |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the field |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Layout orientation |

### Slots

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<div>` | Root wrapper element |
| `label` | `<Label>` | Field label |
| `validationMessage` | `<span>` | Validation message text |
| `validationMessageIcon` | `<span>` | Validation icon |
| `hint` | `<span>` | Hint text |

---

## With Labels

### Required Field

```typescript
import * as React from 'react';
import { Field, Input } from '@fluentui/react-components';

export const RequiredField: React.FC = () => (
  <Field label="Username" required>
    <Input />
  </Field>
);
```

### Optional Indicator

```typescript
import * as React from 'react';
import { Field, Input, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const OptionalFields: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Email" required>
        <Input type="email" />
      </Field>
      <Field label="Phone (optional)">
        <Input type="tel" />
      </Field>
    </div>
  );
};
```

---

## Validation States

### All Validation States

```typescript
import * as React from 'react';
import { Field, Input, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    maxWidth: '400px',
  },
});

export const ValidationStates: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field
        label="Success State"
        validationState="success"
        validationMessage="Username is available"
      >
        <Input defaultValue="johndoe" />
      </Field>

      <Field
        label="Warning State"
        validationState="warning"
        validationMessage="Password could be stronger"
      >
        <Input type="password" defaultValue="password" />
      </Field>

      <Field
        label="Error State"
        validationState="error"
        validationMessage="Please enter a valid email address"
      >
        <Input type="email" defaultValue="invalid-email" />
      </Field>

      <Field
        label="No Validation"
        validationState="none"
      >
        <Input placeholder="Normal input" />
      </Field>
    </div>
  );
};
```

### Dynamic Validation

```typescript
import * as React from 'react';
import { Field, Input, makeStyles, tokens } from '@fluentui/react-components';
import type { InputOnChangeData } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const DynamicValidation: React.FC = () => {
  const styles = useStyles();
  const [email, setEmail] = React.useState('');
  const [touched, setTouched] = React.useState(false);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showError = touched && email && !isValid;
  const showSuccess = touched && email && isValid;

  const handleChange = React.useCallback(
    (_ev: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
      setEmail(data.value);
    },
    []
  );

  return (
    <div className={styles.form}>
      <Field
        label="Email"
        required
        validationState={showError ? 'error' : showSuccess ? 'success' : 'none'}
        validationMessage={
          showError ? 'Please enter a valid email' :
          showSuccess ? 'Email looks good!' : undefined
        }
      >
        <Input
          type="email"
          value={email}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          placeholder="email@example.com"
        />
      </Field>
    </div>
  );
};
```

---

## Hint Text

```typescript
import * as React from 'react';
import { Field, Input, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const FieldWithHint: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field
        label="Password"
        hint="Must be at least 8 characters with one number"
      >
        <Input type="password" />
      </Field>

      <Field
        label="Username"
        hint="Only letters, numbers, and underscores allowed"
      >
        <Input />
      </Field>
    </div>
  );
};
```

### Hint with Validation

```typescript
import * as React from 'react';
import { Field, Input } from '@fluentui/react-components';

export const HintAndValidation: React.FC = () => {
  const [value, setValue] = React.useState('');
  const hasError = value.length > 0 && value.length < 3;

  return (
    <Field
      label="Display Name"
      hint="This will be visible to other users"
      validationState={hasError ? 'error' : 'none'}
      validationMessage={hasError ? 'Name must be at least 3 characters' : undefined}
    >
      <Input
        value={value}
        onChange={(_, data) => setValue(data.value)}
      />
    </Field>
  );
};
```

---

## Size Variants

```typescript
import * as React from 'react';
import { Field, Input, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    maxWidth: '400px',
  },
});

export const FieldSizes: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Small Field" size="small">
        <Input size="small" />
      </Field>

      <Field label="Medium Field" size="medium">
        <Input size="medium" />
      </Field>

      <Field label="Large Field" size="large">
        <Input size="large" />
      </Field>
    </div>
  );
};
```

---

## Orientation

### Horizontal Layout

```typescript
import * as React from 'react';
import { Field, Input, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '600px',
  },
});

export const HorizontalFields: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="First Name" orientation="horizontal">
        <Input />
      </Field>

      <Field label="Last Name" orientation="horizontal">
        <Input />
      </Field>

      <Field
        label="Email"
        orientation="horizontal"
        validationState="error"
        validationMessage="Email is required"
      >
        <Input type="email" />
      </Field>
    </div>
  );
};
```

---

## With Different Controls

Field works with any form control:

```typescript
import * as React from 'react';
import {
  Field,
  Input,
  Textarea,
  Select,
  Checkbox,
  Switch,
  Slider,
  SpinButton,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    maxWidth: '400px',
  },
});

export const FieldWithControls: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Name">
        <Input />
      </Field>

      <Field label="Description">
        <Textarea />
      </Field>

      <Field label="Country">
        <Select>
          <option value="">Select...</option>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
        </Select>
      </Field>

      <Field label="Volume">
        <Slider defaultValue={50} />
      </Field>

      <Field label="Quantity">
        <SpinButton defaultValue={1} min={1} max={10} />
      </Field>

      {/* Checkbox and Switch typically don't use Field */}
      <Checkbox label="I agree to terms" />
      <Switch label="Enable notifications" />
    </div>
  );
};
```

---

## Accessibility

### Automatic Label Association

Field automatically creates proper label associations:

```typescript
// Field generates proper accessibility attributes
<Field label="Email">
  <Input />
</Field>

// Renders approximately as:
// <div>
//   <label id="field-label-1" for="input-1">Email</label>
//   <input id="input-1" aria-labelledby="field-label-1" />
// </div>
```

### With Validation

```typescript
// Validation messages are properly associated
<Field
  label="Password"
  validationState="error"
  validationMessage="Password is required"
>
  <Input type="password" />
</Field>

// Renders with aria-describedby pointing to the validation message
// and aria-invalid="true" on the input
```

### Screen Reader Announcements

- Label is announced when field receives focus
- Validation messages are announced via `aria-describedby`
- Error states announce `aria-invalid="true"`
- Hint text is included in field description

---

## Styling Customization

### Custom Field Styles

```typescript
import * as React from 'react';
import {
  Field,
  Input,
  makeStyles,
  tokens,
  fieldClassNames,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  customField: {
    [`& .${fieldClassNames.label}`]: {
      fontWeight: tokens.fontWeightSemibold,
      color: tokens.colorBrandForeground1,
    },
    [`& .${fieldClassNames.hint}`]: {
      fontStyle: 'italic',
    },
    [`& .${fieldClassNames.validationMessage}`]: {
      fontSize: tokens.fontSizeBase200,
    },
  },
});

export const CustomStyledField: React.FC = () => {
  const styles = useStyles();

  return (
    <Field
      className={styles.customField}
      label="Custom Styled Field"
      hint="This field has custom styling"
    >
      <Input />
    </Field>
  );
};
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Always use Field for form inputs
<Field label="Email" required>
  <Input type="email" />
</Field>

// ✅ Show validation messages
<Field
  label="Password"
  validationState={error ? 'error' : 'none'}
  validationMessage={error}
>
  <Input type="password" />
</Field>

// ✅ Provide helpful hints
<Field
  label="Phone Number"
  hint="Include country code (e.g., +1)"
>
  <Input type="tel" />
</Field>

// ✅ Use appropriate sizes consistently
<Field label="Name" size="large">
  <Input size="large" />
</Field>
```

### ❌ Don'ts

```typescript
// ❌ Don't use Input without Field in forms
<Input placeholder="Email" /> // Missing label

// ❌ Don't mix sizes between Field and control
<Field label="Name" size="large">
  <Input size="small" /> // Mismatched sizes
</Field>

// ❌ Don't omit validation feedback
<Input
  type="email"
  aria-invalid={hasError}
/> // Missing visible error message
```

---

## See Also

- [Input](input.md) - Text input component
- [Textarea](textarea.md) - Multi-line text input
- [Select](select.md) - Select dropdown
- [Component Index](../00-component-index.md) - All components