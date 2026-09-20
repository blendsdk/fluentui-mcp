# TeachingPopover

> **Package**: `@fluentui/react-teaching-popover` v9.7.0
> **Import**: `import { TeachingPopover } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

TeachingPopover is a messaging overlay from the Fluent UI React v9 overlays family designed specifically for teaching and onboarding moments. It combines the positioning behavior of Popover with a prescriptive, opinionated internal structure: a trigger (TeachingPopoverTrigger), an elevated surface (TeachingPopoverSurface), a header (TeachingPopoverHeader), a body (TeachingPopoverBody) with an optional media area and title (TeachingPopoverTitle), and a footer (TeachingPopoverFooter) for the primary and secondary actions. When the guidance spans multiple messages, the TeachingPopoverCarousel, TeachingPopoverCarouselCard, TeachingPopoverCarouselFooter, TeachingPopoverCarouselNav, TeachingPopoverCarouselNavButton, and TeachingPopoverCarouselPageCount subcomponents turn the surface into a step-by-step walkthrough with next/previous navigation, dot or page-count indicators, and first/last step labels supplied through initialStepText and finalStepText. An optional appearance value of "brand" (shown in the AppearanceBrand and CarouselBrand stories) switches the surface to brand-forward styling so the tip reads as an intentional feature announcement rather than a neutral popup. Because teaching content is transient and dismissible, the header also accepts an optional dismissButton slot and an icon slot, letting you control exactly how the user acknowledges or closes the message.

**When to use**: Use TeachingPopover when you need to proactively educate users about a feature, a new capability, or a changed workflow — a first-run coach mark, a 'what's new' callout, or a short multi-step onboarding tour that is anchored to the control it describes. It is the right choice when the message benefits from a media area, a title, and a primary/secondary action pair, and when the content may need to be broken into ordered steps via the carousel. Do not use TeachingPopover for generic rich content attached to an arbitrary trigger (use Popover), for hover/focus hints that need no structure (use Tooltip), for messages that must block the flow until acknowledged or that require input (use Dialog), or for persistent status communication such as errors and warnings (use MessageBar and its subcomponents). It is also not the correct component for inline, non-overlay guidance inside a form field — use InfoLabel or Field for that.

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

- **appearance**: Selects the visual treatment of the teaching surface. The default neutral treatment is best for quiet, utility-style tips; the brand treatment (used by the AppearanceBrand and CarouselBrand stories) makes the message read as an official product announcement and pulls in brand-family theme tokens. Choose one treatment per tour and keep it consistent across every step. `brand`
- **mediaLength**: Controls the reserved height of the media region in the body so that steps with and without imagery, or with differently shaped imagery, do not shift the popover size as the user advances. Pick a single value for the whole carousel rather than varying it per card. `medium`
- **value**: Identifies an individual carousel step. Each TeachingPopoverCarouselCard should have a unique value, and the carousel's own initial value must match one of them so a starting step can be resolved. Values in the stories are strings, so keep the type consistent between the card and the carousel to avoid a mismatch where no step renders. `2`
- **navType**: Marks a custom navigation control as the forward or backward affordance, letting the carousel wire the correct step transition for that button. Use it when you replace the built-in footer next/previous buttons with your own controls; the standard footer buttons already carry this role internally. `next`
- **altText**: Supplies the accessible name for a navigation control that has no visible text, such as a dot or an arrow-only button. Provide text that identifies the destination step rather than the control's shape, so the user understands where the action leads. `Next tip`
- **layout**: Selects the arrangement variant of the carousel footer. Use it when the default footer composition does not fit your content — for example when the step text and navigation indicators need to stack rather than sit side by side. Apply one layout at the carousel level so all steps render identically. `TeachingPopoverCarouselFooterLayout value`
- **footerLayout**: Sets the overall footer arrangement to horizontal or vertical. Horizontal keeps actions on one row for short labels; switch to vertical when actions are long, when the popover is narrow, or when you need to stack the navigation indicators above the action buttons. `vertical`
- **initialStepText**: Overrides the label shown on the first step of the carousel so users understand that this action exits the tour rather than continuing it. Keep it short and action-oriented. `Close`
- **finalStepText**: Overrides the label shown on the last step of the carousel, typically the completion action. Use a verb that reflects what finishing actually does, such as confirming the user has understood the feature. `Finish`
- **root**: The root slot lets you change the underlying element and its props for the subcomponents that expose it. On the header this defaults to a heading element and also accepts h1 through h6, which matters for heading order in the page; on the body, title, and page count it is a div. Override it when you need a different heading level or need to attach refs, ids, or class names. `h2`
- **children**: On the carousel navigation and page count subcomponents, children is a render function rather than static content. The nav render function receives the step index so you can build one indicator per step, and the page count render function receives the current index and the total page count so you can format a label such as '2 of 3'. Always memoize or hoist these functions, and always give the generated nav buttons an accessible name. `(currentIndex, totalPages)`
- **handleButtonClick**: The click handler the carousel provides to navigation buttons so a step change is committed. If you render custom navigation controls, you must forward your click events into this handler; a control that only updates local state will leave the carousel on the wrong step. `(event)`
- **dismissButton**: A slot for the close affordance rendered in the header. Provide it whenever your design shows an explicit close control; the header will not render one on its own, and without it users rely on Escape or clicking outside. Give the button an accessible name if it contains only an icon. `button`
- **icon**: A slot for a leading icon in the header, useful for visually categorizing the tip (a lightbulb for a tip, a sparkle for a new feature). Keep it decorative and ensure the surrounding text still communicates the message without it. `div`

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Button, Image } from '@fluentui/react-components';

export const Default = (): JSXElement => (
  <TeachingPopover>
    <TeachingPopoverTrigger>
      <Button>TeachingPopover trigger</Button>
    </TeachingPopoverTrigger>
    <TeachingPopoverSurface>
      <TeachingPopoverHeader>Tips</TeachingPopoverHeader>
      <TeachingPopoverBody media={<Image alt="test image" fit="cover" src={swapImage} />}>
        <TeachingPopoverTitle>Teaching Bubble Title</TeachingPopoverTitle>
        <div>This is a teaching popover body</div>
      </TeachingPopoverBody>
      <TeachingPopoverFooter primary="Learn more" secondary="Got it" />
    </TeachingPopoverSurface>
  </TeachingPopover>
);
```

