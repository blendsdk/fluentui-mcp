# Rating

> **Package**: `@fluentui/react-rating` v9.4.2
> **Import**: `import { Rating } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Rating is a form input that lets a user express a judgment on a fixed, ordered scale by choosing one of a row of icons. Internally each position is a native radio input, so Rating is a single-choice control whose selection carries a numeric value rather than free-form text. It renders filled icons for every item at or below the current value and outline icons for the rest, giving an immediately readable 1-to-max score. The component supports controlled and uncontrolled value management, half-step precision for half-icon ratings, four sizes, three color treatments (neutral, brand, and marigold), and complete icon replacement through the iconFilled and iconOutline props. Because it is radio based, it participates in ordinary form semantics through the name prop, and each item's accessible name is produced by the itemLabel function, which defaults to the bare number.

**When to use**: Use Rating when the answer is a small, ordered, iconographic judgment: product or media reviews, satisfaction surveys, quality scores, or any prompt where picking one of a handful of levels is faster and friendlier than typing. Prefer Slider when the scale is continuous, wide, or numeric rather than symbolic, or when the user should drag to an approximate position. Prefer Spinbutton when the exact number matters and typing it should be possible. Prefer Radio when the choices are unordered categories or each option needs its own visible text label rather than an icon position on a scale. Choose Rating with a controlled value plus a separate clear action when the score must be resettable, because the component has no built-in clear affordance. In every case pair the control with visible text that names what is being rated and what the scale means, since the component itself renders only icons.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `color` | `"brand" \| "marigold" \| "neutral" \| undefined` | `neutral` | No | Controls the color of the Rating. |
| `defaultValue` | `number \| undefined` | — | No | Default value of the Rating |
| `iconFilled` | `any` | — | No | The icon to display when the rating value is greater than or equal to the item's value. |
| `iconOutline` | `any` | — | No | The icon to display when the rating value is less than the item's value. |
| `itemLabel` | `((rating: number) => string) \| undefined` | `(rating) =\> `${rating}`` | No | Prop to generate the aria-label for the rating inputs. |
| `max` | `number \| undefined` | `5` | No | The max value of the rating. This controls the number of rating items displayed. Must be a whole number greater than 1. |
| `name` | `string \| undefined` | — | No | Name for the Radio inputs. If not provided, one will be automatically generated |
| `onChange` | `any` | — | No | Callback when the rating value is changed by the user. |
| `size` | `"small" \| "medium" \| "large" \| "extra-large" \| undefined` | `extra-large` | No | Sets the size of the Rating items. |
| `step` | `0.5 \| 1 \| undefined` | `1` | No | Sets the precision to allow half-filled shapes in Rating |
| `value` | `number \| undefined` | — | No | The value of the rating |

### Prop Guidance

- **color**: Sets the fill color of the rating icons. Leave it at the neutral default for inline, low-emphasis ratings that should sit quietly beside other content; use brand for primary feedback flows such as a review prompt that drives a decision; use marigold for warm, editorial, or celebratory contexts where the brand hue would compete with the surrounding interface. `brand`
- **defaultValue**: Sets the initial value for an uncontrolled rating that manages its own state. Use it with simple, self-contained ratings and with fractional values when step is 0.5. Never combine it with value, which switches the component to controlled mode. `3.5`
- **iconFilled**: Supplies the icon shown for every item whose value is less than or equal to the current rating. Pass an icon component from an icon package and keep it visually paired with iconOutline so checked and unchecked items differ only by fill. Use it when the default star does not fit the domain, such as hearts for favorites or circles for a sentiment scale. `a filled circle icon paired with its outline counterpart`
- **iconOutline**: Supplies the icon shown for items above the current rating. It must be the outline counterpart of iconFilled from the same family and weight; if the two shapes differ in more than fill, users cannot read the score by shape alone and low-vision or color-blind users are especially affected. `the outline circle icon matching the filled circle`
- **itemLabel**: A function that turns each item's numeric position into that radio input's aria-label. The default returns the bare number, which gives screen reader users no scale context. Return descriptive strings, either numeric phrasing with units or anchored descriptors, and make the meaning of the lowest and highest values explicit. Reuse a stable function reference instead of creating a new one on every render. `1 star, 2 stars, 3 stars, 4 stars, 5 stars - Excellent`
- **max**: Sets the number of rating items rendered and therefore the top of the scale. It must be a whole number greater than 1. Keep the conventional 5, use 10 only when the domain expects a decimal score, and avoid larger values because every item is a separate radio input that keyboard users must traverse with arrow keys. `10`
- **name**: Names the internal radio group shared by all items. Provide an explicit, unique name when several Rating instances appear in one form or when the score must be submitted under a known key. If omitted, the component generates a name automatically so separate instances stay independent, but relying on that is risky when you also render your own radios. `productRating`
- **onChange**: Called when the user changes the rating, with the new value in the callback data, including 0 when the value is cleared programmatically. Pair it with value for a controlled rating, or use it alone when the parent only needs notification and the component should keep its own state through defaultValue. `store the reported value in state and pass it back through value, or reset the rating to 0 from a separate Button`
- **step**: Controls the precision of the scale. Keep the default of 1 for ordinary satisfaction and review scales; set 0.5 only when half-item precision is meaningful and the chosen icons read well when half filled. Anything finer than a half step is not supported, and enabling half steps doubles the number of radio inputs to navigate. `0.5`
- **size**: Sets the size of the rating items across small, medium, large, and extra-large, with extra-large as the default. Use small for dense table rows or inline metadata, medium and large for standard form areas, and keep extra-large for hero review prompts where the rating is the primary interaction, since it also produces the most comfortable pointer and touch targets. `small`
- **value**: The controlled value of the rating. Pass it together with onChange and write the reported value back into state, otherwise the rating appears frozen while focus moves. Setting it to 0 clears the selection, which is how a Clear Rating action is typically implemented. Do not use it together with defaultValue. `4`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement, RatingProps } from '@fluentui/react-components';
import { Rating } from '@fluentui/react-components';

export const Default = (props: Partial<RatingProps>): JSXElement => {
  return <Rating {...props} />;
};
```

