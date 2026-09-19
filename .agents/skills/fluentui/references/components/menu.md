# Menu

> **Package**: `@fluentui/react-menu` v9.25.0
> **Import**: `import { Menu } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

Menu is a navigation-category component that presents a list of actions, commands, or links inside a popup surface anchored to a trigger element. The Menu root owns the open/close state machine, the positioning configuration, and the surface motion, and it is composed with sibling parts: MenuTrigger for the anchor, MenuPopover for the popup surface, MenuList as the container of rows, and item components such as MenuItem, MenuItemCheckbox, MenuItemRadio, MenuItemLink, and MenuItemSwitch. Structural parts include MenuGroup, MenuGroupHeader, MenuDivider, and MenuSplitGroup, which produce correct accessible markup for grouped and split-action rows. Menu can be uncontrolled (with defaultOpen) or fully controlled (with open and onOpenChange), can open on click, hover (openOnHover with hoverDelay), or right click (openOnContext), can persist after an item click (persistOnItemClick), can render in DOM order instead of on document.body (inline), and supports nested submenus as well as anchoring to a fully custom target when no MenuTrigger is used. A surfaceMotion slot exposes the popup entrance and exit animation so teams can customize or disable it.

**When to use**: Use Menu when the user needs to choose from a set of related commands or destinations that should appear on demand rather than occupy permanent space: overflow command bars, editor actions, right-click context menus, split actions, and navigation lists. Use it for action menus (MenuItem), navigation menus (MenuItemLink), and multi-select or single-select command sets (MenuItemCheckbox, MenuItemRadio, MenuItemSwitch). Prefer Select or Combobox when the user is filling out a form field and needs a persistent, labelled value picker; prefer ContextSelector when the popup switches the context of the whole page or application rather than issuing a command; prefer Popover when the surface contains arbitrary rich content (forms, descriptions, media) instead of a menu list; prefer Tooltip for non-interactive supplementary hints. For commands that live in a toolbar or overflow bar, Menu is typically rendered by the Toolbar overflow behavior rather than placed manually.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `any` | — | Yes | Can contain two children including `MenuTrigger` and `MenuPopover`. Alternatively can only contain `MenuPopover` if using a custom `target`. |
| `closeOnScroll` | `boolean \| undefined` | `false` | No | Close when scroll outside of it |
| `defaultOpen` | `boolean \| undefined` | `false` | No | Whether the popup is open by default |
| `hoverDelay` | `number \| undefined` | — | No | Sets the delay for mouse open/close for the popover one mouse enter/leave |
| `inline` | `boolean \| undefined` | `false` | No | Root menus are rendered out of DOM order on `document.body`, use this to render the menu in DOM order This option is disregarded for submenus |
| `onOpenChange` | `((e: MenuOpenEvent, data: MenuOpenChangeData) => void) \| undefined` | — | No | Call back when the component requests to change value The `open` value is used as a hint when directly controlling the component |
| `open` | `boolean \| undefined` | `false` | No | Whether the popup is open |
| `openOnContext` | `boolean \| undefined` | `false` | No | Opens the menu on right click (context menu), removes all other menu open interactions |
| `openOnHover` | `boolean \| undefined` | `false` | No | Opens the menu on hover |
| `persistOnItemClick` | `boolean \| undefined` | `false` | No | Do not dismiss the menu when a menu item is clicked |
| `positioning` | `any` | — | No | Configures the positioned menu |

### Prop Guidance

- **children**: Required. Normally holds a MenuTrigger followed by a MenuPopover; when you anchor the menu to a custom target with the positioning prop, render only the MenuPopover and implement the trigger markup and interactions yourself. `MenuTrigger and MenuPopover, or MenuPopover alone`
- **open**: Use for controlled visibility. The value is treated as a hint for the open state, so pair it with onOpenChange to react to user-driven requests and keep keyboard interactions intact. `true`
- **defaultOpen**: Use for uncontrolled menus that should start expanded, for example when demonstrating a persistent menu surface. It has no effect once the open prop is supplied. `true`
- **onOpenChange**: Called whenever the component requests a state change. The provided data includes the open value and the reason for the change, which lets you filter events such as clickOutside when a custom target is involved, or force the menu open while interacting inside a custom boundary. `(e, data) => setOpen(data.open)`
- **openOnHover**: Enable when hovering the trigger should reveal the menu, such as in menu bar or ribbon scenarios. Combine with hoverDelay to avoid accidental openings when the pointer merely passes over the trigger. `true`
- **hoverDelay**: Sets the delay in milliseconds for mouse enter and leave before the popover opens or closes. Use it to add a forgiveness window for pointer travel into submenus or menu bars. `500`
- **openOnContext**: Enable to open the menu on right click as a context menu. This removes all other open interactions, so the trigger no longer responds to click, Enter, or Space for opening. `true`
- **persistOnItemClick**: Enable when clicking an item should not dismiss the menu, for example when rows toggle multiple independent settings and the user is expected to make several selections in a row. `true`
- **inline**: Enable to render root menus in DOM order next to the trigger instead of at the end of document.body. This option is disregarded for submenus. Useful when DOM order matters for reading order, scroll containers, or snapshot testing. `true`
- **positioning**: Configures the positioned surface: target element, positioning reference, overflow and flip boundaries, and auto sizing. Also used to anchor the menu to a custom target and to manually update position when a custom boundary resizes. `{ autoSize: true }`
- **closeOnScroll**: Enable to dismiss the menu when the user scrolls outside of it, which is helpful for long or scrollable pages where a detached popup would otherwise float over unrelated content. `true`
- **surfaceMotion**: Slot for the popup entrance and exit animation. Leave it at its default for standard motion, supply a Motion component to customize, or set it to null to disable animation. `null`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `surfaceMotion` | — | Yes | Slot for the surface motion animation. For more information refer to the [Motion docs page](https://react.fluentui.dev/?path=/docs/motion-motion-slot--docs). |
| `surfaceMotion` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Button, Menu, MenuTrigger, MenuList, MenuItem, MenuPopover } from '@fluentui/react-components';

export const Default = (): JSXElement => (
  <Menu positioning={{ autoSize: true }}>
    <MenuTrigger disableButtonEnhancement>
      <Button>Toggle menu</Button>
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
);
```

