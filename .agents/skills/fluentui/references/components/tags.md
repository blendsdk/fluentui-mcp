# Tags

> **Package**: `@fluentui/react-tags` v9.9.1
> **Import**: `import { Tags } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

The Tags component family in FluentUI React v9 is a set of building blocks for displaying compact, labelled metadata — keywords, categories, filters, entities, or anything else that needs a small, pill-shaped representation. The family is composed of Tag (a purely presentational tag), InteractionTag (a tag that can host a primary action and an optional secondary action), InteractionTagPrimary (the main, focusable body of an interaction tag, which accepts an icon, media such as an Avatar, and secondary text), InteractionTagSecondary (the trailing action, typically a dismiss or remove button, that becomes available when the primary declares hasSecondaryAction), and TagGroup (a wrapper that lays out a collection of Tag or InteractionTag siblings and can centrally handle dismiss, disabled state, selection styling, and default sizing). The Tags root itself accepts a required, non-nullable button slot (root), a value used to identify an individual tag within a group, and the hasSecondaryAction flag that coordinates a tag's primary and secondary regions. Because a tag is rendered on a button root, it can carry ordinary button props such as aria-label, className, onClick, and ref forwarding. Appearance (filled, outline, brand), shape (rounded or circular), size (medium, small, extra-small), selected, and disabled give the family the visual range needed for chips, filter rows, recipient lists, and entity summaries, while TagGroup adds collection-level behaviours such as dismiss callbacks, collective disabling, and a shared default size for all children.

**When to use**: Use Tag when you need a static, non-interactive label — a keyword, a category, a status, or a read-only attribute of an item. Use InteractionTag when the label itself must be actionable, for example to open a Popover with more detail (as in the Has Primary Action example), to toggle a filter, or to be removed. Use InteractionTagPrimary together with InteractionTagSecondary when you want two distinct hit targets inside a single visual tag: a large primary region plus a smaller trailing action such as a dismiss icon. Use TagGroup whenever you render more than one tag and want consistent spacing, a single source of truth for size and disabled state, a shared onDismiss handler that receives the value of the removed tag, and alignment with Overflow for constrained containers. Prefer a Tag over a Button when the content is metadata rather than a call to action, and prefer an InteractionTag over a plain Link when the whole pill should be clickable. For free-form entry of new tags, pair this family with combobox-style entry components rather than trying to make a tag itself an input.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `hasSecondaryAction` | `boolean` | — | No | — |
| `root` | `NonNullable<Slot<'button'>>` | — | Yes | — |
| `value` | `Value` | — | Yes | — |

### Prop Guidance

- **root**: The root slot for the tag and the element that receives the button behaviour. It is required and non-nullable, so the tag always renders a real button. Pass through standard button props such as aria-label for icon-only tags, className for layout tweaks in a container, onClick handlers, and refs; if you need different semantics, subclass the slot rather than swapping the element. `InteractionTagPrimary with aria-label when the tag contains only an Avatar or icon`
- **value**: A required identifier for an individual tag. Inside a TagGroup it is how the group's onDismiss callback reports which tag was removed, so it should be unique and stable across renders. Use the same value for the React key and for the tag's value to keep reconciliation and dismissal logic aligned. `value set to the tag's underlying entity id`
- **hasSecondaryAction**: Declared on InteractionTagPrimary to signal that a sibling InteractionTagSecondary exists. Set it to true exactly when you render the trailing action, so the primary reserves the correct space and the two hit targets meet cleanly; omit it for single-target tags. `hasSecondaryAction on the primary paired with an aria-labelled secondary dismiss`
- **appearance**: Controls the tag's visual weight. Use the default filled look for neutral metadata, outline for lighter, lower-emphasis tags on busy surfaces, and brand when the tag represents something the product wants to highlight. The Appearance stories exercise all three across enabled, disabled, and selected states, so keep the choice consistent within a row. `appearance="brand" for a highlighted tag`
- **size**: Sets the tag's density and accepts medium (default), small, and extra-small. Prefer setting size on TagGroup so every tag in the collection matches, as the Sizes story does, and drop to small or extra-small only when vertical space is genuinely constrained. `size="extra-small" on a TagGroup used in a dense table`
- **shape**: Chooses between the default rounded pill and shape="circular", which is intended for tags whose leading content is an Avatar or an icon. Use circular sparingly, because long text in a circular tag becomes cramped and the leading content no longer aligns consistently with neighbouring tags. `shape="circular" with an Avatar as the media slot`
- **selected**: Applies selected styling to a tag. Treat it as a purely visual concern today: the documented behaviour is that it changes appearance only and does not yet integrate with TagGroup, so your application must own the selection state and expose it accessibly. `selected on the tags that are currently active filters`
- **disabled**: Marks a tag as unavailable, removing it from interaction and applying the disabled colour treatment. Prefer disabling the TagGroup so the entire collection is disabled at once, and only disable individual tags when a subset is genuinely unavailable. `disabled on all three appearance variants shown in the Disabled story`
- **dismissible and dismissIcon**: On the simple Tag, dismissible adds the trailing remove affordance and dismissIcon accepts the icon slot; always supply an accessible name through dismissIcon such as an aria-label of "remove". For composed tags, the equivalent behaviour comes from rendering InteractionTagSecondary instead. `dismissible with dismissIcon carrying aria-label "remove"`
- **icon, media, and secondaryText**: On InteractionTagPrimary (and on Tag) these slots add a leading icon, a richer leading visual such as an Avatar, and a supporting line of text after the primary label. Keep one leading visual per tag and remember that the secondary text becomes part of the tag's accessible name, so it should be meaningful rather than decorative. `media with an Avatar and badge on the primary region`
- **onDismiss (TagGroup)**: The collection-level dismiss handler. Attach it to TagGroup rather than each tag so a single callback receives the dismissed tag's value, which the Dismiss stories use to filter the visible tags; remember to move focus when the final tag is removed. `onDismiss filtering the visible tag array by the reported value`

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement, InteractionTagProps } from '@fluentui/react-components';
import { InteractionTag, InteractionTagPrimary } from '@fluentui/react-components';

