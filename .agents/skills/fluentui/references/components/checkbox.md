# Checkbox

> **Package**: `@fluentui/react-checkbox` v9.6.2
> **Import**: `import { Checkbox } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Checkbox is a form component that lets a user select one or more independent options, or represent a boolean/mixed state, and is exported from '@fluentui/react-components'. It renders a root slot that carries the className and style you pass to the component, a visually hidden native input slot that is the PRIMARY slot (every other native prop is forwarded to it), an indicator slot that draws the box and checkmark glyph, and an optional label slot. The checked state is tri-state: it accepts true, false, or the string "mixed" (also known as indeterminate), and the same value type is accepted by defaultChecked for uncontrolled usage. Beyond the core state props, Checkbox exposes presentation props for label placement (labelPosition), indicator shape (shape), and indicator size (size). Because the underlying control is a real input element, Checkbox participates in native form submission, focus order, and assistive-technology state reporting without extra wiring.

**When to use**: Use Checkbox when a user may select zero, one, or many options that are not mutually exclusive, such as filter facets, settings toggles that are submitted with a form, or rows in a multi-select list. Use it for a single boolean opt-in (for example an acknowledgement) when a label and an explicit confirm action are appropriate. Use the mixed state on a parent Checkbox when it summarizes a group of child checkboxes that disagree, which is the classic select-all pattern. Prefer Radio or RadioGroup when exactly one option must be chosen, Switch when the change takes effect immediately and the control reads as an on/off setting rather than a selection, and ToggleButton when the control is part of a toolbar-style command surface. Prefer InteractionTag or TagGroup when users are picking from a tokenized value list rather than toggling form fields.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `checked` | `boolean \| "mixed" \| undefined` | `false` | No | The controlled value for the checkbox. |
| `children` | `undefined` | — | No | Checkboxes don't support children. To add a label, use the `label` prop. |
| `defaultChecked` | `boolean \| "mixed" \| undefined` | — | No | Whether the checkbox should be rendered as checked by default. |
| `labelPosition` | `"before" \| "after" \| undefined` | `after` | No | The position of the label relative to the checkbox indicator. |
| `onChange` | `((ev: React.ChangeEvent<HTMLInputElement>, data: CheckboxOnChangeData) => void) \| undefined` | — | No | Callback to be called when the checked state value changes. |
| `shape` | `"square" \| "circular" \| undefined` | `square` | No | The shape of the checkbox indicator.  The `circular` variant is only recommended to be used in a tasks-style UI (checklist), since it otherwise could be confused for a `RadioItem`. |
| `size` | `"medium" \| "large" \| undefined` | `medium` | No | The size of the checkbox indicator. |

### Prop Guidance

- **checked**: Use for fully controlled checkboxes where your own state is the source of truth. Accepts true, false, or the string "mixed" to display the indeterminate look. Always pair it with onChange, otherwise the checkbox stays visually frozen when the user interacts with it. `checked={allSelected \|\| 'mixed'}`
- **defaultChecked**: Use for uncontrolled checkboxes that only need an initial value, such as static form markup or a checkbox whose value you read at submit time. It also accepts the string "mixed" to start in the indeterminate state. Never combine it with checked. `defaultChecked="mixed"`
- **onChange**: Fires with the change event and a data object carrying the new checked value; read the value from the data argument rather than from checked, because controlled updates are asynchronous. This is where you resolve mixed/select-all logic across a group of checkboxes. `onChange={(ev, data) => setChecked(data.checked)}`
- **label**: The supported way to give the checkbox visible text and an accessible name. Labels wrap when space is tight and the indicator stays aligned to the first line, so use a max width when label text is long. This prop is used instead of children. `label="Send me product updates"`
- **labelPosition**: Controls whether the label renders before or after the indicator. Leave it at the default "after" for standard Fluent layouts and switch to "before" only when the surrounding design places the control after its text. `labelPosition="before"`
- **shape**: Selects a square or circular indicator. Keep the default "square" for form checkboxes; use "circular" only in a tasks or checklist experience, because a round indicator is easily confused with a radio item. `shape="circular"`
- **size**: Chooses the medium (default) or large indicator. Use large for touch-first or sparse layouts and keep the whole group on one size so the row of controls aligns cleanly. `size="large"`
- **children**: Not supported. The type is undefined by design; passing children does not render a label. Use the label prop instead so the text is associated with the hidden input. `label="Subscribe"`
- **disabled**: A native prop forwarded to the input slot. It removes the checkbox from the tab order, blocks onChange, and applies the disabled token ramp to the box and label. Always explain why a checkbox is unavailable. `disabled`
- **required**: A native prop forwarded to the input slot. It exposes the required state to assistive technology and applies required styling to the label, but it does not validate on its own, so combine it with validation in the surrounding Field. `required`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `indicator` | — | Yes | The checkbox, with the checkmark icon as its child when checked. |
| `input` | — | Yes | Hidden input that handles the checkbox's functionality.  This is the PRIMARY slot: all native properties specified directly on `<Checkbox>` will be applied to this slot, except `className` and `style`, which remain on the root slot. |
| `label` | — | No | The Checkbox's label. |
| `root` | — | Yes | The root element of the Checkbox.  The root slot receives the `className` and `style` specified directly on the `<Checkbox>`. All other native props will be applied to the primary slot: `input` |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Checkbox } from '@fluentui/react-components';
import type { CheckboxProps } from '@fluentui/react-components';

export const Default = (props: CheckboxProps): JSXElement => <Checkbox {...props} />;
Default.argTypes = {
  label: {
    control: 'text',
    defaultValue: 'Checkbox',
    type: 'string',
  },
  checked: {
    control: {
      type: 'inline-radio',
      options: [undefined, false, true, 'mixed'],
    },
  },
  size: {
    control: {
      type: 'inline-radio',
    },
  },
  defaultChecked: {
    control: {
      type: 'inline-radio',
      options: [false, true, 'mixed'],
    },
  },
};
```

