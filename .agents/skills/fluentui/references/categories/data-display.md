# data-display components

## Overview

Data Display components present information for reading rather than for input. They cover identity and people (Avatar, AvatarGroup, AvatarGroupItem, AvatarGroupPopover, Persona, PresenceBadge), short metadata and status (Badge, CounterBadge, Tag, TagGroup, InteractionTag, InteractionTagPrimary, InteractionTagSecondary), typography and media (Text, Image), loading placeholders (Skeleton, SkeletonItem), and structured collections (List and ListItem, Table with its header, body, row, cell, layout, actions, resize and selection parts, DataGrid with its header, body, row, cell and selection-cell parts, and Tree, TreeItem, TreeItemLayout, TreeItemPersonaLayout, FlatTree and FlatTreeItem). Most of these are compositional families: a container such as Table, DataGrid, Tree, TagGroup, List, or AvatarGroup owns selection, sizing, or open state, while the children render rows, cells, items, and tags. Choosing the right component in this category is mostly about matching the shape of your data to the shape of the component, then keeping size, appearance, and state consistent inside a region.

## When to Use

Reach for this category whenever the user needs to read, scan, compare, or navigate existing information. Use Persona when a person or entity needs a name plus supporting text and an avatar, and Avatar alone when space is tight and the visual identity is the whole message; use AvatarGroup plus AvatarGroupPopover when several people must be summarized and the tail must overflow gracefully. Use Badge for short categorical metadata, CounterBadge when the value is a number that can exceed the available width, and PresenceBadge for availability status. Use Tag for labels that are dismissible or selectable and InteractionTag when a tag needs both a primary action and a secondary action such as removal. Use Text for controlled typography instead of ad-hoc markup, and Image for shaped, fitted media. Use Skeleton and SkeletonItem to reserve the layout of content that is still loading. For collections, use List when order matters but columns do not, Table when you need semantic tabular markup with full control of every row and cell, DataGrid when you need sorting, selection, and resizable or virtualized columns, Tree when the data is hierarchical and users expand and collapse it, and FlatTree when that hierarchy is flattened for virtualization and carries explicit level and position information.

## Best Practices

### Do's

- Provide a name on Avatar so the component can derive initials and an identity, and use color with idForColor when the same person or entity must keep a stable color across the product.
- Use Persona whenever a person needs more than an avatar: its name prop plus the primaryText, secondaryText, tertiaryText, and quaternaryText slots give you a consistent text stack, and textPosition and textAlignment control how that stack sits relative to the avatar.
- Summarize people with AvatarGroup and control the arrangement through its layout and size props, and render the tail of a long list through AvatarGroupPopover with indicator and count instead of truncating silently; mark the overflow entry with isOverflow on AvatarGroupItem so its overflowLabel is used.
- Pick the status component by the data, not by appearance: Badge for short labels and categories, CounterBadge with overflowCount for numbers that can grow, and PresenceBadge with status and outOfOffice for availability.
- Make Tag interactive only when it truly is: set dismissible on Tag when the label can be removed, use selected together with TagGroup's selectedValues and onTagSelect when tags act as filters, and reach for InteractionTag with InteractionTagPrimary and InteractionTagSecondary only when a tag needs both a primary action and a secondary action.
- Shape placeholders to match the content they stand in for: set size, shape, and width on Skeleton and choose animation and appearance deliberately, so the placeholder occupies roughly the same box as the loaded content and the page does not jump.
- Use Text's typography props (size, weight, font, align, block, italic, underline, strikethrough, wrap, and truncate) to express intent instead of styling raw elements, and reserve larger sizes for hierarchy within a block rather than for document structure.
- Use Image's fit, shape, shadow, bordered, and block props to control how media is cropped, framed, and laid out, and keep the same fit and shape for images that appear in a repeated pattern.
- Compose DataGrid when a collection needs behavior: DataGridHeader and DataGridHeaderCell for sortable columns, DataGridBody and DataGridRow with DataGridCell for the cell content, DataGridSelectionCell with selectionMode and onSelectionChange for row selection, and columnSizingOptions, resizableColumnsOptions, and onColumnResize for column widths.
- Compose Table when you need explicit control of the markup: TableHeader and TableHeaderCell (with sortable and sortDirection), TableBody, TableRow with its appearance, TableCell, and TableCellLayout for media, main text, description, and content, plus TableCellActions for row-level actions and TableSelectionCell for selection affordances.
- Use Tree for hierarchical data with openItems, selectionMode, or checkedItems, and choose TreeItemLayout or TreeItemPersonaLayout for the row content instead of building row internals yourself; use FlatTree only when the hierarchy is flattened, and always supply value, aria-level, aria-setsize, and aria-posinset on FlatTreeItem.
- Reach for List and ListItem when the content is a simple ordered or unordered set: use navigationMode to express whether items are links or composite widgets, and drive selection through selectionMode, selectedItems or defaultSelectedItems, and onSelectionChange rather than through custom state.

