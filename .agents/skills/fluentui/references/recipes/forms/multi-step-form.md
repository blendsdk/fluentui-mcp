# Multi-Step Form

> **Group**: forms

## Goal

Build a wizard-style multi-step form with FluentUI React v9: one controlled values object shared by every step, per-step validation that gates Next, a review step, a single submit that re-validates everything, and progress/focus/announcement handling.

## When to Use

Use this recipe for onboarding or signup flows, checkout funnels (address, delivery, payment, review), configuration wizards, or any form with roughly 8 or more fields where later steps depend on earlier answers. It is also the right choice when you want to validate one small chunk at a time, show a completion indicator, and keep a clean Back path so users never lose data.

## When Not to Use

Do not use it for short forms (2-5 fields) - a single Form with Field and one Button submits faster than three clicks through a wizard. Avoid it when users must jump freely between sections or compare them, which is better served by Tabs or by an Accordion (multiple, collapsible). Avoid it for conditional disclosure of a few options inside one screen; that is a Switch or Checkbox plus conditional rendering. And avoid it inside a Dialog unless the flow truly has 2-3 steps, because a modal wizard hides the page behind it and complicates Back-button behavior.

A multi-step form (wizard) turns one large submission into a short sequence of validated steps. Users see only a handful of fields at a time, the app decides when they may advance, and the network is touched exactly once - on the final submit.

## The state model

Three pieces of state run the whole wizard:

| State | Type | Purpose |
| --- | --- | --- |
| `values` | `FormValues` | Every field from every step, in one controlled object |
| `errors` | `Partial<Record<keyof FormValues, string>>` | Messages keyed by **field**, not by step |
| `stepIndex` | `number` | Which step renders, which slides the ProgressBar bar |

Three rules make it work:

1. **One values object.** Every Input, Select, Textarea, Checkbox and Switch in every step is controlled by `values`. Steps can mount and unmount freely without losing data.
2. **Errors keyed by field.** A single map means the review step and the final submit can surface a message for any field, including ones that are no longer on screen.
3. **Validate on transition, not on every keystroke.** Validate when the user tries to leave a step or submits; clear the message for a field the moment its value changes.

## 1. Describe the steps as data

```ts
type StepId = 'profile' | 'preferences' | 'review';

type StepDefinition = {
  id: StepId;
  title: string;
  description: string;
};

const STEPS: StepDefinition[] = [
  { id: 'profile', title: 'Your profile', description: 'Tell us who is creating the workspace.' },
  { id: 'preferences', title: 'Workspace preferences', description: 'Pick a plan and decide how the workspace behaves.' },
  { id: 'review', title: 'Review and confirm', description: 'Check the values below, then create the workspace.' },
];
```

The step list is the single source of truth for the headings, the `ProgressBar` bar, the `Badge` counter, and the order of validation. Adding a step means adding one entry plus one block of JSX - nothing else changes.

## 2. Write one validation function with a step switch

```ts
function validateStep(stepId: StepId, values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (stepId === 'profile') {
    if (!values.firstName.trim()) errors.firstName = 'Enter your first name.';
    // ...email, last name
  }
  if (stepId === 'preferences' && !values.plan) {
    errors.plan = 'Choose a plan to continue.';
  }
  if (stepId === 'review' && !values.agreed) {
    errors.agreed = 'You must accept the terms of service.';
  }
  return errors;
}
```

Because each step owns a disjoint set of field keys, the results can be merged with `Object.assign` when the whole form must be checked.

## 3. Gate every transition

- **Next** validates the current step only. On failure, store the errors and stay on the step.
- **Back** never validates. Going back must always be free.
- **Submit** validates *every* step, merges the results, and moves the user to the first invalid step. This catches the classic case where the user fills step 1, walks to the review step, and then clears a field.

```ts
const goNext = () => {
  const stepErrors = validateStep(step.id, values);
  if (Object.keys(stepErrors).length > 0) {
    setErrors(stepErrors);
    return;
  }
  setErrors({});
  setStepIndex(index => Math.min(index + 1, STEPS.length - 1));
};
```

Pair that with a single `updateField` helper that patches values *and* drops the error for the patched keys, so a message disappears as soon as the user fixes it.

## 4. Build the chrome: Card, Text, Badge, ProgressBar, Divider

