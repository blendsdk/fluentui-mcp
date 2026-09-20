# utilities components

## Overview

The utilities category is the composition and infrastructure layer of Fluent UI React. It contains the provider and portal that establish theme, text direction and DOM placement (FluentProvider, Portal), the live region used to speak changes to assistive technology (AriaLiveAnnouncer), the multi-part assemblies that coordinate a set of children (Accordion for in-place disclosure, Carousel for sequenced slides, Toolbar for grouped actions and view controls), and the overflow markers (OverflowItem, OverflowDivider) that let a set of items declare how it should degrade as space shrinks. These components rarely carry content of their own. Instead they define the context, structure, measurement and keyboard model that the rest of a Fluent UI surface builds on, which is why they are usually the first thing to get right and the last thing anyone notices.

## When to Use

Reach for these components when the problem is structural rather than visual. Use the Accordion family to reveal and hide related regions in place, the Carousel family to move through a small ordered set of slides, the Toolbar family to organize a compact cluster of actions and view controls, and OverflowItem with OverflowDivider when a row of items must degrade gracefully instead of wrapping or clipping. FluentProvider belongs at the application root (and around any separate document or shadow root you render into), Portal belongs wherever content genuinely must live in a different DOM position, and AriaLiveAnnouncer belongs mounted once so that state changes can be spoken. Treat all of them as scaffolding for other components rather than as replacements for them: if content only needs to be shown, hidden or grouped, plain layout plus the specific control in question is usually the smaller, clearer answer.

## Best Practices

### Do's

- Wrap the application once in FluentProvider and set theme and dir there, so every descendant inherits a single source of truth; add applyStylesToPortals when surfaces rendered outside the tree must keep those styles, and targetDocument when rendering into another document.
- Give every AccordionItem a unique, stable value, because the Accordion matches openItems against those values; drive the accordion with openItems and onToggle when expansion state must be persisted, restored or deep-linked, and use defaultOpenItems for simple uncontrolled cases.
- Compose the whole Carousel assembly instead of the root alone: Carousel as the state owner, CarouselViewport and CarouselSlider for the track, CarouselCard for each slide, CarouselNav with CarouselNavButton or CarouselNavImageButton for direct access to a specific slide, and CarouselNavContainer when you want the built-in previous, next and autoplay grouping.
- Choose controlled or uncontrolled carousel state deliberately, using defaultActiveIndex for simple cases and activeIndex with onActiveIndexChange when something outside the carousel needs to follow or set the current slide, and tune groupSize, whitespace, align and motion to the amount of content per view.
- Set vertical consistently on Toolbar and on every child that accepts it, so the visual direction, the divider orientation and the keyboard model all agree.
- Manage toolbar selection through the Toolbar's checkedValues, defaultCheckedValues and onCheckedValueChange, keyed by the name you assign to each ToolbarToggleButton or ToolbarRadioButton, and give independent groups distinct names.
- Give OverflowItem a stable unique id and share one groupId across exactly the items that should collapse as a unit, placing an OverflowDivider with the same groupId at each boundary between groups.
- Mount AriaLiveAnnouncer once near the app root, and keep announced messages short, meaningful and infrequent.

### Don'ts

- Do not hard-code colors, fonts or direction with CSS or one-off overrides instead of using FluentProvider's theme and dir props; when a component legitimately needs different styling, use the customStyleHooks_unstable overrides the provider exposes rather than nesting providers for decoration.
- Do not reach for Portal to fix clipping or stacking for surfaces that already manage their own layering, such as dialogs, popovers, menus and tooltips, because you lose their focus, dismissal and positioning behavior.
- Do not use Accordion for page navigation or as a substitute for a tab set, and do not place interactive controls inside an AccordionHeader, which is meant to be a single expand and collapse target.
- Do not leave Carousel autoplay running with no way to stop it, do not make dragging the only way to change slides, and do not use circular looping for step-like flows where sequence carries meaning.
- Do not treat Toolbar as a general layout container or a dumping ground for every page action, and do not mix ToolbarToggleButton and ToolbarRadioButton under the same name, because the checked values would then mean two different things.
- Do not let overflow collapse an action out of reach: anything that moves into an overflow region must remain reachable and keep a text label instead of becoming an unlabeled icon.
- Do not announce every hover, focus or trivial state change through AriaLiveAnnouncer, and do not use it to convey information that is otherwise unavailable on the page.

## Anti-Patterns

### Provider treated as an afterthought

❌ A FluentProvider is added deep in the tree, or only wraps the visible page, and then dialogs, menus and layered surfaces render off-theme or in the wrong direction. Theme, direction and portal styling all originate from the provider, so partial coverage produces inconsistent results that are hard to trace.

✅ Mount FluentProvider once at the application root with theme and dir, plus applyStylesToPortals and targetDocument where content leaves the tree, and rely on customStyleHooks_unstable for the rare per-component override instead of scattering providers.

