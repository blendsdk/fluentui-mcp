# Button

> **Package**: `@fluentui/react-button` v9.9.2
> **Import**: `import { Button } from '@fluentui/react-components';`
> **Category**: buttons
> **Stability**: stable

## Overview

Button is Fluent UI React v9's fundamental action control: a single component that triggers an action, submits a choice, or navigates (when given a hyperlink) with one click, tap, or key press. Its root slot renders a native button element, or an anchor element when the root is passed a URL, so the component inherits platform semantics, focus handling, and native disabled behavior instead of re-implementing them. One component covers the full emphasis spectrum through the appearance prop (secondary, primary, outline, subtle, transparent), four visual weights through shape (rounded, circular, square) and size (small, medium, large), and optional leading or trailing decoration through the icon slot combined with iconPosition. Labels wrap once they reach the component's maximum width, and the disabledFocusable prop lets a visually disabled button remain in the tab order so keyboard and screen reader users keep a stable navigation sequence. Because so much of an application's affordance and hierarchy is expressed through buttons, consistent use of appearance, size, and shape across a product is one of the highest-leverage design decisions available.

**When to use**: Use Button whenever a user needs to perform an action that does not require additional input, confirmation, or a separate surface: submitting a form, confirming a dialog, starting a process, or toggling a command in a toolbar. Choose the appearance that matches the action's weight in the hierarchy — primary for the single most important action in a view, secondary (the default) for the bulk of ordinary actions, outline when the button sits on a busy or colored background and needs a defined edge without a filled background, subtle for low-priority actions inside dense surfaces such as cards, list rows, and toolbars, and transparent for actions that must blend completely into their surroundings until hovered or focused. Use the icon slot together with iconPosition to add a familiar glyph to a labeled action. Reach for the sibling components instead when the interaction is genuinely different: CompoundButton when the action needs a secondary line of explanatory text, SplitButton when a primary action needs an attached menu of secondary options, MenuButton when the control only opens a menu, ToggleButton when the control holds a pressed/unpressed state, and ToolbarButton or ToolbarToggleButton when the button is part of a Toolbar. If the goal is simply to move the user to another document or view and no button-level visual weight is required, prefer the Link component so users get standard link affordances such as open-in-new-tab and middle-click.

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

- **appearance**: Controls visual emphasis and is the primary tool for expressing action hierarchy. Default secondary is the workhorse filled-neutral look; primary is for the single most important action in a view; outline keeps a defined border but removes the fill, which is useful over colored or image backgrounds; subtle blends into the surface until hovered or focused, ideal inside cards, list rows, and toolbars; transparent removes both background and border for the flattest possible treatment. Use exactly one primary per view and let everything else stay secondary, subtle, or outline. `primary`
- **size**: Sets the button's overall scale using ButtonSize values. Small suits dense surfaces such as toolbars and table cells, medium is the default and fits most page-level actions, and large works for prominent calls to action in empty states and onboarding. Keep one size per surface so density and alignment stay consistent, and be mindful that small buttons produce smaller pointer targets. `medium`
- **shape**: Chooses the corner treatment: rounded is the default and matches the rest of the design language, circular produces a perfect circle, and square uses hard corners that align with squared-off chrome such as grids and swatches. Circular and square are designed around icon-only content; combining them with text labels yields awkward padding. `circular`
- **iconPosition**: Places the icon slot either before or after the button's children and defaults to before. Keep icons before the label for actions that initiate something, and after the label when the glyph suggests movement or progression. The prop has no effect when the icon slot is not provided. `after`
- **icon**: The icon slot accepts a single JSX element rendered before or after the children as dictated by iconPosition. When no children are supplied the button becomes icon-only and must still receive an accessible name, typically by wrapping it in a Tooltip with relationship="label" or by setting aria-label. Sizing and spacing around the icon are handled by the component across all three sizes. `<CalendarMonthRegular />`
- **disabled**: Marks the button as non-interactive and removes it from the tab order entirely, matching native button behavior. Use it only for standalone buttons that are unrelated to surrounding keyboard navigation, and make sure the reason the action is unavailable is apparent from nearby text. `true`
- **disabledFocusable**: Renders the button as non-interactive while keeping it focusable and in the tab order so keyboard and screen reader users encounter it in a predictable position. This is the recommended treatment for disabled commands in menus, toolbars, and command bars, and is also the standard technique for locking a button during an in-flight loading state. `true`
- **className**: The supported way to apply custom styling, including constraining the button's maximum width so a long label wraps instead of stretching the layout, or locking hover and pressed states during a simulated loading sequence. Custom classes are merged with the component's own classes, so state styles still apply unless they are explicitly overridden. `styles.longText`

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