```tsx
<Card appearance='outline' style={{ padding: 24 }}>
  <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <Text size={500} weight='semibold'>Create your workspace</Text>
      <Badge appearance='tint' color='brand'>{`Step ${stepIndex + 1} of ${STEPS.length}`}</Badge>
    </div>
    <ProgressBar value={stepIndex + 1} max={STEPS.length} aria-label={`Step ${stepIndex + 1} of ${STEPS.length}`} />
    {/* fields */}
    <Divider />
    {/* footer with Back / Next / Submit */}
  </form>
</Card>
```

`ProgressBar` is 0..1 by default, so always pass `max={STEPS.length}` together with the 1-based `value`. Always render the numeric step counter as text as well - color and bar length alone are not a text alternative.

## 5. Lay out fields with Field

`Field` owns the label, the required marker, the hint, the validation message, and the `aria-describedby` wiring between them and the control. Use exactly one `Field` per control and never pass a validation state without a message.

```tsx
<Field
  label='Work email'
  required
  hint='We will send the activation link here.'
  validationState={errors.email ? 'error' : 'none'}
  validationMessage={errors.email}
>
  <Input type='email' value={values.email} onChange={(_, data) => updateField({ email: data.value })} />
</Field>
```

`Select` renders a native select element, so its options are plain `<option>` children. `Checkbox` and `Switch` take a `label` prop. A `Field` can wrap a `Checkbox` with no label at all when you only need the validation message underneath (the terms-of-service checkbox on the review step).

## 6. Make the review step earn its place

A review step is worth it when the flow has a destructive or expensive action at the end (creating an account, charging a card). Render the collected values as simple label/value rows so users can scan them, then ask for the final confirmation inside the same step:

```tsx
const ReviewRow = (props: { label: string; value: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
    <Text size={200}>{props.label}</Text>
    <Text size={200} weight='semibold'>{props.value}</Text>
  </div>
);
```

Do **not** make each summary row a link back to its step unless you also implement `goTo(index)`; a plain summary plus a working Back button is enough.

## 7. Own the submit lifecycle

- Disable the primary `Button` with `disabled={submitting}` **and** return early inside the handler, so a double click cannot fire two requests.
- Show an inline `Spinner` with a `label` and `labelPosition='after'` next to the button - do not replace the button label with so the button keeps its accessible name.
- On failure render `MessageBar intent='error' politeness='assertive'` above the footer and keep the values untouched so the user can retry.
- On success swap the whole form for a confirmation panel inside the same `Card`, and offer a reset action.

## 8. Extract the logic for the second wizard

Copy-pasting the transition handlers into a second flow is where bugs start. Example 2 shows a reusable `useWizard` hook (stepIndex, errors, goNext, goBack, goTo, validateAll) plus a `StepIndicator` built from `Text`, `Badge` and `ProgressBar` that any form can drop in.

## 9. Async validation inside a step

Some fields can only be validated by the server (is this email already registered?). Example 3 shows the pattern: keep a request counter in a `useRef`, ignore responses that are no longer the latest, show `checking` state through the `contentAfter` slot of `Input` with a small `Spinner`, and map the result onto the `Field` as `validationState='error'` or `'success'`. Gate the step button on the resolved result rather than on optimistic state.

## Accessibility checklist

- Wrap each step's fields in `role='group'` with `aria-labelledby` pointing at the step heading.
- Move focus to the step heading on every step change (see example 1) and make it focusable with `tabIndex={-1}`.
- Give every control a `Field` label; never rely on `placeholder` as the only label.
- Announce submit failures assertively; keep per-field messages polite and attached to their control.
- Use `noValidate` on the `<form>` so the browser and Fluent validation do not fight.
- Set `type='button'` on Back and Next - only the final button should be `type='submit'`.

## Examples

### Three-step workspace creation form

A complete wizard with a profile step, a preferences step, and a review step. Demonstrates per-step validation, clearing errors on change, a Progress/Badge header, focus management on step change, submit-time re-validation that jumps to the first invalid step, and the submitting/submitted lifecycle with Spinner and MessageBar.

