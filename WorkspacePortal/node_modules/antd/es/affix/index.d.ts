import React from 'react';
import type { ConfigConsumerProps } from '../config-provider';
export interface AffixProps {
    /** Triggered when the specified offset is reached from the top of the window */
    offsetTop?: number;
    /** Triggered when the specified offset is reached from the bottom of the window */
    offsetBottom?: number;
    style?: React.CSSProperties;
    /** Callback function triggered when fixed state changes */
    onChange?: (affixed?: boolean) => void;
    /** Set the element that Affix needs to listen to its scroll event, the value is a function that returns the corresponding DOM element */
    target?: () => Window | HTMLElement | null;
    prefixCls?: string;
    className?: string;
    rootClassName?: string;
    children: React.ReactNode;
}
interface InternalAffixProps extends AffixProps {
    affixPrefixCls: string;
}
declare enum AffixStatus {
    None = 0,
    Prepare = 1
}
export interface AffixState {
    affixStyle?: React.CSSProperties;
    placeholderStyle?: React.CSSProperties;
    status: AffixStatus;
    lastAffix: boolean;
    prevTarget: Window | HTMLElement | null;
}
declare class InternalAffix extends React.Component<InternalAffixProps, AffixState> {
    static contextType: React.Context<ConfigConsumerProps>;
    state: AffixState;
    private placeholderNodeRef;
    private fixedNodeRef;
    private timer;
    context: ConfigConsumerProps;
    private getTargetFunc;
    addListeners: () => void;
    removeListeners: () => void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: AffixProps): void;
    componentWillUnmount(): void;
    getOffsetTop: () => number | undefined;
    getOffsetBottom: () => number | undefined;
    measure: () => void;
    prepareMeasure: () => void;
    updatePosition: ((...args: any[]) => void) & {
        cancel: () => void;
    };
    lazyUpdatePosition: ((...args: any[]) => void) & {
        cancel: () => void;
    };
    render(): React.JSX.Element;
}
export type InternalAffixClass = InternalAffix;
declare const Affix: React.ForwardRefExoticComponent<AffixProps & React.RefAttributes<InternalAffix>>;
export default Affix;
