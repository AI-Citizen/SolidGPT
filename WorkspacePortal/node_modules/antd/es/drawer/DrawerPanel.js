import classNames from 'classnames';
import * as React from 'react';
import useClosable from '../_util/hooks/useClosable';
const DrawerPanel = props => {
  const {
    prefixCls,
    title,
    footer,
    extra,
    closeIcon,
    closable,
    onClose,
    headerStyle,
    drawerStyle,
    bodyStyle,
    footerStyle,
    children
  } = props;
  const customCloseIconRender = React.useCallback(icon => /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": "Close",
    className: `${prefixCls}-close`
  }, icon), [onClose]);
  const [mergedClosable, mergedCloseIcon] = useClosable(closable, closeIcon, customCloseIconRender, undefined, true);
  const headerNode = React.useMemo(() => {
    if (!title && !mergedClosable) {
      return null;
    }
    return /*#__PURE__*/React.createElement("div", {
      style: headerStyle,
      className: classNames(`${prefixCls}-header`, {
        [`${prefixCls}-header-close-only`]: mergedClosable && !title && !extra
      })
    }, /*#__PURE__*/React.createElement("div", {
      className: `${prefixCls}-header-title`
    }, mergedCloseIcon, title && /*#__PURE__*/React.createElement("div", {
      className: `${prefixCls}-title`
    }, title)), extra && /*#__PURE__*/React.createElement("div", {
      className: `${prefixCls}-extra`
    }, extra));
  }, [mergedClosable, mergedCloseIcon, extra, headerStyle, prefixCls, title]);
  const footerNode = React.useMemo(() => {
    if (!footer) {
      return null;
    }
    const footerClassName = `${prefixCls}-footer`;
    return /*#__PURE__*/React.createElement("div", {
      className: footerClassName,
      style: footerStyle
    }, footer);
  }, [footer, footerStyle, prefixCls]);
  return /*#__PURE__*/React.createElement("div", {
    className: `${prefixCls}-wrapper-body`,
    style: drawerStyle
  }, headerNode, /*#__PURE__*/React.createElement("div", {
    className: `${prefixCls}-body`,
    style: bodyStyle
  }, children), footerNode);
};
export default DrawerPanel;