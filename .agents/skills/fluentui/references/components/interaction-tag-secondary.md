# InteractionTagSecondary

> **Package**: `@fluentui/react-tags` v9.9.1
> **Import**: `import { InteractionTagSecondary } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

InteractionTagSecondary is the secondary-action affordance of an InteractionTag. It renders as a button-rooted element that sits alongside InteractionTagPrimary inside the same parent InteractionTag, giving the tag a second, separate interactive target — most commonly a remove, clear, or dismiss affordance that behaves independently from the tag's main click action. It carries its own required value, which identifies the tag the action applies to, so the same secondary action element can be reused across grouped, dismissible, or picker-driven tag sets. Because the interactive surface is the root slot (a button by default), InteractionTagSecondary participates in normal tab order and exposes native button semantics, and it is typically icon-only, so an accessible name must be supplied by the consumer. It is purely the action element: layout, appearance, and the surrounding tag chrome come from the parent InteractionTag.

**When to use**: Use InteractionTagSecondary when a tag must expose two distinct interactions: a primary one (handled by InteractionTagPrimary) and a secondary one — such as removing the tag from a selection, clearing a filter, or opening a per-tag menu. It is the right choice whenever the secondary action must be independently focusable and separately labelled, rather than folding dismissal into the tag's main click target. Do not use it as a stand-alone control: it is designed to be a sibling of InteractionTagPrimary within an InteractionTag. If a tag only needs a single action, use InteractionTagPrimary by itself or a plain Tag. If the tag is a read-only label with no interaction, use Tag. If tags are being managed inside a combobox-style multi-select, reach for TagPicker with TagPickerControl, TagPickerGroup, and TagPickerInput, which compose tags including their secondary actions.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `hasSecondaryAction` | `boolean` | — | No | — |
| `root` | `NonNullable<Slot<'button'>>` | — | Yes | — |
| `value` | `Value` | — | Yes | — |

### Prop Guidance

- **value**: Required. Identifies the tag that this secondary action belongs to and is what the parent InteractionTag uses to associate the action with the tag's own value. Keep it stable and unique across the rendered tag set so removal and lookup logic act on the correct tag; avoid reusing the same value for two tags in one group. `the same string used by the tag's primary action and by the parent InteractionTag`
- **hasSecondaryAction**: Boolean that signals the parent InteractionTag that a secondary action exists for this tag. Render the tag with this flag whenever you place an InteractionTagSecondary sibling, so the parent lays out and styles the tag as a two-segment control; omit it for tags that only expose a primary action. `true`
- **root**: Required slot that renders the interactive element, defaulting to a button. Use className and style on it for local presentation, keep button semantics unless you have a very specific reason to change the element, and supply aria-label here when the content is icon-only. If you do replace the element, preserve full keyboard operability and an accessible name. `the default button render, customized with className and aria-label`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Provide a unique, meaningful 'value' for every InteractionTagSecondary so the surrounding tag set can tell one tag's action apart from another's.
- Give the secondary action an accessible name — a text label, or an aria-label on the root slot when the content is icon-only (the common case for a dismiss affordance).
- Keep the secondary action's purpose visually and semantically distinct from InteractionTagPrimary; a dismiss icon paired with a text primary action is the canonical pattern.
- Let the parent InteractionTag own the visual container (background, border radius, appearance) and keep InteractionTagSecondary focused on being the interactive target.
- Place the secondary action consistently on the same side of every tag in a group so users can build muscle memory when clearing many tags in a row.
- Return focus to a sensible location after the secondary action removes its own tag, so keyboard users are not dropped onto a removed element.
- Use stable identity (the 'value' and a stable key or id in the consuming list) when rendering tags from a collection, so re-renders do not reorder focus or misroute the action to the wrong tag.

### Don'ts

- Do not render InteractionTagSecondary without a sibling InteractionTagPrimary — the secondary element is defined as the tag's second action, not its only one.
- Do not use it to perform the tag's primary job (navigation, filtering, selection); that belongs to InteractionTagPrimary.
- Do not ship an icon-only secondary action with no accessible name; it will be announced as an unlabelled button.
- Do not replace the default button root with a non-interactive element such as a div or span, which removes keyboard operability and button semantics.
- Do not bake tag-specific presentation (margins, borders, backgrounds that fight the parent) into InteractionTagSecondary; style the parent InteractionTag instead so all tags in a group stay consistent.
- Do not implement destructive removal without giving users a way to undo or recover, especially when tags can be cleared quickly in bulk.
- Do not nest other interactive components inside the secondary action; one interactive target per element keeps tab order and screen-reader output predictable.

## Anti-Patterns

### Stand-alone secondary action

❌ Rendering InteractionTagSecondary without a sibling InteractionTagPrimary leaves a tag whose only affordance is a dismiss-style button, which both looks broken and gives users no way to perform the tag's main action.

✅ Always pair the secondary action with an InteractionTagPrimary inside a single InteractionTag, and drop the secondary element entirely for tags that need only one action.

### Using the secondary slot for the main action

❌ Putting navigation, selection, or filtering behavior on InteractionTagSecondary inverts the intended hierarchy: assistive technology and keyboard users encounter the less important action first or find the primary affordance missing.

