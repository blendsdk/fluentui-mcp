# CompoundButton

> **Package**: `@fluentui/react-button` v9.9.2
> **Import**: `import { CompoundButton } from '@fluentui/react-components';`
> **Category**: buttons
> **Stability**: stable

## Overview

CompoundButton is a button in the Fluent UI React v9 button family that presents two levels of text: a primary label supplied as the button children and a supporting line supplied through the secondaryContent slot. This stacked content makes the control useful when a short label alone would be ambiguous — for example an action that needs a one-line explanation of what it will do. The component shares the standard button prop surface, so it supports the same appearance values (secondary default, primary, outline, subtle, transparent), the small, medium, and large sizes, the rounded, circular, and square shapes, leading or trailing icons through the icon slot and iconPosition, and both disabled and disabledFocusable states. Its structure is composed from slots: the root element, a contentContainer that wraps the label and secondary text, the secondaryContent span, and an optional icon. Because the label and the secondary line are separate elements inside the content container, long primary text wraps once it reaches the component's maximum width rather than truncating. The type surface also declares the shared button members such as appearance, shape, size, disabled, disabledFocusable, iconPosition, plus menu-oriented and toggle-oriented slots that are part of the common button prop contract.

**When to use**: Use CompoundButton when a single-line Button label cannot carry enough meaning on its own and the action benefits from a persistent second line of explanation that is always visible, not hidden behind a tooltip or a menu. It is a good fit for card actions, empty-state and first-run call-to-actions, onboarding and picker dialogs, and any surface where the user must choose between a small number of clearly described actions. Prefer plain Button when the label is self-explanatory and vertical space is at a premium, since CompoundButton is intentionally taller because of its two text rows. Use MenuButton or SplitButton when the button opens a menu or splits a primary action from a menu of secondary actions, ToggleButton when the control represents a persistent on/off state, and Link when the interaction navigates rather than performs an action. Avoid using CompoundButton purely for visual weight; if you only need emphasis, change the appearance of a regular Button instead.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `'secondary' \| 'primary' \| 'outline' \| 'subtle' \| 'transparent'` | — | No | — |
| `checked` | `boolean` | — | No | — |
| `contentContainer` | `NonNullable<Slot<'span'>>` | — | Yes | — |
| `defaultChecked` | `boolean` | — | No | — |
| `disabled` | `boolean` | — | No | — |
| `disabledFocusable` | `boolean` | — | No | — |
| `iconPosition` | `'before' \| 'after'` | — | No | — |
| `isAccessible` | `boolean` | — | No | — |
| `menuButton` | `Slot<typeof MenuButton>` | — | No | — |
| `menuIcon` | `Slot<'span'>` | — | No | — |
| `primaryActionButton` | `Slot<typeof Button>` | — | No | — |
| `root` | `NonNullable<Slot<'div'>>` | — | Yes | — |
| `secondaryContent` | `Slot<'span'>` | — | No | — |
| `shape` | `'rounded' \| 'circular' \| 'square'` | — | No | — |
| `size` | `ButtonSize` | — | No | — |
| `size` | `ButtonSize` | — | No | — |

### Prop Guidance

