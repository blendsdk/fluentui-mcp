# Responsive Design Patterns

> **File**: 03-patterns/layout/02-responsive-design.md
> **FluentUI Version**: 9.x

## Overview

Responsive design patterns using Griffel's media query support. This guide covers mobile-first design, breakpoint strategies, and responsive component patterns with FluentUI v9.

## Breakpoint Constants

```tsx
// Define consistent breakpoints for your application
export const breakpoints = {
  xs: '320px',   // Small phones
  sm: '640px',   // Large phones / small tablets
  md: '768px',   // Tablets
  lg: '1024px',  // Small desktops / large tablets
  xl: '1280px',  // Standard desktops
  xxl: '1536px', // Large desktops
} as const;

// Media query helpers
export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.sm})`,
  tablet: `@media (min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.lg})`,
  desktop: `@media (min-width: ${breakpoints.lg})`,
  
  // Min-width (mobile-first)
  smUp: `@media (min-width: ${breakpoints.sm})`,
  mdUp: `@media (min-width: ${breakpoints.md})`,
  lgUp: `@media (min-width: ${breakpoints.lg})`,
  xlUp: `@media (min-width: ${breakpoints.xl})`,
  
  // Max-width (desktop-first)
  smDown: `@media (max-width: ${breakpoints.sm})`,
  mdDown: `@media (max-width: ${breakpoints.md})`,
  lgDown: `@media (max-width: ${breakpoints.lg})`,
} as const;
```

## Mobile-First Approach

```tsx
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    // Mobile styles (default)
    padding: tokens.spacingVerticalM,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    
    // Tablet and up
    '@media (min-width: 640px)': {
      padding: tokens.spacingVerticalL,
      flexDirection: 'row',
      gap: tokens.spacingHorizontalM,
    },
    
    // Desktop and up
    '@media (min-width: 1024px)': {
      padding: tokens.spacingVerticalXL,
      maxWidth: '1200px',
      margin: '0 auto',
    },
  },
});

export const ResponsiveContainer = ({ children }: { children: React.ReactNode }) => {
  const styles = useStyles();
  return <div className={styles.container}>{children}</div>;
};
```

## Responsive Typography

```tsx
import { makeStyles, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  pageTitle: {
    fontSize: tokens.fontSizeBase500, // 20px on mobile
    lineHeight: tokens.lineHeightBase500,
    fontWeight: tokens.fontWeightSemibold,
    
    '@media (min-width: 640px)': {
      fontSize: tokens.fontSizeBase600, // 24px on tablet
      lineHeight: tokens.lineHeightBase600,
    },
    
    '@media (min-width: 1024px)': {
      fontSize: tokens.fontSizeHero700, // 28px on desktop
      lineHeight: tokens.lineHeightHero700,
    },
  },
  
  sectionTitle: {
    fontSize: tokens.fontSizeBase400, // 16px on mobile
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalS,
    
    '@media (min-width: 640px)': {
      fontSize: tokens.fontSizeBase500, // 20px on tablet+
      marginBottom: tokens.spacingVerticalM,
    },
  },
  
  bodyText: {
    fontSize: tokens.fontSizeBase300, // 14px on mobile
    lineHeight: tokens.lineHeightBase300,
    
    '@media (min-width: 640px)': {
      fontSize: tokens.fontSizeBase400, // 16px on tablet+
      lineHeight: tokens.lineHeightBase400,
    },
  },
});

