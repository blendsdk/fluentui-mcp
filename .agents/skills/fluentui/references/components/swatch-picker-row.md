# SwatchPickerRow

> **Package**: `@fluentui/react-swatch-picker` v9.5.3
> **Import**: `import { SwatchPickerRow } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

SwatchPickerRow is the layout and grouping container that arranges individual swatch buttons inside a SwatchPicker. It renders a div root by default and is responsible for placing its swatch children in a single horizontal line or in a multi-column grid, while the surrounding SwatchPicker owns the selection model, the accessible name, and the keyboard focus strategy. Each swatch inside the row is a button element (exposed through the root slot as Slot<'button'>) whose visual appearance is driven by a color value or an image source, with an optional border color so light or near-transparent swatches stay visible against the surface. The row participates in the picker's selection state through value, selectedValue, defaultSelectedValue, and onSelectionChange, and it identifies itself within the picker through rowId. Density is controlled with size and spacing, and the visual silhouette of the contained swatches is controlled with shape. Because SwatchPickerRow is a presentational grouping element rather than a form control of its own, it does not hold its own value; it distributes the parent's selection and disabled state down to the swatches it contains.

**When to use**: Use SwatchPickerRow when you are building a color or image selection experience and need explicit control over how swatches are distributed across lines. Reach for it when each line has a different number of swatches, when you want to interleave row-level metadata, when you need a custom renderer for the swatches, or when you are laying out a large palette in a grid where the column count must be pinned regardless of container width. If your palette is a simple, evenly distributed set of colors and you do not care where the line breaks fall, pass an items array to the parent SwatchPicker and let it wrap for you instead of authoring rows by hand. Choose SwatchPickerRow over a generic list only for pickers whose primary content is a color or swatch; for arbitrary selectable content, use Listbox or TagPicker instead.

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

- **root**: The div slot that renders the row container. Replace or extend it when you need extra attributes, a different element type, or a testing hook, but keep it non-interactive so the swatch buttons remain the only focusable elements in the row. `root`
- **children**: The explicit swatch elements to lay out inside this row. Use children when you want full control over ordering, per-swatch naming, or a mix of color and image swatches; use the parent items array instead when the palette is uniform. `JSXElement[]`
- **rowId**: A stable identifier for this row within the picker. Set a value that is unique and does not change between renders, because it is used to key and distinguish rows during selection updates and reordering. `brand-colors`
- **items**: The array of swatch descriptors the picker consumes to render swatches without hand-authored children. Populate it when every swatch follows the same shape and only the color or image differs. `SwatchProps[]`
- **columnCount**: The number of swatches per line when the picker is laid out as a grid. Match it to the number of children in the row so arrow-key movement and wrapping stay intuitive. `6`
- **layout**: Chooses between a single horizontal line (row) and a wrapped, multi-column arrangement (grid). Use grid for large palettes and row when each line is intentionally curated. `grid`
- **spacing**: Controls the gap between swatches at two preset densities. Increase to medium when swatches are small or when the picker sits on a dense surface and the swatches need visual separation. `medium`
- **size**: Sets the rendered size of the swatches in the row from extra-small to large. Use larger sizes for touch-first surfaces and small or extra-small only for compact toolbars where the surrounding spacing keeps the target comfortable. `medium`
- **shape**: Determines whether swatches read as rounded squares, hard squares, or circles. Circular pairs well with color dots in avatars and avatars-adjacent contexts; square tends to read as a swatch board or palette. `circular`
- **renderSwatch**: A callback that receives a swatch descriptor and returns custom content for that swatch. Use it when swatches need a checkmark, a label, or image fallbacks, and keep the injected content decorative so the swatch keeps a single, clean accessible name. `(item) => custom swatch content`
- **selectedValue**: The currently selected swatch value in a controlled picker. Provide it together with onSelectionChange and treat the callback's value as the source of truth for the next render. `#0078d4`
- **defaultSelectedValue**: The initial selection for an uncontrolled picker. Use it only when the component should manage selection internally; do not combine it with selectedValue, since the controlled value takes precedence. `#d13438`
- **onSelectionChange**: Fires when the user activates a swatch, providing the data object that carries the new value. Use it to persist the choice, and ignore it for purely presentational palettes. `SwatchPickerOnSelectionChangeData`
- **focusMode**: Switches the picker between a single roving tab stop (arrow) and one tab stop per swatch (tab). Choose arrow for palettes with many swatches and tab for very short palettes where each swatch is a deliberate stop. `arrow`
- **value**: The unique value a single swatch contributes to the picker's selection model. Keep it human-meaningful and stable, such as a design token name or a hex string, because it is what selectedValue and the selection callback exchange. `colorBrandBackground`
- **color**: The fill color of a color swatch. Use theme palette tokens rather than literal hex values so the swatch follows the active theme. `tokens.colorPaletteBlueBackground3`
- **src**: The image source for an image swatch, used instead of a flat fill. Pair it with a meaningful value and accessible name, since the image alone does not describe the choice. `avatar-photo.png`
- **borderColor**: Overrides the swatch border color so very light, low-contrast, or transparent swatches remain visible. Set it whenever the swatch fill approaches the surface color behind it. `tokens.colorNeutralStroke1`
- **disabled**: Marks an individual swatch as unavailable while keeping it visible for context. Disable only the swatches that truly cannot be chosen and pair the restriction with an explanation elsewhere in the UI. `true`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Give every row a stable, unique rowId so selection state and re-renders stay predictable when rows are added or reordered.
- Supply an accessible name for each swatch beyond its hex or RGB value — for example a human-readable color name — because a raw color string is not meaningful to screen reader users.
- Set borderColor on swatches whose color is very light, near-white, or transparent so the swatch boundary keeps at least a 3:1 contrast ratio against the surrounding surface.
- Prefer focusMode set to arrow for dense palettes so the whole row behaves as a single tab stop and keyboard users are not forced through every swatch.
- Keep columnCount consistent with the number of children when layout is grid; a mismatch produces ragged rows and unpredictable arrow-key movement.
- Use renderSwatch when swatches must show extra content such as a checkmark or a swatch label, and keep that extra content decorative so it does not compete with the row's own semantics.
- Choose size and shape together with spacing so the resulting hit targets remain comfortably tappable on touch devices, especially when size is extra-small.
- Use selectedValue for controlled selection and pair it with onSelectionChange; use defaultSelectedValue only when the picker should own its own state.