```tsx
import * as React from 'react';
import { Badge, Button, Card, Checkbox, Divider, Field, Input, MessageBar, ProgressBar, Select, Spinner, Switch, Text, Textarea } from '@fluentui/react-components';

/* ---------------------------------- model ---------------------------------- */

type StepId = 'profile' | 'preferences' | 'review';

type StepDefinition = {
  id: StepId;
  title: string;
  description: string;
};

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  plan: string;
  notes: string;
  newsletter: boolean;
  twoFactor: boolean;
  agreed: boolean;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const STEPS: StepDefinition[] = [
  { id: 'profile', title: 'Your profile', description: 'Tell us who is creating the workspace.' },
  { id: 'preferences', title: 'Workspace preferences', description: 'Pick a plan and decide how the workspace behaves.' },
  { id: 'review', title: 'Review and confirm', description: 'Check the values below, then create the workspace.' },
];

const INITIAL_VALUES: FormValues = {
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  plan: 'team',
  notes: '',
  newsletter: true,
  twoFactor: false,
  agreed: false,
};

const PLAN_LABELS: Record<string, string> = {
  free: 'Free (1 project)',
  team: 'Team (10 projects)',
  enterprise: 'Enterprise (unlimited projects)',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validates one step. Steps own disjoint fields, so results can be merged safely. */
function validateStep(stepId: StepId, values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (stepId === 'profile') {
    if (!values.firstName.trim()) {
      errors.firstName = 'Enter your first name.';
    }
    if (!values.lastName.trim()) {
      errors.lastName = 'Enter your last name.';
    }
    if (!values.email.trim()) {
      errors.email = 'Enter your work email.';
    } else if (!EMAIL_PATTERN.test(values.email.trim())) {
      errors.email = 'Enter a valid email address, for example ada@company.com.';
    }
  }

  if (stepId === 'preferences' && !values.plan) {
    errors.plan = 'Choose a plan to continue.';
  }

  if (stepId === 'review' && !values.agreed) {
    errors.agreed = 'You must accept the terms of service.';
  }

  return errors;
}

/** Stand-in for the real API. Emails containing fail reject, so the error path is easy to demo. */
function createWorkspace(values: FormValues): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    window.setTimeout(() => {
      if (values.email.toLowerCase().includes('fail')) {
        reject(new Error('We could not create the workspace. Please try again.'));
      } else {
        resolve();
      }
    }, 900);
  });
}

/* --------------------------------- helpers --------------------------------- */

const ReviewRow = (props: { label: string; value: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
    <Text size={200}>{props.label}</Text>
    <Text size={200} weight='semibold'>{props.value}</Text>
  </div>
);

type WizardStatus = 'editing' | 'submitting' | 'submitted';

/* -------------------------------- component -------------------------------- */

export const MultiStepForm = () => {
  const [values, setValues] = React.useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [stepIndex, setStepIndex] = React.useState(0);
  const [status, setStatus] = React.useState<WizardStatus>('editing');
  const [submitError, setSubmitError] = React.useState<string | undefined>(undefined);

  const step = STEPS[stepIndex];
  const headingId = `wizard-heading-${step.id}`;
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const isFirstRender = React.useRef(true);

  // Move focus to the new step heading so keyboard and screen reader users hear the change.
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [stepIndex]);

  /** Patches values and clears the error of every patched field. */
  const updateField = (patch: Partial<FormValues>) => {
    setValues(previous => ({ ...previous, ...patch }));
    setErrors(previous => {
      if (!Object.keys(patch).some(key => key in previous)) {
        return previous;
      }
      const next = { ...previous };
      Object.keys(patch).forEach(key => {
        delete next[key as keyof FormValues];
      });
      return next;
    });
  };

  const goNext = () => {
    const stepErrors = validateStep(step.id, values);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setSubmitError(undefined);
    setStepIndex(index => Math.min(index + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setErrors({});
    setSubmitError(undefined);
    setStepIndex(index => Math.max(index - 1, 0));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Re-validate every step: the user can reach the review step, go back, and empty a field.
    const allErrors: FormErrors = {};
    let firstInvalidStep = -1;

    STEPS.forEach((candidate, index) => {
      const stepErrors = validateStep(candidate.id, values);
      if (firstInvalidStep === -1 && Object.keys(stepErrors).length > 0) {
        firstInvalidStep = index;
      }
      Object.assign(allErrors, stepErrors);
    });

    if (firstInvalidStep !== -1) {
      setErrors(allErrors);
      setStepIndex(firstInvalidStep);
      setSubmitError('Some fields need attention before the workspace can be created.');
      return;
    }

    setErrors({});
    setSubmitError(undefined);
    setStatus('submitting');

    try {
      await createWorkspace(values);
      setStatus('submitted');
    } catch (error) {
      setStatus('editing');
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  const reset = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setStepIndex(0);
    setStatus('editing');
    setSubmitError(undefined);
  };

  const submitting = status === 'submitting';
  const errorMessages = Object.values(errors).filter((message): message is string => Boolean(message));
  const planLabel = PLAN_LABELS[values.plan] ?? values.plan;

  if (status === 'submitted') {
    return (
      <Card appearance='outline' style={{ maxWidth: 640, margin: '0 auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={{ margin: 0 }}>
          <Text size={500} weight='semibold'>Workspace created</Text>
        </h2>
        <Text>
          {`We sent a confirmation to ${values.email}. The ${planLabel} plan is ready to use.`}
        </Text>
        <Divider />
        <div>
          <Button appearance='primary' onClick={reset}>Create another workspace</Button>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <Card appearance='outline' style={{ padding: 24 }}>
        <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <header style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <Text size={500} weight='semibold'>Create your workspace</Text>
              <Badge appearance='tint' color='brand' size='medium' shape='rounded'>
                {`Step ${stepIndex + 1} of ${STEPS.length}`}
              </Badge>
            </div>
            <ProgressBar value={stepIndex + 1} max={STEPS.length} aria-label={`Step ${stepIndex + 1} of ${STEPS.length}`} />
          </header>

          <div role='group' aria-labelledby={headingId} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <h3 id={headingId} ref={headingRef} tabIndex={-1} style={{ margin: 0 }}>
                <Text size={400} weight='semibold'>{step.title}</Text>
              </h3>
              <Text size={200}>{step.description}</Text>
            </div>

            {errorMessages.length > 0 && (
              <MessageBar intent='error' politeness='assertive'>
                {`Please fix ${errorMessages.length} ${errorMessages.length === 1 ? 'field' : 'fields'} before continuing. ${errorMessages[0]}`}
              </MessageBar>
            )}

            {step.id === 'profile' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field
                    label='First name'
                    required
                    validationState={errors.firstName ? 'error' : 'none'}
                    validationMessage={errors.firstName}
                  >
                    <Input
                      value={values.firstName}
                      onChange={(_, data) => updateField({ firstName: data.value })}
                      placeholder='Ada'
                    />
                  </Field>
                  <Field
                    label='Last name'
                    required
                    validationState={errors.lastName ? 'error' : 'none'}
                    validationMessage={errors.lastName}
                  >
                    <Input
                      value={values.lastName}
                      onChange={(_, data) => updateField({ lastName: data.value })}
                      placeholder='Lovelace'
                    />
                  </Field>
                </div>
                <Field
                  label='Work email'
                  required
                  hint='We will send the activation link here.'
                  validationState={errors.email ? 'error' : 'none'}
                  validationMessage={errors.email}
                >
                  <Input
                    type='email'
                    value={values.email}
                    onChange={(_, data) => updateField({ email: data.value })}
                    placeholder='ada@company.com'
                  />
                </Field>
                <Field label='Company' hint='Optional'>
                  <Input
                    value={values.company}
                    onChange={(_, data) => updateField({ company: data.value })}
                  />
                </Field>
              </>
            )}

            {step.id === 'preferences' && (
              <>
                <Field
                  label='Plan'
                  required
                  validationState={errors.plan ? 'error' : 'none'}
                  validationMessage={errors.plan}
                >
                  <Select value={values.plan} onChange={(_, data) => updateField({ plan: data.value })}>
                    <option value='free'>Free - 1 project</option>
                    <option value='team'>Team - 10 projects</option>
                    <option value='enterprise'>Enterprise - unlimited projects</option>
                  </Select>
                </Field>
                <Field label='Anything we should know?' hint='Optional'>
                  <Textarea
                    value={values.notes}
                    onChange={(_, data) => updateField({ notes: data.value })}
                    resize='vertical'
                  />
                </Field>
                <Checkbox
                  label='Email me product updates'
                  checked={values.newsletter}
                  onChange={(_, data) => updateField({ newsletter: data.checked === true })}
                />
                <Switch
                  label='Require two-factor authentication for every member'
                  checked={values.twoFactor}
                  onChange={(_, data) => updateField({ twoFactor: data.checked })}
                />
              </>
            )}

            {step.id === 'review' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Text size={300} weight='semibold'>Account</Text>
                  <Divider />
                  <ReviewRow label='Name' value={`${values.firstName} ${values.lastName}`.trim() || 'Not provided'} />
                  <ReviewRow label='Email' value={values.email || 'Not provided'} />
                  <ReviewRow label='Company' value={values.company || 'Not provided'} />
                  <Text size={300} weight='semibold'>Workspace</Text>
                  <Divider />
                  <ReviewRow label='Plan' value={planLabel} />
                  <ReviewRow label='Product updates' value={values.newsletter ? 'On' : 'Off'} />
                  <ReviewRow label='Two-factor authentication' value={values.twoFactor ? 'Required' : 'Optional'} />
                  <ReviewRow label='Notes' value={values.notes || 'None'} />
                </div>
                <Field
                  validationState={errors.agreed ? 'error' : 'none'}
                  validationMessage={errors.agreed}
                >
                  <Checkbox
                    label='I agree to the terms of service'
                    checked={values.agreed}
                    onChange={(_, data) => updateField({ agreed: data.checked === true })}
                  />
                </Field>
              </>
            )}
          </div>

          {submitError && (
            <MessageBar intent='error' politeness='assertive'>{submitError}</MessageBar>
          )}

          <Divider />

          <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <Button
              type='button'
              appearance='secondary'
              onClick={goBack}
              disabled={stepIndex === 0 || submitting}
            >
              Back
            </Button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {submitting && <Spinner size='tiny' label='Creating workspace' labelPosition='after' />}
              {stepIndex < STEPS.length - 1 ? (
                <Button type='button' appearance='primary' onClick={goNext}>
                  Next
                </Button>
              ) : (
                <Button type='submit' appearance='primary' disabled={submitting}>
                  Create workspace
                </Button>
              )}
            </div>
          </footer>
        </form>
      </Card>
    </div>
  );
};
```

