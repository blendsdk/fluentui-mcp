# SearchBox

> **Package**: `@fluentui/react-search` v9.4.3
> **Import**: `import { SearchBox } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

SearchBox is a Fluent UI React v9 text input specialized for search scenarios. It renders a single-line input with search semantics, an optional dismiss (clear) button that appears once the field contains a value, and built-in visual variants for size and background treatment. The component supports a contentBefore slot for elements that sit before the typed text (such as a search or persona icon) and a contentAfter slot for elements that appear on focus, after the text and before the dismiss button. Because it is built on the same primitives as Input, it accepts native input attributes such as placeholder, disabled, value, defaultValue and arbitrary aria-* attributes, and it can be wrapped in a Field to obtain a label, hint text and validation messaging. SearchBox can be used uncontrolled with defaultValue, fully controlled with value plus onChange, or as the input half of a larger typeahead/autocomplete pattern driven by aria-autocomplete, aria-controls, aria-expanded and aria-activedescendant. Its appearance, size and slot content make it suitable both for compact toolbars and for prominent page-level search experiences, including dark and filled surfaces.

**When to use**: Use SearchBox when the primary intent of the field is searching or filtering a data set, list, table or page, and when users benefit from a dedicated clear affordance and search-oriented styling. Choose it over Input for search fields so users get the familiar dismiss button, search semantics and appearance variants that match surrounding surfaces. Choose it over Combobox, Dropdown or TagPicker when the query is free-form text rather than a selection from a fixed set of options; those components should be used when users must pick from a defined list. SearchBox is also the correct building block for a typeahead or autocomplete experience, where it is composed with a results listbox rather than replaced by a sealed component. For short non-search data entry such as names, emails or comments, use Input or Textarea instead.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `onChange` | `((event: SearchBoxChangeEvent, data: InputOnChangeData) => void) \| undefined` | — | No | Custom onChange callback. Will be traditionally supplied with a React.ChangeEvent<HTMLInputElement> for usual character entry. When the dismiss button is clicked, this will be called with an event of type React.MouseEvent<HTMLSpanElement> and an empty string as the `value` property of the data parameter |

### Prop Guidance

- **onChange**: Primary way to observe edits. It receives a SearchBoxChangeEvent and an InputOnChangeData object whose value contains the new text. When the dismiss button is activated the same callback fires with a mouse event originating from the dismiss button span and an empty value, so any handler must tolerate both event shapes and an empty string. Use it for controlled value updates, debounced search triggers, validation and length limiting. `handler that stores data.value and ignores empty values for network calls`
- **appearance**: Selects the visual treatment of the field. Use outline (the default) on standard neutral surfaces, underline for lightweight or inline contexts such as a page header, and filled-lighter or filled-darker when the field sits on a contrasting background. Always verify that the chosen filled variant meets the greater than 3 to 1 contrast ratio against the immediate surrounding color. `outline`
- **size**: Controls the height, font size and inner padding of the field. Use small in dense surfaces such as toolbars and table headers, medium as the default in most forms, and large for prominent, page-level search entry points. `medium`
- **contentBefore**: Renders an element inside the field border, before the typed text, and remains visible at rest. Use it for a search or persona icon, or a short presentational prefix such as a "Search:" Text element. Keep it non-interactive or ensure any interactive element carries its own accessible name. `a PersonRegular icon or a short prefix Text element`
- **contentAfter**: Renders an element inside the field border, after the typed text and before the dismiss button, and it becomes visible on focus. Reserve it for secondary actions such as a voice-search or filter button that should not compete with the resting state; never put essential, always-needed information here. `an icon-only mic button labelled for voice search`
- **placeholder**: Supplies hint text shown while the field is empty. Fine as a complement to a visible label, but if you use it in place of a label (not recommended) you must also provide an aria-label so screen reader users know the field's purpose. `Search by name`
- **disabled**: Removes the field from interaction and from the tab order when searching is unavailable in the current context. Prefer explaining why search is unavailable rather than silently disabling the field, and never disable it while a query is still relevant to the user's task. `true`
- **value**: Use with onChange for fully controlled usage, for example to enforce a maximum length, keep the field synchronized with a results list, or seed it from a URL query. Without a corresponding onChange handler the field becomes effectively read-only. `a query string held in component state`
- **defaultValue**: Use for uncontrolled usage when the initial query should be pre-filled but subsequent edits do not need to be tracked by the parent, such as a disabled field showing a previously saved query. `disabled value`
- **root**: Slot for the outer wrapper element that contains the input, the content slots and the dismiss button. Reach for it when you need to attach handlers or attributes to the wrapper rather than the inner input, for example a blur handler that decides whether focus left the whole component before closing an associated results list. `an onBlur handler on the wrapper`

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import type { ArgTypes } from '@storybook/react-webpack5';
import { Field, SearchBox } from '@fluentui/react-components';
import type { SearchBoxProps } from '@fluentui/react-components';

export const Default = (props: SearchBoxProps): JSXElement => {
  return (
    <Field label="Sample SearchBox">
      <SearchBox {...props} />
    </Field>
  );
};

const argTypes: ArgTypes = {
  // Add these native props to the props table and controls pane
  placeholder: {
    description:
      'Placeholder text for the SearchBox. If using this instead of a label (which is ' +
      'not recommended), be sure to provide an `aria-label` for screen reader users.',
    type: { name: 'string', required: false }, // for inferring control type
    table: { type: { summary: 'string' } }, // for showing type in prop table
  },
  disabled: {
    description: 'Whether the SearchBox is disabled',
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
import { Field, makeStyles, mergeClasses, SearchBox, tokens } from '@fluentui/react-components';

export const Appearance = (): JSXElement => {
  const styles = useStyles();
  return (
    <div className={styles.base}>
      <Field className={styles.fieldWrapper} label="Outline appearance (default)">
        <SearchBox appearance="outline" />
      </Field>

      <Field className={styles.fieldWrapper} label="Underline appearance">
        <SearchBox appearance="underline" />
      </Field>

      <Field
        className={mergeClasses(styles.fieldWrapper, styles.filledLighter)}
        label={{ children: 'Filled lighter appearance', className: styles.filledLighterLabel }}
      >
        <SearchBox appearance="filled-lighter" />
      </Field>

      <Field
        className={mergeClasses(styles.fieldWrapper, styles.filledDarker)}
        label={{ children: 'Filled darker appearance', className: styles.filledDarkerLabel }}
      >
        <SearchBox appearance="filled-darker" />
      </Field>
    </div>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story:
        'A SearchBox can have different appearances.\n' +
        `The colors adjacent to the SearchBox should have a sufficient contrast. Particularly, the color of SearchBox with
      filled darker and lighter styles needs to provide greater than 3 to 1 contrast ratio against the immediate
      surrounding color to pass accessibility requirements.`,
    },
  },
};
```

