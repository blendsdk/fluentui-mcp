# ListItem

> **Package**: `@fluentui/react-list` v9.6.15
> **Import**: `import { ListItem } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

ListItem is the row-level primitive that composes inside a List. Each ListItem represents one entry in a vertical collection — a choice, a destination, a setting, or a line of content — and relies on the surrounding List to supply the collection semantics and focus model. The component is compositional: the root slot is the rendered row itself, and an optional checkmark slot provides the built-in selection indicator instead of forcing consumers to hand-roll a check icon or a background-color highlight. Behavior is driven by three props: value identifies the item to the parent list's selection logic, onAction turns the row into an actionable element that responds to pointer and keyboard activation, and disabledSelection keeps an item visible and readable while excluding it from selection. Because the row markup is intentionally minimal, richer rows are built by composing other Fluent components — Avatar, Persona, Badge, CounterBadge, Text, Divider, Spinner — inside the root slot, which is the standard pattern for contact lists, mail lists, file browsers, and settings navigation.

**When to use**: Use ListItem whenever you need a repeating, vertical set of peer-level entries that share a structure: navigation lists (a drawer or Nav alternative), single- or multi-select choice lists, settings rows, contact or file rows, and action-oriented lists where each row triggers a command. Choose ListItem when selection state and row-level actionability are first-class concerns and the collection is flat. Prefer other primitives when the data or interaction model differs: use DataGrid or Table for column-aligned tabular data that needs headers and sorting, use Tree or FlatTree when items nest hierarchically with expand/collapse, use Menu or MenuItem when the list is a transient overlay of commands anchored to a trigger, use Dropdown, Combobox, or Listbox when the list must participate in form value submission, and use a plain Button or Link when there is exactly one action rather than a repeating set of rows.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabledSelection` | `boolean \| undefined` | — | No | — |
| `onAction` | `EventHandler<ListItemActionEventData> \| undefined` | — | No | — |
| `value` | `ListItemValue \| undefined` | — | No | — |

### Prop Guidance

- **value**: Assign a stable, unique identifier for the row whenever the surrounding list participates in selection. The parent resolves the selected item by comparing values, so the value must survive reordering, filtering, and re-rendering — use the underlying entity id rather than an array index. Items that are purely decorative or informational can omit value, in which case the row is simply not selectable. `the id of the entity the row represents`
- **onAction**: Provide this when the row should do something on activation — navigate to a detail view, open a record, apply a setting. Supplying it makes the row actionable for both pointer and keyboard users, so the visible row text must describe the outcome. Keep the handler stable across renders and do not use it as a hook for toggling selection state; that belongs to value plus the list's selection configuration. `navigate to the selected record`
- **disabledSelection**: Set this to keep an item in the list and fully readable while excluding it from selection — locked entries, informational rows, or options that are temporarily unavailable. It is narrower than a fully disabled control: the row stays present and legible, but the list's selection logic will not choose it. Pair it with a textual reason for why the item cannot be picked instead of relying on a dimmed appearance. `true`
- **checkmark (slot)**: The optional selection indicator rendered inside the row. Let it be supplied by the component rather than recreating a check icon, and avoid styling it so heavily that it becomes the only signal of selection — it must pair with the programmatic selected state so screen reader users get the same information. Replace or restyle it only when the list's design language genuinely differs from the system default. `default selection indicator`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `checkmark` | — | No | — |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Render ListItem as a direct child of a List so that the collection and the item keep their parent/child relationship and the correct list semantics.
- Give every selectable item a stable, unique value — typically a data id — so the parent list can resolve the selected item deterministically across re-renders and reorders.
- Use the checkmark slot to signal selection instead of drawing your own check glyph or toggling a background color, so selection looks and behaves consistently with the rest of the design system.
- Use onAction for rows that navigate or execute a command, and make sure the row's visible text alone communicates what the action does so the item has a usable accessible name.
- Use disabledSelection when an item should stay visible and legible but must not be picked — for example a header-like entry, a locked option, or an out-of-stock result.
- Keep every row structurally consistent — same slot order, same leading visual, same trailing metadata — so the list scans as a single rhythm rather than a patchwork of layouts.
- Compose richer rows from existing Fluent pieces placed inside the root slot, such as Avatar or Persona as the leading visual and Text for a secondary line, rather than adding custom interactive chrome.
- Reuse one wrapper component for row content when the same row anatomy appears in more than one list, so the internal slot composition and any inline styling stay in sync.

