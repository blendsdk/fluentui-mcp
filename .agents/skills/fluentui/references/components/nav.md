# Nav

> **Package**: `@fluentui/react-nav` v9.4.0
> **Import**: `import { Nav } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

Nav is the root container for application-level navigation in Fluent UI React v9. It owns the selection and expansion state for a tree of navigation children such as NavItem, NavCategory, NavCategoryItem, NavSubItem, NavSubItemGroup, NavSectionHeader and NavDivider, and it commonly hosts an AppItem or AppItemStatic product identifier at the top of the list. Every navigable entry is identified by a string value, and Nav tracks both which value is currently selected and which categories are expanded — either uncontrolled through defaultSelectedValue, defaultSelectedCategoryValue and defaultOpenCategories, or controlled through selectedValue, selectedCategoryValue and openCategories. Nav also coordinates category semantics: when a sub-item is selected, the parent NavCategory can keep reporting itself as selected even while collapsed through selectedCategoryValue, and the multiple prop decides whether more than one category may be expanded simultaneously. The density prop switches the vertical rhythm between medium and small so the same navigation can be rendered at full size or in a compact rail, and child items inherit that density. Because Nav exposes a single root slot, surrounding chrome such as headers and footers is supplied by companion components like NavDrawer, NavDrawerHeader, NavDrawerBody and NavDrawerFooter.

**When to use**: Use Nav for persistent, hierarchical wayfinding inside an application shell: primary and secondary destinations that a user returns to repeatedly, grouped by NavSectionHeader, optionally organized into expandable NavCategory groups with NavSubItem children. Combine it with NavDrawer and NavDrawerBody when the navigation can collapse into a rail or overlay, and with AppItem/AppItemStatic for the product or tenant identity. Reach for alternatives when the semantics differ: TabList for switching views inside a single page, Menu and MenuPopover for transient commands, Breadcrumb for showing the user's location in a hierarchy on a content page, and Tree for browsing hierarchical data objects rather than navigating to destinations. If the content is a flat, non-hierarchical set of page links, Link plus a simple list may be sufficient instead of the full Nav composition.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `defaultOpenCategories` | `string[] \| undefined` | — | No | Set of categories that are opened by default. Typically useful when the openCategories is uncontrolled. |
| `defaultSelectedCategoryValue` | `string \| undefined` | — | No | The value of the navCategory to be selected by default. Typically useful when the selectedValue is uncontrolled. Mutually exclusive with selectedValue. Empty string indicates no selection. |
| `defaultSelectedValue` | `string \| undefined` | — | No | The value of the navItem to be selected by default. Typically useful when the selectedValue is uncontrolled. Mutually exclusive with selectedValue. Empty string indicates no selection. |
| `density` | `NavDensity \| undefined` | `'medium'` | No | The vertical density of the Nav and it's children |
| `multiple` | `boolean \| undefined` | `true, indicating that multiple categories can be open at the same time.` | No | Indicates if Nav supports multiple open Categories at the same time. |
| `onNavCategoryItemToggle` | `EventHandler<OnNavItemSelectData> \| undefined` | — | No | Callback raised when a NavCategoryItem is toggled. |
| `onNavItemSelect` | `EventHandler<OnNavItemSelectData> \| undefined` | — | No | Raised when a navItem is selected. If the navItem is child of a category, the categoryValue will be provided |
| `openCategories` | `string[] \| undefined` | — | No | Controls the open categories. For use in controlled scenarios. |
| `selectedCategoryValue` | `string \| undefined` | `undefined` | No | Indicates a category that has a selected child Will show the category as selected if it is closed. |
| `selectedValue` | `string \| undefined` | `undefined` | No | The value of the currently selected navItem. Mutually exclusive with defaultSelectedValue. |

### Prop Guidance

- **defaultSelectedValue**: Uncontrolled initial selection for the navigation. Use it when Nav owns selection state internally, as in the basic and density examples. Must not be combined with selectedValue, and an empty string explicitly means nothing is selected. `2`
- **defaultSelectedCategoryValue**: Uncontrolled initial category highlight. Supply the value of the NavCategory that contains the selected child so the category renders as selected even while collapsed. Passing an empty string starts with no category marked. `empty string for no category`
- **defaultOpenCategories**: Uncontrolled initial set of expanded categories. Provide the category values that should start open; Nav manages later open and closed changes itself. Do not pass this together with openCategories. `the category values 6 and 11`
- **openCategories**: Controlled set of expanded categories. When you use it, the array is authoritative and Nav will not change it for you — update it inside onNavCategoryItemToggle, honoring the multiple setting for single-expand behavior. `the category values 6 and 11`
- **selectedValue**: Controlled value of the currently selected navigation entry. Set it from onNavItemSelect and keep it in sync with the rendered route or view; mutually exclusive with defaultSelectedValue, and empty string means no selection. `7`
- **selectedCategoryValue**: Marks the category that contains the selected child so a collapsed category still reads as selected. Update it together with selectedValue in onNavItemSelect for correct visual state. `6`
- **onNavItemSelect**: Raised when a navigation entry is selected. The event data provides the item value and, when the entry is a child of a category, the category value — use both to drive controlled selection state. `set selectedValue to the reported value and selectedCategoryValue to the reported category value`
- **onNavCategoryItemToggle**: Raised when a NavCategoryItem is expanded or collapsed. In controlled mode this is where you recompute openCategories; the toggle data includes the category value so you can add or remove it from the array. `add or remove the reported category value from openCategories`
- **multiple**: Controls whether several categories can be expanded at the same time. Defaults to true; set it to false for accordion-style navigation where opening one category closes the others, and mirror that rule in a controlled toggle handler. `false for single-category expansion`
- **density**: Vertical density of the navigation and its children. Defaults to medium; choose small for compact rails and pair it with appropriately scaled icons, since children inherit the density set on Nav. `small`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Examples

### Basic

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import type { DrawerProps } from '@fluentui/react-drawer';

export const Basic = (): JSXElement => {
  const styles = useStyles();

  const typeLableId = useId('type-label');
  const linkLabelId = useId('link-label');
  const multipleLabelId = useId('multiple-label');

  const [isOpen, setIsOpen] = React.useState(true);
  const [enabledLinks, setEnabledLinks] = React.useState(true);
  const [type, setType] = React.useState<DrawerType>('inline');
  const [isMultiple, setIsMultiple] = React.useState(true);

  // Tabster prop used to restore focus to the navigation trigger for overlay nav drawers
  const restoreFocusTargetAttributes = useRestoreFocusTarget();

  const linkDestination = enabledLinks ? 'https://www.bing.com' : '';

  return (
    <div className={styles.root}>
      <NavDrawer
        defaultSelectedValue="2"
        defaultSelectedCategoryValue=""
        open={isOpen}
        type={type}
        multiple={isMultiple}
        className={styles.nav}
      >
        <NavDrawerHeader>
          <Tooltip content="Close Navigation" relationship="label">
            <Hamburger onClick={() => setIsOpen(!isOpen)} />
          </Tooltip>
        </NavDrawerHeader>

        <NavDrawerBody>
          <AppItem icon={<PersonCircle32Regular />} as="a" href={linkDestination}>
            Contoso HR
          </AppItem>
          <NavItem href={linkDestination} icon={<Dashboard />} value="1">
            Dashboard
          </NavItem>
          <NavItem href={linkDestination} icon={<Announcements />} value="2">
            Announcements
          </NavItem>
          <NavItem href={linkDestination} icon={<EmployeeSpotlight />} value="3">
            Employee Spotlight
          </NavItem>
          <NavItem icon={<Search />} href={linkDestination} value="4">
            Profile Search
          </NavItem>
          <NavItem icon={<PerformanceReviews />} href={linkDestination} value="5">
            Performance Reviews
          </NavItem>
          <NavSectionHeader>Employee Management</NavSectionHeader>
          <NavCategory value="6">
            <NavCategoryItem icon={<JobPostings />}>Job Postings</NavCategoryItem>
            <NavSubItemGroup>
              <NavSubItem href={linkDestination} value="7">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit
              </NavSubItem>
              <NavSubItem href={linkDestination} value="8">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit
              </NavSubItem>
            </NavSubItemGroup>
          </NavCategory>
          <NavItem icon={<Interviews />} value="9">
            Interviews
          </NavItem>

          <NavSectionHeader>Benefits</NavSectionHeader>
          <NavItem icon={<HealthPlans />} value="10">
            Health Plans
          </NavItem>
          <NavCategory value="11">
            <NavCategoryItem icon={<Person />} value="12">
              Retirement
            </NavCategoryItem>
            <NavSubItemGroup>
              <NavSubItem href={linkDestination} value="13">
                Plan Information
              </NavSubItem>
              <NavSubItem href={linkDestination} value="14">
                Fund Performance
              </NavSubItem>
            </NavSubItemGroup>
          </NavCategory>

          <NavSectionHeader>Learning</NavSectionHeader>
          <NavItem icon={<TrainingPrograms />} value="15">
            Training Programs
          </NavItem>
          <NavCategory value="16">
            <NavCategoryItem icon={<CareerDevelopment />}>Career Development</NavCategoryItem>
            <NavSubItemGroup>
              <NavSubItem href={linkDestination} value="17">
                Career Paths
              </NavSubItem>
              <NavSubItem href={linkDestination} value="18">
                Planning
              </NavSubItem>
            </NavSubItemGroup>
          </NavCategory>
          <NavDivider />
          <NavItem target="_blank" icon={<Analytics />} value="19">
            Workforce Data
          </NavItem>
          <NavItem href={linkDestination} icon={<Reports />} value="20">
            Reports
          </NavItem>
        </NavDrawerBody>
      </NavDrawer>
      <div className={styles.content}>
        <Tooltip content="Toggle navigation pane" relationship="label">
          <Hamburger onClick={() => setIsOpen(!isOpen)} {...restoreFocusTargetAttributes} aria-expanded={isOpen} />
        </Tooltip>
        <div className={styles.field}>
          <Label id={typeLableId}>Type</Label>
          <RadioGroup
            value={type}
            onChange={(_, data) => setType(data.value as DrawerType)}
            aria-labelledby={typeLableId}
          >
            <Radio value="overlay" label="Overlay (Default)" />
            <Radio value="inline" label="Inline" />
          </RadioGroup>
          <Label id={linkLabelId}>Links</Label>
          <Switch
            checked={enabledLinks}
            onChange={(_, data) => setEnabledLinks(!!data.checked)}
            label={enabledLinks ? 'Enabled' : 'Disabled'}
            aria-labelledby={linkLabelId}
          />
          <Label id={multipleLabelId}>Allow multiple expanded categories</Label>
          <Switch
            checked={isMultiple}
            onChange={(_, data) => setIsMultiple(!!data.checked)}
            label={isMultiple ? 'Multiple' : 'Single'}
            aria-labelledby={multipleLabelId}
          />
        </div>
      </div>
    </div>
  );
};
```

