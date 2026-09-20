# PopoverSurface

> **Package**: `@fluentui/react-popover` v9.14.3
> **Import**: `import { PopoverSurface } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

PopoverSurface is the visible container element of a Fluent UI React v9 Popover: the styled root div that renders whatever children the popover needs to display. Although it is exported as its own component, it acts as the declarative configuration point for the popover: alongside its required children it accepts the popover-level options — appearance, size, positioning, open, defaultOpen, onOpenChange, trapFocus, withArrow, openOnHover, openOnContext, inline, closeOnScroll, closeOnIframeFocus, mouseLeaveDelay, and the focus-trap and button-enhancement switches — which flow through the surrounding Popover context. Visually it provides a neutral raised surface by default, with a brand variant for promotional callouts and an inverted variant for dark, tooltip-like hints, an optional pointing arrow, and a size scale for constraining dimensions. In practice it is used together with Popover and PopoverTrigger (and, by default, Portal) to build non-modal, anchored floating content such as hints, quick settings, small forms, and contextual details, and it also underpins the surfaces rendered by components built on top of Popover, such as Tooltip and InfoLabel.

**When to use**: Use PopoverSurface when you need arbitrary, non-modal floating content anchored to a trigger element: contextual information, a compact set of controls, quick settings, an inline form, or a rich hint that is too structured for plain text. Choose it over alternatives as follows: reach for Tooltip when the content is short, non-interactive text that describes the trigger; reach for Menu and MenuPopover when the content is a list of commands with roving focus; reach for Dialog when the task is modal, long-running, or must block interaction with the rest of the page and needs a backdrop; reach for Drawer or OverlayDrawer when the content is a large side panel; reach for TeachingPopover when you are building onboarding or coach-mark flows with steps. PopoverSurface is also the right choice when the popover opens on hover or on context, or when you want fine control over positioning, arrow visibility, and focus trapping behavior.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `'brand' \| 'inverted'` | — | No | — |
| `children` | `[JSXElement, JSXElement] \| JSXElement` | — | Yes | — |
| `closeOnIframeFocus` | `boolean` | — | No | — |
| `closeOnScroll` | `boolean` | — | No | — |
| `defaultOpen` | `boolean` | — | No | — |
| `disableButtonEnhancement` | `boolean` | — | No | — |
| `inertTrapFocus` | `boolean` | — | No | — |
| `inline` | `boolean` | — | No | — |
| `legacyTrapFocus` | `boolean` | — | No | — |
| `mouseLeaveDelay` | `number` | — | No | — |
| `onOpenChange` | `(e: OpenPopoverEvents, data: OnOpenChangeData) => void` | — | No | — |
| `open` | `boolean` | — | No | — |
| `openOnContext` | `boolean` | — | No | — |
| `openOnHover` | `boolean` | — | No | — |
| `positioning` | `PositioningShorthand` | — | No | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `size` | `PopoverSize` | — | No | — |
| `trapFocus` | `boolean` | — | No | — |
| `unstable_disableAutoFocus` | `boolean` | — | No | — |
| `withArrow` | `boolean` | — | No | — |

### Prop Guidance

- **children**: Required content of the surface. Keep it focused and short; the surface sizes and positions itself around whatever you render. Interactive children should be reachable by keyboard, and long content should scroll deliberately or be moved to a Dialog or Drawer. `a short hint, a set of controls, or a compact form`
- **appearance**: Selects the surface color treatment. Leave it unset for the standard neutral raised surface, use brand for branded or promotional callouts that should stand out with the theme accent, and use inverted for dark tooltip-like hints that sit above light content — inverted pairs naturally with withArrow. `inverted`
- **size**: Constrains the surface dimensions using the PopoverSize scale so content does not grow unbounded or collide with viewport edges. Use it instead of fixed pixel widths, and pick the smallest size that comfortably fits the content. `small`
- **withArrow**: Renders a pointing arrow that visually connects the surface to its trigger. Use it for short, hint-like or tooltip-like surfaces, especially with the inverted appearance; skip it for larger panels where the visual connection is obvious. `true`
- **positioning**: Controls where the surface is placed relative to the trigger using the positioning shorthand (for example above, below, before, after, and alignment variants such as above-start or below-end). The surface still flips and shifts to stay inside the viewport, so treat the value as a preference rather than a guarantee. `below-start`
- **open**: Makes the popover controlled. Use it when the open state must be coordinated with other UI or validated before opening, and update it from onOpenChange; do not combine expectations with defaultOpen. `true`
- **defaultOpen**: Sets the initial, uncontrolled open state. Use it to render a popover that is already visible on first paint, for example in documentation or onboarding; it is ignored once open is supplied. `true`
- **onOpenChange**: Notifies you when the popover requests to open or close, including from Escape, outside interaction, or focus loss. Use it to sync controlled state, run side effects, or veto a close by keeping your state unchanged. `open, defaultOpen`
- **openOnHover**: Opens the surface when the pointer hovers the trigger, which is the tooltip-like interaction model. Pair it with an appropriate mouseLeaveDelay and, if the surface is interactive, ensure it can also be opened by keyboard focus on the trigger. `true`
- **openOnContext**: Opens the surface from a context menu gesture (right click, or the ContextMenu key / Shift+F10). Use it for contextual actions tied to a specific element; do not combine it with openOnHover. `true`
- **mouseLeaveDelay**: Grace period in milliseconds before a hover-opened surface closes after the pointer leaves. Increase it when the surface contains interactive content that the user must travel the pointer into, and keep it short for purely informational hints. `500`
- **closeOnScroll**: Closes the surface when the page scrolls, avoiding stale positioning when the trigger moves away from the surface. Use it for portal-rendered, hint-like popovers; for surfaces anchored inside their own scroll container, prefer inline behavior instead. `true`
- **closeOnIframeFocus**: Closes the surface when focus moves into an iframe on the page, which otherwise reports as an outside interaction and can leave the popover stranded in front of unrelated content. Enable it on pages that embed editors or third-party iframes. `true`
- **inline**: Renders the surface in place in the DOM instead of through a portal. Use it when the surface must inherit a specific ancestor context (custom stacking, CSS containment, printing, or SSR-sensitive layouts) and be aware that clipping ancestors can cut it off. `true`
- **trapFocus**: Traps focus inside the surface until it closes, turning the popover into a small modal-like region. Enable it only for interactive workflows the user should finish, and always provide a visible close affordance and Escape support. `true`
- **legacyTrapFocus**: Opts into the previous focus-trap implementation when you are migrating and the newer behavior causes regressions. Treat it as a temporary compatibility switch rather than a design choice. `true`
- **inertTrapFocus**: Uses inert semantics to block interaction with content outside the surface while the trap is active, which is preferable when you need background content to be genuinely non-interactive. Mutually exclusive with legacyTrapFocus. `true`
- **unstable_disableAutoFocus**: Prevents the surface from taking focus automatically when it opens. This API is explicitly unstable: use it only for edge cases such as keeping focus on a custom trigger, and re-test on every upgrade. `true`
- **disableButtonEnhancement**: Turns off the automatic enhancement Popover applies to Button triggers (ARIA attributes and wiring). Disable it only when you render a custom trigger and supply the equivalent semantics yourself. `true`
- **root**: The required root slot, typed as a div. Use it to change the rendered element, attach refs, or apply className and style, and to place surface-wide ARIA attributes such as role, aria-labelledby, or aria-modal. `div`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Keep the content short and self-contained — a popover is a quick, contextual detour, not a page.
- Always render PopoverSurface together with Popover and PopoverTrigger so opening, anchoring, dismissal, and the trigger ARIA wiring are handled for you.
- Pick the appearance deliberately: the default neutral surface for general content, brand for branded or promotional callouts, and inverted with withArrow for dark, tooltip-like hints.
- Constrain dimensions with the size prop instead of fixed pixel widths so the surface adapts to the theme and to text scaling.
- Enable trapFocus only when the surface hosts a small interactive workflow you want the user to complete before returning to the page, and keep popovers non-modal otherwise.
- Give the surface an accessible name through the root slot, for example aria-labelledby pointing at a heading inside the surface or aria-label on the surface itself.
- Use controlled open with onOpenChange when the open state must be coordinated with other UI, such as closing one popover when another opens.
- Raise mouseLeaveDelay when the surface is opened with openOnHover and contains interactive content, so users can travel the pointer into the surface without it closing.
- Render through Portal (the default) so the surface escapes ancestors with overflow hidden, transforms, or clipping stacking contexts.
- Provide an explicit dismissal affordance such as a Button in the surface when the content is interactive and opened on hover.

### Don'ts

- Do not use PopoverSurface as a modal dialog replacement — there is no backdrop, no scroll lock, and the page stays interactive.
- Do not stack popovers on top of each other without a clear hierarchy; nested surfaces create confusing focus order and dismissal behavior.
- Do not put long scrolling lists, multi-step wizards, or large data grids inside the surface — use Dialog, Drawer, or a dedicated page instead.
- Do not hard-code pixel values or hex colors in the surface; it will break under dark, high-contrast, or brand themes.
- Do not make essential information available only through a hover-triggered surface; touch and keyboard users cannot hover.
- Do not enable openOnContext and openOnHover on the same instance — the two interaction models conflict.
- Do not combine legacyTrapFocus with inertTrapFocus, or rely on unstable_disableAutoFocus together with trapFocus, since those combinations produce unpredictable focus placement.
- Do not set open and defaultOpen at the same time expecting defaultOpen to take effect; providing open makes the popover controlled and defaultOpen is ignored.
- Do not set disableButtonEnhancement unless you are prepared to supply the trigger ARIA attributes and props yourself.
- Do not assume arrow keys navigate the surface; PopoverSurface handles no roving focus, so menu-like content needs Menu or explicit keyboard handling.

## Anti-Patterns

### Using PopoverSurface as a modal dialog

❌ The popover is non-modal by default: there is no backdrop, the page remains interactive, and background content is not reliably hidden from assistive technology, so a critical confirmation or a destructive action placed here can be answered out of order.

✅ Use Dialog and DialogSurface for modal tasks that require a backdrop, scroll locking, and modal semantics; keep PopoverSurface for lightweight, non-blocking content, or enable trapFocus with an explicit dialog role only for very small interactive detours.

### Hover-only access to important information

❌ A surface opened with openOnHover is unreachable for keyboard and touch users, and screen reader users cannot hover the trigger, so anything essential inside it is effectively hidden from them.

✅ Reserve hover-opened surfaces for supplementary hints, make the same content available on focus of the trigger, and describe the trigger with aria-describedby when the hint is meaningful. For anything the user must act on, use a click-triggered open and a visible close affordance.

### Fighting the positioning engine with fixed dimensions

❌ Hard-coded widths and heights inside the surface cause it to overflow narrow viewports and to collide with page edges, because the surface can only flip or shift, not shrink.

✅ Use the size prop and token-based padding so the surface can be constrained, and let the content wrap or scroll within a bounded height instead of forcing a fixed pixel box.

### Nesting popovers without hierarchy

❌ Rendering one PopoverSurface inside another, or leaving several popovers open at once, produces overlapping portals, ambiguous focus order, and dismissal rules that fight each other (clicking inside one closes another).

✅ Allow a single popover per logical interaction; open child surfaces only after the parent closes, and coordinate the open state with onOpenChange and the open prop so only one surface is visible at a time.

### Hard-coding surface colors and shadows

❌ Literal hex colors and box shadows do not respond to dark mode, high contrast, or brand theme changes, and they visually detach the surface from the rest of the UI.

✅ Style through the appearance prop and Griffel theme tokens such as tokens.colorNeutralBackground1, tokens.colorNeutralForeground1, tokens.colorBrandBackground, tokens.colorNeutralBackgroundInverted, tokens.shadow16, tokens.borderRadiusMedium, and the spacing tokens.

## Accessibility

**Requirements**: The surface must satisfy WCAG 2.1 requirements for content that appears on hover or focus (1.4.13): the content must be dismissible (Escape closes it), hoverable (the pointer can move from the trigger into the surface), and persistent (it does not disappear while the user reads it). Interactive content inside the surface must be reachable and operable by keyboard (2.1.1) with a logical focus order (2.4.3). The trigger and the surface need a programmatic name and role (4.1.2), which is why the automatic trigger enhancement that Popover performs for Button children should be kept unless you replicate it. Text and non-text contrast (1.4.3, 1.4.11) must be checked for the brand and inverted appearances, and focus indication inside the surface must remain visible. When trapFocus is enabled the surface behaves like a modal region and must offer an unambiguous way to close it and return focus to the trigger.

| Key | Action |
| --- | --- |
| `Escape` | Dismisses an open popover and returns focus to the trigger element. |
| `Enter` | Activates the trigger (when the trigger is a button) and opens the surface. |
| `Space` | Activates the trigger (when the trigger is a button) and opens the surface. |
| `Tab` | Moves focus to the next focusable element inside the surface; with trapFocus enabled, focus cycles within the surface instead of leaving it. |
| `Shift+Tab` | Moves focus to the previous focusable element; with trapFocus enabled, focus cycles backwards within the surface. |
| `ContextMenu key or Shift+F10` | Opens the surface when openOnContext is enabled, typically at the position of the trigger or pointer. |

**ARIA**: aria-labelledby, aria-label, aria-expanded, aria-haspopup, aria-controls, aria-describedby, role, aria-modal

**Screen Reader**: A screen reader announces the trigger together with its expanded or collapsed state, which the Popover derives from the surface's open state; the surface itself is associated with the trigger so that moving into it is predictable. Because the surface renders as a generic container by default, you should supply a role (for example dialog when the content is an interactive dialog-like region, and a matching aria-modal when trapFocus is used) plus aria-labelledby or aria-label on the root slot so the region is announced with a meaningful name. Without trapFocus, focus stays on the trigger when the popover opens and the surface's content is read as the user navigates into it, so DOM order matters. For hover-only, tooltip-like surfaces the content is invisible to screen reader users who cannot hover, so describe the trigger with aria-describedby or repeat the essential text in the trigger itself.

## Styling

PopoverSurface accepts a className and style that land on its root div, and the root slot can be targeted for deeper customization, but most visual work should go through tokens rather than literals. The default neutral surface uses tokens.colorNeutralBackground1 for its background, tokens.colorNeutralForeground1 for text, tokens.colorTransparentStroke with tokens.strokeWidthThin for its border, tokens.borderRadiusMedium for its corner radius, tokens.shadow16 for its elevation, and internal padding composed from tokens.spacingVerticalMNudge and tokens.spacingHorizontalMNudge. Override padding with tokens.spacingVerticalL and tokens.spacingHorizontalL for content-heavy surfaces, or reduce it when the surface wraps a single compact control. Changing the appearance switches the token set: brand surfaces read from tokens.colorBrandBackground with tokens.colorNeutralForegroundOnBrand text, and inverted surfaces read from tokens.colorNeutralBackgroundInverted with tokens.colorNeutralForegroundInverted, which is what makes withArrow look like a classic tooltip arrow since the arrow inherits the surface background. Prefer the size prop over fixed widths so the surface keeps consistent min and max dimensions across the size scale, and if you must set dimensions, express them through the root slot with tokens rather than raw pixels. Keep z-index concerns in mind when styling custom stacking contexts, and let Portal handle layering rather than raising z-index manually.

## Performance

Each open popover creates a portal, a positioning calculation, and event listeners for outside interaction, scroll, resize, and focus changes, so avoid rendering dozens of these surfaces on a single screen and prefer a single shared popover over one instance per list row when possible. Keep the surface's children cheap: a popover that opens on every hover should not mount a large chart, a heavy list, or a data fetch on each open — lift expensive state above the surface or defer it until the surface is actually shown. Positioning is recalculated on scroll and resize; closeOnScroll is a cheap way to avoid continuously repositioning a hint-like surface over a scrolling region. mouseLeaveDelay introduces timers for hover-opened surfaces, so keeping the value modest avoids stacking timers when users sweep the pointer across many triggers. Because inline surfaces skip the portal, they can reduce mounting overhead in very tight loops, but they may also force layout and painting in the middle of a complex subtree.

## Theming & Tokens

PopoverSurface inherits everything from the nearest FluentProvider and expresses its look through theme tokens rather than literals. The default surface paints tokens.colorNeutralBackground1 with tokens.colorNeutralForeground1 text, tokens.colorTransparentStroke borders at tokens.strokeWidthThin, tokens.borderRadiusMedium corners, tokens.shadow16 elevation, and internal padding built from tokens.spacingVerticalMNudge and tokens.spacingHorizontalMNudge. The brand appearance swaps in tokens.colorBrandBackground with tokens.colorNeutralForegroundOnBrand, and the inverted appearance uses tokens.colorNeutralBackgroundInverted with tokens.colorNeutralForegroundInverted; the arrow rendered by withArrow inherits the same background token so it visually merges with the surface. Secondary text inside the surface should use tokens.colorNeutralForeground2, and separators inside it should use tokens.colorNeutralStroke2 or Divider so they recolor correctly. Under high-contrast or forced-colors modes the border and elevation fall back to system colors through the transparent-stroke token, which is another reason to avoid custom shadows and hard-coded colors.

## Migration Notes

In Fluent UI React v8 the equivalent floating content lived inside a Callout (often combined with Layer or Portal), where positioning was expressed with directionalHint and directionalHintFixed, the pointer was controlled by isBeakVisible, and layering was opted out of with doNotLayer. In v9 that surface responsibility belongs to PopoverSurface inside a Popover: positioning is expressed with the positioning shorthand (values such as above, below, before, and after, with alignment variants like above-start), the arrow is controlled by withArrow, and portal rendering is the default with inline available as the opt-out. Dismissal callbacks such as onDismiss are replaced by the controlled open state plus onOpenChange, and the v8 pattern of putting interactive content in a Callout now maps to either this surface with trapFocus enabled or, for truly modal tasks, to Dialog.

## Edge Cases

- An inline surface can be clipped or mispositioned when an ancestor sets overflow hidden, a transform, a filter, or its own stacking context; use the default portal rendering in those layouts.
- closeOnScroll and closeOnIframeFocus are dismissal heuristics tuned for portal-rendered surfaces; when inline is used the surface scrolls with its trigger, so these flags have little or no effect.
- trapFocus, legacyTrapFocus, and inertTrapFocus describe overlapping strategies — enable one deliberately, since mixing them leads to inconsistent tab order and outside-click behavior.
- unstable_disableAutoFocus combined with trapFocus can leave initial focus on the trigger while the surface claims focus containment, so the first Tab press may jump unexpectedly.
- Hover-opened surfaces with interactive content need a non-trivial mouseLeaveDelay, otherwise a small pointer deviation while moving toward a control closes the surface before the user reaches it.
- Supplying open makes the popover controlled and defaultOpen is then ignored, which commonly surprises consumers who set both during a migration.
- Fixed-size content plus a viewport-aware positioner can still overflow on very small screens; combine the size prop with wrapping or internal scrolling for narrow viewports.
- Popovers rendered inside a Dialog or Drawer compete with the parent's focus trap under trapFocus or inertTrapFocus, so verify Escape handling and focus restoration in that nesting.
- Arrow-key navigation is not provided by PopoverSurface; menu-like content placed directly in the surface must implement roving focus itself or use Menu and MenuPopover instead.
- A popover whose trigger is removed from the DOM while open (for example a row deleted from a list) has no anchor to position against, so close it explicitly through the controlled open state when you remove its trigger.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
