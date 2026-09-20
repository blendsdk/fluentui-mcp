# EmptySwatch

> **Package**: `@fluentui/react-swatch-picker` v9.5.3
> **Import**: `import { EmptySwatch } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

EmptySwatch renders a single swatch-shaped button that represents the absence of a color — a transparent, unchecked, or "no color" state rather than a filled palette value. It is built on the same swatch primitive as the color-carrying swatches, so it inherits the same size, shape, spacing, and interaction behavior, but visually communicates emptiness through a subtle outline instead of a fill. In a swatch picker, EmptySwatch is the reset or default option that lets a user clear a previously chosen color or explicitly select "none". Its root element is a real button, meaning it is focusable, keyboard-activatable, and reports its selection and disabled state to assistive technology like any other swatch in the group. The component requires both a color and a value so that the empty state still has a resolvable identity and an accessible name in the selection model.

**When to use**: Use EmptySwatch when a swatch picker needs a 'no color', 'none', 'clear', or 'transparent' option alongside its filled swatches — for example in a color picker for cell fills, highlight colors, tag colors, or theme accent selection where the user must be able to unset a value. It is the correct choice whenever the meaningful state is 'nothing selected' rather than a specific hex value. Do not use EmptySwatch as a decorative placeholder or as a generic icon button: it is semantically a swatch option, so it should live inside a swatch picker container and participate in that group's selection model. If you need to show an actual transparent color chip as a data-driven value (for instance a row in a swatch grid), a regular swatch with a transparent styling is usually more appropriate; if you need a plain actionable icon with no swatch semantics, use Button or ToggleButton instead.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `borderColor` | `string` | — | No | — |
| `children` | `JSXElement[]` | — | Yes | — |
| `color` | `string` | — | Yes | — |
| `columnCount` | `number` | — | Yes | — |
| `defaultSelectedValue` | `string` | — | No | — |
| `disabled` | `boolean` | — | No | — |
| `focusMode` | `'arrow' \| 'tab'` | — | No | — |
| `items` | `SwatchProps[]` | — | Yes | — |
| `layout` | `'row' \| 'grid'` | — | No | — |
| `onSelectionChange` | `EventHandler<SwatchPickerOnSelectionChangeData>` | — | No | — |
| `renderSwatch` | `(item: SwatchProps) => JSXElement` | — | No | — |
| `root` | `Slot<'button'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `rowId` | `string \| number` | — | Yes | — |
| `selectedValue` | `string` | — | No | — |
| `shape` | `'rounded' \| 'square' \| 'circular'` | — | No | — |
| `size` | `'extra-small' \| 'small' \| 'medium' \| 'large'` | — | No | — |
| `spacing` | `'small' \| 'medium'` | — | No | — |
| `src` | `string` | — | Yes | — |
| `value` | `string` | — | Yes | — |
| `value` | `string` | — | Yes | — |

### Prop Guidance

