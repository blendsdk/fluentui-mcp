# TagGroup

> **Package**: `@fluentui/react-tags` v9.9.1
> **Import**: `import { TagGroup } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

TagGroup is a data-display container that lays out a horizontal, wrapping collection of Tag and InteractionTag elements as a single semantic unit. It does not render tags itself; instead it provides shared context to its children, including a default size and appearance, an all-or-nothing disabled state, group-level dismissal wiring through the onDismiss callback plus the dismissible flag, and group-level selection wiring through selectedValues, defaultSelectedValues, and onTagSelect. Because a TagGroup renders a single root slot, it is a thin, styleable flex container that you compose with any number of Tag, InteractionTag, or OverflowItem children. Typical uses include displaying a set of applied filters, keywords, categories, or recipients that a user can review, select, or remove, and the WithOverflow story shows the group participating in the Overflow pattern so that surplus tags collapse into an overflow menu. The Default story demonstrates the two supported child families: plain Tag (display-only, optionally dismissible) and InteractionTag (interactive primary action, optionally with a secondary dismiss action), and the Sizes story shows the group cascading a single size to every child.

**When to use**: Use TagGroup whenever more than one tag is displayed together and you want them treated as one collection with consistent sizing, appearance, disabled behavior, and dismissal handling. Reach for it when the tags share a common purpose such as active filters, selected categories, recipients in a message, or keywords on an item. Choose TagGroup rather than placing individual Tag components loose in your layout because only the group can distribute size and appearance defaults, expose one accessible name for the collection, and coordinate the overflow pattern. Choose it over a plain list or listbox when the items are short, read-only or singly actionable labels rather than a selection model with keyboard roving focus. If the user needs to add or search for tags, use TagPicker instead; TagGroup is for presenting and acting on an already-determined set. For display-only status or counts that are not part of a collection, use Badge, CounterBadge, or PresenceBadge instead.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `TagAppearance \| undefined` | `'filled'` | No | — |
| `defaultSelectedValues` | `Value[] \| undefined` | — | No | Sets selected values for an uncontrolled component. |
| `disabled` | `boolean \| undefined` | `false` | No | A TagGroup can show that it cannot be interacted with. |
| `dismissible` | `boolean \| undefined` | `false` | No | — |
| `onDismiss` | `TagDismissHandler<Value> \| undefined` | — | No | Callback for when a tag is dismissed |
| `onTagSelect` | `EventHandler<TagSelectData<Value>> \| undefined` | — | No | Callback for when a tag is selected |
| `selectedValues` | `Value[] \| undefined` | — | No | Values of the selected tags |
| `size` | `TagSize \| undefined` | `'medium'` | No | — |

### Prop Guidance

- **onDismiss**: Supply this callback to receive the tag that the user removed and update your own state; the story description emphasizes that focus must be managed when the last tag is dismissed. Pair it with the dismissible flag so the dismiss affordance is rendered, and keep the callback identity stable with useCallback to avoid re-rendering every tag in the group. `onDismiss={(event, data) => setTags(tags.filter(tag => tag.value !== data.value))}`
- **dismissible**: Set to true to render dismissal affordances across the collection, allowing users to remove individual tags; use it only when the user is permitted to change the set, and leave it false for read-only displays of metadata. It defaults to false. `dismissible`
- **selectedValues**: Use the controlled form when the selection lives in your own state, always alongside onTagSelect so the group re-renders from a single source of truth. Do not combine it with defaultSelectedValues in the same instance. `selectedValues={['design', 'engineering']}`
- **defaultSelectedValues**: Use the uncontrolled form when the group can own the initial selection itself; it sets the starting selection only and later changes must be read through onTagSelect. Pass it only when you are not passing selectedValues. `defaultSelectedValues={['design']}`
- **onTagSelect**: Provide this handler to respond when a tag in the group is selected, for example to update a filter list or log usage; combine it with selectedValues for fully controlled selection and keep it stable across renders. `onTagSelect={(event, data) => setSelected(data.selectedValues)}`
- **disabled**: Set true to render the whole collection as non-interactive, for example while a save is in flight or when the user lacks permission to change the set. Because it disables every child, prefer it over disabling tags one at a time when the intent is a locked group. It defaults to false. `disabled={isReadOnly}`
- **size**: Sets the default size for every tag in the group; supported values are medium, small, and extra-small, with medium as the default. Choose the size to match the density of the surrounding surface, and rely on it instead of restyling individual tags. `size="small"`
- **appearance**: Sets the default visual treatment for every tag in the group, such as filled or outline, with filled as the default. Use the same appearance for all groups in the same region so collections read consistently, and reserve a different appearance to signal a distinct state rather than as decoration. `appearance="outline"`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { TagGroup, InteractionTag, InteractionTagPrimary, Tag, makeStyles } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      Example with Tag:
      <WithTags />
      Example with InteractionTag:
      <WithInteractionTags />
    </div>
  );
};
```

