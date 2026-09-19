# Tree

> **Package**: `@fluentui/react-tree` v9.16.1
> **Import**: `import { Tree } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

Tree is a hierarchical, keyboard-navigable data-display component used to present nested structures such as file explorers, folder trees, org charts, or category browsers. The root Tree is composed with TreeItem children, where each TreeItem declares itemType "branch" or "leaf", and its row content is rendered by one of two layout components: TreeItemLayout (supporting expandIcon, iconBefore, iconAfter, aside, and actions) or TreeItemPersonaLayout (supporting media and description). For large or dynamic structures, FlatTree combined with FlatTreeItem renders the same hierarchy as a flattened list, which makes virtualization, filtering, lazy loading, infinite scrolling, and drag-and-drop integration practical, and the useHeadlessFlatTree_unstable hook supplies the open/checked state handling and the per-item ARIA attributes automatically. Tree supports controlled and uncontrolled open state through openItems and defaultOpenItems with onOpenChange, selection through selectionMode with single or multiselect (which renders radio buttons or checkboxes respectively) plus checkedItems and onCheckedChange, appearance variants subtle, subtle-alpha, and transparent, small and medium sizes, a navigationMode of tree or treegrid that controls whether the right arrow key expands a branch or moves into its actions, and a collapseMotion slot for tuning the expand/collapse animation.

**When to use**: Use Tree when content is genuinely hierarchical and users need to browse, expand, collapse, select, or navigate nested items — file and folder explorers, organizational structures, navigation sidebars with nested sections, table-of-contents style outlines, or category pickers with parent-child relationships. Choose FlatTree with FlatTreeItem when the tree is large, dynamic, or data-driven: flat rendering is far easier to search, filter, sort, virtualize, and mutate, and useHeadlessFlatTree_unstable removes the burden of computing ARIA level, set size, and position for every item. Choose the nested Tree when the hierarchy is static and authored declaratively, since nesting reads naturally and lets you control individual items with the open prop. Do not use Tree for flat, single-level lists (use List instead), for command surfaces (use Menu), or for a single show/hide region (use Accordion) — those patterns carry semantics that better match their content. If selection rather than browsing is the goal and items are not nested, prefer Checkbox, Radio, or Select.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"subtle" \| "subtle-alpha" \| "transparent" \| undefined` | `'subtle'` | No | A tree item can have various appearances: - 'subtle' (default): The default tree item styles. - 'subtle-alpha': Minimizes emphasis on hovered or focused states. - 'transparent': Removes background color. |
| `checkedItems` | `Iterable<TreeItemValue \| [TreeItemValue, any]> \| undefined` | — | No | This refers to a list of ids of checked tree items, or a list of tuples of ids and checked state. Controls the state of the checked tree items. These property is ignored for subtrees. |
| `defaultOpenItems` | `Iterable<TreeItemValue> \| undefined` | — | No | This refers to a list of ids of default opened items. This property is ignored for subtrees. |
| `navigationMode` | `TreeNavigationMode \| undefined` | `'tree'` | No | Indicates how navigation between a treeitem and its actions work - 'tree' (default): The default navigation, pressing right arrow key navigates inward the first inner children of a branch treeitem - 'treegrid': Pressing right arrow key navigate towards the actions of a treeitem |
| `openItems` | `Iterable<TreeItemValue> \| undefined` | — | No | This refers to a list of ids of opened tree items. Controls the state of the open tree items. These property is ignored for subtrees. |
| `selectionMode` | `any` | `undefined` | No | This refers to the selection mode of the tree. - undefined: No selection can be done. - 'single': Only one tree item can be selected, radio buttons are rendered. - 'multiselect': Multiple tree items can be selected, checkboxes are rendered. |
| `size` | `"small" \| "medium" \| undefined` | `'medium'` | No | Size of the tree item. |

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `collapseMotion` | — | No | — |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Tree, TreeItem, TreeItemLayout } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  return (
    <Tree aria-label="Default">
      <TreeItem itemType="branch">
        <TreeItemLayout>level 1, item 1</TreeItemLayout>
        <Tree>
          <TreeItem itemType="leaf">
            <TreeItemLayout>level 2, item 1</TreeItemLayout>
          </TreeItem>
          <TreeItem itemType="leaf">
            <TreeItemLayout>level 2, item 2</TreeItemLayout>
          </TreeItem>
          <TreeItem itemType="leaf">
            <TreeItemLayout>level 2, item 3</TreeItemLayout>
          </TreeItem>
        </Tree>
      </TreeItem>
      <TreeItem itemType="branch">
        <TreeItemLayout>level 1, item 2</TreeItemLayout>
        <Tree>
          <TreeItem itemType="branch">
            <TreeItemLayout>level 2, item 1</TreeItemLayout>
            <Tree>
              <TreeItem itemType="leaf">
                <TreeItemLayout>level 3, item 1</TreeItemLayout>
              </TreeItem>
            </Tree>
          </TreeItem>
        </Tree>
      </TreeItem>
      <TreeItem itemType="leaf">
        <TreeItemLayout>level 1, item 3</TreeItemLayout>
      </TreeItem>
    </Tree>
  );
};
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Avatar, Tree, TreeItem, TreeItemLayout, TreeItemPersonaLayout } from '@fluentui/react-components';

