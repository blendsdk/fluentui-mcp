# Textarea

> **Package**: `@fluentui/react-textarea` v9.7.3
> **Import**: `import { Textarea } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Textarea is the Fluent UI React v9 multi-line plain-text entry control for forms and content authoring surfaces. It renders a native textarea element wrapped in a root element that draws the animated border and focus indicator, so the visible box and the editable surface are two cooperating slots rather than one element. Textarea supports three visual appearances (outline, filled-darker, and filled-lighter, plus the deprecated filled-darker-shadow and filled-lighter-shadow variants), three sizes (small, medium, and large), and four resize modes (none, horizontal, vertical, and both) that control which direction the user is allowed to drag the control. It works controlled through value plus onChange, or uncontrolled through defaultValue, and its onChange callback receives both the React change event and a data object containing the current text so consumers can enforce limits, run validation, or drive dependent UI. Because it is a native textarea underneath, all standard HTML textarea attributes, DOM events, and the ref are forwarded to the editable element, making it straightforward to integrate with form libraries, autosave hooks, or keyboard-shortcut handling.

**When to use**: Use Textarea whenever the expected answer is free-form, multi-line, and potentially long: comments, descriptions, notes, bios, support tickets, code fragments typed as plain text, or any field where a line break is meaningful. Use Input instead when the answer is a single line such as a name, email, or search term, because Input enforces a single-line mental model and pairs with the same Field and appearance system. Use a Select, Dropdown, Combobox, or RadioGroup when the answer must come from a known set of options, and reserve Textarea for genuinely open-ended input. Reach for Textarea over a rich-text editor when formatting is not required, since plain text is easier to validate, store, and render safely. Pair it with Field to get a visible label, hint text, required indicator, and validation message without wiring ARIA attributes by hand, and consider Companion components such as ProgressBar or Badge for live character counts when you enforce a limit in onChange.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"outline" \| "filled-darker" \| "filled-lighter" \| "filled-darker-shadow" \| "filled-lighter-shadow" \| undefined` | `outline  Note: 'filled-darker-shadow' and 'filled-lighter-shadow' are deprecated and will be removed in the future.` | No | Styling the Textarea should use. |
| `defaultValue` | `string \| undefined` | — | No | The default value of the Textarea. |
| `onChange` | `((ev: React.ChangeEvent<HTMLTextAreaElement>, data: TextareaOnChangeData) => void) \| undefined` | — | No | Callback for when the user changes the value. |
| `resize` | `"none" \| "horizontal" \| "vertical" \| "both" \| undefined` | `none` | No | Which direction the Textarea is allowed to be resized. |
| `size` | `"small" \| "medium" \| "large" \| undefined` | `medium` | No | Size of the Textarea. |
| `value` | `string \| undefined` | — | No | The value of the Textarea. |

### Prop Guidance

