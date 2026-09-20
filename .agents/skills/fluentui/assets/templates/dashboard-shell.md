# Dashboard shell template

An application shell with a fixed sidebar and a scrollable content area. The
layout uses flexbox and design tokens only, so it adapts to themes and right-to-left
without extra work.

For a fuller treatment, including responsive collapse, see
`references/recipes/layout/dashboard-shell.md` and
`references/recipes/layout/responsive-layout.md`.

```tsx
import * as React from 'react';
import {
  Button,
  FluentProvider,
  makeStyles,
  tokens,
  webLightTheme,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  shell: {
    display: 'grid',
    gridTemplateColumns: '240px 1fr',
    height: '100vh',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    padding: tokens.spacingHorizontalL,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  content: {
    padding: tokens.spacingHorizontalXXL,
    overflowY: 'auto',
  },
});

export const DashboardShell = ({ children }: { children?: React.ReactNode }) => {
  const styles = useStyles();
  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.shell}>
        <nav className={styles.sidebar} aria-label="Primary">
          <Button appearance="subtle">Overview</Button>
          <Button appearance="subtle">Reports</Button>
          <Button appearance="subtle">Settings</Button>
        </nav>
        <main className={styles.content}>{children}</main>
      </div>
    </FluentProvider>
  );
};
```

Guidelines:

- Mark the navigation landmark with `aria-label`.
- Keep page-level scrolling inside the content area, not the whole document.
- Swap the buttons for `TabList` or `NavDrawer` when the navigation grows.
