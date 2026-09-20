# Tab

> **Package**: `@fluentui/react-tabs` v9.12.2
> **Import**: `import { Tab } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

Tab is a single selectable tab stop that lives inside a TabList and represents one view or section of related content. It renders as an interactive, focusable control whose selection is driven entirely by the required value prop — the Tab itself does not decide whether it is selected; the owning TabList does. Tab exposes three slots: root (the interactive element), icon (an optional leading glyph rendered before the label), and content (where the visible label is placed, preferably via children rather than the children property on the slot). Because selection is coordinated, a TabList groups several Tabs into one keyboard-navigable set with roving focus and an animated selection indicator, and Tab carries the disabled prop to opt an individual tab out of interaction.

**When to use**: Use Tab when you are building a tab set that switches between peer views of the same context — for example, profile sections, settings categories, or different representations of one record. Tab only makes sense inside a TabList; a lone Tab has no selection context, no roving focus, and no valid tab set semantics. Prefer Tab when the set of destinations is small (roughly two to seven), mutually exclusive, and visible at once, and when the user should be able to see the other available views. Choose Nav or NavItem when the destinations are app-level routes rather than sibling views of one object, Breadcrumb when you are showing hierarchy and return paths, Link when the action is a pure hyperlink, Menu when the options should stay hidden until requested, and ToggleButton or Switch when a single control should toggle state in place instead of switching the whole content region.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean \| undefined` | `false` | No | A tab can be set to disable interaction. |
| `value` | `unknown` | — | Yes | The value that identifies this tab when selected. |

### Prop Guidance

- **value**: Required. This is the identity the owning TabList compares against to decide which Tab is selected, so it must be unique within the set and should be stable across renders. Prefer primitives such as strings or numbers, because the value type is intentionally open and non-primitive values are matched by identity rather than deep equality. When a tab is selected or activated, this is the value reported back to the parent's selection handler. `overview`
- **disabled**: Set to true when a tab's panel is not currently reachable, for example while a dependent resource is unavailable. A disabled tab still occupies its place in the set, which preserves the stability of the ordering and the indicator movement, but it cannot be selected and should be used sparingly so the set does not read as mostly broken. Defaults to false, so omit it for normal tabs. `true`
- **icon**: Optional slot rendered before the content. Use it for the leading glyph so the glyph participates in the component's internal layout and spacing rather than being concatenated into the label text, and pass slot properties such as a className to tune spacing. Because the icon is decorative alongside a text label, it should stay visually subordinate to the label; when there is no text label at all, add an accessible name to the root. `An icon element rendered before the label`
- **content**: Required slot that holds the visible label of the tab. Pass the label as component children rather than through the children property on this slot, since children are placed here automatically and the slot-property form is discouraged. The rendered text becomes the tab's accessible name, so keep it short, unique within the set, and descriptive of the panel it reveals. `Settings`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `content` | — | Yes | Component children are placed in this slot Avoid using the `children` property in this slot in favour of Component children whenever possible. |
| `icon` | — | No | Icon that renders before the content. |
| `root` | — | Yes | Root of the component. |

## Best Practices

### Do's

- Always render Tab inside the TabList that owns the selection state so the tab set gets role tablist, the Tabs get role tab, and arrow-key navigation plus roving focus work as expected.
- Give every Tab a unique, stable value that the owning TabList can compare against its selected value; use a primitive such as a string or number whenever possible.
- Write the visible label in the content slot (as component children) so the accessible name is derived from the rendered text without extra ARIA wiring.
- Use the icon slot for the leading glyph instead of baking icon markup into the label text, so the icon participates in the component's layout and spacing tokens.
- Keep labels short, parallel in structure, and descriptive of the panel they reveal — for example "Overview", "Activity", "Settings" — so screen reader users hear predictable names.
- Reserve disabled for tabs whose panel is genuinely unavailable, and keep the count of disabled tabs low so users do not read the tab set as broken.
- Keep the tab order stable across renders so the animated selection indicator moves predictably and users can build positional memory.
- When a tab contains only an icon and no text, supply an accessible name on the root so the tab is not announced as an empty button.

### Don'ts

- Do not use Tab as a generic action button or as a router link — navigation between distinct pages belongs in Link, Nav, or Breadcrumb.
- Do not manually set role, aria-selected, or tabindex on a Tab; the owning TabList manages these and manual values break roving focus and screen reader state.
- Do not reuse the same value for two Tabs in the same TabList, because selection, focus, and the indicator will resolve to the wrong tab.
- Do not render Tabs outside of a TabList, and do not nest TabLists in a way that lets two tab sets share overlapping values.
- Do not nest another interactive control such as a Button or Link inside the content slot; interactive content inside a tab is not reachable in a predictable way.
- Do not convey the selected tab through color alone — the built-in indicator and aria-selected state must remain visible and measurable.
- Do not repurpose Tab for turning a feature on and off in place; that is a ToggleButton or Switch concern.
- Do not override the selection indicator's geometry or animation with arbitrary CSS, since the sliding movement is part of how selection is communicated.

