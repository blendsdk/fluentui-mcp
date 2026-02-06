# InfoLabel

> **Component**: `InfoLabel`, `InfoButton`
> **Package**: `@fluentui/react-components` (from `@fluentui/react-infolabel`)

## Overview

InfoLabel combines a label with an info button that displays additional context in a popover. It's commonly used in forms to provide help text or clarification without cluttering the UI.

## Import

```typescript
import {
  InfoLabel,
  InfoButton,
  infoLabelClassNames,
  infoButtonClassNames,
} from '@fluentui/react-components';
```

## Components

| Component | Description |
|-----------|-------------|
| `InfoLabel` | A label with an integrated info button |
| `InfoButton` | Standalone info button with popover |

---

## InfoLabel Component

### Basic Usage

```tsx
import { InfoLabel, Link } from '@fluentui/react-components';

function BasicInfoLabel() {
  return (
    <InfoLabel
      info={
        <>
          This is helpful information about the field.{' '}
          <Link href="https://example.com">Learn more</Link>
        </>
      }
    >
      Field Label
    </InfoLabel>
  );
}
```

### InfoLabel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `info` | `React.ReactNode` | - | Content for the info popover |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the label |
| `required` | `boolean` | `false` | Shows required indicator |
| `weight` | `'regular' \| 'semibold'` | `'regular'` | Font weight |
| `disabled` | `boolean` | `false` | Disables the info button |

### Size Variants

```tsx
import { InfoLabel } from '@fluentui/react-components';

function InfoLabelSizes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <InfoLabel size="small" info="Small info text">
        Small Label
      </InfoLabel>
      
      <InfoLabel size="medium" info="Medium info text">
        Medium Label
      </InfoLabel>
      
      <InfoLabel size="large" info="Large info text">
        Large Label
      </InfoLabel>
    </div>
  );
}
```

### Required Field

```tsx
import { InfoLabel } from '@fluentui/react-components';

function RequiredInfoLabel() {
  return (
    <InfoLabel
      required
      info="This field is required for form submission"
    >
      Username
    </InfoLabel>
  );
}
```

---

## Using InfoLabel with Field

The most common use case is integrating InfoLabel with the Field component for forms.

### Basic Field Integration

```tsx
import { 
  Field, 
  InfoLabel, 
  Input, 
  LabelProps 
} from '@fluentui/react-components';

function FieldWithInfoLabel() {
  return (
    <Field
      label={{
        children: (_: unknown, props: LabelProps) => (
          <InfoLabel {...props} info="Enter your email address">
            Email Address
          </InfoLabel>
        ),
      }}
    >
      <Input type="email" />
    </Field>
  );
}
```

### Required Field with Validation

```tsx
import { 
  Field, 
  InfoLabel, 
  Input, 
  LabelProps 
} from '@fluentui/react-components';

function RequiredFieldWithInfo() {
  return (
    <Field
      required
      validationMessage="This field is required"
      validationState="error"
      label={{
        children: (_: unknown, props: LabelProps) => (
          <InfoLabel 
            {...props} 
            info="Your password must be at least 8 characters"
          >
            Password
          </InfoLabel>
        ),
      }}
    >
      <Input type="password" />
    </Field>
  );
}
```

### Complete Form Example

```tsx
import { useState } from 'react';
import { 
  Field, 
  InfoLabel, 
  Input, 
  Textarea,
  Button,
  LabelProps,
  makeStyles,
  tokens
} from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

function SignupForm() {
  const styles = useStyles();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
  });

  return (
    <form className={styles.form}>
      <Field
        required
        label={{
          children: (_: unknown, props: LabelProps) => (
            <InfoLabel 
              {...props} 
              info="Choose a unique username. This will be visible to other users."
            >
              Username
            </InfoLabel>
          ),
        }}
      >
        <Input
          value={formData.username}
          onChange={(_, data) => setFormData(prev => ({ ...prev, username: data.value }))}
        />
      </Field>

      <Field
        required
        label={{
          children: (_: unknown, props: LabelProps) => (
            <InfoLabel 
              {...props} 
              info="We'll use this to send you important notifications."
            >
              Email
            </InfoLabel>
          ),
        }}
      >
        <Input
          type="email"
          value={formData.email}
          onChange={(_, data) => setFormData(prev => ({ ...prev, email: data.value }))}
        />
      </Field>

      <Field
        label={{
          children: (_: unknown, props: LabelProps) => (
            <InfoLabel 
              {...props} 
              info="Tell us a bit about yourself. This is optional."
            >
              Bio
            </InfoLabel>
          ),
        }}
      >
        <Textarea
          value={formData.bio}
          onChange={(_, data) => setFormData(prev => ({ ...prev, bio: data.value }))}
        />
      </Field>

      <Button appearance="primary" type="submit">
        Sign Up
      </Button>
    </form>
  );
}
```

