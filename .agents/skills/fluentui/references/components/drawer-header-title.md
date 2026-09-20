# DrawerHeaderTitle

> **Package**: `@fluentui/react-drawer` v9.13.0
> **Import**: `import { DrawerHeaderTitle } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

DrawerHeaderTitle is the title element of a Drawer header. It renders a heading (an h2 by default, but configurable to h1 through h6 or a plain div) alongside an optional action area that is conventionally used for the drawer's close button. Because it is a composition primitive rather than a standalone surface, it is placed inside DrawerHeader and the wider Drawer, InlineDrawer, OverlayDrawer, or NavDrawer family. It exposes three slots: root, which is the flex container that holds the title and the action; heading, which is the text node that screen readers treat as the drawer's label when referenced; and action, which is the trailing region reserved for a dismiss control. The component carries no state of its own and simply forwards native props such as className, style, and id to the root slot, making it fully themeable and easy to target with Griffel styles.

**When to use**: Use DrawerHeaderTitle whenever a drawer needs a visible title bar — this includes navigation drawers, filter/settings panels, detail views, and form drawers. Pair it with DrawerHeader so the title sits inside the correct spacing and separator context, and supply the action slot when the drawer is dismissible (which is almost always for overlay drawers). Prefer DrawerHeaderTitle over hand-rolled headings or Text elements because it applies the correct heading typography, aligns the action region, and gives you a stable hook for aria-labelledby on the drawer surface. Do not use it as a generic page heading outside a drawer — use Text or a plain semantic heading for page-level titles. If the drawer header contains navigation links rather than a title, use DrawerHeaderNavigation instead of stuffing links into the title.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `action` | `Slot<'div'>` | — | No | — |
| `defaultOpen` | `boolean` | — | No | — |
| `heading` | `Slot<'h2', 'h1' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'div'>` | — | No | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'footer'>` | — | Yes | — |
| `root` | `Slot<'nav'>` | — | Yes | — |
| `root` | `Slot<'header'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `separator` | `boolean` | — | No | — |
| `type` | `'inline' \| 'overlay'` | — | No | — |

### Prop Guidance

- **root**: The container slot for the whole title row. It accepts className, style, id, and other div props. Use it to apply Griffel classes for padding, gap, or alignment overrides, or to attach an id that a drawer's aria-labelledby can reference. `className={styles.titleRow}`
- **heading**: The title text node. Defaults to h2, but can be h1 through h6 or a div. Choose the level so the drawer's outline nests correctly inside the page heading structure; if you choose div you must add role="heading" and aria-level yourself. `heading={{ as: 'h3', children: 'Filters' }}`
- **action**: Trailing region of the title row, intended for a single dismiss control. Render a subtle Button with a dismiss icon and an explicit aria-label so pointer and screen reader users can close the drawer. Keep exactly one primary control here. `action={<Button appearance="subtle" icon={<DismissRegular />} aria-label="Close" onClick={close} />}`
- **type**: Distinguishes the inline variant, which participates in the layout and pushes content, from the overlay variant, which floats above content and is normally paired with a close button in the action slot. Decide this at the drawer level so the header title's action affordances match user expectations. `overlay`
- **separator**: Controls whether a dividing line is drawn beneath the header region. Enable it when the drawer content scrolls and the title needs to stay visually distinct from the body; disable it for short, non-scrolling drawers where the extra rule adds noise. `true`
- **defaultOpen**: Sets the initial open state of the surrounding drawer. Use it for drawers that should be visible on first paint, such as persistent inline navigation, and let the open/onOpenChange pair take over afterward for controlled scenarios. `true`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `action` | — | No | Action slot for the close button |
| `heading` | — | No | By default this is a h2, but can be any heading or div. If `div` is provided do not forget to also provide proper `role="heading"` and `aria-level` attributes |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Place DrawerHeaderTitle inside DrawerHeader, which supplies the padding, alignment, and optional bottom separator for the title row.
- Always render a dismiss control in the action slot for overlay drawers so users have a pointer-driven way to close the surface.
- Give the icon-only close button in the action slot an explicit aria-label such as "Close" so assistive technology can announce it.
- Keep the title short and descriptive — it becomes the accessible name of the drawer when the drawer references it.
- Use the heading slot's default h2 unless your page's heading outline requires a different level, and step down consistently (h2 in an h1 page, h3 inside a section, and so on).
- Reference the title from the drawer surface or DrawerHeader via aria-labelledby so that the dialog or complementary landmark has a name.
- Forward a className or id to root when you need to target the title row with Griffel styles or anchor links.

### Don'ts

- Don't replace the heading slot with a bare div without also adding role="heading" and aria-level — the title will lose its heading semantics entirely.
- Don't put navigation links, tabs, or full menus in the action slot; it is sized and aligned for a single trailing control such as a close button.
- Don't render more than one DrawerHeaderTitle inside a single DrawerHeader — it produces duplicate headings and ambiguous accessible names.
- Don't hide the title visually with display:none while relying on it for aria-labelledby; the reference target should remain in the accessible tree.
- Don't rely solely on the action close button as the only escape route — make sure Escape and any overlay backdrop click behavior are also handled by the drawer.
- Don't use DrawerHeaderTitle outside of a Drawer context as a page banner; its typography and action alignment assume drawer chrome.

## Anti-Patterns

### Bare div used as the heading

❌ Overriding the heading slot with a plain div removes the implicit heading role, so screen reader users lose the navigation landmark and cannot jump to the drawer title.

✅ Either keep the default h2, choose a different heading level, or add role="heading" and aria-level to the div so the semantics are restored.

### Icon-only close button with no label

❌ The dismiss control in the action slot is usually a Button with only a dismiss icon. Without an aria-label it is announced as an unnamed button and is unusable for screen reader users.

✅ Always pass an aria-label such as "Close" to the button placed in the action slot, and consider a Tooltip for sighted mouse users.

### Navigation crammed into the title row

❌ Putting links, tabs, or menus in the action slot overloads a region designed for one trailing control, breaks alignment, and creates competing focus targets next to the heading.

✅ Keep the action slot to a single dismiss control and place navigation in DrawerHeaderNavigation or in the drawer body using Nav.

### Skipping the DrawerHeader wrapper

❌ Rendering DrawerHeaderTitle directly inside a drawer loses the header's spacing, alignment, and optional separator, which makes the title look detached from the drawer chrome and drift from theme spacing.

✅ Always nest DrawerHeaderTitle inside DrawerHeader so consistent padding and separator behavior are applied.

### Title as the sole escape route

❌ Treating the header close button as the only way to dismiss an overlay drawer fails keyboard and assistive technology users who expect Escape or a backdrop click to close it.

✅ Keep the action button as the visible affordance while also handling Escape and backdrop dismissal at the Drawer level, and avoid withholding a visible close control entirely.

## Accessibility

**Requirements**: The heading slot renders as an h2 by default, which satisfies the requirement that drawer surfaces expose a programmatic name and a logical heading. If you override the heading slot with a div, you must supply role="heading" and aria-level manually, because the div carries no implicit semantics. The action slot must contain an accessible, focusable control; when that control is icon-only it needs an aria-label. Overlay drawers should be labeled by this title (for example the drawer's aria-labelledby points at the heading's id), and the title should be the first meaningful text inside the drawer so screen reader users can orient themselves immediately. Title contrast must meet WCAG AA against the drawer background, which the default theme tokens already satisfy in light and dark themes.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the next focusable element inside the drawer, typically from the title region into the action close button or the drawer body content. |
| `Shift+Tab` | Moves focus backwards out of the drawer body and onto the action close button in the header title's action slot. |
| `Enter` | Activates the focused control in the action slot (for example the close button) when focus is on it. The heading itself is not interactive and takes no keyboard input. |
| `Space` | Activates the focused control in the action slot, matching standard button semantics for the dismiss action. |
| `Escape` | Closes an overlay drawer. Focus handling and dismissal are owned by the Drawer component, but the title's action button is the visible affordance for the same behavior. |

**ARIA**: role="heading" (only when the heading slot is overridden with a div), aria-level (required alongside role="heading" when using a div), aria-label (on an icon-only close button placed in the action slot), aria-labelledby (on the drawer surface, pointing at the heading slot's id), aria-hidden (avoid applying it to the heading if the drawer is labeled by this title)

**Screen Reader**: Screen readers encounter the heading slot as a first-level landmark within the drawer and announce its text and level, which lets users understand what the drawer contains without reading further. When the drawer surface points at the heading with aria-labelledby, that text is also announced as the name of the dialog or complementary region when the drawer opens. The action slot content is announced according to the control it contains, so an icon-only button without an aria-label is read as an unlabeled button — a common failure mode for this component.

## Styling

DrawerHeaderTitle is a flex root containing the heading and the action region, so most customization is done by targeting the root or the individual slots with makeStyles and mergeClasses from @fluentui/react-components. Set the title's weight and size through tokens.fontWeightSemibold and tokens.fontSizeBase500 or tokens.fontSizeBase600, and keep it legible with tokens.colorNeutralForeground1. Long titles should wrap rather than truncate; if you must truncate, use text-overflow on the heading slot and leave the action slot unsquished (flexShrink set to 0) so the close button never collapses. Control the gap between the heading and the action with tokens.spacingHorizontalM or tokens.spacingHorizontalXXL, and adjust the header block padding from DrawerHeader using tokens.spacingVerticalL and tokens.spacingHorizontalXXL. When a separator is desired under the title row, rely on DrawerHeader's separator styling driven by tokens.colorNeutralStroke1 and tokens.colorTransparentStroke rather than adding a border to this component directly. In dark or high-contrast themes the same semantic tokens remap automatically, so avoid hard-coded hex values.

## Performance

DrawerHeaderTitle is a lightweight, stateless component: it renders a flex container with a heading and an optional action region, so its render cost is negligible next to the drawer's portal, focus trap, and animation work. The practical performance concerns come from its children — creating a new inline element tree for the action on every render can force the button and its icon to re-render, so hoist the action element or memoize it when the drawer re-renders frequently (for example while resizing or animating). Define slot styles once with makeStyles at module scope instead of building style objects inside the component, and avoid passing new object literals to the heading or action slots on each render if you have memoized consumers. Because the title rarely changes, keeping it out of any parent state that updates on scroll or pointer movement avoids unnecessary reconciliation of the whole header row.

## Theming & Tokens

DrawerHeaderTitle inherits colors and typography from the nearest FluentProvider, so it responds automatically to light, dark, and high-contrast themes. The heading text picks up tokens.colorNeutralForeground1 by default, with secondary or muted titles achievable via tokens.colorNeutralForeground2 or tokens.colorNeutralForeground3. Size and weight come from tokens.fontSizeBase500/tokens.fontSizeBase600, tokens.lineHeightBase500, and tokens.fontWeightSemibold, so a theme's type ramp is respected rather than hard-coded. The action region inherits the same foreground and expects a subtle Button that uses tokens.colorNeutralForeground2 with hover states from tokens.colorNeutralBackground2Hover and pressed states from tokens.colorNeutralBackground2Pressed. Spacing between the heading and the action is expressed with tokens.spacingHorizontalM or tokens.spacingHorizontalXXL, and the header block padding comes from tokens.spacingVerticalL combined with tokens.spacingHorizontalXXL. Any separator rendered by the enclosing header uses tokens.colorNeutralStroke1, which resolves to transparent in the high-contrast theme through tokens.colorTransparentStroke fallbacks.

## Migration Notes

DrawerHeaderTitle has no direct equivalent in Fluent UI React v8, where drawers were built from Panel and header text was configured declaratively through props such as headerText and custom header renderers. In v9 you compose the header yourself: DrawerHeader wraps DrawerHeaderTitle, the heading slot carries the title text, and the action slot carries the dismiss button, which you own and wire up manually. This means the close button's accessible label, styling, and click behavior are your responsibility rather than being supplied by the component. The Drawer-level configuration props that shape the surrounding surface — whether the drawer is inline or overlay, whether the header draws a separator, and whether it starts open — are controlled on the parent rather than on the title itself.

## Edge Cases

- Very long titles: the heading wraps while the action region must stay fixed, so ensure the action control does not shrink or get pushed off-screen by setting flexShrink on the action slot.
- Heading level mismatches: the default h2 may conflict with an existing h1 page structure or an h3 section, producing a broken outline — override the heading slot to the correct level instead of leaving the default.
- Multiple header rows: combining DrawerHeaderTitle with DrawerHeaderNavigation or other header content in one DrawerHeader requires careful ordering, since only the title should be the labeled heading of the drawer.
- Missing action slot: without a close button, overlay drawers depend entirely on Escape or backdrop clicks, which is a usability trap for pointer users who cannot find a dismiss affordance.
- Localization: title text and the close button's aria-label both need translation, so bind them to the same resource strings used elsewhere in the app rather than hard-coding English.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