- **appearance**: Selects the visual weight of the button. Leave it unset for the default secondary style, use primary for the single most important action in a view, use outline when the button sits on a colored or image background where a border is needed but a solid fill is not, and use subtle or transparent inside toolbars, cards, and dense surfaces where the button should recede until hover or focus. `primary`
- **size**: Controls the overall height and typography scale. Defaults to medium; use small for compact panels and toolbars, and large when the compound button is a prominent call to action in an empty state or hero region. Keep one size across a group of adjacent actions. `large`
- **shape**: Controls corner rounding. rounded is the default and correct for almost all labeled compound buttons; circular and square change the silhouette and are best reserved for icon-only usage where the shape is the primary visual signal. `rounded`
- **iconPosition**: Places the icon before or after the content container when an icon is provided through the icon slot. Use before for leading concepts such as a calendar or document glyph, and after for trailing affordances such as an external indicator. `before`
- **icon (slot)**: Renders a leading or trailing icon inside the button. When the icon is decorative it should be hidden from assistive technology; when the button contains no visible label at all, the icon-only button must still get an accessible name, for example through a Tooltip used with the label relationship. `CalendarMonthRegular`
- **secondaryContent**: The supporting line rendered below the primary label. Keep it to a single concise sentence that explains or disambiguates the action; this is what distinguishes CompoundButton from a plain button, so it should be present in normal usage. `Create a recurring meeting`
- **contentContainer**: The non-nullable slot wrapping the primary label and the secondary line. Override it only when you need to restructure the text block, for example to attach extra attributes; the default already handles layout and wrapping. `span`
- **root**: The non-nullable root slot that carries the component's classes and the interactive behavior. Override it when the compound button must render as a different element or forward extra attributes to the outermost node, but preserve the accessibility semantics and focus behavior. `button element with component classes`
- **disabled**: Marks the button as unavailable and removes it from the tab order and from assistive technology's interactive control set. Use it for standalone buttons that truly cannot be reached; prefer disabledFocusable when the surrounding UI depends on a stable tab order. `true`
- **disabledFocusable**: Renders the button as visually disabled and announces it as unavailable via aria-disabled while keeping it focusable, so keyboard and screen reader users do not lose their place in a menu, command bar, or toolbar. Prefer this over disabled in those containers, and never combine the two props. `true`
- **menuIcon**: A slot for the trailing menu glyph on the shared button prop surface. Only relevant if you are rendering the compound button with menu affordances; typical compound buttons with an icon should use the icon slot instead. `chevron icon span`
- **menuButton**: A slot for an embedded menu button on the shared button prop surface, used to present a menu-triggering control alongside primary content. Reach for MenuButton or SplitButton when that is the intent, and leave this slot alone in ordinary compound button usage. `MenuButton`
- **primaryActionButton**: A slot for the primary action portion of a split layout on the shared button prop surface. SplitButton is the supported component for primary-plus-menu behavior, so treat this slot as plumbing you should not set directly for a plain compound button. `Button`
- **checked**: Controlled selected state declared on the shared button prop surface. CompoundButton does not present a selected visual state, so use ToggleButton or ToolbarToggleButton when the control must show on/off selection rather than setting this prop. `true`
- **defaultChecked**: Uncontrolled initial selected state declared on the shared button prop surface, mirroring the controlled checked prop. It is not part of the compound button visual contract, so choose a toggle component if selection state must be expressed. `false`
- **isAccessible**: A shared button-surface flag related to how the control exposes itself to accessibility APIs. Leave it at its default for standard compound buttons and only change it in advanced scenarios where you are deliberately redefining the button's accessible semantics. `default`

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { CompoundButton } from '@fluentui/react-components';
import { CalendarMonthRegular } from '@fluentui/react-icons';
import type { CompoundButtonProps } from '@fluentui/react-components';

export const Default = (props: CompoundButtonProps): JSXElement => (
  <CompoundButton icon={<CalendarMonthRegular />} secondaryContent="Secondary content" {...props}>
    Example
  </CompoundButton>
);
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, CompoundButton } from '@fluentui/react-components';
import { bundleIcon, CalendarMonthFilled, CalendarMonthRegular } from '@fluentui/react-icons';

