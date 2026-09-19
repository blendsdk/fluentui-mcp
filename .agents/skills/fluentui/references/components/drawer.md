# Drawer

> **Package**: `@fluentui/react-drawer` v9.13.0
> **Import**: `import { Drawer } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

Drawer is a Fluent UI React v9 surface that animates in from an edge of the viewport to hold supplementary or task-focused content without leaving the current page. It ships as two concrete surfaces: OverlayDrawer, which floats above the page on top of a backdrop and is blocking by default, and InlineDrawer, which is stacked with the page content at the same level so users can keep interacting with the rest of the UI. A single Drawer component is also exported and selects between these surfaces through its type prop, which accepts "overlay" (the default) or "inline". The drawer is composed from supporting parts: DrawerHeader, DrawerHeaderNavigation, DrawerHeaderTitle, DrawerBody, and DrawerFooter. Behavior is driven by the open state paired with the onOpenChange callback, the position prop (start, end, or bottom), the size prop (small by default, plus medium, large, and full), the modalType prop (including "non-modal" and "alert"), the separator prop for a divider line between the drawer and page content, the unmountOnClose prop for keeping closed content in the DOM, and mountNode for rendering the overlay inside a specific container. Because the drawer moves focus into itself when it opens, the examples pair the drawer with the restore-focus source attributes and its trigger with the restore-focus target attributes so focus returns correctly on close.

**When to use**: Use OverlayDrawer when a task needs the user's full attention but does not warrant a full page or a separate route: editing settings, creating or reviewing an item, viewing details of a row in a list, or any multi-step management flow. Use InlineDrawer when the panel is part of the page layout rather than a temporary interruption: persistent navigation, an always-open sidebar that should stay visible, or a companion surface that users can switch between while the main surface remains interactive. Choose Drawer over Dialog when the content is long, scrollable, or structured with a header, body, and footer, and when a lateral or bottom-anchored surface reads better than a centered dialog. Choose an inline or always-open drawer over a dismissible overlay when the content is not optional, and choose a non-modal overlay when the user benefits from referring to the background content while the panel is open. If the interaction is short and confirmation-like, prefer a dialog; if the content is a full destination, prefer a page.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `type` | `"inline" \| "overlay" \| undefined` | `overlay` | No | Type of the drawer.  - 'overlay' - Drawer is hidden by default and can be opened by clicking on the trigger. - 'inline' - Drawer is stacked with the content |

### Prop Guidance

- **type**: Selects the drawer surface. Use "overlay" (the default) for dismissible, attention-demanding tasks that float above the page on a backdrop, and "inline" for panels that are stacked with the page content and remain interactive alongside it. It can be switched at runtime, which is how the responsive example swaps between overlay and inline at a viewport breakpoint. `overlay`
- **open**: Controls whether the drawer surface is shown. Keep it in React state and toggle it from a trigger button, a toggle button for inline drawers, or the close action inside the header. `open={isOpen}`
- **onOpenChange**: Notifies you of every dismissal path, including Escape and outside click, and provides the next open value. Always update your open state from the provided value instead of assuming the drawer closed. Omitting this handler is what makes an alert drawer non-dismissible by Escape or outside click. `onOpenChange={(_, { open }) => setIsOpen(open)}`
- **position**: Determines the edge the drawer slides in from. Use "start" for primary navigation in left-to-right layouts, "end" for secondary or detail panels, and "bottom" for surfaces that suit a wide, short footprint. It also determines the placement of the separator line. `start`
- **size**: Sets the width of the drawer surface, with small as the default and medium, large, and full as the other steps. Prefer this over hand-written widths; reach for a style override only when a custom or interactive width is genuinely required. `large`
- **modalType**: Controls how the overlay interacts with the page behind it. Use "non-modal" when the user should keep working with background content, the default modal behavior for blocking task flows, and "alert" only when the user must act inside the drawer first. Combine "alert" with an explicit in-drawer close control. `non-modal`
- **separator**: Draws a divider between the drawer surface and the page content, positioned according to the position prop. Use it for inline drawers that sit next to page content and need a visual boundary. `separator`
- **unmountOnClose**: By default the drawer content is removed from the DOM when closed. Set it to false when the content is expensive, holds internal state, or should keep its scroll position between openings. `false`
- **mountNode**: Renders the overlay drawer inside a specific container instead of the document root. Use it when the drawer must be scoped to a particular region of the page or an ancestor that owns the scroll and stacking context. `mountNode={containerRef.current}`
- **surfaceMotion**: Customizes the animation applied to the drawer surface and accepts a motion definition built with the Motion APIs. Set it to null to disable the surface transition entirely, for example when motion should not run. `null`
- **backdropMotion**: Customizes the animation of the backdrop behind an overlay drawer. Set it to null together with surfaceMotion to remove all drawer animation. `null`
- **action**: Available on DrawerHeaderTitle, this slot renders a trailing control in the header, most commonly a subtle, icon-only close Button with an aria-label of "Close". `action={<Button appearance="subtle" aria-label="Close" icon={<Dismiss24Regular />} />}`
- **heading**: Available on DrawerHeaderTitle, this slot customizes the element used for the title, which renders as an h2 by default. Lower the level when the drawer is embedded in a page whose heading hierarchy requires it. `heading={{ as: 'h1' }}`
- **as**: Changes the element rendered for the drawer root, for example to an aside when the drawer acts as complementary content. Use it to express the correct landmark semantics rather than wrapping the drawer in extra markup. `aside`

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement, DrawerProps } from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';

export const Default = (): JSXElement => {
  const styles = useStyles();
  const labelId = useId('type-label');

  const [isOpen, setIsOpen] = React.useState(false);
  const [type, setType] = React.useState<DrawerType>('overlay');

  // all Drawers need manual focus restoration attributes
  // unless (as in the case of some inline drawers, you do not want automatic focus restoration)
  const restoreFocusTargetAttributes = useRestoreFocusTarget();
  const restoreFocusSourceAttributes = useRestoreFocusSource();

  return (
    <div className={styles.root}>
      <Drawer
        {...restoreFocusSourceAttributes}
        type={type}
        separator
        open={isOpen}
        onOpenChange={(_, { open }) => setIsOpen(open)}
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<Dismiss24Regular />}
                onClick={() => setIsOpen(false)}
              />
            }
          >
            Default Drawer
          </DrawerHeaderTitle>
        </DrawerHeader>

        <DrawerBody>
          <p>Drawer content</p>
        </DrawerBody>
      </Drawer>

      <div className={styles.content}>
        {type === 'inline' ? (
          <ToggleButton
            {...restoreFocusTargetAttributes}
            appearance="primary"
            onClick={() => setIsOpen(!isOpen)}
            checked={isOpen}
          >
            Toggle
          </ToggleButton>
        ) : (
          <Button {...restoreFocusTargetAttributes} appearance="primary" onClick={() => setIsOpen(!isOpen)}>
            Open
          </Button>
        )}

        <div className={styles.field}>
          <Label id={labelId}>Type</Label>
          <RadioGroup value={type} onChange={(_, data) => setType(data.value as DrawerType)} aria-labelledby={labelId}>
            <Radio value="overlay" label="Overlay (Default)" />
            <Radio value="inline" label="Inline" />
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};
```

