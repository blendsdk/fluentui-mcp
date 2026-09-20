# SwatchPicker

> **Package**: `@fluentui/react-swatch-picker` v9.5.3
> **Import**: `import { SwatchPicker } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

SwatchPicker is a single-select color and visual swatch selection control that groups a set of swatches into one coherent choice surface. Its children are Swatch components such as ColorSwatch (solid color, gradient, icon, or initials), ImageSwatch (image-based swatches), and EmptySwatch (placeholder swatches, commonly used to reserve slots for swatches that can be added later). The picker manages selection, focus movement, size, shape, spacing, and layout so that the individual swatches stay lightweight and only describe what they render. Selection can be uncontrolled through defaultSelectedValue or controlled through selectedValue, and onSelectionChange reports the newly selected swatch value together with the corresponding color or swatch content so callers can update a preview, a theme, or persisted state. Layout can be a single row or a multi-column grid, and focus can either rove through the swatches with arrow keys or move one swatch at a time with the Tab key. Because a swatch picker is inherently visual, every picker and every swatch is expected to carry descriptive labels, and the component is commonly paired with Tooltip, Popover, and ColorPicker in real color workflows.

**When to use**: Use SwatchPicker when the user must choose exactly one option from a small, curated, mostly visual set: a theme accent color, a brand palette entry, a highlight color for a document, a background image thumbnail, or a color slot that can be reassigned. It is the right control when the options are already known and few in number and the choice is primarily recognized rather than described. Prefer ColorPicker (with ColorArea, ColorSlider, and AlphaSlider) when the user needs to pick an arbitrary color anywhere in the color space, and use SwatchPicker inside a Popover on top of a Button when palette selection should be tucked away behind a trigger. Prefer Select or Dropdown when options are described by text and color is incidental, and prefer RadioGroup when the choices need extensive explanatory copy rather than swatch tiles. Pair SwatchPicker with EmptySwatch when the palette is authored by the user and empty slots communicate that more swatches can be added.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `defaultSelectedValue` | `string \| undefined` | — | No | Default selected value |
| `focusMode` | `"arrow" \| "tab" \| undefined` | `'arrow'` | No | Sets the focus behavior for the SwatchPicker.  `arrow` This behavior will cycle through all elements inside of the SwatchPicker when pressing the Arrow key.  `tab` This behavior will cycle through all elements inside of the SwatchPicker when pressing the Tab key. |
| `layout` | `"row" \| "grid" \| undefined` | — | No | Whether SwatchPicker is row or grid |
| `onSelectionChange` | `EventHandler<SwatchPickerOnSelectionChangeData> \| undefined` | — | No | Triggers a callback when the value has been changed |
| `selectedValue` | `string \| undefined` | — | No | Controlled selected value |
| `shape` | `"rounded" \| "square" \| "circular" \| undefined` | — | No | Swatch shape |
| `size` | `"extra-small" \| "small" \| "medium" \| "large" \| undefined` | `'medium'` | No | Swatch size |
| `spacing` | `"small" \| "medium" \| undefined` | `'medium'` | No | Spacing between swatches |

### Prop Guidance

- **selectedValue**: Use for controlled selection when the selected value lives in your own state or comes from a server. Pair it with onSelectionChange so the picker can actually update, and make sure the value matches one of the children's values, otherwise nothing appears selected. `00B053`
- **defaultSelectedValue**: Use for uncontrolled selection when the picker can own its own state, for example a simple palette with a sensible initial choice. Do not combine it with selectedValue. `FF1921`
- **onSelectionChange**: Always provide this with a controlled selectedValue. The callback receives data describing the newly selected swatch, including its value for storing selection and its swatch content for updating an external preview, theme, or persisted preference. `handleSelect`
- **focusMode**: Leave at the default arrow for palette-style palettes so the whole picker is one tab stop and arrows cycle through swatches. Switch to tab only when the surrounding form is expected to give each swatch its own tab stop, which is typically appropriate for very short lists. `arrow`
- **layout**: Leave unset or set to row for a horizontal strip of swatches. Set to grid when the palette wraps into multiple columns, and render the children through renderSwatchPickerGrid with an explicit columnCount so items are distributed predictably. `grid`
- **size**: Controls swatch width and height: extra-small for dense inline palettes, small and medium for ordinary form usage, and large when swatches are the primary interaction target. Avoid extra-small where the swatch is the main target, since the 20 pixel size is under common target size guidance. `medium`
- **shape**: Use square for a classic palette tile look, rounded for a softer tile that still reads as a swatch, and circular for dot-style color pickers that pair well with avatars or small accent chips. `circular`
- **spacing**: Use medium for comfortable separation between swatches and small when the palette needs to be compact, such as inside a PopoverSurface. Increasing spacing is also the most reliable way to keep small swatches usable as targets. `small`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, SwatchPicker, ColorSwatch } from '@fluentui/react-components';
import type { SwatchPickerOnSelectEventHandler } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  const [selectedValue, setSelectedValue] = React.useState('00B053');
  const [selectedColor, setSelectedColor] = React.useState('#00B053');
  const handleSelect: SwatchPickerOnSelectEventHandler = (_, data) => {
    setSelectedValue(data.selectedValue);
    setSelectedColor(data.selectedSwatch);
  };

  const styles = useStyles();

  return (
    <>
      <SwatchPicker aria-label="SwatchPicker default" selectedValue={selectedValue} onSelectionChange={handleSelect}>
        <ColorSwatch color="#FF1921" value="FF1921" aria-label="red" />
        <ColorSwatch color="#FF7A00" value="FF7A00" aria-label="orange" />
        <ColorSwatch color="#90D057" value="90D057" aria-label="light green" />
        <ColorSwatch color="#00B053" value="00B053" aria-label="green" />
        <ColorSwatch color="#00AFED" value="00AFED" aria-label="light blue" />
        <ColorSwatch color="#006EBD" value="006EBD" aria-label="blue" />
        <ColorSwatch disabled color="#011F5E" value="011F5E" aria-label="dark blue" />
        <ColorSwatch color="#712F9E" value="712F9E" aria-label="purple" />
      </SwatchPicker>

      <div
        className={styles.example}
        style={{
          backgroundColor: selectedColor,
        }}
      />
    </>
  );
};
```

