# FluentProvider

> **Package**: `@fluentui/react-provider` v9.22.17
> **Import**: `import { FluentProvider } from '@fluentui/react-components';`
> **Category**: utilities
> **Stability**: stable

## Overview

FluentProvider is the theming and context primitive of Fluent UI React v9. It renders a required root slot element and emits the design token CSS custom properties of the theme supplied through its theme prop, so every descendant component resolves tokens (for example tokens.colorNeutralBackground1, tokens.colorBrandBackground, tokens.colorNeutralForeground1) against the correct scope. Beyond theming, the provider sets text direction with the dir prop (including generated styles, not just alignment), supplies the Document that portals should render into through targetDocument, and can carry its styles into portal-rendered surfaces with applyStylesToPortals. Because it establishes the context that all other v9 components consume, it is normally rendered once high in the React tree, but it can be nested to re-theme or re-orient a subtree, as shown by the Nested story, which overrides only colorBrandStroke1, colorBrandBackground2, and colorBrandForeground2 over a webLightTheme base. It also exposes the unstable customStyleHooks_unstable map for centrally overriding per-component style hooks and an internal overrides_unstable escape hatch.

**When to use**: Use FluentProvider whenever you adopt Fluent UI React v9: render it around your application (or around each independently rendered root, such as a micro-frontend, test surface, or story) so components receive a theme, a direction, and a target document. Use the theme prop to switch between shipped themes such as webLightTheme, teamsLightTheme, and teamsDarkTheme, or to apply a brand or product theme. Nest an extra provider when a region needs a different theme (for example, an embedded widget with its own brand color), when a region must render right-to-left via dir, or when content is rendered inside an iframe through targetDocument. Reach for it also when portal content (Dialog, Menu, Popover, Tooltip) must inherit the surrounding theme, which applyStylesToPortals handles by default. Do not use it as a layout or page-chrome container: if you only need spacing, background, or structure, use a plain element with makeStyles instead. Do not use it per component as a styling wrapper; that is what makeStyles, tokens, className, and the individual component style props are for.

