# Avatar

> **Package**: `@fluentui/react-avatar` v9.11.2
> **Import**: `import { Avatar } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

Avatar is a data-display component that represents a person, group, or entity in a compact visual footprint. It renders in a strict priority order: an image when the image slot provides a source, otherwise initials derived automatically from the name prop (or supplied directly through the initials slot), and finally an icon when neither an image nor initials exist. Avatar is configurable through size (a constrained pixel scale from 16 through 128, defaulting to 32), shape (circular for people, square for teams, tenants, and rooms), and color (neutral, brand, colorful with name-based hashing, or one of the named theme palette colors such as seafoam, grape, or pumpkin). It also supports activity signaling through active and activeAppearance, so a single avatar can indicate that a person is currently speaking, typing, or otherwise present. An optional badge slot carries presence information, and it is conventionally filled with a PresenceBadge status such as available, busy, away, offline, do-not-disturb, blocked, or out-of-office, optionally combined with the out-of-office indicator. Avatar is purely presentational and non-interactive; it is typically composed inside Button, MenuTrigger, Persona, or AvatarGroup contexts rather than being used as a control on its own.

**When to use**: Use Avatar whenever you need to identify an individual or entity in a small amount of space: table cells, list rows, cards, navigation items, headers, toolbar buttons, and message threads. Reach for Avatar when the identity is already clear from surrounding text, or when the visual is the primary identifier. Choose Persona instead when the full name, secondary metadata, or an accompanying action must be displayed alongside the image, because Persona composes an Avatar with text. Choose AvatarGroup when several people must be shown together with overflow behavior, and use PresenceBadge through the badge slot rather than a free-standing badge when the status belongs to the avatar itself. Prefer plain Image for non-person imagery, since Avatar is scoped to representing a person or entity. When the avatar needs to be clickable, do not add click handlers to it directly; instead place it inside a Button, Link, or other focusable control so keyboard and target-size behavior are handled correctly. Use icon-based avatars for guests, groups, meeting rooms, or tenants where initials would be meaningless, and always pair those with an explicit accessible label.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `active` | `"active" \| "inactive" \| "unset" \| undefined` | `unset` | No | Optional activity indicator * active: the avatar will be decorated according to activeAppearance * inactive: the avatar will be reduced in size and partially transparent * unset: normal display |
| `activeAppearance` | `"ring" \| "shadow" \| "ring-shadow" \| undefined` | `ring` | No | The appearance when `active="active"` |
| `color` | `"neutral" \| "brand" \| "colorful" \| AvatarNamedColor \| undefined` | `neutral` | No | The color when displaying either an icon or initials. * neutral (default): gray * brand: color from the brand palette * colorful: picks a color from a set of pre-defined colors, based on a hash of the name (or idForColor if provided) * [AvatarNamedColor]: a specific color from the theme |
| `idForColor` | `string \| undefined` | — | No | Specify a string to be used instead of the name, to determine which color to use when color="colorful". Use this when a name is not available, but there is another unique identifier that can be used instead. |
| `name` | `string \| undefined` | — | No | The name of the person or entity represented by this Avatar. This should always be provided if it is available.  The name is used to determine the initials displayed when there is no image. It is also provided to accessibility tools. |
| `shape` | `AvatarShape \| undefined` | `circular` | No | The avatar can have a circular or square shape. |
| `size` | `AvatarSize \| undefined` | `32` | No | Size of the avatar in pixels.  Size is restricted to a limited set of supported values recommended for most uses (see `AvatarSizeValue`) and based on design guidelines for the Avatar control.  Note: At size 16, if initials are displayed, only the first initial will be rendered.  If a non-supported size is needed, set `size` to the next-smaller supported size, and set `width` and `height` to override the rendered size.  For example, to set the avatar to 45px in size: `<Avatar size={40} style={{ width: '45px', height: '45px' }} />` |

### Prop Guidance

- **name**: The identity of the person or entity. Always provide it when available: it determines the initials rendered in the absence of an image and supplies the accessible name announced by screen readers. It is also the input to colorful color hashing. `Ashley McCarthy`
- **active**: Signals whether the entity is currently active, inactive, or neither. Use active for genuine live states such as a person speaking or typing, inactive for de-emphasized or unavailable participants, and leave unset for ordinary display. Inactive reduces the avatar size and applies partial transparency. `active`
- **activeAppearance**: Controls the decoration applied when active is set to active. Use ring for a clean outline, shadow for a softer glow on busy backgrounds, and ring-shadow when the avatar sits on a surface where both are needed for visibility. It has no effect unless active is set to active. `ring-shadow`
- **color**: Selects the background and foreground used for initials and icons. Use neutral for the default gray treatment, brand when the avatar should reflect the product's brand, colorful to let the component pick a stable pseudo-random palette color, and a named palette color when a specific theme color is required. It has no effect when an image is displayed. `colorful`
- **idForColor**: Supplies a stable string to hash when a name is unavailable but the color must remain consistent for the same entity, for example an identifier, an email address, or a numeric key. `Guest-23`
- **shape**: Chooses the silhouette. Keep circular for people and switch to square for teams, tenants, meeting rooms, and other non-person entities so the shape itself carries meaning. `square`
- **size**: Sets the rendered size in pixels from a constrained design-approved scale, defaulting to 32. At size 16 only the first initial is rendered. For an unsupported dimension, set size to the next-smaller supported value and override width and height through the root style. `48`
- **image**: Provides the photographic representation through the image slot. Pair it with a name so initials display during loading and act as a fallback if the image fails, and ensure the surrounding context still identifies the person when the image is decorative. `src pointing at the person's photo`
- **initials**: Overrides the initials derived from name. Use it only for cases the automatic derivation handles poorly, such as a multi-part name where three letters are desired, and keep passing name so the avatar remains accessible. `CRF`
- **icon**: Renders an icon in place of initials for entities without a personal name, such as guests, groups, calendars, tenants, or rooms. It only appears when there is no image and no initials, and it should always be accompanied by an aria-label. `guest icon for an unidentified user`
- **badge**: Displays presence information in the corner of the avatar. Pass a status object describing the presence state, optionally with an out-of-office flag, or supply a custom icon when the standard status set does not fit. `status busy with out-of-office enabled`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `badge` | — | No | Badge to show the avatar's presence status. |
| `icon` | — | No | Icon to be displayed when the avatar doesn't have an image or initials. |
| `image` | — | No | The Avatar's image.  Usage e.g.: `image={{ src: '...' }}` |
| `initials` | — | No | (optional) Custom initials.  It is usually not necessary to specify custom initials; by default they will be derived from the `name` prop, using the `getInitials` function.  The initials are displayed when there is no image (including while the image is loading). |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import type { ArgTypes } from '@storybook/react-webpack5';
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Avatar } from '@fluentui/react-components';
import type { AvatarProps } from '@fluentui/react-components';

