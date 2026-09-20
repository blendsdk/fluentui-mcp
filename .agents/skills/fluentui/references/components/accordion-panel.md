# AccordionPanel

> **Package**: `@fluentui/react-accordion` v9.12.0
> **Import**: `import { AccordionPanel } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

AccordionPanel is the collapsible content region of an accordion. It renders the body that appears below an AccordionHeader when the owning AccordionItem is expanded, and it animates the reveal and conceal of that content through a presence-style collapse motion. AccordionPanel is designed to be used only as a direct child of AccordionItem, immediately following the AccordionHeader, and it inherits its open, disabled, size, and expandIconPosition values from the surrounding item and header rather than being managed independently. The component exposes a single root slot (a div) for the panel content plus a collapseMotion slot that controls how the panel enters and leaves the DOM, which means content is unmounted while collapsed unless the motion is customized.

**When to use**: Use AccordionPanel whenever you need progressive disclosure of secondary content inside an accordion: FAQ answers, advanced settings groups, filters, navigation sub-sections in a NavDrawer, or expandable detail rows. It pairs one-to-one with an AccordionHeader inside an AccordionItem, and belongs to the broader Accordion family (Accordion, AccordionItem, AccordionHeader, AccordionPanel) rather than being used standalone. Reach for AccordionPanel when the content is genuinely optional for the primary task and the user benefits from a compact default view. If the content is essential, always visible, or needs to be compared side by side with other content, prefer rendering it directly instead of hiding it behind a disclosure. If you need an overlay that does not displace surrounding layout, consider Dialog or Popover instead; AccordionPanel is a flow-layout disclosure by default.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `collapseMotion` | `Slot<PresenceMotionSlotProps<CollapseParams>>` | — | No | — |
| `disabled` | `boolean` | — | Yes | — |
| `expandIconPosition` | `AccordionHeaderExpandIconPosition` | — | Yes | — |
| `expandIconPosition` | `AccordionHeaderExpandIconPosition` | — | No | — |
| `inline` | `boolean` | — | No | — |
| `open` | `boolean` | — | Yes | — |
| `root` | `NonNullable<Slot<'div'>>` | — | Yes | — |
| `size` | `AccordionHeaderSize` | — | Yes | — |
| `size` | `AccordionHeaderSize` | — | No | — |

### Prop Guidance

- **open**: Indicates whether the panel is currently expanded. This value is supplied automatically from the owning AccordionItem's state; do not set it directly, because doing so desynchronizes the panel from the header's aria-expanded and from the item's toggle handling. Drive expansion through the Accordion or AccordionItem instead. `true`
- **disabled**: Indicates that the owning item is disabled, which prevents the panel from being expanded. Like open, this is inherited from the AccordionItem context; never pass it manually on the panel. Set disabled on the AccordionItem so the header and the panel stay consistent and the header is exposed as aria-disabled. `true`
- **expandIconPosition**: Records where the expand icon is placed on the associated header ('start' or 'end'), which the panel uses to align its content and motion with the header's layout. It is inherited from AccordionHeader and should be configured there, not duplicated on the panel. `end`
- **size**: The size scale inherited from AccordionHeader ('small', 'medium', or 'large'), which keeps the panel's typography and spacing proportional to its header. Configure size on the Accordion or AccordionHeader and let the panel inherit it; only override when an intentional visual break from the header is required. `medium`
- **inline**: Renders the panel in inline mode, positioned so that expanding it does not push the surrounding layout down — the pattern used for accordions embedded in navigation surfaces such as a drawer. Use it only in that context; in ordinary flow layouts leave it unset so the panel occupies normal document flow. `false`
- **root**: The required root slot, a div that wraps the panel's content. Use it to attach className, style, id, and ref, and to apply padding, background, and typography tokens. Avoid overriding positioning or overflow on this slot since the collapse motion animates its box. `className={panelStyles}`
- **collapseMotion**: Optional slot that defines the presence motion used to animate the panel in and out of the tree. Replace it when you need a different collapse curve or duration, and set it to null to render the panel without motion (useful for dense views or strict reduced-motion contexts). Customizing it also changes when descendants mount and unmount. `Custom collapse motion`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `collapseMotion` | — | No | — |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Always render AccordionPanel as an immediate sibling of AccordionHeader inside the same AccordionItem so the panel receives the correct open, disabled, size, and expandIconPosition context values.
- Control expansion through the Accordion or AccordionItem level (defaultOpen, openItems, onToggle) and let the panel derive its open state, instead of driving open manually on the panel.
- Keep panel content lightweight and self-contained; because the content unmounts when collapsed, treat everything inside as transient and re-initializable.
- Use the collapseMotion slot when you need to swap in a custom motion, and set it to null when motion is undesirable for the context (for example, dense data views or strict reduced-motion environments).
- Apply padding and background styling to the panel's root slot via className and makeStyles so the disclosure reads as a distinct region below the header.
- Rely on the inherited size from the header so the panel's typography and spacing match the header's scale; only override when the surrounding design system explicitly calls for it.
- Keep only one panel open at a time in navigation-style accordions (single-expand) to preserve a predictable reading order; use multiple-expand only when users genuinely compare sections.

### Don'ts

- Don't place AccordionPanel outside of AccordionItem or without a matching AccordionHeader; without that context the panel has no reliable open/disabled state and the accessible relationship between header and panel breaks.
- Don't pass open or disabled directly to the panel in an attempt to bypass the item's state; this desynchronizes the panel from the header's aria-expanded and produces contradictory announcements.
- Don't set expandIconPosition or size on the panel to compensate for a differently configured header; those values are inherited from the header and duplicating them creates visual drift.
- Don't put focusable controls that are required for the primary task exclusively inside a collapsed panel; keyboard and screen reader users may never discover them.
- Don't assume state inside the panel survives collapsing and re-expanding (such as scroll position, uncontrolled inputs, or lazily fetched content) — the collapse motion unmounts the subtree.
- Don't use inline mode arbitrarily; it changes positioning behavior and is intended for accordions embedded in navigation surfaces where the panel should not displace the surrounding layout.
- Don't nest deeply interactive regions inside a panel without managing focus order, since the panel itself is not a focus target.

## Anti-Patterns

### Driving open state directly on the panel

❌ Passing open (or disabled) straight to AccordionPanel bypasses the AccordionItem's state machine, so the header's aria-expanded, the item's toggle handler, and the panel's actual visibility disagree. Users hear one state and see another.

✅ Set expansion on AccordionItem or Accordion via defaultOpen, openItems, and onToggle, and let AccordionPanel inherit open and disabled from context.

### Rendering the panel without its header or item

❌ An AccordionPanel placed outside AccordionItem has no context for open, disabled, size, or expandIconPosition, and the accessible header/panel relationship (aria-controls and aria-labelledby) cannot be established. The disclosure is effectively orphaned.

✅ Always structure content as Accordion > AccordionItem > (AccordionHeader + AccordionPanel), with the panel immediately after its header.

### Duplicating header configuration on the panel

❌ Setting size or expandIconPosition on the panel to fix a mismatch with the header creates two sources of truth; future header changes silently produce misaligned panels and inconsistent typography.

✅ Configure size and expandIconPosition once on Accordion or AccordionHeader and let AccordionPanel inherit them.

### Assuming content stays mounted when collapsed

❌ Because the default collapse motion unmounts the panel, uncontrolled form state, scroll offsets, media playback, and one-time data fetches inside the panel are lost on each collapse, leading to visible resets.

✅ Lift durable state to a parent, re-fetch on expand intentionally, or customize the collapseMotion slot so the content is preserved if your scenario requires it.

### Hiding required actions behind a collapsed panel

❌ Critical controls that only exist inside a collapsed panel are invisible to users who do not discover the disclosure, and they are absent from the tab order and accessibility tree until expansion.

✅ Render essential actions in the always-visible header area, or keep the item expanded by default and reserve the panel for genuinely secondary content.

## Accessibility

**Requirements**: AccordionPanel itself is a non-interactive container, but it participates in the disclosure pattern established by AccordionHeader. The controlling header button must expose aria-expanded that flips between true and false as the panel opens and closes, and the panel must be programmatically associated with that button via aria-controls on the button and aria-labelledby (or an id reference) on the panel. The panel must not be reachable or focusable while collapsed — since the collapse motion unmounts the content, ensure no residual focusable nodes remain and that focus is returned to the header button when the panel closes while focus was inside it. Follow WCAG 2.1 success criteria for keyboard operability (2.1.1), visible focus (2.4.7), focus order (2.4.3), and name/role/value (4.1.2). When disabled is true on the owning item, the header must be exposed as disabled (aria-disabled) and the panel must not be expandable.

| Key | Action |
| --- | --- |
| `Enter` | Activates the controlling AccordionHeader button and toggles the panel between expanded and collapsed. |
| `Space` | Activates the controlling AccordionHeader button and toggles the panel, matching native button behavior. |
| `Tab` | Moves focus from the header button into the first focusable element inside the expanded panel, and out of the panel to the next focusable element after it. |
| `Shift+Tab` | Moves focus backward out of the panel content and back to the header button or the previous focusable element. |
| `Arrow Down` | While focus is on a header in a header list, moves focus to the next AccordionHeader; when a panel is expanded, focus enters the panel content. |
| `Arrow Up` | Moves focus to the previous AccordionHeader in the accordion. |
| `Home` | Moves focus to the first AccordionHeader in the accordion. |
| `End` | Moves focus to the last AccordionHeader in the accordion. |

**ARIA**: aria-expanded (on the controlling AccordionHeader button, reflecting the panel's open state), aria-controls (on the header button, referencing the panel's id), aria-labelledby (on the panel, referencing the header button's id), aria-disabled (on the header button when the owning AccordionItem is disabled), role="region" or an equivalent landmark role on the panel content where appropriate, hidden / absence from the accessibility tree while the panel is collapsed

**Screen Reader**: Screen readers announce the header button with its expanded or collapsed state, and the panel content is only exposed when expanded. Because a collapsed panel is unmounted, its content is absent from the accessibility tree and from virtual cursor navigation, which prevents users from tabbing into invisible controls. When the panel expands, the newly revealed region is announced in relation to the header through aria-controls and aria-labelledby, and focus stays on the header button so the user can continue toggling or move forward into the content. In inline mode the panel overlays adjacent content visually, so ensure the underlying content is either inert or hidden from assistive technology to avoid duplicate reading.

## Styling

AccordionPanel's root slot is a plain div, so nearly all visual treatment comes from your own class. Add internal padding with tokens.spacingVerticalM and tokens.spacingHorizontalXXL (or tokens.spacingHorizontalL for compact layouts) using shorthands.padding, and separate the panel from the header with a subtle border using tokens.colorNeutralStroke2 rather than a hard-coded color. For panels whose content is secondary text, set the color to tokens.colorNeutralForeground2 and the font size to tokens.fontSizeBase300 with tokens.lineHeightBase300; keep primary content at tokens.colorNeutralForeground1. Linked list-style content inside the panel benefits from tokens.spacingVerticalS between rows. When the panel is used in inline mode over a navigation surface, give it tokens.colorNeutralBackground1, tokens.borderRadiusMedium, and a tokens.shadow16 (or tokens.shadow8 in denser surfaces) so it reads as a floating layer, and use tokens.colorStrokeFocus2 for focus outlines on interactive children. Avoid hard-coding heights or using display/position overrides on the root, because the collapse motion animates the panel's box; overriding overflow or transform can clip or desynchronize the animation. Merge your classes with mergeClasses so consumer styles are not lost when composing with other components.

## Performance

The default collapse motion renders the panel content only while expanded, so collapsed sections cost nothing at render time and heavy subtrees (tables, charts, long lists) are naturally deferred. The trade-off is that every expansion re-mounts the subtree: memoize expensive children with React.memo and keep them free of side effects that should fire once. Avoid creating new component definitions or inline objects inside the panel on every render of the parent, since the parent re-renders whenever an item toggles in a multi-item accordion. If several panels share the same content, key them carefully so identity is stable across expand/collapse cycles. Swapping or disabling the collapseMotion slot changes the mount/unmount lifecycle entirely — a null motion keeps the content in the DOM and therefore changes both memory use and first-paint cost. For long lists rendered across many accordion items, prefer rendering headers eagerly and panel content lazily.

## Theming & Tokens

AccordionPanel has almost no intrinsic styling, so it responds to the theme primarily through the tokens you apply on its root slot and on its content. Text inside the panel follows tokens.colorNeutralForeground1 for primary copy and tokens.colorNeutralForeground2 for secondary copy, with type set through tokens.fontSizeBase300, tokens.fontWeightRegular, and tokens.lineHeightBase300. Spacing typically uses tokens.spacingVerticalS, tokens.spacingVerticalM, and tokens.spacingHorizontalXXL, while separators use tokens.colorNeutralStroke2 and floating inline panels use tokens.colorNeutralBackground1 with tokens.borderRadiusMedium and tokens.shadow16. Focus indicators on interactive panel content should use tokens.colorStrokeFocus2. Because these are Griffel design tokens resolved through FluentProvider, the panel automatically adapts to light, dark, and high-contrast themes, including custom themes created with createLightTheme or createDarkTheme, without component-level overrides.

## Migration Notes

AccordionPanel is a v9 component and has no direct v8 counterpart with the same API; v8's accordion content was expressed through different structural components and render props. When porting from v8, move content into AccordionPanel, move the toggle affordance and icon placement into AccordionHeader, and let AccordionItem own the open and disabled state instead of managing expansion manually. The v8 pattern of controlling visibility via CSS or manual conditionals should be replaced by the item's defaultOpen, openItems, and onToggle APIs, and any custom expand/collapse animation should be expressed through the collapseMotion slot rather than wrapping the panel in your own animation component. Because the panel content unmounts when collapsed in v9, ported content that relied on remaining mounted must either move its state upward or disable the default motion.

## Edge Cases

- AccordionPanel relies on AccordionItem and AccordionHeader context for open, disabled, size, and expandIconPosition; rendering it outside that structure leaves it without meaningful state and breaks header/panel association.
- With the default collapse motion, the panel's children unmount when the item collapses, so any local component state, scroll position, or pending async work inside the panel is discarded between expansions.
- If focus is inside the panel when the item collapses (for example, through a programmatic toggle), focus must be restored to the header button; otherwise focus falls back to the document body and keyboard users lose their place.
- Inline mode changes the panel from normal flow to an overlaid presentation intended for navigation surfaces; using it in a standard page accordion can cause the panel to overlap following content.
- Nested accordions multiply the number of independently animated panels and can produce clipped or jumpy motion when an outer panel's height changes during an inner panel's collapse.
- Setting the collapseMotion slot to null removes mount/unmount behavior and the associated animation, which is a common fix for content that must persist but also changes perceived responsiveness.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
