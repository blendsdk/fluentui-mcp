# Textarea

> **Package**: `@fluentui/react-textarea`
> **Import**: `import { Textarea } from '@fluentui/react-components'`
> **Category**: Forms

## Overview

Textarea provides a multi-line text input field. It supports all the same appearances and sizes as Input, plus auto-resize functionality.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Textarea } from '@fluentui/react-components';

export const BasicTextarea: React.FC = () => (
  <Textarea placeholder="Enter your message..." />
);
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appearance` | `'outline' \| 'underline' \| 'filled-darker' \| 'filled-lighter'` | `'outline'` | Visual style |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the textarea |
| `resize` | `'none' \| 'both' \| 'horizontal' \| 'vertical'` | `'none'` | Allow resizing |
| `value` | `string` | - | Controlled value |
| `defaultValue` | `string` | - | Default value (uncontrolled) |
| `disabled` | `boolean` | `false` | Disabled state |
| `placeholder` | `string` | - | Placeholder text |
| `rows` | `number` | - | Number of visible rows |
| `onChange` | `(ev, data) => void` | - | Change handler |

### Slots

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<span>` | Wrapper element with borders |
| `textarea` | `<textarea>` | The actual textarea element |

---

## Controlled vs Uncontrolled

### Uncontrolled

```typescript
import * as React from 'react';
import { Textarea } from '@fluentui/react-components';

export const UncontrolledTextarea: React.FC = () => (
  <Textarea defaultValue="Initial text" rows={4} />
);
```

### Controlled

```typescript
import * as React from 'react';
import { Textarea, makeStyles, tokens, Text } from '@fluentui/react-components';
import type { TextareaOnChangeData } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const ControlledTextarea: React.FC = () => {
  const styles = useStyles();
  const [value, setValue] = React.useState('');
  const maxLength = 500;

  const handleChange = React.useCallback(
    (_ev: React.ChangeEvent<HTMLTextAreaElement>, data: TextareaOnChangeData) => {
      setValue(data.value);
    },
    []
  );

  return (
    <div className={styles.container}>
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder="Type your message..."
        rows={4}
        maxLength={maxLength}
      />
      <Text size={200}>
        {value.length} / {maxLength} characters
      </Text>
    </div>
  );
};
```

---

## Appearance Variants

```typescript
import * as React from 'react';
import { Textarea, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const TextareaAppearances: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Outline (default)">
        <Textarea appearance="outline" placeholder="Outline appearance" />
      </Field>

      <Field label="Underline">
        <Textarea appearance="underline" placeholder="Underline appearance" />
      </Field>

      <Field label="Filled Darker">
        <Textarea appearance="filled-darker" placeholder="Filled darker" />
      </Field>

      <Field label="Filled Lighter">
        <Textarea appearance="filled-lighter" placeholder="Filled lighter" />
      </Field>
    </div>
  );
};
```

---

## Size Variants

```typescript
import * as React from 'react';
import { Textarea, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const TextareaSizes: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Small" size="small">
        <Textarea size="small" placeholder="Small textarea" />
      </Field>

      <Field label="Medium" size="medium">
        <Textarea size="medium" placeholder="Medium textarea" />
      </Field>

      <Field label="Large" size="large">
        <Textarea size="large" placeholder="Large textarea" />
      </Field>
    </div>
  );
};
```

---

## Resize Options

```typescript
import * as React from 'react';
import { Textarea, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const TextareaResize: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="No resize (default)">
        <Textarea resize="none" placeholder="Cannot resize" rows={3} />
      </Field>

      <Field label="Vertical resize">
        <Textarea resize="vertical" placeholder="Resize vertically" rows={3} />
      </Field>

      <Field label="Horizontal resize">
        <Textarea resize="horizontal" placeholder="Resize horizontally" rows={3} />
      </Field>

      <Field label="Both directions">
        <Textarea resize="both" placeholder="Resize both ways" rows={3} />
      </Field>
    </div>
  );
};
```

---

## With Field Component

