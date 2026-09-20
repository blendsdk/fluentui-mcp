# overlays components

## Overview

Overlays are the surfaces that float above the rest of the page: anchored popovers that appear next to the element that opened them, drawers that slide in from an edge and either push the layout or float over it, and teaching popovers that walk a user through new functionality step by step. The category is built from containers paired with structure parts: Drawer with InlineDrawer or OverlayDrawer plus DrawerHeader, DrawerHeaderNavigation, DrawerHeaderTitle, DrawerBody and DrawerFooter; Popover with PopoverTrigger and PopoverSurface; and TeachingPopover with its surface, header, title, body, footer and carousel pieces. Every family shares the same contract — something triggers presence, the surface is positioned and layered above the page, the user can dismiss it, and focus returns to where it started.

## When to Use

Reach for an overlay when content should appear on demand without navigating away or permanently consuming layout space. Use Popover for short, anchored, non-blocking content tied to a trigger, such as extra detail, a compact set of actions or a small form, and treat openOnHover and openOnContext as supplements to a click and keyboard path rather than the only way in. Use InlineDrawer when a panel should sit in the layout and push the main content aside, and OverlayDrawer when the panel should cover content with a backdrop instead. Use TeachingPopover when you need guided, multi-step onboarding or coach marks, and its carousel parts when the flow has several steps with previous and next navigation. If the user must answer before continuing, a blocking modal surface from another category is usually a better fit than any of these.

## Best Practices

### Do's

- Choose the drawer variant deliberately: set type to inline when the panel should participate in layout and push content, and to overlay when it should float above the page with a backdrop and a dismissible scrim.
- Compose drawer content from the provided parts — DrawerHeaderTitle for the heading and trailing action, DrawerHeaderNavigation for navigation, DrawerBody for the scrolling region and DrawerFooter for actions — instead of hand-rolling spacing inside a bare drawer.
- Use the separator option on drawer headers so the title and close affordance stay visually anchored while the body scrolls underneath.
- Drive visibility from application state when the overlay matters to routing or deep links by pairing open with onOpenChange, and fall back to defaultOpen only for simple uncontrolled cases.
- Always wire the trigger with PopoverTrigger or TeachingPopoverTrigger rather than toggling open state from a raw click handler, so positioning, keyboard activation and focus return are handled for you, and use disableButtonEnhancement when the child is already an interactive element.
- Give every overlay surface a heading — the heading slot on DrawerHeaderTitle, and TeachingPopoverHeader plus TeachingPopoverTitle for teaching experiences — keeping the heading level consistent with the surrounding page outline.
- Reserve trapFocus or inertTrapFocus on Popover for surfaces that behave modally, and use unstable_disableAutoFocus when you deliberately do not want focus moved into a hint or preview.
- Tune placement with positioning and withArrow so the surface stays visually attached to its trigger, and turn on closeOnScroll when the trigger lives inside a scrolling region.
- Build multi-step guidance with TeachingPopoverCarousel, one TeachingPopoverCarouselCard with a unique value per step, TeachingPopoverCarouselNav for step navigation, TeachingPopoverCarouselPageCount for progress and TeachingPopoverFooter with its primary and secondary slots plus initialStepText and finalStepText.
- Keep the built-in motion slots — backdropMotion and surfaceMotion on OverlayDrawer — at their defaults unless you have a specific reason, so overlay animation stays consistent with the rest of the product.
- Render overlays inside FluentProvider so theme and direction reach portal-rendered surfaces, using its applyStylesToPortals option when surface content is portalled.

### Don'ts

- Don't stack overlays — opening a popover from inside a popover surface, or a drawer from inside an open popover, creates competing layers, competing focus behaviour and ambiguous dismissal order.
- Don't use Popover for panel-sized content such as navigation trees, multi-section settings or long forms that a user must scroll through and return to; that content belongs in a drawer.
- Don't rely solely on openOnHover or openOnContext, because hover-only content is unreachable for keyboard and touch users and can vanish before it has been read.
- Don't reimplement overlay plumbing with manual portals, manual Escape handling and manual focus restoration, because you lose the behaviour the components already coordinate, including returning focus to the trigger.
- Don't ship an overlay with no exit: an OverlayDrawer needs a visible dismiss affordance and onOpenChange handling so Escape and backdrop interaction actually close it.
- Don't fake a guided tour by chaining several plain popovers, since each step then re-solves step state, progress display and next and previous affordances.
- Don't hide the only copy of essential information inside a surface that closes on scroll, outside click or Escape.

## Anti-Patterns

### Making every overlay modal

❌ Treating popovers and drawers as blocking surfaces — trapping focus and dimming everything behind them — for content that is merely supplementary turns a quick peek into an interruption and trains users to dismiss without reading.

✅ Match the surface to the intent: keep Popover non-trapping and undimmed for hints, previews and short action lists, reserve trapFocus or inertTrapFocus for surfaces that truly require a response, and let Escape close all of them.

### Using a popover where a drawer belongs

