# Input

> **Package**: `@fluentui/react-input`
> **Import**: `import { Input } from '@fluentui/react-components'`
> **Category**: Forms

## Overview

Input is a text input field for single-line text entry. It supports various appearances, sizes, and can include content before/after the input.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Input } from '@fluentui/react-components';

export const BasicInput: React.FC = () => (
  <Input placeholder="Enter text..." />
);
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appearance` | `'outline' \| 'underline' \| 'filled-darker' \| 'filled-lighter'` | `'outline'` | Visual style |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the input |
| `type` | `'text' \| 'email' \| 'password' \| 'search' \| 'tel' \| 'url' \| 'date' \| 'number' \| ...` | `'text'` | Input type |
| `value` | `string` | - | Controlled value |
| `defaultValue` | `string` | - | Default value (uncontrolled) |
| `disabled` | `boolean` | `false` | Disabled state |
| `placeholder` | `string` | - | Placeholder text |
| `contentBefore` | `Slot<'span'>` | - | Content before input text |
| `contentAfter` | `Slot<'span'>` | - | Content after input text |
| `onChange` | `(ev, data) => void` | - | Change handler |

### Slots

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<span>` | Wrapper element with borders and styling |
| `input` | `<input>` | The actual input element |
| `contentBefore` | `<span>` | Content before input text |
| `contentAfter` | `<span>` | Content after input text |

---

## Controlled vs Uncontrolled

### Uncontrolled Input

```typescript
import * as React from 'react';
import { Input } from '@fluentui/react-components';

export const UncontrolledInput: React.FC = () => (
  <Input 
    defaultValue="Initial value" 
    placeholder="Enter text..."
  />
);
```

### Controlled Input

```typescript
import * as React from 'react';
import { Input, makeStyles, tokens, Text } from '@fluentui/react-components';
import type { InputOnChangeData } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

export const ControlledInput: React.FC = () => {
  const styles = useStyles();
  const [value, setValue] = React.useState('');

  const handleChange = React.useCallback(
    (_ev: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
      setValue(data.value);
    },
    []
  );

  return (
    <div className={styles.container}>
      <Input 
        value={value} 
        onChange={handleChange}
        placeholder="Type something..."
      />
      <Text>Current value: {value}</Text>
    </div>
  );
};
```

---

## Appearance Variants

```typescript
import * as React from 'react';
import { Input, makeStyles, tokens, Label } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
});

export const InputAppearances: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <Label>Outline (default)</Label>
        <Input appearance="outline" placeholder="Outline appearance" />
      </div>
      
      <div className={styles.field}>
        <Label>Underline</Label>
        <Input appearance="underline" placeholder="Underline appearance" />
      </div>
      
      <div className={styles.field}>
        <Label>Filled Darker</Label>
        <Input appearance="filled-darker" placeholder="Filled darker" />
      </div>
      
      <div className={styles.field}>
        <Label>Filled Lighter</Label>
        <Input appearance="filled-lighter" placeholder="Filled lighter" />
      </div>
    </div>
  );
};
```

| Appearance | Use Case |
|------------|----------|
| `outline` | Default, most use cases |
| `underline` | Minimal style, edit-in-place scenarios |
| `filled-darker` | Darker background fill |
| `filled-lighter` | Lighter background fill |

---

## Size Variants

```typescript
import * as React from 'react';
import { Input, makeStyles, tokens, Label } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
});

export const InputSizes: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <Label size="small">Small</Label>
        <Input size="small" placeholder="Small input" />
      </div>
      
      <div className={styles.field}>
        <Label size="medium">Medium</Label>
        <Input size="medium" placeholder="Medium input" />
      </div>
      
      <div className={styles.field}>
        <Label size="large">Large</Label>
        <Input size="large" placeholder="Large input" />
      </div>
    </div>
  );
};
```

---

## Input Types

