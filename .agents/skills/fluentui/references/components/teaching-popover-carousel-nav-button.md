# TeachingPopoverCarouselNavButton

> **Package**: `@fluentui/react-teaching-popover` v9.7.0
> **Import**: `import { TeachingPopoverCarouselNavButton } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

TeachingPopoverCarouselNavButton is the page-jump control used by the TeachingPopover carousel family. It renders an ARIA-compliant button (through the ARIA button slot, so it can also be rendered as an anchor) that moves the active TeachingPopoverCarouselCard to the step identified by its value, and it is normally composed inside the carousel's navigation row rather than placed directly inside the popover surface. Each button carries the page identifier it targets through value, an accessible name through altText, and optional presentation hints such as navType, mediaLength, layout, and footerLayout. Because the root is a slot, you can restyle or re-render the control, and because children accepts a nav-button render function (as well as a page-count render function shape used by the related page-count element), you can replace the default marker with dots, page numbers, or media thumbnails while the carousel keeps ownership of selection state, keyboard behavior, and click handling via handleButtonClick.

**When to use**: Use TeachingPopoverCarouselNavButton when you are building a multi-step TeachingPopover tour or onboarding flow and you need direct, random-access navigation between its pages, for example a row of dots or numbered markers that let users jump straight to a known step. Reach for it instead of the generic Carousel/CarouselNavButton pair when the carousel lives inside a TeachingPopover and should share teaching-popover behavior such as the dismissButton, icon, step-aware labels (initialStepText and finalStepText), and footer layout. Do not use it as the primary or final call to action: forward/backward progression and completion belong to the carousel footer buttons, and simple prev/next movement is better expressed with navType-driven controls than with one button per page. If your content is not a paged, sequential teaching experience, a plain TeachingPopover with a single surface, or a TabList for tab-like content, is the simpler choice.

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

- **value**: Required page identifier that this button navigates to; it must match the value of the corresponding TeachingPopoverCarouselCard. Keep values stable across renders and unique within the carousel. `welcome-step`
- **altText**: Required accessible name for the button. Because default markers are visual only, provide a meaningful page or step description; never leave it empty and never repeat one label across buttons. `Go to step 2: Choose a plan`
- **navType**: Required direction indicator distinguishing previous-style and next-style navigation controls. Use it to decide which end of the row a control belongs to and to drive disabled or hidden states at the first and last step. `next`
- **mediaLength**: Optional presentation hint for the size of media-backed markers (short, medium, tall). Use it when nav markers include thumbnails or images so all markers share a consistent height. `medium`
- **layout**: Optional layout value from the carousel footer layout type that positions or arranges the navigation control within the carousel chrome. `horizontal`
- **footerLayout**: Optional horizontal or vertical arrangement of the footer controls. Switch to vertical when the popover is narrow so nav buttons and step text do not compete for width. `vertical`
- **initialStepText**: Required step label string shown on the first step of the flow; use it so the nav and footer communicate the entry point instead of relying on a generic label. `Get started`
- **finalStepText**: Required step label string shown on the last step; it marks completion of the tour and pairs with the footer's terminal action rather than with a nav button. `Finish`
- **root**: Required slot for the button element. It is typed against the ARIA button slot (optionally rendered as an anchor) and the heading/container slots used by the surrounding teaching-popover parts. Extend it with className or styles but keep the ARIA button props intact. `root`
- **children**: Required render function for the button's inner content (nav-button render function) and, for the related page-count element, a page-count render function. Use it to draw dots, numbers, or thumbnails, and return non-interactive markup only. `render function returning a dot marker`
- **handleButtonClick**: Required click handler supplied by the carousel to perform the page change. Do not replace it with your own navigation logic; if you must intercept, delegate back to it so selection state stays in sync. `handleButtonClick`
- **dismissButton**: Optional slot for the popover header's dismiss control. Style or reposition it, but keep it focusable and labeled so users can exit the tour at any step. `dismissButton`
- **icon**: Optional slot for the header icon rendered alongside the title. Mark purely decorative icons as hidden from assistive technology so they are not announced before the heading. `icon`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | ARIA compliant nav buttons used to jump to pages |

## Best Practices

### Do's

- Give every TeachingPopoverCarouselNavButton a unique, descriptive altText that names the step it targets, so screen reader users can tell the buttons apart when the nav row is read.
- Keep each button's value stable, unique, and identical to the value of the TeachingPopoverCarouselCard it navigates to so the carousel can resolve the target page reliably.
- Render the nav buttons inside the carousel's navigation container so they inherit the carousel context and selection state instead of maintaining their own state.
- Use the children render function only when the default marker is insufficient — dots, step numbers, or thumbnails — and keep the returned markup non-interactive so the root button remains the single focusable element.
- Keep the count of nav buttons in step with the count of carousel cards; a mismatch produces buttons that lead nowhere or steps that are unreachable from the nav row.
- Set navType consistently with the direction of travel and use the footer layout to hide or disable the prev control on the first step and the next control on the final step.
- Prefer initialStepText and finalStepText on the footer for the terminal actions (finish, get started) and reserve nav buttons purely for page navigation.

### Don'ts

- Don't reuse one altText such as "Next step" across every nav button — identical accessible names make the nav row unusable with a screen reader.
- Don't render navigation buttons outside the carousel context; they depend on that context to know which page is active and how to move between pages.
- Don't pass a custom root that drops the ARIA button slot props, for example a bare div, because the control then loses its button role, disabled handling, and keyboard activation.
- Don't turn a nav button into the flow's primary action ("Finish") — completion belongs to the footer and its finalStepText affordance.
- Don't place nested interactive elements such as links, buttons, or inputs inside the render-function output, since they create nested interactive content inside the button.
- Don't rely on color alone to distinguish the currently selected page; pair color with a shape, size, or border change so the state survives high-contrast and color-blind use.
- Don't recreate the render function on every parent render with a fresh inline function identity, which forces the button to re-render and can thrash focus during page transitions.

## Anti-Patterns

### Nav buttons without carousel context

❌ Rendering the nav button outside the carousel or its navigation container leaves it without a page registry, so clicking does nothing, the selected state is never reflected, and the control silently becomes a dead button.

✅ Always compose the nav button inside the carousel navigation row that lives within the TeachingPopover carousel, and let that container own the active page state.

### Identical accessible names

❌ Reusing one altText such as "Step" or "Next" for every marker produces a row of identically announced buttons, forcing screen reader users to activate them by trial and error.

✅ Derive altText from the corresponding page title or step number so each button has a unique, meaningful name that describes its destination.

### Nav buttons used as the primary action

❌ Making the final nav button double as the completion action mixes navigation semantics with commit semantics, so users cannot tell whether they are browsing or finishing, and the flow's terminal text (finalStepText) becomes decorative.

✅ Keep nav buttons strictly for page jumps and expose completion through the footer action with initialStepText and finalStepText for labeling.

### Custom root that discards ARIA button behavior

❌ Overriding the root slot with a non-interactive element removes the button role, disabled handling, and Enter/Space activation, producing a control that looks clickable but is unusable by keyboard or assistive technology.

✅ Extend the provided root slot with styling only, or render an anchor through the ARIA button slot so button semantics and keyboard handling are preserved.

### Unstable render functions on every render

❌ Defining the children render function inline in the parent causes a new function identity on each render, re-mounting marker content and interrupting focus as users move through steps.

✅ Hoist or memoize the render function so marker content reconciles in place and focus is preserved during page transitions.

## Accessibility

**Requirements**: Every nav button must expose a non-empty accessible name, which you supply through altText; a button whose only content is an icon, dot, or number is otherwise announced as an unlabeled button. Preserve the ARIA button semantics of the root slot — when it renders as an anchor it must keep button keyboard behavior (activation on Enter and Space), and when it renders as a native button it must not be given a conflicting role. Target size should meet the WCAG 2.1 minimum (24x24 CSS pixels, with 44x44 recommended for touch) by sizing the button itself rather than relying on a small visual marker. The selected/current page must be conveyed programmatically by the surrounding navigation group and by a visible styling difference, never by color alone, and text and marker contrast must satisfy WCAG AA (4.5:1 for text, 3:1 for non-text indicators and focus rings).

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the next focusable element, including the next nav button in the carousel nav row. |
| `Shift+Tab` | Moves focus to the previous focusable element, including the previous nav button. |
| `Enter` | Activates the focused nav button and jumps the carousel to the page identified by its value. |
| `Space` | Activates the focused nav button, matching native button behavior, including when the ARIA button slot renders the control as an anchor. |
| `Escape` | Dismisses the containing TeachingPopover when the popover surface handles dismissal, which is the expected exit path from a teaching carousel. |

**ARIA**: aria-label — supplied through altText to give the button a unique accessible name such as the page title or step number., aria-disabled — set by the root slot when the button is non-interactive, so it is skipped by assistive technology rather than silently failing., role — button semantics come from the ARIA button slot; do not override with a conflicting role on the root slot., aria-hidden — use on purely decorative artwork returned by the render function so it is not announced in addition to altText.

**Screen Reader**: Each nav button is announced as a button whose accessible name comes from altText, so a reading of the nav row sounds like an ordered list of page names or step numbers rather than repeated generic labels. Activating the button announces the newly displayed page through the carousel's live content, and the nav row's selected state is reflected by the group that owns it. Decorative content rendered through the render function (dots, images, separators) is not announced, and a disabled button is announced as dimmed or unavailable rather than disappearing from the accessibility tree.

## Styling

Style the root slot with Griffel tokens so the control participates in the theme instead of hard-coded colors. Neutral markers typically use tokens.colorNeutralBackground1 with tokens.colorNeutralStroke1 and tokens.borderRadiusCircular, hover uses tokens.colorNeutralBackground1Hover, press uses tokens.colorNeutralBackground1Pressed, and the active page uses tokens.colorBrandBackground with tokens.colorBrandForeground1. Use tokens.spacingHorizontalXS or tokens.spacingHorizontalSNudge for the gap between markers and tokens.spacingVerticalXS for vertical rhythm in a footerLayout of vertical. Keep markers compact but reachable by pairing a small visual dot with tokens.spacingVerticalS/tokens.spacingHorizontalS padding on the button, use tokens.fontSizeBase200 and tokens.fontWeightSemibold for numeric markers, and always show a visible focus indicator with tokens.colorStrokeFocus2 and tokens.strokeWidthThin or thicker. Transitions between selected states read best with tokens.curveEasyEase and tokens.durationFast, and mediaLength hints let you keep short/medium/tall markers on a consistent baseline.

## Performance

Each nav button is a lightweight component, but the cost scales with step count: a tour with dozens of pages renders dozens of focusable markers, so consider collapsing the nav for very long flows or switching to a compact marker set. Keep children render functions stable (defined outside the render body or memoized) so markers reconcile instead of remounting on every parent render. Avoid heavy DOM, images, or media elements inside the render function output unless mediaLength-backed thumbnails are genuinely needed, and prefer surface-level styling over per-frame animated markers to keep page transitions smooth inside the popover. Because the button reads its selected state from the carousel context, memoizing buttons is only effective if the context value itself is stable.

## Theming & Tokens

The component inherits its theme entirely from FluentProvider and Griffel design tokens, so it adapts automatically to light, dark, and high-contrast themes. Use tokens.colorNeutralBackground1, tokens.colorNeutralForeground1, and tokens.colorNeutralStroke1 for default markers, tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed for interaction states, and the brand ramp — tokens.colorBrandBackground, tokens.colorBrandForeground1 — for the current page so it follows the provider's brand variant. Focus styling should use tokens.colorStrokeFocus2 with tokens.strokeWidthThin or thicker, spacing should come from tokens.spacingHorizontalXS/tokens.spacingHorizontalSNudge and tokens.spacingVerticalXS, marker typography from tokens.fontSizeBase200 and tokens.fontWeightSemibold, and transitions from tokens.curveEasyEase with tokens.durationFast. Never hard-code hex values, since that breaks dark theme and Windows high-contrast where the token values are remapped.

## Migration Notes

TeachingPopoverCarouselNavButton has no v8 equivalent; it is new in Fluent UI React v9 as part of the TeachingPopover carousel. Teams migrating from v8 TeachingBubble-based tours or from hand-rolled onboarding carousels that manipulated DOM nodes imperatively should move to TeachingPopover with TeachingPopoverCarousel and drive page changes through these nav buttons and their value identifiers instead of manual class toggling. Carousel page identifiers are now data (value) rather than DOM order, so any existing index-based logic should be rewritten as value-based navigation so that reordering steps cannot desynchronize the nav row from the cards.

## Edge Cases

- First and last steps: previous-style controls on the first page and next-style controls on the last page should be disabled or hidden by the surrounding footer logic, otherwise users can click into no-op navigation.
- Mismatched values: a nav button whose value does not match any carousel card becomes an inert control, and a card with no matching button becomes unreachable from the nav row — keep the two lists generated from the same source.
- Localization: the visible marker may be a number or icon that is identical across locales, while altText is localized text; translating the flow without translating altText leaves screen reader users with stale step names.
- Very long tours: rendering one marker per page crowds the footer and can overflow a narrow popover; use the page-count element for long flows rather than adding a marker per step.
- Custom root rendering as an anchor: the accessible name must still come from altText, and any visual state conveyed by the surrounding nav group must remain understandable when the control navigates via a URL.
- Disabled states on the root slot remove the button from the tab order; if a step is merely unavailable at the moment, consider keeping the control focusable and explaining the constraint instead of disabling it.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
