# Input

> **Package**: `@fluentui/react-input` v9.8.3
> **Import**: `import { Input } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Input is the Fluent UI React v9 single-line text entry control, imported from @fluentui/react-components. It pairs a native input element with a styled wrapper, so the component renders a root slot that paints borders, background, focus underline and padding, plus the input slot that is the real text field. Because of that wrapper, Input can place arbitrary elements inside its own border through the contentBefore and contentAfter slots, which is how icons, unit labels, currency symbols and inline buttons are attached to the field. Out of the box an Input is uncontrolled and tracks its own state; supplying value together with onChange turns it into a controlled component, while defaultValue seeds an uncontrolled one. Appearance covers outline (the default), underline, filled-lighter and filled-darker (plus the deprecated filled-darker-shadow and filled-lighter-shadow), size covers small, medium and large, and type exposes the text-based HTML input types such as email, url, password, tel, search and number. Input participates in the Label and Field ecosystem for visible labels, hints and validation messages, and it deliberately has no children: all concern for layout around the field belongs to the parent.

**When to use**: Use Input for any single-line, free-form text entry: names, emails, URLs, search terms, passwords, amounts or identifiers. Choose it when the user types the value rather than picking it from a list, and when the value fits on one line. Prefer Textarea when the content is multi-line, Field when you need a composed label, hint and error message around the control, Search when the interaction is a search experience with suggestions, Combobox when the user should pick from known values with filtering, Spinbutton when the value is numeric and stepped with increment and decrement controls, and the date and time picker components when the expected value is a date or time. Reach for a plain input element instead when you need a non-text input type such as checkbox, radio, file, range or color, since Input focuses on text-based types.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"outline" \| "underline" \| "filled-darker" \| "filled-lighter" \| "filled-darker-shadow" \| "filled-lighter-shadow" \| undefined` | `'outline'  Note: 'filled-darker-shadow' and 'filled-lighter-shadow' are deprecated and will be removed in the future.` | No | Controls the colors and borders of the input. |
| `children` | `undefined` | — | No | Input can't have children. |
| `defaultValue` | `string \| undefined` | — | No | Default value of the input. Provide this if the input should be an uncontrolled component which tracks its current state internally; otherwise, use `value`.  (This prop is mutually exclusive with `value`.) |
| `onChange` | `((ev: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => void) \| undefined` | — | No | Called when the user changes the input's value. |
| `size` | `"small" \| "medium" \| "large" \| undefined` | `'medium'` | No | Size of the input (changes the font size and spacing). |
| `type` | `"number" \| "text" \| "email" \| "password" \| "search" \| "tel" \| "url" \| "date" \| "datetime-local" \| "month" \| "time" \| "week" \| undefined` | `'text'` | No | An input can have different text-based [types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#input_types) based on the type of value the user will enter.  Note that no custom styling is currently applied for alternative types, and some types may activate browser-default styling which does not match the Fluent design language.  (For non-text-based types such as `button` or `checkbox`, use the appropriate component or an `<input>` element instead.) |
| `value` | `string \| undefined` | — | No | Current value of the input. Provide this if the input is a controlled component where you are maintaining its current state; otherwise, use `defaultValue`.  (This prop is mutually exclusive with `defaultValue`.) |

### Prop Guidance

- **appearance**: Selects the color and border treatment of the field. Outline is the default and belongs on neutral page and dialog surfaces; underline suits designs that want only a bottom rule and a strong focus underline; filled-lighter is intended for white or light card surfaces; filled-darker is intended for darker or tinted card surfaces. Whichever you choose, verify that the color directly adjacent to the field provides better than a 3 to 1 contrast against it. `filled-lighter`
- **size**: Controls font size and internal spacing. Use small for dense layouts such as toolbars or table cells, medium as the general default, and large for prominent or touch-oriented forms. Pair it with a Label of the same size so the two line up. `medium`
- **value**: Supplies the current value for a controlled input where the consuming component owns the state and handles every update. Use it together with onChange, and never alongside defaultValue, since the two are mutually exclusive and switching after mount changes the controlled nature of the input. `controlled text the app owns`
- **defaultValue**: Seeds an uncontrolled input whose state is tracked internally. Use it for simple forms that only need an initial value, and leave value unset. Later prop changes to defaultValue are ignored once the input has mounted. `initial value`
- **onChange**: Fires on every user edit and receives both the native change event and a data object whose value is the current text. Read the value from the data argument for validation, filtering or length limiting, and keep heavy work out of the handler so typing stays responsive. `validate and store data.value`
- **type**: Chooses the text-based input type so browsers apply the right keyboard, autofill and validation semantics. Use email, url, tel, password and search as appropriate, and be aware that alternative types receive no custom Fluent styling and may render browser-native affordances. For non-text types such as checkbox, radio, file or range, use a dedicated component or a plain input element. `password`
- **disabled**: A native prop forwarded to the input element that removes the field from the tab order and from form submission. Use it only for genuinely unavailable fields, and provide another way for users to read information they still need. `true`
- **placeholder**: A native prop forwarded to the input element that shows hint text inside the field. Treat it as an example or format hint, never as the label; if you use it without a visible label, supply aria-label as well. `name@example.com`
- **id**: A native prop forwarded to the input element that is the hook for label association. Give the Input an id and point a Label's htmlFor at the same value so the accessible name is announced. `user-email`
- **contentBefore**: Renders an element inside the border before the typed text, such as a decorative icon or a currency symbol. Decorative content should not be announced; meaningful content should be included in aria-labelledby so it becomes part of the accessible name. `decorative leading icon`
- **contentAfter**: Renders an element inside the border after the typed text, such as a unit suffix or a compact action button. Any interactive element placed here must have its own accessible name, for example aria-label on a microphone button. `trailing action button`
- **children**: Input does not accept children. There is nothing to render between the tags; use the contentBefore and contentAfter slots for in-border content and the parent layout for everything outside the field. `not supported`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `contentAfter` | — | No | Element after the input text, within the input border |
| `contentBefore` | — | No | Element before the input text, within the input border |
| `input` | — | Yes | The actual `<input>` element. `type="text"` will be automatically applied unless overridden.  This is the "primary" slot, so native props specified directly on the `<Input>` will go here (except `className` and `style`, which go to the `root` slot). The top-level `ref` will also go here. |
| `root` | — | Yes | Wrapper element which visually appears to be the input and is used for borders, focus styling, etc. (A wrapper is needed to properly position `contentBefore` and `contentAfter` relative to `input`.)  The root slot receives the `className` and `style` specified directly on the `<Input>`. All other top-level native props will be applied to the primary slot, `input`. |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import type { ArgTypes } from '@storybook/react-webpack5';
import { makeStyles, useId, Input, Label } from '@fluentui/react-components';
import type { InputProps } from '@fluentui/react-components';

export const Default = (props: InputProps): JSXElement => {
  const inputId = useId('input');
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Label htmlFor={inputId} size={props.size} disabled={props.disabled}>
        Sample input
      </Label>
      <Input id={inputId} {...props} />
    </div>
  );
};