## Props Reference

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `applyStylesToPortals` | `boolean \| undefined` | `true` | No | Passes styles applied to a component down to portals if enabled. |
| `customStyleHooks_unstable` | `Partial<{ useAccordionHeaderStyles_unstable: (state: unknown) => void; useAccordionItemStyles_unstable: (state: unknown) => void; useAccordionPanelStyles_unstable: (state: unknown) => void; useAccordionStyles_unstable: (state: unknown) => void; useAlphaSliderStyles_unstable: (state: unknown) => void; useAvatarGroupItemStyles_unstable: (state: unknown) => void; useAvatarGroupPopoverStyles_unstable: (state: unknown) => void; useAvatarGroupStyles_unstable: (state: unknown) => void; useAvatarStyles_unstable: (state: unknown) => void; useBadgeStyles_unstable: (state: unknown) => void; useBreadcrumbButtonStyles_unstable: (state: unknown) => void; useBreadcrumbDividerStyles_unstable: (state: unknown) => void; useBreadcrumbItemStyles_unstable: (state: unknown) => void; useBreadcrumbStyles_unstable: (state: unknown) => void; useButtonStyles_unstable: (state: unknown) => void; useCardFooterStyles_unstable: (state: unknown) => void; useCardHeaderStyles_unstable: (state: unknown) => void; useCardPreviewStyles_unstable: (state: unknown) => void; useCardStyles_unstable: (state: unknown) => void; useCarouselAutoplayButtonStyles_unstable: (state: unknown) => void; useCarouselButtonStyles_unstable: (state: unknown) => void; useCarouselCardStyles_unstable: (state: unknown) => void; useCarouselNavButtonStyles_unstable: (state: unknown) => void; useCarouselNavContainerStyles_unstable: (state: unknown) => void; useCarouselNavImageButtonStyles_unstable: (state: unknown) => void; useCarouselNavStyles_unstable: (state: unknown) => void; useCarouselSliderStyles_unstable: (state: unknown) => void; useCarouselStyles_unstable: (state: unknown) => void; useCarouselViewportStyles_unstable: (state: unknown) => void; useCheckboxStyles_unstable: (state: unknown) => void; useComboboxStyles_unstable: (state: unknown) => void; useCompoundButtonStyles_unstable: (state: unknown) => void; useColorAreaStyles_unstable: (state: unknown) => void; useColorPickerStyles_unstable: (state: unknown) => void; useColorSliderStyles_unstable: (state: unknown) => void; useColorSwatchStyles_unstable: (state: unknown) => void; useCounterBadgeStyles_unstable: (state: unknown) => void; useDataGridBodyStyles_unstable: (state: unknown) => void; useDataGridCellStyles_unstable: (state: unknown) => void; useDataGridHeaderCellStyles_unstable: (state: unknown) => void; useDataGridHeaderStyles_unstable: (state: unknown) => void; useDataGridRowStyles_unstable: (state: unknown) => void; useDataGridSelectionCellStyles_unstable: (state: unknown) => void; useDataGridStyles_unstable: (state: unknown) => void; useDialogActionsStyles_unstable: (state: unknown) => void; useDialogBodyStyles_unstable: (state: unknown) => void; useDialogContentStyles_unstable: (state: unknown) => void; useDialogSurfaceStyles_unstable: (state: unknown) => void; useDialogTitleStyles_unstable: (state: unknown) => void; useDividerStyles_unstable: (state: unknown) => void; useDrawerBodyStyles_unstable: (state: unknown) => void; useDrawerFooterStyles_unstable: (state: unknown) => void; useDrawerHeaderNavigationStyles_unstable: (state: unknown) => void; useDrawerHeaderStyles_unstable: (state: unknown) => void; useDrawerHeaderTitleStyles_unstable: (state: unknown) => void; useDrawerInlineStyles_unstable: (state: unknown) => void; useDrawerOverlayStyles_unstable: (state: unknown) => void; useOverlayDrawerSurfaceStyles_unstable: (state: unknown) => void; useDrawerStyles_unstable: (state: unknown) => void; useDropdownStyles_unstable: (state: unknown) => void; useEmptySwatchStyles_unstable: (state: unknown) => void; useFieldStyles_unstable: (state: unknown) => void; useFlatTreeStyles_unstable: (state: unknown) => void; useImageStyles_unstable: (state: unknown) => void; useImageSwatchStyles_unstable: (state: unknown) => void; useInfoButtonStyles_unstable: (state: unknown) => void; useInfoLabelStyles_unstable: (state: unknown) => void; useInlineDrawerStyles_unstable: (state: unknown) => void; useInputStyles_unstable: (state: unknown) => void; useInteractionTagPrimaryStyles_unstable: (state: unknown) => void; useInteractionTagSecondaryStyles_unstable: (state: unknown) => void; useInteractionTagStyles_unstable: (state: unknown) => void; useLabelStyles_unstable: (state: unknown) => void; useLinkStyles_unstable: (state: unknown) => void; useListItemButtonStyles_unstable: (state: unknown) => void; useListItemStyles_unstable: (state: unknown) => void; useListStyles_unstable: (state: unknown) => void; useListboxStyles_unstable: (state: unknown) => void; useMenuButtonStyles_unstable: (state: unknown) => void; useMenuDividerStyles_unstable: (state: unknown) => void; useMenuGroupHeaderStyles_unstable: (state: unknown) => void; useMenuGroupStyles_unstable: (state: unknown) => void; useMenuItemCheckboxStyles_unstable: (state: unknown) => void; useMenuItemLinkStyles_unstable: (state: unknown) => void; useMenuItemRadioStyles_unstable: (state: unknown) => void; useMenuItemStyles_unstable: (state: unknown) => void; useMenuItemSwitchStyles_unstable: (state: unknown) => void; useMenuListStyles_unstable: (state: unknown) => void; useMenuPopoverStyles_unstable: (state: unknown) => void; useMenuSplitGroupStyles_unstable: (state: unknown) => void; useMessageBarActionsStyles_unstable: (state: unknown) => void; useMessageBarBodyStyles_unstable: (state: unknown) => void; useMessageBarGroupStyles_unstable: (state: unknown) => void; useMessageBarStyles_unstable: (state: unknown) => void; useMessageBarTitleStyles_unstable: (state: unknown) => void; useAppItemStyles_unstable: (state: unknown) => void; useAppItemStaticStyles_unstable: (state: unknown) => void; useHamburgerStyles_unstable: (state: unknown) => void; useNavCategoryItemStyles: (state: unknown) => void; useNavDividerStyles_unstable: (state: unknown) => void; useNavDrawerStyles_unstable: (state: unknown) => void; useNavDrawerBodyStyles_unstable: (state: unknown) => void; useNavDrawerFooterStyles_unstable: (state: unknown) => void; useNavDrawerHeaderStyles_unstable: (state: unknown) => void; useNavItemStyles_unstable: (state: unknown) => void; useNavSectionHeaderStyles_unstable: (state: unknown) => void; useNavSubItemStyles_unstable: (state: unknown) => void; useNavSubItemGroupStyles_unstable: (state: unknown) => void; useSplitNavItemStyles_unstable: (state: unknown) => void; useOptionGroupStyles_unstable: (state: unknown) => void; useOptionStyles_unstable: (state: unknown) => void; useOverlayDrawerStyles_unstable: (state: unknown) => void; usePersonaStyles_unstable: (state: unknown) => void; usePopoverSurfaceStyles_unstable: (state: unknown) => void; usePresenceBadgeStyles_unstable: (state: unknown) => void; useProgressBarStyles_unstable: (state: unknown) => void; useRadioGroupStyles_unstable: (state: unknown) => void; useRadioStyles_unstable: (state: unknown) => void; useRatingDisplayStyles_unstable: (state: unknown) => void; useRatingItemStyles_unstable: (state: unknown) => void; useRatingStyles_unstable: (state: unknown) => void; useSearchBoxStyles_unstable: (state: unknown) => void; useSelectStyles_unstable: (state: unknown) => void; useSkeletonItemStyles_unstable: (state: unknown) => void; useSkeletonStyles_unstable: (state: unknown) => void; useSliderStyles_unstable: (state: unknown) => void; useSpinButtonStyles_unstable: (state: unknown) => void; useSpinnerStyles_unstable: (state: unknown) => void; useSplitButtonStyles_unstable: (state: unknown) => void; useSwatchPickerRowStyles_unstable: (state: unknown) => void; useSwatchPickerStyles_unstable: (state: unknown) => void; useSwitchStyles_unstable: (state: unknown) => void; useTabListStyles_unstable: (state: unknown) => void; useTabStyles_unstable: (state: unknown) => void; useTeachingPopoverBodyStyles_unstable: (state: unknown) => void; useTeachingPopoverCarouselCardStyles_unstable: (state: unknown) => void; useTeachingPopoverCarouselFooterButtonStyles_unstable: (state: unknown) => void; useTeachingPopoverCarouselFooterStyles_unstable: (state: unknown) => void; useTeachingPopoverCarouselNavButtonStyles_unstable: (state: unknown) => void; useTeachingPopoverCarouselNavStyles_unstable: (state: unknown) => void; useTeachingPopoverCarouselPageCountStyles_unstable: (state: unknown) => void; useTeachingPopoverCarouselStyles_unstable: (state: unknown) => void; useTeachingPopoverFooterStyles_unstable: (state: unknown) => void; useTeachingPopoverHeaderStyles_unstable: (state: unknown) => void; useTeachingPopoverActionsStyles_unstable: (state: unknown) => void; useTeachingPopoverButtonStyles_unstable: (state: unknown) => void; useTeachingPopoverStyles_unstable: (state: unknown) => void; useTeachingPopoverPageCountStyles_unstable: (state: unknown) => void; useTeachingPopoverSurfaceStyles_unstable: (state: unknown) => void; useTeachingPopoverTitleStyles_unstable: (state: unknown) => void; useTagGroupStyles_unstable: (state: unknown) => void; useTagPickerButtonStyles_unstable: (state: unknown) => void; useTagPickerControlStyles_unstable: (state: unknown) => void; useTagPickerGroupStyles_unstable: (state: unknown) => void; useTagPickerInputStyles_unstable: (state: unknown) => void; useTagPickerListStyles_unstable: (state: unknown) => void; useTagPickerOptionGroupStyles_unstable: (state: unknown) => void; useTagPickerOptionStyles_unstable: (state: unknown) => void; useTagStyles_unstable: (state: unknown) => void; useTableBodyStyles_unstable: (state: unknown) => void; useTableCellActionsStyles_unstable: (state: unknown) => void; useTableCellLayoutStyles_unstable: (state: unknown) => void; useTableCellStyles_unstable: (state: unknown) => void; useTableHeaderCellStyles_unstable: (state: unknown) => void; useTableHeaderStyles_unstable: (state: unknown) => void; useTableResizeHandleStyles_unstable: (state: unknown) => void; useTableRowStyles_unstable: (state: unknown) => void; useTableSelectionCellStyles_unstable: (state: unknown) => void; useTableStyles_unstable: (state: unknown) => void; useTextareaStyles_unstable: (state: unknown) => void; useTextStyles_unstable: (state: unknown) => void; useTimePickerCompatStyles_unstable: (state: unknown) => void; useToastBodyStyles_unstable: (state: unknown) => void; useToastContainerStyles_unstable: (state: unknown) => void; useToasterStyles_unstable: (state: unknown) => void; useToastFooterStyles_unstable: (state: unknown) => void; useToastStyles_unstable: (state: unknown) => void; useToastTitleStyles_unstable: (state: unknown) => void; useToggleButtonStyles_unstable: (state: unknown) => void; useToolbarButtonStyles_unstable: (state: unknown) => void; useToolbarDividerStyles_unstable: (state: unknown) => void; useToolbarGroupStyles_unstable: (state: unknown) => void; useToolbarRadioButtonStyles_unstable: (state: unknown) => void; useToolbarToggleButtonStyles_unstable: (state: unknown) => void; useToolbarStyles_unstable: (state: unknown) => void; useTooltipStyles_unstable: (state: unknown) => void; useTreeItemLayoutStyles_unstable: (state: unknown) => void; useTreeItemPersonaLayoutStyles_unstable: (state: unknown) => void; useTreeItemStyles_unstable: (state: unknown) => void; useTreeStyles_unstable: (state: unknown) => void; useVirtualizerScrollViewDynamicStyles_unstable: (state: unknown) => void; useVirtualizerScrollViewStyles_unstable: (state: unknown) => void; useVirtualizerStyles_unstable: (state: unknown) => void; }> \| undefined` | — | No | Sets the hooks for custom styling components. |
| `dir` | `"ltr" \| "rtl" \| undefined` | — | No | Sets the direction of text & generated styles. |
| `overrides_unstable` | `OverridesContextValue \| undefined` | — | No | — |
| `targetDocument` | `Document \| undefined` | — | No | Provides the document, can be undefined during SSR render. |
| `theme` | `Partial<Theme> \| undefined` | — | No | Sets the theme used in a scope. |

