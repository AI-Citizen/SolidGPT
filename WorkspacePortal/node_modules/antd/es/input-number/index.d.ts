import type { InputNumberProps as RcInputNumberProps, ValueType } from 'rc-input-number';
import * as React from 'react';
import type { InputStatus } from '../_util/statusUtils';
import type { SizeType } from '../config-provider/SizeContext';
export interface InputNumberProps<T extends ValueType = ValueType> extends Omit<RcInputNumberProps<T>, 'prefix' | 'size' | 'controls'> {
    prefixCls?: string;
    rootClassName?: string;
    addonBefore?: React.ReactNode;
    addonAfter?: React.ReactNode;
    prefix?: React.ReactNode;
    size?: SizeType;
    disabled?: boolean;
    bordered?: boolean;
    status?: InputStatus;
    controls?: boolean | {
        upIcon?: React.ReactNode;
        downIcon?: React.ReactNode;
    };
}
declare const TypedInputNumber: (<T extends ValueType = ValueType>(props: InputNumberProps<T> & {
    children?: React.ReactNode;
} & {
    ref?: React.Ref<HTMLInputElement> | undefined;
}) => React.ReactElement) & {
    displayName?: string | undefined;
    _InternalPanelDoNotUseOrYouWillBeFired: typeof PureInputNumber;
};
/** @private Internal Component. Do not use in your production. */
declare const PureInputNumber: React.FC<InputNumberProps>;
export default TypedInputNumber;
