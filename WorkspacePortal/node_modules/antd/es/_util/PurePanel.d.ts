import * as React from 'react';
export declare function withPureRenderTheme(Component: any): (props: any) => React.JSX.Element;
export interface BaseProps {
    prefixCls?: string;
    style?: React.CSSProperties;
}
export default function genPurePanel<ComponentProps extends BaseProps>(Component: any, defaultPrefixCls?: string, getDropdownCls?: null | ((prefixCls: string) => string), postProps?: (props: ComponentProps) => ComponentProps): (props: any) => React.JSX.Element;
