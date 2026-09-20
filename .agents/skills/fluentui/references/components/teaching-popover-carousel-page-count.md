# TeachingPopoverCarouselPageCount

> **Package**: `@fluentui/react-teaching-popover` v9.7.0
> **Import**: `import { TeachingPopoverCarouselPageCount } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

TeachingPopoverCarouselPageCount is a small text-only companion component for the TeachingPopover carousel family. It renders the current position within a multi-step teaching carousel, typically in the form of a phrase such as a step counter that tells the user which page they are on and how many pages remain. The component is deliberately minimal: it exposes a single required children prop typed as a render function, plus a single root slot. The render function is supplied by the carousel context, so the component always reflects the live active page rather than a value you manage yourself. Because it is text-only and non-interactive, it is meant to sit inside TeachingPopoverCarousel (usually alongside TeachingPopoverCarouselNav and the navigation buttons in TeachingPopoverCarouselFooter) and to complement, not replace, the navigation controls. It is most useful in multi-step onboarding, feature-tour, or education popovers where users benefit from knowing how far along they are.

**When to use**: Use TeachingPopoverCarouselPageCount when a TeachingPopoverCarousel contains more than one step and users need explicit positional context, such as during a guided feature tour or an onboarding sequence where each step must be understood in relation to the others. It is the right choice when the dot or button indicators provided by TeachingPopoverCarouselNav are not self-explanatory on their own, or when assistive technology and low-vision users need a textual statement of progress. Prefer it over hand-rolled counters because it reads the active index directly from the carousel, so it cannot drift out of sync. Avoid it for single-step popovers, where a count of one is noise, and avoid it when you only need to label the step conceptually; in that case use TeachingPopoverTitle or TeachingPopoverHeader. Do not use it as a replacement for the carousel navigation controls, which remain the mechanism for moving between pages.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `TeachingPopoverCarouselPageCountRenderFunction` | — | Yes | — |

### Prop Guidance

- **children**: Required. A render function rather than static content: the carousel invokes it with the carousel's current page information so you can compose the visible phrase. Use the supplied values for both the current position and the total, format them for the active locale, and return a short plain-text string or simple text element. Do not return interactive controls, and do not ignore the supplied arguments in favor of your own counters. `Render function that receives the current page index and page count and returns a localized phrase such as the equivalent of a step number followed by the total.`
- **root**: The single slot this component renders. It receives the output of the children render function, so styling decisions (className, inline text styles, wrapping behavior, and spacing) are applied here. When placing the component inside a flex row in the carousel footer, style the root so it does not shrink awkwardly or wrap mid-phrase. `className applied to the root to set the secondary text color and small font size used in the carousel footer.`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Always render a complete, human-readable phrase such as a step number plus a total, so the number is never ambiguous on its own.
- Derive both the current position and the total from the arguments passed into the children render function so the text stays correct when steps are added or removed.
- Keep the string short and scannable; it shares the carousel footer with navigation buttons and dots and should not dominate that region.
- Localize and format the count through your application's localization layer, including numeral formatting for locales that do not use Western digits.
- Place it inside TeachingPopoverCarousel, where the carousel context supplies the active index and page total that the render function receives.
- Style it as secondary text using theme tokens so it reads as supporting information rather than competing with TeachingPopoverTitle.
- Pair it with the navigation controls in TeachingPopoverCarouselNav or TeachingPopoverCarouselFooter so users have both a textual and a control-based sense of position.

### Don'ts

- Do not place buttons, links, or other focusable elements inside the page count; navigation belongs to TeachingPopoverCarouselNav and TeachingPopoverCarouselNavButton.
- Do not hard-code the total number of steps, since the carousel page count can change as TeachingPopoverCarouselCard children are added or removed.
- Do not render the component without its required children render function; the count has no meaningful output without it.
- Do not use it as the popover heading or as the primary instruction text; those roles belong to TeachingPopoverTitle and TeachingPopoverBody.
- Do not duplicate the same information elsewhere in the popover body, for example repeating a step counter that is already shown in the footer.
- Do not mount it outside of a TeachingPopoverCarousel, because it has no independent source of page state and will not reflect real navigation.
- Do not rely on the page count alone to convey progress to assistive technology when the carousel also auto-advances; the controls must remain the reliable path.

## Anti-Patterns

### Hard-coded step totals

❌ Writing a fixed string such as a counter that always claims a specific number of steps breaks as soon as a TeachingPopoverCarouselCard is added, removed, or conditionally rendered, leaving users with a wrong total.

✅ Build the text from the values passed into the children render function so the current index and the total always reflect the actual carousel content.

### Using the page count as the navigation control

❌ Making the counter focusable, clickable, or wrapping navigation arrows inside it duplicates the interaction model, creates an unlabeled or confusing control, and conflicts with the keyboard behavior of TeachingPopoverCarouselNav.

✅ Keep the page count as non-interactive text and expose navigation through TeachingPopoverCarouselNav, TeachingPopoverCarouselNavButton, and the footer buttons.

### Rendering it outside the carousel

❌ Mounted outside TeachingPopoverCarousel, the component has no live page context, so the render function cannot produce a meaningful position and the text will be wrong or static while the carousel actually moves.

✅ Always render it as a descendant of TeachingPopoverCarousel, normally inside TeachingPopoverCarouselFooter next to the navigation controls.

### Redundant progress messaging

❌ Showing the count in the footer while also repeating the same step information in the popover title or body clutters a small surface, and repeated live-region announcements can be disorienting for screen reader users.

✅ Choose one place for progress information. Keep the count in the footer and use TeachingPopoverTitle and TeachingPopoverBody for the step's actual content.

## Accessibility

**Requirements**: The page count is plain text, so it must satisfy text contrast requirements (WCAG 1.4.3) and remain legible when text is resized up to 200 percent (WCAG 1.4.4). Because it conveys position within a sequence, the information must also be available programmatically or through an equivalent control; the carousel navigation buttons provide that equivalent, so the text must never be the only indication of progress. Content must not be conveyed by color or styling alone (WCAG 1.4.1), and if the carousel auto-advances, users need a way to pause, which is provided by TeachingPopoverCarouselAutoplayButton rather than by this component. Ensure the rendered string is meaningful out of context, since screen reader users may encounter it without the surrounding visual layout.

| Key | Action |
| --- | --- |
| `Tab` | Focus moves past the page count. The component is not focusable and does not participate in the tab order, so it adds no stop between the popover content and the carousel navigation controls. |
| `Enter` | No effect on the page count itself. Activation is handled by the sibling navigation buttons rendered through TeachingPopoverCarouselNav. |
| `Space` | No effect on the page count itself, for the same reason as Enter; the component defines no activation handler. |
| `ArrowLeft / ArrowRight` | Not handled by the page count. The carousel slider and navigation controls respond to directional keys, and the page count simply re-renders with the new values when the active page changes. |

**ARIA**: No ARIA attributes are configurable on this component; it renders text through its root slot and exposes no ARIA-specific props., aria-label on the surrounding controls: the navigation buttons produced by TeachingPopoverCarouselNav carry the accessible names for moving between pages, so positional meaning should not depend on this text alone., aria-live and aria-atomic: if the host carousel announces page changes, that region belongs to the carousel container rather than to the page count; avoid declaring the count as a live region yourself, which can cause duplicate announcements., aria-hidden must not be applied to the rendered count, because hiding it would remove the only textual statement of position for screen reader users.

**Screen Reader**: Because the component renders ordinary text, screen readers read it inline in DOM order along with the rest of the popover content, typically after the title and body and near the navigation controls. It is not a landmark and is not focusable, so users do not tab to it; virtual cursor navigation is the way it is encountered. When the carousel page changes, the new text is reflected in the accessibility tree, but whether the change is announced depends on whether the host carousel treats its content as a live region. The count works best as a reinforcement of the labelled navigation buttons, which give users a reliably announced, actionable way to determine and change their position.

## Styling

Style the root slot through the children render output or by attaching a className produced with makeStyles. Prefer semantic tokens so the count re-themes correctly: tokens.colorNeutralForeground2 or tokens.colorNeutralForeground3 for subdued secondary text, tokens.fontSizeBase200 and tokens.lineHeightBase200 for a compact footer line, and tokens.fontWeightRegular unless you deliberately want emphasis with tokens.fontWeightSemibold. Use spacing tokens such as tokens.spacingHorizontalXS and tokens.spacingHorizontalS when placing it next to dots or buttons, and tokens.spacingVerticalXS for stacked layouts. Use mergeClasses to combine a base class with caller-supplied classes rather than overriding whole rulesets. For right-to-left layouts rely on logical properties and the direction set by FluentProvider instead of hard-coded left or right margins. If the teaching surface uses a themed background, always test contrast of your chosen foreground token against that surface rather than against the default neutral background.

## Performance

The children render function is called as part of the carousel's render pass, so it runs again on every page change and whenever the carousel re-renders. Keep it pure and cheap: compute the display string directly from the arguments and avoid allocating new objects, arrays, or component subtrees inside it. Define styles once at module scope with makeStyles instead of constructing style objects per render, and avoid creating inline arrow components in the render output. Because this is a single short text node, its own rendering cost is negligible; the main risk is embedding expensive formatting such as number formatting with a new formatter instance on every call, which should be hoisted or memoized.

## Theming & Tokens

The component inherits typography and color from FluentProvider, so its text responds to theme tokens rather than hard-coded values. Typical choices are tokens.colorNeutralForeground2 for secondary informational text, tokens.colorNeutralForeground3 for the most subdued treatment, tokens.fontFamilyBase, tokens.fontSizeBase200, tokens.lineHeightBase200, and tokens.fontWeightRegular, with tokens.fontWeightSemibold available if the current page number should stand out. Spacing next to dots or buttons comes from tokens.spacingHorizontalXS and tokens.spacingHorizontalS. Switching between light and dark themes or a custom brand theme re-resolves these tokens automatically, as does high-contrast mode, so nothing needs to be re-authored per theme. RTL direction is honored through logical properties set by FluentProvider's direction, so avoid physical left and right values.

## Migration Notes

TeachingPopoverCarouselPageCount is a v9-only component with no direct v8 counterpart. In v8, teams implemented teaching bubble step counters by hand inside the bubble content; in v9 the equivalent is this component, driven by the children render function so the count is read from the carousel rather than tracked manually. If you are porting a v8 flow, replace your ad hoc counter markup with this component inside TeachingPopoverCarousel and delete any local state that tracked the current step, since the carousel owns it.

## Edge Cases

- Zero-based versus one-based display: carousel indices are zero-based internally, so a naive pass-through renders the first page as page zero. Convert before display.
- Single-page carousels: with a total of one the counter reads as noise; consider rendering nothing for that case or adjusting the wording, since hiding the component entirely is a decision the parent layout must make.
- Changing page counts: if cards are conditionally rendered, the total changes mid-session and any cached or memoized string can go stale; always recompute from the render function arguments.
- Long localized strings: some locales produce much longer phrases that can wrap or truncate in a narrow teaching popover footer, so validate layout with pseudo-localization.
- Auto-advancing carousels: when the carousel advances on its own, the count updates without user action, which can be missed visually and may not be announced; ensure a pause control is present and that the count is not the sole progress indicator.
- Missing render function: because children is required, omitting it produces no output at all rather than a sensible fallback, which can silently leave the footer looking incomplete.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
