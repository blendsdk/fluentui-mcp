# Infolabel

> **Package**: `@fluentui/react-infolabel` v9.4.21
> **Import**: `import { Infolabel } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

InfoLabel is a forms component that pairs a regular form label with a small info button that reveals supplemental content inside a popover. The visible label text is supplied as the component's children and names the control it describes, while the info prop supplies the extra explanation that appears when the info button is activated. This lets a field carry both a concise, always-visible name and optional supporting detail such as a format rule, a security note, or a link to deeper documentation, without permanently consuming layout space. InfoLabel supports a size prop with small, medium, and large values (default medium) that scales both the label text and the info button, an inline boolean for label flow, and a popover prop that forwards slot props to the underlying Popover rendered by the info button. The Required story additionally demonstrates a required mode in which the indicator asterisk is placed before the info button.

**When to use**: Use InfoLabel when a form control needs a visible label plus supplementary information that should stay out of the way until the user asks for it — for example explaining an accepted input format, clarifying a rarely used option, or pointing to documentation. Use it instead of a bare Label whenever the difference between the label and the help text matters, and instead of a standalone Tooltip on an unrelated icon, because the info button is visually and programmatically tied to the label it belongs to. Use it inside the label slot of a Field (as shown in the In a Field story, rendering the label slot with a render function) so the label-to-input association is preserved. Prefer a plain Label when the label alone is sufficient, and prefer a visible hint or description in the Field when the information is essential to completing the field correctly, since popover content is hidden until opened.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `info` | `InfoButtonProps['info']` | — | No | — |
| `inline` | `boolean` | — | No | — |
| `popover` | `InfoButtonSlots['popover']` | — | No | — |
| `size` | `'small' \| 'medium' \| 'large'` | — | No | — |

### Prop Guidance

- **size**: Controls the scale of both the label text and the info button; the default is medium. Match it to the size of the input the label describes, and remember that small only meets WCAG's minimum target size when at least 2px of non-interactive space surrounds it. `medium`
- **inline**: Renders the label so it flows inline with surrounding content instead of as its own block, which is useful in dense toolbars or sentence-like layouts where the label sits beside other text. `true`
- **info**: Supplies the content shown in the popover when the info button is activated. It accepts a plain string for simple explanations or richer content such as a fragment with a Link when users should be able to navigate to more detail. `A short explanation, optionally containing a Link to documentation.`
- **popover**: Forwards slot props to the Popover that the info button opens, letting you tune how the help content is presented and dismissed without rebuilding the trigger. Use it for popover-level options rather than styling hacks on the label itself. `Slot props for the info button's popover.`

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement, InfoLabelProps } from '@fluentui/react-components';
import { InfoLabel, Link } from '@fluentui/react-components';

export const Default = (props: Partial<InfoLabelProps>): JSXElement => (
  <InfoLabel
    info={
      <>
        This is example information for an InfoLabel. <Link href="https://react.fluentui.dev">Learn more</Link>
      </>
    }
    {...props}
  >
    Example label
  </InfoLabel>
);
```

### InField

```tsx
import * as React from 'react';
import type { JSXElement, LabelProps } from '@fluentui/react-components';
import { Field, InfoLabel, Input } from '@fluentui/react-components';

export const InField = (): JSXElement => (
  <Field
    label={{
      children: (_: unknown, props: LabelProps) => (
        <InfoLabel {...props} info="Example info">
          Field with info label
        </InfoLabel>
      ),
    }}
  >
    <Input />
  </Field>
);

InField.storyName = 'In a Field';
InField.parameters = {
  docs: {
    description: {
      story:
        'An `InfoLabel` can be used in a `Field` by rendering the label prop as an InfoLabel. This uses the slot ' +
        '[render function]' +
        '(./?path=/docs/concepts-developer-customizing-components-with-slots--docs#replacing-the-entire-slot) ' +
        'support. See the code from this story for an example.',
    },
  },
};
```

### Required

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { InfoLabel } from '@fluentui/react-components';

export const Required = (): JSXElement => (
  <InfoLabel info="Example info" required>
    Required label
  </InfoLabel>
);

Required.parameters = {
  docs: {
    description: {
      story: 'When marked `required`, the indicator asterisk is placed before the InfoButton.',
    },
  },
};
```

