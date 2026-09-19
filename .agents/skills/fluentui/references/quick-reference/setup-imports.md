# Setup & Imports Cheatsheet

> **Category**: quick-reference

## 1. Packages — install what you use

| Area | Package | Entry import |
|---|---|---|
| Core components (all standard UI) | `@fluentui/react-components` | `import { Button } from '@fluentui/react-components';` |
| Calendar (compat) | `@fluentui/react-calendar-compat` | `import { CalendarCompat } from '@fluentui/react-calendar-compat';` |
| Date picker (compat) | `@fluentui/react-datepicker-compat` | `import { DatepickerCompat } from '@fluentui/react-datepicker-compat';` |
| Time picker (compat) | `@fluentui/react-timepicker-compat` | `import { TimepickerCompat } from '@fluentui/react-timepicker-compat';` |
| Context selector | `@fluentui/react-context-selector` | `import { ContextSelector } from '@fluentui/react-context-selector';` |
| Menu grid (preview) | `@fluentui/react-menu-grid-preview` | `import { MenuGridPreview } from '@fluentui/react-menu-grid-preview';` |
| Motion components (preview) | `@fluentui/react-motion-components-preview` | `import { MotionComponentsPreview } from '@fluentui/react-motion-components-preview';` |
| Headless components (preview) | `@fluentui/react-headless-components-preview` | `import { HeadlessComponentsPreview } from '@fluentui/react-headless-components-preview';` |

Install examples:

```sh
npm i @fluentui/react-components
npm i @fluentui/react-datepicker-compat @fluentui/react-timepicker-compat @fluentui/react-calendar-compat
npm i @fluentui/react-context-selector @fluentui/react-menu-grid-preview
```

## 2. Import map by category (core package)

Everything below comes from the **single** entry point `@fluentui/react-components`.

| Category | Components |
|---|---|
| Buttons | `Button` |
| Forms | `Checkbox`, `ColorPicker`, `Combobox`, `Field`, `InfoLabel`, `Input`, `Label`, `Radio`, `Rating`, `Search`, `Select`, `Slider`, `SpinButton`, `SwatchPicker`, `Switch`, `TagPicker`, `Textarea` |
| Data display | `Avatar`, `Badge`, `Image`, `List`, `Persona`, `Skeleton`, `Table`, `Tags`, `Text`, `Tree` |
| Feedback | `Dialog`, `MessageBar`, `ProgressBar`, `Spinner`, `Toast`, `Tooltip` |
| Navigation | `Breadcrumb`, `Link`, `Menu`, `Nav`, `Tabs` |
| Layout | `Card`, `Divider` |
| Overlays | `Drawer`, `Popover`, `TeachingPopover` |
| Layout utilities | `Accordion`, `Carousel`, `Overflow`, `Portal`, `FluentProvider` |

### Separate packages — NOT importable from the core entry point

| Component | Package |
|---|---|
| `CalendarCompat` | `@fluentui/react-calendar-compat` |
| `DatepickerCompat` | `@fluentui/react-datepicker-compat` |
| `TimepickerCompat` | `@fluentui/react-timepicker-compat` |
| `ContextSelector` | `@fluentui/react-context-selector` |
| `MenuGridPreview` | `@fluentui/react-menu-grid-preview` |
| `MotionComponentsPreview` | `@fluentui/react-motion-components-preview` |
| `HeadlessComponentsPreview` | `@fluentui/react-headless-components-preview` |

## 3. Root setup — `FluentProvider`

Wrap the app (or the surface that needs theming) in `FluentProvider`.

| Prop | Type | Purpose |
|---|---|---|
| `theme` | `PartialTheme` | Token overrides; partial sets merge with the parent theme |
| `dir` | `'ltr' \| 'rtl'` | Text + positioning direction |
| `targetDocument` | `Document` | Document used by portals/children (iframes, popups) |
| `applyStylesToPortals` | `boolean` | Push provider styles into portal subtrees |
| `customStyleHooks_unstable` | `FluentProviderCustomStyleHooks` | Per-slot style hooks |
| `overrides_unstable` | `OverridesContextValue_unstable` | Internal override values |

## 4. `Portal` — where content lands

| Prop | Type |
|---|---|
| `children` | `any` |
| `mountNode` | `HTMLElement \| { element?: HTMLElement \| null; className?: string; } \| null` |

Combine `Portal mountNode` with `FluentProvider targetDocument` + `applyStylesToPortals` for iframes / SSR / shadow DOM hosts.

## 5. Required-props quick check (before importing)

