import type { BaseInputProps, ShowCountProps } from 'rc-input/lib/interface';
import type React from 'react';
import type { CSSProperties } from 'react';
export interface AutoSizeType {
    minRows?: number;
    maxRows?: number;
}
export interface ResizableTextAreaRef {
    textArea: HTMLTextAreaElement;
}
export type HTMLTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export type TextAreaProps = Omit<HTMLTextareaProps, 'onResize'> & {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    autoSize?: boolean | AutoSizeType;
    onPressEnter?: React.KeyboardEventHandler<HTMLTextAreaElement>;
    onResize?: (size: {
        width: number;
        height: number;
    }) => void;
    showCount?: boolean | ShowCountProps;
    classes?: {
        countWrapper?: string;
        affixWrapper?: string;
    };
    classNames?: {
        textarea?: string;
        count?: string;
    };
    styles?: {
        textarea?: CSSProperties;
        count?: CSSProperties;
    };
} & Pick<BaseInputProps, 'allowClear' | 'suffix'>;
export type TextAreaRef = {
    resizableTextArea: ResizableTextAreaRef;
    focus: () => void;
    blur: () => void;
};
