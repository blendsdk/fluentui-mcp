# MessageBarActions

> **Package**: `@fluentui/react-message-bar` v9.7.1
> **Import**: `import { MessageBarActions } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

MessageBarActions is the action container slot of the Fluent UI React v9 MessageBar composition. It is a thin, layout-only wrapper that groups the interactive controls shown at the trailing edge of a message bar, typically a primary response button plus the dismiss affordance. The component renders a root element (a div slot) and an optional secondary containerAction slot that is generally reserved for the Dismiss button of the MessageBar. Because it is purely structural, MessageBarActions has no visual variant props of its own: its colors and chrome come from the surrounding MessageBar, while its children supply the actual Button, Link, MenuButton or CompoundButton elements. It is intended to be placed inside a MessageBar (and, for animated stacks, inside a MessageBarGroup) as the last piece of the message bar composition, after MessageBarBody and MessageBarTitle.

**When to use**: Use MessageBarActions whenever a MessageBar needs one or more interactive controls, such as a Dismiss button, a 'Retry' button, an 'Undo' link, or a 'View details' menu. Use it instead of dropping buttons directly into a MessageBar, because it applies the correct grouping, spacing and alignment for the action area and gives the dismiss control a dedicated containerAction slot that keeps it visually and semantically separate from the other actions. Do not use MessageBarActions as a general-purpose button toolbar outside of a message bar; use Toolbar, ToolbarGroup and ToolbarButton for standalone action rows, or DialogActions for dialog footers. If the content is purely descriptive and needs no interaction, use MessageBarBody instead.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `animate` | `'exit-only' \| 'both'` | — | No | — |
| `children` | `React_2.ReactElement[] \| React_2.ReactElement` | — | Yes | — |
| `containerAction` | `Slot<'div'>` | — | No | — |
| `inline` | `boolean` | — | No | — |
| `intent` | `MessageBarIntent` | — | No | — |
| `politeness` | `'assertive' \| 'polite'` | — | No | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'span'>` | — | Yes | — |
| `shape` | `'square' \| 'rounded'` | — | No | — |

### Prop Guidance

- **root**: Required root slot for the actions container; renders a div. Use it to pass className, style, id or data attributes for layout overrides such as gap, alignment or wrapping. Avoid applying background or foreground colors here, because the parent MessageBar's intent already controls the surface. `className={mergeClasses(styles.actions, 'my-tight-actions')}`
- **containerAction**: Optional secondary div slot that is generally reserved for the Dismiss button of the MessageBar. Put exactly one control here (normally an icon-only Button with a Dismiss icon and an aria-label) so it stays visually separated from the primary response actions. `<Button appearance="transparent" icon={<DismissRegular />} aria-label="Dismiss" />`
- **inline**: Boolean that switches the action area to an inline arrangement rather than the default block/stacked alignment. Use it when the message bar is configured in a single-line layout where the actions should sit on the same line as the message text; leave it unset for multi-line layouts. `inline`
- **children**: Required; the React element or array of elements rendered inside the root slot. Supply one to three action controls, ordered by importance, with the most important action first. Text content, titles and descriptions do not belong here — place them in MessageBarBody and MessageBarTitle. `[<Button key="retry" appearance="primary">Retry</Button>, <Button key="details">View details</Button>]`
- **intent, politeness, shape, animate**: These settings belong to the surrounding MessageBar and MessageBarGroup composition, not to the actions container. Configure the look, announcement politeness and animation of the whole message bar on the parent component so the action area stays consistent with the message it belongs to. `<MessageBar intent="warning"> ... <MessageBarActions> ... </MessageBarActions> </MessageBar>`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `containerAction` | — | No | Generally the 'Dismiss' button for the MessageBar |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Keep the action set small and focused: one primary response action (for example Retry or Review) plus one dismiss control passed through the containerAction slot.
- Use standard Button, CompoundButton, MenuButton or Link components as children so focus, keyboard activation and disabled semantics come from a well-tested primitive.
- Give an icon-only dismiss button an accessible name, for example aria-label set to a localized 'Dismiss' string, because its icon is decorative and contributes no text.
- Place MessageBarActions inside MessageBar after MessageBarBody/MessageBarTitle so reading order matches visual order (message first, actions last).
- Prefer transparent or subtle Button appearances for secondary actions and reserve appearance="primary" for the single most important response action.
- Let the parent MessageBar's layout prop drive whether the bar is single-line or multi-line, and verify the action row still reads well at narrow widths.
- Localize every action label and the containerAction button's aria-label, since message bars frequently surface status and error text that must be translated.

