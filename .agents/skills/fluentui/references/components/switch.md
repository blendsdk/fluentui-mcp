# Switch

> **Package**: `@fluentui/react-switch` v9.7.3
> **Import**: `import { Switch } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Switch is a form component that lets a user flip a single option between on and off, and it is designed for settings whose change takes effect immediately instead of values that are collected and submitted later. Visually it is a pill-shaped track with a thumb that slides between the unchecked and checked positions, plus an optional label that the component renders before, above, or after the track. Internally it is composed of four slots: a root element that receives only the className and style passed directly to the component, an indicator that draws the track and the sliding thumb, a hidden native input that is the primary slot and owns the checked state plus every other native property passed to the component, and an optional label slot whose label text also becomes the accessible name of the input. Switch supports controlled usage through the checked prop together with onChange, uncontrolled usage through defaultChecked, two sizes, disabled and disabledFocusable states, and the native required attribute, which additionally applies required styling to the rendered label. It is a small, self-contained control that renders its own label, so there is no need to compose it with a separate Label component in the common case.

**When to use**: Use Switch when a user is turning a single, independent option on or off and the result should apply immediately, such as enabling notifications, activating a preview feature, or toggling a setting in a preferences panel. Because a switch communicates instant effect, it is a poor fit for values that are only committed when a form is submitted; use Checkbox in that case, since a checkbox reads as a value being selected for later submission. Use Radio when the choices are mutually exclusive and use Select or Combobox when there are more than two options or the list is long. Use a Button instead of a Switch when the interaction performs an action rather than holding a persistent state. If the setting cannot actually be applied immediately, either apply it optimistically with feedback or choose Checkbox so the user's expectation matches the behavior.

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

- **checked**: Use for controlled switches where the parent owns the state. It takes precedence over defaultChecked, so always pair it with onChange and re-render with the value from the change event; a controlled switch with no handler is effectively read-only. `checked={isEnabled}`
- **defaultChecked**: Use for uncontrolled switches that only need an initial value. Because it applies at mount time only, do not attempt to use it to push new values later; switch to the controlled checked prop when the value must be driven from outside. `defaultChecked`
- **onChange**: Fires whenever the checked state changes through the input. Read the new value from the change event (the data argument also describes the change) and store it in state for controlled usage, or perform the side effect of applying the setting right away for uncontrolled usage. `(ev, data) => setChecked(ev.currentTarget.checked)`
- **disabledFocusable**: Use when the switch is disabled but must remain in the tab order, such as a temporarily unavailable setting in a toolbar, so keyboard and screen reader users still encounter it while it cannot be toggled. Choose plain disabled when the control should be skipped entirely. `disabledFocusable`
- **labelPosition**: Controls where the label slot renders relative to the track and defaults to after. Use before in settings rows where labels are left-aligned and controls right-aligned, and above when labels are long or the switch is narrow. `before`
- **size**: Selects the switch dimensions and defaults to medium. Use small in dense surfaces and keep a single size within a group; there is no large size, so scale the layout instead of the control when more prominence is needed. `small`
- **label**: Provides the visible label through the label slot, which is also the accessible name of the input. Wrap-prone text is supported, and combining it with the native required attribute adds the required styling to the label. `label="Enable notifications"`
- **disabled**: A native passthrough applied to the input that removes the switch from interaction and from the tab order; the label receives the disabled styling as well. Prefer disabledFocusable when the control must stay reachable by keyboard. `disabled`
- **required**: A native passthrough applied to the input that also styles the label as required. Use it for genuinely mandatory settings, and remember that native required validation on a checkbox-type input blocks form submission until the switch is checked. `required`

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

- Give every Switch an accessible name by passing the label prop, or by passing aria-label when no visible label is desired; an unnamed switch is announced only as an unnamed toggle.
- Use the checked prop together with onChange when the state lives in a parent component, and read the new value from the change event as the checked story does, so the rendered state always matches the source of truth.
- Use defaultChecked only for the initial uncontrolled state; treat it as a starting value that is not updated after mount.
- Position the label with labelPosition to match the surrounding layout: before when the switch sits at the trailing edge of a settings row, after in most standalone cases, and above when the label is long or the control must occupy a narrow column.
- Use size small in dense surfaces such as toolbars, table rows, or side panels, and keep every switch in the same group at the same size for visual rhythm.
- Use disabledFocusable instead of disabled when a disabled switch should stay in the tab order so that keyboard and screen reader users can still reach and understand it.
- Apply the setting as soon as the switch is toggled, and surface the result with a MessageBar or Toast when the outcome is not obvious from the surrounding UI.
- Keep the label text describing the setting being controlled rather than the action, so the accessible name stays meaningful in both the on and off states.

### Don'ts

- Do not use a Switch for mutually exclusive choices; a radio group communicates single-selection semantics far better.
- Do not use a Switch as a multi-select control inside a form that is submitted later; that pattern is a Checkbox.
- Do not pass the checked prop without also handling onChange, because the switch becomes permanently unchangeable and React reports a controlled-input warning.
- Do not rely on the brand color of the track alone to convey state; the thumb position is the second cue, and the label should make the meaning clear without color.
- Do not use disabled purely to take a control out of the interaction while still expecting users to tab to it; that is what disabledFocusable is for.
- Do not hide the label with CSS if it is the only accessible name for the switch, because the input would become unlabeled for assistive technology.
- Do not place an additional click handler on a wrapper element that toggles the same state, since a click on the label already forwards to the input and can produce a double toggle.
- Do not change the label text between the checked and unchecked states as a way of showing status, because the accessible name is re-announced and users lose the stable identifier of the setting.

## Anti-Patterns

### Controlled switch with no change handler

❌ Passing checked while omitting onChange freezes the switch in whatever state the prop supplies, so clicks appear to do nothing and React logs a controlled-input warning.

✅ Either supply onChange and update the state that feeds checked, or drop checked and use defaultChecked for an uncontrolled switch.

### Using a Switch as a form checkbox

❌ A switch signals that the change happens immediately, so users expect the setting to apply as soon as they toggle it; when the value is only read on submit, the interaction lies about its effect.

✅ Use Checkbox when the value is collected and submitted later, and reserve Switch for settings that take effect at once.

### Communicating state with color only

❌ A user who cannot distinguish the brand-colored checked track from the neutral unchecked track loses the entire meaning of the control, and the accessible name may not mention the state at all.

✅ Rely on the thumb position, the announced native checked state, and a stable descriptive label so the state is conveyed through multiple channels.

### Switching a control off with disabled

❌ Replacing a normal switch with a disabled one removes it from the tab order, so keyboard and screen reader users cannot discover that the setting exists or why it is unavailable.

✅ Use disabledFocusable to keep the switch reachable and announce it as unavailable, and reserve disabled for controls that should be skipped entirely.

### Local mirroring of the checked prop

❌ Copying the checked prop into local state and syncing it with an effect creates a second source of truth that can drift from the parent value and drop rapid toggles.

✅ Pick one model per switch: controlled with checked plus onChange, or uncontrolled with defaultChecked, and never mix the two patterns in the same component.

### Wrapper click handlers that toggle the same state

❌ Clicking the label already forwards the activation to the hidden input, so an additional click handler on a surrounding element can toggle the state twice and leave it unchanged.

✅ Handle state changes only through onChange, and let the label slot and the input manage click behavior on their own.

## Accessibility

**Requirements**: Each Switch must expose a name and a state. Because the primary slot is a hidden native input, the label slot is wired to that input so its text provides the accessible name, and a visible label is strongly preferred over an invisible one. When no visible label is possible, pass aria-label or reference external text with aria-labelledby, and use aria-describedby for supplementary hints. Color contrast between the track, the thumb, and the surrounding surface must meet WCAG 2.1 AA (4.5:1 for the label text at small sizes and 3:1 for the non-text state indicator), and the focus indicator must remain visible with at least a 3:1 contrast against the adjacent background. The target must be operable by keyboard alone, and the setting it controls must be applied immediately so the announced state matches reality.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the Switch input when it is next in the tab order; a switch rendered with disabledFocusable remains in this order while a fully disabled one is skipped. |
| `Shift+Tab` | Moves focus backwards out of the Switch to the previous focusable element. |
| `Space` | Toggles the checked state of the focused Switch and fires the onChange callback with the new value. |
| `Enter` | Does not toggle the Switch; if the component sits inside a form, Enter may submit that form, so avoid using Enter as a toggle shortcut. |

**ARIA**: role="switch" on the input slot, aria-label, aria-labelledby, aria-describedby, aria-disabled when the switch is disabled but kept focusable, aria-required, implied by the native required attribute, native checked state exposed by the hidden input, native disabled attribute when the Switch is fully disabled

**Screen Reader**: Assistive technology treats the hidden input as a switch, announcing the accessible name followed by the current on or off state, and it announces the new state after each toggle because the change is driven by the native input rather than by a consumer-managed visual. A switch created with disabledFocusable remains reachable by Tab and is announced as unavailable so users can still discover the setting, while a fully disabled switch is removed from the tab order entirely and is typically skipped. When the label text is provided through the label slot it becomes the announced name automatically; when the label is omitted, the name comes from aria-label or aria-labelledby, and any leftover unlabeled switch is announced generically, which makes its purpose unclear.

## Styling

The root slot is the element that receives className and style, so this is where you control layout: constrain width on the root, as the label wrapping story does with maxWidth, and the label will wrap onto additional lines while the track stays aligned to the first line of text. Use Griffel with makeStyles and mergeClasses to add classes rather than inline style objects, and drive colors from the theme instead of hard-coding values so light and dark themes stay correct. The pill shape of the track comes from borderRadiusCircular, and the gaps between the label and the indicator use spacing tokens such as spacingHorizontalS and spacingHorizontalMNudge. Label typography maps to fontSizeBase300 with lineHeightBase300, dropping to fontSizeBase200 with the small size, and the label color follows colorNeutralForeground1 with secondary text using colorNeutralForeground2 or colorNeutralForeground3. The focus ring is drawn with colorStrokeFocus2 at strokeWidthThick, and the thumb slide is animated with duration and curve tokens; the hidden input should not be restyled because it is the element that carries the native properties, while the indicator is the element that visually represents the state.

## Performance

Switch renders a small fixed DOM tree, so each instance is inexpensive and thousands can exist on a page before rendering cost becomes visible. The checked state is stored on the input rather than in component state, which keeps uncontrolled switches from triggering any re-render at all; controlled switches re-render their owner on each toggle, so keep that state as close to the switch (or to the smallest list of switches) as practical. Stabilize handlers with useCallback when the surrounding tree is memoized, as the checked and label stories do, so memoized lists do not re-render on every toggle. Avoid recreating inline style objects for the root in hot render paths since Griffel classes plus theme tokens are cheaper than object churn, and avoid lifting all switches in a list into one shared object unless the application genuinely needs to read the aggregate value.

## Theming & Tokens

The checked track is painted with brand tokens, most notably colorCompoundBrandBackground plus colorCompoundBrandBackgroundHover and colorCompoundBrandBackgroundPressed for the interaction states, so re-theming the brand recolors every checked switch. The unchecked track uses the accessible neutral stroke ramp, colorNeutralStrokeAccessible with colorNeutralStrokeAccessibleHover and colorNeutralStrokeAccessiblePressed, while the thumb stays on colorNeutralBackground1 so it reads against both states. Label text uses colorNeutralForeground1, secondary or hint text uses colorNeutralForeground2 or colorNeutralForeground3, and required styling is marked with a palette token such as colorPaletteRedForeground1. Disabled switches fall back to colorNeutralForegroundDisabled for the label together with the disabled neutral stroke and background tokens for the track, and the focus ring is drawn with colorStrokeFocus2 at strokeWidthThick so it stays visible in both light and dark themes. Motion of the thumb is expressed with duration tokens such as durationNormal and curve tokens such as curveEasyEase, which means reduced-motion or brand-specific motion settings flow through automatically from the provider.

## Migration Notes

Version 9 renders a real, visually hidden input as the primary slot, which is a change from earlier Fluent UI versions that simulated the control with a styled element. As a result, every native property passed to the Switch (name, id, disabled, required, aria attributes, event handlers) lands on that input, while className and style stay on the root; code that previously targeted the switch element itself with styles or selectors needs to account for this split. Styling now flows through Griffel and theme tokens instead of style props or legacy stylesheets, so visual overrides should be expressed as classes on the root or as theme token changes. The disabledFocusable prop is available for keeping a disabled switch in the tab order, the size prop accepts small and medium, and the onChange callback receives both the native change event and a data object describing the change, with the new value readable from the event as shown in the stories.

## Edge Cases

- A switch rendered with checked and no onChange becomes permanently read-only and produces a React warning, so a controlled switch always needs its handler.
- defaultChecked only applies to the initial render; changing it later has no effect, and it is ignored entirely when checked is supplied.
- The component renders no label unless the label prop is passed, so a switch without a label or aria-label has no accessible name even though it is still keyboard operable.
- Long labels wrap to multiple lines while the track stays aligned with the first line of text, which means a constrained width on the root (rather than on the label) is the correct way to control layout.
- A disabledFocusable switch can receive focus but still cannot be toggled, so do not rely on it to convey availability through interaction alone.
- Because the native required attribute is applied to the input, a required switch blocks native form submission until it is checked, which is usually the wrong behavior for an optional setting.
- The className and style passed to the component land on the root while every other native property lands on the input, so selectors or ids intended for the visual element need to be applied with that split in mind.
- The size prop only offers small and medium, so there is no built-in way to render a larger switch; increasing font size or using layout prominence is the alternative.

## See Also

- - [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
