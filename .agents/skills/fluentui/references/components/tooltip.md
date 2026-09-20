# Tooltip

> **Package**: `@fluentui/react-tooltip` v9.10.2
> **Import**: `import { Tooltip } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

Tooltip is a small, transient popup that displays a short piece of text or lightweight content about the element it wraps when that element is hovered or focused. The element passed as the tooltip's child is the trigger: Tooltip attaches hover and focus listeners to it and shows its content slot after the showDelay elapses (250ms by default), hiding it again after hideDelay (also 250ms by default) once the pointer or focus leaves. By default the tooltip is positioned above the trigger with the theme's normal colors, but positioning can move it to any of the documented placements (above, before, after, below and their -start, -top, -bottom, -end variants) or relative to a custom positioning.target element, and appearance="inverted" swaps in the theme's inverted color set for higher contrast. Every tooltip declares a required relationship of label, description, or inaccessible, which determines whether the tooltip content is written onto the trigger as its accessible name (aria-label / aria-labelledby), its accessible description (aria-description / aria-describedby), or nothing at all. Visibility is uncontrolled by default and driven by hover and focus, but can be fully controlled through visible plus onVisibleChange, and the tooltip is rendered into a React Portal (the outermost div unless a custom mountNode is supplied).

**When to use**: Use Tooltip to supply a concise, supplementary label or description for a control that is already visible and interactive — most commonly to name icon-only buttons, or to add clarifying detail to a control that already has a text label. Choose relationship="label" when the trigger has no visible text and the tooltip supplies its name; choose relationship="description" when the trigger already has a visible label and the tooltip merely adds context. Reach for Tooltip when the information is optional and non-critical: a user who never hovers or focuses should still be able to complete the task. If the content must be interactive (links, buttons), lengthy (multiple paragraphs, headings, images), or must persist until dismissed, use Popover or TeachingPopover instead, because a tooltip cannot be focused and disappears as soon as the user moves away. If the message represents a system-level status or error, use MessageBar. If you need a tooltip that is always attached to a labeled field or icon-with-information pattern, prefer the InfoLabel component, which composes a tooltip correctly for those cases.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"normal" \| "inverted" \| undefined` | `normal` | No | The tooltip's visual appearance. * `normal` - Uses the theme's background and text colors. * `inverted` - Higher contrast variant that uses the theme's inverted colors. |
| `hideDelay` | `number \| undefined` | `250` | No | Delay before the tooltip is hidden, in milliseconds. |
| `onVisibleChange` | `((event: React.PointerEvent<HTMLElement> \| React.FocusEvent<HTMLElement> \| undefined, data: OnVisibleChangeData) => void) \| undefined` | — | No | Notification when the visibility of the tooltip is changing.  **Note**: for backwards compatibility, `event` will be undefined if this was triggered by a keyboard event on the document element. Use `data.documentKeyboardEvent` if the keyboard event object is needed. |
| `positioning` | `PositioningShorthand \| undefined` | `above` | No | Configure the positioning of the tooltip |
| `ref` | `React.Ref<unknown> \| undefined` | — | No | — |
| `relationship` | `"label" \| "description" \| "inaccessible"` | — | Yes | (Required) Specifies whether this tooltip is acting as the description or label of its trigger element.  * `label` - The tooltip sets the trigger's aria-label or aria-labelledby attribute. This is useful for buttons    displaying only an icon, for example. * `description` - The tooltip sets the trigger's aria-description or aria-describedby attribute. * `inaccessible` - No aria attributes are set on the trigger. This makes the tooltip's content inaccessible to   screen readers, and should only be used if the tooltip's text is available by some other means. |
| `showDelay` | `number \| undefined` | `250` | No | Delay before the tooltip is shown, in milliseconds. |
| `visible` | `boolean \| undefined` | `false` | No | Control the tooltip's visibility programatically.  This can be used in conjunction with onVisibleChange to modify the tooltip's show and hide behavior.  If not provided, the visibility will be controlled by the tooltip itself, based on hover and focus events on the trigger (child) element. |
| `withArrow` | `boolean \| undefined` | `false` | No | Render an arrow pointing to the target element |

### Prop Guidance

