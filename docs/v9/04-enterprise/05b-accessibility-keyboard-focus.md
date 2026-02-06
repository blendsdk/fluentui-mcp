# Enterprise Accessibility: Keyboard & Focus Management

> **Module**: 04-enterprise
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02

## Overview

Keyboard navigation is essential for accessibility — users with motor disabilities, power users, and screen reader users all depend on it. FluentUI v9 components provide keyboard support out of the box, but enterprise layouts with sidebars, modals, and complex data grids require additional focus management. This guide covers keyboard patterns, focus trapping, focus restoration, and roving tabindex.

---

## FluentUI Keyboard Patterns by Component

| Component | Key | Behavior |
|-----------|-----|----------|
| **Button** | Enter, Space | Activates the button |
| **Menu** | Arrow Up/Down | Navigate items |
| **Menu** | Enter | Select item |
| **Menu** | Escape | Close menu |
| **Dialog** | Escape | Close dialog |
| **Dialog** | Tab | Cycle within dialog (focus trap) |
| **Tabs** | Arrow Left/Right | Switch tabs |
| **DataGrid** | Arrow keys | Navigate cells |
| **DataGrid** | Enter | Activate row/cell action |
| **Tree** | Arrow Up/Down | Navigate items |
| **Tree** | Arrow Right | Expand node |
| **Tree** | Arrow Left | Collapse node |
| **Combobox** | Arrow Down | Open dropdown |
| **Combobox** | Enter | Select highlighted option |
| **NavDrawer** | Arrow Up/Down | Navigate nav items |

---

## Focus Trap in Custom Overlays

FluentUI Dialog and Drawer automatically trap focus. For custom overlays, use `useFocusTrap`:

```tsx
import * as React from 'react';

/**
 * useFocusTrap — Traps keyboard focus within a container element.
 *
 * When active, Tab and Shift+Tab cycle through focusable elements
 * inside the container only. Escape calls onEscape callback.
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  active: boolean,
  onEscape?: () => void,
) {
  React.useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    // Focus the first focusable element
    const firstFocusable = container.querySelector<HTMLElement>(focusableSelector);
    firstFocusable?.focus();

    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [active, containerRef, onEscape]);
}

// Usage:
function CustomPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, open, onClose);

  if (!open) return null;

  return (
    <div ref={panelRef} role="dialog" aria-modal="true">
      <h2>Panel Title</h2>
      <input placeholder="Name" />
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

---

## Focus Restoration After Dialogs

When a dialog closes, focus should return to the element that opened it:

```tsx
import * as React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogTrigger,
  Button,
} from '@fluentui/react-components';

/**
 * FluentUI Dialog handles focus restoration automatically
 * when used with DialogTrigger. Focus returns to the trigger
 * button when the dialog closes.
 */
function EditDialog() {
  return (
    <Dialog>
      {/* DialogTrigger saves a reference to this button */}
      <DialogTrigger disableButtonEnhancement>
        <Button>Edit Item</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Edit</DialogTitle>
          <DialogContent>Form content here</DialogContent>
          <DialogActions>
            {/* Close action restores focus to the trigger */}
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cancel</Button>
            </DialogTrigger>
            <Button appearance="primary">Save</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
```

### Manual Focus Restoration

For programmatically opened dialogs (not using DialogTrigger):

```tsx
import * as React from 'react';
import { Button, Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions } from '@fluentui/react-components';

function ManualFocusRestore() {
  const [open, setOpen] = React.useState(false);
  /** Store reference to the element that opened the dialog */
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setOpen(false);
    // Restore focus to the element that opened the dialog
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  };

  return (
    <>
      <Button ref={triggerRef} onClick={() => setOpen(true)}>
        Open Settings
      </Button>
      <Dialog open={open} onOpenChange={(e, data) => !data.open && handleClose()}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Settings</DialogTitle>
            <DialogContent>...</DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
}
```

---

## Roving Tabindex for Custom Lists

For custom interactive lists where Arrow keys move focus between items:

```tsx
import * as React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    padding: tokens.spacingVerticalS,
    cursor: 'pointer',
    ':focus': {
      outline: `2px solid ${tokens.colorBrandStroke1}`,
      outlineOffset: '-2px',
    },
  },
});

