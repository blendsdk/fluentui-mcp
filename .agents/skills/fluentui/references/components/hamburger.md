# Hamburger

> **Package**: `@fluentui/react-nav` v9.4.0
> **Import**: `import { Hamburger } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

Hamburger is the Fluent UI React v9 navigation control that renders the familiar stacked-lines glyph inside an interactive root and is the canonical way to open and close a collapsible navigation region. It is icon-only, so its visual footprint is a single square target that sits naturally in a NavDrawerHeader, a top app bar, or beside a product logo in an app shell. The component exposes two real slots: root, the interactive element that carries the semantics for the control, and icon, the span that paints the glyph, plus an href string so the same control can either toggle a drawer or act as a navigation destination. Because Hamburger is consumed inside the Nav and NavDrawer composition, the recorded prop surface for this entry also carries the property bag of the surrounding navigation family — value, selectedValue, defaultSelectedValue, defaultSelectedCategoryValue, selectedCategoryValue, defaultOpenCategories, openCategories, onNavItemSelect, onNavCategoryItemToggle, multiple, density, the trailing navItem/actionButton/toggleButton/menuButton slots and their tooltip companions, and the expandIconMotion and collapseMotion presence-motion slots. Those selection, expansion, density, and motion props are configured on Nav, NavCategory, NavCategoryItem, NavItem, NavSubItem, and NavSubItemGroup; the toggle itself only needs to reflect the drawer's open state and offer a clear, well-named target.

**When to use**: Reach for Hamburger when the navigation itself is collapsible — most commonly on narrow viewports where the full Nav is hidden inside an OverlayDrawer, or in an app shell where the rail can be collapsed to give content more room. It is the right choice whenever a single compact control must reveal and hide a whole navigation surface, and it pairs directly with NavDrawerHeader, InlineDrawer, OverlayDrawer, Nav, and NavDrawer. Choose Button when the action is a normal command such as Save or Submit; choose MenuButton when the trigger opens a Menu rather than a drawer; choose Link when the destination should be visible as text; and choose ToggleButton when the control changes a persistent setting instead of showing or hiding a region. Inside a nav tree, use the expandIcon and expandIconMotion slots on NavCategoryItem for expanding a category rather than placing a Hamburger there — the hamburger glyph means 'global navigation', not 'expand this section'. Use exactly one Hamburger per collapsible navigation region so the affordance stays predictable across every page of the product.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `actionButton` | `Slot<ButtonProps>` | — | No | — |
| `actionButtonTooltip` | `Slot<TooltipProps>` | — | No | — |
| `categoryValue` | `NavCategoryContextValue` | — | Yes | — |
| `children` | `React_2.ReactNode \| null` | — | No | — |
| `collapseMotion` | `Slot<PresenceMotionSlotProps<NavSubItemGroupCollapseMotionParams>>` | — | No | — |
| `defaultOpenCategories` | `NavItemValue[]` | — | No | — |
| `defaultSelectedCategoryValue` | `NavItemValue` | — | No | — |
| `defaultSelectedValue` | `NavItemValue` | — | No | — |
| `density` | `NavDensity` | — | No | — |
| `expandIcon` | `NonNullable<Slot<'span'>>` | — | Yes | — |
| `expandIconMotion` | `Slot<PresenceMotionSlotProps>` | — | No | — |
| `href` | `string` | — | No | — |
| `href` | `string` | — | No | — |
| `href` | `string` | — | No | — |
| `icon` | `Slot<'span'>` | — | No | — |
| `icon` | `Slot<'span'>` | — | No | — |
| `menuButton` | `Slot<MenuButtonProps>` | — | No | — |
| `menuButtonTooltip` | `Slot<TooltipProps>` | — | No | — |
| `multiple` | `boolean` | — | No | — |
| `navCategoryItem` | `NavCategoryItemContextValue` | — | Yes | — |
| `navItem` | `NonNullable<Slot<NavItemProps & NavSubItemProps>>` | — | No | — |
| `onNavCategoryItemToggle` | `EventHandler<OnNavItemSelectData>` | — | No | — |
| `onNavItemSelect` | `EventHandler<OnNavItemSelectData>` | — | No | — |
| `openCategories` | `NavItemValue[]` | — | No | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `NonNullable<Slot<'button'>>` | — | Yes | — |
| `root` | `Slot<'h2', 'h1' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'div'>` | — | Yes | — |
| `root` | `NonNullable<Slot<'div'>>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `selectedCategoryValue` | `NavItemValue` | — | No | — |
| `selectedValue` | `NavItemValue` | — | No | — |
| `tabbable` | `boolean` | — | No | — |
| `toggleButton` | `Slot<ToggleButtonProps>` | — | No | — |
| `toggleButtonTooltip` | `Slot<TooltipProps>` | — | No | — |
| `value` | `NavItemValue` | — | Yes | — |
| `value` | `NavItemValue` | — | Yes | — |
| `value` | `NavItemValue` | — | Yes | — |

