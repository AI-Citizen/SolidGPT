import type { BaseSelectRef, SelectProps as RcSelectProps } from 'rc-select';
import { OptGroup, Option } from 'rc-select';
import type { OptionProps } from 'rc-select/lib/Option';
import type { BaseOptionType, DefaultOptionType } from 'rc-select/lib/Select';
import * as React from 'react';
import type { SelectCommonPlacement } from '../_util/motion';
import type { InputStatus } from '../_util/statusUtils';
import type { SizeType } from '../config-provider/SizeContext';
type RawValue = string | number;
export type { BaseOptionType, DefaultOptionType, OptionProps, BaseSelectRef as RefSelectProps };
export interface LabeledValue {
    key?: string;
    value: RawValue;
    label: React.ReactNode;
}
export type SelectValue = RawValue | RawValue[] | LabeledValue | LabeledValue[] | undefined;
export interface InternalSelectProps<ValueType = any, OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType> extends Omit<RcSelectProps<ValueType, OptionType>, 'mode'> {
    suffixIcon?: React.ReactNode;
    size?: SizeType;
    disabled?: boolean;
    mode?: 'multiple' | 'tags' | 'SECRET_COMBOBOX_MODE_DO_NOT_USE' | 'combobox';
    bordered?: boolean;
    /**
     * @deprecated `showArrow` is deprecated which will be removed in next major version. It will be a
     *   default behavior, you can hide it by setting `suffixIcon` to null.
     */
    showArrow?: boolean;
}
export interface SelectProps<ValueType = any, OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType> extends Omit<InternalSelectProps<ValueType, OptionType>, 'mode' | 'getInputElement' | 'getRawInputElement' | 'backfill' | 'placement'> {
    placement?: SelectCommonPlacement;
    mode?: 'multiple' | 'tags';
    status?: InputStatus;
    popupClassName?: string;
    /** @deprecated Please use `popupClassName` instead */
    dropdownClassName?: string;
    rootClassName?: string;
    /** @deprecated Please use `popupMatchSelectWidth` instead */
    dropdownMatchSelectWidth?: boolean | number;
    popupMatchSelectWidth?: boolean | number;
}
declare const Select: (<ValueType = any, OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType>(props: SelectProps<ValueType, OptionType> & {
    children?: React.ReactNode;
} & {
    ref?: React.Ref<BaseSelectRef> | undefined;
}) => React.ReactElement) & {
    displayName?: string | undefined;
    SECRET_COMBOBOX_MODE_DO_NOT_USE: string;
    Option: typeof Option;
    OptGroup: typeof OptGroup;
    _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
};
declare const PurePanel: (props: any) => React.JSX.Element;
export default Select;
