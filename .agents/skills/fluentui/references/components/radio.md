# Radio

> **Package**: `@fluentui/react-radio` v9.6.3
> **Import**: `import { Radio } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Radio is a single item within a mutually exclusive set of choices, rendered as a visually styled circle with an optional label. Each Radio renders a hidden native input that carries the actual selection semantics, an indicator slot that draws the circle (filled when checked), and a label slot that can hold plain text or rich formatted content. Radio is designed to be composed inside RadioGroup, which owns the selection value, the layout (horizontal, horizontal-stacked, or the default vertical stack), and the shared disabled and required state. Individual Radio items only expose value, labelPosition, disabled, and onChange, so selection state is read from and written to the surrounding group rather than to each item. The label slot accepts any React content, which allows subtext, line breaks, and Text-based annotations inside an option. Radio is a form-oriented control: it is typically wrapped by Field so that the group receives a visible label, required indicator, hint, and validation message, as shown throughout the documented examples.

**When to use**: Use Radio when a user must pick exactly one option from a small, visible set of mutually exclusive choices (roughly two to seven items) and seeing all options at once helps comparison, such as choosing a favorite fruit, a shipping speed, or a plan tier. Use RadioGroup to host those items and Field to label the group. Prefer Checkbox when options are independent and multiple selections are allowed; prefer Switch when a single on/off setting applies immediately without a submit step; prefer Select, Combobox, or a dropdown-style control when the option list is long, dynamic, or space-constrained; and prefer a segmented control or tab-like pattern when the choice is really a view switch rather than a form value. Radio is also the right choice when a selection must be submitted with a form, since each item is backed by a native input whose value participates in form submission.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean \| undefined` | — | No | Disable this Radio item. |
| `labelPosition` | `"after" \| "below" \| undefined` | — | No | The position of the label relative to the radio indicator.  This defaults to `after` unless the Radio is inside a RadioGroup with `layout="horizontalStacked"`, in which case it defaults to `below`. |
| `onChange` | `((ev: React.ChangeEvent<HTMLInputElement>, data: RadioOnChangeData) => void) \| undefined` | — | No | Callback when this Radio is selected in its group.  **Note:** `onChange` is NOT called when this Radio is deselected. Use RadioGroup's `onChange` event to determine when the selection in the group changes. |
| `value` | `string \| undefined` | — | No | The value of the RadioGroup when this Radio item is selected. |

### Prop Guidance

- **value**: The string identifier for this option, used by the owning RadioGroup to determine which item is selected. Always set a unique, stable value on each Radio in a group; omitting it falls back to the browser's default input value and makes controlled selection unreliable. `banana`
- **labelPosition**: Controls whether the label renders after the indicator or below it. It defaults to after, except inside a RadioGroup with the horizontal-stacked layout where it defaults to below. Set it explicitly when you need a specific placement regardless of the group's layout, and keep it consistent across items in a group so rows stay aligned. `below`
- **disabled**: Disables only this Radio item, preventing selection and removing it from the group's arrow-key navigation. Use it for a single unavailable option; when the whole choice is unavailable, disable the RadioGroup instead so the intent is clearer and screen readers announce the whole set as unavailable. `disabled on the item labeled Banana`
- **onChange**: Callback fired when this specific Radio becomes the selected item in its group; it receives the change event and a RadioOnChangeData payload. It is not called when the item is deselected, so never use it to detect clearing a selection. Use RadioGroup onChange when you need to know the group's current value, and use the per-item handler for analytics or option-specific side effects. `capture which option the user picked for telemetry while the group's onChange stores the value`
- **label**: The label slot content for the option. It accepts plain text or rich React content, so you can include line breaks and a smaller Text element as subtext to explain an option. Keep it descriptive of the choice itself rather than restating the group's label, and never leave it empty. `Apple with a secondary line of clarifying text`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `indicator` | — | Yes | A circle outline, with a filled circle icon inside when the Radio is checked. |
| `input` | — | Yes | Hidden input that handles the radio's functionality.  This is the PRIMARY slot: all native properties specified directly on `<Radio>` will be applied to this slot, except `className` and `style`, which remain on the root slot. |
| `label` | — | Yes | The Radio's label. |
| `root` | — | Yes | The root element of the Radio.  The root slot receives the `className` and `style` specified directly on the `<Radio>`. All other native props will be applied to the primary slot: `input` |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import type { RadioGroupProps } from '@fluentui/react-components';
import { Field, Radio, RadioGroup } from '@fluentui/react-components';

export const Default = (props: Partial<RadioGroupProps>): JSXElement => (
  <Field label="Favorite Fruit">
    <RadioGroup {...props}>
      <Radio value="apple" label="Apple" />
      <Radio value="pear" label="Pear" />
      <Radio value="banana" label="Banana" />
      <Radio value="orange" label="Orange" />
    </RadioGroup>
  </Field>
);
```

