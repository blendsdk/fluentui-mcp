# Avatar

> **Package**: `@fluentui/react-avatar` v9.11.2
> **Import**: `import { Avatar } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

Avatar is a data-display component that represents a person, group, or other entity as a compact, recognizable visual unit. It is exported from @fluentui/react-components and renders a single root element whose contents are chosen from a prioritized fallback chain: an image (provided through the image slot), then initials (derived from the name prop using getInitials, or supplied directly through the initials slot), then an icon (the icon slot). A fourth slot, badge, overlays a presence/status indicator on the avatar, and the root slot can be used to fully customize the rendered element. Beyond identity, Avatar communicates state: the active prop can mark an avatar as active or inactive, and activeAppearance controls whether an active avatar is decorated with a ring, a shadow, or both. Visual identity is configurable through size (a curated scale from 16 to 128 pixels, defaulting to 32), shape (circular or square), and color (neutral, brand, colorful hash-based coloring, or any named color from the theme palette such as seafoam, grape, or pumpkin). Because it is purely presentational, Avatar is typically composed inside other components — Persona, Card headers, MessageBar, Combobox/people pickers, Menu triggers, Toolbar, and lists — rather than used as a standalone interactive control.

**When to use**: Use Avatar whenever a UI needs to identify a person or entity at a glance: user lists, comment threads, message headers, activity feeds, org charts, people pickers, and any place a name would otherwise be the only identifier. Use Avatar instead of a generic Image when the visual represents an identity rather than content, because Avatar supplies the initials/icon fallback, accessible naming through the name prop, and the size and color system for identities. Prefer Persona when you need an avatar accompanied by structured text (name, secondary text, presence), since Persona composes Avatar with layout and typography. Use shape="square" for non-person entities such as teams, rooms, tenants, or documents, and reserve the default circular shape for people. Use the badge slot when presence state matters (available, busy, away, offline, do-not-disturb, out-of-office, blocked, or a custom icon), and use active/activeAppearance when you need to show that a user is currently speaking, typing, or otherwise engaged. If you only need a status dot without an identity, use a presence badge component directly; if you only need a decorative glyph, use an icon rather than an Avatar.

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

- **name**: The primary identity prop and the one you should almost always set. It derives the initials shown when no image is available (via getInitials), provides the accessible name to assistive technology, and, with color="colorful", supplies the hash input that picks a stable color. Provide the full, real name rather than an abbreviation or username. `Ashley McCarthy`
- **image**: Slot for the photo or graphic representing the entity. Pass an object with a src (and any other image attributes) rather than a bare URL string. Always pair it with name so initials render while the image loads and the avatar stays accessible; combine with a custom badge when presence matters. `image={{ src: 'https://.../KatriAthokas.jpg' }} paired with name="Katri Athokas"`
- **initials**: Custom initials slot, displayed when there is no image. It is usually unnecessary because initials are derived from name; use it only when the automatic abbreviation is wrong or when there is no name at all (as in the size and palette examples where initials are set to the size value or a two-letter code). Avoid contradicting the name you pass. `CRF for "Cecil Robin Folk" only when the default abbreviation is undesirable`
- **icon**: Icon slot shown only when the avatar has neither an image nor initials. Use it for entity avatars that represent something other than a person — Guest, People (Group), PeopleTeam (Team), PersonCall (Phone Contact), CalendarLtr (Meeting), Briefcase (Tenant), ConferenceRoom (Room). Because there is no name in these cases, always add an aria-label describing what the icon means. `icon={<GuestRegular />} with aria-label="Guest"`
- **badge**: Slot that overlays a presence indicator on the avatar. Accepts a status object with a status value of available, busy, away, offline, do-not-disturb, out-of-office, or blocked; an outOfOffice boolean to mark someone away from their desk; or a custom icon element to display your own glyph. Use it whenever the user's availability matters and keep the avatar's own name intact so identity and status stay separate. `badge={{ status: 'away' }} or badge={{ status: 'busy', outOfOffice: true }} or badge={{ icon: <CalendarMonthRegular /> }}`
- **size**: Controls the rendered pixel size and is restricted to the supported scale (16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96, 120, 128); 32 is the default. Choose a size that fits the density of the surface, and avoid 16 and 20 for interactive avatars unless spacing meets WCAG target size guidance. For a non-supported size, set size to the next-smaller supported value and override width and height in style — for example, to render 45px, use size 40 with 45px width and height. `48 for a header avatar, 24 for a dense comment list, or size={40} with width/height set to 45px for a custom size`
- **shape**: Chooses between the circular default (people) and the square shape, which reads as an object or organization rather than an individual. Use square for teams, rooms, tenants, and other non-person entities. `shape="square" with an icon and aria-label="Team"`
- **color**: Determines the background used when rendering an icon or initials. neutral is the default gray; brand pulls from the brand palette (useful for the signed-in user or brand-forward surfaces); colorful hashes the name (or idForColor) to one of the predefined theme colors for easy visual differentiation in people lists; a named color from the palette (dark-red, cranberry, red, pumpkin, peach, marigold, gold, brass, brown, forest, seafoam, dark-green, light-teal, teal, steel, blue, royal-blue, cornflower, navy, lavender, purple, grape, lilac, pink, magenta, plum, beige, mink, platinum, anchor) pins an exact theme color when the color must be deliberate and stable. `color="colorful" for a people list, color="brand" for the current user, color="seafoam" for a fixed brand-adjacent accent`
- **idForColor**: Supplies the string used to derive the hashed color when color="colorful" and no name is available. Use it with a stable unique identifier (user id, object id, or an opaque string) so the same entity always receives the same color even when its display name changes or is missing. It has no effect when color is not colorful. `idForColor="id-123" or idForColor="42" alongside an icon-based colorful avatar`
- **active**: Optional activity indicator with three values: active decorates the avatar according to activeAppearance, inactive reduces its size and makes it partially transparent, and unset (the default) renders normal display. Use active to show that someone is currently speaking or typing, and inactive to de-emphasize participants in a call or list without removing them. `active="active" for a speaking participant, active="inactive" for a muted or idle participant`
- **activeAppearance**: Selects the decoration applied when active="active": ring draws an outline, shadow applies an elevated shadow, and ring-shadow applies both. It has no visual effect unless active is set to active, and the default is ring. Choose ring for dense surfaces where a shadow would look heavy, shadow for flatter surfaces, and ring-shadow for high-visibility emphasis such as an active speaker in a call. `activeAppearance="ring-shadow" on a call participant who is currently speaking`

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

- Always provide the name prop when a real name is available: it derives the displayed initials, is exposed to accessibility tools, and makes the avatar readable by screen readers.
- Provide the image slot with a src, and keep the name in place so initials render while the image loads and the accessible name is preserved.
- Supply an aria-label for avatars that have no name, such as icon-based avatars representing Guest, Group, Team, Room, Tenant, Meeting, or Phone Contact.
- Use the badge slot with a concrete status (available, busy, away, offline, do-not-disturb, out-of-office, blocked) or a custom icon to surface presence, and combine it with outOfOffice when a person is away from their desk.
- Pick sizes from the supported scale (16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96, 120, 128) and keep a consistent size within a given list or region; 32 is the sensible default for list-level identity.
- Use color="colorful" for people-facing lists where individuals should be visually distinguishable, and pass idForColor when no name exists but a stable unique identifier does.
- Use shape="square" to signal non-person entities (teams, rooms, tenants) and the default circular shape for individual people.
- Set active="active" together with the desired activeAppearance (ring, shadow, or ring-shadow) when representing a speaking or typing user, and active="inactive" for dimmed, reduced participants.
- Prefer deriving initials from name rather than hard-coding the initials slot, unless the desired abbreviation genuinely differs from what getInitials produces.

### Don'ts

- Don't omit the name prop when it is known; an avatar that falls back to an icon or to a bare aria-label loses the human-readable identity that screen readers and loading placeholders rely on.
- Don't use sizes 16 or 20 for interactive avatars unless surrounding spacing is increased (at least 8px at 16 and 4px at 20) to satisfy WCAG target size requirements.
- Don't pass arbitrary numeric sizes that are not on the supported scale; instead set size to the next-smaller supported value and override width and height in style.
- Don't encode critical status information only through color, a colored ring, or the colorful hash color — pair it with the badge status and an accessible name.
- Don't attach click handlers directly to an Avatar to make it interactive; wrap it in an appropriate interactive component such as a Button, Link, Menu trigger, Card, or Toolbar item so focus, roles, and keyboard behavior come from that control.
- Don't provide an image without a name; if the image fails or is still loading, users see only a blank or abbreviated fallback with no accessible label.
- Don't set activeAppearance expecting it to do anything unless active is set to active — the appearance only applies to active avatars.
- Don't use Avatar purely as decoration for non-identity content; a plain icon or Image is the right primitive when there is no person or entity behind it.
- Don't override the initials slot with values that contradict the name prop, since the visible text and the accessible name would disagree.

## Anti-Patterns

### Image without a name

❌ Passing only an image src leaves the Avatar with no accessible name and no initials fallback, so screen reader users hear nothing meaningful and the avatar renders blank while the image loads or if it fails to load.

✅ Always pass the name alongside the image slot. The name provides the accessible label and the initials used as the loading and failure placeholder, and the photo simply replaces the initials once it is available.

### Clickable Avatar with a raw click handler

❌ Adding a click handler or role directly to the Avatar root creates a control that looks interactive but has no focus stop, no Enter/Space activation, and no visible focus ring, breaking keyboard access.

✅ Wrap the Avatar in a real interactive component — Button, Link, Menu trigger, Card, or Toolbar item — and let that component supply roles, focus management, keyboard activation, and focus styling. Use the root slot only for layout and styling customization.

### Encoding presence only in color

❌ Relying on the colorful hash color, a colored ring, or an active appearance to communicate availability makes status invisible to users who cannot distinguish colors and to screen reader users who receive no status text at all.

✅ Convey presence through the badge slot with an explicit status (available, busy, away, offline, do-not-disturb, out-of-office, blocked) or a custom icon, and keep the identity in the name or aria-label. Treat color as a supplementary, not primary, signal.

### Off-scale sizes and hand-rolled small interactive avatars

❌ Passing sizes outside the supported scale fights the internal sizing rules and can leave initials or badge misaligned, while using 16px or 20px avatars as interactive targets without extra spacing violates WCAG target size guidance.

✅ Stay on the supported scale for normal use. For a genuinely custom size, set size to the next-smaller supported value and override width and height in style. For interactive avatars at 16 or 20, add at least 8px or 4px of spacing respectively, or move up to a larger size.

### Icon-only avatars without a label

❌ Avatars that fall back to an icon carry no name, so without an explicit aria-label they are announced as an unlabeled graphic and give users no idea whether they represent a guest, a group, a room, or a tenant.

✅ Whenever you use the icon slot instead of a name, provide a descriptive aria-label (Guest, Group, Team, Phone Contact, Meeting, Tenant, Room) that matches what the icon is meant to represent.

### Overriding initials inconsistently with name

❌ Manually setting initials that do not match the name prop produces a visual abbreviation that disagrees with the accessible name, confusing both sighted and screen reader users.

✅ Let the name prop drive initials through getInitials. Only use the initials slot when no name exists (for example a size preview or an anonymous identifier) or when the automatic abbreviation is genuinely wrong for the content.

## Accessibility

**Requirements**: Avatar is a non-interactive presentational element, so it must either carry its own accessible name or be intentionally hidden next to a visible label. Provide the name prop whenever a real name exists; when no name exists (icon-only avatars, entity avatars, or presence-only avatars), provide an aria-label such as "Guest", "Group", "Team", "Room", or "Tenant". If an avatar is purely decorative because the same person's name is already adjacent as text, avoid duplicating that name in an aria-label to prevent screen readers from announcing it twice. Interactive usage must meet WCAG 2.5.8 Target Size: the story guidance explicitly recommends avoiding sizes 16 and 20 for interactive avatars, or ensuring at least 8px (at size 16) or 4px (at size 20) of spacing between targets. Focus indication for interactive avatars is provided by the wrapping control, not by Avatar itself, and must remain visible against the avatar imagery and any active ring or shadow.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the interactive element wrapping the avatar (Button, Link, Menu trigger, Toolbar item); Avatar itself is not focusable and has no tab stop of its own. |
| `Shift+Tab` | Moves focus backwards out of the wrapping interactive element; identical to Tab behavior with respect to Avatar, which never receives focus directly. |
| `Enter` | Activates the wrapping interactive element (for example a Button or Link containing the avatar); the Avatar contributes no key handling. |
| `Space` | Activates a wrapping Button-style control; again the behavior comes from the wrapper, not from Avatar. |
| `Escape` | Dismisses a Menu or Popover that was opened from an avatar trigger, returning focus to the trigger. |
| `Arrow keys` | Move between avatar-based items when Avatar is used inside a Menu or Toolbar, where roving focus is implemented by those parent components. |

**ARIA**: aria-label, name prop surfaced to accessibility tools, badge status conveyed by the presence badge slot

**Screen Reader**: Avatar renders a single element whose accessible name comes from the name prop when present, or from an explicit aria-label when the avatar is icon-based or entity-based. Initials are a visual abbreviation and should not be relied on as the accessible name — with name supplied, assistive technology announces the full name rather than the letters shown on screen. When a badge slot supplies presence state, that presence information is announced through the presence badge rather than through the avatar's own name, so the avatar can be left as the identity and the badge as the status. Inactive avatars are only visually reduced in size and transparency; nothing in the DOM signals inactivity, so any state that matters must be communicated by the surrounding text or by the badge.

## Styling

Avatar is styled with Griffel, so the cleanest customizations are theme-token overrides through the className on the root slot rather than raw color values. Useful real tokens include tokens.colorBrandBackground and tokens.colorNeutralForegroundOnBrand for brand-colored avatars, tokens.colorNeutralBackground6 for the default neutral background, tokens.colorNeutralForeground1 for initials on neutral backgrounds, and the colorPalette family (for example tokens.colorPaletteRedBackground3, tokens.colorPaletteBlueBackground2, tokens.colorPaletteGreenBackground2, tokens.colorPaletteLightTealBackground2) behind the named colors such as red, blue, forest, and light-teal. Shape and decoration use tokens.borderRadiusCircular for circular avatars and tokens.borderRadiusMedium for square ones, tokens.shadow2, tokens.shadow4, and tokens.shadow8 back the shadow and ring-shadow active appearances, and tokens.colorStrokeFocus2 drives focus/ring emphasis consistent with the rest of Fluent. Typography inside initials scales with size, so use the font tokens (tokens.fontFamilyBase with tokens.fontSizeBase200 through tokens.fontSizeBase500) when you need to tune the abbreviation for unusually large or small avatars. For a size that is not on the supported scale, set size to the next-smaller supported value and override width and height in style rather than fighting the built-in sizing rules; for non-square scaling, keep the aspect ratio equal to preserve the circular mask. Because the badge slot overlays the root, verify that custom badge content and any active ring or shadow do not collide with clipping ancestors (overflow: hidden containers, rounded cards) at small sizes.

## Performance

Avatar is a small, effectively stateless presentational component: it renders one root element plus whichever of image, initials, icon, or badge applies, and it performs only a cheap string hashing pass when color is set to colorful. That makes it safe to render in long lists, virtualized feeds, and repeated card headers. The main cost is image loading, so reuse cached, appropriately sized image URLs and avoid swapping the src on every render. Because the color hash is derived from name or idForColor, keep those values stable — changing a name mid-session changes the avatar's color, causing an unnecessary visual flicker. When rendering many avatars inside lists, stabilize props (memoize derived objects for the image and badge slots, and avoid creating new slot object literals inline on every render) so React can skip re-rendering items that have not changed. Prefer the built-in size scale over per-render style overrides, since ad-hoc inline style objects create new Griffel class work rather than reusing the cached size classes.

## Theming & Tokens

Avatar is fully token-driven, so it adapts automatically to light, dark, and high-contrast themes. Neutral avatars use tokens.colorNeutralBackground6 with tokens.colorNeutralForeground1 initials; brand avatars use tokens.colorBrandBackground with tokens.colorNeutralForegroundOnBrand; colorful avatars pick from the colorPalette family (for example tokens.colorPaletteRedBackground3, tokens.colorPaletteBlueBackground2, tokens.colorPaletteGreenBackground2, tokens.colorPaletteLightTealBackground2); and fixed named colors map to the corresponding palette background and foreground token pairs such as tokens.colorPaletteDarkRedBackground2, tokens.colorPaletteGrapeBackground2, or tokens.colorPalettePumpkinBackground2. Shape and decoration are tokenized as well: tokens.borderRadiusCircular and tokens.borderRadiusMedium handle shape, tokens.shadow2, tokens.shadow4, and tokens.shadow8 back the shadow and ring-shadow active appearances, and tokens.colorStrokeFocus2 keeps rings and focus treatment aligned with the rest of Fluent. Initials typography scales off tokens.fontFamilyBase and the tokens.fontSizeBase200 through tokens.fontSizeBase500 ramp depending on the rendered size. Overriding these tokens through the root slot's className is the supported way to restyle an avatar; hard-coded color values bypass theme switching and will not adapt to dark or high-contrast modes.

## Migration Notes

When moving from earlier Fluent UI React versions, note that in v9 Avatar is imported directly from @fluentui/react-components (in addition to the standalone @fluentui/react-avatar package) and is a first-class component rather than a sub-element of a persona control. The identity picture is now supplied through the image slot with a src value instead of a single image URL prop, and the sizing model changed from a small set of coin sizes to the documented pixel scale from 16 to 128 with 32 as the default; any non-standard pixel size is achieved by choosing the next-smaller supported size and overriding width and height in style. Presence indication moved out of the identity control into the badge slot, which accepts a status object (available, busy, away, offline, do-not-disturb, out-of-office, blocked), an outOfOffice flag, or a custom icon, so code that previously passed presence as a prop on the parent persona now passes it to the avatar's badge slot. Active/speaking state is expressed with the new active and activeAppearance props rather than bespoke decoration, and color selection is now declarative through color and idForColor rather than through custom classes.

## Edge Cases

- At size 16, only the first initial is rendered when initials are displayed, so three-letter abbreviations silently collapse to one character — verify that the single letter is still meaningful.
- Sizes outside the supported scale are not accepted as size values; the documented workaround is to set size to the next-smaller supported value and override width and height in style (for example, size 40 with width and height of 45px to achieve 45px).
- The image slot is not guaranteed to be visible immediately: initials or the icon render while the image loads, and if the image fails the fallback remains, which is exactly why name should always accompany image.
- activeAppearance has no visual effect unless active is set to active, so styling that appears only for active avatars will not show up on unset avatars.
- Inactive avatars are reduced in size and made partially transparent, which can shift perceived alignment and spacing in tightly packed rows or grids even though the layout box may not change.
- color="colorful" derives its color from a hash of name (or idForColor), so renaming an entity or omitting idForColor when no name exists can change the avatar color between sessions; supply idForColor for stable identifiers.
- The badge slot renders on top of the root element, so small sizes combined with a custom icon badge or with clipping ancestors (overflow: hidden containers, rounded cards) can crop or obscure the indicator.
- When there is no image and no name, the initials slot is empty and the icon slot becomes the visible content — an icon-only avatar with no aria-label is announced without any identity.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