### Controlled

```tsx
import * as React from 'react';
import type { JSXElement, NavItemValue, OnNavItemSelectData } from '@fluentui/react-components';
import { Button, Label, Switch, Tooltip, makeStyles, tokens, useId } from '@fluentui/react-components';

export const Controlled = (): JSXElement => {
  const styles = useStyles();

  const multipleLabelId = useId('multiple-label');

  const [openCategories, setOpenCategories] = React.useState<NavItemValue[]>(['6', '11']);
  const [selectedCategoryValue, setSelectedCategoryValue] = React.useState<string | undefined>('6');
  const [selectedValue, setSelectedValue] = React.useState<string>('7');
  const [isMultiple, setIsMultiple] = React.useState(true);

  const handleCategoryToggle = (_: Event | React.SyntheticEvent<Element, Event>, data: OnNavItemSelectData) => {
    if (data.value === undefined && data.categoryValue) {
      // we're just opening it,
      setOpenCategories([data.categoryValue as string]);
    }

    if (isMultiple) {
      // if it's already open, remove it from the list
      if (openCategories.includes(data.categoryValue as string)) {
        setOpenCategories(openCategories.filter(category => category !== data.categoryValue));
      } else {
        // otherwise add it
        setOpenCategories([...openCategories, data.categoryValue as string]);
      }
    } else {
      // if it's already open, remove it from the list
      if (openCategories.includes(data.categoryValue as string)) {
        setOpenCategories([]);
      } else {
        // otherwise add it
        setOpenCategories([data.categoryValue as string]);
      }
    }
  };

  const handleItemSelect = (event: Event | React.SyntheticEvent<Element, Event>, data: OnNavItemSelectData) => {
    setSelectedCategoryValue(data.categoryValue as string);
    setSelectedValue(data.value as string);
  };

  const renderHamburgerWithToolTip = () => {
    return (
      <Tooltip content="Navigation" relationship="label">
        <Hamburger />
      </Tooltip>
    );
  };

  const handleNavigationClick = () => {
    const { newSelectedCategory, newSelectedValue } = getRandomPage();

    setSelectedCategoryValue(newSelectedCategory);
    setSelectedValue(newSelectedValue);
  };

  const handleMultipleChange = (_: Event | React.SyntheticEvent<Element, Event>, data: { checked: boolean }) => {
    setIsMultiple(data.checked);

    if (data.checked) {
      setOpenCategories(['6', '11']);
    } else {
      setOpenCategories(['6']);
    }
  };

  return (
    <div className={styles.root}>
      <NavDrawer
        // This a controlled example,
        // so don't use these props
        // defaultSelectedValue="7"
        // defaultSelectedCategoryValue="6"
        // defaultOpenCategories={['6']}
        // multiple={isMultiple}
        onNavCategoryItemToggle={handleCategoryToggle}
        onNavItemSelect={handleItemSelect}
        tabbable={true} // enables keyboard tabbing
        openCategories={openCategories}
        selectedValue={selectedValue}
        selectedCategoryValue={selectedCategoryValue}
        type={'inline'}
        open={true}
        className={styles.nav}
      >
        <NavDrawerHeader>{renderHamburgerWithToolTip()}</NavDrawerHeader>

        <NavDrawerBody>
          <AppItem icon={<PersonCircle32Regular />} as="a">
            Contoso HR
          </AppItem>
          <NavItem icon={<Dashboard />} value="1">
            Dashboard
          </NavItem>
          <NavItem icon={<Announcements />} value="2">
            Announcements
          </NavItem>
          <NavItem icon={<EmployeeSpotlight />} value="3">
            Employee Spotlight
          </NavItem>
          <NavItem icon={<Search />} value="4">
            Profile Search
          </NavItem>
          <NavItem icon={<PerformanceReviews />} value="5">
            Performance Reviews
          </NavItem>
          <NavSectionHeader>Employee Management</NavSectionHeader>
          <NavCategory value="6">
            <NavCategoryItem icon={<JobPostings />}>Job Postings</NavCategoryItem>
            <NavSubItemGroup>
              <NavSubItem value="7">Openings</NavSubItem>
              <NavSubItem value="8">Submissions</NavSubItem>
            </NavSubItemGroup>
          </NavCategory>
          <NavItem icon={<Interviews />} value="9">
            Interviews
          </NavItem>

          <NavSectionHeader>Benefits</NavSectionHeader>
          <NavItem icon={<HealthPlans />} value="10">
            Health Plans
          </NavItem>
          <NavCategory value="11">
            <NavCategoryItem icon={<Person />} value="12">
              Retirement
            </NavCategoryItem>
            <NavSubItemGroup>
              <NavSubItem value="13">Plan Information</NavSubItem>
              <NavSubItem value="14">Fund Performance</NavSubItem>
            </NavSubItemGroup>
          </NavCategory>

          <NavSectionHeader>Learning</NavSectionHeader>
          <NavItem icon={<TrainingPrograms />} value="15">
            Training Programs
          </NavItem>
          <NavCategory value="16">
            <NavCategoryItem icon={<CareerDevelopment />}>Career Development</NavCategoryItem>
            <NavSubItemGroup>
              <NavSubItem value="17">Career Paths</NavSubItem>
              <NavSubItem value="18">Planning</NavSubItem>
            </NavSubItemGroup>
          </NavCategory>
          <NavDivider />
          <NavItem target="_blank" icon={<Analytics />} value="19">
            Workforce Data
          </NavItem>
          <NavItem icon={<Reports />} value="20">
            Reports
          </NavItem>
        </NavDrawerBody>
      </NavDrawer>
      <div className={styles.content}>
        <div className={styles.field}>
          <Button appearance="primary" onClick={handleNavigationClick}>
            Navigate
          </Button>
          <Label id={multipleLabelId}>Categories</Label>
          <Switch
            checked={isMultiple}
            onChange={(_, data) => handleMultipleChange(_, data)}
            label={isMultiple ? 'Multiple' : 'Single'}
            aria-labelledby={multipleLabelId}
          />
        </div>
      </div>
    </div>
  );
};
```

