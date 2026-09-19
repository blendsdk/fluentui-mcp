# Positioning

> **Package**: `@fluentui/react-positioning` v9.22.2
> **Import**: `import { Positioning } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

Positioning is a headless utility from @fluentui/react-components that solves the problem of placing a floating container element relative to a target element. It ships no visual component, no props, and no slots of its own; instead it exposes hooks and helpers — usePositioning, useSafeZoneArea, and resolvePositioningShorthand, along with the PositioningShorthandValue type — that return refs for the target and the container plus an optional element to render. The targetRef is attached to the anchor element, the containerRef is attached to the floating element, and the shorthand vocabulary (above, above-start, above-end, below, below-start, below-end, before, before-top, before-bottom, after, after-top, after-bottom) expresses where the container sits relative to the target using logical, RTL-aware directions. Optional settings such as offset with a mainAxis value, pinned, and a safe-zone mode with debug and timeout controls let you tune spacing, keep the container locked to the target, or constrain placement when the target is partially clipped. Positioning underpins the anchored surfaces elsewhere in the library — Popover, Tooltip, Menu, TeachingPopover and similar overlays — and is intended for teams that need that same behavior in a custom overlay they fully control.

**When to use**: Use Positioning when you are building a custom floating surface — a caller-owned popover, coach mark, inline preview, flyout, or annotation — and you need reliable anchored placement, spacing control, and a safe-zone fallback, but you do not want to adopt Popover, Tooltip, or Menu and inherit their rendering, focus, and dismissal behavior. Choose it over writing your own measurement code because it gives you the standard Fluent placement shorthand (above/below/before/after with start, end, top, and bottom modifiers) that stays consistent with the rest of the library and flips correctly for RTL. Choose useSafeZoneArea on top of usePositioning when the target may live inside a scrollable or clipped region and you want positioning relative to the visible portion of the target rather than its full bounding box. Do not use Positioning for plain page layout, sticky headers, or anything that is not anchored to another element, and prefer the higher-level Popover, Tooltip, or TeachingPopover components when their default behavior already matches your scenario, since they handle ARIA wiring, focus management, and dismissal for you.

## Props Reference

_No documented props._

### Prop Guidance

- **placement shorthand (PositioningShorthandValue + resolvePositioningShorthand)**: The primary input: a shorthand string describing where the container sits relative to the target. Resolve it with resolvePositioningShorthand and spread the result into usePositioning. Prefer logical directions (before, after) rather than left and right so placement mirrors correctly in RTL. `above`
- **offset**: Adds spacing between the target and the container. Set the mainAxis value to create a gap along the placement axis; leave the option undefined when you want the container flush against the target, as the reference example toggles with a Switch. `{ mainAxis: 20 }`
- **pinned**: When true, the container stays in the chosen placement instead of being allowed to auto-adjust near viewport edges. Use it when placement stability matters more than collision avoidance, and leave it false for surfaces that must always remain fully visible. `true`
- **targetRef**: The ref returned by usePositioning that must be attached to the anchor element. Combine it with useMergedRefs when another hook (such as useSafeZoneArea) or your own logic also needs that node. `positioning.targetRef`
- **containerRef**: The ref returned by usePositioning that must be attached to the floating element. Render that element through a Portal so it is not clipped, and merge this ref with any other refs the same node requires. `positioning.containerRef`
- **debug (useSafeZoneArea)**: Turns on a visual overlay of the computed safe zone while you are developing a clipped-anchor scenario. Keep it enabled only in development builds; the reference example enables it by default for demonstration purposes. `true`
- **timeout (useSafeZoneArea)**: Controls how long the safe-zone measurement remains active while debugging. Very large values keep the visualization on screen indefinitely, which is useful in a demo but must not ship to production. `100000`
- **elementToRender (useSafeZoneArea)**: The element the hook asks you to render alongside the container when safe-zone mode is active. Render it inside the same Portal as the container so the measurement and the visualization stay in the same layer. `safeZoneArea.elementToRender`

## Examples

### UseSafeZoneAreaDefault

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';

export const UseSafeZoneAreaDefault = (props: UseSafeZoneOptions): JSXElement => {
  const classes = useClasses();

  const [debug, setDebug] = React.useState(true);
  const [includeOffset, setIncludeOffset] = React.useState(false);
  const [position, setPosition] = React.useState<NonNullable<PositioningShorthandValue>>('above');
  const [targetWidth, setTargetWidth] = React.useState<'small' | 'medium' | 'large'>('large');

  const safeZoneArea = useSafeZoneArea({
    debug: true,
    timeout: 100000,
  });
  const positioning = usePositioning({
    ...resolvePositioningShorthand(position),
    offset: includeOffset ? { mainAxis: 20 } : undefined,
    pinned: true,
  });

  return (
    <div className={classes.root}>
      <div className={classes.controls}>
        <div>
          <Field>
            <Switch checked={debug} onChange={() => setDebug(!debug)} label="Debug mode" />
          </Field>
          <Field>
            <Switch
              checked={includeOffset}
              onChange={() => setIncludeOffset(!includeOffset)}
              label="Include offset in positioning"
            />
          </Field>

          <Field label="Target width">
            <RadioGroup
              layout="horizontal-stacked"
              value={targetWidth}
              onChange={(_, data) => setTargetWidth(data.value as 'small' | 'medium' | 'large')}
            >
              <Radio value="small" label="Small" />
              <Radio value="medium" label="Medium" />
              <Radio value="large" label="Large" />
            </RadioGroup>
          </Field>
        </div>

        <div>
          <Field label="Container position">
            <RadioGroup
              layout="horizontal-stacked"
              value={position}
              onChange={(_, data) => setPosition(data.value as PositioningShorthandValue)}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
              }}
            >
              <Radio value="above-start" label="above-start" />
              <Radio value="above" label="above" />
              <Radio value="above-end" label="above-end" />

              <Radio value="before-top" label="before-top" />
              <div />
              <Radio value="after-top" label="after-top" />

              <Radio value="before" label="before" />
              <div />
              <Radio value="after" label="after" />

              <Radio value="before-bottom" label="before-bottom" />
              <div />
              <Radio value="after-bottom" label="after-bottom" />

              <Radio value="below-start" label="below-start" />
              <Radio value="below" label="below" />
              <Radio value="below-end" label="below-end" />
            </RadioGroup>
          </Field>
        </div>
      </div>

      <div
        className={mergeClasses(
          classes.card,
          (position.startsWith('above') || position.endsWith('bottom')) && classes.cardAbove,
          (position.startsWith('below') || position.endsWith('top')) && classes.cardBelow,
        )}
      >
        <div
          className={mergeClasses(
            classes.target,
            targetWidth === 'small' && classes.targetSmall,
            targetWidth === 'large' && classes.targetLarge,
          )}
          ref={useMergedRefs(safeZoneArea.targetRef, positioning.targetRef)}
        >
          A target element
        </div>
      </div>

      <Portal>
        <div className={classes.container} ref={useMergedRefs(safeZoneArea.containerRef, positioning.containerRef)}>
          A container element
        </div>

        {safeZoneArea.elementToRender}
      </Portal>
    </div>
  );
};
```