const argTypes: ArgTypes = {
  // Add these native props to the props table and controls pane
  placeholder: {
    description:
      'Placeholder text for the input. If using this instead of a label (which is ' +
      'not recommended), be sure to provide an `aria-label` for screen reader users.',
    type: { name: 'string', required: false }, // for inferring control type
    table: { type: { summary: 'string' } }, // for showing type in prop table
  },
  disabled: {
    description: 'Whether the input is disabled',
    type: { name: 'boolean', required: false },
    table: { type: { summary: 'boolean' } },
  },
  // Hide these from the props table and controls pane
  children: { table: { disable: true } },
  as: { table: { disable: true } },
};
Default.argTypes = argTypes;
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, mergeClasses, tokens, useId, Input, Label } from '@fluentui/react-components';

export const Appearance = (): JSXElement => {
  const idPrefix = 'input-appearance-story';
  const inputIds = {
    default: useId(idPrefix),
    underline: useId(idPrefix),
    filledLighter: useId(idPrefix),
    filledDarker: useId(idPrefix),
  };

  const styles = useStyles();

  return (
    <div className={styles.base}>
      <div className={styles.field}>
        <Label htmlFor={inputIds.default}>Outline appearance (default)</Label>
        <Input appearance="outline" id={inputIds.default} />
      </div>
      <div className={styles.field}>
        <Label htmlFor={inputIds.underline}>Underline appearance</Label>
        <Input appearance="underline" id={inputIds.underline} />
      </div>
      <div className={mergeClasses(styles.field, styles.filledLighter)}>
        <Label htmlFor={inputIds.filledLighter}>Filled lighter appearance</Label>
        <Input appearance="filled-lighter" id={inputIds.filledLighter} />
      </div>
      <div className={mergeClasses(styles.field, styles.filledDarker)}>
        <Label htmlFor={inputIds.filledDarker}>Filled darker appearance</Label>
        <Input appearance="filled-darker" id={inputIds.filledDarker} />
      </div>
    </div>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story:
        'An input can have different appearances.\n' +
        `The colors adjacent to the input should have a sufficient contrast. Particularly, the color of input with
      filled darker and lighter styles needs to provide greater than 3 to 1 contrast ratio against the immediate
      surrounding color to pass accessibility requirements.`,
    },
  },
};
```

### ContentBeforeAfter

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, useId, Body1, Button, Input, Label, Text } from '@fluentui/react-components';
import { PersonRegular, MicRegular } from '@fluentui/react-icons';
import type { ButtonProps } from '@fluentui/react-components';

export const ContentBeforeAfter = (): JSXElement => {
  const styles = useStyles();

  const beforeId = useId('content-before');
  const afterId = useId('content-after');
  const beforeAndAfterId = useId('content-before-and-after');
  const beforeLabelId = useId('before-label');
  const afterLabelId = useId('after-label');

  return (
    <div className={styles.root}>
      <div>
        <Label htmlFor={beforeId}>Full name</Label>
        <Input contentBefore={<PersonRegular />} id={beforeId} />
        <Body1>
          An input with a decorative icon in the <code>contentBefore</code> slot.
        </Body1>
      </div>

      <div>
        <Label htmlFor={afterId}>First name</Label>
        <Input contentAfter={<MicButton aria-label="Enter by voice" />} id={afterId} />
        <Body1>
          An input with a button in the <code>contentAfter</code> slot.
        </Body1>
      </div>

      <div>
        <Label htmlFor={beforeAndAfterId}>Amount to pay</Label>
        <Input
          contentBefore={
            <Text size={400} id={beforeLabelId}>
              $
            </Text>
          }
          contentAfter={
            <Text size={400} id={afterLabelId}>
              .00
            </Text>
          }
          aria-labelledby={`${beforeAndAfterId} ${beforeLabelId} ${afterLabelId}`}
          id={beforeAndAfterId}
        />
        <Body1>
          An input with a presentational value in the <code>contentBefore</code> slot and another presentational value
          in the <code>contentAfter</code> slot.
        </Body1>
      </div>
    </div>
  );
};

ContentBeforeAfter.parameters = {
  docs: {
    description: {
      story:
        'An input can have elements such as an icon or a button before or after the entered text. ' +
        'These elements are displayed inside the input border.',
    },
  },
};
ContentBeforeAfter.storyName = 'Content before/after';
```

