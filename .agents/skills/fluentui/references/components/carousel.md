# Carousel

> **Package**: `@fluentui/react-carousel` v9.9.8
> **Import**: `import { Carousel } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

Carousel is a Fluent UI React v9 utility component that presents a sequence of cards or pages in a single, navigable viewport. It is composed of cooperating sub-components — CarouselViewport, CarouselSlider, CarouselCard, CarouselNavContainer, CarouselNav, CarouselNavButton, CarouselNavImageButton, CarouselButton and CarouselAutoplayButton — that together provide slide or fade transitions, optional drag-to-scroll, circular looping, grouped paging, adjustable alignment, and an accessibility announcer for page changes. Carousel supports both uncontrolled usage through defaultActiveIndex and fully controlled usage through activeIndex plus onActiveIndexChange, and it reports the origin of every index change (click, focus, drag, or autoplay) so hosts can log or react to user intent. Visual treatment is switchable between a minimal flat surface and an elevated, rounded, shadowed container, and the whole component inherits Fluent theming through Griffel tokens.

**When to use**: Use Carousel when a small, ordered set of visually rich, parallel items — banner images, promotional cards, onboarding pages, feature highlights, or gallery thumbnails — must be shown in a constrained horizontal space and the user benefits from browsing them one page at a time. It is a good fit for marketing surfaces, first-run experiences inside a Dialog, image slideshows with thumbnail navigation, and responsive card rows where autoSize cards reveal progressively more items as width allows. Prefer a plain Grid, List, or a scrollable row when all items are equally important and should be visible at once, when the content is text-heavy and must be searchable or indexable, or when users need to compare items side by side. Prefer Tabs when the panels are mutually exclusive views rather than a sequential set of items, and prefer a single Image or Card when only one item exists.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `activeIndex` | `number \| undefined` | — | No | The value of the currently active page. |
| `align` | `"center" \| "start" \| "end" \| undefined` | `'center'` | No | The alignment of the carousel. |
| `announcement` | `CarouselAnnouncerFunction \| undefined` | — | No | Localizes the string used to announce carousel page changes Defaults to: undefined |
| `appearance` | `CarouselAppearance \| undefined` | `'flat'` | No | Sets visual treatment for the Carousel container.  `flat` Retains the minimal styling used by default prior to introducing appearance-based styles.  `elevated` Applies rounded corners, background, and shadow tokens so the Carousel is presented as a surfaced container. |
| `autoplayInterval` | `number \| undefined` | `4000` | No | Choose a delay between autoplay transitions in milliseconds. Only active if Autoplay is enabled via CarouselAutoplayButton  Defaults: 4000 |
| `circular` | `boolean \| undefined` | `false` | No | Circular enables the carousel to loop back around on navigation past trailing index. |
| `defaultActiveIndex` | `number \| undefined` | — | No | The initial page to display in uncontrolled mode. |
| `draggable` | `boolean \| undefined` | `false` | No | Enables drag to scroll on carousel items. Defaults to: False |
| `groupSize` | `number \| "auto" \| undefined` | `'auto'` | No | Controls the number of carousel cards per navigation element, will default to 'auto' Recommended to set to '1' when using full page carousel cards. |
| `motion` | `CarouselMotion \| undefined` | `'slide'` | No | Sets motion type as either 'slide' or 'fade' Defaults: 'slide'  Users can also pass 'slide' & duration via CarouselMotion object to control carousel speed. Drag interactions are not affected because duration is then determined by the drag force.  Note: Duration is not in milliseconds because Carousel uses an attraction physics simulation when scrolling instead of easings. Only values between 20-60 are recommended, 25 is the default. |
| `onActiveIndexChange` | `any` | — | No | Callback to notify a page change. |
| `whitespace` | `boolean \| undefined` | `false` | No | Adds whitespace to start/end so that 'align' prop is always respected for current index Defaults to: False |

### Prop Guidance

- **defaultActiveIndex**: Sets the initially visible page in uncontrolled mode, where the Carousel manages its own index. Use it when you only need to choose a starting slide, such as resuming a gallery at a remembered page, and omit it when you need to read or drive the index from outside the component. `2`
- **activeIndex**: Supplies the current page when the Carousel is controlled. Pair it with onActiveIndexChange; used alone the index never advances. This is the prop to use when external Buttons, a Toolbar of index buttons, or an onboarding flow drives navigation. `1`
- **onActiveIndexChange**: Callback fired whenever the active page changes, receiving event data that includes the new index and the type of change (click, focus, drag, or autoplay). Use it to keep controlled state in sync, to log navigation analytics, and to trigger side effects such as closing a dialog after the final page. `(event, data) => setActiveIndex(data.index)`
- **align**: Controls how the active slide is positioned relative to the viewport: 'center' is the default balanced presentation, 'start' anchors the active card to the leading edge, and 'end' anchors it to the trailing edge. Combine with whitespace when aligning to start or end so trailing empty space is trimmed. `center`
- **whitespace**: Adds leading and trailing whitespace so that the requested alignment is always honored for the current index. Enable it when using start or end alignment, or when the first and last slides otherwise appear inset or produce excessive scrolling empty space. `true`
- **appearance**: Selects the visual treatment of the container. 'flat', the default, keeps the minimal styling used before appearances existed and suits carousels embedded in existing surfaces; 'elevated' adds rounded corners, a background, and shadow so the carousel reads as its own surfaced container. Use 'elevated' in dialogs, marketing sections, and anywhere the carousel should visually separate from the page. `elevated`
- **circular**: Enables looping so that navigating past the trailing index wraps to the beginning and vice versa. Turn it on for continuous browsing patterns such as image slideshows and banner rotations; leave it off when the sequence is finite and users should perceive a clear beginning and end. `true`
- **groupSize**: Controls how many cards advance per navigation step. It defaults to 'auto', which groups cards according to available width, and should be set to 1 when each carousel card is a full-page card. Use a numeric value when you want predictable, fixed paging regardless of viewport width. `1`
- **draggable**: Enables pointer and touch drag-to-scroll on the carousel items. Enable it for content-browsing carousels such as galleries and card rows; keep it disabled when the carousel is primarily button-driven or when dragging could conflict with inner interactive content. `true`
- **motion**: Chooses the transition style, either 'slide' or 'fade', or a CarouselMotion object that also sets the physics duration. Use 'slide' for horizontally browsed card rows, 'fade' for stacked pages such as first-run onboarding, and only adjust the duration within the recommended 20–60 range where 25 is the default — the value is not in milliseconds and does not affect drag, whose speed comes from drag force. `fade`
- **announcement**: Supplies the localized string announced when the carousel page changes, and it defaults to undefined. Always provide a CarouselAnnouncerFunction in production so screen reader users hear the new position; localize its output alongside the rest of the application strings. `A CarouselAnnouncerFunction returning a localized page-change message`
- **autoplayInterval**: Sets the delay between autoplay transitions in milliseconds, defaulting to 4000. It only has an effect when autoplay is enabled through CarouselAutoplayButton. Increase it for text-heavy cards that take longer to read and avoid very short intervals that rush users. `4000`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import { Button, Image, makeStyles, tokens, typographyStyles } from '@fluentui/react-components';
import * as React from 'react';
import type { JSXElement, CarouselAnnouncerFunction } from '@fluentui/react-components';

export const Default = (): JSXElement => (
  <Carousel groupSize={1} circular announcement={getAnnouncement}>
    <CarouselViewport>
      <CarouselSlider>
        {IMAGES.map((imageSrc, index) => (
          <BannerCard key={`image-${index}`} imageSrc={imageSrc} index={index}>
            Card {index + 1}
          </BannerCard>
        ))}
      </CarouselSlider>
    </CarouselViewport>
    <CarouselNavContainer
      layout="inline"
      autoplayTooltip={{ content: 'Autoplay', relationship: 'label' }}
      nextTooltip={{ content: 'Go to next', relationship: 'label' }}
      prevTooltip={{ content: 'Go to prev', relationship: 'label' }}
    >
      <CarouselNav>{index => <CarouselNavButton aria-label={`Carousel Nav Button ${index}`} />}</CarouselNav>
    </CarouselNavContainer>
  </Carousel>
);
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement, CarouselAnnouncerFunction } from '@fluentui/react-components';

export const Appearance = (): JSXElement => (
  <Carousel appearance="elevated" groupSize={1} circular announcement={getAnnouncement}>
    <CarouselViewport>
      <CarouselSlider>
        {IMAGES.map((imageSrc, index) => (
          <BannerCard key={`image-${index}`} imageSrc={imageSrc} index={index}>
            Card {index + 1}
          </BannerCard>
        ))}
      </CarouselSlider>
    </CarouselViewport>
    <CarouselNavContainer
      layout="inline"
      autoplayTooltip={{ content: 'Autoplay', relationship: 'label' }}
      nextTooltip={{ content: 'Go to next', relationship: 'label' }}
      prevTooltip={{ content: 'Go to prev', relationship: 'label' }}
    >
      <CarouselNav>{index => <CarouselNavButton aria-label={`Carousel Nav Button ${index}`} />}</CarouselNav>
    </CarouselNavContainer>
  </Carousel>
);
```