## Best Practices

### Do's

- Resolve the placement before calling the hook: pass a PositioningShorthandValue such as above, below-start, or after-top through resolvePositioningShorthand and spread the result into usePositioning so the string becomes the options object the hook expects.
- Attach the returned targetRef to the anchor element and containerRef to the floating element, and use useMergedRefs whenever another concern (for example safeZoneArea.targetRef, safeZoneArea.containerRef, or your own ref) also needs the same DOM node.
- Render the floating container through a Portal so it escapes overflow: hidden ancestors, transformed parents, and competing z-index stacking contexts, exactly as the reference example does.
- Express spacing with the offset option and its mainAxis value rather than adding margin or padding to the container, so the gap travels with the placement and does not distort the container's own box.
- Use pinned when the container must stay in the chosen placement instead of being free to auto-adjust, and leave it off when you want the placement to be able to adapt near viewport edges.
- Reach for useSafeZoneArea when the anchor can be partially scrolled out of a clipping ancestor, and render the returned elementToRender alongside the container so the computed safe zone is honored.
- Keep the presence of the floating container conditional on the surface being open so that no measurement or layout work happens while the surface is closed.
- Memoize the options object you pass to the hooks when any part of it is derived (offset objects are a common offender) so placement is not recomputed on every render for an unchanged configuration.
- Tie the placement value to the component's own state, as the reference example does with a RadioGroup-driven position value, so the placement is a deliberate, testable input rather than an incidental side effect.