```typescript
import * as React from 'react';
import { Input, makeStyles, tokens, Label } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
});

export const InputTypes: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <Label>Text (default)</Label>
        <Input type="text" placeholder="Regular text" />
      </div>
      
      <div className={styles.field}>
        <Label>Email</Label>
        <Input type="email" placeholder="email@example.com" />
      </div>
      
      <div className={styles.field}>
        <Label>Password</Label>
        <Input type="password" placeholder="Enter password" />
      </div>
      
      <div className={styles.field}>
        <Label>Number</Label>
        <Input type="number" placeholder="0" />
      </div>
      
      <div className={styles.field}>
        <Label>Tel</Label>
        <Input type="tel" placeholder="+1 (555) 123-4567" />
      </div>
      
      <div className={styles.field}>
        <Label>URL</Label>
        <Input type="url" placeholder="https://example.com" />
      </div>
      
      <div className={styles.field}>
        <Label>Date</Label>
        <Input type="date" />
      </div>
    </div>
  );
};
```

---

## With Content Before/After

### Icons

```typescript
import * as React from 'react';
import { Input, makeStyles, tokens } from '@fluentui/react-components';
import { 
  PersonRegular, 
  SearchRegular, 
  MailRegular,
  EyeRegular,
  EyeOffRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const InputWithIcons: React.FC = () => {
  const styles = useStyles();
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className={styles.container}>
      {/* Icon before */}
      <Input 
        contentBefore={<PersonRegular />}
        placeholder="Username"
      />
      
      {/* Icon before for search */}
      <Input 
        contentBefore={<SearchRegular />}
        placeholder="Search..."
        type="search"
      />
      
      {/* Icon before for email */}
      <Input 
        contentBefore={<MailRegular />}
        placeholder="Email address"
        type="email"
      />
      
      {/* Password with toggle visibility */}
      <Input 
        type={showPassword ? 'text' : 'password'}
        placeholder="Password"
        contentAfter={
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {showPassword ? <EyeOffRegular /> : <EyeRegular />}
          </button>
        }
      />
    </div>
  );
};
```

### Text Labels

```typescript
import * as React from 'react';
import { Input, makeStyles, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
  prefix: {
    color: tokens.colorNeutralForeground3,
  },
  suffix: {
    color: tokens.colorNeutralForeground3,
  },
});

export const InputWithTextLabels: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      {/* URL prefix */}
      <Input 
        contentBefore={<Text className={styles.prefix}>https://</Text>}
        placeholder="example.com"
      />
      
      {/* Currency */}
      <Input 
        contentBefore={<Text className={styles.prefix}>$</Text>}
        contentAfter={<Text className={styles.suffix}>.00</Text>}
        placeholder="0"
        type="number"
      />
      
      {/* Email domain */}
      <Input 
        contentAfter={<Text className={styles.suffix}>@company.com</Text>}
        placeholder="username"
      />
    </div>
  );
};
```

---

## With Field Component

Use `Field` for labels, validation messages, and hints:

```typescript
import * as React from 'react';
import { 
  Input, 
  Field, 
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
});

export const InputWithField: React.FC = () => {
  const styles = useStyles();
  const [email, setEmail] = React.useState('');
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className={styles.form}>
      {/* Basic field */}
      <Field label="Full Name" required>
        <Input placeholder="John Doe" />
      </Field>
      
      {/* With hint */}
      <Field 
        label="Username"
        hint="Choose a unique username"
      >
        <Input placeholder="johndoe" />
      </Field>
      
      {/* With validation */}
      <Field 
        label="Email"
        required
        validationState={email && !isValidEmail ? 'error' : 'none'}
        validationMessage={email && !isValidEmail ? 'Please enter a valid email' : undefined}
      >
        <Input 
          type="email"
          value={email}
          onChange={(_, data) => setEmail(data.value)}
          placeholder="email@example.com"
        />
      </Field>
      
      {/* Success state */}
      <Field 
        label="Verified Field"
        validationState="success"
        validationMessage="Looks good!"
      >
        <Input defaultValue="Valid input" />
      </Field>
    </div>
  );
};
```

---

## Disabled and Read-Only