### Color

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Rating } from '@fluentui/react-components';
import { makeStyles } from '@fluentui/react-components';

export const Color = (): JSXElement => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <Rating defaultValue={3} />

      <Rating color="brand" defaultValue={3} />

      <Rating color="marigold" defaultValue={3} />
    </div>
  );
};

Color.parameters = {
  docs: {
    description: {
      story: "A Rating's `color` can be `neutral` (default), `brand`, or `marigold`.",
    },
  },
};
```

### ControlledValue

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Rating } from '@fluentui/react-components';
import { Button } from '@fluentui/react-components';

export const ControlledValue = (): JSXElement => {
  const [value, setValue] = React.useState(4);
  return (
    <>
      <Rating value={value} onChange={(_, data) => setValue(data.value)} />
      <Button onClick={() => setValue(0)}>Clear Rating</Button>
    </>
  );
};

ControlledValue.parameters = {
  docs: {
    description: {
      story: 'The selected rating value can be controlled using the `value` and `onChange` props.',
    },
  },
};
```

## Best Practices

### Do's

- Decide ownership of the value up front: pass defaultValue for a self-managed rating, and pass value together with onChange when surrounding UI must read, reset, persist, or validate the score.
- Always supply a meaningful itemLabel, for example strings such as 1 star through 5 stars, or anchored labels such as Poor, Fair, Good, Very good, Excellent, so each radio input has a name that communicates the scale.
- Pair the rating with visible text that states what is being rated and which end of the scale is best, because the component renders only icons and carries no visible label of its own.
- Keep max at 5 for conventional star scales and only go to 10 when a decimal score domain requires it, and keep step at 1 unless half-step precision is genuinely meaningful, since every item is a separate radio that keyboard users must traverse.
- Provide an explicit, unique name when more than one Rating appears in the same form, so the groups stay independent and any submitted value is predictable.
- Choose iconFilled and iconOutline from the same icon family and weight so selected and unselected items differ only by fill, which is what makes the score readable at a glance.
- Offer a separate reset affordance, such as a Button that sets a controlled value back to 0, when users must be able to withdraw a rating they already gave.
- Match color and size to context: neutral with small or medium for inline metadata in tables and cards, brand for primary feedback prompts, and the default extra-large for touch-first review flows where the rating is the main interaction.

