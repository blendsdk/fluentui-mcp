# AvatarGroup

> **Package**: `@fluentui/react-avatar` v9.11.2
> **Import**: `import { AvatarGroup } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

AvatarGroup is a data-display container that arranges a collection of avatars into a single, compact visual unit. It is deliberately data-agnostic: you render AvatarGroupItem children inside it (and, for the people who do not fit, an AvatarGroupPopover), and the component handles the alignment, overlap, and stacking geometry on your behalf. Three layouts are supported: spread (the default, avatars sitting side by side with spacing), stack (overlapping avatars, the classic facepile look), and pie (avatars arranged in a tight circular cluster where the overlapping edges imply a shared boundary). Every layout accepts the full AvatarSize range from 16 to 128, with 32 as the default, and AvatarGroup passes that size down to its children so the whole group stays visually consistent. AvatarGroup is designed to be paired with the partitionAvatarGroupItems helper, which computes how many items fit inline and returns the inlineItems and overflowItems arrays that you render directly into the group and its popover.

**When to use**: Use AvatarGroup when the collection matters more than any individual member: assignees on a task, teammates on a project, participants in a conversation, or presence indicators in a shared document. Use a single Avatar instead when only one person is represented, and use Persona or a List when each person needs their name, title, presence badge, or other descriptive text alongside their picture. Choose AvatarGroup over manually overlapping Avatar components because the group owns the geometry: it keeps the overlap consistent across sizes and layouts, and it gives you a sanctioned place to put the people who do not fit. Reach for the piped pattern of AvatarGroup plus AvatarGroupPopover plus the partitioning helper whenever the list of people is dynamic or longer than a couple of items.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `layout` | `"spread" \| "stack" \| "pie" \| undefined` | `spread` | No | Layout the AvatarGroupItems should be displayed as. |
| `size` | `AvatarSize \| undefined` | `32` | No | Size of the AvatarGroupItems. |

### Prop Guidance

- **layout**: Controls how the avatars are arranged. spread places AvatarGroupItems side by side with spacing, stack overlaps them into the classic facepile, and pie arranges them into a tight circular cluster. The default is spread. The layout also changes how many items fit inline, so always pass the same value to partitionAvatarGroupItems when you compute the inline and overflow arrays. Use stack for compact inline presence indicators, spread when each avatar needs a distinct hit area, and pie when the group is decorative or brand-forward. `spread`
- **size**: Sets the size of the AvatarGroupItems and therefore the geometry of the overlap. It accepts the AvatarSize scale from 16 to 128 and defaults to 32. Use 24 to 32 for inline metadata rows and lists, 40 to 56 when the group is a focal element such as a project header, and larger sizes sparingly because the group grows proportionally. Do not exceed size 28 in a stack if the avatars are interactive, and remember that when size is below 24 the popover falls back to the icon indicator rather than the count indicator. `32`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import type { AvatarGroupProps } from '@fluentui/react-components';

export const Default = (props: Partial<AvatarGroupProps>): JSXElement => {
  const { inlineItems, overflowItems } = partitionAvatarGroupItems({ items: names });

  return (
    <AvatarGroup {...props}>
      {inlineItems.map(name => (
        <AvatarGroupItem name={name} key={name} />
      ))}
      {overflowItems && (
        <AvatarGroupPopover>
          {overflowItems.map(name => (
            <AvatarGroupItem name={name} key={name} />
          ))}
        </AvatarGroupPopover>
      )}
    </AvatarGroup>
  );
};
```

### Indicator

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';

