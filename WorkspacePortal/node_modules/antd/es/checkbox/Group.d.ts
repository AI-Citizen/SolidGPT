import * as React from 'react';
import type { CheckboxChangeEvent } from './Checkbox';
import GroupContext from './GroupContext';
export type CheckboxValueType = string | number | boolean;
export interface CheckboxOptionType {
    label: React.ReactNode;
    value: CheckboxValueType;
    style?: React.CSSProperties;
    disabled?: boolean;
    title?: string;
    onChange?: (e: CheckboxChangeEvent) => void;
}
export interface AbstractCheckboxGroupProps {
    prefixCls?: string;
    className?: string;
    rootClassName?: string;
    options?: Array<CheckboxOptionType | string | number>;
    disabled?: boolean;
    style?: React.CSSProperties;
}
export interface CheckboxGroupProps extends AbstractCheckboxGroupProps {
    name?: string;
    defaultValue?: Array<CheckboxValueType>;
    value?: Array<CheckboxValueType>;
    onChange?: (checkedValue: Array<CheckboxValueType>) => void;
    children?: React.ReactNode;
}
export type { CheckboxGroupContext } from './GroupContext';
export { GroupContext };
declare const _default: React.MemoExoticComponent<React.ForwardRefExoticComponent<CheckboxGroupProps & React.RefAttributes<HTMLDivElement>>>;
export default _default;
