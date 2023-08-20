import * as React from 'react';
import type { CheckboxRef } from '../checkbox';
import type { AbstractCheckboxProps } from '../checkbox/Checkbox';
import type { RadioChangeEvent } from './interface';
export type RadioButtonProps = AbstractCheckboxProps<RadioChangeEvent>;
declare const _default: React.ForwardRefExoticComponent<RadioButtonProps & React.RefAttributes<CheckboxRef>>;
export default _default;
