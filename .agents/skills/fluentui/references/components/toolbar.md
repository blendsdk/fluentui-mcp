# Toolbar

> **Package**: `@fluentui/react-toolbar` v9.8.1
> **Import**: `import { Toolbar } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

Toolbar is a layout and state utility that arranges a set of related commands into a single, consistently spaced strip. It renders a root container (its only slot) into which you place ToolbarButton, ToolbarToggleButton, ToolbarRadioButton, ToolbarGroup, ToolbarDivider, and overflow-aware children, and it coordinates three behaviors that would otherwise be hand-rolled: sizing (a size prop that controls the padding around the controls, with small, medium, and large variants), orientation (a vertical boolean that stacks commands instead of laying them out horizontally), and checked-state management (checkedValues, defaultCheckedValues, and onCheckedValueChange, keyed by the name and value of each toggle or radio item). Because the checked state is a map of group name to selected string values, a single Toolbar can host several independent multi-select and single-select command clusters and report all of their changes through one callback. Toolbar is purely a container: it renders no visual chrome of its own, so appearance, labels, tooltips, menus, popovers, and overflow menus all come from the controls you place inside it.

**When to use**: Use Toolbar when a group of controls operates on the same target or context and should read as one unit: text formatting commands in an editor, alignment and layout controls for a canvas, zoom or view actions for a document, or a compact set of actions above a table or card. Toolbar is the right choice over a plain flex div full of buttons because it standardizes spacing and density through the size prop, provides a single callback for tracking checked values across many toggles and radio buttons, supports grouping and dividers for visual clustering, and can be combined with the Overflow component so commands collapse into an overflow menu as space runs out. Choose Toolbar when the controls are commands that mutate content or state. Choose Nav, Breadcrumb, or Tabs when the user is changing location or switching views, and use a single Button when there is exactly one action. Use a Menu alone when the whole set of actions should live behind one trigger rather than being visible.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `checkedValues` | `Record<string, string[]> \| undefined` | — | No | Map of all checked values |
| `defaultCheckedValues` | `Record<string, string[]> \| undefined` | — | No | Default values to be checked on mount |
| `onCheckedValueChange` | `((e: ToolbarCheckedValueChangeEvent, data: ToolbarCheckedValueChangeData) => void) \| undefined` | — | No | Callback when checked items change for value with a name |
| `size` | `"small" \| "medium" \| "large" \| undefined` | `medium` | No | Toolbar can have small or medium size |
| `vertical` | `boolean \| undefined` | `false` | No | Toolbar can be vertical styled |

### Prop Guidance

- **size**: Controls the padding around the toolbar's controls rather than the size of the controls themselves. Defaults to medium, which uses 4px vertical and 8px horizontal padding; small removes vertical padding and uses 4px horizontal padding for dense surfaces; large keeps 4px vertical padding and expands to 20px horizontal padding for roomier contexts. `small`
- **vertical**: Stacks the toolbar's children in a column instead of a row, and changes how padding is applied around the group. Use it for side rails, annotation palettes, or any narrow container. Note that this is a layout concern for the whole toolbar and is distinct from the per-button vertical option that stacks an icon above its text label. `true`
- **checkedValues**: The controlled map of checked state, keyed by the name given to each ToolbarToggleButton or ToolbarRadioButton, with an array of selected value strings per key. Provide it together with onCheckedValueChange and a local state store; each key corresponds to one independent selectable group, for example one key for multi-select formatting toggles and another for a single-select alignment radio group. `{ textOptions: ['bold', 'italic'] }`
- **defaultCheckedValues**: Use for an uncontrolled toolbar where the Toolbar owns the selection state. Supply the initial selection per group name and update state only through the Toolbar's own callback if you need to observe changes; do not combine it with checkedValues on the same toolbar. `{ textOptions: ['center'] }`
- **onCheckedValueChange**: The callback fired whenever a toggle or radio command changes, receiving the event and a data object with the group name and the newly checked items array for that group. Use it to merge the new array back into your checkedValues state keyed by name, and wrap it in a stable callback so large toolbars do not re-render unnecessarily. `(event, data) => setCheckedValues(state => ({ ...state, [data.name]: data.checkedItems }))`
- **aria-label**: Required in practice on the Toolbar root. It names the toolbar for assistive technology and gives the strip context, such as the region or content the commands affect. Every documented example passes it. `with Tooltip`
- **className / style**: Both pass through to the single root slot, making them the supported way to add borders, backgrounds, radii, and container-level sizing around the strip of commands without styling individual children. `className={styles.toolbar}`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import type { ToolbarProps } from '@fluentui/react-components';

export const Default = (props: Partial<ToolbarProps>): JSXElement => (
  <Toolbar aria-label="Default" {...props}>
    <ToolbarButton aria-label="Increase Font Size" appearance="primary" icon={<FontIncrease24Regular />} />
    <ToolbarButton aria-label="Decrease Font Size" icon={<FontDecrease24Regular />} />
    <ToolbarButton aria-label="Reset Font Size" icon={<TextFont24Regular />} />
    <ToolbarDivider />
    <Menu>
      <MenuTrigger>
        <ToolbarButton aria-label="More" icon={<MoreHorizontal24Filled />} />
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          <MenuItem>New </MenuItem>
          <MenuItem>New Window</MenuItem>
          <MenuItem disabled>Open File</MenuItem>
          <MenuItem>Open Folder</MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  </Toolbar>
);
```

