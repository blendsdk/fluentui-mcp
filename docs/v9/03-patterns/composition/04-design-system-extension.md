# Design System Extension

> **Module**: 03-patterns/composition
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02
> **Prerequisites**: [Custom Components](03-custom-components.md), [Theming](../../01-foundation/03-theming.md)

## Overview

This guide covers how to extend FluentUI v9 into a company-specific design system. Rather than forking FluentUI, you layer your brand identity, custom tokens, shared components, and patterns on top of it. This gives you FluentUI's accessibility, theming, and component quality as a foundation, while expressing your company's unique design language.

---

## Architecture: Layered Design System

```
┌─────────────────────────────────────────┐
│  Your Application                        │
├─────────────────────────────────────────┤
│  Company Design System (your layer)      │
│  - Custom theme + tokens                 │
│  - Recomposed variants                   │
│  - Custom components                     │
│  - Shared patterns                       │
├─────────────────────────────────────────┤
│  FluentUI v9 (foundation)               │
│  - Components, hooks, utilities          │
│  - Design tokens, Griffel                │
│  - Accessibility built-in                │
└─────────────────────────────────────────┘
```

---

## 1. Custom Theme

### Creating a Brand Theme

Start by creating a custom theme with your company's brand colors:

```tsx
// theme/brand-theme.ts
import {
  createLightTheme,
  createDarkTheme,
  type BrandVariants,
  type Theme,
} from '@fluentui/react-components';

/**
 * Brand color palette generated from your primary brand color.
 * Use the FluentUI Theme Designer tool to generate these values:
 * https://react.fluentui.dev/?path=/docs/themedesigner
 */
const companyBrand: BrandVariants = {
  10: '#020305',
  20: '#111723',
  30: '#16253D',
  40: '#1B3154',
  50: '#1F3D6B',
  60: '#234A83',
  70: '#27579B',
  80: '#2B64B3',  // Primary brand color
  90: '#4A7DC4',
  100: '#6696D4',
  110: '#80AFE3',
  120: '#99C7F0',
  130: '#B2DFFB',
  140: '#CCE9FC',
  150: '#E5F4FE',
  160: '#F5FAFE',
};

/** Light theme for your company */
export const companyLightTheme: Theme = {
  ...createLightTheme(companyBrand),
};

/** Dark theme for your company */
export const companyDarkTheme: Theme = {
  ...createDarkTheme(companyBrand),
};
```

### Adding Custom Tokens

Extend the theme with company-specific tokens that don't exist in FluentUI:

```tsx
// theme/custom-tokens.ts
import { tokens } from '@fluentui/react-components';

/**
 * Company-specific semantic tokens.
 *
 * These use CSS custom properties that are set by the CompanyThemeProvider.
 * They complement FluentUI's built-in tokens for company-specific needs.
 */
export const companyTokens = {
  /** Sidebar width in collapsed state */
  sidebarWidthCollapsed: 'var(--company-sidebar-width-collapsed)',
  /** Sidebar width in expanded state */
  sidebarWidthExpanded: 'var(--company-sidebar-width-expanded)',
  /** Header height */
  headerHeight: 'var(--company-header-height)',
  /** Content max width for readable text */
  contentMaxWidth: 'var(--company-content-max-width)',
  /** Status colors beyond FluentUI's palette */
  statusCritical: 'var(--company-status-critical)',
  statusHealthy: 'var(--company-status-healthy)',
  statusDegraded: 'var(--company-status-degraded)',
} as const;

/**
 * Values for custom tokens in light mode.
 * These are injected as CSS custom properties by CompanyThemeProvider.
 */
export const companyLightTokenValues: Record<string, string> = {
  '--company-sidebar-width-collapsed': '48px',
  '--company-sidebar-width-expanded': '280px',
  '--company-header-height': '48px',
  '--company-content-max-width': '1200px',
  '--company-status-critical': '#d32f2f',
  '--company-status-healthy': '#2e7d32',
  '--company-status-degraded': '#ed6c02',
};

/** Values for custom tokens in dark mode. */
export const companyDarkTokenValues: Record<string, string> = {
  '--company-sidebar-width-collapsed': '48px',
  '--company-sidebar-width-expanded': '280px',
  '--company-header-height': '48px',
  '--company-content-max-width': '1200px',
  '--company-status-critical': '#ef5350',
  '--company-status-healthy': '#66bb6a',
  '--company-status-degraded': '#ffa726',
};
```

### Company Theme Provider

Wrap FluentUI's `FluentProvider` to inject your theme and custom tokens:

