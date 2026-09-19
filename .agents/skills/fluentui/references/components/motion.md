# Motion

> **Package**: `@fluentui/react-motion` v9.16.0
> **Import**: `import { Motion } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

Motion is a low-level utility component exported from @fluentui/react-components that animates a single child element (the required children prop) using the browser animation engine, while leaving the element's markup, semantics, and event handling untouched. Rather than exposing style-oriented animation properties, Motion exposes a lifecycle-oriented surface: it reports when an animation starts, finishes, or is cancelled through onMotionStart, onMotionFinish, and onMotionCancel; it can be driven imperatively through imperativeRef, which receives a MotionImperativeRef; and it can be re-triggered declaratively by changing replayKey. Motion also supports a presence model, where direction describes whether the currently animating transition is an entrance or an exit and visible describes whether the element should be present at all, with unmountOnExit deciding whether the element is removed from the DOM once the exit motion completes. The appear flag controls whether that first mount is animated at all. Motion is the engine behind the motion slots of other Fluent UI components: Dialog exposes a surfaceMotion slot (typed with ScaleParams) and a Drawer, Accordion, and Tree expose collapse-style slots (typed with CollapseParams). When a slot is declared with typed parameters, those parameters can be supplied directly as props on the slot object, or through a children render function that receives a Motion component plus the resolved props. The CustomMotion, DirectParams, and DisableMotion stories show three practical uses: overriding the built-in motion of Dialog and Drawer, tuning motion parameters on Dialog, Accordion, and Tree with a shared duration, and turning motion off entirely for components that use it.

**When to use**: Use Motion when you need to customize how an existing component enters or leaves the screen and the component's built-in motion does not give you enough control. The most common entry points are the motion slots of other components: Dialog's surfaceMotion, Drawer's equivalent surface motion, and the collapseMotion slots on Accordion and Tree. For these, prefer the concise form where the slot's typed parameters, such as duration, outScale, or outOpacity, are passed directly on the slot object, and fall back to the children render function form only when you need to wrap or replace the rendered element. Use the standalone Motion component directly when you are building a custom composite (for example a custom overlay or disclosure) that has no motion slot of its own and you need enter and exit animations tied to a visible boolean plus a direction value. Use the imperative handle or the lifecycle callbacks when a triggering flow must observe animation progress rather than remounting the element. Do not reach for Motion to build page-level transitions, scroll-linked effects, or continuous ambient animation, and do not use it to re-implement show and hide logic that Dialog, Drawer, Accordion, Tree, or Menu already own. If your only goal is to remove animation, the DisableMotion pattern shows that you can neutralize motion on these components instead of rebuilding them.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `appear` | `boolean` | — | No | — |
| `children` | `JSXElement` | — | Yes | — |
| `children` | `JSXElement` | — | Yes | — |
| `direction` | `PresenceDirection` | — | Yes | — |
| `direction` | `PresenceDirection` | — | Yes | — |
| `direction` | `PresenceDirection` | — | Yes | — |
| `imperativeRef` | `React_2.Ref<MotionImperativeRef \| undefined>` | — | No | — |
| `imperativeRef` | `React_2.Ref<MotionImperativeRef \| undefined>` | — | No | — |
| `onMotionCancel` | `(ev: null) => void` | — | No | — |
| `onMotionFinish` | `(ev: null) => void` | — | No | — |
| `onMotionStart` | `(ev: null) => void` | — | No | — |
| `replayKey` | `string \| number` | — | No | — |
| `unmountOnExit` | `boolean` | — | No | — |
| `visible` | `boolean` | — | No | — |

### Prop Guidance

- **children**: Required. The single element Motion animates. When you configure a component's motion slot with a children render function, that function hands you a Motion component and the props it expects; return the Motion element with those props and add your own parameters on top. Never pass nothing, and never substitute a different element for the one the slot expects. `the element returned from a motion slot's children render function, with the provided props spread onto Motion`
- **imperativeRef**: Accepts a React ref that receives a MotionImperativeRef, giving you imperative control and inspection of the running animation from event handlers or effects. Prefer this over remounting the element when an external flow must start, cancel, or observe playback, and keep the ref stable across renders. `a ref created once with React.useRef and read inside a click handler`
- **onMotionStart**: Fires when the animation begins. Use it for non-critical side work such as analytics or logging; do not use it to coordinate application state that must be correct when animation is disabled. The callback receives a null event rather than a DOM event. `logging that a dialog surface started animating open`
- **onMotionFinish**: Fires when the animation completes normally. Use it only for optional clean-up such as returning focus or reporting timing. Do not depend on it to unmount content or to persist critical state, because it does not run if the element is removed early or if motion is disabled. `returning focus to the trigger after an exit motion completes`
- **onMotionCancel**: Fires when a running animation is interrupted, for example because visible changed again mid-flight or the element was removed. Use it to reconcile optimistic state, not as the primary completion path. Like the other callbacks, it receives a null event. `resetting a pending flag when an exit motion is interrupted by a reopen`
- **replayKey**: A string or number that restarts the attached animation whenever its value changes. Use it for one-shot or repeated attention animations on an element that stays mounted, instead of forcing a remount with a changing React key. `incrementing a counter each time a validation animation should replay`
- **appear**: Controls whether the animation also plays on the initial mount. Mount animation is opt-in, so set this when the first render should animate in; leaving it unset renders the element in place without animating, which is the right choice for content that is present on first paint. `true for a surface that animates in when the page first renders it`
- **direction**: Required for presence-driven usage. It is a PresenceDirection that tells Motion whether the current transition is an entrance or an exit, and therefore which parameter set (for example an in-scale versus an out-scale) is used. Change it together with visible so the correct transition runs. `enter on open and exit on close`
- **visible**: The presence flag for the animated element. Toggling it drives the enter or exit transition in combination with direction, and the owning component decides when the element is finally removed. Keep it in sync with the state that actually controls whether the element should exist. `true while a dialog surface is open, false once the user dismisses it`
- **unmountOnExit**: Removes the element from the DOM once the exit motion has finished instead of leaving it mounted. Enable it for presence-driven surfaces so dismissed content leaves the accessibility tree and the focus order, especially when the exiting element contains anything focusable. `true on a dialog surface that should disappear from the document after closing`

