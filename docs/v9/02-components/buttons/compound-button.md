# CompoundButton

> **Package**: `@fluentui/react-button`
> **Import**: `import { CompoundButton } from '@fluentui/react-components'`
> **Category**: Buttons

## Overview

CompoundButton is a button with a secondary line of text. It's useful when you need to provide additional context about an action without using a tooltip.

---

## Basic Usage

```typescript
import * as React from 'react';
import { CompoundButton } from '@fluentui/react-components';
import { CalendarMonthRegular } from '@fluentui/react-icons';

export const BasicCompoundButton: React.FC = () => (
  <CompoundButton
    icon={<CalendarMonthRegular />}
    secondaryContent="Schedule a meeting"
  >
    New Event
  </CompoundButton>
);
```

---

## Props Reference

Inherits all [Button props](button.md) plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `secondaryContent` | `Slot<'span'>` | - | Secondary line of text below main content |

### Slots

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<button>` | Root element |
| `icon` | `<span>` | Icon container |
| `secondaryContent` | `<span>` | Secondary text content |
| `contentContainer` | `<span>` | Wraps children and secondaryContent |

---

## Appearance Variants

```typescript
import * as React from 'react';
import { CompoundButton, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
  },
});

export const CompoundButtonAppearances: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <CompoundButton
        appearance="secondary"
        secondaryContent="Secondary appearance"
      >
        Secondary
      </CompoundButton>
      
      <CompoundButton
        appearance="primary"
        secondaryContent="Primary appearance"
      >
        Primary
      </CompoundButton>
      
      <CompoundButton
        appearance="outline"
        secondaryContent="Outline appearance"
      >
        Outline
      </CompoundButton>
      
      <CompoundButton
        appearance="subtle"
        secondaryContent="Subtle appearance"
      >
        Subtle
      </CompoundButton>
      
      <CompoundButton
        appearance="transparent"
        secondaryContent="Transparent appearance"
      >
        Transparent
      </CompoundButton>
    </div>
  );
};
```

---

## With Icons

```typescript
import * as React from 'react';
import { CompoundButton, makeStyles, tokens } from '@fluentui/react-components';
import {
  MailRegular,
  DocumentRegular,
  CloudUploadRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '300px',
  },
});

export const CompoundButtonsWithIcons: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <CompoundButton
        icon={<MailRegular />}
        secondaryContent="12 unread messages"
      >
        Inbox
      </CompoundButton>
      
      <CompoundButton
        icon={<DocumentRegular />}
        secondaryContent="Create from template"
      >
        New Document
      </CompoundButton>
      
      <CompoundButton
        icon={<CloudUploadRegular />}
        secondaryContent="Max 50MB"
      >
        Upload File
      </CompoundButton>
    </div>
  );
};
```

---

## Size Variants

```typescript
import * as React from 'react';
import { CompoundButton, makeStyles, tokens } from '@fluentui/react-components';
import { AddRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalM,
  },
});

export const CompoundButtonSizes: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <CompoundButton
        size="small"
        icon={<AddRegular />}
        secondaryContent="Small size"
      >
        Small
      </CompoundButton>
      
      <CompoundButton
        size="medium"
        icon={<AddRegular />}
        secondaryContent="Medium size"
      >
        Medium
      </CompoundButton>
      
      <CompoundButton
        size="large"
        icon={<AddRegular />}
        secondaryContent="Large size"
      >
        Large
      </CompoundButton>
    </div>
  );
};
```

| Size | Use Case |
|------|----------|
| `small` | Compact layouts, toolbars |
| `medium` | Default, most use cases |
| `large` | Hero sections, prominent actions |

---

## Common Use Cases

### File Action Buttons

```typescript
import * as React from 'react';
import { CompoundButton, makeStyles, tokens } from '@fluentui/react-components';
import {
  DocumentAddRegular,
  FolderOpenRegular,
  CloudSyncRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
  },
});

