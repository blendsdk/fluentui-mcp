# MotionComponentsPreview

> **Package**: `@fluentui/react-motion-components-preview` v0.15.5
> **Import**: `import { MotionComponentsPreview } from '@fluentui/react-motion-components-preview';`
> **Category**: utilities
> **Stability**: unstable

## Overview

MotionComponentsPreview is the umbrella entry point for the @fluentui/react-motion-components-preview package, a preview collection of declarative, presence-based motion components that ship alongside @fluentui/react-components. The family includes Blur, Collapse, Fade, Rotate, Scale and Slide, the Stagger orchestrator (with its Stagger.In and Stagger.Out forms), and pre-tuned variants such as CollapseDelayed, CollapseRelaxed, CollapseSnappy, FadeRelaxed, FadeSnappy, ScaleRelaxed, ScaleSnappy, SlideRelaxed and SlideSnappy. It is imported from '@fluentui/react-motion-components-preview' rather than from the stable component barrel. Every member of the family is a presence component: it wraps its children, observes a controlled visible prop, plays an enter animation when visibility turns on, and plays a matching exit animation before the content is hidden or unmounted, optionally notifying you through onMotionFinish. Stagger adds choreography on top of that model by distributing a shared animation across its direct children with a per-item offset expressed through itemDelay, an overall per-item animation length through itemDuration, and an ordering switch through reversed; delayMode and hideMode let Stagger adapt to children that either are themselves motion components or are plain DOM nodes. Common configuration is consistent across the family: enter and exit durations (duration and exitDuration, where exitDuration defaults to the enter duration), easing and exitEasing curves, opacity animation via animateOpacity, unmountOnExit, appear for animating on first render, and an imperative ref that supports setPlaybackRate for slowing animations down. Because the package is explicitly a preview, the API surface and defaults are expected to evolve while the design-system team validates the motion language with product teams.

**When to use**: Use these components when a Fluent UI surface needs a declarative enter/exit animation that is tied to presence instead of to ad-hoc state effects: revealing a Card or panel, collapsing an expandable region, cross-fading an overlay, sliding a set of cards into a grid, flipping a card between front and back, or animating a gallery item in and out of focus. Choose Stagger specifically when several siblings should animate as one choreographed sequence rather than all at once, such as list rows appearing one after another, avatars cascading in, spinner dots pulsing in order, or items inside a container that is itself expanding. Pick Stagger.In when the group should animate only on entrance (for example a replayable feed), and Stagger.Out when only the exit matters. Prefer the named variants (CollapseRelaxed, CollapseSnappy, FadeRelaxed, FadeSnappy, ScaleRelaxed, ScaleSnappy, SlideRelaxed, SlideSnappy, CollapseDelayed) when you want the established Fluent timing rather than hand-tuned numbers, and drop back to the base components with explicit duration, exitDuration, easing and exitEasing values when a design calls for something bespoke. Do not use these components for continuous ambient animation or for animating layout that must never be interrupted; a plain Griffel/CSS transition is a better fit there. Also keep in mind that this is a preview package, so it is appropriate for exploration and for teams that can absorb an evolving API, while production-critical surfaces may prefer to wait for the stable motion API or pin an exact preview version.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `React_2.ReactNode` | — | Yes | — |
| `delayMode` | `StaggerDelayMode` | — | No | — |
| `hideMode` | `StaggerHideMode` | — | No | — |
| `itemDelay` | `number` | — | No | — |
| `itemDuration` | `number` | — | No | — |
| `onMotionFinish` | `() => void` | — | No | — |
| `reversed` | `boolean` | — | No | — |
| `visible` | `PresenceComponentProps['visible']` | — | No | — |

### Prop Guidance

