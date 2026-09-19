# utilities components

## Overview

Utilities are the infrastructure layer of Fluent UI React v9: they supply behavior, rendering plumbing, and platform concerns rather than a visual identity of their own. Portal decides where content is mounted, Positioning computes where surfaces land, Provider supplies theme, text direction, and target document, Tabster underpins keyboard and focus navigation, ContextSelector-family utilities keep context subscriptions cheap, Aria applies ARIA semantics that are otherwise missing, and Motion plus the motion preview components orchestrate enter, exit, and stagger. Overflow measures how many children fit in a container and reports the result, while a few behavior-first composites that sit in this category, Accordion, Carousel, and Toolbar, add structure, state, and keyboard interaction instead of new visuals. Preview entries such as HeadlessComponentsPreview, MenuGridPreview, and MotionComponentsPreview deliver the same kind of behavior in forms that may still change. Several entries, including Utilities, Positioning, Tabster, ContextSelector, and HeadlessComponentsPreview, expose little or no configuration in this surface, which is itself the signal: they exist to be composed, not configured. Because these utilities are mostly invisible, the failure mode is not that they look wrong but that teams rebuild them badly, with hand-rolled focus traps, z-index ladders, measurement taken in hidden containers, or animation stacked on animation.

## When to Use

Reach for this category when the need is behavior or platform plumbing rather than a new control: content that must render outside the normal DOM flow, a surface positioned against a trigger, theme or text direction scoped to a subtree, extra ARIA semantics, cheap context subscriptions, measured overflow, or controlled motion. Use Accordion, Carousel, and Toolbar when you need a composite that owns its own interaction model and state, such as panel expansion, an active slide, or toggled values. Prefer these utilities to writing the same logic yourself, because the surface components in other categories, including Dialog, Menu, Popover, Tooltip, Drawer, Toast, and TeachingPopover, already build on the portal, positioning, focus, and motion layers here; sharing that foundation keeps behavior consistent across an application. Choose a headless or preview entry only when you deliberately want unstyled behavior or a feature that is still settling, and plan for adopting the stable equivalent later. If a styled component already covers the scenario, use it rather than assembling the same result from utilities.

## Best Practices

### Do's

- Wrap the app once in Provider, then add scoped Providers for subtrees that need a different theme, text direction, or target document; keep portal styling enabled so anything rendered through Portal inherits the same theme and direction as its trigger.
- Control where portaled content lands by giving Portal a mount node, either an element or a descriptor that pairs an element with a class name, instead of escalating z-index or nudging positions with CSS.
- Adjust surface placement through the positioning option on Menu, Popover, and Tooltip rather than overriding surface styles; the Positioning layer beneath them already reasons about collision and clipping.
- Rely on the behavior that is already wired up, such as Dialog's inertTrapFocus, Popover's trapFocus and inertTrapFocus, Accordion's navigation setting, and MenuGridPreview's circular navigation, all of which rest on Tabster-managed focus handling.
- Add only the ARIA semantics you genuinely lack with Aria, and prefer what components already expose, such as Tooltip's relationship setting, Field's label, hint, and validation message slots, and MessageBar's politeness.
- Give Overflow a stable, unique id, share a groupId across children that belong to the same overflow group, and keep hidden children reachable by rendering them into a Menu.
- Drive Carousel through activeIndex or defaultActiveIndex with onActiveIndexChange, choose align and groupSize against the real container width, and always supply the announcement function so slide changes are conveyed non-visually.
- Use Motion for imperative control, including the imperative ref, replay key, appear, and the start, finish, and cancel callbacks, and use its visibility-driven variants for plain enter and exit with unmountOnExit; use MotionComponentsPreview's delay mode, hide mode, item delay, item duration, and reversed settings when a group of items should stagger.
- Keep Toolbar's checked values either fully controlled or fully uncontrolled, and choose size and vertical to match the surface hosting it so the toolbar reads as one row with its neighbors.

### Don'ts

- Don't hand-roll focus traps, tab order, escape handling, or arrow-key navigation when Dialog, Popover, Accordion's navigation, MenuGridPreview's circular option, and Tabster-backed behaviors already provide them.
- Don't portal into a node outside the theming and direction context of the app; content mounted through Portal into an unstyled or differently-directed container picks up the wrong theme and text direction.
- Don't render Overflow inside a collapsed, hidden, or zero-width container, such as a closed Dialog or an inactive Tab panel, and trust the overflow state it reports, because measurement happens against the rendered box.
- Don't layer Motion or MotionComponentsPreview on top of surfaces that already own their animation, including the surface motion of Dialog, Menu, and Popover or Tree's collapse motion; double transitions look broken and drift from theme timing.
- Don't build primary navigation or critical, always-visible content out of Accordion panels; Nav, Tabs, Breadcrumb, and Menu are the navigation components, and collapsed content is easy to miss.
- Don't treat HeadlessComponentsPreview, MenuGridPreview, and MotionComponentsPreview as long-term foundations for critical surfaces, and don't run a preview implementation and a stable equivalent of the same behavior side by side.
- Don't try to restyle Portal, Positioning, Aria, Provider, Tabster, ContextSelector, or Motion; they expose no appearance props in this surface, so visual changes belong on the components that render pixels.
- Don't autoplay a Carousel whose slides carry text users must read, and don't leave slide changes unannounced by skipping the announcement function.

