# MenuGridPreview

> **Package**: `@fluentui/react-menu-grid-preview` v0.5.2
> **Import**: `import { MenuGridPreview } from '@fluentui/react-menu-grid-preview';`
> **Category**: utilities
> **Stability**: unstable

## Overview

MenuGridPreview is the entry point to the Fluent UI React menu grid preview package, imported from @fluentui/react-menu-grid-preview. It ships a coordinated set of components — MenuGrid, MenuGridItem, MenuGridRow, MenuGridCell, MenuGridGroup, and MenuGridGroupHeader — that render a columnar, multi-target list inside a standard Menu popover. Where an ordinary menu row exposes exactly one action, a menu grid row can combine a leading icon or profile action, the primary item content (with an optional subText line), and one or two trailing sub-actions such as remove, profile card, audio call, or a more-actions submenu. MenuGridItem is the high-level building block: it takes the icon, content, subText, firstSubAction, and secondSubAction slots, places them into the correct cells, and wires up row-level activation through standard DOM props such as onClick and aria-label. MenuGridRow and MenuGridCell are the lower-level primitives used when a layout needs more than two sub-actions or a custom arrangement. MenuGrid itself accepts a root slot and a circular prop that controls whether horizontal arrow-key navigation wraps around at the ends of a row. Grouped content is expressed with MenuGridGroup wrapped around MenuGridGroupHeader so the correct accessible grouping markup is produced. Because this API lives in a preview package, treat its surface as experimental and subject to change.

**When to use**: Use the menu grid when a menu row must present more than one interactive target — for example a chat participant list where each row has a profile-card button, the participant name, and a remove button, or a call list offering audio call, video call, and delete actions. Choose it over plain MenuList/MenuItem whenever a single click target per row would force you to nest submenus or duplicate rows. Prefer the standard Menu with MenuList and MenuItem when every row performs exactly one action, because the grid adds extra columns, extra tabbable controls, and more markup for no benefit. Prefer List, Table, or Card when the content is not an overlay menu — that is, when it lives inline in the page, needs sorting or multi-selection semantics, or should be reachable without opening a trigger. Use the grid inside MenuPopover so the menu's focus management, dismissal behavior, and menu semantics remain intact. Use MenuGridItem rather than hand-authoring MenuGridRow and MenuGridCell unless you genuinely need more than two sub-actions or a custom column layout.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `circular` | `boolean` | — | No | — |
| `content` | `Slot<MenuGridCellProps>` | — | No | — |
| `firstSubAction` | `Slot<MenuGridCellProps>` | — | No | — |
| `icon` | `Slot<MenuGridCellProps>` | — | No | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<MenuGridRowProps>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `secondSubAction` | `Slot<MenuGridCellProps>` | — | No | — |
| `subText` | `Slot<'span'>` | — | No | — |
| `visuallyHidden` | `boolean` | — | No | — |

### Prop Guidance

- **root**: The root slot available on the grid and its structural children (MenuGrid as a div slot, MenuGridRow as a row-props slot, and MenuGridCell as a div slot). Use it to pass className, style, id, or other DOM attributes down to the outermost element of that piece, which is how you theme the grid without targeting internal classes. `className: 'participantGrid'`
- **circular**: Controls whether horizontal arrow-key navigation wraps around the ends of a row. Leave it at its default when continuous left/right traversal is helpful, and set it to false when wrap-around would be confusing, such as short rows or rows with conditionally rendered sub-actions. `false`
- **visuallyHidden**: A boolean for a sub-action cell (firstSubAction or secondSubAction) that renders an empty, visually hidden cell instead of a real action. Use it to keep column structure intact when some rows have fewer sub-actions than others, so every row aligns and the grid is structured correctly. `true`
- **icon**: The leading cell of a MenuGridItem. Supply a small, transparent icon button to act as a profile card or detail action, or a plain icon when the cell should not be independently interactive. Always give an interactive icon an aria-label describing what it does and for which item. `profile card button for the participant`
- **content**: The primary cell of a MenuGridItem, holding the item label or the main child content that names the row. Keep it to short, scannable text; this is the text users compare across rows. Pair it with an aria-label on the item when surrounding sub-action context matters. `participant name`
- **subText**: A span slot rendered beneath or alongside the primary content for secondary information such as a status or an email address. Use it sparingly, since it increases row height, and style it with muted foreground tokens so it does not compete with the primary label. `status line beneath the name`
- **firstSubAction**: The first trailing action cell. This is where a destructive action such as remove, the most common primary sub-action, or a menu button that opens a submenu belongs. When the action is icon-only, provide a descriptive aria-label; when a row has no first sub-action, use a visually hidden cell instead of omitting the slot. `small transparent remove button`
- **secondSubAction**: The second trailing action cell, rendered after the first. Use it for an additional distinct action, and use a visually hidden cell in rows that do not need it so the two trailing columns stay aligned across all rows. `small transparent more-actions button`

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Button, Menu, MenuPopover, MenuTrigger } from '@fluentui/react-components';
import { MenuGrid, MenuGridItem } from '@fluentui/react-menu-grid-preview';
import { DeleteRegular, GlobePersonRegular } from '@fluentui/react-icons';