✅ Route the tag's main behavior to InteractionTagPrimary and reserve InteractionTagSecondary for the auxiliary action such as remove, clear, or open menu.

### Unlabelled icon-only dismiss

❌ A familiar-looking dismiss glyph is not an accessible name. Screen reader users hear only 'button' with no indication of the action or, worse, no indication of which tag will be removed.

✅ Add an aria-label to the root slot that describes both the action and, when it helps disambiguate, the tag it affects — and mark the icon itself aria-hidden.

### Replacing the button root for styling convenience

❌ Swapping the default button root for a div or span to make styling easier strips native keyboard activation, focusability, and button role, breaking WCAG 2.1.1 and 4.1.2.

✅ Keep the button root and restyle it through className with Griffel and design tokens; if a different semantic element is unavoidable, restore focusability, keyboard activation, and role explicitly.

### Unstable values across a large tag set

❌ Reusing or regenerating values on every render makes the secondary action ambiguous, so removal or clearing can target the wrong tag while focus jumps unpredictably.

✅ Derive value from stable, unique data in the source collection and keep the identity of each tag consistent across renders.

## Accessibility

## Styling

Style the root slot through className and let the parent InteractionTag own the container chrome. The secondary action inherits the tag's appearance treatment; in the default neutral look it uses tokens.colorNeutralBackground1 at rest, tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed for interaction states, and tokens.colorNeutralForeground2, tokens.colorNeutralForeground2Hover, and tokens.colorNeutralForeground2Pressed for the icon color. Spacing around the icon inside the button is typically tokens.spacingHorizontalSNudge horizontally and tokens.spacingVerticalSNudge vertically, with tokens.spacingHorizontalXS between the primary and secondary segments. The segment's outer corner is squared off against the primary action and uses tokens.borderRadiusMedium on the far edge; a circular treatment is available via tokens.borderRadiusCircular for icon-only dismiss buttons. Focus styling comes from tokens.colorStrokeFocus2 with a tokens.colorStrokeFocus1 inner ring. Keep typography at tokens.fontSizeBase200 with tokens.lineHeightBase200 if you render text, and note that the parent tag is responsible for the shared border drawn with tokens.strokeWidthThin.

## Performance

InteractionTagSecondary is a lightweight, button-based leaf element, so its own render cost is low; the cost appears when hundreds of tags render together. In large groups, avoid creating new inline handler functions, style objects, or class-name strings on every render of the parent list, since each tag's secondary action re-renders with it. Because the element reads context from its InteractionTag parent, memoizing tag rows on their stable value keeps the secondary actions from re-rendering when unrelated tags change. Render only the tags actually visible where possible — very large tag sets are better virtualized or truncated with an overflow affordance than rendered in full.

## Theming & Tokens

InteractionTagSecondary responds to the Fluent theme through design tokens rather than hard-coded colors. In the neutral treatment its background follows tokens.colorNeutralBackground1 with tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed for states, and its icon follows tokens.colorNeutralForeground2 with tokens.colorNeutralForeground2Hover and tokens.colorNeutralForeground2Pressed. When the parent tag is rendered in the brand treatment, the secondary segment uses tokens.colorBrandBackground2 with tokens.colorBrandForeground2 for contrast. Focus rings are drawn with tokens.colorStrokeFocus2 over tokens.colorStrokeFocus1, and corner geometry, spacing, and type all resolve to tokens.borderRadiusMedium or tokens.borderRadiusCircular, tokens.spacingHorizontalSNudge, tokens.spacingVerticalSNudge, tokens.fontSizeBase200, and tokens.lineHeightBase200. Because these are theme-aware, switching between light, dark, and high-contrast themes via FluentProvider automatically updates the secondary action without component-level overrides.

## Migration Notes

In v9 the tag was split into composable parts: the interactive container (InteractionTag) plus two sibling children, InteractionTagPrimary and InteractionTagSecondary. Older Fabric-era tags expressed dismissal as a boolean on the tag itself; here the secondary affordance is a real, separately focusable element with its own required value, which means removal logic moves from a single dismiss callback on the tag onto the secondary action's own handlers. Styling also moved from a styles/class-name override system to Griffel and design tokens, so per-tag visual tweaks should be expressed as className on the root slot or handled on the parent InteractionTag rather than through legacy style props.

## Edge Cases

- An icon-only secondary action has no accessible name by default — if you forget the aria-label, the button is announced with no purpose and no indication of which tag it targets.
- The 'value' is required and must stay unique within a rendered tag set; duplicate values make it ambiguous which tag a remove or clear action applies to.
- Taking no action or removing the wrong element after the secondary action deletes its own tag can leave focus on a detached node; always move focus to a neighboring tag or the host container.
- Overriding the root slot with an anchor changes activation keys from Enter/Space to Enter, and overriding it with a non-interactive element removes keyboard access entirely.
- hasSecondaryAction must agree with what is actually rendered: setting it without a sibling InteractionTagSecondary produces a tag styled for two segments with only one, and omitting it while rendering a secondary action can break the tag's layout.
- In long tag lists, a rapid sequence of dismissals can outpace list re-rendering, so the handler should be resilient to values that no longer exist in the collection.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
