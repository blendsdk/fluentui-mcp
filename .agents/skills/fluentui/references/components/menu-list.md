# MenuList

> **Package**: `@fluentui/react-menu` v9.25.0
> **Import**: `import { MenuList } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

MenuList is the vertical container that renders a collection of menu items and coordinates their selection state. It is the structural heart of every Fluent UI React v9 menu: a MenuPopover hosts a MenuList, and MenuItem, MenuItemCheckbox, MenuItemRadio, MenuGroup, MenuDivider and nested Menu elements are placed inside it as children. Beyond layout, MenuList acts as the shared state owner for selectable items — it accepts a checkedValues map keyed by the name given to each MenuItemCheckbox or MenuItemRadio, an optional defaultCheckedValues map for uncontrolled usage, an onCheckedValueChange callback fired whenever a value in a named group toggles, and the hasCheckmarks and hasIcons flags that reserve leading slot space so every row in the list aligns consistently. MenuList renders a single root slot and therefore accepts className, style and standard HTML container attributes through that root, which lets it be embedded both in transient surfaces such as MenuPopover and in permanent surfaces such as a custom popover dialog or a side panel.

**When to use**: Use MenuList whenever you are authoring a menu — it is the required wrapper for MenuItem, MenuItemCheckbox, MenuItemRadio, MenuGroup, MenuGroupHeader, MenuDivider and nested Menu elements. Reach for MenuList when the item collection is persistent or authored as JSX and you want Fluent's keyboard navigation, type-then-arrow roving focus and item alignment handled for you. Use it with checkedValues and onCheckedValueChange when several actions should be independently togglable, or with MenuItemRadio when exactly one option in a named group should be active. Prefer a standalone (permanent) MenuList when embedding a menu inside a custom temporary surface you control, and prefer the Menu plus MenuTrigger plus MenuPopover composition when the list should appear anchored to a button or another item. For non-menu collections of links or navigation destinations, use Nav, NavItem, List or Dropdown instead, since those expose different semantics (navigation landmarks or listbox) than the menu pattern.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `checkedValues` | `Record<string, string[]> \| undefined` | — | No | Map of all checked values |
| `defaultCheckedValues` | `Record<string, string[]> \| undefined` | — | No | Default values to be checked on mount |
| `hasCheckmarks` | `boolean \| undefined` | — | No | States that menu items can contain selectable items and reserve slots for item alignment |
| `hasIcons` | `boolean \| undefined` | — | No | States that menu items can contain icons and reserve slots for item alignment |
| `onCheckedValueChange` | `((e: MenuCheckedValueChangeEvent, data: MenuCheckedValueChangeData) => void) \| undefined` | — | No | Callback when checked items change for value with a name |

### Prop Guidance

- **checkedValues**: Controlled selection state for the whole list. It is a record whose keys are the name props given to MenuItemCheckbox and MenuItemRadio items and whose values are arrays of the selected value strings for that name. Pass it together with onCheckedValueChange so the menu can report toggles and you can store the updated map in state. Omit it entirely if the list does not need selectable items. `A record with the key edit mapped to an array containing cut and paste, matching the name and value props of the checkbox items`
- **defaultCheckedValues**: Use for uncontrolled menus where the initial selection is enough and no external component needs to read or reset it. The map is only read on mount, so later prop changes are ignored; if the selection must be driven from outside, switch to checkedValues. `A record with the key font mapped to an array containing calibri to preselect that radio option on first render`
- **hasCheckmarks**: Set to true when the list contains MenuItemCheckbox or MenuItemRadio items so that a leading slot is reserved on every row and labels line up whether or not a check is shown. Leave it false (or omit it) for lists of plain MenuItem rows to avoid unnecessary empty space. `true`
- **hasIcons**: Set to true when any item in the list renders an icon so the icon column is reserved for all rows and text does not shift between items. It is independent of hasCheckmarks, so a list with both icons and checkboxes sets both to true, and the two reserved slots stack in the expected order. `true`
- **onCheckedValueChange**: Callback invoked when a selectable item toggles. It receives the change event and a data object containing the name of the affected group and the array of currently checked items for that group, which is the value you store back into checkedValues. Provide a stable handler (for example one created with use callback or defined outside the render loop over items) and always pair it with checkedValues for controlled menus. `A handler that reads name and checkedItems from the data argument and writes them into the checkedValues state map under that name`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, tokens, MenuList, MenuItem } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  const styles = useMenuListContainerStyles();
  return (
    <div className={styles.container}>
      <MenuList>
        <MenuItem>Cut</MenuItem>
        <MenuItem>Paste</MenuItem>
        <MenuItem>Edit</MenuItem>
      </MenuList>
    </div>
  );
};
```

### CheckboxItems

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { MenuList, MenuItemCheckbox, makeStyles, tokens } from '@fluentui/react-components';

