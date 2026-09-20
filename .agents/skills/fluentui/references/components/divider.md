# Divider

> **Package**: `@fluentui/react-divider` v9.7.2
> **Import**: `import { Divider } from '@fluentui/react-components';`
> **Category**: layout
> **Stability**: stable

## Overview

Divider is a layout component that visually separates groups of content with a thin horizontal or vertical rule. It can render as a bare line, or it can wrap a short text label between two line segments to create a labelled separator (for example an 'or' between two actions, or a section caption). The component supports four preset appearances - default, subtle, strong, and brand - three content alignments (start, center, and end), an inset option that pads the line away from the edges of its container, and a vertical orientation for separating items that sit side by side. Internally it renders through the Fluent slot system as a root element plus an optional wrapper around the children, so the line and the label can be styled independently with Griffel classes. Divider is purely visual and non-interactive: it holds no state, exposes no focusable element, and relies entirely on the surrounding layout and theme tokens for its appearance.

**When to use**: Use Divider when two blocks of content need a lightweight visual boundary that is part of the page structure rather than a container: between sections of a form, between a page header and its body, between menu or toolbar groups, or between two actions where a labelled separator clarifies the relationship (such as 'or' between a primary flow and a secondary one). Use the vertical orientation when items are laid out in a row and need a visual break between them, and use inset when the divider sits inside an already padded surface such as a Card, Drawer body, or Dialog body so the rule does not touch the container edges. Prefer layout spacing tokens, Card borders, or a full-width Divider between major page regions instead when the boundary is really about grouping or elevation. Avoid Divider where content should be collapsed, grouped, or scrolled independently - Accordion, Card, or a heading hierarchy communicates that structure better and in a way assistive technology can also perceive.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `alignContent` | `"start" \| "center" \| "end" \| undefined` | `'center'` | No | Determines the alignment of the content within the divider. |
| `appearance` | `"brand" \| "default" \| "strong" \| "subtle" \| undefined` | `'default'` | No | A divider can have one of the preset appearances. When not specified, the divider has its default appearance. |
| `inset` | `boolean \| undefined` | `false` | No | Adds padding to the beginning and end of the divider. |
| `vertical` | `boolean \| undefined` | `false` | No | A divider can be horizontal (default) or vertical. |

### Prop Guidance

- **children**: Optional content rendered inside the wrapper slot between two line segments. Use it for a short label that clarifies the separation, such as an alternative-action cue. With no children the divider renders as a bare rule with no wrapper element. Keep labels to a few words so the surrounding line segments stay visible. `or`
- **alignContent**: Positions the label along the length of the divider. Defaults to center, which is right for symmetric breaks. Use start when the label should align with left-aligned content that follows it, and end when the divider terminates a block or the surrounding layout is right-aligned. The prop has no visible effect when no children are provided. `start`
- **appearance**: Selects the preset visual treatment of the rule. Leave it unset (default) for ordinary structural separations, use subtle in dense or already bordered surfaces such as toolbars, table headers, and card interiors, use strong for a deliberate break that should stand out within dense content, and use brand when the separation should adopt the product accent color. Prefer this prop over custom line colors so the divider continues to follow the theme and high contrast mode. `subtle`
- **inset**: Adds padding at the beginning and end of the divider's own axis so the rule does not touch the edges of its container. Use it when the divider sits inside a padded surface such as a Card, Drawer body, or Dialog body so the rule aligns with the text block. On a vertical divider the padding applies along the vertical axis (top and bottom), not left and right. `inset`
- **vertical**: Switches the divider from horizontal to vertical so it can separate items arranged in a row. A vertical divider has no intrinsic height, so give it one - typically by placing it in a flex row and setting height to 100 percent, or by setting an explicit height through className. Combine with alignContent only when the divider also carries a label. `vertical`
- **className**: Applied to the root slot and the primary way to customize the divider's geometry, line color, and line style in v9. Use it for explicit widths, heights, custom border styles, or token-based overrides that the appearance prop cannot express. Because the root is the line element, className is the right hook for anything that affects the rule itself. `styles.customDivider`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | Root of the component that renders as a `<div>` tag. |
| `wrapper` | — | Yes | Wrapper for content when presented. |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, tokens, Divider } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <div className={styles.example}>
        <Divider />
      </div>
      <div className={styles.example}>
        <Divider>Text</Divider>
      </div>
    </div>
  );
};
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, tokens, Divider } from '@fluentui/react-components';

