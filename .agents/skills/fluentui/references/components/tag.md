# Tag

> **Package**: `@fluentui/react-tags` v9.9.1
> **Import**: `import { Tag } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

Tag is a compact data-display element that labels, categorizes, or annotates content with a short piece of text. It always renders a required root and a required primaryText slot (children of the root are rendered into primaryText automatically), and it can optionally render secondary text, a media slot (typically an Avatar), an icon, and a dismiss icon. A single Tag therefore ranges from a bare keyword chip to a rich entity label with an avatar, supporting metadata, and a remove affordance. Tag supports three appearances (filled, outline, and brand), two shapes (round and circular), and three sizes (medium, small, and extra-small), along with independent disabled, dismissible, and selected states. Each Tag can carry a unique value that identifies it inside a TagGroup, which is where dismissal of a whole collection is coordinated. Tag is a display primitive rather than an interactive control; richer interactive behavior is layered on top of the same visual language by components such as InteractionTag and TagGroup.

**When to use**: Use Tag to represent keywords, categories, labels, applied filters, or attributes attached to a piece of content, especially in collections where users scan many short labels at once. Use Tag when the label is primarily informational and only needs an optional remove affordance. Choose TagGroup when you are rendering a collection of tags that share dismissal or selection behavior and need a group label. Choose InteractionTag when the tag itself must be clickable or toggleable by the user, and a Button, CompoundButton, or Link when the element is really an action or navigation target. Choose Badge, CounterBadge, or PresenceBadge when the value is a count, a numeric indicator, or a status rather than a label. Choose Persona when a person needs to be presented with full name, secondary details, and presence outside of a compact chip.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `TagAppearance \| undefined` | `'filled'` | No | A Tag can have filled, outlined or brand experience. |
| `disabled` | `boolean \| undefined` | `false` | No | A Tag can show that it cannot be interacted with. |
| `dismissible` | `boolean \| undefined` | `false` | No | A Tag can be dismissible |
| `selected` | `boolean \| undefined` | `false` | No | An InteractionTag can be selected. Note: This prop only changes the appearance of the tag at the moment. A future PR will add the integration with TagGroup. |
| `shape` | `TagShape \| undefined` | `'round'` | No | A Tag can have rounded or circular shape. |
| `size` | `TagSize \| undefined` | `'medium'` | No | A Tag has three sizes. |
| `value` | `Value \| undefined` | — | No | Unique value identifying the tag within a TagGroup |

### Prop Guidance

- **appearance**: Controls the visual weight of the tag. Use filled (the default) on plain surfaces for the standard keyword look, outline when tags sit on busy, tinted, or image-backed surfaces and need to recede, and brand sparingly to call out the primary or highlighted category in a set. `filled`
- **disabled**: Marks a tag as non-interactive when its label is preserved for context but the underlying entity can no longer be acted upon. Avoid combining it with dismissible, because a disabled dismiss affordance cannot be reached or activated by keyboard. `true`
- **dismissible**: Renders the dismissIcon slot and makes the dismiss affordance focusable so users can remove the tag. Use it on tags the user added or can remove, and always pair it with an aria-label on the dismissIcon and a handler that updates your collection. `true`
- **selected**: Reflects a selected state visually, typically driven by your own selection state in a filter-style scenario. Note that it currently only changes the tag's appearance; the integration with TagGroup is not wired up yet, so do not treat the prop itself as state management. `true`
- **shape**: Chooses between the default round shape and the fully circular shape. Use round for text-bearing tags and circular for tags dominated by a media slot or a single icon, since long text inside a circular tag defeats the shape. `circular`
- **size**: Sets the tag's density. Use medium for standard content areas, small for toolbars and filter rows, and extra-small for very dense contexts such as table cell annotations. Keep one size per collection so rows of tags align. `small`
- **value**: Provides the unique identifier for a tag inside a TagGroup so group-level dismissal and selection callbacks can report which tag was acted upon. Set it on every tag in a collection and keep the values unique within that group. `design`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `dismissIcon` | — | No | Slot for the dismiss icon |
| `icon` | — | No | Slot for an icon |
| `media` | — | No | Slot for a visual element, usually an avatar |
| `primaryText` | — | Yes | Main text for the Tag. Children of the root slot are automatically rendered here |
| `root` | — | Yes | — |
| `secondaryText` | — | No | Secondary text that describes or complements the main text |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement, TagProps } from '@fluentui/react-components';
import { Tag } from '@fluentui/react-components';

export const Default = (props: Partial<TagProps>): JSXElement => <Tag {...props}>Primary text</Tag>;
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Tag, makeStyles } from '@fluentui/react-components';
import { CalendarMonthRegular } from '@fluentui/react-icons';

export const Appearance = (): JSXElement => {
  const styles = useContainerStyles();
  return (
    <div className={styles.container}>
      <Tag icon={<CalendarMonthRegular />} dismissible dismissIcon={{ 'aria-label': 'remove' }}>
        filled
      </Tag>
      <Tag appearance="outline" icon={<CalendarMonthRegular />} dismissible dismissIcon={{ 'aria-label': 'remove' }}>
        outline
      </Tag>
      <Tag appearance="brand" icon={<CalendarMonthRegular />} dismissible dismissIcon={{ 'aria-label': 'remove' }}>
        brand
      </Tag>
    </div>
  );
};

Appearance.storyName = 'Appearance';
Appearance.parameters = {
  docs: {
    description: {
      story: 'A tag can have a `filled`, `outline` or `brand` appearance. The default is `filled`.',
    },
  },
};
```

