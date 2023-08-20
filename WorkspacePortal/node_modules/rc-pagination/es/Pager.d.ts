import React from 'react';
interface Props {
    last?: boolean;
    locale?: any;
    rootPrefixCls: string;
    page: number;
    active?: boolean;
    className?: string;
    showTitle: boolean;
    onClick?: (page: number) => void;
    onKeyPress?: (e: React.KeyboardEvent<HTMLLIElement>, onClick: Props['onClick'], page: Props['page']) => void;
    itemRender?: (page: number, type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next', element: React.ReactNode) => React.ReactNode;
}
declare const Pager: React.FC<Props>;
export default Pager;