export const Indicator = (): JSXElement => {
  const styles = useStyles();
  const { inlineItems, overflowItems } = partitionAvatarGroupItems({ items: names });

  return (
    <div className={styles.root}>
      <AvatarGroup>
        {inlineItems.map(name => (
          <AvatarGroupItem name={name} key={name} />
        ))}
        {overflowItems && (
          <AvatarGroupPopover indicator="count">
            {overflowItems.map(name => (
              <AvatarGroupItem name={name} key={name} />
            ))}
          </AvatarGroupPopover>
        )}
      </AvatarGroup>
      <AvatarGroup>
        {inlineItems.map(name => (
          <AvatarGroupItem name={name} key={name} />
        ))}
        {overflowItems && (
          <AvatarGroupPopover indicator="icon">
            {overflowItems.map(name => (
              <AvatarGroupItem name={name} key={name} />
            ))}
          </AvatarGroupPopover>
        )}
      </AvatarGroup>
    </div>
  );
};

Indicator.parameters = {
  docs: {
    description: {
      story: `An AvatarGroup supports an icon and a count indicator.
        When size is less than 24, then icon will be used by default.`,
    },
  },
};
```

### Layout

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';

export const Layout = (): JSXElement => {
  const styles = useStyles();
  const partitionedItems = partitionAvatarGroupItems({ items: names });
  const piePartitionedItems = partitionAvatarGroupItems({ items: names, layout: 'pie' });

  return (
    <div className={styles.root}>
      <AvatarGroup layout="spread">
        {partitionedItems.inlineItems.map(name => (
          <AvatarGroupItem name={name} key={name} />
        ))}
        {partitionedItems.overflowItems && (
          <AvatarGroupPopover>
            {partitionedItems.overflowItems.map(name => (
              <AvatarGroupItem name={name} key={name} />
            ))}
          </AvatarGroupPopover>
        )}
      </AvatarGroup>
      <AvatarGroup layout="stack">
        {partitionedItems.inlineItems.map(name => (
          <AvatarGroupItem name={name} key={name} />
        ))}
        {partitionedItems.overflowItems && (
          <AvatarGroupPopover>
            {partitionedItems.overflowItems.map(name => (
              <AvatarGroupItem name={name} key={name} />
            ))}
          </AvatarGroupPopover>
        )}
      </AvatarGroup>
      <AvatarGroup layout="pie">
        {piePartitionedItems.inlineItems.map(name => (
          <AvatarGroupItem name={name} key={name} />
        ))}
        {piePartitionedItems.overflowItems && (
          <AvatarGroupPopover>
            {piePartitionedItems.overflowItems.map(name => (
              <AvatarGroupItem name={name} key={name} />
            ))}
          </AvatarGroupPopover>
        )}
      </AvatarGroup>
    </div>
  );
};

Layout.parameters = {
  docs: {
    description: {
      story: `An AvatarGroup supports three layouts: spread, stack, and pie. The default is spread.`,
    },
  },
};
```

## Best Practices

### Do's

- Partition the data with partitionAvatarGroupItems and pass the same layout to both the helper and AvatarGroup so the inline/overflow split matches the geometry that is actually rendered.
- Render the returned overflowItems inside AvatarGroupPopover so everyone in the collection remains reachable, rather than clipping extra avatars with CSS.
- Pick the layout intentionally: spread when the group needs breathing room and predictable hit areas, stack for the familiar overlapping facepile, and pie when the cluster itself is a decorative focal point.
- Pass a key derived from stable identity (name or id) to each AvatarGroupItem so React reconciles correctly when people are added or removed.
- Give the group a meaningful accessible label when the collection has a purpose, for example naming the project or stating the number of participants, and customize the popover trigger label through the tooltip prop with relationship set to label when you need translated text.
- Keep the group at size 28 or larger whenever you make individual avatars interactive, so the overlapping targets still satisfy the WCAG target size requirement.
- Use the tooltip configuration on AvatarGroupPopover to localize the overflow trigger's label instead of relying on the built-in English string.

### Don'ts