### AlwaysOpen

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { DrawerBody, DrawerHeader, DrawerHeaderTitle, InlineDrawer, makeStyles } from '@fluentui/react-components';

export const AlwaysOpen = (): JSXElement => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <InlineDrawer separator open>
        <DrawerHeader>
          <DrawerHeaderTitle>Always open</DrawerHeaderTitle>
        </DrawerHeader>

        <DrawerBody>
          <p>Drawer content</p>
        </DrawerBody>
      </InlineDrawer>

      <div className={styles.content}>
        <p>This is the page content</p>
      </div>
    </div>
  );
};

AlwaysOpen.parameters = {
  docs: {
    description: {
      story: [
        'A drawer can be always open, in which case it will not be able to be closed by the user.',
        'This is useful for drawers that are used for navigation, and should always be visible.',
      ].join('\n'),
    },
  },
};
```

### CustomSize

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';

export const CustomSize = (): JSXElement => {
  const styles = useStyles();

  const [open, setOpen] = React.useState(false);
  const [customSize, setCustomSize] = React.useState(600);

  // all Drawers need manual focus restoration attributes
  // unless (as in the case of some inline drawers, you do not want automatic focus restoration)
  const restoreFocusTargetAttributes = useRestoreFocusTarget();
  const restoreFocusSourceAttributes = useRestoreFocusSource();

  return (
    <div>
      <OverlayDrawer
        {...restoreFocusSourceAttributes}
        open={open}
        position="end"
        onOpenChange={(_, state) => setOpen(state.open)}
        style={{ width: `${customSize}px` }}
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<Dismiss24Regular />}
                onClick={() => setOpen(false)}
              />
            }
          >
            Drawer with {customSize}px size
          </DrawerHeaderTitle>
        </DrawerHeader>

        <DrawerBody>
          <p>Drawer content</p>
        </DrawerBody>
      </OverlayDrawer>

      <div className={styles.main}>
        <Button {...restoreFocusTargetAttributes} appearance="primary" onClick={() => setOpen(true)}>
          Open Drawer
        </Button>

        <div className={styles.field}>
          <Field label="Size">
            <Input
              pattern="[0-9]*"
              value={customSize.toString()}
              onChange={(_, data) => setCustomSize(data.value ? parseInt(data.value, 10) : 0)}
            />
          </Field>
        </div>
      </div>
    </div>
  );
};

CustomSize.parameters = {
  docs: {
    description: {
      story: 'The Drawer can be sized to any custom width, by overriding the `width` style property.',
    },
  },
};
```