### Don'ts

- Don't use Rating for continuous or very wide measurement ranges; it renders a fixed set of discrete radio items, so use Slider for continuous input or Spinbutton when the exact value must be typed.
- Don't leave itemLabel at its default of a bare number when the scale needs interpretation, because a screen reader user hearing only 3 cannot tell whether higher is better or what the maximum is.
- Don't pass value without wiring onChange to update it in state, and don't pass value alongside defaultValue; mixing controlled and uncontrolled usage leaves the control looking frozen or behaving unpredictably.
- Don't set max to 1 or to a fractional number; the maximum must be a whole number greater than 1, and it directly determines how many radio inputs are rendered.
- Don't combine a step of 0.5 with a large max such as 10, because half steps double the number of radio inputs and arrow-key navigation becomes tedious.
- Don't use Rating as a decorative, read-only display of an aggregate score, because every item is a focusable radio input and screen reader users will encounter an operable form control that looks static.
- Don't rely on the color prop to carry meaning; it only offers three hues (neutral, brand, and marigold) and no thresholds, so any state distinction must also be expressed in text.
- Don't assign the same name to two ratings that should be independent, because they will merge into one radio group and selecting in one will clear the other.
- Don't drop to the small size in touch-first layouts; the icons themselves are the pointer targets, so shrinking them hurts accuracy.

## Anti-Patterns

### Read-only averages rendered as a Rating

❌ An average score such as 4.2 shown with a Rating looks static but is actually a group of focusable radio inputs, so keyboard and screen reader users encounter an operable form control that appears to be plain content and can accidentally change it.

✅ Render display-only icons (or a text score with a small icon) when the value must not be edited, and reserve Rating for moments when the user is genuinely choosing a score.

### Bare numeric accessible names

❌ Leaving itemLabel at its default makes each radio announce only a number, with no indication of the maximum, the direction of the scale, or what the rating is about, which fails the intent of descriptive labelling.

✅ Pass an itemLabel that returns meaningful strings, for example 1 star through 5 stars or anchored words such as Poor and Excellent, and place visible text nearby that names what is being rated.

### Controlled value that is never updated

❌ Passing value without writing the change back into state, or passing value and defaultValue together, leaves the rating visually stuck even though focus moves, and it makes the component behave unpredictably when the parent re-renders.

✅ Use value plus onChange that stores the reported value, or drop value entirely and use defaultValue for a self-managed rating; never mix the two.

### Half steps on a long scale

❌ Combining a step of 0.5 with a max of 10 renders twenty radio inputs, so keyboard users must press an arrow key up to nineteen times to reach the top, and the row becomes visually cluttered.

✅ Keep the scale short when half steps are needed, typically 5 items, or keep the full step of 1 when a longer scale is required.

### Sharing one name across independent ratings

❌ Two ratings that should be judged separately but share the same name merge into a single radio group, so choosing a value in one silently clears the other.

✅ Give each rating its own unique name, or omit name entirely and let the component generate a per-instance group name.

### Encoding meaning only in color

❌ The color prop offers only neutral, brand, and marigold tones, so using it to signal good or bad scores conveys nothing to users who cannot distinguish the hues and is not announced by assistive technology.

✅ Express meaning in text, for example a label such as Average or Excellent beside the rating, and treat color as decoration only.

## Accessibility

