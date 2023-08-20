import * as React from 'react';
import type { InputProps, InputRef } from './Input';
type VisibilityToggle = {
    visible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
};
export interface PasswordProps extends InputProps {
    readonly inputPrefixCls?: string;
    readonly action?: string;
    visibilityToggle?: boolean | VisibilityToggle;
    iconRender?: (visible: boolean) => React.ReactNode;
}
declare const Password: React.ForwardRefExoticComponent<PasswordProps & React.RefAttributes<InputRef>>;
export default Password;