export const FileActionButtons: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <CompoundButton
        appearance="primary"
        icon={<DocumentAddRegular />}
        secondaryContent="Start with a blank file"
      >
        New File
      </CompoundButton>
      
      <CompoundButton
        icon={<FolderOpenRegular />}
        secondaryContent="Browse your files"
      >
        Open
      </CompoundButton>
      
      <CompoundButton
        icon={<CloudSyncRegular />}
        secondaryContent="Last synced 2 min ago"
      >
        Sync
      </CompoundButton>
    </div>
  );
};
```

### Settings Card Actions

```typescript
import * as React from 'react';
import {
  CompoundButton,
  Card,
  CardHeader,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  PersonRegular,
  ShieldRegular,
  PaintBrushRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  card: {
    maxWidth: '400px',
    padding: tokens.spacingVerticalM,
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    marginTop: tokens.spacingVerticalM,
  },
});

export const SettingsCard: React.FC = () => {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <CardHeader header={<Text weight="semibold">Settings</Text>} />
      
      <div className={styles.buttonGroup}>
        <CompoundButton
          appearance="subtle"
          icon={<PersonRegular />}
          secondaryContent="Name, email, profile picture"
        >
          Account
        </CompoundButton>
        
        <CompoundButton
          appearance="subtle"
          icon={<ShieldRegular />}
          secondaryContent="Password, two-factor auth"
        >
          Security
        </CompoundButton>
        
        <CompoundButton
          appearance="subtle"
          icon={<PaintBrushRegular />}
          secondaryContent="Theme, layout, fonts"
        >
          Appearance
        </CompoundButton>
      </div>
    </Card>
  );
};
```

---

## Disabled State

```typescript
import * as React from 'react';
import { CompoundButton, makeStyles, tokens } from '@fluentui/react-components';
import { LockClosedRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
  },
});

export const DisabledCompoundButtons: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <CompoundButton
        disabled
        icon={<LockClosedRegular />}
        secondaryContent="This action is not available"
      >
        Locked Action
      </CompoundButton>
      
      <CompoundButton
        appearance="primary"
        disabled
        secondaryContent="Complete previous steps first"
      >
        Continue
      </CompoundButton>
    </div>
  );
};
```

---

## Accessibility

### Requirements

1. **Secondary content provides context** - Ensure secondary content is meaningful
2. **Icon-only not recommended** - CompoundButton should have visible text
3. **Use appropriate size** - Larger sizes improve touch accessibility

### Keyboard Support

| Key | Action |
|-----|--------|
| `Enter` | Activates the button |
| `Space` | Activates the button |
| `Tab` | Moves focus to next focusable element |

---

## Styling Customization

### Custom Secondary Text Styles

```typescript
import * as React from 'react';
import {
  CompoundButton,
  makeStyles,
  tokens,
  compoundButtonClassNames,
} from '@fluentui/react-components';
import { InfoRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  customButton: {
    [`& .${compoundButtonClassNames.secondaryContent}`]: {
      color: tokens.colorStatusSuccessForeground1,
      fontWeight: tokens.fontWeightMedium,
    },
  },
});

export const CustomStyledCompoundButton: React.FC = () => {
  const styles = useStyles();

  return (
    <CompoundButton
      className={styles.customButton}
      icon={<InfoRegular />}
      secondaryContent="Online - 99.9% uptime"
    >
      System Status
    </CompoundButton>
  );
};
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Use secondary content for helpful context
<CompoundButton
  icon={<SaveRegular />}
  secondaryContent="Your work will be saved to cloud"
>
  Save
</CompoundButton>

// ✅ Use with icons for visual hierarchy
<CompoundButton
  icon={<MailRegular />}
  secondaryContent="Send to all recipients"
>
  Send Email
</CompoundButton>

// ✅ Use for important actions that benefit from explanation
<CompoundButton
  appearance="primary"
  secondaryContent="This action cannot be undone"
>
  Delete Account
</CompoundButton>
```

### ❌ Don'ts

```typescript
// ❌ Don't use without secondary content (use regular Button)
<CompoundButton>Click Me</CompoundButton>

// ❌ Don't use redundant secondary content
<CompoundButton secondaryContent="Click this button">
  Click Me
</CompoundButton>

// ❌ Don't use for simple actions that don't need explanation
<CompoundButton secondaryContent="Closes the dialog">
  Cancel
</CompoundButton>
```

---

## See Also

- [Button](button.md) - Standard action button
- [ToggleButton](toggle-button.md) - Button with toggle state
- [MenuButton](menu-button.md) - Button that opens a menu
- [SplitButton](split-button.md) - Button with dropdown action
- [Component Index](../00-component-index.md) - All components