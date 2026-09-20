# ToolbarDivider

> **Package**: `@fluentui/react-toolbar` v9.8.1
> **Import**: `import { ToolbarDivider } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

ToolbarDivider is a thin, non-interactive separator meant to be placed inside a Toolbar to visually and structurally separate clusters of toolbar controls. It renders as a single divider element whose orientation is controlled by the vertical prop, which defaults to true — meaning it shows as a vertical rule that sits between adjacent toolbar items in a horizontal toolbar. Because it declares no slots and only one boolean prop, it is intentionally the narrowest possible API: a presentational line you drop between ToolbarGroups, ToolbarButtons, ToolbarToggleButtons, or ToolbarRadioGroups so users can tell where one command cluster ends and the next begins. It holds no state, renders no children, and is not focusable, so it never participates in the toolbar's roving-tabindex keyboard model itself; it simply occupies space in the flow of the toolbar. Use it as a visual grouping cue that supplements — never replaces — semantic grouping.

**When to use**: Use ToolbarDivider when a single Toolbar contains multiple logical clusters of commands and the grouping is not already obvious from spacing alone, for example separating formatting commands from alignment commands from insert commands. It is the right choice when you want a lightweight, themable separator that inherits the surrounding Toolbar context and requires no configuration beyond occasionally flipping the vertical prop. Prefer ToolbarGroup as the primary grouping mechanism — a ToolbarGroup of items plus a ToolbarDivider between groups gives both semantic and visual separation. Do not use ToolbarDivider to separate whole sections of a page, to separate form fields, or as a general-purpose rule; those cases call for the standalone Divider component outside of a toolbar context. Avoid it when the toolbar is very small (two or three items), where spacing alone reads better than a line.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `vertical` | `boolean \| undefined` | `true` | No | A divider can be horizontal or vertical (default). |

### Prop Guidance

- **vertical**: Controls whether the divider is rendered as a vertical rule (the default, true) or a horizontal rule (false). Leave it at the default for separators between commands in a horizontal toolbar, since a vertical line is the conventional cue between side-by-side items. Set it to false when the toolbar is oriented vertically, when the divider is meant to span the full width of the toolbar or a ToolbarGroup, or when you are migrating horizontal divider markup. Because the default is true, a divider that seems to disappear is usually a vertical rule sitting in a container with no height — check layout before changing this prop. `false`

## Best Practices

### Do's

- Place ToolbarDivider between two ToolbarGroups so the visual line reinforces a grouping that already exists semantically in the DOM.
- Leave the vertical prop at its default of true when the divider sits inside a horizontal toolbar, since a vertical rule is the conventional separator between side-by-side commands.
- Set vertical to false when the toolbar itself is laid out vertically or when you explicitly want a horizontal rule spanning the toolbar's width.
- Wrap related commands in ToolbarGroup first, then add ToolbarDivider between the groups — the divider should be the final touch, not the only grouping mechanism.
- Keep dividers evenly distributed: one divider per boundary between clusters, not a divider after every single button.
- Verify the divider is visible against every theme you support (light, dark, high contrast) by checking the neutral stroke tokens used by the default styling.
- Let the toolbar's own layout and spacing handle padding around the divider instead of adding your own margins, so spacing stays consistent across the toolbar.

### Don'ts

- Don't place a ToolbarDivider as the first or last child of a Toolbar — a leading or trailing rule reads as a rendering glitch rather than a grouping cue.
- Don't place two ToolbarDividers next to each other; adjacent separators visually merge into one thicker line and add noise.
- Don't put a ToolbarDivider inside a ToolbarGroup between items that belong to the same logical cluster; use spacing within a group instead.
- Don't use ToolbarDivider to separate major regions of an application or to divide form content — it is scoped to toolbar command clusters; use Divider for page-level rules.
- Don't rely on the divider as the only signal of grouping for screen reader users; group items with ToolbarGroup and appropriate labels as well.
- Don't attempt to make the divider interactive or focusable — it is presentational and should never be wrapped in a button or given a tab stop.
- Don't add custom margins, borders, or background colors to force the divider to look different from the rest of the toolbar; restyle through theme tokens so all dividers stay consistent.

## Anti-Patterns

### Using the divider as the only grouping mechanism

❌ A visual line alone communicates grouping to sighted users but adds nothing to the accessibility tree, so screen reader and keyboard users lose the structure entirely once the divider is treated as decorative.

✅ Group related commands with ToolbarGroup (and give groups meaningful accessible names where appropriate), then add ToolbarDivider between the groups purely as a visual reinforcement.

### Dividing every single item

❌ Placing a ToolbarDivider after each button turns the toolbar into a picket fence, adds visual noise, and destroys the perception of clusters, because everything looks equally unrelated.

✅ Reserve dividers for boundaries between meaningful clusters only. Within a cluster, rely on the default toolbar spacing and ToolbarGroup to hold items together.

### Dangling dividers at the edges

❌ A divider rendered as the first or last child of a toolbar produces a stray line pressed against the toolbar padding, which reads as a rendering bug and can look like a clipped border.

✅ Always position ToolbarDivider between two groups of commands. If a trailing separator appears necessary, the real problem is usually missing spacing or an ungrouped item.

### Fighting the default orientation

❌ Because vertical defaults to true, developers who expect a horizontal rule inside a horizontal toolbar end up with an invisible or collapsed divider, then compensate with hard-coded heights and margins.

✅ Decide deliberately: keep the vertical default for separators between side-by-side commands, or pass vertical as false for a full-width horizontal rule — and let the toolbar own the container height.

### Overriding divider styling with hard-coded colors

❌ Custom border colors and pixel widths break consistency with other separators, fail to adapt to dark or high-contrast themes, and can drop below the non-text contrast requirement.

✅ Restyle through theme tokens such as tokens.colorNeutralStroke2 and tokens.strokeWidthThin so the divider tracks the FluentProvider theme automatically.

## Accessibility

**Requirements**: ToolbarDivider is a purely visual element and must never be the sole conveyor of information — grouping signified by the line must also be expressed through DOM structure (ToolbarGroup) or accessible names. The toolbar as a whole should meet WCAG 2.1 AA: the divider's stroke color must have sufficient non-text contrast against the toolbar background (the default neutral stroke tokens are chosen for this), and no command should become unreachable or ambiguous if the divider is removed. Because the divider is not focusable, confirm that keyboard users can still traverse every interactive toolbar item with the toolbar's roving tabindex. If a consumer renders the divider in a decorative context, it should be hidden from the accessibility tree rather than announced as a meaningful separator.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and out of the toolbar; the divider itself is skipped because it is not focusable. |
| `ArrowRight` | Moves focus to the next focusable toolbar item in a horizontal toolbar, passing over the divider (handled by the surrounding Toolbar, not the divider). |
| `ArrowLeft` | Moves focus to the previous focusable toolbar item in a horizontal toolbar (handled by the surrounding Toolbar). |
| `ArrowDown` | Moves focus to the next focusable item when the toolbar is oriented vertically, where a ToolbarDivider with vertical set to false may be used as a horizontal rule (handled by the surrounding Toolbar). |
| `ArrowUp` | Moves focus to the previous focusable item in a vertically oriented toolbar (handled by the surrounding Toolbar). |

**ARIA**: role="separator" (the semantic role a divider element exposes; verify it is present and correct in your rendered output), aria-orientation (should reflect the visual orientation so assistive technology describes the separator correctly), aria-hidden (appropriate when the divider is purely decorative and grouping is already conveyed structurally)

**Screen Reader**: Screen readers do not land on ToolbarDivider because it is not focusable, so it does not interrupt navigation between toolbar commands. When exposed as a separator, it may be announced as a separator between groups of controls; when it is decorative, it should be excluded from the accessibility tree so users hear only the commands. Because the divider carries no accessible name or text content, it cannot communicate what the groups are — that meaning must come from the labels of the controls inside each ToolbarGroup.

## Styling

ToolbarDivider is normally left alone so it matches every other separator in the toolbar, but you can restyle it with className and Griffel's makeStyles. The line is drawn with the neutral stroke tokens: tokens.colorNeutralStroke2 for the default subtle rule, tokens.colorNeutralStroke1 when you need stronger separation, and tokens.colorNeutralStroke3 for the faintest possible line. Thickness comes from tokens.strokeWidthThin (the standard hairline) and tokens.strokeWidthThick for a heavier rule. When you must add breathing room, prefer the parent toolbar or ToolbarGroup to own the spacing so it stays on the 4px grid — use tokens.spacingHorizontalS or tokens.spacingHorizontalXS between a divider and adjacent groups in a horizontal toolbar, and tokens.spacingVerticalS or tokens.spacingVerticalXS when the divider is horizontal. Keep margins symmetric; asymmetric margins around a separator make the toolbar look misaligned. If the divider appears to have no height in a flex toolbar, give the toolbar a defined height or align items to stretch rather than hard-coding a pixel height on the divider.

## Performance

ToolbarDivider is one of the cheapest components in the library: it holds no state, registers no event handlers, renders no portals, and produces a single DOM node with a static class name per theme, so it does not contribute meaningful render cost even in toolbars with many separators. There is no memoization concern specific to it; the class name is resolved once per theme and reused. The only realistic performance trap is structural: very wide toolbars that place a divider after every item force extra flex children and layout work, and shifting toolbar layouts will trigger layout recalculations for those extra nodes. Group commands with ToolbarGroup and use dividers sparingly to keep the flex tree small.

## Theming & Tokens

ToolbarDivider takes all of its appearance from the FluentProvider theme rather than from its own props. Its stroke is drawn with neutral stroke tokens — tokens.colorNeutralStroke2 is the default, with tokens.colorNeutralStroke1 available for stronger emphasis and tokens.colorNeutralStroke3 for the faintest rule — and its thickness maps to tokens.strokeWidthThin (with tokens.strokeWidthThick for a heavier line). Spacing around the divider comes from the toolbar and group layout, which use the shared space ramp such as tokens.spacingHorizontalS and tokens.spacingVerticalS. Because these are theme tokens, the divider automatically swaps to appropriate values in light, dark, and high-contrast themes; overriding them with literal colors is the fastest way to break high-contrast mode. Switching the theme on FluentProvider updates every divider without any per-instance configuration.

## Migration Notes

In Fluent UI v9, ToolbarDivider is a first-class component for separating Toolbar command clusters, replacing the ad-hoc divider markup that earlier toolbars and command bars relied on. The most important behavioral difference to watch when migrating: ToolbarDivider defaults vertical to true, whereas the standalone Divider component in this library defaults to a horizontal rule. If you are porting markup that previously rendered a horizontal separator inside a toolbar, you must pass vertical as false to keep the same appearance. Also note that ToolbarDivider exposes only the vertical prop in this version — if you were relying on a richer divider API, use Divider and compose it manually. Keep grouping semantics in ToolbarGroup so that the migration does not silently drop the structural separation that assistive technology depended on.

## Edge Cases

- The vertical prop defaults to true, so a divider dropped into a toolbar that has no defined height or that does not stretch its items can collapse to an invisible sliver — fix the container's height or alignment rather than the divider.
- Passing vertical as false inside a single-row horizontal toolbar yields a horizontal rule that visually reads as a tiny stray dash, because the toolbar is only as tall as its tallest button.
- Two ToolbarDividers placed adjacently merge into what looks like a single thicker line, which is often mistaken for a styling bug.
- A divider used as the first or last child of a Toolbar sits flush against the toolbar's own padding and looks like a clipped edge.
- The component exposes only the vertical prop in this version, so customizations that other dividers support must be achieved with className and Griffel styles or by composing the standalone Divider component instead.
- Removing a divider during responsive or overflow handling can silently remove the only visual grouping cue if ToolbarGroups were not used to express that grouping structurally.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