### Don'ts

- Do not put more than a couple of actions in a MessageBar; long action rows crowd the message and push the dismiss control out of view.
- Do not place plain text, paragraphs of explanation, or a MessageBarTitle inside MessageBarActions — that content belongs in MessageBarBody.
- Do not render MessageBarActions outside of a MessageBar, or wrap it in extra chrome such as Card; the styling assumes it lives inside the message bar surface.
- Do not hard-code colors or background fills on the root slot; the bar's intent (informational, warning, error, success) already supplies the surrounding surface and foreground colors.
- Do not rely on visual position alone to communicate the dismiss action; icon-only buttons without an accessible name are invisible to screen reader users.
- Do not disable an action as a way to hide it; omit the action from the composition instead so keyboard users are not forced through an inert control.
- Do not nest MessageBarActions inside another MessageBarActions or inside MessageBarBody; there is exactly one action region per message bar.

## Anti-Patterns

### Action sprawl

❌ Dropping four or five buttons into MessageBarActions turns a short status message into a dense toolbar, wraps unpredictably at narrow widths, and can push the dismiss control off screen.

✅ Limit the action area to the single most valuable response plus the dismiss control in containerAction. Move additional choices into a MenuButton placed inside the root slot, or route users to a surface with more room, such as a Dialog.

### Unlabeled dismiss icon

❌ An icon-only dismiss button with no accessible name is announced as an unlabeled button, leaving screen reader users unable to tell what it does and unable to recover the dismissed message.

✅ Always set an aria-label on the containerAction button, for example the localized word for Dismiss, and use a recognizable icon such as DismissRegular.

### Rendering message content inside the action slot

❌ Placing explanatory text, a MessageBarTitle or a long description in MessageBarActions puts narrative content inside a control region, which distorts the layout and produces a confusing reading order for assistive technology.

✅ Keep the message copy in MessageBarBody and MessageBarTitle, and leave MessageBarActions exclusively for focusable controls.

### Overriding intent colors on the actions

❌ Applying a custom background or foreground to the root or to individual buttons fights the intent-driven palette of the parent MessageBar and frequently fails contrast requirements for error and warning states.

✅ Inherit the surrounding colors, use Button appearance values and the neutral tokens (for example tokens.colorTransparentBackground) for de-emphasis, and only change spacing or alignment on the actions root.

### Duplicated message bars for each action state

❌ Rendering a fresh MessageBar per action, instead of updating the existing one, causes the whole announcement to be re-read and the bar to flicker.

✅ Keep one persistent MessageBar with a stable composition and change only the content of MessageBarBody and the available controls in MessageBarActions.

## Accessibility

**Requirements**: MessageBarActions itself is not focusable and exposes no ARIA state; accessibility is inherited from the surrounding MessageBar, which renders the message as a group and owns the live-region politeness (polite or assertive) that causes the announcement. Your obligation is on the slotted controls: every action must be reachable and operable by keyboard, every icon-only action must have a programmatic accessible name, and the dismiss control must be announced before it is used, not after. Ensure the action area meets WCAG contrast requirements — the intent-based foreground tokens of the parent MessageBar are designed for that, so avoid overriding them. Any animated exit of a message bar must respect prefers-reduced-motion.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus forward through the actions in DOM order; MessageBarActions adds no tab stops of its own, only the controls you place inside it are focusable. |
| `Shift+Tab` | Moves focus backward out of the action area and back into the message body or previous focusable element. |
| `Enter` | Activates the focused Button, CompoundButton, MenuButton or Link inside the actions slot. |
| `Space` | Activates the focused Button, CompoundButton or MenuButton inside the actions slot. |
| `Down Arrow` | Opens a MenuButton placed in the actions slot when it is focused (behavior provided by the child control, not by MessageBarActions). |
| `Escape` | MessageBarActions has no built-in Escape handling; if you want Escape to dismiss the message, wire that handler yourself on the message bar. |

**ARIA**: role="group" (rendered by the parent MessageBar, not by MessageBarActions itself), aria-labelledby (on the parent MessageBar, associating the message bar with its MessageBarTitle), aria-label (required on icon-only action buttons such as Dismiss), aria-live / politeness (owned by the parent MessageBar; maps to the politeness prop values polite and assertive), aria-disabled (when an action inside the slot is intentionally disabled)

