# NavSectionHeader

> **Package**: `@fluentui/react-nav` v9.4.0
> **Import**: `import { NavSectionHeader } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

NavSectionHeader is the presentational section-label primitive in the Fluent UI React v9 Nav family. It renders a non-interactive heading that groups adjacent NavItem, NavCategory, and NavSubItemGroup children into a labeled cluster inside a Nav, NavDrawer, or InlineDrawer. Its single required slot is root, which defaults to a level-two heading element but accepts any heading level from h1 through h6 as well as a plain div, so the same visual treatment can be applied whether assistive technology should treat the text as a document heading or as a purely visual caption. Because it is a label rather than a destination, NavSectionHeader never owns selection state, expansion state, or focus; those concerns live in the parent Nav (selection, open categories, density, multiple-selection) and in NavCategory and NavCategoryItem (expansion via expandIcon, expandIconMotion, and the toggle handler). The component inherits its size, spacing, and color from the surrounding Nav and from the FluentProvider theme, which makes it consistent in side navigation rails, drawer navigation, and dense application shells.

**When to use**: Use NavSectionHeader when a navigation surface contains enough destinations that they need to be visually and semantically grouped, for example separating a primary workspace area from administrative or account-related destinations. It is the right choice when the grouping should be announced to screen reader users, because the root slot can render a real heading element that participates in heading navigation. Prefer NavItem when the label itself needs to be navigable, NavCategory when the group must be expandable and collapsible, NavDivider when you only need a neutral visual rule between items without any label, and NavSubItemGroup when you are nesting children beneath a single NavCategory. Avoid NavSectionHeader for decorative text or for anything a user is expected to click.

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

- **root**: Required slot for the header element. It defaults to a level-two heading but accepts h1 through h6 or a plain div, so use a real heading when the text should appear in screen reader heading navigation, and use div when the header is only a visual caption for a group. Slot styling and className overrides belong here rather than on a wrapper element. `h3`
- **href**: An optional string present on the Nav family prop surface. NavSectionHeader is a label, not a destination, so leaving href unset is the expected usage; if a group must itself be navigable, use a NavItem or NavCategory under the header instead of linking the header text. Avoid combining a heading element with link behavior because it produces confusing announcements. `/settings`
- **value (Nav, NavItem, NavCategory, NavCategoryItem)**: Owned by the surrounding navigation components, not by NavSectionHeader. Every selectable NavItem or NavCategoryItem beneath a section needs a value so selection state can resolve; headers carry no value and never report one. `overview`
- **selectedValue and defaultSelectedValue (parent Nav)**: Control or initialize which NavItem is treated as current. The header is unaffected, but grouping decisions often follow selection, for example highlighting the section that owns the active destination. `overview`
- **selectedCategoryValue and defaultSelectedCategoryValue (parent Nav)**: Control or initialize which NavCategory is treated as the selected category. Use these rather than trying to encode category selection on a section header. `admin`
- **openCategories and defaultOpenCategories (parent Nav)**: Control or initialize which NavCategory groups are expanded. Because a section header cannot collapse, use NavCategory plus these props when a labeled area must also be expandable. `admin`
- **onNavItemSelect and onNavCategoryItemToggle (parent Nav)**: Callbacks fired when an item is selected or a category is toggled. Section headers never fire these; they mark the boundaries of the groups whose items do. `handleSelect`
- **multiple (parent Nav)**: Allows more than one NavItem to be selected at a time. Relevant when a single section header labels a set of related toggles rather than a set of destinations. `false`
- **density (parent Nav)**: Sets the compactness of the whole navigation, which scales the section header along with its items. Accepts small, medium, or large. Do not try to override density per header; pick one density for the entire Nav. `small`
- **tabbable (NavItem)**: Controls whether an individual item participates in the tab order. It applies to items only; section headers are never tabbable and need no configuration to stay out of the tab sequence. `true`
- **icon (NavItem, NavCategoryItem)**: Leading visual for an item or category. Keep icons off the section header so the header stays a lightweight text label and does not compete with the icons of the items beneath it. `icon slot`
- **expandIcon, expandIconMotion, and collapseMotion (NavCategoryItem, NavSubItemGroup)**: Configure the disclosure indicator and its motion for expandable categories and sub-item groups. Section headers have no expansion affordance, so these props should not be applied to them. `expandIcon slot`
- **actionButton, toggleButton, menuButton and their tooltip slots (NavItem)**: Overflow and secondary actions on an individual item. Never move these actions into a section header; a header with controls destroys the clean heading announcement and the predictable tab order. `menuButton slot`
- **children**: For NavSectionHeader this is the visible label text. Keep it to a short noun phrase and avoid punctuation-heavy or sentence-length strings that read poorly in heading lists. `Administration`
- **navItem, categoryValue, navCategoryItem (NavItem, NavCategory, NavCategoryItem)**: Internal context values that flow through the Nav tree so items can read selection and expansion state. They are supplied by the parent components and are not configured on a section header. `provided by parent`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Give every section a short, noun-phrase label such as Overview or Administration so the heading reads cleanly in a screen reader heading list.
- Keep the section header immediately adjacent to the items it labels, with no intervening NavDivider or unrelated content that would break the visual and semantic association.
- Choose the heading level deliberately by configuring the root slot to match the surrounding page outline rather than accepting the default h2 blindly.
- Ensure the parent Nav is inside a FluentProvider so the header receives the correct theme tokens instead of falling back to unstyled text.
- Let the Nav density prop drive the header's scale and padding so headers and items stay visually consistent in compact rails and spacious drawer navigation.
- Use one section header per logical group and cap the number of groups so the navigation does not become a long list of headings.
- When the header must be a label for a list rather than a document heading, render root as div and connect it to the group with an aria-labelledby reference so the relationship survives.

### Don'ts

- Do not attach selection or navigation behavior to the header; it is not a NavItem and does not accept selection or activation props of its own.
- Do not render the header as an h1 in an application shell that already has a page-level h1, and do not skip heading levels just to change text size.
- Do not use NavSectionHeader as a substitute for NavCategory when users need to collapse the group; a section header cannot be toggled.
- Do not place buttons, menu triggers, tooltips, or other interactive controls inside the header slot children.
- Do not use a section header purely to change color or font size of a group; that is a styling concern, not a structural one.
- Do not create a section with no items under it, since orphan headings add noise to assistive technology heading navigation.
- Do not rely on the header alone to communicate grouping; pair it with spacing or a Divider so the grouping is visible as well as semantic.

## Anti-Patterns

### Header used as a navigation target

❌ Treating NavSectionHeader as a clickable link or applying href, selection, or activation props to it breaks the mental model of the Nav, puts a heading and a link into the same accessible name, and creates a focusable element that does not participate in the Nav arrow-key sequence.

✅ Keep the header non-interactive and place the actual destination in a NavItem directly beneath it, giving that item the value and href it needs.

### Heading level chosen for visual size

❌ Rendering root as h1 or h4 purely to get a bigger or smaller font produces a broken document outline, causes screen reader users to hear an incorrect hierarchy, and can yield multiple h1 elements on one page.

✅ Pick the heading level from the page outline and adjust the visual weight with theme tokens for font size, weight, and color instead of changing the element.

### Section header used where a divider belongs

❌ Inserting a labeled header between every couple of items turns the navigation into a long list of headings, adds noise to heading navigation, and makes short groups look more important than they are.

✅ Reserve NavSectionHeader for genuinely distinct groups and use NavDivider for plain visual separation between closely related items.

### Non-collapsible header expected to expand

❌ Because the header looks like a group label, teams sometimes expect clicking it to expand the group. It does not toggle, so users perceive the navigation as broken.

✅ Use NavCategory with NavCategoryItem and NavSubItemGroup when the group must open and close, and keep NavSectionHeader for always-visible groupings.

### Empty sections and orphan labels

❌ Conditional rendering can leave a header with no items under it, which produces a heading that leads nowhere and confuses both sighted and screen reader users scanning the navigation.

✅ Render the header and its items from the same data condition so the header disappears whenever the last item in the group is hidden.

## Accessibility

**Requirements**: NavSectionHeader must contain readable text; an empty or icon-only header conveys nothing. The rendered element must maintain a valid heading outline for the page: use root to select h1 through h6 in logical order, or render a div and expose the label through aria-labelledby on the grouping container when heading semantics would be disruptive. Contrast between the header text and its background must meet WCAG 1.4.3 for body text, which the default neutral foreground tokens satisfy in light, dark, and high-contrast themes. Grouping must never be communicated by color or weight alone; keep the label text, spacing, and optional Divider so the structure is perceivable without color.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and out of the navigation surface; NavSectionHeader is a static label and is never added to the tab order. |
| `ArrowDown` | Moves focus to the next focusable item in the Nav, skipping over section headers entirely. |
| `ArrowUp` | Moves focus to the previous focusable item in the Nav, skipping over section headers entirely. |
| `ArrowRight` | Expands the focused NavCategory whose sub-item group is collapsed. |
| `ArrowLeft` | Collapses the focused NavCategory whose sub-item group is expanded. |
| `Enter` | Activates the focused NavItem or NavCategoryItem link when the root renders an anchor with an href. |
| `Space` | Activates the focused item rendered as a button, or toggles the expansion of a focused NavCategoryItem. |
| `Home` | Moves focus to the first focusable item in the Nav. |
| `End` | Moves focus to the last focusable item in the Nav. |
| `Escape` | Closes an expanded NavCategory or dismisses navigation hosted inside an OverlayDrawer. |

**ARIA**: role="heading" with aria-level when the root slot is rendered as div instead of a native heading element, aria-labelledby on the list or group container to associate items with the section header text, aria-current on the selected NavItem, not on the header, aria-expanded on NavCategoryItem toggles that sit beneath a header, aria-label as an alternative when the visible label alone is ambiguous in a headings list

**Screen Reader**: When the root slot renders a native h1 through h6 element, screen readers expose NavSectionHeader as a heading node and include it in the headings rotor or heading navigation command, letting users jump directly between sections. Rendering as div removes it from the heading list, so it is announced only as inline text unless a role and aria-level or an aria-labelledby association is added. The header is not focusable, is not announced as part of the arrow-key navigation sequence, and is skipped by the tab order, which means focus moves only between the interactive NavItem and NavCategoryItem elements beneath it. Because the label is not interactive, no pressed, selected, or expanded state is ever announced for the header itself.

## Styling

Style the header through the root slot rather than by wrapping it in extra elements, and prefer theme tokens so dark and high-contrast themes keep working. The default text color maps to tokens.colorNeutralForeground2, with tokens.colorNeutralForeground3 available for a quieter caption and tokens.colorBrandForeground1 when a section should read as emphasized. Typography typically uses tokens.fontSizeBase200 with tokens.fontWeightSemibold for compact rails and tokens.fontSizeBase300 with tokens.fontWeightSemibold in roomier drawer navigation; line height follows tokens.lineHeightBase200. Padding and rhythm come from tokens.spacingVerticalXXS, tokens.spacingVerticalS, tokens.spacingVerticalM, and tokens.spacingHorizontalM, and any rule drawn beneath a section should use tokens.colorNeutralStroke2 so it matches Divider. When weight changes are hard to see in high contrast, rely on tokens.colorNeutralForeground3 or an explicit structure change rather than uppercase transformation, which can harm readability in some locales. Keep overrides targeted at the header class and avoid global descendant selectors that would also restyle NavItem and NavSubItem.

## Performance

NavSectionHeader is a static, stateless presentational component: it holds no state, registers no effects, and renders a single element, so it adds negligible cost even with many sections in a navigation tree. Its only dynamic behavior comes from the parent Nav re-rendering when selection or open-category state changes; because the header does not consume that state, memoizing the label text or hoisting section definitions out of the render body keeps re-renders limited to the items that actually changed. Avoid wrapping headers in additional layout containers purely for styling, since extra elements increase layout work inside drawers and overflow regions where the navigation is measured. If a navigation contains enough items to trigger overflow behavior, note that headers are not OverflowItem participants and stay in place while items may move, so keep group counts reasonable.

## Theming & Tokens

NavSectionHeader consumes theme values through the surrounding FluentProvider, so switching between light, dark, and high-contrast themes requires no changes to the header itself. Default label color resolves to tokens.colorNeutralForeground2, with tokens.colorNeutralForeground3 for de-emphasized captions and tokens.colorBrandForeground1 for an emphasized section. Type scale is drawn from tokens.fontSizeBase200 and tokens.lineHeightBase200 in compact navigation or tokens.fontSizeBase300 in larger layouts, paired with tokens.fontWeightSemibold for the label. Spacing around the header comes from tokens.spacingVerticalXXS, tokens.spacingVerticalS, tokens.spacingVerticalM, and tokens.spacingHorizontalM, and any separating rule should use tokens.colorNeutralStroke2 or a Divider so the color matches the rest of the theme. Because the Nav density prop flows down from the parent, the header automatically follows the density-specific token values used by NavItem and NavCategoryItem, keeping the navigation internally consistent.

## Migration Notes

In Fluent UI React v8 the section or group label inside a Nav was produced implicitly by the Nav groups prop, which accepted a name plus links for each group and rendered the label for you. The v9 Nav family composes explicitly: you place NavSectionHeader, NavItem, NavCategory, and NavSubItem as children, so the label text, element level, and grouping boundaries are under your control instead of being inferred from configuration. The visual result is similar, but the v9 approach removes the implicit group data model, requires you to render a header for every group you want labeled, and moves selection state to Nav props such as selectedValue, defaultSelectedValue, selectedCategoryValue, openCategories, and onNavItemSelect rather than to per-group configuration.

## Edge Cases

- Overriding the root slot to div silently removes heading semantics; screen reader users then cannot jump between sections unless you add role and aria-level or associate the label with the group through aria-labelledby.
- Rendering the header as h1 in an application shell that already has a page heading produces duplicate top-level headings; choose the level from the surrounding outline, not from the desired text size.
- Density is a Nav-level concern; trying to size one header differently from its items within the same Nav creates visual misalignment and cannot be expressed through the header's own props.
- Because a section header cannot collapse, labeling a group that users expect to open and close is a functional gap; the correct structure is NavCategory with NavCategoryItem and NavSubItemGroup.
- Section headers are not OverflowItem participants, so in overflow scenarios items may be moved into the overflow menu while their header remains visible, leaving a header that appears to label an empty area.
- Conditionally hidden items can leave an empty header behind, which shows a group label with nothing under it; render headers and items from the same condition.
- In correct, high-contrast, or forced-colors modes the subtle neutral foreground and semibold weight may lose visual distinction, so keep the label text meaningful on its own and consider a Divider for grouping.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
