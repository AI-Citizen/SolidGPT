import type { InputRef, InputProps as RcInputProps } from 'rc-input';
import React from 'react';
import type { InputStatus } from '../_util/statusUtils';
import type { SizeType } from '../config-provider/SizeContext';
export interface InputFocusOptions extends FocusOptions {
    cursor?: 'start' | 'end' | 'all';
}
export type { InputRef };
export declare function triggerFocus(element?: HTMLInputElement | HTMLTextAreaElement, option?: InputFocusOptions): void;
export interface InputProps extends Omit<RcInputProps, 'wrapperClassName' | 'groupClassName' | 'inputClassName' | 'affixWrapperClassName' | 'classes'> {
    rootClassName?: string;
    size?: SizeType;
    disabled?: boolean;
    status?: InputStatus;
    bordered?: boolean;
    [key: `data-${string}`]: string | undefined;
}
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<InputRef>>;
export default Input;
