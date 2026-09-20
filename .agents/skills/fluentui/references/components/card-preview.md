# CardPreview

> **Package**: `@fluentui/react-card` v9.7.0
> **Import**: `import { CardPreview } from '@fluentui/react-components';`
> **Category**: layout
> **Stability**: stable

## Overview

CardPreview is the media region of a Fluent UI React v9 Card. It renders the visual anchor of a card — typically an image, illustration, chart, or thumbnail — inside a required root slot, with an optional logo slot layered on top of that media. In practice you use it as the preview slot of a Card, alongside CardHeader and CardFooter, so that the card's layout owns the spacing and the preview owns the imagery. Because CardPreview is composition-based, it participates in the same selection, orientation, size, appearance, and focus-mode behavior that Card exposes: a selectable card can render its checkbox in the preview's action slot, and a horizontally oriented card can place the preview beside the header instead of above it. The component renders semantic markup only for the containers it owns; the actual imagery (for example an image element) is supplied by you as child content or through the logo slot, which means accessible names must be authored by the consumer.

**When to use**: Use CardPreview whenever a Card needs a visual or media element that helps users recognize the content at a glance — document thumbnails, product images, album art, app tiles, or charts. Use it as the preview slot of a Card rather than dropping an image directly into the card, because CardPreview participates in the card's internal spacing, orientation, and selection wiring (including the action overlay used for the selection checkbox). Prefer CardPreview over a bare Image when the visual needs to live inside a card's interaction surface; prefer Image or ImageSwatch when the visual stands alone outside a card. For swatch-style color choices inside a picker, use SwatchPicker and its swatch components instead; for decorative logos or icons that are not card media, use Image or an icon rather than CardPreview.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `action` | `Slot<'div'>` | — | No | — |
| `action` | `Slot<'div'>` | — | No | — |
| `appearance` | `'filled' \| 'filled-alternative' \| 'outline' \| 'subtle'` | — | No | — |
| `cardHeaderGapVar` | `string` | — | Yes | — |
| `defaultSelected` | `boolean` | — | No | — |
| `description` | `Slot<'div'>` | — | Yes | — |
| `disabled` | `boolean` | — | No | — |
| `focusMode` | `'off' \| 'no-tab' \| 'tab-exit' \| 'tab-only'` | — | No | — |
| `header` | `Slot<'div'>` | — | Yes | — |
| `image` | `Slot<'div', 'img'>` | — | Yes | — |
| `logo` | `Slot<'div', 'img'>` | — | No | — |
| `onSelectionChange` | `(event: CardOnSelectionChangeEvent, data: CardOnSelectData) => void` | — | No | — |
| `orientation` | `'horizontal' \| 'vertical'` | — | No | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `selected` | `boolean` | — | No | — |
| `shouldRestrictTriggerAction` | `(event: CardOnSelectionChangeEvent) => boolean` | — | No | — |
| `size` | `'small' \| 'medium' \| 'large'` | — | No | — |

### Prop Guidance

