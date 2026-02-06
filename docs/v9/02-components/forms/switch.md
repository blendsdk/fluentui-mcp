# Switch

> **Package**: `@fluentui/react-switch`
> **Import**: `import { Switch } from '@fluentui/react-components'`
> **Category**: Forms

## Overview

Switch is a toggle control that enables users to turn an option on or off. Unlike Checkbox, Switch is specifically designed for binary on/off settings and provides immediate effect.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Switch } from '@fluentui/react-components';

export const BasicSwitch: React.FC = () => (
  <Switch label="Enable notifications" />
);
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | - | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Default checked state |
| `disabled` | `boolean` | `false` | Disabled state |
| `label` | `Slot<typeof Label>` | - | Label for the switch |
| `labelPosition` | `'before' \| 'after' \| 'above'` | `'after'` | Position of label |
| `required` | `boolean` | `false` | Marks as required |
| `onChange` | `(ev, data) => void` | - | Change handler |

### Slots

| Slot | Element | Description |
|------|---------|-------------|
| `root` | `<span>` | Root wrapper element |
| `input` | `<input>` | Hidden input element |
| `indicator` | `<div>` | Visual toggle indicator (track and thumb) |
| `label` | `<Label>` | Switch label |

---

## Controlled vs Uncontrolled

### Uncontrolled

```typescript
import * as React from 'react';
import { Switch } from '@fluentui/react-components';

export const UncontrolledSwitch: React.FC = () => (
  <Switch defaultChecked label="Auto-save enabled" />
);
```

### Controlled

```typescript
import * as React from 'react';
import { Switch, makeStyles, tokens, Text } from '@fluentui/react-components';
import type { SwitchOnChangeData } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

export const ControlledSwitch: React.FC = () => {
  const styles = useStyles();
  const [checked, setChecked] = React.useState(false);

  const handleChange = React.useCallback(
    (_ev: React.ChangeEvent<HTMLInputElement>, data: SwitchOnChangeData) => {
      setChecked(data.checked);
    },
    []
  );

  return (
    <div className={styles.container}>
      <Switch
        checked={checked}
        onChange={handleChange}
        label="Dark mode"
      />
      <Text>Status: {checked ? 'On' : 'Off'}</Text>
    </div>
  );
};
```

---

## Label Position

```typescript
import * as React from 'react';
import { Switch, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

export const LabelPositions: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Switch label="Label after (default)" labelPosition="after" />
      <Switch label="Label before" labelPosition="before" />
      <Switch label="Label above" labelPosition="above" />
    </div>
  );
};
```

---

## Disabled State

```typescript
import * as React from 'react';
import { Switch, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

export const DisabledSwitches: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Switch disabled label="Disabled (off)" />
      <Switch disabled defaultChecked label="Disabled (on)" />
    </div>
  );
};
```

---

## Required Switch

```typescript
import * as React from 'react';
import { Switch, Button, makeStyles, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
  error: {
    color: tokens.colorStatusDangerForeground1,
    fontSize: tokens.fontSizeBase200,
  },
});

export const RequiredSwitch: React.FC = () => {
  const styles = useStyles();
  const [accepted, setAccepted] = React.useState(false);
  const [showError, setShowError] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) {
      setShowError(true);
    } else {
      alert('Form submitted!');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Switch
        required
        checked={accepted}
        onChange={(_, data) => {
          setAccepted(data.checked);
          setShowError(false);
        }}
        label="I accept the terms and conditions *"
      />
      {showError && (
        <Text className={styles.error}>You must accept the terms to continue</Text>
      )}
      <Button appearance="primary" type="submit">
        Submit
      </Button>
    </form>
  );
};
```

---

## Common Use Cases

### Settings Panel

```typescript
import * as React from 'react';
import {
  Switch,
  Card,
  CardHeader,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    maxWidth: '400px',
  },
  settingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalM,
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: tokens.spacingVerticalS,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  settingInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  description: {
    color: tokens.colorNeutralForeground3,
  },
});

export const SettingsPanel: React.FC = () => {
  const styles = useStyles();
  const [settings, setSettings] = React.useState({
    notifications: true,
    darkMode: false,
    autoSave: true,
    analytics: false,
  });

  const updateSetting = (key: keyof typeof settings) => (
    _ev: React.ChangeEvent<HTMLInputElement>,
    data: { checked: boolean }
  ) => {
    setSettings(prev => ({ ...prev, [key]: data.checked }));
  };

  return (
    <Card className={styles.card}>
      <CardHeader header={<Text weight="semibold">Settings</Text>} />
      <div className={styles.settingsList}>
        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <Text>Push Notifications</Text>
            <Text size={200} className={styles.description}>
              Receive alerts on your device
            </Text>
          </div>
          <Switch
            checked={settings.notifications}
            onChange={updateSetting('notifications')}
          />
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <Text>Dark Mode</Text>
            <Text size={200} className={styles.description}>
              Use dark theme
            </Text>
          </div>
          <Switch
            checked={settings.darkMode}
            onChange={updateSetting('darkMode')}
          />
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <Text>Auto-Save</Text>
            <Text size={200} className={styles.description}>
              Save changes automatically
            </Text>
          </div>
          <Switch
            checked={settings.autoSave}
            onChange={updateSetting('autoSave')}
          />
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <Text>Analytics</Text>
            <Text size={200} className={styles.description}>
              Help improve our product
            </Text>
          </div>
          <Switch
            checked={settings.analytics}
            onChange={updateSetting('analytics')}
          />
        </div>
      </div>
    </Card>
  );
};
```