### Don'ts

- Don't place focusable elements — Button, Link, Checkbox, Switch, another ListItem — inside an actionable ListItem; nested interactive controls create duplicate tab stops, ambiguous hit targets, and confusing announcements for screen reader users.
- Don't use ListItem as a general page-layout container or as a substitute for a Card grid; a list item outside a list loses its collection context.
- Don't assign the same value to multiple items, since selection resolution then becomes ambiguous and highlight or checkmark state can land on the wrong row.
- Don't implement selection by toggling state inside onAction; selection is expressed through value plus the parent list's selection configuration, and mixing the two produces rows that look selected but aren't tracked as selected.
- Don't fake a disabled row by dimming colors manually while leaving it selectable; use disabledSelection so the behavior and the visual state agree.
- Don't communicate selected, disabled, or error state through color alone — a checkmark, text, or another non-color cue must accompany it.
- Don't hardcode hex colors, pixel paddings, or font sizes on the row; they break under dark, high-contrast, and brand themes.
- Don't overload a single row with several competing calls to action; if an item needs multiple commands, move those commands into an overflow Menu or a details surface instead of stacking them in the row.

## Anti-Patterns

### Interactive controls nested inside an actionable row

❌ Putting a Button, Link, Checkbox, or Switch inside a ListItem that already has onAction creates nested interactive elements. Keyboard users hit duplicate and unpredictable tab stops, pointer users hit overlapping hit targets, and assistive technology announces conflicting roles inside a single row.

✅ Make the row itself the single action target via onAction, and move any secondary commands into an overflow Menu placed outside the row's activation surface — or split the row into a plain content area plus a separate, explicitly labeled control that is not wrapped by the row's action.

### Using onAction to drive selection

❌ Toggling selection inside the onAction handler produces rows that look selected but are invisible to the list's selection model, so aria-selected, the checkmark slot, and any downstream logic that reads selected values all disagree with the UI.

✅ Express selection through the value prop and let the parent list own the selection state, reserving onAction for navigation and commands. If an item must be both selectable and actionable, separate those concerns clearly instead of overloading one handler.

### Recreating the checkmark by hand

❌ Drawing a custom check icon or flipping a background color on selection bypasses the checkmark slot, which means the visual cue drifts from the design system, fails the non-text contrast requirement in some themes, and is never tied to the announced selected state.

✅ Use the checkmark slot as the selection indicator and keep selection state programmatic. Only reskin the slot when there is a genuine design requirement, and always verify contrast in webLightTheme, webDarkTheme, and high-contrast.

### Hardcoding row colors and metrics

❌ Literal hex colors, pixel paddings, and font sizes on the root slot break under dark, high-contrast, and brand themes, and they drift the moment the design system's spacing scale changes.

✅ Style the root and checkmark slots exclusively with Griffel tokens such as tokens.colorNeutralBackground1Hover, tokens.colorNeutralForegroundDisabled, tokens.colorStrokeFocus2, and tokens.spacingHorizontalM so theme switching works without any conditional logic.

### Duplicate or index-based values

❌ Reusing a value across rows, or deriving it from the array index, makes selection resolution ambiguous — sorting or filtering a list silently moves the highlight and checkmark to the wrong entry.

✅ Derive value from a stable domain identifier that is unique per item, and treat index only as a render-order detail that never reaches the selection model.

## Accessibility

