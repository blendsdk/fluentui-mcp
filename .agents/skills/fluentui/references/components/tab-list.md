# TabList

> **Package**: `@fluentui/react-tabs` v9.12.2
> **Import**: `import { TabList } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

TabList is the container component that groups a set of Tab components into a single, coordinated tab strip. It owns the shared selection state (either controlled through selectedValue or uncontrolled through defaultSelectedValue), the orientation, the size, the visual appearance, and the disabled state, and it broadcasts all of those through context so every contained Tab stays visually and behaviorally consistent. The component renders one root element that exposes the tablist role and implements roving tabindex keyboard navigation, so focus lands on exactly one tab at a time and arrow keys move between tabs. Because TabList centralizes selection, it is the single place to wire up selection change handling through onTabSelect, whether the intent is simple client-side view switching or synchronizing the selected tab with routing or fetched data. By default a selected tab is emphasized with bold text, and TabList reserves that space so tabs do not resize as selection moves unless you explicitly opt out.

**When to use**: Use TabList when users need to switch between a small number of peer views of the same content or context, and the views do not depend on each other in a sequence. It is the right choice for panels such as overview/details, settings categories, or filtered data views inside a single region, especially when switching should be fast and state-preserving. Prefer TabList over a dropdown or listbox when the set of options is small, stable, and benefits from being visible at once. Prefer Nav, NavItem, or Link instead when the destinations are actual pages or routes that should be bookmarkable and openable in a new tab. Prefer a stepped pattern (Back/Next style flow) when the content is sequential and users must complete one step before another. Use the vertical variant when the tab strip lives in a sidebar or when horizontal space is scarce, and use the size and appearance props to match the density and chrome of the surrounding surface rather than restyling individual tabs.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"transparent" \| "subtle" \| "subtle-circular" \| "filled-circular" \| undefined` | `'transparent'` | No | A tab list can supports 'transparent' and 'subtle' appearance. - 'subtle': Minimizes emphasis to blend into the background until hovered or focused. - 'transparent': No background and border styling - 'subtle-circular': Adds background and border styling - 'filled-circular': Adds background styling  The appearance affects each of the contained tabs. |
| `defaultSelectedValue` | `unknown` | — | No | The value of the tab to be selected by default. Typically useful when the selectedValue is uncontrolled. |
| `disabled` | `boolean \| undefined` | `false` | No | A tab list can be set to disable interaction. |
| `onTabSelect` | `SelectTabEventHandler \| undefined` | — | No | Raised when a tab is selected. |
| `reserveSelectedTabSpace` | `boolean \| undefined` | `true` | No | Tab size may change between unselected and selected states. The default scenario is a selected tab has bold text.  When true, this property requests tabs be the same size whether unselected or selected. |
| `selectTabOnFocus` | `boolean \| undefined` | `false` | No | When true, focusing a tab will select it. |
| `selectedValue` | `unknown` | — | No | The value of the currently selected tab. |
| `size` | `"small" \| "medium" \| "large" \| undefined` | `'medium'` | No | A tab list can be either 'small', 'medium', or 'large' size. The size affects each of the contained tabs. |
| `vertical` | `boolean \| undefined` | `false` | No | A tab list can arrange its tabs vertically. |

### Prop Guidance

