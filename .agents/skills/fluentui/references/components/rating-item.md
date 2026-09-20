# RatingItem

> **Package**: `@fluentui/react-rating` v9.4.2
> **Import**: `import { RatingItem } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

RatingItem is the individual, interactive entry inside a rating scale. Each RatingItem represents one positive whole number step of the scale and renders a span root containing a selected icon and an unselected icon plus the radio inputs that make the step selectable. The component owns no rating state of its own: the value prop simply declares which step this item represents, while the parent Rating component (and its underlying radio group) tracks the currently chosen value and passes it down so each item can decide whether to paint its selectedIcon or its unselectedIcon. Two radio inputs are part of every item's markup: fullValueInput represents the integer step, and halfValueInput represents the half-step below it, which is how half-star (or half-precision) ratings are expressed without ever passing a fractional value. Because the interactive semantics live in the native radio inputs, RatingItem participates in the same roving-focus, arrow-key navigation, and checked-state announcements as any radio group, and it becomes a fully accessible control only when it is rendered alongside sibling items inside a named group.

**When to use**: Use RatingItem when you need to compose a custom rating scale from individually styled steps — for example a star or heart rating with custom selected and unselected glyphs, a non-standard maximum, or additional custom slots on each step. It is the correct building block whenever the rating is editable and must be operable by keyboard and assistive technology, because it carries the actual radio inputs. Reach for Rating instead when you just want a standard editable rating with default stars; use RatingDisplay when the rating is decorative or read-only (an average score, a review summary), since that avoids exposing a row of focusable radios that do nothing. Use RadioGroup directly when the question is not a rating scale at all (a survey question with named options, a yes/no choice).

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `number \| undefined` | — | No | The positive whole number value that is displayed by this RatingItem |

### Prop Guidance

- **value**: The positive whole number this item represents on the scale. It is an identity for the step, not the current rating, so it should be constant for the lifetime of the item and unique within the scale. It must be a positive integer: use 1, 2, 3 and so on in ascending order matching the parent scale's maximum. Half steps are not expressed here — they are expressed by the halfValueInput radio, so a fractional, zero, negative, or undefined value produces an item that cannot be reached or announced correctly. `3`
- **selectedIcon**: Slot for the icon shown when the current rating is greater than or equal to this item's value. Supply a filled glyph so the selected state is distinguishable by shape as well as by color, and keep it the same optical size as the unselected icon so the row does not shift when the value changes. `A filled star icon`
- **unselectedIcon**: Slot for the icon shown when the current rating is less than this item's value. Use the outline counterpart of the selected icon and color it with a neutral foreground token so the two states read as a clear progression. `An outline star icon`
- **halfValueInput**: Slot for the radio input that represents the half step belonging to this item (for example 2.5 when the item's value is 3). It is what makes half-precision ratings operable. Keep the element in the DOM and merely visually hidden so it stays focusable and announced; removing it silently disables half-step selection. `The radio input for the x.5 step`
- **fullValueInput**: Slot for the radio input that represents the whole step belonging to this item. It is the primary selection target and carries the checked state for the integer value shown by the icons; do not replace it with a button or a click handler on the root. `The radio input for the whole-number step`
- **root**: The root slot renders a span by default and holds the icons plus the two inputs. Use it for layout and sizing only; do not attach interactive handlers or a tabIndex here, because focus and activation are owned by the radio inputs. `span`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `fullValueInput` | — | Yes | Radio input slot used for full star precision |
| `halfValueInput` | — | Yes | Radio input slot used for half star precision |
| `root` | — | Yes | The root slot of the RatingItem. Default html element is span |
| `selectedIcon` | — | Yes | Icon displayed when the rating value is greater than or equal to the item's value. |
| `unselectedIcon` | — | Yes | Icon displayed when the rating value is less than the item's value. |

## Best Practices

### Do's

- Render RatingItem only as a child of a Rating (or directly inside a RadioGroup with a shared group name) so the half-value and full-value radio inputs belong to one named group and arrow-key navigation works across steps.
- Give every item a unique positive whole number for value, in ascending order, starting at 1 and matching the parent scale's maximum.
- Treat value as a fixed identity for the item — it describes the step, it is not the current rating; let the parent Rating supply the live value.
- Supply both selectedIcon and unselectedIcon, and make them distinguishable by shape (filled versus outline) as well as color so the state is not conveyed by color alone.
- Keep custom icons the same optical size and let them inherit the surrounding text color so theme tokens such as tokens.colorBrandForeground1 or tokens.colorNeutralForeground3 continue to flow through.
- Keep the radio inputs in the DOM and focusable, visually hidden with a clip-based technique so keyboard users can still reach each precision step.
- Verify with a screen reader that every reachable score (including half steps) is announced exactly once and with an understandable name.
- Test the whole scale by keyboard only: Tab into the group, Arrow keys to move and change the score, and Shift+Tab to leave.

### Don'ts

- Do not render RatingItem on its own as a decorative graphic; with no surrounding group, its radio inputs have no shared name and no value management.
- Do not pass fractional, zero, negative, or non-integer values to value — half steps are expressed through halfValueInput, not through a fractional value.
- Do not duplicate the same value across two items in one scale; duplicate radio choices break roving focus order and confuse assistive technology.
- Do not leave halfValueInput or fullValueInput unstyled but hidden with display none or visibility hidden, which removes the item from the keyboard and accessibility tree entirely.
- Do not remove or replace the selectedIcon and unselectedIcon slots with plain text or arbitrary markup that cannot express selected versus unselected state.
- Do not build a read-only average score out of RatingItem items; use RatingDisplay so users are not offered radios that cannot change anything.
- Do not add your own tabIndex or click handlers to the root span — focus and activation belong to the radio inputs.
- Do not rely on hover color alone to indicate the score a user is about to commit; make the pre-selection state visible for keyboard users too.

## Anti-Patterns

### Standalone rating item

❌ Rendering RatingItem by itself, outside a rating group, leaves its radio inputs without a shared group name, without a label, and without any value management, so the control is announced as an isolated radio and nothing changes when it is selected.

✅ Always compose items inside a Rating (or a properly named radio group) and let the parent own the current value, the maximum, and the accessible label for the scale.

### Fractional value for half stars

❌ Passing something like 3.5 to value contradicts the contract that value is a positive whole number, breaks the ascending order that arrow-key navigation relies on, and duplicates the half-step concept that halfValueInput already provides.

✅ Keep value as a positive integer and let the halfValueInput radio represent the half step; ensure the parent scale maps each half and whole step exactly once.

### Inputs hidden with display none

❌ Removing the half and full radio inputs from the layout with display none or visibility hidden also removes them from the tab order and the accessibility tree, so keyboard and screen reader users cannot select any score even though the icons look clickable.

✅ Use a visually-hidden, clipping-based technique that keeps the inputs focusable, and move the visible focus ring onto the icon so sighted keyboard users can see where they are.

### Color-only state

❌ Relying purely on a color change between selectedIcon and unselectedIcon fails users with low vision or color vision deficiency, and fails WCAG 1.4.1 because the state is communicated by color alone.

✅ Pair the color difference with a shape difference (filled versus outline glyph), and optionally add a textual or tooltip cue for the current score.

### Duplicate or out-of-order steps

❌ Two items sharing a value, or values declared out of ascending order, create duplicate radio choices and an arrow-key order that jumps around the row, which is disorienting and can make some scores unreachable.

✅ Derive values from a single ascending source (for example 1 through the scale maximum) and assert uniqueness when you render the items.

## Accessibility

**Requirements**: The item is only accessible in context: it must be rendered inside a group (the parent Rating's radio group) that supplies a shared group name and an accessible label describing what is being rated. Each native radio input must have a programmatic name — typically applied to the radios by the parent rating so that a step is announced as a value out of the total scale. Ensure the selected versus unselected distinction does not rely on color alone (WCAG 1.4.1 Use of Color): pair color with a filled/outline shape difference and, where needed, with an accessible text alternative. Maintain at least a 24x24 CSS pixel target for each step (WCAG 2.5.8) by padding the area the radio input's label covers rather than shrinking the icons. Focus indication must remain visible on the icon even though the input itself is visually hidden.

| Key | Action |
| --- | --- |
| `ArrowRight / ArrowLeft` | Moves focus to the next or previous item in the rating group and selects it, committing that score (native radio group behavior). |
| `ArrowDown / ArrowUp` | Equivalent to the left and right arrows inside a radio group, moving between steps and selecting as focus moves. |
| `Space` | Selects the currently focused radio input, which sets the rating to that item's half or full value. |
| `Tab` | Enters the rating group at the single tab stop (roving tabindex keeps only the selected or first radio focusable) and then leaves the group on the next Tab press. |
| `Shift+Tab` | Moves focus backwards out of the rating group to the previously focusable element. |

**ARIA**: The halfValueInput and fullValueInput radios provide their own native role and checked state; do not override them with hand-written roles or aria-checked., aria-label or aria-labelledby on the radio inputs supplies the accessible name for each precision step (for example the score value) and is normally applied by the parent rating., The containing group should expose an accessible name so the scale is announced as a group (for example "Overall rating")., aria-hidden="true" belongs on purely decorative presentations such as an icon rendered alongside text inside the root slot., aria-disabled or the native disabled state should be used when the rating cannot be changed, rather than deleting the inputs from the DOM.

**Screen Reader**: A screen reader announces each interactive unit as a radio button inside a group, including its name and whether it is checked. Because an item can carry two radio inputs, a scale with half precision exposes two choices per star, so names must make the half step and the whole step unambiguous; otherwise users hear duplicated values. Arrow keys move the screen reader's virtual focus in step with the browser's radio group behavior and the newly checked radio is announced, so changing a rating gives immediate feedback without any live region. Selecting a step fires a checked-state change only; if your application must announce an aggregate result (for example "4 out of 5 submitted"), add that announcement yourself rather than expecting it from the item. When the group is disabled, the inputs are announced as unavailable rather than missing.

## Styling

Style the root slot as an inline flex container so the icons and the visually hidden inputs align predictably, and use tokens.spacingHorizontalXXS or tokens.spacingHorizontalXS for the gap between steps. The default icon colors should follow the semantic pair used across Fluent forms: an unselected step reads at tokens.colorNeutralForeground3 (with tokens.colorNeutralForeground2 or tokens.colorNeutralForeground1Hover on hover for feedback), while the selected step should use an accent such as tokens.colorCompoundBrandForeground1 or tokens.colorBrandForeground1. Disabled scales use tokens.colorNeutralForegroundDisabled. Because the icons are supplied through slots, apply the color to the icon element itself (through fill, which the Fluent icon components support) rather than to the root, so the two states can be colored independently. Never hide the radio inputs with display none or visibility hidden; use a clip-based visually-hidden style that keeps them focusable, then surface the focus ring on the icon next to the focused input with an outline built from tokens.strokeWidthThick and tokens.colorStrokeFocus2, offset so it is not clipped. To avoid a cramped target, give the label area padding so each step reaches at least a 24x24 pixel hit area rather than enlarging the glyph. If you insert text (a numeric value, a count) next to the icons, size it with tokens.fontSizeBase200 and tokens.lineHeightBase200 and keep it in the root slot so it participates in layout. Class names produced by the Griffel style hooks are stable; keep overrides in a makeStyles call at module scope instead of building new inline style objects per render.

## Performance

Each RatingItem is cheap on its own — a span root, two icon slots, and two radio inputs — but a scale multiplies that by the number of steps and, with half precision, by two radio inputs per step, so keep the maximum realistic (five or ten) and avoid generating dozens of items. Slot props are objects, so building new icon elements or new prop objects inline on every render forces needless re-renders of the item; hoist the icons or memoize them when the scale is rendered inside a frequently updating list or table row. Keep Griffel styles in module-scope style hooks rather than creating style objects during render, since runtime style creation inserts atomic classes and can grow the stylesheet. If the rating sits in a long virtualized list, render read-only RatingDisplay rows instead of interactive items until the row is activated, which removes ten focusable radios per row from the tab sequence.

## Theming & Tokens

RatingItem inherits everything from the nearest FluentProvider theme — there are no per-instance color or size properties, so customization happens through tokens and slot icons. The selected state should draw from the accent tokens, for example tokens.colorCompoundBrandForeground1 or tokens.colorBrandForeground1, while unselected steps use tokens.colorNeutralForeground3 with tokens.colorNeutralForeground2 or tokens.colorNeutralForeground1Hover for hover feedback; disabled scales use tokens.colorNeutralForegroundDisabled. Backgrounds and strokes around the item come from tokens.colorNeutralBackground1 and tokens.colorNeutralStroke1, and focus indication uses tokens.colorStrokeFocus2 with tokens.strokeWidthThick. Spacing flows from tokens.spacingHorizontalXXS and tokens.spacingHorizontalXS, and any accompanying numeric text follows tokens.fontSizeBase200 and tokens.lineHeightBase200. Because these are theme tokens rather than fixed values, the items automatically adapt to dark and high-contrast themes, and custom icons that consume currentColor or an explicit token-driven fill will repaint with the theme as well.

## Migration Notes

If you are porting a rating from an earlier Fluent implementation or a hand-rolled star row, note the shape of this API: there is no single icon prop and no fractional score. Icons come from the selectedIcon and unselectedIcon slots, the step's identity is a positive whole number in value, and half-step precision is represented by the separate halfValueInput radio rather than by a value such as 3.5. The step is also no longer a plain presentational element — the half and full radio inputs are part of its contract, so styles that hid inputs (display none) or that made the root a button must be replaced with a visually-hidden input plus an icon-focused indicator. Values are 1-based and must be supplied in ascending order for the group's keyboard order to match the visual order.

## Edge Cases

- value is optional in the type but practically required: an item with an undefined value cannot map to a radio choice, so it will neither be selectable nor announced with a meaningful name.
- Half precision doubles the number of radio choices per star. If you render both the half and full inputs for every item, users of assistive technology will hear two options per star, so the names for the half step and the whole step must be clearly distinguishable.
- Which of the two inputs is meaningful depends on the parent's precision and maximum. If half precision is enabled with an odd maximum, the outermost step may need only one of the two inputs so that every reachable score from the lowest half step up to the maximum appears exactly once.
- Custom icons must actually respect the color they inherit; an icon that hard-codes its own fill can erase the selected versus unselected distinction, which is both a visual and an accessibility defect.
- Visually hidden radio inputs still receive focus, so if you draw no focus indicator on the icon a keyboard user sees nothing as they arrow through the scale.
- A read-only or disabled rating built from these items becomes a long tab sequence of unusable controls; switching those cases to RatingDisplay removes the interaction entirely while keeping the score visible.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
