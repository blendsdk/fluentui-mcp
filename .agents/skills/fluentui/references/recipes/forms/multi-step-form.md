# Multi-Step Form

> **Group**: forms

## Goal

Build an accessible, validated multi-step form (wizard) in Fluent UI React v9 by composing Card, CardHeader/CardFooter, Field, form controls, Button, ProgressBar or TabList, MessageBar and Dialog, with per-step validation, guarded navigation, a review step and an async submit confirmation.

## When to Use

Use this recipe when a single form is too long or too consequential for one screen and the data must be collected in a guided, ordered sequence: sign-up/onboarding flows, checkout, account or workspace setup, insurance/loan applications, or any flow where each step has its own validation rules and the user must not proceed until the current step is valid. It is also the right choice when you need a review/confirm step, progress feedback, or a confirmation dialog before the final save.

## When Not to Use

Do not use a wizard when all fields fit comfortably on one screen with a single submit button - a plain Field-based form is faster to build and less frustrating. Avoid it when users need random access to any section (use tabs, Accordion, or a settings page with anchored sections instead) or when steps are truly independent pages that should be deep-linkable (use your router and render one step per route). Do not use it for long-running background operations (use a Toast/MessageBar with progress feedback). For short, non-sequential confirmations of the last action, prefer a single Dialog over a multi-step flow.

A wizard is a form split across ordered screens. Fluent UI v9 has no `Wizard` component, so you compose one from `Card`, `Field`, `Button`, `ProgressBar` (or `TabList`) and `MessageBar` while keeping a single source of truth for the collected values.

## What the recipe produces

- A `Card` shell with `CardHeader` (title plus visible "Step X of Y" text), a `ProgressBar`, the current step's fields, and `CardFooter` navigation.
- Every control wrapped in `Field` with a render-function child, so label, hint and validation message are programmatically associated with the control.
- Per-step validation that runs when the user presses **Next**; a failing step stays put and surfaces both an error summary and inline messages.
- Optional tab-based step navigation (`TabList`) in which not-yet-reached steps are `disabled`.
- A final review step with an explicit confirmation (`Checkbox` or typing your name in a `Dialog`) and an async submit that shows a `Spinner` and disables the primary button.

## Anatomy of the pattern

### 1. One state object, one error object

Keep the values of every step in one state object at the wizard level and never let a step own its own copy:

```tsx
const [values, setValues] = React.useState<FormValues>(INITIAL_VALUES);
const [errors, setErrors] = React.useState<FormErrors>({});
```

`FormErrors` is `Partial<Record<keyof FormValues, string>>`, so an empty object means "this step is valid". A small `update(patch)` helper merges the patch and deletes errors for the touched keys, so a message disappears the moment the user edits the offending field.

### 2. Validate per step, re-validate at submit

`validateStep(step, values)` returns an error map for one step only. `goNext()` calls it, stores the result, and returns early when the map is non-empty. The final submit branch should validate the whole payload again, because a value can be edited after its step was passed.

### 3. Wire every control through Field

`Field` supports a render-function child that receives the control props (`id`, `aria-labelledby`, `aria-describedby`, and related state). Spread them onto the control:

```tsx
<Field label="Email" required validationState={errors.email ? "error" : "none"} validationMessage={errors.email}>
  {(fieldProps) => (
    <Input {...fieldProps} value={values.email} onChange={(_, data) => update({ email: data.value })} />
  )}
</Field>
```

Use the same shape for `Select`, `Textarea` and `RadioGroup`; the same idea applies to other controls such as `Switch` or `Slider`. `validationState` plus `validationMessage` is what paints the error styling and the message under the control.

### 4. Navigation and guards

- Buttons: `appearance="primary"` for **Next** / **Submit** (one primary action per step), `appearance="secondary"` for **Back**, `disabled` on the first step.
- With `TabList` as the stepper, set `selectTabOnFocus={false}` so arrow-key navigation does not change steps without validation, and disable tabs beyond a `furthestStep` index that only advances after a step validates.
- Render the active step inside a container with `role="tabpanel"` when using `TabList`; otherwise simply switch on a `step` number.