### Prop Guidance

- **root**: The required outer slot and the only element that carries the interaction. Keep it as the default button element so native Enter and Space activation, focus handling, and button semantics come for free; supply className, event handlers, or an aria-label through this slot. The recorded types cover both a button root and a div-style root, so only swap the element when you have a reason (for example an anchor for navigation) and restore role, tabIndex, and key handling if you do. `default button element carrying the toggle behavior`
- **icon**: Optional span slot that paints the hamburger glyph. Leave the default glyph so the control is instantly recognizable, style it with fontSize and color tokens on the slot itself, and keep it decorative so it is not announced. `Default stacked-lines glyph, sized with fontSize tokens`
- **href**: A string destination. Provide it only when the control should navigate somewhere rather than toggle a drawer — for example a brand or home link in the app header — and omit it for a pure drawer toggle so the root keeps button semantics and aria-expanded stays meaningful. `https://example.com/docs`
- **categoryValue**: Context value describing the enclosing navigation category, published by NavCategory to its descendants. It is consumed from context by category children such as NavCategoryItem and is not something you set on the Hamburger directly. `provided by the surrounding NavCategory`
- **navCategoryItem**: Context value describing the enclosing category item row, made available so nested sub-items can coordinate expansion and selection. Populated by NavCategoryItem, not configured manually on the Hamburger. `published by NavCategoryItem context`
- **expandIcon**: Required span slot on the category item that renders the expand/collapse chevron. Configure it on NavCategoryItem when a category can be expanded; do not substitute a Hamburger for this slot, since the two glyphs mean different things. `chevron glyph rendered by the category item`
- **expandIconMotion**: Presence motion slot that controls how the expand icon animates when a category opens or closes. Supply custom motion parameters to match your product's motion language, or suppress the animation when the surrounding layout already animates. `default presence motion for the chevron`
- **value**: Required identity for a navigation item or category. Use a stable, unique string per item so selection, open categories, and toggle callbacks can refer to it; avoid array indices because reordering then silently changes which item is selected. `a stable id such as 'settings'`
- **children**: Content rendered inside a navigation item or category row. Keep labels short and scannable, and remember that the Hamburger itself is icon-only, so any text you add belongs on its own nav items rather than on the toggle. `short navigation label text`
- **tabbable**: Boolean that marks whether an item participates in the tab order. The Nav family manages roving focus so that only the active item is tabbable; leave this to the implementation unless you are building custom focus handling around the navigation. `true for the currently focused item only`
- **defaultSelectedValue**: Uncontrolled initial selection for the navigation. Provide it when the Nav should own selection state itself, and do not combine it with selectedValue on the same instance. `the item that should start selected`
- **defaultSelectedCategoryValue**: Uncontrolled initial selected category. Useful when a parent category should appear active on first render without wiring a controlled value and callback pair. `the category that starts active`
- **defaultOpenCategories**: Uncontrolled list of category values that start expanded. Use it for deep links or restored state; like the other defaults, it must not be mixed with the controlled openCategories prop. `array of category values to expand initially`
- **openCategories**: Controlled list of expanded category values. Pair it with onNavCategoryItemToggle and keep the array in your own state so expansion survives re-renders and can be persisted. `array of currently expanded category values`
- **onNavItemSelect**: Callback fired when a navigation item is chosen. This is the natural place to close an overlay drawer after navigation on small screens, or to record analytics for the destination. `handler that closes the OverlayDrawer after selection`
- **selectedValue**: Controlled selection value for the navigation. Use it together with onNavItemSelect when selection must be driven by routing, and never alongside defaultSelectedValue. `the value matching the current route`
- **selectedCategoryValue**: Controlled value for the currently selected category, for cases where a category itself represents the active destination rather than merely a container of items. `the value of the active category`
- **multiple**: Allows more than one category to be expanded at a time. Turn it on for browsable site maps and leave it off when the navigation should always show a single open branch. `false for an accordion-style nav`
- **onNavCategoryItemToggle**: Callback fired when a category is expanded or collapsed. Pair it with openCategories for controlled expansion, and use it to persist which sections the user keeps open. `handler that updates the openCategories array`
- **density**: Selects the vertical rhythm and type scale used by the navigation family. Choose a compact density for dense admin shells with many items and a roomier density for consumer-facing navigation; the Hamburger glyph itself keeps its own size regardless. `a compact density setting for dense layouts`
- **collapseMotion**: Presence motion slot applied when a NavSubItemGroup expands or collapses. Customize it to tune duration and easing or to remove the animation in reduced-motion contexts. `default presence motion for sub-item groups`
- **navItem**: Slot that lets NavItem and NavSubItem swap the underlying rendered element, for example to render a routing Link while keeping the navigation styling and state handling. Use it when integrating with a router rather than wrapping the item in your own anchor. `render as a router Link element`
- **actionButton**: Slot for the trailing action button on a navigation item, used for secondary affordances such as pinning or revealing details. It accepts Button props, so keep the action icon-only with its own accessible name and a matching tooltip. `trailing icon-only action button`
- **toggleButton**: Slot for the trailing toggle button on a navigation item. Use it for stateful per-item switches such as favorite markers, and give it a stable accessible name that does not change between states. `trailing toggle for a per-item state`
- **menuButton**: Slot for a trailing menu button on a navigation item. Pair it with a Menu and keep the menu's items scoped to that row so the navigation itself stays simple to scan. `trailing overflow menu trigger`
- **actionButtonTooltip**: Slot that configures the Tooltip shown for the trailing action button. Supply a short, action-oriented string, and remember that the tooltip supplements the accessible name rather than replacing it. `"Pin to favorites"`
- **toggleButtonTooltip**: Slot that configures the Tooltip for the trailing toggle button. Keep the wording identical before and after toggling so the control does not appear to change purpose. `"Mark as favorite"`
- **menuButtonTooltip**: Slot that configures the Tooltip for the trailing menu button, typically a short label such as "More options" so the icon-only trigger remains unambiguous. `"More options"`

