import type { FullToken } from '../../theme/internal';
/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {
    /**
     * @desc 提醒框 z-index
     * @descEN z-index of Notification
     */
    zIndexPopup: number;
    /**
     * @desc 提醒框宽度
     * @descEN Width of Notification
     */
    width: number;
}
export interface NotificationToken extends FullToken<'Notification'> {
    animationMaxHeight: number;
    notificationBg: string;
    notificationPadding: string;
    notificationPaddingVertical: number;
    notificationPaddingHorizontal: number;
    notificationIconSize: number;
    notificationCloseButtonSize: number;
    notificationMarginBottom: number;
    notificationMarginEdge: number;
}
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
