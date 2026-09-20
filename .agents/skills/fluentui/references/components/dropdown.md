# Dropdown

> **Package**: `@fluentui/react-combobox` v9.17.2
> **Import**: `import { Dropdown } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Dropdown is a form input that lets people choose one or more values from a list of options that is revealed on demand. Collapsed, it renders as a single combobox-styled button that displays the current value or the placeholder text; expanded, it reveals a listbox populated with Option children, optionally arranged into OptionGroup sections. Because the value is derived from the selected Option's rendered text (or the explicit text prop on an Option), the Dropdown button is selection-oriented rather than free-form — it always reflects a value that came from the option list unless freeform is enabled. Dropdown shares its base behavior with the other combobox-family inputs, so it exposes the same appearance variants (outline, underline, filled-darker, filled-lighter), the same size scale (small, medium, large), open-state controls (open, defaultOpen, onOpenChange), popup controls (positioning, inlinePopup, disableAutoFocus), clearable selection, and a full slot surface for the root, button, expandIcon, clearButton, and listbox elements. It supports single selection, multiselect with checkbox indicators, grouped and complex option content such as Persona rows, uncontrolled and controlled selection, and integration with Field for labels, hints, and validation messaging.

**When to use**: Use Dropdown when a person must pick one or more values from a known, reasonably short list and screen space is too limited to show every choice at once, or when the option rows need rich content such as avatars, presence badges, or secondary text. Choose Dropdown over Select when the option list benefits from custom rendering, grouping, multiselect, or a clearable value; choose Combobox when people need to type freely and filter rather than only pick. Use RadioGroup when there are only a handful of mutually exclusive choices and every choice can stay visible, and use Menu or MenuItem when the interaction triggers an action instead of capturing a form value. For many multiselect values that should stay visible as chips after selection, prefer TagPicker or TagGroup; for a single compact choice with no rich content, a native-feeling Select is lighter. Always pair Dropdown with a visible label, either through the Field wrapper or a Label bound to the same id, so the combobox has an accessible name.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `'filled-darker' \| 'filled-lighter' \| 'outline' \| 'underline'` | — | No | — |
| `button` | `NonNullable<Slot<'button'>>` | — | Yes | — |
| `children` | `React_2.ReactNode` | — | No | — |
| `clearButton` | `Slot<'button'>` | — | No | — |
| `clearable` | `boolean` | — | No | — |
| `defaultOpen` | `boolean` | — | No | — |
| `defaultValue` | `string` | — | No | — |
| `disableAutoFocus` | `boolean` | — | No | — |
| `disableAutoFocus` | `boolean` | — | No | — |
| `disabled` | `boolean` | — | No | — |
| `expandIcon` | `Slot<'span'>` | — | No | — |
| `freeform` | `boolean` | — | No | — |
| `inlinePopup` | `boolean` | — | No | — |
| `label` | `Slot<'span'>` | — | No | — |
| `listbox` | `Slot<typeof Listbox>` | — | No | — |
| `onOpenChange` | `(e: ComboboxBaseOpenEvents, data: ComboboxBaseOpenChangeData) => void` | — | No | — |
| `open` | `boolean` | — | No | — |
| `placeholder` | `string` | — | No | — |
| `positioning` | `PositioningShorthand` | — | No | — |
| `root` | `NonNullable<Slot<'div'>>` | — | Yes | — |
| `root` | `NonNullable<Slot<'div'>>` | — | Yes | — |
| `size` | `'small' \| 'medium' \| 'large'` | — | No | — |
| `value` | `string` | — | No | — |
| `value` | `string` | — | No | — |

### Prop Guidance

- **appearance**: Selects the visual style of the collapsed control. Use outline as the default on plain pages, underline inside dense or card-like surfaces, and filled-darker or filled-lighter when the control sits on a contrasting background and a full border would be noisy. `outline`
- **size**: Controls the vertical scale and typography of the control. Keep medium unless the Dropdown must align with a surrounding density, and match the size used by sibling inputs in the same form row. `medium`
- **placeholder**: Text shown on the button while no option is selected. Write it as an instruction or prompt rather than repeating the label, and keep it short so it does not truncate. `Select an animal`
- **value**: The controlled display text on the button. Pair it with onOptionSelect and update it from the returned optionText, and always provide it whenever you control selectedOptions so the button can render before options mount. `Elvia Atkins`
- **defaultValue**: The initial uncontrolled display text. Provide it together with defaultSelectedOptions so the pre-seeded selection is visible on first render. `Elvia Atkins`
- **open**: Controlled open state. Use it only when the surrounding flow genuinely owns expansion, and always handle onOpenChange to keep interactive closing and keyboard behavior intact. `false`
- **defaultOpen**: Uncontrolled initial expansion, useful for demos or when the Dropdown should start revealed. It has no effect once open is controlled. `false`
- **onOpenChange**: Notifies you when the listbox opens or closes and the trigger behind it. Use the event data to mirror open state in your own state and to coordinate with other popups or dialogs. `handleOpenChange`
- **clearable**: Renders a clear button that removes the current selection. Use it for optional filters and single-value picking; it is not supported in multiselect mode yet. `true`
- **multiselect**: Allows more than one selected option and renders checkbox indicators on options. Use it with OptionGroup labels and a clear summary strategy for the collapsed value. `true`
- **selectedOptions**: Controlled array of option values that are currently selected. Use it when selection is owned outside the component, and always pair it with value or defaultValue. `['eatkins']`
- **defaultSelectedOptions**: Uncontrolled initial selection by option value. Combine with defaultValue so the collapsed button reflects the pre-seeded selection immediately. `['eatkins']`
- **onOptionSelect**: Fires when a person selects or deselects an option, with the selected option values and the option text. Use the text to drive the controlled value so the button and the selection stay in sync. `handleOptionSelect`
- **onActiveOptionChange**: Notifies you when keyboard navigation changes the active option, for example to preview details elsewhere on the page. Use it for keyboard-driven changes and per-option mouse handlers for hover changes. `handleActiveOptionChange`
- **freeform**: Enables free-form text entry so a value does not have to come from the option list. Leave it off for strict selection-only fields so the value stays verifiable. `false`
- **positioning**: Fine-tunes how the listbox popup is placed relative to the trigger, including placement and alignment. Adjust it only when the default placement collides with surrounding chrome, such as a fixed footer. `below`
- **inlinePopup**: Renders the listbox inline in the DOM instead of in a portal. Use it when the Dropdown lives inside a container that clips or stacks above portaled content, and verify focus and clipping behavior afterwards. `false`
- **disableAutoFocus**: Prevents focus from being moved automatically when the listbox opens. Use it only in flows that justify keeping focus on the trigger, and confirm keyboard interaction still works as intended. `false`
- **disabled**: Disables the whole control so it cannot be opened or changed. Use it for unavailable choices, and prefer an explanatory message over leaving a disabled field unexplained. `true`
- **button**: The primary slot with role combobox, rendered as a button. Replace its children when you need truncation or a custom value layout, and keep the element itself a button so focus and semantics hold. `button`
- **listbox**: The popup listbox slot. Use className overrides here for height limits, scrolling, and overflow behavior, and keep the listbox role and option children intact. `listbox`
- **expandIcon**: The dropdown arrow. Restyle it for tight layouts, and keep it decorative so it is not announced as separate content. `expandIcon`
- **clearButton**: The clear affordance that appears when clearable is set. If you swap the icon, keep an accessible name on the button so it remains identifiable. `clearButton`
- **root**: The outer container element that wraps the button and the popup. Use it for layout classes such as flex sizing or field alignment rather than styling the button directly. `root`
- **label**: Optional label slot rendered as a span for the control. Prefer Field or a Label bound to the same id when you need full label, hint, and validation treatment. `label`
- **children**: The Option and OptionGroup children that populate the listbox. Keep them declarative, give complex options a text prop, and never nest interactive controls inside them. `Option children`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `button` | — | Yes | The primary slot, the element with role="combobox" |
| `clearButton` | — | No | The dropdown clear icon |
| `expandIcon` | — | No | The dropdown arrow icon |
| `listbox` | — | No | The dropdown listbox slot |
| `root` | — | Yes | The root dropdown slot |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Dropdown, makeStyles, Option, useId } from '@fluentui/react-components';
import type { DropdownProps } from '@fluentui/react-components';

export const Default = (props: Partial<DropdownProps>): JSXElement => {
  const dropdownId = useId('dropdown-default');
  const options = ['Cat', 'Caterpillar', 'Corgi', 'Chupacabra', 'Dog', 'Ferret', 'Fish', 'Fox', 'Hamster', 'Snake'];
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <label htmlFor={dropdownId}>Best pet</label>
      <Dropdown id={dropdownId} placeholder="Select an animal" {...props}>
        {options.map(option => (
          <Option key={option} disabled={option === 'Ferret'}>
            {option}
          </Option>
        ))}
      </Dropdown>
    </div>
  );
};
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Dropdown, makeStyles, Option, tokens, useId } from '@fluentui/react-components';
import type { DropdownProps } from '@fluentui/react-components';

export const Appearance = (props: Partial<DropdownProps>): JSXElement => {
  const dropdownId = useId('dropdown');
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div>
        <h3>Outline</h3>
        <label htmlFor={`${dropdownId}-outline`}>Select an animal</label>
        <Dropdown id={`${dropdownId}-outline`} placeholder="-" appearance="outline" {...props}>
          <Option>Cat</Option>
          <Option>Dog</Option>
          <Option>Bird</Option>
        </Dropdown>
      </div>

      <div>
        <h3>Underline</h3>
        <label htmlFor={`${dropdownId}-underline`}>Select an animal</label>
        <Dropdown id={`${dropdownId}-underline`} placeholder="-" appearance="underline" {...props}>
          <Option>Cat</Option>
          <Option>Dog</Option>
          <Option>Bird</Option>
        </Dropdown>
      </div>

      <div className={styles.filledDarker}>
        <h3>Filled Darker</h3>
        <label htmlFor={`${dropdownId}-filledDarker`}>Select an animal</label>
        <Dropdown id={`${dropdownId}-filledDarker`} placeholder="-" appearance="filled-darker" {...props}>
          <Option>Cat</Option>
          <Option>Dog</Option>
          <Option>Bird</Option>
        </Dropdown>
      </div>

      <div className={styles.filledLighter}>
        <h3>Filled Lighter</h3>
        <label htmlFor={`${dropdownId}-filledLighter`}>Select an animal</label>
        <Dropdown id={`${dropdownId}-filledLighter`} placeholder="-" appearance="filled-lighter" {...props}>
          <Option>Cat</Option>
          <Option>Dog</Option>
          <Option>Bird</Option>
        </Dropdown>
      </div>
    </div>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story:
        'A Dropdown can have the following `appearance` variants:\n' +
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
import { Dropdown, makeStyles, Option, useId, Persona } from '@fluentui/react-components';
import type { DropdownProps } from '@fluentui/react-components';

export const ActiveOptionChange = (props: Partial<DropdownProps>): JSXElement => {
  const dropdownId = useId('dropdown');
  const styles = useStyles();
  const [activeOptionText, setActiveOptionText] = React.useState('');

  const onActiveOptionChange = React.useCallback<NonNullable<DropdownProps['onActiveOptionChange']>>(
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
      <label htmlFor={dropdownId}>Schedule a meeting</label>
      <Dropdown id={dropdownId} onActiveOptionChange={onActiveOptionChange} {...props}>
        <Option text="Katri Athokas" onMouseEnter={onMouseEnter}>
          <Persona
            avatar={{ color: 'colorful', 'aria-hidden': true }}
            name="Katri Athokas"
            presence={{
              status: 'available',
            }}
            secondaryText="Available"
          />
        </Option>
        <Option text="Elvia Atkins" onMouseEnter={onMouseEnter}>
          <Persona
            avatar={{ color: 'colorful', 'aria-hidden': true }}
            name="Elvia Atkins"
            presence={{
              status: 'busy',
            }}
            secondaryText="Busy"
          />
        </Option>
        <Option text="Cameron Evans" onMouseEnter={onMouseEnter}>
          <Persona
            avatar={{ color: 'colorful', 'aria-hidden': true }}
            name="Cameron Evans"
            presence={{
              status: 'away',
            }}
            secondaryText="Away"
          />
        </Option>
        <Option text="Wanda Howard" onMouseEnter={onMouseEnter}>
          <Persona
            avatar={{ color: 'colorful', 'aria-hidden': true }}
            name="Wanda Howard"
            presence={{
              status: 'out-of-office',
            }}
            secondaryText="Out of office"
          />
        </Option>
      </Dropdown>
    </div>
  );
};

ActiveOptionChange.parameters = {
  docs: {
    description: {
      story:
        'OnActiveOptionChange notifies the user when the active option in the Dropdown was changed ' +
        'by keyboard. To react on mouse hover events, use onMouseEnter on the invididual options.',
    },
  },
};
```

