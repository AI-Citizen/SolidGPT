import type * as React from 'react';
import type { CheckboxProps } from './Checkbox';
import Group from './Group';
export type { CheckboxRef } from 'rc-checkbox';
export type { CheckboxChangeEvent, CheckboxProps } from './Checkbox';
export type { CheckboxGroupProps, CheckboxOptionType } from './Group';
type CompoundedComponent = React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>> & {
    Group: typeof Group;
};
declare const Checkbox: CompoundedComponent;
export default Checkbox;
