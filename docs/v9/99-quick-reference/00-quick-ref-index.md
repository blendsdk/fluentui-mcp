# FluentUI v9 Quick Reference

> **Purpose**: Rapid lookup cheat sheet for FluentUI v9 development
> **Last Updated**: 2026-06-02

## Quick Reference Index

| File | Topic | Description |
|------|-------|-------------|
| [00-quick-ref-index](00-quick-ref-index.md) | Index | This document — quick reference overview |
| [01-setup-imports](01-setup-imports.md) | Setup | Installation, FluentProvider, import patterns |
| [02-component-cheatsheet](02-component-cheatsheet.md) | Components | Component selection guide and prop quick lookup |
| [03-styling-tokens](03-styling-tokens.md) | Styling | Griffel makeStyles, tokens, responsive design |
| [04-common-patterns](04-common-patterns.md) | Patterns | Common UI patterns cheat sheet |
| [05-accessibility-checklist](05-accessibility-checklist.md) | A11y | Accessibility compliance checklist |

---

## Emergency Reference

### Minimum Viable App

```typescript
import * as React from 'react';
import { FluentProvider, webLightTheme, Button } from '@fluentui/react-components';

const App: React.FC = () => (
  <FluentProvider theme={webLightTheme}>
    <Button appearance="primary">Hello FluentUI</Button>
  </FluentProvider>
);
```

### Install

```bash
yarn add @fluentui/react-components @fluentui/react-icons
```

### Key Import

```typescript
import {
  FluentProvider, webLightTheme, webDarkTheme,
  Button, Input, Dialog, makeStyles, tokens,
} from '@fluentui/react-components';
```

---

## Quick Decision Trees

### "What component should I use?"

→ See [Component Cheatsheet](02-component-cheatsheet.md)

### "How do I style this?"

→ See [Styling & Tokens](03-styling-tokens.md)

### "How do I build [pattern]?"

→ See [Common Patterns](04-common-patterns.md)

### "Is this accessible?"

→ See [Accessibility Checklist](05-accessibility-checklist.md)

---

## See Also

- [Overview](../00-overview.md) — Full training program
- [Foundation](../01-foundation/) — Core concepts deep dive
- [Component Index](../02-components/00-component-index.md) — All component documentation
- [Patterns](../03-patterns/) — Detailed pattern guides
