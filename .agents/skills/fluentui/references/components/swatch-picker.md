# SwatchPicker

> **Package**: `@fluentui/react-swatch-picker` v9.5.3
> **Import**: `import { SwatchPicker } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

SwatchPicker is a form-oriented selection control that groups visually presented swatches — color chips, gradient tiles, image tiles, or placeholders — into a single-select surface. It renders as a lightweight container (its only slot is the root) whose children are swatch components such as ColorSwatch, ImageSwatch, and EmptySwatch, and it tracks the currently chosen item by a string value. Selection can be uncontrolled through defaultSelectedValue or controlled through selectedValue, with onSelectionChange reporting both the selected value and the underlying swatch payload. Presentation is tuned by size (extra-small, small, medium, large), shape (square, rounded, circular), spacing (medium or small), and layout (row or grid), while focusMode decides whether the user moves between swatches with arrow keys or with the Tab key. Typical usage includes choosing a label or category color, picking a swatch inside a Popover, and combining color and image swatches in one grid.

**When to use**: Use SwatchPicker when the user must pick exactly one item from a small, visually distinct set — brand colors, category colors, theme accents, product images used as options — and the choices are best recognized by their appearance rather than described in text. It is the right control when the value is a color or image token that maps one-to-one with a child swatch, and when you want arrow-key navigation across a compact picker. Prefer ColorPicker (optionally inside a Popover) when the user needs to author an arbitrary color with sliders, a color area, or alpha control rather than pick from a fixed palette. Prefer a Radio group, Select, or Combobox when the options are textual and the visual preview adds no value, and prefer a Dropdown or Menu when the option list is long or must be filtered. Use layout grid together with renderSwatchPickerGrid when the palette is wider than one comfortable row.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `defaultSelectedValue` | `string \| undefined` | — | No | Default selected value |
| `focusMode` | `"arrow" \| "tab" \| undefined` | `'arrow'` | No | Sets the focus behavior for the SwatchPicker.  `arrow` This behavior will cycle through all elements inside of the SwatchPicker when pressing the Arrow key.  `tab` This behavior will cycle through all elements inside of the SwatchPicker when pressing the Tab key. |
| `layout` | `"row" \| "grid" \| undefined` | — | No | Whether SwatchPicker is row or grid |
| `onSelectionChange` | `any` | — | No | Triggers a callback when the value has been changed |
| `selectedValue` | `string \| undefined` | — | No | Controlled selected value |
| `shape` | `"rounded" \| "square" \| "circular" \| undefined` | — | No | Swatch shape |
| `size` | `"extra-small" \| "small" \| "medium" \| "large" \| undefined` | `'medium'` | No | Swatch size |
| `spacing` | `"small" \| "medium" \| undefined` | `'medium'` | No | Spacing between swatches |

### Prop Guidance

- **selectedValue**: Controlled selection. Set it to the value of the child swatch that should appear chosen and update it from onSelectionChange; if it is not updated, the highlight never moves. `00B053 (matches the value of the corresponding ColorSwatch)`
- **defaultSelectedValue**: Uncontrolled initial selection, applied only when the picker mounts. Use it for simple, self-managing palettes where the parent does not need to own the state; never combine it with selectedValue. `00B053`
- **onSelectionChange**: Single callback for every selection. The event data exposes the chosen value and the chosen swatch, so it is the right place to update controlled state, refresh a preview, or close a surrounding Popover in a choose-and-dismiss flow. `Read the selected value and selected swatch from the event data and write them into state`
- **focusMode**: Controls keyboard traversal. Arrow (the default) keeps the picker to a single tab stop and cycles focus with the arrow keys, which suits compact palettes. Tab makes every swatch its own tab stop, which is appropriate for very small sets or when a parent composite widget already claims the arrow keys. `arrow`
- **layout**: Row (default) places swatches inline; grid arranges them into multiple rows. Pair grid with renderSwatchPickerGrid and a columnCount rather than dropping plain children in, otherwise the arrangement will not be distributed as a grid. `grid`
- **size**: Sets swatch width and height for the whole picker — extra-small (20x20), small (24x24), medium (28x28, the default), and large (32x32). Choose larger sizes for touch, dense data displays, or accessibility-sensitive contexts. `large`
- **shape**: Sets the border radius of every swatch: square (default) for a precise, grid-like look, rounded for a softened rectangle, and circular for a palette-dot appearance. Match the shape used elsewhere in the surface. `circular`
- **spacing**: Sets the gap between swatches. Medium is the default and gives comfortable separation; small tightens grids so more swatches fit in the same footprint, which is useful inside Popovers. `small`
- **aria-label**: Not a design prop, but expected on the root in every documented example. It names the whole picker for assistive technology, so describe the decision (for example the palette or context) rather than repeating a swatch color. `SwatchPicker grid layout`

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

- Give the SwatchPicker itself an aria-label that describes the decision being made, such as "SwatchPicker with images" or "SwatchPicker set 2", so the group is announced with context.
- Give every child swatch its own descriptive aria-label — a human-readable color or object name like "green" or "dark blue" — because the value prop is often a raw hex string or id that reads poorly aloud.
- Reinforce naming with Tooltip using relationship="label" on each swatch when the color name is not visible elsewhere on screen; the tooltip content then becomes the accessible name.
- Keep the value of each ColorSwatch, ImageSwatch, and EmptySwatch unique across the whole picker, since the value doubles as the React key and as the selection identifier.
- Drive selection with selectedValue and onSelectionChange when the picker must do something on choose — closing a surrounding Popover, updating a preview, or committing a custom color — and set state from the event data so the highlight follows the interaction.
- Switch to layout grid with renderSwatchPickerGrid and an explicit columnCount once the palette no longer fits comfortably in a single row, and use the spacing prop to control the gap instead of custom margins.
- Pick size and shape deliberately: medium or large for touch and high-density surfaces, circular or rounded when the surrounding design language is soft, square when it is not.
- Use focusMode tab only when a surrounding composite widget already consumes arrow keys, so that arrow-based focus movement does not conflict with the parent.
- Use EmptySwatch, rendered disabled, to represent space reserved for swatches that do not exist yet in a create-your-own-palette flow, as shown in the empty swatch example.

### Don'ts

- Do not ship swatches that carry only a color without any label; an aria-label is required in every documented example precisely because an unlabeled chip is announced as a nameless button.
- Do not rely on the selected outline alone to communicate state; surface the chosen value in adjacent UI (a preview block, a text label, or a tooltip) so the selection is not communicated by color alone.
- Do not set both selectedValue and defaultSelectedValue on the same picker — mixing controlled and uncontrolled selection makes the displayed highlight unpredictable.
- Do not pass selectedValue without updating it inside onSelectionChange; the callback fires but the visible selection stays frozen, which looks like the picker is broken.
- Do not cram a large palette into the default row layout; long rows overflow their container and turn arrow navigation into a very long sequence. Use layout grid or place the picker inside a Popover.
- Do not duplicate values or key swatches by array index; custom swatches added at runtime can collide with existing values and selection will jump to the wrong chip.
- Do not wrap the picker in your own key handler that intercepts arrow keys while focusMode is arrow, and do not add extra tab stops between swatches in arrow mode.
- Do not choose extra-small or small for touch-first surfaces where the swatch is the primary interaction target; the reduced hit area makes selection error-prone.

## Anti-Patterns

### Unlabeled swatches

❌ A swatch whose only content is a color renders as a button with no accessible name. Screen reader users hear an unnamed button and cannot tell one option from another, and the value prop used internally is usually a hex string that would be meaningless if announced.

✅ Provide a descriptive aria-label on every swatch in addition to its value, and consider wrapping each swatch in a Tooltip with relationship="label" so the visual user and the screen reader user receive the same name.

### Frozen controlled selection

❌ Passing selectedValue without writing the callback result back into state means the picker fires onSelectionChange but the selected highlight never moves; the control appears unresponsive even though it is technically working.

✅ Keep the selection in state, read the selected value from the event data inside onSelectionChange, and feed it straight back into selectedValue, or drop selectedValue and use defaultSelectedValue for an uncontrolled palette.

### Mixing controlled and uncontrolled selection

❌ Supplying both selectedValue and defaultSelectedValue creates two competing sources of truth, so which swatch appears selected depends on internal mount behavior rather than on your intent.

✅ Choose one model. Use selectedValue plus onSelectionChange when the parent owns the state; use defaultSelectedValue alone when the picker manages its own selection.

### Palette crammed into one row

❌ The default row layout with a dozen or more swatches overflows its container and turns arrow traversal into a long, error-prone sequence, and in a constrained surface such as a Popover the swatches get clipped.

✅ Switch to layout grid, render the children with renderSwatchPickerGrid using an explicit columnCount, and tighten spacing to small when vertical space is limited.

### Arrow-key collision with a parent widget

❌ Using the default arrow focus mode inside a composite parent that already consumes arrow keys for its own navigation causes focus to be trapped or to skip the palette entirely.

✅ Set focusMode to tab for pickers embedded in arrow-key-driven parents, accepting a longer tab sequence in exchange for predictable traversal.

### Duplicate swatch values

❌ Values act as both the React key and the selection identifier. Duplicated or index-derived values make selection resolve to the wrong swatch and cause key collisions when swatches are added dynamically.

✅ Guarantee uniqueness across ColorSwatch, ImageSwatch, and EmptySwatch children, deriving new values from the swatch content (for example the color string) plus a suffix that cannot collide with existing entries.

## Accessibility

**Requirements**: The picker must expose an accessible name via aria-label (or a labelled container), and each swatch must have its own accessible name, typically aria-label, so users do not hear raw hex values. Selection must be conveyed by a non-color-only indicator — a token-backed outline, check, or ring — to satisfy WCAG 1.4.1 (Use of Color) and 1.4.11 (Non-text Contrast) with at least a 3:1 contrast ratio against adjacent colors. Focus must be visibly indicated for every swatch reachable by keyboard (WCAG 2.4.7), and swatches must remain fully operable from the keyboard (WCAG 2.1.1). Target size matters: medium (28x28) and large (32x32) satisfy the 24x24 minimum comfortably, while extra-small (20x20) and small (24x24) should be reserved for pointer-dense, non-touch contexts or padded with additional hit area. Disabled swatches must be identifyable both visually and programmatically and must not be selectable.

| Key | Action |
| --- | --- |
| `Tab` | When focusMode is tab, moves focus from one swatch to the next inside the picker; when focusMode is arrow (the default), Tab moves focus into the picker as a single stop and then out to the next control. |
| `Shift+Tab` | Moves focus to the previous swatch within the picker in tab focus mode, or moves focus out of the picker to the preceding control in arrow focus mode. |
| `ArrowRight and ArrowLeft` | In arrow focus mode (the default), cycles focus through the swatches in the picker; in grid layout they move focus horizontally across the current row. |
| `ArrowUp and ArrowDown` | In arrow focus mode within a grid layout, moves focus vertically between rows of swatches. |
| `Enter` | Selects the currently focused swatch and fires onSelectionChange with the newly selected value and swatch. |
| `Space` | Selects the currently focused swatch, equivalent to Enter, and fires onSelectionChange. |

**ARIA**: aria-label on the SwatchPicker root, describing the purpose of the picker, aria-label on each ColorSwatch, ImageSwatch, and EmptySwatch child, describing the swatch by name, Tooltip with relationship="label" applied to a swatch, which promotes the tooltip text to the swatch's accessible name, disabled on child swatches, which removes them from selection and is announced as unavailable, Native button semantics on each swatch, which is why focus and activation behave like a button

**Screen Reader**: Screen reader users encounter the SwatchPicker as a single labelled control group rather than as a blank canvas. They land on one swatch (in arrow focus mode) or tab through each swatch individually (in tab focus mode), and each stop announces the swatch's accessible name together with its button role and selected or disabled state. Because a swatch's visible content is usually a color or an image, the aria-label is the only thing spoken — without it the user hears an unnamed button. When a selection changes, the newly selected swatch is announced as selected and the previous one as not selected, so adjacent UI such as a preview block should also be labelled for users who cannot perceive the color change.

## Styling

Most visual tuning is done through the picker's own props rather than custom CSS: size maps to 20x20 (extra-small), 24x24 (small), 28x28 (medium, the default), and 32x32 (large) swatches; shape maps to square (default), rounded, and circular; spacing maps to a medium (default) or small gap between swatches. When you need to go further, style the children: ColorSwatch and ImageSwatch both accept className, which is how the image example sizes its swatches, and the icon example styles the icon inside a swatch. Use Griffel tokens rather than literal values so the picker follows the theme — tokens.spacingHorizontalS and tokens.spacingHorizontalM for gaps between columns, tokens.spacingVerticalS and tokens.spacingVerticalM for row gaps, tokens.borderRadiusSmall, tokens.borderRadiusMedium, and tokens.borderRadiusCircular for corner treatment, tokens.colorNeutralStroke1 or tokens.colorNeutralStroke2 for empty and unselected swatch borders, tokens.colorNeutralBackground1 and tokens.colorNeutralBackground2 for placeholder fills, and tokens.colorBrandStroke1 or tokens.colorStrokeFocus2 for the selected outline and focus ring. Custom color swatches themselves are data-driven (the color prop accepts solid values and gradient strings), so they are not themed; only their chrome, borders, and focus treatment are.

## Performance

SwatchPicker itself is a thin wrapper — the cost lives in the children, because every ColorSwatch, ImageSwatch, and EmptySwatch is an individually focusable button. Two practical consequences follow. First, keep the children list stable: build item arrays outside of render or memoize them so selection updates do not re-create every swatch and remount its DOM node. Second, prefer arrow focus mode for large palettes — it keeps the picker to a single tab stop and moves DOM focus rather than participating in the document tab order. ImageSwatch adds per-swatch network and decode cost; the image example deliberately points swatches at small thumbnails and only swaps in the full-resolution source for the currently selected item, a pattern worth repeating with sizable assets. renderSwatchPickerGrid is a plain helper that distributes a provided items array into rows, so reuse a single items array instead of regenerating it on each render.

## Theming & Tokens

Swatch geometry and spacing follow the picker's size, shape, and spacing props, and those in turn resolve through theme values, so a themed or brand-tuned Provider adjusts the palette footprint automatically. The component's own chrome — selected outline, focus ring, empty and unselected swatch borders, placeholder fills, disabled treatment — draws from Griffel tokens such as tokens.colorNeutralStroke1, tokens.colorNeutralStroke2, tokens.colorStrokeFocus2, tokens.colorBrandStroke1, tokens.colorNeutralBackground1, tokens.colorNeutralBackground2, and tokens.colorNeutralForegroundDisabled, along with radius and spacing tokens (tokens.borderRadiusSmall, tokens.borderRadiusMedium, tokens.borderRadiusCircular, tokens.spacingHorizontalS, tokens.spacingHorizontalM, tokens.spacingVerticalS, tokens.spacingVerticalM). The colors the user picks are consumer data passed through the color prop of each ColorSwatch or the src of each ImageSwatch, so they are intentionally outside the theme system. Under high contrast or brand variations, make sure the selection indicator is driven by a token-backed border or ring rather than by a tinted background so the state stays perceivable.

## Edge Cases

- defaultSelectedValue is read only at mount; changing it later has no effect, so a picker initialized without a default shows nothing selected until the user interacts.
- Selection identity is the swatch value, which must be unique across all children — a ColorSwatch, ImageSwatch, and EmptySwatch that share a value will collide for both keying and selection.
- EmptySwatch is rendered disabled and is a placeholder for not-yet-available slots, not a selectable option; it still occupies a cell in row and grid layouts, so include it when calculating columnCount.
- onSelectionChange reports both the selected value and the underlying swatch payload, but that payload differs by type: an ImageSwatch yields an image source while a ColorSwatch yields a color string or gradient, so mixed palettes need to branch on the item type before consuming the result.
- Gradients and transparency are valid color values (the variants example uses a linear-gradient string), so adjacent preview UI must be able to render them rather than assume a solid color.
- A single picker can host multiple color sets at once, as in the popover example where two SwatchPickers share one selectedValue; both will highlight the same swatch, which is usually desirable but must be intentional.
- Extra-small (20x20) and small (24x24) swatches fall below the recommended 24x24 minimum target size when used as the primary hit area without padding.
- SwatchPicker takes children rather than an items prop, so an empty children array renders an empty root with no built-in empty state — pair the picker with an EmptySwatch or its own messaging when no swatches exist.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