- Reserve appearance="primary" for the single most important action in a given view or dialog so that it retains its meaning as a hierarchy signal.
- Leave appearance at its default secondary for the majority of actions; the default is deliberately the most neutral filled treatment.
- Give every icon-only button an accessible name by wrapping it in a Tooltip with relationship="label" or by supplying an aria-label, since an icon alone carries no text for assistive technology.
- Prefer disabledFocusable over disabled when the button lives in a menu, toolbar, or command surface where a stable tab order matters for keyboard and screen reader users.
- Keep labels short and verb-led (two or three words) so the button stays a single line at the default max width and remains scannable in dense layouts.
- Match iconPosition to convention: icons before the label for actions that start something, and after the label when the icon implies progression such as an arrow or chevron.
- Use shape="circular" together with an icon-only button and shape="square" when the button must align flush with squared-off chrome; otherwise keep the default rounded shape.
- Pick one size per surface — small for compact toolbars and table rows, medium as the default, large for prominent empty states and onboarding — so density stays consistent.
- Simulate progress with a tiny Spinner in the icon slot plus disabledFocusable while the action is in flight, and restore the original label and icon when it completes, so the button does not jump in width.
- Apply custom styling through makeStyles and className so Griffel can compile and share the resulting classes across every instance with the same configuration.

### Don'ts

- Don't place two or more primary buttons in the same view or dialog; competing emphases flatten the hierarchy and slow decision making.
- Don't use disabled for a button that is part of a menu, toolbar, or command bar, because removing it from the tab order makes the surface's keyboard navigation unpredictable.
- Don't ship an icon-only button with no accessible name — a bare glyph is announced as an unlabeled button and is unusable with a screen reader.
- Don't write sentence-length labels; the text will wrap at the component's max width and produce multi-line buttons that break row alignment.
- Don't use shape="circular" or shape="square" with text children; those shapes are designed around a single icon and produce awkward, uneven padding with labels.
- Don't strip the focus outline or focus styling when customizing the appearance, since that removes the only visual affordance keyboard users have to locate focus.
- Don't apply transition animation or hover styling to the element while a loading state is active; lock the interactive states so the button does not flicker between its busy and idle looks.
- Don't use subtle or transparent appearance for a destructive or critical action on top of an unpredictable background, because contrast and discoverability cannot be guaranteed.
- Don't override styles with inline style objects; they bypass theme tokens, defeat class-name caching, and typically miss the hover, pressed, focus, and disabled states the component already handles.
- Don't reach for Button purely to navigate to another page when a Link or a navigation-specific component better conveys the destination semantics.

## Anti-Patterns

### Icon-only button with no accessible name

❌ A Button that receives only an icon and no children has no text to derive a name from, so assistive technology announces it as an unlabeled button and users cannot tell what it does. This is the most common accessibility failure for this component and it is invisible in visual review.

✅ Wrap the button in a Tooltip with relationship="label" so the tooltip text also becomes the accessible name, or set aria-label directly on the button. This pattern is demonstrated by the icon-only examples in the size and icon stories.

### Using disabled inside menus, toolbars, and command bars

❌ A disabled Button is removed from the tab order, so its position disappears for keyboard users and the surrounding navigation becomes unpredictable; screen reader users never learn that the command exists at all.

✅ Use disabledFocusable instead so the button stays focusable and is announced as unavailable through aria-disabled. Reserve disabled for standalone buttons that are not part of a navigable group.

### Competing primary actions

❌ When several buttons on the same surface use appearance="primary", none of them reads as the primary action, so users cannot tell where to look first and the hierarchy the appearance prop exists to express is destroyed.

✅ Choose one primary action per view, dialog, or card, and demote everything else to the default secondary, subtle, or outline appearances.

### Sentence-length labels and unwanted wrapping

❌ Button text wraps once it reaches the component's maximum width, so long labels turn a compact control into a multi-line block that misaligns with neighboring buttons and shifts row heights in tables and toolbars.

✅ Keep labels to a short verb phrase. When a longer explanation is unavoidable, constrain the width through a className as the long-text story does, or move the explanation into surrounding text or a Tooltip and keep the label concise.

### Shape and content mismatch

❌ Applying shape="circular" or shape="square" to a button that contains text produces inconsistent padding and a control that does not visually match either the circle or the square design intent.

✅ Reserve circular and square shapes for icon-only buttons and keep the default rounded shape for anything with a visible text label.

### Overriding styles without preserving states

❌ Replacing the component's styles with inline style objects or unlayered CSS typically handles only the resting state, so hover, pressed, focus, and disabled looks drift out of alignment with the rest of the app and the focus ring may disappear entirely.

✅ Style through makeStyles with theme tokens that cover every state, and when a single className cannot beat the internal state selectors, target the component's internal class names through the buttonClassNames export, as the loading story does.

## Accessibility