export const Appearance = (): JSXElement => {
  const styles = useStyles();

  return (
    <div className={styles.wrapper}>
      <CompoundButton secondaryContent="Secondary content" icon={<CalendarMonthRegular />}>
        Default
      </CompoundButton>
      <CompoundButton secondaryContent="Secondary content" appearance="primary" icon={<CalendarMonthRegular />}>
        Primary
      </CompoundButton>
      <CompoundButton secondaryContent="Secondary content" appearance="outline" icon={<CalendarMonth />}>
        Outline
      </CompoundButton>
      <CompoundButton secondaryContent="Secondary content" appearance="subtle" icon={<CalendarMonth />}>
        Subtle
      </CompoundButton>
      <CompoundButton secondaryContent="Secondary content" appearance="transparent" icon={<CalendarMonth />}>
        Transparent
      </CompoundButton>
    </div>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story:
        '- `(undefined)`: the compound button appears with the default style\n' +
        '- `primary`: emphasizes the compound button as a primary action.\n' +
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
import { makeStyles, CompoundButton } from '@fluentui/react-components';

export const Disabled = (): JSXElement => {
  const styles = useStyles();

  return (
    <div className={styles.outerWrapper}>
      <div className={styles.innerWrapper}>
        <CompoundButton secondaryContent="Secondary content">Enabled state</CompoundButton>
        <CompoundButton disabled secondaryContent="Secondary content">
          Disabled state
        </CompoundButton>
        <CompoundButton disabledFocusable secondaryContent="Secondary content">
          Disabled focusable state
        </CompoundButton>
      </div>
      <div className={styles.innerWrapper}>
        <CompoundButton appearance="primary" secondaryContent="Secondary content">
          Enabled state
        </CompoundButton>
        <CompoundButton appearance="primary" disabled secondaryContent="Secondary content">
          Disabled state
        </CompoundButton>
        <CompoundButton appearance="primary" disabledFocusable secondaryContent="Secondary content">
          Disabled focusable state
        </CompoundButton>
      </div>
    </div>
  );
};

Disabled.parameters = {
  docs: {
    description: {
      story: `A compound button can be \`disabled\` or \`disabledFocusable\`.
              \`disabledFocusable\` is used in scenarios where it is important to keep a consistent tab order
              for screen reader and keyboard users. The primary example of this pattern is when
              the disabled compound button is in a menu or a commandbar and is seldom used for standalone buttons.`,
    },
  },
};
```

## Best Practices

### Do's

- Keep the primary label short and action-oriented — a verb plus object such as 'Create report' — and let secondaryContent carry the clarifying sentence.
- Always supply secondaryContent when you choose CompoundButton; a compound button without its second line is just a taller Button and wastes vertical space.
- Match the appearance to the action's weight in the page: use primary for the single most important action in a view, leave appearance unset for secondary actions, and use subtle or transparent inside toolbars and dense surfaces.
- Pair the icon slot with iconPosition before or after deliberately; use before for leading affordances like a calendar or document glyph, and after for trailing affordances such as an external-link or chevron indicator.
- Give icon-only compound buttons an accessible name, for example by wrapping them in a Tooltip with the relationship set to label, so screen reader users hear a meaningful name.
- Choose the size that matches the surrounding control density — small for compact panels, medium as the default, large for hero and empty-state actions — and keep a single size per action group.
- Use disabledFocusable instead of disabled when the button lives in a menu, command bar, or toolbar where a stable tab order matters for keyboard and screen reader users.

### Don'ts

- Don't cram a paragraph into secondaryContent; it is a single supporting line, so keep it to roughly one short sentence.
- Don't place two CompoundButtons with primary appearance side by side in the same region — only one action should be visually dominant.
- Don't use shape circular for compound buttons that carry a visible primary label and secondary line; the circular shape is intended for icon-only usage where the round silhouette reads correctly.
- Don't rely on the tooltip or the icon to convey the meaning of the button; the visible primary label must stand on its own.
- Don't set both disabled and disabledFocusable together, and don't use disabledFocusable on a standalone page-level button where skipping it in the tab order is actually the expected behavior.
- Don't use CompoundButton as a navigation link or as a toggle; it does not communicate a selected state.
- Don't disable a compound button to hide an unavailable action without explaining why elsewhere in the UI; sighted and screen reader users both need the reason surfaced as supporting text.
- Don't override the component's maximum width with a long custom className just to fit more copy; shorten the text instead, since the compound layout is tuned around a bounded width.

## Anti-Patterns

### Compound button as a single-line button

❌ Passing only children and omitting secondaryContent produces a taller, heavier control with a conspicuous empty second row, which reads as a layout bug and consumes vertical space without adding information.

✅ Use a regular Button when a single label is sufficient, and reserve CompoundButton for cases where the supporting line carries real meaning.

### Multiple primary compound buttons in one region

❌ Because primary appearance is designed to mark the single most important action on a surface, placing several primary compound buttons together removes the visual hierarchy that the appearance prop exists to create.

✅ Pick one primary action and demote the rest to the default, outline, subtle, or transparent appearances so the emphasis stays meaningful.

### Icon-only compound button without an accessible name

❌ Rendering only the icon slot leaves the button with no visible text, so screen readers announce an unnamed button and keyboard users have no way to discover its purpose.

✅ Provide an accessible name, for example by wrapping the compound button in a Tooltip used with the label relationship, or by supplying an explicit aria-label when no tooltip is appropriate.

### Using disabled as the primary explanation for an unavailable action

❌ A disabled compound button is skipped by the tab order and its supporting text is often not announced in context, so users cannot tell why the action is blocked or how to unblock it.

✅ Keep the button enabled and explain the prerequisite elsewhere on the surface, or use disabledFocusable with surrounding text that states the reason the action is unavailable.

### Overriding width and typography to force long copy into a compound button

❌ The compound layout is tuned around a bounded maximum width, and overriding it with wide custom classes breaks the visual relationship between the primary label and its supporting line and pushes the button out of alignment with sibling controls.

✅ Shorten the primary label and the secondary line so the natural wrapping behavior handles the text within the component's default width.

## Accessibility

**Requirements**: CompoundButton follows native button semantics, so it must always expose an accessible name: the visible children text satisfies this for labeled buttons, while icon-only compound buttons require an explicit name such as a Tooltip used with the label relationship or an aria-label. Color contrast between the primary label, the secondaryContent line, and the button background must meet WCAG AA in every appearance, including the subtle and transparent variants where the background is inherited from the parent surface. Focus indication must remain visible, so do not remove the focus outline when overriding styles. Disabled states must not be the only signal that an action is unavailable — pair them with visible explanation text. Ensure the button meets the minimum target size recommended for pointer interaction, which the medium and large sizes satisfy naturally.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the compound button when it is enabled; disabled buttons are skipped, while disabledFocusable buttons remain in the tab order so that focus order stays predictable. |
| `Shift+Tab` | Moves focus to the previous focusable element, following the same enabled/disabledFocusable rules as forward tabbing. |
| `Enter` | Activates the button and fires its click handler when the button is focused and enabled. |
| `Space` | Activates the button using native button behavior; the action fires when the key is released and no handler runs when the button is disabled or disabledFocusable. |

**ARIA**: aria-disabled — set to true on disabledFocusable buttons so assistive technology announces the state while the element stays focusable, aria-label — supplies the accessible name for icon-only compound buttons that have no visible text, aria-labelledby — connects the button to an external visible label when the button's own text should not be used as its name, aria-hidden — applied to purely decorative icons inside the icon slot so they are not announced in addition to the label, disabled attribute — used by the disabled prop to remove the button from the tab order and from the accessibility tree's interactive set

**Screen Reader**: A screen reader announces the compound button as a button, then reads its accessible name from the visible primary label; the secondaryContent line is exposed as additional text content of the same control and is typically read immediately after the label unless the button has an explicit aria-label, in which case only that label is announced. With disabledFocusable, the control is still reachable by Tab and is announced as dimmed or unavailable because of aria-disabled, and the activation is suppressed. With disabled, the control is removed from the tab sequence entirely and screen reader users browsing by form control or by button will not encounter it.

## Styling

CompoundButton ships with its own Griffel classes, so target it through className and makeStyles rather than styling the internals. The secondary line uses a smaller, muted style — overriding it means substituting something like tokens.fontSizeBase200 for the label's tokens.fontSizeBase300 and tokens.colorNeutralForeground2 for the label color. Background and border overrides should use real tokens so high-contrast themes keep working: tokens.colorNeutralBackground1 and tokens.colorNeutralStroke1 for the default secondary appearance, tokens.colorBrandBackground and tokens.colorBrandBackgroundHover for primary, tokens.colorTransparentBackground for outline, subtle, and transparent variants, and tokens.colorNeutralBackground1Disabled with tokens.colorNeutralForegroundDisabled for disabled states. Radii come from the shape prop, which maps to tokens.borderRadiusMedium, tokens.borderRadiusCircular, and tokens.borderRadiusNone. Internal spacing uses tokens.spacingHorizontalMNudge and tokens.spacingVerticalXS style values, so if you increase padding, scale it with those spacing tokens to stay on the Fluent spacing ramp. The component enforces a maximum width, which is why long primary text wraps — a custom className is the correct place to raise or lower that bound, and the focus indicator should keep using the standard focus stroke tokens.

## Performance

CompoundButton is a lightweight component built on Griffel's atomic CSS, so appearance, size, and shape variations share generated classes instead of creating per-instance style objects — calling makeStyles at module scope keeps that benefit. Prefer the string form of secondaryContent over a freshly created element to avoid extra work during reconciliation, and hoist icon elements out of render or rely on the bundled icon helpers so new React elements are not produced on every render. Like all buttons, avoid passing new inline class strings or new slot override objects on every render in long virtualized lists, because those defeat the shallow comparisons the component performs on its slots. If a compound button sits inside a large, frequently re-rendering list, memoizing the row or the button itself prevents unnecessary re-renders of the two text nodes and the icon.

## Theming & Tokens

CompoundButton derives all of its visuals from theme tokens, so it adapts automatically to light, dark, and high-contrast themes provided by FluentProvider. The default secondary appearance pulls its surface from tokens.colorNeutralBackground1, its border from tokens.colorNeutralStroke1, and its text from tokens.colorNeutralForeground1, while the primary appearance uses tokens.colorBrandBackground and its interaction states such as tokens.colorBrandBackgroundHover and tokens.colorBrandBackgroundPressed. The synthetic outline, subtle, and transparent appearances drop fills down to tokens.colorTransparentBackground, and the secondary line is rendered in a de-emphasized color such as tokens.colorNeutralForeground2 with a smaller type ramp entry. Disabled rendering uses tokens.colorNeutralBackground1Disabled and tokens.colorNeutralForegroundDisabled so the same disabled treatment works in every appearance, and the shape prop maps to tokens.borderRadiusMedium, tokens.borderRadiusCircular, or tokens.borderRadiusNone. Focus indication is drawn with the theme's focus stroke tokens, which is why overriding outlines in custom classes can break high-contrast support.

## Migration Notes

Coming from Fluent UI React v8, CompoundButton is the v9 successor of the v8 CompoundButton with the same two-line intent but a rebuilt styling and slot model: v8's styles prop is replaced by Griffel classes created with makeStyles and applied through className, and the v8 theme object is replaced by theme tokens consumed from tokens.* inside those styles. The v8 secondaryText prop is now the secondaryContent slot, and content, icon, and children are slots you can override through the component's slot props. v9 also adds the disabledFocusable state, which v8 did not have, so places where v8 kept a disabled compound button in the tab order can now be expressed declaratively. Prop names that used to be booleans for variant selection are consolidated into the appearance enumeration, and size now accepts small, medium, and large.

## Edge Cases

- Long primary text wraps once it reaches the component's maximum width; it does not truncate with an ellipsis, so very long labels produce multi-row buttons that can misalign with adjacent controls.
- The secondaryContent line is not automatically hidden when the button is disabled, so any stale or misleading supporting text remains visible while the action is unavailable.
- An icon-only compound button renders with no visible text and no secondary line, so it must be given an accessible name externally; the shape prop is the primary way to make that icon-only form look intentional.
- Setting both disabled and disabledFocusable on the same button produces a control with conflicting focus and announcement behavior — the two states are mutually exclusive by design.
- The declared prop surface includes menu and toggle oriented members such as menuButton, menuIcon, primaryActionButton, checked, defaultChecked, and isAccessible, which belong to the shared button prop contract rather than the compound button's visual behavior and should not be used to emulate menus or toggles.
- Second-line text that wraps to multiple lines increases button height and can break vertical alignment in a row of otherwise uniform buttons, so test secondaryContent at the narrowest supported container width.

## See Also

- [buttons category](../categories/buttons.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
