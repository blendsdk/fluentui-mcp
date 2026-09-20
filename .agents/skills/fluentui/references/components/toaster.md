# Toaster

> **Package**: `@fluentui/react-toast` v9.8.0
> **Import**: `import { Toaster } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

Toaster is the host and orchestration component for toast notifications in Fluent UI React v9. It renders the set of containers into which toasts are placed, one container per toast position (for example top-start, bottom-end, and the other supported anchors), and it owns the aria-live narration layer that announces toast content to assistive technology. Toaster itself is a non-visual container: it renders no toast UI of its own, and instead provides the mounting point and stacking/narration infrastructure that the Toast family (Toast, ToastTitle, ToastBody, ToastFooter, ToastTrigger) renders into. Because it manages announcements and positioning, a single Toaster instance is expected to live near the root of the application, inside the FluentProvider, while individual toasts are dispatched imperatively as transient feedback for background work, async operations, and confirmations.

**When to use**: Use Toaster when feedback must be transient, non-blocking, and detached from the element that triggered it: a save completed in the background, an export finished, a background sync failed, a copy-to-clipboard confirmation, or a network request that resolved while the user moved on. It is the right choice when the user does not need to stop what they are doing to acknowledge the message. Prefer MessageBar when the message is persistent and belongs in the page flow (validation summaries, page-level warnings that must stay visible). Prefer Dialog when the user must acknowledge or make a decision before continuing. Prefer Tooltip for clarifying an individual control on hover or focus. Prefer inline field-level error text (Field plus Input) for input validation, optionally pairing that with a toast for the overall operation outcome. Use the inline variant of Toaster when the toast host should participate in the surrounding layout and document flow rather than float above the page, such as inside an embedded pane or a demo surface that manages its own layering.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `announce` | `Announce \| undefined` | — | No | User override API for aria-live narration for toasts |
| `inline` | `boolean \| undefined` | — | No | — |

### Prop Guidance

- **announce**: User override API for aria-live narration. Supply it when the application needs to replace how toast messages are spoken, for example to route them through a shared announcer that deduplicates messages, to apply the application's own politeness policy, or to translate narration independently of the visible copy. When you supply a custom announce function you take responsibility for the resulting semantics, so make sure polite versus assertive politeness is still applied appropriately and that no message is silently swallowed. Leave it unset for the default behavior, which narrates routine toasts politely. `Override only to route narration through a shared announcement utility, keeping polite for confirmations and assertive for urgent errors`
- **inline**: Renders the toast host as part of the surrounding layout instead of as a floating, portal-style overlay. Use it when the Toaster lives inside an embedded surface, a preview pane, a design-system example, or any subtree that manages its own layering and must contain its own toasts rather than covering the whole application. Leave it off for the normal application-level case, where toasts should be positioned against the viewport and float above all page content. `false for application-level toasts, true for a contained demo or embedded pane`
- **root (slot)**: The root slot maps in exactly the same way to the containers rendered for each toast position, so there is currently no supported way to customize the div for an individual position. Treat it as the styling and ref hook for all position containers at once, and avoid overriding it with the expectation of changing a single anchor point. `Use the root slot for shared container spacing, layering, and pointer-event styling`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | NOTE: This root slot maps in exactly the same way to the containers rendered for each toast position There is no intention (currently) to let users customize the div for each toast position. |

## Best Practices

### Do's

- Mount exactly one Toaster near the application root, inside your FluentProvider so the toast containers and their content pick up the active theme tokens.
- Keep messages short and action-oriented: use ToastTitle for the one-line outcome and ToastBody only for the minimum detail the user needs.
- Give toasts that carry important information or an actionable next step an explicit dismiss affordance so people who need more time can keep it on screen.
- Let the default polite narration handle routine confirmations, and reserve the announce override for cases where you genuinely need assertive politeness, such as an error that requires immediate attention.
- Compose the Toaster with the Toast family components so structure, spacing, and semantics stay consistent with the rest of the design system.
- Rely on the Toaster's built-in live region for announcement instead of wrapping toast content in your own aria-live container.
- Set the inline property deliberately when the toast host should stay in the document flow, and leave it off when toasts should overlay the whole application.

### Don'ts

- Don't render multiple Toaster instances at once; duplicate hosts create competing live regions and can announce the same content twice.
- Don't use toasts for information that must remain visible, such as form validation summaries or policy warnings that the user needs to reference while working.
- Don't place blocking or focus-stealing content inside a toast; toasts must never interrupt the user's current task.
- Don't override announce in a way that suppresses narration entirely or forces every message to assertive politeness, because that turns helpful feedback into noise.
- Don't mount the Toaster deep inside a scrolling or overflow-hidden subtree, because the position containers need to layer above the rest of the application.
- Don't rely on a toast as the only place a critical error is surfaced; durable, findable error text belongs in the page or dialog as well.
- Don't customize the root slot expecting per-position control; the root maps to the containers for every toast position at once.

## Anti-Patterns

### One Toaster per feature or route

❌ Rendering a Toaster inside each route, feature, or component that wants to raise a toast produces multiple hosts, which means several live regions competing to narrate and multiple sets of position containers fighting for the same screen space.

✅ Mount a single Toaster once near the application root inside FluentProvider and dispatch all toasts to that host from anywhere in the tree.

### Persistent information in a toast

❌ Storing required information only in a toast makes it unreadable once the toast expires, and toast surfaces are poor containers for paragraphs, tables, or multi-step instructions that the user needs to consult while working.

✅ Use MessageBar for persistent in-flow messaging and Dialog for information that must be acknowledged. Reserve toasts for transient confirmations and short status updates, duplicating critical details in durable page content.

### Blocking interaction inside a toast

❌ Placing confirmation dialogs, required form fields, or focus-stealing content in a toast breaks the non-blocking contract of the component and strands users who cannot find the toast before it dismisses.

✅ Keep toasts informational with at most a lightweight action such as dismiss or undo, and move any decision that must be completed into a Dialog.

### Blanket announce override

❌ Replacing the announce behavior so that every message is assertive, or so that narration is suppressed entirely, either floods screen reader users with interruptions or hides feedback from them completely.

✅ Keep the default polite narration for routine confirmations and use a custom announce function only to add deduplication or routing, preserving the polite versus assertive distinction.

### Expecting per-position root customization

❌ The root slot maps identically to the containers for every toast position, so styling it in an attempt to reposition or restyle a single anchor point applies the change to all of them.

✅ Keep root styling limited to concerns shared by all positions, and choose the appropriate toast position rather than trying to override one container through the slot.

## Accessibility

**Requirements**: Toast content is announced through a live region rather than by moving focus, so the host must be present in the document before a toast is dispatched. Routine confirmations should be announced politely and only genuinely urgent messages should interrupt. Any interactive element inside a toast, such as a dismiss or undo button, must be reachable by keyboard and must have a discernible accessible name. Because toasts auto-expire, they must not be the only channel for information the user is required to read or act on; pair important messages with persistent page content. Toast surfaces must not steal focus from the element the user is currently operating. Contrast of toast text against its surface must meet WCAG AA, which the default theme tokens provide.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into any focusable control rendered inside a toast, such as a dismiss or action button; the Toaster itself never captures Tab. |
| `Shift+Tab` | Moves focus backward out of a toast control back to the previous focusable element in the page. |
| `Enter` | Activates a focused button inside a toast, for example dismissing the toast; the Toaster does not handle this key itself. |
| `Space` | Activates a focused button inside a toast, matching standard button behavior. |
| `Escape` | Not handled by the Toaster; a dismissible toast must expose a visible dismiss control rather than relying on an implicit Escape handler. |

**ARIA**: aria-live on the narration region, polite for routine feedback and assertive for urgent messages, aria-atomic to ensure the whole toast message is re-read rather than only the changed fragment, role on the toast region to convey status versus alert semantics, aria-label or aria-labelledby to give the toast region or its dismiss control a discernible name, aria-describedby to associate supplementary toast body text with its title

**Screen Reader**: Toasts are surfaced through a live region rather than through focus movement, so a screen reader user hears the announcement without losing their place in the page. Polite announcements are queued and read when the user is idle; assertive announcements interrupt. The announce property exists so an application can substitute or extend the narration strategy, for example to route messages through a shared AriaLiveAnnouncer, but replacing it risks losing the politeness semantics the default host provides. Because the announcement is region-based, content that arrives before the Toaster is mounted may be missed, and very long messages can be truncated by some screen readers.

## Styling

Style the Toaster through the root slot, keeping in mind that the styling applies to the containers rendered for every toast position rather than to one anchor point. Typical adjustments are spacing between stacked toasts and pointer behavior, for example giving the containers tokens.spacingVerticalS of gap and setting pointer events so only the toast surfaces, not the empty gutter, intercept clicks. The containers themselves should stay visually neutral; the visible chrome comes from the composed toast surface. Style that surface with tokens such as tokens.colorNeutralBackground1 for the background, tokens.shadow64 or tokens.shadow16 for the floating elevation, tokens.colorNeutralStroke1 with tokens.borderRadiusXLarge for a defined outline and rounded corner, and tokens.spacingVerticalM plus tokens.spacingHorizontalM for internal padding. For messaging that maps to a state, tint the leading icon or accent with tokens.colorPaletteGreenForeground1 for success, tokens.colorPaletteRedForeground1 for errors, and tokens.colorPaletteYellowForeground1 for warnings, and pair every tint with a text or icon cue so color is never the only signal. Text inside toasts should use tokens.colorNeutralForeground1 for the title and tokens.colorNeutralForeground2 for secondary body copy, and transitions between toasts read best with tokens.durationNormal and tokens.curveEasyEase.

## Performance

The Toaster is a long-lived host, so it should be mounted once and never remounted on navigation, since remounting tears down the live region and can cause announcements to be missed. Keep toast content light: small icons, short strings, and no charts or large images, because every toast is rendered inside a live region and is also re-announced. Avoid dispatching a toast on every keystroke or on high-frequency events such as scroll or resize; coalesce or deduplicate related messages so the queue stays short and the visual stack does not cover the interface. Because toast state changes trigger re-renders of the host, dispatching from deep in the component tree should not force unrelated subtrees to re-render; keep dispatch logic close to the state owner. When a custom announce function is supplied, keep it cheap and side-effect free of DOM churn, since it runs for every toast that is narrated.

## Theming & Tokens

Toaster draws its theme from the nearest FluentProvider, so nesting it inside the provider is what makes the position containers and the composed toast content respond to brand and dark theme changes. The root containers are essentially layering wrappers and consume little or no color on their own; the visible surface comes from the Toast family, which uses tokens such as tokens.colorNeutralBackground1 for the surface, tokens.colorNeutralStroke1 for its outline, tokens.shadow16 and tokens.shadow64 for elevation, tokens.borderRadiusMedium through tokens.borderRadiusXLarge for corner treatment, and tokens.spacingVerticalM with tokens.spacingHorizontalM for padding. Foreground text follows tokens.colorNeutralForeground1 and tokens.colorNeutralForeground2, while status cues draw from the palette ramps, for example tokens.colorPaletteGreenForeground1, tokens.colorPaletteRedForeground1, and tokens.colorPaletteYellowForeground1. Typography inherits tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.fontWeightSemibold for toast titles, and motion between toasts uses tokens.durationNormal with tokens.curveEasyEase. Text direction and density are inherited from the provider as well.

## Migration Notes

Toaster has no direct counterpart in previous major versions of the library, where transient notifications were typically assembled from a portal, a hand-rolled fixed-position container, and a manually managed aria-live region, or pulled in from third-party packages such as React-Toastify. The v9 component consolidates those concerns: the host owns positioning and narration, and the Toast family components own the content structure. When moving an existing notification system, plan to mount a single Toaster inside FluentProvider at the application root, replace bespoke toast markup with the Toast, ToastTitle, ToastBody, and ToastFooter components, and drop any custom live-region wrappers and custom fixed-position stacking containers that the Toaster now provides.

## Edge Cases

- Toasts dispatched before the Toaster is mounted are not announced, because the live region does not exist yet; mount the host early in the application lifecycle.
- The root slot maps to the containers of every toast position simultaneously, so there is currently no supported way to customize the div for a single position.
- The inline variant keeps toasts in the document flow, which means ancestors with overflow hidden or a constrained height can clip or hide them; verify the surrounding layout before choosing it.
- Very long toast messages can be truncated by some screen reader announcement buffers, so keep titles and bodies concise and put detail elsewhere.
- A burst of toasts stacks them within a single position container and can cover a large portion of the viewport on small screens; coalesce repeated messages instead of queuing dozens.
- Replacing the default announce behavior means the application, not the component, is responsible for politeness and for ensuring no message is dropped.
- Toasts are transient by nature, so any message that a user is required to read or act on needs a durable counterpart in the page or in a Dialog.

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
