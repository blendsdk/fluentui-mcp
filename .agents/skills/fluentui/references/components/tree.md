# Tree

> **Package**: `@fluentui/react-tree` v9.16.1
> **Import**: `import { Tree } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

Tree is a hierarchical, collapsible data-display component that renders a WAI-ARIA treeview of nested TreeItem elements. It provides keyboard-driven navigation between parent (branch) and child (leaf) items, controlled or uncontrolled expand/collapse state via openItems and defaultOpenItems, optional single or multiselect behavior via selectionMode and checkedItems, and configurable visual density through appearance and size. Tree is composed from TreeItem and one of the two layout components, TreeItemLayout or TreeItemPersonaLayout, and it also ships in a flattened variant called FlatTree that works together with FlatTreeItem and the useHeadlessFlatTree_unstable hook. Because the same component tree supports nested and flat structures, it scales from small settings-style hierarchies to large, lazily loaded or virtualized navigation surfaces.

**When to use**: Use Tree when content has a genuine parent/child hierarchy that users need to browse, expand, collapse, or select — for example file explorers, organizational charts, table-of-contents navigation, taxonomy pickers, or a left-hand navigation rail with expandable sections. Use the nested Tree plus TreeItem, TreeItemLayout, and TreeItemPersonaLayout when the hierarchy is static and authored directly in markup. Switch to FlatTree with FlatTreeItem and useHeadlessFlatTree_unstable when the item set is dynamic, large, searchable, or must be virtualized, since a flattened structure makes add/remove/search operations and windowing straightforward. Prefer List or Menu for flat, non-hierarchical collections, Accordion for a small number of vertically stacked disclosure sections that are not a navigable hierarchy, and Nav / NavItem when the tree is a primary application navigation surface that needs routing and icon support. Choose TreeItemPersonaLayout when each node needs an avatar, presence, and secondary description text, and TreeItemLayout when nodes need leading/trailing icons, aside content, or inline actions.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"subtle" \| "subtle-alpha" \| "transparent" \| undefined` | `'subtle'` | No | A tree item can have various appearances: - 'subtle' (default): The default tree item styles. - 'subtle-alpha': Minimizes emphasis on hovered or focused states. - 'transparent': Removes background color. |
| `checkedItems` | `Iterable<TreeItemValue \| [TreeItemValue, TreeSelectionValue]> \| undefined` | — | No | This refers to a list of ids of checked tree items, or a list of tuples of ids and checked state. Controls the state of the checked tree items. These property is ignored for subtrees. |
| `defaultOpenItems` | `Iterable<TreeItemValue> \| undefined` | — | No | This refers to a list of ids of default opened items. This property is ignored for subtrees. |
| `navigationMode` | `TreeNavigationMode \| undefined` | `'tree'` | No | Indicates how navigation between a treeitem and its actions work - 'tree' (default): The default navigation, pressing right arrow key navigates inward the first inner children of a branch treeitem - 'treegrid': Pressing right arrow key navigate towards the actions of a treeitem |
| `openItems` | `Iterable<TreeItemValue> \| undefined` | — | No | This refers to a list of ids of opened tree items. Controls the state of the open tree items. These property is ignored for subtrees. |
| `selectionMode` | `SelectionMode \| undefined` | `undefined` | No | This refers to the selection mode of the tree. - undefined: No selection can be done. - 'single': Only one tree item can be selected, radio buttons are rendered. - 'multiselect': Multiple tree items can be selected, checkboxes are rendered. |
| `size` | `"small" \| "medium" \| undefined` | `'medium'` | No | Size of the tree item. |

### Prop Guidance