### Accordion used as navigation or as tabs

❌ Accordion expands and collapses content in place. When it is used to switch views or pages, the header semantics, the expanded state and the relationship between a header and its panel stop matching what users experience, and controlled state keyed by item value no longer lines up with routing.

✅ Keep Accordion for progressive disclosure of related content, choose multiple and collapsible to express whether several panels or at least one panel may be open, set openItems and onToggle only when state truly must be controlled, and leave routing and view switching to the navigation and tab components.

### Carousel treated as a content dump

❌ Slides are used to hide a long list of equally important items, autoplay advances them before anyone finishes reading, and controls are missing or drag-only. Users who cannot see or cannot use a pointer never reach the later slides, and the grouped slides lose any sense of order.

✅ Use Carousel for a small ordered set of slices that are genuinely browsable one at a time, provide CarouselButton or CarouselNavContainer controls plus a CarouselNav for direct access, offer CarouselAutoplayButton and autoplayInterval rather than silent motion, keep circular for looping galleries, and describe each change through announcement.

### Toolbar without structure or a state model

❌ One flat row of buttons and toggles with no groups or dividers, a vertical flag that disagrees between parent and children, and toggles and radios sharing a name. Related actions cannot be scanned, the keyboard order feels arbitrary, and the checked values are impossible to interpret or reset.

✅ Group related controls with ToolbarGroup, separate them with ToolbarDivider, give every selectable control a value and a name unique to its group, wrap exclusive choices in ToolbarRadioGroup, drive state with checkedValues and onCheckedValueChange on the Toolbar, and set vertical consistently on the toolbar, its groups, its dividers and its items.

### Overflow markers without stable identity

❌ Items are marked with index-based or duplicated ids, and items that should collapse together are given different group ids. The measuring container cannot tell the items apart, so state and focus are lost when an item moves into or out of the overflow region and dividers land in the wrong place.

✅ Use stable, unique ids derived from your own data, share one groupId across exactly the items that should collapse as a unit, give the matching OverflowDivider the same groupId, and keep a visible label on anything that ends up in the overflow region.

## Accessibility

Shared expectations run across this whole category. Mount AriaLiveAnnouncer once and announce only brief, meaningful changes such as a slide change or completed background work, never text that is already readable on screen, because an over-active live region makes the rest of the page unusable with a screen reader. In an Accordion, every header must be keyboard operable and its text must stand on its own as the control name, disabled items should be marked with AccordionItem's disabled prop rather than removed, and the expand icon should read as decoration rather than as the only affordance; keep header size and expandIconPosition consistent within one accordion so the affordance is predictable. A Carousel must never autoplay without an exposed way to pause, must provide named previous and next controls rather than relying on drag, and should describe each change through the announcement callback so the content is not silently replaced for non-visual users; cardFocus decides whether focus follows a slide, so choose it deliberately. A Toolbar must set vertical to match its layout so arrow-key expectations and visual order agree, and mutually exclusive choices belong in ToolbarRadioGroup so radio semantics are exposed. Finally, FluentProvider's dir must reflect the language so reading and keyboard order stay correct, and content rendered through Portal must stay inside that provider's theme and direction context and keep its logical order relative to the trigger that opened it.

## Components in this category

- [Accordion](../components/accordion.md)
- [AccordionHeader](../components/accordion-header.md)
- [AccordionItem](../components/accordion-item.md)
- [AccordionPanel](../components/accordion-panel.md)
- [AriaLiveAnnouncer](../components/aria-live-announcer.md)
- [Carousel](../components/carousel.md)
- [CarouselAutoplayButton](../components/carousel-autoplay-button.md)
- [CarouselButton](../components/carousel-button.md)
- [CarouselCard](../components/carousel-card.md)
- [CarouselNav](../components/carousel-nav.md)
- [CarouselNavButton](../components/carousel-nav-button.md)
- [CarouselNavContainer](../components/carousel-nav-container.md)
- [CarouselNavImageButton](../components/carousel-nav-image-button.md)
- [CarouselSlider](../components/carousel-slider.md)
- [CarouselViewport](../components/carousel-viewport.md)
- [FluentProvider](../components/fluent-provider.md)
- [OverflowDivider](../components/overflow-divider.md)
- [OverflowItem](../components/overflow-item.md)
- [Portal](../components/portal.md)
- [Toolbar](../components/toolbar.md)
- [ToolbarButton](../components/toolbar-button.md)
- [ToolbarDivider](../components/toolbar-divider.md)
- [ToolbarGroup](../components/toolbar-group.md)
- [ToolbarRadioButton](../components/toolbar-radio-button.md)
- [ToolbarRadioGroup](../components/toolbar-radio-group.md)
- [ToolbarToggleButton](../components/toolbar-toggle-button.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