### AligningWithIcons

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Button, Menu, MenuTrigger, MenuList, MenuItem, MenuPopover } from '@fluentui/react-components';
import { bundleIcon, ClipboardPasteRegular, ClipboardPasteFilled } from '@fluentui/react-icons';

export const AligningWithIcons = (): JSXElement => (
  <Menu hasIcons>
    <MenuTrigger disableButtonEnhancement>
      <Button>Toggle menu</Button>
    </MenuTrigger>
    <MenuPopover>
      <MenuList>
        <MenuItem>Cut</MenuItem>
        <MenuItem icon={<PasteIcon />}>Paste</MenuItem>
        <MenuItem>Edit</MenuItem>
      </MenuList>
    </MenuPopover>
  </Menu>
);

AligningWithIcons.parameters = {
  docs: {
    description: {
      story: [
        'The `hasIcons` prop will align menu items if only a subset of menu items contain an icon.',
        'When separation of menu items is only for visual aesthetics, the `MenuDivider` component can be used',
        'by itself as it has no accessible markup features.',
      ].join('\n'),
    },
  },
};
```

### AligningWithSelectableItems

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { CutRegular, CutFilled, bundleIcon } from '@fluentui/react-icons';

export const AligningWithSelectableItems = (): JSXElement => (
  <Menu hasIcons hasCheckmarks>
    <MenuTrigger disableButtonEnhancement>
      <Button>Toggle menu</Button>
    </MenuTrigger>
    <MenuPopover>
      <MenuList>
        <MenuItemCheckbox icon={<CutIcon />} name="edit" value="cut">
          Checkbox item
        </MenuItemCheckbox>
        <MenuItem>Menu item</MenuItem>
        <MenuItem>Menu item</MenuItem>
      </MenuList>
    </MenuPopover>
  </Menu>
);

AligningWithSelectableItems.parameters = {
  docs: {
    description: {
      story: ['The `hasCheckmarks` prop will align menu items if only a subset of menu items are selectable.'].join(
        '\n',
      ),
    },
  },
};
```

