# List

> **Package**: `@fluentui/react-list` v9.6.15
> **Import**: `import { List } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

List is the Fluent UI React v9 container for rendering a collection of ListItem children as a vertical, composite-friendly, optionally selectable list. It is intentionally minimal: List itself is a layout and interaction coordinator rather than a data renderer, meaning items are authored as real children instead of being generated from an items array. The component owns selection semantics (selectionMode, selectedItems, defaultSelectedItems, onSelectionChange) and keyboard navigation semantics (navigationMode, which can be "items" for one focusable target per item or "composite" for items that contain several focusable targets). Selection identity is taken from each ListItem's value, and ListItem exposes its own affordances such as onAction for a primary activation, checkmark for the selection indicator (which can be suppressed with checkmark={null}), disabledSelection for keeping an item visible but unselectable, and full passthrough of standard HTML and ARIA attributes such as aria-label, aria-setsize, aria-posinset, data-value, className and style. Because List is largely unstyled out of the box, teams pair it with Persona, Text, Button and Griffel styles (makeStyles, makeResetStyles, mergeClasses) or with an external virtualizer such as react-window for very large collections. List renders a single root slot, which is the element that receives the list-level role, className and style.

**When to use**: Use List when you need to present a homogeneous, vertically stacked set of items where each item is either a single action (selection or a custom action) or a small cluster of related actions on the same row — for example a people picker, a file or result list, or an inbox-style row with a primary action plus secondary icon buttons. Choose List over Table when there are no column headers or column-wise comparison to make; choose List over Menu when the collection is persistent content rather than a transient command surface attached to a trigger; choose List over Combobox, Select or Dropdown when the items are always visible instead of revealed in a popup; and choose Tree when the data is hierarchical or expandable. Reach for List with navigationMode "items" when the whole row is one focus stop, and with navigationMode "composite" when a row contains multiple focusable controls (for example a Persona plus an inline icon Button) that must be reachable with arrow keys. Use the virtualized pattern when the collection is large enough that rendering every item hurts scrolling performance.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `defaultSelectedItems` | `SelectionItemId[] \| undefined` | — | No | — |
| `navigationMode` | `ListNavigationMode \| undefined` | — | No | — |
| `onSelectionChange` | `any` | — | No | — |
| `selectedItems` | `SelectionItemId[] \| undefined` | — | No | — |
| `selectionMode` | `any` | `'multiselect'` | No | — |

### Prop Guidance

- **navigationMode**: Controls how focus moves within the list. Use "items" when each list item is a single focus stop with one action, which also enables automatic keyboard navigation between items. Use "composite" when items contain more than one focusable element, so focus can descend into the item with ArrowRight and return with ArrowLeft; composite mode also switches the list to grid semantics, which then requires gridcell roles on each direct child of ListItem. `composite`
- **selectionMode**: Enables selection and defines whether one item ("single") or several items ("multiselect") can be selected. The documented default is "multiselect", so set it explicitly for clarity and to avoid accidentally shipping multi-selection. Enabling selection also enables keyboard navigation between items and switches item roles toward listbox and option semantics. `multiselect`
- **selectedItems**: The controlled list of selected item identities, typed as SelectionItemId and matched against each ListItem's value. Supply it together with onSelectionChange so the parent owns the state, and keep the values in sync with the item values present in the list. `An array of SelectionItemId values such as item names or ids`
- **defaultSelectedItems**: Sets the initial selection for an uncontrolled list. Use it for simple cases where the list manages its own state; entries that do not match any ListItem value are simply not reflected. Do not combine it with selectedItems on the same list. `An array of initial SelectionItemId values`
- **onSelectionChange**: Invoked whenever the selection changes, receiving the event plus a data object whose selectedItems property holds the new selection. Use it to update parent state in controlled mode, and note that the handler also runs for keyboard-driven changes (Space, and Enter when selection is the item's action). `Read data.selectedItems and store it in state`
- **root**: List renders a single root slot, which is the element that carries the collection role along with className, style and ARIA attributes such as aria-label. There is no separate items or content slot, so everything else is passed as ListItem children. `The list element that receives className and aria-label`
- **value (ListItem)**: The stable identity of a list item used by selection tracking. Set it to a unique, meaningful identifier rather than an array index so selection survives sorting, filtering and virtualization. `A person's name or a record id`
- **onAction (ListItem)**: Defines the item's primary action, fired when the user clicks the item or presses Enter; the originating event is available on the callback's event details. Call preventDefault inside the handler when the custom action should replace the default selection toggle. `Open details for the clicked row instead of toggling selection`
- **checkmark (ListItem)**: Controls the selection indicator rendered inside the item. It accepts configuration such as an aria-label for announcing the toggle, and can be set to null to remove the built-in checkmark when you provide your own selection styling or place selection in a different visual location. `null to suppress the built-in checkmark`
- **disabledSelection (ListItem)**: Keeps an item visible and readable while preventing its selection. Use it when some entries in the collection are not eligible, and make sure the visual treatment communicates that they are not selectable. `true for the last rows of a list that cannot be selected`
- **aria-label (ListItem)**: Names the item for assistive technology when its visible content is not a sufficient label, for example when the row contains a Persona plus other cells. Combine it with a matching label on the checkmark so the toggle is announced meaningfully. `A person's name`
- **aria-setsize and aria-posinset (ListItem)**: Required when the list is virtualized, because only visible rows are mounted and the browser cannot infer total size or position. Set the total count and the one-based position of each rendered row manually. `Total item count and index plus one`

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