### Prop Guidance

- **theme**: Sets the theme used in the provider's scope. Pass a shipped theme for an out-of-the-box look, or a partial theme object to override only specific tokens, as the Nested example does for colorBrandStroke1, colorBrandBackground2, and colorBrandForeground2. Keep the object stable because a new identity re-emits the scope's variables and restyles descendants; omitting the prop leaves the inherited theme in place. `webLightTheme, teamsDarkTheme, or a partial token override such as colorBrandStroke1 and colorBrandBackground2`
- **dir**: Sets the direction of text and of generated styles for the subtree. Use rtl for right-to-left locales and pair it with a matching lang on the root slot, as the Dir example does with Arabic; use ltr for left-to-right content. Prefer this provider-level control over ad-hoc per-component direction styling, since styles and horizontal navigation derive from it. `rtl`
- **targetDocument**: Provides the Document that portals and generated content should render into, and can be undefined during server-side rendering. A FluentProvider does not cross an iframe boundary, so when rendering inside an iframe pass the iframe's Document here and also to RendererProvider; otherwise portal content renders in the parent document and loses the surrounding context. `the Document instance of the iframe, or undefined during SSR`
- **applyStylesToPortals**: Defaults to true and passes styles applied to a component down to portals. Leave it enabled so components that render through Portal, such as Dialog, Menu, Popover, and Tooltip, inherit the provider's theme, direction, and variables. Disable it only when you deliberately wrap portal content in its own FluentProvider and want to avoid duplicate style application. `true (default)`
- **customStyleHooks_unstable**: Overrides the per-component style hooks listed for this prop, such as useButtonStyles_unstable, useMenuStyles_unstable, and the other use*Styles_unstable entries, so that matching components rendered in this provider are restyled centrally. It is an unstable API: define the hook map once at module scope or memoize it, and expect no stability guarantees across releases. `a partial map of use*Styles_unstable hooks defined once at module scope`
- **overrides_unstable**: An internal escape hatch for Fluent UI context overrides that is not publicly documented here; the prop data carries no public description. Treat it as unstable and avoid it in application code unless you are following a specific official workaround that names it. `an OverridesContextValue supplied by Fluent UI internals (avoid in application code)`

