'use client';

var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
// TODO: 4.0 - codemod should help to change `filterOption` to support node props.
import classNames from 'classnames';
import RcSelect, { OptGroup, Option } from 'rc-select';
import omit from "rc-util/es/omit";
import * as React from 'react';
import genPurePanel from '../_util/PurePanel';
import { getTransitionName } from '../_util/motion';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import DefaultRenderEmpty from '../config-provider/defaultRenderEmpty';
import useSize from '../config-provider/hooks/useSize';
import { FormItemInputContext } from '../form/context';
import { useCompactItemContext } from '../space/Compact';
import useStyle from './style';
import useBuiltinPlacements from './useBuiltinPlacements';
import useShowArrow from './useShowArrow';
import getIcons from './utils/iconUtil';
const SECRET_COMBOBOX_MODE_DO_NOT_USE = 'SECRET_COMBOBOX_MODE_DO_NOT_USE';
const InternalSelect = (_a, ref) => {
  var _b;
  var {
      prefixCls: customizePrefixCls,
      bordered = true,
      className,
      rootClassName,
      getPopupContainer,
      popupClassName,
      dropdownClassName,
      listHeight = 256,
      placement,
      listItemHeight = 24,
      size: customizeSize,
      disabled: customDisabled,
      notFoundContent,
      status: customStatus,
      builtinPlacements,
      dropdownMatchSelectWidth,
      popupMatchSelectWidth,
      direction: propDirection,
      style,
      allowClear
    } = _a,
    props = __rest(_a, ["prefixCls", "bordered", "className", "rootClassName", "getPopupContainer", "popupClassName", "dropdownClassName", "listHeight", "placement", "listItemHeight", "size", "disabled", "notFoundContent", "status", "builtinPlacements", "dropdownMatchSelectWidth", "popupMatchSelectWidth", "direction", "style", "allowClear"]);
  const {
    getPopupContainer: getContextPopupContainer,
    getPrefixCls,
    renderEmpty,
    direction: contextDirection,
    virtual,
    popupMatchSelectWidth: contextPopupMatchSelectWidth,
    popupOverflow,
    select
  } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('select', customizePrefixCls);
  const rootPrefixCls = getPrefixCls();
  const direction = propDirection !== null && propDirection !== void 0 ? propDirection : contextDirection;
  const {
    compactSize,
    compactItemClassnames
  } = useCompactItemContext(prefixCls, direction);
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const mode = React.useMemo(() => {
    const {
      mode: m
    } = props;
    if (m === 'combobox') {
      return undefined;
    }
    if (m === SECRET_COMBOBOX_MODE_DO_NOT_USE) {
      return 'combobox';
    }
    return m;
  }, [props.mode]);
  const isMultiple = mode === 'multiple' || mode === 'tags';
  const showSuffixIcon = useShowArrow(props.suffixIcon, props.showArrow);
  const mergedPopupMatchSelectWidth = (_b = popupMatchSelectWidth !== null && popupMatchSelectWidth !== void 0 ? popupMatchSelectWidth : dropdownMatchSelectWidth) !== null && _b !== void 0 ? _b : contextPopupMatchSelectWidth;
  // ===================== Form Status =====================
  const {
    status: contextStatus,
    hasFeedback,
    isFormItemInput,
    feedbackIcon
  } = React.useContext(FormItemInputContext);
  const mergedStatus = getMergedStatus(contextStatus, customStatus);
  // ===================== Empty =====================
  let mergedNotFound;
  if (notFoundContent !== undefined) {
    mergedNotFound = notFoundContent;
  } else if (mode === 'combobox') {
    mergedNotFound = null;
  } else {
    mergedNotFound = (renderEmpty === null || renderEmpty === void 0 ? void 0 : renderEmpty('Select')) || /*#__PURE__*/React.createElement(DefaultRenderEmpty, {
      componentName: "Select"
    });
  }
  // ===================== Icons =====================
  const {
    suffixIcon,
    itemIcon,
    removeIcon,
    clearIcon
  } = getIcons(Object.assign(Object.assign({}, props), {
    multiple: isMultiple,
    hasFeedback,
    feedbackIcon,
    showSuffixIcon,
    prefixCls,
    showArrow: props.showArrow,
    componentName: 'Select'
  }));
  const mergedAllowClear = allowClear === true ? {
    clearIcon
  } : allowClear;
  const selectProps = omit(props, ['suffixIcon', 'itemIcon']);
  const rcSelectRtlDropdownClassName = classNames(popupClassName || dropdownClassName, {
    [`${prefixCls}-dropdown-${direction}`]: direction === 'rtl'
  }, rootClassName, hashId);
  const mergedSize = useSize(ctx => {
    var _a;
    return (_a = customizeSize !== null && customizeSize !== void 0 ? customizeSize : compactSize) !== null && _a !== void 0 ? _a : ctx;
  });
  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled !== null && customDisabled !== void 0 ? customDisabled : disabled;
  const mergedClassName = classNames({
    [`${prefixCls}-lg`]: mergedSize === 'large',
    [`${prefixCls}-sm`]: mergedSize === 'small',
    [`${prefixCls}-rtl`]: direction === 'rtl',
    [`${prefixCls}-borderless`]: !bordered,
    [`${prefixCls}-in-form-item`]: isFormItemInput
  }, getStatusClassNames(prefixCls, mergedStatus, hasFeedback), compactItemClassnames, select === null || select === void 0 ? void 0 : select.className, className, rootClassName, hashId);
  // ===================== Placement =====================
  const memoPlacement = React.useMemo(() => {
    if (placement !== undefined) {
      return placement;
    }
    return direction === 'rtl' ? 'bottomRight' : 'bottomLeft';
  }, [placement, direction]);
  const mergedBuiltinPlacements = useBuiltinPlacements(builtinPlacements, popupOverflow);
  // ====================== Warning ======================
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== "production" ? warning(!dropdownClassName, 'Select', '`dropdownClassName` is deprecated. Please use `popupClassName` instead.') : void 0;
    process.env.NODE_ENV !== "production" ? warning(dropdownMatchSelectWidth === undefined, 'Select', '`dropdownMatchSelectWidth` is deprecated. Please use `popupMatchSelectWidth` instead.') : void 0;
    process.env.NODE_ENV !== "production" ? warning(!('showArrow' in props), 'Select', '`showArrow` is deprecated which will be removed in next major version. It will be a default behavior, you can hide it by setting `suffixIcon` to null.') : void 0;
  }
  // ====================== Render =======================
  return wrapSSR( /*#__PURE__*/React.createElement(RcSelect, Object.assign({
    ref: ref,
    virtual: virtual,
    showSearch: select === null || select === void 0 ? void 0 : select.showSearch
  }, selectProps, {
    style: Object.assign(Object.assign({}, select === null || select === void 0 ? void 0 : select.style), style),
    dropdownMatchSelectWidth: mergedPopupMatchSelectWidth,
    builtinPlacements: mergedBuiltinPlacements,
    transitionName: getTransitionName(rootPrefixCls, 'slide-up', props.transitionName),
    listHeight: listHeight,
    listItemHeight: listItemHeight,
    mode: mode,
    prefixCls: prefixCls,
    placement: memoPlacement,
    direction: direction,
    suffixIcon: suffixIcon,
    menuItemSelectedIcon: itemIcon,
    removeIcon: removeIcon,
    allowClear: mergedAllowClear,
    notFoundContent: mergedNotFound,
    className: mergedClassName,
    getPopupContainer: getPopupContainer || getContextPopupContainer,
    dropdownClassName: rcSelectRtlDropdownClassName,
    disabled: mergedDisabled
  })));
};
if (process.env.NODE_ENV !== 'production') {
  InternalSelect.displayName = 'Select';
}
const Select = /*#__PURE__*/React.forwardRef(InternalSelect);
// We don't care debug panel
/* istanbul ignore next */
const PurePanel = genPurePanel(Select);
Select.SECRET_COMBOBOX_MODE_DO_NOT_USE = SECRET_COMBOBOX_MODE_DO_NOT_USE;
Select.Option = Option;
Select.OptGroup = OptGroup;
Select._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;
if (process.env.NODE_ENV !== 'production') {
  Select.displayName = 'Select';
}
export default Select;