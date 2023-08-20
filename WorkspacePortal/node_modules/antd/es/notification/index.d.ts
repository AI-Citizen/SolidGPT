import * as React from 'react';
import PurePanel from './PurePanel';
import type { ArgsProps } from './interface';
import useNotification from './useNotification';
interface BaseMethods {
    open: (config: ArgsProps) => void;
    destroy: (key?: React.Key) => void;
    config: any;
    useNotification: typeof useNotification;
    /** @private Internal Component. Do not use in your production. */
    _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
}
type StaticFn = (config: ArgsProps) => void;
interface NoticeMethods {
    success: StaticFn;
    info: StaticFn;
    warning: StaticFn;
    error: StaticFn;
}
declare const staticMethods: NoticeMethods & BaseMethods;
export default staticMethods;
