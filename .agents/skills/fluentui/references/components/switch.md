# Switch

> **Package**: `@fluentui/react-switch` v9.7.3
> **Import**: `import { Switch } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Switch is a form control that represents a binary on/off setting, rendered as a sliding track with a thumb over a hidden native input. Because it maps to a real input element, it carries native form semantics: it can be disabled, required, named for form submission, and it exposes its checked state to assistive technology. Switch is composed of four slots — root, indicator (the track and thumb), input (the hidden, functional element), and an optional label — and supports two sizes, three label positions, controlled and uncontrolled usage, and a focusable-disabled mode. It is typically used in settings panels, preference dialogs, and feature-flag style interfaces where a change takes effect immediately.

**When to use**: Use Switch when a single binary setting is turned on or off and the change is expected to apply immediately (for example enabling notifications, activating a preview feature, or turning on a mode). Use Checkbox instead when the user is selecting items from a set, when the choice is only committed later by a submit action, or when the option is not strictly on/off in nature. Use RadioGroup when there are more than two mutually exclusive options, ToggleButton when the control is an action or mode inside a toolbar, and a MenuItemCheckbox or MenuItemSwitch when the same choice lives inside a menu. Switch is also appropriate when you need the value to participate in native form submission, since native properties such as name, disabled, and required are forwarded to the hidden input.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `checked` | `boolean \| undefined` | `false` | No | Defines the controlled checked state of the Switch. If passed, Switch ignores the `defaultChecked` property. This should only be used if the checked state is to be controlled at a higher level and there is a plan to pass the correct value based on handling `onChange` events and re-rendering. |
| `defaultChecked` | `boolean \| undefined` | `false` | No | Defines whether the Switch is initially in a checked state or not when rendered. |
| `disabledFocusable` | `boolean \| undefined` | `false` | No | When set, allows the Switch to be focusable even when it has been disabled. This is used in scenarios where it is important to keep a consistent tab order for screen reader and keyboard users. |
| `labelPosition` | `"above" \| "after" \| "before" \| undefined` | `after` | No | The position of the label relative to the Switch. |
| `onChange` | `((ev: React.ChangeEvent<HTMLInputElement>, data: SwitchOnChangeData) => void) \| undefined` | — | No | Callback to be called when the checked state value changes. |
| `size` | `"small" \| "medium" \| undefined` | `'medium'` | No | The size of the Switch. |

### Prop Guidance

- **checked**: Controlled state. Provide it when the value must live in your own state or store, and always pair it with onChange so the user can actually change it. When checked is passed, any defaultChecked value is ignored. `checked`
- **defaultChecked**: Uncontrolled initial state. Use it when the switch manages its own state and nothing outside needs to observe the value; it only affects the first render and is overridden by checked. `defaultChecked`
- **onChange**: Called whenever the checked state changes, with the change event and a SwitchOnChangeData object. Use it to mirror the new value into React state in controlled mode, and remember it only fires for real user interaction, not for programmatic state writes. `onChange`
- **disabledFocusable**: Keeps a disabled switch in the tab order so keyboard and screen reader users maintain a consistent tab sequence. It looks and behaves like a disabled switch for interaction purposes but can still receive focus; use it instead of disabled when removing the control from the tab order would be disorienting. `disabledFocusable`
- **labelPosition**: Controls where the label sits relative to the track. Use after (the default) for typical settings rows, before when the toggle should read first, and above for stacked layouts where the label needs its own line. Long labels wrap and the track stays aligned to the first line of text. `above`
- **size**: Selects the overall scale of the track, thumb, and spacing. Use small in dense surfaces and medium for standard forms; the two sizes are the only supported values. `small`
- **label**: The label slot supplies the visible text and, when present, the accessible name. Supply it whenever the setting needs explanation; when space prevents visible text, use aria-label or aria-labelledby on the Switch instead of leaving it unnamed. `Enable notifications`
- **disabled**: A native attribute forwarded to the input slot. It removes the switch from the tab order and prevents toggling — prefer disabledFocusable when the control should stay reachable by keyboard and screen reader users. `disabled`
- **required**: A native attribute forwarded to the input slot that also gives the label required styling. Use it only when the surrounding form truly requires a decision from the user rather than a default. `required`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `indicator` | — | Yes | The track and the thumb sliding over it indicating the on and off status of the Switch. |
| `input` | — | Yes | Hidden input that handles the Switch's functionality.  This is the PRIMARY slot: all native properties specified directly on the `<Switch>` tag will be applied to this slot, except `className` and `style`, which remain on the root slot. |
| `label` | — | No | The Switch's label. |
| `root` | — | Yes | The root element of the Switch.  The root slot receives the `className` and `style` specified directly on the `<Switch>` tag. All other native props will be applied to the primary slot: `input`. |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Switch } from '@fluentui/react-components';
import type { SwitchProps } from '@fluentui/react-components';

export const Default = (props: SwitchProps): JSXElement => <Switch label="This is a switch" {...props} />;

Default.argTypes = {
  checked: {
    control: {
      type: 'inline-radio',
      options: [undefined, false, true],
    },
  },
  defaultChecked: {
    control: {
      type: 'inline-radio',
      options: [false, true],
    },
  },
};
```

