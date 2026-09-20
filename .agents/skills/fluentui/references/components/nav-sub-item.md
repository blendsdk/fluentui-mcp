# NavSubItem

> **Package**: `@fluentui/react-nav` v9.4.0
> **Import**: `import { NavSubItem } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

NavSubItem is the leaf-level navigation element of the Fluent UI Nav family. It represents an individual destination inside a NavSubItemGroup, which itself is nested under a NavItem or NavCategoryItem within a Nav. Each NavSubItem exposes a required value that uniquely identifies the destination for selection bookkeeping, and an optional href so the item renders as a navigable link to the route that value represents. Because it is the terminal node of the navigation hierarchy, a NavSubItem never contains further navigation levels — it is purely a focusable, activatable target with a label. It is normally used together with Nav, NavItem, NavSubItemGroup, and the NavDrawer components to build primary or side navigation.

**When to use**: Use NavSubItem for second-level (and deeper, within their own NavSubItemGroups) destinations inside a Nav — for example the pages that belong to a section whose parent is a NavItem with its own route, or a category such as "Settings" that expands into "Profile", "Notifications", and "Billing". Choose NavItem instead when the destination is a top-level entry that sits directly in the Nav rather than under a parent. Choose NavCategoryItem plus a NavSubItemGroup when the parent should expand and collapse rather than navigate. Avoid NavSubItem outside of a Nav context: if you just need a standalone link, use Link; if you need a generic clickable element, use Button. Inside a NavDrawer, NavSubItem is the right primitive for the innermost entries of the drawer's navigation tree, while the drawer shell itself is handled by NavDrawer, NavDrawerHeader, NavDrawerBody, and NavDrawerFooter.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `href` | `string \| undefined` | — | No | — |
| `value` | `string` | — | Yes | The value that identifies this NavSubItem when selected. |

### Prop Guidance

- **value**: Required. A unique string that identifies this destination when the parent Nav determines which entry is selected. Values should be stable across renders and unique among siblings — the safest convention is a hierarchical route key such as a path-like string so duplicates cannot occur as the tree grows. Because it is required, every NavSubItem must participate in the selection model even if you never read the value yourself. `profile`
- **href**: Optional. Provide the destination URL to render the item as a navigable link so the browser's native link affordances (middle-click, open in new tab, copy link address, status-bar preview) keep working. Keep href and value derived from the same source so the highlighted entry matches the loaded route. When there is no real destination to navigate to, do not supply a placeholder href; use a Button or another non-navigation control instead. `/settings/profile`
- **root**: The single slot of NavSubItem and the element that receives styling and attributes such as className. It carries the link semantics when href is provided and is where you apply indentation, hover, pressed, and selected styling, as well as any aria-label needed for truncated or icon-only labels. `className on the root to apply indentation and selected-state styling`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Always supply a unique, stable value for every NavSubItem; it is a required prop and is what the parent Nav uses to determine whether this entry is the selected destination.
- Keep href and value in agreement — derive both from the same route definition so the highlighted entry always matches the URL the user is actually on.
- Render a short, noun-based label inside the item's root so the destination is understandable without surrounding context and the link has a discernible accessible name.
- Place subitems inside the correct NavSubItemGroup so the visible indentation matches the real information hierarchy for both sighted and screen-reader users.
- Keep each group of subitems short (roughly five to seven entries) and push longer sets behind a NavCategory or a dedicated page.
- Set href to a real, resolvable route so the item keeps native link behavior such as middle-click, copy link address, and open-in-new-tab.
- Test the selected subitem in both light and dark themes (and in Windows High Contrast) to confirm the active state is still perceivable.

### Don'ts

- Don't omit or duplicate values — duplicate values across sibling NavSubItems make the selected state ambiguous and break selection highlighting.
- Don't use NavSubItem for top-level destinations; use NavItem so the top level of the navigation is not visually or semantically flattened.
- Don't nest additional navigation inside a NavSubItem — it is the terminal level of the Nav tree; introduce another NavSubItemGroup only under a NavItem or NavCategoryItem.
- Don't use NavSubItem as a general-purpose link or button outside a Nav; it carries selection semantics that make no sense without a parent Nav tracking selectedValue.
- Don't hide subitems behind hover-only or hover-triggered interactions; they must be reachable by keyboard and visible to touch users.
- Don't signal the selected state with color alone; pair color with a weight change, an indicator, or the container's aria-current marker.
- Don't place long paragraphs, badges, or complex controls inside the subitem root; it should read as a single, scannable navigation entry.

## Anti-Patterns

### Duplicate or missing value

❌ value is required and is the only thing the parent Nav uses to distinguish one subitem from another. Duplicated values across siblings, or copy-pasted placeholder values, make selection ambiguous and can cause multiple entries to look selected at once.

✅ Generate values from the route tree so each is unique and human-traceable, and add a check that fails if two siblings share a value.

### Using NavSubItem as a generic link or button

❌ Outside a Nav there is no selectedValue tracking, so the required value prop is dead weight and the item's selection semantics are meaningless. Reusing it elsewhere also spreads navigation styling into unrelated parts of the UI.

✅ Use Link for standalone hyperlinks and Button for actions; reserve NavSubItem for destinations inside a Nav tree.

### Faking a third navigation level

❌ NavSubItem is the terminal node of the Nav hierarchy. Trying to nest another list of items inside it produces invalid, unindented markup and confuses screen-reader users about the tree's depth.

✅ If a deeper level is required, restructure the navigation so the new level lives in a NavSubItemGroup under a NavItem or NavCategoryItem, or move that level to an in-page table of contents.

### State conveyed only by color

❌ Relying on a color shift alone to show which subitem is active fails WCAG 1.4.1 for users with color-vision deficiencies and is easy to miss in high-contrast mode.

✅ Combine the color change with tokens.fontWeightSemibold, an indicator bar, and aria-current on the active item, and verify the distinction in Windows High Contrast.

### Unbounded subitem lists

❌ A parent NavItem that expands into twenty subitems turns the navigation into an unreadable wall of links, pushes primary destinations off-screen, and slows down both scanning and rendering.

✅ Cap each group at a handful of entries, promote the most important ones, and route the remainder to an index page or a custom page inside the parent's NavSubItemGroup.

## Accessibility

**Requirements**: NavSubItem must meet WCAG 2.1 AA. Text and its background must reach a 4.5:1 contrast ratio in every state (default, hover, pressed, selected, disabled), and the selected state indicator must reach at least 3:1 against adjacent colors. Every item needs a discernible accessible name from its visible label, or an explicit aria-label when the label is visually truncated or replaced by an icon. Interactive targets should meet the 24x24 CSS pixel minimum target size requirement (2.5.8), which usually means ensuring the root has enough vertical padding even for dense submenus. The currently selected subitem should be exposed with aria-current="page" (or the appropriate aria-current token) so assistive technology can identify the active destination, and a visible focus indicator using the focus stroke tokens is required for keyboard operability.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the next focusable element, including the next NavSubItem in the navigation tree. |
| `Shift+Tab` | Moves focus to the previous focusable element, including the previous NavSubItem or the parent NavItem / NavCategoryItem. |
| `Enter` | Activates the link and navigates to the destination identified by href. |
| `Space` | Is not an activation key for NavSubItem because it behaves as a link; do not add Space activation, and do not prevent the default page scroll. |
| `Escape` | Does not close or dismiss the subitem itself; when the navigation is hosted inside a dismissible container such as an OverlayDrawer, dismissal is handled by that container, not by NavSubItem. |

**ARIA**: aria-current (for example aria-current="page" on the active destination), aria-label (for items whose visible label is truncated, abbreviated, or icon-only), aria-disabled (if an entry must be shown but is temporarily unavailable), role="link" is implicit from the rendered anchor when href is provided; do not override it

**Screen Reader**: Screen readers announce a NavSubItem as a link whose name comes from the label rendered in its root slot, followed by the current-state announcement when aria-current is set (typically "current page"). Because it lives inside a NavSubItemGroup inside a Nav, list and navigation semantics come from the surrounding containers, so the item is announced in the context of the group it belongs to. If the item has no visible text (icon or swatch only), assistive technology announces only the content of aria-label, and the item is otherwise read as an unnamed link — a serious failure.

## Styling

Style the item through the root slot with Griffel (makeStyles plus mergeClasses from @fluentui/react-components). Indent subitems with tokens.spacingHorizontalXXL in padding-left so their depth relative to NavItem is obvious, and control vertical rhythm with tokens.spacingVerticalS. Set the label size with tokens.fontSizeBase300 and tokens.lineHeightBase300, and switch the selected entry to tokens.fontWeightSemibold. Use tokens.colorNeutralForeground2 as the base text color and override hover/pressed with tokens.colorNeutralForeground2Hover and tokens.colorNeutralForeground2Pressed; use tokens.colorSubtleBackgroundHover, tokens.colorSubtleBackgroundPressed, and tokens.colorSubtleBackgroundSelected for the surface states. Focus-visible styling should use tokens.colorStrokeFocus2 with tokens.strokeWidthThick. If you need to distinguish the active route, prefer a weight change plus a small indicator over a saturated fill, and make sure the same styles read correctly in dark theme (verify with tokens.colorNeutralForeground1 still passing contrast). Also style around long labels: allow wrapping, or truncate with the matching aria-label.

## Performance

NavSubItem itself is a leaf and cheap to render, so cost comes from how many of them you mount at once. Keep the subitem list small and avoid recomputing it on every render — build the array from a stable route config and memoize it rather than mapping inline inside the Nav's children. Because value equality drives selection, avoid regenerating value strings (for example by embedding random suffixes or timestamps), which would force the Nav to re-evaluate selection and re-render the whole tree. Prefer className-based Griffel styles over inline style objects so the styles are compiled once and cached. If a navigation contains dozens of groups, prefer collapsing them with NavCategory over mounting every NavSubItemGroup expanded, and consider virtualizing very long flat lists.

## Migration Notes

NavSubItem has no v8 equivalent component name; the closest analogue is a nested Nav link inside a stack-based navigation, which had to be composed manually. In v9, the item is a first-class component with an explicit value prop used for controlled selection by the parent Nav, and an href prop for routing. If you are porting a v8 navigation, replace hand-built nested anchors with NavSubItem inside a NavSubItemGroup, move selection bookkeeping from custom state into the Nav selectedValue flow, and re-apply indentation and hover styling through Griffel tokens instead of the old SCSS class overrides.

## Edge Cases

- value is required even when the item never navigates anywhere; if you cannot supply a meaningful identifier, the component is likely the wrong choice.
- An item with href but no visible text renders as an unnamed link — always pair icon-only or truncated entries with aria-label.
- Because it is the terminal node of the Nav hierarchy, a NavSubItem cannot contain a nested NavSubItemGroup; deeper levels must be re-parented under a NavItem or NavCategoryItem.
- Selected highlighting depends on the parent Nav's selectedValue matching the item's value exactly; a mismatch caused by trailing slashes, casing, or query strings silently leaves the navigation with no active entry.
- Rendered inside a dismissible OverlayDrawer, activating a subitem typically navigates and closes the drawer, while a plain navigation click inside a persistent InlineDrawer must not change the drawer's open state — verify both containers if you support both layouts.
- A placeholder href (an empty string or a script no-op) makes the entry look like a real link to the browser and to screen readers; use a non-navigation control when there is no destination.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
