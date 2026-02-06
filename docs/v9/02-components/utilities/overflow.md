# Overflow

> **Package**: `@fluentui/react-overflow`
> **Import**: `import { Overflow, OverflowItem, useOverflowMenu } from '@fluentui/react-components'`
> **Category**: Utilities

## Overview

Overflow manages content that doesn't fit within a container, showing a menu with hidden items. Use for toolbars, tag lists, or any horizontally-constrained content.

---

## Basic Usage

```typescript
import * as React from 'react';
import {
  Overflow,
  OverflowItem,
  Button,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  useOverflowMenu,
  useIsOverflowItemVisible,
} from '@fluentui/react-components';
import { MoreHorizontalRegular } from '@fluentui/react-icons';

const OverflowMenuItem: React.FC<{ id: string }> = ({ id }) => {
  const isVisible = useIsOverflowItemVisible(id);
  if (isVisible) return null;
  return <MenuItem>Item {id}</MenuItem>;
};

const OverflowMenu: React.FC<{ itemIds: string[] }> = ({ itemIds }) => {
  const { ref, isOverflowing } = useOverflowMenu<HTMLButtonElement>();
  if (!isOverflowing) return null;
  
  return (
    <Menu>
      <MenuTrigger>
        <Button ref={ref} icon={<MoreHorizontalRegular />} aria-label="More" />
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {itemIds.map(id => <OverflowMenuItem key={id} id={id} />)}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

export const BasicOverflow: React.FC = () => {
  const items = ['1', '2', '3', '4', '5'];
  return (
    <Overflow>
      {items.map(id => (
        <OverflowItem key={id} id={id}>
          <Button>Item {id}</Button>
        </OverflowItem>
      ))}
      <OverflowMenu itemIds={items} />
    </Overflow>
  );
};
```

---

## Overflow Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `minimumVisible` | `number` | `0` | Minimum items always visible |
| `overflowAxis` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction |
| `overflowDirection` | `'start' \| 'end'` | `'end'` | Which items hide first |
| `padding` | `number` | `10` | Padding for calculation |

---

## Item Priority

```typescript
<OverflowItem id="important" priority={2}>High priority</OverflowItem>
<OverflowItem id="normal" priority={1}>Normal</OverflowItem>
<OverflowItem id="low" priority={0}>Low priority</OverflowItem>
```

---

## See Also

- [Toolbar](toolbar.md) - Action toolbar
- [Component Index](../00-component-index.md)