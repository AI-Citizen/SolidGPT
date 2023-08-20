import * as React from 'react';
import type { CellRender, PanelSharedProps } from '../../interface';
export type WeekPanelProps<DateType> = {
    cellRender?: CellRender<DateType>;
} & PanelSharedProps<DateType>;
declare function WeekPanel<DateType>(props: WeekPanelProps<DateType>): React.JSX.Element;
export default WeekPanel;