- **relationship**: Required. Set to label when the trigger has no visible text and the tooltip supplies its accessible name (icon-only buttons). Set to description when the trigger already has a visible label and the tooltip merely clarifies it. Use inaccessible only when the same text is already exposed elsewhere, since it removes the tooltip from the accessibility tree. `label`
- **content**: Required slot holding the text or lightweight JSX shown in the popup. Pass a string for the common case, or an object with children and className when you need custom styling. Keep it to a short phrase or one short sentence. `Example tooltip`
- **appearance**: Choose between the theme's standard colors (normal, the default) and the higher-contrast inverted palette. Use inverted when the default surface does not stand out against the surrounding UI. `inverted`
- **positioning**: Controls where the tooltip is placed relative to the trigger. Accepts the documented placements such as above (the default), below-start, before-top, after, and the other -start/-top/-bottom/-end variants, or an object with a target ref to anchor to a sub-element such as the icon inside a button. Use a stable ref for target rather than recreating it on every render. `above`
- **withArrow**: Renders an arrow pointing from the tooltip to its target. Most useful when the tooltip is not in the default above position or when the anchor is a small sub-element, so the pointer is unambiguous. `true`
- **visible**: Makes visibility controlled. Provide it together with onVisibleChange and update state from data.visible; when it is omitted, the tooltip manages its own visibility from hover and focus on the child. `true`
- **onVisibleChange**: Notification fired whenever visibility is about to change, with the event and an OnVisibleChangeData object containing visible. Use it to keep controlled state in sync or to log/observe tooltip usage. The event argument is undefined for keyboard events on the document element; read data.documentKeyboardEvent in that case. `data.visible`
- **showDelay**: Milliseconds to wait before showing after hover or focus begins. Defaults to 250. Increase it to prevent accidental tooltips in dense layouts; decrease it when the tooltip is essential orientation for an unfamiliar icon. `250`
- **hideDelay**: Milliseconds to wait before hiding after the pointer or focus leaves. Defaults to 250. A short delay lets a user move the pointer onto the tooltip area without it vanishing. `250`
- **mountNode**: Overrides the portal target for the rendered tooltip. The examples use it to mount the tooltip into a specific container; supply it when the default outermost-div portal would be clipped or when your styles depend on a particular ancestor element. `ref`
- **ref**: Optional React ref forwarded to the underlying Tooltip component instance; use it when you need a handle for imperative or measurement scenarios rather than a styling concern. `ref`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `content` | — | Yes | The text or JSX content of the tooltip. |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Button, Tooltip } from '@fluentui/react-components';
import { SlideTextRegular } from '@fluentui/react-icons';
import type { TooltipProps } from '@fluentui/react-components';

export const Default = (props: Partial<TooltipProps>): JSXElement => (
  <Tooltip content="Example tooltip" relationship="label" {...props}>
    <Button icon={<SlideTextRegular />} size="large" />
  </Tooltip>
);