### Reusable useWizard hook plus a StepIndicator

Extracts the wizard mechanics into a generic useWizard hook (stepIndex, field-keyed errors, goNext/goBack/goTo/validateAll) and a StepIndicator built from Text, Badge and Progress, then uses both in a compact three-step contact form with Select, Textarea, Checkbox and MessageBar.

```tsx
import * as React from 'react';
import { Badge, Button, Card, Checkbox, Divider, Field, Input, MessageBar, ProgressBar, Select, Text, Textarea } from '@fluentui/react-components';

/* -------------------------------- useWizard -------------------------------- */

export type WizardStepDefinition<StepId extends string> = {
  id: StepId;
  title: string;
  description?: string;
};

export type UseWizardOptions<StepId extends string, Values> = {
  steps: WizardStepDefinition<StepId>[];
  values: Values;
  /** Return a field-keyed map of messages for the step. An empty object means the step is valid. */
  validateStep: (stepId: StepId, values: Values) => Record<string, string>;
};

export function useWizard<StepId extends string, Values>(options: UseWizardOptions<StepId, Values>) {
  const { steps, values, validateStep } = options;
  const [stepIndex, setStepIndex] = React.useState(0);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const step = steps[stepIndex];

  const clearError = React.useCallback((field: string) => {
    setErrors(previous => {
      if (!(field in previous)) {
        return previous;
      }
      const next = { ...previous };
      delete next[field];
      return next;
    });
  }, []);

  /** Validates the current step and advances only when it is clean. Returns false when blocked. */
  const goNext = React.useCallback(() => {
    const stepErrors = validateStep(step.id, values);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return false;
    }
    setErrors({});
    setStepIndex(index => Math.min(index + 1, steps.length - 1));
    return true;
  }, [step.id, steps.length, validateStep, values]);

  const goBack = React.useCallback(() => {
    setErrors({});
    setStepIndex(index => Math.max(index - 1, 0));
  }, []);

  const goTo = React.useCallback(
    (index: number) => {
      setErrors({});
      setStepIndex(Math.max(0, Math.min(index, steps.length - 1)));
    },
    [steps.length],
  );

  /** Validates every step before submitting and jumps to the first invalid one. Returns false when blocked. */
  const validateAll = React.useCallback(() => {
    const allErrors: Record<string, string> = {};
    let firstInvalidIndex = -1;

    steps.forEach((candidate, index) => {
      const stepErrors = validateStep(candidate.id, values);
      if (firstInvalidIndex === -1 && Object.keys(stepErrors).length > 0) {
        firstInvalidIndex = index;
      }
      Object.assign(allErrors, stepErrors);
    });

    if (firstInvalidIndex !== -1) {
      setErrors(allErrors);
      setStepIndex(firstInvalidIndex);
      return false;
    }

    setErrors({});
    return true;
  }, [steps, validateStep, values]);

  return {
    step,
    stepIndex,
    isFirstStep: stepIndex === 0,
    isLastStep: stepIndex === steps.length - 1,
    errors,
    clearError,
    goNext,
    goBack,
    goTo,
    validateAll,
  };
}

/* ------------------------------ StepIndicator ------------------------------ */

export type StepIndicatorProps = {
  steps: { id: string; title: string }[];
  currentIndex: number;
};

export const StepIndicator = (props: StepIndicatorProps) => {
  const { steps, currentIndex } = props;
  const current = steps[currentIndex];
  const percent = Math.round(((currentIndex + 1) / steps.length) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <Text size={200} weight='semibold'>
          {`Step ${currentIndex + 1} of ${steps.length} - ${current.title}`}
        </Text>
        <Badge appearance='tint' color='brand' shape='rounded' size='small'>{`${percent}%`}</Badge>
      </div>
      <ProgressBar
        value={currentIndex + 1}
        max={steps.length}
        aria-label={`Step ${currentIndex + 1} of ${steps.length}`}
      />
    </div>
  );
};

/* -------------------------------- contact form ------------------------------ */

type ContactStepId = 'details' | 'message' | 'confirm';

type ContactValues = {
  fullName: string;
  email: string;
  topic: string;
  message: string;
  consent: boolean;
};

const CONTACT_STEPS: WizardStepDefinition<ContactStepId>[] = [
  { id: 'details', title: 'Your details' },
  { id: 'message', title: 'Your message' },
  { id: 'confirm', title: 'Confirm' },
];

const CONTACT_INITIAL_VALUES: ContactValues = {
  fullName: '',
  email: '',
  topic: 'sales',
  message: '',
  consent: false,
};

function validateContactStep(stepId: ContactStepId, values: ContactValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (stepId === 'details') {
    if (!values.fullName.trim()) {
      errors.fullName = 'Tell us your name.';
    }
    if (!values.email.trim()) {
      errors.email = 'We need an email address to reply.';
    } else if (!values.email.includes('@')) {
      errors.email = 'That email address does not look right.';
    }
  }

  if (stepId === 'message' && values.message.trim().length < 20) {
    errors.message = 'Please give us at least 20 characters.';
  }

  if (stepId === 'confirm' && !values.consent) {
    errors.consent = 'Please confirm before sending.';
  }

  return errors;
}

export const ContactWizard = () => {
  const [values, setValues] = React.useState<ContactValues>(CONTACT_INITIAL_VALUES);
  const [status, setStatus] = React.useState<'editing' | 'sending' | 'sent'>('editing');

  const wizard = useWizard<ContactStepId, ContactValues>({
    steps: CONTACT_STEPS,
    values,
    validateStep: validateContactStep,
  });

  const updateField = (patch: Partial<ContactValues>) => {
    setValues(previous => ({ ...previous, ...patch }));
    Object.keys(patch).forEach(key => wizard.clearError(key));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!wizard.validateAll()) {
      return;
    }
    setStatus('sending');
    window.setTimeout(() => setStatus('sent'), 800);
  };

  if (status === 'sent') {
    return (
      <Card appearance='outline' style={{ maxWidth: 560, margin: '0 auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Text size={400} weight='semibold'>Thanks, {values.fullName}</Text>
        <Text>{`We received your message and will reply to ${values.email} shortly.`}</Text>
        <div>
          <Button
            appearance='primary'
            onClick={() => {
              setValues(CONTACT_INITIAL_VALUES);
              setStatus('editing');
              wizard.goTo(0);
            }}
          >
            Send another message
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card appearance='outline' style={{ maxWidth: 560, margin: '0 auto', padding: 24 }}>
      <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <StepIndicator steps={CONTACT_STEPS} currentIndex={wizard.stepIndex} />
        <Divider />
        <Text size={400} weight='semibold'>{wizard.step.title}</Text>

        {wizard.step.id === 'details' && (
          <>
            <Field
              label='Full name'
              required
              validationState={wizard.errors.fullName ? 'error' : 'none'}
              validationMessage={wizard.errors.fullName}
            >
              <Input value={values.fullName} onChange={(_, data) => updateField({ fullName: data.value })} />
            </Field>
            <Field
              label='Email'
              required
              validationState={wizard.errors.email ? 'error' : 'none'}
              validationMessage={wizard.errors.email}
            >
              <Input type='email' value={values.email} onChange={(_, data) => updateField({ email: data.value })} />
            </Field>
          </>
        )}

        {wizard.step.id === 'message' && (
          <>
            <Field label='Topic' required>
              <Select value={values.topic} onChange={(_, data) => updateField({ topic: data.value })}>
                <option value='sales'>Sales</option>
                <option value='support'>Support</option>
                <option value='partnership'>Partnership</option>
              </Select>
            </Field>
            <Field
              label='Message'
              required
              hint='At least 20 characters.'
              validationState={wizard.errors.message ? 'error' : 'none'}
              validationMessage={wizard.errors.message}
            >
              <Textarea
                value={values.message}
                onChange={(_, data) => updateField({ message: data.value })}
                resize='vertical'
              />
            </Field>
          </>
        )}

        {wizard.step.id === 'confirm' && (
          <>
            <MessageBar intent='info'>
              {`We will reply to ${values.email || 'the email address you provide'}.`}
            </MessageBar>
            <Field
              validationState={wizard.errors.consent ? 'error' : 'none'}
              validationMessage={wizard.errors.consent}
            >
              <Checkbox
                label='I agree to be contacted about my request'
                checked={values.consent}
                onChange={(_, data) => updateField({ consent: data.checked === true })}
              />
            </Field>
          </>
        )}

        <Divider />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Button
            type='button'
            appearance='secondary'
            onClick={wizard.goBack}
            disabled={wizard.isFirstStep || status === 'sending'}
          >
            Back
          </Button>
          {wizard.isLastStep ? (
            <Button type='submit' appearance='primary' disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending' : 'Send message'}
            </Button>
          ) : (
            <Button type='button' appearance='primary' onClick={wizard.goNext}>
              Next
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};
```

