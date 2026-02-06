# Testing Patterns

> **Module**: 03-patterns/composition
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-06-02
> **Prerequisites**: [Custom Components](03-custom-components.md), [Design System Extension](04-design-system-extension.md)

## Overview

Testing FluentUI v9 components requires wrapping them in `FluentProvider` for theming context, understanding slot rendering for assertions, and using accessible queries for robust tests. This guide covers unit testing, accessibility testing, and integration testing patterns.

---

## Test Setup

### Required Provider Wrapper

All FluentUI v9 components need `FluentProvider` to function. Create a reusable wrapper:

```tsx
// test-utils/render.tsx
import * as React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

/**
 * All FluentUI v9 components require FluentProvider for theming context.
 * This wrapper ensures every test has the provider automatically.
 */
const FluentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FluentProvider theme={webLightTheme}>
    {children}
  </FluentProvider>
);

/**
 * Custom render that wraps components in FluentProvider.
 * Use this instead of @testing-library/react's render.
 *
 * @example
 * ```tsx
 * const { getByRole } = renderWithProvider(<Button>Click me</Button>);
 * ```
 */
export const renderWithProvider = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: FluentWrapper, ...options });

// Re-export everything from testing-library for convenience
export * from '@testing-library/react';
export { renderWithProvider as render };
```

### Company Theme Wrapper

If you have a custom theme provider, create a second wrapper:

```tsx
// test-utils/render-company.tsx
import * as React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { CompanyThemeProvider } from '@company/design-system';

const CompanyWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CompanyThemeProvider colorMode="light">
    {children}
  </CompanyThemeProvider>
);

/** Render with full company design system context. */
export const renderWithCompanyTheme = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: CompanyWrapper, ...options });
```

---

## Unit Testing FluentUI Components

### Testing Basic Rendering

```tsx
// StatusCard.test.tsx
import { renderWithProvider, screen } from '../test-utils/render';
import { StatusCard } from './StatusCard';

describe('StatusCard', () => {
  it('renders heading text', () => {
    renderWithProvider(
      <StatusCard heading="Build succeeded" status="success" />,
    );

    expect(screen.getByText('Build succeeded')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    renderWithProvider(
      <StatusCard
        heading="Build succeeded"
        description="Completed in 2m 34s"
        status="success"
      />,
    );

    expect(screen.getByText('Completed in 2m 34s')).toBeInTheDocument();
  });

  it('does not render description when omitted', () => {
    renderWithProvider(
      <StatusCard heading="Build succeeded" status="success" />,
    );

    expect(screen.queryByText('Completed')).not.toBeInTheDocument();
  });
});
```

### Testing Interactive Behavior

```tsx
// StatusCard.interactive.test.tsx
import { renderWithProvider, screen } from '../test-utils/render';
import userEvent from '@testing-library/user-event';
import { StatusCard } from './StatusCard';

describe('StatusCard — interactive mode', () => {
  it('calls onClick when interactive and clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    renderWithProvider(
      <StatusCard
        heading="View details"
        status="info"
        interactive
        onClick={handleClick}
      />,
    );

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has role="button" when interactive', () => {
    renderWithProvider(
      <StatusCard heading="Clickable" status="info" interactive />,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has role="region" when not interactive', () => {
    renderWithProvider(
      <StatusCard heading="Static" status="info" />,
    );

    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('is focusable via keyboard when interactive', () => {
    renderWithProvider(
      <StatusCard heading="Focusable" status="info" interactive />,
    );

    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('tabindex', '0');
  });
});
```

### Testing Slot Customization

```tsx
// StatusCard.slots.test.tsx
import { renderWithProvider, screen } from '../test-utils/render';
import { StatusCard } from './StatusCard';

describe('StatusCard — slot customization', () => {
  it('renders icon slot when provided', () => {
    renderWithProvider(
      <StatusCard
        heading="Status"
        status="success"
        icon={<span data-testid="custom-icon">✓</span>}
      />,
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('accepts heading as props object for element override', () => {
    renderWithProvider(
      <StatusCard
        heading={{ children: 'Custom Heading', as: 'h2' }}
        status="info"
      />,
    );

    const heading = screen.getByText('Custom Heading');
    // The heading should render as h2 when overridden via slot props
    expect(heading.tagName).toBe('H2');
  });
});
```

### Testing Style Variants