---

## InfoButton Component

InfoButton is a standalone component for displaying contextual information. Use it when you need an info button without a label.

### Basic InfoButton

```tsx
import { InfoButton } from '@fluentui/react-components';

function BasicInfoButton() {
  return (
    <InfoButton
      info="This is helpful information displayed in a popover."
    />
  );
}
```

### InfoButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `info` | `React.ReactNode` | - | Content for the popover |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the button |
| `inline` | `boolean` | `true` | Render inline or in a portal |
| `popover` | `PopoverProps` | - | Props passed to the Popover |

### InfoButton Sizes

```tsx
import { InfoButton } from '@fluentui/react-components';

function InfoButtonSizes() {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <InfoButton size="small" info="Small button info" />
      <InfoButton size="medium" info="Medium button info" />
      <InfoButton size="large" info="Large button info" />
    </div>
  );
}
```

### Rich Content in Popover

```tsx
import { InfoButton, Link, Body1 } from '@fluentui/react-components';

function RichInfoButton() {
  return (
    <InfoButton
      info={
        <>
          <Body1 block>
            <strong>Important:</strong> This action cannot be undone.
          </Body1>
          <Body1 block>
            Please make sure you have saved all your work before proceeding.
          </Body1>
          <Link href="https://example.com/help">
            View documentation
          </Link>
        </>
      }
    />
  );
}
```

### InfoButton in Table Header

```tsx
import { 
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  InfoButton
} from '@fluentui/react-components';

function TableWithInfoHeaders() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>
            Name
          </TableHeaderCell>
          <TableHeaderCell>
            Status
            <InfoButton 
              size="small"
              info="Active: Currently in use. Inactive: Archived or disabled."
            />
          </TableHeaderCell>
          <TableHeaderCell>
            Priority
            <InfoButton 
              size="small"
              info="High: Requires immediate attention. Medium: Standard priority. Low: Can wait."
            />
          </TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Table rows */}
      </TableBody>
    </Table>
  );
}
```

---

## Accessibility

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Focus the info button |
| `Enter` / `Space` | Open/close the popover |
| `Escape` | Close the popover |

### ARIA Support

- InfoButton has `aria-label="Information"` by default
- Popover content is associated with the button
- Focus is managed when popover opens/closes

### Screen Reader Considerations

```tsx
import { InfoLabel } from '@fluentui/react-components';

function AccessibleInfoLabel() {
  return (
    <InfoLabel
      info="Password must contain at least 8 characters, including uppercase, lowercase, and numbers"
      // The info button has built-in aria-label
    >
      Password
    </InfoLabel>
  );
}
```

---

## Styling

### Class Names

```typescript
import { 
  infoLabelClassNames, 
  infoButtonClassNames 
} from '@fluentui/react-components';

// InfoLabel class names
infoLabelClassNames.root       // Root span element
infoLabelClassNames.label      // Label element
infoLabelClassNames.infoButton // Info button element

// InfoButton class names
infoButtonClassNames.root      // Button element
infoButtonClassNames.popover   // Popover wrapper
infoButtonClassNames.info      // PopoverSurface content
```

### Custom Styling