### Checked

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Checkbox } from '@fluentui/react-components';
import type { CheckboxProps } from '@fluentui/react-components';

export const Checked = (): JSXElement => {
  const [checked, setChecked] = React.useState<CheckboxProps['checked']>(true);

  return <Checkbox checked={checked} onChange={(ev, data) => setChecked(data.checked)} label="Checked" />;
};

Checked.parameters = {
  docs: {
    description: {
      story: 'A checkbox can be initially checked using `defaultChecked`, or controlled via the `checked` property.',
    },
  },
};
```

### Circular

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Checkbox } from '@fluentui/react-components';

export const Circular = (): JSXElement => <Checkbox shape="circular" label="Circular" />;
Circular.parameters = {
  docs: {
    description: {
      story:
        'A checkbox can have a circular shape.<br />' +
        '**Usage warning**: Unless you are designing a tasks experience, we strongly discourage using this styling ' +
        'variant, as it can be confused with `RadioItem`.',
    },
  },
};
```

## Best Practices

### Do's

- Always supply a visible label through the label prop so the hidden input has an accessible name; the component intentionally does not support children.
- Control the component with checked plus onChange when the checkbox state lives in parent state or must be persisted before being committed.
- Use "mixed" on a parent checkbox when its children disagree, and resolve the whole group inside the onChange handler by reading the checked value from the change data.
- Keep the default square shape for general forms and reserve shape="circular" for tasks or checklist experiences where the item reads as a to-do rather than a form field.
- Use size="large" on touch-first or low-density surfaces, and keep a single size within one logical group of checkboxes so alignment stays consistent.
- Use labelPosition="before" only when the surrounding design places controls after their text; the default "after" matches the rest of Fluent and should be your starting point.
- Use defaultChecked when you want the browser/component to own the state and you do not need to react to every change, for example inside static form markup.
- Pair a disabled Checkbox with nearby explanatory text, since a disabled control communicates nothing about why it is unavailable.
- Group related checkboxes visually and, when they form a set, wrap them in a Field or Label so the group itself gets a name and description.

### Don'ts

- Do not pass children to Checkbox; the component ignores them and expects the label prop instead.
- Do not use shape="circular" outside a tasks-style UI, because a round indicator is easily mistaken for a Radio item.
- Do not emulate a single-choice question by pairing several checkboxes with custom onChange logic that clears the others; use Radio and RadioGroup, which carry the correct semantics.
- Do not set checked and defaultChecked at the same time; mixing controlled and uncontrolled state leads to a checkbox that appears frozen or drifts from your state.
- Do not rely on the checkmark or dash glyph alone to communicate state if you have also suppressed or replaced the label text; the accessible name must describe the option.
- Do not disable a checkbox as a substitute for validation messaging; mark a required checkbox as required and surface errors through the surrounding Field.
- Do not expect className or style to reach the input element; they are applied to the root slot, while all other native props are forwarded to the input slot.
- Do not stretch a label across an unbounded width in dense layouts; labels wrap, and overly long lines hurt scanability even though alignment is preserved.

## Anti-Patterns

### Circular checkboxes used as radio buttons