❌ Popovers are anchored to a trigger and reposition or dismiss easily, so panel-shaped content such as navigation, long forms or multi-section settings becomes cramped, awkward to scroll and easy to lose by accident.

✅ Move that content into InlineDrawer or OverlayDrawer and compose it with DrawerHeaderTitle, DrawerHeaderNavigation, DrawerBody and DrawerFooter so it gets a stable frame, a scrollable body and its own actions.

### Rebuilding overlay behaviour by hand

❌ Hand-rolled portals with manual Escape handling and manual focus restoration drift from the rest of the product and typically lose focus return, consistent dismissal and portal theming, even though the components already own that work.

✅ Use Popover with PopoverTrigger and PopoverSurface, TeachingPopover with its trigger, surface, header, body and footer parts, and the Drawer parts; keep a FluentProvider around overlay content so portal-rendered surfaces stay themed.

### Faking a tour with a chain of popovers

❌ Sequencing several independent popovers to simulate onboarding gives no shared step state, no progress indicator and inconsistent next and previous affordances, and each step must re-solve focus and placement.

✅ Use TeachingPopover with TeachingPopoverCarousel, one TeachingPopoverCarouselCard with a unique value per step, TeachingPopoverCarouselNav for navigation, TeachingPopoverCarouselPageCount for progress, and TeachingPopoverFooter with initialStepText, finalStepText and primary and secondary actions.

### Stacking overlays on top of each other

❌ Opening a drawer from inside a popover, or another popover from inside an open popover surface, produces layered surfaces with competing focus behaviour and an unclear dismissal order for the user.

✅ Keep one overlay at a time: dismiss or collapse the current surface before presenting the next, or promote the follow-up content into its own top-level overlay that the user opens deliberately.

### Hiding the only copy of important information in a transient surface

❌ Popovers close on scroll, outside click and Escape, so errors, confirmations or instructions that live only there are easily missed and cannot be re-read after dismissal.

✅ Keep essential messaging in persistent surfaces and use overlays for optional detail; when an overlay genuinely carries a decision, make its result visible in the page after the surface closes.

## Accessibility

Every component in this category is an on-demand surface, so screen reader and keyboard users must be able to discover it, understand it and leave it without losing their place. Name the surface: put a real heading in the heading slot of DrawerHeaderTitle and in TeachingPopoverHeader or TeachingPopoverTitle, and match the heading level to the page outline, because the trigger alone rarely explains what just appeared. Manage focus deliberately: the trigger components move focus into the surface and return it to the trigger on dismissal, so avoid unmounting or rebuilding the trigger while a surface is open, use the focus-trapping options on Popover only for surfaces that are genuinely modal, and use unstable_disableAutoFocus when the content is a non-interactive hint. Keep Escape working as the universal dismiss gesture, and never make an overlay openable only by pointer — hover and context opening must always have a click or keyboard equivalent, which is exactly what openOnHover and openOnContext are meant to supplement. Inside teaching experiences, the carousel navigation buttons require accessible text for every step, and TeachingPopoverCarouselPageCount lets progress be conveyed as text instead of dots alone. Because overlay surfaces are typically rendered through a portal, keep a FluentProvider above them so theming and direction are inherited, and check contrast carefully when choosing the brand or inverted surface appearance.

## Components in this category

- [Drawer](../components/drawer.md)
- [DrawerBody](../components/drawer-body.md)
- [DrawerFooter](../components/drawer-footer.md)
- [DrawerHeader](../components/drawer-header.md)
- [DrawerHeaderNavigation](../components/drawer-header-navigation.md)
- [DrawerHeaderTitle](../components/drawer-header-title.md)
- [InlineDrawer](../components/inline-drawer.md)
- [OverlayDrawer](../components/overlay-drawer.md)
- [Popover](../components/popover.md)
- [PopoverSurface](../components/popover-surface.md)
- [PopoverTrigger](../components/popover-trigger.md)
- [TeachingPopover](../components/teaching-popover.md)
- [TeachingPopoverBody](../components/teaching-popover-body.md)
- [TeachingPopoverCarousel](../components/teaching-popover-carousel.md)
- [TeachingPopoverCarouselCard](../components/teaching-popover-carousel-card.md)
- [TeachingPopoverCarouselFooter](../components/teaching-popover-carousel-footer.md)
- [TeachingPopoverCarouselNav](../components/teaching-popover-carousel-nav.md)
- [TeachingPopoverCarouselNavButton](../components/teaching-popover-carousel-nav-button.md)
- [TeachingPopoverCarouselPageCount](../components/teaching-popover-carousel-page-count.md)
- [TeachingPopoverFooter](../components/teaching-popover-footer.md)
- [TeachingPopoverHeader](../components/teaching-popover-header.md)
- [TeachingPopoverSurface](../components/teaching-popover-surface.md)
- [TeachingPopoverTitle](../components/teaching-popover-title.md)
- [TeachingPopoverTrigger](../components/teaching-popover-trigger.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
