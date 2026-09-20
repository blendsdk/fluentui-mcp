# PopoverTrigger

> **Package**: `@fluentui/react-popover` v9.14.3
> **Import**: `import { PopoverTrigger } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

PopoverTrigger is the interaction layer of the Popover family in Fluent UI React v9 and is the supported way to open a PopoverSurface. It accepts a single child element and augments that child with the behavior required to open and close an associated Popover: pointer handling, keyboard activation, focus management, and, by default, an internal trigger mechanism that guarantees the child behaves as a compliant ARIA button even when it is not a native button. The component renders the child directly into the DOM rather than introducing its own visible wrapper, so all visuals, semantics, and layout come from whatever element you pass in — most commonly a Button, a Link, or a custom button-like element. Because the trigger and the Popover share React context, PopoverTrigger must be rendered inside a Popover and paired with content placed in a PopoverSurface. It is imported from the same package as the rest of the component suite and is not deprecated in v9.

**When to use**: Use PopoverTrigger any time you need to reveal non-modal, contextual content in a PopoverSurface — inline help, supplementary details, small settings panels, color pickers, or other lightweight overlays that should not block the rest of the page. Prefer it over hand-rolling open state on a custom element's click handler, because the trigger handles outside-click dismissal, focus return, and ARIA button semantics for you. Reach for alternatives when the interaction is different in kind: use Tooltip when the overlay is purely a short, non-interactive text hint with no focusable content; use Menu or MenuButton when the overlay is a list of commands with its own keyboard model; use Dialog when the task is modal and focus must be trapped; use Drawer or OverlayDrawer for full-height side panels; and use TeachingPopoverTrigger when you need a guided, multi-step teaching experience. If the child you want to use is already a fully compliant, keyboard-operable control, you can still use PopoverTrigger but must consider disabling the built-in button enhancement.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disableButtonEnhancement` | `boolean \| undefined` | `false` | No | Disables internal trigger mechanism that ensures a child provided will be a compliant ARIA button. |

### Prop Guidance

- **disableButtonEnhancement**: Leave this at its default of false for almost all triggers. When false, PopoverTrigger runs its internal mechanism that guarantees the child behaves as a compliant ARIA button: non-interactive children such as a div or span gain button semantics, a tab stop, and Enter/Space activation, which is what makes icon-only and custom triggers keyboard accessible with no extra work. Set it to true only when the child already provides complete semantics and keyboard operability on its own, or when you deliberately want the child to keep different semantics than a button. A common safe case is a Fluent Button child, where the enhancement is redundant, or a custom element you have already wired with your own role, tabIndex, and key handlers. If you turn it on for a child that is not a native button, you become responsible for focusability, Enter/Space activation, and the accessible name, so verify those manually. `true`

## Best Practices

### Do's

- Render PopoverTrigger as a direct child of a Popover so both share the trigger context; the trigger alone has nothing to open.
- Pass exactly one child element that renders a single DOM node and can hold a ref — a Button, a Link, or a simple element such as a span or div you also make focusable yourself.
- Prefer a real Button (or ToggleButton, CompoundButton, or SplitButton when appropriate) as the child; it supplies its own focus ring, pressed states, and accessible name.
- Leave the default button enhancement in place when the child is not natively interactive, so that role button, a tab stop, and Enter/Space activation are applied for keyboard users.
- Give the trigger an accessible name — visible label text for text triggers, or an aria-label on the child for icon-only triggers.
- Set disableButtonEnhancement to true only when the child already provides complete button semantics and keyboard handling on its own, and re-verify that Enter and Space still open the overlay.
- Ensure the child stays reachable and visible while the popover is open, so focus can be restored to it when the popover closes.
- Let PopoverTrigger own the open/close interaction; if you need programmatic control, drive it through the Popover's own open state rather than adding a second toggle on the child.

### Don'ts

- Do not pass multiple children, an array, a React fragment, or a raw string as the child; the trigger must clone and augment a single element, so anything else will fail or behave unpredictably.
- Do not pass a behavior-only component that renders no DOM node as the direct child; the trigger needs a real element to attach event handlers, ref, and ARIA attributes to.
- Do not add role button and tabIndex to the child while the default enhancement is active — you will end up with duplicated or conflicting semantics.
- Do not nest interactive controls inside the trigger child (for example a button inside a button, or a nested link), which breaks keyboard activation and screen reader announcements.
- Do not use a natively disabled button as the trigger child; disabled elements do not fire events, so the popover can never open and the trigger drops out of the tab order.
- Do not use PopoverTrigger to open menus, modal dialogs, tooltips, or teaching experiences — those families have their own trigger components with the correct keyboard and ARIA contracts.
- Do not attach your own click handler that toggles the popover in addition to PopoverTrigger; the two will fight and produce double toggles or desynchronized state.
- Do not wrap the trigger in an extra layout element purely for styling, because the wrapper can interfere with focus styling and anchoring of the surface. Style the child instead.

