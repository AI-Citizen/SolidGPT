var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import CloseOutlined from "@ant-design/icons/es/icons/CloseOutlined";
import LeftOutlined from "@ant-design/icons/es/icons/LeftOutlined";
import RightOutlined from "@ant-design/icons/es/icons/RightOutlined";
import RotateLeftOutlined from "@ant-design/icons/es/icons/RotateLeftOutlined";
import RotateRightOutlined from "@ant-design/icons/es/icons/RotateRightOutlined";
import SwapOutlined from "@ant-design/icons/es/icons/SwapOutlined";
import ZoomInOutlined from "@ant-design/icons/es/icons/ZoomInOutlined";
import ZoomOutOutlined from "@ant-design/icons/es/icons/ZoomOutOutlined";
import RcImage from 'rc-image';
import * as React from 'react';
import classNames from 'classnames';
import { ConfigContext } from '../config-provider';
import { getTransitionName } from '../_util/motion';
// CSSINJS
import useStyle from './style';
export const icons = {
  rotateLeft: /*#__PURE__*/React.createElement(RotateLeftOutlined, null),
  rotateRight: /*#__PURE__*/React.createElement(RotateRightOutlined, null),
  zoomIn: /*#__PURE__*/React.createElement(ZoomInOutlined, null),
  zoomOut: /*#__PURE__*/React.createElement(ZoomOutOutlined, null),
  close: /*#__PURE__*/React.createElement(CloseOutlined, null),
  left: /*#__PURE__*/React.createElement(LeftOutlined, null),
  right: /*#__PURE__*/React.createElement(RightOutlined, null),
  flipX: /*#__PURE__*/React.createElement(SwapOutlined, null),
  flipY: /*#__PURE__*/React.createElement(SwapOutlined, {
    rotate: 90
  })
};
const InternalPreviewGroup = _a => {
  var {
      previewPrefixCls: customizePrefixCls,
      preview
    } = _a,
    props = __rest(_a, ["previewPrefixCls", "preview"]);
  const {
    getPrefixCls
  } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('image', customizePrefixCls);
  const previewPrefixCls = `${prefixCls}-preview`;
  const rootPrefixCls = getPrefixCls();
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const mergedPreview = React.useMemo(() => {
    var _a;
    if (preview === false) {
      return preview;
    }
    const _preview = typeof preview === 'object' ? preview : {};
    const mergedRootClassName = classNames(hashId, (_a = _preview.rootClassName) !== null && _a !== void 0 ? _a : '');
    return Object.assign(Object.assign({}, _preview), {
      transitionName: getTransitionName(rootPrefixCls, 'zoom', _preview.transitionName),
      maskTransitionName: getTransitionName(rootPrefixCls, 'fade', _preview.maskTransitionName),
      rootClassName: mergedRootClassName
    });
  }, [preview]);
  return wrapSSR( /*#__PURE__*/React.createElement(RcImage.PreviewGroup, Object.assign({
    preview: mergedPreview,
    previewPrefixCls: previewPrefixCls,
    icons: icons
  }, props)));
};
export default InternalPreviewGroup;