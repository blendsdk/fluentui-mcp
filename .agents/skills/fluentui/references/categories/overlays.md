# overlays components

## Overview

Overlays are surfaces that float above the page instead of taking part in its layout: Popover for small, anchored, contextual content; Drawer for larger panels that either push page content aside or cover it (chosen with the Drawer type prop of inline or overlay); and TeachingPopover for guided, step-by-step coachmarks. They share the same mechanics — a trigger, an anchored floating surface, focus handling, dismissal, and motion — and in Fluent UI v9 those mechanics are exposed rather than hard-coded, so the open prop and onOpenChange give you explicit control, trapFocus, inertTrapFocus and legacyTrapFocus decide how focus is contained, closeOnScroll and closeOnIframeFocus decide when the surface goes away, and positioning decides where it lands. Supporting utilities in this space do the plumbing: Portal places a surface into a mount node, Positioning anchors a popping surface to a target, Provider carries theme and direction (dir) into portals through applyStylesToPortals and targetDocument, Aria provides off-screen text for overlay content without visible labels, and the surfaceMotion slot plus the Motion utilities drive enter and exit animation. Choosing an overlay is therefore a question of modality, persistence, and anchoring, not of visual preference.

## When to Use

Reach for an overlay when information or a task is contextual, transient, or secondary to the page and would be disruptive if it occupied permanent layout space. Use Popover when the content is small, anchored to a specific trigger, and non-modal — inspective details, a small set of options, a compact form, or a hover/focus hint that is too large for a Tooltip; it can open on click, hover (openOnHover with mouseLeaveDelay), or context (openOnContext), and its appearance, size, inline, and withArrow props tune the surface. Use Drawer when the overlay needs real estate and structure: a filter panel, a details view, a settings pane. Choose type inline when the panel should participate in the page flow and push content, and type overlay when it should cover content; combine it with the surrounding layout rather than treating it as a floating bubble. Use TeachingPopover when you are teaching a feature across a sequence of steps rather than showing incidental content — it supplies the coachmark anatomy (icon, title, body, dismissButton), step navigation (navType of next or prev, handleButtonClick), step wording (initialStepText, finalStepText), and carousel media via mediaLength, value, altText, layout, and footerLayout. For anything that must block the rest of the page until dismissed, this category is the wrong tool: Dialog belongs to the feedback category and is the modal primitive (modalType, inertTrapFocus, unmountOnClose), while Menu (navigation) owns command lists and flyout submenus and Tooltip (feedback) owns brief, non-interactive descriptions. When several of these need to coexist or the surface must render outside the app root, Portal, Positioning, and Provider are the utilities that make that composition work.

## Best Practices

### Do's

- Pick the overlay by modality and persistence first: Popover for anchored, non-modal context; Drawer for structural panels with type inline or overlay; TeachingPopover for sequenced onboarding; Dialog for anything that must block the page until it is answered.
- Anchor overlays to a real, focusable, labeled control — a Button with a subtle or transparent appearance and an icon, for example — so the surface can be opened and reached by keyboard and is announced as a control rather than an inert decoration.
- Choose open-state handling deliberately: use defaultOpen for simple, self-contained surfaces, and switch to the controlled pair (open plus onOpenChange) when you must react to dismissal, coordinate multiple overlays, or keep application state in sync with what is visible.
- Match dismissal behavior to intent instead of accepting defaults blindly: closeOnScroll and closeOnIframeFocus for surfaces that would otherwise detach visually from their anchor, mouseLeaveDelay when opening on hover, and a short, intentional motion via the surfaceMotion slot rather than long or decorative animation.
- Let the framework position the surface — use the positioning prop and the Positioning utility that anchors a popping surface to its target — so the overlay flips and repositions as the viewport, scroll container, or anchor moves.
- When a surface is rendered through a portal or into a different mount node, keep it inside the Provider tree and rely on applyStylesToPortals and targetDocument so theme tokens, direction (dir), and style overrides reach the floating content; otherwise the overlay renders with default tokens and can break in right-to-left layouts.
- Keep overlay content short, scannable, and self-sufficient: a heading or label, one or two sentences or controls, and a clear way to dismiss. If the content needs scrolling, sections, or its own navigation, promote it to a Drawer.
- Give non-textual overlay content an accessible name: use Aria for off-screen text that labels an icon-only trigger or an illustrated TeachingPopover step, and make sure the altText and step text you supply for a TeachingPopover genuinely describe what the user is looking at.

### Don'ts