### 5. Feedback

- `ProgressBar` reflects completion: `value={step + 1} max={steps.length}`.
- A step-level error summary in `MessageBar` (`intent="error"`, `politeness="polite"`) lists every problem, while each `Field` renders its own message. Clear the summary when the step changes or the user presses Back.
- End with an explicit success state - a `MessageBar` (`intent="success"`) plus a way to start again - rather than a silent no-op.

### 6. Review and async submit

The last step is a read-only summary of the collected values. Gate submission on an explicit confirmation (terms `Checkbox`, or typing your name in a `Dialog`). While the request is in flight, disable the primary button and render a `Spinner` inside its `icon` slot; keep the surface open until the promise resolves so input cannot be lost.

## Choosing the shell

- Inline page section: `Card` + `CardHeader` / `CardFooter` (examples 1 and 2).
- Short confirmation of the final step: `Dialog` with `DialogSurface`, `DialogBody`, `DialogTitle`, `DialogContent`, `DialogActions` and a `DialogTrigger action="close"` cancel button (example 3).
- Multi-page flows: keep the same state shapes but render one step per route.
- Long but non-sequential forms: use sections with `Accordion` instead of a wizard.

## Examples

### Account setup wizard (Card + ProgressBar + Field validation)

A three-step wizard inside a Card: account details, plan selection (RadioGroup/Select/Textarea), and a review step with a terms Checkbox. Each step validates on Next, shows inline Field messages plus a MessageBar summary, and ends with a success MessageBar and a reset action.

