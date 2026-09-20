# Minimal app template

The smallest correct FluentUI v9 application: a `FluentProvider` at the root, a
styled layout, and one `Button`. Copy this into `src/App.tsx` and render `<App />`
from your entry file.

Replace `webLightTheme` with `webDarkTheme` for the dark palette. Always keep the
provider as the outermost element so tokens and theming reach every child.

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
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalL,
  },
});

export const App = () => {
  const styles = useStyles();
  return (
    <FluentProvider theme={webLightTheme}>
      <main className={styles.root}>
        <h1>Hello FluentUI</h1>
        <Button appearance="primary">Get started</Button>
      </main>
    </FluentProvider>
  );
};
```

Next steps:

- Add routing and pages in `references/recipes/navigation/`.
- Set up themes and tokens in `references/foundation/theming.md`.
- Check any component's real props in `references/components/<component>.md`.
