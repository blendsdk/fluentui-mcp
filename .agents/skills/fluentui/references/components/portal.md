# Portal

> **Package**: `@fluentui/react-portal` v9.8.13
> **Import**: `import { Portal } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

Portal is a utility component that renders its children into a different position in the DOM than the component that declared them. It accepts only two props: children, the React nodes to place, and mountNode, the element that receives them. Portal renders no DOM element of its own, so React simply creates the children under the chosen target while the React tree stays exactly the same. When mountNode is omitted, Portal creates a fresh, completely unstyled element on document.body and appends the children there, which is what lets portaled content escape overflow hidden, clipping ancestors, transforms, and stacking contexts. Because the component ships no styles, no slots, and no ARIA behavior of its own, it is best understood as plumbing: it is the mechanism that Dialog, Popover, Menu, Tooltip, TeachingPopover, and Toast build on to float surfaces above the rest of the page. Any overlay semantics you need on top of it - focus management, dismissal, positioning, layering - must come from the content you put inside it or from a higher-level component that already composes it.

**When to use**: Use Portal when a piece of UI must visually escape its parent container, for example when an ancestor has overflow hidden, a transform, a filter, or a stacking context that would clip or hide the content, or when you need to render into a specific host such as an application-level overlay root, a print container, or a third-party widget's DOM. It is also the right primitive when you are building your own overlay and need a mount target outside the clipped subtree. For everyday overlay work, prefer the components that already compose Portal. Dialog, Popover, Tooltip, Menu, TeachingPopover, and Toast use Portal internally and add the focus management, Escape dismissal, positioning, and ARIA semantics that Portal deliberately omits. Do not use Portal for ordinary page content that should stay in normal flow, and do not reach for it merely as a z-index or layering fix: Portal does not style, position, or layer anything.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `any` | — | No | React children |
| `mountNode` | `HTMLElement \| { element?: HTMLElement \| null; className?: string; } \| null \| undefined` | `a new element on document.body without any styling` | No | Where the portal children are mounted on DOM |

### Prop Guidance

- **children**: The React nodes React places at the mount target. Portal adds no wrapper element, no styles, and no attributes around them, so whatever you pass is exactly what appears at the target and must handle its own layout, surface styling, and accessibility semantics. Keep the subtree small and self-contained, because anything that depends on inheriting layout or styles from the original parent will look wrong. Rendering nothing, or conditionally rendering the Portal itself, removes the content from the DOM entirely, which is how overlay surfaces hide. `a custom overlay surface, or nothing while the overlay is closed`
- **mountNode**: Controls where the children land. Omit it to get the default of a fresh, unstyled element appended to document.body, the simplest way to escape a clipping or stacking context. Pass an HTMLElement when the content must render inside a specific host, such as an application-level overlay root, a print container, or a node that lives inside the FluentProvider subtree so theme variables keep applying. Pass the object form, with element selecting the target and className applied to the element Portal creates at that target, when you need a styling hook on the created node. Null or undefined falls back to the default behavior. Keep the value referentially stable across renders by capturing an element with a ref and storing it in state rather than constructing a new one during render, and gate the Portal until it is available. `an element captured with a ref and held in state, or the default document.body mount`

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { ToggleButton, makeStyles, tokens, Portal, typographyStyles } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  const styles = useStyles();

  const [mountNode, setMountNode] = React.useState<HTMLElement | null>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.clippingContainer}>
          <span>Clipping parent container</span>

          {open && mountNode && (
            <Portal mountNode={mountNode}>
              <div className={styles.portalContent}>Portal content</div>
            </Portal>
          )}
        </div>

        <div className={styles.controls}>
          <ToggleButton checked={open} onClick={() => setOpen(!open)}>
            Toggle portal
          </ToggleButton>

          <code className={styles.state}>{JSON.stringify({ open }, null, 2)}</code>
        </div>
      </div>

      <div ref={setMountNode} />
    </>
  );
};
```