| Component | Required props |
|---|---|
| `Dialog` | `children` |
| `Menu` | `children` |
| `Motion` | `children` (plus `direction` on the presence variants) |
| `Overflow` | `id`, `children` |
| `Tooltip` | `relationship` (`label` / `description` / `inaccessible`) |
| `TagPicker` | `children` |
| `Tags` | `root`, `value` |
| `CalendarCompat` | `navigatedDate`, `navigationIcons`, `onNavigateDate`, `selectedDate`, `strings` |
| `MenuGridPreview` | `root` slots (row / grid / item parts) |
| `TeachingPopover` parts | `value`, `altText`, `initialStepText`, `finalStepText`, `children`, `handleButtonClick`, `root` |

## 6. Names that collide with HTML/DOM names — alias on import

`FluentProvider`, `Text`, `Image`, `Field`, `Label`, `List`, `Menu`, `Nav`, `Table`, `Link`, `Search`, `Select`, `Toast`, `Divider`.

```tsx
import { FluentProvider, Text as FluentText, Image as FluentImage, Field as FluentField } from '@fluentui/react-components';
```

## 7. Entry-point rules

- One root import per package (table in §1) — no additional deep/private paths are documented here.
- Preview capabilities ship as their own packages (`MenuGridPreview`, `MotionComponentsPreview`, `HeadlessComponentsPreview`).
- Focus, positioning, and motion primitives such as Tabster and Positioning live in their own `@fluentui/react-*` packages; they are not exports of `@fluentui/react-components`.
- Slot props (`icon`, `contentBefore`, `contentAfter`, `label`, `validationMessage`, `hint`, `checkbox`, `floatingAction`, …) are passed as normal JSX props on the imported component.

## Key Takeaways

- All standard components (Button, Input, Dialog, Table, Tree, …) import from ONE path: '@fluentui/react-components'.
- Seven things import from their own packages: CalendarCompat, DatepickerCompat, TimepickerCompat, ContextSelector, MenuGridPreview, MotionComponentsPreview, HeadlessComponentsPreview.
- Wrap the render tree in Provider — it owns theme (PartialTheme), dir ('ltr' | 'rtl'), targetDocument and applyStylesToPortals.
- Portal + mountNode decides where overlay/portal content is mounted; pair it with Provider targetDocument so portal content is styled in the right document.
- Import names are exact PascalCase component names and can be aliased (Provider as FluentProvider) to avoid collisions with HTML/DOM names.
- Check required props before importing: Dialog/Menu/Aria/Motion need children, Overflow needs id + children, Tooltip needs relationship, CalendarCompat needs five props.

## Examples

### App root with Provider

Wrap the render tree in Provider so theme, direction and portal styling are applied to every imported component.

```tsx
import * as React from 'react';
import { FluentProvider, Button, Field, Input, Spinner } from '@fluentui/react-components';

type AppProps = { theme: React.ComponentProps<typeof Provider>['theme'] };

export const App = ({ theme }: AppProps) => (
  <FluentProvider theme={theme} dir='ltr' applyStylesToPortals>
    <Field label='Name' required>
      <Input placeholder='Ada Lovelace' size='medium' />
    </Field>
    <Button appearance='primary' iconPosition='before'>
      Save
    </Button>
    <Spinner size='tiny' label='Loading' />
  </FluentProvider>
);
```

### Core imports grouped by category

All standard components come from the same package root; group imports by area for readability.

```tsx
// Data display
import { Avatar, Badge, Image, List, Persona, Skeleton, Table, TagGroup, Text, Tree } from '@fluentui/react-components';

// Forms
import { Checkbox, ColorPicker, Combobox, Field, InfoLabel, Input, Label, Radio, Rating, SearchBox, Select, Slider, SpinButton, SwatchPicker, Switch, TagPicker, Textarea } from '@fluentui/react-components';

// Feedback, overlays, navigation
import { Dialog, MessageBar, ProgressBar, Spinner, Toast, Tooltip, Drawer, Popover, TeachingPopover, Breadcrumb, Link, Menu, Nav } from '@fluentui/react-components';

// Layout + utilities
import { Card, Divider, Accordion, Carousel, Overflow, Portal, FluentProvider } from '@fluentui/react-components';
```

### Compat pickers use their own packages

CalendarCompat, DatepickerCompat and TimepickerCompat are not part of @fluentui/react-components and must be installed separately.

```tsx
import { Field } from '@fluentui/react-components';
import { DatepickerCompat } from '@fluentui/react-datepicker-compat';
import { TimepickerCompat } from '@fluentui/react-timepicker-compat';
import { CalendarCompat } from '@fluentui/react-calendar-compat';

export const Scheduling = () => (
  <Field label='Start date'>
    <DatepickerCompat
      placeholder='Pick a date'
      allowTextInput
      onSelectDate={(date) => console.log(date)}
    />
  </Field>
);
```

