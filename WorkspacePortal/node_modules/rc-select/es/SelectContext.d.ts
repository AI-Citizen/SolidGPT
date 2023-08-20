import * as React from 'react';
import type { RawValueType, RenderNode } from './BaseSelect';
import type { FlattenOptionData } from './interface';
import type { BaseOptionType, FieldNames, OnActiveValue, OnInternalSelect } from './Select';
export interface SelectContextProps {
    options: BaseOptionType[];
    flattenOptions: FlattenOptionData<BaseOptionType>[];
    onActiveValue: OnActiveValue;
    defaultActiveFirstOption?: boolean;
    onSelect: OnInternalSelect;
    menuItemSelectedIcon?: RenderNode;
    rawValues: Set<RawValueType>;
    fieldNames?: FieldNames;
    virtual?: boolean;
    direction?: "ltr" | "rtl";
    listHeight?: number;
    listItemHeight?: number;
    childrenAsData?: boolean;
}
declare const SelectContext: React.Context<SelectContextProps>;
export default SelectContext;