## Best Practices

### Do's

- Prefer components that already compose Portal - Dialog, Popover, Menu, Tooltip, TeachingPopover, Toast - unless you specifically need a raw mount target, because they add focus trapping, Escape dismissal, positioning, and ARIA semantics on top of the DOM move.
- Capture the mount target with a ref and hold it in state, or accept the default document.body node, so the same element is reused on every render instead of being recreated.
- Guard the render on the mount node being available; the Default story only renders the Portal when the toggle is open and the ref-held mount node is non-null, which avoids portaling into a null target on the first pass.
- Keep the mount target inside the FluentProvider's DOM subtree, or hoist the provider to the application root, so portaled children continue to receive the theme's CSS custom properties after they leave the React parent.
- Give the portaled content its own accessible name and role, and manage focus deliberately - move focus into the surface when it opens and restore it to the trigger when it closes - because Portal does not touch focus.
- Declare the Portal close to its trigger in the React tree so context and React synthetic event bubbling continue to work between them.
- Use the object form of mountNode with a className when you need a styling hook on the element Portal creates at the target, and keep that hook limited to structural rules such as position, size, or isolation.

### Don'ts

- Don't build dialogs, popovers, menus, or tooltips out of raw Portal alone; you would have to reimplement focus trapping, Escape handling, aria-modal, scroll behavior, and dismissal that the library components already provide.
- Don't create a new mount element in render or pass a fresh mountNode object literal on every render; the changing identity forces the portaled subtree to be torn down and recreated, dropping focus and internal state.
- Don't assume Portal styles, positions, or layers its children - it contributes no CSS, no z-index, and no positioning behavior whatsoever.
- Don't rely on DOM ancestry for styling or events after portaling; ancestor selectors, sibling selectors, inherited layout, and native listeners attached above the trigger no longer apply to the portaled content.
- Don't portal content that should stay in normal reading order or that depends on its parent's layout, such as inline validation messages, help text, or anything that must scroll with its trigger.
- Don't pass a mountNode that can be removed from the DOM while the Portal is still mounted; the React tree stays intact while the visible content silently disappears with its host.
- Don't leave a portaled overlay open after its trigger is removed, hidden, or scrolled out of view without giving the user a way to dismiss the surface.

## Anti-Patterns

### Rebuilding dialog behavior with raw Portal

❌ Portal only relocates DOM. Using it alone for modal overlays leaves you without focus trapping, Escape dismissal, aria-modal, background hiding, or focus restoration, so keyboard and screen reader users end up either stranded on the trigger or tabbing behind the overlay.

✅ Use Dialog, Popover, Menu, Tooltip, TeachingPopover, or Toast, which compose Portal internally and add those semantics, and reserve raw Portal for bespoke cases where you supply the behavior yourself.

### Unstable mountNode identity

❌ Creating the mount element during render, or passing a new object literal as mountNode on every render, changes the target's identity. Portal tears down and recreates the subtree, which can drop focus, reset state inside the portaled content, and cause visible flicker.

✅ Capture the element with a ref callback and store it in state, or use the default document.body target, and pass the identical mountNode value on every render.

### Treating Portal as a layering or positioning fix

❌ Portal contributes no CSS, no stacking order, and no placement logic, so content portaled to escape overflow hidden often ends up off screen, beneath other layers, or disconnected from the trigger it was supposed to annotate.

✅ Combine the portal target with explicit styling, including a z-index token such as tokens.zIndexPopupBase on the overlay element, and use Positioning or a component such as Popover when the surface must track a trigger.

### Depending on ancestor CSS or DOM events after portaling

❌ Once children move to a different DOM parent, ancestor selectors, sibling selectors, inherited layout, CSS containment, and native listeners attached above the trigger stop applying, so styling and interactions that previously worked break silently.

✅ Style portaled content with its own classes built from tokens, attach any needed native listeners to the portaled content itself, and remember that only React context and React synthetic events continue to flow through the React tree.