```tsx
// theme/CompanyThemeProvider.tsx
import * as React from 'react';
import { FluentProvider } from '@fluentui/react-components';
import { companyLightTheme, companyDarkTheme } from './brand-theme';
import { companyLightTokenValues, companyDarkTokenValues } from './custom-tokens';

interface CompanyThemeProviderProps {
  children: React.ReactNode;
  /** Color mode. Defaults to 'light'. */
  colorMode?: 'light' | 'dark';
}

/**
 * Company-wide theme provider.
 *
 * Wraps FluentProvider with:
 * 1. Company brand theme (light or dark)
 * 2. Custom CSS properties for company-specific tokens
 *
 * @example
 * ```tsx
 * <CompanyThemeProvider colorMode="light">
 *   <App />
 * </CompanyThemeProvider>
 * ```
 */
export const CompanyThemeProvider: React.FC<CompanyThemeProviderProps> = ({
  children,
  colorMode = 'light',
}) => {
  const theme = colorMode === 'dark' ? companyDarkTheme : companyLightTheme;
  const customTokens = colorMode === 'dark' ? companyDarkTokenValues : companyLightTokenValues;

  return (
    <FluentProvider theme={theme} style={customTokens as React.CSSProperties}>
      {children}
    </FluentProvider>
  );
};
```

---

## 2. Component Variants Library

Create a library of pre-configured component variants that express your design language:

### Variant Strategy

| Approach | When to Use | Example |
|----------|-------------|---------|
| **Props lockdown** | Lock appearance/size to brand defaults | `BrandButton` |
| **Wrapper + styles** | Add custom visual treatment | `GhostCard` |
| **Hook recomposition** | Change behavior or state logic | `AutoSaveInput` |
| **Full custom** | No FluentUI base component fits | `StatusCard` |

### Example: Button Variants

```tsx
// components/buttons/index.ts
import * as React from 'react';
import {
  Button,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import type { ButtonProps } from '@fluentui/react-components';

// ── PrimaryAction ──────────────────────────────────────────────
// The main CTA button used across the app. Always "primary" appearance.

const usePrimaryActionStyles = makeStyles({
  root: {
    minWidth: '120px',
    fontWeight: tokens.fontWeightSemibold,
  },
});

/** Primary CTA button. Locks appearance to "primary" with minimum width. */
export const PrimaryAction: React.FC<Omit<ButtonProps, 'appearance'>> = ({
  className,
  ...props
}) => {
  const styles = usePrimaryActionStyles();
  return (
    <Button
      {...props}
      appearance="primary"
      className={mergeClasses(styles.root, className)}
    />
  );
};

// ── SecondaryAction ────────────────────────────────────────────
// Supporting action button. Always "outline" appearance.

/** Secondary action button with outline appearance. */
export const SecondaryAction: React.FC<Omit<ButtonProps, 'appearance'>> = (props) => (
  <Button {...props} appearance="outline" />
);

// ── DestructiveAction ──────────────────────────────────────────
// Destructive/danger action button. Red styling.

const useDestructiveStyles = makeStyles({
  root: {
    backgroundColor: tokens.colorPaletteRedBackground3,
    color: tokens.colorNeutralForegroundOnBrand,
    ':hover': {
      backgroundColor: tokens.colorPaletteRedForeground1,
    },
  },
});

/** Destructive action button for delete/remove operations. */
export const DestructiveAction: React.FC<Omit<ButtonProps, 'appearance'>> = ({
  className,
  ...props
}) => {
  const styles = useDestructiveStyles();
  return (
    <Button
      {...props}
      className={mergeClasses(styles.root, className)}
    />
  );
};
```

### Example: Form Field Variant

```tsx
// components/forms/RequiredField.tsx
import * as React from 'react';
import { Field } from '@fluentui/react-components';
import type { FieldProps } from '@fluentui/react-components';

/**
 * RequiredField — A Field that is always required with consistent styling.
 * Adds the required indicator and sets validation message positioning.
 */
export const RequiredField: React.FC<FieldProps> = (props) => (
  <Field
    {...props}
    required
    validationMessageIcon={props.validationMessageIcon}
    validationState={props.validationState}
  />
);
```

---

## 3. Shared Pattern Library

Build reusable UI patterns that combine multiple FluentUI components:

### Page Header Pattern

```tsx
// patterns/PageHeader.tsx
import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbDivider,
  BreadcrumbButton,
  Title2,
  Body1,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalL,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    marginBottom: tokens.spacingVerticalL,
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
});

interface BreadcrumbEntry {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  /** Breadcrumb trail. Last item is current page. */
  breadcrumbs?: BreadcrumbEntry[];
  /** Page title */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Actions rendered on the right (buttons, etc.) */
  actions?: React.ReactNode;
}

/**
 * PageHeader — Consistent page header with breadcrumbs, title, and actions.
 *
 * @example
 * ```tsx
 * <PageHeader
 *   breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Settings' }]}
 *   title="General Settings"
 *   subtitle="Configure your application preferences"
 *   actions={<PrimaryAction>Save</PrimaryAction>}
 * />
 * ```
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbs,
  title,
  subtitle,
  actions,
}) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.label}>
              {index > 0 && <BreadcrumbDivider />}
              <BreadcrumbItem>
                {crumb.href ? (
                  <BreadcrumbButton as="a" href={crumb.href}>
                    {crumb.label}
                  </BreadcrumbButton>
                ) : (
                  <BreadcrumbButton current>{crumb.label}</BreadcrumbButton>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </Breadcrumb>
      )}
      <div className={styles.titleRow}>
        <div className={styles.titleGroup}>
          <Title2>{title}</Title2>
          {subtitle && <Body1>{subtitle}</Body1>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
};
```

