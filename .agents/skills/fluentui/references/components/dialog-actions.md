# DialogActions

> **Package**: `@fluentui/react-dialog` v9.18.1
> **Import**: `import { DialogActions } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

DialogActions is a layout container that groups a dialog's action buttons (typically a cancel/secondary action plus one confirm/primary action) into a dedicated region at the bottom of a dialog. It is designed to live inside the dialog surface alongside DialogTitle, DialogBody and DialogContent, and it participates in the surface's internal grid so its placement is predictable without manual layout work. The component renders a single root slot element and adds no interaction logic of its own, so the behavior a user perceives comes from the Button, MenuButton, SplitButton or Link children that are placed inside it. Two props shape the layout: position determines whether the action group sits at the start or the end of the surface's action row, and fluid makes the action group stretch to the full width of the dialog body, which is useful on narrow or mobile-sized surfaces. Because it is purely presentational and unstyled beyond the design-system spacing, DialogActions is a safe place to apply custom Griffel styles for gaps, wrapping and alignment.

**When to use**: Use DialogActions whenever a Dialog requires the user to commit, dismiss or choose between outcomes, so the buttons are grouped consistently at the bottom of the surface and align with other Fluent dialogs. Use it for confirmation dialogs (a single primary action), for dialogs with a cancel/confirm pair, and for dialogs whose confirm action triggers an asynchronous operation (the pending state lives on the child Button, not on DialogActions). Use the position prop when the design calls for actions to be anchored at the start of the row, and use fluid when the dialog is displayed on small viewports or inside a Drawer-like constrained container where full-width stacked actions read better. Avoid it for simple informational dialogs with no decision to make (omit the action region entirely and rely on DialogTitle and DialogContent), and avoid using it as a general-purpose toolbar or button row outside of a dialog surface — it only makes sense in the dialog grid.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `fluid` | `boolean \| undefined` | `false` | No | Makes the actions expand the entire width of the DialogBody |
| `position` | `DialogActionsPosition \| undefined` | `'end'` | No | defines the position on the dialog grid of the actions |

### Prop Guidance

- **position**: Controls where the action group is placed in the dialog surface's internal grid. The default 'end' value matches the conventional placement of cancellation and confirmation actions at the trailing edge of the dialog. Switch to the start value only when the design language of your product deliberately anchors actions at the leading edge; because start and end are logical, the placement mirrors automatically in right-to-left locales. `end`
- **fluid**: When enabled, the actions expand to the entire width of the dialog body, which is the recommended treatment for compact or mobile-sized dialogs and for surfaces where stacked, full-width buttons are easier to hit. Leave it at the default of false for standard desktop dialogs where right-aligned, intrinsic-width buttons are expected. `true`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Place DialogActions as a sibling of DialogTitle and DialogBody/DialogContent inside the dialog surface so the surface grid can position the action region correctly.
- Order actions according to the Fluent convention: the secondary/dismissive action first and the primary/confirm action last, so the primary action is the right-most (or left-most in RTL) element.
- Limit the action region to one or two buttons; keep the decision focused and use a MenuButton only when genuinely secondary options exist.
- Give the primary action a verb that describes the outcome (for example, a specific commit label) rather than a generic confirmation label, so users know exactly what will happen.
- Set position to place the group where the design requires, and leave it at its default 'end' value for standard dialogs that follow platform conventions.
- Use fluid on narrow surfaces or in responsive layouts so the action buttons expand across the dialog body and remain comfortable touch targets.
- Reflect pending and destructive semantics on the child buttons — for example a loading state while an async confirm is in flight, or a destructive appearance for irreversible actions — rather than hiding or re-ordering the actions.

### Don'ts

- Don't render more than one primary-looking action; competing emphasis forces users to read every button before deciding.
- Don't use DialogActions as a generic footer for non-dialog content, and don't render it outside of a DialogSurface, where its position prop has nothing to position against.
- Don't place DialogActions inside DialogBody/DialogContent — it belongs with the other dialog layout regions so spacing and alignment stay consistent.
- Don't disable the cancel/dismiss action to force a choice; keep an escape hatch available and instead disable or block only the action that cannot proceed.
- Don't encode meaning purely with color or iconography inside the action buttons — every action needs a visible, meaningful text label (or an accessible name if it is icon-only).
- Don't override the action layout with ad-hoc absolute positioning or negative margins; use the position and fluid props plus className-based Griffel overrides for gap, alignment and wrapping.

## Anti-Patterns

### Competing primary actions

❌ Rendering multiple high-emphasis buttons inside DialogActions destroys the visual hierarchy and makes it unclear which action commits the dialog, increasing the chance of an accidental destructive choice.

✅ Keep a single primary action and render everything else with a neutral or subtle appearance; if more than two options genuinely exist, demote the extra ones into a MenuButton instead of adding more buttons.

### Unlabeled icon-only actions

❌ An icon-only button placed in the action region without an accessible name is announced by screen readers as an unnamed button, and the meaning of the glyph may be ambiguous for sighted users as well.

✅ Either pair the icon with a visible text label or supply an explicit accessible name with aria-label on the child button, and add a Tooltip for sighted users who do not recognize the icon.

### Hiding the exit path while async work runs

❌ Removing or disabling the cancel action during a long-running confirm operation traps users in the dialog with no way out and gives no feedback that work is in progress.

✅ Keep the dismissive action available (Escape and the close affordance should still function), put the pending state on the confirming button with an aria-busy signal, and only block the confirm action while the request is in flight.

### Fighting the grid with manual positioning

❌ Using absolute positioning, floats or negative margins on the DialogActions root to move buttons around breaks the dialog surface's grid, clips content at small sizes and produces inconsistent spacing across dialogs.

✅ Use the position prop to choose the placement, fluid to make the actions span the body, and className-based Griffel styles limited to gap, alignment, wrapping and padding.

### Using DialogActions as a generic footer

❌ Repurposing the action region for informational footers, links or unrelated chrome mixes unrelated semantics into the dialog's decision area and can confuse assistive technology users about what the buttons will do.

✅ Reserve DialogActions for the controls that resolve the dialog; put supplementary information in DialogBody or DialogContent, and omit the action region entirely for purely informational dialogs.

## Accessibility

**Requirements**: DialogActions itself is a non-interactive container, so the WCAG obligations fall on its children and on the parent Dialog. Every action must be a real focusable control (Button, MenuButton, SplitButton or Link) with a discernible accessible name, and any icon-only action must supply an accessible name such as aria-label. The dialog as a whole must satisfy the modal dialog pattern: focus is moved into the dialog when it opens, focus is trapped inside while it is open, and focus returns to the invoking element when it closes — this is provided by Dialog and DialogSurface, not by DialogActions. Because the dialog title is associated with the surface through DialogTitle's generated id and the surface's aria-labelledby, the action buttons should never be used to carry that naming relationship. Interactive targets must meet minimum target size and contrast requirements; destructive or brand-colored actions inherit their contrast from the theme's color tokens. Do not rely on color alone to convey the destructive or primary nature of an action.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus forward through the focusable actions in the region, then out to the next focusable element inside the trapped dialog scope. |
| `Shift+Tab` | Moves focus backward through the actions and back toward the dialog body. |
| `Enter` | Activates the currently focused action button. |
| `Space` | Activates the currently focused action button, matching native button behavior. |
| `Escape` | Requests that the dialog close; this is handled by the dialog surface, not by DialogActions. |
| `ArrowDown` | Opens or navigates a menu when the action is a MenuButton or SplitButton menu trigger. |
| `ArrowUp` | Moves to the previous option when a menu opened from an action is expanded. |
| `Home / End` | Moves to the first or last option inside an expanded menu opened from an action, when the menu supports it. |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-disabled, aria-busy, aria-haspopup, aria-expanded

**Screen Reader**: The DialogActions root is a plain container and is not announced as a landmark or group, so assistive technology users hear the controls inside it in DOM order. When the dialog opens, focus lands inside the dialog and screen readers announce the dialog together with its accessible name derived from DialogTitle through the surface's aria-labelledby relationship, followed by the content region. As users Tab through the actions, each button is announced with its role, accessible name and state (disabled, busy or expanded for menus). Actions that trigger asynchronous work should expose aria-busy on the acting button so a pending state is announced instead of silently doing nothing. Icon-only actions are announced using whatever accessible name is supplied with aria-label, so omitting that name produces an unlabeled button announcement such as "button" with no context.

## Styling

DialogActions has a minimal visual footprint, so most customization is about spacing, alignment and wrapping on the root slot. Use makeStyles from @fluentui/react-components at module scope and apply the resulting class through className; style the root with display 'flex', alignItems 'center', justifyContent 'flex-end' (or 'center' with position 'start') and a gap built from tokens.spacingHorizontalS or tokens.spacingHorizontalM. When actions may overflow on narrow dialogs, add flexWrap 'wrap', a rowGap such as tokens.spacingVerticalS, and allow buttons to grow by combining a flexGrow with the fluid prop. Padding overrides should reuse the dialog rhythm: tokens.spacingVerticalM and tokens.spacingHorizontalL are typical for the surface's action band, and if you need a separating line above the actions use tokens.colorNeutralStroke1 with a border-top width of tokens.strokeWidthThin. Use shorthands from @fluentui/react-components (for example padding, gap and border) instead of writing long-hand strings, and prefer logical properties so the layout mirrors correctly in RTL. Reach for tokens.borderRadiusMedium only if you deliberately turn an action into a styled surface; normally buttons keep their own theme-driven radius. Avoid hard-coded pixel values and raw hex colors so the dialog continues to match the active theme and density.

## Performance

DialogActions is a stateless, single-slot container, so it renders as one element and adds essentially no runtime cost; the cost of a dialog's actions comes from the buttons rendered inside it. Define Griffel styles with makeStyles at module scope rather than inside the render function, because creating styles during render forces extra class resolution work on every dialog open. Because dialogs are often mounted conditionally, keep the children of DialogActions cheap to construct — avoid building large option lists or heavy nested components inside the action region and instead put complex content in DialogBody or DialogContent. If an action triggers asynchronous work, drive the pending state with local component state on the button rather than re-rendering the whole dialog surface, and avoid recreating inline handler closures for the whole action set on each keystroke of a controlled input elsewhere in the dialog.

## Theming & Tokens

DialogActions inherits spacing, color and typography from the nearest FluentProvider theme, so switching between light, dark and high-contrast themes or a custom brand theme requires no changes in the action region itself. Its layout defaults are derived from design tokens such as tokens.spacingHorizontalM, tokens.spacingHorizontalL, tokens.spacingVerticalM and tokens.spacingHorizontalS, which come from the theme's spacing ramp and therefore change with density settings. Any overrides you add should also be token-based — for example tokens.colorNeutralBackground1 for a custom backdrop, tokens.colorNeutralStroke1 for a separator, tokens.fontFamilyBase and tokens.fontSizeBase300 for custom text, and tokens.colorBrandBackground with tokens.colorNeutralForegroundOnBrand for brand-emphasized controls. Child buttons resolve their own appearance from theme tokens (brand, neutral, outline, subtle, transparent and destructive variants), so a dialog automatically adopts the themed brand color for its primary action without the action container doing anything. Focus indicators, disabled coloring and motion curves (such as tokens.curveEasyEase and the duration tokens) are likewise supplied by the theme, which keeps custom styling from breaking high-contrast mode if you avoid hard-coded colors.

## Migration Notes

In Fluent UI v9 the dialog layout regions are explicit components, so teams migrating from v8 should move the footer button markup out of DialogFooter-style containers and into DialogActions placed as a direct sibling of DialogTitle and DialogBody/DialogContent inside the dialog surface. Instead of passing a class that flips the footer alignment, use the position prop, and instead of manual full-width button styling on small screens, use fluid. v9 buttons take an appearance prop rather than v8's primary boolean, so the primary emphasis previously set on the footer's confirm button should be expressed on the child Button itself.

## Edge Cases

- The root slot always renders, so an empty DialogActions still occupies grid space and contributes padding inside the dialog surface; omit the component entirely instead of rendering it with no children.
- The position prop uses logical start/end values, so the same value renders on opposite physical sides in right-to-left locales; verify action order still reads correctly when direction is flipped.
- With fluid enabled on a very wide dialog, full-width buttons can look excessively stretched; constrain the surface width or combine fluid with a max-width override on the action group.
- Long action labels in a narrow dialog can overflow or wrap unpredictably; add flexWrap with a rowGap token, or shorten the labels, rather than letting text be clipped.
- Because the component adds no layout of its own beyond the surface grid, dropping extra non-button content into it (badges, help text, icons) can misalign the action row; keep supplementary content in DialogBody or DialogContent.
- DialogActions provides no focus management of its own, so if the dialog is opened without an autofocus target, focus may land on the first action; manage initial focus deliberately when a specific action should be focused first.

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
