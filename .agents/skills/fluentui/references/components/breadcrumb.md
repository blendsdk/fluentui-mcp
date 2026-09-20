# Breadcrumb

> **Package**: `@fluentui/react-breadcrumb` v9.4.2
> **Import**: `import { Breadcrumb } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

Breadcrumb is a navigation component that communicates the user's current location within a hierarchical site or application structure and provides a path back to ancestor pages. In Fluent UI React v9 it is a lightweight composition container: Breadcrumb itself renders the root landmark and an ordered-list slot, while the visible trail is assembled by the consumer from BreadcrumbItem, BreadcrumbButton, and BreadcrumbDivider children. It exposes two behavioral props: size, which scales item and divider typography and spacing across small, medium, and large, and focusMode, which switches keyboard traversal between sequential Tab movement and Arrow-key roving focus. Because the item set is entirely consumer-authored, Breadcrumb supports links, buttons, icons, tooltips, truncated labels, and collapsed overflow menus without any dedicated configuration API.

**When to use**: Use Breadcrumb on secondary or deep pages where users need both a sense of location ('you are here') and a fast one-click route to an ancestor level, typically in the page header above the title and below the global navigation. It is the right choice for hierarchical drill-down structures such as file browsers, settings trees, documentation, or commerce category paths. Avoid it on top-level landing pages where the trail would have a single item, and do not use it as a substitute for primary navigation (Nav), a stepper, or a wizard: Breadcrumb describes an existing hierarchy rather than an ordered multi-step task, and it should not compete with the main navigation for visual weight. If you need to show progress through a sequence of steps the user must complete, choose a different pattern.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `focusMode` | `"arrow" \| "tab" \| undefined` | `'tab'` | No | Sets the focus behavior for the Breadcrumb.  `tab` This behaviour will cycle through all elements inside of the Breadcrumb when pressing the Tab key and then release focus after the last inner element.  `arrow` This behaviour will cycle through all elements inside of the Breadcrumb when pressing the Arrow key. |
| `size` | `"small" \| "medium" \| "large" \| undefined` | `'medium'` | No | Controls size of Breadcrumb items and dividers. |

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `list` | — | No | Ordered list which contains items. |
| `root` | — | Yes | Root element of the component. |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Breadcrumb, BreadcrumbItem, BreadcrumbDivider, BreadcrumbButton } from '@fluentui/react-components';
import { CalendarMonthFilled, CalendarMonthRegular, bundleIcon } from '@fluentui/react-icons';

export const Default = (): JSXElement => {
  return (
    <Breadcrumb aria-label="Breadcrumb default example">
      <BreadcrumbItem>
        <BreadcrumbButton href={path}>Item 1</BreadcrumbButton>
      </BreadcrumbItem>
      <BreadcrumbDivider />
      <BreadcrumbItem>
        <BreadcrumbButton href={path} icon={<CalendarMonth />}>
          Item 2
        </BreadcrumbButton>
      </BreadcrumbItem>
      <BreadcrumbDivider />
      <BreadcrumbItem>
        <BreadcrumbButton href={path}>Item 3</BreadcrumbButton>
      </BreadcrumbItem>
      <BreadcrumbDivider />
      <BreadcrumbItem>
        <BreadcrumbButton href={path} current>
          Item 4
        </BreadcrumbButton>
      </BreadcrumbItem>
    </Breadcrumb>
  );
};
```

### BreadcrumbSize

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Breadcrumb, BreadcrumbItem, BreadcrumbDivider, BreadcrumbButton } from '@fluentui/react-components';
import { bundleIcon, CalendarMonth20Filled, CalendarMonth20Regular } from '@fluentui/react-icons';

export const BreadcrumbSize = (): JSXElement => {
  return (
    <>
      <Breadcrumb aria-label="Small breadcrumb example with buttons" size="small">
        <BreadcrumbItem>
          <BreadcrumbButton>Item 1</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
          <BreadcrumbButton icon={<CalendarMonth />}>Item 2</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
          <BreadcrumbButton>Item 3</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
          <BreadcrumbButton current>Item 4</BreadcrumbButton>
        </BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb aria-label="Medium breadcrumb example with buttons" size="medium">
        <BreadcrumbItem>
          <BreadcrumbButton>Item 1</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
          <BreadcrumbButton icon={<CalendarMonth />}>Item 2</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
          <BreadcrumbButton>Item 3</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
          <BreadcrumbButton current>Item 4</BreadcrumbButton>
        </BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb aria-label="Large breadcrumb example with buttons" size="large">
        <BreadcrumbItem>
          <BreadcrumbButton>Item 1</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
          <BreadcrumbButton icon={<CalendarMonth />}>Item 2</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
          <BreadcrumbButton>Item 3</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
          <BreadcrumbButton icon={<CalendarMonth />} current>
            Item 4
          </BreadcrumbButton>
        </BreadcrumbItem>
      </Breadcrumb>
    </>
  );
};
```

### BreadcrumbWithOverflow

```tsx
import * as React from 'react';
import type { JSXElement, ButtonProps } from '@fluentui/react-components';
import type { PartitionBreadcrumbItems } from '@fluentui/react-components';

