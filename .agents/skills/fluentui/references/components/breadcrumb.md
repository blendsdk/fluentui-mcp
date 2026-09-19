# Breadcrumb

> **Package**: `@fluentui/react-breadcrumb` v9.4.2
> **Import**: `import { Breadcrumb } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

Breadcrumb is a navigation component that displays the hierarchical path from an application or site root down to the page the user is currently viewing. It gives users an orientation cue about where they are in a deep information architecture and provides one-click shortcuts back to any ancestor level. In Fluent UI React v9 the component is compositional rather than data-driven: the Breadcrumb root renders the navigation landmark and its ordered list container, and you place BreadcrumbItem, BreadcrumbDivider, and BreadcrumbButton children inside it to build the trail. The root accepts a size prop that scales item typography, icons, and dividers together across small, medium, and large, and a focusMode prop that chooses whether the trail is traversed with Tab (the default) or with arrow keys, which is useful when the breadcrumb is one composite widget among many tab stops. Because items are ordinary links or buttons, each crumb participates in normal navigation semantics, including right-click, open-in-new-tab, and screen reader link lists. The last tray in the path is marked with the current flag on BreadcrumbButton so assistive technology identifies it as the current page rather than another destination.

**When to use**: Use Breadcrumb when a page lives inside a hierarchical structure at least two levels deep and users benefit from both an orientation cue and a fast way to move up one or more levels, such as in documentation sites, admin consoles, file explorers, and e-commerce category pages. It works best as a secondary navigation element placed near the top of a content region, below global navigation. Avoid Breadcrumb for primary or site-wide navigation (use Nav instead), for linear multi-step flows where the user must complete steps in order (use Tabs or a progress-driven wizard pattern instead), and for browsing between sibling views of the same object (use Tabs or a Menu). If the page has no meaningful hierarchy, or the trail would contain only a single crumb, do not render a Breadcrumb at all — a lone crumb communicates nothing and adds noise. Prefer Breadcrumb over a plain back link when users may need to jump more than one level up and when the full path itself is informative.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `focusMode` | `"arrow" \| "tab" \| undefined` | `'tab'` | No | Sets the focus behavior for the Breadcrumb.  `tab` This behaviour will cycle through all elements inside of the Breadcrumb when pressing the Tab key and then release focus after the last inner element.  `arrow` This behaviour will cycle through all elements inside of the Breadcrumb when pressing the Arrow key. |
| `size` | `"small" \| "medium" \| "large" \| undefined` | `'medium'` | No | Controls size of Breadcrumb items and dividers. |

### Prop Guidance

- **focusMode**: Controls how keyboard focus moves through the trail. Keep the default tab mode whenever crumbs are regular links, because users expect Tab to reach every link and be able to leave the trail after the last crumb. Choose arrow mode when the Breadcrumb is treated as one composite widget that should occupy a single tab stop, such as in dense toolbars or when surrounding controls already use arrow-key roving focus; in that mode document the behavior or provide visible affordances so users are not stranded. `tab`
- **size**: Scales crumb typography, icons, and dividers together. Use small in dense surfaces such as side panels, cards, or table detail areas, medium in the standard page header position, and large in spacious hero or marketing-style layouts where the trail is a prominent wayfinding element. Set it once on the Breadcrumb root and never vary it per crumb. `medium`
- **root**: Slot for the root navigation element that carries the landmark. Use it to add a className, an id for testing, or an aria-label override when the accessible name must be composed at runtime. Avoid replacing the element type, since the navigation semantics are what make the trail discoverable to assistive technology. `accessible name and styling applied at the root landmark`
- **list**: Slot for the ordered list that contains the crumbs. Use it to adjust gap, wrapping, maximum width, or overflow behavior of the trail. Preserve the list element so the hierarchy and item count continue to be announced correctly. `spacing and overflow styling applied to the crumb list`

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

- Give every Breadcrumb an aria-label that describes its purpose and scope, such as a label naming the section the trail belongs to, so multiple navigation landmarks on a page can be told apart.
- Mark the final crumb with the current flag on BreadcrumbButton so it is announced as the current page and does not look like a duplicate destination link.
- Use href on BreadcrumbButton for every crumb that navigates, so users retain link affordances such as middle-click, right-click, copy link address, and open in new tab.
- Keep crumb labels short and identical to the destination page's own heading or title so users can predict where each link leads.
- Pick one size for the whole trail; size scales both items and dividers, so mixing sizes inside a single Breadcrumb produces an inconsistent, misaligned row.
- Handle long paths by partitioning or collapsing middle crumbs with a trailing ellipsis crumb rather than allowing the trail to wrap onto multiple lines.
- Use BreadcrumbDivider between crumbs as the visual separator instead of manually inserting slashes or angle characters into crumb labels.

### Don'ts

- Do not omit the accessible name on the Breadcrumb root; an unnamed navigation landmark is announced only as "navigation" and becomes indistinguishable from Nav, Tabs, and other landmarks on the page.
- Do not use Breadcrumb as the primary way to move around the product; it is a locator and shortcut, not a replacement for global or section navigation.
- Do not mark more than one crumb as current, and do not leave the current crumb as a fully styled navigable link that points back to the page the user is already on.
- Do not nest menus, buttons, or other interactive widgets inside a crumb; each crumb should expose exactly one interactive target.
- Do not rely on truncated labels alone to convey the path; if text is clipped or shortened, provide a Tooltip with the full label so the meaning is never lost.
- Do not switch to arrow focus mode casually for a trail of plain links; removing links from the Tab sequence surprises keyboard users who expect Tab to reach links.
- Do not use Breadcrumb to represent a linear checkout or onboarding sequence; users will assume the crumbs are independent destinations rather than ordered steps.

## Anti-Patterns

### Unnamed navigation landmark

❌ Rendering a Breadcrumb without an aria-label leaves screen reader users with a generic "navigation" region that cannot be distinguished from Nav, Tabs, or other landmarks on the same page, which breaks WCAG 1.3.1 and 2.4.1.

✅ Always pass a descriptive aria-label on the Breadcrumb root, naming the trail by its scope, for example a label that mentions the section or product area the hierarchy belongs to.

### Current page left as a live link

❌ If the final crumb is not marked with the current flag, it is announced and styled exactly like every other crumb, so users are invited to navigate to the page they are already on and screen readers never announce which page is current.

✅ Set the current flag on the last BreadcrumbButton, which exposes aria-current="page" and visually distinguishes the terminal crumb, and keep it consistent with the page's own heading.

### Truncation without disclosure

❌ Clipping long crumb labels with CSS overflow hides part of the path with no way to recover it, so users lose the exact page name and cannot tell similar-looking siblings apart.

✅ Either collapse middle crumbs into an explicit ellipsis crumb that can be expanded or hovered, or wrap the label in a Tooltip that exposes the full text, and reserve pure text truncation for cases where the label is duplicated elsewhere on the page.

### Arrow focus mode on a plain link trail

❌ Switching focusMode to arrow removes the crumbs from the Tab sequence, so keyboard users who expect Tab to reach links instead focus past the entire trail or get trapped in an unfamiliar roving-focus pattern that violates WCAG 2.1.1 expectations.

✅ Leave focusMode at the default tab setting for standard link trails, and only use arrow mode when the Breadcrumb is intentionally part of a composite widget whose arrow-key convention is already established nearby.

### Breadcrumb as the primary navigator

❌ Using the trail as the main way to move around a product forces users to walk back up the hierarchy instead of jumping laterally, and it duplicates navigation already provided by global navigation and the page content.

✅ Keep Breadcrumb as a locator and upward shortcut, and provide primary movement through Nav, Menu, Tabs, or in-page links.

## Accessibility

**Requirements**: The Breadcrumb root renders a navigation landmark, so it must be given a meaningful accessible name via aria-label (or an equivalent labelling technique) to satisfy WCAG 1.3.1 and 2.4.1. Crumbs must meet WCAG 1.4.3 contrast in rest, hover, and focus states, and the focus indicator must meet WCAG 2.4.7 and 2.4.11 non-text contrast. The current page must be programmatically identified (WCAG 2.4.8), which the current flag on BreadcrumbButton achieves by exposing aria-current="page". Target size should meet WCAG 2.5.8 minimums, which the small size may approach, so verify hit area when using small. Content order must match the visual order of the crumbs so the reading order reflects the hierarchy (WCAG 1.3.2).

| Key | Action |
| --- | --- |
| `Tab` | In the default tab focus mode, moves focus to the next breadcrumb crumb in the trail, then releases focus to the next element after the last crumb. |
| `Shift + Tab` | Moves focus to the previous crumb, or leaves the Breadcrumb when focus is on the first crumb. |
| `ArrowRight` | In arrow focus mode, moves focus forward to the next crumb in the trail, wrapping or stopping at the end of the trail. |
| `ArrowLeft` | In arrow focus mode, moves focus backward to the previous crumb in the trail. |
| `Enter` | Activates the focused crumb; follows the href on a link crumb or activates a crumb rendered as a button. |
| `Space` | Activates a crumb that is rendered as a button; has no scrolling side effect while the button has focus. |

**ARIA**: aria-label, aria-current

**Screen Reader**: Screen readers announce the Breadcrumb as a navigation landmark using the supplied aria-label, then read the crumbs in order as an ordered list of links so users hear both the position and the total number of levels in the path. The final crumb is announced as the current page because the current flag exposes aria-current="page", which prevents it from being read as just another destination. Dividers are purely decorative separators and should not be read as content, so crumbs should carry all the semantics. In arrow focus mode the trail behaves as a single composite widget with roving focus, so screen reader users moving with the virtual cursor still perceive the crumbs as a list, while keyboard users moving with focus traverse them with arrow keys rather than Tab.

## Styling

Customize the trail with Griffel through makeStyles and the root and list slot props rather than wrapping the component in extra divs, since extra wrappers can break the ordered-list semantics. Set crumb typography to match the chosen size with tokens.fontSizeBase200, tokens.fontSizeBase300, and tokens.fontSizeBase400 combined with tokens.lineHeightBase200, tokens.lineHeightBase300, and tokens.lineHeightBase400. Use tokens.colorNeutralForeground2 for resting crumb text, tokens.colorNeutralForeground1 for the current crumb, and tokens.colorNeutralForeground3 for dividers so the trail stays visually recessive. Hover and pressed feedback on BreadcrumbButton should come from tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed with tokens.borderRadiusMedium, and focus outlines should use tokens.colorStrokeFocus2. Control rhythm with tokens.spacingHorizontalXS, tokens.spacingHorizontalS, and tokens.spacingHorizontalMNudge on the list and item gaps. Icon-only or icon-leading crumbs should size the icon to match the item size so small, medium, and large trails stay vertically aligned, and long trails can be constrained with a max-width plus overflow handling on the list container.

## Performance

Breadcrumb is a lightweight, statically rendered ordered list and carries no virtualization or measurement cost of its own, so its render cost is proportional to the number of crumbs and is negligible for realistic trails. The main costs come from what you put inside: mapping a large array of items on every render creates new children, so memoize or hoist the item list and supply stable keys when generating crumbs. Avoid re-creating deep wrapper components around each crumb, because they add DOM nodes without adding semantics and can interfere with list announcements. For very long paths, collapsing middle crumbs behind an overflow ellipsis reduces both DOM size and layout thrash in narrow containers. Keep any Tooltip usage scoped to the crumbs that actually truncate, since mounting a popover surface per crumb for long trails is the most expensive thing a Breadcrumb can do.

## Theming & Tokens

Breadcrumb inherits all colors and type from the active theme through Griffel design tokens, so it adapts automatically to web light, web dark, and high contrast themes when the app is wrapped in a Provider. Resting crumb text uses tokens.colorNeutralForeground2, the current crumb uses tokens.colorNeutralForeground1, and dividers use tokens.colorNeutralForeground3; hover and pressed feedback comes from tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed, while keyboard focus rings use tokens.colorStrokeFocus2. The size prop maps onto typography and icon size tokens, with the small setting corresponding to tokens.fontSizeBase200 and its line height counterpart, medium to tokens.fontSizeBase300, and large to tokens.fontSizeBase400. Spacing between crumbs respects tokens.spacingHorizontalXS through tokens.spacingHorizontalMNudge, and corner rounding on interactive crumbs uses tokens.borderRadiusMedium. Because only alias tokens are consumed, brand ramps such as tokens.colorBrandForeground1 can be applied on top for branded trails without breaking contrast in dark or high contrast modes.

## Migration Notes

Migrating from the previous major version, the biggest change is that Breadcrumb is now fully compositional instead of data-driven: BreadcrumbItem, BreadcrumbDivider, and BreadcrumbButton are authored as children rather than being generated from an items array of breadcrumb item objects, which gives you full control over the rendered markup and lets each crumb be a real link or button. Previous built-in knobs for limiting the number of visible crumbs have been replaced by explicit composition — overflow scenarios render an ellipsis crumb yourself and use the exported partitioning helper type for splitting items into leading and trailing groups, both demonstrated by the overflow and tooltip examples. Visual sizing is now controlled by the size prop on the Breadcrumb root (small, medium, large) and applies uniformly to items and dividers, and keyboard traversal behavior is now selectable with focusMode rather than being fixed. The accessible name is still provided through aria-label on the root, so any existing label text can be carried over directly.

## Edge Cases

- A trail with a single crumb provides no navigational value and should generally be hidden entirely rather than rendered as a one-item list.
- Crumbs without an href render as buttons rather than links, which removes browser affordances such as open in new tab and copy link address, so only use that form for crumbs that trigger in-page actions.
- Switching to arrow focus mode turns the whole trail into one tab stop, which can hide the entire breadcrumb from users who only ever press Tab.
- Long page names can push the trail beyond the container width; collapse or truncate middle crumbs instead of letting the row wrap, since wrapping breaks the single-line reading order users expect from a path.
- The size prop affects items and dividers together, so nesting a differently sized Breadcrumb or manually sized children inside one trail produces mismatched baselines and divider heights.
- Very long hierarchies can produce more crumbs than are useful; keeping a small number of leading crumbs plus the current page and an ellipsis crumb for the middle keeps the trail scannable in narrow layouts.

## See Also

- - [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