export const CheckboxItems = (): JSXElement => {
  const styles = useMenuListContainerStyles();

  return (
    <div className={styles.container}>
      <MenuList>
        <MenuItemCheckbox icon={<CutIcon />} name="edit" value="cut">
          Cut
        </MenuItemCheckbox>
        <MenuItemCheckbox icon={<PasteIcon />} name="edit" value="paste">
          Paste
        </MenuItemCheckbox>
        <MenuItemCheckbox icon={<EditIcon />} name="edit" value="edit">
          Edit
        </MenuItemCheckbox>
      </MenuList>
    </div>
  );
};
```

### ControlledCheckboxItems

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { MenuList, MenuItemCheckbox, makeStyles, tokens } from '@fluentui/react-components';
import type { MenuProps } from '@fluentui/react-components';

export const ControlledCheckboxItems = (): JSXElement => {
  const styles = useMenuListContainerStyles();
  const [checkedValues, setCheckedValues] = React.useState<Record<string, string[]>>({ edit: ['cut', 'paste'] });
  const onChange: MenuProps['onCheckedValueChange'] = (e, { name, checkedItems }) => {
    setCheckedValues(s => {
      return s ? { ...s, [name]: checkedItems } : { [name]: checkedItems };
    });
  };

  return (
    <div className={styles.container}>
      <MenuList checkedValues={checkedValues} onCheckedValueChange={onChange}>
        <MenuItemCheckbox icon={<CutIcon />} name="edit" value="cut">
          Cut
        </MenuItemCheckbox>
        <MenuItemCheckbox icon={<PasteIcon />} name="edit" value="paste">
          Paste
        </MenuItemCheckbox>
        <MenuItemCheckbox icon={<EditIcon />} name="edit" value="edit">
          Edit
        </MenuItemCheckbox>
      </MenuList>
    </div>
  );
};
```

## Best Practices

### Do's

- Give every selectable child a name and a value (MenuItemCheckbox and MenuItemRadio both require them) because MenuList keys its checkedValues record on the name and stores the value, not the visible label.
- Set hasCheckmarks to true whenever the list contains MenuItemCheckbox or MenuItemRadio items, and set hasIcons to true whenever any item has an icon, so the reserved leading slots keep all rows aligned.
- Choose controlled usage (checkedValues plus onCheckedValueChange) when the selection must persist across renders, be validated or be reset from outside the menu — the ControlledCheckboxItems and ControlledRadioItems stories show this pattern.
- Choose uncontrolled usage (defaultCheckedValues only) for simple menus whose selection can live entirely inside the menu, remembering the defaults are applied only on mount.
- Wrap the MenuList in a MenuPopover (or a Menu with MenuTrigger) so the list has an accessible anchored surface, correct focus management and dismissal behavior.
- Use MenuItemRadio for mutually exclusive choices in a named group and MenuItemCheckbox for independent toggles, rather than simulating radios with checkboxes.
- Keep the onCheckedValueChange handler stable with a use callback so that the handler identity does not change on every render and force the whole list to re-render.

### Don'ts

- Do not pass a checkedValues record whose keys do not match the name props of the items — unmatched keys silently do nothing and unmatched items render as permanently unchecked.
- Do not supply checkedValues without also supplying onCheckedValueChange; a controlled list with no change handler becomes read-only and confusing to users.
- Do not place arbitrary non-menu markup (headings, paragraphs, buttons, divs) directly inside MenuList — it breaks the menu role hierarchy and keyboard navigation; use MenuGroup plus MenuGroupHeader for grouping and MenuDivider for separators.
- Do not mix MenuItemCheckbox and MenuItemRadio items under the same name key, since checkbox toggling and radio replacement have different semantics and produce inconsistent arrays.
- Do not rely on hasCheckmarks or hasIcons for the visual appearance of an individual item; they only reserve space for alignment — the icon and the check indicator themselves come from the item's own props.
- Do not nest a second MenuList directly as a sibling without a nested Menu and MenuTrigger, because that produces two sibling menus in the same ARIA tree instead of a submenu.
- Do not style indentation or icon padding with ad-hoc margin on each item to fake alignment — the reserved slots from hasIcons and hasCheckmarks exist precisely to avoid that fragile approach.

## Anti-Patterns

### Controlled list with no change handler

❌ Passing checkedValues without onCheckedValueChange freezes the selection: the user can move focus and activate items but nothing appears to happen, and assistive technology keeps announcing the stale checked states.

✅ Always supply onCheckedValueChange alongside checkedValues and write the reported checkedItems back into state, or drop checkedValues entirely and use defaultCheckedValues for an uncontrolled menu.

### Name keys that do not match item names