### Async availability check inside a step

A single Account step that validates the email against a fake server while the user types. Shows the request-id guard that ignores stale responses, the checking state rendered through the contentAfter slot of Input with a tiny Spinner, Field validationState toggling between error and success, and a submit button gated on the resolved result.

```tsx
import * as React from 'react';
import { Button, Card, Field, Input, MessageBar, Spinner, Text } from '@fluentui/react-components';

type Availability = 'idle' | 'checking' | 'available' | 'taken';

const MIN_PASSWORD_LENGTH = 12;

/** Stand-in for a real availability endpoint. Emails ending in contoso.com are treated as taken. */
function checkEmailAvailability(email: string): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    window.setTimeout(() => resolve(!email.toLowerCase().endsWith('@contoso.com')), 700);
  });
}

export const StepWithAsyncValidation = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [availability, setAvailability] = React.useState<Availability>('idle');
  const [takenMessage, setTakenMessage] = React.useState<string | undefined>(undefined);
  const [completed, setCompleted] = React.useState(false);
  const latestRequest = React.useRef(0);

  const handleEmailChange = (nextEmail: string) => {
    setEmail(nextEmail);
    setCompleted(false);
    setTakenMessage(undefined);

    const requestId = latestRequest.current + 1;
    latestRequest.current = requestId;

    if (!nextEmail.includes('@')) {
      setAvailability('idle');
      return;
    }

    setAvailability('checking');

    checkEmailAvailability(nextEmail).then(isAvailable => {
      // A newer keystroke already started the check that matters, so drop this response.
      if (requestId !== latestRequest.current) {
        return;
      }
      setAvailability(isAvailable ? 'available' : 'taken');
      if (!isAvailable) {
        setTakenMessage('That email is already registered. Try signing in instead.');
      }
    });
  };

  const isEmailValid = availability === 'available';
  const passwordTooShort = password.length > 0 && password.length < MIN_PASSWORD_LENGTH;
  const isPasswordValid = password.length >= MIN_PASSWORD_LENGTH;
  const canContinue = isEmailValid && isPasswordValid;

  const emailValidationState = takenMessage ? 'error' : isEmailValid ? 'success' : 'none';
  const emailValidationMessage =
    takenMessage ?? (isEmailValid ? 'That email address is available.' : undefined);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canContinue) {
      return;
    }
    setCompleted(true);
  };

  return (
    <Card appearance='outline' style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <form noValidate onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Text size={400} weight='semibold'>Step 1 of 3 - Account</Text>
          <Text size={200}>We check the email address against the server while you type.</Text>
        </div>

        <Field
          label='Work email'
          required
          hint='Availability is checked automatically.'
          validationState={emailValidationState}
          validationMessage={emailValidationMessage}
        >
          <Input
            type='email'
            value={email}
            onChange={(_, data) => handleEmailChange(data.value)}
            contentAfter={
              availability === 'checking'
                ? <Spinner size='extra-tiny' aria-label='Checking availability' />
                : undefined
            }
          />
        </Field>

        <Field
          label='Password'
          required
          hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
          validationState={passwordTooShort ? 'warning' : 'none'}
          validationMessage={passwordTooShort ? `Use at least ${MIN_PASSWORD_LENGTH} characters.` : undefined}
        >
          <Input type='password' value={password} onChange={(_, data) => setPassword(data.value)} />
        </Field>

        {completed && (
          <MessageBar intent='success'>Account step complete. Continue to the next step.</MessageBar>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
          {availability === 'checking' && <Spinner size='tiny' label='Checking email' labelPosition='after' />}
          <Button type='submit' appearance='primary' disabled={!canContinue}>
            Continue
          </Button>
        </div>
      </form>
    </Card>
  );
};
```