## Anti-Patterns

### Triggering from an unfocusable element with enhancement disabled

❌ A div or span used as the trigger with disableButtonEnhancement set to true has no role, no tab stop, and no keyboard activation, so keyboard and screen reader users can never open the popover and the control is invisible to assistive technology.

✅ Keep the default enhancement so role button, tabIndex, and Enter/Space handling are applied, or replace the child with a real Button. If you must disable the enhancement, add your own role, tabIndex, key handlers, and focus styling.

### Manually toggling the popover on the child's click handler

❌ Adding an onClick that flips your own open state while PopoverTrigger also manages open/close produces double toggles, stale state, and a popover that cannot be dismissed correctly with outside clicks or Escape.

✅ Let PopoverTrigger own the interaction end to end. If you need programmatic control, drive the Popover's open state and let the trigger report changes through it rather than layering a second handler on the child.

### Using a natively disabled button as the trigger

❌ Disabled elements do not dispatch click or keyboard events, so the popover can never open, and the trigger is removed from the tab order, making the associated content unreachable for keyboard users.

✅ Keep the trigger enabled and visually communicate unavailability, or set aria-disabled on the child and guard the action inside it. aria-disabled preserves focusability and event delivery while still announcing the disabled state.

### Wrapping the trigger to style or position it

❌ Introducing an extra span or div around the child adds a layer between the popover and the element it anchors to, which can shift focus styling, complicate positioning of the surface, and add an unnecessary DOM node for every trigger on the page.

✅ Apply class names, inline styles, or Griffel styles directly to the child element. PopoverTrigger already renders no extra wrapper of its own, so keep the tree flat.

### Reusing PopoverTrigger for menus, dialogs, or tooltips

❌ Menus, modal dialogs, and tooltips have their own keyboard contracts — arrow-key navigation, focus trapping, or hover semantics — that PopoverTrigger does not implement, leading to interactions that feel broken to keyboard users.

✅ Use MenuTrigger with Menu and MenuList for command lists, DialogTrigger with DialogSurface for modal tasks, Tooltip for short non-interactive hints, and TeachingPopoverTrigger for guided teaching flows.

## Accessibility

**Requirements**: The trigger must satisfy WCAG 2.1.1 (Keyboard) — every popover must be openable without a mouse — and WCAG 4.1.2 (Name, Role, Value), meaning the trigger must expose an accessible name and an appropriate role (button) plus the state that indicates the overlay is available. WCAG 1.4.11 and 2.4.7 apply to the focus indicator: the child must show a clearly visible focus ring using theme stroke tokens. WCAG 2.1.2 (No Keyboard Trap) and 2.1.1 also apply to the opened surface, which must be dismissible with Escape and must not prevent tabbing back to the trigger. Because the popover is non-modal, the rest of the page must remain operable while it is open, and any content that appears on hover or focus should also be reachable without a pointer.

| Key | Action |
| --- | --- |
| `Enter` | Activates the trigger and opens the popover; when the default button enhancement is active, the trigger's internal mechanism also listens for Enter on non-button children so they behave like buttons. |
| `Space` | Activates the trigger and opens the popover, matching native button behavior; like Enter, this is supplied automatically for children that are not natively interactive. |
| `Escape` | Closes the open popover and returns focus to the trigger element, so keyboard users are never stranded inside the surface. |
| `Tab` | Moves focus from the trigger into the next focusable element, which is typically the content inside the PopoverSurface once it is open, and continues through any focusable content of the popover. |
| `Shift+Tab` | Moves focus backwards out of the popover content and back onto the trigger, allowing users to leave the overlay without closing it or using a pointer. |

**ARIA**: role — set to button by the internal trigger mechanism when the child is not already a button-like element; do not duplicate it manually while enhancement is enabled, tabIndex — set to 0 by the trigger mechanism when the child is not natively focusable, so it participates in the tab order, aria-label — should be provided on the child when the trigger has no visible text, such as an icon-only trigger, aria-labelledby — an alternative to aria-label when the trigger's name comes from a visible Label or other text element in the page, aria-describedby — can be used to associate the trigger with explanatory or error text rendered near it, aria-disabled — use this instead of the native disabled attribute when the trigger must remain focusable and announce its disabled state, since a natively disabled element cannot open the popover

**Screen Reader**: A screen reader announces the trigger using its accessible name and the button role that the internal mechanism supplies for non-button children, for example "Settings, button". Because PopoverTrigger renders the child itself, the announcement comes from the child element — if the child already had a different role, the enhancement may change how it is announced, which is why disableButtonEnhancement exists. When the popover opens, focus moves into the PopoverSurface if it contains focusable content, and the surface should carry an appropriate role and accessible name so the reader announces what was opened; when the popover closes, focus returns to the trigger and that trigger is re-announced. Non-focusable overlays opened by the trigger remain in the virtual cursor order after the trigger, so content should be written to read sensibly in that position.