```tsx
import * as React from "react";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Checkbox,
  Divider,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  ProgressBar,
  Radio,
  RadioGroup,
  Select,
  Text,
  Textarea,
} from "@fluentui/react-components";

type Plan = "starter" | "standard" | "premium";

interface FormValues {
  fullName: string;
  email: string;
  company: string;
  plan: Plan | "";
  teamSize: string;
  budget: string;
  notes: string;
  acceptedTerms: boolean;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const STEPS = ["Account", "Plan", "Review"] as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PLAN_LABELS: Record<Plan, string> = {
  starter: "Starter (5 users, 10 GB)",
  standard: "Standard (25 users, 100 GB)",
  premium: "Premium (unlimited users, 1 TB)",
};

const INITIAL_VALUES: FormValues = {
  fullName: "",
  email: "",
  company: "",
  plan: "",
  teamSize: "",
  budget: "",
  notes: "",
  acceptedTerms: false,
};

function validateStep(step: number, values: FormValues): FormErrors {
  if (step === 0) {
    const errors: FormErrors = {};
    if (!values.fullName.trim()) {
      errors.fullName = "Enter your full name.";
    }
    if (!values.email.trim()) {
      errors.email = "Enter your work email.";
    } else if (!EMAIL_PATTERN.test(values.email.trim())) {
      errors.email = "Enter a valid email address, such as name@company.com.";
    }
    return errors;
  }

  if (step === 1) {
    const errors: FormErrors = {};
    if (!values.plan) {
      errors.plan = "Select the plan you want to start with.";
    }
    if (!values.teamSize) {
      errors.teamSize = "Select how many people will use the workspace.";
    }
    if (values.budget.trim() !== "" && Number.isNaN(Number(values.budget))) {
      errors.budget = "Budget must be a number.";
    }
    return errors;
  }

  return values.acceptedTerms ? {} : { acceptedTerms: "Accept the terms to create your workspace." };
}

export const AccountSetupWizard: React.FC = () => {
  const [step, setStep] = React.useState(0);
  const [values, setValues] = React.useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [submitted, setSubmitted] = React.useState(false);

  const update = (patch: Partial<FormValues>) => {
    setValues((previous) => ({ ...previous, ...patch }));
    setErrors((previous) => {
      const patchedKeys = Object.keys(patch) as Array<keyof FormValues>;
      if (!patchedKeys.some((key) => previous[key])) {
        return previous;
      }
      const next = { ...previous };
      patchedKeys.forEach((key) => delete next[key]);
      return next;
    });
  };

  const errorKeys = Object.keys(errors) as Array<keyof FormValues>;
  const isLastStep = step === STEPS.length - 1;

  const goBack = () => {
    setErrors({});
    setStep((current) => Math.max(0, current - 1));
  };

  const goNext = () => {
    const stepErrors = validateStep(step, values);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      return;
    }
    if (isLastStep) {
      setSubmitted(true);
    } else {
      setStep((current) => current + 1);
    }
  };

  const startOver = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setSubmitted(false);
    setStep(0);
  };

  return (
    <Card appearance="outline" style={{ maxWidth: 620, margin: "0 auto" }}>
      <CardHeader
        header={
          <Text weight="semibold" size={500}>
            Create your workspace
          </Text>
        }
        description={
          <Text size={200}>
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </Text>
        }
      />

      <ProgressBar
        value={step + 1}
        max={STEPS.length}
        thickness="large"
        aria-label={`Step ${step + 1} of ${STEPS.length}`}
      />

      <Divider appearance="subtle" />

      {submitted ? (
        <MessageBar intent="success">
          <MessageBarBody>
            <MessageBarTitle>Workspace created</MessageBarTitle>
            <Text>
              {`${values.fullName || "Your account"} is set up on the ${
                values.plan ? PLAN_LABELS[values.plan] : "selected"
              } plan. We sent a confirmation to ${values.email}.`}
            </Text>
          </MessageBarBody>
        </MessageBar>
      ) : (
        <>
          {errorKeys.length > 0 && (
            <MessageBar intent="error" politeness="polite">
              <MessageBarBody>
                <MessageBarTitle>Check the highlighted fields</MessageBarTitle>
                <ul style={{ margin: 0, paddingInlineStart: 20 }}>
                  {errorKeys.map((key) => (
                    <li key={key}>{errors[key]}</li>
                  ))}
                </ul>
              </MessageBarBody>
            </MessageBar>
          )}

          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 420 }}>
              <Field
                label="Full name"
                required
                validationState={errors.fullName ? "error" : "none"}
                validationMessage={errors.fullName}
              >
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    value={values.fullName}
                    onChange={(_, data) => update({ fullName: data.value })}
                  />
                )}
              </Field>

              <Field
                label="Work email"
                required
                validationState={errors.email ? "error" : "none"}
                validationMessage={errors.email}
              >
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    type="email"
                    value={values.email}
                    onChange={(_, data) => update({ email: data.value })}
                  />
                )}
              </Field>

              <Field label="Company" hint="Optional">
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    value={values.company}
                    onChange={(_, data) => update({ company: data.value })}
                  />
                )}
              </Field>
            </div>
          )}

          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 420 }}>
              <Field
                label="Plan"
                required
                hint="You can change your plan at any time."
                validationState={errors.plan ? "error" : "none"}
                validationMessage={errors.plan}
              >
                {(fieldProps) => (
                  <RadioGroup
                    {...fieldProps}
                    value={values.plan}
                    onChange={(_, data) => update({ plan: data.value as Plan })}
                    layout="vertical"
                  >
                    <Radio value="starter" label={PLAN_LABELS.starter} />
                    <Radio value="standard" label={PLAN_LABELS.standard} />
                    <Radio value="premium" label={PLAN_LABELS.premium} />
                  </RadioGroup>
                )}
              </Field>

              <Field
                label="Team size"
                required
                validationState={errors.teamSize ? "error" : "none"}
                validationMessage={errors.teamSize}
              >
                {(fieldProps) => (
                  <Select
                    {...fieldProps}
                    value={values.teamSize}
                    onChange={(_, data) => update({ teamSize: data.value })}
                  >
                    <option value="">Select a range</option>
                    <option value="1-10">1-10 people</option>
                    <option value="11-50">11-50 people</option>
                    <option value="51-200">51-200 people</option>
                    <option value="200+">More than 200 people</option>
                  </Select>
                )}
              </Field>

              <Field
                label="Monthly budget (USD)"
                validationState={errors.budget ? "error" : "none"}
                validationMessage={errors.budget}
              >
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    type="number"
                    value={values.budget}
                    onChange={(_, data) => update({ budget: data.value })}
                  />
                )}
              </Field>

              <Field label="Anything we should know?" hint="Optional">
                {(fieldProps) => (
                  <Textarea
                    {...fieldProps}
                    value={values.notes}
                    resize="vertical"
                    onChange={(_, data) => update({ notes: data.value })}
                  />
                )}
              </Field>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Text weight="semibold">Review your details</Text>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(120px, 160px) 1fr",
                  rowGap: 8,
                  columnGap: 12,
                }}
              >
                <Text size={200} weight="semibold">
                  Name
                </Text>
                <Text>{values.fullName || "-"}</Text>
                <Text size={200} weight="semibold">
                  Email
                </Text>
                <Text>{values.email || "-"}</Text>
                <Text size={200} weight="semibold">
                  Company
                </Text>
                <Text>{values.company || "-"}</Text>
                <Text size={200} weight="semibold">
                  Plan
                </Text>
                <Text>{values.plan ? PLAN_LABELS[values.plan] : "-"}</Text>
                <Text size={200} weight="semibold">
                  Team size
                </Text>
                <Text>{values.teamSize || "-"}</Text>
                <Text size={200} weight="semibold">
                  Budget
                </Text>
                <Text>{values.budget ? `$${values.budget}` : "-"}</Text>
              </div>

              {values.notes && (
                <>
                  <Text size={200} weight="semibold">
                    Notes
                  </Text>
                  <Text>{values.notes}</Text>
                </>
              )}

              <Divider appearance="subtle" />

              <Checkbox
                checked={values.acceptedTerms}
                onChange={(_, data) => update({ acceptedTerms: data.checked === true })}
                label="I accept the terms of service and privacy policy"
              />

              {errors.acceptedTerms && (
                <MessageBar intent="error" politeness="polite">
                  <MessageBarBody>
                    <Text>{errors.acceptedTerms}</Text>
                  </MessageBarBody>
                </MessageBar>
              )}
            </div>
          )}
        </>
      )}

      <CardFooter>
        <div style={{ display: "flex", gap: 8, width: "100%", justifyContent: "flex-end" }}>
          {submitted ? (
            <Button appearance="primary" onClick={startOver}>
              Create another workspace
            </Button>
          ) : (
            <>
              <Button appearance="secondary" disabled={step === 0} onClick={goBack}>
                Back
              </Button>
              <Button appearance="primary" onClick={goNext}>
                {isLastStep ? "Create workspace" : "Next"}
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
```