## Best Practices

### Do's

- Always give an overlay drawer a title by placing DrawerHeaderTitle inside DrawerHeader, so the surface is announced with a meaningful name.
- Provide an explicit, labelled close affordance in the header action of DrawerHeaderTitle, such as a subtle Button with an aria-label of "Close", in addition to Escape and outside click.
- Apply the restore-focus source attributes to the drawer and the restore-focus target attributes to the element that opened it, so keyboard focus returns to the trigger when the drawer closes.
- Pick the drawer type from the interaction intent: type "overlay" for attention-demanding, dismissible tasks and type "inline" for navigation or sidebars that coexist with the page.
- Wrap the drawer's scrollable content in DrawerBody and keep DrawerHeader and DrawerFooter outside it, so header and footer actions stay reachable while content scrolls.
- Choose the position that matches the content and the reading direction: start or end for vertical panels and bottom for surfaces that suit a wide, short layout.
- Drive visibility through the open prop together with onOpenChange rather than mutating internal state, so all dismissal paths (Escape, outside click, close button) stay in sync.
- Keep a practical width for resizable or custom-sized drawers; the resizable example recommends a minimum of about 240 pixels.

### Don'ts

- Do not open a second drawer from inside an open drawer; it creates a confusing stacked experience. Animate a second level of content inside the same drawer instead.
- Do not set modalType to "alert" without an in-drawer close control, because Escape and outside click will no longer dismiss the surface when no onOpenChange handler is provided.
- Do not place long or overflowing content directly in the drawer root expecting it to scroll; the drawer does not scroll its content unless DrawerBody wraps it.
- Do not use icon-only close buttons without an aria-label; screen reader users need an announced name for the action.
- Do not hardcode widths when the size prop already covers the case, and do not leave a user-resizable drawer able to shrink below a usable minimum.
- Do not make a modal overlay drawer non-dismissible just to steer the user, unless the flow truly must be completed first.
- Do not use a non-modal overlay when the background content the user can still reach conflicts with the drawer's purpose, since focus is no longer contained.

## Anti-Patterns

### Opening a drawer from inside another drawer

❌ Stacking a second drawer on top of an open drawer multiplies backdrops, focus traps, and dismissal paths, which is confusing for both sighted and screen reader users.

✅ Animate a second level of content inside the same drawer surface, pushing the first level's content aside, as shown in the multiple-levels pattern that uses motion APIs on the inner content.

### Skipping focus restoration attributes

❌ Without the restore-focus source attributes on the drawer and the restore-focus target attributes on the trigger, focus is not returned to the control that opened the drawer, and keyboard users are dropped back at the top of the document.

✅ Spread the restore-focus source attributes onto the drawer and the restore-focus target attributes onto the invoking button, which is what every overlay example in the documentation does.

### Trapping the user with alert modality and no way out

❌ Setting modalType to "alert" and omitting an onOpenChange handler disables Escape and outside-click dismissal, so a drawer with no internal close control becomes a dead end.

✅ Reserve alert modality for flows that truly must be completed, and always provide a labelled close or completion control inside the drawer that updates the open state.

