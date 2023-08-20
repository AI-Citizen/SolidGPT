var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import classNames from 'classnames';
import omit from "rc-util/es/omit";
import * as React from 'react';
import { ConfigContext } from '../config-provider';
import useSize from '../config-provider/hooks/useSize';
import Skeleton from '../skeleton';
import Tabs from '../tabs';
import Grid from './Grid';
import useStyle from './style';
function getAction(actions) {
  return actions.map((action, index) =>
  /*#__PURE__*/
  // eslint-disable-next-line react/no-array-index-key
  React.createElement("li", {
    style: {
      width: `${100 / actions.length}%`
    },
    key: `action-${index}`
  }, /*#__PURE__*/React.createElement("span", null, action)));
}
const Card = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
      prefixCls: customizePrefixCls,
      className,
      rootClassName,
      style,
      extra,
      headStyle = {},
      bodyStyle = {},
      title,
      loading,
      bordered = true,
      size: customizeSize,
      type,
      cover,
      actions,
      tabList,
      children,
      activeTabKey,
      defaultActiveTabKey,
      tabBarExtraContent,
      hoverable,
      tabProps = {}
    } = props,
    others = __rest(props, ["prefixCls", "className", "rootClassName", "style", "extra", "headStyle", "bodyStyle", "title", "loading", "bordered", "size", "type", "cover", "actions", "tabList", "children", "activeTabKey", "defaultActiveTabKey", "tabBarExtraContent", "hoverable", "tabProps"]);
  const {
    getPrefixCls,
    direction,
    card
  } = React.useContext(ConfigContext);
  const onTabChange = key => {
    var _a;
    (_a = props.onTabChange) === null || _a === void 0 ? void 0 : _a.call(props, key);
  };
  const isContainGrid = React.useMemo(() => {
    let containGrid = false;
    React.Children.forEach(children, element => {
      if (element && element.type && element.type === Grid) {
        containGrid = true;
      }
    });
    return containGrid;
  }, [children]);
  const prefixCls = getPrefixCls('card', customizePrefixCls);
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const loadingBlock = /*#__PURE__*/React.createElement(Skeleton, {
    loading: true,
    active: true,
    paragraph: {
      rows: 4
    },
    title: false
  }, children);
  const hasActiveTabKey = activeTabKey !== undefined;
  const extraProps = Object.assign(Object.assign({}, tabProps), {
    [hasActiveTabKey ? 'activeKey' : 'defaultActiveKey']: hasActiveTabKey ? activeTabKey : defaultActiveTabKey,
    tabBarExtraContent
  });
  let head;
  const mergedSize = useSize(customizeSize);
  const tabSize = !mergedSize || mergedSize === 'default' ? 'large' : mergedSize;
  const tabs = tabList ? /*#__PURE__*/React.createElement(Tabs, Object.assign({
    size: tabSize
  }, extraProps, {
    className: `${prefixCls}-head-tabs`,
    onChange: onTabChange,
    items: tabList.map(_a => {
      var {
          tab
        } = _a,
        item = __rest(_a, ["tab"]);
      return Object.assign({
        label: tab
      }, item);
    })
  })) : null;
  if (title || extra || tabs) {
    head = /*#__PURE__*/React.createElement("div", {
      className: `${prefixCls}-head`,
      style: headStyle
    }, /*#__PURE__*/React.createElement("div", {
      className: `${prefixCls}-head-wrapper`
    }, title && /*#__PURE__*/React.createElement("div", {
      className: `${prefixCls}-head-title`
    }, title), extra && /*#__PURE__*/React.createElement("div", {
      className: `${prefixCls}-extra`
    }, extra)), tabs);
  }
  const coverDom = cover ? /*#__PURE__*/React.createElement("div", {
    className: `${prefixCls}-cover`
  }, cover) : null;
  const body = /*#__PURE__*/React.createElement("div", {
    className: `${prefixCls}-body`,
    style: bodyStyle
  }, loading ? loadingBlock : children);
  const actionDom = actions && actions.length ? /*#__PURE__*/React.createElement("ul", {
    className: `${prefixCls}-actions`
  }, getAction(actions)) : null;
  const divProps = omit(others, ['onTabChange']);
  const classString = classNames(prefixCls, card === null || card === void 0 ? void 0 : card.className, {
    [`${prefixCls}-loading`]: loading,
    [`${prefixCls}-bordered`]: bordered,
    [`${prefixCls}-hoverable`]: hoverable,
    [`${prefixCls}-contain-grid`]: isContainGrid,
    [`${prefixCls}-contain-tabs`]: tabList && tabList.length,
    [`${prefixCls}-${mergedSize}`]: mergedSize,
    [`${prefixCls}-type-${type}`]: !!type,
    [`${prefixCls}-rtl`]: direction === 'rtl'
  }, className, rootClassName, hashId);
  const mergedStyle = Object.assign(Object.assign({}, card === null || card === void 0 ? void 0 : card.style), style);
  return wrapSSR( /*#__PURE__*/React.createElement("div", Object.assign({
    ref: ref
  }, divProps, {
    className: classString,
    style: mergedStyle
  }), head, coverDom, body, actionDom));
});
export default Card;