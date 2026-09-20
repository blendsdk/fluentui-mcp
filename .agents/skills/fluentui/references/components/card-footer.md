# CardFooter

> **Package**: `@fluentui/react-card` v9.7.0
> **Import**: `import { CardFooter } from '@fluentui/react-components';`
> **Category**: layout
> **Stability**: stable

## Overview

CardFooter is the trailing region of a Card, rendered as a plain div-based container that sits at the bottom of the card surface and holds supportive content such as action buttons, metadata, links, or status information. It is designed to be composed with the other Card parts — the card surface itself, its header, and its preview area — so that a single card reads as a coherent unit with a consistent internal rhythm. CardFooter exposes a root slot for arbitrary child content and a dedicated action slot that is pushed to the far end of the footer, which makes it the natural home for the single primary affordance of a card alongside an overflow or secondary control. Because the footer is intentionally minimal (it renders no extra wrapper elements beyond its root and action containers), spacing and alignment are driven by the parent card's layout variables and by the Fluent Griffel styling system, letting you drop Buttons, Menu, Toolbar-like clusters, or plain Text into it. The component also surfaces the selection- and appearance-oriented props that its parent Card exposes, such as appearance, size, orientation, selected, defaultSelected, onSelectionChange, disabled, and focusMode, plus the shouldRestrictTriggerAction callback and the cardHeaderGapVar CSS-variable prop, so a footer can participate in the same interaction and theming model as the card that hosts it.

**When to use**: Use CardFooter whenever a Card needs a distinct bottom region for actions or supplementary information — for example a Reply and Share pair of buttons with an overflow menu, a primary call-to-action button, a link to more detail, or footer metadata such as a timestamp or owner. It is the correct counterpart to a card's header: put identifying content (avatar, title, description) in the header and interactive or trailing content in the footer so the two regions bookend the preview or body content. Prefer CardFooter over hand-rolled flex wrappers because it already applies the correct card spacing, aligns with the card's header gap, and exposes the action slot that keeps overflow controls visually separated from primary actions. Do not use CardFooter as a general-purpose layout bar outside of a Card, and do not use it as a toolbar for dense command sets — a Toolbar or a plain container is a better fit when there is no card context and when many controls must be grouped with roving focus behavior.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `action` | `Slot<'div'>` | — | No | — |
| `action` | `Slot<'div'>` | — | No | — |
| `appearance` | `'filled' \| 'filled-alternative' \| 'outline' \| 'subtle'` | — | No | — |
| `cardHeaderGapVar` | `string` | — | Yes | — |
| `defaultSelected` | `boolean` | — | No | — |
| `description` | `Slot<'div'>` | — | Yes | — |
| `disabled` | `boolean` | — | No | — |
| `focusMode` | `'off' \| 'no-tab' \| 'tab-exit' \| 'tab-only'` | — | No | — |
| `header` | `Slot<'div'>` | — | Yes | — |
| `image` | `Slot<'div', 'img'>` | — | Yes | — |
| `logo` | `Slot<'div', 'img'>` | — | No | — |
| `onSelectionChange` | `(event: CardOnSelectionChangeEvent, data: CardOnSelectData) => void` | — | No | — |
| `orientation` | `'horizontal' \| 'vertical'` | — | No | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `selected` | `boolean` | — | No | — |
| `shouldRestrictTriggerAction` | `(event: CardOnSelectionChangeEvent) => boolean` | — | No | — |
| `size` | `'small' \| 'medium' \| 'large'` | — | No | — |

### Prop Guidance