- **appearance**: Controls the visual chrome of the entire strip; transparent is the default and renders no background or border, subtle minimizes emphasis so the strip blends in until hovered or focused, and the circular variants add background and border styling for pill-shaped tab sets such as subtle-circular and filled-circular. Choose based on the surface the strip sits on rather than per tab. `subtle-circular`
- **reserveSelectedTabSpace**: Defaults to true so tabs occupy the same width whether or not they are selected, which prevents the strip from shifting when the selected tab becomes bold. Set it to false only when you have deliberately removed the selected-state emphasis or when tab widths must hug their content tightly. `true`
- **defaultSelectedValue**: Use in uncontrolled mode to set which tab starts selected. Supply the same value that a corresponding Tab exposes, and do not combine it with a controlled selectedValue unless you intentionally want to switch modes. `the value of the Tab that should start selected`
- **disabled**: Disables interaction for the whole strip, which is appropriate when the entire surface is unavailable. For blocking only specific destinations, leave the list enabled and disable the individual tabs instead, since disabled tabs are skipped by arrow navigation. `false`
- **onTabSelect**: Raised when a tab is selected, and the primary place to update your own selection state or trigger side effects such as loading panel data. Read the newly selected value from the event data, and keep the handler stable so tabs do not re-render unnecessarily. `the event data carries the value of the tab that was just selected`
- **selectTabOnFocus**: Defaults to false, meaning arrow keys move focus while Enter or Space commits the selection. Set it to true for automatic activation, but only when every panel is cheap to render or fetch, because selection then changes on every arrow key press. `false`
- **selectedValue**: Use in controlled mode to drive which tab is marked selected. Always pair it with onTabSelect and update your stored value in that handler, otherwise the strip becomes unresponsive. Leaving it undefined or pointing at a value that matches no Tab results in no tab being selected. `the value of the Tab that should be selected`
- **size**: Sets the scale of the entire strip and defaults to medium; use small in dense toolbars or sidebars, medium for standard page content, and large only for prominent, low-density surfaces. The choice cascades to every contained tab. `large`
- **vertical**: Arranges tabs top to bottom and switches arrow key behavior to the Up and Down arrows, and it also affects the orientation announced to assistive technology. Use it for sidebar or rail layouts where horizontal space is limited. `true`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | The slot associated with the root element of this tab list. |

## Best Practices

### Do's

- Give every TabList an accessible name, either with an aria-label describing the tab set or with aria-labelledby pointing at a visible heading, because a tablist role is not meaningful on its own.
- Keep tab labels to one or two short words, ideally noun phrases, so all tabs remain scannable and the strip does not need to wrap or truncate.
- Use the controlled pattern (selectedValue plus onTabSelect) whenever the selected tab drives other application state such as data fetching, routing, or a shared layout region.
- Use defaultSelectedValue for simple, self-contained tab strips where the only consumer of the selection is the tab strip itself.
- Leave reserveSelectedTabSpace at its default so tabs keep a stable width when selection moves and the surrounding layout does not shift.
- Set size once on TabList so all contained tabs share the same scale rather than mixing small and large tabs in one strip.
- Set vertical when the tab strip is placed in a navigation rail or sidebar, so arrow key behavior and visual orientation match the layout.
- Disable the whole TabList only when the entire surface is unavailable, and disable individual tabs when only those destinations are blocked.
- Order tabs by expected frequency or logical grouping, with the most important or default view first, so keyboard users reach it with the fewest keystrokes.

### Don'ts

- Do not nest a TabList inside another TabList; use a single strip and re-render the panel content, or reach for a different navigation pattern such as Nav with sub items.
- Do not use tabs as a substitute for primary application navigation or for links that users would expect to open in a new tab, because a tabrole does not convey link semantics.
- Do not render a long, unwrapping strip of many tabs that overflows its container; limit the set, use the vertical layout, or move secondary destinations into an overflow menu pattern.
- Do not pass selectedValue without also updating it from onTabSelect, because the strip will appear frozen and keyboard selection will never visually change.
- Do not override size or appearance on individual tabs within a list, since those values are inherited from TabList and mixed values break the visual rhythm.
- Do not rely on selection color alone to communicate state; keep a single selected tab and ensure the emphasis is visible in high contrast themes.
- Do not animate or lazily mount heavy panels in a way that makes arrow key navigation feel laggy when selectTabOnFocus is enabled.
- Do not use tabs for actions that mutate data; a tab is a destination, not a command, so use Button, MenuButton, or Toolbar controls for actions.

## Anti-Patterns

### Controlled selection that never updates

❌ Passing selectedValue without changing it inside onTabSelect creates a strip that looks permanently stuck: clicks and keyboard selection appear to do nothing, and the visible selection drifts away from the user's intent.

✅ Either store the value in state and update it from onTabSelect, or drop selectedValue entirely and rely on defaultSelectedValue for a self-contained strip.

### Tabs used as page navigation

❌ Tabs are not links; using them for whole-page destinations breaks the expectation of opening in a new tab, bookmarking, and browser history, and it misleads assistive technology with the wrong role semantics.

✅ Use Nav, NavItem, Link, or Breadcrumb for real navigation, and reserve TabList for switching views inside a single region.

### Unbounded tab strip that overflows

❌ A long list of tabs overflows its container, hides destinations off-screen, and forces horizontal scrolling that is hard to discover with a keyboard on vertical layouts.

✅ Cap the number of tabs, move rarely used destinations into an overflow menu pattern, switch to the vertical layout, or split the content into a different navigation structure.