### Feature Toggle

```typescript
import * as React from 'react';
import {
  Switch,
  MessageBar,
  MessageBarBody,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '400px',
  },
});

export const FeatureToggle: React.FC = () => {
  const styles = useStyles();
  const [betaEnabled, setBetaEnabled] = React.useState(false);

  return (
    <div className={styles.container}>
      <Switch
        checked={betaEnabled}
        onChange={(_, data) => setBetaEnabled(data.checked)}
        label="Enable beta features"
      />
      {betaEnabled && (
        <MessageBar intent="warning">
          <MessageBarBody>
            Beta features may be unstable. Use at your own risk.
          </MessageBarBody>
        </MessageBar>
      )}
    </div>
  );
};
```

### Theme Switcher

```typescript
import * as React from 'react';
import { Switch, makeStyles, tokens } from '@fluentui/react-components';
import { WeatherMoonRegular, WeatherSunnyRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  icon: {
    color: tokens.colorNeutralForeground2,
  },
});

interface ThemeSwitcherProps {
  isDark: boolean;
  onToggle: (isDark: boolean) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ isDark, onToggle }) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <WeatherSunnyRegular className={styles.icon} />
      <Switch
        checked={isDark}
        onChange={(_, data) => onToggle(data.checked)}
        aria-label="Toggle dark mode"
      />
      <WeatherMoonRegular className={styles.icon} />
    </div>
  );
};
```

---

## Accessibility

### Keyboard Support

| Key | Action |
|-----|--------|
| `Space` | Toggle switch state |
| `Tab` | Move to next focusable element |

### ARIA Attributes

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `switch` | Always applied |
| `aria-checked` | `true/false` | Reflects checked state |
| `aria-disabled` | `true` | When disabled |
| `aria-required` | `true` | When required |

### Best Practices

```typescript
// ✅ Always provide a label
<Switch label="Enable dark mode" />

// ✅ For switch without visible label, use aria-label
<Switch aria-label="Toggle notifications" />

// ✅ Use descriptive labels that indicate the on state
<Switch label="Enable auto-updates" />

// ✅ Consider adding description for complex settings
<div>
  <Switch label="Developer mode" />
  <Text size={200}>Enables advanced debugging tools</Text>
</div>
```

---

## Styling Customization

```typescript
import * as React from 'react';
import {
  Switch,
  makeStyles,
  tokens,
  switchClassNames,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  customSwitch: {
    // Style the indicator track
    [`& .${switchClassNames.indicator}`]: {
      backgroundColor: tokens.colorStatusDangerBackground1,
    },
    // When checked
    [`&[aria-checked="true"] .${switchClassNames.indicator}`]: {
      backgroundColor: tokens.colorStatusSuccessBackground1,
    },
    // Style the label
    [`& .${switchClassNames.label}`]: {
      fontWeight: tokens.fontWeightMedium,
    },
  },
});

export const CustomStyledSwitch: React.FC = () => {
  const styles = useStyles();

  return (
    <Switch
      className={styles.customSwitch}
      label="Custom styled switch"
    />
  );
};
```

---

## Switch vs Checkbox

| Use Switch When | Use Checkbox When |
|-----------------|-------------------|
| Turning a feature on/off | Selecting items from a list |
| Changes take effect immediately | Changes need explicit save/submit |
| Binary on/off state | Multiple selections allowed |
| Settings/preferences | Form input selections |

```typescript
// ✅ Use Switch for settings
<Switch label="Enable dark mode" />

// ✅ Use Checkbox for selections
<Checkbox label="I agree to the terms" />
<Checkbox label="Subscribe to newsletter" />
```

---

## Best Practices

### ✅ Do's

```typescript
// ✅ Use for immediate on/off settings
<Switch label="Enable notifications" />

// ✅ Use descriptive labels
<Switch label="Automatically save my work" />

// ✅ Provide context when needed
<div>
  <Switch label="Location services" />
  <Text size={200}>Allow apps to access your location</Text>
</div>

// ✅ Group related switches
<fieldset>
  <legend>Privacy Settings</legend>
  <Switch label="Share usage data" />
  <Switch label="Personalized ads" />
</fieldset>
```

### ❌ Don'ts

```typescript
// ❌ Don't use for form selections that require submit
<form>
  <Switch label="Accept terms" /> // Use Checkbox instead
  <Button type="submit">Submit</Button>
</form>

// ❌ Don't use vague labels
<Switch label="Enable" /> // Enable what?

// ❌ Don't use negative labels
<Switch label="Disable notifications" /> // Use positive: "Enable notifications"

// ❌ Don't use without a label
<Switch /> // Missing label
```

---

## See Also

- [Checkbox](checkbox.md) - For form selections
- [Radio](radio.md) - For mutually exclusive selections
- [Field](field.md) - Form field wrapper
- [Component Index](../00-component-index.md) - All components