### ColorSwatchVariants

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { HeartFilled } from '@fluentui/react-icons';
import { makeStyles, ColorSwatch } from '@fluentui/react-components';

export const ColorSwatchVariants = (): JSXElement => {
  const styles = useStyles();
  return (
    <div className={styles.example}>
      <ColorSwatch color="#E3008C" value="hot-pink-color" aria-label="Hot pink" />
      <ColorSwatch color="linear-gradient(0deg, #E3008C, #fff232)" value="gradient" aria-label="Gradient yellow pink" />
      <ColorSwatch
        color="#c8eeff"
        icon={<HeartFilled color="red" className={styles.icon} />}
        value="icon"
        aria-label="heart icon"
      />
      <ColorSwatch color="#016ab0" disabled value="blue" aria-label="blue" />
      <ColorSwatch color="#ff659a" value="initials" aria-label="initials">
        A
      </ColorSwatch>
      <ColorSwatch disabled color="#c8eeff" value="light-blue" aria-label="light blue" />
    </div>
  );
};

ColorSwatchVariants.parameters = {
  docs: {
    description: {
      story: '`ColorSwatch` component can have color, gradient, icon and initials.',
    },
  },
};
```

### EmptySwatchExample

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { tinycolor } from '@ctrl/tinycolor';
import type { SwatchPickerOnSelectEventHandler, ColorPickerProps } from '@fluentui/react-components';

export const EmptySwatchExample = (): JSXElement => {
  const styles = useStyles();

  const [selectedValue, setSelectedValue] = React.useState('00B053');
  const [selectedColor, setSelectedColor] = React.useState('#00B053');
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [previewColor, setPreviewColor] = React.useState(DEFAULT_COLOR_HSV);
  const [color, setColor] = React.useState(DEFAULT_COLOR_HSV);

  const colorFocusTargetRef = React.useRef<HTMLButtonElement>(null);
  const [colorFocusTarget, setColorFocusTarget] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<Array<{ color: string; value: string; 'aria-label': string }>>(defaultItems);
  const emptyItems = new Array(ITEMS_LIMIT - items.length).fill(null);

  const handleChange: ColorPickerProps['onColorChange'] = (_, data) => {
    setPreviewColor({ ...data.color, a: data.color.a ?? 1 });
  };

  const handleSelect: SwatchPickerOnSelectEventHandler = (_, data) => {
    setSelectedValue(data.selectedValue);
    setSelectedColor(data.selectedSwatch);
  };

  const handleAddColor = () => {
    const newColor = tinycolor(color).toRgbString();
    // "value" should be unique as it's used as a key and for selection
    const newValue = `custom-${newColor} [${items.length - ITEMS_LIMIT}]`;

    setItems([...items, { color: newColor, value: newValue, 'aria-label': newColor }]);
    setColorFocusTarget(newValue);
  };

  const resetColors = () => {
    setItems(defaultItems);
    setColorFocusTarget(selectedValue);
  };

  React.useEffect(() => {
    if (colorFocusTarget) {
      colorFocusTargetRef.current?.focus();
    }
  }, [colorFocusTarget]);

  return (
    <>
      <SwatchPicker
        aria-label="SwatchPicker with empty swatches"
        selectedValue={selectedValue}
        onSelectionChange={handleSelect}
      >
        {items.map(item => (
          <ColorSwatch key={item.value} ref={item.value === colorFocusTarget ? colorFocusTargetRef : null} {...item} />
        ))}
        {emptyItems.map((_, index) => (
          <EmptySwatch disabled key={index} aria-label="empty swatch" />
        ))}
      </SwatchPicker>
      <h4>Selected swatch</h4>
      <div className={styles.selectedColor} style={{ backgroundColor: selectedColor }} />
      <Popover open={popoverOpen} trapFocus onOpenChange={(_, data) => setPopoverOpen(data.open)}>
        <PopoverTrigger disableButtonEnhancement>
          <Tooltip content="Custom color" relationship="label">
            <Button className={styles.previewButton} style={{ backgroundColor: tinycolor(color).toRgbString() }} />
          </Tooltip>
        </PopoverTrigger>

        <PopoverSurface>
          <ColorPicker color={previewColor} onColorChange={handleChange}>
            <ColorArea />
            <div className={styles.rowWrapper}>
              <div className={styles.sliders}>
                <ColorSlider />
                <AlphaSlider />
              </div>
              <div className={styles.previewColor} style={{ backgroundColor: tinycolor(previewColor).toRgbString() }} />
            </div>
          </ColorPicker>
          <div className={styles.rowWrapper}>
            <Button
              appearance="primary"
              onClick={() => {
                setColor(previewColor);
                setPopoverOpen(false);
              }}
            >
              Ok
            </Button>
            <Button
              onClick={() => {
                setPopoverOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </PopoverSurface>
      </Popover>

      <Button
        id="add-new-color"
        className={styles.button}
        appearance="primary"
        disabled={items.length >= ITEMS_LIMIT}
        onClick={handleAddColor}
      >
        Add new color
      </Button>
      <Button id="reset-example" className={styles.button} onClick={resetColors}>
        Reset example
      </Button>
    </>
  );
};

EmptySwatchExample.parameters = {
  docs: {
    description: {
      story: 'Empty swatch is used for cases where new swatches can be added.',
    },
  },
};
```