### Expecting the drawer root to scroll

❌ Content placed directly in the drawer does not scroll when it overflows, so long content is clipped and unreachable.

✅ Wrap overflowing content in DrawerBody, keep DrawerHeader and DrawerFooter outside of it, and add a tabIndex of 0 to DrawerBody when it contains no focusable elements so keyboard users can scroll it.

### Sidelining the size prop with ad hoc widths

❌ Hardcoding widths duplicates the built-in size steps and produces drawers that do not respond to the design system, and user-resizable drawers can be dragged below a usable minimum.

✅ Use the size prop for standard widths and apply a width style override only for deliberate custom sizing, validating any typed or dragged width against a sensible minimum.

## Accessibility

**Requirements**: The drawer must be fully operable from the keyboard (WCAG 2.1.1) and must move focus into the surface when it opens, returning focus to the invoking control when it closes via the restore-focus source and target attributes used in the examples. Escape must dismiss a standard overlay drawer (WCAG 2.1.2); the alert modality intentionally removes Escape and outside-click dismissal, so an alternative, clearly labelled close control becomes mandatory in that case. The surface and its backdrop must maintain contrast with the text and controls inside them (WCAG 1.4.3), and any motion used by the surface or backdrop should be suppressible (WCAG 2.3.3), which is possible by setting both motion props to null. Scrollable drawer regions must be keyboard reachable, and icon-only actions must carry accessible names.

| Key | Action |
| --- | --- |
| `Escape` | Closes an open overlay drawer, provided the drawer is not using the alert modality without an onOpenChange handler. |
| `Tab` | Moves focus forward to the next focusable element inside the modal drawer surface, keeping focus contained while the drawer is modal. |
| `Shift+Tab` | Moves focus backward through the focusable elements of the drawer. |
| `Enter` | Activates the focused control, such as the header close button, and submits the entered value in the resizable-drawer dialog pattern. |
| `Space` | Activates the focused button, such as the header close action or a footer action. |
| `ArrowUp or ArrowRight` | Increases the inline drawer width in the resizable pattern, where the resize handle is a separator-role control. |
| `ArrowDown or ArrowLeft` | Decreases the inline drawer width in the resizable pattern. |
| `Escape` | Dismisses the auxiliary dialog used by the resizable pattern to type an exact drawer width. |

**ARIA**: aria-label, aria-labelledby, role, aria-orientation, aria-valuenow, aria-valuemin, aria-valuemax

**Screen Reader**: When a modal overlay drawer opens, focus moves into the surface and stays there until it closes, so screen reader users encounter the drawer content before the rest of the page; the title rendered by DrawerHeaderTitle gives that surface its announced name. Icon-only actions such as the dismiss button rely on aria-label to be announced meaningfully, and grouped controls inside the drawer reference a visible label through aria-labelledby, as in the type and size radio groups shown in the examples. Non-modal overlays leave the rest of the page reachable in the reading order, so the drawer is read as an additional region rather than the only accessible content. For a resizable drawer, the resize handle is exposed with role separator plus aria-orientation and the aria-valuenow, aria-valuemin, and aria-valuemax range so the current width is reported. On close, focus returns to the trigger only when the restore-focus source attributes are on the drawer and the restore-focus target attributes are on the trigger; otherwise focus can fall back to the document body.

## Styling

Style the drawer surface with makeStyles and mergeClasses, and target the surface itself with className and style, which is exactly how the custom-size and resizable examples override width. Prefer the size prop for standard widths and reserve inline style overrides for genuinely custom or interactive sizing, keeping the value practically usable (the resizable example warns below roughly 240 pixels). Use tokens.colorNeutralBackground1 for the surface fill and tokens.colorNeutralStroke2 with tokens.strokeWidthThin for the separator that the separator prop draws along the corresponding edge, letting tokens.borderRadiusLarge or tokens.borderRadiusMedium soften the corner nearest the page where appropriate. Padding inside DrawerHeader, DrawerBody, and DrawerFooter follows the spacing scale, so use tokens.spacingHorizontalXXL, tokens.spacingHorizontalL, tokens.spacingVerticalL, and tokens.spacingVerticalM rather than raw pixel values. Because DrawerBody is the scrollable region, keep DrawerHeader and DrawerFooter outside it so their actions remain visible while content scrolls. For motion, replace or customize the animated surface and backdrop through surfaceMotion and backdropMotion and reference tokens.durationNormal, tokens.durationSlow, tokens.curveDecay, and tokens.curveEasyEase in the custom motion rather than inventing timing values.

