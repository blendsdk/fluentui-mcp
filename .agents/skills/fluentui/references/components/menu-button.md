# MenuButton

> **Package**: `@fluentui/react-button` v9.9.2
> **Import**: `import { MenuButton } from '@fluentui/react-components';`
> **Category**: buttons
> **Stability**: stable

## Overview

MenuButton is a Fluent UI React v9 button that is purpose-built to open a menu. It looks and behaves like a standard Button — it shares the same appearance, size, shape and iconPosition props — but it also provides a dedicated menuIcon slot that renders a trailing indicator (a chevron by default) plus an optional secondaryContent slot for supplementary content next to the label. MenuButton is designed to be used as the trigger child of MenuTrigger inside a Menu, where it is normally paired with disableButtonEnhancement, MenuPopover, MenuList and MenuItem to form a complete menu experience. Under the hood it also exposes slots for more advanced layouts (root, contentContainer, menuIcon, and the menuButton and primaryActionButton slots used for split-button-style composition), so it can act as the trigger half of a split button when a primary action must live beside the menu. It supports small, medium and large sizes, five appearances, three shapes, before/after icon placement, and both disabled and disabledFocusable states.

**When to use**: Use MenuButton when a single control should reveal a list of related actions or options on activation — for example a filter menu, an overflow/actions menu, or a dropdown of commands attached to a table row or card. Reach for Button instead when activation performs one immediate action with no menu. Use SplitButton when you need a default primary action plus a menu of alternatives next to it, CompoundButton when the control needs a second explanatory line of text, and ToggleButton when you need a persistent on/off state rather than a popup. MenuButton is the right choice whenever the primary intent of the click is to open a menu, because the trailing menuIcon and the trigger wiring communicate that popup affordance to both sighted and assistive-technology users.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `'secondary' \| 'primary' \| 'outline' \| 'subtle' \| 'transparent'` | — | No | — |
| `checked` | `boolean` | — | No | — |
| `contentContainer` | `NonNullable<Slot<'span'>>` | — | Yes | — |
| `defaultChecked` | `boolean` | — | No | — |
| `disabled` | `boolean` | — | No | — |
| `disabledFocusable` | `boolean` | — | No | — |
| `iconPosition` | `'before' \| 'after'` | — | No | — |
| `isAccessible` | `boolean` | — | No | — |
| `menuButton` | `Slot<typeof MenuButton>` | — | No | — |
| `menuIcon` | `Slot<'span'>` | — | No | — |
| `primaryActionButton` | `Slot<typeof Button>` | — | No | — |
| `root` | `NonNullable<Slot<'div'>>` | — | Yes | — |
| `secondaryContent` | `Slot<'span'>` | — | No | — |
| `shape` | `'rounded' \| 'circular' \| 'square'` | — | No | — |
| `size` | `ButtonSize` | — | No | — |
| `size` | `ButtonSize` | — | No | — |

### Prop Guidance

