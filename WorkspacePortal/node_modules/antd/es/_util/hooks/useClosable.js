import CloseOutlined from "@ant-design/icons/es/icons/CloseOutlined";
import React from 'react';
function useInnerClosable(closable, closeIcon, defaultClosable) {
  if (typeof closable === 'boolean') {
    return closable;
  }
  if (closeIcon === undefined) {
    return !!defaultClosable;
  }
  return closeIcon !== false && closeIcon !== null;
}
export default function useClosable(closable, closeIcon, customCloseIconRender) {
  let defaultCloseIcon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : /*#__PURE__*/React.createElement(CloseOutlined, null);
  let defaultClosable = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  const mergedClosable = useInnerClosable(closable, closeIcon, defaultClosable);
  if (!mergedClosable) {
    return [false, null];
  }
  const mergedCloseIcon = typeof closeIcon === 'boolean' || closeIcon === undefined || closeIcon === null ? defaultCloseIcon : closeIcon;
  return [true, customCloseIconRender ? customCloseIconRender(mergedCloseIcon) : mergedCloseIcon];
}