# Admin Interface: Settings Panels

> **Module**: 04-enterprise
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02

## Overview

Settings panels are used for application configuration, profile management, and system preferences. This guide covers tab-based settings layouts, grouped form sections, toggle settings, and save/discard patterns using FluentUI v9 components.

---

## Settings Page Layout with Tabs

```tsx
import * as React from 'react';
import {
  TabList,
  Tab,
  SelectTabEvent,
  SelectTabData,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  page: {
    padding: tokens.spacingVerticalL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  layout: {
    display: 'flex',
    gap: tokens.spacingHorizontalXL,
  },
  sidebar: {
    minWidth: '200px',
  },
  content: {
    flex: 1,
    maxWidth: '720px',
  },
  /** Mobile: stack tabs above content */
  '@media (max-width: 768px)': {
    layout: {
      flexDirection: 'column',
    },
  },
});

/**
 * SettingsPage — Tab-based settings with sidebar navigation.
 *
 * Uses vertical TabList for desktop and horizontal for mobile.
 * Each tab renders a different settings section.
 */
export function SettingsPage() {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = React.useState('general');

  const handleTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(data.value as string);
  };

  return (
    <div className={styles.page}>
      <Text size={600} weight="semibold">Settings</Text>
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <TabList
            vertical
            selectedValue={selectedTab}
            onTabSelect={handleTabSelect}
          >
            <Tab value="general">General</Tab>
            <Tab value="notifications">Notifications</Tab>
            <Tab value="security">Security</Tab>
            <Tab value="integrations">Integrations</Tab>
            <Tab value="billing">Billing</Tab>
          </TabList>
        </div>
        <div className={styles.content}>
          {selectedTab === 'general' && <GeneralSettings />}
          {selectedTab === 'notifications' && <NotificationSettings />}
          {selectedTab === 'security' && <SecuritySettings />}
          {selectedTab === 'integrations' && <IntegrationSettings />}
          {selectedTab === 'billing' && <BillingSettings />}
        </div>
      </div>
    </div>
  );
}
```

---

## Settings Section with Save/Discard

```tsx
import * as React from 'react';
import {
  Card,
  Text,
  Button,
  Divider,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  section: {
    padding: tokens.spacingVerticalL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    justifyContent: 'flex-end',
    marginTop: tokens.spacingVerticalM,
  },
});

interface SettingsSectionProps {
  title: string;
  description?: string;
  /** Whether the section has unsaved changes */
  isDirty: boolean;
  onSave: () => void;
  onDiscard: () => void;
  children: React.ReactNode;
}

/**
 * SettingsSection — Card wrapper for a group of related settings.
 *
 * Shows Save/Discard buttons only when the user has made changes.
 */
export function SettingsSection({
  title,
  description,
  isDirty,
  onSave,
  onDiscard,
  children,
}: SettingsSectionProps) {
  const styles = useStyles();

  return (
    <Card className={styles.section}>
      <div className={styles.header}>
        <div>
          <Text size={400} weight="semibold">{title}</Text>
          {description && <Text className={styles.description}>{description}</Text>}
        </div>
      </div>
      <Divider />
      {children}
      {isDirty && (
        <div className={styles.actions}>
          <Button appearance="secondary" onClick={onDiscard}>Discard</Button>
          <Button appearance="primary" onClick={onSave}>Save Changes</Button>
        </div>
      )}
    </Card>
  );
}
```

---

## General Settings Example

```tsx
import * as React from 'react';
import {
  Input,
  Select,
  Field,
  Switch,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { SettingsSection } from './SettingsSection';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingHorizontalM,
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

interface GeneralConfig {
  appName: string;
  language: string;
  timezone: string;
  darkMode: boolean;
}

/**
 * GeneralSettings — Application-wide configuration.
 *
 * Tracks dirty state by comparing current values to saved values.
 */
export function GeneralSettings() {
  const styles = useStyles();
  const [saved, setSaved] = React.useState<GeneralConfig>({
    appName: 'Contoso Portal',
    language: 'en',
    timezone: 'UTC',
    darkMode: false,
  });
  const [current, setCurrent] = React.useState<GeneralConfig>(saved);

  const isDirty = JSON.stringify(current) !== JSON.stringify(saved);

  const handleSave = () => setSaved(current);
  const handleDiscard = () => setCurrent(saved);

  return (
    <SettingsSection
      title="General"
      description="Basic application settings"
      isDirty={isDirty}
      onSave={handleSave}
      onDiscard={handleDiscard}
    >
      <div className={styles.form}>
        <Field label="Application Name">
          <Input
            value={current.appName}
            onChange={(e, data) => setCurrent((prev) => ({ ...prev, appName: data.value }))}
          />
        </Field>
        <div className={styles.row}>
          <Field label="Language">
            <Select
              value={current.language}
              onChange={(e, data) => setCurrent((prev) => ({ ...prev, language: data.value }))}
            >
              <option value="en">English</option>
              <option value="nl">Nederlands</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
            </Select>
          </Field>
          <Field label="Timezone">
            <Select
              value={current.timezone}
              onChange={(e, data) => setCurrent((prev) => ({ ...prev, timezone: data.value }))}
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="PST">Pacific Time</option>
              <option value="CET">Central European Time</option>
            </Select>
          </Field>
        </div>
        <Switch
          checked={current.darkMode}
          onChange={(e, data) => setCurrent((prev) => ({ ...prev, darkMode: data.checked }))}
          label="Dark mode"
        />
      </div>
    </SettingsSection>
  );
}
```

