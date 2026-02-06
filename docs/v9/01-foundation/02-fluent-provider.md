# FluentProvider

> **Package**: `@fluentui/react-provider`
> **Import**: `import { FluentProvider } from '@fluentui/react-components'`
> **Category**: Foundation

## Overview

`FluentProvider` is the **required** context provider for all FluentUI v9 applications. It provides:

- **Theme context** - Design tokens and colors
- **Direction context** - LTR/RTL text direction
- **Portal context** - Target document for overlay components
- **Focus management** - Tab navigation and focus indicators
- **Tooltip coordination** - Manages tooltip visibility across components

**⚠️ IMPORTANT**: Every FluentUI v9 application MUST have a `FluentProvider` at the root.

---

## Basic Usage

### Minimal Setup

```typescript
import * as React from 'react';
import {
  FluentProvider,
  webLightTheme,
  Button,
} from '@fluentui/react-components';

export const App: React.FC = () => {
  return (
    <FluentProvider theme={webLightTheme}>
      <Button appearance="primary">Hello FluentUI</Button>
    </FluentProvider>
  );
};
```

---

## Props Reference

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `theme` | `PartialTheme` | required | Theme object containing design tokens |
| `dir` | `'ltr' \| 'rtl'` | `'ltr'` | Text direction |
| `targetDocument` | `Document` | `document` | Target document for portals (SSR) |
| `applyStylesToPortals` | `boolean` | `true` | Pass styles to portal components |
| `customStyleHooks_unstable` | `CustomStyleHooks` | `undefined` | Custom style hooks for components |
| `overrides_unstable` | `OverridesContextValue` | `undefined` | Component override configuration |

---

## Available Themes

```typescript
import {
  // Web themes
  webLightTheme,
  webDarkTheme,
  
  // Teams themes
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  
  // Teams v21 themes
  teamsLightV21Theme,
  teamsDarkV21Theme,
} from '@fluentui/react-components';
```

| Theme | Description |
|-------|-------------|
| `webLightTheme` | Default light theme for web applications |
| `webDarkTheme` | Dark theme for web applications |
| `teamsLightTheme` | Microsoft Teams light theme |
| `teamsDarkTheme` | Microsoft Teams dark theme |
| `teamsHighContrastTheme` | High contrast theme for accessibility |
| `teamsLightV21Theme` | Teams v21 design light theme |
| `teamsDarkV21Theme` | Teams v21 design dark theme |

---

## Theme Switching

### Dark/Light Mode Toggle

```typescript
import * as React from 'react';
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Button,
  Switch,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import type { SwitchOnChangeData } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingHorizontalL,
    minHeight: '100vh',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalL,
  },
});

export const App: React.FC = () => {
  const styles = useStyles();
  const [isDark, setIsDark] = React.useState(false);

  const handleThemeChange = React.useCallback(
    (_ev: React.ChangeEvent<HTMLInputElement>, data: SwitchOnChangeData) => {
      setIsDark(data.checked);
    },
    []
  );

  return (
    <FluentProvider theme={isDark ? webDarkTheme : webLightTheme}>
      <div className={styles.container}>
        <div className={styles.controls}>
          <Switch
            checked={isDark}
            onChange={handleThemeChange}
            label={isDark ? 'Dark Mode' : 'Light Mode'}
          />
        </div>
        <Button appearance="primary">Themed Button</Button>
      </div>
    </FluentProvider>
  );
};
```

### System Preference Detection

```typescript
import * as React from 'react';
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
} from '@fluentui/react-components';

export const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = React.useState(() => {
    // Check system preference on initial load
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  React.useEffect(() => {
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <FluentProvider theme={isDark ? webDarkTheme : webLightTheme}>
      {children}
    </FluentProvider>
  );
};
```

---

## Nested Providers

FluentProvider can be nested to apply different themes to specific sections:

### Scoped Theme Section

```typescript
import * as React from 'react';
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Card,
  CardHeader,
  Text,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingHorizontalL,
  },
  darkSection: {
    padding: tokens.spacingHorizontalL,
    marginTop: tokens.spacingVerticalL,
  },
});

export const NestedProvidersExample: React.FC = () => {
  const styles = useStyles();

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.container}>
        <Text>This section uses the light theme</Text>
        <Button appearance="primary">Light Theme Button</Button>

        {/* Nested dark theme section */}
        <FluentProvider theme={webDarkTheme}>
          <div className={styles.darkSection}>
            <Card>
              <CardHeader
                header={<Text weight="semibold">Dark Theme Section</Text>}
              />
              <Text>This card uses the dark theme</Text>
              <Button appearance="primary">Dark Theme Button</Button>
            </Card>
          </div>
        </FluentProvider>
      </div>
    </FluentProvider>
  );
};
```

