# Form template

A controlled form with labelled fields, a submit handler, and a basic required
check. `Field` provides the label, validation message, and accessible wiring, so
you rarely need to manage `aria-*` attributes by hand.

Read `references/categories/forms.md` for shared form guidance and
`references/components/field.md` for the field API. For a complete walkthrough see
`references/recipes/forms/form-validation.md`.

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

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    maxWidth: '360px',
  },
});

export const ProfileForm = () => {
  const styles = useStyles();
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState<string | undefined>();

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(name.trim() === '' ? 'Name is required.' : undefined);
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <Field
          label="Name"
          required
          validationMessage={error}
          validationState={error ? 'error' : 'none'}
        >
          <Input
            value={name}
            onChange={(_event, data) => setName(data.value)}
          />
        </Field>
        <Button type="submit" appearance="primary">
          Save
        </Button>
      </form>
    </FluentProvider>
  );
};
```

Guidelines:

- Give every field a visible `label`; placeholders are not labels.
- Keep validation next to the field through `Field`'s `validationMessage`.
- Disable or disable-and-explain the submit button while saving.