## Best Practices

### Do's

- Give the SwatchPicker root a descriptive aria-label that names the choice, such as the palette or theme the swatches belong to, because the root is the only labelled landmark the user hears when entering the control.
- Give every ColorSwatch, ImageSwatch, and EmptySwatch its own aria-label that describes the swatch in human terms (a color name, the image subject, or 'empty swatch') instead of exposing a raw hex value or an image URL.
- Choose one selection model: use selectedValue plus onSelectionChange for a controlled picker, or defaultSelectedValue alone for an uncontrolled picker, and avoid supplying both selectedValue and defaultSelectedValue at the same time.
- Keep each swatch's value unique and stable across renders, since the value both identifies the selected item and is used as the React key when mapping over a color array.
- Keep the default focusMode of arrow for palettes with more than a couple of swatches, because roving arrow-key focus keeps a single tab stop for the whole picker and matches how users expect a palette to behave.
- Switch to layout grid together with renderSwatchPickerGrid and an explicit columnCount when the palette is larger than one row or when row and column structure matters visually.
- Wrap swatches in Tooltip with relationship label when the color name may not be obvious, so pointer users get the name on hover and the same text reinforces the accessible name.
- Use EmptySwatch placeholders, typically disabled, to hold grid positions open when new swatches can be appended, so the grid keeps its column alignment as the palette grows.
- Render a preview of the current selection next to the picker (a larger color block, image, or label) so the user can confirm the effect of the choice at a glance.
- Use the size, shape, and spacing props to match the picker to the surrounding layout rather than overriding swatch dimensions with custom CSS, since these props keep the selection ring and focus ring consistent.