❌ The checkedValues record is keyed on each item's name prop, not on its visible text or its value. A typo such as fonts instead of font produces a menu whose items never appear checked and whose change callback never fires for that group.

✅ Keep the keys of checkedValues and defaultCheckedValues in exact one-to-one correspondence with the name props on the MenuItemCheckbox and MenuItemRadio children, and use constants for names that are shared across several places.

### Non-menu content inside the list

❌ Placing headings, paragraphs, toolbars or plain divs directly inside MenuList breaks the menu role hierarchy, confuses arrow-key navigation and can make items unreachable for screen reader users.

✅ Use MenuGroup with MenuGroupHeader for sections, MenuDivider between groups, and MenuItem or MenuItemLink for anything activatable. If the content is not menu-like at all, use List, Nav or a Dialog instead of MenuList.

### Hand-rolled alignment instead of the reserved slots

❌ Adding per-item margins or padding to line up icons and checkmarks produces inconsistent spacing, breaks when an item lacks an icon, and fights the component's own Griffel styles.

✅ Set hasIcons and hasCheckmarks on MenuList to reserve the leading slots globally, and let every item flow into the same grid.

### Mixing checkbox and radio semantics under one name

❌ A single name key cannot sensibly be both an independently togglable set and a mutually exclusive choice, so arrays accumulate multiple values for a group the user perceives as a radio list.

✅ Give checkbox groups and radio groups distinct name values, and use MenuItemRadio exclusively for the mutually exclusive group.

## Accessibility

**Requirements**: MenuList and its children implement the WAI-ARIA menu pattern. The container must expose role menu, each child item must expose a menuitem-family role (menuitem for MenuItem, menuitemcheckbox for MenuItemCheckbox, menuitemradio for MenuItemRadio), and the list must be reachable and operable by keyboard alone with a visible focus indicator. Focus must be trapped in the menu surface while it is open and returned to the invoking trigger when it closes. When a MenuList is used in a permanent (non-popover) surface, provide an accessible name for the menu via aria-labelledby pointing at the visible heading or aria-label, since a bare menu without a name is announced ambiguously. Do not remove or override the focus outline; the focus indicator must meet the WCAG 2.1 non-text contrast requirement against adjacent colors.

| Key | Action |
| --- | --- |
| `ArrowDown` | Moves focus to the next item in the list, wrapping or stopping at the last item, and opens a focused submenu item's popup in some compositions. |
| `ArrowUp` | Moves focus to the previous item in the list. |
| `Home` | Moves focus to the first item in the list. |
| `End` | Moves focus to the last item in the list. |
| `Enter` | Activates the focused item: runs its action, toggles a MenuItemCheckbox, selects a MenuItemRadio, or opens the submenu when the item is a nested Menu trigger. |
| `Space` | Activates the focused item with the same result as Enter. |
| `ArrowRight` | Moves focus into an open submenu when the focused item is a nested Menu trigger. |
| `ArrowLeft` | Closes the current submenu and returns focus to its parent item in the parent MenuList. |
| `Escape` | Closes the menu popover (or the current submenu level) and returns focus to the element that opened it. |
| `Tab` | Moves focus out of the menu and dismisses the surrounding popover in transient menu compositions. |

**ARIA**: role="menu" on the MenuList root, role="menuitem" on MenuItem, role="menuitemcheckbox" with aria-checked on MenuItemCheckbox, role="menuitemradio" with aria-checked on MenuItemRadio, aria-disabled on disabled menu items, aria-haspopup="menu" and aria-expanded on a MenuItem that triggers a nested Menu, aria-labelledby or aria-label on a permanent MenuList that is not inside an anchored popover, aria-hidden on purely decorative icons rendered inside the item's icon slot

**Screen Reader**: A screen reader announces the menu container as a menu with the number of available items, then announces each focused item by its text content together with its role. MenuItemCheckbox items are announced as checkboxes with their checked or unchecked state, and MenuItemRadio items are announced as radio buttons with their state, so users can tell independent toggles from mutually exclusive choices. An item that opens a nested Menu is announced as having a submenu and, once expanded, as expanded with a submenu. Because MenuList uses roving focus, screen readers follow the DOM focus rather than a virtual cursor, so every interactive action must be reachable by arrow keys and Enter or Space. Decorative icons are hidden from the accessibility tree, so the item's visible text must be meaningful on its own.

## Styling

