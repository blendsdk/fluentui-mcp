# Combobox

> **Package**: `@fluentui/react-combobox` v9.17.2
> **Import**: `import { Combobox } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Combobox is a form input that pairs a text field with a dropdown listbox, letting users either choose from a predefined set of options or, when the freeform prop is enabled, enter a value of their own. It composes a root wrapper, an input rendered with the combobox role (the primary slot), an optional expand icon, an optional clear icon, and a listbox slot that hosts Option children, which can be grouped with OptionGroup or replaced by custom wrappers. Selection is reported through onOptionSelect together with a selectedOptions array, while the visible text in the input is driven by value, defaultValue, or the text prop of the chosen Option. The component supports four appearance variants (outline, underline, filled-darker, filled-lighter), three sizes, single and multi select modes, a clearable input, grouped and complex option content such as Persona rows, filtering through the useComboboxFilter hook, and virtualized rendering for very large option sets. It is imported from @fluentui/react-components along with Option and OptionGroup, and its open state, selection, and typed value can each be controlled or left uncontrolled.

**When to use**: Use Combobox when the user must pick from a known list but typing to filter is valuable, or when the user is allowed to submit text that is not in the list (the freeform prop). It is the right choice for searchable pickers, animal or color pickers with many entries, person pickers built from Persona rows inside Options, and multi-value pickers where the chosen items are echoed back as removable tags. Prefer Select when the list is short, fixed, and no typing or freeform entry is expected. Prefer TagPicker when the primary job is entering many distinct free-text tokens. Prefer Search or a plain Input when there is no list of suggestions at all, and prefer DatepickerCompat or TimepickerCompat when the value is a date or time with specialized parsing. Reach for Combobox over a Menu when the result of the interaction is a form value rather than a command.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `any` | — | No | The primary slot, `<input>`, does not support children so we need to explicitly include it here. |
| `freeform` | `boolean \| undefined` | — | No | — |

### Prop Guidance

- **freeform**: Enables free text entry so users are not restricted to the listed options. Combine it with filtering and, when the typed string matches no option, render a synthetic Option whose text is the typed string so the chosen value is preserved. `true`
- **children**: The dropdown content. Supply Option elements, optionally wrapped in OptionGroup for semantic grouping or in custom wrappers that emit Options. Children are not rendered inside the input, because the input is the primary slot and cannot accept children. `Option and OptionGroup elements`
- **appearance**: Chooses the visual treatment of the field. Use outline for standard forms, underline for low-chrome surfaces, filled-darker when the field sits on a white page and should read as a subtle filled surface, and filled-lighter when the surrounding surface is already tinted. `outline`
- **size**: Sets the control size for the input, expand icon, and option rows. Use small in dense toolbars or side panels, medium as the default for forms, and large for prominent or sparse layouts. `medium`
- **disabled**: Removes the entire Combobox from interaction and applies disabled tokens. Disabling individual choices is a separate concern handled by disabling those Options. `true`
- **clearable**: Renders the clear icon so users can wipe the current selection with one action. It is not supported together with multiselect yet, so use removable tags there instead. `true`
- **multiselect**: Allows more than one option to be selected and renders selection affordances on the options, such as checkbox style indicators. Pair it with a controlled selectedOptions array so the chosen values can be displayed, and surface those values as tags for the best experience. `true`
- **placeholder**: Short hint shown while the input is empty, such as describing the expected choice. Never use it as the only label; it disappears on the first keystroke. `Select an animal`
- **value and defaultValue**: Drive or initialize the text shown in the input. Whenever selection is controlled or a default selection is provided, also supply value or defaultValue so the field can display the selection before the Options are rendered. `Elvia Atkins`
- **selectedOptions and defaultSelectedOptions**: The array of currently selected option values, used to control or initialize selection. Keep it in sync from onOptionSelect, and always pair it with value or defaultValue. `array of selected option values`
- **open and onOpenChange**: Control whether the listbox is displayed. onOpenChange reports the incoming open state together with the trigger, which is how the checkbox-driven example mirrors the component state. When you control open, you must keep every keyboard and pointer trigger working. `true`
- **onOptionSelect**: Fires when an option is chosen and provides the option text and the updated selectedOptions array. Use it to update controlled state, to set or clear the input value, and to detect when a freeform string does not correspond to a real option. `data.selectedOptions`
- **onActiveOptionChange**: Notifies you when keyboard navigation changes the active option, exposing the next option for lightweight previews or live regions. It does not fire for mouse hover, so attach onMouseEnter to individual Options when hover feedback is needed. `nextOption.text`
- **onChange and onInput**: Respond to text typed into the input. Use them to drive filtering, to decide when to show a custom freeform option, and to keep a controlled value in sync with user typing. `text typed by the user`
- **onFocus and onBlur**: Manage the multiselect display strategy: clear the controlled value on focus so the user can type freely, then restore the joined selection on blur so the field summarizes the choice while unfocused. `joined selection restored on blur`
- **aria-labelledby**: Connects the field to its visible label id. In multiselect, append the id of the element that lists chosen values so the accessible name also conveys the current selection, and switch the value conditionally based on whether any options are selected. `label id followed by selection summary id`
- **positioning**: Configuration forwarded to the positioning layer for the dropdown. Turning on autoSize bounds the listbox against small viewports and is the recommended companion for long lists and virtualized content. `autoSize`
- **listbox**: The dropdown slot itself. It accepts a ref and className, which is how the virtualizer example attaches the scroll container ref to the listbox and constrains its size; use it when you need to scroll the list programmatically after the dropdown opens. `className and scroll ref for the list container`
- **ref**: Forwarded to the input element, which is useful for returning focus to the Combobox after an external action such as removing a selected tag. `input element reference`
- **id**: Sets the input id so a native label can reference the field directly. The examples use both the id plus htmlFor pattern and the aria-labelledby pattern; either is acceptable as long as the field has an accessible name. `combo-controlled`

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

- Always pair the Combobox with a visible label element and connect them with aria-labelledby, as every documented example does with a generated id.
- Give each Option a stable, unique value and keep the selection in a selectedOptions array updated from onOptionSelect, so controlled and uncontrolled usage behave consistently.
- When an Option renders rich content such as a Persona, also set the Option text prop to the plain-text equivalent, because that text becomes the Combobox value once the option is chosen.
- Enable filtering with the useComboboxFilter hook whenever freeform is on, and pass a noOptionsMessage so users understand why the list is empty.
- In multiselect mode, render the chosen values as removable tags and include the id of the element that lists them in aria-labelledby, so the accessible name reflects both the field and the current selection.
- Move focus deliberately after removing a tag: focus the previous or next remove button, or fall back to the Combobox input, as the tags example does.
- Use the Virtualizer from the unstable entry point for very large option sets, and expose aria-posinset and aria-setsize on each virtualized Option so assistive technology can announce position within the full set.
- Test keyboard-only flows whenever you control the open prop, because taking over open state means you must also reproduce the interactions the component would otherwise handle.
- Document the current value in the label or an adjacent element when a controlled selection starts populated, since the input cannot display a value before Options render unless value or defaultValue is supplied.

### Don'ts

- Do not place interactive elements such as buttons or links inside an Option; options must remain simple, selectable rows.
- Do not provide selectedOptions or defaultSelectedOptions without also providing value or defaultValue, or the Combobox will not be able to show the selection before the Options are rendered.
- Do not combine clearable with multiselect, because clearing is not supported in multiselect mode yet.
- Do not rely on the placeholder as the field label; placeholders disappear as soon as the user types and are not an accessible name.
- Do not expect mouse hover to update the active option; onActiveOptionChange reports keyboard-driven changes only, so hover feedback must be handled with onMouseEnter on the individual Options.
- Do not render thousands of Options without virtualization, and do not rebuild the option array on every keystroke without memoizing it.
- Do not use disabled Options as a way of hiding entries that should not exist; disabled rows stay visible and are simply skipped during keyboard navigation.
- Do not funnel a multiselect value through the input string long term; tags are recommended over a joined value string because they provide better user experience and accessibility.

## Anti-Patterns

### Interactive content inside options

❌ Embedding buttons, links, or other focusable controls inside an Option breaks listbox semantics and makes keyboard navigation ambiguous, because the option is itself the target of selection.

✅ Keep Option content non-interactive. Render rich but inert content such as a Persona row, and move any actions outside the dropdown or express them through selection instead.

### Selection controlled without a matching value

❌ Supplying selectedOptions or defaultSelectedOptions without a value or defaultValue leaves the input blank until the Options render, so the current selection is invisible on first paint and confusing to assistive technology.

✅ Always pair a controlled or defaulted selection with a controlled or defaulted value so the field can display the chosen text immediately.

### Clearable multiselect

❌ Clear support is not implemented for multiselect yet, so adding the clearable prop to a multi-value Combobox produces an affordance that does not do what users expect.

✅ Render the selection as removable tags and manage the selectedOptions array yourself, clearing it explicitly when the user removes the last tag.

### Hover-based active option tracking

❌ onActiveOptionChange reports keyboard-driven active option changes only, so building hover previews on it yields a stale or frozen indicator when users move the mouse.

✅ Handle onMouseEnter on each Option for pointer-driven feedback and keep onActiveOptionChange for keyboard navigation.

### Unvirtualized long option lists

❌ Mounting thousands of Options bloats the DOM, slows opening and filtering, and can make scrolling inside the listbox janky.

✅ Use the Virtualizer from the unstable entry point with a measured item size and row gap, set aria-posinset and aria-setsize on each generated Option, and enable positioning autoSize to bound the list height.

### Controlling open state without full trigger coverage

❌ A controlled open prop that ignores some triggers, such as typing, arrow keys, Escape, or blur, silently degrades keyboard accessibility even though the UI still looks correct.

✅ Always route the incoming onOpenChange data into your state and verify every documented keyboard path still opens, closes, and selects as expected.

### Freeform without filtering or a custom option

❌ Enabling freeform while filtering by hand and without a synthetic option means typed text that matches nothing disappears on selection or cannot be chosen at all.

✅ Use the useComboboxFilter hook with a noOptionsMessage, and render an extra Option whose text is the typed string when no listed option matches.

## Accessibility

**Requirements**: The Combobox must satisfy WCAG 2.1 AA expectations for form controls: it needs a programmatic label (the examples wire a label element with aria-labelledby or an id plus label association), it must be fully operable from the keyboard without a mouse, focus indication must remain visible, and text including the placeholder and disabled state must meet contrast requirements. Because the input carries the combobox role, it must expose its expanded state and the active option, and the listbox must not trap focus. In multiselect, clearing or removing a value must be achievable without a pointer, and focus must be restored to a sensible element after a removal. When the open prop is controlled, the implementer takes responsibility for keeping every trigger working, since keyboard accessibility can degrade if open state updates are missed.

| Key | Action |
| --- | --- |
| `ArrowDown` | Opens the listbox when closed and moves the active option to the next entry when open. |
| `ArrowUp` | Moves the active option to the previous entry; from the first entry the listbox typically closes and the typed value is restored. |
| `Alt+ArrowDown` | Opens the dropdown without changing the typed value in the input. |
| `Enter` | Selects the active option and writes its text into the input; in freeform mode it commits whatever the user typed. |
| `Escape` | Closes an open listbox and reverts the input to the current selection; a further press may clear typed freeform text. |
| `Space` | In multiselect mode, toggles the active option on or off without closing the dropdown. |
| `Home` | Moves the active option to the first entry in the listbox. |
| `End` | Moves the active option to the last entry in the listbox. |
| `Page Up` | Moves the active option up by a page in long lists; virtualized configurations size their buffers to accommodate this. |
| `Page Down` | Moves the active option down by a page in long lists; virtualized configurations size their buffers to accommodate this. |
| `Tab and Shift+Tab` | Commits the pending value and moves focus to the next or previous focusable element, closing the listbox. |
| `Backspace and Delete` | Edits the typed text in the input, which is how users refine a filter or remove a freeform entry. |

**ARIA**: role=combobox on the input slot, aria-labelledby, aria-expanded, aria-controls, aria-activedescendant, aria-haspopup=listbox, aria-disabled, aria-posinset, aria-setsize, aria-hidden

**Screen Reader**: Screen readers announce the input as a combobox with the accessible name supplied by aria-labelledby, then report the expanded or collapsed state as the listbox opens and closes. DOM focus stays on the input while the active option is communicated through aria-activedescendant, so arrow key navigation is announced as movement within the list rather than as focus changes. Options are announced with their text content, and disabled Options such as the Ferret entry in the examples are announced as unavailable and are skipped by navigation. When an Option renders rich content, the plain text from the Option text prop is what users hear and what appears in the input after selection. In multiselect, the example adds a second id to aria-labelledby so the element listing the chosen values is read alongside the field name, giving users immediate feedback about what is currently selected; the removable tags use their own accessible names built from a hidden Remove label plus the option name. Virtualized lists must expose aria-posinset and aria-setsize so the position within a very large set is still announced.

## Styling

Style the Combobox through its slots, which are the root, input, listbox, expandIcon, and clearIcon. Use makeStyles to set width on the root and constrain the listbox height, and pass the listbox slot an object containing a className and a ref when you need to control the scroll container, exactly as the virtualizer example does. The appearance variants map to different surface treatments: outline keeps a full border using tokens.colorNeutralStroke1 and pairs with tokens.colorNeutralBackground1, underline keeps only a bottom border using tokens.colorNeutralStrokeAccessible, filled-darker relies on a subtle neutral surface such as tokens.colorNeutralBackground3 against a white page, and filled-lighter uses tokens.colorNeutralBackground1. Focus feedback uses brand tokens such as tokens.colorCompoundBrandStroke and tokens.colorBrandStroke1. Rounded corners come from tokens.borderRadiusMedium, and padding and typography follow tokens.spacingHorizontalM, tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300 so all three sizes stay on the type ramp. The expand and clear icons sit on tokens.colorNeutralForeground2 and tokens.colorNeutralForeground3, with tokens.colorNeutralForeground1 on hover. Option rows respond to tokens.colorNeutralBackground1Hover while the checked indicator typically resolves from compound brand tokens, and disabled controls resolve from tokens.colorNeutralBackgroundDisabled and tokens.colorNeutralForegroundDisabled. When you build tags, the tags example reuses Button with appearance primary and a dismiss icon from the icon package, styled with the same neutral tokens for the list container.

## Performance

Rendering cost is dominated by the option list. Keep the Options memoized and avoid recreating the array or the child elements on every keystroke, especially when filtering, where the useComboboxFilter hook already produces the filtered children for you. For lists in the thousands, wrap the Options in the Virtualizer from the unstable entry point and derive lengths from useStaticVirtualizerMeasure with a default item size that matches the Option height plus the row gap; the documented example uses a 32 pixel item, a 2 pixel gap, and buffer sizes tuned for page up and page down navigation. Virtualized scrolling must run after the listbox is open, so the example defers the scroll with a timeout cleared in onOpenChange. Constrain the dropdown with positioning autoSize rather than a fixed pixel height, and keep onActiveOptionChange and onOptionSelect callbacks stable with useCallback so option rows are not re-rendered on each interaction. When tracking the selection across a virtualized list, store only the selected index or value rather than measuring DOM nodes.

## Theming & Tokens

Combobox is fully token driven, so every state resolves from the active theme supplied by the Provider. The outline appearance draws its border from tokens.colorNeutralStroke1 and sits on tokens.colorNeutralBackground1, while the underline appearance uses tokens.colorNeutralStrokeAccessible for its single bottom edge, filled-darker leans on a tinted neutral surface such as tokens.colorNeutralBackground3 for placement over a white page, and filled-lighter uses tokens.colorNeutralBackground1 for placement over tinted surfaces. Focus rings and checked indicators resolve from brand tokens such as tokens.colorCompoundBrandStroke, tokens.colorCompoundBrandForeground1, and tokens.colorBrandStroke1. Text uses tokens.colorNeutralForeground1, secondary and placeholder text uses tokens.colorNeutralForeground2 through tokens.colorNeutralForeground4, and disabled fields resolve from tokens.colorNeutralBackgroundDisabled with tokens.colorNeutralForegroundDisabled. Shape, typography, and spacing follow tokens.borderRadiusMedium, tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.lineHeightBase300, and tokens.spacingHorizontalM, and Option hover states use tokens.colorNeutralBackground1Hover with selected rows using the corresponding selected background token. Because the values are semantic rather than literal colors, switching a Provider theme to dark mode or a brand variant restyles every appearance without additional overrides.

## Migration Notes

Combobox in v9 is a composed component rather than a monolithic class, and styling moves to Griffel with makeStyles and design tokens instead of theme style objects, so any custom class overrides for the old sub-parts must be rewritten against the root, input, listbox, expandIcon, and clearIcon slots. Freeform entry is now an explicit freeform prop that is meant to be combined with filtering through the useComboboxFilter hook, and selection is reported through onOptionSelect with a selectedOptions array instead of through per-item callbacks. Open state is controllable through the open prop with onOpenChange supplying the state hint and trigger, which requires additional care to keep keyboard interaction intact. For multiselect parity with earlier versions, a controlled value can still display the joined selection when the field is not focused, but the documented guidance is to prefer removable tags, since they have better user experience and accessibility. Because the input is the primary slot and cannot accept children, options are declared as children of the Combobox itself and are forwarded into the listbox.

## Edge Cases

- The clearable prop is not supported in multiselect mode yet, so a multi-value field must implement removal through tags or explicit state clearing.
- Options that render rich JSX need their text prop set to the plain-text equivalent; without it the input has no sensible value to display after selection and screen readers lose the label.
- A controlled or defaulted selection without a controlled or defaulted value leaves the field blank until the Options render, which looks like data loss on first paint.
- onActiveOptionChange covers keyboard navigation only; hover feedback requires onMouseEnter on the individual Options, so previews built on the active option can appear frozen for mouse users.
- Virtualized lists must scroll after the dropdown is open; calling scroll on the listbox ref immediately in onOpenChange may run before the element is laid out, which is why the documented example defers it with a timeout and clears that timer on subsequent changes.
- Disabled Options remain rendered and hoverable but are skipped during keyboard navigation, so they are not a way to hide entries the user should not see.
- In multiselect freeform scenarios the input value must be cleared after each selection and refilled from the joined selection when the field loses focus, otherwise the previously chosen text stays in the input.
- When tags are used to represent the selection, aria-labelledby must switch between the label alone and the label plus the selection summary id, and focus must be moved to a neighboring tag or back to the input after a removal.

## See Also

- - [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