### Checkout wizard with TabList step navigation

A three-step checkout where TabList acts as the stepper. Tabs for steps the user has not reached are disabled, selectTabOnFocus is false so arrow keys cannot bypass validation, the active step renders inside role="tabpanel", and Back/Next in CardFooter drive the flow until the order is placed.

```tsx
import * as React from "react";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Divider,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Select,
  Tab,
  TabList,
  Text,
} from "@fluentui/react-components";

type StepKey = "contact" | "delivery" | "payment";

interface CheckoutValues {
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  deliverySpeed: string;
  cardName: string;
  cardNumber: string;
}

type CheckoutErrors = Partial<Record<keyof CheckoutValues, string>>;

const STEP_ORDER: StepKey[] = ["contact", "delivery", "payment"];

const STEP_LABELS: Record<StepKey, string> = {
  contact: "Contact",
  delivery: "Delivery",
  payment: "Payment",
};

const INITIAL_VALUES: CheckoutValues = {
  email: "",
  phone: "",
  address: "",
  city: "",
  postcode: "",
  deliverySpeed: "standard",
  cardName: "",
  cardNumber: "",
};

function validateStep(step: StepKey, values: CheckoutValues): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (step === "contact") {
    if (!values.email.includes("@")) {
      errors.email = "Enter an email address we can send the receipt to.";
    }
    if (values.phone.replace(/\D/g, "").length < 7) {
      errors.phone = "Enter a phone number with at least 7 digits.";
    }
  }

  if (step === "delivery") {
    if (!values.address.trim()) {
      errors.address = "Enter a street address.";
    }
    if (!values.city.trim()) {
      errors.city = "Enter a city.";
    }
    if (!/^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/.test(values.postcode.trim())) {
      errors.postcode = "Enter a valid postal code (3-10 characters).";
    }
  }

  if (step === "payment") {
    if (!values.cardName.trim()) {
      errors.cardName = "Enter the name printed on the card.";
    }
    if (values.cardNumber.replace(/\s/g, "").length < 12) {
      errors.cardNumber = "Enter a valid card number.";
    }
  }

  return errors;
}

export const CheckoutWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState<StepKey>("contact");
  const [furthestStep, setFurthestStep] = React.useState(0);
  const [values, setValues] = React.useState<CheckoutValues>(INITIAL_VALUES);
  const [errors, setErrors] = React.useState<CheckoutErrors>({});
  const [confirmation, setConfirmation] = React.useState<string | undefined>();

  const currentIndex = STEP_ORDER.indexOf(currentStep);

  const update = (patch: Partial<CheckoutValues>) => {
    setValues((previous) => ({ ...previous, ...patch }));
    setErrors((previous) => {
      const patchedKeys = Object.keys(patch) as Array<keyof CheckoutValues>;
      if (!patchedKeys.some((key) => previous[key])) {
        return previous;
      }
      const next = { ...previous };
      patchedKeys.forEach((key) => delete next[key]);
      return next;
    });
  };

  const selectStep = (step: StepKey) => {
    if (confirmation) {
      return;
    }
    if (STEP_ORDER.indexOf(step) <= furthestStep) {
      setErrors({});
      setCurrentStep(step);
    }
  };

  const goBack = () => {
    setErrors({});
    setCurrentStep(STEP_ORDER[Math.max(0, currentIndex - 1)]);
  };

  const goNext = () => {
    const stepErrors = validateStep(currentStep, values);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      return;
    }
    if (currentIndex === STEP_ORDER.length - 1) {
      setConfirmation(`Order placed. A receipt is on its way to ${values.email}.`);
      return;
    }
    const nextIndex = currentIndex + 1;
    setFurthestStep((previous) => Math.max(previous, nextIndex));
    setCurrentStep(STEP_ORDER[nextIndex]);
  };

  return (
    <Card appearance="outline" style={{ maxWidth: 620, margin: "0 auto" }}>
      <CardHeader
        header={
          <Text weight="semibold" size={500}>
            Checkout
          </Text>
        }
        description={<Text size={200}>Complete each section, then place your order.</Text>}
      />

      <TabList
        selectedValue={currentStep}
        onTabSelect={(_, data) => selectStep(data.value as StepKey)}
        selectTabOnFocus={false}
        aria-label="Checkout steps"
      >
        {STEP_ORDER.map((step, index) => (
          <Tab
            key={step}
            value={step}
            disabled={index > furthestStep || confirmation !== undefined}
          >
            {`${index + 1}. ${STEP_LABELS[step]}`}
          </Tab>
        ))}
      </TabList>

      <Divider appearance="subtle" />

      {confirmation ? (
        <MessageBar intent="success">
          <MessageBarBody>
            <MessageBarTitle>Thank you!</MessageBarTitle>
            <Text>{confirmation}</Text>
          </MessageBarBody>
        </MessageBar>
      ) : (
        <>
          {Object.keys(errors).length > 0 && (
            <MessageBar intent="error" politeness="polite">
              <MessageBarBody>
                <MessageBarTitle>Fix these before continuing</MessageBarTitle>
                <ul style={{ margin: 0, paddingInlineStart: 20 }}>
                  {(Object.keys(errors) as Array<keyof CheckoutValues>).map((key) => (
                    <li key={key}>{errors[key]}</li>
                  ))}
                </ul>
              </MessageBarBody>
            </MessageBar>
          )}

          <div
            role="tabpanel"
            aria-label={STEP_LABELS[currentStep]}
            style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 420 }}
          >
            {currentStep === "contact" && (
              <>
                <Field
                  label="Email"
                  required
                  validationState={errors.email ? "error" : "none"}
                  validationMessage={errors.email}
                >
                  {(fieldProps) => (
                    <Input
                      {...fieldProps}
                      type="email"
                      value={values.email}
                      onChange={(_, data) => update({ email: data.value })}
                    />
                  )}
                </Field>

                <Field
                  label="Phone"
                  required
                  validationState={errors.phone ? "error" : "none"}
                  validationMessage={errors.phone}
                >
                  {(fieldProps) => (
                    <Input
                      {...fieldProps}
                      type="tel"
                      value={values.phone}
                      onChange={(_, data) => update({ phone: data.value })}
                    />
                  )}
                </Field>
              </>
            )}

            {currentStep === "delivery" && (
              <>
                <Field
                  label="Street address"
                  required
                  validationState={errors.address ? "error" : "none"}
                  validationMessage={errors.address}
                >
                  {(fieldProps) => (
                    <Input
                      {...fieldProps}
                      value={values.address}
                      onChange={(_, data) => update({ address: data.value })}
                    />
                  )}
                </Field>

                <Field
                  label="City"
                  required
                  validationState={errors.city ? "error" : "none"}
                  validationMessage={errors.city}
                >
                  {(fieldProps) => (
                    <Input
                      {...fieldProps}
                      value={values.city}
                      onChange={(_, data) => update({ city: data.value })}
                    />
                  )}
                </Field>

                <Field
                  label="Postal code"
                  required
                  validationState={errors.postcode ? "error" : "none"}
                  validationMessage={errors.postcode}
                >
                  {(fieldProps) => (
                    <Input
                      {...fieldProps}
                      value={values.postcode}
                      onChange={(_, data) => update({ postcode: data.value })}
                    />
                  )}
                </Field>

                <Field label="Delivery speed">
                  {(fieldProps) => (
                    <Select
                      {...fieldProps}
                      value={values.deliverySpeed}
                      onChange={(_, data) => update({ deliverySpeed: data.value })}
                    >
                      <option value="standard">Standard (3-5 days)</option>
                      <option value="express">Express (next day)</option>
                      <option value="pickup">Pick up in store</option>
                    </Select>
                  )}
                </Field>
              </>
            )}

            {currentStep === "payment" && (
              <>
                <Field
                  label="Name on card"
                  required
                  validationState={errors.cardName ? "error" : "none"}
                  validationMessage={errors.cardName}
                >
                  {(fieldProps) => (
                    <Input
                      {...fieldProps}
                      value={values.cardName}
                      onChange={(_, data) => update({ cardName: data.value })}
                    />
                  )}
                </Field>

                <Field
                  label="Card number"
                  required
                  hint="This demo validates the length only - never store raw card data."
                  validationState={errors.cardNumber ? "error" : "none"}
                  validationMessage={errors.cardNumber}
                >
                  {(fieldProps) => (
                    <Input
                      {...fieldProps}
                      value={values.cardNumber}
                      onChange={(_, data) => update({ cardNumber: data.value })}
                    />
                  )}
                </Field>
              </>
            )}
          </div>
        </>
      )}

      <CardFooter>
        <div style={{ display: "flex", gap: 8, width: "100%", justifyContent: "flex-end" }}>
          <Button
            appearance="secondary"
            onClick={goBack}
            disabled={currentIndex === 0 || confirmation !== undefined}
          >
            Back
          </Button>
          <Button appearance="primary" onClick={goNext} disabled={confirmation !== undefined}>
            {currentIndex === STEP_ORDER.length - 1 ? "Place order" : "Next"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
```