- Give every ListItem a stable, unique value whenever the list is selectable, because selection identity in selectedItems, defaultSelectedItems and the onSelectionChange payload is derived from that value.
- Choose selectionMode explicitly as either "single" or "multiselect" rather than relying on the documented "multiselect" default, so the interaction contract of the list is obvious in the source.
- Prefer the controlled pair of selectedItems plus onSelectionChange for production lists, as shown by the active-element and controlled-selection samples, and reserve defaultSelectedItems for simple uncontrolled cases.
- Set navigationMode to "items" when each list item has exactly one action, and to "composite" when items contain multiple focusable controls so that RightArrow and LeftArrow move into and out of the inner controls.
- Provide an accessible name for the list through aria-label (for example "People example") whenever items are announced as options or rows.
- When composite navigation produces grid semantics, give every direct child of ListItem the gridcell role and keep each focusable element in its own gridcell so screen readers narrate the row correctly.
- Label icon-only controls inside a ListItem with aria-label, as the mute-button example does, so the action is meaningful out of context.
- Use ListItem's onAction together with the checkmark and disabledSelection props when an item needs a primary action that differs from selection, calling preventDefault in the handler when the default selection toggle should be suppressed.
- Keep selection visual feedback visible in every theme by styling selected rows with semantic tokens instead of hard-coded colors.
- In virtualized lists, set aria-setsize and aria-posinset manually on each rendered ListItem and give the scrollable element a tabIndex of 0 when the list is not otherwise actionable.

### Don'ts

- Don't place interactive controls inside a ListItem without switching navigationMode to "composite"; otherwise the inner controls are not reachable with arrow keys and the interaction model becomes inconsistent.
- Don't use List for tabular or column-comparison data — Table exists for that and provides the header, sorting and grid semantics users expect.
- Don't pass both defaultSelectedItems and selectedItems to the same list, since mixing uncontrolled and controlled selection produces surprising, hard-to-debug state.
- Don't add the grid role to a list without giving each direct child of ListItem the gridcell role, as this breaks screen reader navigation inside rows.
- Don't rely on DOM position for aria-posinset and aria-setsize in a virtualized list, because only the visible items are mounted.
- Don't use array indices as ListItem value; use a stable identifier so selection survives reordering, filtering or lazy loading.
- Don't remove or restyle away the focus indicator when overriding item styles, because keyboard users depend on it for orientation.
- Don't suppress the built-in checkmark with checkmark={null} unless you deliberately replace the selection indication with your own styles and selection state is still announced.
- Don't assume selection works when items have no value; without values there is no identity for the list to track.
- Don't handle selection purely with a click or focus handler on ListItem when selectedItems and onSelectionChange already express the intent, unless you intentionally want focus-driven preview behavior like the active-element sample.

## Anti-Patterns

### Multi-action rows without composite navigation

❌ Putting a Button or other focusable control inside a ListItem while navigationMode stays on "items" leaves the inner control unreachable by arrow keys, and the item no longer behaves like a single focus stop either, so keyboard users cannot reliably operate the row.

✅ Set navigationMode to "composite" for any item that contains more than one focusable element, and remember that composite mode produces grid semantics, so each direct child of the ListItem needs a gridcell role and each focusable element should live in its own gridcell.

### Mixing controlled and uncontrolled selection

❌ Passing both selectedItems and defaultSelectedItems, or passing selectedItems without onSelectionChange, makes the displayed selection diverge from the state the consumer believes it owns, producing items that appear stuck selected or that refuse to clear.

✅ Pick one model. For controlled lists, supply selectedItems and update it from onSelectionChange, as in the controlled selection and active-element samples. For simple uncontrolled lists, supply only defaultSelectedItems and let the list manage state.

### Using a List as a data table

❌ Rendering columnar, comparable data as list rows forces authors to hand-build grid roles, and users lose the table semantics, headers and navigation they expect for tabular content.