- **appearance**: Selects the visual style of the control. Use outline on standard light surfaces, filled-darker when the surrounding container is light or neutral and you want the control to recede, and filled-lighter when the surrounding container is darker than the default canvas. Whichever filled option you choose, confirm at least a 3:1 contrast ratio against the adjacent color. Avoid the deprecated filled-darker-shadow and filled-lighter-shadow values in new code. `outline`
- **defaultValue**: Sets the initial text for an uncontrolled Textarea. Use it when the value only needs to be read at submit time, which avoids re-rendering the component on every keystroke. Do not combine it with value for the same control, since the controlled value wins and React will warn. `Describe the issue you ran into…`
- **onChange**: Fires on every value change and receives both the change event and a data object containing the current text. Use it for character limits, live validation, autosave, or enabling a submit action. Enforcing a limit here, by ignoring changes that exceed it, keeps the displayed value and the rule in sync. `(ev, data) => data.value.length <= 50 && setValue(data.value)`
- **resize**: Controls which direction the user may drag the resize handle. Defaults to none in v9. Use vertical for comment boxes and descriptions, horizontal only when width is the constraint, both for flexible authoring areas, and none inside fixed-height or grid layouts where growth would break the page. `vertical`
- **size**: Sets the density of the control, affecting typography and internal padding. Use small in dense toolbars or data grids, medium for the default form density, and large for prominent single-field surfaces. When the Textarea sits inside a Field, it inherits the Field size unless you pass size explicitly. `medium`
- **value**: Provides the current text for a controlled Textarea. Always pair it with onChange, because a value without a change handler renders the control effectively read-only. Use the data value from onChange as the source of truth so the rendered text matches the enforced rules. `initial value`
- **root and textarea slots**: The root slot draws the border and focus animation and receives only className and style; the textarea slot is the native element and receives every other prop, attribute, and the ref. Pass className for wrapper sizing and layout, and use a descendant selector when you must change the inner editable surface. `className for wrapper sizing, native attributes such as placeholder, rows, and ref for the textarea`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | Wrapper element used for displaying the borders for Textarea. This wrapper is needed due to the focus indicator border animation. For more information, see Spec.md  The root only receives `className` and `style`. All other props are applied to the `textarea` slot. |
| `textarea` | — | Yes | The `<textarea>` element. This is the primary slot, all native props and ref are applied to this slot. |

## Examples

### Default

```tsx
import * as React from 'react';
import { Field, Textarea } from '@fluentui/react-components';
import type { JSXElement, TextareaProps } from '@fluentui/react-components';

export const Default = (props: Partial<TextareaProps>): JSXElement => (
  <Field label="Default Textarea">
    <Textarea {...props} />
  </Field>
);
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Field, makeStyles, mergeClasses, tokens, Textarea } from '@fluentui/react-components';

export const Appearance = (): JSXElement => {
  const styles = useStyles();

  return (
    <div className={styles.base}>
      <div className={styles.fieldWrapper}>
        <Field label="Textarea with Outline appearance">
          <Textarea appearance="outline" placeholder="type here..." resize="both" />
        </Field>
      </div>

      <div className={mergeClasses(styles.fieldWrapper, styles.inverted)}>
        <Field label={{ children: 'Textarea with Filled Darker appearance', className: styles.invertedLabel }}>
          <Textarea appearance="filled-darker" placeholder="type here..." resize="both" />
        </Field>
      </div>

      <div className={mergeClasses(styles.fieldWrapper, styles.inverted)}>
        <Field label={{ children: 'Textarea with Filled Lighter appearance', className: styles.invertedLabel }}>
          <Textarea appearance="filled-lighter" placeholder="type here..." resize="both" />
        </Field>
      </div>
    </div>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story:
        `Textarea can have different appearances.\n` +
        `The colors adjacent to the Textarea should have a sufficient contrast. Particularly, the color of input with
      filled darker and lighter styles needs to provide a contrast ratio greater than 3 to 1 against the immediate
      surrounding color to pass accessibility requirement.`,
    },
  },
};
```

### Controlled

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Field, Textarea } from '@fluentui/react-components';
import type { TextareaProps } from '@fluentui/react-components';

