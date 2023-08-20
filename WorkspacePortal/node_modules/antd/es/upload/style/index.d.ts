import type { FullToken } from '../../theme/internal';
export interface ComponentToken {
    /**
     * @desc 操作按扭颜色
     * @descEN Action button color
     */
    actionsColor: string;
}
export interface UploadToken extends FullToken<'Upload'> {
    uploadThumbnailSize: number;
    uploadProgressOffset: number;
    uploadPicCardSize: number;
}
declare const _default: (prefixCls: string) => import("../../theme/interface").UseComponentStyleResult;
export default _default;