### Final step confirmation in a Dialog with async submit

The last step of the wizard opens a Dialog that summarizes the entries, requires the applicant to type their name to confirm, and submits asynchronously with a Spinner in the primary button's icon slot. The dialog stays open and the buttons stay disabled until the request resolves.

```tsx
import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Divider,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
  Text,
} from "@fluentui/react-components";

export interface SubmitConfirmationDialogProps {
  applicantName: string;
  planLabel: string;
  onSubmitted: () => void;
}

const saveApplication = () =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, 1200);
  });

export const SubmitConfirmationDialog: React.FC<SubmitConfirmationDialogProps> = ({
  applicantName,
  planLabel,
  onSubmitted,
}) => {
  const [open, setOpen] = React.useState(false);
  const [typedName, setTypedName] = React.useState("");
  const [error, setError] = React.useState<string | undefined>();
  const [saving, setSaving] = React.useState(false);

  const isMatch = typedName.trim().toLowerCase() === applicantName.trim().toLowerCase();

  const handleConfirm = async () => {
    if (!isMatch) {
      setError(`Type "${applicantName}" exactly as written to confirm.`);
      return;
    }
    setError(undefined);
    setSaving(true);
    try {
      await saveApplication();
      setOpen(false);
      setTypedName("");
      onSubmitted();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button appearance="primary" onClick={() => setOpen(true)}>
        Review and submit
      </Button>

      <Dialog open={open} onOpenChange={(_, data) => setOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Submit your application?</DialogTitle>
            <DialogContent>
              <Text>{`${applicantName} - ${planLabel}`}</Text>
              <Divider appearance="subtle" />
              <Field
                label="Type your full name to confirm"
                required
                validationState={error ? "error" : "none"}
                validationMessage={error}
              >
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    value={typedName}
                    onChange={(_, data) => {
                      setTypedName(data.value);
                      setError(undefined);
                    }}
                  />
                )}
              </Field>
            </DialogContent>
            <DialogActions>
              <DialogTrigger action="close" disableButtonEnhancement>
                <Button appearance="secondary" disabled={saving}>
                  Cancel
                </Button>
              </DialogTrigger>
              <Button
                appearance="primary"
                onClick={handleConfirm}
                disabled={saving}
                icon={saving ? <Spinner size="tiny" /> : undefined}
              >
                {saving ? "Submitting..." : "Submit application"}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
};

export const SubmitStepExample: React.FC = () => {
  const [submittedAt, setSubmittedAt] = React.useState<string | undefined>();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
      {submittedAt && (
        <MessageBar intent="success">
          <MessageBarBody>
            <MessageBarTitle>Application submitted</MessageBarTitle>
            <Text>{submittedAt}</Text>
          </MessageBarBody>
        </MessageBar>
      )}

      <SubmitConfirmationDialog
        applicantName="Ada Lovelace"
        planLabel="Standard (25 users, 100 GB)"
        onSubmitted={() => setSubmittedAt(`Submitted at ${new Date().toLocaleTimeString()}.`)}
      />
    </div>
  );
};
```