MenuList renders a single root slot, so apply a className directly to the component and use makeStyles with Griffel tokens rather than wrapping it. The container defaults to tokens.colorNeutralBackground1 for its surface, tokens.colorTransparentStroke for its thin border, tokens.borderRadiusMedium for rounding, tokens.shadow4 for elevation, and tokens.fontFamilyBase, tokens.fontSizeBase300 and tokens.lineHeightBase300 for typography and metrics. Common adjustments include tightening padding with tokens.spacingVerticalXS and tokens.spacingHorizontalXS, widening the list with a min-width token so long labels and checkmarks fit, and swapping the surface through tokens.colorNeutralBackground2 or tokens.colorNeutralBackground3 when the menu sits on a colored card. Prefer the hasIcons and hasCheckmarks props over per-item padding hacks to align leading slots; when you do need item-level tweaks, target MenuItem, MenuItemCheckbox and MenuItemRadio individually, remembering that their hover and focus states use tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed, tokens.colorNeutralBackground1Selected and tokens.colorStrokeFocus2 for the focus ring. The check indicator is tinted with tokens.colorCompoundBrandForeground1, and disabled rows use tokens.colorNeutralForegroundDisabled, so overriding those tokens in a theme is usually better than overriding the item styles.

## Performance

MenuList holds selection context that every descendant menu item consumes, so a change to checkedValues re-renders the list's items. Keep the checkedValues record and the onCheckedValueChange handler referentially stable — avoid constructing the record inline on every render and avoid defining the change handler inside a loop over items — so unrelated parent renders do not cascade into the whole menu. Prefer declaring the item children as static JSX rather than generating them with a map that recreates element types or inline callbacks per render, which defeats reconciliation. For long lists, split rarely changing item subsets into memoized child components. Because the list renders all children eagerly, do not mount thousands of items in one menu; paginate into groups, use a nested Menu for secondary actions, or move large option sets to a Combobox or Dropdown that virtualizes.

## Theming & Tokens

MenuList is fully token driven. Its container consumes tokens.colorNeutralBackground1 for the surface, tokens.colorTransparentStroke for the default thin border, tokens.borderRadiusMedium for corner rounding, tokens.shadow4 for elevation, and the type ramp tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.lineHeightBase300 and tokens.colorNeutralForeground1. Item-level states inside the list use tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed and tokens.colorNeutralBackground1Selected for interaction feedback, tokens.colorNeutralForeground1 for labels, tokens.colorNeutralForeground2 for secondary text such as submenu hints, tokens.colorNeutralForegroundDisabled and tokens.colorNeutralBackgroundDisabled for disabled rows, and tokens.colorStrokeFocus2 for the focus indicator. The checked indicator is tinted with tokens.colorCompoundBrandForeground1, so re-theming a FluentProvider brand ramp changes selection coloring across the menu. Spacing follows tokens.spacingVerticalXS, tokens.spacingVerticalSNudge and tokens.spacingHorizontalXS for item and container padding, and motion uses tokens.curveEasyEase with tokens.durationNormal. Overriding these tokens through a theme or a custom makeStyles class is preferred over hard-coded colors because the tokens resolve correctly in high-contrast and dark themes.

## Migration Notes

The v9 MenuList keeps the selection API from earlier versions — checkedValues, defaultCheckedValues, onCheckedValueChange, hasCheckmarks and hasIcons behave the same way they did in v8 — but the component is now composed through a single root slot with children-based JSX (MenuItem, MenuItemCheckbox, MenuItemRadio, MenuGroup, MenuDivider) and the className and style props are applied to that root. Legacy layout and orientation props such as the vertical flag and align-related props are not part of the v9 surface; v9 menus are vertical by default. If you are porting a menu that relied on item-factory or themeable-class styling, move the styling into makeStyles with Griffel tokens (for example tokens.colorNeutralBackground1 for the surface and tokens.spacingVerticalXS for padding) and keep using the checkedValues record shape, which is unchanged: a mapping from the item name to the array of selected values for that name.

## Edge Cases

- defaultCheckedValues is only honored on the first render; changing it later has no effect, so switching a menu from uncontrolled to controlled requires migrating to checkedValues.
- An item that has no name or no value cannot participate in selection — MenuItemCheckbox and MenuItemRadio both need a name for the checkedValues key and a value to store, and mismatches silently render as unselected.
- Radio groups behave as single-select per name; passing more than one value in the checkedValues array for a radio name produces a state that does not match the visual radio indicators.
- Nested menus do not inherit selection. A MenuList inside a nested MenuPopover has its own checkedValues scope, so a parent's checkedValues record never reaches the submenu's items.
- hasCheckmarks and hasIcons must be set for the whole list at once; toggling them at runtime changes the reserved slot layout for every item and causes a visible reflow of all labels.
- A MenuList rendered outside a MenuPopover has no automatic dismissal or accessible name, so it needs an explicit label such as aria-labelledby when used as a permanent surface.
- Disabled items remain in the DOM and are announced as disabled, but they do not fire onCheckedValueChange and are skipped by activation, so do not rely on them for state bookkeeping.
- Because item alignment depends on the reserved slots, mixing items with icons and items without icons in a list where hasIcons is false produces ragged text alignment.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