### Checked

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Switch } from '@fluentui/react-components';

export const Checked = (): JSXElement => {
  const [checked, setChecked] = React.useState(true);
  const onChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(ev.currentTarget.checked);
    },
    [setChecked],
  );

  return <Switch checked={checked} onChange={onChange} label={checked ? 'Checked' : 'Unchecked'} />;
};

Checked.parameters = {
  docs: {
    description: {
      story:
        'A Switch can be initially checked by passing a value to the `defaultChecked` property, or have its checked ' +
        'value controlled via the `checked` property.',
    },
  },
};
```

### Disabled

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Switch } from '@fluentui/react-components';

export const Disabled = (): JSXElement => (
  <div style={wrapperStyle}>
    <Switch disabled label="Unchecked and disabled" />
    <Switch checked disabled label="Checked and disabled" />
    <Switch disabledFocusable label="Unchecked and disabled focusable" />
    <Switch checked disabledFocusable label="Checked and disabled focusable" />
  </div>
);

Disabled.parameters = {
  docs: {
    description: {
      story: 'A Switch can be disabled.',
    },
  },
};
```

## Best Practices

### Do's

- Always give the switch an accessible name — either through the label slot or, when no visible text is possible (for example in a dense toolbar), through aria-label or aria-labelledby placed on the Switch, which forwards to the hidden input.
- Use the uncontrolled form (defaultChecked) when nothing outside the switch cares about the value, and the controlled form (checked plus onChange) when the value drives other UI, exactly as the Checked story demonstrates.
- In controlled mode, read the freshly applied value from the change event target inside onChange and write it back into state so the visual state and your data never drift apart.
- Choose labelPosition deliberately: after (the default) for settings rows where the toggle trails the text, before when the toggle should lead the row, and above for stacked, narrow form layouts.
- Use size small in dense surfaces such as toolbars, table cells, or side panels, and the default medium size in standard forms.
- Prefer disabledFocusable over disabled when a temporarily unavailable switch must remain in the tab order so keyboard and screen reader users keep a predictable sequence.
- Set width constraints with style or className on the Switch when labels are long; the label wraps to multiple lines and the track stays aligned with the first line of text.
- Pass native attributes such as disabled, required, name, and validation-related props directly on the Switch, since all native properties are applied to the primary input slot.

### Don'ts

- Don't pass checked without handling onChange — the switch becomes effectively read-only for the user because the rendered state can never change.
- Don't pass both checked and defaultChecked expecting defaultChecked to take effect; checked takes precedence and defaultChecked is ignored.
- Don't use Switch for multi-select lists or for destructive actions that need confirmation — that is Checkbox or Button territory.
- Don't render a switch with no label and no aria-label; an unnamed switch is announced as an unlabeled on/off control and gives the user no idea what it controls.
- Don't word the label as the current state (for example 'On' or 'Off'); the label should name the setting, and the component itself communicates the state.
- Don't assume className and style reach the input element — they stay on the root slot, while every other native prop goes to the input slot.
- Don't hard-code colors or sizes in an attempt to restyle the track; override theme tokens through FluentProvider instead so light, dark, and high-contrast themes stay coherent.
- Don't use labelPosition above inside tight horizontal toolbars where vertical space is scarce.

