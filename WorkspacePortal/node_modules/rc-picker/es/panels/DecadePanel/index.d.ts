import * as React from 'react';
import type { PanelSharedProps } from '../../interface';
import { DECADE_DISTANCE_COUNT, DECADE_UNIT_DIFF } from './constant';
export type DecadePanelProps<DateType> = PanelSharedProps<DateType>;
export { DECADE_DISTANCE_COUNT, DECADE_UNIT_DIFF };
declare function DecadePanel<DateType>(props: DecadePanelProps<DateType>): React.JSX.Element;
export default DecadePanel;
