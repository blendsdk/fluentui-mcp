# InteractionTagPrimary

> **Package**: `@fluentui/react-tags` v9.9.1
> **Import**: `import { InteractionTagPrimary } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

InteractionTagPrimary is the interactive, main segment of an InteractionTag in Fluent UI React v9. It renders a single native button root whose purpose is to expose one primary action for a tag — typically selecting, opening, or navigating to the entity the tag represents. The visible label is composed from five slots: an optional media slot (commonly an Avatar), an optional icon slot, a required primaryText slot, and an optional secondaryText slot for complementary information, all laid out inside the required root. Because the root is a button and children passed to the component are automatically rendered into the primaryText slot, the common usage is to place the label text directly between the opening and closing tags while supplying media, icon, and secondaryText as props. When the surrounding InteractionTag also renders an InteractionTagSecondary for a second, secondary action (such as a dismiss or remove button), the hasSecondaryAction flag tells InteractionTagPrimary to adjust its internal styling so the two segments sit together without visual overlap or doubled corner radii. InteractionTagPrimary is a presentational and interaction shell only: it holds no selection state, no open state, and no data fetching logic, which makes it composable inside tag groups, filter bars, list rows, and pickers.

**When to use**: Use InteractionTagPrimary whenever a tag needs to be clickable as a whole and performs exactly one action — filtering a list, opening the tagged entity, or navigating to a detail view. Reach for it when the tag carries structured content, such as an avatar plus a name, or a name plus a secondary line of context, because its media, icon, primaryText, and secondaryText slots keep that content aligned and themed. Choose it over Tag when the tag must be interactive; Tag is meant for static, non-interactive categorization labels where no action is implied. Choose it over a plain Button when the affordance should read visually as a tag inside a set of other tags, since the tag surface, compact padding, and rounded shape communicate membership in a collection. Pair it with InteractionTagSecondary only when a genuinely distinct second action exists — otherwise the simpler single-button interaction is clearer. Avoid it for free-form data entry or for picking multiple values from a long list, where TagPicker or a Select-style control gives better affordances.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `hasSecondaryAction` | `boolean \| undefined` | `false` | No | Whether the `InteractionTag` component has a `Secondary` component that provides an secondary action. If `true`, the `InteractionTagPrimary` component will adjust its styles to accommodate the `Secondary` component. |

### Prop Guidance

- **hasSecondaryAction**: Boolean that tells InteractionTagPrimary that a sibling InteractionTagSecondary is present, so the root reserves space and flattens the joining corner instead of rendering a full pill. Set it once and keep it in sync with whether the secondary segment is actually rendered; it defaults to false, which is correct for a standalone, single-action tag. `true`
- **root**: The required slot that renders the actual button element. Override it only to change the underlying element or to attach class names, refs, or data attributes; keep it a focusable, keyboard-operable element so Enter and Space continue to work. `default button element`
- **primaryText**: The required slot holding the tag's main label. In most usage you leave it implicit by passing the label as children, which the component renders into this slot automatically. The text here becomes the accessible name, so keep it short, front-loaded, and meaningful. `Design`
- **secondaryText**: Optional slot for a complementary second line such as a count, owner, or category. It renders beneath the primary text, so adding it increases the tag's height; use it only when the extra context genuinely helps the user distinguish this tag from its neighbors. `3 items`
- **media**: Optional slot for a leading visual, most often an Avatar for a person or team. Keep the media small and circular so it sits cleanly inside the tag's rounded surface, and prefer it over the icon slot when identity matters more than state. `Avatar with initials`
- **icon**: Optional slot for a single leading glyph that reinforces the tag's meaning, such as a checkmark for a completed filter or a lock for a restricted item. Typically use icon or media, not both, to avoid crowding the prefix area. `checkmark icon`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `icon` | — | No | Slot for an icon |
| `media` | — | No | Slot for a visual element, usually an avatar |
| `primaryText` | — | Yes | Main text for the InteractionTagPrimary button. Children of the root slot are automatically rendered here |
| `root` | — | Yes | — |
| `secondaryText` | — | No | Secondary text that describes or complements the main text |

## Best Practices

### Do's

- Put the entity name or label in the primaryText slot, either as children or via the primaryText prop, so the button has a stable accessible name.
- Set hasSecondaryAction to true only when the parent InteractionTag actually renders an InteractionTagSecondary next to it, so the root styles reserve the correct space.
- Use the media slot for an Avatar or other identity visual when the tag represents a person or a team, keeping the visual small enough that the tag stays compact.
- Use the icon slot for a single meaningful glyph — a checkmark, a lock, or a status indicator — that reinforces the tag's meaning rather than decorating it.
- Keep secondaryText short and complementary, such as a count or a category, because it renders as a second line under the primary text and increases the tag height.
- Provide an aria-label on the root when the tag is icon-only or media-only, since the visible text alone will not supply an accessible name in that case.
- Place InteractionTagPrimary inside an InteractionTag so it inherits the correct sizing, spacing, and surface styling context for the tag family.

### Don'ts

- Don't set hasSecondaryAction without rendering an InteractionTagSecondary — the root will pad itself for a neighbor that is not there and the tag will look lopsided.
- Don't nest another button, link, or interactive control inside the media or icon slots; a button inside a button is invalid markup and breaks both keyboard and screen reader interaction.
- Don't leave primaryText empty and put all of the meaning in secondaryText, because primaryText is the required slot that carries the primary accessible name.
- Don't overload the tag with long sentences or multi-paragraph content; a tag is a compact, scannable token, not a rich text container.
- Don't use InteractionTagPrimary as a substitute for a standard Button in forms, toolbars, or dialog actions, where a button already communicates the right affordance.
- Don't re-implement the root's visual shell with custom borders, backgrounds, or corner radii, since that will diverge from every other tag in the same group.

## Anti-Patterns

### Secondary action flag without a secondary segment

❌ Setting hasSecondaryAction to true while rendering no InteractionTagSecondary leaves a padded, flattened edge where the neighbor should be, so the tag looks misaligned next to its siblings and wastes horizontal space.

✅ Drive hasSecondaryAction from the same condition that decides whether InteractionTagSecondary is rendered, so the two are always in agreement, and leave it at its default false for single-action tags.

### Nested interactive controls inside the tag

❌ Placing a button, link, or other focusable element inside the media or icon slots produces a button within a button, which is invalid HTML, confuses screen reader output, and creates unreachable or double-activating focus targets.

✅ Move any additional action out of the tag's internals and render it as a separate InteractionTagSecondary sibling, then set hasSecondaryAction so the two segments are styled as one unit.

### Empty primary text with meaning only in the secondary line

❌ Because primaryText is the required slot and supplies the accessible name, leaving it empty and putting the label in secondaryText yields a button that announces nothing or announces only secondary trivia.

✅ Always populate primaryText with the tag's identifying label, and reserve secondaryText for supporting detail such as a count or category.

### Overriding the tag's visual shell

❌ Hand-applying borders, background colors, or corner radii to the root breaks alignment with the other tags in the group, ignores state changes such as hover and press, and can drop text contrast below accessible levels.

✅ Customize through the provided styling hooks using theme tokens so rest, hover, pressed, and focus states all stay consistent and theme-aware.

### Using the tag as a general-purpose button

❌ Repurposing InteractionTagPrimary for form submissions, dialog actions, or toolbar commands gives users a compact chip-shaped affordance where a conventional button is expected, hurting discoverability and scannability.

✅ Use a standard Button or CompoundButton for standalone commands, and reserve InteractionTagPrimary for tags that belong to a set of related, categorizable items.

## Accessibility

**Requirements**: InteractionTagPrimary renders a native button as its root, so it must satisfy the standard button requirements: an accessible name, an exposed role and state, full keyboard operability, and a visible focus indicator. The visible text in primaryText normally supplies the accessible name; when the tag is icon-only or media-only, an explicit aria-label is required. Focus indication must meet the WCAG 2.2 focus appearance guidance for area and contrast, and text must meet a 4.5:1 contrast ratio against the tag surface in every state (rest, hover, pressed, and focus). If the tag is used as a filter or toggle, that state must be conveyed programmatically and not by color alone, and the target must be at least 24 by 24 CSS pixels under WCAG 2.2 SC 2.5.8 Target Size (Minimum). Any secondary action rendered by InteractionTagSecondary must be a separate, independently focusable control with its own accessible name so the two actions are never conflated.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the InteractionTagPrimary root button, and on to the InteractionTagSecondary button when hasSecondaryAction is true. |
| `Shift+Tab` | Moves focus backwards out of the tag, or from the secondary segment back to the primary segment. |
| `Enter` | Activates the primary action of the tag immediately on key down. |
| `Space` | Activates the primary action of the tag; the surface shows a pressed state while the key is held and activation occurs on key up. |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-pressed, aria-current

**Screen Reader**: Because the root is a native button, assistive technology announces it as a button with its accessible name derived from the primaryText content, then secondaryText if referenced, or from an explicit aria-label. The tag is reachable with the Tab key like any other button and is activated with Enter or Space. When hasSecondaryAction is true, the user encounters two separate announcements — the primary action and the secondary action — so each must be named distinctly; a generic label such as "remove" on the secondary segment is ambiguous without context from the tag's own name. Media and icon slot content is decorative and should stay muted to avoid adding noise to the announcement, and any toggled or selected state must be exposed through an ARIA state rather than through styling alone.

## Styling

Style InteractionTagPrimary through the slot class names exposed by the component rather than by wrapping it in extra elements, and prefer Griffel tokens over raw values so the tag tracks the theme. The root surface pairs tokens.colorNeutralBackground1 with tokens.colorNeutralStroke1 and the accessible border token tokens.colorNeutralStrokeAccessible for the base state, then tokens.colorNeutralBackground1Hover and tokens.colorNeutralStroke1Hover for hover, and tokens.colorNeutralBackground1Pressed with tokens.colorNeutralStroke1Pressed for press. Text uses tokens.colorNeutralForeground1 for primaryText and tokens.colorNeutralForeground2 for secondaryText, with tokens.colorNeutralForeground2Hover and tokens.colorNeutralForeground2Pressed covering the interactive states. Sizing and rhythm come from tokens.borderRadiusMedium on the tag surface and tokens.borderRadiusCircular for pill-shaped media such as an Avatar, with internal padding built from tokens.spacingHorizontalXS, tokens.spacingHorizontalS, tokens.spacingVerticalXS, and small gaps between the media, icon, and text areas. Typography for primaryText sits around tokens.fontSizeBase300 with tokens.fontWeightRegular, while secondaryText steps down to tokens.fontSizeBase200 and tokens.lineHeightBase200 to keep the two lines legible without inflating the tag height. Focus styling should use tokens.colorStrokeFocus2 as the outline color with tokens.strokeWidthThick, and transitions between states should stay subtle using tokens.durationFaster and tokens.curveEasyEase. When hasSecondaryAction is true, avoid overriding the corner radii yourself — the component already squares off the joining edge so the primary and secondary segments read as one continuous pill.

## Performance

InteractionTagPrimary is a very light component — a single button root with a fixed set of optional slots — so its own render cost is negligible. The costs that accumulate in practice come from the slot content: an Avatar in the media slot brings image loading and layout work, and large icons or images are the usual reason a tag list feels slow. When rendering many tags in a group or list, keep the slot values stable references rather than recreating them inline on every render, and avoid toggling hasSecondaryAction dynamically on each render pass, since changing it recomputes the root's padding and corner radius styles. Avoid inline style objects for per-instance customization in long lists; use Griffel classes or style overrides so styles are hoisted and deduplicated. Because the root is a plain button, it participates normally in event delegation and needs no special memoization, but virtualizing long collections of tags will deliver far larger gains than optimizing the tag itself.

## Theming & Tokens

InteractionTagPrimary reads entirely from the Fluent theme context established by FluentProvider, so it adapts automatically to light, dark, and high-contrast brand themes. Its neutral surface comes from tokens.colorNeutralBackground1 with tokens.colorNeutralStroke1 and tokens.colorNeutralStrokeAccessible for the base border, and interactive states shift to tokens.colorNeutralBackground1Hover with tokens.colorNeutralStroke1Hover on hover and tokens.colorNeutralBackground1Pressed with tokens.colorNeutralStroke1Pressed on press. Text colors are driven by tokens.colorNeutralForeground1 for the primary line and tokens.colorNeutralForeground2 for the secondary line, with hover and pressed variants from tokens.colorNeutralForeground2Hover and tokens.colorNeutralForeground2Pressed, plus brand-leaning interactive text colors such as tokens.colorNeutralForeground2BrandHover where a branded emphasis is appropriate. Shape and focus treatment use tokens.borderRadiusMedium and tokens.colorStrokeFocus2, and disabled or unavailable presentations map to tokens.colorNeutralBackgroundDisabled and tokens.colorNeutralForegroundDisabled. Spacing, line height, and typography are all tokenized — tokens.spacingHorizontalS, tokens.spacingVerticalXS, tokens.fontSizeBase300, tokens.fontSizeBase200 — so density and type scale follow the active theme without per-component overrides.

## Migration Notes

Fluent UI React v9 models tags as composable slots rather than a single monolithic component. Coming from older tag-like markup, the most important change is that the label is now a slot: children passed to InteractionTagPrimary are rendered automatically into primaryText, so wrapping the label in extra elements is no longer necessary and can interfere with styling. A second change is that a trailing action is now a separate sibling component, InteractionTagSecondary, coordinated through the hasSecondaryAction boolean instead of being embedded inside the tag's own markup. If you previously hand-built a tag from a button with custom padding, borders, and a nested close button, migrate by placing the label in primaryText, moving identity visuals into the media slot and glyphs into the icon slot, moving the nested close button out into InteractionTagSecondary, and setting hasSecondaryAction to true so the two segments align correctly.

## Edge Cases

- primaryText is a required slot: rendering InteractionTagPrimary with no children and no primaryText produces an unnamed button. Supply the label, or add an aria-label when the tag is purely visual.
- hasSecondaryAction must match reality. If it is true but no InteractionTagSecondary is rendered, the root keeps secondary-action spacing and a squared joining edge, which looks broken in a tag group.
- Supplying both media and icon fills the prefix area with two visuals and crowds the text, especially at smaller sizes; pick one based on whether identity or meaning is being conveyed.
- Long primaryText in a fixed-width layout can wrap and increase the tag's height, misaligning it with its neighbors in the same row; keep labels short or constrain the text area deliberately.
- secondaryText renders as an additional line, which makes the tag taller than its single-line siblings; in tightly aligned rows this can visibly break the baseline rhythm.
- The tag is a plain button with no built-in selected or disabled state in its own API, so any toggled behavior must be expressed by the surrounding composition and exposed through appropriate ARIA state rather than assumed from the component.
- Icon-only or media-only tags carry no accessible name from the slots themselves, so an explicit aria-label on the root is mandatory for those usages.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
