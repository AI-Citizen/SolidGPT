import * as React from 'react';
import type { PanelSharedProps, PanelMode, CellRender } from '../../interface';
import { YEAR_DECADE_COUNT } from './constant';
export type YearPanelProps<DateType> = {
    sourceMode: PanelMode;
    cellRender?: CellRender<DateType>;
} & PanelSharedProps<DateType>;
export { YEAR_DECADE_COUNT };
declare function YearPanel<DateType>(props: YearPanelProps<DateType>): React.JSX.Element;
export default YearPanel;