### AppearanceBrand

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Button, Image } from '@fluentui/react-components';

export const AppearanceBrand = (): JSXElement => (
  <TeachingPopover appearance="brand">
    <TeachingPopoverTrigger>
      <Button>TeachingPopover trigger</Button>
    </TeachingPopoverTrigger>
    <TeachingPopoverSurface>
      <TeachingPopoverHeader>Tips</TeachingPopoverHeader>
      <TeachingPopoverBody media={<Image alt="test image" fit="cover" src={swapImage} />}>
        <TeachingPopoverTitle>Teaching Bubble Title</TeachingPopoverTitle>
        <div>This is a teaching popover body</div>
      </TeachingPopoverBody>
      <TeachingPopoverFooter primary="Learn more" secondary="Got it" />
    </TeachingPopoverSurface>
  </TeachingPopover>
);
```

### Carousel

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Button, Image } from '@fluentui/react-components';

export const Carousel = (): JSXElement => (
  <TeachingPopover>
    <TeachingPopoverTrigger>
      <Button>TeachingPopover trigger</Button>
    </TeachingPopoverTrigger>
    <TeachingPopoverSurface>
      <TeachingPopoverHeader>Tips</TeachingPopoverHeader>
      <TeachingPopoverCarousel defaultValue={'1'} announcement={getAnnouncement}>
        <TeachingPopoverCarouselCard value="1">
          <TeachingPopoverBody media={<Image alt="test image" fit="cover" src={swapImage} />}>
            <TeachingPopoverTitle>Teaching Bubble Title</TeachingPopoverTitle>
            <div>This is page: 1</div>
          </TeachingPopoverBody>
        </TeachingPopoverCarouselCard>

        <TeachingPopoverCarouselCard value="2">
          <TeachingPopoverBody media={<Image alt="test image" fit="cover" src={swapImage} />}>
            <TeachingPopoverTitle>Teaching Bubble Title</TeachingPopoverTitle>
            <div>This is page: 2</div>
          </TeachingPopoverBody>
        </TeachingPopoverCarouselCard>

        <TeachingPopoverCarouselCard value="3">
          <TeachingPopoverBody media={<Image alt="test image" fit="cover" src={swapImage} />}>
            <TeachingPopoverTitle>Teaching Bubble Title</TeachingPopoverTitle>
            <div>This is page: 3</div>
          </TeachingPopoverBody>
        </TeachingPopoverCarouselCard>

        <TeachingPopoverCarouselFooter next="Next" previous="Previous" initialStepText="Close" finalStepText="Finish">
          <TeachingPopoverCarouselNav>
            {index => <TeachingPopoverCarouselNavButton aria-label={`Tip ${index}`} />}
          </TeachingPopoverCarouselNav>
        </TeachingPopoverCarouselFooter>
      </TeachingPopoverCarousel>
    </TeachingPopoverSurface>
  </TeachingPopover>
);
```

