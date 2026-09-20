# SpinButton

> **Package**: `@fluentui/react-spinbutton` v9.6.3
> **Import**: `import { SpinButton } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

SpinButton is a form input that combines an editable text field with increment and decrement controls for entering numeric values. Beyond typing, users can change the value with the up/down arrow keys, Page Up/Page Down for larger jumps (stepPage), the up/down spin buttons, and Home/End to jump to the configured minimum or maximum. The component can be controlled through the value prop with the onChange callback, or uncontrolled via defaultValue, where it maintains its own state. It also supports a displayValue string so the visible text can be formatted differently from the underlying number — for example currency such as "$1.00" for a value of 1 — while the value prop and onChange data continue to report the numeric form. The root is a div container that supplies className and style, all other native props flow to the internal input, and the appearance, size, precision, step, stepPage, min, and max props shape both the visual presentation and the stepping behavior.

**When to use**: Use SpinButton when users need to enter or adjust a numeric quantity and small, predictable increments are meaningful — quantities in a cart, a port number, a percentage, a timeout, or a currency amount where each step is a recognizable unit. Choose it over a plain Input when the increment/decrement affordance and arrow-key stepping add real value, and over Slider when an exact typed number matters more than a rough visual position and the range may be unbounded or very large. Prefer a plain Input when the value is numeric but stepping is meaningless (for example a zip code, phone number, or an account number), and prefer Select or Dropdown when the valid values are a small fixed set rather than a continuous range. When the field is part of a form with validation messaging, pair it with Field, and pair it with Label to provide an accessible name.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"outline" \| "underline" \| "filled-darker" \| "filled-lighter" \| undefined` | `'outline'` | No | Controls the colors and borders of the input. |
| `defaultValue` | `number \| null \| undefined` | — | No | Initial value of the control (assumed to be valid). Updates to this prop will not be respected.  Use this if you intend for the SpinButton to be an uncontrolled component which maintains its own value. For a controlled component, use `value` instead. (Mutually exclusive with `value`.)  Use `null` to indicate the control has no value. |
| `displayValue` | `string \| undefined` | — | No | String representation of `value`.  Use this when displaying the value to users as something other than a plain number. For example, when displaying currency values this might be "$1.00" when value is `1`.  Only provide this if the SpinButton is a controlled component where you are maintaining its current state and passing updates based on change events. When SpinButton is used as an uncontrolled component this prop is ignored. |
| `max` | `number \| undefined` | — | No | Max value of the control. If not provided, the control has no maximum value. |
| `min` | `number \| undefined` | — | No | Min value of the control. If not provided, the control has no minimum value. |
| `onChange` | `((event: SpinButtonChangeEvent, data: SpinButtonOnChangeData) => void) \| undefined` | — | No | Callback for when the committed value changes. - User presses the up/down buttons (on single press or every spin) - User presses the up/down arrow keys (on single press or every spin) - User *commits* edits to the input text by focusing away (blurring) or pressing enter.   Note that this is NOT called for every key press while the user is editing. |
| `precision` | `number \| undefined` | — | No | How many decimal places the value should be rounded to.  The default is calculated based on the precision of `step`: i.e. if step = 1, precision = 0. step = 0.0089, precision = 4. step = 300, precision = 2. step = 23.00, precision = 2. |
| `size` | `"small" \| "medium" \| undefined` | `'medium'` | No | Size of the input. |
| `step` | `number \| undefined` | `1` | No | Difference between two adjacent values of the control. This value is used to calculate the precision of the input if no `precision` is given. The precision calculated this way will always be greater than or equal 0. |
| `stepPage` | `number \| undefined` | `1` | No | Large difference between two values. This should be greater than `step` and is used when users hit the Page Up or Page Down keys. |
| `value` | `number \| null \| undefined` | — | No | Current value of the control (assumed to be valid).  Only provide this if the SpinButton is a controlled component where you are maintaining its current state and passing updates based on change events; otherwise, use the `defaultValue` property.  Use `null` to indicate the control has no value.  Mutually exclusive with `defaultValue`. |

### Prop Guidance