## Anti-Patterns

### Tab rendered without a TabList

❌ A standalone Tab has no owning tab set, so it receives no role tablist context, no roving focus, and no coordinated selected state. Selection logic and arrow-key movement cannot work, and screen readers hear an isolated control rather than a position within a set.

✅ Always place Tab inside the TabList that owns the selected value, and let that container manage selection; if you only need a single selectable control, use Button or ToggleButton instead.

### Hand-managing role, aria-selected, and tabindex

❌ Manually assigning ARIA state or tabindex to a Tab conflicts with the values the TabList writes, producing a control that announces one state while behaving as another and breaking the single-tab-in-the-tab-order contract.

✅ Let the components own their semantics. Express selection only through the value prop and the TabList's selected value, and use the disabled prop rather than aria-disabled to mark unavailable tabs.

### Duplicated or unstable values

❌ When two Tabs in the same set share a value, or when values are regenerated on every render, the TabList cannot tell which Tab is selected. Selection and the animated indicator can land on the wrong tab, and users see the highlight jump unexpectedly.

✅ Assign each Tab a unique value that is derived from stable data, such as a section identifier, and keep the set's ordering stable so the indicator movement stays predictable.

### Using Tab as navigation or as a toggle

❌ Treating Tab as a router link for unrelated pages, or as an in-place on/off switch, misrepresents the relationship between the control and its content and misleads assistive technology about what activation will do.

✅ Use Link, Nav, or Breadcrumb for cross-page destinations, and ToggleButton or Switch for binary state that changes in place. Keep Tab for switching between peer views of the same context.

### Embedding interactive controls in the label

❌ Buttons, links, or inputs nested inside a Tab's content slot create an interactive region inside an already interactive control, which is confusing to announce and awkward to reach with the keyboard.

✅ Keep the content slot to text and non-interactive decoration. Move secondary actions into the panel the tab reveals, or into a nearby toolbar or menu.

## Accessibility

**Requirements**: Tab must be rendered inside a TabList so that the container exposes role tablist and each Tab exposes role tab. Exactly one Tab in the set should be selected at a time, so the selected value managed by the TabList must match exactly one Tab's value. The panel revealed by a tab should be associated with it through aria-controls (on the tab) and aria-labelledby (on the panel), and the panel should carry role tabpanel. Disabled tabs must expose an unavailable state rather than silently ignoring clicks. The tab set must be reachable and operable by keyboard alone, and the selected state must not rely on color alone — the contrast of the indicator and label against the surrounding surface must meet WCAG 1.4.3 and 1.4.11. Icon-only tabs require an accessible name, and tab labels should stay within a length that a screen reader can announce comfortably.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the tab set (landing on the selected tab) or out of it to the next focusable element; only one Tab in the set is in the tab order at a time. |
| `ArrowRight` | Moves focus to the next tab in a horizontal tab set, wrapping at the end, and updates selection. |
| `ArrowLeft` | Moves focus to the previous tab in a horizontal tab set, wrapping at the start, and updates selection. |
| `ArrowDown` | Moves focus to the next tab in a vertical tab set and updates selection. |
| `ArrowUp` | Moves focus to the previous tab in a vertical tab set and updates selection. |
| `Home` | Moves focus to the first tab in the set. |
| `End` | Moves focus to the last tab in the set. |
| `Enter` | Activates the focused tab when the set requires explicit activation. |
| `Space` | Activates the focused tab when the set requires explicit activation. |

**ARIA**: role=tab on each Tab root (supplied by the component), role=tablist on the owning TabList container, aria-selected reflecting whether this Tab's value matches the selected value of the set, aria-disabled on Tabs rendered with the disabled prop, aria-controls pointing from the Tab to the id of the panel it reveals, role=tabpanel and aria-labelledby on the content region that the Tab reveals, aria-label or aria-labelledby on the Tab root when the label is only an icon, tabindex managed as a roving value so only the selected tab is reachable with Tab

