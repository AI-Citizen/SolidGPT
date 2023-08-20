import React from 'react';
import type { TextAreaRef } from './interface';
declare const TextArea: React.ForwardRefExoticComponent<Omit<import("./interface").HTMLTextareaProps, "onResize"> & {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    autoSize?: boolean | import("./interface").AutoSizeType;
    onPressEnter?: React.KeyboardEventHandler<HTMLTextAreaElement>;
    onResize?: (size: {
        width: number;
        height: number;
    }) => void;
    showCount?: boolean | import("rc-input/lib/interface").ShowCountProps;
    classes?: {
        countWrapper?: string;
        affixWrapper?: string;
    };
    classNames?: {
        textarea?: string;
        count?: string;
    };
    styles?: {
        textarea?: React.CSSProperties;
        count?: React.CSSProperties;
    };
} & Pick<import("rc-input/lib/interface").BaseInputProps, "allowClear" | "suffix"> & React.RefAttributes<TextAreaRef>>;
export default TextArea;
