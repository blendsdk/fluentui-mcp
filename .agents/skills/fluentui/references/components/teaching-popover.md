# TeachingPopover

> **Package**: `@fluentui/react-teaching-popover` v9.7.0
> **Import**: `import { TeachingPopover } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

TeachingPopover is a Fluent UI React v9 overlay component purpose-built for onboarding, coaching-mark, and feature-education experiences. It anchors a teaching surface to a trigger element and is composed from a family of subcomponents: TeachingPopoverTrigger, TeachingPopoverSurface, TeachingPopoverHeader, TeachingPopoverBody, TeachingPopoverTitle, TeachingPopoverFooter, plus a carousel set — TeachingPopoverCarousel, TeachingPopoverCarouselCard, TeachingPopoverCarouselNav, TeachingPopoverCarouselNavButton, TeachingPopoverCarouselPageCount, and TeachingPopoverCarouselFooter. A single-step popover presents a header label, optional media, a title, body content, and a footer with primary and secondary actions (for example primary "Learn more" and secondary "Got it"). For multi-step walkthroughs, TeachingPopoverCarousel wraps several TeachingPopoverCarouselCard children, each identified by a unique value, and drives navigation through next and previous controls, dismiss-style initialStepText and completion-style finalStepText labels, an optional page-count render function, and an announcement callback for assistive technology. An appearance="brand" variant is available for branded, marketing-flavored guidance surfaces.

**When to use**: Use TeachingPopover when the goal is to teach, introduce, or nudge — first-run tours, new-feature callouts, coaching marks attached to a specific trigger, and multi-step walkthroughs that must be acknowledged before the user moves on. Reach for it instead of Tooltip because Tooltip content is supplementary and must not require action, and instead of a plain Popover when you need the packaged teaching chrome (header, media, title, footer action pair, carousel). Prefer Dialog or Drawer when the guidance is blocking, needs a full-screen modal commitment, or contains forms and long-form content. Prefer Popover for lightweight, non-teaching content such as filters, quick pickers, or contextual detail. Use TeachingPopoverCarousel only when the story genuinely has sequential steps; a single TeachingPopoverBody with one clear action is often a better experience than a forced carousel.

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

- **appearance**: Set to brand for branded, marketing-style guidance surfaces; omit it for in-product tips that should match the neutral surface. It changes the surface and accent colors without altering behavior. `brand`
- **mediaLength**: Use on the teaching body to fix the height class of the media area so illustrations are consistent across single-step and carousel content. Choose short for banner-like imagery, medium for balanced blocks, and tall for portrait art. `medium`
- **value**: Required identifier on each TeachingPopoverCarouselCard; the carousel uses it to track which card is active (defaultValue selects the starting one). Every card must use a distinct value. `1`
- **defaultValue**: Uncontrolled starting point for the carousel, matching the value of the card that should be shown first. Use it for simple tours that do not need controlled state. `1`
- **announcement**: Callback used by the carousel to produce the text pushed to assistive technology whenever the visible card changes. Provide it so page changes are announced, not just rendered. `Page 2 of 3: Teaching Bubble Title`
- **navType**: Marks whether a carousel navigation control advances or retreats the carousel; it is next for forward controls and prev for backward controls. The carousel supplies this to navigation buttons rendered through the nav render function. `next`
- **altText**: Required accessible text for a carousel navigation control, supplied by the carousel for the generated nav buttons; combine it with a visible or aria-label name so the control is identifiable. `Tip 2`
- **layout**: Selects the arrangement of the carousel footer's content (the carousel footer layout). Leave the default for the standard left-to-right arrangement of nav controls, page count, and actions. `default`
- **footerLayout**: Sets whether the carousel footer stacks its children horizontally or vertically. Use vertical when horizontal space is tight or labels are long, and horizontal for the default compact row. `horizontal`
- **initialStepText**: Label shown on the navigation control at the first step, so the backward action reads as an exit (for example "Close") rather than as a disabled "Previous". `Close`
- **finalStepText**: Label shown on the navigation control at the last step so advancing reads as completion (for example "Finish") rather than as "Next". `Finish`
- **next**: Text for the carousel footer's forward control, shown on every step other than the last. `Next`
- **previous**: Text for the carousel footer's backward control, shown on every step other than the first (where initialStepText takes over). `Previous`
- **primary**: Label for the main footer action on a single-step teaching popover, used for the emphasized next step such as opening a page or starting a tour. `Learn more`
- **secondary**: Label for the quieter footer action, typically an acknowledgement that dismisses the teaching surface. `Got it`
- **handleButtonClick**: Click handler applied to the carousel's navigation buttons; the carousel wires it up, and it can be overridden when rendering a custom navigation button through the nav render function. `custom next/previous handler`
- **dismissButton**: Slot on the teaching header for the close control. Provide it when the surface should be dismissible from the header in addition to any footer acknowledgement. `button element with an accessible name`
- **icon**: Decorative icon slot rendered alongside the header content, useful for a small glyph that reinforces the tip's meaning. Icons are supporting, not the primary carrier of meaning. `info or lightbulb glyph`
- **root**: Root slot on each subcomponent, accepting the underlying element or an override. TeachingPopoverHeader's root renders a div that can become any heading level from h1 through h6, so choose a level that fits the document outline; the carousel nav's root accepts an anchor-capable button slot; the body's root is a div. `h3`
- **children (carousel nav render function)**: TeachingPopoverCarouselNav takes a render function that receives the card index and returns a navigation button, letting you attach a per-dot accessible name while the carousel supplies value, navType, and altText. `index => nav button labeled "Tip 1"`
- **children (page count render function)**: TeachingPopoverCarouselPageCount takes a render function receiving the current index and total page count, so you control the wording of the progress indicator. `3 of 3`

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

- Pair a short TeachingPopoverTitle with one or two sentences of body content, then give the user a clear way forward through TeachingPopoverFooter primary and secondary labels.
- Always supply both footer actions so users can choose between continuing (primary, for example "Learn more") and acknowledging or dismissing (secondary, for example "Got it").
- Set the carousel's initialStepText and finalStepText (for example "Close" and "Finish") so the first and last steps read as distinct, meaningful actions rather than generic navigation.
- Give every TeachingPopoverCarouselNavButton a unique accessible name via aria-label, such as "Tip 1", "Tip 2", "Tip 3", because the nav renders a dot per card with no visible text.
- Provide meaningful alt text on any image passed to the media slot of TeachingPopoverBody — media is supporting illustration, never the only carrier of the message.
- Pass an announcement callback to TeachingPopoverCarousel so page changes are announced to screen reader users instead of only changing visually.
- Keep carousel tours short — the documented examples use three cards — and make each card self-contained with its own title and body.
- Use appearance="brand" only when the guidance is intentionally branded; keep the default appearance for in-product tips that should blend into the surrounding UI.
- Use the header's dismissButton slot for the close affordance so dismissal is consistently placed and easy to target.

### Don'ts

- Don't use TeachingPopover as a tooltip for hover-only hints — its content is instructional and expects reading and response.
- Don't render a TeachingPopoverCarouselCard without a unique value; value is how the carousel identifies each card, and duplicates make the active-card selection ambiguous.
- Don't omit initialStepText or finalStepText when using a carousel, or the first and last steps lose their completion semantics.
- Don't stuff paragraph-length copy into TeachingPopoverHeader — it renders a heading element and is meant for a short label such as "Tips".
- Don't put the carousel's dismiss or completion logic inside individual cards; keep exit and finish behavior in TeachingPopoverCarouselFooter.
- Don't stack another overlay (Dialog, Menu, or a nested Popover) on top of an open teaching surface.
- Don't rely on the brand appearance alone to communicate state or importance — brand styling is decorative, not semantic.
- Don't pass arbitrarily tall or wide imagery into the media slot and ignore mediaLength, or the body layout will jump between cards of different media sizes.

## Anti-Patterns

### Unlabeled carousel navigation dots

❌ TeachingPopoverCarouselNav renders one button per card with no visible text, so without an accessible name each dot is announced as an anonymous button and users cannot tell which step they are selecting.

✅ Return TeachingPopoverCarouselNavButton from the nav render function with a distinct aria-label per index, for example "Tip 1", "Tip 2", "Tip 3", matching the pattern used in the carousel story.

### Silent page changes in the carousel

❌ Advancing a step only swaps the visible card; screen reader users receive no signal that the content changed, especially when focus stays on the next control.

✅ Pass an announcement callback to TeachingPopoverCarousel so each step change is published to assistive technology, and use TeachingPopoverCarouselPageCount to render a readable progress string for the current index and total pages.

### Paragraph copy in the header

❌ TeachingPopoverHeader's root slot renders a heading element (h1 through h6), so long instructional text ends up inside the heading, producing a broken document outline and an unwieldy heading announcement.

✅ Keep the header to a short label such as "Tips", and move the instructional copy into TeachingPopoverBody under a TeachingPopoverTitle.

### Forcing a carousel onto single-step content

❌ Wrapping one message in TeachingPopoverCarousel adds navigation controls, multiple nav dots, and an announcement cycle for content that needs no sequencing, and it burdens the user with stepping through a tour of one.

✅ Use a plain TeachingPopover with TeachingPopoverBody and TeachingPopoverFooter primary and secondary labels for single-message guidance, and reserve TeachingPopoverCarousel for genuinely sequential tips.

### Duplicated or missing card values

❌ TeachingPopoverCarousel identifies the active card by its value, so omitting the required value or repeating one across cards makes step selection and the starting defaultValue ambiguous.

✅ Give every TeachingPopoverCarouselCard a unique value and set defaultValue to exactly one of those values, as in the documented carousel example where cards use "1", "2", and "3" and defaultValue is "1".

## Accessibility

**Requirements**: Treat TeachingPopover as a dismissible overlay: keyboard users must be able to open it from the trigger, reach every interactive control (footer actions, carousel next and previous controls, nav dots, page count, and dismiss button), and close it without a pointer. Text and icons must meet WCAG 2.1 AA contrast requirements (4.5:1 for body text, 3:1 for non-text UI), focus must remain visible on the trigger and on all in-surface controls, and media images must carry alt text. Do not auto-advance the carousel on a timer — advancing must be user-initiated — and never trap focus in a state the user cannot exit.

| Key | Action |
| --- | --- |
| `Enter` | Activates the focused trigger to open the teaching surface, and activates the focused footer action, carousel next or previous control, carousel nav button, or dismiss button. |
| `Space` | Activates the focused button control (trigger, footer action, carousel navigation, nav dot, or dismiss button) in the same way as Enter. |
| `Tab` | Moves focus forward through the trigger, then through the teaching surface's controls in DOM order: header dismiss button, body content, carousel nav buttons, page count, and footer actions. |
| `Shift+Tab` | Moves focus backward through the same control sequence, allowing users to return to the trigger or an earlier carousel control. |
| `Escape` | Dismisses the open teaching surface and returns focus to the trigger element. |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-live, aria-expanded, aria-haspopup, aria-controls, aria-disabled

**Screen Reader**: The trigger is exposed as a button that reports its expanded state, and activating it reveals the teaching surface. TeachingPopoverHeader renders a real heading element, so its text (for example "Tips") is navigable by heading commands and provides the accessible name context for the surface. Each TeachingPopoverCarouselNavButton is a button whose only accessible name comes from aria-label — without one it announces as an unlabeled button. TeachingPopoverCarouselPageCount renders text produced by a render function, so it is read as plain text and must be self-explanatory. When an announcement callback is supplied to TeachingPopoverCarousel, step changes are pushed into a live region so non-visual users learn that the visible page changed; without it, focus movement is the only cue that navigation occurred.

## Styling

Override the surface through the root slot or a className on TeachingPopoverSurface — the surface uses tokens.colorNeutralBackground1 for the default background and tokens.colorBrandBackground when appearance="brand", with tokens.colorNeutralStroke1 (or tokens.colorBrandStroke1) for the boundary and elevated depth from tokens.shadow16 (brand variants lean on tokens.colorBrandShadowAmbient). Body text should inherit tokens.colorNeutralForeground1, with supporting copy in tokens.colorNeutralForeground2, and title text using tokens.fontSizeBase400 plus tokens.fontWeightSemibold. Space the header, body, and footer with tokens.spacingVerticalM and tokens.spacingHorizontalM, and use tokens.spacingHorizontalL between the footer's primary and secondary actions. Use mediaLength to normalize the media area: short maps well to a compact banner, medium to a square-ish illustration, and tall to a portrait image, so the surface does not reflow between carousel cards. Round corners with tokens.borderRadiusXLarge on the surface and tokens.borderRadiusMedium on inner media. Animate entry with tokens.curveEasyEase and tokens.durationNormal. Brand-accented footers can use tokens.colorBrandBackground for the primary action and tokens.colorNeutralBackground2 for a quieter secondary action.

## Performance

TeachingPopover renders through an overlay layer anchored to its trigger, so keeping the open surface lightweight matters more than the trigger itself: avoid heavy media inside the media slot, and reuse one image source across carousel cards rather than loading a distinct large asset per step. The announcement prop is a function that the carousel invokes on each step change, so keep it pure and cheap — return a short string instead of doing formatting or data work inside it. The nav and page-count props are render functions called during render, so define them outside the component body or memoize them to avoid recreating subtrees on every re-render. Rendering many carousel cards at once increases the surface's DOM size; if a tour grows long, render only the current step's content rather than dozens of hidden cards. Content inside carousel cards that is not currently visible should not perform expensive side effects on mount.

## Theming & Tokens

TeachingPopover consumes Fluent v9 design tokens from the active theme, so it follows brand ramps and dark or high-contrast themes automatically. The surface background comes from tokens.colorNeutralBackground1 (tokens.colorBrandBackground for appearance="brand"), and the boundary and depth from tokens.colorNeutralStroke1, tokens.colorBrandStroke1, tokens.shadow16, and tokens.colorNeutralShadowAmbient. Text inside the header, title, and body maps to tokens.colorNeutralForeground1 and tokens.colorNeutralForeground2, with typography driven by tokens.fontFamilyBase, tokens.fontSizeBase200, tokens.fontSizeBase300, tokens.fontSizeBase400, tokens.lineHeightBase300, tokens.fontWeightRegular, tokens.fontWeightMedium, and tokens.fontWeightSemibold. Footer primary actions use brand fills from tokens.colorBrandBackground with tokens.colorBrandForeground1 labels, while secondary actions fall back to tokens.colorNeutralBackground2 and tokens.colorNeutralForeground1. Spacing and shape come from tokens.spacingVerticalS, tokens.spacingVerticalM, tokens.spacingHorizontalM, tokens.spacingHorizontalL, tokens.borderRadiusMedium, tokens.borderRadiusXLarge, and tokens.strokeWidthThin/Thick, and motion uses tokens.durationNormal with tokens.curveEasyEase. Because the carousel nav buttons are small, ensure their focus indicator still meets contrast against the surface by using tokens.colorStrokeFocus2 rather than a custom color.

## Migration Notes

TeachingPopover is a composed, slot-based v9 API rather than a single monolith: instead of configuring one component with many display props, you assemble TeachingPopoverTrigger, TeachingPopoverSurface, TeachingPopoverHeader, TeachingPopoverBody, TeachingPopoverTitle, and TeachingPopoverFooter, and the footer's actions are declared as label strings (primary and secondary) on TeachingPopoverFooter instead of as button element objects. Multi-step teaching content is expressed declaratively as TeachingPopoverCarousel containing TeachingPopoverCarouselCard children keyed by value, with navigation labels supplied through next, previous, initialStepText, and finalStepText. Brand styling is opt-in via appearance="brand" rather than through a separate component, and the close affordance is a dismissButton slot on the header rather than an implicit close control.

## Edge Cases

- When TeachingPopoverCarouselNavButton is rendered through the nav render function, value, navType, and altText are supplied by the carousel; only pass them yourself if you are building a fully custom navigation button.
- The nav render function receives the card index, and the page-count render function receives both the current index and the total page count — the page count is one-based in the documented example, rendering text such as "1 of 3".
- initialStepText and finalStepText replace the previous and next labels at the boundaries, so a carousel with a single card or a two-card tour can show "Close" and "Finish" almost immediately; keep tours long enough for that progression to make sense.
- The carousel story passes an announcement callback while the brand and text variants omit it, so page changes in those variants are visual-only and may be missed by screen reader users.
- mediaLength only controls the height class of the media area; images with unusual aspect ratios can still letterbox or crop, so pass fit="cover" style imagery that tolerates different heights.
- TeachingPopoverHeader's root can render any heading level from h1 through h6 (and a div), so an inappropriate level can conflict with the surrounding page outline if the teaching surface sits inside a section that already uses that level.
- dismissButton and icon are optional slots on the header; omitting dismissButton means the only way out of the surface is the footer action or Escape, so make sure at least one obvious exit exists.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
