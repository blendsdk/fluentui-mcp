# Checkbox

> **Package**: `@fluentui/react-checkbox` v9.6.2
> **Import**: `import { Checkbox } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Checkbox is a form control that lets users select one or more independent options from a set, or toggle a single boolean value. It is composed from four slots: a root wrapper, a hidden native input that owns all of the behavior, a visual indicator that draws the checkmark, and an optional label. Because the real interactive element is the underlying input, Checkbox keeps full native checkbox semantics — focus, keyboard activation, and form participation — while the visible indicator stays completely themeable. The checked prop accepts true, false, or the string "mixed" (the indeterminate or partially selected state), so a single checkbox can represent a parent whose child options are not in agreement. Checkbox is uncontrolled by default and becomes controlled when checked is paired with onChange, and its presentation can be tuned through the size, shape, and labelPosition props.

**When to use**: Use Checkbox when users may select zero, one, or several options that are independent of each other, such as filter lists, permission grids, opt-ins, and multi-select tables. Use it for a lone boolean too — accepting terms, enabling an option that is submitted with a form — where the value is captured rather than applied instantly. Use the mixed state on a parent checkbox that summarizes a group of child checkboxes so users can see that some, but not all, children are selected. Choose a different pattern when the semantics do not match: mutually exclusive options belong to radio semantics, and a setting that takes effect immediately the moment it is toggled is better communicated by an on/off switch pattern, because a checkbox implies the change is staged and confirmed. Do not use a checkbox as an action trigger — that is a button — and do not use it for free-form input of any kind.

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

- **checked**: The controlled value. Pass true or false for a definite state and the string mixed when the checkbox summarizes a group whose children disagree. Use it together with onChange whenever the checkbox is controlled; omitting onChange leaves the control permanently frozen at the value you set. `mixed`
- **defaultChecked**: The uncontrolled initial value, honored only on first render. Use it for checkboxes nothing else reads or writes; use checked plus onChange when the value participates in other UI. Never combine both on the same instance. `true`
- **onChange**: Fires whenever the user toggles the checkbox. Read the resolved boolean from the second argument's checked field and write it back to state, or fan it out to child values when this is a select-all parent. When the checkbox is mixed, the callback reports a definite boolean rather than mixed, so the parent logic is responsible for translating that into child state. `the second callback argument carries the new checked value`
- **label**: Fills the label slot with the checkbox's visible and accessible text. Because children are not supported, this is the only way to render adjacent text. Keep labels short and descriptive, and use a container width constraint when the label must wrap. `Accept terms and conditions`
- **labelPosition**: Controls whether the label sits before or after the indicator and defaults to after. Use before when the checkbox annotates a preceding sentence, such as a settings row where the value follows the description. `before`
- **shape**: Chooses the indicator's shape and defaults to square. Keep square for forms, tables, and filters; only choose circular in a tasks or checklist experience, since it is otherwise easily mistaken for a radio control. `square`
- **size**: Sets the indicator size and defaults to medium. Use large for touch-first surfaces, sparse layouts, or when the checkbox is the primary emphasis of the row, and keep medium for dense forms and table rows. `medium`
- **disabled**: A native attribute forwarded to the input slot. It removes the checkbox from the tab order and announces it as unavailable while keeping the label visible so users can still read what the option is. Use it for options that are visible but not currently applicable. `disabled`
- **required**: A native attribute forwarded to the input slot. It participates in form validation and also gives the label required styling, but it does not block a group from being submitted partially selected, so validate group-level rules separately. `required`

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

- Always give the checkbox a name: populate the label slot through the label prop, or attach aria-label / aria-labelledby to the input slot when a visible label truly is not possible.
- Prefer the controlled pattern when the value drives other UI — pair checked with onChange and store data.checked so a parent select-all checkbox and its children stay in sync.
- Use defaultChecked for simple uncontrolled cases such as a one-off preference that nothing else in the app reads.
- Derive the mixed state from the child values rather than hardcoding it, so a partially selected parent resolves to checked or unchecked as soon as every child agrees.
- Keep the default square shape for ordinary forms, tables, and settings, and reserve the circular shape for task or checklist experiences.
- Reach for size large when the checkbox needs a larger hit target or stronger emphasis, and keep medium for dense form and table layouts.
- Use labelPosition set to before when the checked state is a trailing detail of a sentence, and leave the default after position for standard forms.
- Let long labels wrap by constraining the width of the surrounding container; the indicator stays aligned with the first line of text so it remains readable.
- Group related checkboxes under a shared heading or group label and give every checkbox in the group a distinct, self-explanatory label.

### Don'ts

- Don't pass children to Checkbox — children are typed as undefined, so anything placed between the tags never renders and the control is left without an accessible name. Put the text in the label slot instead.
- Don't use a checkbox for a set of mutually exclusive options; users expect to be able to select more than one and will be confused about why a previous choice cleared.
- Don't use the circular shape outside a tasks or checklist experience, where it reads as a radio control.
- Don't set checked without providing onChange; that freezes the control so users can never change it.
- Don't supply both checked and defaultChecked on the same instance — pick controlled or uncontrolled and stay consistent.
- Don't treat mixed as a state a user can deliberately choose; it must be computed from the group it summarizes.
- Don't expect className or style to reach the input element — both stay on the root slot, so direct sizing or styling of the hidden input must go through the slot API.
- Don't communicate selection through color alone; the checkmark, the mixed dash, and the label text must all carry the meaning for users who cannot perceive the fill color.

## Anti-Patterns

### Content passed as children

❌ Children are typed as undefined and are never rendered, so the checkbox appears with no text at all and has no accessible name.

✅ Put the text in the label prop so it renders through the label slot and is associated with the input.

### Checkbox with a frozen value

❌ Setting checked without an onChange handler creates a controlled input the user can never modify, and the value silently diverges from what the screen shows.

✅ Add onChange and write the reported checked value back to state, or switch to defaultChecked when the parent does not need to track the value.

### Circular checkboxes in ordinary forms

❌ The circular shape is visually indistinguishable from radio semantics, so users cannot tell whether they may select more than one option.

✅ Keep the default square shape everywhere except tasks-style checklists, and use radio semantics when the options are mutually exclusive.

### Checkbox used for mutually exclusive choices

❌ Users expect to select several checkboxes, so forcing single selection produces confusing deselect behavior and misreported values.

✅ Use radio semantics for exclusive options and reserve Checkbox for independent, multi-select choices.

### Hardcoded mixed state

❌ A checkbox permanently pinned to mixed never resolves, so the group parent looks partially selected even when every child agrees, and it gives users no way to select or clear the whole group.

✅ Compute the parent value from the child values on every render so it becomes true when all children are selected, false when none are, and mixed only in between.

## Accessibility

**Requirements**: The control renders a real native input, so it must be given an accessible name through the label slot or, failing that, aria-label or aria-labelledby forwarded to the input. Text and indicator must meet WCAG 1.4.3 and 1.4.11 contrast for both the checked and unchecked strokes and for the disabled state. Keyboard operability (2.1.1) and a visible focus indicator (2.4.7, satisfied by the theme focus ring token) are required. Grouped checkboxes should be wrapped in a group with an accessible group label so assistive technology users understand the relationship, and the mixed state should never be the only signal that a group is partially selected — the child checkboxes and the parent's label should explain it. Required checkboxes should reflect the native required attribute rather than an asterisk alone.

| Key | Action |
| --- | --- |
| `Space` | Toggles the focused checkbox between checked and unchecked. When the checkbox is in the mixed state, the first press resolves it to a definite state and reports a boolean through the change callback. |
| `Tab` | Moves focus to the checkbox in document order; disabled checkboxes are skipped entirely and receive no focus. |
| `Shift+Tab` | Moves focus back to the previously focusable element. |
| `Enter` | Has no effect on a checkbox; only Space toggles it. Do not add custom Enter handling, which would contradict the native behavior users expect. |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-disabled, aria-required (reflected from the native required attribute)

**Screen Reader**: Focus lands on the hidden native input, so screen readers announce a checkbox role with the label text as its accessible name, followed by the state: checked, unchecked, or partially checked for the mixed value. Disabled checkboxes are announced as dimmed or unavailable and are removed from the tab order. When a checkbox is marked required, that fact is announced alongside the name. Because the role, name, and state come from the native element, adding a redundant role attribute on the root is unnecessary.

## Styling

Pass classes and inline styles through the root slot, which is where className and style land, and use the slot API when the label or indicator needs its own treatment. The unchecked border is drawn with tokens.colorNeutralStrokeAccessible, with tokens.colorNeutralStrokeAccessibleHover and tokens.colorNeutralStrokeAccessiblePressed for interaction states; the checked and mixed fills use tokens.colorCompoundBrandBackground with the hover and pressed variants of the same ramp, and the checkmark itself uses tokens.colorNeutralForegroundInverted. Square corners come from tokens.borderRadiusSmall. The label inherits tokens.fontFamilyBase with tokens.fontSizeBase300 and tokens.lineHeightBase300, and disabled checkboxes switch to tokens.colorNeutralForegroundDisabled for the text and tokens.colorNeutralStrokeDisabled for the outline. Focus rings are drawn with tokens.colorStrokeFocus2, and the gap between indicator and label is tokens.spacingHorizontalS. Prefer Griffel classes created with makeStyles over new object literals in the style prop so style rules are deduplicated and reused across renders, and constrain width on the container to exercise label wrapping rather than truncating the text.

## Performance

Checkbox is a very light component: it renders a small fixed tree of four slots and delegates all interaction to a native input, so there is no custom keyboard or ARIA JavaScript to run. The main cost in real applications comes from the surrounding state, not the control — a controlled checkbox re-renders on every toggle, and a select-all parent that fans its change out to many children re-renders the whole group at once. Keep change handlers stable and avoid recreating style objects on each render, favoring Griffel classes so identical rules are shared. In long lists or table rows with a checkbox per row, memoize the row component so toggling one checkbox does not re-render every other row, and avoid recomputing expensive derived values inside the parent's render path.

## Theming & Tokens

Checkbox has no theme-specific props; it reads entirely from the theme exposed by Provider plus any token overrides applied in your Griffel styles. The checked and mixed fills follow the brand-aligned compound background tokens (tokens.colorCompoundBrandBackground and its hover and pressed variants), so a custom brand ramp in the theme automatically recolors the checkbox. Neutral surfaces adapt through tokens.colorNeutralStrokeAccessible for the unchecked outline, tokens.fontFamilyBase with tokens.fontSizeBase300 and tokens.lineHeightBase300 for the label, and tokens.colorStrokeFocus2 for the focus ring, all of which resolve differently in light, dark, and high-contrast themes. Disabled checkboxes switch to tokens.colorNeutralForegroundDisabled, tokens.colorNeutralStrokeDisabled, and the neutral disabled background token, keeping the state readable without relying on reduced opacity alone. Because className and style apply to the root slot, theming hooks should target that element or use the label and indicator slots for finer control.

## Migration Notes

The v9 change signature is the biggest source of migration work: onChange now receives the React change event plus a CheckboxOnChangeData object, and the checked value is read from that data rather than being passed as a bare boolean second argument. Customization also moved to the slot model — root, label, input, and indicator — so props that used to override sub-elements individually are replaced by slot props, and the checkmark is now the child of the indicator slot. className and style continue to be applied to the root element only, while every other native prop, such as disabled and required, is forwarded to the input slot, so code that relied on native props reaching a wrapper element must be reviewed.

## Edge Cases

- children are typed as undefined, so any content placed between the checkbox tags is silently dropped instead of rendered.
- className and style land on the root slot while every other native attribute is forwarded to the input slot, so instructions that assume all props reach one element will not behave as expected.
- A mixed checkbox does not report mixed back through the change callback; toggling it produces a definite boolean that the parent logic must translate into child values.
- Setting checked without onChange, or setting both checked and defaultChecked on one instance, produces a control the user cannot change or a conflicting source of truth.
- Long labels wrap to multiple lines and the indicator stays aligned with the first line, so very long text needs an explicit width constraint on the container rather than truncation.
- Disabled checkboxes still render their checked, unchecked, or mixed styling, so a disabled mixed parent remains visually indeterminate until the underlying value changes.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