## Best Practices

### Do's

- Always give the Input an accessible name: render a Label with htmlFor pointing at the same id you pass to Input, or supply aria-label when a visible label is impossible (for example an input rendered inside a paragraph of text).
- Wrap the Input in a Field when you need a visible label, hint text, validation message or required indicator in one consistent block, so the label, description and error are programmatically associated with the input.
- Pick one appearance per surface and stay consistent: use outline on neutral dialog and page backgrounds, filled-lighter on white or light cards, filled-darker on darker or tinted card surfaces, and underline where the visual language calls for a bottom rule.
- Match the Label size to the Input size (small, medium, large) so the label and field line up typographically.
- Drive validation from the onChange callback's data value rather than from the raw event, and keep the state you derive in the consuming component when the input is controlled.
- Use contentBefore and contentAfter for units, currency symbols, leading icons and trailing action buttons, and extend the accessible name with aria-labelledby when those slot contents carry meaning the user must hear.
- Choose the type that matches the expected value (email, url, password, tel, search) so browsers offer the right on-screen keyboard, autofill behavior and password-manager integration.
- Reset or prefill state deliberately: use defaultValue only for uncontrolled inputs that never need programmatic updates, and value for inputs whose contents the application owns.

### Don'ts

- Do not pass children to Input. Input cannot have children; put surrounding elements in the parent layout and use the contentBefore and contentAfter slots for anything that belongs inside the border.
- Do not use placeholder text as a substitute for a label. Placeholder disappears as soon as the user types, is low contrast, and is not a reliable accessible name.
- Do not provide both value and defaultValue on the same instance. They are mutually exclusive, and switching between them after mount turns the input from uncontrolled to controlled or the reverse.
- Do not use the deprecated filled-darker-shadow and filled-lighter-shadow appearances in new code; they are scheduled for removal.
- Do not place filled appearances on adjacent colors with weak contrast. The color immediately surrounding a filled input needs greater than a 3 to 1 contrast ratio against it to remain perceivable.
- Do not use Input for multi-line content or for stepped numeric entry. Textarea and Spinbutton are the correct controls, and neither should be approximated with a text Input plus custom parsing.
- Do not assume a className or style passed to Input styles the typed text. Those are applied to the root slot, while other native props flow to the input element.
- Do not put essential or persistent information only inside contentBefore or contentAfter. Screen readers only announce it when it is wired into the accessible name or has its own label.

