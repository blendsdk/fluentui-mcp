# Empty States Pattern

> **File**: 03-patterns/data/02-empty-states.md
> **FluentUI Version**: 9.x

## Overview

Empty state patterns for FluentUI v9 applications. Includes patterns for no data, no results, first-time users, and error states with clear calls-to-action.

## Basic Empty State

```tsx
import { makeStyles, tokens, Text, Button } from '@fluentui/react-components';
import { DocumentRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacingVerticalXXL,
    textAlign: 'center',
    minHeight: '300px',
  },
  icon: {
    fontSize: '64px',
    color: tokens.colorNeutralForeground3,
    marginBottom: tokens.spacingVerticalL,
  },
  title: {
    marginBottom: tokens.spacingVerticalS,
  },
  description: {
    color: tokens.colorNeutralForeground3,
    maxWidth: '400px',
    marginBottom: tokens.spacingVerticalL,
  },
});

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({
  icon = <DocumentRegular />,
  title,
  description,
  action,
}: EmptyStateProps) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <Text as="h2" size={600} weight="semibold" className={styles.title}>
        {title}
      </Text>
      {description && (
        <Text className={styles.description}>{description}</Text>
      )}
      {action && (
        <Button appearance="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};
```

## No Data Empty State

```tsx
import { makeStyles, tokens, Text, Button } from '@fluentui/react-components';
import { FolderOpenRegular, AddRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: tokens.spacingVerticalXXL,
    textAlign: 'center',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusLarge,
    border: `2px dashed ${tokens.colorNeutralStroke2}`,
  },
  icon: {
    fontSize: '48px',
    color: tokens.colorNeutralForeground3,
    marginBottom: tokens.spacingVerticalM,
  },
  description: {
    color: tokens.colorNeutralForeground3,
    marginBottom: tokens.spacingVerticalL,
  },
});

interface NoDataEmptyStateProps {
  entityName: string;
  onAdd?: () => void;
}

export const NoDataEmptyState = ({ entityName, onAdd }: NoDataEmptyStateProps) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <FolderOpenRegular className={styles.icon} />
      <Text size={500} weight="semibold">
        No {entityName} yet
      </Text>
      <Text className={styles.description}>
        Get started by creating your first {entityName.toLowerCase()}.
      </Text>
      {onAdd && (
        <Button appearance="primary" icon={<AddRegular />} onClick={onAdd}>
          Create {entityName}
        </Button>
      )}
    </div>
  );
};
```

## Search No Results

```tsx
import { makeStyles, tokens, Text, Button } from '@fluentui/react-components';
import { SearchRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: tokens.spacingVerticalXXL,
    textAlign: 'center',
  },
  icon: {
    fontSize: '48px',
    color: tokens.colorNeutralForeground3,
    marginBottom: tokens.spacingVerticalM,
  },
  searchTerm: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
  },
  suggestions: {
    marginTop: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    textAlign: 'left',
  },
  suggestionsList: {
    margin: 0,
    paddingLeft: tokens.spacingHorizontalL,
    color: tokens.colorNeutralForeground2,
  },
});

interface SearchNoResultsProps {
  searchTerm: string;
  onClear?: () => void;
  suggestions?: string[];
}

export const SearchNoResults = ({
  searchTerm,
  onClear,
  suggestions = [
    'Check your spelling',
    'Try different keywords',
    'Use more general terms',
  ],
}: SearchNoResultsProps) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <SearchRegular className={styles.icon} />
      <Text size={500} weight="semibold">
        No results found
      </Text>
      <Text style={{ color: tokens.colorNeutralForeground3 }}>
        No results found for "<span className={styles.searchTerm}>{searchTerm}</span>"
      </Text>
      
      <div className={styles.suggestions}>
        <Text weight="semibold" size={300}>Suggestions:</Text>
        <ul className={styles.suggestionsList}>
          {suggestions.map((suggestion, index) => (
            <li key={index}><Text size={300}>{suggestion}</Text></li>
          ))}
        </ul>
      </div>
      
      {onClear && (
        <Button
          appearance="subtle"
          onClick={onClear}
          style={{ marginTop: tokens.spacingVerticalM }}
        >
          Clear search
        </Button>
      )}
    </div>
  );
};
```

## Filter No Results

```tsx
import { makeStyles, tokens, Text, Button } from '@fluentui/react-components';
import { FilterRegular, FilterDismissRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: tokens.spacingVerticalXXL,
    textAlign: 'center',
  },
  icon: {
    fontSize: '48px',
    color: tokens.colorNeutralForeground3,
    marginBottom: tokens.spacingVerticalM,
  },
  activeFilters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
    justifyContent: 'center',
    marginTop: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalL,
  },
  filterBadge: {
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase200,
  },
});

interface FilterNoResultsProps {
  activeFilters?: string[];
  onClearFilters: () => void;
}

export const FilterNoResults = ({
  activeFilters = [],
  onClearFilters,
}: FilterNoResultsProps) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <FilterRegular className={styles.icon} />
      <Text size={500} weight="semibold">
        No matching results
      </Text>
      <Text style={{ color: tokens.colorNeutralForeground3 }}>
        Try adjusting your filters to see more results.
      </Text>
      
      {activeFilters.length > 0 && (
        <div className={styles.activeFilters}>
          {activeFilters.map((filter, index) => (
            <span key={index} className={styles.filterBadge}>
              {filter}
            </span>
          ))}
        </div>
      )}
      
      <Button
        appearance="primary"
        icon={<FilterDismissRegular />}
        onClick={onClearFilters}
      >
        Clear all filters
      </Button>
    </div>
  );
};
```

## First Time User / Welcome