**Requirements**: The list must satisfy WCAG 2.1 AA: 1.3.1 for programmatically determinable structure (items must be exposed as children of the list, not as a flat set of divs), 2.1.1 and 2.1.2 for full keyboard operability without a keyboard trap, 2.4.7 for a visible focus indicator on actionable rows, 4.1.2 for correct name, role, and value on every item, 1.4.1 for not using color as the only selection cue, 1.4.3 for text contrast against the row background in default, hover, selected, and disabled states, 1.4.11 for non-text contrast of the checkmark and focus ring, and 2.5.8 for a target size large enough to tap. Rows that are actionable must be reachable by Tab in a predictable order and must be activated by both Enter and Space. Disabled items must still be readable and must never be the only way to reach required information.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the list (to the first focusable item or to the currently active item) and, on the next Tab, out of the list to the following control; never traps focus inside a single item. |
| `Shift + Tab` | Moves focus backward to the previously focusable item or out of the list to the preceding control. |
| `Enter` | Activates the focused item, invoking its onAction handler when the item is actionable; when the list is configured for selection, it also commits the item's value as the selection. |
| `Space` | Activates the focused item the same way Enter does for actionable rows, and confirms the value for selectable rows without moving focus. |
| `Arrow Down` | Moves focus to the next item in the list when the list manages roving focus between items; at the last item focus stays on the last item rather than wrapping. |
| `Arrow Up` | Moves focus to the previous item in the list when the list manages roving focus between items; at the first item focus stays on the first item rather than wrapping. |
| `Home` | Moves focus to the first item in the list when item-level focus navigation is enabled. |
| `End` | Moves focus to the last item in the list when item-level focus navigation is enabled. |

**ARIA**: role (list item role on the root slot, or presentation when the parent supplies the semantics), aria-selected, aria-disabled, aria-label, aria-labelledby, aria-describedby, aria-posinset, aria-setsize, aria-multiselectable (on the parent list when multiple items can be selected)

**Screen Reader**: The screen reader announces the collection first (for example "list, 8 items") and then each row as an item within it, so the user always knows they are inside a bounded set and how far into it they are. When aria-posinset and aria-setsize are supplied — the usual case for virtualized lists — position and count are announced even though not every row is in the DOM. An item with onAction is announced as an interactive element, and activation is reported through the resulting change rather than through a role change on the row. Selection state is announced from aria-selected, so the checkmark slot should be treated as a visual reinforcement of that state rather than the only carrier of it. An item with disabledSelection is skipped by selection announcements but remains readable, and it is announced as unavailable for selection rather than as a fully disabled control. Because row content is arbitrary, the accessible name comes from the row's text content, so decorative leading visuals should not contribute noise to the name.

## Styling

All visual customization should flow through the root slot, which is the element that receives layout, padding, and state styles; the checkmark slot is a separate element you can also target when the default selection indicator needs to be recolored or resized. Use Griffel tokens rather than literal values: tokens.colorNeutralBackground1 for the resting row, tokens.colorNeutralBackground1Hover for hover, tokens.colorNeutralBackground1Pressed for press, and tokens.colorNeutralBackground1Selected with tokens.colorNeutralForeground1Selected for the selected state. Disabled rows read correctly with tokens.colorNeutralForegroundDisabled and tokens.colorNeutralBackgroundDisabled. Focus should be drawn with tokens.colorStrokeFocus2 at tokens.strokeWidthThick so that it stays visible on dark and high-contrast themes. Selection indicators commonly use tokens.colorCompoundBrandForeground1 or tokens.colorBrandForeground1 against the row background. For spacing and rhythm use tokens.spacingHorizontalM, tokens.spacingHorizontalL, tokens.spacingVerticalS, tokens.spacingVerticalMNudge, and tokens.spacingHorizontalSNudge; for shape use tokens.borderRadiusMedium, and for typography tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.fontSizeBase200 for secondary lines, tokens.fontWeightSemibold for emphasized rows, and tokens.lineHeightBase300. Interaction feedback should be animated with tokens.durationFaster and tokens.curveEasyEase so motion matches the rest of the system, and secondary metadata inside the row should use tokens.colorNeutralForeground2 or tokens.colorNeutralForeground3 to establish hierarchy without changing font size everywhere.