## Best Practices

### Do's

- Always give the Dropdown an accessible name by wrapping it in Field with a label, or by associating a Label with the same id that you pass to the Dropdown.
- Provide a meaningful placeholder, such as Select an animal, so the empty state communicates what kind of value is expected rather than leaving the button blank.
- Set the text prop on every Option whose children are not a simple string, because that plain text becomes the Dropdown button's value and the accessible option text.
- Provide a value or defaultValue alongside selectedOptions or defaultSelectedOptions whenever selection is controlled or pre-seeded, so the button can render a value before the Option children are mounted.
- Use multiselect with OptionGroup labels when a single list naturally splits into categories, and keep group labels short and descriptive.
- Use the listbox slot to cap the height and enable scrolling for long option lists instead of letting the popup grow beyond the viewport.
- Keep option content non-interactive, and give custom option content a plain-text equivalent through the text prop so type-ahead still works.
- Prefer the declarative Option children model, and use the button, clearButton, and expandIcon slots only when you need to customize those specific regions.

### Don'ts

- Don't place buttons, links, checkboxes, or other focusable controls inside an Option; the listbox expects options, and nested interactive elements break keyboard navigation and the combobox semantics.
- Don't control selection with selectedOptions or value without also supplying onOptionSelect and a display value, or the Dropdown can drift out of sync with your state.
- Don't control the open state with the open prop without handling onOpenChange; the Dropdown will otherwise be unable to close itself in response to user interaction.
- Don't rely on clearable in multiselect mode, because clearing a multiselect value is not supported yet.
- Don't render very large option collections as unvirtualized children without measuring the cost; every Option in the list participates in rendering when the listbox is mounted.
- Don't put a long, unbreakable value on the button without a truncation strategy through the button slot, since overflow will visually clip awkwardly.
- Don't reach for Dropdown for two or three mutually exclusive choices that would be clearer as RadioGroup, or for an action trigger that belongs in a Menu.

