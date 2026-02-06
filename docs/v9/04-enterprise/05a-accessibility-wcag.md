# Enterprise Accessibility: WCAG Compliance

> **Module**: 04-enterprise
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02

## Overview

Enterprise applications must meet WCAG 2.1 AA compliance for legal requirements (ADA, EAA, Section 508) and inclusive design. FluentUI v9 components are designed with accessibility built in, but developers must use them correctly and test rigorously. This guide covers WCAG criteria, FluentUI's built-in accessibility features, common violations, and audit checklists.

---

## WCAG 2.1 AA Quick Reference

### Perceivable

| Criterion | Rule | FluentUI Solution |
|-----------|------|-------------------|
| 1.1.1 | Non-text content needs text alternatives | Use `aria-label` on icon-only buttons |
| 1.3.1 | Info conveyed visually must be in structure | Use semantic HTML (`<nav>`, `<main>`, `<header>`) |
| 1.3.2 | Meaningful sequence must be programmatic | Use logical DOM order, not CSS-only reordering |
| 1.4.1 | Color alone must not convey meaning | Badge text + color; icons + color for status |
| 1.4.3 | Text contrast ratio ≥ 4.5:1 | FluentUI tokens meet this by default |
| 1.4.4 | Text resizable up to 200% without loss | Use `rem`/`em` or token sizes, not fixed `px` |
| 1.4.11 | Non-text contrast ≥ 3:1 | FluentUI focus indicators meet this |

### Operable

| Criterion | Rule | FluentUI Solution |
|-----------|------|-------------------|
| 2.1.1 | All functionality via keyboard | FluentUI components support keyboard natively |
| 2.1.2 | No keyboard traps | Dialog `trapFocus` releases on Escape |
| 2.4.1 | Skip navigation mechanism | Add "Skip to content" link |
| 2.4.3 | Logical focus order | Use natural DOM order |
| 2.4.7 | Visible focus indicator | FluentUI provides focus outlines by default |

### Understandable

| Criterion | Rule | FluentUI Solution |
|-----------|------|-------------------|
| 3.1.1 | Page language must be declared | Set `lang` attribute on `<html>` |
| 3.2.1 | No unexpected context change on focus | FluentUI components don't auto-submit on focus |
| 3.3.1 | Input errors must be identified | Use Field `validationMessage` prop |
| 3.3.2 | Labels provided for inputs | Use Field component which provides `<label>` |

### Robust

| Criterion | Rule | FluentUI Solution |
|-----------|------|-------------------|
| 4.1.2 | Name, role, value for all UI components | FluentUI uses correct ARIA roles |
| 4.1.3 | Status messages via ARIA live regions | Toast uses `role="status"` automatically |

---

## FluentUI Built-In Accessibility

### What FluentUI Handles Automatically

```tsx
// ✅ Button — Sets role="button", handles Enter/Space, focus styles
<Button>Click me</Button>

// ✅ Dialog — Traps focus, Escape closes, role="dialog", aria-modal
<Dialog open={open}>
  <DialogSurface>
    <DialogBody>...</DialogBody>
  </DialogSurface>
</Dialog>

// ✅ Menu — Arrow key navigation, role="menu", role="menuitem"
<Menu>
  <MenuTrigger><Button>Options</Button></MenuTrigger>
  <MenuPopover>
    <MenuList>
      <MenuItem>Edit</MenuItem>
      <MenuItem>Delete</MenuItem>
    </MenuList>
  </MenuPopover>
</Menu>

// ✅ Field — Associates <label> with input, renders error messages
<Field label="Email" validationMessage="Required" validationState="error">
  <Input />
</Field>

// ✅ Tabs — role="tablist", role="tab", role="tabpanel", arrow keys
<TabList selectedValue={tab} onTabSelect={handleSelect}>
  <Tab value="a">Tab A</Tab>
  <Tab value="b">Tab B</Tab>
</TabList>
```

### What Developers Must Add

```tsx
// ❌ Missing: aria-label on icon-only buttons
<Button icon={<DeleteRegular />} />

// ✅ Fixed: aria-label describes the action
<Button icon={<DeleteRegular />} aria-label="Delete item" />

// ❌ Missing: alt text on decorative images
<Image src="chart.png" />

// ✅ Fixed: alt describes the content or is empty for decorative
<Image src="chart.png" alt="Revenue chart showing 15% growth" />

// ❌ Missing: Skip navigation link
<div>
  <AppHeader />
  <AppSidebar />
  <main>Content</main>
</div>

// ✅ Fixed: Skip to content link
<div>
  <a href="#main-content" className={styles.skipLink}>
    Skip to main content
  </a>
  <AppHeader />
  <AppSidebar />
  <main id="main-content">Content</main>
</div>
```

---

## Skip Navigation Link

