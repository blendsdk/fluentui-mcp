# Admin CRUD template

A list-and-edit screen skeleton: a table region, a primary "Create" action, and
an edit form shown beside the list. This is a starting point — fill in the data
fetching and mutations for your backend.

For a production-grade table, read `references/recipes/data/data-table.md` and
the `DataGrid` component page. For dialogs, see
`references/recipes/modals/form-dialog.md`.

```tsx
import * as React from 'react';
import {
  Button,
  Field,
  FluentProvider,
  Input,
  makeStyles,
  tokens,
  webLightTheme,
} from '@fluentui/react-components';

interface Item {
  id: string;
  name: string;
}

const useStyles = makeStyles({
  page: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM, maxWidth: '360px' },
  list: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS },
});

export const AdminCrud = () => {
  const styles = useStyles();
  const [items, setItems] = React.useState<Item[]>([]);
  const [draft, setDraft] = React.useState('');

  const create = () => {
    if (draft.trim() === '') {
      return;
    }
    setItems((previous) => [
      ...previous,
      { id: crypto.randomUUID(), name: draft.trim() },
    ]);
    setDraft('');
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <section className={styles.page}>
        <div className={styles.toolbar}>
          <h1>Items</h1>
          <Button appearance="primary" onClick={create}>
            Create
          </Button>
        </div>

        <div className={styles.form}>
          <Field label="Name">
            <Input
              value={draft}
              onChange={(_event, data) => setDraft(data.value)}
            />
          </Field>
        </div>

        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </section>
    </FluentProvider>
  );
};
```

Guidelines:

- Keep one source of truth for the list; re-fetch or update it after a mutation.
- Show loading and empty states with `Spinner` and `MessageBar`.
- Confirm destructive actions with a dialog instead of a bare button.