## Anti-Patterns

### Placeholder used as the label

❌ Placeholder text disappears the moment the user starts typing, has low contrast by design, and is not reliably exposed as an accessible name by screen readers, so users lose track of what the field expects and assistive technology may announce an unlabeled textbox.

✅ Render a visible Label associated with the input through htmlFor and a matching id, and reserve placeholder for a short example or format hint. If no visible label is possible, add aria-label, and add aria-describedby for longer guidance.

### Switching between controlled and uncontrolled

❌ Passing value and defaultValue together, or moving from one to the other after mount, is unsupported and produces confusing behavior where typed characters are ignored or reset unexpectedly.

✅ Decide once whether the consuming component owns the state. Use value plus onChange for controlled inputs and defaultValue alone for uncontrolled inputs, and never mix them on the same instance.

### Relying on deprecated shadow appearances

❌ filled-darker-shadow and filled-lighter-shadow are documented as deprecated and scheduled for removal, so using them creates immediate migration debt and visual inconsistency with the current design language.

✅ Use filled-lighter or filled-darker, or the outline and underline appearances, and express any elevation you need through the surrounding container rather than the field itself.

### Passing children into Input

❌ Input cannot have children, so any markup placed between the tags is dropped, and developers end up with fields missing the icons, prefixes or buttons they thought they had rendered.

✅ Move in-border content into the contentBefore and contentAfter slots, and place anything outside the border in a wrapping element in the parent layout.

### Styling the wrong element with className

❌ A className or style passed directly to Input is applied to the root wrapper, not the input element, so attempts to restyle the text cursor region, selection colors or the typed text silently do nothing.

✅ Style the root for borders, background and focus treatments using design tokens, and target the actual input element only when you genuinely need text-level styling, remembering that other native props are forwarded to the input, not to root.

### Faking a numeric stepper or a date field with type

❌ Using a text-based type to approximate a stepped numeric control or a date picker produces browser-default affordances, inconsistent localization and no keyboard stepping, and these alternative types receive no Fluent styling.

✅ Use Spinbutton for stepped numeric entry and the date or time picker components for temporal values, keeping Input for free-form single-line text.

## Accessibility

