# Dialog

> **Package**: `@fluentui/react-dialog` v9.18.1
> **Import**: `import { Dialog } from '@fluentui/react-components';`
> **Category**: feedback
> **Stability**: stable

## Overview

Dialog is the Fluent UI React v9 component for presenting temporary, interruptive UI that requests information, confirmation, or a decision from the user. It is a composition-based component: the Dialog wrapper owns the open state, modality, focus behavior, and mounting, while its children supply the markup — typically DialogTrigger for the element that opens (or closes) it and DialogSurface for the elevated container, which in turn wraps DialogBody, DialogTitle, DialogContent, and DialogActions. A Dialog can run in three variations through modalType: the default modal, which dims the page, blocks interaction, and keeps the tab sequence inside the dialog; non-modal, which leaves the rest of the page interactive and lets tab focus escape; and alert, which interrupts the workflow for an important message or decision and cannot be dismissed by clicking the dimmed backdrop — only through an explicit action or the Escape key. The surface animation is driven through the surfaceMotion slot, or tuned directly by passing motion parameters such as duration, outScale, easing, and animateOpacity to Dialog, with the backdrop fade tuned independently on the surface. State can be controlled with open and onOpenChange, or left uncontrolled with defaultOpen, and unmountOnClose decides whether the dialog content is removed from the DOM (and therefore loses its state) when closed.

**When to use**: Use Dialog when the user must stop and attend to a focused task or decision before continuing — destructive confirmations (deleting a file or campaign), short forms such as sign-in or data entry, or an alert that communicates something important that requires acknowledgment. Use the default modal Dialog when the task must block the rest of the page, modalType set to alert when the user must act on the options provided rather than swiping the dialog away, and modalType set to non-modal when the content is supplementary and the user should be able to keep working behind it (for example, a helper or reference panel opened from a toolbar). Prefer non-Dialog alternatives when the interaction is not interruptive: use Drawer for auxiliary side panels and multi-step flows that occupy a lot of space, Popover or TeachingPopover for lightweight contextual information anchored to a trigger, Menu for a list of commands on a trigger, Tooltip for one-line explanations, MessageBar for inline, non-blocking notifications, and inline form validation rather than a dialog when the error belongs to a field already on screen.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `any` | — | Yes | Can contain two children including `DialogTrigger` and `DialogSurface`. Alternatively can only contain `DialogSurface` if using trigger outside dialog, or controlling state. |
| `defaultOpen` | `boolean \| undefined` | `false` | No | Default value for the uncontrolled open state of the dialog. |
| `inertTrapFocus` | `boolean \| undefined` | `false` | No | Enables standard behavior according to the [HTML dialog spec](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) where the focus trap involves setting outside elements inert. |
| `modalType` | `DialogModalType \| undefined` | `modal` | No | Dialog variations.  `modal`: When this type of dialog is open, the rest of the page is dimmed out and cannot be interacted with. The tab sequence is kept within the dialog and moving the focus outside the dialog will imply closing it. This is the default type of the component.  `non-modal`: When a non-modal dialog is open, the rest of the page is not dimmed out and users can interact with the rest of the page. This also implies that the tab focus can move outside the dialog when it reaches the last focusable element.  `alert`: is a special type of modal dialogs that interrupts the user's workflow to communicate an important message or ask for a decision. Unlike a typical modal dialog, the user must take an action through the options given to dismiss the dialog, and it cannot be dismissed through the dimmed background. |
| `onOpenChange` | `DialogOpenChangeEventHandler \| undefined` | — | No | Callback fired when the component changes value from open state. |
| `open` | `boolean \| undefined` | `false` | No | Controls the open state of the dialog |
| `unmountOnClose` | `boolean \| undefined` | `true` | No | Decides whether the dialog should be removed from the DOM tree when it is closed. This can be useful when dealing with components that may contain state that should not be reset when the dialog is closed. |

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

- Give every dialog a clear accessible name by putting the question or task in DialogTitle and, for short confirmation dialogs, wiring the surface's aria-labelledby and aria-describedby to the title and content elements so screen readers announce the whole message at once.
- Always include at least one focusable element (typically a Close or Cancel action in DialogActions) so keyboard users can leave the dialog without relying on Escape; the no-focusable-element guidance explicitly marks dialogs without one as not recommended.
- Choose modalType deliberately: leave it at the default modal for blocking tasks, use non-modal when the user should keep interacting with the page behind, and reserve alert for messages or decisions that must be resolved before the user continues.
- Close dialogs through DialogTrigger with its action set to close — including in the DialogTitle action slot, as the custom title action example does — so focus return, Escape handling, and open state all stay in sync instead of being manually managed with extra state.
- Prefer the uncontrolled pattern (defaultOpen) for simple cases and switch to the controlled pattern (open plus onOpenChange) only when the dialog's visibility is coupled to other application state, such as enabling a destructive action only after a confirmation checkbox is checked.
- Wrap form content in a form element inside DialogSurface with the submit button placed in DialogActions, so pressing Enter submits the form and the primary action stays in the expected position.
- Establish a single primary action per dialog with the primary appearance and mark the remaining actions as secondary, placing destructive actions where they are clearly labeled (for example, a Delete button rather than a vague OK).
- Set unmountOnClose to false only when the dialog holds state that must survive closing, such as scroll position or partially filled fields in long content.

### Don'ts

- Don't stack modal dialogs or nest dialogs casually; when a dialog genuinely has to render inside another overlay, be aware that its backdrop is derived from the inner context and must be overridden explicitly on the surface.
- Don't set aria-describedby to long descriptions — the confirmation pattern of pointing the accessible description at the content is appropriate only for very short dialogs and should be avoided for dialogs with longer content.
- Don't rely on clicking the dimmed backdrop to dismiss an alert dialog; alert dialogs ignore backdrop dismissal and require an explicit action or Escape, so make the dismissal affordance visible.
- Don't render a dialog whose only interactive content is far away or missing entirely — an unreachable or empty modal traps keyboard users even though Escape and, for modals, the backdrop remain functional.
- Don't place the trigger that opens the dialog outside the Dialog children unless you take full control of open and onOpenChange and restore focus to that trigger yourself; the built-in trigger wiring only applies to triggers rendered inside the dialog.
- Don't use Dialog for non-blocking feedback, inline errors, or background progress; those belong in MessageBar, Field validation, Spinner, or Toast so users are not interrupted.
- Don't fight the default focus behavior by imperatively focusing arbitrary elements on every render; change the initially focused element intentionally, in an effect after the dialog opens.
- Don't restyle the surface with arbitrary values or reposition it manually — override theme tokens and the documented surface props instead so positioning, contrast, and motion remain consistent.

## Accessibility

## See Also

- - [feedback category](../categories/feedback.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