## Performance

Closed drawer content is unmounted by default, which keeps heavy subtrees out of the DOM but discards their internal state and scroll position; set unmountOnClose to false when a large or stateful body should be retained across openings, accepting the extra memory and render cost. Store open and close handlers with React.useCallback, as the position example does, so drawer surfaces do not re-render on unrelated parent updates. Interactive sizing should be throttled to animation frames, which is how the resizable example computes width with requestAnimationFrame on pointer move rather than on every event. Heavy scroll content belongs inside DrawerBody so the layout, not the whole page, absorbs the scrolling work. Motion components add render work while animating, so disabling surfaceMotion and backdropMotion with null is a legitimate measure for low-powered devices as well as for users who prefer reduced motion, and rendering the overlay into a container through mountNode scopes layout and paint to that ancestor.

## Theming & Tokens

The drawer surface is painted with theme tokens, most visibly tokens.colorNeutralBackground1, so it adapts automatically when a Provider theme is swapped. Elevation for overlay surfaces comes from shadow tokens such as tokens.shadow64, with lighter steps like tokens.shadow16 available if you customize the surface yourself. The separator drawn by the separator prop is derived from neutral stroke tokens such as tokens.colorNeutralStroke2 at tokens.strokeWidthThin, and focus indicators on controls inside the drawer use tokens.colorNeutralStrokeAccessible. Text inside the drawer follows tokens.colorNeutralForeground1 for primary copy and tokens.colorNeutralForeground2 for secondary copy, while actions placed in the header or footer inherit Button theming, including tokens.colorBrandBackground and tokens.colorBrandForeground1 for primary actions and tokens.colorNeutralBackground1Hover for subtle ones. Motion timing and easing should reference tokens.durationNormal, tokens.durationSlow, tokens.curveDecay, and tokens.curveEasyEase when custom motion is supplied through surfaceMotion or backdropMotion; the backdrop overlay itself is theme-driven and is not meant to be restyled directly.

## Migration Notes

Drawer is the v9 successor to earlier panel-style overlay surfaces. Rather than one monolithic component with an overlay toggle baked in, v9 exposes OverlayDrawer and InlineDrawer as distinct surfaces and also lets a single Drawer switch between them with the type prop. Visibility is controlled declaratively through open plus onOpenChange instead of separate imperative show and dismiss callbacks, and dismissal modes are expressed through modalType, including "non-modal" for background interactivity and "alert" for fully blocking surfaces. Focus restoration is not implicit in every scenario: the examples attach the restore-focus source attributes to the drawer and the restore-focus target attributes to the trigger, so ported code that previously relied on automatic focus return must add these attributes explicitly. Animation is configured through surfaceMotion and backdropMotion and can be turned off entirely by setting both to null, replacing older animation-only configuration. Content is also structured through dedicated parts, DrawerHeader, DrawerHeaderNavigation, DrawerHeaderTitle, DrawerBody, and DrawerFooter, and generated markup should be re-checked against that composition when porting.

## Edge Cases

- A DrawerBody that contains no focusable elements must be given a tabIndex of 0, otherwise keyboard users cannot scroll its overflowing content.
- Closed drawer content is removed from the DOM by default, so form state, scroll position, and expensive subtrees are lost between openings unless unmountOnClose is set to false.
- Setting modalType to "alert" without an onOpenChange handler removes both Escape and outside-click dismissal, so the user can only exit through a control you render inside the drawer.
- Switching the type between inline and overlay at runtime, for example from a media query, can change the drawer's modality and dismissal behavior while it is open, so the open state should be managed alongside the type.
- A custom width applied through style overrides bypasses the size prop entirely; interactively resizable drawers should guard against widths below roughly 240 pixels, as the resizable example does.
- Rendering an overlay drawer with mountNode scopes it to that container, so its stacking and scroll context follow the ancestor rather than the page root and the backdrop will not cover the whole viewport.
- Always-open inline drawers cannot be closed by the user, so they should only hold persistent, non-dismissible content such as navigation.

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
