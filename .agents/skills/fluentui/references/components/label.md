# Label

> **Package**: `@fluentui/react-label` v9.4.2
> **Import**: `import { Label } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Label is the typographic caption primitive for form controls in Fluent UI React v9. It renders a native label element through its root slot and an optional required indicator through a separate required slot, giving a control a visible, programmatically associated name. Beyond labeling, Label carries four presentation and state props: size (small, medium, large), weight (regular or semibold), disabled, and required. The required prop is flexible — a truthy boolean renders the default asterisk, while any non-empty string or JSX node replaces the asterisk with a custom indicator, which is useful for locales or design systems that prefer different requiredness symbols. Because Label is intentionally small and stateless, it is the building block that higher-level compositions such as Field use for their label slot, and it pairs naturally with Input, Textarea, Select, Combobox, Checkbox, Radio, Switch, Slider, Spinbutton, and every other control that needs a visible caption.

**When to use**: Use Label whenever a form control needs a visible, accessible name: text inputs, textareas, selects, comboboxes, checkboxes, radios, switches, sliders, and spinbuttons. Reach for Label when you are building a custom field layout or when you need a caption in a place where Field does not fit — for example, a visible group caption above a set of individually labeled checkboxes. Prefer Field when the caption must be accompanied by hint text, validation messages, or consistent vertical rhythm, because Field composes a Label for its label slot and wires up the required and validation plumbing for you. Choose Text instead of Label for any content that is not naming a control, such as headings, helper paragraphs, or body copy, since Text carries typography without label semantics. Use Label rather than a bare span or paragraph so that the correct element is rendered and the correct default styling tokens apply.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean \| undefined` | `false` | No | Renders the label as disabled |
| `required` | `any` | `false` | No | Displays an indicator that the label is for a required field. The required prop can be set to true to display an asterisk (*). Or it can be set to a string or jsx content to display a different indicator. |
| `size` | `"small" \| "medium" \| "large" \| undefined` | `'medium'` | No | A label supports different sizes. |
| `weight` | `"regular" \| "semibold" \| undefined` | `regular` | No | A label supports regular and semibold fontweight. |

### Prop Guidance

- **disabled**: Renders the label in the disabled foreground color. Apply it only alongside a genuinely disabled control, and make the reason for the disabled state available elsewhere in the UI, because the resulting contrast ratio does not meet accessibility requirements and the state is purely visual. `true, paired with a disabled control`
- **required**: Displays the requiredness indicator after the label text. A truthy boolean renders the default asterisk; any non-empty string or JSX node replaces it with a custom indicator for locales or brand conventions that use a different symbol. Leave it false or undefined when the field is optional, and always mirror the state on the control itself. `true for the default asterisk, or a custom string such as *** for a custom indicator`
- **size**: Controls the caption's type scale. Choose small, medium, or large to match the size of the control being labeled so the label and field share a visual rhythm; medium is the default and suits standard forms. `medium`
- **weight**: Selects regular or semibold font weight. Use semibold to make a caption stand out in dense layouts or when the label also acts as a small section heading; keep regular for standard field captions so emphasis stays meaningful. `semibold`

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

- Always associate the Label with its control, either by wrapping the control or by pointing the label at the control's id, so clicking the caption moves focus to the field.
- Use the required prop to render the requiredness indicator instead of typing an asterisk into the label text, so the indicator stays consistent in position, color, and spacing.
- Match the Label size to the size of the control it captions (for example, a small Label above a small Input) so baselines and line heights align.
- Keep label text short and scannable — a word or a short phrase in sentence case reads best above or beside a control.
- Use weight semibold when the label needs to stand out from surrounding content, such as in dense forms, settings panels, or when the label doubles as a small section title.
- Set required on the underlying control as well as on the Label, so assistive technology announces the true required state rather than relying on the visual indicator.
- Prefer Field when you need a label plus hint, error, or validation messaging, and let Field render the Label for you.
- Use disabled on the Label only together with a disabled control, and make the reason for disabledness discoverable elsewhere in the interface.

### Don'ts

