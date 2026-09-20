# Persona

> **Package**: `@fluentui/react-persona` v9.7.4
> **Import**: `import { Persona } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

Persona is a data-display component that presents a person or entity as a compact, repeatable identity block combining an avatar, an optional presence indicator, and up to four lines of stacked text. It orchestrates the Avatar and PresenceBadge components so that size, spacing, and typography stay visually consistent across all six supported sizes (extra-small, small, medium, large, extra-large, and huge, with medium as the default). The name prop doubles as the default primary label, so a minimal Persona needs only a name, while richer instances layer secondaryText, tertiaryText, and quaternaryText for role, organization, or status details. Layout is controlled declaratively through textPosition (after, before, or below the avatar) and textAlignment (start or center), and the whole avatar can be swapped for a bare presence badge with presenceOnly. Persona renders no interactive elements of its own: it is purely presentational content meant to be embedded in rows, cards, menus, or lists.

**When to use**: Use Persona when you need to show a person's identity with more than just a picture — typically an avatar plus a name and one to three supporting lines (job title, email, availability). Use Avatar alone when space is extremely tight or the name is already rendered elsewhere in the surrounding layout, and use PresenceBadge alone (or Persona with presenceOnly) when only the availability status matters. Persona is the right choice for people pickers, contact cards, activity feeds, mention lists, and assignee rows where repeated instances must align to a common grid. Avoid Persona when you need a self-contained clickable control; wrap it in Button, MenuItem, or another interactive parent instead, because Persona exposes no click or keyboard handling of its own.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `name` | `string \| undefined` | — | No | The name of the person or entity represented by the Persona.  When `primaryText` is not provided, this will be used as the default value for `primaryText`. |
| `presenceOnly` | `boolean \| undefined` | `false` | No | Whether to display only the presence. |
| `size` | `"extra-small" \| "small" \| "medium" \| "large" \| "extra-large" \| "huge" \| undefined` | `medium` | No | The size of a Persona and its text. |
| `textAlignment` | `"center" \| "start" \| undefined` | `start` | No | The vertical alignment of the text relative to the avatar/presence. |
| `textPosition` | `"after" \| "before" \| "below" \| undefined` | `after` | No | The position of the text relative to the avatar/presence. |

### Prop Guidance

- **name**: The person or entity name and the single most important prop: it acts as the default primaryText, so supply it even when you also provide other text lines. Keep it as the canonical display name so it stays consistent with any primaryText you set. `Kevin Sturgis`
- **size**: Controls the scale of the avatar, the presence badge, and all text lines together. Defaults to medium. Use extra-small or small in dense lists and rows, medium as the general-purpose default, and large, extra-large, or huge for profile headers and hero areas. Note that the presence badge renders one step smaller than the Persona size. `medium`
- **textPosition**: Places the text block relative to the avatar/presence: after (default) for standard horizontal rows, before for right-aligned or trailing-avatar layouts, and below for centered card or tile layouts. Choose it to match the surrounding alignment instead of wrapping Persona in custom flex CSS. `below`
- **textAlignment**: Controls vertical alignment of the text relative to the avatar/presence. Use start (default) for top-aligned text typical of multi-line rows, and center when a short primary line should sit visually centered against the avatar, which is common with textPosition set to before or below. `center`
- **presenceOnly**: When true, the avatar is suppressed and the presence badge is shown in its place. Use it for compact availability rosters where identity is already established by an adjacent label; always supply a presence badge alongside it so the Persona renders something visible. `true`
- **avatar (slot)**: The Avatar to display. Accepts Avatar props such as color, image (with src), and className, so you can render a photo, initials, or a solid color. When a presence badge is also supplied, the badge is rendered inside the avatar as its presence rather than as a separate element. `avatar={{ color: 'colorful' }}`
- **presence (slot)**: The PresenceBadge to display, configured with presence status and out-of-office state. With an avatar present it decorates the avatar's corner; with presenceOnly it becomes the whole visual. Override its icon and className only when reproducing older presence visuals. `{ status: 'available' }`
- **primaryText (slot)**: The first and largest text line. It defaults to name, so only set it when the displayed label must differ from the person's name; keeping it omitted is the recommended pattern. `Kevin Sturgis`
- **secondaryText (slot)**: The second line, typically availability, email, or job title. Keep it short and pair it with a presence status so availability is not communicated by color alone. `Available`
- **tertiaryText (slot)**: The third line, useful for role or department detail. Reserve it for medium and larger sizes where there is room for a third line without crowding. `Software Engineer`
- **quaternaryText (slot)**: The fourth and smallest line, typically organization or location. Add it only in spacious layouts such as profile headers or cards, since table cells and sidebars rarely have room. `Microsoft`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `avatar` | — | No | Avatar to display.  If a PresenceBadge and an Avatar are provided, the Avatar will display the PresenceBadge as its presence. |
| `presence` | — | No | PresenceBadge to display.  If `presenceOnly` is true, the PresenceBadge will be displayed instead of the Avatar. |
| `primaryText` | — | No | The first line of text in the Persona, larger than the rest of the lines.  `primaryText` defaults to the `name` prop. We recomend to only use `name`, use `primaryText` when the text is  different than the `name` prop. |
| `quaternaryText` | — | No | The fourth line of text in the Persona. |
| `root` | — | Yes | — |
| `secondaryText` | — | No | The second line of text in the Persona. |
| `tertiaryText` | — | No | The third line of text in the Persona. |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Persona } from '@fluentui/react-components';
import type { PersonaProps } from '@fluentui/react-components';

export const Default = (props: Partial<PersonaProps>): JSXElement => {
  return (
    <Persona
      name="Kevin Sturgis"
      secondaryText="Available"
      presence={{ status: 'available' }}
      avatar={{
        image: {
          src: 'https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/office-ui-fabric-react-assets/persona-male.png',
        },
      }}
      {...props}
    />
  );
};
```