Default.parameters = {
  docs: {
    description: {
      story: `By default, Tooltip appears above its target element, when it is focused or hovered.`,
    },
  },
};
```

### Controlled

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Checkbox, Tooltip } from '@fluentui/react-components';

export const Controlled = (): JSXElement => {
  const [visible, setVisible] = React.useState(false);
  const [enabled, setEnabled] = React.useState(false);
  return (
    <Tooltip
      content="The checkbox controls whether the tooltip can show on hover or focus"
      relationship="description"
      visible={visible && enabled}
      onVisibleChange={(_ev, data) => setVisible(data.visible)}
    >
      <Checkbox label="Enable the tooltip" onChange={(_ev, { checked }) => setEnabled(!!checked)} />
    </Tooltip>
  );
};

Controlled.parameters = {
  docs: {
    description: {
      story: `The visibility of the tooltip can be controlled using the \`visible\` and \`onVisibleChange\` props.
        <br />
        In this example, the tooltip will show on hover or focus _only if_ the checkbox is checked.`,
    },
  },
};
```

### CustomMount

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Button, Tooltip } from '@fluentui/react-components';
import { SlideTextRegular } from '@fluentui/react-icons';
import type { TooltipProps } from '@fluentui/react-components';

export const CustomMount = (props: Partial<TooltipProps>): JSXElement => {
  const [ref, setRef] = React.useState<HTMLElement | null>();

  return (
    <>
      <Tooltip mountNode={ref} content="Example tooltip" relationship="label" {...props}>
        <Button icon={<SlideTextRegular />} size="large" />
      </Tooltip>
      <div ref={setRef} />
    </>
  );
};

CustomMount.parameters = {
  docs: {
    description: {
      story: `Tooltips are rendered in a React Portal. By default that Portal is the outermost div.
      A custom \`mountNode\` can be provided in the case that the tooltip needs to be rendered elsewhere.`,
    },
  },
};
```

## Best Practices

### Do's

- Always set the required relationship prop deliberately: use label for triggers with no visible text (for example an icon-only Button, as in the Relationship: label story) and description for triggers that already display a visible label.
- Keep the content slot to a short phrase or a single short sentence; the tooltip is a hint, not a place for documentation.
- Attach the tooltip to a focusable, interactive trigger such as Button or Checkbox so that keyboard users can reach it with Tab and receive the same information as pointer users.
- Use appearance="inverted" when the tooltip appears over a busy or light surface and the default normal appearance does not give enough contrast.
- Enable withArrow when the tooltip is placed at a non-default positioning (before, after, below, or one of the -start/-top/... variants) so the association between tooltip and target stays visually obvious.
- Raise showDelay and/or lower hideDelay when many tooltips sit next to each other — for example in a dense toolbar — to avoid flicker as the pointer sweeps across triggers.
- Use positioning with a target ref, as in the Target story, when the concept being described is smaller than the trigger (for example the icon inside a Button rather than the whole button).
- When you control visibility with visible, always keep visible and onVisibleChange in sync so hover, focus, and programmatic state do not fight each other.

### Don'ts

- Do not use relationship="inaccessible" merely to silence an ARIA warning; it removes the tooltip text from assistive technology entirely and is only acceptable when the same information is already exposed by another means.
- Do not place interactive elements (links or buttons) inside the content slot; a tooltip cannot receive focus, so those controls are unreachable by keyboard and screen reader users.
- Do not attach a tooltip directly to a static element such as a bare icon, and do not give a static element a tabindex to make the tooltip reachable — use InfoLabel for icon-with-information patterns instead.
- Do not repeat the trigger's visible label as the tooltip content; duplicating text adds noise for every user and is especially confusing with relationship="description".
- Do not rely on a tooltip to convey critical information, validation errors, or the only copy of a value, because hover and focus are optional interactions and touch users may never trigger it.
- Do not pass a large block of rich content into the content slot; use Popover when more than a line or two is needed.
- Do not set visible without handling onVisibleChange, or the tooltip can become permanently stuck open or closed.
- Do not wrap an element that cannot receive pointer or focus events (for example a disabled Button) and expect the tooltip to appear.

## Anti-Patterns

### Duplicating the visible label in the tooltip

❌ A tooltip whose content repeats the trigger's own visible text adds no information and, with relationship="description", causes screen readers to read the same words twice, which is noisy and suggests the text is meaningful when it is not.

✅ Only show a tooltip when it adds something the visible UI does not already convey. If there is nothing extra to say, omit the tooltip entirely.

### Icon-only buttons with relationship="description"

❌ An icon-only Button has no accessible name. Setting relationship="description" exposes the tooltip text only as a description, leaving the control announced without a name, so assistive technology users cannot tell what the button does.

✅ Use relationship="label" for any trigger without visible text, as shown in the Relationship: label story, so the tooltip content becomes the trigger's accessible name.

### Interactive or rich content inside the tooltip

❌ A tooltip is not focusable and disappears as soon as the pointer or focus moves, so links, buttons, images, and multi-paragraph content inside the content slot are unreachable and unreadable for keyboard and screen reader users.

✅ Keep the content slot to short, non-interactive text. Use Popover or TeachingPopover when the surface must accept focus, contain controls, or stay open on demand.

### Tooltips on static elements via tabindex

❌ Attaching a tooltip directly to a static icon, or adding a tabindex to a static element to make the tooltip reachable, puts a non-interactive element into the tab order and creates a confusing stop for keyboard users, while also breaking expected focus semantics.

✅ Use InfoLabel when the tooltip accompanies an icon or informational affordance, or attach the tooltip to the interactive control that actually owns the behavior.

### Controlled visibility without onVisibleChange

❌ Passing visible without handling onVisibleChange freezes the tooltip: hover and focus no longer update the value, so the tooltip becomes stuck open or never appears at all.

✅ Pair visible with onVisibleChange and write data.visible back into your state, as demonstrated in the Controlled story, so hover, focus, and programmatic control all feed the same value.

## Accessibility

**Requirements**: The relationship prop is mandatory and is the primary accessibility contract: relationship="label" writes the tooltip content to the trigger's aria-label (or aria-labelledby), relationship="description" exposes it through aria-description / aria-describedby, and relationship="inaccessible" writes nothing. An icon-only trigger must use relationship="label" so it has an accessible name; a trigger with visible text must use relationship="description" so the name is not overwritten. Content must remain readable at the default text size and must not be the only location of information required to complete a task, since tooltips cannot be summoned by touch or by screen reader virtual cursor in a reliable way. Static elements must never be given a tabindex just to host a tooltip; use InfoLabel so a focusable element owns the tooltip.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the trigger element; this counts as a focus event, so the tooltip is shown once showDelay elapses (250ms by default). |
| `Shift+Tab` | Moves focus backwards away from the trigger; focus leaving the element hides the tooltip after hideDelay elapses (250ms by default). |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-description

**Screen Reader**: The tooltip itself is not a focus target; the accessible name or description is applied to the trigger element, so the tooltip text is announced as part of the trigger's name or description when the user focuses it. With relationship="label" an icon-only button is announced with the tooltip text as its name; with relationship="description" the text is read after the trigger's own name; with relationship="inaccessible" no text is announced and the tooltip is purely visual. Because the trigger carries the semantics, the visibility changes that occur on hover and focus do not produce separate announcements, and there is nothing additional for a user to dismiss. Note that onVisibleChange's event argument is undefined when the change was triggered by a keyboard event on the document element; read data.documentKeyboardEvent when the keyboard event object is needed.

## Styling

The Tooltip itself exposes very few styling props, so customization is done through the content slot: pass an object with children and className instead of a plain string, and generate that className with makeStyles. Style the surface with theme tokens such as tokens.colorNeutralBackground1 for the normal appearance and tokens.colorNeutralBackgroundInverted for the inverted appearance, pair them with tokens.colorNeutralForeground1 / tokens.colorNeutralForegroundInverted for text, use tokens.colorNeutralStroke1 for a subtle border, tokens.shadow16 for elevation, tokens.borderRadiusMedium for corner rounding, and tokens.spacingHorizontalS and tokens.spacingVerticalXS for padding. Text sizing should come from tokens.fontSizeBase200 with tokens.fontFamilyBase rather than hard-coded pixel values. The arrow rendered by withArrow inherits the same background and border treatment as the surface, so changing the background token is enough to re-color the arrow; avoid overriding the arrow separately. The tooltip is portaled to the outermost div by default, so styles applied to a parent container will not reach it — either style through the content slot or use the mountNode prop to render the tooltip into a container you control.

## Performance

Tooltips are rendered into a portal and are only relevant while visible, so keep the content slot light — plain strings cost effectively nothing, while heavy JSX children are mounted and pruned as the tooltip toggles. The default 250ms showDelay and 250ms hideDelay exist specifically to damp flicker when the pointer sweeps across a group of triggers, which reduces the number of show/hide cycles in dense toolbars; do not set both to zero unless you have a strong reason. When you pass an object to positioning (for example with a target ref), keep the object identity stable across renders so repositioning logic is not recomputed unnecessarily, and hold the target element in state or a ref rather than creating a new node each render. If many tooltips share identical content and timing, consider hoisting the configuration to a shared constant or wrapper rather than repeating large object literals at each call site.

## Theming & Tokens

Tooltip consumes design tokens through the enclosing FluentProvider theme. The default normal appearance draws its surface from tokens.colorNeutralBackground1 with text from tokens.colorNeutralForeground1, a hairline tokens.colorNeutralStroke1 boundary, rounding from tokens.borderRadiusMedium, elevation from tokens.shadow16, and interior spacing from tokens.spacingHorizontalS and tokens.spacingVerticalXS; the label text typically uses tokens.fontSizeBase200 with tokens.fontFamilyBase. Setting appearance="inverted" switches the surface to tokens.colorNeutralBackgroundInverted and the text to tokens.colorNeutralForegroundInverted, so the same component reads correctly on light and dark themes without extra styles. Because colors come from tokens, the tooltip automatically matches brand and high-contrast themes applied by FluentProvider, and overriding the background token in the content slot is the supported way to re-color both the surface and the withArrow arrow.

## Edge Cases

- Disabled triggers do not fire the hover or focus events Tooltip listens for, so a tooltip wrapped around a disabled control will not appear; wrap the control in an enabled element that can receive those events.
- The child element must be able to accept a ref and event handlers. A component that does not forward its ref or spread unknown props will not act as a trigger and the tooltip will never show.
- On touch devices there is no hover state, so the tooltip only appears if the trigger receives focus, and it will be dismissed as the user continues interacting.
- relationship="inaccessible" sets no ARIA attributes on the trigger, making the tooltip content invisible to assistive technology — this is only safe when the same text is available some other way.
- When positioning.target is provided but the ref is still null on first render, the tooltip falls back to the trigger element until the target is attached, which can look like a flicker on first show.
- With controlled visible and no onVisibleChange handler, hover and focus no longer change the tooltip's state and it can remain permanently visible or permanently hidden.
- In onVisibleChange, the event argument is undefined when the change came from a keyboard event on the document element; use data.documentKeyboardEvent to inspect that event.
- Because the tooltip renders in a portal at the outermost div by default, parent overflow, transform, or stacking contexts can clip or cover it — supply mountNode to place it in a container you control when that happens.
- Users with motion sensitivity or who simply do not hover will never see tooltip-only information, so any content required to complete a task must also exist somewhere persistently visible.

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
