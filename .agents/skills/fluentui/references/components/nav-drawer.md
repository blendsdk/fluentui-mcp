# NavDrawer

> **Package**: `@fluentui/react-nav` v9.4.0
> **Import**: `import { NavDrawer } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

NavDrawer is the container that gives a Drawer its navigation-specific layout, styling, and keyboard model. It is the root element you wrap around drawer navigation content, and the other navigation drawer parts — NavDrawerHeader, NavDrawerBody, and NavDrawerFooter — are composed inside it to build a complete side navigation surface. NavDrawer renders as a themed vertical container that supplies the drawer's background, padding, and stacking context, and it establishes the focus behavior for the navigation tree that lives inside it (typically a Nav element containing NavItem, NavCategory, NavCategoryItem, and NavSubItem children). Because it is built on the Drawer primitives, it can be used as an inline (non-modal) navigation rail that sits beside page content or as an overlay navigation panel that appears above content, for example behind a Hamburger button on small viewports. Its single public prop, tabbable, controls whether users can move focus through navigation items with Tab in addition to the arrow-key navigation that is enabled by default. Use NavDrawer whenever a Drawer's contents are destinations in an application or site hierarchy rather than general content, forms, or actions.

**When to use**: Use NavDrawer for persistent, hierarchical, application-level wayfinding: primary sidebars, mobile hamburger navigation, navigation rails, and settings/account surfaces that sit beside or above page content. It is the right choice when the drawer holds a list of destinations organized into categories and sub-items and when that list should participate in arrow-key navigation as a single focus group. Prefer NavDrawer over a plain Drawer (or a bare InlineDrawer/OverlayDrawer) whenever the drawer's role is navigation, because NavDrawer supplies the nav-specific spacing, surface styling, and focus semantics those primitives do not. Do not use NavDrawer for in-page destination switching inside a single view — use TabList for peer views of the same data, Breadcrumb for hierarchical position, or Link for simple references. Do not use it for transient command surfaces or context menus; use Menu, MenuList, and MenuItem instead. Do not use it as a general content panel for forms, tables, or detail views; a DrawerBody or a Dialog is a better fit. If your scenario is a top-level horizontal site header rather than a vertical panel, use Nav directly without the drawer wrapper.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `tabbable` | `boolean \| undefined` | `false` | No | The component uses arrow navigation by default. Setting this to true enables tab AND arrow navigation. |

## Best Practices

### Do's

- Wrap the navigation tree in NavDrawerBody and keep NavDrawerHeader for the product name or logo and NavDrawerFooter for secondary destinations such as settings or account entries, so the three regions scroll and pin correctly.
- Build the destination list from Nav, NavItem, NavCategory, NavCategoryItem, and NavSubItem so that selection state, expand/collapse, and roving focus are handled for you.
- Keep the hierarchy shallow — one category level with one level of sub-items — because a drawer is narrow and deep nesting produces cramped hit targets and horizontal overflow.
- Set tabbable to true only for short, standalone navigation surfaces (for example a small overlay drawer on a narrow viewport) where users are likely to reach for Tab before discovering arrow-key navigation.
- Reflect the current route in the navigation items themselves so assistive technology and sighted users get the same position cue, and update it whenever navigation occurs.
- Provide an explicit, always-reachable way to open and dismiss an overlay drawer, such as a Hamburger trigger plus an Escape key path, and return focus to the trigger when the drawer closes.
- Make the drawer the only navigation source for the view it serves; if the same destinations also exist in a visible sidebar, hide the duplicate surface responsively rather than rendering both.

### Don'ts

- Do not set tabbable on long navigation trees; adding every item to the tab order turns a single Tab stop into dozens and makes the rest of the page tedious to reach.
- Do not nest a NavDrawer inside another NavDrawer or place a second scrollable navigation container in NavDrawerBody, which creates competing scroll areas and duplicate landmarks.
- Do not put primary page content such as forms, data grids, or long forms of copy in the navigation body; use a DrawerBody or a Dialog for that content.
- Do not hand-roll focus management, key handlers, or tabindex values on the nav items — the drawer already provides the arrow-key model, and overriding it produces inconsistent or broken focus order.
- Do not indicate the active destination with color, weight, or a decorative bar applied ad hoc to individual items; use the navigation components' own selected state so high-contrast and theming keep working.
- Do not leave an overlay drawer openable but not closable, or open it on load on top of the content the user is trying to read.
- Do not place a hidden or icon-only navigation trigger without an accessible name; an unlabeled Hamburger control is unreachable to screen reader users.

## Accessibility

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