- **color**: Required. Identifies the color associated with the swatch entry even though the empty swatch renders no fill; it keeps the option resolvable by the picker and by any code that maps values back to colors. Supply the neutral or transparent color used for the representation of 'no color'. `transparent or the surface color the empty state should read against`
- **value**: Required. The unique identifier for this option in the picker's selection model. Choose a stable sentinel such as an empty string or 'none' so your change handler can distinguish clearing the color from picking a real one. `none`
- **borderColor**: Optional override for the outline drawn around the empty swatch. Use it when the default neutral outline does not meet contrast on a colored or branded surface, for example a card with a strong background tint. `a color matching tokens.colorNeutralStrokeAccessible`
- **disabled**: Optional. Set when the user is temporarily not permitted to clear the selection. Prefer this over omitting the empty swatch so the palette layout stays stable and the constraint is announced as a disabled control. `true`
- **size**: Optional. Controls the overall footprint of the empty swatch. Match the size used by the other swatches in the picker; extra-small and small suit dense palettes, medium is the default-feeling choice, and large suits touch-first or sparse layouts. `medium`
- **shape**: Optional. Choose rounded, square, or circular to mirror the surrounding swatches. Circular is typical for color dots, square for pixel or cell-like color grids, and rounded for general UI accents. `circular`
- **spacing**: Optional. Controls the gap used when the empty swatch is laid out with its siblings. Use small for tight palettes and medium when swatches are large or touch targets need breathing room. `small`
- **root**: Required slot. The underlying button element. Use it to attach the accessible name through aria-label, to add data attributes for tests, to forward refs, and to apply custom styling, but never to replace the button element or strip its focus behavior. `provide aria-label with the localized 'No color' string`
- **selectedValue**: Optional, at the picker level. When the current selection equals the empty swatch's value, the empty option is rendered as selected. Keep this controlled value in sync with your own state so the empty tile and the palette tiles always agree. `none`
- **defaultSelectedValue**: Optional, at the picker level. Use this uncontrolled entry point when the initial selection should be the empty swatch, for example a form that starts with no highlight color applied. `none`
- **onSelectionChange**: Optional, at the picker level. The single place to react to a user choosing the empty swatch versus a colored one; compare the reported value against the empty swatch's value to branch your clear logic. `clear the color when the reported value is the empty sentinel`
- **layout**: Optional, at the picker level. Use row for a short palette and grid when many swatches must wrap. The empty swatch should sit in a predictable cell — first or last — in either layout. `grid`
- **items**: Optional, at the picker level. When the picker is data-driven, include the empty option as an explicit entry in the item list rather than special-casing it in markup, so ordering and layout stay consistent. `an entry whose value is the empty sentinel`
- **columnCount**: Optional, at the picker level. Defines how many swatches appear per row in grid layout. Account for the empty swatch when choosing the count so it does not orphan onto its own row. `6`
- **renderSwatch**: Optional, at the picker level. A render callback for individual swatch entries. Only override it if you must customize rendering; when you do, render EmptySwatch for the empty entry and keep the same size, shape, and spacing. `return an EmptySwatch for the entry flagged as empty`
- **focusMode**: Optional, at the picker level. Use arrow for a single tab stop with roving arrow-key navigation across the palette — the recommended mode for dense swatch groups — or tab when every swatch should be individually tabbable. `arrow`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Always pair EmptySwatch with a meaningful color and value so the empty option is identifiable in the selection model and can be styled and announced consistently.
- Give the empty swatch an accessible name that describes its outcome — 'No color', 'Clear color', 'Transparent' — rather than relying on the visual empty tile alone.
- Place the empty swatch first or last in the group consistently, so users build a stable mental model of where the reset option lives.
- Keep size, shape, and spacing identical to the surrounding swatches so the empty option reads as part of the same set and keeps a uniform hit target.
- Use the disabled prop rather than removing EmptySwatch when the user is temporarily not allowed to clear the selection, so the layout does not shift and the constraint is announced.
- Verify the outline around the empty swatch meets non-text contrast requirements against both light and dark surfaces, since there is no fill to carry the affordance.
- Drive selection through selectedValue or defaultSelectedValue plus onSelectionChange at the picker level rather than maintaining your own selection state on the swatch.

### Don'ts

- Do not render EmptySwatch outside of a swatch picker context — without the surrounding group it loses its selection semantics and reads as an unlabeled button.
- Do not reuse the same value for EmptySwatch and a real colored swatch; duplicate values make selection ambiguous and break the change handler.
- Do not encode selection with color alone, such as tinting the empty swatch border when selected without any other indicator or ARIA state.
- Do not nest interactive content (links, buttons, inputs) inside the root slot of the swatch; a button inside a button produces invalid markup and confusing focus order.
- Do not change shape or size for the empty swatch only, as visually inconsistent swatches look like a rendering bug rather than an intentional option.
- Do not target the root slot with external styles that remove the focus outline; the focus ring is the primary affordance for the empty state.
- Do not use EmptySwatch as the only way to express 'unset' in a form when a checkbox or radio already carries that meaning — redundant controls create conflicting announcements.

## Anti-Patterns

### Unlabeled empty tile