- **appearance**: Controls the visual weight of the button. Leave it unset for the default style that most menu triggers should use. Use primary to emphasize a single important menu, outline to remove background styling and rely on a border, subtle to minimize emphasis so the button blends into the background until hovered or focused, and transparent to remove both background and border styling entirely. `primary`
- **size**: Sets the control height and typography scale. Accepts small, medium and large, with medium as the default. Use small inside toolbars and dense table rows, medium for standard page and form contexts, and large for prominent standalone menus. Keep the size consistent with adjacent buttons and inputs in the same layout. `medium`
- **shape**: Controls corner rounding. The default rounded shape suits text labels; circular is intended for icon-only menu buttons; square removes rounding for layouts that need hard-edged controls. Avoid circular together with a text label. `circular`
- **iconPosition**: Places the icon slot before or after the label text. The default is before the text; choose after only when the icon acts as a suffix rather than a leading identifier, and remember that the menuIcon already occupies the trailing position. `after`
- **menuIcon**: Slot for the trailing glyph that communicates the popup. It renders after the label and defaults to a chevron. Replace it only when a different glyph still clearly signals a menu, such as a filter icon on a filter menu. `FilterRegular`
- **secondaryContent**: Optional span slot for small supplementary content rendered with the label inside the button, useful for adding a compact piece of context next to the primary text without changing the label itself. `badge`
- **contentContainer**: Required span slot that wraps the label content inside the button root. It is populated automatically; override it only when you need to attach styles or a ref to the label wrapper, not to replace its structure. `span`
- **root**: Required outer slot of the control, and the element that receives the className passed to MenuButton. Treat it as read-only for structure and use className plus design tokens for customization. `div`
- **menuButton**: Slot representing the menu-opening portion of the underlying split-button-shaped structure. It exists so the component can be composed as the menu half of a split control; leave it at its default for a standard MenuButton. `MenuButton`
- **primaryActionButton**: Optional Button slot for the primary-action half of a split-button-style composition, used when a default action must sit beside the menu. Omit it for a plain MenuButton that only opens a menu. `Button`
- **disabled**: Marks the button as non-interactive and removes it from the tab order. Use it when the control genuinely should be skipped, such as a menu that is irrelevant in the current context. `true`
- **disabledFocusable**: Keeps the button in the tab order while preventing activation, exposing aria-disabled instead of the native disabled attribute. Preferred inside toolbars, menus and command bars where a stable tab sequence matters for keyboard and screen reader users. `true`
- **checked**: Controlled state flag on the underlying button state model. It is not needed for a plain menu trigger; when a menu needs to reflect persistent selection, express that with the state of the menu items themselves rather than on the trigger. `true`
- **defaultChecked**: Uncontrolled counterpart to checked on the button state model. Leave it unset for normal menu-trigger usage, where the button does not carry a selected state. `false`
- **isAccessible**: Advanced accessibility flag carried on the underlying button state. Standard menu-trigger wiring already supplies the required ARIA attributes, so this should not be set in typical usage. `true`

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Menu, MenuButton, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';

