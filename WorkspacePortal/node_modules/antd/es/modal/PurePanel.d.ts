import type { PanelProps } from 'rc-dialog/lib/Dialog/Content/Panel';
import * as React from 'react';
import type { ModalFuncProps } from './interface';
export interface PurePanelProps extends Omit<PanelProps, 'prefixCls'>, Pick<ModalFuncProps, 'type'> {
    prefixCls?: string;
    style?: React.CSSProperties;
}
declare const _default: (props: any) => React.JSX.Element;
export default _default;