**Requirements**: Button must satisfy WCAG 2.1 AA: a discernible accessible name from its children or an aria-label (SC 4.1.2 Name, Role, Value), full keyboard operability with no keyboard trap (SC 2.1.1), a visible focus indicator that remains perceivable against every appearance variant on the background it is placed on (SC 2.4.7), color contrast of at least 4.5:1 for label text and at least 3:1 for the boundary of controls whose shape conveys meaning (SC 1.4.3 and 1.4.11), and a pointer target large enough for the context (SC 2.5.8) — note that size="small" is the most at-risk configuration and should be avoided for isolated primary touch targets. Because the root slot renders a real button element, role, enabled/disabled state, and activation behavior are exposed natively; only add ARIA when you replace or extend that behavior. Any Button that is disabled must still be understandable: users should be able to learn why the action is unavailable, either from surrounding text or by using disabledFocusable plus an explanation, because a truly disabled, unfocusable button cannot be discovered by keyboard or screen reader users at all.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the next focusable element; an enabled Button and a disabledFocusable Button both receive focus, while a disabled Button is skipped because it is removed from the tab order. |
| `Shift + Tab` | Moves focus to the previous focusable element, honoring the same tab-order rules as Tab. |
| `Enter` | Activates the button and fires its click handler; when the root slot renders an anchor, Enter follows the hyperlink instead. |
| `Space` | Activates a button-rendered root, matching native button behavior; on an anchor-rendered root Space scrolls the page rather than activating, so links must be reachable with Enter. |

**ARIA**: aria-disabled — set to true when disabledFocusable is used so the button stays focusable but is announced as unavailable, aria-label — supply an explicit accessible name for icon-only buttons that have no text children, aria-labelledby — reference an existing element to name the button when the visible label lives outside the button, aria-describedby — point at helper or error text that explains why an action is unavailable, aria-hidden — icons passed to the icon slot are decorative and must never be the sole carrier of the button's meaning, role — implicit button role from the rendered root element; do not override it

**Screen Reader**: The component is announced with the button role followed by its accessible name, which comes from the children text, an aria-label, or an aria-labelledby reference. Because the name is announced before the state, an icon-only button with no name is read as an unlabeled button, which is the single most common accessibility defect for this component. A button rendered with disabled is announced as unavailable or dimmed and cannot be reached with the tab key, while a button rendered with disabledFocusable keeps its place in the tab order and is announced as unavailable through aria-disabled, so screen reader users can discover it and hear its label in context. When a Tooltip is attached with relationship="label", the tooltip content also becomes the button's accessible name, which is the recommended pattern for icon-only buttons. Loading-style buttons that swap their label text announce the new label on the next read, so changing the text to a busy state — for example from an action verb to a progress word — gives users the only feedback they receive.

## Styling

Customize Button through makeStyles and the className prop so Griffel compiles atomic classes once and reuses them across every instance with the same configuration. Each appearance maps to a coherent set of theme tokens you can mirror or extend: primary uses tokens.colorBrandBackground, tokens.colorBrandBackgroundHover, tokens.colorBrandBackgroundPressed and tokens.colorNeutralForegroundOnBrand for its label; the default secondary uses tokens.colorNeutralBackground1 with tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed, bounded by tokens.colorNeutralStroke1 with tokens.colorNeutralStroke1Hover and tokens.colorNeutralStroke1Pressed; outline drops the fill in favor of tokens.colorTransparentBackground with tokens.colorTransparentStroke and tokens.colorNeutralForeground1; subtle uses tokens.colorSubtleBackground, tokens.colorSubtleBackgroundHover and tokens.colorSubtleBackgroundPressed; and transparent removes both background and border. Disabled states consume tokens.colorNeutralForegroundDisabled, tokens.colorNeutralBackgroundDisabled and tokens.colorNeutralStrokeDisabled. For focus, rely on tokens.colorStrokeFocus2 and tokens.colorStrokeFocus1 with tokens.strokeWidthThick so the ring stays visible on every background, and never remove the focus style for the sake of a flatter look. Round out customizations with tokens.borderRadiusMedium for the default rounded shape, tokens.borderRadiusCircular for circular buttons, tokens.borderRadiusNone for square ones, spacing tokens such as tokens.spacingHorizontalS, tokens.spacingHorizontalM, tokens.spacingHorizontalSNudge and tokens.spacingVerticalXS for internal gaps, and typography tokens such as tokens.fontSizeBase300 and tokens.lineHeightBase300. Transitions feel native when they use tokens.durationFaster or tokens.durationNormal with tokens.curveEasyEase. When a single className cannot win against the component's internal state selectors — for example when locking a button into a non-interactive loading look — the buttonClassNames export lets you target the component's internal class names directly, which is exactly the technique used by the loading story.

## Performance

