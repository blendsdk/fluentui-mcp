# Select

> **Package**: `@fluentui/react-select` v9.5.2
> **Import**: `import { Select } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Select is a form component that renders a styled native HTML select element, giving users a compact way to choose a single value from a predefined list of options. It is composed of three slots: the root wrapper, the select element itself (the primary slot that receives native attributes and events), and an icon slot that typically renders the down-arrow indicator. The component supports four appearances — outline (the default), underline, filled-darker, and filled-lighter — and three sizes that match Input: small, medium, and large. Because the primary slot is a real select element, native form behavior such as defaultValue, value, disabled, id, and form submission all work as expected, and the onChange callback receives both the original React change event and a SelectOnChangeData object containing the newly selected value. Styling is handled with Griffel and Fluent theme tokens, so the control automatically follows the active theme (light, dark, high contrast) and can be extended with makeStyles and mergeClasses.

**When to use**: Use Select when the user must pick exactly one value from a known, moderately sized list of options and screen space is limited — for example choosing a color, a country, a sort order, or a density setting inside a settings panel. Prefer it over a group of Radio buttons when the list is longer than roughly five items or when the form must stay vertically compact, and prefer it over a free-form Input when the value has to come from a constrained set. If users need to type to filter, or the list is very large or loaded asynchronously, use Combobox instead, because Select only offers native type-ahead and no search field. If multiple values may be chosen, use a multi-value control such as TagPicker or Combobox rather than Select. Use Switch or Checkbox for binary on/off choices, and always pair Select with Field or Label when it appears in a real form so it receives an accessible name.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"outline" \| "underline" \| "filled-darker" \| "filled-lighter" \| undefined` | `'outline'` | No | Controls the colors and borders of the Select. |
| `onChange` | `((ev: React.ChangeEvent<HTMLSelectElement>, data: SelectOnChangeData) => void) \| undefined` | — | No | Called when the user changes the select element's value by selecting an option. |
| `size` | `"small" \| "medium" \| "large" \| undefined` | `'medium'` | No | Matches the Input sizes |

### Prop Guidance

- **appearance**: Selects the color and border treatment of the control and defaults to outline. Use outline for standard forms, underline for low-chrome or dense layouts, filled-darker when the control sits on a light surface, and filled-lighter when it sits on a dark or colored surface — always confirming sufficient contrast with the surrounding color. `filled-lighter`
- **size**: Sets the control height and typography and matches the Input sizes. Use small in dense toolbars and tables, medium (the default) for standard forms, and large for prominent or touch-oriented surfaces. Keep it consistent with neighboring Inputs in the same row. `medium`
- **onChange**: Fires when the user selects a different option. Use the second argument's value to drive controlled state instead of reading the DOM, and keep the handler stable when the parent is memoized. `(event, data) => setValue(data.value)`
- **value (native pass-through)**: Use with onChange to build a controlled Select whose displayed value is fully owned by your state, as in the Controlled story where the value is held in React state and updated from data.value. `Blue`
- **defaultValue (native pass-through)**: Use for uncontrolled usage when you only need an initial selection, as in the InitialValue story where the control starts on a non-first option without React state. `Green`
- **disabled (native pass-through)**: Disables the control, removing it from the tab order and from form submission. Use it when the choice is genuinely unavailable rather than to indicate a temporary loading state. `disabled`
- **id (native pass-through)**: Required for label association. Generate it with useId and reuse it for the label's htmlFor so the accessible name is announced correctly in every story pattern. `select-outline`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `icon` | — | Yes | the icon, typically a down arrow |
| `root` | — | Yes | — |
| `select` | — | Yes | Primary slot: the actual `<select>` element |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Select, useId } from '@fluentui/react-components';
import type { SelectProps } from '@fluentui/react-components';

export const Default = (props: SelectProps): JSXElement => {
  const selectId = useId();

  return (
    <>
      <label htmlFor={selectId}>Color</label>
      <Select id={selectId} {...props}>
        <option>Red</option>
        <option>Green</option>
        <option>Blue</option>
      </Select>
    </>
  );
};
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, mergeClasses, Select, tokens, useId } from '@fluentui/react-components';