### AlignmentAndWhitespace

```tsx
import { MoreHorizontalRegular, DocumentLinkRegular } from '@fluentui/react-icons';
import * as React from 'react';
import type { JSXElement, CarouselAnnouncerFunction, CarouselProps } from '@fluentui/react-components';

export const AlignmentAndWhitespace = (): JSXElement => {
  const classes = useClasses();

  const [alignment, setAlignment] = React.useState<CarouselProps['align']>('center');
  const [whitespace, setWhitespace] = React.useState<boolean>(false);

  return (
    <div className={classes.container}>
      <div className={classes.controls}>
        <Field label="Alignment" orientation="horizontal" className={classes.field}>
          <Dropdown
            className={classes.dropdown}
            placeholder="Select an alignment"
            onOptionSelect={(_, option) => {
              setAlignment(option.optionText as CarouselProps['align']);
            }}
            value={alignment}
          >
            {['start', 'center', 'end'].map(option => (
              <Option key={option}>{option}</Option>
            ))}
          </Dropdown>
        </Field>

        <Field label="Whitespace" orientation="horizontal" className={classes.field}>
          <Switch checked={whitespace} onChange={() => setWhitespace(!whitespace)} />
        </Field>
      </div>

      <div className={classes.card}>
        <Carousel align={alignment} className={classes.carousel} whitespace={whitespace} announcement={getAnnouncement}>
          <CarouselViewport>
            <CarouselSlider cardFocus aria-label="Use the left and right arrow keys to navigate focused carousel card">
              {POSTS.map((post, index) => (
                <ActionCard {...post} key={post.name} index={index} />
              ))}
            </CarouselSlider>
          </CarouselViewport>
          <CarouselNavContainer
            layout="inline"
            next={{ 'aria-label': 'go to next' }}
            prev={{ 'aria-label': 'go to prev' }}
          >
            <CarouselNav>{index => <CarouselNavButton aria-label={`Carousel Nav Button ${index}`} />}</CarouselNav>
          </CarouselNavContainer>
        </Carousel>
      </div>
    </div>
  );
};

AlignmentAndWhitespace.parameters = {
  docs: {
    description: {
      story:
        'Carousel can have slides aligned relative to the carousel viewport, use the `align` prop to set the alignment. Note, the `whitespace` prop could be used to clear leading and trailing empty space that causes excessive scrolling.',
    },
  },
};
```

