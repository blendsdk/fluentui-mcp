# MenuGroupHeader

> **Package**: `@fluentui/react-menu` v9.25.0
> **Import**: `import { MenuGroupHeader } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

MenuGroupHeader is a non-interactive, presentational label that introduces a cluster of related items inside a menu. It is designed to sit at the top of a MenuGroup, above the MenuList or list of MenuItem children that the header describes, so users can scan a long menu and quickly recognize distinct sections such as editing actions, sharing actions, or destructive actions. The component renders a single root element (a div by default) whose only content is the text passed through children — it exposes no interactive behavior, holds no state, takes no tab stop, and performs no focus management of its own. Because it is not a menu item, it is skipped by the menu's arrow-key roving focus and is not counted toward the menu's item count; it functions purely as a visual and structural separator/label for the items that follow it.

**When to use**: Use MenuGroupHeader when a menu is long enough that its items fall into two or more logical clusters and labels genuinely help users find the right action faster — for example an overflow menu with separate 'Edit', 'Share', and 'Delete' sections. Place it as the first child of a MenuGroup so the header visually and structurally belongs to the items under it, and keep it inside a proper menu container (Menu plus MenuPopover plus MenuList) so the surrounding keyboard model remains intact. Do not use it as a substitute for an actionable MenuItem, MenuItemLink, MenuItemCheckbox, or MenuItemRadio — those are the components that carry interaction, selection state, submenus, and disabled behavior. If you only need a single, undifferentiated list of actions, omit group headers entirely; they add visual noise and extra browsing without adding navigation value. For headings outside of a menu context, use typography components such as Text or a real heading element instead.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `checkedItems` | `string[]` | — | Yes | — |
| `checkedValues` | `Record<string, string[]>` | — | No | — |
| `children` | `[JSXElement, JSXElement] \| JSXElement` | — | Yes | — |
| `closeOnScroll` | `boolean` | — | No | — |
| `defaultCheckedValues` | `Record<string, string[]>` | — | No | — |
| `defaultOpen` | `boolean` | — | No | — |
| `disableButtonEnhancement` | `boolean` | — | No | — |
| `disabled` | `boolean` | — | No | — |
| `disabledFocusable` | `boolean` | — | No | — |
| `focusFirst` | `() => void` | — | No | — |
| `hasCheckmarks` | `boolean` | — | No | — |
| `hasIcons` | `boolean` | — | No | — |
| `hasSubmenu` | `boolean` | — | No | — |
| `hoverDelay` | `number` | — | No | — |
| `href` | `string` | — | Yes | — |
| `inline` | `boolean` | — | No | — |
| `name` | `string` | — | Yes | — |
| `name` | `string` | — | Yes | — |
| `onCheckedValueChange` | `(e: MenuCheckedValueChangeEvent, data: MenuCheckedValueChangeData) => void` | — | No | — |
| `onOpenChange` | `(e: MenuOpenEvent, data: MenuOpenChangeData) => void` | — | No | — |
| `open` | `boolean` | — | No | — |
| `openOnContext` | `boolean` | — | No | — |
| `openOnHover` | `boolean` | — | No | — |
| `persistOnClick` | `boolean` | — | No | — |
| `persistOnItemClick` | `boolean` | — | No | — |
| `positioning` | `PositioningShorthand` | — | No | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `switchIndicator` | `Slot<'span'>` | — | No | — |
| `value` | `string` | — | Yes | — |

### Prop Guidance

- **children**: The visible label for the group. Keep it to a short phrase or a single word in sentence case. Only text or inline, non-interactive content belongs here — never buttons, links, inputs, or menu items, and never multi-sentence explanations. `Edit`
- **root**: The single required slot that renders the header container; it defaults to a div. Use it to attach a className for spacing or emphasis, or to override the rendered element when you deliberately want different semantics. Because it is the only slot, all styling and layout changes go through it. `div`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Place the header as the first child of a MenuGroup, immediately before the MenuList or items it labels, so it reads as belonging to that cluster.
- Keep the label to one short phrase or a single word, using sentence case and no trailing punctuation, so it fits on one line inside the popover.
- Use one header per genuinely distinct cluster of items, and keep each cluster to a handful of related actions so the group stays scannable.
- Order groups predictably — for example common, non-destructive actions first and destructive actions last — so users can build a stable mental model of the menu.
- Let the header inherit its subdued styling from the theme rather than making it look like an actionable row.
- Use the required root slot only for structural purposes, such as overriding the rendered element or attaching a className for spacing adjustments.
- Keep labels unambiguous on their own, since arrow-key users move between items and may not re-read the header each time.
- Test the menu with a screen reader in browse mode to confirm the header text is read in a sensible order relative to the items it labels.

### Don'ts

- Do not put buttons, links, inputs, checkboxes, or any other focusable content inside the header; the header holds text only.
- Do not use MenuGroupHeader as a stand-in for a disabled or unavailable MenuItem — it is not focusable and cannot communicate a disabled state.
- Do not pass menu-level or item-level props such as open, defaultOpen, onOpenChange, positioning, hoverDelay, inline, openOnHover, closeOnScroll, checkedValues, defaultCheckedValues, checkedItems, hasCheckmarks, hasIcons, onCheckedValueChange, disabled, disabledFocusable, hasSubmenu, persistOnClick, persistOnItemClick, switchIndicator, or disableButtonEnhancement to this component; those belong to Menu, MenuPopover, MenuList, MenuItem, MenuItemCheckbox, MenuItemRadio, MenuItemSwitch, or MenuSplitGroup.
- Do not place two headers back to back with no items between them; that creates an empty group and a confusing reading order.
- Do not write long sentences or multi-line descriptions in the header; move explanatory text into the item labels or a Tooltip instead.
- Do not style the header with hover, pressed, or selected visuals, since that falsely signals it is clickable.
- Do not put essential instructions exclusively in a group header, because keyboard users navigating with arrow keys move directly between items and can skip it.
- Do not render MenuGroupHeader outside of a menu container, where it degrades to an unassociated block of text with no menu semantics.

## Anti-Patterns

### Interactive content inside the header

❌ Placing a button, link, or input inside a MenuGroupHeader breaks the menu's keyboard model: arrow-key roving focus only visits menu items, so the nested control is unreachable by ArrowUp/ArrowDown, and its semantics conflict with the surrounding menu. The header also does not trap or manage focus, so Enter and Space will not behave as users expect.

✅ Keep the header text-only and place any actionable content after it as a MenuItem, MenuItemLink, MenuItemCheckbox, or MenuItemRadio so it participates in the menu's focus order and typeahead.

### Using the header as a disabled item

❌ Rendering MenuGroupHeader where an unavailable action used to be makes the label look actionable while providing no focus target, no disabled announcement, and no way to explain why the action is unavailable. Screen reader users hear a label with no corresponding action and may assume a control is missing.

✅ Use MenuItem with disabled or disabledFocusable for unavailable actions, and reserve MenuGroupHeader for labeling clusters of items that do exist.

### Passing menu- or item-level props to the header

❌ Props such as open, defaultOpen, onOpenChange, positioning, hoverDelay, inline, openOnHover, closeOnScroll, persistOnItemClick, checkedValues, defaultCheckedValues, checkedItems, hasCheckmarks, hasIcons, onCheckedValueChange, disabled, disabledFocusable, hasSubmenu, persistOnClick, switchIndicator, name, value, href, and disableButtonEnhancement describe Menu, MenuPopover, MenuList, MenuItem, MenuItemCheckbox, MenuItemRadio, MenuItemSwitch, or MenuSplitGroup behavior. The header renders a single non-interactive root, so these props have no effect here and silently hide intent that should live elsewhere.

✅ Configure openness, positioning, hover, and selection on the owning Menu, MenuPopover, and MenuList, and put interaction, selection state, and disabled behavior on the relevant MenuItem family component.

### Depending on the header to carry required context

❌ Because keyboard users move between MenuItems with the arrow keys and skip the header entirely, information that exists only in the header is effectively invisible to them. A user who arrows directly to an item such as 'Delete' will not have heard that the item lives under a 'Danger zone' header.

✅ Make each item label self-explanatory, and use the header only as a supplementary scanning aid rather than as the source of essential context or warnings.

### Making the header look clickable

❌ Applying hover backgrounds, pressed states, or item-like foreground colors to the header signals interactivity that does not exist, leading users to click a row that does nothing and undermining trust in the menu.

✅ Keep the header visually subdued and static — quiet foreground color, smaller semibold typography, and spacing only — and leave hover and pressed tokens to real MenuItems.

## Accessibility

**Requirements**: MenuGroupHeader is a labeling element, not an interactive control, so it carries no focus, no tab stop, and no disabled state. Its root slot renders a non-interactive container that is not exposed as a menu item and is not included in the menu's item count or arrow-key sequence. Because the header is skipped during roving focus, the visible text must never be the sole carrier of information needed to choose an action; the menu item labels themselves must remain self-describing. Header text renders as small text, so any color override must still meet WCAG AA contrast (at least 4.5:1) against the menu popover background in both light and dark themes and in Windows High Contrast / forced-colors modes. When the menu is used in a right-to-left locale, text alignment and any logical padding should mirror automatically through the provider.

| Key | Action |
| --- | --- |
| `ArrowDown` | Moves focus to the next MenuItem and skips over the header, since the header is not a focusable item. |
| `ArrowUp` | Moves focus to the previous MenuItem and skips over the header. |
| `Home` | Moves focus to the first focusable item in the menu; if the header is the first child, focus lands on the first item after it. |
| `End` | Moves focus to the last focusable item in the menu; the header is never a valid destination. |
| `Enter` | Activates the currently focused MenuItem; the header itself never receives Enter because it is not focusable. |
| `Space` | Activates the currently focused MenuItem; the header itself never receives Space. |
| `Escape` | Closes the menu from anywhere inside it, including while focus is on an item beneath a header. |
| `Tab` | Leaves the menu and returns focus to the trigger; the header is not part of the tab order. |
| `Letter keys` | Typeahead matches visible MenuItem text and ignores header text, so headers do not interfere with letter-based navigation. |

**ARIA**: role="presentation" on the root slot — the header is intentionally not announced as a menu item or as a group of its own., The header text comes from children and should be the only accessible content; do not add aria-hidden that would hide it from browse-mode reading., If you need a programmatic name for the cluster, set it on the owning group (MenuGroup) or the menu itself rather than on the header., aria-disabled is not applicable — MenuGroupHeader has no disabled state; use disabled or disabledFocusable on MenuItem instead., aria-expanded / aria-haspopup are not applicable — the header never owns a submenu; use a submenu-bearing Menu or MenuItem for that.

**Screen Reader**: In normal browse/reading mode the header is read as plain text in document order, so a user moving through the menu top to bottom hears the section label and then the items beneath it. During arrow-key interaction the header is skipped entirely: the screen reader announces only the focused menu item (for example 'menu item, Edit, 1 of 5') and never pauses on the header, and the header is not counted in the item total. This means labels must be short and the items themselves must be understandable without the header, since a user who arrows straight to an item may never hear the group label. Overriding the root slot to render a real heading element changes how the text is announced (as a heading rather than as plain text) and should be validated against the surrounding menu semantics before shipping.

## Styling

MenuGroupHeader renders only the required root slot, so all customization flows through the root element's className. Keep overrides minimal: the header is intended to read as a quiet label, not as Chrome. Subdued color is typically set with tokens.colorNeutralForeground3 (or colorNeutralForeground4 for even lower emphasis) while keeping the value dark enough to satisfy 4.5:1 contrast against the popover background. Typography is usually tuned with tokens.fontSizeBase200, tokens.lineHeightBase200, and tokens.fontWeightSemibold or tokens.fontWeightMedium, with the family coming from tokens.fontFamilyBase. Spacing should use Griffel's shorthands.padding with spacing tokens such as tokens.spacingVerticalXS, tokens.spacingHorizontalM, and tokens.spacingVerticalS so the header's indentation lines up with the start padding of the MenuItem rows beneath it. Merge your own class with the component's classes (mergeClasses) rather than replacing them, so theme-driven typography and color still apply. Use logical, inline-start padding so the header mirrors correctly under FluentProvider dir="rtl". Avoid hover, pressed, or selected tokens (for example colorNeutralBackground1Hover) on the header, and prefer text-overflow with tokens.lineHeightBase200-based line clamping if a label must stay on one line.

## Performance

MenuGroupHeader is one of the lightest components in the library: it is stateless, uses no hooks for focus or positioning, renders a single root element, and adds no portal or event listeners. Its cost is effectively the cost of one more div in the popover subtree, so it can be used freely across large menus without measurable impact. The real rendering cost of a grouped menu comes from the surrounding Menu, MenuPopover, and MenuList — positioning, portal mounting, and focus management — not from headers. Avoid re-creating className strings or style objects on every render, and avoid heavy custom content inside children, since the header has no memoization of its own. Because headers add no tab stops or menu items, they do not lengthen the roving-focus sequence or the menu's item count.

## Theming & Tokens

MenuGroupHeader consumes typography and color from the surrounding FluentProvider theme rather than defining its own appearance variants. Subdued label color typically resolves through tokens.colorNeutralForeground3 (with tokens.colorNeutralForeground4 available for even lower emphasis), text sizing through tokens.fontSizeBase200 with tokens.lineHeightBase200, weight through tokens.fontWeightSemibold, and family through tokens.fontFamilyBase. Spacing uses tokens.spacingVerticalXS, tokens.spacingVerticalS, and tokens.spacingHorizontalM, which shift with the theme's density settings, so headers stay aligned with MenuItem rows in both comfortable and compact densities. In dark themes and forced-colors modes the neutral foreground tokens remap automatically to maintain contrast; if you override the color with a hard-coded value you lose that remapping and risk failing contrast in high-contrast mode. Under FluentProvider dir="rtl", inline-start padding and text alignment flip automatically as long as you use logical spacing properties instead of hard-coded left/right values.

## Migration Notes

There is no v8 equivalent of MenuGroupHeader as a standalone component — group headings in v8 menus were typically faked with a disabled ContextualMenuItem or a styled div, which polluted the menu's item count and keyboard navigation. In v9, MenuGroupHeader is a dedicated presentational component that renders outside the item sequence, so it is never focusable and never counted as an item. When migrating from an ad-hoc heading, remove any role, tabIndex, disabled, or onClick attributes that were used to make the old heading behave like an item, and place the new component as the first child of a MenuGroup above a MenuList.

## Edge Cases

- The prop list associated with this entry is an aggregate that also contains props from Menu, MenuPopover, MenuList, MenuItem, MenuItemCheckbox, MenuItemRadio, MenuItemSwitch, and MenuSplitGroup; MenuGroupHeader itself supports only the required root slot and children, so the remaining props have no effect on it.
- A header placed as the first child of a group produces no focusable target, so pressing ArrowDown immediately after opening a menu moves focus to the first real item beneath it rather than stopping on the header text.
- Long header labels widen the menu popover and can push it against viewport edges; keep labels short or clamp them, since the header has no internal truncation behavior of its own.
- Two consecutive headers with no items between them create an empty group that reads as a stray label; always follow a header with at least one menu item.
- Overriding the root slot to render a heading element can improve document outline semantics, but it changes how assistive technology announces the text and must be verified against the menu's existing roles and item counts before shipping.
- Typeahead matches only item text, so a user who types the first letter of a header phrase will not land on the header — always duplicate critical keywords in item labels if typeahead discovery matters.
- Headers are not counted in the menu's item total, so a menu that reads as 'five items' to a screen reader may visually appear to contain more rows.
- In RTL layouts the header mirrors via logical properties, but any hard-coded left padding or text-align override will break the alignment with MenuItem rows.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
