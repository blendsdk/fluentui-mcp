# Table

> **Package**: `@fluentui/react-table` v9.19.16
> **Import**: `import { Table } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

Table is a composable set of data-display primitives for rendering tabular data in Fluent UI React v9: Table, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell, TableSelectionCell, TableCellLayout, TableCellActions and TableResizeHandle all cooperate to render either native semantic table elements or a flexbox-based div layout. By itself, Table is intentionally unopinionated: it renders accessible markup and styling but carries no data logic. Behavior such as sorting, selection, column resizing and keyboard navigation is layered on through hooks such as useTableFeatures, useTableSelection, useTableSort and useTableColumnSizing_unstable, or through utilities such as useArrowNavigationGroup, useFocusableGroup and useTableCompositeNavigation. The typical composition pairs a Table with a TableHeader containing a TableRow of TableHeaderCells, and a TableBody containing TableRows whose TableCells hold TableCellLayout content (media, description, primary emphasis) and optional TableCellActions that reveal on hover or focus. Because the primitives are headless with respect to state, the same markup supports simple read-only tables, fully interactive data grids, resizable columns and virtualized row rendering.

**When to use**: Use Table when you need to present structured, multi-column data where users compare values across rows, sort or filter the set, select one or many rows, or act on individual cells. Reach for the Table primitives when you want full control over markup, state management and rendering strategy; reach for a composition built on the same primitives (the DataGrid pattern shown in the stories, which wires useTableFeatures, useTableSelection and useTableSort into accessible markup and event handlers) when you want the common behaviors wired up for you. Choose it over List or a stack of Cards when the relationships between columns matter and column headers carry meaning, and over Tree or FlatTree when the data is flat rather than hierarchical. Table is not a data-fetching, paging or filtering component; supply already-shaped items through the useTableFeatures hook or your own state, and avoid Table when a small amount of key-value content can be expressed more simply with descriptions or a definition-style layout.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `'primary'` | — | No | — |
| `appearance` | `'brand' \| 'neutral' \| 'none'` | — | No | — |
| `autoFitColumns` | `boolean` | — | No | — |
| `checked` | `CheckboxProps['checked']` | — | No | — |
| `columnId` | `TableColumnId` | — | Yes | — |
| `columnSizingOptions` | `TableColumnSizingOptions` | — | No | — |
| `containerWidthOffset` | `number` | — | No | — |
| `focusMode` | `DataGridCellFocusMode` | — | No | — |
| `hidden` | `boolean` | — | No | — |
| `invisible` | `boolean` | — | No | — |
| `onSelectionChange` | `(e: React_2.MouseEvent \| React_2.KeyboardEvent, data: OnSelectionChangeData) => void` | — | No | — |
| `onSortChange` | `(e: React_2.MouseEvent, sortState: SortState) => void` | — | No | — |
| `root` | `Slot<'tbody', 'div'>` | — | Yes | — |
| `root` | `Slot<'td', 'div'>` | — | Yes | — |
| `root` | `Slot<'thead', 'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `selectionMode` | `SelectionMode_2` | — | No | — |
| `sortDirection` | `SortDirection` | — | No | — |
| `sortable` | `boolean` | `false` | No | — |
| `subtle` | `boolean` | — | No | — |
| `tableState` | `TableFeaturesState<unknown>` | — | Yes | — |
| `truncate` | `boolean` | — | No | — |
| `type` | `'checkbox' \| 'radio'` | — | No | — |
| `visible` | `boolean` | — | No | — |
| `width` | `number` | — | Yes | — |

### Prop Guidance

