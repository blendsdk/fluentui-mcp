# Combobox

> **Package**: `@fluentui/react-combobox` v9.17.2
> **Import**: `import { Combobox } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Combobox is a form control that pairs an editable text input with a dropdown listbox of options. Users can type directly into the input, narrow the option list as they type, and pick a value from the list; with the freeform prop they can also commit typed text that has no matching Option. Internally the component is composed of several slots: a root slot, a required input slot (an input element carrying the combobox role), optional expandIcon and clearIcon slots, and a listbox slot that hosts the options. Options are declared as children using Option, optionally grouped with OptionGroup, so a Combobox can render both plain text options and rich options that contain nested components such as Persona. Selection can be single or multiple through the multiselect prop, visual density and emphasis are controlled by size and appearance, and clearable adds an affordance that lets users remove their current selection. The control works fully uncontrolled (defaultValue, defaultSelectedOptions) or fully controlled (value, selectedOptions, open) with the matching onInput, onChange, onOptionSelect, and onOpenChange callbacks, and onActiveOptionChange reports the option that keyboard navigation has highlighted so applications can react to it.

**When to use**: Use Combobox when the list of choices is long enough that typing to narrow it is valuable, when the input must remain editable after a selection, or when the user must be able to enter a value that is not in the list (freeform). It is also the right choice when selections are multiple and should be surfaced as text or as removable tags, or when options are rich, for example rows built from Persona with avatar and presence information. Prefer Dropdown when the input should be read-only and users only pick from a fixed list, Select for simple forms with a small static set of choices, and TagPicker when the primary interaction is managing a collection of discrete tags. Combobox is the heavier, more flexible control: reach for it when filtering, free text, or multiselect is part of the requirement rather than the exception.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | No | The primary slot, `<input>`, does not support children so we need to explicitly include it here. |
| `freeform` | `boolean \| undefined` | — | No | — |

### Prop Guidance

- **children**: Options are provided as children, normally Option elements and optionally OptionGroup wrappers. Each Option should carry a text prop when its content is not plain text so the Combobox knows what string to display after selection. `Option children with a text prop such as "Katri Athokas"`
- **freeform**: Enables free text entry so a value that does not match any option can be committed. Use it together with filtering and, ideally, with a dynamically rendered option representing the typed string so users get feedback about what they are selecting. `freeform`
- **appearance**: Selects the visual treatment of the control: outline (default, bordered on all sides), underline (bottom border only), filled-darker (no border, subtle background for white pages), or filled-lighter (no border, white background for colored surfaces). Choose based on the surrounding surface rather than aesthetic preference. `filled-darker`
- **size**: Sets the control's density to small, medium (default), or large. Match the size of neighboring form controls so a row of fields stays visually aligned. `small`
- **multiselect**: Turns the Combobox into a multi-selection control; selected options display checkbox icons in the list and onOptionSelect returns the full selectedOptions array. Combine with a controlled selectedOptions state so the app can render tags or a summary of the selection. `true`
- **clearable**: Renders a clear icon that removes the current selection. Not supported together with multiselect mode, so use it only in single-select configurations. `clearable`
- **disabled**: Prevents all interaction with the control and removes it from the tab order. Use it when the field is unavailable in the current context, and make sure the associated label makes the unavailability understandable. `disabled`
- **placeholder**: Provides hint text shown while the input is empty, such as "Select an animal". It supplements but never replaces an accessible label. `Select an animal`
- **value**: Controlled text shown in the input. When the selection is controlled with selectedOptions you must also supply value (or defaultValue) so a value can be displayed before options have rendered; update it from onInput while typing and from onOptionSelect when a choice is made. `Elvia Atkins`
- **defaultValue**: Uncontrolled initial text for the input, used together with defaultSelectedOptions. Both are required together for a pre-populated uncontrolled Combobox. `Elvia Atkins`
- **selectedOptions**: Controlled array of option values that are currently selected. Use it with multiselect or when you need to reset or programmatically change the selection, and keep it in sync with onOptionSelect. `['eatkins']`
- **defaultSelectedOptions**: Uncontrolled initial selection array, paired with defaultValue. Because the Combobox cannot display a value before options render, always provide defaultValue alongside it. `['eatkins']`
- **onOptionSelect**: Called when an option is selected or deselected; the callback data exposes the selected option values, the option text, and the full list of selected options. Use it to update controlled state and, in freeform scenarios, to decide whether the typed value matched an existing option. `(event, data) => setSelectedOptions(data.selectedOptions)`
- **onInput**: Fires as the user types, which is the right place to update a controlled value when the input text itself is the source of truth. `(event) => setValue(event.target.value)`
- **onChange**: Fires on input change and is commonly used to recompute filtered options or to inspect the typed string; in the Freeform example it drives the matching option list and the custom search option. `(event) => setMatchingOptions(filter(event.target.value))`
- **open**: Controls whether the listbox is expanded. When you take over the open state, pair it with onOpenChange and make sure keyboard interactions that normally open, close, and navigate the list still work. `true`
- **onOpenChange**: Reports requested open state changes from user interaction so a controlled open prop can be updated; the callback data includes the open flag and tells you which interaction triggered the change. `(event, data) => setOpen(data.open)`
- **onActiveOptionChange**: Fires when keyboard navigation changes the highlighted option and exposes the next option (including its text). Use it for previews or announcements; use onMouseEnter on options for hover-driven feedback instead. `(event, data) => setActiveOptionText(data?.nextOption?.text ?? '')`
- **listbox**: Slot props for the dropdown listbox, useful for attaching a ref (for example the virtualizer scroll ref) or a className that constrains its size. `{ ref: mergedRefs, className: styles.listbox }`
- **positioning**: Positioning options for the popup listbox; setting autoSize lets the listbox grow and shrink to fit the available viewport, which matters when the option count is large. `{ autoSize: true }`
- **aria-labelledby**: Wires the input to its visible label. Generate a stable id with useId for the label element and pass the same id here; in multiselect configurations the value can include an additional id describing the current selection. ``${comboId} ${selectedListId}``

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `clearIcon` | — | No | The dropdown clear icon |
| `expandIcon` | — | No | The dropdown arrow icon |
| `input` | — | Yes | The primary slot, an input with role="combobox" |
| `listbox` | — | No | The dropdown listbox slot |
| `root` | — | Yes | The root combobox slot |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Combobox, makeStyles, Option, useId } from '@fluentui/react-components';
import type { ComboboxProps } from '@fluentui/react-components';

export const Default = (props: Partial<ComboboxProps>): JSXElement => {
  const comboId = useId('combo-default');
  const options = ['Cat', 'Dog', 'Ferret', 'Fish', 'Hamster', 'Snake'];
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <label id={comboId}>Best pet</label>
      <Combobox aria-labelledby={comboId} placeholder="Select an animal" {...props}>
        {options.map(option => (
          <Option key={option} disabled={option === 'Ferret'}>
            {option}
          </Option>
        ))}
      </Combobox>
    </div>
  );
};
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Combobox, makeStyles, Option, tokens, useId } from '@fluentui/react-components';
import type { ComboboxProps } from '@fluentui/react-components';

export const Appearance = (props: Partial<ComboboxProps>): JSXElement => {
  const comboId = useId('combobox');
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div>
        <label id={`${comboId}-outline`}>Outline</label>
        <Combobox aria-labelledby={`${comboId}-outline`} placeholder="Select a color" appearance="outline" {...props}>
          <Option>Red</Option>
          <Option>Green</Option>
          <Option>Blue</Option>
        </Combobox>
      </div>

      <div>
        <label id={`${comboId}-underline`}>Underline</label>
        <Combobox
          aria-labelledby={`${comboId}-underline`}
          placeholder="Select a color"
          appearance="underline"
          {...props}
        >
          <Option>Red</Option>
          <Option>Green</Option>
          <Option>Blue</Option>
        </Combobox>
      </div>

      <div className={styles.filledDarker}>
        <label id={`${comboId}-filledDarker`}>Filled Darker</label>
        <Combobox
          aria-labelledby={`${comboId}-filledDarker`}
          placeholder="Select a color"
          appearance="filled-darker"
          {...props}
        >
          <Option>Red</Option>
          <Option>Green</Option>
          <Option>Blue</Option>
        </Combobox>
      </div>

      <div className={styles.filledLighter}>
        <label id={`${comboId}-filledLighter`}>Filled Lighter</label>
        <Combobox
          aria-labelledby={`${comboId}-filledLighter`}
          placeholder="Select a color"
          appearance="filled-lighter"
          {...props}
        >
          <Option>Red</Option>
          <Option>Green</Option>
          <Option>Blue</Option>
        </Combobox>
      </div>
    </div>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story:
        'A Combobox can have the following `appearance` variants:\n' +
        '- `outline` (default): has a border around all four sides.\n' +
        '- `underline`: only has a bottom border.\n' +
        '- `filled-darker`: no border, only a subtle background color difference against a white page.\n' +
        '- `filled-lighter`: no border, and a white background.\n',
    },
  },
};
```