**Screen Reader**: Screen readers announce each Tab with its role, its accessible name taken from the content slot, its position within the set ("2 of 4"), and its selected or unselected state, so users can understand both what the tab is and where they are in the group. Moving with the arrow keys announces the newly focused tab and its selection state, which makes the automatic selection change audible. Tabs rendered with disabled are announced as unavailable and cannot be selected. When the user activates a tab, focus moves to or stays on the tab while the associated tabpanel is announced with its accessible name from aria-labelledby, and the panel's content is then read on subsequent navigation.

## Styling

Style Tab through the className on the root slot and through per-slot styling on the icon and content slots, which accept slot props including their own className. For example, pass a className to the icon slot to adjust spacing to the label with tokens.spacingHorizontalXS or tokens.spacingHorizontalSNudge instead of editing the label text. For the label, tokens.fontSizeBase300, tokens.fontWeightRegular, and tokens.fontWeightSemibold are the realistic levers for size and emphasis, and tokens.lineHeightBase300 keeps the tab height stable. Tab inherits its appearance from the surrounding TabList, so adjust the container's appearance and the surrounding surface rather than fighting individual tabs. The animated selection indicator drawn by Tab is best left alone; if you must match it to a brand surface, target the indicator token value (tokens.colorCompoundBrandForeground1 or tokens.colorNeutralForeground2BrandSelected depending on the appearance in use) instead of overriding geometry, and keep the animation timing aligned with tokens.durationNormal and tokens.curveEasyEase so the sliding motion stays consistent with the rest of the design system.

## Performance

Tab itself is a lightweight, button-based control, so its own render cost is negligible; the cost in a tab set comes from the panels the application mounts around it. Render panel content lazily and unmount heavy panes that are not selected, since Tabs do not mount or unmount panels on your behalf. Keep the icon slot content simple — small inline SVGs or memoized icon components — because every tab re-renders the icon on each selection change, and complex icon trees multiply across a set. Avoid recreating inline objects for the icon and content slots on every render, since new slot object identities defeat memoization of the Tab. Finally, because the selection indicator animates between tab positions, very wide tab sets that require scrolling can make the movement less legible; prefer keeping the set within the available width or restructuring the information.

## Theming & Tokens

Tab consumes Fluent theme tokens for all of its states rather than hard-coded colors. The resting label uses tokens.colorNeutralForeground2, the hover state uses tokens.colorNeutralForeground2Hover, the pressed state uses tokens.colorNeutralForeground2Pressed, and the selected label uses tokens.colorNeutralForeground2Selected or tokens.colorNeutralForeground2BrandSelected depending on the appearance inherited from the TabList. The animated selection indicator is drawn with the compound brand stroke token, tokens.colorCompoundBrandForeground1, and its motion follows tokens.durationNormal and tokens.curveEasyEase. Disabled tabs fall back to tokens.colorNeutralForeground2Disabled. Spacing around the label and icon uses tokens.spacingHorizontalS, tokens.spacingHorizontalMNudge, and tokens.spacingVerticalSNudge, while typography uses tokens.fontSizeBase300, tokens.lineHeightBase300, tokens.fontWeightRegular, and tokens.fontWeightSemibold. Changing a theme through FluentProvider therefore restyles the whole tab set — including hover, pressed, and selected states — without touching individual Tabs.

## Migration Notes

In Fluent UI React v8 the equivalent API was the Pivot and PivotItem pair with headerText and itemIcon. In v9 the container becomes TabList and each item becomes a Tab whose identity is the required value prop rather than an item key, with the label placed in the content slot and the leading glyph in the icon slot. Selection is no longer expressed by a link or index on the item itself; the owning TabList controls the selected value and notifies through its selection callback, so any logic that previously compared a key inside the item must move to the parent. The disabled prop carries over, but attributes such as role, aria-selected, and tabindex that were sometimes applied by hand in v8 are now owned by the components and should be removed from application code.

## Edge Cases

- The value prop is typed as unknown, so non-primitive values are matched by identity; passing a freshly created object or array on every render makes the tab appear to never stay selected.
- Every Tab in a set must have a value, and duplicates within the same TabList are not resolved deterministically — the selected state and indicator may attach to an unintended tab.
- Tab does not render or manage the content panel; the application is responsible for showing the matching panel, so a selected tab whose panel is not rendered leaves users with an apparently empty region.
- A disabled tab keeps its position in the set, which preserves ordering but also means arrow-key navigation and the visual indicator must move across it.
- Large tab sets can exceed the available width; wrap or restructure rather than letting the tab set clip, because clipped tabs become unreachable by pointer.
- Icon-only tabs have no text to derive an accessible name from, so an explicit accessible name on the root is required for them to be announced meaningfully.
- Placing interactive elements inside the content slot produces nested interactive content that is difficult to reach and confusing to announce.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