## Best Practices

### Do's

- Always provide a meaningful announcement function through the announcement prop so localized text is spoken when the active page changes; the default is undefined, which leaves page changes silent for screen reader users.
- Give every navigation control an accessible name: pass aria-label to CarouselNavButton and CarouselNavImageButton, and pass next, prev, and autoplay objects with aria-label values into CarouselNavContainer.
- Set groupSize explicitly to 1 when the carousel shows full-page cards such as BannerCard-style slides, because the default of 'auto' groups multiple cards per navigation step.
- Use the controlled pattern — activeIndex together with onActiveIndexChange — whenever the host needs to drive the carousel from external controls such as Previous and Next buttons, as in the first-run experience recipe.
- Enable draggable for touch and pointer-friendly surfaces, and combine it with cardFocus on CarouselSlider so keyboard users can move between focused cards with the arrow keys.
- Pair the whitespace prop with a non-center align value so leading and trailing empty space is cleared and the requested alignment is respected at the first and last index.
- Decide deliberately between appearance 'flat' for inline content that should blend with the page and 'elevated' when the carousel should read as its own surfaced container.
- Choose motion 'fade' for stacked, full-frame onboarding pages and motion 'slide' for horizontally browsed card rows, and tune the motion duration only within the recommended 20–60 range.