### Slots

| Slot | Element | Required | Description |
| --- | --- | --- | --- |
| `root` | — | Yes | — |

## Examples

### Default

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';

export const Default = (): JSXElement => {
  const styles = useStyles();
  return (
    <>
      <div>
        <FluentProvider className={styles.provider} theme={webLightTheme}>
          <div className={styles.text}>Web Light Theme</div>
          <Button className={styles.button}>Web Light Theme</Button>
        </FluentProvider>
      </div>
      <div>
        <FluentProvider className={styles.provider} theme={teamsLightTheme}>
          <div className={styles.text}>Teams Light Theme</div>
          <Button className={styles.button}>Teams Light Theme</Button>
        </FluentProvider>
      </div>
      <div>
        <FluentProvider className={styles.provider} theme={teamsDarkTheme}>
          <div className={styles.text}>Teams Dark Theme</div>
          <Button className={styles.button}>Teams Dark Theme</Button>
        </FluentProvider>
      </div>
    </>
  );
};
```

### ApplyStylesToPortals

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import * as ReactDOM from 'react-dom';

export const ApplyStylesToPortals = (): JSXElement => (
  // FrameRenderer is redundant this example, it's used only to render portals inside an iframe
  // to make them visible in Storybook
  <FrameRenderer>
    {(externalDocument, renderer) => (
      <RendererProvider renderer={renderer} targetDocument={externalDocument}>
        <ApplyStylesToPortalsExample targetDocument={externalDocument} />
      </RendererProvider>
    )}
  </FrameRenderer>
);

ApplyStylesToPortals.parameters = {
  docs: {
    description: {
      story: [
        '`applyStylesToPortals` controls if styles from FluentProvider should be applied to components that use ',
        'Portal component.',
      ].join(''),
    },
  },
};
```