Button is a leaf component with a very small render cost, so the dominant performance consideration is style computation rather than reconciliation. Its styles are compiled by Griffel into atomic classes that are shared across all instances with the same appearance, size, and shape, which means a toolbar or data grid full of buttons costs very little beyond the DOM nodes themselves. Applying custom styles through makeStyles and className keeps that cache effective, whereas inline style objects allocate a new object on every render and defeat class sharing. In long virtualized lists, avoid constructing new style objects or new icon elements on each row render; hoist constant class names and, when an icon never changes, hoist the icon element itself. Because the icon slot, className, and children are the only props that typically change per instance, the component re-renders cheaply. Loading states that swap the children text and the icon element force a re-render of that button only — this is inexpensive, but keep the label length stable so the control does not reflow and push surrounding layout.

## Theming & Tokens

Button consumes theme tokens rather than hard-coded colors, so it responds automatically to FluentProvider and to brand ramps. Every appearance resolves to a different token set: primary draws from tokens.colorBrandBackground, tokens.colorBrandBackgroundHover and tokens.colorBrandBackgroundPressed with tokens.colorNeutralForegroundOnBrand for the label; the default secondary draws from tokens.colorNeutralBackground1 with tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed, plus tokens.colorNeutralStroke1, tokens.colorNeutralStroke1Hover and tokens.colorNeutralStroke1Pressed for its border and tokens.colorNeutralForeground1 for text; outline relies on tokens.colorTransparentBackground and tokens.colorTransparentStroke; subtle relies on tokens.colorSubtleBackground, tokens.colorSubtleBackgroundHover and tokens.colorSubtleBackgroundPressed; transparent renders no background or border at all. Unavailable buttons use tokens.colorNeutralForegroundDisabled with tokens.colorNeutralBackgroundDisabled and tokens.colorNeutralStrokeDisabled so they recede consistently in every theme. Focus styling is token-driven through tokens.colorStrokeFocus2 and tokens.colorStrokeFocus1 with tokens.strokeWidthThick, and geometry comes from tokens.borderRadiusMedium, tokens.borderRadiusCircular, tokens.borderRadiusNone along with spacing tokens such as tokens.spacingHorizontalS, tokens.spacingHorizontalM and tokens.spacingVerticalXS. Typography follows tokens.fontSizeBase300 and tokens.lineHeightBase300, and motion follows tokens.durationFaster or tokens.durationNormal with tokens.curveEasyEase. Because these are theme tokens rather than literal values, switching between light, dark, and high-contrast themes restyles the button with no code changes, provided custom overrides also reference tokens instead of fixed colors.

## Migration Notes

The v9 Button consolidates several v8 components into one API. DefaultButton, PrimaryButton, ActionButton, and IconButton are all replaced by Button with an appropriate appearance: primary corresponds to PrimaryButton, secondary (the default) to DefaultButton, subtle to ActionButton or the old subtext/icon-only treatments, and the new outline and transparent appearances have no v8 equivalent. The old boolean primary prop becomes appearance="primary". The v8 iconProps object is replaced by the icon slot, which accepts a JSX element directly, and icons bundle better when created with bundleIcon from @fluentui/react-icons. The v8 text prop is replaced by children. The v8 allowDisabledFocus prop is renamed disabledFocusable and works with the same intent of preserving tab order. The v8 styles prop and IButtonStyles object are gone; use makeStyles with Griffel and theme tokens against className instead. The new shape prop (rounded, circular, square) and the small and large values of the size prop are additions rather than renames — v8 primarily expressed this through size classes and custom styles. Secondary text is no longer part of Button; use CompoundButton for a two-line action. Finally, componentRef is replaced by a standard React ref on the root element.

## Edge Cases

- A Button with only an icon and no children has no accessible name; wrap it in a Tooltip with relationship="label" or set aria-label, otherwise it is announced as an unlabeled button.
- The root slot can render an anchor when given a hyperlink, which changes keyboard behavior — Space scrolls the page on an anchor while it activates a native button — and changes how disabled semantics are expressed.
- Long labels wrap once they reach the component's maximum width, producing taller buttons that can misalign with neighbors; constrain the width with a className or shorten the label.
- disabledFocusable keeps the button in the tab order and announces it as unavailable through aria-disabled, so surrounding interaction logic and custom styles must treat it as non-interactive rather than assuming the native disabled attribute will block input.
- Combining shape="circular" or shape="square" with text children results in uneven padding; those shapes are intended for icon-only content.
- Icon-only buttons created with the small size produce the smallest pointer targets in the system and may fall below comfortable touch target guidance for isolated actions.
- A loading treatment that swaps the label and puts a Spinner in the icon slot changes the button's accessible name mid-interaction, so the busy wording must make sense when announced on its own.

## See Also

- [buttons category](../categories/buttons.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
