# DialogTitle

> **Package**: `@fluentui/react-dialog` v9.18.1
> **Import**: `import { DialogTitle } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

DialogTitle renders the heading of a Dialog. It is a small, slot-based component whose required root slot defaults to an h2 element, so assistive technology can use the title text as the dialog's accessible name through the dialog's aria-labelledby wiring. The title also exposes an optional action slot for trailing content such as a close button; by default a Dialog with modalType set to non-modal renders a close button as that action. DialogTitle is part of the Dialog family of components and is intended to be composed inside DialogSurface together with DialogBody, DialogContent, and DialogActions. Because it participates in the dialog's naming, its text, heading level, and role matter for both visual hierarchy and screen reader output.

**When to use**: Use DialogTitle whenever you build a Dialog and the dialog needs a visible, announced title — which is nearly always. It is the only component in the Dialog family that provides the dialog's accessible name, so a dialog without it is announced without context. Prefer DialogTitle over Text or a raw heading element inside a dialog, because only DialogTitle participates in the dialog's labeling and surface styling. Use DialogTitle when the surface has a single, short, descriptive heading; if you need a lightweight label attached to a non-dialog surface, use Tooltip or a plain heading, and if you need the guided, multi-step experience of a TeachingPopover, use TeachingPopoverTitle instead. Long-form explanatory copy belongs in DialogBody or DialogContent, not in DialogTitle.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `action` | `Slot<'div'>` | — | No | — |
| `action` | `DialogTriggerAction` | — | No | — |
| `appearance` | `'dimmed' \| 'transparent'` | — | No | — |
| `backdrop` | `Slot<DialogBackdropSlotProps>` | — | No | — |
| `backdropMotion` | `Slot<PresenceMotionSlotProps<FadeParams>>` | — | Yes | — |
| `children` | `[JSXElement, JSXElement] \| JSXElement` | — | Yes | — |
| `defaultOpen` | `boolean` | — | No | — |
| `disableButtonEnhancement` | `boolean` | — | No | — |
| `fluid` | `boolean` | — | No | — |
| `inertTrapFocus` | `boolean` | — | No | — |
| `modalType` | `DialogModalType` | — | No | — |
| `onOpenChange` | `DialogOpenChangeEventHandler` | — | No | — |
| `open` | `boolean` | — | No | — |
| `position` | `DialogActionsPosition` | — | No | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'div'>` | — | Yes | — |
| `root` | `Slot<'h2', 'h1' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'div'>` | — | Yes | — |
| `unmountOnClose` | `boolean` | — | No | — |

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `action` | — | No | By default a Dialog with modalType='non-modal' will have a close button action |
| `root` | — | Yes | By default this is a h2, but can be any heading or div, if `div` is provided do not forget to also provide proper `role="heading"` and `aria-level` attributes |

## Best Practices

### Do's

- Render exactly one DialogTitle inside each DialogSurface so every dialog has a stable accessible name.
- Keep the title text short and declarative — a phrase or a single sentence that names the decision or task the dialog presents.
- Pick the root element that matches the surrounding heading outline: h1 through h6 are all valid, and the default h2 is appropriate for most top-level dialogs.
- If you override root to a div, always pair it with role set to heading and an explicit aria-level so heading navigation and the accessible name still work.
- Use the action slot for trailing, non-essential controls such as an icon-only close or overflow button rather than embedding interactivity in the title text.
- Place DialogTitle as the first child of the dialog surface so the reading order and visual order agree for keyboard and screen reader users.
- Label any icon-only control you place in the action slot with aria-label so the title's announced text stays clean.

### Don'ts

- Don't render DialogTitle outside of a Dialog and DialogSurface composition; it loses its dialog context, its accessible-name wiring, and its surface-relative styling.
- Don't render two DialogTitles in a single dialog; duplicate titles produce an ambiguous, confusingly announced dialog name.
- Don't override the root slot to a plain div without role set to heading and an aria-level value — the title then disappears from heading navigation.
- Don't place paragraphs, instructions, or error text in the title; move that content into DialogBody or DialogContent.
- Don't nest links, buttons, or other interactive elements inside the title children; use the action slot for controls.
- Don't add a second dismiss affordance when a non-modal dialog already renders a default close button in the action slot.
- Don't rely on font size, weight, or color alone to communicate the importance of a dialog; the heading element carries that meaning semantically.

## Accessibility

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
