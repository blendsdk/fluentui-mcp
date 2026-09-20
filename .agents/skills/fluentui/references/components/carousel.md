# Carousel

> **Package**: `@fluentui/react-carousel` v9.9.8
> **Import**: `import { Carousel } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

Carousel is a Fluent UI React v9 container that rotates a set of cards or pages inside a viewport while owning the active-page state, grouping, motion, drag interaction, optional autoplay, and screen-reader announcements. The Carousel root renders a single root slot and coordinates its companion components — CarouselViewport, CarouselSlider, CarouselCard, CarouselNav, CarouselNavButton, CarouselButton, CarouselAutoplayButton, CarouselNavImageButton, and CarouselNavContainer — which provide the visible slides and the navigation controls. It works uncontrolled through defaultActiveIndex or fully controlled through activeIndex plus onActiveIndexChange, loops continuously when circular is set, advances multiple cards at a time when groupSize is configured, animates with either slide or fade motion, and supports pointer drag when draggable is enabled. The appearance prop toggles between the minimal flat look used previously and an elevated, surfaced container with rounded corners, background, and shadow tokens, while align and whitespace control where the active page sits relative to the viewport.

**When to use**: Use Carousel when a small, self-contained set of related items (hero banners, promotional cards, an image gallery, or sequential onboarding pages such as a first-run experience) must share limited horizontal space and the user benefits from browsing them one page or group at a time. Choose it when you also want built-in pagination controls, drag scrolling, autoplay, and page-change announcements rather than wiring those behaviors yourself. Prefer alternatives when the content is not optional or sequential: use Nav, TabList, or Breadcrumb for navigating between application sections, use List or DataGrid when every item must be visible and scannable at once, and use Dialog or TeachingPopover for multi-step flows that should not be skippable. Avoid Carousel for content that users must read in full or compare side by side, because off-screen pages are easy to miss.

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
| `onActiveIndexChange` | `EventHandler<CarouselIndexChangeData> \| undefined` | — | No | Callback to notify a page change. |
| `whitespace` | `boolean \| undefined` | `false` | No | Adds whitespace to start/end so that 'align' prop is always respected for current index Defaults to: False |

### Prop Guidance

- **activeIndex**: Use for controlled carousels where the visible page must be owned by your state — for example when syncing with a footer toolbar, a Dialog flow, or an events log. Always pair it with onActiveIndexChange and never with defaultActiveIndex. `2`
- **defaultActiveIndex**: Use for uncontrolled carousels where the user's navigation should simply be internal state. Set it when the carousel should start on a page other than the first, and omit it together with activeIndex. `1`
- **onActiveIndexChange**: Use as the single place to react to page changes. The data object carries the new index and the event type (click, focus, drag, or autoplay), which is useful for telemetry, logging, and updating controlled state. `updates controlled index state`
- **align**: Controls whether the active page sits at the start, center (default), or end of the viewport. Switch to 'start' or 'end' for layouts such as top-navigation carousels that should not be symmetric, and pair with whitespace when the alignment must be exact for the first and last pages. `'start'`
- **whitespace**: Adds leading and trailing whitespace so the align value is always respected for the current index. Enable it when an aligned active card should stay anchored rather than drifting to the viewport edge; keep it false when you want to minimize scroll distance and empty space. `true`
- **appearance**: Chooses the visual treatment of the container. Keep the default 'flat' when the carousel is embedded inside an existing surface, and use 'elevated' when the carousel should read as a standalone surfaced card with rounded corners, background, and shadow. `'elevated'`
- **circular**: Enables looping past the trailing index back to the first page. Use it for galleries and promotional carousels with no meaningful start or end; leave the default false for sequential content such as onboarding pages that should terminate. `true`
- **groupSize**: Sets how many cards belong to one navigation element. Leave the default 'auto' for responsive strips that show several cards at once, and set it to 1 when cards are full-page so previous/next and page dots advance a single card at a time. `1`
- **draggable**: Enables drag-to-scroll on the carousel items. Turn it on for touch-friendly galleries and card strips, but treat it as an enhancement — keyboard and button navigation must still reach every page. `true`
- **motion**: Selects 'slide' (default) or 'fade' transitions, or an object combining 'slide' with a duration. Use 'fade' for image or illustration swaps that should not visibly translate, and tune duration only within the recommended 20 to 60 range (25 is the default). `'fade'`
- **announcement**: Provides the localized string used to announce page changes to assistive technology. Supply a function that formats the current page and total count in the product's language; leaving it undefined falls back to a non-localized default. `localized page announcement function`
- **autoplayInterval**: Sets the delay in milliseconds between automatic transitions. It only takes effect when autoplay is enabled by passing configuration (at minimum an aria-label) to CarouselNavContainer's autoplay entry; increase it for content-heavy slides and keep it within a range users can comfortably read. `4000`

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

- Always pass an announcement function to the announcement prop so page changes are announced in the user's language, instead of relying on the untranslated default string.
- Give every CarouselNavButton a distinct aria-label that includes its position (for example "Carousel Nav Button 3") and give the previous/next entries in CarouselNavContainer their own aria-labels such as "go to next" and "go to prev".
- Set groupSize to 1 when the cards are full-page slides so each navigation element advances exactly one full card, and leave the default 'auto' for multi-card strips.
- Expose autoplay only through the CarouselAutoplayButton configured by the autoplay entry on CarouselNavContainer, since autoplay without a user-operable control violates accessibility requirements.
- Choose activeIndex plus onActiveIndexChange when the page must stay in sync with external UI, and use defaultActiveIndex alone when the carousel can own its own state.
- Enable circular for content with no natural first or last item (image galleries, looping promos) and leave it false when the sequence has a defined beginning and end.
- Label each CarouselCard with a position hint such as "1 of 5" so a screen reader user understands where they are in the sequence.
- Pair align with whitespace when the active page must be visually pinned to start, center, or end, because whitespace clears the leading and trailing space that otherwise prevents alignment from being respected.
- Keep autoplayInterval long enough for the heaviest slide to be read and understood, and expose autoplay as an opt-in that users can turn off.

### Don'ts

- Don't enable autoplay without rendering the CarouselAutoplayButton, and don't remove that button from CarouselNavContainer once autoplay is offered.
- Don't omit the announcement prop in localized or multi-language products; the fallback announcement is not localized for your content.
- Don't use Carousel as the only place critical information appears, because non-active pages are hidden from view until the user navigates to them.
- Don't mix controlled and uncontrolled state by passing activeIndex together with defaultActiveIndex, and don't pass activeIndex without onActiveIndexChange unless the index is intentionally frozen.
- Don't make drag the only way to change pages; draggable is a pointer convenience and keyboard users must still reach every page through navigation buttons and arrow keys.
- Don't pass millisecond-looking values to a CarouselMotion object, because motion duration is expressed in the physics simulation's own units where only 20 to 60 is recommended and 25 is the default.
- Don't leave navigation buttons unlabeled; a bare CarouselNavButton or CarouselButton announces only "button" to assistive technology.
- Don't set groupSize to 'auto' while expecting page-by-page behavior when you are using full-page cards, because a single navigation element may then advance a whole group.

## Anti-Patterns

### Autoplay without a pause control

❌ Rotating slides automatically with no way to stop them traps users who read slowly, use screen magnification, or need more time, and it bypasses the requirement that autoplay be gated behind a user-operable control.

✅ Render the autoplay control by passing an object with at least an aria-label to CarouselNavContainer's autoplay entry, wire its checked state to your autoplay boolean, and use autoplayInterval to tune the delay.

### Unlabeled or duplicated navigation buttons

❌ CarouselNavButton, CarouselButton, and CarouselNavImageButton render as icon-only controls, so without aria-label a screen reader announces a series of identical "button" elements and users cannot tell previous from next or page 1 from page 4.

✅ Give every navigation control a unique, contextual aria-label — for example "Carousel Nav Button 3", "go to next", and "go to prev" — and label CarouselCard with its position such as "2 of 5".

### Mixing controlled and uncontrolled index state

❌ Passing activeIndex together with defaultActiveIndex, or passing activeIndex without onActiveIndexChange, creates a carousel whose visual page and internal state disagree; navigation may appear broken because the index never updates.

✅ Pick one model: either use defaultActiveIndex for an uncontrolled carousel, or use activeIndex plus onActiveIndexChange so the index you render is the index the Carousel reports back on every click, focus, drag, and autoplay transition.

### Treating groupSize as a layout-only setting

❌ With the default groupSize of 'auto', one navigation element can represent several cards, so page dots and prev/next advance by group rather than by card; full-page carousels then appear to skip content.

✅ Set groupSize to 1 whenever the design is one full-page card per step, and reserve 'auto' for responsive multi-card strips where advancing a group is the intended behavior.

### Assuming motion duration is milliseconds

❌ Carousel scrolls with an attraction physics simulation rather than time-based easings, so passing a millisecond-style duration (for example 400) to the motion object produces jarring or unresponsive movement.

✅ Use the recommended 20 to 60 range for motion duration, with 25 as the default, and remember drag interactions ignore duration because the drag force determines the speed.

## Accessibility

**Requirements**: Carousel must remain fully operable without a pointer: users must be able to reach every page through keyboard-reachable navigation buttons, and the slider itself should carry an aria-label explaining the arrow-key interaction, as shown by the CarouselSlider label describing left and right arrow navigation of the focused card. Autoplay cannot be enabled silently — the CarouselAutoplayButton, surfaced through CarouselNavContainer's autoplay entry, is the required user control for starting and stopping automatic transitions (the WCAG pause/stop/hide expectation). Every page change must be announced through the announcement prop so that non-visual users know the page changed and where they are; supply a localized string rather than the default English announcement. Cards and navigation controls need accessible names (aria-label such as "1 of 5" on CarouselCard and unique labels on each CarouselNavButton). When the carousel is embedded in a Dialog, as in first-run experiences, the dialog surface should itself carry an accessible name and focus should be managed by the dialog.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and through the carousel controls — previous button, cards or slider, next button, autoplay button, and page navigation buttons. |
| `Shift+Tab` | Moves focus backward through the same carousel controls. |
| `ArrowLeft` | Moves to the previous card when the slider is focused with card focus enabled (the CarouselSlider label documents this behavior). |
| `ArrowRight` | Moves to the next card when the slider is focused with card focus enabled. |
| `Enter` | Activates a focused navigation control such as CarouselButton, CarouselNavButton, or CarouselAutoplayButton. |
| `Space` | Activates a focused navigation control such as CarouselButton, CarouselNavButton, or the autoplay toggle. |

**ARIA**: aria-label on CarouselSlider to describe the keyboard interaction for the focused card, aria-label on each CarouselCard to convey position, for example "1 of 5", aria-label on CarouselNavButton, CarouselButton, CarouselAutoplayButton, and CarouselNavImageButton to give each control a unique accessible name, aria-labelledby where an external element (such as a page-count or events label) names the region associated with the carousel output

**Screen Reader**: Carousel announces page changes through the function supplied to the announcement prop, so a properly localized function reports the new page (for example "page 2 of 5") whenever the active index changes by click, focus, drag, or autoplay. Page navigation buttons read their own aria-label, the previous and next buttons read the labels supplied in CarouselNavContainer (or their own aria-label), and the autoplay control announces its pressed/checked state so users know whether automatic transitions are running. Cards expose their aria-label position hints, letting a screen reader user understand the sequence without seeing the other slides.

## Styling

Carousel styling is driven by the appearance prop and by the Gruffel classes applied to the root slot: appearance="elevated" layers rounded corners, a background, and a shadow onto the container, corresponding to tokens such as tokens.borderRadiusXLarge, tokens.colorNeutralBackground1, and tokens.shadow8, while appearance="flat" (the default) keeps the minimal treatment. You can override the flat look with className on Carousel and add your own tokens, for example tokens.colorNeutralStroke1 for a subtle outline, tokens.spacingHorizontalXL and tokens.spacingVerticalL for internal padding, or tokens.colorNeutralShadowAmbient for a lighter elevation. Sizing of individual slides is handled on CarouselCard and CarouselSlider (classes such as classes.card, classes.viewport, and classes.slider in the examples), so keep width and padding rules there rather than on the root. CarouselNav supports an appearance (for example "brand") so page dots can adopt token-driven brand colors such as tokens.colorBrandBackground and tokens.colorBrandBackgroundPressed, and CarouselNavImageButton sizes itself to a preview image. The elevated surface is intended to sit on a neutral page background, so verify contrast against tokens.colorNeutralBackground2 or similar page tokens before reusing it inside already-surfaced containers such as Card or Dialog.

## Performance

Carousel drives transitions with an attraction physics simulation instead of CSS easing, which affects both feel and tuning: motion durations are abstract units (20 to 60 recommended, 25 default) and drag gestures derive their own duration from the drag force. Keep the number of CarouselCard children modest and keep heavy work (large images, complex cards) out of the slider, because every card is part of the slider content and drag scrolling moves the whole strip rather than virtualizing pages. Resizing concerns live on the individual cards: CarouselCard's autoSize measures its content, so very large or late-loading content can cause layout shifts, and CarouselNavImageButton adds one image decode per page for thumbnail navigation. Announcements fire on every index change, including autoplay ticks and drag snaps, so keep the function supplied to the announcement prop cheap and side-effect free, and debounce any telemetry you do inside onActiveIndexChange.

## Theming & Tokens

Carousel takes its visual identity from Fluent theme tokens. The elevated appearance applies a surfaced treatment that maps to tokens such as tokens.colorNeutralBackground1 for the background, tokens.borderRadiusXLarge for corners, and tokens.shadow8 for the container shadow, while the flat default relies on tokens.colorNeutralStroke1 and tokens.colorNeutralBackground1 only where you add them yourself through className. Spacing customizations should use tokens.spacingHorizontalL, tokens.spacingHorizontalXL, tokens.spacingVerticalM, and related spacing tokens so padding follows the theme's density scale. Navigation dots adopt the appearance of CarouselNav, so a brand treatment resolves to tokens.colorBrandBackground and its interactive/inactive counterparts rather than hard-coded colors, and inactive dots typically use tokens.colorNeutralForeground3 or tokens.colorNeutralBackground4. Text inside cards should use tokens.colorNeutralForeground1 and tokens.colorNeutralForeground2, and any image overlays should reference tokens.colorNeutralBackgroundStatic or tokens.colorBackgroundOverlay so they invert correctly in dark themes. Because motion values are physics-simulation units rather than time tokens, theme changes to duration curves do not affect Carousel speed.

## Migration Notes

Carousel is a Fluent UI React v9 component; the appearance prop was added after the initial release and defaults to 'flat', which preserves the minimal styling used before appearance-based styles existed. Migrating to 'elevated' opts the component into rounded corners, background, and shadow tokens, so visual regressions in surrounding layouts should be checked when the default is overridden. Autoplay behavior is intentionally gated behind the CarouselAutoplayButton in CarouselNavContainer rather than a bare boolean, so code that used to drive rotation automatically should expose the autoplay control and use autoplayInterval for the delay.

## Edge Cases

- Motion duration is not in milliseconds: the CarouselMotion object expects values in the range of roughly 20 to 60 (25 is the default), and drag gestures override the duration entirely based on drag force.
- With the default groupSize of 'auto', one navigation element can advance several cards, so page changes reported through onActiveIndexChange may jump by more than one index; set groupSize to 1 for strict card-by-card navigation.
- The whitespace prop adds space at the start and end so align is always respected for the current index, which can increase the apparent scroll distance on the first and last pages.
- autoplayInterval has no effect unless autoplay is actually enabled through CarouselNavContainer's autoplay entry, and removing that entry disables and removes the autoplay control entirely.
- When circular is false, navigation stops at the trailing index and any continued prev/next interaction does nothing rather than wrapping.
- If activeIndex is provided without onActiveIndexChange, user navigation cannot update the rendered index, so the carousel appears frozen on that page.
- Passing an undefined announcement falls back to the component's default announcement string, which is not localized for the consuming product.
- The default align of 'center' can make the first and last cards appear offset from the viewport edges unless whitespace is enabled or the alignment is changed to 'start' or 'end'.
- Dragging is a pointer-only enhancement; pages must still be reachable through the navigation buttons and the arrow-key navigation that requires card focus on CarouselSlider.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