### Portaling content that belongs in the flow

❌ Portaling inline help, validation messages, or layout-dependent content removes it from the parent's layout and places it far from its trigger in the accessibility tree, which breaks visual association and reading order.

✅ Keep in-flow content in place and reserve Portal for surfaces that genuinely float: overlays, menus, tooltips, toasts, and other custom layers.

## Accessibility

**Requirements**: Portal has no accessibility behavior of its own: it renders no element, sets no role, and adds no ARIA attributes, so everything portaled must satisfy WCAG on its own. The primary risks are WCAG 2.4.3 Focus Order and 1.3.2 Meaningful Sequence, because moving content to another part of the DOM changes where it sits in the accessibility tree relative to its trigger, plus WCAG 4.1.2 Name, Role, Value, because the portaled surface must expose its own semantics. Portal never moves focus, so any portaled surface that behaves modally needs a focus trap, an initial focus target chosen by the caller, and focus restoration to the trigger on dismissal. Modal content must also hide the rest of the page from assistive technology with aria-hidden or inert, and should carry role dialog, aria-modal set to true, and an accessible name. Decorative layers such as scrims should be aria-hidden. Status content such as a custom toast needs a live region role and aria-live so the insertion is announced at all.

| Key | Action |
| --- | --- |
| `Tab` | Portal does not intercept Tab. Focus moves through the portaled content in DOM order at the mount target, which may not match the visual or React tree order, so a focus trap or tab sequence has to be provided by the content or a composing component. |
| `Shift+Tab` | Moves focus backwards through the document, again following DOM order at the mount target rather than the React parent; a trap is required if the portaled surface is meant to be modal. |
| `Escape` | Not handled by Portal. A custom surface placed in a Portal must listen for Escape and dismiss itself, unless you use Dialog, Popover, Menu, or Tooltip, which already handle it. |
| `Enter` | Not handled by Portal; activation of any control rendered inside the portal is the responsibility of that control. |
| `Space` | Not handled by Portal; buttons and other widgets inside the portaled content handle their own activation. |

**ARIA**: role, aria-label, aria-labelledby, aria-describedby, aria-modal, aria-hidden, aria-live, id

**Screen Reader**: Assistive technology reads portaled content according to its position in the DOM, not its position in the React tree, so a surface mounted at the end of document.body is encountered at that point in the reading order unless you intervene. Because Portal does not move focus, a screen reader user remains on the trigger until focus is explicitly sent into the portaled content, and virtual cursor navigation follows document order at the mount target. Nothing is announced simply because content appeared in a portal - it is ordinary content in the accessibility tree. For modal surfaces, hide the rest of the page with aria-hidden or inert, give the surface role dialog with aria-modal set to true and an accessible name, and restore focus to the trigger on close. For non-modal status content such as toasts, use a live region role with aria-live so the announcement happens even though the content was inserted far from the trigger.

## Styling

Portal renders no DOM element, so there is no className or style prop to target and no slots to style; the only hooks are the children you pass and, when you use the object form of mountNode, the className applied to the element Portal creates at the target. Style the portaled children with makeStyles and mergeClasses so the surface matches the rest of the app, and use theme tokens rather than literal values: tokens.colorNeutralBackground1 with tokens.shadow16 and tokens.borderRadiusMedium for a floating surface, tokens.colorNeutralForeground1 for its text, tokens.spacingVerticalM and tokens.spacingHorizontalM for padding, tokens.colorNeutralStroke1 for borders, and tokens.colorStrokeFocus2 for a visible focus ring. Because the content is no longer clipped by its parent, you are responsible for keeping it within the viewport and for any maximum width or height constraints. To lift the surface above the page, apply a z-index from a theme token such as tokens.zIndexPopupBase to the overlay element itself, and reserve the mount node's className for structural rules like position, size, or isolation. Shared typography helpers such as typographyStyles.body1 can be applied to portaled children exactly as in the Default story.

