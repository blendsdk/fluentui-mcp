# List

> **Package**: `@fluentui/react-list` v9.6.15
> **Import**: `import { List } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

List is the Fluent UI React v9 container for rendering vertical collections of content that need to be keyboard navigable and, optionally, selectable. It renders a single root element (a semantic list when items are non-interactive, or a listbox/grid container depending on configuration) and coordinates behavior across its ListItem children. List owns the selection contract through selectionMode, selectedItems, defaultSelectedItems and onSelectionChange, and it owns the keyboard navigation contract through navigationMode, which decides whether focus moves only between whole items (items) or can also move into individual focusable elements inside an item (composite, which also switches the container to grid/row/gridcell semantics). Because List is intentionally unopinionated about content, it works equally well for simple text lists, Persona rows, multi-action rows that combine a primary action with secondary buttons, and virtualized lists rendered through a third-party windowing library such as react-window. List itself ships no virtualization, sorting, or column model, so it stays lightweight and composable while still providing the ARIA roles and selection semantics required by assistive technology.

**When to use**: Use List when you need to present a vertical sequence of related items where the user reads, selects, or acts on one item at a time, and you want the keyboard and ARIA plumbing handled for you. Use it for people pickers, selection panels, navigation-less item feeds, inbox-style rows, and any content where each row is a ListItem composed of arbitrary children. Choose selectionMode with single or multiselect when the whole item should be selectable, and add navigationMode composite when a row also contains secondary controls such as icon Buttons. Avoid List when your data is genuinely tabular (use Table or DataGrid for column headers, sorting and resizing), when items form a hierarchy (use Tree, FlatTree, or TreeItem), when the list is really a menu of commands (use Menu, MenuList, and MenuItem), when the items are destinations rather than data (use Nav, NavItem, and NavDrawer), or when the selection is a form field value (use Dropdown, Combobox, or Listbox). For very long lists where rendering every row is too expensive, keep List but wrap it in a virtualization library such as react-window.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `defaultSelectedItems` | `SelectionItemId[] \| undefined` | — | No | — |
| `navigationMode` | `ListNavigationMode \| undefined` | — | No | — |
| `onSelectionChange` | `EventHandler<OnListSelectionChangeData> \| undefined` | — | No | — |
| `selectedItems` | `SelectionItemId[] \| undefined` | — | No | — |
| `selectionMode` | `SelectionMode \| undefined` | `'multiselect'` | No | — |

### Prop Guidance

- **navigationMode**: Controls how the user moves through the list. Set it to items when each row has a single action so arrow keys move between whole items, and set it to composite when a row contains multiple focusable elements, which additionally enables Left and Right arrow traversal inside the row and switches the container to grid/row/gridcell semantics. If you do not use selection at all and items are plain content, leaving this unset keeps the simplest semantics. `composite`
- **selectionMode**: Enables selection and determines whether one or many items may be selected at a time. Provide single for exclusive selection (typical of master-detail layouts where the detail pane follows the focused row) or multiselect when several rows can be chosen at once. Note the default is multiselect, so omit selectionMode entirely when the list is purely informational, and provide it explicitly when you want single-select behavior. `single`
- **selectedItems**: Use this controlled prop to drive selection from your own state; its entries are matched against the value of each ListItem, so every selectable item needs a unique value. Pair it with onSelectionChange and update state from the event data. This is the recommended pattern for production code because it lets you preselect items, select all, or clear the selection from outside the list. `an array of the ListItem values that are currently selected`
- **defaultSelectedItems**: Sets the initial selection for an uncontrolled list, and the List then manages the state internally. Use it for demos or simple cases where the parent never needs to read or modify the selection; if you need to preselect items and also react to later changes, switch to selectedItems and onSelectionChange instead. `an array of ListItem values to select on first render`
- **onSelectionChange**: Fires whenever the selection changes, whether from a mouse click, Space or Enter, and receives a data object whose selectedItems array reflects the new selection. Use it to write the selection back into state so selectedItems stays in sync, and wrap it in useCallback when rendering large lists so rows are not re-rendered unnecessarily. `handler that stores data.selectedItems in component state`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { List, ListItem } from '@fluentui/react-components';
import { tokens, Text, makeResetStyles } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  const textStyle = useTextStyle();
  return (
    <List>
      <ListItem>
        <Text className={textStyle}>Asia</Text>
      </ListItem>
      <ListItem>
        <Text className={textStyle}>Africa</Text>
      </ListItem>
      <ListItem>
        <Text className={textStyle}>Europe</Text>
      </ListItem>
      <ListItem>
        <Text className={textStyle}>North America</Text>
      </ListItem>
      <ListItem>
        <Text className={textStyle}>South America</Text>
      </ListItem>
      <ListItem>
        <Text className={textStyle}>Australia/Oceania</Text>
      </ListItem>
      <ListItem>
        <Text className={textStyle}>Antarctica</Text>
      </ListItem>
    </List>
  );
};
```

