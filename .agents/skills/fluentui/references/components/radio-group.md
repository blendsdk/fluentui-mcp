# RadioGroup

> **Package**: `@fluentui/react-radio` v9.6.3
> **Import**: `import { RadioGroup } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

RadioGroup is the form component that binds a set of Radio items into a single mutually-exclusive choice, where selecting one option automatically deselects the others. It renders a single root element that acts as the grouping container and shares state with every Radio child: a common name (auto-generated when the name prop is omitted) ties the radios into one native radio family, the layout prop arranges them vertically, horizontally, or horizontally with stacked labels, and the disabled and required props are forwarded to all children. Selection can be uncontrolled through defaultValue, or fully controlled through value plus onChange, whose second argument carries a RadioGroupOnChangeData object exposing the newly selected value. Because the group owns the selection state, RadioGroup is the recommended way to build single-choice questionnaires, preference pickers, plan/option pickers, and any small set of options that should all remain visible at once. It is typically wrapped in a Field, which supplies the visible group label, the required indicator, and validation messaging.

**When to use**: Use RadioGroup when the user must choose exactly one option from a short, fixed list (roughly two to seven choices) and it is useful to see every option at once without opening a menu. It is the right choice for preference settings, survey answers, shipping-speed or plan selections, and any mutually-exclusive decision where comparing options side by side matters. Prefer Dropdown, Select, or Combobox when the option list is long, when options are dynamic or remotely loaded, or when vertical space is scarce. Use Checkbox when more than one option may be selected, Switch when a single boolean setting is toggled on or off (radio semantics imply a choice among alternatives, not an on/off state), and Slider or SpinButton when the choice is a continuous numeric value. RadioGroup should generally be wrapped in a Field so the group receives a visible label and consistent required/validation treatment.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `defaultValue` | `string \| undefined` | — | No | The default selected Radio item in this group.  This should be the `value` prop of one of the Radio items inside this group. |
| `disabled` | `boolean \| undefined` | — | No | Disable all Radio items in this group. |
| `layout` | `"vertical" \| "horizontal" \| "horizontal-stacked" \| undefined` | `vertical` | No | How the radio items are laid out in the group. |
| `name` | `string \| undefined` | — | No | The name of this radio group. This name is applied to all Radio items inside this group.  If no name is provided, one will be generated so that all of the Radio items have the same name. |
| `onChange` | `((ev: React.FormEvent<HTMLDivElement>, data: RadioGroupOnChangeData) => void) \| undefined` | — | No | Callback when the selected Radio item changes. |
| `required` | `boolean \| undefined` | — | No | Require a selection in this group. Adds the `required` prop to all child Radio items. |
| `value` | `string \| undefined` | — | No | The selected Radio item in this group.  This should be the `value` prop of one of the Radio items inside this group. |

### Prop Guidance

- **name**: Sets the shared name applied to every Radio child, which is what makes the radios function as one native group. Provide an explicit, unique name when the group participates in native form submission or when multiple groups live in the same form; omit it and a unique name is generated automatically for you. `favorite-fruit`
- **value**: Use for a controlled group: the string must equal the value prop of the currently selected Radio child. Pair it with onChange to update your own state, and set it to an empty string to programmatically clear the selection. `banana`
- **defaultValue**: Use for an uncontrolled group where you only care about the initial selection. Set it to the value of the Radio that should start selected, and do not also set defaultChecked on any child. `pear`
- **onChange**: Fires whenever the user selects a different option. The second argument is a RadioGroupOnChangeData object whose value field contains the newly selected Radio's value, which is what you store in state for controlled groups or use for side effects. `(ev, data) => setValue(data.value)`
- **layout**: Controls how the options are arranged. Keep the default vertical for multi-line or longer labels, choose horizontal for a compact row of short labels, and choose horizontal-stacked when items should sit side by side but their labels still need to wrap below the indicator. `horizontal-stacked`
- **disabled**: Disables every Radio in the group at once, preventing both keyboard and pointer interaction while preserving the displayed selection. Use it when the whole question is temporarily unavailable, such as while a dependent form section is locked. `true`
- **required**: Marks the group as requiring a selection by forwarding the required prop to all child radios. It is usually preferable to set required on the surrounding Field so the label also displays the required indicator; a RadioGroup inside a required Field inherits that state. `true`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | The radio group root. |

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

- Wrap the RadioGroup in a Field with a descriptive label so the group has an accessible name that screen readers announce once for the whole set.
- Give each Radio child a stable, machine-readable value string and a human-readable label; the group's defaultValue and value props must match the value of one of those children.
- Choose one state model per group: use defaultValue for an uncontrolled group or value with onChange for a controlled one, and never both in the same group.
- Keep the default vertical layout for options with longer labels or multi-line content; switch to layout="horizontal" for short labels such as Yes/No or Low/Medium/High.
- Use the group-level disabled prop when the entire choice is temporarily unavailable, and reserve a child-level disabled on Radio for a single unavailable option.
- Read the selection from the onChange data object's value field rather than tracking checked state on individual Radio children.
- Provide a sensible defaultValue when one option is clearly the common case, so the user is not blocked by an unfilled required field.
- Order options logically (by likelihood, progression, or alphabetically) and keep the list short enough that all items are visible at once.

### Don'ts

- Don't use RadioGroup for multi-select scenarios; every selection replaces the previous one, so use Checkbox or a TagPicker when multiple answers are valid.
- Don't combine defaultValue on the group with defaultChecked on an individual Radio child; both set the initial selection and mixing them produces ambiguous behavior.
- Don't pass a value or defaultValue that does not correspond to any Radio child's value, since the group will render with nothing selected.
- Don't control the checked state of individual Radio children directly; drive the whole selection through the group's value and onChange pair.
- Don't reuse the same name across two RadioGroups in the same form, and don't nest a RadioGroup inside another RadioGroup.
- Don't use layout="horizontal" with long or wrapping labels, because the items will crowd or overflow their container.
- Don't render the group without any label or accessible name; an unlabeled radio group gives screen reader users no context for the options.
- Don't place arbitrary non-Radio content among the Radio children, as it disrupts reading order and the group's expected structure.

## Anti-Patterns

### Using RadioGroup for multi-select choices

❌ A radio group can only hold one value at a time, so users who need to pick several options will constantly lose their previous selections, and the onChange payload only reports a single value.

✅ Use Checkbox or a TagPicker for multi-select input, and reserve RadioGroup for genuinely mutually-exclusive decisions.

### Mixing defaultValue with a child's defaultChecked

❌ Both mechanisms specify the initially selected option, and combining them in one group makes the starting state ambiguous and dependent on internal ordering rather than your intent.

✅ Choose a single source of truth: set defaultValue on the RadioGroup for uncontrolled usage, or set defaultChecked on exactly one Radio child, never both.

### Passing a value that no Radio matches

❌ If value or defaultValue does not equal any child's value, the group renders with no option selected, which is especially confusing in a required field where the user sees an empty answer with no error shown.

✅ Keep the group's value and defaultValue aligned with the exact value strings of the Radio children, and clear selection deliberately with an empty string only when a cleared state is genuinely valid.

### Rendering an unlabeled radio group

❌ Without a label, screen reader users hear a series of radio buttons with no question context, and required or validation state cannot be conveyed meaningfully.

✅ Wrap the RadioGroup in a Field with a clear label, or supply an explicit aria-label if no visible label is acceptable.

### Dumping a long list of options into a RadioGroup

❌ Radio groups are designed for short, fully visible option sets; long lists consume vertical space, force excessive tab/arrow navigation, and make horizontal layouts overflow their container.

✅ Switch to Dropdown, Select, or Combobox when the option count grows large or the options are dynamic, and keep RadioGroup for a small set of comparable choices.

## Accessibility

**Requirements**: RadioGroup must always have an accessible name; the standard approach is to nest it inside a Field whose label is rendered and programmatically associated with the group, or to supply an explicit aria-label when no visible label is appropriate. The group must convey its required state, preferably through Field's required support or the RadioGroup required prop, and any validation error must be exposed through Field's message rather than color alone. Every Radio child needs a discernible text label, and the selected state must be conveyed programmatically (which it is, natively). Text and indicator colors must meet WCAG 2.1 AA contrast in default, hover, focus, and disabled states, focus must always be visibly indicated, and the entire group must remain reachable and operable using only the keyboard.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the group, landing on the selected radio (or the first enabled radio if nothing is selected), since the group participates in the page tab sequence as a single stop. |
| `Shift+Tab` | Moves focus out of the group backwards, or into the group from the following element. |
| `ArrowDown` | Moves focus to the next radio in vertical layout and selects it, wrapping from the last enabled item to the first. |
| `ArrowRight` | Moves focus to the next radio in horizontal layout and selects it. |
| `ArrowUp` | Moves focus to the previous radio and selects it, wrapping from the first enabled item to the last. |
| `ArrowLeft` | Moves focus to the previous radio in horizontal layout and selects it. |
| `Space` | Selects the currently focused Radio if it is not already selected. |
| `Enter` | Does not change the radio selection; in a form it activates the default submit behavior, which is standard radio behavior you should not fight. |

**ARIA**: role="radiogroup" on the root slot element, aria-labelledby (set by Field to associate the group with its visible label), aria-label (for groups that have no visible label), aria-required (exposed when the required prop is set or inherited from Field), aria-disabled (alongside the native disabled attribute when the group is disabled), aria-invalid and aria-describedby (applied through Field to associate validation messages with the group)

**Screen Reader**: Screen readers announce the group as a radio group with its accessible name before reading the options, so users hear the question once rather than on every item. Each Radio is then announced with its label, the radio button role, its position within the set (for example, "2 of 4"), and its checked or unchecked state. Because arrow keys move focus and change selection simultaneously, screen reader users hear the newly selected option announced as focus moves. Disabled items are announced as unavailable, and disabled groups are typically skipped or announced as dimmed depending on the screen reader. When the group is required, assistive technology reports the required state when the group is entered.

## Styling

Most visual customization happens on the Radio children rather than on the group, but RadioGroup itself accepts className and styling through its root slot. Use the layout prop instead of overriding flex direction in CSS: vertical (the default) stacks items with spacing between them, horizontal places items in a row, and horizontal-stacked places labels below the indicators. If you need to fine-tune spacing, target the group root with Griffel tokens such as tokens.spacingVerticalXS, tokens.spacingVerticalS, tokens.spacingHorizontalS, and tokens.spacingHorizontalL for the gaps between stacked or in-line items. Typography for the option labels is controlled by the Radio children and can use tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.colorNeutralForeground1, with tokens.colorNeutralForegroundDisabled for unavailable options. Focus styling on the radio indicators typically relies on tokens.colorStrokeFocus2 and tokens.colorStrokeFocus1, and the checked indicator uses brand tokens such as tokens.colorCompoundBrandBackground and tokens.colorCompoundBrandStroke, so aligned theming is usually enough without hand-written CSS.

## Performance

RadioGroup shares name, disabled, and required state with its Radio children, so a change in the group's own props re-renders the whole option subtree; keep the number of rendered Radio items small, since groups are intended for short lists. For uncontrolled groups, selection changes are handled natively by the browser and do not require a React re-render, whereas controlled groups re-render on every selection through the value and onChange pair, so keep the onChange handler lightweight and avoid recreating large child trees on each change. Define the Radio children statically or memoize them rather than building them from inline arrays inside the render body, and avoid embedding expensive components inside a Radio label, since that content is part of the group's render path. If options must be generated dynamically, compute the list once outside of hot render paths and use stable values so React can reconcile items by identity.

## Theming & Tokens

RadioGroup and its Radio children read their visuals from the Fluent theme provided by FluentProvider, so switching themes updates colors, spacing, and typography without component changes. Layout spacing between options derives from spacing tokens such as tokens.spacingVerticalXS, tokens.spacingVerticalS, and tokens.spacingHorizontalL, while label text uses tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.colorNeutralForeground1 (with override support through the Text component used in label subtext). Disabled groups and disabled items draw their muted text and indicator colors from tokens.colorNeutralForegroundDisabled and tokens.colorNeutralBackgroundDisabled. The selected indicator and its hover states use brand tokens such as tokens.colorCompoundBrandBackground and tokens.colorCompoundBrandStroke, and the focus ring uses tokens.colorStrokeFocus2 and tokens.colorStrokeFocus1, so brand customization is inherited automatically rather than needing per-component overrides.

## Migration Notes

Compared with the previous generation of Fluent radio groups, v9 splits responsibilities differently: the old inline prop is replaced by the layout prop, where layout="horizontal" gives the in-row arrangement and layout="horizontal-stacked" puts labels beneath the indicators. The old built-in label prop no longer exists on the group; wrap RadioGroup in a Field instead so the label, required indicator, and validation message are rendered and associated correctly. The old styles prop and merge-styles based overrides are replaced by Griffel classes passed through className and the component's slots, using tokens for colors and spacing. Children are Radio components imported from the same package and are matched by their value prop, and if you omit the name prop a unique name is generated automatically so the radios behave as one group. Initial selection should now be declared with the group's defaultValue (uncontrolled) or value plus onChange (controlled), and only one of defaultValue or a child's defaultChecked should be used in a given group.

## Edge Cases

- Clearing a controlled selection by setting value to an empty string leaves the group with no option selected, which is valid but can surprise users of a required field; make sure a cleared state is intentional and validated.
- An option selected via defaultValue or value that is also marked disabled displays as selected but cannot be changed by the user, so avoid pre-selecting disabled options unless that state is meaningful.
- Omitting the name prop generates a unique name automatically, which is fine for UI-only groups, but form submission and native reset behavior are easier to reason about when you supply an explicit name.
- Setting required on the RadioGroup forwards it to the child radios, but the group itself performs no validation; the visible required indicator and error messaging come from the surrounding Field.
- Using layout="horizontal" with many or long options causes the row to wrap or overflow, and the arrow-key navigation continues to follow the group's reading order rather than the visual wrapping.
- Placing non-Radio children inside the group, or nesting another RadioGroup, breaks the expected radiogroup structure and can confuse both keyboard navigation and screen reader announcements.
- Only one of defaultValue or a child's defaultChecked should be used per group; relying on both makes the initial selection dependent on rendering order rather than your explicit intent.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
