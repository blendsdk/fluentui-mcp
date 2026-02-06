# Quick Reference: Accessibility Checklist

> **Parent**: [Quick Reference Index](00-quick-ref-index.md)

## WCAG 2.1 AA Quick Checklist

### ✅ Perceivable

- [ ] All images have meaningful `alt` text (or `alt=""` for decorative)
- [ ] Color is never the sole indicator of state (use icons, text, patterns too)
- [ ] Text has 4.5:1 contrast ratio (3:1 for large text)
- [ ] UI components have 3:1 contrast against background
- [ ] Content works at 200% zoom without horizontal scrolling
- [ ] No information conveyed through visual position/color alone

### ✅ Operable

- [ ] All interactive elements are keyboard accessible
- [ ] Focus order is logical (left→right, top→bottom)
- [ ] Focus indicator is visible on all interactive elements
- [ ] No keyboard traps (user can always Tab out)
- [ ] Skip navigation link provided for repeated content
- [ ] No time limits (or user can extend/disable them)

### ✅ Understandable

- [ ] Page language is set (`<html lang="en">`)
- [ ] Form fields have visible labels
- [ ] Error messages are clear and suggest corrections
- [ ] Consistent navigation across pages
- [ ] Input purpose is identified (autocomplete attributes)

### ✅ Robust

- [ ] Valid HTML structure
- [ ] ARIA roles and properties used correctly
- [ ] Custom components expose correct role and state
- [ ] Status messages announced without focus change

---

## FluentUI Accessibility Patterns

### Form Field Accessibility

```typescript
// ✅ Field provides label + error message + required indicator automatically
<Field label="Email" required validationMessage="Invalid email" validationState="error">
  <Input type="email" />
</Field>

// ❌ Don't use Input without a label
<Input placeholder="Email" />  // Placeholder is NOT a label!
```

### Button Accessibility

```typescript
// ✅ Icon-only button with aria-label
<Button icon={<DeleteRegular />} aria-label="Delete item" />

// ✅ Button with visible text (no aria-label needed)
<Button icon={<AddRegular />}>Add Item</Button>

// ❌ Icon-only button without label
<Button icon={<DeleteRegular />} />  // No accessible name!
```

### Tooltip for Labeling

```typescript
import { Tooltip, Button } from '@fluentui/react-components';

// relationship="label" — tooltip IS the accessible name
<Tooltip content="Delete" relationship="label">
  <Button icon={<DeleteRegular />} />
</Tooltip>

// relationship="description" — adds supplementary info
<Tooltip content="Permanently removes the item" relationship="description">
  <Button icon={<DeleteRegular />} aria-label="Delete" />
</Tooltip>
```

### Dialog Accessibility

```typescript
// ✅ Dialog auto-manages focus trap, focus restoration, and Escape key
<Dialog>
  <DialogTrigger><Button>Open</Button></DialogTrigger>
  <DialogSurface aria-label="Confirm delete">
    <DialogTitle>Delete?</DialogTitle>  {/* Auto-sets aria-labelledby */}
    <DialogBody>Are you sure?</DialogBody>
    <DialogActions>
      <DialogTrigger><Button>Cancel</Button></DialogTrigger>
      <Button appearance="primary">Delete</Button>
    </DialogActions>
  </DialogSurface>
</Dialog>
```

### Live Regions (Screen Reader Announcements)

