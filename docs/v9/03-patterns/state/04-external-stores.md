# External State Stores

> **Module**: 03-patterns/state
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02
> **Prerequisites**: [Context Patterns](03-context-patterns.md)

## Overview

For complex application state beyond what React Context handles well — deeply nested state, frequent updates, cross-cutting concerns — external state management libraries provide better performance and developer experience. This guide covers integrating FluentUI v9 with Redux Toolkit, Zustand, and Jotai.

---

## Redux Toolkit Integration

### Store Setup

```tsx
// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { userSlice } from './slices/userSlice';
import { settingsSlice } from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    settings: settingsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/** Typed dispatch hook. */
export const useAppDispatch: () => AppDispatch = useDispatch;

/** Typed selector hook. */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Slice with FluentUI Form Data

```tsx
// store/slices/settingsSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  density: 'comfortable' | 'compact';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  language: string;
}

const initialState: SettingsState = {
  theme: 'system',
  density: 'comfortable',
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  language: 'en',
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<SettingsState['theme']>) => {
      state.theme = action.payload;
    },
    setDensity: (state, action: PayloadAction<SettingsState['density']>) => {
      state.density = action.payload;
    },
    setNotification: (
      state,
      action: PayloadAction<{ key: keyof SettingsState['notifications']; value: boolean }>,
    ) => {
      state.notifications[action.key] = action.value;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
  },
});

export const { setTheme, setDensity, setNotification, setLanguage } = settingsSlice.actions;
```

### FluentUI Settings Panel Connected to Redux

```tsx
// components/SettingsPanel.tsx
import * as React from 'react';
import {
  RadioGroup,
  Radio,
  Switch,
  Select,
  Field,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setTheme, setDensity, setNotification, setLanguage } from '../store/slices/settingsSlice';

const useStyles = makeStyles({
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    maxWidth: '500px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
});

function SettingsPanel() {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);

  return (
    <div className={styles.panel}>
      {/* Theme selection */}
      <Field label="Theme">
        <RadioGroup
          value={settings.theme}
          onChange={(e, data) =>
            dispatch(setTheme(data.value as 'light' | 'dark' | 'system'))
          }
        >
          <Radio value="light" label="Light" />
          <Radio value="dark" label="Dark" />
          <Radio value="system" label="System" />
        </RadioGroup>
      </Field>

      {/* Density selection */}
      <Field label="Density">
        <RadioGroup
          value={settings.density}
          onChange={(e, data) =>
            dispatch(setDensity(data.value as 'comfortable' | 'compact'))
          }
        >
          <Radio value="comfortable" label="Comfortable" />
          <Radio value="compact" label="Compact" />
        </RadioGroup>
      </Field>

      {/* Notification toggles */}
      <div className={styles.section}>
        <Switch
          checked={settings.notifications.email}
          onChange={(e, data) =>
            dispatch(setNotification({ key: 'email', value: data.checked }))
          }
          label="Email notifications"
        />
        <Switch
          checked={settings.notifications.push}
          onChange={(e, data) =>
            dispatch(setNotification({ key: 'push', value: data.checked }))
          }
          label="Push notifications"
        />
        <Switch
          checked={settings.notifications.sms}
          onChange={(e, data) =>
            dispatch(setNotification({ key: 'sms', value: data.checked }))
          }
          label="SMS notifications"
        />
      </div>

      {/* Language selection */}
      <Field label="Language">
        <Select
          value={settings.language}
          onChange={(e, data) => dispatch(setLanguage(data.value))}
        >
          <option value="en">English</option>
          <option value="de">Deutsch</option>
          <option value="fr">Français</option>
          <option value="ja">日本語</option>
        </Select>
      </Field>
    </div>
  );
}
```

---

## Zustand Integration

Zustand is a lightweight alternative to Redux with less boilerplate. It works well with FluentUI because it provides hooks by default.

### Store Setup

```tsx
// store/useSettingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  // State
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  density: 'comfortable' | 'compact';

  // Actions
  setTheme: (theme: SettingsStore['theme']) => void;
  toggleSidebar: () => void;
  setDensity: (density: SettingsStore['density']) => void;
}

/**
 * Zustand store for app settings.
 * Automatically persisted to localStorage.
 */
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      // Initial state
      theme: 'system',
      sidebarOpen: true,
      density: 'comfortable',

      // Actions
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setDensity: (density) => set({ density }),
    }),
    {
      name: 'app-settings', // localStorage key
    },
  ),
);
```

### FluentUI Component Connected to Zustand

```tsx
// components/Header.tsx
import * as React from 'react';
import {
  Button,
  Switch,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
} from '@fluentui/react-components';
import {
  NavigationRegular,
  WeatherMoonRegular,
  WeatherSunnyRegular,
} from '@fluentui/react-icons';
import { useSettingsStore } from '../store/useSettingsStore';