❌ An EmptySwatch with no accessible name is announced as a bare 'button' in a group of otherwise named color options, so screen reader users cannot tell that it clears the selection or represents no color.

✅ Always supply a descriptive, localized accessible name through the root slot, such as 'No color' or 'Clear color', and verify it still makes sense when the swatch is disabled.

### Using EmptySwatch as a decorative or standalone button

❌ Rendering the empty swatch outside a swatch picker, or purely for visual balance, exposes an interactive control with swatch semantics that does nothing in a selection group and confuses the focus order.

✅ Only render EmptySwatch as a member of a swatch picker. For decoration use a non-interactive element; for a genuine standalone action use Button.

### Duplicate or missing value

❌ Giving the empty swatch the same value as a filled swatch makes selection ambiguous and can silently break the change handler, while omitting the value prevents the option from participating in the selection model at all.

✅ Assign a reserved sentinel value such as an empty string or 'none' that no colored swatch uses, and branch on it in the selection change handler.

### Faking selection with color only

❌ Styling the empty swatch's border or background to indicate selection without exposing any programmatic state leaves assistive technology users unaware of the current value and violates use-of-color requirements.

✅ Let the picker manage selection so the correct ARIA selection state is applied, and pair any visual change with a non-color cue such as the standard focus ring or a check indicator.

### Inconsistent sizing or shape for the empty option

❌ A differently sized or shaped empty swatch looks like a rendering defect and breaks the uniform hit-target rhythm of the palette, making it harder to hit on touch devices.

✅ Reuse the same size, shape, and spacing values across every swatch in the group, including EmptySwatch.

## Accessibility

**Requirements**: EmptySwatch must satisfy WCAG 2.1.1 (Keyboard) because it is an interactive control, WCAG 4.1.2 (Name, Role, Value) because it must expose its role, selected state, and disabled state, WCAG 1.4.1 (Use of Color) because the empty option must not be distinguishable from a selected option by color alone, WCAG 1.4.11 (Non-text Contrast) because the outline of an unfilled swatch is the only thing that makes the control perceivable, and WCAG 2.4.7 (Focus Visible) because keyboard users need a visible indicator on the button root. Every swatch in a group, including the empty one, needs a programmatic name — pass it through the root slot's aria-label or by labelling the swatch with text.

| Key | Action |
| --- | --- |
| `Enter` | Activates the focused empty swatch and commits it as the current selection, firing the picker's selection change handler. |
| `Space` | Activates the focused empty swatch the same way as Enter, matching native button behavior. |
| `Arrow keys` | Move focus between swatches in the group when the picker's focusMode is set to arrow, allowing traversal of the palette without leaving the swatch collection. |
| `Home / End` | Move focus to the first or last swatch in the group when arrow-based focus movement is enabled. |
| `Tab / Shift+Tab` | Moves focus into and out of the swatch group; when focusMode is tab, each swatch including EmptySwatch is its own tab stop. |

**ARIA**: aria-label, aria-disabled, aria-selected, aria-checked, aria-describedby

**Screen Reader**: Because the root slot renders a native button, screen readers announce EmptySwatch as a button with its accessible name (for example 'No color') plus the disabled state when disabled is set. Within a swatch picker group, the selection state is conveyed through the selection attribute applied by the picker to the swatch root, so activating the empty swatch announces the change the same way selecting a filled swatch does. A sighted-only empty tile with no name is announced as an unlabeled button, which is why the accessible name must describe the outcome of choosing it. Arrow-key focus movement keeps the group announced as a single collection while the focused swatch is read out as the user moves through it.

## Styling

