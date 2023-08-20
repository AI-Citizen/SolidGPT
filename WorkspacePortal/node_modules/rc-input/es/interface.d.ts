import type { CSSProperties, InputHTMLAttributes, KeyboardEventHandler, MouseEventHandler, ReactElement, ReactNode } from 'react';
import type { InputFocusOptions } from './utils/commonUtils';
import type { LiteralUnion } from './utils/types';
export interface CommonInputProps {
    prefix?: ReactNode;
    suffix?: ReactNode;
    addonBefore?: ReactNode;
    addonAfter?: ReactNode;
    /** @deprecated Use `classNames` instead */
    classes?: {
        affixWrapper?: string;
        group?: string;
        wrapper?: string;
    };
    classNames?: {
        affixWrapper?: string;
        prefix?: string;
        suffix?: string;
    };
    styles?: {
        affixWrapper?: CSSProperties;
        prefix?: CSSProperties;
        suffix?: CSSProperties;
    };
    allowClear?: boolean | {
        clearIcon?: ReactNode;
    };
}
type DataAttr = Record<`data-${string}`, string>;
export interface BaseInputProps extends CommonInputProps {
    value?: InputHTMLAttributes<HTMLInputElement>['value'];
    inputElement: ReactElement;
    prefixCls?: string;
    className?: string;
    style?: CSSProperties;
    disabled?: boolean;
    focused?: boolean;
    triggerFocus?: () => void;
    readOnly?: boolean;
    handleReset?: MouseEventHandler;
    hidden?: boolean;
    dataAttrs?: {
        affixWrapper?: DataAttr;
    };
    components?: {
        affixWrapper?: 'span' | 'div';
        groupWrapper?: 'span' | 'div';
        wrapper?: 'span' | 'div';
        groupAddon?: 'span' | 'div';
    };
}
export interface ShowCountProps {
    formatter: (args: {
        value: string;
        count: number;
        maxLength?: number;
    }) => ReactNode;
}
export interface InputProps extends CommonInputProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'type'> {
    prefixCls?: string;
    type?: LiteralUnion<'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week', string>;
    onPressEnter?: KeyboardEventHandler<HTMLInputElement>;
    showCount?: boolean | ShowCountProps;
    autoComplete?: string;
    htmlSize?: number;
    classNames?: CommonInputProps['classNames'] & {
        input?: string;
        count?: string;
    };
    styles?: CommonInputProps['styles'] & {
        input?: CSSProperties;
        count?: CSSProperties;
    };
}
export interface InputRef {
    focus: (options?: InputFocusOptions) => void;
    blur: () => void;
    setSelectionRange: (start: number, end: number, direction?: 'forward' | 'backward' | 'none') => void;
    select: () => void;
    input: HTMLInputElement | null;
}
export {};
