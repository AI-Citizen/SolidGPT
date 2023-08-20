import * as React from 'react';
import type { ReactNode, CSSProperties } from 'react';
import type { PlacementType } from '../placements';
export interface TourStepInfo {
    arrow?: boolean | {
        pointAtCenter: boolean;
    };
    target?: HTMLElement | (() => HTMLElement) | null | (() => null);
    title: ReactNode;
    description?: ReactNode;
    placement?: PlacementType;
    mask?: boolean | {
        style?: React.CSSProperties;
        color?: string;
    };
    className?: string;
    style?: CSSProperties;
    scrollIntoViewOptions?: boolean | ScrollIntoViewOptions;
}
export interface TourStepProps extends TourStepInfo {
    prefixCls?: string;
    total?: number;
    current?: number;
    onClose?: () => void;
    onFinish?: () => void;
    renderPanel?: (step: TourStepProps, current: number) => ReactNode;
    onPrev?: () => void;
    onNext?: () => void;
}
declare const TourStep: (props: TourStepProps) => React.JSX.Element;
export default TourStep;