export const Default = (): JSXElement => {
  const showAlert = (name: string) => {
    alert(`Item ${name} activated`);
  };

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button>Chat participants</Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuGrid>
          {items.map(name => (
            <MenuGridItem
              key={name}
              onClick={() => showAlert(name)}
              aria-label={name}
              icon={
                <Button
                  size="small"
                  appearance="transparent"
                  icon={<GlobePersonRegular />}
                  aria-label={`Profile card for ${name}`}
                />
              }
              firstSubAction={
                <Button size="small" appearance="transparent" icon={<DeleteRegular />} aria-label={`Remove ${name}`} />
              }
            >
              {name}
            </MenuGridItem>
          ))}
        </MenuGrid>
      </MenuPopover>
    </Menu>
  );
};
```

### Asymmetric

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Button, Menu, MenuTrigger, MenuPopover } from '@fluentui/react-components';
import { MenuGrid, MenuGridItem } from '@fluentui/react-menu-grid-preview';
import { DeleteRegular, GlobePersonRegular } from '@fluentui/react-icons';

export const Asymmetric = (): JSXElement => {
  const showAlert = (name: string) => {
    alert(`Item ${name} activated`);
  };

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button>Chat participants</Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuGrid>
          {items.map(item => (
            <MenuGridItem
              key={item.name}
              firstSubAction={
                item.removable ? (
                  <Button
                    size="small"
                    appearance="transparent"
                    icon={<DeleteRegular />}
                    aria-label={`Remove ${item.name}`}
                  />
                ) : (
                  { visuallyHidden: true }
                )
              }
              icon={
                <Button
                  size="small"
                  appearance="transparent"
                  icon={<GlobePersonRegular />}
                  aria-label={`Profile card for ${item.name}`}
                />
              }
              onClick={() => showAlert(item.name)}
              aria-label={item.name}
            >
              {item.name}
            </MenuGridItem>
          ))}
        </MenuGrid>
      </MenuPopover>
    </Menu>
  );
};

Asymmetric.parameters = {
  docs: {
    description: {
      story: [
        'If `MenuGridItem` sub-actions are asymmetric, use the `visuallyHidden` property of the `firstSubAction` or `secondSubAction` slot to create an empty and visually hidden cell so the grid is structured correctly.',
      ].join('\n'),
    },
  },
};
```

### GroupingItems

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Button, Menu, MenuPopover, MenuTrigger } from '@fluentui/react-components';
import { MenuGrid, MenuGridGroup, MenuGridGroupHeader, MenuGridItem } from '@fluentui/react-menu-grid-preview';
import { DeleteRegular, GlobePersonRegular } from '@fluentui/react-icons';