- **navigationMode**: Controls how the right and left arrow keys behave around a branch item's content versus its actions. Keep the default 'tree' for pure browsing hierarchies. Switch to 'treegrid' when items expose inline actions: a collapsed branch expands on right arrow, an expanded branch moves focus into its actions on right arrow, and left arrow from the actions returns focus to the treeitem. Use this only with items that actually render actions, otherwise the extra navigation step is confusing. `treegrid`
- **appearance**: Sets the visual weight of tree items and of both layouts. Use the default 'subtle' inside standard panels, 'subtle-alpha' when hover and focus backgrounds should be de-emphasized in dense or visually busy surfaces, and 'transparent' when the tree sits on a container that already provides the background color. Both TreeItemLayout and TreeItemPersonaLayout respond to this value. `subtle-alpha`
- **size**: Chooses between the default 'medium' density and the more compact 'small' density for all items in the tree. Use small for navigation rails, file explorers, and other space-constrained surfaces, and keep medium for primary content areas where readability matters more than density. `small`
- **openItems**: Use for a controlled disclosure model: pass an iterable (array or Set) of the item values that should be expanded and update it from the onOpenChange callback's openItems payload. The prop is ignored for subtrees, so only the root Tree honors it. Do not combine it with the per-item open prop. `a Set containing the values of the branches you want expanded`
- **defaultOpenItems**: Use for an uncontrolled disclosure model where you only want to choose which branches start expanded. Provide an iterable of item values to open on initial render; all other branches begin collapsed. Like openItems, it is ignored for subtrees and should not be combined with per-item open control. `an array of the branch item values that should be visible on first render`
- **selectionMode**: Enables selection: leave undefined for a pure browsing tree, set 'single' to render radio buttons and allow exactly one checked item, and set 'multiselect' to render checkboxes for independent checked states. In a nested Tree you are expected to control the checked state; FlatTree supports an uncontrolled checked state because its items are known upfront. `multiselect`
- **checkedItems**: Supplies the checked set for a controlled selection model. It accepts either an iterable of item values (all treated as checked) or an iterable of value plus checked-state tuples when you need to represent an explicit state per item. Use it together with the onCheckedChange callback exposed by the tree's state hook, and keep it in sync with selectionMode. `an iterable of value and checked-state tuples produced by your checked-state handler`
- **collapseMotion (slot)**: Configures the expand/collapse animation of a nested Tree. Accepts duration, easing, and animateOpacity, so you can align expand animations with your product's motion language instead of writing CSS overrides. The Motion Custom example wires easing from motionTokens.curveDecelerateMid and lets users change duration and opacity. `duration, easing, and animateOpacity values tuned to your motion system`

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

- Always give the root Tree (or FlatTree) a descriptive aria-label so assistive technology can announce the tree's purpose, as every documented example does.
- Assign a stable value to every TreeItem branch you intend to control, because openItems, defaultOpenItems, and checkedItems all reference items by their value.
- Pick one ownership model for disclosure state: either let Tree manage it with defaultOpenItems, or fully control it with openItems plus the onOpenChange callback — do not mix the two.
- Use FlatTree with FlatTreeItem and useHeadlessFlatTree_unstable for dynamic, large, or virtualized hierarchies so the hook can generate the correct aria-level, aria-setsize, aria-posinset, itemType, and parentValue for each row.
- Add an aria-description to tree items that carry aside content or actions (for example "Important, 3 message") so the extra affordances are conveyed to screen reader users.
- When you expose inline actions on a tree item, also provide a context menu with the same operations, because actions inside a treeitem are not an expected WAI-ARIA treeview pattern.
- Match appearance and size to the surrounding surface: keep the default subtle and medium settings inside standard panels, use small for dense navigation, and use transparent when the tree sits on an already-styled container.
- Announce asynchronous work with a polite live region and move focus to the first newly loaded item when using lazy loading or infinite scrolling, as shown in the lazy loading and infinite scrolling examples.
- Preserve focus continuity when adding or removing items from a flat tree by tracking a target item value and focusing its ref after the state update.
- Use the collapseMotion slot on the nested Tree to tune duration, easing, and opacity instead of overriding animation CSS.

### Don'ts

- Do not combine the Tree-level openItems prop with the per-item open prop — the documentation explicitly warns that using both can lead to unexpected behavior.
- Do not assume FlatTree filters visibility for you; the consumer is responsible for rendering only the items that should be visible, or should delegate that to useHeadlessFlatTree_unstable.
- Do not render both the aside slot and the actions slot on the same item expecting them to be visible together — they are positioned in the same spot and show one at a time.
- Do not omit aria-level, aria-setsize, aria-posinset, itemType, and parentValue on FlatTreeItem; without them the flattened structure is not navigable or announceable as a tree.
- Do not rely on actions alone as the only way to reach functionality — users of assistive technology may never discover them.
- Do not expose selection affordances in a nested Tree without controlling the checked state yourself; only FlatTree conveniently supports an uncontrolled checked state because its items are known upfront.
- Do not nest a functionally interactive tree item inside a huge uncontrolled tree and expect selection or open state to stay in sync with external state.
- Do not override indentation with ad-hoc margins; use the level token-driven inline variable mechanism when you need custom depth styling.
- Do not place block-level or non-focusable layout markup directly inside a TreeItem outside of TreeItemLayout or TreeItemPersonaLayout.