export const BreadcrumbWithOverflow = (): JSXElement => {
  return <BreadcrumbOverflowExample />;
};
```

## Best Practices

### Do's

- Always give the Breadcrumb an accessible name via aria-label so the navigation landmark is distinguishable from Nav, Toolbar, and any other landmark on the page.
- Keep the trail to a short, meaningful set of ancestors — typically three to five items — and collapse the middle with an overflow menu once it grows beyond that.
- Mark only the final item with the current flag on BreadcrumbButton so assistive technology announces the current location exactly once.
- Render intermediate items as navigable BreadcrumbButton links with an href so users can middle-click, open in a new tab, and copy the address.
- Match size to the surrounding surface: small inside dense panels, cards, and sidebars, medium as the default, and large for spacious marketing or landing surfaces.
- Place Breadcrumb near the top of the page, before the page title, so the location context is encountered early in both reading and screen-reader order.
- Provide a route back to the section root even when the trail is truncated, so collapsing never removes the most important ancestor.

### Don'ts

- Do not leave the Breadcrumb unlabeled — an unlabeled landmark forces screen reader users to guess which navigation region they have entered.
- Do not put the current page inside a link or use the current flag on intermediate items; the current item should not be interactive if it points to the page the user is already on.
- Do not nest interactive elements, such as a link inside a BreadcrumbButton or a button inside a BreadcrumbItem wrapper that is itself clickable, which produces invalid semantics and double focus stops.
- Do not build the trail from plain, non-interactive text for ancestors that the user can actually visit — that hides navigation that exists in the information architecture.
- Do not use Breadcrumb as primary navigation, a tab set, or a wizard step indicator; it describes hierarchy, not task progress or sibling switching.
- Do not mix sizes within a single trail or flip between focus modes across instances in the same view, which makes keyboard behavior unpredictable.
- Do not render a trail of ten or more uncollapsed items; long single-line trails wrap or overflow and become unreadable on narrow viewports.

## Accessibility

**Requirements**: Breadcrumb must satisfy WCAG 1.3.1 (the trail is exposed as an ordered list inside an identified navigation landmark), 2.4.4 (link purpose is clear from the item text, with icons treated as decorative), 2.4.6/2.4.8 (location within the hierarchy is programmatically and visually communicated), 2.4.7 (every focused item and divider-adjacent control shows a visible focus indicator), 1.4.3/1.4.11 (item text and the focus ring meet contrast minimums in all themes including high contrast), and 2.5.8 (interactive items and any overflow menu target meet minimum target size). The accessible name supplied to the Breadcrumb is what differentiates the landmark from other navigation regions on the page.

| Key | Action |
| --- | --- |
| `Tab` | With the default focusMode of 'tab', moves focus into the Breadcrumb to the first focusable item and then through each subsequent item inside the trail. |
| `Shift+Tab` | Moves focus backwards through the items and out of the Breadcrumb to the previous focusable element on the page, regardless of focus mode. |
| `ArrowRight` | With focusMode set to 'arrow', moves focus to the next item or divider-adjacent control in the trail (mirrored in right-to-left layouts). |
| `ArrowLeft` | With focusMode set to 'arrow', moves focus to the previous item in the trail (mirrored in right-to-left layouts). |
| `Enter` | Activates the focused BreadcrumbButton when it renders as a link, navigating to that ancestor level. |
| `Space` | Activates the focused BreadcrumbButton when it renders as a button rather than a link. |

**ARIA**: aria-label on the Breadcrumb root, naming the navigation landmark, aria-current set by the current flag on the final BreadcrumbButton, role semantics inherited from the native nav and ordered list elements rather than custom roles, aria-hidden on decorative divider glyphs and on purely decorative icons inside BreadcrumbButton so they are not announced

**Screen Reader**: A screen reader announces the Breadcrumb as a named navigation landmark followed by an ordered list, so users hear the item count and their position within the hierarchy. Each item is announced as a link or button with its visible text; the item carrying the current flag is additionally announced as the current page, which is why exactly one item should be marked current. Dividers are presentational and should contribute no speech. When the trail is collapsed, the overflow control is announced as a button that opens a menu listing the hidden ancestors, letting users reach every level even when it is not visually rendered.

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