- Do not use Label as a general-purpose text element for headings, descriptions, or body copy — use Text for that.
- Do not rely on the asterisk indicator alone to communicate requiredness; a visual glyph is not a substitute for the required attribute on the control.
- Do not overload the Label with long help text, character counts, or error messages — those belong in Field hint and validation content.
- Do not use the disabled Label state to grey out content that is not a disabled form control.
- Do not mix Label sizes and weights arbitrarily within the same form section; inconsistent captions make the layout feel broken and hurt scannability.
- Do not place buttons, links, or other interactive elements inside a Label besides the single control you are labeling, because clicks on the caption are redirected to the control.
- Do not render a Label with no associated control — it is not focusable and clicking it does nothing, so it becomes decorative text with misleading semantics.
- Do not nest one Label inside another or point two Labels at the same control, since the control's accessible name can become duplicated or ambiguous.

## Anti-Patterns

### Using Label as body or heading text

❌ Label renders label semantics and is not focusable on its own, so using it for headings or paragraphs produces misleading markup and skips the typographic scales that Text provides.

✅ Use Text for headings, descriptions, and body copy, and reserve Label for content that names a form control.

### Requiredness expressed only by the visual indicator

❌ Setting the required prop renders an indicator but does not mark the associated control as required, so screen reader users and autofill or validation logic never learn that the field is mandatory.

✅ Keep the indicator for sighted users and also set required or aria-required on the actual control so requiredness is announced.

### Disabling the caption to disable the field

❌ The disabled Label state only changes text color. It cannot prevent interaction, and by the component's own guidance that color does not meet required contrast, so the interface becomes both inaccessible and functionally misleading.

✅ Disable the control itself, keep the label legible, and surface the reason for the disabled state next to the field.

### Stuffing help text and errors into the label

❌ Long captions are announced in full by screen readers, wrap awkwardly with the required indicator, and duplicate messaging that belongs in dedicated hint or error regions.

✅ Keep the label short and move explanations, constraints, and error text into Field's hint and validation message slots.

### Label without an associated control

❌ A Label that neither wraps a control nor points at one is not clickable through to anything and exposes label semantics for text that names nothing, which confuses both pointer and assistive technology users.

✅ Always wrap the control or reference its id, or switch to Text if the content is purely descriptive.

## Accessibility

**Requirements**: The Label must be programmatically associated with exactly one form control, either implicitly by wrapping the control or explicitly through the htmlFor attribute referencing the control's id. Requiredness must be conveyed programmatically on the control (native required or aria-required), not only through the visual indicator rendered by the required prop. Text must keep sufficient contrast in every theme; the disabled state intentionally falls below the required contrast ratio, so it should be used sparingly and never as the only signal that a field is unavailable. When a field is invalid, pair the control with aria-invalid and point aria-describedby at the message that explains the problem.

| Key | Action |
| --- | --- |
| `Tab` | Label itself is not focusable and is skipped in the tab order; Tab moves focus straight to the control the Label names. |
| `Shift+Tab` | Moves focus to the previous focusable element; the Label never receives focus in either direction. |
| `Space` | When the labeled control is a checkbox, radio, switch, or other Space-activated widget, pressing Space toggles it; the Label does not intercept the key. |
| `Enter` | With focus on a labeled text field, Enter submits the surrounding form (native behavior) or commits the value; the Label does not handle the key. |