/**
 * useRovingTabindex — Manages roving tabindex for a list of items.
 *
 * Only one item has tabindex="0" (the active item).
 * All others have tabindex="-1". Arrow keys move the active index.
 * This matches the WAI-ARIA Listbox pattern.
 */
export function useRovingTabindex(itemCount: number) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const itemRefs = React.useRef<(HTMLElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let newIndex = activeIndex;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        newIndex = Math.min(activeIndex + 1, itemCount - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = Math.max(activeIndex - 1, 0);
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = itemCount - 1;
        break;
      default:
        return;
    }

    setActiveIndex(newIndex);
    itemRefs.current[newIndex]?.focus();
  };

  const getItemProps = (index: number) => ({
    ref: (el: HTMLElement | null) => { itemRefs.current[index] = el; },
    tabIndex: index === activeIndex ? 0 : -1,
    onKeyDown: handleKeyDown,
  });

  return { activeIndex, getItemProps };
}

// Usage:
function CustomActionList({ items }: { items: string[] }) {
  const styles = useStyles();
  const { getItemProps } = useRovingTabindex(items.length);

  return (
    <ul className={styles.list} role="listbox" aria-label="Actions">
      {items.map((item, index) => (
        <li
          key={item}
          role="option"
          className={styles.item}
          {...getItemProps(index)}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
```

---

## Focus Management After Route Changes

```tsx
import * as React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * useFocusOnRouteChange — Moves focus to the main content heading
 * after client-side route navigation.
 *
 * Without this, keyboard/screen reader users are stranded at the top
 * of the page after navigation. Moving focus to the page heading
 * announces the new page and puts focus in a useful position.
 */
export function useFocusOnRouteChange() {
  const location = useLocation();

  React.useEffect(() => {
    // Small delay to allow page content to render
    const timer = setTimeout(() => {
      const heading = document.querySelector<HTMLElement>('main h1, main h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
        // Clean up so it doesn't remain focusable
        heading.addEventListener('blur', () => heading.removeAttribute('tabindex'), { once: true });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);
}

// Usage in AppShell:
function AppShell({ children }: { children: React.ReactNode }) {
  useFocusOnRouteChange();

  return (
    <div>
      <AppHeader />
      <AppSidebar />
      <main id="main-content">{children}</main>
    </div>
  );
}
```

---

## Keyboard Shortcut System

```tsx
import * as React from 'react';

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

/**
 * useKeyboardShortcuts — Registers global keyboard shortcuts.
 *
 * Ignores shortcuts when focus is inside an input/textarea
 * to prevent conflicts with typing.
 */
export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in inputs
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      for (const shortcut of shortcuts) {
        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          !!e.ctrlKey === !!shortcut.ctrlKey &&
          !!e.altKey === !!shortcut.altKey &&
          !!e.shiftKey === !!shortcut.shiftKey
        ) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Usage:
function DashboardPage() {
  useKeyboardShortcuts([
    { key: '/', action: () => document.querySelector<HTMLInputElement>('[role="searchbox"]')?.focus(), description: 'Focus search' },
    { key: 'n', ctrlKey: true, action: () => openCreateDialog(), description: 'New item' },
    { key: '?', shiftKey: true, action: () => openShortcutsHelp(), description: 'Show shortcuts' },
  ]);

  return <div>...</div>;
}
```

---

## Best Practices

### ✅ Do

- **Let FluentUI handle keyboard** for its own components (Menu, Dialog, Tabs, DataGrid)
- **Use DialogTrigger** so focus restores automatically on close
- **Move focus to page heading** after route changes
- **Use roving tabindex** for custom interactive lists
- **Ignore shortcuts when typing** in inputs/textareas

### ❌ Don't

- **Don't override FluentUI keyboard handlers** — they implement WAI-ARIA correctly
- **Don't use `tabindex > 0`** — it breaks natural tab order
- **Don't leave focus in a closed dialog** — always restore focus to trigger
- **Don't create keyboard shortcuts that conflict** with browser defaults (Ctrl+C, F5, etc.)

---

## Related Documentation

- [WCAG Compliance](05a-accessibility-wcag.md) — WCAG criteria reference
- [Screen Readers](05c-accessibility-screen-readers.md) — Screen reader patterns
- [Foundation: Accessibility](../01-foundation/06-accessibility.md) — Accessibility fundamentals