## Best Practices

### Do's

- Render a single Hamburger per collapsible navigation region, typically as the first child of NavDrawerHeader or immediately next to the brand mark in the app bar.
- Give the icon-only control an accessible name through aria-label on the root slot and keep that name in sync with the drawer state, for example 'Open navigation' when collapsed and 'Close navigation' when expanded.
- Reflect the drawer's real state with aria-expanded and point aria-controls at the drawer element's id so assistive technology understands what the toggle controls.
- Provide href only when the control should genuinely navigate (for example a home/brand destination); for a pure drawer toggle, omit href so the root keeps plain button semantics.
- Keep the drawer open state in one place — the drawer component itself or a layout-level state — and let the Hamburger only request the change instead of owning a second copy of the state.
- Leave the default icon slot glyph in place and mark it decorative (aria-hidden) when you add anything else, because the glyph carries no text and should not be announced.
- Hide the control at breakpoints where the navigation is permanently visible instead of leaving a button that toggles nothing.
- Use the Nav family's own slots for secondary affordances — actionButton, toggleButton, menuButton, and their tooltip slots on NavItem and NavSubItem — rather than overloading the Hamburger with extra behavior.

### Don'ts

- Do not use Hamburger as a general-purpose action button for commands like Close, Search, or Save; that belongs to Button or ToolbarButton so the glyph keeps a single meaning.
- Do not render two or more Hamburgers for the same drawer, and do not render one for a drawer that is never collapsible.
- Do not replace the root with a non-interactive element without restoring role, tabIndex, and keyboard activation, since keyboard users then cannot toggle the drawer at all.
- Do not signal open and closed state only by swapping the glyph for an X; always pair any visual change with an updated accessible name and aria-expanded.
- Do not nest the Hamburger inside another button, link, or clickable container, because nested interactive elements break keyboard and screen reader behavior.
- Do not point aria-controls at a different element than the one that actually opens, since generated ids on drawers are easy to get wrong and the relationship is what makes the toggle understandable.
- Do not mix a controlled selection such as selectedValue with its uncontrolled counterpart defaultSelectedValue on the same Nav, and do not mix openCategories with defaultOpenCategories — pick one model per navigation instance.
- Do not repurpose the Hamburger as the expand chevron for a NavCategory; the expandIcon and expandIconMotion slots already exist for that job.