### Dir

```tsx
import * as React from 'react';
import type { JSXElement } from '@fluentui/react-components';
import { makeStyles, tokens, FluentProvider } from '@fluentui/react-components';

export const Dir = (): JSXElement => {
  const styles = useStyles();
  return (
    <>
      <div className={styles.example}>
        <FluentProvider>
          <div className={styles.text}>Text left to right</div>
        </FluentProvider>
        <FluentProvider dir="rtl" lang="ar">
          <div className={styles.text}>نص من اليمين إلى اليسار</div>
        </FluentProvider>
      </div>
    </>
  );
};

Dir.parameters = {
  docs: {
    description: {
      story: 'A Fluent provider can render text left-to-right (LTR) or right-to-left (RTL).',
    },
  },
};
```

## Best Practices

### Do's

- Render one FluentProvider as high in the React tree as possible, typically wrapping the app root, so every Fluent UI component below resolves theme, direction, and target document from the same context.
- Drive colors through the theme prop with a shipped theme (webLightTheme, teamsLightTheme, teamsDarkTheme) so descendant components consistently resolve tokens such as tokens.colorBrandBackground and tokens.colorNeutralForeground1.
- Nest a FluentProvider with a partial theme object when only a region needs different branding; the Nested example overrides colorBrandStroke1, colorBrandBackground2, and colorBrandForeground2 while everything else stays inherited.
- Set dir to rtl on the provider for right-to-left locales and pair it with an appropriate lang on the root slot, rather than patching individual components' styles.
- Keep applyStylesToPortals at its default of true so content rendered through Portal, including menus, dialogs, popovers, and tooltips, stays themed and correctly oriented.
- When rendering inside an iframe, pass the iframe's Document to targetDocument on both FluentProvider and RendererProvider, because a provider does not cross an iframe boundary.
- Memoize the theme object and customStyleHooks_unstable map (module scope or a stable reference) so the provider does not re-emit scope variables and restyle the subtree on every render.
- Use the root slot's className with makeStyles and tokens (for example tokens.colorNeutralBackground2, tokens.spacingHorizontalM, tokens.borderRadiusMedium, tokens.fontFamilyBase) when the themed region itself needs padding, a background, or a border.