❌ shape="circular" produces a round indicator that users read as single-choice selection, so a group of circular checkboxes is frequently mistaken for a radio group that allows multiple answers.

✅ Keep the default square shape for form checkboxes and reserve the circular variant for tasks-style checklists. If only one option may be selected, use Radio inside a RadioGroup instead.

### Passing children as the label

❌ Checkbox does not support children, so putting label text between the tags renders nothing and leaves the control with no accessible name.

✅ Move the text into the label prop, which renders the label slot and programmatically associates it with the hidden input.

### Controlled checkbox without a change handler

❌ Supplying checked without onChange makes the checkbox read-only from the user's perspective: clicks fire nothing, the visual state never updates, and the control appears broken.

✅ Either pair checked with onChange and update your state from the change data, or drop checked entirely and use defaultChecked for an uncontrolled checkbox.

### Hand-rolled single selection with checkboxes

❌ Clearing the other checkboxes inside onChange to fake exclusive selection produces the wrong role for screen readers and breaks the expected interaction model.

✅ Use Radio and RadioGroup for mutually exclusive choices; they expose the correct role, arrow-key behavior, and grouping semantics.

### Custom CSS that removes the focus ring or visual states

❌ Overriding the root class with outline: none or flattening the checked and mixed visuals removes the only cue keyboard users have for focus and state, failing WCAG 2.4.7 and 1.4.1.

✅ Leave the theme-driven focus stroke and compound background tokens in place, or replace them with values that still meet contrast requirements and keep a clearly visible focus indicator.

### Expecting style or className to style the input

❌ className and style are applied to the root slot while every other native prop goes to the input slot, so attempts to target the input with a className silently do nothing.

✅ Constraint layout with the root-level class or style prop, and re-theme the visual states through FluentProvider or Griffel overrides rather than trying to address the hidden input.

## Accessibility

**Requirements**: Checkbox renders a genuine native input element, so it satisfies WCAG 4.1.2 Name, Role, Value out of the box, provided you give it any accessible name or visible label. Meet WCAG 1.3.1 by ensuring each checkbox's label is programmatically associated (the component handles this when you use the label prop). Meet WCAG 2.1.1 and 2.4.7 by keeping the component in the tab order and never removing its focus indicator; the focus ring is drawn with the theme's focus stroke tokens, so do not override outline styles without providing an equivalent. Meet WCAG 1.4.1 by ensuring state is conveyed by the checkmark or mixed dash glyph, not color alone, and by keeping the built-in visual states rather than flattening them with custom CSS. Meet WCAG 1.4.3 and 1.4.11 by leaving the neutral stroke and brand compound background tokens intact, or by replacing them with colors that still reach 3:1 non-text and 4.5:1 text contrast. Meet WCAG 2.5.8 by not shrinking the indicator below the default medium and large sizes. Meet WCAG 3.3.2 by labeling or instructing on the group of checkboxes, and by marking truly required checkboxes as required so the state is programmatically exposed.

| Key | Action |
| --- | --- |
| `Space` | Toggles the checkbox between checked and unchecked when the input has focus; a mixed checkbox resolves to the next logical state through your onChange handler. |
| `Tab` | Moves focus from the previous focusable element into the checkbox input; a disabled checkbox is skipped entirely. |
| `Shift+Tab` | Moves focus out of the checkbox input back to the previous focusable element. |
| `Enter` | Does not toggle the checkbox; inside a form it behaves like the surrounding form's default submission behavior. |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-required (exposed natively through the required attribute), aria-disabled (exposed natively through the disabled attribute)

**Screen Reader**: Because the component renders a real checkbox input, screen readers announce it with the checkbox role, the accessible name taken from the label prop or an explicit aria-label/aria-labelledby, and its current state as checked, unchecked, or mixed (some screen readers say "partially checked" for the mixed state). The disabled state, the required state, and the aria-describedby hint are announced alongside the name and state. The visual indicator and checkmark glyph are decorative and are not exposed as separate elements, so there is exactly one announcement per checkbox. When several checkboxes share a group, wrap them in a labelled container so users hear the group name before the individual options.

## Styling