## Examples

### CustomMotion

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';
import description from './CustomMotion.stories.md';

export const CustomMotion = (): JSXElement => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <DialogExample />
      <DrawerExample />
    </div>
  );
};

CustomMotion.storyName = 'Custom motion';
CustomMotion.parameters = {
  docs: {
    description: {
      story: description,
    },
  },
};
```

### DirectParams

When a component's motion slot type includes generic parameters, those parameters
can be passed directly as props on the slot object — no `children` render function needed.
Dialog's `surfaceMotion` slot is typed with `ScaleParams`; Accordion's and Tree's
`collapseMotion` slots are typed with `CollapseParams`. Each exposes its own set of
direct props — all following the same pattern as any regular Fluent UI slot
(`badge=&#123;&#123; status: 'available' &#125;&#125;`).

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';

export const DirectParams = (): JSXElement => {
  const classes = useStyles();

  const [duration, setDuration] = React.useState(600);
  const [outScale, setOutScale] = React.useState(0.5);

  return (
    <div className={classes.wrapper}>
      <div className={classes.controls}>
        <Field label={`Duration: ${duration}ms (shared)`}>
          <Slider min={100} max={2000} step={50} value={duration} onChange={(_, data) => setDuration(data.value)} />
        </Field>
        <Field label={`Dialog outScale: ${outScale.toFixed(2)}`}>
          <Slider min={0} max={1} step={0.05} value={outScale} onChange={(_, data) => setOutScale(data.value)} />
        </Field>
      </div>

      <div className={classes.section}>
        <Text weight="semibold">
          Dialog (<code>surfaceMotion</code>)
        </Text>
        <div className={classes.row}>
          <div className={classes.column}>
            <Text size={200}>Direct params (concise)</Text>
            <Dialog
              surfaceMotion={{
                duration,
                outScale,
              }}
            >
              <DialogTrigger disableButtonEnhancement>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogSurface>
                <DialogBody>
                  <DialogTitle>Direct param override</DialogTitle>
                  <DialogContent>
                    The <code>duration</code> and <code>outScale</code> props are passed directly on the{' '}
                    <code>surfaceMotion</code> slot object.
                  </DialogContent>
                  <DialogActions>
                    <DialogTrigger disableButtonEnhancement>
                      <Button appearance="secondary">Close</Button>
                    </DialogTrigger>
                  </DialogActions>
                </DialogBody>
              </DialogSurface>
            </Dialog>
            <div className={classes.codeBlock}>
              {`<Dialog
  surfaceMotion={{
    duration: ${duration},
    outScale: ${outScale.toFixed(2)},
  }}
>`}
            </div>
          </div>

          <div className={classes.column}>
            <Text size={200}>Children render function (verbose)</Text>
            <Dialog
              surfaceMotion={{
                children: (Motion, props) => (
                  <Motion {...props} duration={duration} outScale={outScale}>
                    {props.children}
                  </Motion>
                ),
              }}
            >
              <DialogTrigger disableButtonEnhancement>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogSurface>
                <DialogBody>
                  <DialogTitle>Render function override</DialogTitle>
                  <DialogContent>
                    The same override using a <code>children</code> render function — functionally identical but more
                    verbose.
                  </DialogContent>
                  <DialogActions>
                    <DialogTrigger disableButtonEnhancement>
                      <Button appearance="secondary">Close</Button>
                    </DialogTrigger>
                  </DialogActions>
                </DialogBody>
              </DialogSurface>
            </Dialog>
            <div className={classes.codeBlock}>
              {`<Dialog
  surfaceMotion={{
    children: (Motion, props) => (
      <Motion
        {...props}
        duration={${duration}}
        outScale={${outScale.toFixed(2)}}
      >
        {props.children}
      </Motion>
    ),
  }}
>`}
            </div>
          </div>
        </div>
      </div>

      <div className={classes.section}>
        <Text weight="semibold">
          Accordion (<code>collapseMotion</code>)
        </Text>
        <Text size={200}>Same pattern — different param shape:</Text>
        <div className={classes.accordionContainer}>
          <Accordion collapsible>
            <AccordionItem value="1">
              <AccordionHeader>Panel A — tweaks via direct params</AccordionHeader>
              <AccordionPanel collapseMotion={{ duration }}>
                <div className={classes.constrainedText}>
                  <Text>
                    Expand/collapse timing controlled by <code>duration</code>
                  </Text>
                </div>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem value="2">
              <AccordionHeader>Panel B</AccordionHeader>
              <AccordionPanel collapseMotion={{ duration }}>
                <Text>Panel B content — shares the same motion params.</Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </div>
        <div className={classes.codeBlock}>
          {`<AccordionPanel
  collapseMotion={{
    duration: ${duration},
  }}
>`}
        </div>
      </div>

      <div className={classes.section}>
        <Text weight="semibold">
          Tree (<code>collapseMotion</code>)
        </Text>
        <Text size={200}>Same pattern, applied at subtree level:</Text>
        <div className={classes.accordionContainer}>
          <Tree aria-label="Direct params demo">
            <TreeItem itemType="branch">
              <TreeItemLayout>Team A</TreeItemLayout>
              <Tree collapseMotion={{ duration }}>
                <TreeItem itemType="leaf">
                  <TreeItemLayout>Alice</TreeItemLayout>
                </TreeItem>
                <TreeItem itemType="leaf">
                  <TreeItemLayout>Bob</TreeItemLayout>
                </TreeItem>
              </Tree>
            </TreeItem>
            <TreeItem itemType="branch">
              <TreeItemLayout>Team B</TreeItemLayout>
              <Tree collapseMotion={{ duration }}>
                <TreeItem itemType="leaf">
                  <TreeItemLayout>Carol</TreeItemLayout>
                </TreeItem>
                <TreeItem itemType="leaf">
                  <TreeItemLayout>Dan</TreeItemLayout>
                </TreeItem>
              </Tree>
            </TreeItem>
          </Tree>
        </div>
        <div className={classes.codeBlock}>
          {`<Tree
  collapseMotion={{
    duration: ${duration},
  }}
>`}
        </div>
      </div>
    </div>
  );
};

