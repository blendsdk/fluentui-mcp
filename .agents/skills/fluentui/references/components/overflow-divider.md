# OverflowDivider

> **Package**: `@fluentui/react-overflow` v9.8.0
> **Import**: `import { OverflowDivider } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

OverflowDivider is a lightweight utility component for overflowable containers such as toolbars and navigation bars. It wraps a single divider element that already has overflow item behavior attached, so that the divider is measured, prioritized and hidden together with the items it separates instead of being left stranded at the edge of the visible region when space runs out. It renders no DOM node of its own and exposes only two props: children, the single element that carries the overflow item behavior, and groupId, a required identifier that assigns the divider to a group whose visibility can be watched. Because it declares no slots and no styling props, every visual characteristic of the divider comes from the wrapped child, which is typically a divider component used between clusters of items. In practice OverflowDivider is the glue that keeps separators coherent during overflow: when the last item of a cluster disappears, the separator belonging to that cluster can disappear with it.

**When to use**: Use OverflowDivider when a container that manages overflow (a toolbar, a navigation bar, or any collection of items that can collapse into an overflow menu) contains dividers between groups of items and you want those dividers to participate in the overflow calculation. It is the right choice whenever a plain divider would otherwise remain visible after all the items around it have overflowed, leaving an orphaned rule at the leading or trailing edge of the visible region. Reach for it when you also need to know whether a particular divider or cluster is currently visible, since groupId lets you watch group visibility. Do not reach for it when the container does not manage overflow, when no grouping separators are needed, or when you simply want a visual rule between two static elements, in which case a plain divider is sufficient and cheaper.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactElement<unknown, string \| React.JSXElementConstructor<any>>` | — | Yes | The single child that has overflow item behavior attached. |
| `groupId` | `string` | — | Yes | Assigns the item to a group, group visibility can be watched. |

### Prop Guidance

- **children**: Required. Pass exactly one element: the divider that has overflow item behavior attached. This is what gets measured, prioritized, and hidden when the surrounding items overflow, so a plain divider without that behavior will stay visible and leave an orphaned separator. Because OverflowDivider renders no DOM of its own, the child also carries all styling and semantics. `a single divider element that has overflow item behavior attached`
- **groupId**: Required. Assigns the divider to a group whose visibility can be watched. Use the same groupId for every divider that belongs to the same visual cluster so their visibility is reported as a unit, and use distinct ids only when you genuinely need independent visibility signals. Prefer stable, descriptive strings so group identity does not churn between renders. `formatting-group`

## Best Practices

### Do's

- Wrap the divider that already has overflow item behavior attached as the single child, so the divider is measured and hidden together with its neighbors.
- Give every divider that separates the same logical cluster the same groupId, so their visibility can be observed as a unit.
- Choose stable, descriptive groupId values that reflect the cluster being separated, rather than values that change on each render.
- Place the divider between two clusters of overflowable items so hiding it still leaves a clean, meaningful visible region.
- Style and customize the wrapped child, since OverflowDivider has no slots, className, or style props of its own.
- Use OverflowDivider consistently for every separator inside an overflowable container so the layout does not mix overflow-aware and static dividers.

### Don'ts

- Do not pass more than one child; children accepts a single element only.
- Do not pass an array or a fragment of elements in place of the single required child.
- Do not expect to add presentation props such as className or style to OverflowDivider itself; it exposes only children and groupId.
- Do not use a divider child that lacks overflow item behavior, because it will not be hidden when its neighbors overflow.
- Do not assign a different groupId to each divider when you intend to observe them together; group visibility is tracked per groupId.
- Do not use OverflowDivider as a general-purpose separator outside of a container that manages overflow; a plain divider is simpler and adds no measurement cost.

## Anti-Patterns

### Wrapping a divider without overflow item behavior

❌ If the child divider is not set up with overflow item behavior, the wrapper cannot remove it from the visible region when the neighboring items collapse, so a stray separator remains at the edge of the toolbar or nav.

✅ Always wrap a divider element that itself has overflow item behavior attached, so it participates in measurement and hides together with the cluster it separates.

### Passing multiple children or a fragment

❌ children accepts a single React element. Passing an array, a fragment, or several dividers at once breaks the assumption that exactly one overflow-aware item is being wrapped, and only that single element's markup is rendered.

✅ Wrap one divider per OverflowDivider instance and render multiple OverflowDivider elements when several separators are needed.

### Targeting OverflowDivider with className or style

❌ The component exposes only children and groupId and renders no DOM node of its own, so styling props have nowhere to land and customization attempts silently do nothing.

✅ Apply className, style, color, and spacing to the wrapped child divider, which is the element that actually renders the rule.

### Unique groupId per divider when grouping is intended

❌ Visibility is watched per groupId, so giving every divider in the same cluster its own id prevents you from observing or reacting to the cluster's visibility as a whole and multiplies the number of independent visibility signals.

✅ Reuse one groupId for all dividers that belong to the same logical cluster and reserve distinct ids for clusters that must be watched independently.

### Using OverflowDivider outside an overflow container

❌ Outside a container that manages overflow, nothing will ever hide the divider and no group visibility will be reported, so the wrapper adds indirection with no benefit and makes the markup harder to read.

✅ Use a plain divider when no overflow behavior is required, and reserve OverflowDivider for containers that collapse items into an overflow region.

## Accessibility

