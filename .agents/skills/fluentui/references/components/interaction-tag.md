# InteractionTag

> **Package**: `@fluentui/react-tags` v9.9.1
> **Import**: `import { InteractionTag } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

InteractionTag is an interactive, compact label that represents an entity, attribute, or user-supplied value that people can act on. Unlike the purely presentational Tag, an InteractionTag is composed of a required primary action (InteractionTagPrimary) and an optional secondary action (InteractionTagSecondary), so a single chip can carry both a main interaction — such as opening a popover with details or applying a filter — and a supplementary one, most commonly dismiss or remove. It exposes three appearances (filled, outline, brand), two shapes (round and circular), three sizes (medium, small, extra-small), plus selected and disabled states, and it accepts a value so the tag can be identified uniquely when it participates in a TagGroup collection. Because the tag renders real interactive elements, it is the correct building block for dismissible filter chips, entity chips with drill-in actions, and any tag whose surface must respond to pointer or keyboard input.

**When to use**: Use InteractionTag whenever the chip itself must be clickable or dismissible: filter chips that toggle criteria, entity chips that open a Popover with more detail, or removable items in a collection where a secondary action deletes the tag. Reach for it with TagGroup when a set of tags must be managed as a collection and dismissed through the group's onDismiss handler. Choose the simpler Tag instead when the label is decorative and nothing happens on click, choose Badge or CounterBadge when the element only communicates status or a count, and choose TagPicker when users need to type, search, or pick values to create tags rather than act on tags that already exist. For a standalone on/off control with a label, ToggleButton is usually more appropriate than a selected InteractionTag.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `TagAppearance \| undefined` | `'filled'` | No | An InteractionTag can have filled, outlined or brand experience. |
| `disabled` | `boolean \| undefined` | `false` | No | An InteractionTag can show that it cannot be interacted with. |
| `selected` | `boolean \| undefined` | `false` | No | An InteractionTag can be selected. Note: This prop only changes the appearance of the tag at the moment. A future PR will add the integration with TagGroup. |
| `shape` | `TagShape \| undefined` | `'round'` | No | An InteractionTag can have rounded or circular shape. |
| `size` | `TagSize \| undefined` | `'medium'` | No | An InteractionTag has three sizes. |
| `value` | `Value \| undefined` | — | No | Unique value identifying the tag within a TagGroup |

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement, InteractionTagProps } from '@fluentui/react-components';
import { InteractionTag, InteractionTagPrimary } from '@fluentui/react-components';

export const Default = (props: Partial<InteractionTagProps>): JSXElement => (
  <InteractionTag {...props}>
    <InteractionTagPrimary>Primary text</InteractionTagPrimary>
  </InteractionTag>
);
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { InteractionTag, InteractionTagPrimary, InteractionTagSecondary, makeStyles } from '@fluentui/react-components';
import { bundleIcon, CalendarMonthFilled, CalendarMonthRegular } from '@fluentui/react-icons';

export const Appearance = (): JSXElement => {
  const styles = useContainerStyles();
  return (
    <div className={styles.container}>
      <InteractionTag>
        <InteractionTagPrimary icon={<CalendarMonth />} hasSecondaryAction>
          filled
        </InteractionTagPrimary>
        <InteractionTagSecondary aria-label="remove" />
      </InteractionTag>
      <InteractionTag appearance="outline">
        <InteractionTagPrimary icon={<CalendarMonth />} hasSecondaryAction>
          outline
        </InteractionTagPrimary>
        <InteractionTagSecondary aria-label="remove" />
      </InteractionTag>
      <InteractionTag appearance="brand">
        <InteractionTagPrimary icon={<CalendarMonth />} hasSecondaryAction>
          brand
        </InteractionTagPrimary>
        <InteractionTagSecondary aria-label="remove" />
      </InteractionTag>
    </div>
  );
};

Appearance.storyName = 'Appearance';
Appearance.parameters = {
  docs: {
    description: {
      story: 'An InteractionTag can have a `filled`, `outline` or `brand` appearance. The default is `filled`.',
    },
  },
};
```

### Disabled

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { InteractionTag, InteractionTagPrimary, InteractionTagSecondary, makeStyles } from '@fluentui/react-components';
import { CalendarMonthRegular } from '@fluentui/react-icons';

export const Disabled = (): JSXElement => {
  const styles = useContainerStyles();
  return (
    <div className={styles.container}>
      <InteractionTag disabled>
        <InteractionTagPrimary secondaryText="appearance=filled" icon={<CalendarMonthRegular />} hasSecondaryAction>
          Disabled
        </InteractionTagPrimary>
        <InteractionTagSecondary aria-label="remove" />
      </InteractionTag>
      <InteractionTag disabled appearance="outline">
        <InteractionTagPrimary secondaryText="appearance=outline" icon={<CalendarMonthRegular />} hasSecondaryAction>
          Disabled
        </InteractionTagPrimary>
        <InteractionTagSecondary aria-label="remove" />
      </InteractionTag>
      <InteractionTag disabled appearance="brand">
        <InteractionTagPrimary secondaryText="appearance=brand" icon={<CalendarMonthRegular />} hasSecondaryAction>
          Disabled
        </InteractionTagPrimary>
        <InteractionTagSecondary aria-label="remove" />
      </InteractionTag>
    </div>
  );
};
```

## Best Practices

### Do's

- Render exactly one InteractionTagPrimary as the tag's content and give it concise, meaningful primary text, because that text supplies the tag's accessible name.
- Add InteractionTagSecondary only when there is a genuine secondary action such as dismiss or remove, and set hasSecondaryAction on InteractionTagPrimary so the primary reserves layout space for the secondary control.
- Give every InteractionTagSecondary an accessible name (the examples use aria-label with values like remove or dismiss), since the secondary action renders an icon with no visible text.
- Provide a stable, unique value on each InteractionTag when it lives inside a TagGroup so onDismiss can tell which tag was removed from the collection.
- Drive removal through the TagGroup onDismiss handler so the rendered collection and your state stay in sync, rather than mutating individual tags in isolation.
- Express visual variation with the appearance, shape, and size props instead of overriding those same attributes with custom styles.
- When the primary action should reveal more content, wrap the primary tag in a Popover (and a Tooltip for the secondary action) as shown in the primary-action example, keeping the extra content inside PopoverSurface.
- Move focus deliberately whenever a tag removes itself — to the next tag, the previous tag, or a stable fallback control such as a reset button — so keyboard users are never stranded on a removed element.

### Don'ts

- Do not use InteractionTag for labels that are never clicked; use Tag for static, non-interactive chips.
- Do not nest another interactive control such as Link or Button inside InteractionTagPrimary, because nested interactive elements break semantics and keyboard behavior — put that content in a PopoverSurface instead.
- Do not treat the selected prop as selection management: today it only changes the tag's appearance and is not yet integrated with TagGroup, so selection state must be owned by your application.
- Do not leave InteractionTagSecondary unlabeled; an icon-only button without an accessible name is announced as an unlabeled button.
- Do not add InteractionTagSecondary without setting hasSecondaryAction on the primary, or the primary action will not lay out correctly alongside the secondary control.
- Do not use the disabled prop to hide tags that simply should not exist in the collection; render only the tags the user can act on and reserve disabled for genuinely temporarily unavailable tags.
- Do not apply brand appearance to every tag in a list; brand is for emphasis and loses meaning when it becomes the default.
- Do not remove the last visible tag without planning focus recovery, since the element that had focus disappears from the DOM.

## Accessibility

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
