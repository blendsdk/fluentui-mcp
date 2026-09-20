# TeachingPopoverCarouselNav

> **Package**: `@fluentui/react-teaching-popover` v9.7.0
> **Import**: `import { TeachingPopoverCarouselNav } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

TeachingPopoverCarouselNav is the pagination control row that belongs inside a TeachingPopoverCarousel, giving people a way to jump straight to any page (card) of an onboarding, coaching, or feature-announcement tour instead of stepping through it one card at a time. It is a deliberately thin, render-function-driven wrapper: the single prop it exposes, children, is of type NavButtonRenderFunction and is required — the carousel invokes that function to obtain the navigation buttons, and the component places the returned nodes inside its root slot, which defaults to a plain div that wraps the carousel pagination. The component takes no opinion on how the individual nav buttons look, so the row may hold icons or text depending on the carousel nav style in use; this makes it usable for the compact dot pagination typical of a small coach mark as well as for labeled or icon-based pagination in longer tours. Because page count and the active index are read from the surrounding carousel context rather than from props on this component, the nav is only meaningful as a descendant of TeachingPopoverCarousel, and its rendered buttons are normally TeachingPopoverCarouselNavButton elements. In practice the nav is placed in the carousel footer alongside TeachingPopoverCarouselPageCount so that users get both direct navigation and a numeric indication of where they are in the sequence.

**When to use**: Use TeachingPopoverCarouselNav when a TeachingPopoverCarousel contains enough pages that direct navigation is valuable — roughly three or more steps — so users can skip ahead to the information they need or jump back to a card they want to revisit. It is the right choice for guided product tours, multi-step education, and feature announcements inside a carousel, especially when combined with TeachingPopoverCarouselPageCount for numeric context and TeachingPopoverCarouselFooter to host the whole control row. You typically do not need it when the carousel has only one or two pages, because the carousel's own prev/next flow already covers that range and an extra row of controls adds visual noise; in those cases rely on the footer's navigation buttons alone. Choose this component over hand-rolled pagination whenever the buttons must stay in sync with the carousel's page count and active index, since the required render function receives the carousel's state and keeps the row accurate automatically. Also prefer it over a single custom progress indicator when users are expected to move non-linearly through the content, since the one-button-per-page pattern makes every destination directly reachable.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `NavButtonRenderFunction` | — | Yes | — |

### Prop Guidance

- **children**: Required and typed as NavButtonRenderFunction, so it must be a function rather than static elements. The carousel calls it during render and expects it to return the row of navigation buttons, typically one TeachingPopoverCarouselNavButton per page. Use the arguments the render function receives to build the right number of buttons and to determine which one is active, and keep the body free of side effects so it is safe to re-invoke whenever the carousel state changes. `(internal) => buttons produced from the carousel state`
- **root (slot)**: The root slot is the element that wraps the pagination and defaults to a div, and it may contain icons or text depending on the carousel nav style being used. Use it to control layout — direction, alignment, gap, and padding — and to add a group name for assistive technology. Keep it a neutral container: visual treatment of the individual pages belongs on the buttons returned by the render function, not on the wrapper. `div wrapping the pagination row`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | The element wrapping the carousel pagination. By default this is a div, it may contain icons or text depending on TeachingPopoverCarouselNavStyle |

## Best Practices

### Do's

- Always pass a function as children that returns one navigation button per page, so the number of buttons always matches the carousel's actual page count.
- Render TeachingPopoverCarouselNavButton elements from inside the render function so every page gets a real, focusable button rather than a decorative element.
- Give each generated button a distinct accessible name that identifies its destination, and mark the button for the current page as the active one.
- Place the nav inside TeachingPopoverCarousel, usually in the carousel footer next to TeachingPopoverCarouselPageCount, so direct navigation and progress text are presented together.
- Keep the root slot's layout simple — a horizontally centered row with a small gap — and let the individual buttons own their visual treatment.
- Keep the render function pure and inexpensive: derive button nodes from the values it receives, and avoid data fetching or state updates inside it.
- Verify the row at small viewport widths and with long page counts, since the buttons will wrap or overflow as the row fills its container.

### Don'ts

- Don't pass static markup or a single prebuilt button as children — the prop is a render function, and the carousel expects the buttons to be produced per render.
- Don't render the nav outside a TeachingPopoverCarousel; there is no carousel state to read, and the pagination will not reflect any content.
- Don't duplicate navigation by combining this row with custom previous/next controls that read a different source of truth, which produces conflicting active states.
- Don't signal the current page with color alone — pair the visual treatment with a programmatic indicator so color-blind and screen reader users get the same information.
- Don't strip or suppress the focus indicator on the rendered buttons through styling applied to the root slot.
- Don't render one button per page for extremely long carousels, where the row becomes an unreadable strip of targets; cap the visible count or fall back to the numeric page count.
- Don't hard-code the total number of buttons; always derive it from what the render function provides so the row survives content edits.

## Anti-Patterns

### Passing static markup instead of the render function

❌ The children prop is a NavButtonRenderFunction, not arbitrary React content. Passing a single prebuilt button or a fixed list means the call fails to type-check and, even where it appears to work, the row no longer tracks the carousel's real page count or active page.

✅ Always supply a function as children that produces one TeachingPopoverCarouselNavButton per page from the state the carousel provides, so the number of buttons and the highlighted page stay correct as content changes.

### Using the nav as a standalone pagination widget

❌ The nav derives page count and current index from the surrounding carousel context. Rendering it outside TeachingPopoverCarousel — or in a different carousel than the content it appears to control — leaves it with nothing to read, so it cannot represent progress.

✅ Render TeachingPopoverCarouselNav as a descendant of the same TeachingPopoverCarousel whose cards it navigates, ideally inside the carousel footer beside TeachingPopoverCarouselPageCount.

### Unnamed or color-only pagination buttons

❌ Dots and small icons rendered inside the render function often end up with no accessible name, so screen reader users hear only "button" repeated, and the active page is communicated purely through color, which fails non-text contrast and color-independence expectations.

✅ Give every button returned by the render function a unique name describing its target — for example an indication of which step it goes to — and expose the current page programmatically in addition to the accent color, hiding purely decorative icons from the accessibility tree.

### Duplicating navigation controls with divergent state

❌ Pairing the nav row with custom previous/next buttons that track their own index produces two controls claiming to represent the same carousel, which drift apart and confuse users about which page is actually active.

✅ Let the carousel own the state: render the page-level controls through this nav and use the carousel's own footer navigation for stepping, so every control reads from a single source of truth.

### One button per page on very long carousels

❌ A carousel with dozens of pages turns the row into an unreadable strip of tiny targets, hurting both the visual hierarchy and target-size requirements, and it forces the render function to build a large node list on every carousel state change.

✅ Keep page counts small, or fall back to the numeric TeachingPopoverCarouselPageCount indicator and the carousel's sequential navigation when the sequence is long.

## Accessibility

**Requirements**: The nav row must meet WCAG 2.1 AA expectations for the controls it produces: non-text contrast of at least 3:1 for active and inactive pagination indicators against their background (1.4.11), a visible focus indicator on every focusable button (2.4.7 and 2.4.11), pointer targets of at least 24 by 24 CSS pixels or equivalent spacing (2.5.8), and an accessible name, role, and state for each button (4.1.2). Because the root slot is a plain div with no implicit semantics, the pagination row gets no landmark or grouping announcement for free — provide a group name on the root and an individual name on every button. The current page must be exposed programmatically, not just visually, and page changes should be announced, which is normally handled by the carousel's live region rather than by the nav container itself.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and out of the nav row and, in the default DOM-order model, between the individual rendered navigation buttons. |
| `Shift+Tab` | Moves focus backwards through the rendered navigation buttons and out of the row back to the preceding control in the popover. |
| `Enter` | Activates the focused navigation button and moves the carousel to that button's page. |
| `Space` | Activates the focused navigation button, identical to Enter. |
| `Escape` | Closes the surrounding TeachingPopover when focus is inside the carousel; the nav itself does not handle Escape. |
| `ArrowLeft / ArrowRight` | Not provided by the nav container; if you want arrow-key traversal between pages you must implement a roving tabindex across the buttons yourself. |

**ARIA**: aria-label, aria-current, aria-hidden, aria-disabled, role

**Screen Reader**: The root element of the nav is a non-semantic div, so screen readers announce nothing for the wrapper unless you add a name or role to it; users hear the individual navigation buttons in DOM order instead. Each button should announce a meaningful name that identifies its destination page, and the button for the currently displayed page must expose its state — either through a current-page indication or an equivalent selected/pressed semantic — so that a user who tabs across the row can tell which card they are on. Decorative icons inside the buttons should be hidden from the accessibility tree so the button name is not diluted. When a button is activated and the carousel advances, the page change itself is communicated through the carousel's live announcement rather than through the nav row, so the nav primarily serves as a set of named shortcuts to specific pages.

## Styling

Style the wrapper through the root slot and keep the visual weight of the pagination light: a horizontally aligned flex row using tokens.spacingHorizontalXS or tokens.spacingHorizontalS for the gap between buttons is the conventional look. Let the buttons carry the rest of the styling — use tokens.borderRadiusCircular for dot-shaped indicators, tokens.colorNeutralForeground3 or tokens.colorNeutralForeground2 for inactive pages, and a brand or compound-brand accent for the active page so the current position reads at a glance. Hover and focus states should use token pairs such as tokens.colorNeutralForeground2Hover with tokens.colorNeutralBackground1Hover so the row remains legible in every theme, and any transition between active states should use tokens.durationNormal with tokens.curveEasyEase rather than a hard-coded millisecond value. If your carousel nav style uses outlined or filled buttons, tokens.strokeWidthThin plus tokens.colorNeutralStroke1 keeps borders consistent with the rest of Fluent, and text-based pagination should size with tokens.fontSizeBase200 or tokens.fontSizeBase300. Avoid fixed pixel widths on the root; let the row size to its buttons so it behaves well in narrow popover surfaces and at large text zoom levels.

## Performance

The children render function is re-invoked whenever the carousel's state changes, so its body sits directly on the interaction path and should stay cheap: build buttons from the values it receives and avoid allocations, data lookups, or state updates inside it. The cost of the row scales linearly with page count, so a carousel with a large number of pages produces a proportionally large node list on every state update — keeping tours short is the simplest optimization. Because the nav is part of a popover that may mount and unmount repeatedly, prefer cheap, token-based styles over expensive effects, and avoid transitions that animate layout rather than paint. If you memoize the returned buttons yourself, make sure the keys are stable per page so React can reuse DOM rather than recreating buttons on each navigation.

## Theming & Tokens

The component and the buttons it renders respond entirely to Fluent theme tokens, so they follow FluentProvider's theme — including dark and high-contrast variants — without any per-theme branching. Inactive pagination indicators typically use tokens.colorNeutralForeground3 or tokens.colorNeutralForeground2, while the active page uses a brand accent such as tokens.colorBrandForeground1, tokens.colorCompoundBrandForeground1, or tokens.colorCompoundBrandBackground; hover states pair tokens.colorNeutralForeground2Hover with tokens.colorNeutralBackground1Hover, and outlined variants lean on tokens.colorNeutralStroke1 with tokens.strokeWidthThin. Spacing between pages comes from tokens.spacingHorizontalXS or tokens.spacingHorizontalS, shape from tokens.borderRadiusCircular, and motion from tokens.durationNormal plus tokens.curveEasyEase. Hard-coded colors or pixel values break this contract and will not adapt when the surface moves between light, dark, or high-contrast themes, so route every visual decision through tokens instead.

## Migration Notes

TeachingPopoverCarouselNav is a v9 component introduced as part of the TeachingPopover carousel family, so there is no predecessor in Fluent UI React v8 that used this prop shape — nothing needs to be renamed or remapped. If you previously hand-rolled pagination with plain buttons, the migration is to move that markup into the required render function, replace the buttons with TeachingPopoverCarouselNavButton, and let the carousel supply the page count and active index that you were tracking manually.

## Edge Cases

- A carousel with a single page still renders the row and its render function, producing a lone, pointless button; hide or skip the nav in that case.
- Page count can change while the popover is open if cards are added or removed, so the render function must derive buttons from live state rather than caching a count.
- If the total number of pages is not known or is computed asynchronously, the row can render a mismatched number of buttons and a misleading active index; ensure the count is settled before the carousel is shown.
- Because the root is a plain div, there is no built-in roving tabindex or arrow-key traversal — users tab through every button, which becomes tedious past a handful of pages.
- Focus can be lost when the carousel advances and the previously focused button is re-rendered or removed; keep button identity stable so focus is retained across navigation.
- The wrapper must not clip or truncate the button row in narrow popover surfaces; allow wrapping or reduce page count rather than hiding targets behind overflow.
- In right-to-left layouts the row direction should be inherited from the surrounding layout so the visual page order matches the reading order.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
