# layout components

## Overview

The layout category is FluentUI React v9's containment and separation layer: Card gathers related content into one scannable, optionally interactive surface, and Divider draws a visual boundary between groups of content. These are structural primitives rather than a page framework — the category intentionally ships no grid, stack, or column system, so page-level structure still comes from your own CSS, while Card and Divider define where one unit of content ends and the next begins. Both are compositional: they expose appearance and sizing variants so that a card or a rule can match the surface hierarchy around it instead of forcing bespoke containers into the product.

## When to Use

Reach for Card when a chunk of content is a discrete entity that a person can recognize, scan, and act on as a unit — a document, a person, a product, a settings group — and when that unit may need to be selectable or carry a floating action. Use the orientation and size props to decide whether the entity reads as a stacked tile (vertical) or as a row within a list (horizontal), and use selected, defaultSelected, and onSelectionChange when the collection can actually act on a selection. Reach for Divider when a region contains genuinely different subjects and whitespace alone is not enough to mark the change: between groups inside a card, between sections on a page, or vertically between items in a single toolbar-like row. If nothing is being grouped or separated — that is, if the content is one continuous block or one uniform list — neither component is needed.

## Best Practices

### Do's

- Use Card for content that stands on its own as an object, and choose orientation up front: vertical for media-on-top tiles, horizontal for row-style entries in a list.
- Match Card's appearance (filled, filled-alternative, outline, subtle) to the surface it sits on — outline reads clearly on a filled page background, while filled and filled-alternative read clearly on a plain one.
- Keep one size, appearance, and orientation across every Card in a collection so the group scans as a set; change appearance only when a card's state genuinely differs, such as being selected.
- Use Divider for real changes of subject, and set inset so the rule follows the container's content grid rather than running edge to edge through padding.
- Rank separations with Divider's appearance scale (default, subtle, strong, brand) and alignContent rather than adding more lines to express hierarchy.
- When a collection is selectable, wire selected or defaultSelected with onSelectionChange, and use the checkbox slot for multi-select so the selection affordance matches the rest of the product.
- Reserve vertical Divider for a single row of equal-height items, such as a toolbar; horizontal dividers handle separation everywhere else.
- Set shouldRestrictTriggerAction on an interactive Card that contains nested controls, so activating an inner control does not also activate the card.

### Don'ts

- Don't use Divider for spacing; gaps, padding, and alignment are layout concerns, and every extra rule makes real boundaries harder to spot.
- Don't nest Cards inside Cards, or place a Divider directly against a Card's own edge — the doubled lines suggest depth and grouping that do not exist.
- Don't set Card's focusMode to off on a card that is selectable, disabled-but-reachable, or otherwise meant to be activated; it drops out of the tab order.
- Don't put multiple competing primary actions inside one Card. A card represents one decision, so keep one prominent action and demote the rest.
- Don't make every card in a collection selectable by default; selection adds a checkbox affordance and tab stops and should mean the collection can act on the result.
- Don't let a Card act as a generic page-section wrapper for form groups or plain text that is not an entity.
- Don't rely on the selected state or an appearance change alone to communicate status; pair it with visible text so the meaning survives outside of styling.

## Anti-Patterns

### Card used as a universal container

❌ Wrapping page sections, form groups, and plain text in Card implies that each block is a discrete, actionable entity. A page built from stacked cards produces many competing edges, and the appearance variants stop signalling any real difference in hierarchy.

✅ Reserve Card for content that stands on its own as an object a person can scan and act on. Group everything else with plain containers, and separate sections with whitespace and the occasional Divider.

### A fully interactive card with nested controls

❌ A Card that is a tab stop and also contains buttons, links, or a Menu makes activation ambiguous: a keyboard user cannot tell whether activating an inner control will also trigger the card, and the tab sequence becomes confusing.

✅ Pick one interaction owner. If the card itself must be activated, use a focusMode that keeps nested controls reachable and set shouldRestrictTriggerAction so inner interactions do not also trigger the card; if the card is only a container, keep it static and place one clear action inside it.

### Dividers as decoration and spacing

❌ Adding a Divider between every block — or stacking dividers against card borders — produces double lines and visual noise, and it makes the boundaries that do matter impossible to recognise.

✅ Use Divider only for genuine changes of subject, choose inset and alignContent so the line follows the content grid, and vary appearance (subtle, strong, brand) instead of adding more rules.

### Mixed sizes, orientations, and appearances inside one collection

❌ A list where some cards are small and vertical and others large and horizontal, or where filled and outline appearances alternate, no longer scans as a set and implies distinctions between items that do not exist.

✅ Choose one size, appearance, and orientation for the collection and apply it to every card in it. Change a card's presentation only when its state truly differs, such as being selected or disabled.

### Focus mode chosen for appearance

❌ Setting Card's focusMode to off, or leaving a card non-selectable but visually clickable, removes it from the tab order, so anyone navigating by keyboard loses access to the card and its contents.

✅ Derive focusMode from the interaction model: off only for static cards with nothing focusable inside, and a tab-inclusive mode for cards users must reach. Keep the focus indicator visible and make the card's purpose clear from its own content.

## Accessibility

Card's focusMode decides how the container joins the tab order (off, no-tab, tab-exit, tab-only), so choose it from the interaction model rather than from how the focus ring looks: a card that contains buttons, links, or a Menu usually should not also be one large tab stop, because nested controls then become hard to reach and hard to tell apart from the card itself. When a card is both focusable and interactive, keep the two levels unambiguous — use shouldRestrictTriggerAction so an inner activation does not bubble up into the card — and express an unavailable card with the disabled prop rather than a visual-only treatment so assistive technology reports the state. Divider is a purely presentational affordance: it is not focusable and carries no semantics, so never let it be the only signal of a group boundary (headings and page landmarks do that work), never rely on its appearance value or thickness to convey emphasis, and keep reading and keyboard order meaningful without it. For each card that is meant to be selected, make sure the selected condition is discoverable through the card's own content, not just through color, elevation, or a border change.

## Components in this category

- - [Card](../components/card.md)
- - [Divider](../components/divider.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