**ARIA**: aria-required (on the associated control), aria-invalid (on the control when validation fails), aria-labelledby (pointing at the Label's id when associating programmatically), aria-describedby (on the control, referencing hint or error text), aria-disabled (on the control, since the disabled Label style alone is not announced)

**Screen Reader**: The Label element is not entered by screen reader navigation as an interactive stop; instead its text becomes the accessible name of the associated control and is announced when focus lands on that control. Because the default required indicator is a visible text character rendered inside the label element, some screen readers include it in the announced name; the authoritative required announcement comes from the control's own required or aria-required state. The disabled styling applied by the disabled prop is purely visual and is not conveyed to assistive technology, so disabledness must live on the control. Long label text is announced in full, which is another reason to keep captions concise.

## Styling

Label is styled with Griffel, so the supported customization path is a className from makeStyles or mergeClasses applied to the root, plus theme tokens for color and typography. The default foreground is tokens.colorNeutralForeground1; the disabled state uses tokens.colorNeutralForegroundDisabled; the required indicator is drawn in a red family color such as tokens.colorPaletteRedForeground1, which you can override with your own descendant rule if your brand needs a different indicator color. Size maps to typography tokens — tokens.fontSizeBase200 with tokens.lineHeightBase200 for small, tokens.fontSizeBase300 with tokens.lineHeightBase300 for medium, and tokens.fontSizeBase400 with tokens.lineHeightBase400 for large — while weight semibold maps to tokens.fontWeightSemibold and regular maps to tokens.fontWeightRegular. Use tokens.spacingVerticalXS or tokens.spacingVerticalS to create breathing room between the caption and the control below it rather than hard-coded pixel values, and use tokens.fontFamilyBase so labels inherit custom brand fonts. Keep the required indicator gap consistent by relying on the component's own spacing rather than adding margins around the glyph.

## Performance

Label is a stateless presentational component: it holds no internal state, registers no event handlers of its own, and contributes no layout measurement work, so it renders cheaply even in long forms with dozens of captions. Griffel generates atomic CSS once per unique style combination and shares it across every instance, which means repeated Labels with the same size, weight, and state add essentially no styling cost. The only realistic cost is authoring new style objects inside render; define makeStyles outside the component and combine classes with mergeClasses so style recalculation does not happen on every render. Memoization is generally unnecessary, but if a parent re-renders very frequently with new JSX passed to the required prop, consider hoisting that indicator node so the element identity stays stable.

## Theming & Tokens

Label consumes theme tokens through Griffel, so it reacts automatically to Provider themes and to nested theme overrides without any prop changes. Foreground color comes from tokens.colorNeutralForeground1 in the default state and tokens.colorNeutralForegroundDisabled in the disabled state, while the required indicator uses a red-family token such as tokens.colorPaletteRedForeground1. Typography is token-driven as well: tokens.fontFamilyBase for the family, tokens.fontSizeBase200, tokens.fontSizeBase300, and tokens.fontSizeBase400 with the matching lineHeight tokens for the three sizes, and tokens.fontWeightRegular or tokens.fontWeightSemibold for weight. Because these resolve to CSS variables emitted by the theme, switching between light and dark themes created with createLightTheme and createDarkTheme updates label colors instantly, and brand-level token overrides propagate to every Label on the page.

## Migration Notes

In v9, Label is a standalone, composable component rather than a text prop on each input. Where v8 used a string label prop or a separate Label component with its own props, v9 expects you to render a Label next to the control (or let Field do it) and to express requiredness with the required prop, which accepts a boolean or custom indicator content. The v9 Label also exposes first-class size and weight props for typographic control, and disabled is a purely visual state that should mirror the disabled state of the control it captions. Styling moves from SCSS class overrides to Griffel classes and theme tokens, so custom label styles should be authored with makeStyles and tokens rather than component-scoped class names.

## Edge Cases

- The required prop is evaluated for truthiness: false, undefined, and an empty string all hide the indicator, while any non-empty string — including a whitespace-only string — is rendered as the indicator in place of the default asterisk.
- The required indicator is rendered by a separate slot after the label text, so it participates in line wrapping and can break onto its own line when the label text is long and the container is narrow.
- A Label with no association to a control is not focusable and clicking it performs no action, so an orphaned caption can silently break the expected click-to-focus behavior.
- Combining implicit association (wrapping the control) with explicit association (pointing at a different control's id) produces ambiguous accessible names in some browser and screen reader combinations — choose one association method per label.
- Inside a Field, the Field supplies and configures its own Label, deriving required and disabled from the Field props; adding another Label with its own required value can result in duplicated caption text or two required indicators.
- Because the default indicator is a real text character inside the label element, some screen readers include the asterisk in the control's announced name, so the control's own required attribute remains the reliable source of requiredness semantics.
- The disabled state's contrast is below the required threshold by design, so captions rendered with disabled should be limited to contexts where the control is clearly non-interactive and the reason is communicated elsewhere.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