### Don'ts

- Don't wrap swatches in extra container elements such as divs or fragments that render DOM, because the picker expects swatch children as direct items for selection tracking, grid placement, and roving focus.
- Don't rely on color alone to communicate meaning; swatches that differ only by hue still need distinct aria-labels and, where it matters, a visible tooltip or caption.
- Don't use SwatchPicker as a general color editor; when the value can be anything in the color space, use ColorPicker with ColorArea, ColorSlider, and AlphaSlider instead of a fixed palette.
- Don't reuse the same value for two swatches, since duplicate values make selection ambiguous and produce unstable React keys.
- Don't set focusMode to tab on long palettes, because every swatch becomes a separate tab stop and keyboard users must tab through the entire palette to reach what follows it.
- Don't render the picker without any label; a bare grid of color tiles gives screen reader users no context about what is being selected.
- Don't mix swatch styling per item (custom width, custom border radius, custom gap) with the picker-level size, shape, and spacing props, because inconsistent swatch geometry breaks the selection ring and grid rhythm.
- Don't disable the whole SwatchPicker to represent 'nothing selected yet'; leave the selection empty or add a neutral placeholder swatch instead, so the control stays operable.

## Anti-Patterns

### Wrapping swatches in extra DOM containers

❌ The picker walks its swatch children to build the selectable set, place grid items, and move roving focus. Inserting wrapper divs, fragments that render elements, or intervening layout components hides the swatches from that tracking, so selection, arrow navigation, and grid columns break.

✅ Pass ColorSwatch, ImageSwatch, and EmptySwatch elements directly as children. For grid layouts, use renderSwatchPickerGrid with an items array and columnCount instead of hand-wrapping items in your own container.

### Unlabeled swatches that only communicate color

❌ A grid of unlabeled color tiles is meaningless to screen reader users and hard for anyone with low color vision, and the root picker has no visible label to fall back on. Raw hex values in aria-label are technically present but describe nothing a user can act on.

✅ Give the root an aria-label naming the choice and give every swatch an aria-label with a human-readable name such as 'light blue' or 'brand purple'. Add Tooltip with relationship label when the name should also be visible on hover.

### Unbounded color selection with a fixed palette

❌ Users who need a specific color cannot reach it from a handful of preset swatches, and the application ends up with inaccurate or second-choice values that are impossible to represent as a palette entry.

✅ Use ColorPicker with ColorArea, ColorSlider, and AlphaSlider for free-form color entry, and offer SwatchPicker as the fast path for common colors. A common pattern is a Popover containing a SwatchPicker for presets alongside a ColorPicker for custom values.

### Duplicate or unstable swatch values

❌ The value identifies the selected swatch and is also used as the React key when mapping an items array. Duplicate values make the selection ambiguous, and index-based or auto-generated keys cause the selection ring to jump to the wrong tile after the palette changes.

✅ Ensure every swatch value is unique and stable, especially when appending custom colors. Derive the new value from the color itself plus a unique suffix, and use that same value as the React key.

### Mixing controlled and uncontrolled selection