## Anti-Patterns

### Mixing openItems with the per-item open prop

❌ Supplying openItems on the Tree while also controlling a single TreeItem through its own open prop creates two competing sources of truth for disclosure state, which the documentation explicitly calls out as leading to unexpected behavior.

✅ Choose one model per tree. Either control the whole tree with openItems and onOpenChange, or control individual items with their open prop and onOpenChange handlers, and never use both in the same tree.

### Shipping inline actions as the only affordance

❌ Actions rendered inside a treeitem are not an expected pattern according to WAI-ARIA, and users of assistive technology or keyboard-only users may never discover or reach them, especially since the actions slot is only revealed when the item is active.

✅ Compose a Menu with openOnContext around the tree item that exposes the same operations as the inline actions, and add an aria-description to the tree item so screen readers announce that the item has actions.

### Hand-managing visibility in a FlatTree without help

❌ In a flat structure there is no reliable way to infer whether an item is visible from context, so a hand-rolled FlatTree easily renders children of collapsed branches or drops items when state changes, producing a tree that is wrong visually and for screen readers.

✅ Use useHeadlessFlatTree_unstable (or the flattenTree helper when converting an existing nested tree) to compute the visible item list and to generate the required aria-level, aria-setsize, aria-posinset, itemType, and parentValue values for each FlatTreeItem.

### Losing focus while mutating a flat tree

❌ Adding or removing items from a FlatTree without tracking focus can drop keyboard focus to the document body, breaking the roving tabindex and forcing users to Tab back into the tree mid-task.

✅ Track a target item value in state, focus the corresponding item's ref in an effect after the update, and clear the target — the pattern demonstrated by the Manipulation, Infinite Scrolling, and Lazy Loading examples.

### Assuming the aside and actions slots can coexist

❌ The aside and actions slots occupy exactly the same position in the item, so rendering both and expecting them to be visible simultaneously produces overlapping or missing content.