## Performance

Portal is a thin wrapper around React's portal mechanism and is itself cheap, but it does create and remove DOM. With the default mountNode an unstyled element is created on document.body and the children are mounted into it; when the children become null the content unmounts. Re-rendering a Portal does not shield its children from work: they are ordinary React children and re-render whenever the declaring parent re-renders, unless you memoize them, so a portal is not an isolation boundary for rendering. The most common performance and correctness problem is an unstable mountNode, because a new element or object literal each render makes the subtree churn, triggering layout work and losing focus and component state. Prefer unmounting the Portal entirely when the overlay is closed instead of keeping it mounted and hidden, and avoid stacking many portals with heavy subtrees, since each one adds nodes to the mount target and increases style recalculation and layout cost there.

## Theming & Tokens

Portal has no stylesheet and consumes no theme tokens itself, because it renders nothing - there is no themed element and no generated class involved. Themability is inherited from wherever the children land. FluentProvider exposes the theme through CSS custom properties scoped to the provider element, so portaled children that land inside the provider's DOM subtree automatically pick up tokens such as tokens.colorNeutralBackground1, tokens.colorNeutralForeground1, tokens.shadow16, tokens.borderRadiusMedium, tokens.spacingVerticalM, and tokens.spacingHorizontalM. Children portaled outside that subtree - the default document.body element when the provider is nested deeper in the app - fall back to default token values, which is a frequent cause of overlays that do not match a custom brand theme. Fix it by rendering the provider at the application root, by supplying a mountNode inside the provider subtree, or by putting the necessary token-based styles on the mount node's className via the object form. Theme switching between light, dark, and high contrast works for portaled children for the same reason: as long as they render under the provider and use tokens instead of literal values, they re-theme automatically. typographyStyles and other shared style helpers apply to portaled children normally.

## Migration Notes

In Fluent UI React v8, Portal was a class-style component that also accepted className, styles, and theme props and worked alongside Layer to manage layering and re-apply the theme higher up the stack. In v9 those styling props are gone: Portal renders no DOM of its own, so there is nothing to attach a class to. The replacement for the Layer-era behavior is twofold - hoist FluentProvider so its theme variables cover the portal target or mount inside the themed subtree, and apply a z-index token such as tokens.zIndexPopupBase to the overlay element yourself. The mountNode prop is also broader than before: in addition to an HTMLElement it accepts an object with an element field for the target and a className field for the element Portal creates, which is the supported way to add a styling hook to the created node. Any v8 code that depended on Layer, or on Portal's own styling props, should generally migrate to the higher-level v9 components such as Dialog, Popover, Menu, and Tooltip, which manage layering, focus, and dismissal for you.

## Edge Cases

- A mount node captured with a ref is null during the first render, so the Portal must be gated on both the visibility state and the mount node existing, exactly as the Default story does with its open and mountNode checks.
- Portal needs a real DOM target and cannot produce markup during server rendering, so content that only exists in a portal differs between the server and client trees; keep portals out of the initial render to avoid hydration mismatches.
- The default mount node is an unstyled element on document.body: it is not clipped and not themed by a nested FluentProvider, and it participates in the body's layout and stacking context, so overlay sizing and layering are entirely your responsibility.
- React context and React synthetic events continue to flow through the React tree even though the DOM moved, but native DOM listeners attached to ancestors of the trigger and CSS selectors based on ancestry do not.
- Unmounting a Portal removes the children from the target but does nothing about focus, scroll position, or state kept outside the portal; restore focus to the trigger yourself or use a component that handles it.
- Replacing the mountNode value while the Portal is mounted recreates the portaled DOM, and if the new target is not attached to the document the content becomes invisible even though it is still mounted in React.
- Portaling into a target that is later removed from the DOM, such as a page section that unmounts, leaves the React tree intact while the rendered content disappears; keep the target's lifetime at least as long as the Portal's.

## See Also

- - [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