### ControlledValue

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Field, Radio, RadioGroup, Button } from '@fluentui/react-components';

export const ControlledValue = (): JSXElement => {
  const [value, setValue] = React.useState('banana');
  return (
    <>
      <Field label="Favorite Fruit">
        <RadioGroup value={value} onChange={(_, data) => setValue(data.value)}>
          <Radio value="apple" label="Apple" />
          <Radio value="pear" label="Pear" />
          <Radio value="banana" label="Banana" />
          <Radio value="orange" label="Orange" />
        </RadioGroup>
      </Field>
      <Button disabledFocusable={!value} onClick={() => setValue('')}>
        Clear selection
      </Button>
    </>
  );
};

ControlledValue.parameters = {
  docs: {
    description: {
      story: 'The selected radio item can be controlled using the `value` and `onChange` props.',
    },
  },
};
```

### DefaultValue

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Field, Radio, RadioGroup } from '@fluentui/react-components';

export const DefaultValue = (): JSXElement => (
  <Field label="Favorite Fruit">
    <RadioGroup defaultValue="pear">
      <Radio value="apple" label="Apple" />
      <Radio value="pear" label="Pear" />
      <Radio value="banana" label="Banana" />
      <Radio value="orange" label="Orange" />
    </RadioGroup>
  </Field>
);

DefaultValue.parameters = {
  docs: {
    description: {
      story:
        'The initially selected item can be set by setting the `defaultValue` of RadioGroup. ' +
        'Alternatively, one Radio item can have `defaultChecked` set. ' +
        'Both methods have the same effect, but only one should be used in a given RadioGroup.',
    },
  },
};
```

## Best Practices

### Do's

- Always render Radio items inside a RadioGroup so selection, layout, arrow-key navigation, and disabled or required state are coordinated by the group.
- Give every Radio a unique, stable string value within its group; a stable value keeps controlled RadioGroup state valid across re-renders.
- Supply a descriptive label for every item through the label slot, and give the whole group a visible label by wrapping the RadioGroup in a Field.
- Use RadioGroup defaultValue (or defaultChecked on one item) to set the initial selection in uncontrolled usage, then read the result from RadioGroup onChange.
- Use the ControlledValue pattern when you need to clear or programmatically set the selection: hold the value in React state, pass it to RadioGroup value, and update it from RadioGroup onChange.
- Disable the entire RadioGroup with its disabled prop when a section is unavailable, and reserve the Radio-level disabled prop for a single temporarily unavailable option.
- Use the label slot with formatted content (for example a line break plus a smaller Text element) to explain an option without turning the label into a paragraph.

### Don'ts

- Do not treat Radio as a standalone boolean control; without a RadioGroup the items are not coordinated and the mutual exclusivity the user expects is not expressed.
- Do not use Radio for multiple-selection scenarios; use Checkbox so users are not misled into thinking only one answer is allowed.
- Do not use Radio for an immediate on/off setting; use Switch, which communicates that toggling takes effect right away.
- Do not expect Radio onChange to fire when an item is deselected; it is only called when that item becomes the selected one, so listen to RadioGroup onChange for selection changes.
- Do not set both defaultValue on the group and defaultChecked on an item in the same RadioGroup; choose a single method for the initial value.
- Do not use Radio for long, searchable, or remote-loaded option lists; use Select, Combobox, or a similar control instead of rendering dozens of radios.
- Do not try to position or theme the indicator by targeting the input element; the input is a hidden element and the visible circle lives in the indicator slot while className and style land on the root slot.

## Anti-Patterns

### Rendering radios without a RadioGroup

