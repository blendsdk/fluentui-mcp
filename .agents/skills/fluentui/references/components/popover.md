# Popover

> **Package**: `@fluentui/react-popover` v9.14.3
> **Import**: `import { Popover } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

Popover is a lightweight, non-modal overlay that displays contextual content anchored to a trigger element or to any DOM element you choose. It is a compositional component: a Popover wraps a PopoverTrigger (which injects the correct interaction handlers and accessibility attributes into a native element, a Fluent UI component, or a ref-forwarding custom component) and a PopoverSurface (the floating container that holds the content). By default the surface is rendered out of DOM order on document.body, its placement is computed by the positioning engine, and its open state is either uncontrolled through defaultOpen or fully controlled through the open and onOpenChange pair. Popover also supports opening on hover (openOnHover together with mouseLeaveDelay), opening as a context menu (openOnContext), optional focus trapping (trapFocus and inertTrapFocus), a pointing arrow (withArrow), two alternate appearances (brand and inverted) plus the default styling, a size scale that controls padding and arrow size, in-DOM rendering through inline, and a customizable surfaceMotion slot for enter and exit animations. When the PopoverSurface contains no naturally focusable element, it is commonly given a tabIndex of -1 so the default auto-focus behavior has somewhere to land. Because Popover is non-modal by default, the surrounding page remains interactive, which makes it ideal for contextual detail, supplementary forms, and rich hover cards rather than blocking tasks.

**When to use**: Use Popover when you need contextual, dismissible content attached to a target: a rich hover card, an inline edit form, extra details about a data point, or a small set of secondary actions that benefit from more room than a Tooltip allows. Choose Tooltip when the content is plain, non-interactive text that merely labels or briefly describes the target, and choose Dialog when the task must block the rest of the page, requires a full modal semantic, or must be completed before continuing. Choose Menu when the content is strictly a list of commands with roving focus semantics, and choose TeachingPopover when the goal is onboarding or feature education with a structured, multi-step teaching flow. Reach for Popover when you need anchoring flexibility (including anchoring to a custom target without a trigger), hover or context-menu activation, focus trapping for interactions contained inside, or a pointing arrow. Because Popover renders out of DOM order by default, prefer it over ad-hoc absolutely positioned divs, which do not handle viewport collision, focus restoration, or dismissal behavior for you.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"brand" \| "inverted" \| undefined` | — | No | A popover can appear styled with brand or inverted. When not specified, the default style is used. |
| `children` | `any` | — | Yes | Can contain two children including `PopoverTrigger` and `PopoverSurface`. Alternatively can only contain `PopoverSurface` if using a custom `target`. |
| `closeOnIframeFocus` | `boolean \| undefined` | `true` | No | Flag to close the Popover when an iframe outside a PopoverSurface is focused |
| `closeOnScroll` | `boolean \| undefined` | `false` | No | Close when scroll outside of it |
| `defaultOpen` | `boolean \| undefined` | `false` | No | Used to set the initial open state of the Popover in uncontrolled mode |
| `inertTrapFocus` | `boolean \| undefined` | `false` | No | Enables standard behavior according to the [HTML dialog spec](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) where the focus trap involves setting outside elements inert, making navigation leak from the trapped area back to the browser toolbar and vice-versa. |
| `inline` | `boolean \| undefined` | `false` | No | Popovers are rendered out of DOM order on `document.body` by default, use this to render the popover in DOM order |
| `legacyTrapFocus` | `boolean \| undefined` | — | No | Must be used with the `trapFocus` prop Enables older Fluent UI focus trap behavior where the user cannot tab into the window outside of the document. This is now non-standard behavior according to the [HTML dialog spec](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) where the focus trap involves setting outside elements inert. **Deprecated** |
| `mouseLeaveDelay` | `number \| undefined` | `500` | No | Sets the delay for closing popover on mouse leave |
| `onOpenChange` | `((e: OpenPopoverEvents, data: OnOpenChangeData) => void) \| undefined` | — | No | Call back when the component requests to change value The `open` value is used as a hint when directly controlling the component |
| `open` | `boolean \| undefined` | `false` | No | Controls the opening of the Popover |
| `openOnContext` | `boolean \| undefined` | `false` | No | Flag to open the Popover as a context menu. Disables all other interactions |
| `openOnHover` | `boolean \| undefined` | `false` | No | Flag to open the Popover by hovering the trigger |
| `positioning` | `any` | — | No | Configures the position of the Popover. Explore [Positioning docs](https://react.fluentui.dev/?path=/docs/concepts-developer-positioning-components--docs) for more options. |
| `size` | `PopoverSize \| undefined` | `medium` | No | Determines popover padding and arrow size |
| `trapFocus` | `boolean \| undefined` | `false` | No | Should trap focus |
| `unstable_disableAutoFocus` | `boolean \| undefined` | `false` | No | By default Popover focuses the first focusable element in PopoverSurface on open. Specify `disableAutoFocus` to prevent this behavior. |
| `withArrow` | `boolean \| undefined` | `false` | No | Display an arrow pointing to the target. |

### Prop Guidance

- **appearance**: Selects the surface palette. Leave it unset for the standard neutral surface, use brand when the popover should adopt the product accent color, and use inverted for a dark, high-contrast callout against light backgrounds. This is a styling shortcut, so prefer it over overriding background and foreground tokens manually. `brand`
- **children**: Accepts two children, a PopoverTrigger and a PopoverSurface, in the standard composition. Only omit the trigger, and pass just a PopoverSurface, when you anchor the popover yourself with a positioning ref; in that case you also take on the accessibility and focus-restoration work that the trigger normally provides. `PopoverTrigger and PopoverSurface`
- **closeOnScroll**: Set to true when the popover is anchored to content inside a scrolling region and should dismiss as soon as the user scrolls outside of it. Leave it false when the popover must survive page scrolling, such as a persistent filter panel. `true`
- **defaultOpen**: Use for uncontrolled usage when the popover should start open without you owning the state. It only sets the initial value; later changes must come from interactions or from switching to the controlled open prop. `true`
- **inline**: Use to render the popover in DOM order instead of portaling it to document.body. This is useful when the popover must inherit layout, CSS variables, or stacking context from an ancestor, but be aware that ancestor overflow and z-index rules then apply to the surface. `true`
- **mouseLeaveDelay**: Controls the grace period before a hover-opened popover closes after the pointer leaves. Only meaningful with openOnHover; raise it when the surface is large or contains interactive content that users need time to reach. `500`
- **withArrow**: Enables a pointing arrow that visually ties the surface to its target. Use it when the anchor is not immediately obvious, for example with custom targets or sparse layouts, and combine it with positioning autoSize only when you move overflow off the surface. `true`
- **onOpenChange**: The single callback through which the component requests open or closed state, receiving the originating event and a data object whose open field carries the requested value. In controlled usage, always drive your state from this callback so Escape, outside click, and focus events keep working. `data.open`
- **open**: Controls the popover in controlled mode. Combine it with onOpenChange, and remember that the open value acts only as a hint when events originate from the component itself. `false`
- **openOnContext**: Turns the popover into a context menu opened by a context action and disables all other opening interactions. Use it only for genuine context menu semantics, and make sure your own trigger markup supplies the expected keyboard access. `true`
- **openOnHover**: Opens the popover when the pointer hovers the trigger. Pair it with mouseLeaveDelay for a comfortable close delay, and never make hover the only way to reach important content. `true`
- **closeOnIframeFocus**: Defaults to true and closes the popover when focus enters an iframe outside the surface. Set it to false when the popover is designed to work alongside iframe content and you do not want the iframe focus to dismiss it. `false`
- **positioning**: Configures placement of the surface relative to its target through the positioning engine, including an imperative ref for anchoring to arbitrary elements and options such as autoSize. Prefer this over writing custom coordinates. `positioningRef`
- **size**: Determines the popover padding and the arrow size on the PopoverSize scale, with medium as the default. Use a smaller size for compact callouts and a larger size for content-rich surfaces so the internal spacing stays proportional. `medium`
- **trapFocus**: Enable when the popover contains multiple focusable elements and should behave modally, hiding outside content from assistive technologies while open. It is strongly recommended for nested popovers. `true`
- **legacyTrapFocus**: Deprecated. It reproduces the older focus trap that prevents tabbing into the browser chrome, which is no longer the standard behavior. Migrate to inertTrapFocus instead. `false`
- **inertTrapFocus**: Enable alongside trapFocus to use the standard HTML dialog focus trap, which marks outside elements inert so navigation can leak to the browser toolbar and back. This is the recommended modern trap behavior. `true`
- **unstable_disableAutoFocus**: By default the popover focuses the first focusable element in the surface on open. Disable that behavior only when you move focus yourself, and treat the prop as unstable because its name and contract may change. `true`
- **surfaceMotion**: Slot for the surface enter and exit animation. Leave it untouched for the default motion, supply a custom motion component through its children render function for bespoke animations, or set it to null to disable animation entirely. `null`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `surfaceMotion` | — | Yes | Slot for the surface motion animation. For more information refer to the [Motion docs page](https://react.fluentui.dev/?path=/docs/motion-motion-slot--docs). |
| `surfaceMotion` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, Button, Popover, PopoverSurface, PopoverTrigger } from '@fluentui/react-components';
import type { PopoverProps } from '@fluentui/react-components';

export const Default = (props: PopoverProps): JSXElement => (
  <Popover {...props}>
    <PopoverTrigger disableButtonEnhancement>
      <Button>Popover trigger</Button>
    </PopoverTrigger>

    <PopoverSurface tabIndex={-1}>
      <ExampleContent />
    </PopoverSurface>
  </Popover>
);
```

### Appearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, Button, Popover, PopoverSurface, PopoverTrigger, tokens } from '@fluentui/react-components';

export const Appearance = (): JSXElement => {
  const layoutStyles = useLayoutStyles();

  return (
    <div className={layoutStyles.root}>
      <Popover>
        <PopoverTrigger disableButtonEnhancement>
          <Button>Default appearance Popover trigger</Button>
        </PopoverTrigger>

        <PopoverSurface tabIndex={-1}>
          <ExampleContent />
        </PopoverSurface>
      </Popover>

      <Popover appearance="brand">
        <PopoverTrigger disableButtonEnhancement>
          <Button>Brand appearance Popover trigger</Button>
        </PopoverTrigger>

        <PopoverSurface tabIndex={-1}>
          <ExampleContent />
        </PopoverSurface>
      </Popover>

      <Popover appearance="inverted">
        <PopoverTrigger disableButtonEnhancement>
          <Button>Inverted appearance Popover trigger</Button>
        </PopoverTrigger>

        <PopoverSurface tabIndex={-1}>
          <ExampleContent />
        </PopoverSurface>
      </Popover>
    </div>
  );
};
```

### AnchorToCustomTarget

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, Button, Popover, PopoverSurface, PopoverTrigger } from '@fluentui/react-components';
import type { PositioningImperativeRef } from '@fluentui/react-components';

