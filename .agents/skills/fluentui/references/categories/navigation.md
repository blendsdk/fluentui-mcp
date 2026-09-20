# navigation components

## Overview

The navigation category covers every component that answers 'where am I?' and 'where can I go?': persistent app-level navigation (Nav, NavItem, NavSubItem, NavCategory, NavCategoryItem, NavSubItemGroup, NavSectionHeader, NavDivider, AppItem, AppItemStatic, Hamburger, SplitNavItem, and the NavDrawer family of header, body, and footer), location trails (Breadcrumb with BreadcrumbItem, BreadcrumbButton, and BreadcrumbDivider), in-page view switching (TabList and Tab), transient menus (Menu, MenuTrigger, MenuList, MenuPopover, MenuItem and its Checkbox, Radio, Link, and Switch variants, MenuGroup, MenuGroupHeader, MenuDivider, and MenuSplitGroup), and inline navigation (Link). These components are mostly thin, composable wrappers around real HTML elements such as anchors, buttons, and lists, so the design work is less about styling and more about choosing the correct surface, giving each destination a stable identity, and wiring the selection and open-state props that keep the UI synchronized with the route.

## When to Use

Choose a navigation component by the scope of the movement it represents, not by its visual shape. Reach for Nav (optionally hosted in a NavDrawer) when you are building the application's primary, persistent set of destinations, because it carries first-class selection and expand/collapse state through selectedValue, defaultSelectedValue, openCategories, multiple, and density, and it ships NavItem, NavSubItem, NavCategoryItem, NavSectionHeader, and NavDivider parts for real information architecture. Use AppItem, AppItemStatic, and Hamburger for the identity and chrome band of that navigation surface rather than for content destinations. Use Breadcrumb only to show position in a hierarchy and to offer upward jumps, with BreadcrumbItem and BreadcrumbButton marking the trail and the current page. Use TabList when the user is switching between peer views of the same object or context inside one page and no URL or history change is required. Use Menu when a set of actions or secondary destinations is transient and should appear on demand, using MenuItemLink when a menu entry actually navigates. Use Link for navigation embedded in prose or another component, and SplitNavItem when a single destination also needs its own secondary actions.

## Best Practices

### Do's

- Pick the surface by scope: Nav and the NavDrawer family for the app's persistent destinations, Breadcrumb for hierarchical location, TabList for peer views in one context, Menu for transient commands and overflow, and Link for inline navigation inside text.
- Give every NavItem, NavSubItem, NavCategory, and NavCategoryItem a stable, unique value, because selection (selectedValue, defaultSelectedValue, selectedCategoryValue) and expansion (openCategories, defaultOpenCategories) are all tracked by those values rather than by labels.
- Choose deliberately between uncontrolled and controlled state: use defaultSelectedValue, defaultSelectedCategoryValue, and defaultOpenCategories for simple cases, and switch to selectedValue and openCategories paired with onNavItemSelect and onNavCategoryItemToggle when navigation state must persist across route changes or be restored.
- Always programmatically mark the user's current location: set current on the active BreadcrumbItem or BreadcrumbButton, and let Nav's selection props drive the highlighted item instead of applying custom styling to one item.
- Keep the native href on NavItem, NavSubItem, NavCategoryItem, AppItem, AppItemStatic, MenuItemLink, BreadcrumbButton, and Link so that middle-click, copy link address, and open-in-new-tab keep working.
- Structure long navigation surfaces with NavSectionHeader and NavDivider between groups, and pin stable chrome with NavDrawerHeader and NavDrawerFooter around the scrolling NavDrawerBody.
- Use SplitNavItem, filling its navItem, actionButton, toggleButton, and menuButton slots plus the corresponding tooltip slots, when one destination needs its own secondary actions, instead of cramming extra buttons inside a plain NavItem.
- Configure MenuList and the menu item variants consistently: pass hasCheckmarks and hasIcons when using MenuItemCheckbox, MenuItemRadio, or MenuItemSwitch, and supply name and value plus checkedValues and onCheckedValueChange so single- and multi-select menus behave predictably.
- Use MenuTrigger as designed so that its child is enhanced into a proper button, and only reach for disableButtonEnhancement when the child already renders a fully accessible button or link.

### Don'ts

- Don't use TabList for application-level or cross-page navigation; it is built to switch among peer views of the same context and does not express a destination the way Nav with selectedValue or a real link does.
- Don't bury the app's wayfinding inside Menu or MenuPopover chains; menus are transient, discovered by hover or click, and hide the shape of the information architecture from scanning and from keyboard users.
- Don't mix competing sources of truth for the same navigation state, such as supplying both controlled selection props and local state, or updating selectedValue without handling onNavItemSelect, since the highlight will drift from the actual route.
- Don't omit value on Nav, NavItem, NavSubItem, NavCategory, or NavCategoryItem, and don't assume the visible text is a safe identity, because duplicated or reordered labels silently break selection and open-state tracking.
- Don't nest menus, submenus, and NavSubItemGroup levels deeper than the content genuinely requires, and don't add hasSubmenu or a submenuIndicator to entries that have no children.
- Don't render icon-only NavItem, AppItem, or SplitNavItem actions without an accessible name, and don't drop the text label merely because the icon is visually familiar.
- Don't hand-style a selected or expanded state onto navigation items, because Nav, Menu, and TabList already communicate selection and expansion through their own props and state.
- Don't strip the anchor semantics out of navigational components by pointing href at a script handler; route interception belongs behind a real link, not instead of one.

## Anti-Patterns

### Repurposing TabList as the application's primary navigation