### ContentBeforeAfter

```tsx
import * as React from 'react';
import type { JSXElement, ButtonProps } from '@fluentui/react-components';
import { Button, Field, makeStyles, SearchBox, Text, tokens } from '@fluentui/react-components';
import { PersonRegular, MicRegular } from '@fluentui/react-icons';

export const ContentBeforeAfter = (): JSXElement => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <Field
        className={styles.fieldWrapper}
        label="Search by name"
        hint={
          <>
            A SearchBox with a custom icon in the <code>contentBefore</code> slot.
          </>
        }
      >
        <SearchBox contentBefore={<PersonRegular />} />
      </Field>

      <Field
        className={styles.fieldWrapper}
        label="Search by voice"
        hint={
          <>
            A SearchBox with a button in the <code>contentAfter</code> slot.
          </>
        }
      >
        <SearchBox contentAfter={<MicButton aria-label="Search by voice" />} />
      </Field>

      <Field
        className={styles.fieldWrapper}
        label="Search with filter"
        hint={
          <>
            A SearchBox with a presentational value in the <code>contentBefore</code> slot and another presentational
            value in the <code>contentAfter</code> slot.
          </>
        }
      >
        <SearchBox contentBefore={<Text size={400}>Search:</Text>} contentAfter={<Text size={400}>Filter</Text>} />
      </Field>
    </div>
  );
};

ContentBeforeAfter.parameters = {
  docs: {
    description: {
      story:
        'A SearchBox supports a custom element such as an icon or a button before the input text. ' +
        'Additionally, a SearchBox supports an custom element that appears on focus, following the input text and before the dismiss button. ' +
        'These elements are displayed inside the SearchBox border.',
    },
  },
};
ContentBeforeAfter.storyName = 'Content before/after';
```

