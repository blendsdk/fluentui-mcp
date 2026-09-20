# CarouselAutoplayButton

> **Package**: `@fluentui/react-carousel` v9.9.8
> **Import**: `import { CarouselAutoplayButton } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

CarouselAutoplayButton is a small, purpose-built control in the Fluent UI React v9 Carousel family that toggles a carousel's autoplay behavior. It is designed to sit within a carousel's navigation area so people can start or stop the automatic advancement of slides, giving them an explicit escape hatch from motion they did not request. The component owns its autoplay checked value internally and reports every change through the onCheckedChange callback, which receives CarouselAutoplayChangeData describing the new value. Because the API surface is intentionally minimal — a single public prop and no slots — the component stays focused on the start/stop interaction and delegates all visual placement and carousel mechanics to the surrounding Carousel, CarouselNav, and CarouselNavContainer components.

**When to use**: Use CarouselAutoplayButton whenever a Carousel is configured to advance slides automatically and users need a way to pause or resume that motion. It is the correct choice for any autoplaying experience — hero banners, media galleries, promotional rotators — because WCAG requires that moving or auto-updating content can be paused, stopped, or hidden. It is also appropriate when you want to observe autoplay state changes to drive analytics, status messages, or synchronized UI. Do not use it in carousels that only advance through user interaction, since there is no autoplay state to toggle; in that case rely on CarouselNavButton and the other navigation controls. Do not use it as a generic icon button either — reach for Button, ToggleButton, or ToolbarButton when the action is unrelated to carousel autoplay.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `onCheckedChange` | `EventHandler<CarouselAutoplayChangeData> \| undefined` | — | No | Callback that informs the user when internal autoplay value has changed |

### Prop Guidance

- **onCheckedChange**: The only public prop. Use it to react when the internal autoplay value changes, for example to emit an analytics event, update a status message, or synchronize a custom indicator that lives outside the carousel. The callback receives CarouselAutoplayChangeData describing the change, so read the new value from that data rather than inferring it. Because the component manages its own checked state, this handler is the recommended way to mirror that state elsewhere; keep the handler stable when the parent re-renders frequently. `Synchronize external UI or analytics whenever autoplay starts or stops`

## Best Practices

### Do's

- Place CarouselAutoplayButton alongside the carousel's navigation controls so the playback control appears exactly where users look for slide controls.
- Give the button a descriptive accessible name that reflects the action, such as one that communicates pausing playback while autoplay is running and starting it when it is stopped.
- Use the onCheckedChange callback to keep external concerns in sync, for example analytics events, a polite status announcement, or a custom indicator elsewhere on the page.
- Pause autoplay when keyboard focus enters the carousel or when the pointer hovers over it, and make sure the button correctly reflects whatever state the carousel is actually in.
- Respect the user's reduced-motion preference by not starting autoplay proactively, and let the button serve as the explicit opt-in to motion.
- Wrap the handler passed to onCheckedChange in a stable reference when the parent re-renders often, so the button's memoization-friendly behavior is preserved.
- Keep the button visible whenever autoplay is enabled; hiding or disabling the only pause affordance makes the moving content impossible to stop.

### Don'ts

- Do not repurpose CarouselAutoplayButton as a general-purpose icon button for unrelated actions such as closing, sharing, or navigating — use Button or ToggleButton instead.
- Do not render it without an accessible name; an icon-only control with no label is announced only as a generic button.
- Do not maintain a parallel autoplay boolean and treat the button as controlled — the provided API exposes no checked prop, so the component's internal value is the source of truth and onCheckedChange is the observation point.
- Do not let a carousel autoplay indefinitely without this control present, as that violates WCAG requirements for pausable moving content.
- Do not place the button outside the carousel's navigation container, which fragments the focus order and separates the control from the content it affects.
- Do not ignore autoplay that keeps running after a user interacts with a slide, swatch, or navigation button — user intent to explore should stop the motion.
- Do not fire redundant work on every toggle; the callback already tells you exactly when the checked value changes, so avoid polling or duplicated state updates.

## Anti-Patterns

### Autoplay with no pause affordance

❌ A carousel that advances on its own without a way to stop it traps users who need more time to read, violates WCAG 2.2.2, and is especially harmful for users with cognitive or vestibular sensitivities.

✅ Always render CarouselAutoplayButton when autoplay is possible, keep it visible while motion is active, and additionally pause on hover and keyboard focus so the content stops as soon as a user engages with it.

### Controlled-state assumption

❌ Teams often keep an autoplay boolean in parent state and assume the button reflects it. The provided API exposes no checked prop, so the component's internal value can drift from the parent's assumption, leaving the button and the carousel out of sync.

✅ Treat the component's internal value as the source of truth and use onCheckedChange to mirror it into any external state, indicator, or status region you maintain.

### Unlabeled icon-only toggle

❌ Rendered without an accessible name, the control is announced only as a generic button, and users cannot tell whether activation will start or stop motion, nor what the current state is.

✅ Provide an aria-label whose wording matches the current action, and expose toggle state so the pressed condition is conveyed along with the label.

### Using it as a general-purpose button

❌ Repurposing the component for unrelated icon actions overloads its semantics, produces misleading screen reader announcements about autoplay state, and couples unrelated features to the carousel's behavior.

✅ Reserve CarouselAutoplayButton for autoplay control and use Button, ToggleButton, or ToolbarButton for any other icon action in the same toolbar.

## Accessibility

**Requirements**: CarouselAutoplayButton controls moving, auto-updating content, so it exists primarily to satisfy WCAG 2.2.2 (Pause, Stop, Hide): any carousel that advances automatically must offer a mechanism to pause it. The button must be reachable by keyboard, must show a visible focus indicator, must have an accessible name that describes the action rather than only the icon, and must communicate whether autoplay is currently on or off so assistive technology users can determine the current state. Contrast of the icon against its background must meet WCAG 1.4.3 and 1.4.11 for non-text UI, and any motion introduced by transitions should honor reduced-motion settings.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus to the button when tabbing through the carousel's controls; the button must render a visible focus indicator. |
| `Enter` | Activates the button and toggles autoplay between running and stopped, firing onCheckedChange. |
| `Space` | Activates the button and toggles autoplay between running and stopped, firing onCheckedChange. |
| `Shift+Tab` | Moves focus backward out of the button to the previous focusable control in the carousel. |

**ARIA**: aria-label — supplies the accessible name for the icon-only control and should describe the current action (for example pausing or starting autoplay)., aria-pressed — communicates toggle state so screen readers announce whether autoplay is on or off., aria-hidden — apply to any purely decorative icon glyph so it is not announced in addition to the label., aria-live — optionally used on a separate status region if you choose to announce autoplay changes from outside the button.

**Screen Reader**: The control is announced as a button with the name provided through its accessible label. When toggle semantics are exposed, screen reader users hear the pressed state change after activation, which tells them whether autoplay is now running or paused. Because the label should describe the action, the announcement shifts meaningfully on each toggle. If you surface autoplay status elsewhere with a live region, keep the messages short and infrequent so the toggle does not produce chatty, duplicated announcements.

## Styling

Style the control to match the sibling navigation controls so the carousel's control strip reads as one unit; use tokens.colorNeutralBackground1 for the resting surface and tokens.colorNeutralBackground1Hover and tokens.colorNeutralBackground1Pressed for the interactive states. Color the glyph with tokens.colorNeutralForeground1, switching to tokens.colorNeutralForeground2Hover on hover when the icon should recede slightly. Round the control with tokens.borderRadiusMedium and pad it with tokens.spacingHorizontalS and tokens.spacingVerticalS to keep hit targets comfortable. Keyboard users need a clear ring, so rely on the focus outline driven by tokens.colorStrokeFocus2, and keep any state transition subtle with tokens.durationNormal and tokens.curveEasyEase. If you want the active autoplay state to read as emphasized, tint the resting background with tokens.colorBrandBackground2 rather than hard-coding a brand hex value.

## Performance

CarouselAutoplayButton is extremely lightweight: it renders essentially a single interactive element with no slots and re-renders only when its internal checked value changes. The performance concern is therefore not the button itself but its surroundings. Invoke only local, cheap work inside onCheckedChange so a toggle does not trigger a full carousel re-render, and prefer a stable handler reference when the parent renders frequently. Avoid placing the button inside components that re-render on every slide transition, since that would re-run the button's render path during animation frames for no benefit.

## Theming & Tokens

The component consumes FluentProvider theme context like other v9 controls, so surface, foreground, and focus colors resolve through theme tokens rather than hard-coded values. Typical customizations use tokens.colorNeutralBackground1, tokens.colorNeutralBackground1Hover, and tokens.colorNeutralBackground1Pressed for interactive surfaces; tokens.colorNeutralForeground1 and tokens.colorNeutralForeground2Hover for the glyph; tokens.colorBrandBackground2 when the active autoplay state should carry brand emphasis; tokens.borderRadiusMedium for shape; and tokens.colorStrokeFocus2 for the focus ring. Motion is themed through tokens.durationNormal and tokens.curveEasyEase, which shorten or disable according to theme and reduced-motion settings, and high-contrast themes remap the neutral and stroke tokens so the control stays visible without extra overrides.

## Migration Notes

CarouselAutoplayButton has no counterpart in Fluent UI React v8; it ships as part of the v9 Carousel suite and is a new addition rather than a rename or replacement. Teams migrating from bespoke or third-party carousels should delete their custom play/pause toggles and adopt this component, moving any existing state tracking into the onCheckedChange callback, which replaces the ad-hoc click handlers those custom buttons typically carried. Because the component holds its own checked value and exposes no controlled prop, previously external autoplay booleans should become observational mirrors rather than sources of truth.

## Edge Cases

- Only one slide exists: toggling autoplay has no visible effect, so consider omitting the button or disabling autoplay entirely for single-slide carousels.
- No controlled prop is available: external UI cannot force the button's checked appearance, so any custom indicator must be driven from onCheckedChange instead of trying to push state down.
- Rapid toggling during a slide transition can interleave state changes; handle the callback idempotently so repeated start/stop presses do not queue duplicate timers or analytics events.
- Reduced-motion preferences may mean autoplay never begins on its own, yet the button still needs to reflect the true state rather than assuming motion is running.
- Because the icon glyph is decorative, forgetting to hide it from assistive technology can cause the label and the glyph to be announced together, producing confusing double announcements.
- The button's usefulness depends on placement: rendering it far from the CarouselNavContainer separates it from the carousel's focus order and makes the pause affordance hard to discover.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