## Pitfalls

- Validating the entire form when the user clicks Next. Every future step lights up with errors the user cannot fix from where they are. Validate only the current step while navigating, and validate all steps only inside the submit handler - then move the user to the first invalid step.
- Forgetting to re-validate earlier steps on submit. A user can complete step 1, walk forward to the review step, go back and clear a field. Always loop over the step list in the submit handler and merge the per-step results with Object.assign before touching the network.
- Not clearing a field error when its value changes. Keep errors keyed by field and delete the patched keys in one updateField helper (returning the previous object when nothing changed so React can bail out), otherwise stale messages stay under fields that are already fixed.
- Keeping per-step copies of the data in local useState inside each step component. When the step unmounts, that copy disappears and Back loses data. Every value must live in the wizard's single values object and be passed down as controlled props.
- Skipping focus management on step change. Swapping step content leaves focus on the Next button and screen readers announce nothing. Focus the step heading with tabIndex={-1} in an effect keyed on stepIndex, and use a first-render ref so the initial page load does not steal focus.
- Passing validationState='error' to Field without a validationMessage. The styling is invisible to screen readers and confusing to everyone else; always pair the two, or drop the state entirely.
- Duplicating the same sentence in a Field validationMessage and in a step-level MessageBar. Screen readers announce both, so reserve Field for field-level problems and MessageBar for step-level or submit-level problems.
- Leaving Back and Next as implicit submit buttons. Inside a form every Button defaults to type='submit', so pressing Enter in a text field submits the whole wizard from step 1. Set type='button' on everything except the final submit.
- Letting async field validation resolve out of order. Two keystrokes can produce two requests whose responses arrive in the wrong order. Keep a counter in a useRef, compare it when the promise resolves, and ignore stale responses.
- Disabling or hiding the Back button on the first step and letting the footer layout jump between steps. Keep the button mounted and disabled so the primary action stays in the same screen position on every step.
- Firing the submit request twice because the button is only visually disabled. Combine disabled={submitting} with an early return in the handler and hold the request state in the wizard, not in the button.