### Don'ts

- Don't enable autoplay without rendering a CarouselAutoplayButton in the navigation container; the autoplay button is an accessibility requirement because users must be able to pause moving content.
- Don't assume autoplayInterval alone starts rotation — the prop is inert unless autoplay is switched on through CarouselAutoplayButton.
- Don't express motion duration in milliseconds when passing a CarouselMotion object; the value is a unitless attraction-physics parameter where 25 is the default and values outside roughly 20–60 produce unnatural motion.
- Don't pass both defaultActiveIndex and activeIndex expecting the initial index prop to win; once activeIndex is supplied the carousel is controlled and defaultActiveIndex is no longer authoritative.
- Don't supply activeIndex without onActiveIndexChange, since the index then never updates and the carousel appears frozen to users clicking nav buttons or dragging.
- Don't leave nav buttons, prev/next buttons, or the autoplay button without aria-label text, because their icons carry no readable meaning on their own.
- Don't set circular merely to hide a layout problem; looping past the trailing index can disorient users who rely on positional cues such as '3 of 7' card labels.
- Don't put critical, one-time information exclusively in an autoplaying carousel, and don't let the autoplay interval be so short that users cannot finish reading the current card.
- Don't force a large groupSize on narrow viewports with non-autoSize cards, as cards will be compressed or clipped rather than reflowing.

## Anti-Patterns

### Autoplay without an autoplay control

❌ Rotating slides automatically with no way to stop them violates the accessibility expectation that moving content can be paused, and it strands users who read slowly or use assistive technology. Carousel enforces this by refusing to rotate unless a CarouselAutoplayButton is present.

✅ Render a CarouselAutoplayButton inside CarouselNavContainer with a valid autoplay prop such as an aria-label, and let the checked and onCheckedChange props of CarouselAutoplayButtonProps drive the enabled state, as shown in the autoplay and eventing recipes.

### Controlled index without a change handler

❌ Passing activeIndex but not onActiveIndexChange leaves the index pinned, so prev, next, nav buttons, keyboard navigation, and drags appear broken because nothing updates the value.

✅ Always pair activeIndex with onActiveIndexChange and write data.index back into state, or switch to the uncontrolled defaultActiveIndex pattern if external control is not needed.

### Leaving groupSize at auto for full-page cards

❌ With full-page cards, the 'auto' default can pack more than one card into a single navigation step, so paging jumps further than the user expects and card labels such as '3 of 7' stop matching the visible index.

✅ Set groupSize to 1 whenever each carousel slide is a full-page card, and reserve numeric group sizes or the 'auto' default for dense card rows that intentionally advance several items at a time.

### Silent page changes

❌ Because the announcement prop defaults to undefined, a carousel with clicks, drags, or autoplay can change content with no spoken feedback, leaving screen reader users unaware that anything moved.

✅ Implement a CarouselAnnouncerFunction and pass it to every Carousel instance, returning a localized message that identifies the new page and total count.

### Ignoring whitespace when aligning to start or end