## Anti-Patterns

### Controlled without onChange

❌ Passing checked without an onChange handler renders a switch whose visual state can never change, so it looks interactive but silently ignores the user.

✅ Either supply onChange and write the reported value back to state, or switch to defaultChecked and let the component manage its own state.

### Switch used where Checkbox belongs

❌ Using Switch for multi-select lists, bulk-selection checkboxes, or choices that are only committed on submit implies an immediate, independent effect that does not match the interaction.

✅ Use Checkbox for selection-style choices and reserve Switch for binary settings that take effect immediately.

### State-named label

❌ Labels such as 'On' or 'Off' make the setting meaningless when read aloud, especially because the switch already announces its own state.

✅ Name the setting the switch controls — for example 'Enable notifications' — and let the component communicate whether it is currently on or off.

### Unlabeled switch

❌ A switch with no label and no aria-label is announced as an unlabeled on/off control, leaving screen reader users unable to tell what it will change.

✅ Provide the label slot with descriptive text, or when the layout cannot show text, add aria-label or aria-labelledby on the Switch so the hidden input gets an accessible name.

### Overriding colors per instance

❌ Hard-coding track or thumb colors with inline styles breaks contrast in dark and high-contrast themes and overrides the tokens the component relies on.

✅ Customize through a FluentProvider theme or Griffel classes built from the same tokens the component uses, keeping per-instance styling to layout concerns such as width.

## Accessibility

**Requirements**: Each switch must have an accessible name, either from the label slot or from aria-label/aria-labelledby on the Switch, satisfying WCAG 4.1.2 Name, Role, Value. The on/off state must be programmatically determinable (WCAG 1.3.1 and 4.1.2), which the hidden input handles automatically. The control must be operable by keyboard alone (2.1.1) and reachable in a logical order (2.4.3); when a switch is disabled but still conceptually relevant, disabledFocusable keeps it reachable. Focus must remain visible (2.4.7) — the focus ring is drawn on the indicator, so any custom styling must preserve a visible focus indicator. The track, thumb, and label must maintain sufficient contrast (1.4.3 for text and 1.4.11 for the non-text track/thumb graphics), and the label text should meet the 4.5:1 minimum at the default text size. Ensure the clickable/tappable area around the track is large enough for touch users (2.5.8 Target Size), especially with size small.

| Key | Action |
| --- | --- |
| `Space` | Toggles the switch between the checked and unchecked states while the input has focus. |
| `Tab` | Moves focus to the next focusable element; a plain disabled switch is skipped, while a disabledFocusable switch still receives focus. |
| `Shift + Tab` | Moves focus to the previous focusable element, respecting the same disabled/disabledFocusable rules. |
| `Enter` | Does not toggle a native input-based switch; when the switch sits inside a form, Enter may instead trigger that form's submission. |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-invalid

**Screen Reader**: The hidden input is the accessible element, so screen readers announce the switch role together with the checked state ('on' or 'off') and its accessible name in a single announcement. Toggling with Space produces an immediate state-change announcement. When the native disabled attribute is present, the control is announced as dimmed or unavailable; with disabledFocusable the control remains focusable but still announces its unavailable state, which is why the tab order stays stable. The indicator and label slots are presentational, so the visible label must also be the accessible name (via the label slot) or be replaced by aria-label/aria-labelledby. required makes the label carry required styling and marks the input as required, so assistive technology can announce the requirement, and aria-invalid can be added when validation fails.

## Styling

