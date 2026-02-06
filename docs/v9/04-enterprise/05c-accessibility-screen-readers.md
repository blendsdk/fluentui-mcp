# Enterprise Accessibility: Screen Reader Patterns

> **Module**: 04-enterprise
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02

## Overview

Screen reader users navigate by landmarks, headings, and ARIA roles. Enterprise applications must provide clear structure, meaningful announcements for dynamic content, and proper labeling for complex widgets. This guide covers landmark structure, heading hierarchy, ARIA patterns for custom components, and testing with screen readers.

---

## Landmark Structure

Screen readers let users jump between landmarks. Every page must have these:

```tsx
import * as React from 'react';
import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  body: {
    display: 'flex',
    flex: 1,
  },
});

/**
 * AppLayout — Provides proper landmark structure for screen readers.
 *
 * Landmarks:
 * - <header> with role="banner" — App header (auto from <header>)
 * - <nav> with aria-label — Sidebar navigation
 * - <main> — Primary content area
 * - <footer> with role="contentinfo" — App footer (optional)
 *
 * Screen readers announce: "Banner, Navigation, Main, Content Info"
 */
export function AppLayout({ children }: { children: React.ReactNode }) {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      {/* Banner landmark — announced as "banner" */}
      <header role="banner">
        <AppHeader />
      </header>

      <div className={styles.body}>
        {/* Navigation landmark — aria-label distinguishes multiple navs */}
        <nav aria-label="Main navigation">
          <AppSidebar />
        </nav>

        {/* Main landmark — only one per page */}
        <main id="main-content">
          {children}
        </main>
      </div>

      {/* Content info landmark (optional) */}
      <footer role="contentinfo">
        <AppFooter />
      </footer>
    </div>
  );
}
```

### Multiple Navigation Regions

When a page has multiple `<nav>` elements, each needs a unique `aria-label`:

```tsx
{/* Primary sidebar navigation */}
<nav aria-label="Main navigation">
  <NavDrawer>...</NavDrawer>
</nav>

{/* Breadcrumb navigation */}
<nav aria-label="Breadcrumb">
  <Breadcrumb>...</Breadcrumb>
</nav>

{/* Pagination navigation */}
<nav aria-label="Pagination">
  <PaginationControls />
</nav>
```

---

## Heading Hierarchy

Screen readers use headings (h1–h6) to build a page outline. The hierarchy must be logical:

```tsx
/**
 * ✅ CORRECT heading hierarchy:
 *
 * h1: Page title (only one per page)
 *   h2: Section titles
 *     h3: Subsections
 *       h4: Details within subsections
 *
 * Screen reader users navigate by pressing "H" to jump to next heading.
 */

// ✅ Good: Logical hierarchy
function ProductsPage() {
  return (
    <main>
      <h1>Products</h1>             {/* Page title */}

      <section>
        <h2>Active Products</h2>    {/* Section */}
        <ProductTable />
      </section>

      <section>
        <h2>Archived Products</h2>  {/* Section */}
        <h3>Last 30 days</h3>       {/* Subsection */}
        <ArchivedTable />
        <h3>Older than 30 days</h3>  {/* Subsection */}
        <OlderArchivedTable />
      </section>
    </main>
  );
}

// ❌ Bad: Skipped levels (h1 → h3, no h2)
function BadPage() {
  return (
    <main>
      <h1>Dashboard</h1>
      <h3>Revenue</h3>  {/* ❌ Skipped h2! */}
      <h3>Users</h3>    {/* ❌ No parent h2 */}
    </main>
  );
}
```

---

## Screen Reader Only Text

For conveying information to screen readers that is visually represented (e.g., icons):

```tsx
import * as React from 'react';
import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  /** Visually hidden but available to screen readers */
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
 * ScreenReaderOnly — Renders text visible only to screen readers.
 *
 * Use when visual indicators (icons, colors) convey meaning
 * that needs a text equivalent for screen reader users.
 */
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  const styles = useStyles();
  return <span className={styles.srOnly}>{children}</span>;
}

// Usage: Status indicator with icon only
function StatusIcon({ status }: { status: 'online' | 'offline' }) {
  return (
    <>
      {status === 'online' ? '🟢' : '🔴'}
      <ScreenReaderOnly>{status === 'online' ? 'Online' : 'Offline'}</ScreenReaderOnly>
    </>
  );
}
```

---

## ARIA Patterns for DataGrid

FluentUI DataGrid provides correct ARIA roles automatically. Here's what it generates and what you need to add:

```tsx
import * as React from 'react';
import {
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  Text,
} from '@fluentui/react-components';

/**
 * DataGrid automatically sets:
 * - role="grid" on the DataGrid
 * - role="row" on each DataGridRow
 * - role="columnheader" on DataGridHeaderCell
 * - role="gridcell" on DataGridCell
 * - aria-sort on sortable headers
 * - aria-selected on selected rows
 *
 * Developer must add:
 * - aria-label on the DataGrid (describes the table's purpose)
 * - aria-label on action buttons within cells
 */
function AccessibleUserGrid({ users }: { users: User[] }) {
  return (
    <DataGrid
      items={users}
      columns={columns}
      getRowId={(item) => item.id}
      sortable
      selectionMode="multiselect"
      aria-label="User management table"  // ← Developer must add this
    >
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<User>>
        {({ item, rowId }) => (
          <DataGridRow<User> key={rowId}>
            {({ renderCell }) => (
              <DataGridCell>{renderCell(item)}</DataGridCell>
            )}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  );
}
```

