# Field

> **Package**: `@fluentui/react-field` v9.5.2
> **Import**: `import { Field } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Field is the form-field wrapper of Fluent UI React v9. It pairs a single form control with an associated label, an optional hint, and an optional validation message, and it shares that metadata with the control through FieldContext. Because the association is contextual rather than hard-coded, Field can wrap any control in the library — Input, Textarea, Combobox, SpinButton, Slider, RadioGroup, and others — and it also works with third-party controls when the child is a render function that receives props to spread, or when the control merges the field's props using useFieldControlProps_unstable. Field renders a root element plus optional label, validationMessage, validationMessageIcon, and hint slots, and it forwards accessibility state to the control it wraps: required adds an asterisk to the label and sets aria-required on the child, while an error validation message sets aria-invalid on the child. Field does not perform validation itself; it reports the result of validation performed by your form logic through validationState and validationMessage.

**When to use**: Use Field any time a form control needs a visible label that is programmatically associated with it, plus optional hint or validation feedback. It is the standard wrapper for Input, Textarea, Combobox, SpinButton, Slider, and similar controls that do not carry their own visible label. Use it when you need a consistent label placement across a form, when you want the required asterisk and aria-required handled for you, or when you want validation text to be announced by assistive technology. For Checkbox, Switch, and Radio inside RadioGroup, the controls render their own labels, so use Field there only for hint or validation message text rather than a duplicate label. For controls outside this library, use the render-function form of children so the label, hint, and message are still correctly associated. Do not use Field as a general-purpose layout container for non-form content, and do not wrap multiple controls in one Field — reach for a stack, grid, or a grouped control such as RadioGroup instead.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode \| ((props: FieldControlProps) => React.ReactNode)` | — | No | The Field's child can be a single form control, or a render function that takes the props that should be spread on a form control.  All form controls in this library can be used directly as children (such as `<Input>` or `<RadioGroup>`).  For other controls, there are two options: 1. The child of Field can be a render function that is given the props that should be spread on the control.    `<Field>{(props) => <MyInput {...props} />}</Field>` 2. The control itself can merge props from field with useFieldControlProps_unstable().    `props = useFieldControlProps_unstable(props);` |
| `orientation` | `"vertical" \| "horizontal" \| undefined` | `vertical` | No | The orientation of the label relative to the field component. This only affects the label, and not the validationMessage or hint (which always appear below the field component). |
| `required` | `boolean \| undefined` | — | No | Marks the Field as required. If `true`, an asterisk will be appended to the label, and `aria-required` will be set on the Field's child. |
| `size` | `"small" \| "medium" \| "large" \| undefined` | `medium` | No | The size of the Field's label. |
| `validationState` | `"error" \| "warning" \| "success" \| "none" \| undefined` | `error when validationMessage is set; none otherwise.` | No | The `validationState` affects the display of the `validationMessage` and `validationMessageIcon`.  * error: (default) The validation message has a red error icon and red text, with `role="alert"` so it is     announced by screen readers. Additionally, the control inside the field has `aria-invalid` set, which adds a     red border to some field components (such as `Input`). * success: The validation message has a green checkmark icon and gray text. * warning: The validation message has a yellow exclamation icon and gray text, with `role="alert"` so it is     announced by screen readers. * none: The validation message has no icon and gray text. |

### Prop Guidance