### Don'ts

- Do not hardcode top, left, or transform offsets in CSS to fake anchoring — those values go stale on scroll, resize, zoom, and direction changes, which is precisely what the Positioning hooks exist to solve.
- Do not assign the returned refs directly to a node that already receives another ref without merging, since the later assignment silently overwrites the earlier one and one of the two features stops working.
- Do not leave the debug option of useSafeZoneArea enabled with a long timeout in production builds; the visualization overlay and repeated measurement are development aids only.
- Do not pass a raw shorthand string straight into usePositioning and expect it to be interpreted — resolve it with resolvePositioningShorthand first.
- Do not reuse a single positioning hook instance across several different containers, and do not share one containerRef between multiple floating elements.
- Do not use Positioning to reimplement Tooltip, Popover, or Menu when the built-in component already provides the anchored surface, ARIA semantics, and dismissal behavior you need.
- Do not place the floating container deep inside the target's own subtree if the goal is escaping clipping; without a Portal it can be cut off by the same ancestor that clips the target.
- Do not treat Positioning as a component with props and slots — it has none, so there is nothing to render as a JSX element named Positioning.

## Anti-Patterns

### Hand-rolled CSS anchoring

❌ Positioning a floating surface with fixed top/left offsets or a transform works only for the exact scroll position, viewport size, and text direction you tested. It breaks on scroll, resize, zoom, RTL, and when the target's own content changes size.

✅ Attach targetRef to the anchor and containerRef to the floating element through usePositioning, and describe the relationship with a resolved PositioningShorthandValue such as below-start rather than coordinates.

### Ref clobbering on shared nodes

❌ The reference example needs two hooks attached to the same DOM nodes (useSafeZoneArea and usePositioning). Assigning one ref and then the other to the same element silently drops the first, so one of the two features stops tracking the element.

✅ Merge refs with useMergedRefs for both the target (safeZoneArea.targetRef plus positioning.targetRef) and the container (safeZoneArea.containerRef plus positioning.containerRef), as the example does.

### Shipping the safe-zone debug overlay

❌ Leaving the debug option of useSafeZoneArea on with a long timeout in production renders an extra overlay element and keeps measurement active, adding visual noise and unnecessary layout work for end users.

✅ Make the debug flag conditional on your development environment or a local toggle control, and keep the production default off with a short or default timeout.

### Reinventing Popover, Tooltip, or Menu

❌ Building an anchored surface from Positioning for a standard scenario means reimplementing ARIA wiring, Escape handling, focus management, and dismissal — all of which the higher-level components already provide and which Positioning deliberately does not.

✅ Use Popover, Tooltip, Menu, or TeachingPopover for standard overlay patterns and reserve Positioning for custom surfaces whose behavior genuinely differs from those components.

### Positioning inside the clipping ancestor

❌ If the floating container is rendered as a sibling inside the same overflow: hidden or transformed ancestor as the target, it is clipped by that ancestor no matter how correct the computed placement is.

✅ Render the container inside a Portal so the placement applies to a top-level layer, and add useSafeZoneArea when the target itself is partially clipped by a scroll container.

### Rebuilding hook options every render

❌ Passing a freshly constructed options object, including new offset objects, on every render causes the positioning logic to re-evaluate for a configuration that has not actually changed, which is wasteful for surfaces that re-render frequently.

