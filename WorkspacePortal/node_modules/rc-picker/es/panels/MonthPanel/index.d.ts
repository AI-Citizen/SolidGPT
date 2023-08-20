import * as React from 'react';
import type { CellRender, PanelSharedProps } from '../../interface';
export type MonthPanelProps<DateType> = {
    cellRender?: CellRender<DateType>;
} & PanelSharedProps<DateType>;
declare function MonthPanel<DateType>(props: MonthPanelProps<DateType>): React.JSX.Element;
export default MonthPanel;
