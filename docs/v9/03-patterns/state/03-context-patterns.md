# React Context Patterns

> **Module**: 03-patterns/state
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02
> **Prerequisites**: [Form State](02-form-state.md), [FluentProvider](../../01-foundation/02-fluent-provider.md)

## Overview

React Context is ideal for sharing UI state across an application — theme preferences, authentication, locale, layout settings. FluentUI v9 itself uses Context internally (via `FluentProvider`). This guide shows how to create your own contexts that integrate with FluentUI components.

---

## Pattern 1: Theme Mode Context

Manage light/dark mode switching across the app:

```tsx
// contexts/ThemeModeContext.tsx
import * as React from 'react';
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  type Theme,
} from '@fluentui/react-components';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeModeContextValue {
  /** Current resolved theme mode (always 'light' or 'dark'). */
  resolvedMode: 'light' | 'dark';
  /** User's preference (may be 'system'). */
  preference: ThemeMode;
  /** Change theme preference. */
  setPreference: (mode: ThemeMode) => void;
}

const ThemeModeContext = React.createContext<ThemeModeContextValue | undefined>(undefined);

/**
 * Hook to access theme mode context.
 * Must be used within ThemeModeProvider.
 */
export const useThemeMode = (): ThemeModeContextValue => {
  const context = React.useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeModeProvider');
  }
  return context;
};

/**
 * Resolves 'system' preference to 'light' or 'dark' based on OS setting.
 */
function resolveSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * ThemeModeProvider — Manages theme preference and provides the matching
 * FluentUI theme via FluentProvider.
 *
 * @example
 * ```tsx
 * <ThemeModeProvider>
 *   <App />
 * </ThemeModeProvider>
 * ```
 */
export const ThemeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preference, setPreference] = React.useState<ThemeMode>(() => {
    // Restore from localStorage if available
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme-mode') as ThemeMode) || 'system';
    }
    return 'system';
  });

  const [systemMode, setSystemMode] = React.useState<'light' | 'dark'>(resolveSystemTheme);

  // Listen for OS theme changes when preference is 'system'
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemMode(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Persist preference to localStorage
  React.useEffect(() => {
    localStorage.setItem('theme-mode', preference);
  }, [preference]);

  const resolvedMode = preference === 'system' ? systemMode : preference;
  const theme: Theme = resolvedMode === 'dark' ? webDarkTheme : webLightTheme;

  const value = React.useMemo(
    () => ({ resolvedMode, preference, setPreference }),
    [resolvedMode, preference],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <FluentProvider theme={theme}>
        {children}
      </FluentProvider>
    </ThemeModeContext.Provider>
  );
};
```

### Theme Switcher Component

```tsx
import { Switch, RadioGroup, Radio, Field } from '@fluentui/react-components';
import { useThemeMode } from '../contexts/ThemeModeContext';

function ThemeSwitcher() {
  const { preference, setPreference } = useThemeMode();

  return (
    <Field label="Theme">
      <RadioGroup
        value={preference}
        onChange={(e, data) => setPreference(data.value as 'light' | 'dark' | 'system')}
      >
        <Radio value="light" label="Light" />
        <Radio value="dark" label="Dark" />
        <Radio value="system" label="System" />
      </RadioGroup>
    </Field>
  );
}
```

---

## Pattern 2: Authentication Context

Share auth state to control UI visibility:

```tsx
// contexts/AuthContext.tsx
import * as React from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'viewer' | 'editor' | 'admin';
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

/** Hook to access auth context. */
export const useAuth = (): AuthContextValue => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Check for existing session on mount
  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          setUser(await response.json());
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    setUser(await response.json());
  }, []);

  const logout = React.useCallback(() => {
    fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }, []);

  const value = React.useMemo(
    () => ({ user, isAuthenticated: !!user, isLoading, login, logout }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### Auth-Aware UI

```tsx
import {
  Avatar,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Button,
  Spinner,
} from '@fluentui/react-components';
import { useAuth } from '../contexts/AuthContext';

function UserMenu() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) return <Spinner size="tiny" />;

  if (!isAuthenticated) {
    return <Button appearance="primary">Sign in</Button>;
  }

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Avatar name={user!.name} color="brand" />
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem onClick={logout}>Sign out</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
```

---

## Pattern 3: Layout Context

Share layout state (sidebar open/closed, density) across the app:

```tsx
// contexts/LayoutContext.tsx
import * as React from 'react';

