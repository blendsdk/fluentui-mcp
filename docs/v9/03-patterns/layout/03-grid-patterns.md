# Grid Patterns

> **File**: 03-patterns/layout/03-grid-patterns.md
> **FluentUI Version**: 9.x

## Overview

Grid layout patterns for FluentUI v9 applications. Covers card grids, data grids, responsive grid systems, and common grid configurations.

## Auto-Fit Card Grid

```tsx
import { makeStyles, tokens, Card, CardHeader, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalM,
  },
  card: {
    height: '200px',
  },
});

interface GridItem {
  id: string;
  title: string;
  description: string;
}

interface AutoFitGridProps {
  items: GridItem[];
}

export const AutoFitCardGrid = ({ items }: AutoFitGridProps) => {
  const styles = useStyles();

  return (
    <div className={styles.grid}>
      {items.map(item => (
        <Card key={item.id} className={styles.card}>
          <CardHeader header={<Text weight="semibold">{item.title}</Text>} />
          <Text>{item.description}</Text>
        </Card>
      ))}
    </div>
  );
};
```

## Responsive Column Grid

```tsx
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  // 1 → 2 → 3 → 4 columns
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: tokens.spacingVerticalM,
    
    '@media (min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    
    '@media (min-width: 1280px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  },
});

export const ResponsiveGrid = ({ children }: { children: React.ReactNode }) => {
  const styles = useStyles();
  return <div className={styles.grid}>{children}</div>;
};
```

## Fixed Column Grids

```tsx
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  // Two columns
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: tokens.spacingVerticalM,
  },
  
  // Three columns
  threeColumn: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: tokens.spacingVerticalM,
  },
  
  // Four columns
  fourColumn: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: tokens.spacingVerticalM,
  },
  
  // Unequal columns (1/3 + 2/3)
  oneThirdTwoThirds: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: tokens.spacingHorizontalL,
  },
  
  // Sidebar + main (fixed + flex)
  sidebarMain: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: tokens.spacingHorizontalL,
  },
});
```

## Masonry-Like Grid

```tsx
import { makeStyles, tokens, Card, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  // CSS columns for masonry effect
  masonryGrid: {
    columnCount: 1,
    columnGap: tokens.spacingHorizontalM,
    
    '@media (min-width: 640px)': {
      columnCount: 2,
    },
    
    '@media (min-width: 1024px)': {
      columnCount: 3,
    },
  },
  
  masonryItem: {
    breakInside: 'avoid',
    marginBottom: tokens.spacingVerticalM,
  },
});

interface MasonryItem {
  id: string;
  title: string;
  content: string;
}

interface MasonryGridProps {
  items: MasonryItem[];
}

export const MasonryGrid = ({ items }: MasonryGridProps) => {
  const styles = useStyles();

  return (
    <div className={styles.masonryGrid}>
      {items.map(item => (
        <Card key={item.id} className={styles.masonryItem}>
          <Text weight="semibold" size={400}>{item.title}</Text>
          <Text>{item.content}</Text>
        </Card>
      ))}
    </div>
  );
};
```

## Dashboard Grid

```tsx
import { makeStyles, tokens, Card, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  dashboard: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto',
    gap: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalL,
    
    '@media (min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridTemplateRows: 'auto auto',
    },
  },
  
  // Span 2 columns on larger screens
  wideCard: {
    '@media (min-width: 1024px)': {
      gridColumn: 'span 2',
    },
  },
  
  // Span full width
  fullWidth: {
    gridColumn: '1 / -1',
  },
  
  // Span 2 rows
  tallCard: {
    '@media (min-width: 768px)': {
      gridRow: 'span 2',
    },
  },
  
  statCard: {
    padding: tokens.spacingVerticalL,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '120px',
  },
  
  statValue: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorBrandForeground1,
  },
  
  statLabel: {
    color: tokens.colorNeutralForeground3,
  },
});

interface StatCardProps {
  value: string | number;
  label: string;
  className?: string;
}

const StatCard = ({ value, label, className }: StatCardProps) => {
  const styles = useStyles();
  return (
    <Card className={`${styles.statCard} ${className || ''}`}>
      <Text className={styles.statValue}>{value}</Text>
      <Text className={styles.statLabel}>{label}</Text>
    </Card>
  );
};

export const DashboardGrid = () => {
  const styles = useStyles();

  return (
    <div className={styles.dashboard}>
      <StatCard value="1,234" label="Total Users" />
      <StatCard value="$45,678" label="Revenue" />
      <StatCard value="89%" label="Satisfaction" />
      <StatCard value="42" label="Active Projects" />
      
      <Card className={styles.wideCard}>
        <Text weight="semibold">Sales Chart</Text>
        {/* Chart component */}
      </Card>
      
      <Card className={styles.wideCard}>
        <Text weight="semibold">Recent Activity</Text>
        {/* Activity list */}
      </Card>
      
      <Card className={styles.fullWidth}>
        <Text weight="semibold">Data Table</Text>
        {/* Table component */}
      </Card>
    </div>
  );
};
```

