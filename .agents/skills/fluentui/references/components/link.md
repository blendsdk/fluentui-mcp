# Link

> **Package**: `@fluentui/react-link` v9.8.2
> **Import**: `import { Link } from '@fluentui/react-components';`
> **Category**: navigation
> **Stability**: stable

## Overview

Link is the Fluent UI React v9 component for rendering navigational hyperlinks and link-styled text actions. Its root slot is polymorphic: when an href is supplied the component renders an anchor element, and when href is omitted it renders a button, so the same visual treatment is available for both true navigation and in-page actions. It also supports being rendered as a span (with the button role applied) for cases where a link must flow and wrap like ordinary inline text. Beyond the element type, Link exposes a small, focused API surface — appearance, disabled, disabledFocusable, and inline — that covers visual emphasis, inactive states, and inline-text context. Its styling is token-driven, so it automatically tracks the active FluentProvider theme, including dark and high-contrast themes.

**When to use**: Use Link for navigation that moves the user to another page, document, route, or section of content, and for inline references inside paragraphs, list items, and helper text. Use the inline prop whenever the link sits inside a run of body text so it takes on the expected brand link color and text underline, and use appearance="subtle" when the link is part of a dense or secondary surface where the default link emphasis would be too strong. Choose Button instead when the interaction performs an action on the current page (submitting, opening a dialog, toggling state) rather than navigating; choose BreadcrumbButton, Tab, NavItem, or MenuItemLink when the destination belongs to a navigation structure that already provides its own semantics. If your application uses a client-side router, prefer rendering Link with the router's own component so navigation does not trigger a full page reload.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"default" \| "subtle" \| undefined` | `'default'` | No | A link can appear either with its default style or subtle. If not specified, the link appears with its default styling. |
| `disabled` | `boolean \| undefined` | `false` | No | Whether the link is disabled. |
| `disabledFocusable` | `boolean \| undefined` | `false` | No | When set, allows the link to be focusable even when it has been disabled. This is used in scenarios where it is important to keep a consistent tab order for screen reader and keyboard users. |
| `inline` | `boolean \| undefined` | `false` | No | If true, changes styling when the link is being used alongside other text content. |

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | Root of the component that renders as either an <a> or a <button> tag. |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Link } from '@fluentui/react-components';
import type { LinkProps } from '@fluentui/react-components';

export const Default = (props: LinkProps & { as?: 'a' }): JSXElement => (
  <Link href="https://www.bing.com" {...props}>
    This is a link
  </Link>
);
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Link } from '@fluentui/react-components';

export const Appearance = (): JSXElement => (
  <Link appearance="subtle" href="https://www.bing.com">
    Subtle link
  </Link>
);
```

### AsButton

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Link } from '@fluentui/react-components';

export const AsButton = (): JSXElement => <Link>Render as a button</Link>;

AsButton.parameters = {
  docs: {
    description: {
      story: ['When the `href` property is not provided, the component is rendered as an html `<button>`'].join('\n'),
    },
  },
};
```

## Best Practices

### Do's

- Provide an href whenever the interaction navigates, so the root renders as a real anchor and gets native link semantics such as middle-click, copy link address, and open in new tab.
- Set inline when the link is embedded within a sentence, paragraph, or other text content so it receives the inline brand link styling and wraps correctly between lines.
- Use appearance="subtle" for secondary or low-emphasis destinations inside dense surfaces, and leave appearance at its default for primary links that stand alone.
- Pair disabled with an explanation elsewhere on the page when a destination is temporarily unavailable, rather than leaving the user with a link that silently does nothing.
- Use disabledFocusable when keeping a consistent tab order matters for keyboard and screen reader users, and the disabled link is important context for the surrounding UI.
- Render the link as a span (with the inline prop) when it must break across lines inside flowing text, since anchor and button roots are laid out as inline-block and will not wrap the same way.
- Give icon-only or ambiguous links a clear accessible name with aria-label, and make the visible text descriptive enough to be understood out of context by screen reader users.

### Don'ts

- Don't attach a click handler to a link that performs a non-navigational action — that is a button's job, and the wrong role confuses assistive technology and keyboard users.
- Don't place a Link inside another interactive element or nest interactive content inside a Link, since nested interactive elements produce invalid, unpredictable focus behavior.
- Don't use a disabled link as the only way to communicate that a destination is unavailable; the state is conveyed as an attribute rather than visually obvious to everyone.
- Don't use appearance="subtle" for primary calls to action, because the reduced emphasis makes the most important destination the least noticeable on the page.
- Don't drop the inline prop when embedding a link in a paragraph of text, as the link will not adopt the inline color and underline treatment the surrounding text expects.
- Don't rely on the link color alone to signal interactivity — keep the underline or another non-color affordance so users with color vision deficiencies can identify it.
- Don't use Link as a stand-in for a router-aware navigation component without forwarding the router's link element through the root slot, or client-side navigation will degrade into full page reloads.

## Accessibility

## See Also

- [navigation category](../categories/navigation.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