## Pitfalls

- Validating only on final submit: users fill several screens before learning that step one was wrong. Validate the current step inside goNext(), render the error map on that step, and re-validate the whole payload at submit time.
- Letting each step own its own state (local useState or uncontrolled defaultValue): the value is lost when the step unmounts as the user navigates. Keep values in one object above the step switch and pass value + onChange down.
- Wrapping controls in Field but passing plain children (e.g. <Field label="Email"><Input /></Field>): the label's htmlFor references an id that no control has, so the control is announced unlabeled. Always use the render function and spread the provided props onto the control, including for Select, Textarea and RadioGroup.
- Leaving stale errors behind. If errors are only cleared when a step validates, they reappear incorrectly after Back/forward navigation. Clear errors on Back and on step change, and clear an individual field's error as soon as the user edits that field (the update(patch) helper in the examples does both).
- Using TabList as a stepper without selectTabOnFocus={false} and disabled tabs: arrow-key or click focus changes the step and skips validation entirely. Keep a furthestStep index, raise it only after a step validates, and disable every tab beyond it.
- Allowing double submission. An async final step that only disables the button after the state update flushes, or that closes the surface immediately, lets users submit twice or lose input. Set the pending flag before awaiting, disable both actions, and close only after the promise resolves.
- Treating ProgressBar as the only progress indicator or hardcoding a percentage: derive value and max from the step index and step count so the bar cannot drift from the actual flow, and keep the textual "Step X of Y" for screen readers.
- Rendering an error summary but not moving focus or scrolling to it, so keyboard and screen-reader users hear nothing and stay at the bottom of the form after pressing Next.