## Photo Gallery Grid

```tsx
import { makeStyles, tokens, Image, Card } from '@fluentui/react-components';

const useStyles = makeStyles({
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: tokens.spacingVerticalS,
  },
  
  imageCard: {
    overflow: 'hidden',
    aspectRatio: '1 / 1',
    cursor: 'pointer',
    transition: 'transform 150ms ease',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

interface PhotoGalleryProps {
  images: GalleryImage[];
  onImageClick?: (image: GalleryImage) => void;
}

export const PhotoGallery = ({ images, onImageClick }: PhotoGalleryProps) => {
  const styles = useStyles();

  return (
    <div className={styles.gallery}>
      {images.map(image => (
        <Card
          key={image.id}
          className={styles.imageCard}
          onClick={() => onImageClick?.(image)}
        >
          <Image
            src={image.src}
            alt={image.alt}
            className={styles.image}
          />
        </Card>
      ))}
    </div>
  );
};
```

## Feature Grid

```tsx
import { makeStyles, tokens, Card, Text } from '@fluentui/react-components';
import type { FluentIcon } from '@fluentui/react-icons';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: tokens.spacingVerticalL,
    
    '@media (min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },
  
  featureCard: {
    padding: tokens.spacingVerticalL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  
  iconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorBrandBackground2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorBrandForeground1,
  },
  
  title: {
    fontWeight: tokens.fontWeightSemibold,
  },
  
  description: {
    color: tokens.colorNeutralForeground2,
  },
});

interface Feature {
  id: string;
  icon: FluentIcon;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: Feature[];
}

export const FeatureGrid = ({ features }: FeatureGridProps) => {
  const styles = useStyles();

  return (
    <div className={styles.grid}>
      {features.map(feature => {
        const Icon = feature.icon;
        return (
          <Card key={feature.id} className={styles.featureCard}>
            <div className={styles.iconWrapper}>
              <Icon fontSize={24} />
            </div>
            <Text className={styles.title} size={400}>
              {feature.title}
            </Text>
            <Text className={styles.description}>
              {feature.description}
            </Text>
          </Card>
        );
      })}
    </div>
  );
};
```

## Pricing Grid

```tsx
import { makeStyles, tokens, Card, Text, Button, Badge } from '@fluentui/react-components';
import { CheckmarkRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: tokens.spacingVerticalL,
    maxWidth: '1000px',
    margin: '0 auto',
    
    '@media (min-width: 768px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      alignItems: 'start',
    },
  },
  
  card: {
    padding: tokens.spacingVerticalXL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  
  featured: {
    border: `2px solid ${tokens.colorBrandStroke1}`,
    position: 'relative',
  },
  
  featuredBadge: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  
  header: {
    textAlign: 'center',
  },
  
  planName: {
    fontWeight: tokens.fontWeightSemibold,
  },
  
  price: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  
  priceValue: {
    fontSize: tokens.fontSizeHero900,
    fontWeight: tokens.fontWeightBold,
  },
  
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  
  checkIcon: {
    color: tokens.colorPaletteGreenForeground1,
  },
});

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  featured?: boolean;
}

interface PricingGridProps {
  plans: PricingPlan[];
}

export const PricingGrid = ({ plans }: PricingGridProps) => {
  const styles = useStyles();

  return (
    <div className={styles.grid}>
      {plans.map(plan => (
        <Card
          key={plan.id}
          className={`${styles.card} ${plan.featured ? styles.featured : ''}`}
        >
          {plan.featured && (
            <Badge
              appearance="filled"
              color="brand"
              className={styles.featuredBadge}
            >
              Most Popular
            </Badge>
          )}
          
          <div className={styles.header}>
            <Text className={styles.planName} size={500}>
              {plan.name}
            </Text>
            <div className={styles.price}>
              <Text className={styles.priceValue}>${plan.price}</Text>
              <Text>/{plan.period}</Text>
            </div>
          </div>
          
          <div className={styles.features}>
            {plan.features.map((feature, index) => (
              <div key={index} className={styles.feature}>
                <CheckmarkRegular className={styles.checkIcon} />
                <Text>{feature}</Text>
              </div>
            ))}
          </div>
          
          <Button appearance={plan.featured ? 'primary' : 'secondary'}>
            Get Started
          </Button>
        </Card>
      ))}
    </div>
  );
};
```