**Screen Reader**: Screen readers treat the entire message bar as a single group. When the bar is mounted or updated, the whole string of message text is announced according to the parent MessageBar's politeness setting; the action controls inside MessageBarActions are then reachable as ordinary buttons in DOM order, so a user hears the message text first and the response actions afterward. Icon-only actions contribute only their accessible name, which is why an aria-label like 'Dismiss' is mandatory. Because there is no roving tabindex or composite widget role, users tab through each action individually rather than arrowing between them.

## Styling

MessageBarActions is a layout wrapper, so most customization is spacing and alignment on the root slot. The component's own styles use flex layout and Griffel spacing tokens; override gaps with tokens.spacingHorizontalS or tokens.spacingHorizontalMNudge, and outer padding with tokens.spacingVerticalS and tokens.spacingHorizontalM. Use tokens.colorTransparentBackground when you need to explicitly cancel a background inherited from a wrapper. Foreground colors travel with the parent MessageBar's intent, which resolves to tokens.colorStatusDangerForeground1, tokens.colorStatusWarningForeground1, tokens.colorStatusSuccessForeground1, tokens.colorNeutralForeground1 and tokens.colorBrandForeground1 depending on intent; do not repaint the action buttons against those, or contrast will break. For emphasis use Button appearance values (primary, outline, subtle, transparent) rather than raw colors, and reserve tokens.fontWeightSemibold for the single emphasized action label. When a custom action needs a fixed footprint, prefer minWidth with tokens.spacingHorizontalXXXL-ish values over hard-coded pixel widths so text scaling and localization still fit.

## Performance

MessageBarActions is a stateless styling wrapper: it renders one div (plus the optional containerAction div) and performs no state updates, effects or measurements, so it adds negligible render cost. The practical performance concerns come from the children — each Button brings its own hooks-style state and Griffel classes, so keep the action count small. Avoid recreating inline style objects or freshly built class strings on every render of the parent; use makeStyles and mergeClasses from Griffel so class names stay stable and slots are not invalidated. Because the whole message bar may be inside a MessageBarGroup that animates entries and exits, keep the subtree cheap by avoiding heavy custom content in the action slot.

## Theming & Tokens

MessageBarActions defines no color of its own; it inherits the palette of the parent MessageBar's intent through the FluentProvider theme. Negative intents resolve to tokens.colorStatusDangerBackground1 and tokens.colorStatusDangerForeground1, warning to tokens.colorStatusWarningBackground1 and tokens.colorStatusWarningForeground1, success to tokens.colorStatusSuccessBackground1 and tokens.colorStatusSuccessForeground1, and informational to tokens.colorBrandBackground2 with tokens.colorBrandForeground1 for emphasis. Spacing and typography inside the action area come from tokens.spacingHorizontalS, tokens.spacingHorizontalM, tokens.spacingVerticalS, tokens.fontFamilyBase and tokens.fontSizeBase300. Switching the FluentProvider between webLightTheme, webDarkTheme or a brand theme updates these tokens automatically, so avoid literal colors; if you must de-emphasize a button, use the semantic appearance values, which themselves map to tokens.colorNeutralBackground1Hover, tokens.colorNeutralForeground1 and related token ramps.

## Migration Notes

In Fluent UI v8 the equivalent affordances were expressed through the MessageBar actions slot together with the dedicated MessageBarButton component. In v9 that pattern is replaced by composition: wrap your controls in MessageBarActions, put the dismiss control in the containerAction slot, and use the standard Button, CompoundButton, MenuButton or Link components instead of MessageBarButton. MessageBarActions has no appearance or intent prop of its own — the visual intent is declared once on the parent MessageBar and flows down to the action area, so v8 code that set per-button intent styling should be simplified to a single intent on the message bar plus standard Button appearances on the actions.

## Edge Cases

- Only one control should go in the containerAction slot; placing two buttons there breaks the intended primary/secondary split and the trailing alignment.
- In narrow viewports the action row can wrap or overflow and push the dismiss button out of the visible area — test with the MessageBar layout settings and long localized labels.
- MessageBarActions renders no ARIA attributes of its own, so it provides no accessible name for the action group; the group semantics and the live-region announcement come entirely from the parent MessageBar.
- Mixing an inline configuration with a multi-line layout produces an awkward row; match the inline setting to the message bar layout that hosts it.
- Because the dismiss affordance is a plain button, Escape does not dismiss the message by default — you must implement that behavior if it is expected.
- Buttons inside the action slot follow normal disabled semantics; a disabled action still receives focus in some browsers' tab order and is skipped in others, so prefer removing unavailable actions.
- If the message bar is placed in a right-to-left context the action area mirrors with the bar, so avoid directional margin or padding overrides that assume left-to-right layout.

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