- **appearance**: Controls the colors and borders of the input. Defaults to outline. Use underline for compact, low-emphasis layouts, filled-lighter when the control sits on a darker surface, and filled-darker when it sits on a lighter surface — always verifying the surrounding contrast requirement. `filled-lighter`
- **size**: Chooses between the small and medium control sizes, defaulting to medium. Use small in dense toolbars, table row editors, or compact forms, and medium for standard form layouts. `small`
- **value**: The current numeric value for a controlled SpinButton. Pass it together with onChange and store the updates yourself; pass null to represent no value. Do not combine with defaultValue. `10`
- **defaultValue**: The initial value of an uncontrolled SpinButton that maintains its own state. Updates after the initial render are ignored, and it is mutually exclusive with value. `10`
- **displayValue**: A formatted string representation of value, such as a currency string, shown instead of the plain number. Only meaningful on a controlled SpinButton, where you keep both the numeric value and the formatted text in state; it is ignored for uncontrolled usage. `$1.00`
- **onChange**: Called when the committed value changes: spin button presses, arrow keys, and committed text edits on blur or Enter. The event data carries either a parsed numeric value, a displayValue to parse, or both, so check for value first and fall back to parsing displayValue. It is not called on every keystroke. `handleSpinButtonChange`
- **min**: The lowest allowed value. Stepping and Home clamp to it, and it contributes the announced minimum. Omit it for an unbounded lower end. `0`
- **max**: The highest allowed value. Stepping and End clamp to it, and it contributes the announced maximum. Omit it for an unbounded upper end. `20`
- **step**: The difference between adjacent values, defaulting to 1. It also determines the default precision, so choose a value whose decimal places match the granularity you want to display. `2`
- **stepPage**: The larger increment used by Page Up and Page Down, defaulting to 1. Set it to a comfortable multiple of step so paging feels like fast-forwarding through the same sequence. `20`
- **precision**: How many decimal places the value is rounded to. When omitted it is inferred from step — step 1 yields precision 0, step 0.0089 yields precision 4, and step 300 yields precision 2. Set it explicitly for currency (2) or any fixed formatting requirement. `2`
- **disabled**: Native pass-through prop applied to the input that removes the control from interaction and focus entirely. Use it only when the field is genuinely unavailable, not to protect a value from editing. `true`
- **readOnly**: Native pass-through prop that blocks input while keeping the control focusable and readable by assistive technology. Prefer it over disabled when the value is simply not editable in the current context. `true`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `decrementButton` | — | Yes | Renders the decrement control. |
| `incrementButton` | — | Yes | Renders the increment control. |
| `input` | — | Yes | Input that displays the current value and accepts direct input from the user. Displayed value is formatted.  This is the primary slot. |
| `root` | — | Yes | The root element of SpinButton is a container `<div>`. The root slot receives the `className` and `style` specified on the `<SpinButton>`. All other native props are applied to the primary slot: `input`. |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, tokens, useId, Label, SpinButton } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  const layoutStyles = useLayoutStyles();
  const id = useId();

  return (
    <div className={layoutStyles.base}>
      <Label htmlFor={id}>Default SpinButton</Label>
      <SpinButton defaultValue={10} min={0} max={20} id={id} />
    </div>
  );
};
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, mergeClasses, tokens, useId, Label, SpinButton } from '@fluentui/react-components';