### ActiveOptionChange

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Combobox, makeStyles, Option, useId } from '@fluentui/react-components';
import type { ComboboxProps } from '@fluentui/react-components';

export const ActiveOptionChange = (props: Partial<ComboboxProps>): JSXElement => {
  const comboId = useId('combo-active-option-change');
  const options = ['Cat', 'Dog', 'Ferret', 'Fish', 'Hamster', 'Snake'];
  const styles = useStyles();

  const [activeOptionText, setActiveOptionText] = React.useState('');

  const onActiveOptionChange = React.useCallback<NonNullable<ComboboxProps['onActiveOptionChange']>>(
    (_, data) => {
      if (data?.nextOption?.text) {
        setActiveOptionText(data?.nextOption?.text);
      }
    },
    [setActiveOptionText],
  );

  const onMouseEnter = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setActiveOptionText(`${e.currentTarget.textContent} (Mouse enter)`);
    },
    [setActiveOptionText],
  );

  return (
    <div className={styles.root}>
      {activeOptionText}
      <label id={comboId}>Best pet</label>
      <Combobox
        aria-labelledby={comboId}
        placeholder="Select an animal"
        onActiveOptionChange={onActiveOptionChange}
        {...props}
      >
        {options.map(option => (
          <Option key={option} disabled={option === 'Ferret'} onMouseEnter={onMouseEnter}>
            {option}
          </Option>
        ))}
      </Combobox>
    </div>
  );
};

