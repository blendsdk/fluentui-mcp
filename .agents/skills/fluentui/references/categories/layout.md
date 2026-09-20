# layout components

## Overview

The Layout category provides the surface and separation primitives that give a page region its shape: Card and its companion parts (CardHeader, CardPreview, CardFooter) create one bounded, themeable surface that groups related content and actions, while Divider separates adjacent groups of content. Card is explicitly a composition rather than a single block - you assemble a preview area, a header with a description area and an action slot, and a footer action slot, then control the whole surface through orientation, size, appearance, and selection. Divider is a purely presentational separation primitive that runs horizontally or vertically and can be emphasized or muted. Used together, these parts let you build repeatable containers without hand-rolling borders, padding, and alignment.

## When to Use

Reach for Card when a unit of content is discrete and self-contained: a single item in a collection, a summary tile, a selectable option, or a small region that needs its own media, title, description, and actions. Use CardHeader, CardPreview, and CardFooter rather than raw markup whenever the card should pick up theme, size, and orientation behavior automatically. Choose Card selection props when the surface itself is the thing being chosen (picking from a set, multi-select lists of tiles), and choose action slots when the surface merely contains controls. Reach for Divider when two groups of content are adjacent and a structural boundary must be visible - between sections of a panel, between toolbar regions, or between items laid out in a row. Do not reach for these components when you only need spacing or a heading to establish hierarchy, when you need a page-level region container, or when you need overlay and dialog behavior, which other categories cover.

## Best Practices

### Do's

- Compose cards from CardHeader, CardPreview, and CardFooter instead of dropping loose content straight into Card, because the parts carry the spacing, slot structure, and alignment that keep the surface consistent across sizes and orientations.
- Choose Card orientation deliberately: vertical when a preview sits above a stacked text block and the card is read top to bottom, horizontal when the preview belongs beside the header and description in a row.
- Use the Card selection model (selected or defaultSelected together with onSelectionChange) whenever the card itself is a selectable item, so focus and selection behavior come from the component rather than a hand-built click handler on the root.
- Place secondary or destructive actions in the CardHeader or CardFooter action slot, and reserve the Card floatingAction slot for controls that must float over the preview or body.
- Use shouldRestrictTriggerAction to stop the card trigger from firing when the user interacts with inner controls that should not select the card.
- Pick Divider appearance (brand, default, strong, or subtle) and inset to match the surface it sits on and the alignment of surrounding content, and place it only where a real content boundary exists.
- Keep orientation, size, and appearance consistent across cards that appear together in the same collection, and vary cards through content such as previews, badges, or avatars.
- Give the CardHeader image slot and CardPreview contents meaningful images so the preview communicates the same subject as the card text rather than acting as decoration.

### Don'ts

- Do not wrap every section of a page in a Card - a card is for a discrete self-contained unit, and ordinary page sections are better served by headings and layout spacing.
- Do not nest Cards inside Cards to express hierarchy, because doubled borders and padding flatten the visual structure and make the grouping ambiguous.
- Do not use a Divider as a spacer or to manufacture vertical rhythm; use layout spacing for that and keep the divider for genuine boundaries.
- Do not use a vertical Divider inside a vertical stack of content - a vertical divider separates items arranged in a row.
- Do not make the whole card a link or button by hand, since that creates nested interactive elements and unpredictably swallows clicks intended for the card's own buttons and links.
- Do not lean on the subtle or brand divider appearance as the only signal of a meaningful boundary; if the separation matters, back it with structure such as a heading or a distinct section.
- Do not mix focus modes or selection behavior among cards in the same list, because users should be able to predict how focus enters and moves through every card in the set.

## Anti-Patterns

### Hand-rolling the card surface

❌ Building a bordered container from plain markup plus custom CSS to get a header, media area, and footer duplicates logic the Card parts already own, and that container will not pick up theme, size, orientation, or focus behavior.

✅ Compose Card with CardHeader, CardPreview, and CardFooter and drive the look with appearance, size, and orientation; add custom styling only for content the parts genuinely do not cover.

### Whole-card click target built by hand

❌ Making an entire card clickable with a wrapper click handler or an overlay link produces nested interactive elements, breaks expectations such as opening in a new tab, and swallows clicks meant for the card's own controls.

✅ Use the Card selection model with selected or defaultSelected and onSelectionChange, protect inner controls with shouldRestrictTriggerAction, and use Link or Button in the CardHeader or CardFooter action slot for navigation.

### Selection state carried only by color

❌ Tinting the card surface to indicate selection leaves the state invisible to keyboard and screen reader users and unreliable in forced-colors modes.

✅ Enable the Card checkbox slot so selection is exposed programmatically, keep the card in the focus order through focusMode, and make selection visible with more than hue.

### Dividers used as decoration

❌ Sprinkling Divider between every block, or using it to add vertical rhythm, adds visual noise and asserts boundaries where no structural change exists; a vertical Divider between stacked items reads as a stray line.

✅ Reserve a horizontal Divider for real group boundaries, keep a single divider between adjacent groups rather than doubling it with a border, use layout spacing for rhythm, and reserve vertical dividers for row-based layouts.

### Inconsistent card anatomy within one collection

❌ Cards in the same grid that use different orientations, sizes, appearances, or focus modes break scanning and force users to relearn the interaction for each card.

✅ Fix the anatomy for a collection - the same orientation, size, appearance, and focus behavior - and let variation come from content such as previews, badges, or avatars.

## Accessibility

Accessibility in this category is mostly about focus and semantics rather than color. A selectable card must be reachable and operable by keyboard: set focusMode to match the interaction so that static content cards do not introduce a redundant tab stop while selectable cards keep a focus stop that still lets users reach inner buttons and links. When selection is enabled, keep the Card checkbox slot present and labeled so state is exposed programmatically instead of being carried by border tint or elevation alone, and make selected, unselected, and mixed states distinguishable without relying on hue. CardHeader does not provide heading semantics on its own, so when a card introduces a region, supply heading structure from the surrounding content. Images placed through CardPreview or the CardHeader image slot need meaningful alternative text, or must be marked decorative when they merely repeat adjacent text. Divider is presentational: it must never be the only signal that content is grouped, its appearance values must remain perceivable in high-contrast and forced-colors modes, and purely decorative dividers should not be announced as content. Finally, keep the composed reading order - preview, title, description, actions - aligned with the visual order so screen reader users encounter the card in a sensible sequence.

## Components in this category

- [Card](../components/card.md)
- [CardFooter](../components/card-footer.md)
- [CardHeader](../components/card-header.md)
- [CardPreview](../components/card-preview.md)
- [Divider](../components/divider.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