- Do not render an unbounded list of avatars inline and hide the excess with overflow hidden or a fixed width; the hidden people become unreachable and the count indicator, if any, will be wrong.
- Do not make every avatar in a small stack a separate interactive control; overlapping click targets below size 28 fail WCAG target size requirements.
- Do not reuse a spread partition when rendering a pie or stack group; pie geometry fits fewer inline items, so a mismatched partition will clip or leave gaps.
- Do not mix independently sized Avatar children into the group; let AvatarGroup own the size and use AvatarGroupItem so the overlap offsets stay consistent.
- Do not add your own negative margins, absolute positioning, or z-index hacks to adjust the overlap; the group computes geometry from the size and layout.
- Do not use AvatarGroup to display non-person entities such as files, tags, or status icons; use TagGroup or Badge for those.
- Do not convey identity or membership through color alone; pair color with names, initials, or images so the information is perceivable without color vision.

## Anti-Patterns

### Interactive avatars in a small stack

❌ Making each avatar in a stack layout focusable and clickable when the size is below 28 produces overlapping hit targets, which fails the WCAG target size requirement and makes it easy to activate the wrong person with mouse or touch.

✅ Keep individual avatars non-interactive in a stack and let the AvatarGroupPopover trigger be the only interactive element, or raise the group to size 28 or larger before adding per-avatar interactions.

### Manual slicing instead of partitioning

❌ Hardcoding a slice count such as the first five people and putting the rest in a popover ignores the layout and size that AvatarGroup actually renders with, so the group either clips avatars or wastes space, and the overflow count no longer matches reality.

✅ Call partitionAvatarGroupItems with the item list and the layout you are rendering, then map inlineItems into AvatarGroupItem children and overflowItems into the AvatarGroupPopover.

### Layout mismatch between the partition helper and the group

❌ A pie layout fits fewer inline avatars than a spread layout at the same size, so running the default partitioning and rendering the result inside a pie or stack group causes overlap, clipping, or a stray overflow trigger with no hidden people.

✅ Pass the layout to both places, for example computing the pie partition with the pie layout and setting the same value on AvatarGroup, so the partition and the geometry always agree.

### Overflow hidden with CSS

❌ Rendering every avatar and hiding the excess with overflow hidden, a fixed width, or visibility rules removes people from the experience entirely; screen reader users may still hear them while sighted users cannot reach them.

✅ Render the visible people inline and place the remainder inside AvatarGroupPopover, which keeps every member both visible on demand and correctly announced.

### Forcing overlap with manual margins

❌ Adding negative margins or absolute positioning on top of stack or pie layout fights the geometry the group computes from size, producing inconsistent spacing across sizes and broken keyboard target areas.

✅ Let the layout and size props drive the overlap and reserve custom styling for the root container, using nothing more than a class name and theme tokens.

## Accessibility

**Requirements**: The collection needs a programmatic name when its purpose is not obvious from surrounding context, so provide a label on the group or on the overflow trigger. Every avatar in the group must resolve to a text alternative, which is why AvatarGroupItem takes a name; an avatar that is purely decorative should not be the only carrier of information. Interactive members of a stacked group must meet the WCAG 2.5.8 target size minimum, which is why the stack layout should not be made interactive below size 28. Color contrast for avatar backgrounds, initials, and icons is inherited from Avatar and must satisfy WCAG 1.4.3 against the chosen color tokens.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the group's interactive element, which is the AvatarGroupPopover overflow trigger; when the popover is open, Tab moves through any focusable content on the popover surface. |
| `Shift+Tab` | Moves focus back out of the group or the open popover surface to the previous focusable element. |
| `Enter` | Activates the AvatarGroupPopover trigger and opens the popover listing the overflowed people. |
| `Space` | Also activates the AvatarGroupPopover trigger, matching native button behavior. |
| `Escape` | Dismisses the open popover and returns focus to the trigger that opened it. |

**ARIA**: aria-label, aria-expanded, aria-haspopup, aria-labelledby

**Screen Reader**: The group itself is announced as a container of avatars, and each AvatarGroupItem contributes its name, so a screen reader user hears the members in order. The overflow trigger is exposed as a button; when it has a discernible name from the tooltip with relationship set to label, the accessible name is that tooltip content, otherwise the trigger communicates the remaining count. Activating the trigger reports an expanded state, and the popover surface is announced when it opens, with focus placed inside it and restored to the trigger on close. Because overlapping visuals carry no meaning to assistive technology, always ensure the person names or the group label convey the same information that the stacking conveys visually.