**Requirements**: Rating must satisfy the standard requirements for a grouped single-choice control: WCAG 1.3.1 for structure and relationships, 2.1.1 for full keyboard operability, 2.4.6 for descriptive labels, 4.1.2 for name, role, and value, and 2.5.8 for target size (the default extra-large size gives the most comfortable targets, and small should be avoided on touch devices). WCAG 1.4.1 also applies because the filled versus outline distinction must not be the only carrier of meaning: if a score threshold matters, state it in text. Filled icons are graphical objects, so they must meet WCAG 1.4.11 non-text contrast of at least 3:1 against the surrounding surface in every theme, including high contrast, where the tokens resolve to system colors. Because each item is a radio input, the group needs an accessible name that describes what is being rated; the component supplies only per-item names through itemLabel, so external visible text or a labelling relationship on the surrounding element is required for full context.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the rating group and lands on the selected radio input, or on the first input when no value is selected; the whole group occupies a single tab stop. |
| `Shift+Tab` | Moves focus out of the rating group back to the previously focused element. |
| `ArrowRight` | Moves to the next rating item and selects it, updating the value because selection follows focus in a radio group. |
| `ArrowDown` | Moves to the next rating item and selects it, behaving identically to ArrowRight. |
| `ArrowLeft` | Moves to the previous rating item and selects it, lowering the value by one step. |
| `ArrowUp` | Moves to the previous rating item and selects it, behaving identically to ArrowLeft. |
| `Space` | Selects the focused rating item if it is not already selected; within an established group this usually results in no change since arrow navigation already selected it. |
| `Enter` | Does not change the rating; inside a form it submits the form, matching native radio behavior, so never rely on Enter to confirm a score. |
| `Home / End` | In several browsers these move focus to the first or last item of the radio group as browser-level behavior for native radios; do not depend on them for value changes in your design. |

**ARIA**: aria-label — generated for each internal radio input by the itemLabel function; its default is the bare number, so override it for meaningful announcements, role of radio and its checked state — exposed implicitly by the internal native radio inputs, so no explicit ARIA is required from the consumer, the name attribute — groups the internal radios into a single group so only one item is in the tab order and only one can be checked, aria-labelledby or a labelled surrounding region on a wrapper element — the recommended way to give the group as a whole a visible name, since the component renders only icons

**Screen Reader**: Because Rating is built from native radio inputs, screen readers announce each position as a radio button with its checked or unchecked state and the label produced by itemLabel. Navigation follows focus, so pressing an arrow key both moves and selects, and the announcement updates immediately with the newly checked item and its label. The icon shape and fill count convey nothing to a screen reader, which means any meaning carried only by the number of filled icons must also exist in the itemLabel text. With the default itemLabel, users hear a raw number with no indication of the maximum or of which direction is better, and they receive no announcement of the scale length unless the group itself is labelled by visible text or a surrounding description.

## Styling

The only exported slot is root, which is a single container holding every rating item, so most customization happens by targeting the root with makeStyles and className. Use spacing tokens such as tokens.spacingHorizontalXS and tokens.spacingHorizontalSNudge to tune the gap between items, and tokens.colorTransparentBackground plus a hover token such as tokens.colorSubtleBackgroundHover or tokens.colorNeutralBackground1Hover if you add a hover surface behind each item. Focus visuals come from tokens.colorStrokeFocus2 and tokens.colorStrokeFocus1; keep an inset ring on the root or on each item so the focus indicator is never clipped. The color prop maps to theme foreground tokens rather than hard-coded hex values, so if you need a custom hue, build it through a theme rather than overriding color directly. The size prop drives the icon size through font-size and line-height tokens (tokens.fontSizeBase200 for small through tokens.fontSizeBase600 for extra-large), which means custom icons passed to iconFilled and iconOutline should be sized in em units and use currentColor so they inherit both the size and the color treatment. If you enlarge the hit area, do it with padding on the root rather than by scaling the icons unevenly, and keep any borderRadius you add at or below tokens.borderRadiusMedium so the focus ring geometry stays consistent with other Fluent controls.