export const Appearance = (): JSXElement => {
  const styles = useStyles();
  const selectId = useId();

  return (
    <div className={styles.base}>
      <div className={styles.field}>
        <label htmlFor={`${selectId}-outline`}>Outline</label>
        <Select id={`${selectId}-outline`} appearance="outline">
          <option>Red</option>
          <option>Green</option>
          <option>Blue</option>
        </Select>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${selectId}-underline`}>Underline</label>
        <Select id={`${selectId}-underline`} appearance="underline">
          <option>Red</option>
          <option>Green</option>
          <option>Blue</option>
        </Select>
      </div>

      <div className={mergeClasses(styles.field, styles.filledLighter)}>
        <label htmlFor={`${selectId}-filledLighter`}>Filled Lighter</label>
        <Select id={`${selectId}-filledLighter`} appearance="filled-lighter">
          <option>Red</option>
          <option>Green</option>
          <option>Blue</option>
        </Select>
      </div>

      <div className={mergeClasses(styles.field, styles.filledDarker)}>
        <label htmlFor={`${selectId}-filledDarker`}>Filled Darker</label>
        <Select id={`${selectId}-filledDarker`} appearance="filled-darker">
          <option>Red</option>
          <option>Green</option>
          <option>Blue</option>
        </Select>
      </div>
    </div>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story:
        `Select can have different appearances.\n` +
        `The colors adjacent to the input should have a sufficient contrast. Particularly, the color of input with
    filled darker and lighter styles needs to provide greater than 3 to 1 contrast ratio against the immediate
    surrounding color to pass accessibility requirements.`,
    },
  },
};
```

### Controlled

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Select, useId } from '@fluentui/react-components';
import type { SelectProps } from '@fluentui/react-components';

export const Controlled = (): JSXElement => {
  const selectId = useId();
  const [value, setValue] = React.useState('Red');

  const onChange: SelectProps['onChange'] = (event, data) => {
    setValue(data.value);
  };

  return (
    <>
      <label htmlFor={selectId}>Color</label>
      <Select id={selectId} onChange={onChange} value={value}>
        <option>Red</option>
        <option>Green</option>
        <option>Blue</option>
      </Select>
      <button onClick={() => setValue('Blue')}>Select Blue</button>
    </>
  );
};

Controlled.parameters = {
  docs: {
    description: {
      story: 'The value of a Select can be controlled by updating the `selected` prop on `option` elements.',
    },
  },
};
```

## Best Practices

### Do's

- Always give the control an accessible name by pairing it with a Label wired to its id, or by passing aria-label when no visible label is possible; the useId hook is the recommended way to keep ids unique across instances.
- Set an intentional initial state with defaultValue for uncontrolled usage, or with value plus onChange for controlled usage, so the first option is not silently treated as the user's answer.
- Read the selected value from the second argument of onChange (data.value) rather than digging into the event target; the component already normalizes it for you.
- Match the Select size to surrounding Input controls so rows in a form keep a consistent baseline and control height.
- Choose an appearance that fits the surface: outline for standard forms, underline for low-chrome or data-dense layouts, filled-darker on light backgrounds, and filled-lighter on dark or colored backgrounds, then verify the surrounding contrast.
- Keep option labels short, human readable, and logically ordered (alphabetical or by frequency) so native type-ahead lands on the intended option.
- Use the native disabled attribute when a choice is temporarily unavailable so the layout does not shift and the reason stays visible.
- Keep the icon slot as a down-arrow disclosure indicator; it is what tells users the closed control is a choice rather than a text field.

### Don'ts

- Don't use Select for on/off or yes/no decisions; Switch or Checkbox communicates binary state with fewer interactions.
- Don't leave the control unlabeled and rely on the first option acting as a placeholder — screen reader users hear only the value with no field name.
- Don't provide both value and defaultValue on the same instance, and never switch an instance from uncontrolled to controlled mid-life.
- Don't use Select when the list must be searched, paged, or fetched as the user types; that experience belongs to Combobox.
- Don't use the filled appearances on surfaces that fail to provide sufficient contrast against the field; the field boundary disappears, which the Appearance story explicitly warns about for filled-darker and filled-lighter.
- Don't pack dozens of long option labels into a narrow Select — the closed control truncates the value and the user can no longer read what is selected.
- Don't replace the icon with unrelated content or hard-code colors that bypass theme tokens, since dark theme and high-contrast mode will break.
- Don't treat disabled as read-only: a disabled Select is removed from the tab order and its value is not submitted with the form.

## Anti-Patterns

### Select used as a searchable picker

❌ Select renders a native popup with no filter field, so users must scroll through long lists and can only rely on prefix type-ahead; asynchronous or virtualized data cannot be supported at all.

✅ Use Combobox when the list is long, remote, or needs filtering as the user types, and keep Select for short, static, known option sets.

### Placeholder implied by the first option

❌ A native select always selects something: if no defaultValue or value is supplied and no empty option exists, the first option becomes the value and may be submitted even though the user never chose it. Screen reader users also hear a value without realizing they must make a choice.

✅ Add an explicit empty or prompt-style option as the first child, or initialize defaultValue/value deliberately, and mark the field required with a proper Label so the expectation is clear.

### Mixing controlled and uncontrolled state

❌ Passing both value and defaultValue, or flipping an instance between them, leaves React warning and the visible value able to desync from application state.

✅ Pick one model for the lifetime of the instance: defaultValue for uncontrolled usage, or value combined with onChange and data.value for controlled usage.

### Hard-coded colors and altered icon slot

❌ Overriding colors with inline styles or replacing the down-arrow icon with arbitrary content breaks dark theme, high-contrast mode, and the visual affordance that tells users the control is a choice.

✅ Pick one of the four appearance values, theme through the neutral Griffel tokens, and leave the icon slot as the disclosure indicator.

### Binary decisions expressed as a Select

❌ A two-option Select hides one of the two states behind a popup, adds an extra interaction, and reads poorly for settings that are conceptually on or off.

✅ Use Switch for immediate on/off settings or Checkbox where a form submit is needed.

## Accessibility

**Requirements**: Because the primary slot is a native select element, the browser supplies listbox semantics, focus handling, and change announcements, so the application is responsible for naming, contrast, and state. Every Select must have an accessible name — either a visible Label linked to the component's id or an aria-label/aria-labelledby — satisfying WCAG 1.3.1 and 3.3.2. The Appearance story calls out that filled-darker and filled-lighter instances need more than 3:1 contrast against the color immediately surrounding the control to meet WCAG 1.4.11 non-text contrast, and the same expectation applies to the outline border and the underline stroke. Disabled and placeholder states must remain perceivable, and any error or helper messaging must be connected to the control rather than rendered as free-floating text.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into or out of the Select; the control participates in the normal tab order and is skipped entirely when disabled. |
| `Space` | Opens the option list so options can be browsed with the arrow keys. |
| `Enter` | Opens the option list on platforms that support it and commits the highlighted option, closing the list. |
| `ArrowDown` | Moves the highlight to the next option; when the list is closed, most browsers change the selected value directly. |
| `ArrowUp` | Moves the highlight to the previous option; when the list is closed, most browsers change the selected value directly. |
| `Home` | Jumps to the first option in the list. |
| `End` | Jumps to the last option in the list. |
| `Escape` | Closes the open option list without committing a new selection where the platform supports closing a native popup. |
| `Alt+ArrowDown` | On Windows, opens the option list when the control is closed. |
| `Character keys` | Type-ahead navigation: typing one or more characters moves the highlight to the first option that starts with that text. |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-expanded (exposed by the browser for the native select, not authored manually), aria-haspopup (exposed by the browser for the native select, not authored manually)

**Screen Reader**: Screen readers announce the accessible name, the role of the control (combo box or collapsed list box depending on browser and browsing mode), and the currently selected value, along with a hint that a list of options is available. Arrow-key navigation changes the value and each change is announced as the new selection, while the option list itself is rendered by the operating system and read out through the browser's native accessibility tree. Disabled instances are announced as unavailable and are not reachable with the keyboard.

## Styling

The default outline appearance is drawn with tokens.colorNeutralStroke1 for the resting border, tokens.colorNeutralBackground1 for the field surface, tokens.colorNeutralForeground1 for the value text, and tokens.colorNeutralForeground2 for the down-arrow icon, with the focus treatment coming from the shared focus stroke such as tokens.colorStrokeFocus2. The filled-darker appearance maps to the darker neutral surface (tokens.colorNeutralBackground3) and filled-lighter to tokens.colorNeutralBackground1, which is exactly why the Appearance story warns about the 3:1 contrast between the field and the color immediately adjacent to it. Disabled instances rely on tokens.colorNeutralForegroundDisabled and tokens.colorNeutralBackgroundDisabled. Corners come from tokens.borderRadiusMedium, borders from tokens.strokeWidthThin, and typography from tokens.fontFamilyBase with tokens.fontSizeBase200, tokens.fontSizeBase300, and tokens.fontSizeBase400 aligning to the small, medium, and large sizes. Use makeStyles and mergeClasses (the pattern shown in the Appearance story) for the surrounding field container, and reserve the className you pass to the component for layout and spacing on the root wrapper rather than for colors, so theme and high-contrast modes keep working. Use tokens.spacingVerticalS or tokens.spacingVerticalM between a label and the control to match the rest of a Fluent form.

## Performance

Select is one of the cheapest controls in the library: it renders a root wrapper, a single native select element, and an icon, and all popup, positioning, and scrolling behavior is delegated to the browser, so there is no JavaScript overlay to mount. Rendering cost scales with the number of option children placed in the DOM, so very large lists should move to Combobox, which can virtualize. Keep the onChange handler stable with useCallback when the parent is memoized, avoid recreating inline style objects or Griffel classes on every render, and prefer controlled state that lives close to the control so unrelated keystrokes elsewhere in a large form do not re-render the select.

## Theming & Tokens

Select consumes Fluent theme tokens rather than hard-coded colors, so it adapts automatically when a Provider switches between light, dark, and high-contrast themes. Neutral surfaces and strokes come from tokens such as tokens.colorNeutralBackground1, tokens.colorNeutralBackground3, tokens.colorNeutralStroke1, and tokens.colorNeutralStrokeAccessible; text uses tokens.colorNeutralForeground1 and the icon uses tokens.colorNeutralForeground2; disabled states use tokens.colorNeutralForegroundDisabled and tokens.colorNeutralBackgroundDisabled; focus uses tokens.colorStrokeFocus2. Shape and spacing come from tokens.borderRadiusMedium, tokens.strokeWidthThin, and the spacing scale, while typography uses tokens.fontFamilyBase with tokens.fontSizeBase200, tokens.fontSizeBase300, and tokens.fontSizeBase400 for the three sizes. Note that Select deliberately has no brand or primary appearance — the available appearances are neutral surfaces only — so brand accenting belongs to the surrounding layout rather than to this control.

## Migration Notes

This is the v9 Select, so styling is expressed through Griffel makeStyles and theme tokens rather than the legacy styling API, and the control is themed through the neutral tokens listed above. The appearance prop is the way to express variants — outline, underline, filled-darker, and filled-lighter — instead of separate styled components, and size values small, medium, and large are aligned with Input so form rows can mix controls freely. The component still renders a genuine native select element, so any behavior that depended on it being a real form control (form submission, native validity, browser popups) continues to work unchanged.

## Edge Cases

- A Select with no defaultValue or value automatically selects its first option, so the control can never display a true 'nothing selected' state unless you add an empty or prompt option as the first child.
- The option list is rendered by the operating system, so option styling, row height, and the number of visible rows vary by browser and platform; only the closed control is fully styleable.
- Passing undefined versus null to value, or adding defaultValue later, can change the control between controlled and uncontrolled mode and produce confusing behavior.
- Disabled instances are removed from the tab order and their value is not included in form submission, which surprises teams that use disabled to mean read-only.
- The underline appearance has a very low-contrast boundary on light surfaces and a subtler focus treatment than outline, so verify it against your actual background.
- Replacing the select slot with custom content means you own the select semantics, keyboard behavior, and name/value submission that the native element provided for free.
- Long option labels are truncated inside the closed control, especially at small size, so users may not be able to read the full selected value without opening the list.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