### Don'ts

- Don't add another avatar or person component inside a Persona, and don't render an Avatar inside AvatarGroupItem: Persona already provides an avatar slot, AvatarGroupItem already provides an avatar slot, and nesting them duplicates the identity and bloats the row.
- Don't use Badge, CounterBadge, or PresenceBadge as controls. They are display-only; if a value must be clicked or toggled, use a button or an interaction component next to the display component.
- Don't render a CounterBadge for an unbounded number without setting overflowCount, and don't rely on the count alone to communicate meaning when the underlying item also needs a text label.
- Don't turn a status or presence indicator into the only signal of state; pair PresenceBadge and colored Badges with text so the state survives without color perception.
- Don't use Tag as navigation or as the primary action of a page, and don't give a Tag a secondary action when InteractionTagSecondary exists for that purpose.
- Don't mix Tree and FlatTreeItem or FlatTree and TreeItem in the same hierarchy: Tree owns nested TreeItem children, while FlatTree expects flattened FlatTreeItem entries.
- Don't omit the required sizing and position metadata on FlatTreeItem; without aria-level, aria-setsize, and aria-posinset a flattened tree loses the level, sibling count, and position that assistive technology needs.
- Don't hand-build sortable, selectable tables from raw markup when TableHeaderCell already exposes sortable and sortDirection and the data-grid family already handles selection and column resizing.
- Don't control the same state twice: choose either controlled or uncontrolled props on a family, for example openItems versus defaultOpenItems on Tree, selectedValues versus defaultSelectedValues on TagGroup, and selectedItems versus defaultSelectedItems on List.
- Don't leave Skeleton or SkeletonItem on screen after the content resolves, and don't give a placeholder a shape, size, or width unrelated to the content it replaces.
- Don't force heading structure or section semantics through Text size or weight; use the correct structural element and use Text to style the run of text inside it.
- Don't vary size, appearance, or shape arbitrarily within one region: keep Avatar, Persona, Badge, Tag, TableRow, and Text styling consistent so repeated rows read as a set.

## Anti-Patterns

### Building tables and hierarchies out of generic containers

❌ Rendering tabular records or nested categories as rows of plain flex items or repeated Text loses header association, sort state, selection semantics, level, and position, so assistive technology cannot describe the structure and you must rebuild sorting, selection, and expansion by hand.

✅ Compose the collection families instead: Table with TableHeaderCell, TableRow, TableCell, and TableCellLayout for markup you control, DataGrid with DataGridHeader, DataGridRow, DataGridCell, and DataGridSelectionCell when you need sorting, selection, and column sizing, and Tree or FlatTree with TreeItemLayout, TreeItemPersonaLayout, or FlatTreeItem for hierarchical data with proper level and position metadata.

### Treating display-only components as interactive controls

❌ Badge, CounterBadge, PresenceBadge, Avatar, Image, and Skeleton are presentation-only. Attaching click handlers to them produces elements that cannot be focused, cannot be activated from the keyboard, and are not announced as controls, while Tag and InteractionTag exist precisely to make labels actionable.

✅ Decide first whether the element is read or operated. Keep display components display-only and put a real button next to them for the action; when a label itself must be removed or selected, use Tag with dismissible and selected plus TagGroup's selectedValues and onTagSelect, and when a label needs two distinct actions, use InteractionTag with InteractionTagPrimary and InteractionTagSecondary.

### Silent overflow in groups of people or metadata

❌ An AvatarGroup, TagGroup, or list of status items that simply stops rendering when it runs out of room hides information and gives the user no way to reach the remainder; clipping avatars or tags mid-row also makes counts unreadable.

✅ Plan the overflow explicitly. Use AvatarGroup with layout and size, render the hidden tail through AvatarGroupPopover with indicator and count, and mark the summarizing entry with isOverflow and overflowLabel on AvatarGroupItem; for numeric metadata use CounterBadge's overflowCount, and for label collections let TagGroup own dismissal and selection through onDismiss and onTagSelect instead of dropping items.

### Mixing controlled and uncontrolled state across a family

❌ Families such as Tree, FlatTree, TagGroup, List, and DataGrid separate what is rendered from what is owned. Passing both the controlled and the default variant of the same value, or storing open and selected state on the children instead of the container, leads to surfaces that disagree with each other and to state that snaps back on re-render.

✅ Choose one owner per piece of state: the container holds openItems or defaultOpenItems, selectionMode with checkedItems, selectedValues or defaultSelectedValues, and selectedItems or defaultSelectedItems, and the children render from that state. Keep value, and on FlatTreeItem the required aria-level, aria-setsize, and aria-posinset, driven by the same source that produces the flattened order.