export const ResponsiveTypography = () => {
  const styles = useStyles();
  
  return (
    <article>
      <Text as="h1" className={styles.pageTitle}>
        Page Title
      </Text>
      <Text as="h2" className={styles.sectionTitle}>
        Section Title
      </Text>
      <Text as="p" className={styles.bodyText}>
        Body text content that adjusts size based on viewport.
      </Text>
    </article>
  );
};
```

## Responsive Spacing

```tsx
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  // Responsive padding
  section: {
    padding: tokens.spacingVerticalM,
    
    '@media (min-width: 640px)': {
      padding: tokens.spacingVerticalL,
    },
    
    '@media (min-width: 1024px)': {
      padding: `${tokens.spacingVerticalXL} ${tokens.spacingHorizontalXXL}`,
    },
  },
  
  // Responsive gap
  cardGrid: {
    display: 'grid',
    gap: tokens.spacingVerticalS,
    
    '@media (min-width: 640px)': {
      gap: tokens.spacingVerticalM,
    },
    
    '@media (min-width: 1024px)': {
      gap: tokens.spacingVerticalL,
    },
  },
  
  // Responsive margins
  contentBlock: {
    marginBottom: tokens.spacingVerticalL,
    
    '@media (min-width: 1024px)': {
      marginBottom: tokens.spacingVerticalXXL,
    },
  },
});
```

## Show/Hide Elements

```tsx
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  // Hide on mobile
  desktopOnly: {
    display: 'none',
    
    '@media (min-width: 1024px)': {
      display: 'block',
    },
  },
  
  // Show only on mobile
  mobileOnly: {
    display: 'block',
    
    '@media (min-width: 640px)': {
      display: 'none',
    },
  },
  
  // Hide on tablet and below
  tabletHide: {
    '@media (max-width: 1023px)': {
      display: 'none',
    },
  },
});

interface ResponsiveVisibilityProps {
  children: React.ReactNode;
  showOn: 'mobile' | 'desktop' | 'tablet-up';
}

export const ResponsiveVisibility = ({ children, showOn }: ResponsiveVisibilityProps) => {
  const styles = useStyles();
  
  const className = {
    mobile: styles.mobileOnly,
    desktop: styles.desktopOnly,
    'tablet-up': styles.mobileOnly, // inverse: hide on mobile
  }[showOn];
  
  return <div className={className}>{children}</div>;
};
```

## Responsive Navigation

```tsx
import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Button,
  mergeClasses,
} from '@fluentui/react-components';
import { NavigationRegular, DismissRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
  },
  
  // Mobile menu button - only visible on mobile
  menuButton: {
    '@media (min-width: 768px)': {
      display: 'none',
    },
  },
  
  // Desktop navigation links
  navLinks: {
    // Hidden on mobile by default
    display: 'none',
    gap: tokens.spacingHorizontalL,
    
    '@media (min-width: 768px)': {
      display: 'flex',
    },
  },
  
  // Mobile navigation overlay
  mobileNav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    flexDirection: 'column',
    padding: tokens.spacingVerticalL,
    zIndex: 1000,
    transform: 'translateX(-100%)',
    transition: 'transform 200ms ease',
    
    '@media (min-width: 768px)': {
      display: 'none',
    },
  },
  mobileNavOpen: {
    transform: 'translateX(0)',
  },
  
  mobileNavHeader: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: tokens.spacingVerticalL,
  },
  
  mobileNavLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  
  navLink: {
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusMedium,
    textDecoration: 'none',
    color: tokens.colorNeutralForeground1,
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
});

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const ResponsiveNavigation = () => {
  const styles = useStyles();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className={styles.nav}>
        <div>Logo</div>
        
        {/* Desktop navigation */}
        <div className={styles.navLinks}>
          {navItems.map(item => (
            <a key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </a>
          ))}
        </div>
        
        {/* Mobile menu button */}
        <Button
          appearance="subtle"
          icon={<NavigationRegular />}
          className={styles.menuButton}
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        />
      </nav>
      
      {/* Mobile navigation overlay */}
      <div className={mergeClasses(
        styles.mobileNav,
        isMobileMenuOpen && styles.mobileNavOpen
      )}>
        <div className={styles.mobileNavHeader}>
          <Button
            appearance="subtle"
            icon={<DismissRegular />}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          />
        </div>
        <div className={styles.mobileNavLinks}>
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              className={styles.navLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};
```

## Responsive Table/Card Pattern

```tsx
import {
  makeStyles,
  tokens,
  Card,
  Text,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  // Card view for mobile
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    
    '@media (min-width: 768px)': {
      display: 'none',
    },
  },
  
  card: {
    padding: tokens.spacingVerticalM,
  },
  
  cardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalXS} 0`,
  },
  
  cardLabel: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  
  // Table view for desktop
  tableContainer: {
    display: 'none',
    
    '@media (min-width: 768px)': {
      display: 'block',
    },
  },
});

interface DataItem {
  id: string;
  name: string;
  email: string;
  status: string;
}

interface ResponsiveDataDisplayProps {
  data: DataItem[];
}

export const ResponsiveDataDisplay = ({ data }: ResponsiveDataDisplayProps) => {
  const styles = useStyles();

  return (
    <>
      {/* Mobile: Card view */}
      <div className={styles.cardContainer}>
        {data.map(item => (
          <Card key={item.id} className={styles.card}>
            <Text weight="semibold" size={400}>{item.name}</Text>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Email</span>
              <span>{item.email}</span>
            </div>
            <div className={styles.cardRow}>
              <span className={styles.cardLabel}>Status</span>
              <span>{item.status}</span>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Desktop: Table view */}
      <div className={styles.tableContainer}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
```