```typescript
// Toast auto-uses aria-live for announcements
const { dispatchToast } = useToastController(toasterId);
dispatchToast(<Toast><ToastTitle>Saved</ToastTitle></Toast>, { intent: 'success' });

// MessageBar uses role="status" automatically
<MessageBar intent="success">
  <MessageBarBody>Changes saved</MessageBarBody>
</MessageBar>

// Custom live region
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

---

## Keyboard Patterns

### Standard Component Keyboard Support

| Component | Keys | Behavior |
|-----------|------|----------|
| **Button** | `Enter`, `Space` | Activates button |
| **Menu** | `↑↓` arrows, `Enter`, `Escape` | Navigate items, select, close |
| **Tabs** | `←→` arrows | Switch tabs |
| **Dialog** | `Escape`, `Tab` | Close, cycle focus within trap |
| **Combobox** | `↑↓` arrows, `Enter`, `Escape` | Navigate options, select, close |
| **Tree** | `↑↓←→` arrows, `Enter`, `Space` | Navigate, expand/collapse, select |
| **Accordion** | `↑↓` arrows, `Enter`, `Space` | Navigate, expand/collapse |
| **DataGrid** | `↑↓←→` arrows | Navigate cells |

### Focus Management

```typescript
// Focus trap (Dialog, Drawer automatically include this)
// For custom implementations, focus should cycle within the overlay

// Focus restoration (auto-managed by DialogTrigger)
<DialogTrigger>
  <Button>Open</Button>  {/* Focus returns here when dialog closes */}
</DialogTrigger>

// Skip navigation
<a href="#main-content" className="skip-link">Skip to main content</a>
<main id="main-content">...</main>
```

---

## Landmark Structure

```typescript
// Proper document structure
<FluentProvider theme={webLightTheme}>
  <header role="banner">
    <nav aria-label="Main navigation">...</nav>
  </header>

  <main role="main" id="main-content">
    <h1>Page Title</h1>
    {/* Page content */}
  </main>

  <aside role="complementary" aria-label="Sidebar">
    {/* Sidebar content */}
  </aside>

  <footer role="contentinfo">...</footer>
</FluentProvider>
```

---

## Screen Reader Utilities

```typescript
// Visually hidden but screen-reader accessible
const useStyles = makeStyles({
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  },
});

// Usage
<span className={styles.srOnly}>Additional context for screen readers</span>
```

---

## Common A11y Anti-Patterns

### ❌ Don'ts

```typescript
// ❌ Using placeholder as label
<Input placeholder="Enter email" />

// ❌ Using color alone for status
<span style={{ color: 'red' }}>Error</span>

// ❌ Non-interactive element with click handler
<div onClick={handleClick}>Click me</div>

// ❌ Missing aria-label on icon-only buttons
<Button icon={<SearchRegular />} />

// ❌ Suppressing focus indicators
button:focus { outline: none; }  /* Never do this! */

// ❌ Using role="button" instead of <Button>
<div role="button" tabIndex={0}>Not a real button</div>
```

### ✅ Do's

```typescript
// ✅ Use Field for form labels
<Field label="Email"><Input /></Field>

// ✅ Use icon + text for status
<MessageBar intent="error"><MessageBarBody>Error message</MessageBarBody></MessageBar>

// ✅ Use Button component for actions
<Button onClick={handleClick}>Click me</Button>

// ✅ Provide aria-label for icon-only buttons
<Button icon={<SearchRegular />} aria-label="Search" />

// ✅ Use FluentUI components (built-in a11y)
<Tooltip content="Search" relationship="label">
  <Button icon={<SearchRegular />} />
</Tooltip>
```

---

## Testing Accessibility

```bash
# Automated testing with axe-core
yarn add -D @axe-core/react jest-axe

# In tests:
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

const { container } = render(<MyComponent />);
const results = await axe(container);
expect(results).toHaveNoViolations();
```

### Manual Testing Checklist

1. **Keyboard-only navigation**: Tab through entire page without mouse
2. **Screen reader**: Test with VoiceOver (Mac) or NVDA (Windows)
3. **Zoom**: Test at 200% browser zoom
4. **High contrast**: Test with Windows High Contrast Mode
5. **Focus indicator**: Verify all interactive elements show focus

---

## See Also

- [Accessibility Foundation](../01-foundation/06-accessibility.md) — Deep dive
- [Enterprise Accessibility](../04-enterprise/05a-accessibility-wcag.md) — WCAG compliance
- [Keyboard & Focus](../04-enterprise/05b-accessibility-keyboard-focus.md) — Keyboard patterns
- [Screen Readers](../04-enterprise/05c-accessibility-screen-readers.md) — Screen reader patterns