- **children**: Accepts exactly one form control, or a render function that receives the props to spread onto a control. Use the element form for any control in this library, since they consume FieldContext automatically. Use the render-function form for third-party or custom controls that do not read FieldContext, and remember to spread the provided props onto the control or the label and message associations are lost. `a render function that spreads the provided field control props onto a custom input`
- **label**: The visible label for the wrapped control. Pass a plain string for the normal case, or a slot object or render function to restyle it or replace it — for example to swap in InfoLabel when an info button is needed. Omit it when the control supplies its own label (Checkbox, Switch, Radio) and use hint instead for supporting text. `Example field`
- **orientation**: Controls whether the label sits above the control (vertical, the default) or beside it (horizontal). Only the label is affected — hint and validation message always render below the control. Use horizontal when several fields are stacked and you want their labels and controls to line up in columns, keeping in mind the label column is a fixed 33% of the field width. `horizontal`
- **validationState**: Selects the appearance and semantics of the validation message and its icon. It defaults to error whenever a validation message is present and to none otherwise. Use error for blocking problems, warning for advisory issues, success for confirmed valid input, and none when you want custom styling or a custom icon without built-in semantics. `warning`
- **validationMessage**: The text shown below the control describing the validation result. Populate it from your own validation logic; Field does not validate on its own. Keep it short and actionable, and clear it once the user resolves the problem, since error and warning messages are announced as alerts. `This is a success message.`
- **validationMessageIcon**: Overrides the icon shown next to the validation message. It only renders when a validation message is present, and it is the way to add an icon when the validation state is none, which otherwise renders no icon at all. `a custom sparkle icon used with the none validation state`
- **hint**: Short supplementary text rendered below the control and associated with it as a description. Use it sparingly for format expectations or units, and don't use it to carry critical or error information that belongs in the validation message. `Sample hint text.`
- **required**: Marks the field as required: an asterisk is appended to the label and aria-required is set on the wrapped control. Set it only when the input truly must be filled in, and don't also write "required" into the label text. `true`
- **size**: Sets the size of the field's label and is propagated to controls that support a size prop, so the label and control stay visually matched. Prefer a single size per form area so stacked fields align. `large`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `hint` | — | No | Additional hint text below the field. |
| `label` | — | No | The label associated with the field. |
| `root` | — | Yes | — |
| `validationMessage` | — | No | A message about the validation state. By default, this is an error message, but it can be a success, warning, or custom message by setting `validationState`. |
| `validationMessageIcon` | — | No | The icon associated with the `validationMessage`. This will only be displayed if `validationMessage` is set.  The default depends on `validationState`: * error: `<ErrorCircle12Filled />` * warning: `<Warning12Filled />` * success: `<CheckmarkCircle12Filled />` * none: `null` |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import type { FieldProps } from '@fluentui/react-components';
import { Field, Input } from '@fluentui/react-components';

export const Default = (props: Partial<FieldProps>): JSXElement => (
  <Field label="Example field" validationState="success" validationMessage="This is a success message." {...props}>
    <Input />
  </Field>
);
```

### ComponentExamples

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';

export const ComponentExamples = (): JSXElement => (
  <div className={useStackClassName()}>
    <Field label="Input">
      <Input />
    </Field>
    <Field label="Textarea">
      <Textarea />
    </Field>
    <Field label="Combobox">
      <Combobox>
        <Option>Option 1</Option>
        <Option>Option 2</Option>
        <Option>Option 3</Option>
      </Combobox>
    </Field>
    <Field label="SpinButton">
      <SpinButton />
    </Field>
    <Field hint="Checkboxes use their own label instead of the Field label.">
      <Checkbox label="Checkbox" />
    </Field>
    <Field label="Slider">
      <Slider defaultValue={25} />
    </Field>
    <Field label="Switch">
      <Switch />
    </Field>
    <Field label="RadioGroup">
      <RadioGroup>
        <Radio label="Option 1" />
        <Radio label="Option 2" />
        <Radio label="Option 3" />
      </RadioGroup>
    </Field>
  </div>
);

ComponentExamples.storyName = 'Component Examples';
ComponentExamples.parameters = {
  docs: {
    description: {
      story: `Field can be used with any input components in this library. This story shows some examples.
        It can also be used to add a label or error text to components like ProgressBar.`,
    },
  },
};
```

### Disabled

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Field, Input } from '@fluentui/react-components';

export const Disabled = (): JSXElement => (
  <Field label="Field with disabled control">
    <Input disabled />
  </Field>
);

