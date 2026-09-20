# ColorSwatch

> **Package**: `@fluentui/react-swatch-picker` v9.5.3
> **Import**: `import { ColorSwatch } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

ColorSwatch is a small, purely presentational element that renders a single color as a filled swatch, giving color a visual, scannable form inside pickers, palettes, legends and previews. It requires both a color (the value actually painted as the fill) and a value (the string that identifies the color to whatever component owns the swatch), and it exposes root, icon and disabledIcon slots so shape, size and the disabled treatment can be customized. ColorSwatch owns no interaction: it is designed to be rendered as a child of a controlling component such as ColorPicker (where it previews the current color) or SwatchPicker and SwatchPickerRow (where it becomes a selectable option in a palette), and it sits alongside EmptySwatch and ImageSwatch as the plain-color member of that family. Pass borderColor whenever the fill has low contrast against the surface behind it so the swatch keeps a visible edge, and set disabled to render the disabledIcon treatment for options that must stay visible but cannot be chosen.

**When to use**: Use ColorSwatch whenever a color has to be shown as color rather than described as text: the current value inside a ColorPicker, an option in a SwatchPicker palette, a chip next to a Label or Text in a form, or a compact color indicator in a table or list cell. Prefer it over a hand-rolled element with a hard-coded background, because it carries consistent sizing and shape, contrast-ring handling, a disabled treatment and slot structure that the color family's parents already know how to consume. Choose EmptySwatch when the swatch must represent "no color", and ImageSwatch when the option is an image or pattern rather than a flat color. Reach for Badge, CounterBadge or PresenceBadge when the intent is status, counts or availability instead of a color value, and use ColorPicker with ColorArea, ColorSlider and AlphaSlider when users need to author an arbitrary color rather than select one from a set.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `borderColor` | `string \| undefined` | — | No | Border color when contrast is low |
| `color` | `string` | — | Yes | Swatch color |
| `disabled` | `boolean \| undefined` | — | No | Whether the swatch is disabled |
| `value` | `string` | — | Yes | Swatch value |

### Prop Guidance

- **color**: Required. The literal fill painted on the swatch, so it must be a valid solid color string and should be legible against the surface behind it; pair it with borderColor when it is not. For previews of theme colors, prefer a value that changes with the theme rather than a hard-coded literal. `#0F6CBD`
- **value**: Required. The identity of the swatch, deliberately separate from the rendered color. Parents such as SwatchPicker compare against value to decide which swatch is selected, so keep it unique within a palette and stable across renders (usually the same string as the color). `#0F6CBD`
- **borderColor**: Draws a contrast ring so a low-contrast fill still reads as a swatch. Supply it for white, very pale or near-surface colors, or when the swatch is laid over a background of similar luminance; omit it when the fill already separates clearly from its surroundings. `tokens.colorNeutralStroke1`
- **disabled**: Marks the swatch as unavailable and renders the disabledIcon slot. Prefer it over removing the swatch so the palette keeps its structure, and make sure the owning control also excludes the swatch from keyboard navigation and selection and reports the unavailable state with aria-disabled. `true`
- **root**: Slot for the outer element; this is where className, style and element overrides belong. Keep it driven by the parent's size and shape so siblings match rather than restyling single instances. `shared className from makeStyles`
- **icon**: Optional graphics slot rendered inside the swatch, normally left empty for a plain color chip. Use it when the owning control needs a marker drawn over the fill, and always give the replacement an accessible name or hide it if it is decorative. `checkmark marker`
- **disabledIcon**: Slot for the graphic shown when disabled is true, by default a slash across the swatch. Keep the default unless your design system specifies an equivalent, and keep the replacement identical across the whole palette so unavailability stays recognizable. `slash overlay`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `disabledIcon` | — | No | — |
| `icon` | — | No | — |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Always supply both color and value, and keep value unique and stable across the palette so that selection logic in a parent such as SwatchPicker can identify each swatch.
- Set borderColor for light or near-surface fills — white, very pale pastels, anything close to the page background — because a swatch with no visible edge reads as empty space.
- Let the owning control decide size and shape (the parent's shape and size options, or one shared class) instead of resizing or re-rounding individual swatches.
- Use disabled — which renders the disabledIcon slot — for options that exist but cannot be chosen, so the palette layout stays stable and the unavailable state is visible.
- Give every meaningful swatch an accessible name through its interactive wrapper (for example an aria-label describing the color as a name or hex value), and hide purely decorative previews with aria-hidden when adjacent text already names the color.
- Keep colors as solid, literal color strings painted as a flat fill, and keep hover, focus and selected affordances on the controlling wrapper rather than on the swatch itself.

### Don'ts

- Don't attach click handlers, tabIndex or a role to the swatch root expecting a usable control; the root has no button or radio semantics, no accessible name and no focus behavior.
- Don't reuse the same value for two swatches in one palette; duplicated values make several swatches appear selected at once and break identity comparisons.
- Don't encode meaning — availability, severity, category, error — in the swatch color alone, because hue is not perceivable by every user and can be overridden in forced-colors mode.
- Don't use borderColor as a decorative accent around every swatch; it exists to preserve contrast when the fill is too close to the background, and a permanent ring visually shrinks the color area.
- Don't treat ColorSwatch as an input; it cannot author or modify a color, only display one.
- Don't assume the fill follows the theme — the color you pass is literal, so verify it against light, dark and high-contrast themes.
- Don't replace the disabledIcon with an ad-hoc overlay graphic unless your design system defines an equivalent, because the slash is the recognizable signal for an unavailable color.

## Anti-Patterns

### Clickable swatch

❌ Attaching click handlers, tabIndex or a role to the ColorSwatch root produces a fake control: the swatch has no pressed or selected state, no keyboard activation and no accessible name, so keyboard and screen reader users cannot operate the palette at all.

✅ Render swatches inside SwatchPicker or SwatchPickerRow, or wrap each swatch in a real Button or ToggleButton that carries the accessible name and the selection state.

### Color as the only signal

❌ Using the fill to convey availability, severity or category means users who cannot distinguish the hues, or who read the page in forced-colors mode, lose the information entirely.

✅ Pair every swatch with text such as Label or Text, give the owning control an accessible name for each swatch, and move status communication to Badge, CounterBadge, PresenceBadge or MessageBar while the swatch shows only color.

### Duplicated or drifting values

❌ Reusing one value for several swatches, or changing values for the same colors between renders, makes the selection state jump between swatches and forces parents to infer identity from rendered style.

✅ Keep exactly one unique, stable value per swatch — typically the hex string — and never derive it from display order or from a mutable counter.

### Per-instance resizing or re-rounding

❌ Overriding width, height or borderRadius on individual swatches breaks the grid rhythm of a palette, makes the contrast ring inconsistent, and can misalign the parent's selection ring.

✅ Set size and shape once on the owning SwatchPicker or swatch row, or through a single shared class applied to every swatch.

### Border as decoration

❌ Passing borderColor to paint a themed frame around every swatch wastes the prop's contrast purpose and reduces the visible color area, making colors harder to compare accurately.

✅ Only pass borderColor for low-contrast fills, and let the controlling component draw the selected and focused rings around the swatch.

## Accessibility

**Requirements**: A bare ColorSwatch cannot satisfy accessibility requirements on its own: its root is a role-less, non-focusable element, so the control that owns the swatch must supply the semantics, the accessible name and the state. Every swatch that participates in selection needs a parent that provides the correct role and selection state (SwatchPicker and SwatchPickerRow do this), plus one accessible name per swatch; non-interactive previews should be hidden from assistive technology when a visible Label or Text already states the color. Because color is a non-text visual, apply the WCAG 1.4.11 non-text contrast expectation (3:1 between the swatch and the surface behind it) by passing borderColor for low-contrast fills, and never rely on hue alone to communicate state (WCAG 1.4.1). Disabled swatches must be excluded from selection and keyboard navigation, and the unavailable state should be exposed on the owning control (aria-disabled) rather than as a purely visual slash.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and out of the owning control, such as a SwatchPicker, a SwatchPickerRow or a Popover holding the palette; the ColorSwatch root itself never receives focus. |
| `Enter` | Activates the focused swatch only when the parent control implements activation on Enter; a standalone ColorSwatch responds to nothing. |
| `Space` | Selects the focused swatch when the parent supplies button or radio semantics; ignored by a ColorSwatch used as a plain preview. |
| `Arrow keys` | Move focus between adjacent swatches when the parent implements roving focus across its children, as a swatch row or swatch picker does; ColorSwatch does not handle arrow keys itself. |
| `Escape` | Dismisses a surrounding surface such as a Popover or Dialog that contains the swatches; handled by that surface, not by ColorSwatch. |

**ARIA**: aria-label, aria-labelledby, aria-disabled, aria-hidden, aria-checked (applied by the parent of a selectable swatch), aria-selected (applied by the parent of a selectable swatch), aria-pressed (applied when the swatch is wrapped in a toggle-style button by the parent)

**Screen Reader**: A bare ColorSwatch is announced as nothing meaningful — the root has no role and no accessible name, so users hear only whatever text sits beside it. When the swatch is rendered inside a control that supplies semantics, the control's role and name are what is announced (for example a radio named with the color, reported as selected), and the fill itself is never spoken as a color. Decorative previews that duplicate adjacent text should be hidden with aria-hidden so they add no noise, and disabled swatches inside a selectable group should be reported as unavailable by the owning control rather than by the swatch.

## Styling

Style the swatch through its root slot with makeStyles and mergeClasses rather than inline styles, and keep the fill owned by the color prop so customization focuses on shape, ring and disabled treatment. The default shape is a fully rounded circle (tokens.borderRadiusCircular) or a soft square (tokens.borderRadiusMedium, tokens.borderRadiusSmall) depending on what the parent requests, and the contrast ring is drawn at tokens.strokeWidthThin, widening to tokens.strokeWidthThick when a parent paints a selection ring. Use tokens.colorNeutralStroke1, tokens.colorNeutralStroke2 or tokens.colorNeutralStrokeAccessible as borderColor values for low-contrast fills, or tokens.colorTransparentStroke when the fill already stands out. Disabled swatches render the disabledIcon slot: keep the default slash and pick a foreground that reads on top of the fill, typically tokens.colorNeutralForegroundDisabled for neutral fills. If you must change size, drive one shared class or the parent's size option so every sibling stays identical, and keep hover and focus-visible styling on the wrapper control using tokens.colorStrokeFocus2 or tokens.colorBrandStroke1 so those states remain visible in both themes.

## Performance

ColorSwatch is stateless and effect-free; it renders one root element plus at most two icon slots, so its own cost is negligible and the real cost of a color UI is the number of swatches. Palettes with hundreds of swatches should be windowed, paginated or grouped rather than rendered in one pass, because each swatch is a DOM node that the parent also has to measure and compare for selection. Declare makeStyles once at module scope and pass a stable className; calling style hooks inside a per-swatch render loop or building a new inline style object on every render defeats memoization and forces extra style recalculation. If you memoize portions of a palette, keep color, value, borderColor and disabled stable so the memo actually hits, and precompute any contrast ratios when the palette is defined rather than per render.

## Theming & Tokens

ColorSwatch consumes theme tokens for everything except the color itself. Shape and ring use metric tokens such as tokens.borderRadiusCircular, tokens.borderRadiusMedium, tokens.borderRadiusSmall, tokens.strokeWidthThin and tokens.strokeWidthThick; the disabled treatment uses neutral foreground tokens such as tokens.colorNeutralForegroundDisabled; and any contrast border you supply should come from the neutral stroke ramp (tokens.colorNeutralStroke1, tokens.colorNeutralStroke2, tokens.colorNeutralStrokeAccessible) or tokens.colorTransparentStroke. The fill is the literal string from the color prop, so it does not change between light, dark and high-contrast themes — choose colors that work in both, or pass theme-aware values when previewing theme colors. Parent components theme the surrounding states: the selected ring is drawn with brand and focus tokens such as tokens.colorBrandStroke1 and tokens.colorStrokeFocus2, and FluentProvider theme overrides flow to those tokens automatically. In forced-colors mode the OS may override the fill, which is another reason to keep a token-driven border.

## Migration Notes

ColorSwatch has no direct v8 equivalent — v8 exposed color only implicitly through ColorPicker and through hand-rolled styled elements — so teams migrating from v8 adopt a new API rather than port an existing one. When replacing a custom swatch element, remove the background-color and border CSS you wrote: pass the color string to color, move contrast borders into borderColor, and represent an unselectable option with disabled instead of a custom grey overlay. Note that both color and value are required and serve different purposes — color drives only the fill, while value drives identity — so selection code must compare the value prop rather than reading rendered styles. Any onclick, tabIndex or role that used to live on the element must move to an owning control such as SwatchPicker or a Button or ToggleButton wrapper, and shape and size overrides should move to the parent so they apply to the whole palette.

## Edge Cases

- White and near-white fills are invisible on light surfaces unless borderColor is supplied; without it the swatch looks like an empty slot.
- In a parent that tracks selection by value, duplicate values cause more than one swatch to appear selected and make deselection ambiguous.
- Disabled swatches remain in the layout and can remain in the tab order if the owning control does not remove them; a purely visual disabled treatment leaves keyboard users able to pick an unavailable color.
- The fill does not respond to theme changes, so a color that reads well in light theme can disappear in dark theme or under forced colors where backgrounds may be overridden.
- Changing borderRadius on a single swatch also changes how the contrast ring and the parent's selection ring sit relative to the color, so shape belongs to the parent or to a shared class.
- color is applied as a flat fill, so gradients, patterns and photographic options do not fit this component — use ImageSwatch for image-based options and EmptySwatch for the "no color" option.
- A swatch without an accessible name inside a selectable group is an unlabeled option; the naming must come from the owning control or from a wrapping button.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
