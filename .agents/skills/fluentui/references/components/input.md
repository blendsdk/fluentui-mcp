# Input

> **Package**: `@fluentui/react-input` v9.8.3
> **Import**: `import { Input } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Input is the Fluent UI React v9 single-line text entry control. It renders a native input element wrapped by a root element that supplies borders, background, focus underline, and positioning for the optional contentBefore and contentAfter slots (icons, unit symbols, or buttons placed inside the input border). The component supports four visual appearances (outline, underline, filled-lighter, filled-darker), three sizes (small, medium, large), and can operate either as an uncontrolled input (defaultValue tracks state internally) or as a controlled input (value plus onChange, where the change payload exposes the new text through its value field). Input intentionally receives no children — its visual decoration comes exclusively from the contentBefore and contentAfter slots — and all native input element props (placeholder, disabled, maxLength, name, required, aria-* attributes) are forwarded to the inner input element, which is also the primary slot that receives the top-level ref, while className and style are applied to the outer root slot. Text-based type values such as email, url, password, search, tel, number, and the date/time family are supported, but no custom Fluent styling is applied to those alternative types and some of them trigger browser-default chrome that does not match the Fluent design language.

**When to use**: Use Input whenever a user needs to type free-form, single-line, text-based content: names, emails, passwords, URLs, search terms that don't warrant the SearchBox affordance, or short numeric and date-like values. Pair it with Label (via htmlFor and a stable id) for a visible accessible name, and wrap it in Field when you also need a validation message, hint text, or a required indicator. Choose a different component when the interaction is not free-form text entry: SearchBox for search experiences with its own clear/submit affordances, Textarea for multi-line content, SpinButton for numbers that benefit from incremental steppers, Select, Dropdown, or Combobox when the user picks from a known set of options instead of typing, and Checkbox, Radio, Switch, or Slider for non-text input. Use size and appearance to match the surrounding surface — underline for inline or minimally-chromed layouts, filled-lighter or filled-darker when the input sits on a distinctly colored surface.

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

- **children**: Input does not accept children. Passing them is unsupported; use the contentBefore and contentAfter slots for anything that should appear inside the input border. `(not applicable — use contentBefore/contentAfter)`
- **appearance**: Controls colors and borders. Use 'outline' (the default) on standard surfaces, 'underline' for inline or low-chrome layouts, 'filled-lighter' on light surfaces, and 'filled-darker' on darker or tinted surfaces. Ensure the adjacent color provides greater than a 3 to 1 contrast ratio for the filled variants. Avoid 'filled-darker-shadow' and 'filled-lighter-shadow', which are deprecated and will be removed. `filled-darker`
- **size**: Sets the font size and internal spacing of the field; defaults to 'medium'. Match the size to the accompanying Label so text metrics line up, and keep all fields in a given form or toolbar at the same size unless the layout genuinely demands otherwise. `large`
- **defaultValue**: Use for an uncontrolled input whose value is tracked internally; the provided text seeds the initial value and later user edits are not reflected back to your state. Mutually exclusive with value. `default value`
- **value**: Use when the consuming component owns the value, for example to validate, transform, or synchronize with other fields. Always pair it with onChange and only commit the new text when your rules allow it. Mutually exclusive with defaultValue. `initial value`
- **onChange**: Called whenever the user edits the text, receiving the change event and a data object whose value field is the new text. Read the value from that data object rather than from the DOM, and keep the handler cheap — for expensive validation, debounce or defer the work. `(ev, data) => setValue(data.value)`
- **type**: Selects a text-based native input type; defaults to 'text'. Use email, tel, url, password, or search to get appropriate keyboard and autofill behavior, and number or the date/time family for those formats with the expectation that no Fluent styling is applied and browser-default chrome may appear. Do not use non-text types such as button, checkbox, radio, range, file, or color. `email`
- **placeholder**: Native input attribute forwarded to the inner input element. Useful as a hint or example of the expected format, but never a substitute for a visible Label; if it is your only naming source, also provide aria-label. `name@example.com`
- **disabled**: Native attribute forwarded to the inner input element. Disabled fields are removed from the tab order and dimmed; keep the accompanying Label's disabled state in sync, and consider readOnly instead when users still need to read and copy the value. `(disabled boolean)`

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

- Always give the input an accessible name: render a Label with htmlFor pointing at an id generated with useId (or pass aria-label when no visible label is possible, such as an inline input inside a paragraph of text).
- Choose appearance based on the surface behind the input and verify contrast: filled-lighter belongs on light surfaces, filled-darker on darker or tinted surfaces, and the adjacent color must provide greater than a 3 to 1 contrast ratio against the input background.
- Commit to one state model for the component's lifetime: uncontrolled with defaultValue when the internal state is sufficient, or controlled with value plus onChange when you need validation, formatting, or cross-field logic, reading the new text from the change data's value field.
- Use contentBefore and contentAfter for in-border affordances such as a decorative person icon, a currency symbol, a unit label, or a small icon Button, and give any interactive element inside those slots its own aria-label.
- Match the input's size to the size of its Label (small, medium, large) so the label text and the input text share the same metrics and baseline rhythm.
- Set the type prop to the most specific text-based type you can (email, tel, url, password, search) so mobile keyboards and browser autofill behave correctly, and combine it with appropriate autocomplete/native attributes on the inner input.
- Reuse Input (and Label/Field) across every form so focus rings, disabled treatment, and rounded corners stay consistent with the rest of the Fluent surface.

### Don'ts

- Don't rely on placeholder text as the label. Placeholders disappear on entry, are low contrast, and are not reliably announced as an accessible name — if you use one instead of a visible label, you must still supply aria-label.
- Don't pass children to Input. Input has no children API; all in-border content must go through the contentBefore and contentAfter slots.
- Don't pass value and defaultValue at the same time. They are mutually exclusive and mixing them produces unreliable controlled/uncontrolled behavior and React warnings.
- Don't use the deprecated filled-darker-shadow and filled-lighter-shadow appearance values, which are slated for removal — use filled-darker or filled-lighter instead.
- Don't use Input for non-text-based types such as button, checkbox, radio, range, file, or color; use the dedicated Fluent components (Button, Checkbox, Radio, Slider) or a native input element for those.
- Don't reach for Input when a purpose-built component exists (Textarea for multi-line text, SpinButton for stepped numbers, SearchBox for search, Combobox/Dropdown/Select for option picking) — you lose the built-in behavior and accessibility of those components.
- Don't assume alternative type values get Fluent styling. Types like date, time, month, and week may show browser-default chrome that breaks the design language; if you need that, expect to style or replace it.
- Don't attach layout or border styles intending to hit the native input element through the top-level className. className and style land on the root wrapper; target the inner element with a descendant selector inside makeStyles.

## Anti-Patterns

### Placeholder used as the only label

❌ Placeholder text vanishes as soon as the user types, is typically rendered at lower contrast, and is not a reliable accessible name, so users lose the field's purpose mid-entry and screen reader users may hear an unlabeled textbox.

✅ Render a visible Label associated through htmlFor with an id from useId, and use placeholder only for an example format or hint. If a visible label is impossible (for example an inline input inside prose), supply aria-label or aria-labelledby.

### Mixing controlled and uncontrolled value props

❌ Passing value together with defaultValue, or switching between them after mount, breaks React's controlled/uncontrolled contract, produces console warnings, and can make the field appear to ignore typing or reset unexpectedly.

✅ Choose one model up front: uncontrolled with defaultValue when internal state suffices, or fully controlled with value plus onChange that updates state from the change data's value field. Never supply both.

### Assuming the top-level className styles the native input

❌ className and style land on the root wrapper while the primary input slot receives the remaining native props, so styles such as font, line-height, or placeholder color written against the top-level class may not affect the actual text element, and attempts to reach the element by DOM query or ref assume the wrong node.

✅ Style the wrapper deliberately and target the nested input with a descendant selector inside makeStyles; remember that the forwarded ref points at the inner input element while className and style point at the root, and use contentBefore/contentAfter for in-border decoration.

### Using the deprecated shadow-filled appearances

❌ The filled-darker-shadow and filled-lighter-shadow appearance values are deprecated and scheduled for removal, so relying on them will break with a future release and they already express a pattern outside the current design language.

✅ Replace them with filled-darker or filled-lighter and, if extra separation is needed from the surrounding surface, add a container style or choose the appearance that keeps at least a 3 to 1 contrast ratio with the adjacent color.

### Using Input for non-text inputs or specialized pickers

❌ Forcing Input to act as a checkbox, radio, slider, file picker, or option chooser discards the accessibility, keyboard handling, and styling those components provide, and non-text types fall outside the supported type list entirely.

✅ Use the dedicated Fluent components (Checkbox, Radio, Slider, Button, SpinButton, Select, Dropdown, Combobox, SearchBox, Textarea) and reserve Input for text-based entry.

## Accessibility

**Requirements**: Every Input must satisfy WCAG 2.1 Level AA: 1.3.1 and 4.1.2 require a programmatically determinable name, role (textbox), and value, so associate a Label through htmlFor or supply aria-label / aria-labelledby; 3.3.2 requires labels or instructions, so visible labels or hint text via aria-describedby are expected for anything non-obvious; 1.4.3 requires at least 4.5:1 contrast for the input text and placeholder against its background; 1.4.11 requires at least 3:1 non-text contrast, which the documentation explicitly calls out for filled-darker and filled-lighter inputs against the immediate surrounding color; 2.4.7 requires a visible focus indicator, provided by the root slot's focus underline; and 1.3.5 recommends autocomplete/native attributes for inputs collecting identity data such as email or tel. Validation state must be exposed with aria-invalid plus an error message referenced by aria-describedby, and disabled inputs should be visually and programmatically distinguishable from enabled ones.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the input, or moves focus to an interactive element inside the contentAfter slot (such as an icon Button) before leaving the field. |
| `Shift+Tab` | Moves focus back out of the input to the previously focused element. |
| `Enter` | Submits the surrounding form when the input is inside a form element; this is native browser behavior and does not clear or change the value. |
| `Space` | Inserts a space character into the value; it never activates the field itself because the input is the keyboard target. |
| `ArrowLeft / ArrowRight` | Moves the text caret one character to the left or right within the current value. |
| `ArrowUp / ArrowDown` | Steps the value for type='number' (and within native date/time pickers); for plain text types there is no input behavior. |
| `Home / End` | Moves the caret to the beginning or the end of the current value. |
| `Backspace / Delete` | Deletes the character before or after the caret, respectively. |
| `Ctrl+A (Cmd+A on macOS)` | Selects the entire value, which is then replaced by the next typed character. |
| `Ctrl+Z / Ctrl+Y (Cmd+Z / Cmd+Shift+Z on macOS)` | Undoes or redoes the last text edit through the browser's native editing history. |
| `Escape` | In some browsers clears the value for type='search'; this is native behavior and is not guaranteed by the component. |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-required, aria-hidden (on decorative icons placed in contentBefore or contentAfter)

**Screen Reader**: The inner element exposes the native textbox role with its current value, so screen readers announce the accessible name from the associated Label (linked with htmlFor) or from aria-label / aria-labelledby, followed by the role and value. Placeholder text is read only when it is the sole source of the name and remains low contrast, so visible labels are preferred. Text referenced by aria-describedby (hint or validation message) is announced after the name and state, and aria-invalid plus aria-required are surfaced as invalid or required states. Content rendered through contentBefore or contentAfter lives inside the same bordered root: decorative icons should be hidden with aria-hidden so they aren't announced, while interactive elements such as an icon Button need their own aria-label so they are reachable and understandable in the tab order. When presentational text such as a currency symbol is placed in a slot, include its element id in aria-labelledby alongside the input id so the meaning of the value is conveyed. Native disabled inputs are announced as dimmed/unavailable and are skipped during form navigation, whereas a readOnly input stays focusable and readable.

## Styling

Styling an Input means styling two elements: className and style go to the root wrapper (borders, background, radius, focus underline, slot padding) while the inner input element inherits the text metrics. Define styles at module scope with makeStyles and target the nested element with a descendant selector (for example styling the input's font, color, or placeholder) rather than expecting the top-level className to reach it; merge conditional classes with mergeClasses. The root's rounded corners come from tokens.borderRadiusMedium, so overriding it with a token-scaled radius keeps the field consistent with Buttons and Dropdowns; sizes shift spacing through tokens.spacingHorizontalS, tokens.spacingHorizontalMNudge, and the font ramps tokens.fontSizeBase200/300/400 with tokens.lineHeightBase200/300/400. Borders use tokens.colorNeutralStroke1 with hover and pressed variants (tokens.colorNeutralStroke1Hover, tokens.colorNeutralStroke1Pressed) and the accessible border token tokens.colorNeutralStrokeAccessible for underline/filled styles, while the focus underline is drawn with tokens.colorCompoundBrandStroke and tokens.colorCompoundBrandStrokePressed using tokens.strokeWidthThick and tokens.strokeWidthThickest. Text color should stay on tokens.colorNeutralForeground1, placeholder-like content on tokens.colorNeutralForeground3 or tokens.colorNeutralForeground4, and disabled fields on tokens.colorNeutralForegroundDisabled with tokens.colorNeutralBackgroundDisabled and tokens.colorNeutralStrokeDisabled. When you set a custom background, pick the appearance that keeps at least a 3 to 1 contrast ratio with the adjacent surface, and recreate disabled and hover states with tokens.colorNeutralBackground1Hover where needed.

## Performance

Input is a lightweight wrapper around a native input, but a controlled Input re-renders its owner on every keystroke, so keep the controlled value in the narrowest possible component and avoid storing derived or duplicate copies of the text in other state. Keep onChange handlers minimal — defer or debounce expensive validation, formatting, or network work instead of running it synchronously per character, and stabilize the handler with useCallback when it is passed through memoized children. Because it is uncontrolled by default, large forms can often use defaultValue and read values on submit to avoid keystroke-driven render storms. Styles should be declared once at module scope with makeStyles rather than recreated during render, and the id used to link a Label should come from useId so it stays stable across renders. contentBefore and contentAfter are rendered inside the field's root, so complex or heavy nodes there cost layout on every render, and passing new object or element literals into those slots each render forces the slots to reconcile.

## Theming & Tokens

Input draws all of its visual states from Fluent theme tokens supplied by FluentProvider, so switching themes (web light, web dark, teams themes, or a custom brand ramp) restyles it automatically. Backgrounds come from tokens.colorNeutralBackground1 for outline and filled-lighter, tokens.colorNeutralBackground3 or tokens.colorNeutralBackground4 for filled-darker, and tokens.colorNeutralBackgroundDisabled for disabled fields; hover states can use tokens.colorNeutralBackground1Hover. Borders and the underline use tokens.colorNeutralStroke1 with tokens.colorNeutralStroke1Hover and tokens.colorNeutralStroke1Pressed, the accessible bottom stroke uses tokens.colorNeutralStrokeAccessible, and disabled borders use tokens.colorNeutralStrokeDisabled. The focus indicator inside the root slot is drawn from tokens.colorCompoundBrandStroke and tokens.colorCompoundBrandStrokePressed at tokens.strokeWidthThick to tokens.strokeWidthThickest, and keyboard focus visibility should never be suppressed. Text color uses tokens.colorNeutralForeground1, with placeholder and secondary content on tokens.colorNeutralForeground3 or tokens.colorNeutralForeground4 and disabled text on tokens.colorNeutralForegroundDisabled. Shape and typography are tokenized too: tokens.borderRadiusMedium controls the corner radius, tokens.spacingHorizontalS and tokens.spacingHorizontalMNudge control internal padding, and the size prop maps to tokens.fontSizeBase200 / tokens.fontSizeBase300 / tokens.fontSizeBase400 with the matching tokens.lineHeightBase* values.

## Migration Notes

Coming from Fluent UI React v8, the Input component replaces the text-entry role that TextField played, but with a narrower scope: labels, hint text, and validation messages now belong to the Field component (or Label used directly), while Input renders only the field chrome and the native input. The v8 boolean 'underlined' styling is expressed in v9 as appearance='underline', and the default appearance is 'outline'; the filled appearances are named filled-lighter and filled-darker, with filled-lighter-shadow and filled-darker-shadow already deprecated and scheduled for removal. Change handling differs as well: instead of receiving the string value as the second argument, onChange now receives the original event plus a data object whose value field holds the new text. In v9 an Input cannot receive children, so any icon, prefix, or suffix that was previously nested must move into the contentBefore or contentAfter slots, and native props such as placeholder or disabled are applied to the inner input element while className and style are applied to the root wrapper.

## Edge Cases

- value and defaultValue are mutually exclusive; supplying both (or flipping between controlled and uncontrolled after mount) yields inconsistent behavior and React warnings.
- Input cannot take children — any attempt to nest a prefix icon or suffix button inside the tags is unsupported and must be moved to contentBefore or contentAfter.
- className and style are applied to the root wrapper while all other native props and the ref are applied to the inner input element, so styling or measuring the wrong node is a common mistake.
- Filled appearances need more than a 3 to 1 contrast ratio against the immediate surrounding color; a filled-lighter input on a light card can become visually indistinguishable, in which case filled-darker or outline is the safer choice.
- The shadow-filled appearances (filled-darker-shadow and filled-lighter-shadow) are deprecated and will be removed in a future release.
- Alternative type values are not custom-styled: date, time, month, week, and similar types may render browser-default pickers and chrome that do not match the Fluent design language, and non-text types such as button or checkbox are explicitly out of scope.
- The change handler receives a data object whose value field is a string even for type='number', so numeric parsing and clamping are the consumer's responsibility; number inputs may also change value on scroll wheel in some browsers.
- For type='search' some browsers render their own clear affordance and clear the value on Escape, which will not appear in a controlled input's state unless your onChange logic acknowledges it.
- An interactive element placed in contentAfter joins the tab order inside the field's visual bounds, so it needs its own aria-label and must not be the only way to trigger a critical action.
- A disabled Input is not focusable and is skipped by screen readers during form navigation; use readOnly when the value must remain readable or copyable.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
