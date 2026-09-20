# SplitButton

> **Package**: `@fluentui/react-button` v9.9.2
> **Import**: `import { SplitButton } from '@fluentui/react-components';`
> **Category**: buttons
> **Stability**: stable

## Overview

SplitButton is a compound Fluent UI React v9 button that pairs a primary action with a secondary menu of related actions in one visually joined control. It renders as a root container (root) that wraps two interactive halves: a primaryActionButton for the single most likely action and a menuButton that opens a Menu containing the remaining, less frequent actions. The component exposes the same visual language as Button through the appearance, size, shape, and iconPosition props, plus two extra content slots, menuIcon (the chevron-like glyph rendered in the menu half) and secondaryContent, so the two halves can carry distinct labels while staying visually unified. Because it is designed to work with Menu and MenuTrigger, the menu half receives the trigger props returned by MenuTrigger, which is what wires up expansion, positioning, and dismissal behavior. SplitButton is a convenience composition rather than a new interaction model: it expects the caller to supply the Menu, MenuPopover, MenuList, and MenuItem tree that the menu half opens.

**When to use**: Use SplitButton when one action in a group is clearly the default or most frequent (for example, 'Send' versus 'Schedule send' or 'Save' versus 'Save as'), and the remaining actions are variations that belong in a menu. It is the right choice when you want to reduce the number of visible buttons while still giving the most common action a one-click path. Prefer Button when there is exactly one action and no menu, MenuButton when every action is a menu choice and none deserves prominence, CompoundButton when you need a title plus a secondary description line, and ToggleButton or the Toolbar toggle variants when the control reflects an on/off state rather than triggering commands. SplitButton is also a natural fit for toolbars, card headers, and dialog footers where space is constrained but secondary actions must remain discoverable.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `'secondary' \| 'primary' \| 'outline' \| 'subtle' \| 'transparent'` | `'secondary'` | No | — |
| `checked` | `boolean` | — | No | — |
| `contentContainer` | `NonNullable<Slot<'span'>>` | — | Yes | — |
| `defaultChecked` | `boolean` | — | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `disabledFocusable` | `boolean` | `false` | No | — |
| `iconPosition` | `'before' \| 'after'` | `'before'` | No | — |
| `isAccessible` | `boolean` | — | No | — |
| `menuButton` | `Slot<typeof MenuButton>` | — | No | — |
| `menuIcon` | `Slot<'span'>` | — | No | — |
| `primaryActionButton` | `Slot<typeof Button>` | — | No | — |
| `root` | `NonNullable<Slot<'div'>>` | — | Yes | — |
| `secondaryContent` | `Slot<'span'>` | — | No | — |
| `shape` | `'rounded' \| 'circular' \| 'square'` | `'rounded'` | No | — |
| `size` | `ButtonSize` | `'medium'` | No | — |
| `size` | `ButtonSize` | `'medium'` | No | — |

### Prop Guidance