Style EmptySwatch through the root slot and its CSS variables rather than by wrapping it in extra containers. The empty appearance is drawn with an outline, so the most impactful customizations are borderColor, which overrides the swatch outline color, and any transparent background applied on the root. Make the unfilled option perceivable against every surface it sits on by using tokens such as tokens.colorNeutralStroke1 or tokens.colorNeutralStrokeAccessible for the border and tokens.colorNeutralBackground1 for the fill, then tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed for interaction states. Focus styling should use tokens.colorStrokeFocus1 and tokens.colorStrokeFocus2 so the ring stays visible on both filled and empty swatches. Shape maps to border radius, so use tokens.borderRadiusCircular for circular swatches, tokens.borderRadiusMedium for rounded, and tokens.borderRadiusSmall for square; spacing between swatches should use tokens.spacingHorizontalXS through tokens.spacingHorizontalL so the empty swatch keeps the rhythm of the group. Keep the empty tile visually light — a thin outline in tokens.strokeWidthThin reads as absence, whereas tokens.strokeWidthThick makes it look like a selected filled swatch.

## Performance

EmptySwatch itself is a single lightweight button with no internal state, so its render cost is negligible; the real cost in a swatch picker comes from the number of sibling swatches and from inline style or object props that change identity on every render. Pass stable callback identities to the picker's selection change handler and avoid re-creating the swatch item array on each render so swatches, including the empty one, can be reconciled cheaply in large grids. Prefer the picker's data-driven items plus columnCount over hand-authored children when the palette is large, and keep any renderSwatch implementation free of per-render allocations and heavy computation. Because swatches are pure presentation, memoizing custom swatch rendering is usually more effective than trying to virtualize a modest palette.

## Theming & Tokens

EmptySwatch reads its visuals from the Fluent theme through Griffel tokens, so it adapts automatically when FluentProvider switches between light, dark, or high-contrast themes. The outline of the empty tile comes from neutral stroke tokens such as tokens.colorNeutralStroke1 and the accessible variant tokens.colorNeutralStrokeAccessible, while its surface uses tokens.colorNeutralBackground1 with tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed for interaction states. Focus indication uses tokens.colorStrokeFocus1 and tokens.colorStrokeFocus2, and disabled rendering leans on tokens.colorNeutralForegroundDisabled and tokens.colorNeutralBackgroundDisabled. Geometry-related tokens such as tokens.borderRadiusSmall, tokens.borderRadiusMedium, tokens.borderRadiusCircular, tokens.spacingHorizontalXS through tokens.spacingHorizontalL, and tokens.strokeWidthThin control the shape and spacing that keep the empty swatch aligned with its filled siblings. Override the neutral tokens on a wrapping container to make the empty swatch match a branded palette rather than hard-coding colors on the root slot.

## Migration Notes

EmptySwatch has no direct counterpart in Fluent UI React v8, where a 'no color' choice was typically hand-rolled as a custom tile, a plain Button, or a checkbox next to the palette. When migrating, replace those ad hoc controls with EmptySwatch inside a swatch picker so the reset option inherits correct sizing, focus behavior, and selection semantics. Remove any custom CSS that drew the empty tile yourself; express the outline with borderColor and the neutral stroke tokens instead, and delete bespoke selected/disabled styling in favor of the picker's selectedValue and disabled handling. Also drop any manual keyboard handlers you wrote for the old tile, since focus movement and activation are handled by the picker's focusMode and the native button root.

## Edge Cases

- The empty swatch still requires both color and value even though it paints nothing, so omitting either produces an option that cannot be resolved by the picker's selection model.
- The empty sentinel value must not collide with any real color value in the palette; choose a value that no colored swatch can produce.
- A transparent or heavily muted borderColor can make the empty swatch effectively invisible on tinted backgrounds, so verify contrast against the actual surface it is placed on rather than assuming a white page.
- When the picker uses arrow focus mode, the empty swatch is part of the roving tab order; inserting or removing it at runtime between render passes can shift the expected arrow-key path for users.
- If focusMode is tab, a long palette plus the empty swatch creates many tab stops, which is tedious for keyboard users; reserve that mode for very small groups.
- Wrapping the root slot in an element that is not a button, or replacing it entirely with a div, removes native keyboard activation and the announced role, breaking both accessibility and the picker's expectation of an actionable swatch.
- Disabling EmptySwatch while it is the selected value leaves the user with no way to clear the selection, so disable it only when a value is already unset or clearing is genuinely disallowed.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
