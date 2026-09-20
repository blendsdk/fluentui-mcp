# CardHeader

> **Package**: `@fluentui/react-card` v9.7.0
> **Import**: `import { CardHeader } from '@fluentui/react-components';`
> **Category**: layout
> **Stability**: stable

## Overview

CardHeader is a layout component that renders the top region of a Card, composing four visual regions into a single row: an optional image or avatar, a required header title, an optional short description, and an optional action area pinned to the far end of the row. It is imported from @fluentui/react-components as CardHeader and is built from five slots (root, image, header, description, action), each of which can be replaced with a different element via the slot API. Because CardHeader typically lives inside a Card, it also responds to card-level context such as appearance, size, orientation, focusMode, selected/defaultSelected, and disabled, so a header can visually and behaviorally follow the state of its parent card without additional wiring. The header, description, and image content are passed as React nodes or slot values rather than plain strings, which allows rich typography components such as Body1 and Caption1, badges, or custom markup to be placed inside the header. The action slot accepts interactive content, most commonly an icon Button with a transparent appearance and an aria-label such as 'More options', and is aligned to the trailing edge of the header row.

**When to use**: Use CardHeader when you need a consistent identity block at the top of a Card: a logo or thumbnail, a title, a secondary line of supporting text, and optionally a trailing action such as an overflow menu button. It is the right choice any time multiple cards appear together in a grid or list and must share identical internal alignment, spacing, and typography, because the component centralizes that layout instead of forcing each card author to hand-roll flexbox. Choose CardHeader over composing the same markup manually with Divider, Text, and Avatar elements when you want the card's size, appearance, focus mode, and selection state to automatically influence the header's padding and colors. Avoid CardHeader for standalone page headers, marketing hero banners, or content that is not inside or adjacent to a Card; reach for PageHeader patterns, Text, or Heading-type typography directly in those cases. If you only need a title with no image, description, or action, CardHeader still works and gracefully omits the unused regions, but a simple styled block may be lighter if you never intend to add those extras.

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

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `action` | — | No | Container that renders on the far end of the footer, used for action buttons. |
| `description` | — | Yes | Element used to render short descriptions related to the title. |
| `header` | — | Yes | Element used to render the main header title. |
| `image` | — | Yes | Element used to render an image or avatar related to the card. |
| `root` | — | Yes | Root element of the component. |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { CardHeader } from '@fluentui/react-components';
import { makeStyles, Button, Body1, Caption1 } from '@fluentui/react-components';
import { MoreHorizontal20Regular } from '@fluentui/react-icons';

export const Default = (): JSXElement => {
  const styles = useStyles();

  const powerpointLogoURL = resolveAsset('pptx.png');

  return (
    <div className={styles.container}>
      <CardHeader
        className={styles.header}
        image={{ as: 'img', src: powerpointLogoURL, alt: 'Microsoft PowerPoint logo' }}
        header={
          <Body1>
            <b>App Name</b>
          </Body1>
        }
        description={<Caption1>Developer</Caption1>}
        action={<Button appearance="transparent" icon={<MoreHorizontal20Regular />} aria-label="More options" />}
      />

      <CardHeader
        className={styles.header}
        header={
          <Body1>
            <b>App Name</b>
          </Body1>
        }
        description={<Caption1>Developer</Caption1>}
        action={<Button appearance="transparent" icon={<MoreHorizontal20Regular />} aria-label="More options" />}
      />

      <CardHeader
        className={styles.header}
        image={{ as: 'img', src: powerpointLogoURL, alt: 'Microsoft PowerPoint logo' }}
        header={
          <Body1>
            <b>App Name</b>
          </Body1>
        }
        action={<Button appearance="transparent" icon={<MoreHorizontal20Regular />} aria-label="More options" />}
      />

      <CardHeader
        className={styles.header}
        image={{ as: 'img', src: powerpointLogoURL, alt: 'Microsoft PowerPoint logo' }}
        header={
          <Body1>
            <b>App Name</b>
          </Body1>
        }
        description={<Caption1>Developer</Caption1>}
      />

      <CardHeader
        className={styles.header}
        header={
          <Body1>
            <b>App Name</b>
          </Body1>
        }
        action={<Button appearance="transparent" icon={<MoreHorizontal20Regular />} aria-label="More options" />}
      />

      <CardHeader
        className={styles.header}
        header={
          <Body1>
            <b>App Name</b>
          </Body1>
        }
        description={<Caption1>Developer</Caption1>}
      />

      <CardHeader
        className={styles.header}
        image={{ as: 'img', src: powerpointLogoURL, alt: 'Microsoft PowerPoint logo' }}
        header={
          <Body1>
            <b>App Name</b>
          </Body1>
        }
      />

      <CardHeader
        className={styles.header}
        header={
          <Body1>
            <b>App Name</b>
          </Body1>
        }
      />
    </div>
  );
};
```

## Best Practices

### Do's

- Always provide the header slot, since it is the only required content region and carries the primary identity of the card.
- Supply meaningful alternative text when the image slot renders an actual image element, so assistive technology can announce the logo or avatar purposefully.
- Give the action slot a single, clearly labeled control, typically an icon Button with appearance set to transparent and an explicit aria-label describing what it opens.
- Use the description slot for short secondary text such as a job title, file type, or timestamp, and render it with Caption1 so it visually recedes behind the header.
- Render header content with a typography component such as Body1 and bold text rather than raw markup, so type scale stays consistent with the rest of the design system.
- Let the parent Card drive appearance, size, orientation, focusMode, and selection behavior instead of duplicating those concerns on the header itself.
- Wrap long header or description strings deliberately and test at narrow container widths, since the header row competes for space with the image and action regions.
- Keep the action element non-focusable when the whole card is already selectable and the extra tab stop would be redundant, for example by accounting for the focusMode that the parent Card supplies.

### Don'ts

- Do not nest multiple unrelated buttons or a full toolbar in the action slot; the region is designed for one trailing affordance and will crowd the title.
- Do not omit alternative text on a decorative or informative image in the image slot, since screen reader users will otherwise hear a file name or nothing at all.
- Do not place paragraphs of body copy in the description slot; it is intended for a short caption-level line and long text will push the layout apart.
- Do not hard-code pixel paddings or margins on the header root that duplicate the values already derived from the card's size and appearance.
- Do not use CardHeader as a general-purpose two-column layout container outside of a Card, because its spacing and color tokens are derived from card context.
- Do not assume selection behavior works without a selectable parent Card; setting selected or onSelectionChange on a header that is not inside a selectable card will not produce meaningful interaction.
- Do not render an interactive element inside the header or description slots that competes for focus with the card's own selection target unless shouldRestrictTriggerAction is deliberately configured.
- Do not rely on color alone to communicate a selected or disabled state; pair it with the semantic state that the parent Card exposes.

## Accessibility

## See Also

- [layout category](../categories/layout.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