❌ Mutual exclusivity, layout, shared disabled and required state, and arrow-key navigation within the set all come from RadioGroup. Standalone Radio items look like a group but do not behave like one, and they are not tied to a single controlled value.

✅ Always render Radio items as children of a RadioGroup, and wrap that group in a Field to supply the group label, required indicator, and validation message.

### Using Radio onChange to detect deselection

❌ The documented behavior is that Radio onChange is not called when the item is deselected, so logic such as clearing a dependent field or resetting state silently never runs when the user switches to a different option.

✅ Listen to RadioGroup onChange to observe the group's value changing, and keep the selected value in React state if you need to react to it (the ControlledValue example clears the selection this way).

### Mixing two initial-value mechanisms

❌ Setting defaultValue on the RadioGroup and defaultChecked on one of its items creates two competing sources of truth for the uncontrolled initial selection, which leads to confusing or inconsistent first render behavior.

✅ Pick one approach per group: defaultValue on the RadioGroup or defaultChecked on exactly one Radio, never both.

### Overriding indicator colors with hard-coded values

❌ Hard-coded hex or rgb values on the indicator and label break theme switching, dark mode, and high-contrast modes, and can drop below contrast requirements for the selected and unselected states.

✅ Style through Griffel tokens such as tokens.colorNeutralStrokeAccessible, tokens.colorCompoundBrandForeground1, and the corresponding Hover and Pressed variants so the control follows the active theme.

### Using Radio for a long or dynamic option list

❌ Rendering dozens of radios makes the layout tall, forces users to scan every option, and pushes arrow-key navigation through a very long list, which is slow and hard to review.

✅ Use Select, Combobox, or another list-style control when the set of options is large, searchable, or loaded from a remote source, and reserve radios for short, fixed, visible choices.

## Accessibility

**Requirements**: Provide a programmatic and visible label for both the group and every individual option: the group label normally comes from Field, and each option label comes from the label slot. Required groups should be marked with the required indicator so users know a choice must be made. Disabled items must be conveyed by more than color alone, and text and indicator borders must meet WCAG contrast minimums (4.5:1 for label text, 3:1 for the indicator and focus ring). Focus must remain clearly visible on the selected or focused radio (WCAG 2.4.7), targets should be large enough to activate reliably (WCAG 2.5.8), and all selection must be operable by keyboard alone (WCAG 2.1.1).

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the radio group, landing on the selected radio or, when nothing is selected, the first enabled radio in the group. |
| `Space` | Selects the currently focused radio item. |
| `ArrowDown` | Moves focus to the next radio in the group and selects it, wrapping to the first item at the end. |
| `ArrowRight` | Moves focus to the next radio in the group and selects it, wrapping to the first item at the end. |
| `ArrowUp` | Moves focus to the previous radio in the group and selects it, wrapping to the last item at the beginning. |
| `ArrowLeft` | Moves focus to the previous radio in the group and selects it, wrapping to the last item at the beginning. |
| `Shift+Tab` | Moves focus out of the group to the previous focusable element in the tab order. |

**ARIA**: role="radio" (provided by the underlying native radio input in the input slot), role="radiogroup" on the grouping element created by RadioGroup, aria-labelledby, wiring the group to the label supplied by Field, aria-describedby, wiring the group or item to hint and validation text from Field, aria-required / the native required attribute, applied to the group when the Field or RadioGroup is required, aria-invalid, applied when a required group has no selection and validation is surfaced, aria-disabled, used alongside the native disabled attribute so disabled state is announced reliably

**Screen Reader**: A screen reader announces the group label followed by each option as a radio button with its label text, its checked or unchecked state, and its position within the set (for example, checked, 2 of 4). The decorative indicator circle is not announced separately, so all meaning must live in the label slot and the surrounding Field label. Disabled items are announced as dimmed or unavailable and are skipped by the group's arrow-key navigation, and required groups are announced as required. Because the visible circle is purely presentational, never rely on it alone to convey selection, and always provide label text rather than an icon-only option.

## Styling