## Best Practices

### Do's

- Always give the trigger an accessible name: a visible Button label, or an aria-label when the trigger is icon-only (as in the split menu item pattern, where the submenu trigger MenuItem receives an explicit aria-label).
- Compose the trigger with MenuTrigger and pass disableButtonEnhancement when the child is already a Fluent Button, so the injected interaction props do not conflict with the Button's own behaviors.
- Set hasIcons on the Menu root when only a subset of items have icons, and set hasCheckmarks when only a subset of items are selectable, so the text of all rows stays aligned.
- Use MenuGroup together with MenuGroupHeader to express logical groups, and reserve MenuDivider for purely visual separation since it carries no accessible markup.
- Control selectable items through checkedValues and onCheckedValueChange keyed by each item's name and value, mirroring the name/value model of native checkbox and radio inputs.
- Prefer MenuItemLink with an href for navigation destinations so assistive technology announces a link, instead of attaching an onClick that performs navigation on a plain MenuItem.
- When you anchor a Menu to a custom target instead of MenuTrigger, add the useRestoreFocusTarget attributes to the target elements and handle the onOpenChange event types you want to ignore, such as clickOutside on the target itself.
- Limit submenu nesting to about two levels and extract each submenu into its own component for maintainability.

### Don'ts

- Don't use Menu as a form control for choosing a value that will be submitted with a form; use Select or Combobox instead.
- Don't place rich composite content such as embedded forms, sliders, or long multi-paragraph layouts inside a menu surface; use Popover or Dialog for that.
- Don't leave icon-only MenuTrigger children unlabelled; a screen reader will announce an unnamed button with no indication of what it opens.
- Don't create deep chains of nested submenus, because discovery, keyboard traversal, and positioning all degrade quickly beyond two levels.
- Don't set the open prop without also handling onOpenChange, unless the menu is intentionally static, because users will then lose the ability to dismiss the menu with Escape or an outside click.
- Don't use persistOnItemClick as a way to keep a menu permanently visible; it only suppresses dismissal for item clicks, and you should still verify that Escape and outside click behave acceptably.
- Don't use MenuDivider to convey that items belong to different logical sections; use MenuGroup and MenuGroupHeader so screen readers receive the grouping.
- Don't rely on a custom child of MenuTrigger that does not forward refs or spread the injected trigger props; the menu cannot position or open correctly without them.

## Anti-Patterns

### Navigation handled by click handlers on plain items

❌ Attaching an onClick that performs routing to a plain MenuItem hides the destination from assistive technology, prevents users from opening links in new tabs or copying the link address, and loses link semantics entirely.

✅ Use MenuItemLink with an href for navigation destinations so the row is announced and behaves as a link, and reserve MenuItem for commands that perform actions.

### Controlled open state that ignores the change hints

❌ Passing the open prop and either ignoring onOpenChange or always forcing it back to true removes Escape-to-dismiss and outside-click dismissal, which strands keyboard users inside the menu and violates the dismissible requirement for transient content.

✅ Store the open value from the onOpenChange callback, and only override specific event types intentionally, such as suppressing clickOutside for a custom anchor target so it does not close and immediately reopen.

### Custom trigger that does not forward refs or injected props

❌ A custom component used as a child of MenuTrigger must accept a ref and spread the injected interaction and ARIA props; otherwise the popup cannot be positioned, the trigger never reports expanded state, and keyboard opening fails.

✅ Use ref forwarding in the custom component, spread the injected trigger props onto the DOM element, or use MenuTrigger's function-as-children form to place the props on an inner element of your own markup.

### Deep submenu nesting

❌ Each nested level multiplies the positioning, responsiveness, and keyboard traversal complexity, and users frequently lose track of the hierarchy, especially when the available viewport is narrow.

✅ Keep nesting to roughly two levels, extract each submenu into its own component, and consider restructuring the command set into a flatter menu with groups instead.

### Using MenuDivider as a semantic section break

❌ MenuDivider is purely visual and adds no accessible markup, so screen reader users receive no indication that two sets of rows belong to different sections.