## Accessibility

Wrap each step's controls in a container with role='group' and aria-labelledby pointing at the step heading so assistive technology announces which step it is entering. Because React does not move focus when step content is swapped, focus the step heading (tabIndex={-1}) inside an effect keyed on stepIndex, and skip the very first render so the page does not steal focus on load; without this, keyboard users stay on the Next button and screen readers announce nothing. Every control must sit inside a Field so the label, required state, hint and validation message are programmatically associated with the input; never use placeholder text as the only label. Field validationState='error' must always be paired with a validationMessage, otherwise the red outline conveys nothing to non-visual users. Reserve MessageBar politeness='assertive' for submit failures and step-blocking summaries; use the default polite politeness for informational messages, and avoid repeating the same sentence in both a Field and a MessageBar because it is announced twice. Progress is a visual aid only - always render the textual 'Step X of Y' counter and give the bar an aria-label. Buttons inside the form that are not the final submit need type='button', otherwise pressing Enter in a text field submits the wizard. While submitting, keep the submit button mounted with its label and show the Spinner separately with an accessible label rather than swapping the button text, and do not move focus during the request. Use noValidate on the form so browser validation bubbles do not conflict with Fluent error messaging.

## Components used

- [Badge](../../components/badge.md)
- [Button](../../components/button.md)
- [Card](../../components/card.md)
- [Checkbox](../../components/checkbox.md)
- [Divider](../../components/divider.md)
- [Field](../../components/field.md)
- [Input](../../components/input.md)
- [MessageBar](../../components/message-bar.md)
- [Progress](../../components/progress.md)
- [Select](../../components/select.md)
- [Spinner](../../components/spinner.md)
- [Switch](../../components/switch.md)
- [Text](../../components/text.md)
- [Textarea](../../components/textarea.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
