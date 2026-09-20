# AvatarGroupPopover

> **Package**: `@fluentui/react-avatar` v9.11.2
> **Import**: `import { AvatarGroupPopover } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

AvatarGroupPopover is the overflow affordance that keeps an AvatarGroup from growing without bound. When not every person in a group fits in the available width, AvatarGroupPopover collapses the remainder behind a single circular trigger button that displays either the number of hidden avatars or a generic overflow icon. Activating that trigger opens a popover surface containing a list of the overflowed AvatarGroupItems, so every member of the group remains discoverable without expanding the page layout. The component is composed of five slots — root, triggerButton, content, popoverSurface, and tooltip — each of which can be restyled or replaced. It is designed to be rendered as a child of AvatarGroup, after the avatars that stay visible, and it derives the number of overflowed people from its children unless the count prop is supplied explicitly.

**When to use**: Use AvatarGroupPopover when an AvatarGroup has more people than the container can display and the surrounding UI must stay compact — collaborator rows, participant lists, comment threads, card headers, and assignee fields are typical scenarios. It is preferable to shrinking avatars, wrapping them onto multiple lines, or cutting the group off, because it preserves a predictable single-row layout while still making every person reachable on demand. Choose it when the hidden content is simply the rest of the same group and a small disclosure is appropriate. If nothing overflows, render AvatarGroup by itself. If the content behind the trigger needs form fields, actions, or multiple steps, use Dialog or a full Popover instead. If you are presenting a long, browsable roster rather than an overflow indicator, use List or a dedicated page.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Yes | — |
| `count` | `number \| undefined` | — | No | Number of AvatarGroupItems that will be rendered.  Note: AvatarGroupPopover handles counting the number of children, but when using a react fragment to wrap the children, this is not possible and therefore it has do be added manually. |
| `indicator` | `"count" \| "icon" \| undefined` | `count` | No | Whether the triggerButton should render an icon instead of the number of overflowed AvatarGroupItems. Note: The indicator will default to `icon` when the size is less than 24. |

### Prop Guidance

- **indicator**: Controls whether the trigger renders the number of overflowed avatars or a generic overflow icon. It defaults to count, but automatically becomes icon when the avatar size is less than 24, so set it explicitly when you need a guaranteed rendering. Choose count when the number is meaningful and there is room for a numeral; choose icon when the group is very dense, when the count changes rapidly, or when the exact number is noise rather than information. `count`
- **count**: The number of AvatarGroupItems that appear behind the trigger. AvatarGroupPopover counts its children automatically, so omit count for the common case where the overflowed items are direct children. Supply it explicitly whenever children are wrapped in a React fragment, because the internal count cannot see through fragments, and keep the value identical to the number of items the popover will actually reveal. `3`
- **children**: The overflowed AvatarGroupItems that are hidden from the visible row and disclosed inside the popover. Render only the items that overflow — not the avatars already displayed in the group — and keep the set consistent with count so the trigger and the surfaced list agree. Children may be wrapped in a fragment, but only if count is provided. `AvatarGroupItem elements for the people that did not fit in the visible row`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `content` | — | Yes | List that contains the overflowed AvatarGroupItems. |
| `popoverSurface` | — | Yes | PopoverSurface that contains the content. |
| `root` | — | Yes | — |
| `tooltip` | — | Yes | Tooltip shown when triggerButton is hovered. |
| `triggerButton` | — | Yes | Button that triggers the Popover. |

## Best Practices

### Do's

- Render AvatarGroupPopover as the last child of AvatarGroup, after the AvatarGroupItems that remain visible, so the trigger reads as the rest of the group.
- Pass count whenever the overflowed AvatarGroupItems are wrapped in a React fragment, because the component cannot count children across a fragment boundary.
- Keep count synchronized with the actual number of AvatarGroupItem children so the number shown on the trigger matches the list revealed in the popover.
- Give the triggerButton a descriptive accessible name that states the action and the number of hidden people, rather than relying on a bare numeral or an icon.
- Limit the content slot to overflowed AvatarGroupItems so the popover keeps its simple, predictable list semantics.
- Use the tooltip slot as a visual affordance only, and make sure the same information is carried by the trigger's accessible name and the surfaced list.
- Match the trigger's size and shape to the avatars in the group so the overflow affordance reads as part of the same set.

### Don'ts

- Don't use AvatarGroupPopover as a general-purpose disclosure outside AvatarGroup; it exists specifically for avatar overflow.
- Don't wrap children in a fragment and omit count, which leaves the trigger showing a wrong or zero total.
- Don't place the overflow trigger in the middle of the avatar list; it belongs at the end of the group.
- Don't pack forms, menus, or multi-step actions into the content slot — open a Dialog or a plain Popover for that kind of content.
- Don't assume a numeric counter will always render: when the avatar size is below 24, the indicator quietly falls back to an icon even if indicator is not set.
- Don't depend on the tooltip to carry essential information, because touch and keyboard users may never see it.
- Don't leave the trigger without hover and focus styling; a flat, unstyled button makes the overflow undiscoverable.

## Anti-Patterns

### Fragment-wrapped children without a count

❌ Wrapping the overflowed AvatarGroupItems in a React fragment prevents the component from counting them, so the trigger shows a wrong or zero total and the UI under-reports how many people are hidden.

✅ Pass count explicitly with the correct number when using fragments, or avoid fragments and render the AvatarGroupItems directly so the automatic counting works.

### Count that disagrees with the children

❌ Hard-coding count to a value that does not match the number of AvatarGroupItem children makes the trigger promise a different number of people than the popover reveals, which is confusing visually and misleading for screen reader users who hear the number spoken.

✅ Derive the value from the same data source that renders the children — for example, subtract the number of visible avatars from the total membership — so the trigger and the list always describe the same set.

### Tooltip-only labeling

❌ Relying on the tooltip slot to explain what the trigger does leaves the button effectively unlabeled for screen reader users and unavailable to touch users, who never trigger hover.

✅ Put the meaning in the trigger's accessible name, such as an aria-label that includes the number of hidden people, and treat the tooltip as a supplementary visual hint.

### Overloading the popover with rich content

❌ Putting forms, menus, or multi-step interactions inside the content slot breaks the mental model of a small overflow list, complicates focus management and dismissal, and risks the surface overflowing the viewport.

✅ Keep the content slot to overflowed AvatarGroupItems and move complex interactions to Dialog or a purpose-built Popover.

### Trigger placed outside the flow of the group

❌ Rendering AvatarGroupPopover before the visible avatars, or entirely outside AvatarGroup, detaches the plus-N affordance from the group it summarizes and breaks the natural reading order.

✅ Always render AvatarGroupPopover as the final child of AvatarGroup so it visually and semantically closes the row of avatars.

## Accessibility

**Requirements**: AvatarGroupPopover must meet WCAG 2.1 AA expectations: the trigger is a real button, so it must be fully keyboard operable (2.1.1), must display a visible focus indicator (2.4.7), and must expose an accessible name and role (4.1.2) that communicates how many people are hidden. Keep the trigger at least 24 by 24 CSS pixels to satisfy Target Size Minimum (2.5.8), and larger if the surrounding avatars are large. Tooltip content must be dismissible, hoverable, and persistent per Content on Hover or Focus (1.4.13), and must never be the only place the hidden names or the count are conveyed. The avatars listed inside the popover must retain their own accessible names so the people behind the overflow are not anonymous to assistive technology.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the overflow trigger button when the avatar group is reached in the tab order. |
| `Enter` | Activates the trigger button and opens the popover listing the overflowed avatars. |
| `Space` | Activates the trigger button and opens the popover, matching native button behavior. |
| `Escape` | Closes the open popover and returns focus to the trigger button. |
| `Tab` | While the popover is open, moves focus to the first focusable element inside the popover surface and keeps focus within the surface. |
| `Shift + Tab` | While the popover is open, cycles focus backwards through the focusable elements inside the popover surface. |

**ARIA**: aria-label on the triggerButton describing the action and the number of hidden people, aria-expanded on the trigger button reflecting whether the overflow popover is open, aria-controls associating the trigger button with the popover surface, role of list on the content and listitem semantics for each overflowed avatar row, aria-describedby connecting the trigger to the tooltip text so the tooltip is exposed as a description rather than a name, alt text or accessible names on the avatar images and Persona content rendered inside the popover

**Screen Reader**: Screen readers announce the trigger as a button with its accessible name — for example, Show 3 more people — together with its collapsed or expanded state. When the popover opens, focus moves into the popover surface and the overflow list is announced with its item count, so the user can review exactly who is hidden and then dismiss the popover. Each AvatarGroupItem is read as a list item with the person's name, which means the visible avatars plus the overflowed avatars together describe the complete group. Pressing Escape collapses the popover and focus returns to the trigger, which is announced again in its collapsed state. Tooltip text is exposed as a description of the trigger and should not duplicate the accessible name.

## Styling

The overflow trigger is normally styled to look like an avatar-sized circular button. Apply tokens.borderRadiusCircular to the triggerButton, use tokens.colorNeutralBackground1 with tokens.colorNeutralForeground1 for the neutral counter treatment, and use tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed for the interactive states so the button matches neutral avatars. If the group uses brand-colored avatars, switch the trigger to tokens.colorBrandBackground with tokens.colorBrandForeground1 and the corresponding brand hover and pressed state tokens. Size the trigger to the same box as the avatars in the group and use tokens.fontSizeBase200 for the count text on smaller triggers so the numeral does not crowd the circle. Inside the popoverSurface, use tokens.spacingHorizontalM and tokens.spacingVerticalXS for comfortable Persona rows, tokens.colorNeutralForeground2 for secondary text such as job titles, and rely on the surface's own elevation instead of adding a custom shadow. Keep focus outlines visible with tokens.colorStrokeFocus2 and tokens.colorStrokeFocus1, and if you give the trigger a border, use tokens.colorNeutralStroke1 or tokens.colorTransparentStroke. Token-based transitions using tokens.curveEasyEase keep hover feedback consistent with the rest of Fluent.

## Performance

The popoverSurface is mounted only while the popover is open, so the cost of rendering the overflowed avatars is deferred until a user actually expands the group; keep the closed state cheap and avoid forcing the surface to mount. The trigger's total comes from React child counting, which is inexpensive, but recreating new child element identities on every render is not — build the overflowed AvatarGroupItem array only when the underlying people change, and prefer passing count when fragments are unavoidable. Because the content slot is rendered as a List, treat the overflow backlog as potentially large: hundreds of items behind one trigger add DOM, image, and layout work at open time even though almost nobody will browse them. Avatar and Persona images inside the popover load when the surface mounts, so consider whether initials are sufficient for the hidden members to avoid extra network requests.

## Theming & Tokens

AvatarGroupPopover consumes Fluent theme tokens through FluentProvider, so it flips between light, dark, and high-contrast themes without component-level overrides. Neutral styling resolves through tokens.colorNeutralBackground1, tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed, tokens.colorNeutralForeground1, and tokens.colorNeutralForeground2, with tokens.colorNeutralForegroundDisabled available for non-interactive states inherited from the parent group. Focus and border treatments use tokens.colorStrokeFocus1, tokens.colorStrokeFocus2, tokens.colorNeutralStroke1, and tokens.colorTransparentStroke, and the trigger's circular shape comes from tokens.borderRadiusCircular. Branded variants map to tokens.colorBrandBackground, tokens.colorBrandBackgroundHover, tokens.colorBrandBackgroundPressed, and tokens.colorBrandForeground1, while an inverted treatment can use tokens.colorNeutralBackgroundInverted. Typography in the trigger and the overflow list uses tokens.fontFamilyBase with tokens.fontSizeBase200 or tokens.fontSizeBase300 and matching line-height tokens, and spacing inside the popover surface follows the spacing scale such as tokens.spacingHorizontalXS through tokens.spacingHorizontalM and tokens.spacingVerticalXS. The popover surface inherits the theme's elevation and popover tokens, so a custom shadow is rarely necessary.

## Migration Notes

AvatarGroupPopover is a v9-only component and has no one-to-one predecessor. In v8, showing overflow for a pile of people was prop-driven configuration attached to the group itself; v9 splits the responsibility so that AvatarGroup lays out and measures the avatars while AvatarGroupPopover owns the trigger, the tooltip, and the popover surface. When migrating, replace imperative overflow configuration with composition: render AvatarGroupPopover as the last child of AvatarGroup, supply the hidden AvatarGroupItems as children (or pass count when they are wrapped in a fragment), and restyle through the triggerButton, content, popoverSurface, and tooltip slots rather than through style objects passed to a single overflow option.

## Edge Cases

- Children wrapped in a React fragment are invisible to the internal child counting, so the trigger can show a missing or incorrect number unless count is supplied manually.
- When the avatar size in the group is less than 24, the indicator defaults to an icon even when indicator is not set, so a numeric counter can silently disappear.
- A count value that does not match the number of AvatarGroupItem children produces a trigger that advertises a different number of people than the popover shows.
- Rendering the component with no children or a count of zero creates an empty overflow affordance; guard the render so the trigger only appears when people actually overflow.
- Because the popover surface is portaled and positioned against the trigger, ancestors with clipped overflow or transformed containing blocks can cut the surface off or move it unexpectedly.
- On touch devices the tooltip slot is not displayed, so the trigger must be self-explanatory from its label and from the content it opens.
- Very long person names in the overflow list can force the surface wider than expected; plan for truncation or wrapping inside the Persona rows.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
