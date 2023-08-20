import HolderOutlined from "@ant-design/icons/es/icons/HolderOutlined";
import classNames from 'classnames';
import RcTree from 'rc-tree';
import React from 'react';
import initCollapseMotion from '../_util/motion';
import { ConfigContext } from '../config-provider';
import useStyle from './style';
import dropIndicatorRender from './utils/dropIndicator';
import SwitcherIconCom from './utils/iconUtil';
const Tree = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    getPrefixCls,
    direction,
    virtual,
    tree
  } = React.useContext(ConfigContext);
  const {
    prefixCls: customizePrefixCls,
    className,
    showIcon = false,
    showLine,
    switcherIcon,
    blockNode = false,
    children,
    checkable = false,
    selectable = true,
    draggable,
    motion: customMotion,
    style
  } = props;
  const prefixCls = getPrefixCls('tree', customizePrefixCls);
  const rootPrefixCls = getPrefixCls();
  const motion = customMotion !== null && customMotion !== void 0 ? customMotion : Object.assign(Object.assign({}, initCollapseMotion(rootPrefixCls)), {
    motionAppear: false
  });
  const newProps = Object.assign(Object.assign({}, props), {
    checkable,
    selectable,
    showIcon,
    motion,
    blockNode,
    showLine: Boolean(showLine),
    dropIndicatorRender
  });
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const draggableConfig = React.useMemo(() => {
    if (!draggable) {
      return false;
    }
    let mergedDraggable = {};
    switch (typeof draggable) {
      case 'function':
        mergedDraggable.nodeDraggable = draggable;
        break;
      case 'object':
        mergedDraggable = Object.assign({}, draggable);
        break;
      default:
        break;
      // Do nothing
    }

    if (mergedDraggable.icon !== false) {
      mergedDraggable.icon = mergedDraggable.icon || /*#__PURE__*/React.createElement(HolderOutlined, null);
    }
    return mergedDraggable;
  }, [draggable]);
  const renderSwitcherIcon = nodeProps => /*#__PURE__*/React.createElement(SwitcherIconCom, {
    prefixCls: prefixCls,
    switcherIcon: switcherIcon,
    treeNodeProps: nodeProps,
    showLine: showLine
  });
  return wrapSSR( /*#__PURE__*/React.createElement(RcTree, Object.assign({
    itemHeight: 20,
    ref: ref,
    virtual: virtual
  }, newProps, {
    // newProps may contain style so declare style below it
    style: Object.assign(Object.assign({}, tree === null || tree === void 0 ? void 0 : tree.style), style),
    prefixCls: prefixCls,
    className: classNames({
      [`${prefixCls}-icon-hide`]: !showIcon,
      [`${prefixCls}-block-node`]: blockNode,
      [`${prefixCls}-unselectable`]: !selectable,
      [`${prefixCls}-rtl`]: direction === 'rtl'
    }, tree === null || tree === void 0 ? void 0 : tree.className, className, hashId),
    direction: direction,
    checkable: checkable ? /*#__PURE__*/React.createElement("span", {
      className: `${prefixCls}-checkbox-inner`
    }) : checkable,
    selectable: selectable,
    switcherIcon: renderSwitcherIcon,
    draggable: draggableConfig
  }), children));
});
if (process.env.NODE_ENV !== 'production') {
  Tree.displayName = 'Tree';
}
export default Tree;