## Styling

PopoverTrigger itself has no visual surface — it renders the child — so all styling is applied to the child element, for example through its own className or through a Button child's appearance. When building a custom (non-Button) trigger, mirror the Fluent neutral button treatment: use tokens.colorNeutralBackground1 for the resting background, tokens.colorNeutralBackground1Hover for hover, tokens.colorNeutralBackground1Pressed for pressed, and tokens.colorNeutralForeground1 with tokens.colorNeutralForeground1Hover for the label. Apply tokens.borderRadiusMedium for the corner radius, tokens.spacingHorizontalS and tokens.spacingVerticalXS for padding on text triggers, and tokens.strokeWidthThin with tokens.colorNeutralStroke1 for a subtle border. Focus is the most important state: use a two-pixel outline built from tokens.strokeWidthThick and tokens.colorStrokeFocus2 with tokens.borderRadiusMedium so the ring follows the trigger shape. Transition background and foreground changes with tokens.durationFaster and tokens.curveEasyEase to match the rest of the system. Keep icon-only triggers square using tokens.spacingHorizontalS padding on all sides so the target meets the 24 by 24 pixel minimum, and never remove the focus indicator — restyle it rather than disabling it.

## Performance

PopoverTrigger does not add a DOM node of its own; it augments the child element, so there is no extra layout or paint cost per trigger. The trigger does subscribe to popover context, which means open state changes re-render the trigger subtree — keep the child light and avoid placing large, expensive subtrees inside it. Because the surface content is not mounted until the popover opens, adding many triggers to a page is inexpensive, but each visible trigger still needs its own Popover and surface content. If the trigger child is a heavy custom component, memoize it so parent re-renders do not cascade into unnecessary work, and avoid creating new style objects or handler closures on every render. Also ensure a trigger is not rendered inside a rapidly re-rendering list without keys, since remounting a trigger can interrupt focus and leave the popover in an inconsistent state.

## Theming & Tokens

PopoverTrigger itself declares no themeable tokens — it is a behavior wrapper — so theming happens on the child element and on the surface content. When the child is a Fluent Button, it responds to the standard button token set, including tokens.colorNeutralBackground1, tokens.colorNeutralBackground1Hover, tokens.colorNeutralBackground1Pressed, tokens.colorNeutralForeground1, tokens.colorBrandBackground and tokens.colorBrandForeground1 for the brand appearance, and tokens.colorStrokeFocus2 with tokens.strokeWidthThick for the focus ring. Custom trigger elements should read the same semantic tokens so they invert automatically under FluentProvider's dark theme and high-contrast brand ramps, and spacing should use tokens.spacingHorizontalS, tokens.spacingHorizontalM, tokens.spacingVerticalXS, and tokens.spacingVerticalSNudge rather than hard-coded pixel values. Typography for text triggers should come from tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.fontWeightRegular, and motion from tokens.durationFaster or tokens.durationNormal paired with tokens.curveEasyEase. PopoverSurface content is themed independently by the popover's own tokens, so styling the trigger does not change the overlay's appearance.

## Migration Notes

In Fluent UI React v8, Popover exposed the trigger as part of its own API: you supplied a trigger element and used Callout-style props and render callbacks to position and open the surface. In v9 the API is split into three cooperating components — Popover for state and positioning, PopoverTrigger for the interaction layer, and PopoverSurface for the content — and the trigger is now a child-wrapping component rather than a prop or a render function. The v9 trigger also introduces the internal ARIA button enhancement controlled by disableButtonEnhancement, which did not exist in v8 and often removes the need for manual aria-haspopup wiring that v8 consumers added by hand. Migrating typically means moving the element that used to be passed to the trigger prop so it becomes the single child of PopoverTrigger, and moving the callout body into a PopoverSurface.

## Edge Cases

- PopoverTrigger expects exactly one child element. Passing an array, a fragment, a string, or multiple siblings will throw or silently fail, so always collapse wrapper markup into a single element.
- Custom components used as the child must forward refs to a DOM node and spread the props they receive, including click, key, role, and tabIndex values; otherwise the trigger cannot attach handlers or apply button semantics and the popover will never open.
- A custom child that already renders its own role or tabIndex can conflict with the internal enhancement and produce duplicated attributes or a wrong announcement — disable the enhancement and own the semantics, or use a plain element and let Fluent handle it.
- Primitive components such as Text, Label, or an icon rendered as the direct child usually do not forward the needed ref and props; wrap them in a focusable element instead.
- A natively disabled trigger child cannot open the popover at all because disabled elements emit no events; use aria-disabled plus guarded logic if the trigger must communicate unavailability.
- If a trigger conditionally renders nothing (for example when a feature flag is off), the child becomes null and the trigger has nothing to augment, so conditionally render the entire Popover instead.
- Only one Popover should be associated with a given trigger. Nesting surfaces or attaching two overlays to the same trigger leads to competing Escape handling and focus return.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