- **sortable**: Set on Table to configure header cells as buttons and apply the additional sort styling; the actual sort state still comes from useTableSort and is passed down per header cell. `sortable`
- **sortDirection**: Set on TableHeaderCell to signal whether the column is sorted ascending or descending, and in a controlled sort scenario driven by the app's own sort state. `ascending`
- **onSortChange**: Supply to the sort plugin when you want controlled sorting; it receives the event and the next sort state, which the parent stores and feeds back in. `(event, sortState) => setSortState(sortState)`
- **selectionMode**: Passed to useTableSelection to choose single or multiselect behavior; single selection pairs naturally with a radio selection cell and multiselect with checkboxes. `multiselect`
- **onSelectionChange**: Use for controlled selection; it receives the originating mouse or keyboard event and data whose selected items should be written to your own state. `(event, data) => setSelectedRows(data.selectedItems)`
- **checked**: Set on TableSelectionCell: true or false for individual rows, and mixed for a select-all header cell when only some rows are selected. `mixed`
- **type**: Set on TableSelectionCell to render either a checkbox or a radio indicator; use radio for single selection so semantics match the behavior. `radio`
- **subtle**: Set on TableSelectionCell so the indicator appears only when the row is hovered, contains focus, or is checked, reducing visual noise in dense tables. `true`
- **hidden**: Set on TableSelectionCell to omit the selection cell from layout while keeping selection state; use it when a mode is temporarily disabled rather than unmounting the cell. `true`
- **invisible**: Set on TableSelectionCell to keep the selection column in the layout without rendering an interactive indicator; commonly used on the header radio cell in single-select tables. `true`
- **appearance**: On TableRow and TableSelectionCell, accepts brand, neutral or none and is the primary way to reflect selection state visually; on TableCellLayout, accepts primary to increase icon size and font weight for the row-identifying value. `brand`
- **truncate**: Set on TableCellLayout when cell content may exceed the column width so text is clipped with an ellipsis instead of forcing the column wider. `true`
- **focusMode**: Controls how focus moves through the table when composite navigation is used; the composite strategy focuses rows first and switches to cells of the current row when the right arrow key is pressed. `composite`
- **tableState**: The state object produced by useTableFeatures with its plugins; it carries rows, selection, sort and column sizing state and is what makes features persist across virtualization mount and unmount cycles. `state returned from useTableFeatures`
- **columnSizingOptions**: Per-column resizing configuration keyed by columnId, each entry accepting minWidth, defaultWidth and idealWidth; supply it to the column sizing plugin and read it back from onColumnResize when controlled. `minWidth 150, defaultWidth 250, idealWidth 300`
- **columnId**: The identifier of a column, used by the sizing plugin to match configuration, header cell props, cell props, setColumnWidth and enableKeyboardMode calls. `file`
- **width**: The measured or resized width of a column reported through the resize callback; persist it into columnSizingOptions as idealWidth for a fully controlled resizing experience. `300`
- **autoFitColumns**: When true (the default) the sizing feature fits columns to the container; set it to false to keep fixed widths and allow horizontal overflow, and pair it with noNativeElements. `false`
- **containerWidthOffset**: Adjusts the width used when fitting columns to their container, useful when surrounding chrome such as a scrollbar or padding would otherwise cause columns to be mis-measured. `17`
- **visible**: Boolean visibility toggle for the element it is set on (for example a cell actions container); prefer it over conditional mounting when you want layout to remain stable. `true`
- **root**: The root slot of each primitive, typed against the native element it renders (tbody or div for TableBody, td or div for TableCell, thead or div for TableHeader, div for the non-native containers); use it to pass className, style, ref, event handlers and role or aria attributes. `root with className and aria attributes`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement, PresenceBadgeStatus } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  return (
    <Table arial-label="Default table" style={{ minWidth: '510px' }}>
      <TableHeader>
        <TableRow>
          {columns.map(column => (
            <TableHeaderCell key={column.columnKey}>{column.label}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.file.label}>
            <TableCell>
              <TableCellLayout media={item.file.icon}>{item.file.label}</TableCellLayout>
            </TableCell>
            <TableCell>
              <TableCellLayout
                media={
                  <Avatar
                    aria-label={item.author.label}
                    name={item.author.label}
                    badge={{ status: item.author.status as PresenceBadgeStatus }}
                  />
                }
              >
                {item.author.label}
              </TableCellLayout>
            </TableCell>
            <TableCell>{item.lastUpdated.label}</TableCell>
            <TableCell>
              <TableCellLayout media={item.lastUpdate.icon}>{item.lastUpdate.label}</TableCellLayout>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

### CellActions

```tsx
import * as React from 'react';
import type { JSXElement, PresenceBadgeStatus } from '@fluentui/react-components';

export const CellActions = (): JSXElement => {
  return (
    <Table aria-label="Table with cell actions" style={{ minWidth: '500px' }}>
      <TableHeader>
        <TableRow>
          {columns.map(column => (
            <TableHeaderCell key={column.columnKey}>{column.label}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.file.label}>
            <TableCell>
              <TableCellLayout media={item.file.icon}>{item.file.label}</TableCellLayout>
              <TableCellActions>
                <Button icon={<EditIcon />} appearance="subtle" aria-label="Edit" />
                <Button icon={<MoreHorizontalIcon />} appearance="subtle" aria-label="More actions" />
              </TableCellActions>
            </TableCell>
            <TableCell>
              <TableCellLayout
                media={
                  <Avatar
                    aria-label={item.author.label}
                    name={item.author.label}
                    badge={{ status: item.author.status as PresenceBadgeStatus }}
                  />
                }
              >
                {item.author.label}
              </TableCellLayout>
            </TableCell>
            <TableCell>{item.lastUpdated.label}</TableCell>
            <TableCell>
              <TableCellLayout media={item.lastUpdate.icon}>{item.lastUpdate.label}</TableCellLayout>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

CellActions.parameters = {
  docs: {
    description: {
      story: [
        '`TableCellActions` is a container that is visible when the `TableRow`is hovered',
        'or when the current focused element is within the row. It is commonly used to contain interactive actions',
        'like buttons, but can be used for any generic content. Please ensure that the contents of cell actions',
        'are accessible.',
      ].join('\n'),
    },
  },
};
```

### CellNavigation

```tsx
import * as React from 'react';
import type { JSXElement, PresenceBadgeStatus } from '@fluentui/react-components';

export const CellNavigation = (): JSXElement => {
  const keyboardNavAttr = useArrowNavigationGroup({ axis: 'grid' });

  return (
    <Table
      {...keyboardNavAttr}
      role="grid"
      aria-label="Table with grid keyboard navigation"
      style={{ minWidth: '600px' }}
    >
      <TableHeader>
        <TableRow>
          {columns.map(column => (
            <TableHeaderCell key={column.columnKey}>{column.label}</TableHeaderCell>
          ))}
          <TableHeaderCell />
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.file.label}>
            <TableCell tabIndex={0} role="gridcell">
              <TableCellLayout media={item.file.icon}>{item.file.label}</TableCellLayout>
            </TableCell>
            <TableCell tabIndex={0} role="gridcell">
              <TableCellLayout
                media={
                  <Avatar
                    aria-label={item.author.label}
                    name={item.author.label}
                    badge={{ status: item.author.status as PresenceBadgeStatus }}
                  />
                }
              >
                {item.author.label}
              </TableCellLayout>
            </TableCell>
            <TableCell tabIndex={0} role="gridcell">
              {item.lastUpdated.label}
            </TableCell>
            <TableCell tabIndex={0} role="gridcell">
              <TableCellLayout media={item.lastUpdate.icon}>{item.lastUpdate.label}</TableCellLayout>
            </TableCell>
            <TableCell role="gridcell">
              <TableCellLayout>
                <Button icon={<EditRegular />}>Edit</Button>
              </TableCellLayout>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

CellNavigation.parameters = {
  docs: {
    description: {
      story: [
        'The `Table` primitive components do not support keyboard navigation. This should be added by users.',
        'Cell navigation can be achieved simply using the `useArrowNavigationGroup` utility provided by the Library.',
        '',
        '>⚠️ Once there is any kind of keyboard navigation on the component it must follow the',
        '>[aria role="grid" pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/examples/data-grids/).',
      ].join('\n'),
    },
  },
};
```

## Best Practices

### Do's

- Give every Table an accessible name with aria-label (or an equivalent named region) so the table is distinguishable from other tables on the page.
- Keep the default native semantic elements for read-only and lightly interactive tables, since semantic table markup gives the best screen reader support; switch to noNativeElements only when virtualization or horizontal overflow demands a flexbox layout.
- Mirror selection state in three places: the TableSelectionCell checked value, the aria-selected attribute on the TableRow, and the row appearance of brand versus none.
- Use TableCellLayout for cell content so media, main text and a description line up consistently across rows, and reserve its primary appearance for the column that identifies the row, usually the first column.
- Add keyboard navigation deliberately: use useArrowNavigationGroup with a grid axis for plain cell navigation, or useTableCompositeNavigation when you want row focus that switches into cell focus on the right arrow key.
- Provide aria-label values on checkboxIndicator and radioIndicator so the select-all control in the header and the per-row controls announce their purpose.
- Prevent default on the Space key whenever a row toggles selection, so the page does not scroll while the selection changes.
- Set aria-rowcount on the Table and aria-rowindex on header and body rows when rows are virtualized, so assistive technology can report position within the full data set.
- Use columnSizingOptions with minWidth, defaultWidth and idealWidth rather than hard-coded pixel widths, and disable auto-fit with autoFitColumns set to false only alongside noNativeElements.
- Memoize row components with React.memo and keep click and key handlers stable when rendering large data sets, following the memoization story so only the affected row re-renders on selection change.

### Don'ts

- Do not spread the attributes returned by useArrowNavigationGroup onto a Table without also switching the role to grid; keyboard navigation on the component obligates the aria role grid pattern.
- Do not put multiple interactive controls in a cell without applying the limited-trap-focus behavior from useFocusableGroup to that TableCell, which leaves users tabbing through every control in every row.
- Do not virtualize or horizontally scroll a table that renders native semantic elements; browser table layout resists it, so the rows will not overflow the parent as expected.
- Do not let a row-level selection handler fire when the user clicks a TableCellActions button; stop the event with preventDefault and check defaultPrevented in the row handler.
- Do not rely on background color alone to communicate selection; combine row appearance with aria-selected and the visible selection cell.
- Do not mix controlled and uncontrolled state for the same feature; if selectionMode is driven by selectedItems with an onSelectionChange callback, do not also expect uncontrolled defaultSelectedItems behavior.
- Do not omit the accessible name on TableSelectionCell indicators, and do not use an invisible header selection cell for multiselect headers where a select-all checkbox belongs.
- Do not build ad-hoc layout wrappers inside cells to align icons and text; TableCellLayout already handles media, description and truncation.
- Do not assume screen reader users will hear the sort direction change; the sortable pattern is correct but announcement is unreliable in some screen readers.
- Do not place focusable header content without making the header cell focusable; context menus attached to TableHeaderCell require the cell itself to receive tabIndex.

## Anti-Patterns

### Keyboard navigation without the grid role

❌ Spreading the attributes from useArrowNavigationGroup onto a Table without changing the role leaves assistive technology with a static table while the component behaves as a composite widget, so row and cell context is lost and the interaction does not match any ARIA pattern.

✅ Whenever any keyboard navigation is added, set the role to grid on the Table, give every navigable TableCell the gridcell role and a tabIndex, and follow the WAI-ARIA grid pattern for data grids.

### Virtualizing or overflowing native table elements

❌ Native table layout is strictly managed by the browser, so rows will not overflow the parent and a virtualized list rendered inside a real table body breaks column alignment and scroll behavior.

✅ Render with noNativeElements so every element becomes a div with flexbox layout, set aria-rowcount on the Table and aria-rowindex on rows, and add only a decorative presentational element for scrollbar alignment in the header.

### Cell actions that also trigger row selection

❌ When a row has an onClick or onKeyDown selection handler, pressing a button or the Space key inside TableCellActions bubbles up and toggles the row, confusing users who only wanted to run the cell action.

✅ Stop the event inside the cell actions container with preventDefault and check defaultPrevented in the row handler before toggling selection; this event coordination is intentionally left to the consuming app.

### Every row re-rendering on a single selection change

❌ Recreating row objects, handlers and cell content on every render makes large tables re-render wholesale each time one row's selection changes, which causes visible lag in data-heavy screens.

✅ Follow the memoization story: extract the row into its own component wrapped in React.memo, pass stable callbacks created with useCallback, and give each row a stable key such as its rowId.

### Uncontrolled focus traversal through interactive cells

❌ Placing buttons, links or menus inside every cell without special handling makes Tab step through every control in every row, making the table effectively unnavigable for keyboard users.

✅ Make the cell the focus target, add arrow-key navigation with useArrowNavigationGroup, and apply useFocusableGroup with the limited-trap-focus tab behavior to cells that contain multiple focusable elements so Enter enters the cell and Escape leaves it.

### Hard-coded column widths with the sizing feature

❌ Setting pixel widths directly on cells fights the column sizing plugin, producing columns that jump, overlap or fail to respect minimum widths when the container resizes.

✅ Configure width constraints through columnSizingOptions with minWidth, defaultWidth and idealWidth, spread the header cell and cell props returned by the sizing object, and persist measured widths back through the resize callback when controlling the feature.

## Accessibility

**Requirements**: Table should satisfy WCAG 1.3.1 Info and Relationships by exposing real table structure (native table elements, or role grid with role row and role gridcell when non-native elements are used), WCAG 4.1.2 Name Role Value by giving the table an accessible name through aria-label and by labelling every selection control, WCAG 2.1.1 Keyboard by making every sortable header, selectable row and cell action reachable and operable from the keyboard, and WCAG 2.4.7 Focus Visible by keeping the Fluent focus indicator intact on rows, headers, cells and actions. Selection conveyed by color must additionally be conveyed by aria-selected, aria-checked (including the mixed value for partially selected sets) and the visible checkbox or radio. Interactive tables that support arrow-key navigation must follow the WAI-ARIA grid pattern, and sortable headers must follow the WAI sortable-table pattern.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the table and, when grid navigation is enabled, to the single focusable cell; Shift+Tab moves focus out to the previous control. |
| `ArrowDown / ArrowUp` | Moves focus between rows when grid navigation from useArrowNavigationGroup is applied with a grid axis. |
| `ArrowLeft / ArrowRight` | Moves focus between cells in the current row under grid navigation. |
| `ArrowRight` | In composite navigation, switches focus mode from the current row into the individual cells of that row. |
| `Space` | Toggles selection of the focused row or the select-all control when row selection handlers are attached; must call preventDefault to avoid page scrolling. |
| `Enter` | Moves focus into a cell that contains multiple focusable elements when the cell uses limited-trap-focus from useFocusableGroup; also activates a sortable header button. |
| `Escape` | Returns focus from within a trapped focus group back to the containing cell. |
| `Tab / Shift+Tab inside a focus trap` | Cycles through the focusable controls inside the cell rather than leaving it, because the group uses limited trap focus. |

**ARIA**: aria-label (accessible name for the Table and for TableCellActions buttons), aria-selected (applied to TableRow and TableSelectionCell to convey row selection), aria-checked (true, false or mixed on the select-all and per-row selection controls), aria-rowcount (set on the Table when rows are virtualized or lazily rendered), aria-rowindex (set on header and body rows to report row position in virtualized tables), role="grid" (required once keyboard navigation is added to the table), role="gridcell" (applied to TableCell when a non-native grid is used), role="checkbox" (used on the select-all header selection cell), role="presentation" (used for decorative scrollbar-alignment elements inside header rows), aria-label on checkboxIndicator and radioIndicator (names the select-all and per-row selection inputs)

**Screen Reader**: With default native elements, screen readers enter a table reading mode and announce column headers as users navigate cells, which is why native markup is preferred for non-virtualized tables. Once the table is given role grid, assistive technology treats it as a composite widget: users move between rows and cells with arrow keys and hear row and column context as focus moves, and a single Tab press enters or leaves the widget rather than stepping through every cell. Selection state is announced from aria-selected on rows and aria-checked on the checkbox or radio, including the mixed state when only some rows are selected; a row rendered with brand appearance but no aria-selected will be announced as unselected. Row position in virtualized tables is announced from aria-rowcount and aria-rowindex. Sort state follows the WAI sortable-table pattern driven by the sortDirection prop on TableHeaderCell, but be aware that some screen readers, notably NVDA, may not announce the sort status after a sortable header is invoked.

## Styling

Most visual customization should be applied through the root slot, which is the first-class styling hook of every Table primitive (Table, TableHeader, TableRow, TableCell, TableHeaderCell, TableSelectionCell, TableCellLayout, TableCellActions), and through Griffel classes composed with mergeClasses rather than inline pixel styling. Row emphasis uses the appearance prop: brand tints selected rows with tokens.colorBrandBackground2 while none leaves the row transparent, and hover feedback comes from tokens.colorSubtleBackgroundHover and tokens.colorSubtleBackgroundPressed, with pressed rows using tokens.colorNeutralBackground1Pressed. Header cells inherit tokens.colorNeutralBackground2 with token-driven borders from tokens.colorNeutralStroke2, and body text uses tokens.colorNeutralForeground1 with secondary or description text in tokens.colorNeutralForeground2 and tokens.colorNeutralForeground3. Selection indicators and other interactive cells rely on tokens.colorNeutralStroke1 and tokens.colorNeutralStrokeAccessible for the control outline and tokens.colorStrokeFocus2 for focus rings. Density is controlled with the size prop values small and extra-small, so avoid overriding cell padding manually; if you must, prefer tokens.spacingVerticalS, tokens.spacingVerticalXS, tokens.spacingHorizontalS and tokens.spacingHorizontalMNudge. Emphasis in TableCellLayout comes from the primary appearance, which increases icon size and applies tokens.fontWeightSemibold with tokens.fontSizeBase300 and tokens.lineHeightBase300 for the main line. TableCellLayout truncate keeps long values inside the column instead of widening it, which is essential when columns are resizable. When columns are resizable you must also wrap the table in an overflow container and render with noNativeElements, because native table layout will not overflow its parent.

## Performance

Because Table primitives are stateless, rendering cost is dominated by the row and cell subtrees you author. Hoisting selection, sort and column sizing into useTableFeatures keeps feature state outside the render tree, so it survives the mounting and unmounting that occurs during virtualization. For large data sets, memoize each row component with React.memo, stabilize the click and keydown handlers with useCallback, and key rows by a stable identity such as rowId so a selection change re-renders only the affected row. Row rendering in virtualized scenarios should be delegated to a virtualization library, combined with noNativeElements so layout is flexbox-based and inexpensive to reposition, and with aria-rowcount and aria-rowindex so the virtualized subset is still announced correctly. Column resizing and auto-fit perform layout measurement, so prefer autoFitColumns set to false when you already control the widths, and avoid re-creating the sizing options object on every render. Cell actions that appear on hover should be rendered as part of the row rather than mounted on demand, since hover-triggered mounting causes layout thrash inside cells.

## Theming & Tokens

Table reads all of its color, typography and spacing from the Fluent theme provided by FluentProvider, so switching themes swaps the underlying CSS custom properties without changing table markup. Body surfaces use tokens.colorNeutralBackground1, header surfaces use tokens.colorNeutralBackground2, and separators and control outlines come from tokens.colorNeutralStroke2 and tokens.colorNeutralStroke1. Hover and press feedback on rows use tokens.colorSubtleBackgroundHover, tokens.colorSubtleBackgroundPressed and tokens.colorNeutralBackground1Pressed, focus rings use tokens.colorStrokeFocus2, and selected rows rendered with appearance brand pull from the brand ramp through tokens.colorBrandBackground2 while selected neutral rows use tokens.colorNeutralBackground1Selected. Text colors follow tokens.colorNeutralForeground1 for cell content, tokens.colorNeutralForeground2 for descriptions and secondary metadata, and tokens.colorNeutralForeground3 for the quietest supporting text. Density and typography scale with the Table size prop, which adjusts padding and uses tokens.fontSizeBase300, tokens.lineHeightBase300 and tokens.fontWeightSemibold for emphasized primary cell content. Custom styling should compose Griffel classes on the root slot with mergeClasses rather than overriding internal class names, so token-based values continue to respond correctly to theme and density changes.

## Migration Notes

The Table primitives are the successor to both the older v8-style declarative table and the DataGrid component family (DataGrid, DataGridHeader, DataGridRow, DataGridCell and friends), which are themselves compositions of these primitives. The modern approach is to build the markup from Table, TableHeader, TableBody, TableRow, TableCell and TableHeaderCell and to obtain state from useTableFeatures combined with plugins such as useTableSelection, useTableSort and useTableColumnSizing_unstable; any feature available in a prebuilt data grid is achievable with the primitives and the hook. Feature logic lives in the hook rather than in the components, so selection and sort state survive mounting and unmounting during virtualization. Column resizing remains a preview API (the unstable hook) and is opt-in: it requires columnSizingOptions, the tableRef returned by useTableFeatures, the getTableProps, getTableHeaderCellProps and getTableCellProps methods, and optionally onColumnResize for controlled widths, setColumnWidth for imperative widths and enableKeyboardMode for keyboard resizing. Layout migration matters too: containers that previously fought native table layout should switch to noNativeElements, where every element renders as a div with flexbox-based layout approximating the native table experience.

## Edge Cases

- Sort status may not be announced by screen readers after a sortable header is invoked; the implementation follows the WAI sortable-table pattern, but this remains a known screen reader limitation rather than a markup defect.
- Column resizing is a preview API exposed through useTableColumnSizing_unstable, and it requires the table ref, the table props and header/cell props from the sizing object; keyboard resizing must be enabled explicitly per column, typically through a context menu on the header cell.
- Native table elements will not overflow their parent, so horizontal scrolling and virtualization require noNativeElements; without it, wide or virtualized content is clipped instead of scrollable.
- Disabled auto-fit keeps fixed column widths, but content can then be clipped, so combine it with TableCellLayout truncate to preserve readable cells.
- A select-all header cell must communicate the mixed state with both the checked value of mixed and a matching aria-checked value, otherwise partially selected sets are announced as fully selected or unselected.
- Rows with a selection handler must call preventDefault on the Space key, or the page scrolls while the selection toggles.
- Virtualized tables must declare aria-rowcount on the Table and aria-rowindex on mounted rows, and typically need a presentational element in the header row to keep the header aligned with the scrollbar.
- Header cells that host a context menu for advanced features must themselves be focusable, since the menu trigger alone does not make the header reachable by keyboard in a grid-navigated table.
- Cell actions are hidden until the row is hovered or contains focus, so any action exposed only there must still be reachable by keyboard and must carry an accessible name.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