DirectParams.storyName = 'Direct params';
DirectParams.parameters = {
  layout: 'padded',
  docs: {
    description: {
      story:
        'Motion slot parameters can be passed directly as props on the slot object, ' +
        'without using the `children` render function. This works when the component ' +
        'declares its motion slot with typed parameters ' +
        '(e.g. `Slot<PresenceMotionSlotProps<ScaleParams>>`). ' +
        'The sections below show the same pattern applied across three param shapes — ' +
        "Dialog's `ScaleParams`, Accordion's and Tree's `CollapseParams` — all driven by " +
        'one shared set of controls.',
    },
  },
};
```

### DisableMotion

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';
import description from './DisableMotion.stories.md';

export const DisableMotion = (): JSXElement => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <DialogExample />
      <DrawerExample />
    </div>
  );
};

DisableMotion.storyName = 'Disable motion';
DisableMotion.parameters = {
  docs: {
    description: {
      story: description,
    },
  },
};
```

## Best Practices

### Do's

- When you supply a children render function to a motion slot, always spread the props the function provides onto the Motion element before layering your own parameter overrides, so the presence state (visible and direction) and any already-resolved parameters are preserved.
- Prefer the direct-parameter form when a slot is typed with parameters, as Dialog's surfaceMotion with ScaleParams and Accordion's and Tree's collapseMotion with CollapseParams are: passing duration directly on the slot is functionally identical to the render function form and is far easier to read.
- Set appear explicitly when you want the very first mount to animate, because a mount that is not marked with appear renders in place without animation.
- Change replayKey to replay a one-shot animation rather than remounting the animated element; remounting discards the DOM state and defeats the purpose of the motion component.
- Use imperativeRef when animation must be started, cancelled, or inspected from an event handler or effect, for example to synchronize a second element with the same timeline.
- Confine onMotionStart, onMotionFinish, and onMotionCancel to ancillary work such as analytics, focus placement, or logging; treat them as optional notifications rather than guaranteed lifecycle steps.
- Keep user-facing durations inside the theme's scale, roughly tokens.durationFast through tokens.durationSlow, so repeated open and close interactions stay responsive.
- Set unmountOnExit on presence-driven Motion usage so an element that has finished exiting is removed from the DOM, the accessibility tree, and the focus order.
- Verify your custom motion under a reduced-motion preference and confirm the content is fully usable and understandable when the animation is skipped entirely.
- Tune the same parameter object once and pass it to several slots (for example one shared duration across Dialog, Accordion, and Tree) so the product feels internally consistent.

