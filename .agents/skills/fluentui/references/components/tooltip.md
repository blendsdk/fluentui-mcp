# Tooltip

> **Package**: `@fluentui/react-tooltip` v9.10.2
> **Import**: `import { Tooltip } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

Tooltip is a feedback component that displays a short, contextual text label or description when the user hovers over or focuses a trigger element. In Fluent UI React v9 it wraps a single trigger child and renders its content in a React Portal (the outermost div by default, or a custom node supplied through mountNode), positioning itself relative to that trigger using the positioning prop, which defaults to "above". The component manages its own show/hide lifecycle with configurable showDelay and hideDelay values (both defaulting to 250 milliseconds), and it can alternatively be driven programmatically through the visible and onVisibleChange props. A required relationship prop determines how assistive technology perceives the tooltip: as the trigger's label, as its description, or as inaccessible decoration. Tooltip supports a normal appearance based on the theme's surface colors and an inverted appearance that uses the theme's inverted (high-contrast) colors, and it can optionally render a pointing arrow via withArrow. The tooltip's body is expressed through a single required content slot, which accepts either plain text or JSX and whose slot object also carries the className used for custom styling.

**When to use**: Use Tooltip to provide a brief, supplementary explanation for a control the user can already identify — for example, clarifying an icon-only button, explaining what a toggle does, or exposing the full value of truncated text. It is the right choice when the information is helpful but not required to complete the task, because tooltips appear only on hover or focus and are unreachable on touch devices until the trigger is focused. Choose relationship="label" when the trigger has no visible text (icon-only buttons) so the tooltip supplies the accessible name, and choose relationship="description" when the trigger already has a visible label and the tooltip only adds detail. For icons that annotate a form label or a data value, prefer the InfoLabel component, which wires up an accessible focusable trigger for you. For content the user must interact with — buttons, links, inputs, or multi-step guidance — use Popover instead, since Tooltip content is not designed to be hovered into or interacted with. For critical, blocking, or destructive information that must not be missed, use Dialog, MessageBar, or inline Text rather than a tooltip. Avoid using Tooltip purely for decoration; if the tooltip text duplicates what is already visible, it adds noise for sighted users and can confuse screen reader users depending on the value of the relationship prop.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"normal" \| "inverted" \| undefined` | `normal` | No | The tooltip's visual appearance. * `normal` - Uses the theme's background and text colors. * `inverted` - Higher contrast variant that uses the theme's inverted colors. |
| `hideDelay` | `number \| undefined` | `250` | No | Delay before the tooltip is hidden, in milliseconds. |
| `onVisibleChange` | `((event: React.PointerEvent<HTMLElement> \| React.FocusEvent<HTMLElement> \| undefined, data: OnVisibleChangeData) => void) \| undefined` | — | No | Notification when the visibility of the tooltip is changing.  **Note**: for backwards compatibility, `event` will be undefined if this was triggered by a keyboard event on the document element. Use `data.documentKeyboardEvent` if the keyboard event object is needed. |
| `positioning` | `any` | `above` | No | Configure the positioning of the tooltip |
| `ref` | `any` | — | No | — |
| `relationship` | `"label" \| "description" \| "inaccessible"` | — | Yes | (Required) Specifies whether this tooltip is acting as the description or label of its trigger element.  * `label` - The tooltip sets the trigger's aria-label or aria-labelledby attribute. This is useful for buttons    displaying only an icon, for example. * `description` - The tooltip sets the trigger's aria-description or aria-describedby attribute. * `inaccessible` - No aria attributes are set on the trigger. This makes the tooltip's content inaccessible to   screen readers, and should only be used if the tooltip's text is available by some other means. |
| `showDelay` | `number \| undefined` | `250` | No | Delay before the tooltip is shown, in milliseconds. |
| `visible` | `boolean \| undefined` | `false` | No | Control the tooltip's visibility programatically.  This can be used in conjunction with onVisibleChange to modify the tooltip's show and hide behavior.  If not provided, the visibility will be controlled by the tooltip itself, based on hover and focus events on the trigger (child) element. |
| `withArrow` | `boolean \| undefined` | `false` | No | Render an arrow pointing to the target element |

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

- Always set the required relationship prop deliberately: use relationship="label" only when the trigger has no visible text (such as an icon-only Button), and relationship="description" when the trigger already has a visible label.
- Keep content to a short phrase or single sentence so it is scannable while the pointer rests on the trigger.
- Attach tooltips to focusable controls like Button, Link, Checkbox, or Switch so the tooltip can be revealed by keyboard focus as well as pointer hover.
- Use InfoLabel instead of Tooltip when annotating an icon that has no interactive target of its own, so the correct focusable trigger is generated for you.
- Pair visible with onVisibleChange when you take control of visibility, as shown in the Controlled story, so users can still show and hide the tooltip.
- Tune showDelay and hideDelay (both default to 250 milliseconds) when a trigger sits in a dense toolbar and users need faster or slower reveals.
- Pass classNames through the content slot object when you need to style the tooltip, and use withArrow when the tooltip could otherwise be mistaken for unrelated nearby text.
- Use positioning.target when the tooltip should point to a sub-element of the trigger, such as the icon inside a Button, rather than the trigger's bounding box.

### Don'ts

- Do not use relationship="inaccessible" on a trigger that would otherwise have no accessible name; an icon-only button with an inaccessible tooltip has no way to be announced.
- Do not attach a Tooltip directly to a static, non-focusable element such as a bare icon or a span of text, and do not give that static element a tabindex just to make the tooltip reachable.
- Do not put interactive content such as buttons or form fields inside the content slot; the tooltip is not designed for interaction — use Popover instead.
- Do not place essential or destructive information (error text, irreversible action warnings, required instructions) in a tooltip, because it is unavailable on touch and can be missed entirely.
- Do not set visible without also handling onVisibleChange, or the tooltip can become stuck open and stop responding to hover and focus.
- Do not remove tooltips that carry an accessible name (relationship="label") on the assumption that visual users can guess the icon's meaning; that also removes the name from assistive technology.
- Do not use an extremely long hideDelay to "help" users read a long tooltip — instead shorten the content, since a lingering tooltip can obscure the interface.
- Do not use Tooltip as a substitute for visible helper text on form fields; use the Field component's hint and validation message instead.

## Accessibility

## See Also

- - [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
