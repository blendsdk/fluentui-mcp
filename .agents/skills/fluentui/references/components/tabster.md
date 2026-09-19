# Tabster

> **Package**: `@fluentui/react-tabster` v9.26.15
> **Import**: `import { Tabster } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

Tabster is the focus-management utility exported from @fluentui/react-components and categorized under the utilities family rather than the visual component set. It is not a rendered element: the data surface shows no props, no slots, and no Storybook stories, which reflects its role as a non-visual behavioral layer that Fluent UI v9's interactive composites rely on to coordinate keyboard navigation and focus. In practice Tabster is what makes patterns such as focus trapping in modal surfaces, roving tab order inside composite widgets, restoration of focus to the invoking element after a layer closes, and skipping of disabled or inert content behave consistently across the component library. Because it manipulates the document's focus order and key event handling rather than producing markup, there is nothing for Tabster to theme, size, or position — you consume it transitively through the Fluent components you render, and you interact with it only when you build your own custom composite widgets that need the same guarantees. It is not deprecated and it ships as part of the main package, so it requires no separate install step beyond the standard @fluentui/react-components import.

**When to use**: Reach for Tabster-powered behavior when you are building a custom composite widget or an app shell that has to reproduce the keyboard and focus guarantees that Fluent UI v9 components already provide: focus staying inside an open modal surface, focus returning to the correct trigger when a layer is dismissed, arrow-key movement within a group of related items, and skipping over content that should not be reachable by keyboard while it is disabled, hidden, or covered by an overlay. Prefer the higher-level Fluent components first — Dialog, Drawer, Menu, Popover, Tooltip, TeachingPopover, Toolbar, Tree, Tabs, and ContextSelector already integrate this behavior, and re-implementing it by hand usually produces inconsistent results. Treat Tabster directly as an infrastructure concern for scaffolding you build yourself: custom layer hosts, bespoke list widgets with roving tab order, or layout containers whose descendants mount and unmount dynamically and must not leave focus stranded. Do not use it as a substitute for semantic HTML, roles, or labels, and do not use it to make non-interactive content focusable.

## Props Reference

_No documented props._

## Best Practices

### Do's

- Consume focus behavior transitively through the Fluent UI v9 components that already integrate it — Dialog, Drawer, Menu, Popover, Tooltip, Toolbar, Tree, Tabs, and ContextSelector — before reaching for the utility directly.
- Keep a single focus-management owner per application tree rather than layering several independent focus handlers over the same subtree, which produces competing key handling and unpredictable tab order.
- Verify that focus returns to the element that opened a layer once that layer is dismissed, including the nested case where a Popover or Menu is opened from inside an already-open Dialog or Drawer.
- Test every composite you build with the keyboard only: Tab and Shift+Tab to enter and leave the widget, arrow keys to move within it, Home and End where the pattern calls for them, and Escape to dismiss layers.
- Keep element identity stable for items that can hold focus; virtualize or key list items deliberately so that a focused element is not silently unmounted during a re-render.
- Make sure that disabled, hidden, or visually covered content is genuinely excluded from the keyboard order rather than merely painted over with a higher stacking context.
- Rely on the Provider at the application root so that the layer ordering and theming that focus behavior depends on are established once for the whole tree.

### Don'ts

- Do not attempt to render Tabster as a visual element or attach class names or styles to it — it produces no markup and has no slots or styling surface.
- Do not layer a third-party focus-trap or roving-tabindex library on top of the Fluent components; the two systems will fight over focus and key events.
- Do not hand-roll trap logic with manual tabindex juggling, document-level key listeners, or DOM queries when the Fluent component you are already using handles this.
- Do not treat focus management as a substitute for ARIA semantics, accessible names, or correct roles — focus order and role/label information are complementary, not interchangeable.
- Do not leave focus on the document body after a layer closes; if the original trigger is gone, choose a deliberate, meaningful fallback target rather than letting focus reset silently.
- Do not remove focus outlines on components that participate in keyboard navigation, since the component will move focus without any visible indication of where it went.
- Do not assume changing tab order alone fixes an inaccessible widget; a control that cannot be operated from the keyboard remains unusable no matter how focus is routed to it.

## Anti-Patterns

### Re-implementing focus traps beside the Fluent components

❌ Adding a separate trap or tabindex library on top of Dialog, Drawer, Menu, or Popover creates two systems that both intercept Tab and Escape. The symptoms are focus that escapes a modal, focus that gets stuck on an element that no longer exists, and Escape that closes the wrong layer.

✅ Let the Fluent component that owns the layer own its focus behavior as well. If a custom surface genuinely needs the same guarantees, build it once at that surface rather than layering handlers across the whole subtree.

### Treating focus order as a substitute for semantics

❌ Routing focus correctly to a div with no role, no accessible name, and no state information produces a widget that a screen reader user can reach but cannot understand or operate. Focus management and ARIA semantics solve different problems.

✅ Pair the managed focus order with the correct role, accessible name, and state on every focusable item — for example a toolbar with roving tab order over real buttons, or a dialog with aria-modal and a labelled heading.

### Trapping focus with no way out

❌ A contained focus region that does not honor Escape and does not return focus to the trigger is a keyboard trap, which fails WCAG 2.1.2. Users who navigate by keyboard can become unable to reach the rest of the page at all.

✅ Ensure every layer that captures focus can be dismissed from the keyboard and that dismissal returns focus to the element that opened it, with a deliberate fallback target if that element no longer exists.

### Suppressing focus indicators while relying on programmatic focus

❌ Resetting outlines or box shadows on controls that receive programmatic focus makes the navigation invisible. Sighted keyboard users lose their position the moment focus moves, even though the underlying focus routing is correct.

✅ Style the focus ring with tokens.colorStrokeFocus2, tokens.colorStrokeFocus1, and tokens.strokeWidthThick instead of removing it, and audit every control that can receive focus for a visible indication in default, hover, selected, and high-contrast states.

### Assuming focus behavior covers portal and layer edge cases automatically

❌ Content rendered through a Portal or in a layer that is visually above the page but outside the expected DOM position can be missed by restoration logic, so focus lands on the body or on a stale trigger after dismissal.

✅ Test nested and portaled scenarios explicitly — a Menu inside a Dialog, a Popover inside a Drawer, stacked dialogs — and verify that each dismissal returns focus to the element that opened that specific layer.

## Accessibility

**Requirements**: Tabster exists to satisfy the keyboard and focus clauses of WCAG 2.1 and 2.2: 2.1.1 Keyboard (all functionality operable from the keyboard), 2.1.2 No Keyboard Trap (focus must be able to leave any component, which is why Escape-to-dismiss and correct restoration matter), 2.4.3 Focus Order (a sequence that preserves meaning and operability), 2.4.7 Focus Visible, and in WCAG 2.2 the newer 2.4.11 Focus Not Obscured and 2.4.13 Focus Appearance criteria. Focus management only addresses where focus goes; it does not supply accessible names, roles, or state, so it must always be paired with the correct ARIA semantics on the components being navigated. Modal focus containment is only legitimate when the underlying surface actually is modal — set aria-modal="true" on the dialog surface and make the rest of the page inert or hidden from assistive technology so that sighted and non-sighted users share the same model of what is reachable.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus forward through the managed focus order, advancing into the next focusable item and, inside a modal or groupper region, cycling within that region rather than escaping it. |
| `Shift+Tab` | Moves focus backward through the managed focus order, wrapping to the last focusable item of a contained region when focus is on its first item. |
| `Arrow keys` | Move focus (or the active descendant) among sibling items in directional composite patterns such as toolbars, menus, tab strips, trees, and grid-like lists. |
| `Home` | Moves focus to the first item of the current group in composite widgets that support the standard listbox and toolbar patterns. |
| `End` | Moves focus to the last item of the current group in composite widgets that support the standard listbox and toolbar patterns. |
| `Escape` | Dismisses the active layer — modal, dialog, menu, popover, or tooltip — and returns focus to the element that opened it. |
| `Enter` | Activates the focused item in composite widgets where the pattern commits a selection, such as menu items and command toolbar buttons. |
| `Space` | Activates or toggles the focused item where that is the expected behavior, such as checkbox-style options or toggle buttons inside a managed group. |

**ARIA**: aria-modal, aria-hidden, aria-activedescendant, aria-label, aria-labelledby, aria-disabled, aria-expanded, aria-controls, aria-haspopup

**Screen Reader**: Tabster itself has no accessibility tree presence, so screen readers never announce it. What they announce is the consequence of the focus changes it coordinates: every programmatic focus move fires a focus event that a screen reader reads out along with the target's accessible name, role, and state, and the virtual cursor follows that focus in browse mode. When a modal surface opens, focus is moved into it and the surrounding page is expected to be marked hidden or inert so the reader's virtual cursor cannot wander outside; when the surface closes, focus returns to the invoking control and the reader re-announces that control's name and state, which is why restoring focus to the original trigger matters as much as moving it in. In composite widgets that use a roving tabindex, the reader follows the single item that currently holds focus and announces each item as arrow keys move it; in widgets that keep focus on the container and use aria-activedescendant, the reader instead announces the descendant referenced by that attribute while the container retains DOM focus.

## Styling

There is no styling surface for Tabster: it renders nothing, has no slots, and accepts no class names, so every visual concern belongs to the components it navigates. The customization that matters in practice is the visible focus indicator, because the utility moves focus and the user must be able to see where it went. Focus rings in Fluent UI v9 are built from Griffel tokens — tokens.strokeWidthThick for ring thickness, tokens.colorStrokeFocus2 for the outer ring color, tokens.colorStrokeFocus1 for the inner contrast ring, and tokens.borderRadiusMedium or tokens.borderRadiusCircular depending on the shape of the control — and controls typically expose a static focus style through their own appearance-related props rather than requiring custom rules. Hover, pressed, and selected states on items that participate in roving tab order should use the selection ramp (tokens.colorNeutralBackground1Selected, tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed, tokens.colorBrandBackground2 for subtle selected states) so that the focused item remains visually distinguishable from a merely hovered one. Because focus behavior depends on the DOM rather than on CSS, never suppress indicators with outline or box-shadow resets; if a design calls for a custom ring, restyle it with the focus tokens above instead of removing it.

## Performance

Because the utility works by observing focus, key events, and DOM mutations rather than by rendering, its cost scales with the size and churn of the trees it manages rather than with anything you pass to it. Keep the number of simultaneously mounted layers small; stacked dialogs, popovers, menus, and tooltips each add observation work and each add a restoration target that must be tracked. Avoid constant re-mounting of focusable lists — unstable keys, conditional rendering around the focused item, and virtualization that discards the focused element all force re-evaluation of focus order and can strand focus on a removed node. Prefer keeping heavy interactive content mounted but hidden over tearing it down and rebuilding it on every open and close, and avoid attaching expensive work to the focus and blur events of navigated items, since those fire on every arrow-key press inside a composite widget.

## Theming & Tokens

Tabster does not consume theme tokens directly because it emits no DOM and has no styles to resolve. Theme tokens reach the user experience indirectly, through the components whose focus order it manages: the Provider at the application root supplies the theme, and the focus ring uses tokens.strokeWidthThick, tokens.colorStrokeFocus2, and tokens.colorStrokeFocus1 so that the indicator that reveals a focus move is themed and high-contrast-aware. State colors on navigated items such as tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed, and tokens.colorNeutralBackground1Selected come from the same theme, which means a brand or dark variant that redefines those tokens automatically restyles the items the user tabs through. Because visibility of focus is the accessibility-critical token surface here, treat any theme customization that reduces contrast between the ring and its background as an accessibility regression rather than a purely visual choice.

## Edge Cases

- Nested layers: when a Popover or Menu opens from inside an open Dialog or Drawer, dismissing the inner layer must return focus to the inner trigger while the outer layer keeps containing focus; dismissing the outer layer then returns focus to the original page element.
- Portaled content: surfaces rendered through a Portal live outside the parent DOM subtree, so any restoration logic that assumes the trigger is an ancestor or a sibling within the same container will lose track of the correct return target.
- Focused element unmounted: if the node holding focus is removed during a re-render — common with virtualized lists, filterable results, or conditional rows — focus falls back to the document body and keyboard users lose their position entirely unless a fallback target is chosen deliberately.
- Disabled and inert content: items that are visually disabled must also be excluded from the keyboard order, and content behind an open modal surface must be hidden or inert rather than merely covered, otherwise both sighted and screen reader users can still reach it.
- Horizontal versus vertical arrow behavior: directional key handling is layout dependent, so a group that changes orientation at a responsive breakpoint needs its arrow behavior to follow the orientation rather than staying fixed.
- Iframes and cross-document focus: focus that moves into embedded or cross-document content leaves the managed scope, and restoration back to the host page may not behave the way it does within a single document.
- Programmatic focus versus user-initiated focus: moving focus in response to an application event can interrupt a user who is typing or reading, so programmatic focus changes should be reserved for layer transitions and deliberate navigation commands.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
