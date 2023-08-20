import type { BaseSelectRef } from 'rc-select';
import type { TreeSelectProps as RcTreeSelectProps } from 'rc-tree-select';
import { SHOW_ALL, SHOW_CHILD, SHOW_PARENT, TreeNode } from 'rc-tree-select';
import type { BaseOptionType, DefaultOptionType } from 'rc-tree-select/lib/TreeSelect';
import * as React from 'react';
import type { SelectCommonPlacement } from '../_util/motion';
import type { InputStatus } from '../_util/statusUtils';
import type { SizeType } from '../config-provider/SizeContext';
import type { TreeProps } from '../tree';
import type { SwitcherIcon } from '../tree/Tree';
type RawValue = string | number;
export interface LabeledValue {
    key?: string;
    value: RawValue;
    label: React.ReactNode;
}
export type SelectValue = RawValue | RawValue[] | LabeledValue | LabeledValue[];
export interface TreeSelectProps<ValueType = any, OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType> extends Omit<RcTreeSelectProps<ValueType, OptionType>, 'showTreeIcon' | 'treeMotion' | 'mode' | 'getInputElement' | 'backfill' | 'treeLine' | 'switcherIcon'> {
    suffixIcon?: React.ReactNode;
    size?: SizeType;
    disabled?: boolean;
    placement?: SelectCommonPlacement;
    popupClassName?: string;
    /** @deprecated Please use `popupClassName` instead */
    dropdownClassName?: string;
    bordered?: boolean;
    treeLine?: TreeProps['showLine'];
    status?: InputStatus;
    switcherIcon?: SwitcherIcon | RcTreeSelectProps<ValueType, OptionType>['switcherIcon'];
    rootClassName?: string;
    [key: `aria-${string}`]: React.AriaAttributes[keyof React.AriaAttributes];
    /** @deprecated Please use `popupMatchSelectWidth` instead */
    dropdownMatchSelectWidth?: boolean | number;
    popupMatchSelectWidth?: boolean | number;
    /**
     * @deprecated `showArrow` is deprecated which will be removed in next major version. It will be a
     *   default behavior, you can hide it by setting `suffixIcon` to null.
     */
    showArrow?: boolean;
}
declare const TreeSelectRef: <ValueType = any, OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType>(props: TreeSelectProps<ValueType, OptionType> & {
    children?: React.ReactNode;
} & {
    ref?: React.Ref<BaseSelectRef> | undefined;
}) => React.ReactElement;
type InternalTreeSelectType = typeof TreeSelectRef;
type CompoundedComponent = InternalTreeSelectType & {
    displayName?: string;
    TreeNode: typeof TreeNode;
    SHOW_ALL: typeof SHOW_ALL;
    SHOW_PARENT: typeof SHOW_PARENT;
    SHOW_CHILD: typeof SHOW_CHILD;
    _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
};
declare const TreeSelect: CompoundedComponent;
declare const PurePanel: (props: any) => React.JSX.Element;
export { TreeNode };
export default TreeSelect;