### Don'ts

- Do not render Motion without children; the animated child element is required and is the only thing Motion actually affects.
- Do not ignore or selectively apply the props handed to a motion slot's children render function; dropping props.children, visible, or direction silently breaks entrance and exit behavior and makes the element snap into place.
- Do not use onMotionFinish as the mechanism that unmounts content, persists state, or restores focus, because it does not run if the element is removed early or if the animation is skipped.
- Do not hand-roll delays, long easings, or exaggerated scale values to make a surface memorable; overshooting motion slows down high-frequency flows and reads as instability.
- Do not keep an element permanently mounted after an exit motion with no unmountOnExit unless you also hide it from assistive technology and remove it from the focus order.
- Do not reimplement presence logic with timers around Motion when Dialog, Drawer, Accordion, or Tree already provide a motion slot for that piece of UI.
- Do not recreate motion parameter objects on every render for no reason, because a new parameter set can interrupt or retrigger an in-flight animation and produce a visible stutter.
- Do not use Motion as the sole signal of a state change such as expanded, open, or selected; the state must also be conveyed through semantics.
- Do not bypass a component's motion slot by replacing its surface wholesale with your own Motion wrapper, because you then lose the component's default parameters, focus handling, and portal behavior.

## Anti-Patterns

### Dropping the props a motion slot hands you