export const Default = (): JSXElement => (
  <Menu>
    <MenuTrigger disableButtonEnhancement>
      <MenuButton>Example</MenuButton>
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
import { makeStyles, Menu, MenuButton, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';
import { bundleIcon, CalendarMonthFilled, CalendarMonthRegular } from '@fluentui/react-icons';

export const Appearance = (): JSXElement => {
  const styles = useStyles();

  return (
    <div className={styles.wrapper}>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton icon={<CalendarMonthRegular />}>Default</MenuButton>
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton appearance="primary" icon={<CalendarMonthRegular />}>
            Primary
          </MenuButton>
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton appearance="outline" icon={<CalendarMonth />}>
            Outline
          </MenuButton>
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton appearance="subtle" icon={<CalendarMonth />}>
            Subtle
          </MenuButton>
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton appearance="transparent" icon={<CalendarMonth />}>
            Transparent
          </MenuButton>
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
        '- `(undefined)`: the menu button appears with the default style\n' +
        '- `primary`: emphasizes the menu button as a primary action.\n' +
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
import { makeStyles, Menu, MenuButton, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';

export const Disabled = (): JSXElement => {
  const styles = useStyles();

  return (
    <div className={styles.wrapper}>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton>Enabled state</MenuButton>
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton disabled>Disabled state</MenuButton>
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem>Item a</MenuItem>
            <MenuItem>Item b</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton disabledFocusable>Disabled focusable state</MenuButton>
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
      story: `A menu button can be \`disabled\` or \`disabledFocusable\`.
              \`disabledFocusable\` is used in scenarios where it is important to keep a consistent tab order
              for screen reader and keyboard users. The primary example of this pattern is when
              the disabled menu button is in a menu or a commandbar and is seldom used for standalone buttons.`,
    },
  },
};
```

## Best Practices

### Do's

- Compose MenuButton with the full Menu family — Menu, MenuTrigger with disableButtonEnhancement, MenuPopover, MenuList, and MenuItem — so the trigger wiring, focus management, and popup semantics are all handled for you.
- Choose the appearance deliberately: leave appearance unset for the standard style used by most menu triggers in a page, and reserve appearance set to primary for the single most important menu on a view.
- Match density with size: small for compact surfaces such as toolbars and table rows, medium (the default) for general forms and page headers, and large for prominent call-to-action menus.
- Give every MenuButton a short, specific label that names the menu contents or purpose, and add an icon in the icon slot when the label benefits from faster visual scanning.
- When a MenuButton has an icon but no visible text, wrap it in a Tooltip whose relationship prop is set to label so the control still has an accessible name.
- Prefer disabledFocusable over disabled when the button lives in a toolbar, menu, or command bar where keeping a consistent tab order matters for keyboard and screen reader users.
- Use the secondaryContent slot for small supplementary elements beside the label, and use the menuIcon slot when the trailing glyph needs to communicate a specific kind of menu, such as a filter icon on a filter menu.
- Apply your own layout constraints with makeStyles and a className that carries a sensible maxWidth so long labels wrap predictably rather than stretching the surrounding layout.

### Don'ts

- Don't forget disableButtonEnhancement on MenuTrigger when the child is a MenuButton — without it the trigger applies its own enhancements on top of the already-styled button.
- Don't set appearance to primary on every MenuButton in a view; multiple primary menu buttons destroy the visual hierarchy the appearance scale exists to create.
- Don't ship an icon-only MenuButton without an accessible name — an icon slot with no children and no Tooltip label leaves screen reader users with an unnamed button.
- Don't use shape set to circular together with a text label; circular is meant for icon-only controls and produces an awkwardly wide pill around multi-word text.
- Don't use MenuButton to navigate to a URL or to fire a single immediate action — use Link, a MenuItemLink inside the menu, or a plain Button instead.
- Don't remove the default menuIcon chevron unless you are replacing it with another glyph that still reads as a menu affordance, because it is the main visual cue that the control opens a popup.
- Don't replace or heavily restyle the required root and contentContainer slots to change layout; style the root with a className and Griffel tokens so internal spacing and icon placement stay intact.
- Don't stack extra interactive controls inside the label text of a MenuButton — every click on the button opens the menu, so nested controls inside it become unreachable or ambiguous.

## Anti-Patterns

### MenuTrigger without disableButtonEnhancement

❌ MenuTrigger enhances its child button by default. When the child is already a MenuButton, the trigger enrichment duplicates styling and behavior on top of the component, producing an inconsistent trigger.

✅ Always set disableButtonEnhancement on MenuTrigger when the child is a MenuButton, as shown in every MenuButton story, and let MenuButton own its own appearance and trailing menu icon.

### Unnamed icon-only menu button

❌ An icon-only MenuButton renders a button whose accessible name comes only from its children. With the icon in the icon slot and no text, assistive technology announces an unnamed button, and users cannot tell what the control does.

✅ Wrap the icon-only MenuButton in a Tooltip with its relationship prop set to label so the content string becomes the accessible name, and choose an icon that clearly represents the menu contents.

### Primary appearance everywhere

❌ Applying appearance set to primary to many menu buttons removes the visual hierarchy the appearance scale exists to provide, so no menu reads as the dominant action on the page.

✅ Reserve primary for the single most important menu in a view, use the default (unset) appearance for the rest, and fall back to subtle or transparent inside dense surfaces such as toolbars.

### MenuButton used as a plain action or a link

❌ MenuButton exists to open a menu. Using it to fire a single action or to navigate makes the trailing chevron misleading, because activating it will not reveal anything.

✅ Use Button for a single immediate action, Link or a MenuItemLink for navigation, and keep MenuButton only for controls that actually reveal a MenuList of items.

### Using disabled instead of disabledFocusable in toolbars

❌ Plain disabled removes the button from the tab order, so keyboard users tabbing through a toolbar lose their place and screen reader users never learn the control exists.

✅ Prefer disabledFocusable when the disabled menu button sits in a toolbar, menu or command bar, so the tab order stays stable and the state is conveyed through aria-disabled.

### Restyling internal slots to change layout

❌ Replacing or heavily overriding the required root and contentContainer slots breaks the internal arrangement that positions the icon, label, and trailing menuIcon, and can also break focus and disabled styling.

✅ Pass a className to MenuButton so styles land on the root slot, and express visual changes through appearance, shape, size and Griffel tokens instead of restructuring the slots.

## Accessibility

**Requirements**: MenuButton renders a native button element, so it inherits native button semantics and must always have an accessible name — either visible text content or, for icon-only usage, a label delivered through a Tooltip with relationship set to label. Text and icon contrast must meet WCAG 2.1 AA (4.5:1 for text, 3:1 for meaningful non-text graphics and the focus indicator). The control must be fully operable from the keyboard and must show a visible focus indicator at all times. When a menu button is non-interactive, use disabledFocusable so the element stays focusable and exposes aria-disabled=true, keeping a consistent tab order for keyboard and screen reader users; use disabled only when removing it from the tab order is acceptable. Never convey the disabled, selected, or expanded state through color or styling alone.

| Key | Action |
| --- | --- |
| `Enter` | Activates the focused MenuButton; when wired through MenuTrigger, opens the menu. |
| `Space` | Activates the focused MenuButton; when wired through MenuTrigger, opens the menu. |
| `ArrowDown` | When used as a Menu trigger, opens the menu and moves focus to the first menu item. |
| `ArrowUp` | When used as a Menu trigger, opens the menu and moves focus to the last menu item. |
| `Escape` | Closes the open menu and returns focus to the MenuButton. |
| `Tab` | Moves focus to the next focusable element in the document; an open menu is dismissed, and a disabled MenuButton is skipped while a disabledFocusable one is retained in the tab order. |

**ARIA**: aria-haspopup, aria-expanded, aria-disabled, aria-label

**Screen Reader**: Because MenuButton renders a real button, screen readers announce the accessible name followed by the button role. When it is wired as a Menu trigger, the trigger also exposes aria-haspopup so users hear that activating it opens a menu, plus aria-expanded which toggles between false and true as the popup opens and closes. With disabledFocusable the element remains in the tab order and is announced as disabled through aria-disabled rather than being skipped. Icon-only menu buttons announce whatever accessible name is supplied by visible text or by the label relationship on the wrapping Tooltip. Once inside the opened menu, focus moves to the menu items themselves and standard menu semantics take over, so the MenuButton only needs to communicate its own name, role, popup affordance, and expanded state.

## Styling

Style MenuButton with makeStyles and Griffel rather than inline styles; a className passed to MenuButton lands on the root slot, which is the element that owns background, border, radius, and font treatment. Most surface-level customization is better expressed by choosing an appearance than by rewriting colors: the standard appearance resolves to tokens.colorNeutralBackground1 with tokens.colorNeutralForeground1 and a tokens.colorNeutralStroke1 border, primary resolves to tokens.colorBrandBackground with tokens.colorBrandForeground1, subtle resolves to tokens.colorSubtleBackground, and transparent resolves to tokens.colorTransparentBackground with no border. Hover and pressed feedback come from the matching state tokens such as tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed for neutral surfaces, and tokens.colorBrandBackgroundHover and tokens.colorBrandBackgroundPressed for primary. Radius comes from tokens.borderRadiusMedium for the default rounded shape and tokens.borderRadiusCircular for the circular shape, so if you override corner treatment use those same tokens rather than hard-coded pixel values. Typography uses tokens.fontFamilyBase with tokens.fontSizeBase300 (tokens.fontSizeBase400 at large size) and tokens.fontWeightSemibold for emphasis. Spacing inside the button uses tokens.spacingHorizontalS, tokens.spacingHorizontalMNudge, and tokens.spacingHorizontalSNudge, and the trailing menuIcon is separated from the label with the same spacing scale. For long labels, add a className that sets a sensible maxWidth and let the content wrap; avoid fixed pixel widths and avoid truncating labels that users need in order to choose the right menu. Focus rings are drawn with tokens.colorStrokeFocus2, and if you are styling a container around the button, give it tokens.lineHeightBase300-aware spacing so the button does not clip. When you must reach into internals, the contentContainer, menuIcon, secondaryContent, and root slots accept their own className, but prefer tokens over raw values there as well. All interactive state styling should rely on the built-in state tokens so that high-contrast and forced-colors modes keep working.

## Performance

MenuButton itself is inexpensive to render: it composes a button root with a small number of span slots and, unlike a plain icon button, an extra trailing menuIcon slot. Keep the element counts stable by defining icons as module-level elements rather than creating new element trees on every render, and avoid inline object or function values for slots that would force the button's internal slot merge to recompute. The menu surface is not part of the button's visible output until the menu is opened, so heavy MenuList content does not inflate the initial render of the trigger; still, keep very large menus lean by favoring flat lists and grouping with MenuGroup and MenuGroupHeader rather than deeply nested structures. Because MenuButton is frequently rendered in repeated rows such as table action columns, hoist per-row callbacks and avoid re-creating style hooks inside loops. Memoizing the trigger component is worthwhile when a parent re-renders often, since the button's props are almost entirely primitive and stable.

## Theming & Tokens

MenuButton consumes Fluent design tokens through the theme provided by FluentProvider, so it restyles automatically in light, dark, and high-contrast themes. Surface colors resolve through tokens.colorNeutralBackground1 for the default appearance, tokens.colorBrandBackground for primary, tokens.colorSubtleBackground for subtle, and tokens.colorTransparentBackground for transparent, with the outline appearance relying on tokens.colorNeutralStroke1 for its border. Text uses tokens.colorNeutralForeground1 for neutral appearances and tokens.colorBrandForeground1 for primary, while icons and the trailing menuIcon typically inherit the same foreground token. Hover, pressed and focus states are driven by token pairs such as tokens.colorNeutralBackground1Hover with tokens.colorNeutralBackground1Pressed, and tokens.colorBrandBackgroundHover with tokens.colorBrandBackgroundPressed, plus tokens.colorStrokeFocus2 for the focus indicator. Disabled treatment comes from tokens.colorNeutralBackgroundDisabled, tokens.colorNeutralForegroundDisabled, and tokens.colorNeutralStrokeDisabled. Corners use tokens.borderRadiusMedium for the rounded shape and tokens.borderRadiusCircular for the circular shape, and typography follows tokens.fontFamilyBase with tokens.fontSizeBase300 and tokens.fontSizeBase400 across the size scale. Spacing between icon, label, and menuIcon uses the tokens.spacingHorizontal* ramp, and motion for state changes uses tokens.durationNormal with tokens.curveEasyEase.

## Migration Notes

MenuButton in v9 is a composition-first component. The v8 pattern of passing menuProps, menuAs, and open/defaultOpen to the button is gone; instead the menu is declared as siblings using Menu, MenuTrigger, MenuPopover, MenuList and MenuItem, with MenuTrigger wrapped around the MenuButton and disableButtonEnhancement set so the trigger does not re-style the button. Menu content is no longer configured through props, so any logic that previously lived in menuProps now lives in the MenuList children. Split-button scenarios that v8 expressed with a primaryAction-style prop map in v9 to composing SplitButton, or to using the primaryActionButton and menuButton slots that MenuButton exposes. Styling has also moved from styles-object or theme-className overrides to Griffel makeStyles and design tokens, so custom CSS that targeted v8 class names should be rewritten as token-based Griffel rules applied through className.

## Edge Cases

- An icon-only MenuButton with no children has no accessible name; pair it with a Tooltip using the label relationship, as shown in the icon story.
- Long labels wrap once they reach the component's max width, so control wrapping with a className that sets maxWidth and avoid narrow fixed widths that force multi-word labels into many lines.
- disabled removes the button from the tab order while disabledFocusable keeps it focusable and exposes aria-disabled; pick deliberately, and do not set both at once.
- Combining iconPosition set to after with a custom menuIcon places two glyphs after the label, which usually reads as two separate affordances.
- shape set to circular is designed for icon-only usage; a circular button containing text becomes an unnecessarily wide pill.
- A className passed to MenuButton applies to the root slot, not the label; to style the label wrapper specifically you must target the contentContainer slot.
- The trailing chevron provided through the menuIcon slot is the primary cue that activation opens a popup; replacing it with an unrelated glyph can make users expect a direct action.
- checked and defaultChecked exist on the button state surface but a plain menu trigger has no selected state, so relying on them to indicate selection usually produces a button that looks toggled while the menu itself shows no selection.
- The primaryActionButton and menuButton slots allow split-button-style composition; supplying only one half can produce a visually unbalanced control, so use them together or not at all.

## See Also

- [buttons category](../categories/buttons.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
