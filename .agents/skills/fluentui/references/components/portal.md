# Portal

> **Package**: `@fluentui/react-portal` v9.8.13
> **Import**: `import { Portal } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

Portal is a utility component that renders its children into a DOM node outside of the parent component's DOM hierarchy using React portals. It exists to solve layout and rendering problems that CSS alone cannot fix: escaping overflow clipping, transformed or filtered ancestors, and stacking contexts that would otherwise cut off or bury content such as overlays, popovers, and dialogs. By default, Portal lazily creates a new, completely unstyled element on document.body and mounts its children there, meaning Portal contributes no markup of its own (no wrapper div, no class names, no inline styles) beyond that mount node. You can redirect where the content lands by supplying the mountNode prop, either as an existing HTMLElement or as a descriptor object containing an element and/or a className that Portal applies to the element it creates. Because Portal is purely a mounting mechanism, it provides no positioning, no visual styling, no focus management, and no keyboard handling — every behavior beyond "render these children somewhere else in the DOM" is the responsibility of the content you place inside it or of higher-level components such as Dialog, Menu, Popover, and Tooltip, which already portal internally.

**When to use**: Use Portal when content must be visually detached from the DOM position where it is declared: for example, a floating panel declared inside a container that has overflow: hidden, a transformed ancestor, or a z-index stacking context that would clip or occlude it. It is also the right tool when content must sit at the end of the document for correct layering, such as full-page overlays, custom popovers, or third-party widget integrations. Reach for Portal directly only when no existing Fluent UI component already covers your scenario — Dialog, Menu, Popover, Tooltip, TeachingPopover, Toaster, and the various picker listboxes already render through a portal as part of their own implementation, so wrapping them in an extra Portal is unnecessary. Do not use Portal for ordinary flow content, for content that must stay in the layout or accessibility sequence of its parent, or as a substitute for CSS positioning strategies like position: sticky or a higher z-index.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | No | React children |
| `mountNode` | `HTMLElement \| { element?: HTMLElement \| null; className?: string; } \| null \| undefined` | `a new element on document.body without any styling` | No | Where the portal children are mounted on DOM |

### Prop Guidance

- **children**: The content to render into the mount node. Portal adds no markup, so the children are the entire visual and interactive surface — give them their own container element when you need positioning, background, or elevation, and render them conditionally from state so closing the portal unmounts everything. Because Portal behaves like any other component in the React tree, context (including theme providers above it) still flows to the children even though the DOM position changes, with the important exception of CSS custom properties that are applied by a class on an ancestor element. `A styled container with text content that is shown only while an open state is true.`
- **mountNode**: Controls where the children are mounted. Omit it to let Portal lazily create a new, unstyled element on document.body and remove it when the Portal unmounts — the right choice for typical overlay layering. Pass an HTMLElement when the content must live in a specific region of the page, such as a sibling of a container with overflow hidden, which is exactly what the Default story does with a ref callback. Pass the object form with element and/or className when you want Portal to create or target a node and simultaneously apply a class to it for your own styling. The value may be null or undefined, in which case the portal has nothing to render into, so guard rendering on the node being available when using a ref callback. `An element captured through a ref callback and passed directly, or an object supplying a className for the generated mount element.`

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

- Use Portal to escape ancestors with overflow clipping, transform, filter, or perspective, and to place content at the top of the stacking order without fighting z-index.
- Prefer a Fluent UI component that already portals (Dialog, Menu, Popover, Tooltip, TeachingPopover, Toaster) before hand-rolling a Portal with your own overlay semantics.
- Provide an explicit mountNode when the portaled content must live inside a particular region of the page — for example a ref to a sibling of the clipping container, as demonstrated by the ToggleButton-driven Default story.
- Use the object form of mountNode with a className when you want Portal to create the mount element for you but still target it with your own style rules.
- Guard the render on the availability of the mount node when you obtain it through a ref callback, rendering the Portal only once that node exists.
- Render Portal conditionally from React state (open/closed) so that unmounting the Portal removes its children cleanly from the DOM.
- Wrap portaled content in its own FluentProvider or apply THEME variables to the mount node when the portal target escapes the provider's DOM subtree.

### Don'ts

- Don't assume Portal renders a wrapper element you can select, style, or query — it only renders your children into the mount node.
- Don't point mountNode back into the same clipping container you are trying to escape; the content will be clipped in exactly the same way.
- Don't render a Portal for content that belongs in normal document flow, such as spacing-sensitive layout elements or inline text.
- Don't rely on the parent's CSS cascade for everything inside the Portal: inherited custom properties, container queries, and ancestor selectors stop at the mount boundary.
- Don't nest Portal inside another Portal, or wrap components that already portal internally, unless you have a specific reparenting requirement.
- Don't create a brand-new mount node on every render — pass a stable element reference so React does not tear down and recreate the portal container.
- Don't treat Portal as an accessibility feature: it does not manage focus, trap focus, label content, or handle Escape.

## Anti-Patterns

### Portaling content out of the FluentProvider theme subtree

❌ Portal children rendered on document.body are no longer descendants of the FluentProvider element, so theme custom properties applied by a class on that element do not cascade into the portaled content, and Fluent UI components inside the portal can render with missing or fallback values.

✅ Wrap portaled content in its own FluentProvider, or attach the theme classes/custom properties to the mount node you supply, so tokens resolve inside the portal as they do in the rest of the app.

### Using Portal instead of an existing overlay component

❌ Hand-building an overlay with Portal means re-implementing focus management, Escape handling, outside-click dismissal, aria-modal semantics, and layering that Dialog, Menu, Popover, Tooltip, and TeachingPopover already provide — usually with subtle accessibility bugs as a result.

✅ Start from the component that matches the intent (Dialog for modal flows, Popover for anchored non-modal surfaces, Menu for command lists, Tooltip for descriptions) and only fall back to raw Portal when no such component fits.

### Expecting a wrapper element to exist

❌ Portal renders no wrapper node, so CSS rules, querySelector calls, and test queries written against a portal wrapper class silently match nothing, and styles that were supposed to target the portal container never apply.

✅ Style your own child container with makeStyles, or supply the object form of mountNode with a className and target that class instead of assuming a Portal-owned element.

### Reparenting content on every render

❌ Passing a freshly created element or a new object literal as mountNode on each render gives the portal a different target each time, forcing React to unmount and remount the subtree, which destroys DOM state, restarts animations, and drops focus.

✅ Create the mount node once — a ref callback assigning to state, a memoized value, or the default generated node — and keep the reference stable across renders.

### Assuming Portal manages focus and dismissal

❌ Portal only relocates DOM nodes; if focus is not moved into the portaled content and no Escape handler or focus restoration exists, keyboard and screen reader users can be stranded at the trigger while visually the content appears on top of the page.

✅ Move focus into the container when the portaled content appears, restore it to the trigger when it disappears, and implement Escape and outside-dismiss behavior — or use Dialog, Menu, or Popover, which do all of this for you.

### Portaling into the very container that clips

❌ Pointing mountNode at an element inside the same overflow-hidden or transformed ancestor you are trying to escape provides no benefit; the content is still clipped or repositioned by that ancestor.

✅ Choose a mount node that is outside the clipping ancestor — a sibling higher in the tree or the default document.body node — which is the arrangement demonstrated in the Default story.

## Accessibility

**Requirements**: Portal itself satisfies no WCAG requirement on its own; it neither adds nor removes ARIA semantics and renders no role or label. Everything that makes portaled content accessible must be authored by the content, or inherited from a component such as Dialog, Menu, Popover, or Tooltip that already handles it. At minimum, meet WCAG 2.1.1 Keyboard (all functionality reachable by keyboard), 2.1.2 No Keyboard Trap (provide a way out, typically Escape, when focus moves into portaled content), 2.4.3 Focus Order (move focus into the portaled region when it opens and restore it to the trigger when it closes), 2.4.7 Focus Visible, 1.3.2 Meaningful Sequence, and 4.1.2 Name, Role, Value (give the portaled content an appropriate role and accessible name). Because portaled content is appended at the end of the mount node, preserve a reading and tab order that still makes sense relative to the trigger.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the portaled content only when it falls next in DOM order — Portal does not intercept Tab, and content mounted at the end of document.body is reached last, after the rest of the page. |
| `Shift+Tab` | Moves focus backwards through the document; with a portal at the end of the body this typically moves back toward the trigger and the rest of the page content. |
| `Enter` | Not handled by Portal; activates whatever interactive element inside the portaled content has focus, such as a Button or ToggleButton. |
| `Space` | Not handled by Portal; activates the focused Button or ToggleButton inside the portaled content in the same way as in normal document flow. |
| `Escape` | Not handled by Portal; any dismissal behavior for custom portaled content must be implemented by its own key handler, while Dialog, Menu, and Popover implement Escape for you. |

**ARIA**: Portal renders no ARIA attributes itself; the portaled content must supply them., role on the portaled container (for example dialog, menu, or tooltip) to expose its semantics., aria-modal when the portaled content behaves modally and the underlying page must be ignored., aria-labelledby and aria-describedby pointing at a title or description rendered inside the portal., aria-expanded, aria-haspopup, and aria-controls on the trigger element that controls the portaled content, since the trigger and the content are no longer DOM siblings., aria-live on live regions rendered through a portal, such as announcements or toast bodies, so updates are spoken even though the region lives outside the main content., tabIndex on the portaled container when focus must be programmatically moved into it.

**Screen Reader**: Screen readers traverse the accessibility tree in DOM order, not visual order, so anything you render through Portal is announced at the position of its mount node — by default at the very end of the document body, after all other page content. There is no implicit relationship between the trigger and the portaled content, so a screen reader user will not know the content belongs to a control unless you add attributes such as aria-expanded, aria-haspopup, or aria-controls on the trigger and a matching role and accessible name on the portaled container. Because Portal emits no element of its own, it adds no landmark, no group, and no hidden or visible text; assistive technology sees only the children you provide. Move focus into the portaled region when it appears so screen reader users are placed on it rather than left behind at the trigger.

## Styling

Portal renders no styles at all, so there is no Portal class name to override; all styling happens on the children or on the mount element. Style your own content with makeStyles and Griffel tokens — for a floating surface, combine tokens.colorNeutralBackground1 for the background, tokens.colorNeutralStroke1 with tokens.strokeWidthThin for the border, tokens.borderRadiusMedium for corners, and tokens.shadow16 (or tokens.shadow64 for full-screen overlays) for elevation. Position the content itself with position fixed or absolute plus inset values, and layer it with tokens.zIndexPopup rather than a hard-coded number so it stacks consistently with Fluent UI popups. When you need spacing inside the surface, use tokens.spacingVerticalM and tokens.spacingHorizontalM, and apply text styling with typographyStyles.body1 or tokens.colorNeutralForeground1. If Portal creates the mount node for you, use the object form of mountNode and give that object a className so your rules can target the generated element; when you pass an existing HTMLElement instead, style that element yourself. The Default story illustrates the pattern of declaring a plain content div inside the Portal and styling it through makeStyles, while the clipping container styles remain on the original parent.

## Performance

Portal is extremely cheap in itself: it renders no styles, creates no DOM wrapper in React's output, and only performs a createPortal call into the target node. The costs come from where and how often you use it. When mountNode is omitted, Portal creates a fresh unstyled element on document.body and removes it on unmount, so frequent open/close toggling of many Portals causes repeated DOM node churn — batch or keep a stable mount node instead. Never pass a newly created element or object as mountNode on every render; the identity change forces React to unmount and remount the entire portaled subtree, discarding DOM state and resetting focus. Each Portal also introduces a separate insertion point in the React tree, so avoid rendering one Portal per row or per list item; render a single portal whose children respond to state. Content inside a Portal is outside any ancestor's overflow and containment optimizations, so very large or animated portaled subtrees can affect paint and layout across the whole viewport.

## Theming & Tokens

Portal has no styles of its own and therefore does not consume any theme tokens — the generated mount element is unstyled and unthemed by design. Token usage happens entirely in the children, where you can freely reference tokens.colorNeutralBackground1, tokens.colorNeutralForeground1, tokens.colorNeutralStroke1, tokens.borderRadiusMedium, tokens.shadow16, tokens.shadow64, tokens.spacingVerticalM, tokens.spacingHorizontalM, and tokens.zIndexPopup through makeStyles, along with typographyStyles for text. The critical theming detail is scope: because the portaled DOM lives outside the FluentProvider subtree, CSS custom properties attached to the provider element do not cascade into it, so either place the mount node inside a themed region or wrap the portaled children in their own FluentProvider so tokens resolve correctly. The zIndex group of tokens (including tokens.zIndexPopup and tokens.zIndexPopupBase) is the intended way to keep portal-layered content above application chrome without hard-coded values.

## Migration Notes

If you are coming from Fluent UI React v8, note that the v9 Portal is deliberately minimal: it accepts only children and mountNode, and it renders no wrapper element by default. Legacy styling hooks that applied to the old wrapper — className, styles, and theme props on the portal itself — do not exist here, so any styling you previously attached to the portal wrapper must move onto your own child element or onto the className of an object-form mountNode. Rather than using a LayerHost-style indirection, v9 accepts a plain HTMLElement, or an object with element and className, through the single mountNode prop. Because there is no wrapper node and no automatic class application, content rendered by Portal no longer participates in the FluentProvider DOM subtree, so theme custom properties must be restored by wrapping the portaled content in a provider or by applying them to the mount node.

## Edge Cases

- Passing null or undefined as mountNode leaves the portal with nowhere to render, so content silently does not appear — guard rendering until a ref-captured node exists, as the Default story does with its open and mountNode conditions.
- When a ref callback is used to capture the mount node, the first render happens before the ref is set, so a Portal rendered unconditionally at that moment has no target; render it only after the node is available in state.
- Server-side rendering has no document.body; the default mount node cannot exist until the browser environment is available, so portaled content should be gated on client-side rendering or on a user interaction rather than rendered during the initial server pass.
- Supplying an HTMLElement directly gives you no way to have Portal add a class to it; only the object form with className lets Portal apply a class, so style an element you pass yourself.
- Replacing the mountNode value between renders reparents the entire subtree rather than moving it — React unmounts the old portal content and mounts new content, losing DOM state, scroll position, and focus.
- React context still flows through Portal because it is part of the React tree, but CSS inheritance, container queries, and ancestor selectors do not, which can produce content that looks correct in one location and breaks in another.
- Because portaled content is appended at the end of the mount node, it is last in DOM and tab order; a portal placed at document.body will be reached by keyboard and screen reader users after all other page content unless focus is moved into it programmatically.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
