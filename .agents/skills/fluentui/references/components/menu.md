# Menu

> **Package**: `@fluentui/react-menu` v9.25.0
> **Import**: `import { Menu } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

Menu is the root component of the Fluent UI React v9 menu family and the state container that coordinates a trigger, a popover surface, and the list of items rendered inside it. It does not render a DOM element of its own; instead it owns open/close state, focus management, positioning, and the accessible relationships that its descendants (MenuTrigger, MenuPopover, MenuList, MenuItem and the MenuItem variants) consume. Its children prop is intentionally constrained: it accepts either a MenuTrigger paired with a MenuPopover, or a MenuPopover alone when the menu is anchored to a custom target rather than a declarative trigger. Because it composes freely with MenuList, MenuGroup, MenuGroupHeader, MenuDivider, MenuItemCheckbox, MenuItemRadio, MenuItemSwitch, MenuItemLink, and MenuSplitGroup, a single Menu instance can express simple action menus, selection menus, navigation menus, context menus, and nested submenus. Opening behavior is configurable through open, defaultOpen, onOpenChange, openOnHover, openOnContext, hoverDelay, persistOnItemClick, and closeOnScroll, while positioning and the surfaceMotion slot control how and where the popover appears and how it animates.

**When to use**: Use Menu when you need to present a temporary, on-demand list of actions, commands, or options that is invoked from a trigger such as a Button or a MenuButton, and when the user is expected to make a single choice and then dismiss the surface. It is the right primitive for command menus (Cut, Copy, Paste), selection menus built from MenuItemCheckbox, MenuItemRadio, or MenuItemSwitch, navigation menus built from MenuItemLink, nested submenus built by nesting another Menu inside a MenuItem or MenuSplitGroup, and context menus via openOnContext. Prefer Menu over Popover when the content is a list of interactive items that should follow menu semantics and roving focus; prefer Popover when the content is arbitrary markup such as a form or explanatory panel. Prefer Dropdown, Select, or Combobox when the user is choosing a value for a form field rather than invoking a command. Prefer Toolbar or Nav when the actions or destinations should remain permanently visible instead of being revealed on demand. Avoid Menu for destructive confirmation flows that need their own explanation — a Dialog is a better fit.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `JSXElement \| [JSXElement, JSXElement]` | — | Yes | Can contain two children including `MenuTrigger` and `MenuPopover`. Alternatively can only contain `MenuPopover` if using a custom `target`. |
| `closeOnScroll` | `boolean \| undefined` | `false` | No | Close when scroll outside of it |
| `defaultOpen` | `boolean \| undefined` | `false` | No | Whether the popup is open by default |
| `hoverDelay` | `number \| undefined` | — | No | Sets the delay for mouse open/close for the popover one mouse enter/leave |
| `inline` | `boolean \| undefined` | `false` | No | Root menus are rendered out of DOM order on `document.body`, use this to render the menu in DOM order This option is disregarded for submenus |
| `onOpenChange` | `((e: MenuOpenEvent, data: MenuOpenChangeData) => void) \| undefined` | — | No | Call back when the component requests to change value The `open` value is used as a hint when directly controlling the component |
| `open` | `boolean \| undefined` | `false` | No | Whether the popup is open |
| `openOnContext` | `boolean \| undefined` | `false` | No | Opens the menu on right click (context menu), removes all other menu open interactions |
| `openOnHover` | `boolean \| undefined` | `false` | No | Opens the menu on hover |
| `persistOnItemClick` | `boolean \| undefined` | `false` | No | Do not dismiss the menu when a menu item is clicked |
| `positioning` | `PositioningShorthand \| undefined` | — | No | Configures the positioned menu |

### Prop Guidance

- **children**: Required. Accepts either two children — a MenuTrigger and a MenuPopover — for the standard triggered menu, or a single MenuPopover when the menu is anchored to a custom target and nothing is rendered as a declarative trigger. Anything else is not a supported composition. `MenuTrigger plus MenuPopover, or MenuPopover alone for a custom target`
- **open**: Use when you need full control of visibility, such as synchronizing the menu with an external control or reusing one menu instance behind several triggers. The value acts as a hint while you remain responsible for updating it from onOpenChange. `true`
- **defaultOpen**: Use when the menu should start open but remain uncontrolled afterwards. This is rarely needed in application code and is mostly useful for documentation, testing, or demos. `true`
- **onOpenChange**: Use with open to observe requests to open or close, including pointer, keyboard, outside click, and item activation sources. Inspect the event type in the callback data when you need to ignore or reinterpret specific close reasons, such as an outside click that lands on your own custom anchor. `(e, data) => setOpen(data.open)`
- **positioning**: Configures where and how the popover surface is positioned. Use it for auto-sizing behavior, custom boundary elements, flipping and overflow boundaries, and for supplying a positioning imperative ref so you can call updatePosition and setTarget yourself — the latter being required when you anchor the menu to an element outside the menu composition. `autoSize enabled, or a positioningRef plus custom overflow and flip boundaries`
- **inline**: Set when you need the menu to remain in DOM order instead of being portaled to the end of document.body, for example inside scroll containers, transformed ancestors, or CSS contexts that must cascade into the surface. It has no effect on submenus. `true`
- **openOnHover**: Enable for hover-driven menus such as menu bar patterns where the user sweeps across several triggers. Always pair it with a sensible hoverDelay so that incidental pointer movement does not open the surface. `true`
- **hoverDelay**: Sets the delay in milliseconds before the popover opens or closes on mouse enter and mouse leave. Meaningful only when hover interaction is in play, and useful for preventing flicker when the pointer briefly leaves the trigger on its way to the surface. `500`
- **openOnContext**: Enable to open the menu on right click and disable every other open interaction, producing a context menu. Because all other interactions are removed, you must provide a keyboard-reachable alternative if the same actions are only available through this menu. `true`
- **persistOnItemClick**: Set when activating an item should not dismiss the menu, which is typical for checkbox, radio, and switch items that the user toggles several times in one visit. Remember that selection state still has to be tracked through checkedValues and onCheckedValueChange. `true`
- **closeOnScroll**: Enable when the menu should dismiss itself if the page scrolls, which keeps a portaled surface from visually detaching from its trigger on long or dynamically sized pages. `true`
- **surfaceMotion**: Slot for the popover surface animation. Leave it at its default for the standard enter and exit transition, supply custom children to substitute your own motion, or set it to null to disable animation entirely when the transition conflicts with your layout. `null to disable the transition`

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

- Compose the menu with MenuTrigger and MenuPopover as its two children when there is a visible trigger; these are the only child shapes Menu accepts for the triggered case.
- When reusing one Menu instance in several places, pass only MenuPopover as a child, control it with open and onOpenChange, and anchor it with the positioning prop rather than duplicating the menu.
- Use MenuItemLink for destinations so the correct link semantics are rendered for screen reader and browser behavior, instead of putting onClick navigation on MenuItem.
- Set hasIcons when only a subset of the menu items contain an icon, and set hasCheckmarks when only a subset of the items are selectable, so labels stay aligned across the surface.
- Group related items with MenuGroup and MenuGroupHeader whenever the grouping carries meaning, and reserve MenuDivider by itself for purely visual separation.
- Add an aria-label to icon-only or split-submenu triggers such as the secondary MenuItem in a MenuSplitGroup so each trigger has a distinct accessible name.
- Leave the menu uncontrolled with defaultOpen unless you must synchronize the state with external UI, and when you do take control, always honor the hints delivered to onOpenChange.
- Use persistOnItemClick for checkbox, radio, and switch items that should not dismiss the surface, and control their state through checkedValues together with onCheckedValueChange.
- Tune openOnHover with hoverDelay so that glance-by pointer movement does not flash the surface open, and combine it with closeOnScroll for long pages where the trigger can scroll out of view.
- Limit nesting to two levels and extract submenus into their own components so the parent list stays readable and maintainable.

### Don'ts

- Don't nest submenus deeper than two levels; deep hierarchies are hard to navigate with a pointer and nearly unusable with a keyboard.
- Don't use openOnContext as the only way to reach the menu, because it removes all other open interactions and leaves keyboard-only users with no affordance.
- Don't drop MenuTrigger for a hand-rolled trigger without replicating its accessibility markup and keyboard interaction — the documented custom-target pattern requires extra work to keep the scenario accessible.
- Don't pass a custom child into MenuTrigger unless that component forwards refs and accepts the injected trigger props, otherwise the trigger will not open the menu or expose the right semantics.
- Don't reach for MenuDivider when the items form a logical group; without MenuGroup and MenuGroupHeader, screen reader users lose the section context.
- Don't use Menu as a replacement for Dropdown, Select, or Combobox in a form; those components carry the correct value and validation semantics for form fields.
- Don't wrap every item in React.memo by default, since re-rendering menu items is cheap and memoization only pays off for large selectable lists.
- Don't control open without also thinking through focus restoration and Escape handling; a fully controlled menu degrades quickly if the onOpenChange hints are ignored.
- Don't disable the surfaceMotion slot gratuitously; set it to null only when the animation actively conflicts with your layout or motion requirements.

## Anti-Patterns

### Using Menu as a form control

❌ Menu is not a value selector for forms. It renders no hidden input, exposes no validation or label association, and its selection state is not part of form submission, so a Menu used in place of a form field leaves the field unlabeled and unvalidated for assistive technology.

✅ Use Dropdown, Select, or Combobox for choosing a value in a form, and reserve Menu for commands and contextual actions. If a menu-like surface is required for a picker, wrap the real selection component inside the menu rather than faking the semantics with MenuItemRadio.

### Submenus nested more than two levels deep

❌ Each additional nesting level adds another focus trap to reason about, another surface that can overflow the viewport, and a navigation path that is slow with a pointer and disorienting with a keyboard. Positional fallbacks also become unpredictable at depth.

✅ Cap nesting at two levels and split the remaining hierarchy into a separate surface, a dedicated settings page, or a dialog. Extract each submenu into its own component so the parent list stays legible.

### Relying on context-only opening

❌ openOnContext removes all other open interactions, so users who cannot right click — keyboard-only users, touch users, and users of assistive technology — have no way to reach the menu contents.

✅ Always provide an alternative affordance for the same actions, such as a visible trigger button, a keyboard shortcut, or the actions surfaced in a Toolbar, and keep the context menu as an accelerator rather than the only path.

### Faking logical grouping with dividers

❌ MenuDivider is purely visual and carries no accessible markup, so items separated only by a divider are announced as one flat run of menu items with no indication that they belong to different sections.

✅ Use MenuGroup with MenuGroupHeader when the separation conveys meaning, and use MenuDivider alone only when the break is purely aesthetic. When both are needed, a divider can visually separate groups whose headers already provide the semantics.

### Hand-rolled triggers with no accessibility work

❌ Replacing MenuTrigger, or passing a custom component that does not forward refs and accept the injected trigger props, breaks opening, roving focus, and the announced relationship between the trigger and the menu. The documented custom-target pattern explicitly warns that accessibility becomes your responsibility.

✅ Prefer MenuTrigger and let it inject the correct interaction and accessibility attributes into native elements, Fluent components, or a render-function child. If you truly need a custom trigger, implement ref forwarding, supply an accessible name, and reproduce the keyboard interactions yourself.

### Controlling open state without honoring the hints

❌ A controlled Menu whose open value is never updated from onOpenChange will appear frozen — items activate but the surface never closes, Escape appears broken, and focus can be stranded inside a menu the user cannot dismiss. Extra effort is required to keep interactions and keyboard accessibility intact.

✅ Only take control of open when an external synchronization requirement exists, update the state from onOpenChange, and filter close reasons deliberately (for example ignoring clickOutside events originating from your own custom anchors) instead of swallowing all hints.

## Accessibility

**Requirements**: Menu must be operable by keyboard alone (WCAG 2.1.1) with a visible focus indicator (WCAG 2.4.7), and the trigger must expose an accessible name that describes the menu it opens. The trigger, not the menu surface, is the tab stop; once opened, focus moves into the list and roving focus carries the user through items. Every menu must remain dismissible with Escape (WCAG 1.4.13 / 2.1.2), and the auto-opening behaviors (openOnHover, openOnContext) must never be the only way to invoke the menu. Selection state in MenuItemCheckbox, MenuItemRadio, and MenuItemSwitch must be programmatically exposed, which means driving them with checkedValues and onCheckedValueChange rather than local visual state. Icon-only triggers must supply an aria-label, and any custom trigger that replaces MenuTrigger must reproduce the injected accessibility attributes and keyboard handling itself.

| Key | Action |
| --- | --- |
| `Enter` | On a closed trigger, opens the menu and places focus on the first item; while open, activates the focused menu item. |
| `Space` | On a closed trigger, opens the menu; while open, activates the focused menu item. |
| `ArrowDown` | Moves focus to the next item in the list, opening a submenu when focus lands on a submenu trigger. |
| `ArrowUp` | Moves focus to the previous item in the list, opening a submenu when appropriate. |
| `ArrowRight` | Opens the submenu of the focused item; inside an open submenu it can move focus into that submenu. |
| `ArrowLeft` | Closes the current submenu and returns focus to its parent item in the parent menu. |
| `Home` | Moves focus to the first item in the current menu surface. |
| `End` | Moves focus to the last item in the current menu surface. |
| `Escape` | Closes the current menu surface and returns focus to the element that opened it; pressing Escape in a submenu returns to the parent menu. |
| `Tab` | Closes the menu without activating an item and moves focus to the next focusable element in the page. |
| `Typeahead (printable characters)` | Moves focus to the next item whose label begins with the typed characters. |

**ARIA**: aria-haspopup, aria-expanded, aria-controls, aria-label, aria-disabled, role with menu and menuitem semantics

**Screen Reader**: The popover surface is announced as a menu and each interactive child is announced as a menu item with its label, disabled state, icon text, secondary content, and submenu indicator. MenuItemCheckbox items announce a checked state, MenuItemRadio items announce a selected state within their named group, and MenuItemSwitch items announce an on/off state, all driven by the checkedValues map and the name and value props. MenuGroupHeader text is announced as a group heading so users hear the section a set of items belongs to, which is why logical groupings should never be faked with MenuDivider alone. When a submenu opens, its parent item is announced as expanded, and focus announcements follow the movement into the nested surface. Because MenuTrigger injects the correct interaction and accessibility attributes into its child automatically, a native element or Fluent component used as the trigger is announced as a button (or the appropriate role) that controls a menu.

## Styling

Menu itself renders no DOM, so visual customization happens on the descendants: put className or style on MenuPopover for the popover surface, on MenuList for the list container, and on individual MenuItem, MenuItemCheckbox, MenuItemRadio, MenuItemSwitch, or MenuItemLink instances for row-level styling. On the surface, tokens.colorNeutralBackground1 and tokens.borderRadiusMedium define the base look, tokens.shadow16 supplies the elevated shadow, and tokens.colorNeutralStroke1 works as a subtle 1px border when the surface needs definition against a busy background. For density, adjust MenuList and MenuItem padding with tokens.spacingVerticalXS and tokens.spacingHorizontalS; for typography, MenuItem relies on tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300, while secondaryContent and subText use tokens.colorNeutralForeground2 and the smaller text tokens. Selected or checked item affordances commonly use tokens.colorNeutralBackground1Selected or tokens.colorBrandBackground2 with tokens.colorBrandForeground2 for the icon and checkmark. Disabled rows should use tokens.colorNeutralForegroundDisabled. If the default transition does not match your product motion, customize it through the surfaceMotion slot (for example by returning a fade or blur atom from the motion components preview package) or remove it entirely by setting surfaceMotion to null.

## Performance

Menu keeps its surface unmounted while closed, so the cost of the composition is paid only when the user opens it; the popover is portaled to document.body by default, which avoids layout work inside deep or scrollable ancestors, but inline can be preferable when portaling causes layout thrash or forces repositioning on every scroll. Positioning recalculation runs on open, on window resize, and on scroll while open, and auto-sizing behavior is opt-in through the positioning prop, so enable it only when the surface must adapt to its content. Nested submenus are positioned lazily but their responsiveness to custom boundaries is not automatic — you must observe the boundary and call updatePosition on the positioning refs, and deferring the nested update until after the root menu has been positioned avoids a double layout pass. Rendering many items is generally cheap, and re-rendering all items whenever a selectable menu changes state is by design; React.memo is worth considering only for large selectable lists with stable props, since memoization itself has a cost. Keep item counts moderate and avoid embedding heavy interactive content inside items, because every item participates in roving focus and in the keyboard navigation order.

## Theming & Tokens

Menu inherits everything from the nearest FluentProvider, so the popover surface, item states, and focus rings all derive from theme tokens rather than hard-coded colors. The surface resolves to tokens.colorNeutralBackground1 with tokens.shadow16 for elevation and tokens.borderRadiusMedium for corner rounding; item text uses tokens.colorNeutralForeground1 with tokens.colorNeutralForeground2 for secondaryContent and subText; disabled items resolve to tokens.colorNeutralForegroundDisabled. Hover and pressed states on items map to tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed, and selected checkbox or radio items typically map to tokens.colorNeutralBackground1Selected or to tokens.colorBrandBackground2 with tokens.colorBrandForeground2 for the indicator. Focus indication uses the theme focus stroke token (tokens.colorStrokeFocus2) with tokens.borderRadiusMedium for the outline shape, and dividers resolve to tokens.colorNeutralStroke2 or tokens.colorNeutralStroke1 depending on contrast needs. Spacing inside items and the surface comes from tokens.spacingHorizontalS, tokens.spacingHorizontalMNudge, and tokens.spacingVerticalXS/SNudge, so density follows the theme without overriding component styles.

## Migration Notes

Earlier generations of Fluent UI shipped a monolithic Menu (and ContextualMenu) configured through a large set of props. In v9 the menu is a composition: Menu only supplies state and context, and the structure is expressed by MenuTrigger, MenuPopover, MenuList, MenuItem, and the MenuItem variants. If you are porting an existing menu, expect to rebuild it as that composition rather than mapping props one to one. State handling maps cleanly — open, defaultOpen, and onOpenChange exist on Menu — but placement and alignment are now expressed with the positioning prop instead of a scattering of alignment and boundary props, and controlling the menu is a matter of passing open while still acting on the onOpenChange hints. Because root menus are rendered out of DOM order on document.body by default, scenarios that previously relied on the menu living inside the surrounding DOM (CSS inheritance, ancestor selectors, or scroll containers) may need the inline prop instead. Menus nested inside other menus are treated as submenus and ignore inline, and their responsiveness to shrinking containers is handled automatically against the viewport but requires manual updatePosition calls plus a ResizeObserver when you supply custom boundaries.

## Edge Cases

- Root menus are rendered out of DOM order on document.body by default, so descendant selectors, inherited CSS, and container-based scroll behavior may not reach the surface; set inline to render the menu in DOM order. Note that inline is disregarded for submenus.
- A Menu whose only child is MenuPopover has no declarative trigger, which means the trigger markup, keyboard interactions, and accessible relationship must be implemented by hand — and the menu must be anchored through the positioning prop, typically with a positioning ref and setTarget.
- Hover and context opening change the interaction model rather than adding to it: openOnHover makes hover the primary open gesture, and openOnContext removes all other open interactions, so an alternate route to the same actions is required for keyboard and touch users.
- Controlled open state is only a hint loop — if onOpenChange results are not applied back to open, the menu cannot close, Escape appears broken, and focus can be stranded inside the surface.
- persistOnItemClick keeps the surface open after activation, which is the correct behavior for MenuItemCheckbox, MenuItemRadio, and MenuItemSwitch but means selection state must be tracked with checkedValues and onCheckedValueChange rather than inferred from the menu closing.
- Nested submenus adapt automatically to the viewport as it shrinks (moving alignment, flipping position, and finally positioning above the parent), but no automatic response is provided for custom boundary elements; you must observe the boundary and call updatePosition on the relevant positioning refs, deferring the nested update until the parent menu has been positioned.
- MenuSplitGroup places a main action next to a submenu trigger, and the secondary trigger is rendered from a MenuItem that usually has no visible label, so it must be given an aria-label to be announceable.
- closeOnScroll defaults to false, which means a menu anchored to a trigger in a scrolling region can visually detach from its trigger while remaining open.
- There is no hasIcons-style alignment for secondary content, and menu items without icons or checkmarks sit flush against the left edge of the list, so mixed item shapes in one surface can look misaligned unless hasIcons or hasCheckmarks is applied consistently.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