## Best Practices

### Do's

- Always pair the SearchBox with a visible label, typically by wrapping it in Field, so that the purpose of the field is clear before the user types.
- Provide a descriptive placeholder that hints at what can be searched (for example a product or person name) when a visible label already exists.
- Debounce network requests triggered by onChange so that a query is not issued on every keystroke; the Typeahead story demonstrates a debounce with cancellation of in-flight requests.
- Keep the query in React state when you need to validate, limit length, or synchronize the SearchBox with a results list, and update state only when the new value is acceptable.
- Use contentBefore for a persistent, non-interactive cue such as an icon or a short prefix like "Search:", and keep interactive extras in contentAfter where they only appear on focus and do not clutter the resting state.
- Give interactive elements you place in the slots, such as a microphone or filter button, their own accessible name so screen readers can announce them independently of the field.
- Choose appearance values that contrast sufficiently with the surrounding surface; the filled-lighter and filled-darker variants in particular need greater than a 3 to 1 contrast ratio against their immediate background.
- Reset or preserve the query deliberately after a search is committed, and make the resulting state visible so users are not left wondering whether the search ran.

### Don'ts

- Do not rely on placeholder text as the only label; it disappears on typing and is not a substitute for a persistent Field label.
- Do not use SearchBox for general form input such as a name, address or password field; use Input or the appropriate form component instead.
- Do not issue a request directly on every onChange call without debouncing, and do not ignore the empty-string case that arrives when the dismiss button is clicked.
- Do not pass both value and defaultValue to the same SearchBox, and do not pass value without handling onChange, which makes the field effectively read-only with no way for the user to change it.
- Do not place critical, always-visible information inside contentAfter, because that slot is rendered on focus and will be hidden at rest.
- Do not nest multiple competing primary actions such as several icon buttons plus the built-in dismiss button inside one SearchBox; move secondary actions to the surrounding toolbar.
- Do not hard-code colors or sizes with literal values when styling the field; use the Fluent tokens so the SearchBox tracks theme, high-contrast mode and density changes.
- Do not override or remove the dismiss button's keyboard reachability, since clearing a query is a core keyboard interaction.

## Anti-Patterns

### Placeholder used as the only label

❌ Placeholder text vanishes as soon as the user types, is often rendered at low contrast, and provides no persistent accessible name, so users lose track of what the field searches and screen reader users may hear an unlabeled edit field.

✅ Wrap the SearchBox in Field with a visible label and use placeholder only as supplementary hint text. If a visible label truly cannot be shown, supply an aria-label that describes the search.

### Firing a request on every keystroke

❌ Calling a search API directly inside onChange produces one request per character, causing wasted bandwidth, out-of-order responses and results that flicker as stale responses arrive after newer ones.

✅ Debounce the query, cancel in-flight requests when the query changes, and surface a loading state, as demonstrated by the Typeahead story's debounced fetch with cancellation.

### Ignoring the dismiss-button change event

❌ The change callback is invoked when the dismiss button is clicked with an event that originates from a span and an empty value. Handlers that assume a standard input change event, or that treat every call as meaningful input, can crash or refetch with an empty query.

✅ Handle both event shapes, treat an empty value as a cleared query, and short-circuit network calls or results-list updates when the value is empty.

### Overloading one SearchBox with actions

❌ Adding several icon buttons to contentAfter alongside the built-in dismiss button crowds the field, creates ambiguous focus order, and hides actions from users until they focus the field.

✅ Keep at most one secondary action inside contentAfter and move the rest to an adjacent Toolbar, Button group or Menu so they are always discoverable and independently focusable.

### Passing value without onChange