```typescript
import * as React from 'react';
import { Input, Field, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const DisabledAndReadOnly: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Field label="Disabled Input">
        <Input disabled defaultValue="Cannot edit this" />
      </Field>
      
      <Field label="Read-Only Input">
        <Input readOnly defaultValue="Read only value" />
      </Field>
    </div>
  );
};
```

---

## Event Handling

```typescript
import * as React from 'react';
import { Input, makeStyles, tokens, Text } from '@fluentui/react-components';
import type { InputOnChangeData } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
  log: {
    padding: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase200,
  },
});

export const InputEvents: React.FC = () => {
  const styles = useStyles();
  const [log, setLog] = React.useState<string[]>([]);

  const addLog = (message: string) => {
    setLog(prev => [...prev.slice(-4), message]);
  };

  const handleChange = React.useCallback(
    (_ev: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
      addLog(`onChange: "${data.value}"`);
    },
    []
  );

  const handleFocus = React.useCallback(() => {
    addLog('onFocus');
  }, []);

  const handleBlur = React.useCallback(() => {
    addLog('onBlur');
  }, []);

  return (
    <div className={styles.container}>
      <Input 
        placeholder="Type to see events..."
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <div className={styles.log}>
        {log.length > 0 ? log.map((entry, i) => (
          <div key={i}>{entry}</div>
        )) : 'Events will appear here...'}
      </div>
    </div>
  );
};
```

---

## Accessibility

### Requirements

1. **Always use with Label or Field** - Inputs need accessible labels
2. **Use `aria-describedby`** for additional descriptions
3. **Use appropriate `type`** for semantic meaning

### With aria-label (when visible label not possible)

```typescript
<Input 
  aria-label="Search products"
  placeholder="Search..."
  contentBefore={<SearchRegular />}
/>
```

### Keyboard Support

| Key | Action |
|-----|--------|
| `Tab` | Move focus to/from input |
| Any | Type in the input |
| `Escape` | Clear or cancel (browser-dependent) |

### Screen Reader Considerations

```typescript
// ✅ Good: Input with proper labeling
<Field label="Email Address" required>
  <Input type="email" />
</Field>

// ✅ Good: With hint
<Field 
  label="Password" 
  hint="Must be at least 8 characters"
>
  <Input type="password" />
</Field>

// ✅ Good: With error message
<Field 
  label="Email" 
  validationState="error"
  validationMessage="Please enter a valid email"
>
  <Input type="email" />
</Field>
```

---

## Styling Customization

### Custom Styles

```typescript
import * as React from 'react';
import { Input, makeStyles, tokens, inputClassNames } from '@fluentui/react-components';

const useStyles = makeStyles({
  customInput: {
    // Style the root wrapper
    borderRadius: tokens.borderRadiusLarge,
    
    // Style the input element
    [`& .${inputClassNames.input}`]: {
      fontFamily: tokens.fontFamilyMonospace,
    },
  },
  wideInput: {
    width: '100%',
  },
});

export const CustomStyledInput: React.FC = () => {
  const styles = useStyles();

  return (
    <Input 
      className={styles.customInput}
      placeholder="Custom styled input"
    />
  );
};
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Always use labels
<Field label="Email">
  <Input type="email" />
</Field>

// ✅ Use appropriate input types
<Input type="email" /> // For emails
<Input type="tel" />   // For phone numbers
<Input type="url" />   // For URLs

// ✅ Provide placeholder text as a hint
<Input placeholder="john@example.com" />

// ✅ Use Field for validation
<Field 
  label="Username"
  validationState={error ? 'error' : 'none'}
  validationMessage={error}
>
  <Input />
</Field>
```

### ❌ Don'ts

```typescript
// ❌ Don't use placeholder as label
<Input placeholder="Email" /> // Missing actual label

// ❌ Don't use text type for structured data
<Input type="text" /> // Use type="email" for emails

// ❌ Don't skip validation feedback
<Input /> // No indication of errors
```

---

## See Also

- [Field](field.md) - Form field wrapper with label/validation
- [Textarea](textarea.md) - Multi-line text input
- [SearchBox](searchbox.md) - Search-specific input
- [Component Index](../00-component-index.md) - All components