# Tabs

> **Package**: `@fluentui/react-tabs` v9.12.2
> **Import**: `import { Tabs } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

Tabs is the Fluent UI React v9 navigation primitive for switching between peer views of related content. It is composed of a list container (TabList) and the individual items it holds (Tab); both are exported from '@fluentui/react-components'. TabList presents itself as a tab list, tracks which items have registered with it, manages the selected value through selectedValue or defaultSelectedValue, and animates a selection indicator along the list. Each Tab takes a required, unique value, can render an icon before its label content, and can be disabled independently. The list itself is configurable with appearance (transparent, subtle, subtle-circular, filled-circular), size (small, medium, large), vertical layout, disabled state, and an option to select tabs on focus. Because the same primitive covers compact toolbar switchers, full-width page-level view switchers, and vertical panel navigation, Tabs is one of the most reused navigation components in the library.

**When to use**: Use Tabs when several mutually exclusive views of the same subject live in one place and the user must move between them without leaving the context, for example switching between Arrivals, Departures and Conditions panels in the same screen, or flipping between detail sections of a single record. Choose the transparent appearance for tabs placed directly on a page surface, subtle or circular appearances when the list sits inside a toolbar or card header, and the vertical variant when the list is used as a side rail next to a large panel. Set selectTabOnFocus to true only when each panel is inexpensive to render and the act of arrowing through the list should immediately update the content. Prefer other components when the interaction is different: use Accordion when content expands and collapses in place and multiple sections can be open, use Nav or Link for moving between routes or pages, and use Menu or ContextSelector when the choices belong in a transient overlay rather than a persistent list.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `'transparent' \| 'subtle' \| 'subtle-circular' \| 'filled-circular'` | — | No | — |
| `defaultSelectedValue` | `TabValue` | — | No | — |
| `disabled` | `boolean` | — | No | — |
| `disabled` | `boolean` | — | No | — |
| `onRegister` | `RegisterTabEventHandler` | — | Yes | — |
| `onSelect` | `SelectTabEventHandler` | — | Yes | — |
| `onTabSelect` | `SelectTabEventHandler` | — | No | — |
| `onUnregister` | `RegisterTabEventHandler` | — | Yes | — |
| `previousSelectedValue` | `TabValue` | — | No | — |
| `registeredTabs` | `Record<string, TabRegisterData>` | — | Yes | — |
| `reserveSelectedTabSpace` | `boolean` | — | No | — |
| `selectedValue` | `TabValue` | — | No | — |
| `selectedValue` | `TabValue` | — | No | — |
| `selectTabOnFocus` | `boolean` | — | No | — |
| `size` | `'small' \| 'medium' \| 'large'` | — | No | — |
| `value` | `TabValue` | — | Yes | — |
| `vertical` | `boolean` | — | No | — |

### Prop Guidance

- **appearance**: Sets the visual treatment of the tab list. Use transparent on plain page backgrounds, subtle when the list is embedded in a surface or toolbar, and subtle-circular or filled-circular for compact, pill-shaped groupings. The default is transparent. `subtle-circular`
- **size**: Scales tab height, padding and label typography. Use small for dense toolbars, medium as the default for most layouts, and large for prominent page-level switching or touch-friendly interfaces. `large`
- **vertical**: Stacks tabs top to bottom and changes arrow-key navigation to the up and down arrows, which suits side-rail navigation next to a large panel. Defaults to false, meaning horizontal. `true`
- **defaultSelectedValue**: Sets the initially selected tab for uncontrolled usage. The list then owns the selection and updates it internally, so combine it with onTabSelect only for observation, not for control. `tab3`
- **selectedValue**: Controls the selected tab from outside the component. Use it with onTabSelect and store the reported value in state, a router, or a data store to keep selection in sync with rendering. `conditions`
- **onTabSelect**: Called when the user selects a tab, providing the event and data containing the new value. This is the hook for rendering the matching panel or persisting the selection; it is required for controlled usage. `handler that reads the new value from the event data and updates state`
- **selectTabOnFocus**: When true, arrow-key focus immediately selects the tab instead of waiting for Enter or Space. Enable it only for lightweight panels, since traversal commits every focused tab as a selection. `true`
- **disabled**: On TabList, disables every tab in the list at once, which is the right choice when the whole feature is unavailable. On Tab, disables just that item while leaving the rest of the list interactive. `true on TabList to disable the entire list`
- **reserveSelectedTabSpace**: Keeps layout stable by reserving space for the selected tab indicator, which prevents visible shifting when the number of selected tabs changes. Useful in toolbars and in lists where the indicator appears and disappears. `true`
- **value**: Required on every Tab and must be unique within its list; it is the identity used for selection comparisons and for the registration map. Values may be strings or numbers, but must stay stable across renders. `arrivals`
- **icon**: Slot on Tab that renders an icon before the tab content. Use it to speed recognition in compact lists, and always combine icon-only tabs with an aria-label so the tab still has an accessible name. `an icon element rendered before the label`
- **registeredTabs**: Internal registry of the tabs currently mounted in the list, keyed by their values, along with their registration data. Rarely referenced directly, but it explains why unmounting and remounting tabs churns the list. `registry keyed by tab value`
- **onRegister**: Registration handler invoked as tabs mount into the list so the list can track them. Treat it as internal plumbing and avoid calling it manually. `registration callback supplied by the list internals`
- **onUnregister**: Registration handler invoked as tabs unmount, removing them from the list's registry. Avoid calling it manually; instead keep tab sets stable where possible. `unregistration callback supplied by the list internals`
- **onSelect**: Low-level selection handler that performs the actual selection update inside the list. Application code should use onTabSelect instead of invoking this directly. `internal selection handler`
- **previousSelectedValue**: Tracks the value that was selected before the current one, which supports the animated indicator and transition behavior when selection changes. Informational rather than something you typically set. `tab2 while tab3 is selected`

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, Tab, TabList } from '@fluentui/react-components';
import type { TabListProps } from '@fluentui/react-components';

export const Default = (props: Partial<TabListProps>): JSXElement => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <TabList {...props}>
        <Tab value="tab1">First Tab</Tab>
        <Tab value="tab2">Second Tab</Tab>
        <Tab value="tab3">Third Tab</Tab>
        <Tab value="tab4">Fourth Tab</Tab>
      </TabList>
    </div>
  );
};
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, Tab, TabList } from '@fluentui/react-components';

export const Appearance = (): JSXElement => {
  const styles = useStyles();

  const renderTabs = () => {
    return (
      <>
        <Tab value="tab1">First Tab</Tab>
        <Tab disabled value="tab2">
          Second Tab
        </Tab>
        <Tab value="tab3">Third Tab</Tab>
        <Tab value="tab4">Fourth Tab</Tab>
      </>
    );
  };

  return (
    <div className={styles.root}>
      <TabList defaultSelectedValue="tab3" appearance="transparent">
        {renderTabs()}
      </TabList>
      <TabList defaultSelectedValue="tab3" appearance="subtle">
        {renderTabs()}
      </TabList>
      <TabList defaultSelectedValue="tab3" appearance="subtle-circular">
        {renderTabs()}
      </TabList>
      <TabList defaultSelectedValue="tab3" appearance="filled-circular">
        {renderTabs()}
      </TabList>
    </div>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story:
        'A tab list can have a `transparent`, `subtle`, `subtle-circular` and `filled-circular` appearance. The default is `transparent`.',
    },
  },
};
```