export const Default = (props: Partial<AvatarProps>): JSXElement => <Avatar aria-label="Guest" {...props} />;

const argTypes: ArgTypes = {
  initials: {
    control: {
      type: 'text',
    },
  },
  badge: {
    control: {
      type: 'inline-radio',
      options: [{ status: 'away' }, { status: 'busy' }],
    },
  },
  size: {
    control: {
      type: 'select',
      options: [16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96, 120, 128],
    },
  },
  name: {
    control: {
      type: 'text',
    },
  },
};

Default.argTypes = argTypes;
```

### ActiveAppearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Avatar } from '@fluentui/react-components';

export const ActiveAppearance = (): JSXElement => (
  <div style={{ display: 'flex', gap: '20px' }}>
    <Avatar active="active" activeAppearance="ring" name="Ring" />
    <Avatar active="active" activeAppearance="shadow" name="Shadow" />
    <Avatar active="active" activeAppearance="ring-shadow" name="Ring Shadow" />
  </div>
);

ActiveAppearance.parameters = {
  docs: {
    description: {
      story:
        'An avatar can have different appearances when `active="active"`. ' +
        'Avatar supports `ring`, `shadow`, and `ring-shadow`. The default is `ring`.',
    },
  },
};
```

### Active

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Avatar } from '@fluentui/react-components';

