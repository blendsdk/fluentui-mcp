# Tree

> **Package**: `@fluentui/react-tree`
> **Import**: `import { Tree, TreeItem, TreeItemLayout, FlatTree } from '@fluentui/react-components'`
> **Category**: Data Display

## Overview

Tree displays hierarchical data with expandable/collapsible nodes. FluentUI v9 provides two approaches:

1. **Tree** - Nested structure for static/simple hierarchies
2. **FlatTree** - Flat data structure for dynamic content, virtualization, and lazy loading

---

## Components

| Component | Description |
|-----------|-------------|
| `Tree` | Root container for nested tree structure |
| `FlatTree` | Root container for flat tree structure |
| `TreeItem` | Individual tree node (branch or leaf) |
| `FlatTreeItem` | Individual flat tree node with required ARIA props |
| `TreeItemLayout` | Standard layout for tree item content |
| `TreeItemPersonaLayout` | Layout with avatar/icon for person-based items |

---

## Basic Tree (Nested)

```typescript
import * as React from 'react';
import { Tree, TreeItem, TreeItemLayout } from '@fluentui/react-components';

export const BasicTree: React.FC = () => (
  <Tree aria-label="File explorer">
    <TreeItem itemType="branch">
      <TreeItemLayout>Documents</TreeItemLayout>
      <Tree>
        <TreeItem itemType="leaf">
          <TreeItemLayout>Resume.pdf</TreeItemLayout>
        </TreeItem>
        <TreeItem itemType="leaf">
          <TreeItemLayout>Cover Letter.docx</TreeItemLayout>
        </TreeItem>
      </Tree>
    </TreeItem>
    <TreeItem itemType="branch">
      <TreeItemLayout>Pictures</TreeItemLayout>
      <Tree>
        <TreeItem itemType="branch">
          <TreeItemLayout>Vacation</TreeItemLayout>
          <Tree>
            <TreeItem itemType="leaf">
              <TreeItemLayout>beach.jpg</TreeItemLayout>
            </TreeItem>
          </Tree>
        </TreeItem>
      </Tree>
    </TreeItem>
    <TreeItem itemType="leaf">
      <TreeItemLayout>notes.txt</TreeItemLayout>
    </TreeItem>
  </Tree>
);
```

---

## Tree Item Types

| Type | Description |
|------|-------------|
| `branch` | Node with children, shows expand/collapse icon |
| `leaf` | Terminal node, no children |

```typescript
// Branch - can expand/collapse
<TreeItem itemType="branch">
  <TreeItemLayout>Folder</TreeItemLayout>
  <Tree>
    {/* Children */}
  </Tree>
</TreeItem>

// Leaf - no children
<TreeItem itemType="leaf">
  <TreeItemLayout>File</TreeItemLayout>
</TreeItem>
```

---

## Tree Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `openItems` | `Iterable<TreeItemValue>` | - | Controlled open items |
| `defaultOpenItems` | `Iterable<TreeItemValue>` | - | Default open items |
| `onOpenChange` | `(e, data) => void` | - | Open state change callback |
| `checkedItems` | `Map<TreeItemValue, 'mixed' \| boolean>` | - | Controlled checked items |
| `onCheckedChange` | `(e, data) => void` | - | Check state change callback |
| `selectionMode` | `'single' \| 'multiselect' \| 'none'` | `'none'` | Selection mode |
| `appearance` | `'subtle' \| 'subtle-alpha' \| 'transparent'` | `'subtle'` | Visual style |
| `size` | `'small' \| 'medium'` | `'medium'` | Size |

---

## Controlled Open State

```typescript
import * as React from 'react';
import {
  Tree,
  TreeItem,
  TreeItemLayout,
  TreeItemValue,
  TreeOpenChangeData,
  TreeOpenChangeEvent,
} from '@fluentui/react-components';

export const ControlledTree: React.FC = () => {
  const [openItems, setOpenItems] = React.useState<Set<TreeItemValue>>(
    new Set(['documents'])
  );

  const handleOpenChange = (
    event: TreeOpenChangeEvent,
    data: TreeOpenChangeData
  ) => {
    setOpenItems(data.openItems);
  };

  return (
    <Tree
      aria-label="Controlled tree"
      openItems={openItems}
      onOpenChange={handleOpenChange}
    >
      <TreeItem itemType="branch" value="documents">
        <TreeItemLayout>Documents</TreeItemLayout>
        <Tree>
          <TreeItem itemType="leaf" value="doc1">
            <TreeItemLayout>Document 1</TreeItemLayout>
          </TreeItem>
          <TreeItem itemType="leaf" value="doc2">
            <TreeItemLayout>Document 2</TreeItemLayout>
          </TreeItem>
        </Tree>
      </TreeItem>
      <TreeItem itemType="branch" value="images">
        <TreeItemLayout>Images</TreeItemLayout>
        <Tree>
          <TreeItem itemType="leaf" value="img1">
            <TreeItemLayout>Image 1</TreeItemLayout>
          </TreeItem>
        </Tree>
      </TreeItem>
    </Tree>
  );
};
```

