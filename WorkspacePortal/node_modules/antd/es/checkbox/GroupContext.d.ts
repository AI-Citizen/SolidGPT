import React from 'react';
import type { CheckboxOptionType } from './Group';
export interface CheckboxGroupContext {
    name?: string;
    toggleOption?: (option: CheckboxOptionType) => void;
    value?: any;
    disabled?: boolean;
    registerValue: (val: string) => void;
    cancelValue: (val: string) => void;
}
declare const GroupContext: React.Context<CheckboxGroupContext | null>;
export default GroupContext;
