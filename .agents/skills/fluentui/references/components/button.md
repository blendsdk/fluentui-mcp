# Button

> **Package**: `@fluentui/react-button` v9.9.2
> **Import**: `import { Button } from '@fluentui/react-components';`
> **Category**: buttons
> **Stability**: stable

## Overview

Button is the primary action control in Fluent UI React v9 and the component most user flows are built around. It renders its root slot as a native button element (or an anchor when the root is rendered as a link), and exposes a deliberately small API: a text label supplied as children, an optional icon slot that renders before or after the label according to iconPosition, five visual appearances (secondary, primary, outline, subtle, transparent), three shapes (rounded, circular, square), three sizes (small, medium, large), and two disabled modes (disabled and disabledFocusable). Because it is a leaf component with no internal state, Button is highly composable: it is used standalone for form submission and confirmation, wrapped in Tooltip when only an icon is shown, and embedded inside Dialog footers, Toolbar groups, Menu items, Card actions, MessageBar actions, and TagPicker and Combobox adornments. The appearance prop carries the visual hierarchy so that a screen contains a single clear primary action while all supporting actions stay visually quiet.

**When to use**: Use Button whenever the user triggers an immediate, discrete action: submitting or resetting a form, confirming or cancelling inside a Dialog, opening a menu, toggling a setting, or invoking a command in a Toolbar. Choose the appearance that matches the action's weight rather than restyling the button: primary for the one dominant action in a view, secondary (the default) for ordinary actions, outline for actions on busy or colored surfaces, subtle for actions inside dense containers such as cards, list rows, and toolbars, and transparent for borderless icon buttons in chrome like headers and navigation bars. Prefer other components when the interaction is not an action: use Link for navigation that must behave like a hyperlink, use Menu or Toolbar when several commands belong to a single grouped control, and use Checkbox, Switch, or Radio for state selection rather than a toggle-looking Button. For icon-only buttons, pair Button with Tooltip and set the tooltip relationship to label so the icon gains an accessible name.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"secondary" \| "primary" \| "outline" \| "subtle" \| "transparent" \| undefined` | `'secondary'` | No | A button can have its content and borders styled for greater emphasis or to be subtle. - 'secondary' (default): Gives emphasis to the button in such a way that it indicates a secondary action. - 'primary': Emphasizes the button as a primary action. - 'outline': Removes background styling. - 'subtle': Minimizes emphasis to blend into the background until hovered or focused. - 'transparent': Removes background and border styling. |
| `disabled` | `boolean \| undefined` | `false` | No | A button can show that it cannot be interacted with. |
| `disabledFocusable` | `boolean \| undefined` | `false` | No | When set, allows the button to be focusable even when it has been disabled. This is used in scenarios where it is important to keep a consistent tab order for screen reader and keyboard users. The primary example of this pattern is when the disabled button is in a menu or a commandbar and is seldom used for standalone buttons. |
| `iconPosition` | `"before" \| "after" \| undefined` | `'before'` | No | A button can format its icon to appear before or after its content. |
| `shape` | `"rounded" \| "circular" \| "square" \| undefined` | `'rounded'` | No | A button can be rounded, circular, or square. |
| `size` | `ButtonSize \| undefined` | `'medium'` | No | A button supports different sizes. |

### Prop Guidance