### Disabled

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Tag, makeStyles } from '@fluentui/react-components';
import { CalendarMonthRegular } from '@fluentui/react-icons';

export const Disabled = (): JSXElement => {
  const styles = useContainerStyles();
  return (
    <div className={styles.container}>
      <Tag
        disabled
        secondaryText="appearance=filled"
        icon={<CalendarMonthRegular />}
        dismissible
        dismissIcon={{ 'aria-label': 'remove' }}
      >
        Disabled
      </Tag>
      <Tag
        disabled
        secondaryText="appearance=outline"
        appearance="outline"
        icon={<CalendarMonthRegular />}
        dismissible
        dismissIcon={{ 'aria-label': 'remove' }}
      >
        Disabled
      </Tag>
      <Tag
        disabled
        secondaryText="appearance=brand"
        appearance="brand"
        icon={<CalendarMonthRegular />}
        dismissible
        dismissIcon={{ 'aria-label': 'remove' }}
      >
        Disabled
      </Tag>
    </div>
  );
};
```

## Best Practices

### Do's

- Keep primary text to a word or two so tags remain scannable in dense collections.
- Always give the dismissIcon an accessible name such as 'remove' via aria-label whenever dismissible is set, since the dismiss affordance becomes focusable and is announced by screen readers.
- Set a unique value on every Tag rendered inside a TagGroup so dismissal and selection handlers can identify exactly which tag was acted upon.
- Pick a single appearance and size for all tags in one group; reserve brand appearance for the one category or state that deserves emphasis.
- Use the media slot for avatars and the icon slot for glyphs, and use secondaryText for complementary metadata rather than essential information.
- Prefer outline appearance when tags sit on visually busy or tinted surfaces, and filled appearance on plain surfaces for the default look.
- Move focus deliberately after a dismissible tag is removed, for example to the next tag or to a reset control when the collection becomes empty.

### Don'ts

- Do not use Tag as a button, link, or filter toggle; it has no built-in activation semantics, so use InteractionTag, Button, or Link instead.
- Do not make a dismissible tag disabled as a way of hiding it; disabled dismissible tags are unreachable by keyboard and leave users unable to clean up the collection.
- Do not rely on the selected prop as your source of truth for application state; it currently only changes the tag's appearance.
- Do not mix sizes, shapes, or appearances arbitrarily within a single group of tags, since the inconsistency breaks scanability.
- Do not stack a media slot, an icon, long primary text, and long secondary text on the same tag; the result reads as a cramped, noisy chip.
- Do not use Tag for counts or status lights; CounterBadge, Badge, and PresenceBadge exist for those signals.
- Do not duplicate info between secondaryText and primaryText or repeat the word 'remove' in visible copy alongside the dismiss icon.

## Anti-Patterns

### Using Tag as an interactive control

❌ Tag is a display primitive without activation semantics, so attaching click handlers to make it behave as a filter or a button leaves keyboard and screen reader users without a reliable way to trigger or understand the action.

✅ Use InteractionTag or TagGroup when the tag must be clicked, toggled, or selected, and use Button or Link when the element is genuinely an action or a navigation target.

### Unlabeled dismiss affordance

❌ A dismissible tag becomes focusable, and without an accessible name on the dismissIcon screen reader users encounter an anonymous control and cannot tell what will be removed.

✅ Always pass an accessible name through the dismissIcon slot, such as an aria-label of 'remove', and make it specific when several removable tags are present on screen.

### Visual free-for-all inside a group

❌ Mixing filled, outline, and brand appearances, different shapes, and different sizes in a single row of tags produces visual noise that destroys the at-a-glance scanning that tags are meant to enable.

✅ Choose one appearance, shape, and size per collection and reserve brand appearance for the single category or state that must stand out.

### Disabling dismissible tags to remove them

❌ A disabled tag with a dismiss icon is unreachable by keyboard, so users who can see the tag have no way to clear it, and the disabled state reads as 'not available' rather than 'already applied'.

✅ Remove tags by calling the TagGroup onDismiss handler with the tag's value, or simply stop rendering the tag, instead of disabling it.

### Treating selected as application state

❌ The selected prop currently only changes the appearance of the tag and is not yet integrated with TagGroup, so relying on it to track what is selected produces visual state that can drift from your data.

✅ Keep selection in your own state, pass selected reflectively based on that state, and update the state in your own handler when the tag is activated through a supported interactive wrapper.

## Accessibility

**Requirements**: Tags must meet WCAG 2.1 AA contrast for their text against the tag background in every appearance (filled, outline, and brand) and in both rest and hover states. A dismissible tag becomes focusable, so it must have a visible focus indicator that is not conveyed by color alone, and every dismiss icon must have a programmatic name describing the action. When tags are rendered in a collection, wrap them in a group that carries an aria-label so the collection has a name. Disabled tags should still be perceivable and their disabled state must be conveyed programmatically rather than only through a muted color.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the next focusable element, including the dismiss affordance of a dismissible tag. |
| `Shift+Tab` | Moves focus to the previous focusable element, including a previously focused dismiss affordance. |
| `Enter` | Activates the focused dismiss affordance and removes the tag from the collection. |
| `Space` | Activates the focused dismiss affordance and removes the tag from the collection. |

**ARIA**: aria-label, aria-disabled

**Screen Reader**: A plain Tag is exposed as static text, so screen readers read the primary text and, when present, the secondary text as part of the tag's content. When dismissible is set, the dismiss icon is exposed as a focusable control whose name comes from the aria-label supplied through the dismissIcon slot, so users hear something like 'remove, button' before the tag content, and activating it removes the tag. Inside a TagGroup with an aria-label, the group is announced with its name so users understand they are moving through a named set of labels rather than loose text. A disabled tag remains in the accessibility tree and is announced as unavailable rather than disappearing from the reading order.

## Styling

Tag styling is expressed through Griffel and should be customized by targeting slots rather than fighting the built-in styles. Filled tags draw their background from tokens.colorNeutralBackground3 with tokens.colorNeutralForeground2 text, outline tags use tokens.colorNeutralBackground1 with a tokens.colorNeutralStroke1 border, and brand tags swap in tokens.colorBrandBackground2 and tokens.colorBrandForeground2. Secondary text is intentionally de-emphasized with tokens.colorNeutralForeground3, so if you need it to read as primary content you should promote it to primaryText instead of overriding the color. Round tags use tokens.borderRadiusMedium while circular tags use tokens.borderRadiusCircular, and sizes are driven by typography and spacing tokens such as tokens.fontSizeBase300, tokens.fontSizeBase200, tokens.spacingHorizontalS, tokens.spacingHorizontalXS, and tokens.spacingVerticalXS. Hover and pressed feedback comes from the neutral background hover and pressed token families, and focus rings use tokens.colorStrokeFocus2, so any custom interactive styling must preserve a visible focus ring. Disabled styling resolves to tokens.colorNeutralForegroundDisabled and the disabled background tokens, which you should leave intact so disabled tags remain legible.

## Performance

Tag is a cheap, stateless element: it renders a single root node with a handful of slot elements and uses no portals, so hundreds of plain tags render without measurable cost. Cost grows with dismissible tags because each one adds a focusable control and typically a group-level handler, so keep the onDismiss callback for a TagGroup stable (for example via useCallback) to avoid re-rendering every tag on each parent render. When building large filter or keyword areas, render the tags into a TagGroup rather than into ad-hoc wrappers so dismissal and labeling logic stays centralized and does not duplicate listeners per tag. Very long tag lists should be paired with wrapping or overflow strategies so layout recalculation stays predictable, and stable value keys should be used so React can reconcile removals without remounting the remaining tags and losing focus.

## Theming & Tokens

Tag is fully theme-driven through FluentProvider, and its three appearances map cleanly onto token families. The filled appearance uses tokens.colorNeutralBackground3 as its surface with tokens.colorNeutralForeground2 text, and its hover and pressed states move through the neutral background hover and pressed tokens. The outline appearance uses tokens.colorNeutralBackground1 with a tokens.colorNeutralStroke1 border and the same neutral foreground, so it inherits the current theme's neutral ramp. The brand appearance substitutes tokens.colorBrandBackground2 and tokens.colorBrandForeground2 so it tracks brand ramp changes automatically, including in high contrast themes. Secondary text resolves to tokens.colorNeutralForeground3, disabled tags resolve to tokens.colorNeutralForegroundDisabled plus the disabled background tokens, and focus indication uses tokens.colorStrokeFocus2. Shape is expressed with tokens.borderRadiusMedium and tokens.borderRadiusCircular, while size is expressed with typography and spacing tokens such as tokens.fontSizeBase300 for medium and tokens.fontSizeBase200 for the smaller sizes, which means switching between the web light, dark, and high contrast themes requires no per-component overrides.

## Migration Notes

In v9 the Tag surface was consolidated around a single component with slot-based composition. Where older implementations composed the visual pieces themselves or attached a per-tag dismiss callback, v9 exposes dismissal as a declarative dismissible boolean that renders the dismissIcon slot, while the actual dismiss handling for a collection lives on the TagGroup wrapper's onDismiss and identifies the tag through its value. Appearance naming is standardized on filled, outline, and brand (with filled as the default), size on medium, small, and extra-small (with medium as the default), and shape on round and circular (with round as the default). Avatar-like content that used to be composed by hand is now passed through the media slot, and all visual styling moved from legacy style props to Griffel classes and theme tokens.

## Edge Cases

- The selected prop currently changes appearance only; TagGroup integration is explicitly not implemented yet, so selection state must be owned by the consuming application.
- Children of the root slot are rendered into primaryText automatically, so passing both children and an explicit primaryText slot duplicates the label.
- A dismissible tag is focusable, which means the focus position must be managed when the tag disappears; if the last tag is dismissed, focus should move to a meaningful control such as a reset button.
- Both media and icon slots can be provided at the same time; the layout supports it, but the combination plus secondary text quickly becomes visually dense.
- Circular shape is designed for media- or icon-led tags; applying it to a long text label produces a shape that no longer reads as circular and loses the intended meaning.
- Tag has no onDismiss prop of its own; dismissal is declared with dismissible and handled at the TagGroup level, which reports the dismissed tag through its value.
- Disabled combined with dismissible leaves a remove affordance that is rendered but unreachable, which is almost never the intended outcome.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