---

## Tree with Selection

```typescript
import * as React from 'react';
import {
  Tree,
  TreeItem,
  TreeItemLayout,
  TreeItemValue,
  TreeCheckedChangeData,
  TreeCheckedChangeEvent,
} from '@fluentui/react-components';

export const SelectableTree: React.FC = () => {
  const [checkedItems, setCheckedItems] = React.useState<
    Map<TreeItemValue, 'mixed' | boolean>
  >(new Map());

  const handleCheckedChange = (
    event: TreeCheckedChangeEvent,
    data: TreeCheckedChangeData
  ) => {
    setCheckedItems(data.checkedItems);
  };

  return (
    <Tree
      aria-label="Selectable tree"
      selectionMode="multiselect"
      checkedItems={checkedItems}
      onCheckedChange={handleCheckedChange}
    >
      <TreeItem itemType="branch" value="all">
        <TreeItemLayout>Select All</TreeItemLayout>
        <Tree>
          <TreeItem itemType="leaf" value="option1">
            <TreeItemLayout>Option 1</TreeItemLayout>
          </TreeItem>
          <TreeItem itemType="leaf" value="option2">
            <TreeItemLayout>Option 2</TreeItemLayout>
          </TreeItem>
          <TreeItem itemType="leaf" value="option3">
            <TreeItemLayout>Option 3</TreeItemLayout>
          </TreeItem>
        </Tree>
      </TreeItem>
    </Tree>
  );
};
```

---

## TreeItemLayout with Icons

```typescript
import * as React from 'react';
import { Tree, TreeItem, TreeItemLayout } from '@fluentui/react-components';
import {
  FolderRegular,
  DocumentRegular,
  ImageRegular,
} from '@fluentui/react-icons';

export const TreeWithIcons: React.FC = () => (
  <Tree aria-label="File tree">
    <TreeItem itemType="branch">
      <TreeItemLayout iconBefore={<FolderRegular />}>
        Documents
      </TreeItemLayout>
      <Tree>
        <TreeItem itemType="leaf">
          <TreeItemLayout iconBefore={<DocumentRegular />}>
            Report.docx
          </TreeItemLayout>
        </TreeItem>
      </Tree>
    </TreeItem>
    <TreeItem itemType="branch">
      <TreeItemLayout iconBefore={<FolderRegular />}>
        Images
      </TreeItemLayout>
      <Tree>
        <TreeItem itemType="leaf">
          <TreeItemLayout iconBefore={<ImageRegular />}>
            Photo.jpg
          </TreeItemLayout>
        </TreeItem>
      </Tree>
    </TreeItem>
  </Tree>
);
```

### TreeItemLayout Props

| Prop | Type | Description |
|------|------|-------------|
| `iconBefore` | `Slot` | Icon before content |
| `iconAfter` | `Slot` | Icon after content |
| `aside` | `Slot` | Content on the right side |
| `expandIcon` | `Slot` | Custom expand/collapse icon |

---

## TreeItemPersonaLayout

For people/user-based trees:

```typescript
import * as React from 'react';
import { Tree, TreeItem, TreeItemPersonaLayout, Avatar } from '@fluentui/react-components';

export const PersonaTree: React.FC = () => (
  <Tree aria-label="Organization">
    <TreeItem itemType="branch">
      <TreeItemPersonaLayout
        media={<Avatar name="John Smith" />}
        description="CEO"
      >
        John Smith
      </TreeItemPersonaLayout>
      <Tree>
        <TreeItem itemType="branch">
          <TreeItemPersonaLayout
            media={<Avatar name="Jane Doe" />}
            description="CTO"
          >
            Jane Doe
          </TreeItemPersonaLayout>
          <Tree>
            <TreeItem itemType="leaf">
              <TreeItemPersonaLayout
                media={<Avatar name="Bob Wilson" />}
                description="Engineer"
              >
                Bob Wilson
              </TreeItemPersonaLayout>
            </TreeItem>
          </Tree>
        </TreeItem>
      </Tree>
    </TreeItem>
  </Tree>
);
```

---

## FlatTree (For Dynamic Content)

FlatTree is better for:
- Virtualization with large datasets
- Lazy loading
- Dynamic manipulation (add/remove items)
- Searching/filtering