---

## Notification Settings with Toggle Groups

```tsx
import * as React from 'react';
import {
  Switch,
  Text,
  Divider,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { SettingsSection } from './SettingsSection';

const useStyles = makeStyles({
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${tokens.spacingVerticalXS} 0`,
  },
  labelGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  description: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase100,
  },
});

interface NotificationConfig {
  emailDigest: boolean;
  emailMentions: boolean;
  pushAlerts: boolean;
  pushMessages: boolean;
  slackIntegration: boolean;
}

/**
 * NotificationSettings — Toggle-based notification preferences.
 *
 * Groups related toggles with descriptive labels.
 */
export function NotificationSettings() {
  const styles = useStyles();
  const [saved, setSaved] = React.useState<NotificationConfig>({
    emailDigest: true,
    emailMentions: true,
    pushAlerts: false,
    pushMessages: true,
    slackIntegration: false,
  });
  const [current, setCurrent] = React.useState(saved);
  const isDirty = JSON.stringify(current) !== JSON.stringify(saved);

  const toggle = (key: keyof NotificationConfig) =>
    setCurrent((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <SettingsSection
      title="Notifications"
      description="Configure how you receive notifications"
      isDirty={isDirty}
      onSave={() => setSaved(current)}
      onDiscard={() => setCurrent(saved)}
    >
      <div className={styles.group}>
        <Text weight="semibold">Email</Text>
        <div className={styles.toggleRow}>
          <div className={styles.labelGroup}>
            <Text>Daily digest</Text>
            <Text className={styles.description}>Summary of activity every morning</Text>
          </div>
          <Switch checked={current.emailDigest} onChange={() => toggle('emailDigest')} />
        </div>
        <div className={styles.toggleRow}>
          <div className={styles.labelGroup}>
            <Text>Mentions</Text>
            <Text className={styles.description}>When someone mentions you</Text>
          </div>
          <Switch checked={current.emailMentions} onChange={() => toggle('emailMentions')} />
        </div>
      </div>

      <Divider />

      <div className={styles.group}>
        <Text weight="semibold">Push Notifications</Text>
        <div className={styles.toggleRow}>
          <div className={styles.labelGroup}>
            <Text>System alerts</Text>
            <Text className={styles.description}>Critical system notifications</Text>
          </div>
          <Switch checked={current.pushAlerts} onChange={() => toggle('pushAlerts')} />
        </div>
        <div className={styles.toggleRow}>
          <div className={styles.labelGroup}>
            <Text>Direct messages</Text>
            <Text className={styles.description}>New messages from team members</Text>
          </div>
          <Switch checked={current.pushMessages} onChange={() => toggle('pushMessages')} />
        </div>
      </div>
    </SettingsSection>
  );
}
```

---

## Unsaved Changes Warning

```tsx
import * as React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Button,
  Text,
} from '@fluentui/react-components';

interface UnsavedChangesDialogProps {
  open: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

/**
 * UnsavedChangesDialog — Warns the user before navigating away with unsaved edits.
 *
 * Show this when isDirty is true and the user tries to
 * switch tabs or leave the settings page.
 */
export function UnsavedChangesDialog({
  open,
  onSave,
  onDiscard,
  onCancel,
}: UnsavedChangesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(e, data) => !data.open && onCancel()}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Unsaved Changes</DialogTitle>
          <DialogContent>
            <Text>You have unsaved changes. What would you like to do?</Text>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onDiscard}>Discard</Button>
            <Button appearance="secondary" onClick={onCancel}>Go Back</Button>
            <Button appearance="primary" onClick={onSave}>Save & Continue</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
```

---

## Best Practices

### ✅ Do

- **Use vertical TabList** for settings navigation on desktop
- **Track dirty state** by comparing current values to saved values
- **Show Save/Discard buttons only when dirty** to reduce visual clutter
- **Group related toggles** with section headers and descriptive text
- **Warn before navigation** when unsaved changes exist

### ❌ Don't

- **Don't auto-save on every keystroke** — settings should be explicit save
- **Don't mix unrelated settings** in one section
- **Don't use checkboxes for on/off settings** — use Switch instead
- **Don't forget to confirm destructive actions** (e.g. resetting to defaults)

---

## Related Documentation

- [Admin CRUD Tables](03a-admin-crud.md) — CRUD table patterns
- [Admin User Management](03b-admin-user-management.md) — User/role management
- [Tab Navigation](../03-patterns/navigation/03-tab-navigation.md) — Tab patterns
- [Settings Form](../03-patterns/forms/04c-settings-form.md) — Settings form patterns
