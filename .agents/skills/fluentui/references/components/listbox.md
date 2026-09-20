# Listbox

> **Package**: `@fluentui/react-combobox` v9.17.2
> **Import**: `import { Listbox } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Listbox is the low-level primitive that owns listbox semantics and keyboard focus management for a collection of options. It renders a single root slot as a div carrying the listbox role and is intended to be composed with option children (Option, OptionGroup) rather than used as a standalone visual control. Because it is a primitives-level component, it does not impose its own selection model, popup, or chrome: the caller supplies the option children, the selected state, and the surrounding layout, while Listbox handles the composite-widget plumbing — the container role, mount focus behavior, and the arrow-key navigation model that keeps a single tab stop for the whole set of options. Its only public prop, disableAutoFocus, lets consumers opt out of focusing the first item on mount, which matters when the listbox is mounted inside a popup, dialog, or a page section that must retain focus elsewhere. It is the same building block that richer pickers such as Combobox, Dropdown, and TagPicker rely on, and it is the right choice when those components' built-in trigger, filtering, or display-value behavior does not fit your scenario.

**When to use**: Use Listbox when you need a custom selection surface whose option rendering, selection state, or surrounding container is not expressible with Dropdown, Combobox, Select, or TagPicker — for example an always-visible picker embedded in a page, a command-like option list inside a Popover, or a grouped multi-column option layout. Reach for the higher-level pickers instead when you need standard behaviors such as a trigger button, an editable input with filtering, a selected-value display, or multi-select chips, since those components already compose Listbox internally. Avoid Listbox when the content is not really a set of selectable options (navigation links, static content, or a single checkbox-like choice); use Nav, List, or the appropriate form control instead.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disableAutoFocus` | `boolean \| undefined` | `false` | No | Disable auto-focusing on the first item when mounting. |

### Prop Guidance

- **disableAutoFocus**: Defaults to false, meaning the Listbox focuses the first item when it mounts. Set it to true whenever the component appears inside a Popover, Dialog, Drawer, or an inline form where another element owns the initial focus, or when mounting the listbox should not scroll the page or steal focus from a trigger. Keep it false for a listbox that is the primary interactive surface of the view and should be immediately navigable by keyboard. `false`
- **root**: The only slot. It renders a div with the listbox role and is where you apply className, style, id, and any layout or scroll styling, as well as the accessible name wiring through aria-label or aria-labelledby. Never replace its role or wrap it in another element that introduces conflicting list semantics. `root div with role of listbox`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | The root slot, a `<div>` with `role="listbox"` |

## Best Practices

### Do's

- Give every listbox an accessible name by applying aria-label or aria-labelledby (for example through a Field and Label) so assistive technology announces the purpose of the option set rather than just the count.
- Author the children as Option and OptionGroup instances so that option roles and selection state line up with the container's listbox role.
- Set disableAutoFocus to true when the Listbox is mounted inside a popup, dialog, or inline page region where focus should stay on the trigger or a different element when the component appears.
- Constrain long option lists with a max height and a single scroll container so arrow-key navigation scrolls the list itself rather than the entire page.
- Keep each option value stable and unique across renders so focus and selection tracking do not jump between items when data is recomputed.
- Compose the Listbox with Popover and Portal when it is a transient picker, and return focus to the element that opened it when the picker closes.
- Leave keyboard interaction to Listbox and its option children, adding only the handlers that fall outside its scope (such as dismissing an enclosing popup on Escape).

### Don'ts

- Don't override or replace the role that the root slot already applies, and don't add roles that conflict with listbox semantics.
- Don't place focusable or interactive controls (buttons, links, checkboxes, switches) inside options; they break the single-tab-stop model of a composite listbox.
- Don't use Listbox as a generic scrollable or layout container for content that is not a set of options.
- Don't nest a Listbox inside another listbox or inside an option, which produces nested composite widgets that assistive technology cannot describe.
- Don't write your own arrow-key or Home/End handling that duplicates or competes with the built-in navigation.
- Don't rely on the default focus-on-mount behavior when the surrounding overlay or form has its own focus plan.
- Don't ship an empty or option-less listbox, and don't leave options without readable text labels.

## Anti-Patterns

### Using Listbox as a generic container