export const Appearance = (): JSXElement => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <div className={styles.example}>
        <Divider>(default)</Divider>
      </div>
      <div className={styles.example}>
        <Divider appearance="subtle">subtle</Divider>
      </div>
      <div className={styles.example}>
        <Divider appearance="brand">brand</Divider>
      </div>
      <div className={styles.example}>
        <Divider appearance="strong">strong</Divider>
      </div>
    </div>
  );
};

Appearance.parameters = {
  docs: {
    description: {
      story:
        'A divider can have a `brand`, `subtle`, or `strong` appearance.' +
        ' When not specified, it has its default experience.',
    },
  },
};
```

### AlignContent

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, tokens, Divider } from '@fluentui/react-components';

export const AlignContent = (): JSXElement => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <div className={styles.example}>
        <Divider alignContent="start">start</Divider>
      </div>
      <div className={styles.example}>
        <Divider alignContent="center">center (default)</Divider>
      </div>
      <div className={styles.example}>
        <Divider alignContent="end">end</Divider>
      </div>
      <div className={styles.example}>
        <Divider alignContent="start" vertical>
          start
        </Divider>
      </div>
      <div className={styles.example}>
        <Divider alignContent="center" vertical>
          center (default)
        </Divider>
      </div>
      <div className={styles.example}>
        <Divider alignContent="end" vertical>
          end
        </Divider>
      </div>
    </div>
  );
};

AlignContent.parameters = {
  docs: {
    description: {
      story:
        'The label associated with the divider can be aligned at the `start`, `center`, or `end` of the divider line.',
    },
  },
};
```

## Best Practices

### Do's

- Pick the appearance that matches the visual hierarchy of the boundary: strong for a deliberate break inside dense content, default for ordinary section breaks, subtle for dividers inside already busy surfaces such as toolbars or table headers, and brand when the separation should carry the product accent color.
- Supply an explicit height for a vertical divider, typically by placing it in a flex container and setting the height to 100%, or by styling the root through className, since a vertical divider in a block-level flow has no intrinsic height.
- Give a divider a short label as its child only when the label adds meaning to the break, such as distinguishing two alternative action flows, and keep that label to a few words so the line segments on either side remain visible.
- Use alignContent to place the label where it reads most naturally: start for left-to-right reading flows that continue into the content below, center for symmetric breaks, and end when the divider visually terminates a block.
- Use inset when the divider lives inside a container that already has padding, so the rule aligns with the padded content instead of being clipped against the container's border.
- Let the surrounding layout own spacing by putting the divider inside a flex or grid container and controlling gaps with spacing tokens, so the rule moves with the content when density or direction changes.
- Style the line and the label through the root and wrapper slots via className overrides with theme tokens, keeping the appearance prop for semantic color choices and className only for geometry and typography.

### Don'ts

- Do not place a vertical divider in a plain block container and expect it to be visible; without a resolved height it collapses and looks like a missing element.
- Do not use Divider as the only signal that content is organized into sections - a visual rule is not exposed as structure by assistive technology, so pair it with headings or landmark elements when the grouping matters.
- Do not use Divider to add breathing room between elements; it draws a visible line, whereas spacing tokens such as tokens.spacingVerticalM or tokens.spacingHorizontalL add room without introducing an extra rule and an extra DOM node.
- Do not hardcode colors or widths on the divider line; hardcoded values break theme switching, high contrast mode, and brand theming that the appearance prop already handles.
- Do not make a divider interactive by attaching click handlers or focus behavior to it - it is not focusable and will only produce confusing, empty tab stops for keyboard and screen reader users.
- Do not place a divider directly inside table or list markup where the root div would break the required child structure of those elements; place the rule between those structures instead.
- Do not stack a divider immediately against another border, such as the edge of a Card or a table header, because the doubled line reads as a rendering defect; choose one boundary mechanism.
- Do not set alignContent when the divider has no children, because there is no label whose position could change.

## Anti-Patterns

### Collapsed vertical divider

❌ A vertical divider placed directly in a block-level container has no content-driven height, so it renders at zero height and appears to be missing, which leads developers to add arbitrary pixel heights or remove the divider entirely.

✅ Place the divider inside a flex row whose items stretch, and give the divider a height of 100 percent so it matches the tallest sibling, or set an explicit height in a Griffel class on the root when the layout is not flex-based.

### Using a labelled divider as a section heading

