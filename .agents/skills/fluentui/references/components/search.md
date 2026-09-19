# Search

> **Package**: `@fluentui/react-search` v9.4.3
> **Import**: `import { Search } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Search is the Fluent UI form control for entering and submitting free-text queries. It renders as an input field (referenced in v9 examples and types as SearchBox / SearchBoxProps) that combines a text input, an optional leading content area, an optional trailing content area that surfaces on focus just before the built-in dismiss button, and a clear action that appears once a value exists. It supports four visual appearances (outline, underline, filled-lighter, filled-darker), three sizes (small, medium, large), controlled and uncontrolled value handling, a disabled state, and placeholder text. The change pipeline is exposed through a single onChange callback typed against SearchBoxChangeEvent and InputOnChangeData, which delivers the latest text value and lets the consumer intercept, validate, or reject updates. Because Search is a low-level building block rather than a sealed widget, it is commonly composed with Field for labels, hints, and validation messaging, with Button or icons in contentBefore/contentAfter, and with a listbox, Spinner, and live announcer to build a complete typeahead/autocomplete experience when combined with Combobox-style ARIA semantics.

**When to use**: Use Search when the primary task is entering a query string that filters, looks up, or navigates to results — global site search, table and list filtering, command palettes, or typeahead/autocomplete inputs. Choose it over a plain Input when you want the search affordance built in: the recognizable search styling, the automatic dismiss (clear) button, and the content slots for leading icons or trailing actions. Choose Search over Combobox when free text is the expected input and suggestion selection is optional; prefer Combobox (or the Search plus listbox typeahead recipe) when the user is expected to pick a single item from a defined set and the selection semantics matter more than the raw string. Prefer Search over Tags or TagPicker when the query is a single transient string rather than a collection of committed tokens, and over Textarea when the query is short and single-line.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `onChange` | `(event: SearchBoxChangeEvent, data: InputOnChangeData) => void` | — | No | — |

### Prop Guidance

- **onChange**: The single change pipeline for the field. It receives the change event and an InputOnChangeData payload containing the latest text, so read the value from the payload rather than from the event target. Use it for controlled updates, debounce scheduling, validation, and clearing state when the field becomes empty. `(event, data) => setValue(data.value)`
- **appearance**: Controls the field's visual treatment. Use outline (default) on standard surfaces, underline for low-chrome surfaces such as headers, and filled-lighter or filled-darker only on surfaces where you have verified greater than 3 to 1 contrast between the fill and its immediate surrounding color. `filled-lighter`
- **size**: Sets the control height and text scale. Use small in dense surfaces like toolbars and table filters, medium as the default for forms, and large for prominent, single-purpose search experiences such as empty-state search. `large`
- **contentBefore**: Renders a node inside the field border before the input text. Use it for a leading icon or a short presentational prefix such as a Text label; keep it non-interactive so it does not disturb tab order before the input. `a PersonRegular icon for name search`
- **contentAfter**: Renders a node following the input text and before the built-in dismiss button, appearing while the field is focused. Use it for a single action such as a voice-search or submit button, and always give that control its own aria-label since it is icon-only. `a MicRegular button with aria-label "Search by voice"`
- **value**: Supplies a controlled value. Pair it with onChange and always update your state when a change should be accepted; if you reject an update (for example to enforce a 20-character limit), the displayed text intentionally stays behind the user's keystrokes, so surface the reason through Field validation. `the current query string`
- **defaultValue**: Sets the initial text for an uncontrolled field. Use it for static defaults such as a pre-filled filter or a disabled field that displays an existing value; use value instead when the query changes in response to application state. `disabled value`
- **disabled**: Removes the field from the tab order and interaction. Use it only when the search action is genuinely unavailable, and prefer Field validation for states the user can fix rather than disabling the field to signal a problem. `true`
- **placeholder**: Provides a short hint that disappears once text is entered. Never use it as the only label; the default story guidance explicitly recommends supplying aria-label if you rely on placeholder for identification. `This is a placeholder`
- **root**: Targets the outer element of the field so you can attach handlers or attributes that need to observe the whole control rather than just the input, such as an onBlur that decides whether focus left the field and its results popup. `root={{ onBlur: handleBlur }}`
- **ref**: The ref is forwarded to the underlying input element, which lets you refocus the input programmatically after a suggestion is chosen, as the typeahead pattern does when a result is selected. `inputRef`
- **native input and ARIA props**: Standard input attributes and ARIA attributes pass through to the underlying input, including placeholder, disabled, onKeyDown, aria-label, aria-autocomplete, aria-controls, aria-expanded, and aria-activedescendant. These are the hooks for building combobox and typeahead behavior on top of the field. `aria-autocomplete="list"`

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

- Give every SearchBox an accessible name: wrap it in Field with a visible label for the standard case, and reserve aria-label for compact layouts such as a header or toolbar where a visible label would be visually redundant.
- Use outline (the default) for standard page and form surfaces, underline for low-chrome surfaces such as toolbars or headers where a full border box would be visually heavy, and the filled variants only on surfaces whose color you control.
- Verify contrast whenever you use filled-lighter or filled-darker: the fill must provide greater than a 3 to 1 contrast ratio against the immediately surrounding color, and placeholder and typed text must still meet normal text contrast requirements.
- Use contentBefore for a non-interactive leading affordance (an icon, or presentational Text such as "Search:") and keep contentAfter to at most one action, such as a search or voice button that carries its own aria-label.
- Debounce asynchronous queries (roughly 250-350ms) and cancel in-flight requests when the query changes, so a fast typist does not fire one request per keystroke or render stale results.
- Keep the query in controlled state with value plus onChange when you need validation, filtering, or a results popup, and read the newest text from the second onChange argument (InputOnChangeData) rather than the event.
- Use the size prop to match the density of surrounding controls (small, medium, large) and keep every SearchBox in the same region at the same size so focus rings and control heights align.
- When composing a typeahead, complete the combobox contract: role combobox on the input with aria-autocomplete set to list, aria-expanded, aria-controls pointing at the listbox id, and aria-activedescendant tracking the highlighted option, while options use role option with aria-selected.
- Announce dynamic results politely and after the user pauses typing (for example through an announcer hook with a batch id) instead of announcing on every keystroke, which would collide with screen reader keyboard echo.
- Use the root slot for handlers that must observe focus across the whole field — for example a root onBlur that checks whether focus moved to the results listbox before closing the popup.
- Use Field's validationState and validationMessage (as the controlled story does) for length limits or format feedback rather than changing the SearchBox's own appearance ad hoc.

### Don'ts

- Don't use placeholder as the only label — it vanishes as soon as the user types and is not a reliable programmatic name; if you must omit a visible label, supply aria-label.
- Don't fetch or filter on every keystroke without debouncing and cancellation; it produces request storms, flickering result lists, and race conditions where an older response overwrites a newer one.
- Don't stuff multiple interactive elements into contentAfter; they compete with the built-in dismiss button for space and make the tab order inside the field hard to predict.
- Don't rely on the disabled state to communicate an error or a required field; disabled fields are removed from the tab order and cannot explain themselves, so use Field validation messaging instead.
- Don't leave aria-expanded or aria-controls set while the results container is unmounted — dangling ID references confuse assistive technology; keep the listbox rendered and visually hidden instead of removing it.
- Don't intercept Escape or blur in a way that traps focus in an open results popup; Escape should close the popup and leave focus in the input.
- Don't keep a controlled value without calling the state setter from onChange — the input will look frozen to the user, which is intentional in the 20-character limit example but wrong as a general pattern.
- Don't place filled-lighter or filled-darker SearchBoxes on backgrounds that change with hover, selection, or theme without re-checking the 3 to 1 contrast requirement.

## Anti-Patterns

### Placeholder used as the only label

❌ Placeholder text disappears as soon as the user types, is announced inconsistently, and leaves the field without a stable accessible name, so the control's purpose is lost for screen reader users and for anyone returning to a half-filled form.

✅ Pair the SearchBox with Field and a visible label. If the design genuinely has no room for a visible label (for example a global header search), set aria-label so the field still has a programmatic name.

### Undebounced request per keystroke

❌ Firing a lookup on every change floods the network, re-renders the result list on every character, and allows out-of-order responses to overwrite newer results, so the list flickers and can display results for a query the user has already replaced.

✅ Debounce the query (roughly 250-350ms), cancel in-flight work in the effect cleanup when the query changes, and only render results after the debounce resolves. The typeahead story demonstrates this pattern, including cancellation of the pending fetch.

### Results popup without combobox semantics

❌ Rendering a list of results near the field but leaving the input as a plain textbox means assistive technology never learns that suggestions exist, how many there are, or which one is highlighted; arrow-key navigation then appears to do nothing.

✅ Wire the full contract: role combobox with aria-autocomplete list on the input, aria-expanded and aria-controls on the input, aria-activedescendant pointing at the highlighted option id, role listbox with an accessible name on the container, and role option with aria-selected on each result. Announce counts and empty states through a polite live region.

### Crowding the field with trailing actions

❌ Adding several buttons to contentAfter competes with the built-in dismiss button, compresses the text area, and creates an unpredictable tab sequence immediately after the input; on small sizes the content can overflow or truncate.

✅ Keep contentAfter to a single high-value action, give it an aria-label, and move secondary actions to a Toolbar or Menu next to the field. Reserve contentBefore for non-interactive, presentational content such as an icon or prefix text.

### Unverified fills on colored surfaces

❌ filled-lighter and filled-darker place a neutral fill against whatever color sits behind the field; on a card, tinted panel, or colored header the boundary can fall below the 3 to 1 contrast requirement, making the field edge invisible and the focus target ambiguous.

✅ Check the fill against the actual adjacent surface color, and if it fails, place the SearchBox on a container with a controlled background token, switch to outline or underline, or adjust the surrounding surface until the ratio passes.

### Dangling popup references

❌ Setting aria-expanded and aria-controls while conditionally unmounting the results list leaves the input pointing at an id that does not exist; consumers that look the container up by id get null and blur logic silently fails.

✅ Keep the listbox mounted and hide it visually when there are no results to show, so the aria-controls reference always resolves and focus-leave checks can reliably decide whether to close the popup.

## Accessibility

**Requirements**: Search is an input control, so it must be programmatically labeled — either with a visible label supplied by Field or with aria-label when no visible label exists. Placeholder text is not a substitute for a label. Text and placeholder colors must meet WCAG contrast requirements, and the filled-lighter and filled-darker appearances must additionally provide greater than a 3 to 1 contrast ratio against their immediate surrounding color (as stated in the appearance guidance). A visible focus indicator is required and is provided by the theme's focus stroke, so avoid removing outlines. Disabled fields are not focusable and must not be the sole carrier of meaning. When the field drives a results popup, the combobox pattern applies: the input exposes role combobox with aria-autocomplete set to list, aria-expanded reflecting whether results are shown, aria-controls referencing the listbox, and aria-activedescendant referencing the highlighted option, while the popup exposes role listbox with an accessible name (for example aria-label "Search results") and each item exposes role option with aria-selected. Count and status updates ("12 results available", "No results found", "Loading results") should be announced through a polite live region that waits for the user to pause typing.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the SearchBox and then to any focusable contentAfter control and the built-in dismiss button; Shift+Tab moves backward out of the field. |
| `Enter` | Submits the current query, and in a typeahead selects the currently highlighted result. |
| `Escape` | Closes an open results popup and returns the field to a resting state without clearing the typed text. |
| `ArrowDown` | In an open results popup, moves the highlight to the next result and restores aria-activedescendant if it was suppressed. |
| `ArrowUp` | Moves the highlight to the previous result, and past the first result moves the highlight off the list. |
| `ArrowLeft` | Moves the text caret within the query; in a typeahead this intentionally clears the active descendant so the caret movement is not overridden by the highlighted option. |
| `ArrowRight` | Moves the text caret forward within the query and likewise clears the active descendant in a typeahead. |
| `Character keys` | Type into the field, updating value and firing onChange with the new text. |
| `Backspace / Delete` | Edit the query; when the field reaches empty the dismiss button disappears and onChange reports an empty value. |
| `Space` | Types a space character in the query; activatable trailing buttons must be reached with Tab rather than Space from the input. |

**ARIA**: aria-label, role="combobox", aria-autocomplete="list", aria-controls, aria-expanded, aria-activedescendant, role="listbox", aria-label on the listbox, role="option", aria-selected, aria-live (polite, via a live announcer)

**Screen Reader**: Screen readers announce the label (from Field or aria-label), the value, and the control role. In the plain case the field is announced as a search or text input with its current value and placeholder. When composed as a typeahead, the input is announced as a combobox with autocomplete list; as the user types, the highlighted option is read through aria-activedescendant rather than focus movement, so the typing context is never lost, and result counts, loading state, and "no results" messages are delivered politely after a typing pause instead of interrupting keyboard echo. Option items report their selected state via aria-selected. The dismiss button is announced as a button, so it needs a meaningful name when localized or replaced.

## Styling

Style Search through Griffel makeStyles and the exported tokens object rather than global CSS or inline styles. The field surface is driven by neutral background and stroke tokens: outline uses a transparent fill with a neutral stroke, filled-lighter and filled-darker draw their fill from neutral background tokens (colorNeutralBackground1 and colorNeutralBackground3 style values), and disabled uses colorNeutralBackgroundDisabled with colorNeutralStrokeDisabled. Text uses colorNeutralForeground1, placeholder and secondary content use colorNeutralForeground3 or colorNeutralForeground4, and disabled text and icons use colorNeutralForegroundDisabled. Focus and hover states come from compound and hover strokes such as colorCompoundBrandStroke and colorNeutralStroke1Hover. Shape and metrics come from borderRadiusMedium, and spacing from spacingHorizontalXS, spacingHorizontalSNudge, spacingHorizontalS, and spacingVerticalXS so inserted contentBefore/contentAfter elements sit flush inside the border. Typography for small, medium, and large sizes maps to fontSizeBase200/fontSizeBase300/fontSizeBase400 with the matching lineHeightBase tokens. When you place a SearchBox on a colored or elevated surface, either switch to an appearance whose fill you control or wrap it in a container styled with shadow2 plus colorNeutralBackground1 so the 3 to 1 contrast rule for filled appearances holds. The appearance transition of the underline and focus stroke uses motion durationNormal with curveAccelerateMid. In the appearance and size stories, layout classes are composed with mergeClasses, and wrapper Fields receive a shared fieldWrapper class plus per-surface classes such as filledLighterLabel, which is the recommended pattern for keeping label and field colors in sync.

## Performance

The SearchBox itself is a lightweight single-input control; the cost almost always comes from what the consumer attaches to it. Debounce query-driven work and cancel pending requests in the effect cleanup so each keystroke does not trigger a fetch or a full list re-render. Keep the query state as close to the SearchBox as possible — lifting a controlled value into a large parent causes that subtree to re-render on every character. Memoize change and key handlers with useCallback, keep option components memoized, and avoid re-creating styles inside the render path; use makeStyles at module scope as the stories do. For long result lists, cap the rendered options, virtualize when the list can grow large, and scroll the focused option into view only when the focused index actually changes, as the typeahead example does with scroll nearest. Limit live-region announcements to meaningful moments (loading, result count, no results) and let the announcer wait for a typing pause, since verbose live regions are both an accessibility and a performance problem. Selection handlers should refocus the input through the forwarded ref rather than remounting the field, which would discard state and repeat expensive style work.

## Theming & Tokens

Search consumes Fluent theme tokens through Griffel, so it adapts automatically to brand and color-scheme changes when you use the tokens object. Field surfaces map to colorNeutralBackground1 for filled-lighter and colorNeutralBackground3 for filled-darker, with hover states from colorNeutralBackground1Hover, and disabled fill from colorNeutralBackgroundDisabled. Borders use colorNeutralStroke1 at rest, colorNeutralStroke1Hover on hover, colorNeutralStrokeDisabled when disabled, and the brand-tinted focus stroke (colorCompoundBrandStroke and the focus stroke token used for the focus indicator) for the active state; the underline appearance leans on the same focus stroke for its bottom border. Text uses colorNeutralForeground1 for the typed value, colorNeutralForeground3 or colorNeutralForeground4 for placeholder and secondary content, and colorNeutralForegroundDisabled for disabled text and icons. Density and shape come from control height tokens per size, borderRadiusMedium, spacingHorizontalXS, spacingHorizontalSNudge, spacingHorizontalS, spacingVerticalXS, and typography tokens fontSizeBase200, fontSizeBase300, fontSizeBase400 with their lineHeightBase counterparts. Surfaces that need elevation pair the field with shadow2 on a colorNeutralBackground1 container, and interactive transitions use durationNormal with curveAccelerateMid. Because the component relies on semantic tokens rather than hard-coded colors, re-theming via a Provider updates search fields, their placeholders, and their focus rings without per-component overrides.

## Migration Notes

The v9 Search replaces the older boolean styling switches with the appearance prop, which accepts outline, underline, filled-lighter, and filled-darker; map the old "underlined" look to appearance="underline" and keep outline as the default. Control density is expressed with the size prop (small, medium, large) instead of ad hoc height overrides. Visual customization moves from theme palette references to Griffel tokens inside makeStyles, so any legacy overrides of border, background, or placeholder colors should be rewritten against colorNeutralStroke1, colorNeutralBackground1, colorNeutralForeground3, and related tokens. Labeling, hints, and validation now come from the Field component rather than props on the search field itself, and the leading/trailing affordances previously configured through icon configuration are now plain React nodes in the contentBefore and contentAfter slots. Change handling is consolidated into a single onChange with a SearchBoxChangeEvent plus InputOnChangeData payload, and search submission is handled by the consumer (for example, by wrapping the field or attaching key handlers) instead of a dedicated search callback.

## Edge Cases

- Placeholder text is not a label: it disappears after the first character and cannot identify the field, so any SearchBox that relies on it must also set aria-label.
- The built-in dismiss button only exists while there is a value; when it is activated, onChange fires with an empty value, so controlled consumers must accept and store the empty string or the field will look stuck.
- contentAfter content appears while the field is focused and sits between the input text and the dismiss button; icon-only content there needs its own aria-label because it is announced as a button.
- Filled-lighter and filled-darker appearances require greater than 3 to 1 contrast against the adjacent surface color, which is easy to violate on tinted panels or colored headers.
- In a controlled field that rejects an update (the 20-character limit example), the visible text intentionally lags the keystrokes; without a Field validationMessage the user gets no explanation for why typing stopped.
- Blur-based popup closing must consider the results container as well as the field, and option clicks need to suppress the default mousedown behavior so the input does not blur before the click registers.
- ArrowLeft and ArrowRight inside a typeahead deliberately clear aria-activedescendant so caret movement is not swallowed by the highlighted option; re-enable it on the next ArrowDown or ArrowUp.
- Popup code that looks its listbox up by id can receive null if the container is unmounted, so keep the listbox rendered and visually hidden rather than conditionally removing it.
- A disabled SearchBox cannot be focused, so it cannot expose a validation or status message on its own; use surrounding Field text if the reason must be communicated.
- Very small or very large sizes change internal padding and available text width, so long contentBefore or contentAfter nodes can crowd or truncate the query text.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
