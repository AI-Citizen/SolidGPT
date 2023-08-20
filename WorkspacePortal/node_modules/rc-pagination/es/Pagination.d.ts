import React from 'react';
export interface PaginationLocale {
    items_per_page?: string;
    jump_to?: string;
    jump_to_confirm?: string;
    page?: string;
    prev_page?: string;
    next_page?: string;
    prev_5?: string;
    next_5?: string;
    prev_3?: string;
    next_3?: string;
}
export interface PaginationData {
    className: string;
    selectPrefixCls: string;
    prefixCls: string;
    pageSizeOptions: string[] | number[];
    current: number;
    defaultCurrent: number;
    total: number;
    totalBoundaryShowSizeChanger?: number;
    pageSize: number;
    defaultPageSize: number;
    hideOnSinglePage: boolean;
    showSizeChanger: boolean;
    showLessItems: boolean;
    showPrevNextJumpers: boolean;
    showQuickJumper: boolean | object;
    showTitle: boolean;
    simple: boolean;
    disabled: boolean;
    locale: PaginationLocale;
    style: React.CSSProperties;
    selectComponentClass: React.ComponentType;
    prevIcon: React.ComponentType | React.ReactNode;
    nextIcon: React.ComponentType | React.ReactNode;
    jumpPrevIcon: React.ComponentType | React.ReactNode;
    jumpNextIcon: React.ComponentType | React.ReactNode;
}
export interface PaginationProps extends Partial<PaginationData> {
    onChange?: (page: number, pageSize: number) => void;
    onShowSizeChange?: (current: number, size: number) => void;
    itemRender?: (page: number, type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next', element: React.ReactNode) => React.ReactNode;
    showTotal?: (total: number, range: [number, number]) => React.ReactNode;
}
interface PaginationState {
    current: number;
    currentInputValue: number;
    pageSize: number;
}
declare function noop(): void;
declare class Pagination extends React.Component<PaginationProps, PaginationState> {
    static defaultProps: {
        defaultCurrent: number;
        total: number;
        defaultPageSize: number;
        onChange: typeof noop;
        className: string;
        selectPrefixCls: string;
        prefixCls: string;
        selectComponentClass: any;
        hideOnSinglePage: boolean;
        showPrevNextJumpers: boolean;
        showQuickJumper: boolean;
        showLessItems: boolean;
        showTitle: boolean;
        onShowSizeChange: typeof noop;
        locale: {
            items_per_page: string;
            jump_to: string;
            jump_to_confirm: string;
            page: string;
            prev_page: string;
            next_page: string;
            prev_5: string;
            next_5: string;
            prev_3: string;
            next_3: string;
            page_size: string;
        };
        style: {};
        itemRender: (page: number, type: "page" | "prev" | "next" | "jump-prev" | "jump-next", element: React.ReactNode) => React.ReactNode;
        totalBoundaryShowSizeChanger: number;
    };
    paginationNode: React.RefObject<HTMLUListElement>;
    constructor(props: PaginationProps);
    componentDidUpdate(_: PaginationProps, prevState: PaginationState): void;
    static getDerivedStateFromProps(props: PaginationProps, prevState: PaginationState): Partial<PaginationState>;
    getJumpPrevPage: () => number;
    getJumpNextPage: () => number;
    getItemIcon: (icon: React.ReactNode | React.ComponentType<PaginationProps>, label: string) => React.ReactNode;
    getValidValue(e: any): number;
    isValid: (page: number) => boolean;
    shouldDisplayQuickJumper: () => boolean | object;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleKeyUp: (e: React.KeyboardEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
    changePageSize: (size: number) => void;
    handleChange: (page: number) => number;
    prev: () => void;
    next: () => void;
    jumpPrev: () => void;
    jumpNext: () => void;
    hasPrev: () => boolean;
    hasNext: () => boolean;
    getShowSizeChanger(): boolean;
    runIfEnter: (event: any, callback: any, ...restParams: any[]) => void;
    runIfEnterPrev: (e: React.KeyboardEvent<HTMLLIElement>) => void;
    runIfEnterNext: (e: React.KeyboardEvent<HTMLLIElement>) => void;
    runIfEnterJumpPrev: (e: React.KeyboardEvent<HTMLLIElement>) => void;
    runIfEnterJumpNext: (e: React.KeyboardEvent<HTMLLIElement>) => void;
    handleGoTO: (e: any) => void;
    renderPrev: (prevPage: number) => string | number | boolean | React.ReactFragment | React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    renderNext: (nextPage: number) => string | number | boolean | React.ReactFragment | React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    render(): React.JSX.Element;
}
export default Pagination;