Because className and style are applied to the root slot, that is the correct place to control layout: set maxWidth on the root to let long labels wrap (as the LabelWrapping story does), or set a fixed width for aligned settings rows. The indicator slot consumes tokens for its geometry and colors — tokens.borderRadiusCircular for the pill shape, tokens.strokeWidthThin for the track border, tokens.colorNeutralBackground1 and tokens.colorNeutralStrokeAccessible for the unchecked track, and a brand background token for the checked track — while the thumb animates over tokens.durationNormal and tokens.curveEasyEase and the focus ring uses tokens.colorStrokeFocus2 with tokens.strokeWidthThick. Spacing between the track and the label comes from horizontal spacing tokens, and small size tightens both the track geometry and that gap. Rather than overriding these per instance, adjust them by supplying a custom theme to FluentProvider so the whole surface (light, dark, high contrast, density) stays consistent; if you must add local styles, target the root with a Griffel class built from the same tokens and avoid raw hex values so contrast is preserved in every theme.

## Performance

Switch is a lightweight leaf component: it renders a root element, the indicator, a hidden input, and an optional label, with no portals, popovers, or extra DOM layers, so rendering many of them is cheap. The main cost is in your own render path — define onChange with a stable callback (the stories use React.useCallback) so switches do not receive new handler identities on every parent render, and keep the checked state as close to the switch as possible rather than lifting a large tree's state just to hold a boolean. The thumb animation is a token-driven transition on the indicator, so it does not trigger layout; animating width or margin instead would. In long lists of switches, avoid passing fresh inline objects through style on every render and prefer a cached Griffel class.

## Theming & Tokens

Switch draws all of its visuals from theme tokens, so it adapts automatically to light, dark, and high-contrast themes. The unchecked track is built from tokens.colorNeutralBackground1 with a tokens.colorNeutralStrokeAccessible border and tokens.strokeWidthThin, while the checked track uses the brand background tokens; the thumb animates between states using tokens.durationNormal and tokens.curveEasyEase and uses tokens.borderRadiusCircular for its shape. The focus indicator uses tokens.colorStrokeFocus2 with tokens.strokeWidthThick, the label text uses tokens.colorNeutralForeground1, and disabled switches use tokens.colorNeutralForegroundDisabled along with the corresponding disabled background tokens for both track and label. Gap between track and label comes from horizontal spacing tokens such as tokens.spacingHorizontalS, with tighter spacing for the small size. Redefining these tokens in a custom theme passed to FluentProvider is the supported way to reskin the switch globally.

## Migration Notes

In v9 the switch is a single component with a label slot and a labelPosition prop, replacing v8's pattern of wrapping a Switch next to a separate Label element — pass text through the label slot and choose its position instead of nesting the control inside a Label. The v9 API also replaces v8's theme-variant and styles-based styling with Griffel classes and theme tokens, and state is reported through the native change event rather than a dedicated callback signature, with Fluent additionally passing a SwitchOnChangeData object as the second argument to onChange. For focusable-but-disabled behavior, use the native-feeling disabledFocusable prop; there is no separate component or wrapper required.

## Edge Cases

- Passing both checked and defaultChecked makes the component controlled; defaultChecked is ignored, which can surprise engineers who expected the initial value to apply.
- className and style land on the root slot, but every other native prop lands on the input slot — so a maxWidth set through style affects the layout wrapper (as the label-wrapping story shows), while disabled and required must be passed as native props rather than through slot styling.
- Long labels wrap to multiple lines and the track stays aligned with the first line of text; with labelPosition above the label occupies its own row, which changes the vertical rhythm of a form.
- disabledFocusable keeps the switch focusable but not operable — keyboard and screen reader users can reach it and hear that it is unavailable, but Space has no effect.
- required adds required styling to the label and marks the native input, but the switch itself does not gate form submission behavior beyond what the browser does for the input.
- In controlled mode the switch reports changes through onChange only for user interaction; writing state directly will not fire the handler, so any side effects tied to the handler must be triggered explicitly.
- Only small and medium sizes exist; there is no large variant, so oversized switches require custom styling that may break token-driven spacing and contrast.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