❌ In the children render function form, the slot provides both the Motion component and the props it needs, including the resolved presence state. If you render Motion without spreading those props, or forget to render the provided children, the element loses its visible and direction wiring and snaps in and out instead of animating.

✅ Spread the provided props onto the Motion element first and then add only the parameters you want to override, exactly as the Dialog surfaceMotion render function example does. If you only need different values, use the direct-parameter form on the slot instead.

### Treating motion callbacks as guaranteed lifecycle hooks

❌ onMotionFinish and onMotionCancel look like the natural place to unmount content, persist state, or restore focus, but they are skipped when the element is removed before the animation ends and when motion is disabled. Logic placed there can silently stop running.

✅ Keep essential state transitions in the owning component's own state and use the callbacks only for optional effects such as logging or focus restoration. Let the component that owns presence decide mounting, and let unmountOnExit handle DOM removal.

### Hand-rolling presence with timers instead of the motion slot

❌ Wrapping Dialog, Drawer, Accordion, or Tree in ad-hoc Motion usage with your own delays duplicates presence logic that the components already own, producing double animations, lost focus handling, and divergent timings between related surfaces.

✅ Configure the motion where the component expects it: surfaceMotion parameters on Dialog, the drawer surface motion, and collapseMotion on Accordion and Tree. Use standalone Motion only for custom composites that have no motion slot.

### Leaving dismissed content mounted and reachable

❌ Without unmountOnExit, an element whose exit motion has completed stays in the document. Screen readers still find it, Tab can still land inside it, and content that is visually gone can be interacted with.

✅ Enable unmountOnExit for presence-driven surfaces, or move focus out before the exit starts and hide the residual element from assistive technology. Prefer unmounting, since it also reduces DOM size.

### Over-animating high-frequency interactions

❌ Long durations, oversized scale or travel distances, and animations on every piece of incidental UI make repeated actions feel slow and unstable, and they amplify the user's wait whenever the whole workflow completes in a fraction of a second.

✅ Keep durations within the theme scale from tokens.durationFast to tokens.durationSlow, reserve the longest durations for rare, large surfaces, and set appear deliberately so first-paint content does not animate for no reason.

### Making animation the only signal of a state change

❌ A panel that only appears expanded because it animated open, or a surface that only reads as dismissed because it faded out, conveys nothing to users who skip motion or use a screen reader.

✅ Keep semantics authoritative: aria-expanded on expandable controls, dialog semantics and focus movement for overlays, and visible state changes that are correct the instant they happen. Motion should reinforce state, not define it.

## Accessibility

**Requirements**: Motion is presentational, so all semantics and compliance obligations belong to the element it animates. Follow WCAG 2.1 Success Criterion 2.3.3 (Animation from Interactions), which requires that motion triggered by interaction can be disabled unless it is essential; provide a path that removes or neutralizes animation, as the DisableMotion pattern does for Dialog and Drawer. Follow Success Criterion 2.2.2 (Pause, Stop, Hide) for anything that animates on its own. Respect the operating system reduced-motion preference and verify that content revealed by motion is still reachable and understandable when the animation is skipped or completed instantly. Exit animations must never delay a focus return or trap focus inside a surface that is logically gone, and content that remains mounted during an exit must not stay keyboard reachable or announced once it is logically dismissed.