❌ Supplying selectedValue without onSelectionChange freezes the picker, while supplying both selectedValue and defaultSelectedValue mixes two sources of truth and produces inconsistent or ignored initial state.

✅ Pick one model: controlled with selectedValue plus onSelectionChange, or uncontrolled with defaultSelectedValue. When a value must persist across sessions, control the picker and store the reported value yourself.

### Per-swatch style overrides that fight the picker props

❌ Setting custom widths, radii, or gaps on individual swatches conflicts with the picker-level size, shape, and spacing props, so the focus ring, selection ring, and grid rhythm no longer line up.

✅ Drive geometry from the size, shape, and spacing props and reserve className for content-level tweaks such as constraining an ImageSwatch thumbnail, as shown in the image swatch and popover examples.

## Accessibility

**Requirements**: The SwatchPicker root must have an accessible name, normally via aria-label, because the control has no visible text label of its own. Every swatch must expose a meaningful accessible name through its own aria-label that conveys the option in words, not just a color code, since color perception varies and some users cannot perceive color at all. Selection must never be conveyed by color or outline alone; the selected swatch also needs a programmatic selected state and a visible check or border treatment. Focus indicators must remain visible against every swatch color, and interactive swatches must meet target size expectations: the extra-small size is 20 by 20 pixels, which is below the 24 by 24 CSS pixel WCAG 2.5.8 target size minimum, so use small or larger sizes, or rely on the spacing prop to keep generous separation, when the swatches are the primary target. Disabled swatches must remain perceivable as options and must not be reachable as selectable targets.

| Key | Action |
| --- | --- |
| `Arrow keys` | When focusMode is arrow (the default), pressing an arrow key cycles focus through the swatches inside the SwatchPicker without leaving the control. |
| `Tab` | Moves focus into the picker as a single tab stop in arrow mode, or advances focus from one swatch to the next when focusMode is tab. |
| `Shift+Tab` | Moves focus out of the picker in arrow mode, or back to the previous swatch when focusMode is tab. |
| `Enter` | Selects the currently focused swatch and raises onSelectionChange with the new value. |
| `Space` | Activates the focused swatch the same way as Enter, selecting it and notifying onSelectionChange. |

**ARIA**: aria-label on the SwatchPicker root, naming the palette or selection being made, aria-label on each ColorSwatch, ImageSwatch, and EmptySwatch, describing the specific option

**Screen Reader**: Assistive technology encounters the SwatchPicker as a labelled group of swatch options. As the user arrows or tabs through the swatches, each swatch is announced by its own aria-label, and the selected state is announced along with the swatch that currently holds selection, which is why labels must describe the option rather than repeat a hex value. Disabled swatches are announced as disabled and cannot be selected. Because onSelectionChange is the only selection signal exposed to the application, the surrounding UI should update any preview or status text so that sighted and non-sighted users receive the same confirmation of the change.

## Styling

Reach for the picker-level props before CSS: size sets swatch width and height (extra-small at 20px, small at 24px, medium at 28px, and large at 32px, with medium as the default), shape sets the swatch border radius (square by default, with rounded and circular available and circular corresponding to tokens.borderRadiusCircular), spacing controls the gap between swatches (medium by default, small for tighter rows), and layout switches the root between a single row and a grid. When you do need styling, target the root through className and the individual swatches through their own className, as the image swatch example does when it needs to constrain an image thumbnail. Useful Griffel tokens for custom styling include tokens.spacingHorizontalS, tokens.spacingHorizontalM, and tokens.spacingHorizontalL for gaps you manage yourself, tokens.borderRadiusSmall, tokens.borderRadiusMedium, and tokens.borderRadiusCircular for swatch geometry, tokens.colorNeutralStroke1 and tokens.colorNeutralStrokeAccessible for swatch outlines that must survive light and dark themes, tokens.colorStrokeFocus2 for focus rings drawn around a swatch, and tokens.colorNeutralForeground1 with tokens.colorNeutralBackground1 for the selected-state check overlay. Keep custom rules scoped to the picker root so that a single style block does not fight the size and shape props on every swatch.

## Performance

