# Textarea

> **Package**: `@fluentui/react-textarea` v9.7.3
> **Import**: `import { Textarea } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Textarea is the Fluent UI React v9 form control for multi-line, free-form text entry. It renders a native textarea element wrapped in a root element that draws the border and the animated focus indicator, so it behaves like a standard HTML textarea while picking up Fluent theming, sizing, and appearance styling. The component exposes a small, focused API surface: an appearance (outline, filled-darker, or filled-lighter, plus the deprecated filled-darker-shadow and filled-lighter-shadow), a size (small, medium, or large), a resize direction, and both controlled (value plus onChange) and uncontrolled (defaultValue) value models. Because it is a thin, well-behaved wrapper, all native textarea attributes and the ref are forwarded to the inner textarea slot, while only className and style land on the root wrapper. In practice Textarea is almost always paired with Field, which supplies the visible label, hint text, validation messaging, and the accessible name and description wiring for the control.

**When to use**: Use Textarea when users need to enter more than a short, single line of text: comments, descriptions, bios, notes, code snippets, addresses, or any free-form answer that can wrap across lines. Reach for Input instead when the expected answer is short, single-line, and Enter should submit or advance rather than insert a line break. Because Enter inserts a newline inside a Textarea, it must not be used for search boxes, single-value form rows, or any field where users expect Enter to commit. Choose the appearance based on the surface the control sits on (outline for standard page backgrounds, filled-darker on the lightest surfaces, filled-lighter on darker surfaces), choose resize based on whether the surrounding layout can tolerate the user dragging the grip, and always wrap the control in Field when a label, hint, or validation message is needed.

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

- **appearance**: Selects the visual treatment of the control and should be chosen to match the surface behind it. Use outline for standard page backgrounds and whenever the surrounding color is unknown. Use filled-darker on the lightest surfaces and filled-lighter on darker surfaces, and only when the adjacent colors guarantee more than a 3 to 1 contrast ratio against the control. Avoid the deprecated filled-darker-shadow and filled-lighter-shadow values in new code. `outline`
- **size**: Controls the font size, line height, and vertical padding of the control. Defaults to medium, which matches the default Field size; use small for dense toolbars and compact panels and large for hero or touch-first forms. Keep the Textarea size aligned with the Field size so the label and hint scale with the control. `medium`
- **resize**: Determines which directions the user may drag to resize: none, horizontal, vertical, or both. Defaults to none, which is stricter than the native browser default. Favor vertical or both for long-form content, and keep none when the layout is fixed, when the control sits in a grid where growth would break alignment, or when the surrounding container cannot accommodate a larger element. `vertical`
- **defaultValue**: Sets the initial value in uncontrolled usage, where the DOM owns the state afterward. Use it when you only need to observe changes through onChange, and never combine a changing defaultValue with a value prop on the same instance, since that flips the control between uncontrolled and controlled. `initial value`
- **value**: Sets the value in controlled usage and must always be paired with onChange that writes the new value back into state. Use controlled mode when you need live validation, character limits, formatting, or cross-field dependencies, and follow the character-limit pattern of only accepting the new value when it is within the allowed length so the field never becomes stuck. `value from component state`
- **onChange**: Called whenever the user changes the value, receiving the React change event and a data object whose value member holds the new string. Use the data value rather than reading the DOM, keep the handler cheap, and remember that controlled updates are ignored unless you feed the new value back into the value prop. `data.value holds the new string`
- **root (slot)**: The wrapper element that paints borders, background, border radius, and the animated focus indicator. It receives only className and style, which makes it the correct target for layout, width, margins, and appearance overrides. Do not attach behavior props here; they will not reach the control. `className on the root controls layout and border styling`
- **textarea (slot)**: The native textarea element and the primary slot: all native attributes and the ref are applied here, including placeholder, disabled, required, readOnly, rows, maxLength, autoComplete, id, and any aria attributes. Use these native attributes for behavior that is not covered by the component's own props, such as rows for an initial height. `rows, maxLength, required, and aria-* land on the textarea`

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

- Always give every Textarea a visible label by placing it inside Field, and use the Field label rather than a placeholder; the placeholder disappears as soon as typing starts and is not announced as a name.
- Pair the Textarea with Field hint text when there is a format, length, or content expectation, so the constraint is available to everyone rather than only to users who trip over it.
- Match the Textarea size and the surrounding Field size to the other controls in the same form, so label, hint, and control typography stay aligned.
- Pick the appearance that matches the surface: outline for the default neutral background, filled-darker when the control sits on the lightest surface, and filled-lighter when it sits on a darker surface.
- Choose resize deliberately: vertical or both when users are likely to write long content, none when the layout is fixed or the container cannot accommodate growth.
- Prefer uncontrolled usage with defaultValue and onChange for simple capture, and switch to value with onChange only when you must validate, transform, or cap the value as it is typed.
- Read the new string from the change callback data (the value member of TextareaOnChangeData) instead of reaching into the DOM, since the data payload is the supported contract.
- Set an initial height with the native rows attribute, which is forwarded to the textarea slot, rather than forcing a pixel height on the root wrapper.
- Keep onChange handlers light: record the value or schedule validation, and do the expensive work (network calls, cross-field validation, persistence) outside the keystroke path.
- Add a native maxLength when a hard cap exists so the browser itself stops extra input, and mirror the limit in visible hint text so the rule is discoverable.

### Don'ts

- Do not use placeholder text as the only label; it fails as an accessible name and vanishes once the user types.
- Do not use filled-darker or filled-lighter on a surface that does not provide at least a 3 to 1 contrast ratio against the control, because the filled treatments blend into the surrounding color.
- Do not use the deprecated filled-darker-shadow or filled-lighter-shadow appearances in new code; they are scheduled for removal and will be dropped in a future release.
- Do not switch a single Textarea between value and defaultValue across renders, which flips it between controlled and uncontrolled and produces inconsistent or frozen input.
- Do not force resize to none purely for visual tidiness when users may need more room to read or review long content, especially at high zoom levels.
- Do not use a Textarea for single-line values such as names, search terms, or codes, because Enter creates a newline instead of committing the form.
- Do not expect a className passed to Textarea to style the inner textarea element; only the root wrapper receives className and style, so border, background, and padding customizations must target the root.
- Do not perform heavy per-keystroke work such as synchronous validation of the whole form or an immediate API call inside the change handler.
- Do not rely on the control's own value state to enforce a character limit without also updating that state; a limit that rejects an edit but never accepts the next valid one leaves the field stuck.

## Anti-Patterns

### Placeholder used as the label

❌ A placeholder disappears the moment the user types, provides no accessible name for screen reader users, and gives no persistent indication of what the field is for once the form is partially filled.

✅ Wrap the Textarea in Field with a real label, and move any format guidance into the Field hint so it stays visible and is announced as the control's description.

### Switching between controlled and uncontrolled mid-lifecycle

❌ Passing defaultValue on first render and value later (or the reverse) makes React treat the element as both controlled and uncontrolled, producing console warnings and a field whose typed value can silently fail to appear or fail to clear.

✅ Decide once per instance: use defaultValue plus onChange for uncontrolled capture, or value plus onChange backed by state for controlled capture, and keep that choice stable for the lifetime of the component.

### Filled appearance on an incompatible surface

❌ filled-darker and filled-lighter rely on the surrounding color for separation, so placing them on a surface with insufficient contrast makes the control boundary nearly invisible and fails the 3 to 1 non-text contrast requirement.

✅ Use the outline appearance on default and unknown backgrounds, and only switch to a filled appearance when you control the adjacent color and have verified a contrast ratio greater than 3 to 1.

### Stretching single-line answers into a Textarea

❌ Enter inserts a newline instead of committing, so users of short-value fields (names, search terms, codes, email addresses) end up with accidental line breaks and broken form submission expectations, and screen readers announce a multi-line text box where a single-line field was expected.

✅ Use Input for short values where Enter should submit, and reserve Textarea for genuinely multi-line content such as descriptions, notes, and comments.

### Expecting className to restyle the textarea itself

❌ Textarea forwards only className and style to the root wrapper while every other prop and the ref go to the inner textarea, so class-based rules written as if they targeted the input element hit the wrapper instead and produce unexpected borders, padding, or sizing.

✅ Treat the root as the styled box for border, background, radius, and layout, and rely on the component's appearance, size, and resize props for the internals rather than trying to restyle the inner textarea element.

### Enforcing limits with a handler that can reject the latest value

❌ A controlled handler that drops changes beyond a limit can leave the field stuck if the state is never updated, and limits enforced only in JavaScript are invisible to assistive technology and to users who never reach the cap.

✅ Follow the documented controlled pattern of accepting the new value whenever it is within the limit, surface the budget in visible hint text, and add the native maxLength attribute so the browser also blocks further input.

## Accessibility

**Requirements**: Textarea renders a native textarea, so it inherits the standard text box semantics and must satisfy WCAG 1.3.1 (information and relationships) through a programmatically associated label, 3.3.2 (labels or instructions) through visible labels and hints, and 4.1.2 (name, role, value) through a proper accessible name and current value. Color requirements are significant for this component: the filled appearances only pass WCAG 1.4.11 non-text contrast when the colors adjacent to the control, including filled-darker and filled-lighter backgrounds, provide a contrast ratio greater than 3 to 1 against the immediate surrounding color; the outline appearance is the safest choice on unknown backgrounds. Text inside the control must meet WCAG 1.4.3 contrast for body text, and disabled text must still be legible enough to read. Because the resize grip is a pointer-only browser affordance, do not depend on resizing for readability; content must remain usable at 200 percent zoom per WCAG 1.4.4. Error and required states must be conveyed with more than color alone, which Field handles by rendering validation message text.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the Textarea when it is enabled; a second Tab moves focus to the next focusable control. |
| `Shift+Tab` | Moves focus to the previous focusable element without inserting a character. |
| `Enter` | Inserts a line break in the value; it does not submit an enclosing form, unlike a single-line Input. |
| `Space` | Inserts a space character, it does not activate or toggle anything. |
| `Arrow keys` | Move the caret within the value; with Shift held, extend the text selection. |
| `Home / End` | Move the caret to the beginning or end of the current line; with Ctrl or Command, to the beginning or end of the whole value. |
| `Page Up / Page Down` | Scroll the overflow content of the control when the text is taller than the visible area. |
| `Backspace / Delete` | Delete the character before or after the caret, or the current selection. |
| `Ctrl+A or Command+A` | Selects all text within the Textarea. |
| `Ctrl+C, Ctrl+X, Ctrl+V (Command on macOS)` | Copy, cut, and paste text through the browser's native clipboard handling. |
| `Ctrl+Z, Ctrl+Y or Command+Z, Command+Shift+Z` | Undo and redo typing, provided by the browser's native editing stack. |

**ARIA**: aria-label or a label associated through Field when no visible label can be shown, aria-labelledby when the accessible name comes from an existing element rather than Field's label, aria-describedby linking hint and validation text supplied by Field to the textarea slot, aria-invalid to mark the field as failing validation, aria-required or the native required attribute to convey that the value must be supplied, aria-disabled or the native disabled attribute to convey that the field cannot be edited, aria-errormessage or a described-by validation node for error text, as produced by Field, aria-multiline is unnecessary because the native textarea already exposes multi-line text box semantics

**Screen Reader**: Screen readers announce the Textarea as a multi-line text box or edit field, followed by its accessible name from the Field label (or from an aria-label), the current value, and states such as required, invalid, or disabled when present. Hint text and validation messages wired through Field are announced as the description of the control, typically when focus lands on it. Typing characters and corrections are announced as the user edits, and the caret position within a line is tracked natively, but in a controlled setup the announced value is whatever the DOM holds at the moment of the edit, so a change handler that rejects or rewrites input can make the announced value diverge from what the user typed. Limits enforced only by a change handler are not announced at all, which is why the character budget should also appear in visible hint text, and native maxLength silently stops further input with only limited feedback, so pair it with a visible counter or hint.

## Styling

Textarea styling is split across two elements, so target the right one: className and style are applied to the root wrapper, which owns the border, background, border radius, and the animated focus indicator, while the inner textarea element carries the padding-free text area itself. Use tokens.colorNeutralStroke1 for the resting outline border and tokens.colorNeutralStrokeAccessible for the emphasized bottom edge, tokens.borderRadiusMedium for the corner radius, and tokens.strokeWidthThin for the border width, so outline textareas blend with Input and other form controls. The focus indicator is drawn by the root's pseudo-element with tokens.colorCompoundBrandStroke and a scale animation (which is why the extra wrapper exists), so overriding the root background or border will not break focus tracking as long as you leave that pseudo-element alone. Filled appearances map to theme surfaces: filled-darker paints the control with tokens.colorNeutralBackground3 and filled-lighter with tokens.colorNeutralBackground1, with hover states following tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground3Hover, and the corresponding pressed variants. Text and placeholder colors come from tokens.colorNeutralForeground1 for entered text and tokens.colorNeutralForeground4 for the placeholder, with tokens.fontFamilyBase for the type family. Size differences are expressed with tokens.fontSizeBase200, tokens.fontSizeBase300, and tokens.fontSizeBase400 paired with tokens.lineHeightBase200, tokens.lineHeightBase300, and tokens.lineHeightBase400, and padding uses the spacing tokens such as tokens.spacingHorizontalS, tokens.spacingHorizontalM, tokens.spacingVerticalXS, and tokens.spacingVerticalS. Disabled styling pulls tokens.colorNeutralBackgroundDisabled, tokens.colorNeutralStrokeDisabled, and tokens.colorNeutralForegroundDisabled. Prefer these tokens over literal values so light, dark, and high contrast themes keep working.

## Performance

Textarea is a thin wrapper over a native element, so mounting cost is dominated by an extra root wrapper that exists to host the focus indicator animation; that one additional DOM node is negligible for typical forms but worth remembering when rendering hundreds of text areas in a virtualized list. Each keystroke re-renders the consuming component in controlled mode (and re-renders Field when the value lives above it), so keep the change handler trivial: store the value, and defer heavy validation, formatting, or network calls to blur, debounce, or submit time. Prefer uncontrolled usage with defaultValue when nothing else in the tree depends on the text on every keystroke. The focus indicator itself is a CSS-only transform on the root pseudo-element, so focus and blur do not trigger layout thrash from JavaScript. User-driven resizing changes layout natively without React re-renders, but it can force reflow of surrounding content, so prefer vertical resizing over both to limit layout impact.

## Theming & Tokens

Textarea consumes Fluent design tokens supplied by FluentProvider, so it adapts automatically to webLightTheme, webDarkTheme, and high contrast themes. Outline textareas use tokens.colorNeutralBackground1 for the surface, tokens.colorNeutralStroke1 for the border with tokens.colorNeutralStrokeAccessible on the emphasized edge, and tokens.colorNeutralStroke1Hover and tokens.colorNeutralStrokeAccessibleHover for hover; the focus indicator animates with tokens.colorCompoundBrandStroke at tokens.strokeWidthThick. Filled appearances map to surface tokens: filled-darker uses tokens.colorNeutralBackground3 and filled-lighter uses tokens.colorNeutralBackground1, with tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground3Hover, and the pressed variants for interaction states. Text uses tokens.colorNeutralForeground1, placeholders use tokens.colorNeutralForeground4, and disabled controls use tokens.colorNeutralBackgroundDisabled, tokens.colorNeutralStrokeDisabled, and tokens.colorNeutralForegroundDisabled. Shape and type come from tokens.borderRadiusMedium, tokens.fontFamilyBase, tokens.fontSizeBase200 through tokens.fontSizeBase400 with the matching tokens.lineHeightBase* values, tokens.strokeWidthThin for borders, and spacing tokens such as tokens.spacingHorizontalS, tokens.spacingHorizontalM, tokens.spacingVerticalXS, and tokens.spacingVerticalS for padding. Field-derived label, hint, and validation colors also come from theme tokens, which is why validation messaging should stay inside Field rather than being hand-colored.

## Migration Notes

In v9 the Textarea is a standalone control rather than a multiline mode of a text field. Labeling, hint text, and validation messaging are not props on Textarea; they come from the Field wrapper, which supplies the accessible name, description, and error text. Visual variants that were previously expressed with style or underline flags are now selected through appearance (outline, filled-darker, filled-lighter), and the deprecated filled-darker-shadow and filled-lighter-shadow values exist only for backwards compatibility and will be removed. Resizing behavior is expressed with the resize prop, which defaults to none in Fluent UI even though a bare browser textarea defaults to both, so layouts that previously relied on the native default must opt in. Value handling follows the standard v9 pattern of value with an onChange callback that receives a data object containing the new value, instead of reading the event target directly. Severity and error text should be rendered by the surrounding Field rather than by the control itself.

## Edge Cases

- resize defaults to none, which differs from the browser default of both, so a Textarea carried over from plain HTML will suddenly appear unresizable until resize is set explicitly.
- className and style are applied to the root wrapper while every other prop, including native attributes and the ref, is applied to the inner textarea, so styling and imperative access target different elements.
- The root wrapper exists specifically to host the focus indicator animation; removing or flattening it in styling will break the visible focus cue.
- The filled-darker and filled-lighter appearances require a contrast ratio greater than 3 to 1 against their immediate surroundings, so they cannot be dropped onto an arbitrary background without verification.
- filled-darker-shadow and filled-lighter-shadow still render but are deprecated and slated for removal, so they should be migrated away from rather than adopted.
- In controlled mode, an onChange handler that does not write the new value back into state makes the field appear frozen; the character-limit pattern must accept values that are within the limit and only reject the ones that exceed it.
- Enter inserts a line break rather than submitting, so Textarea inside a form behaves differently from a single-line Input and should not be used where Enter is expected to commit.
- The resize grip is pointer-only and cannot be reached or operated by keyboard, so content must remain readable without resizing, and layouts should tolerate a user-resized control overflowing its container when resize is horizontal or both.
- Setting a fixed pixel height on the root while allowing vertical or both resizing creates a mismatch between the wrapper and the inner textarea that can clip text or leave dead space.
- Native maxLength silently blocks keystrokes with minimal feedback and is not reliably announced, so a hard cap should also be communicated in visible hint text or a counter.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