## Anti-Patterns

### Controlling selection without a display value

❌ When selectedOptions or a default selection is supplied without a matching value or defaultValue, the Dropdown cannot display a value before the Option children render, so the button looks empty despite an active selection.

✅ Always mirror the selection with value or defaultValue, updating the value from the optionText returned by onOptionSelect so the button text tracks the selected option.

### Interactive content inside options

❌ Buttons, links, or other focusable controls nested inside an Option break the listbox interaction model, hijack keyboard navigation, and produce confusing screen reader output.

✅ Keep options to non-interactive content. If an option needs to trigger an action, use a Menu with MenuItem instead, or move the action outside the option row.

### Rich options without a text prop

❌ Options built from Persona or other nested markup that omit the text prop lose their plain-text representation, so the collapsed button value and type-ahead navigation become unreliable.

✅ Set the text prop to the plain-text equivalent of the option content on every option whose children are not a simple string.

### Controlled open state without open change handling

❌ Passing open without handling onOpenChange freezes the Dropdown: it can be opened programmatically but user interactions such as Escape or selecting an option can no longer close it, degrading keyboard accessibility.

✅ Handle onOpenChange and store the reported open state, so programmatic control and user-driven closing both work.

### Expecting clearable in multiselect mode

❌ The clear affordance is not supported when multiselect is enabled, so users get no way to reset a multi-value selection and the clear button slot renders inconsistently with expectations.

