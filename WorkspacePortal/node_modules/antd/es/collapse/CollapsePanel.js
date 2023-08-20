import classNames from 'classnames';
import RcCollapse from 'rc-collapse';
import * as React from 'react';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
const CollapsePanel = /*#__PURE__*/React.forwardRef((props, ref) => {
  process.env.NODE_ENV !== "production" ? warning(!('disabled' in props), 'Collapse.Panel', '`disabled` is deprecated. Please use `collapsible="disabled"` instead.') : void 0;
  const {
    getPrefixCls
  } = React.useContext(ConfigContext);
  const {
    prefixCls: customizePrefixCls,
    className,
    showArrow = true
  } = props;
  const prefixCls = getPrefixCls('collapse', customizePrefixCls);
  const collapsePanelClassName = classNames({
    [`${prefixCls}-no-arrow`]: !showArrow
  }, className);
  return /*#__PURE__*/React.createElement(RcCollapse.Panel, Object.assign({
    ref: ref
  }, props, {
    prefixCls: prefixCls,
    className: collapsePanelClassName
  }));
});
export default CollapsePanel;