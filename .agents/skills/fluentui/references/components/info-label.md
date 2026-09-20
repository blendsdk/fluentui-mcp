# InfoLabel

> **Package**: `@fluentui/react-infolabel` v9.4.21
> **Import**: `import { InfoLabel } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

InfoLabel is a form label that combines the standard Label component with a trailing InfoButton whose popover holds supplementary guidance. The visible label text is provided as children, while the explanatory content is supplied through the info prop, which accepts plain strings as well as rich React content such as a fragment containing a Link to deeper documentation. Internally InfoLabel is composed from three slots: root (the wrapper that owns className and style), label (the rendered Label element and the primary slot, so native attributes like for/htmlFor, id, and event handlers land there), and infoButton (the trigger that opens the info popover). Because the label and the button are rendered together, the visual asterisk shown when required is true is placed between the label text and the InfoButton, and the component's size prop scales both the label text and the info button at once. InfoLabel is designed to drop into a Field: you render it through the label slot's render function so Field's association and required-state props flow into it.

**When to use**: Use InfoLabel whenever a form control's label needs a short, optional explanation that would clutter the form if always visible — for example units of measure, formatting rules, or a pointer to a privacy or policy page. Prefer plain Label when there is nothing extra to explain, since every InfoLabel adds an extra focusable button and a tab stop to the form. Prefer Field's visible helper text or validation message when the information is essential to completing the field correctly or when it changes based on validation state, because popover content lives behind an interaction and is not announced with the input. Prefer Tooltip for hints attached to arbitrary triggers (icons, buttons, truncated text) rather than for labelling an input. Inside a Field, use InfoLabel as the label slot's render function output so the Field still owns htmlFor, required, and the control relationship.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `info` | `NonNullable<(string \| number \| ReactElement<unknown, string \| JSXElementConstructor<any>> \| Iterable<any> \| ReactPortal \| (Omit<PopoverSurfaceSlots, "root"> & Omit<{ as?: "div" \| undefined; } & Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "children"> & { children?: any; }, "ref"> & RefAttributes<HTMLDivElement>)) \| null> \| undefined` | — | No | The content of the InfoButton's popover. |

### Prop Guidance

- **info**: The content of the info button's popover. Accepts a plain string for short explanations or rich React content when you need emphasis or a Link to deeper documentation. Always supply meaningful content; this is the only source of the popover text. `This ID is used to route requests; learn more about identifier formats.`
- **children**: The visible label text, which becomes the accessible name of the associated control. Keep it short, descriptive, and consistent with the terminology used elsewhere in the form; do not use it for the long explanation. `Workspace ID`
- **size**: Scales both the label text and the info button together, with medium as the default. Use small sparingly and only where there is at least 2px of non-interactive space around the info button, since the small variant only meets the minimum target size requirement under that condition. `medium`
- **required**: Displays the required indicator, which is rendered between the label text and the info button. It is a visual cue only, so the associated input must also be marked required. `true`
- **label (slot)**: The primary slot that renders the Label element. All native attributes passed directly to InfoLabel — such as the for attribute, id, and event handlers — are applied here, so you rarely need to set this slot explicitly. It is the right target when you need label-specific styling. `label={{ className: styles.labelText }}`
- **infoButton (slot)**: The slot that renders the info trigger and its popover. Prefer the info prop for content; only reach for this slot when you need to customize the trigger itself, and be careful not to strip its accessible name. `infoButton={{ className: styles.trigger }}`
- **for / htmlFor**: Native label association attribute forwarded to the label slot so the visible text names the form control. It is normally supplied automatically when InfoLabel is rendered through Field's label render function, so set it manually only when labelling a control outside Field. `workspace-id`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `infoButton` | — | Yes | The InfoButton component.  It is not typically necessary to use this prop. The content can be set using the `info` prop of the InfoLabel. |
| `label` | — | Yes | The Label component.  It is not typically necessary to use this prop. The label text is the child of the `<InfoLabel>`, and other props such as `size` and `required` should be set directly on the `InfoLabel`.  This is the PRIMARY slot: all native properties specified directly on `<InfoLabel>` will be applied to this slot, except `className` and `style`, which remain on the root slot. |
| `root` | — | Yes | — |

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

- Keep the child text of InfoLabel short and identical to what you would use for a plain Label, and move the longer explanation into the info prop.
- Provide real content for info — a sentence, a definition, or a fragment that includes a Link when users need to read more elsewhere.
- Set size and required directly on InfoLabel rather than trying to reach into the label or infoButton slots, since those props are designed to be configured at the top level.
- Use InfoLabel as the render function for Field's label slot so Field continues to supply the association attributes such as the for attribute and the required indication.
- Use the same info affordance consistently across a group of related fields so that the trailing info button becomes a predictable pattern instead of a surprise.
- Put essential or state-dependent guidance in visible helper text or the Field validation message, and reserve info for reference material that is useful but not required to succeed.
- Include a Link inside the info content when the explanation is long, instead of writing several paragraphs inside the popover.

### Don'ts

- Don't leave info undefined and still render InfoLabel — the info button is part of the composition, so users get an interactive trigger that opens an empty popover.
- Don't hide error text, formatting requirements, or any information the user must have before submitting inside the info popover.
- Don't expect className or style to restyle or reposition the label text; both stay on the root slot, while native props such as id land on the label slot.
- Don't rebuild the label or the info trigger by hand through the label and infoButton slots unless you are deliberately customizing their rendering — you would lose the built-in association and popover wiring.
- Don't mark required on InfoLabel while leaving the actual form control optional, or omit it while making the control required; the visual asterisk and the control's requirement must agree.
- Don't use size small without at least 2px of non-interactive space on all sides of the info button, since the small variant only meets the minimum target size requirement in that case.
- Don't nest an InfoLabel around another label or wrap non-labelling text in it; it is a label for a form control, not a general emphasized text element.

## Anti-Patterns

### Empty info popover

❌ Rendering InfoLabel without the info prop still produces an interactive info button, so keyboard and screen reader users land on a trigger that opens an empty surface and learn nothing.

✅ Either supply meaningful content through info, or switch to the plain Label component when there is nothing to explain.

### Critically important content hidden behind the popover

❌ Putting format rules, limits, or validation feedback only inside info means the guidance is invisible until the user activates the button, and it is not part of the input's accessible name or description, so many users never see it.

✅ Keep requirements and error feedback in visible helper text or the Field validation message, and reserve info for reference material that supplements but is not required to complete the field.

### Styling the wrong slot

❌ Applying className or style to InfoLabel intending to change the label text, then discovering the styles landed on the root wrapper while native props went to the label slot, produces confusing layout bugs and selectors that do not match.

✅ Target the label slot for label-specific typography and color, and use the root class only for wrapper-level layout such as spacing and alignment.

### Re-implementing the label and trigger by hand

❌ Rebuilding the label or the info button through the label and infoButton slots, or composing a separate button with your own popover, drops the built-in association attributes and the popover wiring, which breaks labelling and the accessible name of the trigger.

✅ Pass children and native attributes directly to InfoLabel and let the composition handle association and the popover; use the slots only for targeted customizations that do not remove those behaviours.

### Info affordance everywhere

❌ Adding an info button to every field in a dense form multiplies tab stops and DOM nodes, slows keyboard traversal, and makes the info trigger meaningless noise.

✅ Reserve InfoLabel for fields where users genuinely need supplemental explanation, and use plain Label for the rest of the form.

## Accessibility

**Requirements**: InfoLabel renders a real label element associated with its form control and an additional native button, so the pairing must satisfy standard labelling requirements. Ensure the info button has a meaningful accessible name, ensure the associated input carries the required attribute (or the equivalent ARIA state) whenever InfoLabel is marked required, and ensure that any information essential to completing the field is also available outside the popover. Because the small size reduces the info button's hit area, keep at least 2px of non-interactive space around it to meet the minimum target size requirement.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the info button when it is reached in DOM order, and then on to the form control and subsequent fields; each InfoLabel therefore contributes an additional tab stop. |
| `Shift+Tab` | Moves focus backwards out of the info button to the previous focusable element. |
| `Enter` | Activates the focused info button and opens the popover surface containing the info content. |
| `Space` | Activates the focused info button identically to Enter, since it is a native button. |
| `Escape` | Closes the open popover and dismisses the info content, returning the user to the trigger. |

**ARIA**: aria-label on the info button, so the trigger is announced with a meaningful purpose rather than as an unlabelled button, for (htmlFor) on the rendered label, which creates the programmatic association between the visible label text and the form control, required on the associated form control, since the asterisk rendered by the required prop is a visual cue and does not by itself convey requiredness to assistive technology, aria-expanded and aria-controls on the info button, reflecting whether the popover surface is currently open and which element it controls, aria-describedby on the form control when the info content is essential, because popover content is not automatically included in the control's accessible name or description

**Screen Reader**: The label text is exposed as the accessible name of the associated form control through the rendered label element. The info button appears immediately after the label text in the reading order and is announced as a button; because the popover surface is rendered in a portal, its content is inserted near the end of the document rather than next to the label, and it exists in the DOM only while the popover is open. Focus typically remains on the trigger when the popover opens, so users reach the content with the reading cursor or by tabbing, and pressing Escape closes it. Assistive technology does not read the popover text as part of the input's description, so any information the user must have in order to fill in the field correctly should also be exposed through visible text or an explicit description reference.

## Styling

Use makeStyles with Griffel tokens rather than inline styles for consistent theming. Remember the slot split: className and style applied to InfoLabel land on the root slot, so root-level layout such as columnGap or the gap between the text, the required asterisk, and the info button is controlled there — common choices are tokens.spacingHorizontalXXS and tokens.spacingHorizontalXS. To change the label's own typography or color, target the label slot rather than the root, or scope descendant selectors from the root class; label text color usually maps to tokens.colorNeutralForeground1, with tokens.colorNeutralForegroundDisabled for disabled fields. The required asterisk is conventionally colored with tokens.colorPaletteRedForeground1. Text sizing for the three size options aligns roughly with tokens.fontSizeBase200, tokens.fontSizeBase300, and tokens.fontSizeBase400, paired with tokens.lineHeightBase200, tokens.lineHeightBase300, and tokens.lineHeightBase400. Focus treatment on the info button follows the shared focus tokens such as tokens.colorStrokeFocus2, and surrounding vertical rhythm is usually expressed with tokens.spacingVerticalXS or tokens.spacingVerticalS when InfoLabel is stacked above its control. Avoid overriding the popover surface layout from the label's stylesheet; instead style the surface from the content you pass into info so it stays scoped to the popover.

## Performance

InfoLabel is a lightweight composition — a label element plus one button — so its per-field cost is small, but it is additive: in a long form, every field that uses it contributes an extra focusable element and additional DOM, so use it deliberately rather than by default. The popover content described by info is only mounted while the popover is open, so an expensive subtree passed as info is not rendered on the initial form render; the flip side is that the first open pays the mounting cost, which can cause a visible delay for large or data-fetching content, and stateful content inside the popover resets every time it is closed and reopened. Keep info content small and self-contained, and link out for anything lengthy. Creating a new React element for info on each parent render is inexpensive on its own, but memoizing rich content avoids unnecessary reconciliation in highly interactive forms.

## Theming & Tokens

InfoLabel consumes the FluentProvider theme through design tokens, so label text, the required asterisk, and the info button update automatically between light, dark, and high-contrast themes. Label text typically resolves to tokens.colorNeutralForeground1, disabled fields to tokens.colorNeutralForegroundDisabled, and the required indicator to tokens.colorPaletteRedForeground1. Type scales are driven by tokens.fontSizeBase200, tokens.fontSizeBase300, and tokens.fontSizeBase400 with the matching tokens.lineHeightBase200, tokens.lineHeightBase300, and tokens.lineHeightBase400 across the small, medium, and large sizes. Spacing between the label text, the asterisk, and the info button resolves through tokens.spacingHorizontalXXS and tokens.spacingHorizontalXS, and the info button inherits button theming tokens for its hover, pressed, and focus states, including focus tokens such as tokens.colorStrokeFocus2. Because spacing and layout use logical tokens, the composition mirrors correctly under right-to-left direction without custom overrides. Overriding these tokens locally on the root slot changes the label and the info button together, which is the supported way to match InfoLabel to a custom surface.

## Migration Notes

In earlier Fluent UI React lines the label and the info affordance were separate pieces: you composed a Label with a standalone InfoButton and were responsible for wiring the popover, the accessible name of the trigger, and the association with the control. InfoLabel collapses that into one component — the infoButton slot is provided for you and the popover content is declared with the info prop, which accepts rich content including links, so most manual wiring can be deleted. Also note the v9 slot behavior when porting styles: props such as id and other native attributes are applied to the label slot, while className and style remain on the root, which differs from components where every attribute lands on the root element. Teams that previously faked required indicators with custom markup should now use the required prop on InfoLabel and the corresponding required state on the control.

## Edge Cases

- The info button renders even when info is undefined, so the popover can open empty; use the plain Label component when there is no explanatory content to show.
- className and style stay on the root slot while other native attributes such as id are forwarded to the label slot, so a selector written against an id targets the label element rather than the wrapper.
- When InfoLabel is rendered through Field's label slot render function, spread the props Field provides first and then set info and children, so Field's association and required-state attributes are preserved except where you intentionally override them.
- The required indicator is rendered between the label text and the info button, not immediately after the text, which changes the expected spacing and any custom separator styling.
- The small size only satisfies the minimum target size requirement when the info button has at least 2px of non-interactive space on all sides, so dense small-sized layouts can fail target size checks.
- Popover content is rendered in a portal, so it is not a DOM descendant of the label or the Field; descendant CSS selectors written from the form will not reach it, and its reading order position differs from its visual position.
- Stateful or editor-like content placed inside info is unmounted when the popover closes, so any input, scroll position, or expanded state inside it resets on every reopen.
- Very long info content is constrained by the popover surface and can end up scrolling; shorten the text or link out rather than embedding large documentation blocks.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
