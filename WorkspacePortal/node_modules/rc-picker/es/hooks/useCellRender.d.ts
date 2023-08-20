import type { PickerPanelProps } from '../PickerPanel';
import type { RangePickerProps } from '../RangePicker';
export type UseCellRenderOption<DateType> = Pick<PickerPanelProps<DateType>, 'cellRender' | 'monthCellRender' | 'dateRender'> | Pick<RangePickerProps<DateType>, 'cellRender' | 'monthCellRender' | 'dateRender'>;
export declare function useCellRender<DateType>({ cellRender, monthCellRender, dateRender, }: UseCellRenderOption<DateType>): import("../interface").CellRender<DateType>;