✅ For multiselect, provide an explicit reset path such as a separate button or a Filter-style control, and reserve clearable for single-selection Dropdowns.

### Replacing the button slot with a non-button element

❌ The button slot is the element with role combobox; substituting a div or other element for it removes the expected focus semantics and breaks the keyboard and screen reader contract.

✅ Keep the button slot as a button and customize only its children or its styles, for example to render a truncated value.

## Accessibility

**Requirements**: The Dropdown follows the ARIA combobox pattern, so the button slot carries role combobox and must have an accessible name from a visible label or an explicit aria-label. Maintain WCAG 2.1.1 Keyboard (everything reachable and operable by keyboard), 2.4.7 Focus Visible (the button, each option, and the clear button must show a visible focus indicator), 1.4.11 Non-text Contrast for the control boundary and focus ring, 1.3.1 Info and Relationships so grouped options keep their structure, 3.3.2 Labels or Instructions so the purpose of the field is clear, and 4.1.2 Name, Role, Value so expanded state and selected state are programmatically exposed. When validation is involved, surface the message through Field so it can be associated with the control rather than relying on color alone.

| Key | Action |
| --- | --- |
| `Enter` | Opens the listbox when it is closed and focus is on the Dropdown button; commits the active option and closes the listbox when it is open. |
| `Space` | Same as Enter: opens the listbox when closed, and selects the active option when open. |
| `ArrowDown` | Opens the listbox when closed, or moves the active option to the next option when open. |
| `ArrowUp` | Opens the listbox when closed, or moves the active option to the previous option when open. |
| `Alt+ArrowDown` | Opens the listbox without moving the active option, the conventional combobox shortcut for revealing the list. |
| `Home` | Moves the active option to the first option in the listbox. |
| `End` | Moves the active option to the last option in the listbox. |
| `Escape` | Closes the listbox without changing the current selection and returns focus to the Dropdown button. |
| `Tab` | Moves focus out of the Dropdown to the next focusable element, closing the listbox. |
| `Shift+Tab` | Moves focus to the previous focusable element, closing the listbox. |
| `Printable characters` | Type-ahead: jumps the active option to the next option whose text begins with the typed characters. |
| `Enter or Space on the clear button` | Activates the clearButton slot, when clearable is set, to remove the current selection. |

