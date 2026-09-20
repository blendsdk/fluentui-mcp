# TagPickerList

> **Package**: `@fluentui/react-tag-picker` v9.8.8
> **Import**: `import { TagPickerList } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

TagPickerList is the dropdown surface component of the TagPicker family. It renders the popup layer that appears beneath TagPickerControl when the picker is expanded, and it is the container into which the selectable options — TagPickerOption and TagPickerOptionGroup — are placed. Because it is a container rather than an interactive control itself, it holds a single root slot and exposes essentially no public API of its own: the behavior, selection semantics, and focus management come from the TagPicker parent and from its Listbox-based contents. TagPickerList is used together with TagPicker, TagPickerControl, TagPickerGroup, TagPickerInput, TagPickerButton, TagPickerOption, and TagPickerOptionGroup to compose the full multi-select picker experience.

**When to use**: Use TagPickerList whenever you assemble a TagPicker and need the expanded suggestion surface — that is, whenever the user should be able to type or trigger a search and then pick from a filtered list of options. It is required for TagPicker scenarios that show options (as opposed to a picker that only displays already-selected tags). Use it as a child of TagPicker, sibling to TagPickerControl, with TagPickerOption and TagPickerOptionGroup children inside it. Do not use TagPickerList as a standalone dropdown: for a single-value or freeform suggestion experience use the Listbox, Combobox, Dropdown, or Option components directly instead, and for a generic floating panel use Popover and PopoverSurface.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disableAutoFocus` | `boolean \| undefined` | — | No | **Deprecated** |

### Prop Guidance

- **disableAutoFocus**: Deprecated. It controlled whether the list surface automatically received focus when it appeared; new implementations should rely on the TagPicker's own focus management (focus stays in the input while the active option is tracked) and leave this prop unset. `true`
- **root**: The required root slot is the element that renders the popup list surface. Use its className to bound height and enable scrolling, and to apply theme-aware styling; do not use it to relocate or reparent the popup, since positioning is coordinated with the TagPicker. `className={styles.tagPickerList}`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Place TagPickerList inside a TagPicker, directly after TagPickerControl, so the picker can wire up expansion, focus, and dismissal behavior.
- Populate TagPickerList with TagPickerOption children (optionally grouped with TagPickerOptionGroup) so the surface is a proper Listbox and keyboard navigation works.
- Give the list a bounded height through styling on the root slot so long option sets scroll inside the popup instead of overflowing the viewport.
- Keep option labels short and match them to the text that the TagPickerInput filters on, so users can predict which tag a given option produces.
- Render the list only as part of the TagPicker composition — let the parent control when it is visible rather than toggling it independently.
- Provide a clear empty-state option when a filter matches nothing, so the user is not confronted with a blank panel.

### Don'ts

- Do not put arbitrary non-option content (buttons, forms, marketing copy) inside TagPickerList; it is a listbox surface, and stray interactive children break arrow-key navigation.
- Do not render TagPickerList outside of a TagPicker — focus handling, expansion state, and dismissal are owned by the parent and will not be correct.
- Do not rely on the deprecated disableAutoFocus prop for new code; it exists only for backwards compatibility and its behavior can change.
- Do not give the list an unbounded height with many options; the popup will grow past the viewport and become unreachable.
- Do not add your own click-outside or Escape handling to TagPickerList; the picker already manages dismissal and duplicate handlers cause double-close or lost state.
- Do not style the root slot in ways that clip or reposition it relative to the control — shadow, border radius, and stacking are deliberately coordinated with the popup layer.

## Anti-Patterns

### Rendering the list outside of TagPicker

❌ TagPickerList depends on the surrounding TagPicker for expansion state, focus return, and dismissal. Rendered standalone it either never appears or appears with the wrong positioning and no keyboard integration.

✅ Always render TagPickerList as a child of TagPicker, immediately after TagPickerControl, and let the parent govern its visibility.

### Using the list as a generic popup container

❌ Putting links, buttons, or form fields inside TagPickerList breaks the listbox contract: arrow-key navigation, typeahead, and option counting all become misleading for assistive technology.

✅ Keep the surface to TagPickerOption and TagPickerOptionGroup children; if you need arbitrary content in a floating panel, use Popover with PopoverSurface instead.

### Depending on the deprecated disableAutoFocus prop

❌ The prop is deprecated, so its behavior is not guaranteed across releases, and using it papers over focus problems that are better solved by the picker's built-in focus handling.

✅ Leave disableAutoFocus unset and rely on TagPicker and TagPickerInput to manage focus while the active option is communicated through aria-activedescendant.

### Unbounded list height with large option sets

❌ Without a max-height on the root slot, a long filtered or unfiltered option set grows the popup beyond the viewport, so later options cannot be scrolled to and the popup may be clipped by the window.

✅ Constrain the root slot with a maximum height and vertical scrolling, and consider truncating or virtualizing very large option collections before they reach the list.

## Accessibility

**Requirements**: TagPickerList must be rendered as part of the TagPicker composition so the control/list relationship is intact: the trigger must expose an expanded state and point at the popup, and the list contents must be real options, not plain text. Option labels must be meaningful when read in isolation, because screen readers announce an option without necessarily re-announcing the surrounding label. The list must remain usable at 200% zoom and with long option labels wrapping, and color contrast for option text and the highlighted/selected state must meet WCAG AA (4.5:1 for body text).