✅ Wrap each section in MenuGroup with a MenuGroupHeader so the grouping is announced, and keep MenuDivider only for decorative separation.

## Accessibility

**Requirements**: Menu must satisfy WCAG 2.1 criteria for keyboard operability (2.1.1), no keyboard trap (2.1.2), focus order (2.4.3), focus visible (2.4.7), name/role/value (4.1.2), and content-on-hover-or-focus being dismissible, hoverable, and persistent (1.4.13) — which is why Escape and outside click always dismiss the surface, including when openOnHover or persistOnItemClick is used. Every interactive row must have an accessible name, and selectable rows must expose their checked state. Icon-only triggers and split-menu submenu triggers must carry an explicit aria-label. Disabled rows must remain discoverable to assistive technology rather than disappearing from the list.

| Key | Action |
| --- | --- |
| `Enter` | Opens the menu when focus is on the trigger; activates the focused menu item when the menu is open. |
| `Space` | Opens the menu when focus is on the trigger; activates the focused menu item when the menu is open. |
| `ArrowDown` | Opens the menu from the trigger and moves focus to the first item; otherwise moves focus to the next item, wrapping at the end of the list. |
| `ArrowUp` | Opens the menu from the trigger and moves focus to the last item; otherwise moves focus to the previous item, wrapping at the start of the list. |
| `ArrowRight` | Opens the focused item's submenu, or moves focus into an already open submenu. |
| `ArrowLeft` | Closes the current submenu and returns focus to the parent item that opened it. |
| `Escape` | Closes the open menu or submenu and returns focus to the trigger or parent item. |
| `Home` | Moves focus to the first item in the menu list. |
| `End` | Moves focus to the last item in the menu list. |
| `Tab` | Closes the menu and moves focus out of the menu to the next tabbable element in the document. |
| `Shift+F10 or Context Menu key` | Opens the menu at the focused element when the Menu is configured with openOnContext. |
| `Character keys` | Type-ahead: moves focus to the next item whose text starts with the typed characters. |

**ARIA**: aria-haspopup on the trigger to advertise that it opens a menu, aria-expanded on the trigger to reflect the open or closed state, aria-controls linking the trigger to the popup surface, aria-label and aria-labelledby for naming icon-only triggers and for labelling groups from their group headers, aria-disabled on disabled items so they remain announced, aria-checked on MenuItemCheckbox, MenuItemRadio, and MenuItemSwitch rows to convey selection state, role menu on the list container, role menuitem, menuitemcheckbox, and menuitemradio on rows, and role group on grouped sections

**Screen Reader**: Screen readers announce the trigger as a menu button with its expanded or collapsed state, then announce the menu container and its items when it opens. Focus moves into the menu surface, and each row announces its role, accessible name, secondary text such as the shortcut hint, and its disabled or checked state where applicable. Group headers are announced as the label of the group they head, and submenu parents announce that they have a submenu. Because the menu manages focus programmatically, focus must always be returned to the trigger or the parent item when the surface closes.

## Styling

Visual customization usually happens on the composed parts rather than the Menu root: target MenuPopover for the surface, MenuList for the container, and MenuItem or its variants for rows, using makeStyles classes and Griffel tokens. Typical values are tokens.colorNeutralBackground1 for the popover surface, tokens.shadow16 for its elevation, tokens.borderRadiusMedium for its corners, tokens.spacingVerticalXS and tokens.spacingHorizontalM for row padding, tokens.colorNeutralBackground1Hover for hover and tokens.colorNeutralBackground1Selected plus tokens.colorNeutralForeground1Selected for selected rows, tokens.colorNeutralForeground1 for primary text, tokens.colorNeutralForeground2 or tokens.colorNeutralForeground3 for subText and secondaryContent, tokens.colorNeutralForegroundDisabled for disabled rows, tokens.fontSizeBase300 for label typography, and tokens.colorStrokeFocus2 with tokens.strokeWidthThin for focus outlines. Before writing custom styles for secondary text, try the built-in subText prop on MenuItem for a second descriptive line and the secondaryContent prop for keyboard shortcut hints. The surfaceMotion slot can be replaced with a Motion component for custom animation or set to null to remove animation entirely, and the inline prop changes whether the popup renders next to its trigger in DOM order instead of at the end of document.body, which affects stacking contexts and scroll behavior.

