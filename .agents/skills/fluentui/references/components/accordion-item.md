# AccordionItem

> **Package**: `@fluentui/react-accordion` v9.12.0
> **Import**: `import { AccordionItem } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

AccordionItem is the structural building block of a Fluent UI React v9 Accordion. Each AccordionItem represents a single collapsible section: it holds a required 'value' that uniquely identifies the section within its parent Accordion, an optional 'disabled' flag that prevents the user from opening or closing the section, and a single root slot that wraps the item's content. In practice, the item is composed of an AccordionHeader (the always-visible trigger) and an AccordionPanel (the collapsible content), which are placed inside the item so the Accordion can wire the header's toggle behavior to the panel's visibility. Because expansion state lives on the parent Accordion, AccordionItem is intentionally a thin, declarative wrapper: it registers the section with the Accordion context, derives its open state from the Accordion's open-items list, and reports toggles back through the Accordion's toggle handler. It renders no visible chrome of its own, so appearance, spacing, and hover/focus treatments come from the AccordionHeader and AccordionPanel it contains.

**When to use**: Use AccordionItem whenever you need a collapsible, labeled section inside an Accordion — FAQ lists, settings groups, filter panels, onboarding or help content, and long forms where showing all content at once would overwhelm the page. Reach for it when the sections are peers of one another and only the section content (not the whole page) should expand and collapse. Prefer AccordionItem over Dialog when the content should remain in the page flow rather than interrupt the user, over Drawer when the content is not a navigation or complementary surface, and over Menu when the revealed content is rich, multi-line, or interactive rather than a short list of actions. If you only need to hide a single block of content with no sibling sections, a plain expand/collapse pattern or a disclosure button may be simpler than standing up a full Accordion with one item. If the user must be able to open several sections at once, that behavior is configured on the Accordion (multiple), not on the item itself.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean \| undefined` | `false` | No | Disables opening/closing of panel. |
| `value` | `Value` | — | Yes | Required value that identifies this item inside an Accordion component. |

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Give every item a stable, unique 'value' that mirrors the domain identity of the section (a section key, slug, or numeric id) so controlled expansion lists stay in sync when the data set changes.
- Keep the AccordionItem as a direct child of an Accordion so it can read expansion state and toggle behavior from the Accordion context, and place exactly one AccordionHeader and one AccordionPanel inside it.
- Control which sections are open from the parent Accordion (openItems/defaultOpenItems plus the toggle handler) and derive those values from your item 'value's rather than tracking open state per item.
- Order AccordionItems in the DOM in the order the user should read them; visual reordering with CSS does not change the reading and tab order.
- Use 'disabled' sparingly and only when a section genuinely cannot be interacted with yet; keep the header text informative so users understand what is unavailable.
- Keep collapsed panel content lightweight, and lazily fetch or code-split heavy content (tables, charts, media) so the initial render of the Accordion stays fast.
- Provide a clear, descriptive label in the AccordionHeader for each item so the collapsed state is still meaningful to screen reader users scanning the page.

### Don'ts

- Don't try to set or read an expanded/open state on AccordionItem itself — the item exposes only 'value' and 'disabled'; expansion is owned by the parent Accordion.
- Don't reuse the same 'value' on two items in the same Accordion; duplicate identities make toggling ambiguous and can open or close unintended sections.
- Don't use array indices, freshly created object literals, or other unstable values for the item 'value', since identity is how the Accordion matches items to its open list.
- Don't use 'disabled' as a way to hide or remove a section — a disabled item is still rendered and announced, it simply cannot be toggled by the user.
- Don't put interactive controls such as buttons, links, or checkboxes inside the AccordionHeader, because the header already renders the toggle button and nested interactive elements break keyboard and screen reader semantics.
- Don't assume AccordionItem renders any visual container of its own; styling the item root expecting background, border, or padding will not produce the same result as styling the header and panel.
- Don't nest a second Accordion inside a panel unless the hierarchy is genuinely meaningful; deeply nested disclosure levels are hard to navigate with a keyboard and confusing to screen readers.

## Accessibility

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