- **children**: Required. The content to animate; the component applies its transform, opacity, filter or size animation to the element it renders around these children, so the first child element is the one that gets styled. Insert a plain wrapper element when the child must keep full control of its own opacity or size, and when using Stagger, the direct children are the items whose delays are staggered. `A Card, a set of Avatar elements, or a row of plain divs that should appear one after another`
- **visible**: The controlled presence switch. Drive it from React state and flip it when you want the enter or exit animation to run; children animate in when it becomes true and animate out before being hidden or removed when it becomes false. Keep it a single source of truth and toggle it from an explicit user action such as a Button or Switch rather than from effects that fire repeatedly. `A boolean state initialized to true and flipped by a Switch labeled Visible`
- **itemDelay**: Milliseconds between the start of each staggered child's animation, and the primary way to shape the rhythm of a sequence. Small values (tens of milliseconds) read as a single cascading motion; larger values make each item feel individually placed. Set it to zero when a parent container is being dragged or resized and you want items to move together without a cascade. `100`
- **itemDuration**: The per-item animation length used by the stagger orchestration. Keep it proportional to itemDelay so consecutive items overlap enough to read as one motion rather than as isolated pops, and keep the total (itemDelay multiplied by the number of items plus itemDuration) inside the motion scale used elsewhere in the product. `The same order of magnitude as the per-item motion component's duration`
- **delayMode**: Selects how the stagger delay is applied. Use delayProp when children are themselves motion components so the delay is expressed through the child's own delay prop and timing stays browser-driven, which the examples describe as the best-performing option. Use timing when children are plain DOM nodes or a mix of content that needs JavaScript-managed timing. In most cases the component detects the right mode automatically and you only override it for mixed content. `delayProp`
- **hideMode**: Decides what happens to children when the group is hidden. visibleProp preserves mount and layout and relies on the children's own component-level animations; visibilityStyle keeps elements mounted and toggles CSS visibility so layout is preserved while the content leaves the accessibility tree; unmount really mounts and unmounts children so they participate in layout on enter and exit. Choose based on whether the surrounding layout should reflow and whether hidden content must become unreachable. `unmount`
- **reversed**: Reverses the order in which the staggered delays are distributed, so the sequence starts from the last child instead of the first. Use it to make an exit feel like a mirror of the entrance, and consider flipping it dynamically with the visibility value so items leave in the opposite order from the way they arrived. `true`
- **onMotionFinish**: Callback fired when the motion completes. Use it to sequence dependent steps, such as contracting a container only after staggered items have finished exiting, or to update state that should not change mid-animation. Keep the handler cheap and idempotent, because it is invoked as a completion signal rather than as a render-phase callback. `A handler that collapses the surrounding container after the last item has exited`

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Card, CardHeader, Field, makeStyles, tokens, Switch, Text } from '@fluentui/react-components';
import { Blur } from '@fluentui/react-motion-components-preview';

export const Default = (): JSXElement => {
  const classes = useClasses();
  const [visible, setVisible] = React.useState<boolean>(true);

  return (
    <div className={classes.container}>
      <div className={classes.controls}>
        <Field className={classes.field}>
          <Switch label="Visible" checked={visible} onChange={() => setVisible(v => !v)} />
        </Field>
      </div>

      <Blur visible={visible}>
        <Card className={classes.card}>
          <CardHeader
            header={
              <Text as="h3" className={classes.cardHeaderText} weight="semibold">
                Lorem Ipsum
              </Text>
            }
          />
          <LoremIpsum />
        </Card>
      </Blur>
    </div>
  );
};
```

### Default

```tsx
import { Card, CardHeader, Field, makeStyles, tokens, Switch, Text } from '@fluentui/react-components';
import { Collapse } from '@fluentui/react-motion-components-preview';
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  const classes = useClasses();
  const [visible, setVisible] = React.useState<boolean>(true);

  return (
    <div className={classes.container}>
      <div className={classes.controls}>
        <Field className={classes.field}>
          <Switch label="Visible" checked={visible} onChange={() => setVisible(v => !v)} />
        </Field>
      </div>

      <Collapse visible={visible}>
        <Card className={classes.card}>
          <CardHeader
            header={
              <Text as="h3" className={classes.cardHeaderText} weight="semibold">
                Lorem Ipsum
              </Text>
            }
          />
          {/* Wrapper div needed because Collapse controls maxHeight on its child to animate height */}
          <div className={classes.cardContent}>
            <LoremIpsum />
          </div>
        </Card>
      </Collapse>
    </div>
  );
};
```

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { Card, CardHeader, Field, makeStyles, tokens, Switch, Text } from '@fluentui/react-components';
import { Fade } from '@fluentui/react-motion-components-preview';

export const Default = (): JSXElement => {
  const classes = useClasses();
  const [visible, setVisible] = React.useState<boolean>(true);

  return (
    <div className={classes.container}>
      <div className={classes.controls}>
        <Field className={classes.field}>
          <Switch label="Visible" checked={visible} onChange={() => setVisible(v => !v)} />
        </Field>
      </div>

      <Fade visible={visible}>
        <Card className={classes.card}>
          <CardHeader
            header={
              <Text as="h3" className={classes.cardHeaderText} weight="semibold">
                Lorem Ipsum
              </Text>
            }
          />
          <LoremIpsum />
        </Card>
      </Fade>
    </div>
  );
};
```