**ARIA**: role combobox, applied to the button slot, aria-expanded, reflecting whether the listbox is open, aria-controls, pointing at the listbox element, aria-activedescendant, pointing at the currently active option while the listbox is open, aria-labelledby, set from the associated label, aria-describedby, set from Field description, hint, or validation message, aria-invalid, applied when the field is in an error state, aria-required, applied when the associated field is marked required, aria-disabled, applied when the Dropdown is disabled, role listbox on the listbox slot, with role option on each Option, aria-selected on each Option to expose the current selection, aria-multiselectable on the listbox when multiselect is enabled, aria-label on the clearButton slot so the icon-only button has a name, aria-hidden on the decorative expandIcon

**Screen Reader**: Screen readers announce the Dropdown as a collapsed or expanded combobox with its accessible name from the associated label and its current value or placeholder as the value text, so the value must stay in sync with the visual button label. Opening the control is announced as an expanded listbox, and as arrow keys move the active option the screen reader reads the option text plus its group name, its position, and its selected state; in multiselect mode each option is announced with its selected or unselected state, and aria-multiselectable signals that more than one choice is allowed. Complex options built from Persona or other nested content are announced from the Option text prop, which is why that prop is required whenever children are not a plain string. The expand icon is decorative and is not announced, while the clear button is announced as a separate button named by its aria-label. When the listbox opens inside a portal, screen reader virtual cursors follow focus into the popup rather than reading it inline in the page flow.

## Styling

Dropdown styling is driven through Griffel classes applied with makeStyles and merged onto the component className and onto individual slots. Use the listbox slot to constrain the popup, for example by giving it a maxHeight, overflowY auto, tokens.colorNeutralBackground1, tokens.borderRadiusMedium, and a tokens.colorNeutralStroke1 border when the surface needs separation from the page. The button slot accepts custom children, which is the supported way to truncate a long value: apply overflow hidden, whiteSpace nowrap, and text-overflow ellipsis to that element and give the listbox a wider or wrapping layout so options stay readable. Option rows can be padded with tokens.spacingHorizontalMNudge and tokens.spacingVerticalS, and long option text can be allowed to wrap with overflowWrap anywhere. Focus treatment on the button normally uses tokens.colorStrokeFocus2 with tokens.borderRadiusMedium for the inner focus ring, and the underline appearance draws its border from tokens.colorNeutralStrokeAccessible with the brand-colored underline on focus. Size differences are handled by the size prop rather than manual padding; if you do override padding, stay on the spacing scale (tokens.spacingHorizontalS, tokens.spacingHorizontalM) so small, medium, and large stay visually consistent with other inputs.

## Performance

