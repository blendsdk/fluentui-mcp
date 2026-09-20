# TeachingPopoverTitle

> **Package**: `@fluentui/react-teaching-popover` v9.7.0
> **Import**: `import { TeachingPopoverTitle } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

TeachingPopoverTitle renders the heading text at the top of a TeachingPopover surface — the coaching-mark style callout used to teach users about a feature, walk them through an onboarding step, or announce something new in-product. It is a composable subcomponent of the TeachingPopover family and is meant to be placed inside the popover surface (or inside the teaching popover header when that region is used), directly above the body copy or carousel page that explains the headline. By default it renders as a second-level heading element, but the required root slot is polymorphic and can be re-mapped to any of h1 through h6, or to a plain div, so the same visual style can be dropped into whatever heading level the surrounding page outline requires. The optional dismissButton slot provides an alternate close path for cases where the teaching popover header does not host its own dismiss control, rendering a button that dismisses the surface. Because it is a typographic subcomponent rather than a container, Title has no layout, color, or interactive behavior of its own beyond what the surface and the theme supply — it inherits the teaching popover's typography ramp and focus treatment.

**When to use**: Use TeachingPopoverTitle whenever a TeachingPopoverSurface needs a headline that names the feature, step, or announcement the popover is about. It is the correct choice when the popover has real body content to follow (TeachingPopoverBody, a carousel, or both) and the heading exists to orient the user before they read the details. Reach for it when the popover participates in a multi-step or carousel-driven teaching flow, because a per-step title is what tells the user the content changed. Prefer plain PopoverSurface plus Text or a simple heading when the overlay is purely informational and not part of a teaching/onboarding narrative; prefer Dialog when the user must complete a task rather than read a hint; prefer Tooltip when the message is a one-line label for a control and no heading is warranted. Use the header-level heading variant of the teaching popover header (with its icon and dismiss button slots) when the popover also needs branding or a close affordance in the header region, and use TeachingPopoverTitle inside that header when you only need the heading text.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `altText` | `React_2.ReactNode` | — | Yes | — |
| `children` | `NavButtonRenderFunction` | — | Yes | — |
| `children` | `TeachingPopoverCarouselPageCountRenderFunction` | — | Yes | — |
| `dismissButton` | `Slot<'button'>` | — | No | — |
| `dismissButton` | `Slot<'button'>` | — | No | — |
| `finalStepText` | `string` | — | Yes | — |
| `footerLayout` | `'horizontal' \| 'vertical'` | — | No | — |
| `footerLayout` | `'horizontal' \| 'vertical'` | — | No | — |
| `handleButtonClick` | `(event: React_2.MouseEvent<HTMLButtonElement & HTMLAnchorElement & HTMLDivElement>) => void` | — | Yes | — |
| `icon` | `Slot<'div'>` | — | No | — |
| `initialStepText` | `string` | — | Yes | — |
| `layout` | `TeachingPopoverCarouselFooterLayout` | — | No | — |
| `mediaLength` | `'short' \| 'medium' \| 'tall'` | — | No | — |
| `navType` | `'next' \| 'prev'` | — | Yes | — |
| `root` | `NonNullable<Slot<ARIAButtonSlotProps<'a'>>>` | — | Yes | — |
| `root` | `NonNullable<Slot<'div'>>` | — | Yes | — |
| `root` | `Slot<'div', 'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'>` | — | Yes | — |
| `root` | `Slot<'h2', 'h1' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'div'>` | — | Yes | — |
| `value` | `string` | — | Yes | — |

### Prop Guidance

- **root**: The root slot carries the title text and determines the element that wraps it. It defaults to an h2 heading; it accepts h1 through h6 or a div. Always retarget it to the heading level that matches the surrounding page outline, and only use div when the text genuinely is not a heading. Pass className through the slot for styling, and keep the slot's id intact so the surface can reference the title for its accessible name. `h2`
- **dismissButton**: Optional button rendered alongside the title that offers an alternate close path when the teaching popover header does not already contain a dismiss control. Populate it only if the surface is otherwise missing a close affordance, give icon-only renderings a programmatic label, and let the surface's dismissal handling close the popover rather than wiring custom close logic. `A close icon button labeled 'Dismiss'`
- **children**: The text content of the title. Keep it to a short, specific headline naming the feature or current step; detailed explanations and any list or link structure belong in the body, carousel, or footer content that follows the title. `Try the new dashboard`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `dismissButton` | — | No | An alternate close button path if not placed in the TeachingPopoverHeader |
| `root` | — | Yes | Title for teaching bubble |

## Best Practices

### Do's

- Keep the title short and scannable — typically three to eight words that name the feature or the current step, and move any explanatory sentences into TeachingPopoverBody.
- Render TeachingPopoverTitle as the first content inside the surface or header so the heading precedes the body copy and the carousel in DOM order, which keeps the reading and focus order natural.
- Choose the root slot's rendered element to match the surrounding document outline (h1 through h6) instead of always accepting the default h2, so the page never ends up with a skipped or duplicated heading level.
- Give the dismissButton slot an accessible name when it renders an icon or glyph without visible text, since assistive technology announces the button on its own.
- Only populate the dismissButton slot when the teaching popover header does not already provide a close control, so the surface has exactly one obvious way to dismiss it.
- Update the title text for each step or carousel page so the heading always describes the content currently visible beneath it.
- Let the theme carry typographic hierarchy; adjust weight, size, or color through the root slot's className and Griffel tokens rather than hardcoded values.
- Preserve the id exposed on the root slot when you override the slot, because the surrounding surface relies on it to associate the heading text with the popover region.

### Don'ts

- Do not render TeachingPopoverTitle outside a teaching popover surface (for example, inside a plain PopoverSurface or a bare Card) — it is a subcomponent with no standalone layout or surface of its own.
- Do not use the title for multi-sentence explanations, bulleted lists, or legal text; that content belongs in TeachingPopoverBody or a Text element within the body.
- Do not supply both a header dismiss control and the title's dismissButton slot in the same popover, as duplicated close affordances confuse sighted and screen-reader users alike.
- Do not swap the root to a div purely to escape heading defaults — if the heading level is wrong, retarget it to the correct h element rather than discarding the semantics.
- Do not hardcode font sizes, weights, or colors on the title; the teaching popover's visual hierarchy comes from theme tokens and overrides will break in high-contrast and dark themes.
- Do not forward carousel, navigation, or footer props such as navType, mediaLength, layout, footerLayout, initialStepText, finalStepText, handleButtonClick, value, or altText to the title; those belong to the teaching popover's carousel, navigation, and footer subcomponents.
- Do not nest more than one title in a single surface — one heading per teaching step keeps the popover's accessible name unambiguous.

## Anti-Patterns

### Using the title as the whole popover

❌ Rendering TeachingPopoverTitle in a plain PopoverSurface, Card, or standalone context produces a heading with none of the teaching popover's surface styling, dismissal behavior, or step context, and the reference to the title's id from a surrounding region is missing.

✅ Place TeachingPopoverTitle inside a TeachingPopoverSurface (or the teaching popover header) so telemetry, theming, and dismissal are handled by the family, and use a plain heading element plus Text when no teaching behavior is wanted.

### Duplicated dismiss affordances

❌ Populating the dismissButton slot while the teaching popover header already renders a close control gives the user two visually identical buttons that do the same thing, which is noisy for sighted users and repetitive when screen readers enumerate the surface's controls.

✅ Keep exactly one close path: rely on the header's dismiss control when the header is present, and reserve the title's dismissButton slot for surfaces that use the title-only header layout.

### Destroying heading semantics for styling

❌ Remapping the root slot to a div because the default heading size or margins do not match the mock removes the title from the page's heading outline, so users who navigate by heading can no longer find or identify the teaching popover.

✅ Keep an h element and adjust appearance with typographic tokens and className overrides; only use a div when the text truly is not a heading, and supply equivalent role and level information if it must behave like one.

### Paragraph-length titles

❌ Cramming multi-sentence explanations into the title makes the heading unusable as a landmark, wraps into several lines that can push the popover taller than the viewport on small screens, and pushes the actual guidance below the fold.

✅ Reduce the title to a short headline and move the explanation into TeachingPopoverBody or the corresponding carousel page so the heading stays scannable and the surface's height stays predictable.

### Passing carousel and footer props to the title

❌ Props that belong to the teaching popover's carousel, navigation buttons, page count, and footer (such as navType, mediaLength, layout, footerLayout, initialStepText, finalStepText, handleButtonClick, value, and altText) have no effect on the title and silently mislead whoever maintains the call site.

✅ Apply each prop on the subcomponent that declares it and keep the title limited to its root slot, optional dismissButton, and heading text.

## Accessibility

**Requirements**: TeachingPopoverTitle is the primary text that identifies the teaching popover, so it must be present and descriptive whenever the surface has body content. Because the root slot renders a real heading element by default (h2, or h1/h3–h6 when retargeted), the chosen level must fit the page's heading outline without skipping levels; a heading-order violation is a WCAG 1.3.1 issue. If the root is mapped to a div, the semantic heading is lost and the popover loses its navigable label unless an equivalent role and level are supplied. Text must meet WCAG 1.4.3 contrast against the surface background, and any focusable dismiss button must meet the 2.4.7 visible-focus requirement via the theme's focus tokens and must satisfy the minimum target size. When the dismissButton slot renders an icon-only button, it needs programmatic text so the control is not announced as an unlabeled button.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus from the title region into the dismiss button and then on to the popover body, carousel navigation, or footer actions. |
| `Shift+Tab` | Moves focus backwards out of the dismiss button and back toward the title text and the rest of the surface. |
| `Enter` | Activates the dismiss button slot when it has focus, closing the teaching popover. |
| `Space` | Activates the dismiss button slot when it has focus, matching native button behavior. |
| `Escape` | Dismisses the teaching popover surface regardless of which element inside it has focus, including the title's dismiss button. |

**ARIA**: aria-label — for the dismissButton slot when it renders an icon or glyph with no visible text, aria-labelledby — the mechanism the surrounding surface uses to associate the title's id with the popover region; keep that id when overriding the root slot, role=heading with aria-level — only relevant if the root slot is remapped to a div and the heading semantics must be recreated, aria-describedby — points at the body copy that elaborates on the title when the title alone is not a complete description

**Screen Reader**: Screen readers encounter the title as a heading and announce its level alongside the text, which is why the rendered element matters more than the visual size. When focus enters the teaching popover surface, the title text typically supplies the accessible name for the region through the id carried on the root slot, so an empty or generic title leaves users with an unnamed overlay. The dismiss button is announced as a button with its accessible name, and activating it removes the surface from the accessibility tree. Because the title participates in the surrounding page's heading list, a title rendered at the wrong level will appear out of order when users navigate by heading, and a title rendered with a div root disappears from that list entirely.

## Styling

Style the title through the root slot's className rather than wrapping it in extra elements. The component consumes the teaching popover typography ramp, so most customization is spacing and emphasis: use tokens.spacingVerticalS and tokens.spacingVerticalMNudge for separation from the body or carousel below, tokens.fontWeightSemibold when the default weight reads too light against a busy surface, tokens.fontSizeBase500 or tokens.fontSizeBase600 if the default heading size does not match the surface's width, and tokens.lineHeightBase500 for tighter multi-line wrapping on narrow popovers. For color, tokens.colorNeutralForeground1 is the standard heading color and tokens.colorNeutralForeground2 works for a softer secondary headline; use tokens.colorBrandForeground1 only when the title should carry brand emphasis for an onboarding step. If you override the root element, remember that browser heading margins are reset by the component's styles, so add explicit vertical spacing with tokens.spacingVertical* tokens instead of relying on margins. Long titles are the most common layout problem — constrain width at the surface level so the heading wraps predictably instead of forcing the popover wider.

## Performance

TeachingPopoverTitle is one of the cheapest nodes in the teaching popover: it renders a single heading element plus an optional button, so it is not a rendering bottleneck. The cost worth watching is re-rendering, not mounting — because the title sits inside a surface whose content changes as carousel pages or steps advance, a title whose dismissButton slot or root slot receives a freshly created object or inline render function on every parent render will force that slot to reconcile repeatedly. Define slot props and styles once at module scope, and avoid deriving titles from state that changes on every keystroke or scroll inside the popover. Long title strings also have a layout cost on narrow surfaces because they trigger extra text wrapping and reflow of the surrounding carousel and footer; keeping headings short avoids that reflow entirely.

## Theming & Tokens

The title draws its typography and color from the Fluent theme supplied by FluentProvider. Heading text uses tokens.colorNeutralForeground1 by default, with tokens.colorNeutralForeground2 available for a subordinate headline and tokens.colorBrandForeground1 or tokens.colorBrandForeground2 for branded onboarding emphasis. Type is built from tokens.fontFamilyBase, tokens.fontSizeBase500 and tokens.fontSizeBase600, tokens.fontWeightSemibold, and tokens.lineHeightBase500 or tokens.lineHeightBase600. Spacing between the title and the content beneath it should come from tokens.spacingVerticalS, tokens.spacingVerticalMNudge, and tokens.spacingVerticalM rather than literal values. Focus on the dismissButton uses the shared focus tokens (tokens.colorStrokeFocus2 and the accompanying focus outline stroke width), and the surrounding surface uses tokens.colorNeutralBackground1 plus tokens.colorNeutralStroke1 for its edge. In high-contrast and dark themes, semantic token usage — never hardcoded hex values — is what keeps the heading readable and the dismiss button's focus indicator visible.

## Migration Notes

TeachingPopoverTitle is a new, non-deprecated v9 export, so most teams encounter it as an addition rather than a migration. Older teaching and coaching patterns that inlined a bold Text element as a pseudo-heading should be converted to this subcomponent so the callout exposes a real heading to assistive technology and to heading-navigation shortcuts. When porting a legacy callout, take care to move only the heading copy into TeachingPopoverTitle: multi-sentence guidance, checklists, and action buttons belong in the body, carousel, and footer subcomponents respectively. Note that the props surfaced in this component's data also include options that belong to sibling teaching popover subcomponents (carousel pages, carousel navigation buttons, and the footer), such as navType, mediaLength, layout, footerLayout, initialStepText, finalStepText, handleButtonClick, value, and altText; those are not title concerns and should be applied on the subcomponent that owns them.

## Edge Cases

- The default rendered element is an h2. If the page already places the teaching popover under an h2 section, the title appears as a sibling heading rather than a sub-heading and breaks the outline; retarget the root slot to the level that fits.
- Remapping the root slot to a div removes the heading role entirely, so the title stops appearing in heading-navigation lists and the popover may lose the mechanism it uses to label itself.
- The dismissButton slot renders a button without visible text by default; if you supply an icon or glyph, nothing speaks for the control until you add an accessible name, and screen readers will announce it as an unnamed button.
- Within a teaching popover carousel, the title is re-rendered as pages advance, so any animation, locally measured size, or imperative DOM work attached to the previous title instance is discarded between steps.
- Because the element is polymorphic, custom CSS that targets a specific tag will silently stop applying when someone retargets the root slot to a different heading level; style through className instead of tag selectors.
- Titles that run long on narrow surfaces change the popover's height and can push the carousel navigation and footer out of view, so headline length should be validated at the smallest supported surface width.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