function Header() {
  // Select only needed state — Zustand only re-renders when selected values change
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const toggleSidebar = useSettingsStore((s) => s.toggleSidebar);

  return (
    <Toolbar>
      <ToolbarButton
        icon={<NavigationRegular />}
        aria-label="Toggle sidebar"
        onClick={toggleSidebar}
      />
      <ToolbarDivider />
      <ToolbarButton
        icon={theme === 'dark' ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
        aria-label="Toggle theme"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
    </Toolbar>
  );
}
```

### Zustand with FluentUI Theme Provider

```tsx
// App.tsx
import * as React from 'react';
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';
import { useSettingsStore } from './store/useSettingsStore';

function App() {
  const theme = useSettingsStore((s) => s.theme);

  const resolvedTheme = React.useMemo(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? webDarkTheme
        : webLightTheme;
    }
    return theme === 'dark' ? webDarkTheme : webLightTheme;
  }, [theme]);

  return (
    <FluentProvider theme={resolvedTheme}>
      <AppContent />
    </FluentProvider>
  );
}
```

---

## Jotai Integration

Jotai uses atomic state — each piece of state is an independent atom. This pairs well with FluentUI because each component can subscribe to exactly the atoms it needs.

### Atoms

```tsx
// atoms/settingsAtoms.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

/** Theme preference atom. Persisted to localStorage. */
export const themeModeAtom = atomWithStorage<'light' | 'dark' | 'system'>(
  'theme-mode',
  'system',
);

/** Sidebar open/closed atom. */
export const sidebarOpenAtom = atom(true);

/** Density atom. */
export const densityAtom = atomWithStorage<'comfortable' | 'compact'>(
  'density',
  'comfortable',
);

/** Derived atom: resolve 'system' to actual theme. */
export const resolvedThemeAtom = atom((get) => {
  const mode = get(themeModeAtom);
  if (mode === 'system') {
    // In real app, also listen to matchMedia changes
    return 'light';
  }
  return mode;
});
```

### FluentUI Component with Jotai

```tsx
// components/ThemeToggle.tsx
import * as React from 'react';
import { ToolbarButton } from '@fluentui/react-components';
import { WeatherMoonRegular, WeatherSunnyRegular } from '@fluentui/react-icons';
import { useAtom } from 'jotai';
import { themeModeAtom } from '../atoms/settingsAtoms';

function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeModeAtom);

  return (
    <ToolbarButton
      icon={theme === 'dark' ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    />
  );
}
```

---

## Comparison: When to Use What

| Library | Bundle Size | Boilerplate | Best For |
|---------|-------------|-------------|----------|
| **React Context** | 0 KB | Low | Theme, auth, small shared state |
| **Redux Toolkit** | ~11 KB | Medium | Large apps, complex state, devtools |
| **Zustand** | ~1 KB | Very low | Medium apps, simple API, persistence |
| **Jotai** | ~2 KB | Very low | Atomic state, fine-grained subscriptions |

### Decision Guide

- **Start with React Context** for theme/auth/locale
- **Upgrade to Zustand** when Context causes re-render issues
- **Use Redux Toolkit** for large enterprise apps with many developers
- **Use Jotai** when you need fine-grained atom-level subscriptions

---

## Best Practices

### ✅ Do

- **Select only needed state** — prevents unnecessary re-renders
- **Keep FluentUI event handlers thin** — dispatch actions in `onChange`, don't put business logic there
- **Persist user preferences** — theme, density, sidebar state
- **Use TypeScript** — type your stores/atoms for safety with FluentUI's typed `onChange` data

### ❌ Don't

- **Don't store server/API data in Redux/Zustand** — use React Query/SWR (see [Server State](05-server-state.md))
- **Don't put form state in global stores** — keep it local unless multiple components need it
- **Don't create one giant store** — split by domain (settings, user, layout)
- **Don't forget `useCallback`** for Redux dispatch wrappers passed as props

---

## Related Documentation

- [Context Patterns](03-context-patterns.md) — React Context for simpler state sharing
- [Server State](05-server-state.md) — React Query/SWR for API data
- [Complex State](06-complex-state.md) — Undo/redo, pagination, filters