export const Active = (): JSXElement => (
  <div style={{ display: 'flex', gap: '20px' }}>
    <Avatar active="active" name="Ashley McCarthy" />
    <Avatar active="inactive" name="Isaac Fielder" badge={{ status: 'away' }} />
  </div>
);

Active.parameters = {
  docs: {
    description: {
      story:
        'An avatar can communicate whether a user is currently active (for example, speaking or typing). ' +
        'Avatar supports `active`, `inactive`, and `unset`. The default is `unset`.',
    },
  },
};
```

## Best Practices

### Do's

- Always pass the name prop when it is available. The name derives the displayed initials and provides the accessible name that screen readers announce.
- Provide an explicit aria-label when no name exists, such as icon avatars for a guest, a group, a meeting, or a tenant, so the visual is not the only identifier.
- Pick sizes from the supported scale (16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96, 120, 128). For anything in between, set size to the next-smaller supported value and override width and height on the root style.
- Use color set to colorful for people or entities whose color should stay visually stable across sessions, since the color is chosen from a hash of the name.
- Pass idForColor whenever the identity is known by an identifier rather than a name, so the colorful palette still produces a stable, deterministic color.
- Combine a badge status with the out-of-office option when a person is away from their desk, so the presence indicator communicates both availability and the reason.
- Include a name alongside the image slot. The initials render while the image loads and serve as the fallback if the image cannot be displayed, avoiding an empty circle.
- Use square shapes for non-human entities such as teams, tenants, and rooms, and reserve circular shapes for individual people.
- Reserve active set to active for genuinely active states such as speaking or typing, and choose an activeAppearance that stands out against the surrounding surface.
- Wrap an avatar in a Button, Link, or MenuTrigger when it must be interactive, so focus, keyboard activation, and target size come from the parent control.

### Don'ts

- Do not render an avatar with only an icon or only initials and no name or aria-label. Screen readers will have nothing meaningful to announce.
- Do not pass arbitrary pixel values to size. Off-scale sizes break alignment with the design grid and can clip initials.
- Do not expect initials and icon to appear together. The icon is only rendered when there is no image and no initials, so supplying both silently drops the icon.
- Do not attach onClick or other interaction handlers to the avatar root. The component is not focusable and exposes no button semantics.
- Do not use sizes 16 or 20 for interactive avatars without compensating spacing, since the target may fall below WCAG minimum target size requirements.
- Do not mark every avatar in a list as active. Constant activity indicators create noise and dilute the meaning of the ring or shadow decoration.
- Do not hardcode background or foreground colors when neutral, brand, colorful, or a named palette color already expresses the intent, as hardcoded values will not respond to theme changes.
- Do not use Avatar when the surrounding UI must display a person's full name and job title; use Persona, which composes the avatar with text.
- Do not rely on avatar color to convey meaning such as team membership or status, because color carries no accessible information on its own.

## Anti-Patterns

### Clickable avatar

❌ Attaching an onClick handler or pointer cursor to the Avatar root makes it look interactive while it remains non-focusable, exposes no button semantics to assistive technology, and can fall below the minimum target size at small sizes.

✅ Compose the avatar inside a Button, Link, or MenuTrigger so focus management, keyboard activation with Enter and Space, and target size are handled by the parent control.

### Nameless or unlabeled avatar

❌ Rendering an avatar with only a decorative icon or initials and no name or aria-label leaves screen reader users with no way to identify the person or entity, violating non-text content and name requirements.

✅ Always provide name when it is known, and supply an aria-label whenever it is not, such as for icon-based guest, group, or meeting-room avatars.

### Off-scale sizing

❌ Passing values such as 45 to size bypasses the design-approved scale, produces inconsistent typography and badge placement across a layout, and can clip initials inside the circle.

✅ Use the nearest supported size from the documented scale and, only if the exact dimension is mandatory, override width and height on the root style and adjust typography tokens to match.

### Unstable colorful identity

❌ Using color set to colorful without a stable derived key causes the avatar color to change whenever the display name changes, which undermines the color as a recognition cue.

✅ Pass idForColor with a stable identifier such as a user id, email address, or numeric key so the same entity always hashes to the same palette color.

### Decorating everything as active

❌ Setting active to active on every avatar in a roster turns the ring or shadow decoration into visual noise and removes any signal about who is actually speaking or typing.

✅ Apply active only to the entity currently generating activity, use inactive for demoted or unavailable participants, and leave the rest unset.

## Accessibility

**Requirements**: Avatar is a non-focusable, non-interactive element, so its accessibility depends almost entirely on the accessible name. WCAG 1.1.1 (Non-text Content) requires a text alternative, which is satisfied by passing name or an explicit aria-label. WCAG 4.1.2 (Name, Role, Value) requires that any composed interactive wrapper, such as a Button or Link containing the avatar, expose its own name. WCAG 1.4.11 (Non-text Contrast) applies to the active ring, the badge, and the boundary of the avatar against its background. WCAG 2.5.8 (Target Size) applies when the avatar is placed inside an interactive element: the documentation explicitly advises avoiding sizes 16 and 20 for interactive avatars, or ensuring at least 8px of spacing for size 16 and 4px for size 20. Color choices such as neutral, brand, colorful, and named palette colors are decorative and must never be the only way information is conveyed.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the avatar only when it is composed inside a focusable element such as a Button or Link. The Avatar root itself is not part of the tab order. |
| `Enter` | Activates the surrounding Button or Link that contains the avatar. Avatar does not handle this key itself. |
| `Space` | Activates the surrounding Button or other button-semantics control that contains the avatar. Avatar does not handle this key itself. |

**ARIA**: aria-label, aria-labelledby, aria-hidden

**Screen Reader**: Avatar exposes its identity through the accessible name derived from the name prop or from an explicit aria-label, and that name is announced once as a single image-like element rather than as separate image, initials, and icon elements. When a badge is present, the presence status is announced from the badge slot's own semantics, so the combined output reads as the person plus their status, such as a name followed by busy or out of office. Slotted icons and the rendered avatar image are decorative and should be hidden from assistive technology so the identity is not repeated. If neither name nor aria-label is provided, the avatar is announced without any meaningful identity, which is why an aria-label is required for icon-only and initials-only usages.

## Styling

Style Avatar with Griffel makeStyles and the theme tokens rather than raw values. The circular shape is driven by tokens.borderRadiusCircular and the square shape by tokens.borderRadiusMedium, and the default thin outline uses the transparent stroke token so the size stays consistent across appearances. The neutral avatar derives its look from tokens.colorNeutralBackground6 for the background and tokens.colorNeutralForeground3 for the icon and initials, while the brand appearance pulls from the brand ramp and named or colorful appearances map onto the palette token families such as tokens.colorPaletteRedBackground3 with tokens.colorPaletteRedForeground3. Initials scale with the size prop, so if you override the rendered dimensions with width and height on the root style you may also want to override the typography using tokens.fontSizeBase200 through tokens.fontSizeBase500 and the matching tokens.lineHeightBase* values to keep the text proportional. The active ring is drawn with a stroke-width token such as tokens.strokeWidthThick plus a stroke color token from the theme. For fine positioning of the badge relative to the avatar edge, adjust spacing with tokens.spacingHorizontalXS or tokens.spacingVerticalXS on a custom badge wrapper. Because size already computes font size, line height, and badge placement, prefer changing size over hand-tuning dimensions; only override width and height when an off-scale dimension is unavoidable, and consider className-based overrides on the root slot so they remain easy to remove.

## Performance

Avatar is a lightweight, non-interactive component that renders a single root element plus at most an image, an initials span, an icon, and a badge, so it is cheap to render even in dense lists. The main costs are image decoding and, for large rosters, sheer element count, so prefer rendering avatars inside virtualized or overflow-aware containers rather than mounting hundreds at once. Colorful color resolution hashes the name or idForColor on each render of each avatar; the hash itself is inexpensive, but in very large lists it repeats per instance, so keep the name or id value stable rather than recomputing it inline. Images render the initials during loading, which means the fallback path is always present and does not require a separate loading branch in your code. Avoid recreating slot objects and inline style objects on every render when avatars are part of a frequently re-rendering list, and prefer stable className references from makeStyles over ad-hoc inline styles for the root.

## Theming & Tokens

Avatar is fully theme-aware and responds to the FluentProvider theme, including light, dark, and custom brand themes. The neutral appearance maps to neutral surface and foreground tokens such as tokens.colorNeutralBackground6 and tokens.colorNeutralForeground3, while the brand appearance draws from the brand ramp so themed brand colors propagate automatically. Colorful and named palette colors resolve to palette token families, for example tokens.colorPaletteRedBackground3 paired with tokens.colorPaletteRedForeground3, which means a named color such as pumpkin, seafoam, or grape follows the theme's palette values in both light and dark themes. Shape uses tokens.borderRadiusCircular for circular avatars and tokens.borderRadiusMedium for square avatars, the active ring uses a stroke-width token such as tokens.strokeWidthThick together with a theme stroke color, and initials typography follows the theme's font size and line height base tokens for the selected size. Because all of these are theme tokens rather than fixed values, overriding them in a custom theme changes every avatar consistently, and style overrides placed on the root should also prefer tokens so they continue to track theme changes.

## Migration Notes

In v9, Avatar is a self-contained, token-driven component rather than a thin wrapper over a persona-style layout. Identity, sizing, and appearance are all expressed through dedicated props: a single constrained size scale from 16 to 128 replaces ad-hoc pixel sizing, color takes a semantic value (neutral, brand, colorful, or a named theme palette color) instead of an arbitrary color value, and presence is expressed declaratively by passing a status object into the badge slot rather than by composing separate pieces. Group display and presence are now separate concerns handled by AvatarGroup and PresenceBadge, which compose with Avatar instead of being built into it. When migrating, move any per-avatar color values onto the color prop with a named palette color, replace raw pixel sizes with the nearest supported size value plus width and height overrides when necessary, and add a name or aria-label to every avatar that previously relied on surrounding text for identity.

## Edge Cases

- At size 16, only the first initial is rendered even when a multi-part name or three-character custom initials are supplied.
- Sizes outside the supported scale are not accepted. The documented workaround is to set size to the next-smaller supported value and override width and height on the root style, but the initials typography and badge position remain tied to the smaller size value, so text may not scale proportionally with the enlarged frame.
- Initials appear not only when no image is provided but also while an image is loading and whenever the image cannot be displayed, so omitting name next to an image can leave an empty circle during load or on a failed request.
- The icon slot renders only when there is no image and no initials. If a name or custom initials are present, a supplied icon is silently not displayed.
- Custom initials passed through the initials slot override the initials derived from name, but the name is still required for the accessible name; supplying only initials leaves the avatar unlabeled for assistive technology.
- Setting active to inactive both reduces the rendered avatar size and applies partial transparency, which can visually misalign a row of avatars that mixes active and inactive states.
- Colorful color selection depends on a stable hash input. Without name or idForColor the color is not meaningfully deterministic, and changing the name changes the color.
- Color and shape have no visible effect when an image fully covers the avatar, since the image is painted over the background treatment.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