```tsx
import * as React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  skipLink: {
    position: 'absolute',
    top: '-100%',
    left: 0,
    zIndex: 1000,
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    textDecoration: 'none',
    fontWeight: tokens.fontWeightSemibold,
    /**
     * Becomes visible when focused via keyboard Tab.
     * Screen readers always see it regardless of visibility.
     */
    ':focus': {
      top: 0,
    },
  },
});

export function SkipNavigation() {
  const styles = useStyles();

  return (
    <a href="#main-content" className={styles.skipLink}>
      Skip to main content
    </a>
  );
}
```

---

## Color Alone Must Not Convey Meaning

```tsx
// ❌ BAD: Color is the only indicator of status
<Badge color="success" />  {/* What does green mean? */}

// ✅ GOOD: Color + text label
<Badge color="success">Active</Badge>

// ✅ GOOD: Color + icon
<Badge color="danger" icon={<ErrorCircleRegular />}>Error</Badge>

// ❌ BAD: Red text is the only error indicator
<Text style={{ color: 'red' }}>Email is required</Text>

// ✅ GOOD: Field component provides icon + message + color
<Field
  label="Email"
  validationState="error"
  validationMessage="Email is required"
>
  <Input />
</Field>
```

---

## ARIA Live Regions for Dynamic Content

```tsx
import * as React from 'react';
import { Text, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
});

/**
 * LiveRegion — Announces dynamic content changes to screen readers.
 *
 * Use `aria-live="polite"` for non-urgent updates (filter results count).
 * Use `aria-live="assertive"` for urgent updates (error messages).
 */
export function LiveRegion({
  message,
  politeness = 'polite',
}: {
  message: string;
  politeness?: 'polite' | 'assertive';
}) {
  const styles = useStyles();

  return (
    <div aria-live={politeness} aria-atomic="true" className={styles.srOnly}>
      {message}
    </div>
  );
}

// Usage: Announce filter results
function FilterResults({ count }: { count: number }) {
  return (
    <>
      <Text>{count} results found</Text>
      <LiveRegion message={`${count} results found`} />
    </>
  );
}
```

---

## Accessibility Audit Checklist

### Before Release

| # | Check | How to Test | Pass? |
|---|-------|-------------|-------|
| 1 | All images have `alt` text | Inspect HTML | ☐ |
| 2 | All icon-only buttons have `aria-label` | Inspect HTML | ☐ |
| 3 | Page language declared (`lang="en"`) | View source | ☐ |
| 4 | Skip navigation link present | Tab from address bar | ☐ |
| 5 | All forms have visible labels | Visual inspection | ☐ |
| 6 | Error messages linked to inputs | Check `aria-describedby` | ☐ |
| 7 | Color is not sole indicator | Grayscale test | ☐ |
| 8 | Contrast ratio ≥ 4.5:1 for text | axe DevTools | ☐ |
| 9 | Focus visible on all interactive elements | Tab through page | ☐ |
| 10 | No keyboard traps | Tab through all dialogs/menus | ☐ |
| 11 | Logical heading hierarchy (h1→h2→h3) | HeadingsMap extension | ☐ |
| 12 | Dynamic content announced via live region | Screen reader test | ☐ |
| 13 | Page works at 200% zoom | Browser zoom | ☐ |
| 14 | Touch targets ≥ 44x44px on mobile | Element inspector | ☐ |

---

## Automated Testing with axe-core

```tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

expect.extend(toHaveNoViolations);

/**
 * renderAccessible — Test helper that wraps component in FluentProvider
 * and runs axe-core accessibility audit.
 */
async function renderAccessible(ui: React.ReactElement) {
  const { container } = render(
    <FluentProvider theme={webLightTheme}>{ui}</FluentProvider>,
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
  return container;
}

// Usage in tests:
test('LoginForm has no accessibility violations', async () => {
  await renderAccessible(<LoginForm />);
});

test('UserTable has no accessibility violations', async () => {
  await renderAccessible(<UserTable users={mockUsers} />);
});
```

---

## Best Practices

### ✅ Do

- **Use FluentUI Field** for all form inputs — it handles labels, errors, and ARIA
- **Add `aria-label`** to every icon-only button
- **Test with a screen reader** (VoiceOver on Mac, NVDA on Windows)
- **Run axe-core** in CI to catch regressions automatically
- **Include a skip navigation link** at the top of every page

### ❌ Don't

- **Don't disable focus outlines** — they are required for keyboard users
- **Don't use `div` with `onClick`** — use `Button` or proper interactive elements
- **Don't convey meaning with color alone** — always add text or icons
- **Don't use `tabindex` > 0** — it disrupts natural tab order

---

## Related Documentation

- [Keyboard & Focus](05b-accessibility-keyboard-focus.md) — Keyboard navigation patterns
- [Screen Readers](05c-accessibility-screen-readers.md) — Screen reader patterns
- [Foundation: Accessibility](../01-foundation/06-accessibility.md) — Accessibility fundamentals
- [Testing Patterns](../03-patterns/composition/05-testing-patterns.md) — jest-axe testing