### Don'ts

- Do not render SwatchPickerRow outside of a SwatchPicker — it relies on the picker for selection context, accessible naming, and focus management.
- Do not mix a hand-authored children array with a parent-supplied items array in the same picker, because ordering and selection mapping become ambiguous.
- Do not signal selection with color alone; a swatch that is the selected one plus a swatch that happens to share that color are indistinguishable to users with color vision deficiencies.
- Do not nest a SwatchPicker, a Listbox, or any other interactive control inside a swatch, since the swatch root is already a button.
- Do not disable an entire row by disabling each swatch without explanation; disabled swatches that give no reason are confusing and often inaccessible.
- Do not replace the root slot with an element that is not focus-manageable, because the row's keyboard traversal depends on the swatches remaining reachable in DOM order.
- Do not use SwatchPickerRow for generic multi-select content such as tags, files, or people — use TagPicker or Listbox for those.
- Do not rely on hover-only affordances such as tooltips to convey a swatch's name, because touch and keyboard users will never see them.

## Anti-Patterns

### Selection communicated by color alone

❌ If the only difference between a selected swatch and its neighbors is a hue shift or a subtle ring in the same family, users with color vision deficiencies and users in high-contrast mode cannot tell which swatch is active.

✅ Expose selection programmatically on the swatch and reinforce it visually with a shape or border change, such as a thicker token-driven outline or an overlaid mark produced through renderSwatch, so the state is legible without color perception.

### Hand-authoring rows that duplicate a parent items array

❌ Rendering an items array on the picker and also supplying explicit children in rows produces duplicate swatches, mismatched value mapping, and a selection model that points at a swatch the user cannot see.

✅ Pick one ownership model. Either let the picker distribute a single items array across rows, or author every swatch as children and leave items unset, keeping rowId stable for each row.

