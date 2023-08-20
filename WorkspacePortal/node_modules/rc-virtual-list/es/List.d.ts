import * as React from 'react';
import type { InnerProps } from './Filler';
import type { ScrollBarDirectionType } from './ScrollBar';
import type { RenderFunc } from './interface';
export type ScrollAlign = 'top' | 'bottom' | 'auto';
export type ScrollConfig = {
    index: number;
    align?: ScrollAlign;
    offset?: number;
} | {
    key: React.Key;
    align?: ScrollAlign;
    offset?: number;
};
export type ScrollTo = (arg: number | ScrollConfig) => void;
export type ListRef = {
    scrollTo: ScrollTo;
};
export interface ListProps<T> extends Omit<React.HTMLAttributes<any>, 'children'> {
    prefixCls?: string;
    children: RenderFunc<T>;
    data: T[];
    height?: number;
    itemHeight?: number;
    /** If not match virtual scroll condition, Set List still use height of container. */
    fullHeight?: boolean;
    itemKey: React.Key | ((item: T) => React.Key);
    component?: string | React.FC<any> | React.ComponentClass<any>;
    /** Set `false` will always use real scroll instead of virtual one */
    virtual?: boolean;
    direction?: ScrollBarDirectionType;
    onScroll?: React.UIEventHandler<HTMLElement>;
    /** Trigger when render list item changed */
    onVisibleChange?: (visibleList: T[], fullList: T[]) => void;
    /** Inject to inner container props. Only use when you need pass aria related data */
    innerProps?: InnerProps;
}
export declare function RawList<T>(props: ListProps<T>, ref: React.Ref<ListRef>): React.JSX.Element;
declare const _default: <Item = any>(props: ListProps<Item> & {
    ref?: React.Ref<ListRef>;
}) => React.ReactElement;
export default _default;