❌ Content such as a section title placed as the divider's child is announced as ordinary text, not as a heading, so screen reader users cannot navigate to it or understand the page outline, even though the visual layout suggests hierarchy.

✅ Render the section title as a real heading (Text with a heading role or an appropriate heading element) and use Divider only for the visual rule, either on its own or alongside the heading.

### Overriding line colors with hardcoded values

❌ Setting a literal color or width on the divider bypasses appearance and the theme, so the rule stops responding to theme switching, brand changes, and high contrast or forced-colors modes, often becoming invisible against the background.

✅ Choose the appearance that matches the required emphasis, and when a custom color is genuinely needed, override the border color with theme tokens such as tokens.colorNeutralStroke2 or tokens.colorBrandStroke1 in a Griffel class.

### Divider used as a spacing device

❌ Adding dividers purely to push elements apart introduces visible lines where none were intended, adds DOM nodes and layout work, and creates a boundary that does not respond to the surrounding density or spacing scale.

✅ Control separation with spacing tokens such as tokens.spacingVerticalM, tokens.spacingVerticalL, or a flex gap on the parent, and reserve Divider for cases where a visible rule actually communicates a boundary.

### Expecting inset to pad horizontally on a vertical divider

❌ Inset pads the divider along its own axis, so a vertical divider with inset gets top and bottom padding instead of the left and right breathing room the author expected, producing a rule that appears shortened at both ends.

✅ Use inset for horizontal dividers inside padded containers, and for vertical dividers apply spacing tokens on the parent container instead when horizontal clearance is needed.

### Making the divider interactive

❌ Attaching click handlers, tabIndex, or other interactive behavior to a divider conflicts with its non-interactive contract, producing empty tab stops and elements that screen readers cannot meaningfully describe.

✅ Keep Divider purely presentational and place the interactive control - a Button, Link, or menu item - next to it so focus order and announcements stay predictable.

## Accessibility

**Requirements**: Divider is decorative by default and renders a plain div through the root slot, so it contributes no accessible name, role, or state unless you add them yourself. All information conveyed by a divider must also be conveyed structurally, which means using headings, fieldsets, lists, or landmark elements for actual grouping and treating the rule as a visual enhancement only. Any visible label rendered as the divider's child must meet WCAG text contrast requirements (4.5:1 for normal text, 3:1 for large text), and the line itself must remain perceivable without relying on color alone - the default and subtle appearances use neutral stroke tokens, while the brand appearance uses the brand stroke token, all of which adapt to high contrast and forced-colors settings through the theme. When a divider is used inside a component that already exposes semantics, such as Accordion panels or menu groups, do not add a redundant separator role.

| Key | Action |
| --- | --- |
| `None` | Divider is not focusable and defines no keyboard interaction. Focus must move from the element before it directly to the element after it, so never add tabIndex or key handlers to a divider. |

**ARIA**: role="separator" (optional; apply to the root only when the boundary must be exposed to assistive technology rather than being decorative), aria-orientation (set to vertical when role separator is used on a vertical divider, since the separator role defaults to horizontal), aria-hidden="true" (appropriate for purely decorative rules that add no information), aria-label or aria-labelledby (use only when a separator is exposed and needs a meaningful name; the visible child text is not automatically used as its accessible name), lang and dir are inherited from the surrounding document and should not be overridden on the divider itself

**Screen Reader**: Because the root is a generic div, screen readers typically ignore the divider entirely and users navigate straight from the preceding content to the following content, which is the desired behavior for a decorative rule. If you expose it with the separator role, screen readers announce it as a separator and may add a pause in reading order, so reserve that for cases where the boundary genuinely carries meaning. Text passed as the divider's child becomes ordinary text in the reading order and is announced in sequence with surrounding content, which means a label such as 'or' will be read between the two adjacent elements - make sure that reads naturally.

## Styling

