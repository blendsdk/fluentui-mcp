# Dialog

> **Package**: `@fluentui/react-dialog` v9.18.1
> **Import**: `import { Dialog } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

Dialog is a composite, feedback-category component that presents a window layered over the rest of the application to focus the user on a single task or an important message. The Dialog component itself is the state and behavior controller: it owns the open state (controlled through open and onOpenChange, or uncontrolled through defaultOpen), decides how the surface behaves through modalType (modal, non-modal, or alert), and expects its children to be a DialogTrigger paired with a DialogSurface, or a DialogSurface alone when the trigger lives outside the dialog. In typical usage the surface is composed from DialogBody, DialogTitle, DialogContent, and DialogActions to form the standard Fluent layout with a heading area, scrolling body, and an action row. Because it handles focus containment, Escape and backdrop dismissal, layered rendering, entrance and exit motion (through its required surfaceMotion slot), and background inertness or dimming, Dialog lets product teams build confirmations, forms, alerts, and other interruptive experiences without re-implementing accessibility and focus management. It also composes with other Fluent surfaces, as shown by nested usage inside OverlayDrawer, and exposes hooks such as the restore-focus-target helper for custom triggers rendered outside the dialog.

**When to use**: Use Dialog when the user must complete a short, focused task before continuing, when you need an explicit decision or confirmation (especially for destructive or irreversible actions), or when you must interrupt the workflow with an important message. Choose the default modal type when the rest of the page should be blocked and dimmed, choose the non-modal type when users should be able to keep interacting with the surrounding page while the dialog stays visible, and choose alert when the message is critical and must be acknowledged through the dialog's own actions because the backdrop cannot dismiss it. Dialog is the right choice for confirmations such as deleting a file, short forms such as sign-in or invitation flows, and short information requests. Prefer alternatives when the task is not interruptive or not short: use Drawer or OverlayDrawer for larger secondary workflows and multi-field forms that benefit from more space, use MessageBar, Toast, or inline messaging for non-blocking status and success information, use TeachingPopover for brief contextual education anchored to a UI element, and use Popover or Menu when a lightweight surface, not a decision, is what the interaction needs.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `JSXElement \| [JSXElement, JSXElement]` | — | Yes | Can contain two children including `DialogTrigger` and `DialogSurface`. Alternatively can only contain `DialogSurface` if using trigger outside dialog, or controlling state. |
| `defaultOpen` | `boolean \| undefined` | `false` | No | Default value for the uncontrolled open state of the dialog. |
| `inertTrapFocus` | `boolean \| undefined` | `false` | No | Enables standard behavior according to the [HTML dialog spec](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) where the focus trap involves setting outside elements inert. |
| `modalType` | `DialogModalType \| undefined` | `modal` | No | Dialog variations.  `modal`: When this type of dialog is open, the rest of the page is dimmed out and cannot be interacted with. The tab sequence is kept within the dialog and moving the focus outside the dialog will imply closing it. This is the default type of the component.  `non-modal`: When a non-modal dialog is open, the rest of the page is not dimmed out and users can interact with the rest of the page. This also implies that the tab focus can move outside the dialog when it reaches the last focusable element.  `alert`: is a special type of modal dialogs that interrupts the user's workflow to communicate an important message or ask for a decision. Unlike a typical modal dialog, the user must take an action through the options given to dismiss the dialog, and it cannot be dismissed through the dimmed background. |
| `onOpenChange` | `DialogOpenChangeEventHandler \| undefined` | — | No | Callback fired when the component changes value from open state. |
| `open` | `boolean \| undefined` | `false` | No | Controls the open state of the dialog |
| `unmountOnClose` | `boolean \| undefined` | `true` | No | Decides whether the dialog should be removed from the DOM tree when it is closed. This can be useful when dealing with components that may contain state that should not be reset when the dialog is closed. |

### Prop Guidance

- **modalType**: Selects the interaction contract of the dialog. Leave the default modal for tasks that should block and dim the rest of the page and keep focus trapped inside the surface. Use non-modal for supplementary content that should not interrupt the page or trap focus. Use alert only for critical messages and decisions that must be answered through the dialog's own actions, because the backdrop cannot dismiss an alert dialog. `modal`
- **open**: Use when the dialog state must be controlled by your application, for example when opening it from a command outside the dialog or when orchestrating it with other state. Pair it with onOpenChange so user-initiated dismissals such as Escape or the backdrop update your state, and do not combine it with defaultOpen. `true`
- **defaultOpen**: Use for an uncontrolled dialog that should start open, or when the dialog manages its own state internally and you do not need to observe or override it. Once you need to react to opening or closing, switch to open with onOpenChange. `false`
- **onOpenChange**: Receives the change event and a data object whose open flag is the requested next state; use it to mirror the state back into your own store when the dialog is controlled. It fires for every dismissal path, including Escape, backdrop interaction, and triggers inside the dialog, so this is the single place to run close-time side effects such as resetting a form. `data.open`
- **children**: Accepts either a DialogTrigger followed by a DialogSurface, or only a DialogSurface when the trigger lives elsewhere or the dialog is opened programmatically. The surface is where DialogBody, DialogTitle, DialogContent, and DialogActions are composed, so all visual structure lives under this prop. `DialogTrigger and DialogSurface`
- **inertTrapFocus**: Enable when you want the focus trap to follow the HTML dialog specification by marking outside elements inert instead of relying on the default focus containment. This is useful when the surrounding page contains interactive content that should be fully neutralized, but verify browser support for inert before shipping it broadly. `true`
- **unmountOnClose**: Leave at its default of true for the common case so the dialog subtree is removed from the DOM when closed, which resets internal state and frees resources. Set it to false when the dialog contains state you want to preserve, such as partially entered form data or a scroll position, and accept that the content then remains mounted while hidden. `false`
- **surfaceMotion**: The required motion slot that drives the entrance and exit animation of the dialog surface. Pass parameters such as duration, easing, outScale, and animateOpacity to align the surface animation with your product's motion language; when several animated dialogs share values, define them once and reuse them so timings stay consistent. `duration, easing, outScale, animateOpacity`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `surfaceMotion` | — | Yes | For more information refer to the [Motion docs page](https://react.fluentui.dev/?path=/docs/motion-motion-slot--docs). |
| `surfaceMotion` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam exercitationem cumque repellendus eaque
            est dolor eius expedita nulla ullam? Tenetur reprehenderit aut voluptatum impedit voluptates in natus iure
            cumque eaque?
          </DialogContent>
          <DialogActions>
            <Button appearance="primary">Do Something</Button>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Close</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
```