export const GroupingItems = (): JSXElement => {
  const showAlert = (name: string) => {
    alert(`Item ${name} activated`);
  };

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button>Chat participants</Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuGrid>
          <MenuGridGroup>
            <MenuGridGroupHeader>People</MenuGridGroupHeader>
            {items.people.map(name => (
              <MenuGridItem
                key={name}
                icon={
                  <Button
                    size="small"
                    appearance="transparent"
                    icon={<GlobePersonRegular />}
                    aria-label={`Profile card for ${name}`}
                  />
                }
                firstSubAction={
                  <Button
                    size="small"
                    appearance="transparent"
                    icon={<DeleteRegular />}
                    aria-label={`Remove ${name}`}
                  />
                }
                onClick={() => showAlert(name)}
                aria-label={name}
              >
                {name}
              </MenuGridItem>
            ))}
          </MenuGridGroup>
          <MenuGridGroup>
            <MenuGridGroupHeader>Agents and bots</MenuGridGroupHeader>
            {items.agentsAndBots.map(name => (
              <MenuGridItem
                key={name}
                icon={
                  <Button
                    size="small"
                    appearance="transparent"
                    icon={<GlobePersonRegular />}
                    aria-label={`Profile card for ${name}`}
                  />
                }
                firstSubAction={
                  <Button
                    size="small"
                    appearance="transparent"
                    icon={<DeleteRegular />}
                    aria-label={`Remove ${name}`}
                  />
                }
                onClick={() => showAlert(name)}
                aria-label={name}
              >
                {name}
              </MenuGridItem>
            ))}
          </MenuGridGroup>
        </MenuGrid>
      </MenuPopover>
    </Menu>
  );
};