- **root**: The required root slot for the preview container. Use it to attach a className or style when the media needs custom sizing such as an aspect ratio, and to control the container that the preview content is rendered into. `root={{ className: styles.previewRoot }}`
- **logo**: Optional slot layered over the media for a logo or file-type marker. Render the logo image here with its own alt text, and reserve it for a small secondary mark rather than a second full-size image. `logo={<img src="docx.png" alt="Microsoft Word document" />}`
- **action**: Optional overlay slot rendered above the preview media for controls that must float over the image, most commonly the selection checkbox of a selectable card. Keep this region for a single well-named control so focus order stays simple. `action={<Checkbox checked={checked} aria-label="Select item" />}`
- **shouldRestrictTriggerAction**: Callback that decides whether a trigger action originating from the preview region should be allowed to proceed. Use it to block card activation when the pointer interaction started on an element inside the media that should handle the event itself. `(event) => event.type === 'click'`
- **cardHeaderGapVar**: String value that communicates the header gap to the preview layout so the media spacing stays aligned with the header above it. Set it to the same spacing token value used by the surrounding card header instead of hard-coding a pixel offset. `tokens.spacingVerticalM`
- **selected**: Controlled selection state of the card that owns the preview. Set it with onSelectionChange when the application owns the state so the preview and the rest of the card reflect selection together. `selected={isSelected}`
- **defaultSelected**: Initial selection state for an uncontrolled selectable card. Use it when the card should start selected without the application tracking the state; pair it with onSelectionChange only for notifications. `defaultSelected`
- **onSelectionChange**: Callback fired with the change event and selection data when the user changes the card's selection. Use it to persist or sync selection rather than mutating state inside the preview itself. `(event, data) => setSelected(data.selected)`
- **disabled**: Marks the card and its preview as unavailable. Set it when the media represents content the user cannot open or select, and provide an explanation elsewhere on the page since the preview cannot show one. `disabled`
- **appearance**: Controls the card surface styling that frames the preview: filled, filled-alternative, outline, or subtle. Choose the value that matches the surrounding surface so the media does not appear to float on an inconsistent background. `outline`
- **orientation**: Determines whether the preview is stacked above the header and footer or placed beside them. Use horizontal for list-like cards with wide media and vertical for grid tiles where the media leads the card. `horizontal`
- **size**: Scales the card and, with it, the space allocated to the preview. Pick small for dense lists, medium for standard cards, and large only when the media needs to dominate the layout. `medium`
- **focusMode**: Defines how keyboard focus behaves for the card containing the preview: off removes the card from the tab order, no-tab uses roving focus, tab-only makes the card a single tab stop, and tab-exit lets focus continue out of the card after the last element. Choose tab-exit or tab-only for selectable cards so the preview's overlay controls remain reachable. `tab-exit`
- **image**: Card-level slot for the media area when the card is composed declaratively. Prefer CardPreview when you need the logo overlay, the action overlay, or selection wiring; use the image slot only for the simplest single-image cards. `image={{ src: 'preview.png', alt: 'Preview' }}`
- **header**: Card-level slot for the header region that sits adjacent to the preview. Keep header text short so it does not compete with the media for vertical space at small sizes. `See CardHeader usage`
- **description**: Card-level slot for supporting description text under the header. Use it for one or two lines of context; truncate or omit it at the small size to protect the preview's space. `See CardHeader usage`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `logo` | — | No | Container that holds a logo related to the image preview provided. |
| `root` | — | Yes | Root element of the component. |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { CardPreview } from '@fluentui/react-components';