---

## Announcing Dynamic Updates

### Toast Notifications

FluentUI Toast uses `role="status"` automatically — screen readers announce toasts without interrupting the user's current task:

```tsx
// FluentUI Toast is already screen-reader friendly.
// The Toaster component creates an ARIA live region.
// No extra work needed.

dispatchToast(
  <Toast>
    <ToastTitle>Changes saved</ToastTitle>
  </Toast>,
  { intent: 'success' },
);
// Screen reader announces: "Changes saved"
```

### Announcing Table Actions

```tsx
import * as React from 'react';

/**
 * useAnnounce — Announces messages to screen readers via a live region.
 *
 * Returns a function to trigger announcements and a component
 * that renders the invisible live region.
 */
export function useAnnounce() {
  const [message, setMessage] = React.useState('');

  const announce = React.useCallback((text: string) => {
    setMessage(''); // Clear first to ensure re-announcement
    requestAnimationFrame(() => setMessage(text));
  }, []);

  const LiveRegion = React.useMemo(
    () => (
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
        }}
      >
        {message}
      </div>
    ),
    [message],
  );

  return { announce, LiveRegion };
}

// Usage: Announce when rows are deleted
function UserManager() {
  const { announce, LiveRegion } = useAnnounce();

  const handleDelete = (userName: string) => {
    deleteUser(userName);
    announce(`${userName} has been deleted`);
    // Screen reader announces: "Jane Doe has been deleted"
  };

  return (
    <>
      {LiveRegion}
      <UserTable onDelete={handleDelete} />
    </>
  );
}
```

---

## Form Accessibility

FluentUI Field component handles most form accessibility automatically:

```tsx
import * as React from 'react';
import { Field, Input, Select, Checkbox } from '@fluentui/react-components';

/**
 * FluentUI Field automatically provides:
 * - <label> associated with the input via htmlFor/id
 * - aria-describedby linking hint/error text to the input
 * - aria-invalid="true" when validationState="error"
 * - aria-required="true" when required prop is set
 *
 * Screen reader announces:
 * "Email, required, edit text, Email is required, invalid"
 */
function AccessibleForm() {
  return (
    <form aria-label="User registration">
      <Field label="Full Name" required>
        <Input placeholder="Enter your name" />
      </Field>

      <Field
        label="Email"
        required
        validationState="error"
        validationMessage="Email is required"
      >
        <Input type="email" />
      </Field>

      <Field label="Role" hint="Select the user's access level">
        <Select>
          <option>Viewer</option>
          <option>Editor</option>
          <option>Admin</option>
        </Select>
      </Field>

      {/* Checkbox and Switch provide their own labels */}
      <Checkbox label="I agree to the terms of service" required />
    </form>
  );
}
```

---

## Testing with Screen Readers

### Manual Testing Checklist

| Test | Screen Reader | Steps |
|------|--------------|-------|
| Page landmarks | VoiceOver: Rotor → Landmarks | Verify banner, navigation, main are present |
| Heading outline | VoiceOver: Rotor → Headings | Verify logical h1→h2→h3 hierarchy |
| Form labels | VoiceOver: Tab through form | Each input announces its label |
| Error messages | VoiceOver: Tab to invalid field | Announces "invalid" and error message |
| Buttons | VoiceOver: Tab to button | Announces button name (not "button button") |
| Dialog open | VoiceOver: Activate dialog trigger | Announces dialog title, traps focus |
| Dialog close | VoiceOver: Press Escape | Focus returns to trigger, dialog dismissed |
| Menu | VoiceOver: Activate menu trigger | Announces "menu", arrow keys navigate |
| Table | VoiceOver: Navigate grid | Announces row/column headers with cell content |
| Toast | VoiceOver: Trigger a toast | Announces toast content without interruption |

### Screen Reader Commands Quick Reference

| Action | VoiceOver (Mac) | NVDA (Windows) |
|--------|-----------------|----------------|
| Next heading | VO + Cmd + H | H |
| List landmarks | VO + U → Landmarks | NVDA + F7 |
| List headings | VO + U → Headings | NVDA + F7 → Headings |
| Next form field | VO + Cmd + J | F |
| Read current item | VO + A | NVDA + ↓ |
| Navigate table cells | VO + Arrow keys | Ctrl + Alt + Arrow keys |

---

## Best Practices

### ✅ Do

- **Use semantic HTML** (`<header>`, `<nav>`, `<main>`, `<footer>`) for landmarks
- **Maintain logical heading hierarchy** — never skip heading levels
- **Add `aria-label`** to DataGrid and navigation regions
- **Use `aria-live` regions** for dynamic content announcements
- **Test with a real screen reader** — automated tools miss many issues

### ❌ Don't

- **Don't use `role="presentation"` on interactive elements** — removes them from the a11y tree
- **Don't use `aria-hidden="true"` on visible content** — hides it from screen readers
- **Don't duplicate visible text in aria-label** — screen readers will read it twice
- **Don't use placeholder as a label substitute** — placeholders disappear on focus

---

## Related Documentation

- [WCAG Compliance](05a-accessibility-wcag.md) — WCAG criteria reference
- [Keyboard & Focus](05b-accessibility-keyboard-focus.md) — Keyboard navigation patterns
- [Foundation: Accessibility](../01-foundation/06-accessibility.md) — Accessibility fundamentals
- [Testing Patterns](../03-patterns/composition/05-testing-patterns.md) — Automated a11y testing