**Requirements**: OverflowDivider contributes no semantics, roles, or focus behavior of its own, so accessibility is entirely inherited from the wrapped child element. The child divider should expose separator semantics and should remain non-focusable so that keyboard and screen reader users only land on actionable items, matching WCAG 2.4.3 focus order expectations. Because a separator is a non-text user interface element, its line must retain at least a 3:1 contrast ratio against the surrounding background per WCAG 1.4.11, which in practice means using the theme's neutral stroke tokens rather than arbitrary low-contrast colors. If the divider is purely decorative and the grouping is already conveyed by layout, keep it out of the accessibility tree via the child's own attributes.

| Key | Action |
| --- | --- |
| `Tab` | Focus moves across the divider to the neighboring interactive item; the divider itself never receives focus. |
| `Shift+Tab` | Reverse traversal skips the divider in the same way, moving focus to the preceding interactive item. |
| `ArrowRight / ArrowLeft` | In a horizontal toolbar, arrow navigation moves between interactive items and passes over the divider as if it were not present. |
| `ArrowDown / ArrowUp` | In a vertically oriented toolbar, up and down arrow navigation likewise skips the non-focusable divider. |

**ARIA**: role="separator" (supplied by the wrapped divider element, not by OverflowDivider itself), aria-orientation (supplied by the wrapped divider when the container orientation requires it), aria-hidden (only when the child divider is rendered as purely decorative), OverflowDivider adds no ARIA attributes or roles of its own

**Screen Reader**: Screen readers encounter whatever element the single child renders, typically a separator; a non-focusable separator is generally not announced as a stop during navigation, so users hear the neighboring items as if the divider were not present, which is the desired behavior for a purely visual grouping cue. When focus does reach the child divider's container, the separator is exposed in the accessibility tree so the grouping can be perceived. Because OverflowDivider itself renders no DOM, it never appears as a node in the accessibility tree and cannot be announced, labeled, or focused in its own right.

## Styling

OverflowDivider has no slots and no styling props, so all customization happens on the wrapped child: apply your className, color, and spacing to that child instead of the wrapper. For divider lines in neutral containers, the usual approach is to set the child's border or background to tokens.colorNeutralStroke2, switching to tokens.colorNeutralStroke3 in subtle contexts, and to tokens.colorBrandStroke1 when the separator should pick up the brand accent. Keep the rule thin with tokens.strokeWidthThin so it reads as a separator rather than a border. Horizontal breathing room around the divider is normally expressed on the child with tokens.spacingHorizontalS or tokens.spacingHorizontalMNudge, while the divider's own padding collapses naturally when the wrapper hides it during overflow. If the divider is oriented vertically inside a horizontal toolbar, ensure the child sets a matching orientation so its line is drawn on the correct axis, and avoid fixed widths or heights that would leave a visible gap after the divider is removed.

## Performance

OverflowDivider is an intentionally thin wrapper: it renders no extra DOM element, so it does not add nodes, layout boxes, or paint work to the page beyond the child divider it wraps. The cost that matters is the overflow measurement performed by the child's overflow item behavior and the re-render triggered when a group's visibility flips between shown and hidden. Keep that cost predictable by using stable groupId values so group identity is not recreated on every render, by rendering each divider as its own wrapper rather than many dividers inside one wrapper, and by keeping the number of overflow-aware children in a container reasonable, since every additional measured child increases the work the container does when it recalculates what fits.

## Theming & Tokens

OverflowDivider itself consumes no theme tokens because it produces no DOM; all theming flows through the wrapped child divider. That child typically draws its rule with tokens.colorNeutralStroke2 for standard neutral contexts or tokens.colorNeutralStroke3 for subtler separators, and uses tokens.colorBrandStroke1 when the separator should carry the brand accent. Line thickness usually comes from tokens.strokeWidthThin, and the space around the rule uses horizontal spacing tokens such as tokens.spacingHorizontalS or tokens.spacingHorizontalMNudge so the divider matches the rhythm of adjacent items. Because these are theme tokens resolved from the nearest FluentProvider, switching between light, dark, and high-contrast themes automatically re-colors the separator, and grouped spacing tokens keep the divider aligned with whatever density the surrounding toolbar or nav is using. If you swap the theme at runtime, only the child needs to re-render; the wrapper's groupId stays constant.

## Migration Notes

OverflowDivider is a v9 utility with no direct v8 counterpart. In v8, toolbar and similar overflow patterns were built with an overflow set where dividers were declared as non-overflowing static items, which meant separators could remain visible after their neighboring items collapsed. In v9 the divider is wrapped so that it carries overflow item behavior itself, is measured along with its neighbors, and is hidden together with the cluster it separates; the required groupId additionally lets you watch visibility for a group of dividers, which the v8 item-list approach did not express directly. When porting, remove static divider entries from the item list and replace each separator with a wrapper around an overflow-aware divider child.

## Edge Cases

- OverflowDivider renders no DOM node of its own, so any className, style, or CSS selector aimed at the wrapper has no element to attach to; target the child divider instead.
- The children prop accepts a single element only. Arrays, fragments, and multiple dividers are not supported and only confuse the assumption that one overflow-aware item is wrapped.
- If the child divider lacks overflow item behavior, the divider remains visible even after all items around it have collapsed, producing a leading or trailing separator at the edge of the visible region.
- Dividers sharing a groupId report visibility as a group, so watching that id tells you about the cluster as a whole rather than about any individual divider.
- When every item in a cluster overflows, the divider associated with that cluster typically disappears too, which can make the remaining clusters appear closer together than they do in the fully expanded layout; verify spacing in the collapsed state.
- A divider that becomes the first visible child after overflow can look like a stray rule at the start of the container, so check the leading and trailing edges of the visible region at several viewport widths.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
