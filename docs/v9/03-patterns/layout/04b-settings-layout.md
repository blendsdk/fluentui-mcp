# Settings Layout Pattern

> **File**: 03-patterns/layout/04b-settings-layout.md
> **FluentUI Version**: 9.x

## Overview

Settings layouts for application configuration pages. This pattern includes navigation patterns, grouped settings sections, and form layouts commonly used in settings/preferences pages.

## Basic Settings Layout

```tsx
import { makeStyles, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: tokens.spacingVerticalL,
    
    '@media (min-width: 768px)': {
      flexDirection: 'row',
      gap: tokens.spacingHorizontalXL,
    },
  },
  nav: {
    width: '100%',
    marginBottom: tokens.spacingVerticalL,
    
    '@media (min-width: 768px)': {
      width: '240px',
      flexShrink: 0,
      marginBottom: 0,
    },
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  header: {
    marginBottom: tokens.spacingVerticalL,
  },
});

interface SettingsLayoutProps {
  title: string;
  description?: string;
  navigation: React.ReactNode;
  children: React.ReactNode;
}

export const SettingsLayout = ({
  title,
  description,
  navigation,
  children,
}: SettingsLayoutProps) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <aside className={styles.nav}>
        {navigation}
      </aside>
      
      <main className={styles.content}>
        <header className={styles.header}>
          <Text as="h1" size={700} weight="semibold">
            {title}
          </Text>
          {description && (
            <Text block style={{ color: tokens.colorNeutralForeground3 }}>
              {description}
            </Text>
          )}
        </header>
        {children}
      </main>
    </div>
  );
};
```

## Settings Navigation

```tsx
import { makeStyles, tokens, Text, mergeClasses } from '@fluentui/react-components';

const useStyles = makeStyles({
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
  },
  section: {
    marginBottom: tokens.spacingVerticalM,
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    color: tokens.colorNeutralForeground1,
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  itemActive: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
});

interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

interface SettingsNavProps {
  sections: NavSection[];
  activeId: string;
  onSelect: (id: string) => void;
}

export const SettingsNav = ({ sections, activeId, onSelect }: SettingsNavProps) => {
  const styles = useStyles();

  return (
    <nav className={styles.nav}>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className={styles.section}>
          {section.title && (
            <Text className={styles.sectionTitle}>{section.title}</Text>
          )}
          {section.items.map(item => (
            <a
              key={item.id}
              href={item.href || `#${item.id}`}
              className={mergeClasses(
                styles.item,
                item.id === activeId && styles.itemActive
              )}
              onClick={(e) => {
                e.preventDefault();
                onSelect(item.id);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      ))}
    </nav>
  );
};
```

## Settings Section

```tsx
import { makeStyles, tokens, Card, Text, Divider } from '@fluentui/react-components';

const useStyles = makeStyles({
  section: {
    marginBottom: tokens.spacingVerticalXL,
  },
  card: {
    padding: tokens.spacingVerticalL,
  },
  header: {
    marginBottom: tokens.spacingVerticalM,
  },
  title: {
    fontWeight: tokens.fontWeightSemibold,
  },
  description: {
    color: tokens.colorNeutralForeground3,
    marginTop: tokens.spacingVerticalXS,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
});

interface SettingsSectionProps {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const SettingsSection = ({
  id,
  title,
  description,
  children,
}: SettingsSectionProps) => {
  const styles = useStyles();

  return (
    <section id={id} className={styles.section}>
      <Card className={styles.card}>
        <header className={styles.header}>
          <Text className={styles.title} size={500}>
            {title}
          </Text>
          {description && (
            <Text className={styles.description} size={300}>
              {description}
            </Text>
          )}
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </Card>
    </section>
  );
};
```

## Settings Row

```tsx
import { makeStyles, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  row: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    padding: `${tokens.spacingVerticalM} 0`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    
    '@media (min-width: 640px)': {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    
    '&:last-child': {
      borderBottom: 'none',
      paddingBottom: 0,
    },
    
    '&:first-child': {
      paddingTop: 0,
    },
  },
  labelGroup: {
    flex: 1,
    minWidth: 0,
    
    '@media (min-width: 640px)': {
      paddingRight: tokens.spacingHorizontalL,
    },
  },
  label: {
    fontWeight: tokens.fontWeightSemibold,
  },
  description: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    marginTop: tokens.spacingVerticalXXS,
  },
  control: {
    flexShrink: 0,
  },
});

interface SettingsRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

export const SettingsRow = ({ label, description, children }: SettingsRowProps) => {
  const styles = useStyles();

  return (
    <div className={styles.row}>
      <div className={styles.labelGroup}>
        <Text className={styles.label}>{label}</Text>
        {description && (
          <Text className={styles.description} block>
            {description}
          </Text>
        )}
      </div>
      <div className={styles.control}>
        {children}
      </div>
    </div>
  );
};
```

## Complete Settings Page Example

```tsx
import { useState } from 'react';
import {
  FluentProvider,
  webLightTheme,
  Switch,
  Select,
  Input,
  Button,
  Avatar,
} from '@fluentui/react-components';
import {
  PersonRegular,
  LockClosedRegular,
  AlertRegular,
  PaintBrushRegular,
} from '@fluentui/react-icons';

