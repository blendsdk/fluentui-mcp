# Nav

> **Package**: `@fluentui/react-nav` v9.4.0
> **Import**: `import { Nav } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

Nav is the Fluent UI React v9 composition-based navigation component used to build primary and secondary navigation surfaces such as app drawers, side rails, and settings panes. It pairs with the Nav drawer parts — NavDrawer, NavDrawerHeader, and NavDrawerBody — and with the nav item family: AppItem and AppItemStatic for the application identity row, NavItem for leaf destinations, NavSectionHeader for grouping labels, NavCategory plus NavCategoryItem and NavSubItemGroup and NavSubItem for expandable nested destinations, NavDivider for separation, and SplitNavItem for items that combine a destination with a secondary action. Selection and expansion are value-based: every NavItem, NavSubItem, and NavCategory is identified by a string value, and the selected and open state is expressed either uncontrollably through defaultSelectedValue, defaultSelectedCategoryValue, and defaultOpenCategories, or controllably through selectedValue, selectedCategoryValue, and openCategories. A single Nav supports multiple simultaneously open categories by default, and vertical rhythm is controlled with the density prop, which accepts a NavDensity of medium or small and cascades to all child items. Nav renders a single root slot and delegates its visual surface, animation, and layout to the NavDrawer family, which means motion and drawer presentation are configured on the drawer rather than on Nav itself.

**When to use**: Use Nav when users need to move between top-level destinations and sections of an application, especially when the destination list is hierarchical and needs expandable categories. It is the right choice for persistent app shells, settings hubs, and admin consoles where one destination stays selected while the user works, and where the set of destinations is stable enough to render alongside content. Choose Nav over Menu when the list is navigational rather than a set of transient commands, and when you want the selection to remain visible after activation. Choose Nav over Tabs when destinations are separate routes or views rather than sibling panels of the same object, and when the list can be long, nested, or scrollable. Choose Nav over Tree when the hierarchy is shallow (one level of expandable categories with leaf sub items) and the primary interaction is navigation rather than data manipulation. Choose Nav over Breadcrumb when users need lateral movement between peers rather than an upward path, and over Link collections when you need selection state, expansion state, density control, and iconography. Combine Nav with NavDrawer when the navigation should be collapsible, overlay on small screens, or animate in and out.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `defaultOpenCategories` | `string[] \| undefined` | — | No | Set of categories that are opened by default. Typically useful when the openCategories is uncontrolled. |
| `defaultSelectedCategoryValue` | `string \| undefined` | — | No | The value of the navCategory to be selected by default. Typically useful when the selectedValue is uncontrolled. Mutually exclusive with selectedValue. Empty string indicates no selection. |
| `defaultSelectedValue` | `string \| undefined` | — | No | The value of the navItem to be selected by default. Typically useful when the selectedValue is uncontrolled. Mutually exclusive with selectedValue. Empty string indicates no selection. |
| `density` | `NavDensity \| undefined` | `'medium'` | No | The vertical density of the Nav and it's children |
| `multiple` | `boolean \| undefined` | `true, indicating that multiple categories can be open at the same time.` | No | Indicates if Nav supports multiple open Categories at the same time. |
| `onNavCategoryItemToggle` | `any` | — | No | Callback raised when a NavCategoryItem is toggled. |
| `onNavItemSelect` | `any` | — | No | Raised when a navItem is selected. If the navItem is child of a category, the categoryValue will be provided |
| `openCategories` | `string[] \| undefined` | — | No | Controls the open categories. For use in controlled scenarios. |
| `selectedCategoryValue` | `string \| undefined` | `undefined` | No | Indicates a category that has a selected child Will show the category as selected if it is closed. |
| `selectedValue` | `string \| undefined` | `undefined` | No | The value of the currently selected navItem. Mutually exclusive with defaultSelectedValue. |

### Prop Guidance

- **selectedValue**: Use in controlled scenarios when selection is driven by routing or external state. It identifies the currently selected nav item by its value string and is mutually exclusive with defaultSelectedValue. Update it from onNavItemSelect so the highlighted item always matches the rendered view. `dashboard`
- **defaultSelectedValue**: Use for uncontrolled selection when you only need an initial highlight and do not need to read or drive selection afterwards. It is mutually exclusive with selectedValue, and an empty string expresses that nothing is initially selected. `dashboard`
- **selectedCategoryValue**: Set this to the category value that owns the currently selected child. It keeps the parent category visually selected even when the category is collapsed, which preserves the user's sense of location in the hierarchy. Pair it with selectedValue in controlled mode. `employee-management`
- **defaultSelectedCategoryValue**: The uncontrolled counterpart of selectedCategoryValue. Use it to seed the initially selected category when selection is not controlled, and use an empty string when no category should appear selected at first render. `employee-management`
- **openCategories**: Controls which categories are expanded. Supply an array of category values and update it in onNavCategoryItemToggle; without a handler the categories will never open or close because the component no longer manages the state itself. Use it when expansion must be restored, shared across sessions, or coordinated with selectedCategoryValue. `["employee-management"]`
- **defaultOpenCategories**: Use for uncontrolled expansion when you only need to decide which branches start open. It pairs with the uncontrolled selection props and should be omitted once you take ownership of openCategories. `["employee-management"]`
- **onNavItemSelect**: The primary activation callback, raised when a nav item or sub item is selected. The callback data includes the item value and, when the item lives inside a category, the categoryValue; use both to update selectedValue and selectedCategoryValue and to trigger routing. `(event, data) => navigate(data.value, data.categoryValue)`
- **onNavCategoryItemToggle**: Raised when a category item is expanded or collapsed. Required for controlled expansion so you can add or remove the category value from openCategories, and enforce single-open behavior yourself when the multiple prop is false. `(event, data) => toggleCategory(data.categoryValue)`
- **multiple**: Defaults to true, allowing several categories to be open simultaneously, which suits broad exploration. Set it to false when the navigation should behave like an accordion or when vertical space is tight; in controlled mode your toggle handler must also close the previously open category, since the prop constrains but does not mutate your state. `false`
- **density**: Controls the vertical density of Nav and all of its children. Use medium for touch-friendly, standalone navigation and small for dense app shells where many destinations must fit beside content; remember to scale icon sizes with the density so rows do not look mismatched. `small`

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

- Give every NavItem, NavSubItem, and NavCategory a unique, stable string value and persist those values in routing state so selection survives reloads and deep links.
- Pick one paradigm per concern: use selectedValue and selectedCategoryValue for controlled selection, or defaultSelectedValue and defaultSelectedCategoryValue for uncontrolled selection, and never both for the same concern.
- Update selectedValue and selectedCategoryValue together from onNavItemSelect, using the categoryValue provided in the callback data, so a selected child keeps its parent category visibly selected even when the category is collapsed.
- Wire onNavCategoryItemToggle whenever you use openCategories, since a controlled open list will not change unless your handler updates it; when you leave it uncontrolled, rely on defaultOpenCategories to seed the initially expanded branches.
- Use NavSectionHeader and NavDivider to chunk long destination lists into scannable groups, and keep labels short and parallel in grammar.
- Provide an icon for each top-level NavItem and for NavCategoryItem labels, and set the density explicitly so icon size matches item height — small density pairs with smaller icons and medium density with larger ones.
- Set the multiple prop deliberately: keep the default of true for exploration-oriented navigation and set it to false when only one branch should be expanded at a time, such as in narrow drawers.

### Don'ts

- Do not pass selectedValue together with defaultSelectedValue, or selectedCategoryValue together with defaultSelectedCategoryValue; they are mutually exclusive and the component will warn or behave unpredictably.
- Do not use Nav for transient command menus, inline view switching, or arbitrary hierarchical data browsing — Menu, Tabs, and Tree cover those cases with better interaction semantics.
- Do not set selectedValue for a nested destination without also setting selectedCategoryValue, which leaves the collapsed parent category appearing unselected and breaks the user's sense of location.
- Do not use an empty string as a real destination value, because an empty string is reserved for expressing that nothing is selected.
- Do not set the multiple prop to false while supplying an openCategories array containing more than one category; the controlled list and the single-open constraint will conflict.
- Do not put long, wrapping sentences in NavItem or NavSubItem labels; wrapping items change row height mid-list and make the navigation hard to scan.
- Do not manage openCategories state inside child components or duplicate it in several places; keep a single source of truth for what is expanded so toggles stay in sync.

## Anti-Patterns

### Controlled and uncontrolled selection at the same time

❌ Passing selectedValue alongside defaultSelectedValue, or selectedCategoryValue alongside defaultSelectedCategoryValue, means two sources of truth are competing; the highlighted item can stop matching the rendered view and the behavior becomes unpredictable.

✅ Choose one paradigm per concern. Use the default-prefixed props for simple, uncontrolled navigation, or the plain props plus onNavItemSelect for controlled navigation driven by routing state — never both for selection or for the selected category.

### Controlled categories without a toggle handler

❌ Supplying openCategories but leaving onNavCategoryItemToggle undefined freezes the navigation: clicking a category item raises a callback nobody listens to, so nothing expands and the control appears broken.

✅ Whenever openCategories is provided, also handle onNavCategoryItemToggle and update the array — appending the categoryValue when opening, removing it when closing, and respecting the multiple prop when only one category may be open.

### Nested selection without the parent category marked selected

❌ Setting selectedValue to a sub item value while leaving selectedCategoryValue unset means the collapsed parent category shows no selected state, so users lose their position as soon as the branch is closed.

✅ Always set selectedCategoryValue to the categoryValue supplied by onNavItemSelect when the activated item is nested, so the parent renders as selected even while collapsed.

### Overloading Nav with command or content semantics

❌ Repurposing Nav for transient command menus, tab-like panel switching, or browsing arbitrary data forces awkward selection semantics and duplicates behavior that dedicated components handle with proper roles and keyboard interactions.

✅ Use Menu for commands and overflow actions, Tabs for switching between sibling views of the same object, and Tree for browsing hierarchical data. Keep Nav for destination navigation where a persistent selected item matters.

### Relying on the empty string as a destination value

❌ An empty string is reserved to mean that no item or category is selected, so an item whose value is the empty string cannot be reliably selected or distinguished from the cleared state.

✅ Assign stable, non-empty value strings to every NavItem, NavSubItem, and NavCategory, and use the empty string only when you intentionally want to clear selection.

## Accessibility

**Requirements**: Nav must expose a navigation landmark with an accessible name so assistive technology can distinguish it from other navigational regions on the page; supply that name with aria-label or aria-labelledby on the navigation container. Selection must not be conveyed by color alone — the default styling also changes background and adds an accent indicator, and any custom styling must preserve a distinguishable selected state that meets WCAG 2.1 AA non-text contrast of at least 3:1 against adjacent colors. Label text must meet 4.5:1 contrast, focus indicators must remain visible against the drawer surface, and every interactive item must be reachable and operable with the keyboard. Decorative icons inside items should be hidden from assistive technology, and a text label must always accompany or replace an icon so an item is never identified only by a glyph. When the drawer itself is collapsible, the trigger control should expose its expanded state so users can tell whether the navigation is currently visible.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the navigation and, when the drawer is configured for tabbing, advances through nav items, category items, and sub items in visual order before leaving the region. |
| `Shift+Tab` | Moves focus backwards out of or through the navigation items in reverse order. |
| `ArrowDown` | Moves focus to the next visible nav item or category item in the navigation. |
| `ArrowUp` | Moves focus to the previous visible nav item or category item in the navigation. |
| `ArrowRight` | Expands a focused category item, revealing its NavSubItemGroup, or moves focus into the category's sub items when it is already open. |
| `ArrowLeft` | Collapses a focused, expanded category item, or moves focus from a sub item back to its parent category item. |
| `Enter` | Activates the focused nav item or sub item, raising onNavItemSelect, and toggles a focused category item, raising onNavCategoryItemToggle. |
| `Space` | Toggles a focused category item open or closed, and activates a focused item that behaves as a button rather than a link. |
| `Home` | Moves focus to the first navigable item in the navigation. |
| `End` | Moves focus to the last navigable item in the navigation. |

**ARIA**: aria-label, aria-labelledby, aria-expanded, aria-current, aria-disabled, aria-hidden

**Screen Reader**: Screen readers announce the region as a navigation landmark using its aria-label or aria-labelledby name, then read each nav item as a link or button with its visible label and any accompanying icon ignored as decorative. Category items are announced as expandable controls whose collapsed or expanded state comes from aria-expanded, and toggling a category announces the new state without moving focus away from the category item. The currently selected destination is announced as the current item, and when a sub item is selected inside a collapsed category, the parent category still reports itself as selected so users know where they are. Disabled items are announced as unavailable, and if you build a custom trigger for a collapsible drawer, its aria-expanded value communicates whether the navigation pane is currently visible.

## Styling

Style Nav through className on NavDrawer and the item components rather than trying to target internal markup. Item hover states use tokens.colorSubtleBackgroundHover with tokens.colorNeutralForeground2Hover for the label; pressed states use tokens.colorSubtleBackgroundPressed; the selected row pairs a background such as tokens.colorNeutralBackground1Selected or tokens.colorSubtleBackgroundSelected with tokens.colorNeutralForeground2BrandSelected or tokens.colorBrandForeground1 for the text, plus an accent bar or dot built from tokens.colorCompoundBrandBackground or tokens.colorCompoundBrandForeground1. Left accent indicators are typically drawn with a border or pseudo element using tokens.borderRadiusCircular and a width of one or two spacing units, and row padding follows the density pattern — tokens.spacingVerticalMNudge and tokens.spacingHorizontalMNudge for medium density, tightening toward tokens.spacingVerticalSNudge or tokens.spacingVerticalXS for small density, since density scales the vertical padding tokens used by every child item. Icon slots should be sized to match the row: a smaller icon with small density and a larger icon with medium density, with the glyph inheriting tokens.colorNeutralForeground2 and switching to the brand foreground tokens when its row is selected. NavDivider and category boundaries commonly use tokens.colorNeutralStroke2 or tokens.colorNeutralStroke1 with a one pixel border, and section headers use tokens.fontSizeBase200 with tokens.colorNeutralForeground3 and tokens.fontWeightSemibold. Use tokens.borderRadiusMedium for item rounding and tokens.colorTransparentBackground for the default item surface so hover and selection layers show through cleanly. If you override label typography, keep tokens.fontSizeBase300 and tokens.lineHeightBase300 for medium density and step down one size for small density so rows stay aligned.

## Performance

Nav renders its entire child tree eagerly — there is no virtualization — so keep the destination list proportionate and prefer collapsing rarely used branches into NavCategory rather than rendering hundreds of flat items. Large pages of sub items are still mounted while a category is collapsed if you render them yourself, so render sub item groups conditionally when the list is very large. Hooks that build openCategories or selection values should not create new arrays on every render, and handler identities in onNavItemSelect and onNavCategoryItemToggle should be memoized so that item rows do not re-render on unrelated parent updates. Density changes restyle every child through shared tokens, so toggle density at a stable boundary rather than animating it per item. Custom motion supplied to the drawer, as in the custom motion example, adds animation work on open and close; keep motion to transform and opacity so it stays on the compositor, and let the default surface motion handle presentation unless you have a specific need.

## Theming & Tokens

Nav is fully token-driven and reads its values from the nearest FluentProvider theme, so switching between light, dark, and high-contrast themes recolors the whole navigation without component-level changes. Item labels use tokens.colorNeutralForeground1, secondary labels and icons use tokens.colorNeutralForeground2 with tokens.colorNeutralForeground2Hover on hover, and section headers drop back to tokens.colorNeutralForeground3. Surfaces come from tokens.colorTransparentBackground for resting items, tokens.colorSubtleBackgroundHover and tokens.colorSubtleBackgroundPressed for interaction, and tokens.colorNeutralBackground1Selected or tokens.colorSubtleBackgroundSelected for the selected row. Selection emphasis and accent indicators are drawn from tokens.colorCompoundBrandBackground, tokens.colorCompoundBrandForeground1, or tokens.colorNeutralForeground2BrandSelected depending on whether the item is brand or neutral styled, and separators use tokens.colorNeutralStroke2. Density maps to spacing tokens — medium rows build from tokens.spacingVerticalMNudge while small rows tighten to tokens.spacingVerticalSNudge or tokens.spacingVerticalXS — and typography follows tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.fontSizeBase200, tokens.lineHeightBase300, and tokens.fontWeightSemibold for grouped headers. The surrounding NavDrawer picks up tokens.colorNeutralBackground1 or tokens.colorNeutralBackground2 for its surface and elevation tokens for overlay presentation, and any custom motion should reuse tokens.durationNormal, tokens.durationFaster, and tokens.curveEasyEase so animations respect theme timing.

## Migration Notes

Nav in v9 is composition-based: instead of describing destinations as a data structure, you declare NavItem, NavCategory, NavCategoryItem, NavSubItemGroup, NavSubItem, NavSectionHeader, and NavDivider as children, with AppItem or AppItemStatic as the application identity row. Selection is value-based, so items are identified by their value string rather than by an object key, and the selection props are named selectedValue, defaultSelectedValue, selectedCategoryValue, and defaultSelectedCategoryValue. Expansion is separate from selection: use defaultOpenCategories for uncontrolled expansion and openCategories plus onNavCategoryItemToggle for controlled expansion, and the multiple prop governs whether more than one category may be open at once. Migration between paradigms is incremental — start with the default-prefixed props for simple cases, then switch to the controlled props and the two selection or toggle callbacks when you need persistence, deep linking, or synchronization with a router. Drawer presentation, overlay behavior, and animation are now owned by NavDrawer; the drawer also accepts a tabbable option to switch the navigation between arrow-key focus movement and sequential tabbing.

## Edge Cases

- An empty string for defaultSelectedValue, defaultSelectedCategoryValue, or the equivalent controlled props is a meaningful value that indicates no selection, as shown in the basic example where the selected category is cleared with an empty string; do not use an empty string as a real item value.
- In controlled mode the multiple prop does not mutate your openCategories array — with multiple set to false you must also clear the other open category values inside onNavCategoryItemToggle, or several categories will remain expanded.
- A category whose child is selected can be collapsed and still appear selected via selectedCategoryValue, so custom item styling must not hide the selected affordance when the sub item group is not rendered.
- Density changes the height of every row, which means icons sized for medium density look oversized and misaligned in small density; the split items example swaps between a smaller and a larger person icon depending on the density value.
- Long labels wrap inside rows and change the row height, breaking the uniform rhythm of the list; the basic example deliberately demonstrates wrapping text, but production navigation should use short labels or tooltips for long destinations.
- Values must be unique across NavItem, NavSubItem, and NavCategory because selection and expansion are both keyed by value strings; duplicates make it impossible to tell which row is selected or opened.
- The navigation pane can be toggled with a drawer trigger that carries its own expanded state, as in the basic example where the hamburger exposes aria-expanded; if you build a custom trigger, replicate that state so screen readers know whether the pane is open.

## See Also

- - [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