GroupingItems.parameters = {
  docs: {
    description: {
      story: [
        'A menu grid can be divided into separate groups, using the `MenuGridGroup` and `MenuGridGroupHeader`',
        'components. This ensures the correct accessible markup is rendered for screen reader users.',
      ].join('\n'),
    },
  },
};
```

## Best Practices

### Do's

- Always place the grid inside MenuPopover inside a Menu with a MenuTrigger, so focus trapping, Escape dismissal, and menu roles come from the standard Menu implementation.
- Use MenuGridItem for the common case; it assembles the icon, content, and sub-action cells and keeps rows structurally consistent.
- Give every icon-only sub-action button a descriptive aria-label that names the action and the item it applies to, such as a profile card label or a remove label that includes the person's name.
- Set aria-label on the MenuGridItem (or on MenuGridRow when you build a custom row) so the row is announced meaningfully instead of relying on its visual children.
- When sub-actions are asymmetric, populate the missing slot with a visuallyHidden cell so every row keeps the same column structure and alignment.
- Wrap grouped content in MenuGridGroup with a MenuGridGroupHeader so screen readers receive the correct accessible grouping markup.
- Provide a stable key for each MenuGridItem or MenuGridRow when rendering a list, and keep handlers stable so rows do not re-render unnecessarily.
- Set circular to false when wrap-around navigation at the ends of a row would be surprising, such as when rows contain disabled or conditional sub-actions.

### Don'ts

- Don't use the menu grid for single-action menus; a standard Menu with MenuList and MenuItem is lighter, faster, and semantically simpler.
- Don't render icon-only sub-action buttons without an aria-label — an unlabeled button leaves screen reader users with an indistinguishable "button" announcement.
- Don't let sub-actions be asymmetric without marking the empty slot visuallyHidden, because the missing cell shifts the remaining columns and breaks the grid's visual and structural rhythm.
- Don't reach for MenuGridRow and MenuGridCell first; bypassing MenuGridItem means you take on column placement and row labeling yourself.
- Don't attach activation handlers only to a sub-action button when the whole row is meant to be actionable — put the row-level handler on the item or row and keep sub-action buttons scoped to their own action.
- Don't nest an unrelated interactive widget that opens its own overlay inside a cell without providing it a proper Menu and MenuTrigger, or keyboard focus can escape the popover unexpectedly.
- Don't hard-code colors, spacing, or corner radii on grid cells; use the slot objects and Griffel tokens so the grid tracks the active theme.
- Don't forget to test the grid with a keyboard only — arrow-key traversal plus Tab between sub-actions is the part most likely to break.

## Anti-Patterns

### Grid used for a single-action menu

❌ Building every menu as a grid adds extra cells, extra tabbable buttons, and extra markup when each row only performs one action, which slows navigation and clutters the announcement stream for screen reader users.

✅ Use a plain Menu with MenuList and MenuItem, and reserve the MenuGrid components for rows that genuinely need multiple interactive targets.

### Unlabeled icon-only sub-actions

❌ A remove or profile-card button rendered without an aria-label is announced only as a button, so users cannot tell which row it belongs to or what it does, especially when the same control repeats on every row.

✅ Give each sub-action button an aria-label that combines the action with the item identifier, such as a remove label that includes the participant name.

### Asymmetric sub-actions without a hidden filler cell

❌ When some rows render a first sub-action and others omit it entirely, the trailing columns shift out of alignment, so similar actions appear in different positions from row to row and the grid structure becomes inconsistent.

✅ Populate the missing slot with a visually hidden cell so every row keeps the same number of columns and the grid stays structurally correct.

### Hand-rolled rows when MenuGridItem would do

❌ Composing MenuGridRow and MenuGridCell directly for ordinary two-action rows duplicates placement and labeling logic and drifts out of sync with the built-in item behavior over time.

✅ Use MenuGridItem whenever the layout fits its icon, content, subText, firstSubAction, and secondSubAction slots, and drop to rows and cells only for genuinely custom layouts with more than two sub-actions.

### Sticky wrap-around navigation

❌ Leaving circular at its default when rows are short or contain conditionally disabled actions can make arrow-key traversal feel like it loops endlessly, which disorients keyboard users.

✅ Set circular to false on MenuGrid so left and right arrow keys stop at the ends of each row.

## Accessibility

**Requirements**: The grid inherits its menu semantics from the surrounding Menu and MenuPopover, so it must be rendered inside those components and never standalone. Meet WCAG 2.1.1 (Keyboard) by ensuring every row and every sub-action is reachable and operable without a pointer; 4.1.2 (Name, Role, Value) by labeling each icon-only sub-action button with aria-label and labeling each row/item; 2.4.3 (Focus Order) by keeping DOM order matching visual order across icon, content, and sub-action cells; 2.4.7 (Focus Visible) by leaving the built-in focus indicator intact; 1.3.1 (Info and Relationships) by using MenuGridGroup and MenuGridGroupHeader rather than visual-only separators; and 1.4.3 (Contrast) plus 2.5.8 (Target Size) by checking small transparent icon buttons against the popover surface. The menu trigger button must also carry its own accessible name.

| Key | Action |
| --- | --- |
| `ArrowDown` | Moves focus to the next row in the grid, within the parent menu's focus order. |
| `ArrowUp` | Moves focus to the previous row in the grid. |
| `ArrowRight` | Moves focus to the next interactive cell within the current row; wraps to the first cell of the row when circular is true. |
| `ArrowLeft` | Moves focus to the previous interactive cell within the current row; wraps to the last cell of the row when circular is true. |
| `Enter` | Activates the currently focused item or sub-action button. |
| `Space` | Activates the currently focused item or sub-action button. |
| `Escape` | Closes the menu popover and returns focus to the menu trigger. |
| `Tab` | Moves focus to the next focusable element inside the popover, such as the next sub-action button, or out of the popover when no further targets remain. |

**ARIA**: aria-label

**Screen Reader**: Assistive technology perceives the grid as part of the parent menu: rows are announced as menu items whose accessible name comes from the aria-label set on the MenuGridItem or MenuGridRow, and grouped sections are announced with their MenuGridGroupHeader text. Because sub-actions are real buttons, they are announced as separate buttons with their own names, so labels like a remove or profile-card label that includes the person's name are essential to distinguish otherwise identical controls across rows. Arrow-key traversal moves a virtual focus through rows and cells, and the focused cell is reported as it changes. When a row is activated, the item's click handler runs; when a sub-action is activated, only that sub-action's behavior runs. Visually hidden sub-action cells stay out of the accessibility tree's meaningful content while preserving the grid's structural shape.

## Styling

Style the grid through the slot objects rather than by reaching into internals: the MenuGrid root slot, the MenuGridRow and MenuGridCell root slots, and the MenuGridItem icon, content, subText, firstSubAction, and secondSubAction slots all accept className, style, and children, so you can target exactly the cell you want. Use tokens.spacingHorizontalS and tokens.spacingHorizontalM for gutters between the icon, content, and sub-action cells, and tokens.spacingVerticalXS with tokens.spacingVerticalS for row padding so rows stay consistent with the rest of the menu. Use tokens.colorNeutralForeground1 for the primary content text, tokens.colorNeutralForeground2 for the subText line, and tokens.fontSizeBase200 with tokens.fontWeightRegular for secondary label weight. Keep sub-action buttons compact — the stories use small, transparent icon buttons — and pair them with tokens.colorSubtleBackgroundHover, tokens.colorSubtleBackgroundPressed, and tokens.borderRadiusMedium so hover and press states stay subtle against the popover surface. Apply tokens.borderRadiusMedium to the row or item root for a matching rounded hover highlight, and reserve tokens.colorBrandBackground for genuinely selected or emphasized rows. Prefer tokens.colorNeutralStroke1 if you need separators between groups instead of custom borders, and never hard-code pixel values, hex colors, or font stacks.

## Performance

Each grid item expands into several cells and, typically, one or two extra button components per row, so a grid of fifty participants renders far more elements than an equivalent MenuList. Keep the rendered list bounded, and virtualize or paginate when the dataset is large. Hoist any array mapping in the parent and memoize the sub-action elements so that opening the menu does not rebuild every button on each render; avoid creating new object literals for slot props (such as the visually hidden cell shape) inside the map when a module-level constant would do. Because activation is handled through the item's click handler, keep those handlers stable with useCallback or by passing the item identifier rather than a fresh inline closure per row. Note that only the open popover's contents are mounted, so work performed while the menu is closed is avoided, but the first open pays the cost of building all rows at once.

## Theming & Tokens

The grid consumes the same theme tokens as the surrounding Menu: the popover surface comes from tokens.colorNeutralBackground1, primary row text from tokens.colorNeutralForeground1, secondary subText from tokens.colorNeutralForeground2, and disabled sub-actions from tokens.colorNeutralForegroundDisabled. Hover and pressed feedback on rows and on transparent icon buttons use tokens.colorSubtleBackgroundHover, tokens.colorSubtleBackgroundPressed, tokens.colorNeutralBackground2, and tokens.colorNeutralForeground2Hover, with tokens.borderRadiusMedium controlling the highlight shape. Focus is drawn with tokens.colorStrokeFocus2, so overriding cell focus styles can silently break contrast in high-contrast or dark themes. Spacing flows from tokens.spacingHorizontalXS through tokens.spacingHorizontalL and tokens.spacingVerticalXS through tokens.spacingVerticalM, corner rounding from tokens.borderRadiusSmall and tokens.borderRadiusMedium, and typography from tokens.fontFamilyBase, tokens.fontSizeBase200, tokens.fontSizeBase300, tokens.fontWeightRegular, and tokens.fontWeightSemibold. Any color, spacing, or radius assigned through slot classNames should reference these tokens rather than literal values.

## Migration Notes

This is a preview surface: the components are published from @fluentui/react-menu-grid-preview and are not re-exported from @fluentui/react-components, so adopting it means adding a separate preview dependency alongside your normal Fluent packages. Teams migrating from MenuList-based participant or contact menus should expect to restructure each row from a single MenuItem into a MenuGridItem with icon and sub-action slots, or into explicit MenuGridRow and MenuGridCell markup when more than two sub-actions are required. Because the package is explicitly preview, expect breaking changes between releases; keep the grid usage isolated (for example in a single wrapper component) so API churn is contained, and re-check arrow-key and focus behavior after upgrading.

## Edge Cases

- Asymmetric sub-actions: if only some rows have a remove button or a profile action, fill the missing slot with a visually hidden cell so columns stay aligned across the whole grid.
- More than two sub-actions: MenuGridItem caps out at firstSubAction and secondSubAction, so a row with audio call, video call, and remove must be authored with MenuGridRow and MenuGridCell directly, which means you also take on row-level labeling and activation.
- Submenus inside a grid item: to open a nested menu from a row, put a menu button (for example a more-actions button) into the firstSubAction or secondSubAction slot with its own Menu and MenuTrigger rather than trying to nest interactive markup inside the content cell.
- Grouped content without MenuGridGroup and MenuGridGroupHeader renders visually separated sections that screen readers do not announce as groups, so the visual grouping is lost to non-visual users.
- Setting circular to false changes only horizontal wrap-around at the ends of a row; vertical movement between rows is unaffected, so keyboard expectations should be verified for both axes.
- Row activation versus sub-action activation are separate: clicking the item runs the item's onClick, while clicking a sub-action button runs only that button's handler, so a destructive sub-action inside a row that also has an onClick needs the two behaviors deliberately kept apart.
- The package is published from the preview import path and is not part of the stable component bundle, so bundlers and dependency policies that restrict preview packages may need configuration before it can be used.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