### Empty State Pattern

```tsx
// patterns/EmptyState.tsx
import * as React from 'react';
import {
  Title3,
  Body1,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacingVerticalXXXL,
    textAlign: 'center',
    gap: tokens.spacingVerticalM,
  },
  icon: {
    fontSize: '48px',
    color: tokens.colorNeutralForeground3,
  },
  description: {
    color: tokens.colorNeutralForeground3,
    maxWidth: '400px',
  },
});

interface EmptyStateProps {
  /** Large icon displayed above the title */
  icon?: React.ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Action buttons (e.g., "Create new") */
  actions?: React.ReactNode;
}

/**
 * EmptyState — Consistent empty/no-data state display.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actions,
}) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <Title3>{title}</Title3>
      {description && <Body1 className={styles.description}>{description}</Body1>}
      {actions && <div>{actions}</div>}
    </div>
  );
};
```

---

## 4. Package Structure

Organize your design system as a publishable package:

```
@company/design-system/
├── src/
│   ├── theme/
│   │   ├── brand-theme.ts                # Brand color palette + themes
│   │   ├── custom-tokens.ts              # Company-specific tokens
│   │   ├── CompanyThemeProvider.tsx       # Theme wrapper component
│   │   └── index.ts
│   ├── components/
│   │   ├── buttons/                      # Button variants
│   │   │   ├── PrimaryAction.tsx
│   │   │   ├── SecondaryAction.tsx
│   │   │   ├── DestructiveAction.tsx
│   │   │   └── index.ts
│   │   ├── forms/                        # Form component variants
│   │   │   ├── RequiredField.tsx
│   │   │   └── index.ts
│   │   └── custom/                       # Fully custom components
│   │       ├── StatusCard/
│   │       └── index.ts
│   ├── patterns/                         # Shared UI patterns
│   │   ├── PageHeader.tsx
│   │   ├── EmptyState.tsx
│   │   └── index.ts
│   └── index.ts                          # Root barrel export
├── package.json
└── tsconfig.json
```

### Root Export

```tsx
// src/index.ts

// Theme
export { CompanyThemeProvider } from './theme';
export { companyLightTheme, companyDarkTheme } from './theme';
export { companyTokens } from './theme';

// Component variants
export { PrimaryAction, SecondaryAction, DestructiveAction } from './components/buttons';
export { RequiredField } from './components/forms';

// Custom components (export hooks for recomposition)
export {
  StatusCard,
  useStatusCard,
  useStatusCardStyles,
  renderStatusCard,
} from './components/custom/StatusCard';
export type {
  StatusCardProps,
  StatusCardState,
  StatusCardSlots,
} from './components/custom/StatusCard';

// Patterns
export { PageHeader } from './patterns/PageHeader';
export { EmptyState } from './patterns/EmptyState';

// Re-export FluentUI so consumers don't need a separate dependency
export {
  FluentProvider,
  Button,
  Input,
  Field,
  // ... all components your apps use
} from '@fluentui/react-components';
```

---

## 5. Versioning Strategy

### Semantic Versioning

| FluentUI Change | Your Package Action |
|-----------------|---------------------|
| Patch release (9.x.Y) | No action needed |
| Minor release (9.Y.0) | Test, update if new features needed |
| `_unstable` hook signature change | Update recomposed components, bump minor |
| Major release (10.0.0) | Major version of your package |

### Peer Dependencies

```json
{
  "name": "@company/design-system",
  "peerDependencies": {
    "@fluentui/react-components": "^9.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

---

## Best Practices

### ✅ Do

- **Layer, don't fork** — Always build on top of FluentUI, never copy/modify source
- **Use the theme system** — All custom tokens go through CSS custom properties
- **Re-export FluentUI** — Single import source for consumers
- **Document everything** — Every variant needs JSDoc and usage examples
- **Version together** — Package version tracks FluentUI compatibility

### ❌ Don't

- **Don't override FluentUI internals** — Only use public APIs and `_unstable` hooks
- **Don't hardcode values** — Always use tokens (FluentUI or custom)
- **Don't create redundant components** — Check if FluentUI already provides what you need
- **Don't skip accessibility** — Custom components must match FluentUI's a11y standards

---

## Related Documentation

- [Custom Components](03-custom-components.md) — Building components with FluentUI patterns
- [Testing Patterns](05-testing-patterns.md) — Testing your design system
- [Theming](../../01-foundation/03-theming.md) — FluentUI theme system deep dive
- [FluentProvider](../../01-foundation/02-fluent-provider.md) — Provider configuration
