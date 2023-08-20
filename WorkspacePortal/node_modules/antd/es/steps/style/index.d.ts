import type { CSSProperties } from 'react';
import type { FullToken } from '../../theme/internal';
export interface ComponentToken {
    /**
     * @desc 描述区域最大宽度
     * @descEN Max width of description area
     */
    descriptionMaxWidth: number;
    /**
     * @desc 自定义图标容器尺寸
     * @descEN Size of custom icon container
     */
    customIconSize: number;
    /**
     * @desc 自定义图标 top
     * @descEN Top of custom icon
     */
    customIconTop: number;
    /**
     * @desc 自定义图标大小
     * @descEN Font size of custom icon
     */
    customIconFontSize: number;
    /**
     * @desc 图标容器尺寸
     * @descEN Size of icon container
     */
    iconSize: number;
    /**
     * @desc 图标 top
     * @descEN Top of icon
     */
    iconTop: number;
    /**
     * @desc 图标大小
     * @descEN Size of icon
     */
    iconFontSize: number;
    /**
     * @desc 点状步骤点大小
     * @descEN Size of dot
     */
    dotSize: number;
    /**
     * @desc 点状步骤点当前大小
     * @descEN Current size of dot
     */
    dotCurrentSize: number;
    /**
     * @desc 可跳转步骤条箭头颜色
     * @descEN Color of arrow in nav
     */
    navArrowColor: string;
    /**
     * @desc 可跳转步骤条内容最大宽度
     * @descEN Max width of nav content
     */
    navContentMaxWidth: CSSProperties['maxWidth'];
    /**
     * @desc 小号步骤条图标大小
     * @descEN Size of small steps icon
     */
    iconSizeSM: number;
    /**
     * @desc 标题行高
     * @descEN Line height of title
     */
    titleLineHeight: number;
}
export interface StepsToken extends FullToken<'Steps'> {
    processTailColor: string;
    processIconColor: string;
    processTitleColor: string;
    processDescriptionColor: string;
    processIconBgColor: string;
    processIconBorderColor: string;
    processDotColor: string;
    waitIconColor: string;
    waitTitleColor: string;
    waitDescriptionColor: string;
    waitTailColor: string;
    waitIconBgColor: string;
    waitIconBorderColor: string;
    waitDotColor: string;
    finishIconColor: string;
    finishTitleColor: string;
    finishDescriptionColor: string;
    finishTailColor: string;
    finishIconBgColor: string;
    finishIconBorderColor: string;
    finishDotColor: string;
    errorIconColor: string;
    errorTitleColor: string;
    errorDescriptionColor: string;
    errorTailColor: string;
    errorIconBgColor: string;
    errorIconBorderColor: string;
    errorDotColor: string;
    stepsNavActiveColor: string;
    stepsProgressSize: number;
    inlineDotSize: number;
    inlineTitleColor: string;
    inlineTailColor: string;
}
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