## Best Practices

### Do's

- Write info content that adds context the label cannot carry, such as constraints, units, or a link to more detail.
- Use the info prop with a fragment containing a Link when you want to point users to external documentation, as shown in the Default story.
- Pass Field's label slot props through to InfoLabel when rendering it as a field label, so the label stays associated with the input.
- Match the size prop to the size of the control being labeled so the label, info button, and input share a visual scale.
- Use the inline boolean when the label must flow within surrounding text rather than occupy its own block.
- Use the required mode when the field is mandatory; the asterisk is rendered before the info button so it stays adjacent to the label text.
- Keep the label text short and descriptive, and let the info content carry the longer explanation.

### Don'ts

- Do not place information that is required to complete the field only inside the info popover; users who never open it will miss it.
- Do not repeat the label text verbatim inside the info content, which adds noise for both visual and screen reader users.
- Do not use the small size in dense layouts without at least 2px of non-interactive space on all sides, as noted in the Size story's WCAG guidance.
- Do not override internal typography or icon spacing to change the label and info button appearance; use the size prop instead.
- Do not use InfoLabel as a generic tooltip trigger for arbitrary icons or controls that have no associated field.
- Do not cram long-form documentation, multiple focusable controls, or large embedded content into the info popover.

## Anti-Patterns

### Critical instructions hidden in the popover

❌ Any information that lives only inside the info popover is invisible and unannounced until the user discovers and opens the info button, so required formats or constraints will be missed.

✅ Put must-know guidance in visible text or the Field's description, and reserve the info prop for genuinely supplemental detail such as rationale, edge cases, or links.

### Long-form docs stuffed into the info popover

❌ Popover content is meant for a short explanation; paragraphs of documentation, multiple links, or embedded controls make the popover hard to read and awkward to navigate by keyboard.

✅ Keep the info content to a sentence or two plus at most one link, and send users to a documentation page for the full explanation.

### Using InfoLabel as a generic tooltip trigger

❌ InfoLabel is built around labeling a form control; using it to attach help to unrelated icons or actions produces misleading semantics and duplicate labels.

✅ Use Tooltip or a dedicated icon button for non-field help, and reserve InfoLabel for labels that name a form control.

### Overriding size and spacing with custom CSS

❌ Hard-coding font sizes, icon sizes, or gaps on InfoLabel internals breaks the shared density and theme tokens that Field, Label, and the inputs rely on, and quickly drifts from the rest of the form.

✅ Use the size prop for scale and the inline prop for flow, and limit custom styling to the root with spacing tokens.

### Skipping the label slot render function in Field

❌ Dropping InfoLabel directly into a Field without using the label slot render function, or without spreading the passed label props, can break the programmatic association between the label and the input.

✅ Render the label slot as a function that receives label props and spreads them onto InfoLabel, as demonstrated in the In a Field story.

### Duplicating the label text in the info content

❌ Restating the label inside the popover adds no information and causes screen reader users to hear the same wording twice.

✅ Assume the label has been read; use the info content to add constraints, units, examples, or links instead.

## Accessibility

**Requirements**: The info button is an icon-only control, so it must expose a meaningful accessible name; assistive technology users will otherwise hear only an unlabeled button next to the label. The label must remain programmatically associated with its input, which Field handles when InfoLabel is rendered through the label slot and the slot props are passed through. Popover content must be reachable and dismissible with the keyboard and must not trap focus. The Size story notes that the small size only satisfies WCAG's minimum target size requirement when the control has at least 2px of non-interactive space on all sides, so verify spacing when choosing small.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the label's info button, and into any focusable content (such as a Link) inside the open popover. |
| `Shift+Tab` | Moves focus backward out of the popover or past the info button to the previous focusable element. |
| `Enter` | Activates the focused info button and opens the popover with the info content. |
| `Space` | Activates the focused info button and opens the popover with the info content. |
| `Escape` | Closes the open popover and returns focus to the info button. |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-expanded, aria-hidden