❌ Aligning the active slide to start or end without the whitespace prop leaves leading and trailing gaps that make the carousel look misaligned at the first and last index and can cause excessive scrolling.

✅ Enable whitespace whenever align is set to start or end so the requested alignment is respected for the current index, as demonstrated in the alignment and whitespace recipe.

## Accessibility

**Requirements**: Carousel must be operable by keyboard alone: users need to reach the prev, next, autoplay, and nav buttons with Tab and activate them with Enter or Space, and cardFocus on CarouselSlider must let arrow keys move between focused cards. Autoplay is only permitted when a CarouselAutoplayButton is present, because automatically moving content must always be pausable. Every icon-only control requires an accessible name via aria-label, and the announcement prop must be implemented so that page changes are conveyed to assistive technology in the user's locale. Ensure text and imagery inside cards meet WCAG contrast requirements in both the flat and elevated appearances, verify focus indicators remain visible against the elevated background and shadow tokens, and confirm the carousel still meets reflow and resize-text expectations when cards use autoSize.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the Carousel and steps through the focusable controls — prev and next CarouselButton, CarouselAutoplayButton, CarouselNavButton or CarouselNavImageButton entries, and focusable cards. |
| `Shift+Tab` | Moves focus backwards out of the Carousel or to the preceding focusable control. |
| `ArrowLeft` | Moves to the previous carousel card or page when cardFocus is enabled on CarouselSlider, as described by the slider's aria-label hint text. |
| `ArrowRight` | Moves to the next carousel card or page when cardFocus is enabled on CarouselSlider. |
| `Enter` | Activates the focused navigation control, for example a CarouselNavButton that jumps to a specific index or a CarouselButton with navType 'next' or 'prev'. |
| `Space` | Activates the focused control and toggles the CarouselAutoplayButton on or off. |
| `Escape` | Dismisses the surrounding Dialog when the Carousel is used as a first-run experience inside a DialogSurface. |

**ARIA**: aria-label, aria-live (polite) for page-change announcements produced by the announcement callback

**Screen Reader**: Screen readers encounter the Carousel as a labelled region of content whose cards are individually labelled, typically with positional text such as '1 of 5' supplied through aria-label on CarouselCard. Navigation controls are announced by their aria-label values, so prev, next, autoplay, and per-index nav buttons must all be named; the announcement prop supplies the localized string that is surfaced when the active index changes, allowing the user to hear which page is now current after clicking, focusing, dragging, or autoplay. Because autoplay changes content without user action, the autoplay toggle must remain reachable and clearly named so users can stop the rotation.

## Styling

Style the Carousel root through its root slot by passing className, which is the supported extension point for the container. The elevated appearance already applies rounded corners, a background surface, and elevation, so if you customize it, prefer tokens.borderRadiusLarge for the corner radius, tokens.colorNeutralBackground1 for the surface, tokens.colorNeutralStroke1 with tokens.strokeWidthThin for an outline, and tokens.shadow4 or tokens.shadow8 for rest state with tokens.shadow16 on hover to stay consistent with Fluent elevation. Inner spacing for a carousel header, like the Title plus CarouselNavContainer layout used in the top navigation pattern, reads best with tokens.spacingHorizontalL and tokens.spacingVerticalM. Use the layout values on CarouselNavContainer — 'inline' for pagination that sits below the cards and 'overlay-expanded' for controls layered over imagery as in the image slideshow — and rely on that component rather than absolute positioning your own controls. The CarouselNav appearance accepts 'brand', which maps to tokens.colorBrandBackground and tokens.colorBrandForeground1 for the brand-colored pagination treatment used in first-run experiences. CarouselCard autoSize lets cards size to their content, so prefer tokens.spacingVerticalL padding and typographyStyles utilities inside cards rather than fixed widths, and never hard-code a card height that fights the autoSize measurement.

## Performance

