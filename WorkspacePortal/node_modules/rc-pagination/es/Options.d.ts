import React from 'react';
interface Props {
    disabled: boolean;
    locale: any;
    rootPrefixCls: string;
    selectPrefixCls: string;
    current: number;
    pageSize: number;
    pageSizeOptions: (string | number)[];
    goButton: boolean | string;
    changeSize: (size: number) => void;
    quickGo: (value: number) => void;
    buildOptionText?: (value: string | number) => string;
    selectComponentClass: React.ComponentType<any> & {
        Option?: React.ComponentType<any>;
    };
}
interface State {
    goInputText: string;
}
declare class Options extends React.Component<Props, State> {
    static defaultProps: {
        pageSizeOptions: string[];
    };
    state: {
        goInputText: string;
    };
    getValidValue: () => number;
    buildOptionText: (value: string) => string;
    changeSize: (value: number) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
    go: (e: any) => void;
    getPageSizeOptions(): (string | number)[];
    render(): React.JSX.Element;
}
export default Options;