### Disabled

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { TagGroup, InteractionTag, InteractionTagPrimary, Tag, makeStyles } from '@fluentui/react-components';

export const Disabled = (): JSXElement => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      Disabled example with Tag:
      <WithTags />
      Disabled example with InteractionTag:
      <WithInteractionTags />
    </div>
  );
};

Disabled.storyName = 'Disabled';
Disabled.parameters = {
  docs: {
    description: {
      story: 'A TagGroup can be disabled. The collection of Tag/InteractionTag will also be disabled.',
    },
  },
};
```

### Dismiss

```tsx
import * as React from 'react';
import type { JSXElement, TagGroupProps } from '@fluentui/react-components';

export const Dismiss = (): JSXElement => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      Example with Tag:
      <DismissWithTags />
      Example with InteractionTag:
      <DismissWithInteractionTags />
    </div>
  );
};

Dismiss.storyName = 'Dismiss';
Dismiss.parameters = {
  docs: {
    description: {
      story:
        'A TagGroup contains a collection of Tag/InteractionTag that can be dismissed. Ensure that focus is properly managed when all tags have been dismissed.',
    },
  },
};
```

## Best Practices

### Do's

- Give every TagGroup an accessible name with aria-label describing the collection, as the Sizes and WithOverflow stories do with strings such as an overflow example label or a size-specific label.
- Set size and appearance once on the TagGroup so all children inherit a consistent default, rather than repeating the same values on each child tag.
- Keep a group's children homogeneous in purpose: use only Tag children or only InteractionTag children rather than interleaving display-only and interactive tags in the same collection.
- Use the dismissible flag together with onDismiss instead of hand-rolling removal logic on each child tag, so dismissal behavior is uniform across the collection.
- For controlled selection, always provide selectedValues together with onTagSelect so the group has a single source of truth and re-renders from your state.
- Wrap the group in Overflow and wrap every tag in OverflowItem when the collection can exceed the available width, and add an OverflowMenu as the last child, as shown in the WithOverflow story.
- Manage focus explicitly after a dismissal, since the Dismiss story warns that focus must be handled properly once all tags have been removed from the group.
- Keep the group's contents shallow: TagGroup expects tag and overflow-item children, so leave padding and page-level layout to an outer container.

### Don'ts

- Don't place arbitrary markup such as paragraphs, buttons, or form fields directly inside a TagGroup; the group is a tag collection, not a general layout container.
- Don't mix controlled and uncontrolled selection by passing defaultSelectedValues and selectedValues at the same time, since the group cannot honor both.
- Don't set the disabled flag expecting individual child tags to remain focusable; a disabled TagGroup renders its whole collection as non-interactive.
- Don't hard-code colors, font sizes, or gaps on the root when the size and appearance props and Griffel tokens already cover those variations.
- Don't rely on the TagGroup alone to make a collapsed tag reachable; without Overflow, OverflowItem, and an OverflowMenu the hidden tags are simply clipped.
- Don't forget to move focus after dismissing every tag, or keyboard users lose their place with no remaining interactive element in the group.
- Don't use TagGroup as a navigation or selection list with roving arrow-key focus; use a list, Listbox, or a menu when a full selection model is required.
- Don't apply a different size to each child tag unless you have a deliberate exception; inconsistent tag heights make the row ragged and the group harder to scan.

## Anti-Patterns

### Using TagGroup as a generic layout container

❌ TagGroup is a tag collection whose semantics, sizing, disabled behavior, and dismissal wiring are all aimed at Tag and InteractionTag children. Dropping buttons, form fields, or arbitrary markup inside it produces a container that announces and behaves incorrectly and inherits tag-specific defaults.

✅ Keep only Tag, InteractionTag, and OverflowItem children inside the group, and wrap the group itself in a plain flex container when you need surrounding layout, padding, or page-level spacing.

### Overflow without item wrapping

❌ Placing a TagGroup inside Overflow but leaving tags as bare children means the Overflow component cannot measure or hide them, so extra tags are clipped or pushed off screen and become unreachable for keyboard and screen reader users.

✅ Wrap each tag in an OverflowItem with a stable id and add an OverflowMenu as the final child of the group, tuning Overflow's padding and minimumVisible values as the WithOverflow story does.

### Mixing controlled and uncontrolled selection

❌ Passing both selectedValues and defaultSelectedValues leaves the group in an ambiguous state where the initial selection and the authoritative selection disagree, producing selection that appears to change and then snap back.

✅ Pick one model: pass selectedValues with onTagSelect to own the state, or pass defaultSelectedValues alone and read changes from onTagSelect.

### Dismissing every tag without moving focus

❌ When the last tag in a dismissible group is removed, the focused element disappears from the DOM and keyboard users are dropped back to the top of the document with no indication of what happened.

✅ After the final dismissal, programmatically move focus to a stable, meaningful target such as the control that adds tags or the region that contained the group, exactly as the Dismiss story cautions.

### Re-styling each tag to fake a size or appearance change

❌ Applying per-tag classes for font size or colors duplicates work the group already does, and the resulting group has inconsistent tag heights and drifts from the theme when tokens change.

✅ Set size and appearance once on TagGroup and let it cascade to all children, reserving per-tag overrides for genuinely exceptional cases.

## Accessibility

**Requirements**: TagGroup must expose one named region for the collection so assistive technology can announce it as a unit; supply aria-label (or an equivalent labelling attribute) on the group, as every story does. Every interactive element inside the group must be reachable and operable by keyboard, including the primary action of each InteractionTag and any secondary dismiss button. Secondary dismiss buttons must carry their own accessible name such as the aria-label used in the Sizes story. When the disabled prop is set, the non-interactive state must be programmatically determinable and must not allow keyboard focus into dead controls, satisfying WCAG 2.1.1 Keyboard, 2.1.2 No Keyboard Trap, 2.4.3 Focus Order, 2.4.7 Focus Visible, 3.2.1 On Focus, and 4.1.2 Name, Role, Value. Tag text and tag backgrounds must meet WCAG 2.1 contrast minimums of 4.5:1 for normal text and 3:1 for non-text UI, which the filled and outline appearances achieve through theme tokens. When combined with Overflow, the collapsed items must still be discoverable through the overflow menu button, and the count announced by that button must be accurate.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the TagGroup, then to each focusable tag primary action and dismiss button in document order. |
| `Shift+Tab` | Moves focus backward out of the group or to the previously focusable tag element. |
| `Enter` | Activates the focused InteractionTag primary action or the focused secondary dismiss button, triggering onTagSelect or onDismiss respectively. |
| `Space` | Activates the focused interactive tag control, equivalent to Enter for tag primaries and dismiss buttons. |
| `Enter or Space on the overflow menu button` | Opens the overflow menu so that tags collapsed out of the visible row remain reachable. |

**ARIA**: aria-label, aria-labelledby, aria-disabled, aria-label on secondary dismiss buttons (for example, a remove label), aria-haspopup and aria-expanded on the overflow menu trigger when used with Overflow

**Screen Reader**: Screen readers encounter the TagGroup as a single named container and then read its children in DOM order. Each plain Tag is announced as static text, while each InteractionTag primary is announced as an actionable element with its label, and each secondary action is announced as a separate button carrying its own accessible name. When the group is disabled, the collection is announced as unavailable and the interior controls are not focusable. When the group is placed inside Overflow, tags that do not fit are removed from the accessibility tree and a menu button is announced instead, usually with a count so users know how many tags are hidden; activating it exposes the remaining tags as menu items. Because dismissal removes a tag from the middle of the group, no automatic announcement is made that the item was removed unless the application provides one.

## Styling

TagGroup renders a single root slot, so all customization goes through the className you pass to the root, typically produced by makeStyles. Override the root's display to flex, add flexWrap: 'wrap', and control rhythm with tokens.spacingHorizontalXS or tokens.spacingHorizontalS for the gap between tags and tokens.spacingVerticalXS for wrapped rows. When laying out size variants, the Sizes story keeps tags on a flex row and lets the group's size prop handle the tag geometry, so avoid duplicating font or padding overrides in your own classes. Border and background polish should come from tokens such as tokens.borderRadiusMedium, tokens.colorNeutralBackground1, or tokens.colorNeutralBackground2 rather than literal colors. For the overflow scenario, constrain the group with a max width or flex minWidth: 0 so Overflow has a boundary to measure against, and remember that the padding and minimumVisible values on Overflow, not on TagGroup, control how many tags stay visible. If you need the group to fill a row and truncate, apply flexGrow and minWidth: 0 to the root and keep child tags at flexShrink: 0 so they never squash.

## Performance

TagGroup itself is a lightweight flex wrapper with a single root slot and no internal measurement, so its cost is dominated by the children you put inside it. The expensive path is the overflow pattern: Overflow measures item widths, listens for container resizes, and re-renders when the set of visible items changes, so keep the tag array memoized and avoid reconstructing tag objects on every render. Handlers matter more than usual here because a new onDismiss or onTagSelect identity each render can invalidate every child tag; wrap them in useCallback and keep the values they close over stable. For very large sets, render only what the user needs to see rather than mounting hundreds of tags, since each InteractiveTag brings its own event wiring and, when dismissible, a second button element. Avoid passing inline style objects to the root class; generate classes with makeStyles so Griffel can reuse a single atomic class across renders.

## Theming & Tokens

TagGroup accepts no color props of its own; it inherits everything from FluentProvider and passes size and appearance defaults down to its tag children. The tags inside then resolve their surfaces from tokens such as tokens.colorNeutralBackground1 and tokens.colorNeutralBackground3 for neutral filled tags, tokens.colorNeutralStroke1 and tokens.colorNeutralStrokeAccessible for outline borders, tokens.colorNeutralForeground1 and tokens.colorNeutralForeground2 for label text, and tokens.colorBrandBackground and tokens.colorBrandForeground1 when a brand treatment is active. Text sizing flows from tokens.fontSizeBase200 and tokens.fontSizeBase300, and tag geometry uses tokens.borderRadiusMedium plus spacing tokens such as tokens.spacingHorizontalS, tokens.spacingHorizontalXS, tokens.spacingVerticalXS, and tokens.spacingVerticalXXS. Focus rings on interactive tags are drawn with tokens.colorStrokeFocus2, and disabled tags fall back to tokens.colorNeutralForegroundDisabled and tokens.colorNeutralBackgroundDisabled. In high-contrast themes these aliases resolve to system colors automatically, so avoid literal hex values anywhere in the group.

## Migration Notes

TagGroup is a new v9 grouping primitive; there is no direct v8 equivalent, so migrated code that previously rendered an ad hoc row of v8 tag elements should be restructured as a TagGroup whose children are v9 Tag or InteractionTag components. Responsibilities were split in v9: dismissal and selection state are hoisted to the group through the dismissible and onDismiss props and the selectedValues, defaultSelectedValues, and onTagSelect props, whereas per-item visual configuration such as shape, icon, media, and secondary action handling lives on the individual tags. Consumers replacing v8 TagPicker-based read-only tag lists with TagGroup should keep TagPicker only for the input side of the flow, since TagGroup has no input or autocomplete capability. Be aware that size and appearance are group-level defaults in this API, which means a v8 pattern of styling each tag independently should be re-expressed as one value on the group with rare per-tag exceptions.

## Edge Cases

- The Select story notes that tag selection currently only changes the appearance of the tag; the integration between the group's selection props and the individual InteractionTag selection state should be verified against the current release before relying on selectedValues as a complete selection model.
- Dismissing the final tag leaves the group empty and removes the focused element; the Dismiss story explicitly warns to manage focus properly in that situation.
- A disabled TagGroup disables the entire collection, including any secondary dismiss buttons, so a partially disabled set must be expressed by disabling individual tags rather than the group.
- size and appearance act as group-level defaults, so a child tag that sets its own size or appearance wins for that tag and can make a row look uneven.
- Overflow only hides items when the group is inside an Overflow container with OverflowItem children and an OverflowMenu present; otherwise surplus tags are clipped and unreachable.
- The group root needs an accessible name; omitting aria-label leaves an unnamed collection that screen reader users cannot identify, which is why every story supplies one.
- Very long tag labels can defeat a fixed-width layout; constrain the group with minWidth: 0 and allow tags to truncate or wrap rather than letting the row overflow the container.
- Controlled selection requires a stable onTagSelect identity, since a new function on each render can cause the tags to re-render and lose transient pressed styling.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