### CustomMotion

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import type { DrawerProps } from '@fluentui/react-drawer';

export const CustomMotion = (): JSXElement => {
  const styles = useStyles();

  const typeLableId = useId('type-label');
  const linkLabelId = useId('link-label');
  const multipleLabelId = useId('multiple-label');

  const [isOpen, setIsOpen] = React.useState(true);
  const [enabledLinks, setEnabledLinks] = React.useState(true);
  const [type, setType] = React.useState<DrawerType>('inline');
  const [isMultiple, setIsMultiple] = React.useState(true);

  // Tabster prop used to restore focus to the navigation trigger for overlay nav drawers
  const restoreFocusTargetAttributes = useRestoreFocusTarget();

  const linkDestination = enabledLinks ? 'https://www.bing.com' : '';

  return (
    <div className={styles.root}>
      <NavDrawer
        defaultSelectedValue="2"
        defaultSelectedCategoryValue=""
        open={isOpen}
        type={type}
        multiple={isMultiple}
        onOpenChange={(_, data) => setIsOpen(data.open)}
        surfaceMotion={{ children: (_, props) => <DrawerMotion {...props} /> }}
        className={styles.nav}
      >
        <NavDrawerBody>
          <AppItem icon={<PersonCircle32Regular />} as="a" href={linkDestination}>
            Contoso HR
          </AppItem>
          <NavItem href={linkDestination} icon={<Dashboard />} value="1">
            Dashboard
          </NavItem>
          <NavItem href={linkDestination} icon={<Announcements />} value="2">
            Announcements
          </NavItem>
          <NavItem href={linkDestination} icon={<EmployeeSpotlight />} value="3">
            Employee Spotlight
          </NavItem>
          <NavItem icon={<Search />} href={linkDestination} value="4">
            Profile Search
          </NavItem>
          <NavItem icon={<PerformanceReviews />} href={linkDestination} value="5">
            Performance Reviews
          </NavItem>
          <NavSectionHeader>Employee Management</NavSectionHeader>
          <NavCategory value="6">
            <NavCategoryItem icon={<JobPostings />}>Job Postings</NavCategoryItem>
            <NavSubItemGroup>
              <NavSubItem href={linkDestination} value="7">
                Openings
              </NavSubItem>
              <NavSubItem href={linkDestination} value="8">
                Submissions
              </NavSubItem>
            </NavSubItemGroup>
          </NavCategory>
          <NavItem icon={<Interviews />} value="9">
            Interviews
          </NavItem>

          <NavSectionHeader>Benefits</NavSectionHeader>
          <NavItem icon={<HealthPlans />} value="10">
            Health Plans
          </NavItem>
          <NavCategory value="11">
            <NavCategoryItem icon={<Person />} value="12">
              Retirement
            </NavCategoryItem>
            <NavSubItemGroup>
              <NavSubItem href={linkDestination} value="13">
                Plan Information
              </NavSubItem>
              <NavSubItem href={linkDestination} value="14">
                Fund Performance
              </NavSubItem>
            </NavSubItemGroup>
          </NavCategory>

          <NavSectionHeader>Learning</NavSectionHeader>
          <NavItem icon={<TrainingPrograms />} value="15">
            Training Programs
          </NavItem>
          <NavCategory value="16">
            <NavCategoryItem icon={<CareerDevelopment />}>Career Development</NavCategoryItem>
            <NavSubItemGroup>
              <NavSubItem href={linkDestination} value="17">
                Career Paths
              </NavSubItem>
              <NavSubItem href={linkDestination} value="18">
                Planning
              </NavSubItem>
            </NavSubItemGroup>
          </NavCategory>
          <NavDivider />
          <NavItem target="_blank" icon={<Analytics />} value="19">
            Workforce Data
          </NavItem>
          <NavItem href={linkDestination} icon={<Reports />} value="20">
            Reports
          </NavItem>
        </NavDrawerBody>
      </NavDrawer>

      <ContentMotion visible={isOpen}>
        <div className={styles.content}>
          <Tooltip content="Toggle navigation pane" relationship="label">
            <Hamburger onClick={() => setIsOpen(!isOpen)} {...restoreFocusTargetAttributes} aria-expanded={isOpen} />
          </Tooltip>

          <div className={styles.field}>
            <Label id={typeLableId}>Type</Label>
            <RadioGroup
              value={type}
              onChange={(_, data) => setType(data.value as DrawerType)}
              aria-labelledby={typeLableId}
            >
              <Radio value="overlay" label="Overlay (Default)" />
              <Radio value="inline" label="Inline" />
            </RadioGroup>
            <Label id={linkLabelId}>Links</Label>
            <Switch
              checked={enabledLinks}
              onChange={(_, data) => setEnabledLinks(!!data.checked)}
              label={enabledLinks ? 'Enabled' : 'Disabled'}
              aria-labelledby={linkLabelId}
            />
            <Label id={multipleLabelId}>Allow multiple expanded categories</Label>
            <Switch
              checked={isMultiple}
              onChange={(_, data) => setIsMultiple(!!data.checked)}
              label={isMultiple ? 'Multiple' : 'Single'}
              aria-labelledby={multipleLabelId}
            />
          </div>
        </div>
      </ContentMotion>
    </div>
  );
};