✅ Hold placement, offset, and pinned values in state or memoize the options object with React.useMemo so the hook receives a stable configuration unless something genuinely changed.

## Accessibility

**Requirements**: Positioning is a non-visual utility: it renders no DOM, applies no styles, and defines no roles, ARIA attributes, or keyboard handlers of its own. Every accessibility obligation therefore belongs to the surface you build on top of it. The anchor element must be a real, focusable control with appropriate state (for example aria-expanded and aria-haspopup on a trigger Button) and the floating container must carry the semantics of its role, such as role dialog with aria-modal when it is modal or aria-labelledby/aria-describedby when it is informational. Computed placement is purely visual, so WCAG requirements that matter are the visual ones: content must not be pushed off-screen or become unreachable when the viewport is resized or the page is zoomed (WCAG 1.4.4 and 1.4.10 Reflow), text spacing overrides must not clip the container, and the container must remain visible when the target is partially scrolled out of a clipping ancestor — which is exactly the scenario useSafeZoneArea addresses. Because positioning does not change DOM order, keep the container in a logical place in the document and manage focus explicitly when it opens.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and out of the floating container; Positioning does not manage this, so the surface you build must ensure the container is reachable and contains no focus traps unless it is modal. |
| `Shift+Tab` | Moves focus backwards out of the container and back to the anchor; the anchor must remain focusable and visible when the container is open. |
| `Enter` | Activates the anchor control that opens or closes the positioned surface when the anchor is a Button; the utility itself binds nothing. |
| `Space` | Also activates a Button anchor and toggles the Switch controls shown in the reference example for debug and offset; activation behavior comes from those components, not from Positioning. |
| `Escape` | Must be handled by your surface to dismiss the floating container and return focus to the anchor; Positioning provides no dismissal logic. |
| `Arrow keys` | Required if the positioned container hosts a composite widget such as a menu, listbox, or the RadioGroup used in the example; roving focus must be implemented by that widget. |
| `Home / End` | Optional but expected inside long scrolling or composite content within the positioned container; Positioning imposes no constraints here. |

**ARIA**: aria-expanded, aria-haspopup, aria-controls, aria-labelledby, aria-describedby, aria-modal, role

**Screen Reader**: Screen readers are unaffected by the computed coordinates because positioning is expressed purely in CSS and inline styles; the reading order follows DOM order. This has two consequences. First, a container rendered through a Portal at the end of the document is encountered after the rest of the page unless you associate it with its trigger (aria-controls, aria-labelledby) or move focus into it when it opens. Second, a container that is visually above the target but later in the DOM will still be announced after the target, which is usually the desired behavior; do not rely on visual placement to imply reading order. Because the utility adds no live-region or role information, dynamically positioned content that appears in response to an action should be announced through focus management or a live region supplied by your surface.

## Styling

Positioning itself is styleless — it only sets placement-related styles on the container node returned via containerRef. All visual treatment is yours, and it should come from Griffel makeStyles and mergeClasses rather than inline styles, as the reference example does when it merges card, cardAbove, and cardBelow classes. Use tokens.colorNeutralBackground1 for the surface background, tokens.colorNeutralStroke1 or tokens.colorNeutralStroke2 for the border, tokens.borderRadiusMedium for the corner radius, and tokens.shadow16 (or tokens.shadow8 for lighter surfaces) for elevation, pairing the shadow with tokens.colorNeutralShadowAmbient and tokens.colorNeutralShadowKey if you define a custom shadow. Space the content with tokens.spacingHorizontalM and tokens.spacingVerticalS, and set text with tokens.colorNeutralForeground1 on tokens.fontSizeBase300 / tokens.lineHeightBase300. If you build a callout arrow or safe-zone indicator, tint it with tokens.colorNeutralBackground3 or tokens.colorBrandStroke1 so it reads in both light and dark themes. Because the container usually renders through a Portal, it is outside the anchor's layout subtree — do not style it with selectors that depend on the anchor as an ancestor; pass classes down explicitly instead.

