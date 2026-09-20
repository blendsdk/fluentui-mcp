# Select

> **Package**: `@fluentui/react-select` v9.5.2
> **Import**: `import { Select } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Select is a form control that wraps the native HTML select element with Fluent UI styling, sizing, and theming. It renders a root container, the actual select element as its primary slot, and an icon slot that typically holds a down-arrow indicator. Because it is built on the native element, it inherits the platform's behavior: the option list is rendered by the browser/OS, selection is single-choice, and form participation (name/value submission) works without extra wiring. Select exposes three Fluent-specific props — appearance, size, and onChange — while still forwarding native attributes such as value, defaultValue, disabled, required, id, and name. The onChange handler provides both the raw React change event and a typed SelectOnChangeData payload so the new value can be read directly in controlled scenarios.

**When to use**: Use Select when the user must choose exactly one option from a short, fixed, well-known list — for example choosing a color, a sort order, a locale, or a country — and the platform's native dropdown behavior is acceptable. Prefer Select over Dropdown or Combobox when the list is static, non-searchable, and small, because Select gives you native keyboard handling, native mobile pickers, and automatic form submission for free. Choose Combobox or Dropdown instead when you need free-text entry, multi-select, custom option rendering (icons, avatars, descriptions), grouping with rich headers, or when you need full control over the popup surface. Use RadioGroup instead when every option should be visible at once and the number of choices is small — usually two to five — since exposing options without opening a menu reduces interaction cost. Use Checkbox or Switch when the choice is binary or on/off rather than a selection from a set.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"outline" \| "underline" \| "filled-darker" \| "filled-lighter" \| undefined` | `'outline'` | No | Controls the colors and borders of the Select. |
| `onChange` | `((ev: React.ChangeEvent<HTMLSelectElement>, data: SelectOnChangeData) => void) \| undefined` | — | No | Called when the user changes the select element's value by selecting an option. |
| `size` | `"small" \| "medium" \| "large" \| undefined` | `'medium'` | No | Matches the Input sizes |

### Prop Guidance