### ListActiveElement

```tsx
import { Button, makeStyles, Persona, mergeClasses, Text, tokens } from '@fluentui/react-components';
import { Mic16Regular } from '@fluentui/react-icons';
import { List, ListItem } from '@fluentui/react-components';
import * as React from 'react';
import type { JSXElement, SelectionItemId } from '@fluentui/react-components';

export const ListActiveElement = (): JSXElement => {
  const classes = useStyles();

  const [selectedItems, setSelectedItems] = React.useState<SelectionItemId[]>(['Melda Bevel']);

  const onSelectionChange = React.useCallback(
    (_: React.SyntheticEvent | Event, data: { selectedItems: SelectionItemId[] }) => {
      setSelectedItems(data.selectedItems);
    },
    [],
  );

  const onFocus = React.useCallback((event: React.FocusEvent<HTMLLIElement>) => {
    // Ignore bubbled up events from the children
    if (event.target !== event.currentTarget) {
      return;
    }
    setSelectedItems([event.currentTarget.dataset.value as SelectionItemId]);
  }, []);

  return (
    <div>
      <List
        selectionMode="single"
        navigationMode="composite"
        selectedItems={selectedItems}
        onSelectionChange={onSelectionChange}
      >
        {items.map(({ name, avatar }) => (
          <ListItem
            key={name}
            value={name}
            className={mergeClasses(classes.item, selectedItems.includes(name) && classes.itemSelected)}
            data-value={name}
            aria-label={name}
            onFocus={onFocus}
            checkmark={null}
          >
            <Persona
              name={name}
              role="gridcell"
              secondaryText="Available"
              presence={{ status: 'available' }}
              className={mergeClasses(selectedItems.includes(name) && classes.personaSelected)}
              avatar={{
                image: {
                  src: avatar,
                },
              }}
            />
            <div role="gridcell" className={classes.buttonWrapper}>
              <Button
                aria-label={`Mute ${name}`}
                size="small"
                icon={<Mic16Regular />}
                onClick={e => {
                  e.stopPropagation();
                  alert(`Muting ${name}`);
                }}
              />
            </div>
          </ListItem>
        ))}
      </List>
      <div className={classes.selectedInfo}>
        Currently selected:{' '}
        <Text block weight="bold">
          {selectedItems[0]}
        </Text>
      </div>
    </div>
  );
};

ListActiveElement.parameters = {
  docs: {
    description: {
      story: [
        'You can use selection and custom styles to show the active element in a different way. This is useful for scenarios where you want to show the details of the selected item, for example.',
        '',
        'In this example, we are also demonstrating how the `onFocus` prop can be utilized to change the selected item immediately upon receiving focus. This allows us to show the details of the selected item in the right panel as user navigates through the list with the keyboard.',
      ].join('\n'),
    },
  },
};
```

### MultipleActionsDifferentPrimary

