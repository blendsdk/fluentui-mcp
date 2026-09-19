# TagPicker

> **Package**: `@fluentui/react-tag-picker` v9.8.8
> **Import**: `import { TagPicker } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

TagPicker is a composed Fluent UI React v9 form control that lets people select one or more values from a set of options and see those values represented as removable Tags inside an input field. The root TagPicker is intentionally minimal: it coordinates selection state and popover open state, while the visual structure is assembled from the companion parts TagPickerControl, TagPickerGroup, TagPickerInput, TagPickerButton, TagPickerList, TagPickerOption and TagPickerOptionGroup. In its default shape, TagPickerControl wraps a TagPickerGroup (the selected Tag elements) plus either a TagPickerInput (free-text, combobox-like behavior) or a TagPickerButton (an invisible button that behaves more like a Dropdown), and TagPickerList renders the selectable TagPickerOption entries inside a popover. Because selection is controlled through the selectedOptions array and reported through onOptionSelect, the component covers a wide range of patterns: multi-select with filtering, single-select, grouped options, self-authored tags with the noPopover mode, inline list expansion, size and appearance variants, and slot customization such as expandIcon and secondaryAction. The package also ships the useTagPickerFilter hook for query-based option filtering and TagPickerInputProps / TagPickerProps types for typing handlers.

**When to use**: Use TagPicker when the user is choosing from many options and the chosen values must remain individually visible and removable — for example assigning people, applying labels, or choosing categories/topics. It is the right choice when selection cardinality is high or unbounded and a compact, tokenized summary is more scannable than a comma-separated list rendered by a Combobox or Select. Use it over plain Combobox when each selection needs its own affordance (its own Tag with media, dismiss behavior, and per-item disabled state) or when users must be able to enter values that are not in the list, which is done with the noPopover variant and a controlled TagPickerInput. Use it over Dropdown when the selected items must be shown as chips inside the field rather than as lines in a menu. Use it over Checkbox or Checkbox-style lists when the option set is large and a searchable popover is preferable. Choose TagPickerButton instead of TagPickerInput only when free-text entry and filtering are not desired and you want simple pick-from-list behavior. Choose SingleSelect behavior (by keeping selectedOptions to at most one entry) when users may select exactly one value — but if single selection is truly the requirement, evaluate whether a Select or Dropdown is the simpler control.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `any` | — | Yes | Can contain two children including a trigger and a popover |
| `inline` | `boolean \| undefined` | `false` | No | TagPickers are rendered out of DOM order on `document.body` by default, use this to render the popover in DOM order |
| `noPopover` | `boolean \| undefined` | `false` | No | By default, when a single children is provided, the TagPicker will assume that the children is a popover. By setting this prop to true, the children will be treated as a trigger instead. |
| `onOpenChange` | `any` | — | No | — |
| `onOptionSelect` | `any` | — | No | — |

### Prop Guidance

- **children**: Required. With a popover, pass exactly the parts that make up the field followed by the popover: a TagPickerControl containing a TagPickerGroup and either a TagPickerInput or TagPickerButton, then a TagPickerList of TagPickerOption (optionally inside TagPickerOptionGroup) entries. When noPopover is true, the single child is treated as the trigger rather than as a popover. `TagPickerControl + TagPickerList (or a single control when noPopover is set)`
- **noPopover**: Set to true when you do not want the built-in option list and instead want the picker to behave as an authoring field: the single child becomes the trigger, and you control the TagPickerInput value and add tags yourself (for example when Enter is pressed). Defaults to false, where a single child is assumed to be the popover. `true`
- **onOptionSelect**: The primary selection callback. It receives the event and a data object whose selectedOptions array is the new complete selection and whose value identifies the option that was acted on; assign that array to your state. Always short-circuit on your placeholder sentinel value (such as "no-options" or "no-matches") so users cannot select the empty-state row. `handleOptionSelect`
- **onOpenChange**: Use with the controlled open prop when you need to know or drive whether the TagPickerList is showing — for example to change an expand icon, to suppress the tag-overflow counter while the list is open, or to coordinate with filtering. The callback receives the event and a data object containing the new open state. `handleOpenChange`
- **inline**: By default the popover is rendered out of DOM order on document.body. Set inline to true to render it in DOM order within the surrounding markup, which is useful when the picker sits inside a layout or scroll container where portal placement interferes with stacking, clipping or tab order. `true`
- **selectedOptions**: Although not listed on the root prop table, this is the array of option values that the picker treats as selected and is required for meaningful behavior in every shipped example. Keep it in state, derive it only from onOptionSelect, and filter your option list against it so already-selected values are not offered twice. Limiting this array to a single entry is how the single-select pattern is expressed. `["Ali", "Bob"]`
- **open**: Controlled counterpart to onOpenChange. Provide it when the open state must be known to your own rendering — the SingleLine pattern uses it to swap a chevron-up icon for a chevron-down icon and to hide the overflow count tag while the list is open. `false`
- **disabled**: Disables access to TagPickerList and blocks interaction with the control, while still allowing your code to modify selectedOptions. Apply it on the root for a fully inert picker and on an individual Tag when only that value should be unreachable. `true`
- **disableAutoFocus**: Controls whether the first option receives focus when the popover opens. Disable it when the list is opened by keyboard with no query so focus does not jump to the first option, and enable it (by leaving it false) once the user has typed so the first matching option is highlighted. `true`
- **appearance**: Set on TagPickerControl to choose the visual treatment: outline (default, border on all four sides), underline (bottom border only), filled-darker (no border, subtle background against a light page) or filled-lighter (no border, white background). It is equivalent to the Combobox appearance property, so keep it consistent with adjacent form controls. `filled-darker`
- **size**: Set on the control to change the overall scale of the picker. medium is the default, with large and extra-large available; sizes scale the field, its tags and its typography together, so choose a size instead of patching padding and font size separately. `large`
- **expandIcon**: A TagPickerControl slot for the chevron shown at the end of the field. Pass a custom icon element to replace the default, an object with children and/or className when you want to style it conditionally (for example tinting it on focus), or null to remove the chevron entirely. `custom arrow-down icon element`
- **secondaryAction**: A TagPickerControl slot for one extra control, typically a small transparent Button such as an "All Clear" affordance. It is absolutely positioned in the top-right corner together with the expand icon, so keep it small and make sure nothing overlaps it. `small transparent Button labelled "All Clear"`

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

- Always pass selectedOptions alongside onOptionSelect so the control is fully controlled and the Tag list always reflects the source of truth.
- Give both the TagPickerGroup and the input or button an aria-label, as the examples do, so the selected chip list and the trigger are announced separately from any external Field label.
- Ignore the placeholder option by checking the sentinel value inside onOptionSelect — the shipped examples use values such as "no-options" or "no-matches" and return early for them.
- Wrap the control in a Field when it needs a visible label, validation message, or hint text that is associated with the whole picker.
- Use useTagPickerFilter to drive query-based filtering and provide a renderOption callback so filtered and unfiltered entries render identically.
- Toggle disableAutoFocus together with query state so the popover does not steal focus on the first option when opened without typing, but does highlight the first match once a query exists.
- Use TagPickerOptionGroup with labels such as "Managers" and "Devs" when the option list has meaningful categories, rather than prefixing each option label.
- Reach for the noPopover prop plus a controlled TagPickerInput and an Enter key handler when users should be able to author tags that are not in the option list.
- Prefer the TagPickerControl slots expandIcon and secondaryAction for chevrons and clearing affordances instead of styling nested inputs or absolutely positioning your own elements.
- Combine with Overflow and OverflowItem when selected tags must stay on one line, and account for the input width and paddings when computing the available padding.

### Don'ts

- Don't mutate the selectedOptions array yourself; derive it from onOptionSelect's data so selection changes, tag dismissal, and filtering stay consistent.
- Don't render arbitrary children directly inside TagPickerControl — the expected structure is a TagPickerGroup plus a TagPickerInput or TagPickerButton, with TagPickerList alongside it.
- Don't set noPopover and then also render a TagPickerList with options; without a popover those options would never be reachable.
- Don't rely on the picker to manage tags silently — a Tag's value must be included in selectedOptions for it to survive a re-render.
- Don't use visible text as the only identifier for the trigger; an icon-only TagPickerButton or a borderless input still needs an aria-label.
- Don't expect long tag text to be truncated automatically; the component deliberately leaves truncation to the consumer's own styles and title attributes.
- Don't put interactive, focusable content inside a TagPickerOption (other than the option itself) — it competes with option selection and with keyboard navigation through the list.
- Don't leave the popover in its default out-of-DOM-order placement when the surrounding layout depends on stacking context or DOM order; use inline in those cases instead of fighting it with z-index.
- Don't assume disabling the TagPicker prevents programmatic changes to selectedOptions — disabled only blocks access to TagPickerList and interaction, so guard your own state updates.
- Don't hard-code pixel sizes for tags across all variants; appearance and size already change metrics, so prefer token-based spacing.

## Anti-Patterns

### Treating the empty-state row as a real option

❌ The no-results placeholder is a normal TagPickerOption with a sentinel value, so it is selectable and focusable just like real options; if onOptionSelect assigns data.selectedOptions unconditionally, an option literally named "no-options" ends up in the selection.

✅ Guard the handler by returning early when data.value matches the placeholder sentinel, exactly as the shipped examples do for values such as "no-options" and "no-matches".

### Uncontrolled or self-managed selection

❌ Rendering Tags from local state that onOptionSelect never updates leads to tags that cannot be dismissed, selections that reappear after filtering, and a control whose visible chips disagree with the data model.

✅ Keep selectedOptions in state, derive it only from onOptionSelect, and filter the option list against it so selected values are removed from the menu and re-added consistently.

### Using noPopover together with a TagPickerList

❌ Setting noPopover tells the picker to treat its single child as a trigger, so an accompanying option list is never opened and becomes unreachable dead markup in the tree.

✅ Choose one model: keep the default popover and render a TagPickerList of TagPickerOptions, or use noPopover with a controlled TagPickerInput and an Enter key handler that commits the typed value as a tag.

### Borderless control paired with a low-contrast appearance variant

❌ filled-lighter and filled-darker remove the border, so on a background that matches the fill the control's click target and focus affordance effectively disappear, which hurts keyboard and low-vision users.

✅ Use outline or underline in dense or neutral layouts, reserve the filled variants for surfaces with deliberate contrast, and verify the focus ring and text contrast against Griffel tokens such as tokens.colorNeutralStrokeAccessible and tokens.colorNeutralForeground1.

### Unlabelled trigger

❌ An icon-only TagPickerButton or a borderless TagPickerInput has no visible text, so screen reader users hear only "button" or "edit text" with no indication of what is being selected.

✅ Supply aria-label on the trigger and a distinct aria-label on the TagPickerGroup, as the examples do with "Select Employees" and "Selected Employees", and mark decorative avatars aria-hidden.

### Letting many long tags grow the field without a plan

❌ TagPicker does not truncate text or limit the number of visible tags out of the box, so long values wrap and push the input around, breaking alignment with neighboring form fields.

✅ Adopt one of the documented patterns: truncate with your own ellipsis styles on the Tag primaryText and option text plus a title for the full value, or use Overflow with OverflowItem and a computed padding so only the tags that fit are shown.

## Accessibility

**Requirements**: TagPicker follows a combobox/listbox-with-popover interaction model. The trigger (TagPickerInput or TagPickerButton) must have an accessible name, typically supplied with aria-label as in the shipped examples where the group and the input are labelled "Selected Employees" and the button is labelled "Select Employees". Decorative media passed into a Tag or TagPickerOption (for example an Avatar) must be hidden from assistive technology with aria-hidden so the option or tag is announced by its text only. The selected chip list is a distinct region and should carry its own group label so that users hear the count and contents of the selection separately from the trigger. Disabled states must be conveyed to assistive technology with the disabled/aria-disabled semantics rather than being simulated with styling alone, and any icon-only trigger needs an aria-label because there is no visible text to name it.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the control (or between the input/button trigger and the popover contents) and out again to the next focusable element. |
| `Enter` | Selects the currently highlighted TagPickerOption; in the noPopover pattern it commits the typed TagPickerInput value as a new tag. |
| `Space` | Activates a focused TagPickerButton-style trigger to open the popover, and toggles selection of the focused option. |
| `ArrowDown` | Opens the popover when closed and moves the highlight forward through the TagPickerOption entries, including across TagPickerOptionGroup boundaries. |
| `ArrowUp` | Moves the highlight backward through the TagPickerOption entries and can return focus to the input/button. |
| `Escape` | Closes the open TagPickerList popover without changing the current selection. |
| `Backspace` | In the input variant, removes the most recently selected Tag when the input is empty, matching typical chip-input behavior. |
| `Delete` | Removes a focused Tag from the selected set when the tag itself has focus. |
| `Home / End` | Jumps the highlight to the first or last TagPickerOption in the list. |

**ARIA**: aria-label (on TagPickerInput, TagPickerButton and TagPickerGroup to name each part), aria-hidden (on decorative media such as Avatar passed to Tag or TagPickerOption), aria-expanded (on the trigger to reflect the open state tracked by onOpenChange), aria-disabled / disabled (when the TagPicker, a Tag, or an option is not interactive)

**Screen Reader**: A screen reader announces the trigger by its aria-label together with its expanded/collapsed state; when the list expands, the option count and grouping labels from TagPickerOptionGroup are read before the individual TagPickerOption entries, each of which is announced by its primary text (and its secondaryContent and media when those are not hidden). Selected items are read back from the labelled TagPickerGroup region, so a user can hear what is currently chosen without reopening the list. Because media is marked aria-hidden, avatars do not generate redundant announcements, and because the no-results placeholder is a normal option, it is announced like any other entry — which is why its sentinel value must be ignored in the selection handler rather than filtered out of the DOM.

## Styling

Most visual tuning happens on TagPickerControl and the Tag children rather than on the root. Use the control's appearance variants — outline (the default, a border on all four sides), underline (bottom border only), filled-darker (no border, subtle background) and filled-lighter (no border, white background) — instead of writing your own border rules, and align the look with Combobox, which shares the same appearance property. Sizes medium, large and extra-large change height, font size and padding together, so pick a size rather than overriding padding by hand. For finer control, reach for Griffel tokens through makeStyles: tokens.colorNeutralStroke1 and tokens.colorNeutralStrokeAccessible for control borders, tokens.colorNeutralBackground1 and tokens.colorNeutralBackground3 for filled variants, tokens.colorNeutralForeground1 and tokens.colorNeutralForeground2 for text, tokens.colorNeutralForegroundDisabled and tokens.colorNeutralBackgroundDisabled for disabled styling, tokens.borderRadiusMedium and tokens.borderRadiusCircular for control and Tag shapes, and spacing tokens such as tokens.spacingHorizontalXS, tokens.spacingHorizontalS and tokens.spacingVerticalXS for the gaps between tags and between the group and the input. The expandIcon slot can be replaced with a custom icon (for example an arrow-down icon from the icons package) or removed entirely by passing null, and the secondaryAction slot is absolutely positioned in the top-right corner of the control alongside the expand icon — so reserve horizontal padding for it. When something must stay on one line, the shipped pattern is Overflow with OverflowItem and a computed padding value that accounts for the input width and the tag gaps; long text is intentionally not truncated by the component, so apply your own ellipsis styles to a Tag's primaryText and an option's text/secondaryContent, including a title attribute for the full value.

## Performance

TagPickerList renders every TagPickerOption you pass, so the component cost scales with the size of the option set — filter the array before rendering rather than hiding options in the DOM. Memoize the filtered list and the renderOption result with React.useMemo or a stable callback, because useTagPickerFilter re-runs on each keystroke and an unstable render function will remount every option row on each character typed. Keep the data passed into a Tag or TagPickerOption primitive (strings for value and text) so rows do not re-render unnecessarily, and avoid recreating icon or Avatar media elements on each render when the option set is large. Because the popover renders out of DOM order on document.body by default, opening it mounts content outside the parent tree; the inline prop keeps rendering in DOM order and can be preferable when the picker lives in a container that scrolls frequently. When computing single-line layouts, the amount of work in the Overflow padding calculation grows with selectedOptions.length, so keep that expression simple and derived rather than recomputed inside render loops.

## Theming & Tokens

TagPicker consumes the standard Fluent theme through Griffel tokens, so appearance variants, size variants and disabled states all follow the active theme without component-level overrides. Borders and strokes come from tokens.colorNeutralStroke1 and tokens.colorNeutralStrokeAccessible, with tokens.colorNeutralStroke1Hover and tokens.colorNeutralStroke1Pressed for states; the filled appearances use tokens.colorNeutralBackground1 and tokens.colorNeutralBackground3, with tokens.colorNeutralBackground1Hover for interaction. Text inside the control, tags and options uses tokens.colorNeutralForeground1 and tokens.colorNeutralForeground2, while inactive states use tokens.colorNeutralForegroundDisabled and tokens.colorNeutralBackgroundDisabled. Corners and spacing follow tokens.borderRadiusMedium and tokens.borderRadiusCircular along with tokens.spacingHorizontalXS, tokens.spacingHorizontalS and tokens.spacingVerticalXS, and typography follows tokens.fontSizeBase200 / tokens.fontSizeBase300 with the matching line-height tokens; because these are all theme tokens, switching to a dark or high-contrast theme (or a brand ramp for selected/checked accents) updates the picker automatically. Apply your own overrides with makeStyles and mergeClasses rather than inline style objects so token values keep resolving against the theme.

## Migration Notes

TagPicker in v9 is a composable family of parts rather than a single monolithic picker: you assemble TagPickerControl, TagPickerGroup, TagPickerInput or TagPickerButton, TagPickerList, TagPickerOption and TagPickerOptionGroup yourself, and you own selection state through selectedOptions plus onOptionSelect. Filtering is no longer baked into the component — it is delegated to the useTagPickerFilter hook, which accepts the query, the option list, a filter predicate, a noOptionsElement for the empty state and a renderOption callback. The popover is built on the shared Popover/Positioning primitives, so it renders outside DOM order on document.body by default; the inline prop restores DOM-order rendering when that behavior is not wanted. Free-text tag creation is now an explicit opt-in through noPopover with a controlled input and an Enter handler, rather than a built-in resolve-suggestions callback. Styling moved from merged style props to makeStyles with Griffel tokens, and the size and appearance properties mirror Combobox instead of the previous picker-specific styling surface.

## Edge Cases

- When only one child is provided, TagPicker assumes that child is the popover. If your single child is actually a trigger — a control with an input or button and no list — you must set noPopover to true or it will be misinterpreted.
- Disabling the TagPicker blocks access to TagPickerList but does not prevent your code from changing selectedOptions; if you disable the control you must also guard any programmatic updates that should no longer happen. Individual Tags can additionally be disabled so a specific value stays visible but unreachable.
- The empty-state row is a real option with a sentinel value, so it appears in the option list, can receive focus, and will be passed to onOptionSelect unless you return early for that value.
- Tags are rendered from selectedOptions, so a Tag whose value is not present in that array disappears on the next render even if it was just clicked.
- In the noPopover configuration there is no list to choose from, so tags can only be created by your own input handling (for example committing the value on Enter) and by clearing the controlled input afterwards.
- Because the popover renders out of DOM order on document.body by default, it is not a descendant of the picker in the DOM; wrapping layout logic or CSS descendant selectors around the picker will not reach it unless you set inline.
- Long tag text is not truncated or clamped by the component, so wrapping tags can shift the input position; truncation must be implemented by the consumer with ellipsis styles and title attributes, or avoided with the Overflow pattern.
- Controlling the selectedOptions array to a single value is the supported way to get single-select behavior — the component itself has no selection-cardinality prop.
- The expandIcon and secondaryAction slots share the top-right corner of the control and are absolutely positioned, so a large secondaryAction can overlap the chevron or the tag row at small sizes.

## See Also

- - [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
