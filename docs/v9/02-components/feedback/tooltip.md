# Tooltip

> **Package**: `@fluentui/react-tooltip`
> **Import**: `import { Tooltip } from '@fluentui/react-components'`
> **Category**: Feedback

## Overview

Tooltip displays additional information when hovering over or focusing on an element. Use for brief, non-essential descriptions.

---

## Basic Usage

```typescript
import * as React from 'react';
import { Tooltip, Button } from '@fluentui/react-components';

export const BasicTooltip: React.FC = () => (
  <Tooltip content="This is a tooltip" relationship="label">
    <Button>Hover me</Button>
  </Tooltip>
);
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `React.ReactNode` | required | Tooltip content |
| `relationship` | `'label' \| 'description' \| 'inaccessible'` | required | Accessibility relationship |
| `positioning` | `PositioningShorthand` | `'above'` | Tooltip position |
| `withArrow` | `boolean` | `false` | Show arrow pointing to target |
| `appearance` | `'normal' \| 'inverted'` | `'normal'` | Visual style |
| `visible` | `boolean` | - | Controlled visibility |
| `onVisibleChange` | `(ev, data) => void` | - | Visibility change handler |

---

## Relationship Types

```typescript
// Use 'label' when tooltip provides the accessible name
<Tooltip content="Delete item" relationship="label">
  <Button icon={<DeleteRegular />} aria-label="Delete item" />
</Tooltip>

// Use 'description' when tooltip adds extra info
<Tooltip content="Saves document to cloud" relationship="description">
  <Button>Save</Button>
</Tooltip>

// Use 'inaccessible' for decorative tooltips (rare)
<Tooltip content="Decorative info" relationship="inaccessible">
  <span>Hover</span>
</Tooltip>
```

---

## Positioning

```typescript
import * as React from 'react';
import { Tooltip, Button, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: { display: 'flex', gap: tokens.spacingHorizontalM, flexWrap: 'wrap' },
});

export const TooltipPositions: React.FC = () => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <Tooltip content="Above" positioning="above" relationship="description">
        <Button>Above</Button>
      </Tooltip>
      <Tooltip content="Below" positioning="below" relationship="description">
        <Button>Below</Button>
      </Tooltip>
      <Tooltip content="Before" positioning="before" relationship="description">
        <Button>Before</Button>
      </Tooltip>
      <Tooltip content="After" positioning="after" relationship="description">
        <Button>After</Button>
      </Tooltip>
    </div>
  );
};
```

---

## With Arrow

```typescript
<Tooltip content="With arrow" withArrow relationship="description">
  <Button>Hover me</Button>
</Tooltip>
```

---

## Appearance Variants

```typescript
// Normal (default) - light background
<Tooltip content="Normal tooltip" appearance="normal" relationship="description">
  <Button>Normal</Button>
</Tooltip>

// Inverted - dark background
<Tooltip content="Inverted tooltip" appearance="inverted" relationship="description">
  <Button>Inverted</Button>
</Tooltip>
```

---

## Icon-Only Buttons

Always use tooltips for icon-only buttons:

```typescript
import * as React from 'react';
import { Tooltip, Button } from '@fluentui/react-components';
import { DeleteRegular, EditRegular, CopyRegular } from '@fluentui/react-icons';

export const IconButtons: React.FC = () => (
  <>
    <Tooltip content="Delete" relationship="label">
      <Button icon={<DeleteRegular />} aria-label="Delete" />
    </Tooltip>
    <Tooltip content="Edit" relationship="label">
      <Button icon={<EditRegular />} aria-label="Edit" />
    </Tooltip>
    <Tooltip content="Copy" relationship="label">
      <Button icon={<CopyRegular />} aria-label="Copy" />
    </Tooltip>
  </>
);
```

---

## Controlled Visibility

```typescript
import * as React from 'react';
import { Tooltip, Button } from '@fluentui/react-components';

export const ControlledTooltip: React.FC = () => {
  const [visible, setVisible] = React.useState(false);

  return (
    <Tooltip
      content="Controlled tooltip"
      relationship="description"
      visible={visible}
      onVisibleChange={(_, data) => setVisible(data.visible)}
    >
      <Button onClick={() => setVisible(!visible)}>
        Toggle Tooltip
      </Button>
    </Tooltip>
  );
};
```

---

## Accessibility

- `relationship="label"` sets `aria-labelledby` on the target
- `relationship="description"` sets `aria-describedby` on the target
- Tooltips are accessible via keyboard focus
- Don't put essential information only in tooltips

---

## Best Practices

### ✅ Do's

```typescript
// Use for icon-only buttons
<Tooltip content="Search" relationship="label">
  <Button icon={<SearchRegular />} />
</Tooltip>

// Keep content brief
<Tooltip content="Ctrl+S" relationship="description">
  <Button>Save</Button>
</Tooltip>
```

### ❌ Don'ts

```typescript
// Don't put interactive content in tooltips
<Tooltip content={<Button>Click</Button>}>...</Tooltip>

// Don't use for essential information
<Tooltip content="Required field">
  <Input /> {/* User might miss this */}
</Tooltip>

// Don't use long text
<Tooltip content="This is a very long tooltip that contains too much information...">
```

---

## See Also

- [Popover](../overlays/popover.md) - Interactive overlays
- [Dialog](dialog.md) - Modal messages
- [Component Index](../00-component-index.md)