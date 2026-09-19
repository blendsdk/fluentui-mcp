# buttons components

## Overview

Buttons are the action primitives of Fluent UI v9: the user presses them to make something happen in the current context, whether that is submitting a form, saving a draft, deleting a row, or opening a menu of related actions. In this category the Button component carries the full emphasis range through its appearance prop (secondary, primary, outline, subtle, and transparent), adapts its silhouette through shape (rounded, circular, square), its footprint through size, and its icon placement through iconPosition. Every Button exposes exactly two slots, root and icon, so the visible content of a button is its children plus at most one leading or trailing icon. Because a button's meaning is carried by its label, its emphasis, and its position relative to other actions, button design is mostly a hierarchy decision rather than a styling decision. Use Button when an interaction performs work; reach for the navigation components such as Link when the interaction moves the user somewhere.

## When to Use

Reach for Button whenever a click performs an action or changes state in place: confirming, saving, cancelling, deleting, retrying, or revealing a menu of follow-up actions. Choose the appearance by emphasis rather than by taste: primary for the single most important action in a view or surface, secondary as the everyday default for most actions, and outline, subtle, or transparent for actions that must stay available but must not compete with the surrounding content, such as inside a dense toolbar. Choose shape circular together with an icon only when the glyph is universally understood and the button is a peer among other controls; keep rounded or square when a text label is present. Choose size to match the density of the container, and use Toolbar when a set of buttons shares a size or orientation so the grouping stays consistent. Use disabledFocusable instead of disabled when the action should stay discoverable and the user should still be able to reach it and learn why it is unavailable. Use Link instead of Button when activating the control navigates to another location, and use Menu together with a Button when one control must reveal a set of actions rather than perform a single one. Use Tooltip alongside icon-only or disabledFocusable buttons so their meaning or their reason for being unavailable is never carried by the icon or the visual state alone.

## Best Practices

### Do's

- Pick appearance by emphasis: reserve primary for the single most important action in the surface, use secondary as the default for ordinary actions, and use outline, subtle, or transparent when a button must recede against busy content such as a toolbar or a card with its own primary action.
- Control a button's visual weight with the supported props instead of custom CSS: size for the footprint, shape for the silhouette (rounded, circular, square), and iconPosition (before or after) for where the icon sits relative to the label.
- Write labels as short verb phrases that name the outcome, such as Save draft, Delete file, or Retry upload, and keep the label stable before, during, and after activation so the target does not move or change meaning under the pointer.
- Keep one icon per button through the icon slot and apply iconPosition consistently across a group, so scanning a row of buttons does not require re-reading each one.
- Keep a group of buttons uniform in size and appearance within a Toolbar, using the Toolbar size or vertical props so the grouping stays visually and structurally consistent.
- Use disabledFocusable rather than disabled when users still need to discover the action, and pair it with a Tooltip that explains why the action is currently unavailable.
- Give icon-only circular buttons an accessible name and a Tooltip, and choose the Tooltip relationship value deliberately: label when the tooltip is the button's only visible name, description when it adds explanation to an already-labeled button.
- When an action is in progress, keep the button in place and let it communicate progress, pairing it with Spinner, whose size and appearance props can be matched to the surrounding button and surface.

### Don'ts

- Do not use Button to navigate to another page or view; that breaks expected link behavior and semantics. Use Link instead, with its appearance and inline props for low-emphasis or in-text link styling.
- Do not place more than one primary button in the same surface, and do not promote an action to primary merely because it is frequently used; competing primaries flatten the visual hierarchy and slow decision making.
- Do not rely on the disabled prop as a substitute for validation or messaging. A disabled button that gives no reason for being disabled is a dead end; prefer keeping the action available with a clear validation message, or use disabledFocusable with an explanatory Tooltip.
- Do not nest interactive content inside a Button or overload the icon slot with non-icon content; the component exposes only root and icon, and any additional behavior belongs in a separate control such as a Menu composed with the button.
- Do not resize, recolor, or relabel buttons through custom styling, and do not apply subtle or transparent appearances on top of busy, patterned, or low-contrast backgrounds where the control stops being legible.
- Do not convey state, severity, or disabled-ness through color alone; pair the button with text, an icon, or a surrounding component such as Badge or MessageBar that states the condition explicitly.
- Do not reorder buttons visually with CSS away from their DOM order, and do not move the most destructive action next to the most common one; both make keyboard traversal and muscle memory unreliable.

## Anti-Patterns

### Using Button for navigation

❌ A button that navigates looks like an action but behaves like a link, so users cannot open it in a new tab or copy its destination, and assistive technology announces the wrong role for what the control does.

✅ Use Link for anything that moves the user to another location, using its appearance prop for default or subtle emphasis and its inline prop when the link sits inside a sentence. Reserve Button for work performed in the current context.

### Primary button inflation

❌ When several buttons in one surface use the primary appearance, the single most important action no longer stands out, and the difference between secondary and primary stops communicating anything about risk or priority.

✅ Allow one primary button per surface and demote everything else to secondary, outline, subtle, or transparent so the emphasis ordering matches the actual priority of the actions.

### Disabled buttons with no explanation

❌ A button left in the disabled state disappears from the keyboard tab order and gives no feedback about what the user must do to enable it, so it reads as broken rather than as gated.

✅ Prefer keeping the action available and surfacing validation through a Field or MessageBar. When the action must be blocked, use disabledFocusable so it stays reachable and pair it with a Tooltip that states the reason, with the relationship value chosen to match whether the tooltip names or describes the button.

### Icon-only buttons with no name or tooltip

❌ An unlabeled glyph depends entirely on visual interpretation, is announced without meaning by screen readers, and fails for users who do not share the icon's assumed convention.

✅ Give the button an accessible name and add a Tooltip with the label relationship, then choose shape circular and a size that keeps a comfortably large target. If the icon's meaning is not universally clear, use a text label instead.

### Restyling buttons instead of using the emphasis and shape props

❌ Hand-tuned sizes, colors, and radii drift from the theme, break contrast in the alternative theme or in right-to-left layout, and silently diverge from every other button in the product.

✅ Express intent through appearance, shape, size, and iconPosition, keep groups consistent with Toolbar's size and vertical props, and let the Provider theme and direction settings drive the resolved values.

## Accessibility

Buttons are natively focusable and activate with Enter and Space, so do not reimplement that behavior or attach click handling to non-button elements, and keep visual order aligned with DOM order so the tab sequence matches what users see. Every button needs a programmatic name: text labels normally supply it, and icon-only circular buttons must be given an accessible name in addition to their visual glyph. Tooltips are not a substitute for a name on icon-only buttons; set the tooltip relationship prop correctly so assistive technology either treats it as the label (when it is the only visible name) or as additional description, and never mark it inaccessible when it carries unique information. When you use disabledFocusable, the control remains reachable by keyboard and reports an unavailable state, which is why it should be paired with a Tooltip describing the reason; a plain disabled button is removed from the tab order entirely, so use it only when the action is genuinely irrelevant to the current task. Rely on the theme system rather than hard-coded colors so appearances keep sufficient contrast, and validate the layout in both text directions through the Provider dir prop so leading and trailing icons and labels mirror correctly. Icon-only buttons still need an adequate target size, which the size prop is the supported way to achieve, and focus styling must remain visible in every appearance, including subtle and transparent buttons placed on top of colored surfaces.

## Components in this category

- [Button](../components/button.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