### Using SwatchPickerRow as a general-purpose list

❌ The row exists to group swatch buttons for color selection. Reusing it for tags, people, or files strips those items of the roles and behaviors their dedicated components provide.

✅ Use TagPicker for tags and people-style tokens, Listbox for single or multi select lists, and reserve SwatchPickerRow for color and swatch selection where the value space is a palette.

### Tiny swatches with no compensating spacing

❌ Combining size extra-small with spacing small creates targets below the recommended minimum touch size, making the picker frustrating or unusable on touch screens and failing WCAG 2.5.8.

✅ Raise spacing to medium, increase size, or wrap the palette in a container that provides extra padding so the effective target area is large enough.

### Rendering SwatchPickerRow without a SwatchPicker parent

❌ The row depends on the surrounding picker for selection context, accessible naming, and the arrow-key traversal that focusMode promises. Standing alone, the swatches announce as unnamed buttons with no group context and selection never fires.

✅ Always render rows as descendants of a SwatchPicker, and give that picker a meaningful accessible name so the palette is announced as a single labeled group.

## Accessibility

**Requirements**: SwatchPickerRow inherits the accessibility contract of the surrounding SwatchPicker. The picker must expose a group or listbox role with an accessible name, and the row's swatches must each be individually named so that color is never the only carrier of meaning (WCAG 1.4.1 Use of Color). Any visual boundary that communicates a swatch's extent must meet the 3:1 non-text contrast minimum of WCAG 1.4.11, which is why borderColor matters for pale swatches. The selected swatch must be programmatically exposed as selected, not just visually emphasized, and disabled swatches must be programmatically disabled rather than merely grayed out. Focus must remain visible at all times with a clearly discernible indicator (WCAG 2.4.7 and 2.4.11), and pointer targets should respect WCAG 2.5.8 minimum target size, which the extra-small size can violate if spacing is not increased.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into or out of the picker. With focusMode set to arrow, the row is a single tab stop; with focusMode set to tab, every swatch in the row is its own tab stop. |
| `ArrowRight` | Moves focus to the next swatch in the row, wrapping or continuing into the adjacent row depending on the installed layout. |
| `ArrowLeft` | Moves focus to the previous swatch in the row. |
| `ArrowDown` | Moves focus to the swatch in the same column of the next row when the picker is laid out as a grid. |
| `ArrowUp` | Moves focus to the swatch in the same column of the previous row when the picker is laid out as a grid. |
| `Enter` | Selects the currently focused swatch and fires the selection change callback with the new value. |
| `Space` | Selects the currently focused swatch, matching native button activation behavior. |

**ARIA**: aria-label, aria-labelledby, aria-selected, aria-disabled, aria-describedby

**Screen Reader**: Screen readers encounter the picker as a named group of swatch buttons and announce each swatch by its accessible name plus its selected or disabled state. Because the swatch root is a button, activation via Enter or Space is announced and handled natively. When focusMode is arrow, screen reader users traverse the palette with the arrow keys and the focused swatch's position is announced relative to the row; when focusMode is tab, each swatch is announced as a separate focusable element. Selection changes are communicated through the selected state of the newly selected swatch, so any additional visual-only confirmation such as a checkmark or a scale animation should be marked as decorative and not exposed as text content.

## Styling

Most visual tuning happens through the row's own props before any stylesheet override: size drives the swatch dimensions, shape switches between rounded, square, and circular silhouettes, and spacing toggles the gap between swatches. When you do need custom styling, extend the root with a className and use Griffel to control the gap, for example a gap built from tokens.spacingHorizontalXS, tokens.spacingHorizontalS, or tokens.spacingHorizontalM paired with tokens.spacingVerticalXS. Swatch boundaries are best expressed through borderColor plus tokens.colorNeutralStroke1 or tokens.colorNeutralStrokeAccessible rather than hard-coded hex values, so borders flip correctly in dark and high-contrast themes. Use tokens.borderRadiusSmall, tokens.borderRadiusMedium, or tokens.borderRadiusCircular to mirror the built-in shape options, and tokens.strokeWidthThin versus tokens.strokeWidthThick to control how assertive a border reads. Focus styling should use tokens.colorStrokeFocus2 with tokens.strokeWidthThick so the indicator stays visible on both light and dark swatches, and transitions between states should use tokens.durationNormal with tokens.curveEasyEase. For image swatches, tokens.shadow2 or tokens.shadow4 can lift the tile slightly off tokens.colorNeutralBackground1 without hurting contrast.