export const Appearance = (): JSXElement => {
  return (
    <>
      <Tree aria-label="Default Appearance">
        <TreeItem itemType="branch">
          <TreeItemLayout>Default appearance</TreeItemLayout>
          <Tree>
            <TreeItem itemType="leaf">
              <TreeItemLayout>level 2, item 1</TreeItemLayout>
            </TreeItem>
            <TreeItem itemType="leaf">
              <TreeItemLayout>level 2, item 2</TreeItemLayout>
            </TreeItem>
          </Tree>
        </TreeItem>
      </Tree>
      <Tree aria-label="Subtle Alpha Appearance" appearance="subtle-alpha">
        <TreeItem itemType="branch">
          <TreeItemLayout>Subtle-alpha appearance</TreeItemLayout>
          <Tree>
            <TreeItem itemType="leaf">
              <TreeItemLayout>level 2, item 1</TreeItemLayout>
            </TreeItem>
            <TreeItem itemType="leaf">
              <TreeItemLayout>level 2, item 2</TreeItemLayout>
            </TreeItem>
          </Tree>
        </TreeItem>
      </Tree>
      <Tree aria-label="Transparent Appearance" appearance="transparent">
        <TreeItem itemType="branch">
          <TreeItemLayout>Transparent appearance</TreeItemLayout>
          <Tree>
            <TreeItem itemType="leaf">
              <TreeItemLayout>level 2, item 1</TreeItemLayout>
            </TreeItem>
            <TreeItem itemType="leaf">
              <TreeItemLayout>level 2, item 2</TreeItemLayout>
            </TreeItem>
          </Tree>
        </TreeItem>
      </Tree>
      <hr />
      <Tree aria-label="Default Appearance">
        <TreeItem itemType="branch">
          <TreeItemPersonaLayout
            media={<Avatar name="Default" aria-label="Default appearance avatar placeholder" color="colorful" />}
          >
            Default appearance
          </TreeItemPersonaLayout>
          <Tree>
            <TreeItem itemType="leaf">
              <TreeItemPersonaLayout media={<Avatar aria-label="Avatar placeholder" color="colorful" />}>
                level 2, item 1
              </TreeItemPersonaLayout>
            </TreeItem>
            <TreeItem itemType="leaf">
              <TreeItemPersonaLayout media={<Avatar aria-label="Avatar placeholder" color="colorful" />}>
                level 2, item 2
              </TreeItemPersonaLayout>
            </TreeItem>
          </Tree>
        </TreeItem>
      </Tree>
      <Tree aria-label="Subtle Alpha Appearance" appearance="subtle-alpha">
        <TreeItem itemType="branch">
          <TreeItemPersonaLayout
            media={
              <Avatar aria-label="Subtle-alpha appearance avatar placeholder" name="Subtle Alpha" color="colorful" />
            }
          >
            Subtle-alpha appearance
          </TreeItemPersonaLayout>
          <Tree>
            <TreeItem itemType="leaf">
              <TreeItemPersonaLayout media={<Avatar aria-label="Avatar placeholder" color="colorful" />}>
                level 2, item 1
              </TreeItemPersonaLayout>
            </TreeItem>
            <TreeItem itemType="leaf">
              <TreeItemPersonaLayout media={<Avatar aria-label="Avatar placeholder" color="colorful" />}>
                level 2, item 2
              </TreeItemPersonaLayout>
            </TreeItem>
          </Tree>
        </TreeItem>
      </Tree>
      <Tree aria-label="Transparent Appearance" appearance="transparent">
        <TreeItem itemType="branch">
          <TreeItemPersonaLayout
            media={
              <Avatar aria-label="Transparent appearance avatar placeholder" name="Transparent" color="colorful" />
            }
          >
            Transparent appearance
          </TreeItemPersonaLayout>
          <Tree>
            <TreeItem itemType="leaf">
              <TreeItemPersonaLayout media={<Avatar aria-label="Avatar placeholder" color="colorful" />}>
                level 2, item 1
              </TreeItemPersonaLayout>
            </TreeItem>
            <TreeItem itemType="leaf">
              <TreeItemPersonaLayout media={<Avatar aria-label="Avatar placeholder" color="colorful" />}>
                level 2, item 2
              </TreeItemPersonaLayout>
            </TreeItem>
          </Tree>
        </TreeItem>
      </Tree>
    </>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story: `
A tree can have the following \`appearance\` variants:
- \`subtle\`: the default appearance.
- \`subtle-alpha\`: minimizes emphasis on hovered or focused states.
- \`transparent\`: no background color.

Both \`TreeItemLayout\` and \`TreeItemPersonaLayout\` will respond to the appearance variants.
      `,
    },
  },
};
```

### FlatTreeStory

```tsx
import * as React from 'react';
import type { JSXElement, TreeItemValue, TreeOpenChangeData, TreeOpenChangeEvent } from '@fluentui/react-components';
import { FlatTree, FlatTreeItem, TreeItemLayout } from '@fluentui/react-components';