- **appearance**: Controls visual emphasis and is the correct way to express hierarchy; use primary for the single dominant action, leave the default secondary for ordinary actions, choose outline for filled or image-backed surfaces, subtle for actions inside dense containers, and transparent for borderless icon buttons in chrome. Never reproduce these looks with custom colors. `primary`
- **size**: Sets the overall scale of padding, typography, and icon sizing; default is medium, use small in compact toolbars, table rows, and inline forms, and large in hero sections, empty states, and single-action screens. Consistent sizes within a row keep controls aligned. `small`
- **shape**: Chooses the corner treatment; the default rounded keeps buttons consistent with other controls, circular is intended for floating or icon-only actions where a perfect circle reads as a distinct affordance, and square is reserved for tightly gridded layouts where rounded corners would break alignment. `circular`
- **iconPosition**: Determines whether the icon slot renders before or after the text; keep the default before for icons that identify the action and switch to after for trailing indicators such as chevrons and arrows. `after`
- **icon**: Supplies an element for the icon slot; pass a single rendered icon rather than a name or configuration object, and omit it entirely when the label alone communicates the action. A small Spinner can be placed here to communicate a loading state. `a calendar icon element`
- **disabled**: Marks the action as unavailable and removes it from the tab order; use it for standalone buttons whose unavailability is obvious from context, and never as a substitute for hiding an action or explaining why it cannot be used. `true`
- **disabledFocusable**: Keeps the button in the tab order while marking it unavailable through aria-disabled; intended primarily for buttons in menus and command bars where preserving a stable tab order matters, and rarely for standalone buttons. `true`
- **children**: The visible text label that also serves as the accessible name; keep it short, action-oriented, and self-explanatory, and omit it only when an icon plus an explicit accessible label is present. `Save`
- **root**: The required root slot renders as a native button element by default and needs no configuration; when the button performs navigation, render the root as an anchor so open-in-new-tab, middle click, and link semantics work, remembering that anchors do not support the native disabled attribute. `anchor root for navigation actions`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `icon` | — | No | Icon that renders either before or after the `children` as specified by the `iconPosition` prop. |
| `root` | — | Yes | Root of the component that renders as either a `<button>` tag or an `<a>` tag. |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Button } from '@fluentui/react-components';
import type { ButtonProps } from '@fluentui/react-components';

export const Default = (props: ButtonProps): JSXElement => <Button {...props}>Example</Button>;
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, Button } from '@fluentui/react-components';
import { bundleIcon, CalendarMonthFilled, CalendarMonthRegular } from '@fluentui/react-icons';