## Performance

Every swatch inside the row is a real button element, so the cost of a row scales linearly with the number of swatches it contains; large palettes are better expressed as several rows using the grid layout than as one very long row. The items array and the renderSwatch callback should be stable across renders — defining them inline recreates the array and the callback on every render, which forces the picker to re-evaluate every swatch even when nothing changed. Image swatches are the most expensive case because the browser must decode each source, so keep image swatches small, avoid reusing the same large asset at several sizes, and prefer flat color fills for purely representational palettes. Because selection is value-based, avoid deriving new value strings during render; unstable values invalidate the selected state on every pass and cause unnecessary re-renders of the whole row.

## Theming & Tokens

SwatchPickerRow consumes its sizing and spacing from the Fluent spacing ramp and its colors from the FluentProvider theme, so wrapping a palette in a customized FluentProvider re-themes it without any local overrides. Spacing and gap come from tokens.spacingHorizontalXS, tokens.spacingHorizontalS, and tokens.spacingHorizontalM together with tokens.spacingVerticalXS on the vertical axis. Swatch shapes resolve against tokens.borderRadiusSmall, tokens.borderRadiusMedium, and tokens.borderRadiusCircular, while border thickness uses tokens.strokeWidthThin or tokens.strokeWidthThick. Neutral boundaries pull from tokens.colorNeutralStroke1, tokens.colorNeutralStroke1Hover, and tokens.colorNeutralStrokeAccessible, and focus rings use tokens.colorStrokeFocus2 over tokens.colorNeutralBackground1. Palette fills are expected to come from tokens.colorPaletteBlueBackground3 and its siblings, or from brand tokens such as tokens.colorBrandBackground2, so that light, dark, and high-contrast themes all resolve to readable values. Motion between selection states should be expressed with tokens.durationNormal and tokens.curveEasyEase, and the parent surface is expected to be tokens.colorNeutralBackground1 or tokens.colorNeutralBackground2.

## Migration Notes

In v8, swatch pickers were styled through a theme object and a styles prop that merged state styles into the component's classes. In v9, SwatchPickerRow is themed through FluentProvider and styled through a className that receives Griffel classes, so theme-level overrides should be expressed as token overrides on FluentProvider rather than as per-instance style objects. The row now exposes a named root slot, which means structural changes are made by replacing the slot rather than by unsetting generated class names. Selection is fully value-based and string-driven: the previous pattern of coordinating selection through index-based or key-based state should be replaced with value, selectedValue, defaultSelectedValue, and onSelectionChange. Density options have been consolidated into the size, shape, and spacing enums, and layout control has moved to layout together with columnCount rather than to ad hoc wrapper markup.

## Edge Cases

- A swatch whose color matches the page background becomes invisible; always set borderColor for white, near-white, or transparent values, or the swatch appears to be missing from the row.
- When focusMode is tab and the palette is large, the keyboard tab sequence becomes very long and users get trapped stepping through colors; switch to arrow mode for anything beyond a handful of swatches.
- Passing a selectedValue that matches no swatch value leaves the picker with no visible selection while still reporting a selection internally, so validate that the controlled value exists in the row's value set.
- Changing columnCount without changing the children count produces rows with dangling swatches on the last line and arrow-key movement that no longer lines up with the visual grid.
- Image swatches that fail to load render as blank tiles; provide a meaningful accessible name and a fallback color so the swatch still communicates a choice.
- Duplicate rowId values across rows make selection updates ambiguous when rows are conditionally rendered, so ensure identifiers remain unique after filtering or reordering.
- Duplicated value strings across different rows cause both swatches to appear selected when a single selection is expected.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
