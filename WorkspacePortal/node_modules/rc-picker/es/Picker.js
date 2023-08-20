import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";
import _extends from "@babel/runtime/helpers/esm/extends";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
/**
 * Removed:
 *  - getCalendarContainer: use `getPopupContainer` instead
 *  - onOk
 *
 * New Feature:
 *  - picker
 *  - allowEmpty
 *  - selectable
 *
 * Tips: Should add faq about `datetime` mode with `defaultValue`
 */

import classNames from 'classnames';
import useMergedState from "rc-util/es/hooks/useMergedState";
import warning from "rc-util/es/warning";
import pickAttrs from "rc-util/es/pickAttrs";
import * as React from 'react';
import useHoverValue from "./hooks/useHoverValue";
import usePickerInput from "./hooks/usePickerInput";
import usePresets from "./hooks/usePresets";
import useTextValueMapping from "./hooks/useTextValueMapping";
import useValueTexts from "./hooks/useValueTexts";
import PanelContext from "./PanelContext";
import PickerPanel from "./PickerPanel";
import PickerTrigger from "./PickerTrigger";
import PresetPanel from "./PresetPanel";
import { formatValue, isEqual, parseValue } from "./utils/dateUtil";
import { toArray } from "./utils/miscUtil";
import { elementsContains, getDefaultFormat, getInputSize } from "./utils/uiUtil";
import { legacyPropsWarning } from "./utils/warnUtil";
import { getClearIcon } from "./utils/getClearIcon";

// TMP type to fit for ts 3.9.2

