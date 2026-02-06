# Getting Started with FluentUI v9

> **Package**: `@fluentui/react-components` (v9.72.x)
> **Prerequisites**: React 16.14+ / 17.x / 18.x / 19.x
> **Category**: Foundation

## Overview

FluentUI v9 (also known as "React Components" or "Fluent UI React v9") is Microsoft's latest React component library implementing the Fluent 2 Design System. It provides accessible, high-performance components with built-in theming support.

---

## Installation

### Package Installation

```bash
# Main components package (includes all stable components)
yarn add @fluentui/react-components

# Icons package (separate for tree-shaking)
yarn add @fluentui/react-icons
```

### Peer Dependencies

FluentUI v9 requires React and React DOM:

```json
{
  "peerDependencies": {
    "react": ">=16.14.0 <20.0.0",
    "react-dom": ">=16.14.0 <20.0.0",
    "@types/react": ">=16.14.0 <20.0.0",
    "@types/react-dom": ">=16.9.0 <20.0.0"
  }
}
```

### TypeScript Configuration

FluentUI v9 is written in TypeScript and provides full type definitions. Recommended `tsconfig.json` settings:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true
  }
}
```

---

## Minimal Application

### Required: FluentProvider

**Every FluentUI v9 application MUST be wrapped in a `FluentProvider`**. This provider:

- Applies the theme to all components
- Sets up context for focus management
- Provides portal target for overlays
- Handles text direction (LTR/RTL)

### Basic App Structure

```typescript
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import {
  FluentProvider,
  webLightTheme,
} from '@fluentui/react-components';

import { App } from './App';

const root = createRoot(document.getElementById('root')!);

root.render(
  <FluentProvider theme={webLightTheme}>
    <App />
  </FluentProvider>
);
```

### First Component Example

```typescript
import * as React from 'react';
import {
  Button,
  makeStyles,
  tokens,
  Title1,
  Body1,
} from '@fluentui/react-components';
import { CalendarMonthRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    padding: tokens.spacingHorizontalXL,
  },
  buttonRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
  },
});

export const App: React.FC = () => {
  const styles = useStyles();
  const [count, setCount] = React.useState(0);

  return (
    <div className={styles.container}>
      <Title1>Welcome to FluentUI v9</Title1>
      <Body1>You clicked the button {count} times.</Body1>
      
      <div className={styles.buttonRow}>
        <Button
          appearance="primary"
          icon={<CalendarMonthRegular />}
          onClick={() => setCount(c => c + 1)}
        >
          Click Me
        </Button>
        
        <Button
          appearance="secondary"
          onClick={() => setCount(0)}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};
```

---

## Available Themes

FluentUI v9 includes several built-in themes:

```typescript
import {
  // Web themes
  webLightTheme,
  webDarkTheme,
  
  // Teams themes
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
} from '@fluentui/react-components';
```

| Theme | Use Case |
|-------|----------|
| `webLightTheme` | Default light theme for web apps |
| `webDarkTheme` | Dark mode for web apps |
| `teamsLightTheme` | Microsoft Teams light theme |
| `teamsDarkTheme` | Microsoft Teams dark theme |
| `teamsHighContrastTheme` | Accessibility high contrast theme |

---

## Import Patterns

### Named Imports (Recommended)

```typescript
// Import specific components - best for tree-shaking
import { Button, Input, Dialog } from '@fluentui/react-components';
```

### Import Categories

```typescript
// Stable components and utilities
import { Button, Input } from '@fluentui/react-components';

// Unstable/Preview components (API may change)
import { InfoLabel } from '@fluentui/react-components/unstable';
```

### Icons Import

```typescript
// Import specific icons (supports tree-shaking)
import {
  CalendarMonthRegular,
  CalendarMonthFilled,
  bundleIcon,
} from '@fluentui/react-icons';

// Create a filled/regular bundle
const CalendarMonth = bundleIcon(CalendarMonthFilled, CalendarMonthRegular);
```

---

## Project Structure Recommendation

```
src/
├── index.tsx          # Entry point with FluentProvider
├── App.tsx            # Root component
├── theme/
│   ├── index.ts       # Custom theme exports
│   └── customTheme.ts # Theme customizations
├── styles/
│   └── shared.ts      # Shared makeStyles definitions
├── components/
│   ├── Layout/
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   └── Features/
│       └── Dashboard.tsx
└── pages/
    └── Home.tsx
```

---

## Development Tools

### VS Code Extensions

- **ESLint** - Code quality
- **Prettier** - Code formatting
- **TypeScript and JavaScript** - TypeScript support

### Browser Tools

- **React Developer Tools** - Component inspection
- **Accessibility Insights** - A11y testing

### Package Scripts

Recommended scripts for your `package.json`:

```json
{
  "scripts": {
    "start": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## Vite Setup (Recommended)

### Create Project

```bash
yarn create vite my-app --template react-ts
cd my-app
yarn add @fluentui/react-components @fluentui/react-icons
```

### Vite Configuration

No special configuration needed. FluentUI v9 works out of the box with Vite.

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

---

## Common Issues & Solutions

### Issue: Components not styled correctly

**Cause**: Missing `FluentProvider` wrapper

**Solution**: Ensure your app root is wrapped:

```typescript
<FluentProvider theme={webLightTheme}>
  <App />
</FluentProvider>
```

### Issue: Icons not showing

**Cause**: Missing icons package

**Solution**: Install the icons package:

```bash
yarn add @fluentui/react-icons
```

### Issue: TypeScript errors with themes

**Cause**: Type version mismatch

**Solution**: Ensure `@types/react` version matches peer dependency requirements.

---

## Next Steps

After setup, continue with:

1. [FluentProvider Configuration](02-fluent-provider.md) - Advanced provider setup
2. [Theming](03-theming.md) - Customize colors and tokens
3. [Styling with Griffel](04-styling-griffel.md) - CSS-in-JS styling
4. [Component Architecture](05-component-architecture.md) - Understand component patterns
5. [Accessibility](06-accessibility.md) - Build accessible applications

---

## See Also

- [Overview](../00-overview.md) - Training program overview
- [Quick Reference](../99-quick-reference.md) - Rapid lookup
- [Component Index](../02-components/00-component-index.md) - All components