Pass className or style directly to Checkbox: both land on the root slot, which also owns the label-to-indicator spacing, so this is the right place for width constraints such as a maximum width that forces long labels to wrap. The indicator's visuals are driven by theme tokens rather than exposed slots, so customization is usually done by re-theming through FluentProvider or by overriding the root class with Griffel makeStyles. Useful tokens to reason about: the unchecked box is stroked with tokens.colorNeutralStrokeAccessible and darkens on hover; the checked and mixed box uses tokens.colorCompoundBrandBackground along with tokens.colorCompoundBrandBackgroundHover and tokens.colorCompoundBrandBackgroundPressed, and the glyph itself uses an inverted foreground such as tokens.colorNeutralForegroundInverted. Disabled checkboxes read from tokens.colorNeutralStrokeDisabled, tokens.colorNeutralBackgroundDisabled, and tokens.colorNeutralForegroundDisabled, so a disabled checkbox that looks wrong usually means the disabled token ramp was overridden. Focus uses tokens.colorStrokeFocus2 and tokens.colorStrokeFocus1, radii come from tokens.borderRadiusSmall in square mode and a fully rounded radius in circular mode, and label typography comes from tokens.fontSizeBase300 with the larger step for size="large". Spacing between the indicator and label is controlled with horizontal spacing tokens, so use the same tokens when you lay out a vertical group of checkboxes to keep rhythm consistent.

## Performance

Each Checkbox is cheap to render: a root, a hidden input, an indicator, and an optional label, with no portals or observers. The cost appears at scale in two places. First, controlled checkboxes re-render their owner on every toggle, so when checkboxes are generated inside a table or a long list, keep the handler stable and derive each checked value from a keyed structure rather than an array index. Second, inline style objects and freshly created callbacks on each render defeat memoization for child rows, which matters in DataGrid-style consumers. For large static forms where you never need to react to individual changes, prefer defaultChecked so React does not re-render the list at all. Avoid forcing layout with width constraints inside virtualized rows, since label wrapping changes row height and can cause scroll jumps.

## Theming & Tokens

Checkbox is fully token-driven and reacts to FluentProvider themes such as webLightTheme and webDarkTheme without any component-level changes. The unchecked indicator border uses tokens.colorNeutralStrokeAccessible, the checked and mixed fills use tokens.colorCompoundBrandBackground with tokens.colorCompoundBrandBackgroundHover and tokens.colorCompoundBrandBackgroundPressed for interaction states, and the glyph itself renders in an inverted neutral such as tokens.colorNeutralForegroundInverted so the checkmark stays legible in every theme. Disabled states read tokens.colorNeutralStrokeDisabled, tokens.colorNeutralBackgroundDisabled, and tokens.colorNeutralForegroundDisabled, which is why overriding the neutral ramp is the safest way to restyle a disabled checkbox. Focus is drawn with tokens.colorStrokeFocus1 and tokens.colorStrokeFocus2, corner rounding comes from tokens.borderRadiusSmall (or a circular radius in circular shape), and the label text uses tokens.fontSizeBase300, with the larger typography step for size="large" and the line-height tokens to keep wrapped labels aligned to the first line. Required labeling pulls from the red palette used by form controls, so required checkboxes automatically pick up brand-agnostic validation color.

## Migration Notes

Checkbox in this version is a slots-based component rather than the older single-class implementation: it now exposes root, input, indicator, and label slots, with the hidden input as the primary slot that receives all native props and the root slot receiving className and style. The tri-state value is expressed as the string "mixed" on checked and defaultChecked instead of a separate indeterminate flag. Labels are supplied through the label prop rather than children, and the component intentionally rejects children. Appearance-oriented props are now limited to labelPosition, shape, and size, with shape and size replacing older styling-driven variants.

## Edge Cases

- The mixed state is display-only from the component's point of view: a user click cannot produce "mixed". Your onChange handler must compute whether the group is all, none, or partially selected and feed that value back into checked, as in the select-all pattern.
- The value reported in the onChange data object is the new checked value after the interaction; do not assume it mirrors the pre-click mixed state, and never derive the next state from the checked prop inside the handler because controlled updates are asynchronous.
- className and style always land on the root slot, while every other native prop is forwarded to the hidden input slot. This split is the most common source of styling confusion, especially when trying to size or recolor the control directly.
- children are not supported at all, so a Checkbox written with inline text silently renders no accessible name and fails screen reader labeling.
- A long label wraps to multiple lines while the indicator stays pinned to the first line of text, so unbounded widths produce very wide click targets; constrain width explicitly in dense layouts.
- Disabled checkboxes are removed from the tab order and never fire onChange, including when they are rendered as checked or mixed, so do not rely on them for state the user must be able to inspect interactively.
- Passing checked without onChange, or both checked and defaultChecked, creates a checkbox whose visuals and your state can silently diverge.
- The required prop only adds the required attribute and required label styling; it performs no validation, so pair it with validation in the surrounding Field to avoid a form that submits an unchecked required box.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