// Import components from above
// import { SettingsLayout, SettingsNav, SettingsSection, SettingsRow } from './components';

export const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: true,
  });

  const navSections = [
    {
      title: 'Account',
      items: [
        { id: 'profile', label: 'Profile', icon: <PersonRegular /> },
        { id: 'security', label: 'Security', icon: <LockClosedRegular /> },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { id: 'notifications', label: 'Notifications', icon: <AlertRegular /> },
        { id: 'appearance', label: 'Appearance', icon: <PaintBrushRegular /> },
      ],
    },
  ];

  return (
    <FluentProvider theme={webLightTheme}>
      <SettingsLayout
        title="Settings"
        description="Manage your account settings and preferences"
        navigation={
          <SettingsNav
            sections={navSections}
            activeId={activeSection}
            onSelect={setActiveSection}
          />
        }
      >
        <SettingsSection
          id="profile"
          title="Profile"
          description="Manage your public profile information"
        >
          <SettingsRow label="Avatar">
            <Avatar name="John Doe" size={64} />
          </SettingsRow>
          
          <SettingsRow
            label="Display Name"
            description="This is how your name appears to others"
          >
            <Input defaultValue="John Doe" style={{ width: '200px' }} />
          </SettingsRow>
          
          <SettingsRow label="Email">
            <Input type="email" defaultValue="john@example.com" style={{ width: '200px' }} />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection
          id="notifications"
          title="Notifications"
          description="Choose how you want to be notified"
        >
          <SettingsRow
            label="Email Notifications"
            description="Receive email updates about your account"
          >
            <Switch
              checked={notifications.email}
              onChange={(e, data) => setNotifications(prev => ({ ...prev, email: data.checked }))}
            />
          </SettingsRow>
          
          <SettingsRow
            label="Push Notifications"
            description="Receive push notifications in your browser"
          >
            <Switch
              checked={notifications.push}
              onChange={(e, data) => setNotifications(prev => ({ ...prev, push: data.checked }))}
            />
          </SettingsRow>
          
          <SettingsRow
            label="Marketing Emails"
            description="Receive updates about new features and offers"
          >
            <Switch
              checked={notifications.marketing}
              onChange={(e, data) => setNotifications(prev => ({ ...prev, marketing: data.checked }))}
            />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection
          id="appearance"
          title="Appearance"
          description="Customize the look and feel"
        >
          <SettingsRow
            label="Theme"
            description="Select your preferred color theme"
          >
            <Select style={{ width: '150px' }}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </Select>
          </SettingsRow>
          
          <SettingsRow
            label="Language"
            description="Select your preferred language"
          >
            <Select style={{ width: '150px' }}>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </Select>
          </SettingsRow>
        </SettingsSection>

        <div style={{ display: 'flex', gap: tokens.spacingHorizontalM }}>
          <Button appearance="primary">Save Changes</Button>
          <Button appearance="secondary">Cancel</Button>
        </div>
      </SettingsLayout>
    </FluentProvider>
  );
};
```

## Grouped Settings (Alternative Layout)

```tsx
import { makeStyles, tokens, Card, Text, Switch } from '@fluentui/react-components';

const useStyles = makeStyles({
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  card: {
    padding: tokens.spacingVerticalM,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  iconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorBrandBackground2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontWeight: tokens.fontWeightSemibold,
  },
  description: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const SettingItem = ({
  icon,
  label,
  description,
  checked,
  onChange,
}: SettingItemProps) => {
  const styles = useStyles();

  return (
    <Card className={styles.card} onClick={() => onChange(!checked)}>
      <div className={styles.iconWrapper}>{icon}</div>
      <div className={styles.content}>
        <Text className={styles.label}>{label}</Text>
        <Text className={styles.description} block>{description}</Text>
      </div>
      <Switch checked={checked} onChange={(e, data) => onChange(data.checked)} />
    </Card>
  );
};
```

## Best Practices

1. **Logical grouping** - Group related settings together
2. **Clear labels** - Use descriptive labels and helper text
3. **Immediate feedback** - Show changes take effect immediately or require save
4. **Undo capability** - Allow users to revert changes
5. **Responsive layout** - Stack navigation on mobile
6. **Keyboard navigation** - Ensure all settings are keyboard accessible

## Related Documentation

- [04a-dashboard-layout.md](04a-dashboard-layout.md) - Dashboard layouts
- [04c-detail-page-layout.md](04c-detail-page-layout.md) - Detail page layouts
- [Form Patterns](../forms/00-forms-index.md)