# Settings Form Pattern

> **File**: 03-patterns/forms/04c-settings-form.md
> **FluentUI Version**: 9.x

## Overview

Settings form patterns for FluentUI v9, including profile settings, notification preferences, appearance settings, and sectioned forms with save/cancel functionality.

## Profile Settings Form

```tsx
import { useState } from 'react';
import {
  Field,
  Input,
  Textarea,
  Avatar,
  Button,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { PersonRegular, CameraAddRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    maxWidth: '600px',
    padding: tokens.spacingVerticalL,
  },
  header: {
    marginBottom: tokens.spacingVerticalL,
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalL,
    marginBottom: tokens.spacingVerticalL,
  },
  avatarActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  nameRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingHorizontalM,
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalL,
    justifyContent: 'flex-end',
  },
});

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  website: string;
}

export const ProfileSettingsForm = () => {
  const styles = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Software developer passionate about building great user experiences.',
    website: 'https://johndoe.dev',
  });
  const [initialData] = useState(formData);

  const handleChange = (field: keyof ProfileData) => (
    e: any,
    data: { value: string }
  ) => {
    setFormData(prev => ({ ...prev, [field]: data.value }));
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Profile updated:', formData);
      setIsDirty(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsDirty(false);
  };

  return (
    <div className={styles.container}>
      <Text as="h2" size={600} weight="semibold" className={styles.header}>
        Profile Settings
      </Text>

      {/* Avatar Section */}
      <div className={styles.avatarSection}>
        <Avatar
          name={`${formData.firstName} ${formData.lastName}`}
          size={96}
          icon={<PersonRegular />}
        />
        <div className={styles.avatarActions}>
          <Button icon={<CameraAddRegular />} appearance="secondary">
            Change Photo
          </Button>
          <Button appearance="subtle" size="small">
            Remove Photo
          </Button>
        </div>
      </div>

      {/* Profile Form */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.nameRow}>
          <Field label="First Name" required>
            <Input
              value={formData.firstName}
              onChange={handleChange('firstName')}
              disabled={isLoading}
            />
          </Field>
          <Field label="Last Name" required>
            <Input
              value={formData.lastName}
              onChange={handleChange('lastName')}
              disabled={isLoading}
            />
          </Field>
        </div>

        <Field label="Email" required>
          <Input
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            disabled={isLoading}
          />
        </Field>

        <Field label="Phone">
          <Input
            type="tel"
            value={formData.phone}
            onChange={handleChange('phone')}
            disabled={isLoading}
          />
        </Field>

        <Field label="Website">
          <Input
            type="url"
            value={formData.website}
            onChange={handleChange('website')}
            disabled={isLoading}
          />
        </Field>

        <Field label="Bio" hint="Brief description about yourself">
          <Textarea
            value={formData.bio}
            onChange={handleChange('bio')}
            disabled={isLoading}
            rows={3}
            resize="vertical"
          />
        </Field>

        <div className={styles.actions}>
          <Button
            appearance="secondary"
            onClick={handleCancel}
            disabled={isLoading || !isDirty}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            appearance="primary"
            disabled={isLoading || !isDirty}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};
```

## Notification Settings

```tsx
import { useState } from 'react';
import {
  Switch,
  Checkbox,
  RadioGroup,
  Radio,
  Text,
  Divider,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    maxWidth: '600px',
    padding: tokens.spacingVerticalL,
  },
  section: {
    marginBottom: tokens.spacingVerticalL,
  },
  sectionTitle: {
    marginBottom: tokens.spacingVerticalM,
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${tokens.spacingVerticalS} 0`,
  },
  settingInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    marginTop: tokens.spacingVerticalS,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: tokens.spacingVerticalL,
  },
});

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
  securityAlerts: boolean;
  frequency: string;
}

