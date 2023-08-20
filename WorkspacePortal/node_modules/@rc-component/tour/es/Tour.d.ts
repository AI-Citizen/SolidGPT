import type { ReactNode } from 'react';
import * as React from 'react';
import type { TriggerProps } from '@rc-component/trigger';
import type { Gap } from './hooks/useTarget';
import type { PlacementType } from './placements';
import type { TourStepInfo, TourStepProps } from './TourStep';
export interface TourProps extends Pick<TriggerProps, 'onPopupAlign' | 'builtinPlacements'> {
    steps?: TourStepInfo[];
    open?: boolean;
    defaultCurrent?: number;
    current?: number;
    onChange?: (current: number) => void;
    onClose?: (current: number) => void;
    onFinish?: () => void;
    mask?: boolean | {
        style?: React.CSSProperties;
        color?: string;
    };
    arrow?: boolean | {
        pointAtCenter: boolean;
    };
    rootClassName?: string;
    placement?: PlacementType;
    prefixCls?: string;
    renderPanel?: (props: TourStepProps, current: number) => ReactNode;
    gap?: Gap;
    animated?: boolean | {
        placeholder: boolean;
    };
    scrollIntoViewOptions?: boolean | ScrollIntoViewOptions;
    zIndex?: number;
}
declare const Tour: (props: TourProps) => React.JSX.Element;
export default Tour;
