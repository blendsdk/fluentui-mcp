# Field

> **Package**: `@fluentui/react-field` v9.5.2
> **Import**: `import { Field } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Field is the Fluent UI React v9 form-field wrapper that pairs a single form control with an accessible label, an optional hint, and an optional validation message. It uses React context (FieldContext) to associate its label and message text with the control it wraps, so all form controls in the library — Input, Textarea, Combobox, SpinButton, Slider, Switch, RadioGroup and others — work directly as children without any manual id or aria wiring. Field also renders a default icon alongside the validation message that changes with the validation state (red error circle, yellow warning, green checkmark), and marks the child with aria-required when required is set. Field does not perform validation itself; it is a presentation and accessibility layer that reports the result of validation performed by your application. Beyond simple text inputs, Field can label non-input content such as Progress components, and it can host third-party controls either through a render-function child or through a control that merges field props with useFieldControlProps_unstable.

**When to use**: Use Field whenever a single form control needs a visible label, supporting hint text, or a validation/error message — this is the standard composition pattern for every form control in the library. Prefer Field over hand-writing a Label next to an Input, because Field automatically generates the id/htmlFor-style association and aria-describedby-style wiring between the label, hint, validation message, and control, and it manages aria-required and aria-invalid for you. Do not use Field for controls that already own their labeling semantics, such as Checkbox, Radio, and Switch, which take their own label prop; in those cases use Field only for its hint or validation message (with no label) or skip Field entirely. Use Field's render-function child form when wrapping a third-party control that does not consume FieldContext. Field is not a validation engine, a form container, or a layout grid — reach for your form-state library for validation logic and for layout primitives for arranging multiple fields.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `any` | — | No | The Field's child can be a single form control, or a render function that takes the props that should be spread on a form control.  All form controls in this library can be used directly as children (such as `<Input>` or `<RadioGroup>`).  For other controls, there are two options: 1. The child of Field can be a render function that is given the props that should be spread on the control.    `<Field>{(props) => <MyInput {...props} />}</Field>` 2. The control itself can merge props from field with useFieldControlProps_unstable().    `props = useFieldControlProps_unstable(props);` |
| `orientation` | `"vertical" \| "horizontal" \| undefined` | `vertical` | No | The orientation of the label relative to the field component. This only affects the label, and not the validationMessage or hint (which always appear below the field component). |
| `required` | `boolean \| undefined` | — | No | Marks the Field as required. If `true`, an asterisk will be appended to the label, and `aria-required` will be set on the Field's child. |
| `size` | `"small" \| "medium" \| "large" \| undefined` | `medium` | No | The size of the Field's label. |
| `validationState` | `"error" \| "warning" \| "success" \| "none" \| undefined` | `error when validationMessage is set; none otherwise.` | No | The `validationState` affects the display of the `validationMessage` and `validationMessageIcon`.  * error: (default) The validation message has a red error icon and red text, with `role="alert"` so it is     announced by screen readers. Additionally, the control inside the field has `aria-invalid` set, which adds a     red border to some field components (such as `Input`). * success: The validation message has a green checkmark icon and gray text. * warning: The validation message has a yellow exclamation icon and gray text, with `role="alert"` so it is     announced by screen readers. * none: The validation message has no icon and gray text. |

### Prop Guidance

- **children**: A single form control. Library controls (Input, Textarea, Combobox, SpinButton, Slider, Switch, RadioGroup, and others) work directly because they consume FieldContext. Controls with their own labels, such as Checkbox, should be placed inside Field without a Field label, using hint or validationMessage only. For third-party controls, either pass a render function that receives the props to spread onto the control, or make the control merge props via useFieldControlProps_unstable. `(fieldProps) => <MyInput {...fieldProps} />`
- **orientation**: Controls whether the label sits above the control (vertical, the default) or beside it (horizontal). It affects only the label: the hint and validationMessage always render below the control. Use horizontal for dense or settings-style layouts; the label column is a fixed 33% of the field width so stacked horizontal fields align. `horizontal`
- **validationState**: Selects the visual and semantic treatment of the validation message and its icon. It defaults to error when a validationMessage is provided and to none otherwise. Use error for blocking problems (red icon and text, role="alert", aria-invalid on the child), warning for advisory feedback (yellow icon, gray text, role="alert"), success for confirmed input (green checkmark, gray text, no alert), and none for a neutral or fully custom message. `warning`
- **required**: Set to true when the user must supply a value. This appends an asterisk to the label and sets aria-required on the child control; it does not enforce validation, so pair it with your own validation logic and a validationMessage when the value is missing. Omit the prop entirely when the field is optional. `true`
- **size**: Sets the size of the Field's label (small, medium, or large; default medium) and is also propagated through FieldContext to child controls that support a size prop, keeping label typography and control sizing in sync. Match the size to the surrounding form density rather than mixing sizes within one form section. `large`

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

- Use the label prop (or the label slot) on every Field whose child is a control without its own label, such as Input, Textarea, Combobox, SpinButton, and Slider.
- Set required on the Field rather than manually appending an asterisk to the label, so the child control also receives aria-required for assistive technology.
- Choose the validationState that matches your form logic: leave it unset (or set error) for failures, use warning for non-blocking feedback, use success for confirmed input, and use none when you want a neutral message with a custom icon.
- Only populate validationMessage once the user has interacted with the field or after a submit attempt, so messages are meaningful rather than appearing on first render.
- Wrap third-party controls by passing a child render function that spreads the provided field props onto the control, or by having the control merge them with useFieldControlProps_unstable, so the label and messages stay programmatically associated.
- Use the hint prop sparingly for genuinely helpful, short descriptive text that clarifies the expected input, and use validationMessage strictly for feedback about the entered value.
- Use orientation="horizontal" for dense forms or settings panels where vertically stacked fields would be excessively tall, and keep stacked horizontal fields together so their labels align.
- Match Field's size to the child control's size so the label typography and the control scale stay visually consistent.

### Don'ts

- Don't pass a label to Field when the child is a Checkbox, Radio, Switch, or another control that renders its own label — you will end up with two competing labels; use Field's hint or validation message only.
- Don't implement validation rules inside Field or expect it to compute a validationState; Field only displays the state you give it.
- Don't rely on color alone to convey the validation state — the state must also be communicated through the message text and the validationMessageIcon (or role="alert" announcements) for color-blind users.
- Don't set validationMessage on every keystroke for error and warning states, since those announce with role="alert" and will repeatedly interrupt screen reader users.
- Don't mark the label as disabled just because the wrapped control is disabled — Field intentionally keeps the label readable so users can still understand what the disabled control is for.
- Don't use hint text for critical error information or required-input instructions; hints are quiet, always-visible text, while errors need validationState and validationMessage.
- Don't put multiple controls inside a single Field — the label and message wiring assumes exactly one child control.
- Don't write raw custom CSS for the label and message colors; override the theme tokens instead so dark, high-contrast, and brand themes keep working.

## Anti-Patterns

### Double labeling self-labeled controls

❌ Passing a label to Field while the child (Checkbox, Radio, or Switch) already renders its own label produces two competing accessible names and duplicated visible text, confusing both sighted users and screen readers.

✅ Leave the label prop off for self-labeled controls and use Field for its hint or validationMessage instead — the library's own guidance is that checkboxes use their own label rather than the Field label.

### Treating Field as the validation engine

❌ Field never validates input; it only displays the state you give it. Teams that expect validationMessage to appear automatically end up with fields that look valid while containing invalid data, or with messages that never clear.

✅ Run validation in your form state layer, then drive Field with validationState, validationMessage, and a required flag that reflects the actual business rules.

### Alert spamming with live error messages

❌ Because error and warning states use role="alert", setting validationMessage on every keystroke causes screen readers to interrupt the user repeatedly while typing, making the form unusable with a screen reader.

✅ Update the message only when it meaningfully changes — on blur, on submit attempt, or when the error condition itself changes — and use success or none states for non-urgent feedback that does not need to be announced.

### Wrapping a third-party control without prop association

❌ A custom or third-party control placed directly as a Field child does not consume FieldContext, so the label, hint, and validation message are rendered visually but are never programmatically associated with the control; screen readers announce an unlabeled input.

✅ Use a render-function child that spreads the field props onto the control, or have the control merge props by calling useFieldControlProps_unstable.

### Color-only validation signaling

❌ Removing the validationMessageIcon or replacing message text with color alone (for example only turning the border red) fails WCAG use-of-color requirements and loses the role="alert" announcement that error and warning states provide.

✅ Keep the validation message text in place and rely on the built-in icon mapping (red error circle, yellow warning, green checkmark), overriding validationMessageIcon only with an equally meaningful indicator.

### Disabling the label along with the control

❌ Dimming or hiding the label when the inner control is disabled removes the only explanation of what the control does, leaving a greyed-out, unlabeled control on screen.

✅ Leave the label fully readable when the child is disabled — Field deliberately does not mark the label as disabled.

## Accessibility

**Requirements**: Field's core accessibility responsibility is programmatic association (WCAG 1.3.1, 3.3.2): the label slot must be linked to the child control, and the hint and validation message must be exposed as descriptions of that control. Error identification (WCAG 3.3.1) and status messages (WCAG 4.1.3) are satisfied by the validation message: error and warning states render with role="alert" so they are announced, error state additionally sets aria-invalid on the child control, and required sets aria-required on the child. Because validation state is conveyed by icons and text in addition to color, WCAG 1.4.1 (use of color) is respected — maintain that by never removing the icon and message text. Label, hint, and message text must keep sufficient contrast (WCAG 1.4.3) in all themes, and the recommended target size and spacing around the inner control should not be reduced below the library defaults.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the Field's child control in document order; Field itself is not focusable, so it never adds an extra stop. |
| `Shift+Tab` | Moves focus backwards out of the child control to the previous focusable element. |
| `Enter` | Activates the focused control inside the Field (for example submitting a form from an Input inside a form) and activates the info button when the label slot is replaced with an InfoLabel. |
| `Space` | Activates toggle-style controls inside the Field (such as a Switch or Checkbox child) and activates the info button when an InfoLabel is used as the label slot. |
| `Escape` | Dismisses transient UI opened from within the field, such as the info popover of an InfoLabel used as the label slot. |
| `Arrow keys` | Operate composite children inside the Field, such as moving between radios in a RadioGroup, adjusting a Slider, or changing a SpinButton value. |

**ARIA**: aria-required, aria-invalid, role="alert", label association for the child control (generated by FieldContext), description association for hint and validationMessage text (generated by FieldContext)

**Screen Reader**: Field's label is announced as the accessible name of the child control, and the hint plus validation message are announced as its description when the control receives focus. Setting required causes the control to be reported as required. Error and warning validation messages carry role="alert", so they are announced immediately when they appear or change; success and none messages are not alert-announced and are only read as part of the control's description. Error state also sets aria-invalid on the child, which many screen readers announce as "invalid entry". Because Field itself has no ARIA role of its own, the reading order follows the DOM: label (or adjacent label in horizontal orientation), then the control, then the validation message, then the hint.

## Styling

Field is styled through Griffel atomic classes, so the most robust customization is overriding theme tokens rather than writing raw CSS. Label text uses tokens.colorNeutralForeground1 and the size prop maps to font scale tokens (small → tokens.fontSizeBase200, medium → tokens.fontSizeBase300, large → tokens.fontSizeBase400) with matching line-height tokens such as tokens.lineHeightBase300. Hint text uses the quieter tokens.colorNeutralForeground3, while error message text and its icon use tokens.colorPaletteRedForeground1 and the error border applied to the child control derives from the red palette (for example tokens.colorPaletteRedBorder2 on Input). Success icons use tokens.colorPaletteGreenForeground1 and warning icons use tokens.colorPaletteYellowForeground1. Vertical rhythm between label, control, message, and hint is controlled with tokens.spacingVerticalXXS, tokens.spacingVerticalXS, and tokens.spacingVerticalS. In horizontal orientation the label occupies a fixed 33% of the field width — override that in your own class if your form needs a different label column, but keep it consistent across stacked fields so the controls line up. Style the root with makeStyles and the slots (label, validationMessage, validationMessageIcon, hint) by passing slot objects; the label slot in particular accepts a slot object whose children can be a render function so you can substitute a completely different label component such as InfoLabel.

## Performance

Field is a lightweight wrapper: it renders a root element plus the label, validation message, icon, and hint slots, so its cost is dominated by whatever control you pass in. The main consideration is the render-function child form: because the function is invoked during Field's render, keep the function stable (defined outside the render body or memoized) and never define a brand-new component type inside it, which would remount the control on every parent render and lose focus and input state. The same applies to the render function used to replace the label slot with an InfoLabel. Rapidly changing validationState or validationMessage values re-render the field subtree — debounce or gate those updates in your form logic so typing does not trigger a validation render on every keystroke, which also prevents screen reader alert flooding. Field adds no extra wrapper nodes beyond its own root and does not measure layout, so it is safe to use in large forms.

## Theming & Tokens

Field is fully theme-token driven, so switching between themes (for example light, dark, high-contrast, or brand variants) restyles the label, hint, and validation message automatically. Label text uses tokens.colorNeutralForeground1 and scales with tokens.fontSizeBase200, tokens.fontSizeBase300, and tokens.fontSizeBase400 for small, medium, and large. Hint text uses tokens.colorNeutralForeground3, and error message text and icon use tokens.colorPaletteRedForeground1, with the associated invalid border on the child control coming from the red border palette such as tokens.colorPaletteRedBorder2. Success icons use tokens.colorPaletteGreenForeground1 and warning icons use tokens.colorPaletteYellowForeground1, while success and none message text stays neutral (tokens.colorNeutralForeground1 or tokens.colorNeutralForeground3). Spacing between label, control, and messages uses tokens.spacingVerticalXXS through tokens.spacingVerticalS and tokens.spacingHorizontalS for the horizontal label column. Overriding these tokens through a Provider theme or a scoped token override is the supported way to customize Field's appearance and keeps contrast guarantees intact.

## Migration Notes

In v8-style APIs, labeling and error messaging were props baked into each individual control (for example a text field carried its own label and error message props). In v9, Field externalizes that concern: you wrap any control in Field and get a consistent label, hint, validationMessage, validationMessageIcon, and required experience across every control in the library. Practical differences to plan for: the error message concept becomes validationMessage plus validationState (which adds warning and success states and sets aria-invalid on the child); the descriptive text concept becomes the hint slot; the required asterisk is now produced automatically by setting required on Field while also setting aria-required on the child; and the label is a slot rather than a plain string, allowing render-function replacement with components such as InfoLabel. Because labeling is now context-based, third-party or custom controls that previously read v8-specific props must either be wrapped with a Field child render function or call useFieldControlProps_unstable to merge the field props themselves.

## Edge Cases

- Field performs no validation itself: validationState defaults to error only because a validationMessage is present, and to none when it is absent, so you must compute and pass the state yourself.
- The validationMessageIcon slot renders only when validationMessage is set; supplying an icon without a message produces no visible output.
- orientation affects only the label. The hint and validationMessage always appear below the control, even in horizontal orientation, and the horizontal label column is a fixed 33% width.
- The size prop is propagated through FieldContext to child controls that support a size prop, so a size mismatch between the Field and a third-party control will not be corrected automatically.
- required only sets aria-required on a child that actually consumes field props — a third-party control placed as a direct child will show the asterisk but be missing the ARIA attribute unless it merges props via a render function or useFieldControlProps_unstable.
- When the child control is disabled, the label intentionally remains readable rather than being visually disabled.
- Self-labeled controls such as Checkbox, Radio, and Switch should be used inside Field without a Field label, otherwise the control carries two labels.
- Inputs that render their own validation UI in addition to Field's messages can produce duplicate or conflicting error text; let Field be the single source of validation messaging.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