```tsx
import { MoreHorizontal20Regular } from '@fluentui/react-icons';
import { List, ListItem } from '@fluentui/react-components';
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';

export const MultipleActionsDifferentPrimary = (): JSXElement => {
  const classes = useStyles();

  const [selectedItems, setSelectedItems] = React.useState<Array<string | number>>([]);

  return (
    <List
      className={classes.list}
      navigationMode="composite"
      selectionMode="multiselect"
      selectedItems={selectedItems}
      onSelectionChange={(e, data) => setSelectedItems(data.selectedItems)}
    >
      <CustomListItem title="Example List Item" value="card-1" />
      <CustomListItem title="Example List Item" value="card-2" />
      <CustomListItem title="Example List Item" value="card-3" />
      <CustomListItem title="Example List Item" value="card-4" />
      <CustomListItem title="Example List Item" value="card-5" />
      <CustomListItem title="Example List Item" value="card-6" />
      <CustomListItem title="Example List Item" value="card-7" />
      <CustomListItem title="Example List Item" value="card-8" />
      <CustomListItem title="Example List Item" value="card-9" />
    </List>
  );
};

MultipleActionsDifferentPrimary.parameters = {
  docs: {
    description: {
      story: [
        'Similar to previous example, but this one implements a custom `onAction` prop on the `ListItem`, ',
        'allowing us to trigger a different action than the selection when the user clicks ',
        'on the list item or presses Enter.',
        '',
        'The primary action can be triggered by clicking on the list item or pressing `Enter`.',
        '',
        'The selection can be toggled by clicking on the checkbox or pressing `Space` when the item is focused.',
        '',
        'To focus on the secondary actions, you can navigate between them by using left and right arrows.',
      ].join('\n'),
    },
  },
};
```

## Best Practices

### Do's

- Give the List an accessible name with aria-label (for example, a label describing the people or items being listed) whenever the surrounding context does not already name it, since the container is announced as a single widget.
- Set navigationMode to items when each ListItem has exactly one action (selection or a custom onAction), and set it to composite when a ListItem contains more than one focusable element so users can reach secondary controls with the arrow keys.
- Use selectedItems together with onSelectionChange to keep selection in your own state for production flows, and reserve defaultSelectedItems for demos or for lists whose selection you never need to read.
- Give every selectable ListItem a stable, unique value so that the ids reported in selectedItems and in the onSelectionChange data object round-trip correctly, and keep that value independent of the displayed label.
- Provide a per-item accessible name, either through aria-label on the ListItem or through a labelled checkmark slot, so screen readers announce a meaningful row description instead of the raw composed content.
- When navigationMode is composite, wrap each focusable element inside the ListItem in its own element with role gridcell, and make sure every direct child of the ListItem has a gridcell role, so grid navigation and announcements stay coherent.
- Wrap onSelectionChange and onAction callbacks in useCallback (and memoize row content) when the list is long, so a single selection change does not re-render every row.
- For lists with hundreds or thousands of rows, virtualize with a library such as react-window and set aria-setsize and aria-posinset manually on each rendered ListItem to preserve the announced position and total count.

### Don'ts

- Do not use List for tabular data that needs column headers, sorting, or resizing; Table and DataGrid exist for that and provide the correct row/column semantics.
- Do not drop interactive controls such as Buttons into a ListItem without setting navigationMode to composite, because those controls will not be reachable in a predictable keyboard order.
- Do not assume List virtualizes anything on its own; every ListItem you pass is rendered, so a naive list of thousands of rows will hurt responsiveness.
- Do not place several focusable elements inside a single gridcell when using composite navigation, since that breaks the one-focusable-control-per-cell expectation screen readers rely on.
- Do not rely on the DOM to compute item positions in a virtualized list; elements outside the viewport are unmounted, so aria-posinset and aria-setsize must be supplied explicitly.
- Do not omit the value prop on selectable items, or the selection state reported by onSelectionChange will not be able to identify which row changed.
- Do not treat focus events on a ListItem as if they came from the row itself; focus bubbles from children, so an onFocus handler must compare event.target with event.currentTarget before acting.
- Do not build site navigation out of List and ListItem; use Nav, NavItem, and NavDrawer so links receive the correct semantics and styling.

## Anti-Patterns

### Using List as a data grid

❌ List has no header row, column model, sorting, or resizing, so building tabular views from ListItems forces you to fake headers and align columns by hand, and screen readers receive no column relationships.

✅ Use Table or DataGrid when the content is genuinely tabular, and reserve List for sequences of items whose meaning does not depend on aligned columns.

### Interactive rows without composite navigation

❌ Placing a Button or other focusable control inside a ListItem while navigationMode is left unset (or set to items) makes those controls effectively unreachable in a predictable keyboard order and confuses the announced structure.