```typescript
import * as React from 'react';
import {
  FlatTree,
  FlatTreeItem,
  TreeItemLayout,
  TreeItemValue,
  TreeOpenChangeData,
  TreeOpenChangeEvent,
} from '@fluentui/react-components';

export const FlatTreeExample: React.FC = () => {
  const [openItems, setOpenItems] = React.useState<Set<TreeItemValue>>(new Set());

  const handleOpenChange = (
    event: TreeOpenChangeEvent,
    data: TreeOpenChangeData
  ) => {
    setOpenItems(data.openItems);
  };

  return (
    <FlatTree
      aria-label="Flat tree"
      openItems={openItems}
      onOpenChange={handleOpenChange}
    >
      {/* Level 1 items */}
      <FlatTreeItem
        value="folder1"
        itemType="branch"
        aria-level={1}
        aria-setsize={2}
        aria-posinset={1}
      >
        <TreeItemLayout>Folder 1</TreeItemLayout>
      </FlatTreeItem>
      
      {/* Show children only when open */}
      {openItems.has('folder1') && (
        <>
          <FlatTreeItem
            value="file1"
            parentValue="folder1"
            itemType="leaf"
            aria-level={2}
            aria-setsize={2}
            aria-posinset={1}
          >
            <TreeItemLayout>File 1</TreeItemLayout>
          </FlatTreeItem>
          <FlatTreeItem
            value="file2"
            parentValue="folder1"
            itemType="leaf"
            aria-level={2}
            aria-setsize={2}
            aria-posinset={2}
          >
            <TreeItemLayout>File 2</TreeItemLayout>
          </FlatTreeItem>
        </>
      )}

      <FlatTreeItem
        value="folder2"
        itemType="branch"
        aria-level={1}
        aria-setsize={2}
        aria-posinset={2}
      >
        <TreeItemLayout>Folder 2</TreeItemLayout>
      </FlatTreeItem>
    </FlatTree>
  );
};
```

### FlatTreeItem Required Props

| Prop | Type | Description |
|------|------|-------------|
| `value` | `TreeItemValue` | Unique identifier |
| `parentValue` | `TreeItemValue` | Parent's value (for nested items) |
| `aria-level` | `number` | Depth level (1-based) |
| `aria-setsize` | `number` | Number of siblings at this level |
| `aria-posinset` | `number` | Position in siblings (1-based) |
| `itemType` | `'branch' \| 'leaf'` | Node type |

---

## useHeadlessFlatTree

For complex flat tree management:

```typescript
import * as React from 'react';
import {
  FlatTree,
  FlatTreeItem,
  TreeItemLayout,
  useHeadlessFlatTree_unstable,
  HeadlessFlatTreeItemProps,
} from '@fluentui/react-components';

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

const data: TreeNode[] = [
  {
    id: '1',
    name: 'Documents',
    children: [
      { id: '1-1', name: 'Work' },
      { id: '1-2', name: 'Personal' },
    ],
  },
  {
    id: '2',
    name: 'Images',
    children: [{ id: '2-1', name: 'Vacation' }],
  },
];

// Convert to flat structure
const flattenData = (nodes: TreeNode[], parentId?: string): HeadlessFlatTreeItemProps[] => {
  const result: HeadlessFlatTreeItemProps[] = [];
  nodes.forEach((node) => {
    result.push({
      value: node.id,
      parentValue: parentId,
      children: node.children ? <TreeItemLayout>{node.name}</TreeItemLayout> : null,
    });
    if (node.children) {
      result.push(...flattenData(node.children, node.id));
    }
  });
  return result;
};

export const HeadlessFlatTreeExample: React.FC = () => {
  const flatTree = useHeadlessFlatTree_unstable(flattenData(data));

  return (
    <FlatTree {...flatTree.getTreeProps()} aria-label="Headless flat tree">
      {Array.from(flatTree.items(), (item) => (
        <FlatTreeItem {...item.getTreeItemProps()} key={item.value}>
          <TreeItemLayout>{item.value}</TreeItemLayout>
        </FlatTreeItem>
      ))}
    </FlatTree>
  );
};
```

---

## Accessibility

- Tree uses `role="tree"` and `role="treeitem"`
- Keyboard navigation: Arrow keys, Enter, Space
- Screen readers announce expand/collapse state
- Selection states are properly communicated

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `↓` | Move to next visible item |
| `↑` | Move to previous visible item |
| `→` | Expand branch / move to first child |
| `←` | Collapse branch / move to parent |
| `Enter` / `Space` | Toggle expand/select |
| `Home` | Move to first item |
| `End` | Move to last visible item |

---

## Best Practices

### ✅ Do's

```typescript
// Provide aria-label for the tree
<Tree aria-label="File browser">

// Use appropriate itemType
<TreeItem itemType="branch">  {/* Has children */}
<TreeItem itemType="leaf">    {/* No children */}

// Use value prop for controlled state
<TreeItem value="unique-id" itemType="branch">
```

### ❌ Don'ts

```typescript
// Don't nest Tree inside leaf items
<TreeItem itemType="leaf">
  <TreeItemLayout>Leaf</TreeItemLayout>
  <Tree> {/* Wrong - leaf shouldn't have children */}
    ...
  </Tree>
</TreeItem>

// Don't forget required ARIA props in FlatTree
<FlatTreeItem value="1"> {/* Missing aria-level, etc. */}
```

---

## See Also

- [Component Index](../00-component-index.md)
- [List](list.md) - Simple list display
- [Accordion](../utilities/accordion.md) - Collapsible sections