export const AnchorToCustomTarget = (): JSXElement => {
  const positioningRef = React.useRef<PositioningImperativeRef>(null);
  const buttonRef = React.useCallback(
    (el: HTMLButtonElement | null) => {
      positioningRef.current?.setTarget(el);
    },
    [positioningRef],
  );

  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Popover positioning={{ positioningRef }}>
        <PopoverTrigger disableButtonEnhancement>
          <Button>Popover trigger</Button>
        </PopoverTrigger>

        <PopoverSurface tabIndex={-1}>
          <ExampleContent />
        </PopoverSurface>
      </Popover>

      <Button ref={buttonRef}>Custom target</Button>
    </div>
  );
};

AnchorToCustomTarget.parameters = {
  docs: {
    description: {
      story: [
        'A Popover can be used without a trigger and anchored to any DOM element. This can be useful if',
        'a Popover instance needs to be reused in different places.',
        '',
        '_Not using a PopoverTrigger will require more work to make sure your scenario is accessible,_',
        '_such as, implementing accessible markup and keyboard interactions for your trigger._',
      ].join('\n'),
    },
  },
};
```

## Best Practices

### Do's

- Compose Popover with PopoverTrigger and PopoverSurface as its children so that the trigger automatically receives the correct event handling and accessibility attributes; use the two-children form unless you are deliberately anchoring to a custom target.
- Give the PopoverSurface a tabIndex of -1 when its content has no focusable element, so open state has a defined focus landing spot and keyboard users are not stranded on the trigger.
- Provide an accessible name for the surface, for example by rendering a heading with a generated id and wiring it to the surface with aria-labelledby.
- Use trapFocus whenever the popover contains focusable elements that form a small interaction, and always use it when nesting popovers so screen reader and keyboard behavior stays coherent.
- Keep controlled usage symmetrical: pass open and always reconcile the requested state from onOpenChange so Escape, outside clicks, and focus loss can still close the popover.
- When you render a Popover without a PopoverTrigger, restore focus explicitly by pairing your own toggle control with the useRestoreFocusTarget hook, since the Popover already relies on the internal restore focus source behavior.
- Limit nesting to two levels and extract each nested popover into its own component for maintainability.
- Use inline only when you genuinely need the surface in DOM order, for example to inherit layout or stacking context; otherwise let the default portal behavior handle viewport collision.
- Use openOnHover together with an appropriate mouseLeaveDelay and make sure everything inside a hover popover is also reachable by keyboard, or make the same content available through a click-triggered popover.

### Don'ts

- Do not put essential-only, keyboard-unreachable content inside a hover-activated popover; hover does not exist on touch devices and degrades keyboard access.
- Do not nest more than two levels of popovers, because each level multiplies focus, escape, and dismissal complexity.
- Do not pass open without handling onOpenChange, or the popover will appear frozen and ignore dismissal interactions.
- Do not use openOnContext together with hover or click activation expectations, since it disables all other interactions and turns the popover into a context menu.
- Do not use legacyTrapFocus; it is deprecated in favor of the standard inertTrapFocus behavior described by the HTML dialog specification.
- Do not repurpose Popover as a blocking modal dialog for critical flows; use Dialog when the rest of the page must be inert and the user must complete or cancel a task.
- Do not reach for unstable_disableAutoFocus without also moving focus yourself; disabling auto focus leaves keyboard focus behind while sighted users see new content.
- Do not leave the default closeOnIframeFocus behavior in place when the popover intentionally interacts with iframe content, since focus entering an outside iframe will close it.

## Anti-Patterns

### Using Popover as a modal dialog

❌ Popover is non-modal by default, so background content stays interactive and the popover does not provide the full dialog semantics that blocking tasks require. Developers then try to fake modality with custom overlays and ad-hoc focus code.

✅ Use Dialog for blocking flows. If the popover genuinely contains a contained interaction, enable trapFocus, and consider inertTrapFocus for the standard inert-based trap, but keep truly modal tasks in Dialog.

### Hover-only popovers with interactive content

❌ openOnHover popovers cannot be opened on touch devices and are awkward for keyboard users, especially when the surface contains buttons or form fields.

✅ Make the trigger a real focusable control that also opens on click or keyboard, or move interactive content into a click-activated popover and reserve hover popovers for short read-only detail.

### Controlling open without listening to onOpenChange

❌ Passing open without updating it from onOpenChange freezes the popover: Escape, outside clicks, and focus loss no longer close it, and keyboard users can become trapped or confused about what is interactive.

✅ Always reconcile state from onOpenChange, setting the controlled value from the data open field, and keep the trigger and popover state in agreement.

### Rendering a Popover without a trigger and forgetting focus restoration

❌ When you drop PopoverTrigger, the trigger semantics, the expanded state announcement, and focus restoration on close are all lost, so keyboard users are left with focus in an ambiguous place.

✅ Keep the Popover controlled, anchor it with a positioning ref, and pair your toggle control with the useRestoreFocusTarget hook so focus returns to the control that opened the popover.

### Deeply nested popovers without a focus trap

❌ Each nesting level adds another dismissal and focus layer. Without trapFocus, screen reader users lose the boundary of the nested surface and keyboard focus can wander into the page behind.

✅ Limit nesting to two levels, extract each nested popover into its own component, and enable trapFocus on the nesting chain.

### Clipping the arrow with surface overflow

❌ The default surface overflow clips the arrow when withArrow is combined with a positioning autoSize configuration, producing a visually broken pointer.

✅ Reset overflow on the PopoverSurface and move scrolling to an inner element whose height fills the available space.

## Accessibility

**Requirements**: Popover must remain fully operable by keyboard and must expose an accessible name for its surface content. PopoverTrigger injects the required interaction and accessibility attributes into its child, so a real focusable child (a native element, a Fluent UI component, or a ref-forwarding custom component) is required for correct labeling and state announcements. When the popover behaves modally, enable trapFocus so that elements outside the surface are marked aria-hidden for assistive technologies; this hiding is automatically removed when the Popover closes. Always provide a visible focus indicator for the trigger and for any interactive element inside the surface, and make sure the surface content is reachable at every viewport size without relying on hover only.

| Key | Action |
| --- | --- |
| `Enter` | Activates the PopoverTrigger child (when enhanced into a button) and opens the popover. |
| `Space` | Activates the PopoverTrigger child like a button press, toggling the popover open. |
| `Escape` | Requests the popover to close and, when focus management is in play, returns focus to the trigger or the most recently focused restore-focus target. |
| `Tab` | Moves focus forward through interactive elements; with trapFocus enabled, focus cycles inside the PopoverSurface and the outside page is made inert for assistive technologies. |
| `Shift+Tab` | Moves focus backward through the surface content, cycling within the trapped region when trapFocus is enabled. |

**ARIA**: aria-labelledby on PopoverSurface to point at a heading id that names the popover content, aria-hidden applied to elements outside the focus trap while trapFocus is active, and removed on close, Accessibility attributes injected automatically into the PopoverTrigger child by the trigger component, aria-expanded and aria-haspopup style state attributes provided through the enhanced trigger child to convey open state and popup semantics

**Screen Reader**: With a standard PopoverTrigger, assistive technologies announce the trigger with its popup semantics and expanded state, so users know the control opens an overlay. When trapFocus is enabled, the Popover acts as a modal region: content outside the PopoverSurface is hidden from screen readers through aria-hidden so that navigation stays within the surface, and this hiding is removed automatically once the popover closes. The surface itself is announced using the name supplied through aria-labelledby or its own text content. If you render a Popover without a PopoverTrigger, the trigger semantics, the expanded state, and focus restoration are entirely your responsibility, and screen reader users will not receive any indication that an overlay exists.

## Styling

Style the floating container through PopoverSurface, which accepts className and style, and build those class names with makeStyles from the Fluent UI packages. The default surface already consumes shadow and background tokens, so most customization is additive: adjust padding with tokens.spacingVerticalM and tokens.spacingHorizontalM, corner rounding with tokens.borderRadiusMedium or tokens.borderRadiusLarge, border with tokens.colorNeutralStroke1, and elevation with tokens.shadow4 or tokens.shadow16. The appearance prop is the cheapest way to switch palettes before you reach for custom CSS, and the size prop controls both padding and arrow size so the arrow remains proportional. When you use withArrow, keep the arrow background and the surface background in sync by deriving both from the same token such as tokens.colorNeutralBackground1, tokens.colorBrandBackground, or tokens.colorNeutralBackgroundInverted. For content that must scroll, move overflow off the PopoverSurface onto an inner element; this is required when combining withArrow with a positioning autoSize configuration, because overflow on the surface clips the arrow. Motion styling is handled through the surfaceMotion slot rather than CSS transitions, and setting that slot to null disables the enter and exit animation entirely.

## Performance

The surface is only rendered while the popover is open, so keeping heavy content behind the open state is inherently cheap; avoid mounting expensive subtrees unconditionally just to hide them. By default the surface is portaled to document.body, which means it escapes ancestor layout and can be positioned without triggering reflows in the rest of the tree; the inline prop trades that benefit for DOM order. Positioning runs on open and on scroll or resize while visible, so prefer the built-in positioning options, such as autoSize, over manual measurement loops in onOpenChange. Animations are driven by the surfaceMotion slot; setting it to null removes the enter and exit animation and reduces work in dense lists or grids of triggers. Rapid state churn in onOpenChange handlers can cause repeated layout work, so keep those handlers light and avoid unrelated re-renders in the same tree, especially when nesting popovers.

## Theming & Tokens

Popover responds to the Fluent UI theme provided by the surrounding provider. The default appearance uses tokens.colorNeutralBackground1 for the surface, tokens.colorNeutralForeground1 for text, tokens.colorNeutralStroke1 for the border, and elevation tokens such as tokens.shadow4 and tokens.shadow16 with the ambient and key shadow color tokens for depth. The brand appearance switches to tokens.colorBrandBackground and tokens.colorBrandForeground1, while the inverted appearance uses tokens.colorNeutralBackgroundInverted with tokens.colorNeutralForegroundInverted for high contrast. Padding and arrow geometry come from the size scale and map onto spacing tokens such as tokens.spacingVerticalM, tokens.spacingHorizontalM, and tokens.spacingVerticalS. Corner radius uses tokens.borderRadiusMedium or tokens.borderRadiusLarge, and text inside the surface can rely on tokens.fontSizeBase300 and tokens.lineHeightBase300 for body copy. Because these are theme tokens, switching between light, dark, and high-contrast themes, or a custom brand ramp, automatically re-colors the surface and the arrow without additional styling, provided you do not hard-code colors.

## Migration Notes

The v9 Popover is a compositional component rather than the single-component, content-prop based API of previous major versions. Instead of passing a target and a content payload, you now compose PopoverTrigger and PopoverSurface as children of Popover, which lets the trigger inject interaction and accessibility attributes automatically. Placement is configured through the positioning prop rather than separate position and alignment props, and the positioning engine also exposes an imperative ref that can be used to anchor a Popover to an arbitrary DOM element with the setTarget method when you do not want a trigger. Styling options were formalized as first-class props: appearance covers the default, brand, and inverted palettes, size covers padding and arrow size, and withArrow replaces manual arrow markup. Focus management gained explicit controls: trapFocus is the primary switch, inertTrapFocus selects the standard HTML dialog style inert-based trap, and legacyTrapFocus is deprecated and should no longer be used. Animations are now expressed through the surfaceMotion slot, so the older practice of styling transitions directly on the surface is no longer required.

## Edge Cases

- The default closeOnIframeFocus behavior closes the popover whenever focus moves into an iframe outside the surface, which surprises implementations that intentionally interact with embedded content; set it to false in those cases.
- With withArrow plus a positioning autoSize configuration, the default surface overflow clips the arrow; the overflow must be moved to an inner element whose height fills the available space.
- Enabling inline changes where the surface lives in the DOM, so ancestor overflow, transform, and z-index rules that were bypassed by the portal suddenly apply and can clip or stack the popover incorrectly.
- Controlled usage requires honoring onOpenChange; if the handler ignores the requested state, Escape and outside-click dismissal stop working even though the popover still looks interactive.
- openOnContext disables all other interactions, so a keyboard user must be given an independent way to invoke the same context menu behavior.
- unstable_disableAutoFocus prevents the automatic focus of the first focusable element; without a manual focus call, screen reader users are not moved into the newly opened surface.
- legacyTrapFocus is deprecated and pairs only with trapFocus; keeping it produces the non-standard trap that prevents tabbing into the browser chrome.
- Nesting popovers beyond two levels multiplies focus and dismissal complexity, and every nested level should carry trapFocus to keep the boundaries clear.

## See Also

- - [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