**Screen Reader**: Screen readers announce the visible label text together with the form control it labels when the association is intact, then encounter the info button as a separate button whose name should describe the additional information. Opening the popover surfaces the info content in the reading order; while the popover is closed that content is not announced, so anything critical must also exist in visible text. When the info content includes a Link, it is read as a link inside the popover and must be reachable by keyboard.

## Styling

Prefer the size prop over manual font overrides: small, medium (the default), and large scale both the label and the info button through typography tokens such as tokens.fontSizeBase200, tokens.fontSizeBase300, and tokens.fontSizeBase400, so overriding them by hand breaks density and theme consistency. When you need to nudge layout, style the InfoLabel root with makeStyles and spacing tokens like tokens.spacingHorizontalXS or tokens.spacingHorizontalXXS for the gap between the label text and the info button, and rely on the inline prop for flow behavior instead of forcing display values. Colour-wise the label text follows tokens.colorNeutralForeground1, the info button glyph follows tokens.colorNeutralForeground2 with hover and pressed variants such as tokens.colorNeutralForeground2Hover and tokens.colorNeutralForeground2Pressed, and the focus indicator uses tokens.colorStrokeFocus2. The popover surface is inherited from the Popover component, so style it through the popover slot rather than by reaching into InfoLabel internals.

## Performance

InfoLabel is a lightweight composition of a label and a small icon button, so it is cheap to render even in long forms; the weight of the component is essentially the popover, whose content is only mounted when the user opens it. Because of that lazy behavior, avoid building large or expensive element trees in the info prop, and keep the content short enough that opening the popover is instant. Each InfoLabel adds a keyboard tab stop, so in very large forms consider whether every field genuinely needs an info button or whether a shared description would serve better.

## Theming & Tokens

InfoLabel is fully token-driven and responds to the active FluentProvider theme. Label text uses neutral foreground tokens such as tokens.colorNeutralForeground1, while the info button glyph picks up tokens.colorNeutralForeground2 with hover, pressed, and disabled variants like tokens.colorNeutralForeground2Hover, tokens.colorNeutralForeground2Pressed, and tokens.colorNeutralForegroundDisabled. Typography follows the size prop through tokens.fontSizeBase200, tokens.fontSizeBase300, and tokens.fontSizeBase400 with the corresponding line-height and weight tokens, and the interactive focus ring uses tokens.colorStrokeFocus2. The popover shown by the info button inherits neutral surface, border, and shadow tokens from the Popover component, so switching between light and dark themes updates both the label and the help content without extra styling.

## Migration Notes

InfoLabel is the v9 way to attach supplementary help to a form label; before it, teams manually composed a Label with a separate icon button and Tooltip, or duplicated help text next to the input. If you are moving existing help-icon patterns to v9, replace the hand-built icon plus tooltip with a single InfoLabel, keep the visible label text as children, and move the explanatory copy into the info prop. When placing it in a Field, use the label slot with a render function and spread the slot props onto InfoLabel so the label-to-input association that Field previously handled remains intact.

## Edge Cases

- The small size only satisfies WCAG's minimum target size requirement when at least 2px of non-interactive space surrounds it, so avoid packing small InfoLabels tightly against other controls.
- Content placed only in the info prop is not announced while the popover is closed; treat it as optional detail rather than required guidance.
- When the required mode is used, the indicator asterisk is rendered before the info button, which changes the visual order of the label, asterisk, and info button and should be verified against your layout.
- When rendering InfoLabel through a Field label slot, the props handed to the render function must be spread onto InfoLabel, otherwise the label-to-input association can be lost.
- The info prop accepts both plain strings and rich content; when you supply elements such as a Link, confirm the link is keyboard reachable inside the opened popover.
- An empty or undefined info value still renders the info button, so avoid creating a trigger that has nothing to show.

## See Also

- - [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
