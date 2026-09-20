# TagPicker

> **Package**: `@fluentui/react-tag-picker` v9.8.8
> **Import**: `import { TagPicker } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

TagPicker is a composite form control that lets users select one or more values from a list and displays the current selection as dismissible Tag elements inside a field. It is built from cooperating sub-components: TagPickerControl is the visual field, TagPickerGroup holds the selected Tags, TagPickerInput provides a type-ahead text entry (or TagPickerButton for a pure dropdown-style trigger), and TagPickerList contains the TagPickerOption items that can be picked. The root TagPicker component itself is a thin state coordinator: it accepts a controlled selectedOptions array, forwards selection through onOptionSelect, and manages the popover that reveals the option list. Because it reuses the combobox interaction model, it supports filtering through the useTagPickerFilter hook, grouped options via TagPickerOptionGroup, single-select by limiting selectedOptions to zero or one entry, and a popover-free mode through noPopover for free-form tag entry. The component is fully theme-aware and renders the popover in a portal on document.body by default.

**When to use**: Use TagPicker when a user needs to choose multiple discrete values from a known set and the chosen values should remain visible and individually removable — for example assigning people to a document, applying labels, or tagging records with categories. Choose it over Dropdown when multi-selection must be visible inline, over Combobox when the selection is a set of tags rather than a single value, and over TagGroup when users should be able to add values from a list rather than only remove them. Use TagPickerInput when users benefit from typing to filter; use TagPickerButton instead when you want a Dropdown-like control with no text entry. Use noPopover when the values are open-ended user input that is not present in any list. If selection is limited to a single value, a Select or Dropdown is usually simpler, although TagPicker can be constrained to single-select when the tag presentation is desired.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `JSXElement \| [JSXElement, false \| JSXElement \| undefined]` | — | Yes | Can contain two children including a trigger and a popover |
| `inline` | `boolean \| undefined` | `false` | No | TagPickers are rendered out of DOM order on `document.body` by default, use this to render the popover in DOM order |
| `noPopover` | `boolean \| undefined` | `false` | No | By default, when a single children is provided, the TagPicker will assume that the children is a popover. By setting this prop to true, the children will be treated as a trigger instead. |
| `onOpenChange` | `EventHandler<TagPickerOnOpenChangeData> \| undefined` | — | No | — |
| `onOptionSelect` | `EventHandler<TagPickerOnOptionSelectData> \| undefined` | — | No | — |

### Prop Guidance

- **children**: Required. Normally two children: the trigger/control (TagPickerControl containing the group and input or button) and the popover (TagPickerList of TagPickerOptions). When only one child is supplied it is treated as the popover unless noPopover is true, in which case that single child is treated as the trigger. `TagPickerControl with TagPickerGroup and TagPickerInput as the first child, TagPickerList as the second`
- **onOptionSelect**: The primary selection handler. It receives the event and a data object whose selectedOptions array is the new full selection, so the usual pattern is to assign data.selectedOptions straight into your state. Guard against placeholder entries (for example a sentinel value of "no-options") before storing, and reset any filter query after a pick. `(event, data) => setSelectedOptions(data.selectedOptions)`
- **onOpenChange**: Fires when the popover would open or close and exposes data.open. Use it to keep a controlled open state in sync, especially when the open state also drives focus styling, overflow measurement, or the chevron direction. `(event, data) => setOpen(data.open)`
- **noPopover**: Defaults to false. Set it to true when the picker should not open an option list at all, which is the pattern for free-form tag entry: control TagPickerInput's value and add a tag from onKeyDown when the user presses Enter. With noPopover you supply only the control child. `true`
- **inline**: Defaults to false, meaning the popover is rendered out of DOM order on document.body. Set it to true to render the option list in DOM order when the picker sits inside a Dialog, Drawer, or any scroll or overflow-clipped container where a portal would detach the list or misposition it. `true`
- **selectedOptions**: Exposed through the TagPicker props used in every example: the controlled array of string values that represents the current selection. Pass the same values you render as Tags and filter against when building TagPickerList children so state stays single-sourced. `['Katri Athokas']`
- **open**: Controlled popover visibility, used together with onOpenChange. Supply it when the picker must open or close in response to external events such as focus within the control or a click on an overflow tag. `open={open}`
- **disabled**: Renders the control as disabled and blocks access to TagPickerList. It does not freeze selectedOptions, so programmatic changes still render; disable individual Tag elements when specific values should remain unreachable. `disabled`
- **disableAutoFocus**: Controls whether the first option receives automatic focus/active-descendant when the popover opens. Derive it from whether the user has typed a query: disable auto focus when opened by keyboard with no query, enable it once a query exists so the best match is highlighted. `disableAutoFocus={query.length === 0}`
- **appearance**: Applied to the control to match Combobox appearances: outline (default, four-sided border), underline (bottom border only), filled-darker (no border, subtle background for white pages), and filled-lighter (no border, white background). Pick the variant that matches the surrounding form or command surface. `filled-darker`
- **size**: Sets the control's scale — medium (default), large, or extra-large. Scale the tags and the input together for a visually consistent row. `large`

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement, TagPickerProps } from '@fluentui/react-components';
import { Tag, Avatar, Field } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
  const onOptionSelect: TagPickerProps['onOptionSelect'] = (e, data) => {
    if (data.value === 'no-options') {
      return;
    }
    setSelectedOptions(data.selectedOptions);
  };
  const tagPickerOptions = options.filter(option => !selectedOptions.includes(option));

  return (
    <Field label="Select Employees" style={{ maxWidth: 400 }}>
      <TagPicker onOptionSelect={onOptionSelect} selectedOptions={selectedOptions}>
        <TagPickerControl>
          <TagPickerGroup aria-label="Selected Employees">
            {selectedOptions.map(option => (
              <Tag
                key={option}
                shape="rounded"
                media={<Avatar aria-hidden name={option} color="colorful" />}
                value={option}
              >
                {option}
              </Tag>
            ))}
          </TagPickerGroup>
          <TagPickerInput aria-label="Select Employees" />
        </TagPickerControl>
        <TagPickerList>
          {tagPickerOptions.length > 0 ? (
            tagPickerOptions.map(option => (
              <TagPickerOption
                media={<Avatar shape="square" aria-hidden name={option} color="colorful" />}
                value={option}
                key={option}
              >
                {option}
              </TagPickerOption>
            ))
          ) : (
            <TagPickerOption value="no-options">No options available</TagPickerOption>
          )}
        </TagPickerList>
      </TagPicker>
    </Field>
  );
};
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement, TagPickerProps } from '@fluentui/react-components';
import { Tag, Avatar, tokens, makeStyles, Field } from '@fluentui/react-components';

export const Appearance = (): JSXElement => {
  const styles = useStyles();
  return (
    <>
      <div>
        <h1>Outline</h1>
        <Example appearance="outline" />
      </div>
      <div>
        <h1>Underline</h1>
        <Example appearance="underline" />
      </div>
      <div className={styles.darkBG}>
        <h1>Filled Darker</h1>
        <Example appearance="filled-darker" />
      </div>
      <div className={styles.darkBG}>
        <h1>Filled Lighter</h1>
        <Example appearance="filled-lighter" />
      </div>
    </>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story: `