## Best Practices

### Do's

- Drive every presence component from a single boolean state value and pass that same value to the visible prop, so enter and exit animations stay symmetric and predictable.
- Use onMotionFinish when a follow-up step must wait for the animation to complete, such as contracting a container only after its staggered children have finished exiting.
- Nest a per-item motion component (Slide, Scale, Fade, Blur, Rotate or Collapse) inside Stagger when you want both choreography and a specific effect, and let Stagger own only the timing distribution.
- Rely on Stagger's automatic detection first; set delayMode explicitly to delayProp when the children are motion components so the browser drives the timing, and to timing when the children are plain DOM or mixed content that needs JavaScript-managed timing.
- Choose hideMode deliberately: visibleProp preserves mount and layout through component-level animation, visibilityStyle keeps elements mounted while toggling CSS visibility to preserve layout, and unmount actually mounts and unmounts children so they participate in layout on enter and exit.
- Add a wrapper element inside Collapse or Slide when the child would otherwise be reflowed or have its own opacity overridden, since the motion component controls size or opacity on its immediate child.
- Pass motionTokens values such as motionTokens.durationFast, motionTokens.durationUltraSlow, motionTokens.curveEasyEase or motionTokens.curveDecelerateMin into duration, exitDuration, easing and exitEasing instead of hard-coding magic numbers.
- Replay an entrance animation by changing a React key on Stagger.In or Stagger.Out so the subtree remounts and the sequence runs again from the beginning.

### Don'ts

- Don't animate the same property twice, for example wrapping content that already animates its own opacity inside a component that also animates opacity; the effects compound and the content can flicker or disappear.
- Don't expect Stagger to animate plain divs through component-level presence; plain or mixed children need the timing or visibilityStyle/unmount paths, and skipping them leaves items snapping in and out.
- Don't leave exiting content permanently mounted in a way that keeps it in the accessibility tree or in the tab order; use unmountOnExit or the unmount hide mode when the content is genuinely gone.
- Don't chain timed steps with setTimeout or ad-hoc delays when a coordination prop or onMotionFinish already expresses the ordering, because manual timers drift from the real animation duration.
- Don't apply your custom Griffel classes to the wrong node; styling the inner element that the motion component already controls (maxHeight on a Collapse child, transform or opacity on a Slide child) fights the animation.
- Don't crank itemDelay or duration to values far outside the motion scale for ordinary UI; long, staggered entrances delay task completion and feel unresponsive.
- Don't substitute these preview components for ordinary hover, focus or press feedback, which belongs to the component's own interaction styling.
- Don't wire a visible toggle to a control that is itself inside the animated subtree in a way that lets it be unmounted before the exit finishes; the user loses the control mid-animation.

## Anti-Patterns

### Animating a property the child already animates

❌ Stacking a motion component around content that sets its own opacity, height or transform makes the two animations compete; the visible example of this is a per-item motion component whose opacity animation washes out content that already fades itself by index.

✅ Insert a neutral wrapper element between the motion component and the styled content, as the examples do with an outer div that protects the inner div from the slide's opacity animation, and move your own visual styling to the inner element.

### Assuming Stagger handles plain children automatically

❌ Plain divs or mixed content have no component-level presence to hook into, so relying on the default detection can leave items snapping into place with no choreography, or animating through a JavaScript timing path you did not intend.

✅ Be explicit for non-component children: pass delayMode timing for JavaScript-managed timing and hideMode visibilityStyle or unmount depending on whether the layout should be preserved or reflowed, as demonstrated in the delay mode and hide mode comparisons.

### Sequencing steps with manual timers

❌ Wrapping a container collapse or a follow-up action in a setTimeout guess desynchronizes from the real animation and creates flicker or premature layout jumps whenever durations change.

✅ Express the ordering with the component's own coordination surface: onMotionFinish for completion callbacks, per-item delay props to wait for a container to expand, and exit delay on the container so it contracts only after staggered items have left.

### Leaving exited content reachable