| Key | Action |
| --- | --- |
| `Escape` | In presence-driven consumers of motion such as Dialog and Drawer, pressing Escape begins the exit motion; the surface stays mounted while direction is exit and is only removed once the motion completes or unmountOnExit finishes its work. |
| `Enter` | Activates the owning control, for example an Accordion header, which flips the panel's expand state and therefore starts the associated enter or exit motion. |
| `Space` | Behaves like Enter for the owning control and is the standard way to toggle an Accordion panel or press a Button inside a motion-wrapped surface. |
| `Arrow Right` | Expands a collapsed Tree branch, which starts the collapse motion on that subtree when the Tree has a collapseMotion slot. |
| `Arrow Left` | Collapses an expanded Tree branch and runs the corresponding exit motion on the subtree. |
| `Tab` | Moves focus through the animated content; Motion does not alter the child's tab order, but content kept mounted during an exit can still be reached, so move focus before the exit starts or use unmountOnExit. |

**ARIA**: aria-hidden — apply it at the application level when an exiting element is intentionally kept mounted, so assistive technology stops announcing content that is logically dismissed., aria-label and aria-labelledby — Motion renders the child unchanged, so accessible names such as a Tree's aria-label must remain on the animated element itself., aria-expanded — owned by controls such as Accordion headers and Tree branch items; the collapse motion is a visual accompaniment and must never be the only indicator of the expanded state., role — supplied by the animated child, never by Motion; Dialog and Drawer surfaces keep their dialog semantics while scaling, sliding, or fading., aria-live regions — if motion reveals status text, the insertion of that text triggers the announcement, so the timing of mounting matters more than the animation timing.

**Screen Reader**: Screen readers do not perceive animation as such; they perceive DOM presence, roles, names, and state. While an enter motion runs, the animated element is already in the DOM and can be announced and focused, which is why focus should be moved when the surface becomes visible and not when the animation finishes. While an exit motion runs, the element is still mounted unless it is removed at the end, so virtual buffers and focus can still encounter content that is visually gone; unmountOnExit, or explicitly hiding the element from assistive technology, prevents that. Because Motion adds no roles or attributes of its own, a state change that matters, such as a panel expanding or a dialog opening, must be conveyed by aria-expanded, dialog semantics, focus movement, or a live region, never by motion alone.

## Styling

Motion renders no styles of its own, so all visual treatment lives on the animated child and on the motion parameters you pass. Drive timing with theme duration tokens rather than raw numbers: tokens.durationUltraFast, tokens.durationFaster, tokens.durationFast, tokens.durationNormal, tokens.durationSlow, tokens.durationSlower, and tokens.durationUltraSlow cover the full Fluent scale. Pair those with curve tokens such as tokens.curveAccelerateMid, tokens.curveAccelerateMax, tokens.curveDecelerateMid, tokens.curveDecelerateMax, tokens.curveEasyEase, and tokens.curveLinear; entrances conventionally use a decelerate curve and exits an accelerate curve so the surface arrives quickly and leaves without lingering. For scale-style motion, animate transforms and opacity rather than width or height, and make sure the surface has its own background and elevation during the transition, for example tokens.colorNeutralBackground1 with tokens.shadow16, so a scaled dialog does not flash transparency. Collapse-style motion changes the panel's measured height, so give the panel a solid background such as tokens.colorNeutralBackground1 and a visible edge with tokens.colorNeutralStroke1 to keep the boundary crisp while it grows or shrinks. Because Motion contributes no class names, any classes you write belong on the child element, which also means you can style the child normally with Griffel and let the motion component handle only timing and presence.

## Performance

Motion animates through the browser animation engine and adds no wrapper elements or extra class names, so the main cost is whatever the animated element does. Prefer transform and opacity based motion, which the engine can composite, and reserve measured-height collapse motion for structures that genuinely need it. Keep the animated subtree small: scaling or fading a large dialog body is cheaper than animating a whole layout, and collapsing a Tree subtree with many rows is heavier than collapsing a short Accordion panel. Avoid constructing fresh parameter objects on every render, because a new parameter set can interrupt or restart an in-flight animation and cause visible jitter. Use replayKey to replay intentionally rather than remounting, use imperativeRef when control flow must be driven from handlers, and set unmountOnExit so exited content does not linger in the DOM, the accessibility tree, and the focus order. Finally, when animating in lists or trees, animate the container rather than each item so the total number of concurrent animations stays small.

