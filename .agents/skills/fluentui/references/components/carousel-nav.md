# CarouselNav

> **Package**: `@fluentui/react-carousel` v9.9.8
> **Import**: `import { CarouselNav } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

CarouselNav is the pagination navigation element of the Fluent UI v9 Carousel family. It renders a root element (a div by default) that wraps a row of navigation controls, and it does not create the buttons itself: instead it accepts a required children render function that is invoked once per slide index, letting you decide whether each dot is a plain CarouselNavButton or a CarouselNavImageButton with a thumbnail image. Because the children prop is a NavButtonRenderFunction rather than plain nodes, the number of rendered controls is driven by the configured slide count and each render call receives the zero-based index, which is exactly what the Default story uses to build aria-label strings such as "Carousel Nav Button 0". The appearance prop (for example "brand") lets the nav inherit a brand-colored presentation, and the root slot can be replaced so the pagination can be rendered as a different wrapping element when the surrounding layout requires it. CarouselNav is a presentational/utility component: it is meant to sit inside or alongside a Carousel so that pressing one of its buttons moves the carousel to the matching slide.

**When to use**: Use CarouselNav when users need to see where they are in a set of slides and jump directly to a specific one, which is the common case for image galleries, card decks, hero banners, and onboarding-style carousels. It is the right choice when the slide count is small enough that one control per slide is meaningful and when the current position should be visible at a glance. Prefer the previous/next CarouselButton pair when navigation is purely sequential and position awareness is not important, combine the two when both affordances help, and reach for CarouselAutoplayButton when the carousel advances on a timer. Omit CarouselNav entirely for single-slide carousels or for carousels where direct jumping would be disorienting, and use CarouselNavContainer when you need the nav positioned together with the prev/next buttons in a predictable layout.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `NavButtonRenderFunction` | — | Yes | — |

### Prop Guidance

- **children**: Required. A render function invoked once per slide index, returning the control for that position. Use the index argument to build the accessible label and to differentiate styling between the dot and thumbnail variants. Keep the returned element a single lightweight button, either CarouselNavButton for dot/number pagination or CarouselNavImageButton when a thumbnail is needed. `index => <CarouselNavButton aria-label={`Carousel Nav Button ${index}`} />`
- **totalSlides**: Drives how many times the children render function is called, and therefore how many pagination controls appear. Set it to the exact number of slides in the carousel so the nav never shows a control for a slide that does not exist. `totalSlides={5}`
- **appearance**: Controls the visual emphasis of the pagination controls. Use the default neutral appearance for ordinary content carousels and the brand appearance when the nav sits on or next to brand-colored surfaces and should match the carousel's emphasis. `appearance="brand"`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | The element wrapping the carousel pagination. By default, this is a div. |

## Examples

### Default

```tsx
import { CarouselNav, CarouselNavImageButton, CarouselNavButton } from '@fluentui/react-components';
import { Field, makeStyles, Switch, tokens } from '@fluentui/react-components';
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  const classes = useClasses();
  const [useImageButtons, setUseImageButtons] = React.useState(false);

  return (
    <div className={classes.container}>
      <div className={classes.controls}>
        <Field
          className={classes.sliderField}
          label={
            <>
              Use <code>CarouselNavImageButton</code>
            </>
          }
          orientation="horizontal"
        >
          <Switch checked={useImageButtons} onChange={(_, data) => setUseImageButtons(data.checked)} />
        </Field>
      </div>
      <div className={classes.card}>
        <CarouselNav totalSlides={5} appearance="brand">
          {index =>
            useImageButtons ? (
              <CarouselNavImageButton image={{ src: SWAP_IMAGE }} aria-label={`Carousel Nav Button ${index}`} />
            ) : (
              <CarouselNavButton aria-label={`Carousel Nav Button ${index}`} />
            )
          }
        </CarouselNav>
      </div>
    </div>
  );
};
```

## Best Practices

### Do's

- Always give every rendered button a distinct, human-meaningful aria-label that includes the slide index or slide name, exactly as the Default story does with aria-label={`Carousel Nav Button ${index}`}.
- Render CarouselNavButton for text/dot pagination and switch to CarouselNavImageButton only when a thumbnail genuinely helps users recognize the target slide.
- Keep the totalSlides value you pass in sync with the number of slides actually rendered by CarouselSlider so that the render function produces one control per real slide.
- Use the appearance prop consistently with the Carousel it belongs to, so a brand-colored carousel gets a brand-colored nav.
- Pair CarouselNav with CarouselNavContainer when the carousel also has previous/next controls, so the nav and buttons share a single, stable layout region.
- Keep the returned button as light as possible — a dot, an index, or a small thumbnail — because the render function runs once per slide.

### Don'ts

- Don't render CarouselNav with more or fewer buttons than there are slides, or users will land on nonexistent or duplicated slides.
- Don't leave the generated buttons unlabeled; icon-only or dot-only buttons without aria-label are announced as anonymous buttons by screen readers.
- Don't put dense interactive content (links, menus, form fields) inside a nav button — the control's only job is to select a slide.
- Don't use CarouselNavImageButton with large full-resolution images; thumbnails should be small, since every button may fetch its own image source.
- Don't rely on color alone to indicate the currently selected slide; make sure the active state is perceivable in more than one way.
- Don't place CarouselNav far away from the carousel it controls without an accessible association, because the visual relationship is lost.

## Anti-Patterns

### Unlabeled pagination buttons

❌ Because CarouselNav renders whatever the render function returns, it is easy to render bare dots or icon-only buttons with no accessible name. Screen reader users then hear a run of identical "button" announcements and cannot tell which slide each control selects.

✅ Pass an aria-label to every CarouselNavButton and CarouselNavImageButton, derived from the index or the slide name, as demonstrated in the Default story with a template string that interpolates the index.

### Slide count out of sync with the nav

❌ Hard-coding totalSlides to a stale value, or deriving the nav from a different source than the slides themselves, produces extra controls that jump nowhere or missing controls that make some slides unreachable.

✅ Derive both the slide list and the nav from the same collection (for example the length of the slides array) and update them together whenever slides are added, removed, or filtered.

### Heavy content inside nav buttons

❌ The children render function runs once per slide, so embedding large images, rich text, or nested interactive elements multiplies rendering cost and network requests by the slide count, and nested focusable elements break the button interaction model.

✅ Keep each nav button to a dot, an index, or a small thumbnail. If progress text is needed, render it outside CarouselNav and keep the buttons themselves minimal.

### Thumbnail pagination for large slide sets

❌ CarouselNavImageButton renders an image per control, so a carousel with dozens of slides issues dozens of image requests and produces a visually dense, hard-to-scan nav.

✅ Reserve image buttons for small galleries where thumbnails aid recognition; otherwise use CarouselNavButton dots and rely on CarouselButton / CarouselAutoplayButton for traversal.

## Accessibility

**Requirements**: The component itself renders a plain wrapper element, so most accessibility responsibility sits with the render function you supply. Every button produced by the children render function must have an accessible name (aria-label is the pattern shown in the Default story), must be reachable by keyboard, and must remain usable at 200% zoom and in high-contrast/forced-colors modes. Target size should be large enough to activate reliably (aim for a comfortable hit area around the rendered dot or thumbnail), and the visual state of the currently displayed slide must not be communicated by color alone. If the carousel auto-advances, the nav must remain operable and the carousel must be pausable — CarouselAutoplayButton exists for that purpose.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the carousel nav and then forward through each rendered CarouselNavButton / CarouselNavImageButton in DOM order. |
| `Shift+Tab` | Moves focus backwards through the nav buttons or out of the nav, back to the previous focusable element in the carousel. |
| `Enter` | Activates the focused nav button and moves the carousel to the slide represented by that button. |
| `Space` | Activates the focused nav button, equivalent to Enter, since the rendered controls are native button elements. |

**ARIA**: aria-label (required on each CarouselNavButton and CarouselNavImageButton produced by the children render function)

**Screen Reader**: CarouselNav contributes no ARIA attributes of its own — the root slot is a bare div wrapping the pagination controls. Screen reader users therefore experience the nav as a sequence of native buttons, each announced with whatever accessible name you provide; without aria-label they hear only "button", which makes the nav unusable. Because the controls are real buttons, activation works with the standard button interaction model, and the label should describe the destination (for example "Carousel Nav Button 2") so users can tell the buttons apart. If thumbnails are used, the image inside the button should be decorative and not add a second, conflicting announcement inside the button's accessible name.

## Styling

CarouselNav exposes only a root slot, so styling is done with makeStyles and targeted at your own wrapper classes or the rendered buttons. Lay the pagination out with Griffel spacing tokens such as tokens.spacingHorizontalS and tokens.spacingVerticalS for gaps, and tune hit areas with a larger padding plus tokens.borderRadiusCircular so dot-style buttons stay round. Neutral presentation typically uses tokens.colorNeutralBackground1 with tokens.colorNeutralStroke1 borders and tokens.colorNeutralForeground2 for the dot fill, swapping to tokens.colorNeutralBackground1Hover and tokens.colorNeutralStroke1Hover on hover; a brand nav leans on tokens.colorBrandBackground, tokens.colorBrandForeground1 and tokens.colorBrandStroke1. Keep focus highly visible with tokens.colorStrokeFocus2 for the focus outline, and use tokens.fontSizeBase200 if you render index numbers instead of dots. If you need the wrapper itself to be a different element (for example a nav or a list), replace the root slot rather than nesting an extra element, and let the same spacing tokens control its padding and alignment.

## Performance

CarouselNav calls the children render function once per slide, so the cost of the nav scales directly with the slide count. Keep the function cheap: avoid allocating heavy objects, performing lookups over large collections, or instantiating expensive components inside it. Switching from dots to CarouselNavImageButton multiplies the cost because each control loads an image, so prefer dots for long carousels and thumbnail variants only for short, curated sets. Because the nav sits inside the carousel it should not be memoized away from the carousel's index state; instead, keep the surrounding slide content lean so index changes only re-render the small nav buttons rather than the full slide tree.

## Theming & Tokens

CarouselNav inherits FluentProvider theme context, so its colors follow the active theme (web light, web dark, teams light/dark, high contrast) without any extra wiring. The brand appearance resolves to brand ramp tokens such as tokens.colorBrandBackground, tokens.colorBrandBackgroundHover, tokens.colorBrandForeground1 and tokens.colorBrandStroke1, while the default appearance resolves to neutral tokens such as tokens.colorNeutralBackground1, tokens.colorNeutralBackground1Hover, tokens.colorNeutralStroke1 and tokens.colorNeutralForeground2. Focus indication should use tokens.colorStrokeFocus2 so it stays visible in forced-colors and high-contrast themes, and spacing/radius should come from tokens.spacingHorizontalS, tokens.spacingVerticalS and tokens.borderRadiusCircular rather than hard-coded pixel values so the nav scales with the theme's density and typography settings.

## Migration Notes

CarouselNav has no equivalent in Fluent UI v8 — the Carousel component family is new in v9, so there is no legacy prop-by-prop migration path. Teams that adopted the standalone @fluentui/react-carousel preview package should move their imports to @fluentui/react-components, where CarouselNav, CarouselNavButton, and CarouselNavImageButton are exported together. Note that the v9 API is render-function based (the children prop is a NavButtonRenderFunction receiving the slide index) rather than a data-array or count prop, so any wrapper code that previously passed an array of buttons must be rewritten to return a single button per index.

## Edge Cases

- Setting a totalSlides value that does not match the real slide count either creates dead pagination controls or hides slides that users can never reach.
- CarouselNavImageButton requires an image source for every rendered control; a missing or broken source leaves a blank but still focusable button, so provide a fallback and always keep an aria-label on the control.
- The Default story renders CarouselNav with an explicit totalSlides outside of a full carousel layout, which is useful for previewing pagination styling but not representative of production placement, where the nav is normally positioned relative to CarouselViewport and CarouselSlider.
- With very large slide counts the pagination row can overflow its container; the root div does not wrap or scroll on its own, so constrain the slide count or style the root slot to handle overflow.
- Because the nav relies on a render function rather than declarative children, conditional logic inside the function runs for every index — a throw or expensive computation there affects the whole nav, not just one button.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
