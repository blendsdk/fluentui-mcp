# Radio

> **Package**: `@fluentui/react-radio` v9.6.3
> **Import**: `import { Radio } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Radio is a form control that lets a user select exactly one option from a small, mutually exclusive set. Each Radio renders a native input of type "radio" plus a circular indicator and an associated label, and it is designed to be composed inside a RadioGroup, which owns the selected value and coordinates keyboard navigation across the options. A Radio declares its identity through the value prop; when the surrounding RadioGroup's value matches that value, the radio renders checked. Because the underlying input is a real native radio element, the component inherits browser-level grouping, arrow-key traversal, and form-submission semantics rather than reimplementing them. The component consists of four slots: root, label, input (the primary slot that receives all native props), and indicator, the visual circle that fills when the radio is selected.

**When to use**: Use Radio (always within a RadioGroup) when the user must pick one — and only one — option from a short, visible list where seeing every choice at once helps decision-making, such as choosing a shipping speed, a plan tier, or an answer in a form. Prefer Radio over Select or Dropdown when the option set is small (roughly two to seven items), when comparing options side by side matters, and when the extra click of opening a menu would slow the user down. Choose Checkbox instead when multiple selections are allowed or when the choice is a single independent on/off (for example, accepting terms). Choose Switch when the choice is an immediate, binary state change such as enabling a setting. For long or dynamically loaded lists, use Dropdown, Combobox, or Listbox so the options can be filtered and virtualized.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean \| undefined` | — | No | Disable this Radio item. |
| `labelPosition` | `"after" \| "below" \| undefined` | — | No | The position of the label relative to the radio indicator.  This defaults to `after` unless the Radio is inside a RadioGroup with `layout="horizontalStacked"`, in which case it defaults to `below`. |
| `onChange` | `((ev: React.ChangeEvent<HTMLInputElement>, data: RadioOnChangeData) => void) \| undefined` | — | No | Callback when this Radio is selected in its group.  **Note:** `onChange` is NOT called when this Radio is deselected. Use RadioGroup's `onChange` event to determine when the selection in the group changes. |
| `value` | `string \| undefined` | — | No | The value of the RadioGroup when this Radio item is selected. |

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `indicator` | — | Yes | A circle outline, with a filled circle icon inside when the Radio is checked. |
| `input` | — | Yes | Hidden input that handles the radio's functionality.  This is the PRIMARY slot: all native properties specified directly on `<Radio>` will be applied to this slot, except `className` and `style`, which remain on the root slot. |
| `label` | — | Yes | The Radio's label. |
| `root` | — | Yes | The root element of the Radio.  The root slot receives the `className` and `style` specified directly on the `<Radio>`. All other native props will be applied to the primary slot: `input` |

## Best Practices

### Do's

- Always render Radio items inside a RadioGroup so the group manages the selected value, the shared name, and arrow-key navigation.
- Give every Radio a unique value within its group and use those values in the group's value and defaultValue props.
- Provide an accessible name for the group itself with aria-label or aria-labelledby on the RadioGroup, since individual radios only announce their own option label.
- Use labelPosition="below" when option labels are long sentences, or when the group uses the horizontalStacked layout where it becomes the default.
- Set disabled on individual Radio items only when a specific option is temporarily unavailable — for example, an out-of-stock plan — and keep the rest of the group interactive.
- Listen to the RadioGroup onChange when you need to know about every selection change, and reserve a Radio's own onChange for side effects tied to that specific option.
- Pair the group with a Field and an InfoLabel or Label so the question text is programmatically associated with the group.

### Don'ts

- Don't use a single Radio as an on/off switch or as a lone toggle; use Switch or Checkbox instead.
- Don't expect a Radio's onChange to fire when it is deselected — it only fires when that radio becomes the selected one.
- Don't try to control a Radio with its own checked or defaultChecked prop; selection is expressed through value matching the RadioGroup value.
- Don't render unrelated questions as one giant RadioGroup; each question needs its own group with its own name and accessible name.
- Don't hide the input slot with display: none or by removing it from the DOM — it is the focusable, screen-reader-visible element that carries the semantics.
- Don't rely on color alone to communicate the checked state; the indicator fill and the native checked state must both change.
- Don't put className or style on an inner slot expecting it to affect the root; className and style always land on the root slot while other native props land on the input.

## Accessibility

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