### Portal with a custom mount node

Portal moves overlay content into an element you choose; feed the same document to Provider for styles.

```tsx
import { Portal, Spinner, FluentProvider } from '@fluentui/react-components';

export const EmbeddedApp = ({ host, hostDocument }: { host: HTMLElement; hostDocument: Document }) => (
  <FluentProvider targetDocument={hostDocument} applyStylesToPortals dir='rtl'>
    <Portal mountNode={host}>
      <Spinner size='small' label='Loading' />
    </Portal>
  </FluentProvider>
);

// mountNode can also carry a className:
// <Portal mountNode={{ element: host, className: 'my-portal-root' }} />
```

### Aliasing colliding component names

Generic names such as Provider, Text, Image and Field are easy to alias at the import site.

```tsx
import * as React from 'react';
import { FluentProvider, Text as FluentText, Image as FluentImage, Field as FluentField, Input } from '@fluentui/react-components';

export const Form = () => (
  <FluentProvider dir='ltr'>
    <FluentField label='Email'>
      <Input type='email' placeholder='name@example.com' />
    </FluentField>
    <FluentText size={200} block>
      We never share your address.
    </FluentText>
  </FluentProvider>
);
```

### Preview + integration packages

MenuGridPreview, MotionComponentsPreview, HeadlessComponentsPreview and ContextSelector each import from their own package root.

```tsx
import { ContextSelector } from '@fluentui/react-context-selector';
import { MenuGridPreview } from '@fluentui/react-menu-grid-preview';
import { MotionComponentsPreview } from '@fluentui/react-motion-components-preview';
import { HeadlessComponentsPreview } from '@fluentui/react-headless-components-preview';
```

### Direction and theme toggling at runtime

Provider accepts only 'ltr' | 'rtl' and a PartialTheme, so re-rendering it is enough to flip direction or swap tokens.

```tsx
import * as React from 'react';
import { FluentProvider, Button, Breadcrumb } from '@fluentui/react-components';

export const DirectionDemo = () => {
  const [dir, setDir] = React.useState<'ltr' | 'rtl'>('ltr');
  return (
    <FluentProvider dir={dir} applyStylesToPortals>
      <Button appearance='subtle' onClick={() => setDir(dir === 'ltr' ? 'rtl' : 'ltr')}>
        Toggle direction
      </Button>
      <Breadcrumb size='medium'>Home</Breadcrumb>
    </FluentProvider>
  );
};
```

## Pitfalls

- Trying `import { DatepickerCompat } from '@fluentui/react-components'` — the compat pickers (DatepickerCompat, TimepickerCompat, CalendarCompat) only exist in their own packages and will resolve to undefined.
- Rendering components without Provider — theme tokens, direction and portal styling are not applied, so components look unstyled or use the wrong direction.
- Mounting overlays via Portal into another document without setting Provider targetDocument/applyStylesToPortals — popups render but lose Fluent styles.
- Name collisions with DOM/global names (Provider, Text, Image, Field, Label, List, Menu, Nav, Table, Link, Select, Toast) — alias at the import site.
- Assuming every prop is optional: Dialog/Menu/Aria/Motion require children, Overflow requires id and children, Tooltip requires relationship, TagPicker requires children, CalendarCompat requires navigatedDate/navigationIcons/onNavigateDate/selectedDate/strings.
- Importing preview capabilities (MenuGridPreview, MotionComponentsPreview, HeadlessComponentsPreview) from the core package — each ships from its own preview package.
- Passing a full theme object to Provider.theme — the prop is a PartialTheme, so only the tokens you pass are applied/merged.

**Referenced components**: Accordion, Aria, Avatar, Badge, Breadcrumb, Button, CalendarCompat, Card, Carousel, Checkbox, ColorPicker, Combobox, ContextSelector, DatepickerCompat, Dialog, Divider, Drawer, Field, HeadlessComponentsPreview, Image, Infolabel, Input, Label, Link, List, Menu, MenuGridPreview, MessageBar, Motion, MotionComponentsPreview, Nav, Overflow, Persona, Popover, Portal, Positioning, Progress, Provider, Radio, Rating, Search, Select, Skeleton, Slider, Spinbutton, Spinner, SwatchPicker, Switch, Table, Tabs, Tabster, TagPicker, Tags, TeachingPopover, Text, Textarea, TimepickerCompat, Toast, Toolbar, Tooltip, Tree, Utilities

<!-- Generated by scripts/skill/generate.ts — do not edit by hand. -->
