# Layout Patterns

> **Module**: 03-patterns/layout
> **FluentUI Version**: 9.x
> **Last Updated**: 2026-04-02

## Overview

Layout patterns documentation for building responsive, accessible page layouts with FluentUI v9. Covers page structure, responsive design, grid patterns, and common layout templates.

## Documentation Index

| File | Description |
|------|-------------|
| [01-page-structure.md](01-page-structure.md) | App shell, header, sidebar, content area |
| [02-responsive-design.md](02-responsive-design.md) | Media queries with Griffel, mobile-first |
| [03-grid-patterns.md](03-grid-patterns.md) | Card grids, data grids, responsive grids |
| [04a-dashboard-layout.md](04a-dashboard-layout.md) | Dashboard layouts with stats, charts, activity |
| [04b-settings-layout.md](04b-settings-layout.md) | Settings page layouts with navigation |
| [04c-detail-page-layout.md](04c-detail-page-layout.md) | Detail page layouts with tabs and sidebars |

## Quick Reference

### Essential Imports

```tsx
import {
  makeStyles,
  tokens,
  shorthands,
  mergeClasses,
} from '@fluentui/react-components';
```

### Basic Page Layout

```tsx
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    height: '48px',
    backgroundColor: tokens.colorBrandBackground,
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${tokens.spacingHorizontalL}`,
  },
  main: {
    display: 'flex',
    flex: 1,
  },
  sidebar: {
    width: '256px',
    backgroundColor: tokens.colorNeutralBackground2,
    padding: tokens.spacingVerticalM,
  },
  content: {
    flex: 1,
    padding: tokens.spacingVerticalL,
  },
});

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const styles = useStyles();
  
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        {/* Header content */}
      </header>
      <main className={styles.main}>
        <nav className={styles.sidebar}>
          {/* Navigation */}
        </nav>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
};
```

### Responsive Breakpoints

```tsx
const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr', // Mobile: single column
    gap: tokens.spacingVerticalM,
    
    '@media (min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, 1fr)', // Tablet: 2 columns
    },
    
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)', // Desktop: 3 columns
    },
    
    '@media (min-width: 1280px)': {
      gridTemplateColumns: 'repeat(4, 1fr)', // Large: 4 columns
    },
  },
});
```

### Common Breakpoint Values

| Breakpoint | Width | Typical Use |
|------------|-------|-------------|
| Mobile | < 640px | Single column |
| Tablet | 640px - 1023px | 2 columns |
| Desktop | 1024px - 1279px | 3 columns |
| Large | ≥ 1280px | 4+ columns |

## Key Concepts

### FlexBox Layout

```tsx
const useStyles = makeStyles({
  // Row layout
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: tokens.spacingHorizontalM,
    alignItems: 'center',
  },
  
  // Column layout
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  
  // Space between items
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  
  // Centered content
  centered: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

### Grid Layout

```tsx
const useStyles = makeStyles({
  // Auto-fit grid
  autoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: tokens.spacingVerticalM,
  },
  
  // Fixed columns
  threeColumn: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: tokens.spacingVerticalM,
  },
  
  // Sidebar layout
  withSidebar: {
    display: 'grid',
    gridTemplateColumns: '256px 1fr',
    gap: tokens.spacingHorizontalL,
  },
});
```

### Spacing Tokens

```tsx
// Vertical spacing
tokens.spacingVerticalXXS   // 2px
tokens.spacingVerticalXS    // 4px
tokens.spacingVerticalS     // 8px
tokens.spacingVerticalM     // 12px
tokens.spacingVerticalL     // 16px
tokens.spacingVerticalXL    // 20px
tokens.spacingVerticalXXL   // 24px

// Horizontal spacing
tokens.spacingHorizontalXXS // 2px
tokens.spacingHorizontalXS  // 4px
tokens.spacingHorizontalS   // 8px
tokens.spacingHorizontalM   // 12px
tokens.spacingHorizontalL   // 16px
tokens.spacingHorizontalXL  // 20px
tokens.spacingHorizontalXXL // 24px
```

## Best Practices

1. **Use design tokens** - Always use FluentUI tokens for spacing, colors
2. **Mobile-first** - Start with mobile layout, enhance for larger screens
3. **Semantic HTML** - Use appropriate elements (header, main, nav, aside)
4. **Flex for 1D** - Use flexbox for single-axis layouts
5. **Grid for 2D** - Use CSS Grid for complex multi-axis layouts
6. **Test responsively** - Verify layouts at all breakpoints
7. **Consider accessibility** - Ensure keyboard navigation, focus management

## Related Documentation

- [Card Component](../../02-components/layout/card.md)
- [Divider Component](../../02-components/layout/divider.md)
- [Drawer Component](../../02-components/overlays/drawer.md)
- [Styling with Griffel](../../01-foundation/04-styling-griffel.md)