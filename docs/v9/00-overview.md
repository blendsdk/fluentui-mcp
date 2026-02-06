# FluentUI v9 AI Training Program

> **Purpose**: Complete training materials for AI to become expert in Microsoft FluentUI v9
> **Version**: FluentUI React Components v9.x
> **Last Updated**: 2026-02-03

## 🎯 Training Objective

After completing this training, you will be able to:

- Build enterprise-grade React applications using FluentUI v9 components
- Apply proper theming, styling, and accessibility patterns
- Implement complex UI patterns following Microsoft design guidelines
- Create maintainable, performant, and accessible user interfaces

---

## 📚 Training Modules

### Module 1: Foundation (Start Here)

**MUST READ before using any components.**

| File | Topic | Description |
|------|-------|-------------|
| [01-getting-started](01-foundation/01-getting-started.md) | Setup | Installation, project setup, first app |
| [02-fluent-provider](01-foundation/02-fluent-provider.md) | Provider | FluentProvider configuration |
| [03-theming](01-foundation/03-theming.md) | Theming | Design tokens, themes, customization |
| [04-styling-griffel](01-foundation/04-styling-griffel.md) | Styling | Griffel CSS-in-JS system |
| [05-component-architecture](01-foundation/05-component-architecture.md) | Architecture | Hooks, slots, state patterns |
| [06-accessibility](01-foundation/06-accessibility.md) | A11y | Accessibility fundamentals |

### Module 2: Components

Component-by-component documentation organized by category.

| Category | Components | Link |
|----------|------------|------|
| **Buttons** | Button, CompoundButton, MenuButton, SplitButton, ToggleButton | [buttons/](02-components/buttons/) |
| **Forms** | Input, Textarea, Select, Combobox, Checkbox, Radio, Switch, Slider, SpinButton, Field, SearchBox | [forms/](02-components/forms/) |
| **Navigation** | Menu, Tabs, Breadcrumb, Nav, Link | [navigation/](02-components/navigation/) |
| **Data Display** | Avatar, Badge, Table, DataGrid, Tree, List, Tag, Persona, Text, Image, Skeleton | [data-display/](02-components/data-display/) |
| **Feedback** | Dialog, Toast, MessageBar, Spinner, ProgressBar, Tooltip | [feedback/](02-components/feedback/) |
| **Overlays** | Popover, Drawer, TeachingPopover | [overlays/](02-components/overlays/) |
| **Layout** | Card, Divider | [layout/](02-components/layout/) |
| **Utilities** | Overflow, Toolbar, Accordion, Carousel, Motion | [utilities/](02-components/utilities/) |

📋 **Full Component Index**: [02-components/00-component-index.md](02-components/00-component-index.md)

### Module 3: Patterns

Common UI patterns and how to implement them.

| File | Pattern | Description |
|------|---------|-------------|
| [01-form-patterns](03-patterns/01-form-patterns.md) | Forms | Validation, submission, error handling |
| [02-layout-patterns](03-patterns/02-layout-patterns.md) | Layouts | Page layouts, responsive design |
| [03-data-patterns](03-patterns/03-data-patterns.md) | Data | Tables, lists, pagination, filtering |
| [04-navigation-patterns](03-patterns/04-navigation-patterns.md) | Navigation | App navigation, routing integration |
| [05-modal-patterns](03-patterns/05-modal-patterns.md) | Modals | Dialogs, drawers, confirmation flows |
| [06-composition-patterns](03-patterns/06-composition-patterns.md) | Composition | Component composition techniques |
| [07-state-patterns](03-patterns/07-state-patterns.md) | State | State management integration |

### Module 4: Enterprise Applications

Building production-ready enterprise applications.

| File | Topic | Description |
|------|-------|-------------|
| [01-app-shell](04-enterprise/01-app-shell.md) | App Shell | Application shell pattern |
| [02-dashboard](04-enterprise/02-dashboard.md) | Dashboards | Dashboard layouts and widgets |
| [03-admin-interface](04-enterprise/03-admin-interface.md) | Admin UIs | Admin panel patterns |
| [04-data-heavy-apps](04-enterprise/04-data-heavy-apps.md) | Data Apps | Data-intensive applications |
| [05-accessibility-enterprise](04-enterprise/05-accessibility-enterprise.md) | Enterprise A11y | Enterprise accessibility compliance |

---

## 🚀 Quick Reference

For rapid lookup during development: [99-quick-reference/](99-quick-reference/00-quick-ref-index.md)

---

## 📦 Package Information

### Main Package

```bash
yarn add @fluentui/react-components
```

### Icons Package

```bash
yarn add @fluentui/react-icons
```

### Peer Dependencies

- React 17.x or 18.x
- React DOM 17.x or 18.x

---

## 🔗 External Resources

- **Official Documentation**: https://react.fluentui.dev
- **GitHub Repository**: https://github.com/microsoft/fluentui
- **Fluent Design System**: https://fluent2.microsoft.design

---

## 📖 How to Use This Training

### For New Projects

1. Read **all Foundation files** (Module 1) first
2. Use Component docs as needed during development
3. Reference Patterns for complex UI requirements
4. Consult Enterprise module for production apps

### For Specific Components

1. Load the component's documentation file
2. Check related patterns if implementing complex features
3. Use Quick Reference for prop lookups

### For Pattern Implementation

1. Load the relevant pattern file
2. Load documentation for components used in that pattern
3. Refer to Foundation docs for theming/styling questions

---

## ⚡ Quick Start Example

```typescript
import * as React from 'react';
import {
  FluentProvider,
  webLightTheme,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { CalendarMonthRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingHorizontalL,
  },
});

const App: React.FC = () => {
  const styles = useStyles();
  
  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.container}>
        <Button appearance="primary" icon={<CalendarMonthRegular />}>
          Get Started
        </Button>
      </div>
    </FluentProvider>
  );
};

export default App;
```

---

## 📋 Component Categories Summary

| Category | Count | Key Components |
|----------|-------|----------------|
| Buttons | 5 | Button, ToggleButton, MenuButton |
| Forms | 11 | Input, Select, Checkbox, Field |
| Navigation | 5 | Menu, Tabs, Breadcrumb |
| Data Display | 11 | Table, DataGrid, Avatar, Tree |
| Feedback | 6 | Dialog, Toast, MessageBar |
| Overlays | 3 | Popover, Drawer |
| Layout | 2 | Card, Divider |
| Utilities | 5 | Overflow, Toolbar, Accordion, Motion |

**Total: 47+ components**

---

## See Also

- [Getting Started](01-foundation/01-getting-started.md) - Begin here
- [Quick Reference](99-quick-reference/00-quick-ref-index.md) - Rapid lookup
- [Component Index](02-components/00-component-index.md) - All components