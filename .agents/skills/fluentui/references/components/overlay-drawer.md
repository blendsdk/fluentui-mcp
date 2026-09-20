# OverlayDrawer

> **Package**: `@fluentui/react-drawer` v9.13.0
> **Import**: `import { OverlayDrawer } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

OverlayDrawer is the modal member of the Fluent UI Drawer family: a side panel that renders above the application on top of a full-bleed backdrop so the underlying page is visually and interactively obscured until the panel is dismissed. Because it is the overlay (rather than inline) variant, an OverlayDrawer blocks the page behind it, moves focus into the panel when it opens, keeps that focus contained while it is open, and returns focus to the invoking element when it closes. It is designed to be composed with the other Drawer parts — DrawerHeader, DrawerHeaderTitle, DrawerHeaderNavigation, DrawerBody, and DrawerFooter — to build a complete panel with a title area, scrolling content region, and action area. Its API surface centers on three slots: root, which is the outermost element that positions the overlay; backdropMotion, which drives the enter/exit animation of the dimming backdrop; and surfaceMotion, which drives the enter/exit animation of the sliding panel itself. Both motion slots follow the shared Fluent Motion slot contract, so the default animation behavior can be replaced without changing the structure of the drawer. The component is exported from the @fluentui/react-components package and inherits its look and behavior from the active FluentProvider theme.

**When to use**: Use OverlayDrawer when a task or context panel must take precedence over the page: filters, record details, settings, creation/edit forms, or navigation that should not coexist with the underlying content. Choose it over the inline Drawer when you do not want the main content to reflow, when the panel is temporary, and when it is acceptable for the page beneath to be covered by a backdrop. Choose OverlayDrawer over Dialog when the content is long, vertically oriented, or benefits from a header/body/footer structure with a tabbing path inside the panel; prefer Dialog for short, focused confirmations and small self-contained tasks, and prefer Popover, Menu, or Tooltip for lightweight contextual content that should not interrupt the page. If the panel is permanent chrome, such as a persistent navigation rail, use the inline Drawer so the user can keep interacting with the rest of the page. The deprecation of defaultOpen is a signal that OverlayDrawer is intended to be driven by application state rather than managing its own visibility.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `defaultOpen` | `boolean \| undefined` | — | No | **Deprecated** |

### Prop Guidance

- **defaultOpen**: Deprecated. It only seeds the drawer's initial visibility and cannot be changed later to open or close the panel, which makes it unsuitable for flows that need programmatic control. New code should manage visibility through application state and the controlled drawer pattern; keep this prop only if you are maintaining legacy code that cannot be refactored yet, and treat it as initial state rather than a source of truth. `true (initial visibility only, legacy usage)`
- **root**: The required root slot renders the outermost element of the overlay. Use it when you need to attach a className, a data attribute for testing, or a different element type for the overlay container. Style it cautiously: it owns the positioning context for the backdrop and the sliding surface, so changing its display, position, or overflow can detach the panel from the viewport edge or let page scroll bleed through. `provide a custom element type plus className for the overlay container`
- **backdropMotion**: Optional slot that controls the enter and exit animation of the dimming layer behind the panel. Override it only when you need branded motion or a different backdrop transition; any custom definition should keep the backdrop visible for the entire lifetime of the panel and should respect reduced-motion settings. Keep its timing aligned with surfaceMotion so the two layers move as one unit. `custom fade definition for the backdrop layer`
- **surfaceMotion**: Optional slot that controls the enter and exit animation of the drawer panel itself. Use it to change direction, duration, or curve when the drawer slides in from a particular edge, or to replace the default animation with a fade. Because the panel is the element users focus on, motion that is too slow or too springy delays the moment the content becomes usable, so keep the duration in line with Fluent motion tokens. `custom slide-in definition anchored to the drawer edge`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `backdropMotion` | — | No | For more information refer to the [Motion docs page](https://react.fluentui.dev/?path=/docs/motion-motion-slot--docs). |
| `root` | — | Yes | Slot for the root element. |
| `surfaceMotion` | — | No | For more information refer to the [Motion docs page](https://react.fluentui.dev/?path=/docs/motion-motion-slot--docs). |

## Best Practices

### Do's

- Drive OverlayDrawer visibility from application state so you can close it programmatically after a save, submit, or navigation, rather than relying on the deprecated defaultOpen initial-state prop.
- Always give the panel an accessible name by rendering DrawerHeader with DrawerHeaderTitle so assistive technology can announce the dialog's purpose when focus lands inside.
- Place the primary action and the dismissal control in predictable locations — typically a close affordance in the header and the confirming action in DrawerFooter — so users do not have to hunt for how to proceed or exit.
- Return focus deliberately: when the element that opened the drawer is unmounted or replaced while the drawer is open, move focus to a stable element in the page before closing so focus does not fall back to the document body.
- Put long, scrollable content inside DrawerBody and keep the header and footer outside the scroll region so the title and actions stay reachable.
- Only override the backdropMotion and surfaceMotion slots when you have a specific motion requirement, and mirror the default behavior's timing and direction so the panel still appears to come from the correct edge.
- Warn or confirm before closing when the drawer contains unsaved edits, since accidental backdrop or Escape dismissal can discard work.

### Don'ts

- Don't stack multiple OverlayDrawers on top of one another for multi-step flows; stacked overlays multiply backdrops, compete for focus containment, and disorient screen reader users. Use a single drawer with internal step content instead.
- Don't use OverlayDrawer for permanent page chrome such as a persistent navigation rail; the backdrop and focus containment make the rest of the app unreachable and frustrate users. Use the inline Drawer for layouts that push or sit beside content.
- Don't use OverlayDrawer for brief confirmations, destructive-action prompts, or single-field questions — those belong in Dialog, which is smaller, faster, and better matched to short decisions.
- Don't rely on defaultOpen for anything beyond initial legacy state; it is deprecated and cannot express controlled flows such as opening from a deep link or closing after an async operation completes.
- Don't remove the backdrop or make it fully transparent through styling just to let users see the page behind an overlay drawer; that breaks the modal contract and lets users interact with content that is visually unreachable.
- Don't place focusable controls outside the panel while it is open — hidden or visually obscured buttons behind the backdrop should not be reachable by keyboard or assistive technology.
- Don't define custom motion in the backdropMotion or surfaceMotion slots that ignores reduced-motion preferences, and don't give the two slots wildly different durations or curves, which makes the backdrop and panel look like separate animations.

## Anti-Patterns

### Using OverlayDrawer as permanent page chrome

❌ A persistent navigation or toolbar built with OverlayDrawer keeps a backdrop over the page and holds focus inside the panel, so users can never interact with the main content while it is visible. This contradicts what the overlay variant is for and produces an experience where the app feels permanently blocked.

✅ Use the inline Drawer for navigation and side panels that coexist with the page, and reserve OverlayDrawer for temporary, task-focused surfaces that appear and disappear.

### Stacking overlays for multi-step flows

❌ Opening a second OverlayDrawer from inside the first creates two backdrops, two competing focus containers, and an ambiguous Escape behavior. Screen reader users lose track of which panel they are in, and closing the inner panel may return focus to an unexpected place.

✅ Render a single OverlayDrawer and swap its body content between steps, or use nested non-modal content such as an accordion or a wizard inside the panel body.

### Relying on the deprecated defaultOpen prop

❌ defaultOpen only sets initial visibility. Applications that depend on it cannot close the drawer after a save, open it from a route change, or reflect drawer state in the URL, and they accumulate workarounds such as remounting the component with a new key.

✅ Manage visibility from application state and update that state when the drawer requests a change, so opening, closing, and deep-linking all flow through one source of truth.

### Styling the backdrop away to expose the page

❌ Making the backdrop transparent or removing its pointer-blocking behavior lets users click and tab into content that is visually behind the drawer. The result is a confusing, partially modal surface where the drawer looks open but the page stays interactive.

✅ Keep the backdrop painted with the theme's overlay token and keep the page behind genuinely unreachable while the drawer is open; if the page must stay interactive, switch to the inline Drawer instead.

### Putting the close affordance only in the footer behind a scroll

❌ If the only way to dismiss the drawer sits at the bottom of a long scrolling body, users on small screens or with keyboard navigation must scroll past all content to exit, and the Escape key may be the only practical exit — which is undiscoverable for many users.

✅ Provide a visible dismissal control in the header rendered with DrawerHeader/DrawerHeaderNavigation or a close affordance in DrawerFooter, and keep the header outside the scrolling region so it is always reachable.

## Accessibility

**Requirements**: An OverlayDrawer is a modal surface and must satisfy modal dialog expectations: focus must move into the panel when it opens, must remain inside while it is open, and must return to the invoking element when it closes. The panel needs an accessible name, which is normally supplied by the DrawerHeaderTitle rendered inside DrawerHeader; if a header cannot be used, an explicit label is required. Escape must dismiss the drawer whenever dismissal is permitted. While the overlay is open the rest of the page must not be operable — background controls should not be reachable by keyboard and should not be exposed to assistive technology as available content. Any dismissal triggered by the backdrop or Escape must not silently destroy user input without warning when the panel holds an in-progress form. Custom motion supplied through the motion slots should observe the user's reduced-motion preference, and the overall color contrast of the surface, text, and interactive controls must meet WCAG contrast minimums in every theme.

| Key | Action |
| --- | --- |
| `Escape` | Dismisses the overlay drawer when the drawer allows dismissal; use this as the standard keyboard exit path for the panel. |
| `Tab` | Moves focus forward to the next focusable element inside the drawer; focus containment prevents it from moving to controls behind the backdrop. |
| `Shift+Tab` | Moves focus backward to the previous focusable element inside the drawer, wrapping around the trapped focus order. |
| `Enter` | Activates the focused control inside the drawer, such as a header close button or a footer action button. |
| `Space` | Activates the focused button-style control inside the drawer, matching the behavior of every other Fluent button. |
| `Arrow keys` | Move between options inside composite widgets hosted in the drawer, such as tabs, radio groups, or menus; these are handled by the nested component, not by the drawer itself. |

**ARIA**: role="dialog", aria-modal="true", aria-labelledby (pointing at the drawer title), aria-describedby (optional, for supporting text), aria-label (when no visible title is rendered), aria-hidden or inert on background content when the drawer is modal

**Screen Reader**: When the drawer opens, focus moves into the panel and screen readers announce the dialog role together with its accessible name from the drawer title, so the user hears that a modal panel opened and what it is for. Because the drawer is modal, virtual cursor navigation should not reach the content behind the backdrop, but relying on the focus trap alone is not always sufficient in every browser and screen reader combination — verify that background content is hidden from the accessibility tree when it must not be reached. Navigation inside the drawer follows normal document order across the header, body, and footer, and controls announced in the panel behave like their standalone Fluent counterparts. On dismissal, focus returns to the element that opened the drawer and the reader continues from there; if that element no longer exists, focus should be placed on a meaningful fallback rather than the document body.

## Styling

OverlayDrawer is styled through the Fluent theme rather than inline colors. The backdrop layer is painted with tokens.colorBackgroundOverlay, so increasing the alpha or swapping to a darker neutral is the intended way to tune how much of the page shows through; avoid making it fully transparent because that contradicts the modal behavior. The sliding panel surface uses a neutral theme background such as tokens.colorNeutralBackground1 with token-based separators, so restyling it to tokens.colorNeutralBackground2 or tokens.colorNeutralBackgroundInverted for a branded panel should also update the foreground tokens you use for text (tokens.colorNeutralForeground1, tokens.colorNeutralForeground2) to keep contrast valid. Padding and internal rhythm come from the drawer parts: use tokens.spacingHorizontalXXL and tokens.spacingVerticalXXL for the header/body/footer gutters and tokens.spacingVerticalL or tokens.spacingVerticalM between stacked content. Corners and edges are governed by tokens.borderRadiusLarge / tokens.borderRadiusXLarge on the panel edge and tokens.colorNeutralStroke1 for hairline separators. Elevation should be expressed with shadow tokens such as tokens.shadow64 on the surface instead of hard-coded box shadows. Motion can be tuned through the backdropMotion and surfaceMotion slots; if you replace the default definitions, use tokens.durationGentle with tokens.curveDecelerateMid for entry and tokens.curveAccelerateMid for exit so the panel and the backdrop feel like one gesture. Because the overlay is positioned above page content, confirm any custom z-index or positioning on the root slot does not put it underneath sticky headers or toast layers.

## Performance

OverlayDrawer renders its content into an overlay layer above the application, so mounting it costs more than an inline layout: the backdrop, the panel surface, and their motion definitions are all created when the drawer appears. Keep the panel's initial render lean — defer expensive queries, charts, or large lists until the drawer is actually visible, and memoize content that is passed in so re-renders of the parent do not re-render the whole panel. Avoid redefining motion objects on every render when customizing backdropMotion or surfaceMotion, because new definitions can restart or jank the enter and exit animations. Animations that change layout properties such as width or height force reflow on every frame; prefer transforms and opacity so the slide stays on the compositor. When a drawer toggles frequently, avoid rebuilding large trees inside it each time it opens, and be mindful that a heavy panel also delays the focus transfer that makes the drawer usable by keyboard.

## Theming & Tokens

OverlayDrawer resolves all of its colors, spacing, elevation, and motion from the Fluent theme supplied by the surrounding FluentProvider, so it adapts automatically to light, dark, and high-contrast themes. The backdrop layer is driven by tokens.colorBackgroundOverlay; the panel surface by neutral background tokens such as tokens.colorNeutralBackground1 with text in tokens.colorNeutralForeground1 and tokens.colorNeutralForeground2 and separators in tokens.colorNeutralStroke1. Elevation comes from shadow tokens such as tokens.shadow64, corner treatment from tokens.borderRadiusLarge or tokens.borderRadiusXLarge, and internal gutters from tokens.spacingHorizontalXXL, tokens.spacingVerticalXXL, tokens.spacingHorizontalL, and tokens.spacingVerticalM. Typography inherits tokens.fontFamilyBase with sizes from tokens.fontSizeBase400 and up for titles. Motion behavior is tokenized through tokens.durationGentle, tokens.durationNormal, tokens.curveDecelerateMid, and tokens.curveAccelerateMid, which is why overriding the motion slots without matching tokens tends to look out of place against the rest of the app. If you theme OverlayDrawer, change the tokens rather than hard-coded colors so that nested Fluent controls inside the drawer stay consistent.

## Migration Notes

The most visible migration detail in this API surface is that defaultOpen is deprecated. Older code that let the drawer own its visibility with an initial-open value should migrate to application-controlled visibility so the drawer can be opened from navigation state, closed after an async action, and synchronized with deep links. Conceptually, the overlay variant is also a split from the older single-Drawer API where the overlay behavior was selected by a type-style prop on one component; the v9 model separates the inline Drawer from OverlayDrawer, so code that previously switched a drawer between inline and overlay modes should now render the appropriate component instead of toggling a mode. When migrating, re-check three things: keyboard focus return to the original trigger, the presence of an accessible name on the panel, and any custom animation that was previously applied directly to the drawer, which should now be attached to the backdropMotion or surfaceMotion slots.

## Edge Cases

- defaultOpen is deprecated and only affects initial visibility; if an ancestor remounts the drawer with a different value, the change is ignored, which makes state synchronization fragile in routing or data-refresh scenarios.
- Focus restoration depends on the trigger still existing when the drawer closes. If the button that opened the drawer is unmounted or re-rendered while the panel is open, focus can drop to the document body, so plan a fallback target.
- Overriding backdropMotion or surfaceMotion replaces the default animation entirely; if the custom definition has no exit state the panel can disappear abruptly, and if it ignores reduced-motion preferences users who requested less motion still get the full animation.
- The overlay renders above page content, so any element with a very high stacking context — sticky headers, notifications, or other portal layers — can appear above or below the drawer unexpectedly if custom z-index values are applied to the root slot.
- Content behind the backdrop may still be reachable by a screen reader's virtual cursor in some browser and assistive-technology combinations even though keyboard focus is contained; verify the accessibility tree when background content must be genuinely unreachable.
- Very long content in DrawerBody can make dismissal and confirmation actions hard to reach on small viewports; keep the header and footer outside the scroll region and consider shortening or splitting the content.
- Opening a second overlay while one is already open (menus, dialogs, or another drawer) creates nested modal layers with competing Escape handling; decide explicitly which layer dismisses on Escape and return focus to the correct element when it closes.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