```tsx
import { makeStyles, tokens, Text, Button, Card } from '@fluentui/react-components';
import {
  DocumentRegular,
  PeopleRegular,
  SettingsRegular,
  ArrowRightRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: tokens.spacingVerticalXXL,
    textAlign: 'center',
  },
  welcome: {
    marginBottom: tokens.spacingVerticalXL,
  },
  steps: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: tokens.spacingVerticalM,
    width: '100%',
    maxWidth: '600px',
    
    '@media (min-width: 640px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },
  stepCard: {
    padding: tokens.spacingVerticalL,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 150ms ease',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  },
  stepIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: tokens.spacingVerticalM,
    fontSize: '24px',
  },
  stepNumber: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
});

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

interface WelcomeEmptyStateProps {
  userName?: string;
  steps: Step[];
}

export const WelcomeEmptyState = ({ userName, steps }: WelcomeEmptyStateProps) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.welcome}>
        <Text as="h1" size={800} weight="semibold">
          {userName ? `Welcome, ${userName}!` : 'Welcome!'}
        </Text>
        <Text block style={{ color: tokens.colorNeutralForeground3, marginTop: tokens.spacingVerticalS }}>
          Get started by completing these quick steps.
        </Text>
      </div>
      
      <div className={styles.steps}>
        {steps.map((step, index) => (
          <Card key={index} className={styles.stepCard} onClick={step.onClick}>
            <div className={styles.stepIcon} style={{ position: 'relative' }}>
              {step.icon}
              <span className={styles.stepNumber}>{index + 1}</span>
            </div>
            <Text weight="semibold" block>{step.title}</Text>
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
              {step.description}
            </Text>
          </Card>
        ))}
      </div>
    </div>
  );
};
```

## Permission Denied

```tsx
import { makeStyles, tokens, Text, Button } from '@fluentui/react-components';
import { LockClosedRegular, ArrowLeftRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: tokens.spacingVerticalXXL,
    textAlign: 'center',
  },
  icon: {
    fontSize: '64px',
    color: tokens.colorPaletteRedForeground1,
    marginBottom: tokens.spacingVerticalL,
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalL,
  },
});

interface PermissionDeniedProps {
  onGoBack?: () => void;
  onRequestAccess?: () => void;
}

export const PermissionDenied = ({
  onGoBack,
  onRequestAccess,
}: PermissionDeniedProps) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <LockClosedRegular className={styles.icon} />
      <Text as="h2" size={600} weight="semibold">
        Access Denied
      </Text>
      <Text style={{ color: tokens.colorNeutralForeground3, maxWidth: '400px' }}>
        You don't have permission to view this content. Please contact your
        administrator if you believe this is an error.
      </Text>
      
      <div className={styles.actions}>
        {onGoBack && (
          <Button appearance="secondary" icon={<ArrowLeftRegular />} onClick={onGoBack}>
            Go Back
          </Button>
        )}
        {onRequestAccess && (
          <Button appearance="primary" onClick={onRequestAccess}>
            Request Access
          </Button>
        )}
      </div>
    </div>
  );
};
```

## Offline State

```tsx
import { makeStyles, tokens, Text, Button } from '@fluentui/react-components';
import { CloudOffRegular, ArrowSyncRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: tokens.spacingVerticalXXL,
    textAlign: 'center',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusLarge,
  },
  icon: {
    fontSize: '48px',
    color: tokens.colorNeutralForeground3,
    marginBottom: tokens.spacingVerticalM,
  },
});

interface OfflineStateProps {
  onRetry: () => void;
}

export const OfflineState = ({ onRetry }: OfflineStateProps) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <CloudOffRegular className={styles.icon} />
      <Text size={500} weight="semibold">
        You're offline
      </Text>
      <Text style={{ color: tokens.colorNeutralForeground3, marginBottom: tokens.spacingVerticalL }}>
        Check your internet connection and try again.
      </Text>
      <Button appearance="primary" icon={<ArrowSyncRegular />} onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
};
```

## Reusable Empty State Factory

```tsx
import { makeStyles, tokens, Text, Button } from '@fluentui/react-components';
import type { FluentIcon } from '@fluentui/react-icons';

// Pre-configured empty states for common scenarios
export const emptyStateConfigs = {
  noDocuments: {
    icon: 'DocumentRegular',
    title: 'No documents',
    description: 'Create your first document to get started.',
    actionLabel: 'Create Document',
  },
  noUsers: {
    icon: 'PeopleRegular',
    title: 'No users',
    description: 'Invite team members to collaborate.',
    actionLabel: 'Invite Users',
  },
  noMessages: {
    icon: 'ChatRegular',
    title: 'No messages',
    description: 'Start a conversation.',
    actionLabel: 'New Message',
  },
  noNotifications: {
    icon: 'AlertRegular',
    title: 'No notifications',
    description: "You're all caught up!",
  },
} as const;

type EmptyStateType = keyof typeof emptyStateConfigs;

// Usage helper
export const getEmptyStateConfig = (type: EmptyStateType) => emptyStateConfigs[type];
```

## Best Practices

1. **Use relevant icons** - Icons should represent the content type
2. **Clear messaging** - Explain what's missing and why
3. **Actionable CTAs** - Give users a way to add content
4. **Maintain context** - Users should know where they are
5. **Avoid blame** - Don't make users feel like they did something wrong
6. **Be helpful** - Provide suggestions for search/filter empty states
7. **Consider illustrations** - Use custom illustrations for important empty states

## Related Documentation

- [01-loading-states.md](01-loading-states.md) - Loading patterns
- [03-error-handling.md](03-error-handling.md) - Error handling patterns
- [MessageBar Component](../../02-components/feedback/messagebar.md)