✅ Set navigationMode to composite whenever a row contains multiple focusable elements, and give each focusable element its own gridcell wrapper so Left and Right arrows traverse the row correctly.

### Relying on the DOM for virtualized positions

❌ In a windowed list only the visible rows exist in the DOM, so anything that computes an item's index or the total count from rendered children produces incorrect positions and counts for assistive technology.

✅ Pass the total count and index explicitly through aria-setsize and aria-posinset on every ListItem, as the virtualized stories do, so announcements remain accurate.

### Hiding selection state from the parent

❌ Using defaultSelectedItems and then trying to read selection from the DOM or from item state leads to stale or duplicated state, and the list cannot be reset or bulk-selected from outside.

✅ Lift selection into the parent with selectedItems and onSelectionChange; keep defaultSelectedItems only for uncontrolled demos, and remember that selectionMode defaults to multiselect when unspecified.

### Letting child focus events look like row focus

❌ Focus events bubble, so an onFocus handler on a ListItem also fires when focus lands on a nested Persona or Button, which can cause the active row to change unexpectedly when the user tabs into a control.

✅ Guard the handler by comparing event.target with event.currentTarget and return early for bubbled events, exactly as the active-element story does.

## Accessibility

**Requirements**: List must satisfy WCAG 2.1 keyboard operability (2.1.1), focus order (2.4.3) and focus visible (2.4.7): every selectable or actionable item must be reachable and togglable from the keyboard with a visible focus indicator. Name, Role, Value (4.1.2) and Info and Relationships (1.3.1) require the correct container semantics (listbox/option when selection is the item's only action, grid/row/gridcell when items contain multiple actions) plus an accessible name for the container and for each actionable child. Because selection is communicated through these roles, do not override the roles List assigns, and keep text and interactive indicators at a contrast ratio of at least 4.5:1 (3:1 for non-text indicators such as the selection checkmark and focus ring) in both light and dark themes.

| Key | Action |
| --- | --- |
| `Enter` | Triggers the item's primary action; when the item has a custom onAction that action runs, and when it does not, Enter toggles the selection of the focused item. |
| `Space` | Toggles the selection of the focused item when selectionMode is single or multiselect, even when a custom onAction is present. |
| `ArrowUp / ArrowDown` | Moves focus between list items when navigationMode is items or composite. |
| `ArrowRight` | Moves focus from the primary element of an item into its secondary actions; requires navigationMode to be set to composite. |
| `ArrowLeft` | Moves focus back out of the secondary actions toward the primary content of the item; requires navigationMode to be set to composite. |
| `Tab` | Moves focus into and out of the list as a single stop in composite mode; in items mode each item is navigated with the arrow keys rather than with Tab. |

**ARIA**: aria-label (on the List for the container name and on individual ListItems for per-row names), role="listbox" and role="option" on the container and items when selection is the item's only action, role="grid", role="row" and role="gridcell" when navigationMode is composite so that multi-action rows are announced as grid rows, aria-selected for the selected state of selectable items, aria-setsize and aria-posinset on ListItems in virtualized lists where only visible rows are mounted, tabIndex={0} on the List when it contains non-actionable items in a virtualized, scrollable list so the list itself can receive focus for scrolling

**Screen Reader**: Assistive technology sees the List as a single composite widget rather than a loose set of focusable elements: a non-selectable list is announced with its item count, a selectable list is announced as a listbox with a count of selected options, and a composite list is announced as a grid whose rows contain gridcells. Because focus moves programmatically between rows, screen readers announce each row's name, position and selection state as the user arrows through the list, and the container-level aria-label frames the whole set. When a row has a custom primary action, toggling selection with the Space key announces the state change, while Enter is reserved for the primary action, so both behaviors must be narrated accurately. In virtualized lists, aria-setsize and aria-posinset are what allow a screen reader to say "row 42 of 500" even though only the visible rows exist in the DOM.

## Styling

List itself is deliberately unstyled beyond layout, so most customization happens on the List root's className, where you can set background with tokens.colorNeutralBackground1, padding with spacing tokens such as tokens.spacingVerticalS and tokens.spacingHorizontalM, a border with tokens.colorNeutralStroke1 and a radius with tokens.borderRadiusMedium. Row-level styling belongs on ListItem: use :hover with tokens.colorNeutralBackground1Hover, selected states with tokens.colorNeutralBackground1Selected, pressed feedback with tokens.colorNeutralBackground1Pressed, primary text with tokens.colorNeutralForeground1, and secondary or metadata text with tokens.colorNeutralForeground2. Compose styles with makeStyles or makeResetStyles and merge classes conditionally with mergeClasses based on whether the item is in selectedItems, as the active-element story does to highlight the focused row and its Persona. The checkmark slot can be suppressed by passing null on ListItem when you want selection without the built-in indicator and prefer your own visual treatment, and the entire row can be turned into a card-like surface by adding background, border and spacing tokens to the ListItem className.

## Performance

List renders exactly the ListItems you hand it, so cost scales linearly with row count: above a few hundred rows, window the list with a library such as react-window and render rows inside the fixed-size list rather than asking List to do the work. Keep the row content light, memoize row components, and wrap onSelectionChange and onAction in useCallback so a single toggled checkmark does not re-render every row. Key each ListItem by a stable identifier (not by index) so reordering does not force remounts. When selection changes frequently, consider storing only the selected ids and letting each row derive its own selected state, and avoid creating new object or array props on every render. Virtualization trades DOM count for correctness requirements: you must supply aria-setsize and aria-posinset, and add tabIndex={0} on the List when the virtualized rows are non-actionable so the container itself can receive focus and scroll with the keyboard.

## Theming & Tokens

List and ListItem consume Fluent theme tokens, so they respond automatically to FluentProvider and to custom themes passed to it. Row hover, selected and pressed states map to tokens such as tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Selected and tokens.colorNeutralBackground1Pressed, while primary content uses tokens.colorNeutralForeground1 and secondary or metadata content uses tokens.colorNeutralForeground2. Focus rings draw from tokens.colorStrokeFocus2 and tokens.colorStrokeFocus1, borders and dividers from tokens.colorNeutralStroke1 or tokens.colorNeutralStroke2, and spacing and radius from tokens.spacingVerticalS, tokens.spacingHorizontalM and tokens.borderRadiusMedium. Because these are the same tokens used by the rest of Fluent UI React v9, brand or high-contrast themes applied at the provider level flow into the list without per-component overrides; if you introduce custom row styles, express them with the same tokens rather than hard-coded colors so they keep working in dark, high-contrast and brand variants.

## Migration Notes

In v9 the list is fully composable: instead of a data-driven API that took an array of items and callbacks, List is a container component and ListItem is a child, so you render rows declaratively. Selection is now a first-class concern on List through selectionMode (defaulting to multiselect), selectedItems, defaultSelectedItems and onSelectionChange, and keyboard traversal is configured with navigationMode (items or composite) rather than being implicit. Virtualization is no longer built into the component; long lists are windowed with a third-party library such as react-window, and you are responsible for supplying aria-setsize and aria-posinset on each rendered ListItem. Row-level behaviors that used to be configuration on the list (a primary action, a custom checkmark, disabled selection) now live on ListItem itself as onAction, checkmark and disabledSelection.

## Edge Cases

- selectionMode defaults to multiselect; if you pass selectedItems without an explicit selectionMode you get multi-select behavior, which is often not what a master-detail layout intends.
- In virtualized lists, aria-setsize and aria-posinset must be set manually on each ListItem because off-screen rows are unmounted; DOM-derived counts are wrong.
- Virtualized lists of non-actionable items need tabIndex={0} on the List so the container can take focus and be scrolled with the keyboard.
- A custom onAction on a ListItem replaces the default behavior for click and Enter; call event.preventDefault() inside it to stop the selection from toggling, and note that Space still toggles selection.
- When navigationMode is composite, every direct child of a ListItem must carry role gridcell and each focusable control should live in its own gridcell for correct screen reader behavior.
- Focus events bubble from nested content, so an onFocus handler on a ListItem must check event.target against event.currentTarget before updating the active item.
- The visible checkmark can be removed with checkmark={null} on ListItem when selection should be communicated by row styling instead of the built-in indicator.
- disabledSelection prevents toggling a row while leaving it focusable and readable, which is useful for read-only rows inside an otherwise selectable list.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
