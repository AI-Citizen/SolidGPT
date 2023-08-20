'use client';

import classNames from 'classnames';
import toArray from "rc-util/es/Children/toArray";
import omit from "rc-util/es/omit";
import * as React from 'react';
import genPurePanel from '../_util/PurePanel';
import { isValidElement } from '../_util/reactNode';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import Select from '../select';
const {
  Option
} = Select;
function isSelectOptionOrSelectOptGroup(child) {
  return child && child.type && (child.type.isSelectOption || child.type.isSelectOptGroup);
}
const AutoComplete = (props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    popupClassName,
    dropdownClassName,
    children,
    dataSource
  } = props;
  const childNodes = toArray(children);
  // ============================= Input =============================
  let customizeInput;
  if (childNodes.length === 1 && isValidElement(childNodes[0]) && !isSelectOptionOrSelectOptGroup(childNodes[0])) {
    [customizeInput] = childNodes;
  }
  const getInputElement = customizeInput ? () => customizeInput : undefined;
  // ============================ Options ============================
  let optionChildren;
  // [Legacy] convert `children` or `dataSource` into option children
  if (childNodes.length && isSelectOptionOrSelectOptGroup(childNodes[0])) {
    optionChildren = children;
  } else {
    optionChildren = dataSource ? dataSource.map(item => {
      if (isValidElement(item)) {
        return item;
      }
      switch (typeof item) {
        case 'string':
          return /*#__PURE__*/React.createElement(Option, {
            key: item,
            value: item
          }, item);
        case 'object':
          {
            const {
              value: optionValue
            } = item;
            return /*#__PURE__*/React.createElement(Option, {
              key: optionValue,
              value: optionValue
            }, item.text);
          }
        default:
          process.env.NODE_ENV !== "production" ? warning(false, 'AutoComplete', '`dataSource` is only supports type `string[] | Object[]`.') : void 0;
          return undefined;
      }
    }) : [];
  }
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== "production" ? warning(!('dataSource' in props), 'AutoComplete', '`dataSource` is deprecated, please use `options` instead.') : void 0;
    process.env.NODE_ENV !== "production" ? warning(!customizeInput || !('size' in props), 'AutoComplete', 'You need to control style self instead of setting `size` when using customize input.') : void 0;
    process.env.NODE_ENV !== "production" ? warning(!dropdownClassName, 'AutoComplete', '`dropdownClassName` is deprecated, please use `popupClassName` instead.') : void 0;
  }
  const {
    getPrefixCls
  } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('select', customizePrefixCls);
  return /*#__PURE__*/React.createElement(Select, Object.assign({
    ref: ref,
    suffixIcon: null
  }, omit(props, ['dataSource', 'dropdownClassName']), {
    prefixCls: prefixCls,
    popupClassName: popupClassName || dropdownClassName,
    className: classNames(`${prefixCls}-auto-complete`, className),
    mode: Select.SECRET_COMBOBOX_MODE_DO_NOT_USE,
    // Internal api
    getInputElement
  }), optionChildren);
};
const RefAutoComplete = /*#__PURE__*/React.forwardRef(AutoComplete);
// We don't care debug panel
/* istanbul ignore next */
const PurePanel = genPurePanel(RefAutoComplete);
RefAutoComplete.Option = Option;
RefAutoComplete._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;
if (process.env.NODE_ENV !== 'production') {
  RefAutoComplete.displayName = 'AutoComplete';
}
export default RefAutoComplete;