## Styling

AvatarGroup renders a single root slot, so most visual tuning happens through className targeting the root and through the layout and size props. Use tokens.spacingHorizontalXS or tokens.spacingHorizontalS to adjust the gap in spread layout, tokens.borderRadiusCircular when you need to re-round a container that the avatars sit in, and tokens.colorNeutralBackground1 or tokens.colorNeutralStroke2 to align the ring that separates overlapping avatars in stack and pie layouts with the surrounding surface. For the count indicator inside AvatarGroupPopover, tokens.fontSizeBase200 and tokens.fontWeightSemibold keep the number legible at small avatar sizes, while tokens.colorNeutralForeground1 keeps it on-theme. If the group sits on a colored or branded surface, override the ring color with the surface token you are actually painting, for example tokens.colorBrandBackground2. Keep overrides to the group container rather than the children so the overlap offsets computed by the group are not disturbed.

## Performance

AvatarGroup itself is cheap: it renders one root slot and passes size and layout down, so the real cost sits in the AvatarGroupItem children, each of which resolves an image, initials, or an icon and may trigger a network request. Keep overflowed people inside AvatarGroupPopover rather than rendering them inline and hiding them, so hidden avatars do not participate in layout and their images are only fetched when the popover is opened. partitionAvatarGroupItems is a pure calculation over the item list; memoize its result when the list reference is stable across renders instead of recomputing it on every render, and avoid recreating the names array inline. For very long member lists, prefer capping the collection and linking to a full roster rather than mounting hundreds of avatars.

## Theming & Tokens

AvatarGroup inherits everything from FluentProvider, so its spacing and rounding come from Griffel tokens such as tokens.spacingHorizontalXS for the spread gap and tokens.borderRadiusCircular for perfectly round geometry. The ring that separates overlapping avatars in stack and pie layouts should match the surface behind it, which is why tokens.colorNeutralBackground1 and tokens.colorNeutralStroke1 are the natural defaults and tokens.colorBrandBackground2 or tokens.colorNeutralBackground3 are the overrides to use on tinted surfaces. Count and icon indicators inside the popover read from typography and foreground tokens such as tokens.fontSizeBase200, tokens.fontWeightSemibold, and tokens.colorNeutralForeground1, while the avatars themselves pick up palette and brand tokens from Avatar. The size prop is independent of the theme; it maps onto the AvatarSize scale and drives the internal overlap math, so changing themes never changes the group's footprint.

## Migration Notes

The v9 AvatarGroup is a compositional container rather than a data-driven one: instead of passing an array of people plus a maximum count, you render AvatarGroupItem children and place AvatarGroupPopover as the last child to catch the people who do not fit. Sizes use the AvatarSize numeric scale (16 through 128) with a default of 32, and layout is chosen from spread, stack, and pie with spread as the default. When porting code from earlier versions or from hand-rolled facepile implementations, replace manual array slicing with partitionAvatarGroupItems and pass it the same layout you give AvatarGroup, and replace custom overflow counters or hardcoded +N labels with AvatarGroupPopover, optionally setting its indicator to count or icon.

## Edge Cases

- When the group size is below 24, the AvatarGroupPopover indicator defaults to the icon rather than the numeric count, so plan for a chevron-style trigger in dense rows.
- The pie layout fits fewer inline avatars than spread or stack at the same size; always recompute the partition with the pie layout before rendering a pie group.
- Changing the size prop does not re-partition your data; if the number of inline avatars depends on the rendered size, recompute partitionAvatarGroupItems whenever size or the item list changes.
- If every item overflows, the group renders only the popover trigger, so make sure that state still reads as a group in context.
- The group's height is driven by the largest avatar and, in stack and pie layouts, by the overlap offsets, so a very large size in a tight container can cause unexpected vertical growth or clipping.
- A group without a label is announced as a series of unrelated avatar names; add a group-level label when the collection is meaningful on its own.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
