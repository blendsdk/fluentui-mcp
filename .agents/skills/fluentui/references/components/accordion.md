# Accordion

> **Package**: `@fluentui/react-accordion` v9.12.0
> **Import**: `import { Accordion } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

Accordion is a vertically stacked container that groups a series of expandable and collapsible sections, letting people reveal content on demand instead of showing everything at once. The Accordion component itself is the stateful parent: it owns which sections are open through the uncontrolled defaultOpenItems prop or the controlled openItems prop, reports changes through onToggle, and governs how many sections may be open at a time with the collapsible and multiple flags. Its single root slot renders a container that holds AccordionItem children, and each item composes an AccordionHeader (the always-visible, focusable trigger) with an AccordionPanel (the revealed content). Identity is data driven: every AccordionItem has a value, and the accordion tracks a matching set of values in openItems or defaultOpenItems, so open state survives re-renders and can be driven entirely from application state. Accordion is commonly used for FAQs, settings groups, filter panels, long forms, and dense detail views where vertical space is at a premium.

**When to use**: Use Accordion when you have several peer-level sections of related content that a person may want to scan first and open selectively, and when showing all of that content at once would dominate the page or force excessive scrolling. It is a good fit for progressive disclosure inside a page — FAQ lists, grouped settings, advanced options in a form, filter groups in a side rail, or detail summaries where the header alone is meaningful. Choose Accordion when the sections are peers and more than one might reasonably be open at the same time; use the collapsible prop when everyone should be able to close everything, and use multiple when comparing two or more sections at once is a realistic task. Prefer other components when the content is fundamentally navigational rather than informational: use Nav or Tree for site navigation and hierarchical structures, Menu for a temporary list of commands, and Dialog, Drawer, or Popover for transient or supplementary content that should not permanently occupy page space. If you only need a single collapsible region, an Accordion with one item plus collapsible still works, but a simpler disclosure pattern may be lighter for both you and the user.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `collapsible` | `boolean \| undefined` | `false` | No | Indicates if Accordion support multiple Panels closed at the same time. |
| `defaultOpenItems` | `Value \| Value[] \| undefined` | — | No | Default value for the uncontrolled state of the panel. |
| `multiple` | `boolean \| undefined` | `false` | No | Indicates if Accordion support multiple Panels opened at the same time. |
| `navigation` | `"linear" \| "circular" \| undefined` | — | No | **Deprecated** |
| `onToggle` | `AccordionToggleEventHandler<Value> \| undefined` | — | No | Callback to be called when the opened items change. |
| `openItems` | `Value \| Value[] \| undefined` | — | No | Controls the state of the panel. |

### Prop Guidance

- **defaultOpenItems**: Sets the initial open section or sections for an uncontrolled accordion. Accepts a single value or an array of values matching the value of the AccordionItem children. Use it whenever you want a section visible on first paint but do not need to track open state yourself; changing it after mount has no effect. `defaultOpenItems="1" or defaultOpenItems={['1', '3']}`
- **openItems**: Puts the accordion into controlled mode. Pass the current set of open item values, either as a single value or an array, and update it from onToggle. Use this when open state must be persisted, deep-linked, restored, or shared with other parts of the page. Always pair it with onToggle, otherwise user clicks have no visible effect. `openItems={openItems} with onToggle={handleToggle}`
- **onToggle**: Callback fired when the set of open items changes; the second argument carries the updated openItems and the value that changed. Use it to write the received openItems back into state for controlled accordions, or to log analytics and lazily load data for a newly opened section. Do not mutate the provided array in place. `(event, data) => setOpenItems(data.openItems)`
- **collapsible**: Allows every panel to be closed at the same time, including the last open one. Enable it when the collapsed state is meaningful, such as a filter group or a section list where users may want an empty view. Without it, at least one panel remains open. `collapsible`
- **multiple**: Allows more than one panel to be expanded simultaneously, which is the right choice when users compare sections. Note that with multiple enabled nothing is open on first render, so combine it with defaultOpenItems if a panel should start expanded. `multiple`
- **navigation**: Deprecated. It previously accepted linear or circular to control arrow-key movement between accordion headers. Do not use it in new code; rely on the natural Tab order, and implement the optional WAI-ARIA arrow-key pattern in your own component only if your users genuinely benefit from it. `(omit this prop)`
- **AccordionItem value**: The identity of a section and the value compared against openItems and defaultOpenItems. It must be unique within the accordion and type-consistent across items; numbers and strings both work but should not be mixed casually, since the same value must appear in your open-state set. `value="1" or value={1}`
- **AccordionItem disabled**: Makes a single section unavailable. The header cannot be toggled and the panel cannot be opened, which is useful for feature gating or read-only states. Communicate why a section is unavailable somewhere adjacent, since a disabled header alone is not self-explanatory. `disabled`
- **AccordionHeader as**: Renders the header as a specific heading element instead of the default div. Set it to a heading level that matches the surrounding document outline so assistive technology can navigate the sections. `as="h3"`
- **AccordionHeader size**: Selects the typography scale for the header, with small, medium, large, and extra-large options. Use larger sizes for top-level page sections and smaller sizes for densely packed side rails or nested groups. `size="large"`
- **AccordionHeader icon**: Places a decorative or reinforcing icon before the header text. Keep it decorative for accessibility purposes and make sure the label text alone still communicates the section. `icon={<RocketRegular />}`
- **AccordionHeader expandIcon**: Replaces the default chevron with your own element, most often when you want plus/minus semantics that track the open state. The icon is driven by the header, so reflect the expanded state in the element you supply. `expandIcon={isOpen ? <Subtract20Filled /> : <Add20Filled />}`
- **AccordionHeader expandIconPosition**: Moves the expand icon to the start or end of the header. Use end (the common default) for standard lists and start when the icon should align with an existing leading icon column. `expandIconPosition="end"`
- **AccordionHeader inline**: Renders the header on a single line with tighter padding, which is useful for nested or secondary accordions where the default header height would be too heavy. `inline`
- **AccordionPanel collapseMotion**: Overrides the expand and collapse animation with your own duration, easing, and opacity settings. Use it to shorten motion for tiny panels, lengthen it slightly for panels with more content, or disable opacity animation when the height transition already reads clearly. `{ duration: 500, easing: motionTokens.curveDecelerateMid, animateOpacity: false }`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from '@fluentui/react-components';

export const Default = (): JSXElement => (
  <Accordion>
    <AccordionItem value="1">
      <AccordionHeader>Accordion Header 1</AccordionHeader>
      <AccordionPanel>
        <div>Accordion Panel 1</div>
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem value="2">
      <AccordionHeader>Accordion Header 2</AccordionHeader>
      <AccordionPanel>
        <div>Accordion Panel 2</div>
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem value="3">
      <AccordionHeader>Accordion Header 3</AccordionHeader>
      <AccordionPanel>
        <div>Accordion Panel 3</div>
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);
```

