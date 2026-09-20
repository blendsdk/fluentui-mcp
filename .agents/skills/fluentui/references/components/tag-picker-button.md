# TagPickerButton

> **Package**: `@fluentui/react-tag-picker` v9.8.8
> **Import**: `import { TagPickerButton } from '@fluentui/react-components';`
> **Category**: forms
> **Stability**: stable

## Overview

TagPickerButton is the trigger affordance of a TagPicker control. It renders as a single root slot that behaves like a compact button (typically presenting a chevron or short action label) and is composed alongside TagPickerGroup, TagPickerInput, and TagPickerList inside a TagPickerControl. Its job is to give users a clear, keyboard-reachable way to expand the list of TagPickerOption items from which tags are chosen or removed. The component exposes a disabled prop so the trigger can be turned off in lockstep with the rest of the picker, and it inherits the button-like visual language of the surrounding form field so it aligns with the TagPickerInput next to it. Because it contains no meaningful text of its own in the common icon-only case, it depends on an accessible name supplied by the author, a sibling Label, or the Field wrapper.

**When to use**: Use TagPickerButton only as the expand/select affordance inside a TagPickerControl, next to a TagPickerInput and a TagPickerGroup. It is the right choice when you have a multi-value, tag-style selection experience and you want the field to show both a text-entry surface and a discoverable drop-down trigger. If you need a standalone button, use Button, CompoundButton, MenuButton, or SplitButton instead. If you need a single-select drop-down without pills, use Dropdown or Combobox. If you need the same visual trigger in a navigation context, use a Nav or Menu composition rather than a picker.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean \| undefined` | — | No | — |

### Prop Guidance

- **disabled**: Set this to true when the picker cannot be opened — for example when the surrounding form section is locked, when the user lacks permission to edit tags, or while a save operation is in flight. Keep it synchronized with the disabled state of TagPickerInput and TagPickerGroup so the entire control reads as one unavailable unit; a disabled trigger next to an editable input is contradictory. Prefer disabling the whole picker over disabling only the trigger, and when the picker is disabled, make sure its purpose is still communicated through the Field label or an aria-describedby hint, because the trigger drops out of the tab order. `disabled={isReadOnly}`
- **root**: The root slot is the underlying element the component renders, and it is the supported extension point for styling and measurement. Use its className, style, and ref to size the trigger, align it with the TagPickerInput, and merge Griffel classes from makeStyles or mergeClasses instead of reaching into internals. Because the slot is required by the component's shape, you never set it yourself; you address it indirectly through the standard className, style, and ref props that flow to it. `className={mergeClasses(styles.trigger, className)}`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Best Practices

### Do's

- Render TagPickerButton as the last child of TagPickerControl, after TagPickerGroup and TagPickerInput, so the visual reading order and the tab order both end at the trigger.
- Give the trigger an accessible name whenever it shows only an icon, using aria-label, a Label bound through Field, or aria-labelledby that points at the picker's label element.
- Keep the trigger reachable even when zero tags are selected, so keyboard and screen reader users can still open the option list.
- Set the disabled prop together with the disabled state of TagPickerInput and TagPickerGroup when the whole picker is unavailable, so the control reads as one coherent disabled unit.
- Let the enclosing TagPicker own open, close, Escape, and outside-click behavior instead of attaching your own click handler to the button.
- Keep the default focus outline and hover/pressed feedback so the trigger remains perceivable against the pill row behind it.
- Give the trigger a stable minimum hit target (roughly 32 pixels tall on desktop, larger on touch) so it is easy to click when pills crowd the field.

### Don'ts

- Don't use TagPickerButton as a general-purpose button outside a TagPicker; it carries picker semantics and has no visible label of its own in the common case.
- Don't ship an icon-only trigger with no accessible name, which leaves assistive technology announcing an unlabeled button.
- Don't disable the trigger alone while TagPickerInput and the tags remain interactive, which presents a contradictory state.
- Don't replace the trigger with a plain div or span to restyle it; you lose native button semantics, focusability, and keyboard activation.
- Don't hard-code colors, border radii, or spacing on the root slot; use Griffel tokens so the trigger follows the FluentProvider theme and high-contrast mode.
- Don't add more than one TagPickerButton to the same TagPickerControl; a single trigger keeps the control unambiguous for pointer and screen reader users.
- Don't hide the trigger behind overflow or clipping logic when tags wrap; the affordance must always be visible.

## Anti-Patterns

### Using TagPickerButton as a standalone action button

❌ The component is designed to toggle a TagPicker option list and carries picker semantics; rendered on its own it produces an unlabeled, context-free button whose purpose is unclear to both sighted and assistive-technology users.

✅ For standalone actions use Button, CompoundButton, or MenuButton. Reserve TagPickerButton for the trigger position inside TagPickerControl, alongside TagPickerGroup, TagPickerInput, and TagPickerList.

### Icon-only trigger with no accessible name

❌ Because the trigger usually renders only a chevron, a screen reader announces just 'button', giving the user no way to know that it opens the tag selection list.

✅ Always supply a name: an aria-label on the trigger, a Label connected through Field, or an aria-labelledby that points at the picker's visible label element.

### Disabling only the trigger

❌ A disabled trigger next to an enabled TagPickerInput and dismissible pills creates a contradictory state where the user can edit tags but cannot discover the full option list, and the control is announced inconsistently.

✅ Disable or enable the picker as a whole: pass disabled to TagPickerButton together with TagPickerInput and TagPickerGroup, and surface the reason via the Field label or helper text.

### Re-implementing open/close on the trigger

❌ Attaching custom click handlers or local open state to the button duplicates the enclosing TagPicker's own expanded-state management, which can cause double toggling, broken Escape handling, and lost focus return.

✅ Let TagPicker manage expansion, dismissal, and focus return, and use the trigger purely as the affordance for opening the list.

### Stripping the focus indicator for a cleaner pill row

❌ Removing the outline or overriding the focus style to avoid a visual seam between the pills and the trigger makes the control unusable for keyboard-only users and fails WCAG 2.4.7.

✅ Keep the default focus ring, or replace it with a custom indicator that still meets 3:1 contrast against adjacent colors, using the theme's focus stroke token so it adapts to light, dark, and high-contrast themes.

## Accessibility

**Requirements**: The trigger must satisfy WCAG 2.1.1 (keyboard), 2.4.7 (focus visible), 4.1.2 (name, role, value), 1.3.1 (info and relationships), and 1.4.3/1.4.11 (contrast for the button surface, its chevron or label, and its focus indicator). Because the button toggles a list, its expanded state must be programmatically determinable to assistive technology, and the picker as a whole must have an accessible name — either through the Field wrapper's Label, an aria-label on the trigger and the input, or an aria-labelledby that references a visible label. Ensure a minimum 24x24 CSS pixel target (preferably larger) and do not suppress the focus ring; a visible focus indicator must remain at 3:1 contrast against the adjacent background. When disabled, ensure the state is conveyed both visually and programmatically rather than by color alone.

| Key | Action |
| --- | --- |
| `Enter` | Activates the trigger and opens the picker's option list, mirroring the primary action for button-semantics controls. |
| `Space` | Also activates the trigger and opens the option list; both Enter and Space must work because the element exposes button semantics. |
| `Tab` | Moves focus forward from the trigger out of the picker; when focus arrives from the picker input, the trigger is the next stop in the control. |
| `Shift+Tab` | Returns focus to the previous focusable element in the picker, typically the TagPickerInput or the last dismissible tag. |
| `Escape` | Closes the expanded option list from anywhere inside the picker and returns focus to the picker control so the user can keep editing tags. |
| `ArrowDown` | Once focus is inside the picker and the list is open, moves the active option through the TagPickerOption list; the trigger itself should simply hand focus into the list when expanded. |

**ARIA**: aria-label, aria-labelledby, aria-expanded, aria-controls, aria-haspopup, aria-disabled, aria-describedby

**Screen Reader**: Screen readers announce TagPickerButton as a button along with its accessible name, which must come from aria-label, the associated Field Label, or aria-labelledby. When the option list is expanded, the control should report an expanded state (aria-expanded) and be associated with the list it reveals (aria-controls), so users understand that pressing it discloses additional content. When the trigger is disabled, the disabled state is announced and the control is removed from the sequential tab order, which is why the picker should also be described by its Field label or an aria-describedby hint. Because the tags themselves are typically dismissible elements outside the button, screen reader users navigate to the trigger to add values and to each tag to remove values; keeping the trigger's name distinct from the tag names prevents confusing announcements.

## Styling

Style the trigger through the root slot's className rather than by overriding internals. The neutral button surface maps to tokens.colorNeutralBackground1 with tokens.colorNeutralStroke1, hover feedback to tokens.colorNeutralBackground1Hover with tokens.colorNeutralStroke1Hover, and pressed feedback to tokens.colorNeutralBackground1Pressed with tokens.colorNeutralStroke1Pressed. Use tokens.borderRadiusMedium to match the picker's rounded field shape, and adjust internal breathing room with tokens.spacingHorizontalSNudge, tokens.spacingHorizontalXS, and tokens.spacingVerticalXS so the trigger aligns optically with TagPickerInput and the tag pills. The chevron or icon usually reads best with tokens.colorNeutralForeground2 (darker on hover). Disabled visuals should use tokens.colorNeutralForeground1Disabled, tokens.colorNeutralBackgroundDisabled, and tokens.colorNeutralStrokeDisabled so they stay consistent with other disabled Fluent controls, and the focus indicator should come from tokens.colorStrokeFocus2. If you need the trigger to stand out when a filter is applied, tint it with tokens.colorBrandBackground2 and tokens.colorBrandForeground2, but keep contrast above 4.5:1 for any text. Transitions should use tokens.durationNormal with tokens.curveEasyEase, and because spacing tokens are direction-aware, RTL layouts flip automatically without custom margin overrides.

## Performance

TagPickerButton itself is a very light component — a single root slot with hover and pressed styling — so its own render cost is negligible. The performance pressure in this composition comes from its siblings: large selected-tag arrays inside TagPickerGroup and long TagPickerOption lists inside TagPickerList. Memoize tag elements and option rows so typing in TagPickerInput does not re-render hundreds of pills or options, keep filtering work out of render, and avoid passing freshly created inline objects to className or style on every render because Griffel class merging and style recalculation are sensitive to identity changes. Because the trigger is small and static, prefer token-driven styles from makeStyles over per-instance inline styles so the atomic CSS can be shared across all picker instances on the page.

## Theming & Tokens

TagPickerButton follows the active FluentProvider theme entirely through design tokens. Its resting surface uses tokens.colorNeutralBackground1 with tokens.colorNeutralStroke1; hover moves to tokens.colorNeutralBackground1Hover and tokens.colorNeutralStroke1Hover; pressed uses tokens.colorNeutralBackground1Pressed and tokens.colorNeutralStroke1Pressed. The chevron or short label usually renders with tokens.colorNeutralForeground2, and disabled states resolve to tokens.colorNeutralForeground1Disabled, tokens.colorNeutralBackgroundDisabled, and tokens.colorNeutralStrokeDisabled. Corner rounding comes from tokens.borderRadiusMedium so it matches the field, internal padding from tokens.spacingHorizontalSNudge, tokens.spacingHorizontalXS, and tokens.spacingVerticalXS, typography from tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300, and motion from tokens.durationNormal with tokens.curveEasyEase. Focus indication should reference tokens.colorStrokeFocus2. Switching brands or moving between the web light, web dark, and high-contrast themes restyles the trigger automatically, and direction-aware spacing tokens flip the trigger's spacing and chevron placement in RTL.

## Migration Notes

In v8 the tag picker rendered its expand trigger internally as part of the picker chrome and was customized through picker-level style overrides; in v9 that trigger is exposed as the composable TagPickerButton that you place explicitly inside TagPickerControl next to TagPickerGroup and TagPickerInput. As a result, styling is done on the component you own rather than through internal class keys on the parent picker, disabled state is expressed with the component's own disabled prop instead of the picker's overall disabled flag, and open/close behavior comes from the surrounding TagPicker composition rather than from picker-level handler props. Teams migrating should also move any custom rendering of the trigger button into plain children or the root slot of TagPickerButton, and re-verify accessible names since the trigger no longer inherits an implicit label from the picker chrome.

## Edge Cases

- With no tags selected, TagPickerButton is the only affordance revealing that options exist; never hide or collapse it when TagPickerGroup is empty, or the picker becomes undiscoverable for pointer and keyboard users alike.
- When the pill row grows long, wide pills can squeeze the trigger. Let TagPickerGroup shrink or wrap and keep the trigger at a fixed, non-shrinking width so it is never clipped or pushed outside the field.
- Because disabling TagPickerButton removes it from the tab order, a fully disabled picker can be skipped entirely by screen reader users navigating a form; pair it with a visible Field label or helper text that explains why editing is unavailable.
- Inside a Dialog or Drawer, focus must return to the trigger (or to the picker control) after the overlay closes; verify that focus restoration targets the picker rather than a stale element when tags were added or removed while the overlay was open.
- If the trigger is placed before TagPickerInput in the DOM, the tab order reaches it first, which conflicts with the visual reading order; keep it last inside TagPickerControl.
- In RTL locales the chevron and internal spacing flip automatically through direction-aware tokens, so any custom margin overrides applied to the root slot will look wrong on one side unless they use logical spacing tokens.
- A very long accessible name on the trigger can make announcements verbose when combined with a large selection count from TagPickerGroup; keep the trigger's name short and put contextual detail in the Field label or aria-describedby.

## See Also

- [forms category](../categories/forms.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
