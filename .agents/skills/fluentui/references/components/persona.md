# Persona

> **Package**: `@fluentui/react-persona` v9.7.4
> **Import**: `import { Persona } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

Persona is a data-display component that presents a person or entity as a compact identity block: an avatar, an optional presence badge, and up to four lines of text. It composes the Avatar and PresenceBadge components through its avatar and presence slots and exposes the text lines through the primaryText, secondaryText, tertiaryText, and quaternaryText slots, with primaryText defaulting to the name prop. The size prop scales the whole block (avatar, badge, and text) from extra-small through huge, while textPosition (after, before, below) and textAlignment (start, center) control how the text sits relative to the avatar and badge. With presenceOnly the avatar is replaced by the presence badge so the component can act as a pure status indicator. Persona is purely presentational: it adds no roles, tab stops, or keyboard behavior of its own, so interactivity comes from whatever control wraps it, such as a Button or Link.

**When to use**: Use Persona wherever a person or entity must be identified with more context than a picture alone: contact and profile cards, people pickers and mention lists, org charts, table and list rows, and message or comment headers. Use textPosition after for inline rows, below for larger profile-style layouts, and before when the identity block must sit at the trailing edge of a row. Use presenceOnly when the availability indicator alone carries the meaning, use Avatar by itself when only the picture matters, and use PresenceBadge directly when a status dot is needed outside any identity context. Because Persona renders real text nodes for every identity line, prefer it over manually assembling an Avatar plus separate text elements whenever the multi-line identity pattern applies.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `name` | `string \| undefined` | — | No | The name of the person or entity represented by the Persona.  When `primaryText` is not provided, this will be used as the default value for `primaryText`. |
| `presenceOnly` | `boolean \| undefined` | `false` | No | Whether to display only the presence. |
| `size` | `"extra-small" \| "small" \| "medium" \| "large" \| "extra-large" \| "huge" \| undefined` | `medium` | No | The size of a Persona and its text. |
| `textAlignment` | `"center" \| "start" \| undefined` | `start` | No | The vertical alignment of the text relative to the avatar/presence. |
| `textPosition` | `"after" \| "before" \| "below" \| undefined` | `after` | No | The position of the text relative to the avatar/presence. |

### Prop Guidance

- **name**: The identity of the person or entity and the default value for primaryText. Always set it even when you also set primaryText, because the avatar and presence derived from the identity still describe the same person. Keep it to the display form of the name rather than an identifier such as an email address. `Kevin Sturgis`
- **size**: Scales the avatar, presence badge, and text together. Defaults to medium. Use extra-small and small inside dense lists, tables, and pickers; medium for standard rows; large, extra-large, and huge for profile headers and detail views where the identity is the focus. `medium`
- **textPosition**: Places the text relative to the avatar and badge. after is the default and best for rows and inline layouts, below stacks text under the avatar for card-style layouts that have vertical room, and before mirrors after for right-aligned or trailing layout needs. `after`
- **textAlignment**: Controls vertical alignment of the text against the avatar and badge. start is the default and keeps lines anchored to the top edge; center aligns the block vertically and is most useful with single-line text or when textPosition is below and the block should look balanced. `start`
- **presenceOnly**: Replaces the avatar with the presence badge so only the status indicator is shown. Use it for compact status columns, roster views, or inline availability marks where the identity text is already displayed elsewhere. Defaults to false. `true`
- **avatar**: Supplies the Avatar to display, including image source, color, and other avatar options. When both avatar and presence are provided, the avatar renders the presence badge as its own presence indicator, so configure the badge through the presence slot and the picture through this slot. `avatar with an image source and a colorful color option`
- **presence**: Supplies the PresenceBadge to display, with a status value and optional out of office flag, icon override, and className override. Omitting it removes the status indicator; supplying it together with an avatar attaches the badge to the avatar. `status available`
- **primaryText**: The first and largest text line. It defaults to name, so only set it when the text shown must differ from the identity, for example a display handle instead of a legal name. It accepts text content or slot props for styling. `Kevin S.`
- **secondaryText**: The second line, typically used for availability, job title, or a short qualifier such as Available or Away - OOF. This is the recommended place to spell out presence status so it is not conveyed by color alone. `Available`
- **tertiaryText**: The third line, suited to role or department information in profile-style layouts where textPosition is after or below. Avoid it in compact sizes where the extra line adds clutter. `Software Engineer`
- **quaternaryText**: The fourth and final line, typically the organization or location. Use it only in the largest layouts such as profile cards and account headers, and trim it in dense lists. `Microsoft`

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

- Set name as the single source of identity and let primaryText inherit from it, adding primaryText only when the displayed heading must differ from the identity used by the avatar and presence badge.
- Pair every presence status with a matching secondaryText such as Available or Away - OOF so status is readable as text and not conveyed by the badge color alone.
- Choose size deliberately: extra-small and small for dense lists and compact rows, medium as the default, and large, extra-large, or huge for profile headers and detail panes.
- Use textPosition below only in layouts with enough vertical room, such as profile cards, and keep textPosition after for table rows, list items, and toolbars.
- Replace the avatar slot content explicitly when you need an image, a specific color, or sizing control, and provide the avatar image source rather than relying on default initials for people users should recognize.
- Use the presence slot object to override the badge icon or className, as demonstrated by the previous-behavior story, when you must reproduce a legacy presence look.
- Keep each Persona limited to the lines you actually display (primaryText plus at most secondaryText, tertiaryText, and quaternaryText) so the block does not carry hidden text payload.

### Don'ts

- Do not attach click handlers to Persona's root to make it act like a button; it renders no interactive semantics, so wrap it in a Button or Link instead.
- Do not set name and primaryText to the same string; that duplicates the identity line and makes the intent of primaryText ambiguous.
- Do not use quaternaryText or long names in extra-small and small sizes, where the narrow column will crowd or truncate the text.
- Do not assume the presence slot renders as a separate element beside the avatar; when an avatar and a presence badge are both provided, the badge becomes the avatar's presence indicator.
- Do not treat presenceOnly as a general hide-the-avatar switch while still expecting the full multi-line layout; its purpose is to display only the presence indicator.
- Do not rely on the presence badge color as the only signal of availability, and do not leave avatar images without an accessible description.
- Do not use Persona to display non-identity content such as document metadata or file properties; use Card, Text, or Table cells for that.

## Anti-Patterns

### Persona used as a clickable row

❌ Persona renders as a non-interactive presentational container with no role, no tab stop, and no keyboard activation, so attaching a click handler to the root produces a target that mouse users can reach and keyboard and screen reader users cannot.

✅ Wrap the Persona in a Button or Link, or place it inside a Menu item or list option, so focus, Enter, and Space activation, and an accessible name come from the surrounding control.

### Duplicating identity in name and primaryText

❌ Setting primaryText to the same string as name adds redundant configuration and blurs the distinction between the identity that drives the avatar and presence badge and the text that is displayed.

✅ Set name alone for the common case; use primaryText only when the visible heading must differ from the identity, such as a nickname or short display name.

### Status communicated by badge color only

❌ The presence badge expresses state primarily through color and icon, so color-blind and low-vision users, as well as screen reader users, may miss the status entirely; this fails WCAG 1.4.1 Use of Color.

✅ Always pair the presence badge with a matching secondaryText such as Available, Away - OOF, or Offline, and provide an accessible description for the badge or the containing interactive control.

### Expecting a separate badge next to the avatar

❌ When an avatar and a presence badge are both provided, the badge is rendered as the avatar's presence indicator rather than as an independent element in the layout, so spacing or alignment rules written for a separate badge break.

✅ Design for the badge sitting on the avatar corner when both slots are used, and reserve the stand-alone badge layout for presenceOnly or for usage without an avatar.

## Accessibility

**Requirements**: Persona itself is a non-interactive container, so accessibility hinges on how it is used and what surrounds it. The identity must exist as real text through name or primaryText rather than only inside an image, and avatar images must carry an accessible description. Status must not be communicated by color alone (WCAG 1.4.1 Use of Color), because the presence badge relies on its color and icon; supply supporting text through secondaryText or an explicit badge label. Text rendered by Persona must meet WCAG 1.4.3 contrast for the active theme, which the default colorNeutralForeground tokens satisfy. When a Persona is placed inside an interactive control, that control must expose a meaningful accessible name, since the Persona contributes no name of its own.

| Key | Action |
| --- | --- |
| `Tab` | Persona adds no tab stop; focus moves past it to the next focusable element, or into the interactive control that wraps it. |
| `Enter` | No effect on Persona itself; when Persona is wrapped in a Button or Link, the wrapping control activates. |
| `Space` | No effect on Persona itself; when Persona is wrapped in a Button, the wrapping control activates. |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-hidden

**Screen Reader**: Screen readers encounter Persona as a plain sequence of elements in DOM order: the avatar, then the text lines, with the badge adjacent to the avatar when both slots are used. Nothing in Persona announces itself as a group or live region, so a persona row is read as the identity text plus whatever label the avatar image or badge contributes. Because the badge conveys status by color and icon, without accompanying text or an explicit accessible name a screen reader user may hear only a generic image or nothing at all; pairing status with secondaryText is the reliable way to have the state announced.

## Styling

Style Persona through its slots using makeStyles and Griffel tokens rather than overriding internals. Pass a className to the root for layout concerns such as grid placement or width, and use the slot object form for avatar, presence, primaryText, secondaryText, tertiaryText, and quaternaryText to apply per-slot classes; the presence slot accepts both className and icon overrides, which is the supported way to restyle or re-color a badge (for example a styles.statusAway class applied to the presence slot). Text colors come from tokens.colorNeutralForeground1 for primaryText and tokens.colorNeutralForeground2 or tokens.colorNeutralForeground3 for the supporting lines, with tokens.fontSizeBase300 and tokens.fontSizeBase200 for typical body and caption sizes and tokens.lineHeightBase300 or tokens.lineHeightBase200 for matching line heights. Emphasize a name with tokens.fontWeightSemibold, separate lines with spacing tokens such as tokens.spacingVerticalXS or tokens.spacingVerticalS, and space the avatar from the text with tokens.spacingHorizontalS or tokens.spacingHorizontalM. Rounded avatar shapes come from the Avatar slot itself, so change shape or color through avatar props rather than CSS on the Persona root.

## Performance

Persona is a lightweight presentational component: it renders no portals, popups, observers, or layout effects, and its cost is essentially the DOM nodes of the avatar, badge, and text lines. The main cost driver is the avatar image, which triggers a network request and decode per distinct source, so in long lists prefer extra-small or small sizes, reuse the same image URL, and consider rendering presence only when a picture is not needed. Passing stable avatar and presence object references (hoisted out of the render loop) avoids re-diffing the underlying Avatar and PresenceBadge on every render, and omitting unused text slots removes nodes from large virtualized lists. Because text lines are plain nodes with no truncation measurement, extremely long names should be shortened at the data layer instead of relying on the component to clamp them.

## Theming & Tokens

Persona is fully theme-driven and adapts automatically to light, dark, and high-contrast themes applied through the Provider. Its text uses the neutral foreground ramp, with tokens.colorNeutralForeground1 for the primary identity line and tokens.colorNeutralForeground2 and tokens.colorNeutralForeground3 for the supporting lines, plus typography tokens such as tokens.fontSizeBase300, tokens.fontSizeBase200, tokens.lineHeightBase300, and tokens.lineHeightBase200 that step down with smaller sizes, and tokens.fontWeightSemibold for emphasis. Spacing between the avatar and text comes from tokens.spacingHorizontalS and tokens.spacingHorizontalM, with tokens.spacingVerticalXS and tokens.spacingVerticalS used between stacked lines. The presence badge takes its status colors from palette tokens such as tokens.colorPaletteGreenForeground1 and its out of office treatment from the same palette family, while the avatar draws on the theme's brand and neutral background tokens; overriding presence visuals with className or icon in the presence slot will opt that piece out of the automatic theme response.

## Migration Notes

Fluent UI v8 personas used a flat set of string and color props; in v9 the picture and its styling move into the avatar slot, and the identity lines are discrete slots (primaryText, secondaryText, tertiaryText, quaternaryText) that accept text or slot props. primaryText now defaults to name, so the heading no longer has to be repeated explicitly. Sizes map one step smaller than the corresponding presence badge sizes, for example huge maps to large and medium maps to small, and Persona does not support the tiny size. The presence badge follows the v8 presence mapping by default; to reproduce a previous icon and color behavior you override the icon and className inside the presence slot object, as the previous-behavior story demonstrates.

## Edge Cases

- When presenceOnly is set, the avatar is replaced by the presence badge, so avatar slot props such as an image source have no visible effect in that configuration.
- primaryText defaults to name, so providing both is only meaningful when the displayed heading differs from the identity; otherwise the second value is redundant configuration.
- Because a presence badge given alongside an avatar becomes the avatar's presence indicator, it does not appear as a separate element and will not respond to layout rules written for a sibling badge.
- The size scale is one step smaller than the corresponding presence badge sizes and omits tiny, so a design that assumed a huge badge maps to the large Persona and the smallest supported persona size remains extra-small.
- To reproduce the previous icon and color behavior of a presence status, you must override both icon and className inside the presence slot object; the default mapping follows the v8 behavior rather than the custom icon.
- A Persona with textPosition below and all four text lines occupies significant vertical space, so it can misalign rows inside grids, tables, and toolbars that assume uniform height.
- Persona contributes no accessible name of its own, so when placed inside a Button or Link the surrounding control must be given its own label or be described by the rendered identity text.

## See Also

- - [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
