import type { DisplayValueType, Mode } from '../interface';
import type { ReactNode } from 'react';
import React from 'react';
export declare function useAllowClear(prefixCls: any, onClearMouseDown: any, displayValues: DisplayValueType[], allowClear?: boolean | {
    clearIcon?: ReactNode;
}, clearIcon?: ReactNode, disabled?: boolean, mergedSearchValue?: string, mode?: Mode): {
    allowClear: boolean;
    clearIcon: React.JSX.Element;
};