```typescript
import * as React from 'react';
import { Textarea, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const TextareaWithField: React.FC = () => {
  const styles = useStyles();
  const [bio, setBio] = React.useState('');
  const minLength = 50;
  const hasError = bio.length > 0 && bio.length < minLength;

  return (
    <div className={styles.form}>
      <Field label="Description" required>
        <Textarea placeholder="Enter description..." rows={4} />
      </Field>

      <Field
        label="Bio"
        hint={`Minimum ${minLength} characters`}
        validationState={hasError ? 'warning' : 'none'}
        validationMessage={hasError ? `Please enter at least ${minLength} characters` : undefined}
      >
        <Textarea
          value={bio}
          onChange={(_, data) => setBio(data.value)}
          placeholder="Tell us about yourself..."
          rows={4}
        />
      </Field>

      <Field label="Notes" hint="Optional">
        <Textarea placeholder="Additional notes..." rows={3} resize="vertical" />
      </Field>
    </div>
  );
};
```

---

## Row Count

```typescript
import * as React from 'react';
import { Textarea, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const TextareaRows: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="2 rows">
        <Textarea rows={2} placeholder="Short input..." />
      </Field>

      <Field label="5 rows">
        <Textarea rows={5} placeholder="Medium input..." />
      </Field>

      <Field label="10 rows">
        <Textarea rows={10} placeholder="Long input..." />
      </Field>
    </div>
  );
};
```

---

## Disabled and Read-Only

```typescript
import * as React from 'react';
import { Textarea, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const DisabledTextarea: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="Disabled">
        <Textarea disabled defaultValue="This textarea is disabled" rows={3} />
      </Field>

      <Field label="Read-only">
        <Textarea readOnly defaultValue="This content is read-only and cannot be edited" rows={3} />
      </Field>
    </div>
  );
};
```

---

## Character Counter

```typescript
import * as React from 'react';
import { Textarea, Field, Text, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    maxWidth: '400px',
  },
  counter: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  warning: {
    color: tokens.colorStatusWarningForeground1,
  },
  error: {
    color: tokens.colorStatusDangerForeground1,
  },
});

export const TextareaWithCounter: React.FC = () => {
  const styles = useStyles();
  const [value, setValue] = React.useState('');
  const maxLength = 280;
  const remaining = maxLength - value.length;

  const getCounterClass = () => {
    if (remaining < 0) return styles.error;
    if (remaining < 50) return styles.warning;
    return undefined;
  };

  return (
    <div className={styles.container}>
      <Field label="Tweet" required>
        <Textarea
          value={value}
          onChange={(_, data) => setValue(data.value)}
          placeholder="What's happening?"
          rows={4}
        />
      </Field>
      <div className={styles.counter}>
        <Text size={200} className={getCounterClass()}>
          {remaining} characters remaining
        </Text>
      </div>
    </div>
  );
};
```

---

## Accessibility

### Keyboard Support

| Key | Action |
|-----|--------|
| `Tab` | Move focus to/from textarea |
| Text editing | Standard text input behavior |

### Best Practices

```typescript
// ✅ Always use with Field for labels
<Field label="Description">
  <Textarea rows={4} />
</Field>

// ✅ Provide helpful hints for format
<Field label="Address" hint="Include city, state, and ZIP code">
  <Textarea rows={3} />
</Field>

// ✅ Use appropriate row count for expected content
<Textarea rows={4} /> // Paragraph content
<Textarea rows={10} /> // Long-form content
```

---

## Styling Customization

```typescript
import * as React from 'react';
import {
  Textarea,
  makeStyles,
  tokens,
  textareaClassNames,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  customTextarea: {
    [`& .${textareaClassNames.textarea}`]: {
      fontFamily: tokens.fontFamilyMonospace,
      fontSize: tokens.fontSizeBase200,
    },
  },
});

export const CustomStyledTextarea: React.FC = () => {
  const styles = useStyles();

  return (
    <Textarea
      className={styles.customTextarea}
      placeholder="// Enter code here..."
      rows={8}
    />
  );
};
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Always use Field for labels
<Field label="Comments">
  <Textarea rows={4} />
</Field>

// ✅ Set appropriate row count
<Textarea rows={4} /> // Standard paragraph
<Textarea rows={8} /> // Long form content

// ✅ Use resize for flexible inputs
<Textarea resize="vertical" />

// ✅ Provide character limits when needed
<Textarea maxLength={500} />
```

### ❌ Don'ts

```typescript
// ❌ Don't use without labels
<Textarea placeholder="Comment" /> // Missing label

// ❌ Don't use for single-line input (use Input)
<Textarea rows={1} /> // Use Input instead

// ❌ Don't ignore accessibility
<Textarea /> // No label or aria-label
```

---

## See Also

- [Input](input.md) - Single-line text input
- [Field](field.md) - Form field wrapper
- [Component Index](../00-component-index.md) - All components