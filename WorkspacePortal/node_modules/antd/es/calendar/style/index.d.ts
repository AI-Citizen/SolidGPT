import type { CSSObject } from '@ant-design/cssinjs';
import type { PickerPanelToken } from '../../date-picker/style';
import type { InputToken } from '../../input/style';
import type { FullToken } from '../../theme/internal';
export interface ComponentToken {
    /**
     * @desc 年选择器宽度
     * @descEN Width of year select
     */
    yearControlWidth: number;
    /**
     * @desc 月选择器宽度
     * @descEN Width of month select
     */
    monthControlWidth: number;
    /**
     * @desc 迷你日历内容高度
     * @descEN Height of mini calendar content
     */
    miniContentHeight: number;
    /**
     * @desc 完整日历背景色
     * @descEN Background color of full calendar
     */
    fullBg: string;
    /**
     * @desc 完整日历面板背景色
     * @descEN Background color of full calendar panel
     */
    fullPanelBg: string;
    /**
     * @desc 日期项选中背景色
     * @descEN Background color of selected date item
     */
    itemActiveBg: string;
}
interface CalendarToken extends InputToken<FullToken<'Calendar'>>, PickerPanelToken {
    calendarCls: string;
    dateValueHeight: number;
    weekHeight: number;
    dateContentHeight: number;
}
export declare const genCalendarStyles: (token: CalendarToken) => CSSObject;
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
