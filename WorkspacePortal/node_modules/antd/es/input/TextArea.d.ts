import type { TextAreaRef as RcTextAreaRef } from 'rc-textarea';
import type { TextAreaProps as RcTextAreaProps } from 'rc-textarea/lib/interface';
import * as React from 'react';
import type { InputStatus } from '../_util/statusUtils';
import type { SizeType } from '../config-provider/SizeContext';
import type { InputFocusOptions } from './Input';
export interface TextAreaProps extends Omit<RcTextAreaProps, 'suffix'> {
    bordered?: boolean;
    size?: SizeType;
    status?: InputStatus;
}
export interface TextAreaRef {
    focus: (options?: InputFocusOptions) => void;
    blur: () => void;
    resizableTextArea?: RcTextAreaRef['resizableTextArea'];
}
declare const TextArea: React.ForwardRefExoticComponent<TextAreaProps & React.RefAttributes<TextAreaRef>>;
export default TextArea;
