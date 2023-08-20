import type { CSSInterpolation, CSSObject } from '@ant-design/cssinjs';
import type { DerivativeToken } from '../../theme/internal';
type TreeToken = DerivativeToken & {
    treeCls: string;
    treeNodeCls: string;
    treeNodePadding: number;
    treeTitleHeight: number;
};
export declare const genBaseStyle: (prefixCls: string, token: TreeToken) => CSSObject;
export declare const genDirectoryStyle: (token: TreeToken) => CSSObject;
export declare const genTreeStyle: (prefixCls: string, token: DerivativeToken) => CSSInterpolation;
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
