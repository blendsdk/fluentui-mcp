# TeachingPopoverHeader

> **Package**: `@fluentui/react-teaching-popover` v9.7.0
> **Import**: `import { TeachingPopoverHeader } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

TeachingPopoverHeader renders the heading region at the top of a TeachingPopover surface. It composes three pieces: a root wrapper that holds the heading text, an optional leading icon, and an optional dismiss button that lets users close the teaching experience. The header is intended to sit directly inside the TeachingPopover surface (alongside TeachingPopoverBody, TeachingPopoverTitle, TeachingPopoverFooter, and the TeachingPopoverCarousel family) so that the popover has a consistent, distinguishable title area with a built-in way to dismiss it. The root slot is marked as required because the header always needs a container to render its content into, while the icon and dismissButton slots are optional and are only rendered when supplied. Because it is a presentational composition component, it holds no internal state of its own — dismissal, navigation, and visibility are controlled by the surrounding TeachingPopover and the handlers you attach through the slots.

**When to use**: Use TeachingPopoverHeader when you are building a teaching, onboarding, or coach-mark style experience with TeachingPopover and you need a dedicated, styled heading area at the top of the surface. It is the right choice when the popover should carry a persistent title plus an explicit close affordance, and when you want the header to visually match the rest of the TeachingPopover composition (body, footer, carousel navigation) without hand-building heading markup. Prefer TeachingPopoverTitle when you only need the semantic title text and no icon or dismiss affordance. Prefer Tooltip for a short, non-interactive hint with no title or close button, and the plain Popover / PopoverSurface pair for generic overlay content that is not part of a guided teaching flow. Reach for TeachingPopoverHeader together with the carousel parts (TeachingPopoverCarousel, TeachingPopoverCarouselCard, TeachingPopoverCarouselFooter, TeachingPopoverCarouselNav) when the popover walks the user through multiple steps and each step needs its own heading.

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

- **root**: The required wrapping element that contains the header's text and close button. It renders as a level two heading by default and, because it is a slot, can be rendered as a different heading level or as a plain div when the surrounding outline calls for it. If you choose a div, you must supply a heading role and an explicit heading level so the text is still announced as a heading. Do not make the root a heading while also nesting a heading inside it. `Render the root as a div only when you also add a heading role and level`
- **icon**: Optional leading element rendered before the header's children, typically a step illustration or status glyph. Use it only when the icon adds meaning to the step; because the accessible label comes from the header text, keep decorative icon content out of the accessibility tree and size the icon so it does not push the title into an awkward wrap. `A small decorative glyph shown before the step title`
- **dismissButton**: Optional button slot rendered inside the header that lets the user close or skip the teaching experience. Provide it whenever the flow can be dismissed, attach the dismissal handler to it, and always give it an accessible name describing the outcome so keyboard and screen reader users know what activating it does. `A close or skip button with a descriptive accessible name`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `dismissButton` | — | No | The component to be used as close button in heading |
| `icon` | — | No | Initial icon slot rendered before children content in heading. |
| `root` | — | Yes | The element wrapping the text and close button. By default this is an div; although it can be a heading, this should not be done. Instead, wrap the child text in a heading tag if one is needed. Be sure to include role and aria heading level if div is used. |

## Best Practices

### Do's

- Supply the root slot content with a real, concise title that describes the step or topic, since it is the first thing a screen reader announces when the popover opens.
- Keep the header to a single short heading line (a few words) so it reads quickly and does not push the body content out of view on small screens.
- Provide the dismissButton slot whenever the teaching experience can be skipped or re-opened later, and give it a descriptive accessible name such as a close or skip label rather than relying on an icon alone.
- Give each step's header a stable identifying value so the popover surface can be labelled by the header content and assistive technology users can tell one step from another.
- Keep the icon slot purely decorative — decorative leading icons should be hidden from assistive technology so the heading text remains the announced label.
- Use the root slot's ability to render as different heading levels so the header matches the surrounding document outline rather than always defaulting to a level two heading.
- Wrap any complex title content in an appropriate heading element inside the root if the design calls for it, and leave the root itself as the structural wrapper.

### Don'ts

- Do not render the root slot as a heading element and then nest another heading inside it; the shipped guidance is that the root should stay a wrapper and any heading tag should wrap the child text instead.
- Do not leave the dismiss button without an accessible name, and do not rely on a tooltip as the only label for it.
- Do not duplicate the same string in both TeachingPopoverHeader and TeachingPopoverTitle — pick one place to own the title text so assistive technology does not announce it twice.
- Do not place interactive controls other than the dismiss button inside the header; actions belong in TeachingPopoverFooter or the body.
- Do not use TeachingPopoverHeader as a general page heading component or outside of a TeachingPopover surface, where it will lose its intended layout and theming context.
- Do not hard-code colors, font sizes, or spacing in the header's root or slots; this component is designed to inherit theme values so it stays correct in dark, high-contrast, and brand themes.
- Do not omit the header on a multi-step teaching flow purely for visual minimalism; users lose the anchor that tells them which step they are on.

## Anti-Patterns

### Doubling up on headings

❌ Rendering the root slot as a heading element and then wrapping the child text in another heading produces nested, redundant headings that pollute the heading list for screen reader users.

✅ Follow the slot's guidance: keep the root as the structural wrapper and wrap the child text in a heading tag when one is needed, or keep the root as the heading and put plain text inside it — never both.

### Silent dismiss button

❌ An icon-only dismiss button with no accessible name, or one whose only label is a visual tooltip, leaves screen reader users with an unlabelled button and no idea what it does.

✅ Give the dismissButton slot an accessible name that describes the result of activating it, and do not rely on hover-only affordances to communicate its purpose.

### Duplicated titles across header and title

❌ Putting the same string in both TeachingPopoverHeader and TeachingPopoverTitle makes assistive technology announce the step name twice and creates two sources of truth for the copy.

✅ Decide which component owns the visible title for that step and leave the other empty or unused, so the label is announced once.

### Header used as generic page markup

❌ Reusing TeachingPopoverHeader outside a TeachingPopover surface, or as a page-level heading, means it inherits none of the intended popover spacing, surface color, or composition behavior and can break the document outline.

✅ Keep the header inside its TeachingPopover surface; use Text plus a normal heading for page-level titles.

### Cramming actions into the header

❌ Adding primary actions or navigation controls alongside the dismiss button overloads a region whose only job is to name the step and offer an exit.

✅ Place step navigation in the TeachingPopoverCarouselFooter or TeachingPopoverCarouselNav and primary actions in TeachingPopoverFooter; leave the header to the title, optional icon, and dismiss affordance.

### Hard-coded visual values

❌ Overriding the header's colors, font sizes, and spacing with fixed values defeats theme switching and frequently fails contrast in dark and high-contrast themes.

✅ Use the design tokens (for example tokens.colorNeutralForeground1, tokens.fontSizeBase500, tokens.spacingHorizontalM) so the header follows the active FluentProvider theme.

## Accessibility

**Requirements**: The header must expose an accessible heading. When the root slot renders as a plain div, it needs a heading role together with an explicit heading level so that the text is announced as a heading and appears in the virtual cursor's heading list; when it renders as a native heading element, the level is implied by the tag. The header text should serve as the accessible name of the popover surface so that focus entering the popover announces the current step or topic. Any dismiss button rendered through the dismissButton slot must have an accessible name, must be reachable and operable by keyboard, and must meet contrast requirements in every theme. Decorative content placed in the icon slot must be hidden from assistive technology. Text inside the header must meet WCAG contrast minimums, which the design tokens provide by default.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the header's dismiss button when the popover is open and the button is present; if the dismiss button is absent, focus skips the header entirely and moves to the next focusable element in the popover. |
| `Shift+Tab` | Moves focus backwards out of the header to the previous focusable element in the popover, or back into the popover from the dismiss button. |
| `Enter` | Activates the focused dismiss button, triggering its click handler and closing the teaching experience. |
| `Space` | Activates the focused dismiss button in the same way as Enter, matching native button semantics. |
| `Escape` | Closes the containing popover surface; dismissal via the header's dismiss button should be treated as an equivalent outcome so the same cleanup (for example, remembering that the tour was skipped) runs in both paths. |

**ARIA**: role, aria-level, aria-label, aria-labelledby, aria-hidden

**Screen Reader**: When the popover opens, focus moves to the surface, and the surface is labelled using the header text, so the announcement pairs the step title with the popover role. A screen reader user then encounters the header text as a heading (either because a native heading element was used or because the root carries a heading role with an explicit level), can pull it up in the heading list for navigation, and reaches the dismiss button next as a normal button with its accessible name. Decorative leading icons in the icon slot are not announced, and the header contributes nothing to the tab order other than the dismiss button.

## Styling

Customize the header through the root, icon, and dismissButton slots rather than through global CSS overrides. The root is where you tune typography — tokens.fontSizeBase500 with tokens.fontWeightSemibold is the natural pairing for a step title, and tokens.lineHeightBase500 keeps multi-line titles readable — plus the horizontal and vertical gutters using tokens.spacingHorizontalM and tokens.spacingVerticalS. Spacing between the icon and the text is best expressed with a gap on the root using tokens.spacingHorizontalS or tokens.spacingHorizontalMNudge. The dismiss button reads best as a subtle icon button on the neutral surface: use tokens.colorNeutralForeground2 for its rest color, tokens.colorNeutralForeground2Hover or tokens.colorNeutralForeground1 for hover, and tokens.colorSubtleBackgroundHover for its hover background, with tokens.borderRadiusMedium as the focus and hover radius. Focus rings should come from tokens.colorStrokeFocus2. Keep the header background transparent so it inherits the TeachingPopover surface color (tokens.colorNeutralBackground1) and remains correct in dark and high-contrast themes.

## Performance

TeachingPopoverHeader is a thin, stateless composition layer — it renders its root, an optional icon, its text content, and an optional dismiss button, with no subscriptions, effects, or internal state, so it costs essentially nothing beyond its DOM nodes. Keep the header cheap by passing simple text and a light icon rather than a heavy component tree; any function or element you supply for a slot is evaluated on every render of the parent popover, so avoid recreating large subtrees inline when the popover re-renders frequently (for example, while a teaching carousel animates between steps). Because the popover surface mounts fresh content per step, keeping the header markup minimal also shortens the work the browser does when the surface mounts and unmounts.

## Theming & Tokens

The header inherits everything from the nearest FluentProvider, so it needs no theme-aware code of its own. Title text picks up tokens.colorNeutralForeground1 by default on a neutral surface, with tokens.colorNeutralForeground2 as the appropriate choice for secondary or muted header text and tokens.colorBrandForeground1 when the header should carry brand emphasis. Typography comes from the theme's font size and weight ramp — tokens.fontSizeBase300 through tokens.fontSizeBase500, tokens.fontWeightRegular and tokens.fontWeightSemibold, and the matching line height tokens. Spacing is drawn from the theme's spacing ramp (tokens.spacingHorizontalS, tokens.spacingHorizontalM, tokens.spacingVerticalS), corner rounding from tokens.borderRadiusMedium, and focus visuals from tokens.colorStrokeFocus2. Because these are semantic tokens, the header automatically adapts to dark, light, and high-contrast themes without per-theme overrides.

## Migration Notes

TeachingPopoverHeader is a v9-style composition component: instead of manually placing a heading plus a close button into an overlay and styling them with external class names, you assign props to the root, icon, and dismissButton slots and let the component handle layout and theming. When migrating existing header markup from a hand-rolled overlay, map the previous close-button markup onto dismissButton (adding the accessible name that ad-hoc markup often lacked), map the previous heading markup onto root, and take the opportunity to align the heading level with the surrounding document outline rather than leaving the default.

## Edge Cases

- The root slot defaults to a level two heading, which can be wrong when the popover is opened from a context that already uses level two headings — adjust the rendered heading level so the popover's heading nests correctly in the document outline.
- When the root is rendered as a div instead of a heading element, the header text is not announced as a heading and does not appear in a screen reader's heading navigation unless a heading role and an explicit heading level are added.
- If a dismiss button is rendered without a handler, the control appears interactive but does nothing when activated; make sure the slot's activation path actually closes the popover and performs the same bookkeeping as a skip action.
- On very narrow viewports a long header title plus a leading icon can wrap to several lines and crowd the body; keep titles short and let the icon shrink or be dropped at small sizes.
- A decorative icon placed in the icon slot with meaningful content inside (such as text or an image with a title) will be announced alongside the header text and can duplicate or confuse the label; hide purely decorative content from assistive technology.
- Because the header is part of a multi-step experience, closing via the dismiss button and finishing the flow are different outcomes — make sure the dismiss path is recorded so the experience is not shown again unintentionally.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