interface LayoutContextValue {
  /** Whether the sidebar is expanded. */
  sidebarOpen: boolean;
  /** Toggle sidebar open/closed. */
  toggleSidebar: () => void;
  /** Content density: 'comfortable' or 'compact'. */
  density: 'comfortable' | 'compact';
  /** Change content density. */
  setDensity: (density: 'comfortable' | 'compact') => void;
}

const LayoutContext = React.createContext<LayoutContextValue | undefined>(undefined);

/** Hook to access layout context. */
export const useLayout = (): LayoutContextValue => {
  const context = React.useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within LayoutProvider');
  }
  return context;
};

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [density, setDensity] = React.useState<'comfortable' | 'compact'>('comfortable');

  const toggleSidebar = React.useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const value = React.useMemo(
    () => ({ sidebarOpen, toggleSidebar, density, setDensity }),
    [sidebarOpen, toggleSidebar, density, setDensity],
  );

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};
```

### Sidebar Toggle Button

```tsx
import { Button } from '@fluentui/react-components';
import { NavigationRegular } from '@fluentui/react-icons';
import { useLayout } from '../contexts/LayoutContext';

function SidebarToggle() {
  const { sidebarOpen, toggleSidebar } = useLayout();

  return (
    <Button
      icon={<NavigationRegular />}
      appearance="subtle"
      aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      onClick={toggleSidebar}
    />
  );
}
```

---

## Composing Multiple Providers

Combine all providers at the app root:

```tsx
// App.tsx
import { ThemeModeProvider } from './contexts/ThemeModeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LayoutProvider } from './contexts/LayoutContext';
import { AppShell } from './components/AppShell';

/**
 * App root. Providers are ordered from outermost (least changing)
 * to innermost (most changing) to minimize unnecessary re-renders.
 */
function App() {
  return (
    <ThemeModeProvider>        {/* Outermost: includes FluentProvider */}
      <AuthProvider>           {/* Auth state changes infrequently */}
        <LayoutProvider>       {/* Layout changes more often */}
          <AppShell />
        </LayoutProvider>
      </AuthProvider>
    </ThemeModeProvider>
  );
}
```

---

## Performance: Avoiding Unnecessary Re-renders

### Split Context by Change Frequency

If a context has values that change at different rates, split it:

```tsx
// ❌ Bad: Everything re-renders when sidebar toggles
const AppContext = React.createContext({ user, theme, sidebarOpen });

// ✅ Good: Only components using sidebarOpen re-render
const AuthContext = React.createContext({ user });
const ThemeContext = React.createContext({ theme });
const LayoutContext = React.createContext({ sidebarOpen });
```

### Memoize Context Values

Always wrap context values in `useMemo` to prevent reference changes on every render:

```tsx
// ❌ Bad: New object reference every render → all consumers re-render
<Context.Provider value={{ user, login, logout }}>

// ✅ Good: Stable reference, only changes when dependencies change
const value = React.useMemo(() => ({ user, login, logout }), [user, login, logout]);
<Context.Provider value={value}>
```

### Memoize Expensive Consumers

If a consumer component is expensive to render, wrap it in `React.memo`:

```tsx
const ExpensiveComponent = React.memo(function ExpensiveComponent() {
  const { sidebarOpen } = useLayout();
  // ... expensive rendering
});
```

---

## Best Practices

### ✅ Do

- **Always provide a default error** in custom hooks (`throw new Error(...)`) for missing providers
- **Use `useMemo`** for context values to prevent unnecessary re-renders
- **Split contexts** by change frequency (auth vs layout vs theme)
- **Order providers** from outermost (stable) to innermost (volatile)
- **Persist preferences** to `localStorage` when appropriate (theme, density)

### ❌ Don't

- **Don't put everything in one context** — leads to excessive re-renders
- **Don't create context for state that's only used in one component** — use local state instead
- **Don't skip the error boundary** in custom hooks — makes debugging much harder
- **Don't store server data in Context** — use React Query/SWR instead (see [Server State](05-server-state.md))

---

## Related Documentation

- [External Stores](04-external-stores.md) — Redux, Zustand for complex global state
- [FluentProvider](../../01-foundation/02-fluent-provider.md) — FluentUI's built-in context provider
- [Theming](../../01-foundation/03-theming.md) — FluentUI theme system