export const FlatTreeStory = (): JSXElement => {
  const [openItems, setOpenItems] = React.useState<Set<TreeItemValue>>(() => new Set());
  const handleOpenChange = (event: TreeOpenChangeEvent, data: TreeOpenChangeData) => {
    setOpenItems(data.openItems);
  };
  return (
    <FlatTree openItems={openItems} onOpenChange={handleOpenChange} aria-label="Flat Tree">
      <FlatTreeItem value="1" aria-level={1} aria-setsize={2} aria-posinset={1} itemType="branch">
        <TreeItemLayout>Item 1, level 1</TreeItemLayout>
      </FlatTreeItem>
      {openItems.has('1') && (
        <>
          <FlatTreeItem parentValue="1" value="1-1" aria-level={2} aria-setsize={2} aria-posinset={1} itemType="leaf">
            <TreeItemLayout>Item 1, level 2</TreeItemLayout>
          </FlatTreeItem>
          <FlatTreeItem parentValue="1" value="1-2" aria-level={2} aria-setsize={2} aria-posinset={2} itemType="leaf">
            <TreeItemLayout>Item 1, level 2</TreeItemLayout>
          </FlatTreeItem>
        </>
      )}
      <FlatTreeItem value="2" aria-level={1} aria-setsize={2} aria-posinset={1} itemType="branch">
        <TreeItemLayout>Item 1, level 1</TreeItemLayout>
      </FlatTreeItem>
      {openItems.has('2') && (
        <>
          <FlatTreeItem parentValue="2" value="2-1" aria-level={2} aria-setsize={3} aria-posinset={1} itemType="leaf">
            <TreeItemLayout>Item 1, level 2</TreeItemLayout>
          </FlatTreeItem>
          <FlatTreeItem parentValue="2" value="2-2" aria-level={2} aria-setsize={3} aria-posinset={2} itemType="leaf">
            <TreeItemLayout>Item 2, level 2</TreeItemLayout>
          </FlatTreeItem>
          <FlatTreeItem parentValue="2" value="2-3" aria-level={2} aria-setsize={3} aria-posinset={3} itemType="leaf">
            <TreeItemLayout>Item 3, level 2</TreeItemLayout>
          </FlatTreeItem>
        </>
      )}
    </FlatTree>
  );
};