export const Controlled = (): JSXElement => {
  const [value, setValue] = React.useState('initial value');

  const onChange: TextareaProps['onChange'] = (ev, data) => {
    if (data.value.length <= 50) {
      setValue(data.value);
    }
  };

  return (
    <Field label="Controlled Textarea limiting the value to 50 characters">
      <Textarea value={value} onChange={onChange} />
    </Field>
  );
};
```

## Best Practices

### Do's

- Always render Textarea inside a Field with a visible label so the control receives an accessible name; use the placeholder only as supplementary guidance.
- Match appearance to the surface: outline on the default canvas, filled-darker on light or neutral surfaces, and filled-lighter on dark or brand-colored surfaces, and verify at least a 3:1 contrast ratio between the filled control and its immediate surroundings.
- Choose resize intentionally. The v9 default is none, so set vertical or both explicitly when users need to expand the box, and pick none when the surrounding layout is fixed.
- Use controlled value plus onChange when you need character counting, live validation, dependent fields, or submit-button enablement, and enforce limits inside onChange as the Controlled story does by rejecting values longer than 50 characters.
- Use defaultValue and read the value on submit when the form is simple, so you avoid a re-render on every keystroke.
- Give the control a stable initial height with the rows attribute and a min-height style so the form does not jump when the first line of text is entered.
- Pair Textarea with Field hint text to state expectations such as a maximum length, and mirror that limit in the onChange handler so the UI and the rule agree.
- Keep the ref on the textarea element when you need to focus, select, or measure the editable content programmatically, since the ref is forwarded to the textarea slot rather than the root wrapper.

### Don'ts

- Do not use the placeholder as the only label; placeholder text disappears on input and is not reliably announced as an accessible name.
- Do not use appearance values filled-darker-shadow or filled-lighter-shadow; they are deprecated and will be removed in a future release.
- Do not pass value without onChange, which makes the control effectively read-only and produces a React warning about a controlled component without a change handler.
- Do not use Textarea for single-line data such as names, emails, or search queries; use Input so Enter does not insert a newline into the value.
- Do not rely on the browser resize handle for layout-critical sizing; users can resize the control into overflow or collapse it to a single line.
- Do not disable a Textarea to signal that the field is invalid or pending; use validation messaging from Field, or readOnly when the value must remain readable and focusable.
- Do not assume Textarea produces or preserves rich formatting such as bold, lists, or links; it stores plain text with newline characters.
- Do not put a className on Textarea expecting to style the internal editing surface, because the root slot receives className and style while everything else is applied to the textarea slot.

## Anti-Patterns

### Placeholder used as the label

❌ A placeholder disappears as soon as the user types, is not a reliable accessible name, and leaves the user unable to verify what the field was asking for when reviewing a filled form.

✅ Wrap the Textarea in a Field with a visible label, and keep the placeholder only as an example or formatting hint.

### Deprecated shadow appearances in new code

❌ The filled-darker-shadow and filled-lighter-shadow appearance values are marked deprecated and will be removed, so code using them will break on a future upgrade and may not track theme changes correctly.

✅ Use filled-darker or filled-lighter and, if you need elevation, add a shadow through styling with tokens.shadow2 rather than choosing a deprecated appearance value.

### Controlled value without a change handler

❌ Passing value without onChange freezes the visible text: typing produces no visible change, React logs a warning about a controlled component, and screen reader users hear no update.

✅ Either supply onChange and update state from the data value, or switch to defaultValue for an uncontrolled control that manages its own text.

### Styling the wrong slot

❌ Because className and style land on the root wrapper while every other prop is applied to the inner textarea, styles written for the editable surface, such as padding or font overrides, can appear to do nothing.

✅ Use className for wrapper-level layout and a descendant selector from your root class for padding, typography, or color on the editable area.

### Resize enabled inside fixed-height layouts

❌ Allowing drag resizing in a flex or grid container with constrained space lets the user push the control past its container, creating overlap or scrollbars, and users can also collapse it until only one line is visible.

✅ Set resize to none in constrained layouts and communicate a generous min-height through styling and the rows attribute instead.

### Using Textarea for a single-line value

❌ Enter inserts a newline into the stored value, so downstream comparisons, keys, or display logic receive a value with embedded line breaks that the user never intended to enter.

✅ Use Input for names, emails, titles, and search terms, and reserve Textarea for content where a line break is meaningful.

## Accessibility

**Requirements**: Textarea renders a native textarea, so it must always have an accessible name: wrap it in Field (which associates the label and the generated control id) or supply aria-label or aria-labelledby yourself. Any constraint you enforce in JavaScript, such as a character limit, must also be communicated in text through Field hint or validation message rather than color alone. Filled appearances must meet the WCAG 1.4.11 non-text contrast requirement of at least 3:1 against the immediately adjacent color, which the outline appearance satisfies by default against the standard surface. Do not disable the control to convey an error state, and never make a required field visually required only through the asterisk without also exposing required or aria-required.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the Textarea and to the next focusable control in the tab order |
| `Shift+Tab` | Moves focus back to the previous focusable control |
| `Enter` | Inserts a line break in the value; it does not submit the surrounding form |
| `Space` | Inserts a space character in the value |
| `Arrow keys` | Move the caret through the text; when the whole value is selected, the first arrow press collapses the selection |
| `Home / End` | Move the caret to the beginning or end of the current line |
| `Ctrl+Home / Ctrl+End` | Move the caret to the beginning or end of the entire value |
| `Ctrl+A` | Selects all text in the Textarea when focus is inside it |
| `Ctrl+C / Ctrl+X / Ctrl+V` | Copies, cuts, and pastes the selected text |
| `Ctrl+Z / Ctrl+Y` | Undo and redo typed text through native browser behavior |
| `Escape` | Not handled by Textarea itself; when the control lives inside a Dialog or Drawer, Escape is handled by that surface and closes it |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-required, aria-disabled, required, name, id, maxLength

**Screen Reader**: Assistive technology announces the element with a multiline textbox role, followed by its accessible name, the current value, and any hint or validation text wired through aria-describedby. Typing is announced character by character in most screen readers, and the value is read back when focus re-enters the control or when the user navigates within the text. Because Field generates the label association and the description association, keeping the label, hint, and validation message in Field is what makes the announcements accurate; a bare aria-label is announced but hint and error text are not unless you also provide aria-describedby. When the control is disabled, it is removed from the tab order and announced as unavailable, and when it is readOnly the value remains reachable and copyable.

## Styling

Style the wrapper through className and style, since the root slot is the element that draws the border, background, and focus animation, while the inner textarea holds padding, typography, and text color. Common customizations include setting min-height and a fixed rows value to stabilize layout, and reaching the editable element with a descendant selector from your root class when you need to change its padding or font. Useful Griffel tokens for the outline appearance are tokens.colorNeutralBackground1 for the surface, tokens.colorNeutralStroke1 for the resting border, tokens.colorNeutralStroke1Hover for the hovered border, and tokens.colorCompoundBrandStroke for the focus border. For filled appearances use tokens.colorNeutralBackground3 for filled-darker and tokens.colorNeutralBackground1 for filled-lighter, with tokens.colorNeutralStrokeAccessible and tokens.colorNeutralStrokeAccessibleHover for the underline. Text and typography typically use tokens.colorNeutralForeground1 for the value and tokens.colorNeutralForeground3 or tokens.colorNeutralForeground4 for placeholders, with tokens.fontFamilyBase, tokens.fontSizeBase200, tokens.fontSizeBase300, and tokens.fontSizeBase400 along with tokens.lineHeightBase200, tokens.lineHeightBase300, and tokens.lineHeightBase400 changing across the small, medium, and large sizes. Spacing values such as tokens.spacingHorizontalMNudge, tokens.spacingVerticalSNudge, and tokens.spacingVerticalMNudge control internal padding, while tokens.borderRadiusSmall, tokens.borderRadiusMedium, and tokens.borderRadiusLarge control corner rounding. Disabled styling uses tokens.colorNeutralBackgroundDisabled, tokens.colorNeutralStrokeDisabled, and tokens.colorNeutralForegroundDisabled, and error styling uses tokens.colorPaletteRedBorder2 with tokens.colorPaletteRedForeground1. The deprecated shadow appearances pull from tokens.shadow2 and follow the same pattern as their non-shadow counterparts.

## Performance

Every keystroke in a controlled Textarea triggers a React render, so keep the onChange handler light and avoid rebuilding large derived structures or arrays of options on each character; memoize expensive work or debounce it. Uncontrolled usage with defaultValue avoids per-keystroke renders entirely and is the cheaper option for long forms. The component renders two DOM nodes, the root wrapper and the textarea, so it is not a rendering hotspot on its own, but very large text values, thousands of characters, still cost layout time inside the native element, and a browser-managed resize handle can force repeated reflows while the user drags it. makeStyles output is cached per style object, so define styles at module scope with useStyles rather than creating them inside the render path, and avoid inline style objects that create a new identity on every render. Field integration adds its own small wrapper and description elements, which is negligible but worth remembering when rendering hundreds of Textareas in a single virtualized list.

## Theming & Tokens

Textarea reads every color, shape, and typography value from the active FluentProvider theme, so light, dark, and high-contrast themes are handled without extra work. The outline appearance uses tokens.colorNeutralBackground1 for the fill with tokens.colorNeutralStroke1, tokens.colorNeutralStroke1Hover, and tokens.colorNeutralStroke1Pressed for the border, and switches to tokens.colorCompoundBrandStroke for the focus indicator. The filled-darker appearance uses tokens.colorNeutralBackground3 and the filled-lighter appearance uses tokens.colorNeutralBackground1, both with a bottom accent drawn from tokens.colorNeutralStrokeAccessible and tokens.colorNeutralStrokeAccessibleHover, which resolve to the accessible brand-aware stroke in each theme and in forced-colors mode. Text renders with tokens.colorNeutralForeground1, placeholders with tokens.colorNeutralForeground3 or tokens.colorNeutralForeground4, and the disabled state uses tokens.colorNeutralBackgroundDisabled, tokens.colorNeutralStrokeDisabled, and tokens.colorNeutralForegroundDisabled. Sizes map to tokens.fontSizeBase200, tokens.fontSizeBase300, and tokens.fontSizeBase400 with the matching tokens.lineHeightBase values and tokens.fontFamilyBase, while corner rounding comes from tokens.borderRadiusSmall, tokens.borderRadiusMedium, or tokens.borderRadiusLarge depending on the brand theme.

## Migration Notes

In Fluent UI React v8 this control was TextField with the multiline prop set; in v9 it is a dedicated Textarea component, so migrate TextField multiline usage to Textarea and single-line usage to Input. The v8 resizable prop is now resize with the values none, horizontal, vertical, and both, and v8 prop defaults differ: v9 defaults to resize set to none, so any layout that relied on users dragging the corner must opt in explicitly. The v8 underlined boolean became the appearance prop with outline and filled variants, and the shadow variants filled-darker-shadow and filled-lighter-shadow are deprecated replacements for the v8 filled styling. The onChange signature changed from a single event to an event plus a data object exposing the current value, so handlers that read event.target.value should be updated to read the data value. The ref now targets the inner textarea element, and className is applied to the outer wrapper rather than the border-drawing input element, so CSS written against v8 class names must be rewritten for the root plus textarea slot structure.

## Edge Cases

- The root slot receives only className and style, so a className applied to Textarea sizes and positions the wrapper; any padding, font, or text color you set there may not reach the inner textarea element.
- value without onChange renders the control read-only in practice and emits a React warning, which is a common cause of a seemingly broken form field.
- The default resize value is none, which differs from the native textarea default of both, so controls that users expect to drag will not resize until resize is set explicitly.
- The appearance values filled-darker-shadow and filled-lighter-shadow are deprecated and scheduled for removal, even though they still render today.
- A resize handle combined with a constrained container can push the control past its parent or let the user shrink it below a usable height, so pair resize with an explicit min-height.
- Inside a Field, the control inherits the field size, required state, and generated ids for the label, hint, and validation message, so passing size on both Field and Textarea in conflicting ways produces a mismatch between label density and control density.
- Textarea stores plain text only; newlines are preserved but any markup the user types is displayed literally.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