ActiveOptionChange.parameters = {
  docs: {
    description: {
      story:
        'OnActiveOptionChange notifies the user when the active option in the Combobox was changed ' +
        'by keyboard. To react on mouse hover events, use onMouseEnter on the invididual options.',
    },
  },
};
```

## Best Practices

### Do's

- Give every Combobox an accessible name by rendering a visible label and wiring it up with aria-labelledby (or an htmlFor/id pair on the input), exactly as the Default, Appearance, and Grouped examples do with useId.
- Set the text prop on Option whenever an option contains nested elements such as Persona or an icon, so the Combobox has a plain-text value to display for the selection.
- Pair freeform with filtering, for example by driving the option list through useComboboxFilter or a custom filter, and surface a distinct option for the unmatched typed string so users can tell whether they are committing new text or an existing option.
- Always provide a value or defaultValue whenever you provide selectedOptions or defaultSelectedOptions, otherwise the Combobox cannot render a value before the options have mounted.
- Group related options with OptionGroup and an optional label when the list has natural categories, so the list remains scannable and the grouping is announced semantically.
- Use Virtualizer for very large option sets, keeping each Option's aria-posinset and aria-setsize accurate so assistive technology can report position within the full list.
- React to keyboard-driven highlight changes with onActiveOptionChange, and handle mouse hover separately with onMouseEnter on the individual options.
- Prefer removable tags or a controlled value string for multiselect feedback so users can see and undo their choices, and manage focus explicitly when tags are removed.

### Don'ts

- Do not place interactive elements such as buttons or links inside an Option; options should be selectable rows only, not nested controls.
- Do not combine clearable with multiselect; the clear affordance is not supported in multiselect mode yet.
- Do not rely solely on a placeholder for labeling; placeholders disappear once a value exists and are not a substitute for an associated label.
- Do not control the open state through onOpenChange without also reproducing the keyboard interactions, or keyboard accessibility will degrade.
- Do not provide selectedOptions without a matching value or defaultValue, because the component will not be able to display a selection before options render.
- Do not assume the value string is the right way to present multiselect results; tags give better UX and accessibility than a comma-joined string.
- Do not render thousands of Option children without virtualization, as mounting every option hurts open latency and scroll performance.
- Do not conflate onInput/onChange (typing in the text field) with onOptionSelect (committing an option); use each for its own purpose.

## Anti-Patterns

### Interactive content inside options

❌ Placing buttons, links, or other focusable controls inside an Option breaks the combobox interaction model: focus never leaves the input, so the nested control cannot be reached or activated reliably, and the listbox role is violated.

✅ Keep Option content non-interactive. If an action per option is required, expose it outside the list (for example as separate controls in the row the Combobox belongs to) or use a different component that supports row actions.

### Combining clearable with multiselect

❌ The clear affordance is not supported in multiselect mode yet, so the clear icon either does not appear or behaves inconsistently, leaving users without the expected way to reset the field.

✅ Use clearable only in single-select configurations. In multiselect configurations, provide explicit removal controls such as tags with dismiss buttons or a separate reset action.

### Controlled selection without a controlled value

❌ If selectedOptions or defaultSelectedOptions is supplied without value or defaultValue, the Combobox cannot display anything before the options have rendered, so the control appears empty even though a selection exists.

✅ Always define value or defaultValue whenever the selection is controlled or a default selection is provided, and update it in the same handlers that change the selection.

### Freeform input without filtering or feedback

❌ Turning on freeform without filtering or a dedicated freeform option leaves users unable to tell whether their typed text will be treated as a new value or matched against existing options, and long lists become unusable.

✅ Implement filtering (useComboboxFilter or a custom filter), and render a distinct option for the unmatched typed string such as a search-for entry, so the intent of the current input is unambiguous.

### Unvirtualized huge option lists

❌ Rendering thousands of Option children mounts the whole list on open, which delays opening the popup and degrades scrolling and typing responsiveness.

✅ Use Virtualizer inside the listbox, keep the item size in sync with the real row height plus gap, and set aria-posinset and aria-setsize on each rendered Option so the list remains comprehensible to assistive technology.

### Manually controlling open state without keyboard parity

❌ Taking over the open state through open and onOpenChange without reproducing the built-in keyboard behavior makes the control effectively keyboard-inaccessible, since arrow keys and escape would no longer open and close the list.

✅ Keep the open state uncontrolled unless there is a strong reason, and if it must be controlled, verify that arrows, Enter, Escape, Home, End, and Tab still produce the expected behavior.

## Accessibility

**Requirements**: The input slot renders an input element with the combobox role, so it must always have an accessible name: associate a visible label using aria-labelledby or an id/htmlFor pair, and make sure the label is unique per instance (useId is the recommended way to generate ids). Use the disabled prop rather than visual styling alone when the control is unavailable. When options are virtualized, keep aria-posinset and aria-setsize correct on each rendered Option so the full list size is conveyed. Decorative content inside rich options, such as an avatar, should be hidden from assistive technology with aria-hidden so the option announces only meaningful text. Announce multiselect results outside the input in an element that is referenced by aria-labelledby (as in the Multiselect example) or with a live region so screen reader users learn what was selected.

| Key | Action |
| --- | --- |
| `ArrowDown` | Opens the listbox when closed, or moves the active option to the next option when open |
| `ArrowUp` | Moves the active option to the previous option, wrapping within the list |
| `Alt+ArrowDown` | Opens the listbox without changing the current value |
| `Home` | Moves the active option to the first option in the list |
| `End` | Moves the active option to the last option in the list |
| `Enter` | Selects the currently active option and closes the listbox (in freeform mode, commits the active option or the typed string) |
| `Escape` | Closes the listbox without changing the selection and returns focus to the input |
| `Tab` | Commits the active value if appropriate, closes the listbox, and moves focus to the next focusable element |
| `Shift+Tab` | Closes the listbox and moves focus to the previous focusable element |
| `Printable characters` | Type into the input to filter or search the options when filtering is implemented |
| `Backspace` | Edits the typed value in multiselect mode, which is commonly combined with tag removal controls |

**ARIA**: role="combobox" (applied to the input slot), aria-labelledby (required to name the input; used in nearly every Combobox example), aria-posinset (set on Option when using virtualization), aria-setsize (set on Option when using virtualization to convey the total option count), aria-hidden (used on decorative nested content such as avatars inside rich options)

**Screen Reader**: Focus lands on the input, which announces the combobox role, its accessible name from aria-labelledby, the current value or placeholder, and the expanded or collapsed state. As the user arrows through options, the active option's text is announced without moving DOM focus away from the input, which is why onActiveOptionChange fires on keyboard navigation only. Selecting an option updates the input's value, which is re-announced, and in multiselect configurations the surrounding description element referenced through aria-labelledby communicates the accumulated selection. When the listbox opens, screen readers announce the list and its options; with virtualization, aria-posinset and aria-setsize let the reader say where an option sits in the full set. A disabled Combobox is skipped in the tab order and is announced as unavailable.

## Styling

Combobox exposes slots (root, input, expandIcon, clearIcon, listbox) that can each be targeted with a className for surgical overrides; the Appearance story shows that choosing an appearance variant is the preferred first step, since outline, underline, filled-darker, and filled-lighter already encode border, background, and focus treatments. Use the filled-darker variant on white pages and filled-lighter on darker surfaces so the control keeps contrast with its container. When customizing borders and focus rings, work with tokens such as tokens.colorNeutralStroke1, tokens.colorNeutralStroke1Hover, tokens.colorNeutralStroke1Pressed, tokens.colorNeutralStrokeAccessible, and tokens.colorBrandStroke1, and adjust the input background with tokens.colorNeutralBackground1 and tokens.colorNeutralBackground1Hover. Placeholder and secondary text should use tokens.colorNeutralForeground4 or tokens.colorNeutralForeground3, disabled text tokens.colorNeutralForegroundDisabled on tokens.colorNeutralBackgroundDisabled, and value text tokens.colorNeutralForeground1. Keep radii aligned with tokens.borderRadiusMedium and padding/typography aligned with tokens.spacingHorizontalMNudge, tokens.spacingHorizontalS, tokens.fontSizeBase300, and tokens.fontSizeBase200 or tokens.fontSizeBase400 for small and large sizes, matching what the size prop already produces.

## Performance

Combobox mounts its option list only when the popup opens, so keep the children you pass in efficient to render: memoize option arrays and avoid recreating option elements with new keys on every keystroke. When filtering, recompute the option list from the typed query rather than rendering the full set and hiding items, and use useComboboxFilter or a trimmed custom filter for predictable cost. For very large collections, virtualize the listbox with Virtualizer, size the virtualizer items to the real option height plus the row gap, and choose buffer items and buffer size that keep page up/down navigation smooth. Note that onOpenChange plus a scrollTo scheduled with a timeout is the supported pattern for restoring scroll position to the active index when a virtualized list reopens, and that positioning autoSize avoids the listbox growing beyond the viewport. In multiselect mode, controlled selectedOptions updates rerender the option children, so keep per-option work light.

## Theming & Tokens

Combobox derives all of its visuals from Fluent theme tokens, so it adapts automatically to FluentProvider themes. appearance maps directly onto token pairs: outline and underline draw their borders from tokens.colorNeutralStrokeAccessible with hover and pressed states from tokens.colorNeutralStroke1Hover and tokens.colorNeutralStroke1Pressed, and the brand keyboard focus treatment uses tokens.colorBrandStroke1; filled-darker uses tokens.colorNeutralBackground2 while filled-lighter uses tokens.colorNeutralBackground1. Value text uses tokens.colorNeutralForeground1, placeholder text tokens.colorNeutralForeground4, disabled text tokens.colorNeutralForegroundDisabled over tokens.colorNeutralBackgroundDisabled, and the expand and clear icons inherit neutral foreground tokens that adjust for hover and disabled states. Shape, spacing, and type come from tokens.borderRadiusMedium, tokens.spacingHorizontalMNudge, tokens.spacingVerticalXS, tokens.fontSizeBase300 (with tokens.fontSizeBase200 and tokens.fontSizeBase400 for the small and large sizes). Overriding these tokens inside the Combobox's className (or through a wrapper) is preferable to overriding the slot CSS directly, since the component's style variants read from the tokens.

## Migration Notes

In v9 the editable, type-to-filter control is Combobox, and it is fully slot- and token-based rather than theme-styled. Selection is expressed through selectedOptions and reported back via onOptionSelect with the selected option values, option text, and full selection array in the callback data, so v8 code that read a value directly from change handlers should be updated to use those data fields. Multiselect is expressed with the multiselect prop and each selected option value, and the recommended pattern is removable tags rather than a joined value string; the value-string approach shown in the MultiselectWithValueString example exists to mimic v8 behavior and is explicitly discouraged in favor of tags because of its better UX and accessibility. Clearing a selection is now a first-class clearable prop that renders a clear icon, but it is not supported together with multiselect mode. Freeform entry is opt-in through the freeform prop and is recommended together with filtering. Appearance and size variants replace per-theme class overrides, and rich options rely on Option's text prop to supply the plain-text value used by the Combobox.

## Edge Cases

- clearable is not supported together with multiselect, so a multiselect Combobox that also needs resetting requires a custom removal affordance such as dismissible tags.
- When the selection is controlled or a default selection is supplied, a value or defaultValue must also be provided, otherwise no value can be displayed before the options render.
- Rich options that wrap components such as Persona must set Option's text prop; without it the Combobox has no plain-text value to show for the selection.
- Showing a comma-joined string of multiselect values works but is inferior to tags for both usability and accessibility, and it typically requires clearing the value on focus and rebuilding it on blur.
- Virtualized lists need aria-posinset and aria-setsize on each Option, and often need a deferred scrollTo when the popup reopens so the previously selected index is visible again.
- Disabled options remain part of the list for navigation purposes and should be used sparingly, since keyboard users will still move through them.
- Option children are not rendered until the popup opens, so any logic that depends on option metadata (for example matching a default selection to its text) must not assume the options exist at first paint.
- A placeholder alone does not satisfy labeling requirements, so aria-labelledby or an id-based label association is mandatory even in compact layouts.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