- **appearance**: Controls visual emphasis for both halves of the split button. The default secondary is appropriate for most toolbar and form contexts; primary should be reserved for the single most important action in a view; outline removes the background styling for a lighter look; subtle minimizes emphasis so the button blends into the surface until hover or focus; transparent removes both background and border. Pick one appearance per button group and keep it stable. `primary`
- **size**: Sets the control height and font scale. medium is the default and is the safe choice for most surfaces, large suits prominent call-to-action areas and dialog footers, and small is a dense variant. The small size is documented as not meeting WCAG target size requirements, so only use it where an equally accessible alternate path exists or the user has selected a compact theme. `medium`
- **shape**: Controls corner treatment of the joined control. rounded is the default and pairs with standard layouts, circular produces a pill shape that reads well for standalone calls to action, and square removes corner rounding for dense or grid-aligned surfaces such as data grids and toolbars. Keep the shape consistent with neighboring controls. `circular`
- **iconPosition**: Places the icon slot before or after the label text within the text half of the split button. Use before (the default) for leading affordances that categorize the action, and after for trailing affordances such as direction or disclosure indicators. This prop does not affect the menu icon inside the menu half. `after`
- **icon**: Slot for the leading or trailing glyph in the text half of the split button, positioned according to iconPosition. When an icon is supplied without accompanying text, add an accessible name through the primaryActionButton slot so the action is still announced. `CalendarMonthRegular`
- **menuIcon**: Slot for the glyph rendered inside the menu half of the split button, after the label. The default affordance is a chevron; replace it only when a different glyph communicates the menu more clearly in your context, such as a filter or overflow icon. `FilterRegular`
- **disabled**: Renders the split button as unavailable and removes it from the sequential tab order. Use it when the action is truly inapplicable. In toolbars, menus, or command bars, prefer disabledFocusable so keyboard and screen reader users keep a stable tab order. `true`
- **disabledFocusable**: Disables the split button visually and functionally while keeping it focusable and announced as unavailable. This preserves tab order, which matters when the control sits next to other commands whose positions users rely on, such as in a toolbar or command bar. `true`
- **primaryActionButton**: Slot for the left-hand half that executes the default action. Use it to pass native button props such as an aria-label for icon-only instances, a ref when you need to anchor a Tooltip, and a className when you need to control label wrapping. If you have no meaningful primary action, use a MenuButton instead of a SplitButton. `{ 'aria-label': 'Create event' }`
- **menuButton**: Slot for the right-hand half that opens the menu of secondary actions. Forward the trigger props returned by MenuTrigger into this slot; replacing it with an arbitrary button breaks menu opening and the expanded-state announcement. `triggerProps from MenuTrigger`
- **root**: Slot for the container element that wraps both halves. Use it to attach a className for layout, width constraints, or alignment in a toolbar or flex row, rather than styling the two button halves separately and risking a visual seam. `className from makeStyles`
- **contentContainer**: Slot for the inner element that holds the label text and icon inside the text half of the button. It is a required structural slot, so override it only when you need to change how text and icon are grouped or wrapped. `span wrapper for text plus icon`
- **secondaryContent**: Slot for additional content rendered alongside the main label in the text half, useful for a trailing hint, count, or keyboard shortcut indicator that should not be the primary readable label. Keep secondary content short so the label remains the dominant readable text. `shortcut hint such as a key combination`
- **checked**: Controlled state flag exposed in the prop types for split-button state. Pair it with onChange-style handlers when you need the component's state driven externally; in the common command-button scenario you typically leave it unset. `true`
- **defaultChecked**: Provides an initial uncontrolled state when the state does not need to be controlled by the parent. Use either defaultChecked or checked, not both, to avoid conflicting sources of truth. `false`
- **isAccessible**: An accessibility-related flag surfaced in the component's prop types. Leave it at its default so the component applies its built-in accessible rendering and ARIA wiring; override it only if you have a specific, verified reason to change the default accessibility composition. `default value`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `menuButton` | — | No | Button that opens menu with secondary actions in SplitButton. |
| `primaryActionButton` | — | No | Button to perform primary action in SplitButton. |
| `root` | — | Yes | Root of the component that wraps the primary action button and menu button. |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, SplitButton } from '@fluentui/react-components';
import type { MenuButtonProps } from '@fluentui/react-components';

export const Default = (): JSXElement => (
  <Menu positioning="below-end">
    <MenuTrigger disableButtonEnhancement>
      {(triggerProps: MenuButtonProps) => (
        <SplitButton menuButton={triggerProps} primaryActionButton={primaryActionButtonProps}>
          Example
        </SplitButton>
      )}
    </MenuTrigger>

    <MenuPopover>
      <MenuList>
        <MenuItem>Item a</MenuItem>
        <MenuItem>Item b</MenuItem>
      </MenuList>
    </MenuPopover>
  </Menu>
);
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import type { MenuButtonProps } from '@fluentui/react-components';