function InnerPicker(props) {
  var _classNames2;
  var _ref = props,
    _ref$prefixCls = _ref.prefixCls,
    prefixCls = _ref$prefixCls === void 0 ? 'rc-picker' : _ref$prefixCls,
    id = _ref.id,
    name = _ref.name,
    tabIndex = _ref.tabIndex,
    style = _ref.style,
    className = _ref.className,
    dropdownClassName = _ref.dropdownClassName,
    dropdownAlign = _ref.dropdownAlign,
    popupStyle = _ref.popupStyle,
    transitionName = _ref.transitionName,
    generateConfig = _ref.generateConfig,
    locale = _ref.locale,
    inputReadOnly = _ref.inputReadOnly,
    allowClear = _ref.allowClear,
    autoFocus = _ref.autoFocus,
    showTime = _ref.showTime,
    _ref$picker = _ref.picker,
    picker = _ref$picker === void 0 ? 'date' : _ref$picker,
    format = _ref.format,
    use12Hours = _ref.use12Hours,
    value = _ref.value,
    defaultValue = _ref.defaultValue,
    presets = _ref.presets,
    open = _ref.open,
    defaultOpen = _ref.defaultOpen,
    defaultOpenValue = _ref.defaultOpenValue,
    suffixIcon = _ref.suffixIcon,
    clearIcon = _ref.clearIcon,
    disabled = _ref.disabled,
    disabledDate = _ref.disabledDate,
    placeholder = _ref.placeholder,
    getPopupContainer = _ref.getPopupContainer,
    pickerRef = _ref.pickerRef,
    panelRender = _ref.panelRender,
    onChange = _ref.onChange,
    onOpenChange = _ref.onOpenChange,
    onFocus = _ref.onFocus,
    onBlur = _ref.onBlur,
    onMouseDown = _ref.onMouseDown,
    onMouseUp = _ref.onMouseUp,
    onMouseEnter = _ref.onMouseEnter,
    onMouseLeave = _ref.onMouseLeave,
    onContextMenu = _ref.onContextMenu,
    onClick = _ref.onClick,
    _onKeyDown = _ref.onKeyDown,
    _onSelect = _ref.onSelect,
    direction = _ref.direction,
    _ref$autoComplete = _ref.autoComplete,
    autoComplete = _ref$autoComplete === void 0 ? 'off' : _ref$autoComplete,
    inputRender = _ref.inputRender,
    changeOnBlur = _ref.changeOnBlur;
  var inputRef = React.useRef(null);
  var needConfirmButton = picker === 'date' && !!showTime || picker === 'time';
  var presetList = usePresets(presets);

  // ============================ Warning ============================
  if (process.env.NODE_ENV !== 'production') {
    legacyPropsWarning(props);
  }

  // ============================= State =============================
  var formatList = toArray(getDefaultFormat(format, picker, showTime, use12Hours));

  // Panel ref
  var panelDivRef = React.useRef(null);
  var inputDivRef = React.useRef(null);
  var containerRef = React.useRef(null);

  // Real value
  var _useMergedState = useMergedState(null, {
      value: value,
      defaultValue: defaultValue
    }),
    _useMergedState2 = _slicedToArray(_useMergedState, 2),
    mergedValue = _useMergedState2[0],
    setInnerValue = _useMergedState2[1];

  // Selected value
  var _React$useState = React.useState(mergedValue),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    selectedValue = _React$useState2[0],
    setSelectedValue = _React$useState2[1];

  // Operation ref
  var operationRef = React.useRef(null);

  // Open
  var _useMergedState3 = useMergedState(false, {
      value: open,
      defaultValue: defaultOpen,
      postState: function postState(postOpen) {
        return disabled ? false : postOpen;
      },
      onChange: function onChange(newOpen) {
        if (onOpenChange) {
          onOpenChange(newOpen);
        }
        if (!newOpen && operationRef.current && operationRef.current.onClose) {
          operationRef.current.onClose();
        }
      }
    }),
    _useMergedState4 = _slicedToArray(_useMergedState3, 2),
    mergedOpen = _useMergedState4[0],
    triggerInnerOpen = _useMergedState4[1];

  // ============================= Text ==============================
  var _useValueTexts = useValueTexts(selectedValue, {
      formatList: formatList,
      generateConfig: generateConfig,
      locale: locale
    }),
    _useValueTexts2 = _slicedToArray(_useValueTexts, 2),
    valueTexts = _useValueTexts2[0],
    firstValueText = _useValueTexts2[1];
  var _useTextValueMapping = useTextValueMapping({
      valueTexts: valueTexts,
      onTextChange: function onTextChange(newText) {
        var inputDate = parseValue(newText, {
          locale: locale,
          formatList: formatList,
          generateConfig: generateConfig
        });
        if (inputDate && (!disabledDate || !disabledDate(inputDate))) {
          setSelectedValue(inputDate);
        }
      }
    }),
    _useTextValueMapping2 = _slicedToArray(_useTextValueMapping, 3),
    text = _useTextValueMapping2[0],
    triggerTextChange = _useTextValueMapping2[1],
    resetText = _useTextValueMapping2[2];

  // ============================ Trigger ============================
  var triggerChange = function triggerChange(newValue) {
    setSelectedValue(newValue);
    setInnerValue(newValue);
    if (onChange && !isEqual(generateConfig, mergedValue, newValue)) {
      onChange(newValue, newValue ? formatValue(newValue, {
        generateConfig: generateConfig,
        locale: locale,
        format: formatList[0]
      }) : '');
    }
  };
  var triggerOpen = function triggerOpen(newOpen) {
    if (disabled && newOpen) {
      return;
    }
    triggerInnerOpen(newOpen);
  };
  var forwardKeyDown = function forwardKeyDown(e) {
    if (mergedOpen && operationRef.current && operationRef.current.onKeyDown) {
      // Let popup panel handle keyboard
      return operationRef.current.onKeyDown(e);
    }

    /* istanbul ignore next */
    /* eslint-disable no-lone-blocks */
    {
      warning(false, 'Picker not correct forward KeyDown operation. Please help to fire issue about this.');
      return false;
    }
  };
  var onInternalClick = function onInternalClick() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    onClick === null || onClick === void 0 ? void 0 : onClick.apply(void 0, args);
    if (inputRef.current) {
      inputRef.current.focus();
      triggerOpen(true);
    }
  };

  // ============================= Input =============================
  var onInternalBlur = function onInternalBlur(e) {
    if (changeOnBlur) {
      triggerChange(selectedValue);
    }
    onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
  };
  var _usePickerInput = usePickerInput({
      blurToCancel: needConfirmButton,
      open: mergedOpen,
      value: text,
      triggerOpen: triggerOpen,
      forwardKeyDown: forwardKeyDown,
      isClickOutside: function isClickOutside(target) {
        return !elementsContains([panelDivRef.current, inputDivRef.current, containerRef.current], target);
      },
      onSubmit: function onSubmit() {
        if (
        // When user typing disabledDate with keyboard and enter, this value will be empty
        !selectedValue ||
        // Normal disabled check
        disabledDate && disabledDate(selectedValue)) {
          return false;
        }
        triggerChange(selectedValue);
        triggerOpen(false);
        resetText();
        return true;
      },
      onCancel: function onCancel() {
        triggerOpen(false);
        setSelectedValue(mergedValue);
        resetText();
      },
      onKeyDown: function onKeyDown(e, preventDefault) {
        _onKeyDown === null || _onKeyDown === void 0 ? void 0 : _onKeyDown(e, preventDefault);
      },
      onFocus: onFocus,
      onBlur: onInternalBlur,
      changeOnBlur: changeOnBlur
    }),
    _usePickerInput2 = _slicedToArray(_usePickerInput, 2),
    inputProps = _usePickerInput2[0],
    _usePickerInput2$ = _usePickerInput2[1],
    focused = _usePickerInput2$.focused,
    typing = _usePickerInput2$.typing;

  // ============================= Sync ==============================
  // Close should sync back with text value
  React.useEffect(function () {
    if (!mergedOpen) {
      setSelectedValue(mergedValue);
      if (!valueTexts.length || valueTexts[0] === '') {
        triggerTextChange('');
      } else if (firstValueText !== text) {
        resetText();
      }
    }
  }, [mergedOpen, valueTexts]);

  // Change picker should sync back with text value
  React.useEffect(function () {
    if (!mergedOpen) {
      resetText();
    }
  }, [picker]);

  // Sync innerValue with control mode
  React.useEffect(function () {
    // Sync select value
    setSelectedValue(mergedValue);
  }, [mergedValue]);

  // ============================ Private ============================
  if (pickerRef) {
    pickerRef.current = {
      focus: function focus() {
        var _inputRef$current;
        (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : _inputRef$current.focus();
      },
      blur: function blur() {
        var _inputRef$current2;
        (_inputRef$current2 = inputRef.current) === null || _inputRef$current2 === void 0 ? void 0 : _inputRef$current2.blur();
      }
    };
  }
  var _useHoverValue = useHoverValue(text, {
      formatList: formatList,
      generateConfig: generateConfig,
      locale: locale
    }),
    _useHoverValue2 = _slicedToArray(_useHoverValue, 3),
    hoverValue = _useHoverValue2[0],
    onEnter = _useHoverValue2[1],
    onLeave = _useHoverValue2[2];

  // ============================= Panel =============================
  var panelProps = _objectSpread(_objectSpread({}, props), {}, {
    className: undefined,
    style: undefined,
    pickerValue: undefined,
    onPickerValueChange: undefined,
    onChange: null
  });
  var panelNode = /*#__PURE__*/React.createElement("div", {
    className: "".concat(prefixCls, "-panel-layout")
  }, /*#__PURE__*/React.createElement(PresetPanel, {
    prefixCls: prefixCls,
    presets: presetList,
    onClick: function onClick(nextValue) {
      triggerChange(nextValue);
      triggerOpen(false);
    }
  }), /*#__PURE__*/React.createElement(PickerPanel, _extends({}, panelProps, {
    generateConfig: generateConfig,
    className: classNames(_defineProperty({}, "".concat(prefixCls, "-panel-focused"), !typing)),
    value: selectedValue,
    locale: locale,
    tabIndex: -1,
    onSelect: function onSelect(date) {
      _onSelect === null || _onSelect === void 0 ? void 0 : _onSelect(date);
      setSelectedValue(date);
    },
    direction: direction,
    onPanelChange: function onPanelChange(viewDate, mode) {
      var onPanelChange = props.onPanelChange;
      onLeave(true);
      onPanelChange === null || onPanelChange === void 0 ? void 0 : onPanelChange(viewDate, mode);
    }
  })));
  if (panelRender) {
    panelNode = panelRender(panelNode);
  }
  var panel = /*#__PURE__*/React.createElement("div", {
    className: "".concat(prefixCls, "-panel-container"),
    ref: panelDivRef,
    onMouseDown: function onMouseDown(e) {
      e.preventDefault();
    }
  }, panelNode);
  var suffixNode;
  if (suffixIcon) {
    suffixNode = /*#__PURE__*/React.createElement("span", {
      className: "".concat(prefixCls, "-suffix"),
      onMouseDown: function onMouseDown(e) {
        // Not lost focus
        e.preventDefault();
      }
    }, suffixIcon);
  }

  // ============================ Clear ============================
  if (process.env.NODE_ENV !== 'production') {
    warning(!props.clearIcon, '`clearIcon` will be removed in future. Please use `allowClear` instead.');
  }
  var mergedClearIcon = getClearIcon(prefixCls, allowClear, clearIcon);
  var clearNode = /*#__PURE__*/React.createElement("span", {
    onMouseDown: function onMouseDown(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    onMouseUp: function onMouseUp(e) {
      e.preventDefault();
      e.stopPropagation();
      triggerChange(null);
      triggerOpen(false);
    },
    className: "".concat(prefixCls, "-clear"),
    role: "button"
  }, mergedClearIcon);
  var mergedAllowClear = !!allowClear && mergedValue && !disabled;
  var mergedInputProps = _objectSpread(_objectSpread(_objectSpread({
    id: id,
    tabIndex: tabIndex,
    disabled: disabled,
    readOnly: inputReadOnly || typeof formatList[0] === 'function' || !typing,
    value: hoverValue || text,
    onChange: function onChange(e) {
      triggerTextChange(e.target.value);
    },
    autoFocus: autoFocus,
    placeholder: placeholder,
    ref: inputRef,
    title: text
  }, inputProps), {}, {
    size: getInputSize(picker, formatList[0], generateConfig),
    name: name
  }, pickAttrs(props, {
    aria: true,
    data: true
  })), {}, {
    autoComplete: autoComplete
  });
  var inputNode = inputRender ? inputRender(mergedInputProps) : /*#__PURE__*/React.createElement("input", mergedInputProps);

  // ============================ Warning ============================
  if (process.env.NODE_ENV !== 'production') {
    warning(!defaultOpenValue, '`defaultOpenValue` may confuse user for the current value status. Please use `defaultValue` instead.');
  }

  // ============================ Return =============================
  var onContextSelect = function onContextSelect(date, type) {
    if (type === 'submit' || type !== 'key' && !needConfirmButton) {
      // triggerChange will also update selected values
      triggerChange(date);
      triggerOpen(false);
    }
  };
  var popupPlacement = direction === 'rtl' ? 'bottomRight' : 'bottomLeft';
  return /*#__PURE__*/React.createElement(PanelContext.Provider, {
    value: {
      operationRef: operationRef,
      hideHeader: picker === 'time',
      onSelect: onContextSelect,
      open: mergedOpen,
      defaultOpenValue: defaultOpenValue,
      onDateMouseEnter: onEnter,
      onDateMouseLeave: onLeave
    }
  }, /*#__PURE__*/React.createElement(PickerTrigger, {
    visible: mergedOpen,
    popupElement: panel,
    popupStyle: popupStyle,
    prefixCls: prefixCls,
    dropdownClassName: dropdownClassName,
    dropdownAlign: dropdownAlign,
    getPopupContainer: getPopupContainer,
    transitionName: transitionName,
    popupPlacement: popupPlacement,
    direction: direction
  }, /*#__PURE__*/React.createElement("div", {
    ref: containerRef,
    className: classNames(prefixCls, className, (_classNames2 = {}, _defineProperty(_classNames2, "".concat(prefixCls, "-disabled"), disabled), _defineProperty(_classNames2, "".concat(prefixCls, "-focused"), focused), _defineProperty(_classNames2, "".concat(prefixCls, "-rtl"), direction === 'rtl'), _classNames2)),
    style: style,
    onMouseDown: onMouseDown,
    onMouseUp: onMouseUp,
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave,
    onContextMenu: onContextMenu,
    onClick: onInternalClick
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames("".concat(prefixCls, "-input"), _defineProperty({}, "".concat(prefixCls, "-input-placeholder"), !!hoverValue)),
    ref: inputDivRef
  }, inputNode, suffixNode, mergedAllowClear && clearNode))));
}

// Wrap with class component to enable pass generic with instance method
var Picker = /*#__PURE__*/function (_React$Component) {
  _inherits(Picker, _React$Component);
  var _super = _createSuper(Picker);
  function Picker() {
    var _this;
    _classCallCheck(this, Picker);
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "pickerRef", /*#__PURE__*/React.createRef());
    _defineProperty(_assertThisInitialized(_this), "focus", function () {
      if (_this.pickerRef.current) {
        _this.pickerRef.current.focus();
      }
    });
    _defineProperty(_assertThisInitialized(_this), "blur", function () {
      if (_this.pickerRef.current) {
        _this.pickerRef.current.blur();
      }
    });
    return _this;
  }
  _createClass(Picker, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(InnerPicker, _extends({}, this.props, {
        pickerRef: this.pickerRef
      }));
    }
  }]);
  return Picker;
}(React.Component);
export default Picker;