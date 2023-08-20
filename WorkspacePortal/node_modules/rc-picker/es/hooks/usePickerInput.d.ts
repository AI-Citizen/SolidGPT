import type * as React from 'react';
export default function usePickerInput({ open, value, isClickOutside, triggerOpen, forwardKeyDown, onKeyDown, blurToCancel, onSubmit, onCancel, onFocus, onBlur, changeOnBlur, }: {
    open: boolean;
    value: string;
    isClickOutside: (clickElement: EventTarget | null) => boolean;
    triggerOpen: (open: boolean) => void;
    forwardKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => boolean;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, preventDefault: () => void) => void;
    blurToCancel?: boolean;
    onSubmit: () => void | boolean;
    onCancel: () => void;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    changeOnBlur?: boolean;
}): [React.DOMAttributes<HTMLInputElement>, {
    focused: boolean;
    typing: boolean;
}];
