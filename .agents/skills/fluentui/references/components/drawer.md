# Drawer

> **Package**: `@fluentui/react-drawer` v9.13.0
> **Import**: `import { Drawer } from '@fluentui/react-components';`
> **Category**: overlays
> **Stability**: stable

## Overview

Drawer is Fluent UI React v9's surface component for supplementary, navigation, or task-focused content that is stacked alongside or layered above the main page content. It is a component family: the base Drawer renders a surface whose behavior is selected with the type prop ("overlay" by default, or "inline"), and the package also exports the pre-configured shorthand components OverlayDrawer and InlineDrawer for the two modes. The surface itself is composed from companion parts: DrawerHeader, which holds DrawerHeaderNavigation for toolbars and DrawerHeaderTitle for the accessible heading and optional action slot, plus DrawerBody for scrollable content and DrawerFooter for actions. An overlay Drawer is hidden by default, is opened through state held by the consuming app, and blocks or dims the rest of the page unless modalType is set to non-modal; an inline Drawer is stacked in the same layout flow as the content and is commonly used for non-dismissible navigation that users can keep open while working. Open state is fully controlled through open and onOpenChange, sizing and placement are handled by size, position, separator, and plain style width overrides, and appearance/animation is driven by motion-related props such as surfaceMotion and backdropMotion.

**When to use**: Use Drawer when content should slide in from the edge of the screen or sit beside the main content without replacing it: navigation panes, filters, item detail views, edit/create forms, or settings. Choose OverlayDrawer when the task requires the user's full attention, when the underlying page should not be interacted with (the default modal behavior), or when the drawer must not take up permanent layout space; the story guidance describes overlay drawers as containing supplementary content for complex creation, edit, or management experiences such as viewing details about a list item. Choose InlineDrawer when the drawer is persistent or toggleable navigation that lives at the same level as the main surface, so users can still interact with other UI elements. Choose a responsive approach (switching the type prop based on a media query, as the Responsive story does at 720px) when a side panel should collapse into a temporary overlay on small viewports. Prefer Dialog when the user must complete or abandon a short modal task, and reserve Drawer for larger, longer-lived, or edge-anchored experiences; prefer NavDrawer or the Nav components when building the app's primary navigation shell.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `type` | `"inline" \| "overlay" \| undefined` | `overlay` | No | Type of the drawer.  - 'overlay' - Drawer is hidden by default and can be opened by clicking on the trigger. - 'inline' - Drawer is stacked with the content |

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

- Set the behavior mode explicitly with the type prop on Drawer, or pick the matching shorthand component (OverlayDrawer or InlineDrawer) so the drawer's relationship to page content is unambiguous.
- Wire every overlay drawer to open and onOpenChange so the component can request closing (Escape key, backdrop click) while your app remains the single source of truth for the open state.
- Give the drawer an accessible title using DrawerHeaderTitle inside DrawerHeader, and provide an icon-only close control through DrawerHeaderTitle's action slot with an explicit aria-label such as "Close".
- Add the manual focus restoration attributes provided by the focus restoration hooks to both the trigger and the drawer surface, since the stories note that all drawers need them unless an inline drawer intentionally should not restore focus.
- Wrap overflowing content in DrawerBody so the drawer scrolls, and add tabIndex of 0 to DrawerBody when the content contains no focusable elements, so keyboard users can scroll the region.
- Place toolbar and navigation controls in DrawerHeaderNavigation and secondary actions in DrawerFooter, keeping the title area focused on identifying the drawer.
- Use the size prop (small, medium, large, full) for standard widths, and override the width style only for genuinely custom sizes, keeping in mind the example's recommended minimum width of 240 pixels.

### Don'ts

- Don't open a second Drawer from inside an open Drawer; the MultipleLevels guidance explicitly warns this creates a confusing experience. Push the first level's content aside and animate a second level inside the same drawer instead.
- Don't use an overlay Drawer for navigation that should always be reachable; permanently visible navigation belongs in an inline drawer, which the AlwaysOpen story shows rendered with open set and no way for the user to dismiss it.
- Don't set modalType to alert to prevent Escape and outside-click dismissal unless the user truly must respond before continuing; the PreventClose story reserves this for critical or stacked-drawer scenarios.
- Don't render an icon-only action button in DrawerHeaderTitle without an aria-label; every close or toolbar button in the examples is labeled because the icon alone conveys nothing to screen readers.
- Don't skip onOpenChange when you expect the drawer to be dismissible; the stories show that omitting the handler for an alert-modal drawer is exactly what makes it unclosable.
- Don't disable motion with null surfaceMotion and backdropMotion as a blanket rule; the MotionDisabled story presents it as an explicit opt-out, and removing transitions globally can hurt users' understanding of spatial change.
- Don't rely on custom pixel widths without adapting to viewport size; an overlay drawer with a fixed large width can cover most of a small screen, which is what the Responsive pattern (switching to overlay below 720px) is designed to avoid.
- Don't forget that inline drawers participate in layout; dropping one into a container that has no flex or grid arrangement for it will push or overlap surrounding content unpredictably.

## Accessibility

## See Also

- [overlays category](../categories/overlays.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