export const NotificationSettingsForm = () => {
  const styles = useStyles();
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    weeklyDigest: true,
    securityAlerts: true,
    frequency: 'instant',
  });

  const handleSwitchChange = (key: keyof NotificationSettings) => (
    e: any,
    data: { checked: boolean }
  ) => {
    setSettings(prev => ({ ...prev, [key]: data.checked }));
  };

  const handleFrequencyChange = (e: any, data: { value: string }) => {
    setSettings(prev => ({ ...prev, frequency: data.value }));
  };

  return (
    <div className={styles.container}>
      <Text as="h2" size={600} weight="semibold">
        Notification Settings
      </Text>

      {/* Notification Channels */}
      <div className={styles.section}>
        <Text weight="semibold" className={styles.sectionTitle}>
          Notification Channels
        </Text>

        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <Text>Email Notifications</Text>
            <Text size={200}>Receive notifications via email</Text>
          </div>
          <Switch
            checked={settings.emailNotifications}
            onChange={handleSwitchChange('emailNotifications')}
          />
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <Text>Push Notifications</Text>
            <Text size={200}>Receive push notifications in browser</Text>
          </div>
          <Switch
            checked={settings.pushNotifications}
            onChange={handleSwitchChange('pushNotifications')}
          />
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <Text>SMS Notifications</Text>
            <Text size={200}>Receive text message notifications</Text>
          </div>
          <Switch
            checked={settings.smsNotifications}
            onChange={handleSwitchChange('smsNotifications')}
          />
        </div>
      </div>

      <Divider />

      {/* Notification Types */}
      <div className={styles.section}>
        <Text weight="semibold" className={styles.sectionTitle}>
          What to notify me about
        </Text>

        <div className={styles.checkboxGroup}>
          <Checkbox
            checked={settings.securityAlerts}
            onChange={(e, data) =>
              setSettings(prev => ({ ...prev, securityAlerts: data.checked ?? false }))
            }
            label="Security alerts (always recommended)"
          />
          <Checkbox
            checked={settings.weeklyDigest}
            onChange={(e, data) =>
              setSettings(prev => ({ ...prev, weeklyDigest: data.checked ?? false }))
            }
            label="Weekly activity digest"
          />
          <Checkbox
            checked={settings.marketingEmails}
            onChange={(e, data) =>
              setSettings(prev => ({ ...prev, marketingEmails: data.checked ?? false }))
            }
            label="Marketing and promotional emails"
          />
        </div>
      </div>

      <Divider />

      {/* Frequency */}
      <div className={styles.section}>
        <Text weight="semibold" className={styles.sectionTitle}>
          Notification Frequency
        </Text>

        <RadioGroup
          value={settings.frequency}
          onChange={handleFrequencyChange}
        >
          <Radio value="instant" label="Instant - As they happen" />
          <Radio value="hourly" label="Hourly digest" />
          <Radio value="daily" label="Daily digest" />
          <Radio value="weekly" label="Weekly digest" />
        </RadioGroup>
      </div>

      <div className={styles.actions}>
        <Button appearance="primary">Save Preferences</Button>
      </div>
    </div>
  );
};
```

## Appearance Settings

```tsx
import { useState } from 'react';
import {
  RadioGroup,
  Radio,
  Select,
  Slider,
  Switch,
  Text,
  Card,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  WeatherSunnyRegular,
  WeatherMoonRegular,
  DesktopRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    maxWidth: '600px',
    padding: tokens.spacingVerticalL,
  },
  section: {
    marginBottom: tokens.spacingVerticalXL,
  },
  sectionTitle: {
    marginBottom: tokens.spacingVerticalM,
  },
  themeCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalM,
  },
  themeCard: {
    padding: tokens.spacingVerticalM,
    textAlign: 'center',
    cursor: 'pointer',
    border: `2px solid transparent`,
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  selectedCard: {
    borderColor: tokens.colorBrandBackground,
  },
  themeIcon: {
    fontSize: '32px',
    marginBottom: tokens.spacingVerticalS,
  },
  settingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${tokens.spacingVerticalM} 0`,
  },
  sliderContainer: {
    marginTop: tokens.spacingVerticalM,
  },
});

type Theme = 'light' | 'dark' | 'system';

interface AppearanceSettings {
  theme: Theme;
  fontSize: number;
  reducedMotion: boolean;
  highContrast: boolean;
  language: string;
}

export const AppearanceSettingsForm = () => {
  const styles = useStyles();
  const [settings, setSettings] = useState<AppearanceSettings>({
    theme: 'system',
    fontSize: 100,
    reducedMotion: false,
    highContrast: false,
    language: 'en',
  });

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <WeatherSunnyRegular /> },
    { value: 'dark', label: 'Dark', icon: <WeatherMoonRegular /> },
    { value: 'system', label: 'System', icon: <DesktopRegular /> },
  ];

  return (
    <div className={styles.container}>
      <Text as="h2" size={600} weight="semibold">
        Appearance
      </Text>

      {/* Theme Selection */}
      <div className={styles.section}>
        <Text weight="semibold" className={styles.sectionTitle}>
          Theme
        </Text>
        <div className={styles.themeCards}>
          {themeOptions.map(option => (
            <Card
              key={option.value}
              className={`${styles.themeCard} ${
                settings.theme === option.value ? styles.selectedCard : ''
              }`}
              onClick={() =>
                setSettings(prev => ({ ...prev, theme: option.value }))
              }
            >
              <div className={styles.themeIcon}>{option.icon}</div>
              <Text>{option.label}</Text>
            </Card>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className={styles.section}>
        <Text weight="semibold" className={styles.sectionTitle}>
          Font Size
        </Text>
        <Text size={200}>
          Adjust the base font size: {settings.fontSize}%
        </Text>
        <div className={styles.sliderContainer}>
          <Slider
            min={75}
            max={150}
            step={25}
            value={settings.fontSize}
            onChange={(e, data) =>
              setSettings(prev => ({ ...prev, fontSize: data.value }))
            }
          />
        </div>
      </div>

      {/* Language */}
      <div className={styles.section}>
        <Text weight="semibold" className={styles.sectionTitle}>
          Language
        </Text>
        <Select
          value={settings.language}
          onChange={(e, data) =>
            setSettings(prev => ({ ...prev, language: data.value }))
          }
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="ja">日本語</option>
        </Select>
      </div>

      {/* Accessibility */}
      <div className={styles.section}>
        <Text weight="semibold" className={styles.sectionTitle}>
          Accessibility
        </Text>

        <div className={styles.settingRow}>
          <div>
            <Text>Reduce Motion</Text>
            <Text size={200}>Minimize animations and transitions</Text>
          </div>
          <Switch
            checked={settings.reducedMotion}
            onChange={(e, data) =>
              setSettings(prev => ({ ...prev, reducedMotion: data.checked }))
            }
          />
        </div>

        <div className={styles.settingRow}>
          <div>
            <Text>High Contrast</Text>
            <Text size={200}>Increase color contrast for better visibility</Text>
          </div>
          <Switch
            checked={settings.highContrast}
            onChange={(e, data) =>
              setSettings(prev => ({ ...prev, highContrast: data.checked }))
            }
          />
        </div>
      </div>
    </div>
  );
};
```

## Settings with Unsaved Changes Warning

```tsx
import { useState, useEffect } from 'react';
import {
  Field,
  Input,
  Button,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
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
    gap: tokens.spacingHorizontalM,
    justifyContent: 'flex-end',
    marginTop: tokens.spacingVerticalL,
  },
});

export const SettingsWithUnsavedWarning = () => {
  const styles = useStyles();
  const [formData, setFormData] = useState({ name: 'John Doe', email: 'john@example.com' });
  const [initialData] = useState(formData);
  const [isDirty, setIsDirty] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  // Track changes
  useEffect(() => {
    const hasChanges =
      formData.name !== initialData.name ||
      formData.email !== initialData.email;
    setIsDirty(hasChanges);
  }, [formData, initialData]);

  // Warn on page leave
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleNavigate = (action: () => void) => {
    if (isDirty) {
      setPendingNavigation(() => action);
      setShowWarning(true);
    } else {
      action();
    }
  };

  const handleConfirmLeave = () => {
    setShowWarning(false);
    pendingNavigation?.();
  };

  return (
    <>
      <form className={styles.form}>
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

        <div className={styles.actions}>
          <Button
            appearance="secondary"
            onClick={() => handleNavigate(() => console.log('Go back'))}
          >
            Cancel
          </Button>
          <Button appearance="primary" disabled={!isDirty}>
            Save Changes
          </Button>
        </div>
      </form>

      {/* Unsaved Changes Dialog */}
      <Dialog open={showWarning} onOpenChange={(e, data) => setShowWarning(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogContent>
              You have unsaved changes. Are you sure you want to leave without saving?
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setShowWarning(false)}>
                Stay
              </Button>
              <Button appearance="primary" onClick={handleConfirmLeave}>
                Leave Without Saving
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
};
```

## Related Documentation

- [04a-login-form.md](04a-login-form.md) - Login form
- [04b-registration-form.md](04b-registration-form.md) - Registration form
- [06-submission.md](06-submission.md) - Form submission handling