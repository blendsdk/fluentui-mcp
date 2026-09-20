# TeachingPopoverCarousel

> **Package**: `@fluentui/react-teaching-popover` v9.7.0
> **Import**: `import { TeachingPopoverCarousel } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

TeachingPopoverCarousel is the multi-step container inside a TeachingPopover that turns a single coaching surface into a paged, walkthrough experience. It wraps an ordered set of carousel pages (authored with TeachingPopoverCarouselCard) together with the navigation controls, page counter, and footer actions that move the learner from one step to the next. The carousel owns the current-step state through its value and coordinates the navigation pieces: nav buttons declared with navType of next or prev, a page-count indicator rendered through a children render function, and footer controls whose arrangement is controlled by the layout/footerLayout prop. Each element of the carousel is exposed as a slot — the root container, the nav button root (which carries ARIA button semantics and can render as a button or an anchor), and the header/title roots — so consumers can restyle or retag the structure without losing behaviour. Text used at the boundaries of the flow is supplied explicitly through initialStepText and finalStepText, and image-based steps describe their media through altText. The carousel is designed to be used inside TeachingPopoverSurface, paired with TeachingPopoverHeader, TeachingPopoverTitle, TeachingPopoverBody, and TeachingPopoverFooter, and it participates in the same focus-management and dismissal flow as the containing popover.

**When to use**: Use TeachingPopoverCarousel when a single TeachingPopover must communicate a sequence of two or more related messages — for example a product tour, a first-run onboarding walkthrough, or a feature announcement that needs before/after context. It is the right choice when the steps have a defined order and users are expected to move forward and backward through them, and when you want built-in step affordances such as a page counter and boundary-aware next/previous labels. Prefer a plain TeachingPopover with static body content for one-shot tips, a Tooltip for brief inline hints, a Dialog for content that must block the rest of the page, or a Drawer for longer persistent surfaces. Avoid the carousel when the content is unrelated (users will not understand a linear path), when a step requires heavy interaction that competes with the navigation controls, or when the message can be communicated in a single surface without pagination.

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

- **value**: Identifies a page or step within the carousel and is required for each carousel instance; keep values unique and stable across renders so the active page and its navigation controls resolve deterministically. `step-2`
- **children**: Used in two ways in this family: as a NavButtonRenderFunction for nav buttons and as a TeachingPopoverCarouselPageCountRenderFunction for the page counter. Return the visible button content or counter markup from the render function so the carousel can keep it in sync with the current step. `render function returning the counter label`
- **root**: Slot for the carousel container, the nav button root (which carries ARIA button slot props and may render as a button-like anchor), and the header/title roots (including heading elements for correct outline). Pass a className, id, or heading tag through root to restyle or retag without changing behaviour. `root={{ as: 'h3' }}`
- **navType**: Marks a nav button as the forward or backward control; the carousel uses it to decide which direction the button advances the flow, so every nav button needs an explicit value. `next`
- **handleButtonClick**: Click handler invoked when a nav or footer control is activated; use it to react to step changes or to close the popover at the end of the walkthrough while keeping the carousel's own direction logic intact. `handleButtonClick={(event) => trackStep(event)}`
- **initialStepText**: Text shown for the navigation action on the first step, clarifying what happens if the user goes back from the start of the walkthrough. `Back`
- **finalStepText**: Text shown for the navigation action on the last step, so the button states the outcome — typically completion or dismissal — instead of a generic direction. `Got it`
- **layout**: Controls the arrangement of the carousel footer controls via the footer layout type; use it to switch between an inline arrangement and a stacked one when the popover is narrow. `horizontal`
- **footerLayout**: Accepts horizontal or vertical and lays out the footer controls accordingly; choose vertical for narrow TeachingPopover surfaces and horizontal when there is room for side-by-side actions. `horizontal`
- **mediaLength**: Reserves vertical space for step media as short, medium, or tall; pick the value that matches the tallest image in the sequence so the footer and nav do not shift between pages. `short`
- **altText**: Accessible description for media used by a carousel step or image-based nav control; required for informative imagery, and should describe the meaning of the visual rather than its contents literally. `Chart showing weekly active users rising after activation`
- **dismissButton**: Slot for the button that closes the teaching surface; keep it in the header area so users can exit the walkthrough at any step without completing it. `dismissButton={{ 'aria-label': 'Close walkthrough' }}`
- **icon**: Slot for an optional decorative or brand icon shown alongside the teaching content; hide it from assistive technology if it repeats nearby text. `icon={{ 'aria-hidden': true }}`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | The element wrapping carousel pages and navigation. |

## Best Practices

### Do's

- Give every page a stable, descriptive value so the carousel can identify the active page and the nav controls can point at it deterministically.
- Always author pages with TeachingPopoverCarouselCard rather than dropping arbitrary markup into the carousel root, so paging, layout, and image handling stay consistent across steps.
- Provide meaningful initialStepText and finalStepText so the boundary buttons say what will actually happen, such as a back-style label on the first step and a completion label on the last step.
- Supply altText for every media-carrying step, describing the information the image conveys rather than restating its filename.
- Label every nav button, since navType of next or prev only expresses direction — assistive technology needs a human-readable label that includes the target step where possible.
- Choose mediaLength (short, medium, tall) to match the amount of media in the step, keeping the carousel height stable enough that the footer controls do not jump between pages.
- Keep step ordering linear and predictable, and make sure the page-count render function reflects the real number of authored pages.
- Use the root slot and root slot customisation (heading element for titles, heading levels for headers) to preserve a correct document outline inside the popover instead of styling a generic element to look like a heading.

### Don'ts

- Do not mix carousel content with non-paged content in the same carousel root; every child of the carousel should be a page or a declared navigation element.
- Do not hardcode next/previous labels inside the nav buttons' children render function in a way that ignores initialStepText and finalStepText, which exist precisely to describe boundary states.
- Do not nest buttons, links, or other focusable widgets inside a nav button root, because the nav root already claims ARIA button semantics.
- Do not omit value or reuse a duplicate value across pages, since the carousel cannot resolve the active page unambiguously.
- Do not drop alt text or pass an empty altText for informative imagery; decorative media should be handled deliberately rather than by omission.
- Do not build a second set of navigation controls alongside the carousel's own nav and footer controls, which produces two competing tab orders and duplicated announcements.
- Do not put blocking interactions such as form submission or destructive confirmations on an intermediate step; those belong in a Dialog the carousel hands off to.
- Do not rely on the carousel for content that users must be able to read non-linearly, such as reference tables or comparison data.

## Anti-Patterns

### Unpaged children in the carousel root

❌ Putting arbitrary blocks directly inside the carousel instead of TeachingPopoverCarouselCard pages breaks the one-step-at-a-time contract, so the page counter, the next/prev controls, and the value-based active page no longer correspond to anything the user sees.

✅ Author each step as its own TeachingPopoverCarouselCard with a unique value, and keep only pages plus declared navigation elements inside the carousel.

### Unlabelled directional nav buttons

❌ A nav button declared only with navType of next or prev has no accessible name, so screen reader users hear an anonymous button and cannot tell forward from backward or which step they will land on.

✅ Give every nav button root a descriptive aria-label that combines the direction and the destination, and let initialStepText and finalStepText supply the boundary-specific wording.

### Duplicated navigation controls

❌ Building a custom next/back row alongside the carousel's own nav and footer produces two tab stops for the same action, conflicting step state, and doubled screen reader announcements.

✅ Use the carousel's footer and nav pieces as the single source of navigation, customising them through the layout/footerLayout prop and slot class names rather than adding parallel controls.

### Focus-stealing step transitions

❌ Programmatically moving focus to the new page on every step change disorients keyboard users, who lose their position on the control they just activated and must re-tab through the page.

✅ Leave focus on the activated nav or footer control after a transition and announce the new step through the page counter or a polite live region instead.

### Cramming blocking tasks into a walkthrough step

❌ Embedding forms, destructive actions, or long tables into a carousel step forces users to complete unrelated work inside a coaching surface and makes the step unreachable for non-linear reading.

✅ Keep carousel steps short and informational; hand off complex tasks to a Dialog or navigate the user to the real surface once the teaching content has been read.

## Accessibility

**Requirements**: The carousel inherits the popover's non-modal, focus-managed behaviour, so all navigation must be reachable and operable by keyboard alone. Every nav button root built from ARIA button slot props must render a real button or anchor element, exposing a descriptive accessible name; directional props such as navType of next or prev are not announced on their own, so the name must carry the meaning. Maintain a logical focus order: page content first, then navigation and footer controls. Page transitions must not steal focus unexpectedly, and the currently visible page must be programmatically determinable. Text that changes as the step changes — the page counter, the boundary labels — must be exposed in a way that screen readers can read on demand rather than being injected silently. Media inside pages must carry meaningful altText, or be explicitly treated as decorative. Colour contrast for step indicators and focus styling must meet WCAG 2.1 AA, and the focus indicator must remain visible against the popover surface.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus forward through the page content, carousel nav buttons, and footer controls, including the dismiss button when present. |
| `Shift+Tab` | Moves focus backward through the same sequence, allowing users to leave the carousel and return to the popover header or trigger. |
| `Enter` | Activates the focused nav button (next or prev) or footer action, advancing or returning by one step; also follows the link when a nav root renders as an anchor. |
| `Space` | Activates the focused nav button or footer action when the root is rendered as a button element. |
| `Escape` | Dismisses the surrounding TeachingPopover, including the carousel contained in it, returning focus to the trigger. |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-current, aria-live, aria-disabled, role="region" with a carousel role description on the carousel container, role="group" on individual carousel pages

**Screen Reader**: The carousel is announced as a contained region of the popover, with the popover title typically supplying its accessible name. Each nav button is announced as a button (or link, when a nav root renders as an anchor) with its label and position, so users hear direction plus target rather than an unlabelled arrow. The page counter rendered through the page-count render function is the primary orientation cue, and boundary labels from initialStepText and finalStepText tell users when they have reached the start or the end of the walkthrough. Because stepping changes the visible content without a page load, a polite live region or an equivalent announcement is needed so the new step and counter are read out; without it, sighted and non-sighted users receive different feedback about the step change. Focus remains on the activated control after a step change, so keyboard users retain their place in the flow.

## Styling

Style the carousel through its slots and through the surrounding TeachingPopoverSurface rather than by wrapping it in extra containers. The carousel root accepts a className for horizontal padding (tokens.spacingHorizontalL), vertical rhythm between pages and controls (tokens.spacingVerticalM, tokens.spacingVerticalL), and separation above the nav area; a divider effect is often expressed with tokens.colorNeutralStroke1 as a border colour. Nav buttons typically use a subtle neutral treatment — tokens.colorNeutralBackground1 with hover tokens.colorNeutralBackground1Hover — or a brand treatment with tokens.colorBrandBackground and tokens.colorNeutralForegroundOnBrand for the primary forward action. Page counters read best in tokens.colorNeutralForeground2, with the active indicator in tokens.colorBrandForeground1 or tokens.colorBrandBackground. Use tokens.borderRadiusMedium, tokens.borderRadiusLarge, and tokens.borderRadiusCircular for rounded nav targets, and tokens.strokeWidthThick with tokens.colorStrokeFocus2 to keep a visible focus ring. Titles and headers inside the carousel respond to tokens.fontSizeBase400, tokens.fontWeightSemibold, and tokens.lineHeightBase400, while body copy uses tokens.fontSizeBase300 and tokens.colorNeutralForeground1. Media sizing driven by mediaLength pairs well with tokens.borderRadiusLarge on the image container and tokens.shadow4 on elevated cards; the footer layout switch between horizontal and vertical should use tokens.spacingHorizontalM for inline groups and tokens.spacingVerticalS for stacked ones.

## Performance

The carousel renders inside the popover's portal, so it mounts and unmounts with the teaching surface — keep step content lightweight and avoid expensive work in the children render functions for nav buttons and the page counter, which are invoked as part of rendering and can be recreated on every step change. Hoist or memoize those render functions outside the carousel's render path so the nav and counter do not remount and lose focus on each transition. Media in steps is the main cost: reserve space with mediaLength so layout does not thrash, lazy-load off-screen page imagery, and prefer appropriately sized sources over large hero images inside a popover. Avoid rebuilding the entire page tree on step change if steps share structure, and do not nest additional scroll containers, which forces layout recalculation inside a small surface. Because the carousel lives in the popover's focus trap, heavy synchronous work during a step transition will be visible as jank in keyboard navigation.

## Theming & Tokens

TeachingPopoverCarousel consumes Fluent UI Griffel tokens rather than hardcoded values, so it adapts automatically to the active FluentProvider theme. Backgrounds and surfaces resolve through tokens.colorNeutralBackground1 and tokens.colorNeutralBackground2, with hover states for nav buttons from tokens.colorNeutralBackground1Hover. Brand-forward elements such as the active step indicator and primary forward action draw on tokens.colorBrandBackground, tokens.colorBrandForeground1, and tokens.colorNeutralForegroundOnBrand, while secondary text such as the page counter uses tokens.colorNeutralForeground2. Borders and separators use tokens.colorNeutralStroke1 and tokens.colorNeutralStroke2, and focus rings use tokens.colorStrokeFocus2 with tokens.strokeWidthThick. Spacing and shape follow tokens.spacingVerticalM, tokens.spacingVerticalL, tokens.spacingHorizontalL, tokens.borderRadiusMedium, and tokens.borderRadiusLarge, and typography follows tokens.fontSizeBase300, tokens.fontSizeBase400, tokens.fontWeightSemibold, and tokens.lineHeightBase400. Transition timing for step changes uses motion tokens such as tokens.durationNormal and tokens.curveEasyEase. In high-contrast and dark themes these tokens resolve to theme-appropriate values, so avoid overriding them with literal colours; if you must restyle, override in a theme created with createLightTheme/createDarkTheme or apply token-based class overrides on the root slot.

## Migration Notes

TeachingPopoverCarousel is new in Fluent UI React v9 and has no direct v8 counterpart: v8 shipped TeachingBubble but not a carousel container for multi-step coaching. Teams migrating from v8 custom onboarding implementations built on Callout plus manual step state must rebuild the flow using TeachingPopover with TeachingPopoverCarousel, TeachingPopoverCarouselCard, and the TeachingPopoverCarouselFooter/Nav pieces. In the v9 model, step text and page labels are explicit props (value, initialStepText, finalStepText, altText) rather than arbitrary child markup, and the carousel relies on Griffel tokens (tokens.*) instead of the v8 Fabric palette classes or SCSS variables. Because the carousel renders inside the popover portal, any global CSS selectors previously used to restyle step containers must be converted to slot class overrides or Griffel styles.

## Edge Cases

- Step state belongs to the carousel instance: if the surrounding TeachingPopover unmounts or the carousel is re-created, the flow restarts at the first step, so persistence must be handled by the consumer.
- Boundary behaviour changes the meaning of the navigation buttons — the first step and the final step use initialStepText and finalStepText instead of the usual next/prev labels, and those boundary labels still need to read correctly to screen readers.
- Because the carousel renders in a portal, global CSS selectors and ancestor-based styling from the page will not reach it; style through the slots or the TeachingPopover surface instead.
- mediaLength reserves space based on the tallest expected media, so mixing very different image aspects within one carousel can leave visible gaps or clipping unless the steps are normalised.
- altText is required wherever media is used, but purely decorative imagery still needs a deliberate empty or hidden treatment rather than a leftover description.
- Pages must resolve to unique value strings; duplicated or missing values make the active page and its nav targets ambiguous.
- Hiding or removing a nav button, for example at the final step, changes the number of tab stops inside the popover — verify the focus order still ends on the dismiss or completion action.
- The carousel inherits the popover's dismissal behaviour, so Escape during an intermediate step exits the whole walkthrough rather than stepping back.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
