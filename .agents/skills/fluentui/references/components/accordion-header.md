# AccordionHeader

> **Package**: `@fluentui/react-accordion` v9.12.0
> **Import**: `import { AccordionHeader } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

AccordionHeader is the clickable, label-bearing part of a Fluent UI React v9 accordion. It renders a container (the root slot, a div by default that can instead be rendered as a heading element such as h1–h6) that wraps a native button (the button slot) showing the header's children text plus an optional icon and an expand/collapse indicator supplied through the icon and expandIcon slots. Because the header lives inside an AccordionItem, the button automatically carries the expanded/collapsed state and the relationship to the matching AccordionPanel, so consumers rarely need to wire behavior themselves. Visual density and typography are controlled by the size prop, the reading direction of the expand indicator by expandIconPosition, and the overall layout flow by inline. It is the presentation half of the accordion contract: Accordion orchestrates grouping, AccordionItem owns the expanded state, AccordionHeader provides the toggle affordance, and AccordionPanel holds the revealed content.

**When to use**: Use AccordionHeader whenever you build an accordion with AccordionItem and AccordionPanel, so that the toggle affordance is keyboard reachable, exposes expanded/collapsed state to assistive technology, and is visually consistent with the rest of the design system. Choose it over a Button plus a manually controlled panel when you need collapsible sections whose headers form a navigable structure, such as settings groups, FAQ lists, filter panels, or navigation sub-sections. Prefer a plain Button when the content being revealed has no relationship to the trigger (for example, opening a Dialog or Menu), because the accordion header advertises an expand/collapse relationship that would be misleading. Prefer a Tree or Nav when the whole interaction is hierarchical navigation rather than progressive disclosure of content. Avoid using AccordionHeader as a general section title that has no panel; use a Text element or a heading instead.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `expandIconPosition` | `AccordionHeaderExpandIconPosition \| undefined` | — | No | The position of the expand  icon slot in heading. |
| `inline` | `boolean \| undefined` | — | No | Indicates if the AccordionHeader should be rendered inline. |
| `size` | `AccordionHeaderSize \| undefined` | — | No | Size of spacing in the heading. |

### Prop Guidance

- **expandIconPosition**: Controls where the expand/collapse indicator is placed relative to the header label. Use the start value when the indicator should lead the label, and the end value for the conventional trailing chevron; keep the choice consistent across every header in the same Accordion so the disclosure pattern is predictable. This prop affects only the expandIcon slot and does not move the icon slot or the children. `end`
- **inline**: Renders the header inline so it can participate in a horizontal layout rather than occupying a full-width row. Set it when the accordion is meant to expand sideways — for example a vertical rail of labels in a narrow sidebar — and pair it with a panel laid out in the same direction so the revealed content appears beside the header. Leave it unset for the default stacked accordion, and avoid using it purely to work around wrapping problems. `true`
- **size**: Selects the spacing and typography scale of the header. Use large or extra-large for top-level page sections, medium as the default for most content, and small for denser nested accordions such as filters or secondary settings. Match every header inside one Accordion, and remember that size is a visual decision — the semantic outline should still come from the heading element used for the root slot. `medium`
- **root**: The wrapper element around the header button. It defaults to a div but is intended to be rendered as a heading element (h1–h6) so the accordion participates in the document outline. Choose the heading level from the surrounding page structure, not from the header's size, and apply layout or spacing styles to this slot rather than to the button. `h3`
- **button**: The interactive element that receives focus and toggles the panel. It is provided automatically and should normally be left alone; customize it only for visual overrides such as background, padding, or focus outline. Never replace it with a non-interactive element or add nested interactive children, because it carries aria-expanded and aria-controls for the header. `button`
- **expandIcon**: The icon that signals the expanded or collapsed state. It is rendered before or after the children based on expandIconPosition, rotates or changes as the item toggles, and is decorative — mark it hidden from assistive technology since aria-expanded already communicates the state. `ChevronDownRegular`
- **icon**: An optional icon rendered adjacent to the children content in the header, used for a leading, meaningful icon such as a settings gear or a folder that reinforces the section's subject. Keep these icons decorative or give them an accessible label only when they carry information that the header text does not already convey. `SettingsRegular`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `button` | — | Yes | The component to be used as button in heading |
| `expandIcon` | — | No | Expand icon slot rendered before (or after) children content in heading. |
| `icon` | — | No | Expand icon slot rendered before (or after) children content in heading. |
| `root` | — | Yes | The element wrapping the button. By default this is a div, but can be a heading. |

## Best Practices

### Do's

- Render the root slot as a heading element appropriate to the page outline so that screen reader users can jump between accordion sections using heading navigation.
- Keep header children short and descriptive — a few words that summarize the panel content — and move explanations, metadata, and secondary actions into the panel body.
- Use size consistently within a single Accordion so that sibling headers share the same density and typography scale; reserve larger sizes for top-level sections and smaller sizes for nested accordions.
- Set expandIconPosition to match the reading direction and the surrounding layout — for example, place the indicator at the end of the header for standard left-to-right content, and at the start when the header text is trailing a leading icon rail.
- Use the icon slot for a leading, decorative icon that reinforces the section's meaning, and let the expandIcon slot communicate the expanded/collapsed state so that the two roles stay visually distinct.
- Use inline together with a matching horizontal layout for the revealed panel when the accordion should expand sideways rather than downward, such as in a sidebar of vertical labels.
- Give every header unique, meaningful label text; duplicated labels in the same Accordion make it impossible for screen reader users to distinguish the sections when navigating by heading or by button list.

### Don'ts

- Do not place nested interactive elements (links, checkboxes, buttons, menus) inside the header children; the header's button provides the whole-area click target and nesting interactives breaks both keyboard operation and pointer semantics.
- Do not use AccordionHeader outside of an AccordionItem and expect it to toggle anything — the expanded state, aria-expanded, and aria-controls relationships come from the item context.
- Do not nest an AccordionHeader directly inside another AccordionHeader; nest a full Accordion inside the AccordionPanel of the parent item instead.
- Do not use the size prop to fake a heading hierarchy — pick the semantic heading level from document structure and use size only for visual density.
- Do not strip the header button's focus styling or outline without replacing it with an equally visible focus indicator; the header is reachable by Tab and must satisfy focus-visible requirements.
- Do not overload a single header with paragraphs of content or long descriptions that push the expand indicator off screen; truncate or move the detail into the panel.
- Do not treat expandIconPosition as a way to reposition arbitrary content; it only controls the expand indicator, not the icon slot or the children.

## Anti-Patterns

### Nesting interactive controls in the header

❌ Placing links, checkboxes, or additional buttons inside the header children puts multiple interactive elements inside the header's own button. This produces invalid, confusing semantics for assistive technology, makes click targets ambiguous, and traps keyboard users who cannot reach the nested control reliably.

✅ Keep the header children to plain text and a decorative icon, and move secondary controls into the AccordionPanel, into a footer area, or into a separate action row outside the header.

### Rolling your own toggle with a Button and a controlled panel

❌ Reimplementing the header with a plain Button plus a manually shown panel loses the automatic aria-expanded/aria-controls wiring, the shared state coordination provided by AccordionItem, and the group keyboard navigation between headers, so the result looks right but behaves incorrectly for keyboard and screen reader users.

✅ Use AccordionHeader inside AccordionItem with AccordionPanel and let the component supply the attributes, the context-driven expanded state, and the group navigation; customize only through the provided slots and props.

### Using the size prop as a heading hierarchy

❌ Choosing size to simulate visual heading levels leaves the actual document outline flat when the root is not rendered as a heading, so screen reader users navigating by headings cannot perceive the structure and cannot jump between sections.

✅ Render the root slot as the correct heading element for the page outline and treat size purely as a density and typography choice for the label.

### Headers whose label is truncated to nothing

❌ Very long descriptions in the header, combined with a fixed-height layout, can push the label or the expand indicator out of view, leaving users with an unlabeled or ambiguous toggle that gives no clue what the section contains.

✅ Keep header labels short and let them wrap or truncate with a stable reserved area for the expand indicator; move the full description into the panel where it has room.

### Inconsistent expand indicator placement

❌ Mixing start and end expandIconPosition values across sibling headers in the same Accordion makes the disclosure affordance unpredictable and can cause the indicator to visually detach from the label it belongs to.

✅ Pick one expandIconPosition value per Accordion and apply it uniformly; only vary it when the surrounding layout genuinely changes, such as a horizontal rail versus a stacked list.

## Accessibility

**Requirements**: The header must satisfy WCAG 2.1 AA: 1.3.1 Info and Relationships (headers must convey the accordion structure — render the root as a heading element so the section appears in the document outline), 2.1.1 Keyboard (the toggle must be operable from the keyboard alone), 2.4.3 Focus Order (tab order must follow the visual order of the headers), 2.4.7 Focus Visible (a clearly visible focus indicator on the header button), 4.1.2 Name, Role, Value (the exposed role is a button inside a heading, with a programmatic name from the header children and a programmatic expanded state), 1.4.3 Contrast (header text and the expand indicator must meet contrast minimums in every state), and 1.4.11 Non-text Contrast for the expand indicator and focus ring. Target size requirements are satisfied naturally because the header button spans the full width of the header.

| Key | Action |
| --- | --- |
| `Enter` | Activates the header button and toggles the associated AccordionPanel between expanded and collapsed. |
| `Space` | Activates the header button and toggles the associated AccordionPanel, identical to Enter. |
| `Tab` | Moves focus into the header button and on to the next focusable element; when focus leaves the accordion, the next header or the panel content is reached. |
| `Shift+Tab` | Moves focus backwards out of the header button to the previous focusable element. |
| `Arrow Down` | Moves focus forward to the next AccordionHeader within the same Accordion, allowing headers to be traversed without tabbing through panel content. |
| `Arrow Up` | Moves focus backwards to the previous AccordionHeader within the same Accordion. |
| `Home` | Moves focus to the first AccordionHeader in the Accordion. |
| `End` | Moves focus to the last AccordionHeader in the Accordion. |

**ARIA**: aria-expanded — set automatically on the header button to reflect whether the associated AccordionPanel is open., aria-controls — set automatically on the header button to reference the id of the Associated AccordionPanel, establishing the trigger/target relationship., aria-disabled — applied when the surrounding AccordionItem is disabled, so the header is announced as unavailable while remaining discoverable., aria-labelledby — used to associate the header button with its visible text when the label is composed of multiple elements or an external label element., aria-hidden — applied to the expand indicator icon so decorative chevrons are not announced and do not pollute the button's accessible name., id — required on the root or button when panels need to be referenced by the panel's aria-labelledby, which is how the panel gets its own accessible name.

**Screen Reader**: A screen reader announces the header as a heading at the level of the rendered heading element containing a button whose name is the header children text, followed by the state "expanded" or "collapsed" derived from aria-expanded. Users can navigate to headers with heading navigation or with the button list, and activating the header with Enter or Space announces the new state. The accordion panel is announced as a labelled region whose name comes from the header, so moving into the panel content continues the reading context. If the root slot is left as a plain div rather than a heading, the section is still operable but disappears from heading navigation, which degrades the experience for users who scan long pages by heading.

## Styling

Style the header through slots rather than hard-coded markup: target the root slot with makeStyles and mergeClasses to control stretch, padding, and outline behavior, and use child selectors to reach the internal button when you need to change hover or pressed surfaces. Standard theming hooks include tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed for pointer feedback, tokens.colorTransparentStroke for the resting border, tokens.colorNeutralStroke2 for the divider between headers, tokens.colorNeutralForeground1 and tokens.colorNeutralForeground1Hover for label color, tokens.colorNeutralForeground3 for a subdued toggle label, tokens.colorBrandForeground1 and tokens.colorBrandStroke1 when the header is used in a brand-accented section, and tokens.colorStrokeFocus2 for the focus outline. Typography and density scale with the size prop, which maps onto tokens.fontSizeBase200 through tokens.fontSizeBase500, tokens.lineHeightBase300 and above, and tokens.fontWeightRegular versus tokens.fontWeightSemibold; horizontal breathing room comes from tokens.spacingHorizontalM and tokens.spacingHorizontalS while vertical rhythm uses tokens.spacingVerticalS, tokens.spacingVerticalMNudge, and tokens.spacingVerticalM. Use tokens.borderRadiusMedium for rounded hover backgrounds, tokens.curveEasyEase with tokens.durationNormal for the expand indicator rotation, and tokens.colorNeutralForegroundDisabled for disabled labels. Text inside the header should be allowed to wrap or be truncated with tokens.spacingHorizontalS reserved so the expand indicator never collides with the label; in right-to-left layouts the start/end semantics of expandIconPosition flip automatically, so avoid absolute positioning for the indicator.

## Performance

AccordionHeader is a lightweight, stateless-presentational component — it renders a wrapper, a button, an optional icon, and an expand indicator, and it reads its expanded state from AccordionItem context rather than managing state itself. Rendering cost is therefore dominated by whatever you put in the header children, so avoid heavy elements (images, charts, large formatted text) in the header and let the AccordionPanel carry heavy content. Memoize icon elements and any composed slot content where possible, and define styles once at module scope with makeStyles rather than generating style objects or new class names on each render; pair with mergeClasses for conditional overrides. In long lists of headers, keep each header's render tree shallow and avoid binding new inline handlers to nested elements, because every header is a focusable control that participates in the group's keyboard navigation.

## Theming & Tokens

AccordionHeader consumes Fluent theme tokens through Griffel, so it adapts automatically to light, dark, high-contrast, and brand-variant themes. The resting label uses tokens.colorNeutralForeground1, secondary or summary text uses tokens.colorNeutralForeground2, and the disabled state uses tokens.colorNeutralForegroundDisabled. Hover and pressed feedback on the header surface come from tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed, and tokens.colorNeutralBackground1Selected, with tokens.colorTransparentStroke and tokens.colorNeutralStroke2 providing resting and dividing borders. Focus rings use tokens.colorStrokeFocus2 (with tokens.strokeWidthThick), brand-accented sections use tokens.colorBrandForeground1 and tokens.colorBrandStroke1, and the expand indicator transitions using tokens.durationNormal with tokens.curveEasyEase. Density and type scale come from the size prop mapping onto the token scale: tokens.fontSizeBase200/300/400/500, tokens.lineHeightBase300 and above, tokens.fontWeightRegular, tokens.fontWeightMedium, and tokens.fontWeightSemibold, with spacing from tokens.spacingHorizontalS/M and tokens.spacingVerticalXS/S/M and corner rounding from tokens.borderRadiusMedium. Because the component reads the theme from FluentProvider, customizing through these tokens keeps every state — hover, pressed, focus, disabled — consistent rather than overriding colors per state.

## Migration Notes

In previous Fluent UI major versions the header concept was expressed as sub-components composed through a title/header pair on the accordion itself, where the expand/collapse state and the toggling callbacks were passed to the header. In v9 the header is a separate, standalone component: AccordionHeader, AccordionItem, and AccordionPanel are composed explicitly, expanded state is owned by AccordionItem and shared through context, and independent toggling is requested declaratively on the item rather than by passing callbacks to the header. The header exposes named slots — root, button, expandIcon, and icon — so custom rendering is done by overriding slots instead of by swapping a render callback, and inline and size moved to dedicated props on the header. Consumers migrating should remove per-header expansion props and let the surrounding AccordionItem drive state, and should re-evaluate custom renderers in favor of slot overrides.

## Edge Cases

- An AccordionHeader used outside an AccordionItem still renders a focusable button but toggles nothing and exposes no aria-expanded/aria-controls relationship — always place it inside an AccordionItem.
- The root slot is a div by default; unless it is rendered as a heading element the accordion sections will not appear in the document outline even though the toggle works correctly.
- expandIconPosition only moves the expandIcon slot; the icon slot stays adjacent to the children, so headers that use both need enough horizontal space for two icons plus a wrapping label.
- inline changes the header's own layout flow but the revealed content still needs a horizontally oriented panel layout to look intentional; using inline without adjusting the panel produces an awkward stacked reveal.
- In right-to-left locales the meaning of start and end is mirrored automatically, so any custom positioning of the expand indicator through absolute offsets will be wrong in one direction.
- Disabled items render the header with aria-disabled rather than removing it from the DOM, so consumers should not rely on the header disappearing to convey unavailability and should ensure disabled styling remains legible.
- Very long header labels can collide with the expand indicator when the indicator's space is not reserved; use truncation or wrapping that accounts for the indicator width.
- Nesting an Accordion inside an AccordionPanel is supported and expected, but the nested headers should use a smaller size and a lower heading level to preserve the visual and semantic hierarchy.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