✅ Use the Table component for tabular data with headers and columns, and reserve List for homogeneous rows whose content is narrative or action-oriented rather than comparative.

### Hand-rolled selection through click handlers

❌ Tracking selection by attaching onClick or focus handlers to each ListItem duplicates the built-in model, misses keyboard activation paths, and leaves screen readers without a programmatically determinable selected state.

✅ Drive selection through selectionMode, selectedItems and onSelectionChange, and rely on ListItem's value for identity. Only add extra event handlers when you deliberately want a preview-style behavior, and then guard against bubbled events from nested content by comparing event.target with event.currentTarget.

### Virtualizing without set size and position

❌ A virtualized list mounts only the visible rows, so position and total count inferred from the DOM are wrong, and assistive technology announces misleading item counts and positions.

✅ Set aria-setsize to the full collection length and aria-posinset to the one-based index of each rendered row on every ListItem the virtualizer creates, and give the scroll container a tabIndex of 0 when the rows are not actionable so keyboard users can scroll it.

### Removing the checkmark without replacing the cue

❌ Setting checkmark to null hides the only built-in visual indication of selection, leaving users unable to tell which rows are selected.

✅ When you suppress the checkmark, apply your own selected styling keyed off selectedItems, as the active-element sample does with a merged selected class, so the selected state remains both visible and programmatically announced.

## Accessibility

**Requirements**: List must satisfy the keyboard and name/role/value requirements of WCAG 2.1: every actionable item must be reachable and operable from the keyboard (2.1.1), the list must expose an accessible name via aria-label or an associated label (4.1.2), selection state must be programmatically determinable (4.1.2 and 1.3.1), and any custom hover or selection styling must retain sufficient contrast (1.4.3) plus a visible focus indicator (2.4.7). Structure must reflect the interaction model: a list whose only action is selection should surface listbox and option roles, while a composite list with several focusable elements per row surfaces grid, row and gridcell roles. When only part of a collection is rendered, aria-setsize and aria-posinset must be provided manually so assistive technology can announce position within the full set.

| Key | Action |
| --- | --- |
| `Enter` | Triggers the list item's primary action. When a custom onAction is supplied it fires that callback; when selection is the item's only action, Enter toggles the selection. |
| `Space` | Toggles selection of the focused list item when the item supports selection, even if a custom primary action is bound to Enter. |
| `ArrowDown` | Moves focus to the next list item when keyboard navigation is enabled through navigationMode. |
| `ArrowUp` | Moves focus to the previous list item when keyboard navigation is enabled through navigationMode. |
| `ArrowRight` | In navigationMode "composite", moves focus from the list item into its inner focusable elements, such as an inline secondary button. |
| `ArrowLeft` | In navigationMode "composite", moves focus back out of the inner elements of a list item to the item itself. |
| `Tab` | Moves focus into or out of the list as a single stop when a roving focus model is in effect, so users do not have to tab through every item. |

**ARIA**: aria-label, aria-selected, aria-setsize, aria-posinset, role (listbox, option, grid, row, gridcell), checkmark aria-label

**Screen Reader**: Screen readers announce the list container using the role that matches the interaction model. A selectable list where selection is the item's only action is exposed as listbox with option children, so focus lands on an option and the selected state is announced when Space or Enter toggles it. When the list has multiple actions per row and navigationMode is "composite", the container is exposed as a grid whose rows are list items and whose direct children are gridcells, letting users navigate cells with the arrow keys while the row keeps the selection context. Selection changes raised through onSelectionChange are announced because the selected state is carried on the focused option or row rather than on a separate control. Standard attributes forwarded to ListItem, such as aria-label, aria-setsize and aria-posinset, are read by assistive technology to name the item and to describe its position in large or virtualized collections, and controls nested inside an item need their own label so their purpose is not lost.

## Styling

List ships with almost no visual styling, so plan on styling items yourself with makeStyles or makeResetStyles and compose variants with mergeClasses, exactly as the samples do by merging a base item class with a selected item class. Space rows with tokens.spacingVerticalS or tokens.spacingVerticalMNudge and inset content with tokens.spacingHorizontalM, round the item with tokens.borderRadiusMedium, and express interaction states with semantic tokens: tokens.colorNeutralBackground1Hover for hover, tokens.colorNeutralBackground1Selected for selected rows, tokens.colorBrandBackground2 or tokens.colorBrandBackgroundInvertedSelected when you want a brand-tinted selection, tokens.colorNeutralForeground1 and tokens.colorNeutralForeground2 for primary and secondary text, and tokens.colorNeutralForegroundDisabled for items kept visible but unselectable. Focus styling should use tokens.colorStrokeFocus2 with tokens.strokeWidthThin so the ring matches the rest of the system. Text inside items can be styled by passing a class to the Text component, and ListItem accepts className, style and data attributes so you can attach data-value and drive styles from it. When you use an external virtualizer, forward its inline row style onto ListItem so heights stay in sync.