Carousel animates with an attraction physics simulation rather than CSS easings, so transition cost scales with how many cards are mounted in CarouselSlider and with the duration value supplied through a CarouselMotion object; keep durations in the recommended 20–60 band to avoid long-running animation frames. Cards using autoSize require measurement of their content, so very tall or expensive card subtrees are measured more often than fixed-size cards; prefer lightweight card content or fixed dimensions for large data sets. Dragging produces continuous index updates and therefore frequent onActiveIndexChange calls, so any handler wired to that callback should be cheap or debounced before performing heavy work such as network requests or analytics flushes. Loading many high-resolution images at once is the most common performance problem in image slideshows, so lazy-load or size imagery used inside CarouselCard and CarouselNavImageButton thumbnails, and avoid rendering an unbounded number of cards by paging data rather than mounting everything at once.

## Theming & Tokens

Carousel consumes Fluent design tokens and responds automatically to the theme provided by Provider, including brand and high-contrast variants. The elevated appearance maps to surface and elevation tokens such as tokens.colorNeutralBackground1, tokens.borderRadiusLarge, tokens.shadow4, and tokens.shadow8, with stronger elevation such as tokens.shadow16 available for emphasis. Foreground content and labels inherit tokens.colorNeutralForeground1 and tokens.colorNeutralForeground2, while borders and separators use tokens.colorNeutralStroke1 and tokens.colorNeutralStroke2. Brand-colored pagination through the CarouselNav appearance of 'brand' resolves to tokens.colorBrandBackground and tokens.colorBrandForeground1, and card spacing follows tokens.spacingHorizontalL and tokens.spacingVerticalM. Because everything flows through tokens rather than hard-coded values, a carousel styled with the tokens above will remain legible and correctly elevated when the theme changes, when a high-contrast theme is applied, or when the theme is scoped to a subtree with Provider.

## Migration Notes

Carousel is a v9-first component with no direct one-to-one v8 counterpart, so teams porting legacy carousel implementations built from Button, Image, and manual scroll containers should expect an API-shaped rewrite rather than a prop rename. The concepts to re-learn are the composition model (Carousel wraps CarouselViewport, which wraps CarouselSlider containing CarouselCard children, with navigation provided by CarouselNavContainer and CarouselNav), the controlled index contract of activeIndex plus onActiveIndexChange with the uncontrolled alternative of defaultActiveIndex, and the physics-based motion model in which a CarouselMotion object takes a unitless duration around 25 rather than milliseconds. Autoplay also differs from typical legacy implementations: the interval is configured with autoplayInterval but rotation only starts when a CarouselAutoplayButton is rendered and toggled, so migrate any always-on rotation to that explicit, user-controllable pattern.

## Edge Cases

- The motion duration inside a CarouselMotion object is not expressed in milliseconds; it is a unitless attraction-physics parameter where 25 is the default and only values between roughly 20 and 60 are recommended. Drag interactions ignore it entirely because drag duration is derived from drag force.
- autoplayInterval has no effect on its own. Rotation begins only when a CarouselAutoplayButton is rendered in CarouselNavContainer with valid autoplay props, and removing those props disables and removes the control.
- The announcement prop defaults to undefined, so a carousel that changes pages without a supplied announcer gives no spoken feedback; this is easy to miss because the visual experience is unchanged.
- Alignment values of start and end may not appear to apply at the first and last index unless whitespace is enabled, which is the intended behavior of trimming or preserving leading and trailing space.
- Card-level keyboard navigation requires cardFocus on CarouselSlider; without it, arrow keys do not move between cards even though the slider's aria-label hint suggests they do.
- When activeIndex is provided, defaultActiveIndex is no longer the source of truth, so an initial index set through both props can appear to be ignored.
- Setting circular on a grouped carousel changes how users reach the final items, since paging past the trailing index wraps rather than stopping, which can be confusing when cards carry explicit positional labels.
- Placing a Carousel inside a Dialog for a first-run experience requires resetting or initializing the controlled index when the dialog opens, and deciding what happens when the user navigates before the first page — for example closing the dialog instead of showing a negative index.

## See Also

- - [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
