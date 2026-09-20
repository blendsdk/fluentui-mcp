# DialogBody

> **Package**: `@fluentui/react-dialog` v9.18.1
> **Import**: `import { DialogBody } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

DialogBody is the content region of a modal dialog in Fluent UI React v9. It renders a single div (exposed through the required root slot) that holds the main text, forms, media, or other body content between the dialog's title area and its actions. DialogBody is designed to live inside DialogContent, where it participates in the dialog surface's grid layout and absorbs the surface's spacing, typography, and background tokens. By default it contributes the standard content padding and margins so body text aligns with the title and footer; the fluid prop strips that decoration so a body can stretch edge-to-edge for hero images, tabs, banners, or full-bleed regions. It is a purely presentational container: it owns no focus trapping, no open/close state, and no ARIA semantics of its own. Those responsibilities belong to the surrounding Dialog family — Dialog, DialogSurface, DialogContent, DialogTitle, DialogActions, and DialogTrigger (with the action and disableButtonEnhancement props), whose open, defaultOpen, onOpenChange, modalType, unmountOnClose, inertTrapFocus, backdrop, and backdropMotion props govern whether and how the body is presented. The position prop (DialogActionsPosition) belongs to the sibling actions region and determines where the footer sits relative to the body.

**When to use**: Use DialogBody whenever you build a dialog that has more than a title — it is the place for explanatory text, descriptions, form fields, validation messages, or scrollable content. Reach for it instead of putting content directly on DialogSurface or DialogContent so you inherit the correct padding, line height, and grid placement, and so the dialog keeps a predictable structure of title, body, and actions. Use fluid when the body must visually escape the standard padded frame, for example a full-width image, a tab strip that should touch the surface edges, or a banner-style message. Do not use DialogBody as a page-level container outside a dialog, and do not use it to implement a Drawer or Popover body — those components have their own body primitives. If the content is short and single-purpose (yes/no confirmation), a title plus DialogActions may be sufficient, but adding a DialogBody with one concise sentence improves screen reader context because the body is what assistive technology announces inside the dialog.

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

### Prop Guidance

- **fluid**: Removes the default margin and padding around the body and lets it stretch to fill the dialog surface, which is what you want for hero images, tab strips, banners, or any content that must be flush with the surface edges. When enabled, re-add your own inner spacing so text does not touch the border. `true`
- **appearance**: Chooses between a dimmed, filled body treatment and a transparent one that lets the parent dialog surface background show through. Use dimmed for inset or secondary regions inside a dialog and transparent when the body should blend seamlessly with DialogContent. `transparent`
- **position**: A DialogActionsPosition value that belongs to the actions region rather than the body itself; it governs whether the footer sits at the bottom of the dialog or is positioned relative to the body. Set it on DialogActions so the body's scrollable area and the footer line up as intended. `absolute`
- **root**: The required div slot that becomes the body element. Use it to attach a custom className, id, data attributes, or event handlers, and to merge refs when you need to measure the scrollable region. `div`
- **children**: The body content itself: paragraphs, fields, lists, images, or scrollable regions. Keep it focused on explanation or data entry — actions and the dialog title belong in DialogActions and DialogTitle respectively. `Text, Field, and other content elements`
- **open**: Controlled visibility of the dialog that owns this body. When you drive the dialog from parent state, the body renders only while this value is true, so keep background content inert and avoid duplicating open state internally. `true`
- **defaultOpen**: Uncontrolled initial visibility for the dialog. Use it for simple cases where the dialog opens itself; switch to open plus onOpenChange when another part of the app must control the body's visibility. `true`
- **onOpenChange**: Callback invoked with the new open value and the triggering event, whether the change came from Escape, a trigger, or the backdrop. Use it to run focus restoration, save drafts, or block dismissal while the body contains unsaved input. `(event, data) => setOpen(data.open)`
- **modalType**: Decides whether the dialog behaves as modal, non-modal, or alert. Modal and alert dialogs trap focus while the body is visible; alert disables Escape dismissal, which is appropriate only for critical interruptions. `modal`
- **unmountOnClose**: Controls whether the body subtree is destroyed when the dialog closes. Leaving it enabled keeps memory and DOM small but resets scroll position and internal field state each time; disable it when the body holds expensive content you want to preserve. `true`
- **inertTrapFocus**: When enabled, focus movement is restricted and background content is made inert so keyboard users cannot tab out of the dialog while the body is on screen. Leave it on for modal dialogs and relax it only for deliberately non-modal flows. `true`
- **backdrop**: Slot for the backdrop rendered behind the surface. Customize it when the body content requires a different scrim, such as a lighter overlay over a busy map or image. `custom backdrop element`
- **backdropMotion**: Slot for the backdrop's motion definition using fade params; tune the duration or disable motion when the body contains animated content that would otherwise compete with the entrance transition. `fade motion slot`
- **action**: Describes what a DialogTrigger does — open the dialog, close it, or toggle it. Use open for buttons that reveal the body and close for cancel or confirm buttons inside or near the body. `open`
- **disableButtonEnhancement**: Turns off the trigger's automatic button enhancement. Set it when a control near the body is a trigger but should look like a plain button, such as a custom-styled secondary action. `true`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Place DialogBody between DialogTitle and DialogActions inside DialogContent so the dialog's grid produces consistent vertical rhythm.
- Keep body copy concise and scannable; a dialog body should explain the consequence or request one focused piece of information.
- Use fluid only when the content genuinely needs to bleed to the surface edges, such as an illustration, a tab list, or a full-width message bar.
- When fluid is applied, re-establish your own inner padding with spacing tokens so text and controls do not touch the dialog border.
- Constrain very long bodies with a max height and vertical overflow so DialogActions stays reachable without scrolling the whole surface.
- Give any form inside the body its own Field and Label components, and let validation messages live inside the body rather than in the footer.
- Keep a single scrollable region in the dialog — normally the body — instead of making both the body and the surface scroll.
- Compose the dialog's open state and dismissal through Dialog's open, defaultOpen, and onOpenChange props rather than hiding DialogBody manually.

### Don'ts

- Don't render DialogBody outside a Dialog; without the surrounding surface it is just an unstyled div with no dialog semantics.
- Don't put the dialog's primary and secondary buttons in the body — they belong in the DialogActions region so position and keyboard order stay predictable.
- Don't duplicate the dialog title inside the body; the title already provides the accessible name for the surface.
- Don't use fluid as a shortcut to remove padding on ordinary text bodies, because text will collide with the surface edge and look misaligned with the title.
- Don't set your own fixed widths or absolute positioning on the body; let the surface's grid and DialogContent control sizing.
- Don't rely on the body to close the dialog — dismissal should be handled by Dialog, DialogTrigger, or a cancel action in DialogActions.
- Don't nest a second dialog or a Popover that can outlive the dialog inside the body without managing focus, since the dialog traps focus while open.
- Don't assume the body stays mounted when it is closed; with unmountOnClose enabled the entire subtree is removed and re-created on the next open.

## Anti-Patterns

### Using DialogBody without a Dialog

❌ DialogBody is only a styled div. Outside Dialog and DialogSurface it provides none of the dialog semantics — no role, no focus trap, no Escape handling — so screen reader users never learn that a modal context opened.

✅ Always render DialogBody inside DialogSurface and DialogContent, and let Dialog own open, defaultOpen, onOpenChange, and modalType.

### Putting actions inside the body

❌ Primary and secondary buttons placed in the body fall outside the DialogActions region, breaking the expected tab order, defeating the position prop, and leaving users to scroll to find the confirm button.

✅ Keep text, media, and form fields in DialogBody and move all commit, cancel, and dismiss buttons into DialogActions.

### Overusing fluid to remove padding

❌ Applying fluid to ordinary prose removes the margins that align the body with DialogTitle, so text touches the surface edge and the dialog looks broken, especially on narrow viewports.

✅ Reserve fluid for genuinely edge-to-edge content such as images, tabs, or message bars, and re-apply spacing tokens inside the fluid body so content keeps a safe inset.

### Unbounded body causing the footer to scroll away

❌ A long body without a height constraint grows the surface until DialogActions is pushed below the viewport, forcing users to scroll the entire dialog and making the confirm action hard to reach.

✅ Constrain the body with a max height and vertical overflow so only the body scrolls while the title and actions stay pinned, and keep the scrolling region keyboard reachable.

### Duplicating the title in the body

❌ Repeating the dialog title as the first line of DialogBody produces a duplicated announcement and can conflict with the surface's aria-labelledby and aria-describedby relationship.

✅ Let DialogTitle provide the accessible name and start the body with the descriptive sentence that belongs in aria-describedby.

## Accessibility

**Requirements**: DialogBody itself has no ARIA role and must never be the element that carries the dialog semantics — the enclosing DialogSurface provides role dialog or alertdialog depending on the modalType prop, along with aria-modal. Ensure the surface is named by the DialogTitle through aria-labelledby and, when the body supplies the primary explanation, referenced by aria-describedby so the description is announced when the dialog opens. Because DialogBody is inside the focus trap, every interactive element it contains must be reachable by keyboard in DOM order and must have a visible focus indicator. Text inside the body should meet WCAG 1.4.3 contrast (4.5:1 for body text, 3:1 for large text) against the surface background, and any error or status text should not rely on color alone. If the body shows dynamically updated status, place that message in a live region so it is announced, since the dialog context does not automatically announce content changes.

| Key | Action |
| --- | --- |
| `Escape` | Requests dismissal of the whole dialog; the body has no handler of its own, but content inside it must not swallow Escape. |
| `Tab` | Moves focus to the next focusable element inside the dialog, including links, fields, and controls placed in the body. |
| `Shift+Tab` | Moves focus to the previous focusable element; when focus leaves the dialog it is cycled back into the trapped region. |
| `Enter` | Activates a focused button, link, or submit control inside the body or its form. |
| `Space` | Activates buttons, checkboxes, and switches inside the body; also scrolls the body when a non-interactive scrollable area has focus. |
| `Arrow Up / Arrow Down` | Scrolls a focused scrollable body region and moves between options in list-style content such as radio groups or listboxes. |
| `Home / End` | Moves to the first or last item when focus is inside a composite widget in the body, such as a listbox or grid. |

**ARIA**: aria-labelledby, aria-describedby, aria-modal, role (dialog or alertdialog, set by the parent surface), aria-live, aria-hidden / inert on background content

**Screen Reader**: Screen readers enter a modal context when the dialog opens; the browser moves focus to the first focusable element inside the trapped region, often a control in DialogBody or the first action. The dialog's accessible name comes from DialogTitle via aria-labelledby, and when the surface references DialogBody content through aria-describedby the description is read immediately after the name, so the first paragraph of the body should stand on its own as a summary. Content in DialogBody is otherwise announced only as the user navigates into it, in DOM order, so headings, Field and Label pairs, and list structures inside the body should be marked up semantically. When the body is unmounted on close, its content disappears from the accessibility tree entirely; when it stays mounted, background content remains inert and hidden from assistive technology while the dialog is open.

## Styling

Style DialogBody through the className prop on its root div using makeStyles and mergeClasses. The default body is a block container that inherits the surface's font (tokens.fontFamilyBase) and text color (tokens.colorNeutralForeground1); override margins with tokens.spacingVerticalMNudge and tokens.spacingHorizontalMNudge to match the built-in rhythm, and adjust inner padding with tokens.spacingVerticalL and tokens.spacingHorizontalXXL when you need a roomier layout. Secondary copy inside the body reads well with tokens.colorNeutralForeground2 or tokens.colorNeutralForeground3 and tokens.fontSizeBase200 with tokens.lineHeightBase200. For a dimmed appearance, use a filled surface such as tokens.colorNeutralBackground2 or tokens.colorNeutralBackground4 on the body container; for a transparent appearance, let the parent surface background (tokens.colorNeutralBackground1) show through and avoid adding your own background at all. Fluid bodies lose the built-in margin and padding, so re-apply spacing with tokens.spacingHorizontalXXL or tokens.spacingHorizontalL, and add borderRadius inherit when an edge-to-edge scrollable region would otherwise clip against the surface's rounded corners. If the body scrolls, prefer overflow-y auto with a maxHeight expressed in tokens such as tokens.spacingVerticalXXL multiplied through a custom value, and hide the scrollbar only when the same content is reachable by keyboard. Focus outlines drawn on edge-to-edge controls may be clipped by the surface: add tokens.spacingHorizontalXS of inner padding or verify the indicator against a forced-colors friendly outline token such as tokens.colorStrokeFocus2.

## Performance

DialogBody is a lightweight container, so its own render cost is negligible; the performance question is what you put inside it and whether that subtree is mounted. With unmountOnClose enabled, everything in the body is destroyed and rebuilt on every open, which resets field state and scroll position but keeps the DOM and memory footprint small — ideal for simple dialogs. For bodies holding heavy content such as DataGrid, FlatTree, or media, consider keeping the dialog mounted, or memoize the body's children so parent re-renders triggered by open and onOpenChange do not re-render expensive descendants. Avoid measuring the body on every render; read scroll dimensions in a layout effect tied to open or to content changes instead. Large scrollable lists inside the body benefit from list virtualization, while very tall image or chart bodies should be sized explicitly to avoid layout thrash when the dialog animates open. Because the body is trapped, avoid mounting additional portals (Popover, Menu, Tooltip surfaces) that are not strictly needed, since each adds focus-management work while the dialog is open.

## Theming & Tokens

DialogBody inherits its typography and color from the surface rather than defining its own: text uses tokens.colorNeutralForeground1 over tokens.colorNeutralBackground1, and secondary copy should use tokens.colorNeutralForeground2 or tokens.colorNeutralForeground3. Font family and size come from tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300, so a FluentProvider theme change flows straight into the body. Spacing follows the same token scale used by the rest of the dialog — tokens.spacingVerticalMNudge and tokens.spacingHorizontalMNudge for the default rhythm, tokens.spacingVerticalL and tokens.spacingHorizontalXXL padding for roomier layouts, and tokens.spacingHorizontalXXL when re-insetting a fluid body. Dimmed body treatments should be built from tokens.colorNeutralBackground2 or tokens.colorNeutralBackground4 with hover states from tokens.colorNeutralBackground2Hover, while borders inside the body use tokens.colorNeutralStroke1 and focus indicators use tokens.colorStrokeFocus2. High contrast and forced-colors modes remap the neutral background, foreground, and stroke tokens to system colors, so always express custom body styling with these tokens instead of hard-coded colors.

## Migration Notes

DialogBody is a v9-only component; the v8 Dialog family had no dedicated body element and authors placed content directly in DialogContent or DialogFooter. When porting a v8 dialog, move the descriptive content into DialogBody inside DialogContent, and move button rows into DialogActions so the footer positioning handled by position continues to work. v9 also exposes previously implicit behaviors as explicit props on the surrounding Dialog: open, defaultOpen, and onOpenChange replace v8's manual visibility flags, while unmountOnClose and inertTrapFocus control whether the body subtree is destroyed on close and whether background content is made inert. Triggers and buttons rendered inside the body should keep disableButtonEnhancement in mind, because the dialog trigger wrapper alters button behavior and should be disabled when a trigger is not actually meant to open the dialog. Where a v8 dialog relied on custom padding hacks, use fluid plus explicit spacing tokens instead of overriding internal styles.

## Edge Cases

- DialogBody renders only as a valid structural part of a Dialog; if it is not placed inside DialogContent the fluid grid placement and scroll behavior do not apply and it behaves like a plain div.
- A fluid body removes the default margin and padding entirely, so any text or control inside it will touch the dialog border unless you add spacing back yourself.
- Content taller than the surface pushes DialogActions out of view; without an explicit max height and vertical overflow on the body, users must scroll the whole dialog to reach the confirm button.
- Edge-to-edge fluid content with its own scrolling can clip focus outlines and rounded corners against the dialog surface, so the body may need borderRadius inherit and a small inner padding.
- When unmountOnClose is enabled, scroll position, uncontrolled input values, and animation state inside the body are lost every time the dialog closes and reopens.
- With inertTrapFocus enabled, Popover, Menu, or Tooltip surfaces rendered from inside the body still participate in the dialog's focus management, so a portaled element that escapes the surface can break tab order.
- An alert dialog via modalType blocks Escape dismissal, so a body with unsaved input needs an explicit cancel action in DialogActions rather than relying on Escape.

## See Also

- [feedback category](../categories/feedback.md)
- [form-dialog recipe](../recipes/modals/form-dialog.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
