# Rating

> **Package**: `@fluentui/react-rating` v9.4.2
> **Import**: `import { Rating } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

Rating is an input component that lets someone express a score by picking one of a row of selectable icons, which are stars by default. Under the hood each item is a native radio input, so a Rating behaves like a single-choice group: the current selection is submitted with a form, announced to assistive technology, and changed with the keyboard. The scale is configurable through max (default 5, and it must be a whole number greater than 1), whole or half-point precision through step (1 by default, 0.5 for half-filled shapes), four icon sizes through size (small, medium, large, or the default extra-large), and three color treatments through color (neutral by default, plus brand and marigold). Rating can be uncontrolled with defaultValue or fully controlled with value and onChange, and its glyphs can be swapped by supplying component references to iconFilled and iconOutline. A single root slot carries the rendered items, so layout and spacing are applied to the component's root element.

**When to use**: Use Rating when the person interacting with the UI needs to supply a subjective score: product reviews, satisfaction surveys, feedback after a support interaction, prioritizing backlog items, or rating a piece of media. Use it when the score is genuinely an input that you intend to collect, submit, or react to through onChange. If you only need to show an already-computed score such as an average review value, use RatingDisplay instead, because it is read-only and does not invite interaction. If the value the person must enter is numeric but not a fixed small scale, or needs precision finer than half a point, choose Slider, SpinButton, or Select rather than stretching Rating past its model. Rating is also a poor fit for scales with more than roughly ten options, since every option becomes another radio input to traverse.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `color` | `"brand" \| "marigold" \| "neutral" \| undefined` | `neutral` | No | Controls the color of the Rating. |
| `defaultValue` | `number \| undefined` | — | No | Default value of the Rating |
| `iconFilled` | `React.ElementType<any, keyof React.JSX.IntrinsicElements> \| undefined` | — | No | The icon to display when the rating value is greater than or equal to the item's value. |
| `iconOutline` | `React.ElementType<any, keyof React.JSX.IntrinsicElements> \| undefined` | — | No | The icon to display when the rating value is less than the item's value. |
| `itemLabel` | `((rating: number) => string) \| undefined` | `(rating) =\> `${rating}`` | No | Prop to generate the aria-label for the rating inputs. |
| `max` | `number \| undefined` | `5` | No | The max value of the rating. This controls the number of rating items displayed. Must be a whole number greater than 1. |
| `name` | `string \| undefined` | — | No | Name for the Radio inputs. If not provided, one will be automatically generated |
| `onChange` | `EventHandler<RatingOnChangeEventData> \| undefined` | — | No | Callback when the rating value is changed by the user. |
| `size` | `"small" \| "medium" \| "large" \| "extra-large" \| undefined` | `extra-large` | No | Sets the size of the Rating items. |
| `step` | `0.5 \| 1 \| undefined` | `1` | No | Sets the precision to allow half-filled shapes in Rating |
| `value` | `number \| undefined` | — | No | The value of the rating |

### Prop Guidance

- **color**: Controls the color of the filled items. Use the neutral default for general-purpose ratings, brand when the score should adopt the app's brand color, and marigold when the rating should read like a favorite or highlight, as the Color story demonstrates. `marigold`
- **defaultValue**: Sets the uncontrolled starting value. Use it when you do not need to mirror every change in state; you can still observe changes through onChange. Do not pass it alongside value on the same instance, and keep it inside the 0 to max range and on the step grid. `3`
- **iconFilled**: Swaps the glyph shown for items whose value is less than or equal to the current rating. Pass a stable component reference, such as an icon imported from the icon package, and pair it with iconOutline so both states stay readable. `CircleFilled`
- **iconOutline**: Swaps the glyph shown for items whose value is greater than the current rating, in other words the unfilled counterpart of iconFilled. Choose a shape whose filled and outline forms are clearly different at the size being used. `CircleRegular`
- **itemLabel**: A function that receives the numeric rating for an option and returns the accessible name for that input. The default returns the bare number, which gives a screen reader user no scale context, so override it whenever the rating is not self-explanatory and localize the resulting string. With step set to 0.5 the function is also called for half values. `A formatter producing text such as 3 out of 5 stars`
- **max**: The top of the scale and the number of rating items rendered; it defaults to 5. It must be a whole number greater than 1. Raise it to 10 only when the scale genuinely calls for it, since each option is another interactive radio input and another keyboard stop. `10`
- **name**: The name applied to the underlying radio inputs, which is what groups them into one mutually exclusive set. If you omit it a name is generated for you; pass an explicit name when you need it for form submission or testing, and make sure it is unique per Rating on the page. `product-rating`
- **onChange**: Fires when a person changes the rating through the radio inputs and receives both the event and rating data carrying the new value. Use it to keep controlled value state in sync or to persist the score; remember that clearing produces a value of 0. `Store the new value from the rating data on every change`
- **step**: Sets the precision of the scale. The default of 1 exposes only whole items, while 0.5 allows half-filled shapes so intermediate values such as 3.5 can be shown, as in the Step story. No other value is supported. `0.5`
- **size**: Sets the size of the rating items to small, medium, large, or the default extra-large. Match it to the surrounding density: small fits inline inside cards and table cells, while large and extra-large suit survey or hero contexts where the rating is the focus. `small`
- **value**: The controlled value of the rating. Combine it with onChange for a fully controlled component, and set it to 0 to clear every filled item, the approach used by the Clear Rating button in the ControlledValue story. Keep it within 0 to max and aligned to the step grid. `4`

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

- Give every Rating on a page its own name when several ratings can appear together; the name groups the underlying radio inputs, and sharing one value links ratings that should be independent.
- Always supply itemLabel when the bare number would be meaningless on its own, formatting it with scale context such as 3 out of 5 stars so the group is understandable when read aloud.
- Use value together with onChange for controlled ratings, and treat a value of 0 as the way to clear the rating, the technique the ControlledValue story uses for its Clear Rating button.
- Choose step 0.5 only when half-point precision is meaningful for the data you collect; otherwise keep the default of 1 so each selection is unambiguous.
- Keep max small and human-parsable, such as 5 or 10, and always a whole number greater than 1, because every item renders an interactive radio input.
- Pass both iconFilled and iconOutline when customizing the glyphs, as the Shape story does with the circle and square icon pairs, so the chosen and unchosen states remain visually distinct.
- Pair the Rating with a visible Label or supporting Text that says what is being rated and what the ends of the scale mean, so the icons are not the only source of meaning.
- Pick color deliberately: neutral for general use, brand when the rating should read as part of the product chrome, and marigold when the score connotes favorites or highlights.

### Don'ts

- Don't mix value and defaultValue on the same instance; decide between controlled and uncontrolled and stay there.
- Don't pass a fractional max or a max of 1 or below, since the prop contract requires a whole number greater than 1.
- Don't set step to anything other than 0.5 or 1; there is no support for quarter steps or arbitrary precision.
- Don't use Rating to display a read-only aggregate score such as an average review value, because it is announced and behaves as an editable radio group; use RatingDisplay for that.
- Don't rely on color alone to communicate the score, since the filled versus outline state and the accessible label are what actually carry the meaning.
- Don't substitute iconFilled and iconOutline with two glyphs that look nearly identical at the small size, because the selected state becomes impossible to scan.
- Don't feed the component a defaultValue above max, a negative value, or a value that falls between step increments, since none of those states can be represented cleanly.
- Don't stack several unlabeled ratings in a tight list without visible or accessible context; repeated identical radio groups are hard to tell apart with a screen reader.

## Anti-Patterns

### Leaving the default numeric accessible name in place

❌ The default itemLabel formatter returns just the number, so a screen reader user arrowing through the group hears unexplained digits such as 3 or 4 with no indication of the scale or what is being rated.

✅ Pass itemLabel with a formatter that includes scale context and localizes the wording, for example text that reads like 3 out of 5 stars, so each option is self-describing when announced.

### Sharing one name across multiple ratings

❌ The name prop groups the underlying radio inputs. If two Rating instances on the same page use the same explicit name, they behave as one radio group, so selecting a value in one clears the other.

✅ Give every Rating a unique name when you set one explicitly, or omit name entirely and let the component generate one per instance.

### Using Rating to show a read-only score

❌ Rating is an editable radio group, so rendering an average or already-known score with it announces and behaves like an input, invites pointless interaction, and fires change handling that serves no purpose.

✅ Use RatingDisplay for scores that are only meant to be read, and reserve Rating for situations where the person must supply the score.

### Blowing up the scale with a large max

❌ Every step of the scale becomes a separate radio input in the DOM and a separate stop in keyboard traversal, so a max of 50 or 100 makes the group unwieldy and slow to operate.

✅ Keep max within a small range such as 5 or 10, and switch to Slider, SpinButton, or Select when the value being collected is a wide numeric range rather than a small set of levels.

### Defining custom icons inline during render

❌ Passing a component that is created inside the render function to iconFilled or iconOutline yields a new component identity on every render, forcing each item's glyph to unmount and remount and potentially dropping focus.

✅ Reference icons defined at module scope, such as those imported from the icon package, so their identity is stable across renders.

## Accessibility

**Requirements**: Rating follows the radio group pattern, so it must satisfy WCAG 4.1.2 Name, Role, Value: every selectable option needs an accessible name, which comes from itemLabel, and the current selection must be programmatically determinable, which the native radio inputs provide. Provide context for the scale itself, since a row of five values with no visible label fails 1.3.1 and 3.3.2 for people who cannot infer what is being rated. Do not encode the score in color alone (1.4.1) and make sure the focus indicator is visible on the item that has focus (2.4.7), including in high contrast themes. Consider target size (2.5.8) when using the small size, and add padding or a surrounding Label when the hit areas are tight.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the rating group; the currently selected item, or the first item when nothing is selected, receives focus. |
| `Shift+Tab` | Moves focus out of the rating group to the previous focusable element. |
| `Arrow Right / Arrow Down` | Moves focus to and selects the next rating item, raising the value. |
| `Arrow Left / Arrow Up` | Moves focus to and selects the previous rating item, lowering the value. |
| `Space` | Selects the rating item that currently has focus, consistent with the radio input the item is built on. |

**ARIA**: aria-label on each rating input, generated from the itemLabel function, name, which groups the rating inputs into a single radio group and determines which ratings are mutually exclusive, the native radio role exposed by each item's input element, the checked state of each item, managed by the native radio inputs rather than by hand-written aria-checked attributes

**Screen Reader**: The rating is encountered as a group of radio buttons whose option count reflects the scale: max options for whole-step ratings, and additional intermediate options when step is 0.5. As focus moves through the group, the selected option is announced with whatever text itemLabel returns, so with the default formatter a screen reader user hears only a bare number. Because the filled and outline icons are decorative, they contribute nothing to the announcement; the accessible name is entirely determined by itemLabel, and the change in value is reported through the normal radio change event when onChange fires.

## Styling

Rating exposes a single root slot, so a className or style passed to the component lands on the root element, and the stories use a makeStyles-styled wrapper div to lay out several ratings in a row. Use tokens.spacingHorizontalXS or tokens.spacingHorizontalS for the gap between a Rating and an adjacent control such as a Button, and tokens.spacingVerticalS or tokens.spacingVerticalM when stacking multiple ratings. The color prop already resolves to theme foreground tokens, so prefer switching color over hard-coding colors in styles. Item size is driven by the theme's type ramp, so fine-tune with fontSizeBase* tokens applied on the root rather than targeting internals, and keep the focus indicator intact, since it draws on the shared focus tokens such as tokens.colorStrokeFocus2 and tokens.strokeWidthThick. When you need a custom container, wrap the Rating in a surface styled with tokens.colorNeutralBackground1 and tokens.borderRadiusMedium instead of trying to restyle internal elements, which are not part of the public API.

## Performance

Rating renders a small, fixed number of hidden radio inputs equal to the scale, so the DOM cost is negligible: max options for whole steps and additional intermediate options when step is 0.5. The meaningful cost is the icons, which means iconFilled and iconOutline should be stable module-level component references rather than components created during render. itemLabel is invoked per option on each render, so keep it a cheap pure function or memoize it when the parent re-renders frequently, as happens in large forms. Because every option is focusable, a large max multiplies both the rendered nodes and the keyboard traversal length, so keep the scale modest. The component itself holds no expensive derived state, so re-renders are driven almost entirely by changes to value or defaultValue in the parent.

## Theming & Tokens

The color prop is the main theme lever: neutral resolves through the neutral foreground ramp, brand through tokens.colorBrandForeground1 and its companions so the filled items follow the brand ramp set on FluentProvider, and marigold through the marigold foreground tokens for a favorite-style highlight. Because all three resolve through tokens, dark theme, high contrast themes, and custom brand ramps update the Rating automatically. Unfilled items and surrounding surfaces come from neutral tokens such as tokens.colorNeutralForeground2, tokens.colorNeutralForeground3, and tokens.colorNeutralBackground1, and the item glyph sizing follows the shared type ramp used by other Fluent components, so themes that redefine fontSizeBase* and lineHeightBase* proportions change the Rating as well. Focus indication uses the shared focus tokens, notably tokens.colorStrokeFocus2 together with tokens.strokeWidthThick, which is why the focus ring stays correct across themes without extra styling.

## Migration Notes

Rating is a v9 addition with no direct counterpart in Fluent UI React v8, so most migration work replaces bespoke star implementations rather than a library component. When porting one, map the old star count to max, the old display precision to step, and the current score to value with onChange, or to defaultValue if the rating can stay uncontrolled. Move any score that was only ever displayed, never edited, to RatingDisplay. Re-derive accessible labels through itemLabel instead of leaving hard-coded aria-labels on wrapper elements, because Rating now owns the underlying radio inputs and the name that groups them.

## Edge Cases

- max must be a whole number greater than 1. Values of 1, 0, or 2.5 fall outside the documented contract, so validate any max that comes from configuration or user data before wiring it to the component.
- Values that do not land on the step grid cannot be represented as a clean fill state: with step 1 a value of 3.7 has no matching configuration, and with step 0.5 neither does 2.3. Round incoming data to the nearest valid step.
- A value of 0 is how you express not rated. It clears every filled item, exactly as the Clear Rating button does in the ControlledValue story, so do not treat 0 as a one-star rating.
- Passing a defaultValue above max or a negative value produces a state the item rendering cannot express; clamp any server-provided or persisted score before handing it to the component.
- When step is 0.5 the number of selectable options grows for the same max, which lengthens keyboard traversal and means itemLabel is called with half values, so the formatter has to produce sensible text for them.
- Because the name prop defines one radio group, two ratings rendered together with the same explicit name are linked: choosing a value in the second clears the first.
- Custom icons must be supplied as pairs. Passing only iconFilled leaves the unselected items on their default glyph, and the resulting mixture of shapes can look like a rendering bug rather than a deliberate style.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