### Disabled

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, Tab, TabList } from '@fluentui/react-components';
import { CalendarMonthRegular, CalendarMonthFilled, bundleIcon } from '@fluentui/react-icons';

export const Disabled = (): JSXElement => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <TabList defaultSelectedValue="tab2" disabled>
        <Tab icon={<CalendarMonth />} value="tab1">
          First Tab
        </Tab>
        <Tab icon={<CalendarMonth />} value="tab2">
          Second Tab
        </Tab>
        <Tab icon={<CalendarMonth />} value="tab3">
          Third Tab
        </Tab>
        <Tab icon={<CalendarMonth />} value="tab4">
          Fourth Tab
        </Tab>
      </TabList>
      <TabList defaultSelectedValue="tab2">
        <Tab icon={<CalendarMonth />} value="tab1">
          First Tab
        </Tab>
        <Tab icon={<CalendarMonth />} value="tab2" disabled>
          Second Tab
        </Tab>
        <Tab icon={<CalendarMonth />} value="tab3" disabled>
          Third Tab
        </Tab>
        <Tab icon={<CalendarMonth />} value="tab4">
          Fourth Tab
        </Tab>
      </TabList>
    </div>
  );
};

Disabled.parameters = {
  docs: {
    description: {
      story:
        'A tab list can disable interaction for all its tabs. The default is `false`.' +
        ' Individual tabs can also be disabled.',
    },
  },
};
```

## Best Practices

### Do's

- Give every Tab a unique value and drive the visible panel from the value delivered by onTabSelect, so selection and content can never drift apart.
- Render each panel as a tabpanel region and reference the Tab's id through aria-labelledby, exactly as the WithPanels example does, so assistive technology announces which tab owns the visible region.
- Pick the appearance that matches the surrounding surface: transparent for page-level switching, subtle for embedded or toolbar contexts, and the circular variants for compact, icon-heavy switchers.
- Add an aria-label to every icon-only Tab, as shown in the IconOnly example, because an icon alone has no accessible name.
- Use defaultSelectedValue for uncontrolled initial selection and the controlled pair of selectedValue plus onTabSelect when the selection must live in application state or be restored from a URL or store.
- Enable selectTabOnFocus only when panels render quickly, since arrow-key traversal then commits a selection on every focused tab.
- Reach for Overflow and OverflowItem when the tab list may exceed its container, and follow the WithOverflow guidance of adding the tab role manually to any custom buttons injected into the list, such as the overflow trigger.
- Keep labels short, parallel in grammar, and consistent in capitalization so the list scans as one unit; add an icon when it aids recognition but keep the text when it disambiguates.
- Disable the whole list with disabled on TabList when the underlying feature is temporarily unavailable, rather than disabling each Tab individually.

### Don'ts

- Don't use Tabs as primary navigation between pages or routes; a tab selection should reveal a sibling view in place, not change the application location.
- Don't build a tab list where selecting a different tab shows the same or no content; if nothing visibly changes, a different control is the right answer.
- Don't omit, duplicate, or silently change the type of a Tab's value, because selection matching depends on that value being stable and unique.
- Don't pass both selectedValue and defaultSelectedValue to the same TabList, and never pass selectedValue without an onTabSelect handler, or the list becomes read-only in practice.
- Don't nest unrelated interactive controls inside the tab label; actions belong in the panel or beside the list.
- Don't apply the circular appearances to vertical lists or to large page-level switchers; they are designed for compact horizontal groupings.
- Don't rely on the visual underline, tint, or weight change alone to communicate selection; the component's selected state must be paired with the matching panel content and its accessible name.
- Don't write long, wrapping, or multi-sentence labels inside Tab content, since tabs are sized for brief, scannable text.

## Anti-Patterns

### Tabs used as top-level navigation

❌ Treating Tabs as a router changes the meaning of the control: users expect a tab selection to swap content in place, and screen reader users expect a tabpanel association that page navigation does not provide.

✅ Use Tabs only for sibling views within one context, and switch to link-based navigation (for example Nav or Link) when the interaction moves the user to another page or route.

### Icon-only tabs without an accessible name

❌ A tab whose only child is an icon exposes no text to assistive technology, so it is announced as an unlabeled item and cannot be identified.

✅ Add an aria-label to every icon-only Tab, as the IconOnly example does, and keep the icon decorative by relying on the label for the accessible name.

### Panels that are not associated with their tab

❌ Rendering swapped content as a bare div leaves screen reader users without any announcement of what changed, and breaks the tab and tabpanel relationship required by the ARIA pattern.

✅ Give each Tab an id, render the active content in a region with the tabpanel role, and point its aria-labelledby at the owning Tab's id, exactly as the WithPanels example demonstrates.

### Custom controls injected into the tab list without the tab role

❌ Adding an overflow button or other button directly inside the list creates an element that is not part of the tabs pattern, so its role and traversal order are wrong for the container.

✅ Follow the WithOverflow note and add the tab role manually to any custom button placed in a tab list, such as the overflow trigger, or move the action outside the list.

### Mixing controlled and uncontrolled selection

❌ Passing both selectedValue and defaultSelectedValue, or passing selectedValue without onTabSelect, produces a list that either ignores its own default or never appears to change.

✅ Choose one model: defaultSelectedValue alone for uncontrolled lists, or selectedValue plus onTabSelect with the value stored in state for controlled lists.

### Missing, duplicated, or unstable tab values

❌ Because selection, the registry and the indicator all key off the value, duplicates make selection ambiguous and changing a value between renders breaks the selected state and any persisted selection.

✅ Assign short, stable, unique values to each Tab and derive them from stable identifiers rather than array indexes or generated strings.

## Accessibility

**Requirements**: Tabs implements the ARIA tabs pattern and must satisfy WCAG 2.1: all tabs reachable and operable by keyboard (2.1.1), visible focus indication (2.4.7), a programmatically determinable selected state (4.1.2), and sufficient contrast between the selected indicator, the tab label, and the background in every appearance and theme (1.4.3, 1.4.11). Every Tab needs an accessible name, which the label content provides or, for icon-only tabs, an aria-label supplies. Every panel must be associated with its tab list item. Disabled tabs must be exposed as unavailable rather than simply styled as grey.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the tab list on the selected tab, or out of the list to the next focusable element (typically the active panel) when focus is already inside. |
| `Shift+Tab` | Moves focus out of the tab list backwards to the previous focusable element. |
| `ArrowLeft` | Moves focus to the previous enabled tab in a horizontal list. |
| `ArrowRight` | Moves focus to the next enabled tab in a horizontal list. |
| `ArrowUp` | Moves focus to the previous enabled tab when vertical is true. |
| `ArrowDown` | Moves focus to the next enabled tab when vertical is true. |
| `Home` | Moves focus to the first enabled tab in the list. |
| `End` | Moves focus to the last enabled tab in the list. |
| `Enter` | Selects the currently focused tab when selectTabOnFocus is false (the default). |
| `Space` | Selects the currently focused tab when selectTabOnFocus is false (the default). |

**ARIA**: role="tablist" on the TabList container, role="tab" on each Tab, and manually on any custom buttons placed inside the list, such as an overflow trigger, aria-selected on the selected Tab, aria-disabled on individual disabled tabs and when the entire list is disabled, aria-label on icon-only tabs that have no visible text, id on each Tab, referenced by aria-labelledby on its panel, role="tabpanel" on the revealed content region, aria-labelledby on the panel pointing at the owning Tab's id

**Screen Reader**: The list is announced as a tab list with the number of tabs it contains, and each item is announced with its label, its position, and whether it is selected or disabled. Only the selected tab is in the normal tab order, so Tab moves into the list once and arrow keys then move between tabs while focus remains within the list. When selection changes, the newly revealed region should be announced through its tabpanel role and its aria-labelledby association with the owning Tab's id. Icon-only tabs are announced using their aria-label rather than any icon content. When the whole list is disabled or a single tab is disabled, those items are announced as unavailable and are skipped by arrow-key traversal.

## Styling

Style Tabs with makeStyles and Griffel tokens rather than raw CSS values so light, dark, high-contrast and brand themes all resolve correctly. Use tokens.spacingHorizontalM and tokens.spacingHorizontalS for the gap between horizontal tabs and tokens.spacingVerticalS for spacing in vertical lists. For label typography, map size variations onto tokens.fontSizeBase300 with tokens.lineHeightBase300 for medium and small, and tokens.fontSizeBase400 for large, and use tokens.fontWeightSemibold on the selected label. Boundaries and separators can use tokens.colorNeutralStroke1, tokens.colorNeutralStroke2 or tokens.colorNeutralStrokeDisabled, and the selected indicator is best expressed with tokens.colorCompoundBrandForeground1 or tokens.colorCompoundBrandStroke, with tokens.colorBrandBackground used for filled selections. Hover and pressed surfaces map cleanly onto tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed and the subtle-family equivalents tokens.colorSubtleBackgroundHover, tokens.colorSubtleBackgroundPressed and tokens.colorSubtleBackgroundSelected. The circular appearances expect tokens.borderRadiusCircular or tokens.borderRadiusMedium, while square variants align with tokens.borderRadiusNone along their edges. Disabled labels should use tokens.colorNeutralForegroundDisabled. If you animate the indicator or custom transitions, prefer tokens.durationNormal and tokens.curveEasyEase over fixed millisecond values, and override the component's className with utility classes instead of reaching into internal pseudo-elements.

## Performance

TabList maintains a registry of mounted tabs through onRegister and onUnregister and keeps their data in registeredTabs, so mounting and unmounting tabs has measurable overhead; keep the tab set stable and avoid conditional remounting by using stable keys and values. Selection changes trigger an indicator transition and a re-render of the list, so keep the number of tabs reasonable and memoize the panels that swap in and out, as the WithPanels example does with React.memo. Combining the list with Overflow and OverflowItem adds container measurement and resize-driven re-renders, which is worthwhile for wide lists but should be avoided for short, fixed sets. selectTabOnFocus commits a selection on every focused tab, so use it only when panels are cheap or lazily rendered. Icon elements should be stable references rather than newly constructed on each render to avoid needless diffing.

## Theming & Tokens

Tabs is fully token-driven. The transparent appearance draws labels from tokens.colorNeutralForeground1 and tokens.colorNeutralForeground2 with the selected accent from tokens.colorCompoundBrandForeground1 and tokens.colorCompoundBrandStroke; the subtle and circular appearances build their surfaces from tokens.colorSubtleBackground and its hover, pressed and selected variants, and the filled-circular variant uses neutral or brand fill tokens such as tokens.colorBrandBackground depending on the active theme. Hover and pressed states fall back to tokens.colorNeutralForeground2Hover and tokens.colorNeutralForeground2Selected on the label. Disabled tabs use tokens.colorNeutralForegroundDisabled with tokens.colorNeutralBackgroundDisabled or tokens.colorNeutralStrokeDisabled for their surfaces and outlines. Size changes scale spacing and type through tokens.fontSizeBase300, tokens.fontSizeBase400, tokens.fontWeightSemibold, tokens.spacingHorizontalM, tokens.spacingVerticalS and tokens.lineHeightBase300. Indicator and state transitions should use motion tokens such as tokens.durationNormal and tokens.curveEasyEase. All of these resolve against the active FluentProvider theme, so light, dark, high-contrast and branded themes are handled automatically as long as you never hard-code colors in your own overrides.

## Migration Notes

The v9 tab pattern replaces the v8 Pivot and PivotItem components. Instead of Pivot's style-oriented props (for example root-level appearance and per-item styles), v9 uses TabList with appearance (transparent, subtle, subtle-circular, filled-circular) plus a size prop (small, medium, large) and a vertical flag, and uses Tab items with a required value, an icon slot, and per-item disabled. Selection is value-based rather than index-based: uncontrolled usage sets defaultSelectedValue and controlled usage passes selectedValue together with onTabSelect, which reports the new value through its event data instead of relying on render-prop children. The v8 pattern of swapping content with a single PivotItem child render function is replaced by rendering the active panel yourself based on the selected value, with role="tabpanel" and aria-labelledby added manually.

## Edge Cases

- The value prop on Tab is required and must be unique inside its list; duplicate values make selection and the internal registration map ambiguous, and values that change between renders lose the selected state.
- Several prop names exist on both parts of the composition: disabled on TabList disables the entire list while disabled on Tab disables one item, and selectedValue exists both as the controlled value on TabList and as internal registration state, so pass it to the list, not to individual tabs.
- If defaultSelectedValue or selectedValue does not match any mounted tab value, for example because the tab is conditionally rendered or the value type differs (number versus string), nothing appears selected and no panel should be assumed active.
- With selectTabOnFocus enabled, arrowing through the list selects each tab it passes, so any code that loads data or navigates on selection will fire repeatedly during traversal.
- Overflowed tabs are rendered inside a menu rather than the list itself, so custom buttons added to the list, such as the overflow trigger, need the tab role added manually for correct screen reader behavior.
- Vertical lists combined with large size and icons produce noticeably taller rows, and the circular appearances are tuned for horizontal compact groupings, so they can look off in a vertical rail.
- A disabled Tab can still be the selected value, in which case the selection is displayed but the tab cannot receive focus, so provide another way for users to leave the disabled state.
- The tabpanel region is your responsibility: without an id on the Tab and an aria-labelledby on the panel, the tab and its content are not linked for assistive technology even though selection works visually.
- Consumers that keep the selection in application state should handle the case where the selected tab is removed from the list, either by resetting to a valid value or by rendering a fallback panel.

## See Also

- - [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