### Inherited styling overridden per tab

❌ Setting size or appearance on individual tabs inside a list produces mismatched heights, inconsistent corner radii, and a strip that ignores the list-level size, which also breaks the reserved space calculation for selected tabs.

✅ Set size and appearance once on TabList and let the values cascade, keeping per-tab overrides limited to content concerns such as icons or labels.

### Icon-only tabs with no accessible name

❌ A tab whose only content is an icon exposes no usable label to screen readers, so the destination is announced as an empty or unlabeled tab and the strip becomes unusable without sight.

✅ Pair icons with visible text labels, or supply an aria-label on the Tab that describes the destination while keeping the icon presentational.

### Automatic activation with expensive panels

❌ Enabling selectTabOnFocus while panels fetch data or mount large subtrees makes every arrow key press trigger work, causing visible lag and making it hard to explore the tab set before committing.

✅ Leave selectTabOnFocus at its default so focus and selection are decoupled, or keep panels lightweight and cached, deferring heavy content until the selection settles.

## Accessibility

**Requirements**: TabList renders the tablist role and must contain only elements with the tab role, so always pair it with Tab children. It needs an accessible name supplied through aria-label or by pointing aria-labelledby at a visible heading. Each Tab must expose aria-selected and point its aria-controls at the corresponding panel, and each panel should use the tabpanel role with aria-labelledby referring back to the tab, so the tab-to-panel relationship is announced in both directions. Only one tab may be selected at a time. When no tab should be selected, no tab may carry aria-selected as true, and focus should still be able to enter the strip. Disabled tabs must expose their disabled state to assistive technology and must be skipped by arrow key navigation. Selection must remain perceivable without color alone, so keep the default bold-text emphasis or add another non-color cue, and verify contrast of the selected label against the tab background in both light and dark themes and in forced-colors mode. Avoid auto-rotating or transient selection changes, and never move focus away from the strip on selection without user action.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the tab strip and lands on the selected tab, or on the first enabled tab if nothing is selected; pressing Tab again moves focus out of the strip into the associated panel. |
| `Shift+Tab` | Moves focus backwards out of the tab strip, returning to the previously focused element. |
| `ArrowRight` | In a horizontal (non-vertical) TabList, moves focus to the next enabled tab, wrapping from the last tab to the first. |
| `ArrowLeft` | In a horizontal (non-vertical) TabList, moves focus to the previous enabled tab, wrapping from the first tab to the last. |
| `ArrowDown` | In a vertical TabList, moves focus to the next enabled tab. |
| `ArrowUp` | In a vertical TabList, moves focus to the previous enabled tab. |
| `Home` | Moves focus to the first enabled tab in the list. |
| `End` | Moves focus to the last enabled tab in the list. |
| `Enter` | Selects the currently focused tab when focus and selection are decoupled, meaning when selectTabOnFocus is false. |
| `Space` | Selects the currently focused tab when focus and selection are decoupled, equivalent to Enter. |

**ARIA**: role (tablist on the TabList root, tab on each contained Tab), aria-label, aria-labelledby, aria-orientation (set to vertical when the vertical prop is true), aria-selected on each Tab, aria-controls on each Tab, pointing at its panel, aria-labelledby on the associated tabpanel, pointing back at the Tab, aria-disabled on disabled tabs, tabindex (roving tabindex: 0 on the selected or focused tab, -1 on the rest)

**Screen Reader**: A screen reader announces the strip as a tab list, optionally with its accessible name and orientation, and announces each tab with its label, its position and count within the set, and its selected state. Arrow key movement between tabs announces the newly focused tab without activating it when selectTabOnFocus is false, so users can explore the set before committing with Enter or Space. When selection changes, assistive technology announces the newly selected tab, and switching to the associated panel announces it as a tab panel labeled by its tab. Disabled tabs are announced as unavailable and are not reached by arrow navigation, so they must never be the only path to critical content.

## Styling

