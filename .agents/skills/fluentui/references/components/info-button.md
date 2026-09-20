# InfoButton

> **Package**: `@fluentui/react-infolabel` v9.4.21
> **Import**: `import { InfoButton } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

InfoButton is a compact, icon-only button that opens a Popover containing short, supplemental information about a nearby label, term, or setting. It composes a Button root carrying an information icon with a Popover that wraps both the button and the info content, so a single InfoButton replaces hand-wiring a Popover, a trigger, and a surface. The info slot holds the content rendered in the popover surface, the root slot exposes the underlying button, and the popover slot accepts Popover props (a partial PopoverProps object, element, or portal, with openOnHover intentionally omitted) so positioning, arrow, appearance, trap-focus, and open state can be tuned. Three sizes are supported (small, medium, and large) and the popover renders inline in the document flow by default because inline defaults to true, with the option to portal it when it must escape a clipping ancestor. InfoButton is the primitive that InfoLabel is built on and is the recommended FluentUI React v9 way to attach non-critical context to a form field, table header, or settings row without spending permanent layout space.

**When to use**: Reach for InfoButton when a short piece of context helps users understand a label, term, or option but is not required to complete the task - for example, explaining what a billing cycle means, what a permission grants, or how a metric is calculated. Place it directly next to the control or label it explains so the explanation is discoverable exactly where the question arises. Prefer InfoLabel when the explanation belongs to a form field label and you want the label plus the info affordance composed for you, and prefer a plain visible Label with hint text (for example through Field) when the information is essential, applies to every user, or is needed to avoid an error. Prefer Tooltip when the text is a purely descriptive phrase for an icon that already has a visible meaning, and prefer a Link to a help article when the content is long-form. Do not use InfoButton as the only visible name of an action or field.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `inline` | `boolean \| undefined` | `true` | No | Whether the InfoButton should be rendered inline or on a Portal. |
| `popover` | `NonNullable<(ReactPortal \| ReactElement<unknown, string \| JSXElementConstructor<any>> \| Partial<Omit<PopoverProps, "openOnHover">>) \| null> \| undefined` | — | No | The Popover element that wraps the info and root slots. Use this slot to pass props to the Popover. |
| `size` | `"small" \| "medium" \| "large" \| undefined` | `medium` | No | Size of the InfoButton. |

### Prop Guidance

- **size**: Controls the size of the button and its information icon and defaults to medium. Use small to align with small inputs, dense table headers, or compact toolbar rows, keep medium for body-sized forms, and reserve large for surfaces with large text. Keep it consistent with the neighboring control so the icon baseline matches the label it explains. `small`
- **inline**: Defaults to true, which renders the popover in place in the document flow next to the button. Set it to false when the InfoButton sits inside a clipping or transform-affected ancestor such as a DialogSurface, DrawerBody, overflow-scrolled panel, or table cell, so the popover is rendered in a Portal and is not cut off. `false`
- **popover**: Accepts Popover props (a partial PopoverProps object, an element, or a portal) applied to the popover that wraps the button and the info content. Use it for positioning, an arrow, surface appearance, trap-focus behavior, or controlled open state; note that openOnHover is deliberately excluded from the accepted props, so hover-to-open is not configurable here. `withArrow: true, positioning: { position: 'above' }`
- **root**: The underlying button slot. Use it to pass button attributes the icon-only affordance needs, such as aria-label for an accessible name, the button type to avoid unintended form submission, or a className for styling the trigger. `aria-label: More information about the retention policy`
- **info**: The content rendered inside the popover surface when the button is activated. Keep it to a short paragraph or a single Text element, optionally with a Link for the deeper article, and style it through the slot when you need a specific typography or foreground token. `A Text element explaining the setting in one or two sentences`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `info` | — | Yes | The information to be displayed in the PopoverSurface when the button is pressed. |
| `popover` | — | Yes | The Popover element that wraps the info and root slots. Use this slot to pass props to the Popover. |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Keep the info slot to one or two short sentences; put anything longer behind a Link inside the popover.
- Give the icon-only button an accessible name when the surrounding text alone does not identify it - set aria-label through the root slot, for example aria-label: More information about the retention policy.
- Place the InfoButton immediately after the label or term it explains so visual order and reading order both associate the two.
- Match the size prop to the neighboring control: small next to small inputs and dense table headers, the medium default for standard forms, and large only beside large text.
- Wrap popover copy in Text inside the info slot so it inherits neutral body typography and theme colors instead of arbitrary inherited styles.
- Set inline to false when the InfoButton lives inside a Dialog, Drawer, scroll container, or table cell that clips overflow, so the popover is rendered in a Portal above everything.
- Use InfoLabel or Field when the InfoButton is part of a field's label composition rather than hand-placing an InfoButton next to a Label.
- Keep each piece of information in a single place - if the same sentence already appears as visible hint text, do not repeat it in the popover.

### Don'ts

- Don't hide validation messages, required-field indicators, or task-blocking instructions in the popover; users who never open it will miss information they need.
- Don't nest an InfoButton inside another interactive element such as a MenuItem, Link, Button, or inside a Label that activates an input, because nested interactives break keyboard order and screen reader announcements.
- Don't use InfoButton as a substitute for a field's visible label; the button has no visible text of its own.
- Don't fill the info slot with long documentation, tables, images, or multi-step forms; a popover is a transient surface, not a page.
- Don't design an interaction that depends on the popover appearing on hover - the popover slot omits openOnHover, so the surface opens on click, tap, Enter, or Space.
- Don't place several InfoButtons in the same sentence or table row for the same concept; one affordance per idea keeps the tab order short.
- Don't rely on the icon's color to convey meaning - the icon is decorative and the popover text carries the information.

## Anti-Patterns

### Long-form content in the info slot

❌ A popover is transient - it cannot be scanned, printed, or searched, and content inside it is invisible to anyone who does not activate the button, so long explanations effectively do not exist for many users.

✅ Move essential or lengthy material into visible page text, a Field hint, or a linked help article, and keep only a one- or two-sentence summary in the info slot.

### InfoButton used as a field label

❌ The button is icon-only with no visible text, so a field whose only name lives behind a click fails users with cognitive or motor constraints and breaks the visual label-to-control association.

✅ Render a visible Label (or Field's label) and use InfoButton, or better InfoLabel, solely for the supplemental explanation of that label.

### Nesting an InfoButton inside another interactive control

❌ An InfoButton inside a MenuItem, Link, Button, or a Label that activates an input creates nested focusable targets; keyboard activation and screen reader output become ambiguous and clicks may be forwarded to the outer control.

✅ Place the InfoButton as a sibling of the control it explains, or rely on InfoLabel's built-in placement, rather than nesting it inside the interactive element.

### Leaving the popover inline inside a clipping container

❌ With the default inline behavior the popover is a DOM sibling, so inside DialogSurface, DrawerBody, or an overflow-hidden table cell it can be clipped, scroll away with the container, or be hidden behind other content.

✅ Set inline to false so the popover renders in a Portal above the surrounding layout, or move the trigger outside the clipping region.

### Assuming a hover reveal

❌ The popover slot omits openOnHover, so the surface opens only on click, tap, or keyboard activation; a design that depends on the text appearing on hover leaves touch and keyboard users without the content.

✅ Treat the affordance as an explicit click or tap disclosure. If brief hover discovery is genuinely required, pair a Tooltip with a short phrase and keep InfoButton for the fuller explanation.

### Duplicating the same copy in hint text and the popover

❌ Repeating a sentence in both places wastes space and creates two sources of truth that drift apart when one is edited, and screen reader users hear the same text twice.

✅ Keep the visible hint for essential guidance and use the popover for the optional detail, never the same wording in both.

## Accessibility

**Requirements**: The root is an icon-only button, so it must expose a programmatic accessible name that survives when images and styling are disabled (WCAG 4.1.2 Name, Role, Value); pass aria-label through the root slot whenever the adjacent visible text is not sufficient. The trigger must be reachable and operable by keyboard (2.1.1 Keyboard) with a visible focus indicator (2.4.7 Focus Visible), and the compact small size must still meet the 24 by 24 CSS pixel minimum target or be spaced so that adjacent targets do not overlap (2.5.8 Target Size). Because popover content is hidden until activation, it cannot be the only place where essential information lives (1.3.1 Info and Relationships). Text inside the popover must reach 4.5 to 1 contrast for body copy (1.4.3 Contrast Minimum) using theme foreground tokens rather than hard-coded colors. InfoButton opens on activation rather than hover by default, which avoids the dismissable, hoverable, and persistent requirements of 1.4.13 Content on Hover or Focus; if you deliberately wrap it in hover behavior, those three conditions apply.

| Key | Action |
| --- | --- |
| `Enter` | Activates the focused info button and opens the popover. |
| `Space` | Activates the focused info button and opens the popover. |
| `Escape` | Closes the open popover and returns focus to the info button. |
| `Tab` | Moves focus to the next focusable element; when the popover is open and focus is scoped to it, moves into the popover content. |
| `Shift+Tab` | Moves focus backwards, either out of the popover content or off the info button depending on where focus currently sits. |
| `Arrow keys, Home, End` | InfoButton implements no custom key handling; these keys behave according to whatever native element you place inside the info slot, such as a Link. |

**ARIA**: aria-label - provides the accessible name for the icon-only root button when surrounding text is not sufficient, aria-expanded - communicates whether the popover is currently open, aria-haspopup - advertises that activating the button reveals a popup surface, aria-hidden - marks the decorative information icon inside the button as presentational, aria-describedby - optionally associates popover content with the input or field it explains so the explanation is read with that control

**Screen Reader**: Focus lands on a button whose accessible name comes from the aria-label passed through the root slot, announced together with the button role and expanded state; because the only visible content is a decorative icon, that name is the entire announcement. Activating the button announces the expanded state and inserts the popover content into the reading order directly after the trigger, so a user who tabs forward will encounter the explanation next. Escape collapses the popover and returns focus to the button. Users who never activate the button never hear the content, which is precisely why anything essential belongs in visible text rather than in the info slot.

## Styling

InfoButton renders a Button root, so a className you pass lands on the button element and the icon inherits Button appearance tokens; use makeStyles with mergeClasses, or style through the slots, to override them. Helpful tokens include tokens.colorNeutralForeground2 for the resting icon color, tokens.colorNeutralForeground1 and tokens.colorNeutralBackground1Hover for hover, tokens.colorNeutralBackground1Pressed for press, tokens.colorNeutralStroke1 and tokens.colorNeutralStrokeAccessible when you need a visible boundary at compact sizes, tokens.spacingHorizontalXXS or tokens.spacingHorizontalXS for the gap between the label text and the icon, and tokens.colorBrandForeground1 with tokens.colorBrandForeground1Hover for links placed inside the popover. For the surface content, apply a className to the info slot and use typography tokens such as tokens.fontSizeBase200 with tokens.lineHeightBase200 for compact secondary copy, or tokens.fontSizeBase300 with tokens.lineHeightBase300 for standard body copy. The surface itself responds to tokens.colorNeutralBackground1, tokens.colorNeutralStroke2, tokens.shadow16, and tokens.borderRadiusMedium, and Popover props supplied through the popover slot (options such as withArrow, appearance, and positioning) reshape the surface without any custom CSS.

## Performance

Every InfoButton adds a button plus its popover wrapper to the DOM, so a data table or settings list with one InfoButton per row multiplies that cost; when the same explanation is repeated, prefer one affordance per section and reuse a single info element. Keep the info slot lightweight, and avoid recreating the info element on every parent render - an inline element literal inside a hot list causes needless work, so hoist or memoize it. Popover positioning is measured when the popover opens, and setting inline to false adds a Portal to the tree; that is worth it inside clipping containers but unnecessary in simple, non-clipping layouts, and dozens of simultaneous portals on one screen can affect paint performance in long lists.

## Theming & Tokens

InfoButton declares no bespoke colors of its own: the icon inherits Button's neutral appearance tokens and the surface inherits Popover's surface tokens, all resolved from the nearest FluentProvider theme such as webLightTheme, webDarkTheme, teamsHighContrastTheme, or a custom brand ramp. Expect the icon at rest to use tokens.colorNeutralForeground2 with neutral interaction tokens on hover and press, and the surface to use tokens.colorNeutralBackground1 with tokens.colorNeutralStroke1 borders and tokens.shadow16 elevation, so switching to a dark theme flips both without extra CSS. Text you place in the info slot follows the tokens you apply - tokens.colorNeutralForeground1 for primary copy and tokens.colorNeutralForeground3 for secondary notes keep contrast correct across themes, while links should use tokens.colorBrandForeground1. In high-contrast themes neutral foreground tokens resolve to system colors, so avoid hard-coded hex values.

## Migration Notes

InfoButton collapses the older pattern of pairing an icon-only button with a Callout or Tooltip, or hand-wiring Popover, PopoverTrigger, and PopoverSurface, into one component. Instead of portaling manually and managing a mount node, pass inline: false to render the popover in a Portal; instead of passing Popover props to a separate Popover element, pass them through the popover slot; content that used to be a child node goes into the info slot, and props meant for the trigger itself, including aria-label and the button type, go through the root slot. If you previously built a label plus info affordance by hand, switch to InfoLabel, which composes InfoButton for you, and use Field when you also need hint and validation text.

## Edge Cases

- inline defaults to true, so the popover is a DOM sibling and can be clipped by overflow-hidden ancestors such as DialogSurface, DrawerBody, or table cells; switch to inline: false in those contexts.
- The popover slot's accepted props omit openOnHover, so hover-to-open cannot be configured through InfoButton - it is an explicit click, tap, or keyboard disclosure.
- Because the root is a button element, an InfoButton placed inside a form may act as the submit target unless you control the button type through the root slot.
- An icon-only button with no aria-label can end up with an empty or unhelpful accessible name, leaving screen reader users without any description of what the button reveals.
- Inside a Dialog or Drawer with its own focus trap, an open popover can compete for focus; verify that Escape closes the popover first and returns focus to the info button rather than dismissing the parent overlay.
- The small size produces a compact hit area, so surround it with adequate spacing to keep the target size usable on touch devices.
- If the explanation must be announced together with an input, the popover content alone is not read with that field; associate it explicitly with aria-describedby or repeat the essential part as visible hint text.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