Target the root slot with className to change the line and the overall footprint, and target the wrapper slot when the label typography or padding needs to differ from the default. Geometry is the most common customization: set an explicit width for a horizontal divider (for example 200 pixels) and an explicit height for a vertical one so it stretches to the intended length, and rely on the parent's flex alignment rather than fixed pixel heights where possible. Line color and weight should come from theme tokens - tokens.colorNeutralStroke1, tokens.colorNeutralStroke2, and tokens.colorNeutralStroke3 for the neutral appearances, tokens.colorBrandStroke1 for the brand appearance, or tokens.colorPaletteRedBorder2 when a custom semantic color is genuinely required - combined with tokens.strokeWidthThin, tokens.strokeWidthThick, or tokens.strokeWidthThicker for weight. Dashed or dotted rules are produced by overriding the border style and width on the root, using shorthands when you want a single declaration for all sides. Label styling uses typography tokens such as tokens.fontSizeBase200, tokens.fontSizeBase300, tokens.fontWeightSemibold, tokens.fontFamilyBase, and tokens.colorNeutralForeground2 or tokens.colorNeutralForeground3. Use inset rather than manual padding when the rule must clear the container edges, and combine inset with spacing tokens only when the default inset distance does not match the surrounding rhythm. Because Griffel classes are atomic and merged in order, a className passed to the divider always wins over the component's internal appearance classes, so keep overriding rules focused on geometry and typography and leave color decisions to the appearance prop.

## Performance

Divider is one of the cheapest components in the library: it holds no state, registers no effects, attaches no event handlers, and renders either a single root div or a root plus a wrapper element. The only rendering cost beyond the DOM is style resolution, and because Griffel emits atomic CSS, every Divider sharing the same appearance, inset, and vertical combination across the application reuses the same generated classes. Keep makeStyles calls at module scope so the style cache is populated once rather than re-created on each render, and prefer the appearance prop over bespoke color classes to maximize class reuse. Avoid constructing inline style objects for every instance in large lists, since a new object identity each render forces style recalculation; a stable Griffel class is preferable. In very long lists or virtualized content, remember that each divider is an extra DOM node and an extra flex participant, so use it at section boundaries rather than between every item.

## Theming & Tokens

Divider derives everything from the Fluent theme supplied by FluentProvider. The four appearances map to stroke tokens rather than fixed colors: default and strong resolve to neutral stroke tokens such as tokens.colorNeutralStroke2 and tokens.colorNeutralStroke1, subtle resolves to a lighter neutral stroke such as tokens.colorNeutralStroke3, and brand resolves to tokens.colorBrandStroke1 with the matching brand foreground token for the label. Line thickness follows the stroke width tokens - tokens.strokeWidthThin, tokens.strokeWidthThick, and tokens.strokeWidthThicker - and inset padding derives from the horizontal and vertical spacing tokens. The label inherits the component font through tokens.fontFamilyBase and is sized with tokens.fontSizeBase200 or tokens.fontSizeBase300, with color taken from tokens.colorNeutralForeground2, tokens.colorNeutralForeground3, or the brand foreground token depending on appearance. Because all of these are theme tokens, switching between the web light, web dark, and Teams themes, or entering forced-colors and high contrast mode, updates every divider automatically without any component-level change. If an application overrides these tokens in a custom theme, dividers pick up the new values along with every other stroked component.

## Migration Notes

When migrating from Fluent UI React v8, the Divider loses its styles prop and the accompanying style-function approach. In v9 the same customizations are expressed as Griffel classes created with makeStyles and applied through className, with theme values taken from the tokens object instead of the theme object. The vertical, inset, and alignContent props carry over with the same intent, and appearance is now a literal union of default, subtle, strong, and brand rather than a free style override. Because the root renders a div and the label is wrapped by a dedicated wrapper slot, per-element overrides that previously targeted multiple style keys now map to styling the root through className for the line and the wrapper slot for the label. The styles prop and any theme-based class names from v8 are not part of the v9 API surface.

## Edge Cases

- A vertical divider has no intrinsic height: in a block container it renders collapsed and effectively invisible until the parent resolves a height and the divider is allowed to stretch to 100 percent.
- Inset applies padding along the divider's own axis, so an inset vertical divider gets top and bottom padding rather than the left and right padding many authors expect.
- alignContent has no visible effect when the divider has no children, because there is no wrapper content whose position could change.
- A divider placed in a flex row with centered cross-axis alignment shrinks to the height of the label text rather than the height of the row, which makes it look much shorter than intended next to taller siblings.
- The root renders a div, so embedding a divider inside structural markup such as a table row, list, or select-like layout can violate the expected child structure of those elements; place the rule between such structures instead.
- Long label text consumes the space the line segments occupy, so a divider with a verbose label can render with almost no visible rule on either side.
- Because the component adds no separator semantics by default, downstream tooling and tests that look for a separator role will not find one unless the role is applied explicitly on the root.

## See Also

- [layout category](../categories/layout.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