## useMediaQuery Hook

```tsx
import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive behavior based on media queries
 * @param query - CSS media query string
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Convenience hooks
export const useIsMobile = () => useMediaQuery('(max-width: 639px)');
export const useIsTablet = () => useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');

// Usage
export const ResponsiveComponent = () => {
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();

  if (isMobile) {
    return <MobileLayout />;
  }

  return <DesktopLayout />;
};
```

## Responsive useBreakpoint Hook

```tsx
import { useState, useEffect } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

const breakpointValues: Record<Breakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

/**
 * Hook that returns the current breakpoint based on window width
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('xs');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= breakpointValues.xxl) {
        setBreakpoint('xxl');
      } else if (width >= breakpointValues.xl) {
        setBreakpoint('xl');
      } else if (width >= breakpointValues.lg) {
        setBreakpoint('lg');
      } else if (width >= breakpointValues.md) {
        setBreakpoint('md');
      } else if (width >= breakpointValues.sm) {
        setBreakpoint('sm');
      } else {
        setBreakpoint('xs');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

// Usage
export const BreakpointDemo = () => {
  const breakpoint = useBreakpoint();
  
  const columns = {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
    xxl: 5,
  }[breakpoint];
  
  return <Grid columns={columns}>{/* content */}</Grid>;
};
```

## Container Query Pattern (CSS)

```tsx
import { makeStyles, tokens } from '@fluentui/react-components';

// Note: Container queries require modern browser support
const useStyles = makeStyles({
  container: {
    containerType: 'inline-size',
  },
  
  card: {
    display: 'flex',
    flexDirection: 'column',
    padding: tokens.spacingVerticalM,
    
    // Container query: switch to row layout when container is wide enough
    '@container (min-width: 400px)': {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  
  cardImage: {
    width: '100%',
    aspectRatio: '16/9',
    objectFit: 'cover',
    
    '@container (min-width: 400px)': {
      width: '200px',
      aspectRatio: '1/1',
    },
  },
});
```

## Best Practices

1. **Mobile-first** - Start with mobile styles, add complexity for larger screens
2. **Use tokens** - Always use FluentUI spacing and typography tokens
3. **Test thoroughly** - Test at all breakpoints, not just common ones
4. **Consider touch** - Larger touch targets on mobile (min 44px)
5. **Performance** - Avoid layout thrashing with expensive responsive calculations
6. **SSR considerations** - Handle server-side rendering where window is undefined
7. **Accessibility** - Ensure responsive changes don't break keyboard navigation

## Breakpoint Reference

| Breakpoint | Width | Typical Devices |
|------------|-------|-----------------|
| xs | < 640px | Mobile phones |
| sm | 640px - 767px | Large phones, small tablets |
| md | 768px - 1023px | Tablets |
| lg | 1024px - 1279px | Small laptops, large tablets |
| xl | 1280px - 1535px | Desktops |
| xxl | ≥ 1536px | Large desktops |

## Related Documentation

- [01-page-structure.md](01-page-structure.md) - App shell and page layouts
- [03-grid-patterns.md](03-grid-patterns.md) - Grid layout patterns
- [Styling with Griffel](../../01-foundation/04-styling-griffel.md)