### Inconsistent sizing and density inside a single surface

❌ Mixing Avatar sizes, Persona sizes, Badge sizes, Tag sizes, and Text sizes in the same row, or varying shape and appearance arbitrarily, makes repeated data look ragged and makes scanning harder; it also makes truncation and alignment unpredictable.

✅ Fix the scale for a region and pass it down: set Image shape and fit, Avatar size and shape, Persona size and textPosition, Tag size, shape, and appearance (inherited from TagGroup where possible), Badge and CounterBadge size and shape, and Text size and weight to one consistent set, and reuse that set for every row, cell, and card in the surface.

## Accessibility

Accessibility for this category is mostly about making displayed information perceivable and keeping semantics intact. Always give identity components a text name: Avatar derives its accessible identity from name, and Persona's name plus its primaryText and secondaryText slots should carry the same information that sighted users read, so a person is never represented by an image alone. Do not let color be the only carrier of meaning in Badge, CounterBadge, PresenceBadge, or Avatar's color and active props; include adjacent text or an explicit status word. Meaningful images need a text alternative and decorative images should be kept out of the accessibility tree, and Image should be used so media is framed consistently rather than conveying information through framing alone. Interactive display components must expose real controls: Tag dismissibility and InteractionTag's primary and secondary actions must be reachable and operable with the keyboard, and TagGroup's onDismiss and onTagSelect should be wired so removal and filtering are available without a pointer. Loading placeholders such as Skeleton and SkeletonItem have no text equivalent, so the surrounding region should communicate that content is loading and the announcement should occur once, when the real content arrives. For collections, the container communicates the semantics: Table and DataGrid must use header cells for column headers so sortable and sortDirection state is announced, DataGridSelectionCell and TableSelectionCell must match the configured selectionMode so checkbox or radio selection is described correctly, DataGridCell's focusMode should be set deliberately because it governs whether cells are individually focusable, and column resizing exposed through onColumnResize and the resize handle must be operable from the keyboard. In tree structures, TreeItemLayout and TreeItemPersonaLayout provide the expand affordance, selectors, and actions slots so those controls are exposed rather than hidden in decorative markup, while FlatTreeItem must always receive value, aria-level, aria-setsize, and aria-posinset so a flattened tree is announced with its true depth and position. Finally, respect motion and density preferences: choose Skeleton's animation and appearance rather than inventing motion, and keep size props aligned within a region so zoomed and high-density layouts stay coherent.

## Components in this category

- [Avatar](../components/avatar.md)
- [AvatarGroup](../components/avatar-group.md)
- [AvatarGroupItem](../components/avatar-group-item.md)
- [AvatarGroupPopover](../components/avatar-group-popover.md)
- [Badge](../components/badge.md)
- [CounterBadge](../components/counter-badge.md)
- [DataGrid](../components/data-grid.md)
- [DataGridBody](../components/data-grid-body.md)
- [DataGridCell](../components/data-grid-cell.md)
- [DataGridHeader](../components/data-grid-header.md)
- [DataGridHeaderCell](../components/data-grid-header-cell.md)
- [DataGridRow](../components/data-grid-row.md)
- [DataGridSelectionCell](../components/data-grid-selection-cell.md)
- [FlatTree](../components/flat-tree.md)
- [FlatTreeItem](../components/flat-tree-item.md)
- [Image](../components/image.md)
- [InteractionTag](../components/interaction-tag.md)
- [InteractionTagPrimary](../components/interaction-tag-primary.md)
- [InteractionTagSecondary](../components/interaction-tag-secondary.md)
- [List](../components/list.md)
- [ListItem](../components/list-item.md)
- [Persona](../components/persona.md)
- [PresenceBadge](../components/presence-badge.md)
- [Skeleton](../components/skeleton.md)
- [SkeletonItem](../components/skeleton-item.md)
- [Table](../components/table.md)
- [TableBody](../components/table-body.md)
- [TableCell](../components/table-cell.md)
- [TableCellActions](../components/table-cell-actions.md)
- [TableCellLayout](../components/table-cell-layout.md)
- [TableHeader](../components/table-header.md)
- [TableHeaderCell](../components/table-header-cell.md)
- [TableResizeHandle](../components/table-resize-handle.md)
- [TableRow](../components/table-row.md)
- [TableSelectionCell](../components/table-selection-cell.md)
- [Tag](../components/tag.md)
- [TagGroup](../components/tag-group.md)
- [Text](../components/text.md)
- [Tree](../components/tree.md)
- [TreeItem](../components/tree-item.md)
- [TreeItemLayout](../components/tree-item-layout.md)
- [TreeItemPersonaLayout](../components/tree-item-persona-layout.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