export const Default = (props: Partial<InteractionTagProps>): JSXElement => (
  <InteractionTag {...props}>
    <InteractionTagPrimary>Primary text</InteractionTagPrimary>
  </InteractionTag>
);
```

### Default

```tsx
import * as React from 'react';
import type { JSXElement, TagProps } from '@fluentui/react-components';
import { Tag } from '@fluentui/react-components';

export const Default = (props: Partial<TagProps>): JSXElement => <Tag {...props}>Primary text</Tag>;
```

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

## Best Practices

### Do's

- Use Tag for read-only metadata and InteractionTag only when the tag is genuinely interactive, so that mouse and keyboard users are not misled by a focusable element that does nothing.
- Provide a unique value on every tag inside a TagGroup so the group's onDismiss handler can tell you exactly which tag was removed.
- Always give InteractionTagSecondary an accessible name such as aria-label="remove" (or wrap it in a Tooltip with relationship="label", as in the Has Primary Action example) because it renders as an icon-only control.
- Set hasSecondaryAction on InteractionTagPrimary whenever you render a sibling InteractionTagSecondary, so the primary reserves room for the trailing action and the two regions lay out correctly.
- Give TagGroup an aria-label (the stories use labels such as "Dismiss example", "Overflow example", and size-specific labels) so assistive technology users can tell one tag collection from another.
- Choose the size once at the TagGroup level (size accepts medium, small, and extra-small) instead of mixing sizes across the tags in a single row, and reserve the small and extra-small sizes for dense surfaces such as table cells and filter bars.
- Manage focus deliberately after a dismiss: the Dismiss example moves focus back to a reset button when the last tag disappears so that keyboard users are never stranded on removed content.
- Use shape="circular" only for visual variety where the tag is icon- or avatar-led; rounded is the default and reads better for text-heavy labels.

### Don'ts

- Do not put multiple interactive targets in a tag without declaring hasSecondaryAction on the primary — the secondary action will be misaligned and the affordance will be ambiguous.
- Do not rely on the selected prop to communicate state to assistive technology; the documented behaviour is that it only changes appearance at the moment, so selection semantics and the integration with TagGroup must be owned by your application for now.
- Do not render an icon-only tag without an accessible name on the root button; icon-only tags are unreadable to screen readers unless you supply aria-label or aria-labelledby.
- Do not disable individual tags inside a group when the whole collection is meant to be unavailable — disable the TagGroup instead ("A TagGroup can be disabled. The collection of Tag/InteractionTag will also be disabled").
- Do not use both Tag and InteractionTag decorations interchangeably for the same purpose in one surface; the shape, padding, and focus behaviour differ, and the inconsistency confuses users.
- Do not nest a full Popover surface with large amounts of prose and lists inside a tiny tag without setting trapFocus and managing dismissal — the Has Primary Action example keeps the surface small and focused for a reason.
- Do not forget to give OverflowItem children a stable id when combining TagGroup with Overflow; without it the overflow calculation cannot track the measured items.
- Do not dismiss tags by mutating the array in place or filtering without a stable key; use key on each tag and filter by the removed value so React reconciles the remaining tags and focus correctly.

## Anti-Patterns

### Using a focusable InteractionTag for purely static metadata

❌ An InteractionTag renders on a button root, so it enters the tab order and announces itself as an interactive control. If it has no primary action, keyboard users tab to a control that does nothing, adding noise to the page's focus order.

✅ Render a plain Tag for read-only labels and reserve InteractionTag for tags that genuinely respond to Enter or Space, such as opening a Popover or toggling a filter.

### Unlabelled dismiss action

❌ InteractionTagSecondary renders an icon-only control. Without a label it is announced as an unnamed button, and screen reader users cannot tell what it will do or which tag it belongs to.

✅ Give every secondary action a specific accessible name, either through aria-label="remove" as the Appearance and Selected stories do, or by wrapping it in a Tooltip with relationship="label" as the Has Primary Action story does.

### Assuming selected provides selection semantics

❌ The selected prop only changes the tag's appearance at the moment and is not yet integrated with TagGroup. Treating it as a checkbox or option makes the visual state and the announced state diverge.

✅ Own the selection state in your application, keep it in React state alongside the tag values, and expose it to assistive technology with the appropriate ARIA attribute on the focusable element while using selected purely for styling.

### Leaving focus nowhere after dismissing tags

❌ When tags are removed from a TagGroup, the element that held focus disappears. If the last tag is removed, focus can be lost to the document body, and keyboard users lose their place entirely.

✅ Track dismissal and move focus deliberately, as the Dismiss stories do by focusing a reset button once the collection is empty; if the collection is not empty, focus a neighbouring tag instead.

### Missing hasSecondaryAction when a secondary action is rendered

❌ The primary region will not reserve space for the trailing action, producing cramped or misaligned hit targets and an unreliable click area in a tag that visibly has two affordances.

✅ Set hasSecondaryAction on InteractionTagPrimary whenever a sibling InteractionTagSecondary is rendered, and remove it when the tag should have a single, full-width target.

### Stranding individual tags in a disabled collection

❌ Disabling a couple of tags inside an otherwise active TagGroup creates a mixed state that is hard to scan and gives the impression the whole group is broken.

✅ Disable at the TagGroup level when the collection as a whole is unavailable, and reserve per-tag disabled for cases where a specific value is legitimately not applicable.

## Accessibility

**Requirements**: Tags render on a button root, so every interactive tag must meet button-level requirements: a discernible accessible name (visible text, or aria-label/aria-labelledby for icon-only or avatar-only tags), a visible focus indicator, and a disabled state that is both visually and programmatically communicated. TagGroup is a grouping container and should carry an aria-label so that sighted and screen reader users can distinguish multiple tag collections on the same page. Because the selected prop currently changes appearance only, applications that implement multi-select must expose the selection state themselves (for example via aria-pressed or aria-selected on the appropriate element) and keep the visual and programmatic state in sync. Dismissible tag collections must satisfy focus-management expectations: when a tag is removed, focus should move to a predictable neighbouring element, and when the final tag is removed, focus must be relocated to a logical target such as a reset or add control. Disabled tags and disabled TagGroups must not be reachable by keyboard or pointer and should meet the disabled-content contrast exemption while remaining legible.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the next focusable element; a dismissible or interactive tag participates in the normal tab order alongside its secondary action. |
| `Shift+Tab` | Moves focus to the previously focusable element, typically from a tag back to the preceding tag or secondary action. |
| `Enter` | Activates the focused tag's primary action (for example, opening the Popover bound to InteractionTagPrimary) or activates the focused secondary action such as dismiss. |
| `Space` | Activates the focused tag button, matching standard button semantics for the root button of a Tag, InteractionTagPrimary, or InteractionTagSecondary. |
| `Escape` | Dismisses a popup or popover that was opened from a tag's primary action when focus trap behaviour is enabled, returning focus to the tag. |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-disabled, aria-pressed, aria-selected, role

**Screen Reader**: A tag is announced as a button with its visible text content, or with the name supplied through aria-label or aria-labelledby when the tag is icon-only. Inside a collection, the TagGroup's aria-label is announced so users know which group of tags the next element belongs to. The secondary action of an InteractionTag is announced as a separate button using its own label (the stories use aria-label="remove" or a Tooltip with relationship="label"), which gives screen reader users an independent, clearly named control for removal rather than an unlabelled icon. Disabled tags are announced as unavailable and are skipped during tab navigation, and text supplied through secondaryText is read as part of the tag's accessible name. Because selection is currently presentation-only, screen readers will not announce a selected state unless the application adds the corresponding ARIA attribute itself.

## Styling

Tags are styled through Griffel, so use makeStyles or makeResetStyles and the tokens.* namespace rather than raw colours. The filled appearance maps to a neutral surface such as tokens.colorNeutralBackground3 with tokens.colorNeutralForeground1 text, outline swaps to tokens.colorNeutralBackground1 with tokens.colorNeutralStroke1 and tokens.colorNeutralStrokeDisabled for disabled tags, and brand uses tokens.colorBrandBackground or tokens.colorBrandBackground2 together with tokens.colorBrandForeground1 or tokens.colorNeutralForegroundOnBrand for text. Selected styling leans on the compound brand tokens (tokens.colorCompoundBrandBackground, tokens.colorCompoundBrandForeground1) or the brand stroke tokens to make the chosen state stand out from both filled and outline tags. Shape and density are driven by tokens.borderRadiusCircular for shape="circular" versus the medium rounding used by the default rounded shape, and by tokens.spacingHorizontalXXS, tokens.spacingHorizontalXS, tokens.spacingHorizontalSNudge, and tokens.spacingHorizontalS for padding and the gaps between icon, media, primary text, secondary text, and the dismiss action. Typography should come from tokens.fontSizeBase200 or tokens.fontSizeBase300 with tokens.lineHeightBase200 so the tag scales with the theme, and disabled tags should use tokens.colorNeutralForegroundDisabled. When customising a TagGroup, style the wrapper with tokens.spacingHorizontalSNudge or tokens.spacingHorizontalS as a gap and allow wrapping; when combining with Overflow, give the group a class that permits items to be clipped without altering the tag's internal padding.

## Performance

Tags are light, but they are usually rendered in collections, so the cost is in the count and in the stability of the slots. Avoid creating fresh inline element objects for the icon, media, and dismissIcon slots on every render, because each new element forces reconciliation of that subtree; hoist them or memoize them when the tag is rendered in a list. Provide a stable value and matching React key on every tag so the group filters and reconciles in place rather than remounting rows after a dismissal. Memoize the TagGroup onDismiss callback and any per-tag handlers so that removing one tag does not re-render the entire collection unnecessarily. When combining TagGroup with Overflow, keep in mind that Overflow measures each item, so tags whose width changes after mount (long text that loads late, avatars that resolve later) can trigger repeated overflow recalculation — give each OverflowItem a stable id and avoid animating the tag's own width. For very large suites of tags, prefer limiting what is rendered (via overflow or pagination) over rendering hundreds of focusable buttons.

## Theming & Tokens

Tags derive all of their colour, rounding, spacing, and typography from theme tokens, so switching between light, dark, and high-contrast themes is automatic. Filled tags resolve to tokens.colorNeutralBackground3 or tokens.colorNeutralBackground1 surfaces with tokens.colorNeutralForeground1 text; outline tags use tokens.colorNeutralStroke1 for the border on tokens.colorNeutralBackground1; brand tags use tokens.colorBrandBackground or tokens.colorBrandBackground2 with tokens.colorBrandForeground1 or tokens.colorNeutralForegroundOnBrand. Selected styling builds on the compound brand tokens such as tokens.colorCompoundBrandBackground and tokens.colorCompoundBrandForeground1 or the brand stroke tokens, and hover and pressed states are driven by tokens.colorNeutralBackground3Hover, tokens.colorNeutralBackground3Pressed, tokens.colorBrandBackgroundHover, and their compound equivalents. Disabled tags resolve to tokens.colorNeutralForegroundDisabled, tokens.colorNeutralBackgroundDisabled, and tokens.colorNeutralStrokeDisabled. Shape and density come from tokens.borderRadiusCircular and the medium radius scale, while internal padding and gaps use tokens.spacingHorizontalXXS, tokens.spacingHorizontalXS, tokens.spacingHorizontalSNudge, and tokens.spacingHorizontalS, and text sizing uses tokens.fontSizeBase200, tokens.fontSizeBase300, and tokens.lineHeightBase200. A custom theme can therefore restyle the whole family by redefining the neutral, brand, and compound brand colour ramps.

## Migration Notes

The Tags family is a v9-native set of primitives and is shaped differently from earlier tagging APIs: instead of a single tag component with an embedded remove affordance, v9 splits responsibilities across Tag, InteractionTag, InteractionTagPrimary, InteractionTagSecondary, and TagGroup. Rendering a removable tag therefore means composing an InteractionTag that contains a primary region with hasSecondaryAction and a sibling secondary action carrying its own aria-label, and collection behaviour (dismiss, disabled, default size, overflow) is delegated to TagGroup rather than to each tag. Consumers migrating should map their existing dismiss callbacks to TagGroup's onDismiss, which reports the value of the removed tag, and should move per-item sizing into the group's size prop where possible. Note also that selected is currently an appearance-only concern in v9 and does not yet integrate with TagGroup, so any existing selection logic must be reimplemented on top of the new composition.

## Edge Cases

- The selected prop currently changes appearance only and does not yet integrate with TagGroup, so a multi-select tag group must track and expose its own selection state until that integration lands.
- When the last tag in a TagGroup is dismissed, there is no remaining element to receive focus; the documented guidance is to ensure focus is properly managed, for example by moving it to a reset or add control.
- Combining TagGroup with Overflow requires each child to be wrapped in an OverflowItem with a stable id, otherwise the overflow calculation cannot track the measured tags.
- A tag whose only visible content is an icon or an Avatar has no accessible name; the root button needs aria-label or aria-labelledby in that case.
- Disabling a TagGroup disables the entire collection of Tag and InteractionTag children, so per-tag disabled flags inside an already-disabled group are redundant.
- Rendering InteractionTagSecondary without hasSecondaryAction on the primary produces an incorrect layout with competing hit targets.
- Because the tag root is a button, interactive descendants such as links or buttons inside the tag's content can create invalid or confusing focus behaviour — keep interactive elements in the secondary action or the popover surface instead.
- Using secondaryText makes that text part of the tag's accessible name, so decorative or duplicated secondary text will be read aloud verbatim to screen reader users.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