**Requirements**: Every Input must have a programmatic accessible name before it is usable without sight. Associate a visible Label with the same id through htmlFor, or provide aria-label when no visible label exists, and add aria-describedby for hint or error text. Placeholder text alone never satisfies this requirement. When the input is required, mark it with the native required attribute and reflect that state visually; when its content is invalid, set aria-invalid and expose the error message as text associated with the control, not only as a red border. Filled appearances depend on sufficient contrast between the field and the color immediately adjacent to it, which must exceed a 3 to 1 ratio, and all focus, hover, disabled and error states must remain distinguishable without relying on color alone. Disabled inputs use the native disabled attribute, which removes them from the tab order and from form submission; if the value must remain focusable and readable, use a read-only treatment instead. Types such as email, url, password and tel carry semantics that assistive technology and browsers use for validation, autofill and keyboard selection, so pass them rather than leaving everything as text.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the input, or from a contentBefore element to the input and on to a contentAfter element. |
| `Shift+Tab` | Moves focus backwards out of the input to the previous focusable element. |
| `Character keys` | Insert text at the caret position. |
| `Space` | Inserts a space character in the value. |
| `Backspace` | Deletes the character before the caret, or the current selection. |
| `Delete` | Deletes the character after the caret, or the current selection. |
| `ArrowLeft` | Moves the caret one character (or word, with Ctrl or Cmd) to the left. |
| `ArrowRight` | Moves the caret one character (or word, with Ctrl or Cmd) to the right. |
| `Home` | Moves the caret to the beginning of the value. |
| `End` | Moves the caret to the end of the value. |
| `Ctrl+A or Cmd+A` | Selects the entire value. |
| `Enter` | Submits the enclosing form; in a search type the browser may trigger the search action. |
| `Escape` | Browser-dependent: in a search type the browser may clear the value; otherwise no default behavior. |
| `Enter or Space` | Activates a focusable control placed in the contentAfter or contentBefore slot. |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-required, aria-disabled (prefer the native disabled attribute for a true disabled input)

**Screen Reader**: The input element carries an implicit textbox role, so screen readers announce its accessible name, current value, any associated description or error text, and states such as required, invalid and disabled. When a Label with htmlFor points at the input, the label text is announced as the name; when aria-labelledby is used, each referenced id is read in order, which is how meaning is added to contentBefore and contentAfter values such as a currency symbol or a trailing decimal unit. Decorative icons in the content slots are usually hidden from assistive technology, while interactive elements such as a voice-entry button must carry their own aria-label. Placeholder text is announced by some screen readers as a hint rather than a name, which is why it cannot replace a label; because the placeholder disappears once typing starts, it is also unreliable for conveying constraints. A disabled Input is skipped during normal tab navigation, so any information the user needs must still be reachable elsewhere.

## Styling

The root slot is what actually looks like the field, so borders, background, padding, border radius, focus underline and disabled styling are all painted there, while the input slot holds the text. Top-level className and style land on root; every other native prop lands on the input element, which is the main styling gotcha to keep in mind when overriding. Define styles with makeStyles outside of render and compose conditional classes with mergeClasses, then override root tokens such as tokens.colorNeutralStroke1, tokens.colorNeutralStroke1Hover and tokens.colorNeutralStroke1Pressed for border states, tokens.colorNeutralBackground1 for the resting surface of filled-lighter, tokens.colorNeutralBackground3 for filled-darker, tokens.colorNeutralBackground1Hover for hover surfaces, tokens.colorNeutralForeground1 for entered text and tokens.colorNeutralForeground3 for placeholder text. Focus styling typically uses tokens.colorCompoundBrandStroke and tokens.colorCompoundBrandStrokePressed for the underline, and the standard radius is tokens.borderRadiusMedium with smaller radii for compact sizes. Spacing inside the field comes from values such as tokens.spacingHorizontalS, tokens.spacingHorizontalMNudge and tokens.spacingVerticalXS, and text sizing comes from tokens.fontSizeBase200, tokens.fontSizeBase300 and tokens.fontSizeBase400 with tokens.fontFamilyBase and tokens.lineHeightBase300. For an invalid field, shift the border to a danger token such as tokens.colorPaletteRedBorder2 and pair it with a text message. Prefer the size and appearance props over hand-tuned font sizes and paddings, since those props already select the correct token set, and use the contentBefore and contentAfter slots for anything that must live inside the border rather than absolutely positioning elements around the field.

## Performance