### BackdropAppearance

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';
import story from './DialogBackdropAppearance.md';

export const BackdropAppearance = (): JSXElement => {
  const styles = useStyles();
  const labelId = useId('backdrop-appearance-label');

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [backdropAppearance, setBackdropAppearance] = React.useState<BackdropAppearanceOption>();
  const backdropProp = backdropAppearance ? { appearance: backdropAppearance } : undefined;

  return (
    <>
      <Button appearance="primary" onClick={() => setDrawerOpen(true)}>
        Open Drawer
      </Button>

      <OverlayDrawer open={drawerOpen} onOpenChange={(_, { open }) => setDrawerOpen(open)}>
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<Dismiss24Regular />}
                onClick={() => setDrawerOpen(false)}
              />
            }
          >
            Drawer
          </DrawerHeaderTitle>
        </DrawerHeader>

        <DrawerBody>
          <div className={styles.field}>
            <Label id={labelId}>Backdrop appearance</Label>
            <RadioGroup
              value={backdropAppearance}
              onChange={(_, data) => setBackdropAppearance(data.value as BackdropAppearanceOption)}
              aria-labelledby={labelId}
            >
              <Radio value="dimmed" label="Dimmed" />
              <Radio value="transparent" label="Transparent" />
            </RadioGroup>
          </div>

          <Dialog>
            <DialogTrigger disableButtonEnhancement>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogSurface backdrop={backdropProp}>
              <DialogBody>
                <DialogTitle>Dialog</DialogTitle>
                <DialogContent>
                  This Dialog is rendered inside an OverlayDrawer, which internally uses Dialog. By default, nested
                  dialogs have a backdrop applied based on inner context. Use the <code>backdrop</code> prop to override
                  this behavior.
                </DialogContent>
                <DialogActions>
                  <DialogTrigger disableButtonEnhancement>
                    <Button appearance="primary">Close</Button>
                  </DialogTrigger>
                </DialogActions>
              </DialogBody>
            </DialogSurface>
          </Dialog>
        </DrawerBody>
      </OverlayDrawer>
    </>
  );
};

BackdropAppearance.parameters = {
  docs: {
    description: {
      story,
    },
  },
};
```

### Actions

```tsx
import * as React from 'react';
import type { JSXElement, CheckboxOnChangeData } from '@fluentui/react-components';
import story from './DialogActions.md';

