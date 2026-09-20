# AvatarGroupItem

> **Package**: `@fluentui/react-avatar` v9.11.2
> **Import**: `import { AvatarGroupItem } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

AvatarGroupItem is the individual child element rendered inside an AvatarGroup; it represents one person, team, or entity, or stands in for all the members that could not be shown individually. Each item renders an Avatar through its required avatar slot, and the item itself is a non-interactive wrapper (a div by default, or an li when list semantics are desired) whose visual treatment is controlled by the shape, size, color, active, and activeAppearance values forwarded to that avatar. The aria-hidden-free overflow case is handled by the isOverflow flag together with the indicator and count props: setting isOverflow turns the item into the "remaining members" tile, which shows either a numeric count or a generic overflow icon inside the avatar. The overflowLabel slot supplies the item's accessible name in that state and defaults to the name prop taken from the avatar slot, so an overflow item announces something meaningful such as the number of additional members. Because spacing and overlap are driven by the parent group, an AvatarGroupItem must always be rendered as a direct child of AvatarGroup; the layout prop (spread, stack, or pie) must agree with the group so that overlap, z-ordering, and radial placement stay aligned across every item.

**When to use**: Use AvatarGroupItem when you are building a facepile or group of people with AvatarGroup and need to render each member yourself — for example to interleave AvatarGroupPopover around a specific item, to render the members in a specific order, or to mark one item as the overflow tile with isOverflow. Reach for the plain Avatar component instead when only a single person or entity is shown; use AvatarGroup and AvatarGroupPopover when the group's members must be revealed in a popover. Use AvatarGroupItem when the group must stay compact and the count of hidden members is meaningful (indicator set to count) or when only the existence of more members matters (indicator set to icon). Avoid it for lists of people that need names, secondary text, or actions next to each avatar, in which case a List with Persona or Avatar rows is a better fit.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `active` | `'active' \| 'inactive' \| 'unset'` | — | No | — |
| `activeAppearance` | `'ring' \| 'shadow' \| 'ring-shadow'` | — | No | — |
| `avatar` | `NonNullable<Slot<typeof Avatar>>` | — | Yes | — |
| `children` | `React_2.ReactNode` | — | Yes | — |
| `color` | `'neutral' \| 'brand' \| 'colorful' \| AvatarNamedColor` | — | No | — |
| `count` | `number` | — | No | — |
| `idForColor` | `string \| undefined` | — | No | — |
| `indicator` | `'count' \| 'icon'` | — | No | — |
| `isOverflow` | `boolean` | — | No | — |
| `layout` | `'spread' \| 'stack' \| 'pie'` | — | No | — |
| `name` | `string` | — | No | — |
| `overflowLabel` | `NonNullable<Slot<'span'>>` | — | Yes | — |
| `root` | `NonNullable<Slot<'div', 'li'>>` | — | Yes | — |
| `shape` | `AvatarShape` | — | No | — |
| `shape` | `AvatarShape` | — | No | — |
| `size` | `AvatarSize` | — | No | — |
| `size` | `AvatarSize` | — | No | — |
| `size` | `AvatarSize` | — | No | — |

### Prop Guidance

- **avatar**: Required slot that holds the Avatar representing the person or entity. Pass Avatar props through this slot — name, color, active, activeAppearance, idForColor, shape, size — instead of styling the item root, because the item forwards its own shape, size, and color values here. Supply slot children only when the built-in avatar content cannot express what you need, such as a custom badge image. `avatar slot with a name, image, and color`
- **root**: Required slot for the outer element. It renders as a div by default and can render as an li when the items must participate in list semantics; in that case the surrounding group or container must establish the list. Keep the default element and use the slot's className or style to adjust spacing, overlap, and z-index for stack and pie layouts. `div`
- **overflowLabel**: Required slot holding the text used to name the item when it is rendered as an overflow tile. Its content defaults to the name prop of the avatar slot, so in most cases you leave it alone; override it only for localized or more explicit wording such as 'more members'. `5 more members`
- **isOverflow**: Marks this item as the tile that stands in for all members not rendered individually. Set it on exactly one item per group and leave it unset (false) on every regular member so the group has a single, unambiguous overflow representation. `true`
- **indicator**: Chooses what the overflow tile shows: count displays the number of remaining members inside the avatar, while icon shows a generic overflow glyph. Use count when the exact figure is useful to the user and icon when space is tight or the number would be imprecise or too large to read. `count`
- **count**: The number rendered inside the overflow avatar when indicator is set to count. It should equal the members that are not displayed individually, not the total size of the group, so the math stays consistent with what is actually on screen. `5`
- **layout**: Controls how the item visually relates to its siblings: spread places items side by side, stack overlaps them horizontally, and pie overlaps them radially around a circle. Match the value used by the parent AvatarGroup so overlap, ordering, and z-index stay coherent; never mix layouts within a group. `stack`
- **shape**: Avatar shape forwarded to the avatar slot. Use circular for individual people and square for teams, applications, or organizations, and keep the value identical for every item in one group so edges line up in stacked layouts. `circular`
- **size**: Avatar size forwarded to the avatar slot. All items in a group should use one size, since mixing sizes breaks the stack and pie geometry; larger sizes mean fewer members fit before you need an overflow item. `48`
- **color**: Sets the avatar background: neutral, brand, colorful, or a specific named color. Let the avatar derive a color from the member when identity coloring is not required, and reserve brand or explicit named colors for people or entities with established color coding. `colorful`
- **name**: The person or entity name used for avatar initials and, by default, as the overflow label text. Always provide it so the avatar has text for assistive technology and the overflow tile announces something meaningful. `Jane Doe`
- **idForColor**: A stable identifier used to derive a consistent avatar color. Pass a durable value such as a user id so the same member keeps the same color across renders, sessions, and screens instead of shifting with list order. `user-42`
- **active**: Presence state forwarded to the avatar: active draws the configured ring or shadow, inactive renders a muted avatar, and unset (the default) renders a plain avatar. Only use it when the group genuinely communicates presence, since it adds a visual layer to every marked item. `active`
- **activeAppearance**: Chooses how the active state is drawn — ring, shadow, or ring-shadow. Pick one appearance for the whole group so all active members read consistently and the difference between active and inactive stays obvious. `ring`
- **children**: The content rendered inside the item. In practice the required avatar slot (and, for overflow items, the overflowLabel slot) is what you pass; additional children should only be added when you truly need extra content layered inside the item, because the item root is not interactive. `Avatar and overflowLabel slots`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `avatar` | — | Yes | Avatar that represents a person or entity. |
| `overflowLabel` | — | Yes | Label used for the name of the AvatarGroupItem when rendered as an overflow item. The content of the label, by default, is the `name` prop from the `avatar` slot. |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Provide a real person or entity identifier through the name prop (or the avatar slot) for every item so the avatar has initials and a meaningful accessible name.
- Set isOverflow on exactly one item per group to represent the members that are not rendered individually, and keep it false on all regular items.
- Pair isOverflow with indicator set to count and a count that reflects only the hidden members, so the tile reads as 'remaining members' rather than a random number.
- Keep shape, size, color, and layout identical across every item in one group so the stack or pie overlap lines up pixel for pixel.
- Choose circular avatars for people and square avatars for teams, apps, or entities, and apply that choice to the whole group.
- Prefer the overflowLabel default (the avatar's name) and only override the slot text when you need custom or localized wording such as 'more members'.
- Use the avatar slot to pass Avatar props — name, color, active, activeAppearance, idForColor, shape, size — instead of restyling the item root.
- Provide a stable idForColor value per member so the derived avatar color stays consistent between renders, routes, and screens.

### Don'ts

- Don't render AvatarGroupItem outside an AvatarGroup, because the group supplies the list container, overlap geometry, and layout context the item depends on.
- Don't set a layout that differs from the parent group's layout; mixing spread, stack, and pie inside one group produces misaligned overlapping items.
- Don't use count without indicator set to count, or indicator set to count without a count, since neither alone produces a meaningful overflow tile.
- Don't mark more than one item as isOverflow in the same group; multiple overflow tiles duplicate the 'remaining members' announcement.
- Don't hardcode width, height, font size, or border radius on the root to change an avatar's size — use the size, shape, and color props so the avatar stays internally consistent.
- Don't convey presence, status, or identity through color alone; the active/activeAppearance props and text-based labels must carry the same information.
- Don't place buttons, links, or other interactive controls inside the item root as if the item were clickable; wrap the item in a proper trigger (for example the trigger used by AvatarGroupPopover) when interaction is needed.
- Don't use AvatarGroupItem to display a single person; a standalone Avatar is simpler and avoids unnecessary group semantics.

## Anti-Patterns

### Rendering one item per member in a very large group

❌ Every AvatarGroupItem instantiates an Avatar with its own initials, color derivation, and size styles, so a group of dozens or hundreds of members bloats the DOM and slows initial render and layout, especially with overlapping stack or pie transforms.

✅ Cap the number of individually rendered items and use a single item with isOverflow, indicator set to count, and count equal to the hidden members; reveal the rest through AvatarGroupPopover or a dedicated list on another surface.

### Hand-building custom overflow content in the item root

❌ Replacing the avatar slot with a hand-made span or div removes the avatar's size ramp, shape, color derivation, and accessible naming, so the overflow tile drifts visually from the rest of the group and can end up unlabeled for assistive technology.

✅ Keep the avatar slot and use isOverflow, indicator, count, and overflowLabel for the overflow representation; only reach for custom slot content when the built-in avatar genuinely cannot express the content.

### Driving the group geometry from each item

❌ Setting different layout, size, or shape values per item, or hardcoding margins to fake overlap, fights the parent AvatarGroup's positioning and produces uneven spacing, wrong z-order, and clipped avatars at the ends of the stack.

✅ Set size, shape, and layout once at the AvatarGroup level and let every AvatarGroupItem inherit that geometry; use the root slot's className only for deliberate z-index or spacing tweaks that the group cannot express.

### Treating the avatar group as a navigation or action control

❌ AvatarGroupItem is not focusable and exposes no role, so adding onClick handlers or hover affordances to its root creates a control that keyboard users cannot reach and screen readers cannot identify as interactive.

✅ Wrap the item in a real trigger or button (for example the trigger used with AvatarGroupPopover) with an explicit aria-label, or move the action into a Menu or a list row that provides proper semantics.

### Using count for the total group size or for ambiguous values

❌ A count that equals the total member count, or a large unformatted number, misleads users about how many members are hidden and can overflow the avatar's circular shape, clipping the digits.

✅ Compute count as the members not rendered individually, switch to indicator set to icon when the number would be very large, and keep an explicit overflowLabel so the tile is described in words as well as digits.

## Accessibility

**Requirements**: AvatarGroupItem has no interactive role of its own, so all accessibility semantics come from what it renders. Each avatar must expose an accessible name from the name prop, an image alt, or an explicit aria-label (WCAG 1.1.1 Non-text Content and 4.1.2 Name, Role, Value). The overflow item must announce the remaining members through the overflowLabel slot, whose default content is the avatar's name; if that name is empty, the overflow tile becomes unlabeled. Presence or status expressed through the active and activeAppearance props must not rely on color alone (WCAG 1.4.1 Use of Color) — pair the ring or shadow with text or an aria description. Text inside the overflow tile must meet contrast requirements against the avatar background (WCAG 1.4.3), and when an item is wrapped by an interactive control, that control must supply a visible focus indicator and a target of at least 24 by 24 CSS pixels (WCAG 2.5.8 Target Size).

| Key | Action |
| --- | --- |
| `Tab` | Moves focus past the item; AvatarGroupItem itself is not focusable and only receives focus when its avatar is wrapped in a focusable element such as an AvatarGroupPopover trigger or a button. |
| `Enter` | Activates the wrapping control (for example an AvatarGroupPopover or a custom button) when the item is rendered inside one; the item does not handle Enter itself. |
| `Space` | Activates the wrapping control when it is a button; AvatarGroupItem does not handle Space on its own. |
| `Escape` | Closes an ancestor popover such as AvatarGroupPopover when the item is rendered within one; the item has no Escape handling of its own. |
| `Arrow keys` | No arrow-key navigation exists inside AvatarGroupItem; the group is not a composite widget, so arrow keys behave as normal page scrolling unless a surrounding list or toolbar implements them. |

**ARIA**: aria-label — set on the avatar or overflow tile when there is no visible text to name the person or entity, aria-hidden — applied to purely decorative avatars or duplicated overflow labels that repeat adjacent text, role — implicit listitem when the root slot renders as an li, otherwise the generic div role; AvatarGroupItem adds no role of its own, aria-expanded and aria-haspopup — not set by AvatarGroupItem; they belong to the popover trigger that may wrap an overflow item, and the trigger should also carry aria-label text such as 'Show more members'

**Screen Reader**: A screen reader encounters the item's avatar as an image with the member's name as its accessible name, so users hear each visible member in order. The overflow item announces the text from the overflowLabel slot — by default the avatar's name — which should describe the hidden members (for example '3 more members'); when indicator is set to count, the numeric text inside the avatar is what remains exposed once the label is applied. Because the item is not focusable, keyboard and screen reader users reach it through reading order or through the wrapping trigger, and no state is announced for the group itself unless the consuming application adds one.

## Styling

Style the item through its slot props rather than rewriting the avatar: size, shape, and color on the item are forwarded to the avatar slot, and layout positioning is owned by AvatarGroup. When deeper customization is required, target the root slot's className for overlap and z-index tuning (stack layouts typically need a negative margin of tokens.spacingHorizontalXXS and a small border of tokens.colorNeutralBackground1 around each avatar so overlapped avatars stay distinguishable), and use tokens.borderRadiusCircular for circular avatars or tokens.borderRadiusMedium for square ones. Overflow tiles usually read best with tokens.colorNeutralBackground6 as the background and tokens.colorNeutralForeground1 for the count text, with tokens.fontSizeBase200 and tokens.fontWeightSemibold keeping a two- or three-digit count legible. Active rings should use tokens.colorNeutralStroke1 or tokens.colorBrandStroke1 plus tokens.strokeWidthThin, and focus outlines on any wrapping trigger should use tokens.colorStrokeFocus2. For colorful avatars, palette tokens such as tokens.colorPaletteBlueBackground2 and tokens.colorPaletteBerryBackground2 drive the derived background, so prefer the color and idForColor props over hardcoded fills.

## Performance

Each AvatarGroupItem mounts a full Avatar, so item count is the dominant cost: rendering details for initials, deriving a color from name or idForColor, and applying size, shape, and ring styles. Keep the individually rendered items to a small, fixed number and offload the remainder to one overflow item, since stack and pie layouts add overlapping transforms that increase paint and compositing work as items grow. Avoid creating new slot objects or inline style objects on every render, and keep the name, color, and idForColor values stable so color derivation and content memoization are not invalidated. When a group's membership changes frequently (live presence, for example), memoize the item elements or keyed children so unchanged avatars are not re-created. Avoid mixing AvatarGroupItem with an external virtualization strategy, because overlap geometry depends on the group's own child ordering rather than on absolute positioning.

## Theming & Tokens

AvatarGroupItem inherits everything from the nearest FluentProvider theme: the avatar's neutral background resolves to tokens.colorNeutralBackground6 with tokens.colorNeutralForeground1 initials, brand avatars use tokens.colorBrandBackground with tokens.colorBrandForeground1, and colorful avatars map to palette tokens such as tokens.colorPaletteBlueBackground2. Shape and size are rendered with tokens.borderRadiusCircular or tokens.borderRadiusMedium and the avatar size ramp rather than fixed pixels, so a theme that changes spacing or stroke widths (tokens.strokeWidthThin, tokens.strokeWidthThick) also updates the active ring and shadow. Overlap separators should be expressed with theme surfaces like tokens.colorNeutralBackground1 or tokens.colorNeutralBackground2 so they invert correctly in dark and high-contrast themes; hardcoded hex values break that inversion. Because the component reads from the theme context, wrapping the group in a nested FluentProvider (for example a darker surface) restyles every item at once without per-item overrides.

## Edge Cases

- The overflowLabel defaults to the name prop of the avatar slot; if that name is empty or missing, the overflow tile renders an unlabeled avatar and announces nothing useful about the hidden members.
- count is only meaningful together with indicator set to count; setting count while indicator is icon renders no number, and setting indicator to count with count of 0 or undefined produces an empty-looking tile.
- The root slot can render as an li, but the item does not supply list semantics on its own — rendering it as a list item outside a list container produces invalid HTML and unreliable screen reader output.
- Several props (shape, size, active, activeAppearance, color, idForColor, name) live on the avatar as well as on the item, so a value set on the item can be silently overridden by what you pass into the avatar slot; keep one source of truth.
- Setting size or shape on an individual item does not resize the group or re-flow its spacing, so mixed sizes in one group leave avatars overlapping incorrectly at the ends of the stack or pie ring.
- Very large counts overflow the circular avatar; the digits can clip on small sizes, so prefer indicator set to icon or a capped, formatted value such as "99+" for very large groups.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