### Don'ts

- Do not wrap every component or small section in its own FluentProvider by default; each provider adds a wrapper element and repeats variable and style work.
- Do not disable applyStylesToPortals and then expect menus, dialogs, or tooltips to keep the surrounding theme; portal content renders outside the provider's DOM subtree.
- Do not create a new theme object inline on every render, since changing its identity forces avoidable style and variable recalculation for the entire subtree.
- Do not try to theme iframe content with CSS from the parent document; without targetDocument (and RendererProvider pointed at the same document) the iframe has no provider context.
- Do not treat FluentProvider as a flex, grid, or page-layout container; it exists to provide theme and context, so put layout on its root slot className or on a child element.
- Do not build long-term features on customStyleHooks_unstable or overrides_unstable; both are explicitly unstable and may change without a full deprecation cycle.
- Do not override theme variables with raw hex values sprinkled through stylesheets, which bypasses token intent and breaks hover, pressed, and dark-theme variants.
- Do not set direction only in global CSS while leaving the provider's dir unset, because generated styles depend on the provider-level direction value.

## Anti-Patterns

### Provider soup

❌ Wrapping many individual components or small sections in separate FluentProviders multiplies wrapper elements, re-emits token variables per scope, and makes it unclear which theme, direction, or target document applies to a given component.

✅ Render one provider high in the tree and nest additional providers only where a subtree genuinely needs a different theme, direction, or target document, such as an embedded branded widget.

### Portals that lose their theme

❌ Turning off applyStylesToPortals leaves Dialog, Menu, Popover, and Tooltip content rendered outside the provider's DOM subtree and therefore outside its theme, direction, and variables, so portal surfaces look unstyled or mismatched.

✅ Leave applyStylesToPortals at its default of true, or, if you deliberately disable it, wrap each portal-rendered surface in its own FluentProvider so it receives the same context.

### Inline theme objects on every render

❌ Passing a brand-new theme object literal on each render changes the identity of a value that describes the whole subtree, forcing unnecessary variable and style work and breaking memoization of descendants.

✅ Hoist theme objects to module scope or memoize them with stable dependencies, and do the same for the customStyleHooks_unstable map.

### Expecting the provider to cross an iframe

❌ A FluentProvider rendered in the parent document does not provide context or styles to Fluent UI content rendered inside an iframe, even when that iframe hosts parts of the same application.

✅ Render a provider for the iframe's document and point targetDocument at that Document, together with RendererProvider for the same document, as the Frame example demonstrates.

### Theming with raw color values instead of tokens

❌ Overriding theme values with hard-coded hex colors bypasses the theme contract, so hover, pressed, disabled, and dark-theme variants of descendant components no longer coordinate and contrast can silently fail.