❌ Keeping fully hidden content mounted without a visibility or unmount strategy can leave it in the tab order or in the accessibility tree, so keyboard and screen reader users encounter elements that sighted users cannot see.

✅ Pick the hide mode that matches the intent: unmount when the content is truly gone, visibilityStyle when layout must be preserved but the content should leave the accessibility tree, and visibleProp only when the child component itself guarantees the correct hidden state.

### Styling the animated node directly

❌ Applying your own size, opacity or transform classes to the immediate child of a motion component fights the inline values the component writes, producing jumpy starts and endings.

✅ Style an outer wrapper for layout and spacing, and let the motion component own the animated properties on its immediate child, which is exactly why the Collapse and Slide examples add dedicated wrapper divs.

## Accessibility

**Requirements**: These components are purely presentational wrappers: they add no roles, names, focus management or live-region semantics, so all WCAG obligations still belong to the animated content. Preserve a visible focus indicator on interactive children while they animate, keep text and meaningful graphics above the 4.5:1 / 3:1 contrast thresholds in every intermediate frame (opacity and blur animations can transiently reduce effective contrast), and respect the user's reduced-motion preference by falling back to instant visibility changes or by shortening duration and using the playback-rate mechanism sparingly. Because elements hidden with visibilityMode visibilityStyle are removed from the accessibility tree while opacity-only hiding is not, decide deliberately whether exiting content should still be reachable by a screen reader or keyboard user. Any control used to trigger visibility changes, such as the Switch in the default examples, must keep its accessible label and should not be reachable while its target is unmounted.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into and out of the animated content; the motion wrappers themselves are not focusable, so focus order follows the interactive children such as the visibility Switch or the Buttons used to trigger animations. |
| `Shift+Tab` | Moves focus backwards through the animated region in the same order as the children render; Stagger's reversed prop changes visual order only and must not be relied on to change focus order. |
| `Enter` | Activates a child button or link that toggles the visible prop; the resulting enter or exit animation must not move focus or block the activation. |
| `Space` | Activates the child control, such as a Switch or Button, that toggles visibility, exactly as it would without the motion wrapper. |
| `Escape` | Not handled by the motion components; if a slide-in or fade-in surface is dismissible, Escape handling and focus return must be implemented by the owning component or dialog. |
| `Arrow keys` | Not handled by the motion components; arrow-key navigation belongs to any composite child such as the Slider or RadioGroup used in the demonstration controls. |

**ARIA**: aria-label, aria-pressed, aria-valuetext

**Screen Reader**: Screen readers see only the rendered children of these components, never the motion mechanics, so the motion wrapper adds nothing to the accessibility tree and provides no announcements. Content that mounts later (for example children brought in by a Stagger animation or by the unmount hide mode) is announced only according to the semantics of that content; if items appear as a result of a user action, mirror that action in visible text or an appropriate live region rather than assuming the animation communicates it. Hiding is the risky part: visibilityStyle removes the element from the accessibility tree while it stays mounted, opacity-based exits leave the text technically readable to assistive technology, and unmount removes the node entirely, so pick the mode that matches what a sighted user perceives. Purely decorative animated content should be marked aria-hidden by the consumer.

## Styling

The motion components own transform, opacity, filter, clip and size properties on the element they wrap, so apply your own layout classes to a stable outer wrapper and let the motion component style the child it controls, exactly as the Collapse examples do with a dedicated content div (Collapse animates maxHeight on its child) and as the Slide examples do by adding an outer div to protect the inner content from the opacity animation. Use makeStyles to author those wrappers, and mergeClasses to combine your layout class with a spacing class. Real Griffel tokens worth using in the surrounding chrome include tokens.spacingHorizontalS and tokens.spacingVerticalS for gaps between staggered items, tokens.spacingHorizontalM for gallery gutters, tokens.colorNeutralForeground3 for secondary text inside animated cards, tokens.colorNeutralBackground1 for the surfaces behind blur effects, and tokens.colorNeutralShadowAmbient for elevation that should remain crisp while content fades. Give Blur children with a defined border radius or clip so the blur radius (outRadius and inRadius) does not bleed past rounded corners, and avoid painting heavy gradients behind stacking blur layers, since two nested Blur wrappers composite and cost fill rate. When the child is a Card or a surface with its own background, verify that the animated opacity does not reveal whatever sits behind it in an unexpected way.

## Performance