Radio styling is expressed through Griffel classes and theme tokens rather than raw colors. The unchecked indicator border uses tokens.colorNeutralStrokeAccessible, with tokens.colorNeutralStrokeAccessibleHover and tokens.colorNeutralStrokeAccessiblePressed for interaction states; the checked filled dot uses tokens.colorCompoundBrandForeground1 with tokens.colorCompoundBrandForeground1Hover and tokens.colorCompoundBrandForeground1Pressed. Label text uses tokens.colorNeutralForeground1, subtext inside the label commonly uses tokens.colorNeutralForeground2 or a smaller Text size such as 200, and disabled items drop to tokens.colorNeutralForegroundDisabled and tokens.colorNeutralStrokeDisabled. Spacing between the indicator and the label follows tokens.spacingHorizontalS, and the circle radius is kept round via tokens.borderRadiusCircular. The focus ring relies on the standard focus token-driven outline, so avoid overriding outline styles. Remember that className and style passed to Radio are applied to the root slot, while all other native attributes are forwarded to the hidden input slot, so target root with your custom classes.

## Performance

Radio is a lightweight control: each item renders a root wrapper, a hidden native input, an indicator, and a label, so cost scales with the number of items you render rather than with any internal state machine. Keep groups short so arrow-key navigation and rendering stay cheap, and avoid expensive work inside the label slot, since label content is rendered for every item on every render. Prefer a single controlled value on RadioGroup over per-item state, and keep option values and option arrays stable (module-level constants rather than values recomputed inline each render) so items are not forced to re-render unnecessarily. Pass stable handler references from RadioGroup rather than creating a new inline handler for each Radio when the group is large.

## Theming & Tokens

Radio reads its colors, spacing, and typography from the Fluent theme through Griffel tokens, so it adapts automatically to brand and scheme changes. The unchecked indicator ring uses tokens.colorNeutralStrokeAccessible with tokens.colorNeutralStrokeAccessibleHover and tokens.colorNeutralStrokeAccessiblePressed, while the checked filled dot uses tokens.colorCompoundBrandForeground1 with tokens.colorCompoundBrandForeground1Hover and tokens.colorCompoundBrandForeground1Pressed. Label text maps to tokens.colorNeutralForeground1, secondary label text commonly uses tokens.colorNeutralForeground2 with tokens.fontSizeBase200, and disabled items use tokens.colorNeutralForegroundDisabled with tokens.colorNeutralStrokeDisabled. Spacing between indicator and label derives from tokens.spacingHorizontalS and tokens.spacingVerticalXS, the circle radius follows tokens.borderRadiusCircular, and the focus outline uses the shared focus token set, so prefer Provider-level theming or token overrides rather than component-level color overrides.

## Migration Notes

In v9 the selection contract is group-centric: a Radio exposes value, labelPosition, disabled, and onChange, while the selected value is owned by RadioGroup through its value prop for controlled usage or defaultValue and defaultChecked for uncontrolled usage, as illustrated by the ControlledValue and DefaultValue stories. Code carried over from earlier versions that attempted to read or write selection on the individual item should be refactored so the group holds the value and individual onChange handlers are reserved for per-option side effects. Label content, including rich subtext, is now supplied through the label slot, and wrapping the group in Field replaces manually wiring group labels, required indicators, hint text, and validation messages. Styling should move to Griffel tokens and the root, label, input, and indicator slots instead of overriding the underlying input or indicator markup directly.

## Edge Cases

- The labelPosition default is contextual: it is after in most layouts but becomes below inside a horizontal-stacked RadioGroup, so if your design depends on a specific placement, set labelPosition explicitly rather than relying on the default.
- Radio onChange fires only when the item becomes selected, so clearing a selection (for example with a Clear selection button) will not notify the individual Radio items; observe the value on RadioGroup instead.
- The value prop is a string and can be undefined; because an empty string is indistinguishable from an unset value in many controlled flows, use meaningful sentinel values rather than empty strings when you need an explicit none option.
- className and style passed to Radio stay on the root slot while all other native attributes are forwarded to the hidden input slot, so attempting to restyle via the input or to read attributes from the root will not behave as expected.
- Radio items rendered outside a RadioGroup are not coordinated by the component, so grouping, layout, and shared disabled or required behavior must come from a RadioGroup wrapper (with a Field label) in normal usage.
- A disabled item is skipped by the group's arrow-key navigation, so make sure validation logic does not assume that a disabled option can ever become the selected value.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