### ControlledToggleButton

```tsx
import * as React from 'react';
import type { JSXElement, ToolbarProps } from '@fluentui/react-components';
import { TextBold24Regular, TextItalic24Regular, TextUnderline24Regular } from '@fluentui/react-icons';
import { Toolbar, ToolbarToggleButton } from '@fluentui/react-components';

export const ControlledToggleButton = (): JSXElement => {
  const [checkedValues, setCheckedValues] = React.useState<Record<string, string[]>>({
    textOptions: ['bold', 'italic'],
  });
  const onChange: ToolbarProps['onCheckedValueChange'] = (e, { name, checkedItems }) => {
    setCheckedValues(s => {
      return s ? { ...s, [name]: checkedItems } : { [name]: checkedItems };
    });
  };

  return (
    <Toolbar aria-label="with controlled Toggle Button" checkedValues={checkedValues} onCheckedValueChange={onChange}>
      <ToolbarToggleButton aria-label="Bold" icon={<TextBold24Regular />} name="textOptions" value="bold" />
      <ToolbarToggleButton aria-label="Italic" icon={<TextItalic24Regular />} name="textOptions" value="italic" />
      <ToolbarToggleButton
        aria-label="Underline"
        icon={<TextUnderline24Regular />}
        name="textOptions"
        value="underline"
      />
    </Toolbar>
  );
};
```

### FarGroup

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles } from '@fluentui/react-components';
import { FontIncreaseRegular, FontDecreaseRegular, TextFontRegular } from '@fluentui/react-icons';
import { Toolbar, ToolbarButton, ToolbarDivider, ToolbarGroup } from '@fluentui/react-components';
import type { ToolbarProps } from '@fluentui/react-components';