## Accessibility

- Label every control programmatically. Use the Field render-function child so the control receives the generated id and the aria-labelledby / aria-describedby wiring; a plain element child leaves the visible label's htmlFor pointing at an id that no element uses, which is a serious screen-reader defect.
- Field also forwards the required/invalid state to the control, and the hint plus validationMessage are referenced through aria-describedby, so the message is announced when the control takes focus - users do not have to hunt for the text.
- Announce step changes and validation failures. The visible "Step X of Y" text in CardHeader should be in the DOM before the fields, and the error MessageBar should use politeness="polite" so it is announced without interrupting typing. Never move focus on every keystroke; move it only when the user presses Next and validation fails.
- When a step fails validation, move focus to the error summary or to the first invalid field, and make sure the summary is visible (scroll it into view) rather than rendering it above off-screen content.
- With TabList, render the active step inside role="tabpanel" with an accessible name, keep selectTabOnFocus={false} so arrow-key focus does not silently change steps, and disable tabs that must not be reachable. Tabs that are disabled are removed from the tab order, which is the correct signal that they cannot be visited yet.
- In a Dialog, DialogTitle supplies the accessible name of the surface. Keep the surface open while the async submit is pending, disable the cancel/submit buttons, and rely on DialogTrigger's close action so focus returns to the trigger element afterwards.
- Use exactly one appearance="primary" button per step so the primary action is unambiguous, and use RadioGroup (radiogroup semantics) rather than styling buttons as radios.
- ProgressBar is visual only; keep the textual step indicator as well, and give the bar an aria-label when the step text is not adjacent to it.