## Performance

Positioning performs measurement work in response to layout changes, so the main cost is the number of repositioning passes rather than the size of the hook itself. Keep the options object stable (memoize derived offset objects and placement values) so the hook is not re-run for identical inputs on every render. Mount the floating container only while the surface is open, so a closed surface performs no measurement at all; the reference example conditionally renders inside Portal and merges refs at that point. Prefer pinned when the placement genuinely does not need adaptive correction, since allowing auto-adjustment invites extra measurement near viewport edges. Avoid instantiating one positioning hook per item in a long list — position a single shared overlay for the active item instead. The debug mode of useSafeZoneArea with a long timeout keeps an overlay alive and should never be enabled in production, and containers that change height after mount (async content, images without dimensions) may require an explicit re-measure when their content settles.

## Theming & Tokens

The Positioning utility consumes no theme tokens itself because it renders nothing and produces only placement styles. Theming applies to the surface you build: resolve backgrounds with tokens.colorNeutralBackground1, borders with tokens.colorNeutralStroke1 or tokens.colorNeutralStroke2, elevation with tokens.shadow8, tokens.shadow16, or tokens.shadow64 together with tokens.colorNeutralShadowAmbient and tokens.colorNeutralShadowKey, corners with tokens.borderRadiusMedium, and typography with tokens.colorNeutralForeground1, tokens.fontSizeBase300, and tokens.lineHeightBase300. Because the container is normally rendered through a Portal, it is still styled by the Griffel theme provided by the surrounding FluentProvider, so switching between light and dark themes or between brand themes via Provider updates the container along with the rest of the app. Direction-sensitive placement (before and after) follows the document direction established by the provider or the nearest dir attribute, so the same shorthand produces mirrored results in right-to-left layouts without any token or style changes on your side.

## Migration Notes

In v9 the positioning capability is delivered as headless hooks rather than a component-level props API. Positioning exports no props and no slots; placement is described with the PositioningShorthandValue vocabulary (above, above-start, above-end, below, below-start, below-end, before, before-top, before-bottom, after, after-top, after-bottom) and turned into hook options by resolvePositioningShorthand, then consumed by usePositioning. If you are porting custom overlay code from an earlier Fluent major version that configured placement through dedicated position, align, and target settings on a component, the equivalent work now lives in these hooks and in the shorthand strings; spacing that used to be handled by a separate offset configuration is expressed through the offset option with mainAxis. useSafeZoneArea is an additional, v9-era hook for anchors that are clipped by scroll containers. Teams that do not need custom overlay internals should migrate to Popover, Tooltip, or TeachingPopover instead of reimplementing them on top of Positioning.

## Edge Cases

- A raw placement string such as above-end is not accepted directly by usePositioning; it must first be passed through resolvePositioningShorthand to produce the options object the hook consumes.
- When the container is rendered in a Portal at the end of the document, the visual position and the DOM order diverge — assistive technology still encounters the container after the page content unless you associate it with the trigger or move focus into it.
- The target can unmount while the container is still rendered (for example when it is conditionally shown). Once the anchor node is gone the ref is stale, so close the surface or re-anchor it rather than leaving the container positioned against nothing.
- Containers whose size changes after they appear — late-loading images, async text, expandable sections — may need a re-measure, since the placement was computed against the initial box.
- Safe-zone behavior is only meaningful when the target is actually clipped by a scroll container; using it against a fully visible target adds measurement overhead without changing the result, and its elementToRender must be rendered for the mode to work as intended.
- The offset option is optional and frequently toggled; switching between undefined and a mainAxis value changes the visual gap without changing the placement, which can make an unrelated layout shift look like a positioning bug.
- Placement strings using before and after are direction-sensitive and mirror under RTL, so snapshot tests written for left-to-right layouts will not match right-to-left output.
- Offset mainAxis spacing applies along the main axis of the chosen placement only — it does not create symmetric padding around the container, so do not use it to reserve space on all sides.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