## Theming & Tokens

Motion inherits its sense of timing from the Fluent UI theme rather than from hardcoded values, which is why component motion slots stay consistent across the suite. Duration tokens such as tokens.durationUltraFast, tokens.durationFaster, tokens.durationFast, tokens.durationNormal, tokens.durationSlow, tokens.durationSlower, and tokens.durationUltraSlow and curve tokens such as tokens.curveAccelerateMid, tokens.curveAccelerateMax, tokens.curveDecelerateMid, tokens.curveDecelerateMax, tokens.curveEasyEase, tokens.curveEasyEaseMax, and tokens.curveLinear are the values components pull in by default. When you pass parameters such as duration, outScale, or outOpacity to a motion slot or to Motion directly, reference those same tokens by name so that swapping the theme through a Provider, switching to a brand theme, or entering a high-contrast context keeps all animation in sync. Surfaces that animate also need theme-consistent visuals: tokens.colorNeutralBackground1 and tokens.shadow16 for a scaled dialog surface, tokens.colorNeutralStroke1 for a collapsing panel edge, and standard foreground tokens so text remains readable at every frame of the transition.

## Migration Notes

Motion is the v9 approach to animation and replaces the older class- and keyframe-based animation helpers used by previous Fluent generations, where entrance and exit were expressed as CSS classes toggled by mounting and unmounting. In v9 the animation runs through the browser animation engine and is exposed as a component with an explicit lifecycle: onMotionStart, onMotionFinish, and onMotionCancel report progress, imperativeRef hands you an imperative handle, replayKey restarts an animation declaratively, and direction plus visible and unmountOnExit model presence. If you are migrating custom show/hide wrappers, the biggest conceptual shift is that presence is a first-class value rather than a side effect of CSS classes, which lets the element stay mounted while it animates out. For components that already own motion, migration is usually a matter of moving configuration into the component's motion slot: Dialog exposes surfaceMotion typed with ScaleParams, while Accordion and Tree expose collapseMotion typed with CollapseParams, and those parameters can be given directly on the slot object instead of through a children render function. Where the old code disabled transitions globally, the DisableMotion pattern shown for Dialog and Drawer is the v9 equivalent.

## Edge Cases

- Mount animation is opt-in: with appear unset, content that is present on the initial render appears in place without animating, so a wrapper that expects a fade-in on first paint will appear to do nothing.
- The lifecycle callbacks receive a null event rather than a DOM event, and none of them is guaranteed to run if the element is removed before the animation completes or if motion is disabled, so clean-up logic cannot rely on them.
- Direct parameters on a motion slot only work when the component declares that slot with typed parameters, such as PresenceMotionSlotProps with ScaleParams or CollapseParams. Slots without typed parameters must still use the children render function form.
- During an exit animation the element remains in the DOM unless unmountOnExit is set, so a dismissed surface can still receive focus and be read by assistive technology until the transition ends.
- Changing replayKey while another animation is running restarts the animation from the beginning, which can look like a stutter if both are triggered by the same user action.
- Supplying a new parameter object on every render can interrupt an animation mid-flight; memoize parameter values or change them only in response to deliberate user input, as the shared duration and outScale sliders in the DirectParams example do.
- Disabling motion does not change which component owns presence: the element still mounts and unmounts on the same state transitions, only without the animated interval, so do not remove unmountOnExit when motion is turned off.
- A very short duration can make an exit look like a jump cut, and zero duration removes the transition entirely; both are acceptable for reduced-motion preferences but should be deliberate rather than accidental.

## See Also

- - [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
