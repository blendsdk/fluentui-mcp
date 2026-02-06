# Basic Form Structure

> **File**: 03-patterns/forms/01-basic-forms.md
> **FluentUI Version**: 9.x

## Overview

This guide covers the fundamental patterns for building forms with FluentUI v9, focusing on the Field component, form layout, and proper structure.

## The Field Component

The `Field` component is the cornerstone of FluentUI v9 forms. It wraps form controls and provides:

- Label association
- Validation states and messages
- Hint text
- Required indicators
- Accessibility attributes

### Basic Field Usage

```tsx
import { Field, Input } from '@fluentui/react-components';

// Simple field with label
<Field label="Username">
  <Input />
</Field>

// Required field
<Field label="Email" required>
  <Input type="email" />
</Field>

// Field with hint
<Field label="Password" hint="Must be at least 8 characters">
  <Input type="password" />
</Field>
```

### Field Props Reference

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string \| ReactNode` | Field label text |
| `required` | `boolean` | Shows required indicator |
| `hint` | `string` | Help text below the control |
| `validationState` | `'error' \| 'warning' \| 'success' \| 'none'` | Validation visual state |
| `validationMessage` | `string \| ReactNode` | Validation message text |
| `validationMessageIcon` | `ReactNode` | Custom icon for validation |
| `orientation` | `'horizontal' \| 'vertical'` | Label position |
| `size` | `'small' \| 'medium' \| 'large'` | Field size |

## Form Layout Patterns

### Vertical Form (Default)

```tsx
import {
  Field,
  Input,
  Textarea,
  Select,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalM,
  },
});

export const VerticalForm = () => {
  const styles = useStyles();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Field label="Full Name" required>
        <Input name="name" placeholder="Enter your full name" />
      </Field>
      
      <Field label="Email" required>
        <Input name="email" type="email" placeholder="you@example.com" />
      </Field>
      
      <Field label="Department">
        <Select name="department">
          <option value="">Select a department</option>
          <option value="engineering">Engineering</option>
          <option value="design">Design</option>
          <option value="marketing">Marketing</option>
        </Select>
      </Field>
      
      <Field label="Bio" hint="Brief description about yourself">
        <Textarea name="bio" rows={3} />
      </Field>
      
      <div className={styles.actions}>
        <Button type="submit" appearance="primary">
          Submit
        </Button>
        <Button type="reset" appearance="secondary">
          Reset
        </Button>
      </div>
    </form>
  );
};
```

### Horizontal Form Layout

```tsx
import {
  Field,
  Input,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '600px',
  },
  field: {
    // Horizontal orientation styles handled by Field
  },
});

export const HorizontalForm = () => {
  const styles = useStyles();

  return (
    <form className={styles.form}>
      <Field label="First Name" orientation="horizontal" required>
        <Input name="firstName" />
      </Field>
      
      <Field label="Last Name" orientation="horizontal" required>
        <Input name="lastName" />
      </Field>
      
      <Field label="Email" orientation="horizontal" required>
        <Input name="email" type="email" />
      </Field>
    </form>
  );
};
```

### Two-Column Form Layout

```tsx
import {
  Field,
  Input,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingVerticalM,
    maxWidth: '800px',
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
});

export const TwoColumnForm = () => {
  const styles = useStyles();

  return (
    <form className={styles.form}>
      <Field label="First Name" required>
        <Input name="firstName" />
      </Field>
      
      <Field label="Last Name" required>
        <Input name="lastName" />
      </Field>
      
      <Field label="Email" required className={styles.fullWidth}>
        <Input name="email" type="email" />
      </Field>
      
      <Field label="City">
        <Input name="city" />
      </Field>
      
      <Field label="State">
        <Input name="state" />
      </Field>
      
      <Field label="Address" className={styles.fullWidth}>
        <Input name="address" />
      </Field>
    </form>
  );
};
```

## Form Sections

### Grouped Form Sections

```tsx
import {
  Field,
  Input,
  Divider,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    maxWidth: '500px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  sectionHeader: {
    marginBottom: tokens.spacingVerticalS,
  },
});

export const SectionedForm = () => {
  const styles = useStyles();

  return (
    <form className={styles.form}>
      {/* Personal Information Section */}
      <div className={styles.section}>
        <Text weight="semibold" size={400} className={styles.sectionHeader}>
          Personal Information
        </Text>
        <Field label="Full Name" required>
          <Input name="name" />
        </Field>
        <Field label="Email" required>
          <Input name="email" type="email" />
        </Field>
        <Field label="Phone">
          <Input name="phone" type="tel" />
        </Field>
      </div>

      <Divider />

      {/* Address Section */}
      <div className={styles.section}>
        <Text weight="semibold" size={400} className={styles.sectionHeader}>
          Address
        </Text>
        <Field label="Street Address">
          <Input name="street" />
        </Field>
        <Field label="City">
          <Input name="city" />
        </Field>
        <Field label="Postal Code">
          <Input name="postalCode" />
        </Field>
      </div>

      <Divider />

      {/* Preferences Section */}
      <div className={styles.section}>
        <Text weight="semibold" size={400} className={styles.sectionHeader}>
          Preferences
        </Text>
        <Field label="Timezone">
          <Input name="timezone" />
        </Field>
      </div>
    </form>
  );
};
```

## Supported Form Controls

FluentUI v9 provides many form controls that work with Field:

### Text Inputs

```tsx
import { Field, Input, Textarea } from '@fluentui/react-components';