Disabled.storyName = 'Disabled control';
Disabled.parameters = {
  docs: {
    description: {
      story:
        'When the control inside the Field is disabled, the label should _not_ be marked disabled. ' +
        'This ensures the label remains readable to users.',
    },
  },
};
```

## Best Practices

### Do's

- Give every Field a meaningful label, or an explicit accessible name on the control, so the wrapped control always has an accessible name.
- Use the hint slot for short, supplementary guidance such as expected format or units, and keep it to one brief sentence.
- Set required only for inputs that genuinely block submission, and let Field append the asterisk and set aria-required instead of writing those yourself.
- Report real validation results through validationState and validationMessage, choosing error for blocking problems, warning for advisory ones, and success for confirmed valid values.
- Use orientation="horizontal" when several fields are stacked, since the label takes a fixed 33% width and horizontally oriented fields align with each other.
- Keep one control per Field so the label, hint, and validation message unambiguously describe a single input.
- For third-party controls that do not read FieldContext, use the render-function form of children and spread the provided props (or call useFieldControlProps_unstable inside the control) so the label and message stay associated.
- Override the label slot with InfoLabel when the label needs an info button, passing the slot props through to the replacement component.

### Don'ts

- Don't expect Field to run validation — it only displays the result you give it through validationMessage and validationState.
- Don't duplicate labeling for Checkbox, Switch, or RadioGroup: those controls already render their own label, so a Field label would read as a second, redundant label.
- Don't manually append an asterisk or the word "required" to the label text; the required prop already renders the asterisk and sets aria-required.
- Don't use the error state for benign, non-blocking advice — the error message is exposed with role="alert" and interrupts screen reader output, so prefer hint, warning, or none for informational text.
- Don't mark the label as disabled when the inner control is disabled; the label should remain readable and should not appear inactive.
- Don't wrap more than one control, or a whole group of unrelated controls, in a single Field.
- Don't hardcode colors or icons for validation states when validationState and validationMessageIcon already provide consistent, theme-aware treatment.
- Don't leave a stale validation message on screen after the user has corrected the input; clear or update it as the value changes.

## Anti-Patterns

### Duplicating the label on self-labeling controls

❌ Checkbox, Switch, and Radio inside RadioGroup render their own labels. Giving the surrounding Field a label produces two competing labels for one control, which is confusing visually and noisy for screen reader users, since the field label becomes an additional description.

✅ Omit the Field label for those controls and use Field only when you need a hint or a validation message, as the component examples do for a Checkbox.

### Treating Field as a validator

❌ Field does not validate input; it only displays the message you pass. Developers sometimes set a validation message once and expect it to update or to prevent submission, leaving stale or misleading messages on screen.

✅ Run validation in your form logic and drive validationMessage and validationState from that state, clearing the message when the user corrects the value.

### Overusing the alerting error state

❌ Error and warning messages use role="alert", so they interrupt whatever a screen reader is currently announcing. Using the error state for purely informational or non-blocking text, or rendering it on every keystroke, creates disruptive repeated announcements.

✅ Reserve error for blocking problems, use warning for advisory ones, and use the hint slot or validationState of none for neutral information. Debounce validation so the message does not change on every keystroke.

### Wrapping an unfamiliar control without wiring the association

❌ Placing a third-party or custom control directly as a child works only if that control reads FieldContext. If it does not, the rendered label and validation message are never associated with the control, so assistive technology reads an unlabeled input.

✅ Use the render-function form of children and spread the provided props onto the control, or have the control call useFieldControlProps_unstable on its props.

### Hand-rolling required and error affordances

❌ Adding an asterisk to the label text and coloring it red manually, or hardcoding an error icon and color, bypasses the accessibility wiring and the theme, and it can drift from the rest of the form.

✅ Use the required prop and the validationState prop so the asterisk, aria-required, aria-invalid, icons, and theme-aware colors are applied consistently.

### Stacking multiple controls inside one Field

❌ A single label, hint, and validation message are associated with one control. Wrapping several controls makes the description ambiguous and the validation message cannot identify which control is wrong.

✅ Render one Field per control, and group related controls such as radios with RadioGroup inside a single Field instead of listing them individually.

## Accessibility

**Requirements**: Every Field should provide an accessible name for its control, either through the label slot or through an accessible name on the control itself. When required is set, the child receives aria-required, and when the validation state is error the child receives aria-invalid so its invalid styling and semantics match the message. Validation text must not rely on color alone — the message text carries the meaning, and the icon is decorative reinforcement. Error and warning messages use role="alert", so keep their text concise and avoid rendering them repeatedly, since repeated alerts are disruptive to screen reader users. Ensure the hint and validation message text meet contrast requirements in every theme, and remember that a disabled control's label should stay legible rather than being visually muted to match the disabled control.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus from the previous element into the form control that Field wraps; Field itself is not focusable. |
| `Shift+Tab` | Moves focus out of the wrapped control back to the preceding focusable element. |
| `Enter` | When the label slot is replaced with an InfoLabel, activates the label's info button to show the supplementary information. |
| `Space` | When the label slot is replaced with an InfoLabel, also activates the info button, matching standard button behavior. |
| `Escape` | Dismisses the info popover surfaced by an InfoLabel used in the label slot. |

**ARIA**: aria-required — set on the wrapped control when required is true, aria-invalid — set on the wrapped control when the validation state is error, aria-labelledby — associates the rendered label element with the wrapped control, aria-describedby — associates the hint and validation message text with the wrapped control, aria-label — usable on the control when no visible label slot is rendered, role="alert" — applied to the validation message for the error and warning validation states

**Screen Reader**: Field's main contribution to assistive technology is association: the label element it renders is tied to the wrapped control, and the hint and validation message are exposed as descriptions of that control, so users hear the label, then the hint, then the message when focus lands on the input. When the validation state is error or warning, the message is rendered inside an element with role="alert", so it is announced immediately when it appears rather than only when the control is focused; success and none messages are not alerts and are read only as descriptions. In the error state the control also reports itself as invalid through aria-invalid, and a required field reports itself as required through aria-required, so the asterisk is not the only signal. Icons rendered in validationMessageIcon are reinforcement only; the message text carries the meaning for non-visual users.

## Styling

Field is styled with Griffel, so customize it with makeStyles or makeResetStyles and the tokens object rather than with raw CSS. Target the root through className and shape individual parts by passing slot objects with a className (for example a slot object on label, hint, or validationMessage), or by replacing a slot entirely with a render function. Spacing between the label, control, and message is controlled with tokens.spacingVerticalXXS, tokens.spacingVerticalXS, and tokens.spacingVerticalS; label typography uses tokens.fontSizeBase200, tokens.fontSizeBase300, and tokens.fontSizeBase400 with the matching tokens.lineHeightBase200, tokens.lineHeightBase300, and tokens.lineHeightBase400; hint and non-error message text typically use tokens.colorNeutralForeground3, labels use tokens.colorNeutralForeground1, and the required asterisk and error message use tokens.colorPaletteRedForeground1. Success iconography uses tokens.colorPaletteGreenForeground1, warning iconography uses tokens.colorPaletteYellowForeground1, and any borders or dividers you add around a field should use tokens.colorNeutralStroke1 or tokens.colorNeutralStrokeAccessible. Prefer restyling through the slots and tokens instead of overriding the internal layout, because the horizontal orientation depends on its fixed label column.

## Performance

Field is a thin wrapper: it renders its slots and publishes state through FieldContext, so its own render cost is small. The cost that matters is context propagation — changing any Field prop that flows to the child (required, validationState, size, or the message text) re-renders the wrapped control, so avoid recomputing those values on every render of a large form. Prefer plain strings for label, hint, and validationMessage rather than freshly created slot objects each render. When using the render-function form of children, define the custom control component outside the render prop; an inline function component defined inside the render creates a new component type on every render and forces a remount of the control, losing focus and internal state. Also note that validation messages mount and unmount as the message appears and disappears, and role="alert" elements are announced on mount, so keep the message stable while the user is working.

## Theming & Tokens

Field reads its typography from the size prop, mapping small, medium, and large to the base font and line height tokens (tokens.fontSizeBase200, tokens.fontSizeBase300, tokens.fontSizeBase400 with the matching line height tokens), and it inherits the font family from tokens.fontFamilyBase through the FluentProvider. Validation states are expressed entirely with semantic palette tokens rather than fixed colors: error text and the required asterisk use tokens.colorPaletteRedForeground1, the success icon uses tokens.colorPaletteGreenForeground1, the warning icon uses tokens.colorPaletteYellowForeground1, and hint and non-alert message text use tokens.colorNeutralForeground3, while the label itself uses tokens.colorNeutralForeground1. Because these are theme tokens, a custom theme created with createLightTheme or createDarkTheme restyles field labels and validation feedback automatically, and a FluentProvider with a right-to-left dir mirrors the layout, including the fixed label column used by the horizontal orientation.

## Migration Notes

Field has no direct counterpart in Fluent UI React v8, where TextField bundled the label, the input, and an error message into a single component. Migrating to v9 means splitting that responsibility: Field is now the wrapper that owns the label, hint, and validation message, while the input is a separate component such as Input or Textarea placed as the child. The v8 errorMessage string maps to the validationMessage slot, and the boolean error flag maps to validationState (error remains the default when a validation message is present). The v8 required flag maps to the required prop, which now sets aria-required on the control in addition to rendering the asterisk. The v8 info affordance maps to replacing the label slot with InfoLabel. Because Field shares state through FieldContext, custom or third-party controls need either the render-function form of children or a call to useFieldControlProps_unstable inside the control to receive the same label and description wiring that library controls get automatically.

## Edge Cases

- The validation message default state depends on whether a message exists: validationState defaults to error when validationMessage is set and to none otherwise, so setting validationState alone without a message renders nothing.
- validationMessageIcon only displays when validationMessage is set, and the none state renders no icon at all — a custom icon must be supplied explicitly for that combination.
- With orientation set to horizontal, the label occupies a fixed 33% of the field width, so long labels wrap or truncate awkwardly and very narrow containers leave little room for the control.
- required is presentational and semantic only: it adds the asterisk and aria-required but does not prevent submission or validate the value.
- Checkbox, Switch, and Radio inside RadioGroup render their own labels, so a Field label on those controls duplicates the accessible name instead of providing one.
- When size is set on Field, controls that support a size prop inherit it, but a size set directly on the control takes precedence and can visually mismatch the label.
- A disabled control should not cause the label to be marked disabled; keeping the label readable is the documented behavior for the disabled story.
- Third-party controls only receive the label and message associations if you spread the render function's props or call useFieldControlProps_unstable inside the control; otherwise the label renders without any programmatic link.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