CustomMotion.parameters = {
  docs: {
    description: {
      story:
        'NavDrawer animations can be customized using the [Motion APIs](?path=/docs/motion-apis-createpresencecomponent--docs), together with the `surfaceMotion` prop.',
    },
  },
};
```

## Best Practices

### Do's

- Give every NavItem and NavSubItem a unique, stable string value — selection, defaultSelectedValue, selectedValue, defaultSelectedCategoryValue and selectedCategoryValue are all keyed by those values, so duplicates make the selected state ambiguous.
- Pick one state model per navigation: uncontrolled with defaultSelectedValue, defaultSelectedCategoryValue and defaultOpenCategories, or controlled with selectedValue, selectedCategoryValue and openCategories plus the onNavItemSelect and onNavCategoryItemToggle callbacks. The default and controlled variants are mutually exclusive.
- Pass selectedCategoryValue whenever the selected entry is a NavSubItem so the parent NavCategory still shows a selected cue while it is collapsed.
- Use NavSectionHeader for group labels, NavDivider for visual separation, and AppItem or AppItemStatic for the identity row instead of inventing custom markup inside the navigation.
- Choose density deliberately: small for narrow rails and compact shells, medium (the default) for full-size navigation, and size the icons to match — the density examples pair 24px icons with small density and 32px icons with medium density.
- Set multiple to false when the design is an accordion where only one category is expanded at a time, and keep that intent consistent between the prop and your toggle handler.
- When a nav item needs a secondary action such as pin or overflow, compose SplitNavItem with Menu, MenuTrigger and MenuPopover and give the toggle button a descriptive tooltip.
- Provide a labelled trigger for collapsible navigation — a Hamburger wrapped in a Tooltip with relationship label is the established pattern — and make sure the surrounding drawer is keyboard reachable.
- Keep navigation labels short and parallel, and use tooltips only for genuinely icon-only affordances rather than to restate the visible label.

### Don'ts

- Don't combine selectedValue with defaultSelectedValue, selectedCategoryValue with defaultSelectedCategoryValue, or openCategories with defaultOpenCategories — mixing the controlled and uncontrolled pairs produces confusing, partially ignored state.
- Don't use the empty string as a real item value; empty string is the documented sentinel that means no selection.
- Don't leave values off items or categories, and don't reuse the same value in two places — selection and category tracking depend on those identifiers being present and unique.
- Don't pass openCategories in controlled mode without updating it in onNavCategoryItemToggle, otherwise categories will appear frozen because Nav never mutates the controlled array for you.
- Don't nest a NavSubItemGroup inside another NavSubItemGroup; the supported structure is one category level containing a single level of sub-items.
- Don't place arbitrary form controls, cards or free-form layout inside the navigation list — the composite keyboard model assumes the children are navigation entries.
- Don't repurpose Nav for tabbed content within one page or for transient command menus; those are TabList and Menu responsibilities.
- Don't try to restyle internal wrappers — Nav only exposes the root slot, so reach into the child components' own styling surfaces rather than targeting internal DOM.
- Don't override colors with hard-coded values; hard-coded colors break dark, high-contrast and custom brand themes that the token system normally handles.

## Anti-Patterns

### Mixing controlled and uncontrolled selection

❌ Passing selectedValue and defaultSelectedValue together, or openCategories and defaultOpenCategories together, leaves Nav with two competing sources of truth and produces state that updates inconsistently.

✅ Choose one model per navigation. Use the default props for self-managing navigation, or the controlled props with their callbacks when the app needs to own state, and remove the counterpart props entirely.

### Missing or duplicated item values

❌ Nav keys selection and category tracking off string values. Items without values or with reused values cannot be selected reliably, and the selected indicator can appear on the wrong entry.

✅ Assign a unique, stable value to every NavItem, NavCategory, NavCategoryItem and NavSubItem, and keep the selected/category values you pass in referring to those same identifiers.

### Controlled categories that never update

❌ Supplying openCategories without updating it in onNavCategoryItemToggle makes categories appear broken — the user clicks, the callback fires, but nothing expands because Nav never mutates a controlled array.

✅ Recompute openCategories in the toggle handler, adding or removing the reported category value, and apply the multiple flag yourself when single-expand behavior is required.

### Losing the selection cue in a collapsed category

❌ When only selectedValue is updated and the selected entry lives in a sub-item group, collapsing the parent category hides all indication of where the user is.

✅ Also set selectedCategoryValue to the parent category's value in the same selection handler so the collapsed category continues to render as selected.

### Deeply nested or overloaded navigation

❌ Nested sub-item groups and non-navigation content inside the list break the composite keyboard model and make the hierarchy hard to scan.

✅ Keep a single level of sub-items per category, move extra structure into separate pages or a Tree, and push secondary actions into SplitNavItem with a Menu instead of adding controls inline.

### Hard-coded colors for nav states

❌ Literal color values for selected, hover and focus states do not respond to dark theme, high-contrast mode or brand themes, and often fail contrast requirements.

✅ Style with design tokens such as tokens.colorNeutralForeground2, tokens.colorSubtleBackgroundSelected and tokens.colorCompoundBrandForeground1 so every theme and forced-color mode stays coherent.

## Accessibility

**Requirements**: Navigation must meet WCAG 2.1 AA: it needs to be reachable and fully operable from the keyboard, expose a labelled navigation landmark when more than one navigation region exists on the page, and announce selection and expansion state programmatically rather than through color alone. Every interactive entry needs a visible focus indicator, and selected, hover and focus states must keep sufficient contrast against the navigation surface — which the token system provides. Icon-only controls such as the drawer trigger or a SplitNavItem toggle button need accessible names. Text must remain readable at the chosen density, and targets should be large enough to activate comfortably, which is one reason small density is intended for compact rails rather than dense touch layouts.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the navigation when tabbing is enabled on the surrounding drawer, and moves out to the next focusable element after the navigation. |
| `Enter` | Activates the focused NavItem or NavSubItem, following its href if one is provided and raising onNavItemSelect. |
| `Space` | Selects the focused navigation entry, or expands and collapses the focused NavCategoryItem and raises onNavCategoryItemToggle. |
| `ArrowDown` | Moves focus to the next entry in the navigation. |
| `ArrowUp` | Moves focus to the previous entry in the navigation. |
| `ArrowRight` | Expands the focused NavCategoryItem and moves focus into its sub-items. |
| `ArrowLeft` | Collapses the focused NavCategoryItem, or returns focus from a NavSubItem to its parent category item. |
| `Home` | Moves focus to the first entry in the navigation. |
| `End` | Moves focus to the last entry in the navigation. |
| `Escape` | Closes an overlay navigation drawer that hosts the Nav and returns focus to its trigger. |

**ARIA**: role navigation on the root container, aria-label or aria-labelledby on the navigation region when multiple navigation landmarks exist, aria-current on the item that represents the selected destination, aria-expanded on a NavCategoryItem to expose open and closed state, aria-controls linking a NavCategoryItem to the sub-item group it expands, aria-hidden on decorative icons inside NavItem, NavCategoryItem and AppItem, aria-label on icon-only controls such as the Hamburger drawer trigger or a SplitNavItem toggle button, aria-labelledby when navigation controls are labelled by an external Label element, as in the drawer examples

**Screen Reader**: A screen reader announces the navigation as a landmark with its accessible name, then reads each entry's text as the user moves through the tree. The selected destination is announced as the current item rather than only being colored, and a NavCategoryItem reports its expanded or collapsed state together with its name when focus lands on it. Because selectedCategoryValue keeps a category marked as selected when one of its children is the active destination, a collapsed category can still be announced as containing the current page. NavSectionHeader text is read as a label for the group that follows it rather than as a link, and items carrying an href are announced as links while non-link items are announced as selectable entries. Icon-only affordances such as the drawer trigger are announced only through their label or tooltip text, so those labels must be meaningful.

## Styling

Nav exposes only a single root slot, so a className applied to Nav reaches the outer container; everything inside must be styled through the child components or their own class names. For custom surfaces use the theme tokens rather than literals: tokens.colorNeutralBackground1 for the navigation surface, tokens.colorSubtleBackground with tokens.colorSubtleBackgroundHover, tokens.colorSubtleBackgroundPressed and tokens.colorSubtleBackgroundSelected for item states, and tokens.colorNeutralForeground1 / tokens.colorNeutralForeground2 (plus their Hover, Pressed and Selected variants) for text so selected and unselected rows stay legible. The selected indicator bar on a selected item is driven by accent tokens such as tokens.colorCompoundBrandForeground1 and tokens.colorCompoundBrandStroke, and focus visuals use tokens.colorStrokeFocus2. Spacing and shape come from tokens.spacingHorizontalS, tokens.spacingHorizontalM, tokens.spacingVerticalXS, tokens.spacingVerticalS and tokens.borderRadiusMedium; enforce consistent rhythm by keeping density at the Nav level instead of overriding per item. Typography uses tokens.fontFamilyBase with tokens.fontSizeBase300 and tokens.lineHeightBase300 at medium density, and smaller scale tokens at small density, while a selected entry typically raises weight with tokens.fontWeightSemibold. Expand and collapse transitions read well with tokens.durationNormal and curve tokens, and NavDivider separation uses neutral stroke tokens such as tokens.colorNeutralStroke2. Custom drawer surfaces and motion are handled by NavDrawer rather than by Nav itself.

## Performance

Selection and expansion state live on the Nav root, so any change re-renders the navigation and its descendants unless child components are memoized. Keep onNavItemSelect and onNavCategoryItemToggle stable with useCallback in controlled scenarios, and avoid recreating icon elements inside large render loops so memoized items are not invalidated. All categories and their sub-item groups are part of the same tree, so a very large navigation with many categories increases first-render and layout cost; consider splitting secondary sections out of the primary navigation or moving large content sets to their own pages. Prefer the overflow pattern provided by SplitNavItem with Menu rather than rendering hundreds of items, and avoid heavy layout work in per-item styling by relying on token-based padding and density instead of computing sizes per render.

## Theming & Tokens

Nav resolves its appearance entirely from the active FluentProvider theme. Item text uses tokens.colorNeutralForeground1 and tokens.colorNeutralForeground2 with their Hover, Pressed and Selected variants; item backgrounds follow tokens.colorSubtleBackground and its Hover, Pressed and Selected counterparts; the selected indicator and brand accents use tokens.colorCompoundBrandForeground1 and tokens.colorCompoundBrandStroke, which map to the theme's brand ramp. Focus visuals use tokens.colorStrokeFocus2, and structural details such as NavDivider use neutral stroke tokens like tokens.colorNeutralStroke2. Density maps onto spacing and typography tokens rather than fixed pixel values, so switching between small and medium adjusts row heights and type scale consistently. Because every child component reads the same tokens, swapping light, dark, high-contrast or custom brand themes restyles the whole navigation automatically — which is why custom colors should always be expressed as token overrides rather than literals. Surface elevation for a collapsed or overlay navigation is provided by the enclosing drawer component, not by Nav itself.

## Migration Notes

Compared with Fluent UI React v8, v9 splits navigation into composable parts: Nav is the root, with NavItem, NavCategory, NavCategoryItem, NavSubItem, NavSubItemGroup, NavSectionHeader and NavDivider as sibling components instead of a single Nav configured through groups and links props. Selection is expressed as string values — selectedValue, defaultSelectedValue, selectedCategoryValue and defaultSelectedCategoryValue — with empty string meaning no selection, replacing the older key-based selection model. Expansion is driven by openCategories, defaultOpenCategories and the multiple flag rather than by group collapsed state. Eventing moves to onNavItemSelect and onNavCategoryItemToggle, which deliver selection data containing the item value and, for children of a category, the enclosing category value. Density is now an explicit NavDensity choice of small or medium instead of ad-hoc compact styling, and styling moves from SCSS and theme palette references to Griffel styles and design tokens. Drawer integration is provided by NavDrawer, NavDrawerHeader, NavDrawerBody and NavDrawerFooter instead of a navigation-specific shell.

## Edge Cases

- The empty string is a meaningful sentinel: passing it as selectedValue, defaultSelectedValue, selectedCategoryValue or defaultSelectedCategoryValue means no selection, so empty string cannot be used as an actual item value.
- multiple defaults to true, so categories expand independently unless you explicitly opt into single-category behavior; in controlled mode you must enforce that rule yourself in onNavCategoryItemToggle.
- In controlled mode Nav performs no internal mutation — if your callbacks do not write back new selected and open values, clicks appear to do nothing even though the events fire.
- Nav declares only a root slot, so internal wrappers cannot be targeted or overridden; styling must go through the root class name or the individual child components.
- onNavItemSelect only reports a category value when the selected entry is a child of a category; top-level items and items outside categories report the item value alone.
- Category values and sub-item values share the same string namespace, so keep them unique across the entire navigation to avoid collisions in selection and expansion state.
- Density is a Nav-level concern that children inherit; changing it in one place expects corresponding change to icon sizes, as the density examples show with 24px icons at small density and 32px icons at medium density.
- When hosted in a drawer, keyboard access depends on the drawer being reachable through its trigger or through the tabbable option used in the controlled example; a navigation that is visually rendered but not reachable by keyboard cannot be used at all.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
