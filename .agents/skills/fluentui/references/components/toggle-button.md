# ToggleButton

> **Package**: `@fluentui/react-button` v9.9.2
> **Import**: `import { ToggleButton } from '@fluentui/react-components';`
> **Category**: buttons
> **Stability**: stable

## Overview

ToggleButton is a two-state button that stays pressed (checked) or unpressed (unchecked) and is used to turn a single option on or off. It is built on the same foundation as Button, so it shares button rendering, sizing, and accessibility behavior while adding a visual selected state driven by the checked and defaultChecked props. Because it maintains state, ToggleButton is appropriate for formatting controls, view switchers, filter chips, or any binary command where the pressed state must remain visible after interaction. It supports five appearance variants (default, primary, outline, subtle, transparent), three shapes (rounded, circular, square), three sizes (small, medium, large), an optional icon rendered before or after the label, and disabled plus disabledFocusable states. The isAccessible prop switches the checked state to an alternate set of higher-contrast selected styles for cases where the checked state is not conveyed by an icon swap.

**When to use**: Use ToggleButton when a single control must hold a persistent on/off state that the user can see after the interaction completes, such as bolding text, enabling a grid view, or pinning a panel. Use Button instead when the action is momentary and has no lingering state. Use Checkbox or Switch instead when the option is part of a form field with a visible label describing the setting, and use ToolbarToggleButton inside a Toolbar when the toggle participates in a grouped command surface with roving focus. For mutually exclusive choices, prefer a radio group or ToolbarRadioGroup rather than several ToggleButtons, since multiple checked ToggleButtons do not express single-selection semantics.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `checked` | `boolean \| undefined` | `false` | No | Defines the controlled checked state of the `ToggleButton`. If passed, `ToggleButton` ignores the `defaultChecked` property. This should only be used if the checked state is to be controlled at a higher level and there is a plan to pass the correct value based on handling `onClick` events and re-rendering. |
| `defaultChecked` | `boolean \| undefined` | `false` | No | Defines whether the `ToggleButton` is initially in a checked state or not when rendered. |
| `isAccessible` | `boolean \| undefined` | `false` | No | Defines whether the `ToggleButton` should use the alternate selected styles that have adequate contrast with the rest style |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { ToggleButton } from '@fluentui/react-components';
import type { ToggleButtonProps } from '@fluentui/react-components';

export const Default = (props: ToggleButtonProps): JSXElement => <ToggleButton {...props}>Example</ToggleButton>;
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, ToggleButton } from '@fluentui/react-components';
import { bundleIcon, CalendarMonthFilled, CalendarMonthRegular } from '@fluentui/react-icons';