## Anti-Patterns

### Mystery-meat icon button

❌ A Hamburger rendered with only the glyph and no accessible name is announced as an unlabeled button, so screen reader users cannot tell what it does, and voice control users cannot target it by name.

✅ Always set an aria-label on the root that describes the action, keep it synchronized with the drawer state ('Open navigation' versus 'Close navigation'), and mark the icon slot decorative so the glyph is not announced.

### Hamburger as a generic Button

❌ Reusing the hamburger glyph for Close, Search, or Submit actions dilutes its meaning; users stop trusting the icon as the navigation affordance and must re-learn it on every screen.

✅ Reserve Hamburger for revealing and hiding navigation. Use Button, ToolbarButton, MenuButton, or Link for every other command, and keep the navigation toggle in a consistent position across the product.

### Non-interactive root override

❌ Replacing the root with a plain div to gain styling freedom removes native button semantics, keyboard activation, and focusability, so the drawer becomes unreachable without a pointer.

✅ Keep the default button root, or if you must change the element, restore role, tabIndex, and Enter/Space handlers and verify the control still works with keyboard and screen readers.

### Stale or duplicated expanded state

❌ The drawer opens through one piece of state while aria-expanded and the toggle's label reflect a different piece, so assistive technology reports the opposite of what is on screen.

✅ Keep a single source of truth for the drawer's open state, derive aria-expanded and the accessible name from it, and let the Hamburger request the change rather than storing its own copy.

### Hamburger standing in for the category chevron

❌ Using a Hamburger to expand a NavCategory confuses a global navigation affordance with a local disclosure control, and it bypasses the expandIcon and expandIconMotion slots that already coordinate the animation and state.

✅ Leave the expand chevron to NavCategoryItem through expandIcon and expandIconMotion, and keep the Hamburger exclusively for the drawer or rail toggle.

### Mixing controlled and uncontrolled navigation state

❌ Passing both selectedValue and defaultSelectedValue, or both openCategories and defaultOpenCategories, produces undefined behavior where the initial default is silently ignored and expansion stops responding to the callback.

✅ Pick one model per navigation instance: either the default props for internal state or the controlled props paired with onNavItemSelect and onNavCategoryItemToggle.

## Accessibility

**Requirements**: The Hamburger is an icon-only interactive control, so it must always have a programmatic name — an aria-label on the root is the expected source. Its rendered size must still meet the WCAG 2.2 target size guidance (roughly 24 by 24 CSS pixels at minimum, with 32 to 40 pixel targets preferred) even though the glyph itself is small, and its focus indicator must remain visible against both neutral and brand-colored app bars. Because it toggles a region, the control should expose aria-expanded and aria-controls; when href is supplied and the root navigates, the control must not claim an expanded state. The icon should be presentational, and any color change used for states (rest, hover, pressed, focus) must retain contrast against the surface it sits on.