## Performance

List is a light wrapper: it adds no per-item DOM of its own, so rendering cost is dominated by the content inside each ListItem (Persona, avatars and images are the usual heavy contributors). Memoize ListItem children and their props where possible, keep selection callbacks stable with useCallback so onSelectionChange identity does not force re-renders of every row, and avoid computing derived data inside each item's render. For long collections, use virtualization with an external library such as react-window's fixed-size list, rendering each ListItem with the virtualizer-provided inline style; this is the recommended approach for large data sets. Virtualization shifts responsibilities: scrolling for non-actionable lists should be enabled with a tabIndex of 0 on the list element, aria-setsize and aria-posinset must be set manually on each row, and interactive rows continue to work because ListItem's own action handling is independent of the virtualizer.

## Theming & Tokens

List resolves its appearance through the FluentProvider theme, so anything you style should use Griffel tokens rather than literal colors. Hover and pressed feedback use tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed; selection uses tokens.colorNeutralBackground1Selected, with tokens.colorBrandBackground2 or tokens.colorBrandBackgroundInvertedSelected when a brand accent is desired for the selected row. Text and secondary text follow tokens.colorNeutralForeground1 and tokens.colorNeutralForeground2, unselectable items use tokens.colorNeutralForegroundDisabled, and the selection checkmark borders and glyphs are drawn from neutral stroke and brand foreground tokens such as tokens.colorNeutralStroke1, tokens.colorStrokeFocus2 and tokens.colorBrandForeground1. Focus rings built with tokens.colorStrokeFocus2 and tokens.strokeWidthThin adapt automatically to light, dark and high-contrast themes, whereas hard-coded hex values break in dark mode and in forced-colors scenarios. Layout tokens such as tokens.spacingVerticalS, tokens.spacingHorizontalM and tokens.borderRadiusMedium keep row rhythm consistent with the rest of the design system, and mergeClasses lets you blend your own token-based classes with the item's built-in classes deterministically.

## Migration Notes

The Fluent UI React v9 List is composition-based rather than data-driven. Where earlier stacks rendered a collection by passing an array of items to the list and letting it call a render callback per row, v9 expects ListItem children to be authored directly inside List, which means item content is plain JSX (Persona, Text, Button, custom components) rather than template output. Selection moved to the property pair selectedItems plus defaultSelectedItems, with changes reported through onSelectionChange using SelectionItemId values taken from each ListItem's value instead of the older Selection and selection utility objects. The built-in checkmark is now a ListItem affordance that renders by default and can be replaced or suppressed with checkmark={null}, and per-item opt-outs such as disabledSelection are expressed as props rather than through item metadata. Keyboard behavior is configured declaratively with navigationMode instead of being inferred, and virtualization is no longer part of the component: large collections are rendered with an external virtualizer, which shifts responsibility for aria-setsize and aria-posinset onto the author.

## Edge Cases

- Focus events bubble from descendants, so an onFocus handler placed on a ListItem also fires when a nested control receives focus. Compare event.target with event.currentTarget before treating the event as item-level focus, exactly as the active-element sample does.
- Items marked with disabledSelection stay visible and focusable but cannot be toggled, so they should be visually de-emphasized to avoid the impression that the control is broken.
- Virtualized lists must set aria-setsize and aria-posinset manually on every rendered row because only visible items exist in the DOM; relying on the DOM for those values produces incorrect announcements.
- Non-actionable virtualized lists need a tabIndex of 0 on the scroll container so keyboard-only users can scroll through the content.
- Entries in defaultSelectedItems that do not match any ListItem value are silently ignored, which can look like selection is broken rather than like a value mismatch.
- Suppressing the checkmark with checkmark={null} removes the default visual selection cue, so the selected state must be conveyed through custom styling, otherwise sighted users cannot distinguish selected rows.
- Because selection identity comes from each ListItem's value, a selectable list whose items omit value has nothing to track and selection will not behave as expected.
- The documented selectionMode default is "multiselect", so a list that never sets selectionMode may behave as multi-select rather than as a plain read-only list; set the mode explicitly whenever selection semantics matter.
- In composite mode the list adopts grid semantics, and any direct child of a ListItem that is not given a gridcell role will confuse screen reader users navigating the row.
- ListItem's value accepts a selection item id type, and mixing numeric and string identifiers in the same list makes equality checks subtle, so keep identifier types consistent across the collection.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