Style TabList through Griffel class overrides rather than styling tabs individually, because spacing, padding, and divider styling all come from the list root. Common adjustments include gap and padding between tabs using tokens.spacingHorizontalXS, tokens.spacingHorizontalS, tokens.spacingHorizontalMNudge, and tokens.spacingVerticalMNudge; border and divider treatment using tokens.colorNeutralStroke1, tokens.colorNeutralStroke2, and tokens.strokeWidthThin; and corner radius of circular appearances using tokens.borderRadiusCircular versus tokens.borderRadiusMedium. To blend a strip into a colored surface, target the root background with tokens.colorNeutralBackground1, tokens.colorNeutralBackground2, or tokens.colorSubtleBackground, and adjust the unselected label color with tokens.colorNeutralForeground2 and tokens.colorNeutralForeground3 while leaving the selected emphasis to the component. When you need a custom strip that still keeps behavior, use makeStyles and mergeClasses from the Fluent packages to layer your overrides on top of the component's root slot, and keep the vertical layout in mind by switching flex direction and text alignment together so labels do not break awkwardly. Avoid hard-coded pixel values for spacing and radius so your overrides follow density and theme changes.

## Performance

TabList itself is lightweight and renders a single root element, but the selection state is distributed through context, so a selection change re-renders the contained tabs and any consumer of that context. Keep onTabSelect stable, typically by wrapping it so its identity does not change on every parent render, otherwise all tabs re-render on each pass. In controlled mode, every keystroke that updates selectedValue re-renders the parent, so store selection in the narrowest component that needs it. Enabling selectTabOnFocus means selection changes on every arrow key press, which multiplies panel mount and fetch work; reserve it for cheap panels. When a panel's content is expensive, keep it mounted and hide it rather than unmounting and remounting on each switch, and avoid rendering hundreds of tabs, since each item participates in roving tabindex bookkeeping.

## Theming & Tokens

TabList and its tabs consume Fluent theme tokens rather than fixed colors, so switching between light, dark, and high-contrast themes requires no extra work. Selected labels typically use tokens.colorNeutralForeground1 while unselected labels use tokens.colorNeutralForeground2 and hover states use tokens.colorNeutralForeground1Hover, with the neutral background surfaces coming from tokens.colorNeutralBackground1, tokens.colorNeutralBackground1Hover, and tokens.colorSubtleBackground. Borders and dividers use tokens.colorNeutralStroke1 and tokens.colorNeutralStroke2 with tokens.strokeWidthThin, focus indication uses tokens.colorStrokeFocus2, and disabled tabs use tokens.colorNeutralForegroundDisabled and tokens.colorNeutralBackgroundDisabled. Size maps to typography and spacing tokens, including tokens.fontSizeBase200, tokens.fontSizeBase300, tokens.fontSizeBase400, their matching lineHeightBase values, and tokens.spacingHorizontalMNudge and tokens.spacingVerticalMNudge for padding. The circular appearances rely on tokens.borderRadiusCircular, and vertical layouts rely on the same spacing tokens for vertical gaps.

## Migration Notes

In v9 the tab pattern was split into a TabList container plus separate Tab children, replacing the single Pivot and PivotItem pair from v8. Selection is value based: selectedValue replaces selectedKey, defaultSelectedValue replaces defaultSelectedKey, and onTabSelect replaces the older link click handler, so routing code that previously keyed off item keys should be rewritten against the value passed through onTabSelect. The v8 overflow mode, which automatically collapsed excess pivot items into a menu, has no direct equivalent on TabList; achieve that behavior by composing with the overflow components or by restructuring the destinations into another navigation pattern. Appearance, size, and orientation are now props on the container that cascade to all tabs instead of being configured per item or with custom class overrides.

## Edge Cases

- A selectedValue that matches no Tab leaves the strip with no tab selected; the roving tabindex then falls back to the first enabled tab, so verify the value stays in sync with the rendered tab set, especially when tabs are conditionally rendered.
- Duplicate values across tabs make selection ambiguous, because matching by value cannot distinguish them; keep values unique per strip.
- In controlled mode the visual selection only changes when the parent updates selectedValue, so a handler that measures or logs but does not set state makes the component appear broken.
- Disabled tabs are skipped by arrow navigation and cannot be selected, so a disabled tab holding the current selection should be enabled or the selection cleared.
- Setting selectTabOnFocus to true while panels perform async work causes a load on every arrow key press, which is a common source of perceived jank on slower data.
- When reserveSelectedTabSpace is true, short labels keep room for their bold selected rendering, which can look like extra padding; setting it to false removes the reservation but reintroduces width changes and layout shift on selection.
- TabList does not scroll or collapse automatically, so long strips overflow their container and require a deliberate overflow or vertical layout decision.
- On mobile or narrow containers, a horizontal strip with several tabs may wrap or truncate labels; switching to vertical or reducing tab count keeps labels readable.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