export const FarGroup = (props: Partial<ToolbarProps>): JSXElement => {
  const farGroupStyles = useStyles();
  return (
    <Toolbar aria-label="with Separeted Groups" {...props} className={farGroupStyles.toolbar}>
      <ToolbarGroup role="presentation">
        <ToolbarButton aria-label="Increase Font Size" appearance="primary" icon={<FontIncreaseRegular />} />
        <ToolbarButton aria-label="Decrease Font Size" icon={<FontDecreaseRegular />} />
        <ToolbarButton aria-label="Reset Font Size" icon={<TextFontRegular />} />
        <ToolbarDivider />
        <ToolbarButton aria-label="Increase Font Size" appearance="primary" icon={<FontIncreaseRegular />} />
        <ToolbarButton aria-label="Decrease Font Size" icon={<FontDecreaseRegular />} />
        <ToolbarButton aria-label="Reset Font Size" icon={<TextFontRegular />} />
      </ToolbarGroup>
      <ToolbarGroup role="presentation">
        <ToolbarButton aria-label="Increase Font Size" appearance="primary" icon={<FontIncreaseRegular />} />
        <ToolbarButton aria-label="Decrease Font Size" icon={<FontDecreaseRegular />} />
        <ToolbarButton aria-label="Reset Font Size" icon={<TextFontRegular />} />
      </ToolbarGroup>
    </Toolbar>
  );
};
```

## Best Practices

### Do's

- Always give the Toolbar an accessible name with aria-label that describes what the commands act on, such as the toolbar's purpose or target region.
- Give every icon-only ToolbarButton, ToolbarToggleButton, ToolbarRadioButton, and ToolbarOverflowButton its own aria-label so each command is individually identifiable.
- Provide both name and value on ToolbarToggleButton and ToolbarRadioButton items so the Toolbar can read and write their state through checkedValues.
- Pick the size variant that matches the density of the surrounding surface: small for dense or embedded surfaces, medium as the default, large for roomy headers and prominent editors.
- Separate visually distinct command clusters with ToolbarDivider or ToolbarGroup instead of relying on whitespace, and mark decorative groups with role="presentation" so they are not announced.
- Choose one state model per checked group: defaultCheckedValues for uncontrolled toolbars, or checkedValues together with onCheckedValueChange for controlled toolbars.
- When the toolbar may be rendered in a narrow container, use the Overflow component together with ToolbarOverflowButton, ToolbarOverflowDivider, and an OverflowMenu whose itemIds mirror the overflowId and group structure of the children.
- Attach a Tooltip to icon-only commands with relationship="description" so sighted users get the command name that screen readers already receive from aria-label.
- Use the vertical boolean on the Toolbar when the command strip itself should stack, and the per-button vertical option only when you want an icon stacked above a text label inside one button.

### Don'ts

- Don't render a Toolbar without an accessible name; an unlabeled toolbar is announced as an unnamed group of controls with no context.
- Don't pass checkedValues without also passing onCheckedValueChange, because the toggle and radio states will appear frozen and never reflect user input.
- Don't combine defaultCheckedValues with checkedValues on the same toolbar; mixing uncontrolled defaults and a controlled map makes the source of truth ambiguous.
- Don't leave icon-only commands inside a Toolbar without an aria-label or an accompanying Tooltip; the icon alone conveys nothing to assistive technology.
- Don't use a Toolbar to switch pages, routes, or top-level views; that is the job of navigation components such as Nav, Breadcrumb, or Tabs.
- Don't cram unrelated actions into one flat toolbar; split them into ToolbarGroup clusters or move secondary actions into a Menu.
- Don't add ToolbarOverflowButton children without the Overflow wrapper, unique overflowId values, and a matching OverflowMenu itemIds list, since an unwired overflow item simply disappears from the layout.
- Don't set the toolbar-level vertical boolean expecting a horizontal toolbar's buttons to stack their icon and label; that is a different, per-button concern.

## Anti-Patterns

### Unnamed toolbar

❌ Rendering a Toolbar without aria-label leaves screen reader users with an anonymous group of controls; when several toolbars exist on a page, they cannot be told apart or skipped reliably.

✅ Always pass aria-label on the Toolbar root describing what the commands act on, and additionally label every icon-only command inside it.

### Half-controlled checked state

❌ Passing checkedValues without onCheckedValueChange makes the toolbar render as permanently read-only, while passing onCheckedValueChange without updating the state you feed back into checkedValues makes toggles snap back immediately. Supplying both defaultCheckedValues and checkedValues muddles which value wins.

✅ Pick one model: uncontrolled with defaultCheckedValues, or controlled with checkedValues plus a handler that merges the returned checkedItems into your own state keyed by name.

### Toolbar used as navigation

❌ Using a Toolbar to switch routes, pages, or top-level application sections applies command semantics to what is really navigation, producing a confusing accessibility tree and losing the selected-tab and landmark cues that navigation components provide.

✅ Use Nav, Breadcrumb, or Tabs for moving between locations, and reserve Toolbar for commands that act on the current content or view.

### Orphaned overflow items

❌ Adding ToolbarOverflowButton and ToolbarOverflowDivider children without wrapping the toolbar in the Overflow component, without unique overflowId values, or without a matching OverflowMenu itemIds structure means those commands never render, either inline or in the overflow menu.

✅ Compose the overflow example faithfully: wrap the Toolbar in Overflow, give each overflow child a unique overflowId and a consistent overflowGroupId, and list every id, grouped in order, in the OverflowMenu itemIds.

### Confusing toolbar orientation with button orientation

❌ Setting the toolbar-level vertical boolean expecting the individual commands to display their icon above their text; the layout stacks, but each command's icon and label arrangement is unchanged.

✅ Set the vertical boolean on the Toolbar to stack the commands in a column, and separately set vertical on the individual ToolbarButton or ToolbarToggleButton when you want the icon-over-label arrangement inside a command.

## Accessibility

**Requirements**: The Toolbar must expose a role="toolbar" container with an accessible name supplied through aria-label; every documented example passes aria-label on the Toolbar itself, and it is the primary requirement. Because the toolbar is a composite widget, its children keep their own semantics and must be labeled individually: icon-only buttons need aria-label, toggle buttons expose their pressed state, radio buttons expose selection state, and any popover or menu trigger exposed through a ToolbarButton needs its own label plus the expanded state managed by the trigger. If you group children with ToolbarGroup purely for layout, give the group role="presentation" so it is not announced as a redundant nested group. Disabled commands must be conveyed through the disabled state of the underlying control rather than by removing the item, so keyboard users can still discover it. The toolbar also participates in focus management, so every command must be reachable and operable with the keyboard alone, and any icon-only command must meet contrast requirements for its icon against the toolbar background.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the toolbar, landing on the currently active command, and moves focus out of the toolbar to the next focusable element on the page. |
| `ArrowRight / ArrowLeft` | In a horizontal toolbar, moves focus to the next or previous command in the strip. |
| `ArrowDown / ArrowUp` | In a toolbar with the vertical boolean set, moves focus to the next or previous command in the stack. |
| `Home` | Moves focus to the first command in the toolbar. |
| `End` | Moves focus to the last command in the toolbar. |
| `Enter` | Activates the focused command, such as a ToolbarButton, an overflow command, or a menu trigger. |
| `Space` | Activates the focused command, and toggles ToolbarToggleButton and ToolbarRadioButton items. |
| `Escape` | Closes an open menu or popover that was opened from a ToolbarButton inside the toolbar, returning focus to that trigger. |

**ARIA**: aria-label on the Toolbar root to name the toolbar, role="toolbar" on the Toolbar root, aria-orientation reflecting the vertical layout of the toolbar, aria-label on each icon-only ToolbarButton, ToolbarToggleButton, ToolbarRadioButton, and ToolbarOverflowButton, aria-pressed on toggle commands to convey their checked state, aria-describedby contributed by a Tooltip attached with relationship="description" on an icon-only command, aria-expanded and aria-haspopup on ToolbarButtons that trigger a Menu or Popover, role="presentation" on ToolbarGroup wrappers used only for layout, role="group" and aria-label on ToolbarRadioGroup to name a single-select cluster, disabled and aria-disabled on commands that are temporarily unavailable

**Screen Reader**: Screen readers announce the Toolbar as a toolbar with its aria-label, then move through the commands as individual controls rather than as plain text. Each icon-only command is read from its own aria-label, toggle commands announce their name together with their pressed or unpressed state derived from the toolbar's checked-value map, and radio commands announce the selected option within their named group. Commands that open a menu or popover announce the popup type and its expanded state. When a Tooltip is attached with relationship="description", the tooltip text is exposed as an accessible description of the command, so screen reader users hear both the short aria-label and the longer description. Overflowed commands are not hidden from the accessibility tree: they move into the overflow menu and are announced there with the same labels.

## Styling

The Toolbar renders an unstyled container, so most customization is spacing and background on the root via className or style. The size prop maps directly to padding tokens and is the cleanest way to control density: a small toolbar uses no vertical padding and tokens.spacingHorizontalXS (4px) of horizontal padding, a medium toolbar uses tokens.spacingVerticalXS (4px) vertical and tokens.spacingHorizontalS (8px) horizontal, and a large toolbar uses tokens.spacingVerticalXS vertical and tokens.spacingHorizontalXL (20px) horizontal. If you need a surface behind the commands, apply tokens.colorNeutralBackground1 with a border of tokens.colorNeutralStroke1 and tokens.borderRadiusMedium on the root, and use tokens.shadow2 if the toolbar floats above content. Use tokens.spacingHorizontalXXS or tokens.spacingHorizontalXS as gap-like spacing between adjacent commands and increase to tokens.spacingHorizontalS before a ToolbarDivider so clusters read as separate. For vertical toolbars, swap horizontal spacing for tokens.spacingVerticalXS and tokens.spacingVerticalXXS so the stack stays tight. Because the toolbar passes className and style through to its root slot, avoid targeting child buttons from the toolbar's stylesheet; set appearance on the individual ToolbarButton, ToolbarToggleButton, or ToolbarRadioButton instead (primary, subtle, and transparent are all demonstrated) and use tokens.colorBrandBackground and tokens.colorNeutralBackground1Hover only through those components.

## Performance

The Toolbar is a thin container, so its cost is dominated by the children you place inside it. Because checkedValues is a single object that the Toolbar distributes to every toggle and radio child, any state update re-renders the whole toolbar subtree; keep the state as close to the toolbar as practical, avoid storing unrelated application state alongside the checked map, and stabilize the onCheckedValueChange handler with a memoized callback so children do not receive a new function identity on every render. Toolbars with many commands are also a natural place for expensive icon components, so reuse icon elements or memoize command children when the strip is large. If you adopt the Overflow pattern, be aware that overflow measurement is resize-driven and involves observing the container and re-rendering when items collapse or expand; this is negligible for typical toolbars but noticeable if the toolbar lives inside an element that changes size rapidly, such as an animated panel. Nothing in the Toolbar virtualizes children, so extremely long command lists should be trimmed, grouped, or pushed into a Menu rather than rendered inline.

## Theming & Tokens

The Toolbar has no visual tokens of its own; it responds to the theme through the controls it contains and through any styles you attach to its root. Size variants are expressed as padding values that line up with the spacing scale, so a themed toolbar inherits density changes if you reference tokens.spacingVerticalXS, tokens.spacingHorizontalXS, tokens.spacingHorizontalS, and tokens.spacingHorizontalXL instead of hardcoded lengths. When you give the toolbar a visible surface, use tokens.colorNeutralBackground1 for the fill, tokens.colorNeutralStroke1 or tokens.colorNeutralStroke2 for the border, tokens.borderRadiusMedium for the corners, and tokens.colorNeutralForeground1 for any text placed directly inside. Floating toolbars can use tokens.shadow2. The appearance of commands comes from the child components and their own tokens, for example tokens.colorBrandBackground for primary ToolbarButtons, tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed for subtle and transparent variants, tokens.colorNeutralForegroundDisabled for disabled commands, and tokens.colorNeutralForeground2 for secondary iconography. In dark or high-contrast themes these tokens are remapped by the Fluent Provider, so toolbar surfaces and commands stay legible without custom color overrides.

## Migration Notes

If you are coming from an older, array-driven toolbar or command bar API where the items were supplied as data, the v9 Toolbar is fully declarative: the Toolbar has only a root slot, and every command is a child component. That means there is no items or overflowItems prop to configure. Grouping is expressed with ToolbarGroup and ToolbarDivider, and overflow behavior is composed explicitly by wrapping the toolbar in the Overflow component and replacing collapsible children with ToolbarOverflowButton and ToolbarOverflowDivider entries that carry overflowId and overflowGroupId values, paired with an OverflowMenu whose itemIds list mirrors them. Checked state is likewise explicit: instead of per-item toggle props, give each toggle or radio child a name and a value and let the Toolbar manage them through checkedValues, defaultCheckedValues, and onCheckedValueChange. Appearance and size of individual commands are set on the buttons themselves rather than inherited from a single toolbar-level style prop.

## Edge Cases

- ToolbarToggleButton and ToolbarRadioButton only participate in the toolbar's checked-value management when both name and value are supplied; without them the command behaves as an independent toggle or radio that the toolbar cannot track.
- All radio commands sharing the same name form one single-select group; wrap them in ToolbarRadioGroup as the examples do so the group is announced and behaves as one unit, and keep radio names distinct from toggle names if both exist in the same toolbar.
- The checkedValues map is not pruned by the toolbar: keys that no longer match any child's name remain in your state object, so remove stale groups yourself when commands are added or removed dynamically.
- onCheckedValueChange reports the changed group's name and its complete checkedItems array, not a delta, so replace the entire array for that key rather than appending to it.
- The Toolbar exposes only a root slot, so className, style, and any other native attributes land on the container itself; there is no per-section slot to style separately, which is why grouping components exist for structure.
- Overflow children require unique overflowId strings plus an OverflowMenu itemIds array that lists those ids in the same grouping; omitting an id or reusing one breaks the collapse behavior for that command.
- Toolbar commands that open popovers should wrap the ToolbarButton in PopoverTrigger with disableButtonEnhancement, otherwise the trigger's own enhancement can conflict with the toolbar command's rendering.
- The toolbar-level size prop controls only the container's padding; it does not resize the ToolbarButton children, so pair a small toolbar with the command size and appearance you actually want.

## See Also

- - [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
