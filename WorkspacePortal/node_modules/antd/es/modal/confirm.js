import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { render as reactRender, unmount as reactUnmount } from "rc-util/es/React/render";
import * as React from 'react';
import warning from '../_util/warning';
import { globalConfig, warnContext } from '../config-provider';
import ConfirmDialog from './ConfirmDialog';
import destroyFns from './destroyFns';
import { getConfirmLocale } from './locale';
let defaultRootPrefixCls = '';
function getRootPrefixCls() {
  return defaultRootPrefixCls;
}
export default function confirm(config) {
  // Warning if exist theme
  if (process.env.NODE_ENV !== 'production') {
    warnContext('Modal');
  }
  const container = document.createDocumentFragment();
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  let currentConfig = Object.assign(Object.assign({}, config), {
    close,
    open: true
  });
  let timeoutId;
  function destroy() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    const triggerCancel = args.some(param => param && param.triggerCancel);
    if (config.onCancel && triggerCancel) {
      config.onCancel.apply(config, [() => {}].concat(_toConsumableArray(args.slice(1))));
    }
    for (let i = 0; i < destroyFns.length; i++) {
      const fn = destroyFns[i];
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      if (fn === close) {
        destroyFns.splice(i, 1);
        break;
      }
    }
    reactUnmount(container);
  }
  function render(_a) {
    var {
        okText,
        cancelText,
        prefixCls: customizePrefixCls,
        getContainer
      } = _a,
      props = __rest(_a, ["okText", "cancelText", "prefixCls", "getContainer"]);
    clearTimeout(timeoutId);
    /**
     * https://github.com/ant-design/ant-design/issues/23623
     *
     * Sync render blocks React event. Let's make this async.
     */
    timeoutId = setTimeout(() => {
      const runtimeLocale = getConfirmLocale();
      const {
        getPrefixCls,
        getIconPrefixCls,
        getTheme
      } = globalConfig();
      // because Modal.config  set rootPrefixCls, which is different from other components
      const rootPrefixCls = getPrefixCls(undefined, getRootPrefixCls());
      const prefixCls = customizePrefixCls || `${rootPrefixCls}-modal`;
      const iconPrefixCls = getIconPrefixCls();
      const theme = getTheme();
      let mergedGetContainer = getContainer;
      if (mergedGetContainer === false) {
        mergedGetContainer = undefined;
        if (process.env.NODE_ENV !== 'production') {
          process.env.NODE_ENV !== "production" ? warning(false, 'Modal', 'Static method not support `getContainer` to be `false` since it do not have context env.') : void 0;
        }
      }
      reactRender( /*#__PURE__*/React.createElement(ConfirmDialog, Object.assign({}, props, {
        getContainer: mergedGetContainer,
        prefixCls: prefixCls,
        rootPrefixCls: rootPrefixCls,
        iconPrefixCls: iconPrefixCls,
        okText: okText,
        locale: runtimeLocale,
        theme: theme,
        cancelText: cancelText || runtimeLocale.cancelText
      })), container);
    });
  }
  function close() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    currentConfig = Object.assign(Object.assign({}, currentConfig), {
      open: false,
      afterClose: () => {
        if (typeof config.afterClose === 'function') {
          config.afterClose();
        }
        destroy.apply(this, args);
      }
    });
    // Legacy support
    if (currentConfig.visible) {
      delete currentConfig.visible;
    }
    render(currentConfig);
  }
  function update(configUpdate) {
    if (typeof configUpdate === 'function') {
      currentConfig = configUpdate(currentConfig);
    } else {
      currentConfig = Object.assign(Object.assign({}, currentConfig), configUpdate);
    }
    render(currentConfig);
  }
  render(currentConfig);
  destroyFns.push(close);
  return {
    destroy: close,
    update
  };
}
export function withWarn(props) {
  return Object.assign(Object.assign({}, props), {
    type: 'warning'
  });
}
export function withInfo(props) {
  return Object.assign(Object.assign({}, props), {
    type: 'info'
  });
}
export function withSuccess(props) {
  return Object.assign(Object.assign({}, props), {
    type: 'success'
  });
}
export function withError(props) {
  return Object.assign(Object.assign({}, props), {
    type: 'error'
  });
}
export function withConfirm(props) {
  return Object.assign(Object.assign({}, props), {
    type: 'confirm'
  });
}
export function modalGlobalConfig(_ref) {
  let {
    rootPrefixCls
  } = _ref;
  process.env.NODE_ENV !== "production" ? warning(false, 'Modal', 'Modal.config is deprecated. Please use ConfigProvider.config instead.') : void 0;
  defaultRootPrefixCls = rootPrefixCls;
}