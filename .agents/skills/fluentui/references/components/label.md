# Label

> **Package**: `@fluentui/react-label` v9.4.2
> **Import**: `import { Label } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Label renders an accessible caption for a form control such as an Input, Textarea, Select, Combobox, Checkbox, Radio, Switch, Slider, or SpinButton. It emits a single root element (a native label element by default) and an optional required indicator slot, so the visible text can be programmatically tied to the control it describes instead of being a plain paragraph of text. Because it is a real label element, activating it (with a mouse or touch) moves focus to, or toggles, the associated control. Label supports three sizes (small, medium, and large), two font weights (regular and semibold), a disabled visual state, and a required indicator that can be the default asterisk or fully custom content such as a different character, a string, or an inline element. In practice Label is usually composed inside higher-level form building blocks, but it can also be used standalone when you need to hand-assemble the relationship between a caption and its control.

**When to use**: Use Label whenever a form control needs a visible caption that users can click to focus or toggle the control. Reach for Label when building custom field layouts by hand, when you need a caption whose text must be associated with an input's id, or when you need a required indicator with a custom marker. Prefer Field when you want the label, control, hint text, and validation message managed and spaced for you, and prefer the label composition that already ships with components such as Field, Checkbox, and Radio when those components provide their own caption. Use Text instead of Label for headings, descriptions, and any string that does not caption a form control, since Text carries typography without implying a control relationship. Use Label with the disabled or required props only when the underlying control is genuinely disabled or required.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean \| undefined` | `false` | No | Renders the label as disabled |
| `required` | `boolean \| (string \| number \| ReactPortal \| ({ as?: "span" \| undefined; } & Omit<DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "children"> & { children?: any; }) \| ReactElement<unknown, string \| JSXElementConstructor<any>> \| Iterable<any>) \| null \| undefined` | `false` | No | Displays an indicator that the label is for a required field. The required prop can be set to true to display an asterisk (*). Or it can be set to a string or jsx content to display a different indicator. |
| `size` | `"small" \| "medium" \| "large" \| undefined` | `'medium'` | No | A label supports different sizes. |
| `weight` | `"regular" \| "semibold" \| undefined` | `regular` | No | A label supports regular and semibold fontweight. |

### Prop Guidance

- **disabled**: Renders the caption with the disabled foreground color and no interactive affordance. Apply it only when the associated control is genuinely disabled and the reason is discoverable from the surrounding UI, since the resulting contrast intentionally falls below WCAG minimums. The prop is purely visual and does not disable the control or expose a disabled state to assistive technology. `true`
- **required**: Displays an indicator that the captioned field is required. Pass true for the default asterisk, or pass a string or inline element to render your own indicator, such as a localized word or a different symbol. Keep it in sync with the control's own required semantics, and remember that falsy values suppress the indicator entirely, so only use it when the field is truly required. `true, or a custom marker string such as three asterisks`
- **size**: Controls the caption's font size and line height. Use small when the label sits beside compact controls in dense layouts, medium as the default for standard forms, and large for prominent single-field layouts or onboarding screens. Match the size to the control's own size so the caption and the field look like one unit. `medium`
- **weight**: Selects regular or semibold font weight. Keep regular for ordinary field captions and reserve semibold for labels that need to stand out, such as the first field in a form section or a label used as a group heading above several controls. Semibold at the large size can read like a heading, so use that combination deliberately. `semibold`
- **root slot**: The root slot renders the caption element itself and is where className, native label attributes for association, and event handlers are applied. Use it to merge custom Griffel classes, to attach the association attributes for the control, and to add native handlers; avoid swapping the element type unless you are intentionally rendering a non-label caption. `className merged with mergeClasses`
- **required slot**: The required slot renders whatever the required prop resolves to and only appears when required is truthy. Style it through the required state styling hooks if you need a different color or spacing for the marker, and pass meaningful content rather than decorative glyphs when the indicator has to be understandable. `rendered only when required is set`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `required` | — | No | — |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Label } from '@fluentui/react-components';
import type { LabelProps } from '@fluentui/react-components';