❌ Supplying a controlled value with no change handler makes the SearchBox appear editable but silently discard every keystroke, which looks like a broken component.

✅ Either manage the value in state and update it from onChange, or omit value and use defaultValue for uncontrolled behavior.

### Assuming contentAfter is always visible

❌ contentAfter only renders on focus, so filters or status indicators placed there are invisible at rest and users may not realize they exist.

✅ Put persistent information in contentBefore or outside the field, and reserve contentAfter for progressive-disclosure actions that make sense only while the user is typing.

## Accessibility

**Requirements**: The SearchBox must have an accessible name. Supply it through a Field label (which associates a label element with the input) or, when no visible label is possible, through an aria-label. Placeholder text must never be the sole source of the field's name. When the field is used as a typeahead, set aria-autocomplete to list, reference the results container with aria-controls, expose the open/closed state with aria-expanded, and point at the highlighted option with aria-activedescendant. Interactive elements placed in contentBefore or contentAfter must be real focusable elements (such as a Button) with their own accessible names, not styled spans. Any color pairing introduced by appearance, especially filled-lighter and filled-darker, must maintain at least a 3 to 1 contrast ratio between the field and the color immediately adjacent to it, and text inside the field must meet normal text contrast requirements. Disabled SearchBoxes are removed from the tab order and must not be the only way to convey essential information.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the text field; when the field contains a value, tabbing again moves focus to the dismiss button before leaving the component. |
| `Shift+Tab` | Moves focus backwards, from the dismiss button back to the text field or out of the SearchBox entirely. |
| `Enter` | Commits the current query when the SearchBox participates in a form or search workflow; in the typeahead pattern it selects the currently highlighted result. |
| `Space` | Types a space inside the text field; when the dismiss button holds focus, it activates the clear action. |
| `Escape` | Closes an associated results listbox in the typeahead pattern; SearchBox itself does not clear its value on Escape. |
| `ArrowDown` | In the typeahead pattern, reveals or moves the active option downward through the results list. |
| `ArrowUp` | In the typeahead pattern, moves the active option upward, eventually returning the highlight to the text field. |
| `ArrowLeft / ArrowRight` | Moves the caret within the text; in the typeahead pattern these keys also hide the active-descendant highlight so the caret can be repositioned without changing the highlighted option. |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-autocomplete, aria-controls, aria-expanded, aria-activedescendant

**Screen Reader**: Screen readers announce the SearchBox as a text input (or, when the typeahead attributes are applied, as a combobox) together with its accessible name and any hint or validation text supplied by Field. Typed characters and pasted text are echoed by the screen reader as they are entered. When the dismiss button is present it is announced as an independent button with its own name, so users can clear the field without selecting all the text and deleting it. In the typeahead pattern, results are surfaced through the associated listbox with aria-activedescendant tracking the highlighted option, and result counts, loading states and the no-results condition should be announced through a live region rather than only visually, using pauses in typing so announcements do not collide with character echo.

## Styling

Style SearchBox through Griffel classes created with makeStyles and applied via className, and prefer design tokens over literal values. The resting border of the field is driven by tokens.colorNeutralStroke1, with the hover and focus states typically using tokens.colorNeutralStroke1Hover and a focus indicator built from tokens.colorStrokeFocus2 or tokens.colorCompoundBrandStroke; the underline appearance instead relies on a bottom edge such as tokens.colorNeutralStrokeAccessible and its brand counterpart. Backgrounds map to tokens.colorNeutralBackground1 for the outline appearance, tokens.colorNeutralBackground1Hover for hover, tokens.colorNeutralBackgroundDisabled and tokens.colorNeutralForegroundDisabled for the disabled state, and the filled appearances pair with the neutral or brand subtle background tokens appropriate to the surface they sit on. Placeholder text should use a low-emphasis foreground such as tokens.colorNeutralForeground4 or tokens.colorNeutralForeground3 rather than a hard-coded gray. Typography follows tokens.fontSizeBase300 with tokens.lineHeightBase300 for the medium size and the corresponding small and large ramp values. Inner spacing for the slots is best expressed with tokens.spacingHorizontalMNudge or tokens.spacingHorizontalS, and rounded corners with tokens.borderRadiusMedium. When you need to color a label or hint that sits on a filled surface, apply the same token family used by the field so text and container stay legible; the Appearance story explicitly mixes label colors with the filled backgrounds for exactly this reason. Use mergeClasses rather than string concatenation when combining your own classes with conditional ones.