### Collapsible

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from '@fluentui/react-components';

export const Collapsible = (): JSXElement => (
  <Accordion collapsible>
    <AccordionItem value="1">
      <AccordionHeader>Accordion Header 1</AccordionHeader>
      <AccordionPanel>
        <div>Accordion Panel 1</div>
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem value="2">
      <AccordionHeader>Accordion Header 2</AccordionHeader>
      <AccordionPanel>
        <div>Accordion Panel 2</div>
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem value="3">
      <AccordionHeader>Accordion Header 3</AccordionHeader>
      <AccordionPanel>
        <div>Accordion Panel 3</div>
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);

Collapsible.parameters = {
  docs: {
    description: {
      story: 'An accordion can have multiple panels collapsed at the same time.',
    },
  },
};
```

### Controlled

```tsx
import * as React from 'react';
import type { JSXElement, AccordionToggleEventHandler } from '@fluentui/react-components';
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from '@fluentui/react-components';

export const Controlled = (): JSXElement => {
  const [openItems, setOpenItems] = React.useState(['1']);
  const handleToggle: AccordionToggleEventHandler<string> = (event, data) => {
    setOpenItems(data.openItems);
  };
  return (
    <Accordion openItems={openItems} onToggle={handleToggle} multiple collapsible>
      <AccordionItem value="1">
        <AccordionHeader>Accordion Header 1</AccordionHeader>
        <AccordionPanel>
          <div>Accordion Panel 1</div>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="2">
        <AccordionHeader>Accordion Header 2</AccordionHeader>
        <AccordionPanel>
          <div>Accordion Panel 2</div>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="3">
        <AccordionHeader>Accordion Header 3</AccordionHeader>
        <AccordionPanel>
          <div>Accordion Panel 3</div>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

Controlled.parameters = {
  docs: {
    description: {
      story:
        'An accordion can be controlled, to ensure `multiple` and `collapsible` you should use `openItems` provided through `onToggle` callback.',
    },
  },
};
```

## Best Practices

### Do's

- Give every AccordionItem a stable, unique value so openItems and defaultOpenItems can reliably address it; the value can be a string or a number, but it must be consistent with the type you pass to the accordion.
- Use defaultOpenItems for the initial state of an uncontrolled accordion and reach for openItems plus onToggle only when the open state must live in your own state, in a URL, or in a store.
- Pair openItems with onToggle and write the incoming data.openItems back into your state; a controlled accordion that ignores its own toggle callback will appear frozen to users.
- Set collapsible when users should be able to close the last remaining open panel, and set multiple when comparing two or more sections is a realistic task; combine both when you want a free-form expand/collapse experience.
- Render AccordionHeader as a real heading level with the as prop so the section structure is exposed to assistive technology and matches the surrounding document outline.
- Keep header text short and descriptive, and use the icon prop on AccordionHeader only for decorative or reinforcing glyphs rather than as the sole carrier of meaning.
- Put actions, links, and other interactive controls inside AccordionPanel rather than inside the header, so activation of the header always means exactly one thing.
- Tune collapseMotion on AccordionPanel with motion tokens when the default expand/collapse timing feels wrong for the amount of content being revealed.

### Don'ts

- Don't use Accordion as primary navigation for an application or site; the headers are toggle buttons, not links, and screen reader users will not get expected navigation semantics — use Nav, Tree, or Menu instead.
- Don't nest buttons, links, or other focusable controls inside AccordionHeader; the header is already an interactive trigger, and nested controls create ambiguous click targets and broken keyboard behavior.
- Don't pass openItems without also handling onToggle, and don't mutate the openItems array in place — always derive the new open state from the data your toggle handler receives.
- Don't assume an accordion with multiple renders with anything open; when several panels may be open, no panel is opened by default on first render, so provide defaultOpenItems if an initial section should be visible.
- Don't rely on the deprecated navigation prop to get arrow-key movement between headers; treat header-to-header movement as standard Tab order unless you deliberately implement the optional WAI-ARIA arrow-key pattern yourself.
- Don't hide critical, always-needed information inside a collapsed panel that nobody is likely to expand; primary content should remain visible.
- Don't stack very large or expensive subtrees in every panel of a long accordion, because the open/close motion and the surrounding layout work are paid every time a section is toggled.
- Don't use inconsistent value types across items in the same accordion; mixing numbers and strings makes the openItems set hard to reason about and easy to break.

## Anti-Patterns

### Using Accordion as primary navigation

❌ Accordion headers are buttons that toggle content, not links or menu items, so using them to switch routes produces an experience that lacks navigation semantics, cannot be opened in a new tab, and confuses screen reader users who expect links.

✅ Use Nav with NavItem, Tree for hierarchical structures, or Menu for command lists. Reserve Accordion for informational, expandable content within a page.

### Interactive controls nested inside the header

❌ Putting buttons, links, or inputs inside AccordionHeader creates nested interactive content: clicking the inner control may also toggle the panel, keyboard focus becomes ambiguous, and pointer targets overlap. It also makes the accessible name of the header unpredictable.

✅ Keep the header to a label plus optional decorative icon or expandIcon, and move actions into the AccordionPanel body. If a header needs an action zone, place it outside the header row or in a separate column.

### Controlled without a toggle handler

❌ Passing openItems without updating it in onToggle freezes the accordion: headers still receive clicks and focus but nothing ever expands or collapses, which looks like a broken component to the user.

✅ Either drop openItems entirely and use defaultOpenItems for an uncontrolled accordion, or pair openItems with onToggle and write data.openItems back into state.

### Depending on the deprecated navigation prop

❌ The navigation prop for linear and circular arrow-key movement is deprecated, so relying on it couples your product to an API that will not receive fixes and may behave differently from the documented WAI-ARIA pattern.

✅ Remove the prop and rely on Tab order and heading navigation. If arrow-key movement is genuinely required, implement the optional pattern explicitly in your own wrapper and document it for keyboard users.

### Expecting panels to be open under multiple

❌ When multiple is enabled, the accordion cannot guess which sections should start open, so nothing is expanded on first render even if the content suggests otherwise. Teams often mistake this for a rendering bug.

✅ Pass defaultOpenItems with the values that should start expanded, or drive the initial state explicitly with openItems plus onToggle.

## Accessibility

**Requirements**: Follow the WAI-ARIA accordion pattern and WCAG 2.1 AA: every header must be operable by keyboard alone (2.1.1), focus must be clearly visible on the header trigger (2.4.7), and the name, role, and expanded state of each header must be programmatically determinable (4.1.2). AccordionHeader should be rendered with a real heading element through the as prop (for example h2 or h3 depending on document depth) so the section structure satisfies Info and Relationships (1.3.1) and so users can navigate between sections with heading shortcuts. The trigger must expose aria-expanded and be associated with the panel it controls, and the panel should be exposed as a labeled region that points back at its header. Disabled items should read as inactive and must not be toggleable. If you animate panels, respect reduced-motion preferences and keep the motion short enough that it does not delay access to the revealed content.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the next focusable element, which is typically the next accordion header; when a panel is expanded, focus continues into the interactive content inside that panel before reaching the following header. |
| `Shift+Tab` | Moves focus backward through headers and through interactive content inside an expanded panel. |
| `Enter` | Toggles the focused accordion header between expanded and collapsed and updates the header's aria-expanded state. |
| `Space` | Toggles the focused accordion header; Space is the standard activation key for the header's button, and focus stays on the header after toggling. |
| `Arrow Down` | Optional accordion-pattern behavior for moving between headers. Fluent UI previously exposed this through the deprecated navigation prop; today, implement it in userland only if you deliberately opt into the optional WAI-ARIA arrow-key pattern. |
| `Arrow Up` | Optional accordion-pattern behavior for moving to the previous header, tied to the same deprecated navigation prop; standard Tab order is the supported default. |
| `Home` | Optional pattern behavior that moves focus to the first header; not provided by the current Fluent UI Accordion behavior and only relevant if you implement the optional arrow-key pattern. |
| `End` | Optional pattern behavior that moves focus to the last header; likewise only relevant when you implement the optional arrow-key pattern yourself. |

**ARIA**: aria-expanded on the accordion header trigger, reflecting whether the associated panel is open, aria-controls on the header trigger, pointing at the id of the panel it expands, aria-labelledby on the panel, pointing back at its header so the region has an accessible name, role of region on the expanded panel container (paired with aria-labelledby), heading semantics supplied by the as prop on AccordionHeader, which produces a real h1–h6 heading element instead of the default div

**Screen Reader**: Each header is announced as a button inside a heading, for example as the header text followed by 'button' and 'collapsed' or 'expanded', and toggling updates that state without moving focus. Because the panel is exposed as a region labeled by its header, virtual-cursor users can jump to it and hear which section they are in, and heading navigation lets them skim the accordion's structure. Disabled items are announced as unavailable and cannot be activated, and content inside a collapsed panel is not reachable through normal virtual-cursor reading of the section. Note that in the default rendering, headers do not receive arrow-key focus movement, so users rely on Tab and heading shortcuts to move between sections.

## Styling

Accordion inherits its base styling from the theme and exposes className on the root slot, while AccordionHeader, AccordionItem, and AccordionPanel each expose their own className so you can target the header trigger, the item wrapper, and the panel body independently. Header hover and pressed feedback use neutral background tokens, so overriding hover with tokens.colorNeutralBackground1Hover and pressed with tokens.colorNeutralBackground1Pressed keeps parity with the rest of Fluent. Text color for header labels is tokens.colorNeutralForeground1, secondary or inline header text reads better at tokens.colorNeutralForeground2, and disabled headers should drop to tokens.colorNeutralForegroundDisabled without changing the layout. Spacing is usually the first thing teams adjust: padding around header content with tokens.spacingVerticalS and tokens.spacingHorizontalM, panel body padding with tokens.spacingVerticalMNudge and tokens.spacingHorizontalMNudge, and gaps between items with tokens.spacingVerticalS. Rounded containers look correct with tokens.borderRadiusMedium, and a focus-visible outline should use tokens.colorStrokeFocus2 on a 2px outline offset so it remains visible against tokenized surfaces. AccordionHeader sizes drive typography token sets — small through extra-large shift the font size and line-height tokens — so prefer the size prop over font overrides to stay aligned with the type ramp, and only add tokens.fontSizeBase400 or tokens.fontWeightSemibold manually for one-off emphasis. Panel motion is customizable through collapseMotion on AccordionPanel, where easing from motionTokens.curveDecelerateMid and durations in the motionTokens.durationNormal to motionTokens.durationSlow range feel natural for small and large content respectively, and animateOpacity can be toggled off when the height animation alone is enough. When you customize transitions, check reduced-motion expectations and keep durations short enough that the content is not perceived as delayed.

## Performance

The accordion's open state is centralized, so toggling any header updates a single provider and re-renders the item set; keep the amount of work done in each panel modest and memoize expensive panel bodies so unrelated sections are not re-created on every toggle. Because panels animate their height and optionally their opacity, content participates in the transition rather than appearing instantly — very large trees, data grids, or charts inside a panel will both slow the animation and cost render time every time the section opens, so lazy-render heavy content based on whether its value is present in your open state, or render lightweight placeholders first. Long accordions with dozens of items are usually better paginated, grouped, or virtualized at the container level. Collapse motion is configurable through collapseMotion on AccordionPanel; shorter durations and disabling animateOpacity reduce perceived latency on content-heavy panels. Avoid creating new callback identities for onToggle on every render when the accordion is controlled, since that can defeat memoization of child panels.

## Theming & Tokens

Accordion reads its visual values from the Fluent theme supplied by FluentProvider, so brand or high-contrast themes apply automatically without component-specific overrides. Header labels use neutral foreground ramps such as tokens.colorNeutralForeground1, with tokens.colorNeutralForeground2 for secondary or inline text and tokens.colorNeutralForegroundDisabled for inactive sections. Hover and pressed header states resolve to neutral background tokens like tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed over a tokens.colorNeutralBackground1 base, and keylines between sections use neutral stroke tokens. Focus visibility is drawn with focus tokens such as tokens.colorStrokeFocus2, so it adapts correctly in high-contrast and dark themes. Layout is fully tokenized: tokens.spacingVerticalS, tokens.spacingHorizontalM, tokens.spacingVerticalMNudge, and tokens.spacingHorizontalMNudge drive header and panel padding, and tokens.borderRadiusMedium drives rounded containers. Typography comes from the size variants of AccordionHeader, which select font-size and line-height tokens from the type ramp. Motion values are also tokens — easing from motionTokens.curveDecelerateMid and duration values in the motionTokens.durationNormal through motionTokens.durationSlow range — so custom collapseMotion settings should reuse those tokens to stay consistent when the theme changes.

## Migration Notes

If you are moving from the previous major version of Fluent UI, the mental model is now fully data driven: your accordion items carry a value, and open state is expressed as a single value or an array of values through defaultOpenItems (uncontrolled) or openItems (controlled), with onToggle reporting changes. Styling moves away from legacy className and merge-style helpers toward Griffel-based class names applied per slot, so class overrides on the root, header, item, and panel are the supported customization path. The navigation prop is deprecated: the linear and circular arrow-key navigation it used to enable is no longer the recommended interaction model, and header-to-header movement follows standard Tab order unless you implement the optional WAI-ARIA arrow-key pattern yourself. Because collapsible and multiple are now explicit, verify the intended behavior when porting: with multiple enabled, nothing is expanded on first render, so supply defaultOpenItems if a section must start open.

## Edge Cases

- defaultOpenItems and openItems accept either a single value or an array, but the value type must match the AccordionItem values exactly; mixing numeric item values with string open items silently leaves everything collapsed.
- defaultOpenItems only seeds the initial uncontrolled state. Updating it later does not change what is open, so any dynamic open state — restoring from a URL, for example — must go through openItems and onToggle.
- With multiple enabled and no defaultOpenItems, the accordion renders fully collapsed on first paint, which is intentional but frequently mistaken for a bug.
- collapsible and multiple are independent: collapsible controls whether zero panels may be open, while multiple controls whether more than one may be open. Choosing only one of them changes the collapse behavior in ways users notice immediately, so verify the combination you ship.
- AccordionItem supports a disabled state that blocks toggling for that section only; the rest of the accordion continues to operate, and disabled items should still be visually distinguishable through foreground and background tokens.
- Header identity is the section's value, not its position, so reordering items preserves the open state as long as the values move with them.
- Because the header trigger is an interactive element, disabled items and any content inside a collapsed panel are not reachable in the tab order, which matters when auditing keyboard paths through a page.
- Customizing collapseMotion with very long durations or easing curves can make the panel feel unresponsive for keyboard and screen reader users; keep durations short and consider disabling opacity animation for large panels.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