| Key | Action |
| --- | --- |
| `ArrowDown` | Moves focus to the next option in the list; from the input, opens or moves into the list. |
| `ArrowUp` | Moves focus to the previous option in the list. |
| `Home` | Moves focus to the first option in the list. |
| `End` | Moves focus to the last option in the list. |
| `Enter` | Selects the currently highlighted option and adds it as a tag. |
| `Space` | Toggles selection of the currently highlighted option in the multiselect picker. |
| `Escape` | Closes the list and returns focus to the TagPicker input. |
| `Tab` | Closes the list and moves focus to the next focusable element after the picker. |
| `Printable characters` | When focus is in the input, continues filtering the options; when focus is on the list, typeahead moves to the next matching option. |

**ARIA**: role="listbox" on the list contents, aria-multiselectable for multi-select pickers, aria-activedescendant while focus stays on the input, aria-labelledby linking the list to the field label, aria-expanded on the trigger that controls the list, aria-controls pointing from the trigger to the list

**Screen Reader**: Screen readers treat the surface as a listbox: they announce the number of available options and the current option as the user arrows through them, and they announce selection state as tags are added or removed. Because focus generally stays in the TagPickerInput while the active option is conveyed via aria-activedescendant, the screen reader reports each highlighted option as the user types, giving a live filtering experience without moving DOM focus into the popup.

## Styling

TagPickerList exposes only a root slot, so all visual customization targets that slot: pass a className to control the popup's max-height and scrolling, e.g. a maximum height combined with an overflow-y of auto so long option sets scroll. The surface already consumes theme tokens — background from tokens.colorNeutralBackground1, elevation from tokens.shadow16 (with tokens.colorNeutralShadowAmbient and tokens.colorNeutralShadowKey), border radius from tokens.borderRadiusMedium, and outer padding from tokens.spacingVerticalXS and tokens.spacingHorizontalXS. For consistent internal rhythm, set option padding with tokens.spacingVerticalS and tokens.spacingHorizontalM, and use tokens.colorNeutralBackground1Hover for hovered options and tokens.colorNeutralBackground1Selected or tokens.colorBrandBackground2 for the selected/active option. Never hard-code hex colors; override through tokens.colorNeutralStroke2 for the popup border and tokens.colorNeutralForeground1 for option text so dark and high-contrast themes keep working.

## Performance

TagPickerList is a lightweight container, so cost is dominated by its children: each TagPickerOption is a rendered element, and large unfiltered option sets are re-rendered on every keystroke as the input filters the list. Keep the option collection small by filtering the source data before rendering, memoize option elements so unchanged options are not recreated on each render, and avoid inline object or function props on options that would defeat memoization. Height constraints on the root slot also avoid expensive layout of an ever-growing popup. Because the list mounts and unmounts with the picker's expanded state, memoized option elements should not capture short-lived state that changes per open.

## Theming & Tokens

TagPickerList inherits its appearance from FluentProvider and the active theme. Its surface uses tokens.colorNeutralBackground1 as the popup background, tokens.shadow16 together with tokens.colorNeutralShadowAmbient and tokens.colorNeutralShadowKey for elevation, tokens.borderRadiusMedium for corner rounding, and tokens.colorNeutralStroke2 for the hairline border. Padding and internal spacing derive from tokens.spacingVerticalXS, tokens.spacingHorizontalXS, tokens.spacingVerticalS, and tokens.spacingHorizontalM. Within the list, options pick up hover and selection styling from tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Selected, and brand accents such as tokens.colorBrandBackground2 and tokens.colorBrandStroke1, with text drawn in tokens.colorNeutralForeground1 and secondary text in tokens.colorNeutralForeground2. Because these are theme tokens rather than literal values, dark, high-contrast, and custom brand themes are respected automatically, and any override you add on the root slot should also be expressed with tokens.* to preserve that behavior.

## Migration Notes

In v8 the TagPicker was a monolithic control that rendered its own suggestion dropdown internally, so the list surface was not addressable or composable. In v9 the picker is split into parts — TagPicker, TagPickerControl, TagPickerGroup, TagPickerInput, TagPickerButton, TagPickerList, TagPickerOption, and TagPickerOptionGroup — and TagPickerList is the explicit element that produces the dropdown panel. Code migrating from v8 needs to render TagPickerList and its option children directly rather than relying on a suggestions prop, and any customization that previously targeted an internal suggestions container should now be applied to the TagPickerList root slot. The disableAutoFocus prop is retained for backwards compatibility but is deprecated and should not be used in new code.

## Edge Cases

- When a filter matches no options, the list surface can render as an empty panel; render a single explanatory option or hide the list so users get feedback instead of a blank popup.
- Very long option labels can widen the popup beyond the control; constrain option text with wrapping or truncation so the surface stays aligned with the TagPickerControl.
- The list mounts only while the picker is expanded, so any state stored inside option elements resets each time the popup is reopened — keep selection state in the parent TagPicker.
- The deprecated disableAutoFocus prop should be left unset; if legacy code sets it, focus expectations may differ from the picker's current focus-return behavior on Escape.
- TagPickerList only exposes a root slot, so there is no supported way to add a header, footer, or loading indicator inside the surface — such content must be expressed as (non-selecting) option rows or moved outside the picker.
- Because the popup is positioned relative to the control, changing the root slot's margins or transforms can push it out of alignment or clip it inside a scroll container.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