- **appearance**: Controls the fill and border treatment of the closed control: outline (the default) is a bordered box on a neutral background, underline shows only a bottom accent and is best for inline or minimal forms, filled-lighter and filled-darker use tinted backgrounds for use on surfaces of the matching tone. Choose based on the surface the Select sits on and verify contrast — the filled variants require the surrounding color to provide greater than 3:1 contrast against the fill. Use filled-lighter on light surfaces and filled-darker on elevated or tinted surfaces. `outline`
- **size**: Sets the height, padding, and font size of the control. Use small in dense toolbars and compact forms, medium (the default) for standard page content, and large for prominent or touch-oriented layouts. Sizes intentionally match the Input sizes so a Select and an Input placed side by side line up on the same row. `medium`
- **onChange**: Fires when the user selects a different option. The handler receives the React change event and a SelectOnChangeData object whose value holds the newly selected option's value; use the second argument to update controlled state rather than reading from the event target. Pair with the value prop for controlled usage or rely on defaultValue for uncontrolled usage, but never set both value and defaultValue on the same instance. `(event, data) => setValue(data.value)`
- **value**: Passed through to the native select to make the component controlled. The value must match the value attribute of one of the option children (or the option's text content when no value attribute is provided), otherwise the control renders with no selection. Update it inside the onChange handler to keep the UI in sync with state. `Blue`
- **defaultValue**: Sets the initially selected option for uncontrolled usage, as demonstrated in the InitialValue story. Use it when the selection never needs to be programmatically changed after mount; switch to value plus onChange when external controls or resets must drive the selection. `Green`
- **disabled**: Native attribute that removes the Select from the tab order and blocks interaction, as shown in the Disabled story. Use it only when the choice is genuinely unavailable, and always pair it with visible explanatory text so users understand why rather than being left guessing. `disabled`
- **required**: Native attribute indicating that a value must be chosen before submission. It is announced by screen readers when combined with a visible label, and browsers surface their own validation message; supplement it with an inline error message for clearer feedback. `required`
- **id**: Used together with the label element's htmlFor to give the Select an accessible name, as shown in every story. Generate ids with useId so multiple Selects on the same page never collide. `selectId`

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

- Always associate a visible label with the Select using a label element and a matching htmlFor/id pair, as shown in the Default and Size stories, so the control has an accessible name.
- Generate unique ids with the useId hook from @fluentui/react-components instead of hard-coding id strings, which prevents collisions when multiple Selects render on the same page.
- Pass an explicit value or defaultValue that matches one of the option values (or the option's text content) so the control starts in a known state rather than silently falling back to the first option.
- Use the appearance prop to match the surrounding surface — outline on standard cards and dialogs, filled-lighter or filled-darker on header or branded surfaces — and verify the filled variants meet the 3:1 contrast requirement against the adjacent background.
- Pick a size that matches neighboring controls — small for compact toolbars and dense forms, medium as the default, large for prominent or touch-first layouts.
- Use the onChange callback's second argument, SelectOnChangeData, to read the new value directly instead of digging through the change event target, keeping controlled state updates concise.
- Use the native disabled attribute for unavailable choices and the native disabled attribute on individual option elements when only some choices are unavailable, so assistive technology reports them correctly.

### Don'ts

- Don't use Select for searchable or free-text entry needs — the native popup cannot be filtered, so reach for Combobox or Dropdown instead.
- Don't build a custom dropdown out of Popover plus a list when a native select is sufficient; you would lose native mobile pickers, type-ahead, and form participation.
- Don't hard-code colors, border widths, or padding in makeStyles overrides for the Select; use tokens such as tokens.colorNeutralBackground1, tokens.colorNeutralStroke1, and tokens.borderRadiusMedium so the control follows the theme.
- Don't place a Select with the underline or filled appearances on a background where the surrounding contrast is below the 3:1 ratio required by the accessibility guidance for those styles.
- Don't mix uncontrolled usage (defaultValue) with controlled usage (value) on the same Select instance — React will warn and the displayed value can drift from your state.
- Don't rely on the first option as a placeholder substitute for a label; a first option like "Choose…" should be an actual, meaningful option or paired with a proper external label.
- Don't assume you can style the option elements or the dropdown popup — that surface is rendered by the operating system, so visual customization stops at the closed control.

## Anti-Patterns

### Using Select as a searchable or filterable list

❌ The option list is rendered by the operating system, so it cannot be filtered, virtualized, or given custom content. Teams often try to fake a search field by injecting a text input as an option, which breaks type-ahead, confuses screen readers, and produces an unusable popup.

✅ Use Combobox when users need to type to filter, and Dropdown when you need a Fluent-rendered popup with custom option content. Keep Select for short, static, non-searchable lists.

### Overriding the appearance with hard-coded styles

❌ Writing background-color, border, or padding literals into makeStyles for the Select bypasses the theming system, breaks in dark and high-contrast themes, and can silently violate the 3:1 contrast requirement for filled appearances.

✅ Choose the appropriate appearance prop value and, when additional styling is truly needed, reference Griffel tokens such as tokens.colorNeutralBackground1, tokens.colorNeutralStroke1, tokens.colorNeutralStrokeAccessible, and tokens.borderRadiusMedium so the control follows the active theme.

### Rendering a Select without an accessible name

❌ A Select with only option text and no label is announced by screen readers as an unlabeled combobox, so users hear the current value but not what they are choosing. Relying on a first option like "Select a color…" as the label is not reliable, because that option is announced as a selectable value.

✅ Always render a label element associated through htmlFor and a unique id generated with useId, and fall back to aria-label or aria-labelledby only when a visible label is genuinely impossible.

### Mixing controlled and uncontrolled value props

❌ Setting both value and defaultValue, or setting value without updating it in onChange, makes the control appear frozen or fall out of sync with application state, since the native select always displays the value prop when it is provided.

✅ Pick one model: defaultValue plus no value for uncontrolled usage, or value plus an onChange handler that writes back to state (reading data.value from SelectOnChangeData) for controlled usage.

### Using Select to hide large option sets

❌ A Select with hundreds of options creates hundreds of option DOM nodes and forces users to scroll a native popup with no search, which is slow to render and painful to navigate by keyboard.

✅ Move large catalogs to Combobox, which supports filtering and virtualized rendering, or restructure the choice into categories with smaller Selects.

## Accessibility

**Requirements**: Select renders a real select element, so it inherits the platform's accessibility semantics: an implicit combobox/listbox role, an accessible name from an associated label, and native form semantics. Every Select must have an accessible name — either from a visible label element referenced by htmlFor/id, or, when no visible label is possible, from aria-label or aria-labelledby. Because Select is a form control, it must also satisfy WCAG 3:1 non-text contrast for its border and indicator glyph and 4.5:1 contrast for its text; the Appearance story explicitly notes that the adjacent colors around the control must meet these ratios, particularly for filled-darker and filled-lighter appearances, whose fill must provide greater than 3:1 contrast against the immediate surrounding color. Optional states must be conveyed semantically: use the native required attribute for mandatory selection and aria-invalid plus a visible error message for validation failures. Do not communicate disabled state with color alone; the native disabled attribute removes the control from the tab order and is announced to assistive technology. Touch targets for the closed control must be at least 24 by 24 CSS pixels, which all three sizes satisfy by default.

| Key | Action |
| --- | --- |
| `Enter` | When the closed Select has focus, opens the option list and selects the highlighted option in platforms that use Enter to open; when the list is open, commits the highlighted option and closes the popup. |
| `Space` | Opens the option list on Windows and Linux browsers, and commits the highlighted option when the popup is open. |
| `ArrowDown` | Moves focus to the next option in the open list, or moves the selection to the next option in the closed list without opening it (browser-dependent). |
| `ArrowUp` | Moves focus to the previous option in the open list, or moves the selection to the previous option in the closed list (browser-dependent). |
| `Alt + ArrowDown` | Opens the option list in browsers that use this shortcut, giving an explicit open gesture on Windows and Linux. |
| `Home` | Moves the highlight or selection to the first option in the list. |
| `End` | Moves the highlight or selection to the last option in the list. |
| `Escape` | Closes the open option list without committing a change and returns focus to the closed Select. |
| `Tab` | Moves focus away from the Select and commits the currently highlighted option; a disabled Select is skipped entirely. |
| `A–Z / 0–9` | Type-ahead: typing printable characters jumps the selection to the first option whose text starts with the typed string. |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-invalid, aria-required, aria-disabled, aria-expanded, aria-controls, aria-activedescendant

**Screen Reader**: Because the underlying element is a native select, screen readers announce it as a combobox (or as a list box, depending on the platform) with its accessible name taken from the associated label, aria-label, or aria-labelledby. The current value is announced when focus lands on the control, and screen reader users can change the selection with the arrow keys without needing to open the visual popup, which is the primary advantage of the native element. When the popup is expanded, assistive technology reports the expanded state and reads each option's text as the user moves through the list, and disabled options are announced as unavailable. A disabled Select is announced as dimmed/unavailable and is not reachable via Tab, so avoid using it as the only indication of a required precondition — provide explanatory text instead. If the Select is marked required, screen readers announce the required state, and if aria-invalid is set, they announce the invalid state; pair aria-invalid with aria-describedby pointing at a visible error message, since a red border alone is not perceived by screen reader users.

## Styling

Prefer the built-in appearance and size props over custom styles — they are the supported way to change the control's look. When you do need customization, target the root via className and use makeStyles from @fluentui/react-components with Griffel tokens: for example tokens.colorNeutralStroke1 and tokens.colorNeutralStroke1Hover for borders, tokens.colorNeutralStrokeAccessible for the underline accent, tokens.colorNeutralBackground1 and tokens.colorNeutralBackground3 for fills, tokens.colorNeutralForeground1 and tokens.colorNeutralForegroundDisabled for text, tokens.borderRadiusMedium for corner rounding, tokens.spacingHorizontalMNudge and tokens.spacingHorizontalS for inner padding, and tokens.fontSizeBase300 / tokens.lineHeightBase300 for typography. Combine multiple classes with mergeClasses rather than string concatenation so Griffel's atomic class ordering is preserved. Setting a fixed width on the root is a common and safe customization, since a native select will otherwise size to its longest option; you can also let it stretch with width: '100%'. Note that the dropdown popup and the individual option elements are drawn by the operating system and cannot be styled from your stylesheet, so things like custom option backgrounds, icons per option, or grouped headers must be handled by switching to Dropdown or Combobox.

## Performance

Select is one of the lightest controls in the library: it composes a root element, the native select element, and an icon slot, with no portal, no focus-trap machinery, and no custom popup to mount. Rendering cost is therefore dominated by the number of option children, since each option is a real DOM node created up front. Lists of a few dozen options render imperceptibly; lists in the hundreds increase initial DOM size and style recalculation cost and should be reconsidered in favor of Combobox. Because styling is applied through Griffel's atomic classes, class generation is memoized per style object, so define styles with makeStyles at module scope rather than inside the component body and combine them with mergeClasses to avoid new class names on every render. Avoid recreating the onChange handler identity when it is not necessary, but note that a new inline handler on each render only re-renders the Select itself, not the option list, so the practical impact is small relative to the number of options.

## Theming & Tokens

Select consumes Fluent theme tokens rather than raw colors. The outline appearance draws its border from tokens.colorNeutralStroke1 with hover reinforcement from tokens.colorNeutralStroke1Hover, resting on tokens.colorNeutralBackground1 and using tokens.colorNeutralForeground1 for text. The underline appearance relies on tokens.colorNeutralStrokeAccessible for the bottom accent line, which is the token reserved for borders that must meet contrast requirements. The filled-lighter appearance uses a lighter neutral surface token (such as tokens.colorNeutralBackground1 layered over a tinted parent) while filled-darker uses tokens.colorNeutralBackground3; both set their text with tokens.colorNeutralForeground1. Disabled styling flows from tokens.colorNeutralForegroundDisabled and tokens.colorNeutralBackgroundDisabled. Sizing and typography are driven by the size prop, which selects the corresponding font and spacing tokens shared with Input, such as tokens.fontSizeBase300 and tokens.lineHeightBase300 for medium. Because all of these resolve from FluentProvider, a Select nested in a theme override or a high-contrast forced-colors context re-resolves its colors automatically; hard-coded values would not.

## Migration Notes

Select in v9 is a lightweight wrapper around the native select element rather than a custom popup-based control, which differs from v8's approach. The v8 props that controlled the dropdown, such as dropdownWidth and the custom renderers for the option list, no longer exist because the popup is native. The v9 appearance values are outline (default), underline, filled-darker, and filled-lighter — there is no bare or filled alias — and size is limited to small, medium, and large, matching the Input sizes so Select and Input can be aligned in the same form row. Use SelectOnChangeData from the onChange callback instead of reading the event target, and useSelectStyles/useSelect_unstable hooks are replaced by the makeStyles plus tokens styling model shown in the Appearance story.

## Edge Cases

- The displayed selection is matched against option values, and options without an explicit value attribute implicitly use their text content. Passing a value or defaultValue that matches neither results in a Select that renders with no visible selection, even though options exist.
- The Controlled story's narrative refers to controlling the selection by updating a selected prop on option elements, while the working example drives the value prop and updates it inside onChange. Follow the example — the value plus onChange pattern — since option-level selected attributes in React are controlled through the parent select's value.
- The underline, filled-darker, and filled-lighter appearances depend on the surrounding color for contrast. Placing filled-lighter on a light gray panel or filled-darker on a dark brand header can drop below the required 3:1 ratio, so verify the pairing rather than assuming the appearance is safe anywhere.
- The dropdown popup, option styling, and option icons are rendered by the browser or operating system. Any visual treatment applied to option elements is ignored on most platforms, so per-option icons or descriptions require Dropdown or Combobox.
- On native mobile browsers the select often opens as a full-screen wheel or sheet picker rather than an inline list, so layout assumptions about dropdown width or position do not hold across devices.
- A disabled Select is removed from the tab order entirely, which means keyboard users cannot reach it to discover why it is unavailable; always expose the reason in surrounding text or an associated description.
- Long option text is clipped by the closed control and typically truncated with an ellipsis, so set an explicit width on the root when option labels are long and the surrounding layout could be pushed out of alignment.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
