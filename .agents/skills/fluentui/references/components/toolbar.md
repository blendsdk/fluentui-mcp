# Toolbar

> **Package**: `@fluentui/react-toolbar` v9.8.1
> **Import**: `import { Toolbar } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

Toolbar is a layout and interaction container that groups a set of related command controls into a single, coherent command surface. It renders a root slot that carries the toolbar role and lays its children out with a flex row by default (or a flex column when vertical is set), applying padding that scales with the size prop. Toolbar itself is intentionally thin: it owns grouping, orientation, sizing, and an optional checked-value model, while the actual commands come from its companion components such as ToolbarButton, ToolbarToggleButton, ToolbarRadioButton, ToolbarRadioGroup, ToolbarDivider, and ToolbarGroup. Selection state for toggle and radio style controls is coordinated through a checked values map keyed by the name prop of each control, with controlled usage (checkedValues plus onCheckedValueChange) and uncontrolled usage (defaultCheckedValues or plain defaults) both supported. Because it is just a container, Toolbar composes naturally with Menu, Popover, Tooltip, and Overflow utilities to build format bars, image editors, table action bars, and compact panels.

**When to use**: Use Toolbar whenever a set of related, same-context commands needs to be presented together: text formatting bars, image or table editing actions, quick actions on a selected object, or a compact action strip inside a Card or Drawer. It is the right choice over a hand-rolled flex row of buttons because it establishes the toolbar semantics screen readers expect, gives you consistent spacing through the size prop, and provides a shared checked-value contract for toggle and radio controls. Choose ToolbarButton for one-shot commands, ToolbarToggleButton for independent on/off formatting toggles (bold, italic, underline), and ToolbarRadioButton inside ToolbarRadioGroup for mutually exclusive choices (align left, center, right). Reach for other components instead when the content is not a command set: use Nav or NavItem for page-level navigation, Menu for a pure dropdown of actions, and Popover when a single control needs to reveal a rich surface without a surrounding command strip. Toolbar can sit in tight spaces at size small, in default application chrome at size medium, and in more spacious surfaces at size large.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `checkedValues` | `Record<string, string[]> \| undefined` | — | No | Map of all checked values |
| `defaultCheckedValues` | `Record<string, string[]> \| undefined` | — | No | Default values to be checked on mount |
| `onCheckedValueChange` | `((e: ToolbarCheckedValueChangeEvent, data: ToolbarCheckedValueChangeData) => void) \| undefined` | — | No | Callback when checked items change for value with a name |
| `size` | `"small" \| "medium" \| "large" \| undefined` | `medium` | No | Toolbar can have small or medium size |
| `vertical` | `boolean \| undefined` | `false` | No | Toolbar can be vertical styled |

### Prop Guidance

- **size**: Controls the padding around the toolbar controls, not the size of the controls themselves. Use small in dense surfaces such as panels, Cards, or secondary toolbars, medium as the default for standard application chrome, and large when the toolbar sits in a spacious layout. Changing size alone will not make icons or buttons larger. `small`
- **vertical**: Stacks the toolbar controls in a column instead of a row, which is useful for narrow rails and side panels. It also affects the announced orientation of the toolbar, so set it as a deliberate layout decision rather than as a styling afterthought. Child buttons can also be set to a vertical layout individually when the toolbar itself stays horizontal. `true`
- **checkedValues**: Use the controlled form when checked state must live outside the toolbar, such as when it is persisted, derived from a document model, or shared with other UI. The map keys must match the name values used on the child toggle and radio controls, and the array holds the currently checked values for that key. `a map with a textOptions key holding the currently selected values`
- **defaultCheckedValues**: Use the uncontrolled form to seed initial selections on mount for toggle buttons and radio groups without wiring a change handler. Do not combine it with checkedValues on the same Toolbar, since that mixes controlled and uncontrolled state models. `a map with a textOptions key set to the initially selected alignment`
- **onCheckedValueChange**: Fires when a toggle or radio item changes for a given name, providing the name and the new checkedItems array. Always merge the new array into your existing state immutably, replacing only the entry for the reported name, so other groups in the same toolbar keep their selections. `spread the previous map and overwrite the entry for the reported name`

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

- Give the Toolbar root a descriptive aria-label that names the command surface, for example a text formatting or insert actions label, because the toolbar role alone does not describe purpose.
- Give every icon-only ToolbarButton, ToolbarToggleButton, and ToolbarRadioButton its own aria-label, since the icon provides no accessible name on its own.
- Use ToolbarDivider and ToolbarGroup to visually and semantically cluster related commands, adding role presentation on groups that exist only for spacing or layout.
- Match selection semantics to behavior: independent multi-select formatting uses ToolbarToggleButton with a shared name and distinct values, while exclusive choices use ToolbarRadioButton inside ToolbarRadioGroup.
- Keep the checked values map keyed by the same name string used on the toggle or radio controls so the container can route changes and default state correctly.
- Use defaultCheckedValues when the toolbar can own its state, and switch to checkedValues plus onCheckedValueChange only when the state must live in the parent or be persisted.
- Pick the size that matches the surrounding density: small for compact panels and toolbars inside Cards, medium as the default for standard chrome, and large for roomy layouts or touch-oriented surfaces.
- Wrap icon-only commands in Tooltip when a visible label is not feasible, and use an explanatory relationship so the tooltip supplements rather than replaces the accessible name.
- Compose overlays by putting Menu or Popover triggers around toolbar buttons, using the trigger's ability to disable automatic button enhancement so the ToolbarButton remains the rendered control.

### Don'ts

- Do not render icon-only toolbar controls without an accessible name; a screen reader will announce an unlabeled button and the command becomes unusable.
- Do not pass both checkedValues and defaultCheckedValues to the same Toolbar, since controlled and uncontrolled state models conflict.
- Do not mutate the checked values object inside onCheckedValueChange; return a new map with only the changed key replaced, as the controlled examples do.
- Do not use ToolbarToggleButton for mutually exclusive options or ToolbarRadioButton for independent toggles; the announced semantics will contradict the actual behavior.
- Do not expect the size prop to resize the child controls; it only controls the padding around the toolbar controls, so the buttons keep their own sizing.
- Do not place long-form content such as paragraphs, forms, or lists inside a Toolbar; it is a command strip, not a general-purpose layout container.
- Do not use Toolbar as primary page navigation; use Nav with NavItem and related components so navigation semantics and landmarks stay correct.
- Do not nest a Toolbar inside another Toolbar, because nested toolbar roles produce confusing focus and announcement order.
- Do not drop a raw generic Button into a Toolbar when a ToolbarButton is available, since you lose the shared toolbar styling, sizes, and vertical layout behavior.

## Anti-Patterns

### Icon-only commands with no accessible name

❌ Toolbar commands are almost always icon-only, and an icon renders no text for assistive technology. A toolbar of unlabeled buttons is announced as a series of unnamed buttons, so screen reader users cannot tell the commands apart even though the toolbar itself is named.

✅ Provide an aria-label on every icon-only ToolbarButton, ToolbarToggleButton, and ToolbarRadioButton describing the action, and optionally add a Tooltip with an explanatory relationship when the label alone is not obvious.

### Mixing controlled and uncontrolled checked state

❌ Passing both checkedValues and defaultCheckedValues, or handling selection while also relying on the default map, creates two sources of truth. Selections appear to revert, desync between groups, or only update the visual state without updating the parent model.

✅ Choose one model per Toolbar. Use defaultCheckedValues alone for self-contained toolbars, or checkedValues plus onCheckedValueChange for toolbars whose selection must be owned by the application, and update the map immutably in the handler.

### Using toggle buttons for exclusive choices

❌ Modeling mutually exclusive options such as text alignment with ToolbarToggleButton allows multiple values to be checked at once and announces pressed state rather than a single selection, contradicting what the user expects from an alignment control.

✅ Wrap the options in ToolbarRadioGroup and use ToolbarRadioButton with a shared name so exactly one value is checked, and manage the initial selection through defaultCheckedValues or the controlled map.

### Expecting size to resize commands

❌ Teams set size on the Toolbar expecting smaller icons or shorter buttons, then add ad hoc style overrides when the controls do not shrink. The result is inconsistent density between the toolbar padding and the controls inside it.

✅ Treat size as padding control only. Pair it with child-level sizing and icon choices (regular versus filled icon variants, or vertical buttons) and keep custom spacing overrides centralized in a makeStyles hook so density stays uniform.

### Reaching for raw layout instead of toolbar structure

❌ Rendering a plain flex row of Button components misses the toolbar role, the consistent size-driven padding, and the shared checked-value contract, and it often results in inaccessible groupings that cannot be described by assistive technology.

✅ Use Toolbar with ToolbarButton, ToolbarToggleButton, ToolbarRadioButton, ToolbarGroup, and ToolbarDivider so grouping, spacing, and the combined checked-value state stay consistent and accessible.

## Accessibility

**Requirements**: The Toolbar root exposes the toolbar role, so it must always be named with aria-label (or an equivalent labelling technique) — every provided example supplies one. Each interactive child needs its own accessible name: visible text on ToolbarButton is preferred, and aria-label is required for icon-only buttons, toggle buttons, and radio buttons. Toggle buttons must communicate pressed state, radio buttons must communicate checked state within their group, and controls that open a Menu or Popover should expose their popup state. Contrast and focus visibility requirements follow the underlying button components: focus indicators must remain visible (WCAG 2.4.7), targets should meet minimum size guidance, and disabled controls must remain perceivable while being removed from the focus cycle.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the toolbar and between toolbar controls in DOM order, then out of the toolbar to the next focusable element after it. |
| `Shift+Tab` | Moves focus backwards through the toolbar controls and out to the element preceding the toolbar. |
| `Enter` | Activates the focused toolbar button, toggles the focused toggle button, or selects the focused radio-style button. |
| `Space` | Activates the focused toolbar button or changes the checked state of the focused ToolbarToggleButton or ToolbarRadioButton. |
| `ArrowLeft / ArrowRight` | Moves between items inside horizontal composite widgets launched from the toolbar, such as items in a ToolbarRadioGroup or entries in an open menu, and between controls when the toolbar is horizontal. |
| `ArrowUp / ArrowDown` | Moves between menu items in an open Menu, and between controls when the toolbar is rendered with vertical. |
| `Home / End` | Jumps to the first or last item of an open menu or another composite widget opened from the toolbar. |
| `Escape` | Closes an open Menu or Popover that was launched from a toolbar control and returns focus to that control. |

**ARIA**: role="toolbar" on the root slot, applied automatically, aria-orientation, reflecting the vertical prop for the toolbar root, aria-label on the Toolbar root and on every icon-only toolbar control, aria-pressed on ToolbarToggleButton to expose its on/off state, role and checked state exposed by ToolbarRadioGroup and ToolbarRadioButton for exclusive selections, aria-disabled or the disabled attribute on individual toolbar controls, aria-haspopup and aria-expanded on toolbar buttons that open a Menu or Popover, aria-controls, when a toolbar button drives another region such as a panel

**Screen Reader**: Screen readers announce the toolbar as a group with the name supplied through aria-label, followed by orientation and item count information where supported. Each control is then announced individually in document order: plain buttons read their visible label or aria-label, toggle buttons add their pressed or unpressed state, and radio style buttons announce their checked state within the radiogroup. Because icon-only commands carry no text, their announced name comes entirely from aria-label, which is why that attribute is required. When a control opens a Menu or Popover, the expanded state is announced on the trigger and focus moves into the popup, where the menu or dialog semantics take over until the surface is dismissed and focus returns to the toolbar control.

## Styling

Toolbar provides layout only — padding derived from size and flex direction from vertical — so most visual customization happens through the child controls and the surface the toolbar sits on. The size prop maps to padding around the controls: small removes vertical padding and uses 4px horizontal padding, medium applies 4px vertical and 8px horizontal padding, and large applies 4px vertical and 20px horizontal padding. When you need more control, wrap the toolbar in makeStyles and use Griffel tokens such as tokens.spacingHorizontalXS, tokens.spacingHorizontalS, tokens.spacingHorizontalL, tokens.spacingVerticalXS, and tokens.spacingVerticalS for custom gaps and insets, tokens.borderRadiusMedium or tokens.borderRadiusSmall for a framed toolbar, and tokens.colorNeutralStroke1 for a border. Grouping and separation are handled by ToolbarGroup (with role presentation for purely visual clusters) and ToolbarDivider; to push clusters apart, apply flexGrow or justify-content spacing to a ToolbarGroup through a custom className rather than adding spacer elements. Child controls accept their own appearance values such as primary, subtle, and transparent, which is the right lever for emphasizing one command in the strip. Use mergeClasses instead of string concatenation when combining your classes with a state class, and prefer atomic Griffel classes over inline style objects so styles are deduplicated across toolbars.

## Performance

Toolbar is a lightweight flex container, so its own render cost is minimal; the cost comes from the number and complexity of children. Keep the checked values map identity stable and update it immutably in onCheckedValueChange — replacing the whole map on every change causes all consumers of that state to re-render. Define onCheckedValueChange and per-item handlers with useCallback, and avoid inline arrow functions on every toolbar item when the toolbar is inside a frequently re-rendering surface. Prefer static children over building the command list in a render loop with new element types each pass, since stable element types let React reconcile instead of remount. When the toolbar holds many commands, host it inside the Overflow utilities as shown in the overflow example so off-screen commands are collapsed into a menu rather than kept in the DOM layout, which also reduces the number of focusable targets. Remember that ToolbarDivider and ToolbarGroup are cheap and preferable to custom spacer elements, and that styling through makeStyles produces atomic classes that are shared across instances rather than duplicated per render.

## Theming & Tokens

Toolbar itself paints no background: its root only applies display, flex direction, alignment, and size-based padding built from the spacing scale, so it visually inherits whatever surface it is placed on — typically tokens.colorNeutralBackground1 or tokens.colorNeutralBackground2 from the parent container. Because padding is token-driven, changing the theme's spacing values changes toolbar density globally without per-instance overrides. Visual emphasis comes from the child controls: ToolbarButton, ToolbarToggleButton, and ToolbarRadioButton accept appearance values such as primary, subtle, and transparent, which resolve to brand and neutral tokens such as tokens.colorBrandBackground and tokens.colorNeutralBackground1Hover along with tokens.colorNeutralForeground1 for their content. Borders and frames you add around a toolbar should use tokens.colorNeutralStroke1 with tokens.borderRadiusMedium so the frame stays in step with FluentProvider themes, and text or icon colors should reference tokens.colorNeutralForeground1 or tokens.colorNeutralForeground2 rather than literal values. Focus rings, disabled colors, and hover states of the toolbar controls are supplied by the underlying components' tokens, so avoiding hard-coded colors keeps high contrast and dark themes working correctly.

## Migration Notes

If you are moving from earlier Fluent UI versions, note that the v9 Toolbar is composition based rather than data driven: instead of declaring an items array with render callbacks, you place ToolbarButton, ToolbarToggleButton, ToolbarRadioButton, ToolbarRadioGroup, ToolbarDivider, and ToolbarGroup as children. Selection is modeled with a checked values map keyed by control name rather than per-item state, and it is exposed through checkedValues, defaultCheckedValues, and onCheckedValueChange. Density is expressed through the single size prop instead of per-item style overrides, orientation through vertical instead of separate layout styles, and there is no built-in split between primary and secondary command clusters — approximate it with ToolbarGroup and flex layout. There is no built-in overflow mechanism either; the overflow pattern is achieved by hosting the Toolbar inside the Overflow utilities and using overflow-aware toolbar buttons together with an overflow menu that lists the item ids, as shown in the overflow example. Styling moved from mergeStyles and class name overrides to Griffel makeStyles and design tokens.

## Edge Cases

- The onCheckedValueChange callback receives the name of the group that changed and the complete checkedItems array for that group, so the handler must merge the new array into the existing map and preserve other keys; replacing the whole map loses selections in sibling groups.
- The checked values map keys must exactly match the name prop on the child toggle and radio controls. A mismatch means the control renders unchecked and never reports changes, which looks like a state bug rather than a naming bug.
- Selections are stored per name, so two independently toggled sets of options in one toolbar need distinct name values; reusing one name couples the groups so selecting in one clears or conflicts with the other.
- The size prop only changes padding around the toolbar controls — small removes vertical padding and uses 4px horizontal padding, medium uses 4px vertical and 8px horizontal padding, and large uses 4px vertical and 20px horizontal padding — so a size change alone will not shrink or grow icons.
- ToolbarGroup used purely for spacing or alignment should be marked with role presentation so that it does not create an extra announced group inside the toolbar.
- There is no built-in overflow behavior: to collapse commands on narrow surfaces you must host the Toolbar in the Overflow utilities and pair overflow-aware toolbar buttons and dividers with an overflow menu that receives the item ids in group order.
- When a toolbar button opens a Popover or Menu, the trigger should disable automatic button enhancement so the ToolbarButton itself remains the interactive element, keeping toolbar styling and keyboard behavior intact.
- A vertical toolbar changes the orientation announced for the toolbar and expects children to stack meaningfully; mixing vertical toolbar layout with individually vertical child buttons can produce awkward spacing unless the visual design accounts for both.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
