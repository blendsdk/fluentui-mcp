# Accordion

> **Package**: `@fluentui/react-accordion` v9.12.0
> **Import**: `import { Accordion } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

Accordion is a vertically stacked set of expandable sections built from four cooperating pieces: the Accordion container, AccordionItem, AccordionHeader, and AccordionPanel. The container owns the open state, either internally (uncontrolled, seeded by defaultOpenItems) or externally (controlled, driven by openItems plus the onToggle callback). Two independent behavioral flags shape the container: collapsible, which permits every panel to be closed at the same time, and multiple, which permits several panels to be expanded simultaneously. Individual items are identified by their value, are rendered as a header that users activate plus a panel holding the revealed content, and can be individually disabled. The header supports heading semantics through its as prop, an optional leading icon, a customizable expand icon, an expand-icon position of start or end, an inline layout, and four sizes (small, medium, large, and extra-large). The panel exposes a collapseMotion option so the expand and collapse animation can be tuned with a duration, an easing curve, and an opacity flag. Accordion is exported from the Fluent UI react-components package alongside its AccordionHeader, AccordionItem, and AccordionPanel companions.

**When to use**: Use Accordion when a page or surface contains several sections of secondary content that should be scannable by heading but only revealed on demand: FAQ lists, settings pages split into groups, long forms broken into logical steps, navigation group headers, and detail views where only one or two sections matter at a time. Choose it over a permanently visible layout when vertical space is tight and the section titles are strong enough to scan. Choose Tabs instead when the sections are mutually exclusive, equally important, and users are expected to move among all of them frequently. Choose a single disclosure region when there is only one section to expand, and choose Tree or Table when the content is genuinely hierarchical data rather than a list of titled disclosures. Add the collapsible flag whenever users must be able to close the final open panel, and add multiple when two or more sections are often read side by side.

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

- **defaultOpenItems**: Sets the initially open panel or panels for an uncontrolled accordion. Accepts a single value or an array of values that must match AccordionItem values exactly. Use it to ship a sensible first state, and remember that an array is normally paired with multiple. `1`
- **openItems**: Turns the accordion into a fully controlled component. The container renders exactly what you pass, so user toggles only take effect if you update this prop from the onToggle callback. Use it when the open state must be persisted, restored, or shared with other UI on the page. `an array of item values when multiple is set`
- **onToggle**: Fires whenever the set of open items should change, in both controlled and uncontrolled modes. For controlled usage, read the openItems reported by the callback and store it; for uncontrolled usage, use it for analytics, lazy loading, or side effects. Keep the handler stable with a memoized callback. `read the openItems value reported by the callback and store it in state`
- **collapsible**: Allows all panels to be collapsed at the same time. Defaults to false, which means the accordion always keeps a panel expanded. Enable it whenever users should be able to close the last remaining open section. `true`
- **multiple**: Allows several panels to be expanded simultaneously. Because there is no obvious default panel, a multiple accordion renders fully collapsed on the first render, so pair it with defaultOpenItems or openItems when something should start open. `true`
- **navigation**: Deprecated. It previously selected a linear or circular navigation mode between headers. Do not use it in new code, and plan to remove it from existing code; rely on the default tab order between headers instead. `omit this prop`
- **AccordionItem value**: The identity of the item within its container. It is matched against defaultOpenItems and openItems, and it is what onToggle reports, so values must be unique within a container and must use the same type as the container state. `1`
- **AccordionItem disabled**: Marks a section as unavailable. Disabled items cannot be focused or toggled, and are useful when a section exists but is temporarily locked rather than absent. `true`
- **AccordionHeader as**: Chooses the element rendered for the header. It defaults to a div, but the WAI-ARIA accordion pattern recommends a real heading, so pass h1 through h4 depending on the surrounding document outline. `h2`
- **AccordionHeader size**: Selects the header typographic size so the accordion matches the surrounding content scale rather than being overridden with custom font rules. `large`
- **AccordionHeader inline**: Renders the header in an inline layout instead of the default block layout, which suits accordions placed alongside other inline content. `true`
- **AccordionHeader icon**: Places a leading icon inside the header, before the label. Use it for a consistent visual marker per section and keep the icon purely decorative. `a small regular icon element`
- **AccordionHeader expandIcon**: Replaces the default expand indicator. Useful when a product uses plus and minus glyphs or another custom affordance, but keep the icon clearly indicative of expand and collapse. `a minus filled icon when the panel is open and a plus filled icon when it is closed`
- **AccordionHeader expandIconPosition**: Moves the expand indicator to the start or end of the header. Keep the position consistent across all headers in the same accordion so users learn one pattern. `end`
- **AccordionPanel collapseMotion**: Overrides the expand and collapse animation with your own duration, easing curve, and opacity flag. Use motion tokens for the curve and duration so the motion stays consistent with the rest of the product, and keep durations short enough that toggling still feels responsive. `a duration of about 1000 milliseconds, the decelerate-mid curve, and opacity animation enabled`

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

- Give every AccordionItem a unique value, because that value is the identity used by defaultOpenItems, openItems, and the openItems reported by onToggle.
- Enable collapsible when the design must allow every panel to be closed, otherwise the container keeps one panel expanded at all times.
- Set defaultOpenItems (or openItems) whenever multiple is enabled, since multiple renders collapsed on the first render by design.
- Prefer the uncontrolled pattern with defaultOpenItems for simple cases and reserve openItems plus onToggle for accordions whose state must be shared with other parts of the UI or restored later.
- In the controlled pattern, always write the openItems reported by the onToggle callback back into your state so headers reflect the new state immediately.
- Render AccordionHeader with a real heading element through its as prop when the page has a document outline, and match the heading level to the surrounding structure.
- Use the header size option (small, medium, large, extra-large) to match the typographic scale of the surrounding content instead of overriding font sizes manually.
- Use the header icon slot to give each section a recognizable, consistent visual marker, and keep those icons decorative and consistent in style.
- Wrap your onToggle handler in a stable callback so the container does not receive a new handler identity on every render.
- Use AccordionItem disabled for sections that are temporarily unavailable instead of hiding them, so users can see that the section exists.

### Don'ts

- Do not pass the navigation prop, it is deprecated and should be removed from existing usage.
- Do not combine openItems and defaultOpenItems on the same container, since one describes controlled state and the other uncontrolled initial state.
- Do not let the type of defaultOpenItems or openItems drift from the type of the AccordionItem values, otherwise no panel will appear open.
- Do not treat multiple and collapsible as substitutes for one another, they control different behaviors (several panels open at once versus all panels closable).
- Do not rely on arrow keys to move between headers, that navigation mode is no longer the supported pattern.
- Do not repeat the same value across AccordionItems in one container, because open state is tracked by value.
- Do not place content that must always be visible inside a panel of a collapsible accordion.
- Do not nest accordions several levels deep, the repeated header semantics and indentation quickly become confusing.
- Do not override the header or panel colors with hard-coded values, use the theme tokens so light, dark, and high-contrast themes keep working.
- Do not hide the expand indicator entirely through expandIcon, users rely on it to know the header is interactive.

## Anti-Patterns

### Using the deprecated navigation prop

❌ The navigation prop is deprecated, so relying on it for moving between headers produces code that will break or behave unexpectedly and pins the team to an unsupported API.

✅ Remove the prop and rely on the default tab order between AccordionHeaders, making sure the headers themselves stay focusable and clearly outlined.

### Controlling the accordion without writing state back

❌ When openItems is passed, the container is fully controlled. If the onToggle callback does not store the reported openItems, the header appears to do nothing when clicked, which reads as a broken component.

✅ Pick a single pattern: either leave the accordion uncontrolled with defaultOpenItems, or pass openItems and always update it with the openItems value reported by onToggle.

### Combining multiple with the assumption that a panel starts open

❌ A multiple accordion is collapsed on the first render by design, so teams that only set multiple end up with a page that looks empty and then assume the accordion is misconfigured.

✅ Pair multiple with defaultOpenItems or with a controlled openItems value that already contains the panels you want visible.

### Expecting collapsible behavior without setting collapsible

❌ With the default configuration the accordion keeps at least one panel expanded, so users can never reach the all-collapsed state and may feel trapped by a section they cannot close.

✅ Set collapsible when every panel should be closeable, and only omit it when the design deliberately keeps one section permanently visible.

### Inconsistent or duplicate item values

❌ Item values are the identity for open state and for the values reported by onToggle. Duplicated values make toggling ambiguous, and values of the wrong type silently never match defaultOpenItems or openItems, so nothing opens.

✅ Give each AccordionItem a unique value and keep the value type consistent with the container state, mirroring the numeric values used in the custom expand icon example.

### Rendering headers without heading semantics

❌ AccordionHeader is a div by default, so a page full of plain divs gives assistive technology no way to jump between sections and weakens the document outline.

✅ Use the as prop to render each header as a properly leveled heading that fits the page structure.

## Accessibility

**Requirements**: Accordion must satisfy WCAG 2.1 requirements for keyboard operability (2.1.1), visible focus indication (2.4.7), name, role, and value exposure (4.1.2), and text contrast for header labels, icons, and the expand indicator (1.4.3). Follow the WAI-ARIA accordion pattern: the header is the interactive control that reports its expanded state, and the panel is the region it controls. Because AccordionHeader renders as a div by default, any place where heading structure matters should supply a proper heading level through the as prop so screen reader users can navigate by heading. When a custom collapseMotion is configured, respect reduced-motion preferences by shortening or disabling the animation rather than forcing a long transition on every user.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus out of the current header to the next focusable element, which is normally the next enabled AccordionHeader, since each header is its own tab stop. |
| `Shift+Tab` | Moves focus to the previous focusable element, typically the previous enabled AccordionHeader in the accordion. |
| `Enter` | Toggles the focused AccordionHeader, expanding its AccordionPanel when collapsed and collapsing it when expanded. |
| `Space` | Toggles the focused AccordionHeader with the same expand and collapse behavior as Enter. |
| `Tab on a disabled item` | A disabled AccordionItem is skipped, its header takes no focus and cannot be toggled. |

**ARIA**: aria-expanded on the header control to communicate whether the associated panel is open, aria-controls on the header, pointing at the id of the panel it toggles, aria-labelledby on the panel, pointing back at the header that labels it, aria-disabled on headers of AccordionItems rendered with disabled, heading semantics on AccordionHeader when the as prop is used to render h1 through h4

**Screen Reader**: Screen reader users encounter each AccordionHeader as an expandable control, announced with its label and its expanded or collapsed state taken from aria-expanded. Activating the header announces the state change, and the panel content is read as a labelled region tied to that header, so users can move back to the header to collapse it again. When heading levels are supplied through the as prop, users can jump between accordion sections using heading navigation. Disabled items are announced as unavailable and are not reachable in the tab order. Custom expand icons and leading icons are decorative in practice and should not carry meaning that is absent from the header text.

## Styling

Style Accordion through className and Griffel's makeStyles, and select parts with the exported slot class names rather than deep DOM selectors. The container itself is mostly layout; the visible styling work happens on AccordionHeader and AccordionPanel. A typical customization is a separating rule between sections: use tokens.colorNeutralStroke2 for the divider line and tokens.colorNeutralStroke1 for the header underline, with tokens.spacingVerticalMNudge and tokens.spacingHorizontalM as header padding. Header label color should come from tokens.colorNeutralForeground1, the expand chevron and leading icon from tokens.colorNeutralForeground2, and interactive feedback from tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed. Focus outlines should use tokens.colorStrokeFocus2 so they remain visible in every theme. If you match the header size option, keep the labels on the corresponding font tokens such as tokens.fontSizeBase300 for small and tokens.fontSizeBase600 for extra-large, paired with tokens.lineHeightBase400 and tokens.fontFamilyBase. Rounded or card-like sections can be built with tokens.borderRadiusMedium and tokens.colorNeutralBackground1, and panel body copy usually reads best on tokens.colorNeutralForeground2. For the expand and collapse transition, tune duration and easing through the panel collapseMotion option using motionTokens.curveDecelerateMid with motionTokens.durationNormal or motionTokens.durationSlow rather than writing raw keyframes.

## Performance

Toggling open state re-renders the container and its items, so keep the work done per item light and avoid recomputing heavy panel content on each render of the parent. Pass a memoized onToggle callback so the container is not handed a new function identity on every render, as the controlled and custom-icon examples do. Because a multiple accordion starts fully collapsed, avoid mounting expensive content in every panel up front when only one section is typically viewed. Custom collapseMotion animations run on each toggle, so keep durations short for frequently toggled sections and remember that long durations on large lists make the surface feel slow. Keep the item count reasonable: every enabled header is a separate tab stop, and very long accordions become tedious to traverse by keyboard.

## Theming & Tokens

Accordion is fully token driven, so switching themes changes it without any code changes. Header labels read from tokens.colorNeutralForeground1 and secondary text and icons from tokens.colorNeutralForeground2, while hover and active feedback come from tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed. Separators use tokens.colorNeutralStroke2 and header rules tokens.colorNeutralStroke1, and focus indication uses tokens.colorStrokeFocus2 so it stays visible in light, dark, and high-contrast themes. The header size option maps to the type ramp, so small through extra-large headers scale with tokens.fontSizeBase300 upward together with tokens.lineHeightBase400 and tokens.fontFamilyBase. Disabled items fall back to tokens.colorNeutralForegroundDisabled. Panel motion is animated with motion tokens: the custom motion example uses motionTokens.curveDecelerateMid as the easing, and the built-in timing aligns with motionTokens.durationNormal and motionTokens.durationSlow, so theme authors who tune motion affect the accordion transition as well.

## Migration Notes

Moving from the previous major version to v9 changes several things. The container, item, header, and panel are now separate named exports (Accordion, AccordionItem, AccordionHeader, AccordionPanel) instead of dot-notation subcomponents attached to a single Accordion export. Open state is expressed with values rather than indexes: defaultOpenItems and openItems accept a single value or an array of values, matching the value you give each AccordionItem, and the onToggle callback reports the currently open items so the same data can drive controlled state. The navigation prop from earlier versions is deprecated and has no direct replacement, so code that relied on it for arrow-key movement between headers should be updated. Behavior flags such as collapsible and multiple remain the way to allow all panels to be closed and to allow several panels to be open at once.

## Edge Cases

- A multiple accordion is collapsed on the first render, so you must supply defaultOpenItems or a controlled openItems value if any panel should start expanded.
- An accordion without collapsible cannot reach an all-collapsed state, one panel always remains open.
- defaultOpenItems and openItems must use the same value type as the AccordionItem values; numeric values require numeric state, and the custom expand icon example explicitly casts the reported value back to a number for this reason.
- In controlled mode the accordion renders exactly the openItems you provide, so toggling silently does nothing until the onToggle result is written back into your state.
- Disabled AccordionItems are excluded from interaction and from the tab order entirely, so they cannot be opened even programmatically through the header.
- AccordionHeader renders as a div unless the as prop supplies a heading, which means heading-based navigation is unavailable by default.
- Passing an array of values to defaultOpenItems or openItems is normally meaningful only together with multiple.
- Custom collapseMotion settings such as a long duration are applied per panel, so different panels of the same accordion can visibly animate at different speeds if they are configured differently.

## See Also

- - [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
