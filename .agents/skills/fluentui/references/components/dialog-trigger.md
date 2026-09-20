# DialogTrigger

> **Package**: `@fluentui/react-dialog` v9.18.1
> **Import**: `import { DialogTrigger } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

DialogTrigger is the declarative entry point used to open or dismiss a Dialog in Fluent UI React v9. Rather than requiring you to manage dialog visibility manually, DialogTrigger is composed next to a Dialog and wraps the element that should activate it, cloning that child and wiring up the necessary event handling and, by default, the ARIA button semantics that interactive dialogs require. Its behavior is position-aware: when DialogTrigger sits outside DialogSurface it defaults to the open action, and when it is rendered inside DialogSurface it defaults to the close action, so a Cancel button placed in the dialog actions area dismisses the dialog without extra state plumbing. The component exposes only two props, action and disableButtonEnhancement, and renders no visual chrome of its own, which keeps it lightweight and lets the wrapped child control all appearance.

**When to use**: Use DialogTrigger whenever you want a click on an element to open a Dialog or dismiss one that is already open, especially in the standard composition alongside Dialog, DialogSurface, DialogTitle, DialogBody, DialogActions and DialogContent. It is the right choice for modal confirmations, forms, alerts requiring acknowledgement, and non-modal or nested dialogs triggered from a Button, MenuItem, Link, ToolbarButton, or any other focusable control. Reach for PopoverTrigger instead when the overlay content is non-modal and lightweight (a hint, a small form, or a contextual panel), and for MenuTrigger or a Menu / MenuPopover composition when the overlay is a list of actions rather than a dialog with a title and explicit dismissal semantics. Prefer DialogTrigger over hand-rolling a click handler that toggles visibility, because the composed version keeps focus management and ARIA button compliance consistent across the app.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `action` | `DialogTriggerAction \| undefined` | — | No | Explicitly declare if the trigger is responsible for opening or closing a Dialog visibility state.  If `DialogTrigger` is outside `DialogSurface` then it'll be `open` by default  If `DialogTrigger` is inside `DialogSurface` then it'll be `close` by default |
| `disableButtonEnhancement` | `boolean \| undefined` | `false` | No | Disables internal trigger mechanism that ensures a child provided will be a compliant ARIA button. |

### Prop Guidance

- **action**: Explicitly declares whether this trigger opens or dismisses the dialog, using the 'open' or 'close' action. You rarely need it: a trigger placed outside DialogSurface defaults to open, and one placed inside DialogSurface defaults to close, which covers the common pattern of an opener in the page plus a Cancel button in DialogActions. Set it when the DOM position would guess wrong, for example a close trigger rendered outside the surface on a custom overlay, a single trigger reused across multiple dialogs, or a nested dialog whose inner surface changes the containing context. `close`
- **disableButtonEnhancement**: Turns off the internal mechanism that makes the wrapped child a compliant ARIA button, which by default adds role, focusability and key handling so that a non-button child still works as a trigger. Leave it at its default of false for plain elements and most components. Set it to true only when the child already implements full button semantics itself, such as a custom component rendering a native button, an interactive element with its own role="button" and tabIndex, or a component whose own keyboard and focus behavior would conflict with the enhancement. `true`

## Best Practices

### Do's

- Place DialogTrigger outside DialogSurface for triggers that open the dialog, and rely on the automatic close action for triggers rendered inside the surface, such as a Cancel or Close button.
- Give the wrapped child a clear, action-oriented accessible name (for example 'Delete file' or 'Open settings') so screen reader users know what the dialog will do before activating it.
- Use a real Button as the child for the standard case; it already satisfies button semantics, receives focus naturally, and pairs with the flavor of the dialog (for example a primary Button for a destructive confirmation).
- Pair every Dialog with a DialogTitle so the opened surface has an accessible name, and place dismissal controls in DialogActions so both keyboard and pointer users can leave the dialog easily.
- Spread the props and forward the ref on custom children, because DialogTrigger clones its child and merges the trigger's handlers and ref with the ones the child already provides.
- Set action explicitly when a trigger is rendered in an unusual position, such as a close trigger placed outside the surface or shared across several dialogs.

### Don'ts

- Do not nest a DialogTrigger inside another trigger (or inside an interactive element that is itself a trigger), since stacking button semantics produces invalid, ambiguous markup and unpredictable activation.
- Do not set disableButtonEnhancement on a child that is not focusable and does not already expose button semantics, because the trigger then becomes unreachable by keyboard.
- Do not put the same visual trigger inside both the page and the dialog surface without setting action, because the default flips based on DOM position and the second instance may open instead of close.
- Do not style DialogTrigger expecting it to render its own box; it renders no element of its own, so background, padding and border belong on the wrapped child.
- Do not duplicate dialog state yourself while using DialogTrigger, such as adding a second click handler on the child that also toggles visibility, as the two mechanisms will fight each other.
- Do not use DialogTrigger for non-dialog overlays such as tooltips, menus or hover cards; those have their own trigger components with different ARIA and dismissal semantics.

## Anti-Patterns

### Trigger wrapping a non-interactive element with enhancement disabled

❌ Setting disableButtonEnhancement on a plain div, span or static image strips the role, focusability and key handling that the trigger adds, leaving a control that mouse users can click but keyboard and screen reader users cannot operate.

✅ Either leave disableButtonEnhancement at its default so the child is enhanced into a compliant ARIA button, or use a child that is already an interactive button and turn the enhancement off deliberately because the child supplies its own semantics.

### Relying on position instead of declaring the action

❌ The default open or close action is inferred from whether DialogTrigger sits inside DialogSurface. Moving the same trigger markup during refactoring, or rendering a dismissal control outside the surface, silently inverts its behavior so a 'Cancel' button opens the dialog instead of closing it.

✅ Keep openers outside and dismissals inside DialogSurface when possible, and set the action prop explicitly whenever a trigger is rendered outside the surface or is reused in more than one location.

### Stacking triggers or interactive elements

❌ Nesting a DialogTrigger inside another trigger, or wrapping a control that is itself a trigger, produces nested interactive elements with duplicate roles and competing activation handlers, which confuses assistive technology and can fire the wrong dialog.

✅ Use one trigger per control. If a surface needs to open another dialog, place the second DialogTrigger on a distinct control inside the first surface and let it default to its own open behavior.

### Duplicating dialog state alongside the trigger

❌ Adding a separate click handler or visibility state that toggles the dialog while DialogTrigger also handles activation leads to double toggles, dialogs that immediately reopen, or state that drifts from what is rendered.

✅ Let DialogTrigger own activation and the dialog own visibility. If the dialog must be controlled, control it in one place and do not also add activation logic to the child.

### Styling DialogTrigger directly

❌ DialogTrigger renders no element of its own, so styles, layout props and margins applied to it are forwarded to the child in ways that can conflict with the child's own styling or with the enhancement's attribute merging.

✅ Style the wrapped child or its container instead, using the child's own appearance and size props and Griffel tokens for branding, spacing and focus treatment.

## Accessibility

**Requirements**: The interactive element reached through DialogTrigger must satisfy WCAG 2.1.1 (Keyboard) and 4.1.2 (Name, Role, Value): it needs an accessible name, an appropriate role, and full keyboard operation, which is why the trigger enhancement applies ARIA button semantics to a non-button child. A visible focus indicator meeting 2.4.7 (Focus Visible) is required, and the focus indicator should use the theme's focus stroke token so it remains visible on both light and dark themes. Target size (2.5.8 / 2.5.5 in WCAG 2.2) applies to the wrapped control, so keep it at least as large as a standard Fluent button. The dialog that is opened must have an accessible name via DialogTitle, must move focus into the surface when it opens, must trap focus while modal, must close on Escape, and must return focus to the trigger on dismissal so that 2.4.3 (Focus Order) is preserved.

| Key | Action |
| --- | --- |
| `Enter` | Activates the trigger child and performs its action, opening the dialog or closing the one that contains it. |
| `Space` | Activates the trigger child with the same result as Enter, matching standard button behavior once the child has been enhanced to ARIA button semantics. |
| `Escape` | Dismisses an open modal dialog; focus is restored to the element that triggered it. |
| `Tab` | Moves focus to the next focusable element; while a modal dialog is open, focus remains inside the dialog surface and cycles instead of reaching the page behind it. |
| `Shift+Tab` | Moves focus to the previous focusable element, cycling within the dialog surface while a modal dialog is open. |

**ARIA**: role="button" — applied automatically to non-button children by the trigger mechanism unless disableButtonEnhancement is set, aria-haspopup="dialog" — communicates that activating the trigger opens a dialog rather than a menu or listbox, aria-expanded — reflects whether the associated dialog is currently open so assistive technology can announce state changes, aria-controls — associates the trigger with the id of the dialog surface it opens, aria-disabled — used instead of the disabled attribute when the trigger child must remain perceivable but non-operable, aria-label / aria-labelledby — supplies the accessible name when the child's visible text is not descriptive on its own, aria-labelledby on the dialog surface — points at the DialogTitle that names the dialog, aria-modal="true" — set on modal dialog surfaces so screen readers confine navigation to the dialog

**Screen Reader**: A screen reader announces the trigger as a button with its accessible name, and because the child is enhanced rather than wrapped, the announcement reflects the control the user actually sees rather than an extra anonymous element. Activating it announces the newly opened dialog, which is named through DialogTitle and, for modal dialogs, marked as modal so virtual cursor navigation is restricted to the surface contents. Content inside the surface, including headings, fields and the action buttons in DialogActions, is then read in normal DOM order. When the dialog closes via Escape or a close trigger, focus returns to the original trigger element and its name is announced again, giving users a clear position on the page. If the trigger is used purely as a dismissal control it should still carry a meaningful label such as 'Cancel' or 'Close' rather than an icon with no accessible name.

## Styling

DialogTrigger is a behavior-only component: it does not create a DOM node, so className, style and any appearance props you pass flow to the cloned child. Style the child directly with a Fluent Button appearance such as primary, secondary, outline, subtle or transparent rather than reaching into the trigger. When building a custom trigger child, use Griffel tokens for consistency: tokens.colorBrandBackground, tokens.colorBrandBackgroundHover and tokens.colorBrandBackgroundPressed for a primary call to action with tokens.colorNeutralForegroundOnBrand text; tokens.colorNeutralBackground1 with tokens.colorNeutralStroke1 and tokens.colorNeutralForeground1 for a secondary button; tokens.borderRadiusMedium for corner rounding; tokens.spacingHorizontalM and tokens.spacingVerticalS for internal padding; and tokens.fontFamilyBase with tokens.fontSizeBase300 and tokens.fontWeightSemibold for label typography. Always define a focus style using tokens.colorStrokeFocus2 (paired with a tokens.colorNeutralStroke1 base border) so the trigger is keyboard discoverable, and animate state changes with tokens.durationNormal and tokens.curveEasyEase for hover and pressed feedback. Because DialogTrigger adds no wrapper, there is no extra margin or layout box to clear, but that also means flex or grid layout for the trigger must be applied to the child or its container.

## Performance

DialogTrigger adds no extra DOM node; it clones and augments the child, so it costs essentially nothing at render time beyond a small amount of prop merging and context subscription. The real cost lives in the dialog it opens: keep the subtree inside DialogSurface light, since dialogs typically mount their content when shown, meaning heavy charts, large lists or expensive data fetching inside a dialog are created per opening rather than kept resident. Avoid recreating inline handlers on the child on every render when they are unnecessary, because they are merged with the trigger's own handlers on each clone, and give the trigger a stable identity in lists so it is not remounted on each parent render. When several triggers point at the same dialog, render the dialog once rather than per trigger. If a dialog is opened and closed rapidly, prefer a single trigger with a stable label over swapping trigger elements, which would force the cloned child to remount.

## Theming & Tokens

DialogTrigger itself consumes no theme tokens because it renders nothing, but the child it wraps and the dialog it opens both read from the FluentProvider theme. A child Button uses tokens.colorBrandBackground, tokens.colorBrandBackgroundHover, tokens.colorBrandBackgroundPressed and tokens.colorNeutralForegroundOnBrand for the primary appearance, tokens.colorNeutralBackground1, tokens.colorNeutralStroke1 and tokens.colorNeutralForeground1 for secondary, and tokens.colorNeutralForeground1 plus tokens.colorSubtleBackgroundHover for subtle variants. Focus indicators should use tokens.colorStrokeFocus2, which is designed to stay visible against surrounding surfaces in every theme. The opened DialogSurface picks up tokens.colorNeutralBackground1 for its background, tokens.shadow64 for elevation, tokens.colorNeutralForeground1 for text and tokens.borderRadiusXLarge for its corners, with scrim and backdrop treatment derived from the same neutral palette. Because everything is token-based, switching between webLightTheme, webDarkTheme and the Teams themes automatically restyles the trigger, its focus ring and the dialog surface without component-level overrides.

## Migration Notes

DialogTrigger is new in v9 and has no direct v8 equivalent. In v8 dialogs were typically controlled imperatively by toggling a hidden state from a button's click handler and rendering the dialog conditionally, with visible/hidden toggles handled by the component itself. The v9 composition moves that responsibility into the JSX structure: DialogTrigger declares intent next to the element it activates, and the dialog's visibility can still be controlled by the consumer when the trigger's built-in toggling should be overridden. When porting, replace the imperative click handler with a DialogTrigger wrapping the same control, move the dialog content into DialogSurface with DialogTitle, DialogBody, DialogContent and DialogActions, and delete any now-redundant state that only existed to show and hide the dialog. If the old code relied on a programmatic close from deep inside the dialog, add a close trigger inside the surface instead of wiring a callback.

## Edge Cases

- The default action is positional: a DialogTrigger outside DialogSurface opens, and one inside it closes. Moving the trigger subtree during refactoring, or rendering a dismissal control in a portal outside the surface, flips the behavior unless action is set explicitly.
- disableButtonEnhancement is only safe with a child that already provides button semantics — a real button element, or a component exposing role="button" with its own tabIndex and key handling. With any other child, the trigger becomes keyboard-inaccessible.
- Custom children must forward refs and spread incoming props onto their root element, because DialogTrigger passes merged handlers, ARIA attributes, tabIndex and a ref down to the child; a child that drops or swallows these props will appear not to work.
- Multiple DialogTriggers can target the same dialog, which is useful for opening from several places, but each one must be given the correct action when it is not in the default open position, and only one dialog instance should be rendered for the group.
- If the dialog's visibility is controlled by the consumer, the trigger's built-in toggling can be overridden or ignored; in that case make sure the controlled value and the onOpenChange-style callback keep the two in sync, otherwise Escape or backdrop dismissal may leave the UI out of step.
- Escape dismissal and focus restoration only apply while the dialog is open and modal; in non-modal or nested dialog scenarios focus handling differs, so verify focus order manually and keep the trigger's accessible name meaningful for users returning to the page.
- A trigger whose child is disabled cannot be activated at all, since disabled buttons do not dispatch click events; use a disabled-state treatment that keeps the control perceivable and explain why the action is unavailable rather than relying on a silent disabled trigger.

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