❌ The root always announces itself as a listbox, so putting non-option content such as paragraphs, images, or buttons inside it produces an empty or misleading option set for assistive technology users.

✅ Use Listbox only for a real set of selectable options, and choose a plain layout element, List, or Card for presentation-only content.

### Fighting the built-in focus model

❌ Adding custom arrow-key handlers or manual focus calls on options duplicates the component's navigation and can leave two items looking focused or trap keyboard users between two competing handlers.

✅ Let Listbox own arrow, Home, End, Enter, and Space behavior, and manage only the focus decisions that belong to the surrounding surface, using disableAutoFocus when the component must not take focus on mount.

### Embedding interactive controls inside options

❌ Buttons, links, checkboxes, or switches nested inside an option create additional tab stops and roles inside a composite widget, breaking the single-tab-stop expectation and confusing screen reader output.

✅ Keep option content to text, icons, avatars, and other non-focusable decoration; expose row-level actions outside the listbox or through a separate menu surface.

### Relying on mount autofocus in overlays

❌ When a listbox mounted inside a popup or dialog grabs focus by default, users can be pulled out of the flow of the surrounding surface, and the page may scroll unexpectedly to the list.

✅ Set disableAutoFocus to true and let the popup, dialog, or page own the initial focus and restoration plan.

### Rendering unbounded option sets without windowing

❌ Listbox renders every child you give it, so very large datasets create a heavy DOM, slow arrow-key navigation, and long initial paint times.

✅ Filter, paginate, or virtualize the option data before passing it in, and cap the visible region with a max height.

## Accessibility

**Requirements**: The root slot must keep its listbox role; removing or overriding it invalidates the widget for assistive technology. Every listbox must expose an accessible name via aria-label or aria-labelledby — an unnamed listbox is announced only as an anonymous list. The widget must remain fully operable by keyboard (WCAG 2.1.1), preserve meaningful sequence and relationships between the container, groups, and options (1.3.1), expose name, role, and value for each option (4.1.2), and keep a visible focus indicator on the active option with sufficient non-text contrast (2.4.7 and 1.4.11). Verify that text and icons inside options meet 4.5:1 and 3:1 contrast respectively in rest, hover, selected, and disabled states, that the tab sequence reaches and leaves the listbox in a logical order (2.4.3), and that pointer targets are large enough for the option rows (2.5.8).

| Key | Action |
| --- | --- |
| `ArrowDown` | Moves the active option to the next option in the list, scrolling it into view. |
| `ArrowUp` | Moves the active option to the previous option in the list, scrolling it into view. |
| `Home` | Moves the active option to the first option in the list. |
| `End` | Moves the active option to the last option in the list. |
| `Enter` | Activates the currently active option, which selects it when the caller's option children implement selection. |
| `Space` | Activates the currently active option, matching the Enter behavior. |
| `Tab` | Moves focus out of the listbox to the next tab stop in the page. |
| `Shift+Tab` | Moves focus out of the listbox to the previous tab stop in the page. |
| `Character keys` | Typing a printable character moves the active option to the next option whose label starts with that character, allowing type-ahead navigation. |
| `Escape` | Not consumed by the listbox itself; when the listbox is hosted in a Popover or Dialog, that overlay is responsible for dismissing and restoring focus to the trigger. |

**ARIA**: role: listbox — pre-applied by the root slot and must not be changed, aria-label — supplies the accessible name when no visible label element is available, aria-labelledby — points at a visible Label or heading that names the listbox, aria-activedescendant — conveys the active option when the implementation keeps DOM focus on the container rather than moving it between options, role: option — applied to each option child so the container has describable descendants, aria-selected — exposes the selected state of each option, aria-disabled — exposes options that are present but not selectable, role: group with its own label — used by OptionGroup to describe sections of options

**Screen Reader**: Screen readers announce the container as a listbox together with its accessible name and the number of options, then announce the focused option's label, position in the set, and selected state as arrow keys move the active item. Because the whole widget is a single tab stop, users hear one listbox rather than a series of unrelated controls, and selection changes are reported as state changes on the active option. In a popup-hosted listbox, focus typically moves into the popup when it opens and back to the trigger when it closes, so the trigger and the listbox should each be named so the context is clear after the transition. An unnamed listbox or an option without readable text produces announcements such as an unlabeled list and forces users to guess the purpose of the control.