❌ TabList is designed for switching between peer views of the same object or context within one page, so its selected tab styling and arrow-key model imply a temporary view rather than a destination. When it is used for top-level pages, users lose expected link behavior such as open-in-new-tab, history entries are not represented, and the selected state no longer matches a route.

✅ Use Nav, NavItem, and NavSubItem with the selection props for persistent destinations, keeping real href values on the items. Reserve TabList for peer views inside a single context, where no route change is implied.

### Hiding the information architecture inside menus

❌ Routing the main destinations through MenuPopover or nested menus forces discovery by hover or click, makes the breadth of the app invisible at a glance, and creates a long, fragile keyboard path. The result is navigation that is technically reachable but hard to learn and hard to re-find.

✅ Place persistent destinations in Nav, NavCategoryItem, and NavSubItem, using NavSectionHeader and NavDivider to group them. Use Menu only for transient actions and overflow, and use MenuItemLink when a menu entry navigates rather than performs an action.

### Letting selection state drift from the route

❌ Supplying both controlled and uncontrolled selection state, or updating selectedValue without handling onNavItemSelect, produces highlights that disagree with the page the user is actually on. The same problem appears when values are non-unique or regenerated on render.

✅ Pick one model per surface: defaults for simple, self-contained navigation, or the controlled selection and open-state props with their change handlers when the app already owns the route. Make every value stable and unique across Nav, NavCategory, NavItem, and NavSubItem.

### Losing the current-location cue

❌ Breadcrumbs that never set current on the final item, and Nav surfaces whose selected item is driven by ad hoc styling, leave users without a reliable answer to where they are. Sighted users may infer it from a color while screen reader users get nothing.

✅ Set current on the trailing BreadcrumbItem or BreadcrumbButton and remove any link behavior from it, and express the active destination through Nav's selection props so both the visual and programmatic state come from the same source.

### Assuming the visual label is enough of an identity

❌ Navigation entries that omit value, that duplicate values across categories, or that show only an icon without an accessible name break selection tracking and leave assistive technology with unlabeled targets. These defects usually stay hidden until the navigation is reordered or localized.

✅ Always pass a stable value to NavItem, NavSubItem, NavCategory, and NavCategoryItem, keep those values unique, and ensure icon-only AppItem, NavItem, and SplitNavItem action buttons carry descriptive accessible names.

## Accessibility

Every component in this category ships its own keyboard model and ARIA wiring, and it only works when you compose it as intended. Menu and MenuPopover manage arrow-key movement, Escape to dismiss, and focus return, while TabList uses arrow navigation and exposes selectTabOnFocus so you can decide whether focusing a tab also selects it; Breadcrumb's focusMode lets you choose between arrow-key roving through crumbs and a simple tab stop per crumb. Keep the DOM order of navigation items identical to the visual order so that tab sequence and reading order match what sighted users see, and provide an accessible name for each navigation landmark that contains a Nav, TabList, or Breadcrumb so that screen reader users can distinguish the primary navigation from a breadcrumb trail or a secondary menu. The current location must be conveyed programmatically, not only through color: use current on the active BreadcrumbItem or BreadcrumbButton and the selection props on Nav, and confirm that a disabled or disabledFocusable item is still understandable to assistive technology. MenuTrigger's button enhancement exists so that triggers are real buttons with correct semantics; disabling it is only appropriate when the child already is one. Keep visible focus indicators intact across density and size choices, verify that SplitNavItem's action, toggle, and menu buttons each have a distinct accessible name and tooltip text, and rely on the theme and text direction supplied by FluentProvider rather than hardcoding direction-specific behavior for expand icons and dividers.

## Components in this category

- [AppItem](../components/app-item.md)
- [AppItemStatic](../components/app-item-static.md)
- [Breadcrumb](../components/breadcrumb.md)
- [BreadcrumbButton](../components/breadcrumb-button.md)
- [BreadcrumbDivider](../components/breadcrumb-divider.md)
- [BreadcrumbItem](../components/breadcrumb-item.md)
- [Hamburger](../components/hamburger.md)
- [Link](../components/link.md)
- [Menu](../components/menu.md)
- [MenuDivider](../components/menu-divider.md)
- [MenuGroup](../components/menu-group.md)
- [MenuGroupHeader](../components/menu-group-header.md)
- [MenuItem](../components/menu-item.md)
- [MenuItemCheckbox](../components/menu-item-checkbox.md)
- [MenuItemLink](../components/menu-item-link.md)
- [MenuItemRadio](../components/menu-item-radio.md)
- [MenuItemSwitch](../components/menu-item-switch.md)
- [MenuList](../components/menu-list.md)
- [MenuPopover](../components/menu-popover.md)
- [MenuSplitGroup](../components/menu-split-group.md)
- [MenuTrigger](../components/menu-trigger.md)
- [Nav](../components/nav.md)
- [NavCategory](../components/nav-category.md)
- [NavCategoryItem](../components/nav-category-item.md)
- [NavDivider](../components/nav-divider.md)
- [NavDrawer](../components/nav-drawer.md)
- [NavDrawerBody](../components/nav-drawer-body.md)
- [NavDrawerFooter](../components/nav-drawer-footer.md)
- [NavDrawerHeader](../components/nav-drawer-header.md)
- [NavItem](../components/nav-item.md)
- [NavSectionHeader](../components/nav-section-header.md)
- [NavSubItem](../components/nav-sub-item.md)
- [NavSubItemGroup](../components/nav-sub-item-group.md)
- [SplitNavItem](../components/split-nav-item.md)
- [Tab](../components/tab.md)
- [TabList](../components/tab-list.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