## Form Grid

```tsx
import { makeStyles, tokens, Field, Input, Select } from '@fluentui/react-components';

const useStyles = makeStyles({
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: tokens.spacingVerticalM,
    
    '@media (min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
  
  // Full width field
  fullWidth: {
    gridColumn: '1 / -1',
  },
  
  // Three columns on desktop
  threeColForm: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: tokens.spacingVerticalM,
    
    '@media (min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },
});

export const FormGrid = () => {
  const styles = useStyles();

  return (
    <div className={styles.form}>
      <Field label="First Name">
        <Input />
      </Field>
      
      <Field label="Last Name">
        <Input />
      </Field>
      
      <Field label="Email" className={styles.fullWidth}>
        <Input type="email" />
      </Field>
      
      <Field label="City">
        <Input />
      </Field>
      
      <Field label="Country">
        <Select>
          <option>Select country</option>
          <option>USA</option>
          <option>Canada</option>
        </Select>
      </Field>
      
      <Field label="Notes" className={styles.fullWidth}>
        <Input />
      </Field>
    </div>
  );
};
```

## Responsive Grid Hook

```tsx
import { useMemo } from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6;

interface ResponsiveGridConfig {
  xs?: GridColumns;
  sm?: GridColumns;
  md?: GridColumns;
  lg?: GridColumns;
  xl?: GridColumns;
  gap?: 'small' | 'medium' | 'large';
}

const gapMap = {
  small: tokens.spacingVerticalS,
  medium: tokens.spacingVerticalM,
  large: tokens.spacingVerticalL,
};

const useStyles = makeStyles({
  grid: {
    display: 'grid',
  },
});

/**
 * Hook to generate responsive grid styles
 */
export function useResponsiveGrid(config: ResponsiveGridConfig) {
  const baseStyles = useStyles();
  const gap = gapMap[config.gap || 'medium'];
  
  const gridStyle = useMemo(() => ({
    gridTemplateColumns: `repeat(${config.xs || 1}, 1fr)`,
    gap,
  }), [config.xs, gap]);

  // For dynamic responsive behavior, you'd typically use CSS
  // This is a simplified example showing the concept
  return {
    className: baseStyles.grid,
    style: gridStyle,
  };
}
```

## Grid Gap Utilities

```tsx
import { makeStyles, tokens } from '@fluentui/react-components';

const useGapStyles = makeStyles({
  gapXs: { gap: tokens.spacingVerticalXS },
  gapS: { gap: tokens.spacingVerticalS },
  gapM: { gap: tokens.spacingVerticalM },
  gapL: { gap: tokens.spacingVerticalL },
  gapXl: { gap: tokens.spacingVerticalXL },
  gapXxl: { gap: tokens.spacingVerticalXXL },
});

// Usage with mergeClasses
const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
});

export const GridWithGap = () => {
  const styles = useStyles();
  const gapStyles = useGapStyles();
  
  return (
    <div className={`${styles.grid} ${gapStyles.gapL}`}>
      {/* Grid items */}
    </div>
  );
};
```

## Best Practices

1. **Use auto-fit for dynamic grids** - `auto-fit` adapts to available space
2. **Set minimum column widths** - Use `minmax(min, max)` for responsive grids
3. **Use tokens for gaps** - Consistent spacing with FluentUI design system
4. **Consider mobile first** - Start with single column, add columns at breakpoints
5. **Test edge cases** - Single item, odd numbers, many items
6. **Performance** - Avoid excessive re-renders with grid calculations

## Grid Template Reference

| Pattern | CSS |
|---------|-----|
| Auto-fit | `repeat(auto-fit, minmax(250px, 1fr))` |
| Auto-fill | `repeat(auto-fill, minmax(200px, 1fr))` |
| Equal columns | `repeat(N, 1fr)` |
| Sidebar + main | `280px 1fr` |
| 1/3 + 2/3 | `1fr 2fr` |

## Related Documentation

- [01-page-structure.md](01-page-structure.md) - Page layouts
- [02-responsive-design.md](02-responsive-design.md) - Responsive patterns
- [04-common-layouts.md](04-common-layouts.md) - Common layout templates
- [Card Component](../../02-components/layout/card.md)