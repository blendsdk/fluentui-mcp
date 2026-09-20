# TeachingPopoverTrigger

> **Package**: `@fluentui/react-teaching-popover` v9.7.0
> **Import**: `import { TeachingPopoverTrigger } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

TeachingPopoverTrigger is the activation element of the TeachingPopover family in Fluent UI React v9. It plays the same structural role as PopoverTrigger — it wraps the element a person interacts with in order to reveal an anchored teaching surface — but it is purpose-built for first-run experiences, coach marks, and multi-step onboarding tours. The trigger is the entry point into a guided flow: it accepts render-function children for the visual it renders (including a navigation button variant and a page-count variant) and carries the flow's step semantics such as the current step value, the direction of travel, the labels shown on the first and final steps, and the media length of the associated teaching content. Beyond pure activation, the trigger exposes declarative slot composition through root, icon, and dismissButton, plus a handleButtonClick callback so that navigation inside the tour (going to the next or previous step, finishing the tour, or dismissing it) can be handled without imperatively manipulating the underlying elements. Because the trigger coordinates with the rest of the TeachingPopover set (surface, header, title, body, carousel, footer), it is the piece that binds the anchored positioning behavior of a popover to the step-by-step state machine of a teaching flow.

**When to use**: Use TeachingPopoverTrigger when you need an anchored, dismissible, multi-step teaching experience that is opened from a specific element on the page — onboarding callouts, feature announcements, product tours, or contextual hints that must stay visually attached to the control they explain. Prefer it over plain PopoverTrigger when the content is instructional rather than purely informational, when the flow has discrete steps with next/previous affordances, or when you want the built-in step text, page count, and navigation semantics that the teaching flow provides. Prefer a plain Tooltip for single-sentence hints that require no interaction, a plain Popover when the content is static and does not need step navigation or a dismiss affordance, and a Dialog when the teaching content must block the rest of the page. If the guidance is permanent reference material rather than a one-time teaching moment, use an InfoLabel or inline Text instead of an overlay at all.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `altText` | `React_2.ReactNode` | — | Yes | — |
| `children` | `NavButtonRenderFunction` | — | Yes | — |
| `children` | `TeachingPopoverCarouselPageCountRenderFunction` | — | Yes | — |
| `dismissButton` | `Slot<'button'>` | — | No | — |
| `dismissButton` | `Slot<'button'>` | — | No | — |
| `finalStepText` | `string` | — | Yes | — |
| `footerLayout` | `'horizontal' \| 'vertical'` | — | No | — |
| `footerLayout` | `'horizontal' \| 'vertical'` | — | No | — |
| `handleButtonClick` | `(event: React_2.MouseEvent<HTMLButtonElement & HTMLAnchorElement & HTMLDivElement>) => void` | — | Yes | — |
| `icon` | `Slot<'div'>` | — | No | — |
| `initialStepText` | `string` | — | Yes | — |
| `layout` | `TeachingPopoverCarouselFooterLayout` | — | No | — |
| `mediaLength` | `'short' \| 'medium' \| 'tall'` | — | No | — |
| `navType` | `'next' \| 'prev'` | — | Yes | — |
| `root` | `NonNullable<Slot<ARIAButtonSlotProps<'a'>>>` | — | Yes | — |
| `root` | `NonNullable<Slot<'div'>>` | — | Yes | — |
| `root` | `Slot<'div', 'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'>` | — | Yes | — |
| `root` | `Slot<'h2', 'h1' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'div'>` | — | Yes | — |
| `value` | `string` | — | Yes | — |

### Prop Guidance

- **altText**: Supplies the accessible, human-readable description of the trigger used for its accessible name. Always set it to describe the purpose of the teaching moment so assistive technology users understand what activating the control will reveal, rather than repeating the visible label verbatim. `Learn how to set up your workspace`
- **value**: Identifies the current step of the teaching flow. Use a stable, meaningful string for each step so navigation logic in handleButtonClick and any step comparison for first and final step detection stays data-driven and survives reordering of steps. `step-2`
- **navType**: Declares whether the rendered navigation control moves the flow forward or backward. Set it to next on the primary advance control and prev on the back control so labels, ordering, and keyboard behavior stay consistent with the direction of travel. `next`
- **initialStepText**: Defines the primary action label used on the first step of the tour. Use it to give the opening step a distinct call to action such as a start label so people understand the flow is beginning. `Get started`
- **finalStepText**: Defines the primary action label used on the last step. Always provide it so the tour ends with an unambiguous completion action instead of reusing the mid-tour advance label. `Done`
- **mediaLength**: Hints how much vertical room the media inside the teaching surface needs. Choose short, medium, or tall to match the actual illustration, image, or video so the anchored surface does not resize abruptly between steps. `medium`
- **children**: Renders the trigger's visible content and is provided as a render function rather than static nodes, so the label and disabled or active state can react to the current step. Separate render-function forms exist for the in-flow navigation button and for the page-count indicator, so keep the correct one with the corresponding subcomponent rather than mixing them on a single trigger. `render function returning the step label`
- **root**: The underlying element the trigger renders, typed as a non-nullable slot that carries ARIA button slot props for anchor, button, or div roots, with heading levels available where the trigger participates in a titled region. Apply styling and sizing to root instead of wrapping the trigger in extra elements, so focus and anchor positioning stay intact. `button root with brand background`
- **icon**: Optional leading visual for the trigger. Use it to reinforce the teaching context with a recognizable glyph, and keep it decorative by not relying on it to convey the step or state on its own. `info or sparkle glyph`
- **dismissButton**: Optional button slot for closing the teaching experience from within the flow. Provide it whenever the tour can be postponed or skipped, and give it a clear accessible name so it is distinguishable from the primary navigation action. `Skip`
- **handleButtonClick**: The click handler shared by the interactive controls the trigger renders. Use the current value and navType to decide whether to advance, go back, complete the tour, or dismiss it, and keep the handler idempotent so repeated activation does not skip steps. `advance to the next step or finish on the final step`
- **layout**: Controls the overall arrangement of the teaching carousel footer layout. Choose the arrangement that keeps the primary action visually dominant and consistent across steps rather than switching arrangements mid-tour. `horizontal`
- **footerLayout**: Selects whether the footer region stacks its controls horizontally or vertically. Prefer horizontal in wide anchored surfaces and vertical when the teaching surface is narrow or the labels are long enough to wrap. `horizontal`

## Best Practices

### Do's

- Attach the trigger to the single most relevant interactive element on the screen so the anchored surface visually explains what a person should do next.
- Provide both initialStepText and finalStepText so the primary navigation label changes meaningfully at the boundaries of the tour instead of always reading the same word.
- Give the trigger an informative accessible name through altText so screen reader users hear what the teaching moment is about before they activate it.
- Use navType to declare whether the current step moves the flow forward or backward, so the button's label and semantics stay consistent with the tour state.
- Set mediaLength to match the actual media rendered in the teaching surface so the anchored layout reserves an appropriate amount of room and does not jump when content appears.
- Drive the visible label of the trigger through the render-function children and the value prop rather than mutating DOM text after the fact.
- Handle every exit path in handleButtonClick — advancing, going back, and finishing — so the tour can always be completed or dismissed without trapping the person in the flow.
- Keep first and final step behavior explicit by checking the value prop inside handleButtonClick rather than inferring step position from the button label text.

### Don'ts

- Don't use TeachingPopoverTrigger as a generic button that performs page navigation or submits data; it exists to reveal and drive a teaching surface.
- Don't omit finalStepText, which leaves the last step of the tour without a distinct call to action and makes it unclear how the experience ends.
- Don't place the trigger on a non-interactive or purely decorative element where the anchored surface has no meaningful relationship to the content beneath it.
- Don't hard-code step order into the trigger's label text; rely on the value and navType props so the flow remains data-driven when steps are added or reordered.
- Don't ship a teaching flow that can be opened but never dismissed — always wire the dismissButton slot or the dismiss path in handleButtonClick.
- Don't nest a TeachingPopoverTrigger inside another overlay's interactive content where focus management and anchored positioning will compete.
- Don't use footerLayout values inconsistently between the trigger-driven tour steps and the footer subcomponents; mismatched layout makes the primary action jump between steps.

## Anti-Patterns

### Trigger without a dismiss path

❌ A teaching flow that opens from the trigger but offers no dismissButton and no completion branch in handleButtonClick leaves the last step without a way out, which is a keyboard and pointer trap for anyone who does not want the tour.

✅ Always wire the dismissButton slot with a clear label and handle the skip or finish case in handleButtonClick so every step can be exited by keyboard and pointer alike.

### Static step labels copied across every step

❌ Reusing one label for the whole tour ignores initialStepText, finalStepText, and navType, so people cannot tell whether they are starting, advancing, or finishing, and screen reader announcements become meaningless.

✅ Author distinct opening and completion labels and let navType and value drive the label per step so the primary action always describes the transition it performs.

### Reusing the trigger as a general-purpose button

❌ Attaching TeachingPopoverTrigger to unrelated actions such as form submission or page navigation mixes two responsibilities on one element, breaks the anchored relationship between the control and its explanation, and makes the tour state impossible to reason about.

✅ Keep the trigger dedicated to revealing and driving the teaching surface, and use a regular Button, CompoundButton, or Link for ordinary actions elsewhere on the page.

### Ignoring mediaLength when the surface contains media

❌ When mediaLength does not reflect the actual media, the anchored teaching surface resizes or reflows between steps, which shifts the pointer target and makes the tour feel unstable.

✅ Set mediaLength to the closest matching value for the tallest media in the flow so the layout reserves room up front and stays stable across all steps.

### Stacking teaching overlays on top of each other

❌ Nesting a TeachingPopoverTrigger inside interactive content of another open overlay causes competing anchor positioning and focus management, and can leave focus stranded when one surface closes.

✅ Keep a single teaching flow active at a time and move the remaining guidance into later steps of the same tour instead of layering overlays.

## Accessibility

**Requirements**: The trigger must remain a real, focusable, keyboard-operable control with a visible focus indicator that meets WCAG 2.1 AA contrast requirements (at least 3:1 against the adjacent background). Because it opens an anchored surface, the trigger must correctly advertise its popup relationship so assistive technology can move between the trigger and the teaching content, and the teaching content itself must be reachable and dismissible by keyboard alone. Any step counter or slide change surfaced through the trigger's page-count render function must not rely on color or position alone to convey progress, and every step must be completable and dismissible without a pointer. Text inside the trigger and the surface must meet 4.5:1 contrast for body copy, and the changing navigation label must remain understandable when read out of context.

| Key | Action |
| --- | --- |
| `Enter` | Activates the trigger and opens the teaching surface, or performs the current navigation action when the trigger renders a carousel navigation button. |
| `Space` | Activates the trigger exactly like Enter, since the rendered root exposes button semantics. |
| `Escape` | Closes the open teaching surface and returns focus to the trigger. |
| `Tab` | Moves focus out of the trigger into the teaching surface content, or onward to the next focusable element when the surface is closed. |
| `Shift+Tab` | Moves focus backward, re-entering the trigger and previously focused controls without leaving the tour unreachable. |
| `ArrowLeft` | Moves to the previous step when the trigger is rendered as the backward navigation control (navType set to prev). |
| `ArrowRight` | Moves to the next step when the trigger is rendered as the forward navigation control (navType set to next). |
| `Home / End` | Moves to the first or final step of the tour when the navigation render function supports step jumping. |

**ARIA**: aria-label, aria-expanded, aria-haspopup, aria-controls, aria-describedby, aria-current, aria-live

**Screen Reader**: When focus lands on the trigger, screen readers announce the accessible name derived from altText together with the button role and its expanded or collapsed state, so a person knows a teaching surface is available before opening it. Activating the trigger moves the announcement into the teaching surface, where the header, title, and body are read in order. Step navigation between the first and final steps is announced through the updated primary action label, and the live step indicator rendered by the page-count render function is announced as the step changes. If the trigger renders the dismiss affordance, it announces as a button with its accessible name and removes the whole teaching experience from the accessibility tree when activated.

## Styling

Style the trigger through slot class names and Griffel tokens rather than overriding internals. The root slot accepts the standard ARIA button slot props, so a brand-colored coach mark trigger typically uses tokens.colorBrandBackground with tokens.colorNeutralForegroundOnBrand for the label and tokens.colorBrandBackgroundHover and tokens.colorBrandBackgroundPressed for interaction states. Keep the trigger's corner rounding aligned with the surface by using tokens.borderRadiusMedium or tokens.borderRadiusCircular for icon-only invocations. Spacing around the label should come from tokens.spacingHorizontalM and tokens.spacingHorizontalSNudge, with icon-to-label gutters from tokens.spacingHorizontalXS, so the trigger stays on the same rhythm as the rest of the teaching flow. The icon slot accepts a div, which is the right place to apply tokens.colorBrandForeground1 or tokens.colorNeutralForeground2 to a decorative glyph and consistent sizing via tokens.fontSizeBase300 and tokens.lineHeightBase300. The dismissButton slot should visually recede: use tokens.colorNeutralForeground2 with tokens.colorNeutralForeground2Hover, a transparent background, and tokens.borderRadiusMedium. If you tune the anchored layout, let mediaLength drive the reserved media area instead of hard-coding heights, and apply tokens.shadow16 only to the popover surface, never to the trigger. Focus styling should use tokens.colorStrokeFocus2 or tokens.colorStrokeFocus1 so the focus ring meets contrast requirements in both light and dark themes.

## Performance

TeachingPopoverTrigger's children are render functions, so the trigger's visible output is recomputed on every relevant state change. Keep those render functions cheap and free of expensive work such as data fetching, large array sorting, or creating heavy React trees, and avoid allocating new objects or arrays inside them on each invocation. Because the anchored teaching surface is only relevant while the tour is open, defer expensive initialization of the teaching content until the flow is actually started rather than at initial page render, and keep the trigger subtree small so it does not add to the initial render cost of a page that may never show the tour. If multiple triggers exist on a page for a multi-page tour, prefer reusing one flow and changing step state through value instead of mounting several parallel teaching surfaces, and be mindful that each additional overlay adds anchor measurement work while the flow is active.

## Theming & Tokens

TeachingPopoverTrigger reads all of its visual values from the FluentProvider theme, so restyling is normally a matter of remapping theme tokens rather than overriding component CSS. Brand-forward triggers rely on tokens.colorBrandBackground, tokens.colorBrandBackgroundHover, tokens.colorBrandBackgroundPressed, and tokens.colorNeutralForegroundOnBrand for the label. Neutral or secondary presentations use tokens.colorNeutralBackground1, tokens.colorNeutralBackground1Hover, tokens.colorNeutralForeground1, and tokens.colorNeutralStroke1. Focus indication should be expressed with tokens.colorStrokeFocus2 so it stays visible in both light and dark themes. Decorative glyphs in the icon slot typically use tokens.colorBrandForeground1 or tokens.colorNeutralForeground2, and low-emphasis dismiss affordances use tokens.colorNeutralForeground2 with tokens.colorNeutralForeground2Hover. Typography inside the trigger should stay on tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.lineHeightBase300, spacing on tokens.spacingHorizontalM and tokens.spacingHorizontalXS, and rounding on tokens.borderRadiusMedium. The teaching surface the trigger opens conventionally uses tokens.shadow16 and tokens.colorNeutralBackground1, so keeping the trigger on the same token family keeps the anchored pairing visually coherent across themes and density.

## Migration Notes

In Fluent UI React v8, teaching experiences were expressed through the imperative TeachingBubble component, which anchored itself to a target element that you located separately. The v9 TeachingPopover family replaces that pattern with declarative composition: TeachingPopoverTrigger wraps the element that opens the experience, and the surrounding TeachingPopover, TeachingPopoverSurface, TeachingPopoverHeader, TeachingPopoverTitle, TeachingPopoverBody, and carousel and footer subcomponents render the content in a single tree. Migration therefore means moving from a programmatic show or hide call plus an external target reference to a single trigger element with render-function children, using handleButtonClick for navigation and completion logic that previously lived in imperative event handlers, using initialStepText and finalStepText to express the labels that v8 callers often injected by mutating DOM text, and using value with navType instead of manually tracking which step was showing. Content that used to be a single bubble should generally be split across the surface, header, body, and carousel subcomponents rather than being passed as one blob to the trigger.

## Edge Cases

- Several props surfaced through the trigger belong to the composed teaching flow subcomponents — the carousel navigation button semantics carried by navType and altText, the page-count render function form of children, and the footer layout props layout and footerLayout. Confirm which render-function form of children you are using before wiring handleButtonClick, since the navigation button form and the page-count form expect different data.
- The root slot is typed to support both button and anchor-style ARIA slot props as well as heading elements, so the same component can render as a clickable trigger or as a titled region depending on context. Choose the root deliberately, because changing it changes the keyboard and screen reader semantics.
- When value reaches the final step but finalStepText is not supplied, the primary action falls back to a label that does not communicate completion. Guard the final step explicitly in handleButtonClick instead of relying on label text comparisons.
- Two children props and two root props are declared with different types for different usage contexts, so a trigger configured for the carousel footer navigation and a trigger configured for the header or title region are not interchangeable; keep each configuration with its matching subcomponent.
- mediaLength is only a hint: if the actual media is taller than the declared value, the anchored surface will still grow and may reposition relative to the trigger, so verify the anchor after the media loads, especially for images and videos that resolve asynchronously.
- Because the trigger is a real ARIA button, a disabled or unavailable tour step should be expressed through the root's ARIA button slot props rather than by rendering a plain non-interactive element, otherwise keyboard users lose the focus target they expect.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