| Key | Action |
| --- | --- |
| `Enter` | Activates the control, toggling the navigation drawer it controls, or following the href destination when a link root is used. |
| `Space` | Activates the control in the same way as Enter, matching native button behavior. |
| `Tab` | Moves focus into the Hamburger as a single stop in the header's tab order and then on to the next focusable element in the header. |
| `Shift+Tab` | Moves focus backwards out of the Hamburger to the previous focusable element. |
| `Escape` | Not handled by the Hamburger itself; the drawer or overlay it controls is responsible for dismissing on Escape, so the pattern should return focus to the toggle when the drawer closes. |

**ARIA**: aria-label (on the root, providing the accessible name for the icon-only control), aria-expanded (on the root, reflecting whether the controlled drawer is open), aria-controls (on the root, referencing the drawer element's id), aria-hidden (on the icon slot, marking the glyph decorative), aria-current (applied by the Nav family to the active NavItem or NavSubItem, not to the Hamburger itself)

**Screen Reader**: The root is announced as a button with its aria-label, for example 'Open navigation, button', and toggling it announces the new state through aria-expanded so the user hears 'expanded' or 'collapsed' without needing to see the icon change. The icon span contributes nothing to the announcement when it is marked aria-hidden, which prevents the glyph from being read as a meaningless character or image. When the root is swapped to an anchor through href, the control is announced as a link with its destination rather than as a toggle, which is why the two behaviors should not be combined. Nav items, categories, and sub-items announce their own state — selection through aria-current and expansion through the category item — independently of the Hamburger.

## Styling

Apply styles through the className of the root and icon slots rather than through wrapper elements, and always use Griffel design tokens so the control follows the theme. Give the root a comfortable hit area with tokens.spacingHorizontalXXL or tokens.spacingHorizontalXXXL plus tokens.borderRadiusMedium and a background of tokens.colorNeutralBackground1, then restyle hover and pressed states with tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed. Set the glyph color with tokens.colorNeutralForeground1 and soften secondary placements with tokens.colorNeutralForeground2 / tokens.colorNeutralForeground2Hover. On a brand-colored app bar, remove the neutral background with tokens.colorTransparentBackground and switch the glyph to tokens.colorNeutralForegroundOnBrand so contrast holds. If the Hamburger sits on a bordered surface, communicate the boundary with tokens.strokeWidthThin and tokens.colorNeutralStroke1. Icon sizing can be nudged on the icon slot with tokens.fontSizeBase400 through tokens.fontSizeBase600 and matching line heights such as tokens.lineHeightBase500, while transitions between states look best with tokens.durationNormal and tokens.curveEasyEase. Any custom motion applied to the expandIconMotion or collapseMotion slots on the nav items should reuse those same duration and curve tokens so the drawer and the tree animate in step.

## Performance

The Hamburger itself renders a single interactive root and one icon span, so its own render cost is negligible; the performance story is about what it triggers. Keep the drawer's open state at the layout level so toggling re-renders the drawer shell instead of rebuilding an entire navigation tree, and avoid declaring slot values or style objects inline in a way that creates new object identities on every render, since slot objects are diffed by reference. On the surrounding navigation, the expandIconMotion and collapseMotion presence-motion slots mount animation wrappers while categories open and close, so limiting animation to the branch that actually changed keeps long trees responsive. Large item lists benefit from rendering navigation content lazily when the drawer is closed, and from memoizing the trailing actionButton, toggleButton, and menuButton slot configurations so they are not recreated per row on each render. Finally, only one Hamburger per drawer avoids duplicate listeners and duplicate announcements during navigation updates.

## Theming & Tokens

Hamburger is fully token-driven through FluentProvider: the root background comes from tokens.colorNeutralBackground1 with tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed for interaction states, the glyph uses tokens.colorNeutralForeground1 (or tokens.colorNeutralForeground2 for muted placements), and rounding follows shape tokens such as tokens.borderRadiusMedium and tokens.borderRadiusSmall. Placed on an accent surface, the control should drop its neutral fill in favor of tokens.colorTransparentBackground and adopt tokens.colorNeutralForegroundOnBrand so the glyph keeps contrast against tokens.colorBrandBackground. Focus rendering follows tokens.colorStrokeFocus2 and tokens.strokeWidthThick, and borders on bordered variants use tokens.colorNeutralStroke1 with tokens.strokeWidthThin. Size and spacing come from tokens.spacingHorizontalS through tokens.spacingHorizontalXXXL, and type or icon scaling uses tokens.fontSizeBase400 through tokens.fontSizeBase600 with matching line heights. Motion for the surrounding navigation uses tokens.durationNormal and tokens.curveEasyEase, and any custom team theme that redefines the neutral or brand ramps automatically propagates into the toggle without component-level overrides.

## Migration Notes

Hamburger is a v9 navigation primitive with no direct equivalent in v8 or in the Northstar library, where a hamburger toggle was usually hand-rolled from a Button plus a menu or hamburger icon. When migrating, replace that bespoke button with Hamburger so the toggle inherits the navigation family's focus, color, and density behavior, and move any accompanying 'open navigation' label text into an aria-label rather than visible copy. Be aware that the prop surface recorded for this navigation entry also includes the selection and expansion props of the surrounding family — value, selectedValue, defaultSelectedValue, defaultSelectedCategoryValue, selectedCategoryValue, defaultOpenCategories, openCategories, onNavItemSelect, onNavCategoryItemToggle, multiple, and density — which in v9 are configured on Nav, NavCategory, NavCategoryItem, NavItem, and NavSubItem rather than being passed to the toggle. Likewise the trailing actionButton, toggleButton, menuButton slots and their tooltip companions, plus expandIcon, expandIconMotion, and collapseMotion, belong to the individual nav items. If you previously kept per-component open state in several places, consolidate it into the drawer's controlled state so the Hamburger stays a thin, stateless trigger.

## Edge Cases

- Icon-only controls have no visible label, so the accessible name must come from an aria-label on the root; without it the control is announced only as an unnamed button and cannot be targeted reliably by voice control.
- When href is supplied the root behaves as navigation, which conflicts with advertising aria-expanded; decide whether the control toggles a drawer or navigates, and configure only one of those behaviors.
- On wide breakpoints where an InlineDrawer or NavDrawer stays permanently visible, the Hamburger becomes a no-op; hide it at those breakpoints rather than shipping a button that appears to do nothing.
- aria-controls depends on the drawer having a stable, known id; if the drawer generates its own id, the relationship silently breaks, so set an explicit id on the drawer and reference that same value from the toggle.
- Multiple drawers or duplicated Hamburgers in the same view produce duplicate accessible names and ambiguous focus order, so keep one toggle per collapsible navigation region.
- The glyph looks small but the interactive target must remain large enough to tap; enforce a minimum width and height using spacing tokens of roughly 24 to 32 pixels and verify the focus ring is not clipped by app-bar overflow.
- Swapping the element behind the root to a div-style root removes native keyboard activation and form semantics; restore role, tabIndex, and key handling, or keep the button root.
- The navigation-family props recorded for this entry (value, selectedValue, defaultSelectedValue, selectedCategoryValue, openCategories, defaultOpenCategories, onNavItemSelect, onNavCategoryItemToggle, multiple, density, and the trailing button slots) are configured on Nav, NavCategory, NavCategoryItem, NavItem, and NavSubItem; passing them to the toggle has no effect on drawer visibility.
- Controlled and uncontrolled props must not be combined on the same navigation instance — selection uses selectedValue or defaultSelectedValue, and expansion uses openCategories or defaultOpenCategories, never both at once.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