✅ Decide per item whether it shows an aside (always visible) or actions (visible on hover or focus, or forced visible with the actions slot's visible prop), and never rely on both being shown at once.

## Accessibility

**Requirements**: The root Tree must expose an accessible name, which in every documented example is provided through aria-label. The tree must follow the WAI-ARIA treeview pattern: the container is a tree and each item is a treeitem, branch items expose their expanded state and act as parents of a nested group of treeitems. When selectionMode is set to single, the tree renders radio-button semantics; when set to multiselect, it renders checkbox semantics, and the corresponding checked state must be reflected to assistive technology. Color contrast for the tree item text, icons, selection indicators, and focus ring must meet WCAG 2.1 AA, and the focus indicator must remain visible against every background, which is why transparent appearance should only be used on surfaces that already provide sufficient contrast. For flat trees, consumers must supply aria-level, aria-setsize, and aria-posinset on every item so that screen readers can describe position and depth. Actions rendered inside a tree item are not an expected pattern per WAI-ARIA, so an equivalent context menu is required, and the tree item should carry an aria-description explaining that actions exist. Asynchronous loading results should be announced through a live region with aria-live="polite" and aria-atomic="true".

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and out of the tree as a single tab stop; only one treeitem is in the tab order at a time (roving tabindex). |
| `ArrowDown` | Moves focus to the next visible treeitem in the flattened visual order. |
| `ArrowUp` | Moves focus to the previous visible treeitem in the flattened visual order. |
| `ArrowRight` | In the default navigationMode of 'tree', moves inward to the first child of an expanded branch item; with navigationMode set to 'treegrid', it first expands a collapsed branch and then navigates toward that item's actions. |
| `ArrowLeft` | Moves outward to the parent treeitem; when focus is inside a tree item's actions under navigationMode 'treegrid', it returns focus to the owning treeitem. |
| `Home` | Moves focus to the first visible treeitem in the tree. |
| `End` | Moves focus to the last visible treeitem in the tree. |
| `Enter` | Activates the focused treeitem; in expandable items it produces an onOpenChange event with type 'Enter', which the Customizing Interaction example intercepts to treat content activation separately from icon toggling. |
| `Space` | Toggles the checked state of the focused item when a selectionMode is set, and activates the item otherwise. |
| `Character keys` | Type-ahead: typing a printable character moves focus to the next visible treeitem whose label starts with that character. |
| `ArrowLeft / ArrowRight (within actions)` | The actions slot has role="toolbar" and uses an arrow-navigation group, so horizontal arrow keys move between the buttons inside an item's actions. |
| `Context Menu key / Shift+F10` | Opens the context menu when a Menu with openOnContext is composed around the tree item, which is the recommended accessible alternative to inline actions. |

**ARIA**: aria-label (required on the root Tree or FlatTree), aria-description (on tree items that expose aside content or actions), aria-level (required on FlatTreeItem, describing depth), aria-setsize (required on FlatTreeItem, number of siblings at the level), aria-posinset (required on FlatTreeItem, position among siblings), aria-expanded (state of a branch treeitem), aria-checked / aria-selected (reflects selectionMode 'single' or 'multiselect'), aria-live="polite" with aria-atomic="true" on a visually hidden region used to announce lazy loading and infinite scrolling results, role="toolbar" on the actions slot

**Screen Reader**: Screen readers announce the tree container by its aria-label and then treat each treeitem as a hierarchical node, reading the item's label plus its level, position, and set size (from aria-level, aria-posinset, and aria-setsize, which are mandatory in FlatTree constructions), along with its expanded or collapsed state for branch items. Because navigation uses a roving tabindex, only the focused treeitem is reported as the active element as users arrow through the hierarchy; expanding or collapsing a branch fires an onOpenChange event that updates the announced expanded state. When selectionMode is 'single' or 'multiselect', the rendered radio buttons or checkboxes cause the focused item to be announced with its checked state. Extra content placed in the aside slot is not automatically read, so an aria-description on the tree item is required to convey it, and inline actions should be described through the same mechanism plus an equivalent context menu. In lazy loading and infinite scrolling scenarios, a polite live region announces messages such as loading progress and how many items were loaded, and focus is programmatically moved to the first new item.

## Styling

Style Tree through makeStyles and Griffel class names rather than global CSS, and remember that most visual surface work happens in the item layouts (TreeItemLayout and TreeItemPersonaLayout) since they respond to the Tree's appearance and size values. Because Tree is a single tab stop with a roving tabindex, do not add your own focus outlines; instead keep the built-in focus indicator legible by choosing an appearance whose hover and focus backgrounds contrast with your page. Use tokens such as tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground2Hover, tokens.colorNeutralBackground1Selected, tokens.colorNeutralForeground1, tokens.colorNeutralForeground2, tokens.colorNeutralForeground1Hover, tokens.colorStrokeFocus2, tokens.borderRadiusMedium, tokens.spacingHorizontalS, tokens.spacingVerticalXS, tokens.fontSizeBase300, tokens.fontSizeBase200, and tokens.lineHeightBase300 so the tree stays visually consistent with the rest of the Fluent UI surface. Depth indentation is generated from a level token: Tree emits static styles for the first ten nesting levels and falls back to an inline CSS variable for anything deeper, and the Inline Styling Tree Item Level example shows how to write that level value yourself (using useSubtreeContext_unstable to read the current level and the treeItemLevelToken as the style key) when you need to override the default indentation. Motion can be customized declaratively through the collapseMotion slot on the nested Tree, which accepts duration, easing, and animateOpacity; the Motion Custom example drives easing from motionTokens.curveDecelerateMid and lets users adjust duration and opacity. For dense layouts prefer size="small" with the default subtle appearance, and reserve appearance="transparent" for trees placed on a container that already paints the background.

## Performance

Tree generates static indentation styles for the first ten nesting levels and automatically falls back to an inline CSS variable for deeper levels, so arbitrarily deep trees indent correctly without an explosion of generated CSS — this is the main reason to avoid writing your own per-level style generation. Prefer FlatTree with FlatTreeItem and useHeadlessFlatTree_unstable when the item set is large, because the flattened structure is what makes windowing possible; the virtualization example renders the flat tree through react-window, and lazy loading and infinite scrolling examples only fetch child data when a branch is expanded or the scroller reaches the end. Memoize the item array you feed into useHeadlessFlatTree_unstable so the hook does not recompute the visible list on every render, and keep the number of animated nodes low by scoping collapseMotion to the subtree being expanded rather than the entire tree. Because the tree is a single tab stop with a roving tabindex, avoid re-rendering the whole tree on every keystroke; type-ahead, arrow navigation, and focus movement are internal and do not require you to lift state.

## Theming & Tokens

Tree consumes Fluent design tokens through Griffel slots, so it inherits light, dark, and high-contrast themes automatically from FluentProvider. Idle item text uses tokens.colorNeutralForeground1 with secondary text such as descriptions in tokens.colorNeutralForeground2, and hover and focus surfaces derive from tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground2Hover (used by the subtle and subtle-alpha appearances), and tokens.colorNeutralBackground1Selected for selected or checked rows. The focus indicator is drawn from tokens.colorStrokeFocus2, corner rounding from tokens.borderRadiusMedium, and internal padding from tokens.spacingHorizontalS and tokens.spacingVerticalXS. Typography follows tokens.fontSizeBase300 for medium and tokens.fontSizeBase200 for small size, with tokens.lineHeightBase300 controlling row rhythm, so changing size changes both spacing and type scale. Motion honors the theme's duration and curve values, and the collapseMotion slot lets you supply your own duration and easing — the Motion Custom example uses motionTokens.curveDecelerateMid. Because appearance="transparent" removes the background, verify that your container supplies a token-based background so foreground tokens still meet contrast requirements in every theme.

## Migration Notes

In the v9 API the treeview is split into composable parts: Tree plus TreeItem plus a layout component (TreeItemLayout or TreeItemPersonaLayout), replacing the older monolithic item API. Appearance and density are now declarative through the appearance and size props on Tree instead of per-item style overrides, and disclosure state is expressed with openItems, defaultOpenItems, onOpenChange, and the per-item open prop rather than ad-hoc state on individual items. Selection is expressed through selectionMode and checkedItems, with the convenience that FlatTree supports an uncontrolled checked state while nested Tree expects you to control it. Navigation behavior between a treeitem and its actions is configurable through navigationMode ('tree' by default, 'treegrid' when items expose actions). Styling moved from CSS class overrides to Griffel slots and design tokens, and virtualization, lazy loading, drag and drop, and infinite scrolling are now supported through composition with FlatTree, FlatTreeItem, and useHeadlessFlatTree_unstable rather than being built in.

## Edge Cases

- openItems and defaultOpenItems are ignored for subtrees — a nested Tree inside a TreeItem does not honor them, so deep disclosure must be driven from the root tree or per item with the open prop.
- Tree emits static indentation for only the first ten nesting levels and falls back to an inline CSS variable beyond that; custom level-based styling must write to the treeItemLevelToken rather than to a class per level.
- The onOpenChange event fires for both clicks on the item content and on the expand/collapse icon; the data payload's type distinguishes 'Click' and 'Enter' from icon-driven changes, which lets you intercept content activation without disabling icon toggling.
- FlatTreeItem requires aria-level, aria-setsize, aria-posinset, itemType, and parentValue; omitting any of them breaks position announcements and makes the flat tree unusable for screen reader users even though it may look correct visually.
- In a nested Tree you are responsible for controlling selection state, while FlatTree supports an uncontrolled checked state; assuming uncontrolled selection works in both will silently produce a non-functional selection UI.
- Aside content is not read by screen readers by default; without an aria-description on the tree item (for example "Important, 3 message") the extra information is invisible to assistive technology.
- Tree has no built-in drag-and-drop; reordering requires integrating a third-party library such as dnd-kit around the items, and doing so with a flat tree additionally requires keeping parentValue relationships consistent.
- Removing the last child of a branch while it is expanded can leave an empty expanded branch; the Manipulation example shows how to shift focus to the next or previous sibling instead.
- The actions slot is only visible while the item is active (hovered or focused) unless its visible prop is set, so functionality exposed only through actions can appear to be missing on touch devices.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