```tsx
import { 
  InfoLabel, 
  makeStyles, 
  tokens 
} from '@fluentui/react-components';

const useStyles = makeStyles({
  customLabel: {
    '& .fui-InfoLabel__label': {
      fontWeight: tokens.fontWeightSemibold,
    },
  },
  customInfo: {
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

function StyledInfoLabel() {
  const styles = useStyles();
  
  return (
    <InfoLabel
      className={styles.customLabel}
      info={
        <div className={styles.customInfo}>
          Custom styled info content
        </div>
      }
    >
      Custom Label
    </InfoLabel>
  );
}
```

---

## Slots

### InfoLabel Slots

```tsx
import { InfoLabel } from '@fluentui/react-components';

function InfoLabelSlots() {
  return (
    <InfoLabel
      // Root slot - wrapper span
      root={{ style: { display: 'flex', alignItems: 'center' } }}
      
      // Label slot - the Label component
      label={{ weight: 'semibold' }}
      
      // InfoButton slot
      infoButton={{ size: 'small' }}
      
      // Info content
      info="Slot example info"
    >
      Label with custom slots
    </InfoLabel>
  );
}
```

### InfoButton Slots

```tsx
import { InfoButton } from '@fluentui/react-components';

function InfoButtonSlots() {
  return (
    <InfoButton
      // Root slot - the button
      root={{ 'aria-label': 'Custom aria label' }}
      
      // Popover slot
      popover={{ 
        positioning: 'above',
        withArrow: true 
      }}
      
      // Info slot - PopoverSurface
      info={{
        style: { maxWidth: '300px' }
      }}
    >
      Custom info content
    </InfoButton>
  );
}
```

---

## Best Practices

### Do's ✅

- Use InfoLabel for form fields that need additional explanation
- Keep info content concise and helpful
- Include links to documentation for complex topics
- Use consistent sizing with other form elements
- Position info popovers to avoid obscuring important content

### Don'ts ❌

- Don't use InfoLabel for critical/required information (show that inline)
- Don't put too much content in the popover
- Don't nest interactive elements excessively in the popover
- Don't use InfoButton as a primary action trigger

---

## Common Patterns

### Settings Page

```tsx
import { 
  Field, 
  InfoLabel, 
  Switch, 
  LabelProps 
} from '@fluentui/react-components';

function SettingsPage() {
  return (
    <div>
      <Field
        label={{
          children: (_: unknown, props: LabelProps) => (
            <InfoLabel 
              {...props} 
              info="Enable to receive email notifications for important updates."
            >
              Email Notifications
            </InfoLabel>
          ),
        }}
      >
        <Switch />
      </Field>

      <Field
        label={{
          children: (_: unknown, props: LabelProps) => (
            <InfoLabel 
              {...props} 
              info="When enabled, your data will be synced across all your devices."
            >
              Cloud Sync
            </InfoLabel>
          ),
        }}
      >
        <Switch />
      </Field>
    </div>
  );
}
```

### Data Entry Form with Help

```tsx
import { 
  Field, 
  InfoLabel, 
  Input, 
  Select,
  LabelProps 
} from '@fluentui/react-components';

function DataEntryForm() {
  return (
    <div>
      <Field
        required
        label={{
          children: (_: unknown, props: LabelProps) => (
            <InfoLabel 
              {...props} 
              info={
                <>
                  Enter the SKU in format: XX-YYYY-ZZZ
                  <br />
                  Example: AB-1234-001
                </>
              }
            >
              Product SKU
            </InfoLabel>
          ),
        }}
      >
        <Input placeholder="XX-YYYY-ZZZ" />
      </Field>

      <Field
        label={{
          children: (_: unknown, props: LabelProps) => (
            <InfoLabel 
              {...props} 
              info="Select the primary category. You can add secondary categories later."
            >
              Category
            </InfoLabel>
          ),
        }}
      >
        <Select>
          <option>Electronics</option>
          <option>Clothing</option>
          <option>Home & Garden</option>
        </Select>
      </Field>
    </div>
  );
}
```

---

## Related Components

- [Field](./field.md) - Form field wrapper with label and validation
- [Label](./label.md) - Basic label component
- [Popover](../overlay/popover.md) - Base popover component
- [Tooltip](../feedback/tooltip.md) - For hover-based hints