---

## RTL Support

### Right-to-Left Text Direction

```typescript
import * as React from 'react';
import {
  FluentProvider,
  webLightTheme,
  Button,
  Input,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalL,
  },
});

export const RTLExample: React.FC = () => {
  const styles = useStyles();

  return (
    <FluentProvider theme={webLightTheme} dir="rtl">
      <div className={styles.container}>
        <Input placeholder="نص باللغة العربية" />
        <Button appearance="primary">زر</Button>
      </div>
    </FluentProvider>
  );
};
```

### Mixed Direction Sections

```typescript
import * as React from 'react';
import {
  FluentProvider,
  webLightTheme,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  section: {
    padding: tokens.spacingHorizontalL,
    marginBottom: tokens.spacingVerticalM,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
  },
});

export const MixedDirectionExample: React.FC = () => {
  const styles = useStyles();

  return (
    <FluentProvider theme={webLightTheme} dir="ltr">
      <div className={styles.section}>
        <Text>English content (LTR)</Text>
      </div>

      <FluentProvider dir="rtl">
        <div className={styles.section}>
          <Text>محتوى عربي (RTL)</Text>
        </div>
      </FluentProvider>
    </FluentProvider>
  );
};
```

---

## Server-Side Rendering (SSR)

### SSR with targetDocument

For SSR, you need to provide `targetDocument` to ensure portals work correctly:

```typescript
import * as React from 'react';
import {
  FluentProvider,
  webLightTheme,
  SSRProvider,
} from '@fluentui/react-components';

export const SSRApp: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SSRProvider>
      <FluentProvider 
        theme={webLightTheme}
        targetDocument={typeof document !== 'undefined' ? document : undefined}
      >
        {children}
      </FluentProvider>
    </SSRProvider>
  );
};
```

### Next.js Integration

```typescript
// app/providers.tsx (App Router)
'use client';

import * as React from 'react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <FluentProvider theme={webLightTheme}>
      {children}
    </FluentProvider>
  );
};
```

```typescript
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## Portal Configuration

### applyStylesToPortals

By default, FluentProvider passes styles to portal components (Dialog, Popover, etc.):

```typescript
<FluentProvider 
  theme={webLightTheme}
  applyStylesToPortals={true} // default
>
  {/* Dialogs, Popovers, etc. will inherit theme styles */}
</FluentProvider>
```

Setting `applyStylesToPortals={false}` can improve performance if you don't need themed portals.

---

## Common Patterns

### Context Consumer Hook

Access the current provider context in child components:

```typescript
import * as React from 'react';
import {
  useFluent,
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingHorizontalM,
  },
});

export const DirectionAwareComponent: React.FC = () => {
  const styles = useStyles();
  const { dir, targetDocument } = useFluent();

  return (
    <div className={styles.container}>
      <Text>Current direction: {dir}</Text>
      <Text>Has target document: {targetDocument ? 'Yes' : 'No'}</Text>
    </div>
  );
};
```

---

## Troubleshooting

### Issue: Components not styled

**Cause**: Missing `FluentProvider` wrapper

**Solution**: Ensure your app root is wrapped:

```typescript
// ❌ Wrong
<App />

// ✅ Correct
<FluentProvider theme={webLightTheme}>
  <App />
</FluentProvider>
```

### Issue: Portals don't inherit theme

**Cause**: `applyStylesToPortals` set to `false` or nested provider issue

**Solution**: Ensure `applyStylesToPortals` is `true` (default) and check provider nesting.

### Issue: SSR hydration mismatch

**Cause**: Document not available during SSR

**Solution**: Use conditional `targetDocument`:

```typescript
targetDocument={typeof document !== 'undefined' ? document : undefined}
```

---

## See Also

- [Getting Started](01-getting-started.md) - Initial setup
- [Theming](03-theming.md) - Design tokens and custom themes
- [Styling with Griffel](04-styling-griffel.md) - CSS-in-JS styling
- [Overview](../00-overview.md) - Training program overview