## Best Practices

### Do's

- Give every TeachingPopoverBody a TeachingPopoverTitle so the tip has a scannable heading, and use TeachingPopoverHeader text ('Tips', 'What's new') to frame the whole message.
- Keep each step to a single idea and one sentence wherever possible; if you need more than two short paragraphs, split the content across additional TeachingPopoverCarouselCard steps instead of scrolling a single surface.
- Anchor the popover to the element being taught by wrapping that exact control in TeachingPopoverTrigger, so the overlay points at the feature rather than at an arbitrary button.
- When rendering dot-style navigation through the TeachingPopoverCarouselNav render function, pass a descriptive aria-label to each TeachingPopoverCarouselNavButton, as the Carousel story does with a per-index label.
- Set initialStepText and finalStepText to meaningful first/last actions ('Close', 'Finish') so the exit semantics of the first and last steps are unambiguous.
- Provide meaningful alt text on any Image placed in the body's media area, and use mediaLength to reserve a consistent height so steps do not jump in size.
- Use appearance set to "brand" for feature announcements that should carry product identity, and the default appearance for quieter, utility-style tips.
- Ensure every carousel step is reachable and readable with the keyboard alone, and confirm the surface is dismissible with Escape as well as any custom dismissButton you add.

### Don'ts

- Do not use TeachingPopover for blocking confirmations, destructive-action warnings, or anything that must be acknowledged before work continues — that is Dialog territory.
- Do not stack a Tooltip, Menu, or another Popover on the same trigger element as a TeachingPopover; the overlay layers will compete for focus and pointer events.
- Do not render carousel navigation dots or page count indicators without an accessible name; a bare TeachingPopoverCarouselNavButton produced by the nav render function carries no visible text.
- Do not duplicate the same value across multiple TeachingPopoverCarouselCard steps — the carousel resolves the active step by value and duplicated values produce ambiguous selection.
- Do not dump long-form documentation or multi-field forms into the body; the surface is intentionally narrow and is meant for glanceable copy.
- Do not re-show the same teaching popover on every page load or after every dismiss; users who have learned the feature will find it obstructive.
- Do not rely on the brand appearance alone to convey meaning or status — never let color be the only signal of 'new' or 'important'.
- Do not omit the dismissButton slot if your design shows a close affordance in the header; the header will not synthesize one for you.

## Anti-Patterns

### Using TeachingPopover as a general-purpose popover

❌ TeachingPopover imposes a teaching structure — header, title, media, footer actions, optional step tour — that is heavier than most overlay content needs. Using it for a generic menu, a detail preview, or a form inside a popover produces awkward spacing, oversized chrome, and an odd reading order.

✅ Reach for Popover when you need arbitrary anchored content, Tooltip for passive hover and focus hints, and Menu when the overlay is a list of commands. Reserve TeachingPopover for moments where the product is actively explaining itself.

### Unlabeled carousel navigation dots

❌ The nav render function produces buttons with no text, so a screen reader announces a series of indistinguishable 'button' elements and keyboard users cannot tell which step they will land on.

✅ Pass a descriptive aria-label to every generated nav button that includes its position in the tour, and render the same information visually through TeachingPopoverCarouselPageCount when the step count is large.

### Custom navigation that bypasses the carousel's click handler

❌ When you replace the built-in next/previous controls with your own buttons and forget to route clicks through the handler the carousel supplies, the UI appears to move but the carousel's active step never changes — the highlight, the page count, and the announcements all drift out of sync.

✅ Always invoke the supplied click handler from your custom control, and let the carousel own the active step rather than keeping a parallel index in your own state.

### Cramming the entire tour into one step

❌ A single surface with several paragraphs, a large image, and three actions is hard to scan, forces the popover to grow beyond its intended footprint, and buries the call to action.

✅ Split the message into one idea per TeachingPopoverCarouselCard, keep copy short, and use the carousel footer's first and last step labels to make entry and exit obvious.

### Recreating render functions on every render

❌ Inline children render functions for the carousel nav and page count create a new function identity on each parent render, causing the indicator row to tear down and rebuild, which is wasteful inside an already animated overlay.

✅ Hoist the render functions to module scope or memoize them, and keep the step data they close over stable.

## Accessibility

**Requirements**: The trigger element must be a real focusable control (the stories use Button) so the popover can be opened from the keyboard. Every interactive element inside the surface — the footer actions, the header dismissButton, the carousel nav buttons — must be reachable by Tab and operable without a pointer. The popover content should be identifiable: give the header text and the title meaningful wording, and label icon-only controls (the carousel nav buttons in particular) with aria-label. Carousel steps that update in place should be announced politely — the Carousel story passes an announcement callback to TeachingPopoverCarousel, which routes through the AriaLiveAnnouncer so step changes are spoken rather than silently re-rendered. Media images require accurate alt text. Brand appearance colors must still meet WCAG contrast requirements against the surface background; verify tokens.colorBrandBackground and its foreground pairing in each theme.

| Key | Action |
| --- | --- |
| `Enter` | Activates the focused trigger to open the teaching popover, and activates footer, header dismiss, and carousel nav buttons while the surface is open. |
| `Space` | Activates the focused trigger or the focused button inside the surface, equivalent to Enter for native buttons. |
| `Tab` | Moves focus forward through the surface — header dismiss button, body content, footer primary and secondary actions, and any carousel navigation controls. |
| `Shift+Tab` | Moves focus backward through the same set of interactive elements, returning to the trigger when the surface is exited. |
| `Escape` | Dismisses the open teaching popover without activating any action, returning focus to the trigger. |

**ARIA**: aria-label, aria-expanded, aria-haspopup, aria-controls, aria-live (via the carousel announcement/AriaLiveAnnouncer)

**Screen Reader**: The trigger is announced as a button with an expanded/collapsed state, so assistive technology users know an overlay is available. When the surface opens, screen reader users move into the dialog-like content and read the header text, the TeachingPopoverTitle, the body copy, and the footer actions in document order. Icon-only carousel nav buttons are announced using their aria-label, which is why the nav render function must supply one — without it the user hears an unlabeled 'button'. When the carousel advances, the announcement callback drives a polite live-region message describing the new step, so the change is not silent. A dismissButton in the header is announced as a normal button; if it is absent, the only exit cues are Escape and outside click, which should be communicated in the surrounding help text.

## Styling

The surface is themed through the component's own styles; reach for semantic tokens rather than hard-coded colors when you extend it. Use tokens.colorNeutralBackground1 for the default surface, tokens.colorNeutralForeground1 for body copy, tokens.colorNeutralForeground2 for the header, and tokens.colorNeutralStroke1 plus tokens.shadow16 for the border and elevation. With appearance set to "brand", the surface switches to brand-family tokens such as tokens.colorBrandBackground and tokens.colorBrandForeground1, with tokens.colorBrandStroke1 for the outline — if you override those slots, keep foreground/background pairs from the same brand ramp. Spacing inside the body, header, and footer should use tokens.spacingVerticalM, tokens.spacingVerticalL, tokens.spacingHorizontalM, and tokens.spacingHorizontalL so the popover breathes consistently with other Fluent surfaces. Use tokens.borderRadiusMedium for the surface radius and tokens.fontSizeBase300 / tokens.fontWeightSemibold for the title so it matches other v9 headings. Adjust the media block height through mediaLength rather than through ad-hoc CSS, and lay out the footer with footerLayout's horizontal and vertical options instead of overriding flex direction in a style rule. Because the popover is portaled and positioned, avoid applying margins to the surface itself; position offsets belong to the popover's positioning configuration.

## Performance

A TeachingPopover keeps an overlay surface alive for its trigger, so prefer one teaching popover per feature being explained rather than one per nearby element. In the carousel form, every TeachingPopoverCarouselCard is part of the carousel's child set, so a long tour increases both render cost and DOM size — keep tours to a handful of steps and split larger content into separate, deliberately triggered popovers. The media region is the most expensive element per step; use appropriately sized, compressed images and rely on the Image component's fit handling rather than shipping oversized assets. Because the nav and page count subcomponents take render functions as children, hoisting or memoizing those functions avoids re-creating indicators on unrelated re-renders. Defer any data the body needs until the surface is actually opened so the cost of the content is not paid on initial page load.

## Theming & Tokens

TeachingPopover is fully driven by the FluentProvider theme and Griffel design tokens, so it honors light, dark, and high-contrast themes without component-specific configuration. In the default appearance the surface uses neutral tokens such as tokens.colorNeutralBackground1, tokens.colorNeutralForeground1, tokens.colorNeutralForeground2, tokens.colorNeutralStroke1, and tokens.shadow16 for elevation. The brand appearance maps the same slots onto brand-family tokens, chiefly tokens.colorBrandBackground, tokens.colorBrandForeground1, and tokens.colorBrandStroke1, which are generated from the theme's brand ramp — changing the brand ramp in your theme automatically restyles every branded teaching popover. Typography pulls from tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.fontSizeBase400 for the title, and tokens.fontWeightSemibold, while spacing uses tokens.spacingHorizontalM, tokens.spacingHorizontalL, tokens.spacingVerticalM, and tokens.spacingVerticalL, and the corner radius uses tokens.borderRadiusMedium. Media and footer sizing are communicated through mediaLength and footerLayout, which resolve to theme spacing values rather than fixed pixels.

## Migration Notes

TeachingPopover is new in Fluent UI React v9 and has no v8 equivalent as a single component; teams migrating from the older teaching bubble and coach mark patterns must rebuild them from this composed API. The compositional model differs from v8-style single components: instead of passing title, body, media, and button text as props on one element, you compose TeachingPopoverSurface with TeachingPopoverHeader, TeachingPopoverBody (which carries the media and hosts TeachingPopoverTitle), TeachingPopoverFooter, and the optional carousel subcomponents. Multi-step tours that were previously hand-built with multiple bubbles and external index state should be expressed as TeachingPopoverCarousel with one TeachingPopoverCarouselCard per step, using the card value and the carousel's initial value to control the active step. Styling overrides that used v8 theme palettes should be rewritten against v9 Griffel tokens, and appearance set to "brand" replaces the old custom brand-styling classes.

## Edge Cases

- The carousel resolves its initially visible step from the value you pass to it, so if no TeachingPopoverCarouselCard carries a matching value, the surface can open showing nothing; keep the carousel's initial value and the card values in the same type and always include a matching card.
- The header renders no close affordance unless you supply the dismissButton slot — without it the only exits are Escape and clicking outside, which is easy to miss in an onboarding context.
- initialStepText and finalStepText only apply to the first and last steps; intermediate steps fall back to the standard previous/next labels, so do not assume a single label prop controls the whole tour.
- Media blocks with different intrinsic aspect ratios will change the surface size between steps unless a single mediaLength value is used and the images are supplied at consistent proportions.
- Icon-only controls in the header and in the carousel navigation have no visible label, so a missing aria-label leaves the control unnamed for assistive technology.
- Custom navigation controls must forward their clicks to the handler the carousel supplies; otherwise the step indicator and the displayed card diverge.
- Because the popover is positioned against its trigger and can be portaled, very long body content may be constrained by the viewport edge; keep steps short rather than fighting the positioning.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