## Anti-Patterns

### Rebuilding platform plumbing by hand

❌ Writing custom portals, z-index ladders, focus traps, and arrow-key handlers duplicates what Portal, Positioning, Provider, Tabster-backed behavior, and the interactive components already guarantee, and the copies drift out of sync with theme, direction, and keyboard conventions.

✅ Compose from the category instead: Portal for mounting, the positioning option on Menu, Popover, and Tooltip for placement, Provider for theme and direction, and Dialog's inertTrapFocus or Popover's trapFocus and inertTrapFocus for containment.

### Portals that escape the Provider

❌ Mounting portaled content into an arbitrary DOM node, or into a different document than the one Provider targets, leaves it unstyled or styled with the wrong theme and text direction, because theme, direction, and portal styles are supplied by Provider.

✅ Keep portals inside the Provider tree, give Portal a mount node that already sits inside the styled subtree, and align Provider's target document and direction so portaled surfaces match the trigger that opened them.

### Measuring overflow where there is no layout

❌ Overflow derives its result from the rendered size of the container it sits in; inside a closed Dialog, an inactive Tab panel, or a zero-width wrapper it reports the wrong set of visible children, so actions either flicker or vanish without explanation.

✅ Render Overflow only where the container has real layout, keep its required id stable across renders, use groupId to keep related children in one group, and surface hidden children through a Menu so nothing becomes unreachable.

### Animation stacked on animation

❌ Adding Motion or MotionComponentsPreview on top of surfaces that already animate themselves, including the surface motion of Dialog, Menu, and Popover or Tree's collapse motion, produces double transitions, jank, and timings that disagree with the theme.

✅ Let each component own its surface motion, and reserve Motion for custom transitions, imperative replay, and coordinated sequences; use the motion preview stagger settings only where a group of items genuinely needs orchestration.

### Assuming utilities make content accessible on their own

❌ These utilities supply behavior, roles, and focus management, but not names, labels, or descriptions; a Carousel with no announcement function, a Tooltip with no relationship setting, or an Input outside a Field leaves users without the context they need.

✅ Fill the remaining gaps deliberately: set Tooltip's required relationship, supply Field's label, hint, and validation message, use MessageBar's politeness, provide Carousel's announcement function, and use Aria only for semantics no component already expresses.

## Accessibility

These utilities exist largely to make accessibility correct by default, so the shared rule is to use the semantics they already provide instead of rebuilding them. Tabster-backed behavior powers focus containment and navigation: Dialog's inertTrapFocus and Popover's trapFocus or inertTrapFocus keep keyboard users inside a surface, Accordion's navigation setting defines how arrow keys move between headers, MenuGridPreview's circular option governs wrapping across rows, and Toolbar manages checked values for its controls, so do not add your own tab ordering or manual focus calls inside these surfaces. With Aria, add only attributes the component does not already supply and never override a role that is already correct; prefer declared semantics such as Tooltip's required relationship setting, Field's label, hint, and validation message slots, and MessageBar's politeness, because tooltips and validation messages only reach assistive technology when that relationship is stated. Portal and Positioning relocate content in the DOM, so keep portaled surfaces in a correct accessible relationship with their trigger, never portal content that must be read in document order, and keep Provider's theme, direction, and target document aligned so reading order and language metadata stay correct for content rendered elsewhere. Anything Overflow hides must remain reachable by keyboard and announced, which typically means routing it into a Menu rather than letting it silently disappear, and Carousel needs its announcement function so slide position and content are described, with autoplay avoided on content that needs reading time. Treat Motion as optional emphasis: keep durations aligned with theme motion values, never animate content that is not yet mounted, and avoid continuous motion that competes with reading.

## Components in this category

- [Accordion](../components/accordion.md)
- [Aria](../components/aria.md)
- [Carousel](../components/carousel.md)
- [ContextSelector](../components/context-selector.md)
- [HeadlessComponentsPreview](../components/headless-components-preview.md)
- [MenuGridPreview](../components/menu-grid-preview.md)
- [Motion](../components/motion.md)
- [MotionComponentsPreview](../components/motion-components-preview.md)
- [Overflow](../components/overflow.md)
- [Portal](../components/portal.md)
- [Positioning](../components/positioning.md)
- [Provider](../components/provider.md)
- [Tabster](../components/tabster.md)
- [Toolbar](../components/toolbar.md)
- [Utilities](../components/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
