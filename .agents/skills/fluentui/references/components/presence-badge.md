# PresenceBadge

> **Package**: `@fluentui/react-badge` v9.5.3
> **Import**: `import { PresenceBadge } from '@fluentui/react-components';`
> **Category**: data-display
> **Stability**: stable

## Overview

PresenceBadge is a small, non-interactive visual indicator that represents a person's availability or presence status in a product surface. It renders a color-filled glyph whose shape and color are determined by the status value (available, away, busy, do-not-disturb, offline, out-of-office, blocked, and unknown) and by whether the person is currently out of office. Because it carries meaning through both color and glyph shape, it is typically placed next to a person's name, avatar, or persona, and is often repeated in lists, rosters, chat headers, and people pickers. The component is purely presentational: it starts with a default status of available and a default outOfOffice value of false, and it supports multiple sizes (tiny, extra-small, small, medium, large, and extra-large, with medium as the default) so it can align with the avatar or text scale of the surrounding layout. It is imported as a named export from @fluentui/react-components.

**When to use**: Use PresenceBadge when you need to communicate a person's real-time or scheduled availability alongside their identity — for example next to a name in a chat header, inside a contact or people list, in an avatar in a meeting roster, or in a participant picker. Choose it over a generic Badge or CounterBadge because PresenceBadge encodes a semantically meaningful set of presence states with a consistent shape language (filled circle, clock glyph, dash, and so on) rather than arbitrary text or counts. Use the outOfOffice prop in addition to status whenever the person is away from their normal schedule, since the out-of-office treatment layers an additional visual variant on top of any base status. Do not use PresenceBadge for non-presence information such as notification counts, labels, or arbitrary statuses — use Badge or CounterBadge for those cases. Do not use it as the sole means of conveying availability in text-only contexts; pair it with visible or programmatically available text.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `outOfOffice` | `boolean \| undefined` | `false` | No | Modifies the display to indicate that the user is out of office. This can be combined with any status to display an out-of-office version of that status |
| `status` | `PresenceBadgeStatus \| undefined` | `available` | No | Represents several status |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { PresenceBadge } from '@fluentui/react-components';

export const Default = (): JSXElement => <PresenceBadge />;
```

### OutOfOffice

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { PresenceBadge } from '@fluentui/react-components';

export const OutOfOffice = (): JSXElement => {
  return (
    <>
      <PresenceBadge outOfOffice status="available" />
      <PresenceBadge outOfOffice status="away" />
      <PresenceBadge outOfOffice status="busy" />
      <PresenceBadge outOfOffice status="do-not-disturb" />
      <PresenceBadge outOfOffice status="offline" />
      <PresenceBadge outOfOffice status="out-of-office" />
      <PresenceBadge outOfOffice status="blocked" />
      <PresenceBadge outOfOffice status="unknown" />
    </>
  );
};

OutOfOffice.parameters = {
  docs: {
    description: {
      story:
        'A presence badge supports `available`, `away`, `busy`, `do-not-disturb`, ' +
        '`offline`, `out-of-office`, `blocked` and `unknown` status when `outOfOffice` is set.',
    },
  },
};
```

### Sizes

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { PresenceBadge } from '@fluentui/react-components';

export const Sizes = (): JSXElement => {
  return (
    <>
      <PresenceBadge size="tiny" />
      <PresenceBadge size="extra-small" />
      <PresenceBadge size="small" />
      <PresenceBadge size="medium" />
      <PresenceBadge size="large" />
      <PresenceBadge size="extra-large" />
    </>
  );
};

Sizes.parameters = {
  docs: {
    description: {
      story:
        'A presence badge supports `tiny`, `extra-small`, `small`, `medium`, and `extra-large` sizes.' +
        ' The default is `medium`.',
    },
  },
};
```

## Best Practices

### Do's

- Always decide and set an explicit status value rather than relying on the default, so the rendered meaning matches the real state of the person.
- Combine the outOfOffice prop with a status value (for example outOfOffice with status equal to busy) to render the out-of-office variant of that status instead of swapping the status out.
- Match PresenceBadge size to the surrounding identity element: use tiny or extra-small next to compact avatars, and medium or larger next to prominent names or profile headers.
- Provide a textual equivalent for the status (adjacent text, a tooltip on the containing identity element, or an accessible name on the parent control) because the badge itself renders no readable text.
- Render exactly one PresenceBadge per person so the presence signal stays unambiguous.
- Use the size prop, as shown in the sizes example, rather than overriding height and width with custom styles, so the badge stays proportional to avatars and text.
- Keep the badge adjacent to the person it describes — directly beside the name or overlaid on the avatar — so the association is visually obvious.

### Don'ts

- Don't reuse PresenceBadge as a general-purpose status indicator for objects, processes, or builds; use Badge or CounterBadge instead.
- Don't rely on color alone to communicate the status, since color-vision deficiencies and high-contrast modes can reduce the distinction between states.
- Don't assume the default available state is harmless — using the default when the true state is unknown misrepresents the person's availability; use the unknown status instead.
- Don't attach click handlers, tabIndex, or interactive roles expecting the badge to be a control; PresenceBadge is decorative and non-focusable.
- Don't override the glyph colors with ad-hoc values that break theme contrast; the palette tokens already change with the active theme.
- Don't stretch or override the badge dimensions with fixed pixel widths, which breaks alignment with the avatar and text sizes it is designed to match.
- Don't omit outOfOffice when a person is legitimately out of office but still reports a base status such as away or busy.

## Accessibility

## See Also

- [data-display category](../categories/data-display.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