## Performance

ListItem is a thin wrapper around its root and checkmark slots, so it adds no extra DOM layers beyond what you author — the cost of a list is almost entirely the row content and the number of rows mounted. Keep the row subtree shallow, avoid recreating style objects on every render, and keep onAction handlers referentially stable so rows don't re-render when unrelated list state changes. When items are rendered from a mapped collection, extract a memoized row component keyed by the item's stable value rather than memoizing inline markup, and never key rows by index in a list that can be reordered or filtered. For long lists, render only what is visible — the position and size information that assistive technology needs can be carried by aria-posinset and aria-setsize while off-screen rows stay unmounted. The checkmark slot only renders when it is provided, so avoid conditionally swapping between two entirely different row structures for selected and unselected states; keep one structure and toggle presentation. Avoid animating layout properties on rows inside a scrolling list, since that forces layout work on every scroll frame; restrict transitions to color, background, and opacity tokens like tokens.durationFaster.

## Theming & Tokens

ListItem inherits everything from the nearest FluentProvider, so a single provider swap re-themes every row. The neutral ramp — tokens.colorNeutralBackground1 for the resting row, plus the hover, pressed, and selected variants, tokens.colorNeutralForeground1 for primary text, tokens.colorNeutralForeground2 and tokens.colorNeutralForeground3 for secondary text, and tokens.colorNeutralForegroundDisabled with tokens.colorNeutralBackgroundDisabled for unavailable rows — is remapped by each theme (webLightTheme, webDarkTheme, teamsLightTheme, teamsDarkTheme, webHighContrastTheme), which is why token usage is required rather than recommended. In high contrast the neutral tokens resolve to system colors, so contrast is preserved automatically as long as you don't hardcode values. Selection indicators typically pull from tokens.colorCompoundBrandForeground1 or tokens.colorBrandForeground1, which follow the brand ramp defined by the theme's brand variant. Focus visuals should use tokens.colorStrokeFocus2 with tokens.strokeWidthThick, since that pair is specifically tuned to remain visible against both light and dark surfaces. Typography comes from tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300, so a global type-scale change propagates to every row without touching the component.

## Migration Notes

In v9 the list is compositional: ListItem elements are rendered as ordinary React children of List instead of being produced from a data array with render callbacks, so per-row markup is authored directly and there is no separate row-rendering function to keep in sync with the data shape. Selection is declared per item through the value prop rather than inferred from index, which makes selection resilient to sorting and filtering. Actionability is opt-in through onAction instead of being implied by an onClick handler, so each row's interactive behavior is explicit. The built-in checkmark slot replaces ad-hoc selection icons, which means custom selection visuals from earlier implementations should be deleted rather than restyled, and disabledSelection is the supported way to express "visible but not selectable" rather than applying a disabled-looking style by hand. Any callback-based row rendering that referenced list data should be rewritten as a mapped set of ListItem children with stable values.

## Edge Cases

- A row with both onAction and disabledSelection is still activatable but cannot be picked by the list's selection logic; that combination is valid but must be explained in the row's text so users don't assume it is fully disabled.
- The checkmark slot can be provided even when the surrounding list isn't tracking selection, which renders a selection affordance that nothing can change — provide it only where selection actually exists.
- A ListItem rendered outside of a list parent loses its collection context and will not announce position, count, or the fact that sibling items exist.
- Duplicate values across rows make selection resolution non-deterministic — the highlight or checkmark can land on a different row than the one the user activated, especially after sorting or filtering.
- Index-derived values silently break the moment the collection is reordered; the selection survives the re-render but points at the wrong entity.
- Very long row text can push trailing metadata out of the row and force wrapping that changes row height; constrain the flexible text region so rows keep a predictable height.
- Rows that contain only an icon or an image have no text-derived accessible name, so an explicit label is required for anything actionable.
- In virtualized lists, rows that are unmounted lose their DOM state; position and set size must be conveyed programmatically so the announced count stays accurate.

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