- **root**: The root slot is the footer's div container and the element that receives className styles; it is where you apply layout overrides such as gap, padding, wrapping, or a top border. `div`
- **action**: Renders a container at the far end of the footer and is intended for a single trailing control, most commonly an icon-only Button that opens a Menu of secondary card commands. Leave it unset when the footer has only inline actions as children. `<Button appearance="transparent" icon={<MoreHorizontal20Regular />} aria-label="More options" />`
- **appearance**: Controls the visual treatment of the surrounding card surface (filled, filled-alternative, outline, or subtle) and is resolved from the card context; footer content should be styled to read correctly against whichever surface the card renders. `filled-alternative`
- **size**: Sets the size of the card's content rhythm (small, medium, or large); footer buttons and text should visually match, so prefer controlling this at the card level rather than per footer. `small`
- **orientation**: Determines whether the card and its regions flow horizontally or vertically; a horizontal card typically wants a narrower footer with fewer actions. `horizontal`
- **selected**: Controlled selection state for the card that hosts the footer. Use it when selection is owned by your application state so the footer's controls can render conditionally for selected versus unselected cards. `true`
- **defaultSelected**: Uncontrolled initial selection state for the card; useful when the footer contains a control whose availability depends on the card's initial selected state. `true`
- **onSelectionChange**: Callback invoked when the card's selection changes; use it to update surrounding UI when a footer interaction selects or deselects the card. `(event, data) => setSelected(data.selected)`
- **shouldRestrictTriggerAction**: Predicate called with a CardOnSelectionChangeEvent that lets you declare which nested controls in the footer must not trigger card selection — for example, a button that opens a menu should not also select the card. `(event) => event.type === 'click'`
- **disabled**: Disables the card and its interactive behavior; footer controls should be visually and semantically disabled alongside it so users are not offered actions that cannot succeed. `true`
- **focusMode**: Controls how keyboard focus enters and leaves the card and its footer regions (off, no-tab, tab-exit, tab-only). Cards with actionable footer buttons generally need a mode that keeps those controls in the tab order. `tab-exit`
- **cardHeaderGapVar**: A CSS custom property name supplied as a string that the footer uses to align its own spacing with the header's gap. Set it when you customize header spacing so the footer's rhythm stays in sync. `--fui-CardHeader--gap`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `action` | — | No | Container that renders on the far end of the footer, used for action buttons. |
| `root` | — | Yes | Root element of the component. |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, Button } from '@fluentui/react-components';
import { ArrowReply16Regular, MoreHorizontal20Regular, Share16Regular } from '@fluentui/react-icons';
import { CardFooter } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  const styles = useStyles();

  return (
    <CardFooter
      className={styles.footer}
      action={<Button appearance="transparent" icon={<MoreHorizontal20Regular />} aria-label="More options" />}
    >
      <Button icon={<ArrowReply16Regular />}>Reply</Button>
      <Button icon={<Share16Regular />}>Share</Button>
    </CardFooter>
  );
};
```

## Best Practices

### Do's

- Keep the footer focused: place your primary actions as children and reserve the action slot for a single trailing control such as an overflow Menu or an icon-only Button.
- Give every icon-only button in the footer an accessible name, for example an aria-label of "More options" on the overflow button, because the footer frequently contains icon-only controls.
- Order content so the most important action comes first in DOM order; children render before the action slot, and screen reader users encounter them in that order.
- Reuse the same Button appearances inside the footer as elsewhere in the card so that primary, secondary, and transparent treatments stay visually consistent.
- Let the card drive sizing and appearance rather than fighting it — set size or appearance once at the card level so header, preview, and footer stay proportional.
- Style the footer through makeStyles with Griffel tokens (for example tokens.spacingHorizontalM and tokens.spacingVerticalS) so spacing survives theme and density changes.
- Use onSelectionChange in conjunction with selected or defaultSelected when the footer's actions should not fire when the card itself is being selected, and use shouldRestrictTriggerAction to declare which nested controls must not trigger card selection.

### Don'ts

- Don't stack many equally weighted buttons in the footer; consolidate secondary and tertiary commands into a Menu inside the action slot instead of creating a row of competing actions.
- Don't pass header- or preview-specific slots such as image, header, description, or logo to the footer; those belong to the card's header and preview parts.
- Don't render CardFooter outside of a Card and expect card-level props such as appearance, selected, or size to have an effect; those values come from the surrounding card context.
- Don't make the footer root itself clickable when the enclosing Card already handles selection; nested interactive regions create ambiguous hit targets and duplicate focus stops.
- Don't hard-code pixel gaps in the footer; use the card's gap variable and Griffel tokens so the footer aligns with the header's spacing.
- Don't put long paragraphs, forms, or scrollable content in the footer — keep it to short action labels, links, and compact metadata.
- Don't rely on color alone to convey a disabled or destructive footer action; pair state styling with disabled semantics and clear labels.

## Anti-Patterns

### Icon-only action without an accessible name

❌ The action slot is most often filled with an icon-only Button such as an overflow trigger. Without an aria-label, screen reader users hear an unlabeled button and cannot tell what it does.

✅ Always pass aria-label on icon-only footer buttons (for example "More options"), and let decorative icons remain hidden from assistive technology while the label carries the meaning.

### Using the footer as a general-purpose action bar

❌ Rendering CardFooter outside a Card, or cramming five or six equal-weight buttons into it, turns a card region into a toolbar. The footer loses the card's spacing context and users cannot tell which action is primary.

✅ Keep one primary action among the children and move everything else into a Menu placed in the action slot, or use a Toolbar outside the card when the actions are not card-specific.

### Duplicating interactivity between card and footer

❌ When the Card is selectable, a clickable footer root or a button that also selects the card produces nested interactive regions, double focus stops, and unpredictable selection behavior.

✅ Let the Card own selection and use shouldRestrictTriggerAction to exempt footer controls that should not trigger it, keeping the footer's buttons as the only interactive elements inside it.

### Hard-coded spacing that drifts from the header

❌ Setting fixed pixel padding and gap on the footer means the footer no longer lines up with the header when the card's size, density, or theme changes.

✅ Use Griffel tokens such as tokens.spacingHorizontalM and tokens.spacingVerticalS for footer spacing, and use cardHeaderGapVar so the footer references the same gap custom property as the header.

### Passing header or preview slots to the footer

❌ Slots such as image, header, description, and logo render card-leading content; supplying them on a footer produces content in the wrong region and breaks the card's visual hierarchy.

✅ Render identifying content through the card's header and preview parts, and reserve CardFooter for trailing actions, links, and compact metadata.

## Accessibility

**Requirements**: CardFooter renders a plain div with no implicit landmark or role, so it makes no accessibility claims of its own — the accessibility of the footer is entirely determined by what you put inside it. Every interactive control in the footer must be reachable by keyboard, must have a discernible accessible name (text content or aria-label), and must meet the WCAG 2.1 target-size and focus-visible requirements; the Fluent Button and Menu components handle focus indicators for you. Maintain a logical DOM order so that assistive technology reads primary actions before the trailing overflow action, and keep contrast between footer text and the card surface at or above 4.5:1 for body text. When the surrounding Card is selectable, the card's focus mode controls whether footer controls are tabbable; choose a focus mode that keeps the footer's own buttons reachable and that does not trap focus inside the card.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the next focusable control inside the footer, such as the first Button in the children and then the control in the action slot. |
| `Shift+Tab` | Moves focus to the previous focusable control, moving back through the action slot and footer children in reverse DOM order. |
| `Enter` | Activates the focused button or link in the footer. |
| `Space` | Activates the focused button in the footer (buttons, not links). |
| `ArrowDown / ArrowUp` | Moves through items when a Menu or MenuItem set is opened from a button placed in the action slot. |
| `Escape` | Closes a Menu, Popover, or other overlay opened from a footer control and returns focus to its trigger. |

**ARIA**: aria-label (required on icon-only footer buttons such as an overflow menu trigger), aria-labelledby (when a footer control must reference text rendered elsewhere in the card), aria-disabled (for footer actions that are visually and functionally disabled without being removed from the tab order), aria-hidden (on purely decorative icons rendered alongside footer text), aria-haspopup and aria-expanded (on a footer button that opens a Menu or Popover), aria-live (on status or count text placed in the footer that updates dynamically)

**Screen Reader**: Because the footer root is a generic div, screen readers do not announce it as a landmark or group; they simply continue reading the card's content in DOM order and then encounter the footer's children as ordinary buttons, links, and text. An icon-only button in the action slot is announced only by its accessible name, so the aria-label supplied (for example "More options") is what a user hears. When a Menu is opened from a footer button, focus moves into the menu and the trigger reports its expanded state through aria-expanded and aria-haspopup. Text placed directly in the footer is read inline with no extra context, so include enough wording in labels and link text to stand alone.

## Styling

CardFooter is a flex container, so the most common customization is adjusting gap and alignment. Apply spacing through makeStyles using tokens such as tokens.spacingHorizontalS and tokens.spacingVerticalS, and use tokens.spacingHorizontalM or tokens.spacingHorizontalL when the footer should breathe more than the header. The action slot is pushed to the far end of the row, so if you want a middle region or a wrapped layout, target the root with className and override flex-wrap and justify-content. Text and secondary metadata should use tokens.colorNeutralForeground2 or tokens.colorNeutralForeground3, while primary labels use tokens.colorNeutralForeground1. If you need a separating rule above the footer content, prefer a Divider component or a border using tokens.colorNeutralStroke2 with tokens.borderRadiusMedium-compatible geometry rather than a hard-coded color. Because footer buttons inherit the card's visual context, express state changes with semantic tokens such as tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed instead of raw hex values, and size internal controls from the card's size using tokens.fontSizeBase300, tokens.lineHeightBase300, and the corresponding fontSizeBase200/fontSizeBase400 variants for compact and large cards. The cardHeaderGapVar prop lets the footer reference the same CSS custom property that the header uses for its gap, which is the cleanest way to keep vertical rhythm aligned when you customize header spacing.

## Performance

CardFooter itself is extremely cheap: it renders only a root div and, when used, an action container, with no state, effects, or context of its own, so it adds no measurable render cost. The real cost lives in what you place inside it — Buttons, Menus, and Popovers — so prefer passing a single pre-built element or a render function to the action slot rather than recreating large element trees on every render of the card. Because the card's selection props include callbacks such as onSelectionChange and shouldRestrictTriggerAction, keep those handlers stable (for example with useCallback) so re-renders of the card do not cascade into every footer control. Compose styles once at module scope with makeStyles rather than building style objects inline, since atomic Griffel classes are reused across instances. Finally, avoid placing dozens of children in the footer; each one is a separate focus stop and a separate component instance, and long action lists belong behind a Menu in the action slot.

## Theming & Tokens

CardFooter consumes theme values through the components you place inside it and through the CSS custom properties set by its parent Card. Footer spacing and text styling should be expressed with Fluent Griffel tokens rather than literal values: tokens.spacingHorizontalXS, tokens.spacingHorizontalS, tokens.spacingHorizontalM, tokens.spacingVerticalXS, and tokens.spacingVerticalS for rhythm; tokens.colorNeutralForeground1 for primary labels and tokens.colorNeutralForeground2 or tokens.colorNeutralForeground3 for secondary metadata; tokens.colorNeutralStroke2 when a subtle top border is needed; and tokens.fontSizeBase200, tokens.fontSizeBase300, and tokens.lineHeightBase300 for type that tracks the card's size. State and surface colors such as tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed change with the FluentProvider theme (web light, web dark, teams light, teams dark, high contrast), which is why footer buttons inherit correct hover and focus visuals automatically. The cardHeaderGapVar prop is the theming hook for vertical rhythm: point it at the same custom property the header uses so that both regions recalculate together when theme, density, or size changes.

## Migration Notes

In earlier Fluent card implementations the footer was consumed as a static subcomponent of the card (for example Card.Footer) and was customized through a styles or tokens object passed as props. In v9 CardFooter is a standalone named export from @fluentui/react-components that you import directly and style with Griffel's makeStyles and the v9 tokens.* object; the legacy per-slot style objects and theme-prop overrides are replaced by className merging and slot props. The v9 footer also introduces the explicit action slot for trailing controls and participates in the v9 Card selection model through selected, defaultSelected, onSelectionChange, and shouldRestrictTriggerAction, none of which existed in the earlier footer API. If you are migrating, move any footer-level padding from the old styles object into a makeStyles class applied via className, and move overflow or secondary controls that used to be plain children into the action slot.

## Edge Cases

- The action slot always renders at the far end of the footer; if you omit it entirely, the footer collapses to just its children and any customized padding or gap still applies to the root.
- There is exactly one action slot per footer, so a second trailing control must either live in the children list or be nested inside a Menu rendered in the action slot.
- The component's type surface is flattened across the Card family, so props such as image, header, description, and logo appear alongside footer props even though they belong to the card's header and preview parts — passing them to a footer has no meaningful effect.
- Card-level props such as appearance, size, orientation, selected, and disabled are meaningful only when the footer is rendered inside a Card; outside that context they fall back to defaults and the footer behaves as a plain flex container.
- With focusMode set to no-tab or tab-only, interactive controls inside the footer may be unreachable by keyboard; verify tab reachability whenever you change the card's focus mode.
- Long action labels or many children wrap or overflow on narrow cards; test the footer at the smallest supported card width before shipping.

## See Also

- [layout category](../categories/layout.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