export const Appearance = (): JSXElement => {
  const styles = useStyles();

  return (
    <div className={styles.wrapper}>
      <Button icon={<CalendarMonthRegular />}>Default</Button>
      <Button appearance="primary" icon={<CalendarMonthRegular />}>
        Primary
      </Button>
      <Button appearance="outline" icon={<CalendarMonth />}>
        Outline
      </Button>
      <Button appearance="subtle" icon={<CalendarMonth />}>
        Subtle
      </Button>
      <Button appearance="transparent" icon={<CalendarMonth />}>
        Transparent
      </Button>
    </div>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story:
        '- `(undefined)`: the button appears with the default style\n' +
        '- `primary`: emphasizes the button as a primary action.\n' +
        '- `outline`: removes background styling.\n' +
        '- `subtle`: minimizes emphasis to blend into the background until hovered or focused\n' +
        '- `transparent`: removes background and border styling.\n',
    },
  },
};
```

### Disabled

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, Button } from '@fluentui/react-components';

export const Disabled = (): JSXElement => {
  const styles = useStyles();

  return (
    <div className={styles.outerWrapper}>
      <div className={styles.innerWrapper}>
        <Button>Enabled state</Button>
        <Button disabled>Disabled state</Button>
        <Button disabledFocusable>Disabled focusable state</Button>
      </div>
      <div className={styles.innerWrapper}>
        <Button appearance="primary">Enabled state</Button>
        <Button appearance="primary" disabled>
          Disabled state
        </Button>
        <Button appearance="primary" disabledFocusable>
          Disabled focusable state
        </Button>
      </div>
    </div>
  );
};

Disabled.parameters = {
  docs: {
    description: {
      story: `A button can be \`disabled\` or \`disabledFocusable\`.
              \`disabledFocusable\` is used in scenarios where it is important to keep a consistent tab order
              for screen reader and keyboard users. The primary example of this pattern is when
              the disabled button is in a menu or a commandbar and is seldom used for standalone buttons.`,
    },
  },
};
```

## Best Practices

### Do's

- Pick exactly one primary button per screen region or dialog footer so the visual hierarchy communicates the recommended next step.
- Leave buttons at the default secondary appearance unless the action genuinely needs more or less emphasis; the default already provides correct contrast on neutral backgrounds.
- Use the subtle or transparent appearance for buttons embedded in Toolbar, Card, Menu, and list-row contexts where a bordered box would add visual noise.
- Match size to the density of the surrounding surface: small for compact toolbars and table rows, medium (the default) for forms and dialogs, large for hero areas and empty states.
- Give every button an accessible name; when the label is an icon only, wrap the Button in Tooltip with relationship set to label or provide an aria-label so assistive technology announces the purpose.
- Use disabledFocusable instead of disabled for buttons inside menus and command bars so the tab order stays predictable while the action remains unavailable.
- Place the icon with iconPosition set to after when it is a directional or trailing affordance such as a chevron or arrow, and leave it before when it merely labels the action.
- Simulate a loading state by putting a small Spinner in the icon slot and setting disabledFocusable while the request is in flight, so repeated clicks are prevented without the button leaving the tab order.

### Don'ts

- Don't place more than one primary button in the same view or dialog footer; competing primary actions slow decision making and dilute emphasis.
- Don't use disabled as a permanent replacement for hiding an action or for explaining why it is unavailable; users cannot focus or discover the reason, so hide it or show inline validation instead.
- Don't use disabledFocusable on ordinary standalone buttons; it exists specifically to preserve tab order in menus and command bars where focused-but-inactive items are expected.
- Don't nest interactive content such as links, checkboxes, or other buttons inside the button's children, because interactive elements cannot legally nest inside a native button element.
- Don't re-implement an appearance with custom class names or inline color overrides; use the appearance prop so hover, pressed, focus, and disabled states stay consistent and theme-aware.
- Don't remove or hide the focus outline; keyboard users depend on the visible focus ring to locate themselves on the page.
- Don't ship an icon-only button that relies on the icon alone for meaning, and don't rely on a tooltip that is not wired as the accessible label.
- Don't force a fixed height or font size to make a button fit a layout; choose the size prop instead so paddings, icon sizing, and line heights remain proportionally correct.

## Anti-Patterns

### Multiple primary buttons in one view

❌ Assigning appearance primary to several buttons in the same section or dialog footer destroys the visual hierarchy the appearance system exists to create, leaving users unsure which action is recommended.

✅ Choose one primary action per region and demote the rest to the default secondary appearance, reserving outline, subtle, or transparent for lower-emphasis or nested contexts.

### Unlabeled icon-only buttons

❌ A button whose only child is an icon and whose tooltip is not wired as the accessible label has no accessible name, so screen reader users hear only button with no indication of what it does.

✅ Wrap the icon-only button in Tooltip with relationship set to label, or supply an aria-label that names the action, and keep the tooltip text identical to the accessible name so the experience matches for all users.

### Disabled as a substitute for validation or hiding

❌ Leaving an action permanently disabled gives no explanation and, because disabled buttons are removed from the tab order, keyboard and screen reader users cannot even focus it to discover that it exists.

✅ Hide actions that are not applicable, validate form input inline so the action can be attempted, and reserve the disabled state for genuinely and temporarily unavailable actions; use disabledFocusable when the item must remain in the tab order inside a menu or command bar.

### Overriding appearance with bespoke colors

❌ Recreating primary, subtle, or transparent styling with custom background and border colors bypasses the theme, breaking hover, pressed, focus, high-contrast, and dark-theme behavior all at once.

✅ Select the closest appearance value, then extend it with makeStyles and design tokens such as tokens.colorBrandBackground or tokens.colorSubtleBackgroundHover so the button still responds correctly to theme changes.

### Buttons used for navigation

❌ Triggering navigation from a button root loses native link behavior such as open in new tab, copy link address, and correct announcement as a link, and weakens page semantics for crawlers and assistive technology.

✅ Render the root as an anchor for navigational actions, or use the Link component, and reserve Button for actions that change application state.

### Removing the focus indicator

❌ Suppressing the focus ring to achieve a flatter look makes keyboard navigation unusable and fails WCAG 2.4.7.

✅ Keep the built-in focus styling, which is built from the theme focus stroke tokens, and if it must be adjusted, restyle it with tokens.colorStrokeFocus2 and tokens.strokeWidthThick instead of removing it.

## Accessibility

**Requirements**: Button must satisfy WCAG 2.1 level AA: text and meaningful icons need at least 4.5:1 contrast against their background (the primary appearance pairs a brand background with the on-brand foreground token to guarantee this in both light and dark themes), focus must be visibly indicated (WCAG 2.4.7) using the theme focus stroke tokens, and color alone must not convey state (WCAG 1.4.1) so disabled and loading states must also change the text or icon, not only the fill. Every button needs an accessible name for WCAG 4.1.2, either from its text children or from an aria-label or a tooltip configured as the label. Touch targets should meet the 24 by 24 CSS pixel minimum of WCAG 2.5.8, which the small size still satisfies. Because a disabled native button is not focusable, any information conveyed only by a disabled state must also be available elsewhere in the interface.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the next focusable element; an enabled button (and a button using disabledFocusable) participates in the tab order. |
| `Shift+Tab` | Moves focus to the previous focusable element. |
| `Enter` | Activates the focused button and fires its click handler; on a root rendered as an anchor this follows the link. |
| `Space` | Activates the focused button on key release, matching native button behavior. |
| `Escape` | Has no built-in behavior on Button itself; when the button lives inside a Dialog, Popover, Menu, or Tooltip, Escape is handled by that parent component to dismiss it. |

**ARIA**: aria-label, aria-labelledby, aria-disabled, aria-busy, aria-describedby, aria-haspopup, role

**Screen Reader**: The root slot renders a native button element, so screen readers announce the button role, the accessible name taken from the text children (or from an aria-label when the button is icon only), and the disabled state. A button using the disabled prop is announced as dimmed or unavailable and is skipped during tab navigation, whereas disabledFocusable keeps the element focusable and exposes the unavailable state through aria-disabled so screen reader users can still discover it in a menu or command bar. Icons placed in the icon slot are decorative and should not add to the accessible name, so an icon-only button must receive its name from a tooltip configured as a label or from an explicit aria-label. When the root is rendered as an anchor, assistive technology announces a link rather than a button, which is the correct semantics for navigation. Setting aria-busy while a request is in flight tells assistive technology that the button's content is being updated.

## Styling

Style Button with makeStyles from @fluentui/react-components and compose class names with mergeClasses, always preferring design tokens over hard-coded values. Because Button renders a root and an icon slot, the most common customization is sizing and spacing around those slots: adjust padding with tokens.spacingHorizontalM and tokens.spacingHorizontalSNudge, vertical rhythm with tokens.spacingVerticalXS, icon-to-label gap with tokens.spacingHorizontalS, and typography with tokens.fontSizeBase300, tokens.lineHeightBase300, and tokens.fontWeightSemibold for emphasized labels. To avoid fighting the appearance system, change emphasis through appearance first and only then layer overrides such as tokens.colorNeutralBackground1Hover or tokens.colorNeutralStroke1 for secondary buttons, tokens.colorBrandBackground, tokens.colorBrandBackgroundHover, and tokens.colorBrandBackgroundPressed for primary buttons, and tokens.colorSubtleBackgroundHover and tokens.colorSubtleBackgroundPressed for subtle and transparent buttons. Radius comes from shape and can be aligned with tokens.borderRadiusMedium for rounded, tokens.borderRadiusCircular for circular, and tokens.borderRadiusNone for square. Focus styling should reuse tokens.colorStrokeFocus2 with tokens.strokeWidthThick rather than being removed. The buttonClassNames export can be used to target the component's generated class names when a style must win over the built-in ones, and long labels can be controlled by setting a maximum width in a custom class so text wraps at the intended point instead of stretching the button, as demonstrated by the WithLongText story.

## Performance

Button is a leaf component with no state, no context subscriptions beyond the theme and direction provided by Provider, and no internal portals, so it is cheap to render even in large lists. Style computation is hoisted by makeStyles into static atomic classes, so avoid composing new class strings or inline style objects on every render and prefer stable class references produced once at module scope. Elements passed to the icon slot are recreated on each render along with the parent, which is normal and inexpensive for Fluent icons, but avoid wrapping each button in additional layers such as Tooltip inside virtualized lists where the positioning layer multiplies; only icon-only or ambiguous buttons need a tooltip. Keep click handlers stable with React.useCallback when buttons render in long lists, and prefer the disabledFocusable loading pattern with a small Spinner over swapping the entire button element, which would remount the node and drop focus. Adding an aria-busy attribute during loading avoids re-announcing the whole button subtree repeatedly.

## Theming & Tokens

Button consumes the theme exposed through Provider tokens and therefore adapts automatically to light, dark, and high-contrast themes, including custom brand themes. Primary buttons draw their fill from tokens.colorBrandBackground with tokens.colorBrandBackgroundHover and tokens.colorBrandBackgroundPressed for interaction states and tokens.colorNeutralForegroundOnBrand for the label. Secondary buttons use tokens.colorNeutralBackground1 with tokens.colorNeutralStroke1 and token-driven hover and pressed backgrounds, while subtle and transparent appearances rely on tokens.colorSubtleBackgroundHover and tokens.colorSubtleBackgroundPressed so they blend into surfaces until interacted with. Unavailable states use tokens.colorNeutralBackgroundDisabled, tokens.colorNeutralForegroundDisabled, and tokens.colorNeutralStrokeDisabled. Shape resolves to tokens.borderRadiusMedium, tokens.borderRadiusCircular, or tokens.borderRadiusNone, spacing and typography come from tokens.spacingHorizontalM, tokens.spacingHorizontalSNudge, tokens.spacingVerticalXS, tokens.fontSizeBase300, and tokens.fontWeightSemibold, and the focus ring is composed from tokens.colorStrokeFocus2 and tokens.strokeWidthThick. Because every one of these is a token, overriding a value in a custom theme restyles all buttons consistently without touching component code.

## Migration Notes

Moving from Fluent UI React v8, the primary boolean prop is gone and is replaced by appearance set to primary, while the circular boolean becomes shape set to circular and the text and secondaryText props are replaced by children (compound button content is composed directly inside the button). Icon rendering changed from an iconProps object plus an onRenderIcon renderer to the icon slot, which takes a rendered icon element, and iconPosition now accepts before or after. The styles prop and componentRef were replaced by className plus makeStyles and mergeClasses, and by ref. Menu-style buttons are now provided through the Menu family rather than through menuIcon and menuProps on Button, and the size scale is expressed through the ButtonSize union with medium as the default. Disabled handling is unchanged in spirit, but disabledFocusable is the supported way to keep a disabled button in the tab order.

## Edge Cases

- Long labels wrap once they reach the component's maximum width rather than truncating, so a very long label can change the height of a button row; constrain the width with a custom class when a single-line control is required, as the WithLongText story illustrates.
- A button rendered without children is only valid when it still has an accessible name; an icon plus a tooltip configured as a label or an aria-label is required, and the small and medium sizes use tighter padding that assumes a single icon.
- The disabled prop removes the button from the tab order and blocks pointer events, while disabledFocusable keeps it focusable and marks it unavailable through aria-disabled; choosing the wrong one either hides the action from keyboard users or leaves it clickable in ways callers do not expect.
- When the root slot is rendered as an anchor, the native disabled attribute does not apply, so unavailable behavior has to be expressed with aria-disabled and guarded in the click handler instead.
- The circular and square shapes are most convincing at consistent sizes and with a single icon or very short label; combining circular with a multi-line label produces an awkward pill shape.
- Setting both disabled and disabledFocusable is contradictory in intent; disabledFocusable only has an effect when the button is otherwise non-interactive, and mixing the two makes the intended tab order behavior ambiguous.
- Loading states must set an unavailable mode (disabledFocusable is typical) alongside the Spinner in the icon slot; otherwise the button remains clickable and duplicate requests can be issued.

## See Also

- - [buttons category](../categories/buttons.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