## Performance

The change callback runs on every keystroke and on dismiss, so keep the handler cheap and defer expensive work such as network calls behind a debounce. When the handler is passed to memoized children or used in dependency arrays, wrap it in useCallback so downstream components do not re-render on every parent render. Elements supplied to contentBefore and contentAfter are created on each render, so hoist static icons or prefix elements to module scope or memoize them, and avoid mounting heavy components in these slots; the contentAfter slot additionally appears and disappears with focus, which mounts and unmounts its contents. In typeahead implementations the results list can grow large, so virtualize or cap the rendered options, keep the highlighted index in a ref or small piece of state, and scroll the active option into view rather than re-rendering the entire list. Setting a controlled value on every keystroke is fine, but avoid re-creating the SearchBox element type or its style classes between renders, since makeStyles classes should be created once outside the render path.

## Theming & Tokens

SearchBox consumes Fluent theme tokens rather than fixed colors, so it responds automatically to FluentProvider themes, brand ramps, high-contrast mode and dark mode. The neutral surface and border come from tokens.colorNeutralBackground1 and tokens.colorNeutralStroke1, with hover border emphasis from tokens.colorNeutralStroke1Hover and a brand-tinted underline or focus edge drawn from tokens.colorCompoundBrandStroke and the focus tokens such as tokens.colorStrokeFocus2. Text uses tokens.colorNeutralForeground1, placeholder and hint text use a lower-emphasis neutral foreground token, and the disabled state combines tokens.colorNeutralBackgroundDisabled with tokens.colorNeutralForegroundDisabled. Corner rounding uses tokens.borderRadiusMedium and typography uses the fontSize and lineHeight base ramps, so a theme change or a density adjustment propagates to the field without additional work. If you build a custom appearance, derive the field background and its adjacent surface from the same token family so the required contrast ratio is preserved across themes, including when the component sits on a brand or filled surface.

## Migration Notes

In v9 the search field's visual treatment is chosen with the appearance prop (outline, underline, filled-lighter, filled-darker) rather than a legacy underlined boolean, and the default is outline. Sizing is expressed with size (small, medium, large). Decorative and interactive add-ons that older versions exposed through dedicated icon render props are now composed through the contentBefore and contentAfter slots, with the dismiss button remaining built in. Styling moved from style-function props to Griffel classes created with makeStyles and composed with mergeClasses, so any class overrides must be rewritten against tokens instead of the old style objects. The change callback follows the v9 convention of receiving an event plus a data object (SearchBoxChangeEvent and InputOnChangeData, including the value string) instead of a raw DOM change event, and the change event type differs when the dismiss button is used.

## Edge Cases

- The change callback is invoked with a mouse event originating from the dismiss button span and an empty value when the query is cleared, which is a different event shape than ordinary typing.
- contentAfter is rendered on focus only, so any element placed there is absent from the DOM at rest; contentBefore, by contrast, stays visible, and both are drawn inside the field border.
- When you reject an incoming value in a controlled SearchBox, keep the previous value in state rather than writing an empty or truncated value, otherwise the caret jumps and the user's typing appears to be eaten.
- Passing both value and defaultValue to the same field is contradictory and will warn; pick controlled or uncontrolled behavior and stay with it.
- In the typeahead pattern, moving the caret with ArrowLeft or ArrowRight should suppress aria-activedescendant so the highlighted option does not change while the user repositions the cursor.
- The filled-lighter and filled-darker appearances require the surrounding color to provide more than a 3 to 1 contrast ratio against the field, which is easy to violate on brand-colored or image backgrounds.
- The dismiss button only makes sense when a value is present, so focus order and the resulting onChange call should be verified for both empty and populated fields.
- Disabled SearchBoxes are skipped by the tab order entirely, so a disabled field containing a previously saved query must still be readable from surrounding text.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