A \`TagPicker\` can have the following appearance variants:

* \`outline\` (default): has a border around all four sides.
* \`underline\`: only has a bottom border.
* \`filled-darker\`: no border, only a subtle background color difference against a white page. All tags will be by default \`outline\`.
* \`filled-lighter\`: no border, and a white background.

This is equivalent to the [\`Combobox\`](https://react.fluentui.dev/?path=/docs/components-combobox--default#appearance) \`appearance\` property.
      `,
    },
  },
};
```

### Button

```tsx
import * as React from 'react';
import type { JSXElement, TagPickerProps } from '@fluentui/react-components';
import { Tag, Avatar, Field } from '@fluentui/react-components';

export const Button = (): JSXElement => {
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
  const onOptionSelect: TagPickerProps['onOptionSelect'] = (e, data) => {
    if (data.value === 'no-options') {
      return;
    }
    setSelectedOptions(data.selectedOptions);
  };
  const tagPickerOptions = options.filter(option => !selectedOptions.includes(option));

  return (
    <Field label="Select Employees" style={{ maxWidth: 400 }}>
      <TagPicker onOptionSelect={onOptionSelect} selectedOptions={selectedOptions}>
        <TagPickerControl>
          <TagPickerGroup aria-label="Selected Employees">
            {selectedOptions.map(option => (
              <Tag
                key={option}
                shape="rounded"
                media={<Avatar aria-hidden name={option} color="colorful" />}
                value={option}
              >
                {option}
              </Tag>
            ))}
          </TagPickerGroup>
          <TagPickerButton aria-label="Select Employees" />
        </TagPickerControl>

        <TagPickerList>
          {tagPickerOptions.length > 0 ? (
            tagPickerOptions.map(option => (
              <TagPickerOption
                secondaryContent="Microsoft FTE"
                media={<Avatar shape="square" aria-hidden name={option} color="colorful" />}
                value={option}
                key={option}
              >
                {option}
              </TagPickerOption>
            ))
          ) : (
            <TagPickerOption value="no-options">No options available</TagPickerOption>
          )}
        </TagPickerList>
      </TagPicker>
    </Field>
  );
};