The listbox renders in a portal and is mounted on demand, so collapsed Dropdowns are cheap, but each open mounts all Option children at once; long lists should be capped with a scrolling listbox and, for very large datasets, filtered or virtualized before being passed as children. Avoid rebuilding option arrays on every render and prefer a stable module-level or memoized list so Option instances are not remounted and focus or active option state is not lost. onActiveOptionChange fires on every keyboard-driven active option change, so keep that callback lightweight and memoized, as shown by the useCallback pattern used to mirror active option text. onOptionSelect and onOpenChange update parent state, which re-renders the Dropdown and its options; when selection lives in a large parent tree, keep the state close to the Dropdown or memoize siblings to avoid broad re-renders. Inline popups avoid portal overhead but place the listbox in the normal document flow, which can trigger layout work inside scrolling or clipped containers. disableAutoFocus avoids the focus-transfer work on open but should not be used purely as a performance measure.

## Theming & Tokens

Dropdown consumes design tokens from the FluentProvider theme rather than fixed colors. The outline appearance draws its resting border from tokens.colorNeutralStroke1 and brightens to tokens.colorNeutralStroke1Hover and tokens.colorNeutralStroke1Pressed on interaction, while the underline appearance uses tokens.colorNeutralStrokeAccessible for the baseline. The filled-darker and filled-lighter appearances map to tokens.colorNeutralBackground3 and tokens.colorNeutralBackground1 respectively, with tokens.colorNeutralBackground1Hover for hover feedback. Button text uses tokens.colorNeutralForeground1, placeholder text uses tokens.colorNeutralForeground3, and disabled text uses tokens.colorNeutralForegroundDisabled with tokens.colorNeutralBackgroundDisabled as its surface. Selected options and the selection indicator generally use brand and compound tokens such as tokens.colorBrandForeground1 and tokens.colorCompoundBrandStroke. The focus ring uses tokens.colorStrokeFocus2, and popup surfaces use tokens.colorNeutralBackground1 with tokens.borderRadiusMedium and tokens.colorNeutralShadowAmbient for elevation. Typography follows tokens.fontFamilyBase, tokens.fontSizeBase300 for medium, with the size prop shifting to the small and large variants, and spacing follows tokens.spacingHorizontalM and tokens.spacingVerticalS inside the control and options.

## Migration Notes

From the previous major version, Dropdown was rewritten on top of the shared combobox base. The most visible change is the declarative children model: options are now Option components (optionally inside OptionGroup) rather than an items array with an onRenderItem style renderer, and selection is reported through onOptionSelect with selectedOptions and optionText in the event data instead of the older change handlers. Selection is expressed with selectedOptions and defaultSelectedOptions plus a matching value or defaultValue, and multiselect is enabled through the multiselect flag, whose options render checkbox indicators. The clearable prop and the clearButton slot replace the older ad-hoc clear affordance. Styling moved from the legacy styles and theme props to Griffel makeStyles and design tokens, and the component now exposes explicit slots for root, button, expandIcon, clearButton, and listbox, which replaces className and render-prop overrides for those regions. Popup behavior is now described by open, defaultOpen, onOpenChange, positioning, inlinePopup, and disableAutoFocus rather than the legacy callout props, and new capabilities such as the underline and filled-darker appearances, the size scale, and freeform entry have no direct predecessor.

## Edge Cases

- Clearing a selection is not supported in multiselect mode yet, so clearable and multiselect should not be combined.
- If selection is controlled or pre-seeded via defaultSelectedOptions, a corresponding value or defaultValue must also be defined; otherwise the Dropdown shows nothing until the Option children render.
- Options whose children are custom markup need the text prop, because that string becomes the collapsed button value and the type-ahead text.
- Option children must never be interactive elements such as buttons or links, since those break the listbox semantics and keyboard navigation.
- The button slot can be customized to render arbitrary child content, which is the supported route for truncating long values, but replacing the button element itself breaks the combobox role.
- Controlling the state of the open property yourself requires extra care so that interactions stay appropriate and keyboard accessibility does not degrade.
- disableAutoFocus changes where focus lands when the listbox opens, so any logic that assumes focus moved into the popup must be revisited.
- Listbox height and overflow are not constrained by default for very long option lists, so a custom class on the listbox slot is usually needed to keep the popup within the viewport.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
