import React from 'react';
import PurePanel from './PurePanel';
import type { TourProps } from './interface';
declare const Tour: React.FC<TourProps> & {
    _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
};
export default Tour;
