# navigation components

## Overview

The navigation category covers the components people use to move between places and to understand where they are: Link for pointing at a destination, Breadcrumb for tracing the path back up a hierarchy, Nav for a persistent set of product-level destinations with expandable categories, Tabs for switching between peer views of the same context, and Menu for revealing a list of destinations or commands on demand. They all express movement rather than data entry, and each one covers a different scope: a single destination, the path to the current page, the product's destination set, a section's peer views, or an on-demand list. What they share is a focus contract: these are composite controls that keep one tab stop and move focus inside themselves with arrow keys, so choosing the wrong one changes how keyboard and screen reader users traverse your app. Choosing well means matching the control to the scope of the choice, the persistence of the destination list, and whether the user is changing location or changing the view in place.

## When to Use

Use Link whenever a single, addressable destination is being referenced, either inline inside a sentence or standing alone, and always give it a real target so browser behaviors like opening in a new tab keep working. Use Breadcrumb when content is nested several levels deep and users need to see the hierarchy and jump up one or more levels without retracing their steps. Use Nav when the destinations are the product's or section's top-level places, the list should stay visible, and categories may expand and collapse with one or many open at a time. Use Tabs when the choices are siblings of the same object and switching should change the visible view without leaving the current page context. Use Menu when the set is secondary, space is constrained, or the list should be revealed on demand through hover, click, or context, and when rows may carry more than text. As a rule of thumb: persistent and route-level means Nav or Breadcrumb, in-page and peer-level means Tabs, single destination means Link, and hidden-until-needed means Menu.

## Best Practices

### Do's

- Match the control to the scope of the decision: a single destination gets a Link, a hierarchy position gets a Breadcrumb, the product's places get a Nav, peer views of one object get Tabs, and a secondary or space-constrained set gets a Menu.
- Drive selection through the component's own selection props rather than by styling an item to look active: use the controlled selection prop when a router or state store owns the current location, and the default selection prop when the component owns it, but never both at once.
- Keep breadcrumbs shallow and truthful: each crumb should correspond to a real ancestor location, and the last crumb should describe the page the user is currently on.
- Choose focus behavior deliberately. Breadcrumb's arrow focus mode gives efficient traversal of many crumbs, while the tab focus mode suits crumbs that each contain their own interactive content; in Tabs, decide whether moving focus should also change the selection, and reserve space for the selected tab so the surrounding layout does not shift as the indicator moves.
- Configure Menus for the surface they live in: inline mode and explicit positioning for constrained or nested surfaces, hover opening with an appropriate hover delay only where a pointer is guaranteed, and persistence on item click when the menu performs repeated choices instead of dismissing after one.
- Use Nav categories only when the grouping is meaningful, allow multiple open categories only when users genuinely compare across groups, and pick the density that matches the surrounding chrome so the nav does not look detached from the rest of the page.
- Give every navigation region its own accessible name and wrap breadcrumbs in a navigation landmark so that when several of these controls appear on one page, users can tell them apart.

### Don'ts

- Don't nest one interactive control inside another navigation item, such as a link inside a link or a button inside a tab; it breaks the focus order and produces confusing announcements for assistive technology.
- Don't use Tabs for top-level, route-level navigation. Tabs are for sibling views of the same context; page-level destinations belong in a Nav so they can be linked to, bookmarked, and reflected in the back button.
- Don't attach a state-changing action to a navigation control. If an item submits, deletes, or toggles something rather than moving the user, it should not be a Link or a nav item.
- Don't hide the primary destination set inside a Menu or behind a collapsed Nav just to save space; on-demand surfaces should carry overflow and secondary choices, not the main map of the product.
- Don't let a Link switch to the non-focusable disabled state when it still needs to be discoverable; the disabled-focusable variant keeps it reachable so keyboard and screen reader users learn that it exists.
- Don't rely on hover alone to reveal a Menu, and don't assume a pointer: every menu must also open, move through items, and close cleanly from the keyboard.
- Don't let the item count grow without a plan. A tab row or nav list that overflows its container becomes unusable, so move the excess into a Menu or a deeper Nav instead of squeezing everything in.
- Don't signal the current location with color alone; keep the component's built-in selection and focus visuals intact so there is a non-color indicator as well.

