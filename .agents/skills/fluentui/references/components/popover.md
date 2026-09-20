# Popover

> **Package**: `@fluentui/react-popover` v9.14.3
> **Import**: `import { Popover } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

Popover is the Fluent UI React v9 overlay primitive for showing contextual, non-blocking content anchored to a trigger. It is a compositional component: the Popover root renders no visible box of its own, and instead coordinates a PopoverTrigger (which supplies interaction and accessibility wiring to its child) with a PopoverSurface (the floating panel that holds the content). The root accepts either two children, a PopoverTrigger and a PopoverSurface, or only a PopoverSurface when the surface is anchored to a custom target through the positioning prop and a positioningRef. Behavior is highly configurable: openOnHover, openOnContext, and openOnClick-style trigger interactions, controlled open with onOpenChange or uncontrolled defaultOpen, appearance variants of brand and inverted, size-driven padding and arrow sizing, withArrow for a pointer arrow, closeOnScroll for scrolling anchors, inline to render in DOM order rather than on document.body, and a focus-trap family (trapFocus, inertTrapFocus, deprecated legacyTrapFocus) for panels that behave like modal dialogs. The required surfaceMotion slot lets the surface mount and unmount through Fluent's Motion system, and setting it to null disables the transition animation entirely. Popover is the correct underlying surface for higher-level patterns such as menus, teaching experiences, and pickers, and it is intended for content that is dismissible and contextually useful rather than for long-lived or page-blocking tasks.

**When to use**: Use Popover whenever you need a small, anchored, dismissible surface: extra details on hover or click, contextual actions, inline forms, quick settings, or rich supplementary information that would otherwise crowd the page. Choose it when the content is non-modal by default and should not move the user away from their current task. Prefer Tooltip when content is short, non-interactive, and purely descriptive on hover or focus. Prefer Menu when the content is a list of commands or options with roving arrow-key navigation. Prefer Dialog when the task is modal, requires a blocking decision, or needs guaranteed focus containment and a scrim. Prefer TeachingPopover when the goal is onboarding or feature education with a structured carousel. Prefer Drawer or inline panels when content is large or persists alongside the page. Use Popover with trapFocus or inertTrapFocus when the surface itself contains focusable controls and must behave as a modal dialog.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appearance` | `"brand" \| "inverted" \| undefined` | — | No | A popover can appear styled with brand or inverted. When not specified, the default style is used. |
| `children` | `JSXElement \| [JSXElement, JSXElement]` | — | Yes | Can contain two children including `PopoverTrigger` and `PopoverSurface`. Alternatively can only contain `PopoverSurface` if using a custom `target`. |
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
| `positioning` | `PositioningShorthand \| undefined` | — | No | Configures the position of the Popover. Explore [Positioning docs](https://react.fluentui.dev/?path=/docs/concepts-developer-positioning-components--docs) for more options. |
| `size` | `PopoverSize \| undefined` | `medium` | No | Determines popover padding and arrow size |
| `trapFocus` | `boolean \| undefined` | `false` | No | Should trap focus |
| `unstable_disableAutoFocus` | `boolean \| undefined` | `false` | No | By default Popover focuses the first focusable element in PopoverSurface on open. Specify `disableAutoFocus` to prevent this behavior. |
| `withArrow` | `boolean \| undefined` | `false` | No | Display an arrow pointing to the target. |

### Prop Guidance

- **appearance**: Selects a surface treatment. Leave it undefined for the default neutral surface, use brand when the popover sits on brand-colored surfaces and should carry brand emphasis, and use inverted on dark or inverted backgrounds so the surface reads as the opposite of its surroundings. `brand`
- **children**: Required. Supply a PopoverTrigger plus a PopoverSurface for the normal anchored case, or just a PopoverSurface when you anchor the popover yourself with positioning and a positioningRef; the trigger-less form requires you to own markup, keyboard behavior, and focus restoration. `PopoverTrigger and PopoverSurface`
- **open**: Use for controlled visibility when open state must be synchronized elsewhere. Treat it as a hint: pair it with onOpenChange and update your own state, otherwise Escape and outside clicks will not close the popover. `true`
- **defaultOpen**: Use for uncontrolled popovers that should start expanded, such as an onboarding or first-run panel. Prefer this over controlling open when nothing outside the component needs the state. `true`
- **onOpenChange**: Fires whenever the component requests an open state change, including dismissals. Always provide it when open is controlled; the second callback argument carries the requested open value and the reason for the change. `handleOpenChange`
- **openOnHover**: Opens the surface on trigger hover only. Use it for lightweight, supplementary previews, never for content that must be read or interacted with, since hover is unavailable to keyboard-only and touch users. Pair with mouseLeaveDelay to keep the surface alive long enough to be useful. `true`
- **openOnContext**: Turns the popover into a context-menu style surface, typically opened from a right-click or an explicit secondary action. It disables all other interactions, so the content inside must provide its own keyboard navigation. `true`
- **mouseLeaveDelay**: Milliseconds to wait before closing after the pointer leaves, defaulting to 500. Increase it when the hover surface contains interactive content the user must move into, and lower it for purely informational previews that should disappear quickly. `500`
- **closeOnScroll**: Set to true when the trigger lives inside a scrolling container and the anchor would otherwise drift away from the surface. Defaults to false, which is right for popovers anchored to stable, non-scrolling regions. `true`
- **closeOnIframeFocus**: Defaults to true, meaning focusing an iframe outside the surface closes the popover. Set it to false when the surface hosts or coordinates with embedded iframe content such as a rich editor. `false`
- **inline**: Renders the popover in DOM order instead of on document.body. Use it when the surface must respect an ancestor's overflow, stacking context, theme class scope, or when you need the content to be reachable by selectors that cannot cross a portal boundary. `true`
- **positioning**: Configures placement of the surface relative to the target, including the position and alignment you want, offsets, autoSize for viewport-aware resizing, and a positioningRef for imperative anchoring to a custom target. Pair positioningRef with setTarget when you render a Popover without a PopoverTrigger. `autoSize enabled for constrained viewports`
- **size**: Determines surface padding and arrow size, defaulting to medium. Use a smaller size for terse hints and a larger one for content-rich panels, rather than overriding spacing by hand, so padding and arrow scale stay consistent. `medium`
- **withArrow**: Displays an arrow pointing from the surface to its target, which helps visually tie the popover to a specific trigger in dense layouts. Combine carefully with autoSize positioning by moving overflow to an inner element so the arrow is not clipped. `true`
- **trapFocus**: Enables the modal dialog pattern whenever the surface contains focusable elements: outside elements are hidden from assistive technology and focus is contained until the popover closes. `true`
- **inertTrapFocus**: Use together with trapFocus for standards-aligned trapping, where outside elements are made inert and navigation can pass between the trapped area and the browser toolbar per the HTML dialog spec. This is the modern replacement for legacyTrapFocus. `true`
- **legacyTrapFocus**: Deprecated. Only applicable with trapFocus, and it reinstates the older behavior where users cannot tab into the window outside the document. Retained for migration parity only; prefer inertTrapFocus for new code. `not recommended for new implementations`
- **unstable_disableAutoFocus**: By default the first focusable element in PopoverSurface receives focus on open. Set this unstable flag only when your design intentionally keeps focus on the trigger or moves it yourself, and provide your own focus and dismissal handling in that case. `true`
- **surfaceMotion**: Required slot controlling the surface animation. Leave it at its default for the standard enter and exit motion, replace it with a custom Motion presence component for branded transitions, or pass null to disable the transition entirely when animation is undesirable or costly. `null to disable the transition animation`

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

- Give the surface an accessible name by setting aria-labelledby on PopoverSurface and pointing it at an id on the heading inside the surface, as shown in the focus-trapping and trigger-less examples.
- Use trapFocus when the surface contains focusable elements (buttons, links, inputs), because that enables the modal dialog pattern and applies aria-hidden to elements outside the surface so screen readers do not escape it.
- Keep PopoverTrigger wrapping a real interactive element such as Button; let the trigger inject aria-expanded and related interaction attributes rather than hand-rolling them on the child.
- Add tabIndex of minus one on PopoverSurface when the surface has no focusable content, so focus handling and dismissal behave predictably; every canonical example in the docs does this.
- Prefer uncontrolled usage with defaultOpen unless the open state genuinely needs to be synchronized with something else; if you go controlled, always implement onOpenChange so dismissal requests from Escape, outside clicks, and scroll are honored.
- Limit nesting to two levels and combine nested popovers with trapFocus, because deeper nesting multiplies accessibility considerations and degrades the experience.
- Enable inertTrapFocus alongside trapFocus when you want standards-based trapping per the HTML dialog spec, where focus can move back to the browser chrome and vice versa.
- When you render a Popover without a PopoverTrigger, anchor it with positioningRef and its setTarget call on the external element, and mark that element with useRestoreFocusTarget so focus returns correctly on close.
- Break nested popovers into separate components for maintainability, as the nesting example recommends, rather than inlining several layers of trigger and surface pairs.
- Use size for padding and arrow scaling instead of hard-coding spacing on the surface, and reserve appearance="brand" or appearance="inverted" for surfaces that sit on brand or dark backgrounds.

### Don'ts

- Do not put essential, unreachable-only-by-hover information in a popover opened with openOnHover; keyboard-only and touch users cannot reliably reach it, and the surface closes on mouse leave after mouseLeaveDelay.
- Do not use Popover as a replacement for Dialog when the content must block the page or force a decision; a non-trapped popover is dismissed by outside clicks and cannot guarantee the user finishes the task.
- Do not nest popovers more than two levels deep; the docs explicitly warn that too much nesting adds accessibility burden and is a poor experience.
- Do not mix a controlled open prop with no onOpenChange handler; the component treats open as a hint, so the popover appears stuck open because dismissal events are ignored.
- Do not reach for unstable_disableAutoFocus unless you fully manage focus yourself, since the surface will no longer move focus to its first focusable element on open and screen reader users may not discover the content.
- Do not rely on legacyTrapFocus for new work; it is deprecated and implements non-standard behavior relative to the HTML dialog spec.
- Do not leave overflow hidden on PopoverSurface when combining withArrow with the autoSize positioning option, because the arrow gets clipped; move overflow to an inner element instead.
- Do not assume ancestor CSS or scoped CSS variables reach the surface, since it renders on document.body by default; target the surface directly or set inline to keep it in DOM order.

## Anti-Patterns

### Hover-only content that matters

❌ Opening the surface with openOnHover makes the content unreachable for keyboard-only and touch users, and the surface disappears after mouseLeaveDelay once the pointer leaves, so users cannot reliably read or interact with it.

✅ Reserve openOnHover for short, non-interactive previews. For content users must read or act on, use a click or Enter/Space trigger, provide an accessible name with aria-labelledby, and raise mouseLeaveDelay substantially if hover is genuinely required.

### Controlled open without onOpenChange

❌ Passing open without handling onOpenChange leaves the component unable to act on dismissal hints: Escape, outside clicks, and scroll-driven closes are ignored and the popover appears permanently stuck open.

✅ Either drop the controlled open prop and let the component manage state, or implement onOpenChange and write the requested open value into your own state, keeping interactions and keyboard accessibility intact.

### Deeply nested popovers

❌ Stacking three or more popovers multiplies focus, dismissal, and screen reader complexity, and each layer makes the interface harder to understand and escape.

✅ Limit nesting to two levels, extract each level into its own component for maintainability, and enable trapFocus (with inertTrapFocus) on nested popovers so the modal dialog pattern is applied consistently.

### Popover used as a modal dialog

❌ Without trapFocus, a popover is non-modal: it can be dismissed by outside clicks and screen reader users can wander into the page behind it, so it cannot guarantee that a required decision is completed.

✅ Use Dialog for blocking tasks. If a popover truly must contain focusable, modal content, enable trapFocus and label the surface, accepting the modal pattern's constraints.

### Unlabeled, unfocusable surface

❌ A PopoverSurface without an accessible name and without tabIndex when it has no interactive content leaves screen reader users without context for the panel and can create awkward focus behavior on open.

✅ Set aria-labelledby on PopoverSurface pointing at a heading inside it, and add tabIndex of minus one on surfaces that contain no focusable elements, following the documented examples.

## Accessibility

**Requirements**: Popover exposes a floating surface associated with a trigger, so the trigger must remain a real, focusable, operable control — PopoverTrigger handles this for native elements and Fluent components, and custom components must forward refs to participate correctly. When the surface contains content that is not self-describing, give it an accessible name with aria-labelledby on PopoverSurface referencing a heading inside. Use trapFocus whenever the surface is interactive so the pattern matches a modal dialog and surrounding elements are hidden with aria-hidden; use inertTrapFocus for spec-aligned trapping via the inert attribute. Whenever you anchor a Popover without a trigger, you become responsible for accessible markup, keyboard operation, and focus restoration. Close-on-interaction behavior (Escape, outside click, scroll when closeOnScroll is enabled, and iframe focus when closeOnIframeFocus is enabled) must not be defeated by controlled state that ignores onOpenChange.

| Key | Action |
| --- | --- |
| `Enter` | Activates the focused trigger and opens the popover when it is closed; inside an open surface it activates the focused control in the content. |
| `Space` | Activates the focused trigger, toggling the popover open, and activates focused buttons or checkboxes inside the surface. |
| `Escape` | Dismisses the open popover and returns focus to the trigger or to the last focused restore-focus target. |
| `Tab` | Moves focus forward through the interactive elements of the surface; with trapFocus enabled, focus is contained within the surface instead of escaping to the page. |
| `Shift+Tab` | Moves focus backward through focusable elements in the surface, wrapping within the trap when trapFocus is enabled. |
| `Arrow keys` | Not handled by Popover itself; when openOnContext is set, the content component placed inside the surface (for example a Menu or Listbox) is responsible for arrow-key navigation of its items. |

**ARIA**: aria-expanded, aria-haspopup, aria-labelledby, aria-describedby, aria-hidden, inert

**Screen Reader**: The trigger is announced as an expandable control that reports its collapsed or expanded state. When the popover opens, focus moves to the first focusable element inside PopoverSurface unless unstable_disableAutoFocus is set, and the surface content is read from that point. With trapFocus, sibling and ancestor elements outside the surface are given aria-hidden so screen reader navigation cannot leave the dialog context, and that hiding is removed automatically when the popover closes; with inertTrapFocus, outside elements become inert per the HTML dialog spec, so navigation can leak only to the browser toolbar. Because the surface renders out of DOM order on document.body by default, screen reader traversal follows the focus move rather than the document reading order, and a meaningful accessible name provided through aria-labelledby is what tells users what the surface contains. On dismissal, focus is restored to the most recently focused trigger target.

## Styling

Popover renders no host element, so styling is applied to PopoverSurface through makeStyles and className rather than to the Popover root. The default surface uses tokens.colorNeutralBackground1 for the background, tokens.colorNeutralStroke1 for its border, tokens.shadow16 for elevation, tokens.borderRadiusMedium for corners, and tokens.colorNeutralForeground1 for text, with interior padding built from tokens.spacingVerticalMNudge and tokens.spacingHorizontalMNudge that the size prop scales for you — prefer size over overriding padding so the arrow and padding stay in proportion. Reach for tokens.colorSubtleBackground or tokens.colorNeutralBackground1Hover for interactive rows inside the surface, and keep focus treatment on your own controls using the standard focus token set. Because the surface is portaled to document.body by default, parent-scoped selectors, ancestor overflow, z-index context, and CSS custom properties declared on ancestors will not apply — style the surface's own className, lean on FluentProvider for theming, or set inline when the surface must live inside a specific container or scroll region. If you use withArrow together with the autoSize positioning option, set overflow visible on PopoverSurface and move scrolling into an inner element so the arrow is not clipped. Animation can be tuned or removed through the surfaceMotion slot; supplying null removes the transition entirely, and custom Motion presets can be provided through the same slot.

## Performance

Opening and closing a popover runs through the required surfaceMotion slot, so every transition involves a presence and motion cycle; passing null for surfaceMotion removes that work entirely, which is worthwhile when many popovers are rendered in dense lists or tables. Because the surface renders out of DOM order on document.body by default, opening performs portal insertion plus positioning measurement rather than repositioning an element already in the layout flow, so avoid toggling open state inside scroll or resize loops — use closeOnScroll for scroll-driven dismissal instead. Keep surface content light and self-contained: popovers can be dismissed at any moment by outside click, Escape, iframe focus (closeOnIframeFocus defaults to true), or scroll, so long-running work should not depend on the popover staying open. Prefer uncontrolled state via defaultOpen and let the component own open state, or localize controlled state as close to the trigger as possible so a state change does not re-render a large surrounding subtree. Setting inline avoids the portal boundary when you need the surface inside an existing container for containment or measurement.

## Theming & Tokens

Popover inherits everything from FluentProvider and applies theme tokens to PopoverSurface. The default surface uses tokens.colorNeutralBackground1 for its fill, tokens.colorNeutralStroke1 for the border, tokens.shadow16 for elevation, tokens.borderRadiusMedium for corners, and tokens.colorNeutralForeground1 for text, with padding and arrow sizing derived from spacing tokens such as tokens.spacingVerticalMNudge and tokens.spacingHorizontalMNudge scaled by the size prop. The brand appearance swaps in brand tokens such as tokens.colorBrandBackground plus the corresponding on-brand foreground token, and the inverted appearance swaps in inverted tokens such as tokens.colorNeutralBackgroundInverted with its matching foreground, so content inside the surface should use tokens that track the current appearance rather than hard-coded colors. Motion timing follows the shared curve and duration tokens, for example tokens.curveEasyEase combined with tokens.durationNormal, and the surfaceMotion slot is the sanctioned place to override that behavior. Custom theme overrides applied through createLightTheme or FluentProvider propagate to the surface even though it is portaled, because it renders within the provider's theming context.

## Migration Notes

Within v9 the notable churn is in focus trapping: legacyTrapFocus is deprecated and only meaningful together with trapFocus, and it reproduces the older Fluent UI behavior where tabbing cannot leave the document at all. The current standard behavior is inertTrapFocus, which follows the HTML dialog spec by making outside elements inert so navigation can pass between the trapped area and the browser chrome. New code should adopt trapFocus with inertTrapFocus and avoid the legacy flag. Focus management is also worth revisiting when migrating: auto-focus of the first focusable element inside PopoverSurface is on by default, so panels that previously handled their own focus should either keep that default or opt out with the explicitly unstable unstable_disableAutoFocus prop and take over focus restoration themselves.

## Edge Cases

- A controlled popover whose open state is never updated from onOpenChange cannot be dismissed by Escape, outside clicks, or scroll, because open is treated as a hint and user-driven change requests are dropped.
- openOnContext disables all other interactions, so click, hover, and typical keyboard opening no longer apply; the content itself must implement keyboard navigation, which is why menu-like surfaces belong to Menu rather than a bare Popover.
- mouseLeaveDelay only matters when openOnHover is set and defaults to 500 milliseconds; when the surface holds interactive content, this window can be too short to move focus into the panel, so raise the delay or switch to a click trigger.
- closeOnIframeFocus defaults to true, so focusing any iframe outside the surface closes the popover; disable it when the surface coordinates with embedded iframe content such as an editor.
- Combining withArrow with the autoSize positioning option clips the arrow unless you reset overflow on PopoverSurface and move scrolling into an inner element that fills the available height.
- Anchoring to a custom target without a PopoverTrigger puts accessible markup, keyboard interaction, and focus restoration entirely on you; use positioningRef with setTarget on the external element and mark it with useRestoreFocusTarget so focus returns on close.
- legacyTrapFocus is deprecated and only meaningful with trapFocus; the standard behavior now comes from inertTrapFocus, which makes outside elements inert per the HTML dialog spec.
- unstable_disableAutoFocus suppresses the default focus move into the surface; if you disable it, supply your own focus management or keyboard users may never reach the popover content.
- A surface rendered on document.body by default escapes ancestor overflow, stacking contexts, scoped class selectors, and ancestor-declared CSS custom properties; use inline when any of those must apply, or target the surface's own className and rely on FluentProvider for theming.
- Nesting popovers beyond two levels compounds dismissal and focus-trap interactions, and nested popovers should always be split into their own components and used with trapFocus for correct screen reader and keyboard behavior.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