export const Appearance = (): JSXElement => {
  const [checked1, setChecked1] = React.useState(false);
  const [checked2, setChecked2] = React.useState(false);
  const styles = useStyles();

  const toggleChecked = React.useCallback(
    (buttonIndex: number) => {
      switch (buttonIndex) {
        case 1:
          setChecked1(!checked1);
          break;
        case 2:
          setChecked2(!checked2);
          break;
      }
    },
    [checked1, checked2],
  );

  return (
    <div className={styles.wrapper}>
      <ToggleButton
        checked={checked1}
        icon={checked1 ? <CalendarMonth /> : <CalendarMonthRegular />}
        onClick={() => toggleChecked(1)}
      >
        Default
      </ToggleButton>
      <ToggleButton
        appearance="primary"
        checked={checked2}
        icon={checked2 ? <CalendarMonth /> : <CalendarMonthRegular />}
        onClick={() => toggleChecked(2)}
      >
        Primary
      </ToggleButton>
      <ToggleButton appearance="outline" icon={<CalendarMonth />} onClick={() => toggleChecked(3)}>
        Outline
      </ToggleButton>
      <ToggleButton appearance="subtle" icon={<CalendarMonth />}>
        Subtle
      </ToggleButton>
      <ToggleButton appearance="transparent" icon={<CalendarMonth />}>
        Transparent
      </ToggleButton>
    </div>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story:
        '- `(undefined)`: the toggle button appears with the default style\n' +
        '- `primary`: emphasizes the toggle button as a primary action.\n' +
        '- `outline`: removes background styling.\n' +
        '- `subtle`: minimizes emphasis to blend into the background until hovered or focused\n' +
        '- `transparent`: removes background and border styling.\n',
    },
  },
};
```

### AccessibleAppearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, ToggleButton } from '@fluentui/react-components';

export const AccessibleAppearance = (): JSXElement => {
  const [checked1, setChecked1] = React.useState(false);
  const [checked2, setChecked2] = React.useState(false);
  const styles = useStyles();

  const toggleChecked = React.useCallback(
    (buttonIndex: number) => {
      switch (buttonIndex) {
        case 1:
          setChecked1(!checked1);
          break;
        case 2:
          setChecked2(!checked2);
          break;
      }
    },
    [checked1, checked2],
  );

  return (
    <div className={styles.wrapper}>
      <ToggleButton checked={checked1} onClick={() => toggleChecked(1)} isAccessible>
        Default
      </ToggleButton>
      <ToggleButton appearance="primary" checked={checked2} onClick={() => toggleChecked(2)} isAccessible>
        Primary
      </ToggleButton>
      <ToggleButton appearance="outline" onClick={() => toggleChecked(3)} isAccessible>
        Outline
      </ToggleButton>
      <ToggleButton appearance="subtle" isAccessible>
        Subtle
      </ToggleButton>
      <ToggleButton appearance="transparent" isAccessible>
        Transparent
      </ToggleButton>
    </div>
  );
};

AccessibleAppearance.parameters = {
  docs: {
    description: {
      story:
        'Appearance variants with isAccessible set, showing more contrasting colors when checked. The primary variant uses the same colors, but with an inset stroke for the checked state.\n\nThis approach is available for when the icon is not used to differentiate checked vs. unchecked states.',
    },
  },
};
```

## Best Practices

### Do's

- Decide between controlled and uncontrolled usage up front: pass defaultChecked for simple, self-managed toggles and checked with an onClick state update when another part of the UI depends on the state.
- Update the checked value in the onClick handler whenever you pass checked, mirroring the pattern in the Checked and Appearance stories with a state setter.
- Use the isAccessible prop, as shown in the AccessibleAppearance story, when the checked state is not communicated by an icon change, because the default selected styles may not have enough contrast on their own.
- Swap the icon between a regular and filled version of the same glyph when checked, which gives users a non-color cue that the button is active; the Icon and Appearance stories use a bundled calendar icon for exactly this.
- Provide an accessible name for icon-only toggles by pairing them with a Tooltip with relationship set to label, as demonstrated in the Icon story, or by supplying an aria-label.
- Choose appearance deliberately: primary emphasizes an active filter or mode, while subtle and transparent let toggles sit unobtrusively in dense surfaces like toolbars or headers.
- Prefer disabledFocusable over disabled when the toggle lives in a menu or command surface and the tab order must stay stable for keyboard and screen reader users.

### Don'ts

- Do not use a ToggleButton for a one-shot action such as Save or Submit; a momentary action belongs on Button because it has no selected state to expose.
- Do not pass checked without also handling onClick and updating the value, since the toggle will appear frozen and users will assume it is broken.
- Do not use several ToggleButtons to represent a single-choice group; use a radio group or ToolbarRadioGroup so that only one option can be selected.
- Do not leave an icon-only ToggleButton without a Tooltip label or aria-label; users who cannot see the glyph have no way to identify the control.
- Do not rely on background color alone to signal the checked state in low-contrast contexts; either swap the icon or enable isAccessible so the state remains perceivable.
- Do not override the disabled styling with custom class names to simulate a clickable disabled toggle; pass disabled or disabledFocusable so assistive technology receives the correct state.
- Do not mix defaultChecked and checked on the same toggle expecting them to combine; when checked is supplied it takes precedence and defaultChecked is ignored.

## Accessibility

## See Also

- [buttons category](../categories/buttons.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