- Don't use Popover as a dialog. It does not block the rest of the page, so users can tab away from it and screen readers can wander behind it; when a task must be completed before continuing, use Dialog with an appropriate modalType and inertTrapFocus.
- Don't leave interactive overlay content without focus containment. If the surface holds buttons, inputs, or links, keep focus trapping enabled (trapFocus or inertTrapFocus) and treat legacyTrapFocus and unstable_disableAutoFocus as exceptions you can justify, not as defaults.
- Don't hand-roll positioning with fixed coordinates, hard-coded offsets, or absolutely positioned wrappers. That approach ignores scroll containers and viewport edges, and it duplicates what the positioning prop and the Positioning utility already do reliably.
- Don't stack overlays on top of overlays — a Popover inside a Drawer inside another Popover, or a surface that opens another surface on the same click. It creates competing focus containers, ambiguous Escape handling, and confusing dismissal order.
- Don't put essential or error-critical information only behind a hover-triggered overlay. Hover-only surfaces are unreachable for touch and keyboard users and are easily missed; use an inline, persistent treatment (such as MessageBar or Field validation) for anything the user must act on.
- Don't hide the only path to an important action inside a transient overlay, and don't rely on it as the sole means of navigation. Overlays are dismissible by design; durable destinations belong on the page or in persistent navigation components.
- Don't rebuild onboarding as a loose sequence of independent Popovers with your own step counters and next buttons. TeachingPopover already models a multi-step coachmark with step navigation, initial and final step text, media, and a dismissButton, and hand-rolled equivalents drift in copy, order, and dismissal.
- Don't render overlay surfaces outside the theming and direction context. Portaling content without the Provider context (and without applyStylesToPortals when styles must follow the surface) yields unthemed, directionally broken content.

## Anti-Patterns

### Treating a popover as a modal dialog

❌ Popover is a non-modal anchored surface. When it is used for a blocking task, the rest of the page stays focusable and readable, the user can tab into controls behind the surface, and there is no scrim or modal semantics to tell assistive technology that the page is temporarily unavailable.

✅ Use Dialog with a modalType and inertTrapFocus for tasks that must be completed before the user continues, and reserve Popover for contextual, dismissible, non-blocking content such as details or a small set of choices anchored to their trigger.

### Reimplementing focus, dismissal, and positioning by hand

❌ Manual Escape handling, hand-written focus traps, and absolutely positioned wrappers duplicate behavior the components already provide, and they typically miss edge cases: focus escaping to the document body, surfaces not returning focus to the trigger, overlays drifting out of view on scroll, or surfaces staying open when the page scrolls underneath them.

✅ Lean on the built-in controls — trapFocus or inertTrapFocus for containment, onOpenChange with open for state coordination, closeOnScroll and closeOnIframeFocus for lifecycle, and the positioning prop plus Positioning for placement — and only step outside them (legacyTrapFocus, unstable_disableAutoFocus) with a specific, documented reason.

### Stacking overlay surfaces

❌ Opening a Popover from inside a Drawer that itself contains another popping surface produces competing focus containers, undefined Escape behavior, and dismissal orders users cannot predict. It also makes z-order, positioning, and scroll dismissal fragile.

✅ Flatten the flow: prefer a Drawer with enough structure for the whole task over layered popovers, use Menu for nested command sets, complete one surface before opening another, and if two overlays truly must coexist, drive them from explicit open state so only one holds focus at a time.

### Portaling overlay content out of the theme and direction context

❌ Rendering a surface into an unrelated mount node detaches it from the theme, the text direction, and any style overrides applied higher in the tree, so the overlay ships with default tokens, misaligned arrows, and incorrect layout in right-to-left locales.

✅ Keep portaled surfaces inside the Provider tree and configure Provider with applyStylesToPortals and targetDocument when the mount node lives outside the root, so theme, dir, and overrides reach the floating content.

### Hover-only or content-only overlays carrying important information

❌ Surfaces opened with openOnHover and no equivalent focus or click path are unreachable on touch devices and awkward for keyboard users, and information that lives only in a transient overlay disappears the moment the pointer moves.

✅ Open overlays from a focusable trigger that works with pointer, keyboard, and touch; when a Tooltip is used for supplementary text, set its relationship prop to make the semantics explicit; and move anything the user must act on into persistent page content such as a MessageBar, field validation, or an inline description.

### Improvised multi-step onboarding

❌ A chain of unrelated Popovers with hand-built step counters, next buttons, and dismiss affordances produces inconsistent copy, unpredictable dismissal, and no reliable progress model, and it duplicates behavior that already exists.

✅ Use TeachingPopover for guided flows: supply the step content and media, drive navigation with navType and handleButtonClick, set initialStepText and finalStepText, use footerLayout and layout for the step chrome, and always render a dismissButton so users can leave the tour at any point.

## Accessibility

Every overlay in this category must be operable without a pointer. The trigger has to be a real focusable element with an accessible name, and when the surface opens, focus should move into it and be contained there for the duration — that is what trapFocus and inertTrapFocus control, and surfaces with interactive content should keep containment on. When the surface closes, focus must return to the element that opened it so keyboard users do not lose their place. Escape or an equivalent, always-present dismiss control (such as the TeachingPopover dismissButton) must close the surface, and dismissal must not be the only way to reach important content. Because these surfaces are anchored and moved by the framework, their exposed accessibility relationship must be explicit: describe what the popover is doing for the user rather than assuming proximity to the trigger conveys meaning, use Aria for off-screen labels on icon-only overlays, and when a Tooltip is used alongside an overlay, set its relationship prop so assistive technology treats the text as a label or a description rather than as an inaccessible ornament. Motion through the surfaceMotion slot should be brief and should not block input or delay focus; content must be readable and reachable with the keyboard in both left-to-right and right-to-left layouts, which is why Provider's dir, targetDocument, and applyStylesToPortals matter when the surface is portaled. TeachingPopover steps must be navigable in order with clear, labeled controls, and their media needs meaningful alternative text rather than decorative fills.

## Components in this category

- - [Drawer](../components/drawer.md)
- - [Popover](../components/popover.md)
- - [TeachingPopover](../components/teaching-popover.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
