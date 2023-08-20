import * as React from 'react';
export interface ItemProps {
    className: string;
    children: React.ReactNode;
    index: number;
    direction?: 'horizontal' | 'vertical';
    marginDirection: 'marginLeft' | 'marginRight';
    split?: React.ReactNode;
    wrap?: boolean;
    style?: React.CSSProperties;
}
declare const Item: React.FC<ItemProps>;
export default Item;