Motion here is driven by animating transform, opacity, filter and size on a wrapped element, so cost scales with the number of simultaneously animating nodes and with the paint area of effects such as blur, which is far more expensive than a transform. Prefer delayMode delayProp for children that are motion components so timing is handled by the browser rather than by JavaScript bookkeeping, and reserve the timing path for plain or mixed content that genuinely needs it. Use unmountOnExit or the unmount hide mode to keep the DOM small when items are not visible, and avoid leaving long staggered sequences mounted indefinitely in scrollable lists. Keep itemDelay and itemDuration modest: total sequence length grows as itemDelay multiplied by item count, and a long cascade keeps the main thread and the compositor busy while users are trying to interact. When several layers of blur are stacked, as in a reveal effect over a background plus an overlay, expect compounding fill-rate cost and consider disabling the opacity animation (animateOpacity false) on one of the layers. The playback-rate control exposed through the imperative ref is a demonstration aid for slowing animation down; leaving a reduced playback rate in production stretches every animation proportionally.

## Theming & Tokens

Timing and easing come from the Fluent motion module rather than from the color or typography tokens. The examples pass motionTokens values directly, including motionTokens.durationUltraFast for the shortest beats, motionTokens.durationFaster and motionTokens.durationFast for stagger offsets, motionTokens.durationUltraSlow for deliberate card transitions, and motionTokens.curveEasyEase, motionTokens.curveDecelerateMin, motionTokens.curveDecelerateMax and motionTokens.curveAccelerateMid for enter and exit curves. The named variants encode a house style on top of those primitives: the Relaxed, Snappy and Delayed components exist precisely so you do not have to re-derive the timings, and choosing between them is a theming decision about the tone of the product's motion. Surface-level theming of the animated content still uses the regular Griffel tokens, for example tokens.colorNeutralForeground3 for secondary text inside animated cards, tokens.colorNeutralForeground1 for primary text, tokens.colorNeutralBackground1 for surfaces that sit behind blur layers, and tokens.spacingHorizontalS, tokens.spacingVerticalS and tokens.spacingHorizontalM for gaps inside staggered lists. Because durations are token-driven, brand or density theming that alters motionTokens automatically propagates to every component here, so avoid hard-coded millisecond values except where a specific effect genuinely requires a bespoke rhythm.

## Migration Notes

This is a preview package, imported from '@fluentui/react-motion-components-preview' instead of the stable '@fluentui/react-components' barrel, and it is marked as not deprecated so it can be adopted today alongside stable Fluent UI React v9 components. Treat the API as provisional: because it is published as a preview, prop names, defaults and the set of offered variants may change between releases, so pin an exact version and re-run visual tests when upgrading. If you are moving hand-rolled CSS keyframe animations onto this API, the mental model shifts from imperative class toggling to a single controlled visible prop plus optional onMotionFinish coordination, and from bespoke timings to motionTokens durations and curves. Code written against the base components (Blur, Collapse, Fade, Rotate, Scale, Slide, Stagger) can generally move to the named Relaxed, Snappy and Delayed variants by swapping the component rather than by rewriting timing props.

## Edge Cases

- Collapse animates maxHeight on its immediate child, so a Card placed directly inside it can reflow its own text during the transition; add an inner wrapper div so the content is clipped rather than re-laid-out.
- Exit duration defaults to the enter duration when only duration is supplied, so an animation that feels right going in may linger noticeably coming out unless exitDuration is set separately.
- Replaying an entrance sequence requires remounting the subtree, which the examples achieve by changing a React key on the stagger-in or stagger-out wrapper; toggling visible alone will not restart an entrance-only animation.
- Stagger's reversed ordering is a delay order only and does not reorder the DOM, so visual and focus order can diverge when the two are mixed.
- Mixed children (some motion components, some plain elements) are ambiguous for automatic detection, so delay mode or hide mode must be chosen explicitly, and plain children will not animate unless the selected mode supports them.
- When a parent container is expanding, staggered items need their own delay so they appear after the container has grown; without it the items animate while the container is still resizing and the motion looks cramped.
- Stagger delays should be suppressed to zero while the user is actively dragging a control that changes the item count, otherwise every drag tick queues a new cascade.
- Opacity-based exits leave text technically readable to assistive technology even though it looks gone, whereas visibility and unmount modes remove it, so the a11y consequence differs per hide mode.

## See Also

- - [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