✅ Use the theme prop with a partial token override, as in the Nested example, so descendants keep resolving theme-aware tokens such as tokens.colorBrandBackground, tokens.colorBrandForeground1, and tokens.colorNeutralForeground1.

## Accessibility

**Requirements**: FluentProvider renders a neutral container, so most WCAG obligations are delegated to the theme it provides and to descendant components. The token values in the active theme must meet contrast requirements in every mode: 4.5:1 for normal text and 3:1 for large text and meaningful non-text elements, using pairings such as tokens.colorNeutralForeground1 on tokens.colorNeutralBackground1 and tokens.colorBrandForeground1 on tokens.colorBrandBackground. When you apply a partial theme, re-validate every combination you override, for example colorBrandForeground2 on colorBrandBackground2 as used in the Nested example. Keep focus visibility intact: descendant components draw focus indicators from tokens such as tokens.colorStrokeFocus2, so avoid overriding those with low-contrast values. Finally, because the provider scopes language and direction, set lang on the root slot (paired with dir for RTL content, as the Dir example does) so assistive technology reads localized content correctly, and never hide the provider root itself, since that would hide the entire themed subtree.

| Key | Action |
| --- | --- |
| `None (no built-in key handling)` | FluentProvider installs no key listeners and renders a non-interactive root slot; keyboard interaction is entirely delegated to descendant components. |
| `Tab and Shift+Tab` | Focus traversal passes through the provider's root element unchanged and continues into descendant components in DOM order; the provider does not trap, skip, or reorder focus. |
| `Arrow keys (via dir context)` | Not handled by FluentProvider itself, but the dir value it provides is what descendant widgets use to mirror horizontal arrow-key navigation and generate right-to-left styles. |

**ARIA**: lang is not set automatically; place it on the root slot when the content language differs from the page, as the Dir example does for Arabic RTL content., dir is rendered on the root element from the dir prop, so assistive technology and CSS logical properties both orient correctly., No role, aria-label, aria-labelledby, aria-describedby, or aria-live is added by the provider; it is a neutral wrapper that neither creates nor suppresses landmarks., Any aria-* attribute you pass to the root slot is forwarded to the underlying element; add them only when you intentionally give the themed region semantics., className and style on the root slot are forwarded for visual presentation only and carry no accessibility meaning.

**Screen Reader**: Screen readers announce nothing for the provider itself because it renders a plain container; they move directly into descendant components. What the provider does influence is orientation and language: the dir prop and a lang attribute on the root determine reading order and pronunciation for the whole subtree, including portal-rendered content when applyStylesToPortals is left enabled. It contributes no landmark, no live region, and no accessible name, so it does not appear in the accessibility tree outline beyond the element it renders, and it never changes focus order for the content it wraps.

## Styling

Style the provider's own surface by passing a className produced with makeStyles to the root slot and using Griffel design tokens, for example tokens.colorNeutralBackground2 for a subtle panel, tokens.colorNeutralStroke1 with tokens.borderRadiusMedium for a framed region, and tokens.spacingHorizontalM or tokens.spacingVerticalM plus tokens.fontFamilyBase for readable padding and typography. For anything deeper than the provider's own box, prefer swapping the theme rather than writing CSS: the theme prop writes token variables that every descendant resolves, so a nested provider with a partial theme (as in the Nested story, overriding colorBrandStroke1, colorBrandBackground2, and colorBrandForeground2) is the supported way to re-brand a subtree. If you must reach into component internals across the whole subtree, customStyleHooks_unstable lets you override the individual use*Styles_unstable hooks for the components you name, but define those overrides once at module scope because they participate in every matching render. Remember that visual changes made with the root slot className do not propagate to portal surfaces the way theme tokens do; portals inherit the theme through applyStylesToPortals, not through your wrapper class.

## Performance