SwatchPicker itself is lightweight; the cost lives in the number of swatches and how the child list is produced. Memoize the mapped swatch array and keep values stable so React can reuse swatch elements instead of recreating them on every parent render, and avoid regenerating objects for each swatch inline if the palette is large or the parent re-renders often. Wrap onSelectionChange in a stable callback when the picker sits inside a frequently re-rendering surface such as a Popover or a color editing panel, since a new handler identity each render forces the picker to update. When appending user-created colors, append to a memoized items array rather than reshaping the entire palette, and let grid layouts go through renderSwatchPickerGrid so column placement is computed once from the items array. Keep the number of rendered swatches reasonable for the size chosen; a very large grid of large swatches is both a visual and a rendering burden, and a Popover presentation with grouped sets keeps the initial surface small.

## Theming & Tokens

SwatchPicker inherits everything from the nearest FluentProvider theme, so its swatch borders, focus rings, and selected-state overlay restyle automatically between light, dark, and high-contrast themes. Focus and selection indicators are drawn from stroke and neutral tokens such as tokens.colorStrokeFocus2, tokens.colorNeutralStroke1, and tokens.colorNeutralStrokeAccessible, while the selected check overlay typically inverts against the swatch using tokens.colorNeutralForeground1 and tokens.colorNeutralBackground1. Spacing between swatches follows the theme spacing scale, and swatch geometry leans on radius tokens including tokens.borderRadiusSmall, tokens.borderRadiusMedium, and tokens.borderRadiusCircular for the corresponding shape values. The color values themselves are author-supplied, so they do not respond to theme changes; when the palette must stay legible in both themes, choose colors that contrast with tokens.colorNeutralBackground1 and let tokens.colorNeutralStrokeAccessible draw the outline. If a swatch must represent a brand or status concept rather than a literal color, drive it with the corresponding color tokens such as tokens.colorBrandBackground, tokens.colorPaletteRedBackground3, or tokens.colorStatusDangerBackground3 so it tracks the theme.

## Migration Notes

SwatchPicker is a v9-only color selection control and has no direct Fluent UI v8 equivalent, so teams coming from hand-rolled grids of colored buttons or from third-party palette widgets should map their existing item list onto ColorSwatch, ImageSwatch, and EmptySwatch children and let SwatchPicker own selection, sizing, shape, and spacing. The selection contract is value-based: each swatch carries a value that is echoed back through onSelectionChange and compared against selectedValue or defaultSelectedValue, and the callback data also exposes the selected swatch's color, which the examples use to drive an external preview. If you previously managed focus with your own roving tabindex implementation, delete it and use focusMode arrow, which is the default, or focusMode tab for the opposite behavior. If your old implementation rendered arbitrary swatch markup, move to the provided swatch components or to renderSwatchPickerGrid for grid layouts, since the picker expects swatch children rather than generic elements.

## Edge Cases

- If selectedValue or defaultSelectedValue does not match any child's value, no swatch renders as selected; keep the stored value synchronized with the palette, and reset it when the palette changes.
- Extra-small swatches are only 20 by 20 pixels, which falls below common minimum target size guidance, so increase size or spacing when swatches are the primary interaction target or are used on touch devices.
- Grid layout only looks correct when the children are produced by renderSwatchPickerGrid with an explicit columnCount; adding items directly to a grid picker without that helper places them in a single implicit flow rather than the intended columns.
- EmptySwatch placeholders are usually rendered as disabled so they are not selectable; if you make them interactive instead, give each one a distinct aria-label so users can tell the slots apart.
- Focus mode tab turns every swatch into its own tab stop, so a palette with many colors makes everything after the picker difficult to reach with the keyboard; this is the main reason arrow remains the default.
- Swatch values must stay unique when users add custom colors at runtime, because the same value drives selection, React keys, and focus restoration after a new swatch is appended.
- When the picker is placed inside a PopoverSurface, closing the popover on selection is a common pattern, but the trigger button should keep a visible indication of the current selection so users can see what they chose after the surface is dismissed.
- Disabled swatches remain part of the visual palette and shift grid positions, so keep disabled entries in the items array rather than filtering them out if the layout is expected to stay stable.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