## Anti-Patterns

### Using tabs as the app's primary navigation

❌ Tabs are designed for sibling views of the same object. When they carry top-level destinations, the address for each place becomes unshareable, the browser back button no longer reflects where the user has been, and the tab row grows until it overflows. Screen reader users also hear a tab list where they expect a navigation landmark.

✅ Put product-level destinations in a Nav whose selected value is driven by the router, and reserve Tabs for switching among peer views within the current page or object.

### Hiding the primary destination set in an on-demand surface

❌ Moving the main set of places into a Menu or a collapsed section of the Nav removes the visible map of the product. Users who rely on scanning or on keyboard traversal may never discover the destinations, and each trip requires opening a surface before any choice can be made.

✅ Keep the top-level set persistently visible in a Nav. Use Menu for overflow and secondary choices, and use nav categories for grouping rather than for concealment.

### Navigation items that perform actions instead of navigating

❌ A Link or nav item that submits, deletes, or toggles breaks the user's expectation that following it changes location. Middle-click and open-in-new-tab stop making sense, and assistive technology announces a link or tab where a button is what is actually happening.

✅ If the item changes state rather than location, render it as a button. Keep Links and nav items pointed at real destinations, even when the destination is a place within the same page.

### Mixing controlled and uncontrolled navigation state

❌ Passing both an open state and a default open state, or both a selected value and a default selected value, leaves the component free to disagree with the application about which place is current. The visible selection and the announced state drift apart, and the user sees two things highlighted or none.

✅ Pick one ownership model per control. When a router or store knows the current location, pass the selected value and handle the selection callback; otherwise let the component manage its own default and read selection from the callback.

### Flattening or faking the hierarchy

❌ A breadcrumb that only ever shows the home page and the current page, or that lists every page in the site, stops being a wayfinding aid. It duplicates the Nav instead of showing ancestry, and users cannot tell how many levels deep they are.

✅ Show the real ancestor chain, one crumb per level, ending with the current page, and let the Nav carry the breadth of destinations. Keep the chain short by improving the information architecture rather than by dropping levels from the breadcrumb.

### Wrapping interactive content inside navigation items

❌ Placing a second control inside a link, tab, or nav item creates nested interactive elements. Focus order becomes unpredictable, the item's name is announced twice or not at all, and activating the outer item can fire the inner control as a side effect.

✅ Keep exactly one interactive element per navigation item. Move secondary affordances such as dismiss or overflow controls into a separate trailing region outside the item's own interactive surface, and make sure each has its own accessible name.

## Accessibility

Every component in this category is a composite widget with a roving focus model: the whole control is a single stop in the page tab order, and arrow keys move between items inside it. In Tabs, arrows move between tabs and the selection follows according to the focus-selection setting you chose; in Breadcrumb, arrow focus mode moves between crumbs while the tab focus mode makes each crumb a separate stop; in Nav, focus moves between items and categories are expanded and collapsed from their own item; in a Menu, focus enters the open surface, is contained there, and returns to the trigger when the menu closes. Because of this, never make individual items tab stops and never intercept arrow keys for your own purposes. Selection and current location must be exposed through the component's state rather than only through styling, so do not override or remove the selection indicators, and keep the visible focus indicator intact at all times. Navigation regions need distinguishable accessible names when more than one appears on a page, and breadcrumbs should live inside a navigation landmark. Keyboard users must be able to reach and operate everything without a pointer, which is why disabled-but-discoverable links should use the disabled-focusable state rather than the fully disabled one. Finally, keep destination text meaningful out of context, avoid relying on hover, tooltips, or color alone to convey an item's identity or state, and ensure that moving between destinations announces the new context rather than silently swapping content.

## Components in this category

- - [Breadcrumb](../components/breadcrumb.md)
- - [Link](../components/link.md)
- - [Menu](../components/menu.md)
- - [Nav](../components/nav.md)
- - [Tabs](../components/tabs.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