export const Default = (props: LabelProps): JSXElement => <Label {...props}>This is a label</Label>;
```

### Disabled

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Label } from '@fluentui/react-components';

export const Disabled = (): JSXElement => (
  <Label disabled required>
    Disabled label
  </Label>
);

Disabled.parameters = {
  docs: {
    description: {
      story:
        'A Label can be disabled.\n' +
        `Since this state does not meet the required accessibility contrast ratio,
      it should be used sparingly and make it clear that there's no interaction with the
      control associated with it.`,
    },
  },
};
```

### Required

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Label } from '@fluentui/react-components';

export const Required = (): JSXElement => (
  <>
    <Label required>Required label</Label>
    <Label required="***">Required label</Label>
  </>
);

Required.parameters = {
  docs: {
    description: {
      story:
        'A Label can display a required asterisk or a custom required indicator. This custom required indicator can' +
        'be a custom string or jsx content.',
    },
  },
};
```

## Best Practices

### Do's

- Associate each Label with exactly one form control, either by placing the control inside the label content or by connecting the root element to the control's unique id, so clicking or tapping the caption focuses or activates that control.
- Set the required prop on the Label only when the associated control is actually required, and mirror that state on the control itself so assistive technology announces the same requirement.
- Match the Label size to the size of the control it captions: use small for compact or dense layouts, medium for standard forms, and large for hero or single-field layouts.
- Use weight semibold sparingly to give a label visual priority in a group, such as the first field in a section, and keep regular weight for the majority of fields.
- Provide a custom required indicator when an asterisk would be ambiguous, for example by passing a short localized word or a descriptive marker as the required value.
- Reach for Field when the label must sit above a control together with hint text and a validation message, so spacing and error styling stay consistent.
- Use the disabled prop only when the control it captions is truly non-interactive, and make it obvious elsewhere in the UI why the field cannot be used.
- Keep label text short, sentence case, and free of trailing punctuation such as colons so it reads cleanly when announced with the control's value.

### Don'ts

- Do not use Label as a general-purpose text or heading element; use Text with an appropriate typography size or weight instead, because a label that is not tied to a control misleads both sighted and assistive technology users.
- Do not apply the disabled prop while leaving the associated control enabled, or vice versa, because the visual affordance will contradict the actual interaction state.
- Do not rely on the asterisk from the required prop alone to communicate that a field is required, since the marker is decorative for many screen reader users unless the control also exposes its required state.
- Do not nest interactive elements such as links or buttons inside the label text, because activating them also activates the label's associated control.
- Do not wrap a whole group of checkboxes, radios, or inputs in a single Label; each control needs its own caption, and groups need a separate group label.
- Do not override font size, weight, or color with hard-coded values; use the theme tokens so the Label stays consistent with Fluent theming and high-contrast modes.
- Do not set size, weight, disabled, or required on a Label that is already rendered by a Field, since the two sets of values can disagree and produce inconsistent styling.
- Do not leave a Label without an associated control or associate two Labels with the same control; either case produces ambiguous accessible names.

## Anti-Patterns

### Using Label as body text or a heading

❌ Label renders a native label element whose purpose is to name a form control. Using it for paragraphs, headings, or captions on non-interactive content produces semantics that do not match the visual result, and assistive technology users hear a label with nothing to label.

✅ Use Text with the appropriate size and weight for headings and descriptive copy, and reserve Label exclusively for captions that are associated with a form control.

### Relying on the asterisk to convey required state

❌ The required indicator is a visual marker. If the associated control does not also expose a required state, users of screen readers and users who cannot distinguish the marker's color receive no indication that the field is mandatory.

✅ Keep the required prop on the Label for the visual cue and make the control itself announce its required status, or supply a custom required value whose meaning survives being read aloud.

### Disabling the caption but not the control

❌ The disabled prop only changes color and does not make the control non-interactive, so the field looks unavailable while still accepting focus and input. It also produces text contrast that fails WCAG minimums.

✅ Disable the actual control and apply the disabled prop to the Label at the same time, or better, let Field coordinate both so the visual and interactive states never diverge. Use disabled styling sparingly.

### Hand-rolling markup instead of composing Field

❌ Assembling a caption, control, hint, and error message by hand with a bare Label typically leads to inconsistent spacing, missing association, and error text that is never announced.

✅ Use Field whenever a caption, hint, and validation message are needed together, and drop down to a standalone Label only for layouts Field cannot express.

### Embedding interactive elements inside the caption

❌ Content placed inside the label is part of the label's activation region, so a link or button inside the text will also focus or toggle the associated control when activated, producing surprising double actions.

✅ Keep the caption text-only. Render help links, info buttons, or secondary actions as siblings of the Label, or use InfoLabel or InfoButton style patterns placed next to the control.

## Accessibility

**Requirements**: Label exists to provide an accessible name for a form control, so the association between the two is the primary accessibility requirement. Associate the root element with the control using native label semantics (matching the control's id) or by containing the control as a child. Text rendered by Label must meet WCAG 1.4.3 contrast requirements of at least 4.5:1; the disabled visual state intentionally does not meet this ratio, so it must be used sparingly and only where the loss of interaction is clear from the surrounding UI. Required state must be conveyed programmatically as well as visually, meaning the control itself should expose its required status so users who cannot perceive the asterisk still know the field is required. Do not communicate required or disabled state through color alone; combine the marker with the control's own semantics and, where useful, explanatory text.

| Key | Action |
| --- | --- |
| `Tab` | Label itself is not in the tab order; focus moves directly to the associated form control, which receives its accessible name from the Label. |
| `Shift+Tab` | Moves focus backwards past the Label to the previous focusable element, again skipping the Label itself. |
| `Enter` | When focus is on the associated control and the control treats Enter as activation (for example a button-like control), the name provided by the Label is announced with that control; Label adds no key handling of its own. |
| `Space` | When the associated control is a checkbox, radio, or switch, pressing Space while the control is focused toggles it; the Label contributes only the accessible name. |

**ARIA**: aria-required on the associated control so the requirement conveyed by the required indicator is programmatically available, aria-disabled on the associated control when it is non-interactive, since the disabled prop on Label is a visual state only, aria-labelledby when a native label association cannot be used and the caption text must be referenced by id, aria-label as a fallback for controls that have no visible caption at all, aria-describedby when the caption must be supplemented by hint or error text rendered outside the Label, aria-hidden on purely decorative custom required indicator content when the required state is already announced by the control

**Screen Reader**: Screen readers do not announce Label as an interactive element; they use it as the accessible name for the control it captions. When focus lands on the associated control, the screen reader announces the label text followed by the control role, and typically appends required or invalid state when the control exposes it. The default required asterisk is generally treated as text content or decoration, which is why the control's own required semantics matter. Custom content passed through the required value is read as part of the label text, so a custom indicator such as a word will be announced verbatim while a symbol may be announced as an arbitrary character or ignored; keep custom indicators meaningful when spoken. Because the disabled prop only changes the visual appearance, screen readers continue to report the control as enabled unless the control itself is disabled.

## Styling

Label accepts a className on its root slot, so customize it with makeStyles and mergeClasses rather than inline styles. The default text color comes from tokens.colorNeutralForeground1, and a secondary caption can use tokens.colorNeutralForeground2. The disabled state maps to tokens.colorNeutralForegroundDisabled, which is intentionally low contrast. Size maps to typography tokens: small uses tokens.fontSizeBase200 with tokens.lineHeightBase200, medium uses tokens.fontSizeBase300 with tokens.lineHeightBase300, and large uses tokens.fontSizeBase400 with tokens.lineHeightBase400. Weight maps to tokens.fontWeightRegular and tokens.fontWeightSemibold. The required indicator is typically colored with a danger token such as tokens.colorPaletteRedForeground1 or tokens.colorStatusDangerForeground1, and the gap between the caption text and the indicator can be tuned with tokens.spacingHorizontalXXS or tokens.spacingHorizontalSNudge. Add tokens.spacingVerticalXS or tokens.spacingVerticalS margins when stacking a label above an input, or let Field handle that spacing. Because size tokens scale with the theme, avoid absolute pixel values so the Label reacts to density and typography overrides.

## Performance

Label is one of the cheapest components to render: it produces a single root element plus an optional required indicator, holds no internal state, and registers no global listeners or observers. The main cost in large forms comes from sheer count, so prefer rendering labels only for fields that are visible, and avoid building label content inline in a way that creates new object or element identities on every parent render, since that defeats memoization of neighboring rows. Passing a custom element through the required prop is fine, but a memoized element avoids re-creating the subtree on unrelated parent updates. When many fields share identical captions and layouts, extracting a small wrapper row component reduces duplicated work and keeps state local to each field. Virtualizing long forms or tables of fields, rather than optimizing the Label itself, is the effective lever for very large lists.

## Theming & Tokens

Label consumes Fluent design tokens for typography and color rather than hard-coded values, so it reshapes automatically when the theme or density changes. Foreground color resolves to tokens.colorNeutralForeground1 by default, with tokens.colorNeutralForeground2 for secondary captions and tokens.colorNeutralForegroundDisabled for the disabled state. Sizes resolve to the typography ramp: tokens.fontSizeBase200 and tokens.lineHeightBase200 for small, tokens.fontSizeBase300 and tokens.lineHeightBase300 for medium, and tokens.fontSizeBase400 and tokens.lineHeightBase400 for large. Weight resolves to tokens.fontWeightRegular and tokens.fontWeightSemibold. The required indicator should be colored with a danger or palette token such as tokens.colorPaletteRedForeground1 or tokens.colorStatusDangerForeground1 so it adapts to high-contrast and dark themes. Surrounding spacing, when you lay out the label yourself, should use spacing tokens such as tokens.spacingVerticalXS and tokens.spacingHorizontalXXS. Overriding these tokens through FluentProvider theme changes every Label in the tree at once, which is preferable to per-instance class overrides.

## Migration Notes

Moving from earlier Fluent versions, Label is now a standalone component in @fluentui/react-components rather than a styling helper attached to a higher-order field wrapper. The legacy styles and theme props are gone; customization now happens through Griffel classes created with makeStyles and applied via className, using the same design tokens the rest of v9 uses. The required prop keeps its boolean form for the default asterisk but now also accepts custom content, so a custom marker no longer requires a separate wrapper element. The new size prop (small, medium, large) and weight prop (regular, semibold) replace ad-hoc typography overrides. If you previously hand-built label markup, prefer Field, which composes Label with the control, hint text, and validation message and manages the label-to-control association for you; only fall back to a bare Label when you need full control over layout.

## Edge Cases

- Passing a falsy value to required hides the indicator entirely, so a field that is actually mandatory can end up with no visual cue; confirm the value is truthy whenever the control is required.
- The required prop accepts arbitrary content, including an empty or symbol-only string, which may render nothing visible or be announced as an unintelligible character; prefer content that reads well when spoken.
- The disabled state intentionally does not meet the required contrast ratio, so relying on it for large portions of a form creates a genuine WCAG problem rather than a stylistic one.
- Label does not manage the association with the control on its own; if the association is missing, clicking the caption does nothing and screen readers may announce the control without a name.
- Placing interactive content inside the label text causes that content's activation to also trigger the associated control, which surprises users and can submit or toggle the wrong thing.
- When a Label is rendered inside Field, the Field supplies size, required, and disabled; setting those props again on the nested Label can produce conflicting styles and duplicated required indicators.
- A semibold Label at the large size is visually close to a heading, which can make a form look like a document outline; use that combination only where the label genuinely introduces a section.
- Multiple Labels associated with the same control produce an ambiguous accessible name, and a Label with no control at all is effectively decorative text despite its form semantics.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