### AvatarSize

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, Persona } from '@fluentui/react-components';

export const AvatarSize = (): JSXElement => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Persona
        presence={{ status: 'available' }}
        size="extra-small"
        name="Kevin Sturgis"
        avatar={{ color: 'colorful' }}
        secondaryText="Available"
      />
      <Persona
        presence={{ status: 'available' }}
        size="small"
        name="Kevin Sturgis"
        avatar={{ color: 'colorful' }}
        secondaryText="Available"
      />
      <Persona
        presence={{ status: 'available' }}
        size="medium"
        name="Kevin Sturgis"
        avatar={{ color: 'colorful' }}
        secondaryText="Available"
      />
      <Persona
        presence={{ status: 'available' }}
        size="large"
        name="Kevin Sturgis"
        avatar={{ color: 'colorful' }}
        secondaryText="Available"
      />
      <Persona
        presence={{ status: 'available' }}
        size="extra-large"
        name="Kevin Sturgis"
        avatar={{ color: 'colorful' }}
        secondaryText="Available"
      />
      <Persona
        presence={{ status: 'available' }}
        size="huge"
        name="Kevin Sturgis"
        avatar={{ color: 'colorful' }}
        secondaryText="Available"
      />
    </div>
  );
};

AvatarSize.parameters = {
  docs: {
    description: {
      story: `A Persona supports different sizes, medium being the default.`,
    },
  },
};
```

### PresencePreviousBehavior

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';

export const PresencePreviousBehavior = (): JSXElement => {
  const styles = useStyles();
  const AwayFilledIcon = presenceAvailableRegular.small;
  const OfflineRegularIcon = presenceOfflineRegular.small;

  return (
    <div className={styles.root}>
      <span>Current Behavior</span>
      <Persona presence={{ status: 'away', outOfOffice: true }} name="Kevin Sturgis" secondaryText="Away - OOF" />
      <Persona presence={{ status: 'offline', outOfOffice: true }} name="Kevin Sturgis" secondaryText="Offline - OOF" />

      <span>Previous Behavior</span>
      <Persona
        presence={{
          status: 'away',
          outOfOffice: true,
          icon: <AwayFilledIcon />,
          className: styles.statusAway,
        }}
        name="Kevin Sturgis"
        secondaryText="Away - OOF"
      />
      <Persona
        presence={{
          status: 'offline',
          outOfOffice: true,
          icon: <OfflineRegularIcon />,
          className: styles.statusOffline,
        }}
        name="Kevin Sturgis"
        secondaryText="Offline - OOF"
      />
    </div>
  );
};

PresencePreviousBehavior.parameters = {
  docs: {
    description: {
      story: `PresenceBadge maps its presence to the behavior in v8. If the previous behavior is desired, it is
       possible to override the icon and className to match it. Note that Persona maps to one size
        smaller, such as \`huge\` to \`large\` and \`medium\` to \`small\`. As the size prop shows, Persona does not
        support tiny.`,
    },
  },
};
```

## Best Practices

### Do's

- Always supply name, since it becomes the default primaryText and gives the block a meaningful label without extra configuration.
- Pass a presence object with status (and outOfOffice when relevant) when availability matters, so the avatar renders an accurate presence indicator.
- Choose one of the six size values (extra-small through huge) to scale avatar, presence badge, and text together, rather than overriding typography manually.
- Use textPosition and textAlignment to adapt Persona to a row layout instead of writing custom flex or grid CSS around it.
- Provide the avatar slot with an image src for real people, and fall back to initials plus an avatar color when no photo is available.
- Set presenceOnly when the list is about status rather than identity, for example a compact availability roster.
- Keep secondaryText, tertiaryText, and quaternaryText short and ordered from most to least important, since they render as progressively smaller lines.
- Only set primaryText explicitly when the label you want to display differs from name, and keep the two consistent when both are present.

### Don'ts

- Don't attach click handlers or treat Persona as a button; wrap it in Button, MenuItem, or another interactive component that supplies focus and activation behavior.
- Don't set a primaryText that contradicts the name prop, because the mismatch produces confusing screen reader output and inconsistent visible labels.
- Don't use presenceOnly without providing a presence badge, since the avatar is suppressed and nothing meaningful remains in the layout.
- Don't re-implement sizing by hard-coding font sizes and avatar dimensions on the root; the size prop already coordinates all sub-parts.
- Don't request a tiny size — Persona does not support it, and its presence badge maps to one step smaller than the Persona size.
- Don't render all four text lines in narrow containers such as sidebars or table cells without a truncation strategy.
- Don't rely on presence color alone to communicate availability; pair it with secondaryText such as "Available" or "Away".
- Don't hand-compose an Avatar next to loose Text elements when Persona already handles the arrangement, spacing, and size mapping.

## Anti-Patterns

### Treating Persona as a clickable control

❌ Persona is a presentational component with no built-in interaction, focus handling, or activation semantics, so adding click behavior to it produces an inaccessible, non-keyboard-operable target.

✅ Wrap Persona inside Button, MenuItem, or another focusable component that provides roles, focus styling, and Enter/Space activation.

### Duplicating or contradicting the name with primaryText

❌ primaryText already defaults to name, so setting both to the same string is redundant, and setting them to different strings creates a visible label that disagrees with the announced name, confusing screen reader users and any code that keys off name.

✅ Provide name only, and set primaryText exclusively for cases where the rendered label genuinely differs from the person's name — keeping the two values semantically aligned.

### presenceOnly without a presence badge

❌ presenceOnly suppresses the avatar and renders the presence badge in its place; if no presence badge is supplied, the Persona collapses to a text block with no visual anchor and loses the status it was meant to communicate.

✅ Always pass a presence object with a status when presenceOnly is true, and pair the badge with secondaryText so availability is conveyed by more than color.

### Re-implementing Persona layout with custom CSS

❌ Hand-building an avatar plus stacked text out of Avatar and Text duplicates Persona's size mapping, spacing, and text alignment logic, and the result drifts from the design system as themes change.

✅ Use Persona with the size, textPosition, and textAlignment props, and limit customization to token-based styling on individual slots.

### Packing all four text lines into dense rows

❌ Tertiary and quaternary lines render very small and are easily clipped or made unreadable in narrow containers such as sidebars, table cells, and menu rows, which also harms contrast compliance.

✅ Match the number of text lines to the available space — one or two lines in dense rows, three or four only in roomier surfaces like cards or profile headers.

## Accessibility

**Requirements**: Persona itself has no interactive semantics, so the surrounding container must carry any interaction semantics and accessible name. WCAG 1.4.3 (contrast) applies to all four text lines, which should keep the neutral foreground colors provided by the Fluent theme; WCAG 1.4.4 (resize text) means text lines must remain readable when zoomed, so avoid fixed-height containers that clip them. WCAG 1.4.1 (use of color) requires that presence status not be conveyed by color alone — combine the presence indicator with secondaryText like "Available" or "Away". WCAG 1.1.1 applies to the avatar: when the avatar image conveys identity, it needs alternative text; when the adjacent text already names the person, the image can reasonably be treated as decorative. If Persona sits inside an interactive wrapper, that wrapper must meet 2.5.8 target-size guidance.

| Key | Action |
| --- | --- |
| `Tab` | Persona is not focusable itself; focus moves to the interactive parent (Button, MenuItem, link) that wraps it. |
| `Enter` | Activates the wrapping interactive element, not Persona, since Persona defines no keyboard handlers. |
| `Space` | Activates a wrapping button-like control; Persona does not respond to Space on its own. |
| `Escape` | Dismisses an enclosing Menu or Popover surface when Persona is used as a menu row's content. |
| `Arrow keys (Up/Down)` | Move between rows in a parent menu or listbox implementation; navigation is owned by that parent, never by Persona. |

**ARIA**: aria-label on the presence badge to announce the status text to assistive technology, alt on the avatar image to describe the depicted person when the image carries meaning, aria-hidden on decorative Persona instances whose information is repeated elsewhere in the same row, aria-label on the interactive wrapper element when the visible Persona text is not sufficient as an accessible name, aria-describedby on the wrapper when secondaryText, tertiaryText, or quaternaryText should be announced as supporting description

**Screen Reader**: Persona does not introduce a composite widget role, so assistive technology reads its parts in document order: the avatar (or presence badge when presenceOnly is set), then primaryText, secondaryText, tertiaryText, and quaternaryText as separate pieces of inline content. Because primaryText defaults to name, the first thing announced is normally the person's name, followed by the smaller supporting lines. When both an avatar and a presence badge are supplied, the badge is rendered inside the avatar rather than beside it, so its status is announced as part of the avatar and the avatar image should not duplicate that information. Without a wrapping group or label, long Persona instances can be read as a run-on string of text, so pair them with a labelled row or list item when several appear together.

## Styling

Style Persona through its slots with makeStyles rather than restructuring the DOM: pass className to the avatar and presence slot objects, and use the root slot for outer spacing. Prefer the size, textPosition, and textAlignment props for structure, then fine-tune with Griffel tokens such as tokens.spacingHorizontalS or tokens.spacingHorizontalM between avatar and text, tokens.spacingVerticalXXS between stacked text lines, and tokens.borderRadiusCircular when overriding the avatar shape. Typography overrides usually target the text lines: tokens.fontSizeBase500 for a prominent primary line, tokens.fontSizeBase300 or tokens.fontSizeBase200 for secondary and quaternary lines, with tokens.lineHeightBase300 to keep tight rows readable. Text colors map naturally to the neutral foreground ramp — tokens.colorNeutralForeground1 for the primary line and tokens.colorNeutralForeground2, tokens.colorNeutralForeground3, or tokens.colorNeutralForeground4 for the supporting lines — and tokens.colorNeutralBackground1 or tokens.colorNeutralBackground1Hover when a Persona row sits on a custom surface. For status recoloring, override the presence slot's className with your own presence color tokens rather than changing the Avatar. When truncating, apply overflow with text-overflow and a max-width on the text slot's className, since Persona sizes the text but does not clip it.

## Performance

Persona is a lightweight, purely presentational component, so rendering cost is dominated by its children: an avatar image and a presence badge. Beware of inline object literals for the avatar and presence slots in long or virtualized lists, because a fresh object on every render defeats memoization and forces the slot components to re-render; hoist those objects to module scope or memoize them. Style sheets should be created once with makeStyles at module scope rather than inside the render path. Avatar image loading is the main runtime cost — supply appropriately sized images so large photos are not downscaled for extra-small Personas, and avoid mounting thousands of Persona instances in a non-virtualized list. When text lines change frequently (for example live presence updates), keep the presence object stable by status value so unchanged rows skip work.

## Theming & Tokens

Persona participates in the Fluent theme through the Persona's typography and neutral color tokens, and it inherits from FluentProvider so it switches automatically between light, dark, and high-contrast themes. The text lines draw on the neutral foreground ramp — typically tokens.colorNeutralForeground1 for primaryText, with the smaller lines stepping through tokens.colorNeutralForeground2, tokens.colorNeutralForeground3, and tokens.colorNeutralForeground4 — and the size prop drives token-based font scales such as tokens.fontSizeBase500 and tokens.fontSizeBase400 down to tokens.fontSizeBase200, along with matching tokens.lineHeightBase values. Spacing between the avatar and text derives from the spacing scale (tokens.spacingHorizontalS, tokens.spacingHorizontalM, tokens.spacingVerticalXXS). Avatar colors and presence colors come from the Avatar and PresenceBadge theming (brand and palette color tokens used by the avatar, and presence status color tokens for available, away, busy, offline, and out-of-office), so recoloring should be done through those components' own theming rather than by overriding Persona's internals.

## Migration Notes

Persona in v9 replaces the Fabric and v8 Persona components with a slots-based API: instead of separate imageUrl, imageAlt, primaryText, and showSecondaryText style props, you pass objects to the avatar and presence slots and use child slots for each text line. The name prop now serves as the default for primaryText, so most v8 usages that set primaryText equal to the person's name can drop primaryText entirely. Presence mapping also changed: a PresenceBadge passed to the avatar slot renders inside the avatar as its presence, whereas presenceOnly replaces the avatar with the badge. Sizes map one step smaller than in v8 — for example huge maps to large and medium maps to small — and Persona does not support tiny at all. If the previous v8 presence rendering is required, the presence badge's icon and className can be overridden to reproduce the older visuals.

## Edge Cases

- When both an avatar and a presence badge are provided, the badge renders as the avatar's presence rather than as a sibling element, so the visual footprint does not grow — but if presenceOnly is also set, the avatar disappears and the badge takes its place.
- Presence badge sizing maps one step smaller than the Persona size: a huge Persona shows a large badge and a medium Persona shows a small badge. Persona has no tiny size, so very small presence rendering is not available.
- If name is omitted and primaryText is not supplied, the first text line is empty even though secondaryText and lower lines still render, producing a visually unbalanced block.
- The text lines are not truncated by Persona itself; long names or job titles will overflow or wrap depending on the parent container unless you apply your own overflow and max-width styles to the text slots.
- presenceOnly without a presence object leaves only the text lines rendering, silently removing the visual anchor the layout may have been sized around.
- textPosition set to before reverses the visual order so the text precedes the avatar; in left-to-right reading contexts this changes the order in which the name and image are perceived, so verify it against the intended alignment.
- Older v8 presence visuals are not reproduced automatically — the presence badge's icon and className must be overridden if the previous rendering is required.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