## Performance

Each rating item costs a radio input plus an icon, so the DOM size grows linearly with max and doubles when step is 0.5; keep max small and avoid large scales in dense layouts. Ratings are frequently repeated many times, for example one per product Card or Table row, so prefer uncontrolled defaultValue so that a change re-renders only the touched instance instead of the whole list; when the parent needs the score, memoize the row component and update only the changed item. Pass a stable function reference to itemLabel, either defined at module scope or wrapped in useCallback, so aria-labels are not recomputed and the inputs keep referentially stable props on every render. Custom icon components should be lightweight and memoized, since they render once per item and re-render with each value change. There is no virtualization or measurement logic in the component, so interaction cost is dominated by the number of rendered items rather than by any internal work.

## Theming & Tokens

The color prop resolves entirely through theme tokens, which is why neutral, brand, and marigold adapt correctly in light, dark, and high contrast themes applied by the Fluent provider. Neutral selections use neutral foreground tokens such as tokens.colorNeutralForeground1 for filled items and a lighter neutral such as tokens.colorNeutralForeground3 for outline items, with tokens.colorNeutralForegroundDisabled available for subdued treatments. The brand option draws on tokens.colorBrandForeground1 and its interaction variants such as tokens.colorCompoundBrandForeground1, while the marigold option draws from the marigold palette foreground family. Size is expressed with typography tokens ranging from tokens.fontSizeBase200 for small to tokens.fontSizeBase600 for extra-large, so scaling the theme's type ramp also scales the icons. Focus and hover feedback uses tokens.colorStrokeFocus2 and tokens.colorStrokeFocus1 for the ring and hover tokens such as tokens.colorSubtleBackgroundHover for the surface, while spacing between items comes from tokens.spacingHorizontalXS and tokens.spacingHorizontalSNudge. Switching a custom brand ramp or high contrast theme through the provider re-colors the filled icons automatically because no hard-coded colors are baked into the component.

## Migration Notes

Rating is a v9 component with no counterpart in the older v8 @fluentui/react-components surface, so code moving from the Fabric-era office-ui-fabric-react Rating needs a prop-level rewrite rather than a simple import swap. The single rating value becomes value for controlled usage or defaultValue for uncontrolled usage, and the change callback becomes onChange, whose second argument carries the new value in its value field. Scale configuration stays on max, but the old label-formatting function is now itemLabel and should return strings such as 1 star or 5 stars. Icon customization moves from a single icon prop to the paired iconFilled and iconOutline props, which must be supplied together to keep selected and unselected states distinguishable. Theming moves from style or theme props to design tokens resolved through the FluentProvider, and the color prop replaces ad-hoc palette overrides for the supported neutral, brand, and marigold treatments.

## Edge Cases

- max must be a whole number greater than 1; passing 1 or a fractional value does not produce a valid single-item scale.
- The filled state is applied to every item whose value is less than or equal to the current rating, so a value that does not land on a step boundary (for example 3.3 with step 1) still fills the items below it and rounds the visible score in unexpected ways.
- There is no built-in clear affordance; clearing means programmatically setting a controlled value to 0, as the controlled example does with a separate Button, and 0 renders an entirely outline row.
- Omitting name lets the component generate a group name per instance, which keeps separate ratings independent, but passing the same name to two ratings merges them into one radio group where only one selection can exist.
- An itemLabel that returns an empty string or a meaningless token removes the accessible name from the radio inputs, leaving screen reader users with unlabeled controls.
- Half-step mode doubles the number of radio inputs, so the arrow-key distance from the lowest to the highest score doubles as well; this is easy to overlook when max is already large.
- Custom icons supplied through iconFilled and iconOutline must be visually distinct as a pair and sized in em units; icons with fixed pixel sizes ignore the size prop and break the row's rhythm.

## See Also

- - [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