```tsx
// StatusCard.styles.test.tsx
import { renderWithProvider, screen } from '../test-utils/render';
import { StatusCard } from './StatusCard';

describe('StatusCard — style variants', () => {
  it('applies fui-StatusCard class name to root', () => {
    renderWithProvider(
      <StatusCard heading="Test" status="info" />,
    );

    const root = screen.getByRole('region');
    expect(root.className).toContain('fui-StatusCard');
  });

  it('preserves user className', () => {
    renderWithProvider(
      <StatusCard heading="Test" status="info" className="my-custom-class" />,
    );

    const root = screen.getByRole('region');
    expect(root.className).toContain('my-custom-class');
  });

  it.each(['success', 'warning', 'error', 'info'] as const)(
    'renders with status=%s without errors',
    (status) => {
      const { container } = renderWithProvider(
        <StatusCard heading={`${status} card`} status={status} />,
      );

      expect(container.firstChild).toBeInTheDocument();
    },
  );
});
```

---

## Accessibility Testing

### Automated a11y Audits with jest-axe

```tsx
// StatusCard.a11y.test.tsx
import { renderWithProvider } from '../test-utils/render';
import { axe, toHaveNoViolations } from 'jest-axe';
import { StatusCard } from './StatusCard';

expect.extend(toHaveNoViolations);

describe('StatusCard — accessibility', () => {
  it('has no accessibility violations in static mode', async () => {
    const { container } = renderWithProvider(
      <StatusCard
        heading="Deployment complete"
        description="All services are running."
        status="success"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations in interactive mode', async () => {
    const { container } = renderWithProvider(
      <StatusCard
        heading="View details"
        status="info"
        interactive
        onClick={() => {}}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### ARIA Attribute Tests

```tsx
// StatusCard.aria.test.tsx
import { renderWithProvider, screen } from '../test-utils/render';
import { StatusCard } from './StatusCard';

describe('StatusCard — ARIA attributes', () => {
  it('supports aria-label on root', () => {
    renderWithProvider(
      <StatusCard
        heading="Status"
        status="info"
        aria-label="Build status card"
      />,
    );

    expect(screen.getByLabelText('Build status card')).toBeInTheDocument();
  });

  it('supports aria-describedby', () => {
    renderWithProvider(
      <>
        <StatusCard
          heading="Status"
          status="info"
          aria-describedby="status-help"
        />
        <p id="status-help">This card shows the current build status.</p>
      </>,
    );

    const card = screen.getByRole('region');
    expect(card).toHaveAttribute('aria-describedby', 'status-help');
  });
});
```

### Keyboard Navigation Tests

```tsx
// StatusCard.keyboard.test.tsx
import { renderWithProvider, screen } from '../test-utils/render';
import userEvent from '@testing-library/user-event';
import { StatusCard } from './StatusCard';