## Performance

Root menus render out of DOM order on document.body by default, which means the popup surface is moved in the DOM when it opens; use the inline prop when you need it to stay in place, for example inside scroll containers or during DOM-order-sensitive testing. Selectable items keep their selection state on the Menu root, so changing a checkbox or radio selection rerenders the items in that menu by default; memoizing item components with React.memo can avoid that churn when items are numerous or expensive, but rerendering menu items is generally cheap and memoization has its own cost, so apply it only when there is a concrete benefit. Positioning work increases with auto sizing and with custom overflow or flip boundaries, and menus with hoverDelay schedule timers on pointer enter and leave. Automatic repositioning on window resize is handled, but custom boundary resizing is not: you must call updatePosition through the positioning reference, and nested submenus may need a deferred update so the root menu is positioned before the submenu recalculates.

## Theming & Tokens

Menu surfaces and rows are built from the theme's neutral token ramp. The popover surface uses tokens.colorNeutralBackground1 with elevation from tokens.shadow16 and corners from tokens.borderRadiusMedium; rows use tokens.colorNeutralForeground1 for the label, tokens.colorNeutralBackground1Hover for pointer hover, tokens.colorNeutralBackground1Selected and tokens.colorNeutralForeground1Selected for selected checkbox and radio rows, and tokens.colorNeutralForegroundDisabled for disabled rows. Secondary text from subText and shortcut hints from secondaryContent typically resolve to tokens.colorNeutralForeground2 and tokens.colorNeutralForeground3 sized with tokens.fontSizeBase200 or tokens.fontSizeBase300. Focus indication uses tokens.colorStrokeFocus2 with tokens.strokeWidthThin, and disabled and pressed states blend against tokens.colorNeutralBackground1Pressed and tokens.colorNeutralBackground1Selected depending on the interaction. Because all of these are theme tokens, wrapping the menu in a Provider with a custom theme, a brand ramp override, or a dark theme recolors the popup, rows, and motion timing consistently without component-level style overrides.

## Migration Notes

Compared with the previous major version, Menu in v9 requires explicit composition: you render a MenuTrigger, a MenuPopover, and a MenuList, and place MenuItem-family rows inside the list instead of relying on implicit nesting. Icon and checkmark alignment moved to the Menu root as hasIcons and hasCheckmarks, and selection is now expressed through checkedValues and onCheckedValueChange on the root rather than per-item controlled props. MenuTrigger no longer presumes it should restore focus, so custom targets use the useRestoreFocusTarget hook, and MenuTrigger children must forward refs and spread the injected trigger props when they are custom components. Positioning configuration is now passed through the positioning prop (including a positioningRef and overflow or flip boundaries) instead of positional wrapper props. Surface animation is exposed as the surfaceMotion slot, which can be replaced with a Motion component or set to null to disable animation. Newer row variants such as MenuSplitGroup with a split submenu trigger and MenuItemSwitch were added for split actions and switch-styled selection.

## Edge Cases

- The inline prop is ignored for submenus; only root menus can be rendered in DOM order next to their trigger.
- Setting openOnContext removes all other open interactions, so click, Enter, and Space on the trigger no longer open the menu.
- persistOnItemClick only suppresses dismissal for item clicks; Escape and outside click still close the menu, and controlling the open state manually can defeat dismissal if the change hints are ignored.
- A custom anchor target requires handling the clickOutside change type in onOpenChange to avoid a close-then-reopen flicker, and requires the useRestoreFocusTarget attributes so focus returns correctly when the menu closes.
- Custom boundary resizing is not handled automatically; you must observe the boundary and call updatePosition through the positioning reference for both the root menu and any submenu.
- Custom components used as MenuTrigger children must forward refs and spread the injected trigger props, otherwise positioning and ARIA state are lost.
- The open prop is only a hint, so a truly static menu that never closes is possible but must be a deliberate choice, since it removes the user's ability to dismiss the surface.
- Grouped items rendered with MenuDivider alone will look separated but will not be announced as separate sections to screen readers.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