export const Appearance = (): JSXElement => {
  const styles = useStyles();

  return (
    <div className={styles.wrapper}>
      <Menu positioning="below-end">
        <MenuTrigger disableButtonEnhancement>
          {(triggerProps: MenuButtonProps) => <SplitButton menuButton={triggerProps}>Default</SplitButton>}
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu positioning="below-end">
        <MenuTrigger disableButtonEnhancement>
          {(triggerProps: MenuButtonProps) => (
            <SplitButton menuButton={triggerProps} appearance="primary">
              Primary
            </SplitButton>
          )}
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu positioning="below-end">
        <MenuTrigger disableButtonEnhancement>
          {(triggerProps: MenuButtonProps) => (
            <SplitButton menuButton={triggerProps} appearance="outline">
              Outline
            </SplitButton>
          )}
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu positioning="below-end">
        <MenuTrigger disableButtonEnhancement>
          {(triggerProps: MenuButtonProps) => (
            <SplitButton menuButton={triggerProps} appearance="subtle">
              Subtle
            </SplitButton>
          )}
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu positioning="below-end">
        <MenuTrigger disableButtonEnhancement>
          {(triggerProps: MenuButtonProps) => (
            <SplitButton menuButton={triggerProps} appearance="transparent">
              Transparent
            </SplitButton>
          )}
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story:
        '- `(undefined)`: the split button appears with the default style\n' +
        '- `primary`: emphasizes the split button as a primary action.\n' +
        '- `outline`: removes background styling.\n' +
        '- `subtle`: minimizes emphasis to blend into the background until hovered or focused\n' +
        '- `transparent`: removes background and border styling.\n',
    },
  },
};
```

### Disabled

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import type { MenuButtonProps } from '@fluentui/react-components';

export const Disabled = (): JSXElement => {
  const styles = useStyles();

  return (
    <div className={styles.wrapper}>
      <Menu positioning="below-end">
        <MenuTrigger disableButtonEnhancement>
          {(triggerProps: MenuButtonProps) => <SplitButton menuButton={triggerProps}>Enabled state</SplitButton>}
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Menu positioning="below-end">
        <MenuTrigger disableButtonEnhancement>
          {(triggerProps: MenuButtonProps) => (
            <SplitButton menuButton={triggerProps} disabled>
              Disabled state
            </SplitButton>
          )}
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Menu positioning="below-end">
        <MenuTrigger disableButtonEnhancement>
          {(triggerProps: MenuButtonProps) => (
            <SplitButton menuButton={triggerProps} disabledFocusable>
              Disabled focusable state
            </SplitButton>
          )}
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
};

Disabled.parameters = {
  docs: {
    description: {
      story: `A split button can be \`disabled\` or \`disabledFocusable\`.
              \`disabledFocusable\` is used in scenarios where it is important to keep a consistent tab order
              for screen reader and keyboard users. The primary example of this pattern is when
              the disabled split button is in a menu or a commandbar and is seldom used for standalone buttons.`,
    },
  },
};
```

## Best Practices

### Do's

- Reserve the primaryActionButton half for the single most frequent, least destructive, and most reversible action in the group.
- Pass the trigger props provided by MenuTrigger into the menuButton slot so the menu half opens, expands, and dismisses correctly.
- Use MenuTrigger with button enhancement disabled, because SplitButton already renders its own menu button and does not need an extra wrapper button.
- Pair the menu half with a Menu using a defined positioning such as below-end so the popover appears anchored to the split button.
- Supply an aria-label on the primaryActionButton whenever the button renders an icon with no visible text.
- Choose appearance consistently across a group of buttons — for example, only one primary SplitButton per view — so emphasis stays meaningful.
- Use disabledFocusable instead of disabled for SplitButtons that live in toolbars, menus, or command bars, so tab order stays stable for keyboard and screen reader users.
- Keep the menu short and label the actions with verbs that describe the outcome, so the split between primary and secondary is obvious.

### Don'ts

- Do not use SplitButton when there is no meaningful default action; a MenuButton communicates 'all options live in a menu' more honestly.
- Do not place destructive or irreversible operations in the primary half, since a single accidental click or Enter press executes them.
- Do not replace the menuButton slot with a plain Button, because the menu will not open and the expanded state will not be announced.
- Do not render an icon-only SplitButton without a text alternative; an unlabeled chevron half gives screen reader users no information about what opens.
- Do not use size small where WCAG target size requirements apply unless an equally accessible alternative path to the same action exists or the user has selected a compact theme.
- Do not stack multiple primary SplitButtons next to each other in the same region; competing emphasis defeats the purpose of an accent appearance.
- Do not use appearance values to communicate status or severity — appearance is visual emphasis, not semantics.
- Do not cram unrelated commands into the menu half; keep the menu conceptually tied to the primary action.

## Anti-Patterns

### SplitButton used with no real default action

❌ When every action is equally plausible, the primary half is a guess. Users click the wrong thing or, worse, learn to ignore it and always open the menu, which defeats the component's purpose and adds a second target for no benefit.

✅ Use MenuButton when all actions belong in a menu and none deserves a one-click path. Reserve SplitButton for cases where one action is genuinely dominant.

### Icon-only split button with no accessible name

❌ Both halves become unlabeled buttons. The primary half especially, when it carries only an icon, is announced without any indication of what it does, and the menu half's chevron gives no context to screen reader users.

✅ Provide an aria-label on the primaryActionButton slot for any icon-only instance, and add a Tooltip for sighted users. The menu half should keep its default menu-button semantics and chevron so its purpose is announced.

### Custom menu half instead of the trigger-provided props

❌ Substituting an arbitrary button for the menuButton slot (or forgetting to forward the trigger props from MenuTrigger) means the menu never opens, aria-expanded never flips, and the button looks interactive but does nothing.

✅ Forward the trigger props returned by MenuTrigger into the menuButton slot and disable button enhancement on the trigger so only one button is rendered per half.

### Destructive action promoted to the primary half

❌ Delete, remove, or overwrite operations fire on a single click or Enter press with no confirmation, and they sit in the most prominent visual position, inviting accidental activation.

✅ Keep the primary half for safe, frequent, reversible actions and place destructive operations in the menu half, ideally behind confirmation or with clear destructive labeling.

### Small size shipped where target size matters

❌ The small size is documented as not meeting WCAG target size requirements, and a split button already divides its hit area between two targets, making misclicks more likely on touch and for users with motor impairments.

✅ Default to medium or large, and only use small when an equally accessible alternative path to the same action exists or the user has opted into a compact theme.

## Accessibility

**Requirements**: SplitButton renders two independent focusable controls, so it must satisfy target size (2.5.8 / 2.5.5), focus visible (2.4.7), and name/role/value (4.1.2) requirements. The often-cited minimum target size guidance is that the default medium and large sizes are compliant, while the small size is documented as not meeting WCAG target size requirements; only ship it when an equivalent accessible alternative exists or the user opted into a compact theme. Every icon-only instance must expose an accessible name via aria-label on the primaryActionButton, and the menu half must remain reachable and operable by keyboard alone. Because the two halves are separate targets, ensure adequate spacing so users with motor impairments do not hit the wrong half. Disabled styling must not be the only signal that an action is unavailable — the accessible name should still be exposed when using disabledFocusable.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus from the primary action half to the menu half and then out of the component. |
| `Shift+Tab` | Moves focus backwards from the menu half to the primary action half and then out of the component. |
| `Enter` | Activates the focused half: executes the primary action, or opens the menu when the menu half has focus. |
| `Space` | Activates the focused half: executes the primary action, or opens the menu when the menu half has focus. |
| `ArrowDown` | Opens the menu from the menu half and moves focus into the first menu item. |
| `ArrowUp / ArrowDown` | Moves focus between items once the menu is open. |
| `Home / End` | Moves focus to the first or last item of the open menu list. |
| `Escape` | Closes the open menu and returns focus to the menu half of the SplitButton. |

**ARIA**: aria-label — required on the primaryActionButton when the SplitButton is icon-only, as shown in the icon stories., aria-disabled — applied by the component when disabledFocusable is used so the button stays focusable but is announced as unavailable., aria-haspopup — set on the menu half to announce that activating it opens a menu., aria-expanded — reflects whether the menu is currently open., aria-controls — associates the menu half with the popover element it opens.

**Screen Reader**: Screen readers encounter two separate buttons in sequence. The primary half is announced with its visible label (or the provided aria-label) and is activated directly. The menu half is announced as a menu button, typically with the suffix that it has a popup or that it is collapsed/expanded, so users know a further action is required to reveal options. When the menu opens, focus moves into the menu list and items are read as menu items; on Escape or after activation, focus returns to the menu half. Using disabledFocusable keeps both halves in the tab order so screen reader users can still discover them, whereas disabled removes them from the sequential focus order entirely and may be skipped without announcement.

## Styling

SplitButton accepts a className on its root as well as on its slots, so most customization happens by targeting a slot rather than fighting the component. Use Griffel's makeStyles and pass a class into the primaryActionButton slot to control label wrapping and maximum width — the long-text story does exactly this to let the label wrap after it hits the component's maximum width. Font sizing follows tokens.fontSizeBase200 for small, tokens.fontSizeBase300 for medium, and tokens.fontSizeBase400 for large, with tokens.fontWeightSemibold used for the emphasized label. Horizontal rhythm inside each half comes from tokens.spacingHorizontalSNudge, tokens.spacingHorizontalMNudge, and tokens.spacingHorizontalL for the gaps between the icon, label, and menu icon. Corners come from tokens.borderRadiusSmall, tokens.borderRadiusMedium, and tokens.borderRadiusCircular matching the shape prop. The visual seam between the two halves is drawn with a border using tokens.colorNeutralStroke1 on a background of tokens.colorNeutralBackground1, and the focus indicator uses tokens.colorStrokeFocus2 with tokens.strokeWidthThin. When composing the SplitButton inside a toolbar or a stretched layout, adjust the root slot's width and alignment rather than setting widths on the halves individually, so the two halves stay visually joined.

## Performance

SplitButton itself is lightweight: it renders one container element and two native button elements, so the cost is equivalent to two Buttons. The menu half is where weight accumulates — the MenuPopover content should be kept small and is best composed so the popover only mounts its items when the menu is opened. Avoid allocating new inline objects and functions for slot props (primaryActionButton, menuButton, menuIcon) on every render, because slot objects are diffed and re-created references can cause unnecessary re-renders of both halves; hoist stable objects or memoize them. In long lists and grids, prefer rendering a SplitButton in a single row header or toolbar rather than per row, since each instance brings its own menu machinery. Avoid re-mounting the component by key when only labels change.

## Theming & Tokens

SplitButton derives all color, spacing, and typography from theme tokens, so an app-level FluentProvider theme flows through both halves automatically. The primary appearance maps to tokens.colorBrandBackground with hover and pressed states from tokens.colorBrandBackgroundHover and tokens.colorBrandBackgroundPressed, and its label uses tokens.colorNeutralForegroundOnBrand. The default secondary appearance uses tokens.colorNeutralBackground1 with tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed, a border from tokens.colorNeutralStroke1, and a label from tokens.colorNeutralForeground1. Outline drops the fill and keeps tokens.colorNeutralStroke1 with a transparent background; subtle leans on tokens.colorSubtleBackground with tokens.colorSubtleBackgroundHover and tokens.colorSubtleBackgroundPressed and a tokens.colorNeutralForeground2 label; transparent uses tokens.colorTransparentBackground with the corresponding hover and pressed transparent tokens. Disabled styling comes from tokens.colorNeutralBackgroundDisabled paired with tokens.colorNeutralForegroundDisabled. Typography scales with the size prop via tokens.fontSizeBase200, tokens.fontSizeBase300, and tokens.fontSizeBase400, with tokens.fontFamilyBase and tokens.fontWeightSemibold applied to the label. Corner radii come from tokens.borderRadiusSmall, tokens.borderRadiusMedium, tokens.borderRadiusCircular, the seam between halves uses token-driven borders, and focus rectangles use tokens.colorStrokeFocus2 and tokens.strokeWidthThin.

## Migration Notes

In v9, SplitButton is a slot-based component: root, primaryActionButton, and menuButton are the three slots you can override, and content, icon, and menuIcon descend into the button halves. If you are migrating from an older Fluent release, the largest shift is that the menu is no longer bundled with the button — you now author a Menu, MenuTrigger, MenuPopover, MenuList, and MenuItem yourself and forward the trigger props into the menuButton slot, with button enhancement explicitly disabled on the trigger. Appearance values have been standardized (the default is secondary, with primary, outline, subtle, and transparent available), sizes are small, medium, and large via the size prop, and corner treatment is expressed through the shape prop (rounded, circular, or square) instead of ad hoc CSS. Disabled states are split between disabled and disabledFocusable, the latter preserving tab order for toolbars and menus.

## Edge Cases

- An icon-only SplitButton has no readable label on the text half; the icon stories solve this by adding an aria-label on the primaryActionButton slot and attaching a Tooltip with an inaccessible relationship so the label is not announced twice.
- Long labels wrap only after hitting the component's maximum width, and the wrapping behavior is applied through the primaryActionButton slot's className rather than through a dedicated prop on the split button itself.
- The small size is explicitly documented as not meeting WCAG target size requirements, so treat it as a conditional variant that needs an accessible alternate path or a user-selected compact theme.
- disabled removes the split button from the tab order entirely, while disabledFocusable keeps it focusable and announced as unavailable; choose deliberately because the two produce noticeably different keyboard journeys.
- Because the menu half is optional in the slot model, it is possible to render the component without a menu, but that produces a plain-looking button with split styling — use Button in that case.
- The component does not own the menu; positioning, item selection, and dismissal all come from the Menu and MenuTrigger you compose, so behavior differences in the popover are a Menu concern rather than a SplitButton one.
- Both halves are separate hit targets, so tight layouts or negative margins that reduce the gap between them increase the chance of activating the wrong action.

## See Also

- [buttons category](../categories/buttons.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
