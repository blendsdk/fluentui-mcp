# ContextSelector

> **Package**: `@fluentui/react-context-selector` v9.2.17
> **Import**: `import { ContextSelector } from '@fluentui/react-context-selector';`
> **Category**: utilities
> **Stability**: unstable

## Overview

ContextSelector is the selector type exported by @fluentui/react-context-selector, the Fluent UI React v9 utility package for subscribing to slices of a React context value. It models a plain function that receives the entire context value as its input and returns only the piece a consumer actually needs, expressed through its two generic type parameters, Value for the full context shape and SelectedValue for the derived slice. It is a type-level contract rather than a component that you render: it declares no props, owns no slots, produces no DOM node, and contributes no Griffel classes, so it never appears in the accessibility tree. Because a ContextSelector narrows what a subscriber depends on, the context-reading APIs in the same package can skip re-rendering a consumer when unrelated parts of the context change, which is why Fluent UI v9 relies on this pattern internally for large, frequently updated contexts such as theme, portal, and provider state.

**When to use**: Reach for ContextSelector when the context value you are consuming is large or changes frequently and a given consumer only cares about one or two fields, because selecting a narrow slice is what lets a subscription skip re-renders driven by unrelated updates. It is also the right choice when you are authoring a shared component or library layer on top of a Fluent UI context and want to expose a stable, typed way for consumers to read a subset of that context. Do not use it for small, rarely changing contexts: consuming the context value directly is simpler and easier to read when the whole object is genuinely needed. Do not use it as a substitute for ordinary props when a value flows to a single child, since prop drilling is more explicit and easier to trace. It is also not a state-management solution: it selects from a value that something else owns and updates, it does not create, store, or mutate state.

## Props Reference

_No documented props._

### Prop Guidance

- **Value (first generic type parameter)**: Represents the complete shape of the context value the selector receives. It must match the context the selector will be used with, exactly, or TypeScript will reject the assignment. Keep this type in sync with the provider that owns the value, and prefer importing a shared type rather than re-declaring the structure at each call site. `...`
- **SelectedValue (second generic type parameter)**: Represents the slice the selector returns, and it drives what the consumer depends on. Keep it primitive or a reference owned by the context value; annotate it explicitly whenever inference would widen it back to the full context type or produce an unintuitive union. `...`

## Best Practices

### Do's

- Define selector functions at module scope so their identity stays stable for the entire lifetime of the consuming component.
- When a selector must close over props or state, memoize it against the narrowest possible dependency list so its identity only changes when the values it captures change.
- Return primitives, or references that live inside the context value itself, such as booleans, strings, numbers, enums, or an existing object reference.
- Annotate the generic type parameters explicitly when inference is ambiguous or would widen the selected value back to the full context shape.
- Keep selectors pure and deterministic: the same context value must always produce the same selected value, with no side effects, no logging, and no state updates.
- Select the narrowest slice possible, ideally one field per selector, so unrelated context updates cannot cause the consumer to render again.
- When a consumer needs several fields, prefer several independent narrow selectors or a single selector that returns one stable composite object that the provider itself owns.
- Treat the selector as part of your public API when the context is exported: document exactly which slice it reads and how that slice is compared for changes.

### Don'ts

- Do not define the selector inline inside the component body without memoizing it, because a brand new function on every render defeats the identity check the context subscription relies on.
- Do not return a freshly constructed object, array, or function from the selector, because a new reference looks like a change on every single context update.
- Do not select the whole context value and destructure afterwards, since that gives you no benefit over consuming the context directly and re-renders the consumer on every update.
- Do not put expensive computation, formatting, or data transformation inside the selector, because it runs for every subscribed consumer on every context update.
- Do not use the selector to hide state that should be passed to your component as an explicit prop, since implicit context reads make components harder to test and reuse.
- Do not rely on the selector to perform side effects, trigger fetches, or write to state; selectors read and derive only.
- Do not assume a selector prevents a consumer from re-rendering for reasons unrelated to context, such as the consumer's own state changes or a parent re-rendering it with new element identity.

## Anti-Patterns

### Selector recreated on every render

❌ Declaring the selector inline in the component body creates a new function identity on each render. Any identity-based comparison the context subscription performs is invalidated, so the optimization is lost and the consumer can re-render more often than it would with a simple context read.

✅ Hoist the selector to module scope whenever it needs no captured values. If it must close over props or state, memoize it against the narrowest dependency list so its identity only changes when those captured values change.

### Selector that builds a new object

❌ Returning an object or array literal, or a function created inside the selector, produces a new reference on every invocation. The selected value compares as changed every time, so the consumer re-renders on every context update and the whole point of selecting is defeated.

✅ Select a single primitive per selector, or select a composite object that the provider creates once and stores in the context value so its reference stays stable. When a component needs three separate fields, use three narrow selectors rather than one selector that assembles a new object.

### Selecting the entire context value

❌ A selector that returns the whole context value behaves identically to consuming the context directly, but adds indirection that makes the code harder to follow. Every consumer still re-renders whenever any field of the context changes.

✅ Reduce the selector to the exact field the consumer renders with. If a consumer genuinely depends on most of the context, consuming the context directly is clearer than wrapping it in a selector that provides no benefit.

### Heavy work inside the selector

❌ Selectors run for every subscribed consumer on every context update, so sorting, formatting, filtering, or fetching inside one multiplies that cost by the number of consumers and can turn a context update into a visible frame drop.

✅ Keep selectors to cheap, pure reads and comparisons. Move expensive derivation into the provider that owns the data, or into a memoized computation in the consuming component that only runs when the selected slice actually changes.

### Using selector context as an application state store