export const Appearance = (): JSXElement => {
  const styles = useStyles();

  const outlineId = useId('outline-id');
  const underlineId = useId('underline-id');
  const filledLighterId = useId('filledLighter-id');
  const filledDarkerId = useId('filledDarker-id');

  return (
    <div className={styles.base}>
      <div className={styles.field}>
        <Label htmlFor={outlineId}>Outline (default)</Label>
        <SpinButton id={outlineId} />
      </div>

      <div className={styles.field}>
        <Label htmlFor={underlineId}>Underline</Label>
        <SpinButton appearance="underline" id={underlineId} />
      </div>

      <div className={mergeClasses(styles.field, styles.filledLighter)}>
        <Label htmlFor={filledLighterId}>Filled Lighter</Label>
        <SpinButton appearance="filled-lighter" id={filledLighterId} />
      </div>

      <div className={mergeClasses(styles.field, styles.filledDarker)}>
        <Label htmlFor={filledDarkerId}>Filled Darker</Label>
        <SpinButton appearance="filled-darker" id={filledDarkerId} />
      </div>
    </div>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story:
        `SpinButton can have different appearances.\n` +
        `The colors adjacent to the input should have a sufficient contrast. Particularly, the color of input with
      filled darker and lighter styles needs to provide greater than 3 to 1 contrast ratio against the immediate
      surrounding color to pass accessibility requirements.`,
    },
  },
};
```

### Bounds

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, tokens, useId, Label, SpinButton } from '@fluentui/react-components';

export const Bounds = (): JSXElement => {
  const layoutStyles = useLayoutStyles();
  const id = useId();

  return (
    <div className={layoutStyles.base}>
      <Label htmlFor={id}>Bounded SpinButton</Label>
      <SpinButton defaultValue={10} min={0} max={20} id={id} />
      <p>min: 0, max: 20</p>
    </div>
  );
};

Bounds.parameters = {
  docs: {
    description: {
      story: `SpinButton can be bounded with the \`min\` and \`max\` props.
      Using the spin buttons or hotkeys will clamp values in the range of [min, max].
      Users may type a value outside the range into the text input and it will not be clamped
      by the control. Pressing the "home" key will set the value to \`min\` and pressing the "end"
      key will set the value to \`max\` when the props are set.`,
    },
  },
};
```

## Best Practices

### Do's

- Pair every SpinButton with a Label whose htmlFor matches the id you pass to the component, exactly as the Default and Bounds stories demonstrate, so the input has an accessible name.
- Decide once whether the field is controlled or uncontrolled: pass value plus onChange for controlled usage, or defaultValue for uncontrolled usage, never both in the same render tree.
- When you supply displayValue, treat it as the formatted echo of value and keep both in state in your onChange handler, parsing the incoming displayValue back into a number the way the DisplayValue story does.
- Set min and max together when the domain is bounded, and choose a step that divides cleanly into that range so arrow-key stepping lands on sensible values.
- Set stepPage to a multiple of step (for example step 2 with stepPage 20, as shown in the Step story) so Page Up and Page Down feel like a larger version of the same motion.
- Provide precision explicitly when you need a fixed number of decimal places, such as 2 for currency, instead of relying on the precision inferred from the step value.
- Handle the case where onChange reports a displayValue but no numeric value, because uncontrolled typing of non-numeric text can produce data that has no parseable number.
- Use readOnly rather than disabled when the value should remain focusable, selectable, and readable by assistive technology but must not be changed.
- Keep the input wide enough for the largest formatted value your formatter can produce, so long currency strings are not visually truncated.

### Don'ts

- Do not pass both value and defaultValue — they are mutually exclusive and mixing them produces confusing, hard-to-reason-about state.
- Do not expect updates to defaultValue to be respected after the first render; it only seeds the initial value of an uncontrolled SpinButton.
- Do not pass displayValue on an uncontrolled SpinButton — it is ignored unless value is also supplied.
- Do not assume typed input is clamped to min and max; users can type a value outside the range and it is only constrained when the spin buttons, arrow keys, Home, or End are used.
- Do not rely on onChange firing for every keystroke — it only fires when a value is committed through the spin buttons, arrow keys, or a blur/Enter commit, so per-keystroke validation will not work.
- Do not use SpinButton for identifiers, phone numbers, or anything with leading zeros or non-arithmetic formatting, since the control treats the content as a number.
- Do not leave the field unlabeled or rely on placeholder text in place of a Label — placeholder content disappears as soon as the user types.
- Do not rebuild the formatter and parser functions on every render when using displayValue; keep them stable so the parsed value does not drift.
- Do not nest interactive elements inside the SpinButton root; the root is a plain div container and only the input and the two spin buttons are interactive.

## Anti-Patterns

### Mixing value and defaultValue

❌ Supplying both makes it ambiguous whether the SpinButton owns its state, which leads to values that appear to reset, ignore programmatic updates, or drift out of sync with the parent state.

✅ Pick one model. For controlled usage pass value plus onChange and keep the number in your own state; for uncontrolled usage pass only defaultValue and let the component manage it.

### Relying on onChange for every keystroke

❌ onChange fires on committed changes — spin button presses, arrow keys, and text commits on blur or Enter — not on each key press, so validation, formatting, or debounced updates driven from it will feel broken or lag behind what the user typed.

✅ Keep validation and formatting on the commit path and, when displaying a formatted value, reconcile the typed text inside the onChange handler using the displayValue returned in the change data.

### Assuming min and max restrict typed input

❌ Typed text is not clamped by the control, so a user can leave a value outside the configured range until they use the spin buttons, arrow keys, Home, or End.

✅ Treat min and max as stepping bounds and validate or clamp the committed value yourself in onChange if the domain really must be enforced.

### Using displayValue without controlled state

❌ displayValue is ignored on an uncontrolled SpinButton, so a formatter that appears to work in development silently stops being applied once the component owns its value.

✅ Switch to the controlled pattern: hold both the numeric value and the formatted string in state, pass value and displayValue, and update both from onChange.

### Forcing numeric semantics onto non-numeric data

❌ SpinButton parses its content as a number, so identifiers, phone numbers, and values with meaningful leading zeros or non-numeric characters lose their exact representation.

✅ Use Input for values that are only nominally numeric, and reserve SpinButton for quantities where stepping up and down is a meaningful action.

### Using disabled to protect a value

❌ A disabled SpinButton is removed from the focus order and is skipped by assistive technology, so users who need to read the value cannot reach it.

✅ Use readOnly instead, which blocks editing while keeping the control focusable and announced.

## Accessibility

## Performance

SpinButton is a lightweight composition of a div root, one input, and two buttons, so render cost is dominated by whatever state updates you drive from onChange. Because onChange fires only on committed changes rather than on each keystroke, controlled usage avoids a parent re-render per character typed. When you use the controlled plus displayValue pattern, wrap the formatter, the parser, and the change handler in React.useCallback with stable dependencies so the input is not asked to reconcile new function identities on every render, and store the numeric value and the display string together so a single state update keeps them consistent instead of triggering two passes. Avoid computing bounds, steps, or precision from props that change frequently during typing.

## Theming & Tokens

SpinButton consumes Fluent theme tokens rather than hard-coded colors, so it inherits light, dark, and high-contrast themes from FluentProvider. The outline appearance uses tokens.colorNeutralBackground1 for the field and tokens.colorNeutralStroke1 for the border, shifting to tokens.colorNeutralStroke1Hover and tokens.colorNeutralStroke1Pressed on interaction; the underline appearance relies on tokens.colorNeutralStrokeAccessible with the brand focus underline. The filled-lighter appearance is designed for darker surfaces using tokens.colorNeutralBackground1, while filled-darker uses tokens.colorNeutralBackground3 for lighter surfaces. Text uses tokens.colorNeutralForeground1 (and tokens.colorNeutralForeground2 for secondary text), the disabled state combines tokens.colorNeutralForegroundDisabled with tokens.colorNeutralBackgroundDisabled, geometry comes from tokens.borderRadiusMedium, and type sizing draws on tokens.fontSizeBase300 and tokens.fontSizeBase200. The surfaces adjacent to the control must keep at least a 3 to 1 contrast ratio against a filled input, which is why filled appearances should be checked against custom background tokens.

## Migration Notes

Compared with the previous-generation SpinButton, v9 frames the control around slots: root is a div container that receives className and style, the input is the primary slot that receives the remaining native props, and incrementButton and decrementButton are separate slots. The controlled and uncontrolled models are explicit through value and defaultValue, with null representing no value, displayValue providing formatted text, and stepPage governing Page Up and Page Down jumps. The legacy approach of forwarding arbitrary props to the root no longer applies — attach styling and layout to root and native input attributes such as id, disabled, and readOnly to the input.

## Edge Cases

- Typing a value outside min and max is allowed and is only clamped when the user presses the spin buttons, arrow keys, Home, or End.
- Updates to defaultValue after the initial render are not respected, and value and defaultValue are mutually exclusive.
- A value of null represents "no value" and should be handled explicitly in onChange before treating the result as a number.
- Precision is inferred from step when not provided, so an unusual step such as 0.0089 produces precision 4 and can surprise you when the displayed number gains decimal places.
- onChange may report a displayValue without a numeric value, which happens when the typed text cannot be parsed, so fall back to parsing the string yourself.
- displayValue is ignored entirely when the SpinButton is uncontrolled.
- Home and End only jump to min or max when those props are actually provided; otherwise the keys have no effect.
- readOnly keeps the control focusable and announced, while disabled removes it from the focus order and from assistive technology navigation.
- All native props other than className and style land on the input slot, not the root div, which matters when you style or query the container.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