export const Default = (): JSXElement => (
  <CardPreview logo={<img src={resolveAsset('docx.png')} alt="Microsoft Word logo" />}>
    <img src={resolveAsset('doc_template.png')} alt="Preview of a Word document " />
  </CardPreview>
);
```

## Best Practices

### Do's

- Always supply meaningful alternative text for the preview image so the media communicates its purpose, for example a description of the document or product being previewed.
- Pass the logo through the logo slot when the media needs a secondary brand or file-type marker, instead of stacking extra wrappers inside the preview content.
- Let the Card own the layout: place CardPreview in the card's preview slot and let orientation, size, and appearance drive how the media is presented.
- Give the preview a stable aspect ratio or explicit dimensions so cards in a grid align with each other and the card does not reflow while images load.
- Keep the preview content non-interactive. Any control that must be clickable, such as a selection checkbox, belongs in the action slot so the card's focus handling stays predictable.
- Use the action slot for overlay controls that must sit above the media, since the preview region is designed to layer that content on top of the image.
- Combine CardPreview with CardHeader and, when needed, CardFooter so the card has a header, media, and trailing content structure that assistive technology can follow.

### Don'ts

- Don't put a separate button or link inside the preview region; nested interactive elements inside a focusable card break focus order and produce conflicting activation targets.
- Don't use CardPreview as a generic image container outside of a Card — it is a card layout primitive and expects card context for its selection, orientation, and sizing behavior.
- Don't omit alternative text or, worse, leave a filename as the alt text; screen reader users then hear a meaningless string instead of the media's purpose.
- Don't hard-code padding, margin, or background colors on the preview root; the card and theme tokens already define that spacing, and overrides will break in other themes and density settings.
- Don't rely on the preview alone to convey selection; the selected state, onSelectionChange, and defaultSelected belong on the Card so the state is announced and controlled consistently.
- Don't place the same image with the same description in both the preview and the header, which produces duplicated announcements for screen reader users.
- Don't use very large, unscaled source images in the preview; oversized media degrades card rendering performance and layout stability.

## Anti-Patterns

### Interactive elements nested inside the preview media

❌ Buttons, links, or menu triggers placed directly in the preview content create nested interactive regions inside the card's clickable surface. Pointer and keyboard activation become ambiguous, and screen reader users encounter controls that overlap the card's own action.

✅ Move any overlay control into the action slot so it is a single, clearly named control layered above the media, and let the card own activation for the rest of the preview.

### Meaningless or missing alternative text

❌ Images rendered without alt text, or with the file name as alt text, are announced as an unlabeled graphic or as a raw string such as a PNG file name. Screen reader users lose the primary information the card conveys.

✅ Write a short description of what the media represents, and when the card header already communicates the same information, mark the media as decorative with an empty alt attribute or aria-hidden so it is skipped.

### Duplicating card state on the preview

❌ Tracking selected or disabled locally on the preview duplicates the card's state, causing the media to disagree with the card's selection indicator and the announced state.

✅ Drive selection and disabled through the card's selected, defaultSelected, onSelectionChange, and disabled props so the preview always reflects the card's authoritative state.

### Styling the preview with hard-coded dimensions and colors

❌ Fixed pixel padding, background colors, or corner radii on the preview root fight the card's own layout and break when the theme, density, or appearance value changes.

✅ Use slot classNames with Griffel tokens such as tokens.borderRadiusMedium, tokens.spacingHorizontalS, and tokens.colorNeutralBackground3 so the preview follows the theme and card appearance.

### Using CardPreview as a standalone image wrapper

❌ CardPreview outside a Card loses the context it was designed for — orientation, size, selection, and appearance come from the card — so it renders with no meaningful layout contract.

✅ Place CardPreview in the preview slot of a Card, or use Image when a plain media element is all that is needed.

## Accessibility

**Requirements**: CardPreview must satisfy WCAG 2.1 AA. Non-text content in the preview needs a text alternative (1.1.1), which means either a descriptive alt attribute on the image you render or, when the media is purely decorative and the information is already conveyed by the card header, an empty alt or aria-hidden so it is skipped. Text rendered over the preview (for example a caption or overlay label) must meet 1.4.3 contrast requirements in every theme and appearance value. Any interactive overlay placed in the action slot must be reachable and operable by keyboard (2.1.1) with a visible focus indicator (2.4.7), and must not rely on color alone to convey state (1.4.1). If the card is selectable, the selection state must be exposed programmatically rather than visually only.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the card's preview region and onto any focusable control in the action slot when focusMode allows tabbing into the card; with focusMode 'no-tab' the preview participates in the card's roving focus instead of the normal tab order. |
| `Shift+Tab` | Moves focus backward out of the preview region and any control in the action slot, returning to the preceding focusable element. |
| `Enter` | Activates the card's primary action or selection when the card is focused, or activates a focused control inside the preview's action slot. |
| `Space` | Toggles selection for a selectable card or activates a focused control rendered in the preview's action slot. |
| `Tab (exit)` | When focusMode is 'tab-exit', pressing Tab after the last interactive element inside the card moves focus out of the card instead of cycling within it. |

**ARIA**: alt, aria-label, aria-hidden, aria-disabled

**Screen Reader**: The preview container is exposed as a generic grouping element with no accessible name of its own; what a screen reader user actually hears comes from the image you render inside it. A descriptive alt attribute is announced as a graphic, while an empty alt or aria-hidden hides decorative media entirely. When the card advertises selection through the selected, defaultSelected, and onSelectionChange props, the announced selected or unchecked state comes from the card's own control rather than from CardPreview, and a disabled card is announced as unavailable so the user knows the preview is not operable. Content placed in the action slot is announced as a control inside the card, so it must carry its own accessible name.

## Styling

Style CardPreview through its slots rather than by wrapping it in extra elements. The root slot and the logo slot can each take a className, so you can tune the media container without disturbing the card's own grid. Common customizations are rounding the top corners of media with tokens.borderRadiusMedium so the image follows the card, setting an aspect ratio on the root and using object-fit on the inner image, and giving the media a placeholder background such as tokens.colorNeutralBackground3 while the image loads. Use tokens.colorNeutralBackground1 or tokens.colorNeutralBackground2 when the preview needs to sit against the card surface, and tokens.colorNeutralForeground1 for any overlay caption. Apply tokens.spacingHorizontalS and tokens.spacingVerticalS for internal inset on logo overlays, and tokens.shadow2 or tokens.shadow4 on a logo chip that should read as floating above the media. Selection and disabled styling should come from the surface tokens the card already applies — tokens.colorNeutralBackground1Selected, tokens.colorNeutralBackground1Disabled, and tokens.colorNeutralForegroundDisabled — rather than from custom values, so the preview stays consistent with the rest of the card in every appearance value, including filled, filled-alternative, outline, and subtle.

## Performance

CardPreview itself renders only container elements, so its cost is dominated by the media you supply. Serve appropriately sized images rather than full-resolution assets, and set explicit dimensions or an aspect ratio on the root so the browser can reserve space and avoid layout shift while the image loads. Prefer a single image plus a small logo overlay instead of multiple large images in one preview. When a grid contains many cards, lazy-load offscreen media and avoid inline styles that change on every render, since className changes on the root slot trigger restyles. Because the preview re-renders whenever the card's selection, size, appearance, orientation, or focusMode values change, keep those values stable across renders and memoize the media content when it is expensive to construct.

## Theming & Tokens

CardPreview inherits nearly all of its visuals from Card and from the FluentProvider theme. The card surface that frames the preview is built from tokens.colorNeutralBackground1 and, for each appearance value, tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed, tokens.colorNeutralBackground1Selected, and tokens.colorNeutralBackground1Disabled; subtle and outline variants lean on tokens.colorSubtleBackground and tokens.colorNeutralStroke1 respectively. Text and captions drawn over the media should use tokens.colorNeutralForeground1 or tokens.colorNeutralForegroundOnBrand when placed on a brand-colored surface, and borders around media should use tokens.colorNeutralStroke1 or tokens.colorTransparentStroke. Corner rounding follows tokens.borderRadiusMedium, internal spacing follows tokens.spacingVerticalS, tokens.spacingHorizontalM, and the header gap used by cardHeaderGapVar, and any floating logo chip can use tokens.shadow2. Because these are theme tokens, switching between light, dark, and high-contrast themes restyles the preview automatically without component-level overrides.

## Edge Cases

- CardPreview does not author the media, so a preview rendered with no child content collapses to an empty container; always provide media or reserve an explicit size.
- The logo slot layers above the preview content, so a logo image with its own alt text will be announced in addition to the primary media — mark purely decorative logos appropriately or drop the slot.
- In horizontal orientation the preview shares the card's width with the header and footer, so fixed-width media can crowd out the text at the small size.
- With focusMode set to 'off' or 'no-tab', controls placed in the action slot may not be reachable in the normal tab order, which makes the selection overlay unusable by keyboard.
- A disabled card still renders its preview media; if the media conveys essential information, do not hide it behind a disabled card without an equivalent textual alternative elsewhere.
- Very tall or very wide source images can break card alignment in a grid unless the root constrains the aspect ratio and the image is fitted to it.

## See Also

- [layout category](../categories/layout.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