FlatTreeStory.parameters = {
  docs: {
    description: {
      story: `
The \`FlatTree\` component is a simplified version of \`Tree\`. It enables a more efficient and flexible way to manage tree structures by representing them in a flattened format. Unlike nested trees, flat trees simplify many common tasks such as searching or adding/removing items, and they are essential for supporting features like virtualization.

To ensure a \`FlatTree\` works accordingly a few more properties should be provided for each \`TreeItem\`:

- [\`aria-posinset\`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-posinset): the position of the treeitem in the current level of the tree.
- [\`aria-setsize\`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-setsize): the number of siblings in a level of the tree.
- [\`aria-level\`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-level): the current level of the treeitem.
- \`parentValue\`: the \`value\` property of the parent item of the current item.

> \`FlatTreeItem\` component is available to ensure those properties are properly provided (it's equivalent to \`TreeItem\` but with those properties listed above as required).

Another limitation of the \`FlatTree\` is that it becomes the user's responsibility to ensure proper open items are visible,
Since in a flat structure there's no proper way to assume if an item is visible or not by context.

> Take a look at the [\`useHeadlessFlatTree\`](#use-headless-flat-tree) hook to delegate the responsibility of filtering visible items and also to ensure proper properties are added to each \`TreeItem\`.

> If you need to utilize a nested tree with \`FlatTree\`, simply convert it to the flat format using the \`flattenTree\` helper.
      `,
    },
  },
};
```

## Best Practices

### Do's

- Always give the root Tree an accessible name, for example through aria-label, so screen readers announce a meaningful name rather than an unnamed tree.
- Set itemType to "branch" or "leaf" on every TreeItem so assistive technology knows which items are expandable and which are terminal.
- Provide a stable, unique value on every item that participates in open state, checked state, or flat rendering, because openItems, defaultOpenItems, and checkedItems are iterables of those values.
- Start with defaultOpenItems for the initial expanded set and only switch to the fully controlled openItems plus onOpenChange pattern when state must live outside the tree, such as when persisting expansion across sessions.
- Prefer FlatTree with useHeadlessFlatTree_unstable whenever the tree is data-driven, needs virtualizing, or must support insertion and removal, since the hook computes aria-level, aria-setsize, aria-posinset, and parentValue for you.
- Use TreeItemLayout for text rows with icons and badges, and TreeItemPersonaLayout when each row needs media plus a description, since iconBefore and iconAfter belong to the former while media and description belong to the latter.
- Enable selectionMode "single" or "multiselect" instead of embedding your own radio buttons or checkboxes, because the tree renders and manages the correct controls and checked state for you.
- When you use the actions slot, mirror the same operations in a context menu and describe them through aria-description on the TreeItem, because actions alone are not an expected WAI-ARIA treeview pattern.
- Keep the aside slot for passive information such as counters or importance icons, and repeat that information in the item's aria-description so it is not lost to screen reader users.
- For lazily loaded or infinitely scrolled subtrees, announce progress and completion through a polite live region so that asynchronous item loading is perceivable.
- Restore focus deliberately after adding or removing flat items so that keyboard navigation continuity is preserved.

### Don'ts

- Do not combine the tree-level openItems prop with a per-item open prop, because the item-level value overrides the tree state and the two sources will desynchronize.
- Do not render FlatTreeItem without aria-level, aria-setsize, aria-posinset, and parentValue, since flat trees have no structural context to infer those values from.
- Do not rely on the actions slot as the only path to a tree item's operations; users of some assistive technologies will not discover them.
- Do not choose appearance "transparent" or "subtle-alpha" when hover-revealed actions are the primary interaction, because the reduced hover emphasis makes the affordance harder to perceive.
- Do not place focusable controls inside the primary content of a TreeItem, as they interrupt the arrow-key navigation model and create a confusing tab sequence.
- Do not model flat, non-hierarchical data as a Tree; use a list or selection control instead so semantics match the content.
- Do not expect uncontrolled selection in a nested Tree — you own the checked state there, and only FlatTree can manage it for you.
- Do not skip virtualization or lazy loading for very large trees and then rely on the default styles alone; deep nesting beyond the statically styled levels falls back to an inline level variable and very large item counts degrade rendering.
- Do not assume that clicking the expand icon and clicking the item content are distinguishable by default; they share the same onOpenChange path unless you inspect the event data type.
- Do not forget selectionMode when you render checkboxes or radios inside items yourself, because the tree will not track or announce their state consistently.

## Accessibility

## See Also

- - [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