FluentProvider is usually mounted once, so its cost is mostly about identity stability rather than count. Recreating the theme object or the customStyleHooks_unstable map on every render changes context identity and triggers style and variable work for the whole subtree, so keep both stable. Nesting providers adds a wrapper element per scope plus a fresh set of variables, and deeply nested providers multiply that work, so scope deliberately. With applyStylesToPortals left at true, every portal-rendered surface receives the provider's styles, which is the intended trade-off for keeping menus, dialogs, and tooltips consistent; disabling it reduces that work but shifts responsibility to you. Using customStyleHooks_unstable adds extra style-hook invocations for matching components throughout the subtree, so limit the map to the components you actually need to restyle. During server-side rendering, targetDocument may be undefined and portal-mounted content appears only after hydration, so avoid depending on portal content for the initial paint.

## Theming & Tokens

The theme prop is the theming mechanism: it writes design token CSS custom properties onto the provider scope, and descendant code consumes them through Griffel tokens such as tokens.colorNeutralBackground1, tokens.colorNeutralForeground1, tokens.colorNeutralStroke1, tokens.colorBrandBackground, tokens.colorBrandForeground1, tokens.colorBrandStroke1, tokens.colorBrandBackground2, tokens.fontFamilyBase, tokens.fontSizeBase300, tokens.borderRadiusMedium, tokens.spacingHorizontalM, and tokens.colorStrokeFocus2. Shipped themes (webLightTheme, teamsLightTheme, teamsDarkTheme) provide complete dark and light palettes, while a partial theme merges over the inherited theme, so a nested provider that sets only colorBrandStroke1, colorBrandBackground2, and colorBrandForeground2 keeps every other token from its ancestor, as the Nested example shows. Because the values are CSS variables scoped to the DOM subtree, components rendered through Portal only receive them when applyStylesToPortals is enabled (the default), and components moved outside the provider's subtree must be re-wrapped. When you override tokens, validate the pairings you change (for example brand foreground on brand background, and focus indicators such as tokens.colorStrokeFocus2) so light, dark, hover, and focus states remain legible.

## Migration Notes

FluentProvider replaces the v8 theming stack. Where v8 used Fabric, loadTheme, and Customizer to push a theme into the tree, v9 renders FluentProvider with a theme object (webLightTheme, teamsLightTheme, teamsDarkTheme, or a partial Theme) and distributes it as CSS custom properties rather than JS theme objects, so token-based styles work in plain CSS and in Griffel. Scoped or partial theming that v8 expressed with nested Customizer or a Customizer scope is expressed in v9 by nesting FluentProvider with a partial theme, which merges over inherited tokens. RTL, previously handled with direction utilities and rtl props on individual components, is centralized in the dir prop, which also drives generated styles for the subtree. Rendering into iframes and other documents is a v9 concern handled by targetDocument (paired with RendererProvider for the same Document), and portal styling is handled by applyStylesToPortals, which defaults to true. customStyleHooks_unstable and overrides_unstable have no stable v8 equivalent and should be treated as temporary escape hatches.

## Edge Cases

- A FluentProvider does not cross an iframe boundary; content inside the iframe needs its own provider plus a targetDocument pointing at that iframe's Document, with RendererProvider aligned to the same document.
- targetDocument can be undefined during server-side rendering, and portals cannot render into a document that does not exist yet, so portal-mounted content such as menus and dialogs appears only after hydration.
- Portals render outside the provider's DOM subtree; applyStylesToPortals is what carries the styles there, so disabling it silently affects every component that uses Portal, including Dialog, Menu, Popover, and Tooltip.
- Nested providers merge partial themes: only the tokens you specify are overridden and everything else resolves from the nearest ancestor provider, which is why a three-token override like the Nested example is safe.
- The dir prop affects generated styles, not just text alignment, so changing it at runtime flips descendant styling as well; keep dir and lang in sync for localized and right-to-left regions.
- customStyleHooks_unstable and overrides_unstable are explicitly unstable, so they can change without a full deprecation cycle, and unknown keys in the custom style hook map are ignored rather than reported.
- Components rendered without any FluentProvider ancestor fall back to Fluent UI's default context instead of your theme, so your intended theme, direction, and target document only apply inside a provider scope.

## See Also

- [utilities category](../categories/utilities.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
