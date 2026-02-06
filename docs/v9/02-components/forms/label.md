# Label

> **Package**: `@fluentui/react-label`
> **Import**: `import { Label } from '@fluentui/react-components'`
> **Category**: Forms

## Overview

Label is a text component for labeling form controls. It automatically handles proper label associations and supports required indicators.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Label, Input, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
});

export const BasicLabel: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.field}>
      <Label htmlFor="input-1">Email address</Label>
      <Input id="input-1" type="email" />
    </div>
  );
};
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Grayed out appearance |
| `required` | `boolean` | `false` | Shows required indicator (*) |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of label text |
| `weight` | `'regular' \| 'semibold'` | `'regular'` | Font weight |
| `htmlFor` | `string` | - | Associates with form control |

### Slots

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<label>` | Root label element |
| `required` | `<span>` | Required indicator (*) |

---

## Required Indicator

```typescript
import * as React from 'react';
import { Label, Input, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '300px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
});

export const RequiredLabel: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <div className={styles.field}>
        <Label htmlFor="name-input" required>Name</Label>
        <Input id="name-input" required />
      </div>

      <div className={styles.field}>
        <Label htmlFor="email-input" required>Email</Label>
        <Input id="email-input" type="email" required />
      </div>

      <div className={styles.field}>
        <Label htmlFor="phone-input">Phone (optional)</Label>
        <Input id="phone-input" type="tel" />
      </div>
    </div>
  );
};
```

---

## Size Variants

```typescript
import * as React from 'react';
import { Label, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

export const LabelSizes: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Label size="small">Small label</Label>
      <Label size="medium">Medium label (default)</Label>
      <Label size="large">Large label</Label>
    </div>
  );
};
```

| Size | Use Case |
|------|----------|
| `small` | Compact forms, secondary labels |
| `medium` | Standard form fields (default) |
| `large` | Prominent fields, headings |

---

## Weight Variants

```typescript
import * as React from 'react';
import { Label, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

export const LabelWeights: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Label weight="regular">Regular weight (default)</Label>
      <Label weight="semibold">Semibold weight</Label>
    </div>
  );
};
```

---

## Disabled State

```typescript
import * as React from 'react';
import { Label, Input, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
});

export const DisabledLabel: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.field}>
      <Label htmlFor="disabled-input" disabled>Disabled field</Label>
      <Input id="disabled-input" disabled defaultValue="Cannot edit" />
    </div>
  );
};
```

---

## When to Use Label vs Field

**Use Label directly when:**
- Building custom form layouts
- Need precise control over label placement
- Creating non-standard form controls

**Use Field instead when:**
- Standard vertical form layout
- Need validation messages
- Need hint text

```typescript
// Using Label directly
<div className={styles.field}>
  <Label htmlFor="custom-input">Custom layout</Label>
  <Input id="custom-input" />
</div>

// Using Field (recommended for most cases)
<Field label="Standard form field">
  <Input />
</Field>
```

---

## Accessibility

### Label Association

Always connect labels to inputs using `htmlFor`:

```typescript
// ✅ Proper association
<Label htmlFor="username">Username</Label>
<Input id="username" />

// ❌ No association (bad for accessibility)
<Label>Username</Label>
<Input />
```

### Screen Reader Support

- Labels are announced when inputs receive focus
- Required indicators are announced
- Disabled state is communicated

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Always associate with form control
<Label htmlFor="email">Email</Label>
<Input id="email" />

// ✅ Use required indicator for mandatory fields
<Label required>Name</Label>

// ✅ Match label and input sizes
<Label size="large">Title</Label>
<Input size="large" />
```

### ❌ Don'ts

```typescript
// ❌ Don't use without htmlFor association
<Label>Name</Label>
<Input /> // No association

// ❌ Don't rely only on placeholder for labeling
<Input placeholder="Enter name" /> // No label

// ❌ Don't hide required indicators
<Label>Name (required)</Label> // Use required prop instead
```

---

## See Also

- [Field](field.md) - Complete form field wrapper
- [Input](input.md) - Text input component
- [Component Index](../00-component-index.md) - All components