## Components used

- [Button](../../components/button.md)
- [Card](../../components/card.md)
- [CardFooter](../../components/card-footer.md)
- [CardHeader](../../components/card-header.md)
- [Checkbox](../../components/checkbox.md)
- [Dialog](../../components/dialog.md)
- [DialogActions](../../components/dialog-actions.md)
- [DialogBody](../../components/dialog-body.md)
- [DialogContent](../../components/dialog-content.md)
- [DialogSurface](../../components/dialog-surface.md)
- [DialogTitle](../../components/dialog-title.md)
- [DialogTrigger](../../components/dialog-trigger.md)
- [Divider](../../components/divider.md)
- [Field](../../components/field.md)
- [Input](../../components/input.md)
- [MessageBar](../../components/message-bar.md)
- [MessageBarBody](../../components/message-bar-body.md)
- [MessageBarTitle](../../components/message-bar-title.md)
- [ProgressBar](../../components/progress-bar.md)
- [Radio](../../components/radio.md)
- [RadioGroup](../../components/radio-group.md)
- [Select](../../components/select.md)
- [Spinner](../../components/spinner.md)
- [Tab](../../components/tab.md)
- [TabList](../../components/tab-list.md)
- [Text](../../components/text.md)
- [Textarea](../../components/textarea.md)

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