// Standard input
<Field label="Name">
  <Input />
</Field>

// Email input
<Field label="Email">
  <Input type="email" />
</Field>

// Password input
<Field label="Password">
  <Input type="password" />
</Field>

// Textarea for longer text
<Field label="Description">
  <Textarea rows={4} resize="vertical" />
</Field>
```

### Selection Controls

```tsx
import {
  Field,
  Select,
  Combobox,
  Option,
  Dropdown,
} from '@fluentui/react-components';

// Select dropdown
<Field label="Country">
  <Select>
    <option value="">Select country</option>
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
    <option value="ca">Canada</option>
  </Select>
</Field>

// Combobox with autocomplete
<Field label="Language">
  <Combobox placeholder="Select or type a language">
    <Option>English</Option>
    <Option>Spanish</Option>
    <Option>French</Option>
    <Option>German</Option>
  </Combobox>
</Field>
```

### Toggle Controls

```tsx
import {
  Field,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
} from '@fluentui/react-components';

// Checkbox
<Field>
  <Checkbox label="I agree to the terms and conditions" />
</Field>

// Radio group
<Field label="Notification Preference">
  <RadioGroup>
    <Radio value="email" label="Email" />
    <Radio value="sms" label="SMS" />
    <Radio value="push" label="Push Notification" />
  </RadioGroup>
</Field>

// Switch
<Field>
  <Switch label="Enable notifications" />
</Field>
```

### Numeric Controls

```tsx
import { Field, Slider, SpinButton } from '@fluentui/react-components';

// Slider
<Field label="Volume">
  <Slider min={0} max={100} defaultValue={50} />
</Field>

// SpinButton for precise numbers
<Field label="Quantity">
  <SpinButton min={0} max={100} defaultValue={1} />
</Field>
```

## Accessibility Considerations

### Label Association

Field automatically associates labels with controls:

```tsx
// This is accessible - Field handles label association
<Field label="Email">
  <Input />
</Field>

// The above renders with proper htmlFor/id connection
```

### Required Fields

```tsx
// Visual indicator + aria-required
<Field label="Email" required>
  <Input />
</Field>
```

### Validation Announcements

```tsx
// aria-invalid and aria-describedby are set automatically
<Field
  label="Password"
  validationState="error"
  validationMessage="Password must be at least 8 characters"
>
  <Input type="password" />
</Field>
```

### Hint Text

```tsx
// Hints are associated via aria-describedby
<Field label="Username" hint="This will be your public display name">
  <Input />
</Field>
```

## Common Patterns

### Form with Initial Values

```tsx
import { useState } from 'react';
import { Field, Input, Button } from '@fluentui/react-components';

interface UserData {
  name: string;
  email: string;
}

export const EditForm = ({ initialData }: { initialData: UserData }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (field: keyof UserData) => (
    e: React.ChangeEvent<HTMLInputElement>,
    data: { value: string }
  ) => {
    setFormData(prev => ({ ...prev, [field]: data.value }));
  };

  return (
    <form>
      <Field label="Name">
        <Input
          value={formData.name}
          onChange={handleChange('name')}
        />
      </Field>
      <Field label="Email">
        <Input
          value={formData.email}
          onChange={handleChange('email')}
          type="email"
        />
      </Field>
      <Button type="submit">Save Changes</Button>
    </form>
  );
};
```

### Form Reset Pattern

```tsx
import { useState } from 'react';
import { Field, Input, Button, makeStyles, tokens } from '@fluentui/react-components';

const initialState = {
  name: '',
  email: '',
};

export const ResettableForm = () => {
  const [formData, setFormData] = useState(initialState);

  const handleReset = () => {
    setFormData(initialState);
  };

  return (
    <form>
      <Field label="Name">
        <Input
          value={formData.name}
          onChange={(e, data) => setFormData(prev => ({ ...prev, name: data.value }))}
        />
      </Field>
      <Field label="Email">
        <Input
          value={formData.email}
          onChange={(e, data) => setFormData(prev => ({ ...prev, email: data.value }))}
        />
      </Field>
      <Button type="button" onClick={handleReset}>
        Reset
      </Button>
      <Button type="submit" appearance="primary">
        Submit
      </Button>
    </form>
  );
};
```

## Related Documentation

- [02-validation.md](02-validation.md) - Form validation patterns
- [03-form-libraries.md](03-form-libraries.md) - Integration with form libraries
- [Field Component](../../02-components/forms/field.md)