❌ Treating the selector layer as a general-purpose state container pushes write logic, side effects, and ownership into a mechanism designed only for reading a derived slice, which produces tangled update flows and unpredictable re-render behavior.

✅ Keep ownership of the state in the provider, keep updates explicit, and let selectors do only one job: read a narrow, stable slice of the value the provider already owns.

## Accessibility

**Requirements**: ContextSelector is a type with no rendered output, so it carries no direct WCAG obligations: there is no focus target, no role, no visible label, and no keyboard interaction to provide. Accessibility work belongs entirely to the components you render using the selected value, and that is where WCAG requirements such as 4.1.2 Name, Role, Value and 2.4.3 Focus Order must be satisfied. The indirect accessibility concern is re-render churn: an unstable selector that causes a subscriber to re-render on every context update can reset focus or retrigger live-region announcements in the surface it renders, so stable selector identity is a practical accessibility safeguard as well as a performance one.

| Key | Action |
| --- | --- |
| `None` | ContextSelector is a type, not a rendered component, so it binds no keyboard behavior. All keyboard interaction belongs to the components a consumer renders from the selected value. |

**Screen Reader**: Screen readers never encounter ContextSelector itself, because it produces no DOM and therefore cannot be focused, labeled, or announced. Assistive technology only sees the elements a consumer renders from the selected value, so any aria attributes must be applied to those elements. Incorrect use is noticeable indirectly: if an unmemoized selector re-renders an announcing or focusable surface on every context update, screen reader users may hear repeated announcements or lose their place.

## Styling

There is nothing to style directly, because ContextSelector emits no elements and generates no Griffel classes. Styling starts with the components you render after selecting a value, and those should use theme tokens already resolved by the Fluent UI provider rather than hard-coded values, for example tokens.colorNeutralBackground1, tokens.colorNeutralForeground1, tokens.colorBrandBackground, tokens.colorNeutralStroke1, tokens.spacingHorizontalM, tokens.spacingVerticalS, tokens.borderRadiusMedium, and tokens.strokeWidthThin. A useful pattern is to keep the selector's return value style-agnostic, a boolean, enum, or id, and resolve the concrete token inside the component body, so a theme change only re-renders the components that genuinely consume that token. Never call mergeClasses, makeStyles, or any Griffel function from inside a selector; selectors run on every context update and must stay cheap and side-effect free.

## Performance

The gain from ContextSelector is avoided rendering, not avoided work: the selector function itself still runs on each context update for every subscribed consumer, so its cost is multiplied by the number of subscribers. Keep selectors constant time, allocation free, and free of closures that capture changing values. The value of a stable selector identity is that the subscription can compare cheaply and bail out early; an inline or freshly memoized selector makes that comparison useless. Selecting primitives also keeps the downstream comparison trivial, whereas returning new references forces a re-render and a full reconciliation of the subtree the consumer renders. Remember that selectors only help on the consumer side: if the provider passes a new value object on every render, all consumers are notified regardless, so stabilize the context value at the provider before optimizing consumers. Finally, only select what the component actually uses; a subscription whose selected value is never rendered in the output is pure overhead.

## Theming & Tokens

ContextSelector renders nothing, so it consumes no tokens and generates no Griffel styles itself. Its relevance to theming is structural: Fluent UI v9 delivers theme values through provider context, and selecting narrow slices of that context is the standard way to keep theme updates from re-rendering components that do not depend on the changed part of the theme. A theme switch produces a new theme object, so every selector runs at that moment; returning stable primitives, such as a boolean for a dark scheme or an enum for a density setting, means only the components that actually render differently will re-render. Resolve concrete values late, in the component body, using tokens such as tokens.colorNeutralBackground1, tokens.colorNeutralForeground1, tokens.colorBrandBackground, tokens.colorNeutralStroke1, tokens.spacingHorizontalM, tokens.spacingVerticalS, tokens.borderRadiusMedium, and tokens.strokeWidthThin, so that the selector stays theme agnostic and easy to test.

## Migration Notes

ContextSelector and the @fluentui/react-context-selector package it belongs to are v9-only exports and have no v8 counterpart. Code migrating from v8 typically consumed the entire context object through the built-in React context API and then destructured the field it needed, which re-rendered the consumer whenever any part of that object changed. Migrating means moving that logic into a narrowly scoped selector so the subscription only tracks the one field the component reads. If you are moving from the built-in context consumption pattern in earlier v9 code, the same rule applies: replace whole-value reads with a selector, keep the selector's identity stable, and return a primitive or an existing reference rather than a newly built object.

## Edge Cases

- A selector that returns undefined or null is indistinguishable from a value that was deliberately set to undefined or null unless the Value type makes that distinction explicit, so be deliberate about the SelectedValue type in those cases.
- Selectors do not fix identity churn at the provider: if the provider passes an inline object literal as its value, that value is new on every provider render, so every selector runs and changed slices still trigger re-renders.
- Selectors are tightly coupled to the shape of the context value. Restructuring the context later silently breaks or weakens every selector that reads a nested field, so selectors should be updated in the same change as the provider.
- Comparison of the selected value is reference based, so two structurally identical objects are treated as different and will cause re-renders even when nothing meaningful changed.
- Before a provider mounts, or in environments where no provider is present, the selector is evaluated against the context default value, so every selector must tolerate the default shape without throwing.
- TypeScript inference can widen the selected value back to the full context type or produce an unexpected union; annotating the generic type parameters explicitly keeps the contract clear at the call site.
- A component that subscribes but never renders the selected value still pays the subscription cost on every context update, which is easy to leave behind after a refactor removes the last usage of that field.

## See Also

- - [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
