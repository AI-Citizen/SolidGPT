'use client';

var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import classNames from 'classnames';
import RcMentions from 'rc-mentions';
import { composeRef } from "rc-util/es/ref";
// eslint-disable-next-line import/no-named-as-default
import * as React from 'react';
import genPurePanel from '../_util/PurePanel';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import DefaultRenderEmpty from '../config-provider/defaultRenderEmpty';
import { FormItemInputContext } from '../form/context';
import Spin from '../spin';
import useStyle from './style';
export const {
  Option
} = RcMentions;
function loadingFilterOption() {
  return true;
}
const InternalMentions = (props, ref) => {
  const {
      prefixCls: customizePrefixCls,
      className,
      rootClassName,
      disabled,
      loading,
      filterOption,
      children,
      notFoundContent,
      options,
      status: customStatus,
      popupClassName,
      style
    } = props,
    restProps = __rest(props, ["prefixCls", "className", "rootClassName", "disabled", "loading", "filterOption", "children", "notFoundContent", "options", "status", "popupClassName", "style"]);
  const [focused, setFocused] = React.useState(false);
  const innerRef = React.useRef(null);
  const mergedRef = composeRef(ref, innerRef);
  // =================== Warning =====================
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== "production" ? warning(!children, 'Mentions', '`Mentions.Option` is deprecated. Please use `options` instead.') : void 0;
  }
  const {
    getPrefixCls,
    renderEmpty,
    direction,
    mentions: contextMentions
  } = React.useContext(ConfigContext);
  const {
    status: contextStatus,
    hasFeedback,
    feedbackIcon
  } = React.useContext(FormItemInputContext);
  const mergedStatus = getMergedStatus(contextStatus, customStatus);
  const onFocus = function () {
    if (restProps.onFocus) {
      restProps.onFocus.apply(restProps, arguments);
    }
    setFocused(true);
  };
  const onBlur = function () {
    if (restProps.onBlur) {
      restProps.onBlur.apply(restProps, arguments);
    }
    setFocused(false);
  };
  const notFoundContentEle = React.useMemo(() => {
    if (notFoundContent !== undefined) {
      return notFoundContent;
    }
    return (renderEmpty === null || renderEmpty === void 0 ? void 0 : renderEmpty('Select')) || /*#__PURE__*/React.createElement(DefaultRenderEmpty, {
      componentName: "Select"
    });
  }, [notFoundContent, renderEmpty]);
  const mentionOptions = React.useMemo(() => {
    if (loading) {
      return /*#__PURE__*/React.createElement(Option, {
        value: "ANTD_SEARCHING",
        disabled: true
      }, /*#__PURE__*/React.createElement(Spin, {
        size: "small"
      }));
    }
    return children;
  }, [loading, children]);
  const mergedOptions = loading ? [{
    value: 'ANTD_SEARCHING',
    disabled: true,
    label: /*#__PURE__*/React.createElement(Spin, {
      size: "small"
    })
  }] : options;
  const mentionsfilterOption = loading ? loadingFilterOption : filterOption;
  const prefixCls = getPrefixCls('mentions', customizePrefixCls);
  // Style
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const mergedClassName = classNames({
    [`${prefixCls}-disabled`]: disabled,
    [`${prefixCls}-focused`]: focused,
    [`${prefixCls}-rtl`]: direction === 'rtl'
  }, getStatusClassNames(prefixCls, mergedStatus), contextMentions === null || contextMentions === void 0 ? void 0 : contextMentions.className, !hasFeedback && className, rootClassName, hashId);
  const mentions = /*#__PURE__*/React.createElement(RcMentions, Object.assign({
    prefixCls: prefixCls,
    notFoundContent: notFoundContentEle,
    className: mergedClassName,
    disabled: disabled,
    direction: direction,
    style: Object.assign(Object.assign({}, contextMentions === null || contextMentions === void 0 ? void 0 : contextMentions.style), style)
  }, restProps, {
    filterOption: mentionsfilterOption,
    onFocus: onFocus,
    onBlur: onBlur,
    dropdownClassName: classNames(popupClassName, rootClassName, hashId),
    ref: mergedRef,
    options: mergedOptions,
    suffix: hasFeedback && feedbackIcon,
    classes: {
      affixWrapper: classNames(hashId, className)
    }
  }), mentionOptions);
  return wrapSSR(mentions);
};
const Mentions = /*#__PURE__*/React.forwardRef(InternalMentions);
if (process.env.NODE_ENV !== 'production') {
  Mentions.displayName = 'Mentions';
}
Mentions.Option = Option;
// We don't care debug panel
/* istanbul ignore next */
const PurePanel = genPurePanel(Mentions, 'mentions');
Mentions._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;
Mentions.getMentions = function () {
  let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const {
    prefix = '@',
    split = ' '
  } = config;
  const prefixList = Array.isArray(prefix) ? prefix : [prefix];
  return value.split(split).map(function () {
    let str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let hitPrefix = null;
    prefixList.some(prefixStr => {
      const startStr = str.slice(0, prefixStr.length);
      if (startStr === prefixStr) {
        hitPrefix = prefixStr;
        return true;
      }
      return false;
    });
    if (hitPrefix !== null) {
      return {
        prefix: hitPrefix,
        value: str.slice(hitPrefix.length)
      };
    }
    return null;
  }).filter(entity => !!entity && !!entity.value);
};
export default Mentions;