describe('StatusCard — keyboard navigation', () => {
  it('can be activated with Enter key when interactive', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    renderWithProvider(
      <StatusCard
        heading="Press Enter"
        status="info"
        interactive
        onClick={handleClick}
      />,
    );

    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be activated with Space key when interactive', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    renderWithProvider(
      <StatusCard
        heading="Press Space"
        status="info"
        interactive
        onClick={handleClick}
      />,
    );

    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard(' ');

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## Testing Recomposed Components

When testing a component that recomposes another (e.g., `AlertCard` recomposes `StatusCard`):

```tsx
// AlertCard.test.tsx
import { renderWithProvider, screen } from '../test-utils/render';
import { AlertCard } from './AlertCard';

describe('AlertCard', () => {
  it('always renders with error status styling', () => {
    renderWithProvider(
      <AlertCard heading="Critical failure" />,
    );

    // AlertCard locks status to "error", so it should be present
    expect(screen.getByText('Critical failure')).toBeInTheDocument();
  });

  it('does not accept status prop', () => {
    // TypeScript should prevent this at compile time:
    // @ts-expect-error — status prop is omitted from AlertCard
    renderWithProvider(<AlertCard heading="Test" status="success" />);
  });

  it('forwards all other StatusCard props', () => {
    renderWithProvider(
      <AlertCard
        heading="Error"
        description="Something went wrong"
        interactive
      />,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

---

## Testing Theme Integration

### Verifying Token Usage

```tsx
// theme.integration.test.tsx
import { renderWithProvider, screen } from '../test-utils/render';
import { StatusCard } from './StatusCard';

describe('StatusCard — theme integration', () => {
  it('renders correctly with light theme (default)', () => {
    const { container } = renderWithProvider(
      <StatusCard heading="Light theme" status="info" />,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders correctly with dark theme', () => {
    // Use a custom wrapper with dark theme
    const { container } = render(
      <FluentProvider theme={webDarkTheme}>
        <StatusCard heading="Dark theme" status="info" />
      </FluentProvider>,
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});
```

### Testing Custom Theme Provider

```tsx
// CompanyThemeProvider.test.tsx
import { render, screen } from '@testing-library/react';
import { CompanyThemeProvider } from './CompanyThemeProvider';
import { Button } from '@fluentui/react-components';

describe('CompanyThemeProvider', () => {
  it('renders children with light theme', () => {
    render(
      <CompanyThemeProvider colorMode="light">
        <Button>Click me</Button>
      </CompanyThemeProvider>,
    );

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('renders children with dark theme', () => {
    render(
      <CompanyThemeProvider colorMode="dark">
        <Button>Click me</Button>
      </CompanyThemeProvider>,
    );

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('injects custom CSS properties for company tokens', () => {
    const { container } = render(
      <CompanyThemeProvider colorMode="light">
        <div data-testid="content">Test</div>
      </CompanyThemeProvider>,
    );

    // The FluentProvider root element should have custom properties
    const providerRoot = container.firstChild as HTMLElement;
    const style = providerRoot.getAttribute('style') || '';
    expect(style).toContain('--company-header-height');
  });
});
```

---

## Testing Utilities

### Querying by FluentUI Class Names

```tsx
/**
 * Query helper for FluentUI static class names.
 * Useful when ARIA roles/labels aren't sufficient to target an element.
 */
export const queryByFuiClass = (
  container: HTMLElement,
  className: string,
): HTMLElement | null => {
  return container.querySelector(`.${className}`) as HTMLElement | null;
};

// Usage:
const heading = queryByFuiClass(container, 'fui-StatusCard__heading');
expect(heading).toHaveTextContent('Build succeeded');
```

### Snapshot Testing (Use Sparingly)

```tsx
// StatusCard.snapshot.test.tsx
import { renderWithProvider } from '../test-utils/render';
import { StatusCard } from './StatusCard';

describe('StatusCard — snapshots', () => {
  it('matches snapshot for success status', () => {
    const { container } = renderWithProvider(
      <StatusCard
        heading="Build succeeded"
        description="Pipeline completed."
        status="success"
      />,
    );

    // Note: Griffel generates atomic class names that may change.
    // Prefer behavioral tests over snapshots for FluentUI components.
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

> **Warning:** Snapshot tests with FluentUI can be brittle because Griffel generates atomic CSS class names that change when styles change. Prefer behavioral assertions (role queries, text content, ARIA attributes) over snapshots.

---

## Test File Organization

Following the project's test organization rules, split tests by concern:

```
components/StatusCard/
├── __tests__/
│   ├── StatusCard.render.test.tsx       # Basic rendering tests
│   ├── StatusCard.interactive.test.tsx  # Click, focus, keyboard tests
│   ├── StatusCard.slots.test.tsx        # Slot customization tests
│   ├── StatusCard.styles.test.tsx       # Style variant tests
│   ├── StatusCard.a11y.test.tsx         # Accessibility audit tests
│   ├── StatusCard.aria.test.tsx         # ARIA attribute tests
│   └── StatusCard.keyboard.test.tsx     # Keyboard navigation tests
├── StatusCard.tsx
├── StatusCard.types.ts
├── useStatusCard.ts
├── useStatusCardStyles.ts
├── renderStatusCard.tsx
└── index.ts
```

---

## Best Practices

### ✅ Do

- **Always wrap in FluentProvider** — Components fail silently without theme context
- **Query by ARIA role first** — `getByRole('button')` is more resilient than class selectors
- **Use `userEvent` over `fireEvent`** — `userEvent` simulates real browser behavior
- **Test each slot independently** — Verify optional slots render/hide correctly
- **Run axe audits** — Automated a11y testing catches common issues
- **Split tests by concern** — One test file per logical area (render, interactive, a11y)

### ❌ Don't

- **Don't test FluentUI internals** — Test your component's behavior, not FluentUI's
- **Don't assert Griffel class names** — They're generated and may change between versions
- **Don't mock FluentUI components** — Use real components with `FluentProvider`
- **Don't skip the provider wrapper** — Many components will error without it
- **Don't rely solely on snapshots** — Griffel classes make snapshots fragile

---

## Related Documentation

- [Custom Components](03-custom-components.md) — Building the components you're testing
- [Design System Extension](04-design-system-extension.md) — Testing your design system layer
- [Accessibility](../../01-foundation/06-accessibility.md) — FluentUI accessibility fundamentals