export const Actions = (): JSXElement => {
  const [checked, setChecked] = React.useState(false);
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>, data: CheckboxOnChangeData) => {
    setChecked(Boolean(data.checked));
  };
  return (
    <Dialog modalType="non-modal">
      <DialogTrigger disableButtonEnhancement>
        <Button>Open campaign dialog</Button>
      </DialogTrigger>
      <DialogSurface aria-describedby={undefined}>
        <DialogBody>
          <DialogTitle>Delete this campaign?</DialogTitle>
          <DialogContent>
            <p>
              You're about to delete the campaign group "Campaign name that goes up to two lines". This will also delete
              all associated campaign resources, including the overview page, files, publications, conversations, and so
              forth. Please back up any content you need before proceeding.
            </p>
            <Checkbox
              checked={checked}
              onChange={handleChange}
              label="Yes, delete this campaign and all its associated resources"
            />
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button disabled={!checked} appearance="primary">
                Delete
              </Button>
            </DialogTrigger>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cancel</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

Actions.parameters = {
  docs: {
    description: {
      story,
    },
  },
};
```

## Best Practices

### Do's

- Always render a DialogTitle inside the DialogBody so the surface has a programmatic name; for short confirmation dialogs, also connect the title and content to the surface with aria-labelledby and aria-describedby using generated ids.
- Keep at least one focusable element inside the dialog (a close button or an action button) so keyboard users have an explicit, discoverable way to dismiss it; the no-focusable-element scenario depends entirely on Escape and backdrop clicks and is not recommended.
- Use the controlled pattern with open and onOpenChange whenever the dialog must be opened from somewhere other than a DialogTrigger, such as a toolbar command or a programmatic workflow, and remember to restore focus to the element that opened it.
- For a trigger rendered outside the dialog, spread the restore-focus-target helper onto that element so focus returns to it when the dialog closes, mirroring the behavior DialogTrigger gives you for free.
- Place the primary action first in the DialogActions row and the dismissive or cancel action last, matching the visual order Fluent dialogs use, and mark destructive primary actions clearly.
- Choose modalType deliberately: leave the default modal type for tasks that should block the page, use non-modal for supplementary content that should not interrupt, and reserve alert for messages that require an explicit decision.
- Let long content scroll through DialogContent rather than fixing the dialog height; the body is designed to grow within the viewport and become scrollable when it overflows.
- Set unmountOnClose to false only when the dialog holds state that must survive closing, such as form entries or a scroll position, and accept that the content then stays mounted in the DOM.

### Don'ts

- Do not ship a dialog without a visible, focusable dismissal path; a dialog whose only exits are Escape and the backdrop is an accessibility and usability failure.
- Do not stack one modal dialog on top of another modal dialog; nested modals multiply focus traps and backdrop layers, and the inner surface's backdrop behavior has to be reconsidered explicitly.
- Do not use Dialog for multi-step wizards, long forms, or content that deserves its own page; those belong in a Drawer, OverlayDrawer, or a routed view.
- Do not use a Dialog to announce success, progress, or passive status; use MessageBar, Toast, or Spinner-based inline feedback so you do not interrupt the user for information that requires no decision.
- Do not expect the backdrop to close an alert dialog; alert type dialogs can only be dismissed through their own actions or the Escape key, so always provide a close or decision button.
- Do not pass both open and defaultOpen; mixing controlled and uncontrolled state produces confusing, hard-to-reproduce behavior.
- Do not point aria-describedby at long body text the way you would for a two-line confirmation; screen readers read the description verbatim and long descriptions become noise.
- Do not omit the restore-focus target for custom triggers rendered outside the dialog, or keyboard users will be dropped back at the top of the document when the dialog closes.

## Anti-Patterns

### Dialog as a page or wizard

❌ Multi-step flows, long forms, and dense content forced into a Dialog fight the surface's small footprint and its scrolling body, and they block the page for far longer than a dialog should.

✅ Move the flow into a Drawer or OverlayDrawer, or give it a dedicated route, and reserve Dialog for short, decision-focused interactions such as confirmations and compact forms.

### Unclosable dialog

❌ A modal dialog with no focusable element and no visible close control leaves keyboard and screen reader users dependent on the Escape key or a backdrop click, contrary to the guidance that a dialog should always expose a focusable dismissal path.

✅ Always include at least one focusable control, typically a dismiss or primary action inside DialogActions and optionally a DialogTrigger set to close in the DialogTitle action slot.

### Alert used as decoration

❌ Choosing the alert type for routine confirmations makes the exchange unnecessarily forceful, and because alert dialogs cannot be dismissed through the backdrop, users lose the fastest exit they expect.

✅ Reserve the alert type for genuinely critical messages and decisions, and use the default modal type for ordinary confirmations where the backdrop and close button are acceptable exits.

### Stacked modals

❌ Opening a second modal dialog from inside the first creates two focus traps and two backdrops that have to be reasoned about explicitly, and dismissal order becomes ambiguous for keyboard users.

✅ Prefer replacing the content of the existing dialog or dismissing it before opening another; when nesting is truly required, drive the inner surface deliberately with its own backdrop configuration and keep the number of layers to a minimum.

### State loss from aggressive remounting

❌ Relying on the default unmount behavior while users are mid-task in a long form discards their input, and flipping the setting globally keeps heavy content mounted everywhere, increasing memory and DOM cost.

✅ Set unmountOnClose to false only on the specific dialogs whose state must persist, and reset state explicitly through the open-change callback for dialogs where a fresh start is desired.

## Accessibility

**Requirements**: Every dialog must have an accessible name, normally supplied by DialogTitle and wired up with aria-labelledby (and aria-describedby for short confirmation copy). Modal and alert dialogs must contain at least one focusable control so that keyboard users can act without relying on Escape. Modal dialogs must keep Tab navigation inside the surface until the dialog closes and must return focus to the element that opened them afterwards. Content behind a modal dialog must be unavailable to assistive technology, either through the default focus trap or through the inert behavior enabled by inertTrapFocus. Alert dialogs must present their actions in the dialog itself, because the backdrop is not dismissive. Icon-only controls such as a dismiss button inside DialogTitle require an explicit aria-label.

| Key | Action |
| --- | --- |
| `Escape` | Dismisses the dialog when focus is inside it; this works for modal, alert, and non-modal types and is the guaranteed exit even when the dialog contains no focusable elements. |
| `Tab` | Moves focus forward through the dialog's focusable elements; for modal and alert dialogs the sequence wraps within the surface instead of escaping to the page behind it. |
| `Shift+Tab` | Moves focus backward through the dialog's focusable elements, wrapping from the first element back to the last inside modal and alert dialogs. |
| `Enter` | Activates the focused button, such as a primary action in DialogActions, and submits a form when the dialog content is wrapped in one with a submit button. |
| `Space` | Activates the focused button, including buttons placed inside DialogTitle as a custom action. |

**ARIA**: role set on DialogSurface (dialog semantics, announced as an alert dialog for the alert type), aria-modal for modal and alert dialogs, marking the surface as the only interactive region, aria-labelledby pointing at the DialogTitle element id, aria-describedby pointing at short DialogContent copy for confirmation dialogs, aria-label on icon-only dismiss buttons and on surfaces that have no visible title, inert or aria-hidden applied to the rest of the page when a modal dialog is open

**Screen Reader**: When a dialog opens, focus is moved into the surface, so screen readers announce the dialog role together with its accessible name from the title and, for confirmation dialogs, the description from the content. While a modal dialog is open, background content is removed from the accessibility tree or made inert, so virtual cursor navigation cannot reach the page behind the surface. Screen readers announce the currently focused control as the user tabs through the dialog's actions, and after the dialog closes focus is restored to the trigger element, so the user hears the trigger again and knows where they are. Alert dialogs are announced more urgently and are expected to carry their own actionable choices.

## Styling

Customize the surface by passing a className or style onto DialogSurface and its child regions; the surface background comes from tokens.colorNeutralBackground1, its border from tokens.colorNeutralStroke1 (or tokens.colorNeutralStrokeAccessible for higher contrast themes), and its elevation from tokens.shadow64 plus tokens.colorNeutralShadowAmbient and tokens.colorNeutralShadowKey. Rounded corners use tokens.borderRadiusXLarge, and internal breathing room maps to spacing tokens such as tokens.spacingHorizontalXXL and tokens.spacingVerticalXXL, with DialogBody gaps typically controlled through tokens.spacingVerticalMNudge or explicit spacing. Width is best expressed as a max-width so the surface adapts to small viewports, and long content should be allowed to scroll in the body rather than forcing a fixed height. The action row can be laid out with the fluid and position options on DialogActions, and start/end positioning mirrors automatically in right-to-left contexts through the provider direction. Backdrop styling is controlled from the surface: switch between the dimmed and transparent backdrop appearances, and tune the fade with backdropMotion, while surface entrance and exit timing, easing, scale, and opacity come from the surfaceMotion slot, where tokens such as motionTokens.durationGentle, motionTokens.durationSlow, and motionTokens.curveDecelerateMid pair naturally with the defaults.

## Performance

By default the dialog content is unmounted when closed, so heavy bodies, embedded media, and large forms cost nothing while the dialog is hidden; consider setting unmountOnClose to false only where state preservation is required, and treat that as a deliberate tradeoff that keeps that subtree mounted for the lifetime of the page. The required surfaceMotion slot means every open and close triggers an animation, so keep custom durations short, prefer motion tokens such as motionTokens.durationGentle and motionTokens.durationNormal, and avoid animating large or complex subtrees unnecessarily. When a dialog is controlled through open and onOpenChange, keep the state as close to the dialog as possible so that opening and closing does not re-render large surrounding trees. Dialogs inside lists or repeated rows should be rendered lazily from the row that opens them rather than mounting a surface per item, and backdrop and inert or aria-hidden work on the background is proportional to the size of the page behind the dialog, which is another reason to keep modal usage focused and short-lived.

## Theming & Tokens

Dialog inherits everything from the nearest FluentProvider, so its surface uses tokens.colorNeutralBackground1 for the resting background, tokens.colorNeutralForeground1 for the title and body text, tokens.colorNeutralForeground3 or tokens.colorNeutralForeground4 for secondary copy, and tokens.colorNeutralStroke1 or tokens.colorNeutralStrokeAccessible for outlines and separators. Elevation and scrim come from tokens.shadow64 together with tokens.colorNeutralShadowAmbient and tokens.colorNeutralShadowKey, and the dimmed backdrop layer is derived from the theme's overlay color so it darkens correctly in both light and dark themes. Radius and spacing follow tokens.borderRadiusXLarge and the tokens.spacingHorizontalXXL and tokens.spacingVerticalXXL family, focus visibility follows tokens.colorStrokeFocus1 and tokens.colorStrokeFocus2, and typography in the title region tracks the theme's semibold heading sizes. Motion is themeable too: default surface timings align with motionTokens.durationGentle and motionTokens.curveDecelerateMid, and both surfaceMotion and backdropMotion override them per dialog. Because direction flows from the provider, start and end alignment in DialogActions and text alignment inside the surface mirror automatically for right-to-left locales.

## Migration Notes

Compared with the older Fluent UI dialog implementation, the v9 Dialog separates concerns into composable parts instead of a single component with type variants. DialogType and the modal props object are replaced by the single modalType prop, which accepts the modal, non-modal, and alert values with modal as the default. Visibility is expressed declaratively with open plus onOpenChange and defaultOpen rather than hidden and onDismiss, so the same controlled pattern works for programmatic and trigger-driven flows. Triggers are now explicit components: DialogTrigger wraps the element that opens the dialog and can also close it through its action option, with button enhancement disabled when the child is already a Fluent button. The footer region is now DialogActions with fluid and position options instead of a DialogFooter with custom action props, and the title region is DialogTitle with an action slot that can hold a dismiss trigger or be nulled out. Layout is assembled from DialogBody, DialogTitle, and DialogContent, and the surface owns backdrop and motion configuration, including the surfaceMotion slot, so animation tuning no longer requires custom CSS keyframes.

## Edge Cases

- Setting unmountOnClose to false keeps the dialog subtree mounted while hidden, which preserves scroll position and internal state but also means duplicate element ids and hidden interactive nodes can persist in the document; make sure ids used for aria-labelledby and aria-describedby remain unique.
- An alert dialog cannot be dismissed by interacting with the backdrop, so it must always contain its own decision or close action; the only non-action exit is the Escape key.
- A modal dialog with no focusable element still opens and closes through Escape and the backdrop, but the intended focus target is not available, so focus behavior deviates from the documented pattern and should be avoided.
- The inertTrapFocus option relies on the HTML dialog focus model where outside elements are made inert, which behaves differently from the default containment and may not be supported in every browser your product targets.
- Nested dialogs receive their backdrop appearance from the surrounding context, and inner surfaces may need an explicit backdrop override to look correct on top of an existing overlay.
- Passing open without handling onOpenChange effectively makes the dialog read-only from the user's perspective, since Escape, the backdrop, and trigger clicks cannot update your state.
- When content overflows, DialogContent is the region that scrolls, so fixed heights or absolute positioning applied to interior elements can break the built-in scrolling behavior.
- Opening the dialog programmatically means no DialogTrigger is present to restore focus on close; use the restore-focus-target helper on the launching element so keyboard users are returned to it.

## See Also

- [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
