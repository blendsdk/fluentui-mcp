## API Report File for "@fluentui/react-button"

```ts

// @public
export type ButtonProps = ComponentProps<ButtonSlots> & {
  appearance?: 'primary' | 'secondary' | 'outline' | 'subtle' | 'transparent';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  disabledFocusable?: boolean;
  iconPosition?: 'before' | 'after';
  shape?: 'rounded' | 'circular' | 'square';
};

// @public
export type ButtonSlots = {
  root: NonNullable<Slot<'button'>>;
  icon?: Slot<'span'>;
};

// @public
export type ButtonState = ComponentState<ButtonSlots> & Required<Pick<ButtonProps, 'appearance' | 'size'>>;

```