Input is a very light component: it renders a wrapper element plus a native input plus whatever you place in the content slots, with no internal state machine beyond the uncontrolled value. The main cost driver is your own onChange work, since it fires on every keystroke; keep validation, parsing and state updates cheap, and debounce or defer anything expensive such as network calls. Memoize expensive derived state and avoid lifting typing state so high in the tree that each character re-renders a large subtree. Define makeStyles output outside render and avoid recreating slot elements unnecessarily, and prefer uncontrolled inputs with defaultValue for large forms that do not need per-character reactivity, since that avoids re-render traffic entirely. When many inputs appear in one view, keep their controlled state as local as possible so a change in one field does not re-render all of them, and stabilize any callbacks passed to them with the usual memoization utilities.

## Theming & Tokens

Input resolves its colors, radii, typography and spacing from the Fluent theme, so it automatically follows the nearest Provider and its light, dark or high-contrast theme without extra work. Each appearance maps to a different slice of the token set: the outline and underline variants draw their border from tokens.colorNeutralStroke1 with tokens.colorNeutralStroke1Hover and tokens.colorNeutralStroke1Pressed for interaction states and tokens.colorCompoundBrandStroke for the focus underline, while the filled variants draw their surface from tokens.colorNeutralBackground1 and tokens.colorNeutralBackground3 and their hover states from tokens.colorNeutralBackground1Hover. Text uses tokens.colorNeutralForeground1, placeholder text uses tokens.colorNeutralForeground3, and the disabled treatment combines tokens.colorNeutralForegroundDisabled with tokens.colorNeutralBackgroundDisabled and tokens.colorNeutralStrokeDisabled. Shape and rhythm come from tokens.borderRadiusMedium, tokens.strokeWidthThin, tokens.fontFamilyBase, tokens.fontSizeBase200 through tokens.fontSizeBase400 and spacing values such as tokens.spacingHorizontalS and tokens.spacingHorizontalMNudge, and invalid states are typically expressed with a danger token such as tokens.colorPaletteRedBorder2. Because these are semantic tokens, overriding them in a scoped theme changes the whole family of inputs consistently instead of patching individual fields.

## Migration Notes

In v9 the input is a composed component with two meaningful element slots rather than a single styled input element. The root slot is what receives className and style, so any style that previously targeted the input box as a whole now applies to root, while styles that must affect the text cursor or selection need to reach the input element. Styling is expressed with Griffel makeStyles and design tokens instead of the v8 mergeStyleSets and theme palette objects, so semantic values map to tokens such as tokens.colorNeutralStroke1 and tokens.colorNeutralBackground1. The v8 underlined prop becomes the underline appearance, and the shadowed appearances are represented as filled-darker-shadow and filled-lighter-shadow, both of which are deprecated in v9 and should be replaced by the non-shadow filled appearances. Prefix and suffix content is expressed with the contentBefore and contentAfter slots rather than wrapper elements, and an input is uncontrolled by default, with value plus onChange required for controlled usage. Non-text input types such as checkbox, radio, file, range and color are no longer represented by this component and should use a dedicated component or a plain input element.

## Edge Cases

- Input accepts no children, so markup placed between the opening and closing tags is silently dropped; in-border content must use contentBefore or contentAfter.
- className and style are applied to the root wrapper while every other native prop is forwarded to the input element, which makes it easy to style the wrong layer or to forget that ref targets the input.
- value and defaultValue are mutually exclusive; supplying both, or switching between them after mount, breaks expected typing behavior.
- filled-darker-shadow and filled-lighter-shadow are deprecated and will be removed, so new code should use the non-shadow filled appearances.
- Alternative type values receive no Fluent-specific styling and may activate browser-default visuals, and non-text types such as checkbox, file or range are outside the scope of this component.
- Content placed in contentBefore or contentAfter is not automatically part of the accessible name; a currency symbol or unit must be wired in through aria-labelledby to be announced with the label.
- A disabled Input is removed from the tab order and from form submission, so users relying on keyboard navigation cannot reach or copy its value.
- Placeholder text vanishes on first keystroke and is announced inconsistently across screen readers, so any constraint the user must remember needs a persistent label or description.
- Uncontrolled inputs ignore later changes to defaultValue after mount, and a controlled input whose onChange does not update state appears frozen to the user.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
