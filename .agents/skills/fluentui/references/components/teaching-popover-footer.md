# TeachingPopoverFooter

> **Package**: `@fluentui/react-teaching-popover` v9.7.0
> **Import**: `import { TeachingPopoverFooter } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

TeachingPopoverFooter is the action region that renders at the bottom of a TeachingPopoverSurface, holding the calls to action for a teaching, onboarding, or coach-mark popover. It exposes a required root container element, a required primary slot for the main action (typically a step-advancing button such as 'Next' or a closing button such as 'Got it'), and an optional secondary slot for a lower-emphasis action such as 'Skip', 'Back', or 'Dismiss'. By default the two actions render on a single row with the available space distributed between them; setting footerLayout to vertical stacks them instead, which is useful for narrow surfaces or long localized labels. The footer is also the composition point where step-aware behavior surfaces: helper props such as initialStepText and finalStepText, the carousel-oriented layout and mediaLength options, the next/prev navType semantics, and a handleButtonClick callback let the same footer drive multi-step flows built with TeachingPopoverCarousel. It renders no complex internals of its own — just a styled flex container with up to two child actions — so its visual weight comes almost entirely from the Button appearance you place inside it and from the theme tokens it inherits through FluentProvider.

**When to use**: Use TeachingPopoverFooter whenever you build a TeachingPopover and need a deliberate, consistent place for the user's next action — first-run experiences, feature announcements, in-product tours, and step-by-step coach marks. It is the right choice when the guidance is non-modal and the user should be able to keep interacting with the page, and when you want the primary action visually separated from the explanatory content in TeachingPopoverBody. Choose it over plain Popover when you need the teaching-flow conventions (a dominant primary CTA, an optional escape action, and step navigation used with TeachingPopoverCarousel). Choose Dialog instead when the user must make a decision before continuing, because the footer's action styling cannot compensate for the lack of an inert background. Use the secondary slot for optional paths and the primary slot for the flow's forward action; if you only need explanatory content with no action, omit the footer entirely rather than rendering an empty one.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `altText` | `React_2.ReactNode` | — | Yes | — |
| `children` | `NavButtonRenderFunction` | — | Yes | — |
| `children` | `TeachingPopoverCarouselPageCountRenderFunction` | — | Yes | — |
| `dismissButton` | `Slot<'button'>` | — | No | — |
| `dismissButton` | `Slot<'button'>` | — | No | — |
| `finalStepText` | `string` | — | Yes | — |
| `footerLayout` | `'horizontal' \| 'vertical'` | `'horizontal'` | No | — |
| `footerLayout` | `'horizontal' \| 'vertical'` | `'horizontal'` | No | — |
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

- **root**: The required container slot that wraps the actions. Merge Griffel classes or attributes such as an accessible group name onto it instead of wrapping the footer in additional divs; the default element type is a div, so switching to a landmark element requires an element override on the slot. `root`
- **primary**: The required action slot for the forward or confirming action. Put exactly one control here and make it the highest-emphasis action in the popover, usually a Button. `primary`
- **secondary**: Optional lower-emphasis action slot for 'Skip', 'Back', or a no-thanks path. Omit it entirely for single-action footers rather than rendering a disabled button. `secondary`
- **footerLayout**: Controls how the actions are arranged. Keep the default horizontal when two short labels fit side by side; set vertical for narrow surfaces, long localized strings, or when stacked buttons should span the surface width. `vertical`
- **handleButtonClick**: Callback invoked when a footer action in a carousel-driven flow is activated, receiving the originating mouse event. Use it to centralize step advancement, analytics, and dismissal logic instead of duplicating handlers per button. `(event) => advanceStep()`
- **initialStepText**: Label text for the action shown on the very first step of the flow, so the opening step can read differently from intermediate steps. `Get started`
- **finalStepText**: Label text for the action shown on the last step, replacing a forward-looking label such as 'Next' with a closing one such as 'Got it'. `Got it`
- **navType**: Identifies whether a navigation control moves the flow forward ('next') or backward ('prev'); the footer renders next/previous actions according to this value. `next`
- **value**: The string value associated with the current step or navigation element, used to identify which step a control corresponds to. `step-2`
- **layout**: Selects the alternative footer arrangement used by the carousel footer, so the footer can adapt its composition to the carousel's visual style. `layout`
- **mediaLength**: Controls the height of the media region that can accompany the carousel footer, letting you reserve short, medium, or tall space for imagery above the actions. `medium`
- **altText**: Alternative text content for the media rendered with the carousel footer; always provide a meaningful description or an empty value for decorative media. `Illustration of the new dashboard`
- **children**: Accepts render functions for the carousel footer's navigation buttons and page count, so you can customize how progression controls are drawn while the footer keeps managing the step state. `(props) => <CarouselNavButton {...props} />`
- **dismissButton**: Enables the dismiss affordance on the popover's header/title area rather than in the footer's action row. Keep this exit available so users can leave the flow from any step, and don't reproduce it inside the footer. `dismissButton={{}}`
- **icon**: Slot for a decorative or illustrative icon rendered alongside the teaching content above the footer. Provide null or aria-hidden content for purely decorative icons so the footer's action region stays the focus. `icon`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `primary` | — | Yes | The primary button slot. |
| `root` | — | Yes | The element wrapping the buttons. |
| `secondary` | — | No | The secondary button slot. |

## Best Practices

### Do's

- Always populate the required primary slot with the action that moves the flow forward, and make its label the verb the user expects ('Next', 'Try it', 'Got it').
- Keep the footer to one or two actions so the primary call to action remains visually dominant; the secondary slot is optional for exactly this reason.
- Leave footerLayout at its horizontal default whenever two short labels fit on one row, and only switch to vertical when the surface is narrow or labels are long in the target locale.
- Drive the closing label through finalStepText (and the opening label through initialStepText) so the final step does not still read 'Next' when there is nothing left to advance to.
- Render TeachingPopoverFooter as the last child of TeachingPopoverSurface so the DOM order matches the visual order and the actions are read after the explanatory content.
- Give icon-only actions an explicit accessible name with aria-label, since the icon alone provides no text for assistive technology.
- Keep the primary and secondary actions semantically distinct — advancing versus declining — so users can predict the result of each button without reading carefully.

### Don'ts

- Don't place long descriptions, images, or media inside the footer; it is an action region, and body content belongs in TeachingPopoverBody, TeachingPopoverHeader, or the carousel card.
- Don't use a vertical footerLayout in a wide surface, because stacked buttons stretch to full width and read as more important than they are.
- Don't hard-code colors, spacing, or font sizes on the footer or its buttons; the actions should take their styling from the button appearance and the theme tokens.
- Don't implement your own Tab loop, Escape handler, or focus trap inside the footer — the popover already manages focus movement and dismissal.
- Don't duplicate the popover's own dismiss affordance in the secondary slot if the title already renders a dismiss button, as two identical exits are noise.
- Don't try to communicate progress through the footer alone; use the carousel page count or media area for step position and keep the footer for decisions.
- Don't render the footer outside a TeachingPopoverSurface and expect the spacing, alignment, and theming to line up with the rest of the teaching flow.

## Anti-Patterns

### Footer as the only escape hatch

❌ Putting every exit path in the footer (for example only a secondary 'Skip' button) means users on intermediate steps have to find and understand that single control to leave the flow, and any layout or localization change that hides it traps them.

✅ Keep the popover's dismiss control on the header or title via the dismissButton slot in addition to any footer action, and rely on Escape closing the popover so there is always a keyboard-reachable exit.

### Turning the footer into a content container

❌ Placing paragraphs, images, or the step counter inside the action row breaks the visual rhythm of the surface, pushes the buttons off-screen on small viewports, and scrambles the reading order between explanation and decision.

✅ Keep only actions in the footer. Move explanatory copy into TeachingPopoverBody, headings into TeachingPopoverHeader or TeachingPopoverTitle, and progress indicators into the carousel's page count.

### Restyling the actions from the footer

❌ Overriding colors, paddings, or font weights on descendant buttons through the footer's container defeats the token system, breaks dark and high-contrast themes, and makes the primary action inconsistent with buttons elsewhere in the product.

✅ Pick the emphasis with the button's own appearance values instead of overriding styles, and when a genuine tweak is required, pass a className into the primary or secondary slot rather than selecting descendants.

### Duplicating carousel navigation in the footer

❌ Rendering next/previous buttons in the footer while the carousel also renders its own navigation controls creates two competing ways to advance, ambiguous focus order, and confusing screen reader output.

✅ Let TeachingPopoverCarouselNav and its nav buttons own progression, and keep the footer dedicated to the flow-level decision such as finishing, skipping, or confirming.

### Hard-coded step labels

❌ Writing the same primary label for every step leaves the flow showing 'Next' on the final step, or showing 'Got it' on the first, which misleads users about what will happen and can strand them in a loop.

✅ Drive the label from the same state that drives the carousel, using initialStepText for the opening step, finalStepText for the last one, and the default label for intermediate steps.

## Accessibility

**Requirements**: The footer's actions must be real, focusable controls with programmatic names: place Buttons (or anchors via the slot's element override) in the primary and secondary slots, and never substitute a clickable div. When you replace button content with an icon, supply aria-label. Texts must meet WCAG 2.1 AA contrast (4.5:1 for the label against the button background, 3:1 for the focus indicator against adjacent colors), and the default Fluent button sizes satisfy the 24x24 CSS pixel target size requirement. Because the popover is dismissible (Escape and/or the dismiss button) there is no keyboard trap, satisfying WCAG 2.1.2. Ensure the surface is labelled by TeachingPopoverTitle so that focus entering the popover announces context before the user reaches the footer actions.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus from the popover body into the footer's primary action and then to the secondary action (or out of the popover when the footer is the last focusable region). |
| `Shift+Tab` | Moves focus backward out of the footer and back through the popover's focusable content. |
| `Enter` | Activates the focused footer action, invoking its onClick handler (or handleButtonClick when the footer is driving the carousel flow). |
| `Space` | Activates the focused footer action the same way Enter does; the browser handles the keydown/keyup semantics for native buttons. |
| `Escape` | Closes the teaching popover from anywhere inside it, including while focus is on a footer action, and returns focus to the trigger. |

**ARIA**: aria-label, aria-labelledby, aria-describedby, aria-disabled, role="group" (optional, applied through the root slot to name the action region)

**Screen Reader**: The footer root renders as a generic container with no implicit landmark or group role, so screen readers announce it only as part of the popover's content flow and move straight to the buttons. Each action is announced with its accessible name followed by the button role; icon-only actions announce whatever aria-label you provide. Because the actions are the last elements in the surface, they are encountered after the title and body content when reading sequentially, and moving focus with Tab announces each button by name. Step changes are conveyed by the changed text content of the surface rather than by the footer itself, so if you need an explicit announcement of the new step, use a live region such as AriaLiveAnnouncer alongside the footer. When the popover opens, focus is placed inside the surface (typically on the surface or the first control) and the accessible name comes from the title via aria-labelledby, which gives the footer actions their context.

## Styling

Style the footer through Griffel with makeStyles and merge the resulting class onto the root slot rather than targeting descendant buttons. The root is a flex row by default; common tweaks are justifyContent: 'space-between' to spread the actions to opposite edges, justifyContent: 'flex-end' to right-align a lone primary action, columnGap: tokens.spacingHorizontalS for the horizontal layout, or flexDirection: 'column-reverse' with rowGap: tokens.spacingVerticalS and alignItems: 'stretch' to emulate the vertical layout while keeping the primary action visually first. Padding is usually expressed with tokens.spacingVerticalMNudge and tokens.spacingHorizontalMNudge, and the container normally sits on the popover surface background (tokens.colorNeutralBackground1) so it needs no border of its own. Avoid overriding the buttons' colors from the footer: set the appearance on the Button itself (primary, secondary, subtle) and let the button tokens resolve. If you must adjust a button, pass a className into that slot rather than using a descendant selector.

## Performance

The footer is extremely light — a single flex container plus the controls you place in its slots — so it is rarely a rendering bottleneck; the cost usually comes from the handlers and children you pass in. Define step handlers once with useCallback (or wire them through handleButtonClick) instead of creating a new inline arrow for each render, so the buttons keep stable props and can bail out of re-rendering. Keep render-function children for the carousel navigation and page count stable across renders for the same reason. Avoid heavy content inside the footer, since any large subtree there is re-rendered on every step change along with the rest of the popover surface, and avoid keying the footer on step index if that would force the entire action row to remount and lose focus on each transition.

## Theming & Tokens

The footer inherits everything from the nearest FluentProvider, so switching themes or brand ramps automatically recolors it without footer-specific work. The container sits on the popover surface background (tokens.colorNeutralBackground1) and normal-weight text uses tokens.colorNeutralForeground1, with secondary or helper text in tokens.colorNeutralForeground2 and disabled actions in tokens.colorNeutralForegroundDisabled. The primary action's emphasis comes from the brand ramp — tokens.colorBrandBackground, tokens.colorBrandBackgroundHover, tokens.colorBrandBackgroundPressed and tokens.colorBrandForeground1 — while secondary emphasis uses tokens.colorNeutralBackground1 with tokens.colorNeutralStroke1 borders and subtle emphasis uses tokens.colorSubtleBackgroundHover. Spacing between and around actions should also come from the token set (tokens.spacingHorizontalS, tokens.spacingVerticalS, tokens.spacingVerticalMNudge, tokens.spacingHorizontalMNudge), and rounded corners from tokens.borderRadiusMedium, so density and RTL behavior follow the theme automatically. Custom brand themes created with createLightTheme/createDarkTheme and brandVariants flow straight through to the footer's buttons.

## Migration Notes

TeachingPopoverFooter is a v9 component with no direct counterpart in Fluent UI React v8, where guided callouts were built from the older TeachingBubble and Coachmark patterns that configured their actions through props on the bubble rather than through slots. When porting such code, map the old single 'primary'/'dismiss' prop pairs to the primary and secondary slots and place them in TeachingPopoverFooter inside a TeachingPopoverSurface; multi-step tours that previously relied on ad hoc state arrays should move to TeachingPopoverCarousel with the footer's step text, layout, and navType options carrying the progression semantics. Note that v8 styling hooks (theme palette objects and mergeStyleSets) do not apply here — use Griffel classes plus tokens.* for any footer customization.

## Edge Cases

- The secondary slot is optional but the container still distributes space between children, so a footer with only the primary action pins that button to one edge; override justifyContent on the root if you need a different alignment.
- Long primary labels in languages with lengthy translations can wrap to two lines in the horizontal layout, producing an uneven action row — switch to footerLayout vertical or shorten the label.
- The footer root renders as a plain div with no landmark or group role, so screen reader users get no announcement that they have reached the action region unless you add a role and accessible name through the root slot.
- Because the footer's own action row and the carousel's navigation controls can both move the flow, conflicting layouts (for example a vertical footer combined with a page count row) can look cramped on small viewports; test the combination you ship.
- If you remount the footer on every step (for example by changing its key with the step index), the focused button is destroyed and focus falls back to the surface, interrupting keyboard users mid-tour.
- Icon-only actions can be produced through the slots, but without an aria-label they announce nothing useful; the slot accepts arbitrary attributes, including aria-label, so set it explicitly.
- Wrapping the footer in an extra styled element to control spacing adds a level to the DOM that the popover layout did not account for; prefer merging classes onto the root slot.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
