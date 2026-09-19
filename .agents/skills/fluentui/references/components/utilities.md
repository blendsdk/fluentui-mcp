# Utilities

> **Package**: `@fluentui/react-utilities` v9.26.4
> **Import**: `import { Utilities } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

Utilities is the non-visual helper surface of @fluentui/react-components. Unlike the visual components in the library (Button, Dialog, Menu, and so on), it is grouped under the "utilities" category and is imported from the package root as a single binding alongside those components. The data for this entry exposes no props, no slots, no Storybook stories, no related components, and no additional exports, which confirms that it is not a renderable element: there is no visual output, no DOM structure, and no component lifecycle to manage. It is not deprecated. In practice you treat Utilities as the shared toolbox that the visual components are built on and that application code can reuse for cross-cutting concerns, rather than as something you place into the component tree.

**When to use**: Use the Utilities surface when you need capability that is shared by many Fluent UI components rather than a piece of UI: cross-cutting helpers that multiple components rely on, shared logic that keeps your application code consistent with the library's own internals, and package-root imports that avoid pulling in deep or unstable paths. Do not reach for Utilities when you actually need something that renders — if you need a control, a layout primitive, or a themed surface, choose the corresponding visual component (Button, Dialog, Menu, Card, and so on) instead. Also prefer Utilities over writing your own one-off versions of behavior the library already ships, because duplicated helper logic drifts from the design system and from theme updates. If your requirement is purely presentational (a colored box, a hover style), a component plus Griffel styling is the right answer, not a utility.

## Props Reference

_No documented props._

## Best Practices

### Do's

- Import from the package root exactly as declared in the component data — the Utilities binding from @fluentui/react-components — so your imports stay stable across minor releases.
- Treat Utilities as a non-rendering helper surface: consume its members inside your own modules rather than placing the binding into the component tree.
- Reuse the library's shared helpers instead of hand-rolling equivalent logic, so your code behaves the same way the library components do.
- Keep the @fluentui/react-components package version consistent across your app so the Utilities surface and the visual components stay in lockstep.
- Add a static type check (TypeScript) in your app to catch usage mistakes early, since Utilities offers no runtime rendering to validate against.
- Document internally which Utilities members your team relies on, so upgrades and audits can be scoped quickly.

### Don'ts

- Don't try to render the Utilities binding as a component — it exposes no props and no slots, so there is nothing to render.
- Don't pass appearance, size, className, or any other component-level prop to it; the data lists no props for this entry.
- Don't look for a Storybook story or a visual playground for Utilities, because the data contains no stories; rely on the documentation of the individual exported helpers instead.
- Don't import from deep internal package paths to reach the same behavior; deep paths are not part of the documented surface and can change without notice.
- Don't duplicate helper logic locally "just to be safe"; duplicated behavior diverges from the library and creates inconsistent output across your app.
- Don't assume Utilities participates in recipes or has related components — the data lists none, so composition guidance must come from the visual component you are actually building.

## Anti-Patterns

### Rendering Utilities as a component

❌ The entry has no props, no slots, and no stories, so placing the binding into the component tree produces nothing and silently hides the fact that no real UI was authored.

✅ Use the Utilities surface only inside your own modules as a helper import, and render an actual visual component (Button, Dialog, Menu, Card, and so on) wherever UI is required.

### Passing component-style props to Utilities

❌ Callers sometimes assume appearance, size, className, or similar component props exist because Utilities is imported from the same package root; the data lists no props, so those values have no effect and create misleading code.

✅ Keep styling and configuration on the visual component that actually renders, and pass only the arguments that a specific exported helper documents.

### Searching for a Storybook story or visual playground

❌ The data records zero stories, so hunting for an interactive demo of Utilities wastes time and may lead developers to invent a playground that documents behavior the library does not guarantee.

✅ Consult the guidance for the individual helper you need and validate behavior through your own unit tests and type checking instead of a component story.

### Reimplementing shared helpers locally

❌ Copying helper logic into application code creates a second source of truth that drifts when the library or theme changes, producing inconsistent styling and behavior across a product.

✅ Consume the shared helper exports from the package root and centralize any internal wrappers in one module so upgrades touch a single place.

### Reaching into deep package internals

❌ Importing the same functionality from internal paths bypasses the documented package-root surface and couples your app to files that can move or change between releases.

✅ Import from the declared package-root entry for @fluentui/react-components and keep a type check in CI to catch accidental deep imports.

## Accessibility

**Requirements**: Because Utilities renders nothing, it introduces no DOM, no focusable elements, and no ARIA semantics of its own; it therefore cannot violate or satisfy WCAG on its own. Accessibility obligations remain entirely with the visual components and authored markup around it. Ensure that anything you build using shared helpers still meets contrast requirements against theme tokens, still exposes correct roles and names, and still honors reduced-motion and focus-visibility expectations.

**Screen Reader**: Screen readers never encounter Utilities, since it produces no output in the accessibility tree. Any assistive-technology behavior in your app comes from the visual components you render and from the ARIA attributes you author on them. This also means Utilities cannot be used to fix a missing accessible name, role, or focus target — those must be addressed on the rendering component itself.

## Styling

Utilities does not own a style surface, so there are no slots to target with className or style. The practical styling guidance is to keep your styled components aligned with the Fluent theme tokens that the library itself uses, such as tokens.colorNeutralBackground1 for surfaces, tokens.colorNeutralForeground1 for body text, tokens.colorBrandBackground for emphasized actions, tokens.borderRadiusMedium for control corners, tokens.spacingHorizontalS and tokens.spacingVerticalM for spacing rhythm, and tokens.fontFamilyBase with tokens.fontSizeBase300 for type. Because theme tokens are resolved at render time, styles built on tokens.* follow light, dark, and high-contrast themes automatically. If a helper participates in building styles, always compose it with those theme tokens rather than with hard-coded colors, pixel values, or fonts.

## Performance

Utilities has no render cost: it contributes no DOM nodes, no re-renders, and no effects, so it cannot cause layout thrash or reconciliation work. The performance considerations are therefore build-time and call-site oriented. Import from the package root so bundlers can tree-shake the helpers you do not use, prefer named imports over wildcard imports, and avoid calling helpers in a render path in a way that allocates a brand-new object on every render — hoist stable results or memoize them when the inputs are unchanged. Keep helper usage out of hot loops where possible, since small per-call costs multiply across large lists.

## Theming & Tokens

Utilities carries no styles, so it does not directly consume theme tokens. It inherits its meaning from the theme context provided by the Provider component, and any helper you use that produces style values should express those values through Fluent tokens so light, dark, and high-contrast themes resolve correctly. Representative tokens to rely on include tokens.colorNeutralBackground1 and tokens.colorNeutralForeground1 for base surfaces and text, tokens.colorNeutralForeground2 for secondary text, tokens.colorBrandBackground and tokens.colorBrandForeground1 for emphasis, tokens.borderRadiusMedium and tokens.borderRadiusLarge for shape, tokens.spacingHorizontalS, tokens.spacingHorizontalM, and tokens.spacingVerticalM for rhythm, plus tokens.fontFamilyBase, tokens.fontSizeBase300, and tokens.fontWeightSemibold for type. Nesting Provider overrides these token values for everything rendered inside it.

## Migration Notes

There is no per-component migration path for Utilities because it exposes no props, slots, or stories to map. Treat it as a package-level export group: when moving from earlier Fluent UI versions, verify that your imports resolve from the @fluentui/react-components package root (as declared in the component data) rather than from older or deep paths, and re-run a build with type checking to catch lingering references. Since Utilities is not marked deprecated, no deprecation shim is required for this entry itself; deprecation work belongs to the individual visual components you consume alongside it.

## Edge Cases

- The data lists no props and no slots, so any code that attempts to pass appearance, className, or children to Utilities is a no-op rather than an error — failures appear as missing UI, not as build breaks.
- Because there are no stories and no related components, there is no interactive reference implementation to copy from; behavioral validation must come from your own tests.
- The entry is categorized as utilities, meaning it is an export grouping rather than a single rendered element; treating the import as the whole API surface risks missing the specific helper you actually need.
- With additionalExports empty, there is no documented secondary surface to fall back on when a helper is not found at the package root; check that your package version matches the documentation you are reading.
- Removing an unused Utilities import changes nothing visually, so unused-import lint rules are the practical way to detect stale references during refactors.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