## Styling

Listbox ships without visual styling, so all appearance comes from the option children and the surrounding layout. Apply styles through the root slot's className, and use Griffel makeStyles so values resolve against the theme. Constrain the scroll region with maxHeight, overflowY, borderRadiusMedium, and a subtle border such as colorNeutralStroke1; give rows padding with spacingVerticalXS and spacingHorizontalS so hit targets are comfortable. Use colorNeutralBackground1 for the list surface, colorNeutralBackground1Hover for row hover, and colorNeutralBackground1Selected or colorBrandBackground2 for the selected row, with colorNeutralForeground1 and colorNeutralForeground1Selected for matching text. Focus rings should use colorStrokeFocus2 with a small outline offset so the indicator remains visible over hover and selected backgrounds. Typography typically uses fontFamilyBase with fontSizeBase300 and lineHeightBase300. Separate groups with colorNeutralStroke2 dividers and give grouped sections a small header styled with colorNeutralForeground2 so they do not read as tappable options.

## Performance

Listbox renders exactly the children it receives and has no internal virtualization, so option count directly drives DOM size and keyboard navigation cost. For large datasets, filter or window the data before rendering, and avoid rebuilding the option array on every render because each option re-renders with it. Keep option content cheap (text, icon, avatar rather than nested components), hoist event handlers and style objects, and avoid placing a listbox inside a container that re-renders frequently, such as a controlled input's parent, since every keystroke that changes the option list forces a full reconciliation of the list. Mounting a listbox with autofocus can also trigger a scroll and layout pass, so using disableAutoFocus in overlays avoids that work when focus is managed elsewhere.

## Theming & Tokens

Listbox produces no theme-driven visuals of its own; it inherits the text and surface colors of its container and passes context down to the option children, which resolve their own tokens. When styling the root slot, prefer theme tokens so light, dark, and high-contrast themes stay correct: colorNeutralBackground1 and colorNeutralBackground1Hover for the surface and row hover, colorNeutralBackground1Selected or colorBrandBackground2 with colorNeutralForeground1Selected for selection, colorNeutralForeground1 and colorNeutralForeground2 for primary and secondary text, colorNeutralStroke1 and colorNeutralStroke2 for borders and group dividers, colorStrokeFocus2 for focus indicators, colorNeutralForegroundDisabled with colorNeutralBackgroundDisabled for disabled options, plus borderRadiusMedium, spacingVerticalXS, spacingHorizontalS, fontFamilyBase, fontSizeBase300, and lineHeightBase300 for shape and rhythm. Text direction comes from FluentProvider, so use logical spacing and alignment helpers rather than hard-coded left and right values, and note that high-contrast behavior is driven by the same token values.

## Migration Notes

Fluent UI React v8 had no dedicated, standalone Listbox component in its stable surface; listbox semantics were produced indirectly by Dropdown and List-based pickers that owned their own option rendering and selection state. In v9 the primitive is extracted: the root slot is a plain div carrying the listbox role, and the component exposes only disableAutoFocus, with options supplied as children (Option, OptionGroup). When porting, move selection state and the selected-value display to your own component or to the higher-level picker that wraps the Listbox, rebuild the option markup with the v9 Option components, and translate any styles that targeted the old picker root into a className on the Listbox root slot. Code that previously relied on focus being placed automatically should be reviewed, because focus-on-mount is now an explicit, opt-out behavior.

## Edge Cases

- Autofocus on mount can scroll the page to the listbox and pull focus away from a trigger or form field; use disableAutoFocus in overlays and inline layouts that already have a focus target.
- An empty listbox renders the listbox role with zero options, which screen readers announce as an empty list; show a non-option empty-state message and keep the accessible name on the container.
- Option values must be unique and stable; duplicated or regenerated values cause focus and selection to land on the wrong row after data updates.
- When the listbox is taller than its container, ensure the scroll region is the listbox itself so arrow-key navigation does not scroll the surrounding page, and confirm the active row is always scrolled into view.
- Grouped options need their own labels on the group role; an unlabeled group makes sections indistinguishable when navigating by screen reader.
- A listbox hosted in a Popover or Portal should return focus to the element that opened it on close, otherwise keyboard users are dropped at the top of the document.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