Button.parameters = {
  docs: {
    description: {
      story: `
The component \`TagPickerButton\` renders an "invisible" button that can be used instead of \`TagPickerInput\` to opt-out of a text field and to provide something similar to a [\`Dropdown\`](https://react.fluentui.dev/?path=/docs/components-dropdown--default) behavior.
      `,
    },
  },
};
```

## Best Practices

### Do's

- Always give the control an accessible name: wrap it in a Field with a label, or supply aria-label on TagPickerInput or TagPickerButton, and give TagPickerGroup its own aria-label describing the selected items.
- Keep the selection in your own state as an array of string values, pass it to selectedOptions, and derive both the Tag children and the TagPickerOption children from that same array so the visible tags and the option list can never disagree.
- Filter already-selected values out of TagPickerList, and when nothing remains render a single non-selectable placeholder such as a TagPickerOption with a sentinel value, then return early from onOptionSelect for that sentinel so it never becomes a tag.
- Use the useTagPickerFilter hook for type-ahead filtering, and derive disableAutoFocus from whether a query exists so opening by keyboard does not jump focus to the first option while typing still highlights a match.
- Choose TagPickerInput when filtering by typing is valuable and TagPickerButton when the picker should behave like a dropdown, since both live inside TagPickerControl and share the same option list.
- Reach for noPopover when users must enter values that do not exist in any list, and control the TagPickerInput value with onKeyDown so the Enter key commits the typed text as a tag.
- Pass inline when the picker lives inside a Dialog, Drawer, or overflow-clipped container so the option list is rendered in DOM order instead of being portaled to document.body.
- Control the popover with open and onOpenChange whenever the open state has to be coordinated with focus handling, an overflow row, or another piece of page state.

### Don'ts

- Don't render list children as raw DOM elements or arbitrary components; only TagPickerOption values are recognized by onOptionSelect, and other children cannot be selected or keyboard-navigated.
- Don't use the empty-state sentinel value as a real selection — without an early return in onOptionSelect it will be appended to selectedOptions and appear as a tag.
- Don't pass a single child expecting it to be treated as a trigger: with one child the TagPicker assumes that child is the popover unless noPopover is set.
- Don't set open without also handling onOpenChange, because the popover will then be permanently stuck in the state you supply and users cannot close it from the keyboard.
- Don't assume the disabled prop clears or protects the selection — it blocks access to TagPickerList but programmatic changes to selectedOptions still render, and individual Tags can be disabled separately if they must be unreachable.
- Don't expect the component to truncate long tag labels out of the box; ellipsis behavior has to be applied through the Tag primaryText slot and option content styling, together with a title for the full value.
- Don't reuse the same value string for two different options or tags, since option identity and React keys are derived from the value.
- Don't hand-position the popover or wrap it in an extra positioning container; rely on the built-in popover and the inline prop instead.

## Anti-Patterns

### Deriving tags from a separate source than selectedOptions

❌ Rendering Tag children from one piece of state while passing selectedOptions from another lets the visible tags and the option list drift apart; options appear selected when no tag is shown, or tags linger after being deselected.

✅ Keep one array of value strings as the source of truth: map it into Tag elements inside TagPickerGroup and pass it to selectedOptions, and use it again to filter values out of TagPickerList.

### Making the empty-state option selectable

❌ When every option has been chosen, the list is empty and a placeholder such as "No options available" is often rendered as a TagPickerOption. If onOptionSelect stores every reported selection, that placeholder value becomes a real tag.

✅ Give the placeholder a sentinel value and return early from onOptionSelect when data.value matches it, exactly as the examples do before assigning data.selectedOptions into state.

### Forgetting to filter out already-selected values

❌ Leaving selected values in the option list produces duplicate tags, confusing aria-selected states, and an option the user can pick again with no visible effect.

✅ Compute the option children by excluding values already present in selectedOptions, and combine that filter with the query filter inside useTagPickerFilter when type-ahead is enabled.

### Unlabeled picker

❌ A TagPicker rendered without a Field label and without aria-label on TagPickerInput or TagPickerButton is announced as an unnamed edit field, so screen reader users cannot tell what they are selecting.

✅ Wrap the picker in Field with a visible label, and add a matching aria-label to the group describing the selected items so both the field and the tag region are named.

### Fully controlled popover without a change handler

❌ Passing open without onOpenChange pins the popover to whatever value you supply; Escape and outside clicks can no longer close it, and the control appears broken.

✅ Either leave the popover uncontrolled, or pass open and onOpenChange together and store data.open in state, as shown in the controlled single-line example.

### Portaling the option list into a surface

❌ Because the popover renders on document.body by default, it can detach from scroll containers and clip inside Drawers, Dialogs, or overflow-hidden layouts, leaving the list floating in the wrong place.

✅ Set inline so the TagPickerList renders in DOM order within the containing surface, and keep the picker inside the same scrollable region as its options.

## Accessibility

**Requirements**: The picker must always expose an accessible name: pair it with Field's label, or set aria-label on TagPickerInput or TagPickerButton, and give TagPickerGroup a descriptive aria-label such as "Selected Employees". The list of choices must remain reachable and understandable without a mouse: opening, highlighting, selecting, and dismissing tags all need keyboard equivalents, and focus must return to the input or trigger when the popover closes. Text and the focus indicator must meet WCAG 2.1 AA contrast (4.5:1 for body text, 3:1 for the focus ring and non-text boundaries) in every appearance variant, including filled-darker on a dark surface. Any tag that can be removed must be reachable and removable by keyboard, and error or validation messaging coming from Field must be programmatically associated. Auto-focus behavior must be deliberate — disableAutoFocus exists so the popover does not steal focus to the first option when it was opened by keyboard.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the control (the TagPickerInput or TagPickerButton inside TagPickerControl) and then on to the next focusable element, closing the option list when focus leaves. |
| `Shift + Tab` | Moves focus backwards out of the control and closes the TagPickerList popover when focus leaves the picker entirely. |
| `ArrowDown` | Opens the TagPickerList when it is closed and moves the active option highlight to the next TagPickerOption. |
| `ArrowUp` | Moves the active option highlight to the previous TagPickerOption; from the first option it returns the highlight to the input. |
| `ArrowLeft / ArrowRight` | Moves focus between the selected Tags inside TagPickerGroup and the input when the popover is closed. |
| `Enter` | Selects the currently highlighted TagPickerOption, or, in noPopover mode, commits the typed text as a new tag. |
| `Space` | Activates the highlighted option or the focused TagPickerButton trigger. |
| `Escape` | Closes the TagPickerList without changing the selection and returns focus to the input or trigger. |
| `Backspace` | When the input is empty, removes the last selected tag from TagPickerGroup. |
| `Delete` | Removes the focused tag when the tag itself is the dismissible focus target. |
| `Home` | Moves the active option highlight to the first option in TagPickerList. |
| `End` | Moves the active option highlight to the last option in TagPickerList. |
| `Printable characters` | Typed into TagPickerInput, they drive the filter supplied to useTagPickerFilter and can open the list once a query exists. |

**ARIA**: aria-label — required on TagPickerInput or TagPickerButton when no visible label is associated, aria-label on TagPickerGroup — names the region that contains the selected tags, aria-labelledby — associates the picker with an external Label or Field label, aria-describedby — associates helper or error text rendered by Field, aria-expanded — reflects whether the TagPickerList popover is open, aria-controls — points at the element containing the option list, aria-activedescendant — identifies the visually highlighted TagPickerOption while focus stays in the input, aria-selected — communicates selection state on TagPickerOption, aria-disabled — set on the input and trigger when the picker is disabled, role="group" on TagPickerGroup and role="listbox"/"option" on TagPickerList and TagPickerOption

**Screen Reader**: Screen readers announce the picker as a labeled combobox-style field; the accessible name comes from the associated label, aria-labelledby, or aria-label, and aria-expanded communicates whether the option list is showing. As the user arrows through options, aria-activedescendant moves the announcement to the active TagPickerOption without pulling DOM focus out of the input, and the option's text, secondaryContent, and media alternative text are read together. Selecting an option adds a Tag inside the group, which is announced as part of the named group so the running count of selected values is perceivable. The placeholder-style option used for the empty state is announced as an ordinary option, which is why it must carry a clear message such as "No options available". When the picker is disabled, the input and trigger expose aria-disabled instead of disappearing, so users still know the field exists, and tags that remain focusable continue to announce their dismiss affordance.

## Styling

Most visual changes are made on the sub-components rather than on TagPicker itself, since the root only orchestrates state and popover behavior. TagPickerControl accepts a className plus slot objects for expandIcon and secondaryAction, so you can restyle the chevron by passing an object with className and children (the SingleLine example swaps chevrons and recolors the icon on focus) and place a transparent Button in the top-right corner as a secondaryAction. TagPickerInput has its own root, contentBefore, and contentAfter slots for prefixes, icons, and loading indicators. Use tokens.colorNeutralStroke1 for the resting outline border, tokens.colorNeutralStrokeAccessibleHover for hover, tokens.colorCompoundBrandStroke for the brand underline in the underline appearance, tokens.colorNeutralBackground1 and tokens.colorNeutralBackground4 for filled-lighter and filled-darker, tokens.borderRadiusMedium on the control, and tokens.spacingHorizontalXS / tokens.spacingHorizontalS to tune the gap between tags and the input. For focus styling, animate the border with tokens.colorStrokeFocus2 and apply a 1px-2px outline offset so the ring stays visible against busy backgrounds. Sizing typically means adjusting control height, tokens.fontSizeBase300, tokens.lineHeightBase300, and the Tag size together, and custom tag truncation is achieved through the Tag primaryText class plus a title attribute rather than through TagPicker itself.

## Performance

The root TagPicker is cheap; the cost is in the option list. Keep TagPickerList children proportional to what the user can actually see by filtering with useTagPickerFilter rather than rendering hundreds of TagPickerOption nodes and hiding them, and memoize the option array so unrelated parent renders do not rebuild the whole list. Avoid computing the children inline with an unstable filter or render function that recreates element identities on every keystroke, since each keystroke re-renders the input, the group, and the popover simultaneously. The default popover is portaled to document.body, which means every open causes a mount and layout pass outside the form's subtree; use inline when the picker is already inside a scrolling or transforming container to avoid repositioning work on scroll. Overflow-based single-line layouts measure the control and therefore re-render on resize and selection changes, so keep the selectedOptions array stable and avoid recreating the measurement wrapper. Memoize the media elements inside TagPickerOption (such as Avatar) so list scrolling does not rebuild them.

## Theming & Tokens

TagPicker inherits all of its color from the Fluent theme provided by FluentProvider, so switching between light, dark, and high-contrast themes requires no prop changes. The appearance variants map onto semantic surface tokens: outline uses tokens.colorNeutralBackground1 with tokens.colorNeutralStroke1, filled-darker uses tokens.colorNeutralBackground4 (originally grouped under tokens.colorNeutralBackground3) with a transparent stroke, filled-lighter uses tokens.colorNeutralBackground1 with tokens.colorTransparentStroke, and underline drops the box border in favor of tokens.colorCompoundBrandStroke at the bottom edge. Text inside the input and the tags uses tokens.colorNeutralForeground1, placeholders use tokens.colorNeutralForeground3, and disabled states resolve to tokens.colorNeutralForegroundDisabled, tokens.colorNeutralBackgroundDisabled, and tokens.colorNeutralStrokeDisabled. Focus rings use tokens.colorStrokeFocus2 over tokens.colorStrokeFocus1, popover elevation uses tokens.shadow16 plus tokens.colorNeutralShadowAmbient and tokens.colorNeutralShadowKey, spacing comes from tokens.spacingHorizontalXS through tokens.spacingHorizontalL, and the expand icon rotation can be timed with tokens.durationNormal and tokens.curveAccelerateMid. Because every value is a token, brand ramps and density overrides applied at the provider level flow through automatically.

## Migration Notes

TagPicker is specific to Fluent UI React v9 and has no direct v8 equivalent — the older people-picker and Picker patterns were monolithic components with a required items API. In v9 the behavior is composed: you render TagPickerControl with TagPickerGroup plus TagPickerInput or TagPickerButton, and supply TagPickerList children yourself, which means selection state, filtering, and empty-state handling are your responsibility rather than baked into the component. Teams migrating should move from a single props-driven picker to controlled selectedOptions state, replace internal filtering with the useTagPickerFilter hook, and translate any custom option rendering into TagPickerOption with its media, secondaryContent, and text slots. Popover behavior previously implied by the old component is now explicit through the children contract, noPopover, and inline.

## Edge Cases

- The children contract is positional: two children mean trigger plus popover, but a single child is assumed to be the popover. Set noPopover to true to make that single child the trigger instead — this is the required shape for free-form tag entry.
- Because the popover renders on document.body by default, it can be clipped or mispositioned inside Drawer, Dialog, or overflow-hidden containers; switch to inline to render the list in DOM order.
- When the last selectable option has been chosen, the list renders empty; supply a placeholder TagPickerOption with a sentinel value and ignore that value in onOptionSelect.
- The disabled prop only closes off access to TagPickerList — selectedOptions can still be changed programmatically, and individual Tag elements can be disabled independently when a specific value must remain unreachable.
- With useTagPickerFilter, opening the popover by keyboard while a query is empty moves focus to the first option unless disableAutoFocus is set, so derive it from the query length.
- Single-select behavior is not a prop: it is achieved by storing at most one value in selectedOptions and letting onOptionSelect toggle it off when data.value matches the current selection.
- Text truncation is not built in; long tag labels need explicit ellipsis styling on the Tag primaryText slot and on option content, plus a title on the Tag and TagPickerOption so the full value remains discoverable.
- Duplicate or reused option values break React keys and selection identity; keep every value string unique across the list and across selected tags.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
