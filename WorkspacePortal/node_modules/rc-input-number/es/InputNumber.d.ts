import { ValueType } from '@rc-component/mini-decimal';
import * as React from 'react';
export type { ValueType };
export interface InputNumberProps<T extends ValueType = ValueType> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onInput' | 'onChange' | 'prefix' | 'suffix'> {
    /** value will show as string */
    stringMode?: boolean;
    defaultValue?: T;
    value?: T | null;
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    min?: T;
    max?: T;
    step?: ValueType;
    tabIndex?: number;
    controls?: boolean;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    addonBefore?: React.ReactNode;
    addonAfter?: React.ReactNode;
    classes?: {
        affixWrapper?: string;
        group?: string;
        wrapper?: string;
    };
    classNames?: {
        affixWrapper?: string;
        group?: string;
        wrapper?: string;
        input?: string;
    };
    upHandler?: React.ReactNode;
    downHandler?: React.ReactNode;
    keyboard?: boolean;
    /** Parse display value to validate number */
    parser?: (displayValue: string | undefined) => T;
    /** Transform `value` to display value show in input */
    formatter?: (value: T | undefined, info: {
        userTyping: boolean;
        input: string;
    }) => string;
    /** Syntactic sugar of `formatter`. Config precision of display. */
    precision?: number;
    /** Syntactic sugar of `formatter`. Config decimal separator of display. */
    decimalSeparator?: string;
    onInput?: (text: string) => void;
    onChange?: (value: T | null) => void;
    onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
    onStep?: (value: T, info: {
        offset: ValueType;
        type: 'up' | 'down';
    }) => void;
}
declare const InputNumber: (<T extends ValueType = ValueType>(props: InputNumberProps<T> & {
    children?: React.ReactNode;
} & {
    ref?: React.Ref<HTMLInputElement>;
}) => React.ReactElement) & {
    displayName?: string;
};
export default InputNumber;
