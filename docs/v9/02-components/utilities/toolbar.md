# Toolbar

> **Package**: `@fluentui/react-toolbar`
> **Import**: `import { Toolbar, ToolbarButton, ToolbarDivider, ToolbarGroup } from '@fluentui/react-components'`
> **Category**: Utilities

## Overview

Toolbar provides a container for grouping action buttons and controls. Use for formatting toolbars, action bars, or any set of related commands.

---

## Basic Usage

```typescript
import * as React from 'react';
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
} from '@fluentui/react-components';
import {
  TextBoldRegular,
  TextItalicRegular,
  TextUnderlineRegular,
  CutRegular,
  CopyRegular,
  ClipboardPasteRegular,
} from '@fluentui/react-icons';

export const BasicToolbar: React.FC = () => (
  <Toolbar aria-label="Text formatting">
    <ToolbarButton icon={<TextBoldRegular />} aria-label="Bold" />
    <ToolbarButton icon={<TextItalicRegular />} aria-label="Italic" />
    <ToolbarButton icon={<TextUnderlineRegular />} aria-label="Underline" />
    <ToolbarDivider />
    <ToolbarButton icon={<CutRegular />} aria-label="Cut" />
    <ToolbarButton icon={<CopyRegular />} aria-label="Copy" />
    <ToolbarButton icon={<ClipboardPasteRegular />} aria-label="Paste" />
  </Toolbar>
);
```

---

## Component Structure

| Component | Purpose |
|-----------|---------|
| `Toolbar` | Root container with proper ARIA role |
| `ToolbarButton` | Action button in toolbar |
| `ToolbarDivider` | Visual separator |
| `ToolbarGroup` | Groups related buttons |
| `ToolbarToggleButton` | Toggle button for toolbar |
| `ToolbarRadioButton` | Radio button for toolbar |
| `ToolbarRadioGroup` | Radio group container |

---

## Toolbar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `vertical` | `boolean` | `false` | Vertical orientation |
| `checkedValues` | `Record<string, string[]>` | - | Controlled checked state |
| `onCheckedValueChange` | `(ev, data) => void` | - | Check change handler |

---

## With Toggle Buttons

```typescript
import * as React from 'react';
import {
  Toolbar,
  ToolbarToggleButton,
} from '@fluentui/react-components';
import { TextBoldRegular, TextItalicRegular } from '@fluentui/react-icons';

export const ToggleToolbar: React.FC = () => (
  <Toolbar>
    <ToolbarToggleButton
      icon={<TextBoldRegular />}
      name="formatting"
      value="bold"
      aria-label="Bold"
    />
    <ToolbarToggleButton
      icon={<TextItalicRegular />}
      name="formatting"
      value="italic"
      aria-label="Italic"
    />
  </Toolbar>
);
```

---

## Vertical Toolbar

```typescript
<Toolbar vertical aria-label="Vertical toolbar">
  <ToolbarButton icon={<CutRegular />} />
  <ToolbarButton icon={<CopyRegular />} />
  <ToolbarDivider />
  <ToolbarButton icon={<ClipboardPasteRegular />} />
</Toolbar>
```

---

## Accessibility

- Toolbar has `role="toolbar"` automatically
- Supports arrow key navigation
- Always provide `aria-label` on Toolbar

---

## See Also

- [Button](../buttons/button.md) - Standard buttons
- [Overflow](overflow.md) - Overflow handling
- [Component Index](../00-component-index.md)